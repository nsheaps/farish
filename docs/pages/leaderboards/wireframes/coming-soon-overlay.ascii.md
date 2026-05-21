# Leaderboards — Coming-Soon Overlay (ASCII Wireframe)

Rendered at route `/leaderboards` when the backend is not yet live.
Ghost wireframe uses hardcoded mock data at ~30% opacity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░ GHOST WIREFRAME (VOverlay — dimmed 70%, pointer-events: none)              ░
░  [ Best Rated ] [ Most Rated ] [ Most Viewed ]   [ 1W ][ 1M ][ 1Y ][ All ] ░
░  ─────────────────────────────────────────────────────────────────────────  ░
░   #1  [░░░] Lorem Ipsum Model          @user1    ★★★★★  4.95              ░
░   #2  [░░░] Dolor Sit Amet Shape       @user2    ★★★★★  4.91              ░
░   #3  [░░░] Consectetur Adipiscing     @user3    ★★★★☆  4.87              ░
░   #4  [░░░] Sed Do Eiusmod Tempor      @user4    ★★★★☆  4.82              ░
░   #5  [░░░] Incididunt Labore Dolore   @user5    ★★★★☆  4.79              ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

              ┌─────────────────────────────────────┐
              │  COMING SOON CARD (VCard + VOverlay) │
              │                                     │
              │           🏆  (trophy icon)          │
              │                                     │
              │     Leaderboards are coming soon    │
              │                                     │
              │  Rankings require the shared backend │
              │  — launching soon.                  │
              │                                     │
              │         [ ← Back to Home ]          │
              └─────────────────────────────────────┘
```

## Notes

- `PageIcon` uses `mdi-trophy` for Leaderboards.
- Ghost data is hardcoded (lorem ipsum titles, placeholder author handles).
- NavBar remains fully interactive above the overlay.
