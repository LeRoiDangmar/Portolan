# Deferred work

Findings that are real but outside the story that surfaced them. Appended to, never edited.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: CI has no aggregate status check, so branch protection cannot express "CI passed".
  evidence: Seven job names today, two matrix-generated, and the set changes every time a pending gate becomes real — so the protected-branch rule must be hand-edited on each of those stories, and a silently renamed job stops blocking merges. Wants one `ci-ok` job with `needs:` over the real gates and `if: always()`, protected by name.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: Node 24 is pinned in three places and enforced in none.
  evidence: `engines.node: ">=24"` is advisory without `engine-strict=true`; `NODE_VERSION` in ci.yml and the README prose are separate copies; there is no `.nvmrc`. AD-43 makes the runtime a fixed part of the envelope, so it should be a gate like the others.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: GitHub Actions are referenced by mutable major tag rather than commit SHA, and the v7 majors are unverified.
  evidence: `actions/checkout@v7` and `actions/setup-node@v7` have never run — the first PR confirms whether the tags exist and whether `ubuntu-24.04-arm` is available on this repo. For a project that gates its licences in CI, SHA-pinned third-party actions are the matching standard.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: The licence gate reads `node_modules`, so its coverage depends on the machine it runs on.
  evidence: Optional and os/cpu-gated dependencies (esbuild and rollup platform binaries, which this tree has) are absent from an x64 runner's `node_modules` and are never checked, yet they ship in the image on other architectures. Walking `package-lock.json`'s `packages` map would make the result complete and reproducible.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: vite.config.ts builds its browser alias map from every workspace's `dir`, ignoring `imports` and `side`.
  evidence: `@portolan/server` and `@portolan/collector` get browser aliases, so the bundler resolves them from browser packages if lint is bypassed. dependency-graph.json's own note claims the alias map is built from the graph, which is true of the paths but not of the direction.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: `packages/chrome/tsconfig.json` sets `jsx: "react-jsx"` with no React toolchain installed.
  evidence: No react, react-dom, @types/react or @vitejs/plugin-react, and Vitest runs `environment: 'node'` with include covering only `*.test.ts`. The chassis story would have to change the build envelope, which is what AD-43 fixed the envelope to prevent. Either pull the toolchain in or drop the flag so the gap is visible.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: The manifest test pins dependency declaration order, which npm itself rewrites.
  evidence: `expect(declared).toEqual(spec.imports.map(...))` is ordered, and `harness/package.json` lists `@portolan/scene` before `@portolan/layout` in graph order. `npm pkg set` and `npm install -w` sort `dependencies`, so the next person to add one gets a red test unrelated to the dependency direction. Compare as sets; keep ordering assertions where order is load-bearing.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: `frame-ancestors` and `form-action` in the build-time CSP are inert when delivered via a meta tag.
  evidence: The CSP spec ignores `frame-ancestors`, `report-uri` and `sandbox` in `<meta http-equiv>`. The meta tag is a reasonable belt, but the clickjacking half has to be a real response header — an obligation on the server story rather than something to discover in a pen test.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: `rollupOptions: { external: [] }` is an inert default presented as a mechanism.
  evidence: Rollup's `external` already defaults to empty for an app build and Vite fails on unresolved bare imports regardless, so the line cannot fail. README and the Implementation Notes both describe it as the guard that keeps NFR-4 true. Either make it enforceable or stop describing it as a guard.

- source_spec: `../specs/spec-Portolan/stories/1-repo-skeleton-and-ci-gates.md`
  summary: CLAUDE.md still reads TODO for every command, and this story is where the answers arrived.
  evidence: The repo now has real install/dev/build/test/lint/format commands, a documented stack and a folder layout, all written into README.md and none into the agent instructions. The next agent opening this repo reads a table of TODOs. `bmad-project-context` is the skill for it.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: The zone isolines were not re-derived after the zone tints were replaced, and no CI gate watches them.
  evidence: Story 2 adopts `palette-cvd-analysis.md` §5's re-optimised tints, which that file explicitly says leaves `zone-isoline-1…6` and their `-light` twins un-re-derived. DESIGN.md measures the isoline over its own tint at 3.2–3.7 dark / 3.5–4.8 light against a 3:1 floor, but the isoline is not one of AD-28's five gated ratios, so the drift is invisible to CI. Owner: design, per palette-cvd-analysis.md §5.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: `zone blob` and `pastille-network` were not re-checked against their own floors after the tint change.
  evidence: Same root cause as the isolines. DESIGN.md floors the mode-B zone blob over its own tint at 4:1 (measured 4.0–4.7 / 4.5–5.9) — a hard boundary beating a soft one — and that ratio is not among AD-28's five either. `palette-cvd-analysis.md` §5 names both as outstanding and says it does not recompute them.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: Two dark network pastilles miss DESIGN.md's own 4.5:1 floor, and the AD-28 gate is red on them from its first run.
  evidence: `pastille-network-1` `#4A8296` measures **4.45:1** and `pastille-network-3` `#7A7695` **4.39:1** on `{colors.body-mid}` `#0B1116`, against the 4.5:1 floor DESIGN.md's own *Network pastille on body* row declares. That row prints its measured range as **4.4 – 5.2** and never reconciles the low end with the floor above it; `review-rubric.md` recomputed the table and confirmed "4.4…" as accurate without noticing it sits under the floor. It is not the NFR-13 defect and not a consequence of the zone-tint substitution — it predates both, and `palette-cvd-analysis.md` §4 did not sweep this family when it declared NFR-11's exemption set complete. AD-28 calls this red *the gate working*, but it blocks merge. Three possible rulings, all design's: move the two hexes, ratify an exemption with the floor that still applies, or correct the row's floor. The story's Boundaries forbid the implementation taking any of them. `test/contrast.test.ts` pins the exact shape of the red so a ruling turns it green loudly. Owner: design.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: The isoline and zone-blob drift against the adopted tints is now measured, and the blob has already crossed its floor.
  evidence: Measured with `scripts/colour.mjs` against `palette-cvd-analysis.md` §5's adopted tints, which the two entries above could only predict. Isolines over their own tint: **3.20–3.68 dark / 3.34–4.60 light** against a 3:1 floor — still clear, down from 3.22–3.67 / 3.51–4.76. Mode-B zone blob (`pastille-network-n` over `zone-tint-n`) against its 4:1 floor: **3.97 dark on zone 1**, i.e. now *below* it, where the superseded tints gave 4.00; the other eleven readings sit at 4.08–5.69. Neither ratio is among AD-28's five, so CI does not catch either. The blob figure is a real regression caused by this story's substitution, small and now on the record rather than unmeasured. Owner: design, per `palette-cvd-analysis.md` §5.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: The AD-28 gate measures marks against `body-mid` only, and the other gradient stops miss their floors.
  evidence: A mark sits on a three-stop vertical gradient, and the gate reads the middle stop because that is what DESIGN.md's own contrast rows are measured against (its printed "4.4 - 5.2" for the network family reproduces exactly on `body-mid`). Measured on the others, dark: on `body-top` the health mark reads 3.83:1 against its 4:1 floor and `pastille-network-1` 4.04:1 against 4.5:1; on `body-sel-top` — a selected body, never measured anywhere — `bubble-id` reads 6.64:1 against the 7:1 identifier floor and the network pastilles 3.54:1. Widening the gate past DESIGN.md's own reference is not this story's to do, and the question is which stop the floors are meant to bind. Owner: design.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: The AD-28 job is red from its first run, so a required check that can never go green carries no incremental signal.
  evidence: `npm run contrast` exits 1 on `pastille-network-1` (4.45:1) and `pastille-network-3` (4.39:1) against the 4.5:1 floor DESIGN.md declares beside a measured range it prints as "4.4 - 5.2". The values predate this story. While it stands red, a second contrast failure or a CSS drift failure cannot change the job's status, and a permanently-failing required check is the pressure that gets gates bypassed — the outcome AD-28 argues against. Needs design's ruling on the two hexes (move the values, ratify an exemption with the floor that still applies, or correct the row's floor), and a decision on how unrelated PRs merge until then.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: All three gate scripts detect "run as a script" without resolving symlinks, so a symlinked invocation would skip the gate and exit 0.
  evidence: `check-licences.mjs`, `check-contrast.mjs` and `generate-tokens-css.mjs` all compare `fileURLToPath(import.meta.url)` against `resolve(process.argv[1])`. Through a symlink the two differ, `runGate()` never runs, and the process exits 0 — a silently green gate. Unreachable today (nothing in the repo or CI invokes them through a symlink) and the pattern is story 1's convention, so the fix belongs to all three at once: compare against `realpathSync(process.argv[1])`.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: DISCHARGED — the isolines, the mode-B zone blob and the network pastilles were all re-derived by design, so the three deferrals above them are closed.
  evidence: `palette-cvd-analysis.md` §6 (merged to main as PR #9) applies the zone rotation across 36 tokens rather than the 12 the analysis proposed, because tint, isoline and pastille of one network must share a hue or FR-65's identity channel breaks between reading levels. Re-measured on the applied set after merging: isolines 3.20-3.68:1 over their own tint against 3:1, mode-B blob 4.65-4.88:1 against 4:1 (was 3.97), network pastilles 5.13-5.23:1 dark and 5.57-5.62:1 light against 4.5:1 (was 4.39). The AD-28 gate is green. The three entries this one discharges are the isoline re-derivation, the zone blob / pastille-network floors, and the permanently-red required check.

- source_spec: `../specs/spec-Portolan/stories/2-design-tokens-single-source-of-truth.md`
  summary: The register's lightness band for network pastilles excludes, by 0.25 L*, the values design shipped in the same commit.
  evidence: `palette-cvd-analysis.md` §6 and DESIGN.md's token-block comment both state the network pastille band as `L* 44-56`. Measured on the applied set, the light pastilles sit at L* 43.75-44.00 and the dark at 55.46-56.00 — so the band as literally written excludes its own light half. It reads as a derivation across both palettes rounded to integers. `packages/tokens/src/colour.test.ts` asserts the band with an explicit 0.25 rounding tolerance and the reason written above it; design should say whether the band is 43.75-56 or whether the light values move. Nothing is at risk either way: the neon re-derivation the band exists to catch measured C* 90+.
