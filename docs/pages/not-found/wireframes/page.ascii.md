# Not Found (404) — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

                                                                              
                    ┌─────────────────────────────────────┐                   
                    │                                     │                   
                    │  NOT FOUND ILLUSTRATION             │                   
                    │  (isometric/geometric SVG graphic)  │                   
                    │                                     │                   
                    │  ┌───────────────────────────────┐  │                   
                    │  │  ╔═══╗                        │  │                   
                    │  │  ║404║  (isometric numeral)   │  │                   
                    │  │  ╚═══╝                        │  │                   
                    │  │   ╱╲  ╱╲  ╱╲  (3D cubes)     │  │                   
                    │  │  ╱  ╲╱  ╲╱  ╲                │  │                   
                    │  └───────────────────────────────┘  │                   
                    │                                     │                   
                    │  Page not found                     │                   
                    │  ← NotFoundHeadline (VCard heading) │                   
                    │                                     │                   
                    │  We couldn't find `/bad/path`.      │                   
                    │  The page may have moved or the     │                   
                    │  URL may be incorrect.              │                   
                    │  ← NotFoundMessage                  │                   
                    │                                     │                   
                    │      [ ← Back to Home ]             │                   
                    │      (HomeButton — VBtn primary)    │                   
                    │                                     │                   
                    │  or  Try searching in Explore →     │                   
                    │      (ExploreLink — VBtn text)      │                   
                    │                                     │                   
                    └─────────────────────────────────────┘                   
                                                                              
```

## State Notes

| State     | Trigger               | Renders              |
| --------- | --------------------- | -------------------- |
| `default` | Unknown route matched | Full 404 content (single state only) |

## Responsive (mobile)

- Illustration scales down to fit the viewport width.
- HomeButton and ExploreLink go full-width.
- Content is vertically centered in the viewport.
