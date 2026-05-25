# Gen5 - Cleanup 1 - Lint Gate Baseline Recovery

## Doc Header

### Doc History
2. 2026-05-25 12:41:50: Prepared `Gen 5 - Cleanup 1 / Phase 1 - Lint Failure Taxonomy And Owner Map` for implementation by locking the read-only command set, taxonomy buckets, owner-map output shape, stop rules, and handoff requirements before any lint fixes start.
1. 2026-05-25 12:24:33: Created this `Gen 5 - Cleanup 1` future plan to restore the lint gate through a research/taxonomy phase followed by production React cleanup, architecture-boundary repair, test lint policy cleanup, and final enforcement.

### Purpose

This doc owns the first `Cleanup Gen5` lane.

Use it to restore `npm run lint` as a useful quality gate before more feature work piles onto an already-red baseline.

Primary user intent:
- make a new cleanup phase for the lint-gate problem
- add research phases first if needed
- do not treat hundreds of existing lint failures as normal background noise

### Scope

This cleanup owns:
- lint failure taxonomy and owner mapping
- production React/runtime lint cleanup
- architecture-boundary lint cleanup
- test-only lint policy and hygiene cleanup
- final lint-gate enforcement and residual tracking

This cleanup does not own:
- broad feature refactors unrelated to lint failures
- redesigning app architecture while fixing a narrow lint issue
- hiding production failures behind broad disables
- making the full test suite fast or green unless lint cleanup directly touches that path
- resolving every large-file ownership sink from `Cleanup Gen3`

## Doc Body

### Cleanup Goal

The lint gate should stop being a wall of old noise.

Current live read from the May 25 review:
- `npm.cmd run lint` reports `677` problems
- `584` of those are errors
- `npm.ps1` can be blocked by PowerShell execution policy on this machine, so `npm.cmd run lint` is the reliable local command
- the failure list mixes production runtime risks, architecture-boundary drift, test/mock noise, and small style issues

The target state:
- production source lint failures are fixed or explicitly routed into a narrow follow-on
- architecture-boundary failures match the intended `app` / `worker` / `shared` ownership model
- test lint rules are strict enough to catch real mistakes but not so noisy that developers ignore the command
- a future lint failure is treated as likely introduced by the current change

### Current Live Read

Representative high-signal failures from the review:

- `src/app/AppShell.tsx`
  - React refs are read during render around detached/floating viewer layout and portal gating
  - likely runtime concern because ref changes do not trigger render
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - recursive layout renderer is used before declaration under the React lint rules
- `src/app/components/ReferenceTransformToolbar.tsx`
  - `performance.now()` appears in render-adjacent code paths flagged by React purity rules
- `src/app/buildPath/BuildPathSurface.tsx`, `src/app/workspace/PropertiesSurface.tsx`, and related surfaces
  - multiple synchronous `setState` calls inside effects are flagged as possible cascading-render sources
- `src/worker/cad/featureStackRuntime.ts`
  - imports from app-side Spaghetti compiler code, violating the intended worker/shared boundary
- multiple test files
  - `any`, unused mock params, `this` aliasing, and test probes trip stricter lint rules

### Architecture Direction

Lint cleanup should reinforce the repo's architecture direction.

Rules:
- production React lint failures should be treated as possible runtime bugs until proven otherwise
- worker-facing code should consume shared contracts/helpers, not app implementation folders
- test-specific rule adjustments are allowed only when they are narrow, documented, and do not weaken production source lint
- each phase should leave lint output smaller and more meaningful

### Acceptance Read

This cleanup is acceptable when:
- `npm.cmd run lint` either passes or fails only for a small documented residual list
- production app/runtime lint failures are no longer hidden by test noise
- restricted-import failures have been fixed or routed through an explicit shared-boundary plan
- any test-specific lint relaxations are scoped to tests and documented
- the Cleanup family records the resulting lint-gate command and baseline status

## Vision

The lint gate should feel like a smoke alarm, not background weather.

When it fails, the user and Codex should be able to trust that something worth investigating changed.

This cleanup should make the repo calmer to work in: fewer false starts, fewer ignored warnings, and clearer proof that a new implementation pass did not quietly add React or boundary risk.

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen5-HLG-1` - Make lint useful again so new work can trust failures as likely new regressions instead of background noise.
- [ ] `Cleanup-Gen5-HLG-2` - Fix production React/runtime lint errors before lower-risk test and mock hygiene cleanup.
- [ ] `Cleanup-Gen5-HLG-3` - Repair architecture-boundary lint failures without hiding real worker/app/shared ownership drift.
- [ ] `Cleanup-Gen5-HLG-4` - Create an honest test lint policy that keeps tests readable without weakening production source standards.

### Codex Level Goals

- [ ] Capture lint output into a stable taxonomy grouped by production runtime, architecture boundary, tests, and style/autofix.
- [ ] Prep and fix production React compiler-rule failures before touching broad test noise.
- [ ] Move or split shared worker-facing helpers so restricted imports enforce the intended direction.
- [ ] Decide whether test-only `any`, unused mock parameters, and render-probe rules should be fixed directly or scoped in ESLint config.
- [ ] Close with a clean or deliberately tracked lint baseline.

### `Gen 5 - Cleanup 1 / Phase 1`

- [ ] `Cleanup-Gen5-HLG-1` - Make lint useful again so new work can trust failures as likely new regressions instead of background noise.
- [x] Prep the read-only lint taxonomy implementation handoff before any source fixes start.
- [ ] Run `npm.cmd run lint` and save a concise taxonomy in this doc or a follow-on note.
- [ ] Count failures by category and name the likely owner files.
- [ ] Identify which failures are safe autofix, which are production risk, and which need architecture decisions.

### `Gen 5 - Cleanup 1 / Phase 2`

- [ ] `Cleanup-Gen5-HLG-2` - Fix production React/runtime lint errors before lower-risk test and mock hygiene cleanup.
- [ ] Fix render-time ref reads in app shell surfaces.
- [ ] Fix render-time impurity such as `performance.now()` in render paths.
- [ ] Fix or refactor synchronous state-in-effect cascades where they represent real derived-state problems.

### `Gen 5 - Cleanup 1 / Phase 3`

- [ ] `Cleanup-Gen5-HLG-3` - Repair architecture-boundary lint failures without hiding real worker/app/shared ownership drift.
- [ ] Reconcile worker imports from app-side Spaghetti internals.
- [ ] Move shared compile/runtime helpers into an explicit neutral home where appropriate.
- [ ] Update restricted-import rules only if the existing rule names an obsolete boundary.

### `Gen 5 - Cleanup 1 / Phase 4`

- [ ] `Cleanup-Gen5-HLG-4` - Create an honest test lint policy that keeps tests readable without weakening production source standards.
- [ ] Clean high-value test lint failures directly where the fix is low-risk.
- [ ] Add narrow test-only ESLint config exceptions only where the test pattern is intentional and common.
- [ ] Keep production source rules stricter than test helper rules.

### `Gen 5 - Cleanup 1 / Phase 5`

- [ ] `Cleanup-Gen5-HLG-1` - Make lint useful again so new work can trust failures as likely new regressions instead of background noise.
- [ ] Document the final local command as `npm.cmd run lint` for this Windows workspace.
- [ ] Record any intentional residual failures with owner, reason, and follow-on phase.
- [ ] Close the phase only when the lint gate is clean or the residual list is small enough to trust.

## [ ] `Gen 5 - Cleanup 1 / Phase 1` - `Lint Failure Taxonomy And Owner Map`

### Phase 1 Summary

#### Purpose

Create a stable map of the lint failure backlog before implementation starts.

#### Owns

- fresh lint run
- failure category counts
- production versus test split
- likely owner files
- first-fix ordering

#### Does Not Own

- source fixes
- rule disables
- architecture moves
- test policy changes

#### Current Live Read

The latest review already showed the gate is noisy enough that raw lint order is not a safe implementation order.

Phase 1 should produce a concise taxonomy such as:
- production React/runtime safety
- architecture-boundary violations
- test/mock typing and purity noise
- style/autofix cleanup
- warnings that should become follow-on work rather than blocking the first gate recovery

#### Prep Read

Phase 1 is now implementation-ready.

The next pass should be read-only except for updating this planning doc, `Cleanup-Gen5-Index.md`, `docs/Doc-Index.md` if a new follow-on note is created, and `docs/Doc-Log.md`.

The pass should not:
- fix lint failures
- run `eslint --fix`
- edit `eslint.config.js`
- change TypeScript or source files
- change test files
- mark Phase 1 complete without a categorized owner map

The implementation output should be a short taxonomy that is useful for later source phases, not a pasted full lint log.

Recommended output buckets:
- `Production React Runtime`
  - React compiler rules such as refs during render, purity, globals, immutability, and set-state-in-effect
- `Architecture Boundary`
  - restricted imports and worker/app/shared ownership drift
- `Production Type Hygiene`
  - production `any`, unused locals, prefer-const, or similar source issues that are not React runtime rules
- `Test Policy And Hygiene`
  - test-only `any`, unused mock params, test render probes, test-only globals, and large mock patterns
- `Style And Autofix`
  - safe mechanical fixes that can be run later after higher-risk routing is understood
- `Warnings And Follow-On`
  - non-blocking warnings or items that deserve a separate cleanup phase

Minimum owner-map fields:
- category
- lint rule
- representative files
- approximate count
- recommended owning phase
- first safe action
- risk note

Suggested first-fix routing:
- Phase 2 should receive production React/runtime failures.
- Phase 3 should receive architecture-boundary failures.
- Phase 4 should receive test policy and test hygiene failures.
- Phase 5 should receive any small residual list after the main cleanup passes.

### Phase 1 Implementation Spec

Run the lint command and capture the output locally for summarizing:

```powershell
npm.cmd run lint
```

Optional helper commands for counting and owner mapping:

```powershell
npm.cmd run lint *> .tmp-lint-gen5-phase1.log
Select-String -Path .tmp-lint-gen5-phase1.log -Pattern " error | warning " | Group-Object
Select-String -Path .tmp-lint-gen5-phase1.log -Pattern "react-hooks/|no-restricted-imports|@typescript-eslint/|prefer-const"
```

Important:
- `.tmp-lint-gen5-phase1.log` is temporary scratch output only
- do not add the scratch log to docs or source
- summarize the result in this doc instead of committing the raw log
- delete or leave the scratch file untracked according to the normal local scratch-file practice for this repo

Then record:
- total problems
- error and warning counts
- top failure rules
- top files by failure count
- recommended phase routing

Phase 1 acceptance checklist:
- [ ] fresh `npm.cmd run lint` result recorded with timestamp
- [ ] total error/warning count recorded
- [ ] top rules recorded
- [ ] top files recorded
- [ ] taxonomy table or bullet list added under Phase 1 Result
- [ ] Phase 2/3/4 routing recommendations recorded
- [ ] no source, test, config, or lint-rule fixes made

Stop after the taxonomy. Do not fix code in this phase.

### Phase 1 Result

Status:
- not started

Expected shape after implementation:
- one concise taxonomy summary
- one owner-map list
- one recommended next-phase handoff

## [ ] `Gen 5 - Cleanup 1 / Phase 2` - `Production React Runtime Lint Cleanup`

### Phase 2 Summary

#### Purpose

Fix production lint failures that may hide real React/runtime bugs.

#### Owns

- render-time ref reads
- render-time impure calls
- synchronous state-in-effect findings that represent derived-state or cascade risk
- focused tests for touched surfaces

#### Does Not Own

- test-only lint noise
- worker boundary moves
- broad shell redesign
- large-file decomposition beyond the narrow fixes

### Phase 2 Implementation Spec

Start with production files only.

Likely first targets:
- `src/app/AppShell.tsx`
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- focused workspace surfaces with `react-hooks/set-state-in-effect` failures

Required proof:
- focused tests for touched files where available
- `npm.cmd run lint` showing the production React category reduced
- `npm.cmd run build` if TypeScript/runtime shape changed

## [ ] `Gen 5 - Cleanup 1 / Phase 3` - `Worker And Shared Boundary Lint Cleanup`

### Phase 3 Summary

#### Purpose

Make restricted-import lint failures align with the intended worker/app/shared architecture.

#### Owns

- worker imports from app implementation folders
- shared helper placement
- restricted-import rule wording if it points at obsolete boundaries

#### Does Not Own

- rewriting the worker pipeline
- changing geometry semantics
- moving graph truth out of its canonical owner
- weakening the boundary just to make lint pass

### Phase 3 Implementation Spec

Start with the smallest violating production import.

Likely first target:
- `src/worker/cad/featureStackRuntime.ts` importing app-side runtime tessellation helpers

Preferred direction:
- move neutral helper logic into `src/shared/` or another explicitly shared home
- keep app-only registry or UI behavior out of worker paths

Required proof:
- focused worker/runtime tests for touched helpers
- `npm.cmd run lint` showing restricted-import failures reduced
- `npm.cmd run build`

## [ ] `Gen 5 - Cleanup 1 / Phase 4` - `Test Lint Policy And Hygiene Cleanup`

### Phase 4 Summary

#### Purpose

Reduce test lint noise without weakening production lint standards.

#### Owns

- test-only `any` decisions
- unused mock parameter conventions
- test render-probe patterns
- test-specific ESLint overrides where justified

#### Does Not Own

- hiding production lint errors
- rewriting giant tests without behavior need
- changing user-visible behavior

### Phase 4 Implementation Spec

Classify test failures into:
- easy direct fixes
- intentional mock/probe patterns
- large-test follow-ons that need their own cleanup slice

Use config only when a pattern is genuinely test-specific.

Required proof:
- `npm.cmd run lint` showing test noise reduced
- focused tests for any test helper rewrite
- no production rule relaxation

## [ ] `Gen 5 - Cleanup 1 / Phase 5` - `Lint Gate Enforcement And Residual Tracking`

### Phase 5 Summary

#### Purpose

Close the lane by making lint usable as a future guardrail.

#### Owns

- final lint baseline
- residual failure register if needed
- docs handoff
- command documentation

#### Does Not Own

- new feature work
- opportunistic refactors
- unplanned cleanup outside the lint gate

### Phase 5 Implementation Spec

Run:

```powershell
npm.cmd run lint
```

Then:
- if clean, record the clean lint gate in `docs/CHANGELOG.md` for implementation work and the relevant cleanup docs
- if not clean, record each residual category with owner, reason, and follow-on plan
- update this doc and `Cleanup-Gen5-Index.md` with the final status

The phase is not complete while the lint output is still a large undifferentiated backlog.
