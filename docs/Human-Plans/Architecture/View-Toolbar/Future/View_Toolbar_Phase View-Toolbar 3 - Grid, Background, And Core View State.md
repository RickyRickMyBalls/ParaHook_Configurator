# View Toolbar Phase View-Toolbar 3 - Grid, Background, And Core View State

## Doc Header

### Doc History
1. 2026-03-30 15:01: Created this standalone future phase doc for `View-Toolbar 3`, turning the third `View-Toolbar` cut into an implementation-ready planning surface centered on recovering the broader daily view-state controls after the camera/projection section is strengthened

### Purpose

This doc locks the third `View-Toolbar` phase.

Use it to answer:
- how the toolbar should recover richer grid behavior
- how background controls should return
- which core view-state controls belong in the main toolbar versus later advanced sections
- how these controls should stay aligned with console and shared view-state ownership

### Why This Phase Exists

After projection and lens growth, the next major missing everyday view-state families are:
- grid
- background
- core visible helpers

These are the controls that make the viewer feel deliberately configurable instead of locked to one baked presentation.

This phase exists to recover those daily controls before later helper-tuning and motion-feel follow-ons widen the surface further.

### Scope

This phase covers:
- grid expansion
- background mode and color
- core helper visibility that belongs to ordinary view state
- console alignment for those same settings

This phase does not cover:
- `ParaSelect` / `FOV`
- deeper orientation-gizmo tuning
- legacy camera-feel controls
- render/debug dumping

## Doc Body

## [ ] - `View-Toolbar 3` - `Grid, Background, And Core View State`

### Header

Purpose:
- recover the broader everyday view-state controls that make the viewer feel intentionally configurable

Owns:
- grid section growth
- background mode controls
- custom background color
- first helper-facing core view-state controls that belong beside grid/background

Keeps for later phases:
- fine-grained helper tuning
- camera-feel controls
- experimental or highly legacy-specific scene gimmicks

### Target Result

At the end of this phase:
- grid is a real section, not a thin checkbox
- background has explicit mode and color ownership
- the toolbar holds one honest core view-state area beside the camera section
- the same controls are reachable through console command families instead of becoming toolbar-only state

### Questions / Decisions

#### [x] q1 - What grid model should the toolbar use long-term?

Question:
- should grid stay locked to fixed named bands like `minor`, `major`, and `double major`, or widen into a reusable ordered layer model?

Suggestion:
- use the ordered layer model

Decision:
- the long-term grid model should use extensible layers such as:
  - `gridlines_1`
  - `gridlines_2`
  - `gridlines_3`
- the older three-band read can survive only as a default preset, not the permanent UI structure

#### [x] q2 - Should background color and scene/environment choice live in the same family?

Question:
- should plain background color still belong to the `View` family even if some old scene modes return later?

Suggestion:
- yes
- keep plain background controls in `View`
- keep richer scene/environment variants clearly labeled as such

Decision:
- background color and mode belong to `View`
- richer scene/environment variants may return later, but should remain visually separate from plain background color choice

#### [ ] q3 - How much helper visibility belongs here versus later helper tuning?

Question:
- should `View-Toolbar 3` include only basic helper on/off controls, leaving size/opacities/text tuning for the next phase?

Suggestion:
- yes
- keep this phase focused on everyday view-state recovery first

### Implementation Spec

This phase should:
- expand grid from one toggle into a real section
- add `+ Add Grid Lines`
- add per-layer spacing
- add per-layer opacity
- add per-layer color
- add per-layer visibility
- add grid size/extent if the viewer runtime already supports a stable user-facing seam
- add background mode controls with at least:
  - `Dark Blue`
  - `Black`
  - `White`
  - `Custom`
- add custom background color picking
- keep any later `Stars` / `Nebula` / `Swarm` direction explicitly secondary to core background mode
- expose these controls through shared view-state seams that the console can also target

### Console Alignment

This phase should make the following families reachable through console as honest view-state commands:
- grid visible
- grid layer add/remove/tune
- background mode
- background color
- core helper visibility that belongs in the same family

Important rule:
- do not let grid or background become toolbar-only state just because they are highly visual

### Acceptance Shape

This phase is done when:
- the toolbar has a real grid section
- the grid uses the extensible layer model instead of a hard-coded permanent three-band UI
- the toolbar has explicit background mode and color control
- console alignment is defined for the same view-state families
- the phase lands without widening into detailed helper tuning or camera-feel controls
