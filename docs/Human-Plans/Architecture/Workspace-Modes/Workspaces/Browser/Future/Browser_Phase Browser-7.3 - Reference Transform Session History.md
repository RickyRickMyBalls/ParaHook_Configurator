# Browser Phase Browser-7.3 - Reference Transform Session History

## Doc Header

### Doc History
4. 2026-03-26 16:24: Tightened this standalone `Browser-7.3` spec for immediate implementation by making the live transform command surface explicit, locking `CommitTransform` plus `Esc` behavior inside the active session, and clarifying the assisted vec3 prefill versus typed axis/plane-entry flow so the next implementation pass does not have to infer those rules
3. 2026-03-26 16:15: Expanded the locked live transform option pattern so the explicit `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ` in-session options plus the assisted-prefill and typed-entry restore rules now apply to `Rotate` and `Scale` as well as `Move`
2. 2026-03-26 16:12: Expanded the live-session spec by locking the first explicit `Move` in-session option set to `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ`, and by clarifying the assisted-prefill rule where `Vec3` is the default live autofill, axis/plane option entry clears that autofill for typed input, and clearing typed input restores the vec3 assist
1. 2026-03-26 14:23: Created this standalone future Browser follow-on doc, splitting `b7.3` out of the broader Browser-7 cleanup bucket now that the reference-first transform-session, commit flow, store-owned history model, and toolbar follow-on are locked tightly enough to stand as their own implementation-ready phase surface

### Purpose

This phase turns selected-reference transform into a real live Console-led session with cumulative transform history.

Use it to answer:
- how selected-reference `Move`, `Rotate`, and `Scale` should behave as one honest live transform session instead of one-shot launch actions
- what explicit in-session transform options and live commands that session should expose
- how commit should work for viewport drag release, `Enter`, and `CommitTransform`
- where reference transform-history state should live
- how the reference transform toolbar should expose collapse, lock, and merge history behavior

## Doc Body

## [ ] Browser-7.3 - Reference Transform Session History

### Summary

This phase is reference-first.

It does not generalize transform ownership across Browser objects, assemblies, folders, or multi-select in the same patch. It tightens the already-existing selected-reference transform surface into a real live session and adds a store-owned history model that later phases can reuse.

Phase outcome:
- selected-reference `Move`, `Rotate`, and `Scale` become one honest live transform session
- Console stays aligned with the active viewer transform instead of falling back to the generic selected-reference menu while transform is active
- committed reference transforms append to one target-local history list
- the reference transform toolbar gains a collapsible `Transform History` section with lock and merge controls
- the data model is shaped so later object/assembly follow-ons can reuse it without redesign

### Owns

- selected-reference live transform session behavior
- shared commit semantics for active reference transform
- reference-local transform-history state and row model
- reference transform toolbar history UI
- the missing viewer-to-store commit callback seam for reference transforms

### Does Not Own

- authored object or assembly transform ownership
- references-root or category-level grouped transform behavior
- bulk multi-select transform semantics
- unrelated camera, zoom, or rendering changes
- a full reference-toolbar redesign outside the history follow-on

### Live Code Alignment

The current code already has the main reference seams this phase should build on:

- `src/app/console/stagedNavigation.ts`
  - selected reference scope already exposes `Move`, `Rotate`, `Scale`, `Zoom`, and `Back`
- `src/app/console/ConsoleDock.tsx`
  - already dispatches `reference.transform.move`
  - already dispatches `reference.transform.rotate`
  - already dispatches `reference.transform.scale`
  - already publishes active reference transform breadcrumb state
- `src/app/store/useAppStore.ts`
  - already owns `referenceWorkspace.activeTransformReferenceId`
  - already owns `referenceWorkspace.activeTransformMode`
  - already owns `referenceWorkspace.transformOverrideById`
- `src/app/components/ReferenceTransformToolbar.tsx`
  - already acts as the active reference transform surface
- `src/app/components/ViewerHost.tsx`
  - already syncs viewer transform change, exit, mode, and space events into app state
- `src/viewer/Viewer.ts`
  - already owns live reference transform execution
  - does not yet expose a reference-transform commit callback parallel to the existing sketch-plane commit seam

So this phase should not invent a second transform system. It should tighten the existing one.

### Locked Direction

#### 1. Scope is reference-first

This first pass only owns `referenceSelected`.

Locked rule:
- selected reference scope keeps exposing:
  - `Move`
  - `Rotate`
  - `Scale`
  - `Zoom`
  - `Back`
- do not redesign this into a new parent `Transform` branch for the first pass
- do not widen the patch into object, assembly, folder, or multi-select transform ownership

Later direction:
- the session and history data model should be reusable later for authored objects and assemblies
- that later reuse is explicitly outside this phase

#### 2. Active transform should be a real live session

Launching `Move`, `Rotate`, or `Scale` should enter the live transform session immediately.

Locked rule:
- user selects a reference
- user chooses `Move`, `Rotate`, or `Scale`
- viewer gizmo arms immediately
- Console stops showing the generic selected-reference `Choose next [...]` prompt
- Console instead shows the active live transform path in the compact style:
  - `<Reference Label> > M > Vec3 [...]`
  - `<Reference Label> > R > Vec3 [...]`
  - `<Reference Label> > S > Vec3 [...]`
- this should match the sketch-plane transform direction more closely than the older passive status treatment

The Console path should stay honest to the active live transform, not to the parent selected-reference scope.

Locked active-session command surface:
- while live transform is active, Console exposes:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
  - `XY`
  - `XZ`
  - `YZ`
  - `CommitTransform`
- viewport click commit remains valid while that same live session is active
- `Enter` should behave the same as choosing `CommitTransform`
- `Esc` should cancel the active live transform session and return to the normal selected-reference scope without appending a history row

Locked first-pass live transform options:
- inside live `Move`, `Rotate`, and `Scale`, Console exposes:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
  - `XY`
  - `XZ`
  - `YZ`
- `Vec3` is the default assisted/autofill option using the current live transform value
- while `Vec3` is active, the user may still commit by viewport click or `Enter`
- choosing an axis or plane option like `X` removes the active vec3 autofill and gives typed entry control of the input
- if the user clears typed input back to empty, restore the default assisted vec3 option

Typed-entry rule:
- typed axis or plane entry replaces the assisted vec3 prefill only for the currently chosen option
- clearing that typed value back to empty restores the default assisted vec3 option rather than leaving the session in an empty no-choice state

First-pass input rule:
- live transform scope may still listen for keyboard transform commands while the default assisted vec3 option is visible
- explicit option selection should take precedence over leaving stale autofill text in the input

#### 3. Commit semantics

Commit should finalize the current live transform and append one history row when the draft changed.

Locked rule:
- viewport drag release commit appends one history row
- `Enter` commit appends one history row
- `CommitTransform` and `Enter` mean the same thing while a live transform is active
- live drag preview must not append history rows
- unchanged draft state must not append duplicate history rows

Return rule:
- after commit, exit the active live transform session
- return to the normal selected-reference scope for the same highlighted reference
- repeated transforms require re-entering `Move`, `Rotate`, or `Scale`

Cancel rule:
- `Esc` cancels the active live transform session
- cancel returns to the normal selected-reference scope for the same highlighted reference
- cancel does not append a history row
- cancel restores the last committed transform state instead of preserving the uncommitted draft

This phase should add the missing reference-transform commit callback seam so viewport drag release can be observed by app/store ownership without moving transform execution out of the viewer.

#### 4. History model

History is target-local and append-on-commit only.

Locked rule:
- store history in `useAppStore`, keyed by `referenceId`
- each committed step appends one entry to that reference's list
- repeated commits append repeated rows instead of replacing the list
- history should survive leaving and re-entering the live transform session for the same reference

Recommended first entry shape:
- `entryId`
- `kind`
  - `move`
  - `rotate`
  - `scale`
- absolute committed vec3 value
- `locked`

Display rule:
- store absolute committed snapshots
- derive human-readable row deltas against the previous committed entry
- row labels should read like:
  - `Move Vec(+x, +y, +z)`
  - `Rotate Vec(+x, +y, +z)`
  - `Scale Vec(+x, +y, +z)`

Baseline rule:
- first `Move` and `Rotate` deltas read against `(0, 0, 0)`
- first `Scale` delta reads against `(1, 1, 1)`

#### 5. Toolbar history UI

The reference transform toolbar should gain a real history section.

Locked rule:
- add a collapsible `Transform History` section
- keep it parallel to the sketch-plane transform-history idea, but enrich it for move, rotate, and scale entries
- section contents:
  - `Origin`
  - one row per committed transform entry
  - `Lock/Unlock` action per row
  - `Merge History` action in the section header

Merge rule:
- preserve the last row
- preserve locked rows
- collapse earlier unlocked rows

This should match the existing sketch-plane history merge semantics rather than inventing a second merge rule.

### Public Interfaces And State

Expected shared state additions:

- `src/app/store/useAppStore.ts`
  - add reference-local transform-history state keyed by `referenceId`
  - add actions along the lines of:
    - append reference transform history entry
    - toggle reference transform history lock
    - merge reference transform history

Expected viewer bridge growth:

- `src/app/viewerBridge.ts`
  - add a reference-transform commit callback registration seam

Expected viewer host wiring:

- `src/app/components/ViewerHost.tsx`
  - wire the new viewer commit callback into the app-store append-history action

Important ownership rule:
- live transform execution stays viewer-owned
- transform history stays app/store-owned
- live Console assist/prefill state should stay Console-owned rather than becoming hidden viewer state

### Required File Targets

Primary implementation seams:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Expected verification seams:
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Test Plan

Required verification:

- selected reference scope:
  - exposes `Move`, `Rotate`, `Scale`, `Zoom`, and `Back`

- live transform session:
  - `M >`, `R >`, and `S >` arm the live viewer command immediately
  - Console shows `<label> > M/R/S > Vec3 [...]` while transform is active
  - generic selected-reference prompt does not remain visible while the live transform session is active
  - inside live `Move`, `Rotate`, and `Scale`, Console exposes `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, `YZ`, and `CommitTransform`
  - choosing `X` clears the assisted vec3 autofill and hands control to typed input
  - clearing typed input back to empty restores the default assisted vec3 option

- commit behavior:
  - viewport drag release appends one history row when the draft changed
  - `Enter` appends one history row when the draft changed
  - `CommitTransform` follows the same commit path as `Enter`
  - unchanged commits do not append duplicate rows
  - after commit, Console returns to the normal selected-reference scope for the same target

- cancel behavior:
  - `Esc` cancels the active live transform session
  - `Esc` restores the last committed transform state
  - `Esc` returns to the normal selected-reference scope for the same target
  - `Esc` does not append a history row

- history UI:
  - `Transform History` renders `Origin`
  - committed move/rotate/scale rows appear with delta labels
  - collapse/expand works
  - `Lock/Unlock` toggles per row
  - `Merge History` preserves locked rows and the last row while collapsing earlier unlocked rows

- regression:
  - existing reference zoom still works
  - existing reference transform arming still works
  - existing sketch-plane transform history remains unchanged

### Assumptions

- this phase is reference-first only
- history is append-on-commit only
- live preview never appends history rows
- history is initially app-store state, not viewer-owned state
- persistence beyond the current app session is not part of this phase unless a later project-save follow-on explicitly takes it on
