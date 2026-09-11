# PRD Quality Review — Portolan

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-Portolan-2026-09-11/prd.md`
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Stakes calibration:** solo open-source project, serious personal build. Reviewed for whether the
  author and the downstream architecture/story workflows can act on it — not for enterprise ceremony.

## Overall verdict

This is a genuinely strong PRD on the dimensions that usually fail: it has a thesis it bets on, it
names what it gave up in a dedicated Accepted costs table, and it publishes the verdict that its own
primary axis is broken (§7.1) rather than burying it. Personas are three, each one earns requirements,
and the Vision could not be lifted into another product. What is thin is *closure*: the requirement the
whole risk narrative hangs on — NFR-8 — carries no number ("stays interactive"), it is declared
irreconcilable with FR-71 with both sides labelled non-negotiable and no arbitration rule, and several
FRs (FR-62, FR-64, FR-33/FR-34) explicitly defer their own bound. Downstream traceability is the second
soft spot: the search capability (FR-36–FR-38) appears with no upstream spec and is not declared as a
departure, and "the primary journey's three discoveries" is used normatively three times without ever
being enumerated. ID hygiene is flawless — FR-1..82 and NFR-1..20 each defined exactly once, no dupes,
no dangling reference.

## Decision-readiness — adequate

Trade-offs are surfaced rather than smoothed, and in several places the PRD volunteers against itself.
§1 declares "**There is no technical moat.** The graph is not a novel invention, the idea has been
copyable for nine years." §7.5 retains the counter-argument that would kill the beachhead — "A
Swarm-*only* tool sells to the segment that self-identifies as Swarm users — small, unpaid, shrinking"
— and names the reopen condition rather than filing it as a risk and moving on. NFR-17 names both
rejected licensing alternatives and why. NFR-14 opens with "**Accepted and stated:**" and then reports
its own failures numerically (ΔE 3.9 and 2.6). This is the opposite of the red flag the rubric warns
about; nothing here "balances" everything.

Open questions are actually open. §7.2 and §7.3 are tables of *Question → Consequence if left open*,
and none of the consequences is rhetorical: "v1 is an unauthenticated full-topology viewer with
one-click export", "Read-only stays an intention rather than an enforcement". The PRD carries no
`[NOTE FOR PM]` callouts at all, but §7.2/§7.3 do that work in a more useful form, so the absence costs
nothing.

What stops this being *strong* is one structural gap. NFR-8 states "Meeting NFR-8 is a rendering and
architecture problem; the requirement itself does not bend, and FR-71 is not negotiable either —
reconciling them is the work." A decision-maker handed two requirements, told both are fixed, and told
they are currently incompatible, has been handed the problem back, not a decision. The PRD already owns
the lever it needs — FR-61 puts a motion kill-switch in the product — but never connects it to NFR-8 as
a degradation path.

### Findings

- **high** NFR-8/FR-71 declared irreconcilable with no arbitration rule (§4.3, NFR-8) — The PRD states
  that continuous motion "re-tessellates on the order of 9,000 Bézier segments per frame across 325
  bodies, and the legibility review's conclusion is that this will not hold", then fixes both sides:
  "the requirement itself does not bend, and FR-71 is not negotiable either". If architecture cannot
  reconcile them, nothing in the PRD says which yields, so the decision gets made silently by whoever
  writes the renderer. *Fix:* add one sentence naming the fallback order — e.g. that breathing degrades
  first (amplitude, subset of bodies, or auto-still above a population threshold, reusing FR-61's
  existing control surface) and that NFR-8 wins if the two cannot both hold — so the trade is decided
  here rather than in a commit message.
- **medium** No sequencing or load-bearing spine across 82 FRs (§3, §5) — §5 is a clean *out of scope*
  list, but nothing inside v1 is ranked: FR-1 (read the socket) and FR-75 (dark is the default) read as
  equally mandatory. For a single-author build the thesis gives an obvious ordering — relations first,
  register second — and the PRD is the natural place to say so. *Fix:* mark a small spine (the FRs
  without which there is no product) or add one paragraph on build order; epic sequencing otherwise gets
  invented downstream with no guidance.
- **low** §7.1's principal risk has no stated contingency (§7.1) — The review verdict quoted is "It
  survives as a picture. It does not survive as a map of *networks*, which is the product's primary
  axis", and the PRD is right to carry it rather than paper it. But there is no "if the landing frame
  still cannot carry networks after FR-65/FR-67/FR-68, then X". *Fix:* name the fallback frame in one
  line (e.g. the network answer lives at reading level 2 and in the panel, and the landing claim is
  withdrawn) so a failed verification does not reopen the whole product.

## Substance over theater — strong

No dimension of this PRD reads as furniture.

**Personas.** Three, under the rubric's limit of four, and each one is load-bearing. The executive is
explicitly demoted — "**The executive — a viewer, not a user.**" — and the PRD then states exactly which
requirements it does and does not generate: "This third figure sets requirements without becoming an
audience with features of its own. Docker vocabulary is never renamed or prettified for them (FR-80),
and there is no simplified mode, no guided tour and no onboarding surface. The one thing they require
of the product is ... (FR-51)." There is also an anti-persona — "**Explicitly not an audience:** the
growing population running Swarm underneath a PaaS such as Dokploy" — which is rarer and more useful
than a fourth persona.

**Vision.** Not swappable. It names a specific competitor history ("Portainer has been asked for this
view since 2017 and has never built it"), a specific corpse ("Weave Scope, has been dead since 2023 —
and it died with an **open** edge-legibility issue, which is the same defect §7.1 reports as still
unsolved here"), and inverts the obvious objection with an argument rather than optimism: "you cannot
migrate a cluster you cannot map."

**NFRs.** The opposite of boilerplate. NFR-7 gives the reference cluster as a census (6 nodes, 14
stacks, 40 services, 300 containers, 11 overlay networks, 25 volumes, ~2.2 networks per container) and
adds the teeth — "Verification requires a real cluster of this order — not a three-container lab."
NFR-10 gives 9px/8px floors with a refusal rule ("A label that cannot meet its floor is not rendered at
that reading level — it is never shrunk to fit"). NFR-11 gives five contrast figures and then names
three deliberate exemptions rather than quietly excluding them.

**Innovation claims.** Actively disclaimed (see Decision-readiness). The differentiation section exists
because the competitive survey found vacant ground, and it says so.

No findings.

## Strategic coherence — strong

There is a thesis, it is stated in one sentence — "The relations are the product." — and the features
follow from it rather than sitting beside it. The chain is traceable: because relations are the product,
networks render as areas not edges (FR-8), which is what converts "roughly 660 of ~700 edges into local
stubs" and defeats the hairball; because the edges are the product, the disjoint-blob mode's cost is
booked explicitly in §6 as "in a product whose thesis is that the edges are the product"; because images
would add nodes without adding relations, FR-7 keeps them off the map and §7.1 rates that "the single
highest-value legibility decision taken".

Success metrics validate the thesis rather than measuring activity, and the counter-metric table is the
strongest part of §2 — it names the exact failure mode where success signals would lie: "Screenshots
from people who cannot answer the founding question | This is the *survives as a picture, not as a map*
failure mode, scoring as success." Long sessions are booked as cost, not engagement. Star counts are
excluded with a reason. Second-bar signal 3 is explicitly introduced to test the one claim every
upstream document asserted and none verified.

MVP scope kind is coherent — this is an *experience* MVP (the value is the frame, not the feature count),
and the scope logic matches: no inventory surfaces, no results list, no metrics panel, one classification
only.

### Findings

- **low** First-bar criteria have no measurement method (§2) — "A truthful picture of an unfamiliar
  cluster **in minutes**, not hours" carries no start point and no definition of *truthful*. The second
  bar is deliberately anecdotal and that is fine, but the first bar is the one the author will judge
  himself against. *Fix:* one line on how it is measured (e.g. from `stack deploy` to the three
  founding-question answers, on the NFR-7 reference cluster).

## Done-ness clarity — thin

Most FRs carry a testable consequence, and several are unusually well specified for a document at this
stage: FR-68 floors the stub at "**6px on screen**", FR-67 at "**8 × 8px**" with a named drop order
("**network badges drop from the right of the network group** and no other family is dropped, the rail
never wraps"), FR-70 caps stretch at "**+32%** of base radius", FR-71 pins the hard part with a number —
"local deformation only, translation 0px" — and FR-23 justifies its default arithmetically ("At two hops,
more than 150 of 325 objects light on a realistic cluster"). FR-12 defines health as three counted
comparisons rather than an adjective. This is the rubric's ideal in many places.

But the gaps cluster exactly where they hurt most. **The product's hardest requirement has no number.**
NFR-8 reads "The landing frame stays interactive at that scale on integrated graphics" — no frame rate,
no input-latency bound, no named baseline GPU, no definition of *interactive*. §7.2 then says
"Continuous motion as specified does not hold frame rate at reference scale", referring to a frame-rate
target that the PRD never states. Nothing about NFR-8 can be passed or failed as written, and it is the
requirement the entire §7.1/§7.2 risk narrative rests on.

Three more FRs defer their own bound, one of them admitting it in the text. FR-62 says the text-size
ceiling "is whatever that specified behaviour can honestly carry, and it is set during design, not
asserted here" — so an accessibility escape hatch cannot be closed from the PRD. FR-64 requires that "A
minimum supported Docker Engine API version is declared and checked" without declaring the version.
FR-33 and FR-34 govern two states whose whole job is a degree of visibility — "their two dim depths must
look visibly different", "very pale context" — and NFR-11 then explicitly exempts both from every
contrast floor, so literally nothing constrains them.

There are also two places where two normative statements collide.

### Findings

- **high** NFR-8 has no threshold (§4.3, NFR-8) — "stays interactive at that scale on integrated
  graphics" is an adjective where the PRD elsewhere gives figures, and §7.2 refers to a "frame rate" the
  document never sets. This is the one NFR that architecture must design against and the one that cannot
  be tested. *Fix:* state the target (e.g. sustained ≥30fps with pan/zoom input latency under X ms, on a
  named integrated GPU, on the NFR-7 census, in the landing frame with default settings).
- **high** "The primary journey's three discoveries" is normative but never enumerated (FR-15, NFR-14,
  NFR-20, §7.3) — FR-15 ends "Each of the primary journey's three discoveries is found at a different
  level, which is what the ladder is for", NFR-14 states "a deuteranope cannot make the second of the
  primary journey's three discoveries from the map alone", and NFR-20 calls the serifed `l` "the
  mechanism of the primary journey's third discovery". The PRD has no journey section, never names the
  journey, and never lists the three discoveries; the link to `EXPERIENCE.md` Flow 1 is only inferable
  from one row of §8's departures table. FR-15 and NFR-20 therefore cannot be turned into acceptance
  criteria from the PRD alone. *Fix:* add three short lines naming the discoveries (orphan by isolation;
  stack mark disagreeing with its zone; near-identical volume names distinguished at label size) and
  state that they come from `EXPERIENCE.md` Flow 1 — Rémi.
- **medium** FR-59 and FR-73 give contradictory sizing rules for the same surface (§3.3, §3.10) — FR-73:
  "In node view a machine's region is drawn **proportionally to what it carries**". FR-59: "A machine
  carrying nothing renders at full size in node view." Proportional-to-load and full-size-when-empty
  cannot both hold without a floor, and none is stated. *Fix:* make FR-59 an explicit minimum region size
  on FR-73's scale.
- **medium** FR-62's ceiling is deferred out of the PRD (§3.6) — "the ceiling is whatever that specified
  behaviour can honestly carry, and it is set during design, not asserted here." This was an upstream
  accessibility finding (no route to enlarged text; browser zoom at 1440px trips FR-60's off-chart
  refusal) and the PRD closes it with a promise to decide later. *Fix:* either state a floor for the
  ceiling (e.g. must reach +50% with the chassis behaviour specified at each step) or move FR-62 into
  §7.3 as an open item rather than leaving it as an unclosable FR.
- **medium** FR-64 declares a version gate without the version (§3.1) — "A minimum supported Docker
  Engine API version is declared and checked" is untestable until the number exists, and it gates the
  collector. *Fix:* state the minimum API version, or say explicitly that architecture sets it.
- **medium** FR-33/FR-34 are unbounded and simultaneously exempt from every floor (§3.5, NFR-11) — FR-33
  requires that the highlight dim and the filter removal "must never be confusable at a glance, and their
  two dim depths must look visibly different", FR-34 requires "very pale context", and NFR-11 exempts both
  the reachability dim and the empty-filter pale context from its contrast floors. A must-never-confuse
  rule with no measurable separation cannot be verified. *Fix:* give FR-33 a minimum luminance/opacity
  delta between the two dims and FR-34 an opacity range — a bound *below* a legibility floor is still a
  bound.
- **low** FR-11's absolute is contradicted by FR-13 and FR-70 (§3.2) — FR-11 states "**shape encodes the
  family and colour encodes the value**. A shape never encodes a value." FR-13 then makes the contour
  "irregular and **seeded from the object's Docker ID**" (shape carrying identity) and FR-70 says "a
  single-link object therefore reads as a teardrop" (shape carrying link count). The rule is presumably
  scoped to the mark rail, but it is written without scope. *Fix:* narrow it to "within the mark rail, a
  shape never encodes a value" — the silhouette channels of FR-13 are the deliberate exception.
- **low** FR-17 and FR-21 leave the service-view tab's resting state unspecified (§3.3) — FR-17: "Three
  views, switched from a bottom tab bar." FR-21: "Service view is reachable only by isolating a selected
  service." What the third tab does with nothing selected is never said. FR-77's **unavailable** state is
  the obvious answer but is not applied. *Fix:* one clause stating the service tab is *unavailable* per
  FR-77 until a service is selected.

## Scope honesty — strong

This is the PRD's best dimension. Omissions are decisions and they are signed.

§5 opens "Each of these is a decision, not an omission" and lists ten exclusions, each cross-referenced
to the FR or NFR that owns it (FR-7, FR-9, FR-4, NFR-16, NFR-15). §6 is a dedicated Accepted costs table
— eight rows, each naming the loss in the author's own voice, including the ones that hurt: "In the
disjoint-blob zone mode, an object's edges are split between its copies, so neither copy shows it in
full — in a product whose thesis is that the edges are the product", and "The transitive questions the
product exists for need the reach raised by hand, since the default is one hop." Booking a cost against
your own thesis is the marker of an honest scope section.

De-scoping is proposed openly rather than done silently, and so is *up*-scoping: §8's departures table
gives six changes with source, direction and reason, including one that goes against the brief ("SVG/PNG
export is **in** v1") with the real argument stated ("a screenshot cannot carry the chart legend, the
bezel or a chosen framing — and it cannot mask an address"). NFR-17 flags its own deviation: "**This is
a deviation from a niche where permissive licensing dominates, and it is deliberate.**"

§7.4 is unusual and valuable: rather than treating the upstream specs as closed because they say
`status: final`, it warns that "**11 to 12 `[ASSUMPTION]` markers and 5 to 6 `[DEPARTS FROM BRIEF]`
markers survive into the final text**" and that "per-finding closure cannot be verified". A PRD that
tells you how much to trust its own sources is doing scope honesty on the sources too.

Open-items density is appropriate: §7.1 (one principal risk), §7.2 (five architecture questions), §7.3
(four design questions), §7.5 (three retained counter-arguments). For a pre-architecture PRD on a solo
project that is right-sized — these are carries, not unresolved scope.

The PRD uses no `[ASSUMPTION: …]` tags and has no Assumptions Index. Given that every inference is
instead either declared in §8 or routed into §7, this reads as a deliberate substitution rather than an
omission — but see the search finding under Downstream usability, which is the one inference that slipped
through both mechanisms.

### Findings

- **low** No Assumptions Index, and one PRD-level decision is undated/unsourced (§8) — §8 dates FR-51
  ("Decided 2026-09-11") and sources the other five departures, which sets the standard. FR-75 ("**Dark
  is the default.**") and FR-23's supersession are decided in the PRD but only the latter appears in §8.
  *Fix:* either add the missing rows to §8's table or add a short "decided in this PRD" list; the
  departures table is already doing the work an Assumptions Index would.

## Downstream usability — thin

This PRD is chain-middle (brief → UX spines → PRD → architecture + stories), and §8 sets the contract
explicitly: "The PRD is the authority on *what* v1 is. Where a figure or mechanism is stated once here
and in full upstream, upstream governs the detail." That is a sound division of labour and it is why
the PRD can legitimately carry no glossary and no user journeys. But the contract only works if every
delegation actually lands somewhere, and three do not.

**Search is orphaned.** FR-36, FR-37 and FR-38 specify a genuine capability with real behaviour
("reframes the map onto the matching objects, at a zoom level where their names render", "matches object
names **and image tags**", "removes nothing and never relays the map"). There is no search feature
anywhere in `DESIGN.md` or `EXPERIENCE.md` — the only `search` hit in either is an unrelated phrase about
"an exhaustive search on a 2px grid" for label placement. So a designer or architect following §8's rule
and looking upstream for the detail finds nothing: no field placement, no result-set framing behaviour,
no empty-match state, no interaction with active filters. And §8's departures table does not declare
this as new, even though it declares six smaller changes.

**Journey references do not resolve.** Covered under Done-ness; the effect here is that story creation
cannot source-extract FR-15, NFR-14 or NFR-20 without opening `EXPERIENCE.md` and guessing which flow is
"primary".

**The provenance table misstates its own source.** §8 says `EXPERIENCE.md` holds "the four user journeys
with their discovery beats". It holds three (`Flow 1 — Rémi, the inheritor`, `Flow 2 — Tom, the
homelabber`, `Flow 3 — Tom again, checking the spread`). A reader will look for a fourth.

On the mechanical side the PRD is excellent: FR-1..82 and NFR-1..20 are each defined exactly once, there
are no duplicates, and every `FR-`/`NFR-` reference in the document resolves to a definition. All five
`§` cross-references (§1, §6, §7.1, §7.5, §8) resolve to real headings. Sections do stand alone — §6 and
§5 cite the FR that incurs each item rather than saying "see above". The non-consecutive numbering within
sections is stated up front and is not a defect.

### Findings

- **high** FR-36–FR-38 (search) have no upstream specification and are not declared as new (§3.5, §8) —
  Three FRs introduce a capability that appears nowhere in `DESIGN.md` or `EXPERIENCE.md`, while §8
  instructs downstream that "upstream governs the detail". Unspecified: where the field lives in the left
  menu or toolbar, the reframing rule for a multi-match set, the no-match state, and how search interacts
  with active filters (can it reframe onto something a filter has removed?). *Fix:* add a row to §8's
  departures table stating that search is introduced by this PRD with no upstream spine, and either
  answer the four questions above in FR-36 or route them to §7.3 as carried-to-design.
- **medium** §8 claims four user journeys; `EXPERIENCE.md` has three (§8) — The provenance table is the
  one place downstream is told what to read and where. *Fix:* change "four" to "three" and name them, so
  the "primary journey" reference resolves at the same time.
- **medium** No glossary for a PRD that invents a substantial vocabulary (§3) — *zone*, *field*,
  *outline*, *backdrop*, *region*, *body*, *bubble*, *invariant core*, *mark rail*, *badge*, *stub*,
  *octave*, *silhouette channel*, *reading ladder*, *off-chart* are all terms of art defined at the point
  of first use (FR-10 separates zone from outline well) but never collected. Two of them then drift (see
  Mechanical notes). *Fix:* a twelve-line glossary, or an explicit line in §8 pointing at `DESIGN.md` as
  the vocabulary authority — the PRD currently implies it without saying it.
- **low** NFR-13's known violation is not routed anywhere (§4.4, §7.3) — NFR-13 states the requirement and
  then reports it currently unmet: "Two of them currently simulate to a byte-identical value, which is a
  defect rather than an acceptable residual". §7.3 (Carried to design) lists four items and this is not
  one of them, although it is the palette defect with the clearest consequence. *Fix:* add it to §7.3 so
  the design phase has a checklist item, not just an NFR to rediscover.

## Shape fit — strong

The shape matches the product. Portolan is a single-surface visual tool from a solo author with heavy,
load-bearing UX, and the PRD is written as a capability spec (§3, ten capability groups) with the
journeys held upstream where they already exist in detail. That is the right call: duplicating
`EXPERIENCE.md`'s flows here would have been over-formalisation, and the PRD instead spends its length
on the two things only it can settle — the normative figures and the cross-cutting floors.

Rigor is calibrated correctly for hobby/solo without dropping the substance bar: no RACI, no phasing
theatre, no stakeholder matrix, but ΔE values, contrast ratios, pixel floors and an object census. §4.5
"Deliberate exclusions" is exactly the right move for a solo v1 — NFR-15 refuses screen-reader support
outright rather than promising it vaguely, and NFR-16 refuses responsive behaviour with a reason ("1440px
is a floor, not a breakpoint, and there is no second layout").

Greenfield, so no brownfield accuracy burden. The one shape risk — an executive persona pulling the
document toward consumer-product formality — is explicitly defused in §1 ("sets requirements without
becoming an audience with features of its own").

No findings.

## Mechanical notes

- **ID continuity: clean.** FR-1 through FR-82 are each defined exactly once (82 definitions, no
  duplicates, no gaps) and NFR-1 through NFR-20 likewise. Every `FR-n`/`NFR-n` mentioned in prose
  resolves to a definition — no dangling references. The deliberate non-consecutive ordering within
  sections is stated in §3 and is correct behaviour, not drift.
- **Section cross-references: clean.** §1, §6, §7.1, §7.5 and §8 all resolve.
- **Glossary drift — node / machine.** The PRD's own FR-80 lists the Docker nouns that must never be
  renamed: "*service, network, volume, stack, node, container, image*". Yet §3.3 and §3.10 call them
  machines — FR-19 "puts the machines in the foreground", FR-73 "a machine's region", FR-28 "every
  machine's region header", FR-58 "the machines are the whole of what there is" — and FR-59 uses both
  words in consecutive sentences: "A machine carrying nothing renders at full size in node view. A node
  with nothing on it is information." The motive is visible (FR-7 and FR-8 use *node* in the graph-vertex
  sense, so *machine* disambiguates), but as written §3.3 is in tension with FR-80. Worth one deliberate
  ruling either way.
- **Glossary drift — bubble / body.** FR-13 and FR-28 say *bubble*; FR-8, FR-70, FR-71 and §7.1 say
  *body* ("Neighbours never squash a body", "Bodies land at 14–28px"). They are the same mark and are
  never equated.
- **Glossary drift — map / chart.** *map* appears ~38 times, *chart* ~22, for the same artefact ("restores
  the whole chart" FR-32, "never relays the map" FR-38). FR-80 licenses chart vocabulary for the chassis,
  which covers *Fit to chart* and *chart legend*, but the descriptive prose mixes the two freely.
- **Assumptions Index: absent by design.** No inline `[ASSUMPTION]` tags, so nothing to roundtrip. §8's
  departures table and §7's carry tables substitute for it; §7.4 additionally accounts for the upstream
  documents' surviving markers.
- **UJ protagonists: n/a.** The PRD contains no user journeys (held in `EXPERIENCE.md`), so there are no
  floating UJs. The cost is the unresolvable "primary journey" references flagged above.
- **Provenance paths.** §8's table paths (`briefs/brief-Portolan-2026-09-09/brief.md`,
  `ux-designs/ux-Portolan-2026-09-10/DESIGN.md`) are rooted at `_bmad-output/planning-artifacts/`, not
  relative to the PRD's own directory. All five referenced files exist at that root. Harmless, but a
  downstream agent resolving them as relative paths will miss.
- **`addendum.md` is ambiguous.** §1 ("lives in `addendum.md` (see §8)") and FR-64 ("recorded in
  `addendum.md`") mean the *brief's* addendum, per §8's table. There is no addendum in the PRD's own
  workspace, so a reader may look in the wrong directory. Qualifying it once as `brief.md`'s addendum
  would settle it.
- **Required sections: all present** for a solo pre-architecture PRD — Vision, Success criteria with
  counter-metrics, Capabilities, Cross-cutting requirements, Out of scope, Accepted costs, Open questions
  and risks, Provenance and departures. No acceptance-criteria section, which is defensible given that
  most FRs carry their own testable consequence — the exceptions are listed under Done-ness.
