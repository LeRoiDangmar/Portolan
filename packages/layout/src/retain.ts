// retain — the survey path: survivors, arrivals, departures, and the retained cell.
//
// THE WHOLE OF AD-37 IS IN THIS FILE, WHICH IS WHY IT IS ONE FILE. *Positions are earned
// and kept* (FR-16) is a property no determinism test can see — determinism is *same input,
// same output* and never changes the input — so it is checkable only by reading one place
// and asking three questions of it: does a survivor move, where does an arrival go, and who
// releases a vanished object's cell.
//   - A SURVIVOR IS NOT TOUCHED. Not re-anchored, not nudged, not relaxed. Its placements
//     are copied across, coordinates and all.
//   - AN ARRIVAL IS PLACED NEAR ITS NEIGHBOURS, in space left free, on three rungs.
//   - A DEPARTURE'S CELL IS RETAINED. It fades in place, and its space is not reclaimed
//     until the next relayout — not on a timer, not when the exit animation ends, not when
//     the panel closes. `layout` creates the cell and `layout` releases it, and the release
//     is the arrangement path simply not carrying it. That is the single release point.
//
// "NEAR ITS NEIGHBOURS" MEANS SERVICE SIBLINGS FIRST. The 4th replica appears beside the
// other three, which is the case an operator actually watches, and it is reachable only
// through the `runs` edges — there is no membership array on a model object. Objects with
// no sibling fall back to the centroid of their already-placed edge-adjacent objects, then
// to their dominant group's anchor; a network, an orphan and a volume with nothing placed
// beside it resolve on that last rung.
//
// THE RELAXATION IS NOT CALLED FROM HERE, DELIBERATELY. It moves the whole population, and
// a survivor whose position moved because a stranger arrived no longer owns its position.

import type { IdentityKey, Point } from '@portolan/model';
import { compareIdentityKeys, seedOf } from '@portolan/model';

import type { SurveyIndex } from './anchors.ts';
import { dominantOf, radiusOf, relatedTo, scatterOf } from './anchors.ts';
import type { Mode, Placement, Positions } from './arrange.ts';
import { anchorPoint, partitioning, sortPlacements, zoneOf } from './arrange.ts';
import { emptySpace, reserve, settle } from './space.ts';

/** What one survey did to the last one. */
export interface Diff {
  /** Keys placed last time and present now, in AD-7 order. */
  readonly survivors: readonly IdentityKey[];
  /** Keys present now and not placed last time, in AD-7 order. */
  readonly arrivals: readonly IdentityKey[];
  /** Keys placed last time and gone now, in AD-7 order. */
  readonly departures: readonly IdentityKey[];
}

/** Everything that holds a position: the bodies, plus whichever groups anchor them. */
export const placedKeys = (index: SurveyIndex, mode: Mode): readonly IdentityKey[] =>
  [...index.bodies, ...(mode.nodeBackdrop ? index.nodes : index.networks)].sort(
    compareIdentityKeys,
  );

/**
 * The diff, by identity key and nothing else.
 *
 * AD-5's key is what survives a `docker stack deploy`: every container ID changes and every
 * slot does not, so the sharp case — a whole stack redeployed — reads here as no arrivals
 * and no departures at all, and nothing moves. That is AD-5 and AD-6 earning their keep,
 * and it costs this function nothing, because it never sees a container ID.
 */
export const diff = (previous: Positions, present: readonly IdentityKey[]): Diff => {
  const here = new Set(present);
  const before = new Set(previous.placements.map((placement) => placement.key));
  return {
    survivors: present.filter((key) => before.has(key)),
    arrivals: present.filter((key) => !before.has(key)),
    departures: [...before].filter((key) => !here.has(key)).sort(compareIdentityKeys),
  };
};

const groupBy = (placements: readonly Placement[]): Map<IdentityKey, Placement[]> => {
  const grouped = new Map<IdentityKey, Placement[]>();
  for (const placement of placements) {
    const existing = grouped.get(placement.key);
    if (existing === undefined) grouped.set(placement.key, [placement]);
    else existing.push(placement);
  }
  return grouped;
};

const centroidOf = (
  keys: readonly IdentityKey[],
  placed: ReadonlyMap<IdentityKey, Placement>,
): Point | null => {
  let x = 0;
  let y = 0;
  let count = 0;
  for (const key of keys) {
    const placement = placed.get(key);
    if (placement === undefined) continue;
    x += placement.x;
    y += placement.y;
    count += 1;
  }
  return count === 0 ? null : { x: x / count, y: y / count };
};

/**
 * Carry one survey's positions forward onto the next.
 *
 * `previous` must have been produced under the same `seed` and `mode` — `layout` checks
 * that and arranges from nothing when it is not true, because a mode change is one of
 * FR-16's three relayout actions and not a survey.
 */
export const carryForward = (
  previous: Positions,
  index: SurveyIndex,
  seed: number,
  mode: Mode,
): Positions => {
  const present = placedKeys(index, mode);
  const { arrivals, departures } = diff(previous, present);
  const before = groupBy(previous.placements);
  const retainedBefore = groupBy(previous.retained);
  const part = partitioning(index, mode);
  const networks = new Set(index.networks);
  const groups = new Set(part.groups);
  const here = new Set(present);

  // Which bodies each group holds, so a NEW group can be anchored on its own members rather
  // than on the spiral slot the arrangement path would have given it. A zone that appears
  // between two surveys belongs where its members already are; sending it to a fresh slot
  // would paint the field somewhere none of them is.
  const membersOf = new Map<IdentityKey, IdentityKey[]>();
  for (const body of index.bodies) {
    for (const group of part.homesOf(body)) {
      const existing = membersOf.get(group);
      if (existing === undefined) membersOf.set(group, [body]);
      else existing.push(body);
    }
  }

  const space = emptySpace();
  const kept: Placement[] = [];
  const retained: Placement[] = [];
  /** The one original placement of every key committed so far — what a centroid reads. */
  const placed = new Map<IdentityKey, Placement>();

  const commit = (placement: Placement): void => {
    kept.push(placement);
    reserve(space, { x: placement.x, y: placement.y, radius: placement.radius });
    if (placement.original) placed.set(placement.key, placement);
  };

  // 1. The retained cells of everything that vanished earlier and has not come back. Held
  //    first, so no arrival can be placed into one of them.
  for (const key of [...retainedBefore.keys()].sort(compareIdentityKeys)) {
    if (here.has(key)) continue;
    for (const cell of retainedBefore.get(key) ?? []) {
      retained.push(cell);
      reserve(space, { x: cell.x, y: cell.y, radius: cell.radius });
    }
  }

  // 2. Everything that departed this survey. Its cell joins them, unreclaimed.
  for (const key of departures) {
    for (const cell of before.get(key) ?? []) {
      retained.push(cell);
      reserve(space, { x: cell.x, y: cell.y, radius: cell.radius });
    }
  }

  // 3. The survivors, untouched. A placement is copied across coordinate for coordinate;
  //    the only thing that can change is the zone it NAMES, when that network has gone —
  //    and naming no zone is not moving.
  const echoes = mode.zoneMode === 'disjoint' && !mode.nodeBackdrop;
  for (const key of present) {
    const previousPlacements = before.get(key);
    if (previousPlacements === undefined) continue;
    let originalSeen = false;
    const survivorEchoes: Placement[] = [];
    for (const placement of previousPlacements) {
      const zoneGone = placement.zone !== null && !networks.has(placement.zone);
      if (placement.original) {
        originalSeen = true;
        commit(zoneGone ? { ...placement, zone: null } : placement);
      } else if (zoneGone) {
        // An echo of a zone that no longer exists. Its cell is retained like any other
        // vanished drawing — the object survives, but this COPY of it did not.
        retained.push(placement);
        reserve(space, { x: placement.x, y: placement.y, radius: placement.radius });
      } else {
        survivorEchoes.push(placement);
      }
    }
    for (const placement of survivorEchoes) {
      // Exactly one placement is the original. If the original's own drawing is the one
      // that went, the lowest-keyed echo is relabelled rather than moved — FR-16 is about
      // position, and a relabel moves nothing.
      commit(originalSeen ? placement : { ...placement, original: true });
      originalSeen = true;
    }
  }

  // 4. The arrivals, on the three rungs, into space left free.
  for (const key of arrivals) {
    const isGroup = groups.has(key);
    const radius = isGroup ? 0 : radiusOf(key);
    const returning = retainedBefore.get(key);

    if (returning !== undefined) {
      // It came back. Its own retained cell is exactly where it was, and nothing else was
      // allowed into it, so it lands back where it left — which is what retaining it was for.
      for (const cell of returning) commit(cell);
      continue;
    }

    // The three rungs. A group is anchored on its members instead: it is not placed NEAR
    // them, it is placed AMONG them, and *siblings* means nothing to a network.
    const preferred = isGroup
      ? (centroidOf(membersOf.get(key) ?? [], placed) ??
        part.anchors.at.get(key) ??
        part.anchors.orphan)
      : (centroidOf(relatedTo(index.siblings, key), placed) ??
        centroidOf(relatedTo(index.adjacent, key), placed) ??
        anchorPoint(part.anchors, dominantOf(part.homesOf(key), part.sizeOf)));

    // An anchor reserves nothing, so it is never settled: a zone field has no cell to keep
    // clear of, and pushing one out of a body would move the field off its own members.
    const point = isGroup ? preferred : settle(space, preferred, radius);
    commit({
      key,
      x: point.x,
      y: point.y,
      radius,
      zone: isGroup ? null : zoneOf(index, key),
      original: true,
    });
  }

  // 5. The echoes an existing object gained by joining a network it was not on.
  if (echoes) {
    const drawn = groupBy(kept);
    for (const key of index.bodies) {
      const already = new Set((drawn.get(key) ?? []).map((placement) => placement.zone));
      const radius = radiusOf(key);
      for (const zone of relatedTo(index.zones, key)) {
        if (already.has(zone)) continue;
        const anchor = anchorPoint(part.anchors, zone);
        const offset = scatterOf(key, seed + seedOf(zone), part.anchors.spread);
        const point = settle(space, { x: anchor.x + offset.x, y: anchor.y + offset.y }, radius);
        commit({ key, x: point.x, y: point.y, radius, zone, original: false });
      }
    }
  }

  return { placements: sortPlacements(kept), retained: sortPlacements(retained), seed, mode };
};
