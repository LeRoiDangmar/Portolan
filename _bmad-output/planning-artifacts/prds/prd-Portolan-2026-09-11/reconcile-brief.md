---
title: "Reconciliation — brief → PRD (Portolan)"
status: review
created: 2026-09-11
source: ../../briefs/brief-Portolan-2026-09-09/brief.md
target: ./prd.md
---

# Reconciliation — brief → PRD

The PRD was assembled from a subagent's extract of the brief rather than from the brief itself. This
document walks the brief clause by clause and records, for each, whether it survives in the PRD, was
deliberately overridden, or is silently gone.

**Status vocabulary**

| Status | Meaning |
| --- | --- |
| `PRESENT` | Carried into the PRD with its substance intact. |
| `STRENGTHENED` | Carried and improved (number added, consequence named, made testable). |
| `FLATTENED` | The requirement survives; the reason, framing or evidence behind it does not. |
| `NARROWED` | The PRD says less than the brief allowed, without saying it is narrowing. |
| `WIDENED` | The PRD says more than the brief allowed, without saying it is widening. |
| `GONE` | No trace in the PRD. |
| `OVERRIDE (declared)` | The PRD departs from the brief and says so, or states the resolution. |
| `OVERRIDE (undeclared)` | The PRD departs from the brief and does not say so. |
| `CONTRADICTED` | The PRD asserts something the brief asserts otherwise, unreconciled. |

**Severity scale**

- **Critical** — a reader of the PRD alone will build the wrong thing, or will re-litigate a settled
  decision.
- **High** — load-bearing rationale, a named commitment or a strategic frame is missing; the PRD is
  internally unmotivated at that point.
- **Medium** — intent, voice or a secondary commitment lost; recoverable but not from the PRD.
- **Low** — phrasing or colour lost, substance intact.

---

## 1. Executive Summary

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "A Docker Swarm cluster is a graph, but every tool that manages one shows you lists." | `FLATTENED` — §1 says "Every tool in this space already ships a good inventory — a list of services, a list of networks, a list of volumes". | The antithesis (*is* a graph / *shows* lists) and the one-sentence pitch. The PRD has no sentence anyone would repeat. The brief's version is also sharper about *why* lists fail: they are well built and they are separate. | Low |
| Portainer named as the specific comparison: "will tell you your services, your networks and your volumes, each in its own well-built list — and never which container is attached to which network, which volume it mounts, **or what else shares them**." | `NARROWED` — generalised to "every tool in this space"; Portainer survives only as "sits beside it" and inside the founding scenario. | "**Or what else shares them**" — the co-tenancy question. The PRD's headline question is only *which network / which volume*; the brief also promised *who else is on it*. FR-37 recovers this for images alone; nothing states it for networks and volumes. | Medium |
| "Users have asked Portainer for that view **since 2017**; it has never been built." + issues #506 (closed unimplemented 2021), #1658, discussion #9921 + "See Addendum." | `GONE` — no citation, no date, no nine-year figure, and **the PRD never references the addendum at all**. | The entire documented-demand basis for the product. Note the asymmetry: §6.4 imports the addendum's *doubts* (MKE 4/k0s, EOL 2028-03-24, proxies disagreeing by 3.4×, Reddit unreachable) while leaving behind the addendum's *demand evidence*. The PRD therefore reads more pessimistic than its own source material. | High |
| "The only tool that ever rendered a real relational graph **at production quality**, Weave Scope, has been dead since 2023." | `GONE` as a fact; survives only as an undecodable allusion — §6.1's "*Weave Scope's grave is genuinely avoided*". | Who Weave Scope was, that it was the sole prior art, that it died, and the careful qualifier *at production quality* (added in the brief specifically because a live 24-star competitor exists). A PRD-only reader cannot decode the metaphor the PRD's central risk section rests on. | Medium |
| Object list in the render: "nodes, networks, volumes, stacks, services, containers, **images**". | `OVERRIDE (declared)` — FR-7 makes an image a detail-panel attribute, never a graph node; consequences and accepted cost stated; FR-37 recovers it on demand. | Nothing. This is the model of a well-handled override. | — |
| "**Colour carries network membership**" | `PRESENT`, reworked — FR-8 (zones), FR-11 (colour encodes value), NFR-14 (accepted colour failure at value level for networks, identity carried by written names). | Nothing hidden: NFR-14 states the degradation and names its consequence. Worth noting only that the brief's headline promise and NFR-12 ("colour never carries a dimension on its own") sit close enough to look contradictory until FR-11 is read. | Low |
| "clicking anything opens its text: IPs, image tags, mounts, placement" | `PRESENT` (FR-25, verbatim list) + `NARROWED` by FR-28: zones, stack outlines, edges and the node backdrop are **not** selectable. | "Anything" became "every bubble, and in node view every machine's region header". The narrowing is defensible and stated, but it is never flagged as a reduction of the brief's promise — in particular, a network zone is not clickable, and the network is the primary axis. | Low |
| "Read-only, live, one `docker stack deploy`." | `PRESENT` (FR-2, FR-1, NFR-1). | — | — |
| "It does not replace Portainer; it sits beside it." | `PRESENT` (§1 "Not" table). | — | — |
| **"The timing looks like the worst thing about this project. It is the best."** + Swarm shrinking + Portainer's March 2026 migration advisory + **"you cannot migrate a cluster you cannot map."** + "That decline is the opening, not the threat." | `CONTRADICTED` / `GONE`. The PRD has **no why-now section**. The only traces are the success signal "Someone reports using Portolan to prepare a migration off Swarm" — stripped of the brief's gloss "*— the timing thesis, confirmed*" — and §6.4, which frames Swarm's longevity purely as "an unresolved dependency". | The brief's strategic inversion, in full. The PRD keeps the threat half of the timing argument and discards the opportunity half, so the document now argues *against* its own existence where the brief argued for it. "You cannot migrate a cluster you cannot map" is the single sentence that justifies building this in 2026; it appears nowhere. | **Critical** |
| "Portainer has walked away from a need it left open for nine years, exactly as that need turns urgent." | `GONE`. | The incumbent-abdication argument. | High |
| "**Swarm is the beachhead, not the boundary** — the durable asset is the topology graph, not the collector behind it." | `FLATTENED`. The word "beachhead" is *used* twice (§1, §6.4) and **never defined**; the durable-asset claim survives only as NFR-5's engineering seam. | The thesis the word refers to. §6.4's "the case to reopen if the beachhead stalls" is meaningless to a PRD-only reader. NFR-5 is the right requirement with its strategic reason amputated — it now reads as tidy architecture rather than as the option that keeps the product alive past Swarm. | High |

---

## 2. The Problem

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "Answering the most basic question about a Docker cluster … is **not possible from any tool people actually run**." | `PRESENT`, softened to "None of them answers the question Portolan exists for". | "People actually run" — which carried the addendum's crowded-vs-vacant distinction (Portainer/Arcane/Swarmpit are the tools people run and have no graph; the tools with graphs are dead or 24 stars). | Low |
| "You open six tabs and hold the graph in your head." | `PRESENT`, near-verbatim. | — | — |
| **"Survivable on a cluster you built last month. Not on one you inherited."** | `GONE`. | Eleven words that name the entire trigger condition for the product and produce the primary persona. The PRD names the inheritor but never says *when* Portolan becomes necessary. This is the clearest single instance of qualitative content the FR structure dropped without trace. | Medium |
| Founding scenario: company cluster with **no documentation at all**, to be cleaned up **and checked for security problems**, Portainer the only instrument, hours—"in places days"—by hand, "a drawing obsolete at the next `stack deploy`, that nobody would ever redraw". | `PRESENT` / `STRENGTHENED` — §1 carries it near-verbatim and adds "The unit of value is replacing days of manual diagramming." | Only the emotional shape of the scene: the brief's scenario is a person in front of Portainer with no documentation; the PRD's is a sentence in a persona paragraph. The security half survives as a verb in a list ("securing it") and in §5's "the user spots the anomaly by seeing the map". | Low |
| "In the founding scenario **the missing thing was never a verdict — it was a picture**." | `FLATTENED` — the operative half ("shows your infrastructure clearly enough that you see it yourself") survives in the "Not" table; the founding-scenario grounding does not. | The reason the no-audit decision is *not* a feature cut but a reading of the original need. | Medium |

---

## 3. The Solution

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "A topology tool, not another dashboard. The product *is* the relationships between Docker objects. **The market already has good inventories.**" | `PRESENT` (§1 "The relations are the product"; "Not" table → *A dashboard*). | — | — |
| "A 2D graph, colour-coded by network — **the relationship hardest to hold in your head**." | `FLATTENED`. §6.1 asserts "networks, which is the product's primary axis" without ever saying why. | The justification for network primacy. Every downstream decision keyed to it — FR-8 zones, FR-31, the whole of §6.1, NFR-13/14 — now rests on an unstated premise. If a later reviewer asks "why is network the axis and not stack?", the PRD cannot answer. | High |
| "*(3D was considered and retired 2026-09-09; evidence in Addendum.)*" | `FLATTENED` — §5 lists "3D, perspective, isometry. Depth is stylistic, never spatial." | That 3D was the **original brain-dump concept**, was evaluated against evidence (Vizceral abandoned by Netflix; 3D infra visualisers at 15–32 stars vs 3,338 flat; Carmack; "you don't see in 3D"), and was retired on that basis. The PRD's flat prohibition invites exactly the reopening the brief closed. Addendum §"3D infrastructure visualisation" is now orphaned. | Medium |
| "**Legible over impressive.** … The bar is that a non-specialist could follow it — the picture legible to an outsider is the same one that gives an expert the cluster at a glance." | `PRESENT` and `STRENGTHENED` (§1 "The bar"; success criterion 5 makes it testable for the first time). | — | — |
| "Legible over impressive" **as a preference between legibility and richness**. | `CONTRADICTED`, quietly. §1 reinterprets it: "the constraint applies to *reading load*, not to graphic richness. The operative form is *plenty to look at, little to read*." | The brief's phrase was a tie-breaker *against* impressiveness. The PRD's gloss removes graphic richness from the constraint's scope — and the PRD then records (NFR-8) a landing frame re-tessellating ~9,000 Bézier segments per frame across 325 bodies that "will not hold". The reinterpretation is precisely what licensed the thing the brief's original wording would have refused. This is a reframing of a brief constraint presented as an explanation of it. | High |
| "A whole-cluster overview that stays readable, zooms, and opens detail on demand: **a picture you can walk into to get the text**." | `PRESENT` (§1, verbatim "one picture you can walk into"). | — | — |
| "Filters are **structural, not cosmetic**. Zoom moves you closer; only filtering takes things away … and how the graph survives a cluster large enough to matter." | `PRESENT` / `STRENGTHENED` — FR-14 (verbatim in spirit), FR-30, FR-39, FR-33, and the "heavy filter use on first contact" counter-metric. | Only the label "structural, not cosmetic". Best-preserved clause in the brief. | Low |
| "Filters are how **one map** answers 'show me everything' and 'show me only what touches `backend`'." | `OVERRIDE (undeclared)` — FR-17 introduces three views switched from a tab bar, and states "A tab switch is a complete change of view, not a filter." | The brief's one-map-plus-filters model. Three views is a UX-phase addition that changes the product's shape, and the PRD does not note that the brief specified one map. Not necessarily wrong; simply unremarked. | Medium |
| "**Always current.** It reads the live cluster, so the map never goes stale." | `PRESENT` (FR-1) and `STRENGTHENED` (§3.8 specifies what happens when it *does* go stale — FR-54/55/56 — which the brief's phrasing assumed away). | — | — |
| "**Runs inside the swarm it maps**, one `docker stack deploy`." | `PRESENT` (NFR-1). | — | — |
| "**Explicitly not:** no audit engine, no rules, no alerts *(decided 2026-09-09)*." | `PRESENT` (§1 table, §5). | Only the decision date; the PRD carries no decision dates anywhere. Minor traceability loss, uniform across the document. | Low |

---

## 4. What Makes This Different

The PRD has **no counterpart to this section at all**. Every row below is a total loss; the section is
the largest structural omission in the reconciliation.

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "**There is no technical moat. The graph is a solved rendering problem.** What Portolan has is a vacancy, and a reason it will persist." | `GONE` — and materially `CONTRADICTED` by NFR-8, NFR-9 and §6.1, which find rendering to be the hardest unsolved problem in the project. | The brief's stated confidence is refuted by the UX phase, and the PRD never says so. A reader comparing the two documents finds the brief claiming the rendering is solved and the PRD listing four unanswered rendering questions and a frame rate that "will not hold", with no sentence acknowledging the reversal. This is the most consequential place the two documents disagree on a fact. | **Critical** |
| "**Nobody serves this on Swarm at any scale.** Portainer, Arcane and Swarmpit have no relational graph at all; the one project that tries has 24 stars and omits volumes, stacks and containers." | `GONE`. | The competitive landscape in one sentence, and the reason "all object types at once" is a differentiator rather than a scope risk. | High |
| "Netdata answers 'what talks to what' (network flows); **nobody answers 'what is attached to what'**." | `GONE`. | The sharpest boundary definition in the entire brief — attachment, not traffic. Without it, nothing in the PRD prevents a later reviewer from asking for flows, connectivity tests or traffic edges (Portainer discussion #9921 asks for exactly that), and nothing tells them why the answer is no. | High |
| "**The incumbent will not build this.** Portainer closed the request unimplemented in 2021, and now points Swarm users off Swarm entirely." | `GONE`. | The durability argument for the vacancy. | High |
| "**Focus.** Portainer is a management platform that must also serve Kubernetes. **Portolan does one thing.**" | `GONE` (the "Not" table covers *what* Portolan is not; it never states focus as the advantage). | — | Medium |
| "The moat is **execution and being first to take the niche seriously**. The idea is copyable — and has been for nine years." | `GONE`. | The honest statement of what the project is betting on. This is also the sentence that makes the PRD's own scope discipline make sense. | High |

---

## 5. Who This Serves

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "**The inheritor.** Handed a Swarm cluster nobody documented, needing to understand it before cleaning it up, securing it, handing it over or migrating off. The founding scenario…" | `PRESENT` / `STRENGTHENED` (promoted to "primary", unit of value named). | — | — |
| "…**skews to organisations with budget; grows with the migration wave**." | `GONE`. | The only commercial characterisation of the primary audience in the brief, and the second place the timing thesis was load-bearing. Its absence leaves §6.4's counter-argument ("small, unpaid, shrinking") unopposed — the brief's answer to that objection was that the *inheritor* segment has budget and is growing. | High |
| "**The Swarm operator.** … Shrinking and largely unwilling to pay, **but they are the tribe: they adopt fast, they share, and they are why the project gets found.**" | `FLATTENED` — PRD: "these are the people who will file the issues." | Their actual function: distribution and discovery. The PRD reduces the tribe to a bug-report source, which changes why they matter and would justify deprioritising them. | Medium |
| "**Not an audience:** the growing population running Swarm under a PaaS like Dokploy without knowing it. No Swarm vocabulary, no recognition of the problem. *(Decided 2026-09-09.)*" | `PRESENT` / `STRENGTHENED` — §1 keeps it and adds "the standing counter-argument to the beachhead, and the case to reopen if the beachhead stalls"; §6.4 keeps the full argument. | Nothing. Well carried. | — |
| — (not in brief) | **PRD addition**: "The executive — a viewer, not a user", with its own constraints and success criterion 5. | Not a loss. Recorded here because it has no brief basis beyond "the bar is that a non-specialist could follow it", it originates in a PRD-phase decision, and it is the sole justification for FR-51 (screen masking) and part of FR-63. It should not be mistaken for brief content on a later pass. | — |
| Brief memlog: the non-technical audience was "**tacit, not explicitly validated** … written as settled in the brief — to be confirmed." | `RESOLVED` by the PRD (the executive figure is a recorded decision). | Nothing — this is the PRD closing an open brief question correctly. Worth stating explicitly in the PRD that it closes it. | Low |

---

## 6. Success Criteria

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "**First bar — it works for its author.** **A tool that does not survive daily use by its maker survives nobody's.**" | `FLATTENED` — heading kept, maxim dropped. | The principle behind the bar. | Low |
| First bar, item 3: "**reached for by preference, not loyalty.**" | `GONE` — the PRD's first bar has two bullets where the brief has three. | **A dropped success criterion**, not a dropped phrase. It is also the only one of the three that tests durable use rather than a single successful session, and the only counterweight to the "long sessions are a counter-metric" rule. | High |
| "**Second bar — at least one signal the author does not control.**" | `NARROWED` — PRD heading: "Second bar — signals outside the author's control". | "**At least one**" — the brief set a threshold (one suffices). The PRD presents five signals with no bar, so the second bar is no longer a bar. | Medium |
| "The project is **publicly ambitious**, and private satisfaction cannot measure that." | `GONE` from the PRD text, though the PRD memlog records the ambition/"serious personal project" tension as resolved in the brief's favour. | The stated ambition, and therefore the reason external signals are required at all. The resolution of a tension the process explicitly parked is recorded only in the memlog, not in the deliverable. | Medium |
| "**Strongest first:**" | `GONE` — the five signals are an unordered list. | The ranking. The brief's order happens to be preserved, so the information survives by accident and will not survive the next edit. | Low |
| Signal: stranger posts a screenshot of **their own** cluster. | `PRESENT`, verbatim emphasis kept. | — | — |
| Signal: migration prep "**— the timing thesis, confirmed**". | `FLATTENED` — signal kept, gloss dropped. | The link from the success criterion back to the strategic thesis (see §1 above). The criterion now reads as a nice-to-have rather than as the one observation that would validate the project's premise. | High |
| Signal: readable on a larger cluster "**— the direct test of the legibility risk under Scope**". | `FLATTENED` — signal kept, gloss dropped. | The tie between this signal and §6.1 / NFR-7. The PRD contains both halves and no longer connects them. | Medium |
| Signal: unprompted issue or PR from an operator "**rather than a passer-by**". | `PRESENT`, qualifier dropped. | The qualifier did work: it excluded drive-by issues, which is the whole distinction. | Low |
| "Excluded deliberately: star counts. **Stars measure reach, not use.**" | `FLATTENED` — exclusion kept in bold, reason dropped. | The reason. Canonical instance of the pattern. | Low |
| — (not in brief) | **PRD additions**: success signal 5 (non-technical viewer, the only test of *one picture, two readings*) and the whole Counter-metrics table. | Not losses. Both are genuine improvements; the counter-metrics table has no brief ancestor at all. | — |

---

## 7. Scope

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| In v1: all object types and **the edges between them** | `PRESENT` (FR-6). | — | — |
| "whether every type is a graph *node* rather than a detail-panel attribute is **an open rendering decision**" | `OVERRIDE (declared)` — closed by FR-7, consequences and accepted cost stated, FR-37 recovers the cost. | Nothing. Best-handled open question in the set. The PRD could say explicitly that it closes brief/addendum open question #2. | Low |
| "strictly read-only" | `PRESENT` / `STRENGTHENED` (FR-2 + NFR-3's "a promise, not a mechanism" + the chrome rule making no claim about enforcement). | — | — |
| "**auto-refresh every 5–10s, configurable**" | `WIDENED`, silently — FR-3: "5s / 10s / 30s / 60s, defaulting to 10s". | The brief's band was 5–10s. The PRD's range reaches 60s, i.e. six times the brief's ceiling. The widening was reasoned in `EXPERIENCE.md` (flagged `[ASSUMPTION]`, argued as "the steps above 10s are the *configurable* part") and that reasoning did not survive into the PRD, where 5/10/30/60 is simply asserted and §3 declares every figure normative. A PRD-only reader cannot tell a brief number was changed. FR-5 exists precisely to absorb the consequence and, read alone, is unexplained. | Medium |
| "colour by network" | `PRESENT`. | — | — |
| "filtering and **display control (what is shown, colours, text size)**" | `PRESENT`, `NARROWED` with reason (FR-43: whole palettes, never swatch by swatch, so contrast floors stay guaranteeable) and `STRENGTHENED` (FR-42 splits text size from density; FR-61 adds motion). | The brief's "colours" plausibly meant per-element choice; the PRD forecloses that. The narrowing is justified in place, so this is a good flattening — noted only for completeness. | Low |
| "click-through detail" | `PRESENT` (FR-22, FR-24, FR-25). | — | — |
| "one swarm" | `PRESENT` (NFR-1). | — | — |
| "deployed as an image inside the cluster it maps" | `PRESENT` (NFR-1). | — | — |
| **Out, v1: "SVG/PNG export — wanted later, screenshot accepted for now"** | `OVERRIDE (undeclared)` — §3.7 puts export **in v1**: FR-46 through FR-52 plus FR-63, and NFR-16/§3.6 carry design consequences (light mode first-class, legend part of the chart, uncroppable bezel). | **The departure marker itself.** `DESIGN.md` carries an explicit `[DEPARTS FROM BRIEF]` block naming this reversal, its four derived requirements and the argument for it (a screenshot cannot carry the legend, the bezel, or a frame); the PRD memlog records it as ratified UX decision #53 marked OVERRIDE. The PRD states none of this: it lists eight export requirements as though the brief had asked for them, and §5's "Each of these is a decision, not an omission" does not mention that one of the brief's own out-of-scope decisions was reversed. The upstream documents were more honest than the PRD. Also lost: the brief's fallback position ("screenshot accepted for now"), which is what the project falls back to if export slips. | **Critical** |
| Out, v1: any audit, rules or alerting | `PRESENT` (§1 table, §5, with the security-outcome carve-out preserved). | — | — |
| Out, v1: any write or management operation | `PRESENT` (FR-2, §5). | — | — |
| Out, v1: multi-cluster; anything not Docker Swarm | `PRESENT` (§1 table, §5) — but see Vision below on *deferral vs closure*. | — | — |
| "**The principal risk this scope carries:** every object type at once … against the brief's own bar of *legible over impressive*. Graphs of this kind are known to degenerate into hairballs at scale. Filters are the mitigation — but **default legibility before any filter is applied is the product's main open engineering question**, not a detail of polish." | `PRESENT` / `STRENGTHENED` — §6.1 names it as carried from the brief, adds the measured verdict, distinguishes what was won from what breaks, and refuses to resolve it. | Nothing. The single best-preserved passage in the reconciliation. | — |
| "reading the cluster requires manager-node socket access, so exposure and privilege minimisation are **settled at design time, not claimed at the product level**" | `PRESENT` / `STRENGTHENED` — NFR-2, NFR-3, §6.2, including the point that `:ro` on a socket mount does not restrict the Docker API. | Nothing. The PRD also correctly records that its own no-auth decision worsens this. | — |

---

## 8. Licence and Distribution

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "**AGPLv3** *(decided 2026-09-09)*." | `PRESENT` as NFR-17: "Licensed AGPLv3." | — | — |
| "**The specific risk guarded against is someone turning Portolan into a hosted service without contributing back.** AGPL closes exactly that while remaining OSI-approved." | `GONE`. | The threat model the licence exists to answer, and the OSI-approval requirement — which is the constraint that rules out the obvious alternatives. | High |
| Precedent: "Grafana moved to AGPLv3 in 2021, and Netdata runs the adjacent GPLv3+." | `GONE`. | The precedent, including a factual correction the brief process specifically made (Netdata is GPLv3+, not AGPL). | Medium |
| "**Permissive licensing was rejected as insufficient protection**; source-available (BSL) outright — for a project whose earliest adopters are homelabbers, **a non-OSI licence costs more trust than it protects revenue**. See Addendum." | `GONE`. | The alternatives-considered record. As it stands, NFR-17 is a bare one-line choice with no threat model and no rejected options, so MIT, Apache or BSL can be proposed at any time with nothing in the PRD to answer. This is the most re-litigable decision in the document. | High |
| Section title "Licence **and Distribution**" | `GONE` as a concern — the PRD covers installation (NFR-1) but says nothing about how Portolan is published or distributed (registry, repository, public release). | The brief was thin here too, so this is a shared gap rather than an extraction loss — flagged because AGPL only bites on distribution and no distribution channel is named anywhere. | Low |

---

## 9. Vision

| Brief item | Status in PRD | What was lost | Severity |
| --- | --- | --- | --- |
| "**In two to three years**, Portolan is what you install on a cluster you do not understand, **the way you reach for a map in an unfamiliar city**." | `GONE`. The PRD's §1 is titled "Vision" and contains a definition, a "not" table, personas and a bar — no vision, no time horizon, no metaphor. | (a) The time horizon — the only long-range statement in the brief. (b) The founding metaphor, which is also the product's **name**: a portolan chart is a medieval nautical map. **The PRD retains the metaphor's artefacts and deletes the metaphor**: FR-48's "graduated bezel and the registration marks", FR-63's "chart legend", "the chart" as the map's standing noun, and FR-4's "**Surveyed** 4 min ago" are all descendants of the map/chart idea, and the PRD never says where any of it comes from. `DESIGN.md` states the register outright — "Portolan is a 14th-century nautical chart, and the interface says so out loud … The name stops being a codename and becomes design material." Read alone, the PRD's chart furniture looks like unmotivated decoration, which is exactly the kind of requirement a later cost-cutting pass deletes. | **Critical** |
| "Not a platform, not a control plane: **one thing, done properly**." | `GONE` (the "Not" table covers the categories; the ethos is absent). | The project's statement of restraint — the sentence that justifies §5 existing at all. | Medium |
| "Success is that '**what does my cluster actually look like**' stops being an unanswered question." | `GONE`. | The definition of done at the vision level. Note the PRD carries the *operational* question ("Which container sits on which network, and which volume does it use?") and drops the *vision-level* one; they are different questions and the brief needed both. | Medium |
| "**Breadth is deliberately left open — the architecture is not.**" + "Whether Portolan later maps standalone Docker, Compose or Kubernetes is a decision for a future version, **taken on evidence rather than on today's ambition**." | `FLATTENED`, and the balance inverted. NFR-5 keeps the seams; §1's "Not" table and §5 state "Docker Swarm only in v1" / "anything that is not Docker Swarm" as exclusions. | The deferral posture. The brief says *open, decided later, on evidence*; the PRD reads as *closed*, with "in v1" as the only hint. The three candidate platforms are never named, so a reader cannot tell which second collector the seams are for. NFR-5 survives as an unexplained architectural nicety rather than as the mechanism preserving a deliberately open strategic option at zero present cost. | High |
| "**the graph model and the renderer stay independent of the Swarm-specific collector.** Three seams — collector, model, renderer … **This is a binding input to the architecture work.**" | `PRESENT`, near-verbatim (NFR-5), and `STRENGTHENED` by NFR-6, which names the two places the UI couples to the collector. | Nothing at the requirement level. | — |

---

## 10. Findings not traceable to a single brief clause

| Observation | Detail | Severity |
| --- | --- | --- |
| **NFR-6 references a rule the PRD never states.** | NFR-6 names "the rule that objects keep Docker vocabulary (FR-11 and **the voice rule**)". There is no voice rule in the PRD: the Docker-vocabulary rule appears only as prose in §1's executive paragraph, and FR-11 is about mark families, not vocabulary. The voice rule is defined in `EXPERIENCE.md` (chassis speaks chart — *surveyed*, *off-chart*, *reorganise*, *fit to chart*; objects speak Docker). Combined with the loss of the map metaphor, the PRD uses chart vocabulary throughout while defining neither the vocabulary nor its split. Fix: promote the voice rule to a numbered requirement and have §1 or §3 state the chart register. | High |
| **The addendum is orphaned.** | The brief points at the addendum three times ("See Addendum"). The PRD never cites it, yet reproduces its risk findings in §6.4 while omitting its demand and competitive findings. Nothing tells a downstream reader that a research document exists, so the 3D evidence, the competitive table, the licensing precedent and the nine-year issue trail are now unreachable from the PRD. | High |
| **No decision dates or provenance anywhere in the PRD.** | The brief timestamps its decisions (*decided 2026-09-09*) and marks which are open. The PRD numbers requirements but records no origin — brief, UX phase, or PRD phase — so genuine reversals (export, refresh band, three views) are indistinguishable from faithful carries. A one-line provenance note per §3 subsection, or a short "departures from the brief" block, would fix most of the Critical findings in this document at once. | High |
| **Brief items with no PRD counterpart, by count.** | Of the brief's nine sections, one ("What Makes This Different") left no trace at all; one ("Vision") left only its architecture constraint; and the timing argument in the Executive Summary left only an inverted fragment. Everything in the brief's Solution, Scope and Problem sections survives in some form. The extraction lost **strategy and rationale, and kept specification** — a consistent, predictable bias rather than random dropout. | — |

---

## 11. Recommended repairs, in priority order

1. **Declare the export reversal.** Add a departure note to §3.7 or §5 stating that the brief put SVG/PNG export out of v1 ("screenshot accepted for now"), that the UX phase reversed it (`DESIGN.md` `[DEPARTS FROM BRIEF]`, memlog decision #53), and the argument for the reversal — a screenshot cannot carry the legend, the bezel or a frame.
2. **Restore the why-now.** A short §1 subsection carrying the timing inversion, "you cannot migrate a cluster you cannot map", Portainer's March 2026 advisory, and the beachhead definition — after which §6.4's counter-arguments read as counter-arguments rather than as the PRD's own position.
3. **Restore the Vision proper**, with the two-to-three-year horizon, the map-in-an-unfamiliar-city metaphor and the name's meaning. Then FR-48, FR-63, "chart" and "surveyed" have a stated origin, and the voice rule can be numbered.
4. **Reinstate differentiation in one short block**: no technical moat; nobody serves this on Swarm at any scale; attachment not flows ("nobody answers what is attached to what"); the incumbent will not build it; the moat is execution. Cite the addendum. Add one sentence acknowledging that the brief's "the graph is a solved rendering problem" is contradicted by NFR-8/§6.1.
5. **Give NFR-17 its reasons**: the hosted-service threat, OSI approval as a constraint, Grafana/Netdata precedent, and the explicit rejection of permissive and BSL.
6. **Restore the dropped commitments**: "reached for by preference, not loyalty" as first-bar item 3; "at least one" as the second bar's threshold; "strongest first" on the signal list; the inheritor's "skews to organisations with budget, grows with the migration wave"; the tribe's distribution role.
7. **Note the refresh widening** in FR-3 (brief band 5–10s; steps above 10s added in the UX phase for large clusters) so the normative figure is traceable.
8. **Reconcile "one map" with the three views** (FR-17) in one sentence, and restate that network is the primary axis *because* it is the relationship hardest to hold in your head.
