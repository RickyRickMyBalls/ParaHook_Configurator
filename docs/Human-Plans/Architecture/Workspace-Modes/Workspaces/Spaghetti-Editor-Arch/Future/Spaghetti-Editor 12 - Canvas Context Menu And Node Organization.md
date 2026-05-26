# `Spaghetti-Editor 12` - `Canvas Context Menu And Node Organization`

## Doc Header

### Doc History
3. 2026-05-26 08:11:24: Refined the shipped canvas organization menu so the dependency-column layout is named `Parallel` and the default command-created-node style is available as a second `Linear` organization option.
2. 2026-05-26 08:02:40: Implemented and closed all five `Spaghetti-Editor 12` phases with `Shift+S` add-node search, empty-space canvas context menu ownership, pure dependency node organization, one undoable document-only apply action, focused tests, production build proof, and in-app browser mount smoke.
1. 2026-05-26 07:49:23: Created this phase to plan the Spaghetti canvas right-click context menu, Shift+S add-node search shortcut, and graph-owned node organization workflow that lays out full Spaghetti nodes and wires using a Parallel-style dependency read.

### Purpose

Use this phase to make the Spaghetti canvas right-click behavior become a real canvas action menu and to give users an explicit way to organize messy graph nodes.

The target behavior is:
- right-clicking empty space in the Spaghetti canvas opens a canvas context menu
- the canvas context menu includes an `Organization` action
- the existing add-node search menu moves to a keyboard shortcut, `Shift+S`, while focus is on the Spaghetti canvas
- organization rearranges the real Spaghetti nodes and wires in the editor, not a separate Build Path projection
- the first organization read feels similar to Build Path Parallel's dependency topology, but with full node cards, actual wires, and graph UI positions

### Scope

This phase covers:
- Spaghetti canvas empty-space context menu ownership
- moving the existing add-node search launcher from empty-space right-click to `Shift+S`
- a Spaghetti-owned dependency layout read model for real node positions
- applying organized positions to `graph.ui.nodes`
- edit-history and document-only revision behavior for organization
- focused tests proving shortcut, menu, layout, and build-isolation behavior

This phase does not cover:
- Build Path Parallel UI changes
- changing graph semantics, node params, or wires
- worker/build pipeline changes
- replacing the future left node palette
- introducing a persistent alternate layout layer
- manual drag handles for arrangement groups beyond existing node dragging

## Doc Body

### Current Grounding

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - owns the existing empty-space `onContextMenu` path
  - currently opens `nodeAddMenu` from empty-space right-click
  - already owns canvas-level keyboard handling, focus, selection, panning, fitting, and node position writes
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - already provides reusable context-menu UI for Spaghetti and Build Path surfaces
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already has document-only node-position writes through `setNodePos(...)` and `setManyNodePos(...)`
  - already has graph node move history support for individual drags
- `src/app/spaghetti/layout/commandNodePlacement.ts`
  - already proves a small pure placement planner for command-created nodes
  - is not a full graph organization planner yet
- `src/app/buildPath/buildPathTimeline.ts`
  - has a Parallel topology read model that can inspire fan-out/fan-in dependency layout
  - must remain a Build Path presentation read, not the Spaghetti organization owner

### Boundary Rules

- Spaghetti Editor owns this feature because it moves actual Spaghetti node UI positions.
- Build Path Parallel can inspire the shape, but organization must not depend on Build Path timeline state or accepted build event order.
- Organization should update `graph.ui.nodes` only. It must not mutate nodes, params, edges, receive references, outputs, or build results.
- The first pass should not silently erase user layout without an explicit user action.
- The first pass should avoid adding a second persisted layout layer. The persisted result is normal node positions.
- Organization should preserve graph-authored truth and treat layout as document/UI metadata.
- The canvas add-node menu should keep its existing search/add behavior after it moves to `Shift+S`.

## Vision

The healthy user flow is:

1. The user is in the Spaghetti canvas and sees nodes tangled or piled up.
2. The user right-clicks empty canvas space.
3. A small canvas context menu appears.
4. The user chooses `Organization`.
5. The graph rearranges into readable dependency columns:
   - source/root nodes on the left
   - dependent operation nodes to the right
   - sibling parallel branches stacked vertically
   - shared output or sink nodes on the far right
6. The user can still manually drag nodes afterward.
7. If the user wants to add a new node, they press `Shift+S` while the canvas is focused and get the familiar add-node search menu.

The first organization read should be practical rather than magical. It should make the common `Sketch -> many Extrudes -> OutputPreview` shape readable as full Spaghetti nodes and wires, similar to Build Path Parallel's compact `1 > 6 > 1` topology, while keeping Spaghetti as the owner of real node layout.

## Wishlist Organization

### High Level Goals

- [x] `Spaghetti-Org-HLG-1. Add an Organization action to the Spaghetti editor so users can tidy messy node graphs from inside the editor.`
- [x] `Spaghetti-Org-HLG-2. Open Spaghetti canvas actions from an empty-space right-click context menu.`
- [x] `Spaghetti-Org-HLG-3. Move the current Spaghetti add-node search menu to Shift+S when the Spaghetti canvas has focus.`
- [x] `Spaghetti-Org-HLG-4. Make the first organization layout feel like Build Path Parallel's dependency topology while using full Spaghetti nodes and actual wires.`
- [x] `Spaghetti-Org-HLG-5. Keep organization as graph UI metadata only, without changing graph semantics or triggering worker builds.`

### Codex Level Goals

- [x] Add a canvas-owned context menu state separate from node row-mode context menus.
- [x] Route `Shift+S` to the existing add-node search menu without breaking Escape, Enter, or pointer dismissal behavior.
- [x] Add a pure Spaghetti dependency layout planner for full graph node positions.
- [x] Apply organization through a document-only graph UI update and an honest undo/redo entry.
- [x] Add focused behavior tests for context-menu routing, shortcut routing, deterministic layout, and build isolation.

### `Spaghetti-Editor 12 / Phase 1`

- [x] Preserve the current add-node menu behavior while changing its launcher from empty-space right-click to `Shift+S`.
- [x] Ensure `Shift+S` only opens the menu when the Spaghetti canvas owns focus and no text input or active menu should consume the key.
- [x] Place the search menu at the last canvas pointer location when available, otherwise near the visible canvas center.
- [x] Keep Escape, Enter, filtering, and click-to-add behavior unchanged.
- [x] `Spaghetti-Org-HLG-3`

### `Spaghetti-Editor 12 / Phase 2`

- [x] Add an empty-space Spaghetti canvas context menu using the existing `SpaghettiContextMenu`.
- [x] Keep node right-click row-mode behavior separate from empty-space canvas actions.
- [x] Add the first `Organization` menu item.
- [x] Close competing menus cleanly when opening another menu.
- [x] `Spaghetti-Org-HLG-1`
- [x] `Spaghetti-Org-HLG-2`

### `Spaghetti-Editor 12 / Phase 3`

- [x] Add a pure Spaghetti organization read model under `src/app/spaghetti/layout/`.
- [x] Derive dependency columns from graph nodes and edges without using Build Path timeline state.
- [x] Represent fan-out and fan-in shapes deterministically.
- [x] Preserve existing node width values where present.
- [x] Add focused tests for simple linear, branch fan-out, shared sink, disconnected nodes, and stable ordering.
- [x] `Spaghetti-Org-HLG-4`
- [x] `Spaghetti-Org-HLG-5`

### `Spaghetti-Editor 12 / Phase 4`

- [x] Wire the context-menu `Organization` action to apply planned positions to `graph.ui.nodes`.
- [x] Use document-only revision scope for organized node positions.
- [x] Add one undoable `Organize graph nodes` entry instead of many per-node move entries.
- [x] Keep manual node dragging compatible after organization.
- [x] Preserve viewport behavior explicitly after organization.
- [x] `Spaghetti-Org-HLG-1`
- [x] `Spaghetti-Org-HLG-4`
- [x] `Spaghetti-Org-HLG-5`

### `Spaghetti-Editor 12 / Phase 5`

- [x] Add final regression coverage for menu routing, shortcut routing, organization apply behavior, undo/redo, and worker-build isolation.
- [x] Verify a canonical `Sketch -> six Extrudes -> OutputPreview` graph reads as a full-node `1 > 6 > 1` layout after organization.
- [x] Record any follow-up modes, such as selected-only organization, compact chains, or alternate alignment controls, as later phases instead of widening this first pass.
- [x] `Spaghetti-Org-HLG-1`
- [x] `Spaghetti-Org-HLG-2`
- [x] `Spaghetti-Org-HLG-3`
- [x] `Spaghetti-Org-HLG-4`
- [x] `Spaghetti-Org-HLG-5`

## [x] `Spaghetti-Editor 12 / Phase 1` - `Shift+S Add Node Search Launcher`

### Phase 1 Summary

Move the current empty-space right-click add-node search launcher onto `Shift+S` while preserving the existing add-node menu behavior.

### Phase 1 Implementation Spec

The implementation pass should:
- keep the current `nodeAddMenu` search/filter/add behavior intact
- add a small owner for the last canvas pointer location in stage and viewport coordinates
- open `nodeAddMenu` from canvas `onKeyDown` when `event.shiftKey` is true and `event.key` is `S` or `s`
- avoid opening while the key event target is an input, textarea, select, or content-editable element
- avoid opening when the node-add menu is already open unless the intended behavior is to refocus it
- close any canvas context menu before opening the add-node search
- keep Escape and Enter behavior unchanged

Likely files:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification should include:
- focused render test for `Shift+S` opening add-node search
- focused render test that text input focus does not steal `Shift+S`
- production build if runtime code changes

### Phase 1 Accepted Result

Accepted 2026-05-26 08:02:40. `Shift+S` now opens the existing add-node search from the Spaghetti canvas at the last canvas pointer location, or visible canvas center when no pointer location exists, while interactive targets keep ownership of their key events.

## [x] `Spaghetti-Editor 12 / Phase 2` - `Canvas Context Menu Shell`

### Phase 2 Summary

Make empty-space right-click open a Spaghetti canvas action menu instead of the add-node search menu.

### Phase 2 Implementation Spec

The implementation pass should:
- add a separate canvas context-menu state such as `canvasContextMenu`
- reuse `SpaghettiContextMenu`
- open the canvas menu only when right-clicking empty canvas space
- keep node right-click routed to the existing node row-mode context menu
- close `nodeAddMenu` and node row-mode menu when opening the canvas menu
- include an `Organization` item, even if early implementation only wires it to a no-op or disabled state until Phase 4
- preserve context-menu clamping to the visible canvas viewport

Likely files:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx` only if minor menu behavior support is needed
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification should include:
- empty-space right-click shows canvas menu
- empty-space right-click no longer opens add-node search
- node right-click still shows row-density menu

### Phase 2 Accepted Result

Accepted 2026-05-26 08:02:40. Empty-space right-click now opens a canvas-owned `SpaghettiContextMenu` with `Organization`, while node right-click still routes to the existing row-mode menu and competing menus close cleanly.

## [x] `Spaghetti-Editor 12 / Phase 3` - `Dependency Organization Planner`

### Phase 3 Summary

Add the pure layout model that can arrange full Spaghetti nodes into dependency columns and parallel sibling lanes.

### Phase 3 Implementation Spec

The implementation pass should:
- add a helper under `src/app/spaghetti/layout/`, for example `graphNodeOrganization.ts`
- accept graph nodes, graph edges, and current `graph.ui.nodes`
- compute deterministic column indexes from incoming dependencies
- stack siblings within a column using stable ordering
- place disconnected nodes in a separate fallback lane or trailing group
- preserve existing node widths
- return only planned positions and layout metadata, not a mutated graph
- use Build Path Parallel as a visual precedent only; do not import or depend on Build Path timeline state

Suggested first spacing:
- source column starts near `x = 80`
- columns advance by enough width to clear full node cards and wires
- lanes advance by enough height to avoid immediate node overlap

Likely files:
- `src/app/spaghetti/layout/graphNodeOrganization.ts`
- `src/app/spaghetti/layout/graphNodeOrganization.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification should include pure tests for:
- linear chain
- one source to many siblings
- many siblings to one output sink
- disconnected node handling
- stable output for shuffled input arrays

### Phase 3 Accepted Result

Accepted 2026-05-26 08:02:40. `src/app/spaghetti/layout/graphNodeOrganization.ts` now provides a pure dependency-column planner for full Spaghetti node positions, including stable fan-out/fan-in lanes, disconnected-node placement, and existing width preservation.

## [x] `Spaghetti-Editor 12 / Phase 4` - `Apply Organization With History`

### Phase 4 Summary

Wire the canvas menu action to apply the planned organization to real Spaghetti node positions.

### Phase 4 Implementation Spec

The implementation pass should:
- add a store action for organizing many node positions with document-only revision scope
- add one edit-history entry labeled `Organize graph nodes`
- make undo restore previous positions and redo restore organized positions
- apply only `graph.ui.nodes` changes
- leave graph nodes, params, edges, output state, receive references, and runtime build truth unchanged
- decide and test whether the canvas should fit organized nodes or preserve the current viewport after applying organization

Likely files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/store/history/graphNodeHistoryCommitAdapter.ts` or a sibling batch-position history adapter if that is cleaner
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification should include:
- organization updates node positions
- graph geometry revision does not advance
- undo and redo restore position snapshots
- worker builds are not requested for organization-only changes

### Phase 4 Accepted Result

Accepted 2026-05-26 08:02:40. The `Organization` action applies planned positions to `graph.ui.nodes` through one document-only, undoable `Organize graph nodes` history entry without changing graph semantics or worker build state.

## [x] `Spaghetti-Editor 12 / Phase 5` - `Organization Proof And Follow-Up Routing`

### Phase 5 Summary

Close the first organization pass with focused proof against a real fan-out/fan-in graph and route any wider arrangement ideas into follow-on phases.

### Phase 5 Implementation Spec

The implementation pass should:
- add or reuse a canonical graph fixture with `Sketch -> six Extrudes -> OutputPreview`
- prove the organized full-node layout reads as source column, sibling Extrude stack, and output sink column
- prove actual wires still render from the normal Spaghetti wire layer after organization
- run focused canvas/store/layout tests
- run production build
- record follow-up direction for selected-only organization, alignment controls, compact-chain mode, or saveable alternate layout presets if user testing asks for them

Likely files:
- `src/app/spaghetti/layout/graphNodeOrganization.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Verification should include:
- focused tests for the canonical fan-out/fan-in layout
- manual or browser smoke when the app can be run locally

### Phase 5 Accepted Result

Accepted 2026-05-26 08:02:40. Focused layout, canvas render, store, app-store isolation tests, production build, and in-app browser mount smoke passed. Follow-on organization modes remain separate future scope: selected-only organization, alignment controls, compact-chain variants, and optional saved alternate layout presets.

### Post-Closeout Naming Refinement

Accepted 2026-05-26 08:11:24. The shipped dependency-column organization action is named `Parallel`, and the canvas context menu now also includes `Linear`, a single-row dependency-ordered organization mode matching the default command-created-node layout direction.
