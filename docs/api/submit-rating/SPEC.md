---
name: Submit Rating
slug: submit-rating
transport: rest
method: PUT
route: /models/:id/rating
auth: required
status: draft
source_pages:
  - model-detail
---

# Submit Rating

## Summary

Creates or replaces the authenticated user's star rating for a shared model.
PUT semantics are used so repeated calls from the same user simply update their
rating rather than creating duplicates. The response returns the updated
aggregate counters so the client can refresh the display immediately.[^1]

## Transport

REST — idempotent upsert mutation; no server-push needed.[^2]

## Method & Route

`PUT /models/:id/rating`

## Request

**Path params:**

| Param | Type | Required | Description              |
|-------|------|----------|--------------------------|
| `:id` | UUID | yes      | Unique shared model ID.  |

**Query params:** _None._

**Body** (`application/json`):

| Field   | Type    | Required | Description                                |
|---------|---------|----------|--------------------------------------------|
| `stars` | integer | yes      | Star rating value — must be 1 through 5.   |

**Headers:**

| Header          | Required | Description                                  |
|-----------------|----------|----------------------------------------------|
| `Authorization` | yes      | `Bearer <token>` — Claude OAuth or API key.  |
| `Content-Type`  | yes      | `application/json`                           |

## Response

**200 OK**

| Field         | Type    | Nullable | Description                                  |
|---------------|---------|----------|----------------------------------------------|
| `ratingAvg`   | number  | no       | Updated average rating (1–5, two decimals).  |
| `ratingCount` | integer | no       | Updated total number of ratings.             |
| `userStars`   | integer | no       | The star value just recorded for this user.  |

## Auth

Required — `Authorization: Bearer <token>`. Unauthenticated requests are
rejected with 401 so ratings are tied to an identity.[^3]

## Errors

| Status | Condition                          | Body                                            |
|--------|------------------------------------|-------------------------------------------------|
| 400    | `stars` missing or out of range    | `{ "error": "invalid_stars" }`                  |
| 401    | Bearer token missing or invalid    | `{ "error": "unauthorized" }`                   |
| 404    | Model not found or not public      | `{ "error": "model_not_found" }`                |
| 500    | Unexpected server error            | `{ "error": "internal_error" }`                 |

## Source Pages

- [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md) —
  RatingWidget triggers this endpoint; the response updates MetadataPanel
  counters in place.

## Open Questions

- **Self-rating.** Should creators be able to rate their own models? Recommend
  no — server should return 403 if `authorId` matches the token identity.
  Deferred to implementation.[^4]
- **Rating deletion.** No DELETE is defined here; a user who wants to "remove"
  their rating would need a separate endpoint or a convention (e.g. `stars: 0`).
  Deferred to implementation.

## References

[^1]: Model Detail spec `userRating` data item (remote, write) —
      [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Initial prompt — "best rated … most rated (aka popular)" social
      requirements — [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^4]: Initial prompt step 17 — API design guidance —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
