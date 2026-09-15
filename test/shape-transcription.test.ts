import { describe, expect, it } from 'vitest';

import {
  BASE_RADIUS,
  CORE_FRACTION,
  SILHOUETTE_AMPLITUDE,
  SILHOUETTE_POINTS,
} from '../packages/model/src/silhouette.ts';
import { shape } from '../packages/tokens/src/shape.ts';

/**
 * The AD-23 anti-drift gate for the four numbers `packages/model` transcribes.
 *
 * AD-38 makes `model` the owner of silhouette hull geometry and AD-23 makes `tokens` the
 * source of truth on values, and those two pull against each other: `dependency-graph.json`
 * gives `model` no imports, so `packages/model/src/silhouette.ts` transcribes what
 * `shape.bubble` states rather than importing it. `shape`'s values are authored as PROSE —
 * `'closed cubic Bézier, 28 control points'`, `'±11% of base radius'`, `'54px'` — so there
 * is nothing importable to read even if the graph allowed it.
 *
 * `silhouette.test.ts` pins the transcribed constants against literals, which proves the
 * contour honours them but cannot see `shape.ts` moving underneath. This test is the half
 * that can: it reads the prose and compares. It sits in `test/` because that is the only
 * place free to import both packages without an arrow the graph forbids.
 *
 * EVERY EXTRACTION THROWS RATHER THAN SKIPS. A reformulated sentence must fail here, loudly
 * — a regex that quietly stops matching would turn this gate back into the manual check it
 * replaces.
 */

const one = (source: string, label: string, pattern: RegExp): number => {
  const found = pattern.exec(source);
  const captured = found?.[1];
  if (captured === undefined) {
    throw new Error(`${label}: ${String(pattern)} no longer reads ${JSON.stringify(source)}`);
  }
  return Number(captured);
};

const two = (source: string, label: string, pattern: RegExp): readonly [number, number] => {
  const found = pattern.exec(source);
  const first = found?.[1];
  const second = found?.[2];
  if (first === undefined || second === undefined) {
    throw new Error(`${label}: ${String(pattern)} no longer reads ${JSON.stringify(source)}`);
  }
  return [Number(first), Number(second)];
};

describe('`packages/model` transcribes `shape.bubble` and has not drifted from it', () => {
  it('carries the control-point count `shape.bubble.silhouette.geometry` states', () => {
    const points = one(
      shape.bubble.silhouette.geometry,
      'shape.bubble.silhouette.geometry',
      /(\d+) control points/,
    );
    expect(SILHOUETTE_POINTS).toBe(points);
  });

  it('carries the amplitude `shape.bubble.silhouette.amplitude` states, as a fraction', () => {
    const percent = one(
      shape.bubble.silhouette.amplitude,
      'shape.bubble.silhouette.amplitude',
      /±(\d+(?:\.\d+)?)% of base radius/,
    );
    // The token states a percentage; the model holds the fraction the contour multiplies by.
    expect(SILHOUETTE_AMPLITUDE).toBeCloseTo(percent / 100, 10);
  });

  it.each(['service', 'container', 'volume'] as const)(
    'carries the %s base radius `shape.bubble.radius` states',
    (kind) => {
      const radius = one(shape.bubble.radius[kind], `shape.bubble.radius.${kind}`, /^(\d+)px$/);
      expect(BASE_RADIUS[kind]).toBe(radius);
    },
  );

  it('carries the core fractions `shape.bubble.core.geometry` states', () => {
    const [width, height] = two(
      shape.bubble.core.geometry,
      'shape.bubble.core.geometry',
      /^(\d+(?:\.\d+)?)w × (\d+(?:\.\d+)?)h/,
    );
    expect(CORE_FRACTION).toEqual({ width, height });
  });

  it('transcribes every `shape.bubble` number the model holds, and no others', () => {
    // The guard on this file itself: a fifth constant added to silhouette.ts without a row
    // above would be transcribed and unwatched, which is the state this gate exists to end.
    // `shape.bubble.radius` carries a `note` beside the three radii — it states the density
    // scale and LOD rung they hold at, and is prose about them rather than a fourth radius.
    const radii = Object.keys(shape.bubble.radius).filter((key) => key !== 'note');
    expect(Object.keys(BASE_RADIUS).sort()).toEqual(radii.sort());
    expect(Object.keys(CORE_FRACTION).sort()).toEqual(['height', 'width']);
  });
});
