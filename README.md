# Portolan

A read-only map of a Docker Swarm cluster: one container, mounted on a manager node,
serving a chart of what is running and how it is wired.

**There is no product behaviour in the repository yet.** What is here is the build
envelope — the twelve workspaces, the dependency direction that holds them apart, and
the CI gates that keep later work from landing unverified.

## Requirements

Node.js 24 LTS or newer. Nothing else: npm workspaces ship with Node, and everything
the browser needs is emitted into the bundle.

## Commands

| Task                   | Command                   |
| ---------------------- | ------------------------- |
| Install                | `npm install`             |
| Dev server             | `npm run dev`             |
| Build                  | `npm run build`           |
| Typecheck              | `npm run typecheck`       |
| Typecheck from scratch | `npm run typecheck:clean` |
| Test                   | `npm test`                |
| Lint                   | `npm run lint`            |
| Format                 | `npm run format`          |
| Licence gate           | `npm run licences`        |

`npm run build` compiles every workspace ahead of time with `tsc --build` — the server
runs from that output and is never transpiled at runtime — and then bundles the browser
with Vite into `dist/browser`.

## The envelope

Fixed once, deliberately, because eleven packages with a one-directional dependency
graph cannot be assembled by convention (AD-43).

| Concern                | Choice                                                        |
| ---------------------- | ------------------------------------------------------------- |
| Runtime                | Node.js 24 LTS                                                |
| Package manager        | npm workspaces over `packages/*` and `harness`                |
| Language               | TypeScript, `strict`, project references (see the note below) |
| Bundler and dev server | Vite                                                          |
| Test runner            | Vitest — one config, one transform, shared with the bundler   |
| Lint and format        | ESLint and Prettier; Prettier defers to `.editorconfig`       |
| CI                     | GitHub Actions, `ubuntu-24.04` and `ubuntu-24.04-arm`         |
| Licence                | AGPLv3, and every dependency must be compatible with it       |

### Workspaces

Eleven packages under `packages/`, in the order the architecture's Structural Seed
names them, plus `harness/`:

| Workspace       | What it will hold                                               |
| --------------- | --------------------------------------------------------------- |
| `tokens`        | All token namespaces, authored in TypeScript; CSS generated     |
| `i18n`          | One string catalogue per language                               |
| `model`         | Graph types, wire form and identity keys, imported by both ends |
| `collector`     | Docker adapter — GET-only, pinned API version, total ordering   |
| `server`        | HTTP, SSE, last-good-survey cache, healthcheck                  |
| `layout`        | Pure `(model, previousPositions, seed, mode) -> positions`      |
| `scene`         | Model plus positions to a resolution-independent scene          |
| `raster-svg`    | Scene to SVG text                                               |
| `raster-screen` | Scene to a screen surface                                       |
| `view-state`    | Selection, filters, search, camera, display controls            |
| `chrome`        | React chassis, and only the chassis                             |
| `harness`       | Synthetic cluster generator and measurement harness             |

Each is an empty, typechecking package today. They exist now so the dependency
direction is enforced before anything imports anything.

### There is no arrow back up

`dependency-graph.json` holds the architecture's dependency direction as data: for each
workspace, the complete set of Portolan packages it may import. It is the single source
the enforcement is generated from, and it is enforced twice — because the architecture
calls an unenforced graph the defect this envelope exists to prevent.

1. **ESLint.** `eslint.config.mjs` builds a `no-restricted-imports` rule per workspace
   from the graph. An undeclared `@portolan/*` import, or a relative path out of the
   package, is an error with a message naming what that package may import.
2. **TypeScript.** Each package's `tsconfig.json` carries project `references` and a
   `paths` allowlist. Anything outside the allowlist resolves to
   `boundary/there-is-no-arrow-back-up.ts`, which sits outside every package's
   `rootDir`, so the build fails on an incremental run as well as a clean one.

The second half needs that boundary file rather than a mapping that resolves nowhere: a
failed `paths` substitution makes TypeScript fall back to normal resolution, which finds
the workspace symlink in `node_modules` as soon as the other package has been built once.

`test/envelope.test.ts` asserts that every `package.json` and `tsconfig.json` agrees with
the graph, and that the package list still matches the Structural Seed. Editing one
without the others fails the test. `test/boundaries.test.ts` goes further and lints real
source through the real config: an upward import — bare or by subpath — must be reported,
and a permitted one must not.

Adding a permitted edge means editing `dependency-graph.json`, the importing package's
`dependencies` and its `tsconfig.json` `references` and `paths` — and the architecture
first, since the graph is the architecture's, not the code's.

### Nothing reaches the network at runtime

NFR-4: no CDN, no external font, no runtime fetch. The envelope is built so that one
cannot be added quietly.

- Vite marks nothing as external. This is stated explicitly in `vite.config.ts` so the
  intent is visible where someone would add an entry, but it is Rollup's default for an
  app build and **is not a guard** — it cannot fail. NFR-4 is actually held by the two
  items below.
- The production page carries a Content-Security-Policy admitting only its own origin,
  injected at build time. It is not applied to the dev server, which needs inline script
  for hot reload — a policy that development quietly relaxes would guard nothing.
- ESLint refuses `fetch`, `XMLHttpRequest`, `WebSocket` and `EventSource` — named bare
  or reached through `globalThis`, `window` or `self` — everywhere except
  `packages/server`, the one package permitted to speak HTTP directly. That exemption
  is derived from the network entries alone, so any other restricted global or syntax
  rule added later still applies to the server.
- `index.html` names no external origin.

`test/envelope.test.ts` runs the CSP plugin on the real `index.html` and asserts the
policy lands in the output, and `test/boundaries.test.ts` lints source through the real
`eslint.config.mjs` — so dropping either guard fails a test rather than shipping quietly.

### AGPLv3 compatibility is a gate, not an audit

NFR-17 makes licence compatibility a condition of adopting a dependency, so it runs in
CI on every pull request rather than as a review someone does later.

```
npm run licences              # every installed package
node scripts/check-licences.mjs --direct   # the root's direct dependencies only
```

`scripts/check-licences.mjs` reads the `license` field of every manifest under
`node_modules`, resolves SPDX `OR` and `AND` expressions, and fails on anything outside
its allowlist. The allowlist holds permissive licences and the copyleft licences the FSF
lists as GPLv3/AGPLv3-compatible; it is in the script, with the rule that a new entry
arrives with the reason it is compatible. A dependency with no `license` field is
rejected, not assumed.

The current tree passes: every installed package is MIT, ISC, Apache-2.0, BSD or
equivalent. Portolan itself is AGPL-3.0-or-later (`LICENSE`).

## CI

`.github/workflows/ci.yml`, on every pull request and on `main`:

- **lint**, **typecheck**, **unit tests**, **build**, **AGPLv3 compatibility**
- **determinism**, on both `ubuntu-24.04` and `ubuntu-24.04-arm`

`main` builds the image without publishing it, and only a `v*` tag publishes. That
workflow belongs to the packaging story and is deliberately absent, not forgotten.

The gates that cannot exist until the packages they measure do are named in the workflow
as pending jobs rather than left silently out, so a reader sees what is still coming:
the AD-28 contrast and deuteranopia gate, the AD-29 measurement ratchet, the AD-30 scene
generation ratchet, and the AD-31 browser smoke and chassis accessibility suite.

The determinism job runs the two-architecture matrix today and asserts nothing: the AD-8
suite arrives with the `layout` package, and until it does the job prints a warning
annotation saying so. Nothing else in CI passes with no tests.

Commit-message and branch-name rules are enforced by the versioned hooks in `.githooks/`,
not by CI. Activate them once per clone:

```
git config core.hooksPath .githooks
```

## Note on the TypeScript version

The architecture's stack table — explicitly seed, not spine — names TypeScript 7.0. The
envelope is on TypeScript 6.0 instead, for a reason that will expire.

TypeScript 7.0 is the native compiler and ships no stable programmatic compiler API
before 7.1. `typescript-eslint` needs that API, and declares a peer range that stops
below 7.0. The import-boundary rule is why ESLint is in the toolchain at all, so the
choice is between the newest compiler and the enforcement the architecture asks for.
The enforcement wins. TypeScript 6.0 is the newest release the linter supports, is
`strict` throughout, and builds the same project references.

Revisit when `typescript-eslint` supports TypeScript 7.1. The move is a version bump.

## Licence

GNU Affero General Public License v3.0 or later. See `LICENSE`.
