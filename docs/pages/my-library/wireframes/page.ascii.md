# My Library — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ LIBRARY HEADER (VToolbar)                                                    │
│  My Library (h1)                  Sort: [Newest first ▾]  [ 🗑 Clear All ] │
│                                          (VSelect)           (VBtn danger)  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MODEL GRID (VRow / VCol md=4 lg=3)                                           │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  [img 4:3]   │  │  [img 4:3]   │  │  [img 4:3]   │  │  [img 4:3]   │   │
│  │              │  │              │  │              │  │              │   │
│  │ Spire Model  │  │ Low-poly     │  │ Organic Flow │  │ Space Ship   │   │
│  │ Jan 12, 2026 │  │ Dragon       │  │ Jan 8, 2026  │  │ Jan 5, 2026  │   │
│  │              │  │ Jan 10, 2026 │  │              │  │              │   │
│  │ [⋯ actions▾] │  │ [⋯ actions▾] │  │ [⋯ actions▾] │  │ [⋯ actions▾] │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ← LibraryModelCard (VCard with VMenu actions)                              │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐                                         │
│  │  [img 4:3]   │  │  [img 4:3]   │                                         │
│  │ Castle Walls │  │ Abstract Blob│                                         │
│  │ Jan 3, 2026  │  │ Jan 1, 2026  │                                         │
│  │ [⋯ actions▾] │  │ [⋯ actions▾] │                                         │
│  └──────────────┘  └──────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### LibraryModelCard actions menu (VMenu)

When `[⋯ actions▾]` is clicked, a VMenu dropdown appears:
```
  ┌──────────────────┐
  │ 👁 View          │
  │ ⬇ Download       │
  │ ─────────────    │
  │ 🗑 Delete        │
  └──────────────────┘
```

## State Notes

| State     | Difference from default                                                    |
| --------- | -------------------------------------------------------------------------- |
| `loading` | ModelGrid cards replaced by VSkeletonLoader cards                          |
| `empty`   | ModelGrid replaced by EmptyState (see below); Clear All button hidden      |

### Empty state layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LIBRARY HEADER (VToolbar)                                                    │
│  My Library (h1)                                                            │
│              (no sort selector or Clear All — empty, no controls needed)    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│             EMPTY STATE (VCard — centered)                                  │
│                                                                             │
│                    [📦 illustration]                                         │
│                                                                             │
│               Your library is empty.                                        │
│          Generate your first model to get started.                          │
│                                                                             │
│                  [ ▶ Start Generating ]  (VBtn primary)                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│   About   ·   Settings   ·   GitHub ↗                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Responsive (mobile)

- ModelGrid drops to 2 columns (VCol sm=6).
- LibraryModelCard actions exposed via long-press menu or swipe-to-reveal strip.
