# API Spec — Shape & Authoring Rules

This document defines the **shape** of an endpoint specification: the
structure, required sections, and format that every
`docs/api/<endpoint-slug>/SPEC.md` must follow. It is the contract an
endpoint spec is reviewed against (prompt steps 17–20).[^1]

It is not itself an endpoint spec — it is the schema for them.

## Why a fixed shape

Every endpoint spec is consumed downstream at three stages:

1. **API review** (prompt steps 19–20) — the review loop diffs each spec
   against this document to find what is missing or inconsistent.
2. **Implementation** (prompt step 33–35) — request/response schemas and
   error tables become the server implementation checklist and contract
   tests.
3. **Client integration** (prompt step 34) — source-pages links let the
   frontend know exactly which page uses which endpoint.

A consistent shape means a reviewer (human or agent) can diff a spec
against this document and mechanically find what is missing.

## File location & naming

- One spec per distinct operation: `docs/api/<endpoint-slug>/SPEC.md`.
- `<endpoint-slug>` is lowercase kebab-case, combining HTTP method and
  resource path segments: `list-models`, `get-model`, `create-model`,
  `submit-rating`, `get-leaderboard`, `get-user-profile`,
  `list-user-models`. Omit path-param segments (`:id`, `:username`).
- The spec file is always named `SPEC.md` (uppercase).
- `GET /models` and `POST /models` are separate files:
  `docs/api/list-models/SPEC.md` and `docs/api/create-model/SPEC.md`.

## Required frontmatter

Every spec opens with a YAML frontmatter block. All keys are required.

```yaml
---
name: List Models          # human-readable operation name
slug: list-models          # matches the directory name
transport: rest            # one of: rest | websocket
method: GET                # HTTP method (REST only); omit for WebSocket
route: /models             # URL path pattern; ":param" for dynamic segments
auth: none                 # one of: none | optional | required
status: draft              # one of: draft | reviewed | live
source_pages:              # page slugs whose specs require this endpoint
  - explore
  - home
---
```

## Required sections

Sections appear in this exact order. Use the exact `##` headings shown.
A section with nothing to say still appears with `_None._` — never delete
a heading.

| #  | Heading                        | Content                                                                                                    |
|----|--------------------------------|------------------------------------------------------------------------------------------------------------|
| 1  | `# <Endpoint Name>`            | The H1, matching `name` in frontmatter.                                                                    |
| 2  | `## Summary`                   | 1–3 sentences: what this endpoint does and why it exists.                                                  |
| 3  | `## Transport`                 | One sentence: REST or WebSocket and the reason for the choice.                                             |
| 4  | `## Method & Route`            | HTTP verb + URL pattern (REST); or `## Channel & Protocol` for WebSocket (channel name, message direction). |
| 5  | `## Request`                   | Sub-sections: **Path params**, **Query params** (GET), **Body** (POST/PUT/PATCH), **Headers**. Each param in a table. |
| 6  | `## Response`                  | Success status code; response body field table (field, type, nullable, description).                       |
| 7  | `## Auth`                      | Auth scheme (bearer token / session cookie / none) and what happens when auth is absent or invalid.        |
| 8  | `## Errors`                    | Table: HTTP status → condition → response body shape.                                                      |
| 9  | `## Source Pages`              | List of page slugs (with links to their SPEC.md) that consume this endpoint.                               |
| 10 | `## Open Questions`            | Unresolved design decisions. `_None._` when empty.                                                         |
| 11 | `## References`                | Markdown footnote definitions backing non-obvious claims.                                                  |

## Format rules

- **Markdown**, GitHub-flavored. Wrap prose at ~90 columns.
- **Diagrams use Mermaid** (amendment A6 of the initial prompt) for
  sequence or state diagrams when the flow is complex enough to warrant
  one. Tables are preferred for simple request/response shapes.[^2]
- **Cite sources** with GitHub footnote syntax (`[^1]`) in `## References`.
  Any claim that could attract a `[citation needed]` must carry one.
- **Link to repo files** with `github.com/...` URLs or repo-relative links,
  never filesystem paths.
- Reference source page specs as `../../docs/pages/<slug>/SPEC.md`.
- Keep an endpoint spec under ~100 lines. If a resource has many
  operations, split them into separate files rather than growing one file.

## Error body conventions

All endpoint error responses share a common JSON shape. There are two patterns:

**Standard error** (single code, no extra data):

```json
{ "error": "<error_code>" }
```

**Validation error** (multi-field validation failure, 400 only):

```json
{ "error": "validation_error", "fields": ["<field_name>", ...] }
```

The `error` code is a snake_case string (e.g. `model_not_found`,
`unauthorized`, `internal_error`). Every endpoint's `## Errors` table lists
all expected codes. Every endpoint must include at least one `500 internal_error`
row.

**Auth-optional endpoints** that receive an invalid bearer token should
document their fallback behaviour (e.g. silently ignore → unauthenticated
path, or reject with 401). Never leave this ambiguous.

## Array query-param serialization

Multi-value query params (e.g. `filter`) are serialised as **repeated
params** in the query string:

```
GET /models?filter=cats&filter=dogs
```

Do not use comma-separated values (`?filter=cats,dogs`) or bracket notation
(`?filter[]=cats`). All endpoint specs follow this convention.

## REST vs WebSocket decision

Use **REST** for all request-response operations in farish's social layer:
fetching resources, searching, filtering, paginating, submitting mutations,
incrementing counters.

Use **WebSocket** only when the server must push a sequence of asynchronous
messages over a long-lived connection (real-time generation progress,
collaborative editing, live notifications). For the current browser-only
architecture, AI generation streams via the Claude Agent SDK client-side
and is NOT a farish endpoint — reserve WebSocket specs for future
server-side features.

## Good vs. bad

### `## Request` — good

```markdown
## Request

**Path params:**

| Param | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| `:id` | UUID   | yes      | Unique model ID       |

**Query params:** _None._

**Body:** _None._
```

Why it is good: each param is named, typed, and described — a builder and
a contract test can both act on it.

### `## Request` — bad

```markdown
## Request

Pass the model ID in the URL.
```

Why it is bad: no param name, no type, no table — gives implementation
nothing to verify against.

### `## Errors` — good

```markdown
## Errors

| Status | Condition                          | Body                                      |
|--------|------------------------------------|-------------------------------------------|
| 404    | Model not found or not public      | `{ "error": "model_not_found" }`          |
| 401    | Bearer token missing or invalid    | `{ "error": "unauthorized" }`             |
| 500    | Unexpected server error            | `{ "error": "internal_error" }`           |
```

Why it is good: exhaustive, status codes are unambiguous, body shape is
specified — client-side error handling can be driven by this table.

### `## Errors` — bad

```markdown
## Errors

Returns appropriate error codes when something goes wrong.
```

Why it is bad: no enumerated conditions — client has no contract to code
against.

## Authoring & review flow

Endpoint specs are authored using the `page-to-api-requirements` skill
(`.claude/skills/page-to-api-requirements/`, prompt step 17). In short:
extract remote data + backend interactions from each page spec → group by
resource → decide transport → write each endpoint spec → review against
this document → iterate. This document is the checklist that the review
step diffs against.

## References

[^1]: Initial prompt step 17 (defines the skill) and steps 18–20 (extract
      and review loops) — [`../INITIAL_PROMPT.md`](../INITIAL_PROMPT.md).
[^2]: Amendment A6 — Mermaid diagrams in documentation —
      [`../INITIAL_PROMPT.md`](../INITIAL_PROMPT.md).
