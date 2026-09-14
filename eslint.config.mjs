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
/**
 * NFR-4 / AD-44: nothing may reach the network at runtime, and the Docker socket is
 * reached through the collector's GET-only client (AD-15) — never through a bare
 * fetch. `packages/server` is the one package permitted to speak HTTP directly, and
 * its exemption below drops exactly these entries and nothing else.
 */
const NETWORK_API = '^(fetch|XMLHttpRequest|WebSocket|EventSource)$';
const NETWORK_MESSAGE =
  'No runtime network fetch (NFR-4). The Docker socket is reached through @portolan/collector (AD-15), and the one transport is the SSE endpoint owned by @portolan/server (AD-11).';

/** Bare identifier use — `fetch(url)`, or `const f = fetch`. */
const NETWORK_GLOBALS = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'].map((name) => ({
  name,
  message: NETWORK_MESSAGE,
}));

/**
 * The same APIs reached through a global object — `globalThis.fetch(url)`,
 * `window.fetch(url)`, `new globalThis.WebSocket(...)`. Scoped to the global objects
 * so an unrelated `client.fetch(...)` is not a false positive.
 */
const NETWORK_SELECTORS = [
  {
    selector: `MemberExpression[object.name=/^(globalThis|window|self)$/][property.name=/${NETWORK_API}/]`,
    message: NETWORK_MESSAGE,
  },
];

/**
 * Globals and syntax restricted everywhere, network aside. Kept separate so the
 * server exemption drops only the network entries and every rule added here keeps
 * applying to the server package.
 */
const RESTRICTED_GLOBALS = [];
const RESTRICTED_SYNTAX = [];

/**
 * The server's exemption. ESLint keeps a rule's previous options when it is given a
 * severity alone, so an empty list has to become `off` rather than `['error']` —
 * otherwise the network entries would survive the override unchanged.
 */
const withoutNetwork = (entries) => (entries.length > 0 ? ['error', ...entries] : 'off');

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
            // `@portolan/**` so a subpath import is caught too — gitignore-style `*`
            // does not cross a `/`, and `@portolan/scene/internal` is the same arrow.
            // Each permitted package is un-matched both bare and by subpath.
            group: [
              '@portolan/**',
              ...spec.imports.flatMap((dep) => [`!@portolan/${dep}`, `!@portolan/${dep}/**`]),
            ],
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
      'no-restricted-globals': ['error', ...RESTRICTED_GLOBALS, ...NETWORK_GLOBALS],
      'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX, ...NETWORK_SELECTORS],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...boundaries,
  {
    // The server is the one package permitted to speak HTTP directly. The exemption
    // drops the network entries and nothing else, so anything later added to
    // RESTRICTED_GLOBALS or RESTRICTED_SYNTAX still applies here.
    files: ['packages/server/**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-restricted-globals': withoutNetwork(RESTRICTED_GLOBALS),
      'no-restricted-syntax': withoutNetwork(RESTRICTED_SYNTAX),
    },
  },
  {
    // Build tooling and root tests run in node, outside the dependency direction.
    files: ['*.mjs', '*.ts', 'scripts/**/*.mjs', 'test/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-restricted-imports': 'off' },
  },
  prettier,
);
