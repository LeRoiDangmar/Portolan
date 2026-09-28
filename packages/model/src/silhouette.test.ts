import { describe, expect, it } from 'vitest';

import type { IdentityKey } from './identity.ts';
import { networkKey, replicatedTaskKey, volumeKey } from './identity.ts';
import type { BubbleHull, Point, Silhouette } from './silhouette.ts';
import {
  BASE_RADIUS,
  BEARINGS,
  CELL_CLEARANCE,
  CORE_FRACTION,
  CURVE_OVERSHOOT,
  DEFORM_BAND_COSINE,
  DEFORM_BAND_DEGREES,
  DEFORM_MAX,
  DENSITY_MAX,
  NO_LINKS,
  RESERVATION_FRACTION,
  SILHOUETTE_AMPLITUDE,
  SILHOUETTE_POINTS,
  bubbleHull,
  clearsCore,
  deformFalloff,
  pointOnSegment,
  reservationRadius,
  silhouette,
} from './silhouette.ts';

/**
 * The geometry `packages/tokens/src/shape.ts` fixes, and the floor it states.
 *
 * AD-6's determinism claim lives in `silhouette.determinism.test.ts`, so the determinism
 * job's filename filter reaches it; what is here is shape.
 */

const KEYS: readonly IdentityKey[] = [
  replicatedTaskKey('blog', 'web', 3),
  replicatedTaskKey('blog', 'web', 4),
  replicatedTaskKey('', 'adhoc', 1),
  volumeKey('web'),
  networkKey('web'),
  volumeKey('pgdata'),
  volumeKey('pg-data'),
];

describe('the contour is `shape.bubble.silhouette`, transcribed', () => {
  it('carries 28 control points', () => {
    expect(SILHOUETTE_POINTS).toBe(28);
    expect(BEARINGS).toHaveLength(28);
    for (const key of KEYS) {
      expect(silhouette(key, BASE_RADIUS.container).points).toHaveLength(28);
      expect(silhouette(key, BASE_RADIUS.container).segments).toHaveLength(28);
    }
  });

  it('reads the three base radii from `shape.bubble.radius`', () => {
    expect(BASE_RADIUS).toEqual({ service: 54, container: 46, volume: 32 });
  });

  it('places the 28 bearings on the unit circle, at equal steps', () => {
    for (const bearing of BEARINGS) {
      expect(bearing.x * bearing.x + bearing.y * bearing.y).toBeCloseTo(1, 12);
    }
    // Independently derived: the first bearing is due east and the eighth due north,
    // because 28 points at 360/28 put a control point on each cardinal.
    expect(BEARINGS[0]).toEqual({ x: 1, y: 0 });
    expect(BEARINGS[7]).toEqual({ x: 0, y: 1 });
    expect(BEARINGS[14]).toEqual({ x: -1, y: 0 });
    expect(BEARINGS[21]).toEqual({ x: 0, y: -1 });
  });

  it('stays inside ±11% of the base radius', () => {
    expect(SILHOUETTE_AMPLITUDE).toBe(0.11);
    for (const key of KEYS) {
      for (const radius of Object.values(BASE_RADIUS)) {
        for (const point of silhouette(key, radius).points) {
          expect(Math.abs(point.amplitude)).toBeLessThanOrEqual(0.11);
          expect(point.radius).toBeGreaterThanOrEqual(radius * 0.89);
          expect(point.radius).toBeLessThanOrEqual(radius * 1.11);
        }
      }
    }
  });

  it('closes: the last segment ends where the first begins', () => {
    for (const key of KEYS) {
      const { points, segments } = silhouette(key, BASE_RADIUS.container);
      expect(segments[0]?.from).toEqual(points[0]?.point);
      expect(segments[27]?.to).toEqual(points[0]?.point);
    }
  });

  it('passes through every control point', () => {
    for (const key of KEYS) {
      const { points, segments } = silhouette(key, BASE_RADIUS.container);
      segments.forEach((segment, index) => {
        expect(segment.from).toEqual(points[index]?.point);
        expect(segment.to).toEqual(points[(index + 1) % SILHOUETTE_POINTS]?.point);
      });
    }
  });
});

/**
 * A wider sweep than KEYS for the floor: the invariant rectangle is the one property that
 * has to hold for EVERY object a cluster can contain, not for a handful of fixtures.
 */
const SWEEP: readonly IdentityKey[] = Array.from({ length: 600 }, (_unused, index) =>
  replicatedTaskKey(`stack${index % 41}`, `svc${index % 23}`, index % 19),
);

const crossesCore = (contour: Silhouette): boolean => {
  for (const { point } of contour.points) {
    if (!clearsCore(contour.core, point)) return true;
  }
  for (const segment of contour.segments) {
    for (let step = 0; step <= 64; step += 1) {
      if (!clearsCore(contour.core, pointOnSegment(segment, step / 64))) return true;
    }
  }
  return false;
};

describe('the core is invariant (`shape.bubble.core`)', () => {
  it('reads 0.59w × 0.50h of a bounding box that is 2r square', () => {
    expect(CORE_FRACTION).toEqual({ width: 0.59, height: 0.5 });
    // Re-derived from `shape.pastille.capacity`'s own arithmetic — *at 0.59 × 2r —
    // service 63.7px, container 54.3px, volume 37.8px* — and not from the control points,
    // which are seeded and would make the expectation agree with any jitter.
    expect(2 * silhouette(KEYS[0] as IdentityKey, BASE_RADIUS.service).core.halfWidth).toBeCloseTo(
      63.7,
      1,
    );
    expect(
      2 * silhouette(KEYS[0] as IdentityKey, BASE_RADIUS.container).core.halfWidth,
    ).toBeCloseTo(54.3, 1);
    expect(2 * silhouette(KEYS[0] as IdentityKey, BASE_RADIUS.volume).core.halfWidth).toBeCloseTo(
      37.8,
      1,
    );
  });

  it('is the same rectangle for every key of one kind, which is what invariant means', () => {
    const cores = [...KEYS, ...SWEEP].map((key) => silhouette(key, BASE_RADIUS.container).core);
    for (const core of cores) {
      expect(core.halfWidth).toBe(0.59 * BASE_RADIUS.container);
      expect(core.halfHeight).toBe(0.5 * BASE_RADIUS.container);
    }
  });

  it('is not measured from the seeded control points', () => {
    // The seeded bounding box varies by key; the core must not follow it.
    const boxes = KEYS.map((key) => {
      const xs = silhouette(key, BASE_RADIUS.container).points.map((point) => point.point.x);
      return Math.max(...xs) - Math.min(...xs);
    });
    expect(new Set(boxes).size).toBeGreaterThan(1);
  });

  it('is never crossed, at any control point or anywhere on the curve between them', () => {
    for (const key of SWEEP) {
      expect(crossesCore(silhouette(key, BASE_RADIUS.container))).toBe(false);
    }
  });

  it('is never crossed at any of the three base radii', () => {
    for (const key of KEYS) {
      for (const radius of Object.values(BASE_RADIUS)) {
        expect(crossesCore(silhouette(key, radius))).toBe(false);
      }
    }
  });

  it('would report a crossing if one happened', () => {
    // Mutation check on the check itself: a core widened past the contour must be caught,
    // or the tests above pass whatever the geometry does.
    const contour = silhouette(replicatedTaskKey('blog', 'web', 3), BASE_RADIUS.container);
    const swollen: Silhouette = {
      ...contour,
      core: { halfWidth: BASE_RADIUS.container, halfHeight: BASE_RADIUS.container },
    };
    expect(crossesCore(swollen)).toBe(true);
  });
});

/**
 * A spread of link bearings, written as unit vectors at angles chosen by hand rather than
 * computed, so the fixture itself carries no transcendental into a file that is one stage
 * upstream of AD-8's ban. Each is `(cos θ, sin θ)` for the θ named beside it.
 */
const EAST: Point = { x: 1, y: 0 };
const NORTH: Point = { x: 0, y: 1 };
const WEST: Point = { x: -1, y: 0 };
const SOUTH: Point = { x: 0, y: -1 };
/** Deliberately not a unit vector: `deformAt` must normalise what it is given. */
const LONG_EAST: Point = { x: 17, y: 0 };

const radii = (hull: BubbleHull): readonly number[] => hull.points.map((point) => point.radius);

describe('the deform is `shape.bubble.deform`, transcribed', () => {
  it('reads the cap and the band from the token file', () => {
    expect(DEFORM_MAX).toBe(0.32);
    expect(DEFORM_BAND_DEGREES).toBe(38);
  });

  it('agrees with `cos² over ±38°` across the whole band', () => {
    // The one place `Math.cos` is allowed: a TEST may compute the transcendental the stage
    // may not, which is what makes this a check of the polynomial rather than a restatement
    // of it. `DEFORM_BAND_COSINE` is re-derived here too, from the band in degrees.
    const band = (DEFORM_BAND_DEGREES * Math.PI) / 180;
    expect(DEFORM_BAND_COSINE).toBeCloseTo(Math.cos(band), 15);
    let worst = 0;
    for (let step = 0; step <= 2000; step += 1) {
      const angle = (band * step) / 2000;
      const target = Math.cos((Math.PI / 2) * (angle / band)) ** 2;
      worst = Math.max(worst, Math.abs(deformFalloff(Math.cos(angle)) - target));
    }
    // The measured agreement recorded in `silhouette.ts`. A looser bound would let the
    // polynomial drift; a tighter one would fail on the same arithmetic.
    expect(worst).toBeLessThanOrEqual(0.017);
  });

  it('is 1 on the bearing, ½ at half the band and 0 at its edge and beyond', () => {
    expect(deformFalloff(1)).toBe(1);
    expect(deformFalloff(Math.cos((19 * Math.PI) / 180))).toBeCloseTo(0.5, 1);
    expect(deformFalloff(DEFORM_BAND_COSINE)).toBe(0);
    expect(deformFalloff(Math.cos((39 * Math.PI) / 180))).toBe(0);
    expect(deformFalloff(-1)).toBe(0);
  });

  it('caps at +32% of base radius whatever the link count', () => {
    const key = replicatedTaskKey('blog', 'web', 3);
    for (const links of [
      [EAST],
      [EAST, EAST],
      [EAST, EAST, EAST, EAST, EAST, EAST, EAST, EAST],
      [EAST, NORTH, WEST, SOUTH],
      Array.from({ length: 40 }, () => EAST),
    ]) {
      for (const point of bubbleHull(key, BASE_RADIUS.container, links).points) {
        expect(point.deform).toBeGreaterThanOrEqual(0);
        expect(point.deform).toBeLessThanOrEqual(DEFORM_MAX);
        expect(point.radius).toBeLessThanOrEqual(
          BASE_RADIUS.container * (1 + SILHOUETTE_AMPLITUDE + DEFORM_MAX),
        );
      }
    }
  });

  it('reaches the full cap on a single link bearing — `.degenerate`, the teardrop', () => {
    // Bearing 0 is due east, so a single eastward link puts the whole cap on it.
    const hull = bubbleHull(replicatedTaskKey('blog', 'web', 3), BASE_RADIUS.container, [EAST]);
    expect(hull.points[0]?.deform).toBeCloseTo(DEFORM_MAX, 15);
    // And nothing at all on the opposite side, which is what makes it a teardrop.
    expect(hull.points[14]?.deform).toBe(0);
  });

  it('normalises the bearings it is given', () => {
    const key = volumeKey('pgdata');
    expect(radii(bubbleHull(key, BASE_RADIUS.volume, [LONG_EAST]))).toEqual(
      radii(bubbleHull(key, BASE_RADIUS.volume, [EAST])),
    );
  });

  it('only ever adds radius — `.squash` is `none`', () => {
    // FR-70: neighbours never flatten each other. Every point of a linked hull is at least
    // where the undeformed contour put it, for every key and every link set.
    for (const key of KEYS) {
      const bare = silhouette(key, BASE_RADIUS.container);
      for (const links of [[EAST], [NORTH, SOUTH], [EAST, NORTH, WEST, SOUTH]]) {
        const hull = bubbleHull(key, BASE_RADIUS.container, links);
        hull.points.forEach((point, index) => {
          expect(point.radius).toBeGreaterThanOrEqual(bare.points[index]?.radius ?? Infinity);
        });
      }
    }
  });

  it('does not depend on who is next to it, only on its own links (FR-70)', () => {
    // The same object, the same links, on two different imagined neighbourhoods: there is
    // no neighbour parameter to pass, which is the structural form of the guarantee. What
    // is checkable is that the amplitude channel is untouched by the deform, so the
    // recognition silhouette survives every link count.
    const key = replicatedTaskKey('blog', 'web', 3);
    const bare = silhouette(key, BASE_RADIUS.container).points.map((point) => point.amplitude);
    for (const links of [[], [EAST], [EAST, NORTH, WEST, SOUTH]]) {
      expect(bubbleHull(key, BASE_RADIUS.container, links).points.map((p) => p.amplitude)).toEqual(
        bare,
      );
    }
    expect(bubbleHull.length).toBe(3);
  });

  it('is the seeded contour exactly when there are no links', () => {
    for (const key of KEYS) {
      for (const radius of Object.values(BASE_RADIUS)) {
        const hull = bubbleHull(key, radius, NO_LINKS);
        const bare = silhouette(key, radius);
        expect(hull.segments).toEqual(bare.segments);
        expect(hull.core).toEqual(bare.core);
        expect(radii(hull)).toEqual(bare.points.map((point) => point.radius));
        for (const point of hull.points) expect(point.deform).toBe(0);
      }
    }
  });
});

describe('the reservation is the worst case, not the drawn shape (AD-8, AD-9)', () => {
  it('reads the clearance, the density maximum and the cap from the token files', () => {
    expect(CELL_CLEARANCE).toBe(8);
    expect(DENSITY_MAX).toBe(1.2);
    // Re-derived rather than imported: jitter, overshoot and cap, each a worst case.
    expect(RESERVATION_FRACTION).toBeCloseTo(1 + 0.11 + 0.04 + 0.32, 15);
    expect(reservationRadius(BASE_RADIUS.container)).toBeCloseTo(46 * 1.47 * 1.2 + 8, 12);
  });

  it('depends on the base radius alone — not on the key and not on the links', () => {
    const reservations = new Set(
      KEYS.flatMap((key) =>
        [[], [EAST], [EAST, NORTH, WEST, SOUTH]].map(
          (links) => bubbleHull(key, BASE_RADIUS.container, links).reservation,
        ),
      ),
    );
    expect(reservations.size).toBe(1);
  });

  it('contains the drawn contour everywhere on the curve, at every link set', () => {
    // The floor the whole no-overlap promise rests on: what layout reserved must hold what
    // scene draws, at the maximum density step and at the cap on every bearing at once.
    const inside = (hull: BubbleHull): number => {
      let worst = 0;
      for (const segment of hull.segments) {
        for (let step = 0; step <= 64; step += 1) {
          const point = pointOnSegment(segment, step / 64);
          worst = Math.max(worst, Math.sqrt(point.x * point.x + point.y * point.y));
        }
      }
      return worst;
    };
    const everyBearing = [...BEARINGS];
    for (const key of SWEEP.slice(0, 200)) {
      for (const links of [[EAST], [EAST, NORTH, WEST, SOUTH], everyBearing]) {
        const hull = bubbleHull(key, BASE_RADIUS.container, links);
        // Drawn at the roomiest density step, which is where the reservation was taken.
        expect(inside(hull) * DENSITY_MAX).toBeLessThanOrEqual(hull.reservation - CELL_CLEARANCE);
      }
    }
  });

  it('would fail if the overshoot allowance were dropped', () => {
    // Mutation check on the allowance itself: the Catmull-Rom bulge really does pass the
    // control points, so `CURVE_OVERSHOOT` is load-bearing and not decoration.
    let worst = 0;
    for (const key of SWEEP) {
      const contour = silhouette(key, BASE_RADIUS.container);
      for (const segment of contour.segments) {
        for (let step = 0; step <= 64; step += 1) {
          const point = pointOnSegment(segment, step / 64);
          worst = Math.max(worst, Math.sqrt(point.x * point.x + point.y * point.y));
        }
      }
    }
    expect(worst / BASE_RADIUS.container).toBeGreaterThan(1 + SILHOUETTE_AMPLITUDE);
    expect(worst / BASE_RADIUS.container).toBeLessThanOrEqual(
      1 + SILHOUETTE_AMPLITUDE + CURVE_OVERSHOOT,
    );
  });
});
