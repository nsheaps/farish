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
 */
import { defineConfig, devices } from '@playwright/test';

/** Port the preview server listens on during the e2e run. */
const PREVIEW_PORT = 4173;

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  // Screenshots must be deterministic — no retries, single worker, fixed viewport.
  retries: 0,
  workers: 1,
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
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Serve the production build. `reuseExistingServer` lets a developer point
  // the suite at an already-running preview during local iteration.
  webServer: {
    command: `bun run preview -- --port ${PREVIEW_PORT} --strictPort`,
    url: `http://localhost:${PREVIEW_PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
