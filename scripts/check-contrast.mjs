/**
 * AD-28: NFR-11 and NFR-13 are blocking CI gates.
 *
 * Computes, from the AD-23 token file and nothing else:
 *
 *   1. AD-28's five contrast ratios — identifier channel, chassis, health, both edge
 *      kinds over the worst composited zone field, focus ring — in BOTH palettes.
 *   2. Every declared exemption, at the floor that still applies to it. An exemption is
 *      never a skip; it is a different floor, and it is asserted.
 *   3. NFR-13's mutual separability of the six zone tints under simulated deuteranopia
 *      AND protanopia, in both palettes.
 *
 *   node scripts/check-contrast.mjs
 *   npm run contrast
 *
 * EVERY floor, every exemption and the separation threshold are DATA in
 * `packages/tokens/src/floors.ts`. AD-28 requires that: a floor hard-coded here would
 * make the test the thing design has to edit. This file measures and reports; it
 * decides nothing.
 *
 * It does not need `packages/scene`. AD-28 asks for 3:1 over the worst COMPOSITED zone
 * field, and `opacity.zone-field-cap` luminance-clamps that composite to a single tint
 * — which is exactly what makes the worst case a loop over six tints rather than a wait
 * for the scene.
 *
 * Two kinds of red, and only one is the failure AD-28 argues against: red because the
 * palette is genuinely wrong is the gate working; red because a correct build trips an
 * exemption the set does not name is the gate broken. `palette-cvd-analysis.md` §4
 * ratified the set on 2026-09-15 and called it complete — but it did not sweep the
 * network pastille family, which is where this gate's first red landed, so which of the
 * two kinds that red is remains design's to rule on. The set is as complete as design
 * has declared it, not as complete as the first run proved it to be.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  colour,
  PALETTES,
  gatedFloors,
  exemptions,
  separation,
} from '../packages/tokens/src/index.ts';
import { composite, contrastRatio, minimumSeparation, xyz } from './colour.mjs';

/** Two decimal places, the precision every ratio in DESIGN.md is quoted to. */
const ratio2 = (value) => value.toFixed(2);

/**
 * The same contrast ratio computed with the full-precision sRGB luminance row the
 * Python reference used, rather than WCAG's rounded coefficients. The gate reports in
 * WCAG's form because NFR-11 cites WCAG — but a pair where the two forms straddle a
 * floor must be reported rather than quietly resolved, so both are computed.
 */
const contrastRatioFullPrecision = (a, b) => {
  const first = xyz(a)[1];
  const second = xyz(b)[1];
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
};

/** Resolve a token name in one palette, failing loudly rather than measuring `undefined`. */
const value = (colours, token, palette) => {
  const entry = colours[token];
  if (entry === undefined) throw new Error(`No such colour token: ${token}`);
  const hex = entry[palette];
  if (hex === undefined) throw new Error(`Colour token ${token} has no ${palette} value.`);
  return hex;
};

/**
 * Every measurement the gate makes, as data. Pure: the tokens go in, findings come out,
 * and nothing is printed or exited. `test/contrast.test.ts` drives this with fixture
 * palettes — one passing, one under a floor, one tripping an exemption, one failing
 * separation — which is only possible because the palette is an argument.
 */
export const audit = ({
  colours = colour,
  floors = gatedFloors,
  exempt = exemptions,
  nfr13 = separation,
  palettes = PALETTES,
} = {}) => {
  const ratios = [];
  const straddles = [];

  for (const rule of floors) {
    for (const palette of palettes) {
      for (const pair of rule.pairs) {
        const foreground = value(colours, pair.foreground, palette);
        const background = value(colours, pair.background, palette);
        const measured = contrastRatio(foreground, background);
        ratios.push({
          rule: rule.id,
          channel: rule.channel,
          palette,
          foreground: pair.foreground,
          background: pair.background,
          foregroundValue: foreground,
          backgroundValue: background,
          ratio: measured,
          floor: rule.floor,
          pass: measured >= rule.floor,
        });
        const alternative = contrastRatioFullPrecision(foreground, background);
        if (measured >= rule.floor !== alternative >= rule.floor) {
          straddles.push({
            rule: rule.id,
            palette,
            foreground: pair.foreground,
            background: pair.background,
            floor: rule.floor,
            wcag: measured,
            fullPrecision: alternative,
          });
        }
      }
    }
  }

  const exemptionFindings = [];
  const ruleIds = new Set(floors.map((rule) => rule.id));
  for (const entry of exempt) {
    // The exemption set is data design edits by hand, and every mistake in it is an
    // exemption that still LOOKS measured in the report while checking something else
    // or nothing at all. AD-28 makes the set the thing that keeps a real failure from
    // being mistaken for a false one, so each of these throws rather than degrades.
    if (!ruleIds.has(entry.from)) {
      throw new Error(
        `Exemption ${entry.id} is exempt from "${entry.from}", which is not a gated rule. ` +
          `Expected one of: ${[...ruleIds].join(', ')}.`,
      );
    }
    if (entry.measure.kind !== 'pair' && entry.measure.kind !== 'veiled-pair') {
      throw new Error(
        `Exemption ${entry.id} declares measure kind "${entry.measure.kind}", which this gate ` +
          'does not know how to compute. Add it to `audit` before declaring it.',
      );
    }
    if (entry.measure.kind === 'veiled-pair') {
      const { alpha } = entry.measure;
      if (typeof alpha !== 'number' || !(alpha >= 0 && alpha <= 1)) {
        throw new Error(
          `Exemption ${entry.id} declares a veil alpha of ${alpha}. It must be a number in 0..1.`,
        );
      }
    }
    for (const palette of palettes) {
      for (const pair of entry.measure.pairs) {
        let foreground = value(colours, pair.foreground, palette);
        let background = value(colours, pair.background, palette);
        if (entry.measure.kind === 'veiled-pair') {
          const veil = value(colours, entry.measure.veil, palette);
          foreground = composite(veil, foreground, entry.measure.alpha);
          background = composite(veil, background, entry.measure.alpha);
        }
        const measured = contrastRatio(foreground, background);
        exemptionFindings.push({
          exemption: entry.id,
          exemptFrom: entry.from,
          palette,
          foreground: pair.foreground,
          background: pair.background,
          foregroundValue: foreground,
          backgroundValue: background,
          ratio: measured,
          floor: entry.floor,
          pass: measured >= entry.floor,
        });
      }
    }
  }

  const separations = [];
  for (const palette of palettes) {
    const entries = nfr13.tokens.map((token) => [token, value(colours, token, palette)]);
    for (const deficiency of nfr13.deficiencies) {
      const worst = minimumSeparation(entries, deficiency);
      separations.push({
        palette,
        deficiency,
        delta: worst.delta,
        threshold: nfr13.threshold,
        pass: worst.delta >= nfr13.threshold,
        a: worst.a,
        b: worst.b,
      });
    }
  }

  return { ratios, exemptions: exemptionFindings, separations, straddles };
};

/** Everything that failed, in report order. */
export const failures = (report) => [
  ...report.ratios.filter((finding) => !finding.pass),
  ...report.exemptions.filter((finding) => !finding.pass),
  ...report.separations.filter((finding) => !finding.pass),
];

const minimumOf = (findings) =>
  findings.reduce((lowest, finding) => (finding.ratio < lowest.ratio ? finding : lowest));

/** The human report. Lines, so a test can assert on one without matching whitespace. */
export const format = (report) => {
  const lines = [];

  lines.push(
    'AD-28 — NFR-11 contrast floors and NFR-13 zone separation, computed from the token file.',
  );
  lines.push('');
  lines.push('Contrast floors (worst pair per rule per palette):');
  const seen = new Map();
  for (const finding of report.ratios) {
    const key = `${finding.rule}\u0000${finding.palette}`;
    seen.set(key, [...(seen.get(key) ?? []), finding]);
  }
  for (const [key, findings] of seen) {
    const [rule, palette] = key.split('\u0000');
    const worst = minimumOf(findings);
    const verdict = findings.every((finding) => finding.pass) ? 'pass' : 'FAIL';
    lines.push(
      `  ${verdict}  ${rule} (${palette}, ${findings.length} pairs, floor ${worst.floor}:1)` +
        ` — worst ${ratio2(worst.ratio)}:1, ${worst.foreground} on ${worst.background}`,
    );
  }

  lines.push('');
  lines.push('Declared exemptions, each held to the floor that still applies:');
  const byExemption = new Map();
  for (const finding of report.exemptions) {
    const key = `${finding.exemption}\u0000${finding.palette}`;
    byExemption.set(key, [...(byExemption.get(key) ?? []), finding]);
  }
  for (const [key, findings] of byExemption) {
    const [exemption, palette] = key.split('\u0000');
    const worst = minimumOf(findings);
    const verdict = findings.every((finding) => finding.pass) ? 'pass' : 'FAIL';
    lines.push(
      `  ${verdict}  ${exemption} (${palette}, exempt from ${worst.exemptFrom}, still floored at ${worst.floor}:1)` +
        ` — worst ${ratio2(worst.ratio)}:1, ${worst.foreground} on ${worst.background}`,
    );
  }

  lines.push('');
  lines.push(
    `NFR-13 zone separation (minimum pairwise ΔE00, threshold ${report.separations[0]?.threshold ?? '?'}):`,
  );
  for (const finding of report.separations) {
    lines.push(
      `  ${finding.pass ? 'pass' : 'FAIL'}  ${finding.palette} / ${finding.deficiency}` +
        ` — ΔE00 ${finding.delta.toFixed(2)}, worst pair ${finding.a.token} / ${finding.b.token}` +
        ` (${finding.a.value} → ${finding.a.simulated}, ${finding.b.value} → ${finding.b.simulated})`,
    );
  }

  if (report.straddles.length > 0) {
    lines.push('');
    lines.push(
      'Reported, not resolved — pairs where WCAG’s rounded luminance coefficients and the',
    );
    lines.push('full-precision sRGB row fall on opposite sides of the floor:');
    for (const straddle of report.straddles) {
      lines.push(
        `  ${straddle.rule} (${straddle.palette}) ${straddle.foreground} on ${straddle.background},` +
          ` floor ${straddle.floor}:1 — WCAG ${ratio2(straddle.wcag)}:1,` +
          ` full precision ${ratio2(straddle.fullPrecision)}:1`,
      );
    }
  }

  const failed = failures(report);
  lines.push('');
  if (failed.length === 0) {
    lines.push(
      `Green: ${report.ratios.length} gated pairs, ${report.exemptions.length} exempted pairs and` +
        ` ${report.separations.length} separation measurements, all at or above their floor.`,
    );
    return lines;
  }

  lines.push(`${failed.length} failure(s):`);
  for (const finding of failed) {
    if ('delta' in finding) {
      lines.push(
        `  NFR-13 ${finding.palette} palette, ${finding.deficiency}: ${finding.a.token} and` +
          ` ${finding.b.token} separate by ΔE00 ${finding.delta.toFixed(2)},` +
          ` below the ${finding.threshold} threshold.` +
          ` ${finding.a.value} and ${finding.b.value} both simulate to` +
          ` ${finding.a.simulated} / ${finding.b.simulated}.`,
      );
      continue;
    }
    const what =
      'exemption' in finding
        ? `exemption ${finding.exemption} (exempt from ${finding.exemptFrom})`
        : `${finding.rule}`;
    lines.push(
      `  ${finding.palette} palette, ${what}: ${finding.foreground} (${finding.foregroundValue}) on` +
        ` ${finding.background} (${finding.backgroundValue}) measures ${ratio2(finding.ratio)}:1,` +
        ` below its ${finding.floor}:1 floor.`,
    );
  }
  return lines;
};

const runGate = () => {
  const report = audit();
  const lines = format(report);
  const failed = failures(report);
  const print = failed.length === 0 ? console.log : console.error;
  for (const line of lines) print(line);
  if (failed.length > 0) {
    console.error('');
    console.error(
      'AD-28 blocks merge on these. The floors and the exemption set are data in' +
        '\npackages/tokens/src/floors.ts and belong to design — fix the values, not the gate.',
    );
    process.exit(1);
  }
};

// Run the gate only when invoked as a script, so the tests can import `audit`.
if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runGate();
}
