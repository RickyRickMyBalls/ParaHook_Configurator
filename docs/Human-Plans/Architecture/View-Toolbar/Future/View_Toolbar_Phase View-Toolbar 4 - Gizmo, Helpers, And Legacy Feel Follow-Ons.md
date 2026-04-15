# View Toolbar Phase View-Toolbar 4 - Gizmo, Helpers, And Legacy Feel Follow-Ons

## Doc Header

### Doc History
2. 2026-04-14 15:10:34: Expanded this later helper-tuning phase to explicitly include orientation-gizmo connector/cage lines between the snap spheres so the helper can recover clearer side/volume readability as one concrete follow-on instead of leaving that visual-depth detail implicit
1. 2026-03-30 15:01: Created this standalone future phase doc for `View-Toolbar 4`, turning the fourth `View-Toolbar` cut into an implementation-ready planning surface centered on later helper tuning, orientation-gizmo parity, and any legacy camera-feel controls that still deserve a modern home

### Purpose

This doc locks the fourth `View-Toolbar` phase.

Use it to answer:
- how later helper tuning should return
- which orientation-gizmo settings still deserve carry-forward work
- how to treat legacy camera-feel controls like inertia, decay, roll, and spin
- how to keep this later widening from polluting the earlier essential phases

### Why This Phase Exists

After projection, lens, grid, and background land, the remaining backlog becomes more specialized:
- orientation-gizmo tuning
- later helper visibility and sizing
- legacy camera-feel controls

Those can still matter, but they are no longer the first essentials.

This phase exists to keep them explicit without letting them distort the earlier cleaner view-state cuts.

### Scope

This phase covers:
- orientation-gizmo tuning
- later helper tuning
- later camera-feel controls if they still fit the product

This phase does not cover:
- first shared projection seam
- `ParaSelect` or `FOV`
- first broad grid/background recovery

## Doc Body

## [ ] - `View-Toolbar 4` - `Gizmo, Helpers, And Legacy Feel Follow-Ons`

### Header

Purpose:
- bring back later helper-tuning and camera-feel controls without polluting the first essential `View-Toolbar` phases

Owns:
- orientation-gizmo tuning
- later helper-detail settings
- legacy motion/camera-feel candidates that still deserve to return

Keeps for later product-wide discussion:
- any highly experimental legacy view gimmicks that no longer fit ParaHook

### Target Result

At the end of this phase:
- orientation-gizmo controls are clearly separated from transform-gizmo controls
- the user can tune the most meaningful helper-display details
- only the legacy motion controls that still support modern ParaHook interaction are brought back
- the toolbar remains readable because these controls land after the earlier essential phases are already in place

### Questions / Decisions

#### [x] q1 - Should orientation-gizmo controls stay separate from transform-gizmo controls?

Question:
- should axis/orientation helper tuning stay distinct from transform editing controls?

Suggestion:
- yes

Decision:
- orientation-gizmo controls must remain separate from transform-gizmo controls

#### [ ] q2 - Which legacy camera-feel controls actually deserve to return?

Question:
- do inertia, decay, roll, spin, and `Zoom Stops Inertia` still improve the modern interaction model, or are they just historical carry-over clutter?

Suggestion:
- bring back only the controls that clearly improve day-to-day authoring clarity
- do not revive every old motion toggle automatically

#### [ ] q3 - Should helper tuning stay simple or become a broad advanced panel?

Question:
- after the basic helper toggles land earlier, should the later helper phase stay focused on a few meaningful settings instead of turning into a huge debug menu?

Suggestion:
- yes
- keep helper tuning concise and useful

### Implementation Spec

This phase should:
- separate orientation-gizmo controls from transform-gizmo controls
- add orientation-gizmo tuning such as:
  - line opacity
  - connector/cage lines between the snap spheres so the helper sides read clearly
  - sphere size
  - text size
  - text visibility
  - viewport size
- decide whether helper placement or padding controls are needed
- evaluate each legacy camera-feel candidate individually:
  - inertia
  - decay
  - roll `+90 / -90`
  - spin
  - `Zoom Stops Inertia`
- expose only the motion controls that still fit the modern viewer interaction model
- keep any user-facing motion controls reachable from console too

### Console Alignment

If any of these later controls remain user-facing, they should also be reachable from console:
- helper visibility/tuning families
- orientation-gizmo tuning families where practical
- any surviving camera-feel toggles

Important rule:
- do not allow later advanced controls to become a hidden toolbar-only side path

### Phase Guardrail

This phase should not be pulled forward prematurely.

Important rule:
- do not widen `View-Toolbar 1` with helper tuning just because the old app had it
- do not widen `View-Toolbar 2` with camera-feel controls just because Three.js can support them
- prove the essential command, lens, grid, and background surfaces first

### Acceptance Shape

This phase is done when:
- orientation-gizmo tuning is explicit and separate from transform controls
- helper detail tuning is available without turning the toolbar into a debug dump
- only justified legacy motion controls return
- the family still reads in a clear priority order from essential to advanced
