// layout — DESIGN.md's `layout` namespace, transcribed (AD-23).
//
// `canvas-min` is the OPERATIVE CANVAS — the real width once FR-79 reserves the panel
// column, at NFR-16's 1440px viewport floor. AD-29 requires the harness to read 884px
// from here and never to carry it as a constant, so that a change to the chrome columns
// moves the measurement with it. Scoping the token file to colour would have left that
// number written into the harness, which is the defect AD-23 names.
//
// 1440px is a FLOOR, not a breakpoint: there is no second layout below it.

export const layout = {
  'min-width': '1440px',
  'canvas-min': '884px',
  columns: '{spacing.left-menu} | canvas | {spacing.detail-panel}',
} as const;
