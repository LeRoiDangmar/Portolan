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
