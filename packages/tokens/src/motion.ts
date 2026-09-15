// motion — DESIGN.md's `motion` namespace, transcribed (AD-23).
//
// One of the seven extension namespaces DESIGN.md declares beyond the spec's own keys.
// AD-2 reads this namespace as the parameters of PRESENTATION state — state local to
// the frame that never travels back up — which is why FR-71's "translation 0px, targets
// never travel" is structural rather than a promise: `breathe` deforms an outline about
// a fixed centroid.

export const motion = {
  breathe: {
    property: 'scale + rotate, on the body path only',
    scale: '1.000 → 1.018',
    rotate: '±0.7deg',
    period: '5.5s – 9.7s',
    periods: '5.5 / 6.1 / 6.9 / 7.7 / 8.3 / 9.1 / 9.7s',
    delays: '-0.8 / -1.9 / -2.6 / -3.1 / -4.4 / -5.2 / -6.8s',
    easing: 'ease-in-out',
    translation:
      '0px. The body centre does not move. There is no positional drift at any scale, any density or any zoom.',
    'outline-excursion':
      '±3.4px, applied normal to the contour — an outline deformation, not a displacement. The centroid of the excursion is the rest centroid.',
    'outline-excursion-periods': '9 / 11 / 13 / 15 / 17 / 19 / 23s',
    'outline-excursion-delays': '-1.2 / -2.3 / -3.9 / -4.7 / -6.4 / -8.1 / -11.5s',
    'edge-drift':
      "±1.3px / 21s — the endpoint rides the contour it is anchored under; the edge's far end is likewise anchored, so no edge translates either",
    'edge-anchor': '14px inside the body',
    core: 'the invariant core — name, identifier, pastille rail — is not touched by any of this. Labels and click targets never travel.',
    contract:
      'AMPLITUDE BOUNDS THE OUTLINE, NEVER THE POSITION. Zero-mean, non-accumulating, confined to the reserved cell. Translation is zero, not small.',
  },
  draw: {
    sequence:
      'network zones → bubbles → edges, preceded by the node backdrop when that display control is on',
    layer: '320ms',
    stagger: '140ms',
    total: '~1.4s',
    'edge-technique': 'stroke-dashoffset, 420ms, drawn outward from the body',
    easing: 'cubic-bezier(0.2, 0, 0.1, 1)',
  },
  settle: {
    duration: '260ms',
    gesture:
      'every layer lands on one frame; the four corner registration crosses strike brass for 180ms and return to hairline',
    hold: '200ms before the first breath',
  },
  enter: {
    duration: '420ms',
    gesture:
      'fade 0 → 1 while the contour resolves from a circle to its own silhouette, at its earned position',
    easing: 'cubic-bezier(0.2, 0, 0.1, 1)',
  },
  exit: {
    duration: '520ms',
    gesture:
      'fade 1 → 0 in place while the contour relaxes back to a circle; the cell is not reclaimed until the next relayout',
  },
  relayout: {
    duration: '900ms',
    easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
    gesture:
      'bodies travel curved paths; every edge stays attached for the whole traverse; zone tints crossfade over the same window',
  },
  'reduced-motion': {
    note: 'prefers-reduced-motion stills {motion.breathe} entirely — bodies return to their rest pose, nothing is lost. Every other motion token is kept: it explains what changed.',
  },
} as const;
