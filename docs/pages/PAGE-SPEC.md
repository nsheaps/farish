# Page Spec — Shape & Authoring Rules

This document defines the **shape** of a page specification: the structure,
required sections, and format every `docs/pages/<slug>/SPEC.md` must follow.
It is the contract a page spec is reviewed against (prompt step 10).

It is not itself a page spec — it is the schema for them.

## Why a fixed shape

Every page spec is consumed three times downstream:

1. **Wireframing** (prompt step 15) — layout and component sections drive the
   wireframes.
2. **API design** (prompt steps 17–18) — the Data section is mined for the
   REST/WebSocket endpoints each page needs.
3. **Implementation** (prompt step 30+) — states, interactions, and responsive
   notes become the build checklist and the page tests.

A consistent shape means a reviewer (human or agent) can diff a spec against
this document and mechanically find what is missing.

## File location & naming

- One spec per page: `docs/pages/<slug>/SPEC.md`.
- `<slug>` is the slug column from [`INDEX.md`](INDEX.md) — lowercase,
  kebab-case (`model-detail`, `not-found`).
- The spec file is always named `SPEC.md` (uppercase).

## Required frontmatter

Every spec opens with a YAML frontmatter block. All keys are required.

```yaml
---
title: Model Detail # human-readable page title, matches INDEX.md
slug: model-detail # matches the directory name
route: /m/:modelId # URL path pattern; ":param" for dynamic segments
tag: browser-only # one of: browser-only | backend | static | system
status: draft # one of: draft | reviewed | live
backend_dependent: partial # one of: no | partial | yes
---
```

## Required sections

Sections appear in this exact order. Use the exact `##` headings shown. A
section with nothing to say still appears, with the single line `_None._` —
never delete a heading.

| #   | Heading                  | Content                                                                                                  |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | `# <Page Title>`         | The H1, matching `title`.                                                                                |
| 2   | `## Summary`             | 1–3 sentences: what the page is and why it exists.                                                       |
| 3   | `## Route & Access`      | The URL pattern, the `tag`, and any precondition (API key set, model exists, auth).                      |
| 4   | `## Users & Entry Points`| Who arrives here and from which pages/links/redirects.                                                   |
| 5   | `## Layout`              | The page's regions, top to bottom. Include a Mermaid `flowchart` **or** an ASCII sketch of the regions.  |
| 6   | `## Components`          | Bulleted list of the notable UI components/widgets, each with a one-line role.                           |
| 7   | `## States`             | A table of every state (`default`, `loading`, `empty`, `error`, `no-key`, `offline`, `coming-soon`, …) and what the page renders in each. |
| 8   | `## Interactions`        | Each user action and its outcome, as `action → outcome` bullets.                                         |
| 9   | `## Data`                | Every piece of data the page reads or writes. Mark each `local` (browser storage) or `remote` (backend). |
| 10  | `## Navigation`          | In-links (how users get here) and out-links (where they can go).                                         |
| 11  | `## Responsive`          | Desktop is the default; describe the mobile/narrow adaptations.                                          |
| 12  | `## Open Questions`      | Unresolved decisions. `_None._` when empty.                                                              |
| 13  | `## References`          | Markdown footnote definitions backing any non-obvious claim.                                             |

## Format rules

- **Markdown**, GitHub-flavored. Wrap prose at ~90 columns.
- **Diagrams use Mermaid** (per amendment A6 of the initial prompt) — never an
  image where a Mermaid diagram works. ASCII sketches are allowed only for the
  rough region layout in `## Layout`.
- **Cite sources** with GitHub footnote syntax (`[^1]`) in `## References`.
  Any claim that could attract a `[citation needed]` must carry one.
- **Link to repo files** with `github.com/...` URLs or repo-relative links,
  never filesystem paths.
- Reference the initial prompt as `../INITIAL_PROMPT.md` and other pages as
  `../<slug>/SPEC.md`.
- Keep a spec under ~250 lines. If it grows past that, the page is probably
  two pages — raise it in `## Open Questions`.

## Good vs. bad

### `## States` — good

```markdown
## States

| State         | Trigger                          | Renders                                          |
| ------------- | -------------------------------- | ------------------------------------------------ |
| `default`     | Model loaded                     | 3D viewer + metadata panel + action bar          |
| `loading`     | Model fetch in flight            | Skeleton viewer + shimmer on the metadata panel  |
| `error`       | Fetch failed                     | Inline error card with a Retry button            |
| `coming-soon` | Social actions, no backend yet   | Action bar replaced by the Coming Soon overlay   |
```

Why it is good: every state names its trigger and its concrete rendering — a
builder and a test can both act on it.

### `## States` — bad

```markdown
## States

The page handles loading and errors gracefully and shows the right thing.
```

Why it is bad: no enumerated states, no triggers, nothing testable — "the
right thing" cannot be built or verified against.

### `## Data` — good

```markdown
## Data

- `model` — the model record (id, prompt, params, geometry URL). `remote`.
- `viewerSettings` — camera/lighting prefs. `local` (browser storage).
- `rating` — the viewer's own rating of this model. `remote`, write.
```

Why it is good: each datum is named, sourced, and marked local/remote — step
17 can mine this directly into endpoints.

### `## Data` — bad

```markdown
## Data

The page needs the model and some user preferences.
```

Why it is bad: unnamed, unsourced — gives the API-design step nothing to
extract.

## Authoring & review flow

A spec is authored and reviewed with the `spec-writing` skill
(`.claude/skills/spec-writing/`, prompt step 11). In short: outline → bullet
each section → review the plan → write each section → review the whole spec →
iterate until no improvement remains. This document is the checklist that
review step diffs against.

## References

[^1]: Initial prompt, step 10 (defines this document) and amendment A6
       (Mermaid diagrams in docs) — [`../INITIAL_PROMPT.md`](../INITIAL_PROMPT.md).
