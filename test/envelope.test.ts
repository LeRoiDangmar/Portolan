import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { Plugin } from 'vite';
import { describe, expect, it } from 'vitest';

import config from '../vite.config.ts';

/**
 * The smoke test. It proves the runner actually runs — a green CI running nothing
 * is worse than none — and it guards the two things story 1 exists to fix: that the
 * workspace is the spine's Structural Seed, and that no package claims an arrow
 * back up.
 */

const here = (path: string): string => fileURLToPath(new URL(path, import.meta.url));
const read = (path: string): string => readFileSync(here(path), 'utf8');
const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(read(path)) as Record<string, unknown>;

/**
 * ARCHITECTURE-SPINE.md, Structural Seed — the eleven packages, in the order the
 * Seed lists them. Hard-coded here on purpose: it is what dependency-graph.json is
 * checked against, so the graph file cannot drift from the spine unnoticed.
 */
const SEED_PACKAGES = [
  'tokens',
  'i18n',
  'model',
  'collector',
  'server',
  'layout',
  'scene',
  'raster-svg',
  'raster-screen',
  'view-state',
  'chrome',
] as const;

interface Workspace {
  dir: string;
  side: 'shared' | 'browser' | 'server' | 'node';
  imports: string[];
}

const graph = readJson('../dependency-graph.json') as unknown as {
  workspaces: Record<string, Workspace>;
};
const workspaces = Object.entries(graph.workspaces);

describe('the workspace is the spine’s Structural Seed', () => {
  it('holds the eleven packages, named and ordered exactly as the Seed names them', () => {
    const packages = workspaces
      .filter(([, spec]) => spec.dir.startsWith('packages/'))
      .map(([name]) => name);
    expect(packages).toEqual([...SEED_PACKAGES]);
  });

  it('holds harness as the twelfth workspace, outside packages/', () => {
    expect(graph.workspaces['harness']?.dir).toBe('harness');
  });

  it('lists every workspace in the root manifest', () => {
    const root = readJson('../package.json');
    expect(root['workspaces']).toEqual(['packages/*', 'harness']);
    expect(root['engines']).toEqual({ node: '>=24' });
  });

  it.each(workspaces)('%s is an empty typechecking package', (_name, spec) => {
    expect(existsSync(here(`../${spec.dir}/package.json`))).toBe(true);
    expect(existsSync(here(`../${spec.dir}/tsconfig.json`))).toBe(true);
    expect(existsSync(here(`../${spec.dir}/src/index.ts`))).toBe(true);
  });

  it('is referenced in full by the solution tsconfig', () => {
    const solution = readJson('../tsconfig.json') as { references: { path: string }[] };
    expect(solution.references.map((reference) => reference.path)).toEqual(
      workspaces.map(([, spec]) => `./${spec.dir}`),
    );
  });
});

describe('there is no arrow back up', () => {
  it('declares a graph with no cycle, so every import points down', () => {
    const settled = new Set<string>();
    let progress = true;
    while (progress) {
      progress = false;
      for (const [name, spec] of workspaces) {
        if (settled.has(name)) continue;
        if (spec.imports.every((dep) => settled.has(dep))) {
          settled.add(name);
          progress = true;
        }
      }
    }
    expect([...settled].sort()).toEqual(workspaces.map(([name]) => name).sort());
  });

  it.each(workspaces)('%s only names permitted imports as dependencies', (name, spec) => {
    const manifest = readJson(`../${spec.dir}/package.json`) as {
      name: string;
      dependencies?: Record<string, string>;
    };
    expect(manifest.name).toBe(`@portolan/${name}`);
    const declared = Object.keys(manifest.dependencies ?? {}).filter((dep) =>
      dep.startsWith('@portolan/'),
    );
    expect(declared).toEqual(spec.imports.map((dep) => `@portolan/${dep}`));
  });

  it.each(workspaces)('%s only references permitted imports from its tsconfig', (_name, spec) => {
    const config = readJson(`../${spec.dir}/tsconfig.json`) as {
      compilerOptions: { paths: Record<string, string[]> };
      references?: { path: string }[];
    };
    const referenced = (config.references ?? []).map((reference) =>
      reference.path.replace(/^(\.\.\/)+/, ''),
    );
    expect(referenced).toEqual(spec.imports.map((dep) => graph.workspaces[dep]?.dir));

    // The paths allowlist is what makes an undeclared import a compile error even
    // on an incremental build. The catch-all must point at the boundary file, which
    // resolves (so TypeScript does not fall back to the workspace symlink) and sits
    // outside every rootDir (so including it fails the build).
    const paths = config.compilerOptions.paths;
    expect(Object.keys(paths)).toEqual([
      ...spec.imports.map((dep) => `@portolan/${dep}`),
      '@portolan/*',
    ]);
    const depth = spec.dir.split('/').length;
    expect(paths['@portolan/*']).toEqual([
      `${'../'.repeat(depth)}boundary/there-is-no-arrow-back-up.ts`,
    ]);
    expect(existsSync(here('../boundary/there-is-no-arrow-back-up.ts'))).toBe(true);
  });

  it('keeps the boundary file outside every package rootDir', () => {
    // If it ever moved under a package, including it would stop being an error and
    // the TypeScript half of the enforcement would silently become a no-op.
    for (const [, spec] of workspaces) {
      expect(spec.dir.startsWith('boundary')).toBe(false);
    }
  });
});

describe('the build envelope is fixed, not conventional (AD-43)', () => {
  /**
   * Run the plugin the build actually runs, on the page the build actually ships.
   * Reading vite.config.ts as text and grepping for the policy would stay green if
   * the plugin were dropped from `plugins` or its `apply` flipped away from 'build'.
   */
  const sameOriginOnly = (): Plugin => {
    const plugins = (config.plugins ?? []) as Plugin[];
    const plugin = plugins.find((entry) => entry?.name === 'portolan:same-origin-only');
    expect(plugin, 'the same-origin plugin must be registered in vite.config.ts').toBeDefined();
    return plugin as Plugin;
  };

  it('is applied on build, where the shipped page is produced', () => {
    expect(sameOriginOnly().apply).toBe('build');
  });

  it('puts a same-origin Content-Security-Policy into the built page', async () => {
    const transform = sameOriginOnly().transformIndexHtml;
    const handler = typeof transform === 'function' ? transform : transform?.handler;
    expect(handler).toBeTypeOf('function');

    const html = await handler!.call({} as never, read('../index.html'), {} as never);
    const output = typeof html === 'string' ? html : read('../index.html');

    expect(output).toMatch(/<meta http-equiv="Content-Security-Policy"/);
    for (const directive of [
      "default-src 'self'",
      "script-src 'self'",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
    ]) {
      expect(output).toContain(directive);
    }
    // A policy that admitted another origin would defeat the point of having one.
    expect(output).not.toMatch(/content="[^"]*https?:\/\//);
  });

  it('names no CDN or external origin in the page', () => {
    expect(read('../index.html')).not.toMatch(/https?:\/\//);
  });
});
