# Auto Draft Final Vision

## Doc Header

### Doc History
5. 2026-04-13 21:20: Added the `manual` timing rule, locking that manual behavior should mirror the corresponding `on release` visual contract except that preview/final updates do not start on parameter release and only begin when the user explicitly presses `Build`
4. 2026-04-13 21:17: Added `Draft / On Release` and `Final / On Release`, locking the calmer non-live interaction rule that drag stays on committed blue geometry, yellow preview appears only after release if needed, and green B-rep preview is reserved for live modes rather than the on-release family
3. 2026-04-13 21:13: Added the `Auto / On Release` contract, clarifying that drag should stay on committed blue geometry only, yellow draft preview should appear only after release if needed, and the changed part should promote directly to blue final when B-rep is ready without using a separate green preview stage
2. 2026-04-13 21:08: Expanded the vision from an `auto / live`-only first slice into a broader shared preview system covering `Draft / Live` and `Final / Live`, clarifying that the visible layering stays mostly the same while the winning post-release result changes from draft mesh to B-rep depending on the selected mode
1. 2026-04-13 21:02: Created this vision doc to record the intended visible behavior for `Auto / Draft / Final`, starting with one explicit `auto / live` preview contract written from the user's point of view so later worker, selector, and viewer changes can be judged against one simple visual story instead of a scattered mix of bug notes, gates, and partial phase rules

### Purpose

This doc defines the intended user-visible result behavior for ParaHook viewport result modes.

Use it to answer:
- what `auto / live` is supposed to look like
- what `auto / on release` is supposed to look like
- what `auto / manual` is supposed to look like
- what `draft / live` is supposed to look like
- what `draft / on release` is supposed to look like
- what `draft / manual` is supposed to look like
- what `final / live` is supposed to look like
- what `final / on release` is supposed to look like
- what `final / manual` is supposed to look like
- how committed geometry, draft preview, and B-rep preview should coexist
- which geometry should stay visible while a parameter is being edited
- what should happen when the user releases and commits the change

This doc is intentionally visual and product-facing first.

It is not trying to define:
- worker transport details
- selector helper structure
- exact lane naming
- one final implementation seam

### Why This Doc Exists

Recent worker and viewport work has spread the intended behavior across:
- `Worker 10`
- `Worker 11`
- bug notes
- selector behavior
- host-side gating logic

That made the implementation harder to reason about than the actual product rule.

The actual user expectation is simpler.

This doc exists to lock that simpler rule first.

The implementation should become simpler to match this vision.

## Doc Body

### Short Version

ParaHook should use one layered preview system across `Auto / Draft / Final`.

When the user edits one part of the model:
- unchanged geometry stays fully visible
- the old committed version of the changed geometry stays visible underneath
- the new draft version appears as preview
- the newer B-rep preview may appear above the draft when that mode allows it
- when the user releases, the winning visible result depends on the selected mode

The viewport should never make unchanged geometry look like it is part of the edit.

### Core Visual Contract

The visible states in this system are:

- `Committed Base`
  - blue
  - `100%`
  - used for idle geometry and unchanged geometry

- `Changed-Part Retained Baseline`
  - blue
  - `50%`
  - used for the old committed version of the geometry that is currently being edited

- `Draft Preview`
  - yellow
  - `50%`
  - used for the changed part while draft preview is the newest available preview

- `B-Rep Preview`
  - green
  - `75%`
  - used for the changed part when a newer B-rep preview becomes available before final promotion

### Shared Interaction Rules

These rules should stay true across the `Auto`, `Draft`, and `Final` preview families unless a mode explicitly overrides them.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Changing A Parameter

When the user changes one parameter:
- the geometry that will change keeps showing its last committed state at blue `50%`
- geometry that is not changing stays at blue `100%`

#### 3. Draft Preview During Interaction

When draft preview is available during interaction:
- show the changed geometry only
- use yellow `50%`

#### 4. Unchanged Geometry Rule

Geometry that is not affected by the current change:
- stays visible
- stays blue
- stays `100%`

It must not:
- disappear
- dim
- turn yellow
- look like it is part of the active edit

### `Auto / Live` Vision

#### 1. Idle

When geometry is idle:
- show committed geometry at `100%`
- use blue committed/base presentation

This means:
- the whole scene reads as stable and fully loaded
- no preview styling is visible

#### 2. User Starts Changing A Parameter

When the user changes one parameter:
- the geometry that will change keeps showing its last committed state at `50%` blue
- geometry that is not changing stays at `100%` blue

This means:
- only the changed part becomes visually "in edit"
- unchanged parts remain stable and fully visible

Important rule:
- unchanged geometry should not dim, disappear, turn yellow, or otherwise look involved in the edit

#### 3. Draft Preview Appears

When the user changes a parameter and draft preview is available:
- show a draft preview mesh for the changed geometry only
- style that draft preview as `50%` yellow

This means:
- the user can compare:
  - old committed changed-part shape underneath
  - new draft preview above it

Important rule:
- show the draft preview only for the geometry affected by the current change
- do not show whole-scene yellow preview unless the whole scene is actually affected

#### 4. B-Rep Preview Appears

After draft preview is visible, if a B-rep preview becomes available:
- show the changed geometry as `75%` green

This means:
- the user can see a richer, more authoritative preview of the changed part before final promotion

Important rule:
- this is still preview state, not final committed state
- unchanged geometry still remains `100%` blue

#### 5. User Releases And Commits The Parameter Change

When the user lets go and commits the parameter change:
- show the newest available geometry
- if only draft preview is available, keep showing the changed geometry in yellow
- once B-rep is available and promoted, show the changed geometry in blue at `100%`

This means:
- the viewport should not go blank
- the viewport should not jump backward to stale geometry if a newer preview is already available
- final committed blue should return once the authoritative geometry is ready to be the stable result

### `Auto / On Release` Vision

`Auto / On Release` should be simpler than `Auto / Live`.

Because preview does not update continuously during drag:
- the user does not need live yellow churn while the pointer is still moving
- the user does not need a separate green B-rep preview stage during drag

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging

While the user is dragging a parameter:
- keep showing committed geometry only
- do not show yellow draft preview
- do not show green B-rep preview

This means:
- the viewport stays visually stable during drag
- the user is still editing the parameter, but preview presentation waits until release

#### 3. On Release

When the user lets go and commits the parameter change:
- if draft preview is the newest available result, show the changed geometry at yellow `50%`
- keep unchanged geometry at blue `100%`

This means:
- yellow appears only after release
- yellow is only a temporary waiting state while the better result is still loading

#### 4. When B-Rep Is Ready

When the B-rep/final geometry is ready:
- replace the yellow changed geometry with blue `100%` final geometry

Important rule:
- `Auto / On Release` does not need a separate green `previewBrep` stage
- the mode can promote directly from:
  - committed blue during drag
  - to yellow draft after release if needed
  - to blue final when B-rep is ready

### `Auto / Manual` Vision

`Auto / Manual` should use the same visible behavior as `Auto / On Release`, except nothing begins on parameter release.

The update flow starts only when the user explicitly presses `Build`.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging Or After Releasing Without Build

While the user is dragging, or after the user releases without pressing `Build`:
- keep showing committed geometry only
- do not show yellow draft preview
- do not show green B-rep preview

#### 3. When The User Presses `Build`

When the user explicitly presses `Build`:
- if draft preview is the newest available result, show the changed geometry at yellow `50%`
- keep unchanged geometry at blue `100%`

#### 4. When B-Rep Is Ready

When the B-rep/final geometry is ready:
- replace the yellow changed geometry with blue `100%` final geometry

Important rule:
- `Auto / Manual` mirrors `Auto / On Release`
- the only difference is:
  - `on release` starts on parameter release
  - `manual` starts only on explicit build

### `Draft / Live` Vision

`Draft / Live` should use the same interaction layering as `Auto / Live`, but it does not use the B-rep preview stage.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Changing

When the user changes a parameter:
- show the changed geometry's last committed state at blue `50%`
- keep unchanged geometry at blue `100%`
- show the changed geometry's draft preview mesh at yellow `50%`

#### 3. After Release

When the user lets go and commits the parameter change:
- show the draft geometry as the visible result

This means:
- `Draft / Live` settles to draft mesh
- it does not wait for or prefer a B-rep visible state

### `Draft / On Release` Vision

`Draft / On Release` should be the calmest draft-preview mode.

It should keep the drag interaction visually stable and only show draft preview after release.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging

While the user is dragging a parameter:
- keep showing committed geometry only
- do not show yellow draft preview during drag
- do not show green B-rep preview during drag

#### 3. On Release

When the user lets go and commits the parameter change:
- show the changed geometry as yellow draft preview if needed
- keep unchanged geometry at blue `100%`

#### 4. Settled Visible Result

After release:
- keep the draft geometry visible as the result for this mode

Important rule:
- `Draft / On Release` does not use a green B-rep preview stage
- it goes from:
  - blue committed during drag
  - to yellow draft after release
  - and stays on draft-visible geometry

### `Draft / Manual` Vision

`Draft / Manual` should mirror `Draft / On Release`, but it should not begin preview on parameter release.

It should begin only when the user explicitly presses `Build`.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging Or After Releasing Without Build

While the user is dragging, or after the user releases without pressing `Build`:
- keep showing committed geometry only
- do not show yellow draft preview

#### 3. When The User Presses `Build`

When the user explicitly presses `Build`:
- show the changed geometry as yellow draft preview if needed
- keep unchanged geometry at blue `100%`

#### 4. Settled Visible Result

After `Build`:
- keep the draft geometry visible as the result for this mode

Important rule:
- `Draft / Manual` mirrors `Draft / On Release`
- the only difference is that preview begins on explicit build instead of on release

### `Final / Live` Vision

`Final / Live` should use the same layering shape, but the higher-value preview and post-release target is B-rep.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Changing

When the user changes a parameter:
- show the changed geometry's last committed state at blue `50%`
- keep unchanged geometry at blue `100%`
- if draft preview appears first, show the changed geometry at yellow `50%`
- when B-rep preview becomes available, show the changed geometry at green `75%`

#### 3. After Release

When the user lets go and commits the parameter change:
- show the B-rep geometry as the visible result when it is available

This means:
- `Final / Live` is still a preview system during interaction
- but after release the visible winner should be the B-rep/final geometry rather than draft mesh

### `Final / On Release` Vision

`Final / On Release` should use the same calm drag behavior as the other on-release modes.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging

While the user is dragging a parameter:
- keep showing committed geometry only
- do not show yellow draft preview during drag
- do not show green B-rep preview during drag

#### 3. On Release

When the user lets go and commits the parameter change:
- if draft preview is the newest available result, show the changed geometry in yellow
- keep unchanged geometry at blue `100%`

#### 4. When Final B-Rep Is Ready

When the B-rep/final geometry is ready:
- replace the yellow changed geometry with blue `100%` final geometry

Important rule:
- `Final / On Release` does not need a separate green preview stage
- it goes from:
  - blue committed during drag
  - to yellow draft after release if needed
  - to blue final when B-rep is ready

### `Final / Manual` Vision

`Final / Manual` should mirror `Final / On Release`, but the update begins only when the user explicitly presses `Build`.

#### 1. Idle

When geometry is idle:
- show committed geometry at blue `100%`

#### 2. While Dragging Or After Releasing Without Build

While the user is dragging, or after the user releases without pressing `Build`:
- keep showing committed geometry only
- do not show yellow draft preview
- do not show green B-rep preview

#### 3. When The User Presses `Build`

When the user explicitly presses `Build`:
- if draft preview is the newest available result, show the changed geometry in yellow
- keep unchanged geometry at blue `100%`

#### 4. When Final B-Rep Is Ready

When the B-rep/final geometry is ready:
- replace the yellow changed geometry with blue `100%` final geometry

Important rule:
- `Final / Manual` mirrors `Final / On Release`
- the only difference is that the transition begins on explicit build instead of on release

### One-Edit Example

If the scene contains:
- `Extrude 1`
- `Extrude 2`

And the user edits only `Extrude 2`:

During the edit:
- `Extrude 1` stays blue at `100%`
- the old committed `Extrude 2` stays blue at `50%`
- the new draft `Extrude 2` appears yellow at `50%`
- if B-rep preview is ready, the newer `Extrude 2` preview appears green at `75%`

After release:
- the newest available `Extrude 2` remains visible
- yellow may remain temporarily if draft is still the newest available result
- once B-rep/final is ready and promoted, `Extrude 2` returns to blue at `100%`

### What The System Must Never Do

This system must not:
- make unchanged geometry disappear during a local edit
- make unchanged geometry yellow during a local edit
- make unchanged geometry dim just because another part is changing
- hide the old committed changed-part baseline before a replacement preview is visible
- treat a preview result as if it were already final committed geometry
- force the whole scene into preview styling if only one local branch changed
- show unnecessary preview churn in an `on release` mode while the user is still dragging
- use a green preview stage in an `on release` mode unless the product later proves a real need for it
- start preview or final transitions in a `manual` mode before the user explicitly presses `Build`

### Ownership Direction

This doc is about visible behavior, not low-level implementation, but the ownership direction should stay:

- graph runtime owns accepted and committed result truth
- selectors determine what visible result recipe should be shown
- the host/viewer should render that recipe

Important rule:
- the viewer host should not invent a second product story that disagrees with the visible contract above

### Implementation Compass

If a code change claims to support this system, it should make the viewport more able to tell this exact story:

1. unchanged geometry stays fully visible
2. changed geometry keeps its old committed baseline
3. draft preview appears for the changed geometry only
4. B-rep preview appears only in the modes that actually use it
5. after release, the visible winner matches the selected mode
6. final committed geometry returns to blue `100%` when promotion completes

If a change makes the viewport less local, less stable, or less visually honest than this, it is moving away from the vision.
