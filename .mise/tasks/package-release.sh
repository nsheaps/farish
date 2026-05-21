#!/usr/bin/env bash
# package-release.sh — placeholder packaging/release step for publishable packages.
#
# Invoked by a package's `release` run-script (e.g. `@farish/sdk`). Real
# publishing wiring (npm / ghcr.io) lands with the CI work in steps 24/27 —
# for now this script proves the `release` target exists in the nx graph and
# documents the contract.
#
# Usage: package-release.sh <package-name>
# Docs: docs/monorepo/nx.md
set -euo pipefail

PACKAGE="${1:?usage: package-release.sh <package-name>}"

echo "==> release: ${PACKAGE}"
echo "    packaging + publish is a placeholder until CI is wired (prompt step 24/27)."
echo "==> release placeholder complete for ${PACKAGE}"
