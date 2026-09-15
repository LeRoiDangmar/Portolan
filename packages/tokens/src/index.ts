// tokens — AD-23: the design tokens are one machine-readable artefact, and it is the
// source of truth.
//
// DESIGN.md stops being normative on values and becomes the documentation of intent.
// Every value the product looks like is authored here, in TypeScript, as `as const`
// objects — `erasableSyntaxOnly` is on, so there are no enums and no runtime-only
// syntax anywhere in this package, which is what lets Node read these files directly
// with type stripping and lets `tsc` emit them unchanged.
//
// ELEVEN namespaces, not colour alone. AD-23 is explicit that scoping to colour would
// orphan the load-bearing half: `stroke` carries the stub length AD-29 ratchets,
// `layout` the 884px operative canvas AD-29 measures against, `density` AD-8's
// reservation maximum, `shape` the hull geometry without which AD-8 is unimplementable,
// `opacity` AD-28's luminance clamp, `motion` AD-2's presentation-state parameters.
// (`components` in DESIGN.md is not a twelfth namespace — it is references only.)
//
// This package imports nothing. It has no Node and no DOM globals (`types: []`,
// `side: shared`), so every generator and every gate lives in `scripts/*.mjs`:
//
//   npm run tokens:css            regenerate generated/tokens.css from these files
//   npm run tokens:css -- --check fail if the committed CSS is out of sync
//   npm run contrast              the AD-28 gate

export type { Palette, ColourToken, PaletteName } from './colour.ts';
export { colour, PALETTES } from './colour.ts';
export { density } from './density.ts';
export { elevation } from './elevation.ts';
export { layout } from './layout.ts';
export { motion } from './motion.ts';
export { opacity } from './opacity.ts';
export { rounded } from './rounded.ts';
export { shape } from './shape.ts';
export { spacing } from './spacing.ts';
export { stroke } from './stroke.ts';
export { type } from './type.ts';

export type { TokenPair, FloorRule, ExemptionMeasure } from './floors.ts';
export { gatedFloors, exemptions, separation, register } from './floors.ts';

import { colour } from './colour.ts';
import { density } from './density.ts';
import { elevation } from './elevation.ts';
import { layout } from './layout.ts';
import { motion } from './motion.ts';
import { opacity } from './opacity.ts';
import { rounded } from './rounded.ts';
import { shape } from './shape.ts';
import { spacing } from './spacing.ts';
import { stroke } from './stroke.ts';
import { type } from './type.ts';

/**
 * The eleven namespaces as one surface, in the order the CSS generator emits them.
 *
 * `colour` is the only namespace with a dark/light pair per token; the other ten are
 * mode-independent. That asymmetry is DESIGN.md's, not an encoding choice, and the
 * generator handles `colour` by name rather than by sniffing the shape — `elevation`
 * also has `dark` and `light` keys and is emphatically not a palette pair.
 */
export const tokens = {
  colour,
  stroke,
  opacity,
  elevation,
  shape,
  density,
  spacing,
  layout,
  type,
  motion,
  rounded,
} as const;

/** The eleven namespace names, in emission order. */
export const NAMESPACES = [
  'colour',
  'stroke',
  'opacity',
  'elevation',
  'shape',
  'density',
  'spacing',
  'layout',
  'type',
  'motion',
  'rounded',
] as const satisfies readonly (keyof typeof tokens)[];
