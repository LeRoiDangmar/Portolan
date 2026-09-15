// floors — the AD-28 contract, as data.
//
// AD-28 makes NFR-11 and NFR-13 blocking CI gates and requires the numeric floors AND
// the exemption set to live in the token file, each exemption a named pair of *what is
// exempt* and *the floor that still applies to it* — never hard-coded in the test.
// `scripts/check-contrast.mjs` reads this file and computes; it decides nothing.
//
// EXACTLY AD-28's five ratios are gated: identifier channel, chassis, health, both edge
// kinds over the worst composited zone field, and the focus ring. Widening a blocking
// gate beyond its contract is how gates get disabled, so rows DESIGN.md floors but
// AD-28 does not name — the zone isoline over its own tint, the mode-B zone blob, the
// stack outline, the masked value block — are deliberately absent. Two of those are
// recorded in `_bmad-output/implementation-artifacts/deferred-work.md` with an owner,
// because the adopted zone tints moved the ground underneath them.
//
// Every pair below reproduces DESIGN.md's own measured ratio to the digit it prints,
// which is how the transcription was checked; `test/contrast.test.ts` drives the gate.

import type { ColourToken } from './colour.ts';

/** A foreground token read against a background token, in both palettes. */
export interface TokenPair {
  readonly foreground: ColourToken;
  readonly background: ColourToken;
}

/** One of AD-28's five gated ratios. */
export interface FloorRule {
  /** Stable identifier — the gate prints it and exemptions point at it. */
  readonly id: string;
  /** AD-28's own name for this ratio. */
  readonly channel: string;
  /** The minimum WCAG contrast ratio every pair below must meet, in both palettes. */
  readonly floor: number;
  /** Why the floor is what it is, in the words of the document that set it. */
  readonly why: string;
  readonly pairs: readonly TokenPair[];
}

const ZONE_TINTS = [
  'zone-tint-1',
  'zone-tint-2',
  'zone-tint-3',
  'zone-tint-4',
  'zone-tint-5',
  'zone-tint-6',
] as const satisfies readonly ColourToken[];

/** One foreground read against each of several backgrounds. */
const over = (foreground: ColourToken, backgrounds: readonly ColourToken[]): readonly TokenPair[] =>
  backgrounds.map((background) => ({ foreground, background }));

/** Several foregrounds read against one background. */
const on = (foregrounds: readonly ColourToken[], background: ColourToken): readonly TokenPair[] =>
  foregrounds.map((foreground) => ({ foreground, background }));

/**
 * AD-28's five ratios. Nothing else is gated, and no floor appears anywhere but here.
 */
export const gatedFloors = [
  {
    id: 'identifier-channel',
    channel: 'identifier channel',
    floor: 7,
    why: 'the channel `pgdata` vs `pg-data` is read on. Flow 1 climaxes on it, so it carries the highest floor in the file.',
    pairs: [
      { foreground: 'bubble-id', background: 'body-mid' },
      { foreground: 'ink', background: 'body-mid' },
      { foreground: 'ink', background: 'plate' },
    ],
  },
  {
    id: 'chassis',
    channel: 'chassis text and marks',
    floor: 4.5,
    why: "SPEC.md states AD-28's 4.5:1 floor as *chassis text and marks*, so this rule holds every row of DESIGN.md's two contrast tables whose stated floor is 4.5:1 — the three pastille families on the body and the stack name on the outline, plus every chassis text role that carries an assigned colour.",
    pairs: [
      // Type pastille on body — four values since `stack` left the family.
      ...on(
        [
          'pastille-type-service',
          'pastille-type-container',
          'pastille-type-volume',
          'pastille-type-node',
        ],
        'body-mid',
      ),
      // Stack pastille on body — six values and none.
      ...on(
        [
          'pastille-stack-1',
          'pastille-stack-2',
          'pastille-stack-3',
          'pastille-stack-4',
          'pastille-stack-5',
          'pastille-stack-6',
          'pastille-stack-none',
        ],
        'body-mid',
      ),
      // Network pastille on body — six hues.
      ...on(
        [
          'pastille-network-1',
          'pastille-network-2',
          'pastille-network-3',
          'pastille-network-4',
          'pastille-network-5',
          'pastille-network-6',
        ],
        'body-mid',
      ),
      // Stack name set on the outline, over the canvas and over every zone tint. This
      // is what carries stack identity for a reader who cannot use the diamond's hue.
      ...over('ink-2', ['canvas', ...ZONE_TINTS]),
      // Node label on its backdrop band, and as the node-region header.
      ...over('node-label', ['band-a', 'band-b', 'field']),
      // Detail panel, left menu, tab bar, chart legend.
      { foreground: 'ink', background: 'panel' },
      { foreground: 'ink', background: 'tab-bar' },
      { foreground: 'ink-2', background: 'panel' },
      { foreground: 'ink-2', background: 'tab-bar' },
      { foreground: 'ink-2', background: 'legend' },
      { foreground: 'ink-3', background: 'panel' },
      { foreground: 'brass', background: 'panel' },
      { foreground: 'brass', background: 'legend' },
    ],
  },
  {
    id: 'health',
    channel: 'health mark',
    floor: 4,
    why: 'red is the tightest contrast in the file at 4.22:1, deliberately the least shouting of the three because it is the one carrying the traffic-light departure. Under the full staleness veil this floor is exempted — see `exemptions`.',
    pairs: on(
      ['pastille-health-nominal', 'pastille-health-degraded', 'pastille-health-stopped'],
      'body-mid',
    ),
  },
  {
    id: 'edge-over-zone-field',
    channel: 'both edge kinds over the worst composited zone field',
    floor: 3,
    why: 'the edges are the product, and `nothing may dissolve an edge` has to be checkable rather than hoped for. `opacity.zone-field-cap` luminance-clamps the composite to a single tint, which is what makes the WORST composited field equal to one tint and this floor computable from colour values alone — without `packages/scene`.',
    pairs: [...over('edge-mount', ZONE_TINTS), ...over('edge-attach', ZONE_TINTS)],
  },
  {
    id: 'focus-ring',
    channel: 'focus ring on any chrome surface',
    floor: 3,
    why: "a non-text indicator. `components.focus-ring` applies to left-menu rows and checkboxes, the three bottom tabs, the toolbar chips and the export row — chrome only, never the graph canvas — so the backgrounds are DESIGN.md's chassis surfaces minus `canvas` and the two node-backdrop bands, which are map.",
    pairs: over('focus', [
      'ground',
      'panel',
      'panel-header',
      'field',
      'bezel',
      'tab-bar',
      'legend',
    ]),
  },
] as const satisfies readonly FloorRule[];

/**
 * How an exemption's remaining floor is measured. `pair` is an ordinary reading;
 * `veiled-pair` lays a colour over BOTH the mark and its ground first, which is what a
 * veil is.
 */
export type ExemptionMeasure =
  | { readonly kind: 'pair'; readonly pairs: readonly TokenPair[] }
  | {
      readonly kind: 'veiled-pair';
      readonly veil: ColourToken;
      readonly alpha: number;
      readonly pairs: readonly TokenPair[];
    };

/**
 * NFR-11's deliberate exemptions. AD-28: a gate that fails on correct behaviour gets
 * disabled, which costs more than the gate is worth — so the set is data the design
 * owns and completing it was a precondition of enabling the gate at all. It was
 * completed and ratified in `palette-cvd-analysis.md` §4 on 2026-09-15, which also
 * WITHDREW two of the three exemptions proposed the day before, after measuring them:
 *
 *  - Unavailable control text. `ink-3` measures 4.91–5.69:1 on every chassis surface
 *    against a 4.5:1 floor. It passes; DESIGN.md's "exempt from the text floor" is the
 *    general convention for disabled controls, not a measurement below the floor.
 *  - Zone tint over canvas. AD-28 gates five ratios and a tint against its ground is
 *    none of them, so nothing checks it and nothing needs excusing.
 *
 * NEITHER exemption below is a skip. Each carries the floor that still applies and the
 * gate asserts it — an exemption that stopped being measured would be a hole.
 */
export const exemptions = [
  {
    id: 'bubble-contour-over-zone-tint',
    exempt:
      'the bubble contour read against any zone tint — the mark measures 2.6–2.9:1, which is below the edge floor',
    from: 'edge-over-zone-field',
    why: "the 3:1 floor binds the two EDGE kinds: the marks that carry relationships. A body's own outline is not an edge — it runs between nothing, and it is lifted by `elevation.bubble` in dark and by its own hairline against a tinted ground in light. DESIGN.md argues this and flags it [ASSUMPTION], *nobody stated it*; `palette-cvd-analysis.md` §4 states it, and tells this gate not to classify the contour as an edge.",
    floor: 3,
    stillApplies:
      "the contour's own row over the bare canvas, which DESIGN.md floors at 3:1 and measures at 3.3 dark / 3.0 light. The contour is exempt where it crosses a zone, not everywhere.",
    measure: {
      kind: 'pair',
      pairs: [{ foreground: 'contour', background: 'canvas' }],
    },
    source: 'palette-cvd-analysis.md §4, ratified 2026-09-15',
  },
  {
    id: 'health-mark-under-the-staleness-veil',
    exempt:
      'the three health marks under the FULL staleness veil — `state-stale` composited at alpha 0.42, the value `components.stale-map` reaches after fifteen minutes',
    from: 'health',
    why: 'a state whose meaning is illegibility cannot be held to a legibility floor. Text is exempted from the veil and never drops below 4.2:1; this mark is not exempted from the veil, it ages with the chart. NFR-11 names the veil as an exemption and AD-28 answers that it is not exempt at all but floored LOWER — so the number is recorded here rather than the category, and the gate asserts a value.',
    floor: 2.1,
    stillApplies:
      "DESIGN.md's own veiled figure: the health circle reaches 2.1:1 at full veil against its bare 4:1 floor. The stopped mark is the binding case in dark at 2.13:1, the degraded mark in light at 2.37:1.",
    measure: {
      kind: 'veiled-pair',
      veil: 'state-stale',
      alpha: 0.42,
      pairs: on(
        ['pastille-health-nominal', 'pastille-health-degraded', 'pastille-health-stopped'],
        'body-mid',
      ),
    },
    source: 'DESIGN.md — *Health*; clarified by palette-cvd-analysis.md §4',
  },
] as const satisfies readonly {
  readonly id: string;
  readonly exempt: string;
  readonly from: string;
  readonly why: string;
  readonly floor: number;
  readonly stillApplies: string;
  readonly measure: ExemptionMeasure;
  readonly source: string;
}[];

/**
 * NFR-13's threshold, ratified in `palette-cvd-analysis.md` §4 on 2026-09-15.
 *
 * Three is a FLOOR, not comfort: at any register this product would ship the ceiling is
 * about 6.7, so six zone hues will never be comfortably separable to a dichromate. That
 * is not a new concession — NFR-14 already puts network identity on the octave pattern
 * and the written names. This removes an outright collision from underneath it.
 *
 * Protanopia is held as well as deuteranopia, which goes beyond NFR-13's letter and is
 * what keeps DESIGN.md's claim — *protanopia separates at least as well in every case*
 * — true by gate rather than by assertion. It costs nothing: protanopia binds in the
 * light palette and deuteranopia in the dark, and both clear 3.0 at the existing
 * register.
 */
export const separation = {
  threshold: 3.0,
  metric: 'CIEDE2000 between the two colours as simulated by Viénot–Brettel–Mollon (1999)',
  deficiencies: ['deuteranopia', 'protanopia'],
  tokens: ZONE_TINTS,
  why: 'NFR-13 requires the six zone hues to be mutually separable under simulated deuteranopia in BOTH palettes. On the superseded tints, light 1 and 3 simulated to a byte-identical `#E2E2EC` and the dark palette had three pairs below ΔE00 1.6.',
  source: 'palette-cvd-analysis.md §4, ratified 2026-09-15',
} as const;
