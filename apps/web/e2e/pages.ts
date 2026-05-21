/**
 * Page manifest for the farish screenshot suite.
 *
 * Every entry corresponds to a page in `docs/pages/INDEX.md`. The screenshot
 * test (`pages.spec.ts`) iterates this list and exercises only the entries
 * whose `built` flag is `true` — i.e. routes that actually exist in
 * `src/router/index.ts` today.
 *
 * As later prompt steps (30–32) build the real pages, flip `built` to `true`
 * and the CI screenshot pipeline (step 28) picks the new page up automatically
 * with no workflow change. This keeps the harness "well-defined page tests
 * matching the page specs" (initial prompt, step 28) while starting lean.
 *
 * `route` uses hash paths because the router uses `createWebHashHistory`
 * (static GitHub Pages deployment — see src/router/index.ts).
 */

/** A single page under screenshot test. */
export interface PageEntry {
  /** Stable slug — matches the `docs/pages/<slug>/` spec directory. */
  readonly slug: string;
  /** Human-readable page name. */
  readonly name: string;
  /** Hash route to navigate to (relative to the app origin). */
  readonly route: string;
  /** Path to the page's spec, for traceability in test names. */
  readonly specRef: string;
  /** Whether a route for this page exists yet. Only `true` pages are tested. */
  readonly built: boolean;
}

/**
 * All 11 farish pages from `docs/pages/INDEX.md`.
 *
 * Only `home` and `explore` have routes today (the framework skeleton from
 * step 26). The rest are listed with `built: false` so the suite is the
 * single source of truth for "every page" and scales without edits here.
 */
export const PAGES: readonly PageEntry[] = [
  { slug: 'home', name: 'Home', route: '#/', specRef: 'docs/pages/home/SPEC.md', built: true },
  {
    slug: 'explore',
    name: 'Explore',
    route: '#/explore',
    specRef: 'docs/pages/explore/SPEC.md',
    built: true,
  },
  {
    slug: 'leaderboards',
    name: 'Leaderboards',
    route: '#/leaderboards',
    specRef: 'docs/pages/leaderboards/SPEC.md',
    built: false,
  },
  {
    slug: 'generate',
    name: 'Generate',
    route: '#/generate',
    specRef: 'docs/pages/generate/SPEC.md',
    built: false,
  },
  {
    slug: 'model-detail',
    name: 'Model Detail',
    route: '#/model/example',
    specRef: 'docs/pages/model-detail/SPEC.md',
    built: false,
  },
  {
    slug: 'my-library',
    name: 'My Library',
    route: '#/library',
    specRef: 'docs/pages/my-library/SPEC.md',
    built: false,
  },
  {
    slug: 'profile',
    name: 'Profile',
    route: '#/u/example',
    specRef: 'docs/pages/profile/SPEC.md',
    built: false,
  },
  {
    slug: 'settings',
    name: 'Settings',
    route: '#/settings',
    specRef: 'docs/pages/settings/SPEC.md',
    built: false,
  },
  {
    slug: 'about',
    name: 'About',
    route: '#/about',
    specRef: 'docs/pages/about/SPEC.md',
    built: false,
  },
  {
    slug: 'coming-soon',
    name: 'Coming Soon',
    route: '#/coming-soon',
    specRef: 'docs/pages/coming-soon/SPEC.md',
    built: false,
  },
  {
    slug: 'not-found',
    name: 'Not Found',
    route: '#/no-such-route',
    specRef: 'docs/pages/not-found/SPEC.md',
    built: false,
  },
];

/** The subset of pages that have a route today and are screenshot-tested. */
export const BUILT_PAGES: readonly PageEntry[] = PAGES.filter((p) => p.built);
