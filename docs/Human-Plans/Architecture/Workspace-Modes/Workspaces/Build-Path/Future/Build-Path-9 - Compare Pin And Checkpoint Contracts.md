# Build-Path-9 - Compare Pin And Checkpoint Contracts

## Doc Header

### Doc History
3. 2026-05-23 09:09:09: Implemented and closed `Build-Path-9 / Phases 1-3` with explicit Compare source/target/read-model readiness, Pin/checkpoint persistence boundaries, worker checkpoint/cache owner routing, and proof that Compare, Pin, and checkpoint replay remain non-executable without later runtime phases.
2. 2026-05-23 01:38:53: Confirmed by `Build-Path-6` as the future compare, pin, and checkpoint/cache readiness owner; compare UI, pin persistence, and worker cache runtime remain unimplemented until this doc is explicitly run.
1. 2026-05-23 01:21:42: Added this future Build Path phase doc as the compare, pin, and checkpoint/cache readiness owner after `Build-Path-6` defines explicit action boundaries.

### Purpose

This doc plans `Build-Path-9`.

Use it to answer:
- how compare and pin should stay explicit Build Path actions
- what checkpoint/cache storage must exist before replay or restore actions depend on it
- how compare/pin should avoid becoming hidden graph truth

Do not use it for:
- immediate comparison UI
- pin persistence without an owner
- worker cache implementation without readiness rules
- restore or branch runtime

## Doc Body

`Build-Path-9` groups compare, pin, and checkpoint readiness because all three depend on trustworthy Build Path reads without necessarily mutating authored graph truth.

If any part grows too broad, split it into a narrower follow-up before implementation.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-9 / Phase 1`

- [x] Define compare boundary and needed read models.
- [x] `Build-Path-Gen1-HLG-8`

### `Build-Path-9 / Phase 2`

- [x] Define pin/checkpoint candidate persistence boundaries.
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`

### `Build-Path-9 / Phase 3`

- [x] Define worker checkpoint/cache readiness or split it into a dedicated owner.
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-9 / Phase 1` - `Compare Boundary`

### Phase 1 Summary

Define what comparison can read before any compare UI is implemented.

### Phase 1 Implementation Spec

The docs or implementation pass should:
- define compare source and target requirements
- define whether compare is visual, data-level, graph-level, or build-result-level
- keep compare explicitly user-invoked

Do not include:
- comparison UI execution
- graph mutation
- checkpoint storage

Verification should cover:
- compare is separate from scrub selection
- compare truth sources are explicit

### Phase 1 Result

- Added `BuildPathCompareReadiness` over the selected Build Path timeline step.
- Compare now declares `selected-build-step` as the source, `second-build-step-or-pinned-checkpoint` as the required target, and `visual`, `build-result`, and `graph-read` as supported read models.
- Compare remains disabled with `canCompare: false` and is not triggered by scrub selection.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-9 / Phase 2` - `Pin And Checkpoint Boundary`

### Phase 2 Summary

Define pin and checkpoint candidate persistence rules.

### Phase 2 Implementation Spec

The docs or implementation pass should:
- distinguish visual pins from restore-ready checkpoints
- define persistence ownership
- define how pinned points appear in master and branch timelines

Do not include:
- pin persistence without accepted ownership
- restore replay
- worker cache storage

Verification should cover:
- pin state does not become hidden graph truth
- checkpoint candidate state remains distinct from restore-ready state

### Phase 2 Result

- Added `BuildPathPinCheckpointReadiness` so visual pin persistence and restore-ready checkpoint storage remain separate reads.
- Pin now reports whether the selected step is a checkpoint candidate while keeping `canPersistPin: false` and `canPersistCheckpoint: false`.
- Pin truth is scoped to the Build Path read model, while checkpoint storage remains blocked on worker checkpoint/cache ownership.

### Phase 2 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-9 / Phase 3` - `Worker Checkpoint Readiness`

### Phase 3 Summary

Define worker/cache readiness or split it into a dedicated worker-owned phase.

### Phase 3 Implementation Spec

The docs or implementation pass should:
- identify the worker/cache data needed by restore, compare, and checkpoint actions
- decide whether checkpoint storage belongs in Build Path or a worker family doc
- keep Build Path as a reader/action surface, not a hidden execution cache

Do not include:
- worker cache implementation
- replay execution
- graph mutation

Verification should cover:
- checkpoint storage has an explicit owner
- Build Path does not silently become the worker cache

### Phase 3 Result

- Added `BuildPathWorkerCheckpointReadiness` with `missing-worker-cache-owner`, `canReplayCheckpoint: false`, and `worker-family-follow-up` as the owner recommendation.
- Restore, Compare, and Pin are listed as actions that need worker checkpoint/cache data before replay or comparison runtime can ship.
- Build Path remains a reader/action surface and does not implement worker cache storage or replay.

### Phase 3 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
