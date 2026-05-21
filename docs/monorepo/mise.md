# mise — Tool Manager & Org-Wide Tasks

[mise][mise] is farish's tool manager and the single entrypoint for org-wide
tasks. This document is the spec for `mise.toml` and `.mise/`.

[mise]: https://mise.jdx.dev

## Why mise

- **Reproducible toolchain.** `mise.toml` pins exact versions of bun, node, and
  direnv. Every developer and every CI runner gets identical tools — no "works
  on my machine".[^mise-tools]
- **One task surface.** The `[tasks]` block is the *only* place org-wide
  commands are defined. Local DX and CI both call `mise run <task>`, so the two
  codepaths can never drift (initial prompt step 24).[^mise-tasks]

## `mise.toml` — the spec

### `[tools]` — pinned versions

```toml
[tools]
bun = "1.3.11"
node = "22.22.2"
direnv = "latest"
```

`mise install` reads this block and installs each tool. Adding a tool here makes
it available to every shell that has mise activated (via direnv — see
[direnv.md](./direnv.md)).

### Why nx is **not** a mise tool

`nx` is deliberately a **workspace devDependency** (in the root `package.json`,
locked by `bun.lock`) — not a `[tools]` entry. The nx CLI version must stay in
lockstep with the `@nx/*` plugin versions resolved by bun; pinning it separately
in mise would let the two drift. mise still *runs* nx — the `node_modules/.bin`
directory is added to `PATH` via the `[env]` block.

### `[env]` — environment

```toml
[env]
_.path = ["node_modules/.bin"]
```

Puts workspace-local binaries (`nx`, `biome`, `tsc`) on `PATH` so they are
callable without a `bunx`/`npx` prefix.

### `[tasks]` — org-wide entrypoints

Each task is a thin wrapper over nx. One-line tasks are inline; multi-step tasks
delegate to a script in `.mise/tasks/`.

| Task        | Implementation                          |
| ----------- | --------------------------------------- |
| `bootstrap` | `.mise/tasks/bootstrap.sh`              |
| `lint`      | `nx run-many --target=lint --all`       |
| `format`    | `nx run-many --target=format --all`     |
| `test`      | `nx run-many --target=test --all`       |
| `build`     | `nx run-many --target=build --all`      |
| `check`     | `.mise/tasks/check.sh`                  |
| `graph`     | `nx graph --file=.nx-graph.json`        |

## `.mise/tasks/` — script directory

**Rule:** anything beyond a one-line command that an org-wide task needs is a
script here, not inlined into `mise.toml`. Scripts must be executable
(`chmod +x`) and start with `#!/usr/bin/env bash` + `set -euo pipefail`.

| Script                | Task                 |
| --------------------- | -------------------- |
| `bootstrap.sh`        | `mise run bootstrap` |
| `check.sh`            | `mise run check`     |
| `package-release.sh`  | a package's `release` run-script |

## Common commands

```sh
mise install            # install all pinned tools
mise trust              # trust this repo's mise.toml (once)
mise run check          # the full validation gate
mise ls                 # show installed tool versions
mise exec -- <cmd>      # run a command with mise's tools on PATH
```

## Adding a new task

1. If it is one line, add `[tasks.<name>]` to `mise.toml` with a `run = "..."`.
2. If it is multi-step, add `.mise/tasks/<name>.sh`, `chmod +x` it, and point
   the task at it with `run = ".mise/tasks/<name>.sh"`.
3. Document it in the table above and in [README.md](./README.md).

## References

[^mise-tools]: mise — managing tools — <https://mise.jdx.dev/dev-tools/>
[^mise-tasks]: mise — tasks — <https://mise.jdx.dev/tasks/>
