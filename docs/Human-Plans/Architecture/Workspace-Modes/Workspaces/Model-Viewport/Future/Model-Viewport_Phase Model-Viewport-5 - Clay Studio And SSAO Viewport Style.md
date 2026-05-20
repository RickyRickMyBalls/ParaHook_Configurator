# `Model-Viewport-5` - `Clay Studio And SSAO Viewport Style`

## Doc Header

### Doc History
2. 2026-05-20 15:29:25: Prepped `Model-Viewport-5 / Phase 1 - Clay Studio And Post-Process Settings Contract` for implementation after reading the live `ViewSettings`, UI prefs store, and view-persistence seams, locking the first cut to an additive nested `postProcessing` settings owner for SSAO enablement, intensity, radius, and quality while leaving Clay Studio style identity, viewer runtime behavior, UI controls, and SSGI out of scope.
1. 2026-05-20 15:21:44: Created this future plan doc to reserve the Clay Studio and SSAO viewport-style lane after user review of the Pascal editor visual style, splitting the work into a Clay Studio preset, a real-time SSAO post-process path, overlay/fallback safety, UI controls, and a later SSGI feasibility branch.

### Purpose

Use this doc as the dedicated planning surface for a Pascal-inspired `Clay Studio` model viewport style and the first real-time SSAO post-process pass.

The goal here is:
- make the model viewport capable of a bright white clay architectural/CAD read
- use soft lighting, pale materials, ground contact, and hidden grid/axes as a deliberate style preset
- add SSAO so creases, overlaps, and contact areas remain readable in the normal interactive viewport
- keep the style presentation-only and downstream from authored geometry, materials, build policy, and export truth
- preserve existing `Solid`, `Material`, `Rendered`, `Render Preview`, topology overlays, selection highlights, and HUD behavior

### Scope

This phase family covers:
- a named Clay Studio visual preset or look contract
- real-time raster SSAO as the first post-process effect
- settings ownership for post-process enablement, intensity, radius, and quality
- viewer runtime composer/pass ownership
- fallback behavior when post-processing is unsupported or too expensive
- overlay, selection, topology, gizmo, sketch, and HUD compatibility
- UI exposure through the existing view/render/settings surfaces
- later SSGI feasibility after SSAO is stable

This phase family does not cover:
- replacing Three.js `WebGLRenderer` with WebGPU
- copying Pascal's full renderer architecture or React Three Fiber stack
- making path tracing the default interactive viewport renderer
- changing graph-authored geometry truth
- changing `Auto / Draft / Final` result policy
- changing material editing truth or per-part material assignment
- production render export, render queues, or image saving

## Doc Body

### Summary

`Model-Viewport-5` should add a new model-viewport look that feels like a clean white studio/clay architectural render while staying honest to ParaHook's current renderer and ownership model.

The important split is:
- `Clay Studio` is a presentation look.
- `SSAO` is a real-time post-process readability layer.
- graph/build/result truth remains unchanged.

The Pascal-inspired screenshot works because it combines:
- pale matte materials
- bright background
- soft shadows
- contact darkening in creases and intersections
- restrained dark floating UI
- sparse accent color
- a calm CAD/architectural camera read

ParaHook already has many of those ingredients:
- `ViewSettings.displayMode`
- material presets
- lighting presets
- ACES tone mapping
- HDRI/EXR environment support
- ground settings
- render-preview/path-tracer mode
- semantic edges and topology highlights
- viewport HUD and display radial menu

The missing interactive ingredient is ambient occlusion/post-processing. First-pass SSAO should give most of the visible depth benefit without forcing a WebGPU/SSGI migration.

### Current Code-Backed Read

Likely current seams:
- `src/shared/viewSettingsTypes.ts`
  - owns display mode, edge display mode, environment grade/source, lighting, ground, render preview, highlights, and material presets.
  - should own the user-facing Clay Studio/post-process settings contract if implementation adds persistent settings.
- `src/viewer/Viewer.ts`
  - owns `WebGLRenderer`, tone mapping, shadow map behavior, scene background/environment, lights, ground plane, render loop, render-preview runtime, materials, topology overlays, and selection/highlight overlays.
  - should own the runtime post-process composer and SSAO pass resources.
- `src/viewer/renderPreviewRuntime.ts`
  - already isolates the expensive progressive render-preview backend.
  - should stay separate from interactive SSAO; SSAO is not the path-traced preview mode.
- `src/app/useViewerDisplayModeMenu.ts`
  - owns display-mode menu behavior.
  - may need to expose Clay Studio as either a look preset action or a later mode-adjacent control, but should not blur result mode with style preset.
- `src/app/workspace/PropertiesRenderSection.tsx`
  - already exposes render-preview settings.
  - may host post-process settings if this lane treats SSAO as a render/view setting.
- `src/app/workspace/SettingsSurface.tsx`
  - already exposes viewport settings and highlight styling.
  - may host lower-level viewport style controls if Properties is not the right home.
- `src/app/theme/surfaces/viewport-overlay.css`
  - owns HUD/radial/overlay styling.
  - likely needs only small adjustments if Clay Studio gets a dark compact floating toolbar/HUD treatment.

### Ownership Rules

The app/store side should own user intent:
- selected visual look or preset
- whether SSAO is enabled
- SSAO intensity/radius/quality defaults if exposed
- persistence policy for the chosen viewport look

The viewer runtime should own implementation resources:
- render targets
- composer/effect pass instances
- depth/normal buffers
- resize handling
- fallback to direct render
- performance-mode switching
- disposal

The geometry/result layer should not change:
- mesh vertices and indices
- topology preview ids
- authoritative/draft/final result choice
- export readiness
- graph-owned output identity

### Clay Studio Direction

Clay Studio should be an interactive viewport look, not only a render-preview option.

Suggested first visual read:
- display mode: `rendered`
- material: pale matte clay, near white, low metalness, medium/high roughness
- background: `#f2f2f0` or similar warm white
- ground: enabled with a pale matte ground material
- grid: hidden by default
- axes: hidden by default
- shadows: enabled but soft
- tone mapping: ACES with modest exposure
- lights: bright soft key plus hemisphere/fill; no harsh colored mood
- edge display: off or visible-edges-only depending on the user's current preference
- selection/highlight colors: preserve existing white hover and blue selection hierarchy

Important rule:
- Clay Studio may apply a look preset, but it must not erase project material truth. If it overrides materials, it should do so as a presentation override similar to `Solid`, not by mutating material presets or per-part assignments.

### SSAO Direction

SSAO should be the first interactive post-process pass.

The first pass should prefer a small, proven WebGL-compatible path:
- `EffectComposer`
- normal render pass
- SSAO pass or equivalent Three.js example/postprocessing pass
- optional output pass
- fallback direct render if setup fails

Initial setting shape should be small:

```ts
type ViewPostProcessSettings = {
  ssaoEnabled: boolean
  ssaoIntensity: number
  ssaoRadius: number
  ssaoQuality: 'low' | 'medium' | 'high'
}
```

Exact naming can adjust during implementation, but the owner should stay under view/presentation settings.

### SSGI Boundary

SSGI is a later branch, not the first implementation target.

Reasons:
- Pascal's SSGI path is WebGPU/TSL-oriented.
- ParaHook currently runs a custom Three.js `WebGLRenderer` runtime.
- SSAO is enough to prove the render-composer seam and gives most of the visible clay-style depth benefit.
- SSGI has higher compatibility and performance risk.

The right future step is a feasibility phase after SSAO:
- compare WebGL-compatible SSGI options, WebGPU/TSL migration cost, and using path-traced render preview for stills
- decide whether SSGI belongs in normal `Rendered`, a new high-fidelity interactive mode, or only `Render Preview`

## Vision

The model viewport should be able to switch into a calm white studio read where geometry feels sculptural and readable, not noisy or washed out.

The user-facing promise:
- "I can make the viewport look like a clean clay architectural model, with soft depth in corners and contacts, while still editing normally."

The architectural promise:
- "This is presentation truth only. It improves readability without becoming a hidden geometry, material, or export owner."

## Wishlist Organization

### High Level Goals

- [ ] `Model-Viewport-5-HLG-1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [ ] `Model-Viewport-5-HLG-2. Add SSAO/contact-depth so the white clay style does not wash out corners, overlaps, and interior detail.`
- [ ] `Model-Viewport-5-HLG-3. Keep the style inside existing ParaHook viewport ownership instead of changing graph/build/export truth.`
- [ ] `Model-Viewport-5-HLG-4. Preserve existing overlays, topology hover/selection highlights, sketch tools, gizmos, HUD, and display modes.`
- [ ] `Model-Viewport-5-HLG-5. Make the feature robust with fallback behavior and user-visible controls.`
- [ ] `Model-Viewport-5-HLG-6. Treat SSGI as a later feasibility step after SSAO proves the post-process path.`

### Codex Level Goals

- [ ] CLG 1. Add a small view-settings contract for Clay Studio/post-process intent without creating a second material or geometry owner.
- [ ] CLG 2. Implement Clay Studio through viewer presentation overrides and existing environment/light/material seams.
- [ ] CLG 3. Add a runtime post-processing composer in `Viewer.ts` with direct-render fallback.
- [ ] CLG 4. Implement SSAO settings, resize handling, disposal, and focused viewer proof.
- [ ] CLG 5. Prove overlays and selection highlights render correctly with and without SSAO.
- [ ] CLG 6. Expose controls through the existing viewport/render settings surfaces.
- [ ] CLG 7. Defer SSGI until a compatibility/performance decision is grounded.

### `Model-Viewport-5 / Phase 1`

- [ ] Define the additive post-process settings contract for SSAO.
- [ ] Normalize defaults and persistence behavior through the existing view-settings owner.
- [ ] Keep Clay Studio style identity out of Phase 1 unless implementation proves a persistent look id is unavoidable.
- [ ] Keep material truth and presentation override truth separate.
- [ ] `HLG 1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [ ] `HLG 3. Keep the style inside existing ParaHook viewport ownership instead of changing graph/build/export truth.`

### `Model-Viewport-5 / Phase 2`

- [ ] Apply Clay Studio as a viewer presentation preset using existing lights, environment grade, ground, grid, axes, and material override seams.
- [ ] Preserve current geometry result and material assignment truth.
- [ ] Add focused proof that applying the style does not rebuild geometry.
- [ ] `HLG 1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [ ] `HLG 3. Keep the style inside existing ParaHook viewport ownership instead of changing graph/build/export truth.`

### `Model-Viewport-5 / Phase 3`

- [ ] Add the post-process composer/runtime boundary.
- [ ] Keep the direct render loop as the fallback path.
- [ ] Handle resize and disposal without leaking render targets.
- [ ] Keep render-preview/path-tracer mode separate.
- [ ] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 4`

- [ ] Implement the first SSAO pass.
- [ ] Add intensity/radius/quality application.
- [ ] Prove white clay geometry gains contact-depth without changing material truth.
- [ ] `HLG 2. Add SSAO/contact-depth so the white clay style does not wash out corners, overlaps, and interior detail.`

### `Model-Viewport-5 / Phase 5`

- [ ] Prove overlay, topology, selection, sketch, gizmo, and HUD compatibility under SSAO.
- [ ] Ensure selected/hovered blue and white highlight overlays remain readable.
- [ ] Keep display-edge overlays subordinate to hover/selection highlights.
- [ ] `HLG 4. Preserve existing overlays, topology hover/selection highlights, sketch tools, gizmos, HUD, and display modes.`

### `Model-Viewport-5 / Phase 6`

- [ ] Add user-facing controls for Clay Studio and SSAO.
- [ ] Route controls through existing Properties/Settings/View Toolbar ownership.
- [ ] Keep control labels simple and deterministic.
- [ ] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 7`

- [ ] Add performance/fallback polish.
- [ ] Gate expensive SSAO quality for large scenes or unsupported devices.
- [ ] Add diagnostics/status only if the fallback needs user-facing honesty.
- [ ] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 8`

- [ ] Complete visual QA and closeout.
- [ ] Compare Clay Studio with and without SSAO across graph-authored extrudes, imported references, topology overlays, and multiple model viewports.
- [ ] Decide whether any style-specific UI chrome polish belongs in this family or a separate toolbar/HUD pass.
- [ ] `HLG 1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [ ] `HLG 2. Add SSAO/contact-depth so the white clay style does not wash out corners, overlaps, and interior detail.`
- [ ] `HLG 4. Preserve existing overlays, topology hover/selection highlights, sketch tools, gizmos, HUD, and display modes.`

### `Model-Viewport-5 / Phase 9`

- [ ] Run the SSGI feasibility branch.
- [ ] Compare WebGL SSAO-only, WebGL SSGI options, WebGPU/TSL migration cost, and render-preview/path-trace still-image alternatives.
- [ ] Create a new follow-on phase only if SSGI is worth pursuing.
- [ ] `HLG 6. Treat SSGI as a later feasibility step after SSAO proves the post-process path.`

## [ ] `Model-Viewport-5 / Phase 1` - `Clay Studio And Post-Process Settings Contract`

### Phase 1 Summary

#### Purpose

Add a small settings owner for Clay Studio and SSAO intent before changing viewer runtime behavior.

#### Owns

- a persistent presentation contract for the new style/look
- SSAO enablement and small quality controls
- normalization/defaults
- compatibility with existing view settings persistence

#### Does Not Own

- viewer composer/runtime implementation
- UI controls beyond testable contract hooks if needed
- changing material preset data
- changing graph/build/export truth
- adding SSGI

#### Current Live Read

- `ViewSettings` already owns display mode, edge display mode, environment grade/source, lighting, ground, highlights, render preview, and materials.
- `DEFAULT_VIEW_SETTINGS` already defines `displayMode: 'rendered'`, default material presets, environment presets, lighting presets, and highlight defaults.
- `normalizeViewSettings(...)` already centralizes legacy/default migration for view settings and is the correct first owner for validating any new post-process settings.
- `LegacyViewSettingsInput` already lets persisted older view snapshots omit newly-added fields, so Phase 1 can add a required `postProcessing` field to `ViewSettings` as long as normalization supplies defaults.
- `useUiPrefsStore.setView(...)` and `setViewKey(...)` already route view mutations through `normalizeViewSettings(...)`.
- `uiPrefsPersistence.ts` already serializes the normalized full view object, but its view-persistence policy explicitly copies individual view fields in `applyPersistedViewPolicy(...)` and `mergePersistedUiPrefsView(...)`.
- Phase 1 must update those policy copy points so post-processing persistence follows `viewSettingsPersistence`, not `environmentPersistence`.

#### First Pass Decisions

- Add a nested `postProcessing` owner under `ViewSettings`.
- Keep the first owner named for the mechanism, not the Pascal-inspired look:
  - recommended type: `ViewPostProcessSettings`
  - recommended field: `postProcessing`
- Phase 1 should add only SSAO state:
  - `ssaoEnabled`
  - `ssaoIntensity`
  - `ssaoRadius`
  - `ssaoQuality`
- Recommended quality union:
  - `'low' | 'medium' | 'high'`
- Recommended defaults:
  - `ssaoEnabled: false`
  - `ssaoIntensity: 1`
  - `ssaoRadius: 1`
  - `ssaoQuality: 'medium'`
- Recommended normalization bounds:
  - `ssaoIntensity`: `0` to `3`
  - `ssaoRadius`: `0.05` to `5`
  - invalid `ssaoQuality` falls back to `'medium'`
- Do not add persistent Clay Studio style identity in Phase 1.
- Clay Studio should remain an action/preset or Phase 2 viewer presentation decision until the implementation proves it needs a persistent look id.
- Do not add UI controls, viewer runtime behavior, composer logic, or SSGI fields in Phase 1.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Add an additive `postProcessing` settings owner in `src/shared/viewSettingsTypes.ts`.

Recommended contract:

```ts
export type ViewSsaoQuality = 'low' | 'medium' | 'high'

export type ViewPostProcessSettings = {
  ssaoEnabled: boolean
  ssaoIntensity: number
  ssaoRadius: number
  ssaoQuality: ViewSsaoQuality
}
```

Recommended constants/helpers:
- `VIEW_SSAO_QUALITY_OPTIONS`
- `DEFAULT_VIEW_POST_PROCESS_SETTINGS`
- `isViewSsaoQuality(...)`
- `normalizeViewPostProcessSettings(...)`

Recommended `ViewSettings` addition:

```ts
postProcessing: ViewPostProcessSettings
```

Implementation order:
1. Add the types, defaults, quality options, and normalization helper near the other view-presentation settings in `src/shared/viewSettingsTypes.ts`.
2. Add `postProcessing` to `ViewSettings`.
3. Add `postProcessing` to `DEFAULT_VIEW_SETTINGS`.
4. Add `postProcessing: normalizeViewPostProcessSettings(settings.postProcessing)` inside `normalizeViewSettings(...)`.
5. Update clone/equality helpers only if the implementation adds a helper path that needs them. Do not touch environment-look snapshots unless TypeScript reveals a required interaction.
6. Update `uiPrefsPersistence.ts` so `applyPersistedViewPolicy(...)` and `mergePersistedUiPrefsView(...)` copy `postProcessing` when `viewSettingsPersistence` is enabled.
7. Keep `environmentPersistence` out of this setting.
8. Add focused tests proving defaults, invalid persisted values, valid persisted values, and view-persistence policy behavior.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/shared/viewSettingsTypes.test.ts` if the existing test pattern supports shared view-settings normalization proof
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/uiPrefsStore.test.ts` if store-level view mutation coverage is the local pattern
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `src/app/store/workspaceLayoutPreferenceEditHistoryReadiness.test.ts` only if existing persistence-policy proof requires update fallout

#### No-Widening Rule

Do not change `Viewer.ts` runtime rendering in this phase except for unavoidable type compile fallout.

Do not add:
- post-process composer runtime
- SSAO pass imports
- Clay Studio visual runtime behavior
- UI controls
- SSGI fields
- WebGPU/TSL planning beyond the already-written later feasibility note

#### Implementation Risks

- adding a second material owner by accident
- making `Clay Studio` mutate material presets instead of applying a display override
- over-modeling settings before the runtime proves what it needs
- accidentally putting SSAO under environment persistence even though it is a general viewport presentation setting
- silently dropping `postProcessing` when old persisted view snapshots are loaded through the policy-copy path
- adding Clay Studio identity too early and forcing Phase 2 into the wrong UI shape

#### Checklist

- [ ] Add `ViewSsaoQuality`, `ViewPostProcessSettings`, options, defaults, and normalization helper.
- [ ] Add `postProcessing` to `ViewSettings` and `DEFAULT_VIEW_SETTINGS`.
- [ ] Normalize missing and invalid `postProcessing` input in `normalizeViewSettings(...)`.
- [ ] Carry `postProcessing` through `viewSettingsPersistence` policy copy paths.
- [ ] Prove `environmentPersistence` does not own post-processing.
- [ ] Add focused normalization and persistence tests.
- [ ] Keep viewer runtime output unchanged.

#### Verification Shape

- `npm.cmd test -- src/shared/viewSettingsTypes.test.ts` if the file exists or is added
- `npm.cmd test -- src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts` if touched
- any focused persistence-policy test file touched by implementation
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 1 is done when SSAO intent has a stable view-settings owner, old persisted views safely normalize to defaults, valid persisted SSAO settings survive the view-settings persistence policy, and no viewer runtime rendering behavior has changed yet.

## [ ] `Model-Viewport-5 / Phase 2` - `Clay Studio Viewer Presentation Preset`

### Phase 2 Summary

#### Purpose

Make the viewer apply a bright clay studio look using existing presentation seams.

#### Owns

- Clay Studio material override behavior
- pale background/ground defaults
- soft neutral lighting defaults
- grid/axis suppression if the preset applies as an action
- rebuild-free application

#### Does Not Own

- SSAO composer/pass work
- SSGI
- permanent edits to material presets or per-part assignments
- render-preview/path-tracer behavior

#### Current Live Read

- `Viewer.ts` already has `displayModeSolidMaterial`.
- `Material` mode and `Rendered` mode already have separate material/light behavior.
- `applyViewSettings(...)` already applies environment grade, source, lights, ground, shadow flags, material settings, and display mode behavior.

#### First Pass Decisions

- Treat Clay Studio as a presentation preset or look, not a new geometry result mode.
- Reuse the existing `rendered` mode where possible, but use a pale material override similar to `solid` if project materials would fight the clay read.
- Preserve topology highlights and edge visibility settings.

### Phase 2 Implementation Spec

#### Exact First Code Cut

Implement the Clay Studio look in `Viewer.ts` using existing material, light, ground, and environment application helpers.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- possibly `src/shared/viewSettingsTypes.ts` if Phase 1 leaves a small type adjustment

#### No-Widening Rule

Do not add a composer, SSAO, or post-processing in this phase.

#### Implementation Risks

- hiding assigned materials in a way that surprises users
- making Solid/Material/Rendered semantics confusing
- washing out selected/hover highlights

#### Checklist

- [ ] Add Clay Studio presentation resolution.
- [ ] Apply pale clay material without mutating material truth.
- [ ] Apply/derive bright neutral background and lighting.
- [ ] Preserve display edge and topology highlight behavior.
- [ ] Prove geometry meshes are not rebuilt.

#### Verification Shape

- focused viewer tests for material override, lighting, and rebuild-free switching
- manual browser screenshot sanity after implementation
- production build

#### Done Shape

Phase 2 is done when Clay Studio can be applied as a normal interactive viewport look without SSAO.

## [ ] `Model-Viewport-5 / Phase 3` - `Post-Process Composer Boundary`

### Phase 3 Summary

#### Purpose

Introduce the runtime post-processing boundary before enabling SSAO.

#### Owns

- composer/render-pass lifecycle
- direct-render fallback
- resize handling
- disposal
- render loop integration

#### Does Not Own

- SSAO visual tuning
- UI controls
- SSGI
- path-traced render preview

#### Current Live Read

- `Viewer.renderLoop` currently renders the scene directly unless `renderPreviewSampleFrame()` handles the frame.
- `renderPreviewRuntime` is already isolated and should remain separate.
- The viewer already resets render preview on camera/view changes.

#### First Pass Decisions

- Keep direct render as the default and fallback.
- Only route through composer when a post-process setting requires it.
- Keep render-preview mode out of the composer path unless implementation proves a specific need.

### Phase 3 Implementation Spec

#### Exact First Code Cut

Add a small post-process runtime helper inside or beside `Viewer.ts` that can render the normal scene through a composer with no SSAO effect yet, then fallback to direct rendering when disabled or unavailable.

#### Likely Files

- `src/viewer/Viewer.ts`
- possibly `src/viewer/postProcessingRuntime.ts`
- `src/viewer/Viewer.test.ts`

#### No-Widening Rule

Do not tune SSAO or add UI in this phase.

#### Implementation Risks

- double-rendering overlays or HUD-adjacent canvas elements
- breaking render-preview mode
- leaking render targets on resize/dispose

#### Checklist

- [ ] Add composer runtime ownership.
- [ ] Add direct-render fallback.
- [ ] Handle resize.
- [ ] Handle dispose.
- [ ] Keep render-preview behavior unchanged.

#### Verification Shape

- focused viewer tests for fallback/direct-render selection
- focused resize/dispose proof if testable
- production build

#### Done Shape

Phase 3 is done when the viewer can render through a safe composer boundary without changing the visual output materially.

## [ ] `Model-Viewport-5 / Phase 4` - `Interactive SSAO Pass`

### Phase 4 Summary

#### Purpose

Add the first real-time SSAO pass so the Clay Studio look gains contact depth and interior readability.

#### Owns

- SSAO pass creation
- settings mapping
- enabled/disabled behavior
- basic visual tuning
- fallback when pass creation fails

#### Does Not Own

- SSGI
- final visual QA across every workspace
- UI polish beyond required settings plumbing

#### Current Live Read

- Three.js examples include post-processing utilities that can be used from the current WebGL renderer path.
- The viewer already imports Three.js example modules dynamically in some places for HDRI/EXR loaders.

#### First Pass Decisions

- Prefer a WebGL-compatible SSAO pass first.
- Keep settings small and bounded.
- Tune for white clay readability rather than dramatic game-style AO.

### Phase 4 Implementation Spec

#### Exact First Code Cut

Wire SSAO into the Phase 3 composer and map normalized settings into the pass.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/postProcessingRuntime.ts` if created
- `src/shared/viewSettingsTypes.ts`
- `src/viewer/Viewer.test.ts`

#### No-Widening Rule

Do not add SSGI or WebGPU migration work.

#### Implementation Risks

- noisy or dirty-looking AO on pale surfaces
- performance drops on larger scenes
- AO affecting overlays if compositing order is wrong

#### Checklist

- [ ] Add SSAO pass.
- [ ] Map intensity/radius/quality.
- [ ] Keep disabled path direct or visually equivalent.
- [ ] Prove settings update without rebuilding geometry.
- [ ] Prove fallback if pass setup is unavailable.

#### Verification Shape

- focused viewer tests for runtime branch/settings application
- browser screenshot sanity for Clay Studio with SSAO
- production build

#### Done Shape

Phase 4 is done when Clay Studio can use SSAO interactively and still fallback honestly.

## [ ] `Model-Viewport-5 / Phase 5` - `Overlay And Selection Compatibility`

### Phase 5 Summary

#### Purpose

Prove the post-process path does not damage the CAD interaction layers that make the viewport usable.

#### Owns

- topology hover and selection overlay compatibility
- display edge overlay compatibility
- sketch overlay compatibility
- transform/gizmo helper compatibility
- HUD/radial overlay compatibility

#### Does Not Own

- new highlight styling features
- topology generation
- direct modeling

#### Current Live Read

- `Model-Viewport-4` already shipped semantic topology overlays, hover, selection, body promotion, and edge display controls.
- Sketch and transform helpers draw their own viewport overlays and hit targets.

#### First Pass Decisions

- AO should affect scene geometry, not make UI/interaction overlays muddy.
- Selection/hover highlights should remain above normal display edges and AO.

### Phase 5 Implementation Spec

#### Exact First Code Cut

Audit and adjust post-process ordering so overlays remain readable under SSAO, adding focused tests where current viewer seams allow it.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- possibly `src/viewer/overlay/AxisGizmo.ts`
- possibly `src/viewer/sketch/*`

#### No-Widening Rule

Do not retune the whole highlight system unless SSAO exposes a concrete contrast problem.

#### Implementation Risks

- selected face/edge/point overlays becoming too dark
- gizmo lines getting post-processed as scene geometry
- hidden/back display edges changing unexpectedly

#### Checklist

- [ ] Prove selected topology overlays remain readable.
- [ ] Prove hover overlays remain readable.
- [ ] Prove edge display modes behave under SSAO.
- [ ] Prove sketch plane/draw overlays are not obscured.
- [ ] Prove gizmo/helper lines remain readable.

#### Verification Shape

- focused viewer tests
- manual screenshot sanity across `Solid`, `Material`, `Rendered`, Clay Studio, and visible-edges-only
- production build

#### Done Shape

Phase 5 is done when SSAO is proven compatible with the current interactive viewport overlays.

## [ ] `Model-Viewport-5 / Phase 6` - `Clay Studio And SSAO Controls`

### Phase 6 Summary

#### Purpose

Expose the new style and SSAO behavior through the existing UI ownership surfaces.

#### Owns

- user-facing Clay Studio action/control
- user-facing SSAO controls
- simple labels and settings wiring
- persistence through existing view settings

#### Does Not Own

- new toolbar architecture
- new workspace surface
- new material editor semantics

#### Current Live Read

- `Shift+D` display radial menu owns display mode selection.
- Properties has a global `Render` section.
- Settings has viewport controls and highlight controls.
- View Toolbar owns explicit view controls.

#### First Pass Decisions

- Put controls where they match existing ownership.
- Avoid inventing a separate floating panel for this.
- Keep names clear: `Clay Studio`, `SSAO`, `Intensity`, `Radius`, `Quality`.

### Phase 6 Implementation Spec

#### Exact First Code Cut

Add UI controls that write through the Phase 1 settings owner and trigger the Phase 2/4 viewer behavior.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/useViewerDisplayModeMenu.ts`
- `src/app/theme/surfaces/viewport-overlay.css`
- relevant focused tests

#### No-Widening Rule

Do not create a new workspace surface or modal just for SSAO controls.

#### Implementation Risks

- controls spread across too many surfaces
- confusing Clay Studio with `Solid` or `Render Preview`
- making SSAO seem like export/render queue truth

#### Checklist

- [ ] Add a clear Clay Studio activation path.
- [ ] Add SSAO enable/intensity/radius/quality controls.
- [ ] Persist settings.
- [ ] Keep controls disabled or honest when post-processing is unavailable.
- [ ] Add focused UI tests.

#### Verification Shape

- focused Properties/Settings/menu tests
- focused store tests
- browser sanity
- production build

#### Done Shape

Phase 6 is done when users can turn Clay Studio and SSAO on/off and tune the first SSAO read without hidden state.

## [ ] `Model-Viewport-5 / Phase 7` - `Performance And Fallback Polish`

### Phase 7 Summary

#### Purpose

Make the SSAO feature robust enough for normal modeling sessions.

#### Owns

- quality presets/fallbacks
- unsupported-device honesty
- large-scene behavior
- runtime diagnostics if needed

#### Does Not Own

- SSGI
- path-traced still export
- WebGPU migration

#### Current Live Read

- Render Preview already has unsupported/stale/status behavior.
- Viewer runtime stats already collect FPS/geometry counts.
- UI prefs already carry presentation settings.

#### First Pass Decisions

- Prefer quiet fallback over noisy warnings unless the user needs to know why SSAO is unavailable.
- Use quality settings to trade radius/sample cost against performance.

### Phase 7 Implementation Spec

#### Exact First Code Cut

Add targeted fallback/performance handling around the SSAO runtime and surface only useful status.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/renderPreviewStatusStore.ts` only if a sibling status pattern is useful
- focused tests

#### No-Widening Rule

Do not add a general performance settings framework.

#### Implementation Risks

- status churn distracting the user
- fallback disabling SSAO without a clear path to re-enable
- too many quality knobs

#### Checklist

- [ ] Add safe fallback behavior for setup/render errors.
- [ ] Add quality-based runtime settings.
- [ ] Decide whether status readout is needed.
- [ ] Keep large-scene behavior tolerable.

#### Verification Shape

- focused runtime fallback tests
- manual large-ish scene sanity
- production build

#### Done Shape

Phase 7 is done when SSAO behaves like a dependable viewport feature instead of a fragile demo effect.

## [ ] `Model-Viewport-5 / Phase 8` - `Visual QA And Closeout`

### Phase 8 Summary

#### Purpose

Close the Clay Studio + SSAO lane with visual acceptance and handoff cleanup.

#### Owns

- screenshot/manual acceptance
- final default tuning
- docs/index status updates
- follow-on notes

#### Does Not Own

- SSGI implementation
- broad UI redesign
- export/render queue work

#### Current Live Read

- The intended style is inspired by Pascal's white architectural scene, but ParaHook should stay faithful to its own CAD workspace and current viewer ownership.

#### First Pass Decisions

- Tune for readable CAD work, not purely pretty still images.
- Make Clay Studio useful while orbiting/editing, not only after waiting for render preview.

### Phase 8 Implementation Spec

#### Exact First Code Cut

Run the implemented feature through visual and focused regression passes, then tighten defaults and docs.

#### Likely Files

- viewer/settings files touched by earlier phases
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not add new feature behavior during closeout unless it fixes an acceptance blocker.

#### Implementation Risks

- over-tuning for one scene
- making Clay Studio default too early
- masking selection or topology detail

#### Checklist

- [ ] Verify graph-authored extrudes.
- [ ] Verify imported references.
- [ ] Verify topology hover/selection.
- [ ] Verify multiple model viewports if post-process settings are viewport-local.
- [ ] Verify normal modes still work.
- [ ] Record shipped status and follow-ons.

#### Verification Shape

- focused automated tests from prior phases
- production build
- browser screenshots/manual acceptance
- `git diff --check`

#### Done Shape

Phase 8 is done when Clay Studio + SSAO is accepted as an interactive viewport style and the plan records remaining follow-ons honestly.

## [ ] `Model-Viewport-5 / Phase 9` - `SSGI Feasibility Branch`

### Phase 9 Summary

#### Purpose

Decide whether SSGI should become a later ParaHook viewport feature after SSAO proves the post-process foundation.

#### Owns

- technical feasibility read
- compatibility/performance tradeoff
- follow-on planning recommendation

#### Does Not Own

- implementing SSGI directly
- migrating the renderer to WebGPU
- copying Pascal's WebGPU/TSL pipeline

#### Current Live Read

- Pascal's public source uses a WebGPU/TSL SSGI pipeline.
- ParaHook currently uses a custom Three.js `WebGLRenderer` path plus `three-gpu-pathtracer` for progressive render preview.
- SSAO should answer most of the immediate Clay Studio readability need.

#### First Pass Decisions

- Treat SSGI as a product/architecture decision after SSAO.
- If SSGI is pursued, create a new follow-on doc or phase with explicit fallback and browser support rules.

### Phase 9 Implementation Spec

#### Exact First Code Cut

Perform a read-only feasibility pass over available Three.js/WebGL/WebGPU SSGI options, ParaHook renderer constraints, and the shipped SSAO behavior.

#### Likely Files

- this doc
- maybe a new follow-on future doc if the recommendation is yes
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement SSGI in this phase.

#### Implementation Risks

- deciding based on visual desire without browser/GPU support proof
- conflating SSGI with the existing path-traced render-preview mode
- creating a permanent renderer fork

#### Checklist

- [ ] Compare WebGL SSAO-only versus SSGI options.
- [ ] Compare WebGPU/TSL migration cost.
- [ ] Compare using Render Preview for high-quality stills instead.
- [ ] Decide whether to create a dedicated SSGI follow-on.

#### Verification Shape

- read-only technical report in this doc or a follow-on doc
- no production build required unless docs tooling is touched

#### Done Shape

Phase 9 is done when the repo has a clear yes/no/later recommendation for SSGI and no hidden implementation commitment.
