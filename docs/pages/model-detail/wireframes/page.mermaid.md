# Model Detail — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph PageBody["Page Body (VRow — 2 columns)"]
        subgraph ViewerCol["Left Column — ~65% (VCol cols=8)"]
            ThreeDViewer["ThreeDViewer\n(custom WebGL canvas in VCard)"]
            ViewerControls["ViewerControls\n[⟲ Reset] [⛶ Fullscreen] [💡 Lights]\n(VBtn overlaid on viewer)"]
            ActionBar["ActionBar (VToolbar)\n[ ⬇ Download ] [ 🔖 Save ] [ ★ Rate ]\n[ ↗ Share ]  [ ⚡ Generate Similar ]"]
        end

        subgraph InfoCol["Right Column — ~35% (VCol cols=4)"]
            PromptDisplay["PromptDisplay\n'A futuristic spaceship…'\n(VCard, read-only)"]
            ParamsDisplay["ParamsDisplay\n▼ Generation Parameters\nResolution · Style · Complexity\n(VExpansionPanel)"]
            MetadataPanel["MetadataPanel (VCard)\nAuthor · Created · Views · Avg Rating"]
            AuthorChip["AuthorChip\n@alice → /u/alice\n(VChip with avatar)"]
        end
    end

    subgraph Footer["Footer"]
        AboutLink["About"]
        SettingsLink["Settings"]
        GithubLink["GitHub ↗"]
    end

    NavBar --> PageBody
    PageBody --> Footer
    ThreeDViewer --- ViewerControls
    ViewerControls --> ActionBar
    MetadataPanel --- AuthorChip

    ActionBar -->|"Download"| Download(("browser download"))
    ActionBar -->|"Save to Library"| LibPage(("/library"))
    ActionBar -->|"Rate (backend-gated)"| ComingSoon(("ComingSoonOverlay"))
    ActionBar -->|"Share (backend-gated)"| ComingSoon
    ActionBar -->|"Generate Similar → /generate?prompt=…"| GenPage(("/generate"))
    AuthorChip -->|"click → /u/:username"| ProfilePage(("/u/:username"))
```

## Component Key

| Wireframe Label   | Vuetify 3 Component                                        |
| ----------------- | ---------------------------------------------------------- |
| NavBar            | `VAppBar` + `VBtn`                                         |
| ThreeDViewer      | Custom WebGL canvas in `VCard`                             |
| ViewerControls    | `VBtn` group overlaid on viewer (absolute positioning)     |
| PromptDisplay     | `VCard` (read-only text content)                           |
| ParamsDisplay     | `VExpansionPanel` / `VExpansionPanels`                     |
| MetadataPanel     | `VCard` with `VListItem` rows                              |
| AuthorChip        | `VChip` (with avatar + name)                               |
| ActionBar         | `VToolbar` + `VBtn` group                                  |
| RatingWidget      | `VRating` (5-star input, backend-gated)                    |
| Footer            | Static `<footer>` with `VBtn` text links                   |

## State Impact

- **`loading`**: `ThreeDViewer` and `InfoCol` replaced by `VSkeletonLoader`.
- **`local`**: Model loaded from browser storage; no remote fetch; Rate/Share hidden.
- **`error`**: Both columns replaced by error `VCard` with Back and Retry `VBtn`.
- **`coming-soon`**: Dismissible `VOverlay` with `ComingSoonCard` covers the page when Rate/Share clicked; ✕ button returns user to model view.
