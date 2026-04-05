# Dashboard Phase Dashboard-7 - Dashboard Board Tools And Surface Polish Backlog

## Doc Header

### Doc History
1. 2026-04-04 19:08: Added the dedicated future doc `Dashboard_Phase Dashboard-12 - Lane Layout Tools And Smart Align.md` so the newly requested lane grid and smart-align layout-tool ideas can move forward in one focused planning home separate from the broader `Dashboard-7` backlog, and repointed this backlog so `Phase 12` now refers outward to that new doc instead of trying to hold the next layout-tool details inline
1. 2026-04-04 18:37: Added `Phase 12 - Dashboard Top Shell Cleanup` as the new post-attachment board-shell polish bucket so the remaining dashboard top-panel cleanup can move forward as its own explicit phase after the sticky-note attachment and sizing ladder, while leaving the older `Phase 11` placeholder in place until the direct-drag detach doc truth is cleaned up separately
1. 2026-04-04 12:30: Moved the post-`Phase 10` sticky-note attachment-hit and resizing follow-on into the new dedicated future doc `Dashboard_Phase Dashboard-7.10 - Sticky Attachment Bounds And Resizable Notes.md`, replacing the broader backlog's inline `Phase 10.1` through `Phase 10.4` detail with a pointer to that new planning home while keeping `Dashboard-7` as the umbrella board-tools backlog surface
1. 2026-04-04 12:30: Locked the post-`Phase 10` attachment and sizing follow-on order by splitting the old next-step blob into explicit `Phase 10.1` through `Phase 10.4` subphases for full-body parent attachment hit area, variable-bounds refactor, resizable sticky-note foundation, and resize-plus-attachment polish, while keeping the recommendation that note resizing should not land before the attachment-hit and bounds-contract cleanup
1. 2026-04-04 12:13: Closed `Phase 10 - Move Attached Note Subtrees` after widening the existing sticky-note drag seam so directly dragged parent notes now carry their full attached descendant subtree through live preview and final placement commit, adding one batched dashboard placement commit to preserve attachment links across cross-lane subtree movement, and covering parent-child follow, nested child-subtree follow, and cross-lane subtree carry through focused AppShell regressions while leaving direct-drag detach staged for `Phase 11`
1. 2026-04-04 12:03: Tightened `Phase 10 - Move Attached Note Subtrees` into an implementation-ready dashboard drag-widening slice by grounding it in the shipped Phase 9 drop-time attachment model plus the live drag-preview and pointer-finish seam in `DashboardSurface.tsx`, then locking the first cut to parent-led subtree movement with preserved relative offsets, lane-local movement, unchanged drop-time attachment rules for directly dragged children, and focused AppShell regressions before the later direct-drag detach phase
1. 2026-04-04 11:58: Closed `Phase 9 - Attach Notes On Drop By Title-Bar Overlap` after shipping the first live dashboard attachment pass through the existing sticky-note pointer-finish drop seam in `DashboardSurface.tsx`, persisting same-lane strongest-title-bar-overlap parent choice into the dashboard-owned `parentNoteId` model, clearing parents on ordinary non-overlap drops, and adding focused AppShell regressions for attach, strongest-overlap winner selection, and detached drop behavior while leaving subtree movement and detach-by-drag staged later
1. 2026-04-04 11:50: Tightened `Phase 9 - Attach Notes On Drop By Title-Bar Overlap` into an implementation-ready dashboard runtime slice by grounding it in the live sticky-note drag preview and drop commit seam inside `DashboardSurface.tsx`, the shipped sticky-note title-bar drag contract in `DashboardStickyNoteCard.tsx`, the newly landed dashboard-owned `parentNoteId` groundwork in the dashboard store and persistence seam, and the focused `AppShell.test.tsx` dashboard regressions, then locked the first cut to same-lane drop-time strongest title-bar overlap attachment only without widening yet into subtree movement, detachment, or new stack visuals
1. 2026-04-04 11:41: Closed `Phase 8 - Sticky Attachment Tree Contract` after landing the first dashboard-owned attachment-tree groundwork through an optional `parentNoteId` sticky-note relationship in the persisted board model, normalizing invalid or cross-lane parent links plus cycles inside the dashboard store and persistence seam, and adding focused dashboard store verification while leaving drop-time attach behavior staged for `Phase 9`
1. 2026-04-04 11:38: Tightened `Phase 8 - Sticky Attachment Tree Contract` into an implementation-ready dashboard contract-lock slice by grounding it in the shipped sticky-note drag seam inside `DashboardSurface.tsx`, the current sticky-note card chrome in `DashboardStickyNoteCard.tsx`, and the focused AppShell dashboard-regression seam, then locking the later attachment-tree questions around title-bar-only overlap, strongest-overlap parent selection, drop-only attachment creation, lane-local parent-child trees, subtree movement, child-subtree detachment on direct drag, unlimited children, preserved relative offsets, and cycle prevention
1. 2026-04-04 11:35: Reworked the earlier `Phase 8 - Sticky Title-Bar Attachment Stacks` placeholder into a multi-phase later ladder that now captures sticky-note attachment-tree semantics more honestly through separate phases for attachment contract locking, attachment-tree creation on drop, subtree drag movement, and child detachment by direct drag after the later clarified parent-with-multiple-children rules made the original one-phase note too small
1. 2026-04-04 11:30: Added `Phase 8 - Sticky Title-Bar Attachment Stacks` to capture the new board-organization idea where dropping one sticky note beneath another can create an attached stack based on title-bar overlap so later moves can carry the attached notes together, and staged it after the existing burger-menu, selection-aware action, and shell-polish work because it changes drag semantics more deeply than the current chrome passes
1. 2026-04-04 11:24: Closed `Phase 5 - Sticky Note Burger Menu Foundation` after the sticky-note chrome cleanup shipped through a new top-right burger menu in `DashboardStickyNoteCard.tsx`, moving `Open in Notepad` and visible color access into that overflow surface while keeping `Unpin` visible, preserving the existing title-bar right-click color path, and adding focused AppShell regressions without widening yet into selection-aware align menu actions
1. 2026-04-04 11:17: Tightened `Phase 5 - Sticky Note Burger Menu Foundation` into an implementation-ready dashboard slice by grounding it in the live sticky-note title-bar action row and title-bar right-click color-menu seam inside `DashboardStickyNoteCard.tsx`, the note-action wiring already threaded from `DashboardSurface.tsx`, and the focused `AppShell.test.tsx` dashboard regressions, then locking the first cut to one top-right overflow entry point that absorbs `Open in Notepad` plus color access without widening yet into selection-aware align menu actions
1. 2026-04-04 11:04: Closed `Phase 4 - Align Selected Notes` after the first board-local dashboard align pass shipped through temporary lane-header align controls, lane-local vertical and horizontal edge alignment on the current selected note set, focused AppShell regressions, and unchanged sticky-note content plus lane ownership while burger-menu exposure remains staged later
1. 2026-04-04 10:56: Tightened `Phase 4 - Align Selected Notes` into an implementation-ready dashboard slice by grounding it in the shipped board-local selection plus lane-local group-move seams inside `DashboardSurface.tsx`, the existing sticky-note selected-state affordance in `DashboardStickyNoteCard.tsx`, and the focused `AppShell.test.tsx` dashboard regressions, then locking the first cut to lane-local vertical and horizontal alignment actions without widening into burger-menu exposure or cross-lane multi-note behavior
1. 2026-04-04 10:47: Closed `Phase 3 - Group Move And Selection Polish` after the dashboard lane-local group-move pass shipped by widening the existing sticky-note drag seam to carry one selected note set while preserving relative note spacing, keeping single-note drag intact, and leaving align plus burger-menu work staged later
1. 2026-04-04 10:40: Tightened `Phase 3 - Group Move And Selection Polish` into an implementation-ready dashboard slice by grounding it in the newly shipped board-local selection seam inside `DashboardSurface.tsx`, the sticky-note card selection affordance in `DashboardStickyNoteCard.tsx`, and the focused AppShell dashboard-regression seam, then locking the first cut to lane-local selected-note group movement plus small selection-rule polish without widening into align or burger-menu work
1. 2026-04-04 10:37: Closed `Phase 2 - Multi-Note Selection Foundation` after the first board-local dashboard selection pass shipped with click-select, lane-local selection rectangle, clear-on-empty-board behavior, and selected-note visuals while leaving note placement persistence and later group-move or align work unchanged
1. 2026-04-04 10:28: Tightened `Phase 2 - Multi-Note Selection Foundation` into an implementation-ready dashboard slice by grounding it in the live sticky-note render, lane-board pointer, and focused AppShell dashboard-regression seams, then locking the first cut to board-local click selection plus box selection with explicit exclusions so later group-move and align phases have one trusted target model
1. 2026-04-04 09:20: Reworked the remaining `Dashboard-7` feature backlog into an explicit multi-phase ladder after shipped `Phase 1`, splitting the loose feature list into ordered board-selection, alignment, sticky-note menu, and shell-polish execution slices so later implementation can happen through narrower commands instead of one oversized polish bucket
1. 2026-04-04 09:14: Closed `Phase 1 - Zoom-Unlocked Fit All Notes In Lane` after the dashboard lane fit action shipped with split locked-versus-unlocked behavior where unlocked lanes now solve both zoom and pan from full note bounds while locked lanes keep the simpler current recovery path, and recorded the focused AppShell verification shape for the landed camera correction
1. 2026-04-04 09:07: Cleaned up the `Dashboard-7` planning surface by removing the redundant `Remaining Backlog` heading, collapsing extra blank spacing before `Phase 1`, and trimming the leftover phase-spec `Suggestion` tail so the doc reads as one cleaner backlog-plus-phase planning surface before implementation work begins
1. 2026-04-04 09:00: Tightened `Phase 1 - Zoom-Unlocked Fit All Notes In Lane` into an implementation-ready dashboard slice by locking the unlocked-lane fit behavior to true zoom-plus-pan fit-to-bounds, keeping the locked-lane behavior simple, and adding explicit execution order, checklist, and verification targets for the first `Dashboard-7` runtime pass
1. 2026-04-04 08:58: Added `Phase 1 - Zoom-Unlocked Fit All Notes In Lane` so this backlog now starts with a concrete first slice that fixes the unlocked lane-camera fit action by making the magnifying-glass control frame all notes in the lane vertically as well as horizontally instead of only recentering left-to-right
1. 2026-04-04 08:58: Created this future dashboard backlog doc to capture the next board-tool and surface-polish ideas after shipped `Dashboard-6`, preserving the requested feature list in one canonical planning surface under `Architecture/Dashboard/Future/`

### Purpose

Use this doc as the next dashboard backlog surface for board-tool and board-polish follow-ons that build on the shipped sticky-note, lane-camera, and dynamic-lane foundation.

This doc now holds an explicit phase ladder for the remaining board-tool and surface-polish follow-ons.

## Doc Body

### Summary

`Dashboard-7` is the next idea bucket after the current lane, camera, and resizing work.

The shared theme is:
- make the board easier to recover and manipulate at scale
- reduce sticky-note chrome clutter
- add first multi-note board actions
- tighten the top dashboard surface chrome

### Feature List

1. `Window selection and group move`
Suggestion:
- introduce one explicit multi-note selection model before adding any more multi-note actions so later alignment and burger-menu actions have a shared target contract

2. `Align vertically / horizontally`
Suggestion:
- make this a board action that works only on the current multi-note selection and keeps note content ownership unchanged

3. `Burger bar menu top right and move "Open in Notepad" into that menu`
Suggestion:
- use this to reduce sticky-note title-bar clutter now that cards already carry drag, inline edit, color, and future multi-select actions

4. `Add color picker options menu opener to burger menu`
Suggestion:
- treat the burger menu as the main sticky-note action overflow surface and move color entry there instead of keeping too many title-bar affordances

5. `Add align vertical / horizontal to burger menu and only enable it for multi-note selection`
Suggestion:
- keep these actions disabled or hidden unless the note is part of an active multi-note set so the menu stays honest about when alignment can run

6. `Clean up the "Dashboard" top panel area, make it cleaner and thinner, and add a horizontal bar to adjust all lane heights`
Suggestion:
- treat this as a board-shell polish slice after the selection and menu direction are clearer, because the top panel and global lane-height control will affect header density and the overall interaction balance

7. `Sticky title-bar attachment trees`
Suggestion:
- treat this as a board-organization behavior where title-bar overlap on drop creates a lane-local parent-child note tree, so later drag can carry attached descendants together without reusing the multi-select model directly

### Phase Breakdown

1. `Phase 1 - Zoom-Unlocked Fit All Notes In Lane`
Reason:
- already shipped and closes the immediate zoom-unlock recovery gap

2. `Phase 2 - Multi-Note Selection Foundation`
Reason:
- window selection and group move need one shared board-selection model before any other multi-note tools can behave honestly

3. `Phase 3 - Group Move And Selection Polish`
Reason:
- once selection exists, moving multiple notes together and cleaning up modifier behavior is a separate interaction slice from simply creating the selection state

4. `Phase 4 - Align Selected Notes`
Reason:
- vertical and horizontal alignment should ship only after multi-note selection is stable, and the alignment math plus action rules deserve their own focused pass

5. `Phase 5 - Sticky Note Burger Menu Foundation`
Reason:
- moving `Open in Notepad` and color options out of the title bar into one overflow menu is its own UI refactor and should land before selection-aware menu actions widen it further

6. `Phase 6 - Selection-Aware Burger Menu Actions`
Reason:
- align actions inside the burger menu depend on both the multi-note selection contract and the overflow-menu structure, so they should land after both of those surfaces exist

7. `Phase 7 - Dashboard Shell And Global Lane Height Polish`
Reason:
- cleaning up the top dashboard panel and introducing a global lane-height adjust bar should happen last because it changes shell density and board framing around all the earlier interaction work

8. `Phase 8 - Sticky Attachment Tree Contract`
Reason:
- the later attachment-tree behavior needs one explicit parent/child contract before runtime work starts

9. `Phase 9 - Attach Notes On Drop By Title-Bar Overlap`
Reason:
- creating the actual parent/child link on drop is the first runtime widening and should land before subtree movement or detach rules

10. `Phase 10 - Move Attached Note Subtrees`
Reason:
- once attachment links exist, later dragging a parent should move the full descendant subtree as its own focused drag-widening pass

11. `Dashboard-7.10 - Sticky Attachment Bounds And Resizable Notes`
Reason:
- the post-`Phase 10` attachment-hit and resizing follow-on is now large enough to live in its own dedicated future doc with explicit `Phase 10.1` through `Phase 10.4` subphases

12. `Phase 11 - Detach Children By Direct Drag`
Reason:
- direct child drag should break the old parent relationship cleanly, and that detach rule deserves its own narrow polish pass after subtree movement is trustworthy

13. `Phase 12 - Dashboard Top Shell Cleanup`
Reason:
- the remaining visible dashboard-shell cleanup is now primarily the top panel and surrounding board chrome, so it should move forward as its own explicit polish bucket after the sticky-note attachment and sizing ladder
 - the next lane-layout-tool follow-on now lives in the dedicated future doc `Dashboard_Phase Dashboard-12 - Lane Layout Tools And Smart Align.md`

### Notes

Good likely future breakdown:
- first stabilize zoom unlock behavior
- then add multi-note selection as the foundation
- then add group move after the selection model is trustworthy
- then add selection-dependent actions such as align
- then collapse extra sticky-note actions into a burger menu
- then add selection-aware menu actions on top of that overflow surface
- then do the broader dashboard shell cleanup and global lane-height control
- then add the later sticky-note attachment-tree behavior once the current drag and menu contracts are settled

Important future rule:
- keep note content in the shared notepad model
- keep board placement in the dashboard model
- keep new multi-note actions board-local unless a later phase proves they should become shared note semantics

## [x] Phase 1 - Zoom-Unlocked Fit All Notes In Lane

### Summary

#### Purpose:
- fix the current unlocked-zoom fit behavior so the magnifying-glass action actually frames all sticky notes in the lane, not just their left-to-right spread

#### Current shipped status:
- the lane camera still keeps the simpler current zoom-preserving fit behavior while zoom stays locked
- unlocked lanes now use the magnifying-glass action as a true fit-to-bounds camera move
- unlocked fit now solves both zoom and pan from the full padded lane note bounds against the current lane viewport
- focused dashboard regressions now cover the locked path plus tall and wide unlocked note clusters without changing sticky-note placement

#### Main work:
- detect when the lane is in unlocked zoom mode
- compute the full lane note bounding box
- choose the zoom level that fits both the width and height of that box inside the current lane viewport with padding
- recenter the lane camera around that fitted box
- keep note placement unchanged and update only the lane-local camera

#### Done shape:
- locked lanes keep the current simple pan-first fit behavior
- unlocked lanes use the magnifying-glass action to fit all notes in the lane horizontally and vertically
- the user can recover lost notes in a zoomed lane without manually hunting top and bottom

### Questions / Decisions

#### [x] Question 1 - Should the fit button change behavior only when zoom is unlocked?

##### Locked answer
- yes

##### Why
- locked mode is still the simple camera contract and does not need to widen unexpectedly
- unlocked mode is where the user has already opted into richer camera behavior, so true fit-to-bounds is a better match there

#### [x] Question 2 - Should the fit action change lane zoom, lane pan, or both when unlocked?

##### Locked answer
- both

##### Why
- true fit-to-bounds requires solving for zoom and center together
- changing only pan cannot honestly frame tall note clusters inside a shorter viewport

#### [x] Question 3 - Should the fit result clamp to the existing min and max lane zoom?

##### Locked answer
- yes

##### Why
- the current lane camera already has a bounded zoom contract
- fit should stay inside the same camera limits instead of inventing a hidden special zoom rule

#### [x] Question 4 - What should happen when the fitted note box is already fully visible?

##### Locked answer
- still normalize the camera to the computed fit target

##### Why
- this keeps the action deterministic
- it avoids subtle "sometimes no-op, sometimes zoom" ambiguity when the user is trying to recover note framing

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Locked first-cut direction:
- locked lanes keep the current pan-first fit behavior
- unlocked lanes switch the magnifying-glass action to true fit-to-bounds
- unlocked fit solves for both lane zoom and lane pan from the full note bounding box
- fit uses both viewport width and viewport height with padding
- fit clamps to the existing lane zoom minimum and maximum
- fit remains deterministic even when the notes are already mostly visible
- note placement remains unchanged and only the lane-local camera updates

Suggested first-cut execution:
1. Reuse the existing lane note-bounds helper path in `DashboardSurface.tsx`.
2. Add one fit helper that computes a zoom-to-bounds target for unlocked lanes using both viewport width and viewport height.
3. Keep the current pan-only fit path for locked lanes.
4. Add focused regressions for tall note clusters, wide note clusters, and unchanged note placement.

Explicit exclusions:
- do not widen this slice into freeform zoom UI redesign
- do not change wheel-zoom unlock semantics
- do not persist lane zoom or fit history
- do not introduce multi-note selection, alignment, or burger-menu work in this pass

Checklist:
- [x] Lock the fit behavior split between locked and unlocked lanes
- [x] Lock unlocked fit to solve both zoom and pan
- [x] Lock fit-to-bounds against both viewport width and viewport height
- [x] Lock fit to the existing zoom clamp range
- [x] Keep note placement unchanged
- [x] Keep the first slice scoped to `DashboardSurface.tsx` plus focused dashboard regressions

Verification:
- unlocked fit updates lane zoom and lane pan together
- the resulting camera frames the lane note bounds vertically and horizontally with padding
- locked fit keeps the simpler current behavior
- sticky-note placement persistence remains unchanged

Current shipped output:
- `Phase 1` shipped as the first `Dashboard-7` implementation slice
- the magnifying-glass button now becomes a true fit-to-bounds action only when the lane is zoom-unlocked
- unlocked fit now uses both zoom and pan so all notes in the lane are framed top-to-bottom and left-to-right
- locked fit stays on the simpler current recovery behavior
- the runtime owner seam was `DashboardSurface.tsx` and the focused verification seam was `AppShell.test.tsx`

## [x] Phase 2 - Multi-Note Selection Foundation

### Summary

#### Purpose:
- add the first real board-local multi-note selection model so the dashboard can support box selection, selected-note state, and later multi-note actions without inventing ad hoc note-group logic in each follow-on

#### Current shipped status:
- `DashboardSurface.tsx` now owns one board-local selected-note model alongside the existing drag, lane camera, fit, lane rename, and lane resize behavior
- sticky-note cards now render a selected visual state through `DashboardStickyNoteCard.tsx` without widening into shared note-model changes
- lane boards now expose one lane-local selection rectangle flow on empty-board left drag
- focused `AppShell.test.tsx` dashboard regressions now cover click selection, lane-local box selection, and clear-on-empty-board behavior

#### Main work:
- define one dashboard-local selected-note contract
- allow the user to clear selection, click-select one note, and window-select multiple notes
- render one explicit selection rectangle on the board while dragging the selection box
- make selected-note visuals clear without changing sticky-note content ownership
- keep note placement persistence unchanged while selection remains ephemeral board UI state

#### Done shape:
- users can click a note to select it
- users can drag a selection rectangle across a lane board to select multiple notes in that lane
- clicking empty board space clears selection
- sticky notes visibly show selected state
- no group movement, align actions, or menu changes ship in this phase

### Questions / Decisions

#### [x] Question 1 - Should selection state live in the dashboard store or stay local to the surface in the first cut?

##### Locked answer
- keep it local to `DashboardSurface.tsx`

##### Why
- this is still ephemeral board interaction state, not durable board data
- local ownership keeps the first cut smaller and avoids widening persistence or store APIs before the selection contract proves itself

#### [x] Question 2 - Should the first cut support click-select only, or both click selection and selection rectangle?

##### Locked answer
- both click selection and selection rectangle

##### Why
- window selection is the main user request driving this phase
- click selection is still required so later group move and align actions have a clean single-note and multi-note entry path

#### [x] Question 3 - Should the first cut allow cross-lane box selection?

##### Locked answer
- no, keep selection scoped to one lane board at a time

##### Why
- each lane already owns its own board surface, camera, and pointer math
- lane-local selection keeps the first pass understandable and avoids mixing multiple camera spaces before later phases prove cross-lane selection is worth the complexity

#### [x] Question 4 - What should clicking empty board space do in the first cut?

##### Locked answer
- clear the current selection

##### Why
- this matches common board and canvas behavior
- it gives users one obvious reset path before we widen into modifier keys or more advanced selection rules

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- keep selected note ids as local board state inside `DashboardSurface.tsx`
- add click-select for one note
- add lane-local selection rectangle on the lane board for multi-note selection
- treat selection as one lane-local board interaction state, not persisted dashboard data
- add clear selected visuals to sticky notes without disturbing inline title/body editing
- leave note placement, lane camera ownership, and note content ownership unchanged

Suggested first-cut execution:
1. Add one local `selectedNoteIds` state plus selection-rectangle state to `DashboardSurface.tsx`.
2. Lock the first-cut selection rules around click-select, empty-board clear, and lane-local box selection.
3. Thread selected state into `DashboardStickyNoteCard.tsx` for visual styling only.
4. Add focused dashboard regressions for click selection, box selection, and clear-on-empty-board.

Explicit exclusions:
- do not widen this phase into group move
- do not add align commands yet
- do not add burger-menu work
- do not persist selection across reload
- do not introduce cross-lane box selection in the first cut
- do not reopen sticky-note content editing semantics

Checklist:
- [x] Lock selection state to local dashboard surface ownership
- [x] Lock the first cut to click-select plus lane-local box selection
- [x] Lock empty-board click to clear selection
- [x] Lock the first cut away from group move, align, and burger-menu work
- [x] Keep note placement persistence unchanged
- [x] Keep the runtime seam focused on `DashboardSurface.tsx` plus dashboard regressions

Verification:
- clicking a sticky note marks it selected
- dragging a selection rectangle across a lane selects the notes inside that box
- clicking empty board space clears the current selection
- sticky-note placement persistence remains unchanged
- existing drag, camera, and inline note editing regressions still pass after the selection model lands

Current shipped output:
- `Phase 2` shipped as the first board-local multi-note selection pass
- the first selection pass now includes click selection plus lane-local box selection
- selection stays ephemeral inside `DashboardSurface.tsx`
- sticky-note placement, lane camera state, and note content ownership remain unchanged
- the runtime owner seams were `DashboardSurface.tsx` and `DashboardStickyNoteCard.tsx`, and the focused verification seam was `AppShell.test.tsx`

## [x] Phase 3 - Group Move And Selection Polish

### Summary

#### Purpose:
- let users move an active multi-note selection together once the board-selection model exists

#### Current shipped status:
- `DashboardSurface.tsx` now widens the existing sticky-note drag seam so one selected note set can move together while keeping the same board-local selection ownership from `Phase 2`
- sticky-note cards still provide the selected visual affordance through `DashboardStickyNoteCard.tsx`, and group movement builds on that surface without changing note content behavior
- lane-local group movement now preserves relative note spacing instead of collapsing the selected set into one anchor note path
- focused `AppShell.test.tsx` dashboard regressions now cover lane-local group movement while the existing single-note drag, camera, and selection tests continue to pass

#### Main work:
- allow dragging one selected note to move the whole selected set
- preserve relative note offsets during group movement
- decide and lock the first-cut rules for additive selection, deselection, and clicking empty board space

#### Done shape:
- dragging one selected sticky note moves the entire selected set inside the same lane
- selected notes preserve their relative spacing while moving
- single-note drag still works when only one note is selected
- the first-cut selection rules are clearer and no longer feel ambiguous while preparing for later align actions

### Questions / Decisions

#### [x] Question 1 - Should group move work only when all selected notes are in the same lane in the first cut?

##### Locked answer
- yes

##### Why
- `Phase 2` intentionally kept selection lane-local
- lane-local group move keeps the math inside one camera space and avoids cross-lane movement complexity before later phases prove that widening is necessary

#### [x] Question 2 - Should dragging one selected note move the whole selected set, or should group move require a special handle or modifier?

##### Locked answer
- dragging one selected note should move the whole selected set

##### Why
- this matches common board and canvas expectations
- it keeps the first multi-note movement pass lightweight and avoids adding new chrome just to unlock a behavior the selection model already implies

#### [x] Question 3 - Should the first cut add additive selection modifiers such as Shift-click or Ctrl-click?

##### Locked answer
- no, leave additive modifiers out of the first cut

##### Why
- `Phase 2` already shipped one simple trusted selection path through click select and box selection
- additive modifiers can widen quickly into platform-specific rules and are not required to unlock group move

#### [x] Question 4 - What should happen if a note is selected and the user clicks a different note?

##### Locked answer
- clicking a different note should replace the current selection with that note before drag begins

##### Why
- this keeps the first-cut selection rules simple and predictable
- it avoids accidental stale multi-selection when the user is clearly targeting one different note

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- keep selected-note state local to `DashboardSurface.tsx`
- widen the existing sticky-note drag path so it can carry one selected note set instead of only one active note
- preserve each selected note’s relative world-space offset while the drag target moves
- keep the first cut scoped to one lane-local selected set
- keep the current clear-on-empty-board rule from `Phase 2`
- do not widen this pass into align math, burger-menu work, or selection persistence

Suggested first-cut execution:
1. Extend the current drag state in `DashboardSurface.tsx` so it can track the selected note set plus per-note offsets for group movement.
2. Keep single-note drag behavior as the fallback when only one note is selected.
3. Commit all moved note placements together through the existing dashboard placement seam.
4. Add focused regressions for lane-local group movement, unchanged relative note spacing, and preserved single-note drag behavior.

Explicit exclusions:
- do not add align commands yet
- do not add burger-menu work
- do not add cross-lane multi-note movement in the first cut
- do not add persisted selection
- do not reopen inline note editing semantics
- do not widen into modifier-key selection rules unless the first runtime pass proves they are necessary

Checklist:
- [x] Lock the first cut to lane-local group movement
- [x] Lock drag-on-selected-note to move the whole selected set
- [x] Lock additive modifiers out of the first cut
- [x] Keep the runtime seam focused on the existing dashboard drag path
- [x] Keep note placement ownership in the dashboard store
- [x] Keep align and burger-menu work staged later

Verification:
- dragging one selected note moves the whole selected set
- relative spacing between selected notes stays stable during the move
- single-note drag still works when only one note is selected
- sticky-note placement persists correctly after group movement
- existing selection, camera, fit, and inline note editing regressions still pass after the drag widening

Current shipped output:
- `Phase 3` shipped as the first lane-local selected-note group-move pass
- dragging one selected note now moves the whole selected set inside the same lane
- the existing dashboard drag seam in `DashboardSurface.tsx` remains the owner path
- selection stays ephemeral and board-local
- the runtime owner seams were `DashboardSurface.tsx` and `DashboardStickyNoteCard.tsx`, and the focused verification seam was `AppShell.test.tsx`

## [x] Phase 4 - Align Selected Notes

### Summary

#### Purpose:
- add the first board-local layout actions for selected sticky notes so vertical and horizontal align commands can work from one trusted multi-note target set

#### Current shipped status:
- `DashboardSurface.tsx` now reuses the shipped board-local selection plus lane-local group-move seam to drive the first align pass without widening into store persistence or shared note-model changes
- temporary lane-header align buttons now expose one honest board-local action entry point while the later burger-menu cleanup stays staged in `Phase 5`
- the first align pass now supports both vertical and horizontal edge alignment on the current lane-local selected note set
- focused `AppShell.test.tsx` dashboard regressions now cover vertical align, horizontal align enablement rules, and unchanged lane ownership or unselected note placement

#### Main work:
- define one lane-local vertical align action for the active selected note set
- define one lane-local horizontal align action for the active selected note set
- keep alignment board-local and placement-only
- make sure alignment does not change note content, pin state, lane ownership, selection ownership, or camera state

#### Done shape:
- users can run one vertical align action on the current selected note set inside a lane
- users can run one horizontal align action on the current selected note set inside a lane
- align updates only sticky-note placement through the existing dashboard placement seam
- selection remains active after align so later follow-on actions can still operate on the same set

### Questions / Decisions

#### [x] Question 1 - Should the first cut allow alignment only when all selected notes live in the same lane?

##### Locked answer
- yes

##### Why
- `Phase 2` and `Phase 3` intentionally kept the trusted selection and group-move model lane-local
- keeping align lane-local means the math stays inside one camera and one placement space instead of widening into cross-lane redistribution rules

#### [x] Question 2 - Which note should act as the alignment anchor in the first cut?

##### Locked answer
- use the selected set's top-most note for vertical align and left-most note for horizontal align

##### Why
- this makes the result deterministic without introducing a new explicit anchor UI
- it preserves the intuitive "snap everything to the earliest edge" feel while keeping the first cut small

#### [x] Question 3 - Should the first cut distribute spacing, or only align to one shared x or y edge?

##### Locked answer
- only align to one shared edge

##### Why
- edge alignment is the minimum useful board action and is easier to reason about
- spacing and distribution are separate layout tools and would widen the first cut unnecessarily

#### [x] Question 4 - What should happen when fewer than two notes are selected?

##### Locked answer
- the align action should be unavailable

##### Why
- aligning one note does nothing meaningful
- keeping the action unavailable is clearer than silently no-oping when later menu exposure arrives

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Locked first-cut direction:
- keep the selected-note model local to `DashboardSurface.tsx`
- keep the first align pass lane-local and placement-only
- add one vertical align action and one horizontal align action that operate on the current selected note set
- compute one shared x target for vertical align and one shared y target for horizontal align from the locked edge-anchor rules
- commit aligned note placements through the existing dashboard placement seam
- keep the selected set active after align completes
- leave burger-menu exposure staged later, so this phase can ship with temporary board-local action entry points if needed

Suggested first-cut execution:
1. Reuse the shipped `selectedNoteIds` plus effective sticky-note layout seam in `DashboardSurface.tsx` to resolve one valid lane-local selected set.
2. Add small align helpers that derive the target edge and updated placements for the current selected notes.
3. Commit the aligned placements through the existing dashboard placement actions without changing note content or lane ownership.
4. Surface the align commands through the smallest honest temporary UI that keeps later burger-menu work free to replace it.
5. Add focused regressions for vertical align, horizontal align, unavailable align when fewer than two notes are selected, and unchanged lane ownership.

Explicit exclusions:
- do not widen this phase into burger-menu work
- do not add spacing or distribute actions
- do not add cross-lane alignment
- do not persist selection across reload
- do not change note content editing, color behavior, or camera behavior

Checklist:
- [x] Lock the first cut to lane-local alignment
- [x] Lock one deterministic edge-anchor rule for vertical and horizontal align
- [x] Lock the first cut away from spacing and distribute tools
- [x] Lock align to operate only when at least two notes are selected
- [x] Keep the runtime seam centered in `DashboardSurface.tsx`
- [x] Keep burger-menu exposure staged for later phases

Verification:
- vertical align updates the selected notes to one shared x edge while keeping the same lane ownership
- horizontal align updates the selected notes to one shared y edge while keeping the same lane ownership
- fewer-than-two-note selection states do not expose a misleading live align action
- selected-note state remains active after align
- existing selection, group-move, camera, and inline-note regressions still pass after the align helpers land

Current shipped output:
- `Phase 4` shipped as the first board-local layout-action pass on top of the selection and group-move foundation
- the first cut stayed lane-local and operates only on the current selected note set
- the first cut ships vertical and horizontal edge alignment only through temporary lane-header controls
- the runtime owner seam stayed in `DashboardSurface.tsx`, with sticky-note selected-state visuals still owned by `DashboardStickyNoteCard.tsx`
- the focused verification seam stayed in `AppShell.test.tsx`

## [x] Phase 5 - Sticky Note Burger Menu Foundation

### Summary

#### Purpose:
- reduce sticky-note title-bar clutter by moving note overflow actions into one top-right burger menu

#### Current shipped status:
- `DashboardStickyNoteCard.tsx` now owns a real top-right burger-menu entry point for sticky-note overflow actions while preserving the same note-action wiring from `DashboardSurface.tsx`
- `Open in Notepad` now lives inside the new burger menu instead of staying always visible in the title bar
- visible color access now also lives in the burger menu while the existing title-bar right-click color path still remains available in this first cleanup pass
- focused `AppShell.test.tsx` dashboard regressions now cover burger-menu `Open in Notepad`, burger-menu color access, and preserved sticky-note behavior across the same dashboard interaction surface

#### Main work:
- add one visible burger-menu entry point at the top-right of the sticky note title bar
- move `Open in Notepad` into that menu
- move color access into that menu or one menu-opened sub-surface
- preserve drag, inline edit, selection, align, and existing note behavior while shrinking title-bar chrome

#### Done shape:
- the sticky note title bar now shows one compact overflow trigger instead of keeping `Open in Notepad` always visible there
- the burger menu exposes `Open in Notepad`
- the burger menu exposes color access without requiring title-bar right click
- sticky-note drag, inline edit, unpin, selection, and align behavior all still work after the chrome cleanup

### Questions / Decisions

#### [x] Question 1 - Should the first cut replace the title-bar right-click color path, or keep both right click and burger-menu color entry?

##### Locked answer
- keep both in the first cut

##### Why
- the existing right-click color path already works and does not need to be broken just to land the new visible overflow surface
- keeping both paths makes the burger menu additive first, which lowers the refactor risk while the menu shell settles

#### [x] Question 2 - Should `Unpin` also move into the burger menu in the first cut?

##### Locked answer
- no, keep `Unpin` visible in the title bar for now

##### Why
- this phase is about reducing clutter, not hiding every note action at once
- keeping `Unpin` visible preserves one fast always-available board-management action while `Open in Notepad` and color move into overflow

#### [x] Question 3 - Should the first cut include align actions inside the burger menu?

##### Locked answer
- no

##### Why
- `Phase 6` already exists to make the burger menu selection-aware
- landing align exposure here would widen this slice beyond chrome cleanup and reopen the menu contract before it stabilises

#### [x] Question 4 - What should happen when the burger menu is opened on one note and the user interacts elsewhere?

##### Locked answer
- close the menu

##### Why
- this matches the current color-menu dismissal behavior
- it keeps the first menu pass simple and consistent with the rest of the dashboard interaction model

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- keep the burger-menu state local to `DashboardStickyNoteCard.tsx`
- add one visible burger trigger in the sticky-note title bar
- move `Open in Notepad` into that menu
- add one visible color entry inside that menu, either as inline swatches or a small menu-opened color sub-surface
- keep the current title-bar right-click color path working in the first cut
- keep `Unpin` visible in the title bar
- leave align actions and selection-aware menu rules staged for `Phase 6`

Suggested first-cut execution:
1. Refactor the current sticky-note title-bar action row in `DashboardStickyNoteCard.tsx` so one compact burger trigger becomes the main overflow entry point.
2. Move `Open in Notepad` into that overflow surface and preserve its current note-opening behavior.
3. Reuse the existing color-preset action seam so color can also be reached from the menu without changing note ownership.
4. Keep the title-bar drag area and visible `Unpin` action intact while shrinking the always-visible chrome.
5. Add focused regressions for burger-menu open/close behavior, `Open in Notepad` from the menu, color access from the menu, and preserved drag/selection behavior.

Explicit exclusions:
- do not add align actions to the burger menu yet
- do not remove the current right-click color path in this pass
- do not widen into multi-note selection rules
- do not change note content editing semantics
- do not move lane-header align controls into the menu yet

Checklist:
- [x] Lock the burger menu to local sticky-note card ownership
- [x] Lock `Open in Notepad` into the new overflow surface
- [x] Lock color access into the new overflow surface
- [x] Lock `Unpin` to stay visible in the title bar for now
- [x] Keep selection-aware align actions staged for `Phase 6`
- [x] Keep the runtime seam centered on `DashboardStickyNoteCard.tsx`

Verification:
- the sticky-note burger trigger opens and closes predictably
- `Open in Notepad` still works from the burger menu
- color can be changed from the burger menu without changing note ownership
- sticky-note drag from the title bar still works
- existing selection, group-move, align, and inline-note regressions still pass after the chrome refactor

Current shipped output:
- `Phase 5` shipped as the sticky-note chrome cleanup pass that introduces one top-right burger menu
- the first cut moved `Open in Notepad` and visible color access into that overflow surface
- the first cut kept `Unpin` visible in the title bar and kept the current title-bar right-click color path alive
- the runtime owner seam centered on `DashboardStickyNoteCard.tsx`, with note-action wiring still coming from `DashboardSurface.tsx`
- the focused verification seam stayed in `AppShell.test.tsx`

## [ ] Phase 6 - Selection-Aware Burger Menu Actions

### Summary

#### Purpose:
- expose multi-note actions through the new overflow menu once both the selection model and burger menu structure exist

#### Main work:
- add vertical and horizontal align actions to the burger menu
- only enable those actions when the current note participates in a valid multi-note selection
- keep the menu honest about unavailable actions through disabled state or hidden state

#### Suggested scope:
- build directly on shipped `Phase 4` align behavior and `Phase 5` menu structure
- keep this slice focused on action exposure and selection-aware enablement rules

## [ ] Phase 7 - Dashboard Shell And Global Lane Height Polish

### Summary

#### Purpose:
- clean up the top dashboard shell and add one global lane-height control after the board interaction model beneath it has stabilised

#### Main work:
- make the top dashboard panel cleaner and thinner
- refine overall board chrome density
- add one horizontal adjust bar that changes lane heights globally

#### Suggested scope:
- leave this until the end because it changes the board frame around all earlier interaction work
- treat it as the shell-polish capstone for the `Dashboard-7` ladder

## [x] Phase 8 - Sticky Attachment Tree Contract

### Summary

#### Purpose:
- lock the later sticky-note attachment-tree model before runtime work widens the current drag and placement behavior

#### Current shipped status:
- the dashboard-owned sticky-note layout model now allows one optional durable `parentNoteId` relationship per note without widening into live attach-on-drop behavior yet
- dashboard persistence now normalizes attachment links so missing parents, self-links, cross-lane links, and cycle-forming links collapse back to detached notes instead of surviving as invalid board data
- the dashboard store now keeps those same attachment invariants when lane moves, note reconciliation, or note removal would otherwise leave broken tree links behind
- focused dashboard store verification now covers attachment round-trip persistence, invalid-link detachment after lane changes or note removal, and cycle prevention while the later drag runtime passes remain staged

#### Current read:
- `DashboardSurface.tsx` already owns the live sticky-note drag seam, lane-local placement persistence, selection model, group movement, and align actions, so later attachment-tree work should widen that same board interaction seam instead of inventing a second movement model
- `DashboardStickyNoteCard.tsx` already cleanly separates title-bar drag intent from title/body editing and menu actions, which makes title-bar-based attachment rules a natural later extension of the current drag contract
- the dashboard-owned sticky-note layout model now carries one optional durable `parentNoteId` relationship, so the remaining attachment runtime work can build on that shipped groundwork instead of inventing the relationship shape during drag implementation
- focused `AppShell.test.tsx` dashboard regressions already cover note drag, multi-note movement, align behavior, menu actions, and camera behavior, which makes that file the right verification seam for the later attachment-tree runtime passes

#### Main work:
- define one lane-local parent/child attachment model for sticky notes
- lock the rule that a dropped note attaches to the note whose title bar it overlaps most strongly, making the already-placed note the parent and the dragged note the child
- lock the rule that one parent can have multiple children and each child can also have its own children
- lock the rule that moving a parent later should carry its full descendant subtree
- lock the rule that directly moving a child later detaches that child subtree from the old parent

#### Done shape:
- the team has one explicit sticky-note attachment-tree contract before runtime work starts
- the later runtime phases know how parent selection, subtree movement, child detachment, and cycle prevention should behave
- the attachment-tree model stays clearly separate from the existing temporary multi-select model

### Questions / Decisions

#### [x] Question 1 - Should attachment be based on title-bar overlap only, or any note-body overlap?

##### Locked answer
- title-bar overlap only

##### Why
- the title bar is the clearest physical attach seam
- body overlap would make accidental attachment too easy during normal board organization

#### [x] Question 2 - When a dropped note overlaps multiple possible parent title bars, which parent should win?

##### Locked answer
- the note with the largest title-bar overlap area wins

##### Why
- this keeps parent choice deterministic
- it avoids needing a first-pass explicit parent picker UI

#### [x] Question 3 - Should attachment happen only on drop, or while hovering during drag too?

##### Locked answer
- only on drop

##### Why
- hover-driven attachment would make the drag path noisy and harder to trust
- attachment is a structural change and should happen only at the final drop decision point

#### [x] Question 4 - When a child detaches by direct drag, should its descendants come with it?

##### Locked answer
- yes

##### Why
- the child and its descendants already form one subtree
- direct child drag should pull out the whole subtree, not orphan its descendants unexpectedly

#### [x] Question 5 - Can a parent have unlimited direct children in the first cut?

##### Locked answer
- yes

##### Why
- the target behavior already assumes siblings can accumulate under one parent
- adding arbitrary child-count limits would complicate the model without adding clarity

#### [x] Question 6 - Should attached children keep their exact dropped offset relative to the parent, or snap into a cleaner stacked layout?

##### Locked answer
- keep exact relative offset in the first cut

##### Why
- this preserves the user-authored board layout
- forced snapping would widen the first attachment pass into a layout engine instead of a relationship system

#### [x] Question 7 - If a parent later moves across lanes, should its whole attached subtree move with it too?

##### Locked answer
- yes

##### Why
- the subtree is attached to the parent, not to the original lane independently
- moving the parent should carry the full tree consistently wherever later drag rules allow the parent to go

#### [x] Question 8 - Should attachment trees combine with the current temporary selection/group-move model in the first cut?

##### Locked answer
- no, keep them separate at first

##### Why
- selection is temporary board interaction state while attachment is a durable board relationship
- combining them immediately would make later runtime debugging much harder

#### [x] Question 9 - How should parent/child ownership work in the first cut?

##### Locked answer
- one note may have one parent, one parent may have multiple children, and cycles are never allowed

##### Why
- this matches the clarified target tree behavior
- preventing cycles keeps subtree resolution and later movement understandable

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- keep attachment trees lane-local in the first runtime pass
- use title-bar overlap on drop as the only attach trigger
- make the already-placed overlapped note the parent and the dragged note the child
- choose the parent by strongest title-bar overlap area when multiple candidates exist
- keep parent/child relationships in the dashboard-owned board model, not the shared note model
- allow one parent to have multiple children and children to have their own children
- keep attachment trees separate from temporary selection and group-move state
- prevent cycles and allow only one parent per note

Suggested first-cut execution:
1. Audit the current dashboard drag and placement seam in `DashboardSurface.tsx` and list the exact drop-time data already available for later overlap detection.
2. Lock the durable relationship shape that later runtime phases will persist in the dashboard-owned model.
3. Lock the parent-choice, subtree-movement, and detach semantics before any runtime phase starts.
4. Mirror those locked answers into the later `Phase 9-11` slices so the runtime work does not reopen the same structural questions.

Explicit exclusions:
- do not implement attachment runtime behavior in this phase
- do not widen attachment into body-overlap rules
- do not combine attachment trees with multi-select in this phase
- do not add visual stack affordances yet
- do not add explicit attach/detach buttons in the first contract pass

Checklist:
- [x] Lock attachment to title-bar overlap only
- [x] Lock strongest-overlap parent selection
- [x] Lock attachment creation to drop only
- [x] Lock the later model to one-parent/many-children lane-local trees
- [x] Lock subtree movement and child-subtree detachment semantics
- [x] Lock relative-offset preservation and cycle prevention
- [x] Keep attachment ownership in the dashboard board model

Verification:
- the attachment-tree contract clearly states how parent choice works
- the attachment-tree contract clearly states how subtree movement works
- the attachment-tree contract clearly states how child detachment works
- the later runtime phases can proceed without reopening structural questions about trees versus temporary selection

Current locked output:
- `Phase 8` is now the contract-lock pass for sticky-note attachment trees
- the later runtime model is now explicitly one-parent/many-children, lane-local, title-bar-overlap attachment
- attachment is created only on drop, parent choice is by strongest title-bar overlap, and cycles are disallowed
- later parent drag moves the full descendant subtree, and later direct child drag detaches that child subtree from the old parent
- the runtime owner seams should stay centered on `DashboardSurface.tsx` plus the dashboard board model, with focused verification continuing through `AppShell.test.tsx`

Current shipped output:
- `Phase 8` shipped as the dashboard-model groundwork pass for later sticky-note attachment trees
- the durable board model now supports one optional `parentNoteId` per sticky note while keeping attachment ownership out of the shared note model
- the dashboard persistence and store seams now automatically clear invalid attachment links when parent notes disappear, when notes end up in different lanes, or when a cycle would form
- drop-time title-bar-overlap attachment creation, subtree drag movement, and child detachment still remain intentionally staged for `Phase 9` through `Phase 11`

## [x] Phase 9 - Attach Notes On Drop By Title-Bar Overlap

### Summary

#### Purpose:
- create the first runtime attachment relationship by detecting title-bar overlap when a dragged note is dropped onto another sticky note in the same lane

#### Current shipped status:
- `DashboardSurface.tsx` now extends the existing pointer-finish drop seam so the directly dragged sticky note resolves one same-lane title-bar-overlap parent after final placement commit and writes that relationship through the dashboard-owned `parentNoteId` model
- same-lane title-bar overlap now creates one attachment on drop only, with the strongest overlap area winning deterministically when multiple candidates qualify
- ordinary drops with no qualifying same-lane title-bar overlap now explicitly clear any old parent relationship from the directly dragged note
- focused `AppShell.test.tsx` dashboard regressions now cover same-lane attachment creation, strongest-overlap winner selection, and detached no-overlap drops while the later subtree-movement and detach-by-drag phases remain staged

#### Current read:
- `DashboardSurface.tsx` already computes one live drag preview on every pointer move, tracks the dragged note ids plus active lane in `dragStateRef`, and commits the final drop through the existing pointer-finish seam that currently only calls `setStickyNotePlacement(...)`
- `DashboardStickyNoteCard.tsx` already gives the runtime one clean title-bar drag affordance through `.DashboardStickyNoteTitleBar`, which matches the Phase 8 rule that only title-bar overlap can create attachment
- the dashboard store and persistence seam now already own one optional durable `parentNoteId` relationship per sticky note, so `Phase 9` can stay focused on choosing and writing the parent on drop instead of also defining the model
- the focused dashboard regression seam in `AppShell.test.tsx` already covers same-lane drag, cross-lane drag, camera-offset drag, and zoom-offset drag, so the first attachment tests should extend that existing board interaction suite instead of creating a second test harness

#### Main work:
- detect whether the dragged note title bar overlaps another sticky note title bar strongly enough on drop
- choose the already-placed overlapped note as the parent
- attach the dragged note as a child of that parent
- keep existing note content, lane ownership, and board placement persistence understandable while the new relationship lands

#### Done shape:
- dropping one sticky note so its title bar overlaps another sticky note title bar in the same lane now persists one parent/child relationship through the dashboard-owned `parentNoteId` model
- when multiple same-lane title bars overlap at drop, the strongest overlap area wins deterministically
- ordinary drops with no qualifying same-lane title-bar overlap keep the note detached
- this phase still does not move descendants with the parent yet and still does not detach child subtrees by direct drag

### Questions / Decisions

#### [x] Question 1 - Should the first runtime cut attach only the directly dragged note, or also attach any temporarily selected group moving with it?

##### Locked answer
- attach only the directly dragged note

##### Why
- the Phase 8 contract already keeps temporary multi-select separate from durable attachment trees
- attaching an entire selected set would blur two different interaction models before subtree movement even exists

#### [x] Question 2 - Should same-lane title-bar overlap be enough for the first cut, or can cross-lane overlap create attachment too?

##### Locked answer
- same-lane title-bar overlap only

##### Why
- the Phase 8 contract already keeps the first attachment runtime pass lane-local
- cross-lane attachment would blur board-organization semantics before subtree movement rules are proven

#### [x] Question 3 - What should happen when the dragged note drops with no qualifying title-bar overlap?

##### Locked answer
- keep the note detached

##### Why
- attachment should remain an explicit structural result, not a sticky default
- preserving detachment on ordinary drops keeps the first runtime cut honest and predictable

#### [x] Question 4 - Should dropping a note onto one of its own descendants be allowed to reparent in the first cut?

##### Locked answer
- no, reject that reparent and keep the dragged note detached instead

##### Why
- the Phase 8 contract already forbids cycles
- keeping the failure mode as a simple detached drop is smaller and clearer than inventing cycle-resolution UI in this phase

#### [x] Question 5 - If the dragged note already has a parent, should a new valid overlap on drop replace the old parent in this first cut?

##### Locked answer
- yes

##### Why
- the durable model already allows only one parent per note
- replacing the old parent on a new valid drop is the cleanest first attachment-edit path before explicit detach controls exist

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- keep the first runtime pass lane-local
- use title-bar overlap on drop as the only attach trigger
- attach only the directly dragged note, not the wider temporary selection set
- choose the parent by strongest same-lane title-bar overlap area among already-placed notes
- write the resulting relationship through the dashboard-owned `parentNoteId` model
- keep ordinary non-overlap drops detached
- allow a new valid parent drop to replace an old parent
- reject cycle-forming parent choices and leave the note detached in that case

Suggested first-cut execution:
1. Reuse the current drag-preview and pointer-finish seam in `DashboardSurface.tsx` so drop-time attachment happens exactly where final lane and placement are already committed.
2. Add one helper that derives the dragged note title-bar bounds from the final preview layout and compares them against same-lane candidate title bars from the effective dashboard layouts.
3. Ignore the dragged note itself plus any candidates outside the active drop lane, then choose the valid parent candidate by greatest title-bar overlap area.
4. After final placement commit, write the chosen parent through `setStickyNoteAttachmentParent(...)`, or clear the parent when no valid overlap exists.
5. Add focused AppShell regressions for same-lane attachment creation, strongest-overlap winner selection, cross-lane non-attachment, and no-overlap detached drops.

Explicit exclusions:
- do not move attached descendants during parent drag yet
- do not detach child subtrees on direct drag yet
- do not combine attachment creation with the temporary selection/group-move model
- do not add stack visuals, connector lines, or attach-preview chrome yet
- do not widen attachment beyond title-bar overlap
- do not add explicit attach or detach buttons in this phase

Checklist:
- [x] Lock attachment creation to the pointer-finish drop seam
- [x] Lock candidate parents to same-lane title-bar overlap only
- [x] Lock strongest-overlap winner selection
- [x] Lock the first runtime cut to the directly dragged note only
- [x] Lock no-overlap drops to detached results
- [x] Keep subtree movement and detach-by-drag staged for later phases

Verification:
- dropping a note onto one same-lane title bar creates the expected `parentNoteId` relationship
- when multiple same-lane title bars overlap, the strongest overlap wins deterministically
- cross-lane drops still persist lane and placement without creating attachment
- no-overlap drops leave the note detached
- existing drag, camera, selection, and menu regressions still pass after attachment creation lands

Current locked output:
- `Phase 9` is now the first attachment runtime slice on top of the shipped `parentNoteId` groundwork
- the first cut is locked to same-lane drop-time title-bar overlap only
- the parent winner is locked to strongest overlap area among already-placed notes
- the first cut attaches only the directly dragged note, keeps no-overlap drops detached, and leaves subtree movement plus direct-drag detach for later phases

Current shipped output:
- `Phase 9` shipped as the first live attachment runtime pass on top of the earlier `parentNoteId` groundwork
- dropping one sticky note onto another same-lane title bar now persists a parent/child relationship through the dashboard-owned board model
- when multiple same-lane title bars overlap, the strongest overlap area wins deterministically
- ordinary no-overlap drops now keep the directly dragged note detached, while subtree movement and child detachment still remain intentionally staged for `Phase 10` and `Phase 11`

## [x] Phase 10 - Move Attached Note Subtrees

### Summary

#### Purpose:
- widen sticky-note drag so moving one parent note later carries all of its attached descendants with preserved relative offsets

#### Current read:
- `DashboardSurface.tsx` already resolves one drag movement set through `dragStateRef.originLayoutsByNoteId`, computes a live `dragPreview`, and commits final placement through `setStickyNotePlacement(...)`, so subtree movement can widen the existing movement-set builder instead of inventing a second drag runtime
- the shipped `parentNoteId` model plus dashboard-store normalization already define one valid lane-local tree per sticky note, so `Phase 10` can derive descendants from persisted relationships without redefining attachment ownership
- the currently shipped `Phase 9` behavior already attaches only the directly dragged note on drop, which means dragging a child note today still behaves like a normal direct drag and should stay that way until `Phase 11` explicitly adds detach-by-direct-drag
- the focused dashboard regression seam in `AppShell.test.tsx` already covers selected-set group movement, camera-offset drag, zoom-offset drag, and same-lane attachment creation, so subtree movement should extend those interaction tests instead of creating a separate harness

#### Main work:
- detect when the dragged note has attached children
- resolve the full descendant subtree under that dragged note
- move the full subtree together while preserving each note’s relative spacing
- keep lane-local placement and subtree ownership understandable during parent movement

#### Done shape:
- directly dragging a parent sticky note now carries every attached descendant in its subtree as one movement set
- descendants preserve their relative offsets to the dragged parent and to one another through live drag preview and final placement commit
- subtree movement remains lane-local in the first cut, so dragging the parent into another lane carries the whole subtree into that lane together
- directly dragging a child note still behaves exactly as it does today until `Phase 11` adds detach-by-direct-drag

### Questions / Decisions

#### [x] Question 1 - Should the first subtree-movement cut carry only direct children, or the full descendant tree?

##### Locked answer
- carry the full descendant tree

##### Why
- a partial carry would break the already-shipped tree model into inconsistent movement semantics
- once a parent move is trusted, the honest mental model is that the full attached structure follows

#### [x] Question 2 - Should subtree movement apply only when the directly dragged note is the tree root, or whenever that note has descendants even if it also has a parent?

##### Locked answer
- whenever the directly dragged note has descendants

##### Why
- the dashboard-owned model already allows nested parent-child chains, not just one top-level stack
- `Phase 11` will later decide what happens when a child with descendants is dragged directly, but this phase should still keep subtree motion consistent for any dragged parent node that currently owns descendants

#### [x] Question 3 - Should subtree movement stay lane-local in the first cut, including cross-lane parent drags?

##### Locked answer
- yes

##### Why
- the existing drag seam already supports cross-lane movement for the directly dragged note
- carrying the whole subtree into the resolved active lane keeps attachment ownership honest without widening into cross-lane split behavior

#### [x] Question 4 - If the dragged parent overlaps a new same-lane title bar on drop, should only the directly dragged note re-evaluate its parent, or should every moved descendant also re-evaluate attachment?

##### Locked answer
- only the directly dragged note re-evaluates its parent

##### Why
- `Phase 9` already defines drop-time attachment creation as a directly dragged note rule
- reparenting moved descendants in the same pass would turn simple subtree carrying into hidden bulk structure edits

#### [x] Question 5 - Should direct child drag detach in this phase if that child also has descendants?

##### Locked answer
- no

##### Why
- `Phase 11` is already reserved for direct-drag detach behavior
- keeping child drag unchanged in this phase prevents subtree carry from silently widening into relationship editing

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- derive one attachment-based subtree movement set from the directly dragged note plus every descendant whose `parentNoteId` chain leads back to that note
- keep the attachment-derived movement set separate from the temporary selection model, but preserve the current selected-set drag behavior when no attachment subtree applies
- move the subtree through the existing live drag-preview path and final `setStickyNotePlacement(...)` commit path
- preserve relative offsets for every moved descendant
- keep the first cut lane-local, including cross-lane parent drags carrying the full subtree into the resolved target lane
- keep drop-time parent re-evaluation scoped to the directly dragged note only
- do not detach child-led drags yet

Suggested first-cut execution:
1. Add one helper in `DashboardSurface.tsx` that derives the dragged note's descendant note ids from the effective dashboard layouts and their `parentNoteId` links.
2. Widen drag-start note-set resolution so the movement set becomes either the selected-set path, the attachment-subtree path, or the existing single-note path according to the already-shipped interaction priority.
3. Reuse the existing `originLayoutsByNoteId`, preview-layout generation, and placement-commit loop so every subtree note moves by the same drag delta with preserved relative offsets.
4. Keep the existing Phase 9 attachment-parent resolution scoped to `dragState.noteId` after placement commit so moved descendants do not silently reattach.
5. Add focused AppShell regressions for parent-with-child movement, multi-level subtree movement, and cross-lane parent drag carrying the full subtree while existing attach and ordinary single-note drag regressions stay green.

Explicit exclusions:
- do not detach a child from its parent on direct drag yet
- do not let moved descendants independently re-evaluate or replace their parents on drop
- do not merge durable attachment trees with the temporary multi-select model
- do not add connector lines, tree chrome, or stack-preview visuals yet
- do not add explicit attach or detach controls in this phase

Checklist:
- [x] Lock subtree movement to the existing sticky-note drag-preview and drop-commit seam
- [x] Lock the carried movement set to the full descendant tree of the directly dragged parent note
- [x] Lock relative-offset preservation for every moved descendant
- [x] Lock cross-lane parent drag to carry the whole subtree into the target lane together
- [x] Keep parent re-evaluation on drop scoped to the directly dragged note only
- [x] Keep direct-drag detach staged for `Phase 11`

Verification:
- dragging a parent note with one child carries the child through live preview and final placement commit
- dragging a parent note with nested descendants carries the full subtree while preserving relative spacing
- dragging an attached parent into another lane carries the whole subtree into that lane together
- directly dragging a child note still behaves the same as the shipped pre-Phase-11 behavior
- existing attachment-creation, selection, camera, zoom, and ordinary drag regressions still pass after subtree movement lands

Current locked output:
- `Phase 10` is now the implementation-ready attached-subtree movement pass on top of the shipped attachment-tree contract plus drop-time attachment creation
- the first cut is locked to parent-led movement of the full descendant tree with preserved relative offsets
- subtree carry is locked to the existing drag-preview and placement-commit seam, with cross-lane parent drags carrying the full subtree together
- direct child drag behavior remains intentionally unchanged until `Phase 11`

Current shipped output:
- `Phase 10` shipped as the first live attached-subtree movement pass on top of the earlier attachment-tree groundwork plus drop-time attachment creation
- directly dragging any sticky note that owns attached descendants now carries that full descendant subtree through live drag preview and final placement commit
- cross-lane parent drags now carry the whole subtree into the destination lane together without losing attachment links because subtree placement commits land atomically through the dashboard store
- directly dragged child notes still keep the shipped pre-Phase-11 attachment-edit behavior, while explicit direct-drag detach remains intentionally staged for `Phase 11`

### Dashboard-7.10 Follow-On

The dedicated planning home for the post-`Phase 10` sticky-note attachment-hit and sizing ladder now lives in:
- `docs/Human-Plans/Architecture/Dashboard/Future/Dashboard_Phase Dashboard-7.10 - Sticky Attachment Bounds And Resizable Notes.md`

That doc now stages:
- `Phase 10.1 - Parent Full-Body Attachment Hit Area`
- `Phase 10.2 - Attachment Bounds Refactor For Variable Note Size`
- `Phase 10.3 - Resizable Sticky Notes Foundation`
- `Phase 10.4 - Resize Polish And Attachment Compatibility`

## [`didnt need`] Phase 11 - Detach Children By Direct Drag

### Summary

#### Purpose:
- let users break one child subtree out of its old parent by dragging that child directly

#### Main work:
- detect when the user directly drags a note that currently has a parent
- detach that note and its descendants from the old parent before movement begins
- preserve the child subtree while it moves independently
- keep the detach rule obvious and predictable so the user can reorganize stacks without special chrome

#### Suggested scope:
- keep detach driven by direct child drag only in the first cut
- leave explicit attach/detach buttons out of the first pass
- preserve cycle prevention and lane-local behavior from the earlier phases

#### Suggestion:
- direct child drag should detach immediately at drag start, because that matches the user’s intent to pull a note back out of the attached tree instead of still carrying old parent ownership through the move

## [ ] Phase 12 - Dashboard Top Shell Cleanup

### Summary

#### Purpose:
- clean up the top dashboard shell so the board feels thinner, calmer, and less prototype-like now that the sticky-note interaction stack has mostly landed

#### Main work:
- simplify and thin the top dashboard panel area
- reduce extra chrome and vertical density around the board header
- tighten the relationship between the dashboard hero/top shell and the lane board beneath it
- leave sticky-note behavior, attachment semantics, and note ownership unchanged

#### Suggested scope:
- treat this as board-shell cleanup only, not another sticky-note behavior phase
- prefer simplifying or removing top-shell chrome before adding new controls
- if a global lane-height control still belongs in the product, evaluate it inside this phase instead of assuming it must ship exactly as first imagined

#### Suggestion:
- start by making the dashboard top shell visually smaller and quieter, then only keep controls that still feel justified after the chrome is reduced
