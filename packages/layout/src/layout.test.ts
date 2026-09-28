import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { Edge, IdentityKey, Survey } from '@portolan/model';
import {
  BASE_RADIUS,
  emptySurvey,
  networkKey,
  nodeKey,
  replicatedTaskKey,
  reservationRadius,
  serviceKey,
  stackKey,
  volumeKey,
} from '@portolan/model';
import { describe, expect, it } from 'vitest';

import type { Mode, Placement, Positions } from './index.ts';
import {
  DEFAULT_MODE,
  isDisjoint,
  layout,
  layoutInvocations,
  placementsOf,
  relax,
  resetInvocations,
  retainedOf,
} from './index.ts';

/**
 * The matrix rows a determinism test cannot reach, the echo/original distinction, the
 * hull-overlap floor, and AD-8's ban asserted over the stage's own sources.
 *
 * The determinism property is `layout.determinism.test.ts`'s, because the `determinism`
 * filename infix is what CI's two-architecture matrix filters on; stability is
 * `layout.stability.test.ts`'s, because it is a second property and neither substitutes for
 * the other.
 */

// --- A synthetic cluster ----------------------------------------------------

export interface ServiceSpec {
  readonly stack: string;
  readonly name: string;
  readonly id: string;
  readonly slots: number;
  readonly networks: readonly string[];
  readonly volumes: readonly string[];
}

export interface ClusterSpec {
  readonly nodes: readonly string[];
  readonly networks: readonly string[];
  readonly volumes: readonly string[];
  readonly services: readonly ServiceSpec[];
  /**
   * What every container ID is built from.
   *
   * A `docker stack deploy` destroys and recreates every task with a new container ID and
   * the same slot, so bumping this and nothing else is exactly the redeployment AD-5 and
   * AD-6 exist for — and a correct layout moves nothing at all.
   */
  readonly generation: string;
}

export const cluster = (spec: ClusterSpec): Survey => {
  const edges: Edge[] = [];
  const stacks = [...new Set(spec.services.map((service) => service.stack))].sort();
  const containers = spec.services.flatMap((service) =>
    Array.from({ length: service.slots }, (_unused, index) => {
      const slot = index + 1;
      const key = replicatedTaskKey(service.stack, service.name, slot);
      edges.push({ kind: 'runs', from: serviceKey(service.id), to: key });
      edges.push({
        kind: 'hosts',
        from: nodeKey(spec.nodes[index % spec.nodes.length] ?? 'n1'),
        to: key,
      });
      for (const network of service.networks) {
        edges.push({ kind: 'attachment', from: key, to: networkKey(network) });
      }
      for (const volume of service.volumes) {
        edges.push({ kind: 'mount', from: key, to: volumeKey(volume), path: '/d', access: 'rw' });
      }
      return {
        kind: 'container' as const,
        key,
        id: `${spec.generation}-${service.stack}-${service.name}-${slot}`,
        name: `${service.stack}_${service.name}.${slot}`,
        image: 'nginx:1.25-alpine',
        desiredState: 'running' as const,
        state: 'running' as const,
      };
    }),
  );

  for (const service of spec.services) {
    edges.push({ kind: 'groups', from: stackKey(service.stack), to: serviceKey(service.id) });
    for (const network of service.networks) {
      edges.push({ kind: 'attachment', from: serviceKey(service.id), to: networkKey(network) });
    }
  }
  spec.volumes.forEach((volume, index) => {
    edges.push({
      kind: 'hosts',
      from: nodeKey(spec.nodes[index % spec.nodes.length] ?? 'n1'),
      to: volumeKey(volume),
    });
  });

  return {
    takenAt: '2026-09-16T09:00:00Z',
    nodes: spec.nodes.map((id) => ({
      kind: 'node' as const,
      key: nodeKey(id),
      id,
      name: id,
      role: 'worker' as const,
      address: '10.0.0.1',
      availability: 'active' as const,
      state: 'ready' as const,
    })),
    networks: spec.networks.map((name) => ({
      kind: 'network' as const,
      key: networkKey(name),
      name,
      subnets: ['10.1.0.0/24'],
      createdAt: '2026-01-01T00:00:00Z',
    })),
    volumes: spec.volumes.map((name) => ({ kind: 'volume' as const, key: volumeKey(name), name })),
    stacks: stacks.map((name) => ({ kind: 'stack' as const, key: stackKey(name), name })),
    services: spec.services.map((service) => ({
      kind: 'service' as const,
      key: serviceKey(service.id),
      id: service.id,
      name: service.name,
      mode: 'replicated' as const,
      health: { running: service.slots, desired: service.slots },
    })),
    containers,
    edges,
  };
};

export const REFERENCE: ClusterSpec = {
  generation: 'g1',
  nodes: ['n1', 'n2', 'n3'],
  networks: ['frontend', 'backend', 'pgnet'],
  volumes: ['pgdata', 'pg-data', 'logs'],
  services: [
    {
      stack: 'blog',
      name: 'web',
      id: 'svcweb',
      slots: 3,
      networks: ['frontend', 'backend'],
      volumes: ['logs'],
    },
    {
      stack: 'blog',
      name: 'api',
      id: 'svcapi',
      slots: 2,
      networks: ['backend'],
      volumes: [],
    },
    {
      stack: 'infra',
      name: 'pg',
      id: 'svcpg',
      slots: 2,
      networks: ['backend', 'pgnet'],
      volumes: ['pgdata', 'pg-data'],
    },
    {
      stack: 'infra',
      name: 'lonely',
      id: 'svclonely',
      slots: 1,
      networks: [],
      volumes: [],
    },
  ],
};

/** Every inhabitant of `Mode`, so no combination is left unexercised. */
export const MODES: readonly (readonly [string, Mode])[] = [
  ['blended zones', { zoneMode: 'blended', nodeBackdrop: false }],
  ['disjoint zones', { zoneMode: 'disjoint', nodeBackdrop: false }],
  ['node backdrop', { zoneMode: 'blended', nodeBackdrop: true }],
  ['disjoint zones under the node backdrop', { zoneMode: 'disjoint', nodeBackdrop: true }],
];

const SEED = 20260916;

const bodies = (positions: Positions): readonly Placement[] =>
  positions.placements.filter((placement) => placement.radius > 0);

const keysOf = (placements: readonly Placement[]): readonly IdentityKey[] => [
  ...new Set(placements.map((placement) => placement.key)),
];

// --- The matrix -------------------------------------------------------------

describe('the layout places what the survey holds', () => {
  it.each(MODES)('places every body exactly once in %s, and nothing else', (_name, mode) => {
    const survey = cluster(REFERENCE);
    const positions = layout(survey, undefined, SEED, mode);
    const expected = [
      ...survey.services.map((object) => object.key),
      ...survey.containers.map((object) => object.key),
      ...survey.volumes.map((object) => object.key),
    ].sort();
    expect([...keysOf(bodies(positions))].sort()).toEqual(expected);
    // A stack's position is DERIVED (FR-82): the outline follows its members and never
    // asks for a position, so no stack is ever placed.
    for (const placement of positions.placements) expect(placement.key).not.toMatch(/^stack:/);
  });

  it('reserves the radius `model` computes, and recomputes none of it (AD-38)', () => {
    const positions = layout(cluster(REFERENCE), undefined, SEED, DEFAULT_MODE);
    for (const placement of bodies(positions)) {
      const kind = placement.key.slice(0, placement.key.indexOf(':')) as keyof typeof BASE_RADIUS;
      expect(placement.radius).toBe(reservationRadius(BASE_RADIUS[kind]));
    }
  });

  it('anchors whichever partition owns position, and only that one (FR-41)', () => {
    // Only one mark may own position on a surface. With the backdrop off the networks
    // anchor and the nodes do not; with it on, the other way round.
    const zoned = layout(cluster(REFERENCE), undefined, SEED, DEFAULT_MODE);
    const zoneAnchors = zoned.placements.filter((placement) => placement.radius === 0);
    expect([...keysOf(zoneAnchors)].sort()).toEqual(
      ['frontend', 'backend', 'pgnet'].map(networkKey).sort(),
    );

    const backdrop = layout(cluster(REFERENCE), undefined, SEED, {
      zoneMode: 'blended',
      nodeBackdrop: true,
    });
    const nodeAnchors = backdrop.placements.filter((placement) => placement.radius === 0);
    expect([...keysOf(nodeAnchors)].sort()).toEqual(['n1', 'n2', 'n3'].map(nodeKey).sort());
  });

  it('lays out an empty survey without throwing, and places nothing', () => {
    const positions = layout(emptySurvey('2026-09-16T09:00:00Z'), undefined, SEED, DEFAULT_MODE);
    expect(positions.placements).toEqual([]);
    expect(positions.retained).toEqual([]);
  });

  it('gives identical positions for a survey whose collections arrive in any order', () => {
    // AD-7: Docker guarantees no ordering on its `list` calls and a model's collections are
    // not sorted by construction, so a layout that iterated arrival order would reshuffle
    // an unchanged cluster between two surveys and pass every determinism test.
    const sorted = cluster(REFERENCE);
    const shuffled: Survey = {
      ...sorted,
      nodes: [...sorted.nodes].reverse(),
      networks: [...sorted.networks].reverse(),
      volumes: [...sorted.volumes].reverse(),
      stacks: [...sorted.stacks].reverse(),
      services: [...sorted.services].reverse(),
      containers: [...sorted.containers].reverse(),
      edges: [...sorted.edges].reverse(),
    };
    for (const [, mode] of MODES) {
      expect(JSON.stringify(layout(shuffled, undefined, SEED, mode))).toBe(
        JSON.stringify(layout(sorted, undefined, SEED, mode)),
      );
    }
  });

  it('answers nothing for a key the survey does not contain, and does not throw', () => {
    // A WELL-FORMED key the survey does not contain — picking sends identity keys upward
    // (AD-36), so the case is a subject that vanished between the click and the lookup,
    // never a malformed string.
    const positions = layout(cluster(REFERENCE), undefined, SEED, DEFAULT_MODE);
    expect(placementsOf(positions, volumeKey('absent'))).toEqual([]);
    expect(placementsOf(positions, replicatedTaskKey('blog', 'web', 99))).toEqual([]);
    expect(retainedOf(positions, volumeKey('absent'))).toEqual([]);
  });
});

describe('two reserved hulls never intersect (FR-13)', () => {
  it.each(MODES)('holds over every pair in %s, echoes included', (_name, mode) => {
    const positions = layout(cluster(REFERENCE), undefined, SEED, mode);
    expect(isDisjoint(positions.placements)).toBe(true);
    // And against the retained cells too, which are space that is not free.
    expect(isDisjoint([...positions.placements, ...positions.retained])).toBe(true);
  });

  it('holds at the maximum density step, because that is where it was reserved', () => {
    // The reserved radius already carries `density.scale`'s roomiest step and the deform
    // cap on every bearing — see `model`'s `reservationRadius`. The check that matters is
    // therefore that the reserved radius is the one in the placements, which the row above
    // asserts, plus that it is bigger than the body ever drawn inside it.
    const positions = layout(cluster(REFERENCE), undefined, SEED, DEFAULT_MODE);
    for (const placement of bodies(positions)) {
      const kind = placement.key.slice(0, placement.key.indexOf(':')) as keyof typeof BASE_RADIUS;
      // `density.scale`'s roomiest step is 1.20, so the body at its largest is `1.2·r`; the
      // reserved disc has to be bigger than that before the deform or the clearance is even
      // counted, or density would be a fourth relayout action.
      expect(placement.radius).toBeGreaterThan(BASE_RADIUS[kind] * 1.2);
    }
  });

  it('holds over a sweep of differently shaped clusters, in every mode', () => {
    // One fixture proves the arrangement disjoint for one shape. FR-13 is a claim about
    // every cluster, and the shapes that stress it are the crowded ones: many replicas of
    // one service, all on one network, on one node.
    for (let shape = 0; shape < 12; shape += 1) {
      const spec: ClusterSpec = {
        generation: `g${shape}`,
        nodes: ['n1', 'n2'].slice(0, (shape % 2) + 1),
        networks: ['frontend', 'backend', 'pgnet'].slice(0, (shape % 3) + 1),
        volumes: ['pgdata', 'logs'].slice(0, shape % 3),
        services: [
          {
            stack: 'blog',
            name: 'web',
            id: 'svcweb',
            slots: 1 + ((shape * 3) % 17),
            networks: ['frontend'].slice(0, shape % 2),
            volumes: ['pgdata'].slice(0, shape % 2),
          },
          {
            stack: 'blog',
            name: 'api',
            id: 'svcapi',
            slots: 1 + (shape % 5),
            networks: ['backend', 'frontend'].slice(0, shape % 3),
            volumes: [],
          },
        ],
      };
      for (const [, mode] of MODES) {
        const positions = layout(cluster(spec), undefined, shape, mode);
        expect(isDisjoint(positions.placements)).toBe(true);
      }
    }
  });

  it('would report an intersection if one happened', () => {
    // Mutation check on the predicate: two cells laid on top of each other must be caught,
    // or the rows above pass whatever the arrangement does.
    expect(
      isDisjoint([
        { x: 0, y: 0, radius: 10 },
        { x: 1, y: 0, radius: 10 },
      ]),
    ).toBe(false);
  });
});

describe('one key, one or more placements — exactly one original (FR-40)', () => {
  it('draws a multi-network object once per zone in disjoint mode', () => {
    const survey = cluster(REFERENCE);
    const positions = layout(survey, undefined, SEED, {
      zoneMode: 'disjoint',
      nodeBackdrop: false,
    });
    // `blog/web/1` is attached to `frontend` and to `backend`: one original, one echo.
    const web = placementsOf(positions, replicatedTaskKey('blog', 'web', 1));
    expect(web).toHaveLength(2);
    expect(web.filter((placement) => placement.original)).toHaveLength(1);
    expect([...web].map((placement) => placement.zone).sort()).toEqual(
      [networkKey('backend'), networkKey('frontend')].sort(),
    );
  });

  it('gives every placed body exactly one original, in every mode', () => {
    for (const [, mode] of MODES) {
      const positions = layout(cluster(REFERENCE), undefined, SEED, mode);
      for (const key of keysOf(bodies(positions))) {
        const drawn = placementsOf(positions, key).filter((placement) => placement.radius > 0);
        expect(drawn.filter((placement) => placement.original)).toHaveLength(1);
      }
    }
  });

  it('draws one placement per body in blended mode and under the backdrop', () => {
    for (const mode of [DEFAULT_MODE, { zoneMode: 'disjoint', nodeBackdrop: true } as const]) {
      const positions = layout(cluster(REFERENCE), undefined, SEED, mode);
      for (const key of keysOf(bodies(positions))) {
        // An echo exists because two disjoint blobs cannot both hold one object. With
        // blended fields one drawing carries every zone, and with the backdrop on the
        // blobs place nothing — so neither mode produces a second copy.
        expect(placementsOf(positions, key).filter((p) => p.radius > 0)).toHaveLength(1);
      }
    }
  });

  it('puts an object with no network on the orphan rung, not in a zone', () => {
    const positions = layout(cluster(REFERENCE), undefined, SEED, DEFAULT_MODE);
    const lonely = placementsOf(positions, replicatedTaskKey('infra', 'lonely', 1));
    expect(lonely).toHaveLength(1);
    expect(lonely[0]?.zone).toBeNull();
  });
});

describe('the node backdrop partitions by node (FR-41)', () => {
  it('places every body nearer its own node than any other', () => {
    const survey = cluster(REFERENCE);
    const mode: Mode = { zoneMode: 'blended', nodeBackdrop: true };
    const positions = layout(survey, undefined, SEED, mode);
    const anchors = new Map(
      positions.placements
        .filter((placement) => placement.radius === 0)
        .map((placement) => [placement.key, placement]),
    );
    const hostOf = new Map<IdentityKey, IdentityKey>();
    for (const edge of survey.edges) if (edge.kind === 'hosts') hostOf.set(edge.to, edge.from);

    for (const placement of bodies(positions)) {
      const host = hostOf.get(placement.key);
      if (host === undefined) continue;
      const distance = (anchor: Placement): number =>
        (placement.x - anchor.x) ** 2 + (placement.y - anchor.y) ** 2;
      const own = anchors.get(host);
      expect(own).toBeDefined();
      if (own === undefined) continue;
      for (const [key, anchor] of anchors) {
        if (key === host) continue;
        expect(distance(own)).toBeLessThan(distance(anchor));
      }
    }
  });

  it('keeps naming the zone, because the backdrop takes the channel and not the zone', () => {
    const positions = layout(cluster(REFERENCE), undefined, SEED, {
      zoneMode: 'blended',
      nodeBackdrop: true,
    });
    const web = placementsOf(positions, replicatedTaskKey('blog', 'web', 1));
    expect(web[0]?.zone).not.toBeNull();
  });
});

describe('AD-3’s invocation counter', () => {
  it('counts one call per call and nothing else', () => {
    resetInvocations();
    expect(layoutInvocations()).toBe(0);
    const survey = cluster(REFERENCE);
    const first = layout(survey, undefined, SEED, DEFAULT_MODE);
    expect(layoutInvocations()).toBe(1);
    const second = layout(survey, first, SEED, DEFAULT_MODE);
    expect(layoutInvocations()).toBe(2);
    // Reading the answer is not calling the stage. Every interaction AD-3 names — filter,
    // select, search, hover, panel, text size, density, masking, palette — reaches the map
    // through reads like these and through nothing else.
    placementsOf(second, replicatedTaskKey('blog', 'web', 1));
    retainedOf(second, volumeKey('logs'));
    expect(layoutInvocations()).toBe(2);
    resetInvocations();
    expect(layoutInvocations()).toBe(0);
  });
});

// --- The ban, over the stage's own sources (AD-8) ---------------------------

const SOURCES = fileURLToPath(new URL('.', import.meta.url));

const sourceFiles = readdirSync(SOURCES)
  .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  .sort();

/**
 * The file with its comments and string literals removed, so prose about `+32%` or about
 * `Math.cos` is not read as code. Crude by design — it only has to be right about this
 * package's own sources, and a parser would be a dependency.
 *
 * ALL THREE QUOTE STYLES, because the claim is *string literals*, not *the quote style the
 * formatter happens to produce today*: a double-quoted `"Date"` added later would otherwise
 * fail the ban with no banned construct present, and a check that fails on nothing is worse
 * than no check.
 */
const codeOf = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1 ')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');

describe('the stage’s arithmetic is `+ - * /` and `Math.sqrt` (AD-8)', () => {
  it('reads every source file of the package, so the ban cannot be checked on nothing', () => {
    expect(sourceFiles).toEqual([
      'anchors.ts',
      'arrange.ts',
      'index.ts',
      'invocations.ts',
      'relax.ts',
      'retain.ts',
      'space.ts',
    ]);
  });

  it.each(
    sourceFiles.map((name) => [name, codeOf(readFileSync(`${SOURCES}${name}`, 'utf8'))] as const),
  )('uses no banned construct in %s', (_name, code) => {
    // `Math.random` and every clock read.
    expect(code).not.toMatch(/Math\s*\.\s*random/);
    expect(code).not.toMatch(/\bDate\b/);
    expect(code).not.toMatch(/\bperformance\b/);
    expect(code).not.toMatch(/requestAnimationFrame|setTimeout|setInterval/);
    // Every transcendental, by naming what IS allowed rather than what is not: a list of
    // banned names is a list someone has to keep complete, and `Math.cbrt` would not be on
    // it. `Math.sqrt` is the only member AD-8 permits.
    for (const [, member] of code.matchAll(/Math\s*\.\s*(\w+)/g)) expect(member).toBe('sqrt');
    // `**` is `Math.pow` spelt differently, and `%` is neither in AD-8's list; both are
    // avoidable here and avoided, so the ban reads as written.
    expect(code).not.toMatch(/\*\*/);
    expect(code).not.toMatch(/[^%]%[^%]/);
  });

  it('would report a banned construct if one were added', () => {
    // Mutation check on the reader itself: a file that really did read a clock must fail.
    expect(codeOf('const t = Date.now();')).toMatch(/\bDate\b/);
    expect([...codeOf('const a = Math.cos(1);').matchAll(/Math\s*\.\s*(\w+)/g)][0]?.[1]).toBe(
      'cos',
    );
    // And that a comment mentioning the banned thing does NOT fail, or the check would be
    // unusable in a package whose headers argue about `Math.cos` at length.
    expect(codeOf('// AD-8 bans Math.cos, deliberately.\nconst a = 1;')).not.toMatch(/Math/);
    // Nor does a string literal naming one — in any of the three quote styles, because the
    // claim is *string literals* and not *the style the formatter happens to produce today*.
    for (const quoted of [
      "const a = 'Math.cos % Date';",
      'const a = "Math.cos % Date";',
      'const a = `Math.cos % Date`;',
    ]) {
      const stripped = codeOf(quoted);
      expect(stripped).not.toMatch(/Math/);
      expect(stripped).not.toMatch(/\bDate\b/);
      expect(stripped).not.toMatch(/[^%]%[^%]/);
    }
  });
});

describe('the relaxation is Jacobi, and that is what buys order-independence', () => {
  it('resolves a permuted body list to the permuted answer', () => {
    // Every pass computes the whole displacement field from the positions at the START of
    // the pass, so no body ever sees another's half-updated position. Permuting the input
    // and inverting the permutation on the output must therefore give the same arrangement:
    // a Gauss-Seidel loop — one that applied each shift as it computed it — would not, and
    // the golden digests would still pass because they never permute anything.
    //
    // To within floating-point summation, which is all Jacobi can buy: the order the
    // contributions are ADDED in changes with the permutation, and it is AD-7's key order
    // that fixes it for the byte-identity claim.
    const anchors = [
      { x: 0, y: 0 },
      { x: 300, y: 0 },
      { x: 0, y: 300 },
      { x: 300, y: 300 },
      { x: 150, y: 150 },
    ];
    const bodies = anchors.map((anchor, index) => ({
      key: volumeKey(`v${index}`),
      radius: 60 + index * 3,
      anchor,
    }));
    const start = anchors.map((anchor, index) => ({
      x: anchor.x + index * 7,
      y: anchor.y - index,
    }));
    const links = [
      { from: 0, to: 1 },
      { from: 1, to: 4 },
      { from: 2, to: 3 },
      { from: 0, to: 4 },
    ];
    const straight = relax(bodies, links, start, 6);

    const order = [3, 0, 4, 1, 2];
    const slot = new Map(order.map((original, position) => [original, position]));
    const permuted = relax(
      order.map((original) => bodies[original] as (typeof bodies)[number]),
      links.map((link) => ({ from: slot.get(link.from) ?? 0, to: slot.get(link.to) ?? 0 })),
      order.map((original) => start[original] as (typeof start)[number]),
      6,
    );

    order.forEach((original, position) => {
      expect(permuted[position]?.x).toBeCloseTo(straight[original]?.x ?? NaN, 9);
      expect(permuted[position]?.y).toBeCloseTo(straight[original]?.y ?? NaN, 9);
    });
    // And the relaxation actually did something, or the row above holds for a no-op.
    expect(JSON.stringify(straight)).not.toBe(JSON.stringify(start));
  });
});
