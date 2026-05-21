---
name: spec-writing-draft-outline
description: >
  Scaffold the frontmatter and bullet-note placeholders for all 13 required
  sections of a page spec. Use at the start of writing a spec, before any
  prose is written. Trigger phrases: "draft the outline", "scaffold the spec",
  "create the spec outline". Called from the spec-writing skill step 3.
---

# Spec — Draft Outline

Produces a scaffolded `SPEC.md` with frontmatter and placeholder bullets. No
prose is written yet — that is done by `spec-writing-write-section`.

## Steps

1. Read `docs/pages/PAGE-SPEC.md`:
   - Note the 6 required frontmatter keys and their allowed values.
   - Note the 13 required section headings in order.

2. Read `docs/pages/INDEX.md` to confirm the page's slug, title, route, and
   tag for this page.

3. Open `docs/pages/<slug>/SPEC.md` (create if missing).

4. Write the YAML frontmatter block at the top of the file. All 6 keys are
   required; set `status: draft`. Infer `backend_dependent` from the tag in
   INDEX.md (`browser-only` / `static` → `no`; `backend` → `yes`; mixed →
   `partial`).

5. Add all 13 section headings in the exact order specified in PAGE-SPEC.md.
   Use the exact heading text shown in the table (e.g. `## Route & Access`).

6. Under each section heading, write 2–4 bullet notes that describe what
   this specific page will need in that section. Draw context from:
   - INDEX.md (the page's one-sentence description and tag).
   - `docs/INITIAL_PROMPT.md` (feature requirements that affect this page).
   - Sibling `docs/pages/<other-slug>/SPEC.md` files for cross-page links.
   Add `[citation needed]` where a footnote reference will be required.

7. Do not write prose or fill any section beyond bullet notes. Save and stop.
