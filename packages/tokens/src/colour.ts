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
// THIS FILE IS A PURE TRANSCRIPTION. Every one of the 142 values is DESIGN.md's own,
// and `colour.test.ts` reads DESIGN.md's `colors:` frontmatter and compares all of them
// digit for digit, with no exception list.
//
// It did not start that way. The zone rotation was a live NFR-13 defect while this story
// was being written — light tints 1 and 3 simulated to a byte-identical `#E2E2EC` under
// deuteranopia, and the dark palette carried three pairs below ΔE00 1.6, which no
// upstream document reported. Design settled it mid-flight: `palette-cvd-analysis.md` §6
// records the rotation applied across **36 tokens**, not the 12 the analysis first
// proposed — the zone tint, the isoline and the network pastille of a given network now
// carry the same hue, 0–2° apart, because changing the tints alone would have broken
// FR-65, where hue is what holds a network's identity from its field to its badge.
// Separation is 3.38/3.39 dark and 3.81/3.74 light under deuteranopia/protanopia.
//
// TWO DEPARTURES REMAIN IN THE TOKEN FILE, neither of them a colour, each annotated in
// place in its own file:
//   1. `shape.bubble.silhouette.seed` follows AD-6's identity key rather than DESIGN.md's
//      and FR-13's Docker ID;
//   2. `density.scale.affects` drops `spacing.cell-clearance` per AD-8.
//
// Known consequence of the rotation, recorded by design: every network changes colour —
// only network 2 stays near its shipped hue — so any existing screenshot or mock is stale.

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
  'zone-isoline-1': { dark: '#9A6846', light: '#AC5670' },
  'zone-isoline-2': { dark: '#7A7054', light: '#96684A' },
  'zone-isoline-3': { dark: '#447C5A', light: '#72763E' },
  'zone-isoline-4': { dark: '#367A8E', light: '#0E8276' },
  'zone-isoline-5': { dark: '#5870A4', light: '#367C90' },
  'zone-isoline-6': { dark: '#986288', light: '#667294' },

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
  'pastille-network-1': { dark: '#B07A56', light: '#965468' },
  'pastille-network-2': { dark: '#948450', light: '#8A5E42' },
  'pastille-network-3': { dark: '#6C8E78', light: '#686A44' },
  'pastille-network-4': { dark: '#568EA0', light: '#20746A' },
  'pastille-network-5': { dark: '#6E86BA', light: '#307082' },
  'pastille-network-6': { dark: '#AA769A', light: '#4C689C' },
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
