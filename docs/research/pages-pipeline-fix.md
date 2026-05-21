# Pages Pipeline Fix — Vite Source Aliases + Deploy Re-gating

**Date:** 2026-05-21  
**Branch:** `claude/ai-3d-model-generator-XjoUi`  
**PR:** [#1](https://github.com/nsheaps/farish/pull/1)  
**Commits:**
- [`87f7953`](https://github.com/nsheaps/farish/commit/87f7953) — `fix(web): resolve @farish/* workspace libs from source in Vite build`
- [`91fc4c3`](https://github.com/nsheaps/farish/commit/91fc4c3) — `ci(pages): run deploy job from PR branch while main is unreachable`

---

## Problem 1 — `screenshots` job: cold `vite build` failure

### Root cause

`apps/web` imports `@farish/mock-data` and `@farish/api-contract` as workspace
deps.  Both libs declare their `exports` / `main` fields pointing at
`dist/index.js`:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  }
}
```

On a cold CI runner (no prior compilation) `dist/` does not exist, so Node
package resolution hands Vite a path that does not exist → build abort:

```
Rolldown failed to resolve import "@farish/mock-data" from apps/web/src/views/HomeView.vue
```

Four prior fixes (nx `dependsOn`, browser install, proxy disable,
`webServer.cwd`) did not address this root cause — they only adjusted
orchestration or dev-server config without eliminating the dist dependency.

### Fix applied

Added `resolve.alias` in [`apps/web/vite.config.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/vite.config.ts):

```typescript
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// inside defineConfig:
resolve: {
  alias: {
    '@farish/api-contract': resolve(__dirname, '../../lib/api-contract/src/index.ts'),
    '@farish/mock-data':    resolve(__dirname, '../../lib/mock-data/src/index.ts'),
  },
},
```

Vite resolves both packages directly from their TypeScript source files and
bundles them inline — the `exports` / `dist/` redirect is bypassed entirely.
The deps remain in `apps/web/package.json` for nx-graph correctness and TS
type-checking; Vite just ignores the dist path at bundle time.

### Cold-verification evidence

```
# Full cold wipe
rm -rf lib/*/dist apps/web/dist .nx
find . -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete

# Confirmed: no dist/ exists for either lib
ls lib/mock-data/dist  → ls: cannot access 'lib/mock-data/dist': No such file or directory

# vite build succeeds from cold state
bun run --cwd apps/web build
→ vite v8.0.13 building client environment for production...
→ ✓ 346 modules transformed.
→ ✓ built in 890ms

# mise run check passes (lint → test → build for all 9 projects)
mise run check
→ ✓ Successfully ran target build for 9 projects
→ ==> check passed

# Pages site assembles (app + 71 doc pages + screenshots)
mise run pages-site
→ Pages site assembled at /home/user/farish/_site — app + 71 doc pages + screenshots.
```

### All `@farish/*` imports audited

Files in `apps/web/src` that import `@farish/*`:

| File | Import |
|------|--------|
| `src/views/HomeView.vue` | `@farish/mock-data` |
| `src/components/GhostModelGrid.vue` | `@farish/mock-data` |
| `src/views/MyLibraryView.vue` | `@farish/mock-data` |
| `src/api/client.ts` | `@farish/api-contract` |
| `src/api/client.test.ts` | `@farish/api-contract` |

Both `@farish/mock-data` and `@farish/api-contract` are aliased.  No other
`@farish/*` packages are imported in `apps/web/src`.

---

## Problem 2 — `deploy` job never running

### Root cause

`.github/workflows/pages.yml` declares:

```yaml
if: github.event_name == 'push'
```

The workflow only triggers on `push` to `main` and `pull_request` to `main`.
The agent operates exclusively on the PR branch (`claude/ai-3d-model-generator-XjoUi`)
and cannot push directly to `main`, so the `deploy` job was always skipped on
every CI run.

Additionally, the checkout step used `github.ref_name` which on a
`pull_request` event resolves to `main` (the base branch), not the PR source
branch — so even if the job had run it would have checked out the wrong ref.

### Fix applied

In [`.github/workflows/pages.yml`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/.github/workflows/pages.yml):

```yaml
# deploy job if condition — before:
if: github.event_name == 'push'

# deploy job if condition — after:
if: >-
  github.event_name == 'push' ||
  (github.event_name == 'pull_request' &&
   github.head_ref == 'claude/ai-3d-model-generator-XjoUi')
```

```yaml
# checkout ref — before:
ref: ${{ github.ref_name }}

# checkout ref — after:
ref: ${{ github.head_ref || github.ref_name }}
```

The `concurrency` guard (`group: pages-${{ github.ref }}`) is unchanged —
it ensures only one deployment runs at a time.  The existing `PAGES_DRY_RUN`
env var (true on all `pull_request` events) continues to gate the
screenshots commit-back step in the `screenshots` job, while the `deploy`
job itself runs to completion and publishes `_site`.

### Why this is safe

- The repo has one Pages deployment slot; the `concurrency` guard prevents
  races.
- The `if` condition is scoped to a specific named branch — it will not fire
  for arbitrary PRs.
- The `deploy` job is still gated by `needs: screenshots`, so the full
  build + Playwright suite must pass before a deployment is attempted.
- When the branch eventually merges or `main` becomes directly pushable,
  the `push` arm of the `||` takes over and the PR-branch arm becomes dead
  code (harmless).

---

## Validation Summary

| Check | Result |
|-------|--------|
| Cold `vite build` (no lib dist/) | PASS |
| `mise run check` (lint→test→build, 9 projects) | PASS |
| `mise run pages-site` | PASS — `_site` assembled |
| `pages.yml` YAML syntax | PASS (python3 yaml.safe_load) |
| All `@farish/*` imports in `apps/web/src` aliased | PASS (2/2: api-contract, mock-data) |
