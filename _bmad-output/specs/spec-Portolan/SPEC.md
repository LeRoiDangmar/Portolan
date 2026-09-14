---
id: SPEC-Portolan
companions:
  - ../../planning-artifacts/prds/prd-Portolan-2026-09-11/prd.md
  - ../../planning-artifacts/ux-designs/ux-Portolan-2026-09-10/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-Portolan-2026-09-10/EXPERIENCE.md
  - architecture-decisions.md
  - stack.md
sources:
  - ../../planning-artifacts/briefs/brief-Portolan-2026-09-09/brief.md
  - ../../planning-artifacts/briefs/brief-Portolan-2026-09-09/addendum.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Portolan — a read-only topology map of a Docker Swarm cluster

**How to read this.** The kernel below is the altitude. `prd.md` is the normative requirement
catalogue: 84 FRs and 20 NFRs whose numbers are assigned once and never reused, and which epics,
stories and reviews cite by number. `DESIGN.md` owns how Portolan looks, `EXPERIENCE.md` owns how it
behaves, and both are `status: final`. `architecture-decisions.md` and `stack.md` carry the structural
decisions taken after the PRD, which exist nowhere upstream. Each capability names the requirements it
covers; open the companion for the line items.

## Why

**A vision to realize, on ground that is structurally vacant.** The tools people run in front of a
Swarm cluster ship good inventories — a list of services, a list of networks, a list of volumes, each
well built and each separate — and none of them answers *which container sits on which network, and
which volume does it use*. Answering it today means opening six tabs and holding the graph in your
head. The relations are the product. Portainer has been asked for this view since 2017 and has never
built it; the one tool that rendered a real relational graph at production quality, Weave Scope, has
been dead since 2023, and it died with an **open** edge-legibility issue — the same class of defect
still unresolved here (Open Questions). The primary user is **the inheritor**: handed a cluster nobody
documented, and needing to understand it before cleaning it up, securing it, handing it over or
migrating off. The unit of value is replacing days of manual diagramming with a picture that does not
go obsolete at the next `stack deploy`. Swarm's decline as a named technology is the opening rather
than the threat: **you cannot migrate a cluster you cannot map.**

Three commitments govern every decision below. **Legible over impressive**, which binds *reading
load* and not graphic richness — the operative form is *plenty to look at, little to read*, and
CAP-9's latency budget is the bill for it. **One picture, two readings**: the frame a non-specialist
can follow is the same frame that gives an expert the cluster at a glance. **Portolan is a chart, and
it says so** — a graduated bezel, registration marks, a chart legend, coastline-like zone contours,
cartographer's typography. Strip the register and CAP-17, CAP-18 and CAP-22 read as unmotivated
furniture.

## Capabilities

- **CAP-1** — Survey one swarm through a manager node's Docker socket
  - **intent:** Portolan reads the live state of one Docker Swarm cluster and holds nodes, networks, volumes, stacks, services, containers and the edges between them in one model.
  - **success:** On a running swarm, every object of those six kinds and every edge between them is present in the model within one survey interval of Portolan starting. Covers FR-1, FR-6.

- **CAP-2** — Survey cadence and survey age
  - **intent:** The user selects how often the cluster is re-surveyed, and the product states how old the last successful survey is.
  - **success:** The interval control offers 5s / 10s / 30s / 60s and defaults to 10s; a change takes effect at the next survey and alters neither the population nor the rendering. The age reads in plain words ("Surveyed 4 min ago"), is not a control, and staleness is keyed to that age and never to the configured interval — choosing 60s does not itself age the chart. No manual refresh exists anywhere. Covers FR-3, FR-4, FR-5.

- **CAP-3** — Declared and checked engine compatibility
  - **intent:** Portolan declares a minimum supported Docker Engine API version, checks it, and says so plainly when the engine is older.
  - **success:** Against an engine below the declared minimum, Portolan renders the too-old message rather than a partial or wrong map. Covers FR-64; it is the third and last collector-coupled surface permitted by NFR-6. The two engine behaviours that bear on what the collector can read are in `architecture-decisions.md`.

- **CAP-4** — Network membership as a zone field, never as edges to a network node
  - **intent:** Everything sharing a network is enclosed by an area; the attachment edge stays real in the model and renders only as a stub from the body into the field.
  - **success:** No network node exists in the rendered graph. On the reference cluster this converts roughly 660 of 700 edges into local stubs, leaving about 40 long edges and about five expected crossings. A stub never renders shorter than 6px on screen — roughly 94% of edges are stubs, so that floor is what keeps *no rendering choice may dissolve an edge* true in the landing frame rather than only in principle. Covers FR-8, FR-10, FR-68.

- **CAP-5** — Stacks as derived grouping outlines
  - **intent:** A stack girdles its members with an outline carrying its name on the stroke, and takes its position from where the layout put them.
  - **success:** A stack is neither a bubble nor a filled area, and never asks the layout for a position of its own. Zone and outline never read as the same mark: a *field bounded only by an open contour* against a *closed boundary carrying no field*. Accepted cost: the outline encloses non-members wherever it cannot thread around them. Covers FR-9, FR-10, FR-82.

- **CAP-6** — Four mark families, shape encoding the family and colour the value
  - **intent:** Objects carry object type, stack, network(s) and health in a fixed order, so *which dimension you are reading* never depends on hue.
  - **success:** A shape never encodes a value. Marks never render below 8 × 8px; the rail has fixed capacity and degrades by dropping network badges from the right of the network group, never wrapping and never breaching the object's core, with the detail panel as the fallback answer. The rail and the reading ladder live in screen space and do not scale with the canvas transform. Network identity is hue plus an octave pattern, the pattern riding the zone field so networks stay separable where the badge does not render. Covers FR-11, FR-65, FR-66, FR-67, NFR-12.

- **CAP-7** — Health as counted facts
  - **intent:** Health reports `running = desired`, `0 < running < desired`, `running = 0`, and nothing else.
  - **success:** No threshold is invented anywhere. An object with no health dimension carries no health mark — absence is the fourth value. The mark is blue / amber / red, not green / amber / red, because that is what makes the family safe under deuteranopia. This is the product's only classification, and it is named rather than denied. Covers FR-12, FR-72.

- **CAP-8** — Bodies with two silhouette channels, only one of them data
  - **intent:** A body is recognisable across surveys by its contour and tells you what it links to by its stretch.
  - **success:** The irregular contour is **seeded from the object's identity key (slot)** — see Declared departures — so it is the same shape across every survey and every screenshot, and stops carrying at far zoom. Stretch toward linked objects is capped at +32% of base radius, so a single-link object reads as a teardrop. Neighbours never squash a body, bubbles never fuse and never overlap, and an invariant core — name, identifier, mark rail — is never breached by any contour, stretch or motion. Accepted cost: fewer objects fit than circle packing would allow. Covers FR-13, FR-69, FR-70.

- **CAP-9** — The map is alive at rest
  - **intent:** Bodies breathe continuously so the map reads as live rather than as a drawing, without making anything harder to click.
  - **success:** Breathing is local deformation only, translation 0px, with desynchronised periods so the population never pulses in unison; labels and click targets never travel at any zoom, scale or density. Above a documented object count the map stops moving, because continuous motion at reference scale does not hold the latency budget. That stillness is a rendering budget, never reported as something the user chose, and it leaves the user's own motion control untouched. Covers FR-71.

- **CAP-10** — A four-level reading ladder
  - **intent:** Zoom buys sharpness — the whole cluster with type marks and large labels, then service names, then container names, then per-link labels — and deeper labels are reached by zooming, never by clicking.
  - **success:** The set of objects present is identical at every zoom level. Zoom changes sharpness and never population; filtering changes population and never sharpness. A label that cannot meet its type floor is dropped at that level, never shrunk. The primary journey's three discoveries — the orphan, the intruder, the twins — are each found at a different level, and that is what the ladder is for. Covers FR-14, FR-15.

- **CAP-11** — Positions are earned and kept
  - **intent:** Nothing moves under the user except when the user asks for it.
  - **success:** Across a survey nothing moves: a new container appears near its neighbours, a vanished one fades in place, and neither reclaims space until the next relayout. Exactly three actions may re-lay the map — *Reorganise*, switching zone mode, toggling the node backdrop. No survey, filter, selection, search or panel moves anything. Covers FR-16; the mechanism that makes this true rather than promised is in `architecture-decisions.md`.

- **CAP-12** — Three views
  - **intent:** Overview answers what the cluster is, node view answers what runs on this machine and whether the load is spread, service view answers what one service touches.
  - **success:** Views switch from a bottom tab bar and a switch is a complete change of view, not a filter. Overview is the landing view: whole cluster, purely relational, node partition off. Node view draws each machine's region proportionally to what it carries, with a floor — a machine carrying nothing still renders as a full region with its header and one line of marginalia — and draws neither zones nor stack outlines. Service view is an ego-graph reachable only by isolating a selected service, so no empty-subject state can exist. Covers FR-17 to FR-21, FR-59, FR-73.

- **CAP-13** — Selection and inspection
  - **intent:** Clicking an object opens its facts and shows what it reaches.
  - **success:** One gesture, two answers: the detail panel opens *and* everything transitively reachable lights while the rest dims. Reach is user-adjustable — one hop, two hops, or all — defaulting to **one hop**, because at two hops more than 150 of 325 objects light on a realistic cluster and the highlight stops distinguishing anything. The panel is a side panel carrying factual text only, never a tab, modal or full-screen, and never replaces the map. Its column is permanently reserved, so opening it never re-lays or reframes the map. Hover lifts the hovered contour and nothing else, and nothing in the product requires hover to be discovered. Covers FR-22 to FR-28, FR-79.

- **CAP-14** — Filtering by removal
  - **intent:** Each object type can be removed from the map so the user can look at less.
  - **success:** Filters remove; removing networks removes the zones *and* the attachment edges, removing stacks removes the outlines and their names and nothing else. *Keep only this* promotes the reachability highlight into a real filter at the same hop reach, and clearing it restores the whole chart. **The highlight dims; the filter removes** — the two dim depths must look visibly different. When a filter would empty the map, the excluded objects return as very pale context, the one named exception to removal. An orphan carries no badge, no ring and no colour coding, because marking it abnormal would be a judgement; it carries its own contour treatment, and an orphan counter reframes the map onto orphans at scale. Covers FR-30 to FR-35, FR-74.

- **CAP-15** — Search by name and by image tag
  - **intent:** The user finds an object without being given an inventory.
  - **success:** Typing lights the matching objects and dims the rest, reusing the visual language of selection, and reframes onto the tightest frame containing them; a single match is also selected, exactly as a click would be. There is no results list. Search matches image tags too, recovering on request what keeping images off the map gave up at a glance. A match a filter has removed is reported as found and filtered, never silently absent. Search removes nothing and never re-lays the map. Covers FR-36, FR-37, FR-38, FR-83.

- **CAP-16** — Display controls
  - **intent:** The user changes how present things are drawn, never which things are present.
  - **success:** Zone rendering switches between blended tint fields with contour isolines (default, and therefore the exported frame) and disjoint blobs with echo copies, the switch re-laying the map as visible movement so objects can be followed by eye. The node backdrop is off by default and turning it on re-lays the map. Text size and density stay separate first-class controls. Colour is chosen as a whole predefined palette, never swatch by swatch, so the contrast floors stay guaranteeable. Dark and light are both first-class and **dark is the default**. `prefers-reduced-motion` stills continuous motion and keeps action-triggered transitions, and continuous motion is additionally stoppable from inside the product, independently of the operating-system setting. Covers FR-39 to FR-45, FR-61, FR-62, FR-75.

- **CAP-17** — Chrome and chart apparatus
  - **intent:** The controls carry no information of their own, and the chart carries its own decoder.
  - **success:** A toolbar above the canvas carries *Fit to chart*, *Reorganise*, and — while an object is selected — *Isolate* and *Keep only this*; **Fit to chart must exist on screen**, being the only route back to the whole-cluster frame. One control vocabulary throughout, with exactly three states — action, latched, unavailable — and no others; an unavailable control is shown rather than hidden so the toolbar never reflows under the pointer. **No control anywhere is a filled button**: this is a read-only product with no primary action. The chart legend is a permanent band beneath the canvas. **It decodes the mark families, health and the two grouping languages, and does not enumerate the networks present on the chart** — see Declared departures: the enumeration is what yielded to the band's arithmetic, and the zone field and detail panel already carry the network answer. Layout is three fixed columns above the legend band and the tab bar; the canvas takes every extra pixel and the chrome columns never grow. Covers FR-63, FR-76, FR-77, FR-78, FR-79.

- **CAP-18** — Literal export to SVG and PNG
  - **intent:** The user takes the frame they are looking at out of the product.
  - **success:** Current framing, current zoom and active filters are respected literally, with one declared exception — masking is on for the export and off for the screen. The chart legend, the graduated bezel and the registration marks are part of the chart, ship inside the export, and cannot be cropped out. Accepted costs: an export taken from the landing frame ships without the fine labels, because the export is literal; and the legend travels with the export without naming that export's networks (CAP-17). Covers FR-46, FR-47, FR-48.

- **CAP-19** — Address masking
  - **intent:** The map can be shown to people without putting the internal addressing plan on the wall.
  - **success:** Masking hides every IP and every CIDR while leaving structure intact — silhouettes, zones, outlines, every edge, every object name, every mark — and a masked value keeps an identical footprint so nothing reflows. It is available for the export, on by default, and unticking it is one click with no dialog, warning or confirmation. It is separately available for the screen as a display control, off by default; the two settings are independent. The product states plainly what survives masking and is still identifying — object names, stack names, and the shape of the topology itself — and never implies the export is anonymous. Covers FR-49 to FR-52.

- **CAP-20** — Honest states
  - **intent:** Every degraded condition is shown as itself, without hiding the map or inventing an error.
  - **success:** Cold load draws in layers — zones, then bodies, then edges — ending on a distinct settling gesture, so *loading* and *living* never look the same. On stale data or a failed survey **the map stays**: it pales and desaturates in place while the survey stamp ages in words — no banner, no overlay, no error screen, no error colour. The detail panel does not take the veil and holds full contrast. A panel whose subject vanished between surveys stays, freezes its values, reads *"Not in the last survey."* and is dismissed by the next click. Socket unreachable with no map ever drawn gets a full-surface screen — the only screen allowed to teach — stating what is missing, why Portolan needs it, and the exact configuration line that fixes it. An empty cluster renders the node backdrop even though it is off by default. Below the minimum viewport, an honest off-chart message rather than a degraded rendering. Covers FR-53 to FR-60.

- **CAP-21** — The not-reachable screen
  - **intent:** When Portolan is running but is not being reached at the address it is bound to, it says so with the same candour as the socket-unreachable screen.
  - **success:** A screen symmetric to the socket-unreachable one, stating what is bound where and naming the three documented ways to open it. **Addition with no upstream**, ratified 2026-09-14: the safe default binds to `127.0.0.1` on the manager, and a safe default with no screen explaining it is a product that fails in silence at first contact. Covers FR-84.

- **CAP-22** — Two vocabularies, strictly separated
  - **intent:** The chassis speaks chart; anything naming a real cluster thing speaks Docker.
  - **success:** *Surveyed*, *off-chart*, *reorganise*, *fit to chart* on one side; *service, network, volume, stack, node, container, image* on the other, never renamed or prettified, an object's name staying what an admin would type in their terminal. Spelling is en-GB, a deliberate exception carried by the shipped control name `Reorganise`. Short, complete sentences; no exclamation marks, no encouragement, no celebration, no emoji. **The product never restates the health mark in words**: the panel says *"3/5 replicas running."*, never *"degraded"*. Covers FR-80, FR-81.

- **CAP-23** — Deploys as one image into the swarm it maps
  - **intent:** An operator installs Portolan on a cluster they do not understand, in one step, without fetching anything from the internet.
  - **success:** A single container image, one `docker stack deploy`, running inside the swarm it maps, one swarm per instance. Air-gapped by construction: no CDN, no external font, no external asset — everything the browser needs is served by Portolan, fonts included. The published stack file binds host mode on `127.0.0.1` with a `node.role == manager` placement constraint, and carries the three ways to open it — routing mesh, internal overlay plus reverse proxy, VPN — commented directly above the line to uncomment. The image is multi-arch amd64 + arm64, is configured by environment variables only, and its healthcheck tests whether Portolan *serves*. Covers NFR-1, NFR-4; the full operational envelope and the exposure defaults are in `architecture-decisions.md`.

- **CAP-24** — Localisation without a code change
  - **intent:** A new language is a file, not a code change.
  - **success:** UI in English, French shipped, strings externalised from the first commit, one catalogue per language, and no string literal in any component. Covers NFR-18.

- **CAP-25** — A measurement harness, shipped with v1
  - **intent:** The legibility questions this contract cannot answer become measurable rather than arguable.
  - **success:** The harness generates a synthetic cluster at the NFR-7 reference scale of 396 objects, produces the scene on the **884px operative canvas** — the real width once the panel column is reserved, and not the 1204px the PRD's arithmetic used — and reports four distributions: rendered body diameter, mark-rail occupation as a fraction of the body, stub length, and contrast of both edge kinds over the worst composited zone field. It is a v1 deliverable, not a convenience tool, and it **fixes no threshold**: the PRD deliberately refuses to invent them and this contract does not either. Because the scene is resolution-independent, the harness runs without a browser or a GPU. Specified in `architecture-decisions.md`.

## Constraints

- **Read-only by construction, not by discipline.** The underlying HTTP client refuses every method other than `GET`. The chrome states `READ ONLY` and makes no claim about the mechanism — `:ro` on a socket mount does not restrict the Docker API, and the product never pretends otherwise (FR-2, NFR-3).
- **No authentication in v1**, therefore Portolan must not be served on an address reachable from outside the internal network. Without this, v1 is an unauthenticated full-topology viewer with one-click export (NFR-2).
- **Three seams — collector, model, renderer** — with the graph model and renderer independent of the Swarm-specific collector, so a second source of truth is later a new collector rather than a rewrite (NFR-5).
- **The UI couples to the collector in exactly three places**, named so a second collector knows what it changes: Docker vocabulary (CAP-22), the socket-unreachable screen (CAP-20), the engine-too-old message (CAP-3). Nowhere else may the renderer know a docker-ism (NFR-6).
- **Interaction latency is the performance requirement; there is no frame-rate floor.** At the NFR-7 reference scale of 396 objects on integrated graphics, pan, zoom, selection, filtering and search respond within 100ms. Continuous motion carries no cadence requirement at all — it is the thing that yields. A build whose breathing stutters at scale passes; a build that takes half a second to pan does not (NFR-8).
- **Type floors are on *rendered* size:** 9px for anything naming a cluster object, 8px for chassis annotation. A label that cannot meet its floor is not rendered at that level (NFR-10, CAP-6).
- **Contrast floors** — 7:1 identifier channel, 4.5:1 chassis text and marks, 4:1 health, 3:1 both edge kinds over the worst composited field, 3:1 focus ring — with **three deliberate exemptions**: the staleness veil, the reachability dim, and the empty-filter pale context. A state whose meaning is illegibility cannot be held to a legibility floor, but the exemption is named rather than silently taken (NFR-11).
- **Within one octave, the six zone hues must be mutually separable under simulated deuteranopia, in both palettes.** Across octaves, sameness of hue is intended and answered by the octave pattern (NFR-13). Value-level colour separation is **accepted as not achieved** for the stack and network families (ΔE 3.9 and 2.6); their identity is carried by written names. Named consequence: a deuteranope cannot make the second of the three discoveries from the map alone (NFR-14).
- **Identifiers are set in a monospaced face whose lowercase `l` is serifed and whose zero is slashed**, with same-family link labels sharing a baseline. This is an accessibility requirement, not a typographic preference: it is what makes `pgdata`, `pg-data`, `pg_data` and `pgdatal` four visibly different strings at label size (NFR-20).
- **AGPLv3.** Every dependency must be AGPLv3-compatible. Permissive licensing was rejected as insufficient protection and source-available (BSL) rejected outright: for a project whose earliest adopters are homelabbers, a non-OSI licence costs more trust than it protects revenue (NFR-17).
- **Desktop and laptop browsers only, 1440px and up.** 1440px is a floor, not a breakpoint; there is no second layout (NFR-16).
- **The server does not hold positions.** Layout is client-side, in the tab's memory. Two people may hold two different views, and no build may put layout state on the server and create a shared map the product never asked for.
- **Layout is a pure function of (model, seed, mode).** Fixed iterations, stable iteration order, no dependency on the clock or on frame timing, and the deformed hull reserved before placement. Divergence between two views comes from an *action*, never from opening the map.
- **Object identity is the slot, not the Docker container ID.** Replicated service: `stack/service/slot`; global service: `stack/service/node`; volumes and networks by name; nodes and services by Docker ID. In Swarm a task is immutable and a service update destroys and recreates its tasks, but the slot number survives. **Accepted cost:** two genuinely different containers — before and after a redeployment, possibly a different image, possibly a different node — read as one body, and the map asserts a continuity Docker does not know. Held anyway, because the slot *is* the operator's identity (`docker service ps` prints `web.1`) and the container ID stays visible in the detail panel where it misleads nobody.
- **One stateful stage — the layout.** Every other stage is a pure function of its input.
- **View state and layout state are two separate stores, and view state has no write path to layout.** This is the mechanism that makes CAP-11 true rather than promised.
- **The renderer is bespoke.** No existing graph library can render Portolan; see `stack.md` for what was evaluated and why. A library may supply a model and/or a layout, never the rendering.

## Non-goals

- **No write, management or remediation action anywhere in the product.** Portolan sits beside Portainer; it does not replace it.
- **No audit engine, rule set, invented threshold or alerting.** The security outcome stays reachable — the user spots the anomaly by seeing the map — but Portolan never names it. One declared exception: the health mark (CAP-7).
- **No dashboard**: no inventory surface, no metrics panel, no charts.
- **No multi-cluster and nothing that is not Docker Swarm.** One swarm per instance.
- **No authentication, accounts or sessions** — see the constraint that obliges.
- **No screen-reader equivalent of the map, no keyboard traversal of the graph, no keyboard shortcuts.** Chrome controls remain tab-focusable in DOM order with a visible focus ring (NFR-15, FR-29).
- **No tablet, no mobile, no responsive behaviour.**
- **No images as graph nodes and no `images` filter** — recovered on request by CAP-15. Rated the single highest-value legibility decision taken (FR-7).
- **No manual refresh.**
- **No 3D, perspective or isometry.** Depth is stylistic, never spatial.
- **No stack rendered as a bubble or as a filled area.**
- **Portolan writes nothing.** No volume, no database, no disk cache; the container is disposable.
- **No shared map.** No server-held layout, no session, no two users looking at one synchronised surface.
- **No delta reconciliation protocol.** Transport is a full snapshot per survey.
- **No socket-mediating proxy sidecar in v1.** Documented in the README as optional hardening; see `architecture-decisions.md` for who decided this and against what.
- **No browser-driven end-to-end tests in v1.** They would put a browser and a GPU back into the verification loop, which the scene decision exists to keep out, and the cost would be paid on every PR.
- **Not an audience: the population running Swarm underneath a PaaS without knowing it.** They have no Swarm vocabulary and would not recognise the problem as theirs. This exclusion is the standing counter-argument to the beachhead and the case to reopen if it stalls.

## Success signal

**A stranger posts a screenshot of *their own* cluster in Portolan** — the map read, trusted and shown
on infrastructure the author does not own. It is the first of five external signals, of which **at
least one** is the threshold; the others, ordered after it: someone reports using Portolan to prepare
a migration off Swarm; **someone with no IT skills opens Portolan on a real cluster and can show its
shape to other people, with the author not in the room** — the only signal that tests *one picture,
two readings*, which every document so far has asserted and none has verified; it stays readable on a
cluster substantially larger than any the author owns; an unprompted issue or pull request from an
operator. Star counts are excluded deliberately.

The author's own bar, first and independently: on a cluster of the reference order he has never seen,
the stacks, the networks and which objects sit in which are readable **within ten minutes of first
opening the map**, and *which container, which network, which volume* is answered without opening a
second tool.

**Counter-metrics — things that would look like success and would not be.** Long sessions in the
product (the value is a truthful picture in minutes; time reading the map is cost, not engagement).
Heavy filter use on first contact (if the default frame is only usable once filtered, the landing
frame has failed, whatever the filter usage says). Screenshots from people who cannot answer the
founding question — that is the *survives as a picture, not as a map* failure scoring as success.
Requests for write actions or audit rules: welcome as evidence people use Portolan; granting them
would make it a different product.

## Declared departures

Three were settled on 2026-09-14 during this run, and **all three were carried back into `prd.md` the
same day**, so the two documents do not diverge. They are kept here because the reasoning is this run's.

- **The recognition silhouette is seeded from the identity key (slot), not from the Docker container ID.** Seeded from the container ID, *"the same shape across every survey"* is false from the first redeployment — the recognition channel resets at the exact moment the user is reading the map to see what moved. FR-13 revised.
- **The chart legend no longer enumerates the networks present on the chart.** FR-63 as written is arithmetically impossible in the band FR-78, FR-79 and NFR-16 leave, and of the three ways out — more room, fewer jobs, a different shape — only *fewer jobs* takes no pixel from a canvas whose bodies already land near 14px. FR-63 narrowed, which also closes the first row of the PRD's carried-to-design list.
- **CAP-21 had no upstream.** Created by the architecture run and never carried back. Added as FR-84.
- The PRD carries ten departures of its own from the brief and the spines, plus four additions with no upstream, each declared in `prd.md` §8.2 and §8.3. They are not restated here.

## Assumptions

- The SPEC covers the whole of v1 rather than a slice, matching the architecture run's declared scope and the user's choice of input set. No slice was designated.
- The 23 `[ASSUMPTION]` and 11 `[DEPARTS FROM BRIEF]` markers surviving in `DESIGN.md` and `EXPERIENCE.md` are treated as genuinely undecided, per the PRD's explicit instruction, and not as formalities. They are not enumerated here: the spines are adopted companions and carry them.
- Every architecture decision is now ratified. The six-point operational envelope, which the architecture run left pending, was ratified by the user on 2026-09-14 and is in `architecture-decisions.md`.

## Open Questions

- **Default legibility of the landing frame before any filter.** Unresolved, and it gates everything else. The legibility review's verdict: *"It survives as a picture. It does not survive as a map of networks, which is the product's primary axis."* At the landing level, composited tints turn to mud past a handful of overlapping zones, the stub falls to about 2px, and the network mark that was to rescue both is switched off at that level by the ladder; bodies land at 14–28px against a nominal 92px diameter. Every quoted figure is optimistic — computed on 1204px, not the operative 884px, and against 325 objects, not 396. Answering it needs a real cluster of the reference order, not a three-container lab. CAP-25 is what makes the answer measurable.
- **Mark sizing at the landing level is contradictory as specified, not merely undecided.** On a 14px body an 8px mark is over half the body and buries the stretch channel; a mark sized to the body falls below the 8px floor. One of CAP-6, CAP-8, CAP-10's screen-space rule and the 8px floor must yield, and the candidates each cost something: drop marks at the landing level, cut the reference population, or give the landing level its own mark budget — a fifth reading level in all but name. Owner: product and design, not architecture (NFR-9). Deferred until the harness reports, by explicit agreement.
- **The luminance clamp on composited zone fields** (NFR-9), on which the entire ≥3:1 edge guarantee rests. Nobody has decided it.
- **Screen rasteriser backend: Canvas2D or WebGL** — the unresolved half of NFR-19. Deliberately deferred and made reversible by the scene decision — to be settled on measurement, not on a bet. One argument against pure WebGL is already identified: 9px text via an SDF atlas, against the 9px and 7:1 floors, in a product whose thesis is legibility.
- **Three thresholds the PRD deliberately refuses to invent**, each still unowned in value, and **each needing a different instrument** — which the ratified CI gate makes worth separating:
  - *The text-size ceiling.* Not a measurement at all: it is whatever the specified chassis-text overflow behaviour can honestly carry at every step of the range, in fixed-width columns. Owner: design.
  - *The object count above which the map goes still.* **The one threshold the harness cannot reach.** The harness measures a generated scene without a browser or a GPU, and this is a frame-timing figure at reference scale on integrated graphics. It needs a real browser, and therefore an instrument that does not exist yet and is not covered by any gate.
  - *The light-palette tint collision.* Not a measurement either but a defect: two tints currently simulate to a byte-identical value under deuteranopia, in the palette that holds the dense frame best. Owner named by the PRD: design, before the palette is implemented. Fixing it means new values in `DESIGN.md`, which this contract adopts and does not own.
- **The two grouping languages coincide in position.** 455px of one 1140px stack outline runs within 14px of a network isoline; 346px of another's 1961px within 14px of a second. The seven tells separate them *in kind*, never *in distance*, and no contour may be displaced to buy clearance — only a zone *label* may move, and some labels have nowhere to go, at 4.9px and 0.8px best clearance.
- **Does the octave pattern resolve at badge size** — roughly 6px of interior, next to as many as five other marks? If not, the network answer at the middle reading levels falls back to the zone field and the detail panel, which is where it already is at the landing level.
- **Two verifications the upstream documents ask for by name:** the four near-identical volume names rendered at real label size in the real face, and the octave patterns at badge size.
