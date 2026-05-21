# About — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph ReadingColumn["Reading Column (max-width 720px, centered)"]
        subgraph AboutHero["AboutHero (heading section)"]
            HeroTitle["About farish"]
            HeroTagline["AI-generated 3D geometry, named for William Farish."]
        end

        subgraph FarishHistory["FarishHistory (VCard)"]
            HistoryHeading["William Farish (1759–1837)"]
            HistoryProse["Prose: formalized isometric projection in 1822…"]
            WikiLink["[Wikipedia ↗]"]
        end

        subgraph HowItWorks["How Generation Works (VCard)"]
            GenerationDiagram["GenerationDiagram\n(Mermaid sequence: User→Prompt→SDK→Tools→Geometry→Viewer)"]
            HowProse["HowItWorksProse\nPlain-language companion text"]
        end

        subgraph PrivacySection["PrivacySection (VCard)"]
            PrivacyHeading["🔒 Your keys stay on your device"]
            PrivacyProse["API key stored in localStorage only.\nNever sent to farish servers."]
            SettingsCTA["[ Connect your key in Settings → ]  (VBtn)"]
        end
    end

    subgraph Footer["Footer"]
        AboutLink["About"]
        SettingsLink["Settings"]
        GithubLink["GitHub ↗"]
    end

    NavBar --> ReadingColumn
    ReadingColumn --> Footer
    SettingsCTA -->|"navigate to /settings"| SettingsPage(("/settings"))
```

## Component Key

| Wireframe Label    | Vuetify 3 Component                              |
| ------------------ | ------------------------------------------------ |
| NavBar             | `VAppBar` + `VBtn`                               |
| AboutHero          | Heading `<section>` or `VCard` (hero variant)    |
| FarishHistory      | `VCard` with text content                        |
| GenerationDiagram  | Mermaid `sequenceDiagram` embedded in `VCard`    |
| HowItWorksProse    | `<p>` text within the same `VCard`               |
| PrivacySection     | `VCard` (type="info" or custom)                  |
| SettingsCTA        | `VBtn` (variant="text" or "outlined")            |
| Footer             | Static `<footer>` with `VBtn` text links         |

## State Impact

Single state only (`default`). No dynamic data — fully static page.
