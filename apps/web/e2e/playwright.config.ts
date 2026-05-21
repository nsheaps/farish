/**
 * Playwright config for the farish page-screenshot suite.
 *
 * Initial prompt step 28: "as soon as you have a server that launches, each
 * validation loop must (using CI) automatically take screenshots of each page
 * ... + recording videos". This config is the runner for that requirement.
 *
 * Playwright Test is used as the test runner. The prompt mentions "playwright
 * + jest"; Playwright Test ships its own jest-style `expect`/`test` API, so a
 * separate jest install would be redundant — Playwright Test fills both roles.
 *
 * - `webServer` builds nothing itself; it runs `vite preview` against the
 *   already-built `dist/` (the CI workflow runs `nx run web:build` first, and
 *   the local `e2e` npm script chains the build). `vite preview` serves the
 *   exact production bundle that ships to GitHub Pages — so screenshots match
 *   what users see.
 * - `outputDir` collects per-test artifacts (videos, traces). The screenshot
 *   PNGs themselves are written explicitly by `pages.spec.ts` into
 *   `e2e/output/screenshots/` so the CI workflow can publish them on a
 *   date-based path.
 * - `video: 'on'` records every test; the prompt requires recorded videos.
 *
 * CI hardening:
 * - `webServer.cwd: '..'` sets the cwd for the preview server to `apps/web/`
 *   (the package root) regardless of where playwright was invoked. Without
 *   this, Playwright spawns the webServer command from `apps/web/e2e/`
 *   (configDir). Bun's package-script resolution may or may not walk up to
 *   find the parent package.json on a fresh runner — making this explicit
 *   removes the ambiguity entirely.
 * - `webServer.timeout: 120_000` — generous for a cold GH Actions runner that
 *   starts Chromium for the first time after the browser install step.
 * - `forbidOnly` — CI-standard guard: fails the run if `.only` is accidentally
 *   left in a test file.
 * - `launchOptions.args` — `--disable-dev-shm-usage` prevents Chromium crashes
 *   in containers / GH runners where /dev/shm is limited to 64 MB. `--no-sandbox`
 *   is added explicitly here even though Playwright also adds it by default
 *   (chromiumSandbox defaults to false) — defence in depth.
 */
import { defineConfig, devices } from '@playwright/test';

/** Port the preview server listens on during the e2e run. */
const PREVIEW_PORT = 4173;

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  // Standard CI guard: abort the run if a test.only leaked into the suite.
  forbidOnly: !!process.env.CI,
  // Screenshots must be deterministic — no retries, single worker, fixed viewport.
  retries: 0,
  workers: 1,
  // Per-test timeout: generous for a cold runner, tight enough to surface hangs.
  timeout: 60_000,
  // All artifacts (videos, traces, the screenshot PNGs) live under e2e/output/.
  outputDir: 'output/test-results',
  reporter: [
    ['list'],
    // HTML report is published to GitHub Pages alongside the screenshots.
    ['html', { outputFolder: 'output/report', open: 'never' }],
  ],
  use: {
    baseURL: `http://localhost:${PREVIEW_PORT}/`,
    viewport: { width: 1280, height: 800 },
    // Record a video for every test (initial prompt step 28).
    video: 'on',
    trace: 'retain-on-failure',
    // Explicit Chromium flags for CI (Docker / GitHub Actions).
    // --no-sandbox  : Playwright adds this by default (chromiumSandbox !== true),
    //                 but we set it explicitly as defence in depth.
    // --disable-dev-shm-usage : prevents crashes where /dev/shm is 64 MB (Docker
    //                           / GH Actions containers).
    launchOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Serve the production build. `reuseExistingServer` lets a developer point
  // the suite at an already-running preview during local iteration.
  //
  // `cwd: '..'` resolves to apps/web/ (the package root) — Playwright's
  // webServer plugin defaults cwd to configDir (apps/web/e2e/), which causes
  // `bun run preview` to depend on Bun's directory-walking behavior to find the
  // parent package.json. Setting cwd explicitly makes the command deterministic
  // across all environments and Bun versions.
  webServer: {
    command: `bun run preview -- --port ${PREVIEW_PORT} --strictPort`,
    url: `http://localhost:${PREVIEW_PORT}/`,
    cwd: '..',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
