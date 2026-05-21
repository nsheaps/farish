# bun + TypeScript

[bun][bun] is farish's JavaScript runtime, package manager, and test runner.
This document is the spec for the bun workspace and the shared TypeScript
configuration.

[bun]: https://bun.sh

## Why bun

- **One tool, three jobs.** bun replaces `npm`/`yarn` (package manager),
  `node` (runtime), and `jest`/`vitest` (test runner) — fewer moving parts.[^bun-docs]
- **Native TypeScript.** bun runs `.ts` files directly with no build step,
  which keeps local DX fast.[^bun-ts]
- **Workspaces.** bun supports npm-style workspaces, which nx reads to build the
  project graph.[^bun-workspaces]

## Workspace layout

The root `package.json` declares the workspace globs:

```json
{
  "workspaces": ["lib/*", "packages/*", "apps/*", "services/*"]
}
```

Each matching directory with a `package.json` is a workspace package. Packages
depend on each other with the `workspace:*` protocol:

```json
{ "dependencies": { "@farish/core": "workspace:*" } }
```

`bun install` symlinks `workspace:*` dependencies into `node_modules`, and nx
reads them to order the task graph (see [nx.md](./nx.md)).

## TypeScript configuration

There are two root tsconfig files plus one per package:

| File                  | Role                                                       |
| --------------------- | ---------------------------------------------------------- |
| `tsconfig.base.json`  | Shared strict compiler options. Every package extends it.  |
| `tsconfig.json`       | Solution file — `references` every package for `tsc -b`.   |
| `<pkg>/tsconfig.json` | Extends the base; sets `outDir`, `rootDir`, `composite`.   |

### Strictness — the spec

`tsconfig.base.json` enables full strictness. Notable flags:

| Flag                              | Effect                                            |
| --------------------------------- | ------------------------------------------------- |
| `strict`                          | All strict-family checks on.                      |
| `noUncheckedIndexedAccess`        | Index access yields `T \| undefined`.             |
| `noImplicitReturns`               | Every code path must return.                      |
| `noUnusedLocals` / `Parameters`   | Dead bindings are errors.                         |
| `exactOptionalPropertyTypes`      | `?:` and `\| undefined` are distinct.             |
| `verbatimModuleSyntax`            | Import/export elision is explicit (`import type`).|
| `rewriteRelativeImportExtensions` | Source imports `./x.ts`; `tsc` emits `./x.js`.    |

### The `.ts` import-extension choice

bun runs `import './handler.ts'` natively, but plain `tsc` rejects a `.ts`
extension when emitting. farish enables `allowImportingTsExtensions` +
`rewriteRelativeImportExtensions` (TypeScript 5.7+) so source files use the
bun-native `.ts` form **and** `tsc` rewrites them to `.js` in `dist/`. One import
style works for both the runtime and the build.[^ts-rewrite]

## Per-package run-scripts

Every package defines the standard scripts (initial prompt step 22):

```json
{
  "scripts": {
    "lint":   "biome lint ./src",
    "format": "biome check --write ./src",
    "test":   "bun test",
    "build":  "tsc -p tsconfig.json"
  }
}
```

`build` runs `tsc` (type-check + emit `dist/`). `test` runs `bun test` (bun's
built-in Jest-compatible runner). Lint/format go through Biome
(see [lint-format.md](./lint-format.md)).

## Common commands

```sh
bun install                 # install workspace dependencies
bun test                    # run tests in the current package
bun run <script>            # run a package.json script
bun run apps/cli/src/main.ts # run a TS file directly (no build)
```

## References

[^bun-docs]: bun documentation — <https://bun.sh/docs>
[^bun-ts]: bun — TypeScript support — <https://bun.sh/docs/runtime/typescript>
[^bun-workspaces]: bun — workspaces — <https://bun.sh/docs/install/workspaces>
[^ts-rewrite]: TypeScript 5.7 — `rewriteRelativeImportExtensions` — <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html>
