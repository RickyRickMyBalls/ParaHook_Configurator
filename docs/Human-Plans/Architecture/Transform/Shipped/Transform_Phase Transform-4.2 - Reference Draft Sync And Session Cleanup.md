# Transform Phase Transform-4.2 - Reference Draft Sync And Session Cleanup

## Doc Header

### Doc History
4. 2026-03-26 23:55: Marked this phase shipped after the shared store-owned reference draft session landed in code, moved the standalone phase record into `Shipped/`, and aligned the doc with the delivered active-session, viewer-draft sync, Console/toolbar draft-read, and commit/cancel behavior
3. 2026-03-26 20:10: Narrowed this `Transform 4.2` spec again by moving grouped transform-session history out into a later `Transform 4.3` follow-on, so this phase now keeps committed history intact but no longer owns the expandable `Transform 1`, `Transform 2`, and later session-group toolbar reshape
2. 2026-03-26 20:07: Updated this `Transform 4.2` spec to lock the newer history direction, keeping committed reference transform history intact during the draft/session cleanup and grouping committed entries under expandable shell-session rows like `Transform 1`, `Transform 2`, and later sessions instead of treating the history only as one flat list
1. 2026-03-26 20:00: Created this standalone `Transform 4.2` future phase doc under the Transform family to capture the reference-side shared draft/session cleanup, restructuring reference transform around one store-owned live draft session so viewer gizmo changes, Console prompts, and toolbar state all read from the same transform truth like sketch-plane transform already does

### Purpose

This phase cleans up the reference transform implementation so live gizmo movement and Console state stay synchronized through one shared draft session.

Use it to answer:
- how reference transform draft state should be structured
- where live gizmo changes should write
- what Console and toolbar should read during a live transform entry
- how entry commit and cancel should relate to one shared draft instead of several loosely-related flags
- how committed history should survive this cleanup without being flattened or lost

## Doc Body

## [x] Transform 4.2 - Reference Draft Sync And Session Cleanup

### Summary

`Transform 4.2` is the cleanup pass that makes reference transform follow the same core pattern already proven by sketch-plane transform:

- one shared live draft in store
- viewer gizmo changes publish into that draft continuously
- Console reads from that same draft
- toolbar reads from that same draft
- commit and cancel operate against the same draft origin

Before this phase, reference transform state was still spread across:
- `activeTransformReferenceId`
- `activeTransformEntryActive`
- `activeTransformMode`
- `activeTransformSpace`
- `activeTransformSessionOrigin`
- `transformOverrideById`

That older shape worked, but it made the live sync path harder to reason about than sketch-plane transform.

### Shipped Result

The shipped `Transform 4.2` cut landed the intended runtime cleanup:
- one shared `activeReferenceTransformSession` now owns the active reference transform shell, entry state, draft, and entry origin
- viewer gizmo changes write into that live draft continuously instead of mutating scattered runtime fields
- Console, toolbar, Browser highlight, and evaluated active-reference override reads now come from that same live draft/session truth
- commit promotes changed draft state into committed override and history, while cancel restores from the captured entry origin without wiping existing committed history

### Owns

- reference-side transform draft/session cleanup
- one shared store-owned draft object for the active reference transform entry
- continuous viewer-to-store live draft sync for reference transform
- Console and toolbar reading from the same active reference draft state
- clearer entry-origin, commit, and cancel semantics for reference transform
- keeping committed history intact during the draft/session cleanup

### Does Not Own

- widening this cleanup to object/folder/assembly transform in the same patch
- new viewport history visuals or traversal behavior
- later transform-history playback, scrub, or restore
- broader Browser hierarchy changes already covered by `Transform 2`
- durable shell lifetime rules already covered by `Transform 3`

### Problem Read

Sketch-plane transform already has the cleaner pattern:

- viewer gizmo change publishes live draft changes into store
- store owns one active draft object
- Console feature assist is built from that draft object
- toolbar controls read and write the same draft object

Reference transform already has pieces of this:

- viewer publishes transform changes through `setOnReferenceTransformChange`
- Console reads current values from app/store
- toolbar reads current transform override state

But the current reference state is still fragmented enough that:

- live Console sync is more indirect than it needs to be
- cancel/commit behavior depends on several separate fields
- the active entry truth is harder to audit than sketch-plane

### Locked Direction

#### 1. Add one shared active reference transform draft session

Recommendation:
- add one active reference transform draft session object under `referenceWorkspace`

Expected shape:
- `activeReferenceTransformSession`
  - `referenceId`
  - `mode`
  - `space`
  - `shellActive`
  - `entryActive`
  - `draftTransform`
  - `entryOrigin`

Direction:
- `draftTransform` is the live transform being edited right now
- `entryOrigin` is the baseline for the current `Move`, `Rotate`, or `Scale` entry
- the shell can stay active while `entryActive` flips on and off across repeated entries

This should become the first place Console and toolbar look for the active reference transform state.

#### 2. Viewer gizmo changes should write into `draftTransform`

Recommendation:
- keep the viewer as the live execution owner
- keep the viewer-host seam as the place where viewer changes are pushed into app/store
- when the viewer gizmo changes the active reference transform, write that result into the shared active draft session

Direction:
- do not treat `transformOverrideById` as the first live draft owner during an active entry
- let `transformOverrideById` remain the committed/current applied reference transform surface
- let the active draft session be the explicit live in-progress state

#### 3. Console feature assist should read the active draft session directly

Recommendation:
- build reference transform Console assist from `activeReferenceTransformSession.draftTransform`
- do not reconstruct the live entry state by combining multiple unrelated reference workspace fields

This means:
- breadcrumb, `Vec3`, axis prompts, and plane prompts all read from one draft source
- if the user drags the gizmo, the Console updates because the draft changed
- if the user types a value in Console, the same draft changes and the gizmo follows

#### 4. Toolbar should read the same active draft session

Recommendation:
- reference transform toolbar controls should read the same active draft session while an entry is active
- committed history still stays in the committed history list
- draft values should not require a second toolbar-local source of truth

This keeps:
- Console
- toolbar
- viewer

aligned on one active reference transform entry state.

#### 5. Commit and cancel should operate against `entryOrigin`

Recommendation:
- when a new `Move`, `Rotate`, or `Scale` entry begins:
  - capture `entryOrigin` from the current committed/applied transform
- while the entry is active:
  - `draftTransform` moves live
- on commit:
  - promote the draft to the current applied reference transform
  - append history if the value changed
  - clear `entryActive`
  - keep the shell active
- on cancel:
  - restore `draftTransform` and applied transform from `entryOrigin`
  - clear `entryActive`
  - keep the shell active unless the user exits the shell

This mirrors the sketch-plane pattern more honestly.

#### 6. Keep committed history intact during the draft/session cleanup

Recommendation:
- keep all committed reference transform history
- do not wipe, flatten, or reset old committed entries during this cleanup

Direction:
- commit should still append against the existing committed history model when the value changed
- cancel should restore from `entryOrigin` and append nothing
- merge/lock behavior should continue to apply to the existing committed entries
- grouped transform-session history should be handled by a later `Transform 4.3` follow-on instead of this cleanup

This keeps the real committed history stable while the shared draft/session cleanup is landed first.

### Implementation Direction

#### Store

Primary target:
- `src/app/store/useAppStore.ts`

Expected changes:
- add an explicit `ActiveReferenceTransformSession` type
- add `activeReferenceTransformSession: ActiveReferenceTransformSession | null`
- migrate current active reference transform helpers to read/write that session
- keep committed history and committed transform override ownership in app/store

Likely follow-on helpers:
- `beginReferenceTransformShell(referenceId)`
- `exitReferenceTransformShell()`
- `beginReferenceTransformEntry(mode)`
- `updateActiveReferenceTransformDraft(transformOverride)`
- `commitActiveReferenceTransformEntry()`
- `cancelActiveReferenceTransformEntry()`

#### Viewer Host

Primary target:
- `src/app/components/ViewerHost.tsx`

Expected changes:
- keep `setOnReferenceTransformChange(...)`
- route live viewer changes into `updateActiveReferenceTransformDraft(...)`
- keep commit callback wiring, but let it operate on the shared draft session

#### Console

Primary target:
- `src/app/console/ConsoleDock.tsx`

Expected changes:
- rebuild the reference transform assist descriptor from the active draft session
- simplify prompt handlers so typed values update the shared draft session
- keep `CommitTransform` and `Esc` shell behavior from `Transform 3`
- make live Console readout follow gizmo drag continuously through the shared draft

#### Toolbar

Primary targets:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`

Expected changes:
- read active reference draft state from the shared session
- avoid inventing extra toolbar-only draft state for the active entry
- keep history rendering against committed history rows, not the live draft

### Public Interfaces / Types

Expected new types:
- `ActiveReferenceTransformSession`
- possibly `ReferenceTransformDraftState`

Expected interface adjustments:
- app/store selectors for:
  - active reference transform shell
  - active reference transform entry
  - active reference draft vec3 for current mode

No viewer redesign is required if the current callbacks remain sufficient.

### Test Plan

Required verification:

- viewer-to-console sync:
  - when the user drags the reference gizmo, Console `Vec3` updates live from the shared draft

- console-to-viewer sync:
  - when the user types a vec3, axis float, or plane value, the shared draft updates and the viewer follows

- toolbar sync:
  - toolbar reads the same active draft state during a live entry

- commit:
  - commit promotes the draft, appends history when changed, and returns to `Transform > Choose next`
  - committed entry lands under the current transform-shell history group

- cancel:
  - cancel restores from `entryOrigin`
  - cancel does not append history

- history preservation:
  - existing committed history survives the cleanup unchanged
  - grouped transform-session history remains out of scope for `Transform 4.2`
  - later grouped toolbar history belongs to `Transform 4.3`

- shell persistence:
  - the transform shell remains active across repeated entries
  - `CommitTransform` still exits the shell and hides the toolbar

- regression:
  - reference transform arming still works
  - reference transform history still works
  - sketch-plane transform behavior remains unchanged

### File Targets

Primary files:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/components/ViewportOverlay.tsx`

### Assumptions

- this cleanup is reference-first only
- object/folder/assembly shared draft cleanup can follow once the reference path is honest
- the sketch-plane transform pattern is the right structural reference for this cleanup
- `Transform 4.2` is a cleanup/spec clarification under `Transform 4`, not a new hierarchy phase
- grouped transform-session history is deferred to `Transform 4.3`
