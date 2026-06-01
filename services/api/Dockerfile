# Dockerfile — container image for the @farish/api service.
#
# This image is the artifact PUBLISHED to ghcr.io (initial prompt step 26).
# It is NOT used for local development: Tilt runs the API as a native process
# (see the repo Tiltfile and docs/monorepo/tilt.md). The image exists so the
# API server has a deployable form once a hosting target (e.g. Vercel per
# amendment A3, or any container host) is wired up in a later step.
#
# Build context is the repo root so the bun workspace + the libraries the API
# imports (@farish/api-contract, @farish/mock-data) are all available:
#
#   docker build -f services/api/Dockerfile -t farish-api .
#
# See infra/ghcr.md for the full publish flow.

# --- build stage --------------------------------------------------------------
FROM oven/bun:1.3.11 AS build
WORKDIR /repo

# Install workspace dependencies against the committed lockfile.
COPY package.json bun.lock ./
COPY lib/api-contract/package.json lib/api-contract/
COPY lib/mock-data/package.json lib/mock-data/
COPY services/api/package.json services/api/
RUN bun install --frozen-lockfile

# Copy the sources the API needs and compile them.
COPY tsconfig.base.json ./
COPY lib/api-contract lib/api-contract
COPY lib/mock-data lib/mock-data
COPY services/api services/api
RUN cd lib/api-contract && bun run build \
 && cd ../mock-data && bun run build \
 && cd ../../services/api && bun run build

# --- runtime stage ------------------------------------------------------------
FROM oven/bun:1.3.11-slim AS runtime
WORKDIR /app
ENV PORT=8787
COPY --from=build /repo /repo
WORKDIR /repo/services/api
EXPOSE 8787
CMD ["bun", "run", "start"]
