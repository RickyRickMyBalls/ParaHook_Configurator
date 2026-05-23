# Build-Path-8 - Branch From Here Contract

## Doc Header

### Doc History
3. 2026-05-23 08:59:03: Implemented and closed `Build-Path-8 / Phases 1-2` with explicit branch-from-here readiness data, new graph-document destination policy, branch name preview, graph ownership/storage requirements, confirmation/Edit History policy, and proof that Branch remains non-executable without a later runtime phase.
2. 2026-05-23 01:38:53: Confirmed by `Build-Path-6` as the future branch-from-here owner; branch creation runtime remains unimplemented until this doc is explicitly run.
1. 2026-05-23 01:21:42: Added this future Build Path phase doc as the branch-from-here contract owner after `Build-Path-6` defines explicit action boundaries.

### Purpose

This doc plans `Build-Path-8`.

Use it to answer:
- what authored branch-from-here means for Build Path
- how branch creation differs from view-only branch-local scrub
- what graph ownership, naming, storage, and Edit History rules are needed

Do not use it for:
- immediate branch graph writes
- implicit branch creation from scrub
- restore replay
- comparison UI

## Doc Body

`Build-Path-8` should define authored branch creation as a deliberate command.

Branch-local scrub is an inspection playhead. Branch-from-here is an authored action and needs graph ownership, naming, storage, and history semantics before implementation.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-8 / Phase 1`

- [x] Define branch-from-here authored ownership rules.
- [x] Decide graph/document/storage implications.
- [x] `Build-Path-Gen1-HLG-8`

### `Build-Path-8 / Phase 2`

- [x] Define branch naming, visibility, and Edit History relationship.
- [x] Preserve view-only branch-local scrub.
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-8 / Phase 1` - `Authored Branch Ownership`

### Phase 1 Summary

Define where a new branch would live and who owns its graph truth.

### Phase 1 Implementation Spec

The docs or implementation pass should:
- decide whether branch-from-here creates a graph document, graph branch, or another authored structure
- define source event/checkpoint requirements
- define what happens to downstream build events after branching

Do not include:
- branch runtime writes
- graph duplication
- restore replay

Verification should cover:
- branch-from-here is not triggered by scrub movement
- branch storage is explicitly owned

### Phase 1 Result

Implemented. Branch-from-here readiness is now a distinct Build Path read for the selected step. It declares that branch creation would target a new Spaghetti-owned graph document, fork from the selected Build Path step, and require an accepted branch storage policy before any authored branch state can be created. Branch creation remains `canCreateBranch: false`.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-8 / Phase 2` - `Branch Command UX Boundary`

### Phase 2 Summary

Define the user-facing branch-from-here command boundary.

### Phase 2 Implementation Spec

The docs or implementation pass should:
- define branch naming and destination readback
- define confirmation or preview requirements
- define Edit History implications
- keep implementation deferred until the ownership contract is accepted

Do not include:
- hidden branch creation
- branch compare UI
- worker checkpoint storage

Verification should cover:
- action is explicit
- authored branch state is not created by timeline selection

### Phase 2 Result

Implemented. The Branch action remains disabled, exposes branch-from-here readiness attributes on the workspace action button, previews a branch name from the selected build step, requires explicit user command and confirmation, and records that a real branch command would need to create or relate to an Edit History entry. No branch graph writes, graph duplication, restore replay, comparison UI, or worker checkpoint storage were added.

### Phase 2 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
