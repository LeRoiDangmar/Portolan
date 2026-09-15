/**
 * AD-23: one authored source, generated output.
 *
 * `packages/tokens/src/*.ts` is authored. `packages/tokens/generated/tokens.css` is
 * emitted from it and must never be hand-edited. This script does both halves:
 *
 *   node scripts/generate-tokens-css.mjs            # write the CSS
 *   node scripts/generate-tokens-css.mjs --check    # fail if the committed CSS drifted
 *
 * The output is tracked rather than built into `dist/`, which `.gitignore` ignores: a
 * drift check over an untracked file checks nothing.
 *
 * Every one of the eleven namespaces is emitted. `colour` is the only namespace with a
 * dark/light pair per token, so it is the only one that splits across the two blocks —
 * dark at `:root` because dark is the default and the design target, light under its
 * own selector. `elevation` also has `dark` and `light` keys and is emphatically not a
 * palette pair, which is why `colour` is handled by name and not by sniffing the shape.
 *
 * `floors.ts` is deliberately NOT emitted. Gate data is not style.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

import { tokens, NAMESPACES } from '../packages/tokens/src/index.ts';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

/** The committed output. Tracked, because `dist/` is gitignored. */
export const CSS_PATH = resolve(root, 'packages/tokens/generated/tokens.css');

/** Every custom property is namespaced, so a token can never collide with a page's own. */
const PREFIX = '--portolan';

/**
 * The selector the light palette lives under. Light is first-class, not derived — the
 * exported frame is what strangers see and it gets pasted into light-background
 * threads — so it is a sibling block rather than an override of a few properties.
 */
export const LIGHT_SELECTOR = ":root[data-palette='light']";

/** `fontFamily` -> `font-family`, `DEFAULT` -> `default`, `zone-tint-1` unchanged. */
const kebab = (key) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

/**
 * Whether a string can be written into a declaration as-is, rather than as a quoted CSS
 * string. An allowlist, not a denylist: the characters a CSS value is actually built
 * from, with parentheses required to balance.
 *
 * This matters more than it looks, and a denylist would not have been enough. Eleven
 * namespaces of DESIGN.md prose carry apostrophes ("the object's Docker ID"), which
 * open a string; semicolons, which end the declaration; `{token}` references, whose
 * braces open a block and which crash Prettier's own CSS parser outright; and dashes,
 * arrows and mathematical signs that are not CSS tokens at all.
 *
 * What stays bare is what a stylesheet consumes: `#06080A`, `1.6px`, `0.18`,
 * `ease-in-out`, `cubic-bezier(0.2, 0, 0.1, 1)`, `IBM Plex Mono`. Everything else is a
 * string — still readable, still exact, and inert.
 */
export const isBareValue = (text) => {
  if (!/^[A-Za-z0-9#%.,\-_ ()]+$/.test(text)) return false;
  let depth = 0;
  for (const character of text) {
    if (character === '(') depth += 1;
    else if (character === ')') {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
};

/** One leaf value, as CSS. */
export const cssValue = (value) => {
  if (typeof value === 'number') return String(value);
  const text = String(value);
  return isBareValue(text) ? text : `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
};

/** Depth-first flattening of a namespace into `[property, value]` pairs. */
const flatten = (value, path, out) => {
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flatten(child, [...path, kebab(key)], out);
    return out;
  }
  out.push([`${PREFIX}-${path.join('-')}`, cssValue(value)]);
  return out;
};

/**
 * The two blocks of declarations: everything at `:root`, and the light palette's
 * overrides. Exported so the tests can read the same structure the file is written from.
 */
export const declarations = () => {
  const dark = [];
  const light = [];
  for (const namespace of NAMESPACES) {
    if (namespace === 'colour') {
      for (const [token, palette] of Object.entries(tokens.colour)) {
        const property = `${PREFIX}-colour-${kebab(token)}`;
        dark.push([property, cssValue(palette.dark)]);
        light.push([property, cssValue(palette.light)]);
      }
      continue;
    }
    flatten(tokens[namespace], [namespace], dark);
  }
  return { dark, light };
};

const HEADER = `/*
 * GENERATED FILE — DO NOT EDIT.
 *
 * Emitted from packages/tokens/src/*.ts by scripts/generate-tokens-css.mjs (AD-23).
 * Edit the TypeScript and run \`npm run tokens:css\`; CI runs \`--check\` and fails if
 * this file and that source disagree.
 *
 * All eleven namespaces are here. Dark is the default and sits at :root; the light
 * palette is a sibling block under ${LIGHT_SELECTOR}, because light is
 * first-class rather than derived.
 *
 * The values are DESIGN.md's, with one named exception: the twelve zone tints are
 * palette-cvd-analysis.md §5's re-optimised register, which is what clears NFR-13.
 */`;

/** The complete file, formatted by the project's own Prettier configuration. */
export const render = async () => {
  const { dark, light } = declarations();
  const block = (selector, entries) =>
    `${selector} {\n${entries.map(([property, value]) => `  ${property}: ${value};`).join('\n')}\n}`;
  const css = `${HEADER}\n\n${block(':root', dark)}\n\n${block(LIGHT_SELECTOR, light)}\n`;
  const options = (await prettier.resolveConfig(CSS_PATH)) ?? {};
  return prettier.format(css, { ...options, filepath: CSS_PATH, parser: 'css' });
};

/**
 * Every declaration, keyed by the block it is in as well as its name. The block matters:
 * each colour token is declared twice, once per palette, so a name alone would let a
 * dark value be compared against a light one — and the check would then report the
 * wrong property, or none at all.
 */
const parseDeclarations = (css) => {
  const found = [];
  let selector = '(no selector)';
  for (const line of css.split('\n')) {
    const opened = /^(\S[^{]*?)\s*\{\s*$/.exec(line);
    if (opened) {
      selector = opened[1];
      continue;
    }
    const match = /^\s*(--[a-z0-9-]+):\s*([\s\S]*?);\s*$/.exec(line);
    if (match) found.push([`${match[1]} under ${selector}`, match[2]]);
  }
  return found;
};

/**
 * The first property on which the committed file and a fresh generation disagree, in
 * generation order — or `null` when they agree. The diff is the message: a drift
 * report that only says "out of sync" makes the reader run the generator to find out
 * what changed.
 */
export const firstDifference = (committed, generated) => {
  const before = parseDeclarations(committed);
  const after = parseDeclarations(generated);
  const beforeByName = new Map(before);
  const afterByName = new Map(after);

  for (const [property, value] of after) {
    if (!beforeByName.has(property)) return { property, kind: 'missing from the committed CSS' };
    if (beforeByName.get(property) !== value) {
      return {
        property,
        kind: 'changed',
        committed: beforeByName.get(property),
        generated: value,
      };
    }
  }
  for (const [property] of before) {
    if (!afterByName.has(property)) return { property, kind: 'no longer generated' };
  }
  // Every declaration agrees, so the difference is in the header, the selectors or the
  // formatting. Report the first differing line rather than claiming the file is clean.
  const committedLines = committed.split('\n');
  const generatedLines = generated.split('\n');
  for (let index = 0; index < Math.max(committedLines.length, generatedLines.length); index += 1) {
    if (committedLines[index] !== generatedLines[index]) {
      return {
        property: `line ${index + 1}`,
        kind: 'differs outside any declaration',
        committed: committedLines[index] ?? '(end of file)',
        generated: generatedLines[index] ?? '(end of file)',
      };
    }
  }
  return null;
};

const runGate = async () => {
  const generated = await render();
  const check = process.argv.includes('--check');
  const where = relative(root, CSS_PATH);

  if (!check) {
    mkdirSync(dirname(CSS_PATH), { recursive: true });
    writeFileSync(CSS_PATH, generated);
    const { dark, light } = declarations();
    console.log(
      `Wrote ${where}: ${dark.length} custom properties at :root, ${light.length} under ${LIGHT_SELECTOR}.`,
    );
    return;
  }

  let committed;
  try {
    committed = readFileSync(CSS_PATH, 'utf8');
  } catch {
    console.error(`${where} is missing. Run \`npm run tokens:css\` and commit the result.`);
    process.exit(1);
  }

  const difference = firstDifference(committed, generated);
  if (difference === null) {
    console.log(`${where} is in sync with packages/tokens/src.`);
    return;
  }

  console.error(`${where} is out of sync with packages/tokens/src (AD-23).\n`);
  console.error(`  first difference: ${difference.property} — ${difference.kind}`);
  if (difference.kind === 'changed' || difference.kind === 'differs outside any declaration') {
    console.error(`    committed: ${difference.committed}`);
    console.error(`    generated: ${difference.generated}`);
  }
  console.error(
    '\nThe CSS is generated and never hand-edited. Run `npm run tokens:css` and commit the result.',
  );
  process.exit(1);
};

// Run the gate only when invoked as a script, so the tests can import the helpers.
if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runGate();
}
