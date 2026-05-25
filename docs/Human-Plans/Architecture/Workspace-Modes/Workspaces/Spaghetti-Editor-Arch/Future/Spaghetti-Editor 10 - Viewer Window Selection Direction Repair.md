# `Spaghetti-Editor 10` - `Viewer Window Selection Direction Repair`

## Doc Header

### Doc History
5. 2026-05-25 14:27:43: Added and implemented `Spaghetti-Editor 10 / Phase 4 - Crossing Background Drag Start` so right-to-left green Crossing selection can begin from visible scroller background outside the transformed stage.
4. 2026-05-25 14:22:43: Added and implemented `Spaghetti-Editor 10 / Phase 3 - Canvas Multi-Selection Fit` so middle-mouse double-click now frames the graph-canvas multi-selected node set after Window/Crossing selection.
3. 2026-05-25 14:08:22: Added and implemented `Spaghetti-Editor 10 / Phase 2 - Spaghetti Canvas Window/Crossing Selection Restore` after user testing clarified that model-viewport selection worked but the Spaghetti graph canvas itself still could not make window selections.
2. 2026-05-25 13:59:07: Implemented and closed `Spaghetti-Editor 10 / Phase 1 - Viewer Window/Crossing Direction Repair` by restoring the shipped drag-direction rule in the shared viewer selection-window helper and focused tests.
1. 2026-05-25 13:59:07: Created this phase as a narrow repair lane after the viewer object window-selection helper was found using the opposite drag-direction rule from the shipped camera-controls plan.

### Purpose

Use this doc to restore the existing viewer object window-selection behavior without turning the repair into a broader selection-system rewrite.

The target behavior is:
- drag right / left-to-right = `Window` selection, full containment only
- drag left / right-to-left = `Crossing` selection, overlap counts
- viewer object selection and idle sketch selection stay aligned because they share the same direction helper
- the Spaghetti graph canvas also supports the same empty-space drag selection affordance for graph nodes
- graph-canvas selection can start from visible canvas background even when the transformed stage does not cover the pointer-down point

### Scope

This phase covers:
- the shared viewer window/crossing direction helper
- Spaghetti graph-canvas empty-space window/crossing node selection
- Spaghetti graph-canvas visible-background selection drag start routing
- focused helper coverage for mode direction and candidate collection
- documentation of the Spaghetti Editor repair lane because the visible workflow lives in the viewport-first Spaghetti authoring experience
- middle-mouse double-click fit behavior for graph-canvas multi-selection

This phase does not cover:
- changing workspace selection ownership
- changing Browser or Properties selection semantics
- adding lasso selection
- adding topology sub-entity window selection
- changing camera drag, fly, orbit, or zoom-window behavior
- widening the canonical graph selection store beyond the current primary selected node id

## Doc Body

### Current Grounding

- `src/viewer/workspaceSelectionWindow.ts`
  - owns `getWorkspaceSelectionWindowMode(...)`
  - owns object candidate rectangle matching for window/crossing capture
- `src/viewer/Viewer.ts`
  - uses the helper for model-viewport object marquee selection
  - also uses the same helper for idle geometry-sketch selection-window mode
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - owns empty graph-canvas pointer routing, node hit rects, and visual graph-node selection styling
- `docs/Human-Plans/Architecture/Camera-Controls/Shipped/Camera_Controls_Phase Camera-5.1 - Viewer Object Window Selection.md`
  - records the shipped behavior as left-to-right `Window` and right-to-left `Crossing`

### Boundary Rules

- Keep the repair in the helper so all current callers stay consistent.
- Preserve the existing selection result contract: selected objects flow through `setOnWorkspaceSelectionPick(...)` into shared workspace selection.
- Preserve the existing overlay styling split: `Window` remains the solid/blue path and `Crossing` remains the dashed/green path.
- Do not add a new selection store.

## Wishlist Organization

### High Level Goals

- [x] `Spaghetti-WindowSelection-HLG-1. Restore the shipped viewer window/crossing drag-direction rule.`
- [x] `Spaghetti-WindowSelection-HLG-2. Keep the repair shared between model object marquee selection and idle sketch selection.`
- [x] `Spaghetti-WindowSelection-HLG-3. Restore visible Window/Crossing selection inside the Spaghetti graph canvas.`
- [x] `Spaghetti-WindowSelection-HLG-4. Fit the current graph-canvas multi-selection on middle-mouse double-click.`
- [x] `Spaghetti-WindowSelection-HLG-5. Let green Crossing selection start from visible canvas background outside the transformed stage.`

### `Spaghetti-Editor 10 / Phase 1`

- [x] Update the shared window/crossing mode helper so left-to-right returns `Window`.
- [x] Update focused helper tests so drag-right windows require full containment.
- [x] Update focused helper tests so drag-left crossings capture overlapped candidates.
- [x] `HLG 1. Restore the shipped viewer window/crossing drag-direction rule.`
- [x] `HLG 2. Keep the repair shared between model object marquee selection and idle sketch selection.`

### `Spaghetti-Editor 10 / Phase 2`

- [x] Add an empty-space left-drag owner in the Spaghetti graph canvas.
- [x] Render a visible graph-canvas selection rectangle for `Window` and `Crossing`.
- [x] Select fully enclosed graph nodes on left-to-right `Window` drags.
- [x] Select overlapped graph nodes on right-to-left `Crossing` drags.
- [x] Add focused canvas render tests for both graph-canvas selection modes.
- [x] `HLG 3. Restore visible Window/Crossing selection inside the Spaghetti graph canvas.`

### `Spaghetti-Editor 10 / Phase 3`

- [x] Route middle-mouse double-click fit through the current canvas-selected node id set.
- [x] Preserve single selected-node fit behavior when no canvas multi-selection exists.
- [x] Add focused render coverage for Window/Crossing multi-selection followed by middle-mouse double-click fit.
- [x] `HLG 4. Fit the current graph-canvas multi-selection on middle-mouse double-click.`

### `Spaghetti-Editor 10 / Phase 4`

- [x] Add visible scroller-background pointer routing for empty-canvas selection drags.
- [x] Preserve node, wire, menu, and interactive target guards.
- [x] Add focused render coverage for right-to-left Crossing selection that starts outside the transformed stage.
- [x] `HLG 5. Let green Crossing selection start from visible canvas background outside the transformed stage.`

## [x] `Spaghetti-Editor 10 / Phase 1` - `Viewer Window/Crossing Direction Repair`

### Phase 1 Summary

#### Purpose

Repair the viewer window-selection direction regression while preserving the existing workspace selection handoff.

#### Owns

- `getWorkspaceSelectionWindowMode(...)`
- focused `workspaceSelectionWindow` tests
- documentation tying the repair to the Spaghetti viewport-first authoring lane

#### Does Not Own

- workspace selection state shape
- Browser selection behavior
- topology sub-entity batch selection
- camera gesture changes

#### Implementation Read

The repair is intentionally tiny:
- left-to-right drag returns `window`
- right-to-left drag returns `crossing`
- the existing candidate collection tests prove full containment versus overlap behavior

#### Verification

- `npm.cmd test -- src/viewer/workspaceSelectionWindow.test.ts`

## [x] `Spaghetti-Editor 10 / Phase 2` - `Spaghetti Canvas Window/Crossing Selection Restore`

### Phase 2 Summary

#### Purpose

Restore Window/Crossing selection inside the Spaghetti graph canvas itself.

#### Owns

- empty-canvas left-drag selection routing in `SpaghettiCanvas`
- graph-node rectangle matching against the drawn selection box
- visual selection box styling for `Window` and `Crossing`
- focused render tests for canvas node selection

#### Does Not Own

- changing model-viewport selection
- changing Browser/project workspace selection truth
- adding persisted graph multi-selection state
- changing graph-node delete or drag behavior for selected sets

#### Implementation Read

The canvas now starts a selection-window drag from empty graph space. Left-to-right drags use `Window` containment. Right-to-left drags use `Crossing` overlap. Matched nodes receive the existing selected-node visual treatment, and the current primary selected node remains mirrored through the existing single-node selection state.

#### Verification

- `npm.cmd test -- src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx -t "canvas Window|canvas Crossing"`
- `npm.cmd run build`

## [x] `Spaghetti-Editor 10 / Phase 3` - `Canvas Multi-Selection Fit`

### Phase 3 Summary

#### Purpose

Make middle-mouse double-click fit the graph-canvas multi-selection created by Window/Crossing selection.

#### Owns

- middle-mouse double-click fit routing in `SpaghettiCanvas`
- focused render proof for multi-selected graph-node fit

#### Does Not Own

- persisted graph multi-selection state
- node-set drag or delete behavior
- model-viewport camera fit behavior

#### Implementation Read

The canvas already keeps a visual selected-node set that combines the primary selected node with the local Window/Crossing matches. Middle-mouse double-click now passes that selected set into the existing multi-id fit helper, so the viewport frames every selected graph node instead of only the primary selection.

#### Verification

- `npm.cmd test -- src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx -t "canvas-selected node set|canvas Window|canvas Crossing|selected node on middle"`
- `npm.cmd run build`

## [x] `Spaghetti-Editor 10 / Phase 4` - `Crossing Background Drag Start`

### Phase 4 Summary

#### Purpose

Restore green `Crossing` selection when the right-to-left drag begins from visible graph-canvas background outside the transformed stage element.

#### Owns

- empty-background selection-window pointer routing on the canvas scroller
- focused render proof for Crossing selection from visible scroller background

#### Does Not Own

- changing Window/Crossing selection semantics
- selecting from graph nodes, ports, wires, or menus
- changing model-viewport selection routing

#### Implementation Read

The stage-level selection owner still handles drags that begin on the transformed graph stage. The scroller now also starts the same selection-window flow for empty left-button background drags, so visible canvas background is not a dead zone for right-to-left `Crossing` selection.

#### Verification

- `npm.cmd test -- src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx -t "canvas Crossing|canvas Window|visible scroller background|canvas-selected node set"`
- `npm.cmd run build`
