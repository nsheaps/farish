# `.biome/`

Custom lint rules for the farish codebase, written as
[Biome GritQL plugins][grit].

Biome ships 200+ built-in rules; `biome.json` turns the strict ones on. This
directory holds **farish-specific** rules — patterns we want banned that no
built-in rule covers.

## Plugins

| Plugin                      | Bans                                                    |
| --------------------------- | ------------------------------------------------------- |
| `plugins/no-as-any.grit`    | `x as any` casts — they silently disable type-checking. |

## Adding a rule

1. Write a `.grit` file under `plugins/`.
2. Register it in the `plugins` array of `biome.json`.
3. Run `mise run lint` to confirm it loads and fires.

See [`docs/monorepo/lint-format.md`](../docs/monorepo/lint-format.md) for the
full lint/format guide and the rationale for choosing Biome.

[grit]: https://biomejs.dev/linter/plugins/
