# Profile — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PROFILE HEADER (VCard — full width banner)                                   │
│                                                                             │
│  ┌──────┐  Alice Maker                           STATS ROW                  │
│  │ [av] │  @alice                                ┌──────────────────────┐  │
│  │ atar │  Joined January 2025                   │ 42     4.8★   12.3k  │  │
│  └──────┘  ← avatar (VAvatar)                    │ models  avg   views  │  │
│                                                  └──────────────────────┘  │
│                                                  ← StatsBadge (VChip×3)    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MODEL GRID (VRow / VCol sm=6 md=4 lg=3)  — user's public models             │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  [img 4:3]   │  │  [img 4:3]   │  │  [img 4:3]   │  │  [img 4:3]   │   │
│  │ Model Title  │  │ Model Title  │  │ Model Title  │  │ Model Title  │   │
│  │ @alice       │  │ @alice       │  │ @alice       │  │ @alice       │   │
│  │ ★★★★★  4.9  │  │ ★★★★☆  4.7  │  │ ★★★★★  4.8  │  │ ★★★★☆  4.6  │   │
│  │ 2.3k 👁      │  │ 1.8k 👁      │  │ 940 👁       │  │ 320 👁       │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ← ModelCard (VCard + VRating)                                              │
│                                                                             │
│                     [ Load More ]  (VBtn)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State        | Differences from `default`                                                |
| ------------ | ------------------------------------------------------------------------- |
| `loading`    | ProfileHeader replaced by skeleton; ModelGrid cards are VSkeletonLoader   |
| `empty`      | ModelGrid replaced by EmptyState: "No shared models yet."                 |
| `error`      | Both sections replaced by "Profile not found" VCard + [ Home ] link       |
| `coming-soon`| See `coming-soon-overlay.ascii.md` — full overlay covers this layout       |

## Responsive (mobile)

- ProfileHeader avatar and stats stack vertically.
- ModelGrid drops to 2 columns (VCol sm=6).
