# Profile — Coming-Soon Overlay (ASCII Wireframe)

Rendered at route `/u/:username` when the backend is not yet live.
Ghost wireframe uses hardcoded mock data at ~30% opacity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ GHOST WIREFRAME (VOverlay — dimmed 70%, pointer-events: none)              ░
░  [av]  Lorem Ipsum User           42 models  4.8★  12.3k views            ░
░        @lorem · Joined Jan 2025                                            ░
░  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ░
░  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │   ░
░  │ Lorem Model  │  │ Ipsum Shape  │  │ Dolor Solid  │  │ Sit Amet Obj │   ░
░  │ ★★★★★  4.9  │  │ ★★★★☆  4.7  │  │ ★★★★★  4.8  │  │ ★★★★☆  4.6  │   ░
░  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

              ┌─────────────────────────────────────┐
              │  COMING SOON CARD (VCard + VOverlay) │
              │                                     │
              │           👤  (person icon)          │
              │                                     │
              │       Profiles are coming soon      │
              │                                     │
              │  Public profiles require the shared  │
              │  backend — launching soon.           │
              │                                     │
              │         [ ← Back to Home ]          │
              └─────────────────────────────────────┘
```

## Notes

- `PageIcon` uses `mdi-account` for Profile.
- Ghost data uses lorem ipsum names, @handles, and placeholder thumbnails.
- NavBar remains fully interactive above the overlay.
