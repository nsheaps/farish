# Not Found (404) — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph CenteredCard["Centered Content (d-flex justify-center align-center)"]
        NotFoundIllustration["NotFoundIllustration\n[isometric 404 SVG graphic]\nGeometric cubes + numeral 404\n(VCard / <figure>)"]
        NotFoundHeadline["Page not found\n(h1 / VCard title)"]
        NotFoundMessage["We couldn't find '{path}'.\nThe page may have moved or the URL may be incorrect.\n(VCard subtitle text)"]
        HomeButton["[ ← Back to Home ]  (VBtn primary)"]
        ExploreLink["Try searching in Explore →  (VBtn text)"]
    end

    NavBar --> CenteredCard
    HomeButton -->|"navigate to /"| HomePage(("/"))
    ExploreLink -->|"navigate to /explore"| ExplorePage(("/explore"))
```

## Component Key

| Wireframe Label        | Vuetify 3 Component                                     |
| ---------------------- | ------------------------------------------------------- |
| NavBar                 | `VAppBar` + `VBtn`                                      |
| NotFoundIllustration   | Custom SVG in `<figure>` or `VCard` image slot          |
| NotFoundHeadline       | `<h1>` styled with Vuetify typography classes           |
| NotFoundMessage        | `<p>` text; `{path}` read from Vue Router `$route.path` |
| HomeButton             | `VBtn` (variant="elevated", color="primary")            |
| ExploreLink            | `VBtn` (variant="text")                                 |

## State Impact

Single state only (`default`). The attempted path (`{path}`) is read from
`$route.path` and displayed in `NotFoundMessage` — no storage or API calls.
