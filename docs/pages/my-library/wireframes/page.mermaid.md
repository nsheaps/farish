# My Library — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph LibraryHeader["LibraryHeader (VToolbar)"]
        Title["My Library  (h1)"]
        SortSelect["Sort: [Newest first ▾]  (VSelect)"]
        ClearAllBtn["[ 🗑 Clear All ]  (VBtn, danger)"]
    end

    subgraph ModelGrid["ModelGrid (VRow / VCol md=4 lg=3)"]
        Card1["LibraryModelCard 1\n[img]\nSpire Model\nJan 12, 2026\n[⋯ actions▾]\n(VCard + VMenu)"]
        Card2["LibraryModelCard 2\n[img]\nLow-poly Dragon\nJan 10, 2026\n[⋯ actions▾]"]
        Card3["LibraryModelCard 3\n[img]\nOrganic Flow\nJan 8, 2026\n[⋯ actions▾]"]
        CardN["...more cards..."]
    end

    subgraph EmptyState_node["EmptyState (VCard — when library is empty)"]
        EmptyIllustration["[📦 illustration]"]
        EmptyText["Your library is empty.\nGenerate your first model to get started."]
        EmptyCTA["[ ▶ Start Generating ]  (VBtn primary)"]
    end

    subgraph DeleteDialog["DeleteConfirmDialog (VDialog — triggered on Delete action)"]
        DeleteMsg["🗑 Delete 'Spire Model'?\nThis will permanently remove the model."]
        CancelBtn["[ Cancel ]  (VBtn outlined)"]
        ConfirmDeleteBtn["[ Delete ]  (VBtn danger)"]
    end

    NavBar --> LibraryHeader --> ModelGrid
    LibraryHeader -. empty library .-> EmptyState_node
    Card1 & Card2 & Card3 -->|"click → /m/local:<id>"| DetailPage(("/m/local:<id>"))
    Card1 & Card2 & Card3 -->|"Delete → confirms"| DeleteDialog
    EmptyCTA -->|"navigate to /generate"| GenPage(("/generate"))
```

## Component Key

| Wireframe Label        | Vuetify 3 Component                                     |
| ---------------------- | ------------------------------------------------------- |
| NavBar                 | `VAppBar` + `VBtn`                                      |
| LibraryHeader          | `VToolbar` with title, `VSelect`, `VBtn`                |
| ModelGrid              | `VRow` / `VCol` (cols="12" sm="6" md="4" lg="3")       |
| LibraryModelCard       | `VCard` with thumbnail, title, date, `VMenu`            |
| EmptyState             | `VCard` (centered illustration + `VBtn`)                |
| DeleteConfirmDialog    | `VDialog` (width=400, non-persistent)                   |
| SortSelect             | `VSelect`                                               |
| ClearAllBtn            | `VBtn` (color="error")                                  |

## State Impact

- **`loading`**: ModelGrid replaced by `VSkeletonLoader` cards.
- **`empty`**: `LibraryHeader` shown without ClearAll/Sort; `ModelGrid` replaced by `EmptyState`.
- **Delete action**: `DeleteConfirmDialog` (VDialog) opens; on confirm, card removed; last card → switches to `empty` state.
