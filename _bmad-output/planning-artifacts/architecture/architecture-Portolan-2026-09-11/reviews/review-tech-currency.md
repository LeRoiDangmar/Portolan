# Review — Technology currency and reality-check

**Target:** `_bmad-output/planning-artifacts/architecture/architecture-Portolan-2026-09-11/ARCHITECTURE-SPINE.md`
**Lens:** Was every committed decision web-researched or reality-checked, rather than asserted from training data?
**Reviewed:** 2026-09-14
**Method:** Live web verification of every named version, label, image, runner and platform claim, plus adversarial pressure-testing of the one load-bearing technical assertion (V8 floating-point determinism).

---

## Verdict

**The spine is genuinely researched, not asserted — and that is unusual enough to say first.** The `.memlog.md` carries dated `(version)` entries for 2026-09-11 and 2026-09-14 recording real web verification of Node.js release dates, dockerode, React, GitHub arm64 runners, `node:test` and floating-point determinism. I re-ran all of it. Almost every factual claim in the Stack table checks out against the live web today.

The failures are therefore not "the author made it up." They are three narrower and more interesting things:

1. **Research that was correct but has a short shelf life, with the expiry not recorded** — Node 24.
2. **Research that reached a conclusion stronger than its evidence supports** — the V8 floating-point claim, which is load-bearing for AD-8 and AD-32.
3. **Decisions committed with no research at all, in the two places the project is most exposed** — how dockerode actually talks to the Docker daemon, and whether Docker Swarm is a sound thing to bet an entire product on.

Two findings are HIGH. Neither is a reason to stop; both are a reason to add an invariant before the first line of collector or layout code.

---

## Findings

### F1 — HIGH — The Docker API version decision is one-sided and guards the wrong direction

**Where:** Stack table (`Docker Engine API | minimum version declared and checked at runtime (FR-64)`), AD-15, AD-27.

The spine's entire engine-compatibility strategy is *declare a minimum version and check it at runtime*. That guards against an engine that is **too old**. The live reality of 2026 is that the sharp edge points the other way, and there are two of them.

**Edge one — the daemon now has a floor.** Docker Engine v29 (shipped 2025-11-06) raised the *minimum client API version* to 1.44. A client that declares anything below 1.44 is refused outright with `client version X is too old`. This is not theoretical: it broke Portainer, CapRover, Traefik, Watchtower, Dockge and CasaOS in the field. If Portolan declares a permissive low minimum in order to be friendly to old engines — the obvious reading of FR-64 — it fails on every current engine. The spine has no invariant naming the floor.

**Edge two, and this is the worse one — dockerode does not negotiate, and does not pin.** dockerode (via docker-modem) issues **unversioned** request paths by default. An unversioned path is served at *the daemon's current schema*, whatever that happens to be. The current series is **v1.56**. So the shape of the JSON the collector parses is not pinned to anything: it is whatever version of the API the operator's engine happens to ship, and it changes silently under the product at every engine upgrade. This is exactly how Docker 29 broke TrafegoDNS — `event.status` was removed from the payload and events were dropped with no log line.

Portolan is a pure read adapter over Swarm `Service`, `Task`, `Node`, `Network` and `Volume` payloads. Unpinned response schemas are the single largest correctness risk in the product, and:

- **AD-15 does not cover it.** Refusing non-`GET` methods says nothing about which API version the `GET` is served at.
- **AD-27 actively hides it.** Recorded fixtures are captured from *one* real cluster at *one* engine version. They will pass forever while the field breaks, because the recording pins the schema the code no longer receives.
- **FR-64's runtime check does not cover it.** Reporting "your engine is too old" on a screen is not the same as pinning the version of the requests you send.

**What this needs:** a new AD, roughly — *the collector declares an explicit Docker API version on every request; that version is a single constant; the floor is ≥ 1.44; the recorded fixtures in AD-27 are captured at that declared version and the version is recorded alongside them.* Then FR-64's runtime check becomes a comparison against a real number rather than a gesture. This is a one-line change in the adapter and an invariant that will not be added later, because the failure it prevents is silent.

**Sources:** [Docker Engine v29 blog](https://www.docker.com/blog/docker-engine-version-29/) · [Engine API version history](https://docs.docker.com/reference/api/engine/version-history/) · [Docker v29 and the fall-out — Portainer](https://www.portainer.io/blog/docker-v29-and-the-fall-out) · [Docker Engine v29 raised its API floor to 1.44](https://bex.co/blog/2026/07/30/docker-engine-v29-api-floor-broke-self-hosted-tools) · [dockerode never negotiates — TrafegoDNS #3](https://github.com/avargaskun/TrafegoDNS/issues/3)

---

### F2 — HIGH — The V8 floating-point claim is overstated, its evidence is expiring, and it is load-bearing for AD-8 and AD-32

**Where:** `.memlog.md` line 54 — *"V8 embarque sa propre fdlibm statiquement liée, identique sur tout OS, et la sémantique JS exige un arrondi indépendant par opération... Le bit-à-bit cross-arch est donc quasi gratuit en JS — ce qui n'aurait été vrai ni en Go ni en Rust."* This conclusion is what licenses AD-8 to promise a deterministic layout and AD-32 to believe a cross-architecture determinism test is a cheap and meaningful gate.

I pressure-tested this specifically, as asked. The claim is **half true, and the half that is false is the half that matters.**

**What is genuinely true and genuinely free.** IEEE-754 basic arithmetic — `+`, `-`, `*`, `/`, `Math.sqrt` — is required to be correctly rounded. ECMAScript does mandate per-operation rounding, so a conforming engine may not contract a multiply-add into a fused FMA. For code built only from these operations, bit-identical results across amd64 and arm64 **and** across V8, SpiderMonkey and JavaScriptCore really are free. The memlog's instinct is sound to this point.

**What is not true.** The transcendentals are a different category. ECMAScript classifies `sin`, `cos`, `tan`, `atan2`, `exp`, `log`, `pow`, `cbrt`, `hypot` and the rest as **implementation-approximated** — explicitly *not precisely specified*, with the spec's stated general intent being that *"an implementer should be able to use the same mathematical library for ECMAScript on a given hardware platform that is available to C programmers on that platform."* That intent is the **opposite** of the memlog's claim. The specification actively invites the platform libm.

V8's bundled fdlibm port in `ieee754.cc` is therefore not a guarantee — it is an implementation accident that happened to hold. And it is an accident V8 has started to reverse: commit `c1486295ae5` replaced the bundled fdlibm `tanh` with `std::tanh`, which reads the host libm. It shipped in V8 14.8.57 / Chrome 148. Apple's libm and glibc disagree on roughly a quarter of `tanh` inputs by 1 ULP. Any other function can follow the same path in any release.

**Two further gaps the claim papers over, both structural to this spine:**

- **"Identique sur tout OS" is not "identique sur toute architecture."** The fdlibm argument is about avoiding *libm* divergence between operating systems. It is a different argument from CPU instruction selection, and it does not by itself establish arch-independence. The conclusion drawn — *bit-à-bit cross-arch* — does not follow from the premise given.
- **AD-32 tests an engine the product does not run layout on.** AD-1 puts layout in the **browser tab**. The Consistency Conventions row commits to *recent Chromium, Firefox and Safari*. AD-32's cross-arch determinism test runs under `node:test` on `ubuntu-24.04` and `ubuntu-24.04-arm` — V8 on both. It proves something about Node/V8 and nothing about SpiderMonkey or JavaScriptCore, which have their own Math implementations. The gate is real but its scope is narrower than the promise it is read as backing.

**What this needs, and it is cheap:** extend AD-8's ban list. AD-8 already bans `Math.random`, clock reads, unstable sorts and frame-timing dependence inside the layout stage. Add the transcendentals to the same list — *layout arithmetic is restricted to IEEE-754 exactly-rounded operations (`+ - * / sqrt`); `Math.sin`, `Math.cos`, `Math.pow`, `Math.exp`, `Math.log`, `Math.atan2`, `Math.hypot` and `Math.cbrt` are banned inside `layout`.* That converts the determinism promise from *an implementation detail of today's V8* into *a property of the code*, which is the same move AD-15 makes for read-only and AD-8 already makes for randomness. It is the spine's own idiom; it just was not applied here because the research said it did not need to be.

Note the tension this creates with polar hull geometry and seeded angular placement (FR-13's deformed hulls, FR-70's stretch), which naturally reach for `sin`/`cos`. That is precisely why the constraint must be recorded now, while the layout is unwritten, rather than discovered after.

**Sources:** [ECMAScript — implementation-approximated Math functions](https://tc39.es/ecma262/multipage/numbers-and-dates.html) · [Your Browser Does Math Differently on Every OS — scrapfly](https://scrapfly.dev/posts/browser-math-os-fingerprint/) · [V8 fork of fdlibm](https://doc.qt.io/qt-6/qtwebengine-3rdparty-v8-fork-of-fdlibm.html) · [Mozilla intent-to-implement fdlibm for sin/cos/tan](https://groups.google.com/a/mozilla.org/g/dev-platform/c/0dxAO-JsoXI/m/eEhjM9VsAgAJ)

---

### F3 — MEDIUM — Node 24 leaves Active LTS in five weeks; the Stack table will be wrong before the first sprint ends

**Where:** Stack table — `Node.js | 24 LTS (Active LTS; maintenance from 2026-10-20, EOL 2028-04-30)`.

Every date is **correct**. Node 24 entered Active LTS 2025-10-28, enters maintenance **2026-10-20**, EOL 2028-04-30. The research was done properly.

But the conclusion was not updated to today's date. The spine is dated 2026-09-14. Node 24 stops being Active LTS in **36 days**, and Node 26 becomes Active LTS on 2026-10-28. A greenfield project starting now, whose first release will almost certainly ship after 20 October, is pinning a runtime that will be in maintenance on the day it ships. The parenthetical *"(Active LTS; ...)"* is a claim with a five-week expiry stated in its own text.

This is defensible — Node 24 is supported to 2028-04-30, `node:24-alpine` is published, and maintenance LTS is a perfectly reasonable base for a disposable single-container product. It is not a wrong decision. It is an **unrecorded** one. The spine should say *we pin 24 knowingly, and 26 is the target from its Active LTS date* rather than presenting 24 as current.

There is a second fact the research did not surface that a project starting now should record: **Node's release model changes from October 2026.** One major release per April, LTS promotion each October, all releases LTS, odd/even distinction removed — starting with Node 27. Node 26 is the last release under the old model. That changes what "pin the LTS" will mean for this project's whole life.

**Sources:** [Node.js releases](https://nodejs.org/en/about/previous-releases) · [Evolving the Node.js release schedule](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule) · [Node.js moves to one major release per year — InfoQ](https://www.infoq.com/news/2026/06/nodejs-release-changes/)

---

### F4 — MEDIUM — Docker Swarm's own status is the one platform bet with no research behind it

**Where:** the entire product. Deployment section, AD-16, AD-17, AD-5, AD-33, the scope line.

The spine bets Portolan's whole reason to exist on Docker Swarm and never once records what Swarm's status actually is. Of everything in this document this is the largest single commitment, and it is the only one with no `(version)` entry in the memlog.

Checked, the bet **holds** — but with a shape worth naming:

- Swarm **mode** is not deprecated. It is built into the Docker Engine, maintained, and distinct from Classic Swarm, which is archived. Mirantis has committed to support through **2030**. For a v1 shipping in 2026–27, that is ample runway.
- But it is in **maintenance, not development**. What ships today is substantially the same product as 2022. New Docker Engine features arrive Swarm-last or not at all.
- The concrete 2026 evidence of that second-class status: Docker Engine 29's new **nftables firewall backend cannot be enabled on a node running in Swarm mode at all** — the overlay-network rules have not been migrated from iptables, and Swarm support is only *"planned for a future release."* Separately, Swarm environments were disproportionately affected by the Engine 29 breaking changes.

None of this is fatal — arguably the reverse. A platform in maintenance mode, still widely run by the homelab and small-fleet audience §1 targets, with no vendor investing in tooling for it, is a *good* reason for Portolan to exist. But that is an argument the spine should make deliberately rather than leave unexamined. Recommend a short paragraph recording Swarm's maintenance status, the 2030 horizon, and the revisit condition (Docker announcing deprecation, or Swarm falling behind on nftables/containerd migration to the point where operators leave).

**Sources:** [Docker with nftables — Swarm limitation](https://docs.docker.com/engine/network/firewall-nftables/) · [Docker Swarm still works, but does it have a future? — Portainer](https://www.portainer.io/blog/docker-swarm-still-works-but-does-it-still-have-a-future) · [Docker Swarm mode in 2026: honest status](https://blog.oxyconit.com/docker-swarm-mode-2026-practical-guide/) · [Support Swarm mode / clarify status — docker/roadmap #175](https://github.com/docker/roadmap/issues/175)

---

### F5 — LOW — `node:test`'s stability is overstated in the Stack table

**Where:** Stack table — `` `node:test` (stable since Node 20; assertions, mocks, coverage, watch built in) ``.

The runner and the `node:test` API are indeed stable since Node 20, and `mock.fn()` / `mock.method()` / `mock.timers` are stable. But in Node 24, **code coverage** (`--experimental-test-coverage`), **module mocking** (`mock.module()`) and **`--watch`** all remain behind experimental flags. The parenthetical reads as a list of stable capabilities; three of the five named items are not.

The practical risk is near zero: nothing the spine gates on needs any of the three. AD-8 determinism, AD-37 stability, AD-3's invocation counter, AD-26 scene assertions, AD-28 contrast gates and the AD-29/AD-30 ratchets are all plain assertions over pure functions, which is exactly the case `node:test` is strongest at, and the zero-dependency property is a real win under NFR-4 and AGPLv3. The finding is that a Stack-table claim is inaccurate as written and could lead a builder to design a coverage gate on an experimental flag. Trim the parenthetical to what is stable.

**Source:** [Test runner — Node.js v24 docs](https://nodejs.org/docs/latest-v24.x/api/test.html)

---

### F6 — LOW — The Deferred layout-library filter is AGPLv3-only; it should also filter on maintenance

**Where:** Deferred — *"Layout library ... AGPLv3 compatibility is a hard filter (NFR-17)."*

The memlog already caught this on 2026-09-11 — *"graphology 0.26.0 MIT mais dernière publication il y a ~2 ans — staleness à surveiller si retenue."* Still true today: graphology's latest release remains **0.26.0**, roughly two years old, with no npm release in the past twelve months; Snyk flags it as possibly discontinued or low-attention. Sigma.js — which is built on graphology — is alive at **3.0.3** (2026-04-30), MIT.

The observation was made in the log but never made it into the spine's Deferred entry, which filters on licence alone. For an air-gapped AGPLv3 product that vendors everything into its own image, an unmaintained dependency is a liability of the same order as an incompatible licence. Add maintenance to the filter.

**Sources:** [graphology — npm](https://www.npmjs.com/package/graphology) · [graphology — Snyk advisor](https://snyk.io/advisor/npm-package/graphology) · [sigma.js — LICENSE (MIT)](https://github.com/jacomyal/sigma.js/blob/main/LICENSE.txt)

---

## Verified correct — no action

Each of these was checked live today and the spine is right.

| Claim in the spine | Verified |
| --- | --- |
| **React 19.3** | Correct and current. Released **2026-09-09** — five days before this spine's `updated` date. No React 20. The version was chosen from live information, not memory. |
| **dockerode 5.0.1** | Correct. 5.0.1 is the latest published release, the package is alive (286M downloads, published within the last few months), and the repo at `apocas/dockerode` is active. *Caveat under F1 concerns its API-version behaviour, not its liveness.* |
| **Docker Engine API — a declared minimum** | The current series is **v1.56**, consistent with the spine's Engine-29 research. *The approach itself is challenged in F1.* |
| **`ubuntu-24.04` and `ubuntu-24.04-arm` (GA and free on public repositories)** | Correct, and precisely stated. arm64 hosted runners went GA for public repositories **2025-08-07**, free, 4 vCPU; private-repo availability followed 2026-01-29. Both labels are valid today. `ubuntu-22.04` is the image now deprecating (from 2026-09-17), not 24.04. `ubuntu-26.04` is now also available; since GitHub supports only the latest two OS images, pinning 24.04 is the conservative and correct call, good until 26.04's successor lands. |
| **`node:24-alpine`, multi-arch amd64 + arm64** | Correct. The official `node` image publishes amd64, arm64v8, arm32v6/v7, ppc64le and s390x. The multi-arch image AD-32 publishes is buildable as described. |
| **Playwright for narrow smoke scope** | Appropriate and current. Latest is **1.62.1** (2026-07-30), ~6-week cadence. Linux **arm64** now carries Chromium, Firefox and WebKit (Chrome for Testing builds), so AD-31's scope is executable on both runner architectures if wanted. AD-31's closed scope — boot, SSE, first draw, tab order, FR-57, FR-64 — is exactly the scope Playwright is cheap at, and AD-26's explicit refusal of visual-regression gates avoids Playwright's classic failure mode. *Minor:* the Stack table names no version; pin one. |
| **AGPLv3 compatibility across the named stack** | Clean. dockerode **Apache-2.0**, React **MIT**, TypeScript **Apache-2.0**, Playwright **Apache-2.0**, Sigma.js/graphology **MIT** — all one-way compatible into AGPLv3. The usual trap for an air-gapped product that bakes assets into its image is the **typeface**, and it is already handled upstream: `DESIGN.md` pins IBM Plex Mono / Sans under **SIL OFL 1.1** with an explicit *"AGPLv3-compatible · redistributable inside the image"* note. No named dependency is a problem. |

---

## Summary of recommended changes

| # | Severity | Change |
| --- | --- | --- |
| F1 | HIGH | New AD: the collector declares an explicit Docker API version (floor ≥ 1.44) on every request; AD-27 fixtures record the version they were captured at. |
| F2 | HIGH | Extend AD-8's ban list to the `Math` transcendentals; restrict layout arithmetic to IEEE-754 exactly-rounded operations. Narrow AD-32's stated claim to what a Node/V8 cross-arch test actually proves. |
| F3 | MEDIUM | Record that Node 24 enters maintenance 2026-10-20, that pinning it is a knowing choice, and that Node 26 is the target. Note the October 2026 release-model change. |
| F4 | MEDIUM | Record Docker Swarm's maintenance-mode status, the 2030 support horizon, the nftables/Swarm limitation, and a revisit condition. |
| F5 | LOW | Trim the `node:test` parenthetical to stable features only. |
| F6 | LOW | Add maintenance status to the Deferred layout-library filter, alongside AGPLv3. |

**On the lens's own question:** the spine's *"Verified current on 2026-09-11 and 2026-09-14"* attestation is honest and largely earned. The gaps are not sloppiness — they are the three predictable failure modes of doing the research well: not re-reading a correct answer against today's calendar (F3), letting a well-sourced finding harden into a stronger claim than it supports (F2), and never asking the question at all about the two things assumed to be background rather than decisions (F1, F4).
