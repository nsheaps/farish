# Screenshots CI — Workspace Dependency Build Fix

**Branch:** `claude/ai-3d-model-generator-XjoUi`
**Workflow:** `.github/workflows/pages.yml` — `screenshots` job
**Issue:** `vite build` fails on cold CI with unresolved `@farish/api-contract`

---

## Root Cause

The `screenshots` job's "Build app + run screenshot suite" step previously ran:

```bash
bun run --cwd apps/web e2e
```

The `e2e` package script (in `apps/web/package.json`) is:

```bash
vite build && playwright test --config e2e/playwright.config.ts
```

This raw npm-script invocation **bypasses the nx task graph entirely**. When vite
builds `apps/web`, it must resolve the workspace import
`@farish/api-contract` from `apps/web/src/api/client.ts` and
`@farish/mock-data` from `apps/web/src/components/GhostModelGrid.vue`.

Both workspace libraries publish from `dist/` (their `package.json` `exports`
points to `./dist/index.js`). On a cold CI runner — where no prior `nx run` has
built those libraries — `lib/api-contract/dist/` and `lib/mock-data/dist/` do
not exist. Vite (Rolldown) cannot resolve the entry-point files and aborts:

```
Error: [vite]: Rolldown failed to resolve import "@farish/api-contract"
  from apps/web/src/api/client.ts
```

This failure is masked in local dev containers because earlier interactive `nx`
runs leave `dist/` behind from previous builds. The failure only surfaces on a
cold, ephemeral runner (GitHub Actions).

---

## Fix

### Option chosen: nx task graph — `dependsOn: ["^build"]` on the `e2e` target

**`apps/web/project.json`** — added `dependsOn` to the `e2e` target:

```json
"e2e": {
  "executor": "nx:run-script",
  "options": { "script": "e2e" },
  "dependsOn": ["^build"]
}
```

`^build` means: _run `build` on every nx project that `web` depends on first_.
nx infers those dependencies from the `workspace:*` entries in
`apps/web/package.json` (`@farish/api-contract`, `@farish/mock-data`).

**`.github/workflows/pages.yml`** — changed the "Build app + run screenshot
suite" step from the raw script call to the nx target:

```yaml
# Before
run: bun run --cwd apps/web e2e

# After
run: nx run web:e2e
```

`nx run web:e2e` runs the task through the nx task graph, respecting
`dependsOn: ["^build"]`. The underlying script (`vite build && playwright test`)
is unchanged — the package-level behaviour is identical, only the entry-point
that guarantees ordering has changed.

### Why not the other options

- **Option B (explicit build step in CI)**: Adding `mise run build` before the
  e2e step would work but duplicates build effort (web itself would be built
  twice — once by `mise run build`, once by the `vite build` inside `e2e`). It
  also doesn't capture the dependency relationship in the nx graph where it
  belongs.
- **Option C (Vite resolve alias to source)**: Pointing Vite at `.ts` source
  files rather than `dist/` would also work but changes how vite resolves
  the library (type-only imports and composite project boundaries would need
  re-testing) and is a larger surface-area change.

---

## Cold-State Reproduction

Exact reproduction of the CI failure and the fix verification:

```bash
# 1. Remove all build artefacts and nx cache (simulate cold runner)
rm -rf lib/api-contract/dist lib/mock-data/dist apps/web/dist .nx/cache
find . -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete

# Confirm cold state
ls lib/api-contract/dist 2>/dev/null || echo "confirmed: no dist"
# → confirmed: no dist

# 2. Run the FIXED command (nx run web:e2e from cold state)
nx run web:e2e --skip-nx-cache
```

Output (condensed):

```
 NX   Running target e2e for project web and 2 tasks it depends on:

> nx run api-contract:build
$ tsc -p tsconfig.json

> nx run mock-data:build
$ tsc -p tsconfig.json

> nx run web:e2e
$ vite build && playwright test --config e2e/playwright.config.ts

vite v8.0.13 building client environment for production...
✓ 324 modules transformed.
dist/index.html     0.41 kB │ gzip: 0.28 kB
dist/assets/…       (fonts, css, js)
✓ built in 805ms

Running 2 tests using 1 worker
  ✓  1 [chromium] › e2e/pages.spec.ts:35:3 › page: home — screenshot
  ✓  2 [chromium] › e2e/pages.spec.ts:35:3 › page: explore — screenshot
  2 passed (4.1s)

 NX   Successfully ran target e2e for project web and 2 tasks it depends on
```

Key evidence:
- nx builds `api-contract:build` and `mock-data:build` **before** `web:e2e`
- `vite build` resolves all 324 modules (including `@farish/api-contract` and
  `@farish/mock-data`) without error
- Playwright runs both screenshot tests and passes

### `mise run check` still passes

```bash
mise run check
# → lint ✓ · test ✓ · build ✓ · check passed
```

---

## Files Changed

| File | Change |
|------|--------|
| [`apps/web/project.json`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/project.json) | Added `dependsOn: ["^build"]` to `e2e` target |
| [`.github/workflows/pages.yml`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/.github/workflows/pages.yml) | Changed `bun run --cwd apps/web e2e` → `nx run web:e2e` |

---

## Other `@farish/*` Workspace Imports

`apps/web` has two workspace library dependencies:
- `@farish/api-contract` — `apps/web/src/api/client.ts`
- `@farish/mock-data` — `apps/web/src/components/GhostModelGrid.vue`

Both are workspace packages whose `package.json` exports from `dist/`. The
`dependsOn: ["^build"]` fix covers both: nx resolves all workspace deps of
`web` and builds them before `web:e2e` runs. No additional changes needed.
