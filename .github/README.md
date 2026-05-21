# `.github/`

GitHub integration for the farish repo.

## Present now

- `pull_request_template.md` — the PR template (reviewed/updated on every PR).

## Coming in later prompt steps

> **Note:** The actual CI workflows are **out of scope for steps 22-23**. This
> directory is scaffolded here; the workflows below are added in their own
> steps.

| File / dir              | Purpose                                        | Prompt step  |
| ----------------------- | ---------------------------------------------- | ------------ |
| `workflows/ci.yml`      | Lint + test + build via `mise run check`       | step 24      |
| `workflows/deploy.yml`  | Deploy the app + docs to GitHub Pages          | step 27, 28  |
| `workflows/tilt-ci.yml` | End-to-end dev-workflow test with `tilt ci`    | step 27      |
| `settings.yml`          | Repo config as code (branch protection)        | amendment A1 |
| `renovate.json`         | Dependency automation                          | amendment A2 |

CI workflows MUST invoke the **same** `mise run` entrypoints used locally, so
the local and CI codepaths never diverge (initial prompt step 24).
