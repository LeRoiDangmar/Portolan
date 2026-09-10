---
title: "Product Brief: Portolan"
status: complete
created: 2026-09-09
updated: 2026-09-10
---

# Product Brief: Portolan

## Executive Summary

A Docker Swarm cluster is a graph, but every tool that manages one shows you lists. Portainer will
tell you your services, your networks and your volumes, each in its own well-built list — and never
which container is attached to which network, which volume it mounts, or what else shares them. Users
have asked Portainer for that view since 2017; it has never been built. The only tool that ever
rendered a real relational graph at production quality, Weave Scope, has been dead since 2023.

**Portolan is that missing view.** It runs as a container inside the swarm it maps, reads the live
cluster, and renders the whole thing as one legible 2D graph — nodes, networks, volumes, stacks,
services, containers, images — where the *edges* are the actual product. Colour carries network
membership, filters decide what is shown, and clicking anything opens its text: IPs, image tags,
mounts, placement. Read-only, live, one `docker stack deploy`. It does not replace Portainer; it sits
beside it.

The timing looks like the worst thing about this project. It is the best. Swarm is shrinking as a
named technology, and in March 2026 Portainer itself began advising users to migrate off it. That
decline is the opening, not the threat: **you cannot migrate a cluster you cannot map.** Portainer has
walked away from a need it left open for nine years, exactly as that need turns urgent. And Swarm is
the beachhead, not the boundary — the durable asset is the topology graph, not the collector behind it.

## The Problem

Answering the most basic question about a Docker cluster — *which container sits on which network and
uses which volume* — is not possible from any tool people actually run. You open six tabs and hold the
graph in your head.

Survivable on a cluster you built last month. Not on one you inherited.

Portolan's founding scenario: a company cluster with **no documentation at all**, to be cleaned up and
checked for security problems, with Portainer as the only instrument. Reconstructing the picture by
hand took **hours, in places days** — producing a drawing obsolete at the next `stack deploy`, that
nobody would ever redraw.

The need is documented, not hypothetical: Portainer issues #506 (2017, closed unimplemented in 2021),
#1658 (2018) and discussion #9921 (2023, still open) all ask for exactly this. See Addendum.

## The Solution

- **A topology tool, not another dashboard.** The product *is* the relationships between Docker
  objects. The market already has good inventories.
- **A 2D graph**, colour-coded by network — the relationship hardest to hold in your head.
  _(3D was considered and retired 2026-09-09; evidence in Addendum.)_
- **Legible over impressive.** A whole-cluster overview that stays readable, zooms, and opens detail
  on demand: a picture you can walk into to get the text. The bar is that a non-specialist could
  follow it — the picture legible to an outsider is the same one that gives an expert the cluster at
  a glance.
- **Filters are structural, not cosmetic.** Zoom moves you closer; only filtering takes things away.
  Filters are how one map answers "show me everything" and "show me only what touches `backend`" —
  and how the graph survives a cluster large enough to matter.
- **Always current.** It reads the live cluster, so the map never goes stale.
- **Runs inside the swarm it maps**, one `docker stack deploy`.

**Explicitly not:** no audit engine, no rules, no alerts _(decided 2026-09-09)_. Portolan does not
tell you something is wrong; it shows your infrastructure clearly enough that you see it yourself. In
the founding scenario the missing thing was never a verdict — it was a picture.

## What Makes This Different

There is no technical moat. The graph is a solved rendering problem. What Portolan has is a vacancy,
and a reason it will persist.

- **Nobody serves this on Swarm at any scale.** Portainer, Arcane and Swarmpit have no relational
  graph at all; the one project that tries has 24 stars and omits volumes, stacks and containers.
  Netdata answers "what talks to what" (network flows); nobody answers "what is attached to what".
- **The incumbent will not build this.** Portainer closed the request unimplemented in 2021, and now
  points Swarm users off Swarm entirely.
- **Focus.** Portainer is a management platform that must also serve Kubernetes. Portolan does one
  thing.

The moat is execution and being first to take the niche seriously. The idea is copyable — and has
been for nine years.

## Who This Serves

**The inheritor.** Handed a Swarm cluster nobody documented, needing to understand it before cleaning
it up, securing it, handing it over or migrating off. The founding scenario; skews to organisations
with budget; grows with the migration wave.

**The Swarm operator.** Self-identified Swarm users — homelabbers, solo devs, agencies, small teams.
Shrinking and largely unwilling to pay, but they are the tribe: they adopt fast, they share, and they
are why the project gets found.

**Not an audience:** the growing population running Swarm under a PaaS like Dokploy without knowing
it. No Swarm vocabulary, no recognition of the problem. _(Decided 2026-09-09.)_

## Success Criteria

**First bar — it works for its author.** A tool that does not survive daily use by its maker survives
nobody's. Concretely: a truthful picture of an unfamiliar cluster in **minutes** against today's hours
or days; "which container, which network, which volume" answered **without opening a second tool**;
reached for by preference, not loyalty.

**Second bar — at least one signal the author does not control.** The project is publicly ambitious,
and private satisfaction cannot measure that. Strongest first:

- A stranger posts a screenshot of **their own** cluster in Portolan.
- Someone reports using it to **prepare a migration off Swarm** — the timing thesis, confirmed.
- It stays readable on a cluster substantially larger than any the author owns — the direct test of
  the legibility risk under Scope.
- An unprompted issue or PR from an operator rather than a passer-by.

Excluded deliberately: star counts. Stars measure reach, not use.

## Scope

**In, v1:** all object types (nodes, networks, volumes, stacks, services, containers, images) and the
edges between them — whether every type is a graph *node* rather than a detail-panel attribute is an
open rendering decision; strictly read-only; auto-refresh every 5–10s, configurable; colour by
network; filtering and display control (what is shown, colours, text size); click-through detail; one
swarm; deployed as an image inside the cluster it maps.

**Out, v1:** SVG/PNG export — wanted later, screenshot accepted for now; any audit, rules or alerting;
any write or management operation; multi-cluster; anything that is not Docker Swarm.

**The principal risk this scope carries:** every object type at once, on a real cluster, against the
brief's own bar of *legible over impressive*. Graphs of this kind are known to degenerate into
hairballs at scale. Filters are the mitigation — but **default legibility before any filter is applied
is the product's main open engineering question**, not a detail of polish. A second constraint the
architecture inherits: reading the cluster requires manager-node socket access, so exposure and
privilege minimisation are settled at design time, not claimed at the product level.

## Licence and Distribution

**AGPLv3** _(decided 2026-09-09)_. The specific risk guarded against is someone turning Portolan into
a hosted service without contributing back. AGPL closes exactly that while remaining OSI-approved,
with precedent nearby: Grafana moved to AGPLv3 in 2021, and Netdata runs the adjacent GPLv3+.

Permissive licensing was rejected as insufficient protection; source-available (BSL) outright — for a
project whose earliest adopters are homelabbers, a non-OSI licence costs more trust than it protects
revenue. See Addendum.

## Vision

In two to three years, Portolan is what you install on a cluster you do not understand, the way you
reach for a map in an unfamiliar city. Not a platform, not a control plane: one thing, done properly.
Success is that "what does my cluster actually look like" stops being an unanswered question.

**Breadth is deliberately left open — the architecture is not.** The durable asset is not
Swarm-specific: it is a legible topology graph of container infrastructure. Whether Portolan later maps
standalone Docker, Compose or Kubernetes is a decision for a future version, taken on evidence rather
than on today's ambition.

What *is* decided _(2026-09-09)_ is the constraint that keeps that option alive at no present cost:
**the graph model and the renderer stay independent of the Swarm-specific collector.** Three seams —
collector, model, renderer — so a second source of truth is later a new collector, not a rewrite. This
is a binding input to the architecture work.
