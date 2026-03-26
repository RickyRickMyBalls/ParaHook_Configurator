# Browser Phase Browser-7 - Browser Cleanup Follow-Ons

## Doc Header

### Doc History
9. 2026-03-26 16:15: Broadened the newly locked `b7.3` live transform option pattern so `Rotate` and `Scale` now follow the same first in-session option set and assisted vec3-prefill rules as `Move`
8. 2026-03-26 16:12: Tightened `b7.3` again by locking the first explicit `Move` in-session option set to `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ`, plus the assisted-prefill rule where the current live vec3 is the default autofill, axis/plane option entry clears that autofill for typed input, and clearing typed input restores the vec3 assist
7. 2026-03-26 14:23: Created the dedicated standalone future phase doc `Browser_Phase Browser-7.3 - Reference Transform Session History.md` under `Browser/Future/` so the now-locked reference-first transform-session and history work no longer lives only as one entry inside the Browser-7 cleanup bucket
6. 2026-03-26 14:14: Tightened `b7.3` again by deleting the misleading read-only/status wording, locking the Console behavior to a real live transform session that matches sketch-plane transform more closely, and clarifying that the reference toolbar history is the enriched move/rotate/scale follow-on rather than a passive status mirror
5. 2026-03-26 14:05: Cleaned up `b7.3` after locking the real reference-first transform-session flow, removing the incorrect persistent post-commit transform root, dropping the speculative shared object/folder scope expansion from the first pass, and clarifying that `CommitTransform` / `Enter` finalizes the live transform then returns the user to the normal selected-target scope
4. 2026-03-26 13:23: Marked `b7.2` shipped after extending the shared Console `Zoom` family across object, assembly, multi-select, references-root, reference-category, and selected-reference scopes, then added `b7.3` as the next implementation-facing follow-on for shared viewer-transform command surfaces across objects and Browser folder scopes
3. 2026-03-26 08:18: Detailed `b7.2` into an implementation-ready Browser-7 follow-on by locking the live-gap read, the object-scope `Zoom` command shape, the staged-navigation/session direction, and the verification surface so the next pass can add object-local `Zoom` without inventing a parallel command grammar
2. 2026-03-26 07:56: Marked `b7.1` shipped after tightening the real viewport pick path onto the shared explicit-selection seam, so `Ctrl` multi-pick from the model viewport now mirrors into Browser row multi-selection, keeps grouped viewer highlight aligned with the shared resolved selection set, and no longer leaves viewport-picked references stuck on single-select replacement
1. 2026-03-25 17:29: Created this standalone future Browser-7 phase doc as the next cleanup-tracking surface after Browser-6, explicitly reserving it for smaller Browser follow-on entries such as viewport multi-select sync and per-object zoom command-surface expansion

### Purpose

This phase is the small-follow-on Browser cleanup surface after Browser-6.

Use it to track:
- narrower Browser improvements that are real product behavior changes but do not need another large structural phase
- cleanup entries that should stay grouped under one Browser follow-on instead of being left as scattered chat-only notes
- Browser/viewer/console interaction gaps discovered while using the shipped Browser-6 structure

## Doc Body

## [ ] Browser-7 - Browser Cleanup Follow-Ons

### Summary

Browser-7 is the cleanup bucket for the next small, real Browser behavior improvements after the Browser-6 panel-structure split.

Phase outcome:
- small Browser cleanup work gets one canonical tracking surface
- Browser/viewer/console sync follow-ons stay attached to the Browser phase ladder
- each landed improvement can be recorded as one concrete Browser-7 entry instead of living only in transient chat context

### Owns

- smaller Browser follow-on improvements after Browser-6
- Browser/viewer/console interaction cleanup that is narrower than another structural panel phase
- incremental command-surface and selection-sync cleanup for existing row families

### Does Not Own

- another large BrowserPanel architecture rewrite
- full Browser primitive convergence across authored and imported content
- unrelated viewer-only camera or rendering work unless the Browser command surface explicitly owns the user-facing behavior

### Entry Tracking Rule

Browser-7 should be used as an accumulating cleanup phase.

Locked rule:
- add small concrete cleanup items under one visible tracked-entry list
- keep each item narrow and implementation-facing
- when one item lands, mark it shipped in the Browser-7 tracking list and log the real code change normally in `docs/CHANGELOG.md`
- do not let small Browser cleanup discoveries disappear into chat without a Browser-7 record

### Tracked Entries

#### [x] b7.1 - Viewport explicit multi-select should sync back into Browser multi-select

Problem:
- when the user holds `Ctrl` and multi-selects multiple objects in the model viewport, Browser selection does not yet reliably mirror that explicit object set

Required outcome:
- explicit object multi-selection created from the model viewport should sync into Browser row multi-selection
- the synced Browser state should use the same shared explicit-selection truth already established by Browser-5.4 instead of a viewer-local parallel selection set

Constraints:
- keep one primary shared explicit selection set
- do not reintroduce Browser-local selection ownership
- preserve current single-select behavior when `Ctrl` is not used

Shipped result:
- viewport-picked object `Ctrl+click` now writes through the same shared explicit-selection truth already used by Browser row multi-select
- Browser row multi-selection now follows the viewport-created explicit object set instead of drifting behind a viewer-local replacement path
- grouped viewer highlight now stays aligned with the shared resolved content-selection set during viewport-created explicit multi-select
- viewport-picked references now also use the same additive toggle seam instead of staying hard-coded to single-select replacement

Verification:
- `Ctrl` multi-pick multiple objects in the viewport
- Browser shows the same objects as explicitly selected
- Console multi-select context remains honest
- grouped viewer highlight stays aligned with the shared selection set

#### [x] b7.2 - Shared selection scopes should expose the `Zoom` command family

Problem:
- the shared selection scopes were inconsistent: object selection dead-ended as `Object > Choose next [Back]`, assembly had no local zoom branch, references folders could not frame themselves, and multi-select context did not yet expose a real zoom family
- the reusable zoom grammar and execution path already existed elsewhere, so the gap was command-surface composition rather than missing camera behavior

Required outcome:
- object, assembly, multi-select, references-root, reference-category, and selected-reference scopes should all expose `Zoom` where the user already has a real shared selection scope
- each local `Zoom` branch should reuse the same canonical child grammar:
  - `All`
  - `Extents`
  - `Previous`
  - `Window`
  - `Object`
  - `Back`
- Browser-selected and viewport-selected objects should stay on the same shared scope and therefore expose the same local `Zoom` entry without per-surface duplication

Constraints:
- keep naming and child-option grammar consistent with the existing Console zoom families
- do not add one-off scope-specific zoom wording if the shared zoom command family already has a better canonical shape
- do not split Browser-selected objects and viewport-selected objects into separate command implementations
- do not redesign the underlying viewer camera commands if the existing shared zoom actions already cover the needed behavior

Shipped result:
- `contentObjectSelected` now exposes `Zoom`, and Browser-selected plus viewport-selected objects both enter the same object-local `Zoom` branch
- `contentAssemblySelected` now exposes `Zoom`, and `Assembly > Zoom > Object` frames the shared assembly content selection through the resolved object part-key set
- synthetic multi-select now renders an honest labeled status line and exposes `Zoom`, with `Zoom > Object` framing the current explicit selection set instead of a single anchor item
- `referencesSelected`, `referenceCategorySelected`, and `referenceSelected` now all expose `Zoom`, so `References`, `Footpads`, `Shoes`, and individual reference items all have a real local zoom family
- successful local zoom actions now unwind back to their owning scope instead of dropping the user to Console root

Primary seams shipped:
- `src/app/console/stagedNavigation.ts`
  - added local zoom roots for object, assembly, multi-select, references-root, reference-category, and selected-reference scopes
  - expanded each owning scope to expose `Zoom` before `Back`
- `src/app/console/ConsoleDock.tsx`
  - executes local zoom actions through the shared model zoom path
  - resolves object and assembly framing through shared selection content instead of per-scope viewer hacks
  - frames reference folders through the collected folder reference-id set
- `src/app/console/ConsoleBar.tsx`
  - renders honest local zoom breadcrumbs for the new scoped sessions
- `src/app/console/radioCommandIdentity.ts`
  - keeps radio/identity naming aligned with the new local zoom branches

Verification:
- select an object from Browser and from viewport, confirm both expose `Zoom`
- confirm `Object > Zoom > Object` frames successfully even when Browser selection did not seed a live `selectedPartKey`
- confirm `Assembly > Zoom > Object` frames the current assembly content set
- confirm `Multi-Select > Zoom > Object` frames the current explicit mixed object/reference set
- confirm `References > Zoom > Object` frames the references-root set
- confirm `Footpads > Zoom > Object` and `Shoes > Zoom > Object` frame the category set
- confirm selected reference items expose `Zoom` and return to `Reference > <label>` after completion
- confirm `Zoom > Window` still arms the existing viewport zoom-window mode and returns to the owning scope on success

Locked direction:
- `b7.2` shipped as a command-surface completion pass, not a new camera-system phase
- local scopes reuse the shared zoom family instead of inventing scope-specific zoom verbs
- selection ownership remains shared across Browser, viewport, and Console surfaces

#### [ ] b7.3 - Reference transform sessions should expose live Console state and cumulative transform history

Standalone phase doc:
- `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7.3 - Reference Transform Session History.md`

Problem:
- selected reference items already expose `Move`, `Rotate`, and `Scale`, but the Console still treats those as one-shot launch actions instead of an honest reference-local transform session
- after `M >`, `R >`, or `S >`, the toolbar opens and the viewer gizmo is live, but the Console should stop reading as a generic `Choose next [Move, Rotate, Scale, Zoom, Back]` scope and should instead publish the active transform state
- committed transforms do not yet accumulate into a visible transform-history list that survives repeated `Move`, `Rotate`, and `Scale` commits for the same selected target

Required outcome:
- this phase should make the selected-reference flow honest first, without widening into assemblies, objects, or Browser folder transforms in the same patch
- selected reference scope should keep exposing:
  - `Move`
  - `Rotate`
  - `Scale`
  - `Zoom`
  - `Back`
- when the user launches `M >`, `R >`, or `S >` from a selected target, the Console should switch from the generic scope prompt into a live transform-state readout
- while a transform session is active, the Console should read the current vec3 according to live mouse-driven preview or the currently typed transform value
- when the user commits a transform by viewport click or `Enter`, the committed step should append to a visible transform-history list in the transform toolbar
- `CommitTransform` and `Enter` should mean the same thing while a live transform is active: apply the current transform to the active target and end the live transform session
- after commit, the user should return to the normal selected-target scope for that same target, not to a persistent post-commit transform root
- if the user commits another transform step, the history list should append another row instead of replacing the previous one

Locked interaction flow:
- user selects a reference item
- Console enters the selected target scope
- user launches `M >`, `R >`, or `S >`
- transform toolbar opens and the viewer command is already armed
- Console enters the active transform session instead of continuing to show the parent `Choose next` menu
- while that live session is active, `CommitTransform` or `Enter` finalizes the transform
- committed transform appends one history row
- Console returns to the normal selected-reference scope for the same highlighted target
- additional committed transforms append additional history rows when the user re-enters `Move`, `Rotate`, or `Scale`

Locked Console direction:
- the Console should behave like a real live transform session, matching the sketch-plane transform direction instead of reading as a passive status display
- this phase should delete the remaining read-only/status treatment for active reference transform
- the active transform-state line should read in the same compact console style already used by sketch-plane transform work:
  - `<Target Label> > M > Vec3 [...]`
  - `<Target Label> > R > Vec3 [...]`
  - `<Target Label> > S > Vec3 [...]`
- during active transform display, the Console should read as the live transform surface rather than as a generic staged `Choose next [...]` prompt
- first locked `Move` in-session options are:
- first locked in-session options for `Move`, `Rotate`, and `Scale` are:
  - `Vec3`
  - `X`
  - `Y`
  - `Z`
  - `XY`
  - `XZ`
  - `YZ`
- `Vec3` is the default assisted/autofill option using the current live transform value
- choosing an axis or plane option like `X` clears that active vec3 autofill and hands the input to typed entry
- clearing typed input back to empty restores the default assisted vec3 option

Transform-history direction:
- history should append on commit only
- live drag preview should not create rows
- first shipped version should support:
  - move entries
  - rotate entries
  - scale entries
- history should be target-local, meaning each selected reference/object/assembly owns its own accumulated transform-history stack
- the transform toolbar should gain a collapsible `Transform History` section parallel to sketch-plane transform
- the section should show:
  - `Origin`
  - one row per committed transform entry
  - `Lock/Unlock` per row
  - `Merge History`
- this should follow the same user-facing idea as sketch-plane transform history, but enriched so the list can represent `Move`, `Rotate`, and `Scale` commits instead of translation-only entries

Recommended history data model:
- each history row should store:
  - `entryId`
  - `kind`
    - `move`
    - `rotate`
    - `scale`
  - absolute committed vec3 value
  - display delta derived against the previous entry
  - `locked`
- store absolute transform snapshots rather than only deltas so merge/replay remains stable
- derive human-readable row labels from the previous committed snapshot, for example:
  - `Move Vec(+x, +y, +z)`
  - `Rotate Vec(+x, +y, +z)`
  - `Scale Vec(+x, +y, +z)`

First-pass scope coverage:
- `referenceSelected`
- later follow-ons may reuse the same session and history contract for authored object or assembly targets, but that expansion is explicitly out of scope here

Primary seams likely to touch:
- `src/app/console/stagedNavigation.ts`
  - keep selected-reference breadcrumbs honest while the reference session is active
  - preserve `Move`, `Rotate`, and `Scale` as selected-reference actions rather than inventing a new `Transform` parent branch for this pass
- `src/app/console/ConsoleDock.tsx`
  - dispatch `Move`, `Rotate`, and `Scale` through the existing viewer-owned reference transform session
  - keep the active Console path honest while the live transform session is active
  - route `CommitTransform` / `Enter` to the same commit seam and return to the owning selected-reference scope after commit
- `src/app/console/ConsoleBar.tsx`
  - render the active live transform path cleanly without fake empty choice brackets or read-only/status wording
- `src/app/store/useAppStore.ts`
  - add reference-local transform-history state keyed by `referenceId`
  - append history rows on commit and support lock/merge operations
- `src/app/components/ReferenceTransformToolbar.tsx`
  - treat the existing reference transform toolbar as the reusable viewer-side destination
  - add the collapsible transform-history section and row actions
- `src/app/components/ViewerHost.tsx` and/or `src/viewer/Viewer.ts`
  - add the missing reference-transform commit callback seam so viewport drag release can append committed history rows without moving history ownership into the viewer

Constraints:
- do not widen this phase into assembly, object, folder, or multi-select transform ownership
- do not redesign the selected-reference command grammar around a new parent `Transform` branch
- do not couple this phase to unrelated camera, zoom, or rendering changes
- do not append history rows during live drag preview
- do not move transform execution or live drag ownership out of the viewer

Implementation suggestion:
- start with references as the first real target-local transform-history surface
- keep the existing selected-reference command surface and tighten only the active-session behavior
- keep transform execution viewer-owned
- make active Console transform state behave like the real live session rather than a passive status mode
- append history entries only from explicit commit points
- once the reference flow is stable, reuse the same state and Console contract later for assemblies and authored objects without redesigning the data shape

Expected verification:
- selected reference item exposes `Move`, `Rotate`, `Scale`, `Zoom`, and `Back`
- `M >`, `R >`, and `S >` arm the live viewer command immediately
- while transform is active, Console shows the live transform path `<label> > M/R/S > Vec3 [...]` instead of the generic reference menu
- inside live `Move`, `Rotate`, and `Scale`, Console exposes `Vec3`, `X`, `Y`, `Z`, `XY`, `XZ`, and `YZ`
- choosing `X` clears the assisted vec3 autofill and gives typed input control
- clearing typed input back to empty restores the default assisted vec3 option
- viewport click commit appends one history row
- `CommitTransform` and `Enter` commit append one history row each when the draft changed
- after commit, the user returns to the normal selected-reference scope for that same target
- repeated committed transforms append repeated history rows instead of replacing the list
- `Transform History` section collapses and expands correctly
- `Lock/Unlock` works per row
- `Merge History` preserves locked rows and the last row while collapsing earlier unlocked rows
- existing reference zoom still works
- later object/assembly follow-ons can reuse the same target-local transform-history contract without inventing a second history model

### Assumptions

- Browser-6 remains the large structural cleanup phase.
- Browser-7 is the next smaller cleanup follow-on bucket rather than another major panel-architecture rewrite.
- Shared selection truth and Console routing remain canonical across Browser, viewport, and Console surfaces.
