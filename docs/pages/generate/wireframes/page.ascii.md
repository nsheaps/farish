# Generate — ASCII Wireframe (Desktop, idle state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

  ╔══════════════════════════════════════════════════════════════════════════╗
  ║ NO KEY BANNER (VAlert — warning) — only visible in `no-key` state       ║
  ║  ⚠  No API key connected. [ Connect your key → ] to start generating.   ║
  ╚══════════════════════════════════════════════════════════════════════════╝

┌──────────────────┬──────────────────────────────────────────────────────────┐
│ PARAMETERS PANEL │  GENERATION WORKSPACE                                    │
│(VNavigationDrawer│                                                          │
│ col ~280px)      │  PROMPT BAR (VTextarea + VBtn)                           │
│                  │  ┌───────────────────────────────────────────────┐      │
│ Geometry         │  │ Describe the 3D model you want to create…     │      │
│ Resolution       │  │                                               │      │
│ [Low ○──●── High]│  │                                               │      │
│                  │  └───────────────────────────────────────────────┘      │
│ Artistic Style   │                          [ ▶ Generate ] (VBtn primary)  │
│ [Realistic  ▾]   │                                                          │
│ (VSelect)        │  ──────────────────────────────────────────────────────  │
│                  │                                                          │
│ Complexity       │  GENERATION STREAM + MODEL PREVIEW                       │
│ [ Low ○────● ]   │  ┌─────────────────────────┬────────────────────────┐   │
│ (VSlider)        │  │ PROGRESS FEED (VList)    │ MODEL PREVIEW           │   │
│                  │  │ streaming events:         │ (ThreeDViewer —         │   │
│                  │  │ ▓▓▓▓▓▓░░░░ 60%           │  custom WebGL canvas)   │   │
│                  │  │ › Parsing prompt…         │                        │   │
│                  │  │ › Generating geometry…    │  [3D geometry          │   │
│                  │  │ › Applying materials…     │   renders here as      │   │
│                  │  │ › Optimising mesh…        │   it is produced]      │   │
│                  │  │                           │                        │   │
│                  │  └─────────────────────────┴────────────────────────┘   │
│                  │                                                          │
│                  │  RESULT ACTIONS (VToolbar — visible in `complete` state) │
│                  │   [ ⬇ Download ]  [ 🔖 Save to Library ]  [ ↗ Share ]  │
│                  │   [ 🔄 New ]      ← ResultActions (VBtn group)           │
└──────────────────┴──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│   About   ·   Settings   ·   GitHub ↗                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State        | Differences from `idle`                                                      |
| ------------ | ---------------------------------------------------------------------------- |
| `no-key`     | NoKeyBanner (VAlert) shown above workspace; Generate button disabled          |
| `idle`       | PromptBar enabled; ParametersPanel accessible; no stream/preview visible yet  |
| `specifying` | ClarificationDialog replaces stream area; PromptBar locked (see separate file)|
| `generating` | GenerationStream scrolling + ModelPreview updating; [ Cancel ] button visible |
| `complete`   | ModelPreview shows final geometry; ResultActions (Download/Save/Share) visible |
| `error`      | ErrorPanel (VCard) with error detail text + [ Retry ] button                  |

## Responsive (mobile)

- ParametersPanel collapses into a bottom-sheet drawer; a "⚙ Params" VBtn opens it.
- PromptBar is full-width at the bottom of the screen.
- GenerationStream and ModelPreview stack vertically above the PromptBar.
