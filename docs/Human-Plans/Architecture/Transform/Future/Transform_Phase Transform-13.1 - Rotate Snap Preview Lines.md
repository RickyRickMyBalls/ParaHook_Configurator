# Transform Phase Transform-13.1 - Rotate Snap Preview Lines

## Doc Header

### Doc History
3. 2026-03-27 17:27: Expanded this `Transform 13.1` doc so the first rotate preview pass now explicitly owns a dedicated `i`-menu `Rotate Snap Preview` section with viewer-only tuning controls for on/off, line size, thickness, preview radius, and delay
2. 2026-03-27 17:24: Tightened this `Transform 13.1` rotate preview doc into a more implementation-ready spec by locking stable angular key shapes, one concrete visible-window rule, exact activation constraints, helper/viewer target files, and a sharper rotate-axis test plan so the next pass reads as direct viewer/helper work instead of only high-level intent
1. 2026-03-27 17:19: Created this standalone implementation-ready `Transform 13.1` future phase doc for rotate snap preview lines, tightening the next snap-visual follow-on around stable angular line identity, active-axis-only live-drag rendering, and one landed-angle highlight that behaves like the move snap current dot without widening into free-rotate or scale

### Purpose

This phase adds the first rotate snap availability visual in the viewport.

Use it to answer:
- what rotate snap should render while the user is actively dragging a rotate gizmo
- how rotate snap visuals should stay keyed to stable angular positions instead of behaving like a gizmo-owned effect
- how the active landed rotate snap line should grow and transfer during drag
- what should remain out of scope for the first rotate pass

## Doc Body

## [ ] Transform 13.1 - Rotate Snap Preview Lines

### Summary

`Transform 13.1` starts after:
- `Transform 13`
  - first move-only snap availability visuals shipped
- `Transform 13.2`
  - move snap visual system rebuild and polish shipped

By this point, move snap already has its first stable-lattice visual language.

This phase brings the same honest live-drag idea to rotate:
- only while a rotate gizmo drag is active
- only for snapped rotate axes
- one stable angular preview field around the origin
- one landed/current snap line that behaves like the move current dot

Phase outcome:
- rotate snap previews render during active `Rotate X / Y / Z` drag
- the preview field is built from stable angular snap positions around the current rotate origin
- the landed/current rotate snap line grows on arrival and transfers cleanly to the next snapped angle
- nearby rotate snap lines ghost on/off around that landed angle

### Owns

- viewer-owned rotate snap preview visuals
- active-axis rotate snap preview lines for `Rotate X / Y / Z`
- stable angular identity for rotate snap preview segments
- landed-angle highlight transfer during live snapped rotate drag

### Does Not Own

- move snap visuals
- scale snap visuals
- free-rotate / outer free ring visuals
- snap-state ownership or Console grammar changes
- timeline behavior changes

### Locked Outcome

- Rotate snap previews only appear while the user is actively dragging a snapped rotate gizmo handle
- The first pass covers only axis rotate handles:
  - `Rotate X`
  - `Rotate Y`
  - `Rotate Z`
- The preview field should be built from stable angular positions around the rotate origin
- The field should not read like it is sliding with the gizmo
- The landed/current snapped angle should have one modestly emphasized line, like the move current dot
- Nearby snap lines should ghost on and off around that landed angle according to the rotate snap spacing
- If rotate snap is `10`, preview lines should appear every `10` degrees around the ring neighborhood
- The preview should feel like the gizmo is rotating from snap line to snap line
- Size/strength should transfer on arrival at the new snapped angle, not pre-highlight the destination too early
- The preview should use one stable reference direction per rotate axis:
  - `Rotate X`
    - reference ray along local/world `+Y`
  - `Rotate Y`
    - reference ray along local/world `+X`
  - `Rotate Z`
    - reference ray along local/world `+X`
- The first pass should use short radial preview line segments, not full infinite lines
- The first pass should render one visible angular neighborhood of `9` lines total:
  - the current landed angle
  - `4` snap lines on each side
- One hidden buffered line should exist just beyond each visible edge so new lines can ghost in before the visible window runs out
- The transform reference `i` menu should expose one dedicated viewer-only `Rotate Snap Preview` section
- That section should own:
  - `Rotate Snap Preview`
    - `On / Off`
  - `Line Size`
  - `Line Thickness`
  - `Preview Radius`
  - `Preview Delay`
- Free rotate stays out of scope
- Scale stays out of scope

### System Direction

Build `Transform 13.1` as the rotate equivalent of the cleaned-up move snap system:

1. stable angular identity
   - preview segments keyed by absolute angular snap address around the active rotate axis
2. visible angle window
   - bounded angular neighborhood around the current landed snapped angle
3. emphasis
   - one landed/current line slightly stronger than its nearby neighbors
   - neighboring lines fade/ghost with distance from the landed angle

The important rule is:
- the angular field is the owner
- the current landed angle only drives weighting
- the field itself should not be rebuilt as a gizmo-attached effect each frame

### Public Interfaces

No new shared snap-state or Console interfaces are required in the first pass.

Viewer/helper-only widening is acceptable, for example:
- one new helper file:
  - `src/viewer/ReferenceTransformRotateSnapHelper.ts`
- one matching focused test file:
  - `src/viewer/ReferenceTransformRotateSnapHelper.test.ts`
- one internal viewer seam for the active rotate snap preview overlay
- one shared viewer-preference block for rotate preview presentation

The first pass should add one dedicated transform-reference `i`-menu section:
- `Rotate Snap Preview`
  - `On / Off`
  - `Line Size`
  - `Line Thickness`
  - `Preview Radius`
  - `Preview Delay`

Keep these controls viewer-only:
- they affect rotate preview presentation only
- they do not change rotate snap values or rotate math

### Implementation Direction

Primary targets:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/TransformGizmo.ts`
- `src/viewer/ReferenceTransformRotateSnapHelper.ts`
- `src/viewer/ReferenceTransformRotateSnapHelper.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

Recommended implementation shape:
- add one dedicated rotate helper rather than folding rotate preview lines into the move helper
- build stable angular keys from:
  - active rotate axis
  - active space
  - rotate origin
  - rotate snap value
  - absolute angular snap index
- use one stable key shape:
  - `rotate:<axis>:<absoluteSnapIndex>`
- derive one reference direction in the active rotation plane
- use these reference rays:
  - `Rotate X`
    - `+Y`
  - `Rotate Y`
    - `+X`
  - `Rotate Z`
    - `+X`
- build short radial preview segments at angular snap positions around the current landed angle
- build those segments in the plane perpendicular to the active rotate axis
- keep segment positions fixed once keyed; animate only weighting, not angular position
- keep one hidden buffered ring beyond the visible angle window so new lines can ghost in before the visible window runs out
- visible-window rule:
  - current landed angle plus `4` snap lines on each side
  - one hidden buffered line beyond each visible edge
- surface one rotate preview section in the transform reference `i` menu:
  - `Rotate Snap Preview`
    - `On / Off`
  - `Line Size`
  - `Line Thickness`
  - `Preview Radius`
  - `Preview Delay`
- animate only:
  - line strength / opacity
  - line length or thickness if needed
- do not animate the angular positions themselves
- keep the landed/current line only modestly stronger than nearby lines:
  - same visual idea as move:
    - about `20%` stronger than its normal local baseline
- transfer that highlight on arrival at the next snapped angle:
  - old landed line shrinks back to normal
  - new landed line grows from normal to highlighted
- do not pre-grow the destination line too early

### Activation Rules

Rotate snap preview lines should appear only when all of these are true:
- a reference transform shell is active
- the current gizmo mode is `rotate`
- the active handle is one of:
  - `Rotate X`
  - `Rotate Y`
  - `Rotate Z`
- rotate snap is enabled for that reference
- the active rotate snap mode is using its real snapped driver value

Rotate snap preview lines should not appear:
- while idle
- during move or scale drag
- during free-rotate / outer ring drag
- when rotate snap is off
- when there is no active rotate handle

### Helper Contract

The rotate helper should own:
- stable angular identity
- visible window derivation
- emphasis weighting

The helper should not own:
- rotate math
- transform commits
- Console or toolbar state

The helper should reconcile by key:
- matching keys keep their line object and angular position
- newly relevant keys ghost in from hidden state
- keys leaving the buffered window ghost out and return to the pool

The helper should treat the current landed snapped angle as a weighting center, not as the identity owner of the preview field.

### Visual Direction

- Use short white radial line segments around the rotate origin
- Keep them lightweight and clearly secondary to the gizmo itself
- The landed/current line should read as the rotate equivalent of the move current dot:
  - only modestly stronger than nearby lines
  - not a giant special marker
- The preview should reinforce:
  - stable snapped angles in space
  - the gizmo rotating from one snapped line to the next

### Test Plan

Verification should cover:
- store / toolbar seam
  - the transform reference `i` panel exposes `Rotate Snap Preview`
  - the rotate preview section has:
    - `On / Off`
    - `Line Size`
    - `Line Thickness`
    - `Preview Radius`
    - `Preview Delay`
  - editing those controls updates shared viewer-preference state
- helper identity
  - rotate preview lines are keyed by stable angular position, not relative array slot
  - key shape is `rotate:<axis>:<absoluteSnapIndex>`
- helper presentation
  - axis rotate preview lines stay fixed in angular space while only weighting changes
  - the landed/current line transfers on arrival at the new snapped angle
  - the destination line does not pre-grow too early
  - the landed/current line is only modestly stronger than nearby lines
- rotate spacing
  - snap `10` yields lines every `10` degrees
  - snap `15` yields lines every `15` degrees
- visible window
  - the helper shows `9` visible lines total around the landed angle
  - one hidden buffered line exists on each side beyond the visible window
- axis coverage
  - `Rotate X`, `Rotate Y`, and `Rotate Z` each use the correct perpendicular plane and reference ray
- activation seam
  - no rotate preview lines while idle
  - no rotate preview lines when rotate snap is disabled
  - rotate preview lines appear only during active snapped rotate drag
  - free-rotate does not activate the rotate preview field
- viewer seam
  - `ViewerHost` forwards the rotate preview settings into `Viewer`
- compatibility
  - move snap visuals remain unchanged
  - scale remains untouched

### Assumptions

- This first rotate phase covers only axis rotate handles
- Free-rotate remains deferred to a later follow-on if needed
- The move snap visual system remains the model to copy:
  - stable identity
  - bounded visible window
  - arrival-based highlight transfer
