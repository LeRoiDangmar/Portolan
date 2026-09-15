import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

/**
 * The story's load-bearing criterion: a package importing from one above it in the
 * dependency direction fails lint.
 *
 * Asserting the shape of eslint.config.mjs would not test it — deleting the rule
 * would leave such a test green. So this lints real source through the real config,
 * by the same ESLint the `lint` script runs.
 */

const cwd = fileURLToPath(new URL('..', import.meta.url));
const eslint = new ESLint({ cwd, overrideConfigFile: 'eslint.config.mjs' });

const lint = async (filePath: string, code: string): Promise<string[]> => {
  const [result] = await eslint.lintText(code, { filePath, warnIgnored: false });
  return (result?.messages ?? []).map((message) => message.ruleId ?? `fatal: ${message.message}`);
};

const importing = (specifier: string): string =>
  `import type * as Imported from '${specifier}';\nexport type Used = typeof Imported;\n`;

describe('an upward import fails lint', () => {
  it.each([
    ['packages/layout/src/probe.ts', '@portolan/scene'],
    // A subpath is the same arrow. Gitignore-style `*` does not cross a `/`, so this
    // is the case a `@portolan/*` group would have let through.
    ['packages/layout/src/probe.ts', '@portolan/scene/internal'],
    ['packages/model/src/probe.ts', '@portolan/collector'],
    ['packages/collector/src/probe.ts', '@portolan/server'],
    ['harness/src/probe.ts', '@portolan/chrome'],
  ])('%s importing %s', async (filePath, specifier) => {
    expect(await lint(filePath, importing(specifier))).toContain('no-restricted-imports');
  });

  it('reports a relative escape out of the package', async () => {
    expect(
      await lint('packages/layout/src/probe.ts', importing('../../scene/src/index.js')),
    ).toContain('no-restricted-imports');
  });
});

describe('a permitted import does not', () => {
  it.each([
    ['packages/layout/src/probe.ts', '@portolan/model'],
    ['packages/layout/src/probe.ts', '@portolan/model/graph'],
    ['packages/layout/src/probe.ts', '@portolan/tokens'],
    ['packages/scene/src/probe.ts', '@portolan/view-state'],
    ['harness/src/probe.ts', '@portolan/scene'],
  ])('%s importing %s', async (filePath, specifier) => {
    expect(await lint(filePath, importing(specifier))).not.toContain('no-restricted-imports');
  });
});

describe('nothing reaches the network at runtime (NFR-4)', () => {
  it.each([
    ['bare call', 'export const a = fetch("/x");'],
    ['bare constructor', 'export const a = new WebSocket("/x");'],
    ['through globalThis', 'export const a = globalThis.fetch("/x");'],
    ['through window', 'export const a = window.fetch("/x");'],
    ['constructed through globalThis', 'export const a = new globalThis.WebSocket("/x");'],
    ['bare XMLHttpRequest', 'export const a = new XMLHttpRequest();'],
    ['bare EventSource', 'export const a = new EventSource("/x");'],
  ])('%s is reported in a browser package', async (_label, code) => {
    const reported = await lint('packages/chrome/src/probe.ts', code);
    expect(reported.some((rule) => rule.startsWith('no-restricted-'))).toBe(true);
  });

  it.each([
    ['bare call', 'export const a = fetch("/x");'],
    ['through globalThis', 'export const a = globalThis.fetch("/x");'],
  ])('%s is permitted in the server package', async (_label, code) => {
    const reported = await lint('packages/server/src/probe.ts', code);
    expect(reported.filter((rule) => rule.startsWith('no-restricted-'))).toEqual([]);
  });
});
