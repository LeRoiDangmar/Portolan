// colour — the `colors` namespace of DESIGN.md, transcribed (AD-23).
//
// 142 values, 71 exact dark/light pairs. DESIGN.md's convention is INVERTED against
// the usual one — a bare token name carries the DARK value and the `-light` suffix the
// light one — so the pair is written out here rather than encoded in the key. Reading
// `{ dark, light }` needs no convention at all, and `colour.test.ts` asserts that no
// orphan exists in either direction.
//
// AD-23 moved normativity on values from DESIGN.md to this file. DESIGN.md documents
// the intent; this is what the product is measured against.
//
// ONE DEPARTURE FROM DESIGN.md, and it is the story's named decision:
// `zone-tint-1…6` and their light twins are NOT DESIGN.md's shipped values. Those are
// the NFR-13 defect — light tints 1 and 3 simulate to a byte-identical `#E2E2EC` under
// deuteranopia, and the dark palette has three pairs below ΔE00 1.6, which no upstream
// document reported. The twelve values below are design's own re-optimised register
// from `palette-cvd-analysis.md` §5, measured by the same script the defect was found
// with. They hold the 1.13–1.19 iso-luminant band and C* ≤ 12, so the edge floors and
// the register both survive; min pairwise ΔE00 goes to 3.38 dark / 3.81 light.
// `palette-cvd-analysis.md` calls them candidates pending design's ratification of the
// register: if design lands different values, the change is twelve hex strings here and
// the gate re-runs.
//
// Not re-derived, and deferred with a named owner: `zone-isoline-1…6`, the mode-B zone
// blob and `pastille-network-*` were all derived against the superseded tints. None is
// among AD-28's five gated ratios, so nothing in CI catches the drift — see
// `_bmad-output/implementation-artifacts/deferred-work.md`.

/** A token that exists in both palettes. Dark is the default and the design target. */
export interface Palette {
  readonly dark: string;
  readonly light: string;
}

export const colour = {
  // --- Chassis surfaces ------------------------------------------------------
  ground: { dark: '#06080A', light: '#EDF1F3' },
  canvas: { dark: '#04070A', light: '#EDF1F3' },
  panel: { dark: '#0A0D10', light: '#E2E8EC' },
  field: { dark: '#0E1216', light: '#F6F8F9' },
  bezel: { dark: '#0C1116', light: '#DCE3E7' },
  hairline: { dark: '#182026', light: '#C6D0D6' },
  rule: { dark: '#2A343C', light: '#AFBCC4' },
  'panel-header': { dark: '#0C1015', light: '#DDE4E8' },
  'tab-bar': { dark: '#080B0E', light: '#DDE4E8' },
  legend: { dark: '#070A0D', light: '#E7ECEF' },
  'band-a': { dark: '#070B0E', light: '#E7ECEF' },
  'band-b': { dark: '#05080B', light: '#EDF1F3' },
  'band-divider': { dark: '#151D23', light: '#D4DCE1' },

  // --- Ink — three text inks and nothing else --------------------------------
  ink: { dark: '#DCE6EC', light: '#10171C' },
  'ink-2': { dark: '#94A3AD', light: '#4A5A66' },
  'ink-3': { dark: '#78858F', light: '#576470' },
  'bubble-id': { dark: '#A0AEB8', light: '#42525E' },
  'node-label': { dark: '#7E8B94', light: '#55636C' },

  // --- Metals — rare, and only where they carry information ------------------
  brass: { dark: '#C6A664', light: '#7B6228' },
  steel: { dark: '#7FA8BC', light: '#3C6F86' },
  glass: { dark: '#A8DCEF', light: '#1E6B8C' },

  // --- Focus — chrome only, never on the map ---------------------------------
  focus: { dark: '#B4C4CE', light: '#33454F' },

  // --- Bubble bodies (vertical gradients) ------------------------------------
  'body-top': { dark: '#141C22', light: '#FFFFFF' },
  'body-mid': { dark: '#0B1116', light: '#FFFFFF' },
  'body-base': { dark: '#080D11', light: '#FAFCFD' },
  'body-sel-top': { dark: '#1B2830', light: '#FFFFFF' },
  'body-sel-mid': { dark: '#0E161C', light: '#FFFFFF' },
  'body-sel-base': { dark: '#0A1014', light: '#F4F9FB' },
  'body-volume-top': { dark: '#161A18', light: '#FFFFFF' },
  'body-volume-base': { dark: '#090C0E', light: '#FBFAF7' },
  contour: { dark: '#4E6470', light: '#7E8C95' },
  'contour-inner': { dark: '#1E2A32', light: '#E4EAEE' },
  'contour-orphan': { dark: '#94A3AD', light: '#5F6E78' },
  'body-orphan': { dark: '#0A0E11', light: '#FFFFFF' },
  plate: { dark: '#0B1015', light: '#FFFFFF' },

  // --- Network zone hues — iso-luminant by construction ----------------------
  // HUE = the network's place in a six-step rotation, assigned in creation order and
  // held for the life of the network; OCTAVE = which turn of that rotation, carried by
  // `shape.network-octave` as a fill pattern rather than by a colour. Every tint sits
  // at 1.13–1.19 against its ground in both modes, which is what makes edge contrast
  // invariant to which zone an edge crosses — and therefore what makes the ≥3:1 edge
  // floor checkable at all.
  //
  // The twelve TINTS below come from `palette-cvd-analysis.md` §5, not from DESIGN.md.
  // The ISOLINES below them are DESIGN.md's, derived against the superseded tints and
  // not re-derived here. See the file header.
  'zone-tint-1': { dark: '#261A12', light: '#F2D8DE' },
  'zone-tint-2': { dark: '#1E1802', light: '#EADCD4' },
  'zone-tint-3': { dark: '#141A16', light: '#E0E0CA' },
  'zone-tint-4': { dark: '#081C22', light: '#C8E8E2' },
  'zone-tint-5': { dark: '#121826', light: '#CEE4EC' },
  'zone-tint-6': { dark: '#201A1E', light: '#D8DEF4' },
  'zone-isoline-1': { dark: '#3F7286', light: '#4C7E8E' },
  'zone-isoline-2': { dark: '#836B3B', light: '#8A6E2C' },
  'zone-isoline-3': { dark: '#6C6885', light: '#625E7C' },
  'zone-isoline-4': { dark: '#437E59', light: '#42805A' },
  'zone-isoline-5': { dark: '#8F6079', light: '#9C5C7C' },
  'zone-isoline-6': { dark: '#61759A', light: '#5A6EA0' },

  // --- Edges — the product ---------------------------------------------------
  'edge-attach': { dark: '#5B8494', light: '#4A6A78' },
  'edge-mount': { dark: '#C6A664', light: '#7A6430' },

  // --- Stack outline — the second grouping language --------------------------
  'stack-outline': { dark: '#6B7A85', light: '#5F6E78' },

  // --- Pastilles — SHAPE = FAMILY, COLOUR = VALUE ----------------------------
  'pastille-type-service': { dark: '#EDF3F6', light: '#10171C' },
  'pastille-type-container': { dark: '#9FB4C0', light: '#4E6472' },
  'pastille-type-volume': { dark: '#C6A664', light: '#8A6E2C' },
  'pastille-type-node': { dark: '#5F8C7E', light: '#2F6152' },
  'pastille-stack-1': { dark: '#C6A664', light: '#8A6E2C' },
  'pastille-stack-2': { dark: '#7FA8BC', light: '#3C6F86' },
  'pastille-stack-3': { dark: '#6FB2A0', light: '#2E7566' },
  'pastille-stack-4': { dark: '#C48FA8', light: '#8E5570' },
  'pastille-stack-5': { dark: '#9A94C0', light: '#5A559A' },
  'pastille-stack-6': { dark: '#8FB073', light: '#4F7434' },
  'pastille-stack-none': { dark: '#78848D', light: '#5F6E78' },
  'pastille-network-1': { dark: '#4A8296', light: '#3D6C7E' },
  'pastille-network-2': { dark: '#967C46', light: '#7A6430' },
  'pastille-network-3': { dark: '#7A7695', light: '#55506E' },
  'pastille-network-4': { dark: '#4E9268', light: '#356B4A' },
  'pastille-network-5': { dark: '#A46F8B', light: '#864C68' },
  'pastille-network-6': { dark: '#7286B0', light: '#4A5D8B' },
  'pastille-health-nominal': { dark: '#4C9BD6', light: '#1F6FA8' },
  'pastille-health-degraded': { dark: '#C08A3C', light: '#9A6410' },
  'pastille-health-stopped': { dark: '#BF5747', light: '#A63B2B' },

  // --- Staleness veil --------------------------------------------------------
  'state-stale': { dark: '#0A0E12', light: '#F1F3F4' },
} as const satisfies Record<string, Palette>;

/** Every colour token name, as a union. */
export type ColourToken = keyof typeof colour;

/** The two palettes, in the order every report prints them. */
export const PALETTES = ['dark', 'light'] as const;
export type PaletteName = (typeof PALETTES)[number];
