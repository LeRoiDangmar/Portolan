// arrange — the three branches of `mode`, over the two halves of the hybrid, in one file so
// a reviewer reads all three arrangements side by side instead of following calls.
//
// THREE BRANCHES, AND THE THIRD REPLACES THE ANCHORING WHOLESALE.
//   - blended zones (FR-40's default, and therefore the exported frame): one anchor per
//     network, one placement per object;
//   - disjoint blobs with echo copies (FR-40's second mode): the same anchors, and a
//     multi-network object is drawn once per zone it belongs to;
//   - the node backdrop (FR-41): the partition is by node, zones lose the POSITIONAL
//     channel, and the anchors are the nodes' rather than the networks'.
// The backdrop composes with neither zone mode, and that is a decision: an echo exists
// because two disjoint blobs cannot both contain one object, and with the backdrop on the
// blobs are not what places anything. FR-41's *only one mark may own position on a surface*
// is the same sentence read from the other side.
//
// ONE KEY, ONE OR MORE PLACEMENTS — exactly one of which is the original. Fixing that shape
// here is the point of doing all three branches in one story: `scene`, `view-state` and
// `harness` are written against it and no later story reopens it. FR-26's *selecting a
// duplicated rendering selects the object, not the copy* is free, because every copy
// carries the same identity key.
//
// NOTHING HERE READS A CANVAS. The output is AD-40's unbounded, unit-less space.

import type { IdentityKey, Point } from '@portolan/model';
import { compareIdentityKeys, seedOf } from '@portolan/model';

import type { Anchors, SurveyIndex } from './anchors.ts';
import { anchorsFor, dominantOf, radiusOf, relatedTo, scatterOf } from './anchors.ts';
import type { RelaxLink } from './relax.ts';
import { RELAX_PASSES, relax } from './relax.ts';
import { emptySpace, reserve, settle } from './space.ts';

// --- The shape of the answer ------------------------------------------------

/** FR-40's two zone renderings. The layout branch differs; the drawing is the scene's. */
export type ZoneMode = 'blended' | 'disjoint';

/**
 * Every restored relayout parameter, and NOTHING else (AD-8, AD-40).
 *
 * Two fields, because FR-16 names two of its three actions as parameters — the zone mode
 * and the node backdrop — and Reorganise is the third, which is not a parameter but the
 * absence of previous positions. No canvas width, no viewport, no device pixel ratio: AD-40
 * exists because a measured width passed through a legitimate parameter makes every window
 * resize a relayout that AD-3's invocation counter cannot see.
 */
export interface Mode {
  readonly zoneMode: ZoneMode;
  readonly nodeBackdrop: boolean;
}

/** One drawing of one object, in the abstract space. */
export interface Placement {
  readonly key: IdentityKey;
  readonly x: number;
  readonly y: number;
  /**
   * The reserved radius (AD-9's hull, AD-8's maximum density step, plus clearance).
   *
   * `0` for a zone or partition anchor, which is a point rather than a body: a network zone
   * is a field with no boundary and reserves nothing.
   */
  readonly radius: number;
  /** The network zone this placement was placed in, or `null` for none. */
  readonly zone: IdentityKey | null;
  /** True for the one original placement of this key; false for an echo. */
  readonly original: boolean;
}

/**
 * The layout's whole output, and the value handed back in as `previousPositions`.
 *
 * `seed` and `mode` travel with it because a relayout is *previous positions cleared* OR a
 * changed parameter, and a caller that had to remember which mode a position set was built
 * under would be holding layout state outside layout (AD-2).
 */
export interface Positions {
  /** Every placement, in AD-7 key order; per key, the original first, then echoes by zone. */
  readonly placements: readonly Placement[];
  /** The cells of objects that have vanished — held, not reclaimed, until a relayout (AD-37). */
  readonly retained: readonly Placement[];
  readonly seed: number;
  readonly mode: Mode;
}

/** The AD-7 order over placements: key, then original before echo, then zone. */
export const comparePlacements = (a: Placement, b: Placement): number => {
  const byKey = compareIdentityKeys(a.key, b.key);
  if (byKey !== 0) return byKey;
  if (a.original !== b.original) return a.original ? -1 : 1;
  if (a.zone === null) return b.zone === null ? 0 : -1;
  if (b.zone === null) return 1;
  return compareIdentityKeys(a.zone, b.zone);
};

/** Placements in AD-7 order, as a new array. */
export const sortPlacements = (placements: readonly Placement[]): readonly Placement[] =>
  [...placements].sort(comparePlacements);

// --- Which dimension places, and how big each group is ----------------------

/** The partition in force: the networks, or — under the backdrop — the nodes. */
export interface Partitioning {
  /** The groups, in AD-7 order: networks, or nodes under the backdrop. */
  readonly groups: readonly IdentityKey[];
  readonly anchors: Anchors;
  readonly sizeOf: (key: IdentityKey) => number;
  /** The groups a body belongs to, in AD-7 order. */
  readonly homesOf: (key: IdentityKey) => readonly IdentityKey[];
}

/**
 * Read the survey as whichever partition `mode` puts in charge of position.
 *
 * This is the one place the backdrop branch diverges, and it diverges completely: with it
 * on, the anchors are the nodes' and a body's home is the node that hosts it; with it off,
 * the anchors are the networks' and a body's home is its dominant zone.
 */
export const partitioning = (index: SurveyIndex, mode: Mode): Partitioning => {
  if (mode.nodeBackdrop) {
    const size = new Map<IdentityKey, number>();
    for (const body of index.bodies) {
      for (const node of relatedTo(index.partitions, body)) {
        size.set(node, (size.get(node) ?? 0) + 1);
      }
    }
    const sizeOf = (key: IdentityKey): number => size.get(key) ?? 0;
    return {
      groups: index.nodes,
      anchors: anchorsFor(index.nodes, sizeOf),
      sizeOf,
      homesOf: (key) => relatedTo(index.partitions, key),
    };
  }
  const sizeOf = (key: IdentityKey): number => index.zoneSize.get(key) ?? 0;
  return {
    groups: index.networks,
    anchors: anchorsFor(index.networks, sizeOf),
    sizeOf,
    homesOf: (key) => relatedTo(index.zones, key),
  };
};

/** Where a group's anchor is, or the orphan slot when the object belongs to no group. */
export const anchorPoint = (anchors: Anchors, home: IdentityKey | null): Point =>
  (home === null ? undefined : anchors.at.get(home)) ?? anchors.orphan;

/**
 * The network zone a placement records, which is NOT always what placed it.
 *
 * Under the backdrop the node places and the zone is still drawn as a field — FR-41 takes
 * the positional channel away from the zones, not the zones themselves — so the placement
 * keeps naming its dominant network either way.
 */
export const zoneOf = (index: SurveyIndex, key: IdentityKey): IdentityKey | null =>
  dominantOf(relatedTo(index.zones, key), (zone) => index.zoneSize.get(zone) ?? 0);

// --- The arrangement --------------------------------------------------------

/**
 * Lay the whole population out from nothing: anchors, seeded members, relaxation, commit.
 *
 * This is the RELAYOUT path and the only caller of {@link relax}. FR-16's three actions all
 * arrive here — Reorganise with previous positions cleared, and each of the two mode
 * changes — and a survey never does.
 */
export const arrange = (index: SurveyIndex, seed: number, mode: Mode): readonly Placement[] => {
  const part = partitioning(index, mode);
  const bodies = index.bodies;

  const slot = new Map<IdentityKey, number>();
  bodies.forEach((key, position) => slot.set(key, position));

  const relaxBodies = bodies.map((key) => ({
    key,
    radius: radiusOf(key),
    anchor: anchorPoint(part.anchors, dominantOf(part.homesOf(key), part.sizeOf)),
  }));

  // Seeded around the anchor of the group that owns it. The scatter is the only place the
  // layout seed enters, so Reorganise with the same seed reproduces this exactly.
  const start = relaxBodies.map((body) => {
    const offset = scatterOf(body.key, seed, part.anchors.spread);
    return { x: body.anchor.x + offset.x, y: body.anchor.y + offset.y };
  });

  // Which group each body answers to, kept so the backdrop branch can ask whether a link
  // crosses a partition.
  const homes = new Map<IdentityKey, IdentityKey | null>();
  for (const key of bodies) homes.set(key, dominantOf(part.homesOf(key), part.sizeOf));

  const links: RelaxLink[] = [];
  for (const key of bodies) {
    const from = slot.get(key);
    if (from === undefined) continue;
    for (const other of relatedTo(index.adjacent, key)) {
      const to = slot.get(other);
      // Each pair once, in AD-7 order, so the summation order is the key order.
      if (to === undefined || to <= from) continue;
      // UNDER THE BACKDROP A LINK NEVER CROSSES A PARTITION. FR-41 reimposes the node
      // partition and says only one mark may own position on a surface; a link pulling a
      // task toward a peer on another machine would leave the machine owning position only
      // approximately, which is the failure the backdrop is off by default to avoid. Zones
      // are different and the link is left alone there: zones OVERLAP by construction, so a
      // body drawn between two of its own is telling the truth.
      if (mode.nodeBackdrop && homes.get(key) !== homes.get(other)) continue;
      links.push({ from, to });
    }
  }

  const relaxed = relax(relaxBodies, links, start, RELAX_PASSES);

  // Committed in AD-7 order, into a space that starts empty. `settle` is what makes two
  // reserved hulls never intersect; the relaxation only ever proposed.
  const space = emptySpace();
  const placements: Placement[] = [];
  relaxBodies.forEach((body, position) => {
    const preferred = relaxed[position] ?? body.anchor;
    const point = settle(space, preferred, body.radius);
    reserve(space, { x: point.x, y: point.y, radius: body.radius });
    placements.push({
      key: body.key,
      x: point.x,
      y: point.y,
      radius: body.radius,
      zone: zoneOf(index, body.key),
      original: true,
    });
  });

  // The echoes, after every original, so an echo never displaces an original. Disjoint
  // zones only: with blended fields one drawing carries every zone the object is in, and
  // with the backdrop on the zones do not place at all.
  if (mode.zoneMode === 'disjoint' && !mode.nodeBackdrop) {
    for (const key of bodies) {
      const radius = radiusOf(key);
      const home = zoneOf(index, key);
      for (const zone of relatedTo(index.zones, key)) {
        if (zone === home) continue;
        const anchor = anchorPoint(part.anchors, zone);
        // Seeded from the object AND the zone it is echoed into, so two echoes of one
        // object land in two different places and two objects echoed into one zone do not
        // land on top of each other.
        const offset = scatterOf(key, seed + seedOf(zone), part.anchors.spread);
        const point = settle(space, { x: anchor.x + offset.x, y: anchor.y + offset.y }, radius);
        reserve(space, { x: point.x, y: point.y, radius });
        placements.push({ key, x: point.x, y: point.y, radius, zone, original: false });
      }
    }
  }

  // The anchors themselves, as placements that reserve nothing. A zone is a field with no
  // boundary and a node backdrop is a region, so neither takes a cell — but the scene needs
  // to know where the field is centred, and AD-38 says that is computed once, here.
  for (const group of part.groups) {
    const point = part.anchors.at.get(group);
    if (point === undefined) continue;
    placements.push({ key: group, x: point.x, y: point.y, radius: 0, zone: null, original: true });
  }

  return sortPlacements(placements);
};
