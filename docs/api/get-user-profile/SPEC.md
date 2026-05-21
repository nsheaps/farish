---
name: Get User Profile
slug: get-user-profile
transport: rest
method: GET
route: /users/:username
auth: none
status: draft
source_pages:
  - profile
---

# Get User Profile

## Summary

Returns the public profile record for a creator: display name, avatar,
join date, and aggregate stats (total shared models, average rating received,
cumulative views). Used by the Profile page to populate the ProfileHeader.[^1]

## Transport

REST — request-response read of a single user resource.[^2]

## Method & Route

`GET /users/:username`

## Request

**Path params:**

| Param       | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| `:username` | string | yes      | Creator's public username handle. |

**Query params:** _None._

**Body:** _None._

**Headers:** _None required._

## Response

**200 OK**

| Field        | Type    | Nullable | Description                                           |
|--------------|---------|----------|-------------------------------------------------------|
| `username`   | string  | no       | Public username handle.                               |
| `displayName`| string  | no       | Human-readable display name.                          |
| `avatarUrl`  | string  | yes      | URL to the user's avatar image; null if not set.      |
| `joinDate`   | string  | no       | ISO 8601 date the account was created.                |
| `modelCount` | integer | no       | Total number of publicly shared models.               |
| `avgRating`  | number  | yes      | Average rating across all the user's shared models.   |
| `totalViews` | integer | no       | Cumulative view count across all shared models.       |

## Auth

None — public profiles are accessible without authentication.[^3]

## Errors

| Status | Condition                          | Body                                       |
|--------|------------------------------------|--------------------------------------------|
| 404    | Username not found                 | `{ "error": "user_not_found" }`            |
| 500    | Unexpected server error            | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md) —
  ProfileHeader is built from this response.

## Open Questions

- **Username source.** The Profile spec notes this may come from the Claude
  OAuth display name or a farish-specific field; auth design resolves
  this.[^4]
- **Blocking / private profiles.** No visibility controls are specified for
  v1 — all accounts are publicly visible by default.

## References

[^1]: Profile spec `userProfile` data item (remote, read-only) —
      [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: Initial prompt — social layer, public profiles —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^4]: Profile spec open question on username source —
      [`../../docs/pages/profile/SPEC.md`](../../docs/pages/profile/SPEC.md).
