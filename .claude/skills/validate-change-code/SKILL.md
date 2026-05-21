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

> **Keep up to date.** Tooling is established in step 22 of the initial prompt.
> Update this skill as commands and scripts are confirmed.

## Steps

1. Identify which bun package(s) contain the changed files. Each package is
   rooted at a `package.json`.

2. Run `lint` for each affected package:
   ```
   bun run lint
   ```
   (Command TBD — update when step 22 tooling lands.)

3. Run the TypeScript type-check for each affected package:
   ```
   bun run typecheck
   ```
   (Or the equivalent `tsc --noEmit` invocation once confirmed.)

4. Run `test` for each affected package:
   ```
   bun run test
   ```
   Confirm all tests pass; no skipped tests should be introduced without a
   reason recorded in the test file.

5. Run `build` for each affected package:
   ```
   bun run build
   ```
   Confirm the build output is produced without errors.

6. If the package has a `release` script and the change affects public API or
   package versioning, run it in dry-run mode if supported.

7. Run `Skill(build-confidence-by-trying-to-prove-incorrect)` for any complex
   logic change to surface edge cases before committing.

## Notes

- Prefer `nx run <package>:<task>` once nx is wired in step 22 — nx handles
  dependency ordering and caching.
- All four run scripts (lint, format, test, build) are required in every bun
  package per step 22 of the initial prompt.
- **Update this skill** when step 22 confirms the exact lint/typecheck tooling.
