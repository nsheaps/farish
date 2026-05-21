# Screenshots CI Fix — PR #1

**Branch:** `claude/ai-3d-model-generator-XjoUi`
**Workflow:** `.github/workflows/pages.yml` — `screenshots` job
**Commits:** `4dfbe1c`, `75d6912`

---

## Root cause

Two issues found, one primary and one secondary.

### Primary: Vite v8 applies `server.proxy` to `vite preview`

Vite v8 added a `resolvePreviewOptions` helper that falls back to
`server.proxy` when `preview.proxy` is not explicitly set[^vite-preview-proxy]:

```js
proxy: preview?.proxy ?? server.proxy,
```

`apps/web/vite.config.ts` configures a dev-server proxy for `/api`:

```ts
server: {
  proxy: {
    '/api': {
      target: `http://localhost:${API_PORT}`,  // localhost:8787
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
    },
  },
},
```

Because `preview.proxy` was unset, vite v8 activated the same proxy for
`vite preview`. The Playwright screenshot suite's `webServer` runs
`vite preview`; every `/api/health` and `/api/models` request (made by
`HomeView.vue` on mount) was forwarded to `localhost:8787`, which is not
running in CI. The result was:

```
[WebServer] http proxy error: /health
[WebServer] Error: connect ECONNREFUSED 127.0.0.1:8787
```

In GitHub Actions the ECONNREFUSED response may be slower than locally
(container network stack differences, DNS, etc.), which can delay
`waitUntil: 'networkidle'` completion and push the test over its 30-second
navigation timeout — causing the `screenshots` job to fail.

**Local reproduction evidence:** running `CI=true bun run --cwd apps/web e2e`
with the old config consistently produced the proxy-error log. After the fix,
the log line disappears entirely and the two Playwright tests complete in
~4 seconds (vs sometimes longer with the proxy errors).

### Secondary: `/dev/shm` size in Docker/GitHub Actions containers

Chromium uses `/dev/shm` for shared memory. Docker containers default to a
64 MB `/dev/shm` allocation; GitHub Actions runners use Docker internally.
Without `--disable-dev-shm-usage`, Chromium can crash or OOM when the
shared-memory segment fills up during video recording (`video: 'on'` is
required by initial-prompt step 28).

Playwright adds `--no-sandbox` automatically (source:
`if (options.chromiumSandbox !== true) chromeArguments.push('--no-sandbox')`),
but does **not** add `--disable-dev-shm-usage` automatically.

---

## What was changed

### `apps/web/vite.config.ts` — commit `4dfbe1c`

Added an explicit `preview: { proxy: {} }` section to suppress the vite v8
fallback:

```ts
preview: {
  proxy: {},   // explicitly empty — don't inherit server.proxy in preview
},
```

### `apps/web/e2e/playwright.config.ts` — commit `75d6912`

Added `--disable-dev-shm-usage` to the shared `use.launchOptions.args` block:

```ts
launchOptions: {
  args: ['--disable-dev-shm-usage'],
},
```

---

## Verification

Full clean-state local reproduction of the CI `screenshots` job:

```
# 1. Bootstrap (CI=true triggers --frozen-lockfile)
CI=true mise run bootstrap
→ bun install v1.3.11 — Checked 342 installs [11.00ms]

# 2. Install Playwright browsers + system deps
CI=true bun run --cwd apps/web playwright install --with-deps chromium
→ 0 upgraded, 0 newly installed (all deps already present)

# 3. Build + screenshot suite (the primary failing step)
CI=true bun run --cwd apps/web e2e
→ vite build ✓ (255 modules)
→ [WebServer] vite preview --port "4173" --strictPort
→ Running 2 tests using 1 worker
→   ✓  1 [chromium] page: home — screenshot          (1.1s)
→   ✓  2 [chromium] page: explore — screenshot        (1.2s)
→   2 passed (4.2s)
→ NO proxy-error logs (root cause fixed)

# 4. Stage screenshots
bun run scripts/publish-screenshots.ts ci-verify-<ts>
→ 2026-05-21-ci-verify-<ts>   (exit 0)

# 5. mise run check (keeps CI gate green)
mise run check
→ lint ✓ · test ✓ · build ✓
```

Screenshots produced at `apps/web/e2e/output/screenshots/`: `home.png`,
`explore.png`.

---

## References

[^vite-preview-proxy]: Vite v8 source — `resolvePreviewOptions` in
`dist/node/chunks/node.js`:
`proxy: preview?.proxy ?? server.proxy` (line ~33730 in the bundled output).

- [`apps/web/vite.config.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/vite.config.ts)
- [`apps/web/e2e/playwright.config.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/e2e/playwright.config.ts)
- [commit `4dfbe1c`](https://github.com/nsheaps/farish/commit/4dfbe1c) — vite preview proxy fix
- [commit `75d6912`](https://github.com/nsheaps/farish/commit/75d6912) — playwright /dev/shm fix
