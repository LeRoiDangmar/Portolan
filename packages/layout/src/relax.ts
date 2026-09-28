// relax — the second half of the hybrid: a fixed number of passes of edge attraction
// against hull repulsion, so the edges lead where the anchors left room.
//
// A SEPARATE FILE SO THE ITERATION COUNT AND THE BAN ARE REVIEWABLE ON THEIR OWN. Everything
// AD-8 forbids would be forbidden here first — this is the only part of the stage that
// looks like a physics loop, and every force-directed layout in existence reaches for
// `Math.atan2`, `Math.cos`, a random restart or a wall-clock budget. None of the four is
// available. What is here is `+ - * /` and `Math.sqrt`, a count fixed at
// {@link RELAX_PASSES}, and an order that is the caller's, which is AD-7's.
//
// NO LAYOUT LIBRARY, AND THAT IS A CONSEQUENCE RATHER THAN A PREFERENCE. Every candidate
// resolves positions with transcendentals somewhere — a polar step, an angular spread, a
// simulated-annealing temperature read from a clock — so adopting one would mean adopting
// its arithmetic, and AD-8 bans it. The spine already calls a layout library *seed, not
// spine*: the contract is the signature, and this file is one implementation of it.
//
// JACOBI, NOT GAUSS-SEIDEL. Every pass computes the whole displacement field from the
// positions at the START of the pass and applies it at the end, so no body sees another's
// half-updated position. The result then depends on the ORDER OF SUMMATION alone, which is
// the caller's AD-7 order, and not on which body happened to be visited first.
//
// IT RUNS ON A RELAYOUT AND NEVER ON A SURVEY. Relaxation moves the whole population; a
// survivor whose position moved because a stranger arrived no longer owns its position, and
// FR-16 says it does. `retain.ts` is the survey path and never calls this.

import type { IdentityKey, Point } from '@portolan/model';

/** One body in the relaxation: where it is pulled, and how much room it takes. */
export interface RelaxBody {
  readonly key: IdentityKey;
  readonly radius: number;
  /** The zone or partition anchor it belongs to — the *zone owns position* half. */
  readonly anchor: Point;
}

/** One attraction, by index into the body list. Both directions are the same link. */
export interface RelaxLink {
  readonly from: number;
  readonly to: number;
}

/**
 * How many passes. Fixed, as AD-8 requires — not *until it converges*, which is a clock or
 * a tolerance, and a tolerance is a decision taken by floating-point noise.
 *
 * Twenty-four is enough for a link to pull a body most of the way across one zone at
 * {@link EDGE_PULL}, and short enough that the arrangement still reads as the anchors'.
 */
export const RELAX_PASSES = 24;

/** How much of the pull toward its own anchor a body takes per pass. */
export const ANCHOR_PULL = 0.06;

/** How much of a link's slack is taken up per pass, shared between its two ends. */
export const EDGE_PULL = 0.1;

/** How much of an overlap is resolved per pass, shared between the two hulls. */
export const HULL_PUSH = 0.5;

const at = (points: readonly Point[], index: number): Point => {
  const point = points[index];
  // Unreachable: every index comes from a loop over the same array. `noUncheckedIndexedAccess`
  // cannot see that, and a throw is cheaper than a claim.
  if (point === undefined) throw new Error('relax: body index out of range');
  return point;
};

const bodyAt = (bodies: readonly RelaxBody[], index: number): RelaxBody => {
  const body = bodies[index];
  if (body === undefined) throw new Error('relax: body index out of range');
  return body;
};

/**
 * Run the relaxation and return the resolved positions, in the input's order.
 *
 * It does NOT guarantee disjoint hulls — `HULL_PUSH` resolves a fixed share of each overlap
 * per pass, so a pathological start can still finish with two hulls touching. The guarantee
 * is `space.settle`'s, which commits every body afterwards; putting it here as well would
 * be two owners of the FR-13 floor, and AD-38 is exactly the rule against that.
 */
export const relax = (
  bodies: readonly RelaxBody[],
  links: readonly RelaxLink[],
  start: readonly Point[],
  passes: number,
): readonly Point[] => {
  let positions = [...start];
  const shiftX = new Array<number>(bodies.length).fill(0);
  const shiftY = new Array<number>(bodies.length).fill(0);

  for (let pass = 0; pass < passes; pass += 1) {
    shiftX.fill(0);
    shiftY.fill(0);

    // The anchors pull. `DESIGN.md`'s *the zone owns position*, as a force rather than as a
    // veto, which is what lets the edges move a body out of its zone's middle without
    // letting them drag it into another zone entirely.
    for (let index = 0; index < bodies.length; index += 1) {
      const body = bodyAt(bodies, index);
      const here = at(positions, index);
      shiftX[index] = (body.anchor.x - here.x) * ANCHOR_PULL;
      shiftY[index] = (body.anchor.y - here.y) * ANCHOR_PULL;
    }

    // The edges pull, but only the slack: two bodies whose hulls already touch are as close
    // as FR-13 allows, so there is nothing left to take up and the link stops pulling.
    for (const link of links) {
      const from = at(positions, link.from);
      const to = at(positions, link.to);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const rest = bodyAt(bodies, link.from).radius + bodyAt(bodies, link.to).radius;
      if (distance <= rest || distance === 0) continue;
      const share = ((distance - rest) * EDGE_PULL) / 2 / distance;
      shiftX[link.from] = (shiftX[link.from] ?? 0) + dx * share;
      shiftY[link.from] = (shiftY[link.from] ?? 0) + dy * share;
      shiftX[link.to] = (shiftX[link.to] ?? 0) - dx * share;
      shiftY[link.to] = (shiftY[link.to] ?? 0) - dy * share;
    }

    // The hulls push. Pairwise over the BODIES — not over the survey: AD-29's reference
    // cluster is 396 objects, of which 365 are bodies (40 services, 300 containers, 25
    // volumes; nodes, networks and stacks take no cell), so 66 430 pairs. A cost worth
    // naming and worth paying, because a spatial index would be a second structure with an
    // order of its own and AD-7 would have to reach into it.
    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = at(positions, i);
        const b = at(positions, j);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const reach = bodyAt(bodies, i).radius + bodyAt(bodies, j).radius;
        const squared = dx * dx + dy * dy;
        if (squared >= reach * reach) continue;
        const distance = Math.sqrt(squared);
        if (distance === 0) {
          // Concentric: no direction to push along, so take the fixed one, due east.
          const half = (reach * HULL_PUSH) / 2;
          shiftX[i] = (shiftX[i] ?? 0) - half;
          shiftX[j] = (shiftX[j] ?? 0) + half;
          continue;
        }
        const share = ((reach - distance) * HULL_PUSH) / 2 / distance;
        shiftX[i] = (shiftX[i] ?? 0) - dx * share;
        shiftY[i] = (shiftY[i] ?? 0) - dy * share;
        shiftX[j] = (shiftX[j] ?? 0) + dx * share;
        shiftY[j] = (shiftY[j] ?? 0) + dy * share;
      }
    }

    positions = positions.map((point, index) => ({
      x: point.x + (shiftX[index] ?? 0),
      y: point.y + (shiftY[index] ?? 0),
    }));
  }

  return positions;
};
