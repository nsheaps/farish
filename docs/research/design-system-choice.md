# Design System Choice — farish

Research and recommendation for the Vue 3 off-the-shelf design system to use
across farish (initial prompt step 15). This document is the source of truth
for the component vocabulary used in wireframes and implementation.

## Decision

**Chosen: Vuetify 3 (Material Design 3 for Vue 3)**[^vuetify-home]

## Candidates Evaluated

Four mature Vue 3 component libraries were considered. Nuxt UI was excluded
early: it is designed around the Nuxt framework, which farish does not use.[^nuxt-ui]

| Library         | GitHub Stars | Weekly npm DL | Design basis            |
| --------------- | -----------: | ------------: | ----------------------- |
| **Vuetify 3**   | ~41 000[^vuetify-gh]   | ~943 000[^npm-trends]   | Material Design 3       |
| Element Plus    | ~25 000[^element-gh]   | ~430 000[^npm-trends]   | Element (enterprise)    |
| PrimeVue 4      | ~14 000[^primevue-gh]  | ~422 000[^npm-trends]   | Design-agnostic         |
| Naive UI        | ~17 000[^naive-gh]     |  ~79 000[^npm-trends]   | Neutral/custom          |

### Vuetify 3

Pros: largest community and download volume by a wide margin; Material Design 3
is modern and polished; has every component farish needs out of the box
(`VRating`, `VDataTable`, `VNavigationDrawer`, `VDialog`, `VOverlay`,
`VCard`); strong responsive grid; excellent TypeScript support; Material
theming is fully overridable so the default Google aesthetic is not locked
in.[^vuetify-theming]

Cons: the Material Design aesthetic requires deliberate theme customization to
avoid a generic look; opinionated class/prop naming.

### PrimeVue 4

Pros: 90+ components — slightly more breadth than Vuetify; design-agnostic with
an "unstyled" mode for complete freedom; strong Tailwind CSS integration.[^primevue-home]

Cons: "unstyled" mode means non-trivial setup to ship a consistent look without
extra design work; steeper learning curve; smaller community than Vuetify.

### Element Plus

Pros: mature, very stable; excellent form/table components.[^element-home]

Cons: enterprise/admin aesthetic that would require heavy restyling for a
creative tool; Material-agnostic, which is less aligned with the modern
browser UI direction farish wants.

### Naive UI

Pros: Vue 3-native, TypeScript-first, tree-shakeable, clean aesthetic.[^naive-home]

Cons: significantly smaller download base (~79 k/week vs Vuetify's ~943 k/week);
fewer community examples; some critical components (e.g. a built-in rating
widget) less polished than Vuetify equivalents.

## Rationale for Vuetify 3

1. **Component coverage.** Every UI primitive farish needs is available as a
   first-class Vuetify component — no custom wrappers required at the wireframe
   stage (see Component Vocabulary below).

2. **Community and ecosystem.** ~41 k GitHub stars and ~943 k weekly npm
   downloads[^npm-trends] means StackOverflow coverage, active issue responses,
   and long-term maintenance confidence.

3. **Responsive grid.** `VRow`/`VCol` with the `xs`/`sm`/`md`/`lg` breakpoint
   props maps directly to the desktop-default / mobile-friendly layout
   requirement.[^vuetify-grid]

4. **Rating widget.** `VRating` is built in and maps directly to the star-rating
   mechanic in Model Detail, Explore cards, and Leaderboards.[^vuetify-rating]

5. **Theming.** Vuetify 3 uses a CSS custom-property theme engine — one
   `createVuetify()` call with a custom palette moves the entire UI away from
   the default Material colours.[^vuetify-theming]

6. **Amendment A6 alignment.** Vuetify's slot-based layout produces predictable,
   testable DOM that Playwright can screenshot reliably (needed for the CI
   screenshot workflow in steps 27–29).

## Component Vocabulary

The table below is the canonical mapping used by the wireframing skill. When a
wireframe labels a component, it uses the **Farish name** (left column); the
**Vuetify component** (right column) is what gets built.

| Farish Component        | Vuetify 3 Component(s)                              | Notes                                        |
| ----------------------- | --------------------------------------------------- | -------------------------------------------- |
| NavBar                  | `VAppBar` + `VBtn`                                  | Sticky top bar; mobile hamburger via `VMenu` |
| NavDrawer               | `VNavigationDrawer`                                 | Sidebar on mobile / Settings nav             |
| ModelCard               | `VCard` + `VRating`                                 | Thumbnail, title, author, rating             |
| ModelGrid               | `VRow` / `VCol` (`cols="12" sm="6" md="4" lg="3"`) | Responsive card grid                         |
| FilterPanel             | `VNavigationDrawer` (secondary)                     | Collapsible; bottom-sheet on mobile          |
| ParametersPanel         | `VNavigationDrawer` (secondary)                     | Collapsible; bottom-sheet on mobile          |
| Dialog / Modal          | `VDialog`                                           | ClarificationDialog, ShareDialog, etc.       |
| ComingSoonOverlay       | `VOverlay` + `VCard`                                | Full-page ghost overlay                      |
| ThreeDViewer            | Custom canvas in `VCard`                            | WebGL; no native Vuetify equivalent          |
| SearchBar               | `VTextField` with `append-inner-icon="mdi-magnify"` | Debounced; bound to URL param                |
| SortSelector            | `VSelect`                                           | Newest / Highest Rated / Most Popular        |
| FilterChips             | `VChip` + `VChipGroup`                              | Removable active-filter chips                |
| LeaderboardTable        | `VDataTable`                                        | Sortable columns; time-bucket tabs via `VTab`|
| TabBar (time buckets)   | `VTabs` + `VTab`                                    | 1w / 1m / 1y / All time                      |
| RatingWidget            | `VRating`                                           | 5-star input                                 |
| ActionBar               | `VToolbar` + `VBtn`                                 | Download / Save / Share / Rate               |
| SettingsForm            | `VForm` + `VTextField` + `VSwitch`                  | API key, preferences                         |
| Banner / Alert          | `VAlert`                                            | NoKeyBanner, error messages                  |
| Skeleton / Loading      | `VSkeletonLoader`                                   | Card and viewer loading states               |
| EmptyState              | `VCard` with centered illustration                  | No-results / empty library                   |
| ProgressFeed            | `VList` + `VListItem` (streaming)                   | Agent-loop step stream in Generate           |
| Tooltip / Popover       | `VTooltip` / `VMenu`                                | Contextual hints                             |
| Snackbar / Toast        | `VSnackbar`                                         | Save-confirmation, copy-URL feedback         |

## References

[^vuetify-home]: Vuetify official site — <https://vuetifyjs.com>
[^vuetify-gh]: Vuetify GitHub repository — <https://github.com/vuetifyjs/vuetify>
[^vuetify-theming]: Vuetify 3 theming docs — <https://vuetifyjs.com/en/styles/colors/>
[^vuetify-grid]: Vuetify 3 grid system docs — <https://vuetifyjs.com/en/components/grids/>
[^vuetify-rating]: Vuetify 3 VRating component — <https://vuetifyjs.com/en/components/ratings/>
[^primevue-home]: PrimeVue official site — <https://primevue.org>
[^primevue-gh]: PrimeVue GitHub repository — <https://github.com/primefaces/primevue>
[^element-home]: Element Plus official site — <https://element-plus.org>
[^element-gh]: Element Plus GitHub repository — <https://github.com/element-plus/element-plus>
[^naive-home]: Naive UI official site — <https://www.naiveui.com>
[^naive-gh]: Naive UI GitHub repository — <https://github.com/TuSimple/naive-ui>
[^nuxt-ui]: Nuxt UI requires the Nuxt framework — <https://ui.nuxt.com/getting-started>
[^npm-trends]: npm download trends snapshot (2025–2026) —
      <https://npmtrends.com/bootstrap-vue-vs-naive-ui-vs-primevue-vs-vuetify>
