---
name: Create Model
slug: create-model
transport: rest
method: POST
route: /models
auth: required
status: draft
source_pages:
  - generate
---

# Create Model

## Summary

Publishes a locally generated model to the shared backend, making it
discoverable via Explore, Leaderboards, and Profile. Called when the user
clicks Share on the Generate page after generation completes.[^1]

## Transport

REST — single request-response mutation to create a new resource.[^2]

## Method & Route

`POST /models`

## Request

**Path params:** _None._

**Query params:** _None._

**Body** (`multipart/form-data` or `application/json` with base64 geometry):

| Field         | Type   | Required | Description                                                   |
|---------------|--------|----------|---------------------------------------------------------------|
| `title`       | string | no       | Human-readable title; server derives from prompt if omitted.  |
| `prompt`      | string | yes      | Natural language prompt used to generate the model.           |
| `params`      | object | yes      | Generation params: `resolution`, `style`, `complexity`.       |
| `geometry`    | binary | yes      | GLB geometry file (multipart field or base64 string).[^3]     |
| `thumbnail`   | binary | no       | Preview thumbnail image (JPEG/PNG); server generates if absent.|

**Headers:**

| Header          | Required | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `Authorization` | yes      | `Bearer <token>` — Claude OAuth or API key.      |
| `Content-Type`  | yes      | `multipart/form-data` or `application/json`.     |

## Response

**201 Created**

| Field          | Type   | Nullable | Description                                       |
|----------------|--------|----------|---------------------------------------------------|
| `id`           | UUID   | no       | Newly assigned model identifier.                  |
| `title`        | string | no       | Resolved title (provided or prompt-derived).      |
| `geometryUrl`  | string | no       | Public URL to the stored GLB file.                |
| `thumbnailUrl` | string | yes      | Public URL to the stored thumbnail.               |
| `createdAt`    | string | no       | ISO 8601 creation timestamp.                      |

## Auth

Required — `Authorization: Bearer <token>` (Claude OAuth token or API key).
Unauthenticated requests are rejected with 401.[^4]

## Errors

| Status | Condition                          | Body                                       |
|--------|------------------------------------|--------------------------------------------|
| 400    | Missing required field             | `{ "error": "validation_error", "fields": [...] }` |
| 400    | Geometry file too large or invalid | `{ "error": "invalid_geometry" }`          |
| 401    | Bearer token missing or invalid    | `{ "error": "unauthorized" }`              |
| 413    | Payload too large                  | `{ "error": "payload_too_large" }`         |
| 500    | Unexpected server error            | `{ "error": "internal_error" }`            |

## Source Pages

- [`../../docs/pages/generate/SPEC.md`](../../docs/pages/generate/SPEC.md) —
  Share button triggers this endpoint after generation completes.

## Open Questions

- **Geometry upload strategy.** Accepting a binary GLB in the POST body is
  simple but limits file size. Consider a two-step flow: client requests a
  pre-signed object-storage URL, uploads directly, then POSTs the URL here.
  Deferred to implementation.[^5]
- **Thumbnail auto-generation.** Server-side thumbnail generation requires a
  headless renderer (e.g. Puppeteer + Three.js). Accepting a client-provided
  thumbnail is simpler for v1.
- **Max geometry size.** Vercel free plan has a 4.5 MB body limit; GLB files
  may exceed this — pre-signed upload workaround may be mandatory.[^6]

## References

[^1]: Generate spec Share interaction and `create-model` backend action —
      [`../../docs/pages/generate/SPEC.md`](../../docs/pages/generate/SPEC.md).
[^2]: API-SPEC.md REST vs WebSocket decision —
      [`../API-SPEC.md`](../API-SPEC.md).
[^3]: glTF 2.0 / GLB format — <https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html>.
[^4]: Initial prompt — "user can input their claude-code api key or oauth api key" —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^5]: Amendment A3 — Vercel backend (free plan) —
      [`../../docs/INITIAL_PROMPT.md`](../../docs/INITIAL_PROMPT.md).
[^6]: Vercel free plan limits — <https://vercel.com/docs/limits/overview>.
