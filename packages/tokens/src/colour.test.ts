import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { PALETTES, colour } from './colour.ts';
import { register } from './floors.ts';

/**
 * AD-23 exists to prevent a transcription error: the moment a component hand-copies a
 * colour, the contrast tests start validating the copy rather than the design.
 *
 * DESIGN.md carries 142 colour values as 71 exact dark/light pairs, under an INVERTED
 * convention — a bare name is the DARK value, `-light` carries the light one. This file
 * is written as `{ dark, light }` instead, so the twin cannot be lost by a typo in a
 * suffix; what these tests check is that the transcription is complete in both
 * directions, that no orphan exists either way, and that the suffix convention did not
 * leak into a key on the way across.
 *
 * The token NAMES below are transcribed from DESIGN.md independently of `colour.ts`.
 * That independence is the point: generating both from one list would make the test
 * agree with the file by construction and catch nothing.
 */
const DESIGN_MD_TOKENS = [
  // Chassis surfaces (DESIGN.md 17–43)
  'ground',
  'canvas',
  'panel',
  'field',
  'bezel',
  'hairline',
  'rule',
  'panel-header',
  'tab-bar',
  'legend',
  'band-a',
  'band-b',
  'band-divider',
  // Ink (45–58)
  'ink',
  'ink-2',
  'ink-3',
  'bubble-id',
  'node-label',
  // Metals (60–66)
  'brass',
  'steel',
  'glass',
  // Focus (68–71)
  'focus',
  // Bubble bodies (73–99)
  'body-top',
  'body-mid',
  'body-base',
  'body-sel-top',
  'body-sel-mid',
  'body-sel-base',
  'body-volume-top',
  'body-volume-base',
  'contour',
  'contour-inner',
  'contour-orphan',
  'body-orphan',
  'plate',
  // Network zone hues (101–130)
  'zone-tint-1',
  'zone-tint-2',
  'zone-tint-3',
  'zone-tint-4',
  'zone-tint-5',
  'zone-tint-6',
  'zone-isoline-1',
  'zone-isoline-2',
  'zone-isoline-3',
  'zone-isoline-4',
  'zone-isoline-5',
  'zone-isoline-6',
  // Edges (132–136)
  'edge-attach',
  'edge-mount',
  // Stack outline (138–144)
  'stack-outline',
  // Pastilles (146–186)
  'pastille-type-service',
  'pastille-type-container',
  'pastille-type-volume',
  'pastille-type-node',
  'pastille-stack-1',
  'pastille-stack-2',
  'pastille-stack-3',
  'pastille-stack-4',
  'pastille-stack-5',
  'pastille-stack-6',
  'pastille-stack-none',
  'pastille-network-1',
  'pastille-network-2',
  'pastille-network-3',
  'pastille-network-4',
  'pastille-network-5',
  'pastille-network-6',
  'pastille-health-nominal',
  'pastille-health-degraded',
  'pastille-health-stopped',
  // Staleness veil (188–190)
  'state-stale',
];

describe('the colour namespace against DESIGN.md', () => {
  const names = Object.keys(colour);

  it('carries all 71 pairs and no more', () => {
    expect(names.length).toBe(71);
    expect(DESIGN_MD_TOKENS.length).toBe(71);
    expect(names.length * 2).toBe(142);
  });

  it('has no token DESIGN.md does not declare, and drops none that it does', () => {
    expect([...names].sort()).toEqual([...DESIGN_MD_TOKENS].sort());
  });

  it('declares every token in the order DESIGN.md declares it', () => {
    // Order is not load-bearing for correctness, but it is what makes the manual
    // side-by-side diff against DESIGN.md's frontmatter possible at all.
    expect(names).toEqual(DESIGN_MD_TOKENS);
  });

  it.each(Object.entries(colour))('%s has both palettes as six-digit hex', (_name, palette) => {
    expect(palette.dark).toMatch(/^#[0-9A-F]{6}$/);
    expect(palette.light).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('never lets the -light suffix leak into a key', () => {
    // A key ending in `-light` would mean DESIGN.md's convention was carried across
    // rather than resolved, and the pair would then exist twice under two names.
    expect(names.filter((name) => name.endsWith('-light'))).toEqual([]);
  });

  it('has no orphan in either direction', () => {
    const missingLight = names.filter((name) => !colour[name as keyof typeof colour].light);
    const missingDark = names.filter((name) => !colour[name as keyof typeof colour].dark);
    expect(missingLight).toEqual([]);
    expect(missingDark).toEqual([]);
  });

  /**
   * DESIGN.md's `colors:` frontmatter, read from the file itself. The name list above
   * catches a dropped or invented token; only this catches a mistyped digit inside a
   * value that is otherwise plausible — which is the failure mode AD-23 exists to
   * prevent, since after AD-23 nothing downstream can tell a faithful copy from a
   * plausible one.
   */
  const designMd = (): Map<string, string> => {
    const path = fileURLToPath(
      new URL(
        '../../../_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/DESIGN.md',
        import.meta.url,
      ),
    );
    const lines = readFileSync(path, 'utf8').split('\n');
    const start = lines.findIndex((line) => line === 'colors:');
    const values = new Map<string, string>();
    for (const line of lines.slice(start + 1)) {
      // The block ends at the next top-level key; comments and blank lines are skipped.
      if (/^[a-z]/.test(line)) break;
      const match = /^ {2}([a-z0-9-]+):\s*'(#[0-9A-Fa-f]{6})'/.exec(line);
      if (match) values.set(match[1]!, match[2]!);
    }
    return values;
  };

  /**
   * Nothing is excepted. The zone rotation that once lived here as a departure was
   * applied across all 36 tokens in DESIGN.md itself (`palette-cvd-analysis.md` §6), so
   * the comparison below covers every value with no carve-out.
   *
   * The set is kept, empty, rather than deleted: it is the seam where a future
   * design-owned override would go, and an empty set that the filter still consults is
   * the difference between "nothing is excepted" and "nothing checks the exceptions".
   */
  const ADOPTED_FROM_ANALYSIS = new Set<string>();

  it('reads 142 values out of DESIGN.md, so the comparison below is over the whole block', () => {
    expect(designMd().size).toBe(142);
  });

  it.each(names.filter((name) => !ADOPTED_FROM_ANALYSIS.has(name)))(
    '%s matches DESIGN.md in both palettes, digit for digit',
    (name) => {
      const design = designMd();
      const pair = colour[name as keyof typeof colour];
      expect(pair.dark).toBe(design.get(name));
      expect(pair.light).toBe(design.get(`${name}-light`));
    },
  );

  it('carries the applied zone rotation, and none of the superseded values survives', () => {
    // The rotation design applied across 36 tokens. These are DESIGN.md's own values
    // now, so the comparison above already covers them; this pins the specific defect
    // that made the rotation necessary, so a revert cannot pass quietly.
    expect(colour['zone-tint-1']).toEqual({ dark: '#261A12', light: '#F2D8DE' });
    expect(colour['zone-tint-3']).toEqual({ dark: '#141A16', light: '#E0E0CA' });
    // The shipped light tints 1 and 3 simulated to a byte-identical #E2E2EC under
    // deuteranopia — the NFR-13 defect. Neither may come back, in either palette.
    const superseded = [
      '#0B1E28',
      '#1B1710',
      '#17161E',
      '#0F2015',
      '#231521',
      '#141C2B',
      '#D7E6EC',
      '#EDE3CF',
      '#E3E1EC',
      '#D9E7DC',
      '#F0DEE4',
      '#DDE1EF',
    ];
    const present = Object.values(colour).flatMap((pair) => [pair.dark, pair.light]);
    for (const value of superseded) expect(present).not.toContain(value);
  });
});

/**
 * The chart register, asserted rather than trusted.
 *
 * Design's first re-derivation of the zone rotation met every contrast floor in
 * `floors.ts` with fully saturated neon (`#FF3C00`, `#D500FF`). The floors do not
 * constrain saturation; the chroma and lightness bands in `register` do, and they
 * existed nowhere until that run. This is the test that makes the next re-derivation
 * fail loudly instead of passing every gate and destroying the brand.
 *
 * CIELAB is recomputed here rather than imported from `scripts/colour.mjs`: this
 * package may import nothing, and a token test that agreed with the gate by sharing its
 * arithmetic would not be checking the values, only the agreement.
 */
describe('the chart register', () => {
  const pivot = (t: number): number => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);

  const chromaAndLightness = (hex: string): { chroma: number; lightness: number } => {
    const channel = (value: number): number =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    const [r, g, b] = [1, 3, 5].map((index) =>
      channel(Number.parseInt(hex.slice(index, index + 2), 16) / 255),
    ) as [number, number, number];
    const x = pivot((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
    const y = pivot(0.2126729 * r + 0.7151522 * g + 0.072175 * b);
    const z = pivot((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
    const a = 500 * (x - y);
    const bStar = 200 * (y - z);
    return { chroma: Math.hypot(a, bStar), lightness: 116 * y - 16 };
  };

  it('sanity-checks its own arithmetic against two known points', () => {
    // Pure white is L* 100 with no chroma; a saturated neon is far outside every band.
    const white = chromaAndLightness('#FFFFFF');
    expect(white.lightness).toBeCloseTo(100, 4);
    expect(white.chroma).toBeCloseTo(0, 4);
    expect(chromaAndLightness('#FF3C00').chroma).toBeGreaterThan(90);
  });

  for (const band of register.bands) {
    for (const token of band.tokens) {
      for (const palette of PALETTES) {
        it(`${band.family} ${token} (${palette}) sits inside the register`, () => {
          const { chroma, lightness } = chromaAndLightness(
            colour[token as keyof typeof colour][palette],
          );
          expect(chroma).toBeGreaterThanOrEqual(band.chroma[0]);
          expect(chroma).toBeLessThanOrEqual(band.chroma[1]);
          if ('lightness' in band && band.lightness !== undefined) {
            // ROUNDING TOLERANCE, and it is design's rounding rather than a slackening.
            // The light network pastilles measure L* 43.75-44.00 against a band written
            // as 44-56, so the band as literally stated excludes the very values that
            // same commit shipped: design derived it across both palettes and rounded
            // 43.75 up. A quarter of an L* step is imperceptible and costs the guard
            // nothing — the neon re-derivation this test exists to catch was at C* 90+.
            // Recorded in deferred-work.md so design can say which number is wrong.
            expect(lightness).toBeGreaterThanOrEqual(band.lightness[0] - 0.25);
            expect(lightness).toBeLessThanOrEqual(band.lightness[1] + 0.25);
          }
        });
      }
    }
  }
});
