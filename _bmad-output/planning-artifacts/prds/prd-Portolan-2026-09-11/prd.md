---
title: "PRD: Portolan"
status: draft
created: 2026-09-11
updated: 2026-09-11
---

# PRD: Portolan

## 1. Vision

### What Portolan is

Portolan is a read-only topology map of a Docker Swarm cluster. It runs as a container inside the
swarm it maps, reads the live cluster through the Docker socket on a manager node, and renders the
whole thing as one 2D graph in a browser: nodes, networks, volumes, stacks, services and containers,
and the relations between them.

The relations are the product. Every tool in this space already ships a good inventory — a list of
services, a list of networks, a list of volumes, each well built and each separate. None of them
answers the question Portolan exists for:

> **Which container sits on which network, and which volume does it use?**

Answering it today means opening six tabs and holding the graph in your head. Portolan answers it in
one picture you can walk into.

### What Portolan is not

| Not | Because |
| --- | --- |
| A management console | No write, management or remediation action exists anywhere in the product. Portolan sits beside Portainer; it does not replace it. |
| A dashboard | No inventory surface, no metrics panel, no charts. |
| An audit tool | No rule engine, no thresholds, no alerting. Portolan does not tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself. |
| A multi-cluster or multi-platform tool | One swarm per instance; Docker Swarm only in v1. |

### Who it serves

**The inheritor — primary.** Handed a Swarm cluster nobody documented, and needing to understand it
before cleaning it up, securing it, handing it over or migrating off. The founding scenario is a
company cluster with no documentation at all, Portainer as the only instrument, and hours or days
spent drawing the picture by hand — a drawing obsolete at the next `stack deploy`, that nobody would
ever redraw. **The unit of value is replacing days of manual diagramming.**

**The Swarm operator — the tribe.** Homelabbers, solo developers, agencies, small teams. Shrinking as
a population and largely unwilling to pay, but these are the people who will file the issues.

**The executive — a viewer, not a user.** Someone with no IT knowledge who wants to see the shape of
the infrastructure, and who will open Portolan themselves in order to show it in a management
meeting. They will not filter, will not click a volume to read a mount point, and do not need to.
What they need is for the landing frame to be legible and presentable on sight.

This third figure sets requirements without becoming an audience with features of its own. Docker
vocabulary is never renamed or prettified for them — an object's name stays what an admin would type
in their terminal — and there is no simplified mode, no guided tour and no onboarding surface. The
one thing they do require of the product is the ability to show the map without putting the internal
addressing plan on a meeting-room wall (see *Presentation masking*, §3).

**Explicitly not an audience:** the growing population running Swarm underneath a PaaS such as
Dokploy without knowing it. They have no Swarm vocabulary and would not recognise the problem as
theirs. This exclusion is the standing counter-argument to the beachhead, and the case to reopen if
the beachhead stalls.

### The bar

Two sentences govern every decision below, and they are in tension on purpose:

- **Legible over impressive** — the constraint applies to *reading load*, not to graphic richness.
  The operative form is *plenty to look at, little to read*: density comes from zones, tints,
  silhouettes, edges and type marks, never from text.
- **One picture, two readings** — the frame that a non-specialist can follow is the same frame that
  gives an expert the cluster at a glance.

## 2. Success criteria

### First bar — it works for its author

- A truthful picture of an unfamiliar cluster **in minutes**, not hours.
- *Which container, which network, which volume* answered **without opening a second tool**.

### Second bar — signals outside the author's control

None of these can be manufactured, which is the point of listing them.

- A stranger posts a screenshot of **their own** cluster in Portolan.
- Someone reports using Portolan to prepare a migration off Swarm.
- It stays readable on a cluster substantially larger than any the author owns.
- An unprompted issue or pull request from an operator.
- **Someone with no IT skills opens Portolan on a real cluster and can show its shape to other
  people, with the author not in the room.** This is the only criterion that tests the
  *one picture, two readings* bar, which every document so far has asserted and none has verified.

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
epics, stories and reviews refer to: a number is assigned once and never reused, so within a
section they may not run consecutively. Where a requirement carries a figure, the figure is
normative.

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

### 3.2 The map and its graph model

- **FR-6** — The model holds nodes, networks, volumes, stacks, services and containers, and the edges
  between them.
- **FR-7** — An image is a detail-panel attribute, never a graph node. Consequences: no `image` value
  in the object-type mark family, and no `images` filter. Accepted cost: you cannot see at a glance
  who shares an image — see FR-37.
- **FR-8** — Network membership renders as an *area* enclosing everything that shares the network,
  never as edges to a network node. Attachment edges remain real edges in the model; only their
  rendering is a stub from the body into the zone field.
- **FR-9** — A stack renders as a grouping outline girdling its members, name set on the stroke. A
  stack is neither a bubble nor a filled area.
- **FR-10** — Zone and outline are two grouping languages and must never read as the same mark:
  tinted field with no boundary for networks, boundary with no field for stacks.
- **FR-11** — Objects carry four mark families in a fixed order — object type, stack, network(s),
  health — where **shape encodes the family and colour encodes the value**. A shape never encodes a
  value.
- **FR-12** — Health is counted facts, never a verdict Portolan invents: `running = desired`,
  `0 < running < desired`, `running = 0`. An object with no health dimension carries no health mark
  at all; absence is the fourth value.
- **FR-13** — A bubble's silhouette carries data: it stretches toward the objects it links to.
  Bubbles never fuse and never overlap — the layout reserves the deformed hull before placing
  anything.
- **FR-14** — **Zoom changes sharpness, never population. Filtering changes population, never
  sharpness.** The set of objects present is identical at every zoom level.
- **FR-15** — The map has four reading levels: the whole cluster with type marks and large labels
  only; then service names; then container names; then per-link labels naming what each link
  connects to. Deeper labels are reached by zooming, never by clicking.
- **FR-16** — **Positions are earned and kept.** Across a survey nothing moves: a new container
  appears near its neighbours, a vanished one fades in place, and neither reclaims space until the
  next relayout. Exactly three user actions may relay the map — *Reorganise*, switching zone mode,
  toggling the node backdrop — and nothing else, ever.

### 3.3 The three views

- **FR-17** — Three views, switched from a bottom tab bar. A tab switch is a complete change of view,
  not a filter.
- **FR-18** — Overview is the landing view: the whole cluster, purely relational, node partition off.
- **FR-19** — Node view puts the machines in the foreground and answers *what runs on this node, and
  is the load spread*. Network zones and stack outlines are not drawn here.
- **FR-20** — Service view is an ego-graph of one service — its networks, volumes, containers and
  immediate neighbours. It is a semantic zoom, not a geometric one.
- **FR-21** — Service view is reachable only by isolating a selected service, so no empty-subject
  state can exist.

### 3.4 Selection and inspection

- **FR-22** — Clicking an object is one gesture with two answers: the detail panel opens, **and**
  everything transitively reachable from it lights while the rest dims.
- **FR-23** — The reach of that highlight is user-adjustable — one hop, two hops, or all —
  **defaulting to one hop**. At two hops, more than 150 of 325 objects light on a realistic cluster
  and the highlight stops distinguishing anything, which is the mechanism defeating itself.
- **FR-24** — The detail panel is a side panel: never a tab, never a modal, never full-screen, and it
  never replaces the map.
- **FR-25** — The panel carries factual text only — IPs, image tags, mounts, placement — plus the
  complete network list whenever the mark rail has had to drop network badges.
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
  glance.
- **FR-34** — When a filter would empty the map, the excluded objects return as very pale context so
  the user can see what was excluded. This is the one named exception to FR-30.
- **FR-35** — An orphan counter reads how many objects belong to no stack, and reframes the map onto
  them when clicked. It does not change how orphans are drawn.
- **FR-36** — **Search by name.** Typing in a search field reframes the map onto the matching objects,
  at a zoom level where their names render. A single match is also selected, exactly as a click
  would. Several matches reframe onto the set and the user picks. There is no results list — that
  would be an inventory surface.
- **FR-37** — Search matches object names **and image tags**. Searching an image tag reframes onto
  every container sharing it, recovering on request what FR-7 gave up at a glance, at no cost to the
  graph.
- **FR-38** — Search removes nothing and never relays the map. It is a finding aid, not a filter.

### 3.6 Display controls

- **FR-39** — Display controls change how present things are drawn; they never change the population.
- **FR-40** — Zone rendering has two switchable modes: blended tint fields with contour isolines
  (default, and therefore the exported frame), and disjoint blobs with echo copies. Switching relays
  the map as a visible movement — nothing may fade out and reappear.
- **FR-41** — The node backdrop is off by default and can be turned on; doing so reimposes the node
  partition and relays the map.
- **FR-42** — Text size and density are separate first-class controls and stay separate.
- **FR-43** — Colour is chosen as a whole predefined palette, never swatch by swatch, so the contrast
  floors stay a property the product can guarantee.
- **FR-44** — Dark and light are both first-class; overlapping translucent zones must work in both.
- **FR-45** — `prefers-reduced-motion` stills every continuous motion and keeps every
  action-triggered transition: decorative motion removed, explanatory motion kept.

- **FR-61** — All continuous motion can be stopped **from inside the product**, as a display
  control, independently of the operating-system reduced-motion setting. Motion joins text size,
  density, theme and zone mode as a display control rather than being the one such setting with no
  surface.
- **FR-62** — The text-size control reaches a setting that meaningfully enlarges type beyond the
  current +15% ceiling. Because the left menu and the detail panel are fixed-width columns, overflow
  behaviour for chassis text must be specified at every step of the range — the ceiling is whatever
  that specified behaviour can honestly carry, and it is set during design, not asserted here.

### 3.7 Export and sharing

- **FR-46** — The map can be exported as SVG and as PNG.
- **FR-47** — Export is what-you-see-is-what-you-get: current framing, current zoom and active
  filters are respected literally.
- **FR-48** — The chart legend, the graduated bezel and the registration marks are part of the chart
  and ship inside the export. They cannot be cropped out.
- **FR-49** — **Masking** hides every IP and every CIDR while leaving the structure intact:
  silhouettes, zones, outlines, every edge, every object name, every mark. A masked value keeps an
  identical footprint so nothing reflows.
- **FR-50** — Masking is available for the export, **on by default**.
- **FR-51** — Masking is **also available for the screen**, as a display control, so the map can be
  shown in a meeting without putting the internal addressing plan on the wall. **Off by default** —
  the operator wants to see the addresses. The screen and export settings are independent: turning
  one on does not turn the other on.
- **FR-52** — The product states plainly what survives masking and is still identifying: object
  names, stack names, and the shape of the topology itself. It never implies the export is anonymous.

- **FR-63** — The chart legend must be able to decode the chart it ships inside: it enumerates the
  networks actually present on the chart, not a fixed palette, and its typographic specimen renders
  without wrapping — wrapping destroys the adjacency that is the specimen's whole purpose.

### 3.8 States

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
- **FR-59** — A machine carrying nothing renders at full size in node view. A node with nothing on it
  is information.
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
  browser needs is served by Portolan itself.

### 4.2 Architecture seams

- **NFR-5** — The graph model and the renderer stay independent of the Swarm-specific collector.
  Three seams — collector, model, renderer — so that a second source of truth is later a new
  collector rather than a rewrite. This is a binding input to architecture.
- **NFR-6** — The UI couples to the collector in exactly two places, named here so a second
  collector knows what it changes: the rule that objects keep Docker vocabulary (FR-11 and the voice
  rule), and the socket-unreachable screen (FR-57).

### 4.3 Scale and performance

- **NFR-7** — The reference cluster the product must hold is a few hundred objects: 6 nodes,
  14 stacks, 40 services, 300 containers, 11 overlay networks, 25 volumes, at ~2.2 networks per
  container. Verification requires a real cluster of this order — not a three-container lab.
- **NFR-8** — The landing frame stays interactive at that scale on integrated graphics. As currently
  designed, continuous motion re-tessellates on the order of 9,000 Bézier segments per frame across
  325 bodies, and the legibility review's conclusion is that this will not hold. Meeting NFR-8 is a
  rendering and architecture problem; the requirement itself does not bend.
- **NFR-9** — Four rendering questions are carried to architecture, each with its consequence stated:
  whether object marks scale with the body or stay fixed (as specified, *both* readings break the
  landing frame's encoding); the minimum rendered length of an attachment stub, given that ~94% of
  the graph's edges render as stubs and fall to roughly 2px at landing zoom; whether the silhouette
  deformation cap varies by reading level; and the luminance clamp on composited zone fields, on
  which the entire ≥3:1 edge guarantee rests and which nobody has actually decided.

### 4.4 Legibility and accessibility floors

- **NFR-10** — Type floors, on *rendered* size: 9px for anything naming a cluster object, 8px for
  chassis annotation. A label that cannot meet its floor is not rendered at that reading level — it
  is never shrunk to fit.
- **NFR-11** — Contrast floors: 7:1 for the identifier channel, 4.5:1 for chassis text and marks
  (4:1 for health), 3:1 for both edge kinds over the worst composited zone field, and 3:1 for the
  focus ring.
- **NFR-12** — Colour never carries a dimension on its own: shape encodes the mark family, so *which
  dimension you are reading* never depends on hue.
- **NFR-13** — Under simulated deuteranopia, no two zone tints of the light palette may resolve to
  the same colour. Two of them currently simulate to a byte-identical value, which is a defect rather
  than an acceptable residual — and the light palette is the one that holds the dense frame best.
- **NFR-14** — **Accepted and stated:** value-level colour separation is *not* achieved for the stack
  and network mark families (ΔE 3.9 and 2.6 under deuteranopia). Their identity is carried by written
  names — 6.6–7.8:1 on a stack outline, 13.8:1 for a zone label — not by colour. Named consequence: a
  deuteranope cannot make the second of the primary journey's three discoveries from the map alone.

### 4.5 Deliberate exclusions

- **NFR-15** — No screen-reader equivalent of the map, no keyboard traversal of the graph, and no
  keyboard shortcuts in v1. Chrome controls remain tab-focusable (FR-29).
- **NFR-16** — Desktop and laptop browsers only, 1440px and up, recent Chromium, Firefox and Safari.
  No tablet, no mobile, no responsive behaviour: 1440px is a floor, not a breakpoint, and there is no
  second layout.
- **NFR-17** — Licensed AGPLv3.
- **NFR-18** — UI in English, strings externalised from the first commit, French shipped. A new
  language is a file, not a code change.

## 5. Out of scope for v1

Each of these is a decision, not an omission.

- Any write, management or remediation action.
- Any audit engine, rule set, threshold or alerting. The security outcome stays reachable — the user
  spots the anomaly by seeing the map — but Portolan never names it.
- Multi-cluster, and anything that is not Docker Swarm.
- Authentication, accounts, sessions (see NFR-2 for what this obliges).
- Images as graph nodes, and an `images` filter (FR-7, recovered on request by FR-37).
- A stack rendered as a bubble or as a filled area (FR-9).
- Manual refresh (FR-4).
- 3D, perspective, isometry. Depth is stylistic, never spatial.
- Tablet, mobile, and any layout below 1440px (NFR-16).
- Screen-reader support, keyboard traversal of the graph, keyboard shortcuts (NFR-15).

## 6. Open questions and risks

### 6.1 The principal risk — default legibility before any filter

This is the product's main open engineering question, carried from the brief and still open after the
UX phase. The legibility review's verdict, measured against the NFR-7 reference cluster:

> **It survives as a picture. It does not survive as a map of *networks*, which is the product's
> primary axis.**

What the review establishes as **won**, and what must not be lost: rendering networks as areas rather
than edges converts roughly 660 of ~700 edges into local stubs, leaving about 40 long edges and some
five expected crossings. *Portolan does not hairball; Weave Scope's grave is genuinely avoided.*
Keeping images off the map (FR-7) is rated the single highest-value legibility decision taken.

What **breaks** instead, and it breaks in the one frame the product is judged on: at the landing
reading level, composited tints turn to mud past a handful of overlapping zones, the attachment stub
falls to about 2px, and the network mark that was supposed to rescue both is switched off at that
level by the reading ladder. Bodies land at 14–28px against a 46px nominal.

**This is not resolved by this PRD.** It is the first thing architecture must answer, and NFR-7 says
what answering it requires: a real cluster of a few hundred objects.

### 6.2 Carried to architecture

| Question | Consequence if left open |
| --- | --- |
| Where the map is served, to whom, over what (NFR-2) | v1 is an unauthenticated full-topology viewer with one-click export. |
| Whether the manager socket can be mediated by a read-restricted proxy (NFR-3) | Read-only stays an intention rather than an enforcement. |
| The four rendering questions of NFR-9 | Each one, as currently specified, degrades or breaks the landing frame's encoding. |
| Front-end stack and graph rendering library | Never addressed by the brief or the UX phase; NFR-8 makes it consequential. |

### 6.3 Carried to design

- **The two grouping languages coincide in position.** Measured: 455px of one stack outline's 1140px
  perimeter runs within 14px of a network isoline; 346px of another's 1961px within 14px of a second.
  The seven tells that distinguish zone from outline separate them *in kind*, never *in distance*, and
  nothing may be displaced to buy clearance (FR-16).
- **Some zone labels have nowhere to go** — best available clearance measured at 4.9px and 0.8px.
- **Whether the octave pattern resolves at badge size**, with roughly 6px of interior next to as many
  as five other marks. If it does not, the network answer falls back to the zone field and the detail
  panel.

### 6.4 Standing counter-arguments, retained on purpose

- **The excluded PaaS population is the case to reopen if the beachhead stalls.** A Swarm-*only* tool
  sells to the segment that self-identifies as Swarm users — small, unpaid, shrinking — while a large
  and growing population runs Swarm underneath something else without naming it.
- **Swarm's platform longevity is an unresolved dependency, not a product decision.** The "supported
  through at least 2030" pledge predates the acquisition of Mirantis and has not been reaffirmed
  since; MKE 4 is k0s-based and contains no Swarm; the furthest documented Swarm end-of-life is
  MKE 3.9 in March 2028.
- **The market evidence has named holes.** Reddit was unreachable on both research passes, so the
  likeliest audience's sentiment is unassessed, and no primary source for Swarm market size exists —
  every figure is a proxy and the proxies disagree by 3.4×. Re-check before any go-to-market claim.
