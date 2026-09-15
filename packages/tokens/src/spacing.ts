// spacing — DESIGN.md's `spacing` namespace, transcribed (AD-23).
//
// A 2-based scale plus the fixed chassis measures. `cell-clearance` is load-bearing
// beyond layout: AD-8 reserves the deformed hull PLUS this clearance before placement,
// and `shape.stack-outline` strikes its hull at exactly this distance outside the
// reserved cells.

export const spacing = {
  '1': '2px',
  '2': '4px',
  '3': '8px',
  '4': '12px',
  '5': '16px',
  '6': '24px',
  '7': '32px',
  '8': '48px',
  gutter: '24px',
  'panel-pad': '16px',
  bezel: '12px',
  'left-menu': '236px',
  'detail-panel': '320px',
  'tab-bar': '56px',
  toolbar: '40px',
  'chart-legend': '120px',
  'cell-clearance': '8px',
} as const;
