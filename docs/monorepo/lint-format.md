# Lint & Format — Biome

farish uses [Biome][biome] for both linting and formatting, with a single
shared config (`biome.json`) used by every package. This document is the spec
for the lint/format setup and records why Biome was chosen.

[biome]: https://biomejs.dev

## Decision

**Chosen: Biome v2** — one tool for lint **and** format, one config, fast.

### Candidates evaluated

| Option            | Lint+Format | Speed   | Custom rules                  | Config surface        |
| ----------------- | ----------- | ------- | ----------------------------- | --------------------- |
| **Biome v2**      | Unified     | Fastest (Rust) | GritQL plugins (`.grit`) | One `biome.json`      |
| ESLint + Prettier | Two tools   | Slowest (JS)   | Full — JS rule modules   | `eslint.config` + `.prettierrc` |
| oxlint            | Lint only   | Fastest (Rust) | Nascent                  | `.oxlintrc.json`      |

### Rationale for Biome

1. **Unified lint + format.** One tool, one config file, one cache. ESLint +
   Prettier means two tools, two configs, and a plugin to stop them
   fighting.[^biome-overview]
2. **bun-friendly + fast.** Biome is a single Rust binary installed as a
   dev-dependency — no plugin-resolution dance, and it lints the whole workspace
   in milliseconds.[^biome-formatter]
3. **Custom rules are a hard requirement.** The initial prompt (step 22)
   requires custom rules that "remove patterns we don't want". Biome v2
   introduced **GritQL plugins** — custom rules written as `.grit` pattern
   files — which satisfies this without dropping to ESLint.[^biome-plugins]
4. **oxlint rejected** — lint only (no formatter) and its custom-rule story is
   less mature than Biome's GritQL plugins.
5. **ESLint + Prettier rejected** — the most powerful custom-rule system, but
   the two-tool overhead and slower JS engine are not worth it when Biome's
   built-in rules + GritQL plugins cover farish's needs.

## `biome.json` — the spec

One root `biome.json`; **no per-package configs**. Every package's `lint` and
`format` scripts run Biome against `./src`, all governed by this one file.

### Formatter

- 2-space indent, 100-column lines, LF endings.
- Single quotes, always-semicolons, trailing commas everywhere.

### Linter — strict built-in rules

`recommended` is on, plus these escalated to **error**:

| Rule                  | Bans                                                    |
| --------------------- | ------------------------------------------------------- |
| `noExplicitAny`       | The `any` type annotation.                              |
| `noConsole`           | `console.*` (except `.error`/`.warn`; off for `apps/`). |
| `noDebugger`          | `debugger` statements.                                  |
| `noNonNullAssertion`  | The `!` non-null assertion operator.                    |
| `useConst`            | `let` for never-reassigned bindings.                    |
| `useImportType`       | Type-only imports must say `import type`.               |

### `apps/` override

CLI apps legitimately print to stdout, so the `apps/**` override turns
`noConsole` off there. Libraries and services stay locked down.

## Custom rules — `.biome/plugins/`

Built-in rules cover the common cases; GritQL plugins cover **farish-specific**
patterns. Plugins live in `.biome/plugins/` and are registered in the `plugins`
array of `biome.json`.

| Plugin                   | Bans                                                      |
| ------------------------ | --------------------------------------------------------- |
| `no-as-any.grit`         | `x as any` casts — they silently disable type-checking.   |

`noExplicitAny` catches the bare `any` *annotation*; `no-as-any.grit` closes the
*cast*-shaped hole it leaves (`expr as any`). Together they make `any`
unreachable.

### Writing a custom rule

A GritQL plugin is a `.grit` file with a pattern and a `register_diagnostic`:

```grit
`$expr as any` where {
  register_diagnostic(
    span = $expr,
    message = "farish/no-as-any: `as any` defeats type-checking — ..."
  )
}
```

1. Add the `.grit` file under `.biome/plugins/`.
2. Add its path to the `plugins` array in `biome.json`.
3. Run `mise run lint` — the plugin loads and fires on matching code.

See [`.biome/README.md`](../../.biome/README.md) and the Biome plugin
docs.[^biome-plugins]

## Commands

| Command           | Does                                              |
| ----------------- | ------------------------------------------------- |
| `mise run lint`   | Check every package — no changes written.         |
| `mise run format` | Check + autofix every package (writes files).     |

Per package: `bun run lint` / `bun run format`. `format` is `lint --fix` per the
initial prompt's run-script contract.

## Suppressing a diagnostic

When a rule must be broken deliberately, use an inline suppression with a
reason — never disable the rule globally:

```ts
// biome-ignore lint/suspicious/noExplicitAny: third-party type is untyped
```

## References

[^biome-overview]: Biome — overview — <https://biomejs.dev/guides/getting-started/>
[^biome-formatter]: Biome — formatter — <https://biomejs.dev/formatter/>
[^biome-plugins]: Biome — linter plugins (GritQL) — <https://biomejs.dev/linter/plugins/>
