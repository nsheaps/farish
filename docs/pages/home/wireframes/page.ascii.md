# Home — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  HERO SECTION (VCard / full-width section)                                  │
│                                                                             │
│          ╔═══════════════════════════════════════════╗                      │
│          ║  AI-generated 3D models, instantly.       ║                      │
│          ║                                           ║                      │
│          ║  farish turns your words into interactive ║                      │
│          ║  3D geometry — no modelling skills needed.║                      │
│          ║                                           ║                      │
│          ║         [ ▶  Start Generating ]           ║  ← GenerateCTA (VBtn primary)
│          ║                                           ║                      │
│          ║    Explore community →   Leaderboards →   ║  ← secondary links   │
│          ╚═══════════════════════════════════════════╝                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRENDING STRIP (VRow — horizontally scrollable)                              │
│  Trending models ─────────────────────────────────────────────── → scroll  │
│                                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐ │
│  │ [img 16:9]│  │ [img 16:9]│  │ [img 16:9]│  │ [img 16:9]│  │[img 16:9]│ │
│  │           │  │           │  │           │  │           │  │          │ │
│  │ Model A   │  │ Model B   │  │ Model C   │  │ Model D   │  │ Model E  │ │
│  │ @alice    │  │ @bob      │  │ @carol    │  │ @dan      │  │ @eve     │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  └──────────┘ │
│  ← ModelCard (VCard)                                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│   About   ·   Settings   ·   GitHub ↗                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State     | Difference from default                                             |
| --------- | ------------------------------------------------------------------- |
| `loading`   | TrendingStrip shows 5× VSkeletonLoader cards instead of ModelCards |
| `degraded`  | TrendingStrip section hidden entirely; Hero section unchanged       |

## Responsive (mobile)

- NavBar collapses links into `[≡]` hamburger → VNavigationDrawer slide-in.
- HeroSection copy stacks vertically; CTA button spans full width.
- TrendingStrip becomes a 2-column VRow/VCol card grid instead of a scroll row.
