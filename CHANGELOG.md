# CHANGELOG

## [001] 2026-03-04 09:42 (Add GitHub Pages Deployment Workflow)

### Scope / Constraints Honored
- Added a GitHub Actions workflow for GitHub Pages deployment at the exact path requested.
- Preserved deterministic, append-safe changelog structure with newest entry first.
- No existing changelog entries were modified or deleted.

### Summary of Implementation
- Created `.github/workflows/deploy-pages.yml`.
- Configured workflow triggers for pushes to `main` and manual dispatch.
- Added build and deploy jobs using official GitHub Pages actions.
- Set Node.js version to 20 and npm cache support during setup.

### Files Changed
- `.github/workflows/deploy-pages.yml`
- `CHANGELOG.md`

### Behavior Changes (if any)
- Repository now automatically builds and deploys `dist` to GitHub Pages on pushes to `main`.
- Manual deployment can also be triggered via `workflow_dispatch`.

### Verification Steps
- Confirmed workflow file exists at `.github/workflows/deploy-pages.yml`.
- Confirmed changelog entry exists at top of `CHANGELOG.md` with required sections.