---
name: validate-change-spec
description: >
  Validate a page or API spec change (docs/pages/**/SPEC.md or
  docs/api/**/SPEC.md). Use when asked to "validate the spec", "check the spec
  I wrote", "review a spec change", or from validate-change when changed paths
  match docs/pages/**/SPEC.md or docs/api/**/SPEC.md.
---

# Validate Change — Spec

Validation procedure for page and API spec file changes.

## Steps

### For page specs (`docs/pages/<slug>/SPEC.md`)

1. Run `Skill(spec-writing-review)` — it validates the spec against
   `docs/pages/PAGE-SPEC.md` and checks all 13 required sections.

2. Confirm the spec is under ~250 lines (PAGE-SPEC.md rule). If longer, raise
   the issue in `## Open Questions` rather than silently trimming.

3. Verify every non-obvious claim has a `[^N]` footnote with a URL.[^footnotes]

4. Check that any Mermaid diagrams in the spec render correctly (amendment A6):
   - No diagram should reference undefined node IDs.
   - Test locally or via GitHub preview.

5. Confirm the spec's `backend_dependent` flag in the frontmatter is accurate —
   features requiring a backend get a "coming soon" overlay per step 26.

### For API specs (`docs/api/<endpoint-slug>/SPEC.md`)

6. Run `Skill(page-to-api-requirements)` review steps to confirm the endpoint
   matches what the page specs require.

7. Verify the spec documents: method, path, request schema, response schema,
   auth requirements, error codes, and WebSocket vs. REST decision.

8. Check that the endpoint slug matches the file path exactly.

## Notes

- Page specs and API specs have different required shapes. Confirm which type
  you are validating before running the steps above.
- **Update this skill** as the spec formats evolve through steps 17–20 iteration.

[^footnotes]: Footnote requirement from `docs/INITIAL_PROMPT.md` step 4 (always-keep-improving.md).
