# Gizmo Phase Gizmo 2 - Orientation Helper Polish And Connector Lines

## Doc Header

### Doc History
28. 2026-04-14 22:12:33: Marked `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` complete after the runtime pass moved helper snap commitment from immediate `pointerdown` to pointer release, added a drag-threshold split inside `AxisGizmo.ts`, and routed gizmo-viewport drag through the existing temporary orbit path in `Viewer.ts` so the gizmo viewport now supports simple left-drag orbit without breaking click-to-snap behavior
27. 2026-04-14 22:03:59: Prepped `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` for implementation by locking the main runtime blocker in the current helper seam: `AxisGizmo.ts` still resolves snap targets immediately on `pointerdown`, so the next pass must add an honest click-versus-drag split, reuse the existing temporary orbit path in `Viewer.ts` plus `CameraController.ts`, and keep pointer-entry ownership near the gizmo viewport shell instead of moving main camera truth into the helper camera
26. 2026-04-14 22:01:13: Added `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` so the orientation-helper plan now reserves one explicit interaction follow-on for simple left-click orbiting when the pointer is over the gizmo viewport, keeping pointer-entry ownership near the gizmo/overlay seam while the actual orbit command path stays with `Viewer.ts` plus `CameraController.ts`
25. 2026-04-14 21:35:20: Marked `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` complete after the runtime pass added one shared helper-camera distance value to the `axisOverlayStyle` seam, exposed a new `Camera Dolly` `ParaSlider` in the `View` toolbar `Gizmo` section, moved the helper-local camera to a slightly farther default framing, and widened focused toolbar/helper/viewer proof without changing snap ownership
24. 2026-04-14 21:29:01: Prepped `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` for implementation by locking the live runtime seam to the helper-local `PerspectiveCamera` in `AxisGizmo.ts`, defining one narrow shared helper-style value for gizmo viewport camera distance, and making the next pass change true helper-camera framing instead of faking a smaller read through sphere or label scale
23. 2026-04-14 21:23:57: Added `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` so the orientation-helper plan now reserves one explicit follow-on for the gizmo viewport camera distance/framing seam, including a new `ParaSlider` in the `View` toolbar `Gizmo` section and a slightly smaller default helper read by zooming the gizmo viewport camera out a bit
22. 2026-04-14 21:20:24: Marked `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` complete after the helper-local runtime pass gave each snap-capable outer edge line its own promoted hover treatment, kept the dense interior web visually unchanged, restored the default line treatment cleanly on pointer leave, and added focused helper proof without widening into viewer or camera behavior
21. 2026-04-14 21:15:57: Prepped `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` for implementation by locking it to the now-shipped shared `axisOverlayStyle` seam, narrowing the runtime owner split to helper-local hover state in `AxisGizmo.ts` plus the already-existing `ViewToolbar.tsx` style surface, and defining the exact proof bar for promoted outer-edge hover without turning the dense interior web into an interactive highlight target
20. 2026-04-14 20:58:55: Marked `Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper` complete after the runtime pass added one shared `axisOverlayStyle` seam through view prefs, exposed `ParaSlider` / `ParaSelect` controls in the `View` toolbar `Gizmo` section, taught `AxisGizmo.ts` to apply separate outer-edge versus dense-web opacity, sphere scale, and axis-label visibility/size, and widened focused toolbar/helper/viewer proof coverage
19. 2026-04-14 20:42:00: Added `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` so the orientation-helper plan now reserves one explicit follow-on for tuning default snap-line transparency and the transparency lift/highlight effect on hover, keeping that interaction-feedback polish separate from the broader `Phase 7` style-control surface
18. 2026-04-14 20:38:39: Corrected `Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper` so the new `ParaSlider` and `ParaSelect` controls are explicitly planned for the `Gizmo` section of `src/app/components/ViewToolbar.tsx` rather than being described only as a generic helper-settings surface, keeping the user-facing control location honest while the helper still applies those values downstream
17. 2026-04-14 20:34:57: Marked `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` complete after the runtime pass widened the helper output seam beyond the old six-way `SnapDirection` union, split the twelve outer edge lines into direct hit targets while leaving the dense interior web visual-only, and routed corner-sphere plus outer-edge hits through `Viewer.ts` into the animated `CameraController.animateToDirection(...)` path with focused helper and viewer proof coverage
16. 2026-04-14 20:20:21: Prepped `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` for implementation by locking the real runtime blocker in the current helper seam: `AxisGizmo.ts` still emits only six-way `SnapDirection`, so the next pass must widen that output contract to represent corner and outer-edge targets honestly before `Viewer.ts` can route both sphere and edge hits into the existing animated camera-transition path in `CameraController.ts`
15. 2026-04-14 20:17:17: Marked `Gizmo 2 Phase 5 - Dense Connector Mesh And Lower Opacity` complete after the `AxisGizmo.ts` runtime patch replaced the sparse intermediate connector topology with the full fourteen-anchor all-pairs web, lowered connector opacity to a much fainter treatment, and widened the focused helper proof to lock the new ninety-one-segment read while keeping the connector layer outside `pickables`
14. 2026-04-14 20:13:25: Added `Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper` so the gizmo plan now reserves one explicit follow-on for the old-helper tuning surface, including separate transparency control for the twelve main edge lines versus the other connector lines, sphere size, and label visibility/size instead of leaving those style controls scattered as a loose later wishlist
13. 2026-04-14 20:11:14: Expanded `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` so it now also owns hit testing on the twelve outer helper edge lines, matching the older helper behavior where clicking an edge line should route to the corresponding edge/corner snap target instead of leaving sphere clicks as the only direct snap surface
12. 2026-04-14 20:08:23: Added `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` as the next follow-on after the dense-helper pass, so the gizmo plan now explicitly captures the user-facing snap-animation goal while keeping the runtime ownership honest: the helper still emits directions, but the actual animated camera transition belongs to `Viewer.ts` plus `CameraController.ts`
11. 2026-04-14 20:05:14: Recast `Gizmo 2 Phase 5` from a generic final stop into the explicit dense-connector implementation pass after reviewing the older helper appearance, so the next runtime slice now targets the faint all-pairs sphere web and lower-opacity line treatment instead of pretending the current corner-cage plus face-spoke read is already the intended end state
10. 2026-04-14 19:59:01: Marked `Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs` complete after the proof-only `AxisGizmo.test.ts` pass widened the helper assertions to prove the connected cage remains visual-only, the fourteen sphere meshes remain the only registered `pickables`, and the shipped `Phase 3` line geometry count still matches the intended connected helper shape
9. 2026-04-14 19:52:00: Prepped `Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs` for implementation by locking it to a proof-only pass in `AxisGizmo.test.ts`, preserving the shipped connector geometry from `Phases 2-3`, and defining the exact helper-local assertions needed to prove the line layer stays outside `pickables` while the fourteen sphere snap targets remain the sole interactive hit path
8. 2026-04-14 15:47:08: Marked `Gizmo 2 Phase 3 - Complete The Connected Cage Read` complete after the `AxisGizmo.ts` runtime patch extended the existing corner cage with twenty-four face-spoke segments from the six axis spheres into their matching face corners, making the helper read as one connected orientation object while the focused helper proof still confirms the connector layer stays outside `pickables`
7. 2026-04-14 15:44:57: Prepped `Gizmo 2 Phase 3 - Complete The Connected Cage Read` for implementation by locking the next runtime step to integrate the six axis spheres into the helper through face-spoke connections to their surrounding corner anchors, keeping the work inside `AxisGizmo.ts`, preserving non-pickable helper-only rendering, and leaving sphere-led snapping unchanged
6. 2026-04-14 15:41:51: Marked `Gizmo 2 Phase 2 - Add The First Non-Pickable Connector Layer` complete after the `AxisGizmo.ts` runtime patch landed, recording that the helper now adds one corner-only non-pickable `LineSegments` cage named `axisGizmoConnectorCage`, expands the helper disposal lists to include the new line resources, and proves the layer stays out of `pickables` through the new focused `AxisGizmo.test.ts` coverage
5. 2026-04-14 15:37:54: Prepped `Gizmo 2 Phase 2 - Add The First Non-Pickable Connector Layer` for implementation by locking the first runtime shape to one helper-local `LineSegments` layer in `AxisGizmo.ts`, defining the corner-only anchor set and twelve cube-edge connections, and narrowing the verification bar to non-pickable rendering plus unchanged sphere-led snapping so the next Codex pass can implement directly without reopening seam questions
4. 2026-04-14 15:35:28: Marked `Gizmo 2 Phase 1 - Confirm Connector-Line Seam` complete as a read-only attribution pass, locking the first anchor strategy to the eight existing corner spheres, confirming `src/viewer/overlay/AxisGizmo.ts` as the sole owner for the initial non-pickable connector layer, and recording that `src/viewer/Viewer.ts` should stay unchanged because it only instantiates the helper and forwards snap callbacks
3. 2026-04-14 15:27:51: Reworked the `Gizmo 2` subphase breakdown into explicit `## [ ]` phase sections so the future doc now matches the repo's usual implementation-plan shape instead of keeping the five-step ladder only as one nested `Subphase Ladder` block
2. 2026-04-14 15:25:27: Broke `Gizmo 2` into five smaller Codex-sized subphases so the connected-line helper pass can now ship one narrow step at a time across seam confirmation, the first non-pickable connector layer, corner-cage completion, snap-safety proofing, and final visual polish verification instead of trying to land the whole orientation-helper cleanup in one implementation pass
1. 2026-04-14 15:21:41: Added this standalone future `Gizmo 2` plan doc so the first explicit gizmo-family phase can target a narrow orientation-helper polish pass focused on lines connecting the spheres for a more connected `v15`-style spatial read while preserving the current snap-target behavior

### Purpose

This doc defines the first implementation-ready phase under the `Gizmo` subfamily.

Use it to answer:
- how the orientation helper should gain connecting lines
- why this first gizmo phase is a polish/readability phase instead of a wider runtime redesign
- which current runtime seam should own the change
- how to keep the new lines from interfering with the existing snap spheres

### Why This Phase Exists

The current orientation helper already has:
- axis cross lines
- six axis snap spheres
- eight corner/isometric snap spheres

That gives the user the click targets they need, but it still reads more like:
- an axis cross with loose points around it

than like:
- one more connected spatial object

This phase exists to recover a stronger, more connected helper read by adding lines between the sphere anchors so the sides and implied volume are clearer.

### Scope

This phase covers:
- orientation-helper polish for the connected spatial read
- lines connecting the sphere positions
- preserving the existing sphere snap targets while adding that connector structure

This phase does not cover:
- transform-manipulator trust/runtime fixes
- camera snap-direction logic changes
- toolbar controls for line opacity or size
- text labels or typography
- broader helper-placement or padding work

## Doc Body

## [ ] Gizmo 2 - Orientation Helper Polish And Connector Lines

### Header

Purpose:
- make the orientation helper read like one clearer connected spatial object by adding lines between the sphere positions

Owns:
- the first connector-line geometry for the orientation helper
- the first explicit side-readability improvement for the helper
- keeping the connector layer visually downstream from the snap spheres

Does not own:
- transform session truth
- camera-command behavior
- toolbar UI controls
- label/text systems

### Current Constraints

This phase starts from the direction locked in:
- `docs/Human-Plans/Architecture/View-Toolbar/Gizmo/Gizmo-Vision.md`
- `docs/Human-Plans/Architecture/View-Toolbar/Gizmo/Gizmo-Index.md`

Current live seams this phase should read against:
- `src/viewer/overlay/AxisGizmo.ts`
- `src/viewer/Viewer.ts`

Current code-backed read:
- `src/viewer/overlay/AxisGizmo.ts`
  - already owns the orientation-helper scene, sphere geometry, pickables, and render path
  - is therefore the primary owner for any connector-line addition
- `src/viewer/Viewer.ts`
  - mainly instantiates the helper and routes snap-direction selection outward
  - should stay downstream unless the helper API truly needs widening

Locked starting constraints:
- keep sphere snap targets as the primary clickable elements
- keep connector lines non-pickable
- keep the first pass visually narrow and easy to tune later
- keep the work inside the orientation helper instead of widening into toolbar or camera ownership

### Locked Direction

#### 1. Start With One Narrow Connector Layer

The first pass should add one helper-side connector layer, not a pile of overlapping debug lines.

Important rule:
- prefer one legible connected read over several competing line systems

#### 2. Use Existing Sphere Anchors

The first pass should treat the current sphere positions as the visual anchors for the connector lines.

Important rule:
- use the already-visible helper points as the basis for the new connected read instead of inventing a separate hidden frame first

#### 3. Snap Hit Testing Must Stay Sphere-Led

The new connector geometry should not become the primary interaction target.

Important rule:
- raycast and click behavior should remain centered on the existing spheres unless a later explicit phase says otherwise

#### 4. Build It For Later Tuning

The connector layer should be built through one shared geometry/material seam where practical so later helper tuning can adjust:
- opacity
- color
- line visibility

without redesigning the helper from scratch.

### Implementation Target

`Gizmo 2` should make one behavior shift real:

- the orientation helper should gain non-pickable lines connecting the sphere positions so the helper reads more like one connected spatial object while the current axis and corner spheres remain the actual snap targets

The minimum meaningful behavior change should be:
1. the existing helper still renders axis and corner spheres
2. a connector-line layer visually links the sphere anchors
3. the helper reads more like one connected spatial object than a loose point cloud
4. clicking the existing spheres still performs the same snap-direction actions

### Expected File Targets

Primary implementation files:
- `src/viewer/overlay/AxisGizmo.ts`

Possible supporting files:
- focused helper tests if the current helper coverage is widened
- `src/viewer/Viewer.ts` only if the helper surface needs a small API seam for future tuning

### Verification Bar

This phase is only done if it proves all of the following:
- the helper visually gains a clearer connected read through the new lines
- the connector layer does not interfere with current sphere snap behavior
- the change stays helper-local instead of widening into camera or toolbar logic

Required proof:
- verify the helper still renders and snaps correctly after the connector lines land
- verify the connector layer does not become the main click target
- verify the change remains visually narrow enough to support later tuning instead of hard-coding one inflexible style

### Implementation Order

1. `Phase 1`
   - confirm the exact connector-line seam and anchor strategy
2. `Phase 2`
   - add the first non-pickable connector layer
3. `Phase 3`
   - complete the intended connected cage read
4. `Phase 4`
   - prove snap safety and helper-local interaction behavior
5. `Phase 5`
   - verify the final polish read and stop

### Phase Guardrail

Important rule:
- do not widen this first phase into text labels, toolbar controls, or camera-view behavior just because those ideas also touch the orientation gizmo

The point of `Gizmo 2` is:
- add the connected-line polish pass cleanly
- stop there

## [x] Gizmo 2 Phase 1 - Confirm Connector-Line Seam

### Purpose

- confirm the exact helper-local seam and lock the first connector-line anchor strategy before runtime edits begin

### Owns

- code-read attribution for where the connector layer belongs
- the first exact decision on which current sphere anchors should drive the lines

### Should Answer

- whether the first pass should connect:
  - corner spheres only
  - axis spheres only
  - or a mixed anchor set
- whether `AxisGizmo.ts` alone is enough for the first pass

### Phase 1 Result

- `AxisGizmo.ts` is the correct sole owner for the first connector-line pass because it already owns:
  - helper scene construction
  - sphere creation
  - the pickable-only raycast list
  - helper-local material and geometry disposal
- `Viewer.ts` should stay unchanged for `Phase 2` because it only:
  - instantiates `AxisGizmo`
  - forwards snap-direction callbacks
  - does not own helper geometry or hit-target composition
- the first anchor strategy should connect the eight existing corner spheres only
- the six axis spheres should remain separate face-center snap targets, not part of the first cage-line topology
- the first connector layer should be added to `root` but must not be pushed into `pickables`

### Code-Backed Reasons

- `src/viewer/overlay/AxisGizmo.ts:54-57`
  - builds the helper root and calls `buildClickableGizmo()`, so helper-local visual additions belong here
- `src/viewer/overlay/AxisGizmo.ts:90-105`
  - routes pickability explicitly through `pickables`, which gives the first connector layer a clean non-pickable seam by simply not registering it there
- `src/viewer/overlay/AxisGizmo.ts:107-120`
  - already defines two useful anchor families:
  - six axis spheres at face centers
  - eight corner spheres generated as one complete corner set
- `src/viewer/overlay/AxisGizmo.ts:114-120`
  - already computes the full corner set from signed coordinates, which is the cleanest basis for a first connected cage read
- `src/viewer/Viewer.ts`
  - remains downstream of helper construction and therefore should not widen for the first connector-line pass

### Done When

- the doc locks the first narrow anchor strategy
- the primary file target is confirmed
- no wider toolbar or camera seam is required for the first runtime pass

## [x] Gizmo 2 Phase 2 - Add The First Non-Pickable Connector Layer

### Purpose

- land the smallest helper-local runtime change that adds visible connecting lines without changing snap behavior

### Owns

- one new helper-side line layer
- non-pickable connector rendering inside `AxisGizmo.ts`

### Locked Implementation Shape

- add exactly one new `LineSegments` layer under `root`
- build that layer inside `AxisGizmo.ts`
- keep the layer out of `pickables`
- keep `Viewer.ts` unchanged
- reuse the already locked corner-anchor strategy from `Phase 1`

### Connector Topology

Use the eight existing corner-sphere positions as cube corners and connect them with the twelve cube edges:

- four top-face edges
- four bottom-face edges
- four vertical edges

Important rule:
- this phase should not connect axis spheres yet
- this phase should not add diagonals
- this phase should not add a second line family

### Expected Runtime Additions

The intended first-pass additions inside `AxisGizmo.ts` are:
- `BufferGeometry`
  - to hold the connector edge points
- `LineBasicMaterial`
  - for one shared connector-line material
- `LineSegments`
  - for one non-pickable connector-line object

The current disposal pattern should expand to cover:
- the new line geometry
- the new line material

### Expected File Targets

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

No-widening rule:
- do not touch `src/viewer/Viewer.ts` for `Phase 2`
- do not add toolbar seams
- do not add tuning controls

### Phase 2 Verification Target

This phase should be considered successful if all of the following are true:
- the helper renders one visible connector-cage layer
- that layer follows the corner-only cube-edge pattern
- the layer is not part of `pickables`
- clicking the spheres still performs the same snap-direction actions

### Suggested Implementation Order

1. Add the line-rendering imports and one helper-local connector material/geometry seam.
2. Capture or reconstruct the eight corner positions in a form that can also feed a `LineSegments` geometry.
3. Build one cube-edge point list from those corner anchors.
4. Add the resulting `LineSegments` object to `root` without registering it in `pickables`.
5. Extend disposal so the new line resources are cleaned up alongside the existing sphere resources.

### Phase 2 Result

- `AxisGizmo.ts` now imports and uses:
  - `BufferGeometry`
  - `LineBasicMaterial`
  - `LineSegments`
- the helper now collects the existing corner-sphere positions while building the clickable spheres
- one helper-local connector cage is built from the twelve corner-only cube edges
- that line object is added under `root` as `axisGizmoConnectorCage`
- the connector layer is not registered in `pickables`, so sphere-led snapping remains the active interaction path
- the helper material/geometry disposal arrays now include the connector-line resources alongside the sphere resources
- focused proof coverage now exists in `src/viewer/overlay/AxisGizmo.test.ts`

### Done When

- the helper renders one clear new connector layer
- the new lines do not become the main click target
- sphere snapping still works as before

## [x] Gizmo 2 Phase 3 - Complete The Connected Cage Read

### Purpose

- finish the first full connected spatial read after the initial line layer proves safe

### Owns

- completing the intended line set for the first `v15`-style connected read
- making the helper sides and implied volume clearly legible instead of partially connected

### Locked Implementation Shape

- keep the existing corner-only cube-edge cage from `Phase 2`
- add axis-sphere integration lines so the six face-center spheres no longer read like disconnected floating points
- keep the new lines helper-local and non-pickable
- keep `Viewer.ts` unchanged

### Connector Topology

Use the six existing axis spheres as face centers and connect each one to the four corner anchors on its matching cube face:

- `+X` sphere -> the four `x = +1` corners
- `-X` sphere -> the four `x = -1` corners
- `+Y` sphere -> the four `y = +1` corners
- `-Y` sphere -> the four `y = -1` corners
- `+Z` sphere -> the four `z = +1` corners
- `-Z` sphere -> the four `z = -1` corners

This produces:
- twenty-four new face-spoke segments

Important rule:
- keep the already-landed corner cage
- do not add diagonals between opposite faces
- do not change the snap targets
- do not widen into text labels or toolbar controls

### Expected Runtime Shape

The intended first completion read after `Phase 3` is:
- one outer corner cage
- plus one set of face-spoke lines that visually ties each axis sphere into that cage

That should make the helper read less like:
- a cube plus six detached markers

and more like:
- one connected orientation object

### Expected File Targets

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

Possible supporting proof file:
- `src/viewer/overlay/AxisGizmo.test.ts`

No-widening rule:
- do not touch `src/viewer/Viewer.ts`
- do not add toolbar seams
- do not add tuning controls in this phase

### Phase 3 Verification Target

This phase should be considered successful if all of the following are true:
- the helper keeps the existing corner cage from `Phase 2`
- each axis sphere is visually tied into the helper by face-spoke lines
- the added lines remain outside `pickables`
- clicking the spheres still performs the same snap-direction actions

### Suggested Implementation Order

1. Capture or reconstruct the six axis-sphere positions in a form that can also feed line geometry.
2. Build the twenty-four face-spoke segments from each axis sphere to its four matching face corners.
3. Add those segments to the helper-local line geometry path without widening hit testing.
4. Extend focused helper proof coverage so the connected read is verified without changing sphere-led snapping.

### Phase 3 Result

- `AxisGizmo.ts` now captures both:
  - the eight corner-sphere positions
  - the six axis-sphere positions
- the helper connector geometry now includes:
  - the existing twelve corner-cage edges
  - plus twenty-four face-spoke segments from the six axis spheres into their matching face corners
- the helper now reads as:
  - one outer corner cage
  - plus one integrated face-center spoke structure
- the connector object remains `axisGizmoConnectorCage`
- the connector layer still stays outside `pickables`, so the interaction path remains sphere-led
- focused proof coverage now validates the expanded connected read through the updated vertex count in `src/viewer/overlay/AxisGizmo.test.ts`

### Done When

- the helper no longer reads like a loose point cloud
- the intended first cage/connector pattern is visually complete
- no extra debug-style line clutter was introduced

## [x] Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs

### Purpose

- add or widen focused proof coverage so the connector pass stays helper-local and does not regress snap interaction

### Owns

- proof that the connector layer is non-pickable
- proof that sphere-led snap behavior remains intact

### Locked Implementation Shape

- keep the shipped helper geometry from `Phases 2-3` unchanged
- treat `Phase 4` as a proof-only pass
- keep the work centered in `src/viewer/overlay/AxisGizmo.test.ts`
- leave `src/viewer/overlay/AxisGizmo.ts` unchanged unless the proof reveals a real correctness gap
- keep `src/viewer/Viewer.ts` untouched

Important rule:
- this phase should prove interaction safety, not widen the helper visuals again

### Proof Targets

`Phase 4` should lock the helper interaction contract through explicit assertions that:

- exactly fourteen sphere snap targets remain registered in `pickables`
- every entry in `pickables` is still a sphere-backed snap target rather than a line object
- the connector object named `axisGizmoConnectorCage` is present in the helper scene
- that connector object is not registered in `pickables`
- the connected helper still exposes the expected line-geometry count from `Phase 3`

Important rule:
- prefer direct helper-structure proofs over wider viewer-level interaction tests in this phase

### Expected File Targets

Primary proof file:
- `src/viewer/overlay/AxisGizmo.test.ts`

No-widening rule:
- do not add `Viewer.ts` coverage unless the helper-level proof cannot establish the interaction contract
- do not add toolbar or camera tests
- do not change the helper line topology in this phase

### Suggested Implementation Order

1. Expand the existing connected-cage test or split it into a small proof group inside `AxisGizmo.test.ts`.
2. Assert that `pickables.length` still equals:
   - `14`
3. Assert that every current pickable remains a `Mesh` using the sphere geometry path rather than a `LineSegments` object.
4. Re-assert that `axisGizmoConnectorCage` exists but is excluded from `pickables`.
5. Keep the existing connector-geometry-count proof so the interaction assertions still point at the shipped `Phase 3` shape.

### Phase 4 Verification Goal

When this phase lands, the repo should have proof that:

- the helper's connected line work is visual only
- the fourteen sphere snap targets remain the only registered hit targets
- the connector cage stays helper-local and non-pickable by test, not assumption

### Phase 4 Result

- `src/viewer/overlay/AxisGizmo.test.ts` now proves the connected helper remains interaction-safe by asserting:
  - `pickables.length === 14`
  - every pickable remains a sphere-backed `Mesh`
  - `axisGizmoConnectorCage` exists but is excluded from `pickables`
  - the shipped `Phase 3` connector geometry still exposes the expected seventy-two position vertices
- no runtime helper geometry changed in this phase
- `src/viewer/overlay/AxisGizmo.ts` stayed untouched because the helper contract already held once the proof was widened

### Done When

- focused proof coverage exists for the connected-line helper path
- the snap targets remain sphere-led by proof, not assumption

## [x] Gizmo 2 Phase 5 - Dense Connector Mesh And Lower Opacity

### Purpose

- complete the denser old-helper read by adding the faint full connector web between the visible sphere anchors and reducing connector opacity so the lines support the spheres instead of overpowering them

### Owns

- the dense all-pairs connector pass for the orientation helper
- the first helper-local opacity reduction for the connector lines

### Locked Implementation Shape

- keep the fourteen existing sphere anchors:
  - six axis spheres
  - eight corner spheres
- keep the connector layer non-pickable
- keep the work inside `src/viewer/overlay/AxisGizmo.ts`
- keep `src/viewer/overlay/AxisGizmo.test.ts` as the focused proof file
- keep `src/viewer/Viewer.ts` untouched

Important rule:
- this phase should widen the helper line topology and line treatment only
- do not widen into labels, toolbar controls, or camera-command behavior

### Connector Topology

The target read for this phase is the dense old-helper web:

- every visible sphere anchor should connect to every other visible sphere anchor

With the current helper anchor set, that means:

- fourteen total anchors
- ninety-one total unique line segments

Important rule:
- treat the current `Phase 3` cage plus face-spoke structure as an intermediate shape, not the final line layout
- this phase should replace that sparse/intermediate read with the denser full-web read the user is aiming to recover

### Line Treatment

The denser connector web should also reduce visual weight compared with the current helper.

Locked direction:
- lower the connector opacity substantially from the current stronger line treatment
- keep the lines faint enough that the spheres remain the primary visual targets
- prefer one shared connector material so later tuning can still happen from one helper-local seam

### Expected Runtime Result

After this phase:

- the helper should read as a faint spatial web behind the spheres
- the line field should feel much closer to the denser old-helper appearance
- the spheres should remain the dominant click and scan targets

### Expected File Targets

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

Primary proof file:
- `src/viewer/overlay/AxisGizmo.test.ts`

### Verification Target

This phase should be considered successful if all of the following are true:

- the helper now builds the dense all-pairs connector mesh across the fourteen sphere anchors
- the connector layer remains outside `pickables`
- the helper proof reflects the denser segment count
- the reduced-opacity treatment still leaves the spheres visually primary

### Suggested Implementation Order

1. Collect the full ordered anchor list for the six axis spheres plus eight corner spheres.
2. Build the unique all-pairs connector set across those fourteen anchors.
3. Replace the current sparse/intermediate connector geometry with the dense web geometry.
4. Reduce connector opacity to a much fainter treatment closer to the old helper appearance.
5. Update the focused helper proof to match the new dense connector count while re-proving non-pickable behavior.

### Phase 5 Result

- `src/viewer/overlay/AxisGizmo.ts` now builds the connector layer from the full ordered set of:
  - six axis spheres
  - eight corner spheres
- the helper connector layer now uses the full all-pairs web across those fourteen anchors:
  - ninety-one unique segments
  - one hundred eighty-two position vertices in the `LineSegments` geometry
- connector opacity is now reduced to a much fainter treatment so the web reads as background structure behind the spheres instead of as a dominant cage
- the connector object remains `axisGizmoConnectorCage`
- the connector layer still stays outside `pickables`, so sphere-led snapping remains intact
- `src/viewer/overlay/AxisGizmo.test.ts` now proves:
  - the denser one-hundred-eighty-two-position geometry count
  - the lower-opacity line treatment
  - continued non-pickable connector behavior

### Done When

- the helper reads as the intended dense faint connector web rather than only a sparse cage-plus-spokes structure
- the connector layer still stays visual-only and sphere-led snapping remains intact
- the next remaining step can be a true final polish/readability stop rather than another missing runtime topology pass

## [x] Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets

### Purpose

- make orientation-gizmo snapping feel closer to the older helper by animating the camera toward the selected target and by letting the twelve outer edge lines act as direct snap targets in addition to the spheres

### Owns

- the gizmo-triggered camera-snap animation follow-on
- the handoff between orientation-target selection and animated camera motion
- the first edge-line hit-target pass for the orientation helper

### Locked Ownership Direction

This phase is in the gizmo plan because it is part of the orientation-helper user experience, but the runtime owners should stay split:

- `src/viewer/overlay/AxisGizmo.ts`
  - owns helper hit testing
  - emits the chosen snap target from spheres or edge lines
- `src/viewer/Viewer.ts`
  - owns converting the gizmo click into the camera command
- `src/viewer/scene/CameraController.ts`
  - owns the actual animated transition math and timing

Important rule:
- do not move camera animation logic into `AxisGizmo.ts`

### Locked Implementation Shape

- preserve the existing sphere snap targets
- add direct hit-target behavior for the twelve outer cube-edge lines
- map each edge-line hit to the corresponding edge/corner orientation target
- widen the current helper output seam so it can represent:
  - axis targets
  - corner targets
  - outer-edge targets
- switch the orientation-target camera response from immediate snap to animated snap
- prefer the existing `CameraController` transition path over inventing a second animation system

Important rule:
- only the twelve outer helper edge lines should become snap hit targets in this phase
- the dense interior web from `Phase 5` should remain visual-only

### Current Runtime Blocker

The current helper output seam is too narrow for this phase as written.

Current code truth:

- `src/viewer/overlay/AxisGizmo.ts`
  - still reduces every hit to the six-way `SnapDirection` union:
    - `+X`
    - `-X`
    - `+Y`
    - `-Y`
    - `+Z`
    - `-Z`
- corner spheres therefore cannot currently preserve their true corner orientation target
- outer edge lines also cannot route to the correct edge/corner target while that six-way seam remains in place

Implementation-ready rule:
- the next runtime pass must widen the emitted target contract before adding edge-line hit behavior
- do not fake corner or edge snaps by collapsing them back to the nearest axis token

### Locked Target Contract Direction

The next pass should use one richer helper target contract that can drive both:

- direct sphere hits
- outer-edge line hits

Acceptable shapes include:

- one explicit orientation-target object carrying a direction vector
- one helper-local target enum plus a resolver to the intended direction vector

Important rule:
- whatever shape lands, it should preserve real corner targets and real edge targets instead of forcing them back through the old six-axis union

### Expected Runtime Result

After this phase:

- clicking an orientation sphere should animate the camera into the requested orientation
- clicking one of the twelve outer helper edge lines should also trigger the corresponding edge/corner snap
- the result should feel like one intentional view transition instead of a hard jump
- the dense interior helper web should remain non-pickable background structure
- the gizmo should still remain a target-selection helper, not a camera-animation owner

### Verification Target

This phase should be considered successful if all of the following are true:

- orientation-gizmo clicks now route through an animated camera transition
- the twelve outer helper edge lines now behave as direct snap targets
- edge-line hits resolve to the intended edge/corner snap orientations
- corner-sphere hits preserve their true corner targets instead of collapsing back to the nearest axis-only token
- the animated snap preserves the intended target direction and upright behavior
- the dense interior helper web remains outside the snap hit path
- the implementation reuses the current camera-transition seam instead of adding a second animation model

### Suggested Implementation Order

1. Replace the current six-way `SnapDirection`-only helper output with one richer orientation-target seam that can represent axis, corner, and outer-edge targets honestly.
2. Extend `AxisGizmo.ts` hit testing so corner spheres and the twelve outer edge lines both emit the correct orientation targets while the dense interior web stays non-pickable.
3. Update `Viewer.ts` so orientation-target snaps call the animated camera path instead of the immediate snap path.
4. Reuse or tighten the existing `CameraController.animateToDirection(...)` seam for the snap transition.
5. Add focused proof that corner-sphere hits and outer-edge hits both route through the animated transition path without making the interior connector web interactive.

### Expected File Targets

Primary runtime files:
- `src/viewer/overlay/AxisGizmo.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`

Primary supporting proof files:
- `src/viewer/overlay/AxisGizmo.test.ts`
- `src/viewer/Viewer.test.ts`

Possible supporting proof file:
- `src/viewer/scene/CameraController.test.ts`

### Phase 6 Result Target

When this phase lands, the repo should have:

- one honest orientation-target contract for axis, corner, and outer-edge helper hits
- animated camera snapping from orientation-target clicks
- correct corner and edge target routing without collapsing them back to the old six-axis-only seam
- continued non-pickable dense interior connector behavior

### Phase 6 Result

- `src/viewer/overlay/AxisGizmo.ts` now emits a richer `AxisGizmoTarget` contract instead of collapsing every helper hit into the old six-way `SnapDirection` union
- corner spheres now preserve their true corner targets
- the twelve outer helper edge lines now exist as direct snap hit targets with edge-orientation targets
- the dense interior connector web remains visual-only under `axisGizmoConnectorCage`
- `src/viewer/Viewer.ts` now routes orientation-helper targets through one animated camera path instead of the old immediate snap path
- `src/viewer/scene/CameraController.ts` continues to own the actual transition math through the existing `animateToDirection(...)` seam
- focused proof now exists in:
  - `src/viewer/overlay/AxisGizmo.test.ts`
  - `src/viewer/Viewer.test.ts`

### Done When

- orientation-target snaps animate instead of teleporting
- sphere hits and outer-edge hits both snap correctly
- the camera-animation ownership stays in the viewer/camera path rather than the helper
- the gizmo-family plan can stop after this with later tuning left to camera-specific follow-ons

## [x] Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper

### Purpose

- add the first explicit style-control surface for the orientation helper so the denser old-helper look can be tuned without rewriting helper geometry again

### Owns

- style controls for the twelve main outer edge lines
- style controls for the other connector lines in the helper web
- sphere-size control
- text visibility and text-size control for the axis labels

### Locked Style Control Set

The first control set for this phase should include:

- main twelve line transparency
- other line transparency
- sphere size
- text on/off
- text size

Text means the visible axis labels such as:

- `X`
- `Y`
- `Z`
- negative-axis labels where shown

### Locked Ownership Direction

This phase is about helper presentation, not camera behavior or transform semantics.

Expected owners:

- `src/app/components/ViewToolbar.tsx`
  - the visible `Gizmo` section in the `View` toolbar
  - hosting the new `ParaSlider` and `ParaSelect` controls
- `src/viewer/overlay/AxisGizmo.ts`
  - helper rendering seam
  - applying the live style values
- the helper-facing settings source used by the orientation gizmo
  - if a new seam is needed, keep it narrow and helper-specific

Important rule:
- do not mix these helper-style controls into transform-gizmo controls
- do not widen this phase into camera snap logic or toolbar grouping cleanup
- do put the user-facing controls in the `View` toolbar's `Gizmo` section rather than in a separate floating helper panel

### Locked Implementation Shape

- use `ParaSlider` / `ParaSelect` controls in the `Gizmo` section of `src/app/components/ViewToolbar.tsx`
- keep the line-family split explicit:
  - the twelve outer edge lines
  - the remaining connector-web lines
- allow those two line families to use different transparency values
- keep sphere sizing separate from line transparency
- keep label visibility separate from label size
- preserve the already-landed snap behavior while changing only presentation controls in this phase

### Expected Runtime Result

After this phase:

- the older helper look can be tuned without editing geometry code again
- the twelve main edge lines can be made stronger or weaker independently from the dense interior web
- spheres can be scaled to better match the old helper feel
- labels can be turned on or off and resized without rewriting the helper
- the user can access those controls from the `View` toolbar `Gizmo` section instead of needing a hidden helper-only settings surface

### Expected File Targets

Primary toolbar file:
- `src/app/components/ViewToolbar.tsx`

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

Possible supporting files:
- the helper-facing settings seam if one is introduced
- focused helper proof for the new style-control contract
- `src/app/components/ViewToolbar.test.tsx`

### Verification Target

This phase should be considered successful if all of the following are true:

- the helper exposes separate transparency control for the twelve main edge lines and the other connector lines
- sphere size is adjustable through the intended helper-style seam
- label visibility and label size are adjustable through the intended helper-style seam
- the style controls do not weaken the already-landed snap targets or camera-snap behavior

### Suggested Implementation Order

1. Split the helper connector rendering into the two intended style families:
   - twelve outer edge lines
   - other connector lines
2. Add the user-facing `ParaSlider` / `ParaSelect` controls to the `Gizmo` section of `src/app/components/ViewToolbar.tsx`.
3. Add one narrow helper-style seam that can publish the required values from that toolbar surface without widening into unrelated camera settings.
4. Route sphere size through the same helper-style seam.
5. Route label visibility and label size through that seam.
6. Add focused proof that the toolbar controls publish the intended values and that the helper accepts them without changing snap ownership.

### Phase 7 Result

- `src/shared/viewSettingsTypes.ts` now defines one shared `axisOverlayStyle` settings block for:
  - main outer-edge line opacity
  - dense connector-web opacity
  - sphere scale
  - label visibility
  - label size
- `src/app/components/ViewToolbar.tsx` now exposes those values in the `View` toolbar `Gizmo` section through:
  - `ParaSlider` controls for main lines, other lines, and sphere size
  - `ParaSelect` controls for labels on/off and text size
- `src/viewer/Viewer.ts` now forwards the shared helper-style settings into the live orientation helper through the existing view-settings application path
- `src/viewer/overlay/AxisGizmo.ts` now:
  - applies separate opacity values to the twelve outer edge lines and the dense interior connector web
  - scales the snap spheres from the shared helper-style seam
  - renders axis labels and applies label visibility plus size from that same seam
- focused proof now exists in:
  - `src/viewer/overlay/AxisGizmo.test.ts`
  - `src/viewer/Viewer.test.ts`
  - `src/app/components/ViewToolbar.test.tsx`

### Done When

- the orientation helper exposes the requested v15-style controls
- those controls live in the `View` toolbar `Gizmo` section through `ParaSlider` / `ParaSelect`
- the helper can be tuned toward the old look without rewriting geometry again
- later polish can happen through those controls instead of one-off rendering patches

## [x] Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback

### Purpose

- add one explicit hover-feedback polish pass for snap-capable lines so the default helper read stays subtle until the user hovers a line that can actually snap

### Owns

- the default transparency treatment for snap-capable outer lines
- the hover transparency lift / highlight effect for snap-capable lines
- keeping hover emphasis focused on real snap targets instead of the dense interior helper web

### Locked Interaction Goal

This phase should make the orientation helper feel more intentional during hover.

Expected user-facing result:

- snap-capable lines can stay relatively faint by default
- when the user hovers one of those lines, the line visibly strengthens
- the user gets a clearer read that the hovered line is a valid snap target

Important rule:
- do not give the dense interior connector web the same hover-promoted treatment as the real snap-capable outer lines

### Locked Ownership Direction

This phase is still about helper presentation and helper feedback, not camera policy.

Expected owners:

- `src/viewer/overlay/AxisGizmo.ts`
  - apply the default and hovered line treatments at the helper-rendering seam
  - detect or respond to helper-local hover state for snap-capable line targets
- `src/app/components/ViewToolbar.tsx`
  - if the final implementation exposes the default transparency values as user-facing controls, keep them in the `View` toolbar `Gizmo` section through the already-planned `Phase 7` style surface

Important rule:
- keep the hover highlight behavior local to the orientation helper
- do not widen this phase into camera snap animation logic
- do not turn the dense interior web into a highlighted snap surface

### Current Runtime Starting Point

This phase now starts from the shipped `Phase 7` helper-style seam rather than from scratch.

Current code truth:

- `src/shared/viewSettingsTypes.ts`
  - already defines one shared `axisOverlayStyle` settings block for helper presentation
- `src/app/components/ViewToolbar.tsx`
  - already exposes helper-style controls in the `View` toolbar `Gizmo` section
- `src/viewer/Viewer.ts`
  - already forwards the shared helper-style values into the live orientation helper
- `src/viewer/overlay/AxisGizmo.ts`
  - already owns separate material treatment for:
    - the twelve snap-capable outer edge lines
    - the dense interior connector web

Implementation-ready rule:
- `Phase 8` should extend that existing helper-style seam with hover-state presentation rather than inventing a second hover-only settings path

### Locked Implementation Shape

- keep the dense interior web visually quiet and non-promoted during hover
- keep the promoted hover treatment specific to the snap-capable outer edge lines
- use helper-local hover detection in `src/viewer/overlay/AxisGizmo.ts`
- continue to let the toolbar-published `axisOverlayStyle` values own the default/resting line treatment
- if a new helper-style value is truly needed for hovered strength, add it to the existing `axisOverlayStyle` seam instead of creating a one-off local constant hidden in the helper

Important rule:
- do not make hover a prerequisite for snapping correctness
- do not widen this phase into sphere-hover styling unless the line-hover implementation truly requires a matching visual balance pass
- do not move hover ownership into `Viewer.ts`

### Locked Value Direction

This phase should cover both:

- baseline/default transparency for the snap-capable outer lines
- stronger hovered transparency for the currently hovered snap-capable line

The intended style split is:

- snap-capable outer lines
  - lower default transparency
  - stronger hovered transparency
- dense interior web
  - stays subdued background structure
  - does not receive the same promoted hover effect

### Expected Runtime Result

After this phase:

- snap-capable lines remain readable but restrained at rest
- hovering a snap-capable line makes that line stand out more clearly
- the hover treatment helps users discover which lines can actually be clicked for snapping
- the dense connector web still supports spatial readability without competing with the hover-highlighted snap line

Implementation-ready clarification:
- the default/resting transparency should remain the baseline look
- hover should temporarily promote only the currently hovered snap-capable outer edge line
- leaving the line should restore the default/resting treatment cleanly

### Expected File Targets

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

Possible supporting files:
- `src/shared/viewSettingsTypes.ts` if the hovered-strength value is added to the existing helper-style seam
- `src/app/components/ViewToolbar.tsx` if that hovered-strength value is surfaced through the existing `Gizmo` controls
- `src/viewer/Viewer.ts` only if the shared helper-style seam needs one narrow forwarding update
- `src/viewer/overlay/AxisGizmo.test.ts`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx` only if the helper-shell background read is affected by the hover treatment

### Verification Target

This phase should be considered successful if all of the following are true:

- snap-capable outer lines use the intended default transparency treatment
- hovering a snap-capable line visibly increases its transparency/strength relative to rest state
- the hover treatment does not incorrectly promote the dense interior web
- hover feedback does not break the already-landed snap-target routing
- leaving a hovered line restores the expected default/resting treatment without stale highlight state
- the promoted hover treatment remains helper-local and does not require camera-path changes

### Suggested Implementation Order

1. Lock the helper-local split between snap-capable outer lines and the dense interior connector web against the already-shipped `Phase 7` style seam.
2. Decide whether hovered line strength can reuse the existing default values or needs one additional shared helper-style value.
3. Add helper-local hover detection for the snap-capable outer edge lines in `src/viewer/overlay/AxisGizmo.ts`.
4. Apply the promoted hover treatment only to the currently hovered snap-capable line and keep the dense interior web visually unchanged.
5. Restore the default/resting treatment cleanly when the pointer leaves the line or the helper canvas.
6. Add focused proof that hover state changes only the intended snap-capable line presentation without widening the snap hit path.

### Phase 8 Result

- `src/viewer/overlay/AxisGizmo.ts` now keeps hover ownership local to the orientation helper through:
  - pointer-move detection on the helper canvas
  - helper-local tracking of the currently hovered snap-capable outer edge line
  - clean restoration of the default line treatment on pointer leave
- the twelve outer edge lines now use per-line material treatment so only the currently hovered snap-capable line receives the promoted hover opacity
- the dense interior connector web remains visually unchanged during hover and does not become a promoted snap surface
- hovered outer-edge line strength now derives from the existing default outer-line opacity rather than requiring a second hover-only toolbar control
- focused proof now exists in:
  - `src/viewer/overlay/AxisGizmo.test.ts`
  - `src/viewer/Viewer.test.ts`

### Done When

- default snap-line transparency can be tuned independently from hovered snap-line strength
- hovering a valid snap-capable line clearly promotes it visually
- the dense interior web remains a subdued background layer
- the helper gains stronger hover affordance without widening into unrelated camera or toolbar cleanup

## [x] Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing

### Purpose

- add one explicit camera-framing polish pass for the gizmo viewport so the helper can be zoomed in or out from the `View` toolbar and the default helper read starts slightly smaller than the current too-close framing

### Owns

- the gizmo viewport camera distance / dolly framing seam
- one new `ParaSlider` in the `View` toolbar `Gizmo` section for gizmo viewport zoom
- the slightly zoomed-out default helper framing

### Why This Phase Exists

The current orientation helper camera sits a little too close to the helper geometry.

That makes the default read feel cramped:

- spheres feel too large in the viewport
- the helper fills too much of the gizmo shell
- the denser line field can feel crowded against the widget edges

This phase exists to:

- pull the default gizmo viewport camera back a bit
- let the user tune that camera framing directly

### Locked Ownership Direction

This is still a gizmo-viewport presentation phase, not a world-camera phase.

Expected owners:

- `src/app/components/ViewToolbar.tsx`
  - add the new `ParaSlider` to the `View` toolbar `Gizmo` section
- the shared helper-style/settings seam
  - publish the gizmo viewport camera framing value
- `src/viewer/overlay/AxisGizmo.ts`
  - apply that framing value to the helper camera that renders the gizmo viewport

Important rule:
- do not confuse the gizmo viewport camera with the main model camera
- do not widen this phase into orbit behavior, fly behavior, or snap-direction logic
- keep the framing change local to the gizmo helper camera

### Current Runtime Starting Point

This phase now has one explicit code-backed starting seam.

Current code truth:

- `src/viewer/overlay/AxisGizmo.ts`
  - constructs one helper-local `PerspectiveCamera(50, 1, 0.1, 10)`
  - currently hard-codes the gizmo viewport camera position to `z = 3.1`
  - therefore already owns the exact framing seam this phase needs to widen
- `src/shared/viewSettingsTypes.ts`
  - already defines one shared `axisOverlayStyle` settings block used by the helper
- `src/app/components/ViewToolbar.tsx`
  - already exposes the existing gizmo helper sliders/selects in one `Gizmo` section
- `src/viewer/Viewer.ts`
  - already forwards the shared helper-style values into the live helper

Implementation-ready rule:
- `Phase 9` should extend the existing shared `axisOverlayStyle` seam with one gizmo-camera framing value instead of inventing a second helper-settings object
- the runtime pass should change the helper camera position or equivalent camera-framing seam, not the helper geometry itself

### Locked Implementation Shape

- add one new gizmo viewport zoom/dolly slider through `ParaSlider`
- use that slider to control the helper camera distance or equivalent framing seam in `AxisGizmo.ts`
- adjust the shipped default framing so the helper appears a little smaller out of the box
- preserve the current helper orientation and snap targeting while changing only the helper viewport framing

Implementation-ready clarification:

- prefer one explicit shared value such as helper camera distance / dolly distance over a vague zoom-mode flag
- prefer camera-position framing over field-of-view changes for the first pass so the helper proportions stay stable
- keep this control orthogonal to the already-shipped `sphereScale` slider:
  - `sphereScale`
    - changes helper geometry size
  - helper camera distance
    - changes viewport framing
- the default should move modestly farther out than the current `3.1` read so the helper starts slightly smaller without feeling remote

Important rule:
- this phase is about helper-camera framing, not helper geometry scale
- do not fake the result by shrinking all spheres/labels/lines instead of adjusting the helper camera

### Expected Runtime Result

After this phase:

- the default gizmo helper appears slightly smaller and less cramped
- the user can zoom the gizmo viewport camera in or out through one slider in the `Gizmo` section
- the helper still tracks orientation normally
- snap targeting still behaves exactly the same

### Expected File Targets

Primary toolbar file:
- `src/app/components/ViewToolbar.tsx`

Primary runtime file:
- `src/viewer/overlay/AxisGizmo.ts`

Possible supporting files:
- `src/shared/viewSettingsTypes.ts` if the helper-style/settings seam needs one new framing value
- `src/viewer/Viewer.ts` only if the shared helper-style/settings seam needs one narrow forwarding update
- `src/app/components/ViewToolbar.test.tsx`
- `src/viewer/overlay/AxisGizmo.test.ts`
- `src/viewer/Viewer.test.ts`

### Verification Target

This phase should be considered successful if all of the following are true:

- the gizmo viewport camera starts slightly more zoomed out by default
- the new slider changes the helper-camera framing rather than helper geometry scale
- the helper still renders and orients correctly after framing changes
- snap-target routing remains unchanged

### Suggested Implementation Order

1. Add one helper-camera framing value to the existing shared helper-style/settings seam if needed.
2. Add the new `ParaSlider` to the `View` toolbar `Gizmo` section.
3. Route that value into `AxisGizmo.ts`.
4. Apply it to the gizmo viewport camera position or equivalent framing seam.
5. Set the default framing slightly farther out than the current shipped read.
6. Add focused proof that the slider changes helper-camera framing without changing snap ownership.

### Phase 9 Result Target

When this phase lands, the repo should have:

- one shared helper-style value for gizmo viewport camera framing
- one `ParaSlider` in the `View` toolbar `Gizmo` section that controls that framing
- a slightly more zoomed-out default helper read than the current `z = 3.1` camera position
- unchanged snap targeting, helper geometry, and main scene camera behavior

### Done When

- the gizmo helper no longer feels too zoomed in by default
- the user can tune gizmo viewport dolly/zoom through the `Gizmo` controls
- the change remains local to the gizmo viewport camera rather than leaking into the main scene camera

### Phase 9 Result

- `src/shared/viewSettingsTypes.ts` now includes one shared `cameraDistance` value in `axisOverlayStyle`, with a slightly more zoomed-out default than the old hard-coded helper-camera read
- `src/app/components/ViewToolbar.tsx` now exposes a `Camera Dolly` `ParaSlider` in the `View` toolbar `Gizmo` section
- `src/viewer/overlay/AxisGizmo.ts` now applies that shared value to the helper-local `PerspectiveCamera`, keeping the framing change local to the gizmo viewport camera rather than faking it through helper-geometry scale
- focused proof now exists in:
  - `src/viewer/overlay/AxisGizmo.test.ts`
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/viewer/Viewer.test.ts`

## [x] Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space

### Purpose

- let the user orbit the main model viewport with a simple left click and drag when the pointer is inside the gizmo viewport, instead of treating the gizmo viewport only as a click-to-snap surface

### Owns

- the pointer-entry rule for left-drag orbit when the pointer is over the gizmo viewport
- the first simple drag-to-orbit interaction path from the gizmo viewport into the main model camera

### Does Not Own

- free-fly behavior
- gizmo connector visuals
- transform manipulator semantics
- wider orbit control redesign outside the gizmo viewport entry rule

### Why This Phase Exists

The current gizmo viewport already supports:

- orientation-target clicks
- animated snap behavior
- helper visual tuning

What it still does not support is:

- simple direct orbiting from the gizmo viewport itself

That means the user can use the gizmo viewport for discrete snap targets, but not for continuous drag orbit when the pointer is already there.

This phase exists to make one simple interaction true:

- when the user's pointer is in the gizmo viewport, a plain left click and drag should orbit the main model viewport

### Locked Ownership Direction

This is a gizmo-entry interaction phase, but not a gizmo-owned camera phase.

Expected owners:

- `src/app/components/ViewportOverlay.tsx`
  - the live gizmo viewport shell and pointer-entry surface
- `src/viewer/Viewer.ts`
  - route gizmo-viewport drag intent into the existing orbit path
- `src/viewer/scene/CameraController.ts`
  - continue to own the actual orbit/camera behavior

Important rule:
- do not move main camera truth into `AxisGizmo.ts`
- do not teach the orientation helper camera itself to orbit the model
- do keep the actual orbit command on the viewer/camera side even if drag capture begins over the gizmo viewport

### Implementation-Ready Read

The current helper seam is not implementation-ready as-is for drag orbit because:

- `AxisGizmo.ts` currently resolves snap targets immediately on `pointerdown`
- that means the old helper contract does not yet distinguish:
  - click-only snap intent
  - drag-to-orbit intent

The next runtime pass should therefore lock to this interaction split:

- pointerdown inside the gizmo viewport should begin a pending helper interaction, not immediately commit a snap
- a small drag threshold should decide whether the gesture becomes:
  - click-to-snap
  - or temporary orbit drag
- once that threshold is crossed, the gesture should route through the existing temporary orbit seam in `Viewer.ts`
- releasing without crossing the threshold should preserve the current snap behavior

Important rule:
- do not invent a second orbit implementation for gizmo drag
- do not make `AxisGizmo.ts` the owner of main orbit behavior
- do reuse `beginTemporaryOrbitDrag(...)`, `updateTemporaryOrbitDrag(...)`, and `endTemporaryOrbitDrag()` in `Viewer.ts`

### Locked Interaction Goal

After this phase:

- left click and drag inside the gizmo viewport should orbit the model viewport
- releasing the drag should end that temporary orbit interaction cleanly
- simple click behavior for snap targets should still work

Important rule:
- dragging should not make sphere and edge click-to-snap unusable
- a click without meaningful drag should still resolve as the existing gizmo snap interaction

### Expected Runtime Result

This phase should make one user-facing behavior real:

- the gizmo viewport becomes a valid continuous orbit-entry surface for the main model camera while preserving existing snap-target clicks

### Expected File Targets

Primary runtime files:
- `src/viewer/overlay/AxisGizmo.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`

Possible supporting proof files:
- `src/app/components/ViewportOverlay.test.tsx`
- `src/viewer/Viewer.test.ts`
- `src/viewer/scene/CameraController.test.ts`

### Phase 10 Result

The shipped runtime pass made this interaction real through the narrowest honest seam:

- `AxisGizmo.ts`
  - now starts a pending left-pointer interaction instead of committing snap immediately on `pointerdown`
  - resolves click-only gestures as the existing snap action on pointer release
  - switches to orbit intent only after a small drag threshold is crossed
- `Viewer.ts`
  - now receives helper-local orbit drag start, move, and end callbacks
  - reuses the existing temporary orbit path instead of inventing a gizmo-only orbit implementation

Important result:
- the gizmo viewport can now act as a simple left-drag orbit entry surface
- click-only sphere and outer-edge helper hits still snap correctly

### Verification Target

This phase should be considered successful if all of the following are true:

- left drag from inside the gizmo viewport orbits the main model camera
- click-to-snap still works when the user does not actually drag
- orbit ownership stays in the viewer/camera path rather than the helper camera
- the interaction ends cleanly on pointer release/cancel

### Suggested Implementation Order

1. Widen the current gizmo interaction seam so helper snap is no longer committed immediately on `pointerdown`.
2. Lock one honest drag-threshold split between click-to-snap and drag-to-orbit when the gesture begins inside the gizmo viewport.
3. Keep pointer-entry ownership near `ViewportOverlay.tsx` or the nearest honest gizmo-viewport shell owner.
4. Route drag orbit intent through `Viewer.ts` into the existing temporary orbit path.
5. Reuse the current orbit interaction seam in `CameraController.ts` instead of inventing a second orbit implementation.
6. Add focused proof that click-only still snaps and drag-only orbits.

### Done When

- the user can left-drag orbit directly from the gizmo viewport
- click-only gizmo snaps still behave correctly
- the change remains an entry-surface improvement instead of a hidden camera-ownership rewrite
