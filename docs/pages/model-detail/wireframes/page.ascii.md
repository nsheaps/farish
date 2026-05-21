# Model Detail — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────┬──────────────────────────────┐
│  3D VIEWER AREA (~65% width)                 │  INFO PANEL (~35% width)     │
│                                              │  (VNavigationDrawer right)   │
│  ┌────────────────────────────────────────┐  │                              │
│  │                                        │  │  PROMPT DISPLAY (VCard)      │
│  │  THREE D VIEWER                        │  │  ┌─────────────────────────┐ │
│  │  (custom WebGL canvas in VCard)        │  │  │ "A futuristic spaceship  │ │
│  │                                        │  │  │  with glowing engines,   │ │
│  │  [3D geometry renders here]            │  │  │  low-poly style"         │ │
│  │  orbit / pan / zoom interactive        │  │  └─────────────────────────┘ │
│  │                                        │  │                              │
│  │                                        │  │  PARAMS DISPLAY (VExpPanel)  │
│  │  [⟲ Reset] [⛶ Fullscreen] [💡 Lights] │  │  ▼ Generation Parameters     │
│  │  ← ViewerControls (VBtn overlaid)      │  │    Resolution: High          │
│  └────────────────────────────────────────┘  │    Style: Low-poly           │
│                                              │    Complexity: Medium        │
│  ACTION BAR (VToolbar)                       │                              │
│  [ ⬇ Download ] [ 🔖 Save ] [ ★ Rate ]       │  METADATA PANEL (VCard)      │
│  [ ↗ Share ]    [ ⚡ Generate Similar ]       │  Author: @alice (AuthorChip) │
│  ← ResultActions (VBtn group)                │  Created: Jan 12, 2026       │
│                                              │  Views: 1,240 👁             │
│                                              │  Rating: ★★★★☆  4.7 (83)   │
│                                              │  ← MetadataPanel (VCard)     │
└──────────────────────────────────────────────┴──────────────────────────────┘
```

## State Notes

| State        | Differences from `default`                                                   |
| ------------ | ---------------------------------------------------------------------------- |
| `local`      | Source is browser storage; no remote fetch; social actions hidden             |
| `loading`    | VSkeletonLoader over viewer area; shimmer on InfoPanel                        |
| `error`      | "Model not found" VCard with [ ← Back ] and [ Retry ] buttons; viewer hidden  |
| `coming-soon`| Rate or Share clicked → ComingSoonOverlay (VOverlay) covers viewer + panel    |

## Coming-Soon inline overlay (Rate / Share clicked)

When the user clicks Rate or Share before the backend exists, a `ComingSoonOverlay`
(VOverlay from `../coming-soon/SPEC.md`) renders over the full page content:

```
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
          ░  (blurred viewer + info panel behind)  ░
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                 ┌───────────────────────────┐
                 │  ⭐  Rating is coming soon │
                 │                           │
                 │  This feature needs the   │
                 │  shared backend.           │
                 │                           │
                 │     [ ← Back to Home ]    │
                 └───────────────────────────┘
```

## Responsive (mobile)

- ThreeDViewer goes full-width at top.
- InfoPanel and ActionBar collapse into VExpansionPanel accordion sections below.
- Sticky Download VBtn pinned to bottom of screen.
