# Step 31 — Wireframe Match Report

## Summary

All 11 page view components in `apps/web/src/views/` were updated to match their
wireframes from `docs/pages/*/wireframes/page.ascii.md`. Built with Vuetify 3.
Backend-dependent pages retain the Coming Soon mechanism (non-dismissible overlay
with ghost wireframe). Commit: `1b36031`.

## Pages Updated

| Page | File | Type | Changes |
|------|------|------|---------|
| App (navbar) | `apps/web/src/App.vue` | shared | Added ⚙ settings icon (`mdi-cog`) to right of nav links |
| Home | `HomeView.vue` | static | Hero with "AI-generated 3D models, instantly." + secondary Explore/Leaderboards links; trending strip with horizontal-scroll ModelCards using `@farish/mock-data` |
| About | `AboutView.vue` | static | Three VCard sections: William Farish history (with Wikipedia link), generation pipeline diagram placeholder + prose, credential privacy (lock icon + settings CTA) |
| Not Found | `NotFoundView.vue` | system | Isometric SVG "404" illustration with 3D-style cubes, VCard wrapper, path-specific error message, VBtn CTAs for Home and Explore |
| Settings | `SettingsView.vue` | browser-only | Centered max-width-640 layout; connection status VAlert + Connect with Claude VBtn + API key input with show/hide toggle; storage note; VBtnToggle theme (Light/Dark/System); VSlider/VSelect default generation params; danger zone |
| My Library | `MyLibraryView.vue` | browser-only | VRow/VCol grid (cols=12/sm=6/md=4/lg=3) with LibraryModelCard + VMenu actions (View/Download/Delete); empty state with package icon + generate CTA; mock data from `@farish/mock-data` |
| Generate | `GenerateView.vue` | browser-only | Two-column layout: left sidebar (280px) with Resolution VSlider, Style VSelect, Complexity VSlider; right workspace with no-key VAlert banner, prompt VTextarea, generation stream/preview placeholders (idle/generating/complete/error states), result actions toolbar |
| Model Detail | `ModelDetailView.vue` | browser-only | 65/35 split: left has 3D viewer placeholder (480px) + ViewerControls overlay (VBtnGroup: reset/fullscreen/lights) + ActionBar; right has PromptDisplay VCard, VExpansionPanel for params, MetadataPanel; dismissible ComingSoonOverlay triggered by Rate/Share clicks |
| Explore | `ExploreComingSoonView.vue` | backend (coming soon) | Enhanced ghost: SearchBar + ControlsRow (sort VSelect + active filter VChips) + FilterPanel sidebar (category checkboxes + style radios + Apply button) + GhostModelGrid |
| Leaderboards | `LeaderboardsComingSoonView.vue` | backend (coming soon) | Enhanced ghost: VTabs (Best Rated/Most Rated/Most Viewed) + VBtnToggle time buckets (1W/1M/1Y/All) + ranked VList with gold/silver/bronze medal avatars + metric |
| Profile | `ProfileComingSoonView.vue` | backend (coming soon) | Enhanced ghost: ProfileHeader VCard (avatar + name + @handle + stats row with 3 VCards showing models/avg/views) + GhostModelGrid |
| Coming Soon | `ComingSoonView.vue` | system | Generic ghost: search bar + GhostModelGrid |

## @farish/* Dependencies Declared

No new `@farish/*` package imports were added. The two packages used
(`@farish/mock-data`, `@farish/api-contract`) were already declared in
`apps/web/package.json#dependencies` before this step.

## Cold Build Verification

**Command used:**
```bash
rm -rf lib/*/dist lib/*/tsconfig.tsbuildinfo apps/web/dist .nx
nx run web:build
```

**Result:** PASSED — all 3 dependency builds ran in correct order:
1. `api-contract:build` → `lib/api-contract/dist/` created
2. `mock-data:build` → `lib/mock-data/dist/` created
3. `web:build` → `apps/web/dist/` created, 346 modules bundled, 0 errors

**Pre-existing issue identified:** When only `dist/` is deleted (not `tsconfig.tsbuildinfo`),
TypeScript composite incremental builds consider themselves up-to-date and skip emission.
The `tsbuildinfo` files must also be deleted for a true cold build. This issue predates
step 31 — the CI environment doesn't have stale tsbuildinfo files, so CI cold builds
work correctly.

## Validation

- `mise run check`: **PASSED** (lint + typecheck + build for all 9 nx projects)
- `nx run web:test`: **PASSED** (12/12 tests, 4 test files)
- `biome lint ./src`: **PASSED** (11 files, no issues)
- Cold build: **PASSED** (see above)

## Commit

`1b36031` — `feat(web): step 31 — update all 11 pages to match wireframes`
Branch: `claude/ai-3d-model-generator-XjoUi`
PR: [nsheaps/farish#1](https://github.com/nsheaps/farish/pull/1)

[^wireframes]: Wireframes in `docs/pages/*/wireframes/page.ascii.md` per step 15 of
  [docs/INITIAL_PROMPT.md](../INITIAL_PROMPT.md)
