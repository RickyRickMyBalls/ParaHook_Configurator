# Build-Path-6 - Explicit Actions And Checkpoint Readiness

## Doc Header

### Doc History
3. 2026-05-23 01:38:53: Implemented and closed `Build-Path-6 / Phases 1-3` with a Build Path-owned checkpoint readiness/action-boundary read, disabled planned workspace action affordances, safety tests, and confirmed follow-on owners for restore, branch-from-here, compare/pin, and checkpoint readiness.
2. 2026-05-23 01:21:42: Updated the action-boundary handoff after `Build-Path-5.1` added explicit follow-on owner docs for restore readiness, branch-from-here, compare/pin, and checkpoint readiness.
1. 2026-05-22 19:55:49: Added this Build Path family phase doc to plan restore, branch-from-here, compare, pin, and checkpoint readiness as explicit commands after view-only Build Path reading is visible and trustworthy.

### Purpose

This doc plans `Build-Path-6`.

Use it to answer:
- what must be true before Build Path actions can mutate authored graph truth
- how restore, branch-from-here, compare, and pin stay explicit
- what checkpoint or worker/cache readiness needs to exist before runtime action work
- when to split later action work into separate family phases

Do not use it for:
- implicit scrub side effects
- UI-less worker cache implementation
- unapproved authored restore
- unapproved branch graph storage
- comparison UI before reader truth exists

## Doc Body

`Build-Path-6` is the action-boundary planning phase after view-only Build Path is visible.

It should not rush into mutation.

The healthy order is:
1. visible Build Path reader is trustworthy
2. selected events and checkpoints are legible
3. action boundaries are explicit and user-invoked
4. worker/cache readiness is defined
5. restore, branch, compare, and pin can each receive their own implementation cut

Follow-on owner docs already exist:
- `Build-Path-7 - Restore Readiness Contract`
- `Build-Path-8 - Branch From Here Contract`
- `Build-Path-9 - Compare Pin And Checkpoint Contracts`

`Build-Path-6` should confirm, revise, or split those owners rather than hiding broad action work inside this doc.

## Vision

After this phase, Build Path can safely move from reader to action planning.

The user should understand that scrub is navigation, while restore, branch-from-here, compare, and pin are separate commands with their own consequences.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### `Build-Path-6 / Phase 1`

- [x] Define checkpoint readiness and action eligibility.
- [x] `Build-Path-Gen1-HLG-8`

### `Build-Path-6 / Phase 2`

- [x] Add visible disabled/planned action affordance boundaries if useful.
- [x] Keep all actions explicitly user-invoked.
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-6 / Phase 3`

- [x] Split restore, branch-from-here, compare, pin, and worker checkpoint storage into follow-on implementation owners.
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-6 / Phase 1` - `Checkpoint Readiness Contract`

### Phase 1 Summary

Define what counts as a checkpoint and what must exist before action commands can use one.

### Phase 1 Implementation Spec

The implementation or docs pass should:
- define checkpoint eligibility from Build Path event, timeline, branch, and build result reads
- distinguish read-only checkpoint candidates from restore-ready checkpoints
- identify worker/cache data that is missing before replay or restore

Do not include:
- worker cache storage
- authored graph restore
- branch graph writes

Verification should cover:
- checkpoint candidate read remains separate from action-ready state
- missing worker/cache readiness is explicit

### Phase 1 Result

Implemented. Added a Build Path-owned action/readiness helper that derives checkpoint readiness from the selected timeline step and optional branch classification. Checkpoint candidates remain read-only candidates unless restore-ready worker checkpoint storage and authored graph restore semantics exist. Restore readiness is explicitly `false` in this phase.

### Phase 1 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-6 / Phase 2` - `Explicit Action Boundaries`

### Phase 2 Summary

Expose or document restore, branch-from-here, compare, and pin as explicit user commands.

### Phase 2 Implementation Spec

The implementation should:
- keep action affordances disabled/planned unless their readiness is proven
- show why an action is unavailable when useful
- never trigger actions from scrub movement

Do not include:
- actual restore mutation
- actual branch storage
- comparison UI execution
- pin persistence unless a narrower owner exists

Verification should cover:
- scrub movement does not trigger actions
- unavailable actions do not mutate graph or history

### Phase 2 Result

Implemented. Workspace-hosted Build Path readback now shows a compact planned action boundary panel for Restore, Branch, Compare, and Pin when a step is selected. The buttons are disabled, identify their action kind, report that they are not scrub-triggered, and do not mutate graph truth or Edit History.

### Phase 2 Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathActions.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-6 / Phase 3` - `Follow-On Action Phase Split`

### Phase 3 Summary

Create the next honest implementation owners for restore, branch, compare, pin, and checkpoint/cache work.

### Phase 3 Implementation Spec

The docs pass should:
- decide whether each action deserves its own Build Path family phase
- route worker checkpoint/cache storage separately if needed
- confirm or revise the existing `Build-Path-7`, `Build-Path-8`, and `Build-Path-9` follow-on docs
- preserve view-only scrub as the stable default
- update the Build Path index with the next legal handoff

Done shape:
- no action is treated as implemented unless its own runtime behavior and verification exist
- follow-on docs are created for any action promoted to implementation

### Phase 3 Result

Implemented. Confirmed the follow-on owners created in `Build-Path-5.1`:
- `Build-Path-7 - Restore Readiness Contract`
- `Build-Path-8 - Branch From Here Contract`
- `Build-Path-9 - Compare Pin And Checkpoint Contracts`

No restore, branch creation, comparison UI, pin persistence, or worker checkpoint/cache runtime is treated as implemented by this phase.

### Phase 3 Verification

- `rg -n "Build-Path-7|Build-Path-8|Build-Path-9|Build-Path-6" docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Build-Path docs/Agents/Dispatch-5-Simpler/Dispatch-5-Simpler-Run-State.md`
