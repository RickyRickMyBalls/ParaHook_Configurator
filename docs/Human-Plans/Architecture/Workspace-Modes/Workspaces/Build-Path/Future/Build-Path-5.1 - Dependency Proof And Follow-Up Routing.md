# Build-Path-5.1 - Dependency Proof And Follow-Up Routing

## Doc Header

### Doc History
1. 2026-05-23 01:21:42: Added and closed this Build Path follow-up phase to prove the fresh Sketch to dependent Extrude dependency path before `Build-Path-6`, and to route the later restore, branch, compare, pin, and checkpoint phases into explicit future docs.

### Purpose

This doc plans `Build-Path-5.1`.

Use it to answer:
- whether a fresh Sketch to dependent Extrude path can produce dependency-backed Parallel lanes
- which follow-up Build Path phases should exist before action work starts
- why this proof is separate from restore, branch, compare, pin, or checkpoint behavior

Do not use it for:
- authored restore
- authored branch creation
- comparison UI
- pin persistence
- worker checkpoint/cache storage

## Doc Body

`Build-Path-5.1` is the narrow proof and routing pass between the finished Parallel timeline UI and the action-boundary work in `Build-Path-6`.

It keeps the manager loop honest:
- prove a fresh dependency path before designing actions on top of it
- add the follow-up action phase docs now so `Build-Path-6` can route work instead of hiding it
- keep all action behavior deferred until its own owner exists

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [ ] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-5.1 / Phase 1`

- [x] Add a fresh Sketch to dependent Extrude proof using the live Build Path recording helpers.
- [x] Prove dependency-backed Parallel lanes become `ready`.
- [x] Prove Edit History remains untouched.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-5.1 / Phase 2`

- [x] Add follow-up phase docs for restore readiness, branch-from-here, compare/pin, and worker checkpoint readiness.
- [x] Update the Build Path index and Dispatch run-state so `Build-Path-6` has explicit next owners.
- [ ] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-5.1 / Phase 1` - `Fresh Dependency Proof`

### Phase 1 Summary

Prove the fresh Build Path dependency path before action-boundary planning starts.

### Phase 1 Implementation Spec

The implementation should:
- use the public Build Path recording helpers
- record a Sketch source event
- record an Extrude event dependent on that Sketch source
- record graph dependency hints between those nodes
- render the workspace Build Path surface in Parallel mode
- assert the Parallel read reaches `ready`

Do not include:
- direct Spaghetti graph mutation
- restore, branch, compare, pin, or checkpoint behavior
- worker replay/cache behavior

Verification should cover:
- Sketch then Extrude master order
- dependency hint availability
- ready Parallel lane state
- Edit History undo/redo safety

### Phase 1 Result

Implemented. `BuildPathSurface.test.tsx` now includes a fresh recording-path proof that uses `recordSketchSourceForBuildPathIfMissing`, `recordGraphDependenciesForBuildPath`, and `recordGraphCommandSummaryForBuildPath` before rendering the workspace Parallel surface. The proof verifies ready branch lanes, preserved master order, stored dependency hints, and no Edit History mutation.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx`
- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-5.1 / Phase 2` - `Follow-Up Phase Routing`

### Phase 2 Summary

Create the next explicit phase owners before `Build-Path-6` starts action-boundary planning.

### Phase 2 Implementation Spec

The docs pass should:
- add future docs for restore readiness, branch-from-here, compare/pin, and worker checkpoint readiness
- update the Build Path generation index
- update the workspace family index and Dispatch run-state
- keep the new future docs planned rather than pretending action runtime exists

Do not include:
- action runtime implementation
- authored graph mutation
- pin persistence
- checkpoint storage

Verification should cover:
- every follow-up has an explicit owning future doc
- `Build-Path-6` remains the next legal task
- action implementation stays deferred

### Phase 2 Result

Implemented. Added explicit future docs for:
- `Build-Path-7 - Restore Readiness Contract`
- `Build-Path-8 - Branch From Here Contract`
- `Build-Path-9 - Compare Pin And Checkpoint Contracts`

`Build-Path-6` remains the next legal task and should use these docs as the follow-on owners it confirms or revises.

### Phase 2 Verification

- `rg -n "Build-Path-5.1|Build-Path-7|Build-Path-8|Build-Path-9|Build-Path-6" docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Build-Path docs/Agents/Dispatch-5-Simpler/Dispatch-5-Simpler-Run-State.md`
