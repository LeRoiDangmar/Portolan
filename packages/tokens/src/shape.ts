// shape — DESIGN.md's `shape` namespace, transcribed (AD-23).
//
// The namespace AD-8 is unimplementable without: `bubble.deform.reservation` is the
// rule that the layout reserves the DEFORMED hull plus {spacing.cell-clearance} before
// placement, and `bubble.core` is the invariant rectangle the silhouette may never
// cross. Two channels, and only one of them is data — the seeded silhouette is
// RECOGNITION and does not survive 25% zoom-out; the link-driven deformation is DATA
// and does.

export const shape = {
  bubble: {
    silhouette: {
      geometry: 'closed cubic Bézier, 28 control points',
      amplitude: '±11% of base radius',
      seed: "the object's AD-5 IDENTITY KEY — `stack/service/slot` for a replicated task, `stack/service/node` for a global one, the name for a volume or network. SUPERSEDES DESIGN.md, which says the Docker ID, and FR-13, which says the same: AD-6 is a declared departure raised upstream, because a container ID makes *the same shape across every survey* false from the first redeployment onward. Accepted cost, named there: two genuinely different containers render as one body, and the container ID stays visible in the detail panel where it misleads nobody.",
      floor: 'the contour may never cross the invariant core rectangle',
      channel: 'RECOGNITION ONLY. It does not survive 25% zoom-out and is not read as data.',
    },
    deform: {
      rule: 'radial extension along the bearing of every link',
      max: '+32% of base radius',
      falloff: 'cos² over ±38° around each bearing',
      cap: '+32% total, whatever the link count',
      degenerate: 'a single-link object becomes a teardrop pointing at its one neighbour',
      squash: 'none — neighbours never flatten each other',
      reservation:
        'the layout reserves the deformed hull + {spacing.cell-clearance}; stretched silhouettes never overlap',
      channel: 'DATA. Driven by relationships, never by seed. It survives 25% zoom-out.',
    },
    core: {
      geometry: '0.59w × 0.50h of the undeformed bounding box, rounded {rounded.lg}',
      contents: 'name, identifier, pastille rail',
      rule: 'invariant — never deformed, never rotated, never rescaled by {motion.breathe}',
    },
    radius: {
      service: '54px',
      container: '46px',
      volume: '32px',
      note: 'at {density.scale} 1.00, LOD rung 0',
    },
  },
  pastille: {
    size: '10 × 10px nominal, {rounded.sm}',
    'min-size':
      '8 × 8px — THE MARK FLOOR. The counterpart of the 9px type floor: no pastille renders smaller, ever.',
    gap: '3px',
    space:
      "screen space. Marks do not scale with the canvas transform; the rail is sized from the core's rendered width.",
    fit: "rail width = n·size + (n−1)·{shape.pastille.gap}, and it must fit the core's width ({shape.bubble.core} 0.59w). The rail shrinks uniformly to fit, down to {shape.pastille.min-size}; if it still does not fit, network badges drop from the right of the network group until it does. THE RAIL NEVER BREACHES THE CORE.",
    capacity:
      'at 0.59 × 2r — service 63.7px, container 54.3px, volume 37.8px. Nominal 10px: 5 / 4 / 3 marks. At the 8px floor: 6 / 5 / 4. A container on two networks (type·stack·net·net·health = 5) fits at 8.5px; on three it drops one hexagon.',
    type: 'SQUARE, filled',
    stack: 'DIAMOND (square rotated 45°); hollow at 1.5px stroke when the object has no stack',
    network:
      "HEXAGON, 1.4px stroke, filled with {shape.network-octave}'s pattern in that network's hue",
    health: 'CIRCLE, filled, r = half the current mark size (5px nominal, 4px at the floor)',
    order: 'type · stack · network(s) · health, left to right, always',
  },
  'stack-outline': {
    geometry:
      "a closed hull struck at a constant {spacing.cell-clearance} outside the reserved cells of the stack's members, every turn radiused — an equidistant, drafted curve, never an amorphous one",
    fill: 'NONE, EVER. A network zone is a field with no boundary; a stack outline is a boundary with no field. That inversion is the decision.',
    position:
      'DERIVED. The outline follows wherever the zones put its members and never asks the layout for position, so it costs the network channel nothing. Two marks owning position is the node-backdrop failure, and it does not arrive a second time here.',
    routing:
      'it threads around intervening non-members where the layout leaves room; where it cannot, it encloses them — and the diamond pastille is the exact answer, which is the case the ruling names',
    partition:
      'a service belongs to one stack, so no two outlines ever share a member. Zones OVERLAP by construction; outlines only INTERSECT, and only where the layout has interleaved members.',
    label:
      'set ON the stroke, upper-left, in {typography.stack-label} at {colors.ink-2} — one step quieter than the zone label in {colors.ink}',
    surfaces:
      'the overview only. Not drawn in the node view, for the same reason network zones are not: a stack spans machines, so its hull would cross every region.',
  },
  'network-octave': {
    rule: "HUE = the network's index in the six-step rotation. PATTERN = the octave, i.e. which turn of the rotation it is on. Network 7 is hue 1 with the second pattern; network 13 is hue 1 with the third.",
    patterns:
      'solid / half (diagonal split) / ring (concentric) / dotted — extensible; four patterns carry 24 networks',
    zone: 'the pattern rides the tint field itself, so it is present at LOD rung 0 where the pastille is not',
    pastille: 'the same pattern fills the network hexagon',
    constraint:
      "the pattern modulates hue and coverage, NEVER luminance. Every cell of a patterned field measures inside the tint's own 1.13–1.19 band, so the iso-luminant guarantee and every edge floor survive it unchanged.",
    cost: 'a pattern inside an 8px badge is a ~6px interior. Unproven at that size — see Open Questions.',
  },
} as const;
