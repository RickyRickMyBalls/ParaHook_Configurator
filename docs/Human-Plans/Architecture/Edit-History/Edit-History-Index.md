# Edit History Index

## Doc Header

### Doc History
2. 2026-03-28 13:15: Locked the initial `Edit History` questions into explicit decisions, added a first `Edit History 1` through `Edit History 5` phase ladder, and tightened the family so canonical authored history, transaction boundaries, surface scope, console parity, and later `Pasta Path` sync now read as one sequenced implementation plan instead of only an umbrella concept
1. 2026-03-28 13:07: Created this folder-root architecture index for the new `Edit-History` family, establishing canonical authored-change history for global undo/redo, locking its relationship to `Pasta Path` as a derived scrub reader instead of a competing history owner, and reserving `Future/` and `Shipped/` for later standalone planning and shipped records

### Purpose

This doc defines the umbrella architecture direction for `Edit History`.

This file is the umbrella index for the `Edit-History` family.

Use it to answer:
- what should count as canonical authored edit history in ParaHook
- how `Ctrl+Z` and `Ctrl+Y` should behave across the main editing surfaces
- how `Edit History` should differ from `Pasta Path` scrub/traversal
- what transaction and coalescing rules are implied by sliders, drags, and console-issued edits
- how future standalone planning docs under this family should be organized

### Family Structure

Use this folder like this:

- `Edit-History-Index.md`
  - umbrella architecture direction
  - canonical history ownership
  - first implementation rules
- `Future/`
  - later standalone `Edit History` phase or execution docs
- `Shipped/`
  - later shipped records for completed `Edit History` cuts

### Concept

`Edit History` is the canonical authored-change history for ParaHook.

It should record meaningful user edits across the main editing surfaces, such as:
- `Spaghetti Editor` graph edits
- Browser/content organization edits
- committed transform edits
- slider and typed parameter edits
- console-issued commands that mutate the same underlying authored state

The goal is to give ParaHook one honest undo/redo truth instead of a separate local undo model for every surface.

### Why This Doc Exists

The current codebase already has several local history-like systems:
- command recall in the console
- committed transform history for viewer transform
- sketch-local draft/history behavior
- later `Pasta Path` scrub planning

But those are not the same thing as one app-wide authored undo/redo model.

`Edit History` exists to define that missing canonical layer:
- `Edit History` owns authored mutation history
- `Ctrl+Z` and `Ctrl+Y` traverse that authored history
- `Pasta Path` reads that truth and should visually respond to it, but should not become a second competing undo owner

## Doc Body

### Vision

A single canonical edit-history system for ParaHook that makes authored changes undoable and redoable across the major surfaces without inventing separate conflicting history truths.

### Core Mechanics

- `Canonical Entries`
  - each meaningful authored change becomes one undoable history entry
- `Undo / Redo`
  - `Ctrl+Z` moves backward through authored changes and `Ctrl+Y` moves forward through them
- `Transactions`
  - continuous live interaction can update the UI freely, but history should commit one meaningful entry when the interaction is released or confirmed
- `Derived Readers`
  - surfaces such as `Pasta Path`, transform overlays, and Browser labels should refresh from canonical history state rather than store their own conflicting undo truths

### Relationship To Pasta Path

`Edit History` and `Pasta Path` should coordinate, but they should not be the same system.

Recommended relationship:
- `Edit History`
  - canonical authored-change history
  - source of truth for undo/redo
- `Pasta Path`
  - derived scrub/traversal surface
  - reflects the current authored history state
  - should visually change when undo/redo changes authored truth

Important rule:
- moving a `Pasta Path` playhead is navigation state, not automatically an authored edit
- `Ctrl+Z` should normally undo authored changes, not timeline navigation

### Surface Scope

The first honest scope should target authored surfaces that users will expect to undo:

- `Spaghetti Editor`
  - add/remove nodes
  - connect/remove wires
  - move nodes
  - parameter changes
- Browser/content organization
  - rename
  - reorder
  - reparent
  - delete/create where supported
- transform surfaces
  - committed transform edits
  - not every live drag frame
- parameter controls
  - `ParaSlider`
  - `ParaVec2Slider`
  - `ParaVec3Slider`
  - typed numeric field commits
- console commands
  - only when they mutate the same authored state as the visible UI surfaces

### Non-Goals

The first `Edit History` cut should stay disciplined:

- do not treat every navigation state change as authored history
- do not make camera movement part of canonical undo/redo
- do not record every slider tick or gizmo drag frame as its own history step
- do not let `Pasta Path` become a second owner of undo truth
- do not require every derived visual surface to invent custom history storage before canonical edit history exists

### Transaction Rules

The first edit-history model should prefer meaningful transaction boundaries over raw event spam.

Recommended first rules:

- slider drags
  - live-update continuously
  - record one entry on pointer release if the value changed
- typed numeric edits
  - record one entry on `Enter` or blur when the committed value changed
- drag-reorder or drag-reparent
  - record one entry on drop
- transform drags
  - live-update continuously
  - record one committed entry on release/commit
- console mutation commands
  - route into the same shared mutation seams used by the UI
  - reuse the same history transaction rather than creating console-only inverse logic

### Storage Direction

The first honest storage direction should be one canonical edit-history layer with explicit transaction records, while still allowing different subsystems to adapt into it.

Recommended shape:

- canonical history records authored mutations
- entries should carry enough information to undo and redo safely
- storage may be snapshot-based, inverse-command-based, or hybrid per subsystem
- the user-facing behavior should still read as one shared undo/redo system

### First Constraints

The first `Edit History` cut should stay disciplined:

- history must be canonical for authored state
- derived surfaces should read history truth instead of duplicating it
- continuous interactions should coalesce into one committed step
- undo/redo should stay honest per surface and not claim support for pure view-state changes that are not yet modeled as authored edits
- the first cut should prioritize strong single-user undo/redo semantics before later collaboration, branching, or multiplayer history behavior

## Phases

### [ ] Edit History 1 - Canonical Entry And Transaction Foundation

- establish one canonical authored edit-history layer for ParaHook
- define the base undo/redo entry shape, transaction lifecycle, and per-surface adapter model
- lock the first coalescing rules so continuous interaction can stay live without spamming history
- keep this phase focused on foundation, not complete surface coverage

Recommended first ownership:
- one shared history owner layer
- one shared transaction concept
- one clear boundary between authored edits and pure navigation/view state

### [ ] Edit History 2 - Spaghetti Graph And Parameter Commit Coverage

- make the highest-value graph edits undoable and redoable first
- cover node add/remove, wire connect/remove, node move, and graph parameter commits
- include slider and typed parameter commits under release/confirm semantics instead of per-tick history spam
- keep console mutations routed into the same graph/parameter seams where possible

Recommended first proof:
- `Spaghetti Editor` graph mutations
- `ParaSlider`, `ParaVec2Slider`, and `ParaVec3Slider` commit behavior
- typed numeric field commit parity with the same underlying store actions

### [ ] Edit History 3 - Browser Content Organization And Console Parity

- widen canonical undo/redo into Browser/content organization
- cover rename, reorder, reparent, and delete/create where the app already supports those actions
- keep `Console` as an equal adapter over the same authored mutation seams instead of a separate history owner
- preserve one shared undo truth whether the change came from Browser UI or Console command entry

Recommended first proof:
- Browser/content structure edits
- content-organization commands issued through `Console`
- drop-on-release transaction behavior for reorder/reparent

### [ ] Edit History 4 - Viewer Transform Commit Integration And Shared Dispatch

- widen edit history into committed transform behavior without recording every live drag frame
- keep transform draft/live drag responsive while only committing history on release or explicit commit
- route keyboard undo/redo through one shared dispatch layer that can call the correct surface owner
- preserve the already-shipped local transform-history reads while aligning canonical authored undo semantics

Recommended first proof:
- committed transform entries become undoable authored steps
- `Ctrl+Z` and `Ctrl+Y` route through one shared dispatch layer
- transform entry/live drag remains separate from canonical commit history

### [ ] Edit History 5 - Pasta Path Sync, Derived Readers, And Later History UX

- make `Pasta Path` and other derived history readers respond to canonical authored undo/redo truth
- keep `Pasta Path` as a scrub/read surface instead of a second undo owner
- define how later history UI, labels, timeline emphasis, or audit surfaces read from canonical entries
- leave collaboration, multiplayer branching, and more advanced history visualization to later follow-ons unless needed earlier

Recommended first proof:
- `Pasta Path` visibly changes when authored undo/redo changes the canonical model state
- timeline scrub remains navigation state, not an authored edit by default
- derived readers can rebuild from canonical history without inventing duplicate undo models

## Questions / Decisions

### [x] q1 - should `Edit History` be the canonical authored history for ParaHook, with `Pasta Path` reading that truth instead of owning a second undo model?

#### Suggestion

Yes. `Edit History` should be the canonical authored history. `Pasta Path` should derive its scrub/read surface from that truth and should visually respond when undo/redo changes the authored state.

Decision:

- yes
- `Edit History` should be the canonical authored history for ParaHook
- `Pasta Path` should read and visually respond to canonical authored history changes
- `Pasta Path` should not become a second competing undo owner

### [x] q2 - should the first cut prioritize authored data edits and explicitly exclude pure navigation/view-state changes such as camera orbit and temporary selection-only state?

#### Suggestion

Yes. The first cut should prioritize authored data edits. Keep camera movement, temporary hover state, and other pure navigation/view state out of canonical undo/redo unless those states later become explicitly authored features.

Decision:

- yes
- the first cut should prioritize authored data edits
- camera movement, temporary hover state, and other pure navigation/view state should stay out of canonical undo/redo in the first pass
- these view-state surfaces can be widened later only if they become explicitly authored features

### [x] q3 - should slider and drag-style interactions commit one history entry on release/confirm instead of recording every intermediate live value?

#### Suggestion

Yes. Keep live interaction fluid, but commit one history entry on release or confirm. That makes undo meaningful and prevents history spam.

Decision:

- yes
- slider and drag-style interactions should stay live during interaction
- canonical history should record one entry on release, drop, confirm, `Enter`, or equivalent commit
- do not record every intermediate live value as its own history step

### [x] q4 - should console commands that mutate authored state reuse the same shared store mutation seams as the visible UI so undo/redo stays surface-agnostic?

#### Suggestion

Yes. Console mutations should flow through the same underlying authored mutation seams as the UI. The history system should record the shared state change, not the fact that the command came from the console.

Decision:

- yes
- console commands that mutate authored state should reuse the same shared store mutation seams as the UI
- undo/redo should record the shared authored state change rather than the entry surface
- `Console` should stay an adapter into canonical history, not a separate history owner

### [x] q5 - should the first implementation phase start with the highest-value authored surfaces such as graph edits, parameter commits, Browser organization, and committed transforms before widening into every edge case?

#### Suggestion

Yes. Start with the highest-value authored surfaces first. Prove the canonical model on graph edits, parameter commits, Browser organization, and committed transforms before widening into lower-priority or more ambiguous edit classes.

Decision:

- yes
- the first implementation phase should start with the highest-value authored surfaces
- prove the model first on graph edits, parameter commits, Browser organization, and committed transforms
- widen into lower-priority or more ambiguous edit classes only after the canonical model is stable
