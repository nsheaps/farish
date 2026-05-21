# Coming Soon — ASCII Wireframe (Desktop, default state)

Rendered at `/coming-soon` as a fallback route, or as an in-page overlay at
the backend-dependent page's own route (Explore, Leaderboards, Profile).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ GHOST WIREFRAME (VOverlay — dimmed 70%, blur, pointer-events: none)        ░
░                                                                             ░
░  Generic target page layout rendered with lorem ipsum mock data:           ░
░                                                                             ░
░  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ░
░  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │  │ ░░░░░░░░░░░░ │   ░
░  │ Lorem Ipsum  │  │ Dolor Sit    │  │ Amet Consect │  │ Adipiscing   │   ░
░  │ @user1       │  │ @user2       │  │ @user3       │  │ @user4       │   ░
░  │ ★★★★☆  4.7  │  │ ★★★☆☆  3.9  │  │ ★★★★★  4.9  │  │ ★★★★☆  4.3  │   ░
░  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   ░
░                                                                             ░
░  [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

              ┌─────────────────────────────────────┐
              │  COMING SOON CARD (VCard + VOverlay) │
              │                                     │
              │         🚀  (PageIcon)               │
              │                                     │
              │     {Page Title} is coming soon     │
              │                                     │
              │  This feature requires the shared   │
              │  backend — launching soon.           │
              │                                     │
              │         [ ← Back to Home ]          │
              │         (HomeButton — VBtn)          │
              └─────────────────────────────────────┘
```

## Component Breakdown

- **GhostWireframe** — rendered at 30 % opacity with CSS `filter: blur(1px)`.
  Uses hardcoded mock ModelCard data (lorem ipsum titles, placeholder
  thumbnail images). Pointer events disabled so users cannot interact.
- **ComingSoonCard** — centered `VCard` (max-width 480px) with:
  - `PageIcon` — contextual icon: 🖼 gallery (Explore), 🏆 trophy (Leaderboards),
    👤 person (Profile), 🚀 rocket (generic fallback).
  - Headline: `{targetPageName} is coming soon`
  - Note: one-sentence explanation referencing the shared backend.
  - `HomeButton` — `VBtn` (variant="outlined") linking to `/`.
- **VOverlay** — wraps the entire page below the NavBar; `opacity: 0.3` on
  the ghost content; not dismissible.

## State Notes

| State     | Trigger    | Renders              |
| --------- | ---------- | -------------------- |
| `default` | Page loads | Ghost + overlay card (single state only) |

## Responsive (mobile)

- ComingSoonCard occupies most of the viewport width (max-width: 90vw).
- Ghost wireframe has lower opacity or is replaced by a solid dimmed background.
