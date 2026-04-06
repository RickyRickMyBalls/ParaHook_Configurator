## [x] [3.2B-S2] - `SketchPlane Session Cleanup`

`SketchPlane` should cleanly read as:
- `Sketch node selected`
  - parent scope
- `SketchPlane > Plane Selection`
  - choose `XY / XZ / YZ` or later other source references
- `SketchPlane > Adjust`
  - refine move / rotate / later other transform actions

Recommended `Esc` / `Back` behavior:
- from `Adjust`
  - return to `Plane Selection`
- from `Plane Selection`
  - cancel `SketchPlane` and return to the selected sketch-node scope

Important rule:
- do not force the user to explicitly choose `Pick Plane` versus `Transform` as a separate menu step up front
- plane selection should be the natural first level
- transform should become active after a plane/source is chosen

Current code-to-target mapping:
- current canonical session seam:
  - `sketchPlanePickSession`
  - this should remain the only source of truth for `SketchPlane`
- current stage mapping:
  - `stage: 'pick'`
    - maps to `SketchPlane > Plane Selection`
  - `stage: 'adjust'`
    - maps to `SketchPlane > Adjust`
- current console seam:
  - entering `SP` prints:
    - `Sketch Plane > [XY, XZ, YZ]`
  - direct typed `XY / XZ / YZ` already routes into `setSketchPlanePickDraftPlane(...)`
- current cancel/handoff seam:
  - canceling `SketchPlane` already restores the staged console to the selected sketch-node scope
  - viewport clicks during `SketchPlane` already keep the command context alive so camera adjustment does not collapse the session

Phase boundary:
- `[3.2B-S2]` is responsible for making the existing two-level `SketchPlane` session read cleanly and consistently
- this phase should not invent a second sketch-plane session model
- this phase does not need to redesign:
  - full toolbar/console command unification
  - generic one-level return across every sketch surface
  - face-pick or broader source families beyond the current plane-selection seam
- those belong to later work in:
  - `[3.2B-S4]`
  - `[3.2B-S5]`
  - later sketch-plane source-expansion phases

### Questions / Decisions

#### [x] `q1` Decide the first honest `SketchPlane` levels.

##### Suggestion
- locked direction:
- `Plane Selection`
- `Adjust`

#### [x] `q2` Decide what `Esc` should do from each level.

##### Suggestion
- locked direction:
- from `Adjust`
  - return to `Plane Selection`
- from `Plane Selection`
  - cancel `SketchPlane` and return to the selected sketch-node scope

#### [x] `q3` Decide whether the user should explicitly choose `Pick Plane` versus `Transform` as a separate first prompt.

##### Suggestion
- locked direction:
- no
- `Plane Selection` should be the natural entry level
- `Adjust` should become available after a plane/source is chosen

### Implementation Spec

- keep the first `SketchPlane` cleanup narrow:
  - one stable plane-selection level
  - one stable adjust level
  - one-level `Esc` return between them
  - cancel from plane-selection returns to the selected sketch-node scope
- console prompt/state should reflect whichever of those two levels is active
- clicking the viewport to adjust the camera should not collapse the active sketch-plane command context
- implementation should keep one canonical `sketchPlanePickSession` model instead of splitting plane choice, transform, and confirm/cancel into separate temporary seams
- the first honest code target is:
  - entering `SP` opens `SketchPlane > Plane Selection`
  - choosing `XY / XZ / YZ` transitions into `SketchPlane > Adjust`
  - `Adjust` owns move / rotate gizmo and draft transform edits
  - cancel from `Adjust` returns to `Plane Selection`
  - cancel from `Plane Selection` exits back to the selected sketch-node scope
- the console and overlay should both describe the same current level:
  - `Plane Selection`
    - plane choices active
    - transform controls not yet primary
  - `Adjust`
    - transform controls active
    - plane reselection still possible only through an intentional back/reopen step
- viewer interaction should remain compatible with camera movement while the sketch-plane session stays active
- success means `SketchPlane` feels like one session with two readable depths instead of several disconnected hacks

Acceptance checks:
- a reader can point to one canonical sketch-plane session seam in code:
  - `sketchPlanePickSession`
- `pick` and `adjust` are explicitly understood as:
  - `SketchPlane > Plane Selection`
  - `SketchPlane > Adjust`
- entering `SP` exposes plane-selection state first, not a separate mode chooser
- choosing `XY / XZ / YZ` advances into adjust state instead of behaving like a detached action
- cancel from plane selection returns to the selected sketch-node scope
- camera adjustment from viewport clicks does not collapse the active sketch-plane command surface
- no second sketch-plane session model is introduced in this phase

### SketchPlane Live Transform Follow-On

Now that `SketchPlane` has a cleaner session hierarchy, `Move` and `Rotate` should stop being menu-only commands and become real live viewport transform commands.

Locked direction:
- `g > s > sp > xy > move` should activate live sketch-plane translation immediately
- `g > s > sp > xy > rotate` should activate live sketch-plane rotation immediately
- child axis commands like `Move X` or `Rotate Z` should narrow that same live session to one axis only

Implementation-ready behavior:

1. `Move` activates live sketch-plane translation
- when the user confirms `Sketch Plane > Move`, the sketch-plane gizmo/origin should immediately begin a live move session
- the move should begin relative to the mouse position at activation time so the gizmo does not jump or fly away
- this should follow the same interaction lesson as the reference transform `M` flow

2. whole `Move` highlights all translation rows
- while whole `Move` is active, the `X`, `Y`, and `Z` move rows should all read as active
- that communicates that the user is moving the sketch plane freely across all three translation axes

3. `Move X` narrows the live session to one axis
- when the user goes into `Move > Move X`, only the `Move X` row should remain highlighted
- in the viewport, the gizmo should move with the mouse on the `X` axis only
- this should feel like a constrained version of the wider move session, not a detached new tool

4. `Move Y` and `Move Z` follow the same rule
- each command should highlight only its own row
- each command should constrain the viewport move session to its own axis only

5. `Rotate` mirrors the same structure
- whole `Rotate` should activate live sketch-plane rotation
- whole `Rotate` should highlight all rotation rows
- `Rotate X`, `Rotate Y`, and `Rotate Z` should each narrow the live session to a single rotation axis
- this should follow the same overall interaction pattern as the move family

Hard rules:
- do not treat `Move`, `Move X`, `Move Y`, `Move Z`, `Rotate`, `Rotate X`, `Rotate Y`, and `Rotate Z` as transcript-only commands
- each command must correspond to real live gizmo behavior in the viewport
- row highlight state and viewport constraint state must be driven from the same sketch-plane command/session truth
- entering an axis command should refine the current live transform session, not create a disconnected parallel mode

Acceptance checks:
- `Move` starts live translation without a gizmo jump
- `Move` highlights `X`, `Y`, and `Z`
- `Move X` highlights only `Move X` and constrains translation to `X`
- `Move Y` and `Move Z` behave the same way for their axes
- `Rotate` starts live rotation and highlights all rotation rows
- `Rotate X`, `Rotate Y`, and `Rotate Z` each constrain the live rotation session to their own axis


