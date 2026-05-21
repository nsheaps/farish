# Settings — ASCII Wireframe (Desktop, disconnected state)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ NAVBAR (VAppBar)                                                             │
│  [farish]   Generate   Explore   Leaderboards   Library           [⚙ icon] │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │          Settings                        │
                    │ (centered container, max-width ~640px)   │
                    │                                         │
                    │  ─── CONNECTION ─────────────────────── │
                    │                                         │
                    │  CONNECTION STATUS (VAlert / VCard)     │
                    │  ○  Not connected                       │
                    │                                         │
                    │  [ 🔑 Connect with Claude ]             │
                    │    (ConnectWithClaudeButton — VBtn)      │
                    │                                         │
                    │  ─ or enter your API key manually ───── │
                    │                                         │
                    │  API KEY INPUT (VTextField password)     │
                    │  [sk-ant-…__________________________]   │
                    │  [👁 show/hide]                  [Save] │
                    │                                         │
                    │  ─── STORAGE NOTE ───────────────────── │
                    │                                         │
                    │  🔒 Your credentials are stored in your │
                    │  browser only and are never sent to     │
                    │  farish servers.                        │
                    │  Learn more → /about                    │
                    │                                         │
                    │  ─── PREFERENCES ───────────────────── │
                    │                                         │
                    │  Theme                                   │
                    │  ( ) Light  (●) Dark  ( ) System        │
                    │  ← ThemeToggle (VBtnToggle)             │
                    │                                         │
                    │  Default Generation Parameters           │
                    │  Resolution  [Low ●──────────── High]   │
                    │  Style       [Realistic           ▾]    │
                    │  Complexity  [Low ●─────────── High]    │
                    │  ← DefaultParamsEditor (VSlider/VSelect)│
                    │                                         │
                    │  ─── DANGER ZONE ─────────────────────  │
                    │                                         │
                    │  [ 🗑 Clear All Data ]  (VBtn danger)   │
                    │  Removes credentials, library, and      │
                    │  all preferences from this browser.     │
                    │                                         │
                    └─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                      │
│   About   ·   Settings   ·   GitHub ↗                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## State Notes

| State             | Differences from `disconnected`                                           |
| ----------------- | ------------------------------------------------------------------------- |
| `connected-oauth` | ConnectionStatus shows "✓ Connected as Alice Maker"; [ Disconnect ] button |
| `connected-key`   | ConnectionStatus shows "✓ API key set"; [ Disconnect ] button              |
| `connecting`      | ConnectWithClaudeButton shows loading spinner; APIKeyInput disabled        |
| `error`           | Inline VAlert (error) below the failed control (OAuth or API key input)   |

### Connected state layout (connected-oauth example)

```
                    │  CONNECTION STATUS (VAlert / VCard)     │
                    │  ✓  Connected as Alice Maker (OAuth)    │
                    │                                         │
                    │  [ 🔌 Disconnect ]  (VBtn danger-text)  │
```

## Responsive (mobile)

- Container goes full-width.
- ConnectWithClaudeButton and APIKeyInput span full width.
- DefaultParamsEditor sliders become larger touch targets.
