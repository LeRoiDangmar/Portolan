---
title: "Brief Fidelity Review — Portolan UX"
reviewer: brief-fidelity
date: 2026-09-10
subjects:
  - DESIGN.md
  - EXPERIENCE.md
against:
  - ../../briefs/brief-Portolan-2026-09-09/brief.md
  - ../../briefs/brief-Portolan-2026-09-09/addendum.md
---

# Brief Fidelity — Portolan

## Verdict

The declared departures are handled unusually well: all four brief-facing `override` entries in the memlog are marked `[DEPARTS FROM BRIEF]` in `EXPERIENCE.md`, each names the brief sentence it breaks, and each states its cost — these are real justifications, not decoration. The failures are elsewhere. **Three silent contradictions remain**, the worst of which prints a security guarantee into the permanent chrome that the brief expressly reserves for the architecture work — and which is, as written, false. A second silently deletes a v1 scope item (user-adjustable colours) while citing the same brief sentence as authority for the item it kept. A third has the product's own microcopy deny the health departure that the same file declares fifty-five lines earlier.

Separately, the governing principle of *both* spines rests on an asserted self-contradiction inside the brief that the brief does not contain. That is the single highest-leverage reverse-direction finding: it is the licence under which graphic density was admitted, and it was never the brief's.

Severity below = downstream impact, i.e. what an implementer or a PRD author would build wrong from these documents alone.

## Binding statements — treatment table

| Brief statement | Treatment | Where |
|---|---|---|
| "**Legible over impressive**" | **Reinterpreted, presented as upheld** — read as a constraint on *reading load* only, licensed by an asserted contradiction inside the brief. See R1. | `EXPERIENCE.md` §Foundation (governing principle); `DESIGN.md` §Brand & Style |
| "the *edges* are the actual product" | **Upheld**, and enforced: "Nothing in any rendering choice is permitted to dissolve an edge"; attachment edge lifted `#3E5E6B`→`#5B8494` because the original measured 2.45:1; iso-luminant zone rotation makes the ≥3:1 floor checkable; metaballs banned for the same reason. Two minor unmarked frictions: M3, M4. | `EXPERIENCE.md` §Component Patterns → *Edge*; `DESIGN.md` §Colors, §Edge |
| "A **topology tool, not another dashboard**" | **Upheld with drift risk.** No inventory surface, no metrics panel, no charts. Three dashboard-shaped marks exist: the health light (declared), the orphan counter (partially justified — S/D2), and per-filter counts in the left menu (benign). | `EXPERIENCE.md` §IA, §Inspiration & Anti-patterns; `DESIGN.md` §Left menu, §Orphan counter |
| "**Portolan does not tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself**" | **Declared departure** (health traffic light), marked in both spines, alternatives named and declined — *and then denied by the product's own permanent footer copy.* See **S3**. | `EXPERIENCE.md` §Component Patterns → *Health pastille*; `DESIGN.md` §Colors, §Health pastille; footer denial at `DESIGN.md` §Detail panel |
| "**Filters are structural, not cosmetic** — zoom moves you closer, only filtering takes things away" | **Declared departure** (progressive LOD), with an exact reconciliation: "Zoom changes sharpness, never population. Filter changes population, never sharpness." Two narrow unmarked exceptions: M1, M2. | `EXPERIENCE.md` §Interaction Primitives |
| "**colour carries network membership**" | **Declared departure**, marked in both spines. Encoding moves from bubble-fill to four pastille families; networks carried by zones + the network hexagon, whose hue *is* its zone's badge strength. | `EXPERIENCE.md` §Component Patterns → *Pastille*; `DESIGN.md` §Colors |
| Read-only; "any write or management operation" out of v1 | **Upheld in behaviour** — "No write path exists anywhere in this document", writes/remediation banned, Flow 3 step 7 sends the user back to their terminal. **Over-claimed in chrome** — see **S1**. | `EXPERIENCE.md` §Foundation, §Banned; `DESIGN.md` §Left menu |
| One swarm; no multi-cluster | **Upheld.** No multi-cluster affordance anywhere. | `EXPERIENCE.md` §Foundation |
| Swarm only — "anything that is not Docker Swarm" out of v1 | **Upheld.** Zero occurrences of Kubernetes/k8s in either spine outside the addendum's dead-3D-project list. Docker/Swarm vocabulary is a hard voice rule. | `EXPERIENCE.md` §Voice and Tone |
| "no audit engine, no rules, no alerts" | **Upheld except the declared health departure** — "Any rule engine, audit or alert (brief), the health light excepted." Departure scope understated: a three-state classification needs a threshold nobody specifies. See S3. | `EXPERIENCE.md` §Banned |
| "SVG/PNG export — wanted later, screenshot accepted for now" (out, v1) | **Declared departure**, marked in `EXPERIENCE.md`. **Unmarked in `DESIGN.md`**, which derives four requirements from it. Justification is partly circular. See D2. | `EXPERIENCE.md` §Component Patterns → *Export*; `DESIGN.md` §Typography, §Chart legend, §Layout, §Do's and Don'ts |
| "the bar is that a **non-specialist could follow it**" | **Upheld with strain.** Rung 0 gives object-type pastilles whose decoding lives in the chart legend, over Docker nouns that are never prettified by hard rule. Defensible; the attribution is slightly over-claimed (R4). | `EXPERIENCE.md` §Interaction Primitives (LOD rung 0) |
| "all object types … whether every type is a graph *node* rather than a detail-panel attribute is an open rendering decision" | **Partly closed, partly silently dropped.** Images closed explicitly and well (addendum Q2 answered, fan-in rationale cited). Nodes closed implicitly (backdrop + own view). **Stacks never decided.** See D3. | `EXPERIENCE.md` §Component Patterns → *Image*, *Node backdrop*; `DESIGN.md` §Pastille |
| "filtering and display control (**what is shown, colours, text size**)" | **SILENT CONTRADICTION.** Text size kept and cited to the brief; colours dropped and structurally foreclosed. See **S2**. | `EXPERIENCE.md` §Component Patterns → *Left menu*, §Accessibility Floor; `DESIGN.md` §Colors, §Typography |
| "auto-refresh every 5–10s, **configurable**" | **Silently dropped at the UI level.** Restated in Foundation as inherited fact; no control for it exists on any surface. See D4. | `EXPERIENCE.md` §Foundation vs §Component Patterns → *Left menu* |
| 3D retired (2026-09-09) | **Upheld, and explicitly reconciled.** "Depth is stylistic, never spatial." No perspective, no isometry, no z-axis; 3D visualisers listed under Rejected. | `DESIGN.md` §Elevation & Depth; `EXPERIENCE.md` §Inspiration & Anti-patterns |
| Security posture — "**Privilege minimisation.** Read-only at the product level is a promise, not a mechanism. Whether the socket can be mediated … determines whether that promise is enforced or merely intended" | **SILENT CONTRADICTION.** See **S1**. | `DESIGN.md` §Left menu (permanent marginalia) |
| Security posture — "**Authentication and exposure.** Who can open the map, and is it reachable from outside the cluster? … a reconnaissance gift if left open" | **Silently dropped, completely.** No auth surface, no session, no exposure statement anywhere in either spine — while export is promoted to v1 and a whole flow ends in publishing the topology. See **D1**. | absent from both spines |
| "Always current … the map never goes stale" | **Upheld and refined honestly.** The stale treatment ages the chart in place rather than hiding it; no manual redraw ever exists. | `EXPERIENCE.md` §State Patterns → *Stale data* |
| "Runs inside the swarm it maps, one `docker stack deploy`" | **Upheld.** Both flows open that way. | `EXPERIENCE.md` §Key Flows |
| "graph model and renderer stay independent of the Swarm-specific collector" (binding architecture input) | **Not acknowledged where it touches the UI.** Not a contradiction — v1 is Swarm-only by decision — but the hard Docker-vocabulary rule and the Swarm-specific teaching screen are renderer-side couplings and neither spine notes the constraint. See D5. | `EXPERIENCE.md` §Voice and Tone, §State Patterns → *Socket unreachable* |
| "It does not replace Portainer; it sits beside it" | **Upheld.** Portainer/Swarmpit/Arcane explicitly under Rejected as "inventory, not topology". | `EXPERIENCE.md` §Inspiration & Anti-patterns |

## Silent contradictions (critical)

### S1 — The chrome ships a security guarantee the brief reserves for architecture, and the guarantee is false — **CRITICAL**

`DESIGN.md` §Left menu:

> A permanent marginalia block sits at the foot: *READ ONLY · SOCKET MOUNTED :RO · NO WRITE POSSIBLE*.

The brief, §Addendum → Open questions → 1:

> "**Privilege minimisation.** Read-only at the product level is a promise, not a mechanism. Whether the socket can be mediated (a proxy restricted to read verbs rather than the raw socket) determines whether that promise is enforced or merely intended."

and:

> "a tool built to help people check their infrastructure for anything odd must not itself be the odd thing."

Three separate problems, compounding:

1. **It decides an architecture question the brief explicitly left open.** The brief says the mediation question *determines* whether read-only is enforced. `DESIGN.md` answers it — the socket is mounted raw, with `:ro` — in a chrome string, in a UX document, with no marker, no rationale, and no acknowledgement that a decision was taken.
2. **It is technically wrong.** `:ro` on a `/var/run/docker.sock` bind mount makes the *socket inode* read-only; it does not restrict the Docker API reachable through it. A process with that mount can still `POST /containers/create`. The string asserts "NO WRITE POSSIBLE" for a configuration under which writes are entirely possible.
3. **It is the highest-trust surface in the product.** It is permanent, it is in the left menu of every screen, and it is inside the exported frame the flows are built to have strangers post. The brief's own worry is that the tool must not be the odd thing; this ships a false assurance about exactly that.

Downstream impact: a PRD or architecture author reading these spines will treat the mediation question as settled, and settled the wrong way. The Portolan container will be specified with a raw manager socket and the product will tell its users it cannot write.

**Fix shape:** delete the mechanism claim from the chrome, or reduce it to what the product actually knows (`READ ONLY` as a product posture). If a mechanism claim is wanted, mark it `[DEPARTS FROM BRIEF]`, say that it pre-empts addendum open question 1, and make it true (a read-verb-restricted socket proxy is the only configuration under which "no write possible" is a fact).

### S2 — User-adjustable **colours** are deleted from v1 scope, while the same brief sentence is cited as authority for text size — **HIGH**

Brief, §Scope, In v1:

> "filtering and display control (**what is shown, colours, text size**)"

Both spines keep two-thirds of that sentence and cite it:

- `EXPERIENCE.md` §Accessibility Floor: "**Adjustable text size … and density … are first-class controls in the left menu, not a settings afterthought — the brief makes user-adjustable presentation a requirement.**"
- `DESIGN.md` §Typography: "**`{typography.scale}` is a first-class control in the left menu**, not a settings afterthought — user-adjustable presentation is a brief requirement."

The colours half is nowhere. The complete left-menu inventory is filters, zone rendering mode, text size, density, theme, export, and the reachability hop limit. No colour control exists on any surface.

Worse than an omission, the palette is **structurally foreclosed**:

- `DESIGN.md` §Colors: zone hues are "a six-step rotation assigned in **creation order** and then **held for the life of the network**" — the user has no say in which network gets which tint, and the repeat past six is declared "the rule rather than a limit".
- "Everything that is neither metal nor ink is graphite. This is the single rule that keeps the map from becoming a colour chart."
- Brass, steel and glass "each has exactly one job", and the Do's/Don'ts forbid reusing any of them.

The design is coherent — arguably better than what the brief asked for — but that is a decision, and it contradicts a written v1 scope item. Selectively quoting the same sentence for the surviving half is what makes it a silent contradiction rather than a gap: a downstream reader sees the brief cited and concludes the requirement was honoured.

Downstream impact: a v1 ships without a scope line, and nobody knows it was dropped. Also removes the user's own escape hatch from the seventh-network tint repeat, which `DESIGN.md` §Open Questions admits is untested.

**Fix shape:** either mark it `[DEPARTS FROM BRIEF]` in `DESIGN.md` §Colors with the reason (a user-editable palette destroys the iso-luminant guarantee the ≥3:1 edge floor depends on — a genuinely strong argument, and it should be made out loud), or restore a bounded colour control (e.g. reassign which of the six hues a network takes, without leaving the validated set).

### S3 — The product's permanent footer denies the health departure the same file declares — **HIGH**

`DESIGN.md` §Detail panel:

> Footer, permanently: *Portolan renders the observed state. No threshold, no rule, no verdict.*

`DESIGN.md` §Health pastille, fifty-five lines earlier:

> **[DEPARTS FROM BRIEF]** … **this renders a verdict**, and the brief says Portolan does not.

Both cannot be true. And the footer is wrong on all three of its own terms:

- **verdict** — the departure is declared precisely as a verdict;
- **threshold** — `degraded` (`#C08A3C`) is not an observed state Docker hands over; it is a classification produced by comparing running replicas to desired. That is a threshold;
- **rule** — the mapping *(replicas, task state) → nominal | degraded | stopped* is a rule, and **it is specified nowhere in either spine**. `EXPERIENCE.md` §Banned bans "any rule engine … the health light excepted", which concedes the rule exists without defining it.

The declared departure therefore understates its own scope: it is presented as a colour choice ("a traffic light") when it is in fact the introduction of the product's only classification rule. Both spines take care that *text* never adds a second verdict (`EXPERIENCE.md` §Voice and Tone: "3/5 replicas running." over "Warning: this service is degraded.") — and then a permanent line of text asserts the opposite of what the badge does.

Downstream impact: an implementer ships microcopy that lies to the user, and has to invent the degraded threshold themselves because nobody wrote it down.

**Fix shape:** rewrite the footer so it survives the departure (e.g. *"Portolan renders the observed state. The health light is the one exception, and it is not an alert."*), and specify the three-state rule in `EXPERIENCE.md` where the departure is declared.

## Declared departures — are they justified?

Four `override` entries in `.memlog.md` face the brief (48, 57, 70, 103/116). Two further `override` entries (105, 163) are internal corrections, not brief departures; both landed correctly — 105 in §Accessibility Floor's plainly-stated CVD limit and the blue/amber/red fix, 163 in the Bubble row's `sans l'écrasement` narrowing.

| # | Departure | Marked in `EXPERIENCE.md` | Marked in `DESIGN.md` | Justification |
|---|---|---|---|---|
| 1 | Colour no longer carries network membership (memlog 48) | Yes — *Pastille* row | Yes — §Colors | **Real.** Names the sentence, states the replacement (four families, shape=family/colour=value), and keeps network membership recoverable two ways (zone tint + hexagon whose hue *is* the zone's badge strength). The tint's deliberate 1.18:1 weakness is explicitly covered by the hexagon. Nothing decorative here. |
| 2 | SVG/PNG export promoted into v1 (memlog 57) | Yes — *Export* row | **No** — and `DESIGN.md` derives four requirements from it | **Real but partly circular.** See D2. |
| 3 | Progressive LOD vs "only filtering takes things away" (memlog 70) | Yes — §Interaction Primitives | **No** — though `DESIGN.md` enforces the ladder ("Drop the LOD rung instead", the 9px floor, rung-0 text suppression) | **Real, and the strongest of the four.** The reconciliation is exact and testable: population identical at every rung, only text quantity changes. It arguably *narrows* the brief's rule rather than breaking it, and the spine still marks it — correct conservatism. |
| 4 | Health traffic light (memlog 103, revised 116) | Yes — *Health pastille* row | Yes, twice — §Colors and §Health pastille | **Real, but scope understated, and contradicted in-product.** Alternatives named and declined (neutral fact; stopped-only colour). Cost stated. Blue-over-green is justified on CVD grounds, not aesthetics, and red is deliberately the tightest contrast in the file "since it is the one carrying the departure" — that is a designer taking a departure seriously. Two failures: the classification rule it implies is never specified, and §Detail panel denies it (**S3**). |

### D2 — the export departure, in detail — **MEDIUM**

Marked and reasoned in `EXPERIENCE.md`. Two weaknesses:

1. **Unmarked in `DESIGN.md`, which spends real budget on it.** Fonts embedded in the image ("a system stack means every screenshot renders differently"), light palette made first-class, the chart legend declared "in the export. It is part of the chart", the graduated bezel and corner crosses declared uncroppable from the exported frame. Four visual requirements rest on a v1 scope reversal that `DESIGN.md` never flags. A reader of `DESIGN.md` alone cannot tell a departure was taken.
2. **The justification cites a signal the brief satisfies without it.** The stated reason is "the exported frame is what strangers post, and that is the brief's top external success signal". The brief's own sentence is: "SVG/PNG export — wanted later, **screenshot accepted for now**", and the signal reads "A stranger posts a **screenshot** of their own cluster". The brief already routed that signal through the screenshot. The departure's real argument is a different and better one — that a screenshot cannot carry the chart legend, the bezel, or a chosen framing — and it is not the one made.
3. Not raised anywhere: export produces a **portable artefact containing the full topology**, which is the object of the brief's reconnaissance warning. See D1.

## Silently dropped

### D1 — Authentication and exposure: absent from both spines — **HIGH**

The brief ranks this **first** among the questions carried to architecture:

> "**Authentication and exposure.** Who can open the map, and is it reachable from outside the cluster? A read-only tool that exposes every IP, network and volume in an infrastructure is a **reconnaissance gift if left open**."

Neither spine contains the words auth, login, session, credential, exposure, or reconnaissance. There is no auth state in §State Patterns, which is otherwise exhaustive (cold load, end of first load, landed, alive at rest, layout stability, selection, empty filter, stale, socket unreachable, empty cluster, below viewport, zone-mode switch, reduced motion). There is no auth surface in the IA, which claims completeness: "Every surface in the Information Architecture now carries a journey."

Authentication is not purely an architecture concern — it is a screen, a state and a first-run experience, all of which are this document's job. Two things aggravate the silence:

- **Export was promoted to v1** specifically to make the topology portable and postable.
- **Flow 2's climax is publishing it.** Tom "exports PNG at that framing. He posts it." Nothing in the flow, the export component, or the failure paths raises what is in that frame — IPs and CIDRs are named as rendered content (`{typography.zone-sub}` carries the CIDR; the detail panel carries IPs), and no redaction, sanitising or "safe to share" affordance exists.
- **The spine asserts closure over the gap:** "Every blocker, every undecided state and every gap found while writing this spine has since been closed."

Downstream impact: the most likely v1 is an unauthenticated full-topology viewer with a one-click export, which is the exact artefact the brief warned about — and the UX documents will read as if that were considered.

**Fix shape:** at minimum an Open Question row naming it as inherited from the brief and not addressed here; better, a first-run access state and one line in *Export* about what the frame contains.

### D3 — "Is a stack a bubble?" never decided — **MEDIUM**

The brief makes the per-type rendering call an explicit open decision: "whether every type is a graph *node* rather than a detail-panel attribute is an open rendering decision". The spines close it superbly for images (own component row, fan-in rationale quoted from the brief, cost stated, consequences propagated to the pastille family and the left menu) and implicitly for nodes (backdrop layer + own foreground view + not selectable on the overview).

**Stacks are left in three inconsistent states:** `DESIGN.md` §Pastille lists `stack` `#8F7FB8` as an object-type *value*, which implies a stack can be a bubble carrying a type pastille; `EXPERIENCE.md` §IA says the overview foregrounds "stacks, volumes and network zones"; LOD rung 0 renders "stack names" as large labels; and there is no *Stack* row in either spine's component tables. Zones are networks, so a stack is not a zone. Whether a stack is a bubble, a label, or a grouping is unanswerable from these documents.

Downstream impact: the layout engine and the graph model are specified differently depending on which reading an implementer picks, and stack membership is one of the four pastille families.

### D4 — The configurable refresh interval has no control — **MEDIUM**

Brief, §Scope, In v1: "auto-refresh every 5–10s, **configurable**". `EXPERIENCE.md` §Foundation restates it as inherited ("polled refresh 5–10s configurable (brief)") and then no surface offers it. The left menu is fully enumerated in both spines and the interval is not in it; nor is it in the toolbar, the tab bar, or a settings surface (there is no settings surface). Configurability that exists only in a config file is a decision — it may well be the right one — but it is not recorded as one.

### D5 — The three-seam architecture constraint is unacknowledged where the UI touches it — **LOW**

The brief calls collector/model/renderer independence "**a binding input to the architecture work**". Two UX decisions sit on that seam and neither notes it: the hard voice rule that Docker nouns are "never renamed, never prettified" (a renderer-level commitment to one collector's vocabulary), and the socket-unreachable screen, the only teaching screen in the product, whose content is Swarm-specific by construction. Not a contradiction — v1 is Swarm-only by written decision — but a second collector later means both surfaces change, and nobody has been told.

## Minor unmarked departures

| # | Finding | Severity |
|---|---|---|
| **M1** | **A filter that does not remove.** §State Patterns → *Filter yields nothing*: when a filter would empty the map, excluded objects return at `{opacity.dim.filter-context}` 0.10. In that state the brief's rule "only filtering takes things away" does not hold. It is disclosed, reasoned, and confined to one case — but it is not marked with the convention, and it is the one case where the rule is actually broken. | Low |
| **M2** | **A third instrument that takes things away.** The reachability highlight dims the unselected set to 0.18, "which puts dimmed text at 1.5:1 effective. That is the intent: **present, never readable, never removed**." A click therefore removes legibility outside the zoom/filter dichotomy the brief set up. Both spines distinguish dimming from filtering *internally* (and keep the two dim levels visibly different, which is good), but never reconcile the third instrument with the brief's rule. Also: the **adjustable hop limit** is placed in the left menu, which `EXPERIENCE.md` declares to contain exactly "two kinds of control, and the difference is load-bearing" — the hop limit is neither a filter nor a display control. | Low–Med |
| **M3** | **Mode B fragments the edge set.** Echo bubbles carry "the edges of its own zone", so "**neither copy shows the object in full**". In a product whose brief says the edges *are* the product, no view of a multi-network object shows all its edges in that mode. Disclosed as an accepted cost of the geometry; never weighed against the brief statement. Mitigated by mode B not being the default. | Low–Med |
| **M4** | **The orphan counter's justification defends the wrong thing.** "A finding aid, not an annotation: it does not modify the orphan bubble's drawing in any way, so the tool still never marks an orphan as abnormal." The argument is about the *map*; the counter is chrome, and chrome is where a verdict would live. It is the only anomaly class in the product with a dedicated chrome row, and "objects with no stack" is a factual predicate the session itself calls the orphan discovery. The counter is defensible — an unread orphan is the brief's own legibility failure — but the justification as written does not reach the object it needs to defend. It is also the seam along which an audit engine grows: the second such row is a findings list. | Medium |

## Claims the brief does not support

### R1 — "a contradiction inside the brief itself" — **HIGH**

`EXPERIENCE.md` §Foundation:

> "This principle arbitrates a contradiction inside the brief itself: its headline bar is *legible over impressive*, yet its top external success signal **depends on someone screenshotting *because* it is impressive**."

echoed in `DESIGN.md` §Brand & Style ("The brief's *legible over impressive* is honoured by reading it as a constraint on **reading load**, not on graphic richness").

The brief contains no such contradiction. Its signal reads, in full: "A stranger posts a screenshot of **their own** cluster in Portolan." The emphasis in the brief is on *their own* — the signal is that a stranger reached for the tool on infrastructure the author does not control, which is a *use* signal. Nothing in the brief attributes the posting to impressiveness; the brief's stated bar for the same picture is "a non-specialist could follow it".

This matters more than a citation error, because the invented contradiction is what licenses the reinterpretation, and the reinterpretation is **the governing principle of both spines** — `DESIGN.md` calls `beaucoup à regarder, peu à lire` "the most important line in this file" and says "Every decision below is measured against this line."

The principle itself may well be right; the derivation is not. A reader downstream inherits "the brief contradicts itself here", which is false, and inherits it as settled.

**Fix shape:** state it as what it is — a session decision that graphic richness is compatible with the brief's bar, taken to serve journey 2, with the brief's ordering left intact. That framing costs nothing and survives scrutiny; the current one does not.

### R2 — "presque trop pour que ce soit facilement lisible" as a design target — **MEDIUM**

Flow 2's climax is quoted verbatim and correctly attributed to Jules: the frame is "*almost too much to be easily legible*, but so classy to flex in front of colleagues". `EXPERIENCE.md` immediately reconciles it — "the richness is graphic, not textual, which is exactly how the same frame stays legible for Rémi" — and presents the result as compatible with the brief. A stated intent that the default screen be *almost too much to read easily* is in direct tension with a bar that reads "legible over impressive", and the reconciliation is an argument, not an observation. It should carry the departure marker or an explicit note that the brief's ordering was tested and held; it carries neither.

### R3 — Screenshot-worthiness as a brief requirement — **MEDIUM**

The session recorded "[from brief] Screenshot is a first-class output path for v1 … Default-view screenshot-worthiness is a real UX requirement" (memlog 23). The brief says two things, neither of which is that: export is **out of v1** with "screenshot accepted for now", and a stranger's screenshot is a **success signal** — an outcome measure. Turning an outcome measure into a design requirement is a legitimate move; presenting it as inherited is not. It now underwrites, in the spines, export-in-v1, embedded fonts, light-palette parity, legend-in-export and bezel-in-export. Four of those five are good decisions on their own merits; all five are attributed to the brief.

### R4 — the non-specialist bar attached to rung-0 pastilles — **LOW**

LOD rung 0: "From far away you see *what* things are before you understand them — **the brief's non-specialist bar**." The brief's bar is that a non-specialist could *follow the picture*. Rung 0 offers a coloured square whose meaning is decoded in a legend band, over object names that by hard rule are never prettified. It may satisfy the bar; asserting that it does, without a test, borrows the brief's authority for an untested claim. `DESIGN.md` §Open Questions is admirably honest that rung-0 legibility "**needs a real cluster of a few hundred objects, not a lab of three**" — R4 is the same claim made without that hedge.

## Summary of findings

| ID | Finding | Class | Severity |
|---|---|---|---|
| S1 | `SOCKET MOUNTED :RO · NO WRITE POSSIBLE` in permanent chrome — pre-empts the brief's reserved architecture decision and is technically false | Silent contradiction | **Critical** |
| S2 | User-adjustable colours dropped and foreclosed; same brief sentence cited for text size | Silent contradiction | **High** |
| S3 | Detail-panel footer *"No threshold, no rule, no verdict"* denies the declared health departure; the classification rule is unspecified | Silent contradiction | **High** |
| D1 | Authentication and exposure absent from both spines, under a completeness claim, alongside export-to-v1 and a publish-the-topology flow | Silently dropped | **High** |
| D2 | Export departure unmarked in `DESIGN.md`, which derives four requirements from it; justification partly circular | Declared, incomplete | Medium |
| D3 | Whether a stack is a bubble was never decided; three inconsistent traces | Silently dropped | Medium |
| D4 | Configurable refresh interval has no control on any surface | Silently dropped | Medium |
| M4 | Orphan counter's justification defends the map, not the chrome it lives in | Minor unmarked | Medium |
| R1 | Asserted "contradiction inside the brief" — the brief contains none; it licenses both spines' governing principle | Unsupported claim | **High** |
| R2 | "almost too much to be easily legible" adopted as the default screen's target without a departure marker | Unsupported claim | Medium |
| R3 | Screenshot-worthiness presented as inherited from the brief | Unsupported claim | Medium |
| M2 | Reachability dim removes legibility outside the zoom/filter dichotomy; hop limit sits outside the declared two-control taxonomy | Minor unmarked | Low–Med |
| M3 | Mode B echo fragments the edge set in a product whose brief says the edges are the product | Minor unmarked | Low–Med |
| D5 | Three-seam architecture constraint unacknowledged where the UI couples to the collector | Silently dropped | Low |
| M1 | Empty-filter fallback is a filter that does not remove; disclosed but unmarked | Minor unmarked | Low |
| R4 | Non-specialist bar asserted as met by rung-0 pastilles, untested | Unsupported claim | Low |

**Counts:** 3 silent contradictions · 4 declared departures (4/4 marked in `EXPERIENCE.md`, 2/4 marked in `DESIGN.md`) · 5 silently dropped · 4 unsupported claims · 4 minor unmarked departures. 16 findings: 1 critical, 4 high, 5 medium, 3 low–medium, 3 low.
