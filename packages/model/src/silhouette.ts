// silhouette — AD-6: the deterministic shape seed is the AD-5 identity key.
//
// TWO CHANNELS, ONE OWNER. The seeded contour is the RECOGNITION half of FR-13: a pure
// function of the identity key, with no neighbour and no position as input. The
// link-driven deform — radial extension along every link bearing, cos² falloff over ±38°,
// capped at +32% — is the DATA half. AD-38 makes `model` the one computing owner of both,
// and AD-9 puts the two ends of *reserve* and *draw* behind ONE EXPORTED FUNCTION:
// {@link bubbleHull}. `layout` calls it with no links to reserve, `scene` calls it with
// the links to draw, and there is no second copy of either.
//
// THE RESERVATION IS THE WORST CASE, NOT THE DRAWN SHAPE. AD-8 reserves the deformed hull
// BEFORE placement, at the roomiest `density.scale` step and at the worst case FR-70
// permits — +32% of base radius on EVERY bearing at once — plus `spacing.cell-clearance`.
// That is what makes the reservation independent of the link bearings, which layout does
// not yet know when it reserves: the drawn hull always fits inside the reserved one, so
// *bubbles never fuse and never overlap* holds without the reservation knowing the final
// stretch, and density only shrinks bodies inside space already reserved.
//
// THE VALUES ARE `packages/tokens/src/shape.ts`'s, TRANSCRIBED — `bubble.silhouette`
// fixes the geometry (closed cubic Bézier, 28 control points), the amplitude (±11% of base
// radius) and the seed (the AD-5 identity key, superseding `DESIGN.md` and FR-13);
// `bubble.core` the invariant rectangle the contour may never cross; `bubble.radius` the
// base radii. They are transcribed rather than imported because `packages/model` imports
// NOTHING (AD-2, `dependency-graph.json`) — `shape.ts` stays normative, and
// `silhouette.test.ts` plus this story's manual check read the two side by side.
//
// NO TRANSCENDENTAL, ANYWHERE. AD-8 bans `Math.sin`, `cos`, `pow`, `atan2` and their kin
// inside `layout` so determinism survives Chromium, Firefox and Safari without a test
// proving it — they are implementation-approximated by ECMAScript, deliberately. The
// silhouette is an INPUT to layout's reservation, so a transcendental here would defeat
// the ban from one stage upstream. It is avoidable and avoided: the 28 control points sit
// at fixed angles, so their sines and cosines are the 28 literal constants below, and
// everything else is `+ - * /` and `Math.imul`, all of which IEEE 754 and ECMAScript
// specify exactly.

import type { IdentityKey } from './identity.ts';

/** `shape.bubble.silhouette.geometry`: 28 control points. */
export const SILHOUETTE_POINTS = 28;

/** `shape.bubble.silhouette.amplitude`: ±11% of base radius. */
export const SILHOUETTE_AMPLITUDE = 0.11;

/** `shape.bubble.radius`, at `density.scale` 1.00, LOD rung 0. */
export const BASE_RADIUS = {
  service: 54,
  container: 46,
  volume: 32,
} as const;

/** A bubble kind — the three object kinds drawn as a body. */
export type BubbleKind = keyof typeof BASE_RADIUS;

/**
 * `shape.bubble.core.geometry`: 0.59w × 0.50h of the undeformed bounding box.
 *
 * The rectangle carries the name, the identifier and the pastille rail, and the contour
 * may never cross it — `shape.bubble.silhouette.floor`.
 *
 * THE UNDEFORMED BOUNDING BOX IS `2·baseRadius` SQUARE, not the box the seeded contour
 * happens to occupy. `shape.pastille.capacity` pins it by its own arithmetic — *at 0.59 ×
 * 2r — service 63.7px, container 54.3px, volume 37.8px* — and `shape.bubble.core.rule`
 * calls the rectangle INVARIANT. Measuring the jittered control points instead would make
 * the core a per-object value, so the pastille rail that must fit inside it would have a
 * different width for every object, and *invariant* would be false.
 */
export const CORE_FRACTION = {
  width: 0.59,
  height: 0.5,
} as const;

/** A point in the bubble's own space, origin at the body centre. Unit-less (AD-40). */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * The 28 fixed bearings, one per control point, as literal unit vectors.
 *
 * `cos` and `sin` of `i · 360°/28`, written out because AD-8 bans computing them. Eight
 * distinct magnitudes — `cos(k · 360°/28)` for `k` in `0…7`, of which `0` and `1` are
 * exact — carry all 28: the table is built from the first octant by exact sign and swap,
 * so the star is exactly symmetric rather than symmetric to within a unit in the last
 * place.
 */
export const BEARINGS: readonly Point[] = [
  { x: 1, y: 0 },
  { x: 0.9749279121818236, y: 0.2225209339563144 },
  { x: 0.9009688679024191, y: 0.4338837391175582 },
  { x: 0.7818314824680298, y: 0.6234898018587336 },
  { x: 0.6234898018587336, y: 0.7818314824680298 },
  { x: 0.4338837391175582, y: 0.9009688679024191 },
  { x: 0.2225209339563144, y: 0.9749279121818236 },
  { x: 0, y: 1 },
  { x: -0.2225209339563144, y: 0.9749279121818236 },
  { x: -0.4338837391175582, y: 0.9009688679024191 },
  { x: -0.6234898018587336, y: 0.7818314824680298 },
  { x: -0.7818314824680298, y: 0.6234898018587336 },
  { x: -0.9009688679024191, y: 0.4338837391175582 },
  { x: -0.9749279121818236, y: 0.2225209339563144 },
  { x: -1, y: 0 },
  { x: -0.9749279121818236, y: -0.2225209339563144 },
  { x: -0.9009688679024191, y: -0.4338837391175582 },
  { x: -0.7818314824680298, y: -0.6234898018587336 },
  { x: -0.6234898018587336, y: -0.7818314824680298 },
  { x: -0.4338837391175582, y: -0.9009688679024191 },
  { x: -0.2225209339563144, y: -0.9749279121818236 },
  { x: 0, y: -1 },
  { x: 0.2225209339563144, y: -0.9749279121818236 },
  { x: 0.4338837391175582, y: -0.9009688679024191 },
  { x: 0.6234898018587336, y: -0.7818314824680298 },
  { x: 0.7818314824680298, y: -0.6234898018587336 },
  { x: 0.9009688679024191, y: -0.4338837391175582 },
  { x: 0.9749279121818236, y: -0.2225209339563144 },
];

/** One of the 28 control points. */
export interface ContourPoint {
  /** The fixed bearing. Never seeded, never deformed. */
  readonly bearing: Point;
  /**
   * The seeded deviation, a fraction of the base radius in `[-0.11, +0.11]`.
   *
   * Kept beside `radius` because the deform is additive on this channel: AD-38's
   * link-driven extension adds to it, up to `shape.bubble.deform.max`, rather than
   * replacing a coordinate it cannot see inside.
   */
  readonly amplitude: number;
  /** `baseRadius · (1 + amplitude + deform)`, and the deform is 0 without links. */
  readonly radius: number;
  /** `bearing · radius`. Derived, and kept so no consumer recomputes it (AD-38). */
  readonly point: Point;
}

/** One cubic segment of the closed contour. */
export interface CubicSegment {
  readonly from: Point;
  readonly control1: Point;
  readonly control2: Point;
  readonly to: Point;
}

/** A rectangle centred on the body centre, given by its half-extents. */
export interface CoreRect {
  readonly halfWidth: number;
  readonly halfHeight: number;
}

/**
 * One control point of a deformed hull: a {@link ContourPoint} that also says how much of
 * its radius the links bought.
 *
 * Separate from {@link ContourPoint} rather than a field on it, because `silhouette`'s
 * output is pinned byte for byte by committed digests (AD-6) and a field added there would
 * move every one of them.
 */
export interface HullPoint extends ContourPoint {
  /** The link-driven extension, a fraction of the base radius in `[0, 0.32]`. */
  readonly deform: number;
}

/** The seeded contour of one object. */
export interface Silhouette {
  /** The AD-5 identity key it was seeded from, and the only input that varies. */
  readonly key: IdentityKey;
  /** `shape.bubble.radius` for the object's kind, at `density.scale` 1.00. */
  readonly baseRadius: number;
  /** The 28 control points, in bearing order. */
  readonly points: readonly ContourPoint[];
  /** The 28 closed cubic segments joining them. */
  readonly segments: readonly CubicSegment[];
  /** The invariant rectangle the contour never crosses. */
  readonly core: CoreRect;
}

/**
 * A silhouette with its links applied and its reservation resolved — the one value AD-9
 * puts behind a single function so `layout` reserves with exactly what `scene` draws.
 */
export interface BubbleHull extends Silhouette {
  /** The 28 control points, each carrying the extension its links bought. */
  readonly points: readonly HullPoint[];
  /** The link bearings the deform was computed from, as given. */
  readonly linkBearings: readonly Point[];
  /**
   * The radius of the disc `layout` reserves for this body, clearance included.
   *
   * A function of the base radius alone — NOT of the links and NOT of the seed. See the
   * file header: the reservation is the worst case FR-70 permits, so it is knowable before
   * any position exists, which is the only order AD-8 allows.
   */
  readonly reservation: number;
}

// --- The seed ---------------------------------------------------------------

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/**
 * FNV-1a over the key's UTF-16 code units, byte by byte.
 *
 * Integer-only: `Math.imul` is the exact 32-bit product ECMAScript specifies, so the same
 * key yields the same 32 bits in every engine on every architecture — which is what makes
 * the contour byte-identical in two processes.
 *
 * Exported because `layout` needs seeded draws of its own (AD-8's *fixed seed*) and may
 * not mint a second generator: a package that wrote its own would be a second owner of the
 * one thing AD-6 and AD-8 both rest on. Reaching this one keeps every bit of randomness in
 * the product behind `Math.imul` and integer arithmetic, one stage upstream of the ban.
 */
export const seedOf = (key: string): number => {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < key.length; index += 1) {
    const unit = key.charCodeAt(index);
    hash = Math.imul(hash ^ (unit & 0xff), FNV_PRIME);
    hash = Math.imul(hash ^ (unit >>> 8), FNV_PRIME);
  }
  return hash >>> 0;
};

/**
 * One 32-bit draw per index, avalanched so adjacent indices do not correlate.
 *
 * Exported for the same reason as {@link seedOf}: it is the whole of the product's
 * randomness, and `layout` reaches it rather than owning a second copy. The result is an
 * unsigned 32-bit integer, so a consumer reaches `[0, 1]` by dividing by `0xffffffff` and
 * needs no modulo of its own.
 */
export const drawAt = (seed: number, index: number): number => {
  let hash = Math.imul(seed ^ (index + 1), FNV_PRIME) >>> 0;
  hash = (hash ^ (hash >>> 15)) >>> 0;
  hash = Math.imul(hash, FNV_PRIME) >>> 0;
  hash = (hash ^ (hash >>> 13)) >>> 0;
  return hash >>> 0;
};

/** The draw resolves to one of 2001 steps across the full ±11% band. */
export const AMPLITUDE_STEPS = 2001;

/**
 * The seeded deviation of one control point, in `[-0.11, +0.11]`.
 *
 * Exported because it is the whole of AD-6's determinism claim, and a test that can only
 * reach it through the assembled silhouette cannot say which half failed.
 */
export const amplitudeAt = (key: IdentityKey, index: number): number =>
  (((drawAt(seedOf(key), index) % AMPLITUDE_STEPS) - (AMPLITUDE_STEPS - 1) / 2) /
    ((AMPLITUDE_STEPS - 1) / 2)) *
  SILHOUETTE_AMPLITUDE;

// --- The deform (FR-13's data channel, FR-70's cap) -------------------------

/** `shape.bubble.deform.max` and `.cap`: +32% of base radius, whatever the link count. */
export const DEFORM_MAX = 0.32;

/** `shape.bubble.deform.falloff`: the half-band, in degrees — `cos² over ±38°`. */
export const DEFORM_BAND_DEGREES = 38;

/**
 * `cos(38°)`, written out.
 *
 * The one place the band's cosine appears, and it is a literal for the same reason the 28
 * bearings are: AD-8 bans computing it one stage downstream, and a constant computed here
 * would be a transcendental smuggled into layout's input.
 */
export const DEFORM_BAND_COSINE = 0.788010753606722;

/**
 * `shape.bubble.deform.falloff`, as arithmetic AD-8 permits.
 *
 * The token reads `cos² over ±38°` and `Math.cos` is banned in the stage that consumes
 * this, so the falloff is written as a polynomial the ban allows. Substituting
 * `t = (1 − cos θ) / (1 − cos 38°)` — which is `(θ/38°)²` to second order, and needs only
 * the dot product a caller already has — the smoothstep `1 − 3t + 2t√t` agrees with
 * `cos²(90°·θ/38°)` to within 0.0167 across the whole band, measured at 10⁵ samples. Both
 * forms are 1 at the bearing, 0 at ±38°, ½ at ±19°, and flat at both ends.
 *
 * `cosine` is the cosine of the angle between a control point's bearing and a link's,
 * which is their dot product because both are unit vectors. Everything here is
 * `+ - * /` and `Math.sqrt`.
 */
export const deformFalloff = (cosine: number): number => {
  if (cosine >= 1) return 1;
  if (cosine <= DEFORM_BAND_COSINE) return 0;
  const t = (1 - cosine) / (1 - DEFORM_BAND_COSINE);
  return 1 - 3 * t + 2 * t * Math.sqrt(t);
};

/**
 * The extension one control point earns from a set of link bearings, as a fraction of the
 * base radius in `[0, 0.32]`.
 *
 * `shape.bubble.deform.squash` is `none — neighbours never flatten each other`, and that
 * is structural here rather than checked: every term is non-negative, so a link can only
 * ever ADD radius. FR-70's *a silhouette must not depend on who is next to it* then holds
 * because the input is the object's own links and nothing about its neighbourhood.
 *
 * `shape.bubble.deform.cap` is `+32% total, whatever the link count`, so the weights are
 * summed and the SUM is capped — not each term. A single-link object therefore reaches the
 * full +32% on its one bearing, which is `.degenerate`'s teardrop.
 */
export const deformAt = (bearing: Point, linkBearings: readonly Point[]): number => {
  let weight = 0;
  for (const link of linkBearings) {
    const length = Math.sqrt(link.x * link.x + link.y * link.y);
    if (length === 0) continue;
    weight += deformFalloff((bearing.x * link.x + bearing.y * link.y) / length);
  }
  return (weight > 1 ? 1 : weight) * DEFORM_MAX;
};

// --- The reservation (AD-8, AD-9) -------------------------------------------

/** `spacing['cell-clearance']`: 8px. `density.scale.affects` excludes it, deliberately. */
export const CELL_CLEARANCE = 8;

/**
 * `density.scale`'s roomiest step, `1.20`.
 *
 * AD-8 reads `scale` as the RESERVATION MAXIMUM: reserve at the roomiest step, and density
 * then only shrinks rendered bodies inside space already reserved — which is what keeps
 * FR-16's three relayout actions three.
 */
export const DENSITY_MAX = 1.2;

/**
 * How far a Catmull–Rom segment may bulge past the control points it joins, as a fraction
 * of the base radius.
 *
 * MEASURED, NOT ASSUMED. The curve interpolates its 28 control points but does not stay
 * inside their circumscribed circle: with the amplitudes driven adversarially to ±11% —
 * 20 000 sign patterns, each segment sampled at 257 parameters — the worst curve radius is
 * 1.1359·r against a control-point maximum of 1.11·r. `0.04` covers that with margin, and
 * `silhouette.test.ts` sweeps the same claim so the margin is evidence rather than hope.
 * Without it the reserved disc would clip the very bulge FR-13 forbids overlapping.
 */
export const CURVE_OVERSHOOT = 0.04;

/**
 * The reserved radius as a multiple of the base radius, before density and clearance:
 * `1 + 0.11 + 0.04 + 0.32`.
 *
 * Seeded jitter at its maximum, the curve's overshoot past it, and the deform cap on every
 * bearing at once. All four are worst cases, so this is a property of the KIND and not of
 * the object — two bodies of one kind reserve the same disc, which is what lets layout
 * reserve before it knows a single link bearing.
 */
export const RESERVATION_FRACTION = 1 + SILHOUETTE_AMPLITUDE + CURVE_OVERSHOOT + DEFORM_MAX;

/**
 * The radius of the disc `layout` reserves for a body of this base radius.
 *
 * `shape.bubble.deform.reservation`: *the layout reserves the deformed hull +
 * {spacing.cell-clearance}*. The hull is taken at {@link DENSITY_MAX}; the clearance is
 * NOT, because `density.scale.affects` excludes it — AD-8 overrode `DESIGN.md` there
 * precisely so density could not become a fourth relayout action.
 */
export const reservationRadius = (baseRadius: number): number =>
  baseRadius * RESERVATION_FRACTION * DENSITY_MAX + CELL_CLEARANCE;

// --- The contour ------------------------------------------------------------

const at = <T>(items: readonly T[], index: number): T => {
  const value = items[((index % items.length) + items.length) % items.length];
  // Unreachable: the index is wrapped into range above. `noUncheckedIndexedAccess` cannot
  // see that, and a non-null assertion is a claim made where a throw is free.
  if (value === undefined) throw new Error('silhouette: control point index out of range');
  return value;
};

/**
 * Catmull–Rom through the 28 control points, expressed as cubic Béziers.
 *
 * `control1 = p1 + (p2 − p0)/6` and `control2 = p2 − (p3 − p1)/6` — the uniform form, and
 * `+ - * /` throughout. It interpolates its control points, so the closed curve passes
 * through all 28 and the seeded radii are the contour rather than a suggestion.
 */
const segmentsThrough = (points: readonly ContourPoint[]): readonly CubicSegment[] =>
  points.map((_, index) => {
    const previous = at(points, index - 1).point;
    const from = at(points, index).point;
    const to = at(points, index + 1).point;
    const next = at(points, index + 2).point;
    return {
      from,
      control1: { x: from.x + (to.x - previous.x) / 6, y: from.y + (to.y - previous.y) / 6 },
      control2: { x: to.x - (next.x - from.x) / 6, y: to.y - (next.y - from.y) / 6 },
      to,
    };
  });

/**
 * The invariant core, as half-extents about the body centre.
 *
 * A function of the base radius alone: the undeformed bounding box is `2r` square, so the
 * half-extents are `0.59·r` and `0.50·r` for every object of that kind, whatever its seed.
 */
const coreOf = (baseRadius: number): CoreRect => ({
  halfWidth: (CORE_FRACTION.width * (2 * baseRadius)) / 2,
  halfHeight: (CORE_FRACTION.height * (2 * baseRadius)) / 2,
});

/** No links: the argument `layout` reserves with, named so the call reads as what it is. */
export const NO_LINKS: readonly Point[] = [];

/**
 * The hull of one body — seeded contour, link-driven deform and reservation, in one
 * function (AD-9, AD-38).
 *
 * `layout` calls it with {@link NO_LINKS} and reads {@link BubbleHull.reservation}; `scene`
 * calls it with the bearings of the object's links and draws `segments`. There is no
 * second copy of either half, which is the whole of AD-38's rule applied to the one
 * derived value two stages share.
 *
 * `linkBearings` need not be unit vectors — each is normalised here — and their ORDER does
 * not change the result beyond floating-point summation, so a caller that sorts them by
 * AD-7 gets a reproducible hull.
 */
export const bubbleHull = (
  key: IdentityKey,
  baseRadius: number,
  linkBearings: readonly Point[],
): BubbleHull => {
  const points = BEARINGS.map((bearing, index) => {
    const amplitude = amplitudeAt(key, index);
    const deform = deformAt(bearing, linkBearings);
    const radius = baseRadius * (1 + amplitude + deform);
    return {
      bearing,
      amplitude,
      deform,
      radius,
      point: { x: bearing.x * radius, y: bearing.y * radius },
    };
  });
  return {
    key,
    baseRadius,
    points,
    segments: segmentsThrough(points),
    core: coreOf(baseRadius),
    linkBearings,
    reservation: reservationRadius(baseRadius),
  };
};

/**
 * The seeded silhouette of one object (AD-6).
 *
 * A pure function of `(identity key, base radius)`. Called twice with the same arguments,
 * in the same process or in another one, it returns the identical contour: the seed is an
 * integer hash of the key and every step after it is exactly-specified arithmetic.
 *
 * `baseRadius` is a parameter rather than a lookup because it is the caller's reading of
 * `shape.bubble.radius` at the density in force — {@link BASE_RADIUS} holds the three
 * values at `density.scale` 1.00, and density scales bodies inside space already reserved
 * (AD-8), which is a decision this function must not take for its caller.
 */
export const silhouette = (key: IdentityKey, baseRadius: number): Silhouette => {
  const hull = bubbleHull(key, baseRadius, NO_LINKS);
  return {
    key: hull.key,
    baseRadius: hull.baseRadius,
    // Projected back to a `ContourPoint`, field for field and in the same order, because
    // `silhouette`'s output is pinned by committed digests. Recomputing the contour here
    // instead would be the second owner AD-38 forbids.
    points: hull.points.map(({ bearing, amplitude, radius, point }) => ({
      bearing,
      amplitude,
      radius,
      point,
    })),
    segments: hull.segments,
    core: hull.core,
  };
};

/**
 * A point on one cubic segment, at parameter `t` in `[0, 1]`.
 *
 * The expanded Bernstein form — multiplications and additions only, no `Math.pow`. Here
 * because the floor `shape.ts` states is a property of the CURVE and not only of its 28
 * control points, and a test that can only see the control points cannot check it.
 */
export const pointOnSegment = (segment: CubicSegment, t: number): Point => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * segment.from.x + b * segment.control1.x + c * segment.control2.x + d * segment.to.x,
    y: a * segment.from.y + b * segment.control1.y + c * segment.control2.y + d * segment.to.y,
  };
};

/** True when `point` lies outside the invariant core rectangle — the floor `shape.ts` states. */
export const clearsCore = (core: CoreRect, point: Point): boolean =>
  point.x > core.halfWidth ||
  point.x < -core.halfWidth ||
  point.y > core.halfHeight ||
  point.y < -core.halfHeight;
