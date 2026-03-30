# View Toolbar Phase View-Toolbar 2 - Projection Surface, ParaSelect, And Lens Controls

## Doc Header

### Doc History
1. 2026-03-30 15:01: Created this standalone future phase doc for `View-Toolbar 2`, turning the second `View-Toolbar` cut into an implementation-ready planning surface centered on broadening the shipped projection seam into a fuller visible camera/lens section

### Purpose

This doc locks the second `View-Toolbar` phase.

Use it to answer:
- what should come immediately after the first shared projection-command seam
- how the toolbar should grow from simple `Perspective` / `Orthographic` buttons into a fuller lens section
- where `ParaSelect` should live
- which lens controls should become user-facing first
- how those controls should stay aligned with shared console and view-state ownership

### Why This Phase Exists

`View-Toolbar 1` proves the shared command seam for:
- `Perspective`
- `Orthographic`
- shared toolbar plus console projection routing

But that first cut is intentionally narrow.

It does not yet make the camera/lens section feel complete.

This phase exists to add the next honest visible controls:
- `ParaSelect`
- `FOV`
- first per-mode remembered lens values
- clearer projection-section structure

### Scope

This phase covers:
- visible projection subsection growth
- `ParaSelect`
- user-facing `FOV`
- orthographic zoom/scale follow-on if needed for parity
- per-mode remembered lens values where they improve usability

This phase does not cover:
- grid growth
- background/environment growth
- orientation-gizmo tuning
- camera-feel controls like inertia, decay, roll, or spin

## Doc Body

## [ ] - `View-Toolbar 2` - `Projection Surface, ParaSelect, And Lens Controls`

### Header

Purpose:
- turn projection from a narrow command proof into a fuller visible toolbar section

Owns:
- visible projection subsection design
- `ParaSelect`
- `FOV`
- orthographic zoom/scale parity if needed
- per-mode remembered lens values

Keeps for later phases:
- grid/background/core view-state growth
- helper/gizmo tuning
- legacy camera-feel controls

### Target Result

At the end of this phase:
- the camera section does more than just expose `Perspective` and `Orthographic`
- `Perspective` can expose its preset family through `ParaSelect`
- `FOV` becomes a real visible user control instead of a hidden or later-only idea
- orthographic mode has an equivalent user-facing scale or zoom control if the shipped interaction still needs a visible lens counterpart
- toolbar and console continue to target the same shared projection/lens owner seams

### Current Read

Current live baseline:
- the toolbar already exposes `Perspective`
- the toolbar already exposes `Orthographic`
- the console already has the first shared projection path

Current missing visible lens depth:
- no `ParaSelect`
- no visible `FOV`
- no explicit per-mode remembered lens values
- no richer projection sub-structure inside the camera section

### Questions / Decisions

#### [x] q1 - Where should `ParaSelect` live?

Question:
- should `ParaSelect` be a sibling of `Perspective` / `Orthographic`, or a child surface that appears when `Perspective` is active?

Suggestion:
- treat `Perspective` versus `Orthographic` as the first switch
- expose `ParaSelect` as a child or subordinate control when `Perspective` is active

Decision:
- `ParaSelect` should live under active `Perspective`, not as a third peer projection mode

#### [x] q2 - Should `FOV` be visible in this phase?

Question:
- should `FOV` land now instead of waiting for a later broad camera pass?

Suggestion:
- yes
- projection without visible user-facing lens control still feels incomplete

Decision:
- `FOV` belongs in `View-Toolbar 2`

#### [ ] q3 - Should orthographic get a visible size/zoom control in the same phase?

Question:
- if `Perspective` gets `FOV`, should `Orthographic` also get a visible lens counterpart now?

Suggestion:
- yes, if the viewer already has a stable orthographic size seam
- no, if doing so would force shaky math or unclear user language in the same cut

### Implementation Spec

This phase should:
- keep the visible `Perspective` / `Orthographic` toggle
- add a `ParaSelect` control that appears only when `Perspective` is active
- add a visible `FOV` slider and numeric readout when `Perspective` is active
- decide whether orthographic gets:
  - `Zoom`
  - `Scale`
  - or `View Height`
- remember the last used perspective lens settings separately from orthographic ones where useful
- ensure toolbar changes route through shared view state and/or shared view commands rather than toolbar-local viewer mutation
- add matching console reachability for the new user-facing lens controls

### Console Alignment

This phase should extend the console family around:
- `Camera > Projection > Perspective`
- `Camera > Projection > Orthographic`
- later `Camera > Lens > FOV`
- later `Camera > Projection > Perspective > ParaSelect`

Important rule:
- the toolbar must not invent a toolbar-only projection preset seam

### Acceptance Shape

This phase is done when:
- the toolbar has a real projection/lens subsection instead of only two mode buttons
- `ParaSelect` is visible and usable under perspective mode
- `FOV` is visible and updates the shared view/lens seam
- the same controls remain reachable through the console path
- projection continues to use a real orthographic camera, not a fake low-`FOV` approximation
