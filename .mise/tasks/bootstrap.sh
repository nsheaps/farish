#!/usr/bin/env bash
#MISE description = "Install workspace dependencies (bun install)."
# bootstrap.sh — install all workspace dependencies.
#
# Invoked by `mise run bootstrap`. Kept as a script (not a one-line mise task)
# because it is expected to grow (e.g. git-hook install, env validation).
#
# Docs: docs/monorepo/mise.md
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

echo "==> Installing workspace dependencies with bun"
# In CI (CI=true is set by GitHub Actions and most CI providers) use
# --frozen-lockfile so bun errors rather than silently modifying bun.lock.
if [ "${CI:-}" = "true" ]; then
  bun install --frozen-lockfile
else
  bun install
fi

echo "==> Bootstrap complete"
