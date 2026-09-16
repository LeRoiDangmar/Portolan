---
title: 'The layout stage'
type: 'feature'
created: '2026-09-16'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '04da61bcf51856282380968d64571390816cfa51'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/architecture-decisions.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/stories/3-shared-graph-model-package.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `packages/layout` is still the story-1 stub, so the one stateful stage of the pipeline
does not exist. Without it CAP-11 — *positions are earned and kept* — is a promise with no
mechanism, and `scene`, `view-state` and `harness` all declare a dependency on a package that
exports nothing. The model also still lacks the link-driven deform and the reservation hull its own
header names as missing, and layout cannot reserve space before placing without them.

**Approach:** Implement layout as the pure function AD-8 specifies —
`(model, previousPositions, seed, mode) → positions` — placing in the unbounded unit-less space of
AD-40, reserving each body's deformed hull before placement, retaining the cells of vanished
objects, and leaving every survivor untouched. Add the deform and the hull to `@portolan/model`, as
the one exported function AD-9 and AD-38 require layout and scene to share.

## Boundaries & Constraints

**Always:**
- The signature is exactly `(model, previousPositions, seed, mode) → positions`. `mode` carries the
  zone mode and the node-backdrop flag and nothing else. No canvas width, viewport or device pixel
  enters the stage (AD-40).
- Arithmetic is `+ - * /` and `Math.sqrt` only. `Math.random`, every clock read, and every
  transcendental (`sin`, `cos`, `tan`, `exp`, `log`, `pow`, `atan2` and their kin) are banned inside
  the stage (AD-8), because layout runs in Chromium, Firefox and Safari and only exactly-specified
  IEEE 754 arithmetic holds there without a test proving it.
- Fixed iteration counts, a fixed seed, and a stable iteration order derived from
  `compareIdentityKeys` — never from Docker's or a `Map`'s order (AD-7).
- Hulls are reserved at the **maximum** density step (1.20) and at the worst case FR-70 permits
  (+32% of base radius on every link bearing), plus `spacing.cell-clearance`. Density then only
  shrinks rendered bodies inside space already reserved, so it stays a scene parameter and never
  becomes a fourth relayout action.
- A vanished object's cell is retained and released only at the next relayout — not on a timer, not
  when an exit animation ends (AD-37). `layout` creates it and `layout` releases it.
- Bodies never fuse and never overlap: two reserved hulls never intersect.
- The deform and the reservation hull are **one exported function** in `@portolan/model`, called by
  layout to reserve and later by scene to draw (AD-9, AD-38). No second copy.
- `@portolan/layout` may import `@portolan/model` and `@portolan/tokens` and nothing else.

**Never:**
- No positions on the server, no camera, no zoom, no framing value (AD-1).
- No stack-outline geometry, no zone field geometry, no isoline, no edge routing — those are the
  scene's (FR-82: the outline follows where layout put its members and never asks for a position).
- No node view and no service view surface (story 19). Overview only.
- No breathing phase, no tween, no lifecycle timer — those are frame-local in the rasteriser (AD-2).
- No layout library: every candidate resolves positions with transcendentals, which AD-8 bans.
- No token value invented. Radii, clearance and the deform cap are read from `@portolan/tokens` and
  `@portolan/model`.

## Decisions

Four things no planning document settles, decided by the human on 2026-09-16 and binding here.

- **The arrangement is a hybrid: deterministic zone anchors, then a short fixed-iteration
  relaxation.** Each network receives an anchor placed by a transcendental-free deterministic rule;
  members are seeded around their dominant network's anchor; a fixed number of relaxation passes
  then opens the edges. This is what reconciles the two documents that disagree — `DESIGN.md`'s
  *the zone owns position* and the zone study's *variant 4 lets the edges lead* — instead of picking
  one and contradicting the other. Accepted cost: two mechanisms, each needing its own test.
- **"Near its neighbours" means service siblings first.** A new task is placed beside the other
  slots of its own service — *the 4th replica appeared beside the other three*, which is the case an
  operator actually watches. Objects with no sibling fall back, in order, to the centroid of their
  already-placed edge-adjacent objects, then to their dominant network anchor; a volume, a network
  and an orphan always resolve on the last rung.
- **Reorganise re-runs with the same seed and `previousPositions` cleared.** It returns the canonical
  arrangement for that survey, so a second press changes nothing and the reproducible-screenshot
  promise needs no extra stored state. The seed stays a layout parameter and does not enter the
  surface key.
- **Story 4 implements all three branches of `mode`** — blended zones, disjoint zones with echo
  copies, and the node-backdrop partition. Because an echo draws a multi-network object once per
  zone, `positions` maps one identity key to **one or more** placements, exactly one of which is the
  original; the others are echoes. Fixing that shape here is the point: `scene`, `view-state` and
  `harness` are written against it and no later story reopens it.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cold start | survey, `previousPositions` empty | every object placed, reproducibly | N/A |
| Unchanged survey | same survey replayed | byte-identical positions, no cell moved | N/A |
| Object added | survey + 1 container | survivors untouched; placed beside its service siblings | N/A |
| Orphan added | new object attached to nothing | survivors untouched; placed on the anchor fallback rung | N/A |
| Object removed | survey − 1 container | survivors untouched; the cell retained, not reclaimed | N/A |
| Service scaled up | 3 → 5 slots | the 3 surviving slots untouched; 2 new cells beside them | N/A |
| Stack redeployed | every container ID changed, slots identical | **nothing moves at all** | N/A |
| Reorganise | same survey, `previousPositions` cleared | the canonical arrangement; pressing twice is idempotent | N/A |
| Zone mode → disjoint | same survey, `zoneMode: 'disjoint'` | every object placed; a multi-network object carries one original placement plus one echo per further zone | N/A |
| Node backdrop on | same survey, `nodeBackdrop: true` | every object inside its node's partition; zones lose the positional channel | N/A |
| Empty survey | no objects | empty positions, no throw | N/A |
| Unsorted survey | collections in arbitrary order | identical positions to the sorted survey | N/A |
| Unknown key looked up | key absent from the survey | absent from the result; the caller sees nothing | no throw |

</frozen-after-approval>

## Code Map

- `packages/layout/{src/index.ts,tsconfig.json}` -- `src/index.ts` is the story-1 stub
  (`export {};`) and must be replaced. **`tsconfig.json` lacks `allowImportingTsExtensions` and
  `rewriteRelativeImportExtensions`** which `packages/model/tsconfig.json` has; add both if `./x.ts`
  specifiers are used (the house style), otherwise write `./x.js`. `exclude` for tests, `types: []`,
  `paths` and `references` to model and tokens are already correct — do not touch them, and do not
  add a dependency.
- `packages/model/src/silhouette.ts` -- the seeded contour, and where the deform belongs. Exports
  `silhouette(key, baseRadius)`, `amplitudeAt`, `pointOnSegment`, `clearsCore`, `BASE_RADIUS`
  (`service 54 / container 46 / volume 32`), `SILHOUETTE_POINTS 28`, `SILHOUETTE_AMPLITUDE 0.11`,
  `CORE_FRACTION`, `BEARINGS`, `AMPLITUDE_STEPS 2001`. Its header names what is missing: *"the
  link-driven silhouette deform and its reservation hull (FR-13, FR-70)"*. The private `seedOf`
  (FNV-1a, `Math.imul`) and `drawAt` are **not exported**; export them, or reach the randomness
  through `amplitudeAt`. Points are unit-less, origin at the body centre.
- `packages/model/src/index.ts` -- pure barrel, type-first then value, alphabetised, two statements
  per module. Its header carries the *not here yet* note that this story closes.
- `packages/model/src/{identity,graph,edges,survey}.ts` -- `IdentityKey` is
  `` `${ObjectKind}:${string}` ``; `compareIdentityKeys`, `byIdentityKey`, `sortByIdentityKey` are
  the AD-7 order. `Survey { takenAt, nodes, networks, volumes, stacks, services, containers, edges }`,
  all `readonly`. **Collections are not sorted by construction** — only `sortSurvey`/`fromWire`
  sort, so layout must sort or assume nothing. Edges are `hosts | groups | runs | attachment | mount`
  with `{ from, to }`; `attachment` is network membership (and therefore the zone a body belongs to),
  `groups` is stack membership, `runs` is service membership — the edge the sibling rule reads —
  and `hosts` is the node edge the backdrop partitions on. There are **no membership arrays** on
  objects; a service's slots are found through `runs`, not through a field.
- `packages/tokens/src/{shape,spacing,density,layout}.ts` -- normative values.
  `shape.bubble.deform.max` = `'+32% of base radius'`, `.falloff` = `'cos² over ±38°'` (**prose — a
  cos² falloff cannot be computed under AD-8's ban; the equivalent must be expressed in `+ - * /`**),
  `.cap`, `.reservation`; `spacing['cell-clearance']` `'8px'`, `spacing.gutter` `'24px'`;
  `density.scale` = `'0.85 compact / 1.00 standard / 1.20 roomy'` as prose. Numeric equivalents live
  in `silhouette.ts`; read, invent none.
- `packages/model/src/silhouette.determinism.test.ts` -- the idiom to follow exactly: fixture set
  declared once; call-twice byte-identity via `JSON.stringify`; the expected value re-derived from
  the published algorithm rather than imported; arity assertions proving nothing else is read;
  committed golden FNV digests replayed with `it.each`; a mutation test asserting a perturbed input
  does **not** match, so the digests are evidence and not decoration. A digest failure is never a
  number to update.
- `vite.config.ts` -- the vitest config. `include: packages/*/src/**/*.test.ts`; the `determinism`
  filename infix is what `npm run test:determinism` filters on, so the AD-8 and AD-37 suites belong
  in `*.determinism.test.ts`.
- `eslint.config.mjs` -- `RESTRICTED_GLOBALS` and `RESTRICTED_SYNTAX` are **empty placeholders**,
  explicitly commented as the extension point. Nothing today forbids `Math.random`, `Date.now` or a
  transcendental anywhere; AD-8's ban is prose only. `no-restricted-imports` per package is
  generated from `dependency-graph.json`; `consistent-type-imports` is an error; layout's `side` is
  `browser`, so no node globals in sources or colocated tests.
- `dependency-graph.json` + `test/envelope.test.ts` -- `layout` is already declared
  `{ side: 'browser', imports: ['model','tokens'] }` and the envelope test asserts package.json and
  tsconfig agree with it. It checks no file list, so new sources break nothing.
- `.github/workflows/ci.yml` -- the `determinism` job already exists on an
  `ubuntu-24.04 / ubuntu-24.04-arm` matrix and runs `npm run test:determinism`. It has a step
  *"Report whether determinism tests exist yet"* emitting a `::warning::` saying the AD-8 suite lands
  with the layout package; that step stops being true here. The `pending` matrix's *AD-29
  measurement ratchet* names `packages/layout` as one of the things it awaits — it stays pending.
- `README.md` -- story 2's convention: a package with real content gets its own `###` section under
  `## The envelope`, titled as a claim, naming the decision it implements and the test that enforces
  it. `### Workspaces` still says every package but `tokens` is empty.

## Tasks & Acceptance

**Execution:**
- [x] `packages/model/src/silhouette.ts` -- add the link-driven deform and the one exported
      reservation hull, and export the seed helpers layout needs -- AD-9 and AD-38 put both ends of
      *reserve* and *draw* behind one function, and the header already names this as the gap
- [x] `packages/model/src/index.ts` -- re-export the new surface and remove the *not here yet* note
      -- the barrel is where the AD-38 argument is written down
- [x] `packages/model/src/silhouette.test.ts` -- cover the deform's cap, its independence from
      neighbours, and that the reserved hull always contains the drawn contour -- FR-70's *neighbours
      never squash a body* is the assertion the recognition channel rests on
- [x] `packages/layout/src/space.ts` -- the abstract space, the cell, the reserved hull and the
      overlap predicate -- AD-40's unit-less space needs one owner before anything is placed
- [x] `packages/layout/src/anchors.ts` -- the deterministic anchor per network, per node partition,
      and the dominant-zone rule for a multi-network object -- the first half of the hybrid, and the
      only part the backdrop branch replaces wholesale
- [x] `packages/layout/src/relax.ts` -- the fixed-iteration relaxation, edge attraction against hull
      repulsion, in `+ - * /` and `Math.sqrt` -- the second half of the hybrid; a separate file so
      the iteration count and the ban are reviewable without reading the anchoring
- [x] `packages/layout/src/arrange.ts` -- the three `mode` branches over the two halves above, and
      the echo placements the disjoint branch adds -- one file so a reviewer reads all three
      arrangements side by side rather than following calls
- [x] `packages/layout/src/retain.ts` -- the previous-positions diff: survivors, arrivals,
      departures, the sibling-first placement rule with its two fallback rungs, and the retained
      cell with its single release point -- AD-37 gives the cell one owner and one release, and that
      is only checkable if it lives in one place
- [x] `packages/layout/src/invocations.ts` -- the invocation counter -- AD-3's enforcement clause
      asks for it by name, and the determinism test cannot catch an unwarranted call because it
      returns the same answer
- [x] `packages/layout/src/index.ts` -- replace the stub; export the function, the `Positions`,
      `Placement` and `Mode` types and the counter, type-first -- the package header is where the
      AD-8/AD-40 argument and the one-key-many-placements decision are written down
- [x] `packages/layout/src/layout.determinism.test.ts` -- same model, seed and mode in, byte-
      identical positions out, re-derived rather than imported, with committed golden digests, in
      all three modes -- the `determinism` infix is what CI's matrix job filters on
- [x] `packages/layout/src/layout.stability.test.ts` -- the scripted survey sequence AD-37 names:
      added, removed, scaled up, scaled down, stack redeployed -- stability is a second property and
      no determinism test can see it
- [x] `packages/layout/src/layout.test.ts` -- the remaining matrix rows, the echo/original
      distinction, the hull-overlap floor, and the arithmetic ban asserted over the stage's own
      sources
- [x] `packages/layout/tsconfig.json` -- add the two TS-extension options if `./x.ts` specifiers are
      used -- otherwise the import does not resolve
- [x] `.github/workflows/ci.yml` -- remove the *determinism tests do not exist yet* warning step --
      it is false once this story lands
- [x] `README.md` -- a new `###` section under `## The envelope`, and correct `### Workspaces`

**Acceptance Criteria:**
- Given the layout sources, when they are read for banned constructs, then no `Math.random`, no
  clock read and no transcendental appears, and a test asserts it over the package's own files.
- Given two survey payloads that differ only in collection order, when both are laid out, then the
  positions are byte-identical — the AD-7 order is the layout's order.
- Given any survey and any of the three modes, when the placements are checked pairwise, then no two
  reserved hulls intersect, at the maximum density step, echoes included.
- Given a survey laid out in disjoint mode, when a multi-network object is read back, then exactly
  one of its placements is the original and every other is an echo, one per further zone.
- Given `npm run typecheck`, `npm run lint`, `npm test` and `npm run test:determinism`, then all
  pass, stories 1–3 suites unchanged, with no dependency added and `npm run licences` still clean.
- Given `npm run build`, then `packages/layout/dist` contains no test file and no `vitest` import.

## Implementation Notes

**Decisions taken inside the boundaries, each with its reason.**

- **The reservation is a disc, and its radius is a property of the KIND.** `reservationRadius`
  takes the base radius alone: the seeded jitter at its maximum (+11%), the Catmull–Rom
  overshoot past the control points (+4%), and the deform cap on every bearing at once
  (+32%), all at `density.scale` 1.20, plus `spacing.cell-clearance` unscaled. Every term is
  a worst case, so the value is knowable before a single link bearing exists — which is the
  only order AD-8 allows, since layout reserves before it places and the bearings are a
  function of the positions it has not chosen yet.
- **The Catmull–Rom overshoot was measured, not assumed.** The curve interpolates its 28
  control points but does not stay inside their circumscribed circle. Driving the amplitudes
  adversarially to ±11% over 20 000 sign patterns, each segment sampled at 257 parameters,
  the worst curve radius is 1.1359·r against a control-point maximum of 1.11·r.
  `CURVE_OVERSHOOT = 0.04` covers it with margin and `silhouette.test.ts` sweeps the same
  claim in both directions, so the margin is evidence and the constant is load-bearing.
- **The cos² falloff is `1 − 3t + 2t√t` with `t = (1 − cos θ) / (1 − cos 38°)`.** `t` is the
  dot product a caller already has, rescaled, and it is `(θ/38°)²` to second order; the
  smoothstep in it agrees with `cos²(90°·θ/38°)` to within **0.0167** across the whole band,
  measured at 10⁵ samples, and matches it exactly at 0°, 19° and 38°. `silhouette.test.ts`
  computes the real cosine — a test may, the stage may not — so the agreement is checked
  rather than claimed. `cos(38°)` is a literal for the same reason the 28 bearings are.
- **`silhouette` is now a projection of `bubbleHull`, not a second builder.** AD-38 forbids a
  second copy of a derived value, and the golden contour digests forbid a field being added
  to `ContourPoint`. Both hold: `HullPoint extends ContourPoint` with the deform on it,
  `bubbleHull` builds the points, and `silhouette` projects them back field for field in the
  same order. The story-3 digests pass unchanged, which is the proof.
- **`seedOf` and `drawAt` were exported rather than reached through `amplitudeAt`.** Layout
  needs draws keyed on an object AND on the run seed, which `amplitudeAt` cannot express. The
  benefit is larger than the surface: the stage then contains no integer mixing of its own, so
  its arithmetic really is `+ - * /` and `Math.sqrt`, and the ban test can assert that by
  naming what is allowed rather than listing what is not.
- **Layout does not import `@portolan/tokens`.** It may, and there is nothing there to read:
  `shape`, `spacing` and `density` are authored as prose (`'+32% of base radius'`, `'8px'`),
  which is the finding story 3 recorded. Every normative value reaches layout through
  `@portolan/model`, which transcribes them, and `test/shape-transcription.test.ts` now gates
  the deform cap, the ±38° band, the clearance and the roomiest density step as well as the
  four numbers it already held. No value is invented in `packages/layout`.
- **Layout places bodies and anchors; a stack gets no position at all.** FR-82 makes the stack
  outline *derived* — it follows where layout put its members and never asks — so `groups` is
  read for nothing and no stack is ever placed. Networks and nodes get radius-0 anchors: a
  zone is a field with no boundary and reserves no cell, but the scene has to know where the
  field is centred, and AD-38 says that is computed once.
- **Only one partition anchors at a time.** With the backdrop off the networks carry anchors
  and the nodes do not; with it on, the other way round. FR-41's *only one mark may own
  position on a surface* is the rule, and emitting both sets would be the second owner it
  names. The placement still NAMES its dominant network under the backdrop, because FR-41
  takes the positional channel from the zones, not the zones.
- **Under the backdrop a link never crosses a partition.** Without this the relaxation drags a
  task toward a peer on another machine and the machine owns position only approximately —
  measured, not theorised: the first run of the partition test failed by 4 units on one body.
  Zones are left alone, because zones OVERLAP by construction and a body drawn between two of
  its own is telling the truth.
- **The dominant zone is the SMALLEST the object belongs to, ties broken by AD-7 order.** The
  smallest zone says most about the object — a task on `frontend` and on a two-member `pgnet`
  reads as a database client, and `frontend` with two hundred others says nothing. Ties go to
  the key order, so the rule is total.
- **A volume inherits the zones of the containers that mount it, and a service the nodes of
  its tasks.** `attachment` runs from a container or a service, never from a volume, and
  `hosts` never names a service; without the inheritance every volume falls to the orphan
  anchor and the mount edge — the one edge kind FR-31 keeps when networks go — is drawn at
  full map length.
- **The arrival rungs are the three the story fixes, and a volume can reach the second.**
  Siblings through `runs`; else the centroid of already-placed edge-adjacent objects; else the
  dominant anchor, with the orphan slot beneath it. A network and an orphan always resolve on
  the last rung, as the story says. A volume does too WHEN nothing it is mounted by has been
  placed yet — but a volume whose mounters survived resolves on the second rung, and that is
  the rung order doing what *near its neighbours* means. Recorded because the story's
  parenthetical reads as *always*.
- **A new group is anchored on its members, not on a fresh spiral slot.** A zone that appears
  between two surveys belongs where its members already are; sending it to the slot the
  arrangement path would have chosen paints the field somewhere none of them is. Existing
  anchors never move, so no zone drifts because another one appeared.
- **A returning object gets its own retained cell back.** Its cell was held and nothing was let
  into it, so restoring it there is free and is what retaining it was for.
- **When an echo's zone vanishes its cell is retained; if the ORIGINAL's zone vanishes the
  original stays put and stops naming a zone.** One placement is always the original, and if
  the original's own drawing is the one that went, the lowest-keyed echo is relabelled rather
  than moved — FR-16 is about position, and a relabel moves nothing.
- **`settle` is the single owner of the no-overlap floor.** The relaxation only ever proposes;
  every position on both paths is committed through one function, which pushes a body clear of
  the first cell it meets and, after a fixed 64 pushes, falls back to the free ground beyond
  the right edge of everything reserved. That fallback is provably free, so `settle` is total:
  it never throws, never loops unboundedly and never returns an overlapping position.
- **The relaxation is Jacobi, not Gauss–Seidel.** Every pass computes the whole displacement
  field from the positions at the start of the pass, so no body sees another's half-updated
  position and the result depends only on the summation order — which is AD-7's.
- **The ban test names what is allowed.** `Math.sqrt` and nothing else, over every `Math.`
  member in the package's own sources with comments and string literals stripped, plus `Date`,
  `performance`, the frame-timing globals, `**` and `%`. A list of forbidden names is a list
  someone has to keep complete, and `Math.cbrt` would not have been on it. The stripper is
  mutation-checked both ways: a real clock read must fail, and a comment arguing about
  `Math.cos` — which these headers do at length — must not.

**Measured at the reference scale.** 416 objects (6 nodes, 14 stacks, 40 services, 320
containers, 11 networks, 25 volumes, ~2 networks per container): a full relayout takes 68ms
blended, 48ms disjoint, 23ms under the backdrop, and the survey path 3–4ms. The relaxation is
pairwise, which is 78 210 pairs at that scale — a cost named in `relax.ts` and worth paying,
because a spatial index would be a second structure with an order of its own that AD-7 would
have to reach into.

**Golden digests.** Three, one per mode, FNV-1a over `JSON.stringify(layout(...))`, computed
on 2026-09-16 and committed. They pin the anchors, the seeded scatter, all twenty-four
relaxation passes, the settling, the echoes and the AD-7 output order at once. A failure is
never a number to update: it means the map moved, and FR-16 says the map does not move.
Mutation-checked with a perturbed survey and with a changed seed.

## Spec Change Log

## Review Triage Log

## Design Notes

**The two tests are two properties and neither substitutes for the other.** Determinism is *same
input, same output* and is tested by replay; stability is *changed input, almost unchanged output*
and is invisible to a determinism test, because a determinism test never changes the input. AD-37
names the five scripted transitions; the redeployment case is the sharp one, and it is where AD-5's
slot key and AD-6's seed earn their keep — every container ID changes, every slot survives, and a
correct build moves nothing at all.

**The relaxation must be stable, not merely deterministic.** It runs on a relayout, over the whole
population; it must not run on a survey, because a survivor's position is then no longer its own.
The survey path places arrivals into free space and touches nothing else — that is the whole of
AD-37 — so the relaxation belongs behind the three FR-16 actions and behind nothing else.

**The falloff is the one token that cannot be transcribed literally.** `shape.bubble.deform.falloff`
reads `cos² over ±38°`. `Math.cos` is banned inside the stage, and the deform is computed one call
away from it. A polynomial in `+ - * /` that agrees with cos² across the band is the shape of the
answer; whichever is chosen, the constants are transcribed once, into `silhouette.ts`, and the test
re-derives them from the published form rather than importing them — story 3's rule.

## Verification

**Commands, as run on 2026-09-16:**
- `npm run typecheck` -- clean; `layout` and `model` both build, and `tsconfig.tools.json`
  typechecks the colocated tests.
- `npm run lint` -- clean. `eslint .` and `prettier --check .` both pass, including
  `no-restricted-imports` for `layout` (which imports `@portolan/model` and nothing else).
- `npm test` -- 622 tests in 17 files, all green. Stories 1-3 suites unchanged; story 3's
  seven golden contour digests still pass, which is what proves `silhouette` was refactored
  onto `bubbleHull` without moving a single number.
- `npm run test:determinism` -- 26 tests in 2 files: the AD-8 layout suite in all three modes
  and the AD-6 silhouette suite. The filename filter reaches both.
- `npm run build` -- passes. `packages/layout/dist` holds 28 emitted files (seven modules
  times `.js`, `.js.map`, `.d.ts`, `.d.ts.map`) with no `*.test.js` and no `vitest` import.
- `npm run licences` -- 136 installed packages, all compatible, unchanged. No dependency added.

**Manual checks:**
- The four new transcribed constants read against `packages/tokens/src/{shape,spacing,density}.ts`
  value by value, and then gated in `test/shape-transcription.test.ts` so the reading is no
  longer manual.
- The reference-scale run above, at 416 objects, in all three modes, asserting `isDisjoint`.
