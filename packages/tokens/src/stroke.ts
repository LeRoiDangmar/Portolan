// stroke — DESIGN.md's `stroke` namespace, transcribed (AD-23).
//
// `edge.attach-min-length` is the stub length AD-29 ratchets — the measurement harness
// reads it from here rather than carrying a constant of its own, which is why scoping
// the token file to colour would have orphaned this namespace.
//
// Both `edge.floor` and `stack-outline.floor` are stated here as DESIGN.md states them,
// in prose. The NUMBERS the AD-28 gate actually enforces are in `floors.ts`, as data.
// These strings are the intent; that file is the contract.

export const stroke = {
  edge: {
    width: '1.6px',
    graduation: '4px dasharray 0.6 7 @ 0.55, overlaid on the solid stroke',
    attach: '0.9px dasharray 2 4, {colors.edge-attach}',
    'attach-min-length':
      '6px on screen — the attachment stub never shrinks below one and a half periods of its own 2 4 dasharray, so it stays a visible mark at rung 0',
    mount: '1.6px solid, {colors.edge-mount}',
    floor:
      'never below 3:1 against the worst composited zone field, in either mode. The clamp in {opacity.zone-field-cap} is what makes the worst composite equal to a single tint, and therefore what makes this floor checkable rather than true-of-one-layer.',
  },
  zone: {
    isoline: {
      width: '3.5px',
      dasharray: '0.8 9',
      opacity: '{opacity.zone-isoline}',
      style: 'open contour — never closed, never a filled outline',
      color: '{colors.zone-isoline-1}…{colors.zone-isoline-6}',
    },
    blob: {
      width: '1px',
      style: 'solid, closed',
      color: '{colors.pastille-network-1}…{colors.pastille-network-6}',
    },
  },
  'stack-outline': {
    width: '1.25px',
    style: 'solid, closed, continuous — no dasharray, no graduation, no fill of any kind',
    color: '{colors.stack-outline}',
    break: 'the stroke opens once, for its own label, and nowhere else',
    floor:
      '≥3:1 over the clamped zone field in both modes, and deliberately BELOW both edge kinds. An edge runs between two bodies and terminates on them; this closes on itself and terminates on nothing. Nothing may counterfeit an edge — including a grouping mark.',
  },
  hairline: '0.75px',
  rule: '1px',
  contour: '1px',
  'contour-inner': '0.7px at 0.87r',
  'band-divider': '0.8px, {colors.band-divider}',
  focus: '2px {colors.focus}, 2px offset, square corners, no radius',
} as const;
