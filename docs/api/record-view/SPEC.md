---
name: Record View
slug: record-view
transport: rest
method: POST
route: /models/:id/views
auth: optional
status: draft
source_pages:
  - model-detail
---

# Record View

## Summary

Increments the view counter for a shared model. Called once when Model Detail
loads a remote model record. Deduplication is server-managed: authenticated
requests dedup by user identity; unauthenticated requests dedup by IP and a
short time window.[^1]

## Transport

REST — a fire-and-forget mutation; the client does not need the response
body to continue rendering the page.[^2]

## Method & Route

`POST /models/:id/views`

## Request

**Path params:**

| Param | Type | Required | Description              |
|-------|------|----------|--------------------------|
| `:id` | UUID | yes      | Unique shared model ID.  |

**Query params:** _None._

**Body:** _None._

**Headers:**

| Header          | Required | Description                                              |
|-----------------|----------|----------------------------------------------------------|
| `Authorization` | no       | `Bearer <token>` — enables user-level deduplication.    |

## Response

**204 No Content** — no response body; the client ignores this response.

## Auth

Optional — the endpoint accepts unauthenticated requests. If a valid bearer
token is provided it is used for finer-grained deduplication; absence does
not fail the request.[^3]

## Errors

| Status | Condition                       | Body                                      |
|--------|---------------------------------|--------------------------------------------|
| 404    | Model not found or not public   | `{ "error": "model_not_found" }`           |
| 500    | Unexpected server error         | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md) —
  fires once on load when the model is a remote (non-`local:`) record.

## Open Questions

- **Deduplication window.** Unauthenticated dedup by IP within a time window
  (e.g. 24 hours) prevents trivial inflation; exact window TBD at
  implementation.[^4]
- **View count on local models.** The Model Detail spec asks whether viewing
  a local copy of a published model should increment the remote counter.
  Resolved: only explicit remote fetches trigger this endpoint.[^1]

## References

[^1]: Model Detail spec open question on view count increment —
      [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Initial prompt — "most viewed" social counter requirement —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^4]: Initial prompt step 17 — API design guidance —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
