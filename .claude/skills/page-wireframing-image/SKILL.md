---
name: page-wireframing-image
description: >
  Stage 2 of wireframing: produce a Mermaid-based visual wireframe for a farish
  page (more detailed than ASCII; renders as an image on GitHub). Use when asked
  to "create the visual wireframe", "draft the image wireframe", or from
  page-wireframing skill step 5.
---

# Wireframing — Image (Mermaid) Stage

Produces a detailed Mermaid diagram wireframe — the "drafty image-based version"
from initial prompt step 15. Uses Mermaid `block-beta` or `flowchart` syntax so
the diagram renders natively on GitHub and GitHub Pages (amendment A6).[^mermaid]

Output file: `docs/pages/<slug>/wireframes/page.mermaid.md`

## Steps

1. Read the completed ASCII wireframe at
   `docs/pages/<slug>/wireframes/page.ascii.md` — use it as the spatial
   reference for component placement.

2. Read `docs/pages/<slug>/SPEC.md` sections `## Layout` and `## Components`
   for the authoritative region hierarchy.

3. Read `docs/research/design-system-choice.md` — confirm Vuetify component
   names for each region so labels in the Mermaid diagram are implementation-
   accurate.

4. Write `docs/pages/<slug>/wireframes/page.mermaid.md`. The file must contain:
   - A heading: `# <Page Title> — Visual Wireframe`
   - One Mermaid `flowchart TB` (or `block-beta`) diagram that shows:
     - Every component from `## Components` as a labelled node.
     - Layout regions (NavBar at top, sidebar left of main, action bar at bottom)
       using subgraphs to group related nodes.
     - Arrows indicating primary user flow through the page.
   - A short "Component key" table below the diagram mapping each label to its
     Vuetify equivalent (copied from `design-system-choice.md`).
   - One paragraph noting which states change the diagram significantly.

5. Keep the Mermaid diagram under ~40 nodes. If the page has enough modals to
   warrant it, produce a second diagram for the primary modal in the same file
   under a `## <Modal Name> Modal` heading.

6. Validate the diagram renders without syntax errors. Mermaid syntax rules:
   - Node IDs must be alphanumeric or underscored.
   - Subgraph labels in quotes if they contain spaces.
   - Arrows: `-->` (flow) or `---` (association, no arrowhead).

7. Save the file.

## Notes

- This diagram is "drafty" — it does not need to be pixel-perfect. Its purpose
  is to validate that every component has a logical place in the layout.
- A6 requires Mermaid over images where a diagram is sufficient. If a component
  cannot be meaningfully represented in Mermaid (e.g. the 3D WebGL canvas), use
  a rectangular node labelled `[ThreeDViewer — custom WebGL canvas]`.

## References

[^mermaid]: Mermaid — renders natively on GitHub and GitHub Pages —
      <https://mermaid.js.org>
