---
name: Get Leaderboard
slug: get-leaderboard
transport: rest
method: GET
route: /leaderboard
auth: none
status: draft
source_pages:
  - leaderboards
---

# Get Leaderboard

## Summary

Returns an ordered list of up to 50 ranked models for one of three boards
(Best Rated, Most Rated / Popular, Most Viewed) filtered to a chosen time
bucket (1 week, 1 month, 1 year, or all time). Consumed by the Leaderboards
page to populate its RankedList.[^1]

## Transport

REST — request-response read parameterised by board type and period; no
server-push needed.[^2]

## Method & Route

`GET /leaderboard`

## Request

**Path params:** _None._

**Query params:**

| Param    | Type    | Required | Description                                                                    |
|----------|---------|----------|--------------------------------------------------------------------------------|
| `board`  | string  | yes      | Ranking metric: `rated` \| `popular` \| `viewed`.                             |
| `period` | string  | yes      | Time window: `1w` \| `1m` \| `1y` \| `all`.                                  |
| `limit`  | integer | no       | Maximum results. Default: `50`; max: `50`.                                     |

**Body:** _None._

**Headers:** _None required._

## Response

**200 OK**

| Field   | Type     | Nullable | Description                              |
|---------|----------|----------|------------------------------------------|
| `board` | string   | no       | Active board value echoed back.          |
| `period`| string   | no       | Active period value echoed back.         |
| `items` | object[] | no       | Ordered array of ranked model entries.   |

Each item in `items`:

| Field         | Type    | Nullable | Description                                                    |
|---------------|---------|----------|----------------------------------------------------------------|
| `rank`        | integer | no       | 1-based rank position.                                         |
| `id`          | UUID    | no       | Unique model identifier.                                       |
| `title`       | string  | no       | Model title.                                                   |
| `thumbnailUrl`| string  | yes      | URL to the preview thumbnail.                                  |
| `authorName`    | string  | no       | Creator display name.                                                   |
| `authorId`      | UUID    | no       | Creator's internal UUID.                                                |
| `authorUsername`| string  | no       | Creator's public username handle (used to build `/u/:username` profile links). |
| `metricValue` | number  | no       | Board metric value: avg rating, rating count, or view count.   |
| `createdAt`   | string  | no       | ISO 8601 creation timestamp (for tie-break display).           |

## Auth

None — leaderboards are publicly visible without authentication.[^3]

## Errors

| Status | Condition                        | Body                                        |
|--------|----------------------------------|---------------------------------------------|
| 400    | Invalid or missing `board`       | `{ "error": "invalid_board" }`              |
| 400    | Invalid or missing `period`      | `{ "error": "invalid_period" }`             |
| 500    | Unexpected server error          | `{ "error": "internal_error" }`             |

## Source Pages

- [`../../docs/pages/leaderboards/SPEC.md`](../../docs/pages/leaderboards/SPEC.md) —
  BoardTabs + TimeBucketSelector drive the `board` and `period` params;
  RankedList renders the response `items`.

## Open Questions

- **Tie-breaking rule.** When two models share the same metric value, the
  recommended default is earlier `createdAt` wins; confirm at
  implementation.[^4]
- **Result freshness.** Whether rankings are computed on-the-fly or from a
  periodically refreshed materialised view is an implementation decision;
  caching strategy affects staleness tolerance.

## References

[^1]: Leaderboards spec `rankings` data item (remote, read-only) —
      [`../../docs/pages/leaderboards/SPEC.md`](../../docs/pages/leaderboards/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Initial prompt — "best rated (1w/1m/1y/all), most rated … most viewed" —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^4]: Leaderboards spec open question on tie-breaking —
      [`../../docs/pages/leaderboards/SPEC.md`](../../docs/pages/leaderboards/SPEC.md).
