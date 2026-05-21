# Leaderboards — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph BoardTabs["BoardTabs (VTabs)"]
        TabBestRated["Best Rated"]
        TabMostRated["Most Rated"]
        TabMostViewed["Most Viewed"]
    end

    subgraph TimeBucket["TimeBucketSelector (VBtnToggle)"]
        Btn1W["[ 1W ]"]
        Btn1M["[ 1M ]"]
        Btn1Y["[ 1Y ]"]
        BtnAll["[ All ]"]
    end

    subgraph RankedList["RankedList (VList)"]
        Entry1["#1  [img]  Crystalline Spire  @alice  ★★★★★ 4.95\n(VListItem)"]
        Entry2["#2  [img]  Neon Octahedron    @bob    ★★★★★ 4.91\n(VListItem)"]
        Entry3["#3  [img]  Organic Flow       @carol  ★★★★☆ 4.87\n(VListItem)"]
        EntryN["...  (up to #50)\n(VListItem × N)"]
    end

    subgraph EmptyState_note["EmptyState (shown when no models qualify)"]
        EmptyMsg["No models ranked yet for this period."]
    end

    NavBar --> BoardTabs --> TimeBucket --> RankedList

    Entry1 & Entry2 & Entry3 & EntryN -->|"click → /m/:modelId"| DetailPage(("/m/:modelId"))
    TabBestRated & TabMostRated & TabMostViewed -->|"update ?board= param"| TimeBucket
    Btn1W & Btn1M & Btn1Y & BtnAll -->|"update ?period= param"| RankedList
```

## Component Key

| Wireframe Label       | Vuetify 3 Component                             |
| --------------------- | ----------------------------------------------- |
| NavBar                | `VAppBar` + `VBtn`                              |
| BoardTabs             | `VTabs` + `VTab`                                |
| TimeBucketSelector    | `VBtnToggle` (or `VTabs` secondary row)         |
| RankedList            | `VList` + `VListItem`                           |
| RankedModelCard       | `VListItem` with avatar, title, subtitle slots  |
| EmptyState            | `VCard` with centered text                      |

## State Impact

- **`coming-soon`**: Full-page `VOverlay` with ghost list behind `ComingSoonCard`; see `coming-soon-overlay.ascii.md`.
- **`loading`**: RankedList items replaced by `VSkeletonLoader` list items.
- **`empty`**: RankedList replaced by `EmptyState`.
- **`error`**: RankedList replaced by inline error `VCard` + Retry `VBtn`.
- **Board/bucket change**: Updates `?board=` and `?period=` URL params; triggers re-fetch and re-render of RankedList.
