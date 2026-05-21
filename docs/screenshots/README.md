# `docs/screenshots/`

CI-published page screenshots — initial prompt step 28.

On every push to `main`, the [`pages.yml`](../../.github/workflows/pages.yml)
workflow runs the Playwright screenshot suite against the built app, then
commits the captured images into this directory under a **date-based path**:

```
docs/screenshots/<YYYY-MM-DD>-<run-id>/
  home.png
  explore.png
  ...one PNG per built page...
```

- The commit message contains **`[skip ci]`** so the commit-back does not
  re-trigger CI (which would loop forever). GitHub natively skips `push`
  workflow runs whose head commit message contains `[skip ci]`/`[no ci]`.
- The same workflow run also publishes these images to the GitHub Pages site
  under `/screenshots/`, so progress can be browsed without cloning the repo.
- Videos of each run are uploaded as workflow artifacts and to Pages; they are
  intentionally **not** committed to git (too large for history).

The runs accumulate here as a visual changelog of the app's build-out across
prompt steps 30–37. Each run path is immutable — never edited or deleted by CI.
