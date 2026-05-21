---
name: spec-writing-review
description: >
  Validate a complete page spec against PAGE-SPEC.md. Checks frontmatter,
  section completeness, format rules, citation coverage, and line count.
  Use after all sections are written. Trigger phrases: "review the spec",
  "validate the spec", "check the spec", "review SPEC.md". Called from
  spec-writing skill step 5.
---

# Spec — Review & Validate

Validates a finished `docs/pages/<slug>/SPEC.md` against the schema in
`docs/pages/PAGE-SPEC.md`. Produces a pass/fail checklist.

## Steps

1. Read `docs/pages/PAGE-SPEC.md` in full — this is the checklist you
   validate against.

2. Read `docs/pages/<slug>/SPEC.md` in full.

3. **Frontmatter check.** Verify all 6 required keys are present and hold
   valid values:
   - `title` matches INDEX.md.
   - `slug` matches the directory name.
   - `route` has the correct URL pattern (`:param` for dynamic segments).
   - `tag` is one of: `browser-only` | `backend` | `static` | `system`.
   - `status` is one of: `draft` | `reviewed` | `live`.
   - `backend_dependent` is one of: `no` | `partial` | `yes`.

4. **Section order check.** Confirm all 13 sections appear in the exact order
   from PAGE-SPEC.md. No heading may be missing; empty sections must contain
   `_None._` not an empty body.

5. **Section format checks:**
   - `## States` — 4-column table with a State, Trigger, and Renders column at
     minimum. Every state must name its trigger and what it renders.
   - `## Data` — each datum named, sourced, and marked `local` or `remote`.
   - `## Interactions` — every bullet uses `action → outcome` format.
   - `## Layout` — contains a Mermaid diagram or ASCII sketch (not prose only).
   - `## References` — only footnote definitions (`[^N]: ...`); no inline links.

6. **Citation check.** For any non-obvious claim (fact, constraint, or design
   decision that a builder would question), verify a `[^N]` reference exists
   and is defined in `## References`.

7. **Line count.** Count the file's lines. Flag in the report if > 250.

8. **Produce a checklist report** listing every item above as PASS or FAIL.
   For each FAIL, state the section and what is missing or malformed.

9. If any FAILs remain, return to the `spec-writing` skill at step 6 for the
   affected sections. Re-run this review after each fix.
