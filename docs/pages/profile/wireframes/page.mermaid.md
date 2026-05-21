# Profile — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph ProfileHeader["ProfileHeader (VCard — full-width banner)"]
        Avatar["[avatar image]  (VAvatar)"]
        DisplayName["Alice Maker"]
        Username["@alice"]
        JoinDate["Joined January 2025"]
        subgraph StatsRow["Stats Row"]
            ModelCount["42 models  (StatsBadge / VChip)"]
            AvgRating["4.8★ avg  (StatsBadge / VChip)"]
            TotalViews["12.3k views  (StatsBadge / VChip)"]
        end
    end

    subgraph ModelGrid["ModelGrid (VRow / VCol sm=6 md=4 lg=3)"]
        Card1["ModelCard 1\n[img]\nModel Title · @alice\n★★★★★ 4.9 · 2.3k 👁\n(VCard + VRating)"]
        Card2["ModelCard 2\n[img]\nModel Title · @alice\n★★★★☆ 4.7 · 1.8k 👁"]
        Card3["ModelCard 3\n[img]\nModel Title · @alice\n★★★★★ 4.8 · 940 👁"]
        CardN["...more cards...  (paginated)"]
        LoadMore["[ Load More ]  (VBtn)"]
    end

    subgraph EmptyState_node["EmptyState (VCard — when user has no shared models)"]
        EmptyMsg["No shared models yet."]
    end

    NavBar --> ProfileHeader --> ModelGrid
    ProfileHeader -. zero models .-> EmptyState_node
    Card1 & Card2 & Card3 & CardN -->|"click → /m/:modelId"| DetailPage(("/m/:modelId"))
```

## Component Key

| Wireframe Label   | Vuetify 3 Component                                    |
| ----------------- | ------------------------------------------------------ |
| NavBar            | `VAppBar` + `VBtn`                                     |
| ProfileHeader     | `VCard` (full-width, banner style)                     |
| Avatar            | `VAvatar`                                              |
| StatsBadge        | `VChip` (non-clickable, informational)                 |
| ModelGrid         | `VRow` / `VCol` (cols="12" sm="6" md="4" lg="3")      |
| ModelCard         | `VCard` + `VRating`                                    |
| EmptyState        | `VCard` (centered text)                                |
| LoadMore          | `VBtn` (variant="text")                                |

## State Impact

- **`coming-soon`**: Full-page `VOverlay` with ghost cards behind `ComingSoonCard`; see `coming-soon-overlay.ascii.md`.
- **`loading`**: `ProfileHeader` and ModelGrid replaced by `VSkeletonLoader`.
- **`empty`**: ModelGrid replaced by `EmptyState`.
- **`error`**: Page content replaced by "Profile not found" `VCard` + Home `VBtn`.
