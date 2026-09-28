// layout — Pure (model, previousPositions, seed, mode) -> positions, in abstract space (AD-8, AD-40).
//
// THE ONE STATEFUL STAGE, AND ITS STATE IS ITS ARGUMENT. Every other stage of the pipeline
// is a pure function of its input; this one is too, and that is the trick AD-8 turns:
// *survey-derived state* — positions, retained cells, the identity of what was present last
// survey — is `layout`'s alone (AD-2), and it is carried by the caller as
// `previousPositions` rather than held in a module. So *why did the map move when it should
// not have* has exactly one place to look, and that place is a function signature.
//
// THE SIGNATURE IS EXACTLY `(model, previousPositions, seed, mode) → positions`. `mode`
// carries the zone mode and the node-backdrop flag and nothing else. NO CANVAS WIDTH, NO
// VIEWPORT, NO DEVICE PIXEL ENTERS THE STAGE (AD-40): positions are emitted in an unbounded,
// unit-less space and the camera maps that onto whatever canvas exists, so a window resize,
// the detail panel opening and a change of text size are camera moves and never relayouts.
// AD-40 exists because a measured width passed through a legitimate parameter would make
// every resize a fourth relayout that AD-3's invocation counter cannot see.
//
// ARITHMETIC IS `+ - * /` AND `Math.sqrt`, AND NOTHING ELSE. `Math.random`, every clock read
// and every transcendental — `sin`, `cos`, `tan`, `exp`, `log`, `pow`, `atan2` and their kin
// — are banned inside the stage (AD-8). The reason is not cross-architecture reproducibility
// but cross-BROWSER: layout runs in Chromium, Firefox and Safari (NFR-16), which AD-32's
// matrix does not test, and the transcendentals are implementation-approximated by
// ECMAScript deliberately. Only exactly-specified IEEE 754 arithmetic holds there without a
// test proving it. `layout.test.ts` asserts the ban over this package's own sources, because
// a prose ban that nothing reads is how it stops being true. The one seeded generator the
// stage uses is `model`'s (`seedOf`, `drawAt`), which is integer-only `Math.imul`.
//
// ONE KEY MAPS TO ONE OR MORE PLACEMENTS, EXACTLY ONE OF WHICH IS THE ORIGINAL. FR-40's
// disjoint zone mode draws a multi-network object once per zone, so `Positions` cannot be a
// key-to-point map without making that mode inexpressible. Fixing the shape here is the
// point of implementing all three branches in one story: `scene`, `view-state` and `harness`
// are written against it and no later story reopens it.
//
// WHAT IS NOT HERE, AND WHOSE IT IS. No stack-outline geometry, no zone field, no isoline,
// no edge routing — the scene's (FR-82: the outline follows where layout put its members and
// never asks for a position). No breathing phase, no tween, no lifecycle timer — frame-local
// in the screen rasteriser (AD-2). No camera, no zoom, no framing value (AD-1, AD-39). No
// node view and no service view surface: each is its own surface with its own layout (AD-33),
// and this is the overview.

export type { Mode, Placement, Positions, ZoneMode } from './arrange.ts';
export type { Anchors, BodyKind, Relation, SurveyIndex } from './anchors.ts';
export type { Diff } from './retain.ts';
export type { Cell, Space } from './space.ts';
export type { RelaxBody, RelaxLink } from './relax.ts';

export {
  BODY_KINDS,
  anchorsFor,
  dominantOf,
  indexSurvey,
  isBodyKey,
  pitchFor,
  radiusOf,
  relatedTo,
  scatterOf,
  spiralPoint,
} from './anchors.ts';
export { arrange, comparePlacements, partitioning, sortPlacements, zoneOf } from './arrange.ts';
export { countInvocation, layoutInvocations, resetInvocations } from './invocations.ts';
export { ANCHOR_PULL, EDGE_PULL, HULL_PUSH, RELAX_PASSES, relax } from './relax.ts';
export { carryForward, diff, placedKeys } from './retain.ts';
export { emptySpace, isDisjoint, overlaps, reserve, settle } from './space.ts';

import type { IdentityKey, Survey } from '@portolan/model';
import { sortSurvey } from '@portolan/model';

import type { Mode, Placement, Positions } from './arrange.ts';
import { arrange } from './arrange.ts';
import { indexSurvey } from './anchors.ts';
import { countInvocation } from './invocations.ts';
import { carryForward } from './retain.ts';

/** FR-40's default mode: blended tint fields, no node backdrop. The landing arrangement. */
export const DEFAULT_MODE: Mode = { zoneMode: 'blended', nodeBackdrop: false };

/** Positions with nothing in them — a cold start, and what Reorganise hands back in. */
export const EMPTY_POSITIONS: Positions = {
  placements: [],
  retained: [],
  seed: 0,
  mode: DEFAULT_MODE,
};

/** True when two modes are the same mode. A difference is one of FR-16's three actions. */
export const sameMode = (a: Mode, b: Mode): boolean =>
  a.zoneMode === b.zoneMode && a.nodeBackdrop === b.nodeBackdrop;

/**
 * The placements of one key, in AD-7 order, original first.
 *
 * A key the survey does not contain is ABSENT from the result rather than an error: picking
 * sends an identity key upward (AD-36) and a subject can vanish between the click and the
 * lookup, which is the case FR-56's frozen panel exists for. Answering nothing is the honest
 * answer to *where is it*; throwing would make a race in the chassis into an exception.
 */
export const placementsOf = (positions: Positions, key: IdentityKey): readonly Placement[] =>
  positions.placements.filter((placement) => placement.key === key);

/** The retained cell of a key, if it has one — a vanished object still holds its ground. */
export const retainedOf = (positions: Positions, key: IdentityKey): readonly Placement[] =>
  positions.retained.filter((placement) => placement.key === key);

/**
 * Lay out one survey. The whole of AD-8, as one function.
 *
 * IT DECIDES BETWEEN TWO PATHS AND NOTHING ELSE DOES.
 *   - The ARRANGEMENT path runs when the previous positions hold NEITHER a placement NOR a
 *     retained cell, or when the seed or the mode differ from the ones they were built
 *     under. Those are exactly FR-16's three actions: Reorganise clears the previous
 *     positions, and a change of zone mode or of the node backdrop changes `mode`. It
 *     anchors, seeds and relaxes the whole population, and it does not carry the retained
 *     cells — that is AD-37's single release point, and it is a line that is not here
 *     rather than a line that is.
 *   - The SURVEY path runs otherwise, INCLUDING when the last survey placed nothing but
 *     still holds retained cells. A cluster that empties and refills would otherwise
 *     release every cell on the survey after it emptied, which is a release outside the one
 *     point AD-37 allows.
 *   - The SURVEY path leaves survivors untouched, places arrivals near their neighbours in
 *     space left free, and retains departures' cells.
 *
 * The survey is sorted by AD-7's comparator on the way in. A model's collections are NOT
 * sorted by construction — only `sortSurvey` and `fromWire` sort — so two payloads that
 * differ only in collection order must be made to agree here or the map reshuffles between
 * two surveys of an unchanged cluster, which is the exact failure AD-7 exists to prevent.
 */
export const layout = (
  model: Survey,
  previousPositions: Positions | undefined,
  seed: number,
  mode: Mode,
): Positions => {
  countInvocation();
  const index = indexSurvey(sortSurvey(model));

  const carried =
    previousPositions !== undefined &&
    (previousPositions.placements.length > 0 || previousPositions.retained.length > 0) &&
    previousPositions.seed === seed &&
    sameMode(previousPositions.mode, mode);

  if (carried && previousPositions !== undefined) {
    return carryForward(previousPositions, index, seed, mode);
  }
  // `arrange` returns its placements already in AD-7 order.
  return { placements: arrange(index, seed, mode), retained: [], seed, mode };
};
