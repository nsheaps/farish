# Step 32 — Mock Data & Style Polish Report

**Date:** 2026-05-21
**Branch:** `claude/ai-3d-model-generator-XjoUi`
**PR:** [#1](https://github.com/nsheaps/farish/pull/1)

---

## Summary

Step 32 of the initial prompt: iteratively review each page, improve styles and
consistency between pages, use lorem ipsum text and placeholder images as mock data to
make the pages work without any real data (including a mock conversation for the actual
feature), perform a validate/improve loop.

`mise run check` result: **PASS** (lint ✓ · 47 tests ✓ · Vite build ✓, 346 modules)

---

## Commits

| Hash | Description |
|------|-------------|
| [`ae8f238`](https://github.com/nsheaps/farish/commit/ae8f238) | `feat(mock-data): add mock-conversation and mock-model-detail generators` |
| [`d2800bd`](https://github.com/nsheaps/farish/commit/d2800bd) | `feat(web/generate): populate Generate page with full mock conversation demo` |
| [`04bf705`](https://github.com/nsheaps/farish/commit/04bf705) | `feat(web/views): use mock-data library in ModelDetail and MyLibrary` |
| [`82a5c8c`](https://github.com/nsheaps/farish/commit/82a5c8c) | `style(web): cross-page consistency pass — cards, spacing, typography, mock data` |

---

## Mock Data Library Extensions

### `lib/mock-data/src/mock-conversation.ts` (new)[^mc]

Exports `mockGenerationConversation(seed?)` returning a `MockGenerationConversation`:

- **`promptText`**: "A low-poly dragon perched on a rocky spire, wings spread wide,
  breathing a cone of geometric fire"
- **`clarificationQuestions`** (3): scale (radio), interior topology (radio), colour
  palette (free text) — each with a pre-filled `mockAnswer` for demo mode
- **`agentSteps`** (8): parse prompt → review spec → build skeleton → generate wings →
  construct spire → fire cone → apply materials → optimise mesh — each with `label`,
  `detail`, and `durationMs`
- **`resultSummary`**: "Low-poly dragon on spire — 6 240 faces · emerald/amber palette ·
  export-ready OBJ"

### `lib/mock-data/src/mock-model-detail.ts` (new)[^mmd]

Exports `mockModelDetail(modelId)` returning `MockModelDetail` (extends `ModelSummary`
with `prompt`, `createdAt`, `resolution`, `style`, `complexity`, `ratingCount`).
Seed is derived from the model ID string via a djb2-style hash, making the same ID
always yield the same record — snapshots remain stable.

### `lib/mock-data/src/index.ts` (updated)

Re-exports both new modules alongside the existing `createLorem`, `placeholderImageUrl`,
and `mockModelSummaries`.

---

## Page-by-Page Changes

### Generate page (`GenerateView.vue`) — major update

The core feature page now opens in **demo mode** (`state = 'complete'`), showing the
complete flow without any API key:

- **Demo banner** (info tonal alert, dismissible) replaces the no-key warning.
  Includes a "Connect your API key →" link to `/settings`.
- **Prompt textarea** pre-filled from `mockGenerationConversation().promptText`.
- **Clarification Q&A section** renders all three mock questions with their mock
  answers; radio options and free-text field shown in disabled/answered state with
  green check indicators.
- **Progress feed** lists all 8 agent steps with `mdi-check-circle-outline` icons and
  detail lines in the `complete` state. A green "Generation complete" footer strip
  replaces the indeterminate progress bar.
- **Model preview** shows the result summary string instead of generic copy.
- **Result actions toolbar** (Download / Save to Library / Share / New) visible.

### Home page (`HomeView.vue`) — moderate update

- Hero gains a CSS gradient background (`rgb(var(--v-theme-background))` →
  `rgb(91 63 184 / 8%)`), a "AI-Powered 3D Generation" chip, a "Learn how it works"
  secondary button.
- **Feature highlights strip** (3 columns): Prompt-driven · Your key, your data ·
  Export-ready — each with an icon and description.
- Trending strip: cards switch to `variant="outlined"`, display star rating and view
  count. "See all" link to `/explore`.
- CTA footer strip with a second "Start Generating" button on a `surface-variant`
  background.

### Model Detail page (`ModelDetailView.vue`) — moderate update

- Uses `mockModelDetail(modelId)` for prompt, createdAt, resolution, style, complexity,
  ratingCount — deterministic from the route parameter.
- Model title shown as `text-h5` page heading.
- Viewer placeholder uses the mock thumbnail as background with a dark overlay.
- Dates formatted with `toLocaleDateString`.
- Author name links to the profile route.
- Generation parameters show `%` values from the mock record.

### My Library page (`MyLibraryView.vue`) — moderate update

- Combines `mockModelSummaries(6)` + `mockModelDetail` for richer card data.
- Cards show: title, realistic date label, truncated prompt, star rating, view count.
- Library header shows model count with a subtitle.
- Actions menu icon changed to `mdi-dots-vertical`; View button added as primary action.

### About page (`AboutView.vue`) — minor update

- Hero gains a cube icon.
- Generation pipeline diagram replaced with a horizontal icon+arrow flow using Vuetify
  components (5 stages: Your prompt → Claude SDK → Geometry tools → 3D output → Live
  viewer).
- Section headings gain icon prefixes (`mdi-book-open-outline`, `mdi-cog-outline`,
  `mdi-lock-outline`).
- Wikipedia link styled as `variant="outlined"` button.
- Added prose about the DevTools local-storage inspection tip.

### Settings page (`SettingsView.vue`) — moderate update

- Connection status shows three variants: warning (disconnected) / success (connected)
  / error (invalid key).
- Privacy note wrapped in a `color="primary" variant="tonal"` card.
- Style selector uses `item-title / item-value` objects.
- API key section includes a link to console.anthropic.com.
- Danger zone wrapped in an outlined error card.
- Theme toggle buttons gain icon prefixes.

### Leaderboards Coming Soon (`LeaderboardsComingSoonView.vue`) — minor update

- `ghostEntries` replaced by `mockModelSummaries(10, 99)` with computed descending
  ratings (`5.00` → `4.64`) and `toLocaleString()` view counts.
- Rating display uses `mdi-star` icon + `amber-darken-2` colour for visual consistency.

### Ghost Model Grid (`GhostModelGrid.vue`) — minor update

- Cards switch to `variant="outlined"` for consistency with the rest of the app.
- Rating/view display uses icon+text (matching HomeView and MyLibraryView) instead of
  the `v-rating` component.
- Search bar removed from the grid (it belongs in the parent page layout).

### App root (`App.vue`) — minor update

- NavBar logo adds `mdi-cube-outline` icon.
- Active-link CSS class (`nav-active`) adds a white bottom border on the current route.
- Footer gains `border-top` styling, a `·` separator, and a "© 2026 farish — named
  after William Farish" copyright line with a Wikipedia link.

---

## Consistency Fixes Applied Across All Pages

| Issue | Fix |
|-------|-----|
| Mixed card variants (default / flat / outlined) | All content cards use `variant="outlined"` |
| Ratings shown as numbers only | Star icon + `color="amber-darken-2"` used everywhere |
| View counts not formatted | `toLocaleString()` applied on all view counts |
| Section label styles inconsistent | `text-overline text-medium-emphasis` used in Settings, ModelDetail |
| Hardcoded ghost leaderboard entries | Replaced with `mockModelSummaries` |
| Hardcoded dates in library cards | Replaced with `MOCK_DATES` array |
| GhostModelGrid had embedded search bar | Removed (parent provides the search) |
| Footer lacked visual separation | `border-top` + copyright added |
| NavBar active link not indicated | `nav-active` CSS class with bottom border |

---

## Validate / Improve Loop

1. Initial implementation → `mise run check` → **PASS** (first run)
2. No further lint or type errors found; no test regressions (all 47 tests pass)
3. Build output: 346 modules, 410 kB JS gzip 136 kB — no bundle size regression

[^mc]: [`lib/mock-data/src/mock-conversation.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/lib/mock-data/src/mock-conversation.ts)
[^mmd]: [`lib/mock-data/src/mock-model-detail.ts`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/lib/mock-data/src/mock-model-detail.ts)
