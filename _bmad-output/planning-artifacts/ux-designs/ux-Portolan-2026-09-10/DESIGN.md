---
name: Portolan
description: The visual identity of the Portolan chart — a precision instrument in near-black and brass, where density is graphic and never textual.
status: final
updated: 2026-09-11
sources:
  - ../../briefs/brief-Portolan-2026-09-09/brief.md
  - ../../briefs/brief-Portolan-2026-09-09/addendum.md

# ---------------------------------------------------------------------------
# COLORS — flat, kebab-case, hex strings (spec §Frontmatter tokens).
# Portolan is dark by default, so the convention is INVERTED against the usual
# pattern: a bare token name is the DARK value; the `-light` suffix carries the
# light value. The spec sanctions either form; this one reads as the product does.
# ---------------------------------------------------------------------------
colors:
  # --- Chassis surfaces -----------------------------------------------------
  ground: '#06080A'
  ground-light: '#EDF1F3'
  canvas: '#04070A'
  canvas-light: '#EDF1F3'
  panel: '#0A0D10'
  panel-light: '#E2E8EC'
  field: '#0E1216'
  field-light: '#F6F8F9'
  bezel: '#0C1116'
  bezel-light: '#DCE3E7'
  hairline: '#182026'
  hairline-light: '#C6D0D6'
  rule: '#2A343C'
  rule-light: '#AFBCC4'
  panel-header: '#0C1015'
  panel-header-light: '#DDE4E8'
  tab-bar: '#080B0E'
  tab-bar-light: '#DDE4E8'
  legend: '#070A0D'
  legend-light: '#E7ECEF'
  band-a: '#070B0E'
  band-b: '#05080B'
  band-a-light: '#E7ECEF'
  band-b-light: '#EDF1F3'
  band-divider: '#151D23'
  band-divider-light: '#D4DCE1'

  # --- Ink ------------------------------------------------------------------
  # Three text inks and nothing else. Every one of them meets 4.5:1 on every
  # chassis surface in both modes; ink-3 is the quietest TEXT ink, not a
  # sub-threshold grey. See the chassis block of the contrast table.
  ink: '#DCE6EC'
  ink-light: '#10171C'
  ink-2: '#94A3AD'
  ink-2-light: '#4A5A66'
  ink-3: '#78858F'
  ink-3-light: '#576470'
  bubble-id: '#A0AEB8'
  bubble-id-light: '#42525E'
  node-label: '#7E8B94'
  node-label-light: '#55636C'

  # --- Metals (rare, and only where they carry information) -----------------
  brass: '#C6A664'
  brass-light: '#7B6228'
  steel: '#7FA8BC'
  steel-light: '#3C6F86'
  glass: '#A8DCEF'
  glass-light: '#1E6B8C'

  # --- Focus. Chrome only, never on the map — which is why it can own a
  #     colour without breaking the metals' one-job rule.
  focus: '#B4C4CE'
  focus-light: '#33454F'

  # --- Bubble bodies (vertical gradients) -----------------------------------
  body-top: '#141C22'
  body-mid: '#0B1116'
  body-base: '#080D11'
  body-top-light: '#FFFFFF'
  body-mid-light: '#FFFFFF'
  body-base-light: '#FAFCFD'
  body-sel-top: '#1B2830'
  body-sel-mid: '#0E161C'
  body-sel-base: '#0A1014'
  body-sel-top-light: '#FFFFFF'
  body-sel-mid-light: '#FFFFFF'
  body-sel-base-light: '#F4F9FB'
  body-volume-top: '#161A18'
  body-volume-base: '#090C0E'
  body-volume-top-light: '#FFFFFF'
  body-volume-base-light: '#FBFAF7'
  contour: '#4E6470'
  contour-light: '#7E8C95'
  contour-inner: '#1E2A32'
  contour-inner-light: '#E4EAEE'
  contour-orphan: '#94A3AD'
  contour-orphan-light: '#5F6E78'
  body-orphan: '#0A0E11'
  body-orphan-light: '#FFFFFF'
  plate: '#0B1015'
  plate-light: '#FFFFFF'

  # --- Network zone hues. HUE = the network's place in a six-step rotation,
  #     assigned in creation order and held for the life of the network;
  #     OCTAVE = which turn of that rotation, carried by {shape.network-octave}
  #     as a fill pattern rather than by a colour. Iso-luminant by
  #     construction: every tint sits at 1.13–1.19 against its ground, in both
  #     modes, so edge contrast does not depend on which zone an edge crosses.
  zone-tint-1: '#0B1E28'
  zone-tint-2: '#1B1710'
  zone-tint-3: '#17161E'
  zone-tint-4: '#0F2015'
  zone-tint-5: '#231521'
  zone-tint-6: '#141C2B'
  zone-tint-1-light: '#D7E6EC'
  zone-tint-2-light: '#EDE3CF'
  zone-tint-3-light: '#E3E1EC'
  zone-tint-4-light: '#D9E7DC'
  zone-tint-5-light: '#F0DEE4'
  zone-tint-6-light: '#DDE1EF'
  zone-isoline-1: '#3F7286'
  zone-isoline-2: '#836B3B'
  zone-isoline-3: '#6C6885'
  zone-isoline-4: '#437E59'
  zone-isoline-5: '#8F6079'
  zone-isoline-6: '#61759A'
  zone-isoline-1-light: '#4C7E8E'
  zone-isoline-2-light: '#8A6E2C'
  zone-isoline-3-light: '#625E7C'
  zone-isoline-4-light: '#42805A'
  zone-isoline-5-light: '#9C5C7C'
  zone-isoline-6-light: '#5A6EA0'

  # --- Edges ----------------------------------------------------------------
  edge-attach: '#5B8494'
  edge-attach-light: '#4A6A78'
  edge-mount: '#C6A664'
  edge-mount-light: '#7A6430'

  # --- Stack outline. The SECOND grouping language: the tinted field says
  #     network, the outline says stack. Graphite on purpose — one colour for
  #     every stack, because which stack is the diamond pastille's answer. Sits
  #     ≥3:1 over the clamped zone field in both modes and DELIBERATELY below
  #     both edge kinds: a grouping mark may not out-shout the product.
  stack-outline: '#6B7A85'
  stack-outline-light: '#5F6E78'

  # --- Pastilles. SHAPE = FAMILY, COLOUR = VALUE. -----------------------------
  pastille-type-service: '#EDF3F6'
  pastille-type-container: '#9FB4C0'
  pastille-type-volume: '#C6A664'
  pastille-type-node: '#5F8C7E'
  pastille-type-service-light: '#10171C'
  pastille-type-container-light: '#4E6472'
  pastille-type-volume-light: '#8A6E2C'
  pastille-type-node-light: '#2F6152'
  pastille-stack-1: '#C6A664'
  pastille-stack-2: '#7FA8BC'
  pastille-stack-3: '#6FB2A0'
  pastille-stack-4: '#C48FA8'
  pastille-stack-5: '#9A94C0'
  pastille-stack-6: '#8FB073'
  pastille-stack-none: '#78848D'
  pastille-stack-1-light: '#8A6E2C'
  pastille-stack-2-light: '#3C6F86'
  pastille-stack-3-light: '#2E7566'
  pastille-stack-4-light: '#8E5570'
  pastille-stack-5-light: '#5A559A'
  pastille-stack-6-light: '#4F7434'
  pastille-stack-none-light: '#5F6E78'
  pastille-network-1: '#4A8296'
  pastille-network-2: '#967C46'
  pastille-network-3: '#7A7695'
  pastille-network-4: '#4E9268'
  pastille-network-5: '#A46F8B'
  pastille-network-6: '#7286B0'
  pastille-network-1-light: '#3D6C7E'
  pastille-network-2-light: '#7A6430'
  pastille-network-3-light: '#55506E'
  pastille-network-4-light: '#356B4A'
  pastille-network-5-light: '#864C68'
  pastille-network-6-light: '#4A5D8B'
  pastille-health-nominal: '#4C9BD6'
  pastille-health-degraded: '#C08A3C'
  pastille-health-stopped: '#BF5747'
  pastille-health-nominal-light: '#1F6FA8'
  pastille-health-degraded-light: '#9A6410'
  pastille-health-stopped-light: '#A63B2B'

  # --- Staleness veil -------------------------------------------------------
  state-stale: '#0A0E12'
  state-stale-light: '#F1F3F4'

# ---------------------------------------------------------------------------
# TYPOGRAPHY — nested (spec §Frontmatter tokens). Two families, embedded in
# the image and served by Portolan. No CDN, no webfont host, no system stack.
# ---------------------------------------------------------------------------
typography:
  mono:
    fontFamily: 'IBM Plex Mono'
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.35'
    letterSpacing: 0.02em
    note: 'SIL OFL 1.1 · AGPLv3-compatible · redistributable inside the image. Identifiers only.'
  sans:
    fontFamily: 'IBM Plex Sans'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.45'
    note: 'SIL OFL 1.1 · matched superfamily metrics with the mono. Chassis only.'
  bubble-name:
    fontFamily: 'IBM Plex Sans'
    fontSize: 13.5px
    fontWeight: '600'
    letterSpacing: -0.01em
  bubble-id:
    fontFamily: 'IBM Plex Mono'
    fontSize: 9px
    letterSpacing: 0.04em
  plate:
    fontFamily: 'IBM Plex Mono'
    fontSize: 10px
    lineHeight: '1'
  zone-label:
    fontFamily: 'IBM Plex Mono'
    fontSize: 9.5px
    letterSpacing: 0.26em
    note: 'Uppercased in render.'
  zone-sub:
    fontFamily: 'IBM Plex Mono'
    fontSize: 9px
    letterSpacing: 0.1em
    note: 'Raised from 8.5px: a CIDR names a cluster object, so it takes the 9px object floor.'
  stack-label:
    fontFamily: 'IBM Plex Mono'
    fontSize: 10px
    letterSpacing: 0.02em
    note: 'Set as typed — NOT uppercased, NOT tracked, and that is deliberate. The zone label is uppercase at 0.26em; case and tracking are the cheapest tell at rung 0 that the two grouping labels are not the same kind of mark.'
  node-label:
    fontFamily: 'IBM Plex Mono'
    fontSize: 10px
    letterSpacing: 0.34em
    note: 'Uppercased in render.'
  section-label:
    fontFamily: 'IBM Plex Mono'
    fontSize: 8px
    letterSpacing: 0.26em
    note: 'Uppercased in render. Panel and chart-legend section heads.'
  marginalia:
    fontFamily: 'IBM Plex Mono'
    fontSize: 8.5px
    letterSpacing: 0.2em
  graduation:
    fontFamily: 'IBM Plex Mono'
    fontSize: 8px
    letterSpacing: 0.1em
  scale:
    steps: '0.90 / 1.00 / 1.15'
    affects: 'every rendered size in the ramp above'
    floor-object: '9px — anything naming a cluster object: bubble-name, bubble-id, plate, zone-label, zone-sub, stack-label, node-label, mono.'
    floor-chassis: '8px — chassis annotation that names nothing: section-label, marginalia, graduation, sans.'
    clamp: 'the scale multiplies, then CLAMPS at the role''s own floor. 0.90 shrinks only the roles that have room above their floor, so no glyph ever renders below 8px, and no identifier below 9px, at any step.'
    note: 'User control, left menu. The two floors are what the ramp can actually hold — an earlier single 9px claim was false of four roles at 1.00 and six at 0.90.'

rounded:
  sm: 1px
  DEFAULT: 2px
  md: 3px
  lg: 6px
  full: 9999px
  note: 'Bubbles have no radius — they are paths, not boxes.'

spacing:
  '1': 2px
  '2': 4px
  '3': 8px
  '4': 12px
  '5': 16px
  '6': 24px
  '7': 32px
  '8': 48px
  gutter: 24px
  panel-pad: 16px
  bezel: 12px
  left-menu: 236px
  detail-panel: 320px
  tab-bar: 56px
  toolbar: 40px
  chart-legend: 120px
  cell-clearance: 8px

# ---------------------------------------------------------------------------
# EXTENSION NAMESPACES — declared beyond the DESIGN.md spec.
# The spec covers colors / typography / rounded / spacing / components. It has
# no home for motion, elevation, opacity, stroke, non-rectangular shape,
# density or viewport floor, all of which are load-bearing in a live graph.
# These seven top-level keys are Portolan's extension and are named exactly as
# EXPERIENCE.md already references them, so those references resolve unchanged.
# ---------------------------------------------------------------------------
motion:
  breathe:
    property: 'scale + rotate, on the body path only'
    scale: '1.000 → 1.018'
    rotate: '±0.7deg'
    period: '5.5s – 9.7s'
    periods: '5.5 / 6.1 / 6.9 / 7.7 / 8.3 / 9.1 / 9.7s'
    delays: '-0.8 / -1.9 / -2.6 / -3.1 / -4.4 / -5.2 / -6.8s'
    easing: 'ease-in-out'
    translation: '0px. The body centre does not move. There is no positional drift at any scale, any density or any zoom.'
    outline-excursion: '±3.4px, applied normal to the contour — an outline deformation, not a displacement. The centroid of the excursion is the rest centroid.'
    outline-excursion-periods: '9 / 11 / 13 / 15 / 17 / 19 / 23s'
    outline-excursion-delays: '-1.2 / -2.3 / -3.9 / -4.7 / -6.4 / -8.1 / -11.5s'
    edge-drift: '±1.3px / 21s — the endpoint rides the contour it is anchored under; the edge''s far end is likewise anchored, so no edge translates either'
    edge-anchor: '14px inside the body'
    core: 'the invariant core — name, identifier, pastille rail — is not touched by any of this. Labels and click targets never travel.'
    contract: 'AMPLITUDE BOUNDS THE OUTLINE, NEVER THE POSITION. Zero-mean, non-accumulating, confined to the reserved cell. Translation is zero, not small.'
  draw:
    sequence: 'network zones → bubbles → edges, preceded by the node backdrop when that display control is on'
    layer: '320ms'
    stagger: '140ms'
    total: '~1.4s'
    edge-technique: 'stroke-dashoffset, 420ms, drawn outward from the body'
    easing: 'cubic-bezier(0.2, 0, 0.1, 1)'
  settle:
    duration: '260ms'
    gesture: 'every layer lands on one frame; the four corner registration crosses strike brass for 180ms and return to hairline'
    hold: '200ms before the first breath'
  enter:
    duration: '420ms'
    gesture: 'fade 0 → 1 while the contour resolves from a circle to its own silhouette, at its earned position'
    easing: 'cubic-bezier(0.2, 0, 0.1, 1)'
  exit:
    duration: '520ms'
    gesture: 'fade 1 → 0 in place while the contour relaxes back to a circle; the cell is not reclaimed until the next relayout'
  relayout:
    duration: '900ms'
    easing: 'cubic-bezier(0.65, 0, 0.35, 1)'
    gesture: 'bodies travel curved paths; every edge stays attached for the whole traverse; zone tints crossfade over the same window'
  reduced-motion:
    note: 'prefers-reduced-motion stills {motion.breathe} entirely — bodies return to their rest pose, nothing is lost. Every other motion token is kept: it explains what changed.'

elevation:
  bubble:
    dark: 'feDropShadow dy 0.11r · stdDeviation 0.15r · #000 @ 0.90 — PROPORTIONAL TO THE RENDERED BODY, capped at dy 5 / stdDeviation 7 (the r 46 value, which is what the absolute figures always were)'
    dark-small: 'feDropShadow dy 0.07r · stdDeviation 0.09r · #000 @ 0.85, capped at dy 3 / stdDeviation 4 — volumes and echoes'
    floor: 'no shadow at all below a rendered body diameter of 30px. At LOD rung 0 on any cluster past ~150 objects the bodies are 14–28px across, so rung 0 carries no shadow: the contour does the lifting, exactly as it already does in light mode.'
    rationale: 'the fixed dy 5 / σ 7 drop extends ~21px past the silhouette — 1.5× the whole body at map scale, against 8px of cell clearance — and 325 unaccelerated SVG filter regions re-rasterise on every breath. Proportional-plus-floor fixes both the fog and the frame rate.'
    light: 'none — the light body is {colors.body-mid-light} against a tinted ground, lifted by its 1px {colors.contour-light} hairline. Light mode is therefore the palette that survives the dense frame intact, and it is already the screenshot palette.'
    note: 'Stylised depth only. No perspective, no isometric, no z-axis.'
  panel:
    dark: 'inset 1px hairline, no shadow'
    light: 'inset 1px hairline, no shadow'
  halo:
    dark: 'radialGradient, {colors.glass} 0 → 0.13 between 60% and 100% of 1.13r'
    light: 'ring, 0.6px {colors.glass-light} @ 0.35 at 1.13r'

opacity:
  dim:
    unreachable: 0.18
    filter-context: 0.10
  echo: 0.55
  reticle-fine: 0.55
  reticle-coarse: 0.80
  zone-isoline: 1.00
  zone-field-cap: 'the composited zone field is LUMINANCE-CLAMPED to a single tint. Hue blends where fields overlap; luminance does not accumulate.'

stroke:
  edge:
    width: '1.6px'
    graduation: '4px dasharray 0.6 7 @ 0.55, overlaid on the solid stroke'
    attach: '0.9px dasharray 2 4, {colors.edge-attach}'
    attach-min-length: '6px on screen — the attachment stub never shrinks below one and a half periods of its own 2 4 dasharray, so it stays a visible mark at rung 0'
    mount: '1.6px solid, {colors.edge-mount}'
    floor: 'never below 3:1 against the worst composited zone field, in either mode. The clamp in {opacity.zone-field-cap} is what makes the worst composite equal to a single tint, and therefore what makes this floor checkable rather than true-of-one-layer.'
  zone:
    isoline:
      width: '3.5px'
      dasharray: '0.8 9'
      opacity: '{opacity.zone-isoline}'
      style: 'open contour — never closed, never a filled outline'
      color: '{colors.zone-isoline-1}…{colors.zone-isoline-6}'
    blob:
      width: '1px'
      style: 'solid, closed'
      color: '{colors.pastille-network-1}…{colors.pastille-network-6}'
  stack-outline:
    width: '1.25px'
    style: 'solid, closed, continuous — no dasharray, no graduation, no fill of any kind'
    color: '{colors.stack-outline}'
    break: 'the stroke opens once, for its own label, and nowhere else'
    floor: '≥3:1 over the clamped zone field in both modes, and deliberately BELOW both edge kinds. An edge runs between two bodies and terminates on them; this closes on itself and terminates on nothing. Nothing may counterfeit an edge — including a grouping mark.'
  hairline: '0.75px'
  rule: '1px'
  contour: '1px'
  contour-inner: '0.7px at 0.87r'
  band-divider: '0.8px, {colors.band-divider}'
  focus: '2px {colors.focus}, 2px offset, square corners, no radius'

shape:
  bubble:
    silhouette:
      geometry: 'closed cubic Bézier, 28 control points'
      amplitude: '±11% of base radius'
      seed: 'the object''s Docker ID — stable across every survey, identical in every screenshot'
      floor: 'the contour may never cross the invariant core rectangle'
      channel: 'RECOGNITION ONLY. It does not survive 25% zoom-out and is not read as data.'
    deform:
      rule: 'radial extension along the bearing of every link'
      max: '+32% of base radius'
      falloff: 'cos² over ±38° around each bearing'
      cap: '+32% total, whatever the link count'
      degenerate: 'a single-link object becomes a teardrop pointing at its one neighbour'
      squash: 'none — neighbours never flatten each other'
      reservation: 'the layout reserves the deformed hull + {spacing.cell-clearance}; stretched silhouettes never overlap'
      channel: 'DATA. Driven by relationships, never by seed. It survives 25% zoom-out.'
    core:
      geometry: '0.59w × 0.50h of the undeformed bounding box, rounded {rounded.lg}'
      contents: 'name, identifier, pastille rail'
      rule: 'invariant — never deformed, never rotated, never rescaled by {motion.breathe}'
    radius:
      service: '54px'
      container: '46px'
      volume: '32px'
      note: 'at {density.scale} 1.00, LOD rung 0'
  pastille:
    size: '10 × 10px nominal, {rounded.sm}'
    min-size: '8 × 8px — THE MARK FLOOR. The counterpart of the 9px type floor: no pastille renders smaller, ever.'
    gap: '3px'
    space: 'screen space. Marks do not scale with the canvas transform; the rail is sized from the core''s rendered width.'
    fit: 'rail width = n·size + (n−1)·{shape.pastille.gap}, and it must fit the core''s width ({shape.bubble.core} 0.59w). The rail shrinks uniformly to fit, down to {shape.pastille.min-size}; if it still does not fit, network badges drop from the right of the network group until it does. THE RAIL NEVER BREACHES THE CORE.'
    capacity: 'at 0.59 × 2r — service 63.7px, container 54.3px, volume 37.8px. Nominal 10px: 5 / 4 / 3 marks. At the 8px floor: 6 / 5 / 4. A container on two networks (type·stack·net·net·health = 5) fits at 8.5px; on three it drops one hexagon.'
    type: 'SQUARE, filled'
    stack: 'DIAMOND (square rotated 45°); hollow at 1.5px stroke when the object has no stack'
    network: 'HEXAGON, 1.4px stroke, filled with {shape.network-octave}''s pattern in that network''s hue'
    health: 'CIRCLE, filled, r = half the current mark size (5px nominal, 4px at the floor)'
    order: 'type · stack · network(s) · health, left to right, always'
  stack-outline:
    geometry: 'a closed hull struck at a constant {spacing.cell-clearance} outside the reserved cells of the stack''s members, every turn radiused — an equidistant, drafted curve, never an amorphous one'
    fill: 'NONE, EVER. A network zone is a field with no boundary; a stack outline is a boundary with no field. That inversion is the decision.'
    position: 'DERIVED. The outline follows wherever the zones put its members and never asks the layout for position, so it costs the network channel nothing. Two marks owning position is the node-backdrop failure, and it does not arrive a second time here.'
    routing: 'it threads around intervening non-members where the layout leaves room; where it cannot, it encloses them — and the diamond pastille is the exact answer, which is the case the ruling names'
    partition: 'a service belongs to one stack, so no two outlines ever share a member. Zones OVERLAP by construction; outlines only INTERSECT, and only where the layout has interleaved members.'
    label: 'set ON the stroke, upper-left, in {typography.stack-label} at {colors.ink-2} — one step quieter than the zone label in {colors.ink}'
    surfaces: 'the overview only. Not drawn in the node view, for the same reason network zones are not: a stack spans machines, so its hull would cross every region.'
  network-octave:
    rule: 'HUE = the network''s index in the six-step rotation. PATTERN = the octave, i.e. which turn of the rotation it is on. Network 7 is hue 1 with the second pattern; network 13 is hue 1 with the third.'
    patterns: 'solid / half (diagonal split) / ring (concentric) / dotted — extensible; four patterns carry 24 networks'
    zone: 'the pattern rides the tint field itself, so it is present at LOD rung 0 where the pastille is not'
    pastille: 'the same pattern fills the network hexagon'
    constraint: 'the pattern modulates hue and coverage, NEVER luminance. Every cell of a patterned field measures inside the tint''s own 1.13–1.19 band, so the iso-luminant guarantee and every edge floor survive it unchanged.'
    cost: 'a pattern inside an 8px badge is a ~6px interior. Unproven at that size — see Open Questions.'

density:
  scale:
    steps: '0.85 compact / 1.00 standard / 1.20 roomy'
    affects: 'bubble radii, {spacing.gutter}, {spacing.cell-clearance}, zone padding'
    excludes: 'type sizes — those are {typography.scale}, a separate control'

layout:
  min-width: '1440px'
  canvas-min: '884px'
  columns: '{spacing.left-menu} | canvas | {spacing.detail-panel}'

components:
  bubble:
    fill: 'linear-gradient({colors.body-top}, {colors.body-mid} 52%, {colors.body-base})'
    stroke: '{colors.contour}'
    stroke-width: '{stroke.contour}'
    inner-rule: '{colors.contour-inner} at {stroke.contour-inner}'
    shadow: '{elevation.bubble}'
    silhouette: '{shape.bubble.silhouette}'
    deform: '{shape.bubble.deform}'
    motion: '{motion.breathe}'
    name: '{typography.bubble-name}, {colors.ink}'
    identifier: '{typography.bubble-id}, {colors.bubble-id}'
  labelled-protrusion:
    plate-height: '17.5px'
    plate-radius: '{rounded.DEFAULT}'
    plate-fill: '{colors.plate}'
    plate-stroke: 'the colour of the edge it terminates'
    plate-text: '{typography.plate}'
    stalk: '1px, plate-stroke colour'
    anchor: 'a fixed bearing from the core centre, chosen in the concavities between the stretch bulges'
    baseline: 'shared per family, marked by a brass tick at both ends'
  pastille:
    size: '{shape.pastille.size}'
    min-size: '{shape.pastille.min-size}'
    fit: '{shape.pastille.fit}'
    type: '{shape.pastille.type}'
    stack: '{shape.pastille.stack}'
    network: '{shape.pastille.network}'
    health: '{shape.pastille.health}'
  health-pastille:
    nominal: '{colors.pastille-health-nominal}'
    degraded: '{colors.pastille-health-degraded}'
    stopped: '{colors.pastille-health-stopped}'
  network-zone:
    fill: '{colors.zone-tint-1}…{colors.zone-tint-6}, patterned per {shape.network-octave}'
    composite: '{opacity.zone-field-cap}'
    contour: '{stroke.zone.isoline}'
    label: '{typography.zone-label}, {colors.ink}'
    sublabel: '{typography.zone-sub}, {colors.ink-2}'
  stack-outline:
    geometry: '{shape.stack-outline}'
    stroke: '{stroke.stack-outline}'
    fill: 'none — {shape.stack-outline.fill}'
    label: '{typography.stack-label}, {colors.ink-2}, set on the stroke'
    layer: 'above {components.network-zone}''s isolines, below {components.edge}'
    motion: 'follows its members through {motion.relayout}; {motion.breathe} does not touch it'
  zone-rendering-mode:
    mode-a: 'tint field + {shape.network-octave} pattern + {stroke.zone.isoline} — DEFAULT'
    mode-b: 'disjoint blob + {stroke.zone.blob} + echo bubbles; the blob fill carries the same pattern'
    transition: '{motion.relayout}'
  echo-bubble:
    opacity: '{opacity.echo}'
    stroke-dasharray: '6 3'
  edge:
    attach: '{stroke.edge.attach}'
    attach-rendering: 'a short stub running from the body into its zone field, in {colors.edge-attach} — never the zone hue, which would put the edge outside the measured floor. The network has no position, so the stub IS the attachment''s far end'
    attach-min-length: '{stroke.edge.attach-min-length}'
    mount: '{stroke.edge.mount}'
    anchor: '{motion.breathe.edge-anchor}'
    motion: '{motion.breathe.edge-drift}'
  node-backdrop:
    default: 'OFF. A left-menu display control, not a permanent layer.'
    band-a: '{colors.band-a}'
    band-b: '{colors.band-b}'
    divider: '{stroke.band-divider}'
    label: '{typography.node-label}, {colors.node-label}'
  node-region:
    surface: 'Node view (tab 2) — the node as foreground subject'
    fill: '{colors.field}'
    border: '1px {colors.hairline}'
    radius: '{rounded.lg}'
    header: '{typography.node-label}, {colors.node-label}'
    subhead: '{typography.mono}, {colors.ink-2} — role and IP'
    empty: 'the region renders at full size with its header and a single line of {typography.marginalia} in {colors.ink-2}. A machine carrying nothing is information.'
  orphan-bubble:
    stroke: '{colors.contour-orphan}'
    stroke-dasharray: '5 4'
    fill: '{colors.body-orphan}'
  orphan-counter:
    typography: '{typography.mono}'
    color: '{colors.ink-2}'
  detail-panel:
    width: '{spacing.detail-panel}'
    padding: '{spacing.panel-pad}'
    background: '{colors.panel}'
    border: '1px {colors.hairline}'
    header: '{colors.panel-header}'
    section-head: '{typography.section-label}, {colors.ink-2}'
    value: '{typography.mono}, {colors.ink}'
    key: '{typography.sans}, {colors.ink-3}'
    states:
      loading: 'the chassis draws immediately — header, section heads, rules — and the value column holds a 1px {colors.hairline} rule at each value''s width until the value arrives. No spinner, no skeleton shimmer: an instrument with a needle not yet settled.'
      subject-vanished: 'the panel stays, the values freeze, and a {typography.marginalia} line in {colors.ink-2} reads "Not in the last survey." The panel is dismissed by the next click, never by itself — the object''s disappearance is the answer the user came for.'
      stale: 'the panel does NOT take the map''s veil. Text is the one thing that must not age: the panel keeps full contrast and the survey stamp in the tab bar carries the age for both.'
  bottom-tab-bar:
    height: '{spacing.tab-bar}'
    background: '{colors.tab-bar}'
    active: 'inset 0 1px 0 {colors.glass}, background {colors.bezel}'
  left-menu:
    width: '{spacing.left-menu}'
    background: '{colors.panel}'
    section-head: '{typography.section-label}, {colors.ink-2}'
    checkbox: '11 × 11px, {rounded.sm}, checked fill {colors.glass}'
    filter-swatch: '10 × 10px, {rounded.sm}, carrying that filter''s zone or stack colour and, for a network, its {shape.network-octave} pattern'
    count: '{typography.mono}, {colors.ink-3}, right-aligned'
    marginalia: '{typography.marginalia}, {colors.ink-3} — reads READ ONLY, and nothing else'
  focus-ring:
    treatment: '{stroke.focus}'
    applies-to: 'every focusable chrome control — left-menu rows and checkboxes, the three bottom tabs, the toolbar chips, the export row. Never the graph canvas.'
    note: 'the replacement for glass, which is reserved to selection. Focus is chrome-only, so it never appears on the map and never competes with a selected body.'
  control-chip:
    geometry: '24px tall, {rounded.DEFAULT}, 1px border, 8px horizontal padding, {typography.section-label} uppercase'
    action: 'border {colors.hairline}, text {colors.ink-2} — a momentary action'
    latched: 'border and text {colors.glass} — the chip reports a live state the user put it in'
    unavailable: 'border {colors.hairline}, text {colors.ink-3}, no pointer — a disabled control, exempt from the text floor by the same convention every disabled control is'
    focus: '{stroke.focus}'
    rule: 'never filled. There is no primary action in a read-only product.'
  fit-to-chart:
    pattern: '{components.control-chip}, action'
    placement: 'toolbar'
  reorganise:
    pattern: '{components.control-chip}, action'
    placement: 'toolbar'
  isolate:
    pattern: '{components.control-chip}, latched while a subject is set'
    placement: 'toolbar; present only while an object is selected'
  keep-only-this:
    pattern: '{components.control-chip}, latched while the filter is on'
    placement: 'toolbar, immediately right of Isolate; present only while an object is selected'
    mark: 'while latched, the chip carries the current hop reach as a mono numeral in {colors.glass} — 1, 2 or ∞'
  export:
    pattern: 'left-menu row, with SVG and PNG as two inline {components.control-chip} actions'
    placement: 'left menu, with the display controls'
    safe-to-share: 'an 11 × 11px checkbox on the row above the two chips, styled exactly as every other left-menu checkbox — {rounded.sm}, checked fill {colors.glass}. ON by default.'
    masked-value: 'the value is struck and replaced by a run of filled blocks at the mono''s own character pitch — one block per character, 0.62em tall on the baseline, {rounded.sm}, {colors.ink-3}. Fixed pitch means the footprint is identical to the value it replaces, so nothing reflows and the chart the exporter framed is the chart that leaves.'
    masked-scope: 'every IP and every CIDR in the frame — {typography.zone-sub} beneath a zone label, and any address on a plate or in the legend. Nothing else.'
  refresh-interval:
    pattern: 'left-menu row carrying four inline {components.control-chip}s — 5s / 10s / 30s / 60s — the current one LATCHED, the other three in the action treatment'
    placement: 'left menu, with the display controls'
    value: '{typography.section-label} uppercase, as every chip is'
    note: '[ASSUMPTION] this file commits no vocabulary of its own for a stepped setting. The latched chip is the vocabulary it already has, and text size, density and palette take the same shape by implication.'
  survey-stamp:
    pattern: 'not a control — marginalia'
    placement: 'right margin of the bottom tab bar, {typography.marginalia}, {colors.ink-2}'
  reachability-highlight:
    lit: 'full ink'
    dimmed: '{opacity.dim.unreachable}'
    subject: '{colors.glass} contour at 1.7px + four-branch reticle + {elevation.halo}'
  stale-map:
    veil: '{colors.state-stale}, alpha 0 → 0.42 over 15 min'
    saturation: '1.00 → 0.35 over the same window'
    stamp: '{typography.marginalia}, {colors.ink-2}'
  chart-legend:
    height: '{spacing.chart-legend}'
    background: '{colors.legend}'
    columns: 'six, separated by {colors.hairline}'
    head: '{typography.section-label} in {colors.ink-2}, index numeral in {colors.brass}'
---

# Portolan — Visual Spine

`EXPERIENCE.md` owns how Portolan behaves. This file owns how it looks, and every `{token}` that file references resolves here. **The two documents are *the spines***; where either says *both spines*, it means this pair and nothing else.

**The names used here without being redefined.** **Rémi** and **Tom** are the two reader personas, **Jules** is the product owner, and the numbered **Flows** and **journeys** are the user journeys. All of them are defined in `EXPERIENCE.md` and in the brief.

Marker convention, shared with `EXPERIENCE.md`: **[DEPARTS FROM BRIEF]** flags a decision that knowingly contradicts a written brief statement. `[ASSUMPTION]` flags something this document supplies that was never confirmed by Jules.

**Spelling.** The body is en-GB — *colour*, *behaviour*, *centred* — and one shipped control is named *Reorganise*. That is a deliberate exception to the Microsoft Writing Style Guide's US spelling, taken because converting would rename a control in the product.

**Frontmatter note.** The canonical spec keys — `colors`, `typography`, `rounded`, `spacing`, `components` — are used as specified. Seven further top-level namespaces are an **extension**: `motion`, `elevation`, `opacity`, `stroke`, `shape`, `density`, `layout`. The spec has no home for any of them, and all seven are load-bearing in a graph that breathes, deforms, dims and refuses to render below 1440px. They are named exactly as `EXPERIENCE.md` already references them.

**Mocks and studies.** The mockups and the shape and zone studies are linked inline from the section each one illustrates. **They illustrate; this file is the contract** — where a mock and this file disagree, the spine wins. Each mock's own in-file notes record the composition decisions the spine does not specify, which is where a builder should look for anything this file leaves open.

**[DEPARTS FROM BRIEF] — export is in v1, and four sections below are derived from that.** Marked here as it is in `EXPERIENCE.md`: the brief puts SVG/PNG export **out of v1** — *"wanted later, screenshot accepted for now"*. It is in v1, and four visual requirements in this file are derived from that reversal: embedded fonts (*Typography*), light mode made first-class rather than derived (*Colors*), the chart legend declared part of the chart (*Chart legend*), and the graduated bezel and corner crosses declared uncroppable from the exported frame (*Layout & Spacing*). The argument for the reversal is **not** the screenshot success signal — the brief already routes that through a plain screenshot. It is that a screenshot cannot carry the chart legend, cannot carry the bezel, and cannot be framed: an export can, and those three are what make the frame read as a chart.

**What this file does not cover.** There is **no login screen and no authentication in v1** — opening Portolan lands straight on the map, so there is no first-run surface, no session state and no account affordance anywhere in the chrome, and the chassis is drawn on that basis. There is **no layout below `{layout.min-width}` 1440px**, which is a floor and not a breakpoint: no responsive behaviour is specified because there is no second layout. **Keyboard traversal of the graph and screen-reader support are out of scope for v1** — a builder working from this file alone should know it; **ordinary tab focus on the chrome is not**: it exists, it is ruled rather than assumed, and `{components.focus-ring}` is what makes it visible (see `EXPERIENCE.md` → *Accessibility Floor*). And **behaviour is not here at all**, including which controls are reachable by Tab and in what order — `EXPERIENCE.md` owns it. The one thing the missing auth surface does bear on visually is exposure, and that argument is made in *Layout & Spacing*.

**Contents.** The eight sections below are in the order the spec fixes.

| § | What it settles |
|---|---|
| [Brand & Style](#brand--style) | the register, the governing principle, depth as style and never as space |
| [Colors](#colors) | two palettes, the three metals, the zone rotation, the measured floors, colour-vision coverage |
| [Typography](#typography) | two families, twelve roles, two floors |
| [Layout & Spacing](#layout--spacing) | three fixed columns, the 2-based scale, the bezel, what leaves in an export |
| [Elevation & Depth](#elevation--depth) | proportional shadow in dark, tone in light, the layer order |
| [Shapes](#shapes) | the bubble path and its two channels, pastille geometry |
| [Components](#components) | the catalogue, listed below |
| [Dos and don'ts](#dos-and-donts) | every rule above, in one table |

*Components*, in file order: Bubble · Labelled protrusion · Pastille · Health pastille · Network zone · Stack outline · Zone rendering mode · Echo bubble · Edge · Node backdrop · Node view · Orphan bubble · Orphan counter · Detail panel · Bottom tab bar · Left menu · Reachability highlight · Stale map · Chart legend · Control vocabulary · Control chip · Fit to chart · Reorganise · Isolate · Keep only this · Export (SVG / PNG) · Masked values · Refresh interval · Survey stamp · Focus.

Then [*Open Questions*](#open-questions), and a [*Revision Notes*](#revision-notes) appendix carrying the corrections this file has made to its own earlier drafts.

---

## Brand & Style

**Portolan is a 14th-century nautical chart, and the interface says so out loud.** The register is `cartographie assumée` — *cartography owned outright* — real chart vocabulary, chosen over discreet allusion: rhumb bearings, paper-and-ink tones, coastline reading on the zone edges, cartographer's typography, and a **chart legend** band that is an actual chart legend rather than a UI key. The name stops being a codename and becomes design material — something the brief never did.

Within that register, the execution is **precision instrument**: the chart as a piece of brass and glass. Deep near-black ground, capillary hairlines at 0.75px, a graduated bezel on all four edges, registration crosses at the corners, and metals that appear *only where they carry information*. No texture, no romance, no parchment. The reading should feel metrological — you are not looking at a picture of a cluster, you are taking a measurement. The chosen direction is drawn whole at [`mockups/direction-2-instrument-de-precision.html`](mockups/direction-2-instrument-de-precision.html) — chassis, bezel, corner crosses and the dark-and-light pair, with its hex values documented in the file's own style comments.

The governing principle, and the most important line in this file:

> ## BEAUCOUP À REGARDER, PEU À LIRE
> *Much to look at, little to read.*

Impressive density comes from network zones, blended tints, irregular silhouettes, edges and type pastilles. **It never comes from text density.** This is how one screen serves both masters: Rémi reads an anomaly in five seconds because there is almost nothing to decipher; Tom screenshots it because it is graphically rich. The brief's *legible over impressive* is honoured by reading it as a constraint on **reading load**, not on graphic richness. Every decision below is measured against this line, and anything that adds text at **rung 0** loses — rung 0 being the most zoomed-out step of the **level-of-detail (LOD)** ladder, which is the frame Portolan lands on and the frame it is screenshotted in.

The tension the principle arbitrates comes from **Jules's own journey 2**, which asks for a default screen almost too much to read easily. The brief's own ordering is left intact, not overruled. *Revision Notes* carries the journey-2 wording and records where an earlier draft mislocated the tension.

Depth is **stylistic, never spatial**. Shadow, elevation, gradient and halo are all available and all used. Perspective, isometry and a z-axis are not — the diagram is 2D and stays 2D.

---

## Colors

Two full palettes. **Dark is the default and the design target; light is first-class, not an afterthought** — screenshots get pasted into light-background threads and tickets, and a stranger's screenshot is the brief's top external success signal. Every token below exists in both, and the translucent overlapping zones were tuned in both.

**Ground and ink.** `#06080A` is the instrument black — a near-black with a trace of blue so it never reads as a printer's dead black. The map canvas goes one step deeper still (`#04070A`) so the chart sits *inside* the instrument. Light mode is `#EDF1F3`, ground glass rather than paper white. Body ink is `#DCE6EC` / `#10171C`, at 15:1 on the bubble body in dark and 18:1 in light.

**The three metals, and the discipline that governs them.** Brass `#C6A664`, steel `#7FA8BC`, glass `#A8DCEF`. They are rare on purpose and each has exactly one job:

- **Brass** is *volume*. It carries mount edges, the volume value in the type pastille family, graduation accents and the protrusion baseline ticks. When you see gold on this map, something is mounted.
- **Steel** is *the second rank* — a stack value, a secondary structure.
- **Glass** is *selection, and nothing else.* No hover state, no accent, no decoration uses glass. If it glows, you clicked it.

Everything that is neither metal nor ink is graphite. This is the single rule that keeps the map from becoming a colour chart.

**Network zone hues — six, rotating, iso-luminant, and an octave pattern on top.** Networks are arbitrary in number, so the zone palette is a six-step rotation assigned in creation order and then held for the life of the network. Each hue exists at three strengths: **tint** (the field), **isoline** (the dashed contour), **pastille/blob** (the badge, and the hard boundary in mode B). The rotation is built iso-luminant — every tint measures 1.13–1.19:1 against its ground in both modes. That is not an aesthetic choice: it makes **edge contrast invariant to which zone an edge crosses**, which is what lets `EXPERIENCE.md`'s rule *nothing may dissolve an edge* be checked rather than hoped for.

**Beyond six networks, the hue repeats and a fill pattern marks the octave.** `{shape.network-octave}`: hue is the network's index in the six-step rotation, **pattern is which turn of the rotation it is on** — solid, half, ring, dotted, extensible. Network 7 is hue 1 in the second pattern; network 13 is hue 1 in the third. Four patterns carry 24 networks, which is twice the 8–12 an ordinary Swarm host runs.

Two properties make this the right repair rather than a decoration:

- **It rides the zone, not only the badge.** The pattern is in the tint field itself, so networks stay distinguishable at **LOD rung 0**, where the network pastille does not render at all. The landing frame and the exported frame — the two frames the product is judged on — regain an exact network answer they did not have. The badge could never have supplied it; *Revision Notes* says why.
- **It costs the system nothing.** Shape still equals family — the hexagon is still the hexagon. No seventh hue enters the palette. And the pattern **modulates hue and coverage, never luminance**, so every cell of a patterned field stays inside that tint's own 1.13–1.19:1 band and every edge floor measured below survives it unchanged.

**The cost, stated:** a pattern inside an 8px badge has a ~6px interior. Four patterns have to stay separable there, at a glance, next to five other marks on the rail. That is hard and it is unproven — see *Open Questions*. The zone field, where the pattern has hundreds of square pixels to work in, is the channel this decision actually rests on; the badge is the corroboration.

**The stack outline is graphite, and it is the same colour for every stack.** `{colors.stack-outline}` `#6B7A85` / `#5F6E78`. The map now carries **two grouping languages** — *the tinted field says network, the outline says stack* — and the first thing that keeps them apart is that only one of them is coloured. A six-hue rotation on the outline would put twelve colours on one canvas, enlarge a stack family that already separates at only ΔE 3.9 under deuteranopia, and make the two languages harder to tell apart rather than easier. **Which stack is the diamond pastille's answer, exactly as Jules ruled; the outline's job is only to say *a stack*.** `[ASSUMPTION]` on the colour itself — the ruling settles that the outline exists, never what shade it is; graphite is what the file's own rule (*everything that is neither metal nor ink is graphite*) leaves. Its level is chosen, not inherited: **≥3:1 over every clamped zone field in both modes, and deliberately below both edge kinds.** A grouping mark may not out-shout the product.

**User-adjustable colours — predefined iso-luminant palettes.** **[DEPARTS FROM BRIEF]** — the brief's v1 scope names *"filtering and display control (what is shown, **colours**, text size)"*, which implies free colour control. Portolan ships **a choice among colour sets**, each one built and verified as a whole: iso-luminant zone rotation, the contrast floors in the table below, and the colour-vision coverage stated after it. The user picks a set from the left menu, alongside text size and density; the user never picks a colour. The reason is the one thing in this file that cannot be given away: *the edges are the product*, and the ≥3:1 edge floor over every zone tint is a **property of the set**, not of any single swatch. One user-chosen hue at the wrong luminance dissolves an edge somewhere on the map, silently, and nothing in the product would tell them. Bounded is honest; free would be a promise the guarantee cannot survive.

**Health is BLUE / AMBER / RED, and amber is a fact.** `#4C9BD6` nominal, `#C08A3C` degraded, `#BF5747` stopped. **Amber means `running < desired` replicas** — Docker reports both numbers, so `3/5` is raw observed state, not a threshold Portolan invented. There is no rule engine behind the light and no unspecified cut-off anywhere in this file: the mapping is *running = desired → blue · 0 < running < desired → amber · running = 0 → red*, and every term in it is a number the socket hands over.

**[DEPARTS FROM BRIEF]** — the departure is now narrow and worth stating at its true size. The brief says *Portolan does not tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself*. What remains of the departure is the **framing**: three observed states are rendered in traffic-light colours, and a traffic light reads as a judgement even when every number behind it is a fact. The neutral-fact treatment and the stopped-only-colour treatment were both on the table and both declined. Blue rather than green is not decoration: because shape carries family and cannot also carry value, colour is the *only* channel left for the health state, and green/amber/red collapses under deuteranopia and protanopia. Blue/amber/red reads identically to a trichromat and survives both.

**Pastille colour is also a departure.** **[DEPARTS FROM BRIEF]** — the brief says *colour carries network membership*. It no longer does: network membership is carried by the zone (an area) and by the network pastille (a hexagon). Bubble fill is a neutral gradient in every case and encodes nothing. Encoding moved from one channel to four.

**Staleness is a veil, not a colour.** `#0A0E12` / `#F1F3F4` composited at rising alpha (0 → 0.42 over fifteen minutes) while global saturation falls 1.00 → 0.35. The chart pales and desaturates in place. An out-of-date chart is still a chart.

### Contrast, the load-bearing combinations

Measured, not asserted, and measured against **the token the Components section actually assigns** — every row below names it. Every ratio is given as dark / light.

**Map marks**

| Combination | Token | Ratio | Floor |
|---|---|---|---|
| Identifier on bubble body | `{colors.bubble-id}` on `{colors.body-mid}` | **8.4** / 8.1 | 7:1 — this is the channel `pgdata` vs `pg-data` is read on |
| Bubble name on bubble body | `{colors.ink}` on `{colors.body-mid}` | **15.0** / 18.1 | 7:1 — same reason |
| Protrusion plate text on plate | `{colors.ink}` on `{colors.plate}` | **15.1** / 18.1 | 7:1 — same reason |
| Type pastille on body (4 values) | `{colors.pastille-type-service}`…`{colors.pastille-type-node}` | **5.0 – 17.0** / 4.8 – 18.1 | 4.5:1 — the range is unchanged by `stack` leaving the family: `stack` was never an endpoint |
| Stack pastille on body (6 + none) | `{colors.pastille-stack-1}`…`{colors.pastille-stack-none}` | **5.0 – 8.2** / 4.8 – 6.6 | 4.5:1 |
| Network pastille on body (6) | `{colors.pastille-network-1}`…`{colors.pastille-network-6}` | **4.4 – 5.2** / 5.7 – 7.6 | 4.5:1 |
| Health pastille on body (3) | `{colors.pastille-health-nominal}`…`{colors.pastille-health-stopped}` | **4.2 – 6.3** / 5.0 – 6.4 | 4:1 — red is the tightest in the file |
| Mount edge over the clamped zone field | `{colors.edge-mount}` | **7.3 – 7.7** / 4.4 – 4.5 | 3:1 |
| Attachment edge over the clamped zone field | `{colors.edge-attach}` | **4.2 – 4.5** / 4.4 – 4.6 | 3:1 |
| Zone isoline over its own tint, composited | `{colors.zone-isoline-1}`…`{colors.zone-isoline-6}` at `{opacity.zone-isoline}` | **3.2 – 3.7** / 3.5 – 4.8 | 3:1 |
| Stack outline over the clamped zone field | `{colors.stack-outline}` | **3.8 – 4.1** / 4.0 – 4.1 | 3:1 — and **below both edge kinds on purpose.** 4.6 / 4.6 over the bare canvas |
| Stack name on the outline | `{colors.ink-2}` on `{colors.canvas}` and on every zone tint | **6.6 – 7.8** / 6.2 – 7.1 | 4.5:1 — at `{typography.stack-label}` 10px, and one step quieter than the zone label in `{colors.ink}` |
| Masked value block in a safe-to-share export | `{colors.ink-3}` on `{colors.canvas}` and on every zone tint | **4.5 – 5.3** / 4.7 – 5.3 | 3:1 — a non-text mark: it must read as *withheld*, not as absent |
| Zone blob (mode B) over its own tint | `{colors.pastille-network-1}`…`{colors.pastille-network-6}` | **4.0 – 4.7** / 4.5 – 5.9 | 4:1 — a hard boundary must beat a soft one |
| Bubble contour over canvas | `{colors.contour}` on `{colors.canvas}` | **3.3** / 3.0 | 3:1 |
| Bubble contour over a zone tint | `{colors.contour}` on `{colors.zone-tint-1}`…`{colors.zone-tint-6}` | **2.7 – 2.9** / 2.7 – 3.0 | *below, and outside the edge floor* — see *The bubble contour is not an edge*, below |
| Zone tint over canvas | `{colors.zone-tint-1}`…`{colors.zone-tint-6}` | **1.18** / 1.13 | *deliberately below* — a coastline, not a border |

**Chassis text.** Every role in the file that carries an assigned colour, none of which was measured before.

| Combination | Token | Ratio | Floor |
|---|---|---|---|
| Node label on its band | `{colors.node-label}` on `{colors.band-a}` / `{colors.band-b}` | **5.6 – 5.7** / 5.2 – 5.5 | 4.5:1 — at 10px, and Flow 3 is read on it |
| Node region header | `{colors.node-label}` on `{colors.field}` | **5.4** / 5.8 | 4.5:1 |
| Detail-panel values | `{colors.ink}` on `{colors.panel}` | **15.4** / 14.6 | 4.5:1 |
| Detail-panel keys | `{colors.ink-3}` on `{colors.panel}` | **5.2** / 4.9 | 4.5:1 |
| Left-menu counts | `{colors.ink-3}` on `{colors.panel}` | **5.2** / 4.9 | 4.5:1 |
| Section heads, orphan counter | `{colors.ink-2}` on `{colors.panel}` | **7.5** / 5.8 | 4.5:1 — at `{typography.section-label}` 8px |
| Survey stamp | `{colors.ink-2}` on `{colors.tab-bar}` | **7.6** / 5.6 | 4.5:1 |
| Chart-legend body | `{colors.ink-2}` on `{colors.legend}` | **7.7** / 6.0 | 4.5:1 |
| Chart-legend index numeral | `{colors.brass}` on `{colors.legend}` | **8.5** / 4.9 | 4.5:1 |
| Mount flags in the detail panel | `{colors.brass}` on `{colors.panel}` | **8.4** / 4.7 | 4.5:1 |
| Tab labels | `{colors.ink}` on `{colors.tab-bar}` | **15.6** / 14.1 | 4.5:1 |
| Focus ring on any chrome surface | `{colors.focus}` | **10.5 – 11.1** / 7.8 – 8.8 | 3:1 — a non-text indicator |

Four tokens had to move before those rows were true; *Revision Notes* records which, and what they were.

**Two consequences worth naming.** **The attachment edge is lifted from the direction file's `#3E5E6B` to `#5B8494`** — the original measured 2.45:1 across the zone tints, and *the edges are the product*. And **the zone tint is deliberately near-invisible against the canvas** (1.18:1): a zone is a tinted field you notice peripherally, not a shape with a border.

**The bubble contour is not an edge, and its row says so.** Over the canvas it measures 3.3:1; over a zone tint — which is where every bubble actually sits — it is 2.7–2.9:1. The `{stroke.edge.floor}` binds the two *edge* kinds, the marks that carry relationships. The contour is the body's own outline, lifted in dark mode by `{elevation.bubble}` and in light mode by the same hairline measured against its tinted ground. `[ASSUMPTION]` that this exemption is intended: it follows the file's own distinction between edges and everything else, but nobody stated it.

#### The composite, which is what mode A actually renders

The floors above were originally measured against **one** tint. Mode A composites several: on an ordinary cluster every pair of networks shares members, so the most common region sits under three to five overlapping fields. Measured additively, the floors fail:

| Overlapping fields | Tint vs canvas | Mount edge | Attachment edge | Zone isoline |
|---|---|---|---|---|
| 1 | 1.18 | 7.35 | 4.20 | 3.22 |
| 2 | 1.37 | 6.36 | 3.64 | **2.79** ✗ |
| 3 | 1.55 | 5.61 | 3.21 | **2.46** ✗ |
| 4 | 1.73 | 5.02 | **2.87** ✗ | **2.20** ✗ |
| 5 | 1.92 | 4.54 | **2.60** ✗ | **1.99** ✗ |

**The isoline breaks at two overlapping fields, the attachment edge at four.** The remedy is a rendering rule, not a palette change: `{opacity.zone-field-cap}` — **the composited zone field is luminance-clamped to a single tint.** Hue blends where fields overlap, luminance does not accumulate. The worst realistic composite is then the first row, which is what the table measures, and the iso-luminant guarantee extends from one field to any number of them. `[ASSUMPTION]` on the clamp itself: it is the only move that keeps the edge floor a checkable property, but nobody decided it, and it costs mode A the ability to express overlap *depth* as darkness — which was never a stated channel, and which the octave pattern now carries as hue-and-texture instead.

`{opacity.zone-isoline}` is **1.00**, and *Revision Notes* records what it was and why it changed.

#### Colour-vision coverage, per family

`EXPERIENCE.md`'s Accessibility Floor delegates this to `DESIGN.md`. Discharged here, family by family, measured as CIELAB ΔE under deuteranopia on the dark palette (protanopia separates at least as well in every case; the light palette is worse for stack):

| Family | Worst pair | Verdict |
|---|---|---|
| **Object type** (4 values) | ΔE **≥ 20.5** | **Safe.** Four values since `stack` left the family (*Shapes*), and dropping a value can only widen the worst pair. It is the only pastille family at rung 0, so the whole of the screenshot frame's badge channel is covered. |
| **Health** (3 values) | ΔE **18.7** | **Safe.** This is what blue/amber/red was for, and it worked. |
| **Network** (6 hues × n octaves) | ΔE **2.6** between hues | **Partly repaired.** `{shape.network-octave}` is a genuine non-colour channel and it separates *octaves*: network 1 and network 7 are now distinguishable to anyone, on the field and on the badge. It does **not** separate hues *within* an octave — network 1 and network 3 remain ΔE 2.6, which is the same colour. So a colour-blind reader can tell a network from those in the octaves before and after it, and cannot tell it from the five other hues in its own octave. Zone *identity* does not depend on this: it is carried by `{typography.zone-label}` and the CIDR beneath, at 13.8:1. |
| **Stack** (6 + none) | ΔE **3.9** between values | **Partly repaired by the stack outline, and the repair must be described exactly.** The diamond says *you are reading stack membership*; which stack, on the diamond, is colour and only colour, and that has not changed. What has changed is that **stack identity on the map is now carried by a written name** — `{typography.stack-label}` on the outline at 6.6–7.8:1 — exactly as zone identity is carried by the zone label, so a colour-blind reader can name every stack on the chart without reading a single swatch. What is still colour-only is the diamond's own value: telling which stack a body belongs to *from its badge alone*, where the outlines interleave and the body is not plainly inside one. The Flow 1 climax is the case that matters — **a bubble whose stack pastille disagrees with the zone it sits in** compares a diamond against a tint, and both are in the failing set. A deuteranope still cannot perform *that* discovery on the map; they can now read the stacks. The exact value is in the detail panel, in words. Narrowed, not solved in v1. |

The rest of `EXPERIENCE.md`'s Accessibility Floor delegation — keyboard traversal of the graph, screen-reader support, and the ordinary tab focus that *is* in scope — is answered in the preamble, under *What this file does not cover*.

---

## Typography

**Two families, both embedded in the image and served by Portolan itself.** No CDN, no Google Fonts, no system stack. The reason is not only the air-gap constraint: the exported frame is what strangers see, and a system stack means every export renders differently. Embedding costs a few hundred kilobytes and buys identical rendering everywhere. It is the first of the four visual requirements the preamble's export departure carries.

**The mocks in this folder cannot load those families**, and every one of them is therefore set in a system stack that approximates Plex. No measurement of character pitch or set width taken off a mock is typographic evidence — which is the same reason the specimen below has to be rendered once in the shipped product.

- **`{typography.mono}` — IBM Plex Mono, SIL OFL 1.1.** Every identifier: anything naming a real cluster object. Container names, volume names, network names, IPs, image tags, digests, mount paths.
- **`{typography.sans}` — IBM Plex Sans, SIL OFL 1.1.** Every chassis label: menu items, tabs, section heads, buttons, keys in the detail panel.

**The families are decided: IBM Plex Mono for identifiers, IBM Plex Sans for chassis.** The *split* was Jules's, along with embedding and the AGPL-compatible-licence requirement; these two families are what answer them. SIL OFL 1.1 is unambiguously compatible with AGPLv3 redistribution inside a container image, so the font files ship in the image with nothing to negotiate. Mono and sans are one superfamily, drawn together with matched metrics, so a `{typography.sans}` key and a `{typography.mono}` value align on the same baseline in the detail panel without correction — they agree because they were designed to. And the industrial-engineering provenance is the same register as the instrument.

**The typographic split doubles the voice rule.** `EXPERIENCE.md` already binds chart vocabulary to the chassis and Docker vocabulary to objects. Setting the two in different families means the reader can see which register they are in before reading a word.

**The disambiguation test is the mono's actual job.** Discovery three of the primary journey is two volumes, named `pgdata` and `pg-data`, on one container. At `{typography.plate}` — 10px, on a protrusion plate — these must be unmistakable, along with `pg_data` and `pgdatal`. Fixed pitch solves the hyphen by construction: the character cells line up, so the hyphen occupies a column its neighbour leaves empty. What fixed pitch does *not* solve is `l` / `1` / `I` and `0` / `O` — and that is what settles the family. **IBM Plex Mono ships a serifed lowercase `l` and a slashed `0`**, which is exactly what makes `pgdata`, `pg-data`, `pg_data` and `pgdatal` four visibly different strings at plate size. Flow 1's climax rests on that pair of glyphs. The specimen should still be rendered once at 10px in the real product — a check on the shipped rendering, no longer a choice between candidates.

**Ramp.** Twelve roles, all small, all tight. Nothing on this map is a display size — there is no headline anywhere in Portolan, because there is nothing to announce. Chart typography is uppercase, widely tracked and tiny: `{typography.zone-label}` at 9.5px / 0.26em, `{typography.node-label}` at 10px / 0.34em, `{typography.section-label}` at 8px / 0.26em. The tracking is what makes an 8px label read as a chart annotation rather than as fine print.

**`{typography.stack-label}` is the one map label that breaks that pattern, on purpose.** 10px mono, mixed case, 0.02em — set exactly as the admin typed it. The map now carries two grouping labels within a few hundred pixels of each other, and they must never read as the same kind of annotation: the zone name is uppercase, widely tracked, floating inside its field in `{colors.ink}`; the stack name is as-typed, untracked, sitting *on* its outline in `{colors.ink-2}`. Case and tracking are the cheapest tell available at rung 0, which is the rung both of them render at.

**`{typography.scale}` is a first-class control in the left menu**, not a settings afterthought — user-adjustable presentation is a brief requirement. Three steps, 0.90 / 1.00 / 1.15, multiplying every size in the ramp.

**Two floors, and they are the ones the ramp can actually hold.**

- **9px for anything that names a cluster object** — `bubble-name`, `bubble-id`, `plate`, `zone-label`, `zone-sub`, `stack-label`, `node-label`, `mono`. An identifier a user might have to type back into a terminal does not go below 9px.
- **8px for chassis annotation that names nothing** — `section-label`, `marginalia`, `graduation`, `sans`. These are the widely-tracked uppercase heads and the bezel numerals, and 8px with 0.26em tracking is the register, not a compromise.

**The scale multiplies, then clamps at the role's own floor.** 0.90 shrinks only the roles with room above their floor; a role already at its floor stays there. That is what makes the claim true at every step. One role moved so that it would be: `{typography.zone-sub}` 8.5 → **9px**, because a CIDR names a cluster object. *Revision Notes* records the single floor these two replaced, and why it was false.

If a label still cannot meet its floor, it does not render at that LOD rung — which is exactly what the ladder is for. **[DEPARTS FROM BRIEF]**, marked here as it is in `EXPERIENCE.md`: the brief says *"zoom moves you closer; only filtering takes things away"*, and progressive level-of-detail takes labels away by zooming. The reconciliation is exact and this file enforces it — population is identical at every rung, only text quantity changes: *zoom changes sharpness, never population.*

---

## Layout & Spacing

**1440px is a floor, not a breakpoint.** Below `{layout.min-width}` Portolan renders nothing and says so.

Three columns, fixed: `{spacing.left-menu}` 236px | canvas | `{spacing.detail-panel}` 320px. At exactly 1440px that leaves 884px of canvas, which is the design width every measurement in this document was tuned at. Canvas takes every additional pixel; the two chrome columns never grow.

Both key screens are drawn at exactly that width, in the dark default: [`mockups/key-overview.html`](mockups/key-overview.html) is the landing surface at rung 0 — three columns, toolbar, chart legend, tab bar and a purely relational map — and [`mockups/key-overview-selected.html`](mockups/key-overview-selected.html) is the same screen with `api` selected: detail panel open, reachable set lit and the rest dimmed, *Keep only this* offered in the toolbar, and `pgdata · rw` beside `pg-data · ro` on one baseline.

Vertically inside the canvas column: `{spacing.toolbar}` 40px, the map, then the chart legend band at `{spacing.chart-legend}` 120px, with `{spacing.tab-bar}` 56px beneath the whole app.

**The spacing scale is 2-based and tight** — 2 / 4 / 8 / 12 / 16 / 24 / 32 / 48. An instrument has small, exact gaps. The generosity in this design is all inside the map, where `{spacing.gutter}` and `{spacing.cell-clearance}` govern how much room the layout reserves around each body.

**`{spacing.cell-clearance}` is where the shape decision hits the layout engine.** Each bubble is allotted a cell sized to its *deformed* hull — base radius plus stretch of up to 32% of base radius on every link bearing — plus 8px. The layout engine computes the deformation before it places anything. **The map therefore breathes slightly wider: fewer objects fit in the same area than a circle-packing would allow.** That cost was accepted deliberately, because a stretched silhouette that overlaps its neighbour is no longer a legible silhouette, and the silhouette is a data channel.

**`{density.scale}`** — 0.85 / 1.00 / 1.20 — multiplies radii, gutter, clearance and zone padding. It is a separate control from `{typography.scale}` and must stay separate: making the map roomier and making the text bigger are different needs, and a homelabber who wants dense wants dense *with* readable labels.

**The bezel is layout, not decoration.** A `{spacing.bezel}` 12px graduated lunette on all four edges of the canvas, minor ticks every 10px, major every 50px, numerals every 100px in `{typography.graduation}`. Corner registration crosses at 30/30 from each corner. This is the frame the exported PNG carries, and it is what makes an exported chart read as a chart rather than as a screenshot of a web page — a requirement derived from the export departure marked in the preamble.

**The node backdrop is off by default.** The bands are a left-menu display control, not a permanent layer. An overlay network spans every node by construction — that is what an overlay network *is* — so if every container must sit inside its node's band, every network zone becomes a six-lobed smear across the full canvas width and all of them overlap nearly everywhere. The design's own zone study predicted the result at six fields: *six turn the canvas to mud*. **The overview therefore lands purely relational, and the network zones get the whole positional channel.** Turning the backdrop on reimposes the node partition and costs the zones their freedom — which is a trade the user can make deliberately, on a cluster small enough for it. The node's own view is tab 2, and that is where the distribution read has a journey.

**Why exposure is a live concern for a file about appearance.** The preamble states that there is no authentication in v1 and that the chassis is drawn on that basis. That absence interacts with something this file *does* draw: **the screen** carries IPs, CIDRs and the complete topology, and Flow 2 ends with the protagonist publicly posting a frame of it. Exposure is a live concern **because** there is no auth surface, not despite it.

**What has changed is the frame that leaves, not the frame on screen.** The *Export* row now carries a **Safe to share** checkbox, on by default, which masks every IP and every CIDR while keeping the whole structure — shapes, zones, outlines, edges and every object name. *Masked values* under *Components* draws it. Two limits belong here rather than in a footnote: the mask touches **only the exported frame**, so the screen a colleague reads over a shoulder is unchanged; and it removes the **addresses, not the map** — object names, stack names, network names and the topology itself are all still in the picture and are all still identifying. Whether the map is reachable from outside the cluster remains the brief's first-ranked carried question and remains architecture's; what belongs here is that the exported frame is now redactable by design, and that redaction stops well short of anonymity.

---

## Elevation & Depth

Depth is **stylised and strictly 2D**. This is the reconciliation the brief's 2D-not-3D decision needs: shadow and elevation are allowed, spatial 3D is not. No perspective. No isometry. No object is ever "behind" another in a z-sense — it is dimmed, echoed or filtered instead.

**Dark mode carries elevation as shadow, and the shadow is proportional.** `{elevation.bubble}` — `feDropShadow dy 0.11r · stdDeviation 0.15r · #000 @ 0.90`, capped at `dy 5 / σ 7` — the absolute figures previously specified, which is what these proportions yield at r 46. A hard, low, near-opaque drop. Small bodies (volumes, echoes) use the reduced variant. It is not a soft ambient glow: an instrument casts a crisp shadow.

**Proportional because the fixed figure was specified for a 96px body and the map does not have one.** At 325 objects on the landing frame the real body computes to **14–28px across**, and a `σ 7` drop extends ~21px past the silhouette — one and a half body diameters, against 8px of cell clearance. Every shadow lands on its neighbours, the map fogs, and the contour-over-ground figure is then measured against a ground that no longer exists. There is a second cost carried by the same token: SVG filters are not compositor-accelerated in any of the three target engines, and `{motion.breathe}` changes each filter region every frame, so 325 Gaussian blurs re-rasterise continuously. Hence the floor: **below a rendered body diameter of 30px, no shadow renders at all** — which is the whole of LOD rung 0 on any real cluster. The contour does the lifting instead.

**Light mode carries elevation as tone, and casts no shadow at all.** A black drop shadow on `{colors.canvas-light}` reads as dirt. Instead the body goes pure `{colors.body-mid-light}` against the tinted ground and is lifted by its 1px `{colors.contour-light}` hairline at 3.0:1. **The two modes therefore use different mechanisms for the same effect, and this is intentional** — porting the dark shadow into light mode is the single most likely way to wreck the light palette. The mechanism has a consequence worth naming: **light mode has no blurs to overlap and none to re-rasterise**, so it is the palette that survives the dense frame.

**Layering, top to bottom:** node backdrop bands (when that control is on) → reticle → graduated bezel → zone tint fields and their octave patterns → zone isolines → **stack outlines and their labels** → edges → bubble shadows → bubble bodies → protrusion plates → core and pastille rail → selection halo. The outline sits above everything network and below everything relational: it groups what the zones have already placed, and it never covers an edge. Chrome panels sit outside the map entirely and use no shadow in either mode, only a hairline.

**The selection halo is the one soft thing in the file** — a radial `{colors.glass}` gradient rising from 0 to 0.13 alpha between 60% and 100% of 1.13r. It is the only place glass appears, and the only place a gradient is not a body fill.

---

## Shapes

**Corners are nearly square.** `{rounded.sm}` 1px on pastilles, `{rounded.DEFAULT}` 2px on plates, fields and chips, `{rounded.md}` 3px on inputs, `{rounded.lg}` 6px on the app frame and the bubble core. A milled part has a chamfer, not a fillet. Nothing in Portolan is a pill. The one fully round mark is the health pastille, and circle is that family's shape.

**The bubble is not a box and has no radius at all** — it is a path, and it is where the entire shape language lives.

### Two channels, and only one of them is data

`{shape.bubble.silhouette}` — **irregular contour.** A closed 28-point cubic Bézier with radial noise at ±11% of base radius, seeded from the object's Docker ID. Stable across every survey and identical in every screenshot; you recognise `api` by its pebble before you read its name. **This channel is recognition only.** The shape study proved it: at 25% zoom — the size a bubble actually is on a 300-object map — the fine concavities vanish and the pebbles read as circles again. Arbitrary irregularity is a close-range pleasure.

`{shape.bubble.deform}` — **stretch toward links.** Each link bearing contributes a stretch of up to **+32%** of base radius along the bearing of the object this one is linked to, falling off as cos² over ±38° around that bearing. **The sum of those contributions is capped at +32% as well**, however many links the object has — the per-bearing maximum and the total maximum are the same number. A single-link object becomes a **teardrop pointing at its one neighbour**. **This channel is data.** It survives 25% zoom-out, where nothing else about the contour does — the general elongation is the last thing to go. So on the landing screenshot, at rung 0, before a single label is legible, the silhouettes are already telling you how many things each object touches and in which direction.

**Deformation is driven by relationships, never by seed.** That distinction is the whole finding.

The study it came out of is at [`mockups/shape-study-organic-2026-09-10.html`](mockups/shape-study-organic-2026-09-10.html) — treatments A to D on one cluster, treatment C's geometry as adopted here, the protrusion anatomy figure, and the recognition test at 100 / 50 / 25% that retired the seeded contour as a data channel. Its live motion specimen predates the zero-translation ruling: it animates a **positional** ±3.4px drift, which `{motion.breathe}` has since replaced with `{motion.breathe.outline-excursion}` at the same amplitude, applied normal to the contour. The periods and the breathing figures hold; the translation does not.

**No neighbour squash.** Treatment D — bodies flattening against each other into a cell tissue — was the maximum organic available and was declined: it makes a silhouette depend on its neighbours, so the recognition gain of the stable contour is lost, and a flat facet between two bodies imitates an edge that does not exist. **The edges are the product; nothing may counterfeit one.**

**The invariant core.** Inside every body sits a rigid rounded rectangle at 0.59w × 0.50h of the undeformed bounding box, holding the name, the identifier and the pastille rail. **The contour may never breach it** — that rectangle is the floor. This is what lets *shape = family, colour = value* survive on a non-circular body: the pastille rail is straight because it belongs to the core, not to the contour.

**One shape in this file is not a body.** `{shape.stack-outline}` is a closed, unfilled, equidistant hull girdling the members of one stack — the second grouping language, specified under *Components → Stack outline*. It is a path like the bubble is a path, and it is the only other one: everything else on the map is a body, an edge, a mark or a field.

### Pastille geometry

**Pastille shapes, one per family, and they never trade places.**

| Family | Shape | Why this shape |
|---|---|---|
| Object type | **square**, filled | The rung-0 family, and the most stable form at 10px |
| Stack membership | **diamond** (square at 45°) | Same silhouette rotated — reads as a sibling of type, which it is |
| Network | **hexagon**, 1.4px stroke, filled with its octave pattern | Pattern rather than a solid fill, so hue carries the network and the pattern carries the octave — `{shape.network-octave}`. The patterns are open enough that several badges still nest without becoming a colour block |
| Health | **circle**, filled | A light. The one form on the map that means *state* |

Rail order is fixed left to right — type · stack · network(s) · health — so the same dimension is always in the same position.

**There is a minimum mark size, and it is the counterpart of the type floor.** `{shape.pastille.min-size}` is **8 × 8px**: no pastille renders smaller, ever, in the same way no glyph renders below its floor.

**The rail has to fit inside the core.** The rail is `n · size + (n−1) · gap` and it must sit inside the core's width, `0.59 × 2r` — **63.7px for a service, 54.3px for a container, 37.8px for a volume**. An earlier geometry overflowed the core on every object in the product; *Revision Notes* carries the arithmetic.

Three numbers keep it inside. The gap is **3px**; the marks **shrink uniformly to fit**, down to the 8px floor; and if the rail still does not fit, **network badges drop from the right of the network group** until it does — the exact network answer is then the zone's own pattern and the detail panel, which is where it already was at rung 0. Capacity at nominal 10px is 5 / 4 / 3 marks for service / container / volume, and 6 / 5 / 4 at the floor. A container on two networks carries all five marks at 8.5px; on three, one hexagon drops. **The core is never breached, and the rail never wraps** — the straight rail is what makes *shape = family* readable on a non-circular body.

`[ASSUMPTION]` Pastille marks **live in** screen space: they do not scale with the canvas transform, and the rail is sized from the core's *rendered* width. Nobody decided this, but the floor above is meaningless without it, and it is the same treatment the type ladder already assumes.

---

## Components

Component names match `EXPERIENCE.md`'s Component Patterns exactly. Behaviour lives there; this is appearance only.

**The mapping is 28 for 28**, verified mechanically in both directions. Two rows exist there with no entry here — *Image* and *Palette* — both behaviour-only; *Palette*'s appearance is governed by *Colors* above and by the left-menu display group.

### Bubble

Body filled with a vertical gradient `{colors.body-top}` → `{colors.body-mid}` at 52% → `{colors.body-base}`, contoured at 1px `{colors.contour}`, with an inner hairline at 0.7px `{colors.contour-inner}` set at 0.87r — the instrument's second ring, which is what stops the body from reading as a blob. Shadow per `{elevation.bubble}`. Selected bodies switch to the `body-sel-*` gradient, take a 1.7px `{colors.glass}` contour, a four-branch reticle at the cardinal points and `{elevation.halo}`. Volumes use the `body-volume-*` gradient and radius 32px, so they are smaller and cooler than containers by construction.

Name in `{typography.bubble-name}` at `{colors.ink}`, centred on the core; identifier beneath in `{typography.bubble-id}` at **`{colors.bubble-id}`**. Two lines, and at rung 0 neither of them renders.

**The identifier has its own colour token, and this is why.** It is the channel `pgdata` and `pg-data` are told apart on — Flow 1's climax — and the contrast table declares a **7:1** floor for it. `{colors.bubble-id}` measures **8.4 / 8.1** and holds ≥6.6:1 on every body gradient in the file, selected and volume included. Quiet and 7:1 are different requirements, so they get different tokens — *Revision Notes* records what this token replaced.

### Labelled protrusion

The signature primitive, and the anatomy is adopted verbatim from the shape study.

- **The plate** is 17.5px tall, `{rounded.DEFAULT}`, filled `{colors.plate}`, stroked 0.9px in **the colour of the edge it terminates** — a network attachment plate takes `{colors.edge-attach}`, a mount plate takes `{colors.edge-mount}`. The plate is always horizontal and never deforms.
- **The bearing is fixed, the stalk is not.** Each protrusion owns a constant bearing from the core centre. The plate sits at a constant distance along it; only the 1px stalk lengthens or shortens as the contour crosses that bearing. **Plate bearings are placed in the concavities *between* the stretch bulges** — the body swells toward its neighbours, and the plates occupy what the swelling leaves free.
- **Same-family plates share a baseline**, marked by a brass tick at each end. `pgdata · rw` and `pg-data · ro` are then set at the same size, same case and same pitch on the same line, so they compare character for character and the hyphen jumps out. Scattered freely around a deformed body they do not compare at all. **The baseline is what makes that confusion catchable**, and catching it is a climax beat, not a nicety.

Text in `{typography.plate}` at 15.1:1, against a 7:1 floor — the file's highest floor, and it is on the smallest type.

### Pastille

10 × 10px nominal, `{rounded.sm}`, on a horizontal rail along the core's upper edge, with a 3px gap between marks, shrinking to fit down to the 8px floor per `{shape.pastille.fit}`. **Shape = family, colour = value**, per the table in *Shapes*. Four families: object type, stack membership, network (several badges when an object is on several networks), health.

**The object type family has no `image` value, and now no `stack` value either.** Images are not graph nodes; a stack is not a bubble. Every value: `service` `#EDF3F6`, `container` `#9FB4C0`, `volume` `#C6A664`, `node` `#5F8C7E`. Volume is brass on purpose — the same brass as the mount edges, so the gold on the badge and the gold on the wire are the same statement.

**`stack` `#8F7FB8` is removed, exactly as `image` was removed, and for the same reason.** A type pastille sits on a body; the value it carries is what that body *is*. A stack is a `{components.stack-outline}` — a grouping mark girdling other bodies — so there is no body for a `stack` type pastille to sit on, and leaving the value in the family was the last trace of the reading in which a stack could be a bubble. That reading is declined under *Stack outline*, below. The two tokens are gone from the palette rather than orphaned in it, and the family is four values.

Stack is a six-step rotation plus a hollow graphite mark meaning *no stack*. **Network is a six-step rotation of hue plus `{shape.network-octave}`'s pattern**, and a network hexagon takes exactly the hue and the pattern of its own zone, so the tint field and the badge on the bubble are visibly the same network. **That is the mechanism by which the two channels catch each other**: the tint gives the fuzzy cartographic read, the hexagon gives the exact binary answer — and past six networks it is the *pattern*, on both, that keeps network 7 from being network 1.

> The direction-2 mock predates this decision and its own key uses *shape* for value — square = container, triangle = volume, hexagon = network. **DESIGN.md follows shape = family.** The mock's published-port chevron is also dropped: it is a fifth mark outside the four decided families, and port is a detail-panel fact.

### Health pastille

Filled circle at half the current mark size — r 5px nominal, r 4px at the rail floor. `{colors.pastille-health-nominal}` `#4C9BD6`, `{colors.pastille-health-degraded}` `#C08A3C`, `{colors.pastille-health-stopped}` `#BF5747`. An object with no health state — a volume, a network — simply carries no circle; absence is the fourth value and it needs no colour.

**Each colour is a counted fact, not a threshold.** Blue is `running = desired`. Amber is `running < desired`, with running above zero — the `3/5` Docker already reports. Red is `running = 0`. Nothing here is a rule Portolan invented, and there is no cut-off for an implementer to guess at.

**[DEPARTS FROM BRIEF]**, marked here as it is in `EXPERIENCE.md`, and now at its true size: what departs is the **traffic-light framing**, not the data. The brief says Portolan does not tell you something is wrong, and three observed states rendered in blue/amber/red read as a judgement even when every number behind them is observed. Red is the tightest contrast in the whole file at 4.2:1 on the body — deliberately the *least* shouting of the three, since it is the one carrying the departure.

**Under the staleness veil the health circle ages with everything else**, reaching 2.1:1 at full veil against its own 4:1 floor. Text is exempted from the veil; this mark is not. An aged chart is still a chart, and its light ages with it.

### Network zone

**Mode A, the default and therefore the screenshot frame.** A tint field from the six-hue rotation, **carrying its octave pattern**, with a dashed contour isoline at 3.5px / dasharray `0.8 9` — which renders as a run of fine perpendicular ticks rather than a dashed line. **No closed outline, ever.** The contour is open, it fades where two fields blend, and the field itself sits at 1.18:1 against the canvas. The result reads as a **coastline**, not as geometry. Label in `{typography.zone-label}` at `{colors.ink}`, uppercase, widely tracked, with the CIDR beneath in `{typography.zone-sub}` at `{colors.ink-2}`.

**Where fields overlap, hue blends and luminance does not.** `{opacity.zone-field-cap}` clamps the composited field to the luminance of a single tint. Without it the isoline loses its floor at two overlapping fields and the attachment edge at four — and on an ordinary cluster the most common region sits under three to five. The clamp is what extends the iso-luminant guarantee from one field to any number of them; the arithmetic is in *Colors → the composite*.

**Mode B, the precise alternative.** Disjoint blobs with a hard closed boundary: 1px solid at the network's badge strength, 4.0–4.7:1 against its own tint, the fill carrying the same octave pattern. A hard boundary must out-contrast a soft one, which is why the blob stroke is a full step brighter than the isoline.

Both renderings are drawn side by side, on the same seven-entity cluster, in [`mockups/zone-overlap-options-2026-09-10.html`](mockups/zone-overlap-options-2026-09-10.html) — four candidate geometries, none ranked; **the two that shipped are variants 2 and 4**, mode B and mode A respectively.

### Stack outline

**A stack is not a bubble and not an area. It is a grouping outline girdling the services of one stack, with its name set on the outline.** This closes the last per-type rendering question the brief left open, and the one both spines contradicted themselves on across three separate lines.

The two readings this rules out — stack-as-bubble and stack-as-area — are stated as rules in *Dos and don'ts*, and the arguments that retired them are in *Revision Notes*.

**Two grouping languages now coexist, and keeping them visually distinct is the whole risk of the decision.** Seven tells, and no single one of them is load-bearing alone:

| | **Network zone** — the tinted field | **Stack outline** — the girdle |
|---|---|---|
| What it is | a **field with no boundary** | a **boundary with no field** |
| Fill | a tint at 1.18:1, carrying its octave pattern | **none, ever** |
| Contour | open, fading, 3.5px dashed `0.8 9` — a run of ticks | closed, continuous, 1.25px solid — one unbroken line |
| Silhouette | amorphous: a **coastline**, drawn | equidistant: a **drafted offset** at a constant `{spacing.cell-clearance}` from the member cells |
| Overlap | overlaps by construction; hues blend where fields meet | never shares a member — stack membership partitions services. Two outlines may *cross*; they never *blend* |
| Label | **inside** the field, uppercase, 0.26em tracked, `{colors.ink}`, CIDR beneath | **on** the stroke, as typed, untracked, `{colors.ink-2}`, nothing beneath |
| Position | **owns** it | **derives** it |

That last row is the one that keeps the decision cheap. `{shape.stack-outline.position}`: the outline follows wherever the zones have put its members and never asks the layout for a position of its own. **Two marks owning position is precisely the node-backdrop failure**, and this is the door it would have come back through.

**The consequence of deriving position, stated.** The outline threads around intervening non-members where the layout leaves room; where it cannot, it encloses them. So a body inside a stack outline is not necessarily in that stack — and **the stack pastille is the exact answer where the two groupings cross**, which is the role the ruling gives it and the role the network hexagon already plays against the tint field. The diamond and the outline catch each other the same way the hexagon and the tint do.

**The second consequence, measured, and it cuts the other way: near-concentric contours.** A stack and a network that **share members** are struck around the same bodies, so their contours run near-concentric. Measured at 1:1 in [`mockups/key-overview.html`](mockups/key-overview.html): **455px of the `obs` outline's 1140px perimeter runs within 14px of the `monitoring` isoline**, and **346px of `shop`'s 1961px runs within 14px of `frontend`'s**. That is the direct consequence of `{shape.stack-outline.position}` — the outline *derives* its position from where the zones placed its members, so wherever the two groupings hold the same bodies they hold the same ground. **The seven tells above separate the two languages in kind; not one of them is a distance, and none of them separates the two languages in position.** 40% of one outline and 18% of another are drawn inside a hair's breadth of the very mark they must not be read as. Carried to *Open Questions*.

**A zone label can be left with nowhere to go, and two of the three labels in that render were.** An exhaustive search on a 2px grid moved `BACKEND` 18px into clear space. `FRONTEND` — whose field the outline cuts into free bands 70–100px wide, against a CIDR label 132px wide — and `MONITORING` have no clear position anywhere, so both stay exactly where they stand: the layer order puts the stroke *behind* the label, and `{colors.ink}` reads 13.8:1 where the outline reads 4.6:1.

**The rule that follows, and it is a rule about what may move.** The zone **owns** position and the outline **derives** it, so **neither of them moves.** The zone label is a free annotation inside its own field, and it is therefore the only thing in the collision that can move — and only where a clear position exists. Where none does, it stays exactly where it is and relies on the layer order and the contrast above. Nothing in this file is permitted to resolve a label collision by displacing a contour.

**Stroke and label.** 1.25px solid `{colors.stack-outline}` — no dasharray, no graduation, no fill. It measures 3.8–4.1:1 over the clamped zone field and 4.6:1 over bare canvas, in both modes, and it is **deliberately quieter than both edge kinds**: the attachment edge is 4.2–4.5, the mount edge 7.3–7.7. An edge runs between two bodies and terminates on them; the outline closes on itself and terminates on nothing. *Nothing may counterfeit an edge* binds grouping marks too. The stroke opens once, upper-left, for its own name in `{typography.stack-label}` at `{colors.ink-2}` — 10px mono, as typed.

**Surfaces.** The overview only. Not drawn in the node view, for the same reason network zones are not drawn there: a stack spans machines by construction, so its hull would cross every region and the node would stop owning position. In tab 2 the diamond carries stack membership alone. `[ASSUMPTION]` — the ruling settles what a stack is, not which surfaces draw it; this is the reading the rest of the system already takes for zones.

### Zone rendering mode

The switch itself is a left-menu display control and looks like every other one. What is visual about it is the **transition**: `{motion.relayout}`, 900ms, bodies on curved paths, edges attached throughout, tints crossfading over the same window. **It is a movement, not a style swap** — the user must be able to follow an object from one geometry into the other with their eye, so nothing may fade out and reappear.

### Echo bubble

Mode B only. A multi-network object drawn once per zone, each copy at `{opacity.echo}` 0.55 with a 6/3 dashed contour so a copy is never mistaken for an original. Text on an echo still measures 5.2:1 — an echo is quieter, never illegible. Selecting an echo lights both copies at full ink.

### Edge

The product. Two kinds, and they are told apart by colour and by weight, never by label.

- **Attachment** (an object to a network): 0.9px, dasharray `2 4`, `{colors.edge-attach}`. Dashed because attachment is a membership, not a pipe. A network is an area with no position, so the attachment's far end is **a short stub running from the body into its zone field** — that stub *is* the rendering, and it never shrinks below `{stroke.edge.attach-min-length}` **6px on screen**, one and a half periods of its own dasharray. Without that floor it collapses to ~2px at rung 0, which is the most numerous edge in the graph disappearing in the default frame.
- **Mount** (a container to a volume): 1.6px solid `{colors.edge-mount}` brass, over-struck with a 4px `0.6 7` graduation at 0.55 alpha — a measured, ticked line, the most instrument-like mark on the map.

Both hold ≥3:1 against **the worst composited zone field** in **both** modes — that is `{stroke.edge.floor}`, and what makes it checkable rather than hoped for is *Colors → the composite*. Edges anchor 14px *inside* the bodies at both ends, so no endpoint ever detaches from a breathing contour.

### Node backdrop

**Off by default.** A display control in the left menu, sitting with zone mode, text size, density and theme — not a permanent layer. The reasoning is in *Layout & Spacing*: an overlay network spans every node, so a node partition and a network zone cannot both own position, and on the overview the zones win.

When it is on: alternating vertical bands, `{colors.band-a}` / `{colors.band-b}`, split by `{stroke.band-divider}`. Label in `{typography.node-label}` at 0.34em tracking in **`{colors.node-label}`**, with role and IP beneath. **The backdrop is the quietest thing on the map by a wide margin** — 1.1:1 band against band. It is a ground, and it must never compete with a zone tint, which is the layer immediately above it and only slightly stronger. The label reads 5.2–5.7:1 in both modes; *Revision Notes* records what it was before it was tokenised.

### Node view

Tab 2, where nodes stop being ground and become the subject. Flow 3 runs entirely here, so it needs a foreground rendering of its own — the backdrop spec above describes a layer that must never be noticed, which is the opposite requirement.

`[ASSUMPTION]` on the whole of this subsection: the *behaviour* of the node view is decided in `EXPERIENCE.md`, its appearance never was. What follows is the reading most consistent with the rest of the system.

**A node is a region, not a bubble.** Bubbles are objects that connect to things; a node is a *place* things sit in. It is drawn as a `{components.node-region}`: a field in `{colors.field}`, a 1px `{colors.hairline}` border, `{rounded.lg}` — the app-frame radius, because a region is a frame — laid out as a row of panels across the canvas, one per machine, sized in proportion to what each carries. Inside sit the ordinary bubbles, with their ordinary silhouettes, deformation, pastilles and edges. Nothing about a bubble changes because the ground under it did.

**The header is the identity.** Node name in `{typography.node-label}` at `{colors.node-label}`, upper-left inside the region, with role (`manager` / `worker`) and IP beneath in `{typography.mono}` at `{colors.ink-2}`. The header is the only place a node's own type pastille (`node` `#5F8C7E`) renders on the map — one per region, on the header line, because in this view the node is an object you can select.

**Imbalance has to be visible without being annotated.** The regions are proportional and the bubbles inside them are not resized, so a machine carrying twice as much is visibly twice as full. That is the whole treatment: no bar, no percentage, no count badge. The distribution read is an area read.

**An empty region renders at full size**, with its header and one line of `{typography.marginalia}` in `{colors.ink-2}`. A fresh machine carrying nothing is information — the same reasoning as the empty cluster, which draws its nodes and nothing else. That the backdrop renders on an empty cluster at all, while being off by default everywhere else, follows from two decisions taken separately: the empty cluster shows its nodes as an empty coastline, and the backdrop is off by default on an overview that has something else to draw. An empty cluster has nothing else.

### Orphan bubble

A container with no stack: the standard body, with the contour switched to `{colors.contour-orphan}` at dasharray `5 4` and a flat dark fill instead of the gradient. The dashes say *unattached*; the isolation says everything else. Marginalia beneath in `{typography.marginalia}`. **No badge, no colour, no ring** — the tool does not mark it as abnormal, because that would be a judgement.

**The stack outline sharpens the orphan without annotating it.** An orphan is, by definition, outside every `{components.stack-outline}` on the chart — so *everything else is girdled and it is not* is now a mark the reader can see rather than an absence they have to infer. That is a strengthening of the existing signal, not a new one: still no badge, still no colour, still nothing added to the orphan itself.

### Orphan counter

A discreet line in the left menu — "3 objects with no stack" — set in `{typography.mono}` at `{colors.ink-2}`, sitting with the filters and styled as one of them. Clicking it reframes the map onto the orphans. **It is a finding aid, not an annotation**: the drawing on the map is not modified by the counter's existence.

### Detail panel

320px, `{colors.panel}`, a 1px `{colors.hairline}` border, `{spacing.panel-pad}` inside, header on `{colors.panel-header}`. Object identifier in `{typography.mono}` at 15.5px — the largest type anywhere in Portolan, and it is a Docker name, which is exactly right for a product whose voice rule protects object names. Beneath it a subtitle in `{typography.sans}` and the object's pastille rail repeated at full size with its values spelled out in words — including the image line, `nginx:1.25-alpine` in `{typography.mono}`, which is the only place an image is ever drawn.

Body is key/value rows: keys in `{typography.sans}` at `{colors.ink-3}`, **values always in `{typography.mono}`** at `{colors.ink}`. Section heads in `{typography.section-label}` at `{colors.ink-2}`, with a `{colors.rule}` hairline running out to the right margin. Mounts get their own treatment — volume name in a bordered chip, path in `{colors.ink-2}`, flags right-aligned in brass — because the panel is the second place `pgdata` and `pg-data` are read adjacently.

**Three states, and the panel is the surface where each of them matters most.** `[ASSUMPTION]` — `EXPERIENCE.md`'s State Patterns names none of them; these are the treatments the visual system implies.

- **Loading.** The chassis draws immediately — header, section heads, rules — and each value's place is held by a 1px `{colors.hairline}` rule at the width that value will occupy. No spinner, no shimmer: a needle that has not settled, not a skeleton pretending to be content.
- **Subject vanished between polls.** The panel stays and the values freeze, with one `{typography.marginalia}` line in `{colors.ink-2}`: *"Not in the last survey."* It is dismissed by the next click, never by itself. A container disappearing while you are reading it is frequently the answer the user came for, and closing the panel would delete it.
- **Stale.** **The panel does not take the veil.** The map pales; the text does not. Contrast holds at full while `{components.stale-map}` ages everything on the canvas, and the survey stamp carries the age for both surfaces. The one thing that must stay exactly readable on an ageing chart is the column of facts.

Footer, permanently: *Portolan renders the observed state. The health light is the one reading it offers, and the numbers behind it — `3/5` — are observed too.* Set in `{typography.marginalia}` at `{colors.ink-3}`. It says what the product does: it renders observed state, it renders one reading of it, and it names which. *Revision Notes* records the wording it replaced.

### Bottom tab bar

56px, `{colors.tab-bar}`, three tabs separated by hairlines, each prefixed with a mono index numeral (`01` `02` `03`) in a bordered chip — chart-sheet numbering, not app navigation. Labels in `{colors.ink}`. The active tab takes `{colors.bezel}` and a 1px `{colors.glass}` inset top rule, and its numeral turns glass. The **survey stamp** sits right-aligned in `{typography.marginalia}` at `{colors.ink-2}`, and it is the only thing in that margin — the socket-mode string that used to sit beside it is gone, for the reason given under *Left menu*. Tabs take `{stroke.focus}` when focused.

### Left menu

236px, `{colors.panel}`. Section heads in `{typography.section-label}` at `{colors.ink-2}`, with a hairline trailing to the right edge. Rows are 11px checkboxes at `{rounded.sm}`, filled `{colors.glass}` when checked, plus an optional 10px **filter swatch** carrying that filter's zone or stack colour — and, for a network, its octave pattern, so the swatch and the field it selects are the same mark. **The `Stacks` row's swatch is not a colour chip but a 10px length of `{stroke.stack-outline}` itself** — the mark it removes, drawn at the weight it renders on the map. **The filter swatch is the map's colour key sited where you act on it**, which is why the left menu needs no key of its own. The decoding proper belongs to the *Chart legend* band under the canvas; these two are different components and are never called by the same name. Counts right-aligned in mono at `{colors.ink-3}`. Every row takes `{stroke.focus}` when focused.

Filters and display controls are separated by nothing but a section head, and that is deliberate: they look alike because they are the same kind of control to the hand. The difference is in what they do, and `EXPERIENCE.md` owns it. The display group carries zone mode, **node backdrop** (off by default), **palette**, text size, density, theme and **`{components.refresh-interval}`**; *Export (SVG / PNG)* takes a row beneath them, carrying its **Safe to share** checkbox above its two chips.

A permanent marginalia block sits at the foot, and it reads exactly two words: **READ ONLY**.

**A read-only product claim is fine; a read-only socket claim is not, and this file makes none.** Mounting `/var/run/docker.sock` with `:ro` makes the socket *inode* read-only and does **not** restrict the Docker API reached through it: a process with that mount can still create a container. The brief also expressly reserves socket mediation for the architecture work — *"read-only at the product level is a promise, not a mechanism"* — and a chrome string in a UX document is not the place to settle it. What the block used to say, and what it would have printed, is in *Revision Notes*.

### Reachability highlight

The lit set stays at full ink. Everything else drops to `{opacity.dim.unreachable}` **0.18** — which puts dimmed text at 1.5:1 effective. That is the intent: **present, never readable, never removed**. Dimming is not filtering, and the two must not be confusable at a glance.

The subject itself takes the selection treatment: glass contour at 1.7px, a four-branch reticle at the cardinals, and the halo. The *filter would empty the map* exception uses a second, paler level — `{opacity.dim.filter-context}` **0.10**, at 1.1:1 — so that the two dim states are visibly different depths and nobody mistakes an empty-filter fallback for a dimmed selection.

### Stale map

The veil composites `{colors.state-stale}` at rising alpha, 0 → 0.42 over fifteen minutes, while global saturation falls 1.00 → 0.35. Zone tints go grey first because they are the least saturated things on the map; brass goes last, so the mount edges are still legible on a badly aged chart. Text never drops below 4.2:1 at maximum staleness. The survey stamp in the tab bar ages in words alongside.

**No error colour, no banner, no overlay.** The chart pales. That is the whole treatment.

### Chart legend

A permanent band, `{spacing.chart-legend}` 120px, beneath the map and above the tab bar, on `{colors.legend}`: six columns divided by hairlines, each headed in `{typography.section-label}` at `{colors.ink-2}` with a brass index numeral. **This is a chart legend, not a UI key**, and the register is load-bearing: numbered plates, specimen marks drawn at the exact size they appear on the map, and one line of setting prose per column rather than a label. It is not to be confused with the **filter swatch** in the left menu, which is a per-filter colour chip on a control you act on; the chart legend decodes, the filter swatch selects.

**The legend now has a second grouping language to decode, and it takes no seventh column to do it.** `{components.stack-outline}` is the stack channel's map-scale mark, so it goes in the **stack column**, beneath the diamond: a 40px length of `{stroke.stack-outline}` with a specimen name set on it in `{typography.stack-label}`, and one line of setting prose — *the outline girdles a stack; the diamond says which*. The **zone column** carries the counterpart line — *the tinted field says network, the outline says stack* — which is the one sentence a stranger needs to not read the two as the same mark. Six columns, unchanged; the band does not grow.

`[ASSUMPTION]` **The zone column lists the networks that are on the chart, not the palette.** Six swatches cannot decode eleven zones, and an exported chart carrying a key that provably fails on its own picture is worse than no key. Each row is one network actually present: its hue, its octave pattern, its name. Past what the column holds, it truncates with a count.

`[ASSUMPTION]` Column 5 is the typographic specimen — `pgdata`, `pg-data`, `pg_data`, `pgdatal` set in `{typography.plate}` at the size they render on a protrusion, **stacked vertically on a shared left margin**, with the line *fixed pitch: the four identifiers stay separable at 10px*. Set on one line they measure ~230px in a 201px column and wrap, which destroys the adjacency that is the entire point; stacked, they share the baseline mechanism the protrusions themselves use, and compare character for character down a column instead of along a row. The fourth string carries the `l` that settles the family, so the legend proves exactly the claim Typography makes — no more, no less.

The chart legend is in the export. It is part of the chart.

### Control vocabulary

**One vocabulary, three registers, and every control in the product is one of them.** This was marked `[ASSUMPTION]` and is now committed. **1 — the chip**, in the toolbar and inline inside a menu row. **2 — the menu row**, in the left menu, for a control that produces an artefact or changes what you get rather than what you are looking at. **3 — marginalia**, which is not a control at all. Each of the controls catalogued below is exactly one of the three.

**No control anywhere in Portolan is a filled button.** There is no primary action — the product is read-only, and a filled button would promise one.

### Control chip

**Register 1.** `{components.control-chip}`: 24px tall, `{rounded.DEFAULT}` 2px, 1px border, 8px of horizontal padding, `{typography.section-label}` uppercase — a milled plate, the same chamfer as everything else in the file. It lives in the `{spacing.toolbar}` 40px band above the map. Three states and no others:

| State | Treatment | Which controls |
|---|---|---|
| **Action** — momentary, does a thing and returns | 1px `{colors.hairline}` border, `{colors.ink-2}` text | *Fit to chart*, *Reorganise* |
| **Latched** — reports a state the user put it in | `{colors.glass}` border and text | *Isolate*, *Keep only this* |
| **Unavailable** | `{colors.hairline}` border, `{colors.ink-3}` text, no pointer | any of them |

Glass on the latched state is not a second job for the metal: *if it glows, you clicked it* — a latched control is a thing the user chose, exactly as a selected bubble is, and the bottom tab bar already marks the active tab this way.

### Fit to chart

`{components.fit-to-chart}` is a `{components.control-chip}` in the **action** treatment, in the toolbar, always present. Nothing about it is latched: it does its thing and returns.

### Reorganise

`{components.reorganise}` is a `{components.control-chip}` in the **action** treatment, in the toolbar, beside *Fit to chart*. What the user sees when it fires is `{motion.relayout}` — the 900ms curved-path movement specified under *Zone rendering mode*, and for the same reason: an object must be followable by eye from one arrangement into the next.

### Isolate

`{components.isolate}` is a `{components.control-chip}` in the toolbar, present only while an object is selected, and **latched** in `{colors.glass}` while it holds a subject. Latched is the correct state by the chip's own definition: it reports a live state the user put it in. It sits immediately left of *Keep only this*.

### Keep only this

The one new control, and the only chip that is not always present: it appears in the toolbar while an object is selected, immediately right of *Isolate*, and it **promotes the reachability highlight into a filter**. Clicking an object already lights its reachable set and dims the rest; this removes the rest. It is what answers the brief's second verbatim filter job — *show me only what touches `backend`* — which had no mechanism anywhere in either spine.

While latched it carries the current hop reach as a mono numeral in `{colors.glass}` — `1`, `2` or `∞` — reusing the left menu's existing reach control rather than adding a second one. The distinction it must never blur is the one the whole interaction model rests on: **the highlight dims, the chip removes.** Dimming leaves `{opacity.dim.unreachable}` 0.18 of everything on screen; *Keep only this* is a filter, so the map that remains is genuinely smaller, and clearing it restores the full chart.

### Export (SVG / PNG)

**Register 2 — the menu row.** `{components.export}` lives in the left menu with the display controls, as a row carrying two inline action chips, `SVG` and `PNG`. It is a row and not a toolbar chip because it produces an artefact rather than changing the view, and the left menu is where the things that change what you get already are. Above the two chips sits the **Safe to share** checkbox, styled as every other left-menu checkbox — 11 × 11px, `{rounded.sm}`, checked fill `{colors.glass}`. It is checked by default; `EXPERIENCE.md` owns why.

### Masked values

**A masked value is struck, not deleted.** The IP or CIDR is replaced by a run of filled blocks at the mono's own character pitch — **one block per character**, 0.62em tall, sitting on the baseline, `{rounded.sm}`, in `{colors.ink-3}` at 4.5–5.3:1 over every ground it lands on. Fixed pitch is doing the work again: the footprint is identical to the value it replaces, so **nothing reflows** — the zone sublabel keeps its width, the plate keeps its plate, and the chart the exporter framed is the chart that leaves.

`{colors.ink-3}` rather than the `{colors.ink-2}` the value was set in, because a struck value should be quieter than a live one. It must still read as *withheld* and not as *absent*: a blank where a CIDR used to be reads as a rendering bug; a row of blocks reads as a decision. This is the only place in Portolan where a value is drawn as something other than itself, and it is the one place the chart is knowingly not showing what it observed — which is why it is a visible mark rather than an omission.

**Refusal is not a visual state.** There is no banner, no warning colour, no confirmation. The checkbox is the whole interface, and the blocks in the frame are the whole feedback.

### Refresh interval

`{components.refresh-interval}` is the second menu row, sitting with the display controls: four inline `{components.control-chip}`s — `5s` `10s` `30s` `60s` — with the current one **latched** in `{colors.glass}` and the other three in the action treatment. Latched is the correct state by the chip's own definition: it reports a live state the user put it in. It is the brief's *configurable* given a surface, and it was the one word in the brief that both spines repeated and neither drew.

`[ASSUMPTION]` **This file commits no vocabulary of its own for a stepped setting**, and the left menu carries four such settings already — text size, density, palette and zone mode were all placed there without an appearance. The latched chip is the vocabulary the file does commit, so the refresh interval takes it, and the other four take the same shape by implication rather than by a second invention.

### Survey stamp

**Register 3 — marginalia.** **The survey stamp is not a control at all**: plain words in `{typography.marginalia}` at `{colors.ink-2}`, right-aligned in the tab bar, ageing there while the map pales.

### Focus

`{stroke.focus}` — a 2px `{colors.focus}` outline at 2px offset, square corners, no radius — on every focusable chrome control: left-menu rows and checkboxes, the three bottom tabs, the toolbar chips, the export row. **Never the graph canvas**, which is pointer-only in v1.

Focus needed its own mark because *Dos and don'ts* forbids glass for it — correctly, since glass means *you clicked this* and focus means *you have not yet* — and no replacement existed anywhere in the pair. `{colors.focus}` measures 10.5–11.1:1 dark and 7.8–8.8:1 light on every chassis surface, against a 3:1 floor for a non-text indicator. It is **neither metal nor ink, and that does not break the metals' one-job rule** because it appears only on the chrome and never on the map: there is no surface where a focus ring and a glass halo can be confused. The square corners are the second tell — nothing else in the file has an unrounded outline.

Which controls are reachable by Tab, and in what order, is `EXPERIENCE.md`'s to state. This file guarantees only that when something is focused, you can see it.

---

## Dos and don'ts

| Do | Don't |
|---|---|
| Add density with zones, tints, silhouettes, edges and pastilles | Add density with text — *beaucoup à regarder, peu à lire* is the arbiter, and text at rung 0 always loses |
| Let `{motion.breathe}` bound the **outline**. `{motion.breathe.outline-excursion}` ±3.4px is a deformation normal to the contour | Let any motion translate anything. **Positional drift is zero, not small** — no centre, no label, no click target moves by a pixel, at any scale. The excursion is zero-mean, non-accumulating and confined to the reserved cell |
| Drive deformation from **relationships** | Drive deformation from the seed. Seeded irregularity is recognition only and dies at 25% zoom |
| Reserve the deformed hull in the layout, plus 8px | Let a stretched silhouette overlap a neighbour. Fewer objects per screen is the accepted price |
| Use glass for selection, and for a latched control — both mean *the user chose this* | Use glass for hover, focus, accent or emphasis. If it glows, the user clicked it |
| Use `{stroke.focus}` for focus, on the chrome only | Leave focus unmarked, or borrow a metal for it. A forbidden treatment with no replacement is an unusable control |
| Use brass where something is mounted | Use brass decoratively. Two golds meaning two things is the specific failure that killed the warm variant in the shape study |
| Keep one shape per pastille family, forever | Encode a *value* with a shape. The direction-2 mock's key does this and is superseded |
| Keep health blue / amber / red | Restore green. Green/amber/red is unreadable under deuteranopia, and colour is the only channel health has |
| Keep the type family free of `image` **and of `stack`** | Reintroduce either value, or either bubble. An image is a detail-panel line; a stack is a grouping outline. Fifteen services converging on one stack node is the same fan-in that removed images |
| Let the tinted field say network and the outline say stack — a field with no boundary against a boundary with no field | Fill a stack outline, or close a zone contour. Two filled groupings on one canvas is the mud the zone study predicted, arriving by a different door |
| Let the stack outline **derive** its position from where the zones put its members | Let a second mark own position. That is the node-backdrop failure exactly, and the outline is the door it would return through |
| Keep the stack outline quieter than both edge kinds, undashed and closed | Let a grouping mark counterfeit an edge. An edge runs between two bodies; this one closes on itself |
| Carry elevation as shadow in dark, as tone in light | Port the dark drop shadow into light mode. `#000 @ 0.90` on `#EDF1F3` reads as dirt |
| Keep zone isolines open and fading | Close a zone contour in mode A. It must read as coastline, not as geometry — mode B is where hard boundaries live |
| Keep every edge ≥3:1 over every zone tint, in both modes | Tune an edge colour against the canvas alone. Edges cross tints; the iso-luminant rotation is what makes the floor checkable |
| Keep zone tint at ~1.15:1 over the canvas, and clamp the composite to it | "Fix" the low-contrast zone field, or let overlapping fields accumulate luminance. The field's blur is covered by the octave pattern and the zone label; its *luminance* is what every edge floor is measured against |
| Carry the network octave on the zone as well as the badge | Rely on the pastille alone to separate network 7 from network 1. The pastille does not render at rung 0, which is the frame the product is judged on |
| Hold the 8px mark floor, and shrink the rail to fit the core | Breach the core, wrap the rail, or shrink a pastille to make one more fit. Drop a network badge instead — the exact answer lives in the zone pattern and the panel |
| Keep the core rectangle inviolate | Let a contour, a deform or a breath cross into it. The straight pastille rail depends on it |
| Set every identifier in `{typography.mono}` | Set an identifier in the sans, anywhere — including in prose, panels and exports |
| Hold the two type floors after `{typography.scale}` — 9px for anything naming a cluster object, 8px for chassis annotation | Shrink a label to make it fit, or claim one floor the ramp does not hold. Drop the LOD rung instead |
| Carry elevation in proportion to the rendered body, and drop it below 30px | Ship a fixed `σ 7` shadow onto a 19px body. 325 overlapping blurs fog the map and re-rasterise on every breath |
| Keep dimming (0.18) and filter-context (0.10) visibly different | Reuse one dim level for both. Dimming is not removal, and the two must never look alike |
| Design both palettes together and check the translucent overlaps in both | Treat light mode as a derived inversion. It is the screenshot palette for light-background threads |
| Keep the graduated bezel and corner crosses in the export | Crop the chart furniture out of the exported frame. The frame is what makes it read as a chart |
| Keep depth stylistic | Add perspective, isometry or a z-axis. 2D is settled |
| Ship colour control as a choice between verified palettes | Expose individual colours. One hue at the wrong luminance dissolves an edge somewhere, silently, and nothing would tell the user |
| Claim read-only as a product posture | Claim a mechanism in the chrome. `:ro` on the socket does not restrict the Docker API, and the brief reserves that question for architecture |
| Draw a masked value as a run of blocks at the same pitch | Blank it, or shrink what is left. A gap reads as a rendering fault; blocks read as a decision, and fixed pitch means nothing reflows |

---

## Open Questions

Nothing here is resolved by this document.

The three rows below are the ones that bear on appearance; `EXPERIENCE.md` carries a fourth of its own — the protagonist names — and this file delegates tab order to it, tab focus on the chrome now being closed in both files.

| Question | Status |
|---|---|
| **Default legibility before any filter is applied, on a large cluster.** Carried from the brief; the product's main open engineering question, and what killed the closest prior art. Owned by `EXPERIENCE.md` → *Open Questions*; carried here because this file supplies most of the mitigations. | **Not closed, and nothing above closes it.** This file contributes what it can — the iso-luminant zone rotation and the composite clamp, the two type floors, the mark floor, the rung-0 ladder holding text back, one pastille family at maximum zoom-out, the reserved-cell rule that keeps every silhouette whole, and the octave pattern that puts an exact network answer back into the rung-0 frame. It also now carries a **new load on the same question**: the stack outline is a second grouping language rendering at rung 0, and it arrives with its own name set on it. It adds no text the rung did not already carry — the stack name was always a rung-0 label — but it does add a mark. **None of this is proof, in either direction.** It needs a real cluster of a few hundred objects, not a lab of three. |
| **Does the octave pattern resolve at badge size?** Raised by the decision that fixes the network channel, and stated as its cost when it was taken. | Open. The pattern has hundreds of square pixels to work in on the zone field, where the decision actually rests. Inside an 8px hexagon it has a ~6px interior, next to as many as five other marks on the rail. Four patterns have to stay separable there at a glance. Needs proving at size, in the shipped rendering — the same kind of check the `pgdata` / `pg-data` specimen is. |
| **Do the two grouping contours stay apart where they coincide?** Raised by rendering [`mockups/key-overview.html`](mockups/key-overview.html) at 1:1, not by any decision. A stack and a network that share members are struck around the same bodies, and long runs of the two contours then sit within 14px of each other — measured in *Components → Stack outline*. | **Open, and the seven tells do not close it.** They separate the two languages *in kind* — field against boundary, open against closed, coastline against drafted offset, tint against graphite — and not one of them is a distance. Nothing in the ruling can be spent on it either: the zone owns position, the outline derives it, and neither may be displaced to buy clearance. The same coincidence is what leaves `FRONTEND` and `MONITORING` with no clear position for their own labels, at 4.9px and 0.8px best clearance. What the file has against it is layer order and contrast, and that is all it has. Needs what the first row needs, and on the same evidence: a real cluster of a few hundred objects, rendered at 1:1 at rung 0. |

---

## Revision Notes

Every passage here has an **earlier draft of this file** as its subject. None of it is a decision and nothing above depends on it; it is kept so that a reader who meets one of these figures or tokens elsewhere — in a mock, a review, `EXPERIENCE.md` — can see what replaced it. Ordered by the section it came out of.

### From Brand & Style

**Where the tension actually comes from — corrected.** An earlier draft of both spines claimed a contradiction *inside the brief*, between its bar *legible over impressive* and its top external success signal. **The brief contains no such contradiction:** its signal is that a stranger reaches for Portolan on infrastructure the author does not own, and it never attributes the posting to impressiveness. The tension is real, and its source is **Jules's own journey 2** — *« presque trop pour que ce soit facilement lisible mais tellement classe pour flexer »*. That is a stated design intent that the default screen be almost too much to read easily, and it is what *beaucoup à regarder, peu à lire* arbitrates: the richness is graphic, the reading load is not. **The principle stands exactly as written; only its provenance was wrong.** The brief's ordering is left intact, not overruled.

### From Colors

**The network pastille never rescued the hue repeat.** An earlier draft said the network pastille rescued the repeat; that was false, because `pastille-network-1…6` was the same six-hue rotation, so network 7's hexagon was network 1's hexagon. The rescue repeated the thing it was rescuing.

**What had to move to make those true.** `{colors.ink-3}` was `#5D6A74`, which measured **3.42:1** on a bubble body and **3.51:1** on the panel — below 4.5:1 on every text it set, while the table above it claimed 15.0:1 for one of them. It is now `#78858F` / `#576470` and is the quietest **text** ink, not a sub-threshold grey. The bubble identifier was given its own token because 7:1 is a different requirement from *quiet*, and the identifier is where Flow 1's climax is read. The node label was a raw `#46535C` with **no light value anywhere in the file** and measured **2.49:1** at 10px; it is now a token, in both modes, at 5.2–5.7. And `{colors.brass-light}` moved `#8A6E2C` → `#7B6228` so brass clears 4.5:1 as text in light mode, which it did not (3.91:1 on the panel).

**The isoline opacity bought nothing.** Separately, `{opacity.zone-isoline}` was **0.85** and was never composited into its own measurement: at that alpha the isoline actually rendered at **2.68–3.03:1**, failing its floor on five of six tints while the table claimed 3.2–3.7. It is now **1.00**. It bought nothing against a 1.18:1 field.

### From Typography

**The single type floor was false, which is why there are two.** The previous single "9px, no glyph ever smaller" was false of **four roles at 1.00** (`section-label` 8, `graduation` 8, `zone-sub` 8.5, `marginalia` 8.5) and **six at 0.90**, three of them on the exported chart, while the same section praised an 8px label four paragraphs above.

### From Shapes

**The rail overflowed the core on every object in the product.** At the old 10px mark and 5.5px gap, every container carrying type + stack + one network + health needed **56.5px of rail into a 54.3px core**, and a three-mark volume needed 41px into 37.8px. That is a straight contradiction of the one geometry rule the file calls inviolate, and the 3px gap and the shrink-to-fit rule are what answer it.

### From Components

**Two entries were added in this revision** — `stack-outline`, which is what a stack now *is*, and `refresh-interval`, which gives the brief's *configurable* a surface it never had. Both carry behavioural rows in `EXPERIENCE.md`.

**Bubble — what the identifier's own token replaced.** An earlier draft set it in `{colors.ink-3}`, which measured **3.42:1** on the body: less than half the floor the same file claimed, while the table's own headline row quoted 15.0:1 for a token nobody had assigned.

**Stack outline — rejected: stack-as-bubble.** A stack node would pull an attachment from every one of its members — fifteen services converging on one point — which is **exactly the fan-in that got images removed from the map**, arriving by a different door. The map spends its whole budget avoiding hairballs; it does not buy one back for the object type that has the most members.

**Stack outline — rejected: stack-as-area.** The tinted field is taken. Networks own it, and a second filled field over the same canvas is the mud the zone study predicted at six, arriving twice.

**Node backdrop — the label was the one colour in this file with no light value.** It was a raw `#46535C`, untokenised, measuring **2.49:1** against its own band at 10px — on the surface Flow 3 is entirely about. It is now `{colors.node-label}` / `{colors.node-label-light}` at 5.2–5.7:1 in both modes.

**Detail panel — why the footer changed.** It used to read *"No threshold, no rule, no verdict"*, fifty-five lines after this same file declared the health light a departure precisely *because* it is a verdict. With amber redefined as `running < desired`, two thirds of that claim became true — there is no threshold and no rule, only counted replicas — and the third became flatly false. The footer now says what the product does: it renders observed state, and it renders one reading of it, and it names which.

**Left menu — what the marginalia block no longer says.** It used to read *READ ONLY · SOCKET MOUNTED :RO · NO WRITE POSSIBLE*. Two of those three clauses had to go, for the two reasons given under *Left menu*: the brief reserves socket mediation for architecture, and the `:ro` claim was **false**. Shipping the string would have printed a security guarantee that does not exist, permanently, on the highest-trust surface in the product, inside the frame the flows are built to have strangers post — in a tool whose own brief says it *must not itself be the odd thing*.
