# Generate — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph NoKeyBanner_node["NoKeyBanner (VAlert — warning, no-key state only)"]
        BannerText["⚠ No API key connected.  [ Connect your key → ]"]
    end

    subgraph Workspace["Generation Workspace"]
        subgraph LeftPanel["ParametersPanel (VNavigationDrawer, ~280px)"]
            ResSlider["Resolution  [Low ●──── High]  (VSlider)"]
            StyleSelect["Artistic Style  [Realistic ▾]  (VSelect)"]
            ComplexSlider["Complexity  [Low ●──── High]  (VSlider)"]
        end

        subgraph Center["Center Column"]
            PromptBar["PromptBar\n[Describe your model…]  (VTextarea)\n[ ▶ Generate ]  (VBtn primary)"]

            subgraph StreamArea["Stream + Preview Area"]
                GenerationStream["GenerationStream\n▓▓▓▓▓░ 60%\n› Parsing prompt…\n› Generating geometry…\n(VList, streaming)"]
                ModelPreview["ModelPreview\n[3D canvas — live]\n(ThreeDViewer — custom WebGL)"]
            end

            subgraph ClarificationArea["ClarificationDialog (specifying state)"]
                ClarifyQ["Q1: Scale? Q2: Interior? Q3: Style?\n( ) choices + [___text field___]\n[ Continue → ]  (VBtn)"]
            end

            subgraph ResultActions_node["ResultActions (VToolbar — complete state)"]
                DownloadBtn["[ ⬇ Download ]"]
                SaveBtn["[ 🔖 Save to Library ]"]
                ShareBtn["[ ↗ Share ]"]
                NewBtn["[ 🔄 New ]"]
            end

            ErrorPanel_node["ErrorPanel\n(VCard) error detail\n[ Retry ]  (VBtn)"]
        end
    end

    NavBar --> NoKeyBanner_node
    NavBar --> Workspace
    LeftPanel --> Center
    PromptBar -->|"submit → generating"| GenerationStream
    PromptBar -->|"submit → specifying"| ClarificationArea
    ClarificationArea -->|"continue → generating"| GenerationStream
    GenerationStream -->|"complete"| ResultActions_node
    ResultActions_node -->|"Save"| LibPage(("/library"))
    ResultActions_node -->|"Share (backend-gated)"| ComingSoon(("ComingSoon overlay"))
```

## Component Key

| Wireframe Label     | Vuetify 3 Component                                      |
| ------------------- | -------------------------------------------------------- |
| NavBar              | `VAppBar` + `VBtn`                                       |
| NoKeyBanner         | `VAlert` (type="warning")                               |
| PromptBar           | `VTextarea` + `VBtn`                                     |
| ParametersPanel     | `VNavigationDrawer` (secondary, collapsible)             |
| ResSlider           | `VSlider`                                                |
| StyleSelect         | `VSelect`                                                |
| GenerationStream    | `VList` + `VListItem` (streaming, auto-scroll)           |
| ModelPreview        | Custom WebGL canvas in `VCard`                           |
| ClarificationDialog | Inline `VCard` / `VDialog` with radio inputs + text      |
| ResultActions       | `VToolbar` + `VBtn` group                                |
| ErrorPanel          | `VCard` (variant="outlined", color="error") + `VBtn`     |

## State Impact

- **`no-key`**: `NoKeyBanner` visible; Generate `VBtn` disabled.
- **`specifying`**: `ClarificationArea` visible; `StreamArea` hidden; `PromptBar` locked.
- **`generating`**: `StreamArea` visible with live updates; Cancel `VBtn` shown; `ResultActions` hidden.
- **`complete`**: `ModelPreview` shows final model; `ResultActions` visible.
- **`error`**: `ErrorPanel` replaces `StreamArea`; `ResultActions` hidden.
