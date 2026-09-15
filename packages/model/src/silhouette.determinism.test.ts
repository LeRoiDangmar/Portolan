import { describe, expect, it } from 'vitest';

import type { IdentityKey } from './identity.ts';
import { networkKey, replicatedTaskKey, volumeKey } from './identity.ts';
import { BASE_RADIUS, SILHOUETTE_POINTS, amplitudeAt, silhouette } from './silhouette.ts';

/**
 * AD-6's determinism claim, in the file the determinism job runs.
 *
 * `npm run test:determinism` is `vitest run --passWithNoTests determinism`, a filename
 * filter, and it is what the `ubuntu-24.04` / `ubuntu-24.04-arm` matrix executes. The
 * AD-8 layout suite arrives with `packages/layout`; until it does, the property the
 * matrix can already check is this one — the silhouette is an INPUT to layout's
 * reservation, so a seed that varied by architecture would defeat AD-8 from one stage
 * upstream. Naming the file so the existing filter picks it up is what puts it there;
 * the geometry and the core floor stay in `silhouette.test.ts`.
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

  it('depends on nothing but its two arguments', () => {
    // No clock, no `Math.random`, no neighbour and no position: the same call at two
    // moments, with unrelated work between them, gives the same bytes.
    const key = replicatedTaskKey('blog', 'web', 3);
    const first = JSON.stringify(silhouette(key, BASE_RADIUS.service));
    for (const other of KEYS) silhouette(other, BASE_RADIUS.volume);
    expect(JSON.stringify(silhouette(key, BASE_RADIUS.service))).toBe(first);
    expect(silhouette.length).toBe(2);
  });

  /**
   * The matrix asks for byte-identity ACROSS PROCESSES, and neither test above reaches
   * that far: both re-derive their expectation inside the run they are checking. These
   * digests were computed once and committed — so the assertion is made by a process that
   * has already exited, which is the only form the claim can take. They cover every number
   * in the contour at once: the 28 transcribed bearings, the seeded amplitudes, the
   * Catmull–Rom control points and the core rectangle, each rendered by `JSON.stringify`,
   * whose output for a double ECMAScript specifies exactly.
   *
   * They also close the story's top stated risk. The `shape.bubble` constants are
   * transcribed rather than imported, because `packages/model` imports nothing (AD-2), and
   * nothing else in CI would catch a divergence from `packages/tokens/src/shape.ts`.
   *
   * A failure here is never a number to update. It means the contour moved, and with it
   * every silhouette a user has learned to recognise (AD-6) — so the change that moved it
   * is what needs justifying, not this table. They were last recomputed when the review
   * found the core rectangle following the seeded points instead of the base radius.
   */
  const GOLDEN_CONTOURS: readonly (readonly [IdentityKey, number])[] = [
    ['container:blog/web/3', 142363059],
    ['container:blog/web/4', 988808888],
    ['container:/adhoc/1', 1714257457],
    ['volume:web', 234987565],
    ['network:web', 3661683882],
    ['volume:pgdata', 1094463131],
    ['volume:pg-data', 1921239030],
  ];

  it.each(GOLDEN_CONTOURS)('reproduces the committed contour for %s', (key, digest) => {
    expect(fnv1a(JSON.stringify(silhouette(key, BASE_RADIUS.container)))).toBe(digest);
  });

  it('would report a drift, so the digests above are evidence and not decoration', () => {
    const moved = silhouette('volume:web', BASE_RADIUS.container + 1);
    expect(fnv1a(JSON.stringify(moved))).not.toBe(234987565);
  });

  it('covers every key the fixture set names, so no contour is pinned by accident', () => {
    expect(GOLDEN_CONTOURS.map(([key]) => key)).toEqual([...KEYS]);
  });

  it('gives a volume and a network of the same name two different contours', () => {
    const volume = silhouette(volumeKey('web'), BASE_RADIUS.volume);
    const network = silhouette(networkKey('web'), BASE_RADIUS.volume);
    expect(network.points.map((point) => point.amplitude)).not.toEqual(
      volume.points.map((point) => point.amplitude),
    );
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
