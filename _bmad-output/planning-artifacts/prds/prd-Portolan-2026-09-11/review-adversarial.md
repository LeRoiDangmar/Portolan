---
title: "Adversarial review — PRD: Portolan"
target: prd-Portolan-2026-09-11/prd.md
date: 2026-09-11
reviewer: adversarial lens (document, not product)
---

# Adversarial review — PRD: Portolan

Scope: the document. Every finding below is a defect in the PRD as an instrument — a pair of
requirements that cannot both hold, a requirement no build could be judged against, a claim the
document makes about itself or its sources that is false, or a gap a builder must fill by invention.
Style, tone, formatting and the non-consecutive FR numbering are out of scope.

Sources consulted for verification: `briefs/brief-Portolan-2026-09-09/{brief.md,addendum.md}`,
`ux-designs/ux-Portolan-2026-09-10/{DESIGN.md,EXPERIENCE.md,validation-report.md,review-legibility-at-scale.md,review-brief-fidelity.md,.memlog.md}`.

**Verdict.** The PRD is unusually honest about its own risk and unusually careless about its own
arithmetic. Four requirement sets cannot all hold as written; the section that tells downstream how
closed the upstream documents are (§7.4) makes a materially false claim about the PRD's own effect on
them; and the normative figures in §7.1 — the ones the whole legibility risk is priced against — were
computed on a canvas that FR-79 forbids. It is not ready to hand to architecture without a correction
pass on §7.1, §7.4, §8 and the four critical clusters.

---

## Critical

### C1 — §7.1's normative figures are computed on a canvas FR-79 makes impossible

FR-79 states: *"The panel's column is always reserved, whether the panel is open or not, so opening it
never relays or reframes the map."* `DESIGN.md:831` agrees and is explicit about the consequence:
*"Three columns, fixed: 236px | canvas | 320px. At exactly 1440px that leaves **884px** of canvas,
which is the design width every measurement in this document was tuned at."* `DESIGN.md:460` sets
`canvas-min: 884px`.

Every figure §7.1 quotes as measured comes from `review-legibility-at-scale.md:38-46`, which computes
two columns and labels the first **"Landing (no panel) — 1440 − 236 = 1204"**, usable map area
**778,800px²**. The panel-open column (884px, 567,600px²) is the one FR-79 actually mandates at all
times.

Concretely: bodies "land at 14–28px against a 46px nominal" (§7.1) is a 1204px number. At the 884px
canvas FR-79 requires, area per object falls by 27% and every radius by √0.73 ≈ 0.854 — bodies land at
roughly **12–24px**. The stub floor (FR-68, 6px on screen), the mark floor (FR-67, 8×8px) and the type
floors (NFR-10) are all *absolute screen sizes* being defended inside bodies that are 15% smaller than
the document says they are. §3 declares "Where a requirement carries a figure, the figure is
normative", so this is not a rounding quibble: the PRD's normative legibility budget and its normative
layout rule disagree, and the risk in §7.1 is priced too low.

**Fix shape:** recompute §7.1's figures at 884px, or state in FR-79 that the panel column is
surrendered to the canvas when closed — which contradicts FR-79's own reason for existing.

### C2 — FR-11 + FR-13 + FR-66 + FR-67 cannot all hold in the landing frame, and NFR-9 admits it without relaxing any of them

Four requirements, all stated as binding:

- FR-13: the body's **stretch** toward what it links to is the data channel, and the irregular contour
  is the recognition channel.
- FR-66: marks live in **screen space** and do not scale with the canvas transform.
- FR-67: marks **never render below 8 × 8px**, the rail never wraps, the core is never breached.
- FR-69: the invariant core — name, identifier, mark rail — may never be breached by contour, stretch
  or motion.

The case where they cannot all hold is the frame the product is judged on. At §7.1's own figures a
body is 14–28px across (C1: really 12–24px). A screen-space mark at the 8px floor is then 29–57% of
the body's diameter; the upstream review states the consequence directly
(`review-legibility-at-scale.md:95`): *"the pastille (10px) is wider than the core is tall (9.4px)…
325 badges dominate the silhouette — and the silhouette's stretch direction is supposed to be the
rung-0 data channel. **The badge obscures the channel it accompanies.**"* The alternative branch is no
better and is also measured: scaled with the body it is 2 × 2px
(`validation-report.md:112`), below colour-naming threshold.

NFR-9 concedes exactly this — *"as specified, both readings degrade the landing frame's encoding"* —
and then carries it to architecture. But architecture cannot resolve it: FR-66 has already fixed the
screen-space rule, FR-67 has already fixed the floor, FR-13 has already made stretch the data channel
and FR-69 already forbids the core being breached. The PRD hands on a question whose entire answer
space it has closed, with no requirement marked provisional and no accepted cost recorded in §6.

**Fix shape:** one of the four has to become negotiable in writing — most cheaply FR-13's claim that
stretch is the rung-0 data channel, which upstream already prices at "a quarter of every body's
radius" for a 4.4px bulge (`validation-report.md:202`).

### C3 — FR-71 and NFR-8 are both declared non-negotiable against evidence that they cannot both hold

NFR-8: *"Meeting NFR-8 is a rendering and architecture problem; the requirement itself does not bend,
and FR-71 is not negotiable either — reconciling them is the work."*

That sentence is the whole mitigation. The evidence it is answering is quantitative and comes from the
document's own source (`review-legibility-at-scale.md:166`): ~9,100 Bézier segments re-tessellated per
frame, **plus** 325 unaccelerated SVG filter regions re-rasterising every frame because
`{motion.breathe}` changes each path bbox — *"order 5M pixel-operations per frame for shadows alone,
~300M/s at 60fps… This will not hold 60fps in a browser tab on integrated graphics."* DESIGN has since
floored the shadow below 30px bodies (`DESIGN.md:859`), which removes the filter cost at rung 0 — a
material mitigation the PRD does not mention, while it does repeat the 9,000-segment figure.

Two defects here, not one:

1. A stated risk is closed with an assertion of resolve ("reconciling them is the work") rather than
   with a fallback, a budget, or a named degradation path. This is the clearest instance in the
   document of a risk defused with words.
2. The PRD does hold two legitimate release valves — FR-61 (motion stoppable from inside the product)
   and FR-45 (reduced-motion stills continuous motion) — and does not connect either to NFR-8. Neither
   helps, because both are *user* choices and NFR-8 binds the default. The document never says whether
   shipping with breathing **off by default at rung 0** is permitted. That is the obvious escape and it
   is unwritten.

**Fix shape:** state the fallback explicitly (e.g. breathing suspended above N bodies or below M px, as
a named accepted cost), or record that NFR-8 may be met at a lower frame rate and say which.

### C4 — FR-63 cannot be satisfied in the space FR-78 + FR-79 + NFR-16 leave for it

FR-63: the legend *"enumerates the networks actually present on the chart, not a fixed palette, and its
typographic specimen renders without wrapping — wrapping destroys the adjacency that is the specimen's
whole purpose."* FR-78 fixes it as a permanent band beneath the canvas; FR-79 fixes the columns;
NFR-16 fixes 1440px as a floor, "not a breakpoint".

Measured upstream (`validation-report.md:206`): six legend columns across the 1204px canvas give 201px
each — **147px with the panel open**, which per FR-79 is always. The specimen
`pgdata · pg-data · pg_data · pgdatal` at 10px/0.04em is **230px wide**. It wraps at 201px; it wraps
badly at 147px. Separately, the zone column ships six swatches against eleven zones — the exact defect
FR-63's first clause forbids.

So FR-63 states two requirements whose arithmetic upstream has already shown to fail at the reference
cluster and the mandated width, and the PRD carries neither to §7.2 (architecture) nor §7.3 (design),
records no accepted cost in §6, and gives the band no height or column budget. A builder meeting FR-63
must either violate NFR-16's 1440px floor, violate FR-78's permanence, or invent a truncation rule the
PRD forbids.

**Fix shape:** either give the legend a specified reflow behaviour (and say what may be dropped), or
carry it to §7.3 with the two measurements above.

---

## High

### H1 — §7.4's claim about what this PRD resolves is false, and it is the claim downstream depends on

§7.4 instructs: *"Treat an `[ASSUMPTION]` marker in either spine as genuinely undecided until someone
decides it… **Two of them are resolved by this PRD**: FR-66 decides the screen-space rule, and FR-50
fixes the export masking default."*

The PRD silently closes at least seven more, by restating them as flat requirements with no marker,
no citation and no entry in §8:

| Upstream marker | Where | The PRD states it as decided |
|---|---|---|
| `[ASSUMPTION]` 10s default refresh | `EXPERIENCE.md:185` | FR-3 |
| `[ASSUMPTION]` stack outline not selectable | `EXPERIENCE.md:144` | FR-28 |
| `[ASSUMPTION]` "**Nobody decided this**" — node view draws neither zones nor outlines | `EXPERIENCE.md:166` | FR-19 |
| `[ASSUMPTION]` on the **whole** node-view appearance subsection | `DESIGN.md:1029` | FR-73 |
| `[ASSUMPTION]` legend always present, no summon/dismiss control | `EXPERIENCE.md:226`, `DESIGN.md:1095` | FR-78, FR-63 |
| `[ASSUMPTION]` hover affordance (session forbade a treatment, never specified a replacement) | `EXPERIENCE.md:270` | FR-27 |
| `[ASSUMPTION]` the three detail-panel states | `DESIGN.md:1055` | FR-55, FR-56 |

Plus `.memlog.md:124`, which lists "what `prefers-reduced-motion` actually stills" and the
"end-of-first-load signal mechanism" as open — both stated flatly by FR-45 and FR-53.

Why this is high rather than pedantic: §7.4 exists to tell architecture and story authors how to read
the spines. As written, a builder who finds a marker on `EXPERIENCE.md:166` is instructed to treat
FR-19 as undecided, when the PRD in fact decided it. The instruction and the requirement set actively
mislead each other, and the miscount is 2 against ~9.

### H2 — §8's departures register omits three departures the spines declare

§8 presents itself as the complete departure record. Upstream marks these as
`[DEPARTS FROM BRIEF]`; the PRD restates each as an ordinary requirement:

- **Colour control bounded to whole palettes** — `EXPERIENCE.md:180`, `DESIGN.md:705`: the brief's v1
  scope reads *"filtering and display control (what is shown, **colours**, text size)"*, which implies
  per-swatch control. The PRD states it as FR-43 with the guarantee argument but no departure marker.
- **Encoding moved off bubble fill onto four mark families** — `EXPERIENCE.md:101`, `DESIGN.md:711`:
  the brief says *"colour carries network membership"*. The PRD states FR-11 and FR-65 with no marker.
- **Progressive LOD removes labels by zooming** — `EXPERIENCE.md:257`, `DESIGN.md:823`: the brief says
  *"zoom moves you closer; only filtering takes things away"*. FR-14/FR-15 carry the reconciliation
  sentence verbatim but not the fact that it is a reconciliation of a declared departure.

Consequence: a reader of the PRD alone believes six departures were taken; the real count is nine, and
three of them are invisible to the document that claims authority on *what v1 is*.

*(Verified as correctly claimed, for contrast: the export departure was ratified by the user —
`.memlog.md:53` — and the 60s interval step is genuinely a UX-phase addition,
`EXPERIENCE.md:185`, `DESIGN.md:600`. The "Ratified" wording holds for both.)*

### H3 — FR-74 contradicts DESIGN's actual orphan treatment, and restates a sentence its own source proved impossible

FR-74: *"An orphan… is marked by **nothing**: it floats between the zones, attached to nothing, and the
visual isolation *is* the signal. No badge, no ring, no colour."*

`DESIGN.md` §Orphan bubble: *"the standard body, with the contour switched to `{colors.contour-orphan}`
at dasharray `5 4` and a flat dark fill instead of the gradient. **The dashes say unattached**…"* That
is a mark, and it is a colour. §8 says "upstream governs the detail", so the governing detail
falsifies the requirement's headline. It also quietly puts a third signal on the contour, which FR-13
reserves for two channels (recognition + stretch) and FR-11 reserves colour for *values within a mark
family*.

Worse, the sentence "floats between the zones, attached to nothing" is the exact sentence the
legibility review asked to be retired (`review-legibility-at-scale.md:211`): *"requires there to be a
'between'. With eleven fields covering the canvas there is none… Retire the claim that isolation alone
carries it at rung 0."* An orphan container on one overlay network sits **inside** that network's tint
field and has an attachment stub: it is neither between zones nor attached to nothing. §6 then
downgrades a demonstrated impossibility to a soft cost — *"on a large cluster an orphan can recede into
the background"* — which is the flattering-reasoning pattern: a proof rewritten as a tendency.

### H4 — FR-10 and FR-40 contradict each other; the discriminator exists only upstream

FR-10: *"tinted field with **no boundary** for networks, boundary with no field for stacks."*
FR-40: the default zone mode is *"blended tint fields **with contour isolines**"* — and §7.3 measures
stack outline perimeter running *"within 14px of a network isoline"*. A tinted field with a contour
isoline has a boundary, so FR-10's stated discriminator is false of the default rendering the PRD
mandates.

Upstream resolves it with the property the PRD drops: the zone contour is *"open, it fades where two
fields blend… **No closed outline, ever**"* against the outline's *"closed, continuous, 1.25px solid —
one unbroken line"* (`DESIGN.md:962`, `DESIGN.md:980`). Open-vs-closed is the whole of the
distinction, and it appears nowhere in the PRD. A builder reading FR-10 and FR-40 together must either
invent the reconciliation or drop one.

### H5 — NFR-13 is unsatisfiable by construction, and the defect it declares is assigned to nobody

NFR-13: *"Under simulated deuteranopia, no two zone tints of the light palette may resolve to the same
colour."* FR-65: hues *"cycling over six"*, with a pattern marking the octave. NFR-7: the reference
cluster has **11 overlay networks**.

At the reference cluster, five pairs of networks share a hue **by design** — not under simulation, but
under normal vision. `review-legibility-at-scale.md:115` finishes the case: every pair of networks
shares members, *"All five same-hue pairs are adjacent, and two same-hue overlapping fields are
indistinguishable from one strong field of that hue."* NFR-13 as written is therefore violated at
reference scale before any colour-vision simulation is applied. The requirement means "no two of the
six palette tints", and does not say so.

Second defect, independent of the wording: NFR-13 states that two tints *currently* simulate to a
byte-identical value and calls it *"a defect rather than an acceptable residual"* — and then the
document never assigns it. It is absent from §7.2 (architecture), §7.3 (design), §5 and §6. A declared
open defect with no owner and no remediation route is the load-bearing gap pattern: someone has to
invent both the fix and the mandate for it.

### H6 — The 325 figure is the number the upstream review flags as most favourable, and it contradicts NFR-7

NFR-7 enumerates the reference cluster: 6 nodes, 14 stacks, 40 services, 300 containers, 11 networks,
25 volumes. FR-23 and NFR-8 then compute against **325 objects / 325 bodies**, and §3 says figures are
normative.

`review-legibility-at-scale.md:31` states what 325 is: *"Containers (300) + volumes (25) = 325 floor.
Services are selectable objects with a type-pastille value, so **the honest figure is 365**. Every
computation below is run at 325 — **the number most favourable to the design**."*

The PRD's own FR-28 ("Every bubble… is selectable") and FR-15 (service names are a whole reading level)
make services bodies. So the PRD imports the favourable count, drops the sentence that labelled it
favourable, and calls it normative. Combined with C1 this compounds: 365 bodies on an 884px canvas
rather than 325 on 1204px is roughly **0.79× the radius** §7.1 reports.

### H7 — FR-36/FR-37 cannot deliver the recovery FR-7's accepted cost depends on

FR-7 keeps images off the graph and books the cost in §6: *"You cannot see at a glance who shares an
image — only on request."* The recovery is FR-37 (search matches image tags) executed through FR-36:
*"Typing in a search field reframes the map onto the matching objects, **at a zoom level where their
names render**."*

The case where both cannot hold is the ordinary one. On the reference cluster a common base image
(`nginx:1.25-alpine`, `postgres:16`) is shared by tens of containers scattered across every stack and
node. Framing all of them means framing most of the map; per FR-15 that is the landing reading level,
where container names do not render at all, and per NFR-10 a label below its floor *"is not rendered at
that reading level — it is never shrunk to fit"*. So the frame that holds all matches cannot show
their names, and the zoom that shows names cannot hold the matches.

FR-36 also has no cardinality rule: "several matches reframe onto the set and the user picks" is
silent on 50 matches, and FR-36 forbids a results list on principle. The accepted cost in §6 is
therefore understated — the recovery mechanism fails precisely in the multi-match case that motivates
it.

### H8 — FR-47's "what you see is what you get" is false in the default configuration

FR-47: export respects *"current framing, current zoom and active filters… literally"*.
FR-50: export masking is **on by default**. FR-51: screen masking is **off by default**, and the two
settings are explicitly independent.

Therefore, out of the box, the exported frame differs from the screen in every IP and CIDR it
contains. FR-49 keeps the footprint identical so nothing reflows, which means the difference is
invisible to the user who was promised literalness. The same clause breaks a second way: FR-48 makes
the bezel and registration marks uncroppable, so a user zoomed into a corner does not get their
framing literally either.

Neither divergence is booked. §6 books only *"an export taken from the landing frame ships without the
fine labels"*. FR-47 should either state the two exceptions or stop claiming literalness.

### H9 — FR-73 and FR-59 invert the read they are supposed to produce

FR-73: in node view *"a machine's region is drawn **proportionally to what it carries**, so imbalance
is read as mass rather than counted."*
FR-59: *"A machine carrying nothing renders **at full size** in node view."*

At zero the two rules meet and disagree, and the PRD never states an exception. Worse, taking both at
face value inverts the channel: an empty node renders at full size while a node carrying one container
renders at the proportional minimum — so the emptiest machine reads as the heaviest, in the one view
whose question (FR-19) is *is the load spread*. Upstream states both rules adjacently
(`DESIGN.md:1035-1037`) and is equally silent on the discontinuity, so there is nowhere to look it up.
FR-73 is also the sole means by which FR-19's question is answered without a metric, so the gap is
load-bearing.

### H10 — NFR-11's staleness exemption is justified by an argument that does not apply to staleness

NFR-11 exempts three states and defends all three with one sentence: *"A state whose meaning is
illegibility cannot be held to a legibility floor."*

That covers the reachability dim (FR-33: *present, never readable*) and the empty-filter pale context
(FR-34). It does not cover FR-54, whose entire purpose is the opposite: *"the map stays"*, and the
upstream flow is explicit that the user keeps working — *"He keeps working on a chart he knows is
ageing"* (`EXPERIENCE.md:357`). Staleness does not mean illegibility; it means *older than you think*.

The numbers make it material. `DESIGN.md:713` specifies the veil as alpha 0 → **0.42 over 15 minutes**
with saturation falling 1.00 → 0.35, unbounded thereafter — and `DESIGN.md:958` measures the health
mark at **2.1:1** at full veil. NFR-11 reports this as *"the health mark does not reach its 4:1
floor"*, which is true of 3.9:1 and describes half the floor. Since FR-54 forbids any banner, overlay
or error colour, a cluster whose socket has been down for an hour is a fully usable-looking product
state with no contrast guarantee anywhere in the document, indefinitely.

### H11 — §2 is unmeasurable by construction

The counter-metrics are stated as things the project will watch: *"Long sessions in the product"*,
*"Heavy filter use on first contact"*. Nothing in the product can observe either. NFR-4 forbids any
external asset; §5 excludes authentication, accounts and sessions; NFR-2 requires the instance be
unreachable from outside the internal network; there is no telemetry requirement anywhere in §3 or §4,
and adding one would collide with the read-only, air-gapped posture the PRD is otherwise strict about.

Similarly success signal 3 — the only criterion that tests the *one picture, two readings* bar, by the
PRD's own admission — is *"someone with no IT skills opens Portolan on a real cluster… with the author
not in the room"*, and its whole content is that the author cannot observe it.

This is not a demand for analytics. It is that §2 presents a measurement regime the rest of the
document makes impossible, and no build can be judged pass or fail against it. Either the
counter-metrics become qualitative signals the author will look for by hand (and say so), or something
in §3 has to record them.

### H12 — FR-16's "nothing else, ever" is contradicted by the view model, and the round-trip is unspecified

FR-16: *"Exactly three user actions may relay the map — Reorganise, switching zone mode, toggling the
node backdrop — and nothing else, ever."*

FR-17 makes a tab switch *"a complete change of view, not a filter"*; FR-19 and FR-73 give node view a
different geometry (proportional regions, no zones, no outlines); FR-20/FR-21 give service view an
ego-graph. Each is a layout, and each is reached by a user action outside the three.

The load-bearing question the PRD never answers: **does the overview's earned layout survive a
round-trip through another tab?** If not, FR-16's "positions are earned and kept" — which the
legibility review calls *"the only navigational aid a 325-object map has left once names are gone"*
(`review-legibility-at-scale.md:237`) — dies on every tab click, and nothing in the document forbids
that. If yes, the renderer must persist a layout per view across switches, which is an architectural
requirement that appears nowhere in §4.2's three seams.

### H13 — No rule exists for where a new object goes without a relayout

FR-16: *"a new container appears near its neighbours… and neither reclaims space until the next
relayout."* FR-13: *"Bubbles never fuse and never overlap — the layout reserves the deformed hull
before placing anything."*

Between two surveys a `stack deploy` can add 30 containers. The PRD forbids a relayout (FR-16), forbids
overlap (FR-13), forbids translation of existing bodies (FR-71: *"Labels and click targets never
travel"*), and requires the newcomer be placed "near its neighbours". When the neighbourhood has no
free reserved cell — the normal case on a map tuned to fit 325 bodies in 884×660 — there is no rule.
The builder must invent one of: overlap (breaks FR-13), displacement (breaks FR-16/FR-71), placement
far from its neighbours (breaks FR-16's stated behaviour), or an unrequested relayout (breaks FR-16 and
`EXPERIENCE.md:280`, *"Anything that re-lays out the map without the user asking"* is listed as a
prohibition). This is the single largest invention the PRD asks for.

---

## Medium

### M1 — FR-64 requires a declaration the PRD does not make, and its rationale misreports its source

FR-64: *"A minimum supported Docker Engine API version is declared and checked."* No version appears in
the PRD, and none appears in the brief, the addendum, `DESIGN.md` or `EXPERIENCE.md` (searched). The
requirement is unverifiable as stated — a build cannot be judged against "a version is declared" — and
the value is a load-bearing choice (it decides which clusters the product refuses).

The rationale is also false to its source. FR-64 says *"Two engine behaviours **affect what the
collector can read**… nftables cannot be enabled in Swarm mode, and a known defect leaves DNS broken
after `swarm init`."* Neither affects what a read-only collector can read: one is a firewall backend
restriction, the other breaks cluster DNS. In `addendum.md:126-128` both appear under *"Four caveats
that matter more than the commit activity"* — i.e. as evidence about Swarm's **platform trajectory**,
which is §7.5's subject, not the collector's.

### M2 — §7.4 cannot count the markers it is reporting

*"11 to 12 `[ASSUMPTION]` markers and 5 to 6 `[DEPARTS FROM BRIEF]` markers survive into the final
text."* Actual, excluding each file's marker-convention line: `EXPERIENCE.md` 11 assumptions + 5
departures; `DESIGN.md` 12 assumptions + 6 departures. **Totals: 23 and 11.**

The ranges are per-document, read as totals. In the one section whose job is to tell downstream how
much is still open, the quantity is understated roughly twofold — and it is exactly countable, in a
document that declares its figures normative.

### M3 — FR-76 and FR-77 disagree about whether a control can disappear

FR-76: the toolbar carries *"— while an object is selected — *Isolate* and *Keep only this*."*
FR-77: *"**unavailable** — present but inert, **shown rather than hidden so the toolbar never reflows
under the pointer**."* Upstream is unambiguous that unavailable-not-hidden is the rule
(`EXPERIENCE.md:175`). FR-76's phrasing licenses the reflow FR-77 exists to prevent.

### M4 — FR-76's justification is false on FR-29's own text

FR-76: *"**Fit to chart must exist on screen**: it is the only route back to the whole-cluster frame,
and **FR-29 leaves no keyboard route to it**."* FR-29 says chrome controls *"take ordinary tab focus
with a visible focus ring, in DOM order"* — a toolbar control is chrome, so FR-29 provides precisely a
keyboard route to it. The requirement is right; the cited reason contradicts the requirement cited.

### M5 — FR-22 overstates what FR-23 delivers, and "all" is useless at reference scale

FR-22: clicking lights *"everything transitively reachable"*. FR-23 defaults the reach to one hop, so
FR-22's sentence is true only at a non-default setting. Upstream measures the endpoint
(`validation-report.md:215`): *"With 300 containers sharing 11 networks, the transitive closure from
any container is the whole cluster."* So the *all* setting lights everything and distinguishes nothing,
1 hop lights ~4 of 325, and 2 hops lights 150+. The PRD offers three settings of which one is the
default, one is measured as self-defeating, and one is provably degenerate — and FR-22 advertises the
degenerate one as the semantics of the gesture.

### M6 — FR-58 makes a latched control report a state the user did not set

FR-41 makes the node backdrop a display control, off by default. FR-58: on an empty cluster *"the node
backdrop renders even though it is off by default"*. FR-77 defines latched as *"reports a live state
**the user put it in**, and clicking again clears it"*. On an empty cluster the chip must either show
latched (a false report of a user action) or show unlatched while the backdrop is drawn (a false report
of the map). The PRD does not say which, and the third possibility — the state is not user-clearable
here — is a fourth control state FR-77 forbids.

### M7 — FR-62 is unverifiable, and it voids §3's own rule about figures

FR-62 requires *"a setting that **meaningfully enlarges** type beyond the current +15% ceiling"* and
then: *"the ceiling is whatever that specified behaviour can honestly carry, and **it is set during
design, not asserted here**."* No build can be judged against "meaningfully", and the only figure in
the requirement (+15%, `DESIGN.md:257`: steps 0.90/1.00/1.15) is the thing being replaced. §3 states
*"Where a requirement carries a figure, the figure is normative"*; FR-62 carries a figure that is
explicitly not. Either give a target step (1.30? 1.50?) or say the requirement is a design task, not a
product requirement.

### M8 — The recognition channel has no contrast floor anywhere

FR-13 makes the seeded irregular **contour** one of two silhouette channels and the basis of
cross-survey and cross-screenshot identity. NFR-11 enumerates floors for the identifier channel,
chassis text and marks, both edge kinds and the focus ring — and not the contour. Upstream measured it
(`DESIGN.md:762`): 3.3:1 over bare canvas but **2.7–2.9:1 over a zone tint, "which is where every
bubble actually sits"**, and explicitly notes the edge floor does not bind it. So the channel carrying
FR-13's identity guarantee is the one channel the accessibility floors do not cover, and the PRD does
not mention the measurement or record it as an accepted cost.

### M9 — "Orphan" is defined in a way that makes the counter meaningless

FR-74/FR-35 define an orphan as *"an object belonging to no stack"* and the counter as *"how many
objects belong to no stack"*. On a real swarm that set includes every standalone volume and network,
`ingress`, and arguably the 6 nodes — a count in the tens, dominated by objects nobody considers
orphaned. Upstream is narrower: *"A container with no stack"* (`DESIGN.md` §Orphan bubble). Since FR-35
is *"the mechanism that carries FR-74 at scale"* (and, per H3, the only mechanism that works at all),
the scope of its count is load-bearing and wrong.

### M10 — Filter consequences are specified for two of five types

FR-30 allows removing volumes, networks, services, stacks and containers. FR-31 specifies the
consequences for networks and stacks only. Unspecified: whether removing containers leaves service
bubbles with dangling mount edges and plates; whether removing volumes removes the mount edges (the
one edge kind FR-8 leaves long, and the kind §7.1 counts as the ~40 remaining crossings); whether
removing services changes what containers group under; and whether any of it changes the orphan count.
A builder must invent four rules, each visible on the default frame.

### M11 — FR-46 and NFR-8/NFR-19 push the renderer choice in opposite directions, and the PRD does not say so

FR-46 requires SVG export. NFR-8 requires the animated landing frame to stay interactive at reference
scale on integrated graphics, and the upstream diagnosis is specifically that **SVG** is what fails
(*"SVG filters are not compositor-accelerated in any of the three named engines"*,
`review-legibility-at-scale.md:166`). NFR-19 leaves the stack and rendering library unchosen and calls
the choice consequential — without naming this constraint: a canvas/WebGL renderer chosen for NFR-8
must carry a second, SVG-producing render path for FR-46 (plus FR-48's legend and bezel), which is real
scope invisible in the PRD.

### M12 — §1 and §7.1 disagree about Weave Scope

§1: Weave Scope *"died with an **open** edge-legibility issue, which is the same defect §7.1 reports as
still unsolved here."*
§7.1: *"**Portolan does not hairball; Weave Scope's grave is genuinely avoided** — though that grave was
an open edge-legibility issue, which is the same class of defect as what remains broken here."*

One says the grave is avoided; the other says the same defect is still unsolved. §7.1 also locates what
remains broken in *composited tints, stub size and the absent network mark* — a zone/mark legibility
problem, not an edge-crossing problem. "Same defect" (§1) and "same class of defect" (§7.1) are not the
same claim, and the stronger one is in the section a reader trusts least to be precise.

### M13 — The vision horizon outruns the platform lifetime the PRD itself documents

§1: *"**In two to three years**, Portolan is what you install on a cluster you do not understand."* That
lands in 2028–2029. §7.5, citing the addendum accurately: MKE 4 contains no Swarm, and *"the furthest
documented Swarm end-of-life is MKE 3.9 in March 2028"*, with the 2030 pledge unreaffirmed since the
Mirantis acquisition (`addendum.md:122-125`).

The document never reconciles the two, and §1 forecloses the argument instead: *"The timing looks like
the worst thing about this project. It is the best."* The supporting claim — *"you cannot migrate a
cluster you cannot map"* — cuts against §2 as well: migration is a one-off use, while the first bar is
*"reached for by preference, not by loyalty"* and the counter-metrics treat repeat reading as cost. The
adoption story and the timing story require opposite user behaviour, and no evidence is offered for
either. This is the document's second clearest instance of a risk closed rhetorically.

### M14 — NFR-12's headline overclaims what NFR-14 concedes

NFR-12 is titled *"Colour never carries a dimension on its own"* and defends it by pointing out that
*shape* encodes the family. FR-11 says in the same breath that *"colour encodes the value"*, and NFR-14
concedes that value-level separation fails for two of the four families (ΔE 3.9 and 2.6) with the
octave pattern separating octaves, not hues within one. So for stack and network values, colour does
carry information on its own, unaided, and the fallback is written names — which FR-15 does not render
at the landing level for anything but stack and zone labels. NFR-12 is true only of a redefinition of
"dimension", and it sits in the section a reader checks for WCAG-shaped assurance.

### M15 — FR-82's accepted cost has no remedy in the frame that matters

FR-82 accepts that *"the outline encloses non-members where it cannot thread around them"*. Upstream
supplies the disambiguator: *"the stack pastille is the exact answer where the two groupings cross"*
(`DESIGN.md` §Stack outline). But FR-15 renders only type marks at the landing level, and
`EXPERIENCE.md:58` confirms *"object-type pastilles only"* at rung 0 — so the stack badge does not
exist in the frame where the enclosure error is most likely (largest outlines, densest packing). The
PRD books the cost and omits both the remedy and the fact that the remedy is absent exactly where the
cost is incurred. NFR-14 removes it a second time for deuteranopes at every level.

### M16 — Screen masking removes part of the channel NFR-14 relies on

NFR-14's mitigation for the network family's colour failure is *"written names — … 13.8:1 for a zone
label"*. `DESIGN.md:788` and §Network zone describe zone identity as the label **and the CIDR
beneath**. FR-49 masks *"every IP and every CIDR"*, and FR-51 puts masking on the screen — the
meeting-room case §1 names as the executive's one requirement. The PRD never states what masking costs
the network identity channel, and FR-52's list of what survives masking ("object names, stack names,
the shape of the topology") does not mention zone sublabels either way.

### M17 — No budget bounds the survey itself

FR-3 permits a 5s interval; NFR-7 sets the reference cluster at a few hundred objects across six nodes;
FR-4/FR-5 make the *age of the last successful survey* the product's honesty mechanism. Nothing in §4.3
bounds how long a survey may take, how many Docker API calls it may make, or what happens when a survey
takes longer than the interval (overlap? skip? queue?). NFR-8 explicitly budgets rendering only. On a
cluster where a full enumeration takes 8s at a 5s interval, the staleness stamp and the veil behave in
a way no requirement predicts.

### M18 — FR-45's exception for FR-53 is asserted rather than derived, and FR-53's terminal gesture is undefined

FR-45's rule is *"stills every continuous motion and keeps every action-triggered transition"*. The cold
load (FR-53) is continuous and not action-triggered, so the rule excludes it; FR-45 keeps it anyway by
adding *"is explanatory and is kept"*. That may be the right call, but it is a third category the rule
does not contain, and it is the one category that matters for vestibular users, with no duration bound
anywhere. FR-53's *"distinct settling gesture"* is also undefined in the PRD and listed upstream as an
open non-blocker (`.memlog.md:124`, "end-of-first-load signal mechanism").

---

## Low

- **L1 — §8 points builders at a stale validation report.** `validation-report.md:375` asserts *"The
  spines themselves have **not** yet been edited: `DESIGN.md:725` still carries the
  `SOCKET MOUNTED :RO` chrome"*. That is no longer true — `DESIGN.md:1075` and `DESIGN.md:1258` record
  the removal and why the `:ro` claim was false, and FR-2/NFR-3 carry the corrected posture. §8 lists
  the validation report as a governing source without noting that its closure claims are out of date,
  which risks a builder re-opening a fixed defect (or trusting its other closure claims symmetrically).
- **L2 — NFR-11's "above 4.2:1" is unsourced and unaudited in the PRD**, while the figure it is
  softening (health at 2.1:1, `DESIGN.md:958`) is omitted. See H10.
- **L3 — Localisation has no width budget.** NFR-18 ships French; FR-79 fixes the left menu and panel
  widths; FR-63 forbids the specimen wrapping; FR-62 defers chassis overflow behaviour to design for
  English. French control names run 15–30% longer. Nothing states that the fixed columns must hold the
  longest shipped string.
- **L4 — FR-4's "plain words" is unspecified at the boundaries.** "Surveyed 4 min ago" does not say what
  is shown under one minute, at exactly one minute, past an hour, or past a day — in a product where
  this stamp is the sole honesty mechanism (FR-54, FR-55) and the veil keeps deepening for 15 minutes.
- **L5 — §6 is incomplete against the body.** Costs the body admits but the table omits: FR-82's
  landing-frame ambiguity (M15), the contour's sub-floor contrast (M8), the export/screen masking
  divergence (H8), and the two-hop/all degeneracy (M5). A reader who trusts §6 as the complete list of
  qualifications gets a rosier product than §3 describes.

---

## What holds up

Recorded so the criticism above is calibrated, not to balance it.

- **NFR-2 and NFR-3 are the document's best work.** The brief-fidelity review found authentication and
  exposure *"silently dropped, completely"* from both spines (`review-brief-fidelity.md:44`, rated High)
  while export was promoted to v1 and a flow ends in publishing a topology. The PRD reinstates it,
  states the consequence in the terms the brief used, and refuses to let the chrome claim a mechanism
  it does not have.
- **FR-61 is a genuine addition**, closing the gap the legibility review named exactly
  (`review-legibility-at-scale.md:166`: *"nothing in either spine offers a user-facing way to stop the
  motion"*).
- **§8's departure entries that are present are accurate.** The export promotion is a user decision
  (`.memlog.md:53`), the 60s step is a UX-phase addition, and the one-hop default correctly overrides
  Flow 1 step 7, whose narration does show the user reducing a wider reach (`EXPERIENCE.md:349`).
- **FR-7, FR-8, FR-65 and FR-68 are carried faithfully from upstream**, including the arithmetic
  (660/~700 ≈ 94%, the 6px stub floor at `DESIGN.md:1014`) and, unusually, including the admission that
  FR-65 is partial.
- **§7.1 refuses to declare the principal risk closed**, and NFR-7 states the verification condition in
  falsifiable terms (a real cluster of a few hundred objects). The failures above are failures of
  bookkeeping inside an honest frame, not of candour about the frame.
