#!/bin/sh
# Shared settings for the hooks in this directory — see CLAUDE.md (Git workflow).
# Everything here is overridable per clone with `git config`.

DEFAULT_TYPES="feat fix docs style refactor perf test build ci chore revert"
DEFAULT_PROTECTED="main master"

hook_types() {
  git config --get hooks.allowedBranchTypes || printf '%s' "$DEFAULT_TYPES"
}

# "feat fix docs" -> "feat|fix|docs" (for use inside a grep -E pattern)
hook_types_alt() {
  hook_types | tr -s ' \t\n' '\n' | sed '/^$/d' | paste -sd '|' -
}

hook_protected_branches() {
  git config --get hooks.protectedBranches || printf '%s' "$DEFAULT_PROTECTED"
}

hook_is_protected() {
  for _b in $(hook_protected_branches); do
    [ "$1" = "$_b" ] && return 0
  done
  return 1
}
