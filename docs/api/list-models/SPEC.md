---
name: List Models
slug: list-models
transport: rest
method: GET
route: /models
auth: none
status: draft
source_pages:
  - home
  - explore
---

# List Models

## Summary

Returns a paginated, optionally filtered list of publicly shared models. Used
by the Explore page for browsable gallery + search, and by the Home page to
populate the TrendingStrip (most-viewed, small limit).[^1]

## Transport

REST — request-response read with query-parameter filtering and cursor
pagination; no server-push needed.[^2]

## Method & Route

`GET /models`

## Request

**Path params:** _None._

**Query params:**

| Param    | Type     | Required | Description                                                      |
|----------|----------|----------|------------------------------------------------------------------|
| `q`      | string   | no       | Full-text search over title and prompt.                         |
| `sort`   | string   | no       | `newest` \| `rating` \| `popular` \| `views`. Default: `newest`. |
| `filter` | string[] | no       | Tag/category slugs to AND-filter by. Serialised as repeated params: `?filter=tag1&filter=tag2`. |
| `page`   | integer  | no       | 1-based page number. Default: `1`.                              |
| `limit`  | integer  | no       | Results per page. Default: `24`; max: `100`.                    |

**Body:** _None._

**Headers:** _None required._

## Response

**200 OK**

| Field        | Type     | Nullable | Description                                           |
|--------------|----------|----------|-------------------------------------------------------|
| `items`      | object[] | no       | Array of model card objects (see below).              |
| `total`      | integer  | no       | Total matching records (for pagination UI).           |
| `page`       | integer  | no       | Current page number returned.                         |
| `totalPages` | integer  | no       | Total number of pages.                                |

Each item in `items`:

| Field         | Type    | Nullable | Description                              |
|---------------|---------|----------|------------------------------------------|
| `id`            | UUID    | no       | Unique model identifier.                        |
| `title`         | string  | no       | Model title.                                    |
| `thumbnailUrl`  | string  | yes      | URL to the model thumbnail image.               |
| `authorName`    | string  | no       | Display name of the creator.                    |
| `authorId`      | UUID    | no       | Creator's internal UUID.                        |
| `authorUsername`| string  | no       | Creator's public username handle (used to build `/u/:username` profile links). |
| `ratingAvg`     | number  | yes      | Average star rating (1–5); null if none.        |
| `viewCount`     | integer | no       | Total view count.                               |
| `createdAt`     | string  | no       | ISO 8601 creation timestamp.                    |

## Auth

None — the model gallery is publicly accessible without authentication.

## Errors

| Status | Condition                       | Body                                       |
|--------|---------------------------------|--------------------------------------------|
| 400    | Invalid `sort` value            | `{ "error": "invalid_sort" }`              |
| 400    | `limit` exceeds maximum         | `{ "error": "limit_too_large" }`           |
| 500    | Unexpected server error         | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/home/SPEC.md`](../../docs/pages/home/SPEC.md) — Home
  TrendingStrip (`sort=views`, small limit).
- [`../../docs/pages/explore/SPEC.md`](../../docs/pages/explore/SPEC.md) —
  Explore gallery with search, sort, and filter.

## Open Questions

- **Tag/category taxonomy.** The `filter` param's allowed values depend on a
  tag vocabulary not yet defined; defer to data-model design.[^3]
- **Cursor vs. offset pagination.** Offset pagination is used here (`page=N`)
  for simplicity; consider cursor-based pagination for large datasets or
  real-time feeds to avoid page-drift.[^4]

## References

[^1]: Home spec TrendingStrip data item —
      [`../../docs/pages/home/SPEC.md`](../../docs/pages/home/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Explore spec open question on filter taxonomy —
      [`../../docs/pages/explore/SPEC.md`](../../docs/pages/explore/SPEC.md).
[^4]: Initial prompt step 17 — API design guidance —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
