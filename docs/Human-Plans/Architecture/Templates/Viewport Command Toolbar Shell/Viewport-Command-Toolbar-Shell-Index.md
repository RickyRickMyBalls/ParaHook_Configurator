# Viewport Command Toolbar Shell Index

## Doc Header

### Doc History
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
- `Shipped/`
  - later shipped command-toolbar shell phase records

### Family Phase Ladder

## [ ] `VCTS - 1` - `Shared Command Panel Prep`

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
