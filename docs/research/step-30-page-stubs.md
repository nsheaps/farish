# Step 30 — Page Stubs Report

**Date:** 2026-05-21
**Branch:** `claude/ai-3d-model-generator-XjoUi`
**Commits:**
- [`788a684`](https://github.com/nsheaps/farish/commit/788a684) — `feat(web): add skeleton view stubs for 9 new pages (step 30)`
- [`5f9b922`](https://github.com/nsheaps/farish/commit/5f9b922) — `feat(web): wire all 11 pages into router and update global chrome (step 30)`

---

## Pages Stubbed

All 11 pages from [`docs/pages/INDEX.md`](../pages/INDEX.md) now resolve as
Vue Router routes and render skeleton views.

| Page | Route | Tag | View File | How Delivered |
|---|---|---|---|---|
| Home | `/` | `static` | `HomeView.vue` _(replaced)_ | Real stub with hero + trending strip |
| Explore | `/explore` | `backend` | `ExploreComingSoonView.vue` _(unchanged)_ | ComingSoon + GhostModelGrid |
| Leaderboards | `/leaderboards` | `backend` | `LeaderboardsComingSoonView.vue` _(new)_ | ComingSoon + skeleton tabs/list |
| Generate | `/generate` | `browser-only` | `GenerateView.vue` _(new)_ | Skeleton workspace (prompt bar, params panel, progress, result) |
| Model Detail | `/m/:modelId` | `browser-only`/`backend` | `ModelDetailView.vue` _(new)_ | 3D viewer placeholder + info panel + action bar |
| My Library | `/library` | `browser-only` | `MyLibraryView.vue` _(new)_ | Header + empty state + hidden grid |
| Profile | `/u/:username` | `backend` | `ProfileComingSoonView.vue` _(new)_ | ComingSoon + profile header + GhostModelGrid |
| Settings | `/settings` | `browser-only` | `SettingsView.vue` _(new)_ | Connection, storage note, preferences, danger zone |
| About | `/about` | `static` | `AboutView.vue` _(new)_ | Hero, Farish history, how-it-works, privacy, settings CTA |
| Coming Soon | `/coming-soon` | `system` | `ComingSoonView.vue` _(new)_ | ComingSoon component with generic ghost |
| Not Found | `/:pathMatch(.*)*` | `system` | `NotFoundView.vue` _(new)_ | 404 illustration, headline, home CTA, explore link |

---

## Coming Soon Mechanism

Backend-dependent pages (`explore`, `leaderboards`, `profile`) and the
direct `/coming-soon` route all compose the existing reusable
[`ComingSoon.vue`](../../apps/web/src/components/ComingSoon.vue) component
introduced in step 26.[^coming-soon-component]

- **Explore** — unchanged from step 26; uses `ComingSoon` + `GhostModelGrid`
- **Leaderboards** — `ComingSoon` wrapping a skeleton of the tabs/bucket-selector/list layout
- **Profile** — `ComingSoon` wrapping a profile header skeleton + `GhostModelGrid`
- **Coming Soon direct route** — `ComingSoon` wrapping a generic placeholder

Per [`INDEX.md` cross-page notes][index-md], full-page Coming Soon overlays
are non-dismissible (the "Back to Home" button is the only exit). This is
already enforced by `ComingSoon.vue`'s `persistent` overlay.

---

## Global Chrome Updated

[`App.vue`](../../apps/web/src/App.vue) was updated to match the cross-page
requirements from `INDEX.md`:

- **NavBar:** Generate · Explore · Leaderboards · Library
- **Footer:** About · Settings · GitHub ↗

All 11 pages inherit this chrome via the `RouterView` in `v-main`.

---

## HomeView Replaced

The step-26 framework demo (`HomeView.vue`) was replaced with the real Home
page stub. Its test file (`HomeView.test.ts`) was updated to assert the new
skeleton structure (hero section, Generate CTA, trending strip) instead of
the API health-check demo tests.

---

## `mise run check` Result

**PASS** — lint + test + build all green after both commits and push.

```
 NX   Successfully ran target lint for 9 projects
 NX   Successfully ran target test for 9 projects (12 tests, 4 files in web)
 NX   Successfully ran target build for 9 projects
==> check passed
```

Web test count increased from 3 files / 9 tests (step 26) to 4 files / 12 tests
after updating `HomeView.test.ts`.

---

## Files Changed

### Modified
- [`apps/web/src/App.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/App.vue)
- [`apps/web/src/router/index.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/router/index.ts)
- [`apps/web/src/views/HomeView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/HomeView.vue)
- [`apps/web/src/views/HomeView.test.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/HomeView.test.ts)

### Created (new)
- [`apps/web/src/views/GenerateView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/GenerateView.vue)
- [`apps/web/src/views/ModelDetailView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/ModelDetailView.vue)
- [`apps/web/src/views/MyLibraryView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/MyLibraryView.vue)
- [`apps/web/src/views/SettingsView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/SettingsView.vue)
- [`apps/web/src/views/AboutView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/AboutView.vue)
- [`apps/web/src/views/LeaderboardsComingSoonView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/LeaderboardsComingSoonView.vue)
- [`apps/web/src/views/ProfileComingSoonView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/ProfileComingSoonView.vue)
- [`apps/web/src/views/ComingSoonView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/ComingSoonView.vue)
- [`apps/web/src/views/NotFoundView.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/views/NotFoundView.vue)

---

[^coming-soon-component]: The `ComingSoon.vue` component and `GhostModelGrid.vue` were introduced in step 26. See [`apps/web/src/components/ComingSoon.vue`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/apps/web/src/components/ComingSoon.vue).

[index-md]: ../pages/INDEX.md
