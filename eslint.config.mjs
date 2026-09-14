import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const graph = JSON.parse(
  readFileSync(fileURLToPath(new URL('./dependency-graph.json', import.meta.url)), 'utf8'),
);

/**
 * The dependency direction, enforced. `no-restricted-imports` patterns are
 * gitignore-style, so `['@portolan/*', '!@portolan/model']` reads as
 * "every Portolan package except model".
 *
 * This is the half of the enforcement that holds unconditionally. TypeScript's
 * `paths` allowlist (see each package's tsconfig.json) is the other half, and it
 * also catches relative escapes out of the package via `rootDir`.
 */
const environment = {
  // A shared package is environment-agnostic: neither the DOM nor node globals.
  // This mirrors `lib` and `types` in each package's tsconfig.json.
  shared: {},
  browser: globals.browser,
  server: globals.node,
  node: globals.node,
};

const boundaries = Object.entries(graph.workspaces).map(([name, spec]) => ({
  files: [`${spec.dir}/**/*.{ts,tsx,mts,cts}`],
  languageOptions: { globals: { ...globals.es2024, ...environment[spec.side] } },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@portolan/*', ...spec.imports.map((dep) => `!@portolan/${dep}`)],
            message:
              `There is no arrow back up. \`${name}\` may import ` +
              (spec.imports.length > 0
                ? spec.imports.map((dep) => `@portolan/${dep}`).join(', ')
                : 'no other Portolan package') +
              ' — see the Dependency direction in ARCHITECTURE-SPINE.md and dependency-graph.json.',
          },
          {
            group: ['**/packages/**', '**/harness/**', '../../*'],
            message:
              'Reach another package by its @portolan/* name, never by a relative path out of this one.',
          },
        ],
      },
    ],
  },
}));

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '_bmad/**',
      '_bmad-output/**',
      '.claude/**',
      '.githooks/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.es2024 },
    },
    rules: {
      // NFR-4 / AD-44: nothing the browser runs may reach the network, and the
      // server reaches the Docker socket through the collector's GET-only client
      // (AD-15) — never through a bare fetch.
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'No runtime network fetch (NFR-4). The Docker socket is reached through @portolan/collector (AD-15).',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'NewExpression[callee.name=/^(XMLHttpRequest|WebSocket|EventSource)$/]',
          message:
            'No runtime network fetch (NFR-4). The one transport is the SSE endpoint owned by the server package (AD-11).',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...boundaries,
  {
    // The server owns the SSE endpoint, so EventSource-shaped restrictions do not apply to it.
    files: ['packages/server/**/*.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    // Build tooling and root tests run in node, outside the dependency direction.
    files: ['*.mjs', '*.ts', 'scripts/**/*.mjs', 'test/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-restricted-imports': 'off' },
  },
  prettier,
);
