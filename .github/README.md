# `.github/`

GitHub integration for the farish repo.

## Present now

- `pull_request_template.md` — the PR template (reviewed/updated on every PR).
- `workflows/ci.yml` — monorepo lint + test + build CI gate (step 24).
- `settings.yml` — repo config as code via repository-settings app (amendment A1).

## Coming in later prompt steps

| File / dir              | Purpose                                        | Prompt step  |
| ----------------------- | ---------------------------------------------- | ------------ |
| `workflows/deploy.yml`  | Deploy the app + docs to GitHub Pages          | step 27, 28  |
| `workflows/tilt-ci.yml` | End-to-end dev-workflow test with `tilt ci`    | step 27      |
| `renovate.json`         | Dependency automation                          | amendment A2 |

CI workflows MUST invoke the **same** `mise run` entrypoints used locally, so
the local and CI codepaths never diverge (initial prompt step 24).
