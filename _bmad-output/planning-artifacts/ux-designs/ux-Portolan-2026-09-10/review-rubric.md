# Spine Pair Review — Portolan

## Overall verdict

This is an unusually disciplined spine pair: the frontmatter parses, 122 colour tokens are all six-digit hex with a complete `-light` twin for every one, all 84 distinct `{path.to.token}` references resolve, component names map 1:1 across four separate lists, the canonical DESIGN.md section order is held exactly, and every number in the contrast table was independently recomputed and is correct. A consumer can source-extract most of this cleanly.

What it is not yet is *safe* to extract. Two load-bearing colour statements are wrong or contradictory — the identifier channel that Flow 1's climax rests on is specified at 3.42:1 while the file's own table claims 15.0:1 for it, and the Node view's subject label is an untokenised raw hex measuring 2.49:1 with no light-mode value. A third of the surface area a consumer would build (five named on-screen controls, the Node view's foreground rendering, every detail-panel state, hover) is named but never committed, and the single "known drift" note in the pair is itself stale — it disparages a reference artifact that was already corrected.

Fix the two criticals and the eight highs and this becomes a contract. Everything else is polish.

---

## 1. Flow coverage — adequate

Sources (`brief.md`, `addendum.md`) name no formal user journeys — they carry two personas ("The inheritor", "The Swarm operator"), a founding scenario, success criteria, and two verbatim filter-shaped jobs. Against those: three Key Flows, each with a named protagonist, numbered steps, explicitly labelled climax beats (Flow 1 carries three, matching the three discoveries recorded in `.memlog.md`), and a failure-path block. A "Journey coverage" subsection (EXPERIENCE.md:257–259) maps every IA surface back to a flow. Mechanically this is the strongest category in the pair.

### Findings

- **high** The brief's second verbatim filter job — *"show me only what touches `backend`"* (brief.md §The Solution) — has no mechanism anywhere in EXPERIENCE.md and no flow exercising it. Filters are type-level only ("Filters remove object types from the map (volumes, networks, services…)", EXPERIENCE.md:89); reachability highlight dims rather than removes (line 90); *Isolate* takes a service as subject, never a network (line 87). The word `backend` appears in EXPERIENCE.md exactly once, inside the Echo bubble row. *Fix:* add a scope-to-network filter (or extend *Isolate* to accept a network subject) plus a flow step, or mark the omission `[DEPARTS FROM BRIEF]` with the reason — every other brief contradiction in this pair is marked.
- **medium** Flow 2's heading names the persona "the homelabber" (EXPERIENCE.md:217), not the source's persona name "The Swarm operator" (brief.md §Who This Serves). The `[ASSUMPTION]` note directly beneath does trace it correctly, but the heading itself is the drifted string a consumer will copy. *Fix:* retitle "Tom, the Swarm operator".
- **low** Flow 2's climax (EXPERIENCE.md:228) is a long untranslated French quotation. Deliberate — "The climax is Jules's own, verbatim" — but the file is otherwise English-only per its own Foundation row, and a downstream reader cannot act on it. *Fix:* keep the quote, add the one-line English gloss.

---

## 2. Token completeness — adequate

Extracted: 122 colour tokens, 12 typography roles, `rounded` (6 keys), `spacing` (18 keys), plus seven declared extension namespaces (`motion`, `elevation`, `opacity`, `stroke`, `shape`, `density`, `layout`) and 17 `components` entries — 421 leaf paths in total. Every colour value is a valid six-digit hex; **every** non-`-light` token has a `-light` twin and every `-light` token has a base (zero exceptions). 84 distinct `{path.to.token}` references across both files; all resolve except one wildcard and the generic `{token}` placeholder in prose. The contrast table (DESIGN.md:535–548) covers 12 combinations with per-row floors — I recomputed all of them (15.0, 18.1, 15.1, 3.3/3.0, 1.18/1.13, 3.2, 4.2, 4.4…) and every stated number is accurate. That table is genuinely measured, not asserted.

### Findings

- **critical** The identifier channel contradicts itself. The contrast table's first row states *"Identifier on bubble body — 15.0 / 18.1 — floor 7:1 — this is the channel `pgdata` vs `pg-data` is read on"* (DESIGN.md:537), but Components → Bubble sets *"identifier beneath in `{typography.bubble-id}` at `{colors.ink-3}`"* (DESIGN.md:644) — `#5D6A74` on `{colors.body-mid}` `#0B1116` measures **3.42:1** dark and 4.74:1 light. A consumer implementing the component ships the file's own declared 7:1 channel at less than half its floor. Compounding: the bubble **name** on the same line is given `{typography.bubble-name}` and **no colour token at all**. *Fix:* set the identifier to `{colors.ink}` (measured 14.98 / 18.08, which is what the table describes) or `{colors.ink-2}` (7.33), give the name an explicit colour token, and name the token each table row measures.
- **critical** The node backdrop label is a raw hex `#46535C` (DESIGN.md:697) with no `colors:` token, **no `-light` counterpart anywhere in the file** — the only colour in the document without one — and it measures **2.49:1** against `band-a` and 2.54:1 against `band-b` in dark mode, at 10px. It is the label of the surface Flow 3 is entirely about. It appears in no contrast row. *Fix:* promote to `colors.node-label` / `colors.node-label-light`, raise the dark value to ≥4.5:1 against the bands, add a table row.
- **high** No contrast row exists for any chassis text. Detail-panel keys and left-menu counts are `{colors.ink-3}` on `{colors.panel}` (DESIGN.md:711, 721) = **3.51:1** dark / 3.84:1 light, below 4.5:1 for 13px sans and 11px mono. The table covers map marks exclusively; the four chrome components (left menu, detail panel, bottom tab bar, chart legend) carry no measured combination at all. *Fix:* add chrome rows and lift `ink-3` where it sets text, or restrict `ink-3` to non-text use.
- **high** Twelve raw hexes live inside the `components:` frontmatter with no `colors:` token behind them: `node-backdrop.band-a` / `band-b` / `band-a-light` / `divider`, `orphan-bubble.fill` / `fill-light`, `detail-panel.header`, `bottom-tab-bar.background` / `background-light`, `chart-legend.background` / `background-light`. Two of them pack **both modes into a single string** that no resolver can split: `detail-panel.header: '#0C1015 / #DDE4E8'` and `node-backdrop.divider: '0.8px #151D23 / #D4DCE1'`. *Fix:* promote all twelve to `colors:` with `-light` twins and reference them; split the two two-mode strings into separate keys.
- **medium** `{colors.pastille-*}` (EXPERIENCE.md:76 and 158) is a wildcard, not a resolvable path — the only unresolvable reference in the pair. *Fix:* name the four family prefixes explicitly, or point at DESIGN.md's Pastille section instead.
- **medium** Orphan tokens — defined, never bound to anything, and in one case contradicting a stated ratio. `opacity.reticle-fine` (0.55) and `opacity.reticle-coarse` (0.80) exist but there is no reticle component and no prose reference; `opacity.zone-isoline` (0.85) is never applied — `stroke.zone.isoline` omits opacity entirely, and if 0.85 does apply then the table's "Zone isoline over its own tint 3.2–3.7" is overstated; `typography.graduation`, `spacing.bezel` (prose hardcodes "A 12px graduated lunette"), `spacing.panel-pad`, `colors.rule` / `rule-light`, `colors.field` / `field-light` are all unused. `colors.steel` is described as a first-class metal ("the second rank", DESIGN.md:516) but its hex is restated verbatim as `pastille-stack-2` rather than referenced. *Fix:* bind each or drop it; decide the isoline opacity and re-measure that row.
- **low** The dark/light resolution rule ("a bare token name is the DARK value; the `-light` suffix carries the light value") lives only in a YAML comment (DESIGN.md:10–15), and no component ever names a light token — every one references the bare name. A consumer must infer suffix-swapping. *Fix:* restate the rule in the body prose, where a human reading the rendered Markdown will see it.

---

## 3. Component coverage — adequate

17 `components:` frontmatter entries; 17 matching `###` visual specs in DESIGN.md in the same order; 23 rows in EXPERIENCE.md's Component Patterns. Kebab-case keys map 1:1 onto Title-case headings and Title-case table rows with no drift in either direction. Behavioural rules are real rules — the Bubble, Echo bubble and Left menu rows each carry several enforceable statements, not one-word descriptions.

### Findings

- **high** Five named components have no `components:` frontmatter entry and no committed visual spec: *Fit to chart*, *Reorganise*, *Isolate*, *Export (SVG / PNG)*, *Survey stamp*. All five have EXPERIENCE.md rows (lines 87, 91, 92, 93, 94); DESIGN.md covers all five in one prose block marked `[ASSUMPTION]` (lines 747–751). A consumer extracting `components:` gets 17 of 22. The gap is honestly flagged in both Open Questions sections, which is the right handling — but the shape is still missing. *Fix:* add provisional frontmatter entries carrying the proposed chip so there is something concrete to correct.
- **high** The **Node view has no visual spec**. `components.node-backdrop` and DESIGN.md:695–697 spec nodes strictly *as background* — "The backdrop is the quietest thing on the map by a wide margin — 1.1:1 band against band. It is a ground, and it must never compete with a zone tint." EXPERIENCE.md:245 says that in tab 2 the nodes are "no longer bands lying under the stacks, but the subject." Nothing anywhere says what a foreground node looks like: `shape.bubble.radius` carries `service` / `container` / `volume` and no `node`, though `colors.pastille-type-node` exists, and EXPERIENCE.md:82 confirms "A node is an object you select in the node view". Flow 3 runs entirely on this surface. *Fix:* add a `node-region` component, or a declared foreground mode of `node-backdrop` with its own radius and label treatment.
- **medium** **Hover is unspecified anywhere in the pair.** EXPERIENCE.md bans keyboard shortcuts outright ("Keyboard shortcuts — none, anywhere", line 146) and puts keyboard traversal out of scope (line 164), so the product is mouse/trackpad only — which makes hover the sole pre-click affordance. DESIGN.md mentions hover only twice, both times to forbid glass on it (lines 517, 763). *Fix:* add a hover rule to Interaction Primitives, or state that there is deliberately no hover state and why.
- **low** `Image` has an EXPERIENCE.md row (line 86) but no DESIGN.md entry. Defensible — it is a negative-space decision, "never a bubble" — but the pairing is asymmetric, and DESIGN.md's Detail panel says nothing about the image line it is supposed to hold. *Fix:* one sentence in Detail panel.

---

## 4. State coverage — adequate

Walked all five IA surfaces (Overview, Node view, Service view, Detail panel, Left menu) against the state list the product's shape implies. State Patterns carries 14 rows and covers the genuinely hard cases well: cold load, end-of-load resolution gesture, alive-at-rest, layout stability, selection, filter-empties-the-map, stale data, socket-unreachable-on-cold-load, empty cluster, below-minimum-viewport, zone-mode switch, reduced motion. Focus state is covered by explicit exclusion rather than omission (keyboard out of scope, stated plainly at line 164) — defensible.

### Findings

- **high** **The Detail panel has no states at all** — no row in State Patterns names it. Missing: its own load treatment; what happens when the selected object disappears on the next 5–10s poll while the panel is open (`{motion.exit}` at line 108 says the *bubble* "fades in place" and stops there); and how the panel behaves under staleness, when the map is paling but the panel's text is not. It is one of five IA surfaces and it is where every one of Flow 1's and Flow 3's factual answers arrives. *Fix:* add rows for load, subject-vanished, and stale.
- **medium** **View-switch load is undefined.** Cold load (line 104) is scoped to Overview. Switching to Node view or Service view is "a complete change of view, not a filter" (lines 42, 244) — does the layered draw replay, or does the view appear instantly? Flow 3's steps 1–2 read as instant but never say so. *Fix:* one row settling it.
- **medium** **Service view has no failure state.** "There is no empty-subject state to design: the view cannot be reached without a subject" (line 38) is fair for entry, but nothing covers the subject service disappearing between polls while the user is inside tab 3. *Fix:* one row.
- **medium** **Node view states exist only inside a flow.** "One machine is fresh and carries nothing → its region renders empty" appears only as a Flow 3 failure path (line 254), and "Empty cluster" (line 113) is scoped to Overview. A consumer reading State Patterns for the Node view finds only the generic "every graph surface" rows. *Fix:* promote the empty-node case into the table.
- **low** The Left menu has no states — filter counts at zero, counts during cold load, the orphan counter when there are no orphans. *Fix:* one row, or an explicit line saying chrome carries no states.

---

## 5. Visual reference coverage — thin

No `mockups/`, `wireframes/` or `imports/` directories exist. `.working/` holds seven files: four design directions (`direction-1-portulan-ancien`, `direction-2-instrument-de-precision`, `direction-3-carte-marine-officielle`, `direction-4-cartographie-editoriale`), `zone-overlap-options-2026-09-10.html`, `shape-study-organic-2026-09-10.html`, and `ia-portolan-2026-09-10.excalidraw`. Exactly **two** are linked inline by path, both from EXPERIENCE.md (lines 46 and 98). Spines-win-on-conflict is stated once, at line 46 — correct placement, correct frequency. DESIGN.md links nothing.

### Findings

- **high** **The pair's only drift note is itself stale, and it defames a correct artifact.** EXPERIENCE.md:46 reads: *"**Known drift:** that file still draws an `Images` filter in the left menu and still lists 'are images graph nodes?' as open."* I read the file: 79 elements, the left-menu filters are `Réseaux / Volumes / Stacks / Conteneurs` with no Images filter anywhere, and the `À TRANCHER` box holds one item only — "lisibilité par défaut avant tout filtre, sur un gros cluster". `.memlog.md` entry 152 records exactly this regeneration. The note was never removed. A consumer is told to distrust the one artifact that is accurate. *Fix:* delete the drift note; the file is also now ready for promotion to `wireframes/`, as the memlog says.
- **medium** **The linked wireframe shows two controls neither spine specifies.** A search field (`rechercher un objet…`) — the word "search" appears **zero** times in either spine — and an appearance control reading `Apparence : couleurs, taille du texte`, where both spines list display controls as "zone mode, text size, density, theme" with no colour control (see §7). Spines-win silently resolves both in favour of dropping them, which for search may be right and for colours contradicts the brief. *Fix:* say explicitly that object search is out of v1 (or specify it), and settle the colour control.
- **medium** **Five of seven working files are orphans or cited only by nickname.** `shape-study-organic-2026-09-10.html` is load-bearing — DESIGN.md attributes the silhouette-vs-deform channel split (line 613), the entire protrusion anatomy ("adopted verbatim from the shape study", line 648) and the motion specification to it — and is never linked by path. `direction-2-instrument-de-precision.html` is the chosen direction and the source of the toolbar-chip proposal, cited four times as "the direction file" or "the direction-2 mock" (lines 550, 664, 749, 765), never linked. `direction-1`, `-3` and `-4` are never referenced at all, in either file. *Fix:* add inline path links at Shapes, at Components → Labelled protrusion, and at Brand & Style; name the three rejected directions once so the record of what was declined survives outside the memlog.
- **low** DESIGN.md carries no visual reference link of any kind and never restates spines-win. Since all four of its citations are unspecific nicknames, a consumer reading DESIGN.md alone has no path to follow. *Fix:* one link at Brand & Style is enough.

---

## 6. Bloat & overspecification — adequate

Both files are dense but very little is decorative. EXPERIENCE.md opens by declaring that scope, personas, market and the v1 object list are inherited by reference and not restated (line 13) and then keeps that promise. DESIGN.md's contrast table, the `motion.breathe` period and delay arrays, and the 21-row Do's and Don'ts table all earn their space — each is directly consumable by a builder. Editorial voice in DESIGN.md prose is licensed and is used well.

### Findings

- **medium** EXPERIENCE.md prose carries decision provenance where a behavioural spec should carry rules. The Bubble row (line 74) argues from *"Jules's founding wording was `contours irréguliers (galets, cellules) + corps mous qui se déforment`; his later choice of shape treatment C narrowed *corps mous* to deformation toward links only, explicitly `sans l'écrasement`, and that narrower reading is the one that binds"* — a ratification argument, not a rule. Same pattern in Pastille, Health pastille, Image, Echo bubble and Left menu. DESIGN.md may carry voice; EXPERIENCE.md should not, and a story-dev must now separate rule from justification in six of 23 rows. *Fix:* the provenance already lives in `.memlog.md` — keep the ruling in the spine and let the memlog hold the argument.
- **medium** DESIGN.md declares a spacing scale that **no component consumes**. `spacing.1`–`spacing.8`, `panel-pad` and `bezel` are never referenced by any component entry or by prose; every component sizes itself in raw pixels instead — `plate-height: '17.5px'`, `checkbox: '11 × 11px'`, `pastille size: '10 × 10px'`, `stalk: '1px'`, bubble radii `54 / 46 / 32px`, "minor ticks every 10px, major every 50px", "crosses at 30/30", "5.5px gap", "0.87r", "14px". Either the scale governs the components or it is decoration. *Fix:* reference the scale where it applies, and mark the genuinely off-scale values (17.5, 5.5, 11) as deliberate exceptions.
- **low** DESIGN.md's Open Questions row duplicates EXPERIENCE.md's row 1 nearly verbatim (DESIGN.md:788 / EXPERIENCE.md:267). One owner is enough for a question that belongs to neither file. *Fix:* keep it in EXPERIENCE.md, cross-reference from DESIGN.md.
- **low** "the brief's top external success signal" is restated five times across the pair (DESIGN.md:509, 556, 587, 743; EXPERIENCE.md:24). It is load-bearing once. *Fix:* state it in Brand & Style and reference it thereafter.

---

## 7. Inheritance discipline — adequate

Mechanically clean. Both `sources:` lists resolve — `../../briefs/brief-Portolan-2026-09-09/brief.md` and `addendum.md` both exist from each spine's directory. The Docker glossary (node, network, volume, stack, service, container, image) is identical across both spines and the brief, and EXPERIENCE.md makes preserving it a hard rule (line 55). The invented chassis vocabulary (*surveyed*, *off-chart*, *reorganise*, *fit to chart*) is used consistently in both files. Component names are identical across all four lists. All 30 distinct EXPERIENCE.md token references resolve to DESIGN.md tokens by name. Four `[DEPARTS FROM BRIEF]` markers, each carried in both files where both are affected — the health-pastille departure in particular is marked three times and its cost restated each time.

### Findings

- **high** **One departure from the brief is unmarked and silent.** The brief lists user-adjustable presentation as *"filtering and display control (what is shown, **colours**, text size)"* (brief.md §Scope), and `.memlog.md` entry 17 records it as a stated requirement. Neither spine offers a colour control: display controls are "zone rendering mode, text size, density, theme" (EXPERIENCE.md:40 and 89), and the Accessibility Floor (line 159) cites the brief's requirement by name while listing only text size and density. The linked wireframe still shows `Apparence : couleurs, taille du texte`. Every other brief contradiction in this pair is marked `[DEPARTS FROM BRIEF]` with the cost stated; this one is dropped without acknowledgement. *Fix:* add a colour control (theme is not one), or mark the drop and say why.
- **low** EXPERIENCE.md:268 claims the on-screen-control appearance is *"Open in both files, and the two agree it is open."* DESIGN.md marks it `[ASSUMPTION]` inline (line 749) but does **not** list it in its own Open Questions table, which carries exactly one row (line 788). The claim is true in spirit and false against the tables. *Fix:* add the row to DESIGN.md's Open Questions.

---

## 8. Shape fit — strong

DESIGN.md holds the canonical order exactly, with nothing omitted and nothing out of place: Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts, plus a trailing invented Open Questions. Frontmatter uses the five canonical spec keys as specified and declares seven extension namespaces with an explicit, well-argued rationale (line 486) — each is genuinely load-bearing in a graph that breathes, deforms, dims and refuses to render below 1440px, and each is named exactly as EXPERIENCE.md already references it, so nothing had to be renamed to make the pair resolve. That is the right way to extend the spec.

EXPERIENCE.md carries all eight required defaults — Foundation, Information Architecture, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows — plus both required-when-applicable sections, correctly triggered: Responsive & Platform (a viewport floor exists) and Inspiration & Anti-patterns (the memlog records six named rejects and four named learn-froms). No default is dropped, so nothing needs defending. The two invented DESIGN.md subsections ("Contrast, the load-bearing combinations"; "Two channels, and only one of them is data") both carry decisions nothing else in the pair carries.

### Findings

- **medium** DESIGN.md introduces a **toolbar** that EXPERIENCE.md's IA does not own. `spacing.toolbar: 40px` is declared; "Vertically inside the canvas column: `{spacing.toolbar}` 40px, the map, then the chart legend band" (line 579); and three on-screen controls sit "in the 40px toolbar above the map" (line 749). EXPERIENCE.md's chrome inventory reads "**left menu** for filters and display, **bottom tabs** for views, a permanent **chart legend** band beneath the canvas, graph canvas everything else" (line 42) — no toolbar. The linked wireframe shows no toolbar either. This is the same class of drift the session already caught and fixed for the chart-legend band (`.memlog.md` entry 160); the toolbar was missed. *Fix:* add the toolbar to EXPERIENCE.md's chrome inventory and IA table, or move the three controls into a surface that already exists.

---

## Mechanical notes

**Frontmatter.** Both files parse as valid YAML. Both carry `name`, `description`, `status: draft`, `updated: 2026-09-10` and a two-entry `sources` list; both source paths resolve from each file's own directory. DESIGN.md declares 17 top-level keys (5 canonical + 7 declared extensions + 5 metadata); EXPERIENCE.md declares metadata only, which is correct for a spine that owns no tokens.

**Cross-references.** 84 distinct `{path.to.token}` references across the pair. All resolve against DESIGN.md's frontmatter except two: the generic `{token}` placeholder used in prose in both files (harmless, but a naive resolver will try it), and `{colors.pastille-*}` at EXPERIENCE.md:76 and 158, which is a wildcard with no resolvable target. EXPERIENCE.md uses 30 distinct references, matching the count `.memlog.md` entry 137 claims.

**Colours.** 122 tokens. Every value is a valid six-digit hex. Every non-`-light` token has a `-light` twin; every `-light` token has a base. Zero exceptions — the light palette really is complete, not derived. The one colour in the document without a light value (`#46535C`, the node backdrop label) escapes this because it was never tokenised at all; see §2.

**Contrast.** All 12 rows of the DESIGN.md contrast table were recomputed independently. Every stated ratio is correct to within rounding. The claimed iso-luminance of the six-hue zone rotation holds (1.13–1.18 against ground in both modes), which does make the ≥3:1 edge floor a checkable property rather than a coincidence, as the file claims.

**Name consistency.** No component-name drift found in either direction across the four lists (DESIGN frontmatter keys, DESIGN `###` headings, EXPERIENCE Component Patterns rows, prose mentions). `Export (SVG / PNG)` matches exactly in both files. `Orphan bubble` and `Orphan counter` are correctly kept distinct in both. The left menu's `filter swatch` and the `chart legend` are explicitly distinguished in both files, which was a named risk in `.memlog.md` entry 160 and has been handled.

**No Mermaid** in either file — nothing to validate.

**Working artifacts.** `ia-portolan-2026-09-10.excalidraw` parses, 79 elements, and contradicts the drift note that describes it (see §5). Its text is in French while the decided UI language is English — not a conflict under spines-win, but worth knowing before it is promoted to `wireframes/`. The six HTML files all carry `<title>` and are self-contained.
