---
title: "PRD: Portolan"
status: final
created: 2026-09-11
updated: 2026-09-11
---

# PRD: Portolan

> **Status of this document.** What v1 *is* is decided: 83 functional requirements and 20
> cross-cutting ones, assembled from a complete product brief and two final UX spines, with every
> departure from them declared in §8.3.
>
> **What is not decided is whether the central frame works.** The legibility review's verdict on the
> landing view, measured against a realistic cluster, is: *"It survives as a picture. It does not
> survive as a map of *networks*, which is the product's primary axis."* That is §7.1, and it is the
> first thing architecture must answer — before a rendering library is chosen, and before any story is
> written. A second, related contradiction is in §7.2. Read those two sections before building
> anything.
>
> **Reading order.** Architecture: §7.1, §7.2, §7.3, then §4 in full. Story work: §3, then §6 for what
> each capability costs, then §7.5 for how closed the upstream documents actually are.

## 1. Vision

### What Portolan is

Portolan is a read-only topology map of a Docker Swarm cluster. It runs as a container inside the
swarm it maps, reads the live cluster through the Docker socket on a manager node, and renders the
whole thing as one 2D graph in a browser: nodes, networks, volumes, stacks, services and containers,
and the relations between them.

The relations are the product. The tools people actually run in front of a Swarm cluster already ship
good inventories — a list of services, a list of networks, a list of volumes, each well built and each
separate. None of them answers the question Portolan exists for:

> **Which container sits on which network, and which volume does it use?**

Answering it today means opening six tabs and holding the graph in your head. Portolan answers it in
one picture you can walk into.

### Why this is open ground

Portainer has been asked for this view since 2017 and has never built it. Netdata answers *what talks
to what* — flows. Nobody answers *what is attached to what*. The one tool that rendered a real
relational graph at production quality, Weave Scope, has been dead since 2023 — and it died with an
**open** edge-legibility issue, which is the same defect §7.1 reports as still unsolved here.

**There is no technical moat.** The graph is not a novel invention, the idea has been copyable for
nine years, and the advantage is execution plus a structurally vacant patch of ground. The evidence —
the Portainer issue history, the competitive survey, the market proxies and their disagreements —
lives in `addendum.md` (§8.1).

**The timing looks like the worst thing about this project. It is the best.** Swarm is shrinking as a
named technology, and Portainer itself now advises users to migrate off it. That decline is the
opening rather than the threat: **you cannot migrate a cluster you cannot map.** The corresponding
risk — whether the platform outlives the tool — is in §7.6, and it is a dependency, not a
counter-argument.

### What Portolan is not

| Not | Because |
| --- | --- |
| A management console | No write, management or remediation action exists anywhere in the product. Portolan sits beside Portainer; it does not replace it. |
| A dashboard | No inventory surface, no metrics panel, no charts. |
| An audit tool | No rule engine, no invented threshold, no alerting. Portolan does not tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself. **One declared exception:** the health mark maps counted replica facts onto three colours (FR-12, FR-72), which is a verdict in the strict sense. It is the product's only classification, it invents no threshold, and it is named here rather than denied. |
| A multi-cluster or multi-platform tool | One swarm per instance; Docker Swarm only in v1. |

### Who it serves

**The inheritor — primary.** Handed a Swarm cluster nobody documented, and needing to understand it
before cleaning it up, securing it, handing it over or migrating off. The founding scenario is a
company cluster with no documentation at all, Portainer as the only instrument, and hours or days
spent drawing the picture by hand — a drawing obsolete at the next `stack deploy`, that nobody would
ever redraw. **The unit of value is replacing days of manual diagramming.** This persona skews toward
organisations with budget.

**The Swarm operator — the tribe.** Homelabbers, solo developers, agencies, small teams. Shrinking as
a population and largely unwilling to pay, but these are the people who will file the issues.

**The executive — a viewer, not a user.** Someone with no IT knowledge who wants to see the shape of
the infrastructure, and who will open Portolan themselves in order to show it in a management
meeting. They will not filter, will not click a volume to read a mount point, and do not need to.
What they need is for the landing frame to be legible and presentable on sight.

This third persona sets requirements without becoming an audience with features of its own. Docker
vocabulary is never renamed or prettified for them (FR-80), and there is no simplified mode, no guided
tour and no onboarding surface. The one thing they require of the product is the ability to show the
map without putting the internal addressing plan on a meeting-room wall (FR-51).

**Explicitly not an audience:** the growing population running Swarm underneath a PaaS such as
Dokploy without knowing it. They have no Swarm vocabulary and would not recognise the problem as
theirs. This exclusion is the standing counter-argument to the beachhead, and the case to reopen if
the beachhead stalls (§7.6).

### The bar

Three commitments govern every decision below.

- **Legible over impressive** — the constraint binds *reading load*, not graphic richness. The
  operative form is *plenty to look at, little to read*: density comes from zones, tints, silhouettes,
  edges and type marks, never from text. This reinterpretation is deliberate and it is load-bearing;
  it is also what licenses a graphically heavy landing frame, and NFR-8 is the bill for it.
- **One picture, two readings** — the frame a non-specialist can follow is the same frame that gives
  an expert the cluster at a glance.
- **Portolan is a chart, and it says so.** The name is not decoration: the product is built in the
  register of a sea chart — a graduated bezel, registration marks, a chart legend, coastline-like
  zone contours, cartographer's typography, and chassis language that says *surveyed* and *off-chart*.
  This is why FR-4, FR-48, FR-63, FR-78 and FR-80 exist in the shapes they do; strip the register and
  they read as unmotivated furniture. The full design vocabulary is `DESIGN.md`'s (§8.1).

**In two to three years**, Portolan is what you install on a cluster you do not understand, the way
you reach for a map in an unfamiliar city. Not a platform, not a control plane: one thing, done
properly. Success is that *what does my cluster actually look like* stops being an unanswered
question. Breadth beyond Swarm is deliberately left open; the architecture that keeps it open is not
(NFR-5).

## 2. Success criteria

### First bar — it works for its author

- A truthful picture of an unfamiliar cluster **in minutes**, not hours — measured as: on a cluster
  of the NFR-7 reference order that the author has never seen, the stacks,
  the networks, and which objects sit in which are readable within ten minutes of first opening the
  map.
- *Which container, which network, which volume* answered **without opening a second tool**.
- Reached for **by preference, not by loyalty** — the author picks it up because it is the fastest way
  to the answer, not because he wrote it.

### Second bar — signals outside the author's control

None of these can be manufactured, which is the point of listing them. **At least one** is the
threshold, and they are ordered strongest first.

1. A stranger posts a screenshot of **their own** cluster in Portolan.
2. Someone reports using Portolan to prepare a migration off Swarm — the timing thesis, confirmed.
3. **Someone with no IT skills opens Portolan on a real cluster and can show its shape to other
   people, with the author not in the room.** This is the only criterion that tests the *one picture,
   two readings* bar, which every document so far has asserted and none has verified.
4. It stays readable on a cluster substantially larger than any the author owns.
5. An unprompted issue or pull request from an operator.

**Excluded deliberately: star counts.**

### Counter-metrics

Things that could look like success and would not be.

| Counter-metric | What it would actually mean |
| --- | --- |
| Long sessions in the product | The value is a truthful picture in minutes. Time spent reading the map is cost, not engagement. |
| Heavy filter use on first contact | Filters exist to answer *show me only what touches `backend`*. If the default frame is only usable once filtered, the landing frame has failed — whatever the filter usage says. |
| Screenshots from people who cannot answer the founding question | This is the *survives as a picture, not as a map* failure mode, scoring as success. |
| Requests for write actions or audit rules | Welcome as evidence people use Portolan; granting them would make it a different product. |

## 3. Capabilities

Requirements are grouped by capability and numbered globally. The numbers are stable and are what
epics, stories and reviews refer to: a number is assigned once and never reused, so within a section
they may not run consecutively. Where a requirement carries a figure, the figure is normative.

### 3.1 Collection and liveness

- **FR-1** — Portolan reads the live state of one Docker Swarm cluster through the Docker socket of a
  manager node.
- **FR-2** — Portolan is strictly read-only: no write, management or remediation path exists anywhere
  in the product. The chrome states `READ ONLY` and makes no claim about the mechanism enforcing it.
- **FR-3** — The cluster is re-surveyed on an interval the user selects from 5s / 10s / 30s / 60s,
  defaulting to 10s. A change takes effect at the next survey and alters neither the population nor
  the rendering of the map.
- **FR-4** — The age of the last successful survey is shown in plain words ("Surveyed 4 min ago"). It
  is not a control, and no manual refresh exists anywhere in the product.
- **FR-5** — Staleness is keyed to the age of the survey, never to the configured interval: choosing
  60s does not itself age the chart.
- **FR-64** — A minimum supported Docker Engine API version is declared and checked, and the product
  says so plainly when the engine is older. Two engine behaviours affect what the collector can read
  and are recorded in `addendum.md`: nftables cannot be enabled in Swarm mode, and a known defect
  leaves DNS broken after `swarm init` on some versions.

### 3.2 The map and its graph model

#### Graph model

- **FR-6** — The model holds nodes, networks, volumes, stacks, services and containers, and the edges
  between them.
- **FR-7** — An image is a detail-panel attribute, never a graph node. Consequences: no `image` value
  in the object-type mark family, and no `images` filter. Accepted cost, §6.
- **FR-8** — Network membership renders as an *area* enclosing everything that shares the network,
  never as edges to a network node. Attachment edges remain real edges in the model; only their
  rendering is a stub from the body into the zone field.
- **FR-68** — An attachment stub never renders shorter than 6px on screen. Roughly 94% of the
  graph's edges are stubs, so this floor is what keeps "no rendering choice may dissolve an edge" true
  in the landing frame rather than only in principle.
- **FR-9** — A stack renders as a grouping outline girdling its members, name set on the stroke. A
  stack is neither a bubble nor a filled area.
- **FR-82** — A stack outline's position is *derived*: it follows where the layout placed its
  members and never asks the layout for a position of its own, because two marks owning position is
  the failure the node backdrop was turned off to avoid (FR-41). The outline therefore encloses
  non-members where it cannot thread around them — accepted cost, §6.
- **FR-10** — Zone and outline are two grouping languages and must never read as the same mark: a
  *field bounded only by an open contour* for networks, a *closed boundary carrying no field* for
  stacks. A zone's isoline (FR-40) is an open, fading contour and is not the closed continuous stroke
  a stack outline is; that difference is one of the tells, not an exception to this rule.
#### Mark families

- **FR-11** — Objects carry four mark families in a fixed order — object type, stack, network(s),
  health — where **shape encodes the family and colour encodes the value**. A shape never encodes a
  value. Colour alone is insufficient for two families, network and stack (NFR-14); only the
  network family is given a supplementary channel (FR-65). The stack family's answer is a written
  name, not a mark.
- **FR-65** — Network identity uses *hue plus an octave pattern*: a hue is assigned in creation order
  and held for the life of the network, cycling over six, and a fill pattern marks which octave the
  hue is on. The pattern rides the zone field, not only the badge, so networks stay distinguishable
  at the landing level where the network badge does not render. This is the mitigation for the
  network-channel failure in §7.1, and it is *partial* — it separates octaves, not hues within an
  octave (NFR-14).
- **FR-67** — Marks never render below 8 × 8px. The mark rail has a fixed capacity; when marks no
  longer fit, network badges drop from the right of the network group and no other family is
  dropped, the rail never wraps, and the object's core is never breached. FR-25 is the fallback answer
  when badges have dropped. Capacities and spacings are `DESIGN.md`'s.
- **FR-66** — **The reading ladder and every mark live in screen space.** Type and marks do not scale
  with the canvas transform, and the floors of NFR-10 are floors on *rendered* size. What scales with
  zoom is the map; what stays put is the reading. Without this, a 9.5px label renders at roughly
  2.4px in the very frame the product is judged on and NFR-10 means nothing.
- **FR-12** — Health is counted facts, never an invented threshold: `running = desired`,
  `0 < running < desired`, `running = 0`. An object with no health dimension carries no health mark at
  all; absence is the fourth value.
- **FR-72** — The health mark is blue / amber / red, not green / amber / red. This is not a taste
  decision: it is what makes the health family colour-safe under deuteranopia (NFR-12), and NFR-14's
  accounting depends on it.
#### Bodies and motion

- **FR-13** — A bubble has two silhouette channels and only one is data. *Recognition:* the contour
  is irregular and **seeded from the object's Docker ID**, so it is the same shape across every survey
  and every screenshot, and it stops carrying at far zoom. *Data:* the body stretches toward the
  objects it links to. Bubbles never fuse and never overlap — the layout reserves the deformed hull
  before placing anything, at the cost of fitting fewer objects than circle packing would. Accepted
  cost, §6.
- **FR-70** — Stretch is capped at +32% of base radius, and a single-link object therefore reads as
  a teardrop. Neighbours never squash a body: a silhouette must not depend on who is next to it, or
  the recognition channel dies.
- **FR-69** — Every object has an *invariant core* — its name, identifier and mark rail — that no
  contour, no stretch and no motion may breach.
- **FR-71** — **The map is alive at rest:** bodies breathe continuously, with desynchronised periods so
  the population never pulses in unison. The breathing is **local deformation only, translation 0px**.
  Labels and click targets never travel, at any zoom, scale or density. This is the hardest guarantee
  in the product and it is what makes continuous motion compatible with clicking anything.
  **Above a documented object count the map stops moving**, because continuous motion at reference scale
  does not hold the latency budget of NFR-8. That count is established by measurement during design,
  not asserted here. The stillness is a rendering budget and not a control state: it is never
  reported as something the user chose (FR-77), and FR-61's control remains the user's own. Accepted
  cost, §6.
#### Reading levels and layout stability

- **FR-14** — **Zoom changes sharpness, never population. Filtering changes population, never
  sharpness.** The set of objects present is identical at every zoom level.
- **FR-15** — The map has four reading levels: the whole cluster with type marks and large labels
  only; then service names; then container names; then per-link labels naming what each link
  connects to. Deeper labels are reached by zooming, never by clicking.
  **The primary journey's three discoveries**, referenced throughout this document, are found one per
  level and are what the ladder is for: (1) *the orphan* — an object attached to nothing, seen at the
  landing level; (2) *the intruder* — an object whose stack mark disagrees with the zone it sits in,
  seen once marks resolve; (3) *the twins* — two near-identical volume names read side by side on one
  object, seen only at the deepest level. They are narrated as Flow 1 in `EXPERIENCE.md` (§8.1).
- **FR-16** — **Positions are earned and kept.** Across a survey nothing moves: a new container
  appears near its neighbours, a vanished one fades in place, and neither reclaims space until the
  next relayout. Within a view, exactly three user actions may re-lay the map — *Reorganise*, switching
  zone mode, toggling the node backdrop — and nothing else: no survey, no filter, no selection, no
  search and no panel may move anything. Entering a different view (FR-17) or a different subject
  (FR-20) is a new surface being drawn, not a relayout of this one.

### 3.3 The three views

- **FR-17** — Three views, switched from a bottom tab bar. A tab switch is a complete change of view,
  not a filter.
- **FR-18** — Overview is the landing view: the whole cluster, purely relational, node partition off.
- **FR-19** — Node view puts the machines in the foreground and answers *what runs on this node, and
  is the load spread*.  Network zones and stack outlines are not drawn here.
- **FR-73** — In node view a machine's region is drawn **proportionally to what it carries**, so
  imbalance is read as mass rather than counted. This is the means by which FR-19's question gets
  answered without a metric or a chart. Proportionality has a **floor**: see FR-59.
- **FR-20** — Service view is an ego-graph of one service — its networks, volumes, containers and
  immediate neighbours. It is a semantic zoom, not a geometric one.
- **FR-21** — Service view is reachable only by isolating a selected service, so no empty-subject
  state can exist.

### 3.4 Selection and inspection

- **FR-22** — Clicking an object is one gesture with two answers: the detail panel opens, **and**
  everything transitively reachable from it lights while the rest dims.
- **FR-23** — The reach of that highlight is user-adjustable — one hop, two hops, or all —
  **defaulting to one hop**. At two hops, more than 150 of 325 objects light on a realistic cluster
  and the highlight stops distinguishing anything, which is the mechanism defeating itself. Accepted
  cost, §6. This default supersedes the narration of Flow 1 step 7 in `EXPERIENCE.md`, where the user reduces a wider
  reach to one hop (§8.3).
- **FR-24** — The detail panel is a side panel: never a tab, never a modal, never full-screen, and it
  never replaces the map.
- **FR-79** — The layout is three fixed columns — left menu, canvas, detail panel — above a permanent
  chart legend band and the tab bar. **The panel's column is always reserved**, whether the panel is
  open or not, so opening it never re-lays or reframes the map. The canvas takes every extra pixel;
  the chrome columns never grow.
- **FR-25** — The panel carries factual text only — IPs, image tags, mounts, placement — plus the
  complete network list whenever FR-67 has dropped network badges.
- **FR-26** — Clicking empty background deselects. Selecting a duplicated rendering of an object
  selects the object, not the copy.
- **FR-27** — Hover lifts the hovered object's own contour and nothing else. Nothing in the product
  requires hover in order to be discovered.
- **FR-28** — Every bubble, and in node view every machine's region header, is selectable. Zones,
  stack outlines, edges and the node backdrop are not.
- **FR-29** — Keyboard: chrome controls take ordinary tab focus with a visible focus ring, in DOM
  order. There are no keyboard shortcuts, no keyboard traversal of the graph, and no screen-reader
  equivalent of the map in v1.

### 3.5 Filtering and finding

- **FR-30** — Filters **remove**. Each object type — volumes, networks, services, stacks, containers
  — can be removed from the map.
- **FR-31** — Removing networks removes the zones *and* the network attachment edges. Removing stacks
  removes the outlines and their names, and nothing else.
- **FR-32** — *Keep only this* promotes the reachability highlight of the selected object into a real
  filter, removing the rest, and reuses the same hop reach as FR-23. Clearing it restores the whole
  chart.
- **FR-33** — **The highlight dims; the filter removes.** The two must never be confusable at a
  glance, and their two dim depths must look visibly different.
- **FR-34** — When a filter would empty the map, the excluded objects return as very pale context so
  the user can see what was excluded. This is the one named exception to FR-30.
- **FR-74** — An orphan — an object belonging to no stack — carries **no badge, no ring and no colour
  coding**: the tool does not mark it as abnormal, because that would be a judgement. What it does
  carry is its own contour treatment — dashed, in its own stroke colour, with a flat fill instead of
  the gradient. The dashes say *unattached*; the isolation says everything else, sharpened by the fact
  that everything around it is girdled by a stack outline and it is not. Accepted cost, §6.
- **FR-35** — An orphan counter reads how many objects belong to no stack, and reframes the map onto
  them when clicked. It does not change how orphans are drawn, and it is the mechanism that carries
  FR-74 at scale.
- **FR-36** — **Search by name.** The search field sits in the left menu with the other finding aids.
  Typing **lights the matching objects and dims the rest**, reusing the visual language of selection
  (FR-22) rather than inventing one, and reframes the map onto the tightest frame containing them. A
  single match is also selected, exactly as a click would be. Several matches stay lit and the user
  picks. There is no results list — that would be an inventory surface. No match says so in the chart
  register and changes nothing on the map.
- **FR-37** — Search matches object names **and image tags**. Searching an image tag lights every
  container sharing it, recovering on request what FR-7 gave up at a glance, at no cost to the graph.
  Lighting rather than only reframing is what makes this work: containers sharing an image are
  scattered across the cluster, so a frame wide enough to hold them all is a frame too wide to render
  their names.
- **FR-83** — Search reaches objects a filter has removed. A match that is currently filtered out is
  reported as found and filtered, not silently absent — otherwise search would lie about what the
  cluster contains, which is the one thing Portolan exists not to do.
- **FR-38** — Search removes nothing and never re-lays the map. It is a finding aid, not a filter.

### 3.6 Display controls

- **FR-39** — Display controls change how present things are drawn; they never change the population.
- **FR-40** — Zone rendering has two switchable modes: blended tint fields with contour isolines
  (default, and therefore the exported frame), and disjoint blobs with echo copies. Switching re-lays
  the map as a visible movement — nothing may fade out and reappear, because the user has to follow
  objects by eye. Accepted cost, §6.
- **FR-41** — The node backdrop is off by default and can be turned on; doing so reimposes the node
  partition and re-lays the map. Only one mark may own position on a surface, which is why it is off.
- **FR-42** — Text size and density are separate first-class controls and stay separate.
- **FR-43** — Colour is chosen as a whole predefined palette, never swatch by swatch, so the contrast
  floors stay a property the product can guarantee.
- **FR-44** — Dark and light are both first-class; overlapping translucent zones must work in both.
- **FR-75** — **Dark is the default.** Light is not a fallback: it is the palette that survives the
  dense frame best, and it is the one to reach for when the frame is going somewhere with a light
  background.
- **FR-45** — `prefers-reduced-motion` stills every continuous motion and keeps every
  action-triggered transition: decorative motion removed, explanatory motion kept. The layered first
  draw (FR-53) is explanatory and is kept.
- **FR-61** — All continuous motion can be stopped **from inside the product**, as a display control,
  independently of the operating-system setting. Motion joins text size, density, theme and zone mode
  as a display control rather than being the one such setting with no surface.
- **FR-62** — The text-size control reaches a setting that meaningfully enlarges type beyond the
  current +15% ceiling. Because the left menu and the detail panel are fixed-width columns (FR-79),
  overflow behaviour for chassis text must be specified at every step of the range — the ceiling is
  whatever that specified behaviour can honestly carry, and it is set during design, not asserted
  here.

### 3.7 Chrome surfaces

- **FR-76** — A toolbar sits above the canvas and carries no information of its own: *Fit to chart*,
  *Reorganise*, and — while an object is selected — *Isolate* and *Keep only this*. **Fit to chart
  must exist on screen**: it is the only route back to the whole-cluster frame, and FR-29 leaves no
  keyboard *shortcut* for it. It is tab-focusable like every other chrome control.
- **FR-77** — One control vocabulary throughout. A control has exactly three states and no others:
  **action** (momentary), **latched** (reports a live state the user put it in, and clicking again
  clears it), and **unavailable** — present but inert, shown rather than hidden so the toolbar never
  reflows under the pointer. **No control anywhere is a filled button**: this is a read-only product
  and it has no primary action.
- **FR-78** — The chart legend is a **permanent band beneath the canvas**, not a summonable panel. It
  is part of the chart, which is why it also ships inside the export (FR-48).
- **FR-63** — The legend must be able to decode the chart it belongs to: it enumerates the networks
  actually present on the chart, not a fixed palette, and its typographic specimen renders without
  wrapping — wrapping destroys the adjacency that is the specimen's whole purpose.

### 3.8 Voice

- **FR-80** — **Two vocabularies, strictly separated.** The chassis speaks chart — *surveyed*,
  *off-chart*, *reorganise*, *fit to chart*. Anything naming a real cluster thing speaks Docker and is
  never renamed or prettified — *service, network, volume, stack, node, container, image*. An object's
  name stays what an admin would type in their terminal. Spelling is en-GB, a deliberate exception
  (`Reorganise` is a shipped control name).
- **FR-81** — Short, complete sentences. No exclamation marks, no encouragement, no celebration, no
  emoji. **The product never restates the health mark in words**: the panel says *"3/5 replicas
  running."*, never *"degraded"*.

### 3.9 Export and sharing

- **FR-46** — The map can be exported as SVG and as PNG.
- **FR-47** — Export is what-you-see-is-what-you-get: current framing, current zoom and active
  filters are respected literally. One declared exception, and it is the default case: masking is
  on for the export and off for the screen (FR-50, FR-51), so by default the exported frame carries
  no address while the screen does. Accepted cost, §6.
- **FR-48** — The chart legend, the graduated bezel and the registration marks are part of the chart
  and ship inside the export. They cannot be cropped out.
- **FR-49** — *Masking* hides every IP and every CIDR while leaving the structure intact:
  silhouettes, zones, outlines, every edge, every object name, every mark. A masked value keeps an
  identical footprint so nothing reflows.
- **FR-50** — Masking is available for the export, on by default. Unticking it is one click: no
  dialog, no warning, no confirmation. The product defaults; it does not judge.
- **FR-51** — Masking is also available for the screen, as a display control, so the map can be
  shown in a meeting without putting the internal addressing plan on the wall. Off by default —
  the operator wants to see the addresses. The screen and export settings are independent: turning
  one on does not turn the other on. This extends `DESIGN.md`, which scopes masking to the exported
  frame only (§8.3).
- **FR-52** — The product states plainly what survives masking and is still identifying: object
  names, stack names, and the shape of the topology itself. It never implies the export is anonymous.

### 3.10 States

- **FR-53** — Cold load: the map draws itself in layers — zones, then bodies, then edges — and ends
  on a distinct settling gesture, so that *loading* and *living* never look the same.
- **FR-54** — Stale data or a failed survey: **the map stays.** It pales and desaturates in place
  while the survey stamp ages in words. Never hidden, covered or replaced: no banner, no overlay, no
  error screen, no error colour.
- **FR-55** — The detail panel does not take the map's staleness veil; its text holds full contrast.
  The survey stamp carries the age for both.
- **FR-56** — A panel whose subject vanished between surveys stays, freezes its values, and reads
  *"Not in the last survey."* It is dismissed by the next click, never by itself.
- **FR-57** — Socket unreachable with no map ever drawn: a full-surface screen — the only screen in
  the product allowed to teach — stating what is missing, why Portolan needs it, and the exact
  configuration line that fixes it.
- **FR-58** — Empty cluster: the node backdrop renders even though it is off by default, because the
  machines are the whole of what there is.
- **FR-59** — A machine carrying nothing still renders as a full region with its header and one line
  of marginalia — the floor on FR-73's proportionality. A node with nothing on it is information, and
  it must not shrink to the point of disappearing to make that point.
- **FR-60** — Below the minimum viewport: an honest off-chart message rather than a degraded
  rendering.

## 4. Cross-cutting requirements

### 4.1 Deployment and exposure

- **NFR-1** — Portolan ships as a single container image, installed with one `docker stack deploy`,
  running inside the swarm it maps. One swarm per instance.
- **NFR-2** — **There is no authentication in v1.** Portolan must therefore not be served on an
  address reachable from outside the internal network. The mechanism — internal-only network, reverse
  proxy, VPN — belongs to architecture; the constraint belongs to the product. Without it, v1 is an
  unauthenticated full-topology viewer with one-click export, which is precisely the artefact the
  brief warned against.
- **NFR-3** — Reading the cluster requires the Docker socket of a manager node, which is effectively
  root over the entire swarm. Whether that socket can be mediated by a read-restricted proxy is an
  architecture decision. Read-only at the product level is a promise, not a mechanism, and the
  product never claims otherwise in its chrome — `:ro` on a socket mount does not restrict the
  Docker API.
- **NFR-4** — Air-gapped by construction: no CDN, no external font, no external asset. Everything the
  browser needs is served by Portolan itself, including its fonts. Accepted cost, §6.

### 4.2 Architecture seams

- **NFR-5** — The graph model and the renderer stay independent of the Swarm-specific collector.
  Three seams — collector, model, renderer — so that a second source of truth is later a new
  collector rather than a rewrite. This is a binding input to architecture.
- **NFR-6** — The UI couples to the collector in exactly three places, named here so a second
  collector knows what it changes: the rule that objects keep Docker vocabulary (FR-80), the
  socket-unreachable screen (FR-57), and the engine-too-old message (FR-64).

### 4.3 Scale and performance

- **NFR-7** — The reference cluster the product must hold is a few hundred objects: 6 nodes,
  14 stacks, 40 services, 300 containers, 11 overlay networks, 25 volumes, at ~2.2 networks per
  container — 396 objects in total. Two smaller counts appear in the legibility arithmetic quoted
  in this document and both are narrower than the cluster: 325 is containers and volumes only,
  which upstream plainly calls *the figure most favourable to the design*, and 365 is the
  honest bubble count once services are included — and services are bubbles here (FR-15, FR-28). Where
  a figure below is quoted against 325, read it as optimistic. Verification requires a real cluster of
  this order, not a three-container lab.
- **NFR-8** — **Interaction latency is the performance requirement; there is no frame-rate floor.**
  At the NFR-7 reference scale, on integrated graphics, pan, zoom, selection, filtering and search
  respond within 100ms of the input. Continuous motion (FR-71) carries no cadence requirement at all —
  it is the thing that yields, by going still above a documented object count, and a build whose
  breathing stutters at scale does not fail this requirement while a build that takes half a second to
  pan does. This settles what was otherwise an unarbitrated collision: as designed, continuous motion
  re-tessellates on the order of 9,000 Bézier segments per frame across the bodies, which the
  legibility review concluded would not hold.
- **NFR-9** — Two rendering questions are carried to architecture. **First, mark sizing.** FR-66
  settles one axis — marks live in screen space and do not scale with the canvas transform — and
  leaves the other open: whether a mark is sized relative to the *rendered body* it sits on. The two
  axes are independent and only the first is decided. The open one is not merely open, it is
  **contradictory as currently specified**, and §7.2 states the conflict rather than pretending
  architecture has a free choice. **Second, the luminance clamp** on composited zone fields, on which
  the entire ≥3:1 edge guarantee rests, and which nobody has decided.
- **NFR-19** — The front-end stack and graph rendering library are unchosen. Neither the brief nor
  the UX phase addressed them, and NFR-8 makes the choice consequential.

### 4.4 Legibility and accessibility floors

- **NFR-10** — Type floors, on *rendered* size (FR-66): 9px for anything naming a cluster object, 8px
  for chassis annotation. A label that cannot meet its floor is not rendered at that reading level —
  it is never shrunk to fit.
- **NFR-11** — Contrast floors: 7:1 for the *identifier channel* (an object's name, its identifier set
  on the body, and the text of a link label — that is, every string whose job is telling two similar
  objects apart, NFR-20); 4.5:1 for chassis text and marks, 4:1 for health; 3:1 for both edge kinds
  over the worst composited zone field; and 3:1 for the focus ring. The written names NFR-14 relies on
  for stack and zone identity are *not* in the identifier channel and are held to 4.5:1. **Three states are exempt and the exemption is deliberate:** the staleness veil
  (FR-54), under which text holds above 4.2:1 but the health mark does not reach its 4:1 floor; the
  reachability dim (FR-33), whose whole purpose is *present, never readable, never removed*; and the
  empty-filter pale context (FR-34). A state whose meaning is illegibility cannot be held to a
  legibility floor, but it must be named rather than silently excepted.
- **NFR-12** — Colour never carries a dimension on its own: shape encodes the mark family (FR-11), so
  *which dimension you are reading* never depends on hue.
- **NFR-13** — **Within one octave, the six zone hues must be mutually separable under simulated
  deuteranopia, in both palettes.** Across octaves, sameness of hue is intended and is answered by
  FR-65's pattern — networks 1 and 7 share a hue by design, so a blanket "no two tints alike" would
  contradict FR-65 and is not what is required. What is required is that the six be distinguishable
  from each other. Two tints of the **light** palette currently simulate to a byte-identical value,
  which is a defect rather than an acceptable residual — the more so because the light palette is the
  one that holds the dense frame best (FR-75). **Owner: design, before implementation of the
  palette.**
- **NFR-14** — **Accepted and stated:** value-level colour separation is achieved for the object-type
  and health families (ΔE 20.5 and 18.7 under deuteranopia) and *not* for the stack and network
  families (ΔE 3.9 and 2.6). FR-65's octave pattern separates octaves, not hues within an octave.
  Their identity is carried by written names — 6.6–7.8:1 on a stack outline, 13.8:1 for a zone label —
  not by colour. Named consequence: a deuteranope cannot make the second of the primary journey's
  three discoveries from the map alone.
- **NFR-20** — Identifiers are set in a monospaced face whose lowercase `l` is serifed and whose zero
  is slashed, and same-family link labels share a baseline. This is an accessibility requirement, not
  a typographic preference: it is what makes `pgdata`, `pg-data`, `pg_data` and `pgdatal` four visibly
  different strings at label size, which is the mechanism of the primary journey's third discovery.

### 4.5 Licence and localisation

- **NFR-17** — Licensed **AGPLv3**. The specific risk guarded against is someone running Portolan as
  a hosted service without contributing back; AGPL closes exactly that while remaining OSI-approved,
  with Grafana as the nearby precedent. Permissive licensing was rejected as insufficient protection,
  and source-available (BSL) was rejected outright — for a project whose earliest adopters are
  homelabbers, a non-OSI licence costs more trust than it protects revenue. **This is a deviation from
  a niche where permissive licensing dominates, and it is deliberate.**
- **NFR-18** — UI in English, strings externalised from the first commit, French shipped. A new
  language is a file, not a code change.

## 5. Out of scope for v1

Everything v1 excludes, in one list. Each is a decision, not an omission, and each points at where it
is stated rather than restating it.

- **No write, management or remediation action** (FR-2).
- **No audit engine, rule set, invented threshold or alerting** (§1). The security outcome stays
  reachable — the user spots the anomaly by seeing the map — but Portolan never names it.
- **No multi-cluster, and nothing that is not Docker Swarm** (NFR-1).
- **No authentication, accounts or sessions** — see NFR-2 for what this obliges.
- **NFR-15** — No screen-reader equivalent of the map, no keyboard traversal of the graph, and no
  keyboard shortcuts. Chrome controls remain tab-focusable (FR-29).
- **NFR-16** — Desktop and laptop browsers only, 1440px and up, recent Chromium, Firefox and Safari.
  No tablet, no mobile, no responsive behaviour: 1440px is a floor, not a breakpoint, and there is no
  second layout.
- **No images as graph nodes, and no `images` filter** (FR-7, recovered on request by FR-37).
- **No stack rendered as a bubble or as a filled area** (FR-9).
- **No manual refresh** (FR-4).
- **No 3D, perspective or isometry.** Depth is stylistic, never spatial.

## 6. Accepted costs

Named here so that no capability above reads as unqualified.

| Cost | Incurred by |
| --- | --- |
| You cannot see at a glance who shares an image — only on request. | FR-7, recovered by FR-37 |
| In the disjoint-blob zone mode, an object's edges are split between its copies, so neither copy shows it in full — in a product whose thesis is that the edges are the product. | FR-40 |
| An export taken from the landing frame ships without the fine labels, because the export is literal. | FR-47 |
| On a large cluster an orphan can recede into the background, since isolation is its only mark. | FR-74, mitigated by FR-35 |
| A stack outline encloses non-members wherever it cannot thread around them. | FR-82 |
| Fewer objects fit than circle packing would allow, because the layout reserves the deformed hull. | FR-13 |
| The transitive questions the product exists for need the reach raised by hand, since the default is one hop. | FR-23 |
| Embedded fonts add a few hundred KB to the image. | NFR-4 |
| **On a large cluster the map stops being alive** — exactly the cluster where Portolan is most useful. Two users on two clusters see two different products, and the liveliness that was chosen deliberately is the thing that goes. | FR-71, forced by NFR-8 |
| **By default the exported frame is not what is on screen**: the export masks addresses and the screen does not. | FR-47, FR-50, FR-51 |

## 7. Open questions and risks

### 7.1 The principal risk — default legibility before any filter

This is the product's main open engineering question, carried from the brief and still open after the
UX phase. The legibility review's verdict, measured against the NFR-7 reference cluster:

> **It survives as a picture. It does not survive as a map of *networks*, which is the product's
> primary axis.**

What the review establishes as **won**, and what must not be lost: rendering networks as areas rather
than edges (FR-8) converts about 660 of 700 edges into local stubs, leaving about 40 long edges and
about five expected crossings. *Portolan does not hairball; Weave Scope's grave is genuinely avoided* —
though that grave was an open edge-legibility issue — the same class of defect as the one that remains
broken here. Keeping images off the map (FR-7) is rated the single highest-value legibility decision
taken.

What **breaks** instead, and it breaks in the one frame the product is judged on: at the landing
reading level, composited tints turn to mud past a handful of overlapping zones, the attachment stub
falls to about 2px, and the network mark that was supposed to rescue both is switched off at that
level by the reading ladder. **Bodies land at 14–28px across against a nominal container diameter of
92px — a factor of five, not the factor of two an earlier draft of this section implied.**

Worse, those figures were computed on a 1204px canvas, which is the width with the detail panel
closed. FR-79 reserves that column permanently, so the operative canvas is 884px — the width every
upstream measurement was tuned at — and the operative body sits at the bottom of the range, near 14px.
Every figure quoted in this section is therefore optimistic, and so is the 325-object count it is
computed against (NFR-7).

Three requirements answer parts of this failure — FR-65 puts an exact network answer back into the landing frame
by riding the pattern on the zone field, FR-68 floors the stub, FR-67 floors the marks — and none of
them is proof. `DESIGN.md` calls the network channel *partly repaired*, which is the honest word.

**This is not resolved by this PRD.** It is the first thing architecture must answer, and NFR-7 says
what answering it requires: a real cluster of a few hundred objects.

### 7.2 The second risk — mark sizing at the landing level

**This is contradictory as specified, not merely undecided.** FR-11 makes the marks the encoding,
FR-13 makes the body's stretch the data, FR-67 floors a mark at 8 × 8px and FR-66 puts it in screen
space. On a 14px body an 8px mark is over half the body and buries the stretch channel; a mark sized to
the body instead falls below the 8px floor and stops being readable.

**One of those four requirements has to yield at the landing level, and this PRD does not decide
which.** The candidates, each with its cost: drop marks entirely at the landing level, which costs the
non-specialist the one channel they can read; raise the body size by cutting the reference population,
which means admitting a smaller cluster than NFR-7 claims; or give the landing level a mark budget
smaller than the other levels', which means a fifth reading level in all but name.

### 7.3 Carried to architecture

Ordered. The first row is the one that decides whether the product works at all.

| Question | Consequence if left open |
| --- | --- |
| **Default legibility of the landing frame before any filter (§7.1)** | The product's primary axis stays unverified. Answering it needs a real cluster of NFR-7 order, and it gates the rest of this table. |
| Mark sizing at the landing level (§7.2, NFR-9) | Four requirements cannot all hold; whichever yields changes the encoding. |
| Where the map is served, to whom, over what (NFR-2) | The v1 the brief warned about. |
| Whether the manager socket can be mediated by a read-restricted proxy (NFR-3) | Read-only stays an intention rather than an enforcement. |
| The luminance clamp on composited zone fields (NFR-9) | The ≥3:1 edge floor is not a real guarantee. |
| Front-end stack and graph rendering library (NFR-19) | Unchosen, and NFR-8 makes it consequential. |

### 7.4 Carried to design

Severity first.

- **FR-63 cannot be satisfied in the space FR-78, FR-79 and NFR-16 leave.** With the panel column
  reserved, the legend band's six columns are about 147px each; the typographic specimen is 230px and
  must not wrap, and the zone column must enumerate up to eleven networks where six swatches fit.
  Either the legend gets more room, fewer jobs, or a different shape. As written, the requirement is
  arithmetically impossible rather than merely hard.
- **Three thresholds this document deliberately refuses to invent**, each deferred here by name: the
  text-size ceiling (FR-62, "set during design, not asserted here"); the object count above which the
  map goes still (FR-71, "established by measurement during design"); and the light-palette tint
  collision, whose owner NFR-13 names as *design, before implementation of the palette*.
- **The two grouping languages coincide in position.** Measured: 455px of one stack outline's 1140px
  perimeter runs within 14px of a network isoline; 346px of another's 1961px within 14px of a second.
  The seven tells that distinguish zone from outline separate them *in kind*, never *in distance*. A
  **contour** may never be displaced to buy clearance; only a zone *label* may move, and only where a
  clear position exists.
- **Some zone labels have nowhere to go** — best available clearance measured at 4.9px and 0.8px.
- **Whether the octave pattern of FR-65 resolves at badge size**, with roughly 6px of interior next to
  as many as five other marks. If it does not, the network answer at the middle reading levels falls
  back to the zone field and the detail panel, which is where it already is at the landing level.
- **Two verifications the upstream documents ask for explicitly**: the four near-identical volume names
  rendered at real label size in the real face (NFR-20), and the octave patterns at badge size.

### 7.5 The state of the upstream documents

Architecture and stories will read `DESIGN.md` and `EXPERIENCE.md` directly, so they need to know how
closed those documents actually are. Both are `status: final` and both went through four review
lenses, which consolidated 78 findings. But **23 `[ASSUMPTION]` markers and 11
`[DEPARTS FROM BRIEF]` markers survive into the final text across the two documents**, and the UX log
does not record which fix covers which finding — so per-finding closure cannot be verified from it.
Treat an `[ASSUMPTION]` marker in either spine as genuinely undecided until someone decides it, not as
a formality left behind.

**This PRD closes at least eleven of them, and says so here rather than closing them quietly**: the
refresh default (FR-3), the node view's appearance and its region rule (FR-19, FR-73), the hover
affordance (FR-27), the node backdrop's non-selectability (FR-28), the reduced-motion kept set (FR-45),
the layered first draw (FR-53), the detail panel's stale and vanished-subject states (FR-55, FR-56),
the chart legend being permanently present (FR-78), the export masking default (FR-50), and the
screen-space rule (FR-66) — which `EXPERIENCE.md` marks *"Nobody decided this."* Anything in this list
is now decided **by this document**, and the spines should be read as superseded on those points.

### 7.6 Standing counter-arguments, retained on purpose

- **The excluded PaaS population is the case to reopen if the beachhead stalls.** A Swarm-*only* tool
  sells to the segment that self-identifies as Swarm users — small, unpaid, shrinking — while a large
  and growing population runs Swarm underneath something else without naming it.
- **Swarm's platform longevity is an unresolved dependency, not a product decision.** The "supported
  through at least 2030" pledge predates Mirantis's acquisition by IREN and has not been reaffirmed
  since; MKE 4 is k0s-based and contains no Swarm; the furthest documented Swarm end-of-life is
  MKE 3.9 in March 2028.
- **The market evidence has named holes.** Reddit was unreachable on both research passes, so the
  likeliest audience's sentiment is unassessed, and no primary source for Swarm market size exists —
  every figure is a proxy and the proxies disagree by 3.4×. Re-check before any go-to-market claim.

## 8. Provenance and declared departures

### 8.1 What this PRD was built from, and what each source still holds

| Source | What it still holds that this PRD does not |
| --- | --- |
| `briefs/brief-Portolan-2026-09-09/brief.md` | The product intent in its original voice, and the founding scenario as narrative. |
| `briefs/brief-Portolan-2026-09-09/addendum.md` | All research depth: competitive survey, the Portainer issue history, market proxies and their contradictions, evidence caveats, engine defect references. |
| `ux-designs/ux-Portolan-2026-09-10/DESIGN.md` | The whole visual system — 142 colour tokens, 28 components, every measured contrast figure, geometry, spacing, motion specification, the brand register in full. |
| `ux-designs/ux-Portolan-2026-09-10/EXPERIENCE.md` | The behaviour specification in detail, and the four user journeys with their discovery beats. |
| `ux-designs/ux-Portolan-2026-09-10/validation-report.md` and the review files | The 78 consolidated findings with their arithmetic. |

The PRD is the authority on *what* v1 is. Where a figure or mechanism is stated once here and in full
upstream, upstream governs the detail — **except for the additions below, which have no upstream at
all** and are therefore specified here or nowhere.

### 8.2 Additions with no upstream

| Addition | Status |
| --- | --- |
| Object search, including image tags (FR-36, FR-37, FR-38, FR-83) | Decided 2026-09-11. Absent from both spines; the wireframe draws a search field the spines never mention. Field placement, match behaviour, the no-match state and the interaction with filters are specified in §3.5 because no other document specifies them. |
| Screen-side address masking (FR-51) | Decided 2026-09-11. Extends a mechanism `DESIGN.md` scopes to the export only. |
| A minimum Docker Engine API version, declared and checked (FR-64) | Decided 2026-09-11. No upstream document sets one; it adds a third collector-coupled surface (NFR-6). |

### 8.3 Departures declared

| Departure | From | Why |
| --- | --- | --- |
| SVG/PNG export is **in** v1 (FR-46–FR-52). | The brief puts it out of v1: *"screenshot accepted for now."* | Ratified during the UX phase. The real argument is not the screenshot's convenience: a screenshot cannot carry the chart legend, the bezel or a chosen framing — and it cannot mask an address. |
| Masking applies to **the screen** as well as the export (FR-51). | `DESIGN.md` scopes the mask to the exported frame only. | Decided 2026-09-11. The executive viewer opens the live map in a meeting; the export path does not cover that. |
| The refresh interval reaches **60s** (FR-3). | The brief says *"every 5–10s, configurable."* | Ratified during the UX phase when the interval was given a control surface. |
| The health mark is a **verdict** (FR-12, FR-72). | The brief's *"no threshold, no rule, no verdict."* | Declared upstream and narrowed since: the mapping uses only counted replica facts, so no threshold is invented. It remains the product's only classification, and §1 names it rather than denying it. |
| *Legible over impressive* binds **reading load**, not graphic richness. | The brief's plain reading. | Deliberate and load-bearing; it is what licenses a graphically dense landing frame, and NFR-8 is the bill. |
| Colour is chosen as whole palettes, never swatch by swatch (FR-43). | The brief's *"display control (what is shown, colours, text size)."* | A free colour picker would let the user break the contrast floors the palettes exist to guarantee. Declared upstream. |
| Network membership is encoded off the bubble fill and onto zones plus marks (FR-11, FR-65). | The brief's *"colour carries network membership."* | Declared upstream. Zones carry membership; the mark carries the exact answer. |
| The reading ladder **removes** labels rather than shrinking them (FR-15, NFR-10). | The brief's *"all object types from the start"* read as all information at all times. | Declared upstream. A label below its floor is dropped, never shrunk. |
| **One hop** is the default reach (FR-23). | Flow 1 step 7 in `EXPERIENCE.md`, where the user reduces a wider reach *to* one hop. | The arithmetic is binding and the narration is illustrative: at two hops the highlight lights half the cluster. That journey step is now stale and should be renarrated when `EXPERIENCE.md` is next touched. |
