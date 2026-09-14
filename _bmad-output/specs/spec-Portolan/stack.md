# Stack

Companion to `SPEC.md`. What Portolan is built with, and what was ruled out. Every version claim below
was verified by web search on 2026-09-11 and carries its date, because staleness is the failure mode of
a file like this.

## Language and runtime

**Node.js 24 LTS + TypeScript, server and client.**

*Binds:* the three-seam boundary, the three-surface coupling limit, the single-image constraint.

*Reason:* one definition of the graph model, imported from both sides of the seam, and the
three-coupling-surface contract enforceable in a single language.

*Go was ruled out explicitly.* Its performance addresses nothing here: the latency requirement is
entirely in the browser and the server is I/O-bound on the socket. **Accepted and named cost:** an
image of roughly 80MB (`node:24-alpine`) against roughly 15MB (Go, scratch).

*Version ground, verified 2026-09-11:* Node.js 24 is Active LTS — maintenance from 2026-10-20, EOL
2028-04-30. Node 26 becomes Active LTS on 2026-10-28. Node 22 is in maintenance, EOL 2027-04.

## Rendering

**The renderer is bespoke. This is a finding, not a preference.** This section, with the Node.js
choice above, is what answers NFR-19 — which the PRD left entirely unchosen.

No graph library can render Portolan. Sigma, Cytoscape and vis-network were evaluated, and none of
these is an extension point in any of them:

| Requirement | Why no library reaches it |
| --- | --- |
| Seeded irregular hulls | Silhouette is a data channel, not a node style |
| Body stretch toward linked objects | Node geometry driven by edge topology |
| Breathing as local deformation, translation 0px | Libraries animate position, which is the one thing forbidden |
| Composited tint fields with contour isolines | Not a node/edge concept at all |
| Derived stack outline | A group hull that never owns position |
| Mark rail in screen space | Marks that do not scale with the canvas transform |

**A library may serve as model and/or layout, never as the rendering.** A layout library is seed, not
spine: adoptable and droppable without the contract changing.

*Watch item:* `graphology` 0.26.0 is MIT and would be licence-compatible, but its last publication was
roughly two years before 2026-09-11. Staleness to re-check if it is adopted.

**Screen rasteriser backend — Canvas2D or WebGL — is deliberately unchosen.** See `SPEC.md` → Open
Questions; the scene decision in `architecture-decisions.md` is what keeps the choice reversible.

## Docker client

`dockerode` 5.0.1, published around July 2026 and alive as of 2026-09-11. Docker Engine series 29 is
the documented current line. Whatever client is used, the read-only-by-construction wrapper in
`architecture-decisions.md` sits between it and the engine.

## Licence compatibility

**AGPLv3 is a dependency filter, not just a `LICENSE` file.** Every dependency must be AGPLv3-compatible,
and that is a gate on adoption, not a later audit.

## Packaging

A single image, deployed by one `docker stack deploy`, running inside the swarm it maps. Air-gapped by
construction: fonts and every asset are served by Portolan itself, at a cost of a few hundred KB of
image.

**Multi-arch amd64 + arm64**, ratified 2026-09-14 — the homelab tribe is largely on ARM. Built and
published on tag; see *Verification and CI* in `architecture-decisions.md` for the gates around it.
