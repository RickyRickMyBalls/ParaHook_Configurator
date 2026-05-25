# Cleanup Gen5 Index

## Doc Header

### Doc History
2. 2026-05-25 12:41:50: Prepared `Gen 5 - Cleanup 1 / Phase 1 - Lint Failure Taxonomy And Owner Map` for implementation, keeping the first pass read-only and clarifying that the next output should be a categorized owner map rather than source fixes or raw lint-log churn.
1. 2026-05-25 12:24:33: Created this `Cleanup Gen5` index to route lint-gate baseline recovery as its own cleanup generation, starting with a research/taxonomy pass before production React, architecture-boundary, test-policy, and enforcement cleanup work.

### Purpose

This doc is the Generation 5 planning index for `Cleanup`.

Use it to decide:
- how the repo should restore `npm run lint` as a trustworthy quality gate
- which lint failures are real runtime risks versus test/mock hygiene noise
- why lint cleanup needs a research phase before broad implementation
- which future doc owns the real phased cleanup plan

Do not use it for:
- fixing every lint warning in one pass
- hiding production issues behind broad lint disables
- replacing the broader `Cleanup` family vision
- changing app behavior just to satisfy a rule without understanding the runtime consequence

## Doc Body

### Generation Goal

Generation 5 should make the lint gate useful again.

Current live read from the May 25 review:
- `npm.cmd run lint` fails with `677` reported problems
- the failures include production React safety errors, architecture-boundary violations, test/mock typing noise, and smaller style issues
- `npm run lint` through PowerShell can be blocked by local execution policy, so verification notes should prefer `npm.cmd run lint` on this machine

The goal is not to chase every warning blindly.

The goal is to:
- separate real app/runtime risk from low-risk test noise
- fix production issues first
- align lint rules with actual architecture boundaries
- define a test lint policy that does not drown out production regressions
- end with a lint command whose failure means something new probably broke

### Current Routing

- `Future/Gen5 - Cleanup 1 - Lint Gate Baseline Recovery.md`
  - phased plan for restoring lint trust through research, production-risk cleanup, boundary cleanup, test-policy cleanup, and final enforcement

### No-Widening Rule

Gen 5 setup does not implement runtime behavior.

It must not:
- disable lint rules broadly to make the command green
- mix unrelated feature refactors into lint cleanup
- rewrite large files just because lint touched them
- move worker/app/shared boundaries without preserving the existing source-of-truth contracts
- treat test-only lint noise as equally urgent as production React purity, refs, or boundary errors

### Acceptance Read

Gen 5 planning setup is acceptable when the Cleanup family has:
- one scan index for lint-gate recovery
- one concrete future doc for the lint-gate baseline plan
- an explicit first research/taxonomy phase
- a production-first ordering for runtime-risk lint failures
- a separate test-policy phase so test cleanup does not block app/runtime safety work
- a final enforcement phase that makes future changes trust the lint gate again

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen5-HLG-1` - Make lint useful again so new work can trust failures as likely new regressions instead of background noise.
- [ ] `Cleanup-Gen5-HLG-2` - Fix production React/runtime lint errors before lower-risk test and mock hygiene cleanup.
- [ ] `Cleanup-Gen5-HLG-3` - Repair architecture-boundary lint failures without hiding real worker/app/shared ownership drift.
- [ ] `Cleanup-Gen5-HLG-4` - Create an honest test lint policy that keeps tests readable without weakening production source standards.

### Codex Level Goals

- [ ] `Cleanup-Gen5-CLG-1` - Capture a stable lint taxonomy with counts, owners, and first-fix recommendations.
- [ ] `Cleanup-Gen5-CLG-2` - Fix or route production React compiler-rule failures such as render-time ref reads, render-time impurity, and synchronous state-in-effect cascades.
- [ ] `Cleanup-Gen5-CLG-3` - Reconcile restricted-import failures against the intended `src/shared/` and worker boundary direction.
- [ ] `Cleanup-Gen5-CLG-4` - Reduce or deliberately scope test-only lint noise so production lint failures remain visible.
- [ ] `Cleanup-Gen5-CLG-5` - End with a documented lint command and a clean or intentionally tracked baseline.

## [ ] `Gen 5 - Cleanup 1` - `Lint Gate Baseline Recovery`

Planning doc:
- `Future/Gen5 - Cleanup 1 - Lint Gate Baseline Recovery.md`

Status:
- planned as the first `Cleanup Gen5` lane
- Phase 1 is now prepped for implementation as a read-only lint taxonomy and owner map
- Phase 2 should fix production React/runtime lint failures first
- Phase 3 should repair architecture-boundary violations
- Phase 4 should clean or scope test-only lint noise
- Phase 5 should make the lint gate enforceable again with a documented command and tracked residuals

### Current Read

- the strongest runtime-risk lint failures include React 19 rules around refs during render, render impurity, and state updates inside effects
- the strongest boundary-risk lint failure is worker code importing from app-side Spaghetti compiler internals
- the largest noise source appears to be tests using `any`, unused mock parameters, and patterns now rejected by the stricter React lint rules
- this generation should start with taxonomy because fixing by raw lint order would mix production runtime safety, architecture cleanup, and test ergonomics in one unsafe batch
