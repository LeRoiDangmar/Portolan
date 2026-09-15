import { describe, expect, it } from 'vitest';

import { colour } from './colour.ts';

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

  it('adopts palette-cvd-analysis.md §5 for the zone tints, not DESIGN.md shipped values', () => {
    // The one named departure from DESIGN.md. Light tints 1 and 3 as shipped simulate
    // to a byte-identical `#E2E2EC` under deuteranopia — the NFR-13 defect — so the
    // twelve values here are design's own re-optimised register. If design lands
    // different values, this test and the twelve strings move together.
    expect(colour['zone-tint-1']).toEqual({ dark: '#261A12', light: '#F2D8DE' });
    expect(colour['zone-tint-2']).toEqual({ dark: '#1E1802', light: '#EADCD4' });
    expect(colour['zone-tint-3']).toEqual({ dark: '#141A16', light: '#E0E0CA' });
    expect(colour['zone-tint-4']).toEqual({ dark: '#081C22', light: '#C8E8E2' });
    expect(colour['zone-tint-5']).toEqual({ dark: '#121826', light: '#CEE4EC' });
    expect(colour['zone-tint-6']).toEqual({ dark: '#201A1E', light: '#D8DEF4' });
    // And the superseded values are gone, in both palettes.
    const shipped = ['#0B1E28', '#1B1710', '#17161E', '#0F2015', '#231521', '#141C2B'];
    const present = Object.values(colour).flatMap((pair) => [pair.dark, pair.light]);
    for (const superseded of shipped) expect(present).not.toContain(superseded);
  });
});
