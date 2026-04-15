# Gizmo Index

## Doc Header

### Doc History
28. 2026-04-14 22:12:33: Marked `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` complete in the family summary after the runtime pass delayed helper snap commitment until pointer release, added a real click-versus-drag split inside `AxisGizmo.ts`, and routed gizmo-viewport left-drag orbit through the existing temporary orbit path in `Viewer.ts`
27. 2026-04-14 22:03:59: Marked `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` implementation-ready in the family summary after the future doc locked the main blocker in the current helper seam: the next pass must stop committing helper snap immediately on `pointerdown`, add a real click-versus-drag split, and route gizmo-viewport drag through the existing temporary orbit path in `Viewer.ts` plus `CameraController.ts`
26. 2026-04-14 22:01:13: Added `Gizmo 2 Phase 10 - Orbit The Model Viewport From Gizmo Hover Space` to the family summary so the orientation-helper ladder now reserves one explicit interaction follow-on for simple left-drag orbiting when the pointer is inside the gizmo viewport, while keeping the actual orbit ownership with `Viewer.ts` plus `CameraController.ts`
25. 2026-04-14 21:35:20: Marked `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` complete in the family summary after the runtime pass added one shared helper-camera distance value, exposed a new `Camera Dolly` slider in the `View` toolbar `Gizmo` section, and moved the helper-local camera to a slightly more zoomed-out default framing without changing snap ownership
24. 2026-04-14 21:29:01: Marked `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` implementation-ready in the family summary after the future doc locked the live framing seam to the helper-local camera in `AxisGizmo.ts`, narrowed the next runtime pass to one shared helper-style camera-distance value plus one `ParaSlider` in the `View` toolbar `Gizmo` section, and made clear that the smaller default read must come from true helper-camera framing rather than geometry scaling
23. 2026-04-14 21:23:57: Added `Gizmo 2 Phase 9 - Gizmo Viewport Camera Dolly And Default Framing` to the family summary so the orientation-helper ladder now reserves one explicit follow-on for the helper viewport camera distance/framing seam, including a new `ParaSlider` in the `View` toolbar `Gizmo` section and a slightly more zoomed-out default helper read
22. 2026-04-14 21:20:24: Marked `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` complete in the family summary after the helper-local runtime pass added promoted hover treatment for the snap-capable outer edge lines, restored the default line treatment cleanly on pointer leave, and kept the dense interior web visually unchanged
21. 2026-04-14 21:15:57: Marked `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` implementation-ready in the family summary after the future doc locked it to the shipped `axisOverlayStyle` seam, narrowed hover ownership to `AxisGizmo.ts`, and defined the exact proof bar for promoted outer-edge hover without turning the dense interior web into a highlighted snap surface
20. 2026-04-14 20:58:55: Marked `Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper` complete in the family summary after the runtime pass added one shared helper-style seam, exposed the requested `ParaSlider` / `ParaSelect` controls in the `View` toolbar `Gizmo` section, and taught the live orientation helper to apply separate line-family opacity, sphere scale, and axis-label visibility/size without changing snap ownership
19. 2026-04-14 20:42:00: Added `Gizmo 2 Phase 8 - Snap-Line Hover Transparency And Highlight Feedback` to the family summary so the orientation-helper ladder now reserves one explicit follow-on for the default transparency and hover-promoted transparency treatment of snap-capable lines instead of leaving that interaction-feedback polish implicit inside the broader style-control pass
18. 2026-04-14 20:38:39: Corrected `Gizmo 2 Phase 7` in the family summary so the requested v15-style helper controls are now explicitly planned for the `Gizmo` section of `src/app/components/ViewToolbar.tsx` using `ParaSlider` / `ParaSelect`, rather than being left as a generic helper-settings surface with no concrete user-facing home
17. 2026-04-14 20:34:57: Marked `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` complete in the family summary after the runtime pass widened the helper target contract beyond the old six-axis seam, made the twelve outer edge lines direct snap targets, and routed corner plus edge helper hits through animated camera transitions while keeping the dense interior web visual-only
16. 2026-04-14 20:21:06: Marked `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` implementation-ready in the family summary after the future doc locked the main runtime blocker in the current helper seam: the next pass must widen the old six-way `SnapDirection` output so corner spheres and the twelve outer edge lines can route honest targets into the existing animated camera transition path
15. 2026-04-14 20:17:17: Marked `Gizmo 2 Phase 5 - Dense Connector Mesh And Lower Opacity` complete in the family summary after the runtime patch replaced the sparse connector topology with the full fourteen-anchor all-pairs web, lowered the helper line opacity substantially, and widened the focused helper proof while keeping the connector layer outside `pickables`
14. 2026-04-14 20:13:25: Added `Gizmo 2 Phase 7 - v15 Style Controls For Orientation Helper` to the family summary so the orientation-helper ladder now includes one explicit later tuning pass for main-edge transparency, secondary-line transparency, sphere size, and label visibility/size instead of leaving those old-helper style controls as an unplaced future note
13. 2026-04-14 20:11:14: Expanded `Gizmo 2 Phase 6` in the family summary so the orientation-helper snap follow-on now includes direct hit behavior on the twelve outer edge lines, matching the older helper expectation that edge-line clicks should also route to the correct corner/edge snap targets instead of leaving sphere clicks as the only interactive snap surface
12. 2026-04-14 20:08:23: Added `Gizmo 2 Phase 6 - Animated Camera Snapping From Orientation Targets` to the family summary so the orientation-helper plan now explicitly captures the user-facing snap-animation follow-on while keeping the runtime ownership split honest between `AxisGizmo.ts`, `Viewer.ts`, and `CameraController.ts`
11. 2026-04-14 20:05:14: Recast `Gizmo 2 Phase 5` in the family summary from a generic final stop into the explicit dense-connector runtime pass, so the next helper slice now targets the faint all-pairs sphere web and lower-opacity line treatment needed to recover the denser old-helper feel
10. 2026-04-14 19:59:01: Marked `Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs` complete in the family summary after the proof-only helper test pass widened `AxisGizmo.test.ts` to lock the fourteen sphere snap targets as the only registered `pickables` while re-proving that the connected connector cage stays visual-only
9. 2026-04-14 19:52:00: Marked `Gizmo 2 Phase 4 - Snap-Safety And Interaction Proofs` implementation-ready in the family summary after the future doc locked that step to a proof-only helper pass in `AxisGizmo.test.ts`, preserving the shipped connector geometry while requiring explicit assertions that the fourteen sphere snap targets remain the sole registered `pickables`
8. 2026-04-14 15:47:08: Marked `Gizmo 2 Phase 3 - Complete The Connected Cage Read` complete in the family summary after the helper runtime patch extended the corner cage with twenty-four face-spoke segments from the axis spheres, giving the orientation helper its first fully connected read while the focused helper proof still confirms the connector layer stays outside `pickables`
7. 2026-04-14 15:44:57: Marked `Gizmo 2 Phase 3 - Complete The Connected Cage Read` implementation-ready in the family summary after the future doc locked the next runtime step to add twenty-four face-spoke segments that tie the six axis spheres into the existing corner cage while keeping the helper non-pickable and `Viewer.ts` unchanged
6. 2026-04-14 15:41:51: Marked `Gizmo 2 Phase 2 - Add The First Non-Pickable Connector Layer` complete in the family summary after the runtime patch landed in `AxisGizmo.ts`, giving the helper its first corner-only connector cage and adding a focused helper test that proves the new line layer stays outside `pickables`
5. 2026-04-14 15:37:54: Marked `Gizmo 2 Phase 2 - Add The First Non-Pickable Connector Layer` implementation-ready in the family summary after the future doc locked the first runtime shape to one corner-only `LineSegments` cube-edge layer inside `AxisGizmo.ts` with `Viewer.ts` unchanged and sphere-led snapping preserved
4. 2026-04-14 15:35:28: Marked `Gizmo 2 Phase 1 - Confirm Connector-Line Seam` complete in the family summary after the code-read attribution locked `AxisGizmo.ts` as the sole first-pass owner and confirmed the first connector strategy should use the eight corner spheres as the cage anchors while leaving the six axis spheres as snap targets
3. 2026-04-14 15:25:27: Expanded the first gizmo-family phase into a five-step subphase ladder inside its standalone `Future/` doc so `Gizmo 2` can now ship one Codex-sized slice at a time across seam confirmation, first connector rendering, full cage completion, snap-safety proofing, and final polish verification
2. 2026-04-14 15:21:41: Added the first explicit gizmo-family phase to this index and pointed it at a new `Future/` plan doc, making the opening `Gizmo 2` lane a narrow polish pass for orientation-helper lines connecting the spheres in a more `v15`-style connected spatial read instead of leaving that follow-on as only a loose next-step note
1. 2026-04-14 15:19:23: Added this umbrella index for the `Gizmo` subfamily under `View-Toolbar/Gizmo/` so the repo now has one simple family home that points at `Gizmo-Vision.md`, records the current generation split, and gives later gizmo-specific phase docs a cleaner landing surface without widening into the broader `View-Toolbar` planning docs

### Purpose

This file is the umbrella planning index for the `Gizmo` subfamily under `Architecture`.

Use it to answer:
- what the `Gizmo` subfamily is supposed to own
- how the gizmo docs are organized
- what the current generation split is
- where later standalone gizmo phase docs should branch

### Scope Note

This doc is intentionally about the `Gizmo` subfamily only.

It is mainly about:
- gizmo-specific architecture direction
- current generation framing
- future gizmo planning surfaces

It is not the main home for:
- raw camera gesture ownership
- broad `View-Toolbar` control grouping
- transform-session semantics

Those still belong in their own canonical docs.

## Doc Body

### Short Version

The `Gizmo` subfamily should become the explicit planning home for:
- transform-manipulator quality direction
- orientation-helper visual direction
- later gizmo-specific implementation phases

It should not become:
- a hidden replacement for `Transform`
- a hidden replacement for `Camera-Controls`
- a grab bag for every view-toolbar feature

### Why This Doc Exists

Right now the gizmo direction is no longer one flat idea.

The repo already has:
- `Gizmo-Vision.md`
  - the north-star doc for quality, ownership boundaries, and generations

What was still missing was:
- one simple family index for the `Gizmo` folder itself
- one place to say what lives here now
- one place to attach later standalone gizmo phase docs without pushing that structure back into the broader `View-Toolbar` family

This doc exists to give the gizmo its own planning home.

### Family Structure

Use this folder like this:

- `Gizmo-Index.md`
  - umbrella gizmo-family index
  - generation summary
  - future gizmo-doc landing surface
- `Gizmo-Vision.md`
  - stable gizmo north-star direction
  - quality bar
  - ownership boundaries
  - current generation framing
- `Future/`
  - later standalone gizmo execution/planning docs when individual gizmo lanes become implementation-ready
  - `Gizmo_Phase Gizmo 2 - Orientation Helper Polish And Connector Lines.md`

### Current Generation Read

Current read:
- `Generation 1`
  - shared transform manipulator baseline
  - trust, continuity, keyboard-path credibility, and legacy-quality recovery
- `Generation 2`
  - orientation-helper visual depth
  - connector/cage structure and clearer side/volume readability

Important rule:
- keep `Generation 1` trust work and `Generation 2` helper-depth work distinct
- do not use the gizmo family to blur transform-manipulator runtime fixes and orientation-helper styling into one unnamed lane

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Gizmo-Vision.md`
  - gizmo quality bar
  - generation framing
  - ownership boundaries
- `Transform`
  - target ownership
  - transform semantics
  - history, commit, cancel, and snap meaning
- `Camera-Controls`
  - orbit/pan/fly gesture ownership
  - camera snapping behavior
  - fallback rules with other tools
- `View-Toolbar`
  - visible view/helper controls
  - user-facing helper toggles and tuning controls

Important rule:
- do not let gizmo planning quietly absorb transform truth or camera policy just because the features touch the same on-screen widget area

### Phase Ladder

The `Gizmo` subfamily should start with one narrow first phase under the current `Generation 2` helper-depth lane.

## [ ] Gizmo - 2 - Orientation Helper Polish And Connector Lines

Standalone future doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Gizmo/Future/Gizmo_Phase Gizmo 2 - Orientation Helper Polish And Connector Lines.md`

Role in the family:
- first concrete gizmo-only phase
- first narrow `Generation 2` helper-depth proof

Owns:
- orientation-helper polish focused on the connected spatial read
- lines connecting the sphere positions so the helper reads more like the stronger `v15` gizmo the user is aiming to recover

What this phase must make true:
- the orientation helper no longer reads like only isolated spheres plus an axis cross
- the helper gains connecting lines between sphere anchors so the sides and implied volume read more clearly
- current sphere-based snap targets remain intact

Guardrail:
- keep this first phase narrow and helper-only
- do not widen it into transform runtime changes, toolbar controls, or camera-command redesign

Current subphase read:
- `Phase 1`
  - complete
  - `AxisGizmo.ts` is the locked first-pass owner
  - use the eight corner spheres as the first connector/cage anchors
- `Phase 2`
  - complete
  - one corner-only `LineSegments` cube-edge layer now exists in `AxisGizmo.ts`
  - focused helper proof confirms the line layer stays outside `pickables`
- `Phase 3`
  - complete
  - twenty-four face-spoke segments now tie the six axis spheres into the existing corner cage
  - the helper now has its first fully connected read
- `Phase 4`
  - complete
  - focused helper proof now locks the fourteen sphere snap targets as the sole registered `pickables`
  - connected connector cage remains visual-only by test
- `Phase 5`
  - complete
  - the helper now uses the full all-pairs connector web across the fourteen sphere anchors
  - connector opacity is now reduced to the faint old-helper treatment while the layer stays visual-only
- `Phase 6`
  - complete
  - the helper now emits honest axis, corner, and outer-edge targets
  - corner spheres and twelve outer-edge hits now animate camera snaps correctly
  - the dense interior web stays visual-only while camera motion routes through `Viewer.ts` and `CameraController.ts`
- `Phase 7`
  - complete
  - the `View` toolbar `Gizmo` section now exposes `ParaSlider` / `ParaSelect` controls for main-edge opacity, other-line opacity, sphere size, and axis-label visibility / text size
  - the live orientation helper now applies those values through one shared helper-style seam without changing snap ownership
- `Phase 8`
  - complete
  - the snap-capable outer edge lines now gain helper-local hover promotion and restore their default treatment cleanly on leave
  - the dense interior web stays subdued instead of promoting like a primary snap target
- `Phase 9`
  - complete
  - one shared helper-camera distance value now exists in the `axisOverlayStyle` seam
  - the `View` toolbar `Gizmo` section now exposes a `Camera Dolly` slider
  - `AxisGizmo.ts` now changes the helper-local camera framing instead of faking the result through sphere scale
  - the default gizmo viewport camera now sits slightly farther out so the helper reads a little smaller and less cramped
- `Phase 10`
  - complete
  - the helper now delays snap commitment until pointer release so click-only gizmo hits still snap correctly
  - left drag from inside the gizmo viewport now routes through the existing temporary orbit seam in `Viewer.ts` plus `CameraController.ts`
  - `AxisGizmo.ts` now owns only the click-versus-drag threshold split, not main camera truth
