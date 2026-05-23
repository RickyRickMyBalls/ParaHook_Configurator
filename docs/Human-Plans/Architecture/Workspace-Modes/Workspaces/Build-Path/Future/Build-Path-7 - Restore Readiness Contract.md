# Build-Path-7 - Restore Readiness Contract

## Doc Header

### Doc History
3. 2026-05-23 08:54:37: Implemented and closed `Build-Path-7 / Phases 1-2` with explicit restore readiness data, missing graph snapshot/worker checkpoint requirements, confirmation/Edit History policy, and proof that Restore remains non-executable without a later runtime phase.
2. 2026-05-23 01:38:53: Confirmed by `Build-Path-6` as the future restore-readiness owner; restore runtime remains unimplemented until this doc is explicitly run.
1. 2026-05-23 01:21:42: Added this future Build Path phase doc as the restore-readiness owner after `Build-Path-6` defines explicit action boundaries.

### Purpose

This doc plans `Build-Path-7`.

Use it to answer:
- what a real Build Path restore command must know before it can exist
- how restore differs from scrub selection
- how restore should relate to Edit History, graph truth, and worker/checkpoint readiness

Do not use it for:
- immediate restore runtime
- implicit scrub replay
- branch graph storage
- comparison UI

## Doc Body

`Build-Path-7` should turn the restore idea into a readiness contract before implementation.

The restore command is not a scrub side effect. It must be an explicit user-invoked action with graph truth, confirmation, and undo/redo ownership understood before any authored state changes.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-7 / Phase 1`

- [x] Define restore-ready event/checkpoint requirements.
- [x] Identify missing graph snapshot or worker replay data.
- [x] `Build-Path-Gen1-HLG-8`

### `Build-Path-7 / Phase 2`

- [x] Define restore command UX, confirmation, and Edit History relationship.
- [x] Keep scrub movement view-only.
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-7 / Phase 1` - `Restore Data Readiness`

### Phase 1 Summary

Define what data must exist before restore can mutate authored graph truth.

### Phase 1 Implementation Spec

The docs or implementation pass should:
- identify whether Build Path has enough event, graph, build-result, and checkpoint data for restore
- separate checkpoint-candidate reads from restore-ready checkpoints
- route missing worker/cache needs to the checkpoint owner

Do not include:
- graph mutation
- restore replay
- branch creation
- comparison UI

Verification should cover:
- restore-ready state is not inferred from scrub selection alone
- missing data is explicit

### Phase 1 Result

Implemented. Restore readiness is now a distinct Build Path read derived from checkpoint readiness. A selected output/build-result checkpoint candidate reports `missing-restore-contract`, `canExecuteRestore: false`, missing authored graph snapshot semantics, and missing worker checkpoint data. Non-checkpoint steps remain readable but are not restore-ready.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-7 / Phase 2` - `Restore Command Boundary`

### Phase 2 Summary

Define the first safe restore command boundary.

### Phase 2 Implementation Spec

The docs or implementation pass should:
- keep restore explicitly user-invoked
- define confirmation and consequence readback
- define how restore would create or relate to Edit History entries
- leave actual runtime restore for a separately accepted implementation phase

Do not include:
- implicit scrub restore
- unconfirmed graph mutation
- worker checkpoint replay

Verification should cover:
- scrub selection remains read-only
- restore is impossible without an explicit command path

### Phase 2 Result

Implemented. The Restore action remains disabled, exposes restore readiness attributes on the workspace action button, requires an explicit user command and confirmation, and records that a real restore would need to create or relate to an Edit History entry. No restore runtime, graph mutation, worker checkpoint replay, or implicit scrub restore was added.

### Phase 2 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
