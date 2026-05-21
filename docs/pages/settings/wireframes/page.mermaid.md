# Settings — Visual Wireframe

```mermaid
flowchart TB
    subgraph NavBar["NavBar (VAppBar)"]
        Logo["[farish]"]
        NavLinks["Generate · Explore · Leaderboards · Library · ⚙"]
    end

    subgraph Container["Centered Container (max-width 640px)"]
        PageTitle["Settings  (h1)"]

        subgraph ConnectionSection["Connection Section"]
            ConnectionStatus["ConnectionStatus\n○ Not connected  /  ✓ Connected as Alice (OAuth)  /  ✓ API key set\n(VAlert or VCard)"]
            ConnectBtn["[ 🔑 Connect with Claude ]  (VBtn primary)"]
            APIKeyInput["API Key Input\n[sk-ant-…__________]  [👁]  [Save]\n(VTextField type=password)"]
            DisconnectBtn["[ 🔌 Disconnect ]  (VBtn, danger-text — connected states only)"]
        end

        subgraph StorageNote_node["Storage Note"]
            PrivacyText["🔒 Your credentials are stored in your browser only\nand are never sent to farish servers."]
            AboutLink["Learn more → /about"]
        end

        subgraph Preferences["Preferences Section"]
            ThemeToggle_node["Theme Toggle\n( ) Light  (●) Dark  ( ) System\n(VBtnToggle)"]
            DefaultParamsEditor_node["Default Parameters\nResolution  [VSlider]\nStyle       [VSelect]\nComplexity  [VSlider]"]
        end

        subgraph DangerZone["Danger Zone"]
            ClearDataBtn["[ 🗑 Clear All Data ]  (VBtn color=error)"]
        end

        subgraph ClearDialog["ClearDataDialog (VDialog — on Clear All click)"]
            ClearMsg["🗑 Clear all farish data?\nDeletes credentials, library, preferences.\nThis cannot be undone."]
            CancelBtn["[ Cancel ]  (VBtn outlined)"]
            ConfirmBtn["[ Clear All ]  (VBtn danger)"]
        end
    end

    subgraph Footer["Footer"]
        AboutLink_f["About"]
        SettingsLink_f["Settings"]
        GithubLink_f["GitHub ↗"]
    end

    NavBar --> Container
    Container --> Footer
    ConnectionSection --> StorageNote_node --> Preferences --> DangerZone
    ClearDataBtn -->|"opens dialog"| ClearDialog
    ConfirmBtn -->|"wipe localStorage → redirect"| HomePage(("/"))
    ConnectBtn -->|"OAuth flow → connected-oauth"| ConnectionStatus
    DisconnectBtn -->|"clears token → disconnected"| ConnectionStatus
```

## Component Key

| Wireframe Label         | Vuetify 3 Component                                   |
| ----------------------- | ----------------------------------------------------- |
| NavBar                  | `VAppBar` + `VBtn`                                    |
| ConnectionStatus        | `VAlert` or `VCard` (status indicator)                |
| ConnectWithClaudeButton | `VBtn` (variant="elevated", prepend-icon="mdi-key")   |
| APIKeyInput             | `VTextField` (type="password", show/hide toggle)       |
| DisconnectButton        | `VBtn` (variant="text", color="error")                |
| StorageNote             | Static prose in `VCard` or `VAlert` (type="info")     |
| ThemeToggle             | `VBtnToggle` (three-way: light/dark/system)           |
| DefaultParamsEditor     | `VSlider` + `VSelect`                                 |
| ClearDataButton         | `VBtn` (color="error")                                |
| ClearDataDialog         | `VDialog` (width=440)                                 |
| Footer                  | Static `<footer>` with `VBtn` text links              |

## State Impact

- **`disconnected`**: `ConnectBtn` + `APIKeyInput` visible; `DisconnectBtn` hidden; `ConnectionStatus` = "Not connected".
- **`connected-oauth`**: `ConnectionStatus` = "Connected as Alice"; `ConnectBtn` hidden; `DisconnectBtn` visible.
- **`connected-key`**: `ConnectionStatus` = "API key set"; `ConnectBtn` hidden; `DisconnectBtn` visible; `APIKeyInput` shows masked value.
- **`connecting`**: Spinner on `ConnectBtn`; inputs disabled.
- **`error`**: Inline `VAlert` (error type) below the failing control.
