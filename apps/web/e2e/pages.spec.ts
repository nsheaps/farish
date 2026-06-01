/**
 * farish page-screenshot suite.
 *
 * Initial prompt step 28: CI "always takes pictures on main of every page".
 * This spec is the "well-defined page tests matching the page specs" — it
 * iterates the `docs/pages/INDEX.md`-derived manifest (`pages.ts`) and, for
 * every page with an existing route, navigates to it and captures a
 * full-page screenshot. Playwright records a video of each test automatically
 * (see `video: 'on'` in `playwright.config.ts`).
 *
 * Screenshots are written to `e2e/output/screenshots/<slug>.png`. The CI
 * workflow (`.github/workflows/pages.yml`) copies that directory onto a
 * date-based path and publishes it to GitHub Pages.
 *
 * Each test is named after the page slug + spec reference so a failing run
 * points straight at the page spec it validates.
 */
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { BUILT_PAGES } from './pages';

/** Absolute path of the `e2e/` directory (ESM-safe `__dirname` equivalent). */
const E2E_DIR = dirname(fileURLToPath(import.meta.url));

/** Directory the screenshot PNGs are written into. */
const SCREENSHOT_DIR = join(E2E_DIR, 'output', 'screenshots');

test.beforeAll(async () => {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
});

for (const page of BUILT_PAGES) {
  test(`page: ${page.slug} — screenshot (${page.specRef})`, async ({ page: browserPage }) => {
    // Navigate to the page's hash route and wait for the SPA to settle.
    await browserPage.goto(page.route, { waitUntil: 'networkidle' });

    // The Vuetify app root must be present — a minimal "the page rendered"
    // assertion that fails loudly if the route is broken.
    await expect(browserPage.locator('.v-application')).toBeVisible();

    // Capture the full page. `animations: 'disabled'` keeps the image stable.
    await browserPage.screenshot({
      path: join(SCREENSHOT_DIR, `${page.slug}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });
}
