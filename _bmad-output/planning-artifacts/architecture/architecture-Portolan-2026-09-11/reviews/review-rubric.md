# Rubric review — ARCHITECTURE-SPINE.md (Portolan)

- **Target:** `_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md`
- **Driving spec:** `_bmad-output/planning-artifacts/prds/prd-Portolan-2026-09-11/prd.md`
- **Altitude:** feature — the level below is **epics**
- **Repository:** greenfield, no code
- **Reviewed:** 2026-09-14
- **Method:** the seven-point good-spine checklist, plus the spine's own stated test applied to itself, in both directions.

## Verdict

**Revise before epics.** The spine is unusually strong on the two dimensions it chose to fight on — layout determinism/stability and the legibility verification apparatus (AD-8, AD-26 … AD-31, AD-37) — and those ADs are genuine, enforceable, non-obvious calls. But it is not yet safe to hand to epic authors. Three classes of defect:

1. **Named capabilities with no owner.** PNG export, FR-56, FR-58, FR-83, FR-12/FR-72 and the FR-25↔FR-67 seam are each claimed as bound in the frontmatter and governed by nothing. Two epics will each guess.
2. **Whole dimensions silent**, chiefly the **build/packaging envelope** on a greenfield 11-package monorepo — which also makes AD-23 unimplementable as written — plus logging, client error handling, upgrade path, the typeface, and the HTTP/served-surface security posture.
3. **Bloat.** About 56% of the Invariants section is not the Rule. Rationale, self-narration and PRD restatement are woven into the ADs and duplicated across three tables.

One rule (AD-18) is logically unimplementable as written. One gate (AD-28) is designed to start red, which is the exact failure the AD itself argues against. The Stack table holds up on re-verification with one exception: **TypeScript "5.x" is two majors stale** (7.0 stable since 2026-08-20).

The good news: no AD needs to be deleted for being wrong about the system. The revision is additive on coverage and subtractive on prose.

---

## 1. Does it fix the real divergence points for epics, and miss none?

Well fixed and genuinely non-obvious: AD-1/AD-2 (the network seam and the state taxonomy), AD-5/AD-6 (identity key vs container ID), AD-7 (total order), AD-8 + AD-37 (determinism and stability as two properties), AD-9 + AD-34 + AD-35 + AD-36 (the scene as the single contract, with compositing resolved *in* it), AD-12 (one poll loop, per-tab display cadence), AD-27 (recorded vs generated fixtures). These are the calls epics would otherwise diverge on, and they are decided.

**Missed. Findings below.**

### F-1 — PNG export has no owner — **HIGH**

FR-46 requires export as **SVG and PNG**. The string `png` does not appear anywhere in the spine. AD-9 names exactly two rasterisers; the Structural Seed has `raster-svg` and `raster-screen`; the Capability map routes `FR-46..FR-52` to `scene`, `raster-svg`.

PNG cannot be a readback of the live screen surface, because AD-34 makes screen and export **two different scenes** (masking on for export, off for screen — FR-50/FR-51) and FR-48 puts the legend, bezel and registration marks *inside* the export where the screen has them as chrome (FR-78). So PNG is a third render path. Two epics will resolve it incompatibly — `canvas.toDataURL()` on the mounted surface (wrong mask, missing furniture, violates FR-47/FR-48/FR-50) versus offscreen rasterisation of the export scene. This is a textbook two-unit divergence and the spine is silent.

### F-2 — AD-2's "two kinds of state, and only two" forbids required behaviour, and AD-3 contradicts it — **HIGH**

AD-2 asserts exhaustively: survey-derived state lives in layout; presentation state is frame-local in the screen rasteriser; nothing else.

- **FR-56** — a detail panel whose subject vanished between surveys *stays, freezes its values, and reads "Not in the last survey."* That frozen copy is neither survey-derived-in-layout nor frame-local-in-the-rasteriser. FR-56 appears **nowhere** in the spine. A builder obeying AD-2 literally cannot build it.
- View state is a third store, and AD-3 says so in its own title ("two stores"). Hop reach (FR-23), *Keep only this* (FR-32), filters, search text and the masking toggle all live there and survive frames. AD-2's "only two" is false as written.

Either AD-2's taxonomy needs a third category with its own rules, or FR-56 needs an explicit home. As it stands the spine's most-cited AD ("Binds: all") is internally inconsistent with the AD that follows it.

### F-3 — AD-18's Rule is logically unimplementable — **HIGH**

> "When Portolan is running but the browser cannot reach it at the default binding, the user gets a full-surface screen in FR-57's register…"

If the browser cannot reach Portolan, nothing serves that screen. AD-17 binds host mode on `127.0.0.1` with manager placement; a browser on any other machine fails at TCP connect and sees the browser's own error page. FR-57 works precisely because the asymmetry is real there — the *server* is reachable, the *socket* is not. AD-18 has no such asymmetry to exploit.

The underlying product need is legitimate and correctly raised upstream, but the architectural answer has to be something a builder can actually build (documentation, a startup log line, a deliberately-bound explanation listener, a first-run README step). As written the AD reads as satisfied by an epic that cannot possibly satisfy it.

### F-4 — FR-83 is claimed as bound and is governed by nothing — **HIGH**

The frontmatter binds `FR-76 … FR-83`. FR-83 appears in that line and nowhere else in the document.

FR-83 requires search to **reach objects a filter has removed** and report them as *found and filtered*. AD-35 places "the set search lights (FR-36, FR-37)" in `scene` — but the scene is built from the filtered population. So: does search match against the filtered scene or the unfiltered model, and where does the "found but filtered" signal come from? This is exactly a filtering-epic versus search-epic divergence, and the PRD marks it load-bearing ("otherwise search would lie about what the cluster contains, which is the one thing Portolan exists not to do").

### F-5 — The FR-25 ↔ FR-67 seam is missing from AD-35 — **MEDIUM-HIGH**

FR-67 drops network badges from the mark rail when they no longer fit. FR-25 makes the detail panel carry the complete network list **whenever FR-67 has dropped badges**. That is a rasterisation-level geometric fact that chrome must know.

AD-35 enumerates what `scene` derives and hands chrome — legend contents, *Fit to chart* extents, orphan count, search lights — and omits this one. AD-10 forbids chrome reading anything off the map surface; AD-35 forbids chrome recomputing it. So FR-25's conditional is currently unbuildable without violating one of the two. The list in AD-35 needs to be closed ("everything chrome needs, and here is the complete set") or extended.

### F-6 — FR-58 is unaddressed and collides with three ADs — **MEDIUM**

FR-58: on an empty cluster the **node backdrop renders even though it is off by default**. FR-58 appears nowhere in the spine. But the backdrop is simultaneously: a persisted preference (AD-20), an input to the pure layout's `mode` (AD-8), part of the surface key `(view, subject, mode, seed)` (AD-33), and one of FR-16's three sanctioned relayout actions (AD-3).

A population-derived override of `mode` is a fourth path into layout. The spine neither permits it nor forbids it, and the two plausible epic readings (override the mode input vs. draw the backdrop as a scene treatment without re-laying) produce different surface keys and different behaviour when the cluster stops being empty.

### F-7 — Health classification (FR-12, FR-72) has no home — **MEDIUM**

Neither FR appears anywhere in the spine, and no capability-map row covers them. The `running = desired` / `0 < running < desired` / `running = 0` counting is Swarm replica semantics. If an epic puts it in `scene` or `chrome`, the renderer acquires a fourth Docker-ism beyond the three NFR-6 names, directly breaching AD-4's Rule. If it goes in `model`, AD-4 is fine — but nothing says so, and FR-12's "absence is the fourth value" is a model-shape decision (nullable health) that both ends import.

---

## 2. Is every AD's Rule enforceable, and does it actually prevent its stated divergence?

Mostly yes, and three ADs are exemplary because they name the mechanism rather than the intention: **AD-3** (layout invocation counter, with an explicit argument for why the determinism test cannot substitute), **AD-8** (a named ban list: `Math.random`, clock reads, uncompared sorts, frame timing), **AD-37** (a scripted survey sequence). **AD-15** and **AD-19** correctly convert promises into constructions. Exceptions:

### F-8 — AD-15's Rule does not deliver AD-15's own claim under the named stack — **MEDIUM**

AD-15 claims "This turns *we wrote no writes* into *we cannot write one*", with the Rule "The underlying HTTP client refuses any method other than `GET`." The Stack names **dockerode 5.0.1**, whose transport runs through `docker-modem`. The Rule does not say **where** the guard sits. One epic wraps dockerode's API surface (a wish — the next helper added bypasses it); another installs a rejecting `http.Agent`/socket-level interceptor (the only version that is by construction). Those are not the same guarantee, and the AD's own sentence is only true of the second. Name the layer.

### F-9 — AD-7 diagnoses its own enforcement gap, then closes it with nothing — **MEDIUM**

Its Prevents line says outright: *"The determinism test does not catch it — it replays one fixture in one order."* Unlike AD-3 and AD-37, which each add the test their invariant needs, AD-7 adds none. A shuffled-input test (replay the same recorded fixture with collections permuted, assert identical positions) is the obvious mechanism and is absent. Without it AD-7 is a discipline, and it is the discipline whose violation the spine says nothing else will catch.

### F-10 — AD-4's "exactly three places" clause is unenforceable and already strained — **LOW-MEDIUM**

No lint or dependency rule can detect a fourth Docker-ism when `model` is deliberately shared by both ends. And the spine already adds candidates: node view's machine regions and region headers (AD-33, AD-36), slot semantics surfaced in identity keys (AD-5), and health counting (F-7). Either give the clause a mechanism (e.g. the three couplings live in named modules and a test asserts nothing else imports Docker vocabulary from `model` beyond the model types) or downgrade it from a Rule to a convention.

### F-11 — AD-20 names no mechanism, no owner and no namespace — **LOW-MEDIUM**

"persist in the browser" — `localStorage`, `sessionStorage` or IndexedDB? Which package owns it? The dependency graph gives persistence no home: `view-state` has no outgoing edges and `chrome` reaches it, but neither is named as the writer. Nine separate preferences are listed (palette, theme, text size, density, motion, masking, zone mode, backdrop, interval) and they will be written by several epics. A key namespace and a single owning module is a one-line decision that prevents nine small divergences.

### F-12 — AD-12's threshold margin is a number nobody sets — **LOW**

"an **absolute** survey age strictly greater than the largest selectable interval plus a margin." The margin is not a figure, not an AD-23 token, and not a Deferred row. It is the value that decides whether FR-5's guarantee ("choosing 60s must never by itself pale the chart") actually holds at the 60s setting, where the poll loop's own jitter is the whole budget.

---

## 3. Could anything under Deferred let two units diverge?

### F-13 — The screen-rasteriser-backend deferral is nominal — **MEDIUM-HIGH**

AD-2 puts breathing phase, the relayout tween, enter/exit lifecycle timers, cold-load sequencing and the veil's wall-clock repaint **in the screen rasteriser**. Those are four distinct PRD capabilities (FR-71, FR-40, FR-53, FR-54) that different epics will build. The first epic to open `raster-screen` makes the Canvas2D/WebGL call de facto, and every later epic inherits it.

The stated revisit condition — "output of the AD-29 harness at 396 objects" — requires a harness that requires `scene`, so the measurement arrives *after* the bet is placed. AD-9's reversibility claim protects the *scene contract*, not the four capabilities built on top of the backend. The spine needs either an ordering constraint (the backend is decided before the first `raster-screen` commit, by the harness epic) or a named owner.

### F-14 — AD-28's gate is designed to start red and stay red — the exact failure AD-28 argues against — **MEDIUM-HIGH**

AD-28's own reasoning: *"A gate that fails on correct behaviour gets disabled, which would cost more than the gate is worth."* Then two Deferred rows guarantee precisely that:

- *Light-palette tint collision* — "**the build starts red** and stays red until design corrects the palette."
- *Completing NFR-11's exemption set* — revisit condition "**Before AD-28's gate is first enabled**", owner design.

So the blocking gate cannot be enabled at v1 start, and if it is enabled it blocks every merge on a defect no code change can fix. No interim rule is given (advisory-until-baseline, an explicit known-failure allowlist with an expiry, or gating the gate on the exemption set landing). Epics will each decide how to get their merge through, which is exactly how gates die.

### F-15 — §7.2 mark sizing is deferred with no interim rule, on a contradiction the PRD says is real — **MEDIUM**

The PRD calls it "contradictory as specified, not merely undecided" and names three mutually exclusive resolutions with different costs. The spine defers it to "product and design" with revisit = harness output. Meanwhile the mark rail's capacity and drop order is `scene` geometry the rendering epic must write, and FR-25 (chrome) depends on its outcome (F-5). Every epic touching marks at the landing level guesses. An interim default ("build to FR-67's 8px floor with badges dropping; the landing-level budget is a scene parameter with one default and one place to change it") would cost one sentence and remove the guess.

Other Deferred rows are sound: the layout library, text-size ceiling, stillness threshold, NFR-20 glyph verification and FR-63's legend arithmetic are all single-owner values or design judgements, correctly scoped, with real revisit conditions.

---

## 4. Is named technology verified-current?

The Stack table is headed "Verified current on 2026-09-11 and 2026-09-14". Re-verified independently against primary sources on 2026-09-14:

| Claim | Actual | Verdict |
| --- | --- | --- |
| Node.js 24 LTS, maintenance 2026-10-20, EOL 2028-04-30 | v24.21.0; both dates exact per `nodejs/Release` `schedule.json` | Correct today — **flips in five weeks** (see F-31) |
| TypeScript 5.x | **7.0.2** (2026-08-20); 6.0 shipped 2026-03-23; 5.9.3 ends the 5.x line | **STALE by two majors** (see F-32) |
| React 19.3 | 19.3.0, published 2026-09-09 | Correct, and five days old |
| dockerode 5.0.1 | 5.0.1, latest | Correct |
| `node:test` stable since Node 20 | Stability 2 – Stable, "v20.0.0 — the test runner is now stable" | Correct |
| Playwright | `@playwright/test` 1.63.0, active | Correct |
| GHA `ubuntu-24.04` + `ubuntu-24.04-arm`, GA and free on public repos | Both listed with no preview or deprecation marker; arm64 public-repo runners GA since 2025-08-07; `ubuntu-latest` still maps to 24.04; `ubuntu-26.04` is still **public preview** | Correct |
| `node:24-alpine`, multi-arch amd64 + arm64 | Tag pushed 2026-09-09; manifest carries linux/amd64 and linux/arm64/v8 | Correct |
| GHCR + Docker Hub | — | Correct |

### F-32 — TypeScript "5.x" is two majors stale — **MEDIUM**

TypeScript 6.0 shipped 2026-03-23 and **7.0 (the native port) went stable 2026-08-20**; current is 7.0.2. "5.x, server and client" is not a defensible pin for a greenfield repo started today — and the choice is not cosmetic, since 7.0 is a different compiler implementation with different build-tooling implications, which compounds F-19 (no build envelope decided). The spine should name 7.0, or name 6.0 with a stated reason.

### F-31 — The Node 24 claim expires inside the v1 build window — **LOW**

Node 24 is Active LTS on 2026-09-14 and drops to Maintenance on **2026-10-20**; Node 26 becomes Active LTS on 2026-10-28 (not 10-20 — the spine's parenthetical conflates the two events). The dates themselves are exact. Reword to "Active LTS through 2026-10-20, maintenance to 2028-04-30" so an epic author five weeks from now does not read a stale assurance, or move to 26.

Independent of currency, the table's **omissions** are findings in their own right and are reported under §6: no package manager, no workspace tool, no bundler (F-19), no HTTP server library (F-24), no typeface (F-23).

---

## 5. Does it cover the driving spec's capabilities?

Broad coverage is good — the Capability → Architecture map is a genuine asset and most FR groups route to a package and an AD. The gaps are F-1, F-2 (FR-56), F-4 (FR-83), F-6 (FR-58) and F-7 (FR-12/FR-72) above, plus bookkeeping:

### F-16 — The frontmatter `binds` overclaims — **LOW**

FR-83, FR-56, FR-58, FR-12, FR-72, FR-23, FR-24 and FR-39 all fall inside claimed ranges and are governed by no AD. FR-35 is listed both in the "Not governed here" line *and* in AD-35's Binds. A binds list that is not true is worse than no binds list: an epic author reads it as an assurance of coverage.

### F-17 — Capability map assigns FR-82 to the wrong package — **LOW**

FR-82 (a stack outline's position is *derived* from where layout placed its members) is routed to `model` under AD-4/AD-5/AD-6. It is a placement-derivation rule and belongs to `layout` or `scene`. Minor, but it is the kind of row an epic author follows literally.

### F-18 — The PRD's #1 carried question is answered with an apparatus, not an answer — **MEDIUM, informational**

The PRD is emphatic: §7.1 "is the first thing architecture must answer — before a rendering library is chosen, and before any story is written." The spine's answer is that it is "a measurement, not a decision", and it supplies the means (AD-9, AD-26, AD-29). That is a defensible architectural position and the spine states it honestly. But the revisit condition is "a real cluster of NFR-7 order, plus the harness", and nothing in the spine says what happens to epic sequencing if that cluster does not exist — nor which epic owns building the harness first. Given that AD-29 declares the harness "a v1 deliverable, not a convenience tool", making it epic #1 is the missing ordering constraint.

---

## 6. Is every dimension the altitude owns decided, deferred, or an open question?

Decided and well covered: deployment topology and exposure (AD-16 … AD-19, AD-21, AD-22, AD-32), data lifecycle (AD-19, AD-20), testing strategy (AD-26 … AD-31), performance verification (AD-29, AD-30), accessibility floors (AD-23, AD-28), localisation (AD-24, with caveats), CI/CD (AD-32).

**Silent dimensions:**

### F-19 — The build and packaging envelope is entirely SILENT — **HIGH**

A greenfield repository, an 11-package monorepo in the Structural Seed, React + TypeScript, and NFR-4 requiring every byte the browser needs to be served from the image. The spine names **no package manager, no workspace tool, no bundler, no TypeScript build strategy, and no dev-server story**. The Stack table stops at "TypeScript 5.x, server and client".

This is the canonical feature-altitude divergence for a greenfield repo: the first two epics to create packages each pick, and the second one is a rewrite. It also makes **AD-23 unimplementable as written** — one token file imported by "the renderer, the CSS, the layout stage and the tests" cannot be satisfied without deciding the file's format and whether CSS custom properties are generated from it. And it leaves NFR-4's air-gap enforcement (no CDN, no external module) with no mechanism, on a product whose brief calls that out.

There is also no local-development story: with recorded fixtures (AD-27) available, whether an epic can run the client without a Swarm cluster is undecided, and every front-end epic needs it.

### F-20 — Observability and logging is SILENT but for three words — **MEDIUM**

AD-21 lists "log level" as an environment variable. That is the entirety of it. No destination (AD-19 forbids writable paths, so it must be stdout — but nothing says so), no format, no decision on what is logged. Meanwhile the spine creates events that nobody owns: poll-loop ticks and interval renegotiation (AD-12), SSE connect/disconnect (AD-11), survey failure and last-good replay (AD-13), the AD-15 GET guard tripping, engine-version rejection (FR-64). A read-only container with no persistence and no UI for errors has **logs as its only diagnostic surface**, and no AD governs it. Two epics will produce two logging idioms in one server package.

### F-21 — Client-side error handling is SILENT — **MEDIUM**

The Errors convention row covers exactly one case: a failed survey is a product state (AD-22, FR-54). Nothing covers a malformed or partial SSE payload, an exception thrown inside layout or scene generation, an export failure, or a `raster-screen` context loss. AD-10 gives React the chrome and names no error boundary. On a product whose central promise (FR-54) is *the map never disappears*, an unhandled throw on the map surface is precisely the state that needs a decided behaviour, and it has none.

### F-22 — Upgrade and migration path is SILENT — **MEDIUM**

AD-32 makes a `v*` tag publish a multi-arch image. Nothing decides the versioning scheme (what a `v*` tag means), what a user does to upgrade, or — the one that actually bites — **what happens to AD-20's persisted browser preferences when their shape changes between versions**. Nine stored keys, no schema version, no migration rule, no "unknown value falls back to default" rule. The first epic that renames a preference breaks every existing tab. Also undecided: the policy for raising FR-64's minimum Docker Engine API version.

### F-23 — The typeface is neither decided nor deferred — **MEDIUM**

NFR-20 demands a monospaced face with a serifed lowercase `l` and a slashed zero; NFR-4 demands it embedded in the image; NFR-17 makes AGPLv3 compatibility a hard filter. AD-26 says only that "the face is pinned in the AD-23 token file and embedded in the image". **No face is named**, it is absent from the Stack table, and it is not a Deferred row with an owner. It is the product's one external asset dependency with a licence constraint and an accessibility requirement riding on it, and it falls through every list in the spine. (The Deferred row for NFR-20's *glyph verification* presupposes a face that nothing selects.)

### F-24 — The served-surface security posture is SILENT — **MEDIUM**

AD-15 … AD-18 cover the Docker socket and the network binding thoroughly. Nothing covers what Portolan itself serves:

- **No CSP.** A restrictive `Content-Security-Policy` is exactly the move AD-15 makes for GET-only — it converts NFR-4's "no CDN, no external font, no external asset" from an intention that holds while nobody adds a `<script src>` into a mechanism that cannot be violated. The spine makes that move for the socket and declines to make it here.
- **No Origin/Host check on the SSE endpoint.** An unauthenticated server bound to `127.0.0.1` is still reachable by any page the operator's browser loads (classic DNS-rebinding / cross-origin read). The full topology with one-click export leaking to a web page is the artefact the brief warned against, arriving through a different door than the one AD-17 closed.
- **No HTTP server library named** (bare `node:http`? Fastify? Express?) — a Stack-table gap as well as a security-surface one.

### F-25 — Documentation is SILENT as a dimension while two ADs depend on it — **LOW-MEDIUM**

AD-16 puts the optional whitelist proxy "in the README as **optional** hardening". AD-17's entire accepted cost — named as such, and it strands the executive-viewer persona and success criterion #3 — rests on a human finding and uncommenting a line in `portolan.stack.yml`. For a product whose NFR-1 promise is *one `docker stack deploy`*, the README is the first-contact surface and arguably the highest-leverage deliverable after the image. No AD owns it, nothing says it is a v1 deliverable the way AD-29 says the harness is, and nothing constrains what it must contain.

---

## 7. Is it terse and convergent?

**No.** This is the largest single finding by volume.

### F-26 — About 56% of the Invariants section is not a Rule — **MEDIUM**

Measured: the Invariants & Rules section runs 5,358 words. The 37 `Rule:` lines account for 2,371 (44%); the 37 `Prevents:` lines a further 1,284 (24%); the remaining ~1,700 words (32%) are supplementary paragraphs. And the Rule lines themselves carry embedded rationale. A builder looking for the constraint reads three to five times more prose than the constraint.

Concrete instances of rationale, narration or PRD restatement that a builder cannot obey:

- **AD-2** — the entire "Consequence worth naming" paragraph explains *why* FR-71's guarantee is structural. It constrains nothing.
- **AD-6** — the "Declared departure from FR-13" paragraph, which is stated again verbatim in "Raised upstream".
- **AD-16** — the Rule is one sentence; the remaining four are an argument about NFR-3's promise-versus-mechanism distinction, restated from the PRD.
- **AD-17** — the "Accepted cost, named" paragraph restates PRD §1 and success criterion #3.
- **AD-20** — the closing paragraph argues with two UX spines; the same argument appears in "Raised upstream".
- **AD-23** — the "Scoping it to colour would orphan the load-bearing half" paragraph is a justification of the Rule's scope; the accepted cost below it is repeated in "Raised upstream".
- **AD-25** — "Accepted cost, named and chosen: the heaviest runtime among the options weighed…" is a decision log entry.
- **AD-28** — the last four sentences are an argument about the exemption set, repeated in **both** "Raised upstream" **and** "Deferred". Three copies.
- **AD-29** — the Prevents line and the harness paragraph narrate at length.
- **AD-31** — "What closing that scope would have left unguarded, and where it is guarded instead" is a cross-reference index, not a constraint.
- **AD-37** — the closing paragraph re-explains AD-5 and AD-6.
- **Deferred table** — the "Why it can wait" column is essay. The *Layout library* row restates six FRs and surveys Sigma/Cytoscape/vis-network; the *FR-63* row restates §7.4's arithmetic; the *§7.2* row restates §7.2.
- **Prevents lines that quote PRD narrative verbatim**: AD-5 (the founding scenario), AD-17 (the brief's warning), AD-33 (a full FR-16 sentence).

### F-27 — Self-narration dates the document instead of constraining a builder — **LOW**

"the defect this spine carried until reconciliation" (AD-8); "none of them was covered until reconciliation asked what a closed browser scope was silently dropping" (AD-31); "The user, asked for a leaning, answered honestly that he did not have one" (Deferred, §7.2); the stray `[ADOPTED]` tag on AD-16 alone, which appears on no other AD. These record the process, not the invariant. An epic author six months from now reads them as noise.

**Suggested shape:** each AD as Binds / Prevents (one sentence) / Rule (imperative, testable) / Enforcement (named mechanism, where one exists). Everything else — accepted costs, departures, decision rationale — moves to the existing "Raised upstream" table or to a separate decision log. On the current text that is roughly a 40% cut with no loss of constraint.

---

## 8. The spine's own test, applied to itself

> *"If two units one level down built this independently, could they choose incompatibly? Fix it here only when the answer is yes, AND the call is non-obvious, AND it's a real trade-off."*

**Direction A — invariants missing that the test demands:** F-1 (PNG), F-2 (FR-56 / the third store), F-4 (FR-83), F-5 (FR-25↔FR-67), F-6 (FR-58), F-7 (FR-12/FR-72), F-11 (preference storage), F-19 (build envelope), F-20 (logging), F-21 (client errors), F-22 (preference migration), F-23 (typeface), F-24 (CSP / SSE origin). Every one of these is a *yes* on all three clauses.

**Direction B — ADs that fail the test:**

### F-28 — AD-24 is a restatement of NFR-18, not an added constraint — **MEDIUM**

NFR-18: *"strings externalised from the first commit, French shipped. A new language is a file, not a code change."*
AD-24's Rule: *"One catalogue per language; no string literal in any component. A new language is a file, not a code change."*

The second clause is verbatim. Meanwhile the real divergence points go undecided: catalogue format, key convention, interpolation and pluralisation, the default-language fallback rule, and — a genuine seam — how `scene` and `layout` obtain text when the dependency graph gives neither an edge to `i18n` (FR-63's legend contents and FR-52's masking statement are scene-derived per AD-34/AD-35 yet must be localised). The AD occupies the slot without deciding anything; rewriting it to decide the format and the `scene`↔`i18n` seam would make it earn its place.

### F-29 — AD-18 is a product requirement, not an invariant — **MEDIUM** (see also F-3)

Only one unit builds a screen. There is no second unit to diverge from it. The spine correctly raises it upstream and should leave it there; what belongs in the spine is at most the seam it needs, not the screen itself.

### F-30 — AD-19 is largely the obvious call — **LOW**

"No volume, no database, no disk cache, no writable path" follows from NFR-1's disposable single-container deploy and from AD-16/AD-21 already in place. The non-obvious half is the last sentence (fonts and assets baked read-only) and the interaction with AD-20. Fold it; it does not need a numbered AD of its own.

Borderline but defensible, and I would keep them: **AD-15** (not strictly a two-unit divergence, but it converts a promise into a mechanism over time, which is worth an AD), **AD-30** (its value is the honest negative — it tells epics *not* to build a latency gate), **AD-22** (genuinely non-obvious, and a real trade-off against orchestrator-visible health).

---

## Findings index

| # | Severity | Finding |
| --- | --- | --- |
| F-1 | HIGH | PNG export (FR-46) has no owner; AD-9 names two rasterisers and PNG cannot be either |
| F-2 | HIGH | AD-2's "two kinds of state, and only two" forbids FR-56 and is contradicted by AD-3's third store |
| F-3 | HIGH | AD-18's Rule is logically unimplementable — an unreachable server cannot serve the screen |
| F-4 | HIGH | FR-83 claimed as bound, governed by nothing; search-vs-filter seam undecided |
| F-19 | HIGH | Build/packaging envelope entirely silent; also makes AD-23 unimplementable as written |
| F-5 | MED-HIGH | FR-25's dropped-badge signal missing from AD-35's list |
| F-13 | MED-HIGH | Screen-rasteriser deferral is nominal; first epic to touch `raster-screen` decides it |
| F-14 | MED-HIGH | AD-28's gate is designed to start red — the exact failure AD-28 argues against |
| F-6 | MEDIUM | FR-58 unaddressed; collides with AD-3, AD-8, AD-20, AD-33 |
| F-7 | MEDIUM | FR-12/FR-72 health classification has no home; risks a fourth Docker-ism vs AD-4 |
| F-8 | MEDIUM | AD-15 does not say where the GET guard sits; only one of two readings is "by construction" |
| F-9 | MEDIUM | AD-7 names its own enforcement gap and adds no test |
| F-15 | MEDIUM | §7.2 mark sizing deferred with no interim rule, on a contradiction the PRD calls real |
| F-18 | MEDIUM | §7.1 answered with an apparatus but no epic-ordering constraint (harness must be epic #1) |
| F-20 | MEDIUM | Observability/logging silent but for one env var |
| F-21 | MEDIUM | Client-side error handling silent |
| F-22 | MEDIUM | Upgrade/migration silent, including preference-schema migration |
| F-23 | MEDIUM | Typeface neither decided nor deferred, with NFR-17/NFR-4/NFR-20 riding on it |
| F-24 | MEDIUM | Served-surface security silent: no CSP, no SSE origin check, no HTTP library named |
| F-32 | MEDIUM | TypeScript pinned at "5.x" — two majors stale; 7.0 stable since 2026-08-20 |
| F-26 | MEDIUM | ~56% of the Invariants section is not a Rule; rationale duplicated across three tables |
| F-28 | MEDIUM | AD-24 restates NFR-18 and decides nothing |
| F-29 | MEDIUM | AD-18 is a product requirement, not an invariant |
| F-10 | LOW-MED | AD-4's "exactly three places" is unenforceable and already strained |
| F-11 | LOW-MED | AD-20 names no storage mechanism, owner or key namespace |
| F-25 | LOW-MED | Documentation silent while AD-16 and AD-17 depend on it |
| F-12 | LOW | AD-12's veil margin is a number nobody sets |
| F-16 | LOW | Frontmatter `binds` overclaims; FR-35 listed on both sides |
| F-17 | LOW | Capability map assigns FR-82 to `model` |
| F-31 | LOW | Node 24 Active-LTS claim expires 2026-10-20; the parenthetical conflates two dates |
| F-27 | LOW | Self-narration and the stray `[ADOPTED]` tag date the document |
| F-30 | LOW | AD-19 is largely the obvious call |

## What is genuinely good, and should survive revision

Recorded so that a revision pass does not cut the load-bearing parts:

- **AD-8 + AD-37** — separating determinism from stability, and testing them differently, is the single best call in the document. The ban list inside AD-8 is exactly the right register for a Rule.
- **AD-9's compositing clause** — resolving composited colour *in the scene* is what makes AD-28's "3:1 over the worst composited field" computable at all. That chain (AD-9 → AD-28 → AD-29) is the spine's strongest reasoning.
- **AD-5 + AD-6 + AD-37's redeployment case** — identity on the slot rather than the container ID, with the test that proves nothing moves after `docker stack deploy`, directly answers the founding scenario.
- **AD-12** — one poll loop at the minimum interval, per-tab display cadence, staleness from an absolute threshold. A real divergence, a real trade-off, correctly decided.
- **AD-3's invocation counter** and **AD-30's honest negative** — two models for how the rest of the ADs should name their enforcement.
- **AD-27** — recorded versus generated fixtures, never mixed, is a cheap rule that prevents an expensive class of false confidence.
