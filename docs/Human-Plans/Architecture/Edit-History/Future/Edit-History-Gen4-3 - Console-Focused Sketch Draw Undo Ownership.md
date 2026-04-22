# Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership

## Doc Header

### Doc History
2. 2026-04-22 16:28:35: Marked this Gen4-3 plan complete after focused-console routing, Sketch Draw staged command dispatch, submitted tool-command local undo/redo, focused tests, store tests, and production build proof landed.
1. 2026-04-22 15:16:08: Created this Future plan doc after user review clarified console-submitted Sketch Draw commands need `Ctrl+Z` / `Ctrl+Y` ownership even when the console input remains focused, starting with Sketch Draw while preserving a reusable active command-session undo policy direction.

### Purpose

This doc plans the third Generation 4 Edit History family phase.

Use it to implement focused-console undo/redo ownership for active Sketch Draw so submitted console commands remain undoable inside the Sketch Draw session before the final sketch commit.

## Doc Body

## Vision

Sketch Draw should feel reliable whether the user acts through the viewport, toolbar, or Console.

The user should be able to:
- enter Sketch Draw
- type `rec` in Console and press `Enter`
- enter rectangle points through Console or the viewport
- press `Ctrl+Z` while the console input is still focused
- undo the active Sketch Draw command result instead of only undoing text inside the console input
- keep drawing, undoing, redoing, and finally commit the accepted sketch

The broader policy should be reusable:
- active command sessions can own undo/redo after submitted console commands
- the console input should still own native text undo when the user has a meaningful unsent manual draft
- ordinary editable fields outside active command sessions should keep native undo/redo behavior
- app-wide canonical edit history remains the owner after the active session commits its accepted authored delta

### Current Gap

`Edit-History-Gen4-2` added staged Sketch Draw undo/redo, but the keyboard route can still miss it.

Current researched gap:
- `inputRouting.ts` checks editable targets before Sketch Draw undo/redo routing
- the Console input is an editable target
- after a submitted command, Console guidance can keep or regain focus
- `Ctrl+Z` / `Ctrl+Y` can therefore become native console text undo/redo instead of active Sketch Draw staged undo/redo

There is also a command-boundary gap:
- `rec` selects the rectangle tool but does not create a completed rectangle
- if the user expects `Ctrl+Z` after `rec` to undo the submitted command, Sketch Draw needs an explicit tool-selection undo answer
- that answer should remain local to the active Sketch Draw session, not canonical app history

### Ownership Direction

Use an active command-session undo owner, not a broad rewrite.

Recommended shape:
- extend the shared input-routing contract so active command sessions can claim `Ctrl+Z` / `Ctrl+Y` from the focused console input under narrow conditions
- classify the console input separately from ordinary editable fields when an active command session exists
- let native console input undo win only when there is meaningful unsent text that has not been submitted or accepted into the command session
- route submitted Sketch Draw command undo/redo to `geometrySketchSession` staged undo/redo first
- keep canonical app history and viewer shortcuts behind active Sketch Draw ownership while the session is active

### Non-Goals

- Do not build a full cross-mode command-session framework before Sketch Draw proves the route.
- Do not make command transcript or command recall canonical undo history.
- Do not break native undo/redo in normal text inputs, textareas, selects, or contenteditable regions outside the console command surface.
- Do not create canonical app-history entries for uncommitted Sketch Draw staged commands.
- Do not change the final Sketch Draw close/commit behavior from one accepted canonical app-history entry.
- Do not widen into Reference Transform, Sketch Plane, Build Path, checkpoints, branching, collaboration, persistence, runtime cache, provider status, or preview/build output history in this phase.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen4-HLG-3` - Let Sketch Draw keep undo/redo ownership after console command submissions even when the console input remains focused, so `Ctrl+Z` / `Ctrl+Y` act on the active Sketch Draw command session instead of native console text history.

### `Edit-History-Gen4-3 Phase 1`

- [x] `Edit-History-Gen4-HLG-3`
- [x] `Edit-History-Gen4-CLG-9` - Define a shared input-routing policy that lets an active command session outrank native console input undo/redo after submitted console commands while preserving native undo for meaningful unsent console drafts and ordinary editable fields.
- [x] `Edit-History-Gen4-CLG-12` - Prove the focused-console undo policy does not break global canonical app undo, viewer shortcuts, command recall, text-field native undo, or final Sketch Draw commit behavior.

### `Edit-History-Gen4-3 Phase 2`

- [x] `Edit-History-Gen4-HLG-3`
- [x] `Edit-History-Gen4-CLG-10` - Route focused-console `Ctrl+Z` / `Ctrl+Y` to Sketch Draw staged undo/redo after completed console-driven Sketch Draw commands such as rectangle point submissions.
- [x] `Edit-History-Gen4-CLG-12` - Prove the focused-console undo policy does not break global canonical app undo, viewer shortcuts, command recall, text-field native undo, or final Sketch Draw commit behavior.

### `Edit-History-Gen4-3 Phase 3`

- [x] `Edit-History-Gen4-HLG-3`
- [x] `Edit-History-Gen4-CLG-11` - Give submitted Sketch Draw tool-selection commands such as `rec` an explicit undo/redo or cancel/reapply behavior inside the active session.
- [x] `Edit-History-Gen4-CLG-12` - Prove the focused-console undo policy does not break global canonical app undo, viewer shortcuts, command recall, text-field native undo, or final Sketch Draw commit behavior.

## [x] `Edit-History-Gen4-3 / Phase 1` - `Focused Console Undo Routing Policy`

### Phase 1 Summary

Define the shared routing contract for active command-session undo while keeping the implementation narrow enough to serve Sketch Draw first.

This phase should make the route decision explicit: when a focused console input is merely the command entry surface for an active command session, submitted command undo/redo belongs to that active session before native console text undo.

### Phase 1 Implementation Spec

Research first:
- `src/app/inputRouting.ts`
  - `isEditableTarget(...)`
  - `routeKeyboardInput(...)`
  - `InputRoutingOwner`
- `src/app/inputRouting.test.ts`
- `src/app/console/ConsoleBar.tsx`
  - submit, focus, blur, and guided input behavior
- `src/app/console/useConsoleInteraction.ts`
  - global console key route
  - Sketch Draw feature-assist and staged navigation state
- `src/app/components/ViewportOverlay.tsx`
  - active Sketch Draw keyboard listener

Implementation direction:
- add an explicit routing concept for focused console undo ownership, such as an active command-session owner or a console-input override flag
- distinguish focused Console input from arbitrary editable targets
- preserve native text undo when the console has unsent manual input that is still a draft
- let active Sketch Draw claim `Ctrl+Z` / `Ctrl+Y` from the console input after submitted commands or descriptor-driven prefill
- keep ordinary text fields, textareas, selects, contenteditable elements, and unrelated console drafts on native undo/redo
- avoid hard-coding behavior that only works for `rec`; the policy should support later active command sessions without implementing them now

Expected tests:
- focused ordinary input still returns `text-field` for `Ctrl+Z` / `Ctrl+Y`
- focused console input with meaningful unsent manual text still keeps native text undo
- focused console input with active Sketch Draw and no meaningful unsent draft routes `Ctrl+Z` / `Ctrl+Y` to Sketch Draw
- app-wide canonical undo still works outside active Sketch Draw
- viewer camera shortcuts do not receive `Ctrl+Z` while active Sketch Draw owns command undo

Stop conditions:
- stop if routing needs a full console-state rewrite
- stop if the route cannot reliably distinguish Console input from ordinary editable fields
- stop if unsent console draft ownership cannot be determined without a broader console command-state model

Acceptance:
- implemented with explicit Console input routing markers, active Sketch Draw command-session request fields, native unsent-draft preservation, focused route coverage, and production build proof

## [x] `Edit-History-Gen4-3 / Phase 2` - `Focused Console Staged Sketch Undo Redo`

### Phase 2 Summary

Connect the focused-console route to Sketch Draw staged command undo/redo for completed console-driven sketch commands.

This phase should prove the high-value workflow: draw through Console, keep focus in Console, and still undo/redo completed staged sketch geometry before final commit.

### Phase 2 Implementation Spec

Research first:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `undoGeometrySketchStagedCommand(...)`
  - `redoGeometrySketchStagedCommand(...)`
  - `confirmGeometrySketchDrawPoint(...)`
  - `confirmGeometrySketchDrawRadius(...)`
  - `finishGeometrySketchDrawDraft(...)`
  - `closeGeometrySketchSession(...)`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- `src/app/useViewerCameraShortcuts.test.tsx`

Implementation direction:
- when the route returns Sketch Draw undo/redo from focused Console input, call the staged Sketch Draw undo/redo methods
- make sure `Ctrl+Z` after a completed console-driven rectangle removes the completed rectangle while the session remains active
- make sure `Ctrl+Y` restores that rectangle from the staged redo stack
- keep textual `undo` as draft-point undo for active incomplete commands
- keep final Sketch Draw close/commit as one canonical app-history entry for the accepted staged sketch

Expected tests:
- type `rec`, submit two points through Console, press `Ctrl+Z` with the console input focused, and the completed rectangle is removed from the active sketch
- after that undo, `Ctrl+Y` with console focused restores the staged rectangle
- draw two completed rectangles through Console, `Ctrl+Z` once removes only the second rectangle
- final Sketch Draw commit after focused-console staged undo creates one canonical app-history entry for the accepted staged result
- no viewer zoom action runs for focused-console `Ctrl+Z` while Sketch Draw is active

Stop conditions:
- stop if focused-console undo would need to move Sketch Draw state out of `geometrySketchSession`
- stop if staged undo/redo cannot be called safely from the console-focused path
- stop if final canonical commit semantics become ambiguous

Acceptance:
- implemented with focused Console dispatch to Sketch Draw staged undo/redo, focused ConsoleDock coverage for completed rectangle undo/redo, focused route coverage, and final build proof

## [x] `Edit-History-Gen4-3 / Phase 3` - `Submitted Tool Command Undo`

### Phase 3 Summary

Give submitted Sketch Draw tool-selection commands an explicit undo answer.

This phase addresses the user expectation that after typing `rec` and pressing `Enter`, `Ctrl+Z` should undo the submitted command even though no rectangle geometry has been completed yet.

### Phase 3 Implementation Spec

Research first:
- `src/app/spaghetti/sketchCommands/drawCommands.ts`
  - `rec`, `line`, `pline`, `circle`, `previous`, `back`, and `x`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `runGeometrySketchDrawCommand(...)`
  - active tool and last-used-tool transitions
  - draft cancel/back behavior
- `src/app/console/useConsoleInteraction.ts`
  - `submitDrawCommand(...)`
- focused-console tests from Phase 2

Implementation direction:
- decide and document the local-session behavior for undoing a submitted tool-selection command
- recommended first behavior: `Ctrl+Z` after `rec` cancels the active rectangle tool selection and returns Sketch Draw to idle without creating canonical app history
- if redo is straightforward, `Ctrl+Y` should reapply the tool-selection command; if not, document redo as a follow-up before marking this phase complete
- make sure tool-selection undo does not consume completed staged geometry undo out of order
- keep command transcript and command recall outside authored undo
- keep `previous` command behavior clear if it re-enters the last used draw tool

Expected tests:
- type `rec`, press `Enter`, then `Ctrl+Z` with the console input focused returns Sketch Draw from active rectangle tool to idle
- `Ctrl+Y` reapplies the rectangle tool if redo is implemented in this phase
- after a completed rectangle exists, `Ctrl+Z` first undoes the completed staged rectangle before undoing earlier tool-selection state
- undoing tool selection creates no canonical app-history entry
- draft points continue to use textual `undo` / local draft cancellation rules

Stop conditions:
- stop if tool-selection undo requires a broad command-stack model that would exceed Sketch Draw
- stop if redo semantics cannot be made deterministic without changing the current `previous` command model
- stop if command transcript/recall starts acting like authored undo

Acceptance:
- implemented with local Sketch Draw session history for tool-selection commands, deterministic `Ctrl+Z` idle and `Ctrl+Y` reapply behavior, completed staged geometry priority, no canonical entry for submitted tool selection, focused store coverage, and production build proof
