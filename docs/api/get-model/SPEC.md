---
name: Get Model
slug: get-model
transport: rest
method: GET
route: /models/:id
auth: none
status: draft
source_pages:
  - model-detail
  - explore
  - leaderboards
  - profile
  - home
---

# Get Model

## Summary

Returns the full record for a single publicly shared model, including its
prompt, generation parameters, geometry URL, metadata, and social counters.
Used by Model Detail to populate the viewer and info panel.[^1]

## Transport

REST — single request-response fetch of a known resource by identifier.[^2]

## Method & Route

`GET /models/:id`

## Request

**Path params:**

| Param | Type | Required | Description               |
|-------|------|----------|---------------------------|
| `:id` | UUID | yes      | Unique shared model ID.   |

**Query params:** _None._

**Body:** _None._

**Headers:** _None required._

## Response

**200 OK**

| Field          | Type    | Nullable | Description                                       |
|----------------|---------|----------|---------------------------------------------------|
| `id`           | UUID    | no       | Unique model identifier.                          |
| `title`        | string  | no       | Model title (derived from prompt if not set).     |
| `prompt`       | string  | no       | Natural language prompt used to generate it.      |
| `params`       | object  | no       | Generation params: `resolution`, `style`, `complexity`. |
| `geometryUrl`  | string  | no       | URL to the GLB geometry file.[^3]                 |
| `thumbnailUrl` | string  | yes      | URL to the preview thumbnail image.               |
| `authorName`    | string  | no       | Display name of the creator.                                    |
| `authorId`      | UUID    | no       | Creator's internal UUID.                                        |
| `authorUsername`| string  | no       | Creator's public username handle (used to build `/u/:username` profile links). |
| `createdAt`    | string  | no       | ISO 8601 creation timestamp.                      |
| `viewCount`    | integer | no       | Total view count.                                 |
| `ratingAvg`    | number  | yes      | Average star rating (1–5); null if no ratings.    |
| `ratingCount`  | integer | no       | Number of ratings submitted.                      |

## Auth

None — shared models are publicly accessible without authentication.

## Errors

| Status | Condition                       | Body                                      |
|--------|---------------------------------|--------------------------------------------|
| 404    | Model not found or not public   | `{ "error": "model_not_found" }`           |
| 500    | Unexpected server error         | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md) —
  primary consumer; populates ThreeDViewer and MetadataPanel.
- [`../../docs/pages/explore/SPEC.md`](../../docs/pages/explore/SPEC.md) —
  card click navigates to `/m/:id`, triggering this fetch.
- [`../../docs/pages/leaderboards/SPEC.md`](../../docs/pages/leaderboards/SPEC.md) —
  card click navigates to `/m/:id`.
- [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md) —
  card click navigates to `/m/:id`.
- [`../../docs/pages/home/SPEC.md`](../../docs/pages/home/SPEC.md) —
  TrendingStrip card click navigates to `/m/:id`.

## Open Questions

- **Private/draft models.** The current spec covers only public shared models.
  When draft/private model support is added, auth and visibility rules will
  need extending.[^4]

## References

[^1]: Model Detail spec `model` data item (remote) —
      [`../../docs/pages/model-detail/SPEC.md`](../../docs/pages/model-detail/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: glTF 2.0 / GLB format — <https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html>.
[^4]: Initial prompt step 17 — API design guidance —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
