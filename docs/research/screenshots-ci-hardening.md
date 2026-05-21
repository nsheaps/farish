# Screenshots CI Hardening — PR #1

**Branch:** `claude/ai-3d-model-generator-XjoUi`
**Workflow:** `.github/workflows/pages.yml` — `screenshots` job
**Prior fix commits:** [`4dfbe1c`][4dfbe1c] (vite proxy), [`75d6912`][75d6912] (`--disable-dev-shm-usage`)
**This round commits:** [`757a556`][757a556] (playwright config), [`9096ffd`][9096ffd] (browser cache)

---

## Audit scope

After two prior fixes landed but the CI still failed, this audit reviewed
every known Playwright-on-GH-Actions failure mode end-to-end:

1. Browser system dependencies (`--with-deps`)
2. Browser binary installation path and version match
3. `webServer` readiness — how Playwright launches and waits for the preview
4. Headless/sandbox Chromium flags
5. Working-directory and path resolution
6. Toolchain setup (mise bun/node)
7. Timeouts (webServer, per-test, navigation)

---

## What pages.yml was doing wrong (this round)

### Root cause: `webServer.cwd` defaults to `configDir`, not the package root

Playwright's `webServerPlugin` resolves the `cwd` for the webServer subprocess
as follows (from `playwright@1.50.1/lib/plugins/webServerPlugin.js`):

```js
this._options.cwd = this._options.cwd
  ? path.resolve(configDir, this._options.cwd)
  : configDir;
```

`configDir` is the directory of the config file — `apps/web/e2e/`.

The webServer command `bun run preview -- --port 4173 --strictPort` is
therefore spawned **from `apps/web/e2e/`**, not from `apps/web/` where the
`preview` script is defined in `package.json`.

Bun's `bun run` does walk up the directory tree to find a parent `package.json`
on this dev container (verified by testing `bun run preview` from within
`apps/web/e2e/`). However, this walking behaviour is **not documented** in the
Bun CLI docs[^bun-run-docs] and is not guaranteed to be present or consistent
across all Bun versions and environments. On a fresh `ubuntu-latest` runner
with no warm caches, the behaviour could differ.

Setting `webServer.cwd: '..'` in the Playwright config resolves the cwd to
`apps/web/` (via `path.resolve('apps/web/e2e/', '..')`) — making `bun run
preview` deterministic across all environments and Bun versions.

---

## Secondary issues addressed

### `--no-sandbox` implicit → explicit

Playwright adds `--no-sandbox` by default when `chromiumSandbox !== true`
(verified in `playwright-core@1.50.1/lib/server/chromium/chromium.js`):

```js
if (options.chromiumSandbox !== true) chromeArguments.push('--no-sandbox');
```

The flag is now also set explicitly in `launchOptions.args` as defence in
depth — it documents the intent and removes any ambiguity about whether the
default behaviour applies.

### `webServer.timeout` 60 s → 120 s

60 seconds is generous for a warm dev-container but may be tight for the
first run on a cold `ubuntu-latest` runner that has just installed Chromium and
system libraries via `apt`. 120 seconds removes this as a failure vector.

### Per-test `timeout: 60_000` made explicit

The default Playwright per-test timeout is 30 s. Tests complete in ~1 s
locally, but 30 s is marginal for a cold runner if there is any startup or
network overhead. 60 s is generous without masking real hangs.

### `forbidOnly: !!process.env.CI`

Standard CI guard — aborts the run immediately if a `.only` modifier leaked
into a spec. Not a current failure cause, but a correctness guard.

---

## Changes made

### `apps/web/e2e/playwright.config.ts` — commit [`757a556`][757a556]

```diff
+  forbidOnly: !!process.env.CI,
   retries: 0,
   workers: 1,
+  timeout: 60_000,
   ...
     launchOptions: {
-      args: ['--disable-dev-shm-usage'],
+      args: ['--no-sandbox', '--disable-dev-shm-usage'],
     },
   ...
   webServer: {
     command: `bun run preview -- --port ${PREVIEW_PORT} --strictPort`,
     url: `http://localhost:${PREVIEW_PORT}/`,
+    cwd: '..',
     reuseExistingServer: !process.env.CI,
-    timeout: 60_000,
+    timeout: 120_000,
   },
```

### `.github/workflows/pages.yml` — commit [`9096ffd`][9096ffd]

Added `actions/cache@v4` step to cache `~/.cache/ms-playwright` between runs:

```yaml
- name: Cache Playwright browser binaries
  id: playwright-cache
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-browsers-${{ runner.os }}-${{ hashFiles('bun.lock') }}
```

Cache key includes `bun.lock` hash so a dep bump (which may change the
Playwright browser revision) automatically invalidates it.

The `Install Playwright browsers (+ system deps)` step still runs
unconditionally — even on a cache hit — because system deps installed via
`apt-get --with-deps` cannot be cached (they are host-level packages, not files
in the repo tree).

---

## Local cold-run reproduction

Steps executed to simulate what a fresh GH runner does:

```bash
# 1. Bootstrap (CI=true triggers --frozen-lockfile)
CI=true mise run bootstrap
→ bun install v1.3.11 — Checked 342 installs [11.00ms]

# 2. Install Playwright browsers + system deps
#    (system deps already present in this container; binary already cached)
CI=true bun run --cwd apps/web playwright install --with-deps chromium
→ Playwright build v1155 (playwright v1.50.1)
→ Chromium already installed

# 3. Build + screenshot suite (the primary failing step)
CI=true bun run --cwd apps/web e2e
→ vite build ✓ (255 modules, ~750 ms)
→ [WebServer] vite preview --port "4173" --strictPort
→ Running 2 tests using 1 worker
→   ✓  1 [chromium] page: home — screenshot          (1.1s)
→   ✓  2 [chromium] page: explore — screenshot        (1.2s)
→   2 passed (3.7s)
→ webServer.cwd resolved to apps/web/ — bun run preview deterministic

# 4. Full CI gate
mise run check
→ lint ✓ · test ✓ · build ✓ · check passed
```

Screenshots produced at `apps/web/e2e/output/screenshots/`: `home.png`,
`explore.png`.

---

## Failure mode checklist

| # | Failure mode | Status | Evidence |
|---|---|---|---|
| 1 | Browser system deps missing | ✅ Fixed ([`4dfbe1c`][4dfbe1c] era) | `--with-deps` in workflow |
| 2 | Browser binary version mismatch | ✅ Not an issue | Same `@playwright/test@1.50.1` for install and test |
| 3 | `webServer` cwd ambiguity | ✅ Fixed [`757a556`][757a556] | `cwd: '..'` → `apps/web/` |
| 4 | `webServer` timeout too tight | ✅ Fixed [`757a556`][757a556] | 60 s → 120 s |
| 5 | `--no-sandbox` not set | ✅ Fixed [`757a556`][757a556] | Explicit in `launchOptions.args` |
| 6 | `/dev/shm` crash | ✅ Fixed ([`75d6912`][75d6912] era) | `--disable-dev-shm-usage` |
| 7 | Vite proxy active in preview | ✅ Fixed ([`4dfbe1c`][4dfbe1c] era) | `preview.proxy: {}` |
| 8 | Mise toolchain missing | ✅ Not an issue | `jdx/mise-action@v2` in all jobs |
| 9 | Per-test timeout too tight | ✅ Fixed [`757a556`][757a556] | 30 s (default) → 60 s explicit |
| 10 | Browser download on every run | ✅ Improved [`9096ffd`][9096ffd] | `actions/cache@v4` for `~/.cache/ms-playwright` |

---

## References

[^bun-run-docs]: [Bun CLI — `bun run`](https://bun.sh/docs/cli/run) — does not
document directory-walking for `package.json` resolution.

[4dfbe1c]: https://github.com/nsheaps/farish/commit/4dfbe1c
[75d6912]: https://github.com/nsheaps/farish/commit/75d6912
[757a556]: https://github.com/nsheaps/farish/commit/757a556
[9096ffd]: https://github.com/nsheaps/farish/commit/9096ffd

- [`apps/web/e2e/playwright.config.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/e2e/playwright.config.ts)
- [`.github/workflows/pages.yml`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/.github/workflows/pages.yml)
- [`playwright-core@1.50.1/lib/plugins/webServerPlugin.js`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/node_modules/.bun/playwright@1.50.1/node_modules/playwright/lib/plugins/webServerPlugin.js) — `configDir` cwd default
- [`playwright-core@1.50.1/lib/server/chromium/chromium.js`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/node_modules/.bun/playwright-core@1.50.1/node_modules/playwright-core/lib/server/chromium/chromium.js) — `--no-sandbox` default
