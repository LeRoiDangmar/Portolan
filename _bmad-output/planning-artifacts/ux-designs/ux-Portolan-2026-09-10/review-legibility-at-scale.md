---
review: legibility-at-scale
target: ux-Portolan-2026-09-10 (DESIGN.md + EXPERIENCE.md)
date: 2026-09-10
method: adversarial — one constructed cluster, arithmetic shown
---

# Legibility at Scale — Portolan

## Verdict

**It survives as a picture. It does not survive as a map of *networks*, which is the product's primary axis.** The structural bet is right and the arithmetic confirms it: rendering networks as areas rather than edges converts ~660 of ~700 edges into local stubs, leaving ~40 long edges and roughly five expected crossings. Portolan does not hairball. Weave Scope's grave is genuinely avoided.

But the network channel is carried at rung 0 by three mechanisms, and on this cluster **all three fail simultaneously**: the tint field is mud (the design's own zone study says six fields turn the canvas to mud; this cluster has eleven), the attachment stub is a sub-pixel smudge, and the network pastille — the file's stated rescue for both — is switched off at rung 0 by the LOD ladder *and* runs the same six-hue rotation it is supposed to rescue. The frame the product is judged on is the one frame where the answer to "which container is on which network" is unavailable through any channel. That is not degradation; that is the brief's founding question going unanswered in the default view.

Everything else on the list — body size, type floor, pastille density, stretch reservation, motion — degrades, some of it badly, but degrades. The network channel breaks.

---

## The test cluster

**6 nodes · 14 stacks · 40 services · 300 containers · 11 overlay networks · 25 volumes**, on 1440×900, dark mode, Overview tab, rung 0 after *Fit to chart*, no filter applied, zone mode A.

Why these numbers:

- **11 networks** is not adversarial padding. `.working/zone-overlap-options-2026-09-10.html` states it as the norm: *"A typical Swarm host runs 8–12 overlay networks."* Eleven sits mid-range. It is also the smallest count that exercises the repeat in a six-hue rotation twice over.
- **300 containers** is the number the design already works to: the shape study's recognition test is labelled *"à 25 % — c'est-à-dire à la taille qu'aurait une bulle sur une carte de 300 objets"*, and EXPERIENCE.md flow 1 says *"without the other 200 objects."* The brief's success signal is *"stays readable on a cluster substantially larger than any the author owns."*
- **40 services / 300 containers** = 7.5 replicas average, ordinary for a 6-node swarm. **25 volumes** and **14 stacks** follow from 40 services at typical ratios.
- **Multi-homing at 2.2 networks per container** (ingress + one or two overlays) sets the edge and overlap counts below.

**Bubble count.** Containers (300) + volumes (25) = **325** floor. Services are selectable objects with a type-pastille value, so the honest figure is **365**. Every computation below is run at 325 — the number most favourable to the design — with the 365 figure quoted where it changes the reading. Networks are zones, nodes are backdrop bands; neither is a bubble.

---

## The arithmetic

### 1. Pixels per object

Chrome, per `DESIGN.md` §Layout & Spacing: left menu 236, detail panel 320, toolbar 40, chart legend 120, tab bar 56, bezel 12 on all four canvas edges.

| | Landing (no panel) | Panel open |
|---|---|---|
| Canvas column | 1440 − 236 = **1204** | 1440 − 236 − 320 = **884** |
| Map, inside the bezel | 1180 × 660 | 860 × 660 |
| **Usable map area** | **778,800 px²** | **567,600 px²** |
| Area per object @ 325 | 2,396 px² | 1,746 px² |
| Equal-area disc (zero spacing) | d = 55.2px | d = 47.2px |

That last row is the ceiling — bodies touching, no gutter, no clearance, no edge corridors, no zone padding. The real figure follows from the design's own cell rule.

Cell radius per `{shape.bubble.deform.reservation}` = deformed hull + `{spacing.cell-clearance}` = **1.32r + 8**. Hexagonal packing gives each cell 2√3·R² ≈ 3.464 R².

Solving 3.464·(1.32r + 8)² · 325 ≤ 778,800:

| Assumption | base radius r | body diameter | % of nominal 46px |
|---|---|---|---|
| Hex-perfect, clearance only | **13.9px** | 27.7px | 30% |
| 60% packing efficiency (zones must be coherent regions, 6 node bands partition the canvas, edges need corridors) | **9.4px** | 18.7px | **20%** |
| `{spacing.gutter}` 24px honoured as well | **4.8px** | **9.5px** | 10% |
| 60% efficiency, panel open | 7.1px | 14.2px | 15% |
| 60% efficiency, 365 bubbles | 8.5px | 17.0px | 18% |

**The honest answer: the real body is 14–28px across, most plausibly ~19px.** A 48px-radius body is off by a factor of five. The 9px-across scenario in the challenge is not the median case, but it is exactly what you get if `{spacing.gutter}` 24px is applied between cells as the file's own sentence implies (*"the generosity in this design is all inside the map, where `{spacing.gutter}` and `{spacing.cell-clearance}` govern how much room the layout reserves around each body"*). The gutter's scope is undefined and the difference between the two readings is 3× in body diameter.

**Credit where due:** the shape study's 25% assumption is well calibrated. Independent arithmetic lands at 20–30%. The study guessed right and drew the consequence honestly.

### 2. The type floor

`{typography.scale}` declares *"the absolute floor after multiplication is 9px — no glyph in Portolan is ever rendered smaller."* Checked against the ramp as specified:

| Scale | Roles below 9px | Which |
|---|---|---|
| **1.00 (default)** | **4 of 11** | zone-sub 8.5 · section-label 8.0 · marginalia 8.5 · graduation 8.0 |
| **0.90** | **6 of 11** | + bubble-id 8.10 · zone-label 8.55 |

Three of the four default-scale violations are on the exported chart: the zone CIDR sublabel, the bezel graduation numerals, and the section-label heads in the chart legend band.

**Does any label fit at rung 0?** At r = 9.4px, the undeformed bounding box is 18.8px, so `{shape.bubble.core}` (0.59w × 0.50h) is **11.1 × 9.4px**. `{typography.bubble-name}` at 13.5px needs ~4× that width for a single glyph pair. The design already says neither name nor id renders at rung 0 — correct, and physically forced. No promise was made that cannot be kept here.

**The 25 rung-0 labels** (14 stack names + 11 network names), at `{typography.zone-label}` 9.5px / 0.26em in IBM Plex Mono (0.6em advance):

| Label | Width |
|---|---|
| `frontend` (8ch) | 65px |
| `shop_backend` (12ch) | 98px |
| `traefik-public` (14ch) | 114px |
| CIDR sublabel `10.0.14.0/24` @ 8.5px/0.1em | 71px |

25 labels at ~100 × 20px = ~50,000px², **6.4% of the map by area** — areally fine. The failure is placement, not area: mode A fields overlap (§4 below), so a zone's centroid usually lies inside several other zones, and 25 labels must be placed in a field only ~11.8 label-widths wide. They will collide, and the collision resolver has nowhere to push them that is not inside another zone.

### 3. Pastille density

Rung 0 renders one type pastille per object: **325 squares at 10 × 10px = 32,500px², 4.2% of the map.** Areally trivial. The problem is that `{shape.pastille.size}` is stated in absolute pixels and nothing says whether it scales with zoom:

- **Fixed 10px:** the pastille (10px) is wider than the core is tall (9.4px) and is 53% of the body's diameter. 325 badges dominate the silhouette — and the silhouette's stretch direction is supposed to be the rung-0 data channel. The badge obscures the channel it accompanies.
- **Scaled with the body (20%):** the pastille is **2 × 2px**. Five type values separated by fill colour alone at 2×2px (~7 arcmin at normal viewing distance) is below the small-field colour-naming threshold for most observers; small-field tritanopia is normal vision, not a deficiency. The contrast table's 5.0–17.0:1 is a luminance figure and does not rescue hue identification at that size.

**Total marks on screen at rung 0:**

| Mark class | Count |
|---|---|
| Bodies + inner contours + shadows (325 × 3) | 975 |
| Edges (attachment stubs + mounts) | ~700 |
| Zone isoline ticks (dasharray `0.8 9` on 3.5px stroke, ~1000px perimeter × 11 zones) | ~1,122 |
| Bezel graduation minor ticks | 368 |
| Labels + zone marks | 36 |
| **Total** | **≈ 3,200** |

778,800px² / 3,200 = **one discrete mark per 243px², i.e. one per 16 × 16px square.** Preattentive pop-out — the mechanism every one of the three climax beats depends on — degrades sharply past a few dozen distractors sharing the target's feature type. At 325 same-shaped bodies and ~1,100 isoline ticks, there is no pop-out; there is search.

### 4. Zone geometry — the eleven networks

Hue assignment is creation order over a six-step rotation: nets 1–6 take hues 1–6; nets 7–11 take hues 1–5. **Five hue collisions, deterministically.**

Do the colliding zones end up adjacent? With 300 containers at 2.2 networks each, expected co-membership incidences = 300 × C(2.2, 2) ≈ 396 spread over C(11,2) = 55 network pairs → **~7 shared containers per network pair.** Every pair of networks shares members. In mode A, where fields have no boundary and are placed by the members they contain, **every zone overlaps every other zone.** All five same-hue pairs are adjacent, and two same-hue *overlapping* fields are indistinguishable from one strong field of that hue.

**Contrast under overlap.** The contrast table measures each tint over the canvas at 1.13–1.19:1 — verified, my computation reproduces DESIGN.md's numbers exactly (attach 4.20 vs stated 4.2; mount 7.35 vs 7.3; isoline 3.22 vs 3.2). But the table measures **one** tint. Mode A composites several. Modelling k blended fields additively over `{colors.canvas}`:

| Overlapping fields | Tint vs canvas | Mount edge | Attachment edge | Zone isoline |
|---|---|---|---|---|
| 1 | 1.18 | 7.35 | **4.20** | **3.22** |
| 2 | 1.37 | 6.36 | 3.64 | **2.79** ✗ |
| 3 | 1.55 | 5.61 | 3.21 | 2.46 ✗ |
| 4 | 1.73 | 5.02 | **2.87** ✗ | 2.20 ✗ |
| 5 | 1.92 | 4.54 | 2.60 ✗ | 1.99 ✗ |

Floors from DESIGN.md: `{stroke.edge.floor}` 3:1, zone isoline 3:1. **The isoline breaks at two overlapping fields; the attachment edge breaks at four.** On this cluster the modal region is under three to five fields.

If instead the fields are near-opaque (the direction and study mocks use `fill-opacity` 0.92–0.95), the top field simply paints over the others: after two layers the composite is 99.4% of the topmost tint. Overlap then carries no information at all, and the picture asserts single membership where several exist. **Both branches lose:** translucent destroys the contrast floor and the hue; opaque destroys the overlap semantics.

**Information ceiling.** A region can express any subset of networks its occupants belong to. Subsets of size ≤3 from 11 = 11 + 55 + 165 = **231 distinguishable states required.** Available: 6 hues at ~1.15:1 each, plus a handful of pair blends — call it ≲12 perceptible states. The zone study said this in its own words: *"the number of distinguishable blends grows combinatorially rather than linearly, so the palette runs out long before the cluster does."*

**Does the network pastille rescue it?** No, twice over. (a) At rung 0 the network pastille **does not render** — EXPERIENCE.md's ladder puts it at rung 1. (b) The pastille palette is `pastille-network-1…6` — **the same six-step rotation**, so networks 7–11 collide on the badge exactly as they collide on the field. The stated mitigation is the thing it is mitigating.

### 5. Edges

| Edge kind | Count | Rendered as |
|---|---|---|
| Attachment (object → network) @ 2.2 nets/container | **660** | 0.9px dashed `2 4` stub, ~10px, into the field |
| Mount (container → volume) | **~40** | 1.6px brass, long curve between two bodies |
| **Total** | **~700** | |

**Crossings.** Only mounts are long edges. 40 segments at ~15% of the canvas diagonal: C(40,2) = 780 pairs × p ≈ 0.007 → **≈ 5 expected crossings.** With services drawn and linked to their containers (+300 short edges), the figure rises but stays well inside countability. **This is the design's strongest result and it should be said plainly: Portolan does not hairball.**

But the cost is hidden in the same table. **94% of the graph's edges are rendered as ~10px stubs**, and at the 20% map scale that stub is **2px long** — shorter than one period of its own `2 4` dasharray. The mark that carries network attachment is gone at rung 0, whether stroke width scales or not. *"Nothing in any rendering choice is permitted to dissolve an edge"* is a rule this design breaks against its own most numerous edge type, in its own default frame.

There is also a definitional gap underneath: `{components.edge}` specifies an edge *"an object to a network"*, while the network is an area with no position. The far endpoint of 660 of 700 edges is undefined in the spines. Both working artifacts resolve it as a protrusion stub; neither spine says so.

### 6. The stretch reservation

Cost of `1.32r + 8` against a plain `r + 8` cell:

| r | Area per object | Packing density |
|---|---|---|
| 46 (nominal) | **1.62×** | 62% |
| 20 | 1.51× | 66% |
| 14 (map scale) | 1.45× | 69% |
| 9.4 | 1.38× | 73% |

Solved the other way, on the landing frame at 325 objects: **r = 18.3px without the reservation, 13.9px with it.** The stretch rule costs **24% of every body's radius** — in the one frame where body radius is the binding constraint on everything else.

And what it buys, at that radius: a maximum bulge of 0.32 × 13.9 = **4.4px**, with cos² falloff over ±38°, on a 28px body. For comparison, `{elevation.bubble}` specifies a drop shadow at stdDeviation 7 — **the shadow's blur radius is larger than the bulge it is meant to reveal.** The data channel pays a quarter of the body's size and is then buried under the body's own shadow.

### 7. Motion

**Rendering.** 325 bodies, each a 28-point closed cubic Bézier, each carrying `feDropShadow dy 5 · stdDeviation 7`. SVG filters are not compositor-accelerated in any of the three named engines; a filtered element re-rasterises whenever its filter region changes, and `{motion.breathe}` changes the path bbox every frame by construction (scale 1.000→1.018 plus ±0.7° rotation). Per frame that is 325 Gaussian blurs over roughly 5,000px of source each — order **5M pixel-operations per frame for shadows alone**, ~300M/s at 60fps, on top of re-tessellating ~9,100 Bézier segments. This will not hold 60fps in a browser tab on integrated graphics. The reduced-motion path stills breathing but the file keeps every other animation, and nothing in either spine offers a user-facing way to stop the motion — text size, density, theme and zone mode are all display controls; *still the chart* is not.

**Geometry.** `{motion.breathe.drift}` is ±3.4px, described in the shape study as *"about 7% of a 48px radius."* At map scale it is **24–36% of the radius**. Against `{spacing.cell-clearance}` 8px, two neighbours drifting toward each other consume **6.8px of the 8px gap**. The reserved-cell rule guarantees that *anchors* never overlap; it does not guarantee that *rendered silhouettes* never overlap, which is what the silhouette-as-data-channel decision actually requires. Drift amplitude and clearance were specified against different radii and were never reconciled — the same class of omission as the pastille.

**Reading.** 325 independent oscillators on seven periods with distinct phases means a substantial fraction of the field is in motion at any instant. Peripheral motion is the strongest exogenous attention cue the visual system has. At 325 sources the eye is captured continuously and never settles — which is the mechanism by which *vivant en permanence* defeats *legible over impressive*, and it is a cost that scales with object count while the mitigation (reduced-motion) does not.

### 8. The export frame

What the default 1440×900 export actually contains: ~325 pebbles of 19–28px, eleven overlapping tints resolving to a near-uniform wash, 25 labels competing for placement, ~660 invisible attachment stubs, ~40 brass mount curves, 6 node bands, a 368-tick graduated bezel, four corner registration crosses, and a 120px chart legend.

**Would anyone post it?** Yes — as an object. The chassis does the work: near-black ground, brass, bezel, registration crosses, a numbered legend band. It will read as a chart and not as a screenshot of a web page, which is exactly what §Layout claims for the bezel, and Tom's trigger is density-as-pride rather than comprehension. **The frame passes its own stated test.**

**Would it read as *his* cluster?** Partly. The 25 rung-0 labels are stack and network names — precisely the 25 strings an operator recognises as theirs. That is the right 25 out of 365, and it was chosen deliberately. Good.

**But the legend in that frame cannot decode it.** Six columns across a 1204px canvas = **201px each** (147px with the panel open). Two arithmetic failures:

- Column 6 decodes the zone colours. It has **six swatches; the map has eleven zones.** The exported chart carries a key that provably cannot decode its own picture.
- Column 5 sets `pgdata · pg-data · pg_data · pgdatal` at `{typography.plate}` 10px / 0.04em = **230px wide** in a 201px column, 147px with the panel open. It wraps — and wrapping destroys the adjacency that is the entire point of the specimen.

---

## Findings

- **[critical]** **The stated rescue for the repeating zone rotation is the same repeating rotation.** DESIGN.md §Colors ("the answer to *which network is this* is then the network pastille") and §Do's and Don'ts ("its blur is covered by the network pastille, by design") both lean on the network hexagon — but `pastille-network-1…6` is itself a six-step rotation, so networks 7–11 collide on the badge exactly as on the field. *Breaks at:* 7 networks — the first repeat. *Fix:* keep six hues and add an orthogonal, shape-preserving state to the hexagon — hollow / filled / double-ring, or a 1–2 glyph mono index inside it. Three states × six hues = 18 networks, `shape = family` intact, no seventh hue, no decision reopened.

- **[critical]** **At LOD rung 0 the network pastille does not render, so mode A's known blur has no fallback in the landing and export frame.** EXPERIENCE.md's ladder puts network pastilles at rung 1; DESIGN.md's coverage argument assumes they are present. The one frame the product is judged on is the one frame with no exact answer to "is this container on that network" — the brief's founding question. *Breaks at:* any cluster where zones overlap, i.e. ~4+ networks. *Fix:* promote the network pastille to rung 0 in place of, or alongside, the type pastille — type is recoverable from body size and position (volumes already have their own radius and gradient), network is not recoverable from anything. This trades one rung-0 family for another and reopens the *ordering* of the ladder, not the ladder itself.

- **[critical]** **The node backdrop and the network zones compete for the same positional channel, and on a real swarm the zones lose.** An overlay network spans every node by construction — that is what an overlay network is. If a container must sit in its node's band for the backdrop to be truthful, then every zone is a 6-lobed smear across the full canvas width, all eleven fields overlap nearly everywhere, and mode A resolves to a uniform wash. The design's own zone study predicted this at six fields: *"six turn the canvas to mud."* *Breaks at:* ~4 nodes × ~6 networks — well below the test cluster. *Fix:* drop the node backdrop from the Overview and let it live where it already has a journey — tab 2, which EXPERIENCE.md flow 3 uses for exactly the distribution read. This costs the Overview its "where does this run" answer and reopens the landing-surface merge (memlog #64), but it is the only move that gives the zone channel the positional freedom it needs. A weaker variant that reopens nothing: make the backdrop a display control, off by default.

- **[high]** **The ≥3:1 edge floor is measured against one tint; mode A composites several.** (DESIGN.md §Contrast table + §Network zone.) The zone isoline drops to 2.79:1 at two overlapping fields and the attachment edge to 2.87:1 at four. The iso-luminant rotation makes the floor checkable per tint and the geometry then defeats it. *Breaks at:* 2 overlapping fields for the isoline, 4 for the attachment edge. *Fix:* cap composited tint depth — after N fields the renderer stops adding luminance — and re-measure the floor against the capped maximum rather than against a single tint. The cap is a rendering rule, not a design decision.

- **[high]** **`{elevation.bubble}` is specified for a 96px body and is catastrophic at a 28px one.** `feDropShadow dy 5 · stdDeviation 7` extends ~21px (3σ) beyond the silhouette — 1.5× the whole body diameter at map scale, against 8px of clearance. All 325 shadows land on their neighbours, the map fogs, and the 3.3:1 contour-over-canvas figure is measured against a ground that no longer exists. It also carries the frame-rate cost in §7. *Breaks at:* the moment bodies fall below ~40px diameter, i.e. ~120 objects on this viewport. *Fix:* bind `{elevation.bubble}` to the LOD rung — the file already has `dark-small` for volumes and echoes; make rung 0 use it or none, and reserve the full drop for rungs 2–3. Note that **light mode has no shadow at all and is therefore the palette that survives this test** — which is already the specified screenshot palette.

- **[high]** **`{shape.pastille.size}` does not say whether it scales, and both readings kill the rung-0 encoding.** Fixed at 10px it is wider than the core and obscures the stretch channel; scaled to 2×2px its five type values are below the colour-naming threshold. *Breaks at:* ~150 objects on this viewport, where the body passes below ~30px. *Fix:* specify a pastille floor in the same sentence as the type floor — the badge never renders below 6px and never exceeds 40% of core width; between those it scales. Where it cannot meet the floor, drop the family, exactly as the type ladder already does for labels.

- **[high]** **The 9px type floor is violated by the ramp that declares it.** Four of eleven roles are under 9px at scale 1.00 (zone-sub 8.5, section-label 8.0, marginalia 8.5, graduation 8.0) and six at scale 0.90 (adding bubble-id 8.10, zone-label 8.55). Three of the four are on the exported chart. *Breaks at:* every cluster, including the three-container lab. *Fix:* raise the four roles to 9px, or restate the floor as applying to map glyphs only and accept that graduation and zone-sub then need their own exemption written down. Either is a one-line edit; the current text is simply not true of its own table.

- **[high]** **The far endpoint of 660 of ~700 edges is undefined.** `{components.edge}` specifies "attachment (an object to a network)" while `{components.network-zone}` gives the network no position. Both working artifacts resolve it as a short coloured protrusion stub; neither spine says so, and at rung 0 that stub is ~2px — shorter than one period of its own dasharray. *Breaks at:* rung 0, at every scale. *Fix:* name the stub in `{components.edge}` as the attachment's rendering, and give it a rung-0 minimum length so it stays a visible mark. It is the cheapest available way to put *some* network signal back into the default frame.

- **[medium]** **The stretch reservation costs 24% of body radius at the exact point where radius is the binding constraint.** (`{shape.bubble.deform.reservation}` + `{spacing.cell-clearance}`.) r falls from 18.3px to 13.9px on the landing frame, and the bulge it buys is 4.4px — smaller than the drop shadow's blur radius. *Breaks at:* ~250 objects, where the reservation's cost exceeds the readability of what it protects. *Fix:* scale the deform cap with the rung — +32% at rungs 2–3 where the silhouette is legible, +12% at rung 0 where only gross elongation survives anyway (the shape study's own finding). The channel is preserved and a third of the reservation is returned to body size.

- **[medium]** **Drift ±3.4px against 8px clearance breaks the never-overlap guarantee in the rendered frame.** (`{motion.breathe.drift}` vs `{spacing.cell-clearance}`.) The guarantee holds for layout anchors, which is not what the silhouette-as-data-channel decision needs. Two neighbours consume 6.8px of the 8px gap at worst phase. *Breaks at:* map scales below ~30px bodies. *Fix:* express drift as a fraction of the current body radius rather than in absolute pixels, and add *still the chart* as a left-menu display control alongside text size, density and theme — the only motion escape today is an OS setting most users have never touched.

- **[medium]** **The chart legend cannot decode the chart it ships inside.** Six zone swatches for eleven zones; a 230px typographic specimen in a 201px column (147px with the panel open). (`{components.chart-legend}`.) *Breaks at:* 7 networks for the swatches; immediately for the specimen. *Fix:* make the zone column list the networks actually present rather than the palette (scroll or truncate with a count), and set column 5's four strings stacked vertically on a shared left margin — which is not a compromise but an improvement, since it mirrors the shared-baseline mechanism the protrusions use.

- **[medium]** **Flow 1's orphan climax cannot happen on this cluster.** *"One bubble floats between the zones, attached to nothing"* requires there to be a "between." With eleven fields covering the canvas there is none, and the orphan is a 19px pebble among 325 with no badge, no ring and no colour by explicit decision. *Breaks at:* ~6 networks / ~150 objects. *Fix:* none needed to the drawing — the orphan counter in the left menu already is the mechanism, and it was designed for exactly this. Retire the claim that isolation alone carries it at rung 0, and say in the flow that the counter is how it is found on a real cluster. The decision (no badge, no judgement) survives untouched.

- **[medium]** **The reachability hop limit has no default, and every default but "1 hop" is dead on arrival.** With 300 containers sharing 11 networks, the transitive closure from any container is the whole cluster. At 1 hop it lights ~4 of 325 objects; at 2 hops, 150+. (EXPERIENCE.md §Interaction Primitives; memlog #142 leaves the default unset.) *Breaks at:* any cluster with a shared ingress network. *Fix:* set the default to 1 hop.

- **[low]** **The invariant core is geometrically degenerate at map scale.** 0.59w × 0.50h at r = 9.4 gives 11.1 × 9.4px with a `{rounded.lg}` 6px corner radius — that is a stadium, not a rectangle, and it holds nothing at rung 0. *Fix:* stop drawing the core below the rung where it carries content; it is a layout invariant, not a mark.

- **[low]** **`{stroke.contour-inner}` at 0.87r is 1.2–1.8px inside the outer contour at map scale.** Two hairlines that close together are a moiré, not "the instrument's second ring." *Fix:* bind it to a rung, same as the shadow.

- **[low]** **Working-artifact drift:** `zone-overlap-options-2026-09-10.html` draws *"4 container-to-container links"* as real edges. Neither spine defines a container-to-container edge type — `{components.edge}` names exactly two. If that type ever entered the model it would be catastrophic (containers on a shared network form a clique: a 40-container network alone is 780 edges). *Fix:* note in the study that c2c links are not a Portolan edge type, before someone builds from the picture.

**Counts: 3 critical · 5 high · 5 medium · 3 low (16 findings).**

---

## Where it holds up better than expected

1. **The core structural bet is right, and it is the one that matters.** Rendering networks as areas rather than edges converts ~660 of ~700 edges into local stubs. Long edges: ~40. Expected crossings: **~5.** Weave Scope died of edge legibility; this design does not have enough long edges to die of it. Nothing else in this review outweighs that.

2. **Killing image nodes was the highest-value legibility decision in the file.** 300 containers into 3 images is 300 edges converging on 3 hubs — the brief's own named "fuel for the hairball failure mode." Removing it removes the single worst structure the graph could contain, and it was removed for exactly that reason, with the cost stated.

3. **The contrast table is real.** Every load-bearing figure I recomputed matched: attachment edge 4.20 vs stated 4.2, mount 7.35 vs 7.3, isoline 3.22 vs 3.2, every zone tint inside the claimed 1.13–1.19 band. The iso-luminant rotation genuinely makes the edge floor a checkable property. It fails only because the geometry overlaps tints — the idea is sound and the fix is a rendering cap, not a redesign.

4. **The shape study's 25% estimate was well calibrated and honestly drawn.** My independent packing arithmetic gives 20–30%. The study then concluded that the pebble silhouette dies there and kept only the stretch — a design conceding that its prettiest idea does not survive its own default view is rare, and it is why the deform channel exists at all.

5. **The LOD ladder does not promise anything physically impossible.** At r = 9.4px the core is 11 × 9px and no name can render. The design already says no name renders at rung 0. Almost every graph tool of this kind fails here by shipping labels that are technically drawn and practically invisible; this one does not.

6. **Layout stability is treated as first-order, and it is worth more at 300 objects than at 30.** *"The odd thing was top-left"* is the only navigational aid a 325-object map has left once names are gone. Correctly prioritised, and correctly protected from the motion decision.

7. **Light mode survives this test better than the dark default,** because its elevation is a 1px hairline rather than a σ=7 shadow — no fog, no filter cost, no 325 overlapping blurs. The palette specified as the screenshot palette is the one that actually holds at scale. That is a fortunate accident worth converting into an intention.

8. **The 25 labels chosen for rung 0 are the right 25.** Of 365 objects, the ones that make a screenshot recognisably *your* cluster are the stack and network names, and those are exactly what the ladder keeps. The reasoning behind *beaucoup à regarder, peu à lire* holds up under arithmetic even where its execution does not.
