# Leaderboards — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ BOARD TABS (VTabs)                                                           │
│  ┌──────────────┬─────────────────┬──────────────┐                          │
│  │  Best Rated  │   Most Rated    │  Most Viewed  │   ← active = underlined │
│  └──────────────┴─────────────────┴──────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TIME BUCKET SELECTOR (VBtnToggle)                                            │
│   [ 1W ]   [ 1M ]   [ 1Y ]   [ All ]    ← active = filled/elevated          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ RANKED LIST (VList)  — showing "Best Rated · All time"                       │
│                                                                             │
│  Rank  Thumbnail  Title                       Author     Avg Rating         │
│  ────  ─────────  ─────────────────────────── ─────────  ──────────         │
│                                                                             │
│   #1   [img 48px] Crystalline Spire           @alice     ★★★★★  4.95       │
│   #2   [img 48px] Neon Octahedron             @bob       ★★★★★  4.91       │
│   #3   [img 48px] Organic Flow Sculpture      @carol     ★★★★☆  4.87       │
│   #4   [img 48px] Low-poly Dragon             @dan       ★★★★☆  4.82       │
│   #5   [img 48px] Tessellated Sphere          @eve       ★★★★☆  4.79       │
│   #6   [img 48px] Brutalist Tower             @frank     ★★★★☆  4.76       │
│   #7   [img 48px] Floating Island             @grace     ★★★★☆  4.74       │
│  ...                                                                        │
│  #50   [img 48px] Simple Cube Variant         @zara      ★★★★☆  4.12       │
│                                                                             │
│  ← RankedModelCard row (VListItem) — #1/#2/#3 may have gold/silver/bronze  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State        | Difference from default                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `loading`    | Ranked rows replaced by VSkeletonLoader list items                        |
| `empty`      | List replaced by EmptyState: "No models ranked yet for this period."       |
| `error`      | List replaced by inline error VCard + [Retry] button                      |
| `coming-soon`| See `coming-soon-overlay.ascii.md` — full overlay covers this layout       |

## Column variants by board

- **Best Rated**: last column is "Avg Rating" (★ + decimal)
- **Most Rated**: last column is "Rating Count" (e.g. "2,340 ratings")
- **Most Viewed**: last column is "View Count" (e.g. "51.2k views")

## Responsive (mobile)

- BoardTabs scroll horizontally (VTabs scrollable).
- TimeBucketSelector becomes a compact VSelect dropdown.
- RankedModelCard drops the thumbnail; shows rank number + title + metric as text only.
