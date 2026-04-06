# NodeView Tests Worker Startup Coupling

## Doc History
3. 2026-04-06 09:27: Closed this cleanup bug after the `NodeView` suites adopted a local `MockWorker` harness plus dynamic module imports that install the stub before `NodeView` and store evaluation, and after the stale dormant assertions were rebased onto the current geometry-shell contract so both suites now execute directly again
2. 2026-04-06 09:08: Tightened this cleanup bug into an implementation-ready next slice by grounding it in the current eager `NodeView` test import path, the existing local `Worker` stub pattern already used by sibling UI suites, and the narrower recommendation to repair the `NodeView` harness first instead of widening into a `BuildDispatcher` or worker-runtime refactor
1. 2026-04-06 09:08: Added this open cleanup bug after the `NodeView` test suites were confirmed to still fail at startup because their import chain eagerly reaches `BuildDispatcher` worker creation before the Vitest environment provides `Worker`

## Status
- `[fixed]`
- fixed on `2026-04-06`

## Summary
- The direct `NodeView` test suites used to fail at startup because their import path eagerly reached app bootstrap code that constructs a browser `Worker`.
- The landed fix was a narrow local test-harness repair, not a broader worker/runtime architecture phase.
- Both direct `NodeView` suites now collect and execute again under Vitest.

## Resolution
- `src/app/spaghetti/canvas/NodeView.test.tsx` now installs a local `MockWorker`, resets modules before each test, and dynamically imports `NodeView` plus the relevant store modules only after the worker stub is present.
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx` now follows the same worker-safe import pattern and also derives its live `extrudeVm` fixture values from current node params so interaction tests observe real updates.
- The dormant `NodeView` assertions were then rebased onto the current geometry-shell contract so the repaired suites test today’s UI instead of older stale DOM assumptions.

## User-Visible Symptoms
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx` now runs directly.
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx` now runs directly.
- New `NodeView` regressions can be executed through the direct suite path again.

## Current Code-Backed Read
- `src/app/spaghetti/canvas/NodeView.test.tsx` now defers `NodeView`, store, and registry imports until after a local `Worker` stub is installed.
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx` now does the same and restores the original `Worker` after each test.
- `src/app/store/useAppStore.ts` imports the singleton `buildDispatcher`.
- `src/app/buildDispatcher.ts` eagerly constructs `new Worker(...)` inside `BuildDispatcher` setup.
- Several sibling UI suites already solve the same environment seam locally by:
  - stubbing `globalThis.Worker`
  - calling `vi.resetModules()`
  - importing the app/store path only after the stub is installed
- A concrete example already exists in:
  - `src/app/components/ViewportOverlay.test.tsx`

## Root Cause
- The `NodeView` test import chain reaches `src/app/store/useAppStore.ts`.
- That path reaches `src/app/buildDispatcher.ts`.
- `BuildDispatcher` eagerly creates `new Worker(...)` during module setup.
- The Vitest environment for these UI suites does not provide a browser `Worker`, so module initialization throws `ReferenceError: Worker is not defined` before the test file can run.

## Locked Implementation Direction
- Keep this scoped as a test-infra/bootstrap cleanup, not a worker-runtime feature phase.
- Prefer the narrowest fix already proven elsewhere in the repo:
  - add a local `MockWorker` harness to the `NodeView` suites
  - install `globalThis.Worker` before importing `NodeView` or store paths that reach `useAppStore`
  - use `vi.resetModules()` so the stub is active before module evaluation
  - restore the original `Worker` after each test
- Do not make the first cut a `BuildDispatcher` lazy-init refactor unless the local harness repair proves insufficient.

## Implementation Spec

### Likely Files
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- reference pattern:
  - `src/app/components/ViewportOverlay.test.tsx`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/store/useAppStore.test.ts`

### First-Cut Plan
1. add the same local `MockWorker` pattern already used by sibling jsdom suites
2. make sure the `Worker` stub is installed before any import path can evaluate:
   - `NodeView`
   - `useAppStore`
   - `buildDispatcher`
3. convert eager imports that currently happen too early into dynamic imports inside `beforeEach` / test setup when needed
4. keep the fix local to the `NodeView` suites unless another shared helper becomes obviously cleaner with no extra risk
5. after the harness is repaired, re-run the dormant `NodeView` assertions and then adjust any stale expectations that were previously hidden behind the startup failure

### Explicit Non-Goals
- do not widen this into an `Extrude` runtime task
- do not treat this as a `/worker/` feature-semantic phase
- do not refactor the full build bootstrap path unless the local harness repair cannot work

## Verification Result
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `./node_modules/.bin/tsc.cmd -b --pretty false`
- both suites now collect and execute instead of failing during startup with `Worker is not defined`

## Main Files
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`

## Notes
- This is not an `Extrude` runtime bug and does not belong under the future `/worker/` feature phases.
- The immediate value of this cleanup is restoring direct execution of `NodeView` regressions that are currently masked by the startup failure.
