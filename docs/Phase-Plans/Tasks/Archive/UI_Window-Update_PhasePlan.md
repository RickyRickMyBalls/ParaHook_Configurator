# Phase Plan - UI-3 Spaghetti Editor Window Update

Purpose:

This phase fixes the current Spaghetti window/splitter bugs and introduces a real window-mode system for the Spaghetti Editor.

This is not a compile/runtime/viewer phase.

It is a windowing, layout, and interaction phase.

The goal is to make the Spaghetti Editor feel intentional and predictable as a tool window.

## Problems To Fix

### Bug 1 - Spaghetti Editor toolbar drag bar cannot move high enough

Observed issue:
- The existing Spaghetti Editor drag bar stops early.
- There is likely a min-height or layout clamp blocking the bar from moving higher than intended.

Likely cause:
- A min-height, max-height, or flex constraint is being applied somewhere in the panel stack.
- The current resize logic may be clamping against the wrong region or the wrong available height.

### Bug 2 - Spaghetti Editor toolbar drag bar should sit directly above the canvas

Observed issue:
- The drag bar is not visually aligned with the actual canvas boundary.
- Some controls may still be inside the wrong layout region.

Desired behavior:
- The drag bar should represent the boundary between:
  - upper toolbar/header content
  - lower canvas/editor content

This may require moving controls out of the canvas-owned region.

### Bug 3 - Debug Inspector drag bar gets stuck

Observed issue:
- The debug drawer resize bar can become blocked or stop moving as expected.

Likely cause:
- The canvas min-height is still constraining available space in a way that prevents the debug drawer from taking more height.
- The debug drawer and canvas may be competing for space without one shared layout rule.

## New Feature Goal

### Spaghetti Editor window modes

The Spaghetti Editor should support four window modes:

1. Toolbar
2. Half Screen
3. Full Screen
4. New Browser Window

This is not just a visual change.

It needs a clean ownership model so the app does not grow multiple conflicting resize systems.

## Recommended Architecture

The key rule should be:

Outer window mode is owned by `AppShell`.
Inner panel splits are owned by `SpaghettiPanel`.

That means:

- `AppShell` owns:
  - floating window position
  - floating window width/height
  - preset window modes
  - browser-window launching

- `SpaghettiPanel` owns:
  - header vs canvas split
  - canvas vs debug split
  - panel-local resize bars

This keeps responsibilities clean.

Do not make `SpaghettiPanel` decide global floating-window presets.
Do not make `AppShell` decide panel-internal split behavior.

## Window Mode Definitions

### Toolbar Mode

Purpose:
- compact utility/editor mode

Requirements:
- width should match the ParaHook Generator title block region on the top left
- current repo value suggests this should be aligned to the left dock width
- target width should likely be `320px` unless changed intentionally everywhere

Expected behavior:
- narrow floating window
- still usable
- good for quick edits and monitoring

### Half Screen Mode

Purpose:
- medium working mode

Requirements:
- occupy roughly half of the usable viewport area
- preserve viewport visibility
- preserve safe padding from window edges

Expected behavior:
- enough space for graph editing
- still leaves significant viewer area visible

### Full Screen Mode

Purpose:
- primary editing mode

Requirements:
- maximize the Spaghetti window within the app viewport
- preserve existing safe insets/padding
- do not overlap in a way that breaks other critical overlays unless that is intentional

Expected behavior:
- editor becomes the dominant tool surface
- still remains an in-app window, not a browser popup

### New Browser Window Mode

Purpose:
- separate Spaghetti editing into its own browser window

Recommendation:
- this should be implemented as a dedicated popup/window mode from `AppShell`
- use a dedicated route/query flag or dedicated shell mode for the spawned window
- do not treat it as just a larger floating div

Important note:
- browser-window mode is a larger architectural step than the other three modes
- it may require state sync decisions between the main window and popup window

## Recommended Control Model

There should be 3 controls at the top right of the Spaghetti window:

1. Browser Window button
   - always visible
   - opens the editor in a new browser window

2. In-app mode button A
3. In-app mode button B

Recommended behavior:

- The browser button is always present.
- The other two buttons show the two in-app modes that are not the current one.

Examples:

- If current mode is Toolbar:
  - show Half Screen
  - show Full Screen

- If current mode is Half Screen:
  - show Toolbar
  - show Full Screen

- If current mode is Full Screen:
  - show Toolbar
  - show Half Screen

This keeps the controls compact and avoids showing a button for the already-active mode.

## Layout Ownership Rules

The panel should be treated as 3 vertical regions:

1. Header / toolbar region
2. Canvas region
3. Debug region

Each boundary should have one clear resize rule:

- Header <-> Canvas boundary
  - controlled by the existing upper drag bar

- Canvas <-> Debug boundary
  - controlled by the debug drag bar

The most important requirement is:

Both resize bars must operate against one shared set of panel height rules.

If each section clamps independently without shared accounting, the bars will keep getting stuck.

## Implementation Strategy

### UI-3A - Split constraint audit

Goal:
- identify every min-height/max-height/flex rule affecting:
  - Spaghetti floating window
  - panel header region
  - canvas wrap
  - debug drawer

Definition of done:
- all relevant constraints are explicitly documented
- no hidden layout blockers remain

### UI-3B - Header/canvas boundary cleanup

Goal:
- move the toolbar drag bar so it sits directly above the canvas region
- ensure controls above it belong to the header/toolbar region, not the canvas region

Definition of done:
- drag bar visually matches the actual region boundary
- moving the bar resizes the correct section

### UI-3C - Debug drawer resize fix

Goal:
- fix the debug drawer resize behavior so it no longer gets stuck

Definition of done:
- debug drawer can claim more height when available
- canvas min-height remains respected
- resize interactions feel stable in repeated use

### UI-3D - In-app window mode system

Goal:
- add `toolbar`, `half`, and `full` preset modes for the floating Spaghetti window

Recommendation:
- introduce one canonical mode state in `AppShell`
- translate each mode into deterministic size/position presets
- keep manual drag/resize behavior compatible with presets

Definition of done:
- mode transitions are deterministic
- each mode has stable preset geometry
- controls live on the window header

### UI-3E - Browser window mode

Goal:
- allow the Spaghetti Editor to open in a separate browser window

Recommendation:
- treat this as a separate sub-phase because it is architecturally larger than the in-app modes
- decide upfront whether it is:
  - a cloned shell with synchronized state
  - or a dedicated editor window with explicit data handoff

Definition of done:
- new browser window opens consistently
- main app behavior remains stable
- editor behavior is still understandable to the user

## Non-Goals

This phase should not:
- change compile behavior
- change worker behavior
- change viewer behavior
- change graph semantics
- change OutputPreview semantics
- introduce unrelated Spaghetti node/UI refactors

## Files Likely Involved

Primary likely files:

- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`

Possible supporting files:

- state files if a canonical Spaghetti window mode state is introduced
- any browser-window integration helper if popup mode is added

## Verification Philosophy

This phase should be verified with:

- build passing
- manual drag verification for both resize bars
- manual verification that the toolbar drag bar can move fully to intended limits
- manual verification that the drag bar sits directly above the canvas
- manual verification that debug resize no longer gets stuck
- manual verification of Toolbar / Half / Full mode transitions
- manual verification that the Browser Window button is always available

## Recommended Order

Recommended order of work:

1. Fix the split-constraint bugs first
2. Fix drag-bar placement second
3. Add in-app window modes third
4. Add browser-window mode last

Reason:

The window mode system should be built on top of stable split behavior, not while the panel still has layout bugs.

## Proposed Next Task Files

Recommended future task breakdown:

- `UI-3A.md` - Split Constraint Audit
- `UI-3B.md` - Toolbar Drag Bar Boundary Cleanup
- `UI-3C.md` - Debug Drawer Resize Stability
- `UI-3D.md` - Spaghetti Floating Window Preset Modes
- `UI-3E.md` - Spaghetti Browser Window Mode

## Plain-English Summary

This phase is about making the Spaghetti Editor behave like a real tool window instead of a partially-grown floating panel.

First, the resize bars need to obey one clean layout model.

Then, the editor needs proper size presets:
- Toolbar
- Half Screen
- Full Screen

Finally, it can grow into a real separate browser-window mode.
