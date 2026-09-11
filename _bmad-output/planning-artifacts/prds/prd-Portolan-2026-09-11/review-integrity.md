---
title: "Mechanical integrity check — PRD: Portolan"
subject: _bmad-output/planning-artifacts/prds/prd-Portolan-2026-09-11/prd.md
date: 2026-09-11
kind: mechanical check (numbering, cross-references, figures, paths)
---

# Mechanical integrity check — `prd.md`

Scope: numbering integrity, every FR/NFR/§ citation, every numeric figure, every external path,
and referenced-but-undefined / defined-but-unreferenced requirements. Wording, tone and product
decisions are out of scope.

Where a figure or claim could be checked against the upstream documents named in §8, it was, and the
upstream line is quoted. The upstream files were used as evidence only, not reviewed.

**Headline counts**

| Check | Result |
| --- | --- |
| FR defined | 82 (FR-1 … FR-82, complete) |
| NFR defined | 20 (NFR-1 … NFR-20, complete) |
| Duplicate definitions | 0 |
| Undefined numbers in the stated ranges | 0 |
| Citation instances (FR-n / NFR-n) | 86 |
| Citations whose target does not exist | 0 |
| Citations whose target does not say what the citing text claims | 8 |
| Figure conflicts | 5 (2 material) |
| External paths that do not resolve | 0 (1 resolution note) |
| Requirements referenced but never defined | 0 |
| Requirements defined but never cited | 47 (≈7 where the prose implies a citation) |

---

## 1. Numbering integrity

**Clean. No defects.**

102 requirement definitions, extracted mechanically from lines matching `^- \*\*(N?FR)-\d+\*\*`.
No number is defined twice. No number in FR-1..FR-82 or NFR-1..NFR-20 is missing.

**FR defined (82):** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
73, 74, 75, 76, 77, 78, 79, 80, 81, 82.

**NFR defined (20):** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.

**Missing from FR-1..FR-82:** none.
**Missing from NFR-1..NFR-20:** none.
**Duplicates:** none.

Definition order is non-consecutive within sections, as §3 states ("a number is assigned once and
never reused, so within a section they may not run consecutively"). Per the brief, not reported as a
defect. For the record, the out-of-run insertions are: FR-64 in §3.1; FR-68, FR-82, FR-65, FR-67,
FR-66, FR-72, FR-70, FR-69, FR-71 in §3.2; FR-73 in §3.3; FR-79 in §3.4; FR-74 in §3.5; FR-75,
FR-61, FR-62 in §3.6; FR-76–FR-78, FR-63 in §3.7; FR-80, FR-81 in §3.8; NFR-19 in §4.3; NFR-20 in
§4.4. Every one of these is a definition in its topical section, which is the declared scheme.

---

## 2. Cross-references

All 86 FR/NFR citation instances resolve to a defined requirement, and all 13 `§n` citations resolve
to an existing section. The following 8 citations misstate their target.

### 2.1 [HIGH] FR-76 asserts the opposite of FR-29

> **FR-76** — … **Fit to chart must exist on screen**: it is the only route back to the
> whole-cluster frame, and **FR-29 leaves no keyboard route to it**.

> **FR-29** — Keyboard: **chrome controls take ordinary tab focus with a visible focus ring, in DOM
> order.** There are no keyboard shortcuts, no keyboard traversal of the graph, and no
> screen-reader equivalent of the map in v1.

FR-76 places *Fit to chart* in "A toolbar [that] sits above the canvas" — a chrome surface (§3.7 is
titled "Chrome surfaces"). FR-29 therefore *does* give it a keyboard route: ordinary tab focus.
NFR-15 states the same thing a third time: "Chrome controls remain tab-focusable (FR-29)."

The claim FR-29 supports is "no keyboard *shortcut* to it", not "no keyboard route".

### 2.2 [HIGH] NFR-6's "exactly two places" is contradicted by FR-64

> **NFR-6** — The UI couples to the collector in **exactly two places**, named here so a second
> collector knows what it changes: the rule that objects keep Docker vocabulary (FR-80), and the
> socket-unreachable screen (FR-57).

> **FR-64** — A minimum supported Docker Engine API version is declared and checked, and **the
> product says so plainly when the engine is older.**

FR-64 mandates a third UI surface whose content is Docker-Engine-specific, so a second collector
changes it too. FR-64 is not cited by NFR-6 — and is cited nowhere else in the document (see §5.2).

A fourth candidate, weaker: FR-3's interval set ("5s / 10s / 30s / 60s") is a collector-polling
surface, and FR-4's survey stamp reports collector state. FR-64 is the unambiguous case.

### 2.3 [HIGH] FR-11 says one family; NFR-14 documents two

> **FR-11** — … **Networks are the one family where colour alone is insufficient**; FR-65 supplies
> the rest.

> **NFR-14** — **Accepted and stated:** value-level colour separation is achieved for the
> object-type and health families (ΔE 20.5 and 18.7 under deuteranopia) and *not* for **the stack
> and network families (ΔE 3.9 and 2.6)**.

Two families fail value-level colour separation, not one. Only the network family is given a
supplementary channel (FR-65's octave pattern). NFR-14 says the stack family's identity is instead
"carried by written names — 6.6–7.8:1 on a stack outline", i.e. by FR-9's "name set on the stroke" —
but no requirement frames FR-9's name as the remedy for a colour insufficiency, and FR-11 denies the
insufficiency exists.

Upstream agrees with NFR-14 and against FR-11 —
`ux-designs/ux-Portolan-2026-09-10/DESIGN.md:789`:

> | **Stack** (6 + none) | ΔE **3.9** between values | **Partly repaired by the stack outline, and
> the repair must be described exactly.** … which stack, on the diamond, is colour and only colour,
> and that has not changed.

### 2.4 [MEDIUM] FR-72 cites NFR-12 for a claim NFR-12 does not make

> **FR-72** — The health mark is **blue / amber / red**, not green / amber / red. This is not a taste
> decision: it is what makes the health family **colour-safe under deuteranopia (NFR-12)**, and
> NFR-14's accounting depends on it.

> **NFR-12** — Colour never carries a dimension on its own: shape encodes the mark family (FR-11),
> so *which dimension you are reading* never depends on hue.

NFR-12 is about which *dimension* a reader is reading, and never mentions deuteranopia, colour
vision or value-level safety. The requirements that do are NFR-13 (zone tints under simulated
deuteranopia) and NFR-14 (per-family ΔE, including "health **18.7** … safe"). FR-72's second
citation, to NFR-14, is correct; the NFR-12 citation is not.

### 2.5 [MEDIUM] NFR-9 and §7.2 carry as open a question FR-66 and §7.4 declare closed

> **NFR-9** — Two rendering questions are carried to architecture, each with its consequence stated:
> **whether object marks scale with the body or stay fixed** within the screen-space rule of FR-66
> (as specified, both readings degrade the landing frame's encoding) …

> **FR-66** — **The reading ladder and every mark live in screen space.** Type and marks **do not
> scale with the canvas transform** …

> **§7.4** — Two of them are resolved by this PRD: **FR-66 decides the screen-space rule**, and
> FR-50 fixes the export masking default.

A mark that scales with the body scales with the canvas transform, because the body does (FR-14:
"Zoom changes sharpness, never population"; FR-66: "What scales with zoom is the map"). FR-66
therefore forecloses the first of NFR-9's two alternatives. §7.2 repeats the open framing: "The two
rendering questions of NFR-9 | Mark scaling degrades the landing frame's encoding either way".

Either NFR-9's first question is already answered by FR-66, or FR-66 does not mean what §7.4 says it
decides. The document asserts both.

### 2.6 [MEDIUM] §1 overstates what §7.1 reports

> **§1** — The one tool that rendered a real relational graph at production quality, Weave Scope,
> has been dead since 2023 — and it died with an **open** edge-legibility issue, **which is the same
> defect §7.1 reports as still unsolved here.**

> **§7.1** — *Portolan does not hairball; Weave Scope's grave is genuinely avoided* — **though that
> grave was an open edge-legibility issue, which is the same class of defect as what remains broken
> here.**

§7.1 reports edge legibility as **won**, not unsolved: "rendering networks as areas rather than edges
(FR-8) converts roughly 660 of ~700 edges into local stubs", and its verdict names a different axis —
"It does not survive as a map of *networks*, which is the product's primary axis." §7.1 claims only
"the same *class* of defect"; §1 claims "the same defect … still unsolved".

### 2.7 [LOW] §7.1 overstates FR-65

> **§7.1** — FR-65 **puts an exact network answer** back into the landing frame by riding the
> pattern on the zone field …

> **FR-65** — … This is the mitigation for the network-channel failure in §7.1, and **it is
> *partial*** — it separates octaves, not hues within an octave (NFR-14).

§7.1's next sentence concedes "none of them is proof" and "`DESIGN.md` calls the network channel
*partly repaired*", so the section self-corrects; the phrase "an exact network answer" does not
survive FR-65's own "*partial*".

### 2.8 [LOW] §1 calls §7.5's content the opposite of §7.5's title

> **§1** — The corresponding risk — whether the platform outlives the tool — **is in §7.5, and it is
> a dependency, not a counter-argument.**

§7.5 is titled **"Standing counter-arguments, retained on purpose"**. The substance agrees — §7.5's
own bullet reads "Swarm's platform longevity is **an unresolved dependency**, not a product
decision" — so only the section label collides with the citing sentence.

### 2.9 Citations verified correct

The remaining 78 citation instances check out. Spot-verified against upstream, including the two
easiest to get wrong:

- **FR-23 and §8 on `EXPERIENCE.md` Flow 1 step 7** — "where the user reduces a wider reach to one
  hop". Verified verbatim, `EXPERIENCE.md:344` (Flow 1, step 7): "The reach is wider than he wants,
  **so he pulls it to one hop**, then presses **Keep only this**". Accurate, including that the
  narration is a reduction *to* one hop rather than a default.
- **FR-51 and §8 on `DESIGN.md` scoping masking to the export** — verified, `DESIGN.md:849`: "the
  mask touches **only the exported frame**, so the screen a colleague reads over a shoulder is
  unchanged". Accurate.
- **§7.3 on EXPERIENCE.md's rule about what may move** — "A **contour** may never be displaced to
  buy clearance; only a zone *label* may move". Verified, `EXPERIENCE.md:157`: "The zone owns
  position and the outline derives it, so neither of them moves; the zone label, a free annotation
  inside its field …".
- **NFR-13's "Two of them currently simulate to a byte-identical value"** — verified, and correctly
  attributed to the light palette. `review-accessibility.md:54`: "Light palette is worse: … zone
  tints `t1`/`t3` simulate to **ΔE 0.0** — byte-identical after deuteranopia."
- **§6 tags** — FR-7's, FR-74's and FR-47's "Accepted cost, §6" each have a matching §6 row.
- **All 13 `§n` citations** resolve: §1, §6 (×3), §7.1 (×2), §7.5 (×2), §8 (×4) — all exist and all
  contain what the citing text claims, except 2.6 and 2.8 above.

---

## 3. Figure consistency

### 3.1 [HIGH] §7.1 compares a diameter against a radius

> **§7.1** — Bodies land at **14–28px against a 46px nominal**.

The two figures are not the same measure.

- 46px is a **radius**. `DESIGN.md:421`, under `shape.bubble.radius`: `container: '46px'` (with
  `service: '54px'`, `volume: '32px'`). Nominal container **diameter is 92px**.
- 14–28px is a **diameter**. `DESIGN.md:859`: "the real body computes to **14–28px across**"; and
  `review-legibility-at-scale.md:63`: "**the real body is 14–28px across**".

The PRD's sentence therefore understates the shortfall by a factor of 2. Upstream states it with the
unit attached — `review-legibility-at-scale.md:63`: "A **48px-radius** body is off by a factor of
five", and `review-legibility-at-scale.md:197`: "specified for a **96px body**".

**Consequence — the correction also settles FR-66's figure.** FR-66 states:

> Without this, **a 9.5px label renders at roughly 2.4px** in the very frame the product is judged
> on and NFR-10 means nothing.

Under §7.1 as written (14–28px against a 46px nominal), the landing scale is 0.30–0.61, so a 9.5px
label would render at **2.9–5.8px**, not 2.4px. Under the corrected reading (14–28px against a 92px
nominal), the scale is 0.15–0.30 and the label renders at **1.4–2.9px**, which contains 2.4px.

The 2.4px figure is itself faithfully carried from upstream — `EXPERIENCE.md:63`: "world-space type
would put a 9.5px label at **about 2.4px** on the very frame the product is judged on". So FR-66 is
right and §7.1's nominal is the error. 9.5px is also correct: `DESIGN.md:225` `fontSize: 9.5px`,
`DESIGN.md:810` "`{typography.zone-label}` at 9.5px / 0.26em".

### 3.2 [HIGH] The reference cluster carries two object totals: 396 and 325

> **NFR-7** — The reference cluster the product must hold is a few hundred objects: **6 nodes,
> 14 stacks, 40 services, 300 containers, 11 overlay networks, 25 volumes**, at ~2.2 networks per
> container.

That enumeration sums to **396 objects** (6 + 14 + 40 + 300 + 11 + 25).

> **FR-23** — At two hops, **more than 150 of 325 objects** light on a realistic cluster …

> **NFR-8** — … continuous motion (FR-71) re-tessellates on the order of 9,000 Bézier segments per
> frame **across 325 bodies** …

325 is containers (300) + volumes (25) only. It excludes the 40 services and the 6 nodes. FR-23
calls the figure "objects" and NFR-8 calls it "bodies" — two different words for one number, neither
matching NFR-7's total.

Upstream is explicit that 325 is a floor chosen for favourability, and that it is not the honest
bubble count — `review-legibility-at-scale.md:31`:

> **Bubble count.** Containers (300) + volumes (25) = **325** floor. **Services are selectable
> objects with a type-pastille value, so the honest figure is 365.** Every computation below is run
> at 325 — **the number most favourable to the design** — with the 365 figure quoted where it
> changes the reading.

The PRD carries 325 forward and drops that caveat. Within the PRD, services must be bodies:
FR-28 ("**Every bubble** … is selectable") and FR-15 (reading level 2 is "service names") make
services bubbles, and FR-11 gives every object a mark rail. So 325 cannot be the PRD's own body
count, and 150/325 cannot be its own highlight fraction — at 365 bodies the fraction is 150/365, and
against NFR-7's 396 objects it is 150/396.

### 3.3 [MEDIUM] NFR-11's "identifier channel" is undefined, and NFR-14 reports a figure below its floor

> **NFR-11** — Contrast floors: **7:1 for the identifier channel**, 4.5:1 for chassis text and marks
> (4:1 for health) … **Three states are exempt and the exemption is deliberate:** the staleness veil
> (FR-54) …; the reachability dim (FR-33) …; and the empty-filter pale context (FR-34).

> **NFR-14** — Their identity is carried by written names — **6.6–7.8:1 on a stack outline**, 13.8:1
> for a zone label …

6.6:1 is below 7:1. NFR-11 names exactly three exemptions and this is not among them. The PRD never
states which names belong to "the identifier channel", while FR-9 puts a stack's "name set on the
stroke", FR-80 says object names stay "what an admin would type", and NFR-20 says "**Identifiers**
are set in a monospaced face" — so a reader working from the PRD alone cannot tell whether NFR-14
reports a breach of NFR-11.

Upstream resolves it, and the answer is that there is no breach: `DESIGN.md:723-725` assigns the 7:1
floor to exactly three rows — "Identifier on bubble body", "Bubble name on bubble body", "Protrusion
plate text on plate" — and `DESIGN.md:731` gives "Stack name on the outline | … **6.6 – 7.8** /
6.2 – 7.1 | **4.5:1**", which 6.6:1 clears.

So this is an under-specification in the PRD, not a real contrast failure — but it is not checkable
from the PRD, which is the defect.

### 3.4 [MEDIUM] FR-16's "nothing else, ever" collides with FR-17 / FR-19 / FR-73

> **FR-16** — **Positions are earned and kept.** … **Exactly three user actions may relay the map —
> *Reorganise*, switching zone mode, toggling the node backdrop — and nothing else, ever.**

> **FR-17** — Three views, switched from a bottom tab bar. **A tab switch is a complete change of
> view, not a filter.**

> **FR-19** — Node view puts the machines in the foreground … **Network zones and stack outlines are
> not drawn here.**

> **FR-73** — In node view a machine's region is drawn **proportionally to what it carries** …

A tab switch is a user action that produces a different arrangement of the same objects — zones and
outlines gone, machines sized by load. Under FR-16's literal wording that is a fourth relayout
trigger. (A counter-reading exists: each view holds its own layout, so switching does not "relay"
one map. FR-16's absolute phrasing does not admit it, and nothing in the PRD says views hold
independent layouts.)

Upstream makes the narrower claim, scoped by purpose and to one surface —
`EXPERIENCE.md:183`: "*Reorganise* … **The only control whose purpose is to move earned positions**
— the zone-mode switch and the node-backdrop toggle move them too, but as the [consequence]". The
PRD hardened "the only control whose *purpose*" into an exhaustive prohibition.

Secondary candidates under the same wording, not resolved by the PRD: FR-42's density control ("Text
size and density are separate first-class controls") plausibly changes spacing and therefore
positions; FR-30/FR-32's filters remove objects, and FR-38's "Search … never relays the map" implies
that something adjacent does.

### 3.5 [LOW] FR-47's WYSIWYG clause vs the FR-50 / FR-51 defaults

> **FR-47** — **Export is what-you-see-is-what-you-get**: current framing, current zoom and active
> filters are respected literally.

> **FR-50** — Masking is available for the export, **on by default.**

> **FR-51** — Masking is **also available for the screen** … **Off by default** … The screen and
> export settings are independent: turning one on does not turn the other on.

With both defaults in force the exported frame differs from the screen: addresses visible on screen,
masked in the export. FR-47's enumeration covers only framing, zoom and filters, so the collision is
with its headline clause rather than its list.

Upstream names this cost explicitly; the PRD does not — `EXPERIENCE.md:207`: "*Cost — the default
narrows* what you see is what you get. **The default export is no longer byte-identical to the
screen.**"

### 3.6 Figures verified consistent

Every other numeric pair in the document was collected and checked. All consistent:

| Figure | Cross-check |
| --- | --- |
| FR-68 "Roughly 94% of the graph's edges are stubs" | §7.1 "roughly 660 of ~700 edges" → 660/700 = 94.3% ✓ |
| §7.1 "about 40 long edges" | 700 − 660 = 40 ✓; upstream "~660 invisible attachment stubs, ~40 brass mount curves" ✓ |
| §7.1 660 stubs | NFR-7 "300 containers … ~2.2 networks per container" → 300 × 2.2 = 660 ✓ |
| §7.1 "some five expected crossings" | upstream `review-legibility-at-scale.md:143` "C(40,2) = 780 pairs × p ≈ 0.007 → ≈ 5" ✓ |
| §7.1 stub "falls to about 2px" vs FR-68 "never … shorter than **6px**" | problem and floor, not a conflict — §7.1 says so ✓ |
| FR-70 "+32% of base radius" | `DESIGN.md:407` `max: '+32% of base radius'`, `cap: '+32% total'` ✓ |
| FR-67 "never render below **8 × 8px**" | `DESIGN.md:426` `min-size: '8 × 8px — THE MARK FLOOR'` ✓ |
| FR-67 badge-drop rule | `DESIGN.md:428` "network badges drop from the right of the network group … THE RAIL NEVER BREACHES THE CORE" ✓ verbatim |
| §7.3 "roughly 6px of interior next to as many as five other marks" | `DESIGN.md:429` service capacity at the 8px floor = 6 marks ✓ (6 marks exceed a container's 5, but fit a service) |
| NFR-10 9px / 8px type floors | `EXPERIENCE.md:63` `floor-object` 9px, `floor-chassis` 8px ✓ |
| FR-62 "current +15% ceiling" | `EXPERIENCE.md:296` steps "0.90 / 1.00 / 1.15"; `:316` "its ceiling is +15%" ✓ |
| NFR-11 7:1 / 4.5:1 / 4:1 health / 3:1 edges / 3:1 focus ring | all five match `DESIGN.md:723–747` floors ✓ |
| NFR-11 "text holds above 4.2:1" under the veil; "4:1 for health" | internally consistent; health row measures 4.2–6.3 at a 4:1 floor ✓ |
| NFR-14 ΔE 20.5 / 18.7 / 3.9 / 2.6 | `validation-report.md:57` and `DESIGN.md:788-789` ✓ all four |
| NFR-14 13.8:1 zone label, 6.6–7.8:1 stack outline | `DESIGN.md:788`, `DESIGN.md:731` ✓ |
| §7.3 455px of 1140px, 346px of 1961px, within 14px | `DESIGN.md:992` ✓ verbatim; 455/1140 = 39.9% and 346/1961 = 17.6% match its "40% … 18%" ✓ |
| §7.3 clearance "4.9px and 0.8px" | UX memlog entry: "FRONTEND … best clearance 4.9px"; "MONITORING … best in the whole field 0.8px" ✓ |
| NFR-8 "on the order of 9,000 Bézier segments" | upstream "re-tessellating ~9,100 Bézier segments" ✓ ("on the order of") |
| FR-3 "5s / 10s / 30s / 60s, defaulting to 10s" | four steps, upstream `EXPERIENCE.md:185` ✓; §8's "reaches **60s**" vs the brief's "every 5–10s" ✓ |
| FR-4 "Surveyed 4 min ago" | exceeds the 60s max interval, consistent with FR-5 / FR-54 staleness ✓ |
| NFR-16 / FR-60 / §5 "1440px" | three mentions, all identical ✓ |
| §1 "since 2017" and "copyable for nine years" | 2026 − 2017 = 9 ✓; `brief.md:44` Portainer #506 (2017) ✓ |
| §7.5 "at least 2030" pledge predates the acquisition | `addendum.md:122` pledge dated 2025-07-01, acquisition closed 2026-08-04 ✓ |
| §7.5 "MKE 3.9 in March 2028" | `addendum.md:125` "3.9 on 2028-03-24" ✓ |
| §7.5 "proxies disagree by 3.4×" | `addendum.md:17, 182, 187` ✓ |
| §8 "142 colour tokens" | 142 keys in DESIGN.md's `colors:` block (lines 17–195) ✓ exact |
| §8 "28 components" | 28 keys in DESIGN.md's `components:` block ✓ exact (its prose list of 30 adds two non-token entries) |
| §7.4 / §8 "78 consolidated findings" | `validation-report.md:26, 373` "**78 consolidated findings**" ✓ |
| §7.4 "11 to 12 `[ASSUMPTION]` … 5 to 6 `[DEPARTS FROM BRIEF]`" | counted, excluding each file's marker-convention line: DESIGN.md 12 / 6, EXPERIENCE.md 11 / 5 ✓ exactly the stated ranges |
| §7.4 "Both are `status: final`" / "four review lenses" | both frontmatters say `status: final` ✓; `validation-report.md:26` "four reports (rubric 30, legibility-at-scale 16, brief-fidelity 16, accessibility 22)" ✓ |
| Dates: frontmatter 2026-09-11, brief 2026-09-09, UX 2026-09-10, §8 "Decided 2026-09-11" | ordered and consistent ✓ |

---

## 4. External document references

**All five referenced paths exist.** No bad paths.

| Referenced in §8 | Exists |
| --- | --- |
| `briefs/brief-Portolan-2026-09-09/brief.md` | yes |
| `briefs/brief-Portolan-2026-09-09/addendum.md` | yes |
| `ux-designs/ux-Portolan-2026-09-10/DESIGN.md` | yes |
| `ux-designs/ux-Portolan-2026-09-10/EXPERIENCE.md` | yes |
| `ux-designs/ux-Portolan-2026-09-10/validation-report.md` | yes |

"and the review files" (§8, last row) is unenumerated; six exist —
`review-accessibility.md`, `review-brief-fidelity.md`, `review-editorial-design.md`,
`review-editorial-experience.md`, `review-legibility-at-scale.md`, `review-rubric.md`.

**[LOW] Resolution note.** The five paths resolve only from `_bmad-output/planning-artifacts/`, not
from the PRD's own directory. A reader resolving `briefs/brief-Portolan-2026-09-09/brief.md`
relative to `prd.md` finds nothing; the path relative to `prd.md` is
`../../briefs/brief-Portolan-2026-09-09/brief.md`, which is the form `DESIGN.md`'s own frontmatter
uses (`sources: ../../briefs/…`).

The bare-filename references — `addendum.md` (×2, §1 and FR-64), `DESIGN.md` (×6),
`EXPERIENCE.md` (×4) — are resolved by the §8 table, which §1, FR-23 and FR-51 each point to
explicitly ("see §8" / "(§8)"). FR-64's and FR-67's bare mentions do not, but they are unambiguous.

Content claims about those files were spot-checked and hold, including FR-64's two engine behaviours
(`addendum.md:126` "Engine 29's nftables backend cannot be enabled in Swarm mode";
`addendum.md:128` "moby #51491, DNS broken after `swarm init`"), NFR-17's AGPLv3 reasoning and
Grafana precedent (`brief.md:134-138`), and NFR-18's language rule (`EXPERIENCE.md:25` "UI is
**English** … Strings externalised from the first commit; French shipped").

One framing note, [LOW]: FR-64 says those two behaviours "**affect what the collector can read**".
The addendum records them under "Four caveats that matter more than the commit activity" in its
Swarm-longevity section — as evidence that upstream is dropping Swarm, not as collector-read
constraints. The path claim ("recorded in `addendum.md`") is correct; the characterisation is the
PRD's own.

---

## 5. Referenced but never defined / defined but never referenced

### 5.1 Referenced but never defined

**None.** Every one of the 86 FR/NFR citations resolves to a definition, including the range
citation `FR-46–FR-52` in §8 (all seven defined).

### 5.2 Defined but never cited, where the prose implies a citation

47 of the 102 requirements are never cited. Most are legitimately self-standing. These are the cases
where the document's own prose leans on a requirement without naming it:

1. **FR-64 — cited nowhere, and NFR-6 is where it belongs.** See 2.2. This is the one omission that
   makes a stated claim false rather than merely loose.
2. **NFR-11 — cited nowhere, yet alluded to four times.** FR-43 "so **the contrast floors** stay a
   property the product can guarantee"; NFR-9 "the entire **≥3:1 edge guarantee** rests"; §7.2
   "without the luminance clamp **the ≥3:1 edge floor** is not a real guarantee"; NFR-14's and
   NFR-13's figures are measured against it. The most-alluded-to requirement in the document is
   never cited by number.
3. **FR-16 — cited nowhere, yet restated four times.** FR-40 "Switching **relays the map**"; FR-41
   "reimposes the node partition and **relays the map**"; FR-79 "opening it **never relays** or
   reframes the map"; FR-38 "Search removes nothing and **never relays the map**". The rule these
   four defer to is FR-16, and its collision with FR-17 (3.4) sits exactly in that gap.
4. **FR-15 — cited nowhere, yet its frame is used three times.** FR-15 owns "Each of the primary
   journey's **three discoveries** is found at a different level"; NFR-14 invokes "**the second** of
   the primary journey's three discoveries" and NFR-20 "the primary journey's **third** discovery",
   neither citing FR-15. §7.1's "switched off at that level by **the reading ladder**" is FR-15 plus
   FR-66, uncited.
5. **NFR-13 and FR-75 assert the same fact independently, neither citing the other.** FR-75: "it is
   the palette that **survives the dense frame best**". NFR-13: "**the light palette is the one that
   holds the dense frame best**".
6. **FR-69 and FR-70 complete FR-13, which cites neither.** FR-13 states "the body stretches toward
   the objects it links to" (capped by FR-70) and "Bubbles never fuse and never overlap — the layout
   reserves the deformed hull" (whose size FR-70's +32% sets). §6's row "Fewer objects fit than
   circle packing would allow, because the layout reserves the deformed hull" is attributed to FR-13
   alone.
7. **FR-2 is restated by NFR-3 and by §1, uncited.** NFR-3: "Read-only at the product level is a
   promise, not a mechanism, and **the product never claims otherwise in its chrome**" — that is
   FR-2's second sentence. §1: "**No write, management or remediation action exists anywhere in the
   product.**"

Lesser instances, listed for completeness: FR-22 (FR-23's "that highlight" and FR-36's "exactly as a
click would" both refer to it); FR-77 (defines the state vocabulary FR-76's chips use); FR-32 (§6's
reach row cites FR-23 only, though FR-32 reuses the same reach); FR-52 (the natural citation for
§8's export-departure row).

**[LOW] One incomplete enumeration.** FR-61 says motion "joins **text size, density, theme and zone
mode** as a display control". FR-43 (palette) and FR-41 (node backdrop) are also display controls by
FR-39's definition, and are absent from that list. This is inherited verbatim from
`review-legibility-at-scale.md:166` ("text size, density, theme and zone mode are all display
controls; *still the chart* is not"); `EXPERIENCE.md:192` gives the full six.

**Asymmetric §6 tagging, no defect.** FR-7, FR-74 and FR-47 carry "Accepted cost, §6" in their own
text and FR-82 states its cost inline; FR-40, FR-13, FR-23 and NFR-4 have §6 rows but no such tag.

### 5.3 Never cited, and no citation implied

FR-1, FR-5, FR-6, FR-10, FR-14, FR-17, FR-18, FR-20, FR-21, FR-24, FR-26, FR-27, FR-28, FR-31,
FR-36, FR-39, FR-42, FR-44, FR-45, FR-55, FR-56, FR-58, FR-59, FR-60, FR-62, FR-73, FR-76, FR-81,
NFR-1, NFR-17, NFR-18. Each stands alone; not reported.

---

## 6. Defect summary

| # | Severity | Location | Defect |
| --- | --- | --- | --- |
| 3.1 | HIGH | §7.1 | "14–28px against a 46px nominal" compares a diameter to a radius; nominal diameter is 92px |
| 3.2 | HIGH | NFR-7 / FR-23 / NFR-8 | one reference cluster, two totals: NFR-7 sums to 396 objects, FR-23 and NFR-8 use 325 (containers + volumes only) |
| 2.1 | HIGH | FR-76 | "FR-29 leaves no keyboard route to it" — FR-29 gives chrome controls tab focus, as NFR-15 restates |
| 2.2 | HIGH | NFR-6 | "exactly two places" omits FR-64's engine-version notice, a third collector-coupled UI surface |
| 2.3 | HIGH | FR-11 | "Networks are the one family where colour alone is insufficient" — NFR-14 documents two (stack ΔE 3.9, network ΔE 2.6) |
| 2.4 | MEDIUM | FR-72 | cites NFR-12 for deuteranopia colour-safety; NFR-12 never mentions it (NFR-13/NFR-14 do) |
| 2.5 | MEDIUM | NFR-9 / §7.2 vs FR-66 / §7.4 | mark-scaling carried as open, while FR-66 decides it and §7.4 lists it as resolved |
| 3.3 | MEDIUM | NFR-11 / NFR-14 | "identifier channel" never defined; NFR-14's 6.6:1 sits below NFR-11's 7:1 with no exemption |
| 3.4 | MEDIUM | FR-16 vs FR-17 / FR-19 / FR-73 | "Exactly three … and nothing else, ever" vs a tab switch that redraws the arrangement |
| 2.6 | MEDIUM | §1 | "the same defect §7.1 reports as still unsolved" — §7.1 reports edges as won and names the network channel |
| 3.5 | LOW | FR-47 vs FR-50 / FR-51 | "what-you-see-is-what-you-get" vs export masking on by default and screen masking off |
| 2.7 | LOW | §7.1 | "an exact network answer" vs FR-65's "it is *partial*" |
| 2.8 | LOW | §1 | calls §7.5's content "not a counter-argument"; §7.5 is titled "Standing counter-arguments" |
| 4 | LOW | §8 | paths resolve from `planning-artifacts/`, not from the PRD's directory |
| 4 | LOW | FR-64 | "affect what the collector can read" — the addendum records both as Swarm-longevity caveats |
| 5.2 | LOW | FR-61 | display-control list omits palette (FR-43) and node backdrop (FR-41) |

Clean: numbering (0 defects), citation resolution (0 broken targets), external paths (0 missing),
referenced-but-undefined (0).
