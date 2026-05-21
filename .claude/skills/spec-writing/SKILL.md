---
name: spec-writing
description: >
  Write a complete page spec (SPEC.md) for a farish site page. Use when asked
  to "write the spec for X", "fill in the spec", "create SPEC.md for <page>",
  "author the page spec", or when working through prompt step 12. Orchestrates
  the draft-outline → write-section → review subskills for one page at a time.
---

# Spec Writing

Process for writing a single `docs/pages/<slug>/SPEC.md`. Designed so step 12
of the initial prompt is "for each page in INDEX.md, run this skill".

See `docs/pages/PAGE-SPEC.md` for the required shape, section rules, and
good/bad examples. This skill does not inline those rules — refer to that
document throughout.

## Steps

1. Identify the target page. Read `docs/pages/INDEX.md` and note the page's
   slug, title, route, tag, and backend_dependent value.

2. Verify that `docs/pages/<slug>/SPEC.md` exists (it may be empty from
   prompt step 8). Create the file and its parent directory if missing.

3. Run `Skill(spec-writing-draft-outline)` to write the YAML frontmatter and
   add bullet-note placeholders under each of the 13 required section headings.

4. For each section in order (1 through 13), run
   `Skill(spec-writing-write-section)` to replace the bullet notes with
   polished prose, tables, or diagrams as appropriate for that section.

5. Run `Skill(spec-writing-review)` to validate the complete spec against
   `docs/pages/PAGE-SPEC.md`.

6. For each issue the review identifies, return to step 4 for the affected
   section(s), then re-run step 5. Repeat until the review passes with no
   remaining issues.

7. Commit the completed spec atomically:
   `docs(pages): add <slug> page spec`

## Notes

- Keep the spec under ~250 lines (PAGE-SPEC.md rule). If it grows past that,
  raise it in `## Open Questions` rather than silently trimming content.
- All Mermaid diagrams must render on GitHub (amendment A6 of the initial
  prompt). Test locally if unsure.
- Use `[^N]` footnotes in `## References` for any non-obvious claim.
