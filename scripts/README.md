# `scripts/`

Repo-level build scripts that are not package-scoped — they assemble or
orchestrate artifacts that span the whole monorepo.

Per the farish working rules, multi-step logic is a tracked, lintable script
rather than an inline command. These scripts are written in TypeScript and run
with `bun` (the monorepo's runtime).

| Script                   | Invoked by                  | Purpose                                                             |
| ------------------------ | --------------------------- | ------------------------------------------------------------------- |
| `build-pages-site.ts`    | `mise run pages-site` / CI  | Assemble the GitHub Pages site (app + rendered docs + screenshots). |
| `publish-screenshots.ts` | `pages.yml` workflow / CI   | Copy a Playwright screenshot run onto a date-based path.           |

## `build-pages-site.ts`

Builds the single GitHub Pages deployment required by initial-prompt step 28.
GitHub Pages serves one site per repo, so the app, the rendered docs, and the
screenshot runs all live under one output directory:

```
<out>/                 the built Vue app (apps/web/dist)
<out>/docs/            docs/**.md rendered to HTML (Mermaid-aware, amendment A6)
<out>/screenshots/     screenshot runs copied from docs/screenshots/
```

Markdown is rendered with [`marked`][marked] — an off-the-shelf parser, not a
hand-rolled static-site generator. Each page is wrapped in a small HTML shell
that loads [Mermaid][mermaid] from a CDN so `mermaid` fenced blocks render as
diagrams.

Prerequisite: `nx run web:build` must have produced `apps/web/dist` first.

```sh
nx run web:build
mise run pages-site            # writes ./_site
```

The CI workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml)
runs the build + screenshot suite + this script, then deploys `_site` to
GitHub Pages.

## `publish-screenshots.ts`

Copies a Playwright screenshot run onto the date-based path required by
initial-prompt step 28:

```
apps/web/e2e/output/screenshots/   →   docs/screenshots/<YYYY-MM-DD>-<run-id>/
```

The run id is the GitHub Actions run id in CI, or any token locally. Each run
directory is immutable — the script refuses to overwrite an existing run. It
also writes a per-run `README.md` so each directory is self-describing on
GitHub.

The [`pages.yml`](../.github/workflows/pages.yml) workflow runs this script,
then does the `git commit` with a loop-safe `[skip ci]` message. Run it
locally to reproduce exactly what CI does:

```sh
cd apps/web && bun run e2e          # produces e2e/output/screenshots/*.png
bun run scripts/publish-screenshots.ts local-run
```

[marked]: https://marked.js.org
[mermaid]: https://mermaid.js.org
