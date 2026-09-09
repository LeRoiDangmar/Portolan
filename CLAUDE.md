# Project Guidelines

<!--
  Starter file. The "Git workflow" section below is ready to use as-is.
  Replace every `TODO:` with what is true for this project, then delete this comment.
-->

## Project overview

TODO: one paragraph — what this project is, who uses it, the stack (language, framework, package manager).

## Commands

TODO: the handful of commands an agent actually needs. Keep it short and accurate.

| Task    | Command             |
| ------- | ------------------- |
| Install | `TODO`              |
| Dev     | `TODO`              |
| Build   | `TODO`              |
| Test    | `TODO`              |
| Lint    | `TODO`              |
| Format  | `TODO`              |

## Code style

- Formatting and indentation are set by `.editorconfig` (and the project formatter, if any) — never reformat files you did not otherwise touch.
- Match the surrounding code: naming, comment density, existing idioms and helpers.
- TODO: project-specific rules (import order, folder layout, naming, forbidden patterns).

## Git workflow

Follow these conventions for **every** change, without being reminded.

### Branching

- Create a **new branch for each relevant feature / unit of work** — never commit feature work directly to `main`.
- Name branches using a conventional prefix matching the commit type, followed by a short kebab-case description:
  - `feat/<description>` — a new feature
  - `fix/<description>` — a bug fix
  - `docs/<description>` — documentation only
  - `refactor/<description>` — code change that neither fixes a bug nor adds a feature
  - `chore/<description>` — tooling, config, deps, housekeeping
  - `test/<description>` — adding or fixing tests
- Examples: `feat/user-login`, `fix/dashboard-crash`, `docs/api-readme`
- Integration branch: `main` by default. TODO: if this project integrates on another branch (e.g. `staging`, with `main` reserved for production), say so here and target every MR/PR at it.

### Commits (Conventional Commits)

Format every commit message as:

```
<type>(<optional scope>): <short imperative description>

<optional body explaining what & why>

<optional footer — e.g. BREAKING CHANGE:, refs #123>
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Description: imperative mood, lowercase, no trailing period, ideally ≤ 72 chars.
- Use `!` after the type/scope (e.g. `feat!:`) or a `BREAKING CHANGE:` footer for breaking changes.
- Examples:
  - `feat(auth): add SSO login via Azure AD`
  - `fix(dashboard): prevent crash when widget list is empty`
  - `docs: add setup instructions to README`

### Process

- **Auto-commit:** after completing a unit of work, commit the changes automatically — without waiting to be asked — following the branching and Conventional Commit conventions above. Split unrelated changes into separate, logically-scoped commits.
- Branch before committing feature work when on `main` (or a branch whose name does not match the work), using the convention above.
- Push only when the user explicitly asks.

### Enforcement (git hooks)

These conventions are enforced by versioned git hooks in `.githooks/`:

- `commit-msg` — rejects commit messages that are not Conventional Commits.
- `pre-commit` — rejects commits on `main`/`master`, branch names that don't match `<type>/<kebab-description>`, staged secret files (`.env`, keys) and leftover conflict markers.
- `pre-push` — rejects pushes and force-pushes to protected branches, and `fixup!`/`squash!`/`WIP` commits; optionally runs a verification command first.

Activate them once per clone (they are not enabled automatically):

    git config core.hooksPath .githooks

Optional — reuse the commit message template:

    git config commit.template .gitmessage

Bypass in exceptional cases with `git commit --no-verify` / `git push --no-verify`.

Per-repo hook settings (all optional):

    git config hooks.protectedBranches "main master release"   # default: main master
    git config hooks.prePushVerify "npm test"                  # run before every push
    git config hooks.allowedBranchTypes "feat fix docs style refactor perf test build ci chore revert"
