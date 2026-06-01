# About — ASCII Wireframe (Desktop, default state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

         ┌───────────────────────────────────────────────────────┐
         │             ABOUT HERO (heading section)              │
         │                                                       │
         │                   About farish                        │
         │     AI-generated 3D geometry, named for William       │
         │     Farish — the mathematician who formalized          │
         │     isometric projection in 1822.                     │
         └───────────────────────────────────────────────────────┘

         ┌───────────────────────────────────────────────────────┐
         │  FARISH HISTORY (VCard prose section)                 │
         │                                                       │
         │  William Farish (1759–1837)                          │
         │                                                       │
         │  William Farish was a British chemist and engineer    │
         │  at Cambridge who in 1822 first formalised isometric  │
         │  projection as a technical drawing method — a system  │
         │  that represents 3D objects in 2D while preserving    │
         │  equal scale on all three axes.                       │
         │                                                       │
         │  [wikipedia link ↗]                                  │
         └───────────────────────────────────────────────────────┘

         ┌───────────────────────────────────────────────────────┐
         │  HOW GENERATION WORKS (VCard + Mermaid diagram)       │
         │                                                       │
         │  Generation Diagram (rendered Mermaid sequence)       │
         │  ┌──────────────────────────────────────────────┐    │
         │  │  User → Prompt → Claude SDK → Tool calls     │    │
         │  │     → Geometry output → 3D Viewer            │    │
         │  └──────────────────────────────────────────────┘    │
         │                                                       │
         │  How it works (prose companion text):                 │
         │  farish passes your prompt to Claude's Agent SDK.     │
         │  The agent reasons over the request, calls geometry   │
         │  tools, and streams incremental updates to the        │
         │  viewer as 3D output is produced.                     │
         └───────────────────────────────────────────────────────┘

         ┌───────────────────────────────────────────────────────┐
         │  CREDENTIAL PRIVACY SECTION (VCard)                   │
         │                                                       │
         │  🔒 Your keys stay on your device                    │
         │                                                       │
         │  Your Claude API key or OAuth token is stored in      │
         │  your browser's localStorage and is never transmitted │
         │  to farish servers. All AI requests go directly from  │
         │  your browser to the Anthropic API.                   │
         │                                                       │
         │  [ Connect your key in Settings → ]  (SettingsCTA)   │
         │  ← VBtn (secondary/text, links to /settings)         │
         └───────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│   About   ·   Settings   ·   GitHub ↗                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State     | Trigger    | Renders           |
| --------- | ---------- | ----------------- |
| `default` | Page loads | Full static content (single state only) |

## Responsive (mobile)

- Reading column goes full-width.
- GenerationDiagram scrolls horizontally if wider than the viewport.
