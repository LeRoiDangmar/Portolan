import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

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

/**
 * Tamper with the committed CSS, run something, and put it back whatever happens.
 *
 * `CSS_PATH` is a TRACKED file, so a failure here must never leave it modified. The
 * `finally` covers a thrown assertion; the `afterEach` below covers what `finally`
 * cannot — an aborted run, a crashed worker, an interrupt between the two writes.
 */
const BACKUP_PATH = `${CSS_PATH}.backup`;

const restoreCommittedCss = (): void => {
  if (!existsSync(BACKUP_PATH)) return;
  copyFileSync(BACKUP_PATH, CSS_PATH);
  rmSync(BACKUP_PATH, { force: true });
};

afterEach(restoreCommittedCss);

const withTamperedCss = <T>(edit: (css: string) => string, body: () => T): T => {
  copyFileSync(CSS_PATH, BACKUP_PATH);
  try {
    writeFileSync(CSS_PATH, edit(readFileSync(CSS_PATH, 'utf8')));
    return body();
  } finally {
    restoreCommittedCss();
  }
};

/**
 * Declarations to tamper with, taken from `declarations()` rather than written down.
 * Hard-coding one ties the test to a value design may legitimately edit, and a `replace`
 * that then silently matched nothing would fail with a confusing count rather than a
 * reason.
 *
 * Two are needed, because Prettier wraps a long value across lines and the two shapes
 * exercise different halves of the parser: a line-anchored reader sees the short one and
 * is blind to the long one.
 */
const committedCss = (): string => readFileSync(CSS_PATH, 'utf8');

/**
 * Where a generated property actually sits in the committed file. The property list is
 * `declarations()`; the text is the file's, because Prettier normalises quotes and folds
 * long values, so the emitted string and the committed line are not the same characters.
 * Values that themselves contain a `;` are skipped rather than mis-sliced.
 */
const locate = (property: string, value: string, css: string) => {
  if (value.includes(';')) return null;
  const start = css.indexOf(`\n  ${property}:`);
  if (start === -1) return null;
  const end = css.indexOf(';', start);
  if (end === -1) return null;
  const text = css.slice(start + 1, end + 2);
  return { property, text, wrapped: text.trimEnd().includes('\n') };
};

const found = (wrapped: boolean) => {
  const css = committedCss();
  const { dark } = declarations() as { dark: [string, string][] };
  for (const [property, value] of dark) {
    const at = locate(property, value, css);
    if (at !== null && at.wrapped === wrapped) return at;
  }
  throw new Error(`No ${wrapped ? 'wrapped' : 'single-line'} declaration in the committed CSS.`);
};

/** The first declaration Prettier left on one line, with the exact text it occupies. */
const singleLineDeclaration = () => found(false);

/**
 * The first declaration Prettier wrapped across lines, with a word from it that occurs
 * exactly once in the whole file — the only safe handle for editing a value whose text
 * is broken up by line breaks and indentation.
 */
const wrappedDeclaration = (): { property: string; handle: string } => {
  const css = committedCss();
  const at = found(true);
  const handle = at.text
    .split(/\s+/u)
    .find((word) => word.length >= 6 && !word.startsWith('--') && css.split(word).length === 2);
  if (handle === undefined) throw new Error('No uniquely addressable word in a wrapped value.');
  return { property: at.property, handle };
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

  it('names every namespace the token file exports, so none can go unemitted', () => {
    // The generator iterates NAMESPACES and so does the case list below, which means a
    // namespace missing from that constant would produce neither CSS nor a failing test.
    // Comparing it against the surface itself is what closes the circle.
    expect([...NAMESPACES].sort()).toEqual(Object.keys(tokens).sort());
    expect(NAMESPACES).toHaveLength(11);
  });

  it.each(NAMESPACES)('carries the %s namespace into the output', async (namespace: string) => {
    const css: string = await render();
    expect(css).toContain(`--portolan-${namespace}-`);
  });

  it('leaves no {namespace.…} cross-reference pointing at a namespace that does not exist', () => {
    // DESIGN.md's prose refers to `{colors.…}` and `{typography.…}`; this package calls
    // those `colour` and `type`. Left as written, the references ship into the generated
    // CSS as permanently dead strings that no reader and no tool can follow.
    const real = new Set<string>(NAMESPACES);
    const dead: string[] = [];
    const walk = (value: unknown, path: string): void => {
      if (typeof value === 'string') {
        for (const [, namespace] of value.matchAll(/\{([a-zA-Z]+)\./gu)) {
          if (!real.has(namespace!)) dead.push(`${path} -> {${namespace}.…}`);
        }
        return;
      }
      if (value !== null && typeof value === 'object') {
        for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`);
      }
    };
    for (const [namespace, value] of Object.entries(tokens)) walk(value, namespace);
    expect(dead).toEqual([]);
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
    const { property, text } = singleLineDeclaration();
    const committed = text.slice(text.indexOf(':') + 1, text.lastIndexOf(';')).trim();
    const result = withTamperedCss(
      (css) => css.replace(text, `  ${property}: TAMPERED;\n`),
      runCheck,
    );
    expect(result.status).toBe(1);
    expect(result.output).toContain('out of sync');
    expect(result.output).toContain(property);
    // The diff is the message: both values are printed, so the reader need not re-run
    // the generator to find out what changed.
    expect(result.output).toContain('TAMPERED');
    expect(result.output).toContain(committed);
  });

  it('names the property when the edit is inside a declaration Prettier wrapped', () => {
    // Seven of the 343 declarations are long enough for Prettier to fold across lines.
    // A line-anchored parser never sees them, so an edit inside one would fall through
    // to the line-number fallback — a report naming `line 134` rather than the token.
    const { property, handle } = wrappedDeclaration();
    const result = withTamperedCss((css) => css.replace(handle, 'TAMPERED'), runCheck);
    expect(result.status).toBe(1);
    expect(result.output).toContain(property);
    expect(result.output).toContain('changed');
    expect(result.output).not.toContain('differs outside any declaration');
  });

  it('catches a deleted declaration as well as a changed one', () => {
    const { property, text } = singleLineDeclaration();
    const result = withTamperedCss((css) => css.replace(text, ''), runCheck);
    expect(result.status).toBe(1);
    expect(result.output).toContain(property);
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
