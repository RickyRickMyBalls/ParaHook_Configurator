# Build-Path-5 - Parallel Branch Timeline UI

## Doc Header

### Doc History
4. 2026-05-23 00:39:55: Implemented and closed `Build-Path-5 / Phases 2-3` with explicit Build Path graph dependency hints, dependency-backed branch lane rendering, role readbacks, branch-local playhead state, and view-only/Edit History safety proof.
3. 2026-05-22 23:13:04: Verified and closed `Build-Path-5 / Phase 1`, keeping branch lane rendering deferred until graph dependency hints are available to the Build Path UI.
2. 2026-05-22 23:09:24: Implemented `Build-Path-5 / Phase 1 - Parallel Mode Entry` as a workspace-hosted view-mode switch with an honest dependency-hints-unavailable parallel read, preserving master timeline order and view-only/Edit History boundaries until graph dependency hints are wired into the UI layer.
1. 2026-05-22 19:55:49: Added this Build Path family phase doc to plan the visible parallel mode, branch lane rendering, and branch-local scrub controls over the derived branch projection.

### Purpose

This doc plans `Build-Path-5`.

Use it to answer:
- how Build Path should show parallel branch timelines
- how branch-local scrub controls relate to the master timeline
- how linear, branch-local, merge, and checkpoint candidate roles should read
- why branch UI should not become graph layout or graph editing

Do not use it for:
- first visible Build Path mounting
- master timeline intake
- authored branch creation
- graph layout/arrangement
- restore, compare, or worker checkpoint runtime

## Doc Body

`Build-Path-5` adds visible parallel mode.

Parallel mode should use the existing branch projection helpers and keep one master timeline.

The user-facing read:
- master story remains visible
- branch lanes explain parallel construction work
- branch-local playheads can move inside their lanes
- merge/checkpoint candidates are readable as convergence points

## Vision

After this phase, Build Path can explain graph construction that is not truly serial.

The UI should make branches understandable without pretending they are separate histories.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.

### `Build-Path-5 / Phase 1`

- [x] Add a parallel mode read/toggle that preserves master timeline context.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`

### `Build-Path-5 / Phase 2`

- [x] Render branch lanes and role labels/icons from branch projection.
- [x] Keep master timeline order unchanged.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-5 / Phase 3`

- [x] Add branch-local playhead controls.
- [x] Keep branch scrub view-only and anchored to master context.
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

## [x] `Build-Path-5 / Phase 1` - `Parallel Mode Entry`

### Phase 1 Summary

Add the first visible parallel mode entry without changing the master timeline source.

### Phase 1 Implementation Spec

The implementation should:
- add a parallel mode toggle or equivalent view switch
- show master context while entering parallel mode
- use the existing branch projection read
- preserve empty/no-branch states

Do not include:
- authored graph branch creation
- graph layout editing
- restore/compare actions

Verification should cover:
- entering and leaving parallel mode
- no branches/empty state
- master timeline order unchanged

### Phase 1 Result

Implemented. Workspace-hosted Build Path surfaces now include a Master/Parallel mode switch. Parallel mode currently preserves master context and shows an explicit `dependency-hints-unavailable` read when the live Build Path events do not yet carry graph dependency hints into the UI layer, avoiding fake branch lanes.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

### Phase 1 Follow-Up

Phase 2 remains blocked on a graph dependency-hint seam for Build Path UI. Do not render branch lanes from event order alone.

## [x] `Build-Path-5 / Phase 2` - `Branch Lane Rendering`

### Phase 2 Summary

Render derived branch lanes and event classifications.

### Phase 2 Implementation Spec

The implementation should:
- show derived branch lanes
- distinguish linear, branch-local, merge, and checkpoint candidate roles
- keep event ids and branch lane ids stable in the UI
- avoid fake serial language for independent branches

Verification should cover:
- simple linear chain
- two independent branches
- merge/checkpoint candidate

### Phase 2 Result

Implemented. Build Path now stores explicit graph dependency hints from committed graph command summaries, including live Extrude source/target/edge relationships. Parallel mode only renders branch lanes when those hints are present; otherwise it keeps the earlier dependency-hints-unavailable read instead of inventing branch truth from event order alone.

The rendered branch lane UI uses the existing branch projection to show stable lane ids, stable step ids, event labels, and classification roles while preserving the master timeline order.

### Phase 2 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-5 / Phase 3` - `Branch Local Playheads`

### Phase 3 Summary

Add branch-local scrub controls over branch lanes.

### Phase 3 Implementation Spec

The implementation should:
- allow moving one branch-local playhead
- keep other branch lanes and master playhead stable
- anchor branch movement to master context
- avoid Edit History entries and graph mutation

Verification should cover:
- branch-local playhead movement
- master timeline unchanged
- Edit History stacks unchanged
- graph truth unchanged

### Phase 3 Result

Implemented. Branch lane steps are clickable in Parallel mode and move a Build Path-owned branch-local playhead for that lane. This state is keyed by branch lane id and timeline step id, stays anchored to the one master timeline, and does not create Edit History entries, clear redo, mutate authored graph truth, or create restore behavior.

### Phase 3 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
