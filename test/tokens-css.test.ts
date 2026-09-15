import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// @ts-expect-error — a plain .mjs tooling script with no declarations.
import * as generator from '../scripts/generate-tokens-css.mjs';

// Destructured after the import so Prettier cannot split the specifier onto its own
// line, which would move the directive off the line that actually raises TS7016.
const { CSS_PATH, LIGHT_SELECTOR, declarations, firstDifference, render } = generator;
import { NAMESPACES, tokens } from '../packages/tokens/src/index.ts';

/**
 * AD-23: the CSS is a generated artefact, checked by CI to be in sync and never
 * hand-edited. That makes two things load-bearing, and both are asserted here — that
 * the generation carries every namespace across, and that the drift check actually
 * catches a hand edit.
 *
 * The drift half is driven through the REAL script in `--check` mode rather than
 * through `firstDifference` alone: story 1's rule is that a gate is tested through the
 * tooling, because a helper that works inside a gate that never calls it is a gate that
 * passes on a broken build.
 */

const root = fileURLToPath(new URL('..', import.meta.url));
const script = fileURLToPath(new URL('../scripts/generate-tokens-css.mjs', import.meta.url));

/** Run the real `--check` gate, returning its exit code and what it printed. */
const runCheck = (): { status: number; output: string } => {
  try {
    const stdout = execFileSync('node', [script, '--check'], { cwd: root, encoding: 'utf8' });
    return { status: 0, output: stdout };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? -1,
      output: `${failure.stdout ?? ''}${failure.stderr ?? ''}`,
    };
  }
};

/** Tamper with the committed CSS, run something, and put it back whatever happens. */
const withTamperedCss = <T>(edit: (css: string) => string, body: () => T): T => {
  const backup = `${CSS_PATH}.backup`;
  copyFileSync(CSS_PATH, backup);
  try {
    writeFileSync(CSS_PATH, edit(readFileSync(CSS_PATH, 'utf8')));
    return body();
  } finally {
    copyFileSync(backup, CSS_PATH);
    execFileSync('rm', ['-f', backup]);
  }
};

describe('the generated CSS carries every namespace across', () => {
  it('emits one block at :root and one under the light selector', async () => {
    const css: string = await render();
    expect(css).toContain(':root {');
    expect(css).toContain(`${LIGHT_SELECTOR} {`);
    // Light is a sibling override block, not a nested or media-query-derived one.
    // Compare the block openings, not the bare selector — the header names it too.
    expect(css.indexOf(':root {')).toBeLessThan(css.indexOf(`${LIGHT_SELECTOR} {`));
    expect(css).not.toContain('prefers-color-scheme');
  });

  it('prefixes every custom property with --portolan and nothing else', async () => {
    const css: string = await render();
    const properties = [...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((match) => match[1]);
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.filter((property) => !property?.startsWith('--portolan-'))).toEqual([]);
  });

  it.each(NAMESPACES)('carries the %s namespace into the output', async (namespace: string) => {
    const css: string = await render();
    expect(css).toContain(`--portolan-${namespace}-`);
  });

  it('declares every colour token in both palettes, and only colour in the light block', () => {
    const { dark, light } = declarations() as {
      dark: [string, string][];
      light: [string, string][];
    };
    const colourCount = Object.keys(tokens.colour).length;
    expect(light).toHaveLength(colourCount);
    // Every light override names a property the dark block already declared: the light
    // palette overrides, it never introduces.
    const darkNames = new Set(dark.map(([property]) => property));
    expect(light.filter(([property]) => !darkNames.has(property))).toEqual([]);
    // And the ten other namespaces are palette-independent, so they appear once.
    expect(dark.length).toBeGreaterThan(colourCount);
  });

  it('is in sync with the committed file, through the real gate', () => {
    const { status, output } = runCheck();
    expect(status).toBe(0);
    expect(output).toContain('is in sync');
  });
});

describe('the drift check catches a hand edit', () => {
  it('exits non-zero and names the first differing property', () => {
    const result = withTamperedCss(
      (css) =>
        css.replace('--portolan-colour-ground: #06080a;', '--portolan-colour-ground: #FF0000;'),
      runCheck,
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('out of sync');
    expect(result.output).toContain('--portolan-colour-ground');
    // The diff is the message: both values are printed, so the reader need not re-run
    // the generator to find out what changed.
    expect(result.output).toContain('#FF0000');
    expect(result.output).toContain('#06080a');
  });

  it('catches a deleted declaration as well as a changed one', () => {
    const result = withTamperedCss(
      (css) => css.replace(/^\s*--portolan-colour-ground: #06080a;\n/m, ''),
      runCheck,
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('--portolan-colour-ground');
    expect(result.output).toContain('missing from the committed CSS');
  });

  it('catches a change outside any declaration, rather than reporting the file clean', () => {
    const result = withTamperedCss(
      (css) => css.replace('GENERATED FILE', 'HAND-WRITTEN FILE'),
      runCheck,
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('differs outside any declaration');
  });

  it('restores nothing it did not break — the committed file is byte-identical afterwards', async () => {
    const generated: string = await render();
    expect(readFileSync(CSS_PATH, 'utf8')).toBe(generated);
  });
});

describe('firstDifference, on its own', () => {
  it('returns null when the two agree', async () => {
    const css: string = await render();
    expect(firstDifference(css, css)).toBeNull();
  });

  it('does not compare a dark value against a light one of the same name', () => {
    // Each colour token is declared twice, once per block. Keying by name alone would
    // let the light value answer for the dark one and report the wrong property.
    const css = [
      ':root {',
      '  --portolan-colour-ground: #06080a;',
      '}',
      ":root[data-palette='light'] {",
      '  --portolan-colour-ground: #edf1f3;',
      '}',
    ].join('\n');
    expect(firstDifference(css, css)).toBeNull();
    const swapped = css.replace('#edf1f3', '#000000');
    const difference = firstDifference(swapped, css) as { property: string; kind: string };
    expect(difference.kind).toBe('changed');
    expect(difference.property).toContain("data-palette='light'");
  });
});
