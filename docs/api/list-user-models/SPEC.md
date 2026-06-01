---
name: List User Models
slug: list-user-models
transport: rest
method: GET
route: /users/:username/models
auth: none
status: draft
source_pages:
  - profile
---

# List User Models

## Summary

Returns a paginated list of publicly shared models authored by a specific
creator. Used by the Profile page to populate the ModelGrid below the
ProfileHeader.[^1]

## Transport

REST — request-response read with offset pagination; no server-push needed.[^2]

## Method & Route

`GET /users/:username/models`

## Request

**Path params:**

| Param       | Type   | Required | Description                       |
|-------------|--------|----------|-----------------------------------|
| `:username` | string | yes      | Creator's public username handle. |

**Query params:**

| Param   | Type    | Required | Description                                   |
|---------|---------|----------|-----------------------------------------------|
| `page`  | integer | no       | 1-based page number. Default: `1`.            |
| `limit` | integer | no       | Results per page. Default: `24`; max: `100`.  |

**Body:** _None._

**Headers:** _None required._

## Response

**200 OK**

| Field        | Type     | Nullable | Description                                           |
|--------------|----------|----------|-------------------------------------------------------|
| `items`      | object[] | no       | Array of model card objects (see below).              |
| `total`      | integer  | no       | Total number of public models for this user.          |
| `page`       | integer  | no       | Current page number returned.                         |
| `totalPages` | integer  | no       | Total number of pages.                                |

Each item in `items`:

| Field         | Type    | Nullable | Description                              |
|---------------|---------|----------|------------------------------------------|
| `id`          | UUID    | no       | Unique model identifier.                 |
| `title`       | string  | no       | Model title.                             |
| `thumbnailUrl`| string  | yes      | URL to the preview thumbnail.            |
| `ratingAvg`   | number  | yes      | Average star rating; null if none.       |
| `viewCount`   | integer | no       | Total view count.                        |
| `createdAt`   | string  | no       | ISO 8601 creation timestamp.             |

## Auth

None — a creator's public model list is accessible without authentication.[^3]

## Errors

| Status | Condition                       | Body                                       |
|--------|---------------------------------|--------------------------------------------|
| 404    | Username not found              | `{ "error": "user_not_found" }`            |
| 400    | `limit` exceeds maximum         | `{ "error": "limit_too_large" }`           |
| 500    | Unexpected server error         | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md) —
  ModelGrid fetches this list; Load More / pagination triggers subsequent
  pages.

## Open Questions

- **Default sort.** Newest-first is assumed; a `sort` param (e.g. `newest`,
  `rating`, `views`) may be added in a follow-up pass.[^4]
- **Pagination style.** Offset pagination used here for simplicity; cursor-
  based pagination preferred for large galleries — defer to implementation.

## References

[^1]: Profile spec `userModels` data item (remote, read-only) —
      [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Initial prompt — public profile / social layer —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^4]: Profile spec open question on pagination —
      [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md).
