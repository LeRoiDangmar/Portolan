import { describe, expect, it } from 'vitest';

// @ts-expect-error — plain .mjs tooling scripts with no declarations.
import { audit, failures, format } from '../scripts/check-contrast.mjs';
// @ts-expect-error — plain .mjs tooling scripts with no declarations.
import { contrastRatio } from '../scripts/colour.mjs';

import { colour, gatedFloors, exemptions, separation } from '../packages/tokens/src/index.ts';

/**
 * The AD-28 gate, driven over fixture palettes through the real `audit` — the same
 * function `npm run contrast` calls, with the real floors, the real exemption set and
 * the real NFR-13 threshold. Only the PALETTE is a fixture, which is what lets a test
 * prove the gate fails on a bad palette without anyone having to ship one.
 *
 * Story 1's rule holds: test the mechanism through the real tooling, never the shape of
 * a config. A test that asserted `gatedFloors.length === 5` would stay green if the
 * gate stopped measuring.
 */

type Colours = Record<string, { dark: string; light: string }>;

const withOverrides = (overrides: Record<string, Partial<{ dark: string; light: string }>>) => {
  const next: Colours = {};
  for (const [token, palette] of Object.entries(colour as Colours)) {
    next[token] = { ...palette, ...overrides[token] };
  }
  return next;
};

/** DESIGN.md's superseded zone tints — the palette NFR-13 calls a defect. */
const SUPERSEDED_TINTS = {
  'zone-tint-1': { dark: '#0B1E28', light: '#D7E6EC' },
  'zone-tint-2': { dark: '#1B1710', light: '#EDE3CF' },
  'zone-tint-3': { dark: '#17161E', light: '#E3E1EC' },
  'zone-tint-4': { dark: '#0F2015', light: '#D9E7DC' },
  'zone-tint-5': { dark: '#231521', light: '#F0DEE4' },
  'zone-tint-6': { dark: '#141C2B', light: '#DDE1EF' },
};

/**
 * The two dark network pastilles that miss the 4.5:1 chassis floor on the shipped
 * palette — 4.45:1 and 4.39:1 against DESIGN.md's own row, which prints its measured
 * range as *4.4 – 5.2* under a *4.5:1* floor and never reconciles the two. Lifted here
 * so a fixture can be genuinely clean; the real palette is asserted separately, below,
 * exactly as it stands.
 */
const NETWORK_PASTILLE_REPAIR = {
  'pastille-network-1': { dark: '#4E8A9F' },
  'pastille-network-3': { dark: '#807C9C' },
};

const clean = withOverrides(NETWORK_PASTILLE_REPAIR);

const messages = (report: unknown) => (format(report) as string[]).join('\n');

describe('a palette that meets every floor', () => {
  const report = audit({ colours: clean });

  it('reports no failure', () => {
    expect(failures(report)).toEqual([]);
    expect(messages(report)).toContain('Green:');
  });

  it('measures all five AD-28 ratios, in both palettes', () => {
    const rules = new Set((report.ratios as { rule: string }[]).map((finding) => finding.rule));
    expect([...rules].sort()).toEqual([
      'chassis',
      'edge-over-zone-field',
      'focus-ring',
      'health',
      'identifier-channel',
    ]);
    const palettes = new Set((report.ratios as { palette: string }[]).map((f) => f.palette));
    expect([...palettes].sort()).toEqual(['dark', 'light']);
    // Every declared pair, twice — once per palette. If the loop stopped running the
    // count collapses and this fails rather than the gate quietly measuring nothing.
    const declared = gatedFloors.reduce((total, rule) => total + rule.pairs.length, 0);
    expect(report.ratios.length).toBe(declared * 2);
    expect(declared).toBe(60);
  });

  it('measures the identifier channel at 7:1 and the edges at 3:1, from the token file', () => {
    const floors = new Map(gatedFloors.map((rule) => [rule.id, rule.floor]));
    expect(floors.get('identifier-channel')).toBe(7);
    expect(floors.get('chassis')).toBe(4.5);
    expect(floors.get('health')).toBe(4);
    expect(floors.get('edge-over-zone-field')).toBe(3);
    expect(floors.get('focus-ring')).toBe(3);
  });
});

describe('a palette under one floor', () => {
  // `brass` carries the chart-legend index numeral and the detail panel's mount flags,
  // at 8.5:1 and 8.4:1, and appears in no other rule. Dulled, it is a chassis failure
  // and nothing else — which is what makes the blast radius below meaningful.
  const report = audit({
    colours: withOverrides({ ...NETWORK_PASTILLE_REPAIR, brass: { dark: '#7A6A46' } }),
  });

  it('fails, naming the two tokens, the ratio, the floor and the palette', () => {
    const failed = failures(report) as { rule: string; palette: string }[];
    expect(failed.length).toBeGreaterThan(0);
    expect(failed.every((finding) => finding.rule === 'chassis')).toBe(true);
    expect(failed.every((finding) => finding.palette === 'dark')).toBe(true);

    const text = messages(report);
    expect(text).toContain('dark palette');
    expect(text).toContain('chassis');
    expect(text).toContain('brass (#7A6A46)');
    expect(text).toContain('panel (#0A0D10)');
    expect(text).toContain('legend (#070A0D)');
    expect(text).toMatch(/measures \d+\.\d\d:1, below its 4\.5:1 floor/);
  });

  it('leaves the light palette and every other rule green', () => {
    const passing = (report.ratios as { rule: string; pass: boolean }[]).filter(
      (finding) => finding.rule !== 'chassis',
    );
    expect(passing.every((finding) => finding.pass)).toBe(true);
    expect((report.separations as { pass: boolean }[]).every((finding) => finding.pass)).toBe(true);
  });
});

describe('a palette that trips an exemption', () => {
  it('holds the bubble contour to the floor that still applies, not to none at all', () => {
    // The contour is exempt from the 3:1 EDGE floor over a zone tint — a body's own
    // outline is not an edge. It is NOT exempt over the canvas, where DESIGN.md floors
    // it at 3:1. Darkening it trips the exemption's own floor.
    const report = audit({
      colours: withOverrides({ ...NETWORK_PASTILLE_REPAIR, contour: { dark: '#2B3840' } }),
    });
    const failed = failures(report) as { exemption?: string; palette: string }[];
    expect(failed.length).toBe(1);
    expect(failed[0]!.exemption).toBe('bubble-contour-over-zone-tint');
    expect(failed[0]!.palette).toBe('dark');
    expect(messages(report)).toContain('exempt from edge-over-zone-field');
  });

  it('asserts the health mark under the veil at 2.1:1 rather than skipping it', () => {
    const report = audit({
      colours: withOverrides({
        ...NETWORK_PASTILLE_REPAIR,
        // Nudge the stopped mark towards the body so the veiled pair drops under 2.1.
        'pastille-health-stopped': { dark: '#8E4235' },
      }),
    });
    const failed = failures(report) as { exemption?: string; floor?: number; palette: string }[];
    const veiled = failed.filter(
      (finding) => finding.exemption === 'health-mark-under-the-staleness-veil',
    );
    expect(veiled.length).toBeGreaterThan(0);
    expect(veiled.every((finding) => finding.floor === 2.1)).toBe(true);
    expect(messages(report)).toContain('below its 2.1:1 floor');
    // The same edit also breaks the bare 4:1 health floor, and both are reported. An
    // exemption lowers a floor; it does not remove the pair from the rule it came from.
    expect(failed.some((finding) => finding.floor === 4)).toBe(true);
  });

  it('never silently skips an exemption: every declared pair is measured, per palette', () => {
    const report = audit({ colours: clean });
    const declared = exemptions.reduce((total, entry) => total + entry.measure.pairs.length, 0);
    expect(report.exemptions.length).toBe(declared * 2);
    expect(declared).toBe(4);
    // Mutation guard: an empty exemption set produces no findings at all, which is what
    // makes the count above evidence that the loop ran rather than a coincidence.
    expect(audit({ colours: clean, exempt: [] }).exemptions).toEqual([]);
  });

  it('composites the veil rather than measuring the bare mark', () => {
    const report = audit({ colours: clean });
    const veiled = (
      report.exemptions as {
        exemption: string;
        palette: string;
        foreground: string;
        ratio: number;
      }[]
    ).find(
      (finding) =>
        finding.exemption === 'health-mark-under-the-staleness-veil' &&
        finding.palette === 'dark' &&
        finding.foreground === 'pastille-health-stopped',
    );
    // Bare, the stopped mark is 4.22:1 on the body. Veiled, DESIGN.md says 2.1:1. A gate
    // that forgot to composite would report the bare figure and pass for the wrong reason.
    expect(contrastRatio('#BF5747', '#0B1116')).toBeCloseTo(4.22, 2);
    expect(veiled!.ratio).toBeLessThan(2.5);
    expect(veiled!.ratio).toBeGreaterThanOrEqual(2.1);
  });
});

describe('NFR-13 separation', () => {
  it('reports a minimum per palette per deficiency, and clears 3.0 on the adopted tints', () => {
    const report = audit({ colours: clean });
    const found = (
      report.separations as { palette: string; deficiency: string; delta: number }[]
    ).map((finding) => `${finding.palette}/${finding.deficiency}`);
    expect(found.sort()).toEqual([
      'dark/deuteranopia',
      'dark/protanopia',
      'light/deuteranopia',
      'light/protanopia',
    ]);
    for (const finding of report.separations as { delta: number }[]) {
      expect(finding.delta).toBeGreaterThanOrEqual(separation.threshold);
    }
  });

  it('goes red on DESIGN.md’s superseded tints — the mutation that proves the gate works', () => {
    const report = audit({
      colours: withOverrides({ ...NETWORK_PASTILLE_REPAIR, ...SUPERSEDED_TINTS }),
    });
    const failed = (
      failures(report) as { delta?: number; palette: string; deficiency?: string }[]
    ).filter((finding) => finding.delta !== undefined);
    expect(failed.length).toBeGreaterThan(0);

    const text = messages(report);
    expect(text).toContain('NFR-13 light palette, deuteranopia');
    expect(text).toContain('zone-tint-1');
    expect(text).toContain('zone-tint-3');
    expect(text).toContain('#E2E2EC');
    expect(text).toMatch(/below the 3 threshold/);
  });

  it('holds protanopia as well as deuteranopia, which DESIGN.md only asserted', () => {
    const deficiencies = new Set(
      (audit({ colours: clean }).separations as { deficiency: string }[]).map(
        (finding) => finding.deficiency,
      ),
    );
    expect([...deficiencies].sort()).toEqual(['deuteranopia', 'protanopia']);
    // Mutation guard: the threshold is data, so raising it must turn the gate red.
    const strict = audit({ colours: clean, nfr13: { ...separation, threshold: 99 } });
    expect(failures(strict).length).toBe(4);
  });
});

describe('the shipped token file, exactly as it stands', () => {
  const report = audit();

  /**
   * TWO KNOWN FAILURES, and AD-28 calls this kind of red the gate working rather than
   * the gate broken: the palette is genuinely below a floor DESIGN.md itself sets.
   *
   * `pastille-network-1` and `pastille-network-3` measure 4.45:1 and 4.39:1 on
   * `body-mid` in the dark palette, against the 4.5:1 floor DESIGN.md's own *Network
   * pastille on body* row declares — a row that prints its measured range as **4.4 –
   * 5.2** and never reconciles the low end with the floor above it. It is not the
   * NFR-13 defect and it is not the zone-tint substitution; it predates both, and
   * `palette-cvd-analysis.md` did not sweep this family when it declared the exemption
   * set complete.
   *
   * Nothing in this story may repair it: the values belong to design, and the story's
   * Boundaries forbid inventing a replacement, relaxing a floor, or adding an exemption
   * design has not ratified. So the gate reports it and this test pins the exact shape
   * of the red. When design rules — by moving two hexes or by ratifying an exemption —
   * this test goes red and is deleted, which is the point of writing it this way.
   */
  it('is red on exactly the two network pastilles, and on nothing else', () => {
    const failed = failures(report) as {
      foreground?: string;
      background?: string;
      palette: string;
    }[];
    expect(
      failed.map((finding) => `${finding.palette}:${finding.foreground}/${finding.background}`),
    ).toEqual(['dark:pastille-network-1/body-mid', 'dark:pastille-network-3/body-mid']);
  });

  it('clears NFR-13 in both palettes under both deficiencies', () => {
    for (const finding of report.separations as { pass: boolean; delta: number }[]) {
      expect(finding.pass).toBe(true);
    }
  });

  it('clears both edge floors over every adopted zone tint', () => {
    const edges = (report.ratios as { rule: string; pass: boolean }[]).filter(
      (finding) => finding.rule === 'edge-over-zone-field',
    );
    expect(edges.length).toBe(24);
    expect(edges.every((finding) => finding.pass)).toBe(true);
  });

  it('clears every exemption at its own recorded floor', () => {
    expect((report.exemptions as { pass: boolean }[]).every((finding) => finding.pass)).toBe(true);
  });

  it('reports no pair straddling a floor between the two luminance coefficient rows', () => {
    // WCAG's rounded coefficients are what the gate uses, because NFR-11 cites WCAG.
    // Where the full-precision sRGB row would give a different verdict, the gate says
    // so rather than resolving it quietly. Today there is nothing to say.
    expect(report.straddles).toEqual([]);
  });
});
