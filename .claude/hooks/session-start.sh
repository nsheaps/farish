#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# Onboards the `farish` repo: installs the pinned toolchain and workspace
# dependencies so linters, tests and builds work inside a web session.
#
# It is intentionally idempotent and forward-looking: the repo starts with no
# code, so each install step is guarded by the presence of its manifest. As the
# monorepo is scaffolded (mise.toml, package.json, ...) the matching steps begin
# to run automatically with no edit to this hook required.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

echo "[session-start] onboarding farish in ${PWD}"

# Toolchain install (mise) is handled by the mise plugin's own SessionStart
# hook — intentionally NOT duplicated here.

# bun — install workspace dependencies once a manifest exists. bun is provided
# by mise (pinned in mise.toml), so route through `mise exec` so bun resolves
# even before mise's shims reach PATH on a first run — rather than assuming bun
# is already on PATH. Project-specific; a future bun-utils plugin could own it.
if [ -f package.json ]; then
  if command -v mise >/dev/null 2>&1; then
    echo "[session-start] bun install (via mise exec)"
    mise exec -- bun install || echo "[session-start] bun install failed (continuing)"
  elif command -v bun >/dev/null 2>&1; then
    echo "[session-start] bun install"
    bun install || echo "[session-start] bun install failed (continuing)"
  else
    echo "[session-start] package.json present but neither mise nor bun on PATH — skipping"
  fi
fi

# Keep local-checkout plugin marketplaces fresh. farish's `agents-local` and
# `ai-mktpl-local` marketplaces are `directory` sources pointing at local git
# checkouts; a directory marketplace serves whatever is in the checkout's
# working tree, so each checkout must be pulled forward to stay current with
# its branch. Best-effort — failures never abort onboarding.
for repo in /home/user/agents /home/user/ai-mktpl; do
  if [ -d "$repo/.git" ]; then
    echo "[session-start] refreshing local marketplace checkout: $repo"
    git -C "$repo" fetch --quiet origin || echo "[session-start] fetch failed for $repo (continuing)"
    git -C "$repo" pull --ff-only --quiet || echo "[session-start] pull skipped/failed for $repo (continuing)"
  fi
done

echo "[session-start] done"
exit 0
