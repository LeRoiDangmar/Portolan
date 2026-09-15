import { describe, expect, it } from 'vitest';

import type { IdentityKey } from './identity.ts';
import { networkKey, replicatedTaskKey, volumeKey } from './identity.ts';
import type { Silhouette } from './silhouette.ts';
import {
  BASE_RADIUS,
  BEARINGS,
  CORE_FRACTION,
  SILHOUETTE_AMPLITUDE,
  SILHOUETTE_POINTS,
  clearsCore,
  pointOnSegment,
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
