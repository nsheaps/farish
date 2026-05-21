# Generate — Clarification Dialog (ASCII Wireframe)

Shown inline in the generation workspace when the AI determines the prompt is
underspecified. Replaces the stream/preview area. PromptBar is locked.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────────────────┐
│ PARAMETERS PANEL │  PROMPT BAR (locked — VTextarea disabled)                │
│ (unchanged)      │  ┌───────────────────────────────────────────────┐      │
│                  │  │ A futuristic spaceship (locked, grey out)      │      │
│ Resolution       │  └───────────────────────────────────────────────┘      │
│ [Low ○──●── High]│                 [ ▶ Generate ] (disabled)               │
│                  │                                                          │
│ Style            │  ──────────────────────────────────────────────────────  │
│ [Realistic  ▾]   │                                                          │
│                  │  CLARIFICATION DIALOG (VDialog / inline panel)           │
│ Complexity       │  ╔═══════════════════════════════════════════════════╗   │
│ [ Low ○────● ]   │  ║  🤖  A few quick questions to refine your model:  ║   │
│                  │  ║                                                   ║   │
│                  │  ║  Q1: What scale? (miniature / vehicle / building) ║   │
│                  │  ║      ( ) Miniature  ( ) Vehicle  ( ) Building     ║   │
│                  │  ║                                                   ║   │
│                  │  ║  Q2: Interior details?                            ║   │
│                  │  ║      ( ) Yes, include interior  ( ) Exterior only ║   │
│                  │  ║                                                   ║   │
│                  │  ║  Q3: Style preference?                            ║   │
│                  │  ║      [___ free text field ___________________]    ║   │
│                  │  ║                                                   ║   │
│                  │  ║              [ Continue → ]  (VBtn primary)      ║   │
│                  │  ╚═══════════════════════════════════════════════════╝   │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

## Notes

- `ClarificationDialog` may show 1–N questions; the AI drives the question list.
- After the user answers and clicks Continue, generation starts immediately.
- The panel uses `VDialog` or an inline `VCard` occupying the stream/preview area.
- PromptBar text is read-only (original prompt displayed for context).
- No backdrop dimming — this is an inline panel, not a modal overlay.
