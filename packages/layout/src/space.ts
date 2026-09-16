// space — AD-40's unbounded, unit-less space, and the one place a body is committed to it.
//
// NO CANVAS, NO VIEWPORT, NO DEVICE PIXEL. The space has no extent: it is the plane, and
// the camera (AD-39) maps whatever part of it a window can show. That is what makes a
// resize a camera move rather than a fourth relayout — AD-40 exists because a signature
// with a width in it reads as *pack into this box*, and every window resize then re-lays
// the map through a legitimate parameter that AD-3's invocation counter cannot see.
//
// A CELL IS A DISC, AND THE DISC IS THE RESERVATION. `model`'s `reservationRadius` gives
// the radius (AD-9, AD-38): the seeded jitter at its maximum, the curve's overshoot past
// it, the deform cap on every bearing at once, all at the roomiest density step, plus
// `spacing.cell-clearance`. Nothing here recomputes any of that. Two cells never intersect,
// so *bubbles never fuse and never overlap* (FR-13) is a property of this file's one
// predicate rather than of every caller's care.
//
// EVERYTHING IS `+ - * /` AND `Math.sqrt` (AD-8). There is no angle anywhere: {@link settle}
// pushes along the vector between two centres, which needs a length and no direction, and
// a length is a square root. No `Math.atan2`, no polar coordinate, no trigonometric spiral.

import type { Point } from '@portolan/model';
import { CELL_CLEARANCE } from '@portolan/model';

/** A reserved disc in the abstract space. */
export interface Cell {
  readonly x: number;
  readonly y: number;
  /** The reserved radius. A zone or partition anchor reserves nothing and carries 0. */
  readonly radius: number;
}

/**
 * The reserved cells of one arrangement.
 *
 * Deliberately a list and not an index. An index would be a second structure to keep in
 * AD-7 order, and at the reference scale — 396 objects, so under 80 000 pairs — the list is
 * the cheaper of the two to keep obviously correct.
 */
export interface Space {
  readonly cells: Cell[];
  /**
   * `max(x + radius)` over every reserved cell — the right edge of everything placed.
   *
   * Kept as the arrangement grows so {@link settle} always has somewhere provably free to
   * fall back to, which is what makes it total without a loop that might not terminate.
   */
  rightEdge: number;
}

/** A space with nothing in it. */
export const emptySpace = (): Space => ({ cells: [], rightEdge: 0 });

/** True when two cells intersect. Touching is not intersecting. */
export const overlaps = (a: Cell, b: Cell): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const reach = a.radius + b.radius;
  return dx * dx + dy * dy < reach * reach;
};

/** Reserve a cell, and nothing else. There is no release: AD-37 gives that to `retain`. */
export const reserve = (space: Space, cell: Cell): void => {
  space.cells.push(cell);
  const edge = cell.x + cell.radius;
  if (space.cells.length === 1 || edge > space.rightEdge) space.rightEdge = edge;
};

/**
 * The first reserved cell a candidate would intersect, in reservation order, or `undefined`.
 *
 * FIRST, not nearest. Reservation order is the AD-7 order the caller placed in, so the
 * answer does not depend on which cell happens to be closest — a tie between two equally
 * overlapping cells would otherwise be broken by floating-point noise.
 */
export const firstOverlap = (space: Space, candidate: Cell): Cell | undefined => {
  for (const cell of space.cells) {
    if (cell.radius === 0) continue;
    if (overlaps(cell, candidate)) return cell;
  }
  return undefined;
};

/** How many times {@link settle} pushes before it takes the free ground beyond everything. */
export const SETTLE_PUSHES = 64;

/**
 * A hair of extra separation, so a cell pushed clear lands clear.
 *
 * Unit-less like everything else here, and far below `spacing.cell-clearance`, which is
 * already inside the radius. It exists because `(reach / distance)` is a division and a
 * pushed centre can land a unit in the last place short of clear, which would leave
 * {@link firstOverlap} answering the same cell forever.
 */
export const SEPARATION = 1 / 1024;

/**
 * The free ground to the right of everything reserved.
 *
 * Provably free: every cell satisfies `x + radius ≤ rightEdge`, so a centre at
 * `rightEdge + radius + clearance` is further than `radius + cell.radius` from every one of
 * them in `x` alone. This is what lets {@link settle} be total — it never throws, never
 * loops unboundedly, and never returns a position that overlaps.
 */
export const beyondEverything = (space: Space, radius: number): Point => ({
  x: space.rightEdge + radius + CELL_CLEARANCE,
  y: 0,
});

/**
 * Commit a body: the preferred position if it is free, else pushed clear of what is in the
 * way, else the free ground beyond everything.
 *
 * This is the ONLY way a position is chosen, on both paths — the arrangement's and the
 * survey's — so *two reserved hulls never intersect* is one function's postcondition. It
 * does not reserve: the caller decides what to record, and an echo and its original are
 * committed by two separate calls.
 */
export const settle = (space: Space, preferred: Point, radius: number): Point => {
  let x = preferred.x;
  let y = preferred.y;
  for (let push = 0; push < SETTLE_PUSHES; push += 1) {
    const hit = firstOverlap(space, { x, y, radius });
    if (hit === undefined) return { x, y };
    const dx = x - hit.x;
    const dy = y - hit.y;
    const reach = hit.radius + radius + SEPARATION;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      // Exactly concentric: there is no direction to push along, so take a fixed one. Due
      // east, because the bearings the rest of the product is written against start there.
      x = hit.x + reach;
      y = hit.y;
      continue;
    }
    const scale = reach / distance;
    x = hit.x + dx * scale;
    y = hit.y + dy * scale;
  }
  return beyondEverything(space, radius);
};

/**
 * True when no two reserved cells intersect — the FR-13 floor, as a predicate.
 *
 * Here rather than in a test file because `layout.test.ts` asserting it with its own loop
 * would be a second reading of *overlap*, and the two could disagree about touching.
 */
export const isDisjoint = (cells: readonly Cell[]): boolean => {
  for (let i = 0; i < cells.length; i += 1) {
    const a = cells[i];
    if (a === undefined || a.radius === 0) continue;
    for (let j = i + 1; j < cells.length; j += 1) {
      const b = cells[j];
      if (b === undefined || b.radius === 0) continue;
      if (overlaps(a, b)) return false;
    }
  }
  return true;
};
