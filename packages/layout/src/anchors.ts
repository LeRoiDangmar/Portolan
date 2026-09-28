// anchors — the survey read as zones, partitions and adjacency, and the deterministic
// anchor each zone or partition is placed on. The first half of the hybrid.
//
// THE ARRANGEMENT IS A HYBRID, AND THIS IS THE HALF THAT DECIDES WHERE A ZONE IS.
// `DESIGN.md` says the zone owns position; the zone study's variant 4 lets the edges lead.
// Neither document can be followed alone without contradicting the other, so each network
// gets an anchor placed by a deterministic rule, members are seeded around the anchor of
// their dominant network, and `relax.ts` then opens the edges. Two mechanisms, each with
// its own test — the accepted cost, named in the story.
//
// THE ANCHOR RULE IS A SQUARE SPIRAL OVER AD-7 ORDER, AND THAT IS NOT AN AESTHETIC CHOICE.
// A ring of zones is the obvious arrangement and it is unreachable: a point on a circle is
// `(r·cos θ, r·sin θ)` and AD-8 bans both. The square spiral is the compact lattice walk
// that `+` and `-` alone can produce, it fills the plane outward from the origin so the
// first zones sit in the middle, and its order is the AD-7 order of the network keys — so
// two surveys of an unchanged cluster anchor every zone identically (AD-7).
//
// NO ZONE FIELD GEOMETRY HERE. An anchor is a point, not a shape. The field, the isoline
// and the stack outline are the scene's (FR-82), and this file would be the natural wrong
// place to start computing one.

import type { Edge, IdentityKey, Point, Survey } from '@portolan/model';
import {
  BASE_RADIUS,
  compareIdentityKeys,
  drawAt,
  identityKind,
  reservationRadius,
  seedOf,
} from '@portolan/model';

/** The three kinds drawn as a body, and therefore the three kinds layout places. */
export const BODY_KINDS = ['service', 'container', 'volume'] as const;
export type BodyKind = (typeof BODY_KINDS)[number];

/** True when a key names an object that gets a cell of its own. */
export const isBodyKey = (key: IdentityKey): boolean =>
  (BODY_KINDS as readonly string[]).includes(identityKind(key));

/** The reserved radius of a body, from `model` and from nowhere else (AD-38). */
export const radiusOf = (key: IdentityKey): number =>
  reservationRadius(BASE_RADIUS[identityKind(key) as BodyKind]);

// --- The survey, indexed ----------------------------------------------------

/** A one-to-many relation, every value list in AD-7 order. */
export type Relation = ReadonlyMap<IdentityKey, readonly IdentityKey[]>;

/**
 * Everything the placement rules read, derived once per call.
 *
 * There are NO MEMBERSHIP ARRAYS on a model object — a service's slots are found through
 * `runs`, network membership through `attachment`, the node through `hosts` — so every
 * question the rules ask is an edge walk, and doing it once is what keeps the arithmetic
 * out of the inner loops.
 */
export interface SurveyIndex {
  /** Every body in the survey, in AD-7 order. */
  readonly bodies: readonly IdentityKey[];
  /** Every network, in AD-7 order. Zones, not bodies. */
  readonly networks: readonly IdentityKey[];
  /** Every node, in AD-7 order. Partitions under the backdrop, not bodies. */
  readonly nodes: readonly IdentityKey[];
  /** The networks a body belongs to, in AD-7 order. A volume inherits its mounters'. */
  readonly zones: Relation;
  /** The nodes a body sits on, in AD-7 order. A service inherits its containers'. */
  readonly partitions: Relation;
  /** The other containers of a body's own service — the sibling rule's first rung. */
  readonly siblings: Relation;
  /** Body-to-body adjacency: `runs` and `mount`, both directions, in AD-7 order. */
  readonly adjacent: Relation;
  /** How many bodies each network holds — what the dominant-zone rule compares. */
  readonly zoneSize: ReadonlyMap<IdentityKey, number>;
}

const push = (into: Map<IdentityKey, IdentityKey[]>, from: IdentityKey, to: IdentityKey): void => {
  const existing = into.get(from);
  if (existing === undefined) into.set(from, [to]);
  else if (!existing.includes(to)) existing.push(to);
};

/** Sort every value list, so no consumer ever depends on a `Map`'s insertion order (AD-7). */
const ordered = (relation: Map<IdentityKey, IdentityKey[]>): Relation => {
  const sorted = new Map<IdentityKey, readonly IdentityKey[]>();
  for (const [key, values] of relation) sorted.set(key, [...values].sort(compareIdentityKeys));
  return sorted;
};

/** The empty answer, shared, so a missing key allocates nothing. */
export const EMPTY_KEYS: readonly IdentityKey[] = [];

/** {@link SurveyIndex.zones}, {@link SurveyIndex.partitions} and friends, read safely. */
export const relatedTo = (relation: Relation, key: IdentityKey): readonly IdentityKey[] =>
  relation.get(key) ?? EMPTY_KEYS;

/**
 * Index one survey.
 *
 * The survey must already be in AD-7 order — `layout` sorts it before calling — and every
 * list this builds is sorted again anyway, so an unsorted survey and a sorted one produce
 * the identical index. That is the *unsorted survey* row of the matrix, held here rather
 * than hoped for downstream.
 */
export const indexSurvey = (survey: Survey): SurveyIndex => {
  const zones = new Map<IdentityKey, IdentityKey[]>();
  const partitions = new Map<IdentityKey, IdentityKey[]>();
  const runsOf = new Map<IdentityKey, IdentityKey[]>();
  const adjacent = new Map<IdentityKey, IdentityKey[]>();
  const mounters = new Map<IdentityKey, IdentityKey[]>();

  const link = (a: IdentityKey, b: IdentityKey): void => {
    push(adjacent, a, b);
    push(adjacent, b, a);
  };

  for (const edge of survey.edges) walk(edge, { zones, partitions, runsOf, mounters, link });

  // Both derivations below iterate a `Map`'s keys in AD-7 order rather than in insertion
  // order. Nothing they produce depends on the order — every list is sorted afterwards —
  // but AD-7 says never to iterate a `Map`'s order, and an exception taken because it
  // happens not to matter is how the rule stops being readable.
  const sortedKeys = (relation: Map<IdentityKey, IdentityKey[]>): readonly IdentityKey[] =>
    [...relation.keys()].sort(compareIdentityKeys);

  // A volume is attached to no network — `attachment` runs from a container or a service —
  // so its zone is the zones of the containers that mount it. Without this a volume has no
  // dominant zone at all and every volume falls to the orphan anchor, which would put the
  // mount edges, the one edge kind FR-31 keeps when networks go, at full map length.
  for (const volume of sortedKeys(mounters)) {
    for (const container of mounters.get(volume) ?? EMPTY_KEYS) {
      for (const zone of zones.get(container) ?? EMPTY_KEYS) push(zones, volume, zone);
    }
  }
  // Likewise a service sits on no node of its own: it is wherever its tasks are.
  for (const service of sortedKeys(runsOf)) {
    for (const container of runsOf.get(service) ?? EMPTY_KEYS) {
      for (const node of partitions.get(container) ?? EMPTY_KEYS) push(partitions, service, node);
    }
  }

  const siblings = new Map<IdentityKey, IdentityKey[]>();
  for (const service of sortedKeys(runsOf)) {
    const containers = runsOf.get(service) ?? EMPTY_KEYS;
    for (const container of containers) {
      for (const other of containers) if (other !== container) push(siblings, container, other);
    }
  }

  const bodies = [
    ...survey.services.map((object) => object.key),
    ...survey.containers.map((object) => object.key),
    ...survey.volumes.map((object) => object.key),
  ].sort(compareIdentityKeys);

  const zonesOrdered = ordered(zones);
  const zoneSize = new Map<IdentityKey, number>();
  for (const body of bodies) {
    for (const zone of relatedTo(zonesOrdered, body)) {
      zoneSize.set(zone, (zoneSize.get(zone) ?? 0) + 1);
    }
  }

  return {
    bodies,
    networks: survey.networks.map((object) => object.key).sort(compareIdentityKeys),
    nodes: survey.nodes.map((object) => object.key).sort(compareIdentityKeys),
    zones: zonesOrdered,
    partitions: ordered(partitions),
    siblings: ordered(siblings),
    adjacent: ordered(adjacent),
    zoneSize,
  };
};

interface Walk {
  readonly zones: Map<IdentityKey, IdentityKey[]>;
  readonly partitions: Map<IdentityKey, IdentityKey[]>;
  readonly runsOf: Map<IdentityKey, IdentityKey[]>;
  readonly mounters: Map<IdentityKey, IdentityKey[]>;
  readonly link: (a: IdentityKey, b: IdentityKey) => void;
}

/** One edge, read for what it says about membership and adjacency. */
const walk = (edge: Edge, into: Walk): void => {
  switch (edge.kind) {
    case 'attachment':
      push(into.zones, edge.from, edge.to);
      return;
    case 'hosts':
      push(into.partitions, edge.to, edge.from);
      return;
    case 'runs':
      push(into.runsOf, edge.from, edge.to);
      into.link(edge.from, edge.to);
      return;
    case 'mount':
      push(into.mounters, edge.to, edge.from);
      into.link(edge.from, edge.to);
      return;
    case 'groups':
      // A stack's position is DERIVED (FR-82): the outline follows where layout put its
      // members and never asks for a position of its own. So `groups` is read for nothing
      // here, and a stack gets no cell — which is the whole of FR-82 in this package.
      return;
  }
};

// --- The deterministic anchor -----------------------------------------------

/**
 * The `index`-th point of a square spiral on the integer lattice, starting at the origin.
 *
 * `+`, `-` and a 90° turn written as a swap and a sign change. It is walked rather than
 * solved because the closed form needs a square root and a floor, and the walk is 25 steps
 * at the reference scale — the cost of the honest version is nothing.
 */
export const spiralPoint = (index: number): Point => {
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let run = 1;
  let left = 1;
  let turns = 0;
  for (let step = 0; step < index; step += 1) {
    x += dx;
    y += dy;
    left -= 1;
    if (left === 0) {
      const turnedX = -dy;
      dy = dx;
      dx = turnedX;
      turns += 1;
      if (turns === 2) {
        turns = 0;
        run += 1;
      }
      left = run;
    }
  }
  return { x, y };
};

/** Where the zones or the partitions sit, and where an object belonging to none goes. */
export interface Anchors {
  /** One anchor per network (or per node, under the backdrop), in AD-7 order. */
  readonly keys: readonly IdentityKey[];
  readonly at: ReadonlyMap<IdentityKey, Point>;
  /** The slot for an object that belongs to no zone at all — FR-35's orphan. */
  readonly orphan: Point;
  /** How far a member may be seeded from its anchor. */
  readonly spread: number;
}

/**
 * The pitch between two anchors: wide enough that the largest group's members fit around
 * theirs before the next one begins.
 *
 * `√members` because a group of `m` cells packs into a square roughly `√m` cells on a side.
 * `Math.sqrt` is the one non-elementary operation AD-8 allows, exactly because IEEE 754
 * specifies its result to the last bit.
 */
export const pitchFor = (largestGroup: number, largestRadius: number): number =>
  2 * largestRadius * (1 + Math.sqrt(largestGroup));

/**
 * Anchor every group, in AD-7 order, on the square spiral.
 *
 * THE SEED DOES NOT ENTER HERE, deliberately. Where a zone sits is a property of the survey
 * — its key order and its size — so two tabs with the same survey agree about the shape of
 * the map even before Reorganise. The seed perturbs the members' seeding inside a zone
 * (`arrange.ts`), which is the part a second press of Reorganise would be expected to
 * leave alone: the story fixes Reorganise as *the same seed, previous positions cleared*,
 * so pressing it twice changes nothing and the canonical arrangement is reproducible.
 */
export const anchorsFor = (
  groups: readonly IdentityKey[],
  sizeOf: (key: IdentityKey) => number,
): Anchors => {
  let largest = 1;
  for (const group of groups) {
    const size = sizeOf(group);
    if (size > largest) largest = size;
  }
  const largestRadius = reservationRadius(BASE_RADIUS.service);
  const pitch = pitchFor(largest, largestRadius);
  const at = new Map<IdentityKey, Point>();
  groups.forEach((group, index) => {
    const cell = spiralPoint(index);
    at.set(group, { x: cell.x * pitch, y: cell.y * pitch });
  });
  // The orphan slot is the next one on the same spiral: FR-74 counts orphans and FR-35
  // treats them as a set, so they belong together and outside every zone, not scattered.
  const orphanCell = spiralPoint(groups.length);
  return {
    keys: groups,
    at,
    orphan: { x: orphanCell.x * pitch, y: orphanCell.y * pitch },
    spread: largestRadius * Math.sqrt(largest),
  };
};

// --- Which zone owns an object ----------------------------------------------

/**
 * The zone a multi-network object is placed in: the SMALLEST it belongs to, ties broken by
 * AD-7 key order.
 *
 * Smallest rather than first, because the smallest zone is the one that says most about the
 * object — a task on `frontend` and on a two-member `pgnet` reads as a database client, and
 * putting it in `frontend` with two hundred others says nothing. Ties go to the AD-7 order,
 * so the answer is total and survives a cluster where two zones happen to be the same size.
 */
export const dominantOf = (
  candidates: readonly IdentityKey[],
  sizeOf: (key: IdentityKey) => number,
): IdentityKey | null => {
  let best: IdentityKey | null = null;
  let bestSize = 0;
  for (const candidate of candidates) {
    const size = sizeOf(candidate);
    if (best === null || size < bestSize) {
      best = candidate;
      bestSize = size;
    }
  }
  return best;
};

// --- Seeded scatter ---------------------------------------------------------

/** The largest unsigned 32-bit draw, so `draw / UINT32_MAX` lands in `[0, 1]`. */
export const UINT32_MAX = 4294967295;

/**
 * A seeded offset inside a disc of radius `spread`, from the object's own key and the
 * layout seed.
 *
 * The randomness is `model`'s (AD-38): `seedOf` and `drawAt` are the one generator in the
 * product, and a second one here would be a second owner of the thing AD-6 and AD-8 both
 * rest on. Mapping a draw to `[-1, 1]` is a division and two arithmetic steps — no modulo,
 * no angle, no `Math.random`.
 *
 * `√u` on the radius is what makes the scatter uniform over the disc rather than piled at
 * the centre; the pair is then taken as a square offset rather than a polar one, because a
 * polar one needs a cosine.
 */
export const scatterOf = (key: IdentityKey, seed: number, spread: number): Point => {
  const own = seedOf(key) + seed;
  const across = (drawAt(own, 1) / UINT32_MAX) * 2 - 1;
  const down = (drawAt(own, 2) / UINT32_MAX) * 2 - 1;
  const pull = Math.sqrt(drawAt(own, 3) / UINT32_MAX);
  return { x: across * spread * pull, y: down * spread * pull };
};
