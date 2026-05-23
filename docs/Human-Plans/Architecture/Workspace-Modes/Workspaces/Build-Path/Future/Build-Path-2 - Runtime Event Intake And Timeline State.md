# Build-Path-2 - Runtime Event Intake And Timeline State

## Doc Header

### Doc History
2. 2026-05-22 20:04:43: Implemented `Build-Path-2` with a Build Path-owned runtime event state seam, deterministic accepted command projection intake, duplicate/cancelled skip behavior, derived master timeline reads, Edit History safety tests, and build verification without adding UI, scrub visuals, branch UI, restore actions, or worker checkpoint storage.
1. 2026-05-22 19:55:49: Added this Build Path family phase doc so the next implementation pass can connect the shipped event/timeline helpers to a Build Path-owned runtime state seam before any visible UI mounts.

### Purpose

This doc plans `Build-Path-2`.

Use it to answer:
- how accepted graph command projections become live Build Path events
- where Build Path runtime timeline state should live
- how event intake stays separate from Console, Spaghetti, and Edit History ownership
- why visible UI waits for `Build-Path-3`

Do not use it for:
- rendering the viewport icon strip
- scrub interaction UI
- branch lane UI
- restore, branch, compare, or pin actions
- worker checkpoint/cache storage

## Doc Body

`Build-Path-2` makes the already-shipped Build Path model usable by runtime surfaces.

The phase should create the smallest honest event intake path:
- accepted command projections become Build Path events
- Build Path owns the stored event list/read model
- the master timeline is derived from Build Path events
- cancelled/transient command work still does not enter the timeline
- no visible UI is required yet

Boundary:
- Console and Spaghetti may hand off accepted command projections
- Build Path owns event storage and timeline reads
- Edit History remains the only Ctrl+Z / Redo owner

## Vision

After this phase, Build Path has live data to show.

The user may still not see the strip yet, but the runtime will have a Build Path-owned event/timeline read that later UI can mount without inventing a second event source.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.

### `Build-Path-2 / Phase 1`

- [x] Add a Build Path-owned runtime state seam for accepted events.
- [x] Expose read helpers/selectors for events and master timeline.
- [x] Preserve empty timeline reads.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-2 / Phase 2`

- [x] Connect accepted graph command projections into the Build Path event intake seam.
- [x] Keep cancelled and transient sessions excluded.
- [x] Keep event sequence/idempotency deterministic.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-2 / Phase 3`

- [x] Add runtime timeline regression proof around Sketch and Extrude command acceptance.
- [x] Prove Edit History stacks are not affected by event intake.
- [x] Record the handoff to `Build-Path-3`.
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-7`

## [x] `Build-Path-2 / Phase 1` - `Build Path State Owner`

### Phase 1 Summary

Create the Build Path-owned state/read seam that stores accepted events and derives the master timeline.

### Phase 1 Implementation Spec

The implementation should:
- add a small Build Path runtime owner or store
- store `BuildPathEvent` records
- expose event list and derived master timeline reads
- preserve the existing pure timeline helper as the derivation source
- keep empty reads stable

Do not include:
- UI mounting
- scrub interaction
- branch mode UI
- restore/branch actions
- worker checkpoint/cache storage

Verification should cover:
- empty event list returns an empty master timeline
- appending accepted events updates the derived master timeline
- duplicate event ids are not added twice

Implemented:
- `src/app/buildPath/buildPathRuntime.ts` now owns the Build Path runtime event state shape.
- `createBuildPathRuntimeState(...)`, `readBuildPathRuntimeEvents(...)`, `readBuildPathRuntimeMasterTimeline(...)`, and `appendBuildPathRuntimeEvent(...)` preserve empty reads, copy event arrays, derive the master timeline, and skip duplicate event ids.

## [x] `Build-Path-2 / Phase 2` - `Accepted Command Projection Intake`

### Phase 2 Summary

Connect accepted graph command projection handoff into the Build Path-owned event state.

### Phase 2 Implementation Spec

The implementation should:
- reuse `projectGraphCommandCommitForBuildPath(...)`
- reuse `createBuildPathEventFromCommandProjection(...)`
- assign deterministic accepted ordering
- skip `null` projections
- keep Console/Spaghetti as handoff producers, not timeline owners

Do not include:
- visible Build Path surface
- scrub selection
- graph restore
- worker replay

Verification should cover:
- accepted Sketch command creates one Build Path event
- accepted Extrude command creates one Build Path event
- cancelled command summaries do not create events
- duplicate intake does not duplicate the timeline

Implemented:
- `intakeGraphCommandCommitForBuildPath(...)` reuses the existing projection helper and event helper to convert accepted command summaries into Build Path runtime events.
- Cancelled command projections return a skipped result, duplicate projection ids return a duplicate result, and accepted events receive deterministic sequence numbers.

## [x] `Build-Path-2 / Phase 3` - `Runtime Timeline Proof And Handoff`

### Phase 3 Summary

Prove the runtime event intake can feed the master timeline safely and hand off to visible UI work.

### Phase 3 Implementation Spec

The implementation should:
- add focused runtime tests for event intake plus master timeline derivation
- prove Edit History undo/redo stacks are not changed by intake
- update this doc and the index with the next handoff

Do not include:
- Build Path UI
- scrub replay
- branch UI
- explicit restore/branch/compare/pin runtime

Verification should include:
- focused Build Path tests
- adjacent projection tests
- `npm.cmd run build`

Implemented:
- `src/app/buildPath/buildPathRuntime.test.ts` covers empty state, event append, duplicate guards, accepted Sketch/Extrude intake, cancelled skip behavior, deterministic event sequencing, master timeline derivation, and Edit History safety.
- Handoff advanced to `Build-Path-3 - Viewport Docked Icon Strip And Workspace Surface`.

Verified:
- `npm.cmd test -- --run src/app/buildPath/buildPathEvents.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/console/buildPathProjection.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
