# Browser Phase Browser-13 - Phase 2.1 - Docked Browser Width Uses The Shared Left Rail Resize Seam

## Doc Header

### Doc History
3. 2026-04-15 14:10:18: Shipped `Phase 2.1` by making the shared dock-width coupling explicit in the left-dock DOM and extending the existing AppShell resize proof so the docked Browser host plus the ParaHook Generator title/status strip both report the same shared left-rail width as the user drags the current right-edge resize seam
2. 2026-04-15 13:36:41: Tightened `Phase 2.1` into an implementation-ready slice by grounding it in the current shared `leftDockWidth` seam, the existing `.PrimaryViewportLeftDockResizeHandle` path, and the already-shipped AppShell resize proofs that confirm console anchoring and full-rail width changes, so the next pass can stay narrowly focused on Browser-specific verification and any small affordance polish
1. 2026-04-15 13:31:42: Created this standalone future Browser subphase doc to isolate the docked half of `Phase 2`, locking one Codex-sized slice around the existing shared left-dock width seam so the docked Browser and the ParaHook Generator title/status panel above it widen together from the same right-edge resize handle

### Purpose

This subphase makes the docked Browser width story explicit, testable, and safe to land by itself.

Use it to:
- keep docked Browser width on the existing shared left-rail resize seam
- prove that widening the docked Browser widens the full left rail, including the top title/status panel
- add or refine focused tests and any small dock-polish needed for clarity

## Doc Body

## [x] Browser-13 - Phase 2.1

### Summary

`Browser-13 - Phase 2.1` isolates the docked Browser half of `Phase 2`.

The key rule is simple:
- when Browser is docked on the left, the user should keep resizing from the right edge of the whole left rail
- that width change should widen both the Browser and the ParaHook Generator title/status panel above it

This should not introduce a Browser-only inner width system.

### Shipped Result

- the current shared left-rail resize seam remains the only docked Browser width control
- the left-dock status strip and docked Browser host now expose one explicit shared-width DOM signal, making the coupling visible and testable
- AppShell proof now confirms the Browser and the ParaHook Generator title/status panel widen together while the existing console-anchor resize behavior stays intact

### Owns

- docked Browser width through the shared `leftDockWidth` seam
- the visual rule that the full left rail widens together
- focused docked Browser resize verification and light polish if needed

### Does Not Own

- floating Browser resize handles
- Browser content semantics
- left-dock architecture changes beyond what is needed to keep the shared seam clear and correct

### Current Live Seams

- `src/app/workspace/useWorkspaceStore.ts`
  - `leftDockWidth` already stores the shared left-rail width
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - the title/status panel and Browser already share one `PrimaryViewportLeftDock` width
  - the shared `.PrimaryViewportLeftDockResizeHandle` already sits on the right edge of the whole rail
- `src/app/hosts/useAppShellDockController.ts`
  - `handleLeftDockResizeStart` already updates `leftDockWidth`
- `src/app/AppShell.test.tsx`
  - `lets the user resize the full left dock width from the shared vertical handle`
    already proves the whole left rail width changes through the current handle path
  - `anchors console list mode to the browser resize seam and moves it with dock resize`
    already proves console/list anchoring follows the shared dock width instead of drifting

### Implementation Direction

1. Keep the docked resize seam on the right edge of the full left rail.
2. Do not add a second Browser-only dock-width state.
3. If needed, add only small affordance polish so the seam reads as intentionally Browser-relevant while still remaining one shared rail control.
4. Add or refresh focused tests proving that the top title/status panel widens together with Browser.

### Implementation Prep

#### Current live 2.1 seams

- `src/app/hosts/useAppShellDockController.ts`
  - the resize path is already pointer-driven and already clamps through one shared dock-width contract
  - the likely implementation work here is small:
    keep the seam as-is unless Browser-specific clarity needs a minor polish
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - the title/status area and Browser are already inside the same width-owned `PrimaryViewportLeftDock`
  - this means the requested behavior is not a new layout model:
    it is mainly a proof/verification pass that the whole rail continues to widen together
- `src/app/AppShell.test.tsx`
  - current tests already cover the shared seam and console anchoring
  - the most likely missing proof is a Browser-specific assertion that the title/status panel and Browser remain width-coupled after resize

#### Locked 2.1 in-scope

- keeping docked Browser width on the current shared `leftDockWidth` seam
- proving that the Browser and the ParaHook Generator title/status panel widen together
- adding or refining Browser-specific tests around that shared-width behavior
- only small dock-polish if needed for clarity

#### Locked 2.1 out-of-scope

- floating Browser resize work
- introducing a Browser-only dock-width field
- moving the resize seam off the right edge of the full left rail
- broader left-dock redesign

#### Preferred 2.1 implementation shape

1. Leave the current shared resize controller intact.
2. Add explicit Browser-oriented assertions in AppShell coverage instead of rewriting the dock path.
3. Only if the visual affordance still feels too generic, add a very small dock-local polish pass without changing behavior.

#### Concrete implementation targets

Primary expected edits:
- `src/app/AppShell.test.tsx`
  - add or refine assertions around `.PrimaryViewportLeftDockStatus` and docked Browser width coupling after resize
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - only if a tiny DOM/class signal is needed to make the shared rail easier to assert against

Supporting edits if needed:
- `src/app/theme/shell/docks.css`
  - only for very small seam-polish if the resize edge needs clearer visibility
- `src/app/hosts/useAppShellDockController.ts`
  - only if the Browser-specific proof exposes a small seam ownership issue

### Concrete Implementation Targets

Primary expected targets:
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/AppShell.test.tsx`

Supporting targets if needed:
- `src/app/theme/shell/docks.css`
- `src/app/workspace/useWorkspaceStore.ts`

### Tests

- dragging the left-dock right-edge resize seam updates `leftDockWidth`
- the docked Browser widens with that shared width
- the ParaHook Generator title/status panel above Browser widens with that same shared width
- console/list anchoring and left-dock split behavior still respect the new width

### Assumptions

- the docked half is already mostly implemented through the shared left-dock seam
- the main value of this subphase is making the Browser-owned requirement explicit and fully verified
