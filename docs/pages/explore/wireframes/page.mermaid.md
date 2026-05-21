# Explore — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph SearchRow["Search Row"]
        SearchBar["SearchBar\n[🔍 Search models...]  (VTextField)"]
    end

    subgraph ControlsRow["Controls Row"]
        SortSelector["Sort: [Newest ▾]  (VSelect)"]
        FilterChips["Active filters: [× geometric] [× abstract]  (VChipGroup)"]
    end

    subgraph Body["Page Body"]
        subgraph FilterPanel["FilterPanel (VNavigationDrawer)"]
            CategoryFilters["Categories\n[x] Geometric  [x] Abstract\n[ ] Organic  [ ] Architectural"]
            StyleFilters["Style\n( ) Realistic  ( ) Stylized\n( ) Low-poly"]
            ApplyBtn["[ Apply ]  (VBtn)"]
        end

        subgraph MainContent["Main Content"]
            ModelGrid["ModelGrid (VRow / VCol)\n4 columns × N rows of ModelCard"]
            LoadMore["[ Load More ]  (VBtn)"]
        end
    end

    subgraph EmptyState_note["EmptyState (VCard — shown when gallery is empty)"]
        EmptyIllustration["Illustration"]
        EmptyText["No models yet"]
    end

    subgraph NoResults_note["NoResultsState (VCard — shown on zero-match search)"]
        NoResultsText["No matches for '{query}'"]
        ClearSearch["[ Clear Search ]  (VBtn)"]
    end

    NavBar --> SearchRow --> ControlsRow --> Body
    FilterPanel --> MainContent
    MainContent --> LoadMore
```

## Component Key

| Wireframe Label    | Vuetify 3 Component                                          |
| ------------------ | ------------------------------------------------------------ |
| NavBar             | `VAppBar` + `VBtn`                                           |
| SearchBar          | `VTextField` with `append-inner-icon="mdi-magnify"`          |
| SortSelector       | `VSelect`                                                    |
| FilterChips        | `VChip` + `VChipGroup` (closable chips)                      |
| FilterPanel        | `VNavigationDrawer` (permanent on desktop, bottom on mobile) |
| ModelGrid          | `VRow` / `VCol` (cols="12" sm="6" md="4" lg="3")            |
| ModelCard          | `VCard` + `VRating`                                          |
| EmptyState         | `VCard` with centered illustration slot                      |
| NoResultsState     | `VCard` with text + `VBtn`                                   |
| LoadMore           | `VBtn` (variant="text" or "outlined")                        |

## State Impact

- **`coming-soon`**: Full-page `VOverlay` with ghost wireframe behind `ComingSoonCard`; see `coming-soon-overlay.ascii.md`.
- **`loading`**: ModelGrid cards replaced by `VSkeletonLoader`.
- **`empty`**: Body content replaced by `EmptyState`.
- **`no-results`**: ModelGrid replaced by `NoResultsState`.
- **`error`**: ModelGrid replaced by inline error `VCard` + Retry `VBtn`.
