import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
// `vitest/config` re-exports Vite's defineConfig widened with the `test` block,
// so the bundler and the test runner read one config, as the toolchain note requires.
import { defineConfig } from 'vitest/config';

interface Workspace {
  dir: string;
  side: 'shared' | 'browser' | 'server' | 'node';
  imports: string[];
}

const here = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

const graph = JSON.parse(readFileSync(here('./dependency-graph.json'), 'utf8')) as {
  workspaces: Record<string, Workspace>;
};

// Resolve @portolan/* to TypeScript sources so the dev server and the bundle
// never depend on `tsc --build` having run first. The compiled output under
// packages/*/dist is for the server (AD-43), not for the browser.
const alias = Object.fromEntries(
  Object.entries(graph.workspaces).map(([name, spec]) => [
    `@portolan/${name}`,
    here(`./${spec.dir}/src/index.ts`),
  ]),
);

// NFR-4 / AD-44: the page is served entirely from its own origin. The policy is
// injected at build time only — the dev server needs inline script and eval for HMR,
// and shipping a policy that development quietly relaxes would guard nothing.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'none'",
].join('; ');

const sameOriginOnly = (): Plugin => ({
  name: 'portolan:same-origin-only',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => {
      const charset = '<meta charset="utf-8" />';
      if (!html.includes(charset)) throw new Error('index.html must declare its charset first.');
      return html.replace(
        charset,
        `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`,
      );
    },
  },
});

export default defineConfig({
  // Relative asset URLs: Portolan serves the bundle itself, from wherever it is mounted.
  base: './',
  plugins: [sameOriginOnly()],
  resolve: { alias },
  server: {
    // AD-17: the safe default is loopback, and the dev server matches it.
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist/browser',
    emptyOutDir: true,
    target: 'es2024',
    sourcemap: true,
    // Everything the browser needs is emitted into the image (NFR-4). Kept explicit
    // so the intent is visible at the point someone would add an entry — but this is
    // Rollup's default for an app build, not a guard: it cannot fail. What actually
    // holds NFR-4 is the ESLint network ban and the build-time CSP below.
    rollupOptions: { external: [] },
  },
  test: {
    include: ['packages/*/src/**/*.test.ts', 'harness/src/**/*.test.ts', 'test/**/*.test.ts'],
    environment: 'node',
    restoreMocks: true,
  },
});
