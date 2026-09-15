---
title: 'The shared graph model package'
type: 'feature'
created: '2026-09-15'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '3d849d791e54a15cd8f487a759f6738b91d78f5d'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/architecture-decisions.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Eleven packages sit on two sides of one seam and nothing yet says what a service, a
network or a container *is*. Story 1 stood `packages/model` up empty. Until it holds the graph types
the collector has nothing to fill and the layout has nothing to read, and AD-42 names the sharper
half: shared types alone guarantee nothing across the SSE boundary, so the server serialises one way,
the client reconstructs another, and AD-4's *one definition* holds only in the type checker.

**Approach:** Author the six object kinds, the edges between them, the AD-5 identity keys, the
AD-6 identity-seeded silhouette and the declared wire form with both conversions and a round-trip
test, in one package that imports nothing and holds nothing across calls.

## Boundaries & Constraints

**Always:**
- Every identity key is **qualified by object kind** (AD-5). `volume:web` and `network:web` are two
  objects; an unqualified key would make them one, with one silhouette and one cell. Within a kind:
  replicated task `stack/service/slot`, global task `stack/service/node`, volume and network by name,
  node and service by Docker ID. The key is the sort order (AD-7), the silhouette seed (AD-6) and the
  only thing picking sends upward (AD-36) — one format per kind, used for all three.
- **Every graph type has a wire representation, or it is not admissible in the model** (AD-42). Both
  directions of the conversion live in this package and nowhere else, with a model → wire → model
  round-trip test.
- **Health is counted facts** — `running` and `desired`, never a verdict (FR-12, FR-72). An object with
  no health dimension carries no health value at all: absence is the fourth value, so it is the
  dimension's absence from the type, not a null.
- **Docker's node and task status travel as raw facts** — node availability (`active` / `pause` /
  `drain`), node state (`ready` / `down`), and a task's desired versus actual state. *Decided, not
  derived from a requirement:* no document assigns node or container a health dimension, and omitting
  them would leave a drained or unreachable node reading exactly like a healthy one on a map whose
  whole promise is honesty. They are **facts for FR-25's factual panel only** — no health mark, no
  colour, no classification, and FR-12 keeps its three counted values untouched.
- **The silhouette ships as the seed alone** — the closed 28-point Bézier contour at ±11% of base
  radius, a pure function of the identity key, with no neighbour and no position as input. *Decided:*
  that is what story 3's contract cites (AD-6). The link-driven deform, its cos² falloff and the
  reservation hull are AD-38's and stay this package's to own, but land in story 4, where the layout
  first needs to place against them.
- An **image is an attribute of a container, never an entity** (FR-7).
- This package **imports nothing** and **holds nothing across calls** (AD-2, `dependency-graph.json`).
- Vocabulary is Docker's and is never renamed or prettified (FR-80, CAP-22).

**Never:**
- No positions, no camera, no reading level, no presentation state, no masking, no colour. AD-2 and
  AD-41 put those in `layout`, `view-state`, `scene` and the screen rasteriser; a model that knows any
  of them is the defect AD-38 exists to prevent.
- No `Map`, `Set`, class instance or cyclic reference in the wire form (AD-42), and none reachable
  from a model type without a declared conversion.
- **No dependency added.** The AGPLv3 filter is a gate on adoption, not a later audit (NFR-17), and
  story 2 added none.
- Do not implement AD-38's other model-owned derived values — the link-driven deform and reservation
  hull (FR-13, FR-70), network hue and octave (FR-65), the orphan set and count (FR-35, FR-74),
  transitive reach at N hops (FR-22, FR-23). AD-38 fixes their owning **package**, not their delivery
  date; they land with the consumers that need them. The types must leave room for them: a network
  must carry what creation order is derived from, and the seeded contour must be a value the deform
  can later extend rather than a shape baked flat.
- Do not invent a status, a threshold or a classification the PRD does not name. CAP-7 is the
  product's only classification.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Replicated task key | stack `blog`, service `web`, slot `3` | `container:blog/web/3` | N/A |
| Global task key | stack `infra`, service `agent`, node `n7` | `container:infra/agent/n7` | N/A |
| Standalone service task | service `adhoc`, no stack, slot `1` | key with an empty stack segment, `container:/adhoc/1` | N/A |
| Same name, two kinds | volume `web` and network `web` | two distinct keys, two distinct silhouettes | N/A |
| Sort order | any collection, any input order | ordered by identity key under one exported total-order comparator | N/A |
| Wire round trip | any survey | `fromWire(toWire(s))` deep-equals `s` | N/A |
| Malformed payload | SSE text with a missing field, a wrong type, or a duplicate key | rejected, naming the path that failed | throws, never a partial survey |
| Silhouette determinism | one identity key, called twice, in two processes | byte-identical contour | N/A |
| Health absent | a volume or a network | no health value on the type at all | N/A |
| Drained node | node reporting `ready` / `drain` | both carried as facts; no health value, no mark | N/A |

</frozen-after-approval>

## Code Map

- `packages/model/{package.json,tsconfig.json,src/index.ts}` -- the empty package story 1 stood up.
  `src/index.ts` still reads *"Empty by design. Story 1 …"* and must be replaced. **`tsconfig.json`
  lacks two things `packages/tokens/tsconfig.json` has** and needs both: `"exclude":
  ["src/**/*.test.ts"]`, without which a colocated test and its `vitest` import are emitted into
  `dist/`; and `allowImportingTsExtensions` + `rewriteRelativeImportExtensions` if `./x.ts` specifiers
  are used — otherwise write `./x.js`. Keep `types: []`, `paths` exactly `{ "@portolan/*":
  ["../../boundary/there-is-no-arrow-back-up.ts"] }`, and no `@portolan/*` dependency.
- `packages/tokens/src/shape.ts` -- **normative on the silhouette.** `bubble.silhouette` fixes the
  geometry (closed cubic Bézier, 28 control points), the amplitude (±11% of base radius) and the seed
  (the AD-5 identity key, superseding `DESIGN.md` and FR-13); `bubble.deform` fixes the deform rule,
  falloff, cap and reservation; `bubble.core` the invariant rectangle the contour may never cross;
  `bubble.radius` the base radii. Read values from here, invent none.
- `ARCHITECTURE-SPINE.md` -- AD-5 (keys, verbatim rule), AD-6 (seed), AD-7 (total order), AD-38 (the
  derived-value owner table), AD-42 (wire form), *Core entities* (the ER diagram), *Consistency
  Conventions* (one key format per kind; the survey timestamp travels in the payload).
- `prd.md` -- FR-6 to FR-13, FR-25 (the panel's factual fields: IPs, image tags, mounts, placement),
  FR-49 to FR-52 (what is an IP or a CIDR and therefore maskable *elsewhere*), FR-72, FR-80.
- `DESIGN.md` / `EXPERIENCE.md` -- the only places individual attributes are named: node role and IP
  under the node-view header, the network CIDR under the zone label, the volume chip with its path and
  `rw`/`ro` flag, the `3/5 replicas running.` panel line, `nginx:1.25-alpine` as an image tag.
- `packages/tokens/src/{index,colour,floors}.ts` -- the house style to match exactly: `//` file header
  naming the AD and *why*, `export const x = {…} as const`, `interface` with `readonly` members,
  derived `export type … = keyof typeof …`, no enum and no class (`erasableSyntaxOnly`), and an
  `index.ts` that re-exports type-first then value (`verbatimModuleSyntax`).
- `packages/tokens/src/colour.test.ts` -- the colocated-test style: `import { describe, expect, it }
  from 'vitest'`, lowercase prose names, `it.each` for table cases, and story 2's rule that
  expectations are re-derived independently rather than generated from the code under test.
- `eslint.config.mjs` -- `side: 'shared'` gives this package **only `globals.es2024`**: no `process`,
  no `fetch`, no DOM, in sources and colocated tests alike. `consistent-type-imports` is an error.
- `test/envelope.test.ts` -- asserts existence, the `@portolan/*` dependency set, tsconfig
  `references` and `paths`. It checks no file list, so new sources break nothing; do not add a
  `paths` entry.
- `test/boundaries.test.ts` -- already uses `@portolan/model/graph` as a lint fixture. That is a
  synthetic string, **not** a subpath export to honour.
- `README.md` -- `### Workspaces` ends *"Each but `tokens` is an empty, typechecking package today"*,
  which stops being true. Story 2's convention: a package with real content gets its own `###` section
  under `## The envelope`, titled as a claim, naming the decision it implements and the test that
  enforces it.
- `.github/workflows/ci.yml` -- no change. The `pending` matrix names neither this package nor a wire
  round trip, and the `determinism` job's comment already says the AD-8 suite lands with `layout`.

## Tasks & Acceptance

**Execution:**
- [x] `packages/model/src/identity.ts` -- the kind-qualified key: the builders per kind, the parser, and the one exported total-order comparator -- AD-7 is unenforceable unless the collector sorts with the same function the model seeds and looks up with
- [x] `packages/model/src/graph.ts` -- the six object kinds and their attributes, including the node and task status facts and the service's `running`/`desired` counts -- one file so a reviewer diffs the six against FR-6, FR-25 and the ER diagram without scrolling
- [x] `packages/model/src/edges.ts` -- the edge kinds with their cardinality, the attachment/mount distinction FR-31 filters on, and the mount's path and `rw`/`ro` flag on the edge rather than on the volume -- one volume mounted by two containers has two paths
- [x] `packages/model/src/survey.ts` -- the survey envelope carrying the timestamp staleness is computed from -- the spine puts the timestamp in the payload, and the payload is this package's wire unit
- [x] `packages/model/src/silhouette.ts` -- the seeded contour alone: identity key to a closed 28-point Bézier at ±11% of base radius, deterministic, no neighbour and no position as input -- AD-6; the values come from `shape.bubble` and the deform is story 4's
- [x] `packages/model/src/wire.ts` -- the wire types and both conversions, `fromWire` validating an untrusted payload -- AD-42, and the SSE text is untrusted by construction
- [x] `packages/model/src/index.ts` -- replace the story-1 stub; re-export the surface, type-first -- the package-level header is where the AD-4/AD-42 argument is written down
- [x] `packages/model/src/identity.test.ts` -- the matrix's key rows, both kinds of task, the two-kinds-one-name collision, and the comparator's totality -- colocated, inside the `shared` sandbox
- [x] `packages/model/src/wire.test.ts` -- the AD-42 round trip on a fixture survey exercising every type, plus each malformed-payload row -- AD-42 asks for this test by name
- [x] `packages/model/src/silhouette.test.ts` -- determinism across calls, and that the contour never crosses `shape.bubble.core` -- the floor `shape.ts` states
- [x] `packages/model/tsconfig.json` -- add `exclude` for tests, and the two TS-extension options if `./x.ts` specifiers are used -- otherwise the emitted package carries a test and a `vitest` import
- [x] `README.md` -- a new `###` section under `## The envelope`, and correct the `### Workspaces` sentence -- story 2's convention

**Acceptance Criteria:**
- Given the six kinds, when each is read against FR-6, FR-25 and the spine's ER diagram, then every attribute those name is present, and every attribute present is traceable either to the requirement that demands it or to the node-and-task-status decision in Boundaries — nothing else is invented.
- Given a survey assembled in any order, when sorted with the exported comparator, then the order is total, stable and independent of input order, and two objects never compare equal unless they are the same object.
- Given the silhouette, when it is asked for the same identity key twice, then it returns the identical contour, and it depends on no clock, no `Math.random` and no neighbour.
- Given `npm run typecheck`, `npm run lint` and `npm test`, then all pass, story 1's and story 2's suites unchanged, with no dependency added and `npm run licences` still clean.
- Given `npm run build`, then `packages/model/dist` contains no test file and no `vitest` import.

## Implementation Notes

**Decisions taken inside the boundaries, each with its reason.**

- **`stack` is keyed by name.** AD-5's table names five kinds and not the stack, because a
  stack is a Compose namespace rather than a Docker object and has no ID to be keyed by.
  Its name is what an admin types (FR-80), so `stack:<name>` is the only available format
  and it keeps *one key format per kind* true. Annotated at `stackKey`.
- **A container's third key segment is `instance`, not `slot`.** The key alone cannot tell
  a replicated task's slot from a global task's node, and nothing needs it to — the key IS
  the identity. `Service.mode` is where the distinction lives when a consumer wants it.
- **The slot, the stack and the service are not duplicated onto `Container`.** They are the
  key's own segments; `parseIdentityKey` is the one reader (AD-38 forbids a second copy of
  a derived value). Membership in a stack and in a service is edges, not attributes.
- **The IP is on the attachment edge, not on the container.** A container has one address
  per network it is attached to, so an `addresses` array on the object would lose which
  address belongs to which network — the same argument the story makes for the mount path.
  FR-49's maskable values are therefore exactly three fields: `Node.address`,
  `Network.subnets`, `AttachmentEdge.address`.
- **`Volume` carries only its name.** Where it is mounted and how is the mount edge; which
  node hosts it is the ER diagram's `NODE ||--o{ VOLUME` edge. No document asks a volume
  for anything else, so nothing else is there.
- **Five edge kinds, with the cardinality as data.** `EDGE_RULES` transcribes the ER
  diagram row by row, and `fromWire` validates an untrusted payload's endpoints against
  that table rather than against a second copy of it inside the validator.
- **`fromWire` also checks that a key agrees with the object it sits on** — `volume:web` on
  an object named `renamed` is rejected. The two ends disagreeing about identity is exactly
  the failure AD-42 exists to catch, and it costs one comparison. A container is the one
  exception: its key cannot be rebuilt from its own fields, so only the kind is checked.
- **`WireFormMatchesModel` is a type-level assertion, not a test.** A round-trip test only
  ever sees the fields its fixture was written with, so it cannot catch a field added to
  `Survey` and not to `WireSurvey`. The assertion stops the build on the day the drift is
  introduced; it was mutation-checked by adding a field to `WireVolume` and confirming the
  compile fails at that line.
- **The silhouette's seed is FNV-1a with `Math.imul`.** Integer-only, so the 32 bits are
  identical in every engine on every architecture — which is what makes AD-6's *byte-
  identical in two processes* true rather than hoped for. The amplitude resolves to one of
  2001 steps across the full ±11% band.
- **The contour's 28 bearings are literal constants built from seven magnitudes by exact
  sign and swap**, so the star is exactly symmetric rather than symmetric to within a unit
  in the last place, and no transcendental is computed one stage upstream of AD-8's ban.
- **The segments are uniform Catmull–Rom expressed as cubic Béziers** (`p1 + (p2−p0)/6`),
  which interpolates its control points — the closed curve passes through all 28, so the
  seeded radii *are* the contour rather than a suggestion, and the arithmetic is `+ - * /`.
- **No smoothing pass was added.** It was measured and rejected: the raw ±11% jitter joined
  by the Bézier already reads as an irregular contour, and a smoothing step would be a
  value no document sets.
- **The core floor holds with margin, and it was measured rather than assumed.** Over 600
  keys, sampling each of the 28 segments at 65 parameters, the closest approach to the
  invariant rectangle is ~4.5% outside it. `silhouette.test.ts` asserts the floor over that
  sweep, at all three base radii on the fixture set, and mutation-checks the check itself.
- **The silhouette is not on the wire.** It is a pure function of the identity key, so
  sending it would be sending a value the receiver can recompute exactly — a second copy of
  a derived value, which AD-38 calls a defect however small the duplicate looks.

**Added at the matrix audit — golden contour digests.** The matrix's silhouette row asks for
byte-identity *in two processes*, and neither determinism test reached that far: both re-derive
their expectation inside the run they are checking, so both would agree with a contour that had
moved. Seven digests — FNV-1a over `JSON.stringify(silhouette(key, r))`, computed once on
2026-09-15 and committed — are the only form the claim can take, because the process that made
them has exited. They pin every number in the contour at once: the 28 transcribed bearings, the
seeded amplitudes, the Catmull–Rom control points and the core rectangle. Mutation-checked by
changing one bearing constant by a single unit in the last place, which fails all seven.

This also closes the risk named above it: the `shape.ts` constants are transcribed rather than
imported, and nothing in CI would otherwise have caught a divergence. A drift now fails the build.
A failure here is never a number to update — it means the contour moved, and with it every
silhouette a user has learned to recognise (AD-6).

**Verification run:** `npm run typecheck`, `npm run lint`, `npm test` (460 tests, 10 files,
story 1's and story 2's suites unchanged), `npm run build`, `npm run licences` (136 packages,
unchanged, no dependency added). `packages/model/dist` holds 28 emitted files — seven
modules times `.js`, `.js.map`, `.d.ts`, `.d.ts.map`, plus `.tsbuildinfo` — with no `*.test.js` and no
`vitest` import; the emitted specifiers are `./x.js`. (The count read "twelve" until the review
caught it; the substantive claims beside it were correct.)

## Spec Change Log

**2026-09-15 — two frozen decisions renegotiated by the human, after the story was marked done.**

- **The wire form now carries a schema version.** This spec froze a wire form with none, and
  nothing upstream asks for one. The case that reopened it: server and browser ship in one image
  (AD-19) and therefore agree by construction, *except* across an upgrade, where a tab left open
  reconnects its SSE stream to a server built from different sources and misparses in silence —
  on a product whose central promise is that the map never lies about the cluster. Known-bad
  state avoided: adding the field once story 9 needs it would be an amendment to a contract this
  story had frozen, on both sides of the seam at once. **KEEP:** `WireSnapshot` stays
  structurally identical to `Survey` and `WireFormMatchesModel` stays exact on it — the version
  went onto `WireSurvey`, which extends it. The model carries no protocol field, and
  `fromWire` reads the version *first*, so a stale tab fails on the upgrade rather than on a
  collection it is wrongly told is malformed.
- **The transcription of `shape.bubble` is now gated, not manually checked.** The human first
  decided `model` should import `tokens` outright, so AD-38's one owner would read AD-23's one
  source. That turned out to be unimplementable as stated, and the finding is worth recording:
  **`tokens`' `shape` namespace is authored as prose, not as values** — `'closed cubic Bézier,
  28 control points'`, `'±11% of base radius'`, `'54px'`. Importing it yields sentences, so the
  graph amendment would have bought nothing and cost an arrow. The decision was remade as
  `test/shape-transcription.test.ts`, which extracts the four numbers from the prose and fails
  in both directions. `dependency-graph.json` is untouched and `model` keeps `imports: []`.
  **KEEP:** the transcription itself, and the AD-8 reasoning behind the 28 literal bearings —
  the review found no fault there, and the gate now protects it instead of a manual read.
- **Raw control bytes removed from `wire.ts` source.** `edgeIdentity` embedded literal U+0000
  separators and a U+0001 marker. The separator choice is sound and unchanged; written as
  escapes, the file stops being binary to `file`, `grep` and git diffs. Behaviour identical.

## Review Triage Log

**Pass 1 — blind-hunter, edge-case-hunter, verification-gap.**

- `high` — **The invariant core is measured from the seeded hull, not the undeformed box.**
  `shape.pastille.capacity` pins *undeformed bounding box* to `2·baseRadius` by its own arithmetic
  (0.59 x 2r = 63.7 / 54.3 / 37.8px). Measured at r=46 the core half-width should be 27.14 for every
  object; it is 27.01 for `network:frontend` and 29.05 for `volume:pgdata` — a 7.5% spread, always
  wider than specified. The rail capacity `shape.ts` computes is therefore wrong per object. The
  covering test re-derives its expectation from the same seeded points, so it agrees with the defect
  by construction. Grouped with: the bounding box ignores Catmull-Rom overshoot, and initialises its
  extents to 0 rather than +/-Infinity.
- `medium` — **`fromWire` under-validates the edge list.** Confirmed by running it: two `hosts` edges
  onto one volume are accepted though `EDGE_RULES.hosts.cardinality` is `one-to-many`; an identical
  edge repeated is accepted; and an edge whose endpoints name objects in no collection is accepted
  against empty collections. `cardinality` is declared, exported and read nowhere, while the file
  header claims it is what the validator checks against. A dangling endpoint is what a later
  reachability walk traverses into.
- `medium` — **Timestamps are validated by shape only.** `2026-13-45T99:99:99Z` is accepted and
  `Date.parse` of it is `NaN`. `takenAt` is the one value FR-5 computes staleness from.
- `medium` — **`edges.ts` and `survey.ts` ship with no test.** Pre-verified by the verification-gap
  layer with three surviving mutations: deleting the mount tie-break in `compareEdges`, dropping the
  `containers` sort in `sortSurvey`, and removing `...survey.stacks` from `surveyObjects` each leave
  typecheck and all 460 tests green. This is the acceptance criterion on total, input-independent
  order, unguarded. Grouped with: `compareEdges` conflates an absent address with `''`, the case its
  own doc comment says it exists to prevent.
- `medium` — **The AD-42 drift guard is blind to optional fields.** Pre-verified: adding
  `readonly propagation?: string` to `MountEdge` and not to `WireMountEdge` compiles and passes,
  while `toWire` silently drops it. Mutual assignability does not separate optional keys, and the
  model already uses one (`AttachmentEdge.address?`), so the class is live rather than theoretical.
- `medium` — **The two-architecture determinism job runs nothing.** Pre-verified: `test:determinism`
  is `vitest run --passWithNoTests determinism`, a filename filter that matches no file, so the
  `ubuntu-24.04-arm` leg asserts zero while the golden digests claim byte-identity *on every
  architecture*. They run only on the single-arch unit job.
- `medium` — **The `dist` acceptance criterion is checked by hand alone.** Pre-verified: deleting
  `exclude` from `packages/model/tsconfig.json` restores the defect — `wire.test.js` with a top-level
  `vitest` import inside a package whose `files` is `["dist"]` — with lint, typecheck, build and all
  460 tests green. `test/envelope.test.ts` reads `references` and `paths` and never `exclude`.
- `medium` — **Two assertions that cannot fail.** `wire.test.ts`'s *prefixes every rejection* calls
  `fromWire` in a bare `try` with its expectations only in the `catch`, so a row that stopped throwing
  would pass silently; one row's `corrupt` is already a no-op.
- `medium` — **The identity builders accept what the parser rejects.** `volumeKey('-leading')`
  returns a value typed `IdentityKey` for which `isIdentityKey` is `false`. The collector can mint a
  key its own `fromWire` rejects at the far end of the seam.
- `low` — **`identityKind` contradicts its own contract.** Documented as reading the kind *without
  parsing its body*; it calls `parseIdentityKey`, allocates, and throws on a key whose static type
  says it is well formed. It is the function AD-36's picking path calls per hit. Grouped with:
  `silhouette.ts` says *seven distinct magnitudes* where the table uses eight.
- `false` — **Unknown wire fields and unknown collections are silently dropped.** The premise is
  version skew across the seam, and CAP-23 rules it out by construction: one image serves both the
  server and the browser bundle it talks to, so sender and receiver are always the same build. There
  is no deployment in which one end is ahead of the other.
- `low`, rejected — **Model types permit values their own wire form rejects** (`name: ''`,
  `emptySurvey('nonsense')`). Docker cannot issue an empty object name, so no survey a collector
  builds reaches it; the fix is branded strings or a shared validator, which is public surface rather
  than a direct correction.
- `low`, rejected — **`silhouette` does not guard a zero, negative or non-finite `baseRadius`.** No
  caller exists and none was shown reachable; the fix adds a guard on a hot path for a state never
  demonstrated.
- rejected — **The verification record says twelve emitted files where `dist` holds 28.** True, and
  the fix edits this build's spec. Corrected in place as a record-keeping matter rather than routed.
- `medium`, deferred — **`running > desired` matches none of FR-12's three readings.** Swarm reports
  it transiently during a rolling update, so rejecting it at the wire would refuse a real cluster; the
  model storing the counted pair faithfully is correct. The missing branch belongs to the story that
  draws the health mark, and the enumeration it is missing from is the PRD's.

## Design Notes

**Why the model is wire-representable by construction.** AD-42 asks that every type have a wire
representation. The strongest form of that is a model whose types are already JSON values — plain
objects and arrays, no `Map`, no `Set`, no class, no back-reference — so the two forms differ in
validation rather than in shape. `toWire` is then near-identity and `fromWire` earns its keep: the SSE
payload is untrusted text, so it parses, checks and rejects, naming the failing path. Written the
other way round — a rich in-memory model with `Map` indices — the round-trip test passes and the
conversion becomes the place the two ends drift, which is exactly what AD-42 forbids.

**Why the identity key needs no escaping.** Docker restricts object names to
`[a-zA-Z0-9][a-zA-Z0-9_.-]*`, so neither `/` nor `:` can occur in a stack, service, volume or network
name, and node and service IDs are alphanumeric. The separators are therefore unambiguous without
escaping, and the parser can assert that rather than defend against it. A standalone service has no
stack and takes an empty first segment, which no stack name can collide with.

**Why the transcendental ban reaches this package.** AD-8 bans `Math.cos` and its kin inside `layout`
so determinism survives Chromium, Firefox and Safari without a test proving it. The silhouette is an
*input* to layout's reservation, so a transcendental here defeats the ban from one stage upstream. It
is avoidable: the 28 control points sit at fixed angles, so their sines and cosines are 28 literal
constants; and if the deform lands here, `cos²` of the angle between a control point and a link
bearing is `(a·b)² / (|a|²|b|²)` — `+ - * /` and `Math.sqrt` only.

## Verification

**Commands:**
- `npm run typecheck` -- expected: passes across all twelve workspaces plus `tsconfig.tools.json`
- `npm run lint` -- expected: `eslint .` and `prettier --check .` both clean
- `npm test` -- expected: story 1's and story 2's suites unchanged, plus the new colocated suites
- `npm run build` -- expected: passes; inspect `packages/model/dist` for any `*.test.js` or `vitest` import
- `npm run licences` -- expected: unchanged count, no dependency added

**Manual checks:**
- Each of the six kinds read side by side against FR-6, FR-25, the ER diagram and `DESIGN.md`'s
  detail-panel narration, and each attribute annotated with the requirement that demands it.
- The silhouette's constants read against `shape.bubble` in `packages/tokens/src/shape.ts`, value by
  value, with none invented.
