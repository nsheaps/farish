# Home — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish logo]"]
        NavGenerate["Generate"]
        NavExplore["Explore"]
        NavLeaderboards["Leaderboards"]
        NavLibrary["Library"]
        NavSettings["⚙ Settings icon"]
    end

    subgraph HeroSection["HeroSection (VCard / full-width)"]
        Headline["AI-generated 3D models, instantly."]
        Tagline["farish turns your words into interactive 3D geometry"]
        GenerateCTA["[ ▶ Start Generating ]  (VBtn, primary)"]
        SecondaryLinks["Explore community →   Leaderboards →"]
    end

    subgraph TrendingStrip["TrendingStrip (VRow — scrollable)"]
        Card1["ModelCard 1\n[img]\nModel A · @alice\n(VCard)"]
        Card2["ModelCard 2\n[img]\nModel B · @bob\n(VCard)"]
        Card3["ModelCard 3\n[img]\nModel C · @carol\n(VCard)"]
        Card4["ModelCard 4\n[img]\nModel D · @dan\n(VCard)"]
        Card5["ModelCard 5\n[img]\nModel E · @eve\n(VCard)"]
    end

    subgraph Footer["Footer"]
        AboutLink["About"]
        SettingsLink["Settings"]
        GithubLink["GitHub ↗"]
    end

    NavBar --> HeroSection
    HeroSection --> TrendingStrip
    TrendingStrip --> Footer

    GenerateCTA -->|"navigate to /generate"| GenPage(("/generate"))
    SecondaryLinks -->|"navigate to /explore"| ExpPage(("/explore"))
    Card1 & Card2 & Card3 & Card4 & Card5 -->|"navigate to /m/:modelId"| DetailPage(("/m/:modelId"))
```

## Component Key

| Wireframe Label   | Vuetify 3 Component                      |
| ----------------- | ---------------------------------------- |
| NavBar            | `VAppBar` + `VBtn`                       |
| HeroSection       | Full-width `VCard` or plain `<section>`  |
| GenerateCTA       | `VBtn` (variant="elevated", color="primary") |
| TrendingStrip     | `VRow` (overflow-x scroll)               |
| ModelCard         | `VCard` (with thumbnail slot)            |
| Footer            | Static `<footer>` with `VBtn` text links |

## State Impact

- **`loading`**: TrendingStrip cards replaced by `VSkeletonLoader` components.
- **`degraded`**: TrendingStrip subgraph removed from the diagram; Hero and Footer remain.
