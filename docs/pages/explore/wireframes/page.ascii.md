# Explore — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SEARCH BAR (VTextField + mdi-magnify icon)                                   │
│  [🔍  Search models...                                              ] [✕]  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CONTROLS ROW                                                                 │
│  Sort: [Newest ▾] (VSelect)    [× geometric] [× abstract]  (VChipGroup)    │
│                                  ← active FilterChips (VChip removable)     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────────────────┐
│ FILTER PANEL     │  MODEL GRID (VRow / VCol sm=6 md=4 lg=3)                 │
│ (VNavigationDrawer)  ← col ~240px                                           │
│                  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│ Categories       │  │[img 4:3] │  │[img 4:3] │  │[img 4:3] │  │[img 4:3] │ │
│ [x] Geometric    │  │ Title A  │  │ Title B  │  │ Title C  │  │ Title D  │ │
│ [x] Abstract     │  │ @alice   │  │ @bob     │  │ @carol   │  │ @dan     │ │
│ [ ] Organic      │  │ ★★★★☆   │  │ ★★★☆☆   │  │ ★★★★★   │  │ ★★☆☆☆   │ │
│ [ ] Architectural│  │ 1.2k 👁  │  │ 340 👁   │  │ 5.1k 👁  │  │ 89 👁    │ │
│                  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│ Style            │                                                           │
│ ( ) Realistic    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│ ( ) Stylized     │  │[img 4:3] │  │[img 4:3] │  │[img 4:3] │  │[img 4:3] │ │
│ ( ) Low-poly     │  │ Title E  │  │ Title F  │  │ Title G  │  │ Title H  │ │
│                  │  │ @eve     │  │ @frank   │  │ @grace   │  │ @hank    │ │
│ [ Apply ]        │  │ ★★★★☆   │  │ ★★★☆☆   │  │ ★★★★☆   │  │ ★★★☆☆   │ │
│                  │  │ 780 👁   │  │ 2.3k 👁  │  │ 450 👁   │  │ 1.1k 👁  │ │
│                  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                  │                                                           │
│                  │              [ Load More ]  (VBtn)                       │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

## State Notes

| State        | Difference from default                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `loading`    | ModelGrid cards replaced by VSkeletonLoader; FilterPanel unchanged        |
| `empty`      | ModelGrid replaced by EmptyState: illustration + "No models yet" text     |
| `no-results` | ModelGrid replaced by NoResultsState: "No matches for '{query}'" + [Clear Search] |
| `error`      | ModelGrid replaced by inline error VCard + [Retry] button                 |
| `coming-soon`| See `coming-soon-overlay.ascii.md` — full overlay covers this layout      |

## Responsive (mobile)

- FilterPanel collapses into a bottom-sheet drawer (VNavigationDrawer bottom);
  a "Filters" VBtn in the Controls Row opens it.
- ModelGrid drops to 2 columns (VCol sm=6).
- SearchBar and SortSelector stack vertically.
