# Reviewer gate — lens: internal consistency

**Target:** `_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md` (480 lines, 37 ADs)
**Lens:** the document read as a closed system — AD against AD, diagrams against ADs, tables against ADs, frontmatter against body.
**Date:** 2026-09-14

**Verdict:** the spine is broadly coherent and the AD-2/AD-8 defect named in the brief *is* resolved at the AD level — but the reconciliation did not propagate to the surrounding apparatus. **16 genuine inconsistencies**: 2 high, 7 medium, 7 low. The single most consequential class is that the amended ADs (AD-2, AD-3, AD-8, AD-12, AD-35) are now contradicted by the summary surfaces that were not re-read — the Structural Seed, the dependency diagram, the Consistency Conventions table, the pipeline diagram and the frontmatter.

## Clean checks (no findings)

- **AD ids.** 1 … 37, unique, strictly ascending, none missing, none reused. No reference anywhere to an AD id outside 1-37.
- **Mermaid validity.** All four blocks are syntactically valid: the pipeline `flowchart LR` (two subgraphs, two `end`s, chained `-->`, `-.->|"…"|` and `==>|"…"|` edges all well-formed), the dependency `flowchart TD`, the deployment `flowchart TB` (nested subgraph, both `end`s present), and the `erDiagram` (all seven relationship lines use valid cardinality tokens and quoted multi-word labels). No unquoted special characters in node text; every node id is unique within its diagram.
- **Source tree vs diagrams.** Every package node in the dependency diagram (`tokens, i18n, model, collector, server, layout, scene, raster-svg, raster-screen, chrome, view-state, harness`) exists in the Structural Seed, and the seed lists no package no diagram or AD references.
- **Capability → Architecture Map, referential integrity.** Every `Lives in` value resolves to a directory in the Structural Seed; every AD id cited exists.
- **Deferred vs decided.** No item is both decided and deferred. Each Deferred row names the AD that keeps the choice reversible, and each of those ADs really does say so (AD-9 for the rasteriser backend, AD-8 for the layout library, AD-23 for the luminance clamp, AD-31 for the journey tests, AD-35 for FR-63). The one exception is the gate-enablement contradiction in F9 below, which is a sequencing conflict rather than a decided/deferred collision.
- **`scripts/lint_spine.py`** reports `ok: true`, 0 findings.

---

## Findings

### F1 — HIGH — The Structural Seed still carries AD-8's pre-reconciliation layout signature

- **Location A:** Structural Seed, `layout/ # pure (model, seed, mode) -> positions (AD-8)`
- **Location B:** AD-8 Rule: `(model, previousPositions, seed, mode) → positions`, and AD-8's Prevents names the missing previous-positions input as *"the defect this spine carried until reconciliation"*
- **Correct:** B. The memlog records the amendment explicitly (*"AD-8: la signature devient (modèle, positionsPrecedentes, graine, mode)"*). The seed comment is a stale copy of the exact signature the reconciliation removed, and it is the line a builder scaffolding the repo reads first.
- **Also affected:** AD-37's whole stability rule (survivors must not move) is inexpressible against the seed's signature, and AD-33's per-surface layout state is keyed on `(view, subject, mode, seed)` — also not the seed's signature.
- **Fix:** `layout/ # pure (model, previousPositions, seed, mode) -> positions (AD-8, AD-37)`.

### F2 — HIGH — Three locations disagree about how a relayout action reaches `layout`, and the dependency graph provides no path at all

- **Location A:** AD-3 Rule, first sentence: *"View state has no write path into layout."* Second sentence: *"only the three actions FR-16 names … may call layout."*
- **Location B:** Consistency Conventions, `State — mutation`: *"View state **writes to layout** through the three FR-16 actions and nowhere else (AD-3)."*
- **Location C:** Design Paradigm diagram: `VS -.->|"3 named actions only"| LAY` — an arrow from view state into layout.
- **Location D:** Dependency direction diagram: **no `VST --> LAY` edge and no `LAY --> VST` edge**, plus the prose *"An arrow means may import. There is no arrow back up, anywhere."*
- **Correct:** A's first sentence plus D, read together with `SCN --> LAY` and `SCN --> VST` — i.e. `scene` reads view state and invokes layout, and `view-state` itself never touches layout. That reading is the only one consistent with AD-10 (chrome reaches nothing across the seam), with AD-36 (picking writes identity keys *into* view-state, nothing further), and with the dependency graph as drawn.
- **Under that reading B is wrong** ("writes to layout" asserts a write path AD-3 denies in the same breath) and **C is wrong** (the arrow should originate from the scene stage, or be labelled as a data dependency rather than an invocation).
- **Consequence:** as it stands, the document names three different callers of `layout` (view-state, scene, nobody) and the one authoritative diagram names none. This is precisely the divergence point AD-3 exists to close.

### F3 — MEDIUM — "One stateful stage" is asserted in four places and contradicted by AD-13, in a box the spine's own diagram draws

- **Location A:** frontmatter `paradigm: '… one stateful stage'`; Design Paradigm prose *"Every stage is a pure function of its input **except layout**, which is the pipeline's single stateful stage"*; pipeline diagram `LAY["layout<br/>the one stateful stage"]`; Conventions `State — mutation`: *"Layout is the only stateful stage (AD-2)."*
- **Location B:** AD-13 Rule: *"The server **retains** the last successful survey **in memory** and replays it …"* — state held across calls, in a stage, outside layout. The pipeline diagram draws it: `CACHE["last good survey<br/>in memory"]`, inside the server subgraph.
- **Correct:** B. The cache is load-bearing (AD-14's first branch, FR-54, FR-55 all depend on it) and cannot be removed. A is over-stated.
- **Note on the amendment:** AD-2's amended text is conspicuously careful here — it enumerates *"Collector, model and the SVG serialiser hold nothing across calls"* and silently omits the server. That omission is what lets the contradiction survive: the enumeration is true, the summary sentence built on it is not. The honest form is *layout is the only stage holding **survey-derived** state; the server holds the survey itself* — which is the distinction AD-2's own two-kinds-of-state framing already supports.

### F4 — MEDIUM — AD-2 ("pure except layout") and AD-8 ("layout is a pure function") are reconciled only by an owner the document never names

- **Location A:** AD-2 Rule: *"Survey-derived state — positions, retained cells, the identity of what was present last survey — **lives in layout and nowhere else**."*
- **Location B:** AD-8 title and Rule: layout is a **pure, deterministic function** whose previous positions arrive as an **input**. A pure function holds nothing between calls, so it cannot be where previous positions live.
- **Correct:** both, but only if some store adjacent to the pure function holds them — which AD-33 implies (*"Three surfaces … each holding its own layout state, keyed by `(view, subject, mode, seed)`"*) and no rule states.
- **Assessment against the brief's known defect:** the old flat contradiction (AD-2 "layout is the only stateful stage" vs AD-8 "layout is a pure function") **has** been genuinely narrowed — AD-2 now distinguishes survey-derived from presentation state, which is a real fix. But it moved the residue rather than closing it: the `layout` package is simultaneously described as pure (AD-8), as the holder of survey state (AD-2), and as a set of per-surface stores (AD-33), and no location says the package is *a pure kernel plus a per-surface position store*. One sentence in AD-8 or AD-2 would close it, and F1's seed comment is the place it would become visible to a builder.

### F5 — MEDIUM — AD-18's screen cannot be delivered under AD-17

- **Location A:** AD-17 Rule: the stack binds **host mode on `127.0.0.1`**, so a browser on another machine gets a refused TCP connection.
- **Location B:** AD-18 Rule: *"When Portolan is running but the browser cannot reach it at the default binding, the user gets a full-surface screen … stating what is bound, why, and the exact line to change."*
- **Correct:** A is the decision; B is currently unimplementable as written. AD-19 (no second process, nothing written), AD-25/AD-10 (the chrome is React served from the same image) and NFR-1 (one container image) leave no listener that could serve that screen to a browser that by construction cannot open a connection to Portolan. The screen can only exist for a *reachable* Portolan — e.g. a tab already loaded that later loses the server, or a same-host browser hitting a wrong port/path.
- **Fix:** restate AD-18's trigger as a client-side state of an already-loaded tab (symmetric to FR-57, which is also rendered by a loaded app), or name the delivery mechanism. As written, the spine's only new-requirement-with-no-upstream is a screen nobody can see.
- **Related, lower weight:** AD-14 calls its branches *"Three exhaustive branches on tab open"*, yet FR-60's off-chart viewport refusal and AD-18's screen are further first-contact outcomes. "Exhaustive" holds only for *the survey state* on tab open; it is stated unqualified.

### F6 — MEDIUM — AD-12 requires a client→server channel that the Design Paradigm and both diagrams deny exists

- **Location A:** Design Paradigm: *"there is no command side anywhere, so **no stage ever writes back toward its source**"*; pipeline diagram shows exactly one edge toward the server (`SOCK -.-> COL`, GET-only) and one away (`SSE ==> TABM`); AD-11 defines transport as SSE carrying a snapshot.
- **Location B:** AD-12 Rule: *"The server holds **one** poll loop, running at **the minimum interval among connected clients**."* Combined with AD-20 (the refresh interval is a **browser** preference) and AD-21 (it is explicitly **not** an environment variable), the server can only know that minimum if every tab tells it its chosen interval — an upward message from tab to server.
- **Correct:** B — AD-12's rule is the one that prevents a named divergence (per-connection poll loops multiplying load on the manager socket), so it stays. A is over-stated and the pipeline diagram is incomplete: there is a control channel, and it is unnamed and undrawn.
- **Why it matters for consistency:** an undrawn upward channel is exactly where a builder invents something wider than intended. AD-36 was written for precisely this reason on the map seam; the network seam has the same hole and no equivalent AD. (AD-1 does not cover it — it forbids *positional* values on the server, and an interval is not one.)

### F7 — MEDIUM — Frontmatter `binds` disagrees with the body in both directions

Six concrete disagreements, all verifiable by grep:

| # | Frontmatter says | Body says | Correct |
| --- | --- | --- | --- |
| a | FR-35 is *"not governed here"*, *"filter semantics, governed by AD-3 and AD-33 only"* | **AD-35 binds FR-35 explicitly** and rules that the orphan count *"is derived in `scene` and handed to chrome as data"*; the Capability Map's filtering row lists AD-35 | Body. AD-35 genuinely governs FR-35's orphan counter. |
| b | FR-7 is *"not governed here"* | Conventions `Data — the model`: *"An image is an attribute of a container, never an entity (FR-7)"*; Core entities note repeats it | Body — that is a governing convention on the shared model. |
| c | FR-10 is *"not governed here"* | Capability Map row *"Graph model (FR-6..FR-10, FR-82) → AD-4, AD-5, AD-6"* | Frontmatter, probably — but the map's range notation swallows FR-7 and FR-10 silently. One of the two must be narrowed. |
| d | FR-15 is *"not governed here"* | Capability Map row *"Rendering and reading levels (FR-11, **FR-15**, FR-40, FR-65..FR-68) → AD-9, AD-10, AD-23, AD-26"* — FR-15 is named individually, not swept up by a range | Cannot both hold; the map names it deliberately. |
| e | `binds` claims FR-1 … FR-83 minus the named exclusions | **FR-12, FR-14, FR-72, FR-83 appear nowhere in the body** — not in an AD, not in a Capability Map range, not in the Conventions table | Frontmatter over-claims. Either govern them or name them alongside FR-7/FR-10/FR-15. |
| f | `binds` claims NFR-1 … NFR-20 | **NFR-15 appears nowhere in the body** (all other 19 NFRs do) | Frontmatter over-claims. NFR-15 is the PRD's explicit accessibility limit (no screen-reader equivalent of the map, no keyboard traversal of the graph); AD-31's closed browser scope is the natural place to acknowledge it. |

Internal to the frontmatter itself: the third `binds` bullet is self-contradictory — *"Not governed here, and named as such: … FR-31, FR-32, FR-35 **(filter semantics, governed by AD-3 and AD-33 only)**"* both denies and asserts governance in one clause; and the second bullet's range `FR-30 … FR-45` already claims FR-31, FR-32 and FR-35 as bound.

### F8 — MEDIUM — "Raised upstream" says two, and lists six

- **Location A:** section preamble: *"**Two** decisions here have no upstream, or contradict it. **Both** need a PRD or UX-spine amendment …"*
- **Location B:** the table immediately below has **six** rows (AD-6, AD-18, AD-23, AD-8, AD-20, AD-28).
- **Correct:** B. The table is right and complete — every AD that flags a departure in its own body (AD-6 *"Declared departure from FR-13 — raised upstream"*, AD-18 *"New requirement with no upstream"*, AD-23 *"Raised to the UX spine"*, AD-8's density resolution, AD-20's masking persistence against both UX spines, AD-28's incomplete exemption set) appears in it, and it lists nothing the spine does not actually depart from. Only the count sentence is stale from before reconciliation added four rows.
- **Checked and cleared:** AD-29's ~884px operative canvas reads like a departure but is not one — PRD §7.1 already makes that correction, so its absence from this table is right.

### F9 — MEDIUM — Two Deferred rows and AD-32 disagree about whether the AD-28 gate is switched on

- **Location A:** Deferred, *Completing NFR-11's exemption set* — revisit condition: *"**Before AD-28's gate is first enabled.**"* (i.e. the gate is not yet enabled)
- **Location B:** AD-32 Rule: *"On pull request and on `main`: … **the AD-28 gates**, the AD-29 and AD-30 ratchets …"* (i.e. the gate runs now, on every PR), and AD-28 Rule: the computed ratios *"**block merge**"*.
- **Location C:** Deferred, *Light-palette tint collision* — *"AD-28 makes this unavoidable rather than slippable: … **the build starts red** and stays red until design corrects the palette."* (i.e. the gate is enabled from the first build)
- **Correct:** B and C — the gate is enabled from day one and deliberately red. A is then wrong, and dangerously so: AD-28 itself states the exemption set *"is neither exactly right nor complete"* and that *"a gate that fails on correct behaviour gets disabled"*. With A's sequencing removed, the spine ships an enabled gate that is red for two different reasons at once — the intended one (C) and the unintended one (incomplete exemptions) — which is exactly the state AD-28 says destroys the gate.
- **Fix:** make A's revisit condition a dated obligation against the first green build rather than a precondition to enabling, or have AD-32 state that the AD-28 gate lands behind the exemption set.

### F10 — MEDIUM — AD-31 credits AD-34 with guarding FR-52; AD-34 says FR-52 is not computed at all

- **Location A:** AD-31: *"masking (FR-49, **FR-52**) is caught on the scene by AD-34."*
- **Location B:** AD-34 Rule: *"FR-49's *a masked value keeps an identical footprint* becomes a property of the scene, and therefore an assertion AD-26 can make. **FR-52's statement of what survives masking … is chrome text (AD-24), never a derived claim the code computes.**"*
- **Correct:** B. FR-49 is scene-asserted; FR-52 is a string in the i18n catalogue and is not, and cannot be, caught on the scene. AD-31's "what closing that scope would have left unguarded" list therefore claims coverage for one requirement that has none — the precise failure mode that paragraph was written to prevent.
- **Fix:** drop FR-52 from AD-31's list (FR-49 alone is correct), or say FR-52 is covered by AD-24 as catalogue text.

### F11 — MEDIUM-LOW — AD-5's volume key collides with the Core-entities ERD

- **Location A:** AD-5 Rule: *"volume and network → **name**."*
- **Location B:** Core entities: `NODE ||--o{ VOLUME : "hosts"` — volumes are hosted **per node**, which is correct for Swarm's local driver.
- **Conflict:** if a volume belongs to a node, `name` alone is not unique across the cluster; two nodes each with a `pgdata` volume collapse to one identity key — which then drives AD-7's sort order, AD-6's silhouette seed and AD-36's pick key. Every other node-scoped object in AD-5 is keyed with the node in it (global service → `stack/service/**node**`), so the omission looks like an oversight rather than a decision.
- **Correct:** B (the ERD reflects Docker). AD-5 should read `volume → node/name` (or state that volume identity is deliberately cluster-wide and accept the merge, the way AD-6 names its accepted cost).

### F12 — LOW — The identity-key convention row drops one of AD-5's four key formats

- **Location A:** Conventions, `Naming — identity keys`: *"`stack/service/slot`, `stack/service/node`, or bare name, per AD-5. **One key format per object kind**, used for sorting, seeding and lookup alike."*
- **Location B:** AD-5 Rule lists **four** formats — the three above **plus** *"node and service → Docker ID"*.
- **Correct:** B. The row summarises three of four and its "one format per object kind" claim then reads as exhaustive when it is not. Consequential because AD-6 seeds silhouettes from "the identity key" and AD-36 emits "an identity key" — a builder working from the table has no key for nodes and services.

### F13 — LOW — The pipeline diagram draws one scene where AD-34 requires two builds

- **Location A:** Design Paradigm diagram: a single `SCN["scene description"]` node fans out to `RSC` and `RSV`.
- **Location B:** AD-34 Rule: *"Screen and export **each build their own scene** with their own flag — export on by default (FR-50), screen off by default (FR-51), **independent in both directions**."*
- **Correct:** B. The diagram is the pre-AD-34 picture (AD-34 is one of the five ADs added at reconciliation) and, as drawn, it asserts the shared-scene model AD-34 was written to replace — the model under which FR-47's masked export is impossible without a rasteriser rewriting values, which AD-9 forbids.

### F14 — LOW — No package can hand scene-derived data to `chrome`

- **Location A:** AD-35 Rule: legend contents, *Fit to chart* extents, orphan count and search lights are *"derived in `scene` and **handed to chrome as data**"*; AD-10: the map surface is *"mounted once"* and emits pick events *"into `view-state`"*.
- **Location B:** Dependency diagram plus its prose: *"`chrome` does not import `layout`, `scene` or either rasteriser"*, and nothing in the graph imports `chrome`. There is no composition root in the graph and none in the Structural Seed (no `app/`, no entry package).
- **Conflict:** under the edges as drawn, no code may both produce the scene-derived data and reach `chrome` to hand it over, and nothing may both mount the surface and render the React tree. The hand-over is stated as a fact with no package able to perform it.
- **Correct:** A is the intent; the graph and the seed are incomplete. Either name the composition root (a browser entry that imports `chrome`, `scene` and `raster-screen` and wires them) or state that scene-derived data reaches chrome through `view-state` — which the `SCN --> VST` edge would then have to be re-read as, and AD-3 would have to permit.

### F15 — LOW — Capability Map places FR-53 and FR-54 outside the package AD-2 assigns them to

- **Location A:** Capability Map, *States (FR-53..FR-60) → `server`, `chrome`*.
- **Location B:** AD-2 Rule names *"cold-load sequencing"* (FR-53) and *"the veil's wall-clock repaint"* (FR-54) as presentation state that *"lives in the screen rasteriser"* — and the Map's own *Motion* row puts FR-53 in `raster-screen`.
- **Correct:** B. The States row should include `raster-screen`, or FR-53/FR-54 should be visibly split between the two rows the way FR-61 and FR-71 are.

### F16 — LOW — AD-16 carries an `[ADOPTED]` status marker no other AD carries and the document never defines

- **Location A:** `### AD-16 — The Docker socket is mounted directly; no sidecar proxy `[ADOPTED]``
- **Location B:** the other 36 AD headings, which carry no status marker, and the spine's frontmatter/template, which define no such vocabulary.
- **Correct:** B. Either every AD in a draft spine is adopted (making the marker meaningless) or the marker implies the other 36 are not (making the document say something it does not mean). It reads as a leftover from a drafting state.

---

## Cross-reference audit (every AD→AD citation, checked against the cited AD's text)

Verified correct: AD-2→AD-37 (via AD-8's closing line); AD-3→AD-8, AD-33; AD-8→AD-7, AD-37; AD-9→AD-28, AD-35, AD-36; AD-10→AD-25, AD-35, AD-36; AD-13→AD-14 (implicit, consistent); AD-16→AD-15; AD-17→AD-18; AD-20→AD-1, AD-8, AD-19; AD-23→AD-8 (density maximum), AD-28 (exemptions as data — matches AD-28's own wording), AD-29 (stub length and canvas floor — matches AD-29's "read from the AD-23 token file's `layout` namespace"), AD-2 (motion parameters); AD-26→AD-23, AD-31; AD-29→AD-9, AD-23, AD-26; AD-30→AD-29; AD-31→AD-3, AD-26, AD-34 (**one half wrong, see F10**), AD-37; AD-32→AD-8, AD-28, AD-29, AD-30, AD-31; AD-33→AD-3; AD-34→AD-9, AD-24, AD-26; AD-35→AD-9, AD-10; AD-36→AD-5, AD-10; AD-37→AD-5, AD-6, AD-8.

Only F10 is a citation that misstates what the cited AD says. All other citations point at an existing AD that says what the citing AD claims.
