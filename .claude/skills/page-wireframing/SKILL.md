---
name: page-wireframing
description: >
  Draft wireframes for a farish page. Use when asked to "wireframe the X page",
  "create wireframes for X", "start wireframing", or when working through prompt
  step 15. Runs the three-stage process: ASCII sketch → Mermaid visual draft →
  one review/improvement round. Produces at least one whole-page wireframe plus
  one per modal or popover.
---

# Page Wireframing

Three-stage wireframing process for a single farish page. Designed so prompt
step 15 is "for each page in INDEX.md, run this skill".

Design system: **Vuetify 3**. Component vocabulary is in
`docs/research/design-system-choice.md` — read it before starting.

## Steps

1. Read `docs/pages/<slug>/SPEC.md` in full. Note every component, modal,
   popover, and state in `## Components` and `## States`.

2. Read `docs/research/design-system-choice.md` — confirm the Vuetify component
   that maps to each component named in the spec.

3. Create the directory `docs/pages/<slug>/wireframes/` if it does not exist.

4. Run `Skill(page-wireframing-ascii)` to produce the ASCII wireframe(s) —
   one for the full page plus one per modal or popover identified in step 1.

5. Run `Skill(page-wireframing-image)` to produce the Mermaid visual wireframe
   for the full page (and modals, if complex enough to warrant it).

6. Run `Skill(page-wireframing-review)` to validate all wireframes against the
   page spec and identify gaps.

7. For each gap found in step 6, update the affected wireframe file(s), then
   re-run step 6. Iterate until the review passes with no remaining gaps.

8. Commit the wireframes atomically:
   `docs(wireframes): add <slug> page wireframes`

## Notes

- Wireframe files live in `docs/pages/<slug>/wireframes/`. Never place them
  elsewhere.
- The ASCII stage is stage 1; the Mermaid stage is stage 2; the review is the
  "one more round of improvement" from the initial prompt (step 15).
- If a page has a `coming-soon` state (backend-gated), include a wireframe of
  the ghost overlay state as a separate file: `coming-soon-overlay.ascii.md`.
