# `ReferenceObjects-2`

## Doc Header

### Doc History
5. 2026-04-15 20:21: Marked `ReferenceObjects-2.2` complete after grouped imported-reference drag-state, grouped preview validity, and grouped post-drop selection stability landed in Browser, then tightened `ReferenceObjects-2.3` so it now reads as the direct next thin delivery pass over the already-working grouped drag path
4. 2026-04-15 17:12: Tightened `ReferenceObjects-2.3` into implementation-ready shape by locking the final grouped move delivery around thin batching into the shared move seam, explicit valid target scope, grouped post-drop selection preservation, and focused verification so the last Browser reorganization slice can land cleanly after `2.2`
3. 2026-04-15 17:06: Tightened `ReferenceObjects-2.2` into an implementation-ready grouped-drag stability slice now that `2.1` is complete and the separate Browser scroll-jump bug is no longer the main blocker, locking the next pass around grouped drag-session shape, grouped preview validity, and grouped post-drop selection/resync instead of broader Browser stabilization
2. 2026-04-15 16:58: Implemented `ReferenceObjects-2.1` as a completed research pass by grounding the grouped Browser drag read in the live single-row drag session, grouped-selection row state, shared imported-reference move authority, and current post-drop selection collapse behavior, then marking `2.1` complete and tightening the doc so `2.2` now reads as the next concrete implementation slice
1. 2026-04-15 14:10: Created `ReferenceObjects-2` as the dedicated Browser reorganization phase for grouped reference-object drag/drop, splitting it out from `ReferenceObjects-1` so Browser research and stability work can land before the actual multi-select reorganization delivery instead of overloading the first command-surface cleanup umbrella

## Doc Body

## Summary

Use `ReferenceObjects-2` as the Browser organization phase for reference objects.

This should be the second `ReferenceObjects` phase.

It exists because grouped reference-object drag/drop is bigger than one narrow parity slice:
- it needs Browser seam research
- it needs Browser stability work around grouped drag/drop truth
- and only then should it land the final multi-select reorganization behavior

The core user-facing goal for this phase is:
- let a user multi-select reference objects in Browser and drag that grouped set into a different authored assembly or component so they can organize reference objects directly in Browser

This phase covers:
- Browser research around grouped drag payloads, drop targeting, and move authority
- stability work so grouped Browser drag/drop behaves predictably before the final delivery lands
- multi-select grouped drag/drop for eligible reference-object rows
- resync of Browser, selection, and console/viewer context after grouped reorganization
- focused regressions around grouped drag preview, drop validity, and post-drop stability

This phase does not cover:
- broader Browser drag/drop redesign outside reference objects
- a new ownership model for reference objects
- freeform cross-family move semantics
- console command work
- transform or visibility redesign

Implementation-prep read:
- `ReferenceObjects-2` is the umbrella
- `ReferenceObjects-2.1` is now the completed Browser seam research cut
- `ReferenceObjects-2.2` is now the completed Browser drag/drop stability cut
- `ReferenceObjects-2.3` is now the direct implementation-ready final grouped reference-object reorganization delivery

## Current Seam Read

The important thing already exists:
- Browser multi-select for reference-object rows already works
- the shared owner-move seam already exists
- imported-reference reparenting already exists inside that move seam

The important thing that does not exist yet is safe grouped Browser exposure:
- Browser still needs research around how grouped dragged payloads should be represented
- Browser still needs stability work around grouped drag truth, grouped drop validity, and grouped post-drop resync
- the final grouped reference-object reorganization behavior should land only after that Browser groundwork is locked

Current strongest read:
- do not invent a second Browser-only reorganization backend
- do not skip straight to the final grouped move behavior
- use this phase to prove the Browser interaction and stability layers first, then expose the grouped reorganization delivery on top of the already-existing move authority

## [x] `ReferenceObjects-2.1` - `Browser Grouped Drag Research`

Purpose:
- map the real Browser seams needed for grouped reference-object drag/drop before implementation begins

Owns:
- identifying how Browser currently represents single-row drag state
- identifying how explicit Browser multi-select can become one grouped dragged payload
- identifying which authored assembly and component targets should count as valid first-pass drop destinations
- identifying the current selection, preview, and post-drop sync risks that need Browser stability work before the final delivery

Does not own:
- final grouped drag/drop behavior
- Browser-wide drag/drop redesign

Current seam read:
- `src/app/panels/BrowserPanel.tsx` and `src/app/panels/useBrowserPanelController.ts` are the most likely Browser seams for grouped drag payload exposure and drop handling
- `src/app/store/useAppStore.ts` already owns `moveProjectContentOwner(...)`, which is the strongest authority seam for imported-reference reparenting
- `src/app/store/useAppStore.ts` already resolves drop validity through the shared owner-drop resolution path, which should remain the truth source for grouped drops too

Acceptance read:
- the Browser grouped drag payload seam is explicitly identified
- the valid first-pass drop targets are explicitly identified
- the known stability risks are explicitly listed before implementation starts

Research result:
- grouped Browser selection already exists before drag through `workspaceResolvedContentSelection.groupedRowIds`, which is surfaced into Browser rows as `groupedSelectedBrowserRowIds`
- the current Browser drag session is still strictly single-row:
  - `createBrowserContentDragSession(...)` stores one `draggedRowId`
  - `BrowserContentDragSession` stores one `draggedTarget`
  - `handleBrowserRowPointerDragStartCandidate(...)` always starts drag from the one row under the pointer
- drag preview truth is also still strictly single-target:
  - `resolveBrowserContentDragPreviewState(...)` resolves one hovered row, one drop target, and one preview anchor/insert slot for one dragged target
- the shared move authority already exists for imported references:
  - `moveProjectContentOwner(...)` already supports `draggedRecord.kind === 'imported-reference'`
  - imported-reference reparenting already updates `referenceWorkspace.importedReferencesById`
  - imported-reference ordering already flows through `referenceWorkspace.contentOrderByParentKey`
- the current post-drop selection behavior is single-target:
  - `moveProjectContentOwner(...)` resets workspace selection to one dragged workspace target
  - that means grouped delivery will need an explicit grouped post-drop selection/readiness decision instead of inheriting the current single-item collapse behavior by accident

Locked first-pass drop-target read:
- the final grouped reference-object reorganization delivery should target authored assemblies and authored components first
- `ReferenceObjects-2` should not treat reference categories, references-root, or broader mixed container semantics as part of the first grouped delivery

Known risks now explicitly identified:
- grouped drag payload shape does not exist yet, so `2.2` must decide how grouped selected imported references are represented without breaking the existing single-row drag contract
- drag preview currently describes one dragged row, so `2.2` must define grouped preview truth without inventing a second move authority
- post-drop selection currently collapses to one dragged item, so `2.2` must define stable grouped post-drop selection and console/viewer resync behavior before `2.3` lands

Implementation handoff from `2.1`:
- `2.2` should stay Browser-local
- `2.2` should add grouped drag-state and grouped preview stability over the existing single-row drag path
- `2.3` should stay thin by batching into `moveProjectContentOwner(...)` rather than inventing a grouped reference-only backend

## [x] `ReferenceObjects-2.2` - `Browser Drag Stability`

Purpose:
- stabilize the Browser grouped drag/drop path so the final multi-select reorganization behavior can land on predictable interaction truth

Owns:
- grouped drag preview truth
- grouped drop-target validity handling
- grouped selection stability through drag and drop
- clean post-drop Browser, console, and viewer resync

Does not own:
- final broader Browser drag/drop redesign
- non-reference grouped move semantics

Locked direction:
- stability first, feature second
- keep grouped drag invalid when the whole selected set is not eligible
- keep Browser interaction truth aligned with the shared owner-drop authority

Acceptance read:
- grouped drag state remains stable through pointer movement
- invalid drops fail cleanly without partial reorganization
- successful drops leave Browser selection and nearby context in a predictable state

Implementation-prep read:
- `2.1` proved that the gap is not move authority, it is Browser drag-state exposure
- the first concrete `2.2` job is to represent one grouped imported-reference drag set on top of the current single-row drag controller
- the second concrete `2.2` job is to keep grouped preview and grouped post-drop selection stable enough that `2.3` can stay thin

Locked in-scope:
- grouped imported-reference drag eligibility in Browser
- grouped drag-session shape over the existing single-row drag controller
- grouped preview validity and grouped preview presentation stability
- grouped post-drop Browser selection and nearby console/viewer resync behavior

Locked out-of-scope:
- final grouped move batching itself
- broader Browser drag/drop redesign outside grouped reference objects
- authored-object grouped drag beyond reference objects
- reopening the already-fixed general Browser scroll-jump bug unless the grouped drag work specifically exposes a new regression

Locked grouped eligibility read:
- only start grouped drag when the active Browser grouped selection is a full imported-reference set
- mixed authored plus reference selections should stay single-row or non-grouped rather than partially grouping
- the clicked row should only start grouped drag when it belongs to the active eligible grouped selection

Locked preview read:
- `2.2` should still use the shared owner-drop resolution authority
- grouped preview should stay invalid when the whole selected set cannot validly land on the same target
- grouped preview should present one stable landing read rather than pretending to preview several independent item drops

Locked post-drop read:
- after a successful grouped drop, Browser should stay on the moved grouped set instead of collapsing to one dragged target
- console and viewer sync should follow that grouped Browser selection truth
- `2.2` can introduce the grouped post-drop selection contract even if `2.3` is the slice that finally batches the grouped move

Most likely `2.2` seams:
- `src/app/panels/useBrowserPanelController.ts`
  - grouped selected imported-reference eligibility
  - grouped drag-start exposure
  - grouped drag-state consumption for row presentation and post-drop resync
- `src/app/panels/browserContentDrag.ts`
  - grouped drag session shape
  - grouped preview anchor and validity handling
- `src/app/panels/BrowserPanel.test.tsx`
  - grouped drag and post-drop stability coverage
- `src/app/store/useAppStore.ts`
  - only if a tiny shared helper is needed for grouped move batching or grouped post-drop selection truth

Concrete expected implementation shape:
1. Add a grouped imported-reference drag eligibility helper in `useBrowserPanelController.ts`.
2. Extend Browser drag-session state so one drag can represent either:
   - a single existing dragged target
   - or one grouped imported-reference dragged set
3. Keep grouped preview validity delegated to the same shared owner-drop authority, but require the full grouped set to qualify.
4. Define grouped post-drop selection behavior so Browser does not accidentally collapse back to one dragged row after a successful grouped drop.
5. Keep the actual grouped move batching as thin as possible so `2.3` can focus on delivery rather than re-solving stability.

Ready-to-start verification:
- when the user multi-selects an eligible imported-reference set and starts drag from one selected row, Browser enters one grouped drag state
- when grouped drag hovers a valid authored assembly or component, preview stays stable
- when grouped drag hovers an invalid target, Browser does not preview a misleading partial drop
- after a successful grouped drop, Browser selection remains grouped on the moved set instead of collapsing to one target

Implementation result:
- Browser drag sessions can now represent one grouped imported-reference set instead of only one dragged row
- grouped drag only starts when the clicked row belongs to the active eligible imported-reference multi-select
- grouped preview now stays valid only when the whole selected set can land on the same authored assembly or component target
- grouped invalid hover now fails honestly on non-owner rows instead of pretending a partial grouped move is possible
- Browser drag presentation now keeps the full grouped dragged set visually active during drag
- grouped post-drop Browser selection now stays on the moved set and keeps console/viewer resync aligned with that grouped truth

Locked handoff into `2.3`:
- grouped drag-state no longer needs redesign
- grouped preview no longer needs redesign
- `2.3` should now stay focused on the final grouped move delivery and any remaining thin commit-path cleanup instead of reopening Browser drag exposure

## [ ] `ReferenceObjects-2.3` - `Multi-Select Browser Reorganization`

Purpose:
- let a user drag an eligible Browser multi-select of reference objects into a different authored assembly or component

Owns:
- grouped drag of eligible reference-object rows
- valid authored assembly/component drop targeting
- batched imported-reference reparenting through the shared move seam
- clean grouped post-drop resync

Does not own:
- broader authored-object grouped drag beyond reference objects
- freeform drop semantics outside the validated first-pass targets

Locked build shape:
- start from the already-working Browser multi-select behavior for reference-object rows
- let that selected set drag together when the full set is an eligible imported-reference group
- validate the grouped drop against the same shared owner-move rules already used for single imported-reference moves
- batch the reparent through the authoritative move seam so Browser ordering and reference parentage keep one truth
- keep ineligible mixed selections non-draggable or non-droppable instead of partially moving only part of the set

Current seam read:
- Browser multi-select already works for reference-object rows, so the next gap is grouped drag/drop organization rather than grouped selection itself
- `src/app/store/useAppStore.ts` already owns `moveProjectContentOwner(...)`, and the move path already contains imported-reference reparenting handling for `draggedRecord.kind === 'imported-reference'`
- `src/app/store/useAppStore.test.ts` already covers single imported-reference reparenting through the shared move seam, so the final Browser slice should batch over that same authority instead of inventing reference-only reorder logic
- `ReferenceObjects-2.1` also proved that the final delivery should not start by rewriting Browser selection or move resolution; it should start from grouped drag-state and grouped preview stability already proven in `2.2`

Acceptance read:
- when the user multi-selects eligible reference objects in Browser, they can drag that grouped set together
- when they drop that grouped set on a valid authored assembly or component, the selected reference objects are reorganized into that target
- invalid mixed selections or invalid drop targets do not partially move a subset of the selected references
- Browser row hierarchy, selection state, and console/viewer context resync cleanly after the grouped move

Implementation-prep read:
- `2.2` has now solved grouped drag-state, grouped preview validity, invalid grouped hover handling, and grouped post-drop selection stability
- `2.3` should now stay thin and mostly own the final grouped move delivery polish over the already-working grouped imported-reference drag path
- the final delivery should not reopen Browser drag contract design or move-resolution authority unless `2.2` exposes a concrete blocker

Locked in-scope:
- final grouped drop commit for eligible imported-reference Browser selections
- batching grouped imported-reference reparenting through the shared `moveProjectContentOwner(...)` seam
- preserving grouped Browser selection on the moved set after commit
- keeping Browser hierarchy and nearby console/viewer context coherent after the grouped move

Locked out-of-scope:
- broader authored-object grouped drag beyond reference objects
- new drop targets beyond authored assemblies and authored components
- Browser-wide drag/drop redesign
- reference-category, references-root, or mixed-container semantics beyond the first-pass valid target scope

Locked move-authority read:
- do not invent a second grouped Browser move backend
- batch into the same `moveProjectContentOwner(...)` seam already used for one imported reference
- keep drop validity delegated to the same shared owner-drop resolution rules already used for single imported-reference moves
- treat the current grouped imported-reference drop commit as the stable baseline and only thin or harden it where the final delivery still needs more explicit authority or ordering guarantees

Locked commit read:
- grouped commit should either move the whole eligible set or fail cleanly
- grouped commit should not partially move a subset of the selected references while pretending the grouped drop succeeded
- grouped commit ordering should stay predictable and preserve Browser hierarchy truth through `referenceWorkspace.contentOrderByParentKey`

Locked post-drop read:
- after a successful grouped drop, Browser should still resolve the moved set as one grouped selection
- console and viewer sync should follow that grouped selection rather than collapsing back to one moved object
- if the grouped commit fails, Browser should leave the pre-drop selection intact

Most likely `2.3` seams:
- `src/app/panels/useBrowserPanelController.ts`
  - grouped drop commit polish and grouped drag delivery cleanup
  - grouped selection preservation after commit
- `src/app/store/useAppStore.ts`
  - shared move batching helper or thin grouped commit helper only if the final delivery still needs more explicit authority
  - grouped selection preservation after batched move commit
- `src/app/store/useAppStore.test.ts`
  - grouped imported-reference move authority coverage if a thin shared helper becomes necessary
- `src/app/panels/BrowserPanel.test.tsx`
  - end-to-end grouped Browser reorganization coverage and final valid-target coverage

Concrete expected implementation shape:
1. Reuse the grouped drag-state and grouped preview truth already established in `2.2`.
2. Keep the grouped imported-reference commit path thin and explicit rather than reopening Browser drag-state design.
3. Harden or clarify grouped move commit behavior only where the final delivery still needs more explicit ordering or authority guarantees.
4. Preserve grouped Browser selection on the moved set after commit.
5. Keep invalid grouped drops or failed grouped commits from leaving Browser in a partial-success state.
6. Keep the delivery thin enough that future follow-ons can still reason about one authoritative move path.

Ready-to-start verification:
- when the user drags an eligible selected imported-reference set onto a valid authored assembly, the full set moves there
- when the user drags an eligible selected imported-reference set onto a valid authored component, the full set moves there
- when the drop target is invalid, no subset of the selected references moves
- after a successful grouped move, Browser selection remains grouped on the moved set
- Browser hierarchy and nearby console/viewer context resync cleanly after the grouped move
