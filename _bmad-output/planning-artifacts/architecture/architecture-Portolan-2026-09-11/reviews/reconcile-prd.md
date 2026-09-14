---
title: 'Reconciliation — PRD against ARCHITECTURE-SPINE'
input: '_bmad-output/planning-artifacts/prds/prd-Portolan-2026-09-11/prd.md'
spine: '_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md'
date: 2026-09-14
scope: 'what did not land'
---

# Reconciliation — PRD → Architecture Spine

**Verdict.** The spine is strong where it looked: the pipeline, the seams, determinism, staleness,
exposure, CI gates and the honest deferrals are better than the PRD asked for. It is weak where the AD
form does not reach: **an entire PRD section (§3.3, the three views) is absent**, the rasteriser
stage's cross-frame behaviour is forbidden by AD-2 while four FRs require it, masking is bound but
ungoverned, and three of the four NFRs flagged as easy to lose (NFR-15, NFR-16, NFR-20) survive only
inside a blanket range-bind.

**Structural cause of most of what follows:** the frontmatter binds NFRs as a *range* —
`NFR-1 … NFR-20` — rather than an enumeration, and binds **52 of 83 FRs**, leaving 31 unbound. A range
bind cannot be audited, and it is exactly how NFR-15, NFR-16 and NFR-20 came to be cited without being
governed.

Unbound FRs: 10, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 30, 31, 32, 35, 37, 39, 42, 45,
49, 50, 52, 59, 61, 69, 73, 75, 81.

---

## 1. The six questions PRD §7.3 carries to architecture

| # | Question | Status in spine | Assessment |
| --- | --- | --- | --- |
| 1 | Default legibility of the landing frame (§7.1) | **Deferred**, revisit condition: a real cluster of NFR-7 order plus the harness | Correct. AD-9/AD-26/AD-29 build exactly the apparatus the PRD said was needed. This landed well. |
| 2 | Mark sizing at the landing level (§7.2, NFR-9) | **Deferred and reassigned** — "Not an architecture decision… Owner: product and design" | **Finding 12.** Answered, but the owner is handed back to the sender without a "Raised upstream" row. |
| 3 | Where the map is served, to whom, over what (NFR-2) | **Decided** — AD-17 (host mode, `127.0.0.1`, `node.role == manager`) + AD-18 | Decided, but see **Findings 8 and 9**: the chosen default collides with the executive persona and with success criterion #3, and one of the three named openings re-creates the forbidden artefact. |
| 4 | Whether the manager socket can be mediated by a read-restricted proxy (NFR-3) | **Decided** — AD-16, no sidecar; proxy is optional README hardening | Decided as *no*. But see **Finding 10**: AD-16 claims NFR-3 is "met", which it is not. |
| 5 | The luminance clamp on composited zone fields (NFR-9) | **Deferred**, revisit condition: harness contrast output on the worst composited field, then written into the AD-23 token file where AD-28 guards it | Correct, and the routing into AD-23/AD-28 is better than the PRD asked for. |
| 6 | Front-end stack and graph rendering library (NFR-19) | **Half decided** — React 19.3 for chrome (AD-25); screen rasteriser backend and layout library deferred with conditions | Honest and declared. But the deferral's revisit condition names only harness output at 396 objects — it never names the browser matrix, which is **Finding 4**. |

**None of the six was silently dropped.** That is genuinely good. The defects are in #2 (reassignment
not declared upstream), #3 and #4 (the decision's cost not carried back as an accepted cost).

---

## 2. Findings

Severity: **High** = a PRD requirement the spine makes unbuildable, contradicts, or omits wholesale.
**Medium** = substance lost or an undeclared departure. **Low** = a quiet requirement unrestated,
recoverable in stories.

---

### Finding 1 — HIGH — PRD §3.3, the three views, is absent from the spine, and AD-3 forbids switching between them

**What the PRD requires.** FR-17 (three views on a bottom tab bar; a tab switch is a complete change
of view, not a filter), FR-18 (Overview is the landing view, node partition off), FR-19 (node view
foregrounds machines; zones and stack outlines are *not drawn*), FR-73 (a machine's region drawn
proportionally to what it carries), FR-59 (a machine carrying nothing still renders a full region with
header and marginalia — the floor on FR-73), FR-20 (service view is an ego-graph, a semantic zoom),
FR-21 (service view reachable only by isolating a selected service).

**What the spine does.** Nothing. FR-17 through FR-21, FR-59 and FR-73 appear nowhere: not in the
frontmatter binds, not in any AD, not in the Capability → Architecture Map, not in the Structural Seed
(no view concept in `layout`, `scene` or `chrome`). FR-58 (empty cluster renders the node backdrop) is
bound, but FR-59 — its sibling and the floor on the rule it depends on — is not.

**Why it matters architecturally, not just as coverage.** These are not cosmetic. Node view suppresses
two rendering languages and substitutes a proportional-area layout; service view is a different graph
(an ego-graph over one subject). Both are *layout modes*. AD-8 types layout as
`(model, seed, mode) → positions`, and `mode` is used throughout the spine to mean *zone mode* only
(AD-3, AD-20). There is no stated input by which layout learns which of three views it is laying out,
and no statement that node view's proportional regions (FR-73) are a layout responsibility at all.

**The contradiction.** AD-3's rule reads:

> Only the three actions FR-16 names — *Reorganise*, a change of zone mode, and toggling the node
> backdrop — may call layout. Every other interaction reads layout output and never invokes it.

FR-16's own text carves views out of that list explicitly:

> Entering a different view (FR-17) or a different subject (FR-20) is a new surface being drawn, not a
> relayout of this one.

The PRD carved the exception because it knew a view switch produces new positions. AD-3 took FR-16's
three-action list and hardened it into an absolute, dropping the carve-out. As written, **AD-3 makes
the tab bar unimplementable**: a tab switch needs positions and has no permitted route to layout. This
is not in "Raised upstream".

**Fix direction.** Either AD-3's rule gains "a view switch and a change of service-view subject are new
surfaces, each with its own layout invocation and its own position store, per FR-16" — or the spine
adds an AD stating that each view is a separate layout instance keyed by view identity. And §3.3 needs
a Capability → Architecture Map row.

---

### Finding 2 — HIGH — AD-2 forbids the render stage to hold state, and four FRs require exactly that; AD-2 and AD-8 also contradict each other

**AD-2's rule.** "Collector, model, scene and both rasterisers are pure functions of their input and
hold nothing across calls."

**What the PRD requires of those stages, across inputs:**

- **FR-16** — "a new container appears near its neighbours, a vanished one fades in place, and neither
  reclaims space until the next relayout." A vanished object is *not in the model* and must still be
  drawn, fading, in a position it no longer earns. That is state held across inputs, in scene or
  rasteriser.
- **FR-40** — switching zone mode "re-lays the map as a visible movement — nothing may fade out and
  reappear, because the user has to follow objects by eye." An interpolated transition between two
  layout outputs requires the render stage to hold both.
- **FR-53** — the layered cold load (zones, then bodies, then edges, ending on a settling gesture) is a
  multi-frame sequence with progress state.
- **FR-71** — bodies breathe continuously with *desynchronised periods*. Phase can be derived from
  `f(clock, identity key)` and so is recoverable, but nothing in the spine says so, and AD-8's clock ban
  is scoped to layout only, leaving the question unanswered rather than decided.

**The internal contradiction.** AD-2 names layout as "the only stage permitted to hold state between
inputs". AD-8 then types layout as "a pure, deterministic function" `(model, seed, mode) → positions`
with a test asserting **bit-identical positions** within a process, across processes and across
architectures. A function that is bit-identical for a given `(model, seed, mode)` cannot also be the
stage that remembers prior positions. So:

- If layout is genuinely pure per AD-8, FR-16's *nothing moves across a survey* is unimplementable —
  a new container changes the model, so the pure function returns a whole new position set.
- If layout holds prior positions per AD-2, AD-8's signature and its bit-identical test are wrong as
  written (the signature needs a prior-positions input, and the test needs to fix it).

**Neither branch is chosen, and FR-16 is the PRD's stability guarantee.** It is bound in AD-1, AD-3,
AD-5, AD-7, AD-8 and AD-32 — cited six times, and its hardest clause (incremental placement of
appearing objects near their neighbours, without a relayout) is governed by none of them.

**Fix direction.** Name the incremental-placement responsibility explicitly: either a fourth pipeline
concern (`placement`, stateful, keyed by AD-5 identity, invoked per survey, forbidden from moving any
existing key) or an amended AD-8 signature `(model, seed, mode, prior) → positions` with the
determinism test re-specified as *bit-identical given identical prior*. Then amend AD-2 to permit
bounded transition state in the screen rasteriser, and say what the SVG serialiser does with it
(it should be the still frame — which is also what FR-47's literal export implies).

---

### Finding 3 — HIGH — Masking (FR-49, FR-50, FR-51, FR-52) is bound and mapped but governed by nothing, and AD-9 as written forbids the behaviour FR-47 mandates

**What the PRD requires.** FR-49 (mask every IP and CIDR, structure intact, *identical footprint so
nothing reflows*), FR-50 (available for the export, **on by default**, unticked in one click, no
dialog), FR-51 (also available for the screen, **off by default**, the two settings independent),
FR-52 (the product states plainly what survives masking and is still identifying; it never implies the
export is anonymous), FR-47 (export is WYSIWYG *with this as its one declared exception*), and §6's
accepted cost: "**By default the exported frame is not what is on screen.**"

**What the spine does.**

- Frontmatter binds FR-47 and FR-51. **FR-49, FR-50 and FR-52 are not bound at all.**
- The Capability Map has one row: `Export (FR-46..FR-52) | raster-svg | AD-9`. AD-9 says nothing about
  masking.
- AD-20 persists "screen masking" as a browser preference. That is the *only* mention of masking in any
  AD. Export masking (FR-50) — the default-on half, the half that ships in every exported frame — has
  no home.
- No AD says *where* masking is applied: a scene-level substitution, a rasteriser-level one, or a token.
  FR-49's "identical footprint so nothing reflows" is a scene-geometry constraint (text metrics must be
  computed on the masked string), which pins it to the scene. Nothing says so.

**The contradiction.** AD-9's rule:

> Neither rasteriser may hold information the other cannot obtain from the scene.

FR-47 + FR-50 + FR-51 require, *in the default case*, that the SVG serialiser and the screen backend
render the same map differently — masked and unmasked. Under AD-9 as written that is illegal unless
masking is a scene *parameter* and export generates a second scene. That is a real decision (it makes
export a scene regeneration, not a serialisation of the live scene, which in turn interacts with
FR-47's "current framing, current zoom" literalism). The spine neither makes it nor flags it.

**FR-52 is lost entirely** — a voice-and-honesty requirement of exactly the class the AD form drops. It
is also the PRD's guard against the product implying anonymity, which is the closest thing Portolan has
to a safety statement.

**Why this one costs.** FR-51 is named in §1 as *the one thing the executive persona requires of the
product*. It is the product's only concession to a whole persona, and architecturally it is a footnote
in a preferences list.

---

### Finding 4 — HIGH — NFR-16 never appears: no 1440px floor, no browser matrix, no "no responsive behaviour" — and it silently constrains the deferred rasteriser decision

**What the PRD requires.** NFR-16: "Desktop and laptop browsers only, 1440px and up, recent Chromium,
Firefox and Safari. No tablet, no mobile, no responsive behaviour: 1440px is a floor, not a breakpoint,
and there is no second layout."

**What the spine does.** NFR-16 appears only inside the range bind `NFR-1 … NFR-20`. The string
"1440", the words Chromium / Firefox / Safari / responsive / viewport appear nowhere in the document.

**Four concrete consequences:**

1. **The deferred rasteriser choice is under-constrained.** The Deferred row for *Canvas2D or WebGL*
   names one argument (9px text through an SDF atlas against NFR-10/NFR-11) and one revisit condition
   (AD-29 harness output at 396 objects). Safari is the hard constraint on that choice — WebGL2
   behaviour, `OffscreenCanvas`, worker rendering, colour management — and it is not in the frame.
   A measurement-only revisit condition will produce a decision that then fails on a supported browser.
2. **AD-31's smoke scope has no browser matrix.** "The server boots and serves, SSE establishes…, the
   map draws" — on which browsers? The Stack table names Playwright and two Ubuntu runners. Playwright's
   `webkit` on Linux is not Safari; NFR-16 names Safari explicitly. The gap is undeclared.
3. **FR-60** ("below the minimum viewport: an honest off-chart message") is bound and appears in AD-10's
   list of React-owned screens — but *the minimum* is NFR-16's 1440px, and the spine never states it, so
   FR-60's trigger has no value.
4. **AD-29's 884px operative canvas is derived from NFR-16's floor** and the spine presents it as
   derived only from FR-79's reserved column. The chain 1440 → chrome columns → 884 is never written,
   so a story author cannot check it.

**Note in the spine's favour:** AD-29's correction to 884px agrees with PRD §7.1, which already made
that correction. The spine's phrasing ("not the 1204px the PRD computed against") slightly misreads the
PRD as still holding 1204, but the number itself is right.

---

### Finding 5 — HIGH — NFR-20 is cited in one table cell and governed by nothing, and AD-26 forecloses the verification §7.4 asks for

**What the PRD requires.** NFR-20: identifiers set in a monospaced face **whose lowercase `l` is
serifed and whose zero is slashed**, and same-family link labels share a baseline. The PRD is explicit
that this is "an accessibility requirement, not a typographic preference: it is what makes `pgdata`,
`pg-data`, `pg_data` and `pgdatal` four visibly different strings at label size, which is the mechanism
of the primary journey's third discovery." NFR-11 ties the *identifier channel* (7:1) to NFR-20 by name.

**What the spine does.** NFR-20 appears exactly once, in the Capability Map row `Legibility floors
(NFR-10, NFR-11, NFR-13, NFR-20) | tokens, scene, CI | AD-23, AD-26, AD-28, AD-29`. No AD binds it.
Checking each cited AD:

- **AD-23** holds "colour, geometry, type and spacing tokens". A typeface with two required glyph
  properties is not obviously a token value, and nothing says the font *file* is under AD-23.
- **AD-28**'s blocking gates are contrast ratios and deuteranopia hue separability. Glyph
  disambiguation is not gated.
- **AD-29**'s harness reports body diameter, mark-rail occupancy, stub length and edge contrast.
  Not the twins.
- **AD-26** states: "**No visual-regression comparison is a correctness gate anywhere in the
  project.**"

**The foreclosure.** PRD §7.4 names two verifications the upstream documents ask for explicitly, the
first being "the four near-identical volume names rendered at real label size in the real face
(NFR-20)". That verification is inherently a rendered-glyph comparison. AD-26 bans pixel assertions as
correctness gates and AD-31 closes browser scope to smoke and chassis focus order. **Between them, the
spine removes every mechanism by which NFR-20 could be checked, and does not say so.** AD-26's
reasoning (screenshot suites get disabled within a month) is sound; the cost — one named verification
loses its only home — is not carried.

**Compounding gaps.** NFR-4 forbids external fonts, so this face must be embedded (AD-19 covers the
embedding). But nobody owns *choosing* it, and NFR-17 makes the font's own licence a hard filter
(AGPLv3-compatible, redistributable inside a container image). The spine's licence rule covers
"every dependency"; a bundled font is not obviously a dependency in that sense.

**Fix direction.** Either a named exception to AD-26 — one frozen, hand-reviewed specimen rendering
checked at design time and recorded as evidence, not as a CI gate — or an explicit Deferred row
handing the verification to design with a revisit condition. And a Stack row for the identifier face.

---

### Finding 6 — MEDIUM — FR-45 and FR-61 (motion control) are dropped, and AD-20's preference list contradicts FR-61 and FR-42

**What the PRD requires.** FR-61: "All continuous motion can be stopped **from inside the product**, as
a display control… Motion joins text size, density, theme and zone mode as a display control rather
than being the one such setting with no surface." FR-45: `prefers-reduced-motion` stills every
continuous motion and keeps every action-triggered transition — "decorative motion removed, explanatory
motion kept", with the FR-53 layered first draw explicitly kept. FR-42: text size and density are
separate first-class controls and stay separate.

**What the spine does.** FR-42, FR-45 and FR-61 are unbound and appear nowhere. AD-20 enumerates the
persisted display preferences:

> Palette, light/dark, text size, screen masking, zone mode, node backdrop and refresh interval

**Motion is absent. Density is absent.** FR-61's whole point is that motion must not be the one display
setting without a surface, and the spine's only enumeration of display settings omits it — reproducing
precisely the defect FR-61 was written to close. FR-42's density control is likewise gone, and FR-42
exists because the PRD refuses to let the two collapse into one.

**FR-45's architectural content is real and lost.** The reduced-motion rule partitions motion into two
classes (continuous/decorative vs. action-triggered/explanatory) with a named exception (FR-53 stays).
That partition has to exist in the scene or rasteriser as a structural property of each animation, not
as a CSS media query on the chrome — the map surface is not React (AD-10), so the OS setting must reach
the rasteriser through the AD-3 view-state store. Nothing says this.

**Also entangled:** FR-71's stillness above a documented object count "is a rendering budget and not a
control state: it is never reported as something the user chose (FR-77), and FR-61's control remains the
user's own." That is two independent motion states that must not be conflated in the view-state store.
No AD carries it.

---

### Finding 7 — MEDIUM — AD-12 contradicts FR-5 and does not declare the departure

**FR-5.** "Staleness is keyed to the age of the survey, never to the configured interval: choosing 60s
does not itself age the chart."

**AD-12's rule.** "Each tab displays a new snapshot only at **its own** selected cadence. The timestamp
a tab shows is that of the snapshot it rendered, not of the last one it received."

**The collision.** Under AD-12 a tab set to 60s renders a snapshot that is, on average, 30s old and at
worst 60s old, and displays *that* timestamp. Its survey age is therefore a direct function of the
configured interval — which is the thing FR-5 forbids. FR-54's staleness veil (pale, desaturate, age the
stamp in words) will then trip on the 60s tab purely because of the interval setting, with a fresher
snapshot sitting unrendered in the same tab's memory.

AD-12's *reasoning* is good: it correctly identifies the untaken decision (one server-side interval
would let the last tab to speak change everyone's map, violating FR-3's "alters neither the population
nor the rendering"). The single poll loop at the minimum interval is the right server shape. The defect
is the second half of the rule, which chooses the branch that contradicts FR-5, and does so without a
"Raised upstream" row.

**Fix direction.** Either render the freshest available snapshot always (the interval then governs the
*minimum* server poll rate, not the tab's display rate — which preserves FR-5 but makes the interval
control nearly meaningless to a single user), or keep AD-12's cadence and amend FR-5 upstream to say
staleness is keyed to the rendered snapshot's true age, with the FR-54 veil threshold derived from the
selected interval. Either way it needs declaring.

---

### Finding 8 — MEDIUM — AD-17's default makes the executive persona and success criterion #3 unreachable, and routing mesh is listed as an equal opening option

**Two separate problems in one AD.**

**(a) The safe default is safe past the point of the product's own use case.** AD-17 binds host mode on
`127.0.0.1` with `node.role == manager` placement. That means Portolan is reachable only from a shell
on the manager node itself. The PRD's third persona — "**the executive — a viewer, not a user**…
someone with no IT knowledge who **will open Portolan themselves** in order to show it in a management
meeting" — cannot do that. FR-51 (screen-side masking) exists only to serve that meeting. Success
criterion #2-bar item 3 — "Someone with no IT skills opens Portolan on a real cluster and can show its
shape to other people, **with the author not in the room**" — is the PRD's only test of the *one
picture, two readings* bar, and the default binding forbids it.

AD-18 partially anticipates this (a *not reachable* screen explaining the binding), which is a good
addition. But AD-18 explains the wall; it does not give the executive a door. The spine never names
the tension, and it is not an accepted cost anywhere.

**(b) One of the three named openings is the artefact NFR-2 forbids.** AD-17 writes: "The three ways to
open it up — routing mesh, internal overlay plus reverse proxy, VPN — are written as comments directly
above the line to uncomment." Routing mesh alone publishes the port on every node with no
authentication in front of it. NFR-2's own words: "Without it, v1 is an unauthenticated full-topology
viewer with one-click export, which is precisely the artefact the brief warned against." Listing it as
a peer of *reverse proxy* and *VPN* — in a comment a user uncomments — hands the user the failure mode
without flagging it. The other two mediate; this one does not.

**Fix direction.** The stack file's routing-mesh comment needs the warning inline, not just the option;
and the executive path needs a named, blessed route (the reverse-proxy option promoted from comment to
documented recommendation for FR-51's meeting scenario).

---

### Finding 9 — MEDIUM — AD-16 answers §7.3's socket question but claims NFR-3 is "met", which is the exact category error NFR-3 warns against

**NFR-3.** "Reading the cluster requires the Docker socket of a manager node, which is effectively root
over the entire swarm. Whether that socket can be mediated by a read-restricted proxy is an
architecture decision. **Read-only at the product level is a promise, not a mechanism**, and the
product never claims otherwise in its chrome — `:ro` on a socket mount does not restrict the Docker
API."

**AD-16's rule.** "Portolan mounts the manager socket directly. **NFR-3 is met by AD-15 in code**, not
by an external mechanism… A whitelist proxy is documented in the README as **optional** hardening."

**The problem.** AD-15's GET-only HTTP client is an in-process guard. It constrains what Portolan's own
code does; it does not constrain what anything with access to that socket can do, and a compromised or
extended process bypasses it by construction. That is the same class of assurance as `:ro` — a promise,
not a mechanism — which is precisely what NFR-3 says does not count. AD-16 is also consistent with FR-2
("the chrome states READ ONLY and makes no claim about the mechanism"), and the decision to skip the
sidecar is defensible on NFR-1 grounds. **The decision is fine; the claim is not.**

§7.3's stated consequence-if-left-open for this row is "Read-only stays an intention rather than an
enforcement." AD-16 leaves it exactly there — and records the outcome as a requirement met rather than
as an accepted cost. The PRD's §6 pattern ("named here so that no capability above reads as
unqualified") is the right home for it and gets no new row.

**Fix direction.** Rewrite AD-16's second sentence as an accepted cost: *the swarm-root blast radius is
accepted, unmediated, in exchange for NFR-1's single container; AD-15 reduces the surface of our own
code and nothing more.* Optionally add a CI/lint rule asserting no non-GET call site exists, which
would at least make AD-15 enforced rather than conventional.

---

### Finding 10 — MEDIUM — Of PRD §7.4's three deliberately-refused thresholds, only one is carried; FR-62 and FR-71's thresholds are silently dropped

**PRD §7.4** names three thresholds it refuses to invent, "each deferred here by name":

1. the text-size ceiling (FR-62, "set during design, not asserted here");
2. the object count above which the map goes still (FR-71, "established by measurement during design");
3. the light-palette tint collision (NFR-13, owner *design, before implementation of the palette*).

**The spine's Deferred table carries only #3** — and carries it excellently (AD-28 makes the build
start red and stay red until design corrects the palette, chosen knowingly over two softer options).

**#1 and #2 are dropped, and both FRs are bound.**

- **FR-62** is in the frontmatter binds. Its ceiling is not merely a design number: FR-62 says the
  ceiling "is whatever that specified behaviour can honestly carry" because "the left menu and the
  detail panel are fixed-width columns (FR-79)", and NFR-16 sets the outer viewport. Text-size range
  versus fixed-column overflow is an architectural constraint on the chrome, and AD-20 persists
  "text size" without any range, ceiling or overflow rule.
- **FR-71** is in the frontmatter binds and in the Capability Map's layout row. Its stillness threshold
  is the hinge of §6's heaviest accepted cost — "**On a large cluster the map stops being alive** —
  exactly the cluster where Portolan is most useful. Two users on two clusters see two different
  products." The spine builds the harness that would measure it (AD-29) and the hand-measurement
  procedure that would confirm it (AD-30), then never says the stillness count is an output of either,
  nor who owns writing it down, nor where it lives (token file? env var? derived at runtime from a
  measured frame budget?). AD-29 explicitly "sets no absolute threshold", which is right for a ratchet
  and leaves FR-71's one required absolute threshold with no producer.

---

### Finding 11 — MEDIUM — FR-63 is bound as a live requirement although the PRD declares it arithmetically impossible

**PRD §7.4, first and most severe item.** "**FR-63 cannot be satisfied in the space FR-78, FR-79 and
NFR-16 leave.** With the panel column reserved, the legend band's six columns are about 147px each; the
typographic specimen is 230px and must not wrap, and the zone column must enumerate up to eleven
networks where six swatches fit. Either the legend gets more room, fewer jobs, or a different shape.
**As written, the requirement is arithmetically impossible rather than merely hard.**"

**What the spine does.** FR-63 is in the frontmatter binds, alongside FR-78 and FR-79, with no
qualification. AD-10 assigns the legend band to React. Nothing anywhere records that the requirement
does not close, and there is no Deferred row for it.

A story author reading the spine will take FR-63 as buildable and discover the arithmetic themselves.
Since the resolution ("more room, fewer jobs, or a different shape") changes the chrome's column
budget, and the column budget is what produces AD-29's 884px operative canvas, this is not purely a
design matter — the outcome feeds back into the measurement the whole §7.1 apparatus depends on.

---

### Finding 12 — MEDIUM — §7.2 is handed back to product/design without a "Raised upstream" row

The spine's Deferred row reads: "**§7.2 — mark sizing at the landing level** — Not an architecture
decision. Four requirements (FR-11, FR-13, FR-66, FR-67) cannot all hold and choosing which yields costs
the product, not the code. Owner: product and design. … The user, asked for a leaning, answered honestly
that he did not have one — none is invented here."

Refusing to invent a leaning is right. But the PRD put this row in §7.3 **Carried to architecture**, and
the spine reassigns ownership back to the sender. The "Raised upstream" table exists for exactly this —
"Both need a PRD or UX-spine amendment so the documents do not silently diverge" — and this reassignment
is not in it. The PRD will continue to read as though architecture owns §7.2.

Secondary: the PRD names three candidate resolutions with their costs (drop marks at the landing level;
cut the reference population; give the landing level a smaller mark budget). The third —
"a fifth reading level in all but name" — has a real architectural shape (the scene's reading-level
model gains a level, which touches FR-15's ladder and FR-14's *zoom changes sharpness never
population*). The spine could have said which candidates the scene model can absorb without a redesign
and which cannot. It says nothing about any of them.

---

### Finding 13 — MEDIUM — NFR-17 (AGPLv3) lands as a dependency filter and loses the obligation that made it a product surface

**What the PRD requires.** NFR-17: "Licensed **AGPLv3**. The specific risk guarded against is someone
running Portolan **as a hosted service** without contributing back; AGPL closes exactly that while
remaining OSI-approved… **This is a deviation from a niche where permissive licensing dominates, and it
is deliberate.**"

**What the spine does.** Two mentions: the Stack table's "Licence | AGPLv3 — every dependency must be
AGPLv3-compatible (NFR-17)", and the layout-library Deferred row's "AGPLv3 compatibility is a hard
filter". AD-32 binds NFR-17 for CI and publication.

**Three things lost:**

1. **AGPL §13's network-interaction clause is the entire point of choosing AGPL over GPL** — a user
   interacting with the running instance over a network must be offered the corresponding source. That
   makes it a **product surface obligation**, not just a dependency filter: Portolan is a
   network-interactive web application, and something in the chrome must carry the source offer. No AD
   names it; the voice rules (FR-80/FR-81), the chart register and the no-teaching-screens rule (only
   FR-57 may teach) all constrain how that notice can be worded, and nobody has been told it is needed.
2. **The dependency-compatibility rule has no gate.** The spine gates contrast (AD-28), deuteranopia
   (AD-28), scene measures (AD-29), determinism (AD-8/AD-32) — and leaves "every dependency must be
   AGPLv3-compatible" as prose. It is the one hard filter in the Stack table with no CI enforcement,
   on a project that publishes images to two public registries (AD-32).
3. **Bundled non-code assets are outside the rule's reach.** NFR-4 requires fonts to be served from the
   image; the identifier face (NFR-20) must therefore be redistributable under an AGPL-compatible
   licence. "Every dependency" does not obviously cover a vendored font file.

---

### Finding 14 — MEDIUM — FR-14 and FR-39, the PRD's core separation of reading level from population, are unbound and ungoverned

**FR-14.** "**Zoom changes sharpness, never population. Filtering changes population, never sharpness.**
The set of objects present is identical at every zoom level."
**FR-39.** "Display controls change how present things are drawn; they never change the population."

These two sentences are the cleanest architectural statements in §3.2 — they assign *population* to the
model-plus-filter path and *sharpness* to the scene-plus-camera path, and they are the reason a reading
level can never be implemented as a level-of-detail cull. Both are **unbound and absent**.

The spine's AD-3 gets close ("view state has no write path into layout") but governs *movement*, not
*population*: it stops a filter from re-laying the map and says nothing about a zoom changing what
exists. AD-9's scene is "resolution-independent", which implies but does not state FR-14. A rasteriser
implementing zoom as a culling optimisation — the obvious performance move under NFR-8's 100ms budget
at 396 objects, and the move a Canvas2D-vs-WebGL measurement will push toward — would satisfy every AD
in the spine and break the PRD's stated invariant.

Related and also unbound: **FR-15**'s four reading levels appear only in a Capability Map cell; the
ladder itself (which labels drop at which level, and NFR-10's "a label that cannot meet its floor is not
rendered at that reading level — it is never shrunk to fit") has no AD. AD-9 says the scene carries
"text carrying its floor", which is the closest the spine comes.

---

### Finding 15 — MEDIUM — Selection, reachability and the invariant core are dropped from the binds and governed nowhere

Unbound and absent from every AD: **FR-22** (one gesture, two answers: panel opens *and* everything
transitively reachable lights), **FR-23** (hop reach one/two/all, **defaulting to one hop**, with the
arithmetic that at two hops more than 150 of 325 objects light), **FR-32** (*Keep only this* promotes
the highlight into a real filter, reusing the same hop reach), **FR-26** (clicking empty background
deselects; **selecting a duplicated rendering of an object selects the object, not the copy**),
**FR-27** (hover lifts the hovered contour and nothing else; nothing requires hover to be discovered),
**FR-28** (what is selectable and what is not), **FR-69** (every object has an *invariant core* — name,
identifier, mark rail — that no contour, stretch or motion may breach).

Three of these are genuinely architectural:

- **FR-22/FR-23/FR-32** require a transitive-closure traversal of the graph at interaction time, inside
  NFR-8's 100ms budget at 396 objects, with the result reaching the map surface — which AD-10 keeps out
  of React, so the traversal's output must travel through the AD-3 view-state store as a set of identity
  keys. That seam is implied and never stated, and the hop-reach default (FR-23's one hop) is the kind
  of default that gets lost between chrome and rasteriser.
- **FR-26**'s duplicate-rendering rule is a hit-testing requirement: in FR-40's disjoint-blob mode an
  object has echo copies, and the scene's hit surface must map every copy back to one AD-5 identity key.
  This is the one place the spine's identity model (AD-5) has a direct rendering consequence, and it is
  not drawn.
- **FR-69**'s invariant core is an assertable scene property in exactly AD-26's idiom (it is
  geometry, checkable in Node, no GPU) and AD-26's list — "contrast, type floors, stub length, body
  diameter and mark occupancy" — omits it.

---

### Finding 16 — LOW/MEDIUM — Quiet defaults and quiet exclusions lost

Each of these is small alone; together they are the class the prompt flagged.

| Lost | Where the PRD says it | Where it should have landed |
| --- | --- | --- |
| **Dark is the default** (FR-75) — and light "is not a fallback: it is the palette that survives the dense frame best" | §3.6 | AD-20 persists "light/dark" and never states the initial value. NFR-13's tint collision is *in the light palette*, which the PRD calls the better one — the spine's Deferred row reports the collision without that context. |
| **The product never implies the export is anonymous** (FR-52) | §3.9 | Unbound, absent. See Finding 3. |
| **French shipped in v1** (NFR-18) | §4.5 | AD-24 generalises to "a new language is a file"; AD-21 has a `default language` env var. Nothing commits French as a v1 deliverable, and the `i18n` package seed does not name it. |
| **NFR-15** — no screen-reader equivalent of the map, no keyboard traversal of the graph, no keyboard shortcuts | §5 | Range-bound only; named in no AD. *Structurally honoured by accident*: AD-10 keeps the map out of the React tree, which makes an accessible map hard to add — so the exclusion holds, but by side effect rather than by decision, and AD-31's "chassis controls tab-focusable" is the only positive half recorded. |
| **No 3D, perspective or isometry. Depth is stylistic, never spatial.** | §5 | Absent. A scene description with a z/depth field would satisfy every AD. |
| **No inventory surface** — FR-36's "no results list — that would be an inventory surface"; §1's "no dashboard, no metrics panel, no charts" | §1, §3.5 | Absent. AD-10 assigns search to React chrome with no statement of what search may *not* render. |
| **No manual refresh anywhere in the product** (FR-4) | §3.1 | AD-13 binds FR-4 but is about last-good-survey replay. AD-12's single server poll loop makes a refresh endpoint pointless, but nothing forbids one. |
| **Counter-metrics** (§2) — "long sessions are cost, not engagement"; "heavy filter use on first contact means the landing frame failed" | §2 | Absent. These imply no engagement instrumentation, and they are unmeasurable by construction — which is a deliberate product stance worth stating once, not an oversight to fix with telemetry. NFR-4 blocks external analytics; nothing blocks local. |
| **FR-10** — zone and outline are two grouping languages that must never read as the same mark | §3.2 | In a Capability Map range (`FR-6..FR-10`) only. §7.4 measures 455px of one stack outline running within 14px of an isoline, and rules that "a **contour** may never be displaced to buy clearance; only a zone *label* may move". That is a hard layout/scene constraint with a measurement attached, and no AD carries it. |
| **FR-35** orphan counter, **FR-37** image-tag search, **FR-83** search reaches filtered-out objects | §3.5 | FR-83 is bound but ungoverned; FR-35 and FR-37 unbound. FR-83's substance is a seam: search must index the *unfiltered* model while the scene shows the filtered one, and report a match as "found and filtered" — the PRD calls lying about what the cluster contains "the one thing Portolan exists not to do". |
| **FR-30/FR-31** filters remove; removing networks removes zones *and* attachment edges | §3.5 | Unbound. AD-3 mentions filters only as a non-relayout interaction. |

---

### Finding 17 — LOW — AD-23 makes the token file normative without carrying §7.5's warning about its source

AD-23 is a good decision and its "Raised to the UX spine" row is correctly filed. But the token file has
to be **populated from `DESIGN.md`**, and PRD §7.5 says of that document:

> **23 `[ASSUMPTION]` markers and 11 `[DEPARTS FROM BRIEF]` markers survive into the final text across
> the two documents**, and the UX log does not record which fix covers which finding… Treat an
> `[ASSUMPTION]` marker in either spine as genuinely undecided until someone decides it, not as a
> formality left behind.

The spine lists `DESIGN.md` and `EXPERIENCE.md` as sources with no caveat. Transcribing 142 colour
tokens from a document with 23 open assumptions and one known-broken palette, into the artefact that
becomes the single source of truth, is the moment those assumptions get frozen as decisions. AD-23
should carry the instruction to record provenance per token (decided / assumed / measured), so that
`[ASSUMPTION]`-derived values remain visibly undecided after the transcription.

Related: PRD §7.5 lists **eleven assumptions this PRD closes** and says "the spines should be read as
superseded on those points". The architecture spine cites all three documents as peer sources without
stating the precedence order. FR-66 (screen-space marks) is the sharpest case — `EXPERIENCE.md` marks
it *"Nobody decided this"*, the PRD decides it, and the spine binds FR-66 without noting that the UX
document still reads otherwise.

---

## 3. What landed well (so the fixes do not undo it)

Recorded because several findings above touch ADs that are otherwise right.

- **The three NFR-5 seams** are realised faithfully: AD-4's one shared model package, the dependency
  graph with no upward arrow, and the explicit restatement of NFR-6's three Docker-coupled surfaces.
- **AD-7's total ordering** catches a real defect the PRD never anticipated — Docker's `list` calls
  guarantee no order, and the spine notes the determinism test would not catch it. This is the spine
  adding value, not just recording.
- **AD-5 + AD-6 (identity as slot, silhouette seeded from it)** is a correctly reasoned departure from
  FR-13's literal text, with its cost named and a "Raised upstream" row. This is the model for how the
  other departures in this review should have been handled.
- **AD-11 through AD-14** settle staleness, replay and first-contact branching better than the PRD
  asked. AD-13's "a failed survey is a product state, never an absence of data" is the correct reading
  of FR-54, and AD-14's refusal to put FR-57 behind a timer is right.
- **AD-28's deliberate red build** on NFR-13's light-palette collision, chosen over two softer options,
  is the strongest single decision in the document.
- **AD-26 + AD-29 + AD-30** build real apparatus for §7.1 and refuse to invent the threshold the PRD
  refused to invent — including AD-30's admission that NFR-8 cannot honestly be a CI gate. The 884px
  operative canvas is the right number.
- **AD-27's fixture separation** (recorded payloads for the collector, generated clusters for scale,
  never mixed) directly serves FR-64's engine-variance problem.
- **The voice rules survive** — FR-80 and FR-81 both reach the Consistency Conventions table, including
  en-GB spelling and "never restate the health mark in words". This is the one quiet-requirement class
  the spine held onto, and AD-24 gives it a mechanism.

---

## 4. Recommended amendments, ordered

1. **AD-3** — restore FR-16's view-switch carve-out, and add §3.3 (FR-17–FR-21, FR-59, FR-73) to the
   Capability Map with a layout-mode input. *(Finding 1)*
2. **AD-2 / AD-8** — resolve the purity contradiction and name the incremental-placement
   responsibility; permit bounded transition state in the screen rasteriser for FR-16, FR-40, FR-53,
   FR-71. *(Finding 2)*
3. **New AD for masking** — where FR-49 substitutes, how FR-50's export default and FR-51's screen
   setting stay independent under AD-9, and where FR-52's honesty statement lives. *(Finding 3)*
4. **Bind NFR-16 explicitly** — 1440px floor into FR-60's trigger and AD-29's canvas derivation, the
   browser matrix into AD-31's scope and into the rasteriser deferral's revisit condition.
   *(Finding 4)*
5. **Bind NFR-20** — a Stack row for the identifier face, a named exception to AD-26 (or a Deferred row)
   for the §7.4 specimen verification, and the font's AGPL compatibility. *(Findings 5, 13)*
6. **Amend AD-20** — add motion (FR-61) and density (FR-42) to the preference list; add an AD for
   FR-45's decorative/explanatory partition reaching the rasteriser through view state. *(Finding 6)*
7. **Declare AD-12's departure from FR-5**, or change the display-cadence rule. *(Finding 7)*
8. **Add Deferred rows** for FR-62's text-size ceiling and FR-71's stillness count, each with an owner
   and a revisit condition; add a row or a flag for FR-63's impossibility. *(Findings 10, 11)*
9. **Add "Raised upstream" rows** for the §7.2 ownership reassignment and for AD-12 if kept.
   *(Findings 7, 12)*
10. **Rewrite AD-16's NFR-3 claim** as an accepted cost rather than a requirement met; warn inline on
    AD-17's routing-mesh comment and name the executive's blessed route. *(Findings 8, 9)*
11. **Replace the range bind** `NFR-1 … NFR-20` with an enumeration, and bind the 31 missing FRs or
    state why each is out of the spine's altitude.
