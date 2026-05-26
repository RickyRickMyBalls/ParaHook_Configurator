# `VCTS - 4` - `Viewport-Local Toolbar Placement And Persistence`

## Doc Header

### Doc History
3. 2026-05-26 06:32:45: Implemented and accepted `VCTS - 4` through the Dispatch 5 manager loop by adding viewport-local placement helpers, repairing Transform and Extrude right-anchor defaults, adding per-viewport manual placement persistence, keeping Sketch routed as follow-on shell cleanup, and recording focused tests plus production build proof.
2. 2026-05-26 06:18:30: Activated `VCTS - 4 / Phase 1 - Coordinate Owner Audit And Anchor Contract` under Dispatch 5 as a research packet, confirming Transform and Extrude still use browser-window defaults while Sketch already has an overlay-root metrics helper that points to the shared viewport-local bounds seam.
1. 2026-05-26 06:13:29: Added this future phase doc to plan viewport-local command-toolbar anchoring, Transform right-anchor repair, Extrude right-anchor adoption, and remembered manual placement for shared Sketch, Transform, and Extrude toolbar shells.

### Purpose

Use this doc as the implementation-planning surface for making shared viewport command toolbars spawn relative to the Model Viewport pane instead of the browser window.

The user-facing goal is:
- right anchoring means the right edge of the active Model Viewport, not the right edge of the whole browser
- Transform should stop hiding behind split views when it anchors right
- Extrude should open from the same shared placement shell
- manual drag/resize placement should be remembered per viewport once the user moves a toolbar
- Sketch, Transform, Extrude, and future command panels should share one placement recipe without sharing command behavior

### Scope

This phase covers:
- viewport-local command-toolbar coordinate ownership
- right-side anchor resolution inside the Model Viewport overlay root
- shared anchor/clamp helpers for `useViewportFloatingToolPanel`
- Transform right-anchor repair
- Extrude right-anchor adoption
- per-viewport manual placement persistence
- follow-on Sketch routing and reset-to-anchor affordance planning

This phase does not cover:
- detached/floating Model Viewport app-window placement
- Spaghetti Editor window placement
- command graph writes, preview, accept/cancel, or history behavior
- a broad Sketch toolbar rewrite in the first repair pass
- global user preference design for all app panels

### Current Code-Backed Read

Current placement read:
- `src/app/components/ReferenceTransformToolbar.tsx`
  - `transformToolbarDefaultPosition` uses `window.innerWidth`
  - this makes right anchoring browser-window-relative instead of Model-Viewport-relative
  - in split layouts, the panel can be placed behind or beyond the actual viewport pane
- `src/app/components/useViewportFloatingToolPanel.ts`
  - owns shared drag, resize, min size, default size, manual position, and clamping behavior
  - its default `getBounds` fallback also uses `window.innerWidth` and `window.innerHeight`
  - this is useful as a safety fallback, but should not be the normal command-toolbar coordinate owner
- `src/app/components/ViewportOverlay.tsx`
  - already owns `overlayRootRef` on `ViewportOverlayRoot`
  - already receives `viewportId`
  - currently renders command toolbar surfaces without giving them a viewport-local placement contract
- `src/app/components/ViewerHost.tsx`
  - Extrude's default command toolbar position is still derived from browser-window dimensions
  - Extrude now consumes the shared command-panel shell and visual grammar, so it is ready for shared placement ownership
- `src/app/workspace/workspaceShellTypes.ts`
  - `WorkspaceViewportLocalViewState` already carries per-viewport local view state through workspace persistence
  - this is the right first home for remembered command-toolbar placement because the placement is viewport-local, not global app chrome

### Boundary Rules

- The Model Viewport overlay root should be the normal coordinate owner for viewport command toolbars.
- `window.innerWidth` and `window.innerHeight` should remain only a fallback when no viewport-local bounds are available.
- Anchored placement and manual placement should be separate states.
- Feature families should own command state and toolbar content; the shared shell should own placement math.
- Manual placement should be stored per viewport and per toolbar key so moving Extrude does not unexpectedly move Transform.
- Reset-to-anchor can be added after persistence exists; do not block the core repair on a larger preference UI.

## Doc Body

### Summary

`VCTS - 4` is the viewport-local placement lane for command toolbars.

`VCTS - 1` established the in-viewport command-toolbar shell. `VCTS - 2` moved floating behavior into `useViewportFloatingToolPanel`. `VCTS - 3` extracted shared command-panel visual grammar. The next issue is coordinate ownership: the shell can drag and resize, but right anchoring still falls back to browser-window dimensions in Transform and Extrude.

Locked recommendation:
- make `ViewportOverlayRoot` or an equivalent Model Viewport surface rect the coordinate owner
- resolve default anchors from viewport-local bounds
- keep all pointer movement and clamp math in viewport-local coordinates
- persist manual placement in `WorkspaceViewportLocalViewState`
- migrate Transform first because it exposes the current right-anchor bug
- migrate Extrude second because Build Path edit handoffs now rely on predictable toolbar reopen placement
- route Sketch separately after the shared placement API proves stable

### Likely Shared API Shape

Preferred first cut:
- keep `ViewportOverlayToolPanel` as the outer shell
- keep `useViewportFloatingToolPanel` as the behavior hook
- add a small viewport-placement contract beside the existing hook instead of creating a separate panel system

Likely placement types:

```ts
type ViewportToolPanelPlacementKey = 'extrude' | 'transform' | 'sketch';

type ViewportToolPanelAnchorPlacement = {
  mode: 'anchored';
  anchor: 'right';
  margin: number;
  top: number;
};

type ViewportToolPanelManualPlacement = {
  mode: 'manual';
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

type ViewportToolPanelPlacement =
  | ViewportToolPanelAnchorPlacement
  | ViewportToolPanelManualPlacement;
```

Likely hook inputs:

```ts
useViewportFloatingToolPanel({
  placementKey: 'transform',
  placement,
  defaultPlacement: { mode: 'anchored', anchor: 'right', margin: 16, top: 22 },
  onPlacementChange,
  getBounds: getViewportOverlayBounds,
});
```

Important implementation detail:
- `onPlacementChange` should only write manual placement after a user drag or resize
- the anchored default should not be persisted as noise unless a later preference design needs it

## Wishlist Organization

### High Level Goals

- [x] `VCTS-Gen1-HLG-9. Command toolbar placement should be viewport-local, so right anchoring means the active Model Viewport pane, not the browser window.`
- [x] `VCTS-Gen1-HLG-10. The shared shell should provide a reusable anchor/manual-placement model for Extrude, Transform, Sketch, and future viewport command panels.`
- [x] `VCTS-Gen1-HLG-11. Manual drag and resize placement should persist per Model Viewport when workspace persistence is enabled.`
- [x] `VCTS-Gen1-HLG-12. Feature-specific command state and graph semantics should stay outside placement ownership.`

### Codex Level Goals

- [x] CLG 1. Audit current Transform, Extrude, and Sketch coordinate ownership and confirm the viewport overlay root as the shared coordinate owner.
- [x] CLG 2. Add pure shared viewport anchor and clamp helpers for right anchoring, manual placement, and split-view bounds.
- [x] CLG 3. Repair Transform right anchoring so it lands inside the active Model Viewport pane.
- [x] CLG 4. Move Extrude toolbar default placement onto the same viewport-local right-anchor model.
- [x] CLG 5. Persist user manual placement per viewport and per command toolbar key.
- [x] CLG 6. Route Sketch migration and reset-to-anchor affordance as follow-on shell cleanup.

### `VCTS - 4 / Phase 1`

- [x] `HLG 9. Command toolbar placement should be viewport-local, so right anchoring means the active Model Viewport pane, not the browser window.`
- [x] `HLG 12. Feature-specific command state and graph semantics should stay outside placement ownership.`
- audit `ReferenceTransformToolbar`, Extrude toolbar placement in `ViewerHost`, Sketch toolbar placement in `ViewportOverlay`, and `useViewportFloatingToolPanel`
- confirm which element supplies the authoritative Model Viewport bounds
- document anchored versus manual placement ownership

### `VCTS - 4 / Phase 2`

- [x] `HLG 9. Command toolbar placement should be viewport-local, so right anchoring means the active Model Viewport pane, not the browser window.`
- [x] `HLG 10. The shared shell should provide a reusable anchor/manual-placement model for Extrude, Transform, Sketch, and future viewport command panels.`
- add shared pure helpers for viewport-local right-anchor resolution
- add shared pure helpers for manual rect clamping inside viewport bounds
- cover split-view-sized bounds in focused tests

### `VCTS - 4 / Phase 3`

- [x] `HLG 9. Command toolbar placement should be viewport-local, so right anchoring means the active Model Viewport pane, not the browser window.`
- [x] `HLG 12. Feature-specific command state and graph semantics should stay outside placement ownership.`
- pass viewport-local bounds into Transform toolbar placement
- replace Transform's browser-window default position with the shared right-anchor helper
- preserve Transform command controls, readbacks, and behavior

### `VCTS - 4 / Phase 4`

- [x] `HLG 10. The shared shell should provide a reusable anchor/manual-placement model for Extrude, Transform, Sketch, and future viewport command panels.`
- [x] `HLG 12. Feature-specific command state and graph semantics should stay outside placement ownership.`
- move Extrude's default toolbar placement to the shared viewport-local right anchor
- keep Build Path `edit extrude` handoff opening the command toolbar without opening the graph
- preserve Extrude node reuse, preview, accept/cancel, and toolbar controls

### `VCTS - 4 / Phase 5`

- [x] `HLG 10. The shared shell should provide a reusable anchor/manual-placement model for Extrude, Transform, Sketch, and future viewport command panels.`
- [x] `HLG 11. Manual drag and resize placement should persist per Model Viewport when workspace persistence is enabled.`
- extend `WorkspaceViewportLocalViewState` with per-toolbar manual placement state
- write manual placement after user drag or resize
- reopen Transform and Extrude from remembered placement when available
- clamp remembered placement against current viewport bounds after split changes

### `VCTS - 4 / Phase 6`

- [x] `HLG 10. The shared shell should provide a reusable anchor/manual-placement model for Extrude, Transform, Sketch, and future viewport command panels.`
- [x] `HLG 11. Manual drag and resize placement should persist per Model Viewport when workspace persistence is enabled.`
- route Sketch adoption after Transform and Extrude prove the shared placement API
- add or plan a reset-to-right-anchor affordance for moved toolbars
- update the future-toolbar setup recipe so new command panels use viewport-local anchoring by default

## [x] `VCTS - 4 / Phase 1` - `Coordinate Owner Audit And Anchor Contract`

### Phase 1 Summary

#### Purpose

Lock the coordinate contract before changing runtime placement behavior.

#### Owns

- identifying every browser-window placement fallback in current command toolbars
- confirming the Model Viewport overlay root as the normal coordinate owner
- naming the anchored and manual placement states
- deciding what stays inside feature code versus the shared shell

#### Does Not Own

- runtime migration
- persistence writes
- changing command behavior

### Phase 1 Implementation Spec

1. Inspect Transform, Extrude, and Sketch toolbar placement entry points.
2. Inspect `ViewportOverlayRoot` and the viewport host surface for reliable bounds.
3. Decide whether bounds are passed as a ref, a callback, or a small placement context.
4. Document the anchored/manual placement state shape in the phase handoff.
5. Identify tests needed for split-view-sized bounds.

### Dispatch 5 Phase Packet

Assignment type:
- `Research`

Manager risk call:
- approval-gated before runtime implementation because this changes the shared coordinate owner for command toolbar placement
- Phase 1 should stop after locking the owner contract and implementation handoff

Code-backed research read:
- `ReferenceTransformToolbar.tsx`
  - `transformToolbarDefaultPosition` computes `left` from `window.innerWidth`
  - the focused Transform test currently expects that browser-window-derived coordinate
- `ViewerHost.tsx`
  - `extrudeToolbarDefaultPosition` computes from `window.innerWidth` and `window.innerHeight`
  - Extrude should move after the shared helper exists, because Build Path edit handoff now depends on this toolbar opening predictably
- `useViewportFloatingToolPanel.ts`
  - `getBounds` defaults to `window.innerWidth` and `window.innerHeight`
  - the hook is still the right shared behavior owner, but it needs a normal viewport-local bounds path and browser-window fallback should become exceptional
- `ViewportOverlay.tsx`
  - `overlayRootRef` is already attached to `ViewportOverlayRoot`
  - `getOverlayHostMetrics` already reads the overlay root client size and falls back to `window` only when local dimensions are unavailable
  - this helper proves the viewport overlay root is the right first coordinate owner for command toolbar placement

Recommended implementation handoff:
- Phase 2 should add pure helpers for `resolveViewportToolPanelRightAnchor` and `clampViewportToolPanelRect`
- the helper input should be viewport-local bounds, panel size, margin, and top offset
- Phase 3 should pass a viewport-local `getBounds` callback into Transform and replace its `window.innerWidth` default
- Phase 4 should migrate Extrude to the same right-anchor path
- Phase 5 should add per-viewport manual placement persistence after the anchor contract works

### Verification Shape

- read-only notes confirm no command toolbar uses browser-window width as its intended right-anchor coordinate owner
- the next implementation phase has a narrow helper boundary

### Accepted Read

- Transform and Extrude were confirmed as browser-window default placement users.
- Sketch was confirmed to already have an overlay-root host metrics helper.
- `ViewportOverlayRoot` and the Model Viewport root are accepted as the first viewport-local coordinate owners.

## [x] `VCTS - 4 / Phase 2` - `Shared Viewport Placement Helpers`

### Phase 2 Summary

#### Purpose

Create small shared placement helpers that can be tested without rendering command toolbars.

#### Owns

- viewport-local right-anchor math
- manual rect clamping inside viewport bounds
- safe fallbacks for missing bounds
- focused tests around split-view widths and small panes

#### Does Not Own

- migrating Transform
- migrating Extrude
- writing workspace persistence

### Phase 2 Implementation Spec

1. Add a small placement utility near the viewport command shell helpers.
2. Resolve right anchors from viewport bounds, panel size, margin, and top offset.
3. Clamp manual placement using viewport-local width and height.
4. Keep window bounds as a fallback path only.
5. Add focused unit tests for right anchors and remembered manual rect clamping.

### Verification Shape

- helper tests prove right anchoring uses supplied viewport bounds
- helper tests prove a remembered manual rect cannot remain hidden behind split panes after bounds shrink

### Accepted Read

- `resolveViewportFloatingToolPanelRightAnchor` resolves right anchors from supplied viewport-local bounds.
- `clampViewportFloatingToolPanelRect` clamps remembered manual placement into the current viewport bounds.
- Focused helper tests cover split-view-sized right-anchor and shrink-clamp behavior.

## [x] `VCTS - 4 / Phase 3` - `Transform Right Anchor Repair`

### Phase 3 Summary

#### Purpose

Fix the known Transform bug where anchoring right uses the browser window instead of the active Model Viewport pane.

#### Owns

- passing viewport-local bounds to Transform placement
- replacing Transform's `window.innerWidth` default position
- preserving Transform toolbar behavior
- proving right anchoring inside a split viewport

#### Does Not Own

- Extrude placement migration
- persistence
- Sketch migration

### Phase 3 Implementation Spec

1. Give `ReferenceTransformToolbar` access to Model Viewport overlay bounds.
2. Replace browser-window default positioning with the shared right-anchor helper.
3. Keep `useViewportFloatingToolPanel` as the drag/resize owner.
4. Add or update focused tests around Transform default placement with supplied bounds.
5. Verify split-view placement manually or with a browser screenshot if the app harness is available.

### Verification Shape

- Transform opens anchored to the right side of the Model Viewport pane
- Transform no longer hides behind right-side split views because of browser-window anchoring
- Transform command controls and command state remain unchanged

### Accepted Read

- `ReferenceTransformToolbar` now accepts viewport-local bounds from `ViewportOverlayRoot`.
- Transform no longer computes its default right anchor from `window.innerWidth` when viewport bounds are available.
- Manual Transform placement writes into viewport-local command-toolbar placement state.

## [x] `VCTS - 4 / Phase 4` - `Extrude Right Anchor Adoption`

### Phase 4 Summary

#### Purpose

Move Extrude toolbar spawn placement to the same viewport-local right-anchor contract.

#### Owns

- Extrude default command-toolbar placement
- Build Path `edit extrude` visual handoff placement
- parity with Transform's shared shell placement route

#### Does Not Own

- Extrude graph semantics
- Extrude command-session ownership
- Build Path context-menu behavior beyond the toolbar spawn result

### Phase 4 Implementation Spec

1. Replace Extrude's browser-window default placement with the shared viewport-local right anchor.
2. Keep Extrude's shared visual grammar from `VCTS - 3`.
3. Keep the existing-node Extrude command-session reuse path from Build Path.
4. Add focused tests for Extrude default placement where practical.
5. Verify `edit extrude` opens the toolbar in the Model Viewport without opening the graph.

### Verification Shape

- Extrude opens at the right side of the Model Viewport pane
- Build Path `edit extrude` still opens the command toolbar and does not open Spaghetti Editor
- Extrude preview, accept, cancel, and node-param controls remain unchanged

### Accepted Read

- Extrude command toolbar default placement now uses the shared viewport-local right-anchor helper.
- The toolbar refreshes after the viewport root ref becomes available, avoiding first-render browser-window placement.
- Existing Extrude session controls, selected-profile readout, preview, accept, and cancel behavior remain unchanged.

## [x] `VCTS - 4 / Phase 5` - `Per-Viewport Manual Placement Persistence`

### Phase 5 Summary

#### Purpose

Remember where users place command toolbars after they drag or resize them.

#### Owns

- per-viewport placement state shape
- per-toolbar placement keys
- manual placement writes after drag/resize
- restoring and clamping remembered placement on reopen

#### Does Not Own

- global app preferences
- cloud sync preference policy
- advanced multi-monitor placement policy

### Phase 5 Implementation Spec

1. Extend `WorkspaceViewportLocalViewState` with command-toolbar manual placement keyed by toolbar id.
2. Write manual placement only after user drag or resize.
3. Restore manual placement for Transform and Extrude when available.
4. Clamp restored placement against current viewport-local bounds.
5. Add store/layout persistence tests around placement save and restore.

### Verification Shape

- moving Transform or Extrude persists per viewport
- reopening the same toolbar in the same viewport restores the manual placement
- shrinking or splitting the viewport clamps the remembered placement into view
- moving Extrude does not move Transform unless the user moved Transform too

### Accepted Read

- `WorkspaceViewportLocalViewState` now owns `commandToolbarPlacementByKey`.
- Manual placement is keyed by command toolbar and viewport.
- Workspace persistence normalizes command-toolbar placement records on clone and hydrate.
- Focused store coverage proves toolbar placement stays per viewport and per toolbar key.

## [x] `VCTS - 4 / Phase 6` - `Sketch Route And Reset Affordance`

### Phase 6 Summary

#### Purpose

Bring Sketch and the future-toolbar recipe into the placement model without over-expanding the first repair.

#### Owns

- deciding the narrow Sketch migration path
- documenting reset-to-anchor behavior
- updating the future-toolbar setup recipe
- routing any remaining bespoke Sketch placement cleanup

#### Does Not Own

- broad Sketch session rewrite
- changing Sketch Draw or Review command semantics
- replacing all Sketch panel UI at once

### Phase 6 Implementation Spec

1. Audit which Sketch command panels can directly consume the shared placement contract.
2. Add a reset-to-right-anchor affordance if the UX is ready.
3. Update the future-toolbar recipe in the family index.
4. Route any remaining Sketch-specific placement cleanup into a follow-on phase.
5. Keep Sketch command/session behavior unchanged.

### Verification Shape

- future command panels have a clear viewport-local placement recipe
- Sketch placement cleanup is either adopted or honestly routed into follow-on work
- reset-to-anchor behavior is documented or implemented without disrupting manual placement

### Accepted Read

- Sketch remains runtime-stable in this packet.
- The future-toolbar recipe now uses viewport-local bounds, shared right-anchor helpers, and viewport-local manual placement persistence.
- Reset-to-right-anchor remains a future UX affordance instead of blocking the coordinate repair.

## Manager Acceptance

Accepted result:
- `VCTS - 4` is complete under Dispatch 5.
- Transform and Extrude no longer rely on browser-window right anchoring when viewport-local bounds are available.
- Manual drag/resize placement persists per Model Viewport and per toolbar key.
- Sketch adoption and reset-to-anchor UI remain explicitly routed follow-ons.

Verification:
- `npm.cmd test -- --run src/app/components/useViewportFloatingToolPanel.test.ts`
- `npm.cmd test -- --run src/app/components/ReferenceTransformToolbar.test.tsx -t "shared overlay|viewport-local|remembers manual"`
- `npm.cmd test -- --run src/app/workspace/useWorkspaceStore.test.ts -t "command toolbar placement|per-viewport local view"`
- `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx -t "Extrude command toolbar"`
- `npm.cmd test -- --run src/app/components/useViewportFloatingToolPanel.test.ts src/app/workspace/useWorkspaceStore.test.ts`
- `npm.cmd run build`
- Browser load smoke: `http://localhost:5173` loaded in the in-app browser; `http://127.0.0.1:5173` was blocked by the browser client.
