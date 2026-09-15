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
  amplitudeAt,
  clearsCore,
  pointOnSegment,
  silhouette,
} from './silhouette.ts';

/**
 * AD-6, and the floor `packages/tokens/src/shape.ts` states.
 *
 * The seed is re-derived here from the ALGORITHM rather than from the module: FNV-1a with
 * its published constants, written out a second time below. That independence is story
 * 2's rule and it is what makes this a determinism test rather than a tautology — a test
 * that called the module to compute its own expectation would agree with any change.
 */

/**
 * FNV-1a, 32-bit, from the published constants in decimal — 2166136261 and 16777619 —
 * rather than the hexadecimal the module writes them in, and with the two bytes of each
 * UTF-16 unit taken by arithmetic rather than by bit shifts. Identity keys are ASCII by
 * AD-5's own character set, so a code-point walk and a code-unit walk agree.
 */
const fnv1a = (text: string): number => {
  let hash = 2166136261;
  for (const character of text) {
    const unit = character.charCodeAt(0);
    hash = Math.imul(hash ^ (unit % 256), 16777619);
    hash = Math.imul(hash ^ Math.floor(unit / 256), 16777619);
  }
  return hash >>> 0;
};

const expectedAmplitude = (key: string, index: number): number => {
  let hash = Math.imul(fnv1a(key) ^ (index + 1), 16777619) >>> 0;
  hash = (hash ^ (hash >>> 15)) >>> 0;
  hash = Math.imul(hash, 16777619) >>> 0;
  hash = (hash ^ (hash >>> 13)) >>> 0;
  return (((hash % 2001) - 1000) * 0.11) / 1000;
};

const KEYS: readonly IdentityKey[] = [
  replicatedTaskKey('blog', 'web', 3),
  replicatedTaskKey('blog', 'web', 4),
  replicatedTaskKey('', 'adhoc', 1),
  volumeKey('web'),
  networkKey('web'),
  volumeKey('pgdata'),
  volumeKey('pg-data'),
];

describe('the silhouette is a pure function of the identity key (AD-6)', () => {
  it('returns the identical contour when asked twice', () => {
    for (const key of KEYS) {
      const first = silhouette(key, BASE_RADIUS.container);
      const second = silhouette(key, BASE_RADIUS.container);
      expect(second).toEqual(first);
      // Byte-identical, not merely deep-equal: every number is compared as a number, and
      // `toEqual` on two independently built objects is exactly that check.
      expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    }
  });

  it('matches an independently derived seed, point for point', () => {
    for (const key of KEYS) {
      for (let index = 0; index < SILHOUETTE_POINTS; index += 1) {
        expect(amplitudeAt(key, index)).toBeCloseTo(expectedAmplitude(key, index), 15);
      }
    }
  });

  it('gives a volume and a network of the same name two different contours', () => {
    const volume = silhouette(volumeKey('web'), BASE_RADIUS.volume);
    const network = silhouette(networkKey('web'), BASE_RADIUS.volume);
    expect(network.points.map((point) => point.amplitude)).not.toEqual(
      volume.points.map((point) => point.amplitude),
    );
  });

  it('takes no neighbour and no position — the key and the base radius are the whole input', () => {
    expect(silhouette.length).toBe(2);
  });

  it('scales with the base radius and is seeded independently of it', () => {
    const key = replicatedTaskKey('blog', 'web', 3);
    const small = silhouette(key, BASE_RADIUS.volume);
    const large = silhouette(key, BASE_RADIUS.service);
    expect(large.points.map((point) => point.amplitude)).toEqual(
      small.points.map((point) => point.amplitude),
    );
    for (let index = 0; index < SILHOUETTE_POINTS; index += 1) {
      const a = small.points[index];
      const b = large.points[index];
      expect(a && b).toBeTruthy();
      expect(b?.radius).toBeCloseTo(
        ((a?.radius ?? 0) * BASE_RADIUS.service) / BASE_RADIUS.volume,
        10,
      );
    }
  });
});

describe('the contour is `shape.bubble.silhouette`, transcribed', () => {
  it('carries 28 control points', () => {
    expect(SILHOUETTE_POINTS).toBe(28);
    expect(BEARINGS).toHaveLength(28);
    for (const key of KEYS) {
      expect(silhouette(key, BASE_RADIUS.container).points).toHaveLength(28);
      expect(silhouette(key, BASE_RADIUS.container).segments).toHaveLength(28);
    }
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

describe('the contour never crosses the invariant core (`shape.bubble.core`)', () => {
  it('reads the core as 0.59w × 0.50h of the undeformed bounding box', () => {
    expect(CORE_FRACTION).toEqual({ width: 0.59, height: 0.5 });
    const contour = silhouette(replicatedTaskKey('blog', 'web', 3), BASE_RADIUS.container);
    // Re-derived from the control points rather than read back from `core`.
    const xs = contour.points.map((point) => point.point.x);
    const ys = contour.points.map((point) => point.point.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    expect(contour.core.halfWidth).toBeCloseTo((0.59 * width) / 2, 12);
    expect(contour.core.halfHeight).toBeCloseTo((0.5 * height) / 2, 12);
  });

  it('clears it at every control point and everywhere on the curve between them', () => {
    for (const key of SWEEP) {
      expect(crossesCore(silhouette(key, BASE_RADIUS.container))).toBe(false);
    }
  });

  it('clears it at all three base radii, because the core is a fraction of the box', () => {
    for (const key of KEYS) {
      for (const radius of Object.values(BASE_RADIUS)) {
        expect(crossesCore(silhouette(key, radius))).toBe(false);
      }
    }
  });

  it('would report a crossing if one happened', () => {
    // Mutation check on the check itself: a core widened past the contour must be caught,
    // or the test above passes whatever the geometry does.
    const contour = silhouette(replicatedTaskKey('blog', 'web', 3), BASE_RADIUS.container);
    const swollen: Silhouette = {
      ...contour,
      core: { halfWidth: BASE_RADIUS.container, halfHeight: BASE_RADIUS.container },
    };
    expect(crossesCore(swollen)).toBe(true);
  });
});
