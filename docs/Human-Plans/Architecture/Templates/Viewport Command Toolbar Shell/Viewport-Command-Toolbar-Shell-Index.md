# Viewport Command Toolbar Shell Index

## Doc Header

### Doc History
8. 2026-05-26 06:32:45: Marked `VCTS - 4 - Viewport-Local Toolbar Placement And Persistence` accepted after shared viewport-local right-anchor helpers, Transform and Extrude placement migration, per-viewport manual placement persistence, focused verification, production build proof, and Sketch/reset follow-on routing.
7. 2026-05-26 06:13:29: Added `VCTS - 4 - Viewport-Local Toolbar Placement And Persistence` as the next shared-shell phase for repairing Transform browser-window right anchoring, moving Extrude onto the same viewport-local anchor model, and planning remembered manual placement per Model Viewport.
6. 2026-05-25 20:03:04: Marked `VCTS - 3 - Command Panel Visual Structure Extraction` accepted after adding shared command-panel body, section, status/readback, control stack, and title action pieces and migrating Extrude onto the shared visual grammar.
5. 2026-05-25 19:51:44: Added `VCTS - 3 - Command Panel Visual Structure Extraction` as the next shared-shell phase for making the template own command-panel body rhythm, section framing, title actions, status/readback rows, and control grouping after `VCTS - 2` unified floating behavior.
4. 2026-05-25 19:32:34: Marked `VCTS - 2 - Floating Panel Behavior Unification` accepted after Extrude and Transform moved onto the shared floating-panel helper, with Sketch routed as the remaining follow-on cleanup lane and a future-toolbar setup recipe locked.
3. 2026-05-25 16:48:47: Added `VCTS - 2 - Floating Panel Behavior Unification` as the next shared-shell phase for extracting drag, resize, placement, bounds, and future-toolbar setup behavior after `Extrude-9` proved Extrude can consume the shared panel shell visually.
2. 2026-05-25 15:07:48: Marked `VCTS - 1 - Shared Command Panel Prep` accepted after the Dispatch 5 manager loop completed the shell-owner read, Extrude shell prep contract, and post-Extrude cleanup route without changing runtime code.
1. 2026-05-25 14:47:06: Created this dedicated Templates family for the in-viewport command-toolbar shell shared by Sketch, Transform, and Extrude, separating that command panel/chrome direction from the `Floating Window Shell` family that should remain about detached or floating app windows such as a floated Model Viewport.

### Purpose

This file is the umbrella planning index for the `Viewport Command Toolbar Shell` family under `Architecture/Templates/`.

Use it to answer:
- what the shared in-viewport command toolbar shell should own
- how Sketch, Transform, and Extrude command panels should converge without merging feature behavior
- where the Extrude toolbar shell prep phase lives
- why this family is separate from the floating app-window shell

### Scope

This family covers:
- active command toolbar chrome inside the Model Viewport
- title/action/body slot conventions for command panels
- shared panel shell use around `ViewportOverlayToolPanel`
- shared drag, resize, placement, bounds, and future-toolbar setup behavior for in-viewport command panels
- viewport-local anchor placement and remembered manual placement for in-viewport command panels
- command toolbar section layout, density, and action placement
- shell prep for Extrude's ParaSlider and ParaSelect-backed toolbar

This family does not cover:
- detached/floating Model Viewport windows
- app-level floating window drag/resize/dock behavior
- workspace host modes
- feature-specific command state, graph writes, preview, or history behavior

## Doc Body

### Short Version

Sketch, Transform, and Extrude should converge on one in-viewport command-toolbar shell direction.

Current read:
- Transform already uses `ViewportOverlayToolPanel` through `ReferenceTransformToolbar`
- Sketch uses the same overlay-panel direction in `ViewportOverlay`, but still carries sketch-specific session and placement code
- Extrude still has a bespoke readout strip in `ViewerHost`

The first real prep step is `VCTS - 1`, which should lock the shared shell/body contract before `Extrude-9` replaces the Extrude strip with node-backed ParaSlider and ParaSelect controls.

### Boundary With Floating Window Shell

`Floating Window Shell` should stay about detached or floating app-window surfaces:
- floated Model Viewport
- dashboard/notepad floating hosts
- draggable/resizable app-window chrome
- docking and clamp behavior for windows

`Viewport Command Toolbar Shell` should own in-viewport command panels:
- Sketch command panels
- Transform command panels
- Extrude active command toolbar
- command title/actions/body layout inside the viewport

Important rule:
- do not route in-viewport command toolbar work through `Floating Window Shell` just because both are "shell" topics

### Family Structure

Use this folder like this:

- `Viewport-Command-Toolbar-Shell-Index.md`
  - umbrella direction for in-viewport command toolbar shell ownership
- `Future/`
  - standalone future phase docs
  - `Viewport_Command_Toolbar_Shell_Phase VCTS - 1 - Shared Command Panel Prep.md`
  - `Viewport_Command_Toolbar_Shell_Phase VCTS - 2 - Floating Panel Behavior Unification.md`
  - `Viewport_Command_Toolbar_Shell_Phase VCTS - 3 - Command Panel Visual Structure Extraction.md`
  - `Viewport_Command_Toolbar_Shell_Phase VCTS - 4 - Viewport-Local Toolbar Placement And Persistence.md`
- `Shipped/`
  - later shipped command-toolbar shell phase records

### Family Phase Ladder

## [x] `VCTS - 1` - `Shared Command Panel Prep`

Goal:
- prep one shared in-viewport command-toolbar shell contract before Extrude moves onto richer node-backed controls

Why it exists:
- Sketch and Transform are visually related but not fully unified
- Extrude currently has a one-off `ViewerHost` command strip
- `Extrude-9` should consume a shared shell direction instead of creating another custom toolbar shell

Standalone future doc:
- [Viewport_Command_Toolbar_Shell_Phase VCTS - 1 - Shared Command Panel Prep](./Future/Viewport_Command_Toolbar_Shell_Phase%20VCTS%20-%201%20-%20Shared%20Command%20Panel%20Prep.md)

Current read:
- `ViewportOverlayToolPanel` is the first shared shell target
- `ViewerHost` may host Extrude's active command panel first
- feature toolbar bodies, command state, graph writes, preview, and history stay with their owning feature families

Accepted read:
- `VCTS - 1` is complete as a prep phase.
- Extrude implementation should move next through `Extrude-9`.
- any deeper Sketch/Transform shell cleanup should wait until Extrude proves the shared command-panel pattern in code.

## [x] `VCTS - 2` - `Floating Panel Behavior Unification`

Goal:
- make draggable/resizable in-viewport command panel behavior reusable so Extrude and future command toolbars do not copy Transform or Sketch drag/resize math

Why it exists:
- `Extrude-9` moved Extrude onto `ViewportOverlayToolPanel` visually but left the toolbar fixed
- Transform has mature drag/resize behavior, but the math is local to `ReferenceTransformToolbar`
- Sketch has similar behavior, but some of it is custom in `ViewportOverlay`
- new viewport command toolbars need a ready shell behavior path

Standalone future doc:
- [Viewport_Command_Toolbar_Shell_Phase VCTS - 2 - Floating Panel Behavior Unification](./Future/Viewport_Command_Toolbar_Shell_Phase%20VCTS%20-%202%20-%20Floating%20Panel%20Behavior%20Unification.md)

Planned phase read:
- Phase 1 audits current owner seams and locks the helper boundary
- Phase 2 extracts the shared floating-panel behavior helper
- Phase 3 migrates Extrude and enables drag plus all-edge/corner resize
- Phase 4 migrates Transform after Extrude proves parity
- Phase 5 routes Sketch shell cleanup without forcing a risky rewrite
- Phase 6 documents the future-toolbar setup recipe

Accepted read:
- `useViewportFloatingToolPanel` is the shared in-viewport command-panel behavior owner for placement, title-bar drag, all-edge/corner resize, bounds clamping, min sizing, and auto/manual height.
- Extrude now uses the shared helper through its active `ViewportOverlayToolPanel` command toolbar.
- Transform now uses the shared helper instead of local drag/resize math.
- Sketch remains runtime-stable in this packet; its remaining bespoke movement/sizing math should move through a narrower follow-on cleanup pass.

Future toolbar setup recipe:
- render `ViewportOverlayToolPanel` for the command shell
- call `useViewportFloatingToolPanel` near the toolbar body component
- pass the returned `panelRef`, `style`, `onTitleBarPointerDown`, `onTitleBarMouseDown`, and `onResizeHandlePointerDown`
- choose feature-owned `defaultSize`, `minSize`, and `defaultPosition`
- keep command-specific controls, graph writes, preview, accept/cancel, and history outside the shared behavior helper

## [x] `VCTS - 3` - `Command Panel Visual Structure Extraction`

Goal:
- make the viewport command-toolbar template shell define more of the visible panel grammar so Extrude, Sketch, Transform, and later command panels read as one family

Why it exists:
- `VCTS - 2` unified floating behavior, but Extrude's inner body still looks like a custom dashboard
- Transform and Sketch already have stronger section, status, action, and control grouping grammar
- new command toolbars need shared visual building blocks, not copied feature-specific CSS

Standalone future doc:
- [Viewport_Command_Toolbar_Shell_Phase VCTS - 3 - Command Panel Visual Structure Extraction](./Future/Viewport_Command_Toolbar_Shell_Phase%20VCTS%20-%203%20-%20Command%20Panel%20Visual%20Structure%20Extraction.md)

Planned phase read:
- Phase 1 audits Sketch, Transform, and Extrude visual grammar and locks the extraction boundary
- Phase 2 adds shared command-panel body, section, status, title-action, and control grouping pieces
- Phase 3 migrates Extrude to the shared visual grammar while preserving `Extrude-9` and `VCTS - 2` behavior
- Phase 4 documents the future-toolbar visual recipe and routes any remaining Transform/Sketch cleanup honestly

Accepted read:
- `ViewportOverlayToolPanel` remains the outer visual shell.
- `useViewportFloatingToolPanel` remains the shared floating behavior owner.
- `ViewportCommandPanelBody`, `ViewportCommandPanelSection`, `ViewportCommandPanelStatusRow`, `ViewportCommandPanelReadout`, `ViewportCommandPanelControlStack`, and `ViewportCommandPanelTitleButton` now define the first shared command-panel visual grammar layer.
- Extrude now consumes the shared visual grammar for command sections, readbacks, control grouping, and OK/Cancel title actions.
- Transform and Sketch are compatible skins for now; they can migrate selectively later without blocking the template path.

Future toolbar visual recipe:
- render `ViewportOverlayToolPanel`
- wire `useViewportFloatingToolPanel`
- use `ViewportCommandPanelBody` for the panel body
- group command content in `ViewportCommandPanelSection`
- put summary/readback facts in `ViewportCommandPanelStatusRow` and `ViewportCommandPanelReadout`
- group controls with `ViewportCommandPanelControlStack`
- use `ViewportCommandPanelTitleButton` for title actions
- keep command-specific state, graph writes, preview, accept/cancel, and history in the feature family

## [x] `VCTS - 4` - `Viewport-Local Toolbar Placement And Persistence`

Goal:
- make shared viewport command toolbars anchor to the active Model Viewport pane, remember user placement, and stop treating the browser window as the normal placement coordinate owner

Why it exists:
- Transform currently computes right-anchor placement from `window.innerWidth`, so split views can hide the toolbar behind panes outside the Model Viewport
- `useViewportFloatingToolPanel` unified drag/resize behavior, but its default bounds fallback is still browser-window based
- Extrude is now on the shared command-panel shell and should spawn from the same viewport-local placement model
- users expect a toolbar they manually moved to reopen where they last placed it in that viewport

Standalone future doc:
- [Viewport_Command_Toolbar_Shell_Phase VCTS - 4 - Viewport-Local Toolbar Placement And Persistence](./Future/Viewport_Command_Toolbar_Shell_Phase%20VCTS%20-%204%20-%20Viewport-Local%20Toolbar%20Placement%20And%20Persistence.md)

Planned phase read:
- Phase 1 audits current coordinate owners and locks the viewport overlay root as the normal placement bounds source
- Phase 2 adds shared right-anchor and manual-clamp helpers for viewport-local panel placement
- Phase 3 repairs Transform so right anchoring lands inside the active Model Viewport pane
- Phase 4 moves Extrude toolbar spawn placement onto the same viewport-local right-anchor route
- Phase 5 persists manual drag/resize placement per viewport and per toolbar key
- Phase 6 routes Sketch adoption and reset-to-right-anchor affordance without forcing a broad Sketch rewrite

Future toolbar placement recipe:
- render `ViewportOverlayToolPanel`
- wire `useViewportFloatingToolPanel`
- pass viewport-local bounds from the Model Viewport overlay root
- use shared placement helpers for default right anchors and manual placement clamping
- persist user-driven manual placement in viewport-local view state when the user drags or resizes
- keep command-specific state, graph writes, preview, accept/cancel, and history in the feature family

Accepted read:
- `useViewportFloatingToolPanel` now exposes shared viewport-local right-anchor and manual-rect clamp helpers.
- Transform consumes `ViewportOverlayRoot` bounds for right-anchor placement and writes manual placement into viewport-local state.
- Extrude consumes Model Viewport root bounds for right-anchor placement and writes manual placement into viewport-local state.
- `WorkspaceViewportLocalViewState.commandToolbarPlacementByKey` stores command toolbar placement per viewport and per toolbar key.
- Workspace persistence normalizes command-toolbar placement on clone and hydrate.
- Sketch remains a routed follow-on for adoption after Transform and Extrude prove the placement API.
- Reset-to-right-anchor remains a later UX affordance.
