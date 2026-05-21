# `.mise/tasks/`

Multi-line task scripts invoked by `mise run <task>`.

Per the farish working rules, anything beyond a one-line command that an
org-wide task needs is captured here as a script rather than inlined into
`mise.toml`. One-line tasks (`lint`, `format`, `test`, `build`, `graph`) stay
inline in `mise.toml`; multi-step tasks (`bootstrap`, `check`) live here.

| Script         | mise task        | Purpose                                  |
| -------------- | ---------------- | ---------------------------------------- |
| `bootstrap.sh` | `mise run bootstrap` | Install workspace dependencies.      |
| `check.sh`     | `mise run check` | Full validation gate (lint+test+build).  |

See [`docs/monorepo/mise.md`](../../docs/monorepo/mise.md) for the full guide.
