# `Model-Viewport-3` - `Display Mode Radial Menu And Render Preview`

## Doc Header

### Doc History
26. 2026-05-11 21:55: Marked `Model-Viewport-3 / Phase 10.1 - Material Mode Neutral Fill Lighting Fix-Up` shipped after the viewer restored Material mode to PBR-capable `MeshStandardMaterial` inspection materials, added one neutral viewer-owned `HemisphereLight`, gated authored lights out of Material mode, kept shadows/ground/final polish disabled there, and proved roughness/metalness readability plus rendered-mode light restoration in focused `Viewer.test.ts` coverage.
25. 2026-05-11 21:50: Tightened `Model-Viewport-3 / Phase 10.1 - Material Mode Neutral Fill Lighting Fix-Up` into an implementation-ready viewer slice around replacing the Phase 10 `MeshBasicMaterial` material-mode cache with a PBR-capable `MeshStandardMaterial` inspection cache, adding one viewer-owned neutral `HemisphereLight`, gating authored lights to rendered/render-preview modes, preserving material-mode neutral grade/filter, and proving roughness/metalness readability plus no harsh shadows in focused `Viewer.test.ts` coverage.
24. 2026-05-11 21:49: Added `Model-Viewport-3 / Phase 10.1 - Material Mode Neutral Fill Lighting Fix-Up` as a follow-up to bring roughness and metallicness readability back into `Material` mode with controlled neutral fill lighting, no harsh authored point/spot light shadows, no final scene polish, and preserved rendered/render-preview lighting behavior.
23. 2026-05-11 21:39: Marked `Model-Viewport-3 / Phase 10 - Material Mode Lighting Separation` shipped after the viewer added a material-mode `MeshBasicMaterial` cache beside the rendered `MeshStandardMaterial` cache, routed only `Material` display mode through the unlit cache, neutralized material-mode environment grade/filter presentation, preserved rendered/render-preview lighting behavior, and added focused `Viewer.test.ts` proof for unlit material mode plus rebuild-free mode switching.
22. 2026-05-11 21:29: Tightened `Model-Viewport-3 / Phase 10 - Material Mode Lighting Separation` into an implementation-ready viewer slice around adding a material-mode unlit material cache beside the existing `MeshStandardMaterial` cache, routing only `material` display mode through that cache, preserving `rendered`/`renderPreview` environment-lit behavior, keeping mode switches rebuild-free, and proving the split in focused `Viewer.test.ts` coverage.
21. 2026-05-11 21:27: Added `Model-Viewport-3 / Phase 10 - Material Mode Lighting Separation` as a follow-up for making `Material` mode lighting-neutral/unlit while keeping environment lights, HDRI contribution, shadows, ground, and tone-mapped scene polish owned by `Rendered` and `Render Preview`.
20. 2026-05-11 20:56: Marked `Model-Viewport-3 / Phase 9 - Render Quality Presets And Cleanup` shipped after the repo added shared render-preview quality preset definitions, exposed a Properties `Quality preset` ParaSelect with derived `Custom` behavior, kept preset writes on the existing `ViewSettings.renderPreview` owner, proved manual divergence and active Render Preview reset behavior, and closed the lane with export/render-queue/output/exposure deferrals.
19. 2026-05-11 20:48: Tightened `Model-Viewport-3 / Phase 9 - Render Quality Presets And Cleanup` into an implementation-ready closeout slice around shared render-preview preset definitions, a Properties `Quality preset` ParaSelect with derived `Custom` readout, preset writes through the existing `ViewSettings.renderPreview` owner, active Render Preview reset proof through the Phase 8 runtime path, and explicit deferral of export, render queue, output resolution, image saving, and dedicated render-preview exposure.
18. 2026-05-11 20:13: Marked `Model-Viewport-3 / Phase 8 - Render Settings Runtime Wiring` shipped after the repo wired `ViewSettings.renderPreview` settings into the render-preview runtime factory, mapped samples, bounces, render scale, noise cleanup, and GPU load into the `three-gpu-pathtracer` adapter, recreated active accumulation when quality settings change, kept settings inert outside Render Preview, and added focused runtime/HUD proof.
17. 2026-05-11 20:05: Tightened `Model-Viewport-3 / Phase 8 - Render Settings Runtime Wiring` into an implementation-ready runtime slice around passing the Phase 6 `ViewSettings.renderPreview` settings from `Viewer.applyViewSettings(...)` into `renderPreviewRuntime.ts`, recreating or resetting accumulation when render quality changes, mapping samples, bounces, render scale, noise cleanup, and GPU load into the `three-gpu-pathtracer` adapter, proving HUD sample targets follow Properties settings, and preserving normal raster display modes plus export/render-queue deferrals.
16. 2026-05-11 20:03: Marked `Model-Viewport-3 / Phase 7 - Properties Render Section` shipped after the repo added a global Properties `Render` section, widened the Properties section contract for nullable/global sections, preserved object-scoped `Materials`, exposed render-preview samples, light bounces, render scale, noise cleanup, and GPU load through ParaSlider/ParaSelect controls, and proved no-focused-item availability plus settings writes while leaving runtime setting application to Phase 8.
15. 2026-05-11 19:48: Tightened `Model-Viewport-3 / Phase 7 - Properties Render Section` into an implementation-ready Properties UI slice around adding a global `Render` section beside object-scoped `Materials`, widening the Properties section contract carefully for viewport-owned sections, using Phase 6 `ViewSettings.renderPreview` defaults and constraints through ParaSliders and ParaSelects, proving no-focused-item availability, and preserving the no-runtime-settings-application boundary before Phase 8.
14. 2026-05-11 19:44: Marked `Model-Viewport-3 / Phase 6 - Render Preview Settings Contract` shipped after the repo added nested `ViewSettings.renderPreview` quality settings, defaults and normalization for samples, bounces, render scale, noise cleanup, and GPU load, persistence-policy carry-through, focused store/persistence tests, and shared default-sample alignment while keeping Properties UI and runtime settings application deferred.
13. 2026-05-11 19:34: Tightened `Model-Viewport-3 / Phase 6 - Render Preview Settings Contract` into an implementation-ready contract slice around adding a nested `ViewSettings.renderPreview` quality settings owner, deterministic defaults and normalization for sample target, light bounces, render scale, noise cleanup, and GPU-load profile, UI prefs persistence carry-through, focused store/persistence proof, and the no-Properties-UI/no-runtime-wiring boundary before Phases 7 and 8.
12. 2026-05-11 19:30: Added `Model-Viewport-3 / Phase 6` through `Phase 9` as the render-preview cleanup ladder for a Properties workspace `Render` section, locking ParaSlider/ParaSelect control expectations for samples, light bounces, render scale, noise cleanup, GPU load, runtime settings wiring, and quality presets while keeping render settings presentation-only and separate from geometry/build/export truth.
11. 2026-05-11 19:21: Marked `Model-Viewport-3 / Phase 5 - Progressive Render Preview Backend` shipped after the repo added the first `three-gpu-pathtracer` runtime adapter, viewer-owned render-preview sample progress callbacks, Phase 4 HUD-store forwarding, reset-on-camera/scene/view/resize behavior, unsupported fallback reporting, focused mocked-backend proof, and build verification while keeping export rendering, render queues, sample presets, and WebGPU migration deferred.
10. 2026-05-11 19:02: Tightened `Model-Viewport-3 / Phase 5 - Progressive Render Preview Backend` into an implementation-ready backend slice by selecting `three-gpu-pathtracer` as the first adapter candidate, grounding the work in the shipped Phase 4 status store/HUD contract, `Viewer.ts` render loop and display-mode fallback, `ViewerHost.tsx` status bridge, official three.js pathtracer example, and `three-gpu-pathtracer` WebGL2/sample/reset/dispose API surface while keeping export rendering, render queues, and WebGPU experiments out of the first backend pass.
9. 2026-05-11 18:38: Marked `Model-Viewport-3 / Phase 4 - Render Preview Status And HUD Contract` shipped after the repo added a viewport-local render-preview status store, compact HUD readouts and a progress track gated to `renderPreview` display mode, explicit fallback/progress/complete/canceled/unsupported/stale/error states, ViewerHost stale hooks for camera/geometry/material/lighting changes, and focused store/HUD proof while keeping the real progressive backend deferred to Phase 5.
8. 2026-05-11 18:23:47: Tightened `Model-Viewport-3 / Phase 4 - Render Preview Status And HUD Contract` into an implementation-ready status/HUD pass by grounding the next work in the existing `ViewSettings.displayMode === 'renderPreview'` contract, `ViewportOverlay.tsx` viewport HUD, `viewport-overlay.css` HUD styling, `ViewerHost.tsx` viewer/runtime handoff, `viewportRuntimeStatsStore.ts` as a nearby viewport-local store pattern, and focused `ViewportOverlay`/store tests while explicitly deferring progressive renderer backend work to Phase 5.
7. 2026-05-11 18:20:36: Marked `Model-Viewport-3 / Phase 3 - Fast Display Mode Viewer Application` shipped after the viewer added in-place display-mode presentation resolution for Solid, Wireframe, Material, Rendered, and Render Preview fallback; kept mode changes rebuild-free through `applyViewSettings(...)`; preserved material assignment ownership for Material/Rendered; made Solid use a neutral clay material; kept Wireframe on the existing material path; and added focused `Viewer.test.ts` proof for no geometry rebuild, deterministic material differences, rendered scene polish, and render-preview fallback honesty.
6. 2026-05-11 18:14:40: Tightened `Model-Viewport-3 / Phase 3 - Fast Display Mode Viewer Application` into an implementation-ready viewer presentation pass by grounding the next work in `Viewer.applyViewSettings(...)`, the existing material cache and `wireframe` synchronization, `setViewportRenderLayers(...)` mesh ownership, `applyEnvironmentSource(...)`, `applyGroundSettings(...)`, `applyShadowFlags(...)`, and focused `Viewer.test.ts` proof while keeping `Render Preview` HUD/progress and any path-traced backend behavior deferred to later phases.
5. 2026-05-11 18:10:16: Marked `Model-Viewport-3 / Phase 2 - Shift+D Radial Menu` shipped after the repo added active-viewer-gated `Shift+D` display-mode routing, a viewport-local radial menu overlay with Solid/Wireframe/Material/Rendered/Render Preview choices, owner-backed display-mode selection through the Phase 1 UI preferences contract, focused routing/menu proof, and build verification while keeping live Three.js visual mode application and render-preview progress deferred.
4. 2026-05-11 18:04:27: Tightened `Model-Viewport-3 / Phase 2 - Shift+D Radial Menu` into an implementation-ready interaction pass by grounding the next work in the post-shortcut-depth `inputRouting.ts` owner ordering, `useViewerCameraShortcuts.ts` active-viewer gate, `ViewSettings.displayMode` contract from Phase 1, likely viewport overlay styling, and focused keyboard/menu tests while explicitly deferring Three.js visual mode application and progressive render-preview backend behavior to later phases.
3. 2026-05-11 18:01:28: Marked `Model-Viewport-3 / Phase 1 - Display Mode Contract` shipped after the repo added the shared display-mode contract, normalized legacy wireframe state into `wireframe` display mode, synchronized the UI prefs setter path, persisted display mode with view settings, and added focused store/persistence proof without changing live viewer rendering yet.
2. 2026-05-11 18:01:28: Tightened `Model-Viewport-3 / Phase 1 - Display Mode Contract` into an implementation-ready contract pass around `ViewSettings.displayMode`, the existing UI preferences persistence policy, legacy `wireframe` compatibility, and focused store/persistence tests while keeping radial menu input and Three.js visual application deferred to later phases.
1. 2026-05-11 16:39:36: Created this future doc to reserve the `Model-Viewport-3` presentation-mode lane around a `Shift+D` display-mode radial menu, Solid/Wireframe/Material/Rendered viewport modes, and a fifth render-preview mode with iteration progress in the viewport HUD.

### Purpose

Use this doc as the dedicated planning surface for the future `Model-Viewport-3` display-mode and render-preview lane.

The goal here is:
- give the model viewport one explicit display-mode picker
- make `Shift+D` open a radial menu for choosing the presentation mode
- support fast viewport presentation modes such as `Solid`, `Wireframe`, `Material`, and `Rendered`
- reserve a fifth `Render Preview` mode for progressive viewport rendering with an iteration progress HUD
- keep all display-mode choices downstream from current geometry result truth instead of making viewport presentation into geometry ownership

### Scope

This phase family covers:
- viewport presentation mode naming and state ownership
- the `Shift+D` radial menu interaction
- fast mode switching between solid, wireframe, material, and real-time rendered views
- a later progressive render-preview mode with iteration count, progress, cancel/reset behavior, and stale-state honesty
- HUD/readout behavior while render preview is active

This phase family does not cover:
- changing graph-authored geometry truth
- changing `Auto / Draft / Final` result policy semantics
- replacing the authoritative geometry/export handoff in `Model-Viewport-1.3`
- making path tracing the default interactive viewport renderer
- final production render export, image file saving, or render queue management

## Doc Body

### Summary

`Model-Viewport-3` should add one user-facing display-mode system on top of the existing model viewport result-state system.

Important split:
- `Auto / Draft / Final` answers which geometry result class the viewport should show.
- `Solid / Wireframe / Material / Rendered / Render Preview` answers how the selected geometry result should be presented.

The display-mode lane should stay presentation-only. It can choose materials, lighting contribution, wireframe rendering, progressive path-trace accumulation, and HUD status, but it should never decide whether geometry is fresh, authoritative, exportable, or accepted.

Recommended user-facing modes:
- `Solid`
  - clay/CAD-style shaded presentation for readable shape review
- `Wireframe`
  - line/wire presentation for topology and silhouette review
- `Material`
  - assigned material/color presentation without implying final beauty rendering
- `Rendered`
  - real-time Three.js viewport rendering with lighting, shadows, environment, and ground treatment
- `Render Preview`
  - progressive high-quality render preview that refines over iterations/samples while the scene is still

### Current Code-Backed Read

The strongest likely seams for this phase family are:

- `src/shared/viewSettingsTypes.ts`
  - already owns persisted/shared viewport presentation settings such as projection, grid, axes, shadows, wireframe, environment, ground, and materials
  - is the likely home for a future `displayMode` setting or normalized presentation-mode contract
- `src/viewer/Viewer.ts`
  - already applies view settings without rebuilding geometry
  - already maps material settings, wireframe state, lighting, shadows, environment, and ground into Three.js runtime behavior
  - would likely own the fast display-mode material/runtime mapping
- `src/app/components/ViewToolbar.tsx`
  - already exposes view-state controls and should remain the broader explicit control surface for user-visible view settings
  - should not become the only path if the radial menu is the primary quick interaction
- `src/app/workspace/ViewportFrame.tsx`
  - already hosts model-viewer frame controls and titlebar-adjacent presentation controls
  - may need to stay aligned if the display mode has a compact current-mode readout
- `src/app/viewerBridge.ts`
  - already defines the viewer API surface between React/store and the viewer runtime
  - may need a narrow render-preview status/readback seam if progressive rendering reports iteration progress from viewer runtime to HUD
- `src/app/inputRouting.ts`
  - should be checked before adding `Shift+D` so the radial menu does not steal shortcuts from editable fields, sketch draw, transform, or fly-mode ownership
- `src/app/theme/surfaces/viewport-overlay.css`
  - likely owns the HUD/radial-menu presentation styling unless a narrower overlay CSS owner exists by implementation time

### Ownership Rules

Display mode should be stored as app/view settings truth, not hidden only inside `Viewer`.

The viewer can own runtime resources:
- temporary material overrides
- wireframe helpers
- render-preview accumulation buffers
- path-tracer integration objects
- iteration/sample progress reads

The app/store side should own user intent:
- current display mode
- whether render preview is active
- target iteration/sample budget if exposed
- whether render-preview status should appear in the HUD

The geometry-result selector should continue to own geometry meaning:
- `Auto`
- `Draft`
- `Final`
- stale/loading/fallback status
- authoritative versus draft result choice

### Render Preview Behavior

`Render Preview` should behave like a viewport presentation mode with extra runtime status.

Baseline behavior:
- entering `Render Preview` starts progressive accumulation for the currently visible viewport result
- the HUD shows active mode plus iteration/sample progress
- moving the camera resets or pauses accumulation
- changing geometry resets accumulation and marks the previous render as stale
- changing materials, lighting, environment, ground, or display-relevant settings resets accumulation
- leaving `Render Preview` tears down or pauses the expensive render-preview runtime without changing geometry result truth

Recommended first HUD text shape:

```text
Render Preview
Samples 128 / 512
[progress]
```

Optional later controls:
- `Pause`
- `Resume`
- `Cancel`
- `Restart`
- target samples/iterations
- preview quality preset

### Three.js Direction

The first implementation should assume normal real-time Three.js rendering remains the default modeling experience.

`Render Preview` can later evaluate:
- `three-gpu-pathtracer`
- a WebGPU renderer/path-tracing experiment
- a custom progressive render pipeline

Important rule:
- path tracing should be a special presentation mode, not the main interactive viewport renderer
- if browser/device support is missing, the UI should degrade honestly instead of silently pretending high-quality render preview is active

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. The user can press Shift+D in the model viewport and choose a display mode from a radial menu.`
- [x] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [x] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`
- [x] `HLG 5. The Properties workspace exposes a Render section for tuning render-preview quality with ParaSliders and ParaSelects.`
- [x] `HLG 6. Material mode shows assigned material colors without environment lighting or rendered scene polish changing the read.`
- [x] `HLG 7. Material mode still shows roughness and metallicness through a neutral inspection light model without harsh authored scene shadows.`

### `Model-Viewport-3 Phase 1`

- [x] Define the display-mode contract and persistence/read semantics.
- [x] Add `Solid`, `Wireframe`, `Material`, and `Rendered` as named presentation modes.
- [x] Keep the contract separate from `Auto / Draft / Final` result policy.
- [x] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 2`

- [x] Add the `Shift+D` radial menu trigger for the active model viewport.
- [x] Route radial-menu selection through the display-mode contract instead of direct viewer-only state.
- [x] Keep keyboard ownership honest around editable fields, sketch draw, fly mode, and transform sessions.
- [x] `HLG 1. The user can press Shift+D in the model viewport and choose a display mode from a radial menu.`

### `Model-Viewport-3 Phase 3`

- [x] Apply the first four display modes in the live Three.js viewer.
- [x] Ensure mode switching is rebuild-free when geometry has not changed.
- [x] Preserve assigned material behavior for `Material` and lighting/environment behavior for `Rendered`.
- [x] Keep `Wireframe` and `Solid` visually distinct from material editing truth.
- [x] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 4`

- [x] Add the render-preview mode contract and HUD status shape without committing to one path-tracer backend too early.
- [x] Define active, complete, canceled, unsupported, and stale render-preview statuses.
- [x] Define how camera movement, geometry changes, material changes, and lighting/environment changes reset progress.
- [x] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 5`

- [x] Integrate the first progressive render-preview backend behind the render-preview contract.
- [x] Report sample/iteration progress to the HUD.
- [x] Keep expensive render-preview runtime isolated from normal interactive viewport rendering.
- [x] Add focused proof for entering render preview, progress readout, reset-on-change behavior, unsupported fallback, and leaving render preview cleanly.
- [x] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [x] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 6`

- [x] Add a render-preview settings contract for quality controls.
- [x] Include sample target, light bounces, render scale, noise cleanup, and GPU-load/tile preference in the contract.
- [x] Preserve presentation-only ownership and keep render settings separate from geometry/build/export truth.
- [x] Normalize defaults and persisted values safely.
- [ ] `HLG 5. The Properties workspace exposes a Render section for tuning render-preview quality with ParaSliders and ParaSelects.`
- [x] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 7`

- [x] Add a `Render` section to the Properties workspace.
- [x] Use ParaSliders for numeric quality controls where practical.
- [x] Use ParaSelects for preset or mode choices where practical.
- [x] Keep Render section controls scoped to render-preview presentation settings.
- [x] `HLG 5. The Properties workspace exposes a Render section for tuning render-preview quality with ParaSliders and ParaSelects.`

### `Model-Viewport-3 Phase 8`

- [x] Wire render-preview settings into the viewer runtime adapter.
- [x] Reset accumulation when render-preview quality settings change.
- [x] Keep unsupported/fallback behavior honest when a setting cannot apply to the backend.
- [x] Add focused runtime tests for settings propagation and reset behavior.
- [x] `HLG 5. The Properties workspace exposes a Render section for tuning render-preview quality with ParaSliders and ParaSelects.`
- [x] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`

### `Model-Viewport-3 Phase 9`

- [x] Add friendly render quality presets that update multiple render-preview settings together.
- [x] Show `Custom` when manual render settings do not exactly match a named preset.
- [x] Keep advanced settings readable after a preset is applied.
- [x] Add final cleanup tests and handoff notes for later export/render-queue work.
- [x] Decide whether exposure stays linked to existing viewport/environment settings or becomes an explicit render-preview override in a later lane.
- [x] `HLG 5. The Properties workspace exposes a Render section for tuning render-preview quality with ParaSliders and ParaSelects.`

### `Model-Viewport-3 Phase 10`

- [x] Make `Material` mode lighting-neutral/unlit so assigned material colors are readable without environment lights.
- [x] Keep `Rendered` and `Render Preview` as the modes that use environment lighting, HDRI contribution, tone mapping, shadows, and ground polish.
- [x] Preserve material assignment truth, per-part materials, and wireframe behavior without turning `Material` mode into geometry/build/export truth.
- [x] Add focused viewer tests proving material mode ignores environment lighting while rendered modes still use it.
- [x] `HLG 6. Material mode shows assigned material colors without environment lighting or rendered scene polish changing the read.`

### `Model-Viewport-3 Phase 10.1`

- [x] Restore PBR material-field readability in `Material` mode so roughness and metallicness changes are visible.
- [x] Replace the fully unlit material-mode read with a simple neutral fill-light inspection model.
- [x] Keep authored point/spot/directional scene lights, harsh shadows, ground, HDRI mood, and final render polish out of `Material` mode.
- [x] Preserve `Rendered` and `Render Preview` as the modes that use the user-authored lighting/environment setup.
- [x] Add focused viewer tests proving Material mode uses neutral fill lighting and lit materials without reintroducing authored light shadows.
- [x] `HLG 7. Material mode still shows roughness and metallicness through a neutral inspection light model without harsh authored scene shadows.`

## [x] `Model-Viewport-3 / Phase 1` - `Display Mode Contract`

### Phase 1 Summary

Create one explicit display-mode contract for model-viewport presentation.

Current status:
- shipped

### Phase 1 Implementation Spec

Must lock:
- one normalized display-mode enum or equivalent contract
- named modes for `Solid`, `Wireframe`, `Material`, `Rendered`, and reserved `Render Preview`
- persistence and normalization behavior if display mode is user preference state
- a clear split from `Auto / Draft / Final` result mode
- no viewer-only hidden ownership of user display-mode intent
- legacy `wireframe` reads must normalize into the new `wireframe` display mode instead of losing older saved viewport preferences
- the old `wireframe` key should remain synchronized until the viewer and toolbar migrate to direct display-mode ownership

Likely files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- focused store/settings tests

Definition of done:
- display-mode state exists in one explicit app/shared settings owner
- the default mode is deterministic
- legacy `wireframe` behavior has a migration or compatibility read if needed
- no runtime rendering behavior changes are required yet
- focused store and persistence tests prove default, invalid, legacy wireframe, setter synchronization, and persistence-policy behavior

## [x] `Model-Viewport-3 / Phase 2` - `Shift+D Radial Menu`

### Phase 2 Summary

Add the quick viewport interaction for choosing display mode.

Current status:
- shipped

### Phase 2 Implementation Spec

Current read:
- `Model-Viewport-3 / Phase 1` shipped `ViewSettings.displayMode` with `solid`, `wireframe`, `material`, `rendered`, and `renderPreview`
- `src/app/inputRouting.ts` now routes edit-history, text-field, fly, sketch, reference, staged console, and viewer-camera shortcut owners before flat console capture
- `src/app/useViewerCameraShortcuts.ts` already gates viewer shortcut handling to the active model viewport, active viewer surface, and mounted viewer instance
- `Shift+D` is not part of the existing camera shortcut map in `src/app/cameraShortcuts.ts`
- `D` is a fly movement key only while fly mode is active, so `Shift+D` must stay behind fly ownership when fly mode is active
- display-mode selection should update `useUiPrefsStore.getState().setViewKey('displayMode', mode)` or an equivalent owner-backed seam from Phase 1
- this pass should show the menu and update state only; it should not make the viewer render all display modes differently yet

Must lock:
- `Shift+D` opens a radial display-mode menu for the active model viewport
- the menu offers `Solid`, `Wireframe`, `Material`, `Rendered`, and `Render Preview`
- selections update the display-mode contract from Phase 1
- keyboard routing respects editable fields and active tool owners
- the radial menu has a clear close/cancel behavior
- `Shift+D` must not open the menu while typing in editable fields or Console input
- `Shift+D` must not steal fly movement while fly mode is active
- the menu should be viewport-local and active-viewer-gated, matching the existing viewer shortcut ownership model
- choosing `Render Preview` may set `displayMode: 'renderPreview'`, but render-preview HUD/progress and backend behavior remain deferred to later phases

Likely files:
- `src/app/inputRouting.ts`
- `src/app/inputRouting.test.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `src/app/useViewerCameraShortcuts.test.tsx`
- model-viewport host/overlay files by implementation time, likely near `ViewerHost` or the model-viewport overlay owner
- `src/app/theme/surfaces/viewport-overlay.css`
- focused interaction tests

Definition of done:
- the user can choose a display mode from the radial menu
- the menu does not steal unrelated input contexts
- the current display mode can be read back by the viewport UI
- render-preview selection may still be unsupported or placeholder-gated until later phases
- focused tests prove `Shift+D` opens only for the active viewer shortcut context
- focused tests prove menu choices update `view.displayMode` without changing `Auto / Draft / Final` result policy
- focused tests prove Escape/outside cancel closes the menu without changing display mode
- no viewer material/rendering behavior is widened in this phase

### Phase 2 Implementation Result

Shipped:
- added a dedicated `viewer-display-mode` keyboard-routing owner for active-viewer `Shift+D`
- kept `Shift+D` dormant in editable fields and behind fly-mode ownership while fly mode is active
- added `useViewerDisplayModeMenu(...)` as the viewport-local menu trigger and state-selection hook
- rendered the `Solid`, `Wireframe`, `Material`, `Rendered`, and `Render Preview` radial menu overlay from `ViewerHost`
- routed selection through `useUiPrefsStore.getState().setViewKey('displayMode', mode)` so Phase 2 stays on the Phase 1 display-mode contract
- added focused tests for input routing, active-viewer gating, editable-field protection, fly-mode priority, selection, and Escape cancel

Verification:
- `npm.cmd test -- --run src/app/inputRouting.test.ts src/app/useViewerDisplayModeMenu.test.tsx src/app/store/uiPrefsStore.test.ts src/app/store/scenePresentationEditHistoryReadiness.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `npm.cmd run build`

Deferred:
- applying the first four display modes to Three.js rendering remains `Model-Viewport-3 / Phase 3`
- render-preview HUD/progress and progressive backend behavior remain `Model-Viewport-3 / Phase 4` and `Phase 5`

## [x] `Model-Viewport-3 / Phase 3` - `Fast Display Mode Viewer Application`

### Phase 3 Summary

Apply the first four presentation modes in the live Three.js viewer.

Current status:
- shipped

### Phase 3 Implementation Spec

Current read:
- `Model-Viewport-3 / Phase 1` added `ViewSettings.displayMode` and keeps legacy `view.wireframe` synchronized for the current viewer path
- `Model-Viewport-3 / Phase 2` now lets the active model viewport choose `solid`, `wireframe`, `material`, `rendered`, or `renderPreview` through the radial menu
- `src/app/components/ViewerHost.tsx` already applies UI preference view settings to the mounted `Viewer` through the existing view-settings effect path
- `src/viewer/Viewer.ts` already owns the live presentation seams:
  - `applyViewSettings(...)` clones settings and applies projection, grid/axes visibility, shadows, tone mapping, environment source, ground, lights, material settings, shadow flags, and overlay refreshes
  - `applyPresetToMaterial(...)` currently applies material preset fields and sets `material.wireframe` from `currentViewSettings.wireframe`
  - `applyMaterialAssignmentsToScene(...)` assigns cached preset materials to base part meshes
  - `setViewportRenderLayers(...)` rebuilds geometry only when render-layer inputs change, so display-mode changes should avoid this path
  - `applyEnvironmentSource(...)`, `applyGroundSettings(...)`, and `applyShadowFlags(...)` are the likely owner seams for making `Solid` and `Rendered` visually distinct
- `src/viewer/Viewer.test.ts` already has focused proof around view settings, environment application, ground settings, material assignment fallback, typed material side settings, and render-layer mesh ownership
- `Render Preview` should not try to path trace in Phase 3; until Phase 4/5 exist, it can honestly fall back to the interactive rendered presentation or an internal unsupported placeholder without progress UI

Must lock:
- `Solid` uses a consistent CAD/clay-style presentation
- `Wireframe` uses the viewer's line/wire presentation without changing geometry truth
- `Material` preserves assigned material reads
- `Rendered` uses the real-time lighting/environment/ground/shadow presentation
- switching modes does not trigger geometry rebuilds
- mode application lives in the viewer presentation layer, not in the radial menu hook
- mode switching updates existing Three.js materials/scene presentation in place where possible
- `displayMode: 'wireframe'` and legacy `wireframe: true` remain synchronized through the Phase 1 store contract
- `Render Preview` remains selectable but does not claim progressive sample/iteration progress in this phase

Recommended implementation direction:
1. Add a small viewer-local display-mode presentation resolver in `src/viewer/Viewer.ts`, close to the existing view-settings/material helpers.
2. Route `applyViewSettings(...)` through that resolver after `currentViewSettings` is cloned and before material/ground/shadow refreshes need the effective presentation values.
3. Preserve assigned material presets for `material` and `rendered`; only `solid` should intentionally flatten to a neutral CAD/clay material.
4. Treat `wireframe` as a presentation mode over existing mesh materials instead of rebuilding geometry into separate line objects.
5. Keep `renderPreview` as an honest interactive fallback for now, likely matching `rendered` until Phase 4 introduces viewport-local render-preview status.
6. Add focused viewer tests that instantiate the existing `Viewer` harness and assert material/scene/shadow changes across modes without calling `setViewportRenderLayers(...)` again.

Suggested mode behavior for Phase 3:
- `solid`
  - neutral clay/CAD color
  - no per-part material color assignment visible on base geometry
  - normal mesh surfaces remain visible
  - shadows/environment can be subdued or disabled if that is the smallest clear distinction from `rendered`
- `wireframe`
  - mesh `material.wireframe` enabled through the existing material path
  - no geometry/result rebuild
  - selection outlines and transform helpers remain available
- `material`
  - assigned material colors, opacity, side, roughness, metalness, emissive values remain visible
  - environment/background/ground/shadow polish can be reduced if needed so this reads as material inspection instead of final scene rendering
- `rendered`
  - current real-time presentation behavior stays the default
  - environment, lights, ground, tone mapping, and shadows use existing view settings
- `renderPreview`
  - no progressive renderer yet
  - either maps to `rendered` internally or exposes a deterministic unsupported placeholder state only if that can be done without starting the Phase 4 HUD contract

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/shared/viewSettingsTypes.ts` only if a small helper/type export is required
- `src/app/components/ViewerHost.tsx` only if the view-settings effect is not already carrying `displayMode` to the viewer

Definition of done:
- all first four modes visibly map to distinct viewer presentation behavior
- mode switching remains presentation-only
- material assignment and environment settings remain owned by their existing settings systems
- tests prove no build/result-policy state changes are required for mode switching
- tests prove display-mode changes update existing viewer presentation without rerunning render-layer geometry setup
- tests prove `solid`, `wireframe`, `material`, and `rendered` have deterministic material/scene differences
- tests prove `renderPreview` does not start a fake progressive renderer or claim sample progress in Phase 3

### Phase 3 Implementation Result

Shipped:
- added a viewer-local display-mode resolver so `renderPreview` currently falls back to the interactive rendered presentation until the later HUD/backend phases exist
- applied `Solid` through a neutral clay material on existing base meshes without rebuilding render layers
- applied `Wireframe` through the existing material `wireframe` flag path
- preserved assigned material reads for `Material` and `Rendered`
- kept rendered scene polish, including ground and shadow behavior, behind `Rendered` and the temporary `Render Preview` fallback
- kept `Material`, `Solid`, and `Wireframe` inspection modes free of rendered ground/shadow polish
- updated reference mesh wireframe/shadow flags through the same viewer presentation pass without claiming full reference clay-material replacement yet
- added focused `Viewer.test.ts` proof that display-mode changes preserve mesh and geometry identity, restore assigned materials, toggle wireframe deterministically, gate rendered scene polish, and keep render preview as a no-progress fallback

Verification:
- `npm.cmd test -- --run src/viewer/Viewer.test.ts`
- `npm.cmd test -- --run src/viewer/Viewer.test.ts src/app/inputRouting.test.ts src/app/useViewerDisplayModeMenu.test.tsx src/app/store/uiPrefsStore.test.ts src/app/store/scenePresentationEditHistoryReadiness.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `npm.cmd run build`

Deferred:
- render-preview HUD status and progress remain `Model-Viewport-3 / Phase 4`
- progressive render-preview backend work remains `Model-Viewport-3 / Phase 5`

## [x] `Model-Viewport-3 / Phase 4` - `Render Preview Status And HUD Contract`

### Phase 4 Summary

Create the render-preview status contract and HUD behavior before integrating an expensive progressive renderer.

Current status:
- shipped

### Phase 4 Implementation Result

Shipped:
- added `src/app/store/renderPreviewStatusStore.ts` as a viewport-local render-preview status contract with fallback, unsupported, queued, rendering, complete, stale, canceled, error, and inactive states
- added iteration/sample progress fields and deterministic HUD label formatting without choosing a renderer backend
- wired `ViewportOverlay.tsx` to show the render-preview HUD row and compact progress track only while `view.displayMode === 'renderPreview'`
- styled render-preview HUD states in `viewport-overlay.css`
- wired `ViewerHost.tsx` lifecycle hooks so entering Render Preview starts the honest interactive fallback, leaving preview deactivates status, and camera, geometry, material, or lighting/environment changes can mark active preview state stale
- added focused store and HUD tests for fallback, progress, terminal states, stale state, display-mode gating, and viewport-local isolation

Deferred:
- real progressive rendering, sample accumulation, backend selection, and restart/cancel UI behavior remain `Model-Viewport-3 / Phase 5`

### Phase 4 Implementation Spec

Current read:
- `Model-Viewport-3 / Phase 1` made `renderPreview` a first-class `ViewDisplayMode`
- `Model-Viewport-3 / Phase 2` lets the user choose `Render Preview` from the `Shift+D` radial menu
- `Model-Viewport-3 / Phase 3` maps `renderPreview` to the interactive rendered presentation as an honest temporary fallback and does not claim progressive rendering
- `src/app/components/ViewportOverlay.tsx` already owns the compact viewport HUD with:
  - geometry result status
  - overlay mode label
  - selected part label
  - fly-speed controls when fly mode is active
- `src/app/theme/surfaces/viewport-overlay.css` already styles `.ViewportHud` and nearby compact HUD lines
- `src/app/components/TitleStatusBar.tsx` and `src/app/store/runtimeInspectorVm.ts` already own the broader runtime inspector/status rail, but Phase 4 should not have to widen that surface unless compact HUD copy is insufficient
- `src/app/store/viewportRuntimeStatsStore.ts` is a nearby viewport-local store pattern for per-viewport runtime reads, but render-preview status should stay separate from FPS/triangle stats unless there is a clear reason to merge them
- `src/app/components/ViewerHost.tsx` already has access to the active `view.displayMode` and mounted viewer lifecycle, so it is the likely bridge for later render-preview status resets if the contract needs lifecycle hooks
- Phase 4 should introduce a deterministic contract and visible HUD state only; it should not start a real path tracer, worker, accumulation loop, or backend dependency

Must lock:
- status names for render-preview lifecycle
- progress fields such as completed iterations/samples and target iterations/samples
- stale reset behavior for camera, geometry, material, and lighting changes
- HUD placement and compact wording while render preview is active
- honest unsupported-state behavior
- `renderPreview` HUD/status must only appear while `view.displayMode === 'renderPreview'`
- status must be viewport-local so split or secondary model viewers can eventually report independently
- unsupported/fallback states must be visible instead of silently pretending progressive rendering exists
- initial Phase 4 status may be an honest `unsupported` or `fallback` state because Phase 5 owns the first real backend
- progress fields should allow both `iterations` and `samples` naming without committing the backend too early
- camera, geometry, material, lighting/environment, and display-mode exits must have explicit stale/reset semantics in the contract even if Phase 4 only simulates or derives the state

Recommended implementation direction:
1. Add a small `renderPreviewStatus` contract near the viewport/runtime-status layer, likely a new `src/app/store/renderPreviewStatusStore.ts` or equivalent app-level file instead of burying it inside `Viewer`.
2. Keep the status shape viewport keyed:
   - `status: 'inactive' | 'fallback' | 'unsupported' | 'queued' | 'rendering' | 'complete' | 'stale' | 'canceled' | 'error'`
   - `completedIterations: number | null`
   - `targetIterations: number | null`
   - `completedSamples: number | null`
   - `targetSamples: number | null`
   - `message: string | null`
   - `staleReason: 'camera' | 'geometry' | 'material' | 'lighting' | 'display-mode-exit' | null`
   - `updatedAtMs: number | null`
3. In Phase 4, when the selected display mode is `renderPreview`, show a compact HUD block in `ViewportOverlay.tsx` under the existing `Mode` / selection lines.
4. For the first shipped Phase 4 behavior, use an honest fallback/unsupported status such as `Render Preview: interactive fallback` or `Render Preview: backend not connected` until Phase 5 provides real samples.
5. Add store-level helpers for entering preview mode, leaving preview mode, marking stale, updating progress, completing, and reporting unsupported/error states, even if some helpers are only test-covered in this phase.
6. Wire reset semantics narrowly:
   - leaving `renderPreview` marks inactive or clears status
   - camera pose changes can mark stale only while active
   - geometry layer changes can mark stale only while active
   - material/view lighting changes can mark stale only while active
   - Phase 4 does not need to restart rendering after stale; that belongs to Phase 5
7. Keep `TitleStatusBar`/runtime inspector changes out of the first pass unless the HUD copy becomes too cramped.

Suggested HUD copy:
- inactive: no render-preview HUD row
- fallback: `Render Preview: interactive fallback`
- unsupported: `Render Preview: unavailable`
- queued: `Render Preview: queued`
- rendering with iterations: `Render Preview: 12 / 64 iterations`
- rendering with samples: `Render Preview: 128 / 512 samples`
- complete: `Render Preview: complete`
- stale: `Render Preview: stale - camera changed`
- canceled: `Render Preview: canceled`
- error: `Render Preview: error`

Likely files:
- `src/app/store/renderPreviewStatusStore.ts` or a similarly named viewport-local status store
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/components/ViewerHost.tsx` only if lifecycle/reset effects need the mounted viewer bridge
- `src/app/theme/surfaces/viewport-overlay.css`
- focused render-preview status store tests

Definition of done:
- the app can represent render-preview progress without yet requiring the final backend
- HUD copy and state transitions are deterministic
- unsupported or unavailable render-preview runtime is visible and honest
- status stays viewport-local/presentation-only
- leaving render preview clears or deactivates the HUD status deterministically
- camera/geometry/material/lighting changes have explicit stale semantics
- focused tests prove HUD rows, progress labels, fallback/unsupported copy, stale reason copy, and viewport-local isolation
- no path-tracing backend, worker render loop, expensive accumulation, or dependency selection is added in Phase 4

## [x] `Model-Viewport-3 / Phase 5` - `Progressive Render Preview Backend`

### Phase 5 Summary

Integrate the first real progressive render-preview backend behind the status contract.

Current status:
- shipped

### Phase 5 Implementation Spec

Current read:
- Phase 4 added `src/app/store/renderPreviewStatusStore.ts`, `ViewportOverlay.tsx` HUD progress display, and `ViewerHost.tsx` status/stale hooks.
- `src/viewer/Viewer.ts` currently renders every animation frame through `this.renderer.render(this.scene, activeCamera)` in the existing `renderLoop`.
- `Viewer.resolveDisplayMode()` currently maps `renderPreview` back to `rendered` as the honest interactive fallback.
- `ViewerHost.tsx` currently calls `enterFallback(viewportId)` when the view display mode becomes `renderPreview`.
- `three-gpu-pathtracer` is the strongest first backend candidate because the official three.js pathtracer example links to it, it is built for Three.js/WebGL2, and its documented API exposes `WebGLPathTracer`, `setScene(scene, camera)`, `renderSample()`, readonly `samples`, `reset()`, `dispose()`, `updateEnvironment()`, and `updateLights()`.
- `three-gpu-pathtracer` documented constraints include WebGL2, common texture wrapping/filtering, MeshStandardMaterial/MeshPhysicalMaterial support, no instanced geometry, and no interleaved buffers, so Phase 5 must keep an honest unsupported/fallback path.
- `WebGPURenderer` exists in three.js and remains a future research option, but Phase 5 should not switch the main renderer stack to WebGPU.

Implementation result:
- `src/viewer/renderPreviewRuntime.ts` now isolates the concrete `three-gpu-pathtracer` backend behind a small `RenderPreviewRuntime` adapter with a 64-sample default target, WebGL2 support detection, unsupported fallback runtime, and test factory seam.
- `Viewer` now starts the runtime only while `displayMode === 'renderPreview'`, renders one progressive sample per animation frame, emits sample progress and completion, resets on camera pose changes, displayed geometry changes, view-setting changes, and resize, and disposes the runtime when leaving preview.
- `ViewerHost` now forwards viewer-owned render-preview status into the Phase 4 viewport-local status store instead of forcing immediate fallback on entry.
- Focused tests mock the backend adapter to prove progress, completion, reset, cleanup, unsupported fallback, and HUD-store forwarding without depending on real GPU path tracing in Vitest.

Must lock:
- first backend choice:
  - prefer `three-gpu-pathtracer` behind an internal adapter because it can sit beside the existing WebGLRenderer path instead of replacing the viewport renderer
- dependency boundary:
  - add the dependency only if normal `Solid`, `Wireframe`, `Material`, and `Rendered` modes remain unaffected
  - keep path-tracer imports behind the render-preview runtime boundary if practical
- adapter shape:
  - create a small viewer-local `RenderPreviewRuntime` or equivalent wrapper rather than spreading path-tracer calls throughout `Viewer.ts`
  - expose `start`, `renderSample`, `reset`, `dispose`, `updateScene`, `updateCamera`, `updateMaterials`, `updateEnvironment`, and `readStatus` style operations as needed
- status bridge:
  - replace `ViewerHost`'s immediate `enterFallback(...)` with real viewer status/progress callbacks when the backend is supported
  - keep `enterFallback(...)` or `markUnsupported(...)` for unsupported environments and adapter failures
- sample target:
  - start with a small deterministic target such as `64` samples for viewport preview
  - store the target in code-local constants for now unless UI quality presets become necessary
- render-loop behavior:
  - when `displayMode === 'renderPreview'` and the runtime is active, call the path tracer's sample render path instead of the normal raster render for the preview image
  - stop sampling when the target sample count is reached and mark the status `complete`
  - keep normal raster rendering for all other display modes
- reset behavior:
  - camera pose changes reset path-tracer accumulation and status progress instead of merely leaving the stale row forever
  - geometry layer changes rebuild or refresh the path-tracer scene and reset progress
  - material, lighting, environment, ground, and size changes update the path-tracer scene data and reset progress
  - leaving `renderPreview` disposes or pauses expensive preview resources and returns to normal renderer output
- unsupported behavior:
  - if WebGL2 or backend setup fails, keep the interactive rendered fallback visible and mark HUD status `unsupported` or `fallback`
  - do not crash the viewport if a scene feature is unsupported by the backend
- testing boundary:
  - mock the backend adapter in focused viewer tests instead of depending on real GPU path tracing in Vitest
  - add proof that render-preview mode starts the adapter, reports samples, completes at target, resets on camera/scene changes, and disposes on exit
  - keep at least one fallback/unsupported test

Recommended implementation direction:
1. Add a viewer-local adapter file, likely `src/viewer/renderPreviewRuntime.ts`, that hides the concrete `three-gpu-pathtracer` integration behind a small typed interface.
2. Add a render-preview status callback to the viewer surface only if `ViewerHost` needs callback ownership; a method such as `viewer.setOnRenderPreviewStatusChange(...)` is enough.
3. Move the current `renderPreview -> rendered` fallback in `Viewer.resolveDisplayMode()` behind a runtime availability check so unsupported mode remains honest but supported mode can use the preview renderer.
4. In `Viewer.renderLoop`, branch narrowly:
   - update camera/fly/runtime stats as today
   - if render preview is active and supported, render one sample and emit progress
   - otherwise call the existing `renderer.render(...)`
5. Reuse Phase 4 status store labels and progress track by reporting `completedSamples` and `targetSamples` from the viewer/runtime path.
6. Reset the adapter from existing `Viewer` seams:
   - `applyViewSettings(...)`
   - `setViewportRenderLayers(...)`
   - camera pose change detection
   - resize handling
7. Keep the first pass viewport-only:
   - no image export
   - no render queue
   - no save dialog
   - no output resolution picker
   - no WebGPU renderer migration
8. Document any unsupported feature class encountered during implementation as a later follow-up instead of widening this first backend pass.

Source read for backend choice:
- official three.js pathtracer example: `https://threejs.org/examples/webgl_renderer_pathtracer.html`
- `three-gpu-pathtracer` project/API: `https://github.com/gkjohnson/three-gpu-pathtracer`
- three.js `WebGPURenderer` docs for future research boundary: `https://threejs.org/docs/pages/WebGPURenderer.html`

Likely files:
- `package.json`
- `package-lock.json`
- `src/viewer/Viewer.ts`
- `src/viewer/renderPreviewRuntime.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/renderPreviewStatusStore.ts` only if helper names need small widening
- `src/app/components/ViewportOverlay.test.tsx` only if HUD progress semantics need additional proof

Definition of done:
- entering `Render Preview` starts progressive path-tracer accumulation when the adapter is supported
- HUD progress updates from real backend sample progress through the Phase 4 status store
- reaching the target sample count marks the status `complete`
- leaving the mode returns to normal interactive viewport rendering and releases or pauses expensive preview resources
- moving the camera resets sample progress honestly
- changing displayed geometry, material, lighting, environment, ground, or canvas size resets sample progress honestly
- unsupported backend setup shows an honest fallback/unsupported HUD state instead of silently pretending to render
- focused tests prove start/progress/complete/reset/cleanup/fallback behavior with mocked backend objects
- `npm.cmd run build` passes after dependency and type changes

Deferred:
- production render export and image file saving
- render queue management
- user-facing sample target presets
- WebGPU renderer migration or WebGPU path tracing
- full feature parity for every material/light/geometry class unsupported by `three-gpu-pathtracer`

### Phase 5 Prep Notes

`three-gpu-pathtracer` should be treated as a backend adapter, not as the new model viewport owner. The existing Three.js raster viewport remains the normal editing renderer; the path tracer only takes over while `displayMode === 'renderPreview'` and only for progressive presentation.

The first backend implementation should favor correctness and honest status over beauty:
- a modest sample target is enough
- unsupported features should degrade visibly
- every reset should show fresh progress rather than leaving stale output pretending to be current

The implementation should avoid making render preview part of geometry truth. It consumes the visible scene and camera; it does not decide draft/final result policy, export validity, or graph execution freshness.

Suggested first target:
- `targetSamples: 64`
- one sample per animation frame while active
- status row: `Render Preview: X / 64 samples`
- complete row after target: `Render Preview: complete`

## [x] `Model-Viewport-3 / Phase 6` - `Render Preview Settings Contract`

### Phase 6 Summary

Add one explicit render-preview settings contract before the Properties UI starts editing quality values.

Current status:
- shipped

### Phase 6 Implementation Spec

Current read:
- Phase 5 hard-codes `DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES = 64` in `src/viewer/renderPreviewRuntime.ts`.
- `three-gpu-pathtracer` exposes runtime-quality levers such as `bounces`, `filterGlossyFactor`, `renderScale`, `minSamples`, `renderDelay`, `fadeDuration`, and `tiles`.
- The existing viewport view settings already own exposure/tone mapping, environment, lighting, ground, shadows, and display mode.
- `src/shared/viewSettingsTypes.ts` already owns `ViewSettings`, `DEFAULT_VIEW_SETTINGS`, `normalizeViewSettings(...)`, and the `displayMode` normalization used by the shipped display-mode lane.
- `src/app/store/uiPrefsStore.ts` already exposes generic `setView(...)` and `setViewKey(...)` paths, so Phase 6 can add the contract without creating a render-specific mutator unless tests show that a helper keeps callers cleaner.
- `src/app/store/uiPrefsPersistence.ts` already carries selected view-settings fields under `viewSettingsPersistence`, so Phase 6 should explicitly include render-preview settings in the same presentation-settings policy.
- Existing focused tests in `src/app/store/uiPrefsStore.test.ts`, `src/app/store/scenePresentationEditHistoryReadiness.test.ts`, and `src/app/store/useUiPrefsPersistenceBridge.test.tsx` already cover defaults, invalid saved values, display-mode carry-through, and persistence-policy behavior.
- Render-preview settings should tune presentation quality only. They must not become graph execution, build freshness, export validity, or geometry result truth.

Implementation result:
- `ViewSettings` now includes a nested `renderPreview` quality settings object.
- `src/shared/viewSettingsTypes.ts` exports render-preview defaults, numeric constraints, option arrays, unions, and `normalizeRenderPreviewSettings(...)`.
- Defaults are `targetSamples: 64`, `bounces: 6`, `renderScale: 1`, `noiseCleanup: 'off'`, and `gpuLoad: 'balanced'`.
- `normalizeViewSettings(...)` normalizes and clones render-preview settings with safe bounds and option fallbacks.
- `uiPrefsPersistence.ts` carries render-preview settings under `viewSettingsPersistence` and preserves base/current values when that policy is disabled.
- The Phase 5 runtime default sample constant now reads from the shared default, but selected settings are not applied to the runtime until Phase 8.
- Focused tests cover defaults, invalid-value normalization, setter behavior, persistence-policy separation, and hydration.

Must lock:
- persistent settings shape for render-preview quality, likely `ViewSettings['renderPreview']`
- deterministic defaults:
  - `targetSamples`: default `64`
  - `bounces`: default `6` as the first conservative CAD-preview baseline
  - `renderScale`: default `1`
  - `noiseCleanup`: default `off`
  - `gpuLoad`: default `balanced`
- normalization for invalid persisted values
- one migration path from the current hard-coded sample target
- settings live under `ViewSettings` as a new nested `renderPreview` object unless implementation uncovers a stronger local owner
- exported unions/options should support the future ParaSelect UI:
  - `RenderPreviewNoiseCleanup = 'off' | 'low' | 'medium' | 'high'`
  - `RenderPreviewGpuLoad = 'smooth' | 'balanced' | 'fast'`
- numeric constraints should be centralized beside the defaults so Phase 7 ParaSliders can reuse them:
  - samples min/max/step or option ladder
  - bounces min/max/step
  - render scale min/max/step
- `normalizeViewSettings(...)` must deep-clone and normalize the nested object, not preserve caller references
- `applyPersistedViewPolicy(...)` and `mergePersistedUiPrefsView(...)` must include render-preview settings when `viewSettingsPersistence` is enabled and preserve the base/current value when it is disabled
- no Properties workspace UI yet unless needed for proof
- no runtime use of the values yet except aligning or documenting the current default constant; Phase 8 owns applying the values to `renderPreviewRuntime.ts`

Recommended implementation direction:
1. Add render-preview settings types, default constants, option arrays, and a `normalizeRenderPreviewSettings(...)` helper in `src/shared/viewSettingsTypes.ts`.
2. Add `renderPreview` to `ViewSettings` and `DEFAULT_VIEW_SETTINGS`.
3. Add `renderPreview` normalization into `normalizeViewSettings(...)`.
4. Let `useUiPrefsStore.setView(...)` and `setViewKey(...)` carry the nested object through the existing generic view-setting path.
5. Update persistence policy helpers so render-preview settings are considered presentation/view settings.
6. Add focused tests before touching UI:
   - default render-preview settings exist
   - invalid persisted render-preview settings normalize to defaults or clamped values
   - `setViewKey('renderPreview', ...)` updates the nested settings
   - persistence serialization/hydration keeps render-preview settings
   - `viewSettingsPersistence: false` prevents persisted render-preview settings from overriding the base/current view

Likely files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `src/viewer/renderPreviewRuntime.ts` only if the default sample constant should import from the shared contract without widening runtime behavior

Definition of done:
- render-preview quality settings exist in one typed app/shared contract
- settings have stable defaults and normalization
- existing saved view settings hydrate safely
- the contract is documented as presentation-only
- focused tests prove defaults, invalid-value normalization, setter behavior, and persistence behavior
- no Properties `Render` section is added in Phase 6
- no runtime settings application is added in Phase 6
- `npm.cmd run build` passes after type changes

## [x] `Model-Viewport-3 / Phase 7` - `Properties Render Section`

### Phase 7 Summary

Add the first Properties workspace `Render` section for user-facing render-preview quality controls.

Current status:
- shipped
- implemented in `src/app/workspace/PropertiesRenderSection.tsx`
- `Properties` now exposes a no-focused-item `Render` section while `Materials` remains object-scoped
- runtime settings application remains deferred to Phase 8

### Phase 7 Implementation Spec

Current code read:
- `PropertiesSurface.tsx` currently registers only `propertiesMaterialsSectionDefinition`.
- `propertiesSectionContract.tsx` currently limits `PropertiesSectionId` to `materials`, requires a selected target in `PropertiesSectionContext`, and returns `empty` whenever `selectedTarget === null`.
- `PropertiesMaterialsSection.tsx` is object-scoped through `supports: (selectedTarget) => selectedTarget.kind === 'object'`.
- `ParaSlider` and `ParaSelect` already live in `src/app/components` and support the needed numeric and preset controls.
- Phase 6 already added the typed owner, defaults, constraints, option unions, and normalization under `ViewSettings.renderPreview`.

Must lock:
- Properties gets a `Render` section alongside the existing section model instead of hiding render quality only in the viewport HUD.
- `Render` is a viewport/global Properties section, not an object/material section.
- `Materials` remains object-scoped.
- `Render` should be available even when no object is focused; do not force users to select geometry just to tune render-preview quality.
- the Properties section contract may need a small widening so section definitions can declare global support without breaking object-scoped section content.
- numeric settings use ParaSliders:
  - `Samples`
  - `Light bounces`
  - `Render scale`
- preset or mode settings use ParaSelects:
  - `Noise cleanup`
  - `GPU load`
- controls write to the Phase 6 settings owner, not directly to `Viewer`.
- setting writes should use the existing UI prefs store view-setting path, preferably through `setViewKey('renderPreview', normalizeRenderPreviewSettings(...))` or an equally small local helper that still uses that owner.
- labels stay plain and product-facing:
  - `Samples`
  - `Light bounces`
  - `Render scale`
  - `Noise cleanup`
  - `GPU load`
- no export, save, render queue, output-file, resolution preset, or background-render controls in this phase.
- no new exposure owner in this phase; exposure should stay with the existing viewport/environment setting until a later explicit UX decision.
- no runtime settings application in this phase; Phase 8 owns mapping settings into `RenderPreviewRuntime`.
- no quality presets yet; Phase 9 owns presets.

Recommended first control set:
- `Samples` ParaSlider:
  - use Phase 6 constants for min/max/default
  - step should be the Phase 6 step if present, otherwise a small deterministic step such as `1` or `8`
  - format as a plain sample count
- `Light bounces` ParaSlider:
  - use Phase 6 constants for min/max/default
  - format as a plain bounce count
- `Render scale` ParaSlider:
  - use Phase 6 constants for min/max/default
  - display as percent through `formatValue`
- `Noise cleanup` ParaSelect:
  - options: `Off / Low / Medium / High`
  - keep this as a friendly preset rather than exposing `filterGlossyFactor` raw
- `GPU load` ParaSelect:
  - `Smooth / Balanced / Fast`
  - maps later to tile count or sampling aggressiveness

Recommended implementation direction:
1. Add a `PropertiesRenderSection.tsx` or `PropertiesRenderSectionContent.tsx` owner rather than expanding `PropertiesSurface.tsx` with all control details.
2. Add `render` to `PropertiesSectionId`.
3. Widen `PropertiesSectionDefinition.supports` or add a section-scope flag so global sections can be ready without a selected target.
4. Keep the existing object-target context available for `Materials`; if global sections need context, make the selected target optional only where the section contract requires it.
5. Register `[propertiesMaterialsSectionDefinition, propertiesRenderSectionDefinition]` in `PropertiesSurface.tsx`.
6. Make the active section resolver prefer a valid requested section, otherwise pick the first available section; when there is no selected target, `Render` should be the available section.
7. Add a compact render-settings panel using existing ParaSlider and ParaSelect styling conventions.
8. Read from `useUiPrefsStore((state) => state.view.renderPreview)` and write back through the Phase 6 normalized render-preview object.
9. Keep all controls useful regardless of current display mode; do not require `displayMode === 'renderPreview'` to edit saved quality settings.

Likely files:
- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/propertiesSectionContract.tsx`
- `src/app/workspace/propertiesSectionContract.test.ts`
- `src/app/workspace/PropertiesRenderSection.tsx` or `src/app/workspace/PropertiesRenderSectionContent.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/shared/viewSettingsTypes.ts` only if Phase 6 constants need a small export polish
- existing `src/app/components/ParaSlider.tsx`
- existing `src/app/components/ParaSelect.tsx`
- the local Properties/Settings styling owner if spacing needs a small class

Definition of done:
- [x] Properties exposes a selectable `Render` section
- [x] controls render with ParaSliders and ParaSelects where practical
- [x] controls read/write the Phase 6 settings owner
- [x] Render stays available with no focused object
- [x] Materials remains object-scoped and does not become available for unsupported targets
- [x] tests prove the section appears, writes settings, preserves normalized bounds, and does not change geometry result policy
- [x] Phase 7 does not wire runtime settings application; Phase 8 still owns mapping selected settings into `RenderPreviewRuntime`
- [x] `npm.cmd run build` passes after the Properties contract changes

## [x] `Model-Viewport-3 / Phase 8` - `Render Settings Runtime Wiring`

### Phase 8 Summary

Apply Properties render settings to the live render-preview runtime and reset accumulation honestly when quality changes.

Current status:
- shipped

### Phase 8 Implementation Spec

Shipped implementation read:
- `src/viewer/renderPreviewRuntime.ts` now accepts selected `RenderPreviewSettings` through `RenderPreviewRuntimeCreateOptions`.
- `ThreeGpuPathTracerRuntime` maps the shared settings contract into the concrete adapter fields:
  - `bounces`
  - `filterGlossyFactor`
  - `renderScale`
  - `tiles`
- `Viewer.ensureRenderPreviewRuntime()` keys active preview runtime instances by selected render-preview settings, recreates the runtime when quality changes while active, and passes the selected settings through the factory.
- `Viewer.applyViewSettings(...)` continues to receive the full `ViewSettings` object, so no separate `ViewerHost` bridge was needed for this phase.
- `Viewer.test.ts` now covers selected settings propagation, HUD target samples, active quality-change restarts, inert changes outside Render Preview, and existing unsupported/raster fallback behavior.

Must lock:
- `targetSamples` comes from `ViewSettings.renderPreview.targetSamples` instead of the hard-coded Phase 5 default.
- `bounces`, `renderScale`, `filterGlossyFactor`, and tile/GPU-load settings flow into `RenderPreviewRuntime`.
- changing any render-preview quality setting resets accumulation and restarts HUD progress while `displayMode === 'renderPreview'`.
- changing render-preview settings while outside `renderPreview` mode should not create/start a path-tracing runtime.
- unsupported settings fail softly and report honest fallback/error status only when needed.
- normal real-time display modes remain unaffected by render quality settings.
- runtime adapter remains the only place that knows concrete `three-gpu-pathtracer` property names.
- no Properties UI changes unless a tiny label or test selector adjustment is needed for proof.
- no quality presets; Phase 9 owns presets.
- no render export, render queue, output-file, output resolution, or save behavior.

Recommended mapping:
- `Samples` -> runtime `targetSamples`
- `Light bounces` -> path tracer `bounces`
- `Render scale` -> path tracer `renderScale`
- `Noise cleanup` -> path tracer `filterGlossyFactor`
  - `Off`: `0`
  - `Low`: small value such as `0.25`
  - `Medium`: middle value such as `0.5`
  - `High`: stronger value such as `0.75` or `1`
- `GPU load` -> path tracer `tiles` profile:
  - `Smooth`: more tiles, more responsiveness
  - `Balanced`: current middle path
  - `Fast`: fewer tiles, more aggressive sampling per frame

Recommended implementation direction:
1. Add a render-preview runtime settings/options shape in `src/viewer/renderPreviewRuntime.ts` that mirrors the Phase 6 `RenderPreviewSettings` without leaking `three-gpu-pathtracer` field names into app/UI files.
2. Update `RenderPreviewRuntimeCreateOptions` so the factory receives the selected settings object or a normalized runtime options object instead of only `targetSamples`.
3. Keep `DEFAULT_RENDER_PREVIEW_TARGET_SAMPLES` available only as a fallback/default, not as the active selected sample count.
4. Add small adapter helpers in `renderPreviewRuntime.ts`:
   - normalize/create runtime settings from Phase 6 settings
   - map `noiseCleanup` to `filterGlossyFactor`
   - map `gpuLoad` to `tiles`
5. Apply adapter fields in `ThreeGpuPathTracerRuntime` constructor after `new WebGLPathTracer(renderer)`.
6. Teach `UnsupportedRenderPreviewRuntime` to carry the selected `targetSamples` so HUD/status remains honest even when unsupported.
7. In `Viewer`, track the last applied render-preview runtime settings identity or a stable settings key.
8. When `displayMode === 'renderPreview'` and the key changes:
   - dispose and recreate the runtime if constructor-only settings changed, or update/reset if implementation keeps runtime mutation safe
   - emit `rendering` with `completedSamples: 0`
   - emit the selected `targetSamples`
9. When `displayMode !== 'renderPreview'`, preserve the existing behavior of disposing/leaving preview and do not start runtime work for settings-only changes.
10. Add focused tests before broad cleanup:
   - runtime factory receives selected `targetSamples`, bounces, render scale, noise cleanup, and GPU load
   - HUD status target sample count follows the selected Properties value
   - changing render-preview settings while active resets accumulation to 0
   - changing render-preview settings while in `rendered` mode does not create/start a render-preview runtime
   - unsupported runtime reports the selected target sample count where applicable and still allows raster fallback

Likely files:
- `src/viewer/renderPreviewRuntime.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.tsx` only if render settings need an explicit bridge beyond the existing full `applyViewSettings(...)` call
- focused runtime/settings tests

Definition of done:
- [x] render-preview runtime receives the selected quality settings
- [x] HUD target sample count matches the selected `Samples` value
- [x] accumulation resets when render quality changes while active
- [x] render-preview settings changes outside render-preview mode do not start the path tracer
- [x] unsupported/fallback paths remain stable
- [x] focused tests prove settings propagation, sample-target HUD updates, reset behavior, unsupported behavior, and no raster-mode regression
- [x] `npm.cmd run build` passes after runtime wiring

## [x] `Model-Viewport-3 / Phase 9` - `Render Quality Presets And Cleanup`

### Phase 9 Summary

Add friendly quality presets and close the render-preview tuning lane with cleanup, final proof, and explicit later handoffs.

Current status:
- shipped

### Phase 9 Implementation Spec

Current live read:
- Phase 6 added `RenderPreviewSettings`, `DEFAULT_RENDER_PREVIEW_SETTINGS`, constraints, options, and `normalizeRenderPreviewSettings(...)` in `src/shared/viewSettingsTypes.ts`.
- Phase 7 added `src/app/workspace/PropertiesRenderSection.tsx` with a global Properties `Render` section, ParaSliders for `Samples`, `Light bounces`, and `Render scale`, ParaSelects for `Noise cleanup` and `GPU load`, and a `Reset` action that writes the existing `ViewSettings.renderPreview` owner.
- Phase 8 wired `ViewSettings.renderPreview` through `Viewer.applyViewSettings(...)` into `src/viewer/renderPreviewRuntime.ts`, including runtime recreation/reset while `displayMode === 'renderPreview'` and inert behavior outside Render Preview.
- `src/app/workspace/PropertiesSurface.test.tsx` already proves Render section availability and manual render-preview setting writes.
- `src/viewer/Viewer.test.ts` already proves selected settings flow into the runtime, HUD sample targets follow settings, active quality changes recreate/reset accumulation, and raster modes stay unaffected.
- Existing environment preset helpers in `viewSettingsTypes.ts` show a nearby pattern for shared preset definitions plus derived custom reads, but render quality presets must stay scoped to `renderPreview`, not environment, lighting, material, export, or geometry truth.

Implementation result:
- `src/shared/viewSettingsTypes.ts` now defines render-preview quality presets for `Fast`, `Balanced`, `Clean`, and `High`, plus helper reads for matching settings back to a named preset or `Custom`.
- `Balanced` maps to `DEFAULT_RENDER_PREVIEW_SETTINGS`, so defaults continue to have one source of truth.
- `PropertiesRenderSection.tsx` now shows a `Quality preset` ParaSelect above the manual controls.
- Selecting a named preset writes the same `ViewSettings.renderPreview` settings used by the manual controls; selecting `Custom` is a no-op because `Custom` is only a derived readout.
- Manual render-setting changes show `Custom` when the current values diverge from all named presets and return to a named preset when the values match exactly.
- Active Render Preview preset changes use the Phase 8 quality-change path, so accumulation restarts and HUD target progress updates without adding a second runtime reset seam.
- Dedicated render-preview exposure override, image export, render queue, output resolution, and final render file saving remain deferred.

Must lock:
- quality presets are user-facing shortcuts, not a second settings owner
- presets update the same Phase 6 render-preview settings contract used by manual controls
- manual controls remain readable after a preset is selected
- preset selection is derived from current settings:
  - exact match to a named preset shows that preset
  - any manual setting change that diverges from all named preset values shows `Custom`
  - manually changing values back to an exact named mapping should show that named preset again
  - `Custom` is a readout/selector option, not its own saved settings object
- preset labels should be simple:
  - `Fast`
  - `Balanced`
  - `Clean`
  - `High`
  - `Custom`
- later export/render-queue work stays deferred
- exposure decision is recorded:
  - Phase 9 should link Render Preview exposure to the existing environment/exposure presentation lane for now
  - dedicated render-preview exposure override remains deferred to a later explicit phase/doc if the product needs it

Suggested preset mapping:
- `Fast`:
  - `targetSamples: 32`
  - `bounces: 3`
  - `renderScale: 0.5`
  - `noiseCleanup: 'off'`
  - `gpuLoad: 'smooth'`
- `Balanced`:
  - `DEFAULT_RENDER_PREVIEW_SETTINGS`
- `Clean`:
  - `targetSamples: 128`
  - `bounces: 8`
  - `renderScale: 1`
  - `noiseCleanup: 'medium'`
  - `gpuLoad: 'balanced'`
- `High`:
  - `targetSamples: 256`
  - `bounces: 12`
  - `renderScale: 1`
  - `noiseCleanup: 'high'`
  - `gpuLoad: 'fast'`

Recommended implementation direction:
1. Add a shared render-preview preset contract in `src/shared/viewSettingsTypes.ts`:
   - `RenderPreviewQualityPreset = 'fast' | 'balanced' | 'clean' | 'high'`
   - `RenderPreviewQualityPresetRead = RenderPreviewQualityPreset | 'custom'`
   - `RENDER_PREVIEW_QUALITY_PRESET_DEFINITIONS`
   - `RENDER_PREVIEW_QUALITY_PRESET_OPTIONS`
   - `CUSTOM_RENDER_PREVIEW_QUALITY_PRESET_OPTION` only if the UI needs a native select option
2. Add small helpers beside the render-preview settings normalization:
   - `getRenderPreviewQualityPresetDefinition(...)`
   - `createRenderPreviewQualityPresetSettings(...)`
   - `resolveRenderPreviewQualityPresetRead(settings)`
   - `areRenderPreviewSettingsEqual(...)` if equality should be named and tested directly
3. Keep `balanced` mapped to `DEFAULT_RENDER_PREVIEW_SETTINGS` so the default read is `Balanced` without a second source of truth.
4. In `PropertiesRenderSection.tsx`, add one `Quality preset` ParaSelect above the manual controls.
5. The ParaSelect value should be derived from `resolveRenderPreviewQualityPresetRead(renderPreview)`, so manual edits naturally move the displayed value to `Custom`.
6. When the user selects `Fast`, `Balanced`, `Clean`, or `High`, write `setViewKey('renderPreview', createRenderPreviewQualityPresetSettings(value))`.
7. If the select emits `custom`, treat it as a no-op because `Custom` is only the read state for diverged manual values.
8. Keep the existing manual sliders/selects writing partial patches through `normalizeRenderPreviewSettings(...)`; do not add any `selectedRenderPreset` field to `ViewSettings`.
9. Keep the existing `Reset` action as a reset to defaults; with the derived read it should show `Balanced` afterward.
10. Use existing Phase 8 runtime behavior for active reset proof instead of adding a second render-preview restart path.

Likely files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts` for shared helper/default/custom-read proof if the helper is not fully covered through Properties tests
- `src/viewer/Viewer.test.ts` for one focused proof that applying a preset while Render Preview is active resets accumulation and updates HUD target progress through the existing settings path
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Definition of done:
- Properties `Render` section exposes a `Quality preset` ParaSelect
- applying a preset updates the same underlying render-preview settings as manual controls
- `Custom` appears when manual controls diverge from every named preset
- manually matching a named preset again makes the selector show that preset
- no saved `selectedRenderPreset` or second settings owner is added
- changing presets while Render Preview is active resets accumulation and updates HUD target progress
- final tests cover presets, manual override behavior, and runtime reset behavior
- doc handoff clearly defers image export, render queue, output resolution, final render file saving, and dedicated render-preview exposure override
- `npm.cmd run build` passes after the preset contract/UI changes

## [x] `Model-Viewport-3 / Phase 10` - `Material Mode Lighting Separation`

### Phase 10 Summary

Make `Material` mode behave like an assigned-material color/readability mode instead of continuing to inherit the full environment-lighting look.

Current status:
- shipped

### Phase 10 Implementation Spec

Current live read:
- `Viewer.applyViewSettings(...)` currently applies environment grade, environment source, and environment lights before applying material assignments for every display mode.
- `resolveDisplayModeShadowsEnabled()` already limits shadows to `rendered`.
- `resolveDisplayModeGroundSettings()` already limits ground visibility to `rendered`.
- `Material` mode currently differs from `Rendered` mainly by disabling shadows/ground and using assigned materials without wireframe; it still uses `MeshStandardMaterial`, scene lights, tone mapping, and environment contribution.
- `Viewer.test.ts` already proves material assignment and rendered polish boundaries, but does not yet prove lighting-neutral material mode.
- `resolveMaterialForPart(...)` is the main narrow seam for choosing which runtime material object a part mesh receives.
- `applyMaterialSettings(...)` owns the current `materialCacheByPresetId` for assigned `MeshStandardMaterial` runtime materials.
- `applyMaterialAssignmentsToScene()` already reassigns mesh materials after settings/mode changes.
- `createLayerMaterial(...)` clones the resolved base material for baseline/overlay layers, so any material-mode unlit treatment must either route through the same resolver or explicitly preserve overlay opacity behavior.
- `applyReferenceDisplayModeToScene()` only toggles wireframe/shadow flags on loaded reference mesh materials today; reference/import material-mode lighting neutrality may need a smaller follow-up if those meshes are not controlled by the part material cache.

Implementation result:
- `Viewer.ts` now imports `MeshBasicMaterial` and owns `materialModeCacheByPresetId` beside the existing `materialCacheByPresetId`.
- `applyMaterialSettings(...)` keeps both caches synchronized from the same `materials.presets` owner and disposes removed presets from both caches.
- `applyPresetToMaterialModeMaterial(...)` copies only unlit presentation fields for Material mode: color, opacity, transparency, sidedness, wireframe, and `toneMapped = false`.
- `resolveMaterialForPart(...)` routes `material` display mode through the unlit cache, while `rendered`, `renderPreview`, and `wireframe` continue to use the existing lit material cache and `solid` keeps its clay material.
- `applyViewSettings(...)` now neutralizes material-mode environment grade/filter presentation while preserving environment source and light ownership for rendered modes.
- Focused `Viewer.test.ts` coverage proves Material mode uses unlit material instances, environment grade/light changes do not change the Material color read, Rendered restores `MeshStandardMaterial`, and display-mode switching keeps the same mesh/geometry.

Must lock:
- `Material` mode should show assigned material colors without environment lights, HDRI lighting contribution, tone mapping/exposure shifts, shadows, or ground polish changing the read.
- `Rendered` and `Render Preview` should continue to use environment lights, HDRI lighting contribution, tone mapping/exposure, shadows, and ground behavior.
- `Solid` should keep its clay/CAD-style presentation.
- `Wireframe` should keep its line/topology read.
- material assignment truth stays unchanged:
  - selected preset material
  - per-part material assignment
  - imported/reference material fallback behavior
  - material editing data
- this phase should not add new user-facing settings unless implementation uncovers a tiny label/test-selector need.
- this phase should not change graph execution, geometry result choice, export readiness, render-preview quality settings, or render queue behavior.

Recommended implementation direction:
1. Import `MeshBasicMaterial` in `Viewer.ts`.
2. Add a viewer-owned unlit material cache, likely `materialModeCacheByPresetId`, beside `materialCacheByPresetId`.
3. Add a small helper such as `applyPresetToUnlitMaterial(...)` that copies only presentation-safe fields from `MaterialPreset`:
   - `color`
   - `opacity`
   - `transparent`
   - `side`
   - `wireframe`
   - avoid metalness, roughness, emissive, and emissive intensity because those are lighting/material-model inputs rather than unlit color-read inputs
4. Update `applyMaterialSettings(...)` so both caches are created, updated, and disposed from the same `materials.presets` owner.
5. Update `resolveMaterialForPart(...)` to route `material` display mode through the unlit cache, while `rendered` and `renderPreview` continue to use the existing `MeshStandardMaterial` cache.
6. Keep `solid` routed to the existing clay material and `wireframe` routed through the current wireframe behavior.
7. Keep `applyEnvironmentSource(...)` and `applyLights(...)` intact for rendered modes; do not remove environment lights globally just to fix material mode.
8. Keep switching between `material` and `rendered` rebuild-free by reusing existing meshes and only swapping material instances via `applyMaterialAssignmentsToScene()`.
9. Limit first-pass proof to part meshes that already use the viewer-owned material assignment cache. Do not widen into imported/reference mesh material rewriting unless the implementation turns out to share the same narrow helper safely.
10. Add focused tests:
   - `material` mode assigns an unlit material type while preserving assigned preset color
   - changing environment grade/light/HDRI settings while in `material` mode does not swap away from the unlit material read or change its assigned color
   - switching back to `rendered` restores `MeshStandardMaterial` behavior
   - switching between `material` and `rendered` keeps the same mesh and geometry object
   - `wireframe`, `solid`, and `renderPreview` existing expectations remain stable

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Definition of done:
- [x] `Material` mode no longer visibly depends on environment lights or HDRI lighting contribution
- [x] assigned material color/read stays stable in `Material` mode when environment settings change
- [x] `Material` mode uses a clearly unlit material runtime for viewer-owned part meshes
- [x] `Rendered` and `Render Preview` retain environment-lit behavior
- [x] switching display modes stays rebuild-free
- [x] focused viewer tests prove the material/rendered lighting split
- [x] `npm.cmd run build` passes after the viewer changes

## [x] `Model-Viewport-3 / Phase 10.1` - `Material Mode Neutral Fill Lighting Fix-Up`

### Phase 10.1 Summary

Bring enough lighting/reflection model back into `Material` mode for roughness and metallicness editing to be visible, while keeping the mode free from harsh authored point-light shadows and final scene mood.

Current status:
- shipped

### Phase 10.1 Implementation Spec

Current live read:
- Phase 10 changed `Material` mode to a `MeshBasicMaterial` cache so assigned material colors no longer inherit environment/HDRI/scene-light mood.
- That solved the harsh lighting problem, but it also removed the PBR lighting model that makes `metalness` and `roughness` visually meaningful.
- `applyPresetToMaterial(...)` still maps `metalness`, `roughness`, emissive fields, opacity, sidedness, and wireframe onto the existing `MeshStandardMaterial` cache.
- `applyPresetToMaterialModeMaterial(...)` intentionally skips metalness, roughness, emissive, and emissive intensity because its current target is `MeshBasicMaterial`.
- `applyLights(settings.lighting.lights)` is still the global authored-light application path and should remain the rendered/render-preview scene-light owner.
- `applyViewSettings(...)` always calls `applyLights(settings.lighting.lights)` today, so 10.1 needs a narrow mode gate there rather than changing the material settings owner.
- `lightsById`, `lightTargetsById`, and `environmentLightHelpersById` are the current authored-light runtime maps; the neutral Material-mode fill light should not be stored in those maps as if it were a user-authored light.
- `clearAllLights()` and `removeLight(...)` already own authored-light disposal and helper cleanup; any new inspection light needs a separate add/remove or visible-toggle path.
- `resolveDisplayModeEnvironmentGrade()` already neutralizes Material-mode tone mapping/exposure/filter and should remain the material inspection baseline unless visual proof says otherwise.
- `resolveDisplayModeShadowsEnabled()` and `resolveDisplayModeGroundSettings()` already keep shadows and ground out of `Material` mode.
- `applyShadowFlags()` already re-applies mesh shadow flags after view settings changes, so material-mode no-shadow behavior should stay there.
- Existing tests around `applies display modes through existing mesh presentation without rebuilding geometry`, `keeps material mode on unlit material instances when environment lighting changes`, and `keeps rendered scene polish behind rendered and render-preview display modes` are the main update points.

Implementation result:
- `materialModeCacheByPresetId` now uses `MeshStandardMaterial`, so Material mode remains PBR-capable.
- `applyPresetToMaterialModeMaterial(...)` now carries color, metalness, roughness, emissive, emissive intensity, opacity, transparency, sidedness, wireframe, and a neutral `toneMapped = false` inspection read.
- The viewer owns one neutral `HemisphereLight` for Material mode inspection, kept outside the authored-light maps.
- `applyViewSettings(...)` now routes Material mode through the neutral inspection light path and clears authored lights there, while rendered/render-preview modes still call the authored `applyLights(...)` path.
- Material mode clears HDRI/environment lighting contribution while keeping the neutral environment grade/filter baseline from Phase 10.
- Focused `Viewer.test.ts` coverage now proves Material mode uses `MeshStandardMaterial`, preserves roughness/metalness/emissive values, enables only the neutral inspection light, clears authored lights, keeps shadows/ground disabled, restores authored lights in Rendered mode, and switches display modes without rebuilding meshes.

Must lock:
- `Material` mode should not be fully unlit if that hides roughness/metallicness.
- `Material` mode should not use the user-authored scene lights directly.
- `Material` mode should not cast harsh point/spot/directional shadows.
- `Material` mode should use a simple neutral fill-light inspection model:
  - likely one `HemisphereLight` first
  - optional very low-intensity neutral directional fill only if tests/visual read need it
  - no shadow casting
  - neutral white/gray light colors
- `Material` mode should use lit PBR-capable material instances again, likely `MeshStandardMaterial`, so roughness and metallicness values are visible.
- `Rendered` and `Render Preview` must keep the existing authored lights, HDRI/environment contribution, tone mapping, shadows, ground, and render polish.
- This phase should not add user-facing lighting controls unless a later product pass wants a dedicated material-inspection-light setting.

Recommended implementation direction:
1. Change `materialModeCacheByPresetId` from `Map<MaterialPresetId, MeshBasicMaterial>` to `Map<MaterialPresetId, MeshStandardMaterial>`.
2. Remove the `MeshBasicMaterial` import from `Viewer.ts` unless another local use remains.
3. Make `applyPresetToMaterialModeMaterial(...)` accept `MeshStandardMaterial` and apply the same preset fields as `applyPresetToMaterial(...)`, including:
   - `color`
   - `metalness`
   - `roughness`
   - `emissive`
   - `emissiveIntensity`
   - `opacity`
   - `transparent`
   - `side`
   - `wireframe`
4. Keep `material.toneMapped = false` for the material-mode inspection cache if that helps preserve Phase 10's stable color read; otherwise explicitly document and test any tiny neutral baseline change.
5. Add a viewer-owned neutral inspection fill light:
   - prefer one `HemisphereLight`
   - suggested colors: sky `#ffffff`, ground `#d7dce5`
   - suggested intensity: start around `1.6`
   - never cast shadows
   - keep it outside `lightsById`/`lightTargetsById`/`environmentLightHelpersById`
6. Add a small helper such as `syncMaterialModeInspectionLight()` or `setMaterialModeInspectionLightEnabled(...)` that attaches/removes or toggles the inspection light based on `resolveDisplayMode() === 'material'`.
7. Gate authored scene lights in `applyViewSettings(...)`:
   - if effective display mode is `material`, call `clearAllLights()` or otherwise disable authored lights and enable the inspection light
   - otherwise disable/remove the inspection light and call `applyLights(settings.lighting.lights)` as today
8. Keep `applyEnvironmentSource(settings)` behavior only if the current environment contribution is neutralized enough by Material-mode material `toneMapped = false`; if HDRI environment still affects metallic reflections too strongly, Material mode should explicitly clear scene environment while preserving rendered/render-preview environment state on mode switch.
9. Keep shadow maps, mesh `castShadow`/`receiveShadow`, and ground disabled in Material mode through the existing display-mode helpers.
10. Do not touch graph execution, geometry result choice, material editing state, export readiness, render-preview quality settings, or render queue behavior.
11. Update focused `Viewer.test.ts` coverage:
   - Material mode assigns `MeshStandardMaterial` or another PBR-capable material type, not `MeshBasicMaterial`.
   - Material mode material instances preserve changed roughness and metalness values.
   - Material mode enables only the neutral fill/inspection light path and does not keep authored scene lights active.
   - authored lights return when switching back to rendered.
   - Material mode keeps shadows/ground disabled.
   - Rendered and Render Preview continue to use authored lights and rendered scene polish.
   - Switching modes remains rebuild-free.

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Definition of done:
- [x] `Material` mode visibly reflects roughness and metallicness changes again
- [x] `Material` mode uses neutral fill/inspection lighting instead of authored scene lights
- [x] no harsh material-mode point/spot shadows return
- [x] `Rendered` and `Render Preview` retain authored lighting and render polish
- [x] focused viewer tests prove material-mode PBR readability, neutral fill gating, and rebuild-free switching
- [x] `npm.cmd run build` passes after the fix-up
