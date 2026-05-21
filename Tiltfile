# Tiltfile — local development orchestration for farish.
#
# Tilt (https://tilt.dev) brings the whole local stack up with one command:
#
#   tilt up
#
# farish is a browser-only app deployed to GitHub Pages, so local dev uses
# NATIVE PROCESSES ONLY — no containers, no Kubernetes. Every resource below is
# a `local_resource` running a plain process on the host (initial prompt
# step 26). Container images are built only for publishing (see infra/ghcr.md).
#
# Resources:
#   deps-build  — builds the workspace libraries the API + web app import.
#   api         — the @farish/api server (Bun), serving /health and /models.
#   web         — the @farish/web Vite dev server (Vue 3 + Vuetify), with HMR.
#
# Docs: docs/monorepo/tilt.md

# --- Ports --------------------------------------------------------------------
# Keep API_PORT in sync with apps/web/vite.config.ts (the dev proxy target).
API_PORT = '8787'
WEB_PORT = '5173'

# --- deps-build ---------------------------------------------------------------
# The API server and the web app import the @farish/api-contract and
# @farish/mock-data libraries, which resolve to their built dist/ output. Build
# them once up front; re-runs are cheap because nx caches unchanged tasks.
local_resource(
    'deps-build',
    cmd='nx run-many --target=build --projects=api-contract,mock-data',
    deps=['lib/api-contract/src', 'lib/mock-data/src'],
    labels=['build'],
)

# --- api ----------------------------------------------------------------------
# The development API server. `serve_cmd` keeps the process running; Tilt
# restarts it when a watched file under services/api/src changes. The readiness
# probe polls GET /health so dependent resources wait until the API is live.
local_resource(
    'api',
    serve_cmd='bun run --watch services/api/src/server.ts',
    serve_env={'PORT': API_PORT},
    deps=['services/api/src'],
    resource_deps=['deps-build'],
    readiness_probe=probe(
        period_secs=2,
        http_get=http_get_action(port=int(API_PORT), path='/health'),
    ),
    links=[link('http://localhost:%s/health' % API_PORT, 'API health')],
    labels=['backend'],
)

# --- web ----------------------------------------------------------------------
# The Vue dev server. Vite provides hot-module reload, so Tilt only needs to
# start it once — it does not watch files itself. It depends on `api` so the
# /api proxy target is up before the browser app loads.
local_resource(
    'web',
    serve_cmd='bun run --cwd apps/web dev -- --port %s' % WEB_PORT,
    serve_env={'API_PORT': API_PORT},
    resource_deps=['deps-build', 'api'],
    links=[link('http://localhost:%s' % WEB_PORT, 'farish web app')],
    labels=['frontend'],
)

print('farish dev stack — API on :%s, web on :%s' % (API_PORT, WEB_PORT))
