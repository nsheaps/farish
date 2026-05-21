#!/usr/bin/env bash
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
bun install

echo "==> Bootstrap complete"
