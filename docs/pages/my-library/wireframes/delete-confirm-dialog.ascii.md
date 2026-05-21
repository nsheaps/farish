# My Library — Delete Confirm Dialog (ASCII Wireframe)

Modal triggered when the user clicks "Delete" in the LibraryModelCard actions
menu. Asks for confirmation before permanently removing the model from storage.

```
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  (dimmed page content behind the dialog)                    ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

          ┌─────────────────────────────────────────┐
          │  DELETE CONFIRM DIALOG (VDialog)         │
          │                                         │
          │  🗑  Delete "Spire Model"?               │
          │                                         │
          │  This will permanently remove the       │
          │  model from your browser storage.       │
          │  This action cannot be undone.           │
          │                                         │
          │  ┌─────────────────┐  ┌───────────────┐ │
          │  │    Cancel       │  │  Delete       │ │
          │  │ (VBtn outlined) │  │ (VBtn danger) │ │
          │  └─────────────────┘  └───────────────┘ │
          └─────────────────────────────────────────┘
```

## Notes

- `DeleteConfirmDialog` uses `VDialog` (width ~400px, non-persistent).
- Clicking Cancel or the backdrop closes the dialog without action.
- Clicking Delete removes the model record and geometry blob from localStorage.
- If deleting the last model, the grid switches to the `empty` state after dialog closes.
- Model title is shown in the dialog heading to confirm which item will be deleted.
