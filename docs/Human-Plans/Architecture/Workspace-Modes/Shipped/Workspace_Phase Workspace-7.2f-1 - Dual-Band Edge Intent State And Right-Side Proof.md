# Workspace Phase Workspace-7.2f-1 - Dual-Band Edge Intent State And Right-Side Proof

## Doc Header

### Doc History
3. 2026-03-31 16:20: Checked off `Workspace 7.2f-1` after the shipped right-edge dual-band split-preview proof, so the first `7.2f` subphase record now reads as landed history and is ready to move into `Workspace-Modes/Shipped/`
2. 2026-03-31 12:55: Tightened this `Workspace 7.2f-1` proof doc into an implementation-ready Browser-first spec by locking the explicit preview-scope state, the right-edge dual-band threshold contract, the outside-edge continuation rule, the likely helper seams, and the focused verification boundary
1. 2026-03-31 12:55: Added this first staged `Workspace 7.2f-1` proof doc so the new post-`7.2e` dual-band edge-intent family can first lock preview-scope state, right-edge band behavior, and stable outside-edge continuation before widening to all four sides

### Purpose

Use this subphase to prove the dual-band edge-intent model in the smallest safe Browser slice.

The goal is to make one edge feel intentionally controllable before the all-sides follow-through lands:
- the outer edge band should preserve the current good pane-local ghost
- the inner edge band should widen into a whole-browser ghost
- immediate outside-edge overshoot should keep that same whole-browser signal instead of falling back unpredictably

## Doc Body

### Summary

`Workspace 7.2f-1` is the first dual-band proof cut.

It should deliver:
- explicit preview scope state for `pane-local` versus `whole-browser`
- locked right-edge dual-band behavior
- stable whole-browser continuation through the immediate outside-edge overshoot zone
- no accidental fallback to a second unrelated rectangle source on that proof side

Practical read:
- the current bug is easiest to read on the right edge
- that makes `right` the smallest safe proof before the broader all-sides polish

### Locked Direction

`Workspace 7.2f-1` should be:
- a state and preview-scope clarification cut
- a right-edge proof cut
- a Browser-only drag-language refinement

`Workspace 7.2f-1` should not be:
- the full four-side follow-through
- the whole header-layering polish cut
- a nested-ghost rewrite

### Scope

This subphase covers:
- adding explicit dual-band edge-threshold constants for pane-local versus whole-browser intent
- preserving the pane-local ghost inside the `28px -> 14px` band on the right edge
- adding the whole-browser ghost inside the `14px -> 0px` band on the right edge
- extending that same whole-browser preview through the immediate outside-right-edge overshoot zone
- keeping the chosen side stable while the preview scope changes
- adding focused tests for the right-edge transition and overshoot continuity

This subphase does not cover:
- `left`, `top`, or `bottom`
- raising the whole-browser ghost above viewport headers
- changing nested split-preview semantics

### Locked Interaction Model

Use two explicit edge-intent bands on the proof side:

- `28px -> 14px from the hovered right edge`
  - show the pane-local ghost inside the hovered model viewport area
  - this means "split this pane only"

- `14px -> 0px from the hovered right edge`, and the immediate overshoot space just outside that edge
  - show the whole-browser ghost that spans the full browser-splittable area
  - this means "split the whole browser area"

Important rule:
- the user is still expressing one directional intent: `Split Right`
- the band only changes the scope of the split, not the side being chosen

Commit rule:
- releasing while the preview is in the outer band should still commit one normal right-edge pane-local split
- releasing while the preview is in the inner band or the immediate outside-right-edge overshoot should commit one normal right-edge whole-browser split
- this phase should not invent a second commit verb or a second right-side action name

### Progress Checklist

- [x] Add explicit preview-scope state for `pane-local` versus `whole-browser`
- [x] Add explicit dual-band threshold constants for the right edge
- [x] Preserve the current pane-local right-edge ghost inside the `28px -> 14px` band
- [x] Add the whole-browser right-edge ghost inside the `14px -> 0px` band
- [x] Continue that same whole-browser preview through the immediate outside-right-edge overshoot zone
- [x] Keep the chosen side stable while the preview scope changes
- [x] Add focused Browser tests for the right-edge transition and overshoot continuity

### Current Code Read

Current likely seam:
- `BrowserDockHost` currently resolves pane-local preview while the pointer still lands on a hovered pane
- once the pointer leaves that pane but remains inside overshoot space, the preview can fall back to a broader rect source
- that seam currently reads as one wrong second ghost instead of an intentional scope change

Locked code read:
- the preview helper should stop inferring scope only from whether `elementsFromPoint(...)` still returns a hovered pane
- the active right-edge band should explicitly choose the preview scope
- immediate outside-right-edge overshoot should keep using the same last-valid right-edge target instead of switching to a different accidental rect source

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2f - Dual-Band Edge Intent And Whole-Browser Split Signaling.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e-1 - Cursor-Driven Pane Split Preview Precision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e-2 - Adaptive Dual Ghost Nested Split Suggestions.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2f-1 - Question 1 - What should choose between pane-local and whole-browser preview scope?

##### Locked Answer
- explicit right-edge band depth should choose the preview scope
- whether a pane is still returned by hover hit-testing should no longer be the only source of truth

##### Why
- this turns the current accidental fallback into an intentional user control

#### [x] Workspace 7.2f-1 - Question 2 - What exact first-pass right-edge bands should this proof lock?

##### Locked Answer
- `28px -> 14px` should be the pane-local right-edge band
- `14px -> 0px` plus the immediate outside-right-edge overshoot should be the whole-browser right-edge band

##### Why
- this preserves the already-good `14px` precision feel while adding one explicit wider preparatory band above it

#### [x] Workspace 7.2f-1 - Question 3 - What should happen when the pointer crosses just outside the right edge?

##### Locked Answer
- the preview should stay on the same whole-browser right-edge scope
- it should continue using the last valid right-edge target
- it should not snap to an unrelated broader rect source

##### Why
- that unstable outside-edge fallback is the exact bug this proof cut exists to remove

#### [x] Workspace 7.2f-1 - Question 4 - What should remain out of scope for this first proof?

##### Locked Answer
- left, top, and bottom follow-through
- above-header whole-browser ghost layering
- broader nested-ghost or host-lifecycle changes

##### Why
- the smallest safe proof is one side, one surface family, and one explicit preview-scope contract

### Important Interfaces And Types To Lock

- split preview state
  - should express:
    - directional side: `right`
    - preview scope: `pane-local` or `whole-browser`
- right-edge threshold constants
  - should separately encode:
    - outer pane-local band
    - inner whole-browser band
    - immediate outside-edge overshoot continuation
- preview rect resolution
  - should use the active explicit preview scope instead of falling back implicitly when hover hit-testing changes

Important rule:
- one directional side
- two explicit preview scopes
- one stable last-valid target during immediate outside-edge continuation

### First Implementation Cut

`Workspace 7.2f-1` should land in the smallest safe sequence:

1. add explicit preview-scope state and dual-band right-edge constants in the Browser drag-preview helper
2. keep the current pane-local preview inside the `28px -> 14px` band
3. switch to an explicit whole-browser preview inside the `14px -> 0px` band
4. persist that same whole-browser preview through the immediate outside-edge overshoot zone by keeping the last valid right-edge target
5. keep the commit side stable as `right` while the preview scope changes
6. add focused tests for the right-edge transition plus overshoot continuity

Implementation boundary:
- this cut should end once the right-edge dual-band behavior feels stable and intentional without widening to all four sides yet

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2f-1` is done when:
- dragging Browser toward the right edge first shows the pane-local ghost in the `28px -> 14px` band
- dragging deeper into the right edge switches cleanly to a whole-browser ghost in the `14px -> 0px` band
- moving just outside the right edge keeps the same whole-browser ghost stable instead of snapping to a different accidental preview source
- the side remains `right` throughout the full gesture

### Verification Shape

Focused verification should cover:
- right-edge pane-local to whole-browser transition
- stable whole-browser preview during immediate outside-right-edge overshoot
- unchanged commit side while the preview scope changes
