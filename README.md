# Portolan

A read-only map of a Docker Swarm cluster: one container, mounted on a manager node,
serving a chart of what is running and how it is wired.

**There is almost no product behaviour in the repository yet.** What is here is the build
envelope — the twelve workspaces, the dependency direction that holds them apart, and
the CI gates that keep later work from landing unverified — plus the design tokens, which
are the one thing everything else is measured against.

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
| Regenerate token CSS   | `npm run tokens:css`      |
| Contrast gate (AD-28)  | `npm run contrast`        |

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

| Workspace       | What it will hold                                                  |
| --------------- | ------------------------------------------------------------------ |
| `tokens`        | All eleven token namespaces, authored in TypeScript; CSS generated |
| `i18n`          | One string catalogue per language                                  |
| `model`         | Graph types, wire form and identity keys, imported by both ends    |
| `collector`     | Docker adapter — GET-only, pinned API version, total ordering      |
| `server`        | HTTP, SSE, last-good-survey cache, healthcheck                     |
| `layout`        | Pure `(model, previousPositions, seed, mode) -> positions`         |
| `scene`         | Model plus positions to a resolution-independent scene             |
| `raster-svg`    | Scene to SVG text                                                  |
| `raster-screen` | Scene to a screen surface                                          |
| `view-state`    | Selection, filters, search, camera, display controls               |
| `chrome`        | React chassis, and only the chassis                                |
| `harness`       | Synthetic cluster generator and measurement harness                |

Each but `tokens` is an empty, typechecking package today. They exist now so the dependency
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

### Design tokens are the source of truth

AD-23: `DESIGN.md` stops being normative on values and becomes the documentation of
intent. Every value the product looks like is authored in `packages/tokens/src/`, and a
literal colour or a literal floor anywhere else in the code is a defect.

**Eleven namespaces, one file each**, so a reviewer can diff a namespace against
`DESIGN.md`'s frontmatter without scrolling: `colour`, `stroke`, `opacity`, `elevation`,
`shape`, `density`, `spacing`, `layout`, `type`, `motion`, `rounded`. Colour alone would
orphan the load-bearing half — `stroke` carries the stub length the AD-29 ratchet
measures, `layout` the 884px operative canvas it measures against, `density` AD-8's
reservation maximum, `shape` the hull geometry AD-8 needs to exist at all.

They are `as const` objects and `type` aliases, nothing else: `erasableSyntaxOnly` is on,
so Node reads the sources directly with type stripping and `tsc` emits them unchanged.
`packages/tokens` imports nothing and has neither Node nor DOM globals, which is why
every generator and every gate lives in `scripts/*.mjs` rather than in the package.

**`colour` is the only namespace with two palettes.** `DESIGN.md`'s convention is
inverted against the usual one — a bare token name is the DARK value and `-light`
carries the light one — so the token file writes the pair out as `{ dark, light }` and
the convention disappears. `packages/tokens/src/colour.test.ts` asserts the full set of
71 pairs against an independently transcribed list of `DESIGN.md`'s names, so a dropped
or invented token fails rather than passing quietly.

**One named departure from `DESIGN.md`:** the twelve zone tints are
`palette-cvd-analysis.md` §5's re-optimised register, not `DESIGN.md`'s shipped values.
Those are the NFR-13 defect — light tints 1 and 3 simulate to a byte-identical `#E2E2EC`
under deuteranopia. The replacement holds the same 1.13–1.19 iso-luminant band and the
same C\* ≤ 12 register, so every edge floor survives; separation goes from 0.00 to 3.81
in light and 1.30 to 3.38 in dark.

#### The CSS is generated, never hand-edited

```
npm run tokens:css              # write packages/tokens/generated/tokens.css
npm run tokens:css -- --check   # fail if the committed CSS drifted from the source
```

All eleven namespaces flatten to `--portolan-*` custom properties. Dark sits at `:root`
because dark is the default and the design target; light is a sibling block under
`:root[data-palette='light']`, because light is first-class rather than derived.

The output is tracked rather than built into `dist/`: `dist/` is gitignored, and a drift
check over an untracked file checks nothing. The generator formats its output with the
project's own Prettier configuration, so the generated file passes `npm run lint` without
anyone having to remember. `--check` names the first property that differs and prints
both values — the diff is the message.

Prose values are emitted as quoted CSS strings rather than bare, because eleven
namespaces of `DESIGN.md` prose carry apostrophes, semicolons and `{token}` references,
each of which would either change what the stylesheet means or stop it parsing. What
stays bare is what a stylesheet actually consumes: hex colours, lengths, numbers,
identifiers and functions.

### NFR-11 and NFR-13 are blocking gates, not promises

AD-28. `npm run contrast` computes, from the token file and nothing else:

1. **Five contrast ratios, in both palettes** — 7:1 identifier channel, 4.5:1 chassis
   text and marks, 4:1 health, 3:1 both edge kinds over the worst composited zone field,
   3:1 focus ring. Exactly those five: widening a blocking gate beyond its contract is
   how gates get disabled.
2. **Every declared exemption, at the floor that still applies to it.** An exemption is
   never a skip. The bubble contour is exempt from the edge floor where it crosses a zone
   — a body's own outline is not an edge — and is still held to 3:1 over the canvas. The
   health mark under the full staleness veil is held to `DESIGN.md`'s 2.1:1 rather than
   its bare 4:1.
3. **NFR-13 zone separation** — minimum pairwise ΔE00 between the six zone tints as
   simulated by Viénot–Brettel–Mollon (1999), under deuteranopia **and** protanopia, in
   both palettes, against a ratified threshold of 3.0.

Every floor, every exemption and the threshold are **data** in
`packages/tokens/src/floors.ts`. AD-28 requires that: a floor hard-coded in the gate
would make the test the thing design has to edit. The gate measures and reports; it
decides nothing.

The colour arithmetic in `scripts/colour.mjs` is a **port**, not a dependency — sRGB
transfer, WCAG relative luminance, the CVD simulation, CIELAB and a complete CIEDE2000.
The maths has no named dependency anywhere in the stack, and a gate should not widen the
AGPLv3 filter's surface to compute a ratio. `test/colour.test.ts` drives the port against
`palette-cvd-analysis.md`'s published figures rather than against its own output: if the
port disagrees with the document, the gate is measuring something else.

**The gate currently fails, and AD-28 calls this kind of red the gate working.**
`pastille-network-1` and `pastille-network-3` measure 4.45:1 and 4.39:1 on `body-mid` in
the dark palette, against the 4.5:1 floor `DESIGN.md`'s own _Network pastille on body_
row declares — a row that prints its measured range as **4.4 – 5.2** and never
reconciles the low end with the floor above it. It is a real miss, it predates this
story, and nothing here may repair it: the values belong to design. See
`_bmad-output/implementation-artifacts/deferred-work.md`.

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
- **contrast and deuteranopia (AD-28)** — the token-CSS drift check and the NFR-11 /
  NFR-13 gates
- **determinism**, on both `ubuntu-24.04` and `ubuntu-24.04-arm`

`main` builds the image without publishing it, and only a `v*` tag publishes. That
workflow belongs to the packaging story and is deliberately absent, not forgotten.

The gates that cannot exist until the packages they measure do are named in the workflow
as pending jobs rather than left silently out, so a reader sees what is still coming:
the AD-29 measurement ratchet, the AD-30 scene generation ratchet, and the AD-31 browser
smoke and chassis accessibility suite.

AD-28 was the fourth of those and is now real. Its pending entry said it awaited
`packages/scene` as well as `packages/tokens`; that was wrong about why. The gate needs
to know the worst _composited_ zone field, and `opacity.zone-field-cap` clamps that
composite to a single tint — so the worst case is a loop over six tints, computable from
colour values alone. The scene resolves the composite for rendering (AD-9); the gate
never needed it to know what the worst one is.

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
