// opacity — DESIGN.md's `opacity` namespace, transcribed (AD-23).
//
// `zone-field-cap` is the load-bearing entry and the reason the AD-28 gate can run
// without `packages/scene`. Measured additively, the composited zone field breaks the
// isoline floor at two overlapping fields and the attachment edge at four. The clamp
// makes hue blend where fields overlap while luminance does not accumulate, so the
// WORST composite equals a SINGLE tint — which is what turns the ≥3:1 edge floor from
// true-of-one-layer into a property computable from colour values alone.
//
// AD-9 puts the resolution of that composite in the scene rather than in a rasteriser's
// alpha, for the same reason: otherwise no stage knows what the worst field looks like.

export const opacity = {
  dim: {
    unreachable: 0.18,
    'filter-context': 0.1,
  },
  echo: 0.55,
  'reticle-fine': 0.55,
  'reticle-coarse': 0.8,
  'zone-isoline': 1.0,
  'zone-field-cap':
    'the composited zone field is LUMINANCE-CLAMPED to a single tint. Hue blends where fields overlap; luminance does not accumulate.',
} as const;
