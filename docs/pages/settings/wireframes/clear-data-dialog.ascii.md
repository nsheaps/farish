# Settings — Clear Data Confirm Dialog (ASCII Wireframe)

Modal triggered when the user clicks "Clear All Data" in the Danger Zone.
Confirms before permanently wiping all browser storage.

```
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  (dimmed Settings page content behind the dialog)           ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

          ┌─────────────────────────────────────────┐
          │  CLEAR DATA DIALOG (VDialog)             │
          │                                         │
          │  🗑  Clear all farish data?              │
          │                                         │
          │  This will permanently delete:          │
          │    • Your API key / OAuth token         │
          │    • Your entire model library          │
          │    • All preferences and settings       │
          │                                         │
          │  This action cannot be undone.           │
          │                                         │
          │  ┌─────────────────┐  ┌───────────────┐ │
          │  │    Cancel       │  │  Clear All    │ │
          │  │ (VBtn outlined) │  │ (VBtn danger) │ │
          │  └─────────────────┘  └───────────────┘ │
          └─────────────────────────────────────────┘
```

## Notes

- `ClearDataButton` uses `VDialog` (width ~440px, non-persistent).
- On confirm: wipes all `localStorage` for farish, then redirects to `/`
  with a cleared-session notice (`VSnackbar`).
- Cancel or backdrop click closes without action.
- Bullet list enumerates exactly what will be deleted so users understand the scope.
