# Worker Phase Worker 12 - Skip Worker Dispatch For Unresolved Output Continuation

## Doc Header

### Doc History
1. 2026-04-14 10:15: Created this standalone future Worker phase doc so the new `Worker 12` lane has one implementation-ready planning surface for the unresolved-upstream-disconnect bug where `Geometry/Sketch -> Geometry/Extrude -> Output Preview` can still dispatch a worker build after the sketch wire is removed, grounding the current strongest read in request-translation and dispatch-target gating rather than viewport presentation or changed-param semantics

### Purpose

This doc defines the next implementation-ready phase under `Worker`.

Use it to answer:
- why an upstream disconnect can still dispatch a worker build even though the output continuation is unresolved
- where unresolved `Output Preview` continuation should stop build dispatch before the worker runs
- how to prove the exact `Sketch -> Extrude -> Output Preview` disconnect case
- how to keep this fix separate from viewport presentation, selector-visible result cleanup, or broader worker invalidation redesign

### Why This Phase Exists

Current live symptom:
- a simple graph such as:
  - `Geometry/Sketch -> Geometry/Extrude -> Output Preview`
- can still try to dispatch a worker build after the user disconnects:
  - `Sketch -> Extrude`
- while keeping:
  - `Extrude -> Output Preview`

That symptom can look like:
- a parameter-change preview state
- a retained transparent viewport result
- or a worker invalidation hint problem

The current strongest code-backed read is narrower:
- graph-native `Geometry/Extrude` currently treats missing profile input as evaluatable and publishes `SolidBody = null`
- `previewPreparation` already notices the broken continuation and marks the slot `unresolved`
- worker-facing part filtering already removes unresolved extrudes from the required worker part list
- but request translation can still produce non-empty `targetBuildUnitIds`
- app dispatch currently only stops when `targetBuildUnitIds.length === 0`

So the likely real bug is:
- unresolved output continuation still producing dispatch targets
- not primarily viewport compare logic
- and not primarily local `changedInputHint` classification

This phase exists to close that dispatch-honesty gap before widening back into `Worker 9`, `Worker 10`, or `AutoDraftFinal` style lanes.

### Scope

This phase covers:
- request translation and dispatch gating for unresolved output continuation
- the exact graph-native disconnect case where upstream geometry input disappears but downstream `Output Preview` wiring remains
- proof that unresolved slots do not produce worker dispatch targets
- proof that app build dispatch does not call the worker for this case

This phase does not cover:
- viewport presentation cleanup
- selector-visible stale result cleanup
- broader `Worker 9` affected-subgraph narrowing
- turning missing extrude input into a compile-invalid graph unless proof later requires that wider architectural move
- new mode or interaction semantics

## Doc Body

## [ ] Worker 12 - Skip Worker Dispatch For Unresolved Output Continuation

### Header

Purpose:
- stop worker dispatch when the current graph has no buildable output continuation for a still-wired `Output Preview` slot

Owns:
- unresolved-output dispatch honesty
- request-target suppression for unresolved graph-native preview slots
- the exact `Sketch -> Extrude` disconnect proof where downstream preview wiring still exists

Does not own:
- viewport presentation
- selector-visible result ownership
- changed-baseline compare cleanup
- shared-reference invalidation redesign

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Index.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Index-Gen2.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`

Locked starting constraints:
- this should stay a worker/request-dispatch truth fix, not a viewport-family patch
- keep authored graph truth first:
  - the app should not dispatch fake worker work when the current output continuation is already unresolved
- prefer the smallest honest dispatch fix before considering wider compile-invalid behavior changes
- do not reopen `changedInputHint` semantics unless proof shows the dispatch bug truly depends on that hint path

Current live seams this phase should read against:
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- targeted request-translation and app-dispatch tests

Current code-backed read:
- `src/app/spaghetti/compiler/evaluateGraph.ts`
  - still treats graph-native missing extrude profile input as evaluatable rather than compile-blocking
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - already locks that `Geometry/Extrude` with missing selected profile input publishes `SolidBody = null`
- `src/app/spaghetti/previewPreparation.ts`
  - already marks graph-native `Output Preview` slots as `unresolved` when the connected source output is known but null
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already keeps unresolved extrudes out of the worker-required part-key list
  - but still derives `targetBuildUnitIds` from raw slot entries without the same unresolved-slot guard
- `src/app/store/useAppStore.ts`
  - currently stops dispatch only when `requestBuild.targetBuildUnitIds.length === 0`
  - so non-empty target ids can still trigger worker dispatch even when nothing worker-buildable remains

Important current-reality rule:
- unresolved output continuation should behave as:
  - no buildable output for worker dispatch
- not as:
  - ordinary local parameter churn
  - a viewport-only presentation issue

### Locked Direction

#### 1. Treat unresolved output continuation as a hard dispatch stop

The guiding rule for this phase is:
- if `Output Preview` continuation is unresolved, the app should not dispatch worker build work for that lane

Important rule:
- do not let downstream slot presence outrank current unresolved output truth

#### 2. Fix request-target ownership before widening compile semantics

The current strongest seam read is:
- request translation still mints build targets for unresolved slots

Important rule:
- fix request-target honesty first
- do not widen immediately into:
  - making the whole graph compile-invalid
  - new worker-side skip branches
  - new viewport-side suppression

#### 3. Keep the worker out of fake work instead of letting runtime skip it later

The desired ownership is:
- app/request translation says whether current output continuation is buildable
- worker executes only real buildable requests

Important rule:
- prefer not dispatching fake work over dispatching and then skipping later inside the worker

#### 4. Keep the proof surface concrete and local

The first exact proof graph should stay:
- `Geometry/Sketch -> Geometry/Extrude -> Output Preview`

with this edit:
- disconnect `Sketch -> Extrude`
- keep `Extrude -> Output Preview`

Important rule:
- do not widen the first pass into every future unresolved-source shape before this one graph is locked

### Implementation Target

`Worker 12` should make one behavior shift real:

- when a graph-native output slot is unresolved because a required upstream geometry input was disconnected, request translation produces no dispatchable target build units and app build dispatch does not call the worker

The minimum meaningful behavior change should be:
1. the graph is:
   - `Sketch -> Extrude -> Output Preview`
2. the user disconnects:
   - `Sketch -> Extrude`
3. `Output Preview` remains wired to:
   - `Extrude`
4. preview preparation marks the slot unresolved
5. request translation returns no dispatchable target build units
6. app build dispatch does not call `requestGraphBuild`

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`

Likely supporting files:
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/store/useAppStore.test.ts`
- only the smallest adjacent preview-preparation or compiler proof file if needed

### Verification Bar

This phase is only done if it proves both:
- unresolved upstream disconnect no longer produces dispatchable build targets
- app build dispatch does not call the worker for that graph

Required proof:
- one translation-level regression for unresolved `Sketch -> Extrude -> Output Preview`
- one app-level regression showing `requestGraphBuild` is not called for the same graph
- surrounding local worker-targeting proofs stay green

### Implementation Order

1. Confirm the exact dispatch seam.
2. Add the failing unresolved-disconnect proof.
3. Stop unresolved slots from producing dispatchable build targets.
4. Re-run the narrow surrounding proof band and stop.

## [ ] Worker 12 Phase 1 - Confirm The Dispatch Seam

Goal:
- prove whether the unresolved disconnect still reaches the worker because request translation mints target build units instead of because of changed-param classification or viewport behavior

Owns:
- seam attribution for unresolved upstream disconnect dispatch

File targets:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- existing related proof files

Implementation target:
- trace the exact path from unresolved slot status to worker dispatch decision

Verification bar:
- the likely owner must be named precisely before any runtime patch begins

Done when:
- the next sub-phase can say whether the remaining bug is:
  - request-target generation
  - app dispatch gating
  - or unexpectedly a different earlier seam

Important rule:
- no broad code changes in this step

Stop rule:
- stop once the unresolved dispatch seam is attributable to one named owner

## [ ] Worker 12 Phase 2 - Add An Unresolved-Upstream Disconnect Regression

Goal:
- lock the `Sketch -> Extrude -> Output Preview` disconnect bug in focused failing proofs before changing runtime code

Owns:
- failing proof coverage for unresolved upstream disconnect dispatch

File targets:
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/store/useAppStore.test.ts`

Implementation target:
- model the graph-native disconnect where:
  - `Sketch -> Extrude` is removed
  - `Extrude -> Output Preview` remains
- prove both:
  - translation still produces a dispatchable target when it should not
  - app dispatch still calls `requestGraphBuild` when it should not

Verification bar:
- the new proofs must fail before the runtime patch and pass after it

Done when:
- the repo has one explicit failing regression for this exact unresolved-dispatch symptom

Important rule:
- test worker-dispatch ownership directly, not only viewport output or selector state

Stop rule:
- stop once the unresolved-dispatch bug is captured in failing proof

## [ ] Worker 12 Phase 3 - Drop Dispatch Targets For Unresolved Slots

Goal:
- make unresolved output continuation produce no dispatchable build targets so the worker is not called

Owns:
- the narrow request-translation and dispatch-gating fix

File targets:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`

Implementation target:
- ensure unresolved output slots do not contribute dispatchable target build units
- keep the fix as close as possible to request-target ownership

Verification bar:
- the new `Worker 12 Phase 2` regressions pass
- existing local request-translation and dispatch tests stay green

Done when:
- unresolved upstream disconnect no longer dispatches worker build work for the targeted graph

Important rule:
- do not widen into compile-invalid graph semantics unless the proof shows target filtering alone cannot close the bug honestly

Stop rule:
- stop once worker dispatch is gone for unresolved slots and the surrounding narrow proof band stays green

## [ ] Worker 12 Phase 4 - Verify And Stop

Goal:
- confirm the unresolved-dispatch fix closes the real symptom without reopening broader worker or viewport ladders

Owns:
- final verification and stop decision for this bug family

File targets:
- the narrow set touched by `Worker 12 Phase 2` and `Worker 12 Phase 3`

Implementation target:
- rerun the unresolved-disconnect regressions plus the most relevant existing request-translation proofs

Verification bar:
- unresolved-dispatch proof passes
- surrounding local worker-targeting proofs stay green

Done when:
- the family can say unresolved output continuation no longer dispatches fake worker work for the targeted graph

Important rule:
- do not widen into shared-reference invalidation or viewport result semantics after the dispatch fix is proven

Stop rule:
- stop once the dispatch-honesty bug is closed and the surrounding proof band stays green
