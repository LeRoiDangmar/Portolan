// elevation — DESIGN.md's `elevation` namespace, transcribed (AD-23).
//
// Depth is stylistic, never spatial: shadow, gradient and halo are available; perspective,
// isometry and a z-axis are not. The bubble shadow is PROPORTIONAL to the rendered body
// with a hard floor below 30px, which is what keeps 325 SVG filter regions from
// re-rasterising on every breath at LOD rung 0.

export const elevation = {
  bubble: {
    dark: 'feDropShadow dy 0.11r · stdDeviation 0.15r · #000 @ 0.90 — PROPORTIONAL TO THE RENDERED BODY, capped at dy 5 / stdDeviation 7 (the r 46 value, which is what the absolute figures always were)',
    'dark-small':
      'feDropShadow dy 0.07r · stdDeviation 0.09r · #000 @ 0.85, capped at dy 3 / stdDeviation 4 — volumes and echoes',
    floor:
      'no shadow at all below a rendered body diameter of 30px. At LOD rung 0 on any cluster past ~150 objects the bodies are 14–28px across, so rung 0 carries no shadow: the contour does the lifting, exactly as it already does in light mode.',
    rationale:
      'the fixed dy 5 / σ 7 drop extends ~21px past the silhouette — 1.5× the whole body at map scale, against 8px of cell clearance — and 325 unaccelerated SVG filter regions re-rasterise on every breath. Proportional-plus-floor fixes both the fog and the frame rate.',
    light:
      'none — the light body is {colors.body-mid-light} against a tinted ground, lifted by its 1px {colors.contour-light} hairline. Light mode is therefore the palette that survives the dense frame intact, and it is already the screenshot palette.',
    note: 'Stylised depth only. No perspective, no isometric, no z-axis.',
  },
  panel: {
    dark: 'inset 1px hairline, no shadow',
    light: 'inset 1px hairline, no shadow',
  },
  halo: {
    dark: 'radialGradient, {colors.glass} 0 → 0.13 between 60% and 100% of 1.13r',
    light: 'ring, 0.6px {colors.glass-light} @ 0.35 at 1.13r',
  },
} as const;
