---
name: page-wireframing-review
description: >
  Stage 3 of wireframing: review all wireframes for a page against its spec
  and identify gaps or inconsistencies. The "one more round of improvement" from
  initial prompt step 15. Use when asked to "review the wireframes", "check
  wireframes against spec", or from page-wireframing skill step 6.
---

# Wireframing — Review Stage

Validates all wireframes for a page against the page spec and produces a
pass/fail checklist. One iteration of improvement is mandatory per prompt
step 15; iterate until all items pass.

## Steps

1. Read `docs/pages/<slug>/SPEC.md` in full.

2. List all wireframe files in `docs/pages/<slug>/wireframes/`. Confirm:
   - `page.ascii.md` exists (stage 1, full page).
   - `page.mermaid.md` exists (stage 2, visual draft).
   - One ASCII file per modal, popover, or overlay named in `## Components`.
   - `coming-soon-overlay.ascii.md` exists if the spec has a `coming-soon` state.

3. **Component coverage check.** For every component in `## Components` of the
   spec, confirm it appears in both the ASCII and Mermaid wireframes.
   Flag any component that is missing.

4. **State coverage check.** For each state in `## States`, confirm:
   - The default state is fully depicted.
   - Each significant non-default state has at least a note in `page.ascii.md`
     or a separate diagram if it substantially changes the layout.

5. **Spec alignment check.** Compare the layout in the wireframes against
   `## Layout` in the spec (the Mermaid flowchart or ASCII sketch). Flag any
   region described in the spec that is absent from the wireframes.

6. **Design-system consistency check.** Read
   `docs/research/design-system-choice.md`. Confirm each component label in
   the wireframes corresponds to a Vuetify component in the vocabulary table.
   Flag any label that is ambiguous or unmapped.

7. **Cross-page consistency check.** The NavBar must appear on every page
   wireframe. Cards displaying model data must use the `ModelCard` label.
   Flag violations.

8. **Produce a checklist report** — PASS or FAIL for each item above.
   For each FAIL, state which file is affected and what is missing.

9. For each FAIL, update the relevant wireframe file(s), then re-run steps 2–8.
   Continue iterating until all items PASS.
