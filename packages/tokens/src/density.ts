// density — DESIGN.md's `density` namespace, transcribed (AD-23).
//
// AD-8 reads `scale` as the RESERVATION MAXIMUM: the layout reserves at the roomiest
// step, so changing density is never a relayout. That is what keeps FR-16's three
// actions three, and FR-13's no-overlap rule true at every step.
//
// Type sizes are deliberately NOT here. They are `type.scale`, a separate user control.

export const density = {
  scale: {
    steps: '0.85 compact / 1.00 standard / 1.20 roomy',
    affects:
      'bubble radii, {spacing.gutter}, zone padding. NOT {spacing.cell-clearance}: DESIGN.md lets density drive clearance, and AD-8 overrode that because it makes the density control a fourth relayout action and contradicts FR-16. Clearance is reserved once at the roomiest step and no longer follows density.',
    excludes: 'type sizes — those are {type.scale}, a separate control',
  },
} as const;
