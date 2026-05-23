# Build-Path-4 - View Only Scrub Inspection Integration

## Doc Header

### Doc History
4. 2026-05-22 22:45:13: Repaired dependent Extrude intake after browser review showed a graph with Sketch plus Extrude but only one Build Path icon, backfilling missing source Sketch nodes before recording the accepted Extrude event so the visible timeline preserves the dependency story for new Extrude commits.
3. 2026-05-22 21:20:57: Repaired the live event population seam after browser review showed the Build Path surface mounted but empty, wiring accepted Sketch and Extrude command summaries from the live console path into the Build Path runtime store with distinct live projection ids while preserving cancelled-command skips and Edit History redo safety.
2. 2026-05-22 21:07:40: Implemented and closed `Build-Path-4`, wiring visible timeline step selection into Build Path-owned master scrub state, adding selected-step styling and workspace-hosted event readback, and proving selection leaves Edit History redo plus authored graph snapshots unchanged without adding restore, branch, compare, pin, or worker checkpoint behavior.
1. 2026-05-22 19:55:49: Added this Build Path family phase doc to plan visible master timeline selection and view-only scrub inspection without changing authored graph truth or Edit History stacks.

### Purpose

This doc plans `Build-Path-4`.

Use it to answer:
- how clicking or selecting a Build Path step should update view-only scrub state
- how selected event details should read back graph/build references
- how scrub inspection differs from undo/redo
- why restore and branch actions remain explicit later commands

Do not use it for:
- first Build Path UI mounting
- parallel branch lane UI
- authored graph restore
- branch creation
- comparison UI
- worker checkpoint replay

## Doc Body

`Build-Path-4` turns the visible master timeline into an inspection control.

The user should be able to select a build step and understand what it refers to without the app pretending that selection is an undo operation.

Hard boundary:
- selecting a Build Path step changes Build Path inspection state only
- it does not mutate graph head
- it does not create Edit History entries
- it does not clear redo

## Vision

After this phase, Build Path can be used for real view-only construction inspection.

The model story becomes navigable, but restore/branch decisions stay deliberate commands.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-4 / Phase 1`

- [x] Wire visible timeline selection to Build Path master scrub state.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-4 / Phase 2`

- [x] Show selected event detail and graph/build references.
- [x] Keep graph highlighting/readback derived and view-only.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-4 / Phase 3`

- [x] Prove scrub selection does not affect Edit History undo/redo or authored graph truth.
- [x] Keep restore/branch/compare/pin visibly deferred or absent.
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-4 / Phase 1` - `Timeline Selection To Master Scrub`

### Phase 1 Summary

Connect the visible timeline to Build Path master scrub state.

### Phase 1 Implementation Spec

The implementation should:
- allow selecting a visible timeline step
- update Build Path master scrub state
- show selected/active icon state
- preserve keyboard and pointer basics where existing controls make that natural

Do not include:
- graph mutation
- restore commands
- branch-local scrub

Verification should cover:
- selecting a timeline step updates Build Path state
- selected step styling/readback changes
- Edit History undo/redo stacks are unchanged

### Phase 1 Result

Implemented. `useBuildPathRuntimeStore` now owns a selected timeline step id and exposes master scrub reads over the derived timeline. `BuildPathTimelineStrip` marks selected steps with `aria-pressed` and selected data attributes, and click selection updates only Build Path state.

## [x] `Build-Path-4 / Phase 2` - `Selected Event Readback`

### Phase 2 Summary

Show what the selected Build Path event means.

### Phase 2 Implementation Spec

The implementation should:
- expose command family, affected nodes/edges/outputs, and build result state
- use derived graph/build references from the event
- optionally highlight related graph nodes as inspection only if a settled highlight seam exists

Do not include:
- authored selection mutation
- graph parameter editing
- restore/branch actions

Verification should cover:
- selected Sketch readback
- selected Extrude readback
- related graph references shown without changing graph state

### Phase 2 Result

Implemented. Workspace-hosted Build Path surfaces now show selected event readback for command family, graph id, affected node count, edge count, output count, and build result state. Graph highlighting was not added because no settled Build Path-specific inspection highlight seam was needed for this phase.

## [x] `Build-Path-4 / Phase 3` - `Scrub Safety Proof`

### Phase 3 Summary

Prove Build Path scrub remains navigation instead of undo/redo or restore.

### Phase 3 Implementation Spec

The implementation should:
- add regression tests around Edit History stacks
- verify redo remains available after scrub selection
- verify graph document snapshots are unchanged
- keep explicit action buttons absent or disabled if not yet owned

Verification should include:
- focused Build Path UI/state tests
- Edit History stack proof
- `npm.cmd run build`

### Phase 3 Result

Implemented. Focused tests prove selecting a visible Extrude step leaves Edit History undo/redo stacks unchanged and preserves an authored graph snapshot object. Restore, branch, compare, pin, and checkpoint controls remain absent.

### Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/workspace/ViewportWorkspaceHost.test.tsx`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- Browser verification at `http://localhost:5173/ParaHook_Configurator/`: one `[data-build-path-viewport-dock="bottom"]` and one `.BuildPathTimelineStrip--viewport-dock` were present in the Model Viewport. The live browser runtime still had no accepted Build Path events, so browser verification covered the mounted empty strip while focused tests covered Sketch/Extrude selection and readback.

### Live Event Population Repair

- Implemented after browser review showed the mounted Build Path strip had no live events.
- `recordGraphCommandSummaryForBuildPath(...)` now records committed live Sketch and Extrude command summaries into the Build Path runtime store.
- Repeated accepted commands receive distinct `build-path-live:<graph-document-id>:<command-family>:<event-number>` projection ids so repeated reuse commands do not collapse into one timeline step.
- Accepted Extrude commands now backfill missing source Sketch nodes before recording the Extrude event, so a dependent Extrude does not become the first visible Build Path entry when its source Sketch predates the live listener.
- Cancelled command summaries still skip Build Path event creation.
- The bridge is view/read-only relative to canonical Edit History and authored graph truth.

### Repair Verification

- `npm.cmd test -- --run src/app/buildPath/recordBuildPathGraphCommand.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/console/buildPathProjection.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- Browser verification at `http://localhost:5173/ParaHook_Configurator/`: the Build Path dock and strip are mounted; the strip remains empty until a new accepted Sketch or Extrude command is made in the live session.

### Dependent Extrude Repair Verification

- `npm.cmd test -- --run src/app/buildPath/recordBuildPathGraphCommand.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/console/buildPathProjection.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
