// silhouette — AD-6: the deterministic shape seed is the AD-5 identity key.
//
// THE SEEDED CONTOUR ALONE. A pure function of the identity key: no neighbour, no
// position, no clock, no `Math.random`. AD-38 makes `model` the owner of silhouette hull
// geometry, and this is the RECOGNITION half of it (FR-13's first channel). The
// link-driven deform — radial extension along every link bearing, cos² falloff over ±38°,
// capped at +32%, and the reservation hull `layout` places against — is the DATA half,
// also this package's to own, and it lands with `layout`, which is the first consumer that
// needs to place against it. The value below is therefore a per-point RADIUS that a later
// deform extends, never a shape baked flat into coordinates.
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
 * `cos` and `sin` of `i · 360°/28`, written out because AD-8 bans computing them. Seven
 * distinct magnitudes carry all 28: the table is built from the first octant by exact
 * sign and swap, so the star is exactly symmetric rather than symmetric to within a unit
 * in the last place.
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
  /** `baseRadius · (1 + amplitude)`. */
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

// --- The seed ---------------------------------------------------------------

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/**
 * FNV-1a over the key's UTF-16 code units, byte by byte.
 *
 * Integer-only: `Math.imul` is the exact 32-bit product ECMAScript specifies, so the same
 * key yields the same 32 bits in every engine on every architecture — which is what makes
 * the contour byte-identical in two processes.
 */
const seedOf = (key: string): number => {
  let hash = FNV_OFFSET_BASIS;
  for (let index = 0; index < key.length; index += 1) {
    const unit = key.charCodeAt(index);
    hash = Math.imul(hash ^ (unit & 0xff), FNV_PRIME);
    hash = Math.imul(hash ^ (unit >>> 8), FNV_PRIME);
  }
  return hash >>> 0;
};

/** One 32-bit draw per control point, avalanched so adjacent indices do not correlate. */
const drawAt = (seed: number, index: number): number => {
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

/** The undeformed bounding box, as half-extents about the body centre. */
const coreOf = (points: readonly ContourPoint[]): CoreRect => {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  for (const { point } of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  return {
    halfWidth: (CORE_FRACTION.width * (maxX - minX)) / 2,
    halfHeight: (CORE_FRACTION.height * (maxY - minY)) / 2,
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
  const points = BEARINGS.map((bearing, index) => {
    const amplitude = amplitudeAt(key, index);
    const radius = baseRadius * (1 + amplitude);
    return {
      bearing,
      amplitude,
      radius,
      point: { x: bearing.x * radius, y: bearing.y * radius },
    };
  });
  return { key, baseRadius, points, segments: segmentsThrough(points), core: coreOf(points) };
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
