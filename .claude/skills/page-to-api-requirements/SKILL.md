---
name: page-to-api-requirements
description: >
  Extract API requirements from farish page specs and wireframes into
  docs/api/<endpoint-slug>/SPEC.md files. Use when asked to "extract API
  requirements", "identify endpoints", "map pages to API", "design the REST
  API", or when working through prompt step 18. Processes each page spec's
  remote data items and backend interactions, decides REST vs WebSocket, and
  records each endpoint in a canonical SPEC.md.
---

# Page-to-API Requirements

Extracts every backend endpoint farish needs from the page specs and
wireframes, then records each one in `docs/api/<endpoint-slug>/SPEC.md`.
Designed so prompt step 18 is "for each page in INDEX.md, run this skill".

Read `docs/api/API-SPEC.md` for the required shape of each endpoint spec — this
skill does not inline those rules.

## Steps

1. Read `docs/pages/INDEX.md`. Note every page tagged `backend` or
   `backend_dependent: partial | yes` — these are the primary sources of
   remote requirements. Pages tagged `browser-only` may still contribute
   write actions (Share, Rate) that need backend endpoints.

2. Read `docs/api/API-SPEC.md` — internalize the required frontmatter,
   section order, and format rules before writing any endpoint spec.

3. For each page in INDEX.md, read its `docs/pages/<slug>/SPEC.md`. Extract
   two lists:
   - **Remote data items** — every entry in `## Data` marked `remote`.
     Each item maps to at least one endpoint (a read GET, a write POST/PUT,
     or both).
   - **Backend interactions** — every entry in `## Interactions` that
     triggers a server-side effect: publish, rate, view-count increment,
     search with server results, paginated fetch, user-profile lookup.

4. Collect requirements across all pages and group them into distinct
   endpoint records — one record per unique operation on a resource.
   `GET /models` (list/search) and `POST /models` (create) are separate
   endpoints even though they share a route.

5. For each endpoint record, choose the transport:

   **Use REST** when the operation is request-response: fetch a resource,
   search/filter/paginate, submit a mutation, increment a counter. All
   endpoints in farish's current social layer are REST.

   **Use WebSocket** only when the server needs to push a sequence of
   asynchronous messages over a long-lived connection: real-time generation
   progress, collaborative editing, live notifications. Reserve WebSocket
   for future server-side features.

   > **Note — Generate page**: the Generate page's AI calls go directly to
   > the Claude API from the browser using the user's own key via the
   > Claude Agent SDK. That stream is client-side only and does not require
   > a farish WebSocket. Mark the `generationStream` data item as
   > `browser-only` and exclude it from endpoint extraction.[^1]

6. For each endpoint, create `docs/api/<endpoint-slug>/SPEC.md` following
   `docs/api/API-SPEC.md`. Record transport, method/route, request shape
   (path params, query params, body), response body and status codes, auth
   requirement, error cases, and which source page specs require it. Create
   the parent directory `docs/api/<endpoint-slug>/` if missing.

7. Commit related endpoint specs atomically:
   `docs(api): add <resource> endpoint specs`
   Push after each resource group (models, users, leaderboards, etc.).

## Notes

- One `SPEC.md` per distinct operation — `GET /models` and `POST /models`
  get separate spec files.
- Keep each endpoint spec under ~100 lines (API-SPEC.md rule). If a
  resource has many operations, describe each in its own file rather than
  combining them.
- The `docs/api/` directory may not exist on first run; create it before
  writing the first spec.
- Steps 19–20 of the initial prompt are review loops on the output of this
  skill; keep specs in `draft` status until those passes complete.

## References

[^1]: Initial prompt step 17 — "You may use a websocket where necessary to
      provide realtime 2-way streams (eg if you want for the agent loop
      displaying steps in the browser)" — the current browser-only
      architecture satisfies this with the Claude Agent SDK client-side.
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
