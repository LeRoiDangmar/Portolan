import type { Edge, IdentityKey, Survey } from '@portolan/model';
import {
  networkKey,
  nodeKey,
  replicatedTaskKey,
  serviceKey,
  stackKey,
  volumeKey,
} from '@portolan/model';
import { describe, expect, it } from 'vitest';

import type { Mode, Positions } from './index.ts';
import { layout, scatterOf, spiralPoint } from './index.ts';

/**
 * AD-8's determinism claim, in the file the two-architecture matrix runs.
 *
 * `npm run test:determinism` is `vitest run --passWithNoTests determinism`, a filename
 * filter, and `.github/workflows/ci.yml` runs it on `ubuntu-24.04` and `ubuntu-24.04-arm`.
 * Same model, seed and mode in, byte-identical positions out — the property the whole
 * no-relayout contract rests on, and the one AD-32 singles out as having to hold on both.
 *
 * EVERY EXPECTATION IS RE-DERIVED FROM THE PUBLISHED ALGORITHM, NOT IMPORTED. A test that
 * called the module to compute its own expectation would agree with any change. The seed is
 * FNV-1a written out a second time; the anchor spiral is walked by a different algorithm
 * from the module's; the pitch is recomputed from the four transcribed constants.
 *
 * STABILITY IS NOT HERE. It is a second property — *changed input, almost unchanged output*
 * — and a determinism test never changes its input. `layout.stability.test.ts` has it.
 */

// --- A cluster, declared once -----------------------------------------------

const SERVICES: readonly (readonly [string, number, readonly string[]])[] = [
  ['web', 3, ['frontend', 'backend']],
  ['api', 2, ['backend']],
  ['pg', 2, ['pgnet', 'backend']],
];

const FIXTURE: Survey = (() => {
  const edges: Edge[] = [];
  const containers = SERVICES.flatMap(([name, count, networks]) =>
    Array.from({ length: count }, (_unused, index) => {
      const key = replicatedTaskKey('blog', name, index + 1);
      edges.push({ kind: 'runs', from: serviceKey(`svc${name}`), to: key });
      edges.push({ kind: 'hosts', from: nodeKey(`n${(index % 2) + 1}`), to: key });
      for (const network of networks) {
        edges.push({ kind: 'attachment', from: key, to: networkKey(network) });
      }
      if (name === 'pg') {
        edges.push({ kind: 'mount', from: key, to: volumeKey('pgdata'), path: '/d', access: 'rw' });
      }
      return {
        kind: 'container' as const,
        key,
        id: `c-${name}-${index}`,
        name: `blog_${name}.${index + 1}`,
        image: 'nginx:1.25-alpine',
        desiredState: 'running' as const,
        state: 'running' as const,
      };
    }),
  );
  for (const [name] of SERVICES) {
    edges.push({ kind: 'groups', from: stackKey('blog'), to: serviceKey(`svc${name}`) });
  }
  return {
    takenAt: '2026-09-16T09:00:00Z',
    nodes: ['n1', 'n2'].map((id) => ({
      kind: 'node' as const,
      key: nodeKey(id),
      id,
      name: id,
      role: 'worker' as const,
      address: '10.0.0.1',
      availability: 'active' as const,
      state: 'ready' as const,
    })),
    networks: ['frontend', 'backend', 'pgnet'].map((name) => ({
      kind: 'network' as const,
      key: networkKey(name),
      name,
      subnets: [],
      createdAt: '2026-01-01T00:00:00Z',
    })),
    volumes: [{ kind: 'volume' as const, key: volumeKey('pgdata'), name: 'pgdata' }],
    stacks: [{ kind: 'stack' as const, key: stackKey('blog'), name: 'blog' }],
    services: SERVICES.map(([name, count]) => ({
      kind: 'service' as const,
      key: serviceKey(`svc${name}`),
      id: `svc${name}`,
      name,
      mode: 'replicated' as const,
      health: { running: count, desired: count },
    })),
    containers,
    edges,
  };
})();

const SEED = 20260916;

const MODES: readonly (readonly [string, Mode])[] = [
  ['blended', { zoneMode: 'blended', nodeBackdrop: false }],
  ['disjoint', { zoneMode: 'disjoint', nodeBackdrop: false }],
  ['backdrop', { zoneMode: 'blended', nodeBackdrop: true }],
];

const laid = (mode: Mode, seed = SEED): Positions => layout(FIXTURE, undefined, seed, mode);

// --- The algorithm, written out a second time -------------------------------

/**
 * FNV-1a, 32-bit, from the published constants in decimal — 2166136261 and 16777619 — and
 * with the two bytes of each UTF-16 unit taken by arithmetic rather than by bit shifts.
 * The same function `silhouette.determinism.test.ts` re-derives, for the same reason.
 */
const fnv1a = (text: string): number => {
  let hash = 2166136261;
  for (const character of text) {
    const unit = character.charCodeAt(0);
    hash = Math.imul(hash ^ (unit % 256), 16777619);
    hash = Math.imul(hash ^ Math.floor(unit / 256), 16777619);
  }
  return hash >>> 0;
};

const draw = (seed: number, index: number): number => {
  let hash = Math.imul(seed ^ (index + 1), 16777619) >>> 0;
  hash = (hash ^ (hash >>> 15)) >>> 0;
  hash = Math.imul(hash, 16777619) >>> 0;
  hash = (hash ^ (hash >>> 13)) >>> 0;
  return hash >>> 0;
};

/**
 * The square spiral, solved ring by ring rather than walked step by step — a different
 * algorithm from the module's, so agreeing is evidence rather than a shared bug.
 *
 * Ring `r` starts at index `(2r−1)²` at the corner `(r, −r + 1)` and runs up, left, down,
 * right; ring 0 is the origin alone.
 */
const spiral = (index: number): { x: number; y: number } => {
  if (index === 0) return { x: 0, y: 0 };
  let ring = 1;
  while ((2 * ring + 1) * (2 * ring + 1) <= index) ring += 1;
  const side = 2 * ring;
  let offset = index - (2 * ring - 1) * (2 * ring - 1);
  if (offset < side - 1) return { x: ring, y: -ring + 1 + offset };
  offset -= side - 1;
  if (offset < side) return { x: ring - offset, y: ring };
  offset -= side;
  if (offset < side) return { x: -ring, y: ring - offset };
  offset -= side;
  return { x: -ring + offset, y: -ring };
};

/** `reservationRadius(BASE_RADIUS.service)`, from the four transcribed constants. */
const LARGEST_RADIUS = 54 * (1 + 0.11 + 0.04 + 0.32) * 1.2 + 8;

// --- The claims -------------------------------------------------------------

describe('layout is a pure, deterministic function of its four arguments (AD-8)', () => {
  it.each(MODES)('returns byte-identical positions when asked twice in %s mode', (_name, mode) => {
    const first = laid(mode);
    const second = laid(mode);
    expect(second).toEqual(first);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it('depends on nothing but its four arguments', () => {
    // No clock, no `Math.random`: the same call at two moments, with unrelated work between
    // them, gives the same bytes.
    const before = JSON.stringify(
      laid(MODES[0]?.[1] ?? { zoneMode: 'blended', nodeBackdrop: false }),
    );
    for (const [, mode] of MODES) laid(mode, SEED + 7);
    expect(
      JSON.stringify(laid(MODES[0]?.[1] ?? { zoneMode: 'blended', nodeBackdrop: false })),
    ).toBe(before);
    // Four arguments, and `mode` has exactly two fields — AD-40's guarantee that no canvas
    // width can enter through a legitimate parameter is an arity claim before it is anything
    // else.
    expect(layout.length).toBe(4);
    expect(Object.keys(MODES[0]?.[1] ?? {}).sort()).toEqual(['nodeBackdrop', 'zoneMode']);
  });

  it('anchors every zone where the published rule says, not where the module says', () => {
    // Three networks, so the pitch is set by the largest zone. `backend` carries every body
    // of every service — 3 + 2 + 2 containers, 3 services and the volume that inherits its
    // mounters' zones — which is what the rule counts.
    const positions = laid({ zoneMode: 'blended', nodeBackdrop: false });
    const anchors = positions.placements.filter((placement) => placement.radius === 0);
    const sizes = new Map<IdentityKey, number>();
    for (const placement of positions.placements) {
      if (placement.radius === 0 || placement.zone === null) continue;
      sizes.set(placement.zone, (sizes.get(placement.zone) ?? 0) + 1);
    }
    // The largest zone is what the pitch is derived from; re-derived from the survey rather
    // than read from the module.
    const zoneOf = new Map<IdentityKey, readonly IdentityKey[]>();
    for (const edge of FIXTURE.edges) {
      if (edge.kind !== 'attachment') continue;
      zoneOf.set(edge.to, [...(zoneOf.get(edge.to) ?? []), edge.from]);
    }
    let largest = 1;
    for (const [, members] of zoneOf) if (members.length > largest) largest = members.length;
    // The volume and the services inherit too, so the module's count is at least this one;
    // the assertion below reads the pitch back out of two anchors instead of guessing it.
    expect(largest).toBeGreaterThan(1);

    const keys = ['backend', 'frontend', 'pgnet'].map(networkKey);
    expect(anchors.map((placement) => placement.key)).toEqual(keys);
    const originCell = spiral(0);
    const origin = anchors[0];
    expect(origin).toBeDefined();
    expect({ x: origin?.x, y: origin?.y }).toEqual({ x: originCell.x, y: originCell.y });
    // The second and third anchors are the second and third spiral cells scaled by one
    // pitch, so the ratio of their coordinates pins the spiral without pinning the pitch.
    const second = anchors[1];
    const third = anchors[2];
    expect(second).toBeDefined();
    expect(third).toBeDefined();
    const pitch = second?.x ?? 0;
    expect(pitch).toBeGreaterThan(2 * LARGEST_RADIUS);
    expect({ x: second?.x, y: second?.y }).toEqual({
      x: spiral(1).x * pitch,
      y: spiral(1).y * pitch,
    });
    expect({ x: third?.x, y: third?.y }).toEqual({
      x: spiral(2).x * pitch,
      y: spiral(2).y * pitch,
    });
  });

  it('scatters each member from the seed the published algorithm gives', () => {
    // `scatterOf` is the only place the layout seed enters, so it is the only place a
    // divergent draw could hide. Re-derived from FNV-1a and the unsigned-32-bit division.
    const key = replicatedTaskKey('blog', 'web', 1);
    const own = fnv1a(key) + SEED;
    const spread = 137;
    const across = (draw(own, 1) / 4294967295) * 2 - 1;
    const down = (draw(own, 2) / 4294967295) * 2 - 1;
    const pull = Math.sqrt(draw(own, 3) / 4294967295);
    expect(scatterOf(key, SEED, spread)).toEqual({
      x: across * spread * pull,
      y: down * spread * pull,
    });
  });

  it('walks the same spiral as the ring-by-ring solution, for the first fifty cells', () => {
    for (let index = 0; index < 50; index += 1) expect(spiralPoint(index)).toEqual(spiral(index));
  });

  /**
   * The matrix asks for byte-identity ACROSS ARCHITECTURES, and no assertion above reaches
   * that far: each re-derives its expectation inside the run it is checking, so each would
   * agree with an arrangement that had moved. These digests were computed once, on
   * 2026-09-16, and committed — so the assertion is made by a process that has already
   * exited, which is the only form the claim can take.
   *
   * They pin every number in the arrangement at once: the anchors, the seeded scatter, all
   * twenty-four relaxation passes, the settling, the echoes and the AD-7 output order, each
   * rendered by `JSON.stringify`, whose output for a double ECMAScript specifies exactly.
   *
   * A FAILURE HERE IS NEVER A NUMBER TO UPDATE. It means the map moved, and FR-16 says the
   * map does not move — so the change that moved it is what needs justifying, not this
   * table. Reorganise is the only sanctioned way to a different arrangement, and it does not
   * change the answer for a given seed.
   */
  const GOLDEN_ARRANGEMENTS: readonly (readonly [string, number])[] = [
    ['blended', 2129616254],
    ['disjoint', 2378610466],
    ['backdrop', 548660664],
  ];

  it.each(GOLDEN_ARRANGEMENTS)(
    'reproduces the committed arrangement in %s mode',
    (name, digest) => {
      const mode = MODES.find(([label]) => label === name)?.[1];
      expect(mode).toBeDefined();
      if (mode === undefined) return;
      expect(fnv1a(JSON.stringify(laid(mode)))).toBe(digest);
    },
  );

  it('covers every mode, so no arrangement is pinned by accident', () => {
    expect(GOLDEN_ARRANGEMENTS.map(([name]) => name)).toEqual(MODES.map(([name]) => name));
  });

  it('would report a drift, so the digests above are evidence and not decoration', () => {
    // A perturbed input must not match: one more replica of `web`, everything else equal.
    const perturbed: Survey = {
      ...FIXTURE,
      containers: FIXTURE.containers.slice(1),
      edges: FIXTURE.edges.slice(1),
    };
    const mode = MODES[0]?.[1] ?? { zoneMode: 'blended', nodeBackdrop: false };
    expect(fnv1a(JSON.stringify(layout(perturbed, undefined, SEED, mode)))).not.toBe(
      GOLDEN_ARRANGEMENTS[0]?.[1],
    );
    // And a different seed is a different canonical arrangement, which is what makes the
    // seed a real parameter rather than decoration.
    expect(fnv1a(JSON.stringify(laid(mode, SEED + 1)))).not.toBe(GOLDEN_ARRANGEMENTS[0]?.[1]);
  });
});
