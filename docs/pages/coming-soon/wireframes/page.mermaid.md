# Coming Soon — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph PageBody["Page Body (below NavBar)"]
        subgraph GhostWireframe["GhostWireframe (VOverlay — 30% opacity, blur)"]
            GhostCards["Mock ModelCards × 4\n[░░░] Lorem Ipsum · @user · ★★★★☆\n(hardcoded static data — pointer-events none)"]
            GhostRow2["[░░░░░░░░░░░░░░░░░░░░░░░░░░░░] (placeholder row)"]
        end

        subgraph ComingSoonOverlay["ComingSoonCard (VCard — centered over ghost)"]
            PageIcon["PageIcon\n🚀 (rocket) / 🖼 (gallery) / 🏆 (trophy) / 👤 (person)"]
            Headline["{targetPageName} is coming soon"]
            Note["This feature requires the shared backend — launching soon."]
            HomeButton["[ ← Back to Home ]  (VBtn outlined)"]
        end
    end

    NavBar --> PageBody
    GhostWireframe --- ComingSoonOverlay
    HomeButton -->|"navigate to /"| HomePage(("/"))
```

## Component Key

| Wireframe Label    | Vuetify 3 Component                                               |
| ------------------ | ----------------------------------------------------------------- |
| NavBar             | `VAppBar` + `VBtn`                                                |
| GhostWireframe     | `VOverlay` (opacity 0.3, pointer-events none) wrapping mock cards |
| GhostCards         | `VCard` (same as ModelCard, hardcoded mock data)                  |
| ComingSoonCard     | `VCard` (max-width 480px, elevation 8)                            |
| PageIcon           | `VIcon` (`mdi-rocket`, `mdi-image-multiple`, `mdi-trophy`, `mdi-account`) |
| HomeButton         | `VBtn` (variant="outlined")                                       |

## State Impact

Single state only (`default`). `targetPageName` is passed as a route param or
component prop to customise the headline and icon.
