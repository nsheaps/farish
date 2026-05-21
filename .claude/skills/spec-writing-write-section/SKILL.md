---
name: spec-writing-write-section
description: >
  Fill in one section of a page spec — replace bullet-note placeholders with
  polished prose, tables, or diagrams following the section's format rules.
  Use after spec-writing-draft-outline, for each section in turn. Trigger
  phrases: "write section X", "fill in the section", "complete section".
  Called from spec-writing skill step 4.
---

# Spec — Write Section

Fills one named section of a `docs/pages/<slug>/SPEC.md` with finished
content. Run once per section; called 13 times total per spec.

## Steps

1. Identify the section to fill (e.g. `## States`) and read its bullet notes
   in the current `SPEC.md`.

2. Read the matching row in the section table in `docs/pages/PAGE-SPEC.md`
   for this section's content rules. For `## States` and `## Data`, also
   read the good/bad examples in that file.

3. Write the section content using the correct format:
   - `## Summary` — 1–3 sentences of plain prose.
   - `## Route & Access` — URL pattern, tag value, preconditions.
   - `## Users & Entry Points` — prose or bullets of who arrives and from where.
   - `## Layout` — Mermaid `flowchart` or ASCII sketch of page regions.
   - `## Components` — bulleted list, one component per line with a one-line role.
   - `## States` — 4-column table (State | Trigger | Renders | Notes).
   - `## Interactions` — `action → outcome` bullets.
   - `## Data` — bulleted list; each item named, described, marked `local` or `remote`.
   - `## Navigation` — in-links and out-links.
   - `## Responsive` — prose or bullets on mobile/narrow adaptations.
   - `## Open Questions` — bulleted list, or `_None._`.
   - `## References` — markdown footnote definitions (`[^N]: ...`).

4. Resolve all `[citation needed]` placeholders in this section. Add a
   `[^N]` inline reference and define it in `## References`.

5. Wrap prose at ~90 columns. If the section content alone would exceed
   ~40 lines, note it in `## Open Questions` rather than silently trimming.

6. Save the section. Verify the heading text matches PAGE-SPEC.md exactly.
