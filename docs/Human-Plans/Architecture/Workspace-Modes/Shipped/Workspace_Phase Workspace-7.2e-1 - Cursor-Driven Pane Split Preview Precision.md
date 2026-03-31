# Workspace Phase Workspace-7.2e-1 - Cursor-Driven Pane Split Preview Precision

## Doc Header

### Doc History
2. 2026-03-31 16:20: Checked off `Workspace 7.2e-1` after the shipped cursor-driven pane-local split-preview precision work, so the first `7.2e` subphase record now reads as landed history and is ready to move into `Workspace-Modes/Shipped/`
1. 2026-03-31 11:18: Added this native `Workspace 7.2e-1` subphase doc to isolate the first split-preview cleanup cut around making the existing `left` / `right` / `top` / `bottom` ghost choice follow cursor position inside the hovered pane instead of the dragged window edge

### Purpose

Use this subphase to make the current four-way split preview feel precise and local to the pane under the pointer.

The goal is to remove the current imprecision where split targeting can feel anchored to the dragged Browser frame or a coarse outer viewport edge instead of the cursor location inside the hovered pane.

## Doc Body

### Summary

`Workspace 7.2e-1` is the cursor-driven pane split-preview precision cut.

It should deliver:
- existing `left` / `right` / `top` / `bottom` split-preview choice driven by cursor position inside the hovered pane
- a fix for the current top-edge friction where the user can feel forced toward the wrong top boundary
- a reusable hovered-pane preview helper that Browser can prove first and the other floating host can reuse

Practical read:
- this is the smallest visible `7.2e` cut
- it does not add new dual ghost choices yet
- it makes the existing four split directions behave correctly first

### Locked Direction

`Workspace 7.2e-1` should be:
- a precision cleanup cut
- a hovered-pane targeting cut
- a Browser-first split-preview correction

`Workspace 7.2e-1` should not be:
- the adaptive dual-ghost nested-split phase
- a broad visual redesign of the ghost
- a `Workspace 7.3` multi-viewport widening cut

### Scope

This subphase covers:
- identifying the hovered candidate pane instead of relying on only the full viewport rectangle or dragged window edge
- resolving the existing split-preview side from cursor position inside that pane
- fixing top-edge targeting so `Split Top` keys off the hovered pane
- proving left, right, top, and bottom selection stays stable and predictable as the cursor moves across the hovered pane
- adding focused tests for cursor-driven split-preview choice

This subphase does not cover:
- adaptive dual-ghost suggestions for nested splits
- aspect-ratio-aware left/right versus top/bottom nested suggestions
- multiple-model-viewport support

### Progress Checklist

Current progress read:
- `7.2e-1` is now shipped as the first pane-local split-preview precision cut
- the existing four-way split ghost now resolves from cursor position inside the hovered pane
- `7.2e-2` became the follow-on lane after this first seam landed

- [x] Resolve the hovered candidate pane during floating drag preview
- [x] Drive existing `left` / `right` / `top` / `bottom` preview selection from cursor position inside that pane
- [x] Fix top-edge targeting against the hovered pane instead of the dragged Browser frame
- [x] Prove preview side selection remains precise as the cursor moves across the pane
- [x] Mirror the hovered-pane preview helper into the other floating host that still uses the old edge-threshold pattern
- [x] Add focused tests for cursor-driven pane-local split-preview selection

### Locked Outcome

At the end of `7.2e-1`:
- the current four-way split preview feels precise
- Browser can be placed top, right, bottom, or left based on where the cursor is inside the hovered pane
- the later `7.2e-2` dual-ghost nested-split work can build on one reliable pane-local preview seam

### Current Code Read

Current shipped seam:
- Browser and Spaghetti still derive split preview from one edge-threshold read against one rectangle
- the first four-way split choice can still feel more like a dragged-window-edge guess than a cursor-driven pane-local decision

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2e-1 - Question 1 - What is the exact job of this first subphase?

##### Locked Answer
- make the existing four-way split preview cursor-driven and pane-local
- stop before adding new nested ghost choices

##### Why
- the current precision problem is already visible and painful without any richer nested authoring
- the first fix should stay small and testable

#### [x] Workspace 7.2e-1 - Question 2 - What should decide `left`, `right`, `top`, or `bottom`?

##### Locked Answer
- cursor position inside the hovered candidate pane
- not the dragged window edge and not only the outer viewport rectangle

##### Why
- that is the cleanest way to make split targeting feel precise

#### [x] Workspace 7.2e-1 - Question 3 - What is the Browser-first proof?

##### Locked Answer
- floating Browser drag preview should prove the new pane-local preview rule first
- then the same helper seam should be mirrored into the other floating host that still uses the old pattern

##### Why
- Browser is the current user-facing pain point
- the helper should still be shaped for reuse

### Important Interfaces And Types To Lock

- split preview resolution helper
  - should resolve preview side from cursor position inside a candidate pane rectangle
- split preview state
  - can remain one active side in this first subphase

Important rule:
- improve the precision of the current ghost first
- do not widen into dual-ghost state yet

### First Implementation Cut

`Workspace 7.2e-1` should land in the smallest safe sequence:

1. identify the hovered candidate pane rectangle during floating drag
2. resolve existing split-preview side from cursor position inside that pane
3. fix `Split Top` targeting against the pane-local top boundary
4. prove the same pane-local helper works across the current four preview directions
5. mirror the helper into the other floating host that still uses the older edge-threshold preview path
6. add focused tests for cursor-driven pane-local split-preview behavior

Implementation boundary:
- `7.2e-1` should end once the current four-way split-preview choice feels precise and pane-local
- `7.2e-2` should begin where new adaptive dual-ghost nested split suggestions start

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2e-1` is done when:
- the current `left` / `right` / `top` / `bottom` split preview follows cursor position inside the hovered pane
- Browser top-split targeting no longer feels like it depends on the dragged window edge
- the same pane-local preview helper can support the other floating host
- the later adaptive nested dual-ghost work can build on this seam without undoing it

### Verification Shape

Focused verification should cover:
- Browser split-preview side follows cursor position inside the hovered pane
- Browser top-split targeting resolves against the hovered pane
- the same pane-local helper can support the other floating host that still uses the old preview seam

Recommended manual checks:
- drag a floating Browser slowly across one hovered pane and confirm the active `left` / `right` / `top` / `bottom` preview changes when the cursor crosses the pane's local targeting regions
- split the viewport horizontally, drag Browser over the top pane, and confirm `Split Top` can be targeted from that pane's own top region without chasing the Browser frame
