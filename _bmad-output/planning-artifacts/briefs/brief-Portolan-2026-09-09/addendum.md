---
title: "Portolan — Addendum"
status: draft
created: 2026-09-09
updated: 2026-09-10
---

# Portolan — Addendum

Supporting depth that does not belong in the 1–2 page brief. Intended for the PRD and
architecture work downstream.

**Evidence quality — read before relying on anything below.** Reddit was unreachable during *both*
research passes, so r/docker, r/selfhosted and r/devops sentiment is unassessed throughout — a real
gap, since that is the likeliest audience. All practitioner sentiment here is GitHub/HN-sourced and
should be re-checked before any go-to-market claim. Separately, **no primary source for Swarm market
size exists**: every figure in this document is a proxy, and the proxies disagree by 3.4×.

## Competitive landscape (research, 2026-09-09)

Sources are GitHub issues, project READMEs and HN. **Caveat: Reddit was unreachable during
this research — no r/docker, r/selfhosted or r/devops verbatims were collected.** Practitioner
sentiment below is GitHub/HN-sourced only and should be re-checked before any go-to-market claim.

### Existing Swarm tooling

| Tool | Swarm | Topology view | Maintained | License |
|---|---|---|---|---|
| Portainer CE | Yes | "Cluster visualizer": nodes as columns, task boxes. No networks, no volumes, **not a graph** | Active | zlib |
| Portainer BE | Yes | Same | Active | Proprietary; free tier cut 5→3 nodes for commercial use |
| Swarmpit | Native | Tables + metrics only | v1.10 (2026-04-16), 172 open issues, README says maintenance mode | EPL-1.0 |
| dockersamples/visualizer | Yes | Node columns + task rectangles (D3, not a graph) | Last push 2024-10-26 | Apache-2.0 |
| Weave Scope | Yes | **The only full relational 2D graph that shipped** | **Dead.** Last commit 2023-07-07; Weaveworks folded 2024-02-06 | Apache-2.0 |
| Grafana + cAdvisor/Prometheus | Yes | Time-series only, zero topology | Active | AGPLv3 |
| Netdata | Yes | Network Topology Viewer — live socket-level connection map | Active | GPLv3+ agent; cloud free ≤5 nodes |
| Dozzle | Yes (v8+) | Logs only | Active | MIT |
| Arcane | Yes (2026-03-27) | Lists/tables | Very active, 7.3k stars | BSD-3 |
| sammonsempes/DockerSwarmVisualizer | Yes | D3 force graph; nodes/services/networks colour-coded | Created 2025-12-15, 24 stars | Apache-2.0 |
| Dockge, Lazydocker, Yacht | No Swarm support | — | — | MIT |

### Only three tools render an actual relational graph

Weave Scope (the only complete one, dead), Netdata (network *flows*, not Docker objects), and a
24-star project from December 2025 that omits volumes, stacks and individual containers. The three tools
people actually run — Portainer, Arcane, Swarmpit — have **no relational graph at all**.

### The unmet need is documented over nine years

- Portainer issue **#506** (2017-01-18, closed 2021-10-06 *unimplemented*): "When I get a lot of
  software defined networks and containers it will become difficult to visualize what is connected
  to what."
- Portainer issue **#1658** (2018-02-15): "When we got lot of services/containers with lot of
  networks, we love to see how all this actually communicate. I search tools to do that, but can't
  find good ones."
- Portainer discussion **#9921** (from issue #8923, 2023-05-09), still open: visualise container
  networks, click nodes for IP / gateway / driver, test connectivity.
- Arcane issue **#591** (2025-09-28, 65 reactions) justifies its own existence by citing
  Portainer's 3-node cap and Swarmpit's lack of maintenance.

### 3D infrastructure visualisation: every prior attempt has failed

| Project | Outcome |
|---|---|
| Netflix Vizceral (WebGL traffic graph) | 4.1k stars, but Netflix states it is not used internally and not actively worked on; last push 2023-11-28 |
| Netsil AOC | Acquired by Nutanix 2018-03-12, discontinued as a standalone product |
| kube-universe (3d-force-graph) | 32 stars |
| Portus (Electron / react-three-fiber Docker 3D viewer) | 15 stars, dead since 2022-05-26 |
| hawtio-kube3d, Frettarix/Kubernetes-3d-visualizer, k3s-observatory | All dead |

The star ratio is the signal: `dockersamples/visualizer`, flat, has 3,338 stars, while the 3D infra
visualisers cluster at 15–32. Vizceral's 4.1k is the exception — and Netflix states it is neither used
internally nor maintained. No thread was found of anyone using a 3D infra visualiser as a daily driver.

Practitioner sentiment, verbatim:

- John Carmack, "3D interfaces are usually worse than 2D interfaces" (HN 2019-05-20, 287 points).
- HN user *jerf*: "you don't see in 3D. You see two 2D planes... depth is more like colour."
- HN user *DubiousPusher*: "maps are powerful because they remove extraneous information."
- Cambridge Intelligence (commercial graph-visualisation vendor): customers ask for 3D but "usually
  after a short discussion, customers come to their senses and realize 3D is not going to help their
  project."

### Licensing precedent in this niche

Permissive dominates: zlib (Portainer CE), BSD-3 (Arcane), MIT (Dozzle, Dockge, Lazydocker),
Apache-2.0 (Weave Scope, dockersamples), EPL-1.0 (Swarmpit), GPLv3+ (Netdata), AGPLv3 (Grafana,
since 2021-04-20). **No BSL or source-available tool was found in the Swarm-visualisation niche.**

Open-core precedents: Portainer (open CE + proprietary BE; free tier quietly reduced from 5 to 3
nodes) and Netdata (GPL agent + paid cloud). Broader-market reactions to non-OSI licences are well
documented: HashiCorp's BSL move produced the OpenTofu fork; Grafana explicitly rejected SSPL on the
grounds that "it's hard to say you're an open source company when you're using a license that isn't
accepted by OSI".

### Research conclusion

- **Crowded:** Swarm management UIs. Portainer, Arcane and Swarmpit own that surface. A new
  dashboard is dead on arrival.
- **Genuine whitespace:** a Swarm-native *relational* graph of network ↔ stack ↔ service ↔ container
  ↔ volume membership, with drill-in. Nine years of unmet Portainer requests plus a dead Weave Scope
  demonstrate both the demand and the vacancy. Netdata answers "what talks to what" (flows); nobody
  answers "what is attached to what" (the Docker object graph).
- **3D was evaluated and retired** (brief, §The Solution, 2026-09-09). The evidence above is retained
  as the rationale for that decision, not as an open argument.

## Docker Swarm ecosystem health (research, 2026-09-09)

**Reddit was unreachable for this pass too** — r/selfhosted, r/devops and r/docker sentiment is
unassessed, which bites harder here than in the competitive research. No Google Trends series was
retrieved either (all results were content farms).

### Maintenance: alive, but second-class and under new ownership

Swarm mode is **not deprecated** and is genuinely maintained. SwarmKit's latest commit is 2026-08-28;
tags v2.0.0 (2025-06-16) through v2.1.2 (2026-04-21), roughly quarterly then a six-month gap. Engine
29.8.0 (2026-09-03) shipped Swarm DNS, overlay and Raft fixes. (Note: Classic Swarm ≠ Swarm mode.
Only Classic was removed, in v23.0.)

Four caveats that matter more than the commit activity:

- **Mirantis was acquired by IREN**, an AI-datacenter company — announced 2026-05-05, closed
  2026-08-04, $625M. Mirantis' "supported through at least 2030" pledge dates from 2025-07-01 and
  **predates the acquisition; it has not been reaffirmed since.**
- **MKE 4 is k0s-based and contains no Swarm at all.** Swarm survives only in MKE 3, whose furthest
  documented EOL is 3.9 on 2028-03-24.
- One upstream feature has already skipped Swarm: Engine 29's nftables backend cannot be enabled in
  Swarm mode.
- Engine v29 caused real regressions (moby #51491, DNS broken after `swarm init`, filed 2025-11-12).

### Size and direction: shrinking, and largely unmeasured

- **Swarm is not a line item in the Stack Overflow 2025 survey** (Docker 71.1%, Kubernetes 28.5%) and
  is **not mentioned at all in the CNCF 2025 survey** (K8s production use 82%, up from 66% in 2023).
  Falling off the instruments is itself the finding.
- **ITJobsWatch UK, six months to 2026-09-09: 12 permanent vacancies cite Docker Swarm** (rank 786,
  0.011%), down from 19 in 2024 — against 2,214 for Kubernetes, a ratio of roughly 185:1. UK permanent
  postings only; at n=12 the year-on-year move is within noise. Read direction, not magnitude.
- **Hacker News 2024→2026: the highest-scoring Swarm story in three years scored 27 points**
  (2026-02-16), and its commenters recommended k3s / ArgoCD / ECS instead. Coolify posts in the same
  period scored 382, 306 and 221.
- Weak contrary signal: the Zend/Perforce PHP Landscape Report shows "Docker Compose/Swarm" rising
  17.5%→24.2% (2024→2025) — but it is a *combined* option and the split is not reported, so the rise
  cannot be attributed to Swarm.

### The incumbent is telling its users to leave

Portainer — 38.5k stars, self-reported "over 30,000 Swarm users across 8 years" — published a
**Technical Advisory on Swarm (2026-03-10)** plus a migration whitepaper. Its CEO wrote: "Swarm didn't
die, but it stopped growing", and "the risk of not crossing it is now larger than the risk of crossing
it" (2026-03-12). Swarmpit entered maintenance mode (issue #719, 2026-01-25).

### Who still uses it

Four segments, descending headcount and ascending willingness to pay:

1. **Homelabbers** — largest, pays nothing.
2. **Solo devs and agencies** — "Never found a reason to migrate away… the investment was so low and
   benefits so big" (HN, 2026-05-05).
3. **Small teams in real production** — "6 very beefy machines… so stable, no restarts, crashes, or
   weird behaviors" (HN, 2025-10-07). Enlyft's median profile (methodology opaque, undated — see §Sizing): 50–200 employees, $1–10M
   revenue, 38% US.
4. **Enterprise legacy** — Mirantis names MetLife, RBC, S&P Global (April 2022 figures).

Top frustrations, i.e. the opportunity surface: the tooling vacuum ("I found myself writing messy bash
scripts for secret rotation, image tagging, multi-environment deployments", HN 2025-12-09); v29
breakage; overlay networking and MTU; no autoscaling; abandonment anxiety and hiring ("doesn't have the
mindshare for effective hiring").

### The counter-trend is real but flows past Swarm

Kubernetes fatigue is rhetorically alive but empirically cooling — CNCF 2025 ranks complexity as a
concern at 34%, *below* prior years, while adoption climbs. The simplicity-seekers went to Coolify
(61.6k stars, **not** Swarm-based), Dokploy (37.2k, **Swarm-based**), k3s (33.9k), Kamal (14.6k) and
Nomad (16.9k, BUSL and IBM-owned since 2025-02-27).

Only **one** Kubernetes→Swarm migration was found in this research: Magic Pages, 1,200+ Ghost sites,
completed 2026-03-01, citing storage issues and constant firefighting. One case is an anecdote, not a
trend.

### Sizing: no reliable number exists

No defensible count. Weak proxies disagree by 3.4×: Enlyft ~11,700 companies / 3.48% (opaque
methodology, no "as of" date, and the figure shifted between two fetches); 6sense 3,505 companies /
0.54%; Mirantis 100+ enterprise customers, ~1,000 clusters, 10,000 nodes — **but those figures date
from April 2022** and are recycled as current; Portainer's 30,000 is cumulative over eight years.

Best available estimate, from proxies that disagree by 3.4×: low tens of thousands of organisations
worldwide, plus an unmeasured homelab tail, trending down. Treat as an order of magnitude, not a count. The widely quoted "2.5% market share" appears only in AI-generated SEO listicles and
traces to no primary source — do not use it.

### The load-bearing insight

**Dokploy (37.2k stars, created 2024-04-19) is built on Docker Swarm** — `docker swarm init` is in its
installer, as it is in CapRover's. Meanwhile the obvious "Swarm devops tool" niche, GitOps, is occupied
by SwarmCD at **190 stars**.

People who want simple orchestration buy a PaaS; they do not shop for Swarm tools. So a Swarm-*only*
tool sells to the segment that self-identifies as "Swarm users" — tiny, unpaid, and shrinking — whereas
a large and *growing* population runs Swarm underneath something else without ever naming it.

_Decision (2026-09-09): the brief rules that population out — no Swarm vocabulary, no recognition of
the problem. This finding is retained as the standing counter-argument, and as the case to re-open if
the beachhead stalls._

### Unverified

Reddit entirely (network-blocked). No Google Trends series. No star-growth time series. The Zend PHP
Compose/Swarm split is second-hand. An HN claim (2026-05-05) that Mirantis "intends to kill it off this
year or next" is rumour and is contradicted by the 2030 pledge.

## Open questions carried forward to architecture

Raised during discovery, deliberately not resolved in the brief. Each is a binding input to the
architecture work rather than a product decision.

### 1. Who may open the map, and can the socket be mediated?

To read the cluster, Portolan needs the Docker socket on a **manager** node — which is effectively
root over the entire swarm. It then renders the complete topology of that swarm in a browser.

Two consequences the architecture must answer, neither of which is a product feature:

- **Authentication and exposure.** Who can open the map, and is it reachable from outside the
  cluster? A read-only tool that exposes every IP, network and volume in an infrastructure is a
  reconnaissance gift if left open.
- **Privilege minimisation.** Read-only at the product level is a promise, not a mechanism. Whether
  the socket can be mediated (a proxy restricted to read verbs rather than the raw socket) determines
  whether that promise is enforced or merely intended.

Noted here because a tool built to help people check their infrastructure for anything odd must not
itself be the odd thing.

### 2. Are images really graph nodes?

An image is not placed the way a container is: thirty containers may share three images. Rendering
images as first-class graph nodes creates heavy convergent fan-in — precisely the fuel for the
hairball failure mode named under Scope. The alternative is to treat an image as an *attribute*
surfaced in the detail panel, with an optional "group by image" view when explicitly requested.

"All object types from the start" was decided; "all object types are nodes" was not. This needs an
explicit rendering decision.

### 3. Default legibility on a large cluster

Weave Scope — the closest prior art — carried an open issue (#1636, "make topology view edges more
useful"): the only complete relational graph that ever shipped had a live edge-legibility
problem.

Restated from the brief because it is the principal engineering risk: filters mitigate the hairball,
but the state *before any filter is applied* must already be readable. This wants a real test cluster,
not a three-container lab.
