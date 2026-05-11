# `Model-Viewport-3` - `Display Mode Radial Menu And Render Preview`

## Doc Header

### Doc History
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

- [ ] `HLG 1. The user can press Shift+D in the model viewport and choose a display mode from a radial menu.`
- [ ] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [ ] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [ ] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 1`

- [ ] Define the display-mode contract and persistence/read semantics.
- [ ] Add `Solid`, `Wireframe`, `Material`, and `Rendered` as named presentation modes.
- [ ] Keep the contract separate from `Auto / Draft / Final` result policy.
- [ ] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [ ] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 2`

- [ ] Add the `Shift+D` radial menu trigger for the active model viewport.
- [ ] Route radial-menu selection through the display-mode contract instead of direct viewer-only state.
- [ ] Keep keyboard ownership honest around editable fields, sketch draw, fly mode, and transform sessions.
- [ ] `HLG 1. The user can press Shift+D in the model viewport and choose a display mode from a radial menu.`

### `Model-Viewport-3 Phase 3`

- [ ] Apply the first four display modes in the live Three.js viewer.
- [ ] Ensure mode switching is rebuild-free when geometry has not changed.
- [ ] Preserve assigned material behavior for `Material` and lighting/environment behavior for `Rendered`.
- [ ] Keep `Wireframe` and `Solid` visually distinct from material editing truth.
- [ ] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [ ] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 4`

- [ ] Add the render-preview mode contract and HUD status shape without committing to one path-tracer backend too early.
- [ ] Define active, complete, canceled, unsupported, and stale render-preview statuses.
- [ ] Define how camera movement, geometry changes, material changes, and lighting/environment changes reset progress.
- [ ] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [ ] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

### `Model-Viewport-3 Phase 5`

- [ ] Integrate the first progressive render-preview backend behind the render-preview contract.
- [ ] Report sample/iteration progress to the HUD.
- [ ] Keep expensive render-preview runtime isolated from normal interactive viewport rendering.
- [ ] Add focused proof for entering render preview, progress readout, reset-on-change behavior, unsupported fallback, and leaving render preview cleanly.
- [ ] `HLG 2. The display modes include Solid, Wireframe, Material, Rendered, and a fifth high-quality render-preview mode.`
- [ ] `HLG 3. Render Preview shows iteration/sample progress in the viewport HUD while it is active.`
- [ ] `HLG 4. Display modes stay presentation-only and do not become geometry/build/export truth.`

## [ ] `Model-Viewport-3 / Phase 1` - `Display Mode Contract`

### Phase 1 Summary

Create one explicit display-mode contract for model-viewport presentation.

Current status:
- planned

### Phase 1 Implementation Spec

Must lock:
- one normalized display-mode enum or equivalent contract
- named modes for `Solid`, `Wireframe`, `Material`, `Rendered`, and reserved `Render Preview`
- persistence and normalization behavior if display mode is user preference state
- a clear split from `Auto / Draft / Final` result mode
- no viewer-only hidden ownership of user display-mode intent

Likely files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- focused store/settings tests

Definition of done:
- display-mode state exists in one explicit app/shared settings owner
- the default mode is deterministic
- legacy `wireframe` behavior has a migration or compatibility read if needed
- no runtime rendering behavior changes are required yet

## [ ] `Model-Viewport-3 / Phase 2` - `Shift+D Radial Menu`

### Phase 2 Summary

Add the quick viewport interaction for choosing display mode.

Current status:
- planned

### Phase 2 Implementation Spec

Must lock:
- `Shift+D` opens a radial display-mode menu for the active model viewport
- the menu offers `Solid`, `Wireframe`, `Material`, `Rendered`, and `Render Preview`
- selections update the display-mode contract from Phase 1
- keyboard routing respects editable fields and active tool owners
- the radial menu has a clear close/cancel behavior

Likely files:
- `src/app/inputRouting.ts`
- model-viewport host/overlay files by implementation time
- `src/app/theme/surfaces/viewport-overlay.css`
- focused interaction tests

Definition of done:
- the user can choose a display mode from the radial menu
- the menu does not steal unrelated input contexts
- the current display mode can be read back by the viewport UI
- render-preview selection may still be unsupported or placeholder-gated until later phases

## [ ] `Model-Viewport-3 / Phase 3` - `Fast Display Mode Viewer Application`

### Phase 3 Summary

Apply the first four presentation modes in the live Three.js viewer.

Current status:
- planned

### Phase 3 Implementation Spec

Must lock:
- `Solid` uses a consistent CAD/clay-style presentation
- `Wireframe` uses the viewer's line/wire presentation without changing geometry truth
- `Material` preserves assigned material reads
- `Rendered` uses the real-time lighting/environment/ground/shadow presentation
- switching modes does not trigger geometry rebuilds

Likely files:
- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- `src/app/ViewerHost.tsx` or its current equivalent by implementation time
- focused viewer tests

Definition of done:
- all first four modes visibly map to distinct viewer presentation behavior
- mode switching remains presentation-only
- material assignment and environment settings remain owned by their existing settings systems
- tests prove no build/result-policy state changes are required for mode switching

## [ ] `Model-Viewport-3 / Phase 4` - `Render Preview Status And HUD Contract`

### Phase 4 Summary

Create the render-preview status contract and HUD behavior before integrating an expensive progressive renderer.

Current status:
- planned

### Phase 4 Implementation Spec

Must lock:
- status names for render-preview lifecycle
- progress fields such as completed iterations/samples and target iterations/samples
- stale reset behavior for camera, geometry, material, and lighting changes
- HUD placement and compact wording while render preview is active
- honest unsupported-state behavior

Likely files:
- `src/app/viewerBridge.ts`
- model-viewport HUD/overlay files by implementation time
- `src/app/theme/surfaces/viewport-overlay.css`
- focused HUD/status tests

Definition of done:
- the app can represent render-preview progress without yet requiring the final backend
- HUD copy and state transitions are deterministic
- unsupported or unavailable render-preview runtime is visible and honest
- status stays viewport-local/presentation-only

## [ ] `Model-Viewport-3 / Phase 5` - `Progressive Render Preview Backend`

### Phase 5 Summary

Integrate the first real progressive render-preview backend behind the status contract.

Current status:
- planned

### Phase 5 Implementation Spec

Must lock:
- one backend choice after browser support, dependency cost, and scene-feature compatibility are reviewed
- progressive sample/iteration reporting
- reset-on-movement and reset-on-scene-change behavior
- cleanup when leaving render preview or disposing the viewer
- fallback behavior when the backend is unavailable

Likely files:
- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- viewer tests and possibly browser/visual smoke proof depending on backend

Definition of done:
- entering `Render Preview` starts progressive accumulation where supported
- HUD progress updates from real backend progress
- leaving the mode returns to normal interactive viewport rendering
- moving camera or changing displayed scene state resets progress honestly
- unsupported environments show an honest fallback instead of silently pretending to render
