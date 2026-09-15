// type — DESIGN.md's `typography` namespace, transcribed (AD-23).
//
// Two families, both embedded in the image and served by Portolan: no CDN, no webfont
// host, no system stack (NFR-4). Twelve roles and a user-controlled scale with TWO
// floors, not one — 9px for anything naming a cluster object, 8px for chassis
// annotation that names nothing. The scale multiplies and then CLAMPS at the role's
// own floor, so no glyph renders below 8px and no identifier below 9px at any step.
//
// AD-23's obligation on this namespace is that the face is pinned here and embedded in
// the image, so the thing NFR-20 is verified on by eye is the thing that ships.

export const type = {
  mono: {
    fontFamily: 'IBM Plex Mono',
    fontSize: '11px',
    fontWeight: '400',
    lineHeight: '1.35',
    letterSpacing: '0.02em',
    note: 'SIL OFL 1.1 · AGPLv3-compatible · redistributable inside the image. Identifiers only.',
  },
  sans: {
    fontFamily: 'IBM Plex Sans',
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '1.45',
    note: 'SIL OFL 1.1 · matched superfamily metrics with the mono. Chassis only.',
  },
  'bubble-name': {
    fontFamily: 'IBM Plex Sans',
    fontSize: '13.5px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  'bubble-id': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '9px',
    letterSpacing: '0.04em',
  },
  plate: {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10px',
    lineHeight: '1',
  },
  'zone-label': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '9.5px',
    letterSpacing: '0.26em',
    note: 'Uppercased in render.',
  },
  'zone-sub': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '9px',
    letterSpacing: '0.1em',
    note: 'Raised from 8.5px: a CIDR names a cluster object, so it takes the 9px object floor.',
  },
  'stack-label': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10px',
    letterSpacing: '0.02em',
    note: 'Set as typed — NOT uppercased, NOT tracked, and that is deliberate. The zone label is uppercase at 0.26em; case and tracking are the cheapest tell at rung 0 that the two grouping labels are not the same kind of mark.',
  },
  'node-label': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '10px',
    letterSpacing: '0.34em',
    note: 'Uppercased in render.',
  },
  'section-label': {
    fontFamily: 'IBM Plex Mono',
    fontSize: '8px',
    letterSpacing: '0.26em',
    note: 'Uppercased in render. Panel and chart-legend section heads.',
  },
  marginalia: {
    fontFamily: 'IBM Plex Mono',
    fontSize: '8.5px',
    letterSpacing: '0.2em',
  },
  graduation: {
    fontFamily: 'IBM Plex Mono',
    fontSize: '8px',
    letterSpacing: '0.1em',
  },
  scale: {
    steps: '0.90 / 1.00 / 1.15',
    affects: 'every rendered size in the ramp above',
    'floor-object':
      '9px — anything naming a cluster object: bubble-name, bubble-id, plate, zone-label, zone-sub, stack-label, node-label, mono.',
    'floor-chassis':
      '8px — chassis annotation that names nothing: section-label, marginalia, graduation, sans.',
    clamp:
      "the scale multiplies, then CLAMPS at the role's own floor. 0.90 shrinks only the roles that have room above their floor, so no glyph ever renders below 8px, and no identifier below 9px, at any step.",
    note: 'User control, left menu. The two floors are what the ramp can actually hold — an earlier single 9px claim was false of four roles at 1.00 and six at 0.90.',
  },
} as const;
