---
title: 'Repo skeleton, build envelope and CI gates'
type: 'chore'
created: '2026-09-14'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'ed78a4857322ba56501b9200749d555df1b0de74'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/stack.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository holds planning artefacts and no code. Eleven packages with a
one-directional dependency graph cannot be assembled by convention: two later stories picking two
package managers or two bundlers means nothing builds (AD-43). Nothing gates lint, types or tests,
so every later story would land unverified.

**Approach:** Stand up the `packages/` workspace exactly as the spine's Structural Seed names it,
fix the build envelope once, and wire GitHub Actions to run lint, typecheck and unit tests on every
pull request and on `main`. No product behaviour ships here.

## Boundaries & Constraints

**Always:**
- The package list and dependency direction are the spine's. **No arrow back up, anywhere** —
  enforced, not documented.
- npm workspaces over `packages/`. Vite builds the browser bundle and dev server. The server runs
  from TypeScript compiled ahead of time, never transpiled at runtime (AD-43).
- Node.js 24 LTS; Node 26 is a dated deferral, not something to pre-empt.
- Every dependency AGPLv3-compatible — a gate on adoption, not a later audit (NFR-17).
- The determinism job runs on both `ubuntu-24.04` and `ubuntu-24.04-arm` (AD-32).

**Never:**
- No product behaviour, and no stub a later story would delete rather than fill.
- No image publication: `main` builds without publishing, only a `v*` tag publishes, and that
  belongs to the packaging story (AD-32).
- No CDN, external font, or runtime network fetch (NFR-4) — the envelope must not make one possible.

**Toolchain, decided 2026-09-14:**
- **Vitest** for tests — it shares Vite's config and transform, which the browser packages and the
  later scene assertions (AD-26) need. `node:test` was weighed and set aside: AD-43's *no extra tool*
  reasoning holds for the package manager, but Vite is already in the envelope.
- **ESLint + Prettier.** Chosen for the import-boundary rule specifically; Biome's is thinner and
  might not carry *no arrow back up* on its own. Prettier defers to the existing `.editorconfig`.
- **The dependency direction is enforced twice:** TypeScript project references *and* an ESLint
  import-boundary rule. The spine calls the unenforced graph the defect this envelope exists to
  prevent, so a declarative-only graph would miss the story.

</frozen-after-approval>

## Code Map

Greenfield. Present: `_bmad/`, `_bmad-output/`, `CLAUDE.md`, `.editorconfig`, `.githooks/`,
`.gitattributes`, `.gitmessage`. No `package.json`, no `src`, no `.github/`. Nothing is reused;
nothing existing is restructured.

- `ARCHITECTURE-SPINE.md` -- *Structural Seed* names the eleven packages; *Dependency direction* is
  the import graph; **AD-43** fixes the envelope; **AD-32** the CI matrix and publication trigger.
- `stack.md` -- Node 24 grounding with verification dates; the AGPLv3 filter; `graphology` staleness.
- `.editorconfig` -- already present; the formatter defers to it rather than fighting it.
- `.githooks/` -- already active via `core.hooksPath`; CI must not duplicate the commit-message and
  branch-name rules they already enforce.

Packages, in dependency order: `tokens`, `i18n`, `model`, `collector`, `server`, `layout`, `scene`,
`raster-svg`, `raster-screen`, `view-state`, `chrome`. Plus `harness/`, `fixtures/recorded/`,
`deploy/`, `.github/workflows/`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- root workspace manifest: `packages/*` + `harness`, `engines.node >=24`, and the `lint`/`typecheck`/`test`/`build` scripts CI calls
- [x] `tsconfig.base.json` + per-package `tsconfig.json` -- strict TS with project references mirroring the dependency direction, so an upward import is a compile error
- [x] `packages/<each of eleven>/package.json` + `src/index.ts` -- one empty typechecking package per Seed entry, each declaring only the dependencies its position permits
- [x] `harness/package.json` + `src/index.ts` -- empty workspace; story 6 fills it, the envelope holds it now
- [x] `vite.config.ts` -- browser bundle and dev server, emitting everything with no runtime fetch
- [x] linter config -- rules including an import-boundary rule that fails on an upward import
- [x] `.github/workflows/ci.yml` -- PR and `main`: lint, typecheck, unit tests; determinism job on the two-architecture matrix; later gates named as pending jobs, not silently absent
- [x] `LICENSE` -- AGPLv3
- [x] `.gitignore` -- `node_modules`, build output, coverage
- [x] `README.md` -- the envelope, how to run it, and how the AGPLv3 filter is checked
- [x] one smoke unit test -- proves the runner actually runs in CI; a green CI running nothing is worse than none

**Acceptance Criteria:**
- Given a clean clone, when `npm install && npm run build` runs, then it completes with no error.
- Given a package importing from one above it in the dependency direction, when `npm run lint` or `npm run typecheck` runs, then it **fails**.
- Given a pull request, when CI runs, then lint, typecheck and unit tests execute and report, and the determinism job appears on both architectures.
- Given `npm run typecheck` across all twelve workspaces, then it passes with `strict` enabled.
- Given the dependency tree, when inspected, then every direct dependency is AGPLv3-compatible and the README records how that was checked.

## Implementation Notes

**The dependency direction is data, and both enforcements are generated from it.**
`dependency-graph.json` holds each workspace's complete permitted import set. `eslint.config.mjs`
builds a per-package `no-restricted-imports` rule from it, `vite.config.ts` builds the browser alias
map from it, and `test/envelope.test.ts` asserts every `package.json` and `tsconfig.json` agrees with
it — and that the package list still matches the Structural Seed, so the graph file cannot drift from
the spine unnoticed.

**TypeScript needed a boundary file, not a `paths` mapping that resolves nowhere.** The first
attempt mapped `@portolan/*` to a non-existent directory. It does not work: when a `paths`
substitution fails, TypeScript falls back to normal module resolution, which finds the npm-workspace
symlink in `node_modules` as soon as the target package has been built once. Verified with
`--traceResolution`. The catch-all now points at `boundary/there-is-no-arrow-back-up.ts`, a real file
outside every package's `rootDir`: resolution stops there, and including it is TS6059 at the import
site. That makes the TypeScript half hold on an incremental build, not only on a clean one — which
matters, because a declarative-only graph is exactly the defect the spine says this envelope exists
to prevent.

**TypeScript 6.0, not the seed's 7.0 — a deviation with an expiry.** TypeScript 7.0 ships no stable
programmatic compiler API before 7.1 (the spine's own stack table says so), and `typescript-eslint`
needs that API; its peer range stops below 7.0, and `npm install` refuses the pair outright. The
frozen toolchain note makes ESLint's import-boundary rule the reason ESLint is in the envelope at
all, so the enforcement wins over the newer compiler. The spine labels its stack table *seed, not
spine: the code owns this once it exists*, which is the latitude used here. TypeScript 6.0 is the
newest release the linter supports, is `strict` throughout, and builds the same project references.
Revisit when `typescript-eslint` supports 7.1; the move is a version bump. Recorded in `README.md`.

**Vitest, and the determinism job asserts nothing yet.** `npm run test:determinism` filters on
`determinism` in the filename and passes with no tests, because AD-8's suite arrives with the
`layout` package. The job still runs the two-architecture matrix, and prints a GitHub warning
annotation naming why it is empty, so it cannot be mistaken for a passing gate. The unit-test job is
not empty: `test/envelope.test.ts` is the smoke test and covers the Seed, the dependency direction,
and the no-network-fetch envelope.

**Not created, deliberately:** `fixtures/recorded/` and `deploy/` appear in the spine's Structural
Seed but in neither this story's task list nor its acceptance criteria. Empty directories git cannot
track, held open by a `.gitkeep` a later story would delete, is the stub the Boundaries forbid. They
arrive with the stories that fill them — AD-27 fixtures and the packaging story respectively.

**Beyond the letter of the tasks, and why:** the envelope carries a build-time
Content-Security-Policy admitting only its own origin, an ESLint ban on `fetch`/`XMLHttpRequest`/
`WebSocket`/`EventSource` outside the server package, and `rollupOptions.external: []`. The Never
list asks that the envelope *not make a runtime network fetch possible*, which a bundler
configuration alone does not achieve. The CSP is injected on build only: the dev server needs inline
script for hot reload, and a policy development quietly relaxes would guard nothing.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:** all run on Node 24.13.1 / npm 11.8.0.
- `npm install` -- completes; `package-lock.json` written; no engine warning. `npm ci` from a deleted
  `node_modules` also completes (148 packages).
- `npm run typecheck` -- passes across all twelve workspaces plus `tsconfig.tools.json`, with
  `strict` and `noUncheckedIndexedAccess`/`exactOptionalPropertyTypes` on top.
- `npm run lint` -- `eslint .` and `prettier --check .` both clean.
- `npm test` -- 44 tests in `test/envelope.test.ts`, all passing.
- `npm run build` -- `tsc --build` emits `dist/` for all twelve workspaces (the server's
  ahead-of-time output), then Vite emits `dist/browser/`.
- `npm run licences` -- 136 installed packages checked, all AGPLv3-compatible.
- `npm run dev` -- serves on `127.0.0.1:5173`; `/` returns the page and the chrome entry module
  returns 200.

**Negative checks — both halves of the enforcement, run and reverted:**
- An upward import (`layout` importing `@portolan/scene`) with `dist/` already populated:
  `npm run typecheck` fails with TS6059 at the import site, naming
  `boundary/there-is-no-arrow-back-up.ts`; `npm run lint` fails with the boundary message naming
  what `layout` may import. Both, not one.
- A legal import (`scene` importing `@portolan/layout`) compiles.
- `fetch` in `packages/chrome` fails lint with the NFR-4 message.

**Manual checks:**
- The eleven package names and their order match the Structural Seed exactly — no rename, merge or
  addition. Asserted, not merely inspected: `test/envelope.test.ts` holds the Seed list and compares
  it to `dependency-graph.json`.
- `ci.yml` names the later gates as pending jobs — AD-28 contrast, AD-29 ratchet, AD-30 scene
  generation ratchet, AD-31 browser smoke — each with what it awaits and why it cannot run yet.
- `ci.yml` publishes no image; the determinism job's matrix is `ubuntu-24.04` and `ubuntu-24.04-arm`.
- Nothing in `ci.yml` duplicates the commit-message or branch-name rules already in `.githooks/`.
