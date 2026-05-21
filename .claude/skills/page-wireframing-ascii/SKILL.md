---
name: page-wireframing-ascii
description: >
  Stage 1 of wireframing: produce ASCII art wireframes for a farish page and
  each of its modals/popovers. Use when asked to "draw the ASCII wireframe",
  "sketch the page layout", or from page-wireframing skill step 4.
---

# Wireframing — ASCII Stage

Produces rough ASCII art wireframes. One file for the full page; one file per
modal or popover. Files go in `docs/pages/<slug>/wireframes/`.

## Layout vocabulary

Use this vocabulary consistently across all pages so wireframes look coherent:

```
┌─────────────────────────────────────────────────┐
│ NAVBAR  [Logo]  [Generate] [Explore] [≡]        │  ← VAppBar (full width)
├─────────────────────────────────────────────────┤
│  (page body — varies per page)                  │
│                                                 │
│  SIDEBAR          │  MAIN CONTENT               │  ← VNavigationDrawer + VMain
│  ┌─────────────┐  │  ┌─────────────────────┐    │
│  │ filter /    │  │  │ card grid / viewer  │    │  ← VCard, VRow/VCol
│  │ params panel│  │  │                     │    │
│  └─────────────┘  │  └─────────────────────┘    │
│                   │  [ action bar ]              │  ← VToolbar / VBtn
├─────────────────────────────────────────────────┤
│ (no footer — single-page app)                   │
└─────────────────────────────────────────────────┘
```

Box-drawing chars: `┌ ┐ └ ┘ │ ─ ├ ┤ ┬ ┴ ┼`. Use `[ Button ]` for buttons,
`( radio )` for radio inputs, `[x]` for checkboxes, `[___field___]` for text
inputs, `★★★☆☆` for ratings, `▓▓▓▓░` for progress.

## Steps

1. Read `docs/pages/<slug>/SPEC.md` — collect all components from `## Components`
   and all states from `## States`.

2. Read `docs/research/design-system-choice.md` — note the Vuetify component
   for each spec component so the ASCII labels match implementation reality.

3. Create `docs/pages/<slug>/wireframes/page.ascii.md`. Draw the full-page
   wireframe at desktop width (~80 chars wide). Rules:
   - Show the NavBar at the top on every page.
   - Depict every component listed in `## Components` — place them in the
     layout region described in `## Layout` of the spec.
   - Label each region with its component name and its Vuetify equivalent
     in parentheses, e.g. `FILTER PANEL (VNavigationDrawer)`.
   - Show the `default` state. Add a short note below the diagram for each
     non-default state that changes the layout significantly.

4. For each modal, popover, or overlay named in `## Components` or
   `## Interactions` of the spec, create a separate file:
   `docs/pages/<slug>/wireframes/<component-name-kebab>.ascii.md`.
   Draw the modal at ~60 chars wide, centered, with a dimmed-backdrop indicator.

5. If the page has a `coming-soon` state, create
   `docs/pages/<slug>/wireframes/coming-soon-overlay.ascii.md` showing the
   ghost-wireframe-behind-overlay layout.

6. Save all files. Do not proceed to stage 2 until every component from the
   spec has a visible representation in the wireframes.
