# Model Detail — Coming-Soon Overlay (ASCII Wireframe)

Triggered when the user clicks Rate or Share before the backend exists.
A `ComingSoonOverlay` (VOverlay) covers the page while staying on the model's route.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ GHOST — blurred ThreeDViewer + InfoPanel (VOverlay 70% dim, no interaction) ░
░                                                                             ░
░  ┌──────────────────────────────────────┐  ┌────────────────────────────┐  ░
░  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │ "A futuristic spaceship…"  │  ░
░  │  ░  3D Viewer (blurred)           ░  │  │ Resolution: High           │  ░
░  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │ Author: @alice · Jan 2026  │  ░
░  │  [⟲] [⛶] [💡]                      │  │ ★★★★☆ 4.7 (83 ratings)    │  ░
░  └──────────────────────────────────────┘  └────────────────────────────┘  ░
░  [ ⬇ Download ] [ 🔖 Save ] [ ★ Rate ] [ ↗ Share ] [ ⚡ Similar ]         ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

              ┌─────────────────────────────────────┐
              │  COMING SOON CARD (VCard + VOverlay) │
              │                                [✕]  │  ← dismiss (VBtn icon)
              │          ⭐  (star icon)             │
              │                                     │
              │    Rating is coming soon            │
              │         — or —                      │
              │    Sharing is coming soon           │
              │                                     │
              │  This feature requires the shared   │
              │  backend — launching soon.           │
              │                                     │
              │  [ ✕ Continue viewing ]  (VBtn text)│
              └─────────────────────────────────────┘
```

## Notes

- This overlay is triggered per-action (Rate or Share click), not at page load.
- **Dismissible** — unlike the full-page coming-soon on Explore/Leaderboards/Profile,
  this overlay has a ✕ close button so users can return to viewing the model.
- `PageIcon` uses `mdi-star` for Rating; `mdi-share-variant` for Sharing.
- Headline changes based on which action triggered it.
- NavBar remains fully functional above the overlay.
- Unlike Explore/Leaderboards/Profile, this page ships functional (viewer works);
  only the social actions are backend-gated.
