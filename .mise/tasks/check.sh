#!/usr/bin/env bash
#MISE description = "Full validation: lint + test + build (the CI gate)."
# check.sh — the full local validation gate (lint + test + build).
#
# Invoked by `mise run check`. This is the SAME sequence CI runs, so a green
# `mise run check` locally predicts a green CI run (initial prompt step 24).
#
# Kept as a script (not a one-line mise task) because it chains three nx
# invocations and prints section headers.
#
# Docs: docs/monorepo/mise.md
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

echo "==> [1/3] lint"
nx run-many --target=lint --all

echo "==> [2/3] test"
nx run-many --target=test --all

echo "==> [3/3] build"
nx run-many --target=build --all

echo "==> check passed"
