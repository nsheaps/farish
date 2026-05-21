# Explore — Coming-Soon Overlay (ASCII Wireframe)

Rendered at route `/explore` when the backend is not yet live.
The ghost wireframe beneath the overlay uses mock data at ~30% opacity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ GHOST WIREFRAME (VOverlay — dimmed 70%, pointer-events: none)              ░
░  [🔍  Search...   ]   Sort: [Newest ▾]   [× geometric]                     ░
░  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                   ░
░  │░░░░░░░░░░│  │░░░░░░░░░░│  │░░░░░░░░░░│  │░░░░░░░░░░│                   ░
░  │ Lorem    │  │ Ipsum    │  │ Dolor    │  │ Sit Amet │                   ░
░  │ @user1   │  │ @user2   │  │ @user3   │  │ @user4   │                   ░
░  │ ★★★★☆   │  │ ★★★☆☆   │  │ ★★★★★   │  │ ★★★☆☆   │                   ░
░  └──────────┘  └──────────┘  └──────────┘  └──────────┘                   ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

              ┌─────────────────────────────────────┐
              │  COMING SOON CARD (VCard + VOverlay) │
              │                                     │
              │           🖼  (gallery icon)         │
              │                                     │
              │        Explore is coming soon       │
              │                                     │
              │  The community gallery requires the  │
              │  shared backend — launching soon.    │
              │                                     │
              │         [ ← Back to Home ]          │
              │           (VBtn, secondary)         │
              └─────────────────────────────────────┘
```

## Notes

- `GhostWireframe` uses `VOverlay` with `opacity: 0.3` and `filter: blur(1px)`.
- `ComingSoonCard` is centered using Vuetify's `d-flex justify-center align-center`.
- `PageIcon` uses a gallery icon (`mdi-image-multiple`) for Explore.
- NavBar remains fully functional above the overlay.
