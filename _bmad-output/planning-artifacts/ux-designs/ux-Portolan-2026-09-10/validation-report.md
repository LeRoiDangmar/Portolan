# Validation Report — Portolan

- **DESIGN.md:** `DESIGN.md`
- **EXPERIENCE.md:** `EXPERIENCE.md`
- **Run at:** 2026-09-11T06:37:14+00:00

## Overall verdict

This is an unusually disciplined spine pair: the frontmatter parses, 122 colour tokens are all six-digit hex with a complete `-light` twin for every one, all 84 distinct `{path.to.token}` references resolve, component names map 1:1 across four separate lists, the canonical DESIGN.md section order is held exactly, and every number in the contrast table was independently recomputed and is correct. A consumer can source-extract most of this cleanly. What it is not yet is *safe* to extract. Two load-bearing colour statements are wrong or contradictory — the identifier channel that Flow 1's climax rests on is specified at 3.42:1 while the file's own table claims 15.0:1 for it, and the Node view's subject label is an untokenised raw hex measuring 2.49:1 with no light-mode value. A third of the surface area a consumer would build (five named on-screen controls, the Node view's foreground rendering, every detail-panel state, hover) is named but never committed, and the single "known drift" note in the pair is itself stale — it disparages a reference artifact that was already corrected. Fix the two criticals and the eight highs and this becomes a contract. Everything else is polish.

The three extra reviewers shift that picture, and the way they shift it is worth naming. Two of them — the legibility-at-scale adversary working from a constructed 325-object cluster, and the accessibility auditor working from CIELAB colour distances — arrived at the **same critical by entirely different routes**: the six-hue zone rotation's declared rescue, the network pastille, runs the *identical* six-step rotation, so network 7's hexagon is network 1's hexagon and the stated mitigation is the thing it is mitigating. One reviewer found it by counting networks on a realistic swarm; the other found it by simulating dichromacy on the hex values. When arithmetic and colour science converge on one sentence from opposite ends, that sentence is not a wording slip — and the memlog confirms it was a facilitator error the user then decided on top of. The same convergence recurs at lower severity on the 9px type floor (four of eleven roles below it at scale 1.00, found twice independently) and on the bubble identifier channel (3.42:1 against a declared 7:1 floor, found twice with identical figures). Beyond the overlap, each extra lens opens ground the rubric could not see: the legibility review shows the network channel *breaks* rather than degrades in the one frame the product is judged on; the brief-fidelity review finds three silent contradictions, the worst of which shipped a false security guarantee into permanent chrome; and the accessibility review shows the Accessibility Floor is honest about what it refuses and dishonest about the one thing it claims to have solved. Eight of these findings have since been ruled on by the user and are marked below rather than removed.

## Category verdicts

- Flow coverage — **adequate**
- Token completeness — **adequate**
- Component coverage — **adequate**
- State coverage — **adequate**
- Visual reference coverage — **thin**
- Bloat & overspecification — **adequate**
- Inheritance discipline — **adequate**
- Shape fit — **strong**

## Findings by severity

84 raw findings across four reports (rubric 30, legibility-at-scale 16, brief-fidelity 16, accessibility 22). Six were found independently by two reviewers and are merged here, giving **78 consolidated findings**. Merged findings carry a *Converges* line. Findings the user has ruled on since the reviews ran are marked **[RESOLVED SINCE REVIEW]** or **[PART RESOLVED SINCE REVIEW]** and kept in place.

### Critical (7)

**[Token completeness / Accessibility]** — The identifier channel contradicts itself: 15.0:1 claimed, 3.42:1 specified (DESIGN.md:537 vs DESIGN.md:644)
The contrast table's first row states *"Identifier on bubble body — 15.0 / 18.1 — floor 7:1 — this is the channel `pgdata` vs `pg-data` is read on"*, but Components → Bubble sets the identifier at `{colors.ink-3}` — `#5D6A74` on `{colors.body-mid}` `#0B1116` measures **3.42:1** dark and **4.74:1** light, below 4.5:1 on 9px type, a 4.4× gap between the asserted number and the specified one. The 15.0 figure is `{colors.ink}` (14.98 — correct arithmetic for the wrong token), presumably the *name*'s colour; the bubble **name** is given no colour token at all. This is the single row a builder is most likely to trust without rechecking.
Converges: rubric walker and accessibility auditor, identical recomputed figures.
Fix: decide which colour the identifier takes and assign it in Components → Bubble — `{colors.ink}` (14.98 / 18.08) or `{colors.ink-2}` (7.33); give the name an explicit token; re-measure the row against the assigned token and name the token each table row measures. `ink-3` and a 7:1 floor cannot both stand.

**[Token completeness]** — The node backdrop label is an untokenised raw hex at 2.49:1, the only colour with no light twin (DESIGN.md:697)
`#46535C` has no `colors:` token, **no `-light` counterpart anywhere in the file** — the only colour in the document without one — and measures **2.49:1** against `band-a` and **2.54:1** against `band-b` in dark mode, at 10px. It labels the surface Flow 3 is entirely about, and appears in no contrast row.
Converges: the accessibility auditor recomputed the same 2.49–2.54 range independently.
Fix: promote to `colors.node-label` / `colors.node-label-light`, raise the dark value to ≥4.5:1 against the bands, add a table row.

**[Legibility at scale / Accessibility]** — The stated rescue for the repeating zone rotation is the same repeating rotation (DESIGN.md §Colors, §Do's and Don'ts; EXPERIENCE.md §Network zone) — **[RESOLVED SINCE REVIEW]**
DESIGN.md leans on the network hexagon as "the answer to *which network is this*", but `pastille-network-1…6` is itself a six-step rotation, so networks 7–11 collide on the badge exactly as on the field. Breaks at 7 networks — the first repeat. The accessibility auditor reached the same conclusion from colour distance and adds that the hexagon family is itself CVD-confusable (ΔE **2.6** deuteranopia, `n1`≈`n3`).
Converges: two independent lenses — packing arithmetic on an 11-network cluster, and CIELAB dichromat simulation — landed on the same sentence. `.memlog.md` records it as a facilitator error: the user chose "the hue rotation repeats, the network pastille settles it" on a premise he was given wrongly.
Ruling: hue + pattern octave — hue cycles over six, a fill pattern (solid, half, ring, dotted…) marks the octave, so network 7 is hue 1 with the second pattern, applied to both the zone field and the network pastille. Stated cost: a pattern inside a 6px badge is hard and needs proving.
Fix: keep six hues and add an orthogonal, shape-preserving state to the hexagon — three states × six hues = 18 networks, `shape = family` intact, no seventh hue, no decision reopened.

**[Legibility at scale]** — At LOD rung 0 the network pastille does not render, so mode A's known blur has no fallback in the landing and export frame (EXPERIENCE.md §Interaction Primitives; DESIGN.md §Colors) — **[RESOLVED SINCE REVIEW]**
EXPERIENCE.md's ladder puts network pastilles at rung 1; DESIGN.md's coverage argument assumes they are present. The one frame the product is judged on is the one frame with no exact answer to "is this container on that network" — the brief's founding question. Breaks at any cluster where zones overlap, i.e. ~4+ networks.
Ruling: closed as a side effect of the hue + pattern octave — because the pattern rides on the *zone* as well as the badge, networks are distinguishable at rung 0 where the pastille does not yet render, so the landing and exported frames regain an exact network answer.
Fix: promote the network pastille to rung 0 in place of, or alongside, the type pastille — type is recoverable from body size and position, network is not recoverable from anything.

**[Legibility at scale]** — The node backdrop and the network zones compete for the same positional channel, and on a real swarm the zones lose (DESIGN.md §Node backdrop; EXPERIENCE.md §IA) — **[RESOLVED SINCE REVIEW]**
An overlay network spans every node by construction. If a container must sit in its node's band for the backdrop to be truthful, every zone is a 6-lobed smear across the full canvas width, all eleven fields overlap nearly everywhere, and mode A resolves to a uniform wash. The design's own zone study predicted this at six fields: *"six turn the canvas to mud."* Breaks at ~4 nodes × ~6 networks — well below the test cluster.
Ruling: the node backdrop is off by default, as a display control in the left menu — exactly the weaker decision-preserving variant the reviewer named. The overview lands purely relational and the network zones get the whole positional channel back; no prior decision is reopened.
Fix: drop the node backdrop from the Overview and let it live in tab 2, which Flow 3 uses for exactly the distribution read; or the weaker variant, a display control off by default.

**[Accessibility]** — "Value-level colour is colour-vision-safe" is false for the stack and network families (EXPERIENCE.md → Accessibility Floor → In scope, bullet 2)
Measured, deuteranopia, dark palette: object type **ΔE 20.5** safe; health **ΔE 18.7** safe; **stack** worst pair **ΔE 3.9** (`stack-3` `#6FB2A0` / `stack-4` `#C48FA8`) not distinguishable; **network** **ΔE 2.6** (`network-1` `#4A8296` / `network-3` `#7A7695`) not distinguishable. Light palette is worse: stack ΔE 2.9, and zone tints `t1`/`t3` simulate to **ΔE 0.0** — byte-identical after deuteranopia. ΔE < 3 is *the same colour*. The health fix was generalised into a blanket claim (`.memlog` 101 → 112), and the obligation delegated to `DESIGN.md` is never discharged there. The concrete downstream loss is nameable: Flow 1 step 6, "Climax — the intruder", turns on the mismatch between zone tint and stack pastille, and both halves are in the failing set. A deuteranope cannot perform the second of the primary journey's three discoveries. Nothing in either spine says so.
Fix (wording, not palette): split the claim — name type (the only family at rung 0, and therefore the whole of the screenshot frame) and health as value-safe; add stack/network value-level colour as a third **Explicitly out of scope** bullet with the Flow 1 step 6 consequence stated; delete "`DESIGN.md` owns keeping it true" unless `DESIGN.md` is given a matching constraint.

**[Brief fidelity]** — S1: the chrome ships a security guarantee the brief reserves for architecture, and the guarantee is false (DESIGN.md:725 §Left menu) — **[RESOLVED SINCE REVIEW]**
A permanent marginalia block reads *READ ONLY · SOCKET MOUNTED :RO · NO WRITE POSSIBLE*. (1) It decides an architecture question the brief explicitly left open — "Read-only at the product level is a promise, not a mechanism" — in a chrome string, in a UX document, with no marker and no rationale. (2) It is technically wrong: `:ro` on a `/var/run/docker.sock` bind mount makes the socket *inode* read-only and does not restrict the Docker API; a process with that mount can still `POST /containers/create`. (3) It is the highest-trust surface in the product — permanent, on every screen, and inside the exported frame the flows are built to have strangers post.
Ruling: the chrome string is removed.
Fix: delete the mechanism claim, or reduce it to what the product knows (`READ ONLY` as a product posture). If a mechanism claim is wanted, mark it `[DEPARTS FROM BRIEF]`, say it pre-empts addendum open question 1, and make it true — a read-verb-restricted socket proxy is the only configuration under which "no write possible" is a fact.

### High (18)

**[Flow coverage]** — The brief's second verbatim filter job has no mechanism anywhere (EXPERIENCE.md:87–90) — **[RESOLVED SINCE REVIEW]**
*"show me only what touches `backend`"* has no mechanism and no flow exercising it. Filters are type-level only; reachability highlight dims rather than removes; *Isolate* takes a service as subject, never a network. The word `backend` appears in EXPERIENCE.md exactly once, inside the Echo bubble row.
Ruling: a relational filter — "Keep only this" — promotes the existing reachable-set highlight into a real filter that removes the rest, reusing the adjustable hop reach and honouring "highlight dims, filter removes".
Fix: add a scope-to-network filter (or extend *Isolate* to accept a network subject) plus a flow step, or mark the omission `[DEPARTS FROM BRIEF]`.

**[Token completeness / Accessibility]** — The contrast table covers only map marks; three of the five colour-carrying text roles fail 4.5:1 (DESIGN.md:535–548; Components: Bubble, Detail panel, Left menu, Node backdrop)
Nine of twelve rows verify to ±0.05, but **zero of the five text roles carrying an explicit colour token appear in the table, and three of those five fail 4.5:1**: `bubble-id` at `ink-3` **3.42** / 4.74; detail-panel keys and left-menu counts at `{colors.ink-3}` on `{colors.panel}` = **3.51:1** dark / **3.84:1** light; node-backdrop labels at `#46535C` **2.49–2.54** dark. The four chrome components carry no measured combination at all.
Converges: rubric walker and accessibility auditor, same components, same figures.
Fix: add a chrome-text block to the table and lift `ink-3` where it carries text — `ink-2` `#94A3AD` gives 7.52:1 on the panel at no cost to the register — or restrict `ink-3` to non-text use.

**[Token completeness]** — Twelve raw hexes live inside `components:` with no token behind them, two packing both modes into one string (DESIGN.md frontmatter → components)
`node-backdrop.band-a` / `band-b` / `band-a-light` / `divider`, `orphan-bubble.fill` / `fill-light`, `detail-panel.header`, `bottom-tab-bar.background` / `background-light`, `chart-legend.background` / `background-light`. Two pack both modes into a single string no resolver can split: `detail-panel.header: '#0C1015 / #DDE4E8'` and `node-backdrop.divider: '0.8px #151D23 / #D4DCE1'`.
Fix: promote all twelve to `colors:` with `-light` twins and reference them; split the two two-mode strings into separate keys.

**[Component coverage]** — Five named components have no frontmatter entry and no committed visual spec (EXPERIENCE.md:87, 91–94; DESIGN.md:747–751)
*Fit to chart*, *Reorganise*, *Isolate*, *Export (SVG / PNG)*, *Survey stamp*. All five have EXPERIENCE.md rows; DESIGN.md covers all five in one prose block marked `[ASSUMPTION]`. A consumer extracting `components:` gets 17 of 22. Honestly flagged in both Open Questions sections, but the shape is still missing.
Fix: add provisional frontmatter entries carrying the proposed chip so there is something concrete to correct.

**[Component coverage]** — The Node view has no visual spec — nodes are specified only as background (DESIGN.md:695–697; EXPERIENCE.md:245)
`components.node-backdrop` specs nodes strictly as ground — "It is a ground, and it must never compete with a zone tint" — while EXPERIENCE.md:245 says that in tab 2 the nodes are "no longer bands lying under the stacks, but the subject." Nothing says what a foreground node looks like: `shape.bubble.radius` carries `service` / `container` / `volume` and no `node`, though `colors.pastille-type-node` exists. Flow 3 runs entirely on this surface.
Fix: add a `node-region` component, or a declared foreground mode of `node-backdrop` with its own radius and label treatment.

**[State coverage]** — The Detail panel has no states at all (EXPERIENCE.md §State Patterns)
Missing: its own load treatment; what happens when the selected object disappears on the next 5–10s poll while the panel is open (`{motion.exit}` says the *bubble* "fades in place" and stops there); and how the panel behaves under staleness, when the map is paling but the panel's text is not. It is one of five IA surfaces and it is where every one of Flow 1's and Flow 3's factual answers arrives.
Fix: add rows for load, subject-vanished, and stale.

**[Visual reference coverage]** — The pair's only drift note is itself stale, and it defames a correct artifact (EXPERIENCE.md:46)
The note claims the wireframe "still draws an `Images` filter in the left menu and still lists 'are images graph nodes?' as open." The file was read: 79 elements, filters are `Réseaux / Volumes / Stacks / Conteneurs` with no Images filter, and the `À TRANCHER` box holds one item only. `.memlog.md` entry 152 records exactly this regeneration. A consumer is told to distrust the one artifact that is accurate.
Fix: delete the drift note; the file is also now ready for promotion to `wireframes/`.

**[Inheritance discipline / Brief fidelity]** — One departure from the brief is unmarked and silent: user-adjustable colours (brief.md §Scope; EXPERIENCE.md:40, 89, 159; DESIGN.md §Colors, §Typography) — **[RESOLVED SINCE REVIEW]**
The brief lists user-adjustable presentation as *"filtering and display control (what is shown, **colours**, text size)"*. Both spines keep two-thirds of that sentence and cite it — "Adjustable text size … the brief makes user-adjustable presentation a requirement" — while the colours half is nowhere. Worse than an omission, the palette is **structurally foreclosed**: zone hues are "a six-step rotation assigned in creation order and then held for the life of the network", and "Everything that is neither metal nor ink is graphite." Selectively quoting the same sentence for the surviving half is what makes it a silent contradiction rather than a gap. It also removes the user's own escape hatch from the seventh-network tint repeat.
Converges: rubric walker (§7) and brief-fidelity reviewer (S2), which rated it high on downstream impact.
Ruling: predefined iso-luminant palettes — the user picks between colour sets shipped with the product, each verified to hold the contrast floors, honouring the brief's display-control intent without letting the user break the guarantee that every edge stays legible over every zone tint.
Fix: carry the palette control into both spines' left-menu inventories and the Accessibility Floor, and state in DESIGN.md §Colors why the set is bounded.

**[Legibility at scale]** — The ≥3:1 edge floor is measured against one tint; mode A composites several (DESIGN.md §Contrast table + §Network zone)
The zone isoline drops to **2.79:1** at two overlapping fields and the attachment edge to **2.87:1** at four. With 300 containers at 2.2 networks each, ~7 shared containers per network pair — every pair of networks shares members, so in mode A every zone overlaps every other zone, and the modal region is under three to five fields. **Both branches lose:** translucent fields destroy the contrast floor and the hue; near-opaque fields (0.92–0.95 in the mocks) mean the top field paints over the others and overlap carries no information at all.
Fix: cap composited tint depth — after N fields the renderer stops adding luminance — and re-measure the floor against the capped maximum. The cap is a rendering rule, not a design decision.

**[Legibility at scale]** — `{elevation.bubble}` is specified for a 96px body and is catastrophic at a 28px one (DESIGN.md frontmatter → elevation.bubble)
`feDropShadow dy 5 · stdDeviation 7` extends ~21px (3σ) beyond the silhouette — 1.5× the whole body diameter at map scale, against 8px of clearance. All 325 shadows land on their neighbours, the map fogs, and the 3.3:1 contour-over-canvas figure is measured against a ground that no longer exists. It also carries a frame-rate cost: SVG filters are not compositor-accelerated in any of the three named engines, and `{motion.breathe}` changes the path bbox every frame — order 5M pixel-operations per frame for shadows alone, ~300M/s at 60fps. Breaks at ~120 objects on this viewport.
Fix: bind `{elevation.bubble}` to the LOD rung — the file already has `dark-small`; make rung 0 use it or none, and reserve the full drop for rungs 2–3. Light mode has no shadow at all and is therefore the palette that survives this test — which is already the specified screenshot palette.

**[Legibility at scale]** — `{shape.pastille.size}` does not say whether it scales, and both readings kill the rung-0 encoding (DESIGN.md §Shapes → shape.pastille)
Fixed at 10px it is wider than the core is tall (9.4px) and is 53% of the body's diameter — 325 badges dominate the silhouette, and the silhouette's stretch direction is supposed to be the rung-0 data channel. Scaled with the body (20%) it is **2 × 2px**, and five type values separated by fill colour alone at ~7 arcmin is below the small-field colour-naming threshold for most observers. The contrast table's 5.0–17.0:1 is a luminance figure and does not rescue hue identification at that size. Breaks at ~150 objects.
Fix: specify a pastille floor in the same sentence as the type floor — never below 6px, never above 40% of core width; between those it scales. Where it cannot meet the floor, drop the family, exactly as the type ladder already does for labels.

**[Legibility at scale / Accessibility]** — The 9px type floor is violated by the ramp that declares it (DESIGN.md §Typography; frontmatter typography.*)
"the absolute floor after multiplication is 9px — no glyph in Portolan is ever rendered smaller, at any scale, at any zoom" is contradicted by the same file's ramp: **four of eleven roles are under 9px at scale 1.00** (zone-sub 8.5, section-label 8.0, marginalia 8.5, graduation 8.0) and six at 0.90 (adding bubble-id 8.10, zone-label 8.55, down to 7.2px). The floor is satisfied only at 1.15. Three of the four default-scale violations are on the exported chart. Typography also praises "a 8px label" a few paragraphs earlier. Breaks at every cluster, including the three-container lab.
Converges: legibility reviewer (from the ramp arithmetic) and accessibility auditor (from the floor claim), identical role lists and figures.
Fix: raise the four roles to 9px, or restate the floor as "9px for map labels; chart marginalia and section heads run to 7.2px". Either is a one-line edit; the current text is simply not true of its own table.

**[Legibility at scale]** — The far endpoint of 660 of ~700 edges is undefined (DESIGN.md §components.edge, §components.network-zone)
`{components.edge}` specifies "attachment (an object to a network)" while `{components.network-zone}` gives the network no position. Both working artifacts resolve it as a short coloured protrusion stub; neither spine says so, and at rung 0 that stub is **~2px** — shorter than one period of its own `2 4` dasharray. *"Nothing in any rendering choice is permitted to dissolve an edge"* is a rule this design breaks against its own most numerous edge type, in its own default frame.
Fix: name the stub in `{components.edge}` as the attachment's rendering, and give it a rung-0 minimum length so it stays a visible mark. It is the cheapest available way to put *some* network signal back into the default frame.

**[Brief fidelity]** — S3: the product's permanent footer denies the health departure the same file declares (DESIGN.md §Detail panel vs §Health pastille) — **[PART RESOLVED SINCE REVIEW]**
§Detail panel, permanently: *Portolan renders the observed state. No threshold, no rule, no verdict.* §Health pastille, fifty-five lines earlier: **[DEPARTS FROM BRIEF]** … **this renders a verdict**. Both cannot be true, and the footer is wrong on all three of its own terms: **verdict** — the departure is declared precisely as a verdict; **threshold** — `degraded` is a classification produced by comparing running replicas to desired; **rule** — the mapping *(replicas, task state) → nominal | degraded | stopped* is a rule, and it is specified nowhere in either spine. The declared departure understates its own scope: presented as a colour choice, it is in fact the introduction of the product's only classification rule.
Ruling (partial): amber is now defined as `running < desired` replicas. Docker reports both numbers, so "3/5" is a raw fact rather than a threshold Portolan invented — this removes the unspecified-threshold problem entirely and narrows the departure to the green/amber/red framing alone. The footer wording still denies the departure and still needs rewriting.
Fix: rewrite the footer so it survives the departure (e.g. *"Portolan renders the observed state. The health light is the one exception, and it is not an alert."*), and write the now-defined three-state rule into `EXPERIENCE.md` where the departure is declared.

**[Brief fidelity]** — D1: authentication and exposure are absent from both spines (absent from both spines) — **[RESOLVED SINCE REVIEW]**
The brief ranks this **first** among the questions carried to architecture: *"A read-only tool that exposes every IP, network and volume in an infrastructure is a reconnaissance gift if left open."* Neither spine contains the words auth, login, session, credential, exposure, or reconnaissance. No auth state in §State Patterns, which is otherwise exhaustive; no auth surface in the IA, which claims completeness. Aggravated by export being promoted to v1 specifically to make the topology portable, and by Flow 2's climax being publishing it — "He posts it." IPs and CIDRs are named as rendered content, and no redaction or "safe to share" affordance exists. The spine then asserts closure over the gap.
Ruling: no auth in v1 — *"On va garder l'auth pour une prochaine version, pour le moment on arrive directement sur l'app."* This is a v1 scope decision, so the spines must state it plainly rather than staying mute, and must note that Flow 2 ends with the protagonist publicly posting a full topology, which makes exposure a live concern even without an auth surface.
Fix: state the no-auth-in-v1 decision plainly in §Foundation, and add one line in *Export* about what the frame contains.

**[Brief fidelity]** — R1: "a contradiction inside the brief itself" — the brief contains none (EXPERIENCE.md:30 §Foundation; DESIGN.md §Brand & Style) — **[RESOLVED SINCE REVIEW]**
The spines assert the brief contradicts itself between *legible over impressive* and a success signal that "depends on someone screenshotting *because* it is impressive." The brief's signal reads, in full: "A stranger posts a screenshot of **their own** cluster in Portolan" — a *use* signal. Nothing in the brief attributes the posting to impressiveness; the brief's stated bar for the same picture is "a non-specialist could follow it". This matters more than a citation error, because the invented contradiction is what licenses the reinterpretation, and the reinterpretation is the governing principle of both spines — `DESIGN.md` calls `beaucoup à regarder, peu à lire` "the most important line in this file".
Ruling: the attribution is corrected — the tension is real but its source is Jules's own journey 2 (*"presque trop pour que ce soit facilement lisible mais tellement classe"*), not the brief. The principle stands; the derivation is re-sourced without weakening it.
Fix: state it as a session decision that graphic richness is compatible with the brief's bar, taken to serve journey 2, with the brief's ordering left intact.

**[Accessibility / Legibility at scale]** — "Nothing drifts" is refuted by the other spine's own token, and the drift breaks the never-overlap guarantee (EXPERIENCE.md → State Patterns → Alive at rest, vs DESIGN.md frontmatter motion.breathe)
"Motion is local deformation only, never translation… the centre does not move by a pixel… **Nothing drifts**" is refuted by `{motion.breathe}`'s own `drift: ±3.4px` over `9 / 11 / 13 / 15 / 17 / 19 / 23s`, plus `edge-drift ±1.3px`. Per `.memlog` 148, "core, name, id and pastille rail drift but never deform". The layout anchor is invariant; the drawn body, its label and its click target travel up to **6.8px peak-to-peak**, continuously, by default — with no keyboard alternative for anyone who cannot track it.
Converges (legibility reviewer): the same seam has a geometric consequence. ±3.4px is "about 7% of a 48px radius" in the shape study; at map scale it is **24–36% of the radius**. Against `{spacing.cell-clearance}` 8px, two neighbours drifting toward each other consume **6.8px of the 8px gap**. The reserved-cell rule guarantees that *anchors* never overlap; it does not guarantee that *rendered silhouettes* never overlap, which is what the silhouette-as-data-channel decision requires. Drift amplitude and clearance were specified against different radii and never reconciled. Separately: 325 independent oscillators means peripheral motion captures the eye continuously and it never settles.
Fix: say what `DESIGN.md` actually specifies — "the **layout anchor** never moves… The drawn body excursions within its reserved cell by ±3.4px, zero-mean and non-accumulating; `prefers-reduced-motion` stills that excursion." Drop "Nothing drifts." Then express drift as a fraction of the current body radius rather than in absolute pixels, and add *still the chart* as a left-menu display control.

**[Accessibility]** — No route to enlarged text anywhere in the product (EXPERIENCE.md → Responsive & Platform / Accessibility Floor; DESIGN.md → Layout)
Browser and OS zoom are never mentioned in either spine, and are actively blocked by a decision taken for other reasons. `{layout.min-width}` 1440px with an off-chart refusal below it means the standard remedy fails: a 1440px display trips off-chart at **110%** browser zoom; 1920px at 150%; even 2560px at 200%. Combined with an in-app ceiling of 1.15×, there is **no route to 200% text anywhere in the product**, and no route to the 16px browser default — sans tops out at 14.95px.
Fix: state it in the Floor — "Adjustable text size spans 0.90–1.15 and multiplies every rendered size. Browser zoom is **not** a supported enlargement path… In-app text scaling is the only route, and its ceiling is +15%." An honest ceiling is a promise; an unbounded one is not.

### Medium (33)

**[Flow coverage]** — Flow 2's heading names a persona the source does not (EXPERIENCE.md:217)
The heading calls the persona "the homelabber", not the source's "The Swarm operator". The `[ASSUMPTION]` note beneath traces it correctly, but the heading is the drifted string a consumer will copy.
Fix: retitle "Tom, the Swarm operator".

**[Token completeness]** — `{colors.pastille-*}` is a wildcard, not a resolvable path (EXPERIENCE.md:76, 158)
The only unresolvable reference in the pair.
Fix: name the four family prefixes explicitly, or point at DESIGN.md's Pastille section instead.

**[Token completeness]** — Orphan tokens: defined, never bound, and in one case contradicting a stated ratio (DESIGN.md frontmatter)
`opacity.reticle-fine` (0.55) and `opacity.reticle-coarse` (0.80) exist with no reticle component; `opacity.zone-isoline` (0.85) is never applied and if it does apply the table's "3.2–3.7" is overstated; `typography.graduation`, `spacing.bezel` (prose hardcodes "A 12px graduated lunette"), `spacing.panel-pad`, `colors.rule` / `rule-light`, `colors.field` / `field-light` are unused. `colors.steel` is described as a first-class metal but its hex is restated verbatim as `pastille-stack-2` rather than referenced.
Converges: the accessibility auditor settled the isoline ambiguity by computing the composited mark — 2.68–3.03:1, failing on five of six tints.
Fix: bind each or drop it; decide the isoline opacity and re-measure that row.

**[Component coverage]** — Hover is unspecified anywhere in the pair, in a mouse-only product (EXPERIENCE.md:146, 164; DESIGN.md:517, 763)
Keyboard shortcuts are banned outright and keyboard traversal is out of scope, so the product is mouse/trackpad only — which makes hover the sole pre-click affordance. DESIGN.md mentions hover only twice, both times to forbid glass on it.
Converges: the accessibility auditor lists the same gap under "Holes never decided either way", noting hover "is the only remaining discovery channel once keyboard is out".
Fix: add a hover rule to Interaction Primitives, or state that there is deliberately no hover state and why.

**[State coverage]** — View-switch load is undefined (EXPERIENCE.md:42, 104, 244)
Cold load is scoped to Overview. Switching to Node view or Service view is "a complete change of view, not a filter" — does the layered draw replay, or does the view appear instantly? Flow 3's steps 1–2 read as instant but never say so.
Fix: one row settling it.

**[State coverage]** — Service view has no failure state (EXPERIENCE.md:38)
"There is no empty-subject state to design: the view cannot be reached without a subject" is fair for entry, but nothing covers the subject service disappearing between polls while the user is inside tab 3.
Fix: one row.

**[State coverage]** — Node view states exist only inside a flow (EXPERIENCE.md:113, 254)
"One machine is fresh and carries nothing → its region renders empty" appears only as a Flow 3 failure path, and "Empty cluster" is scoped to Overview. A consumer reading State Patterns for the Node view finds only the generic "every graph surface" rows.
Fix: promote the empty-node case into the table.

**[Visual reference coverage]** — The linked wireframe shows two controls neither spine specifies (.working/ia-portolan-2026-09-10.excalidraw) — **[PART RESOLVED SINCE REVIEW]**
A search field (`rechercher un objet…`) — "search" appears zero times in either spine — and an appearance control reading `Apparence : couleurs, taille du texte`, where both spines list display controls as "zone mode, text size, density, theme" with no colour control. Spines-win silently resolves both in favour of dropping them.
Ruling (partial): the colours half is closed — predefined iso-luminant palettes are now a left-menu display control, so the wireframe's `Apparence : couleurs` is no longer contradicted. The search field remains unspecified and unacknowledged.
Fix: say explicitly that object search is out of v1 (or specify it), and carry the palette control into both spines so the wireframe and the spines agree.

**[Visual reference coverage]** — Five of seven working files are orphans or cited only by nickname (DESIGN.md:550, 613, 648, 664, 749, 765)
`shape-study-organic-2026-09-10.html` is load-bearing — the silhouette-vs-deform channel split, the entire protrusion anatomy ("adopted verbatim from the shape study") and the motion specification are attributed to it — and is never linked by path. `direction-2-instrument-de-precision.html` is the chosen direction, cited four times by nickname, never linked. `direction-1`, `-3` and `-4` are never referenced at all.
Fix: add inline path links at Shapes, at Components → Labelled protrusion, and at Brand & Style; name the three rejected directions once so the record of what was declined survives outside the memlog.

**[Bloat & overspecification]** — EXPERIENCE.md prose carries decision provenance where a behavioural spec should carry rules (EXPERIENCE.md:74 and five further rows)
The Bubble row argues from Jules's founding wording and his later narrowing of *corps mous* — a ratification argument, not a rule. Same pattern in Pastille, Health pastille, Image, Echo bubble and Left menu. DESIGN.md may carry voice; EXPERIENCE.md should not, and a story-dev must now separate rule from justification in six of 23 rows.
Fix: the provenance already lives in `.memlog.md` — keep the ruling in the spine and let the memlog hold the argument.

**[Bloat & overspecification]** — DESIGN.md declares a spacing scale that no component consumes (DESIGN.md frontmatter → spacing)
`spacing.1`–`spacing.8`, `panel-pad` and `bezel` are never referenced; every component sizes itself in raw pixels instead — `plate-height: '17.5px'`, `checkbox: '11 × 11px'`, pastille `10 × 10px`, bubble radii `54 / 46 / 32px`, "5.5px gap", "0.87r". Either the scale governs the components or it is decoration.
Fix: reference the scale where it applies, and mark the genuinely off-scale values (17.5, 5.5, 11) as deliberate exceptions.

**[Shape fit]** — DESIGN.md introduces a toolbar that EXPERIENCE.md's IA does not own (DESIGN.md:579, 749 vs EXPERIENCE.md:42)
`spacing.toolbar: 40px` is declared and three on-screen controls sit "in the 40px toolbar above the map". EXPERIENCE.md's chrome inventory is left menu, bottom tabs, chart legend band, graph canvas — no toolbar. The linked wireframe shows no toolbar either. Same class of drift the session already caught and fixed for the chart-legend band (`.memlog.md` entry 160); the toolbar was missed.
Fix: add the toolbar to EXPERIENCE.md's chrome inventory and IA table, or move the three controls into a surface that already exists.

**[Legibility at scale]** — The stretch reservation costs 24% of body radius at the exact point where radius is the binding constraint (DESIGN.md §shape.bubble.deform.reservation + spacing.cell-clearance)
r falls from 18.3px to 13.9px on the landing frame at 325 objects, and the bulge it buys is **4.4px** with cos² falloff over ±38° on a 28px body — smaller than the drop shadow's blur radius. The data channel pays a quarter of the body's size and is then buried under the body's own shadow. Breaks at ~250 objects.
Fix: scale the deform cap with the rung — +32% at rungs 2–3 where the silhouette is legible, +12% at rung 0 where only gross elongation survives anyway. The channel is preserved and a third of the reservation is returned to body size.

**[Legibility at scale]** — The chart legend cannot decode the chart it ships inside (DESIGN.md §components.chart-legend)
Six columns across a 1204px canvas = **201px each** (147px with the panel open). Column 6 decodes the zone colours and has **six swatches; the map has eleven zones** — the exported chart carries a key that provably cannot decode its own picture. Column 5 sets `pgdata · pg-data · pg_data · pgdatal` at 10px / 0.04em = **230px wide** in a 201px column; it wraps, and wrapping destroys the adjacency that is the entire point of the specimen.
Note: the hue + pattern octave ruling changes what this column must carry — swatches now need hue *and* pattern — but does not close the arithmetic.
Fix: make the zone column list the networks actually present rather than the palette, and set column 5's four strings stacked vertically on a shared left margin — which mirrors the shared-baseline mechanism the protrusions use.

**[Legibility at scale]** — Flow 1's orphan climax cannot happen on this cluster (EXPERIENCE.md §Key Flows → Flow 1)
*"One bubble floats between the zones, attached to nothing"* requires there to be a "between." With eleven fields covering the canvas there is none, and the orphan is a 19px pebble among 325 with no badge, no ring and no colour by explicit decision. Breaks at ~6 networks / ~150 objects.
Fix: none needed to the drawing — the orphan counter already is the mechanism, and it was designed for exactly this. Retire the claim that isolation alone carries it at rung 0, and say in the flow that the counter is how it is found on a real cluster.

**[Legibility at scale]** — The reachability hop limit has no default, and every default but "1 hop" is dead on arrival (EXPERIENCE.md §Interaction Primitives)
With 300 containers sharing 11 networks, the transitive closure from any container is the whole cluster. At 1 hop it lights ~4 of 325 objects; at 2 hops, 150+. `.memlog.md` entry 142 leaves the default unset.
Note: now load-bearing for a second reason — the "Keep only this" relational filter ruled since the review reuses this same hop reach.
Fix: set the default to 1 hop.

**[Brief fidelity]** — D2: the export departure is unmarked in DESIGN.md, which derives four requirements from it (DESIGN.md §Typography, §Chart legend, §Layout, §Do's and Don'ts)
Fonts embedded in the image, light palette made first-class, chart legend declared "part of the chart", graduated bezel and corner crosses declared uncroppable. Four visual requirements rest on a v1 scope reversal DESIGN.md never flags. The justification also cites a signal the brief satisfies without it — "screenshot accepted for now". The departure's real argument is better: a screenshot cannot carry the chart legend, the bezel, or a chosen framing.
Fix: mark the departure where its four requirements are derived, and swap in the stronger argument.

**[Brief fidelity]** — D3: "Is a stack a bubble?" was never decided; three inconsistent traces (DESIGN.md §Pastille; EXPERIENCE.md §IA, LOD rung 0)
DESIGN.md §Pastille lists `stack` `#8F7FB8` as an object-type value, implying a stack can be a bubble carrying a type pastille; §IA says the overview foregrounds "stacks, volumes and network zones"; LOD rung 0 renders "stack names" as large labels; and there is no *Stack* row in either spine's component tables. Zones are networks, so a stack is not a zone. The layout engine and graph model are specified differently depending on which reading an implementer picks.
Fix: decide it, and add the row.

**[Brief fidelity]** — D4: the configurable refresh interval has no control on any surface (EXPERIENCE.md §Foundation vs §Component Patterns → Left menu)
"auto-refresh every 5–10s, **configurable**" is restated as inherited and then no surface offers it. The left menu is fully enumerated in both spines and the interval is not in it; nor is it in the toolbar, the tab bar, or a settings surface (there is no settings surface).
Fix: record it as a decision, or add the control.

**[Brief fidelity]** — M4: the orphan counter's justification defends the wrong thing (DESIGN.md §Orphan counter)
"A finding aid, not an annotation: it does not modify the orphan bubble's drawing in any way" is an argument about the *map*; the counter is chrome, and chrome is where a verdict would live. It is the only anomaly class with a dedicated chrome row, and "objects with no stack" is a factual predicate the session itself calls the orphan discovery. It is also the seam along which an audit engine grows: the second such row is a findings list.
Fix: defend the chrome, not the drawing, and say where the seam stops.

**[Brief fidelity]** — R2: "presque trop pour que ce soit facilement lisible" is adopted as the default screen's target without a departure marker (EXPERIENCE.md §Key Flows → Flow 2 climax)
A stated intent that the default screen be *almost too much to read easily* is in direct tension with a bar that reads "legible over impressive", and the reconciliation ("the richness is graphic, not textual") is an argument, not an observation. It should carry the departure marker or an explicit note that the brief's ordering was tested and held; it carries neither.
Fix: mark it, or note explicitly that the ordering was tested and held.

**[Brief fidelity]** — R3: screenshot-worthiness is presented as inherited from the brief (.memlog.md 23; both spines)
The brief says export is **out of v1** with "screenshot accepted for now", and a stranger's screenshot is a **success signal** — an outcome measure. Turning an outcome measure into a design requirement is legitimate; presenting it as inherited is not. It now underwrites export-in-v1, embedded fonts, light-palette parity, legend-in-export and bezel-in-export. Four of those five are good decisions on their own merits; all five are attributed to the brief.
Fix: re-source the requirement to the session.

**[Brief fidelity]** — M2: the reachability dim removes legibility outside the zoom/filter dichotomy, and the hop limit sits outside the declared control taxonomy (EXPERIENCE.md §Interaction Primitives, §Component Patterns → Left menu)
The reachability highlight dims the unselected set to 0.18, "which puts dimmed text at 1.5:1 effective… present, never readable, never removed." A click therefore removes legibility outside the zoom/filter dichotomy the brief set up, and the spines never reconcile the third instrument with the brief's rule. Also: the adjustable hop limit sits in a left menu declared to contain exactly "two kinds of control, and the difference is load-bearing" — the hop limit is neither a filter nor a display control.
Note: the "Keep only this" ruling adds a fourth instrument on the same seam, so the taxonomy sentence needs revisiting either way.
Fix: reconcile the third (now fourth) instrument with the brief's rule, and widen or re-word the two-kinds-of-control claim.

**[Brief fidelity]** — M3: mode B fragments the edge set in a product whose brief says the edges are the product (EXPERIENCE.md §Component Patterns → Echo bubble)
Echo bubbles carry "the edges of its own zone", so "neither copy shows the object in full". No view of a multi-network object shows all its edges in that mode. Disclosed as an accepted cost of the geometry; never weighed against the brief statement. Mitigated by mode B not being the default.
Fix: weigh it against "the edges are the actual product" out loud, in the mode B row.

**[Accessibility]** — Zone isolines fail their own 3:1 floor as rendered (DESIGN.md → contrast table row 9, vs frontmatter opacity.zone-isoline)
Raw hex 3.22–3.67 passes. But `{opacity.zone-isoline}` **0.85** applies to that mark: composited it is **2.68–3.03:1**, failing on five of six tints. The table measured the colour, not the mark.
Converges: the rubric walker independently flagged the same token as an orphan and predicted exactly this.
Fix: measure the composited mark, or drop the opacity — it buys little against a 1.18:1 field.

**[Accessibility]** — The bubble contour is measured over the canvas, but bubbles sit inside zones by construction (DESIGN.md → contrast table row 11)
3.25 / 3.04 passes over bare canvas. Over `zone-tint-1` the contour is **2.75:1**, below the stated 3:1. The load-bearing case is not the one measured — the same class of error the edge rows got right.
Fix: measure the contour over all six tints, as the edges already are.

**[Accessibility]** — Focus indication is forbidden without a replacement (DESIGN.md → Do's and Don'ts, row 5)
The only mention of "focus" in either spine is the Don't reserving glass for selection; no focus token, ring or outline exists. This compounds a hole the session never reached: *"Keyboard shortcuts — none, anywhere"* sits under a heading called **Banned**, and "anywhere" is broader than the map while "Banned" is stronger than "out of scope". A builder finds keyboard input banned "anywhere", the one obvious focus treatment forbidden, and nothing else — so the reasonable inference is that the entire chrome is mouse-only, a vastly larger exclusion than the two actually taken. It may also be an accident of phrasing. The spines do not settle it, and it needs one sentence, not a discussion.
Fix: narrow *Banned* to "**Keyboard accelerators — none.**" Add to the Floor's *In scope*: "**Standard tab focus on the chrome.** … Only the *graph canvas* is pointer-only." And add a focus token distinct from glass — a 2px `{colors.steel}` outline at 2px offset reads at 5.3:1 on the panel.

**[Accessibility]** — The kept set under `prefers-reduced-motion` is not the small half (EXPERIENCE.md → State Patterns → Reduced motion; DESIGN.md motion.draw / motion.relayout)
The layered first draw is kept on an "explanatory motion kept" rationale, but the spines describe it as decoration: *"The first movement is the pitch — he has not clicked anything yet"*. It explains no change. `{motion.relayout}` — 900ms of every body travelling curved paths across the whole map — is also kept, and large-area movement is the hazard class the media query primarily exists for.
Fix: still `{motion.draw}` and `{motion.settle}` under the media query, keep `{motion.enter}` / `{motion.exit}` / selection, and note that `{motion.relayout}` is retained deliberately because following an object between geometries *is* the function, with its 900ms amplitude stated.

**[Accessibility]** — The contrast floors are stated for the un-veiled chart only; the health verdict is the mark that fades most (DESIGN.md → Components → Stale map)
"Text never drops below 4.2:1 at maximum staleness" verifies at 5.53 dark / 4.58 light. But nothing else is exempt: the health `stopped` circle falls to **2.13:1** under the same veil (α 0.42 + saturation to 0.35), against a stated 4:1 floor. The one verdict the product renders is the mark that fades most.
Fix: extend the stale-map sentence — "text never drops below 4.2:1; the health circle does, reaching 2.1:1 at full staleness. An aged chart is a chart, and its verdict ages with it."

**[Accessibility]** — No minimum mark size to match the 9px type floor, and the rail already overflows the core (DESIGN.md → Shapes → shape.pastille, shape.bubble.core, shape.bubble.radius)
There is a hard floor for glyphs and none for pastilles, whose 10×10px is the sole carrier of the health verdict. The rail is `n × 10px + (n−1) × 5.5px` and the core is `0.59 × 2r`: every container carries at least type + stack + one network + health = **56.5px of rail into a 54.3px core** at default density; a volume needs 41px into 37.8px. The three escapes are shrinking the marks (no floor stated), shrinking the gap, or breaching the core (forbidden). The spines forbid one option and are silent on the other two.
Fix: state a mark floor alongside the type floor — "no pastille renders below 8px; if the rail cannot fit, the LOD rung drops a family" — mirroring the rule Typography already uses.

**[Accessibility]** — The adjustable-text promise is stated with no range in the spine that makes it a floor item (EXPERIENCE.md → Accessibility Floor, bullet 3)
`DESIGN.md` gives the range (0.90 / 1.00 / 1.15) and what it multiplies; `EXPERIENCE.md` states the promise with no range at all, and neither spine says the layout survives 1.15× against fixed 236px / 320px chrome columns — no overflow, wrap, scroll or truncation behaviour is specified for either.
Fix: carry the range and "multiplies every rendered size; density is a separate control" into the Floor bullet, and add one sentence on chrome behaviour at 1.15.

**[Accessibility]** — DESIGN.md carries no accessibility statement, no floor and no cross-reference (DESIGN.md → Colors)
`DESIGN.md` is the document a visual builder opens, the document that owns every colour, and the document `EXPERIENCE.md` delegates the CVD obligation to. Its Colors section opens *"Measured, not asserted"*, which reads as full coverage of a topic it covers partially. Someone implementing the palette from `DESIGN.md` alone will never learn that keyboard and screen-reader are out, nor that colour carries an unresolved value-level dependence.
Fix: four lines at the end of Colors — "Colour-vision coverage: type ✓, health ✓, stack ✗, network ✗; zone tint is a grouping cue only, identity is the label. Keyboard and screen-reader support are out of scope for v1 — see `EXPERIENCE.md` → Accessibility Floor."

**[Accessibility]** — Contrast table row 4 states a failure that does not exist (DESIGN.md → contrast table row 4)
Stack pastille, light, asserts **3.5–6.6** against its own 4.5:1 floor; the real range is **4.83–6.56**, which passes. The row states a failure that does not exist and contradicts itself in the same line — evidence the table was transcribed rather than re-derived.
Fix: correct to 4.8–6.6.

### Low (20)

**[Flow coverage]** — Flow 2's climax is a long untranslated French quotation (EXPERIENCE.md:228)
Deliberate — "The climax is Jules's own, verbatim" — but the file is otherwise English-only per its own Foundation row, and a downstream reader cannot act on it.
Fix: keep the quote, add the one-line English gloss.

**[Token completeness]** — The dark/light resolution rule lives only in a YAML comment (DESIGN.md:10–15)
No component ever names a light token — every one references the bare name. A consumer must infer suffix-swapping.
Fix: restate the rule in the body prose, where a human reading the rendered Markdown will see it.

**[Component coverage]** — `Image` has an EXPERIENCE.md row but no DESIGN.md entry (EXPERIENCE.md:86)
Defensible — it is a negative-space decision, "never a bubble" — but the pairing is asymmetric, and DESIGN.md's Detail panel says nothing about the image line it is supposed to hold.
Fix: one sentence in Detail panel.

**[State coverage]** — The Left menu has no states (EXPERIENCE.md §State Patterns)
Filter counts at zero, counts during cold load, the orphan counter when there are no orphans.
Fix: one row, or an explicit line saying chrome carries no states.

**[Visual reference coverage]** — DESIGN.md carries no visual reference link of any kind (DESIGN.md)
It never restates spines-win either. Since all four of its citations are unspecific nicknames, a consumer reading DESIGN.md alone has no path to follow.
Fix: one link at Brand & Style is enough.

**[Bloat & overspecification]** — DESIGN.md's Open Questions row duplicates EXPERIENCE.md's row 1 nearly verbatim (DESIGN.md:788 / EXPERIENCE.md:267)
One owner is enough for a question that belongs to neither file.
Fix: keep it in EXPERIENCE.md, cross-reference from DESIGN.md.

**[Bloat & overspecification]** — "the brief's top external success signal" is restated five times across the pair (DESIGN.md:509, 556, 587, 743; EXPERIENCE.md:24)
It is load-bearing once.
Fix: state it in Brand & Style and reference it thereafter.

**[Inheritance discipline]** — "Open in both files, and the two agree it is open" is true in spirit and false against the tables (EXPERIENCE.md:268 vs DESIGN.md:749, 788)
DESIGN.md marks the on-screen-control appearance `[ASSUMPTION]` inline but does not list it in its own Open Questions table, which carries exactly one row.
Fix: add the row to DESIGN.md's Open Questions.

**[Legibility at scale]** — The invariant core is geometrically degenerate at map scale (DESIGN.md §shape.bubble.core)
0.59w × 0.50h at r = 9.4 gives 11.1 × 9.4px with a `{rounded.lg}` 6px corner radius — that is a stadium, not a rectangle, and it holds nothing at rung 0.
Fix: stop drawing the core below the rung where it carries content; it is a layout invariant, not a mark.

**[Legibility at scale]** — `{stroke.contour-inner}` at 0.87r is 1.2–1.8px inside the outer contour at map scale (DESIGN.md §stroke.contour-inner)
Two hairlines that close together are a moiré, not "the instrument's second ring."
Fix: bind it to a rung, same as the shadow.

**[Legibility at scale]** — Working-artifact drift: the zone study draws a container-to-container edge type that does not exist (.working/zone-overlap-options-2026-09-10.html)
It draws "4 container-to-container links" as real edges. Neither spine defines that type — `{components.edge}` names exactly two. If it ever entered the model it would be catastrophic: a 40-container network alone is 780 edges.
Fix: note in the study that c2c links are not a Portolan edge type, before someone builds from the picture.

**[Brief fidelity]** — D5: the three-seam architecture constraint is unacknowledged where the UI couples to the collector (EXPERIENCE.md §Voice and Tone, §State Patterns → Socket unreachable)
The brief calls collector/model/renderer independence "a binding input to the architecture work". Two UX decisions sit on that seam and neither notes it: the hard voice rule that Docker nouns are "never renamed, never prettified", and the socket-unreachable screen, the only teaching screen in the product, whose content is Swarm-specific by construction. A second collector later means both surfaces change, and nobody has been told.
Fix: one note at each of the two surfaces.

**[Brief fidelity]** — M1: the empty-filter fallback is a filter that does not remove; disclosed but unmarked (EXPERIENCE.md §State Patterns → Filter yields nothing)
When a filter would empty the map, excluded objects return at `{opacity.dim.filter-context}` 0.10. In that state the brief's rule "only filtering takes things away" does not hold. Disclosed, reasoned and confined to one case — but not marked with the convention, and it is the one case where the rule is actually broken.
Fix: mark it.

**[Brief fidelity]** — R4: the non-specialist bar is asserted as met by rung-0 pastilles, untested (EXPERIENCE.md §Interaction Primitives, LOD rung 0)
The brief's bar is that a non-specialist could *follow the picture*. Rung 0 offers a coloured square whose meaning is decoded in a legend band, over object names that by hard rule are never prettified. It may satisfy the bar; asserting that it does, without a test, borrows the brief's authority for an untested claim — and `DESIGN.md` §Open Questions is admirably honest that rung-0 legibility "needs a real cluster of a few hundred objects, not a lab of three".
Fix: add the same hedge, or drop the attribution.

**[Accessibility]** — Six type roles carry no colour token at all (DESIGN.md → Components)
`bubble-name`, `plate`, `zone-label`, `zone-sub`, `section-label`, `graduation` — so two of the table's twelve rows measure pairs the Components section never assigns.
Fix: assign them; the table is otherwise unverifiable by a builder.

**[Accessibility]** — `brass-light` as text fails 4.5:1 in two places (DESIGN.md → Components → Detail panel, Chart legend)
**3.91:1** on `panel-light` (mount flags in the detail panel) and 4.06:1 on the light chart-legend ground — both below 4.5:1, at `{typography.section-label}` 8px in the legend case.
Fix: darken `brass-light` toward `#7A6430` for text use, or exempt it explicitly as a graphical mark.

**[Accessibility]** — Colors prose says body ink is "15:1 in either mode"; light is 18.08:1 (DESIGN.md → Colors, "Ground and ink")
The table itself says 18.1.
Fix: "15:1 dark, 18:1 light".

**[Accessibility]** — `Space` + drag pans, inside a decision recorded as "Keyboard shortcuts — none, anywhere" (EXPERIENCE.md → Interaction Primitives)
Space is also the browser's activate-focused-control key, so it will collide with any tab order added later.
Fix: fold into the accelerator rewording — "Space-drag is a pointer modifier, not a shortcut" — and note the collision.

**[Accessibility]** — Active-tab indication rests on a 1.04:1 background differential (DESIGN.md → Components → Bottom tab bar)
A 1px inset rule plus a colour change: the active background differential is **1.04:1** dark / **1.01:1** light. Which of three views you are in is the most load-bearing state in the chrome.
Fix: keep the rule but thicken it, or give the active tab a real ground step.

**[Accessibility]** — Attachment edge measures 4.18:1 dark where the table says 4.2 (DESIGN.md → contrast table row 8)
Rounding down. Floor is 3:1, so no consequence beyond the "measured" claim.
Fix: state 4.18, or round consistently.

## Mechanical notes

- **Consolidation.** 84 raw findings across four reports (rubric 30, legibility-at-scale 16, brief-fidelity 16, accessibility 22). Six were duplicates found by two reviewers independently and are merged, giving **78 consolidated findings: 7 critical · 18 high · 33 medium · 20 low**.
- **Count discrepancy.** `.memlog.md` entry 161 records "83 findings … accessibility 21"; the accessibility report's own findings list carries 22 bullets (2 critical · 5 high · 9 medium · 6 low), so the true raw total is 84. The brief-fidelity report likewise states "5 medium, 3 low–medium" in its header while its own summary table carries 6 medium and 2 low–medium; the table was taken as authoritative and its two Low–Med findings normalised upward to medium.
- **Ruled on since the review.** Ten findings are marked rather than deleted — eight fully resolved, two partly. One ruling (the hue + pattern octave) closes two criticals at once, because the pattern rides on the zone as well as the badge. The spines themselves have **not** yet been edited: `DESIGN.md:725` still carries the `SOCKET MOUNTED :RO` chrome and `EXPERIENCE.md:30` still asserts the contradiction inside the brief. The rulings exist in `.memlog.md`; the edits do not exist in the spines.
- **Numbers preserved.** All recomputed contrast ratios and ΔE values are the reviewers' own figures, carried through unrounded and unaltered.
- **Frontmatter.** Both files parse as valid YAML; both carry `name`, `description`, `status: draft`, `updated: 2026-09-10` and a two-entry `sources` list, and both source paths resolve. DESIGN.md declares 17 top-level keys (5 canonical + 7 declared extensions + 5 metadata); EXPERIENCE.md declares metadata only, correct for a spine that owns no tokens.
- **Cross-references.** 84 distinct `{path.to.token}` references; all resolve except the generic `{token}` prose placeholder and `{colors.pastille-*}`. EXPERIENCE.md uses 30 distinct references, matching `.memlog.md` entry 137.
- **Colours.** 122 tokens, every value a valid six-digit hex, every non-`-light` token with a `-light` twin and every `-light` token with a base — zero exceptions. The one colour without a light value (`#46535C`) escapes only because it was never tokenised.
- **Contrast.** All 12 table rows were recomputed independently by two reviewers; every stated ratio is correct to within rounding, and the claimed iso-luminance of the six-hue zone rotation holds (1.13–1.19 against ground in both modes). Nine of twelve verify to ±0.05 under the stricter accessibility recomputation; the three that do not are rows 4, 9 and 11, each filed above.
- **Name consistency.** No component-name drift across the four lists. `Export (SVG / PNG)` matches exactly in both files; `Orphan bubble` and `Orphan counter` are correctly kept distinct; the left menu's `filter swatch` and the `chart legend` are explicitly distinguished — a named risk in `.memlog.md` entry 160, handled.
- **No Mermaid** in either file — nothing to validate.
- **Working artifacts.** `ia-portolan-2026-09-10.excalidraw` parses, 79 elements, and contradicts the drift note that describes it. Its text is in French while the decided UI language is English — not a conflict under spines-win, but worth knowing before it is promoted to `wireframes/`. The six HTML files all carry `<title>` and are self-contained.
- **What holds, and is worth not losing.** The structural bet is right and is the one that matters: networks as areas rather than edges converts ~660 of ~700 edges into local stubs, leaving ~40 long edges and ≈5 expected crossings — Portolan does not hairball. Killing image nodes removed the single worst structure the graph could contain. The iso-luminant rotation genuinely works (mount 7.30–7.73, attach 4.18–4.42 across all six tints, a 6% spread). The object-type family is CVD-safe and it is the only family at rung 0. Light mode survives the scale test better than the dark default. And the keyboard and screen-reader exclusions are the model the rest of the floor should be rewritten to match: named, unhedged, consequence drawn.

## Reviewer files

- `review-rubric.md`
- `review-legibility-at-scale.md`
- `review-brief-fidelity.md`
- `review-accessibility.md`
