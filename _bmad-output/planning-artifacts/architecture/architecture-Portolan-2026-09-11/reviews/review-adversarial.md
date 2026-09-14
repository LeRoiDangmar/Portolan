---
review: adversarial (divergence hunt)
target: ARCHITECTURE-SPINE.md — Portolan, 2026-09-11 (updated 2026-09-14)
spec: prds/prd-Portolan-2026-09-11/prd.md
date: 2026-09-14
method: construct pairs of one-level-down units (epics / developers) that each obey every AD to the letter and still build incompatibly
---

# Adversarial review — divergence holes in the Portolan spine

**Verdict: the spine governs the pipeline's *stages* rigorously and its *values* loosely.** Every AD is
individually defensible. But nineteen pairs of epics can each satisfy the whole AD set and still fail to
integrate, and five of those nineteen are not integration friction — they are requirements that become
unbuildable, or a product promise that silently fails, depending on which of two compliant builds lands
first.

The pattern behind almost all of them: **the spine names owners for *state* (AD-1, AD-2, AD-3) and owners
for *stages* (AD-9, AD-10, AD-33) but almost never for *derived values*.** Silhouette geometry, the
composited field, reachability, network hue, the canvas extent, the camera, the masked string — each is
computed by at least two stages that both have a legal claim, and the spine's dependency graph permits
both. AD-4 solves exactly this problem for the graph model and is then not applied to anything else.

Holes are ordered by severity. Each names two concrete builds, the ADs each obeys, the integration
failure, and the tightening.

---

## CRITICAL

### H-1 — The camera has no owner, and the two legal homes are mutually exclusive

The spine mentions the camera exactly once, in AD-1, to say the *server* does not hold it. Nothing says
which browser-side stage does. AD-2 declares "two kinds of state, and only two" — survey-derived (layout)
and presentation (frame-local, in the rasteriser, *derived from the scene plus a clock*). Pan and zoom are
neither: they are not survey-derived, and they are not derived from a clock.

- **Epic A — "Navigation and export"** puts pan/zoom in `view-state`. Justification: `scene` imports
  `view-state` in the dependency graph; FR-15's reading ladder (which labels render at which zoom) and
  NFR-10's floors on *rendered* size are scene-level decisions, so the scene must know the transform;
  FR-66's screen-space marks can only be anchored if the scene knows the transform; and FR-47's *current
  framing, current zoom respected literally* is only reachable by the SVG serialiser if the framing is in
  the scene, which AD-9 requires ("neither rasteriser may hold information the other cannot obtain from
  the scene"). Obeys AD-1, AD-2, AD-3, AD-9, AD-10, AD-26.
- **Epic B — "Screen rendering and motion"** treats pan/zoom as a canvas transform applied at paint time
  in `raster-screen`. Justification: AD-9 says the scene is **resolution-independent**, which a scene
  carrying a viewport-specific transform is not; NFR-8's 100ms pan at 396 objects is only achievable if
  panning does not rebuild the scene; AD-2 puts per-frame concerns in the rasteriser. Obeys AD-1, AD-2,
  AD-9, AD-10, AD-25.

**Both pass review. Integration breaks in two directions at once.** With Epic B's transform, the reading
ladder never changes with zoom (FR-14/FR-15 dead — zoom changes nothing but scale), screen-space marks
scale with the map (FR-66 dead), and the SVG serialiser cannot reproduce the on-screen framing (FR-47,
AD-9 violated). With Epic A's scene-level camera, every pointer-drag frame regenerates a 396-object scene
— the exact cost AD-30 concedes is CPU-bound and ratchets, against the one latency number NFR-8 names.

**Tightening — new AD.** *The camera is view state, and the scene is built for a stated viewport.* Declare
pan/zoom/framing as `view-state`; declare the scene a function of `(model, positions, view-state, tokens)`
that resolves the reading ladder, screen-space mark anchoring and label-floor drops against the camera it
was built for; and declare explicitly that a camera change is a **scene rebuild, never a relayout**, with
the incremental-rebuild budget named as the thing AD-30's ratchet guards. A rasteriser-side transform is
then admissible only as an intra-frame optimisation that cannot change which marks or labels exist.

---

### H-2 — Layout's coordinate space and the canvas extent are undeclared, which makes a window resize a fourth relayout

AD-8's signature is `(model, previousPositions, seed, mode) → positions`. **The canvas width is not in
it.** AD-29 reads an operative canvas of ~884px from the token file's `layout` namespace; FR-79 says the
canvas takes every extra pixel, so at a 1920px viewport the real canvas is ~1364px. AD-8's `mode` is
defined as "every restored relayout parameter (zone mode **and** node backdrop)" — closed, and the canvas
is not in it.

- **Epic A — "Layout"** reads the AD-23 `layout` canvas token as a fixed abstract extent and packs into
  it. Positions are viewport-independent; the scene scales. Obeys AD-8 literally (no fifth parameter),
  AD-23 (no literal floor outside tokens), AD-29 (the number comes from the token file), AD-32
  (determinism reproduces on both runners).
- **Epic B — "Viewport and chrome"** passes the measured canvas width into layout as part of `mode`,
  because FR-79's *the canvas takes every extra pixel* is meaningless if layout packs into 884px on a
  1920px screen, and §7.1's whole crisis is body diameter — throwing away 480px of real estate is a
  self-inflicted wound. Obeys AD-8 (`mode` carries restored relayout parameters, and the width is one),
  AD-1 (nothing goes to the server), AD-23.

**Integration breaks three ways.** (1) Positions mean different things — abstract units in A, device pixels
in B — and AD-26's assertions (body diameter, FR-68's 6px stub floor, FR-67's 8px mark floor) are only
meaningful in pixels, so the assertion suite silently measures the wrong quantity under A. (2) Under B, a
**window resize re-lays the map** — which FR-16 forbids (three actions, and resize is not one) and which
AD-3's invocation counter does not test for, because its enumerated list (filtering, selecting, searching,
hovering, opening the panel, text size, density, masking, palette) contains no resize. (3) The two
epics disagree about what *Fit to chart* (FR-76) fits to.

**Tightening — amend AD-8 and AD-9.** State that **layout emits positions in an abstract, viewport-
independent space of declared extent**, that **`scene` is the stage that resolves abstract → device pixels
against the operative canvas**, and that **resizing the viewport is a scene rebuild and never a relayout**.
Add *resizing the window* to AD-3's zero-invocation test list — it is the one uncovered path that produces
a relayout FR-16 forbids.

---

### H-3 — Masking is a scene parameter, and the detail panel is not in the scene: FR-51 leaks

AD-34 puts masking at scene build. AD-10 and AD-25 give the detail panel to React, and the dependency
graph gives `chrome` a direct import of `model`. FR-25 says the panel carries "IPs, image tags, mounts,
placement". **Nothing in the spine tells chrome to mask anything.**

- **Epic A — "Export and masking"** implements AD-34 exactly: two scenes, two flags, export masked by
  default (FR-50), screen unmasked by default (FR-51), FR-49's identical-footprint property asserted on
  the scene by AD-26. Fully compliant with AD-34, AD-9, AD-26.
- **Epic B — "Selection and inspection"** builds the detail panel in React from the model, rendering IPs
  and CIDRs verbatim (FR-25), with no masking concept at all — because AD-34 scopes masking to the scene
  and AD-10 forbids chrome from reaching into the scene. Fully compliant with AD-10, AD-25, AD-4, AD-24.

**Integration ships a product where the executive viewer turns screen masking on for the meeting, the map
goes clean, and the first click puts the internal addressing plan on the wall in the panel.** FR-51 exists
for exactly one reason and this defeats it. Neither epic is wrong; the spine scoped the product's only
privacy control to one of the two surfaces that display addresses.

**Tightening — amend AD-34.** Masking is a **view-state flag consumed at every render boundary, not a
scene parameter**: the scene applies it to scene text, and `chrome` applies the same masking function to
panel text. Put the single masking function in `model` (both ends import it, AD-4's treatment) so the
identical-footprint rule (FR-49) has one implementation. Extend AD-26's assertion to cover the panel's
masked strings, and state that no code path renders a raw address while the screen mask is on.

---

### H-4 — The silhouette hull is computed twice: layout reserves it, the scene draws it, and nothing says they are the same function

AD-8: "the deformed hull reserved **before** placement (FR-13)". AD-9: the scene carries "bodies as path
data". Both stages must know the hull: layout to reserve non-overlapping space, the scene to emit the
outline. AD-23 explains that `layout` imports `tokens` precisely because `shape` "carries the hull geometry
without which AD-8's *deformed hull reserved before placement* is unimplementable" — so both stages read
the same tokens, but **the spine never says they run the same geometry code**, and `scene` does not import
`layout`'s hull function (it imports `layout` for positions).

There is a second, sharper half. FR-13's data channel is *stretch toward the objects it links to*, capped at
+32% (FR-70). Stretch direction depends on where the neighbours ended up — which is layout's *output*.
Reserving the deformed hull *before* placement is therefore circular, and the spine does not say how the
circle is cut.

- **Epic A — "Layout and stability"** reserves hulls from stretch computed against `previousPositions`
  (empty on a cold start, per AD-8), then places. Obeys AD-8 verbatim, AD-23, AD-37.
- **Epic B — "Scene and rendering"** emits body path data with stretch computed from the **final**
  positions in the scene, because that is the only place the final neighbour geometry exists and FR-13's
  stretch is a rendering of a real relation. Obeys AD-9 (bodies are path data in the scene), AD-23,
  AD-26.

**Integration breaks FR-13's hardest promise: "bubbles never fuse and never overlap."** The reserved hull
and the rendered hull are two different shapes computed from two different inputs by two different
functions. On a cold start they are far apart (A reserved against an empty previous set). AD-26's suite
does not catch it — no assertion compares reserved occupancy against rendered path geometry — and AD-37's
stability test only checks *positions*, not hulls.

**Tightening — new AD, "one hull function".** Declare a single hull/stretch geometry function, living in
one package below both `layout` and `scene` (alongside `model` or in a `geometry` module that reads
`tokens`), consumed by both. Declare the pass order that cuts the circle: **stretch targets are frozen from
the previous iteration's positions before the final reservation, and the scene renders the hull layout
reserved — it never recomputes it.** Add an AD-26 assertion: *for every body, the rendered path lies inside
the reserved hull, and no two reserved hulls intersect.*

---

### H-5 — Identity keys are not kind-qualified, so a volume and a network with the same name are one object

AD-5: "volume and network → name". Docker permits a volume `web` and an overlay network `web` in the same
cluster; they are different objects in different namespaces. AD-5 produces the identical key `web` for both.
AD-36 then carries "**only an identity key**" upward across the map seam, and AD-6 seeds the silhouette
from the key.

- **Epic A — "Selection and inspection"** builds one flat lookup `Map<IdentityKey, Object>` because AD-36
  says the pick event carries only a key and the conventions table says "one key format per object kind,
  used for sorting, seeding and lookup alike". Obeys AD-5, AD-36, AD-4.
- **Epic B — "Graph model"** builds per-kind maps (`volumes`, `networks`, …), because AD-7 says "the
  collector sorts **every collection** by its AD-5 identity key" — collections are per-kind. Obeys AD-5,
  AD-7, AD-4.

**Integration:** under A, clicking the volume `web` opens the panel for the network `web` (or whichever
was inserted last) — FR-26's *selecting a duplicated rendering selects the object, not the copy* becomes
*selecting an object selects a different object*. Under B, the pick event's bare key cannot be resolved at
all without a kind the seam is forbidden to carry. Either way AD-6 gives both objects the **same
silhouette**, which is a direct lie in FR-13's recognition channel, and AD-7's per-collection sort leaves
the two objects' relative order undefined anywhere the kinds are merged (the scene, the legend, search).

There is a second, quieter gap in the same AD: **AD-5 has no key for a container outside a stack**. FR-74
makes orphans — "an object belonging to no stack" — a first-class concept, and a `docker run` container on
a manager node has no stack, possibly no service and no slot. `stack/service/slot` has no defined form for
it, so two epics will invent two (`/svc/1` vs `svc/1` vs the container name), and AD-6 will seed two
different shapes from them across the seam.

**Tightening — amend AD-5.** Identity keys are **globally unique across kinds in one namespace**, formed as
`<kind>:<discriminator>` — `volume:web`, `network:web`, `task:stack/service/slot`, `task:stack/service@node`,
`service:<docker-id>`, `node:<docker-id>` — and the key function lives in `model` as the single
implementation. Name the form for a stackless and serviceless container explicitly. State that the key is
opaque to every consumer except the key function itself (nothing parses it).

---

## HIGH

### H-6 — AD-33 puts `mode` in the surface key; AD-3 and AD-8 make `mode` a relayout parameter. A zone-mode switch is two different things.

AD-33: surfaces are "keyed by `(view, subject, mode, seed)`. Switching view or subject **draws another
surface**; it never re-lays the one being left, and returning to a surface restores the positions it had."
AD-8: `mode` "carries every restored relayout parameter (zone mode **and** node backdrop)" — i.e. mode is
an input to a relayout of *this* surface. AD-3 and FR-16 name switching zone mode as one of exactly three
actions that **may call layout**.

- **Epic A — "The three views"** reads the AD-33 key literally: `mode` is part of the key, so switching
  zone mode selects a different surface. First switch computes it; every subsequent switch **restores the
  positions that surface had**. Obeys AD-33 verbatim, AD-8 (layout still pure), AD-20 (mode restored at
  load as an input parameter).
- **Epic B — "Display controls"** reads AD-3/FR-16/AD-8 literally: switching zone mode calls layout on the
  current surface with the current `previousPositions` and the new mode. Obeys AD-3, AD-8, AD-37, FR-16.

**Integration:** FR-40 is explicit that a zone-mode switch must render as "a visible movement — nothing may
fade out and reappear, because the user has to follow objects by eye". Epic A produces exactly the
forbidden behaviour on the second switch: it restores a stored position set, so objects teleport back with
no relationship to where they currently are, and `previousPositions` is not consulted at all. Epic B's
behaviour is correct but contradicts AD-33's own key. Worse, the two epics disagree about *how many layout
states exist per view* (A: one per mode combination, so four for overview; B: one), which changes the
memory model, the tween's "both position sets" (AD-2), and what AD-37's replay test is even asserting
against.

**Tightening — amend AD-33.** Remove `mode` from the surface key: surfaces are keyed by `(view, subject)`
only, and `mode` is what AD-8 says it is — a parameter of a relayout **within** a surface, carrying
`previousPositions` forward so FR-40's movement is expressible. State that a surface holds exactly one
layout state, and that its current `mode` is part of that state rather than part of its identity.

---

### H-7 — Retained cells have two owners and no release policy

AD-2 puts "retained cells" in the **survey-derived** half, living in `layout`. AD-2 *also* puts "enter and
exit lifecycle timers" in the **presentation** half, living in `raster-screen`. AD-37 says a vanished
object's "cell is **retained** — it fades in place and its space is not reclaimed until the next relayout".
So the ghost is a layout fact and a rasteriser timer at once, and AD-8's signature never says whether a
retained cell is inside `previousPositions`.

- **Epic A — "Liveness and stability"** carries ghosts inside `previousPositions` and returns them from
  layout, so the reservation survives across surveys and AD-37's replay test passes ("no removed object's
  cell was reused"). Obeys AD-2, AD-8, AD-37.
- **Epic B — "Motion"** implements the ghost as AD-2's exit lifecycle timer: the rasteriser fades it over
  the motion token's duration and drops it, and layout is fed only the live model. Obeys AD-2, AD-8 (pure,
  nothing retained), AD-26.

**Integration:** under A the ghosts are never released. On a 5s cadence with normal `docker service update`
churn, a surface accumulates hundreds of reserved-but-invisible cells between Reorganises; new objects are
pushed to the periphery, the operative canvas of §7.1 is consumed by holes, and the AD-29 ratchet records
body diameter degrading with no code change responsible. Under B the fade looks right for 400ms and then
FR-16's "neither reclaims space until the next relayout" is violated on the next survey. Both pass every
test the spine defines — AD-37's replay is a scripted short sequence, not a long soak.

**Tightening — amend AD-37 and AD-8.** State that **retained cells are carried in `previousPositions` and
are layout's alone**; that the rasteriser's exit timer governs **opacity only, never occupancy**; and give
retention a **bound** — cleared on Reorganise *and* aged out after a declared number of surveys or a
declared cell-count ceiling (a `motion`/`layout` token per AD-23). Add the soak case to AD-37's test: N
surveys of churn without a Reorganise, asserting reserved-cell count stays bounded.

---

### H-8 — Transitive reachability has three callers and no owner

The same traversal is required in three places by three different requirements: FR-22/FR-23 (the highlight,
1 / 2 / all hops), FR-32 (*Keep only this* promotes the highlight "into a real filter, **reusing the same
hop reach**"), and FR-20 via AD-33 (service view is an ego-graph of "immediate neighbours" — one hop).
**No AD names where the traversal lives.** Three packages have a legal claim: `chrome` (imports `model`),
`scene` (imports `model` and `view-state`), `view-state` (imports nothing, but holds selection).

- **Epic A — "Selection and inspection"** computes reachability in `chrome` from its `model` import,
  writing a lit-key set into `view-state`. Obeys AD-10 (it is not reaching onto the map surface), AD-3,
  AD-4, and the dependency graph.
- **Epic B — "Filtering and finding"** computes reachability in `scene` — because AD-35 already puts "the
  set search lights (FR-36, FR-37)" and "the orphan count (FR-35)" in `scene` as chart-derived figures, and
  the highlight is the same kind of figure. Obeys AD-35, AD-9, AD-10, AD-3.

**Integration:** two traversals with two edge semantics. Does stack membership count as a hop? Does a
network attachment traverse *through* the network to every co-attached container (FR-8 keeps attachment
edges real in the model, so a one-hop network traversal can legally light 40 containers or none)? Does the
node-hosting edge count? The two epics will answer differently, and FR-32's contract — *the filter keeps
exactly what the highlight lit* — is then false at a glance: the user sees one set light, clicks *Keep only
this*, and gets a different set. AD-33's ego-graph makes a third answer, so service view's population does
not match a one-hop highlight of the same service.

**Tightening — extend AD-35.** Reachability is a **scene-derived figure like the others**: one traversal
function in `scene`, taking `(subject, hops)`, with the edge kinds that count as a hop **enumerated in the
AD** (attachment-through-network: yes/no is the load-bearing one, and §7.1's "150 of 325 objects light at
two hops" arithmetic depends on the answer). The highlight (FR-22), the filter (FR-32) and the ego-graph
(FR-20) all consume that one function's output.

---

### H-9 — Pick geometry lives in the scene; the relayout tween lives in the rasteriser. Clicks land on the wrong object mid-relayout.

AD-36: "Hit geometry lives in the scene; the map surface resolves a pointer position against it." AD-2:
"the relayout tween holding both position sets" is presentation state in `raster-screen`. During any of
FR-16's three relayout actions — and FR-40 *mandates* the movement be visible and followable — bodies are
painted at interpolated positions while the scene's pick geometry sits at one endpoint.

- **Epic A — "Picking and selection"** resolves pointer → key against `scene.pickGeometry`. Obeys AD-36
  verbatim, AD-10, AD-9.
- **Epic B — "Motion and relayout"** tweens positions in the rasteriser over the motion token duration,
  holding both sets, per AD-2. Obeys AD-2, AD-26 ("every geometric assertion names its motion phase"),
  FR-40.

**Integration:** for the whole duration of every relayout the click target is displaced by up to the full
travel distance — often the width of the canvas. FR-71's guarantee is explicitly scoped to *breathing*
("translation 0px"), so nothing in the spine forbids this, AD-3's counter does not see it, and AD-26 tests
the scene at a fixed motion phase where the tween does not exist.

**Tightening — amend AD-36.** State that **the map surface resolves pointer position against the geometry
it actually painted**, i.e. the rasteriser applies the same presentation transform (tween interpolation,
never breathing deformation) to the scene's pick geometry before hit-testing — or, simpler and also
acceptable, that **picking is inert for the duration of a relayout tween** and the toolbar control is in
FR-77's *unavailable* state while it runs. Pick one; either closes it, silence does not.

---

### H-10 — Filters that *remove* objects from the scene make FR-83 and FR-34 unbuildable

The spine never says where filters are applied. AD-3 puts them in `view-state` with no write path to
layout; `scene` imports `view-state`; AD-3's enforcement test confirms filtering produces zero layout
calls. So filters are a scene-level concern — but *removed from the scene* and *present in the scene with
a removed flag* are two very different data shapes, and both satisfy every AD.

- **Epic A — "Filtering"** builds the scene from a filtered model subset — the literal reading of FR-30
  ("filters **remove**"). Obeys AD-3, AD-9, AD-35, AD-34's precedent (masking is applied at scene build,
  so filtering by analogy is too).
- **Epic B — "Search"** derives its match set in `scene` per AD-35, and derives the reframe extents
  (FR-36) and the orphan count (FR-35) there too. Obeys AD-35, AD-10, AD-3.

**Integration:** FR-83 — "Search reaches objects a filter has removed. A match that is currently filtered
out is reported as **found and filtered**, not silently absent — otherwise search would lie about what the
cluster contains, **which is the one thing Portolan exists not to do**" — is *inexpressible*, because under
A the object is not in the scene B searches. And FR-34's pale-context return ("when a filter would empty
the map, the excluded objects return as very pale context") requires the scene to carry excluded objects
with geometry and a distinct dim depth (FR-33 demands it be visibly different from the reachability dim) —
which Epic A's subset cannot produce. Epic B's fallback, matching against `model` in chrome, hands chrome
keys the scene has no geometry for, so the FR-36 reframe cannot compute extents for them.

**Tightening — new AD or extend AD-34.** *Filtering is a scene parameter and the scene is total.* The scene
carries **every object in the survey**, each with a presence state drawn from a closed set — `present`,
`filtered` (FR-30), `pale-context` (FR-34), `dimmed` (FR-33), `lit` (FR-22/FR-36), `retained` (AD-37) — with
the dim depths as AD-23 tokens so FR-33's "two dim depths must look visibly different" is an AD-26
assertion. Rasterisers render presence states; they never compute them. Search, the orphan count and the
extents then all run over the total scene, and FR-83 is free.

---

### H-11 — AD-4 governs the model's *types* and says nothing about its *wire form*

AD-4: "One package defines the graph types; collector and renderer both import it and neither redefines a
type." AD-11: "Each survey is pushed whole over SSE." The two together never say the model is the wire
format, nor that the model must survive a JSON round trip.

- **Epic A — "Graph model"** defines the model idiomatically for its consumers: `Map<IdentityKey, Node>`,
  `Set<IdentityKey>` adjacency, and direct object references on edges (`container.networks: Network[]`),
  because FR-22's traversal and FR-6's edges read naturally that way. Obeys AD-4, AD-5, AD-7.
- **Epic B — "Transport and liveness"** serialises the model straight onto the SSE stream and parses it in
  the tab, because AD-11 says the survey is pushed "whole" and AD-4 says the tab imports the same types —
  so there is nothing to translate. Obeys AD-4, AD-11, AD-13.

**Integration:** `JSON.stringify` turns every `Map` and `Set` into `{}`, and throws outright on the
container↔network cycle. The failure lands at wiring time, when both epics are complete and one of them has
to be rewritten. The same shape question also bites `previousPositions` (AD-8) and the AD-2 tween, which
hold structures keyed by identity across surveys, and AD-27's recorded-payload fixtures, whose expected
outputs are serialised model instances.

**Tightening — amend AD-4.** The model is a **plain, acyclic, JSON-round-trippable value**: adjacency by
identity key only, never by object reference; arrays in a total AD-7 order, never `Map`/`Set`; and the
**snapshot payload is the model itself plus a survey timestamp and a declared schema version** (which
AD-11's full-snapshot transport makes cheap and which a second collector, per NFR-5, will need). Convenience
indexes are built by consumers after parse, never transported.

---

### H-12 — Nobody owns network hue and octave assignment, and the two candidate owners produce colours that move

FR-65: "a hue is assigned in **creation order** and held for the life of the network, cycling over six, and
a fill pattern marks which octave the hue is on." AD-23 owns the six hue *values*. AD-35 owns the legend's
*contents*. **No AD owns the assignment of hue index to network.**

- **Epic A — "Graph model / collector"** assigns the hue index at collection time from the network's
  Docker `CreatedAt`, sorted with the AD-7 total order as tiebreak, and carries it as a model attribute.
  Obeys AD-4, AD-5, AD-7, AD-23.
- **Epic B — "Scene and legend"** assigns the hue index in `scene` by enumerating the networks **actually
  on the chart** in identity-key order, because AD-35 says the legend enumerates "which networks are
  actually on the chart, their hues and octave patterns, and any truncation, per FR-63", and deriving hue
  where the legend is derived is the obvious reading. Obeys AD-35, AD-9, AD-23, AD-7.

**Integration:** under B, hue is a function of the *visible set*, so filtering out one network re-hues every
network after it; the three views (AD-33, where service view is a **model subset**) show the same network in
three different colours; and two exports of the same cluster taken minutes apart do not agree — destroying
"held for the life of the network" and making FR-63's legend a decoder for one frame only. Under A the
octave pattern is stable but the legend must be told the global index for a network the chart shows,
which Epic B's scene-local enumeration cannot supply. NFR-13's deuteranopia gate (AD-28) computes over the
six hues and never sees the assignment, so nothing goes red.

**Tightening — new AD or extend AD-4.** *Network hue index and octave are model attributes, assigned once
per survey over the **full** network set in creation order (AD-7 tiebreak), stable across views, filters,
masking and export.* `scene` and the legend read the attribute; neither computes it. Name the fallback when
`CreatedAt` is absent or equal, so two collectors cannot disagree.

---

## MEDIUM

### H-13 — Echo copies break layout's output cardinality

FR-40's second zone mode is "disjoint blobs with **echo copies**", and §6 names the cost ("an object's edges
are split between its copies"). AD-8 returns `positions` and takes `previousPositions`, both keyed by
identity; nothing says an object has **one** position. Epic "Layout" ships `Map<Key, Point>`; epic "Display
controls" needs `Map<Key, Point[]>` with a stable ordinal per copy. AD-37's "survivors did not move" is
undefined when an object gains or loses a copy; AD-2's tween holding "both position sets" has no rule for
matching copy 2 of the old set to copy 3 of the new; AD-36's "both copies carry the same identity key" is
stated but gives chrome no way to say *which* copy is under the pointer for a hover lift (FR-27).
**Tightening:** declare the layout output as `key → placement[]` with a stable ordinal, define stability
and tweening for multi-placement objects, and state that the pick event carries the key only while the
rasteriser keeps the ordinal for its own hover treatment.

### H-14 — Hover has no legal home

AD-2 declares "two kinds of state, and only two", and hover is in neither list: it is not survey-derived,
and it is not in the enumerated presentation set (breathing phase, relayout tween, enter/exit timers,
cold-load sequencing, veil repaint). Epic "Selection" puts hover in `view-state`, so every pointer move
rebuilds a 396-object scene (NFR-8). Epic "Motion" puts it in `raster-screen` as a local contour lift
(FR-27 is exactly that), which AD-9 forbids in letter — "neither rasteriser may hold information the other
cannot obtain from the scene". **Tightening:** name hover explicitly in AD-2 as presentation state owned by
`raster-screen`, and add the corresponding carve-out to AD-9: *transient pointer-driven presentation
(hover lift, focus feedback) is rasteriser-local and deliberately absent from the export, which is the one
place AD-9's symmetry does not apply.*

### H-15 — Background surfaces: lazy or eager, and AD-37 cannot tell

AD-33 gives each of the three surfaces its own layout state; AD-12 pushes a survey every 5–60s. **Nothing
says whether a surface the user is not looking at advances with each survey.** Epic "Views" computes a
surface on entry (cheap; but returning after ten minutes runs layout against ten-minute-old
`previousPositions`, so an entire batch of new objects lands at once and every intervening ghost is either
missing or piled up). Epic "Liveness" advances all three every survey (three layouts per survey at 396
objects, against NFR-8). AD-37's scripted replay passes under both, because it never leaves a surface idle.
**Tightening:** state in AD-33 which it is. Eager, with the cost named, is the reading that keeps AD-37's
promise on return; lazy needs an explicit catch-up rule and a bound on ghost accumulation (see H-7).

### H-16 — The client → server channel is unnamed, and the obvious implementation trips the staleness veil

AD-12 puts "one poll loop, running at the **minimum interval among connected clients**" on the server;
AD-20 makes the interval a browser preference. The spine never says how a tab tells the server its
interval. Epic "Transport" encodes it in the SSE URL (`/events?interval=5`), so a mid-session change
requires reconnecting — and AD-11 makes SSE disconnection a **staleness signal**, so changing the interval
flashes the FR-54 veil, breaking FR-3 ("alters neither the population nor the rendering") and FR-5
("choosing 60s does not itself age the chart"). Epic "Chrome" assumes a separate `POST /client-interval`,
which is the only other option and which FR-2's *no write path exists anywhere in the product* invites a
reviewer to reject. **Tightening:** name the upward channel explicitly in AD-12 as the sole client→server
message, state its shape and that it is a client-preference registration and not a cluster write path
(distinguishing it from FR-2/AD-15, which govern the Docker adapter), and state that an interval change
must never tear the SSE stream or produce a staleness transition.

### H-17 — The scene-derived facts handed to chrome have no shared type and no composition root

AD-35 and AD-10 say extents, orphan count, legend contents and search lights are "derived in the scene
package and handed to chrome as data". The dependency graph has **no** `chrome → scene` edge, and the
structural seed has no package that imports both — `chrome` is the top of the tree. Epic "Chrome" declares
its own props interface for these facts; epic "Scene" exports a differently-shaped derivation. Nobody owns
the wiring, and nothing makes the two shapes agree — which is exactly the drift AD-4 exists to prevent,
applied to the model and to nothing else. **Tightening:** declare the scene-derived facts as a **named type
in a shared package both ends import** (the AD-4 treatment), and name the composition root — either an
`app` package that imports `scene`, `raster-screen` and `chrome` and wires them, or an explicit statement
that `chrome` may type-import from `scene` while never calling into it.

### H-18 — "The worst composited zone field" is defined in two places that will not agree

AD-28 says the contrast gates, including "3:1 both edge kinds over the worst composited zone field", are
"computed **from the AD-23 token file** and block merge". AD-9 says compositing is resolved in the scene.
AD-29 says the harness reports "contrast of both edge kinds over the worst composited field (computable
because AD-9 resolves compositing in the scene)". Epic "Tokens and CI" computes the gate analytically from
a declared clamp token; epic "Harness" measures it on the generated 396-object scene, where the worst case
depends on how many zones happen to overlap in the synthetic cluster. The numbers differ, one gate is green
and one red, and neither build is wrong. **Tightening:** state that the **token-declared clamp ceiling is
authoritative** for AD-28's blocking gate, and that AD-29's harness measurement exists to **verify the
clamp holds on a realistic scene** — a ratchet, not a second definition of the floor.

### H-19 — Idle polling is undefined, so the first frame after a quiet period may open under the veil

AD-12's poll loop runs "at the minimum interval among connected clients". With zero clients there is no
minimum. Epic "Server" stops polling when the last client disconnects — then AD-13's replay to a newly
connected tab (and AD-14's branch 1, "a good survey exists → replay it at once") serves an arbitrarily old
snapshot, and AD-12's threshold rule trips the FR-54 veil on the very first frame the user ever sees. Epic
"Liveness" polls at the 10s default forever, loading the manager socket of an unattended cluster
indefinitely. **Tightening:** state the idle behaviour in AD-12, and state in AD-14 that branch 1's replay
is immediately followed by a forced survey so the first frame converges to fresh within one interval rather
than opening paled.

---

## What I did not find

Worth recording, because it bounds the above. AD-1, AD-7, AD-15, AD-16, AD-17, AD-19, AD-21, AD-22, AD-24,
AD-27, AD-30, AD-31 and AD-32 survived the exercise: I could not construct two compliant builds that
diverge under them. AD-6's declared departure from FR-13 is a cost, not a hole. AD-18 and AD-20 are
similarly tight. **The holes cluster exactly where the spine says it was reconciled late** — AD-33 through
AD-37 account for six of the nineteen, and every one of the five critical findings sits on a seam those
five ADs touch.

The single highest-leverage tightening is not any one AD: it is **applying AD-4's discipline to derived
values.** Silhouette geometry (H-4), reachability (H-8), presence state (H-10), network hue (H-12) and the
chart facts (H-17) are all the same bug — one concept, two computing stages, both legal — and one AD
stating *a derived value has exactly one computing stage, named, and every other stage consumes it* would
close five of the nineteen at once.
