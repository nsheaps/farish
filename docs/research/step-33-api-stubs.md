# Step 33 — API Endpoint Stubs

**Prompt step:** 33 — "Iteratively stub out api, perform a validate/improve loop."[^1]

## Summary

All 8 endpoints specified in `docs/api/` are now stubbed in `services/api`. Each
route: (a) is registered at the correct method + path, (b) validates its required
parameters and returns spec-compliant errors, and (c) returns a well-shaped stub
response populated from `@farish/mock-data` deterministic generators. No real data
storage is involved — that is step 35.

`mise run check` is green across all 9 nx projects. The API package now passes
63 tests (unit + integration).

---

## Endpoints Stubbed

| Endpoint            | Method | Route                    | Auth       | Status |
|---------------------|--------|--------------------------|------------|--------|
| List Models         | GET    | `/models`                | none       | stubbed |
| Create Model        | POST   | `/models`                | required   | stubbed |
| Get Model           | GET    | `/models/:id`            | none       | stubbed |
| Record View         | POST   | `/models/:id/views`      | optional   | stubbed |
| Submit Rating       | PUT    | `/models/:id/rating`     | required   | stubbed |
| Get Leaderboard     | GET    | `/leaderboard`           | none       | stubbed |
| Get User Profile    | GET    | `/users/:username`       | none       | stubbed |
| List User Models    | GET    | `/users/:username/models`| none       | stubbed |

---

## Stub Response Strategy

Each endpoint returns deterministic mock data so the same request always
produces the same response — making integration tests stable.

| Endpoint           | Mock data source                                                |
|--------------------|-----------------------------------------------------------------|
| List Models        | `mockModelCards(limit, seed=1)` — spec-shaped ModelCard array  |
| Get Model          | `mockModelDetail(id)` — seeded by the `:id` path param         |
| Create Model       | `createLorem(Date.now % 1000)` — non-deterministic id on every call |
| Record View        | No body — `204 No Content`                                     |
| Submit Rating      | Aggregates derived from model id seed + submitted stars        |
| Get Leaderboard    | `mockModelCards(limit, seed=42)` + rank/metric derived by board |
| Get User Profile   | `createLorem(username seed)` + stats derived from username seed |
| List User Models   | `mockModelCards(limit, seed=username hash)` sliced by page/limit |

---

## Router Extension

The step-26 router used exact string matching (`r.path === pathname`). To
support `:param` path segments, `router.ts` was extended with:

- **`matchPath(pattern, pathname)`** — converts `:param` segments to capture
  groups, returns a `Record<string, string>` of captured values or `null`.
- **Updated routing loop** — iterates routes, calls `matchPath`, stops on the
  first match. Correct ordering in `index.ts` ensures more-specific routes
  (e.g. `/users/:username/models`) are checked before less-specific ones
  (e.g. `/users/:username`).
- **`extractBearerToken(req)`** — extracts the raw token from `Authorization:
  Bearer <token>`, returns `null` when absent.
- **`noContent()`** — returns a `204 No Content` response with CORS headers.
- **Response passthrough** — if a handler returns a `Response` directly (e.g.
  `errorResponse()`, `noContent()`, or the 201 from `create-model`), the router
  forwards it without re-wrapping in JSON.
- **RouteHandler** signature updated to `(req, params)` — existing
  zero-argument handlers remain compatible (TypeScript allows functions with
  fewer params to satisfy a type with more params).

---

## API Contract Updates

`lib/api-contract/src/index.ts` was extended with all step-33 interfaces:[^2]

- `ModelCard` — spec-compliant list item (replaces `ModelSummary` in API paths)
- `ListModelsResponse` — updated to `{ items, total, page, totalPages }`
- `GetModelResponse` — full model record including params, author fields, counters
- `CreateModelResponse` — 201 payload (id, title, geometryUrl, thumbnailUrl, createdAt)
- `ModelParams` — `{ resolution, style, complexity }`
- `GetLeaderboardResponse` / `LeaderboardItem`
- `GetUserProfileResponse`
- `ListUserModelsResponse` / `UserModelCard`
- `SubmitRatingResponse`
- `ApiValidationError`
- `LeaderboardBoard` / `LeaderboardPeriod` union types
- `ROUTES` extended with all 8 endpoint path patterns

`ModelSummary` is kept with a deprecation notice for backward compatibility with
the browser app's ghost wireframes (which are not yet connected to the API).

---

## Mock-Data Updates

`lib/mock-data/src/mock-models.ts` adds `mockModelCards(count, seed)` which
produces `ModelCard[]` matching the new contract shape. `mockModelSummaries` is
kept (deprecated) for existing page consumers. `index.ts` re-exports
`mockModelCards`.

---

## Validation / Error Paths Implemented

| Route          | Validated params / errors                                       |
|----------------|-----------------------------------------------------------------|
| List Models    | `sort` must be in `{newest,rating,popular,views}`; `limit` ≤ 100 |
| Create Model   | `Authorization: Bearer` header required → 401 if absent        |
| Record View    | `:id` must be non-empty → 404 if missing                       |
| Submit Rating  | Auth required → 401; `stars` must be integer 1–5 → 400         |
| Get Leaderboard| `board` in `{rated,popular,viewed}` → 400; `period` in `{1w,1m,1y,all}` → 400 |
| Get User Profile | `:username` must be non-empty → 404 if missing               |
| List User Models | `:username` required; `limit` ≤ 100                         |

---

## Tests Added

**`services/api/src/routes/routes.test.ts`** — unit test suites for every route:
- Route descriptor (method + path)
- Payload shape matches contract fields
- Error paths (invalid params, missing auth, out-of-range values)
- Determinism (same input → same output)

**`services/api/src/server.integration.test.ts`** — HTTP smoke tests over a
real `Bun.serve` instance:
- Happy-path 200/201/204 for every endpoint
- Key error responses (401, 400, 404)
- Route-ordering test (`/users/:username/models` matched before `/users/:username`)

Total: **63 tests, 0 failures**.

---

## `mise run check` Result

```
NX   Successfully ran target test for 9 projects
NX   Successfully ran target build for 9 projects
==> check passed
```

---

## Commits

| Commit   | Description                                                          |
|----------|----------------------------------------------------------------------|
| `95bd8a4`| feat(api-contract): add step-33 endpoint types and route constants   |
| `845dea2`| feat(mock-data): add mockModelCards for spec-compliant ModelCard shape |
| `8a452d8`| feat(api): extend router with path-param matching and auth/no-content helpers |
| `9eb76e5`| feat(api): stub all 8 endpoint routes with mock data (step 33)       |
| `dce4c93`| test(api): add per-endpoint unit tests and integration smoke tests (step 33) |

---

## References

[^1]: Initial prompt step 33 — [`docs/INITIAL_PROMPT.md`](../INITIAL_PROMPT.md).
[^2]: Endpoint specs — `docs/api/*/SPEC.md` (8 files in `docs/api/`).
