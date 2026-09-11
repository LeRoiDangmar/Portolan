---
name: Portolan
description: How the Portolan map behaves — surfaces, states, interaction and the three journeys it is built for.
status: final
updated: 2026-09-11
sources:
  - ../../briefs/brief-Portolan-2026-09-09/brief.md
  - ../../briefs/brief-Portolan-2026-09-09/addendum.md
---

# Portolan — Experience Spine

Scope, personas, market and v1 object list are inherited from the brief and addendum by reference and are not restated here. This file holds experience decisions only. **`DESIGN.md` owns how Portolan looks; this file owns how it works.** Visual values are referenced by braced token path — `{colors.ground}`, `{motion.breathe}` and the like — and every one of them is defined there. No reference in this file is a wildcard or a placeholder; all of them resolve.

Marker convention: **[DEPARTS FROM BRIEF]** flags a decision that knowingly contradicts a written brief statement. `[ASSUMPTION]` flags something supplied by the facilitator or by this document, never confirmed by Jules.

## Foundation

| | |
|---|---|
| Form factor | Desktop / laptop browser only, **1440px and up**. No tablet target, no mobile target. |
| UI system | **None named.** No shadcn, MUI, native toolkit or internal system — there is nothing to inherit. Every surface in this spine is drawn from scratch: a graph canvas plus chrome. |
| Posture | Read-only, one swarm, in-cluster, polled refresh 5–10s configurable (brief) — and **configurable now has a surface**: `{components.refresh-interval}`, a control in the left menu. See *Component Patterns → Refresh interval*. No write path exists anywhere in this document. |
| Mode | Dark by default (`{colors.ground}`), light available (`{colors.ground-light}`). Both palettes are first-class: screenshots get pasted into light-background docs and tickets, and a stranger's screenshot is the brief's top external success signal. Overlapping translucent zones must work in both. |
| Language | UI is **English**, though the product is authored in French. Strings externalised from the first commit; French shipped. A community language is a file, not a code change. |
| Air-gapped | No CDN, no Google Fonts, no external asset of any kind. Font files are embedded in the image and served by Portolan, so the map renders identically on every machine and in every screenshot. |
| Authentication | **None in v1.** Jules: *« on va garder l'auth pour une prochaine version, pour le moment on arrive directement sur l'app. »* Opening Portolan lands straight on the map — no login screen, no session, no account affordance, and therefore no first-run surface anywhere in this document. |

**Exposure, stated rather than left unspoken.** No auth surface does not mean no exposure question. The map renders IPs, CIDRs and the complete topology; export is in v1; and **Flow 2 ends with the protagonist publicly posting a frame of it**. Who can reach the map, and from where, is the brief's first-ranked carried question and belongs to architecture — but it is live **because** there is no auth surface, not despite it, and this file says so where a reader will meet it.

**One half of it is now answered here.** The brief's warning is specific — *"a read-only tool that exposes every IP, network and volume in an infrastructure is a reconnaissance gift if left open"* — and the half this document owns is the frame that leaves the product: `{components.export}` carries a **Safe to share** checkbox, on by default, which masks every IP and CIDR while keeping the whole structure. It touches the export only, not the screen, and reachability of the running map is still architecture's question, not something a checkbox closes. See *Component Patterns → Export (SVG / PNG)*, and *Open Questions*.

**Note for the architecture work — the collector seam.** The brief calls collector / model / renderer independence *"a binding input to the architecture work"*, and the UX couples the renderer to one collector's vocabulary in exactly two places. The first is the object half of the voice rule (*Voice and Tone*): *never renamed, never prettified* means the objects speak **Docker Swarm**, specifically. The second is the socket-unreachable screen (*State Patterns*), the only screen in the product allowed to teach, which names the manager node's Docker socket and prints one exact configuration line. Not a contradiction — v1 is Swarm-only by written decision — but **a second collector later changes the voice rule and rewrites that screen, or turns it into several**, because a second noun set arrives with no rule here saying which one wins. Flagged so nobody is surprised; not decided here.

**Governing principle — `beaucoup à regarder, peu à lire`** ("much to look at, little to read"). Density at the default zoom comes from network zones, blended tints, irregular silhouettes, edges and type pastilles — **never from text density**. Text stays rare until the user has descended the level-of-detail ladder.

**Where the tension it arbitrates comes from.** Its source is **Jules's own journey 2** — *« presque trop pour que ce soit facilement lisible mais tellement classe pour flexer »* (Flow 2, step 6, verbatim). That is a stated intent that the default screen be almost too much to read easily, and `beaucoup à regarder, peu à lire` is what arbitrates it: the richness is graphic, the reading load is not. The brief's ordering — *legible over impressive* — is left intact, not overruled. `DESIGN.md` owns the richness; this file owns the ladder that delivers it.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| **Overview** (landing) | App open / bottom tab 1 | The whole cluster. **Services, containers and volumes are the bubbles; networks are the tinted zones; stacks are grouping outlines** girdling their members — three kinds of mark, not a list of peers. **The overview lands purely relational** — the node backdrop is a display control and it is **off by default**, so nothing partitions position but the zones themselves, and the stack outline derives its shape from where they put its members. Answers *what* in one glance, and *where* on request. |
| **Node view** | Bottom tab 2 | Nodes in the foreground. Answers a different question: "what runs on `node-03`, and is the load spread?" **Checking distribution is its journey** (Flow 3) — the imbalance is what it exists to show. |
| **Service view** | Select a service, then *Isolate* — which sets the subject and switches to bottom tab 3 | An ego-graph of one service: its networks, volumes, containers and immediate neighbours, isolated from the rest of the cluster. A **semantic** zoom, not a geometric one. There is no empty-subject state to design: the view cannot be reached without a subject. |
| **Detail panel** | Clicking any object, on any view | Factual text: IPs, image tags, mounts, placement. A side panel — not a tab, not a modal. |
| **Left menu** | Always present | Filters (which object types exist on the map, `Stacks` among them) and display controls (zone rendering mode, **node backdrop** — off by default, **palette**, text size, density, theme), plus **`{components.refresh-interval}`**, the *Export* row with its *Safe to share* checkbox, and the reachability hop reach. |
| **Toolbar** | Always present, above the canvas | The band that holds the on-screen controls (`{spacing.toolbar}`): *Fit to chart*, *Reorganise*, and — while an object is selected — *Isolate* and *Keep only this*. It carries no information of its own. |

Chrome: a **left menu** for filters and display controls; a **toolbar** above the canvas for the on-screen controls; **bottom tabs** for views; and a permanent **chart legend** band beneath the canvas (`{spacing.chart-legend}`), decoding the pastille families, the networks actually on the chart and the two grouping languages. Everything else is graph canvas. Switching a tab is a complete change of view, not a filter. The detail panel never replaces the map — text on one side, map on the other.

The landing surface **merges** what were originally two tabs: the node view was first specified as the landing overview, then as a separate destination. Nodes still appear twice, in two roles — as an **optional** background layer answering "where does this run", and as their own foreground view (tab 2) answering "what does this node carry". **What changed is which of the two is the default:** the backdrop is off by default — see *Component Patterns → Node backdrop* for why. The merge Jules chose is preserved — on demand.

**The LOD ladder.** What renders is a function of zoom, and the rung vocabulary below is used throughout this file.

| Rung | Reached by | What renders |
|---|---|---|
| **0** — max zoom-out. The landing state, and the screenshot frame. | *Fit to chart* | Network zones **carrying their octave patterns**, **stack outlines**, bubbles, edges, **object-type pastilles only**, and the large labels only: **stack names, which live on their outlines** (`{typography.stack-label}`, set on the stroke), and network names on their fields. The node backdrop appears here **only if the user turned it on**. From far away you see *what* things are before you understand them. **The network answer is present at this rung** — carried by the zone field's hue and pattern, not by the pastille, which does not render here. **The stack answer is present too, and it is a written one**: the outline says *a stack*, the name on it says *which*, and neither depends on a badge the rung does not draw. |
| **1** | Zooming in | Stack, network and health pastilles resolve. Service names appear. |
| **2** | Zooming in | Container names. |
| **3** — deepest | Zooming in | **Protrusion labels.** The mechanism of the third discovery sits here, reached by zooming — not by clicking. |

`[ASSUMPTION]` **The ladder is in screen space, and so are the marks.** Type does not scale with the canvas transform: a 9.5px zone label is 9.5px on screen at every zoom, and the two type floors (`{typography.scale.floor-object}` 9px for anything naming a cluster object, `{typography.scale.floor-chassis}` 8px for chassis annotation) are floors on **rendered** size. The same holds for pastilles (`{shape.pastille.space}`, `{shape.pastille.min-size}`). Nobody decided this, but the whole ladder is meaningless otherwise — world-space type would put a 9.5px label at about 2.4px on the very frame the product is judged on, and "drop the LOD rung instead of shrinking a label" would have nothing to mean. **What scales with zoom is the map; what stays put is the reading.**

→ IA and chrome wireframe: [`wireframes/ia-portolan-2026-09-10.excalidraw`](wireframes/ia-portolan-2026-09-10.excalidraw) — the three views, the left filter menu, the bottom tabs and the conditional detail panel. **The visual artefacts linked from this file illustrate; the spine is the contract, and the spine wins on conflict.** Where a mock is linked below, its own in-file notes record the composition decisions the spines do not specify.

## Voice and Tone

Microcopy only. Brand voice and aesthetic register live in `DESIGN.md`.

**The vocabulary split is a hard rule**, and it is doubled by the typographic split (`{typography.sans}` for chassis, `{typography.mono}` for identifiers):

- **Chassis** — product actions and states — speaks chart: *surveyed*, *off-chart*, *reorganise*, *fit to chart*.
- **Objects** — anything naming a real cluster thing — speaks Docker, strictly intact: *service*, *network*, *volume*, *stack*, *node*, *container*, *image* are never renamed, never prettified. **An object's name stays what an admin would type in their terminal.**

**This rule sits on the collector seam** — *never renamed, never prettified* means the objects speak Docker Swarm, specifically. It is the first of the two sites; see *Foundation*.

| Do | Don't |
|---|---|
| "Surveyed 4 min ago." | "Last updated: 14:32" / "Data may be out of date!" |
| "No object matches this filter." | "Oops — nothing here 🙁" |
| "3/5 replicas running." (panel text) | "Warning: this service is degraded." |
| "Portolan needs a viewport 1440px wide. This one is off-chart." | "Please resize your window." |
| "Reorganise" | "Auto-layout ✨" |
| Short, complete sentences. No exclamation marks. | Encouragement, celebration, congratulation. |

**Portolan shows, it does not judge.** The health pastille is the single exception (below), and the exception is now narrow: **every one of its three states is a counted fact** — `running = desired`, `running < desired`, `running = 0` — so there is no threshold and no rule engine anywhere in this file. What remains interpretive is the **framing**: three observed states rendered in traffic-light colours read as a judgement even when every number behind them is a number Docker hands over. Text never adds a second one, and never restates the light in words: the panel says *"3/5 replicas running."*, never *"degraded"*.

## Component Patterns

Behavioural only. Visual specs live in `DESIGN.md`, and **every `components:` entry there carries a row here, under exactly the name it has there.** Two rows run the opposite way and have no `components:` entry in `DESIGN.md`, deliberately: **Image**, which is a negative-space decision — an image is never drawn, so there is nothing to spec — and **Palette**, a left-menu display control whose appearance is governed by `DESIGN.md` → *Colors* and by the left menu's display group rather than by a component of its own. *Pastille* takes two rows — the encoding, then the rail's capacity behaviour — because the second is a rule about what happens when the first runs out of room.

Seven components carry rules too long for a table cell. Each keeps a one-line row and is written out beneath its own table, under the same name, in one order: **Rule** first, then *Rejected*, then *Cost*.

### Graph marks

| Component | Where | Behavioural rules |
|---|---|---|
| **Bubble** | Every graph surface | One per object; an irregular contour, never a circle, that carries its own relationships. **Full rules below.** |
| **Labelled protrusion** | Bubble perimeter | The signature primitive, and Jules's invention — absent from the brief: `de petites excroissances là où elles sont reliées, avec le nom de la chose reliée`. Every connection point on a bubble is a small nub **naming what it connects to**. Renders at the deepest LOD rung only. Two protrusions on the same bubble must be readable **adjacently** — this is the mechanism by which `pgdata` and `pg-data` are told apart, so identifiers render in `{typography.mono}`. Not styling: it is the mechanism of a climax beat (Flow 1, step 10). |
| **Pastille** | On every bubble | The core encoding primitive. Four families: **object type**, **stack membership**, **network** (a multi-network object carries several badges of this family), **health**. **Shape = family, colour = value** — the shape tells you which dimension you are reading (`{shape.pastille.type}`, `{shape.pastille.stack}`, `{shape.pastille.network}`, `{shape.pastille.health}`), colour alone tells you which value (`{colors.pastille-type-service}`…, `{colors.pastille-stack-1}`…, `{colors.pastille-network-1}`…, `{colors.pastille-health-nominal}`…). All families are always present; the LOD ladder governs which render at the current zoom. **The left menu does not toggle pastille families.** **[DEPARTS FROM BRIEF]** — the brief says "colour carries network membership"; encoding moves from bubble-fill (one dimension) to a set of badges (four). Networks remain carried by zones. |
| **Pastille** — rail capacity | On every bubble | **The rail has a budget, and running out of it is a behaviour, not a rendering accident.** For a service / container / volume, capacity is **5 / 4 / 3** marks at nominal size and **6 / 5 / 4** at the floor. Marks shrink uniformly to fit the core, down to the `{shape.pastille.min-size}` 8px floor — and no further, ever. Below that, network badges drop from the right of the network group until the rail fits (`{shape.pastille.fit}`). **Nothing else ever gives:** the core is never breached, the rail never wraps, no other family is dropped, and the fixed left-to-right order — type · stack · network(s) · health — means the reader always knows which marks went. What a dropped badge means to the reader is *this object is on more networks than the rail can show*, never *this object is on fewer networks*. The two channels that still carry the full answer are the **zone fields the object sits in** — each carrying its own hue and octave pattern — and the **detail panel**, which lists every network by name in words. In practice this bites at three or more networks on a container, which is the ordinary case on a busy cluster rather than an edge case. |
| **Health pastille** | On every bubble carrying a health state | A **blue / amber / red traffic light**, and **each of the three is a counted fact**: blue is `running = desired`, amber is `running < desired` with running above zero — the `3/5` Docker already reports — and red is `running = 0`. There is no threshold, no rule engine and no cut-off for an implementer to invent; every term is a number the socket hands over. **[DEPARTS FROM BRIEF]**, and at its true size: what departs is the **traffic-light framing**, not the data. The brief says "Portolan does not tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself", and three observed states rendered in blue/amber/red read as a judgement even when every number behind them is observed. Two alternatives were on the table and both were declined: neutral facts ("3/5 replicas", "stopped"), and colour on the stopped state alone. Blue rather than green is not decoration: it is what keeps the value readable under deuteranopia and protanopia. An object with no health state — a volume, a network — carries no circle at all; absence is the fourth value. |
| **Network zone** | Overview | Networks are **areas**, not edges: an enclosing region around everything that shares a network, patterned by octave beyond the sixth. **Full rules below.** |
| **Stack outline** | Overview | **A stack is not a bubble and not an area.** It is a grouping outline girdling the services of one stack, its name set on the outline (`{shape.stack-outline}`, `{stroke.stack-outline}`). **Full rules below.** |
| **Echo bubble** | Overview, mode B only | A multi-network object is drawn once per zone. **Each copy carries the edges of its own zone** — the copy in `frontend` carries frontend links, the copy in `backend` carries backend links and the `pgdata` mount. Consequence: no edge crosses the map, every zone reads correctly alone, and **neither copy shows the object in full** — accepted. Rendered at `{opacity.echo}`. **Selecting an echo selects the object, not the copy**: both copies light, and the detail panel describes the one object. |
| **Edge** | Every graph surface | The product. Nothing in any rendering choice is permitted to dissolve an edge (`{stroke.edge}`), and the rule is **checkable** rather than aspirational: the iso-luminant zone rotation makes the ≥3:1 floor invariant across hues, and `{opacity.zone-field-cap}` — the composited zone field is luminance-clamped to a single tint — makes it invariant across overlap depth. Two kinds — attachment and mount — told apart by colour and weight, never by a label. **A network has no position, so an attachment's far end is a short stub running from the body into the network's zone field** — that stub *is* the rendering, and it never shrinks below `{stroke.edge.attach-min-length}`, because attachment is the most numerous edge in the graph and it must stay a visible mark in the default frame. |
| **Node backdrop** | Overview — **a left-menu display control, off by default** | Swarm nodes as bands beneath everything, saying where each thing runs. **Off unless the user turns it on.** The reason is structural, not a preference: an overlay network spans every node by construction, so if every container must sit inside its node's band, every network zone becomes a multi-lobed smear across the full canvas and all of them overlap nearly everywhere — the mud the zone study predicted at six fields. **The overview therefore lands purely relational, and the zones get the whole positional channel.** Turning the backdrop on reimposes the node partition and costs the zones their freedom; that is a trade the user makes deliberately, on a cluster small enough to carry it. Switching it re-lays the map (`{motion.relayout}`) — a movement, not a repaint, for the same reason the zone-mode switch is. Background, never foreground: the node's own view is tab 2. **Not selectable** — clicking a band is a click on empty background, and therefore deselects. A node is an object you select in the node view, not through the backdrop. |
| **Node region** | **Node view (tab 2) only** | The node as foreground subject, and the surface Flow 3 runs on entirely. **A node is a region, not a bubble.** **Full rules below.** |
| **Orphan bubble** | Overview | A container with no stack floats free between the zones, attached to nothing. **Its visual isolation is the signal** — everything else is grouped; it is not. No "no stack" region, no dedicated badge. **The stack outline sharpens that signal without annotating it:** an orphan is by definition outside every outline on the chart, so *everything else is girdled and it is not* becomes something the reader sees rather than infers. Still nothing added to the orphan itself. Accepted cost: on a large cluster an orphan can recede. |
| **Image** | Detail panel only — **never a bubble** | **Images are not graph nodes.** An image is an attribute read on a container: a line in its detail panel, `nginx:1.25-alpine`, in `{typography.mono}`. This closes the brief's own explicit open rendering question. Rationale: 30 containers sharing 3 images is the convergent fan-in the brief names as *the fuel for the hairball failure mode*, and this spine spends its whole budget avoiding it. **Accepted cost, stated:** you cannot see at a glance who shares which image. Consequences propagated: the object-type pastille family has **no `image` value**, and the left menu offers **no `images` filter**. |
| **Reachability highlight** | Any graph surface | Clicking an object **lights everything reachable from it, transitively, and dims the rest** (`{opacity.dim.unreachable}`). This is the primitive that answers Jules's own question: `est-ce que la stack A est liée d'une manière ou d'une autre au volume B` — *d'une manière ou d'une autre* is transitive reachability, which neither zones nor a glance can answer at scale. Cleared by clicking empty background. The dilution risk accepted at decision time — an unbounded highlight lights almost everything — is answered by the **adjustable hop reach**, and the highlight can be promoted into a real filter by *Keep only this*. **The two must stay distinct at a glance: this dims, that removes.** |
| **Stale map** | Every graph surface | The map's own ageing treatment — the stamp in words and the map paling in place. Specified in *State Patterns → Stale data / refresh failure* below. |

#### Bubble

**Rule.** One per object. Irregular contour — no bubble is a circle. Two criteria bind together:

1. Each bubble has its **own stable silhouette** (`{shape.bubble.silhouette}`) — an irregular pebble, unique to that object and fixed for its life, stable enough that an object is recognisable by shape as much as by name.
2. **The body bulges toward what it is linked to** (`{shape.bubble.deform}`), up to +32% of base radius along the bearing of every link, so that a single-link object becomes a teardrop pointing at its one neighbour and the outline carries the relationships.

**No neighbour squash:** bodies never flatten against one another, and the layout reserves room for the stretch so that stretched silhouettes never overlap. The stretched outline is a data channel — driven by relationships, never by seed. Bubbles never fuse.

A bubble breathes and never travels: `{motion.breathe.translation}` is `0px` and the excursion is on the outline, `{motion.breathe.outline-excursion}`. The rule and everything that follows from it are in *State Patterns → Alive at rest*.

Depth is stylistic only — shadow and elevation per `{elevation.bubble}`, proportional to the rendered body and gone entirely below a 30px diameter (`{elevation.bubble.floor}`), so at rung 0 the contour does the lifting and no body is fogged by its neighbours' shadows. The diagram itself is never spatially 3D; see *Inspiration & Anti-patterns*.

*Rejected — the squash.* Jules's founding wording was `contours irréguliers (galets, cellules) + corps mous qui se déforment`; his later choice of shape treatment C narrowed *corps mous* to deformation toward links only, explicitly `sans l'écrasement`, and that narrower reading is the one that binds.

The treatment ladder this came out of is [`mockups/shape-study-organic-2026-09-10.html`](mockups/shape-study-organic-2026-09-10.html) — A to D on one cluster, C as adopted, the protrusion anatomy figure and the 100 / 50 / 25% recognition test that settled which of the two channels is data. **Its motion specimen predates the zero-translation ruling and animates a positional drift; `{motion.breathe.translation}` is what binds.**

#### Network zone

**Rule.** Networks are rendered as areas, not edges: an enclosing region around everything that shares a network. **Zones group; they never remove** — removal is the filter's job alone, and the left menu's `networks` filter takes the zones with it. The zone is one of two grouping languages on this canvas and the only one that is a field: *the tinted field says network, the outline says stack* — see *Stack outline* below, which owns the seven tells that keep them apart. A multi-network object belongs to several zones; the geometry that resolves that is *Zone rendering mode*, under *Chrome controls*.

**Beyond six networks the hue rotation repeats, and the repeat is resolved by a fill pattern marking the octave** (`{shape.network-octave}`): hue is the network's index in the six-step rotation, pattern is which turn of that rotation it is on, so network 7 is hue 1 in the second pattern. The pattern rides the zone field itself, not only the badge (`{shape.network-octave.zone}`), which is why networks stay distinguishable at **LOD rung 0**, where the network pastille does not render at all — the landing frame and the exported frame regain an exact network answer they did not have.

*Cost.* The pattern is unproven inside an 8px badge — see `DESIGN.md` → *Open Questions*. The channel this decision rests on is the field, where the pattern has room; the badge is corroboration.

#### Stack outline

**Rule.** A stack is not a bubble and not an area. It is a grouping outline girdling the services of one stack, with its name set on the outline (`{shape.stack-outline}`, `{stroke.stack-outline}`). This closes the last per-type rendering question the brief left open. Four rules follow from it:

1. **Not selectable** `[ASSUMPTION]` — clicking an outline is a click on empty background and therefore deselects, the same ruling the node backdrop already carries for the same reason: it is a grouping mark, not an object you can open. A stack's members are what you click.
2. **It derives its position, never owns it** (`{shape.stack-outline.position}`) — the outline follows wherever the zones put its members, because two marks owning position is the node-backdrop failure and this is the door it would return through.
3. **The two grouping languages must never read as the same mark:** the tinted field says network, the outline says stack — a field with no boundary against a boundary with no field, open against closed, amorphous coastline against drafted equidistant offset, label inside the field against label on the stroke. `DESIGN.md` → *Stack outline* holds all seven tells.
4. **Not drawn in the node view**, because a stack spans machines by construction and its hull would cross every region — the same reason network zones are not drawn there.

*Rejected — stack-as-bubble.* Fifteen services converging on one stack node recreates exactly the fan-in that got images removed from the map, so the object type with the most members would buy back the hairball the whole spine is spent avoiding.

*Rejected — stack-as-area.* The tinted field is the network's, and a second filled field over the same canvas is the mud the zone study predicted, arriving twice.

*Cost — a body inside an outline is not necessarily in that stack.* The outline threads around intervening non-members where the layout leaves room and encloses them where it cannot, so **the stack pastille is the exact answer where the two groupings cross**, exactly as the network hexagon is against the tint field.

*Cost — measured, and it cuts the other way.* A stack and a network that *share members* are struck around the same bodies, so their contours run near-concentric: at 1:1 in [`mockups/key-overview.html`](mockups/key-overview.html), **455px of the `obs` outline's 1140px perimeter runs within 14px of the `monitoring` isoline, and 346px of `shop`'s 1961px within 14px of `frontend`'s.** The seven tells separate the two languages *in kind*, and not one of them is a distance; they do not separate them *in position*. Carried to *Open Questions*.

What may move in that collision is not a contour. The zone owns position and the outline derives it, so neither of them moves; the zone label, a free annotation inside its own field, is the only thing that can, and only where a clear position exists. In the same render `BACKEND` had a clear position and its label moved into it (18px, clearance 6.6 → 23.8px); `FRONTEND` and `MONITORING` have none — best clearance anywhere in those fields is 4.9px and 0.8px — so both labels stay where they stand and rely on layer order and contrast. **A label collision is never resolved by displacing a contour.**

#### Node region

**Rule.** The node as foreground subject, and the surface Flow 3 runs on entirely. **A node is a region, not a bubble** — bubbles are objects that connect to things; a node is a *place* things sit in — so it is drawn as one panel per machine, laid out as a row across the canvas, holding the ordinary bubbles with their ordinary silhouettes, deformation, pastilles and edges. Nothing about a bubble changes because the ground under it did. Four behavioural rules:

1. **Regions are proportional to what they carry and the bubbles inside them are not resized**, so a machine carrying twice as much is visibly twice as full — the distribution read is an *area* read, with no bar, no percentage and no count badge, exactly as the orphan's isolation is Rémi's signal.
2. **The header is the identity and is selectable**: node name, role (`manager` / `worker`) and IP, carrying the node's own type pastille — this is the one place on the map where a node is an object you click, and clicking it opens the detail panel like any other object.
3. **An empty region renders at full size**, header and all, with one line of marginalia. A fresh machine carrying nothing is information; vanishing it would delete the answer.
4. `[ASSUMPTION]` **Region boundaries are not zones, and they are not stack outlines either.** A container inside a region still carries its network and stack badges, but neither network zones nor stack outlines are drawn in this view. Nobody decided this; it is the reading most consistent with the rest of the system, which holds that a node partition and a grouping mark cannot both own position — so only one is ever on a given surface, and in tab 2 it is the node. The stack outline has the sharper version of the same problem: a stack spans machines by construction, so its hull would cross every region on the canvas. In tab 2 the diamond carries stack membership alone, which is exactly what Flow 3 step 5 reads.

### Chrome controls

| Component | Where | Behavioural rules |
|---|---|---|
| **Zone rendering mode** | Left menu, display control | Two switchable renderings, not one geometry. **Mode A — `champs de teinte`** (soft blended tint fields `{colors.zone-tint-1}…{colors.zone-tint-6}` + dashed contour isolines `{stroke.zone.isoline}`, no closed outlines) is **the default, and therefore the screenshot frame**. **Mode B — disjoint blobs + echo** (`{stroke.zone.blob}`) is the precise alternative. Switching **re-lays out the map**: it is a movement, not a style swap, and is animated (`{motion.relayout}`). |
| **Orphan counter** | Left menu, sitting with the filters | A discreet row reading "3 objects with no stack". Clicking it **reframes the map onto the orphans**. **A finding aid, not an annotation:** it does not modify the orphan bubble's drawing in any way, so the tool still never marks an orphan as abnormal — marking it would be a judgement, and the brief forbids one. Distinct from *Orphan bubble* above: that row is the object; this one is only the way to find it. |
| **Detail panel** | Right of the canvas | Opens on clicking any object. Factual text only — IPs, image tags, mounts, placement and the complete list of networks when the pastille rail has dropped badges. Never modal, never full-screen, never a replacement for the map. It has three states — loading, subject vanished, stale — and all three are specified in State Patterns below. |
| **Control chip** | Toolbar, and inline in the *Export* row | The one on-screen control vocabulary (`{components.control-chip}`), and it has exactly **three behavioural states and no others**. **Action** — momentary: it does a thing and returns to rest, with no state of its own (*Fit to chart*, *Reorganise*). **Latched** — it reports a live state the user put it in, and clicking it again clears that state (*Isolate*, *Keep only this*). **Unavailable** — present but inert, with no pointer: the control is shown rather than hidden so that the toolbar does not reflow as selection changes. **No chip is ever a filled button**: the product is read-only, there is no primary action, and a filled control would promise one. Latched chips take `{colors.glass}` for the same reason a selected bubble does — *if it glows, the user chose it*. |
| **Focus ring** | Every focusable chrome control | The visible focus indicator (`{components.focus-ring}`, `{colors.focus}`). It appears on left-menu rows and checkboxes, the three bottom tabs, the toolbar chips and the *Export* row — **never on the graph canvas**, which is pointer-only in v1. It is deliberately not glass: glass means *you clicked this*, focus means *you have not yet*. See *Accessibility Floor* for what is and is not reachable by Tab. |
| **Isolate** | Toolbar chip, present while an object is selected | Sets a **service** as the subject and switches to the service view (tab 3). The only entry into tab 3 — which is why that view has no empty state. Latched while a subject is set. When the selected object is not a service, the chip is present and **unavailable** rather than absent, so the toolbar does not reflow under the pointer. |
| **Keep only this** | Toolbar chip, immediately right of *Isolate*, present while an object is selected | **The relational filter, and the mechanism for the brief's second verbatim job — *"show me only what touches `backend`"*.** Clicking an object already lights its reachable set and dims the rest; this **promotes that highlight into a real filter and removes the rest**. It reuses the existing adjustable hop reach rather than adding a second control, and while latched it reports the current reach — 1, 2 or ∞ — on the chip itself, so the user can always see how wide the filter is. **The distinction it must never blur is the one the whole interaction model rests on: the highlight dims, the filter removes.** Dimming leaves `{opacity.dim.unreachable}` of everything on screen; *Keep only this* leaves a genuinely smaller map. Clearing the chip restores the full chart — it is a view state, not an edit. It composes with the type filters in the left menu like any other filter, and it is subject to the same *filter yields nothing* exception below. |
| **Bottom tab bar** | Chrome | Three tabs: Overview / Nodes / Service. A tab switch changes the view entirely. |
| **Palette** | Left menu, display control | **Predefined colour sets, chosen whole.** The user picks among iso-luminant palettes shipped with the product; the user never picks an individual colour. **[DEPARTS FROM BRIEF]** — the brief's v1 scope reads *"filtering and display control (what is shown, **colours**, text size)"*, which implies free colour control, and this is bounded. The reason is the one thing the product cannot give away: *the edges are the product*, and the ≥3:1 edge floor over every zone tint is a **property of the whole set**, not of any single swatch. One user-chosen hue at the wrong luminance dissolves an edge somewhere on the map, silently, and nothing in the product would tell them. Bounded is honest; free would be a promise the guarantee cannot survive. Behaviourally it is a display control like any other: it changes how what is present is drawn, never the population, and it never re-lays the map. |
| **Left menu** | Chrome | **Three kinds of control, and the difference is load-bearing** — filters, display controls, and one survey control that is neither. **Full rules below.** |
| **Fit to chart** | Toolbar chip, always present — an action | Frames the whole cluster at LOD rung 0. **It must be an on-screen control** because there are no keyboard accelerators — there is no `0` shortcut to press. |
| **Reorganise** | Toolbar chip, always present — an action | Manual re-layout, animated (`{motion.relayout}`). **The only control whose purpose is to move earned positions** — the zone-mode switch and the node-backdrop toggle move them too, but as the consequence of changing the geometry, never as the point. It never fires by itself, and nothing else in the product may. |
| **Export (SVG / PNG)** | **Left menu**, alongside the display controls, as a row carrying a *Safe to share* checkbox above two inline action chips | **What you see is what you get**, with every address masked by default. Export is in v1, against the brief. **Full rules below.** |
| **Refresh interval** | Left menu, with the display controls | **The brief's *configurable* given a surface.** The brief specifies "auto-refresh every 5–10s, configurable"; the control lives in the product rather than in a config file. Four steps — **5s / 10s / 30s / 60s** — the current one latched. `[ASSUMPTION]` **10s by default**: the slower end of the brief's own band, and the kinder default on the large cluster this control exists for. The steps above 10s are the *configurable* part, and they are what let someone on a few hundred objects slow the survey down when it costs. It is a third kind of left-menu control and the only member of its kind: it changes neither population (a filter's job) nor rendering (a display control's), but **how often the survey behind both is taken**. A change takes effect at the next survey, and **it never re-lays the map** — the three-things rule under *Layout stability* is untouched. **Staleness is keyed to the age of the survey, never to the interval**, so choosing 60s does not itself age the chart: the stamp counts real minutes and the veil runs over real minutes, exactly as at 5s. |

#### Left menu

**Rule.** Three kinds of control, and the difference is load-bearing.

1. **Filters** remove object types from the map — volumes, networks, services, stacks, containers. Structural.
2. **Display controls** change how what is present is drawn — zone mode, node backdrop, palette, text size `{typography.scale}`, density `{density.scale}`, theme. They never change population.
3. **A survey control**, `{components.refresh-interval}`, which is neither: it changes how often the survey behind both is taken. It is the only member of its kind, and it is named rather than filed under a heading it does not fit.

**The `networks` filter is the radical one.** Unchecked, it removes both the zones and the network attachment edges. Everything expressing network disappears — no tint fields, no isolines, no attachment links. Objects and their volumes remain. Network is the product's primary axis, so this filter empties its primary expression; it is offered anyway, because a filter that removes is the only honest kind. It does not contradict *nothing may dissolve an edge*: that rule binds *rendering* choices, and a filter is structural.

**The `Stacks` filter:** unchecked, it removes the stack outlines and their names, and nothing else. No body disappears, because a stack was never a body — the services keep their places, their edges and their diamond pastilles, so *which stack* is still answerable from the badge and the detail panel. It is the one filter whose population is a grouping mark rather than a set of bodies, and it still removes rather than restyles, so it is a filter and not a display control: the boundary case of the distinction above, stated rather than smoothed.

#### Export (SVG / PNG)

**Rule.** **What you see is what you get** — current framing, current zoom and active filters are respected literally. **[DEPARTS FROM BRIEF]** — the brief puts SVG/PNG export out of v1 ("wanted later, screenshot accepted for now"). It is in v1, because the exported frame is what strangers post, and that is the brief's top external success signal. Export therefore constrains the design of the default view.

**Safe to share — a mask, not a redaction of the map.** The checkbox masks every IP and every CIDR in the exported frame and nothing else. Those addresses appear in three places, and all three are masked: the zone sublabel beneath a network name, any address on a plate, any address in the legend. Everything structural survives untouched — silhouettes and their deformation, zone fields and their octave patterns, stack outlines, every edge, every object name, every pastille, the bezel and the chart legend. The screenshot stays exactly as impressive and stops being an infrastructure plan. `DESIGN.md` → *Masked values* draws the struck value; the footprint is unchanged, so nothing in the frame reflows.

**It is on by default.** `[ASSUMPTION]` — the ruling establishes the mode, not its default, and this file has to pick one. The asymmetry decides it: forgetting to mask is irreversible and public, forgetting to unmask costs one click. Flow 2's climax is literally posting a full topology publicly, by a user who has read almost none of it and configured nothing, which is precisely the case a default has to serve. The brief ranks the reconnaissance risk first among its carried questions; a default that answers it only when the user already knew to look answers nobody.

*Cost — the default narrows* what you see is what you get. The default export is no longer byte-identical to the screen. The narrowing is exact and is confined to it: **population, framing and zoom are still literal**, every object and every relationship on screen is in the frame, and only the numeric values are struck. The state is visible and one click wide in the row that produces the artefact, so nothing is hidden from the person exporting.

*Cost — what is not masked still identifies.* Object names (`postgres-prod`, `client-acme-api`), stack names, network names, volume names — and the topology itself: how many services there are, what is attached to what, where the volumes sit. A reader who knows the organisation learns a great deal from a masked frame. **The mode removes the addresses, not the map**, and it is described that way rather than as anonymity.

### Chart apparatus

| Component | Where | Behavioural rules |
|---|---|---|
| **Survey stamp** | Chrome, always visible — right margin of the bottom tab bar | The age of the data in plain words — "Surveyed 4 min ago". **Not a control:** it is marginalia, it is never clickable, and there is no manual refresh behind it. Drives the staleness treatment, and it carries the age **for the map and the detail panel both**, because the panel does not age visually. |
| **Chart legend** | A permanent band beneath the canvas, chrome | A chart legend, not a UI key. It decodes the channels the map encodes silently, and it ships inside the export. **Full rules below.** |

#### Chart legend

**Rule.** A chart legend, not a UI key — and distinct from the left menu's per-filter colour swatch, which is a control rather than a key. It decodes the channels the map encodes silently: the **pastille system**, one column per family carrying the family's shape and its colour values, and the **networks actually on the chart**, each with its hue and its octave pattern, rather than the six-hue palette. (Six swatches cannot decode eleven zones, and a key that provably fails on its own picture is worse than no key.)

It also decodes a second grouping language, and without adding a column: the stack column carries both marks of the stack channel — the diamond that says *which stack*, and a length of the outline that says *a stack* — and the zone column carries the counterpart line, *the tinted field says network, the outline says stack*. That one sentence is what stops a stranger reading the two groupings as the same mark, and it travels in the export with the rest of the key.

It carries a typographic specimen too — `pgdata` / `pg-data` / `pg_data` / `pgdatal`, stacked on a shared left margin at the size they render on a protrusion — so the exported frame proves the disambiguation claim it cannot demonstrate at rung 0.

**It is part of the chart, so it is in the export** — the exported frame carries its own key, and the frame is what strangers see. `[ASSUMPTION]` Always present, with no control to summon or dismiss it: the session decided the chart legend's register, never whether it can be put away.

→ Zone geometry study: [`mockups/zone-overlap-options-2026-09-10.html`](mockups/zone-overlap-options-2026-09-10.html) — four candidate geometries on one cluster, none ranked; the two that shipped are **variants 2 and 4**, mode B and mode A above.

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| **Cold load** | Overview | **The map draws itself in front of you**, in layers: network zones → bubbles → edges (`{motion.draw}`), preceded by the node backdrop **only when that display control is on**. Loading *is* the product's first movement; the user learns the structure by watching it appear. |
| **End of first load** | Overview | The draw closes with a **distinct resolution gesture** (`{motion.settle}`): the last layer lands, everything settles at once, and only then does the breathing begin. Visual and immediate — there is nothing to read. This is what stops "loading" and "living" from looking identical on a permanently alive graph, which is the risk the layered draw carries with it. |
| **Landed** | Overview | The whole cluster, fully zoomed out, **nothing hidden**, pastilles on. Jules: `il voit cash la vue entière dézoomée de toutes ses stacks avec toutes les infos, les pastilles etc.` The landing frame is **purely relational** — zones, stack outlines, silhouettes, edges, type pastilles — because the node backdrop is off unless asked for, and the outline derives its shape from where the zones put its members rather than claiming position of its own. Drawn at 1:1 in the dark default: [`mockups/key-overview.html`](mockups/key-overview.html). |
| **Alive at rest** | Every graph surface | Bubbles breathe continuously (`{motion.breathe}`) — `vivant en permanence`. **Motion is local deformation only, never translation, and the token now says so in numbers:** `{motion.breathe.translation}` is **`0px`** — the body centre does not move, at any scale, any density or any zoom — while `{motion.breathe.outline-excursion}` bounds the **outline** at ±3.4px applied *normal to the contour*, a deformation whose centroid is the rest centroid. The invariant core — name, identifier, pastille rail — is not touched by any of it: **labels and click targets never travel.** This is what lets `vivant en permanence` and *layout stability* below both hold in full, neither weakened, and it retires the legibility cost accepted at decision time, which was the cost of drifting targets. **Positional drift is zero, not small** — and the claim is now checkable rather than rhetorical. |
| **Layout stability** | Every graph surface | **Positions are earned and kept.** Across the 5–10s poll, nothing moves — and continuous motion never moves a centre either (above). A new container slides in near its neighbours (`{motion.enter}`); a vanished one fades in place (`{motion.exit}`). Rationale: the user must be able to say "the odd thing was top-left" and find it there again. **Exactly three things may re-lay the map, and all three are the user's own doing:** *Reorganise*, a zone-mode switch and toggling the node backdrop. Nothing else, ever. |
| **Selection active** | Every graph surface | Detail panel open **and** the reachable set lit, the rest dimmed, **and** the two subject-scoped toolbar chips present — *Isolate* and *Keep only this*. Deselect = click on empty background. There is no `Esc`. |
| **Detail panel — loading** | Detail panel | **The chassis draws immediately** — header, section heads, rules — and each value's place is held until the value arrives. **No spinner, no skeleton shimmer**: an instrument with a needle not yet settled, not a surface pretending to hold content it does not have. The panel is never blank and never jumps: the rows it will hold are the rows it shows. |
| **Detail panel — subject vanished** | Detail panel | The selected object is gone from the next survey while the panel is open. **The panel stays and the values freeze**, with one line reading *"Not in the last survey."* **It is dismissed by the next click, never by itself.** A container disappearing while you are reading it is frequently the answer the user came for, and closing the panel would delete that answer. On the map the bubble fades in place (`{motion.exit}`) — the two marks agree, and neither reclaims anything until the next re-layout. |
| **Detail panel — stale** | Detail panel | **The panel does not take the map's veil.** The map pales and desaturates; the panel holds full contrast. Text is the one thing that must not age — an aged chart is still a chart, but an unreadable column of facts is not a column of facts — and the survey stamp in the tab bar carries the age for both surfaces, which is why the stamp is stated to speak for the panel as well. |
| **Filter yields nothing** | Overview / Node / Service | Named exception, one case only: when a filter would **empty** the map, the excluded objects return as very pale context (`{opacity.dim.filter-context}`) so the user can see what the filter has excluded. **This is not the general filter behaviour** — a filter genuinely removes; "filters are structural, not cosmetic" stands. |
| **Stale data / refresh failure** | Every surface | **The map stays.** Two marks run together: the **survey stamp ageing in words** — an explicit "Surveyed N min ago" — and the map **paling and desaturating progressively** (`{colors.state-stale}`) as the survey gets older. **The map is never hidden, never covered, never replaced** — no banner, no overlay, no error screen, no error colour. It ages in place and stays readable while it does; an out-of-date chart is still a chart. |
| **Socket unreachable (cold, never drawn)** | Full surface | Distinct from stale data, which presumes a map already on screen. Here there is no chart to keep. **A screen in the chart register that explains and guides**, and it is the only screen in the product allowed to teach: *what* is missing (access to the manager node's Docker socket), *why* Portolan needs it, and *the exact configuration line* that fixes it. The brief makes socket access a first-order security concern; this is where that gets explained rather than assumed. Register still chart, still no exclamation marks — an unreachable survey, not an error dialog. **This screen is the second site on the collector seam** — it is Swarm-specific by construction; see *Foundation*. |
| **Empty cluster** | Overview | A fresh swarm with nothing deployed, cluster reading fine. **The node backdrop renders here even though it is off by default** — those machines are real information and are the whole of what there is to show, and the reason the backdrop is off elsewhere (zones and nodes competing for position) lapses when there are no zones. The empty-cluster behaviour itself was decided outright; the only inference is that it survives the later backdrop-off ruling, which it does, because an empty cluster has nothing else to draw. The rest of the map is empty space with a short note in the chart register. Not an empty state, not an onboarding prompt: a sea chart with no ships on it is still a chart. |
| **Below minimum viewport** | Global | Under `{layout.min-width}`, an honest message — *off-chart* — instead of a degraded rendering. Portolan does not pretend to fit. **Browser and OS zoom reach this state**, because they shrink the CSS viewport. That is a real limitation, not a rendering detail, and it is stated as one in *Responsive & Platform*. |
| **Zone-mode switch, node-backdrop toggle** | Overview | An animated re-layout, not a repaint (`{motion.relayout}`). The user must be able to follow objects from one geometry to the other, which is why nothing fades out and reappears. |
| **Reduced motion** | Every graph surface | `prefers-reduced-motion` stills **all continuous motion**: the permanent breathing (`{motion.breathe}`) stops entirely. **Action-triggered transitions stay animated** — filtering, the zone-mode re-layout (`{motion.relayout}`), enter/exit (`{motion.enter}` / `{motion.exit}`), selection — because they explain what just changed, and removing them would leave the user to work out what happened. The layered first draw (`{motion.draw}`) and its resolution gesture (`{motion.settle}`) are kept for the same reason. The line is exact: **decorative motion removed, explanatory motion kept.** |

## Interaction Primitives

**Zoom and filter are different instruments and must never be confused.** The reconciled formulation, which refines the brief's rule:

> **Zoom changes sharpness, never population. Filter changes population, never sharpness.**

**[DEPARTS FROM BRIEF]** — the brief says "Zoom moves you closer; only filtering takes things away", and progressive level-of-detail was chosen with that friction stated at decision time. The reconciliation is exact: **nothing is ever removed by zooming**. The set of objects present is identical at every rung; only how much text each object renders changes.

The rungs that word names are the LOD ladder, set out in *Information Architecture* above.

**Pan and zoom — map convention** (Google Maps / Figma):

- Wheel and two-finger gesture = zoom.
- Drag on background = pan. `Space` + drag also pans.
- Click on an object = **select**: the detail panel opens **and** the reachable set lights. One gesture does both — the text answer and the path answer arrive together.
- **Reachability reach is adjustable.** A control in the left menu sets how far the highlight propagates: one hop, two hops, or all. It exists because on a well-connected cluster an unbounded highlight lights almost everything and the answer dilutes to nothing.
- Click on empty background = deselect.
- Semantic zoom is a *view*, not a gesture: isolating one service is tab 3, not a deeper zoom.

**Hover and pointer affordance** — `[ASSUMPTION]`, because the session forbade a treatment (glass) without ever specifying a replacement, and, with keyboard traversal of the graph out of scope, this is the **map's only pre-click channel**.

- **Every bubble, every echo and — in the node view — every region header is clickable, and the cursor says so.** The pointer changes over any selectable object and stays the default arrow over zones, **stack outlines**, bands, edges and empty canvas. **The cursor is the affordance**, which is why it can be universal without adding a mark to the map.
- **Hover lifts the object's own contour and nothing else.** It never dims anything, never lights a reachable set, never opens a panel, never moves a body, and never uses `{colors.glass}` — glass means *you clicked this*, and a hover state that borrows it would make the map's one selection signal ambiguous. The rule is exact: **hover says *you may click this*; the click says everything else.**
- **Hover has no role on the chrome beyond the ordinary** — a control chip under the pointer reads as available, and that is all.
- Nothing in the product requires hover to be discovered: every object is clickable, so there is no hidden target to find.

**Banned**

- **Keyboard accelerators — none, anywhere.** No single-key shortcuts, no modifier chords. The keyboard-accelerator variant of the pan/zoom convention was offered and declined. Two consequences are load-bearing and are honoured above: deselection is a background click (no `Esc`), and *Fit to chart* must exist on screen (no `0`). `Space` + drag is a **pointer modifier**, not an accelerator, and is the one keyboard-adjacent gesture that survives. **This bans shortcuts, not focusability**, and that is now a ruling rather than a reading: ordinary tab focus on the chrome exists, with a visible focus ring. See *Accessibility Floor*.
- Anything that re-lays out the map without the user asking.
- Any write, management or remediation action. Any rule engine, audit or alert (brief), the health light excepted.

## Accessibility Floor

Behavioural. Contrast and palette live in `DESIGN.md`. This floor is **deliberately narrow** and says so rather than implying coverage it does not have.

**In scope**

- **Colour + shape double-coding on every pastille.** Shape = family, colour = value, so the *dimension* being read never depends on colour. Four shapes, fixed rail order, no family ever borrows another's form.
- **Value-level colour is safe in two families of four, and the claim is narrowed to exactly those two.** Measured as CIELAB ΔE under deuteranopia on the dark palette, and discharged family by family in `DESIGN.md` → *Colour-vision coverage*:
  - **Object type — ΔE 20.5 ✓ safe.** It is the *only* pastille family at rung 0, so the whole of the landing frame's and the exported frame's badge channel is covered.
  - **Health — ΔE 18.7 ✓ safe.** This is what blue / amber / red was for, and it worked. It covers this family and no other.
  - **Stack — ΔE 3.9 ✗ not covered on the badge, narrowed on the map.** The diamond says *you are reading stack membership*; *which* stack, **on the diamond**, is colour and only colour, and that has not changed. What the stack outline changes is that **stack identity on the map is now a written name** — set on the outline at 6.6–7.8:1, exactly as zone identity is carried by the zone label — so a colour-blind reader can name every stack on the chart without reading a swatch. What stays colour-only is reading membership from the badge alone.
  - **Network — ΔE 2.6 between hues within one octave ✗ not covered.** `{shape.network-octave}` is a genuine non-colour channel, but it separates **octaves, not hues**: network 1 and network 7 are distinguishable to anyone, on the field and on the badge; network 1 and network 3 are the same colour. A colour-blind reader can tell a network from any network in a different octave, and cannot tell it from the five others in its own octave.
- **Zone identity does not depend on colour at all.** It is carried by the written zone label and the CIDR beneath it, at 13.8:1. **That is what actually holds the line** — the tint is a grouping cue, not an identity, and it was never asked to be one.
- **Adjustable text size (`{typography.scale}`) and density (`{density.scale}`), and a choice of palette,** are first-class controls in the left menu, not a settings afterthought — the brief makes user-adjustable presentation a requirement. The text range is `{typography.scale.steps}` **0.90 / 1.00 / 1.15**; each step multiplies every rendered size and then **clamps at each role's own floor** (`{typography.scale.clamp}`), so 0.90 shrinks only what has room and no identifier ever renders below 9px. Density is a separate control and must stay one: roomier and bigger are different needs.
- **A `prefers-reduced-motion` path** alongside the continuous-motion decision — a floor requirement, not a reopening of that decision. It stills all continuous motion and keeps every action-triggered transition: decorative motion removed, explanatory motion kept. Specified in State Patterns above.
- **Ordinary tab focus on ordinary chrome controls. Ruled, not assumed.** Jules has decided it: **tab focus on the chrome exists, with a visible focus ring**, and what is excluded is keyboard **traversal of the graph** and keyboard **shortcuts** — two exclusions, both narrow, both stated below. The left menu's rows, checkboxes and chips, the three bottom tabs, the toolbar chips and the *Export* row are ordinary focusable elements in DOM order, each showing `{components.focus-ring}` in `{colors.focus}` when focused.

**Explicitly out of scope, v1**

- **Keyboard traversal of the graph.** Raised by the facilitator, not selected. **The map — the canvas and everything drawn on it — is mouse / trackpad only** in v1: no tab order over bubbles, no arrow-key navigation, no keyboard route to selection. Stated plainly rather than softened. The chrome around it is a different surface and is focusable (above).
- **Screen-reader support.** Same origin, same status. There is no accessible text equivalent of the map in v1.
- **Value-level colour in the stack and network families.** Six-value rotations at pastille size are not separable under deuteranopia or protanopia, and the octave pattern does not reach inside an octave. The exact value is available in the detail panel, in words. **Consequence, stated rather than left to be discovered: Flow 1's second discovery — a bubble whose stack pastille disagrees with the zone it sits in — compares two marks that are both in the failing set. A deuteranope cannot perform that discovery on the map.** The stack outline does not rescue it: the name on the outline makes the *stacks* readable without colour, but the discovery compares a diamond against a tint and both remain colour-only. Raised, not solved in v1.
- **Enlarged text beyond +15%, and browser or OS zoom as a route to it.** This is a real limitation and it is named as one. `{typography.scale}` tops out at 1.15×, which puts chassis body text at 14.95px — below the 16px browser default. Browser zoom is **not** an alternative: it reduces the CSS viewport, so it walks the app into the off-chart refusal at every supported display width — the arithmetic is in *Responsive & Platform*. **There is therefore no route to 200% text anywhere in the product.** The 1440px floor is a deliberate scoping decision and is not reopened here; its collision with the brief's own adjustable-presentation requirement was never noticed, and it is recorded rather than smoothed over.
- **Chrome behaviour at the top of the text range.** The left menu is fixed at 236px and the detail panel at 320px; type multiplies, columns do not. No overflow, wrap, scroll or truncation behaviour is specified for either at 1.15×, and none is invented here.

**Motion, stated honestly.** Nothing on the map translates — not a centre, not a label, not a click target; the tokens and the rule are under *State Patterns → Alive at rest*. The consequence for this floor is the whole of what it owes: **a user who cannot track motion is not required to track anything in order to click anything**, and `prefers-reduced-motion` stills the breathing entirely with nothing lost.

## Responsive & Platform

Desktop / laptop browser, **1440px and up**. No tablet target, no mobile target, no degraded rendering: below `{layout.min-width}` Portolan says so — *off-chart* — and stops. A cluster map that has been squeezed into a phone is not a smaller map; it is a wrong one.

**Browser support: recent Chromium, Firefox and Safari.** Three engines, current versions, no legacy target and no polyfill budget.

**Browser and OS zoom are not supported, and that is a limitation rather than a silence.** Zooming the browser reduces the CSS viewport, so it walks the app straight into the off-chart refusal — 110% on a 1440px display, 150% at 1920px, 200% at 2560px. In-app `{typography.scale}` is the only enlargement path, and its ceiling is +15%. The consequence is spelled out in *Accessibility Floor*.

## Inspiration & Anti-patterns

**Learned from**

- **Weave Scope** — the only complete relational graph that ever shipped, and it died carrying an open edge-legibility issue (`weaveworks/scope` #1636). That issue is the reason this spine spends its whole budget on legibility mechanisms — zones instead of network edges, the LOD ladder, `beaucoup à regarder, peu à lire` — rather than on drawing more edges better.
- **Netdata's Network Topology Viewer** — proof that the live topology read is tractable, and the clearest statement of what Portolan is *not*: Netdata answers "what talks to what" (flows); Portolan answers "what is attached to what" (the Docker object graph).
- **Map applications (Google Maps, Figma)** — the pan/zoom convention taken wholesale, unmodified. Nobody should have to learn how to move around this map.
- **Real portolan charts** — `cartographie assumée`: the visual vocabulary of actual charts, chosen over discreet allusion. It supplies the chassis vocabulary above; `DESIGN.md` owns the rest.

**Rejected**

- **Portainer's cluster visualizer, `dockersamples/visualizer`, Swarmpit, Arcane** — node columns, task boxes, tables and lists. Inventory, not topology. Portolan is not another dashboard, and a new dashboard is dead on arrival.
- **3D infrastructure visualisers** — Vizceral, Netsil AOC, kube-universe, Portus, hawtio-kube3d, k3s-observatory: every one dead, discontinued, or disowned by its own author. 2D is settled. Depth survives only as style: shadow and elevation are allowed, spatial 3D is not.
- **Audit engines, rule sets, alerting.** Portolan shows; the user sees. The health traffic light is the single, marked departure.
- **Metaballs / liquid fusion** as the route to "organic" — it would dissolve the edges.
- **Hand-drawn wobble** as the route to "organic" — irregularity must be structural, not sketchy.

## Key Flows

### Flow 1 — Rémi, the inheritor

`[ASSUMPTION]` The name *Rémi* was supplied by the facilitator, built on by Jules, and never confirmed by him.

He has been handed a company cluster with no documentation, to clean up and check for security problems.

1. Rémi runs one `docker stack deploy` and opens Portolan in a 1440px browser window. **There is no login** — the map is the first thing he sees.
2. The map draws itself in layers — network zones, then bubbles, then edges. He learns the shape of the cluster by watching it appear. **No node bands lie under it:** the backdrop is off, so the first thing he reads is relationships, not machines.
3. It settles at rung 0: the whole cluster, dézoomé, nothing hidden. Zones with their octave patterns, **stack outlines with their names set on them**, silhouettes, edges, object-type pastilles. Almost no text — the two grouping languages read apart at a glance because one is a tinted field and the other is a line.
4. **Climax — the orphan.** One bubble floats between the zones, **outside every outline on the chart**, attached to nothing. Everything else is grouped; it is not. No badge told him and no rule fired: its isolation is the signal.
5. He zooms toward the `frontend` tint field. Stack, network and health pastilles resolve; service names appear.
6. **Climax — the intruder.** A bubble sitting inside the `frontend` zone whose **stack pastille says something else**. The mismatch between the zone and the badge *is* the anomaly. The encoding did the work; there is no rule engine behind it.
7. He clicks it. The detail panel opens — IPs, image tag, mounts, placement — and everything reachable from that container lights up while the rest dims. He can see how far it goes. The reach is wider than he wants, so he pulls it to one hop, then presses **Keep only this**: the dimmed remainder is now genuinely gone, and what is left on screen is the answer to *show me only what touches this*. Clearing the chip brings the cluster back.
8. He selects the service that container belongs to and presses *Isolate*. The service view opens on that service alone: its networks, volumes, containers and immediate neighbours, without the other 200 objects. A semantic zoom — the thing zooming the overview cannot give him.
9. Back on the overview, he keeps descending. At rung 3 the protrusion labels resolve.
10. **Climax — the twins.** On one container, two protrusions side by side: `pgdata` and `pg-data`. In `{typography.mono}`, at that size, they are the names of two different volumes. He now knows one of them should be deleted. Portolan never said so. The beat is drawn at 1:1 in [`mockups/key-overview-selected.html`](mockups/key-overview-selected.html) — `api` selected, panel open, reachable set lit and the rest dimmed, *Keep only this* in the toolbar, and `pgdata · rw` beside `pg-data · ro` on one brass-ticked baseline, which is the adjacency this step turns on.
11. He clicks empty background to deselect, then *Fit to chart* to re-frame the whole cluster.

**Failure paths**

- *Refresh fails mid-inspection.* The map stays and begins to pale; the stamp reads "Surveyed 6 min ago". He keeps working on a chart he knows is ageing.
- *He filters too tight* — volumes only, one network — and the map would empty. The excluded objects come back as very pale context, so he can see what he excluded rather than an empty canvas.
- *The map has deformed after weeks of deploys.* He presses *Reorganise*. Nothing moves his positions unless he asks it to.
- *The socket is unreachable on cold load.* No map is ever drawn, so there is no chart to keep ageing. He gets the explaining screen instead: what is missing (access to the manager node's Docker socket), why Portolan needs it, and the exact configuration line to add. He fixes it and reloads — and he has learned, at the only moment he would listen, what access he just granted.

### Flow 2 — Tom, the homelabber

`[ASSUMPTION]` The protagonist is the brief's "tribe" — the self-identified Swarm operator — and was never named by Jules; *Tom* is this document's name for him. The steps are drafted from brief and session material and are flagged for Jules's correction. **The climax is Jules's own**, verbatim.

He runs six stacks on three mini-PCs at home. He adopts fast, and he shares.

1. Tom deploys Portolan out of curiosity, one `docker stack deploy`. He opens it and is on the map — there is nothing to sign into.
2. The map draws itself in layers. The first movement is the pitch — he has not clicked anything yet.
3. He filters nothing away. He turns everything **on**: volumes, networks, every zone — **and the node backdrop, because he wants it all**, which is exactly the deliberate trade that control exists for on a three-machine cluster. He wants the whole thing at once.
4. *Fit to chart.* Every network, every interconnection, every volume, in one frame.
5. He flips the zone rendering to disjoint blobs, watches the map re-lay itself, and flips back to the tint fields. The default was already the one he wanted.
6. **Climax — the screenshot.** Jules's words: `il voit tous les réseaux, les interconnexions, les volumes, toutes ces infos — presque trop pour que ce soit facilement lisible mais tellement classe pour flexer devant ses collègues, c'est là qu'il prend le screen.` The trigger is **density as pride**, not a discovery. He has read almost none of it — the richness is graphic, not textual, which is exactly how the same frame stays legible for Rémi. He switches to the light palette because it is going into a light-background thread, and exports PNG at that framing. **The *Safe to share* checkbox above the two chips is already ticked** — it is on by default — so the frame that lands in his downloads has every CIDR and every IP struck to a run of blocks at the same character pitch. **Nothing else about it changed**: same zones, same patterns, same outlines, same edges, same names, same legend, same density. He did not have to know the risk to be covered by it, which is the entire reason the default is that way round.
7. He posts it. That is the brief's top external success signal, produced by the default screen with no configuration. **What he has posted is still his topology** — every network name, every volume, every stack, and the exact shape of how it all connects — minus the addresses, and a reader who knows him learns a great deal from the frame. What the default removed is the part the brief called *a reconnaissance gift*. With no authentication in v1, exposure remains the product's live surface; see *Foundation*.
8. **The path where he wants the addresses in.** He is pasting into a private ops channel and needs the CIDRs, so he unticks *Safe to share* and exports again. One click, no dialog, no warning. The product does not argue with him — it defaults, it does not judge.

**Failure paths**

- *His laptop is 1366px wide.* Off-chart message, no degraded map. He opens it on the desktop instead.
- *He exports from rung 0.* The export ships without the fine labels — what you see is what you get. Accepted, and stated when export was promoted to v1.

### Flow 3 — Tom again, checking the spread

The journey — **checking distribution**, with the imbalance as the discovery — is Jules's. `[ASSUMPTION]` Attaching it to *Tom* is this document's choice, and carries the same unconfirmed name as flow 2.

It is Tom's rather than Rémi's for a reason: the discovery needs someone who knows what he *meant* to happen. Rémi inherited an undocumented cluster and has no intent to compare against; Tom deployed all of it himself.

Six stacks, three mini-PCs, two months of adding things.

1. Tom opens Portolan and switches to the **Node view** — bottom tab 2. A complete change of view, not a filter.
2. The nodes come to the foreground: no longer an optional ground beneath the stacks, but the subject. Three regions, side by side, each sized to what it carries and holding the ordinary bubbles unchanged.
3. At rung 0 there is almost nothing to read — three regions, their containers, object-type pastilles. He is not reading names. He is reading **mass**.
4. **Climax — the imbalance.** `node-01` carries roughly twice the bubbles of the other two. No bar chart, no percentage, no rule fired: the difference in mass *is* the discovery, exactly as the orphan's isolation was Rémi's.
5. He zooms into `node-01`. Container names resolve. Half of them belong to `media` — a stack he had meant to spread across all three machines.
6. He clicks one. The detail panel gives its placement, and confirms it.
7. Portolan stops there. It is read-only: the fix is a `docker stack deploy` in his terminal, not a control on this map. The next survey shows him whether it worked.

**Failure paths**

- *One machine is fresh and carries nothing.* Its region renders empty rather than vanishing — an empty node is precisely the information he came for. Same rule as the empty cluster.
- *Refresh fails mid-read.* Distribution is the read that ages worst; the spread on screen may already have moved. The stamp and the paling say so, and the map stays.

### Journey coverage

Overview: flows 1 and 2. **Node view: flow 3.** Service view: flow 1, step 8. Detail panel: flow 1 step 7, flow 3 step 6. Left menu: flow 2 steps 3, 6 and 8, plus flow 1's filter failure path. Toolbar: flow 1 steps 7, 8 and 11, flow 2 step 4. Every surface in the Information Architecture carries a journey.

## Open Questions

Nothing below is resolved in this document. The blockers and undecided states found while writing this spine have been closed since; **four design questions remain** — two carried from the brief, one raised by the network repair, one raised by rendering the stack outline — plus a naming confirmation. None of them withholds a token `DESIGN.md` needs; every token is named and specified.

| Question | Status |
|---|---|
| **Default legibility before any filter is applied, on a large cluster** — *carried from the brief*, the product's main open engineering question, and what killed the closest prior art. | Mitigated here by zones, the LOD ladder, `beaucoup à regarder, peu à lire`, the pastille system, keeping images off the map entirely, and — since — by the octave pattern that puts an exact network answer back into the rung-0 frame, the type and mark floors and the elevation floor that stops rung 0 fogging. **None of it is proof. Not closed, and nothing in this revision closes it.** Needs a real cluster of a few hundred objects, not a three-container lab. Carried identically in `DESIGN.md` → *Open Questions*. |
| **Who can reach the map, and from where** — *carried from the brief*, and first-ranked among its carried questions. It is live **because** there is no auth surface in v1, not despite it. | Half of it is answered here: *Safe to share* is on by default, so the frame that leaves the product carries no address. The other half is the running map itself — where it is served, to whom, over what — and that belongs to architecture, not to a checkbox. **Not closed.** Stated at *Foundation*, and reached by Flow 2, step 7. |
| **Does the octave pattern resolve at badge size?** Raised by the decision that repaired the network channel, and owned by `DESIGN.md` → *Open Questions*. | Open there, noted here because the behavioural consequence is this file's: if the pattern fails inside an 8px hexagon, the network answer at rungs 1–3 falls back to the zone field and the detail panel, which is where it already is at rung 0. The decision does not depend on the badge; the badge is corroboration. |
| **Do the two grouping contours stay apart where they coincide?** Raised by rendering the stack outline at 1:1, and owned by `DESIGN.md` → *Open Questions*. | Open there, noted here because this file is where the two grouping languages are declared never to read as the same mark. A stack and a network that share members are struck around the same bodies, so their contours run near-concentric — measured at 1:1 under *Component Patterns → Stack outline*. The seven tells separate the two languages *in kind*, not *in position*, and nothing may be moved to buy clearance. Distinct from the legibility row above: that one asks whether a dense frame can be read; this one asks whether two marks that must never be confused can be told apart where they are drawn on top of each other. |
| Protagonist names. | *Rémi* facilitator-supplied and unconfirmed; *Tom* invented by this document and carried through three flows. Both still marked `[ASSUMPTION]` at their flows. |
