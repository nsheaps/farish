---
name: validate-change-code
description: >
  Validate a source-code change (TypeScript, bun packages, monorepo apps/libs/
  services/packages). Use when asked to "validate code changes", "check the code
  compiles", or from validate-change when changed paths are under apps/,
  services/, lib/, or packages/.
---

# Validate Change — Code

Validation procedure for TypeScript/bun source-code changes.

> **Tooling confirmed in step 22** — bun + nx + Biome. See
> [`docs/monorepo/`](https://github.com/nsheaps/farish/tree/claude/ai-3d-model-generator-XjoUi/docs/monorepo).

## Steps

1. Identify which bun package(s) contain the changed files. Each package is
   rooted at a `package.json` under `lib/`, `packages/`, `apps/`, or
   `services/`.

2. Run the full validation gate from the repo root — nx handles dependency
   ordering and caching, so this covers the affected packages and everything
   that depends on them:
   ```
   mise run check
   ```
   `check` runs lint → test → build. It is the exact sequence CI runs.

3. To validate a single project and its dependencies (faster inner loop):
   ```
   nx run-many --target=lint --target=test --target=build --projects=<name>
   ```
   or for one project + its dependency chain: `nx build <name>`.

4. The `build` target runs `tsc` (type-check **and** emit). A clean
   `mise run build` is the type-check — there is no separate `typecheck`
   script.

5. Confirm all tests pass; no skipped tests should be introduced without a
   reason recorded in the test file.

6. If a package has a `release` script and the change affects public API or
   versioning, run `nx run <name>:release` (note: `nx release` is a different,
   reserved command — always use `nx run <name>:release`).

7. Run `Skill(build-confidence-by-trying-to-prove-incorrect)` for any complex
   logic change to surface edge cases before committing.

## Notes

- **Always go through `mise run`** — never call `nx` directly in CI; local and
  CI codepaths must stay identical (initial prompt step 24).
- All four run-scripts (`lint`, `format`, `test`, `build`) are required in every
  bun package; `release` is optional for publishable packages.
- Custom lint rules live in `.biome/plugins/` (GritQL). `mise run lint` loads
  them. See [`docs/monorepo/lint-format.md`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/docs/monorepo/lint-format.md).
