---
title: 'Design tokens as the single source of truth'
type: 'feature'
created: '2026-09-15'
status: 'in-review'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '52ee115b619a485c6c5959a4216ac4519a37534c'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/palette-cvd-analysis.md'
  - '{project-root}/_bmad-output/specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every value the product looks like lives in `DESIGN.md` prose. Nothing imports it, so
the first component to need a colour will hand-copy one, and from then on the contrast tests
validate the copy rather than the design (AD-23). The legibility floors NFR-11 and NFR-13 state are
promises in a document with nothing checking them, and NFR-13 already names a defect nobody can
currently detect.

**Approach:** Author all eleven namespaces `DESIGN.md` declares as typed TypeScript in
`packages/tokens`, generate the CSS custom properties from that one source, and turn AD-28's pending
CI job into a real blocking gate computing the five contrast ratios and the deuteranopia separation
from the token file.

## Boundaries & Constraints

**Always:**
- **All eleven namespaces**, not colour alone: `colour, stroke, opacity, elevation, shape, density,
  spacing, layout, type, motion, rounded`. Scoping to colour orphans the load-bearing half — `stroke`
  carries the stub length AD-29 ratchets, `layout` the 884px operative canvas AD-29 measures against,
  `density` AD-8's reservation maximum, `shape` AD-8's hull geometry.
- **One authored source, generated output.** TypeScript is authored; CSS is emitted and never
  hand-edited. CI fails if the committed CSS is out of sync with the TypeScript.
- **The numeric floors and the exemption set are data in the token file**, each exemption a named
  pair of *what is exempt* and *the floor that still applies* — never hard-coded in the test (AD-28).
- `DESIGN.md`'s values are transcribed, not reinterpreted. Its dark/light convention is **inverted**:
  a bare name is the DARK value, `-light` carries the light one.
- `packages/tokens` imports nothing. It has no Node and no DOM globals available (`types: []`,
  `side: shared`), so every generator and gate lives in `scripts/*.mjs`.

**Never:**
- No relaxing of a gate, no skipping a check, and **no invented replacement values** for anything
  `DESIGN.md` or design owns.
- No new dependency without clearing the AGPLv3 filter — the colour maths has no named dependency
  anywhere in the stack and is a port, not an install.
- No literal colour and no literal floor anywhere else in the code, now or later.
- No threshold the upstream documents refuse to set.

**Zone tints, decided 2026-09-15:** the twelve re-optimised values in `palette-cvd-analysis.md` §5
are adopted, together with the threshold and the exemption set that file ratifies. `DESIGN.md`'s
shipped tints are **not** transcribed — they are the NFR-13 defect, and AD-23 has already moved
normativity on values from `DESIGN.md` to this token file, so adopting design's own measured
replacement is a transcription of the current decision rather than an invention. NFR-13 then clears
at ΔE00 3.38 dark / 3.81 light and the gate lands green on separation.

Three named and accepted costs of that decision, none of them silent:
- `palette-cvd-analysis.md` calls these values *candidates* pending design's ratification of the
  register. This story adopts them ahead of that ratification; if design lands different values, the
  change is twelve hex strings in one file and the gate re-runs.
- **The isolines are not re-derived.** `zone-isoline-1…6` and their `-light` twins were derived
  against the old tints and this story does not recompute them. The isoline-over-its-own-tint ratio
  is **not** among AD-28's five gated ratios, so nothing in CI will catch the drift. Deferred with a
  named owner rather than guessed at.
- `zone blob` and `pastille-network` are likewise unchecked against their own floors, for the same
  reason and with the same deferral.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| CSS generation | the TypeScript token file | every namespace flattened to `--portolan-*` custom properties, dark at `:root`, light under its own selector | N/A |
| CSS drift | committed CSS differs from a fresh generation | `--check` exits non-zero naming the first differing property | the diff is the message |
| Contrast gate, failing | a pair under its floor | exit 1 naming the two tokens, the measured ratio, the floor, and the palette | not a crash — a report |
| Declared exemption | a pair in the exemption set | held to its own recorded floor, never skipped | exit 1 if it misses *that* floor |
| NFR-13 separation | six zone tints, simulated | min pairwise ΔE00 reported per palette per deficiency | exit 1 below the threshold, naming the worst pair |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/ux-designs/.../DESIGN.md` -- the source. YAML frontmatter, lines
  16–461: `colors` 16–190 (142 tokens, 71 exact dark/light pairs), `typography` 196–262 (12 roles +
  `scale` 0.90/1.00/1.15, floors 9px/8px), `rounded` 264–270, `spacing` 272–289, `motion` 299–339,
  `elevation` 341–354, `opacity` 356–364, `stroke` 366–396, `shape` 398–450, `density` 452–456,
  `layout` 458–461. `components` (463–619) is **not** a twelfth namespace — it is references only, and
  is out of scope here. Contrast tables at 721–756 are the floor data; composite table 768–774.
- `.../palette-cvd-analysis.md` -- §4 the ratified threshold and the one ratified exemption (the
  bubble contour over a zone tint is **not** an edge); §4 also records the veil's health mark at
  **2.1:1** as a value rather than a category; **§5 is the source for the twelve zone tints** — take
  them from here, not from `DESIGN.md`.
- `packages/tokens/{package.json,tsconfig.json,src/index.ts}` -- the empty package story 1 stood up.
  `types: []` and no `dependencies`; `envelope.test.ts` asserts the latter stays empty of `@portolan/*`.
- `scripts/check-licences.mjs` + `test/licences.test.ts` -- the shape every gate follows: JSDoc header
  naming the NFR, module-level policy constant, pure exported helper, `runGate()`, entry-point guard so
  the test can import it (`// @ts-expect-error`). Story 1's rule holds: **test the mechanism through the
  real tooling, never the shape of a config**, and mutation-test every gate.
- `.github/workflows/ci.yml` -- the `pending` matrix's first entry is AD-28. Replace it with a real
  job shaped like `licences`. Its `awaits` names `packages/scene` too, but `opacity.zone-field-cap`
  clamps the worst composite to a single tint, so the five ratios are computable from tokens alone —
  say so when removing the entry.
- `.gitignore` / `.prettierignore` -- `dist/` is ignored, so generated CSS must live in a tracked
  path. Prettier checks `.css` and does not ignore generated files.
- `_bmad-output/planning-artifacts/ux-designs/.../palette-cvd-check.py`, `palette-cvd-tune.py` -- the
  reference implementation the analysis's numbers came from: sRGB transfer, Viénot–Brettel–Mollon 1999
  single-plane simulation with its three matrices, XYZ/Lab at D65, a complete ΔE2000, and WCAG
  relative luminance. Port these; do not port `tune.py`'s hill-climbing search — a gate does not search.

## Tasks & Acceptance

**Execution:**
- [x] `packages/tokens/src/colour.ts` -- all 142 colour tokens as one `as const` dark/light pair structure -- the largest transcription, and the one AD-28 computes from
- [x] `packages/tokens/src/{stroke,opacity,elevation,shape,density,spacing,layout,type,motion,rounded}.ts` -- the ten remaining namespaces -- one file each, so a reviewer can diff a namespace against `DESIGN.md` without scrolling
- [x] `packages/tokens/src/floors.ts` -- the five gated ratios as token-pair rules, plus the exemption set as `{ exempt, floor }` pairs -- AD-28 requires these as data here, never in the test
- [x] `packages/tokens/src/index.ts` -- re-export the eleven namespaces and the floors as one typed surface -- `erasableSyntaxOnly` is on: `as const` objects and `type`, no enums
- [x] `packages/tokens/src/colour.test.ts` -- assert every dark token has an exact `-light` twin and no orphan exists either way -- the transcription error AD-23 exists to prevent
- [x] `scripts/colour.mjs` -- the ported maths: sRGB transfer, WCAG relative luminance, CVD simulation, Lab, ΔE2000 -- shared by the gate and its tests; exported, not inlined
- [x] `scripts/generate-tokens-css.mjs` -- emit the CSS from the token file; `--check` compares against the committed file and exits non-zero on drift -- CSS is generated, never hand-edited
- [x] `packages/tokens/generated/tokens.css` -- the committed output -- tracked, because `dist/` is gitignored and a drift check over an untracked file checks nothing
- [x] `scripts/check-contrast.mjs` -- the AD-28 gate: five ratios over both palettes, exemptions honoured at their own floors, and zone-tint separation under both deficiencies -- reads floors from the token file
- [x] `test/colour.test.ts` -- table-driven tests for the ported maths against `palette-cvd-analysis.md`'s published figures -- if the port disagrees with the document, the gate is measuring something else
- [x] `test/contrast.test.ts` -- drive the real gate over fixture palettes: one passing, one failing a floor, one tripping an exemption, one failing separation -- and mutation-test it
- [x] `test/tokens-css.test.ts` -- drive the real `--check` gate against a tampered CSS file: a changed value, a deleted declaration, a header edit -- added at review; the matrix's two generator rows had no covering test
- [x] `.github/workflows/ci.yml` -- replace the AD-28 `pending` entry with a real job -- and update the README's pending-gate list
- [x] `README.md` -- how the tokens are authored, how the CSS is regenerated, and what the AD-28 gate checks -- the envelope's documentation is a story-1 convention

**Acceptance Criteria:**
- Given the token file, when every namespace is diffed against `DESIGN.md`'s frontmatter, then all eleven are present and every value matches — no value invented, none dropped.
- Given `npm run tokens:css -- --check` on a clean tree, then it passes; given one token edited without regenerating, then it fails naming the property.
- Given the ported maths, when run on `DESIGN.md`'s **superseded** tints, then it reproduces `palette-cvd-analysis.md` §1 — light `zone-tint-1`/`3` both simulate to `#E2E2EC` at ΔE00 0.00, dark 2/4 at 1.30 — proving the gate detects the defect it was built for.
- Given the ported maths on the **adopted** §5 tints, then min pairwise ΔE00 is ≥ 3.0 under both deuteranopia and protanopia in both palettes, reproducing 3.38 dark / 3.81 light.
- Given the adopted tints, when the edge floors are measured, then both edge kinds still clear 3:1 — every adopted tint stays inside the 1.13–1.19 iso-luminant band, which is what makes that survive.
- Given the AD-28 job, when a PR lowers any gated pair below its floor, then CI fails naming the tokens, the ratio, the floor and the palette.
- Given the exemption set, when the gate runs, then no exemption is skipped — each is asserted against its own recorded floor, and the health mark under the veil is checked at 2.1:1.
- Given `npm run lint`, `npm run typecheck` and `npm test`, then all pass with the generated CSS committed.

## Implementation Notes

**The gate is red, and it is the first of AD-28's two kinds of red — the palette is
genuinely below its own floor.** `pastille-network-1` and `pastille-network-3` measure
4.45:1 and 4.39:1 on `body-mid` in dark, against the 4.5:1 floor `DESIGN.md`'s own
*Network pastille on body* row declares. Verified independently of the gate: the computed
dark range 4.388–5.201 reproduces the "4.4 – 5.2" that row prints, and the light range
5.762–7.612 reproduces its "5.7 – 7.6". So the table states a measured low end below the
floor written beside it and never reconciles the two. The defect predates this story and
is unrelated to the tint substitution — it belongs to design, and nothing here may repair
it. Recorded in `deferred-work.md`.

The reading that surfaces it is a judgement and is named here rather than buried: AD-28
abbreviates the ratio as *"4.5:1 chassis"*, while NFR-11 and `SPEC.md` both state it as
*"4.5:1 chassis text **and marks**"*. The requirement won over the abbreviation. Reading it
narrowly would have left the entire badge channel ungated and made the gate green by not
looking.

**The luminance-coefficient concern the spec raised is settled, not deferred.** No gated
pair straddles a floor between WCAG's rounded row and the full-precision sRGB row — the
binding pair moves from 4.453 to 4.452. `test/contrast.test.ts` asserts the absence of any
straddling pair, so a future token that lands in that gap fails rather than depending on
which constant was picked.

**Review corrections applied on top of the implementation:**
- `scripts/check-contrast.mjs` contained four **literal NUL bytes**, used as a composite
  map-key separator. Git classified the file as binary, so it had no diff and no
  line-level review, permanently. Replaced with the `\u0000` escape; semantics unchanged.
- `test/tokens-css.test.ts` added. The I/O matrix's *CSS generation* and *CSS drift* rows
  had no covering test — the generator's helpers were exported but nothing drove the real
  `--check`. Mutation-tested: forcing `firstDifference` to `null` turns 3 tests red.
- Two prose values in the token file were stale against named architecture decisions, and
  AD-23 makes this file normative, so the next story would have read them as current.
  `shape.bubble.silhouette.seed` said *the object's Docker ID*, which **AD-6** supersedes
  with the AD-5 identity key — a declared departure from FR-13, precisely because a
  container ID makes *the same shape across every survey* false after the first
  redeployment. `density.scale.affects` listed `{spacing.cell-clearance}`, which **AD-8**
  overrode because density driving clearance makes the control a fourth relayout action
  and contradicts FR-16. Both annotated in place rather than rewritten, so the
  transcription survives beside the decision that supersedes it.

**One §5 figure could not be reproduced and is therefore not asserted anywhere:**
`palette-cvd-analysis.md` claims normal-vision separation improves from 6.4–6.6 to
7.5–7.8. The superseded tints measure 5.29 dark / 2.84 light, so the lower pair appears to
belong to the withdrawn first candidate set. The direction holds; the starting numbers do
not.

**Two figures DESIGN.md prints that the tests carry a tolerance for**, each with the reason
written above it: *detail-panel keys* prints 5.2:1 where the value is 5.149, and the *focus
ring* row prints ranges no single enumeration of surfaces reproduces. `floors.ts` uses the
chassis-surface group minus `canvas` and the two node-backdrop bands, which are map rather
than chrome; every member clears 3:1 more than threefold.

**The gate's independence from `packages/scene` rests on `opacity.zone-field-cap` being
prose the renderer must honour.** When `scene` lands, that is the assumption to re-check.

**The gate is red on its first run, on a defect this story did not create and may not fix.**
`pastille-network-1` `#4A8296` measures **4.45:1** and `pastille-network-3` `#7A7695` **4.39:1** on
`{colors.body-mid}` in the dark palette, against the 4.5:1 floor `DESIGN.md`'s own *Network pastille
on body* row declares. That row prints its own measured range as **4.4 – 5.2** and never reconciles
the low end with the floor above it; `review-rubric.md` recomputed the whole table, confirmed "4.4…"
as accurate, and did not notice it sits under the floor. It is not NFR-13 and not a consequence of
the zone-tint substitution — it predates both, and `palette-cvd-analysis.md` §4 did not sweep this
family when it declared NFR-11's exemption set complete.

Every route to green is closed by the Boundaries: no invented replacement values, no relaxed floor,
no exemption design has not ratified. So the gate reports it. AD-28 names exactly this case — *red
because the palette is genuinely wrong is the gate working* — and the story's Intent says the floors
were promises with nothing checking them. The first thing the check did was find a second one.
`test/contrast.test.ts` pins the exact shape of the red, so whichever way design rules — two hexes,
a ratified exemption, or a corrected floor — that test goes red and is deleted. Recorded in
`deferred-work.md` with design as owner.

**What "4.5:1 chassis" covers, and why marks are in it.** AD-28 abbreviates the ratio as *4.5:1
chassis*; `SPEC.md`'s NFR-11 states it as *4.5:1 chassis text and marks*. The gate follows the
requirement rather than the abbreviation, so the rule holds every row of `DESIGN.md`'s two contrast
tables whose stated floor is 4.5:1 — the three pastille families on the body and the stack name on
the outline, as well as every chassis text role. Reading it the narrow way would leave the whole
badge channel, the product's encoding primitive, ungated; it would also have turned the gate green
by not looking. Named because it is the decision the red above rests on.

**The veil is composited in encoded sRGB, and that is what reproduces `DESIGN.md`'s figure.** The
stopped health mark measures 4.22:1 bare and **2.13:1** under `{colors.state-stale}` at alpha 0.42,
against the 2.1:1 `DESIGN.md` records. Composited in linear light the same pair reads 2.90:1, which
is not a number any upstream document states — so the gate composites the way a browser does. The
veil's alpha and the 2.1 floor are both data on the exemption in `floors.ts`; `{components.stale-map}`
is where the alpha comes from, and `components` is otherwise out of scope.

**`{opacity.zone-field-cap}` is prose, so the gate's use of it is an argument, not a computation.**
The clamp is a sentence in `DESIGN.md` — *the composited zone field is luminance-clamped to a single
tint* — and what makes AD-28's five ratios computable without `packages/scene` is that sentence being
true of the renderer. The gate measures each edge over a single tint on that basis, which is exactly
AD-28's *worst composited field* only for as long as AD-9's scene actually applies the clamp. When
`packages/scene` lands, that is the assumption to re-check.

**Reading the token file from Node, and why `packages/tokens` needed two compiler options.** AD-23
asks for one token file read by CSS, TypeScript and a Node test runner. The scripts are `.mjs` with
no build step, so they import `packages/tokens/src/index.ts` directly and Node strips the types —
possible only because `erasableSyntaxOnly` is already on. That needs `./x.ts` import specifiers,
so the package adds `allowImportingTsExtensions` with `rewriteRelativeImportExtensions`, which turns
them into `./x.js` on emit and leaves `dist/` ordinary ESM. The alternative — scripts reading
`dist/` — would have made every gate depend on a prior `tsc --build`.

**Tests are excluded from the package build.** `packages/tokens/tsconfig.json` excludes
`src/**/*.test.ts` and `tsconfig.tools.json` picks them up instead, so `colour.test.ts` is still
typechecked (with node types) but the emitted package carries no test file and no `vitest` import.

**Comments in a `tsconfig.json` have to be `$comment`.** `test/envelope.test.ts` reads every
workspace manifest with `JSON.parse`, which JSONC comments break. The repo's own convention — a
`"$comment"` key, as `tsconfig.base.json` uses — is what the new note follows.

**The generated CSS is formatted by Prettier before it is written.** `prettier --check .` covers
`.css` and does not ignore generated files, so a generator emitting its own formatting would fail
lint on every regeneration. Running the output through the project's own configuration makes the
drift check and the format check agree by construction. Two consequences worth naming: Prettier
lower-cases hex, so the CSS reads `#06080a` where the token file reads `#06080A`; and it normalises
quotes. Neither changes a value.

**Prose values are emitted as CSS strings.** Eleven namespaces of `DESIGN.md` prose carry
apostrophes, semicolons and `{token}` references. Bare, an apostrophe opens a string, a semicolon
ends the declaration, and a `{` opens a block — the last of which crashes Prettier's own CSS parser
outright, which is how this was found. The emitter uses an allowlist of the characters a CSS value
is built from and quotes everything else.

**Two `DESIGN.md` figures the port could not reproduce exactly, both harmless and both recorded
rather than smoothed.** *Detail-panel keys* prints 5.2:1 where `ink-3` on `panel` measures 5.149,
which rounds to 5.1 — a presentation rounding on a row with 0.6 of headroom, so `test/colour.test.ts`
carries a ±0.06 tolerance with the reason written above it. And the *focus ring on any chrome
surface* row prints 10.5 – 11.1 / 7.8 – 8.8 without enumerating its surfaces; no single enumeration
reproduces both printed ranges. `floors.ts` uses `DESIGN.md`'s own chassis-surface group minus
`canvas` and the two node-backdrop bands, which are map and which the row's own *chrome only, never
the map* rule excludes. It measures 10.50 – 11.20 / 7.69 – 9.37, every member more than threefold
over its 3:1 floor.

**Nothing straddles the two luminance coefficient rows today.** The gate computes every pair a
second time with the full-precision sRGB row and reports any pair where the two forms fall on
opposite sides of a floor. The list is empty, and the mechanism stays so that it will not be.

**`layout`'s 884px is now a token, which is the edge AD-29 was waiting on.** `layout.canvas-min` and
`stroke.edge.attach-min-length` are the two values the measurement harness is required to read from
here rather than carry. They are in place; the ratchet that consumes them is not this story.

## Spec Change Log

## Review Triage Log

Three layers ran on the full diff: blind hunter (13 findings), edge-case hunter (15), verification
gap (3 gap findings + 4 others). Every finding gets a row.

| Finding | Verdict | Evidence |
| --- | --- | --- |
| `parseDeclarations` is line-anchored, so Prettier-wrapped declarations escape the property-level drift report | **patch** | Confirmed by counting: 343 declaration starts in the generated CSS, 336 of them single-line — 7 invisible. Drift in them falls to the line fallback, contradicting the I/O matrix's "names the first differing property". |
| No tamper test covers a multi-line declaration | **patch** | Confirmed: all three drift cases edit `--portolan-colour-ground` or the header, which is why the parser hole survived. |
| Unknown argv falls through to the write branch | **patch** | Real: `--chek` overwrites the committed CSS instead of checking it. |
| `flatten` has no branch for array/null/undefined, and two keys can kebab to one property | **patch** | Real. A collision last-writes-wins in the cascade and `firstDifference`'s `Map` hides it, so the drift check cannot see its own blind spot. |
| `cssValue` escapes only `\` and `"` | **patch** | Real: a prose value with a newline emits an unterminated CSS string. The function's whole job is making hand-transcribed prose safe. |
| `readFileSync` catch reports EACCES/EISDIR as "missing" | **patch** | Real, and cheap: re-throw anything but ENOENT. |
| Gate never validates `entry.from`, `measure.kind` or `measure.alpha` | **patch** | Real, and it matters more than usual: AD-28 makes the exemption set data *design edits by hand*, so a typo must fail loudly rather than print a live-looking exemption that checks nothing. |
| 17 prose cross-references name namespaces that do not exist | **patch** | Confirmed by count: 15 `{colors.` and 2 `{typography.` against actual namespaces `colour` and `type`. They ship into the CSS as dead strings, in a file AD-23 makes normative. |
| The generated CSS is unreachable through the package boundary | **patch** | Confirmed: `exports` carries only `.` and `./package.json`, `files` is `["dist"]`. Nothing can import the artefact the pipeline exists to produce. |
| Tamper tests mutate the tracked CSS and shell out to `rm` | **patch** | Real. An interrupted run leaves a corrupted tracked file and a stray `.backup`; `rm` is not portable. |
| Tamper tests hard-code `--portolan-colour-ground: #06080a` | **patch** | Real: a legitimate design edit of that token turns `replace` into a no-op and fails the tests with "expected 0 to be 1" — on a file whose entire purpose is that design edits token values. |
| The straddle mechanism is asserted only by its own silence | **patch** | Pre-verified by the verification-gap layer and independently plausible: `expect(straddles).toEqual([])` is equally satisfied by a dead mechanism. |
| `NAMESPACES` coverage is never asserted against `Object.keys(tokens)` | **patch** | Pre-verified. The `it.each` draws its cases from the same constant the generator iterates, so a missing namespace produces neither CSS nor a test case. |
| `opacity.zone-field-cap` is read by no code and pinned by no test | **patch** | Pre-verified. The single-tint edge measurement rests entirely on that clamp; if design withdraws it the gate keeps reporting "over the worst composited zone field" while measuring one layer. |
| Colour VALUES are never mechanically compared against `DESIGN.md` | **patch** | Real: `colour.test.ts` transcribes NAMES independently and asserts only that both palettes are six-digit hex. A mistyped light value passes every gate — which is precisely the transcription error AD-23 exists to prevent. |
| `it.each` template prints the foreground hex where the ratio belongs | **patch** | Confirmed at `test/colour.test.ts:139`: `'%s measures %s:1'` consumes `_row` then `foreground`, so names read "measures #A0AEB8:1". |
| README and `colour.ts` both claim "one named departure" from `DESIGN.md` | **patch** | Real, and caused by this review: the AD-6 seed and AD-8 clearance corrections make three. |
| Gate header claims the exemption set was complete and ratified before enabling | **patch** | Real: the gate's own red contradicts it. The analysis did not sweep the network pastille family, so whether that red wants a value change or an unnamed exemption is still open. |
| README forbids literal colours and floors that its own new fixtures ship | **patch** | Real: `test/contrast.test.ts` carries invented hexes and literal floors. The rule needs a fixture carve-out or the documentation forbids the diff. |
| Nothing documents who sets `data-palette='light'` | **patch** | Real: the whole light block hangs on an attribute with no stated contract. |
| `type.ts` uses camelCase keys without the note `rounded.ts` gives its own lowering | **patch** | Real, and it weakens the "diff a namespace against DESIGN.md line for line" claim the file is organised around. |
| The gate measures marks only against `body-mid`, the middle stop of a three-stop gradient | **defer** | Real and verified: on `body-top` the health mark reads 3.83:1 against its 4:1 floor and `pastille-network-1` 4.04:1 against 4.5:1; on `body-sel-top` `bubble-id` reads 6.64:1 against the 7:1 identifier floor. But `DESIGN.md`'s own contrast rows are measured against `body-mid` (its printed "4.4 – 5.2" reproduces exactly), so gating more stops would widen a blocking gate past both AD-28's contract and the document's own measurements. Design's to rule. |
| The adopted tints pushed the mode-B zone blob below its 4:1 floor | **defer** | Verified: `pastille-network-1` over `zone-tint-1` dark reads 3.97:1, was 4.00:1. Not among AD-28's five, so CI cannot see it. Already recorded; the finding's real point — that README and the notes under-communicate it — is answered by the notes above. |
| The new blocking job is red from its first run, so the check carries no incremental signal | **defer** | Verified: `npm run contrast` exits 1 today. Not caused by this change — the pastille values predate it and `DESIGN.md` itself prints a low end below the floor it declares. AD-28 makes the ruling design's, and a permanently-red required check is exactly the pressure that gets gates bypassed, so it is surfaced to the human rather than buried. |
| Entrypoint check compares `process.argv[1]` without `realpathSync`, so a symlinked invocation skips the gate | **defer** | Real but unreachable today: nothing in the repo or CI invokes either script through a symlink. The pattern is story 1's convention, copied deliberately — `scripts/check-licences.mjs` has it too — so the fix belongs to all three scripts at once, not to this story alone. |
| Isolines were derived against the superseded tints | **defer** | Already recorded before review. Verified they still clear their 3:1 floor on the adopted tints (3.20–3.68 dark), so the deferral is precautionary rather than a live miss. |
| Story `## Verification` under-counts the suite (233 tests / 6 files against the actual 254 / 7) | **rejected** | True, but its fix is an edit to this build's spec, which triage rejects by rule. The correct figures are recorded in the Implementation Notes above instead. |


## Design Notes

**Why the gate does not need `packages/scene`.** AD-28 asks for 3:1 over the *worst composited zone
field*. `opacity.zone-field-cap` luminance-clamps the composite to a single tint, which is precisely
what makes the worst composite equal to one tint and the floor checkable from colour values alone.
Without the clamp the gate would have to wait for the scene; with it, the worst case is a loop over
six tints.

**Two decisions taken rather than asked.** The gate uses WCAG's rounded luminance coefficients
(`0.2126 / 0.7152 / 0.0722`), not the full-precision sRGB row the Python reference used — NFR-11 cites
WCAG. Any pair where the two forms straddle a floor must be reported, not quietly resolved. And the
gate asserts exactly AD-28's five ratios: widening a blocking gate beyond its contract is how gates
get disabled.

## Verification

**Commands:** all run on Node 24.13.1 / npm 11.8.0.
- `npm run typecheck` -- **passes**, across all twelve workspaces plus `tsconfig.tools.json`. The
  token file compiles under `strict` with `erasableSyntaxOnly`: `as const` objects and `type` only.
- `npm run lint` -- **passes**, `eslint .` and `prettier --check .` both clean, the generated CSS
  included.
- `npm test` -- **326 tests across 7 files, all passing**, after the review round. Story 1's three
  suites (81 tests) are unchanged; the new ones are `packages/tokens/src/colour.test.ts` (143, most
  of them the per-token comparison against `DESIGN.md`'s own frontmatter),
  `test/colour.test.ts` (58), `test/contrast.test.ts` (20) and `test/tokens-css.test.ts` (24).
- `npm run build` -- **passes**; `tsc --build` emits all twelve workspaces and Vite emits
  `dist/browser`. No test file reaches `packages/tokens/dist`.
- `npm run licences` -- 136 installed packages, all compatible. **No dependency was added**: the
  colour maths is a port.
- `npm run tokens:css -- --check` -- **no drift**. 272 custom properties at `:root`, 71 under
  `:root[data-palette='light']`.
- `npm run contrast` -- **RED, on two pairs, and not the ones expected.** The adopted tints clear
  every floor they touch and NFR-13 clears in both palettes under both deficiencies; what fails is
  `pastille-network-1` at 4.45:1 and `pastille-network-3` at 4.39:1 against DESIGN.md's own 4.5:1
  floor. See *Implementation Notes* — a pre-existing defect the gate detected on its first run, and
  one this story's Boundaries forbid repairing. Everything else in the report is green:
  identifier channel 8.08 worst, health 4.22 worst, both edge kinds 4.18 worst over the adopted
  tints, focus ring 7.69 worst, and both exemptions clear at their own floors (contour over canvas
  3.04, veiled health 2.13).

**Negative and mutation checks — each run, and each reverted:**
- Editing one hex in `colour.ts` without regenerating: `tokens:css --check` exits 1 naming
  `--portolan-colour-ground under :root` and printing both values.
- `test/contrast.test.ts` drives the real `audit` over four fixture palettes: one clean (no
  failures), one with `brass` dulled (chassis fails in dark only, every other rule and the light
  palette stay green, the message names both tokens, the ratio, the floor and the palette), one
  with `contour` darkened (the exemption's own 3:1 floor over the canvas fails, and nothing else),
  and one with `DESIGN.md`'s superseded tints substituted (NFR-13 fails naming
  `zone-tint-1`/`zone-tint-3` and the byte-identical `#E2E2EC`).
- Mutation guards inside that suite: an empty exemption set produces zero exemption findings, so the
  count assertion is evidence the loop ran; raising the NFR-13 threshold to 99 turns all four
  separation measurements red; the gated-pair count is derived from `floors.ts` so a rule that
  stopped being measured fails rather than passing quietly.
- The veil is asserted to be composited rather than skipped: the bare stopped mark is 4.22:1 and the
  gate's veiled figure is 2.13:1, so a gate that forgot to composite would report the wrong number
  and pass for the wrong reason.

**Manual checks:**
- Each of the eleven namespaces was read side by side against `DESIGN.md`'s frontmatter while it was
  transcribed. Because no eye is reliable at 343 leaves, the reading was then confirmed
  mechanically: the ten non-colour namespaces flatten to **201 leaves, matching `DESIGN.md`'s
  frontmatter exactly** — none missing, none extra, no value different — and the `colour` namespace
  matches on **130 of its 142 values**, the other twelve being the adopted zone tints. The twelve
  were checked against `palette-cvd-analysis.md` §5 one by one, and `packages/tokens/src/colour.test.ts`
  asserts them.
- `scripts/colour.mjs` reproduces every published figure in `palette-cvd-analysis.md`: §1's
  0.00 / 2.17 / 1.30 / 1.42 / 1.57 with the exact simulated hex values, and §5's C*, hue and
  ground contrast for all twelve tints plus 3.38 / 3.39 / 3.81 / 3.74 and 7.53 / 7.84. One §5
  aside was **not** reproduced and is not asserted: the claim that normal-vision separation improves
  *6.4–6.6 → 7.5–7.8* — the shipped set measures 5.29 dark and 2.84 light, so the lower pair of
  figures appears to belong to the withdrawn first candidate set, not to `DESIGN.md`'s tints. The
  direction of the claim holds; the starting numbers do not.
- `ci.yml`'s `pending` matrix no longer carries AD-28, and its `awaits` line naming `packages/scene`
  is gone with it — the new job's comment says why the scene was never needed.
