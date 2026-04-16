# Viewport HUD Phase Viewport-HUD 1 - Docking And Resizing

## Doc Header

### Doc History
2. 2026-04-15 07:26:44: Updated this phase doc to narrow the first `Viewport-HUD 1` implementation lane around exactly two dock targets, `gizmo-left` and `under-view-toolbar`, to define dragging as the gesture for switching between those placements, and to keep the phase explicitly out of generic free-floating or all-edge docking
1. 2026-04-15 00:46:11: Added this standalone future phase doc for `Viewport-HUD 1`, turning the new `Viewport-HUD` family into one implementation-ready forward lane focused on viewport-local HUD docking, anchoring, and resizing behavior while keeping geometry, fly, and worker truth with their current owners

### Purpose

This doc locks the first `Viewport-HUD` phase.

Use it to answer:
- what the first viewport-HUD phase should own
- how HUD docking and resizing should start
- which visible HUD layout problems belong in this family instead of in nearby viewport or toolbar docs
- how the first HUD pass should stay scoped to presentation behavior instead of runtime semantics

### Why This Phase Exists

The repo already has a real viewport-local HUD surface in `ViewportOverlay.tsx`.

That means the next honest HUD-related work does not need to start by inventing the surface itself.

There is already a narrower visible lane around:
- where the HUD should dock in the viewport
- how it should anchor against nearby viewport chrome
- whether and how it should resize
- how that small overlay panel should stay legible as the viewport shell changes

This phase exists to give those presentation concerns one explicit first planning home.

### Scope

This phase covers:
- viewport-local HUD docking direction for `gizmo-left` and `under-view-toolbar`
- viewport-local HUD anchor math and placement rules
- HUD resizing behavior
- visible presentation cleanup needed to support docking and resizing
- the first drag gesture that switches the HUD between those two dock targets

This phase does not cover:
- geometry execution truth
- worker/result-state semantics
- fly runtime behavior
- toolbar command regrouping
- free-floating generic window behavior
- full edge-docking around the viewport

## Doc Body

## [ ] `Viewport-HUD 1` - `Docking And Resizing`

### Header

Purpose:
- make the viewport-local HUD feel intentionally placed and resizable through one small two-position dock model instead of behaving like a fixed incidental overlay block

Owns:
- HUD docking direction for `gizmo-left` and `under-view-toolbar`
- HUD anchor and offset rules
- HUD resize behavior
- visible HUD shell cleanup needed to support those behaviors clearly

Keeps for later or elsewhere:
- geometry status semantics
- fly-speed value ownership
- toolbar-family layout
- deeper viewport-shell architecture beyond the HUD placement seam

### Target Result

At the end of this phase:
- the viewport HUD has one explicit two-position docking model
- the HUD can resize through one honest viewport-local seam
- the surface stays aligned with the gizmo seam or the view-toolbar seam instead of drifting through ad hoc offset math
- the pass improves visible behavior without becoming a second runtime-owner family

### Locked Dock Direction

The first pass should support exactly two HUD placements:
- `gizmo-left`
- `under-view-toolbar`

Meaning:
- `gizmo-left` keeps the HUD attached to the current top-right viewport chrome cluster by anchoring it to the left side of the gizmo/axis-widget seam
- `under-view-toolbar` lets the HUD live directly under the `View` toolbar when the user wants the readout stacked with the explicit control surface

Important rule:
- do not widen this first pass into top, right, bottom, left, or free-floating placement targets

### Locked Interaction Direction

Dragging in this phase should mean:
- begin a drag from the HUD shell
- preview one of the two allowed dock targets
- on release, snap to `gizmo-left` or `under-view-toolbar`

Important rule:
- dragging is a dock-selection gesture in this phase, not arbitrary panel placement

### Cross-Doc Boundary

Important rule:
- this phase can touch the visible HUD presentation seam, but it must keep geometry, fly, and worker ownership with their existing families

That means:
- `ViewportOverlay.tsx` is fair game
- `viewport-overlay.css` is fair game
- viewport-local shell state is acceptable only if the docking or resize seam truly needs it
- `Viewer.ts`, worker selectors, and toolbar command families should not become the main owners of this phase

### Current Starting Point

Current doc-backed and code-backed read:

- `src/app/components/ViewportOverlay.tsx`
  - already renders the viewport-local HUD surface through `.ViewportOverlayWidget.ViewportHud`
  - already places it with viewport-local style math
- `src/app/theme/surfaces/viewport-overlay.css`
  - already owns the current HUD shell and fly-speed row styling
- `src/app/components/viewToolbarLayout.ts`
  - already exposes the current HUD-right offset helper
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-7.5-15 - Model Viewport Local View Toolbar State.md`
  - already records that the visible HUD offset should stay tied to per-viewport local axis-widget sizing instead of global host sizing

Implementation-ready rule:
- start from the existing HUD overlay seam instead of rebuilding the HUD as another surface type

### Questions / Decisions

#### [ ] q1 - Should the first pass stay locked to `gizmo-left` and `under-view-toolbar`, or widen only after those two placements prove out?

Suggestion:
- start with those two named placements
- only widen later if the two-target dock model proves insufficient in real viewport use

#### [ ] q2 - Should resizing affect width only or both width and height?

Suggestion:
- start with width-first resizing
- only add height resizing if the current content mix proves it is necessary

#### [ ] q3 - Where should viewport-local HUD size and dock preference live?

Suggestion:
- keep the preference viewport-local
- avoid global HUD sizing so split and multi-viewport setups can stay honest

### Internal Phase Ladder

This phase should still ship through a few narrow internal cuts instead of trying to solve every HUD idea at once.

## [ ] Phase 1 - Docking Contract And Anchor Owner

Purpose:
- define the two allowed HUD dock targets and lock the real anchor owner for each placement

This phase should:
- identify the current HUD anchor chain
- decide which viewport-local owner publishes the final dock offsets
- define the switch contract between `gizmo-left` and `under-view-toolbar`
- keep the HUD visibly tied to the active viewport instead of page-global math

Likely runtime files:
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/viewToolbarLayout.ts`
- `src/app/components/ViewportOverlay.test.tsx`

Done when:
- the HUD docking seam has one explicit owner
- both docked placements read as viewport-local and intentional
- the drag gesture is defined as the switch path between the two allowed targets
- the pass stays local to placement rather than widening into resize behavior yet

## [ ] Phase 2 - Resize Surface And Local Size State

Purpose:
- add the first honest resize seam for the HUD once the dock owner is stable

This phase should:
- add one visible resize affordance or resize interaction path
- keep the size state local to the viewport surface
- preserve readable HUD layout across the allowed size range in both allowed dock targets

Likely runtime files:
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewportOverlay.test.tsx`
- supporting viewport-local state files only if the size preference truly needs persistence

Done when:
- the HUD can resize through one explicit seam
- the resize behavior remains viewport-local
- the HUD still reads clearly at its supported sizes

## [ ] Phase 3 - Focused Proof And Stop

Purpose:
- prove the docking and resizing surface works cleanly and then stop before the phase grows into a larger overlay family rewrite

This phase should:
- widen focused proof around the HUD seam only as needed
- confirm docking and resizing stay bound to the correct viewport
- confirm the phase did not take over geometry, fly, or worker ownership

Likely proof file:
- `src/app/components/ViewportOverlay.test.tsx`

Done when:
- the visible HUD docking and resizing behavior is covered by focused proof
- the lane still reads as one small presentation phase
- the repo has a clean stopping point before broader HUD polish widens

### Phase Guardrail

This is a HUD presentation phase, not a hidden runtime rewrite.

Important rule:
- do not treat `Viewport-HUD 1` as permission to reopen geometry status semantics
- do not smuggle fly-runtime behavior into the phase just because the HUD displays `Fly Speed`
- do not turn the phase into a generic floating panel/window system
- improve the visible HUD surface, prove it, and stop

### Acceptance Shape

This phase is done when:
- the viewport-local HUD can switch between `gizmo-left` and `under-view-toolbar`
- dragging acts as the explicit gesture for switching between those two placements
- resizing feels intentional and viewport-local
- the surface remains readable while docked or resized
- nearby runtime-owner families remain clearly separate
