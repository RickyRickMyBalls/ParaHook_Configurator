# `ReferenceObjects-1`

## Doc Header

### Doc History
18. 2026-04-15 20:57: Added `ReferenceObjects-1.3.4 - Multi-Select Unhide Parity` as the next visibility follow-on after the shipped `Hide` and `Unhide All` work, locking the remaining gap as selected grouped `Unhide` through the same shared reference visibility authority instead of leaving grouped restore stuck behind only the global recovery command
17. 2026-04-15 14:10: Moved the queued Browser grouped drag/drop organization work out of `ReferenceObjects-1.4` and into a new `ReferenceObjects-2` phase doc so the needed Browser research and stability work can live in their own phase instead of overloading the first command-surface cleanup umbrella
16. 2026-04-15 14:06: Added `ReferenceObjects-1.4 - Multi-Select Browser Reorganization` as the next queued follow-on after the visibility ladder, grounding it in the already-shipped shared owner-move seam so multi-selected reference objects can be dragged together into other authored assemblies or components in Browser without reopening the broader drag/drop contract
15. 2026-04-15 13:56: Checked off `ReferenceObjects-1.3.1 - Selected Hide Entry Parity` and `ReferenceObjects-1.3.2 - Root Hide Command Flow` after both visibility entry slices landed, and tightened the top implementation-read bullets so `ReferenceObjects-1.3.3 - Unhide All Recovery Command` now reads as the active next slice instead of leaving the newly-completed hide entries marked only as prepped
14. 2026-04-15 13:26: Tightened `ReferenceObjects-1.3.1`, `1.3.2`, and `1.3.3` into implementation-prep shape by adding locked build reads, concrete seam guidance, and ready-to-start checklists so the visibility-command ladder now reads as three immediate handoff slices instead of only conceptual follow-ons
13. 2026-04-15 13:18: Broke `ReferenceObjects-1.3` into a smaller visibility-command ladder so Codex can take it in cleaner implementation slices, reframing `Phase 3` as an umbrella with `3.1` selected-target hide entry, `3.2` root hide flow, and a new `3.3` recovery slice for `Unhide All` through `Alt+H` and a root console command
12. 2026-04-15 13:10: Checked off `ReferenceObjects-1.1 - Single-Select Delete Parity` and `ReferenceObjects-1.2 - Multi-Select Delete Parity` after implementation landed, and tightened the summary bullets so `ReferenceObjects-1.3 - Console Hide Command Parity` now reads as the next queued slice instead of leaving stale delete-phase handoff wording behind
11. 2026-04-15 13:34: Tightened `ReferenceObjects-1.2 - Multi-Select Delete Parity` into implementation-prep shape, adding a locked build read, concrete seam guidance, and a ready-to-start checklist so the next coding pass can treat grouped delete as an immediate handoff instead of only a high-level intent section
10. 2026-04-15 13:27: Expanded `ReferenceObjects-1.3 - Console Hide Command Parity` so the hide flow now explicitly supports both entry styles: start `Hide` from console root and then pick objects, or select single/multi reference objects first and then use `H` plus commit or `Shift+H` to enter the same hide command path from an already-primed selection
9. 2026-04-15 13:20: Reframed `ReferenceObjects-1.3 - Console Hide Command Parity` from a selected-object console action into a proper root-level `Hide` command flow, locking that `Hide` should be commit-able from console root, that `Shift+H` should enter the same command path, and that the command should drive the user into object selection before a final commit hides the chosen reference objects
8. 2026-04-15 13:12: Added `ReferenceObjects-1.3 - Console Hide Command Parity` as the next queued follow-on after grouped delete, separating visibility control from the delete ladder while locking that the next console-specific reference-object command gap should be an explicit `Hide` action instead of leaving visibility control implicit or Browser-only
7. 2026-04-15 13:06: Tightened `ReferenceObjects-1.2 - Multi-Select Delete Parity` so the next slice explicitly covers Browser right-click delete for deletable reference-object multi-selects alongside the already-planned console and keyboard paths, keeping the grouped delete surface aligned across all three entry points instead of leaving Browser context-menu parity implicit
6. 2026-04-15 12:25: Renamed `ReferenceObjects-1.1` to the cleaner `Single-Select Delete Parity` title and added `ReferenceObjects-1.2 - Multi-Select Delete Parity` as the next implementation-ready follow-on, locking that `Phase 1` should now read as a small delete-parity ladder instead of one unnamed catch-all delete bucket
5. 2026-04-15 12:45: Renamed `ReferenceObjects-1` from `Cleanup And Polish` to neutral `Phase 1` wording and tightened the doc for implementation handoff, keeping `ReferenceObjects-1.1 - Console And Keyboard Delete Sync` as the locked first delivery while making the rest of the phase read as ordered follow-on work instead of one broad polish bucket
4. 2026-04-15 12:31: Expanded `ReferenceObjects-1.1` so it now covers keyboard `Delete` for viewport-selected reference objects alongside console delete sync, grounding that addition in the shared workspace-selection object target path and the current `inputRouting.ts` behavior where `Delete` still routes only to sketch draw
3. 2026-04-15 12:24: Reframed `ReferenceObjects-1.1` into a `Console Delete Sync` slice after confirming Browser already exposes imported-reference remove actions, grounding the next gap in the console-selected reference-object session and the missing staged-navigation `Delete` choice rather than pretending Browser delete itself is still the open capability
2. 2026-04-15 12:15: Tightened `ReferenceObjects-1` so the first concrete slice is now `Delete Reference Object`, grounding that direction in the live Browser imported-reference remove path and reframing the rest of the phase as later cleanup/polish follow-on work after explicit delete is honest and available on reference-object rows
1. 2026-04-15 12:08: Created this first dedicated `ReferenceObjects` phase as a narrow Browser cleanup-and-polish pass so source and imported reference-object rows can be tightened without reopening the larger Browser hierarchy, owner-routing, and transform architecture ladders

## Doc Body

## Summary

Use `ReferenceObjects-1` as the first implementation-prep phase for Browser reference-object follow-on work.

This should be the first `ReferenceObjects` phase.

It exists to lock the first shippable reference-object improvements in implementation order, not to redefine their bigger structure or ownership model.

The first concrete slice inside this phase should be:
- expose delete properly in the console and on keyboard `Delete` when a reference object is selected

This phase covers:
- console and keyboard sync for reference-object delete as the first cut
- Browser-local cleanup for reference-object row presentation
- tightening how source versus imported reference objects communicate their status without feeling like a separate row species
- small action, overflow, and interaction cleanup where the current row treatment still feels rough
- focused regression coverage around the cleaned-up row surface

This phase does not cover:
- a new reference-object owner model
- Browser tree restructuring
- drag-and-drop contract rewrites
- deeper transform-backend convergence
- broader reference catalog or library redesign

Implementation-prep read:
- `ReferenceObjects-1` is the umbrella
- `ReferenceObjects-1.1` is complete
- `ReferenceObjects-1.2` is complete
- `ReferenceObjects-1.3` is the shipped visibility-command umbrella
- `ReferenceObjects-1.3.1` is complete
- `ReferenceObjects-1.3.2` is complete
- `ReferenceObjects-1.3.3` is complete
- `ReferenceObjects-1.3.4` is the next queued selected grouped `Unhide` follow-on
- later Browser organization work now moves to `ReferenceObjects-2`
- later `1.x` slices can hold row-surface cleanup after delete parity lands cleanly

## Current Seam Read

The broader Browser ladder already did the heavy structural work:
- `Browser-9.5` moved source/library reference objects onto the normal Browser `Object` row lane
- `Browser-9.7` kept reference-backed object rows on the same normal object lane as the rest of the converged Browser tree
- `Browser-10.x` and `Browser-11.x` handled the larger owner-routing and container-truth cleanup
- `Browser-12` cleaned up the nearby imported-object `Part` row surface

That leaves a narrower Browser-local gap:
- reference-object rows still carry extra reference-specific state, styling, and action behavior
- source and imported cases still need to stay distinguishable
- but the current presentation should feel more settled and less like old compatibility debt showing through the normal `Object` row shell
- Browser already contains a real imported-reference removal seam
- the current gap is that the console-selected reference-object session does not expose a matching delete choice, so Browser and Console are out of sync for the same selected target
- keyboard `Delete` currently routes through shared app input handling, but `inputRouting.ts` only hands that key to sketch draw, so a viewport-selected reference object still has no matching direct keyboard delete path

Current strongest read:
- reference-object rows should read as normal Browser `Object` rows first
- their reference-backed status should remain truthful but secondary
- the first pass should start by syncing console and keyboard delete entry to the already-existing Browser remove capability, then use later follow-ons in the same phase for cleanup and polish

## Implementation Prep

Locked first delivery:
- ship `ReferenceObjects-1.1 - Single-Select Delete Parity` before later row-presentation polish

Implementation shape:
- thread existing imported-reference delete eligibility into the selected reference-object console target
- expose `Delete` in the selected-reference staged navigation session
- route viewport keyboard `Delete` for the same selected reference-object target into the shared imported-reference removal seam
- keep Browser, Console, Viewer, and selection recovery on the same post-delete truth

Ready-to-start checklist:
- confirm the selected reference-object target shape carries the metadata needed to decide delete availability
- add the staged-navigation `Delete` choice and execute path
- add the keyboard route and top-level handoff for viewport-selected reference objects
- cover console, keyboard, store cleanup, and post-delete session recovery with focused regressions

## Locked Direction

- preserve one normal Browser `Object` row shell for reference-backed object rows
- use console plus keyboard exposure of the already-existing reference-object delete/remove capability as the first proving case for this subfamily
- keep source and imported reference-object rows visually truthful without inventing a fresh row family
- reduce unnecessary visual weight, mixed messaging, or affordance clutter where the current reference-object surface still feels rough
- keep the current owner-target, selection, and drag semantics unless a tiny Browser-local polish fix is needed to make the surface read more honestly
- prefer presentational cleanup and small interaction clarity improvements that can be proven with focused Browser regressions



## [x] `ReferenceObjects-1` - `Phase 1` - `Single-Select Delete Parity`

Purpose:
- expose delete consistently when the user selects a reference object, both through the console and by pressing keyboard `Delete` after selecting that object in the viewport

Owns:
- carrying delete eligibility for the selected reference-object target into the console context sync path
- exposing an explicit `Delete` choice in the selected-reference staged navigation session
- letting a viewport-selected deletable reference object route keyboard `Delete` into the same underlying remove behavior
- routing that console delete choice through the existing Browser/store imported-reference removal seam
- confirming selection, viewer, Browser, keyboard routing, and console recovery stay correct after deletion

Does not own:
- larger hierarchy changes
- transform redesign
- deeper source-versus-imported model convergence
- later presentation polish beyond what the delete surface needs to feel honest

Current seam read for this first slice:
- `src/app/panels/browserContextMenu.ts` already exposes `Remove` for imported reference-backed rows
- `src/app/panels/useBrowserPanelController.ts` already routes that action through `handleRemoveImportedReferenceRow(...)`
- `src/app/store/useAppStore.ts` already owns `removeImportedReference(referenceId)` and clears the reference record, visibility/load/runtime state, transform state, part rows, content ordering, and active transform session when needed
- `src/app/console/stagedNavigation.ts` currently gives content owner sessions a `Delete` path, but `buildReferenceSelectedChoices(...)` only exposes load-model or transform/zoom choices for reference selection
- `src/app/console/referenceTransformConsole.ts` currently builds the console workspace target for reference objects, but that target does not yet appear to carry delete eligibility into the selected-reference session
- `src/app/store/useAppStore.ts` already resolves viewport or Browser-selected reference objects back into the shared console workspace context as `kind: 'object'` targets with `referenceId`
- `src/app/inputRouting.ts` currently routes `Delete` only to sketch draw and ignores selected reference-object deletion entirely
- the first slice should sync console-selected and viewport-selected reference-object deletion to the already-existing Browser/store remove capability instead of inventing a separate delete backend

Acceptance read for this first slice:
- when a deletable reference object becomes the selected target, the console shows a clear `Delete` choice alongside the existing reference-object actions
- when a deletable reference object is selected in the viewport, pressing `Delete` removes it through the same underlying capability
- triggering that console choice removes the reference object cleanly through the same underlying Browser/store seam
- Browser selection, console staged context, viewer state, and any active reference transform session recover cleanly if the deleted row was active
- the first pass stays narrow and does not pretend every reference-backed row type now shares identical delete rules

## [x] `ReferenceObjects-1` - `Phase 2` - `Multi-Select Delete Parity`

Purpose:
- expose `Delete` honestly when the active target is a reference-object multi-select, so grouped reference-object deletion follows the same product rules across console, keyboard, and Browser right-click as the now-shipped single-select path

Implementation-prep read:
- ship `ReferenceObjects-1.2 - Multi-Select Delete Parity` as the direct follow-on to single-select delete
- keep the grouped delete path as a thin eligibility-and-batching layer over the already-shipped single-reference remove authority
- only expose grouped delete when the full active multi-select is an imported-reference-backed, fully deletable set
- keep console, keyboard, and Browser right-click on one shared grouped-delete truth instead of letting each entry point invent its own eligibility rule

Owns:
- deciding when a multi-select made of reference-backed objects is fully deletable versus mixed or ineligible
- exposing `Delete` in the multi-select console session only when that grouped target is truly deletable
- routing grouped viewport keyboard `Delete` through the same imported-reference removal seam used by single-select delete
- exposing the same grouped delete action in the Browser right-click menu when the clicked row belongs to that same deletable reference-object multi-select
- clearing grouped Browser, Console, and viewer selection state cleanly after the batch delete completes
- proving that mixed selection recovery stays honest if only some selected rows are reference-backed

Does not own:
- broader multi-select redesign
- new mixed-selection semantics outside delete
- bulk transform changes
- broader row-presentation cleanup beyond what grouped delete needs

Locked build shape:
- extend the console workspace multi-select target so it can carry grouped delete eligibility plus the exact imported reference ids to remove
- let the `multiSelectSelected` staged-navigation session expose `Delete` only when that grouped target is deletable
- route viewport keyboard `Delete` through the same selected-target truth used by the console instead of adding a second grouped-delete detector
- let Browser right-click on a row inside the active eligible multi-select expose grouped `Remove` or `Delete` for the full selected set
- batch through the existing imported-reference removal seam so post-delete cleanup keeps using the already-proven single-delete authority
- keep mixed selections non-destructive by withholding grouped delete unless every selected target qualifies

Current seam read for this next slice:
- `ReferenceObjects-1.1` now covers selected single reference-object delete through console plus keyboard
- `src/app/console/stagedNavigation.ts` already owns the `multiSelectSelected` session, but that session currently stays zoom-only
- `src/app/store/useAppStore.ts` already tracks explicit selected targets plus grouped content selection data, which is the likely seam for deciding grouped delete eligibility
- `src/app/panels/browserContextMenu.ts` already exposes single-row imported-reference `Remove`, but that menu still reads from the clicked row only and does not yet surface grouped delete for a deletable multi-select
- `src/app/panels/useBrowserPanelController.ts` already owns Browser row selection plus the imported-reference remove handoff, which is the likely seam for deciding whether a right-clicked selected row should expose grouped delete instead of only single-row remove
- the shared imported-reference remove path already exists, so the next cut should batch through that same authoritative seam instead of inventing a special multi-delete backend
- the real design risk is mixed selection truth, so this slice should only expose grouped delete when the active multi-select is genuinely all-deletable reference objects or another explicitly approved deletable set

Ready-to-start checklist:
- confirm the multi-select console target can report both `canDelete` and the grouped imported `referenceIds`
- add the staged-navigation `Delete` choice and execute path for the `multiSelectSelected` session
- reuse the same grouped-delete availability in top-level keyboard routing for viewport `Delete`
- thread grouped delete into the Browser right-click path without breaking single-row `Remove`
- cover all-deletable versus mixed multi-select truth in store, console, keyboard, and Browser regressions

Acceptance read for this next slice:
- when the active selection is a deletable reference-object multi-select, the console exposes `Delete`
- when the active selection is that same deletable reference-object multi-select in the viewport, pressing `Delete` removes the whole eligible set
- when the user right-clicks a row inside that same deletable reference-object multi-select in Browser, the menu exposes grouped `Delete` or `Remove` instead of pretending only the clicked row is in scope
- mixed selections that are not fully deletable do not pretend grouped delete is available
- Browser, Console, and viewer selection state clear or resync cleanly after the grouped delete
- the grouped delete path stays a thin batch wrapper around the same imported-reference removal authority already used by single-select delete

## [x] `ReferenceObjects-1` - `Phase 3` - `Console Visibility Command Parity`

Purpose:
- expose visibility control as a proper console command ladder so `Hide` and later recovery commands are as honest and discoverable in Console as delete now is

Implementation-prep read:
- split visibility command work into small entry-path slices instead of one broad staged-navigation change
- land selected-target hide entry before root hide flow
- keep `Unhide All` as its own recovery slice so shortcut and root-command behavior can stay explicit
- keep selected grouped `Unhide` as its own follow-on slice so restore-on-selection does not get hidden behind the global `Unhide All` recovery command
- route every visibility command through the shared reference visibility authority instead of inventing console-local hidden state

Owns:
- splitting `Hide` into selected-target and root-entry slices that can be implemented independently
- adding a separate recovery slice for `Unhide All`
- adding a separate selected grouped restore slice for multi-select `Unhide`
- routing hide and unhide commands through the existing authoritative visibility seam instead of inventing console-only state
- confirming Browser, Console, and viewer state stay in sync after each visibility command commits

Does not own:
- deeper visibility model redesign
- show-unhide catalog work
- broader solo/isolate semantics
- transform or delete behavior changes outside what hide parity directly needs

Current seam read for this next slice:
- Browser reference-object rows already communicate visibility state through the shared Browser/store model, so the next gap is command exposure rather than inventing a new visibility backend
- `src/app/console/stagedNavigation.ts` already owns both selected-target and root command flow, so it is the likely seam for breaking visibility commands into smaller staged slices
- `src/app/inputRouting.ts` already owns special-key handoff, which is the likely seam for making `Shift+H` and `Alt+H` enter the right visibility command path without colliding with plain text capture
- the existing console target-selection path already knows how to surface selected object and multi-select sessions, which is the likely seam for selected-target `Hide` entry before the broader root object-picking flow lands
- the remaining restore gap is no longer global recovery, it is selected grouped `Unhide` for hidden reference-object multi-selects
- the visibility authority should stay in the existing app/store reference-object visibility path so Console, Browser, and viewer keep one truth
- the main product risk is mixing command entry, object picking, and recovery into one hard-to-test change, so this phase should keep those as separate implementation slices over the same shared authority

## [x] `ReferenceObjects-1.3.1` - `Selected Hide Entry Parity`

Purpose:
- let a user who already has eligible single-select or multi-select reference objects selected enter `Hide` directly from that selected context

Implementation-prep read:
- ship `ReferenceObjects-1.3.1` before root `Hide` flow so the first visibility command pass reuses the selection machinery we already proved in delete
- keep selected-target `H` plus commit and `Shift+H` as two entry paths into one shared hide action
- reuse the already-active eligible selection instead of introducing a new picker in this first cut
- route the final hide through the shared reference visibility seam and keep console/session recovery minimal and honest

Owns:
- allowing `H` plus commit from a selected eligible reference-object target to enter `Hide`
- allowing `Shift+H` from that same selected target to enter the same hide path
- reusing the current eligible single-select or multi-select instead of forcing an extra object-pick step
- hiding the selected target set through the shared reference visibility seam

Does not own:
- root `Hide` command flow
- `Unhide All`
- broader visibility browsing or recovery UI

Locked build shape:
- extend the selected reference-object and multi-select console targets with hide eligibility using the same target-truth path already used for delete
- let staged navigation treat `H` plus commit from eligible selected scopes as a hide execute path instead of a new picker flow
- let `Shift+H` enter that same selected-target hide path through shared keyboard routing
- batch single-select and multi-select hide through the same reference visibility authority and then request console context resync
- keep ineligible or mixed selections honest by withholding hide entry instead of silently partially applying it

Current seam read:
- `src/app/store/useAppStore.ts` already owns reference visibility state plus per-reference visibility setters, which is the authoritative seam for selected-target hide
- `src/app/console/stagedNavigation.ts` already owns selected reference and multi-select sessions, which is the likely seam for `H` plus commit when a target is already selected
- `src/app/inputRouting.ts` already owns special key handoff, which is the likely seam for reserving `Shift+H` when selected-target hide is eligible
- `src/app/console/useConsoleInteraction.ts` already performs selected-target action execution for delete, which is the likely seam for running the actual hide operation and console recovery

Ready-to-start checklist:
- confirm selected reference and multi-select console targets can report hide eligibility cleanly
- add the selected-target staged command path for `H` plus commit
- add the shared `Shift+H` handoff for eligible selected targets
- route single and grouped hide through the shared visibility seam and request target-selection resync
- cover single-select, multi-select, and mixed-selection ineligibility with focused console and keyboard regressions

Acceptance read:
- when the user already has eligible reference objects selected, typing `H` and committing enters `Hide` from that selected context
- when the user already has that same eligible selection, pressing `Shift+H` enters the same hide path
- committing the command hides the current selected target set without making the user pick again
- Browser, Console, and viewer state stay synchronized after the hide commit

## [x] `ReferenceObjects-1.3.2` - `Root Hide Command Flow`

Purpose:
- let a user start `Hide` from console root and then choose the reference objects to hide

Implementation-prep read:
- ship `ReferenceObjects-1.3.2` after selected-target hide entry so root `Hide` can build on already-proven hide execution
- keep this slice focused on command entry plus object-pick flow instead of re-solving hide execution itself
- let root `Hide` hand off into a clear object-selection step and then commit through the same visibility authority already used by selected-target hide
- keep object picking explicit instead of trying to overfit root `Hide` into implicit selection reuse

Owns:
- making `Hide` a first-class root console command
- moving the user from root `Hide` entry into object selection
- committing that picked set through the shared reference visibility seam
- keeping post-hide console recovery honest when the hidden objects were active or selected

Does not own:
- selected-target `H` or `Shift+H` entry
- `Unhide All`
- broader visibility catalog work

Locked build shape:
- add `Hide` to the root staged-navigation command set as a first-class command
- route that root command into a reference-object selection flow rather than directly hiding anything
- let the selected object-pick result commit through the same reference visibility seam already used by selected-target hide
- keep root `Hide` scoped to reference objects only so the picker and commit rules stay narrow
- return console state cleanly after commit so the hidden targets do not leave the session stranded

Current seam read:
- `src/app/console/stagedNavigation.ts` already owns root command entry and follow-on scoped sessions, which is the likely seam for adding root `Hide`
- the existing console selection/session system already knows how to move from root command entry into narrower pick scopes, which is the likely seam for the object-pick step
- `src/app/console/useConsoleInteraction.ts` already executes staged commands against app-store seams, which is the likely place to keep root-hide commit behavior aligned with selected-target hide
- `src/app/store/useAppStore.ts` already owns reference visibility state, so root `Hide` should reuse that same authority rather than layering a separate console-owned hidden set

Ready-to-start checklist:
- add root `Hide` into the staged root command surface
- define the object-pick session and the eligible reference-object choice set
- route picked-object commit through the shared visibility seam
- confirm console recovery is clean when the hidden objects were active or selected
- cover root-entry, object-pick, commit, and post-hide recovery with focused regressions

Acceptance read:
- when the user commits `Hide` from console root, the console enters a hide-specific flow instead of requiring a preselected object first
- the next console step is object selection for the reference objects to hide
- when the user commits that picked set, the chosen reference objects are hidden through the shared visibility authority
- Browser row state, console staged context, selection state, and viewer visibility stay synchronized after the hide commit

## [x] `ReferenceObjects-1.3.3` - `Unhide All Recovery Command`

Purpose:
- give the user a fast recovery path that restores hidden reference objects without requiring manual per-object reveal

Implementation-prep read:
- keep `ReferenceObjects-1.3.3` as its own recovery slice so `Unhide All` can land without waiting on more advanced show/unhide browsing
- treat root `Unhide All` and `Alt+H` as two entry paths into one shared recovery action
- restore visibility through the same reference visibility authority used by hide, but keep the scope broad and explicit: all hidden reference objects
- make this a fast recovery command, not a selective visibility-management surface

Owns:
- adding an `Unhide All` console command from root
- letting `Alt+H` enter that same `Unhide All` recovery command path
- restoring hidden reference objects through the shared reference visibility authority
- confirming Browser, Console, and viewer state resync cleanly after the recovery action completes

Does not own:
- targeted single-object unhide flows
- broader visibility filters or history
- redesigning hide entry itself

Locked build shape:
- add `Unhide All` to the root staged-navigation command surface as a first-class recovery command
- let `Alt+H` enter that same recovery action path through shared keyboard routing
- resolve the hidden imported/source reference-object set from the authoritative visibility state and restore all of them through the shared visibility seam
- keep the action global to reference objects instead of trying to scope it to the current selection
- resync console, Browser, and viewer state after the restore completes

Current seam read:
- `src/app/store/useAppStore.ts` already owns per-reference visibility truth, which is the authoritative seam for finding hidden reference objects and restoring them
- `src/app/console/stagedNavigation.ts` already owns root commands, which is the likely seam for adding `Unhide All`
- `src/app/inputRouting.ts` already owns special-key handoff, which is the likely seam for reserving `Alt+H` for visibility recovery
- `src/app/console/useConsoleInteraction.ts` already performs staged command execution and context resync, which is the likely seam for the recovery action itself

Ready-to-start checklist:
- add `Unhide All` to the root command surface
- add the `Alt+H` handoff into the same recovery action
- resolve hidden reference objects from authoritative visibility state and restore them through the shared seam
- confirm the command is safe when nothing is hidden
- cover root command, `Alt+H`, no-op recovery, and post-recovery resync with focused regressions

Acceptance read:
- when the user commits `Unhide All` from console root, hidden reference objects are restored through the shared visibility seam
- when the user presses `Alt+H`, the app enters that same `Unhide All` recovery path
- the recovery action restores hidden reference objects without conflicting with selected-target `Hide` entry
- Browser row state, console staged context, and viewer visibility stay synchronized after the recovery action

## [ ] `ReferenceObjects-1.3.4` - `Multi-Select Unhide Parity`

Purpose:
- let a user who already has a hidden eligible reference-object multi-select selected restore that grouped set directly instead of falling back to the global `Unhide All` recovery path

Implementation-prep read:
- ship `ReferenceObjects-1.3.4` as a narrow follow-on after the shipped `Hide` and `Unhide All` slices
- keep this slice focused on selected grouped `Unhide`, not broader visibility browsing or selective restore catalogs
- reuse the same selected-target session and shared reference visibility authority already proven by grouped `Hide`
- keep the command surface honest by only exposing grouped `Unhide` when the entire active multi-select is restorable

Owns:
- adding grouped `Unhide` eligibility to the selected multi-select reference-object console target
- exposing `Unhide` in the `multiSelectSelected` staged-navigation session when that grouped target is fully hidden and restorable
- restoring the selected grouped reference-object set through the shared reference visibility authority
- keeping Browser, Console, and viewer selection/context synchronized after the grouped restore commits

Does not own:
- a new root `Unhide` picker flow
- replacing or redesigning `Unhide All`
- single-object restore redesign beyond what the grouped session needs
- broader visibility management UI

Locked build shape:
- extend the multi-select console target so it can report grouped `Unhide` eligibility plus the exact reference ids to restore
- expose `Unhide` beside the existing grouped visibility/delete choices only when the full selected set is restorable
- route grouped `Unhide` through the same per-reference visibility authority already used by hide and `Unhide All`
- keep mixed visible-plus-hidden selections honest by withholding grouped `Unhide` unless the whole selected set qualifies
- resync the selected multi-select console session after restore so the user lands back on an honest visible grouped state

Current seam read:
- `src/app/store/useAppStore.ts` already resolves grouped `canHide` plus grouped `referenceHideIds` for selected multi-select targets, which is the likely seam for adding grouped `Unhide` metadata beside the existing hide metadata
- `src/app/console/stagedNavigation.ts` already owns `multiSelectSelected`, which is the likely seam for adding grouped `Unhide` without reopening root command flow
- `src/app/console/useConsoleInteraction.ts` already owns grouped hide execution and global `Unhide All`, which is the likely seam for adding grouped restore execution over the same visibility authority
- the current product gap is specifically that hidden selected multi-selects can only use global `Unhide All`, even when the user has already selected the exact grouped set they want to restore

Ready-to-start checklist:
- add grouped `canUnhide` plus grouped `referenceUnhideIds` to the selected multi-select console target
- expose `Unhide` in the `multiSelectSelected` staged-navigation session when the active grouped selection is fully restorable
- route grouped `Unhide` through the shared visibility seam and request target-selection resync
- keep mixed visible-plus-hidden grouped selections ineligible instead of partially restoring only a subset
- cover grouped selected restore, ineligible mixed selection, and post-restore session recovery with focused regressions

Acceptance read:
- when the user has a hidden eligible reference-object multi-select selected, the console exposes `Unhide`
- when the user commits that grouped `Unhide` command, the selected grouped set is restored through the shared visibility authority
- mixed grouped selections that are not fully restorable do not pretend grouped `Unhide` is available
- Browser row state, console staged context, and viewer visibility stay synchronized after the grouped restore
