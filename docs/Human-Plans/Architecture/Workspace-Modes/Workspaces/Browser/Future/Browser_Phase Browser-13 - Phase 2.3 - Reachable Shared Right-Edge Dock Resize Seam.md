# Browser Phase Browser-13 - Phase 2.3 - Reachable Shared Right-Edge Dock Resize Seam

## Doc Header

### Doc History
3. 2026-04-15 15:10: Removed the old painted seam line and visible `[]` split-toggle button from the dock edge after `2.3` landed, keeping the shared resize seam itself intact while leaving the split action available through the existing resize-handle context menu
2. 2026-04-15 15:02: Moved the shared docked resize handle out of the inner Browser panel-stack shell and onto the full left-dock content edge, so the real user-facing seam now sits on the visible shared right edge the user expects while preserving the existing `leftDockWidth` controller and focused dock-resize proof
1. 2026-04-15 15:00: Added this standalone Browser follow-up after read-only investigation showed the docked shared-width resize controller still exists but the real hit target likely sits inside the wrong left-dock sub-container and may be clipped by overflow, so the next pass must make the user-facing resize seam reachable on the visible shared right edge of the docked Browser / left rail

### Purpose

This subphase fixes the docked Browser resize seam so users can actually grab it in the running app.

Use it to:
- make the docked Browser resize seam reachable from the visible right edge the user expects
- keep that seam attached to the whole left rail so Browser and the ParaHook Generator title/status panel still widen together
- preserve the existing shared `leftDockWidth` contract instead of inventing a Browser-only dock width

## Doc Body

## [x] Browser-13 - Phase 2.3

### Summary

`Browser-13 - Phase 2.3` is a docked resize follow-up to `2.1`.

`2.1` proved that the shared left-dock width state and resize controller work.

The remaining bug is user reachability:
- the user expects to drag the visible right edge of the docked Browser panel
- because Browser and the ParaHook Generator title/status panel share one width, that same gesture should resize the whole left rail
- today the actual resize handle likely lives too low inside the Browser stack shell and may be clipped by the left-dock overflow chain, so the seam is hard or impossible to grab in the live UI even though tests can still dispatch directly to it

### Shipped Result

- the shared docked resize handle now belongs to the full `PrimaryViewportLeftDockContent` edge instead of the inner Browser panel-stack shell
- the visible right edge users point at on the docked Browser / shared left rail is now the real resize seam
- the existing shared `leftDockWidth` controller remains the only docked width owner
- focused tests now prove the handle lives on the shared dock-content edge while the existing dock-resize and console-anchor proofs stay green
- the old painted vertical seam line and visible `[]` split-toggle chrome are removed from the live dock edge, while the split action remains available from the seam context menu

### Owns

- the real user-facing hit target for docked Browser / left-rail resizing
- correct placement of the shared right-edge resize seam
- keeping the seam reachable without breaking the existing shared `leftDockWidth` path
- focused proof that the seam is attached to the visible right edge users are expected to drag

### Does Not Own

- floating Browser resize behavior
- Browser content/body overflow behavior
- a new Browser-only dock-width state
- broader left-dock redesign outside what is needed to expose the seam correctly

### Current Live Problem

- `src/app/hosts/useAppShellDockController.ts`
  - the pointer-driven shared left-dock resize controller still exists and still writes `leftDockWidth`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - the resize handle currently renders inside the panel-stack shell instead of clearly owning the full visible shared rail edge
- `src/app/theme/shell/docks.css`
  - the current handle placement uses an outboard offset and sits under an overflow-hidden dock chain, which likely makes the real hit target clipped or visually dishonest
- `src/app/AppShell.test.tsx`
  - current proof dispatches directly to `.PrimaryViewportLeftDockResizeHandle`, so it verifies controller plumbing but not whether a user can actually reach the seam where it is rendered

### Locked Direction

- keep the docked resize seam on the visible right edge the user points at on the Browser panel
- because Browser and the ParaHook Generator title/status panel share one width, that seam still belongs to the whole left rail, not to a Browser-only inner width system
- prefer moving/restructuring the handle over widening test-only proof or adding Browser-specific width state
- fix the hit target at the DOM/CSS seam instead of inventing JS measurement or alternate hidden controls

### Implementation Direction

1. Re-home or restyle the shared resize handle so it belongs to the full visible right edge of the left rail.
2. Remove the current clipped/outboard geometry that likely places the handle outside an overflow-hidden container.
3. Keep the existing `useAppShellDockController` pointer/update logic unless the live bug proves that controller ownership must move.
4. Add focused proof that the handle geometry is reachable from the visible shared right edge rather than only by direct DOM dispatch.

### Concrete Implementation Targets

Primary expected targets:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/AppShell.test.tsx`

Supporting targets if needed:
- `src/app/workspace/WorkspaceViewportTree.tsx`

### Tests

- users can resize the docked Browser by grabbing the visible right edge of the Browser / shared left rail
- resizing still widens the ParaHook Generator title/status panel above Browser at the same time
- the shared `leftDockWidth` contract remains the only docked width owner
- console anchoring and left-dock split behavior still respect the resized width

### Verification

- passed `npm.cmd test -- PrimaryViewportLeftDock.test.tsx`
- passed `npm.cmd test -- AppShell.test.tsx -t "lets the user resize the full left dock width from the shared vertical handle"`
- passed `npm.cmd test -- AppShell.test.tsx -t "anchors console list mode to the browser resize seam and moves it with dock resize"`

### Assumptions

- the failure is likely seam placement / clipping, not missing resize controller logic
- the correct user experience is one continuous shared right-edge seam for the whole left rail, felt from the Browser panel edge the user is pointing at
