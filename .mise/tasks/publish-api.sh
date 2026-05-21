#!/usr/bin/env bash
# publish-api.sh — build and publish the @farish/api container image to ghcr.io.
#
# This is the `release` run-script for services/api. Publishing always targets
# the GitHub Container Registry, ghcr.io (initial prompt step 26).
#
# STUB STATUS: this script intentionally does NOT push by default. The push is
# gated behind PUBLISH=true so it cannot fire accidentally — wiring it into a
# release workflow with registry credentials is a later prompt step. Run
# without PUBLISH to validate the image builds; run with PUBLISH=true (after
# `docker login ghcr.io`) to actually publish.
#
# Usage:
#   .mise/tasks/publish-api.sh                 # build only (validation)
#   PUBLISH=true .mise/tasks/publish-api.sh    # build + push to ghcr.io
#
# Docs: infra/ghcr.md
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# ghcr.io image coordinates. OWNER defaults to the farish GitHub org/user.
OWNER="${GHCR_OWNER:-nsheaps}"
IMAGE="ghcr.io/${OWNER}/farish-api"
TAG="${IMAGE_TAG:-dev}"

echo "==> Building ${IMAGE}:${TAG}"
if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed — cannot build the image." >&2
  echo "       Install Docker, or run this from a CI runner that has it." >&2
  exit 1
fi

docker build -f services/api/Dockerfile -t "${IMAGE}:${TAG}" .

if [ "${PUBLISH:-}" = "true" ]; then
  echo "==> Publishing ${IMAGE}:${TAG} to ghcr.io"
  echo "    (requires a prior: docker login ghcr.io)"
  docker push "${IMAGE}:${TAG}"
  echo "==> Published ${IMAGE}:${TAG}"
else
  echo "==> Build complete. Set PUBLISH=true to push to ghcr.io."
fi
