---
name: monorepo-tasks
description: Run lint, format, test, and build across the farish monorepo. Use when working in the farish repo and you need to validate changes with the shared toolchain.
---

# Monorepo Tasks

The farish monorepo is driven by mise (org-wide tasks) over nx (task graph).

## Steps

1. Install tools and dependencies: `mise run bootstrap`.
2. Lint everything: `mise run lint`.
3. Autofix formatting: `mise run format`.
4. Run tests: `mise run test`.
5. Build (respects dependency order): `mise run build`.
6. Full gate (the same sequence CI runs): `mise run check`.

These are the only entrypoints — never call `nx` directly in docs or CI; go
through `mise run`, so local and CI codepaths stay identical.

See [`docs/monorepo/`](../../../../docs/monorepo/) for the full guides.
