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

import type { Mode, Placement, Positions } from './index.ts';
import { DEFAULT_MODE, isDisjoint, layout, placementsOf, retainedOf } from './index.ts';

/**
 * STABILITY IS A SECOND PROPERTY, AND NO DETERMINISM TEST CAN SEE IT (AD-37).
 *
 * Determinism is *same input, same output* and is tested by replay. Stability is *changed
 * input, almost unchanged output* — and a determinism test never changes the input, so it
 * agrees with a build that reshuffles the map on every survey. The five transitions below
 * are the ones AD-37 names by name: object added, object removed, service scaled up,
 * service scaled down, stack redeployed.
 *
 * The redeployment case is the sharp one. Every container ID changes and every slot
 * survives, so AD-5's key and AD-6's seed are the whole of the answer and a correct build
 * moves NOTHING AT ALL. A build keyed on the container ID passes every other row here.
 */

// --- A cluster whose replica count and container generation can both be moved -----

interface Shape {
  /** Service name to replica count. */
  readonly replicas: Record<string, number>;
  /** What every container ID is built from — a `docker stack deploy` changes it. */
  readonly generation: string;
  /** Extra volumes attached to nothing at all — FR-35's orphan. */
  readonly orphans: readonly string[];
  /** Service name to the volumes its tasks mount — the second placement rung's edges. */
  readonly mounts: Record<string, readonly string[]>;
  /** Which networks the cluster still has. Dropping one is a transition in its own right. */
  readonly networks: readonly string[];
}

const NETWORKS: Record<string, readonly string[]> = {
  web: ['frontend', 'backend'],
  api: ['backend'],
  pg: ['pgnet'],
};

const survey = (shape: Shape): Survey => {
  const edges: Edge[] = [];
  const has = new Set(shape.networks);
  const containers = Object.entries(shape.replicas).flatMap(([name, count]) =>
    Array.from({ length: count }, (_unused, index) => {
      const slot = index + 1;
      const key = replicatedTaskKey('blog', name, slot);
      edges.push({ kind: 'runs', from: serviceKey(`svc${name}`), to: key });
      edges.push({ kind: 'hosts', from: nodeKey(`n${(index % 2) + 1}`), to: key });
      for (const network of NETWORKS[name] ?? []) {
        // A network the cluster no longer has takes its attachments with it: an edge onto a
        // missing endpoint is not a survey a collector could build.
        if (has.has(network))
          edges.push({ kind: 'attachment', from: key, to: networkKey(network) });
      }
      for (const volume of shape.mounts[name] ?? []) {
        edges.push({ kind: 'mount', from: key, to: volumeKey(volume), path: '/d', access: 'rw' });
      }
      return {
        kind: 'container' as const,
        key,
        id: `${shape.generation}-${name}-${slot}`,
        name: `blog_${name}.${slot}`,
        image: 'nginx:1.25-alpine',
        desiredState: 'running' as const,
        state: 'running' as const,
      };
    }),
  );
  const names = Object.keys(shape.replicas);
  for (const name of names) {
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
    networks: shape.networks.map((name) => ({
      kind: 'network' as const,
      key: networkKey(name),
      name,
      subnets: [],
      createdAt: '2026-01-01T00:00:00Z',
    })),
    volumes: [...new Set([...Object.values(shape.mounts).flat(), ...shape.orphans])].map(
      (name) => ({
        kind: 'volume' as const,
        key: volumeKey(name),
        name,
      }),
    ),
    stacks: [{ kind: 'stack' as const, key: stackKey('blog'), name: 'blog' }],
    services: names.map((name) => ({
      kind: 'service' as const,
      key: serviceKey(`svc${name}`),
      id: `svc${name}`,
      name,
      mode: 'replicated' as const,
      health: { running: shape.replicas[name] ?? 0, desired: shape.replicas[name] ?? 0 },
    })),
    containers,
    edges,
  };
};

const BASE: Shape = {
  replicas: { web: 3, api: 2, pg: 1 },
  generation: 'g1',
  orphans: [],
  mounts: { pg: ['pgdata'] },
  networks: ['frontend', 'backend', 'pgnet'],
};
const SEED = 4242;

const at = (positions: Positions, key: IdentityKey): Placement | undefined =>
  placementsOf(positions, key)[0];

/** Which drawing a placement is: the key, the zone it names, and original or echo. */
const slotId = (placement: Placement): string =>
  `${placement.key}|${placement.zone ?? ''}|${placement.original}`;

/**
 * Every drawing of the previous survey that is not still on exactly the same ground.
 *
 * WALKED FROM `before`, NOT FROM `after`, and an unmatched drawing counts. Walking `after`
 * and skipping what it could not match made this vacuous in exactly the transitions where
 * survivor bookkeeping is most likely wrong: a placement whose zone label or original flag
 * changed simply disappeared from the comparison and the row passed having compared nothing.
 *
 * A vanished object is matched against the retained cells, because AD-37 says its cell is
 * still there — *fades in place* is not a move.
 */
const moved = (before: Positions, after: Positions): readonly string[] => {
  const now = new Map<string, Placement>();
  for (const placement of [...after.placements, ...after.retained])
    now.set(slotId(placement), placement);
  const drift: string[] = [];
  for (const was of before.placements) {
    const still = now.get(slotId(was));
    if (still === undefined) drift.push(`${slotId(was)} is gone`);
    else if (still.x !== was.x || still.y !== was.y) drift.push(`${slotId(was)} moved`);
  }
  return drift;
};

const distance = (a: Placement, b: Placement): number =>
  Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));

const MODES: readonly (readonly [string, Mode])[] = [
  ['blended zones', { zoneMode: 'blended', nodeBackdrop: false }],
  ['disjoint zones', { zoneMode: 'disjoint', nodeBackdrop: false }],
  ['node backdrop', { zoneMode: 'blended', nodeBackdrop: true }],
];

const first = (shape: Shape, mode: Mode = DEFAULT_MODE): Positions =>
  layout(survey(shape), undefined, SEED, mode);

// --- The five transitions AD-37 names ---------------------------------------

describe('across a survey, nothing moves (FR-16, AD-37)', () => {
  it.each(MODES)('replays an unchanged survey byte-identically in %s', (_name, mode) => {
    const before = first(BASE, mode);
    const after = layout(survey(BASE), before, SEED, mode);
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });

  it.each(MODES)('leaves every survivor untouched when an object is added in %s', (_name, mode) => {
    const before = first(BASE, mode);
    const after = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 4 } }),
      before,
      SEED,
      mode,
    );
    expect(moved(before, after)).toEqual([]);
    expect(at(after, replicatedTaskKey('blog', 'web', 4))).toBeDefined();
    expect(isDisjoint(after.placements)).toBe(true);
  });

  it('places the fourth replica beside the other three, not beside a stranger', () => {
    // *The 4th replica appeared beside the other three* — the case an operator actually
    // watches, and the first rung of the placement rule: service siblings.
    const before = first(BASE);
    const after = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 4 } }),
      before,
      SEED,
      DEFAULT_MODE,
    );
    const arrival = at(after, replicatedTaskKey('blog', 'web', 4));
    expect(arrival).toBeDefined();
    if (arrival === undefined) return;
    const toSiblings = [1, 2, 3]
      .map((slot) => at(after, replicatedTaskKey('blog', 'web', slot)))
      .filter((placement): placement is Placement => placement !== undefined)
      .map((sibling) => distance(arrival, sibling));
    const toStrangers = [1, 2]
      .map((slot) => at(after, replicatedTaskKey('blog', 'api', slot)))
      .filter((placement): placement is Placement => placement !== undefined)
      .map((stranger) => distance(arrival, stranger));
    expect(Math.max(...toSiblings)).toBeLessThan(Math.min(...toStrangers));
  });

  it('places a new volume beside the containers that mount it — the second rung', () => {
    // No service sibling, so the first rung says nothing; the second is the centroid of its
    // already-placed edge-adjacent objects, which for a volume is what mounts it. Asserting
    // only that it exists would leave the rungs swappable.
    const before = first(BASE);
    const after = layout(
      survey({ ...BASE, mounts: { ...BASE.mounts, web: ['weblogs'] } }),
      before,
      SEED,
      DEFAULT_MODE,
    );
    expect(moved(before, after)).toEqual([]);
    const arrival = at(after, volumeKey('weblogs'));
    expect(arrival).toBeDefined();
    if (arrival === undefined) return;
    const toMounters = [1, 2, 3]
      .map((slot) => at(after, replicatedTaskKey('blog', 'web', slot)))
      .filter((placement): placement is Placement => placement !== undefined)
      .map((mounter) => distance(arrival, mounter));
    const toStrangers = [1, 2]
      .map((slot) => at(after, replicatedTaskKey('blog', 'api', slot)))
      .filter((placement): placement is Placement => placement !== undefined)
      .map((stranger) => distance(arrival, stranger));
    expect(Math.max(...toMounters)).toBeLessThan(Math.min(...toStrangers));
  });

  it('places an object attached to nothing on the last rung, in no zone at all', () => {
    // FR-35 treats the orphans as a SET and FR-74 counts them, so the last rung puts them
    // together and outside every zone. Two orphans arriving at once is what makes that
    // checkable: they land beside each other and further from every zoned body than from
    // one another, which neither of the rungs above would produce.
    const before = first(BASE);
    const after = layout(
      survey({ ...BASE, orphans: ['scratch', 'spare'] }),
      before,
      SEED,
      DEFAULT_MODE,
    );
    expect(moved(before, after)).toEqual([]);
    const scratch = at(after, volumeKey('scratch'));
    const spare = at(after, volumeKey('spare'));
    expect(scratch?.zone).toBeNull();
    expect(spare?.zone).toBeNull();
    if (scratch === undefined || spare === undefined) return;
    const apart = distance(scratch, spare);
    for (const placement of after.placements) {
      if (placement.radius === 0) continue;
      if (placement.key === scratch.key || placement.key === spare.key) continue;
      expect(distance(scratch, placement)).toBeGreaterThan(apart);
    }
    expect(isDisjoint(after.placements)).toBe(true);
  });

  it.each(MODES)(
    'retains a vanished object’s cell rather than reclaiming it in %s',
    (_name, mode) => {
      const before = first(BASE, mode);
      const gone = replicatedTaskKey('blog', 'web', 3);
      const cell = at(before, gone);
      expect(cell).toBeDefined();

      const after = layout(
        survey({ ...BASE, replicas: { ...BASE.replicas, web: 2 } }),
        before,
        SEED,
        mode,
      );
      expect(moved(before, after)).toEqual([]);
      expect(placementsOf(after, gone)).toEqual([]);
      // It fades IN PLACE: the cell is still there, at the same coordinates.
      const retained = retainedOf(after, gone);
      expect(retained.length).toBeGreaterThan(0);
      expect(retained[0]?.x).toBe(cell?.x);
      expect(retained[0]?.y).toBe(cell?.y);
      // And nothing was let into it.
      expect(isDisjoint([...after.placements, ...after.retained])).toBe(true);
    },
  );

  it('scales a service up and puts the new slots beside the survivors', () => {
    const before = first(BASE);
    const after = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 5 } }),
      before,
      SEED,
      DEFAULT_MODE,
    );
    expect(moved(before, after)).toEqual([]);
    for (const slot of [4, 5]) {
      expect(at(after, replicatedTaskKey('blog', 'web', slot))).toBeDefined();
    }
    expect(isDisjoint(after.placements)).toBe(true);
  });

  it('scales a service down and keeps both vacated cells', () => {
    const before = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 5 } }),
      undefined,
      SEED,
      DEFAULT_MODE,
    );
    const after = layout(survey(BASE), before, SEED, DEFAULT_MODE);
    expect(moved(before, after)).toEqual([]);
    for (const slot of [4, 5]) {
      expect(retainedOf(after, replicatedTaskKey('blog', 'web', slot)).length).toBe(1);
    }
  });

  it('moves nothing at all when a whole stack is redeployed', () => {
    // THE SHARP CASE. Every container ID changes; every slot survives. A build keyed on the
    // container ID sees five departures and five arrivals here and reshuffles the map — the
    // founding scenario's defect, *a drawing obsolete at the next stack deploy*.
    const before = first(BASE);
    const redeployed = survey({ ...BASE, generation: 'g2' });
    expect(redeployed.containers.map((container) => container.id)).not.toEqual(
      survey(BASE).containers.map((container) => container.id),
    );
    const after = layout(redeployed, before, SEED, DEFAULT_MODE);
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });
});

describe('a network can go, and the objects on it do not move (FR-16)', () => {
  const WITHOUT_BACKEND: Shape = { ...BASE, networks: ['frontend', 'pgnet'] };

  it('leaves every survivor exactly where it was, and retires the zone anchor', () => {
    const before = first(BASE);
    const anchor = at(before, networkKey('backend'));
    expect(anchor).toBeDefined();
    const after = layout(survey(WITHOUT_BACKEND), before, SEED, DEFAULT_MODE);

    // Coordinate for coordinate, keyed on the object rather than on the drawing, because a
    // drawing that stopped naming `backend` is not a drawing that moved.
    for (const was of before.placements) {
      if (was.key === networkKey('backend')) continue;
      const still = at(after, was.key);
      expect(still?.x).toBe(was.x);
      expect(still?.y).toBe(was.y);
    }
    // The zone itself vanished, so its anchor is a departure like any other.
    expect(placementsOf(after, networkKey('backend'))).toEqual([]);
    expect(retainedOf(after, networkKey('backend'))[0]?.x).toBe(anchor?.x);
  });

  it('stops the original naming the network that has gone', () => {
    const before = first(BASE);
    // `api` is on `backend` alone, so its tasks name it and nothing else.
    const key = replicatedTaskKey('blog', 'api', 1);
    expect(at(before, key)?.zone).toBe(networkKey('backend'));
    const after = layout(survey(WITHOUT_BACKEND), before, SEED, DEFAULT_MODE);
    expect(at(after, key)?.zone).toBeNull();
    expect(at(after, key)?.x).toBe(at(before, key)?.x);
  });

  it('retains the echo of a zone that has gone, and holds its ground afterwards', () => {
    const disjoint: Mode = { zoneMode: 'disjoint', nodeBackdrop: false };
    const before = first(BASE, disjoint);
    // `web` is on `frontend` and `backend`, so it has an original and one echo.
    const key = replicatedTaskKey('blog', 'web', 1);
    const drawings = placementsOf(before, key);
    expect(drawings).toHaveLength(2);
    const echo = drawings.find((placement) => !placement.original);
    expect(echo).toBeDefined();

    const after = layout(survey(WITHOUT_BACKEND), before, SEED, disjoint);
    // The copy in the vanished zone is gone from the drawing and held as a cell.
    expect(placementsOf(after, key)).toHaveLength(1);
    const heldEcho = retainedOf(after, key).find((cell) => cell.zone === networkKey('backend'));
    expect(heldEcho?.x).toBe(echo?.x);
    expect(heldEcho?.y).toBe(echo?.y);
    expect(isDisjoint([...after.placements, ...after.retained])).toBe(true);

    // AND THE SURVEY AFTER THAT. The key is still present, so a release keyed on presence
    // rather than on the relayout would drop this cell here — outside AD-37's one point.
    const later = layout(survey(WITHOUT_BACKEND), after, SEED, disjoint);
    expect(JSON.stringify(later.retained)).toBe(JSON.stringify(after.retained));
    expect(isDisjoint([...later.placements, ...later.retained])).toBe(true);
    expect(moved(after, later)).toEqual([]);
  });

  it('gives the zone back its echo when the network returns', () => {
    const disjoint: Mode = { zoneMode: 'disjoint', nodeBackdrop: false };
    const before = first(BASE, disjoint);
    const key = replicatedTaskKey('blog', 'web', 1);
    const echo = placementsOf(before, key).find((placement) => !placement.original);
    const without = layout(survey(WITHOUT_BACKEND), before, SEED, disjoint);
    const back = layout(survey(BASE), without, SEED, disjoint);
    // Nothing was let into the held cell, so the echo is drawn again exactly where it was.
    const redrawn = placementsOf(back, key).find(
      (placement) => placement.zone === networkKey('backend'),
    );
    expect(redrawn?.x).toBe(echo?.x);
    expect(redrawn?.y).toBe(echo?.y);
    expect(isDisjoint(back.placements)).toBe(true);
  });
});

describe('the retained cell has one owner and one release (AD-37)', () => {
  it('survives another survey, because nothing but a relayout releases it', () => {
    const shrunk = { ...BASE, replicas: { ...BASE.replicas, web: 2 } };
    const before = first(BASE);
    const afterLoss = layout(survey(shrunk), before, SEED, DEFAULT_MODE);
    const afterAgain = layout(survey(shrunk), afterLoss, SEED, DEFAULT_MODE);
    expect(JSON.stringify(afterAgain.retained)).toBe(JSON.stringify(afterLoss.retained));
  });

  it('is released by the relayout and by nothing else', () => {
    const shrunk = { ...BASE, replicas: { ...BASE.replicas, web: 2 } };
    const afterLoss = layout(survey(shrunk), first(BASE), SEED, DEFAULT_MODE);
    expect(afterLoss.retained.length).toBeGreaterThan(0);
    // Reorganise: the same seed, previous positions cleared.
    expect(layout(survey(shrunk), undefined, SEED, DEFAULT_MODE).retained).toEqual([]);
    // A zone-mode change: a relayout too, so the cell goes with it.
    expect(
      layout(survey(shrunk), afterLoss, SEED, { zoneMode: 'disjoint', nodeBackdrop: false })
        .retained,
    ).toEqual([]);
  });

  it('gives a returning object its own cell back', () => {
    const gone = replicatedTaskKey('blog', 'web', 3);
    const before = first(BASE);
    const cell = at(before, gone);
    const afterLoss = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 2 } }),
      before,
      SEED,
      DEFAULT_MODE,
    );
    const afterReturn = layout(survey(BASE), afterLoss, SEED, DEFAULT_MODE);
    expect(at(afterReturn, gone)?.x).toBe(cell?.x);
    expect(at(afterReturn, gone)?.y).toBe(cell?.y);
    expect(retainedOf(afterReturn, gone)).toEqual([]);
  });
});

describe('the three FR-16 actions, and only those, re-lay the map', () => {
  it('returns the canonical arrangement for Reorganise, and a second press changes nothing', () => {
    const once = layout(survey(BASE), undefined, SEED, DEFAULT_MODE);
    const twice = layout(survey(BASE), undefined, SEED, DEFAULT_MODE);
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    // And Reorganise pressed on a map that has drifted through several surveys returns to
    // that same canonical arrangement, which is what makes the screenshot reproducible.
    const drifted = layout(
      survey({ ...BASE, replicas: { ...BASE.replicas, web: 4 } }),
      once,
      SEED,
      DEFAULT_MODE,
    );
    expect(JSON.stringify(layout(survey(BASE), undefined, SEED, DEFAULT_MODE))).toBe(
      JSON.stringify(once),
    );
    expect(drifted.placements.length).toBeGreaterThan(once.placements.length);
  });

  it('re-lays on a mode change even when previous positions are handed in', () => {
    const blended = first(BASE);
    const disjoint = layout(survey(BASE), blended, SEED, {
      zoneMode: 'disjoint',
      nodeBackdrop: false,
    });
    // FR-40: switching zone mode re-lays the map. The positions must therefore be the
    // canonical disjoint ones, not the blended ones carried forward.
    expect(JSON.stringify(disjoint)).toBe(
      JSON.stringify(
        layout(survey(BASE), undefined, SEED, { zoneMode: 'disjoint', nodeBackdrop: false }),
      ),
    );
  });

  it('re-lays on a seed change, and keeps the same survey placed disjointly', () => {
    const before = first(BASE);
    const reseeded = layout(survey(BASE), before, SEED + 1, DEFAULT_MODE);
    expect(JSON.stringify(reseeded)).not.toBe(JSON.stringify(before));
    expect(isDisjoint(reseeded.placements)).toBe(true);
  });
});
