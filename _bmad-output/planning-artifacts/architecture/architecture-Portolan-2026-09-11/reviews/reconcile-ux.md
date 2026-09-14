---
name: 'Portolan — UX reconciliation against the architecture spine'
type: reconciliation-review
status: draft
created: '2026-09-14'
subject: '_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md'
inputs:
  - '_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/DESIGN.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-Portolan-2026-09-10/EXPERIENCE.md'
---

# What did not land — the two UX spines against ARCHITECTURE-SPINE.md

**Verdict.** The spine reads the two UX documents as a bag of *values* and a bag of *screens*. What
it dropped is the third thing they actually are: a bag of **rules** — geometric, compositional,
temporal and lexical — that are normative, are not tokens, are not components, and after AD-23 and
AD-31 have no normative home anywhere in the project. Four consequences are load-bearing enough to
change AD text rather than be footnoted: the token file as scoped cannot carry what AD-28 and AD-29
must import from it; AD-9 and AD-10 together make a compliant FR-48 export impossible; the *one
stateful stage* claim does not survive contact with the motion specification; and AD-8's layout
signature cannot express FR-16 or the enter/exit lifecycle it is supposed to guarantee.

This review reports gaps only. Where the spine got something right that the reader might expect to
see flagged, it is said so explicitly (§7).

---

## 1. AD-23 — what the token file must carry, and what it cannot carry at all

AD-23's rule says: *"One file in the repository holds the colour, geometry, type and spacing
tokens… `DESIGN.md` stops being normative on **values** and becomes the documentation of intent."*
The Structural Seed repeats the same four words: `tokens/ # colour, geometry, type, spacing`.

`DESIGN.md`'s frontmatter has **twelve** top-level namespaces, not four. Its own preamble says so in
as many words: the canonical spec keys are `colors`, `typography`, `rounded`, `spacing`,
`components`, and *"seven further top-level namespaces are an **extension**: `motion`, `elevation`,
`opacity`, `stroke`, `shape`, `density`, `layout`. The spec has no home for any of them, and all
seven are load-bearing."*

AD-23 names four of the twelve. The other eight are, as written, orphaned the moment `DESIGN.md`
stops being normative on values.

### 1.1 What the token file must carry beyond colour — enumerated

| Namespace | Why the token file must hold it | Which AD depends on it |
|---|---|---|
| `typography` (12 roles) | Each role's family, size, tracking, line height, case, and — separately — the **two floors** (`floor-object` 9px, `floor-chassis` 8px) and the three-step `scale` (0.90 / 1.00 / 1.15). | AD-26 asserts "type floors" against the scene; AD-28 is a blocking gate. Neither can run without the per-role floor assignment. |
| `stroke` | `edge.width` 1.6px, `edge.attach` 0.9px dasharray `2 4`, **`edge.attach-min-length` 6px**, `edge.mount` 1.6px, `zone.isoline` 3.5px / `0.8 9`, `zone.blob` 1px, `stack-outline` 1.25px, `hairline` 0.75px, `contour` 1px, `contour-inner` 0.7px at 0.87r, `band-divider` 0.8px, `focus` 2px / 2px offset. | AD-29 ratchets **stub-length distribution** — that measure is `{stroke.edge.attach-min-length}` and nothing else. AD-28's 3:1 edge floors are a property of a *colour on a width*, not a colour alone. |
| `opacity` | `dim.unreachable` 0.18, `dim.filter-context` 0.10, `echo` 0.55, `reticle-fine` 0.55, `reticle-coarse` 0.80, `zone-isoline` 1.00, and **`zone-field-cap`** — the luminance clamp. | AD-28's three named exemptions *are* three of these numbers. The Deferred table says the clamp value will be *"written into the AD-23 token file where AD-28 will guard it"* — so the spine already assumes `opacity` is in the token file while AD-23's own enumeration excludes it. |
| `elevation` | `bubble.dark` (`dy 0.11r`, `σ 0.15r`, `#000 @ 0.90`, capped `dy 5` / `σ 7`), `dark-small`, the **30px diameter floor**, `light: none`, `halo`, `panel`. | AD-29 ratchets **rendered body diameter**; the elevation floor is keyed to that same measure. Two tokens read the same number and must not drift apart. |
| `shape` | Silhouette (28-point closed cubic Bézier, ±11% amplitude, the seed rule), deform (+32% cap, cos² falloff over ±38°, teardrop degenerate case, **no squash**, hull reservation), core (0.59w × 0.50h, `rounded.lg`), radii (service 54 / container 46 / volume 32), pastille geometry (10px nominal, **8px floor**, 3px gap, four shapes, fixed order), `stack-outline` geometry, **`network-octave`** (four patterns, hue-and-coverage-only constraint). | AD-8 requires *"the deformed hull reserved **before** placement"* — the hull is `{shape.bubble.deform}` plus `{spacing.cell-clearance}`; layout cannot compute it without these tokens. AD-26 asserts **mark occupancy as a fraction of the body** — that is `{shape.pastille.*}` over `{shape.bubble.radius.*}`. |
| `density` | `scale` 0.85 / 1.00 / 1.20 and — critically — its `affects` list: *bubble radii, gutter, cell-clearance, zone padding*. | This is a **layout input**, see §3.4. |
| `layout` | `min-width` 1440px, **`canvas-min` 884px**, the three-column split `236 \| canvas \| 320`. | AD-29 hard-codes *"the **884px operative canvas**"* in prose instead of importing `{layout.canvas-min}`. AD-29's ratchet is therefore keyed to a literal the token file already owns — exactly the transcription failure AD-23 exists to prevent. |
| `rounded` | `sm` 1 / `DEFAULT` 2 / `md` 3 / `lg` 6 / `full`, plus the rule *"bubbles have no radius — they are paths, not boxes."* | Chrome and scene both consume it. |
| `motion` | See §3. Motion is the namespace AD-23 most obviously cannot hold, and §3 is about why. |
| `spacing` | Named by AD-23 — but note `gutter`, `cell-clearance` and `bezel` are **layout inputs**, not CSS gaps, and the rest (`left-menu` 236, `detail-panel` 320, `tab-bar` 56, `toolbar` 40, `chart-legend` 120) are chrome dimensions that AD-29's 884px arithmetic is derived from. One namespace, two consumers on opposite sides of the AD-10 seam. |

**Recommendation for AD-23's rule sentence:** replace *"colour, geometry, type and spacing"* with an
enumeration of all twelve namespaces by name, or with *"every top-level namespace in `DESIGN.md`'s
frontmatter, including its seven declared extensions."* The current wording is not shorthand — it is
a scope, and three CI gates import from it.

### 1.2 The larger problem: `DESIGN.md` is normative on things that are not values

AD-23's accepted cost is stated as narrow — `DESIGN.md` loses normativity *on values*. But a large
fraction of `DESIGN.md`'s binding content is not a value, is not expressible as a token, and has no
other owner in the spine. Under AD-23 as written, all of it becomes "documentation of intent," which
is to say advisory.

**(a) Geometric and compositional algorithms.** These are procedures, not numbers:

- **Pastille rail fitting** — *"rail width = n·size + (n−1)·gap, and it must fit the core's width.
  The rail shrinks uniformly to fit, down to `min-size`; if it still does not fit, network badges
  drop **from the right of the network group** until it does. **THE RAIL NEVER BREACHES THE CORE.**"*
  Three tokens plus a four-step algorithm plus an invariant. Only the tokens survive AD-23.
- **Hull reservation** — *"the layout reserves the deformed hull + `{spacing.cell-clearance}`;
  stretched silhouettes never overlap."* AD-8 references this correctly but does not own it.
- **The invariant core rule** — *"the contour may never cross the invariant core rectangle"*, and the
  core is *"never deformed, never rotated, never rescaled by `{motion.breathe}`."* This is **FR-69**,
  which the spine does not bind anywhere. It is the single geometric guarantee behind *"labels and
  click targets never travel"* — the claim `EXPERIENCE.md`'s Accessibility Floor rests its whole
  motion argument on.
- **The type scale clamp** — *"the scale multiplies, then **CLAMPS** at the role's own floor."* An
  operation over tokens, and the thing that makes the 9px/8px claims true at 0.90.
- **Label collision resolution** — *"An exhaustive search on a 2px grid moved `BACKEND` 18px into
  clear space… Nothing in this file is permitted to resolve a label collision by displacing a
  contour."* This is a layout sub-problem with a stated algorithm, a stated failure mode (two of
  three labels had nowhere to go) and a stated prohibition. It has no package, no AD and no test.
- **Stack-outline routing** — *"it threads around intervening non-members where the layout leaves
  room; where it cannot, it encloses them"*, and the hull is *"struck at a constant
  `{spacing.cell-clearance}` outside the reserved cells of the stack's members, every turn
  radiused — an equidistant, drafted curve."* A derived-geometry procedure (FR-82, which the spine
  *does* bind, but only to `model` in the capability map — it is a layout/scene output).

**(b) Layer order.** `DESIGN.md` → *Elevation & Depth* fixes a twelve-item z-order:

> node backdrop bands → reticle → graduated bezel → zone tint fields and their octave patterns →
> zone isolines → **stack outlines and their labels** → edges → bubble shadows → bubble bodies →
> protrusion plates → core and pastille rail → selection halo.

This is normative, it is not a value, and AD-9 — *"the renderer emits a resolution-independent
scene"* — never says the scene carries ordering. Two consequences: the SVG serialiser and the screen
backend can legally disagree about z-order while both satisfying AD-9's *"neither rasteriser may hold
information the other cannot obtain from the scene"*; and the label-collision mitigation depends on
it (*"the layer order puts the stroke behind the label"* is the entire answer for `FRONTEND` and
`MONITORING`).

**(c) The contrast exemption list is incomplete in AD-28.** AD-28 encodes *"NFR-11's three
deliberate exemptions — the staleness veil (FR-54), the reachability dim (FR-33), the empty-filter
pale (FR-34)"*. `DESIGN.md` declares **at least three more**, each with an argument:

| Exemption in `DESIGN.md` | Measured | AD-28 status |
|---|---|---|
| **Bubble contour over a zone tint** — *"The `{stroke.edge.floor}` binds the two *edge* kinds… The contour is the body's own outline"* | 2.7–2.9 / 2.7–3.0 against a 3:1 edge floor | **not exempted** → gate fails on correct behaviour |
| **Zone tint over canvas** — *"deliberately below — a coastline, not a border"* | 1.18 / 1.13 | **not exempted** → gate fails on correct behaviour |
| **Control chip, `unavailable` state** — *"exempt from the text floor by the same convention every disabled control is"* | `{colors.ink-3}` on chip ground | **not exempted** |

And one exemption AD-28 grants is **too broad**: the staleness veil is exempted wholesale, but
`DESIGN.md` gives it a floor — *"Text never drops below 4.2:1 at maximum staleness"* — and names the
one mark that deliberately breaks its floor (*"the health circle… reaching 2.1:1 at full veil against
its own 4:1 floor"*). AD-28 as written both fails three correct things and stops guarding one thing
`DESIGN.md` guards. Since AD-28 blocks merge and the Deferred table already says *"the build starts
red"* for the light-palette tint collision, these would arrive as four more red gates on correct
code — the precise condition under which the spine's own AD-28 rationale predicts a test gets
disabled.

**(d) The brand register and the Dos-and-don'ts table.** `DESIGN.md`'s *Dos and don'ts* is 33 rows,
explicitly *"every rule above, in one table"*. Almost none of it is a token:

- *"If it glows, you clicked it"* — glass is selection and latched-control only; never hover, focus,
  accent or emphasis.
- *"Use brass where something is mounted"* — one job per metal; *"two golds meaning two things"* is
  a named failure.
- *"No control anywhere in Portolan is a filled button. There is no primary action."*
- *"Nothing may counterfeit an edge"* — binds silhouette squash (rejected), stack outline weight
  (*"deliberately below both edge kinds"*) and grouping marks generally.
- *"Keep one shape per pastille family, forever"* / *"Encode a value with a shape"* is forbidden.
- *"Keep zone isolines open and fading"* / never close a zone contour in mode A.
- *"Nothing in Portolan is a pill"* — *"a milled part has a chamfer, not a fillet."*
- The governing principle itself: **BEAUCOUP À REGARDER, PEU À LIRE**, and its arbitration rule —
  *"anything that adds text at rung 0 loses."*
- The register: `cartographie assumée` executed as *precision instrument*; *"depth is stylistic,
  never spatial"*; no texture, no parchment, no perspective, no isometry, no z-axis.

AD-23 hands all of this to "documentation of intent." Nothing in the spine's *Consistency
Conventions* table picks any of it up except the naming and string rows. **Severity: high.** The
cheapest repair is a one-clause amendment to AD-23 — *`DESIGN.md` stops being normative on values and
remains normative on rules* — plus a Consistency Conventions row pointing at the Dos-and-don'ts table
by name.

### 1.3 The token file has a consumer AD-23 forgot

AD-23's rule names three importers: *"The renderer, the CSS and the contrast tests import that same
file."* The dependency graph adds `chrome --> TOK` and `SCN --> TOK`, which is right. But **`layout`
does not import `tokens`** in the dependency graph, and layout is the stage that must reserve the
deformed hull (`{shape.bubble.deform}` + `{spacing.cell-clearance}`), size cells from
`{shape.bubble.radius}`, and apply `{density.scale}` to radii, gutter, clearance and zone padding.
Either `LAY --> TOK` is a missing arrow, or the geometry tokens must be passed into layout as part of
its input — in which case AD-8's signature `(model, seed, mode) → positions` is again wrong (§3.4).
As drawn, the spine's own dependency graph makes AD-8's hull-reservation rule unimplementable.

### 1.4 AD-6 was raised to the PRD but not to `DESIGN.md`

AD-6 changes the silhouette seed from the Docker container ID to the AD-5 identity key. The *Raised
upstream* table routes it to *"PRD, FR-13"* only. But `DESIGN.md` states the container-ID seed twice,
normatively, and one of those statements is **inside the frontmatter**:

- `shape.bubble.silhouette.seed: 'the object's Docker ID — stable across every survey, identical in
  every screenshot'`
- *Shapes* §: *"seeded from the object's Docker ID. Stable across every survey."*

Under AD-23 the frontmatter becomes the token file. So AD-6 changes a **token**, in the very artefact
AD-23 makes the source of truth, and the *Raised upstream* table does not say so. Add a `DESIGN.md`
row for AD-6.

---

## 2. AD-10 / AD-9 — what straddles the chrome/map seam

AD-10's rule is clean: *"No graph object… is a React component… The map is one surface mounted once
and painted from the scene. React owns the chrome exclusively… **The only traffic across the seam is
view state: React writes it, the rasteriser reads it.**"*

Five things in the UX documents cross that seam, and the last sentence is the one they break.

### 2.1 FR-48's export is impossible under AD-9 + AD-10 together — *critical*

AD-10 assigns the **legend band (FR-78)** to React, exclusively. AD-9 says the SVG serialiser writes
the **scene**, and *"neither rasteriser may hold information the other cannot obtain from the
scene."*

`DESIGN.md` and `EXPERIENCE.md` both make the legend and the bezel part of the exported artefact,
repeatedly and as a derived requirement of the export departure:

- *"The chart legend is in the export. It is part of the chart."*
- *"Keep the graduated bezel and corner crosses in the export / **Don't** crop the chart furniture
  out of the exported frame. The frame is what makes it read as a chart."*
- **FR-48** — *"The chart legend, the graduated bezel and the registration marks are part of the
  chart"* (bound by the spine, and mapped to `raster-svg` in the Capability map).

So `raster-svg` must emit content that lives, by AD-10, in React, and that it cannot reach through
the scene. The Capability map compounds it: *Export (FR-46..FR-52) → `raster-svg` → AD-9*, while
*Chrome… (FR-78) → `chrome` → AD-10*. One requirement, two packages, no seam between them.

This is not a legend-only problem. The legend is **content-derived**:

- `[ASSUMPTION]` *"The zone column lists the **networks that are on the chart**, not the palette…
  Each row is one network actually present: its hue, its octave pattern, its name. Past what the
  column holds, it truncates with a count."* (FR-63, bound.)
- The stack column carries *"a 40px length of `{stroke.stack-outline}` with a specimen name set on
  it"* — a specimen of a map mark, at map weight.
- Column 5 is the `pgdata` / `pg-data` / `pg_data` / `pgdatal` typographic specimen at plate size.

Which networks are *on the chart* is a function of the model **and** the active filters **and** the
framing — that is scene knowledge, and `chrome` imports neither `scene` nor `layout`. The graduated
bezel has the same shape of problem: 12px lunette, minor ticks every 10px, major every 50px, numerals
every 100px in `{typography.graduation}`, corner crosses at 30/30 — it is a function of the current
viewport transform, and `motion.settle` animates it (§3.2).

**Repair options, none of which the spine takes:** (a) put the legend and bezel in the **scene**, and
let the screen rasteriser paint them rather than React — which contradicts AD-10's exclusive list;
(b) give `raster-svg` a second input beside the scene — which contradicts AD-9's *"neither rasteriser
may hold information the other cannot obtain from the scene"*; (c) declare that FR-48's furniture is
composed by a third stage that reads scene + model + view state. One of these has to be chosen; the
spine chose none and the contradiction is silent.

### 2.2 Selection and hover run the wrong way across the seam — *high*

The spine's seam is one-directional: *React writes view state, the rasteriser reads it.* The product's
central gesture runs the other way.

- **FR-22 / `EXPERIENCE.md` → Pan and zoom:** *"Click on an object = select: the detail panel opens
  **and** the reachable set lights. One gesture does both."* The click lands on the map surface. The
  map surface must hit-test it, resolve an object identity, and **write** it where React can read it.
  That is the rasteriser writing view state.
- **FR-27 / hover** — `[ASSUMPTION]`, and `EXPERIENCE.md` is explicit about why it exists: *"because
  the session forbade a treatment (glass) without ever specifying a replacement, and, with keyboard
  traversal of the graph out of scope, this is the **map's only pre-click channel**."* The rules:
  *"The pointer changes over any selectable object and stays the default arrow over zones, stack
  outlines, bands, edges and empty canvas"*, and *"Hover lifts the object's own contour and nothing
  else."*

Nothing in the spine names a **picking / hit-testing** concern. It is not a package in the Structural
Seed, not an AD, not a row in the Capability map. And it is harder than it looks here:

- Hit targets are **mixed-space**. Bodies are world-space paths; *"pastille marks **live in** screen
  space… the rail is sized from the core's *rendered* width"* (`[ASSUMPTION]`, `DESIGN.md`), and
  `EXPERIENCE.md`'s matching `[ASSUMPTION]` puts the whole LOD ladder and every mark in screen space.
- The body path is **animated** (§3), so the hit region moves within its cell even though the centre
  does not — unless picking tests the *rest* contour, which `DESIGN.md` supports (*"labels and click
  targets never travel"*) but nobody states.
- Selectability is a **rule set**, not a property: bubbles yes, echoes yes (*"selecting an echo
  selects the object, not the copy: both copies light"*), node region headers yes in tab 2, and
  explicitly **not** zones, **not** stack outlines (`[ASSUMPTION]`), **not** node backdrop bands
  (*"a click on a band is a click on empty background, and therefore deselects"*), not edges.
- **FR-28** (everything selectable / what is not) and **FR-26**, **FR-27** are all unbound by the
  spine.

The detail panel's relationship to selection is not a read-through either. **FR-56 / *subject
vanished***: *"The panel stays and the values freeze… It is dismissed by the next click, never by
itself."* The panel therefore holds a **frozen copy** of an object that is no longer in the model,
across an arbitrary number of subsequent snapshots. That is state, in chrome, surviving new inputs —
which AD-2's *"layout is the only stage permitted to hold state between inputs"* does not cover,
because AD-2 enumerates *stages* and the view-state store is not one. The claim survives on a
technicality and reads as false to anyone implementing the panel.

**Also:** the view-state store that AD-3 and AD-10 both make load-bearing appears in the paradigm
diagram as `VS["view state"]` but is **absent from the dependency-direction graph and absent from the
Structural Seed**. There is no `packages/view-state/` (or equivalent). The one store the spine relies
on to keep React off the map has no home in the tree.

### 2.3 Chrome cannot import `layout` or `scene`, and three chrome controls need positions — *high*

The spine is explicit: *"`chrome` does not import `layout`, `scene` or either rasteriser: it reaches
them only through the view-state store of AD-3 and the mounted surface of AD-10."*

Three chrome controls in `EXPERIENCE.md` require positional knowledge:

| Control | What it needs | Source |
|---|---|---|
| **Fit to chart** (FR-76) | the bounding box of the whole laid-out cluster | *"Frames the whole cluster at LOD rung 0. It must be an on-screen control because there are no keyboard accelerators."* |
| **Orphan counter** (FR-35) | the bounding box of the orphan subset | *"Clicking it **reframes the map onto the orphans**."* |
| **Search** (FR-36, FR-83) | the position of a match, including one a filter removed | *"Search reaches objects a filter has removed. A match that is currently filtered out is"* still surfaced |

Each is a chrome control that must set the camera from a layout-derived extent. Under the stated
dependency direction, chrome can write a camera value into view state but cannot compute the value.
Either the camera-framing operation belongs on the map side (and chrome only dispatches an intent —
which is a fourth named action alongside AD-3's three, and should be said), or `LAY`/`SCN` must
publish extents into the view-state store. Neither is written.

### 2.4 AD-9 and AD-26 disagree about where compositing happens — *high*, and it gates AD-28

AD-26: *"Contrast… asserted against the scene description, in Node, with no browser and no GPU."*
AD-28: *"3:1 both edge kinds **over the worst composited zone field**."*
AD-9: *"zones as **fields**"* — plural, uncomposited — and *"a screen backend paints it."*

If the rasteriser composites the overlapping tint fields and applies `{opacity.zone-field-cap}`, the
composited colour does not exist in the scene, and AD-26 cannot measure the thing AD-28 blocks merge
on. If the scene composites, then the scene carries resolved pixels-in-waiting for regions, which is
in tension with *"resolution-independent"* and duplicates work the GPU would do.

The same question decides three other measurable states, all of which AD-28 names as exemptions and
therefore assumes are visible to the assertion layer: the staleness veil (`{colors.state-stale}` at
alpha 0 → 0.42 **plus a global saturation fall 1.00 → 0.35**), the reachability dim (0.18), and the
filter-context pale (0.10). A global saturation transform in particular is a rasteriser-shaped
operation that a scene description does not naturally carry.

**Nothing in the spine says where compositing lives.** It needs an AD sentence, because AD-28 is a
blocking gate and AD-26 is the only surface it can read.

### 2.5 A second contradiction inside AD-9: "resolution-independent" vs "marks anchored in screen space"

AD-9's rule: *"The renderer emits a **resolution-independent** scene — zones as fields, bodies as
path data, **marks anchored in screen space**, text carrying its floor."* Those two clauses do not
combine. Screen-space anchoring is a statement about **rendered pixels at a given zoom and canvas
size**; a scene carrying it is resolution-*dependent* by construction. This matters concretely at the
export: an SVG serialised at a different pixel width than the screen would re-evaluate every
screen-space mark and every type floor, and `{shape.pastille.fit}`'s badge-dropping rule would fire
differently — which silently breaks **FR-47** (*"what you see is what you get: current framing,
current zoom"*) and `EXPERIENCE.md`'s *"the chart the exporter framed is the chart that leaves."*
The spine should state that the scene is emitted **for a stated canvas geometry**, and that the SVG
serialiser must use the same one.

### 2.6 Two smaller seam items

- **The `masked values` transform (FR-49 / FR-50 / FR-51) has no stage.** `EXPERIENCE.md`: the mask
  touches *"the zone sublabel beneath a network name, any address on a plate, any address in the
  legend."* Two of those three are scene content; the third is React chrome. The mask is a
  scene-level rewrite for the first two and a chrome-level rewrite for the third, applied as one
  user-facing option. The Capability map sends FR-46..FR-52 to `raster-svg` and AD-9; AD-9 forbids
  `raster-svg` holding anything the scene cannot supply. Same shape as §2.1.
- **Detail-panel *loading* is architecturally vestigial.** `DESIGN.md` marks its three panel states
  `[ASSUMPTION]` and specifies a loading treatment (*"the chassis draws immediately… each value's
  place is held by a 1px hairline rule at the width that value will occupy. No spinner, no
  shimmer"*). Under AD-11 the tab already holds the whole snapshot, so there is no per-object fetch
  and no loading state exists. Either the panel state is unreachable (say so — it is a component the
  builder would otherwise implement) or it applies to the very first snapshot only, in which case
  AD-14's three branches should name it.

---

## 3. Motion — the *one stateful stage* claim does not survive

The spine's paradigm sentence: *"Every stage is a pure function of its input **except layout**, which
is the pipeline's single stateful stage."* AD-2 makes it a rule: *"Collector, model, scene and both
rasterisers are pure functions of their input and hold nothing across calls."*

`DESIGN.md`'s `motion` namespace specifies seven motion tokens. **Six of the seven require state
outside layout.** The spine binds FR-71 (continuous motion) and FR-53 (layered cold load), does not
bind FR-45 (reduced motion) or FR-61 (in-product motion stop), and says nothing anywhere about where
motion state lives.

### 3.1 Enumerated: the state the motion specification requires

| Motion token | State it requires | Where the spine allows it |
|---|---|---|
| `motion.breathe` — continuous, `scale 1.000 → 1.018`, `rotate ±0.7deg`, seven periods 5.5–9.7s, seven **negative** delays −0.8 … −6.8s | a **per-object phase**, and a clock | nowhere |
| `motion.breathe.outline-excursion` — ±3.4px normal to the contour, seven periods 9–23s, seven delays | a **second** per-object phase on a different period set | nowhere |
| `motion.breathe.edge-drift` — ±1.3px / 21s, *"the endpoint rides the contour it is anchored under"* | edge endpoints are a function of the animated contour → **edges are time-dependent too** | nowhere |
| `motion.draw` — zones → bubbles → edges, 320ms layers, 140ms stagger, ~1.4s total, edges by `stroke-dashoffset` 420ms | a cold-load sequence position | nowhere |
| `motion.settle` — 260ms, *"the four corner registration crosses strike brass for 180ms"*, 200ms hold before the first breath | sequence state **spanning the bezel and the map** (§3.2) | nowhere |
| `motion.enter` / `motion.exit` — 420ms / 520ms, and *"the cell is not reclaimed until the next relayout"* | a per-object lifecycle timer **and** retained cells for vanished objects | partly (§3.4) |
| `motion.relayout` — 900ms, *"bodies travel curved paths; every edge stays attached for the whole traverse; zone tints crossfade over the same window"* | **both the old and the new position sets, held simultaneously for 900ms**, plus an interpolator | nowhere (§3.3) |
| `{components.stale-map}` (not in `motion`, but temporal) — veil alpha 0 → 0.42 **over 15 minutes**, saturation 1.00 → 0.35 | the rendered output changes continuously with wall-clock time **with no new input at all** | nowhere |

The last row is the cleanest disproof of the purity claim: a map with no new survey and no user input
must still repaint, because `now − survey timestamp` is an input to its appearance. `scene(model,
positions)` cannot produce it; `scene(model, positions, t)` can, but then `t` is an undeclared scene
input and every AD-26 assertion must pin it.

**The honest formulations available to the spine**, none of which it takes:

1. Declare the scene a function of `(model, positions, view state, t)` — pure, but time-parameterised.
   Then AD-26 must say **which `t`** its assertions use, and AD-29's *rendered body diameter* measure
   must say whether it measures the rest pose or the +1.8% breath peak. It currently says neither, and
   the difference is 1.8% on the exact number the ratchet blocks on.
2. Declare an **animation stage** that holds phase, and amend AD-2 from *one* stateful stage to
   *two*, each with a named scope.
3. Declare motion a rasteriser-side concern, and amend AD-2's *"both rasterisers are pure functions…
   and hold nothing across calls"*, which is then false of the screen rasteriser.

### 3.2 Motion couples chrome and map, in two places

- **`motion.settle`** animates *"the four corner registration crosses"* — chart furniture on the
  bezel — **in the same 260ms gesture** that lands the last map layer, before a 200ms hold and the
  first breath. If the bezel is chrome and the map is the mounted surface, this is a synchronised
  cross-seam animation. `EXPERIENCE.md` makes it load-bearing rather than decorative: *"This is what
  stops 'loading' and 'living' from looking identical on a permanently alive graph, which is the risk
  the layered draw carries with it."*
- **Staleness** ages two surfaces on one clock: the map takes the veil, and *"the survey stamp in the
  tab bar carries the age for **both**"* — while the detail panel explicitly **does not** take it
  (FR-55, bound). So one timestamp drives three surfaces with three different treatments, two of them
  in React and one on the map.

### 3.3 The relayout tween has no home — *high*

`motion.relayout` is a 900ms interpolation between two complete layout outputs, and both UX documents
make it a correctness requirement rather than a flourish: *"It is a **movement, not a style swap** —
the user must be able to follow an object from one geometry into the other with their eye, so nothing
may fade out and reappear."* It fires on all three FR-16 actions (Reorganise, zone mode, node
backdrop).

So something holds `positions_old` and `positions_new` for 900ms and interpolates along curved paths,
keeping every edge attached throughout. Under AD-2 that cannot be `scene` and cannot be either
rasteriser. It could be `layout` — layout is allowed state — but AD-8 defines layout as
`(model, seed, mode) → positions`, a single output, with *"any dependence on frame timing"*
explicitly **banned inside the layout stage**. The tween is nothing but a dependence on frame timing.
As the two ADs stand, the relayout animation is forbidden in every stage of the pipeline.

### 3.4 AD-8's signature cannot express FR-16, enter/exit, or density — *critical*

`(model, seed, mode) → positions` is under-specified against four things the UX documents require:

1. **FR-16 stability across surveys.** *"Positions are earned and kept. Across the 5–10s poll,
   nothing moves."* This is not determinism. Determinism is *same input → same output*; FR-16 is
   *changed input → mostly unchanged output*. A layout that is perfectly deterministic and re-solves
   from scratch on every survey satisfies AD-8's test and violates FR-16 on the first container that
   appears. To express FR-16, layout must take the **previous positions** as an input — which is
   exactly the state AD-2 grants it and AD-8's signature omits.
2. **`motion.exit`'s retained cells.** *"the cell is not reclaimed until the next relayout"* — layout
   must carry vanished objects' cells forward across surveys. Same missing input.
3. **Three relayout actions, one `mode` parameter.** AD-3 names the three FR-16 actions: *Reorganise*,
   a change of **zone mode**, and toggling the **node backdrop**. AD-20 says both restored
   preferences *"enter as **input parameters** to the pure layout"* — two parameters. AD-8's
   signature has one.
4. **`{density.scale}` is a fourth relayout action nobody noticed — the hard one.** `DESIGN.md`:
   `density.scale.affects: 'bubble radii, {spacing.gutter}, {spacing.cell-clearance}, zone padding'`.
   Cell clearance and bubble radii are the two inputs to the reserved cell. Changing density
   *necessarily* re-lays the map. But `EXPERIENCE.md` files density under **display controls**, which
   *"change how what is present is drawn… They never change population"*, and `EXPERIENCE.md` names
   exactly which display controls re-lay: zone mode and node backdrop, *"as the consequence of
   changing the geometry, never as the point."* AD-3 then hard-codes the restriction: *"Only the
   three actions FR-16 names… may call layout. Every other interaction reads layout output and never
   invokes it."*

   **Under AD-3 as written, the density control cannot be implemented as specified.** Either density
   is a fourth layout caller (and FR-16's *"exactly three things may re-lay the map, and all three are
   the user's own doing"* becomes four — which is still true of the *user's own doing* clause and
   should simply be amended), or density must not touch geometry, which contradicts `DESIGN.md`'s
   token. This is a latent contradiction between the two UX documents that the spine hardened into an
   invariant instead of catching. **Severity: critical**, because AD-3 is stated as non-negotiable and
   the affected control is a bound requirement (FR-42, and AD-20 persists density).

### 3.5 Per-object motion phase is an identity concern AD-5/AD-6 never reached

`motion.breathe` gives seven periods and seven delays; `outline-excursion` gives seven more of each.
Some rule assigns one of seven to each object. `DESIGN.md` does not say which rule.

If the assignment is by **index** — the obvious implementation — then a `docker stack deploy`
reshuffles which body breathes on which phase, which is the identical class of defect AD-5 and AD-6
exist to prevent on the position and silhouette channels (*"the founding scenario, a drawing obsolete
at the next stack deploy"*). If the assignment is seeded from the AD-5 identity key, the whole
family of channels is consistent and the spine should say so in one clause of AD-6. Either way the
spine's determinism test (AD-8, bit-identical positions) does not see it: phase is not a position.

### 3.6 FR-45 and FR-61 are unbound, and FR-61 has no home at all

- **FR-45** (`prefers-reduced-motion`) is **not in the spine's `binds` list** and appears in no AD.
  Both UX documents specify it precisely and identically: it stills `{motion.breathe}` entirely and
  keeps every action-triggered transition — *"decorative motion removed, explanatory motion kept."*
  `EXPERIENCE.md`'s Accessibility Floor leans on it: *"a user who cannot track motion is not required
  to track anything in order to click anything, and `prefers-reduced-motion` stills the breathing
  entirely with nothing lost."* Architecturally it is a **media-query read**, i.e. a browser input —
  and AD-26 runs the scene in Node with no browser. If motion lives in the scene, reduced-motion must
  be an explicit scene input; if it lives in the rasteriser, it is rasteriser state. Unbound and
  unplaced.
- **FR-61** (*"All continuous motion can be stopped **from inside the product**, as a display
  control, independently of the operating-system setting"*) is **not in the binds list**, **not in
  AD-20's enumerated preference list** (*palette, light/dark, text size, screen masking, zone mode,
  node backdrop and refresh interval* — no motion), and **has no component in `DESIGN.md`'s left-menu
  display group** (zone mode, node backdrop, palette, text size, density, theme, refresh interval).
  It is a PRD-only requirement with no UX home and no architecture home. It needs to be added to
  AD-20's list or explicitly deferred.

### 3.7 Does the SVG export breathe?

`motion.breathe` is continuous and FR-47 is literal WYSIWYG. SVG can carry animation (CSS/SMIL); a
PNG cannot. AD-9 exists precisely to stop *"the shader the SVG cannot reproduce"* — but the reverse
case is unaddressed: a screen backend chosen as Canvas2D or WebGL (the spine's open deferral)
animates by a mechanism that has no scene representation at all, and the SVG serialiser would then
emit a still of an unspecified phase. The spine should state that the export is the **rest pose**.

### 3.8 The elevation token is already backend-coupled, and the spine's deferral does not notice

`DESIGN.md` specifies elevation as `feDropShadow dy 0.11r · stdDeviation 0.15r`, and the *rationale*
that produced the proportional-plus-floor rule is explicitly about SVG filters:

> *"SVG filters are not compositor-accelerated in any of the three target engines, and
> `{motion.breathe}` changes each filter region every frame, so 325 Gaussian blurs re-rasterise
> continuously."*

The spine defers the screen backend to Canvas2D or WebGL. `feDropShadow` exists in neither; Canvas2D
has `shadowBlur` with different semantics, WebGL has neither. So (a) the token must be re-expressed
backend-neutrally in the AD-23 file, and (b) the measured argument behind the 30px floor is
SVG-specific and does not transfer — the floor may still be right, but its justification evaporates
and nothing in the spine records that. The Deferred table's Canvas2D-vs-WebGL row weighs only the 9px
SDF-text argument.

---

## 4. AD-31 — what the journeys were guarding

AD-31's closed scope: *"the server boots and serves, SSE establishes and delivers a snapshot, the map
draws, chassis controls are tab-focusable in order, FR-57 renders with no socket, FR-64 renders on an
old engine. **No user journey is automated;** `EXPERIENCE.md`'s four journeys are explicitly out of
automated scope."*

*(Factual: `EXPERIENCE.md` has **three** flows — Flow 1 Rémi, Flow 2 Tom, Flow 3 Tom again. The PRD
also says "four user journeys"; the spine inherited the miscount rather than reading the source. The
frontmatter of `EXPERIENCE.md` says "the three journeys it is built for.")*

The exclusion is defensible — AD-26 genuinely covers legibility and geometry without a browser. What
it leaves unguarded is not legibility. It is **the invariants the journeys are the only executable
statement of.**

### 4.1 AD-3's invariant has no test — *high*

AD-3 *Prevents*: *"a filter, a selection, a search, or opening the detail panel moving anything on
the map."* FR-16: *"Exactly three things may re-lay the map, and all three are the user's own doing…
Nothing else, ever."* `EXPERIENCE.md` repeats it per control: search *"removes nothing and **never
re-lays the map**"*; palette *"never re-lays the map"*; refresh interval *"**it never re-lays the
map** — the three-things rule under Layout stability is untouched."*

AD-8's determinism test asserts `(model, seed, mode) → positions` is bit-identical. It cannot detect
an **unwarranted call** to layout, because the call returns the same answer. The property that needs
guarding is *"layout was not invoked"* — a call-count or an identity check on the positions object
across a simulated interaction sequence. AD-26 could host it (positions are scene input, and the
assertion is `positions_before === positions_after`), but AD-26's scope is stated as *"contrast, type
floors, stub length, body diameter and mark occupancy"* and no AD extends it. Flow 1 steps 5–11 walk
exactly this sequence (zoom, click, hop-reach change, *Keep only this*, *Isolate*, deselect, *Fit to
chart*) and AD-31 removes it. **The product's most load-bearing UX invariant, and AD-3's entire
reason to exist, is guarded by nothing.**

### 4.2 Layout stability under churn has no test — *high*

Flow 1's failure path: *"The map has deformed after weeks of deploys. He presses **Reorganise**.
Nothing moves his positions unless he asks it to."* FR-16: *"a new container slides in near its
neighbours; a vanished one fades in place."*

This is the *different input → mostly unchanged output* property of §3.4, and it is a different
property from determinism. AD-8's test *"replays one fixture in one order"* — the spine says so
itself, in AD-7's *Prevents*. A stability test is cheap and browserless: two fixtures differing by one
added and one removed object, asserting that every surviving object's position is unchanged. It does
not exist in the spine, and AD-31 removed the journey that was standing in for it.

### 4.3 The masking default is a security control guarded by nothing — *high*

Flow 2 step 6 is the brief's top external success signal and its top-ranked risk in one beat: *"the
`Safe to share` checkbox above the two chips is **already ticked** — it is on by default — so the
frame that lands in his downloads has every CIDR and every IP struck… He did not have to know the
risk to be covered by it, which is the entire reason the default is that way round."* `EXPERIENCE.md`
marks the default `[ASSUMPTION]` and argues it from asymmetry: *"forgetting to mask is irreversible
and public, forgetting to unmask costs one click."*

The mask must catch **every IP and every CIDR in three places** — zone sublabel, plate, legend. That
is an exhaustive-coverage property over rendered content, and it is exactly the kind of thing a
scene-level assertion is good at (*no string matching an address pattern survives in a masked
scene*). AD-26 does not claim it; AD-31 excludes the journey; FR-49, FR-50 and FR-52 are not in the
spine's binds list at all. The one privacy control in a product whose brief calls the unmasked frame
*"a reconnaissance gift"* is unguarded by any named gate.

### 4.4 Smaller unguarded items from the journeys

- **FR-34 / the empty-filter pale** (Flow 1 failure path) is an AD-28 *named exemption* — so the
  gate knows the 0.10 dim exists, but no test knows the **behaviour** that produces it ever fires.
- **FR-14's reconciliation** — *"zoom changes sharpness, never population"*, the `[DEPARTS FROM
  BRIEF]` that the LOD ladder rests on. The invariant is *the object set is identical at every
  rung*; a scene-level assertion across four rungs would cost nothing. FR-14 and FR-15 are not in the
  binds list (FR-15 appears in the Capability map only).
- **FR-26 / echo selection** — *"Selecting an echo selects the object, not the copy: both copies
  light"*, in mode B. Identity mapping in picking, unbound and untested.
- **Flow 3's node view** runs entirely on a surface whose layout is a second algorithm (§5.6).

---

## 5. The `[ASSUMPTION]` and `[DEPARTS FROM BRIEF]` markers

**Count.** The two files actually carry **25 `[ASSUMPTION]`** (13 in `DESIGN.md`, 12 in
`EXPERIENCE.md`) and **13 `[DEPARTS FROM BRIEF]`** (7 + 6). The PRD says 23 and 11. Whatever
reconciliation produced those numbers cannot be matched one-to-one against the files today, so
"the markers the PRD says survive" is not a closed set. Worth fixing upstream before anyone treats
the count as a checklist.

Of those, the architectural ones and their fate in the spine:

### 5.1 Silently **resolved** — an unconfirmed assumption promoted to an architectural precondition

| Marker | Where | What the spine did |
|---|---|---|
| **`{opacity.zone-field-cap}` — the luminance clamp** | `DESIGN.md` → *the composite*: *"`[ASSUMPTION]` on the clamp itself: it is the only move that keeps the edge floor a checkable property, but **nobody decided it**, and it costs mode A the ability to express overlap depth as darkness"* | AD-28 measures edge contrast *"over the worst **composited** zone field"* and the Deferred table treats the clamp as a value to be measured and written into the token file. **An unratified UX assumption is now the precondition of a merge-blocking gate.** If design declines the clamp, AD-28 fails at two overlapping fields (isoline 2.79) and four (attachment edge 2.87) — `DESIGN.md`'s own table — and no token value can repair it. The spine should either raise the clamp upstream alongside AD-6 and AD-18, or state that it adopts it. |
| **Screen space for the LOD ladder and every mark** | `EXPERIENCE.md`: *"`[ASSUMPTION]` The ladder is in screen space, and so are the marks… **Nobody decided this**, but the whole ladder is meaningless otherwise"*; matching `[ASSUMPTION]` in `DESIGN.md` → *Shapes* for pastilles | AD-9 bakes it into the scene contract — *"marks anchored in screen space, text carrying its floor"* — without marking it as an adopted assumption, and while simultaneously calling the scene resolution-independent (§2.5). |
| **Safe to share ON by default** | `EXPERIENCE.md` → *Export*: *"`[ASSUMPTION]` — the ruling establishes the mode, not its default, and this file has to pick one"* | Neither adopted nor raised. FR-50 is unbound. §4.3. |
| **The detail panel's three states** | `DESIGN.md` → *Detail panel*: *"`[ASSUMPTION]` — `EXPERIENCE.md`'s State Patterns names none of them; these are the treatments the visual system implies"* | AD-11 (full snapshot) makes *loading* unreachable and AD-13 (last-good replay) changes what *subject vanished* can mean — the tab must distinguish "a new successful survey lacks this object" from "the server is replaying the last good survey." The SSE payload is specified as carrying a timestamp; nothing says it carries survey success. **Distorted, silently.** |

### 5.2 Silently **ignored** — architectural in nature, no AD touches them

| Marker | Architectural consequence |
|---|---|
| **Hover affordance** (`EXPERIENCE.md`, `[ASSUMPTION]`, *"the map's only pre-click channel"*) | No picking/hit-testing concern anywhere in the spine. §2.2. |
| **Stack outline not selectable** (`[ASSUMPTION]`), node backdrop not selectable | Hit-test exclusion rules, needed by the same missing component. |
| **Chart legend always present; lists networks actually on the chart, truncating with a count** (two `[ASSUMPTION]`s) | Makes the legend data-and-framing-derived; `chrome` cannot compute it. §2.1. |
| **Column 5 typographic specimen, stacked** (`[ASSUMPTION]`) | Content that must appear inside the SVG export. §2.1. |
| **Bubble contour exempt from the edge floor** (`[ASSUMPTION]`, *"nobody stated it"*) | AD-28 does not encode the exemption → build starts red on correct behaviour. §1.2(c). |
| **Node view appearance, whole subsection** (`[ASSUMPTION]`) + **region boundaries are not zones or outlines** (`[ASSUMPTION]`) | A second layout algorithm and a second scene composition. §5.6. |
| **Refresh interval 10s default** (`[ASSUMPTION]`) | AD-12 runs the server poll at *"the minimum interval among connected clients"*, so the default is the de-facto server load; it has no home in tokens, i18n or env (AD-21 excludes it from env vars). |
| **Stepped-control vocabulary** (`[ASSUMPTION]`, *"this file commits no vocabulary of its own for a stepped setting"*) | Chrome-only; low. |
| **Stack outline colour is graphite** (`[ASSUMPTION]`) | A token value; correctly captured by AD-23. |

### 5.3 The `[DEPARTS FROM BRIEF]` markers with architectural teeth

- **Export in v1** — carries four derived visual requirements, two of which are architectural:
  **embedded fonts** (handled well: AD-19 bakes them in read-only, and `DESIGN.md`'s SIL OFL 1.1 note
  satisfies NFR-17/AD-32's licence filter) and **the chart legend + bezel declared part of the
  chart** (§2.1, unhandled).
- **Progressive LOD takes labels away** — FR-14/FR-15 unbound; the reconciliation *"population is
  identical at every rung, only text quantity changes"* is an assertable scene property nobody
  asserts. §4.4.
- **Health is blue/amber/red, and colour is the only channel it has** — handled by AD-28's
  deuteranopia gate.
- **Pastille colour replaces bubble-fill encoding** — handled.
- **Palette is a choice among verified sets, never a swatch** — handled by AD-28 (*"in both
  palettes"*), and AD-20 persists the choice. Note the plural: AD-28 says *both* palettes, while
  `DESIGN.md` and FR-43 say *predefined palette **sets***, more than two. The gate must run over
  every shipped set, not over dark/light of one set.

---

### 5.4 FR-51 (screen masking) contradicts both UX documents, and the spine adopted it without saying so

AD-20 persists *"screen masking"* as a browser display preference. Both UX documents rule screen
masking **out**, explicitly and more than once:

- `EXPERIENCE.md`: *"It touches the export only, not the screen, and reachability of the running map
  is still architecture's question."*
- `DESIGN.md`: *"the mask touches **only the exported frame**, so the screen a colleague reads over
  a shoulder is unchanged."*

FR-51 itself says so — *"This extends `DESIGN.md`, which scopes masking to the exported frame only"*
— which means the spine is persisting a preference for a control that has **no component, no
appearance and no left-menu row** in `DESIGN.md`, and no behavioural row in `EXPERIENCE.md`. A
screen-masked value also needs its own contrast figure: `DESIGN.md`'s masked-block measurement
(`{colors.ink-3}`, 4.5–5.3:1) was taken *"over `{colors.canvas}` and on every zone tint"* for the
export — which happens to be the same grounds, but the exemption is not stated for the screen, where
NFR-11's identifier channel floor (7:1) would otherwise apply to the thing that replaced an
identifier. Either raise FR-51 to the UX spine or note it as a known UX gap.

### 5.5 FR-62's ceiling is frozen by the very token file AD-23 makes authoritative

FR-62 requires the text-size control to *"reach a setting that meaningfully enlarges type beyond the
current +15% ceiling"*, with overflow behaviour specified at every step. `EXPERIENCE.md` refuses
exactly that: *"No overflow, wrap, scroll or truncation behaviour is specified for either at 1.15×,
**and none is invented here**"*, and *"There is therefore **no route to 200% text** anywhere in the
product."* `{typography.scale.steps}` is `0.90 / 1.00 / 1.15`.

Under AD-23 that literal becomes the source of truth, imported by the renderer, the CSS and the
tests — while `DESIGN.md`, which holds the *reasoning* for why 1.15 is the ceiling and what the two
floors and the clamp do, stops being normative. AD-20 binds FR-62 (it persists the setting) without
noticing the requirement is unsatisfied and that satisfying it requires chrome overflow behaviour
neither UX document will supply. Flag, not fix.

### 5.6 Node view and service view are unaccounted layouts

`EXPERIENCE.md` gives three views, and two of them are not the overview:

- **Node view (tab 2)** — *"one panel per machine, laid out as a row across the canvas"*, and
  **FR-73**: regions *"proportional to what they carry and the bubbles inside them are not
  resized."* Neither network zones nor stack outlines are drawn there.
- **Service view (tab 3)** — an ego-graph of one service and its immediate neighbours; *"a
  **semantic** zoom, not a geometric one"*; reachable only via *Isolate*.

The spine's layout package is *"pure `(model, seed, mode) → positions`"* where `mode` is the zone
rendering mode. Three surfaces with three different placement problems (free relational, partitioned
proportional regions, ego-graph subgraph) are one package with one unnamed dimension in its
signature. FR-17, FR-19, FR-20, FR-21 and FR-73 are all unbound. And switching tabs must not
re-lay the overview (*"positions are earned and kept"*, and a tab switch is not one of FR-16's three
actions) — so layout must hold **three** position sets simultaneously, which is again state the
signature does not express.

---

## 6. Smaller findings

- **`EXPERIENCE.md` has three flows, not four.** AD-31 and the Deferred table both say four. §4.
- **The view-state store has no package.** It is in the paradigm diagram (`VS`), absent from the
  dependency-direction graph and from the Structural Seed. §2.2.
- **`layout` does not import `tokens`** in the dependency graph, but needs geometry tokens. §1.3.
- **AD-29 hard-codes 884px** instead of importing `{layout.canvas-min}` — the exact transcription
  risk AD-23 exists to eliminate. §1.1.
- **FR-81 is referenced in the Consistency Conventions table but is not in the `binds` list**;
  FR-15 is referenced in the Capability map but is not in `binds`. The `binds` list and the body
  disagree in both directions.
- **Unbound requirements with UX content:** FR-10, FR-14, FR-15, FR-17–FR-24, FR-26, FR-27, FR-28,
  FR-30, FR-31, FR-32, FR-35, FR-37, FR-39, FR-42, FR-45, FR-49, FR-50, FR-52, FR-59, FR-61, FR-69,
  FR-73, FR-75, FR-81. Several are chrome behaviour the spine reasonably leaves to build time; the
  ones flagged above (FR-45, FR-61, FR-69, FR-73, FR-50) are not.
- **The i18n catalogue and the voice rule can collide.** AD-24 forbids string literals in components.
  `DESIGN.md`'s typographic split binds `{typography.mono}` to identifiers and `{typography.sans}` to
  chassis, and FR-80 forbids renaming or prettifying an object name. A catalogue entry that
  interpolates an object name into a chassis sentence would set that name in the wrong family. One
  convention line — *catalogue strings are chassis voice only; object names are never interpolated
  into a catalogue string* — closes it.
- **AD-4's three permitted Docker-isms do not cover the whole surface.** NFR-6/AD-4 allow the
  renderer to know Docker in exactly three places: object vocabulary (FR-80), the FR-57 screen, and
  the FR-64 message. `EXPERIENCE.md`'s *Foundation* names **two** sites on the collector seam and
  agrees on both — but the model also carries Swarm-specific *structure*: `stack/service/slot`
  identity (AD-5), the `running < desired` replica semantics behind the health mark (FR-12), and
  `manager` / `worker` node roles rendered in the node-region subhead. Those are model-shape
  Docker-isms rather than string Docker-isms, and the three-place claim reads narrower than the
  product is. Worth one clarifying clause.
- **`DESIGN.md` says the mocks are illustrative and the spine wins**; the spine cites no mock, which
  is correct. But `mockups/key-overview.html` is the source of the measured near-concentric-contour
  figures (455px of 1140px; 346px of 1961px) that `DESIGN.md` carries as an **open question**. The
  spine's Deferred table carries §7.1, §7.2, the clamp, the backend and the layout library — but not
  *"do the two grouping contours stay apart where they coincide?"*, which is a layout/scene question
  with a stated architectural constraint (*"nothing may be moved to buy clearance"*). Both UX
  documents carry it as open; the spine lost it.

---

## 7. What the spine got right (so it is not re-litigated)

- **AD-20** correctly identifies display preferences as browser-side and correctly notes that zone
  mode and node backdrop re-enter as layout *input parameters* rather than a fourth relayout.
- **AD-9's** one-scene-many-rasterisers shape is the right answer to the export/screen divergence
  risk, and **AD-26's** refusal of visual-regression testing matches `DESIGN.md`'s own reasoning
  about mocks and system font stacks.
- **AD-6** catches a real defect in FR-13 and raises it rather than absorbing it.
- **AD-19 + NFR-4** correctly handle the embedded-font consequence of the export departure, and the
  SIL OFL 1.1 / AGPLv3 compatibility `DESIGN.md` argues for is preserved by AD-32's licence filter.
- **The §7.2 deferral** (mark sizing at the landing level) correctly identifies that
  `{shape.pastille.fit}`'s capacity arithmetic — 5/4/3 marks, computed at radii 54/46/32 — does not
  survive the 14–28px bodies `DESIGN.md` itself reports at 325 objects, and correctly refuses to
  invent the resolution.
- **AD-28's** deuteranopia gate is the right instrument for `DESIGN.md`'s ΔE 2.6 / ΔE 3.9 findings,
  and the *build starts red* stance is the correct reading of NFR-13.

---

## 8. Findings by severity

| # | Severity | Finding | Section |
|---|---|---|---|
| 1 | **Critical** | AD-9 + AD-10 together make FR-48 (legend, bezel and registration marks in the export) impossible: the legend is React-exclusive, `raster-svg` may hold nothing the scene cannot supply, and the legend is model-and-framing-derived. | §2.1 |
| 2 | **Critical** | AD-8's `(model, seed, mode) → positions` cannot express FR-16 stability across surveys, `motion.exit`'s retained cells, two relayout parameters, or `{density.scale}` — and AD-3's three-caller rule makes the density control unimplementable as specified. | §3.4 |
| 3 | **Critical** | AD-23 scopes the token file to *colour, geometry, type, spacing* while `DESIGN.md` carries twelve namespaces; `stroke`, `opacity`, `elevation`, `motion`, `density` and `layout` — which AD-28 and AD-29 import from — are orphaned. | §1.1 |
| 4 | **High** | *One stateful stage* does not survive the motion specification: per-object breathe phase, the 900ms relayout tween, enter/exit lifecycle timers, cold-load sequence, and the 15-minute staleness clock all require state outside layout. The relayout tween is forbidden in every stage as the ADs stand. | §3.1, §3.3 |
| 5 | **High** | AD-23 de-normatises `DESIGN.md` on *values* but orphans its **rules** — rail-fitting algorithm, hull reservation, invariant core (FR-69, unbound), type-scale clamp, label-collision procedure, the twelve-layer z-order, and the 33-row Dos-and-don'ts including the brand register. | §1.2 |
| 6 | **High** | AD-28's exemption list is incomplete (bubble contour over tint, zone tint over canvas, disabled chip) and simultaneously too broad (the staleness veil has a 4.2:1 text floor `DESIGN.md` guards). Four merge-blocking gates would fail on correct behaviour. | §1.2(c) |
| 7 | **High** | No picking/hit-testing concern exists, yet click-select, hover contour-lift and the selectable/not-selectable rule set all originate on the map surface and write across the seam AD-10 declares one-directional. | §2.2 |
| 8 | **High** | AD-9 and AD-26 disagree about where zone-field compositing (and the staleness saturation transform) happens; AD-28's blocking edge-contrast gate reads the scene and cannot see a rasteriser-side composite. | §2.4 |
| 9 | **High** | `chrome` cannot import `layout` or `scene`, but *Fit to chart*, the orphan counter and search must all set the camera from a layout-derived extent. | §2.3 |
| 10 | **High** | AD-31 leaves AD-3's own invariant (*nothing but the three actions re-lays the map*) and FR-16's stability-under-churn with no test of any kind — neither is caught by AD-8's determinism test. | §4.1, §4.2 |
| 11 | **High** | The *Safe to share* mask — the product's only privacy control, covering three render sites — is guarded by no gate: FR-49/50/52 unbound, AD-26 does not claim it, AD-31 removes the journey. | §4.3 |
| 12 | **Medium** | `{opacity.zone-field-cap}`, marked `[ASSUMPTION]` and *"nobody decided it"*, is now the precondition of a merge-blocking gate; neither adopted nor raised. | §5.1 |
| 13 | **Medium** | FR-45 (reduced motion) and FR-61 (in-product motion stop) are unbound; FR-61 has no home in AD-20's preference list, in `DESIGN.md`'s left menu, or anywhere else. | §3.6 |
| 14 | **Medium** | FR-51 (screen masking) is persisted by AD-20 but is explicitly ruled out by both UX documents and has no component, appearance or contrast figure. | §5.4 |
| 15 | **Medium** | Node view (FR-73, proportional regions) and service view (ego-graph) are two further layout problems with no signature dimension, and three position sets must coexist across tab switches. | §5.6 |
| 16 | **Medium** | AD-9's scene is called resolution-independent while anchoring marks in screen space; the export at a different pixel width would re-fire `{shape.pastille.fit}` and the type floors, breaking FR-47. | §2.5 |
| 17 | **Medium** | Per-object motion phase assignment is an identity concern AD-5/AD-6 never reached: an index-based assignment reshuffles on every `docker stack deploy`. | §3.5 |
| 18 | **Medium** | The elevation token is SVG-filter-coupled (`feDropShadow`) and its measured rationale is SVG-specific; the Canvas2D-vs-WebGL deferral does not note it. | §3.8 |
| 19 | **Low** | AD-6 changes a `DESIGN.md` frontmatter token (the silhouette seed) but *Raised upstream* routes it only to the PRD. | §1.4 |
| 20 | **Low** | AD-31 and the Deferred table say *four* journeys; there are three. Marker counts (25/13 actual vs 23/11 claimed) do not reconcile either. | §4, §5 |
| 21 | **Low** | `layout` does not import `tokens` in the dependency graph; the view-state store has no package; AD-29 hard-codes 884px; `binds` disagrees with the body on FR-15 and FR-81. | §6 |
| 22 | **Low** | *"Do the two grouping contours stay apart where they coincide?"* — carried as open by both UX documents, with a stated architectural constraint (nothing may move to buy clearance) — is absent from the spine's Deferred table. | §6 |
