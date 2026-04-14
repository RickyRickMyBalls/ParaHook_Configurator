# Build Path

## Doc Header

### Doc History
2. 2026-04-13 14:49: Updated this `Build Path` family index to point at the new `Build-Path_Vision.md` north-star doc so the umbrella entrypoint now distinguishes the stable core concept from the phase-ordering and ownership-planning material
1. 2026-04-10 00:00: Created this `Build Path` family index to organize the first architecture and phase planning for timeline-style CAD command history, cached scrubbing, worker-owned diff/checkpoint foundations, and workspace-mode UX phases

### Purpose

This doc defines the architecture direction for `Build Path`.

This file is the umbrella index for the `Build Path` family.

Use it to answer:
- what `Build Path` is supposed to do
- which parts belong to the worker/runtime seam
- which parts belong to workspace-mode UX
- what must land first before fast scrubbing can feel honest
- where future standalone `Build Path` phase docs should live

### Family Structure

Use this folder like this:

- `Build-Path_Vision.md`
  - core concept and north-star behavior
  - plain-language explanation of diffs, checkpoints, and non-destructive scrubbing
- `build-path-index.md`
  - umbrella architecture direction
  - phase-family summary
  - worker-versus-workspace ownership split
- `Future/`
  - standalone implementation-ready `Build Path` phase docs
- `Shipped/`
  - later shipped records for completed `Build Path` cuts if the family grows enough to justify them

### Why This Doc Exists

`Build Path` is not only a new workspace mode.

Use the companion vision doc for the stable concept:
- `Build-Path_Vision.md`
  - what `Build Path` should feel like
  - why the family is built around authored diffs plus accepted checkpoints
  - the hard rules future phases should preserve

It also needs worker and runtime support so the user can move quickly across accepted CAD-command history without forcing slow full rebuilds for every scrub step.

That means the feature has to be planned across at least two architecture families:
- `Worker`
  - history truth
  - diff/checkpoint ownership
  - cache and replay foundations
- `Workspace-Modes`
  - scrubber UX
  - viewed-step versus authored-head behavior
  - restore, compare, and branch interactions

This doc exists so `Build Path` can be planned as its own cross-cutting family instead of being fragmented across worker-only notes or workspace-only notes.

### Scope

This doc covers:
- `Build Path` as a product feature family
- the ownership split between worker/runtime and workspace-mode UX
- the first phase ordering needed to make timeline scrubbing real
- checkpoint-versus-diff planning direction
- future links into Worker and Workspace-Modes implementation work

This doc does not cover:
- low-level CAD kernel implementation details
- final viewer rendering polish
- final persistence/export design for history bundles
- every future compare/merge/branch workflow in detail

## Doc Body

### Short Version

`Build Path` should be treated as a workspace-mode experience built on top of worker-owned history primitives.

The workspace side should own:
- scrubber UX
- command list UX
- viewed-step navigation
- restore/branch interactions
- history-focused viewer behavior

The worker/runtime side should own:
- accepted history entry truth
- command diff records
- checkpoint strategy
- cache handles and fast restore
- deterministic replay from a known checkpoint

Hard rule:
- scrubbing history must not silently mutate the current authored head
- viewing a historical step and restoring or branching from that step are different actions

### Ownership Split

#### Build Path Family Owns

- the cross-family plan
- the phase order
- the boundary between worker history truth and workspace-mode UX
- the rules for fast historical scrubbing

#### Worker Owns

- accepted history entry storage
- command diff payloads
- checkpoint snapshots
- cached geometry handles
- replay-from-checkpoint rules
- invalidation rules when history is restored or branched

#### Workspace Modes Owns

- `Build Path` as a user-facing mode
- scrubber interaction
- selected history step state
- comparison UX
- restore-versus-branch UX
- how historical viewing changes the viewport/browser surfaces

#### Viewer Owns

- rendering the currently viewed historical result
- comparison overlays if later needed
- visual distinction between authored head and viewed history state

### Recommended Data Direction

Use checkpoint plus diff, not diff-only.

Reason:
- pure diff chains become slow and fragile over long command histories
- CAD commands are often deterministic enough to replay, but not cheap enough to replay from zero every time
- fast scrubbing needs nearby restore points

Recommended first model:
- every accepted CAD command creates one history entry
- every history entry stores:
  - command identity
  - authored diff summary
  - affected build-unit ids
  - accepted result identity
- selected milestones also store checkpoints:
  - accepted build bundle snapshot
  - geometry/cache handle
  - enough metadata to restore quickly

### Recommended First History Entry Shape

The exact schema can wait for a worker phase doc, but the family should aim for a record shaped roughly like:

- `historyEntryId`
- `parentHistoryEntryId`
- `commandId`
- `commandType`
- `authoredDiff`
- `affectedBuildUnitIds`
- `acceptedBuildBundleId`
- `resultClass`
- `cacheHandleIds`
- `createdAt`

Optional later additions:
- human-readable summary text
- branch label
- compare-against metadata
- persistence tier info such as memory-only versus durable checkpoint

### Core Behavior Rules

1. scrubbing should prefer restoring cached accepted states over replaying from zero
2. replay should start from the nearest valid checkpoint, not always from the beginning
3. transient interaction preview should not automatically become history truth
4. accepted result history should be the stable scrub surface unless a later phase widens capture rules
5. restoring history into the authored head should be explicit
6. editing from a historical step should create a branch or explicit replacement rule, not silently overwrite history semantics

### Phase Direction

The first useful phase ladder probably looks like this:

- `Build Path 1`
  - foundation family definition and ownership split
  - point to Worker and Workspace-Modes dependencies
- `Build Path 2`
  - worker history entry contract
  - accepted bundle snapshot truth
  - command diff envelope
- `Build Path 3`
  - checkpoint and replay strategy
  - cache ownership
  - nearest-checkpoint restore rules
- `Build Path 4`
  - workspace-mode shell
  - viewed-step versus authored-head UX
  - non-destructive scrub behavior
- `Build Path 5`
  - first real scrubber and command-list UI
  - fast cached history switching
- `Build Path 6`
  - restore, branch, and compare behaviors
  - worker/runtime integration for branch-from-history edits

The exact numbering can change later, but the order should stay roughly:
- worker history truth first
- workspace-mode UX second
- advanced restore/branch UX after the history foundation is real

### Cross-Family Dependencies

Likely Worker-linked phases:
- history entry contract
- accepted result snapshot foundation
- checkpoint/diff/cache strategy
- replay and branch invalidation rules

Likely Workspace-Modes-linked phases:
- `Build Path` mode shell
- scrubber UX
- history list UX
- restore/branch affordances
- viewed-history presentation rules

Likely Viewer-linked follow-on phases:
- historical result presentation
- compare overlays
- authored-head versus viewed-history visual distinction

### Initial Planning Questions

#### [ ] q1 - What is the canonical unit of Build Path history?

Question:
- should `Build Path` history be recorded per accepted CAD command, per accepted build bundle, or as a hybrid command-plus-accepted-result record?

Current suggestion:
- use a hybrid record
- command identity alone is not enough for fast scrubbing
- accepted result identity alone is not enough for authored-history meaning

#### [ ] q2 - What should be checkpointed versus replayed?

Question:
- which accepted states should be kept as full checkpoints, and which should remain replay-only history entries?

Current suggestion:
- store diff for every accepted command
- store checkpoints at intervals and important milestones
- let future worker docs define the exact checkpoint cadence

#### [ ] q3 - How should historical viewing differ from restoring authored state?

Question:
- when the user scrubs to an old command, are they only viewing that accepted result, or are they changing the live authored graph immediately?

Current suggestion:
- keep these separate
- scrubbing is view-only by default
- restoring or branching must be explicit

#### [ ] q4 - Which family should own the first implementation-ready phase?

Question:
- should the first concrete implementation doc live under `Build Path`, `Worker`, or `Workspace-Modes`?

Current suggestion:
- keep the umbrella and sequencing in `Build Path`
- put the first implementation-ready backend contract phase in `Worker`
- put the first implementation-ready user-facing mode phase in `Workspace-Modes`

### Near-Term Recommendation

Start with one Worker-linked phase and one Workspace-Modes-linked phase.

Suggested order:
- first create the Worker phase that defines accepted history entry truth, checkpoint strategy, and replay/cache seams
- then create the Workspace-Modes phase that defines `Build Path` mode UX on top of that worker truth

That keeps the feature honest:
- the worker does not become a UI timeline system
- the workspace mode does not fake fast history behavior without real cached history support underneath
