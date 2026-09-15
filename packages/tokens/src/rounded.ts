// rounded — DESIGN.md's `rounded` namespace, transcribed (AD-23).
//
// `DEFAULT` is the spec's own key for the bare radius. It is kept under that name here
// so a reviewer can diff this file against DESIGN.md line for line; the CSS generator
// lower-cases it to `--portolan-rounded-default` like every other key.

export const rounded = {
  sm: '1px',
  DEFAULT: '2px',
  md: '3px',
  lg: '6px',
  full: '9999px',
  note: 'Bubbles have no radius — they are paths, not boxes.',
} as const;
