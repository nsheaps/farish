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

# mise — install pinned tool versions (bun, node, etc.) once configured.
if [ -f mise.toml ] || [ -f .mise.toml ] || [ -f .config/mise/config.toml ]; then
  if command -v mise >/dev/null 2>&1; then
    echo "[session-start] mise install"
    mise install
  else
    echo "[session-start] mise config present but mise not on PATH — skipping"
  fi
fi

# bun — install workspace dependencies once a manifest exists.
if [ -f package.json ]; then
  if command -v bun >/dev/null 2>&1; then
    echo "[session-start] bun install"
    bun install
  else
    echo "[session-start] package.json present but bun not on PATH — skipping"
  fi
fi

echo "[session-start] done"
exit 0
