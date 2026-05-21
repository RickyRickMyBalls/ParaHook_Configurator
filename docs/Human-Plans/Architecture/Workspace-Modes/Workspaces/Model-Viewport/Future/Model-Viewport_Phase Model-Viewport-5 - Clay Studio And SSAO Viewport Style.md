# `Model-Viewport-5` - `Clay Studio And SSAO Viewport Style`

## Doc Header

### Doc History
25. 2026-05-20 19:35:44: Implemented and shipped `Model-Viewport-5 / Phase 6.4 - Clay Studio Ground Contact` by adding a Clay Studio-only presentation contact-shadow group under visible base meshes, projected onto the viewer ground plane with subtle stacked translucent ellipses, while keeping non-Clay shadows, render preview, graph geometry, material truth, and export truth unchanged.
24. 2026-05-20 19:29:05: Added `Model-Viewport-5 / Phase 6.4 - Clay Studio Ground Contact` after screenshot review suggested Ambient Occlusion is not giving enough visible contact depth on the presentation ground plane, reserving the next slice for object-to-ground height verification, ground-plane SSAO/depth participation proof, and a Clay Studio-only soft contact-shadow or ultra-soft ground-shadow treatment without reopening the full lighting pass.
23. 2026-05-20 18:07:56: Implemented and shipped `Model-Viewport-5 / Phase 6.3 - Clay Studio Lighting And AO Tuning` by softening the Clay Studio material/ground grade, disabling Clay Studio hard shadow-map participation, reducing the key light, increasing fill and ambient contribution, broadening the `Low` / `Medium` / `High` Ambient Occlusion presets, and de-emphasizing Clay Studio display-edge overlays while preserving non-Clay rendered behavior and render-preview separation.
22. 2026-05-20 17:54:47: Prepped `Model-Viewport-5 / Phase 6.3 - Clay Studio Lighting And AO Tuning` for implementation after screenshot review showed the shipped Ambient Occlusion is visible but still too subtle, while the Clay Studio directional/key-light shadow is too harsh versus the Pascal reference, locking the next code slice to softer Clay Studio lighting, broader lower-contrast AO presets, and optional Clay Studio edge de-emphasis without adding advanced UI sliders yet.
21. 2026-05-20 17:43:27: Fixed the `Model-Viewport-5 / Phase 6.2` Ambient Occlusion black-screen regression by adding Three.js `OutputPass` after `SSAOPass` in the interactive post-processing composer chain, so SSAO blends onto the offscreen beauty buffer before the final output copy reaches the screen.
20. 2026-05-20 17:35:27: Implemented and shipped `Model-Viewport-5 / Phase 6.2 - Basic Clay Studio And Ambient Occlusion Controls` by adding shared Ambient Occlusion preset/read helpers for `ViewSettings.postProcessing`, wiring a Properties `Render` `Ambient Occlusion` `Off` / `Low` / `Medium` / `High` select beside `Viewport Style`, preserving render-preview settings, and adding focused Properties plus store/helper proof.
19. 2026-05-20 17:31:13: Prepped `Model-Viewport-5 / Phase 6.2 - Basic Clay Studio And Ambient Occlusion Controls` for implementation after reading the shipped Properties `Viewport Style` group, normalized `ViewSettings.postProcessing` contract, SSAO runtime mappings, and Properties test seam, locking the next code slice to a compact `Ambient Occlusion` `Off` / `Low` / `Medium` / `High` select in Properties `Render`, a small shared preset/read helper, store writes through `setViewKey('postProcessing', ...)`, and focused Properties plus store proof without advanced numeric sliders.
18. 2026-05-20 17:29:02: Implemented and shipped `Model-Viewport-5 / Phase 6.1 - Properties Render Post-Process Placement` by adding a compact `Viewport presentation` group to Properties `Render`, wiring a `Viewport Style` `Standard` / `Clay Studio` select through `ViewSettings.viewportStyle`, preserving existing render-preview quality controls, and adding focused Properties proof while leaving Ambient Occlusion presets and advanced SSAO tuning deferred.
17. 2026-05-20 17:23:21: Prepped `Model-Viewport-5 / Phase 6.1 - Properties Render Post-Process Placement` for implementation after reading the live `PropertiesRenderSection.tsx` and `PropertiesSurface.test.tsx` seams, locking the next code slice to adding one compact interactive viewport presentation group in the existing Properties `Render` section, wiring a `Viewport Style` `Standard` / `Clay Studio` control through `ViewSettings.viewportStyle`, preserving existing render-preview quality controls, and leaving Ambient Occlusion presets plus advanced SSAO tuning to Phase 6.2/6.3.
16. 2026-05-20 17:21:33: Implemented and shipped `Model-Viewport-5 / Phase 6 - Properties Render Controls Umbrella` as the doc/ownership closeout, locking Properties `Render` as the Clay Studio/SSAO tuning and readback home, preserving `Shift+D` as the quick style switch, confirming `Viewport Style` and `Ambient Occlusion` as the simple user-facing labels, and keeping actual control implementation split into Phase 6.1, Phase 6.2, and Phase 6.3.
15. 2026-05-20 17:18:52: Prepped `Model-Viewport-5 / Phase 6 - Properties Render Controls Umbrella` for implementation after reading the live `PropertiesRenderSection.tsx` render-preview controls, Properties section routing, shipped `Shift+D` Clay Studio entry, and shipped SSAO runtime, locking Phase 6 to a doc/ownership pass that keeps Properties `Render` as the tuning/readback home, keeps `Shift+D` as the quick style switch, reserves `Viewport Style` and `Ambient Occlusion` as the simple labels, and defers actual controls to Phase 6.1/6.2 plus advanced tuning to Phase 6.3.
14. 2026-05-20 17:15:18: Implemented and shipped `Model-Viewport-5 / Phase 5 - Overlay And Selection Compatibility` by adding focused viewer proof that SSAO preserves topology selection/hover overlay contracts, display-edge `off` / `on` / `visibleOnly` behavior, sketch/extrude overlay material contracts, render-preview separation, and axis HUD rendering outside the composer path without needing private SSAO pass surgery or highlight retuning.
13. 2026-05-20 17:02:33: Prepped `Model-Viewport-5 / Phase 5 - Overlay And Selection Compatibility` for implementation after reading the shipped SSAO runtime plus live overlay seams, locking the next code slice to proving and, only where needed, protecting topology selection/hover overlays, display-edge overlays, sketch overlays, extrude previews, transform helpers, axis HUD, and radial/HUD DOM overlays from SSAO muddiness while avoiding broad highlight retuning or new controls.
12. 2026-05-20 16:47:11: Implemented and shipped `Model-Viewport-5 / Phase 4 - Interactive SSAO Pass` by adding Three.js `SSAOPass` ownership inside `postProcessingRuntime`, mapping normalized SSAO quality/radius/intensity settings into kernel/distance pass settings, passing post-process settings through `Viewer`, updating live settings without geometry rebuilds, recreating the runtime for kernel-size changes, and preserving direct fallback plus render-preview separation with focused proof and production build verification.
11. 2026-05-20 16:41:17: Prepped `Model-Viewport-5 / Phase 4 - Interactive SSAO Pass` for implementation after reading the shipped Phase 3 composer helper and the installed Three.js `SSAOPass` API, locking the next code slice to adding `SSAOPass` inside `postProcessingRuntime`, mapping normalized `ViewSettings.postProcessing` values into kernel/radius/distance settings, preserving direct fallback/render-preview separation, and proving settings updates without geometry rebuilds.
10. 2026-05-20 16:38:33: Implemented and shipped `Model-Viewport-5 / Phase 3 - Post-Process Composer Boundary` by adding a small `postProcessingRuntime` helper around `EffectComposer`/`RenderPass`, routing enabled post-processing through a viewer-owned render branch with direct-render fallback, resizing and disposing the helper through the existing viewer lifecycle, keeping render preview ahead of the post-process path, and adding focused viewer proof.
9. 2026-05-20 16:23:50: Prepped `Model-Viewport-5 / Phase 3 - Post-Process Composer Boundary` for implementation after re-reading the live `Viewer.ts` render loop, resize, dispose, and render-preview seams, locking the next code slice to a small composer runtime helper, direct-render fallback, resize/dispose ownership, and focused viewer proof while leaving SSAO pass creation, visual tuning, Properties controls, SSGI, and render-preview/path-tracer changes out of scope.
8. 2026-05-20 16:15:53: Added the required Properties workspace `Render` planning slices for Clay Studio and SSAO controls after user review asked whether post-processing belongs under Properties, splitting the prior broad controls phase into a placement/contract phase, a basic Clay Studio and Ambient Occlusion control phase, and a later advanced tuning/status phase while keeping the `Shift+D` wheel as the fast style switch.
7. 2026-05-20 16:05:05: Implemented and shipped `Model-Viewport-5 / Phase 2.1 - Shift+D Clay Studio Wheel Entry` by adding the Clay Studio style action to the existing display-mode menu hook and `ViewerHost` radial wheel, routing selection through `ViewSettings.viewportStyle`, resetting normal display-mode selections to `standard`, preserving edge-display controls, and adding focused hook plus `ViewerHost` interaction proof.
6. 2026-05-20 16:01:13: Added `Model-Viewport-5 / Phase 2.1 - Shift+D Clay Studio Wheel Entry` as a narrow controls follow-up after user review caught that Phase 2 shipped the Clay Studio runtime style without adding it to the `Shift+D` display wheel, keeping the new slice focused on routing the existing `ViewSettings.viewportStyle` owner through the radial wheel while leaving SSAO controls, composer work, visual tuning, and render-preview behavior out of scope.
5. 2026-05-20 15:50:43: Implemented and shipped `Model-Viewport-5 / Phase 2 - Clay Studio Viewer Presentation Preset` by adding the normalized `ViewSettings.viewportStyle` switch and a rendered-mode-only Clay Studio viewer presentation override with pale clay material, bright background/grade, ground, soft lights, runtime grid/axis suppression, render-preview exclusion, and focused store/viewer proof that geometry and material truth are not mutated.
4. 2026-05-20 15:41:12: Prepped `Model-Viewport-5 / Phase 2 - Clay Studio Viewer Presentation Preset` for implementation after re-reading the live `Viewer.ts` display-mode, material-cache, environment, ground, grid/axes, and display-mode test seams, locking the next slice to a minimal `ViewSettings.viewportStyle` style switch plus rendered-mode-only Clay Studio presentation overrides while leaving SSAO, composer setup, UI controls, material-truth mutation, and render-preview/path-tracer behavior out of scope.
3. 2026-05-20 15:36:45: Implemented and shipped `Model-Viewport-5 / Phase 1 - Clay Studio And Post-Process Settings Contract` by adding the additive `ViewSettings.postProcessing` SSAO contract, defaults, quality validation, normalization, view-persistence policy handling, viewer clone preservation, and focused store/persistence tests while leaving viewer runtime rendering, Clay Studio style identity, UI controls, and SSGI untouched.
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
  - should host the Clay Studio and SSAO tuning controls because they are render/view presentation settings, not object/material/editor truth.
- `src/app/workspace/SettingsSurface.tsx`
  - already exposes viewport settings and highlight styling.
  - may still host lower-level viewport defaults later, but the first user-facing post-process controls should live under Properties `Render`.
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

- [x] CLG 1. Add a small view-settings contract for Clay Studio/post-process intent without creating a second material or geometry owner.
- [x] CLG 2. Implement Clay Studio through viewer presentation overrides and existing environment/light/material seams.
- [x] CLG 3. Add a runtime post-processing composer in `Viewer.ts` with direct-render fallback.
- [x] CLG 4. Implement SSAO settings, resize handling, disposal, and focused viewer proof.
- [x] CLG 5. Prove overlays and selection highlights render correctly with and without SSAO.
- [ ] CLG 6. Expose controls through the existing viewport/render settings surfaces.
- [ ] CLG 7. Defer SSGI until a compatibility/performance decision is grounded.

### `Model-Viewport-5 / Phase 1`

- [x] Define the additive post-process settings contract for SSAO.
- [x] Normalize defaults and persistence behavior through the existing view-settings owner.
- [x] Keep Clay Studio style identity out of Phase 1 unless implementation proves a persistent look id is unavoidable.
- [x] Keep material truth and presentation override truth separate.
- [x] `HLG 1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [x] `HLG 3. Keep the style inside existing ParaHook viewport ownership instead of changing graph/build/export truth.`

### `Model-Viewport-5 / Phase 2`

- [x] Apply Clay Studio as a viewer presentation preset using existing lights, environment grade, ground, grid, axes, and material override seams.
- [x] Preserve current geometry result and material assignment truth.
- [x] Add focused proof that applying the style does not rebuild geometry.
- [x] `HLG 1. Create a new Pascal-inspired Clay Studio visual style for the model viewport.`
- [x] `HLG 3. Keep the style inside existing ParaHook viewport ownership instead of changing graph/build/export truth.`

### `Model-Viewport-5 / Phase 2.1`

- [x] Add a `Clay Studio` entry to the existing `Shift+D` display wheel.
- [x] Route the entry through the shipped `ViewSettings.viewportStyle` owner.
- [x] Preserve the existing Solid, Wireframe, Material, Rendered, Render Preview, and edge-display wheel behavior.
- [x] Keep SSAO controls deferred to the later controls phase.
- [x] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 3`

- [x] Add the post-process composer/runtime boundary.
- [x] Keep the direct render loop as the fallback path.
- [x] Handle resize and disposal without leaking render targets.
- [x] Keep render-preview/path-tracer mode separate.
- [x] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 4`

- [x] Implement the first SSAO pass.
- [x] Add intensity/radius/quality application.
- [x] Prove white clay geometry gains contact-depth without changing material truth.
- [x] `HLG 2. Add SSAO/contact-depth so the white clay style does not wash out corners, overlaps, and interior detail.`

### `Model-Viewport-5 / Phase 5`

- [x] Prove overlay, topology, selection, sketch, gizmo, and HUD compatibility under SSAO.
- [x] Ensure selected/hovered blue and white highlight overlays remain readable.
- [x] Keep display-edge overlays subordinate to hover/selection highlights.
- [x] `HLG 4. Preserve existing overlays, topology hover/selection highlights, sketch tools, gizmos, HUD, and display modes.`

### `Model-Viewport-5 / Phase 6`

- [x] Establish Properties `Render` as the primary home for Clay Studio and SSAO controls.
- [x] Keep `Shift+D` as the quick style switch, not the tuning surface.
- [x] Keep Settings as a later defaults/advanced home only if needed.
- [x] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 6.1`

- [x] Add a Properties `Render` control group for viewport style and post-processing.
- [x] Use the existing `ViewSettings.viewportStyle` and `ViewSettings.postProcessing` owners.
- [x] Avoid exposing advanced SSAO sliders before the runtime look is accepted.
- [x] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 6.2`

- [x] Add the first simple Properties controls: `Viewport Style` and `Ambient Occlusion`.
- [x] Support `Standard` / `Clay Studio` and `Off` / `Low` / `Medium` / `High`.
- [x] Write through normalized view settings and preserve persistence.
- [x] `HLG 5. Make the feature robust with fallback behavior and user-visible controls.`

### `Model-Viewport-5 / Phase 6.3`

- [x] Tune Clay Studio lighting so hard directional/key-light shadows do not dominate the white-clay read.
- [x] Tune Ambient Occlusion presets toward broader, softer contact depth rather than tight black cuts.
- [x] Reduce Clay Studio edge-line dominance only where it helps match the Pascal-style reference.
- [x] `HLG 1. Make the model viewport capable of a bright white clay architectural/CAD read.`
- [x] `HLG 2. Use soft lighting, pale materials, ground contact, and hidden grid/axes as a deliberate style preset.`
- [x] `HLG 3. Add SSAO so creases, overlaps, and contact areas remain readable in the normal interactive viewport.`

### `Model-Viewport-5 / Phase 6.4`

- [x] Verify why the presentation ground plane is not getting convincing Clay Studio contact depth.
- [x] Add a Clay Studio-only soft ground-contact treatment if SSAO alone cannot produce readable floor contact.
- [x] Preserve the authored geometry/material/export truth and keep the ground treatment presentation-only.
- [x] `HLG 1. Make the model viewport capable of a bright white clay architectural/CAD read.`
- [x] `HLG 2. Use soft lighting, pale materials, ground contact, and hidden grid/axes as a deliberate style preset.`
- [x] `HLG 3. Add SSAO so creases, overlaps, and contact areas remain readable in the normal interactive viewport.`

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

## [x] `Model-Viewport-5 / Phase 1` - `Clay Studio And Post-Process Settings Contract`

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

- [x] Add `ViewSsaoQuality`, `ViewPostProcessSettings`, options, defaults, and normalization helper.
- [x] Add `postProcessing` to `ViewSettings` and `DEFAULT_VIEW_SETTINGS`.
- [x] Normalize missing and invalid `postProcessing` input in `normalizeViewSettings(...)`.
- [x] Carry `postProcessing` through `viewSettingsPersistence` policy copy paths.
- [x] Prove `environmentPersistence` does not own post-processing.
- [x] Add focused normalization and persistence tests.
- [x] Keep viewer runtime output unchanged.

#### Verification Shape

- `npm.cmd test -- src/shared/viewSettingsTypes.test.ts` if the file exists or is added
- `npm.cmd test -- src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts` if touched
- any focused persistence-policy test file touched by implementation
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 1 is done when SSAO intent has a stable view-settings owner, old persisted views safely normalize to defaults, valid persisted SSAO settings survive the view-settings persistence policy, and no viewer runtime rendering behavior has changed yet.

#### Implementation Result

Shipped on 2026-05-20 15:36:45.

- `ViewSettings` now has a nested `postProcessing` owner with SSAO enablement, intensity, radius, and quality.
- `normalizeViewSettings(...)` now supplies default post-processing values for old persisted views and clamps invalid SSAO values.
- UI prefs view-persistence policy copy paths now carry `postProcessing` only when `viewSettingsPersistence` is enabled.
- `Viewer.ts` clones the new settings field but does not apply SSAO or change runtime rendering yet.
- Focused store and persistence tests prove normalization, generic view-setting updates, and environment-persistence separation.
- Verification passed with `npm.cmd test -- src/app/store/uiPrefsStore.test.ts`, `npm.cmd test -- src/app/store/scenePresentationEditHistoryReadiness.test.ts`, `npm.cmd run build`, and `git diff --check`.

## [x] `Model-Viewport-5 / Phase 2` - `Clay Studio Viewer Presentation Preset`

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
- Phase 1 added `ViewSettings.postProcessing`, but it intentionally did not add a Clay Studio style identity.
- A runtime Clay Studio look now needs one stable view-settings switch so tests and later UI controls can request the look without mutating materials, environment presets, or graph/build truth.
- `Viewer.ts` already routes every settings update through `applyViewSettings(...)`, clones `currentViewSettings`, and calls `applyEnvironmentSource(...)`, `applyGroundSettings(...)`, `applyDisplayModeLights(...)`, `applyMaterialSettings(...)`, `applyReferenceDisplayModeToScene(...)`, and highlight refresh methods from one place.
- `resolveDisplayModeGroundSettings(...)` currently enables ground only in `rendered` mode, and `resolveDisplayModeEnvironmentGrade(...)` already has display-mode-specific presentation override precedent for `material` mode.
- `resolveMaterialForPart(...)` already returns `displayModeSolidMaterial` for `solid` mode while keeping rendered/material modes on cached project material presets.
- `Viewer.test.ts` already has display-mode proof that switching `material`, `rendered`, `solid`, and `wireframe` keeps the same mesh and geometry while swapping presentation material behavior.
- The cleanest first implementation is therefore a viewer-owned rendered-mode Clay Studio presentation override, backed by a small normalized `viewportStyle` field.

#### First Pass Decisions

- Treat Clay Studio as a presentation preset or look, not a new geometry result mode.
- Add a small persistent style switch in `ViewSettings` now that Phase 2 needs a stable runtime selector:
  - recommended type: `ViewportStyle`
  - recommended field: `viewportStyle`
  - recommended values: `'standard' | 'clayStudio'`
  - recommended default: `'standard'`
- Keep `displayMode` separate from `viewportStyle`.
- Apply Clay Studio only when `viewportStyle === 'clayStudio'` and the resolved display mode is `rendered`.
- Reuse the existing `rendered` mode where possible, but use a pale runtime material override similar to `solid` if project materials would fight the clay read.
- Do not mutate `ViewSettings.materials`, project material presets, per-part assignments, environment presets, or imported material truth.
- Prefer viewer-local constants for the clay material, bright grade/background, ground presentation, and neutral lights.
- Keep `material`, `solid`, `wireframe`, and `renderPreview` behavior as-is.
- Let Clay Studio suppress grid/axes at render time without changing `settings.gridVisible` or `settings.axesVisible` if the first implementation can do that cleanly.
- Preserve topology highlights and edge visibility settings.
- Preserve Phase 1 `postProcessing` as inert settings state; do not consume SSAO values yet.

### Phase 2 Implementation Spec

#### Exact First Code Cut

Implement the Clay Studio look in `Viewer.ts` using existing material, light, ground, and environment application helpers.

Recommended first cut:
1. Add `ViewportStyle`, `VIEWPORT_STYLE_OPTIONS`, `DEFAULT_VIEWPORT_STYLE`, and `isViewportStyle(...)` in `src/shared/viewSettingsTypes.ts`.
2. Add `viewportStyle: ViewportStyle` to `ViewSettings`, `DEFAULT_VIEW_SETTINGS`, and `normalizeViewSettings(...)`.
3. Update `LegacyViewSettingsInput` naturally through the `Partial<ViewSettings>` path; invalid persisted style values should normalize to `'standard'`.
4. Add focused store normalization coverage in `src/app/store/uiPrefsStore.test.ts`.
5. In `Viewer.ts`, add a private `resolveClayStudioActive()` helper that returns true only for `viewportStyle === 'clayStudio'` and resolved display mode `rendered`.
6. Add viewer-local constants for:
   - pale clay part material
   - bright neutral environment grade/background
   - pale/neutral ground material or ground override
   - soft key/fill/rim light specs
7. Update `applyViewSettings(...)` grid/axes visibility resolution so Clay Studio can hide grid/axes at runtime without writing back to the store.
8. Update environment/ground/light/material resolution helpers so Clay Studio uses its presentation overrides only while active.
9. Add or reuse a dedicated `displayModeClayStudioMaterial` instead of editing `displayModeSolidMaterial` or cached project materials.
10. Update `resolveMaterialForPart(...)` so Clay Studio active mode returns the clay material, while `solid`, `material`, `wireframe`, and normal `rendered` keep current behavior.
11. Add focused `Viewer.test.ts` coverage proving Clay Studio switches material/background/ground/light presentation without changing the mesh or geometry.
12. Add focused proof that returning to `standard` restores rendered project-material behavior and that `renderPreview` ignores Clay Studio.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/store/uiPrefsStore.test.ts`
- possibly `src/app/store/uiPrefsPersistence.ts` only if TypeScript or policy tests reveal `viewportStyle` needs explicit copy handling beyond the existing view-settings policy pattern

#### No-Widening Rule

Do not add a composer, SSAO, or post-processing in this phase.

Do not add:
- UI controls
- SSGI
- WebGPU/TSL logic
- render-preview/path-tracer Clay Studio overrides
- material preset mutations
- environment preset mutations
- graph/build/export behavior
- topology selection or overlay rewrites

#### Implementation Risks

- hiding assigned materials in a way that surprises users
- making Solid/Material/Rendered semantics confusing
- washing out selected/hover highlights
- accidentally changing stored `gridVisible`, `axesVisible`, environment, ground, or material settings when Clay Studio is only meant to be a presentation override
- applying Clay Studio to `renderPreview` and confusing the path-tracer/render-preview lane
- replacing cached project materials instead of returning a separate clay override material

#### Checklist

- [x] Add and normalize the `viewportStyle` settings contract.
- [x] Add Clay Studio rendered-mode presentation resolution.
- [x] Apply pale clay material without mutating material truth.
- [x] Apply/derive bright neutral background, ground, and lighting.
- [x] Hide grid/axes at runtime if active without changing stored preferences.
- [x] Preserve display edge and topology highlight behavior.
- [x] Prove geometry meshes are not rebuilt.
- [x] Prove standard rendered mode and render preview remain unchanged.

#### Verification Shape

- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- src/viewer/Viewer.test.ts -t "display mode"`
- `npm.cmd test -- src/viewer/Viewer.test.ts -t "Clay Studio"` once new focused tests exist
- manual browser screenshot sanity after implementation
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2 is done when Clay Studio can be applied as a normal interactive rendered-mode viewport look without SSAO, without mutating project material/environment truth, without rebuilding geometry, and without changing render-preview/path-tracer behavior.

#### Implementation Result

Shipped on 2026-05-20 15:50:43.

- `ViewSettings.viewportStyle` now carries the normalized `standard | clayStudio` style switch.
- `Viewer.ts` applies Clay Studio only in normal rendered mode, using a dedicated clay material, bright background/grade, pale ground, soft lights, and runtime grid/axis suppression.
- `Viewer.ts` leaves stored material presets, per-part assignments, environment presets, graph/build truth, SSAO settings, and render-preview behavior untouched.
- Focused store/persistence/viewer tests prove style normalization, view-settings persistence, geometry-preserving Clay Studio switching, standard rendered restoration, and render-preview exclusion.
- Verification passed with `npm.cmd test -- src/app/store/uiPrefsStore.test.ts`, `npm.cmd test -- src/app/store/scenePresentationEditHistoryReadiness.test.ts`, `npm.cmd test -- src/viewer/Viewer.test.ts -t "Clay Studio"`, `npm.cmd test -- src/viewer/Viewer.test.ts -t "display modes"`, `npm.cmd run build`, and `git diff --check`.

## [x] `Model-Viewport-5 / Phase 2.1` - `Shift+D Clay Studio Wheel Entry`

### Phase 2.1 Summary

#### Purpose

Expose the shipped Clay Studio viewport style through the existing `Shift+D` display wheel so the user can toggle it without waiting for the broader SSAO/control phase.

#### Owns

- one `Clay Studio` display-wheel entry
- writing `ViewSettings.viewportStyle`
- preserving the current display-mode and edge-display wheel behavior
- focused interaction proof

#### Does Not Own

- SSAO controls
- composer or post-processing runtime
- Clay Studio visual tuning
- Properties/Settings panel controls
- render-preview/path-tracer behavior
- material, environment, graph, build, or export truth

#### Current Live Read

- Phase 2 shipped `ViewSettings.viewportStyle` with `standard | clayStudio`.
- `Viewer.ts` already applies `clayStudio` in rendered mode only and ignores it for render preview.
- `Model-Viewport-3 / Phase 2` previously shipped the `Shift+D` radial display-mode menu.
- `Model-Viewport-4 / Phase 6` previously added center edge controls to the same `Shift+D` display wheel.
- The missing behavior is not another viewer-runtime feature; it is a UI routing gap from the existing wheel to the shipped `viewportStyle` owner.

#### First Pass Decisions

- Add `Clay Studio` as a style entry in the `Shift+D` wheel rather than a new display mode.
- Selecting `Clay Studio` should set `viewportStyle: 'clayStudio'` and keep or move the display mode to normal `rendered` if the live wheel implementation needs rendered mode for the style to be visible.
- Selecting normal display modes should keep current display-mode behavior and set `viewportStyle: 'standard'` only when that is necessary to make leaving Clay Studio obvious and deterministic.
- Do not add SSAO toggles, radius/intensity/quality controls, or composer state to the wheel in this phase.
- Keep edge-display controls exactly as they are.

### Phase 2.1 Implementation Spec

#### Exact First Code Cut

1. Find the live `Shift+D` display-wheel owner and display-mode action model.
2. Add one `Clay Studio` option that writes through `useUiPrefsStore.setView(...)` or `setViewKey('viewportStyle', 'clayStudio')`.
3. If needed, pair the option with `displayMode: 'rendered'` so the shipped viewer style is visible immediately.
4. Ensure choosing `Rendered`, `Solid`, `Material`, `Wireframe`, or `Render Preview` has deterministic behavior when Clay Studio was active.
5. Add focused tests for the wheel action model or interaction path proving the Clay Studio entry writes `viewportStyle`.
6. Add focused proof that existing display-mode and edge-display actions still work.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/viewCommands.ts` or the current display-wheel command owner if the repo uses a separate helper
- `src/app/store/uiPrefsStore.test.ts` only if the wheel action needs additional store proof

#### No-Widening Rule

Do not change:
- `Viewer.ts` Clay Studio runtime presentation
- SSAO/post-processing behavior
- render-preview runtime
- material presets or per-part assignments
- graph/build/export behavior
- global Properties/Settings controls

#### Implementation Risks

- treating Clay Studio as a display mode instead of a style switch
- accidentally hiding the existing edge-display center controls
- making Render Preview inherit Clay Studio even though Phase 2 explicitly excluded it
- leaving the user stuck in Clay Studio when selecting a normal mode

#### Checklist

- [x] Locate the current `Shift+D` wheel action owner.
- [x] Add a visible `Clay Studio` wheel entry.
- [x] Route the entry through `ViewSettings.viewportStyle`.
- [x] Preserve existing display-mode actions.
- [x] Preserve existing edge-display actions.
- [x] Add focused wheel/action tests.
- [x] Keep SSAO controls deferred.

#### Verification Shape

- focused `ViewerHost` or display-wheel command tests for `Shift+D` / Clay Studio selection
- focused regression proof for existing display mode and edge display actions
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2.1 is done when the user can pick Clay Studio from the `Shift+D` wheel, the shipped `viewportStyle` value changes correctly, normal display-mode and edge-display actions still work, and no SSAO/composer/render-preview behavior is widened.

#### Implementation Result

Shipped on 2026-05-20 16:05:05.

- `useViewerDisplayModeMenu(...)` now exposes `selectViewportStyle(...)`.
- Choosing Clay Studio from the `Shift+D` wheel sets `viewportStyle: 'clayStudio'` and moves display mode to `rendered` so the shipped Phase 2 style is immediately visible.
- Choosing a normal display mode from the wheel resets `viewportStyle` to `standard`.
- `ViewerHost` renders a `Clay Studio` radial entry while preserving the existing center edge-display controls.
- Focused hook and `ViewerHost` tests prove Clay Studio selection, normal-mode reset, and edge-display behavior.
- Verification passed with `npm.cmd test -- src/app/useViewerDisplayModeMenu.test.tsx`, `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "Clay Studio entry"`, `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "center edge controls"`, `npm.cmd run build`, and `git diff --check`.

## [x] `Model-Viewport-5 / Phase 3` - `Post-Process Composer Boundary`

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

- `Viewer.renderLoop` currently calls `renderPreviewSampleFrame()` first and then falls back to `this.renderer.render(this.scene, activeCamera)`.
- `renderPreviewRuntime` is already isolated and should remain separate.
- The viewer already resets render preview on camera/view changes.
- `handleResize` currently updates `cameraController` viewport size, calls `renderer.setSize(width, height, false)`, and resets render preview.
- `dispose()` already centralizes viewer runtime cleanup, including frame cancellation, observers/listeners, helper disposal, material/mesh cleanup, environment texture disposal, and `renderer.dispose()`.
- `Viewer.test.ts` already mocks `WebGLRenderer`, spies on `renderer.render(...)`, drives private `renderLoop()`, captures `ResizeObserver`, and has render-preview fallback coverage.

#### First Pass Decisions

- Keep direct render as the default and fallback.
- Add the composer boundary as an opt-in path that can be kept inert until Phase 4 enables an actual SSAO pass.
- Prefer a small `src/viewer/postProcessingRuntime.ts` helper so `Viewer.ts` owns when post-processing is used but the composer lifecycle does not bloat the main class.
- The helper should expose a tiny API:
  - `render(scene, camera)`
  - `setSize(width, height)`
  - `dispose()`
  - `isAvailable()` or equivalent fallback read
- Route through the helper only when post-processing is active and available; otherwise call `renderer.render(...)`.
- Keep render-preview mode out of the composer path unless implementation proves a specific need.
- Do not import or create an SSAO pass in Phase 3.

### Phase 3 Implementation Spec

#### Exact First Code Cut

Add a small post-process runtime helper beside `Viewer.ts` that can own an `EffectComposer` plus basic render pass, then teach `Viewer.renderLoop` to call a single render method that chooses between direct rendering and the helper. Phase 3 may leave the helper disabled until Phase 4 has a real effect, but the lifecycle hooks must be ready and tested.

Implementation direction:

1. Create `src/viewer/postProcessingRuntime.ts`.
2. Use Three.js example post-processing imports in that helper, not scattered across `Viewer.ts`.
3. Give the helper constructor the existing `WebGLRenderer`, `Scene`, and active camera input needed for render-pass setup.
4. Add `Viewer` fields for the runtime and for the last known render size if the helper needs size initialization.
5. Add a `renderInteractiveFrame(activeCamera)` method in `Viewer.ts` that:
   - returns immediately to direct render when no post-process runtime is active or available
   - calls the post-process runtime when enabled
   - catches setup/render failure and falls back to direct render
6. Update `handleResize` to resize the helper after `renderer.setSize(...)`.
7. Update `dispose()` to dispose the helper before renderer disposal.
8. Keep `renderPreviewSampleFrame()` first in `renderLoop`; if render preview handles the frame, post-processing must not run.
9. Add a test seam or test factory only if needed to avoid hard-coupling tests to Three.js example internals.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/postProcessingRuntime.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- this phase doc and `docs/Doc-Log.md`

#### No-Widening Rule

Do not add SSAO, SSGI, Properties controls, Shift+D changes, visual tuning, new user-facing labels, or render-preview/path-tracer behavior in this phase.

#### Implementation Risks

- double-rendering overlays or HUD-adjacent canvas elements
- breaking render-preview mode
- leaking render targets on resize/dispose
- creating the composer eagerly even when no post-process pass is enabled
- making direct render tests brittle by replacing the whole render path

#### Checklist

- [x] Add `postProcessingRuntime` helper ownership.
- [x] Add a `Viewer` render branch that can use post-processing without changing direct render behavior.
- [x] Keep direct render as the default/fallback path.
- [x] Handle helper resize from `handleResize`.
- [x] Handle helper disposal from `dispose()`.
- [x] Keep render-preview behavior unchanged and before post-processing.
- [x] Add focused viewer proof for render branch, fallback, resize, dispose, and render-preview separation where testable.

#### Verification Shape

- focused viewer tests for fallback/direct-render selection
- focused resize/dispose proof if testable
- focused render-preview fallback proof that post-processing does not run when render preview handles the frame
- production build
- `git diff --check`

#### Done Shape

Phase 3 is done when the viewer has a safe, disposable, resizable post-process composer boundary ready for SSAO, while direct rendering remains the default/fallback and render-preview mode stays isolated.

#### Implementation Result

Shipped on 2026-05-20 16:38:33.

- Added `src/viewer/postProcessingRuntime.ts` with a small `EffectComposer`/`RenderPass` wrapper and test factory seam.
- `Viewer.ts` now keeps direct raster rendering as the default path and only routes through the post-process runtime when `ViewSettings.postProcessing.ssaoEnabled` is active.
- Post-processing setup or render failures fall back to `renderer.render(...)` without throwing through the render loop.
- `handleResize` resizes the helper when it exists, and `dispose()` disposes it before renderer teardown.
- Render Preview remains isolated: `renderPreviewSampleFrame()` still runs before the post-process branch, and `renderPreview` display mode does not create the composer runtime.
- Focused verification passed with `npm.cmd test -- src/viewer/Viewer.test.ts -t "post-processing|render preview"` and `npm.cmd run build`.

## [x] `Model-Viewport-5 / Phase 4` - `Interactive SSAO Pass`

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
- Phase 3 added `src/viewer/postProcessingRuntime.ts` with an `EffectComposer`/`RenderPass` helper, a test factory seam, and viewer-owned resize/dispose/fallback handling.
- `Viewer.renderInteractiveFrame(...)` currently uses the post-process runtime only when `ViewSettings.postProcessing.ssaoEnabled` is true and the display mode is not `renderPreview`.
- Installed Three.js includes `SSAOPass(scene, camera, width, height, kernelSize)` from `three/examples/jsm/postprocessing/SSAOPass.js`.
- `SSAOPass` exposes `kernelRadius`, `minDistance`, `maxDistance`, `output`, `setSize(...)`, and `dispose()`.
- The TypeScript declaration currently misspells `dispose` as `dipose`, so implementation may need a narrow local cast for `ssaoPass.dispose()` rather than widening app types.

#### First Pass Decisions

- Prefer a WebGL-compatible SSAO pass first.
- Keep settings small and bounded.
- Tune for white clay readability rather than dramatic game-style AO.
- Add `SSAOPass` to the Phase 3 helper rather than importing post-processing examples directly in `Viewer.ts`.
- Use Phase 1 settings as the only user intent owner:
  - `ssaoEnabled`
  - `ssaoIntensity`
  - `ssaoRadius`
  - `ssaoQuality`
- Treat `ssaoQuality` as the first kernel/performance knob:
  - `low` should use a smaller kernel.
  - `medium` should be the default.
  - `high` can use the larger kernel.
- Map `ssaoRadius` to `SSAOPass.kernelRadius`.
- Map `ssaoIntensity` conservatively through distance/strength-like pass settings available in `SSAOPass`; if direct intensity is not available, use a small deterministic tuning function over `minDistance`/`maxDistance` and document that Phase 6.3 may expose better advanced controls later.
- Keep fallback behavior in the existing Phase 3 render branch: if SSAO pass creation or rendering fails, return to direct render.
- Do not add Properties controls in Phase 4; users can toggle through existing settings paths/tests until Phase 6.

### Phase 4 Implementation Spec

#### Exact First Code Cut

Wire `SSAOPass` into the Phase 3 composer helper and map normalized settings into the pass.

Implementation direction:

1. Extend `ViewerPostProcessingRuntimeOptions` with the normalized `ViewPostProcessSettings`.
2. Import `SSAOPass` and its output enum/static output from `three/examples/jsm/postprocessing/SSAOPass.js` inside `postProcessingRuntime.ts`.
3. Add a helper such as `resolveSsaoRuntimeSettings(settings)` that returns:
   - kernel size from quality
   - kernel radius from `ssaoRadius`
   - min/max distance from a conservative `ssaoIntensity` mapping
4. Create the `SSAOPass` after the base `RenderPass` only when `ssaoEnabled` is true.
5. Store and update the `SSAOPass.camera` during `render(activeCamera)` just like the base render pass.
6. Add an `updateSettings(settings)` method to `ViewerPostProcessingRuntime` so `Viewer.applyViewSettings(...)` can update the live pass without recreating geometry or the viewer.
7. Recreate the post-processing runtime when quality changes if `SSAOPass` kernel size cannot be changed after construction.
8. Keep `setSize(...)` forwarding to both composer and SSAO pass.
9. Dispose both composer and SSAO pass, using a narrow local type/cast if the Three.js type definition still lacks the correctly-spelled `dispose`.
10. Add focused viewer/runtime proof for:
    - SSAO pass creation when `ssaoEnabled` is true.
    - disabled path staying direct or visually equivalent.
    - settings updates reaching the runtime.
    - quality changes recreating or refreshing the pass if needed.
    - render-preview mode not creating the SSAO pass.
    - fallback when SSAO setup/render fails.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/postProcessingRuntime.ts`
- `src/shared/viewSettingsTypes.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- this phase doc and `docs/Doc-Log.md`

#### No-Widening Rule

Do not add SSGI, WebGPU migration work, Properties controls, Shift+D changes, Clay Studio material/light retuning, overlay-order rewrites, render-preview/path-tracer changes, or export/render queue behavior.

#### Implementation Risks

- noisy or dirty-looking AO on pale surfaces
- performance drops on larger scenes
- AO affecting overlays if compositing order is wrong
- quality changes leaking old pass render targets if the runtime must recreate
- pretending `ssaoIntensity` has direct shader support when the selected pass exposes only distance/radius controls
- making the composer path active for `renderPreview`

#### Checklist

- [x] Add `SSAOPass` inside `postProcessingRuntime`.
- [x] Map `ssaoQuality` to kernel size.
- [x] Map `ssaoRadius` to `kernelRadius`.
- [x] Map `ssaoIntensity` conservatively through supported pass settings.
- [x] Add live settings update or safe runtime recreation for pass settings.
- [x] Keep disabled path direct or visually equivalent.
- [x] Keep render-preview mode out of the SSAO path.
- [x] Prove settings update without rebuilding geometry.
- [x] Prove fallback if pass setup/render is unavailable.

#### Verification Shape

- focused viewer tests for runtime branch/settings application
- focused post-processing runtime tests or viewer-factory tests for SSAO pass settings
- browser screenshot sanity for Clay Studio with SSAO if the local app/browser path is available
- production build
- `git diff --check`

#### Done Shape

Phase 4 is done when Clay Studio can use an interactive WebGL SSAO pass through the Phase 3 composer path, normalized SSAO settings affect the runtime, direct/render-preview fallback remains honest, and no geometry/material/export truth is mutated.

#### Implementation Result

Shipped on 2026-05-20 16:47:11.

- `postProcessingRuntime` now creates a Three.js `SSAOPass` after the base `RenderPass`.
- `ssaoQuality` maps to kernel sizes `low: 16`, `medium: 32`, and `high: 64`.
- `ssaoRadius` maps to `SSAOPass.kernelRadius`.
- `ssaoIntensity` maps conservatively into `SSAOPass.minDistance` and `SSAOPass.maxDistance`.
- `Viewer` passes normalized `ViewSettings.postProcessing` into runtime creation and live update.
- SSAO setting changes update the live runtime when possible, while quality/kernel changes dispose and recreate the runtime on the next frame.
- Render Preview remains ahead of the post-process path and does not create the SSAO runtime.
- Focused verification passed with `npm.cmd test -- src/viewer/Viewer.test.ts -t "post-processing|SSAO|render preview"`, `npm.cmd run build`, and `git diff --check`.

## [x] `Model-Viewport-5 / Phase 5` - `Overlay And Selection Compatibility`

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
- Phase 4 now runs the whole Three scene through `SSAOPass` when `postProcessing.ssaoEnabled` is true.
- Selection outlines and topology overlays generally use high `renderOrder`, `depthTest: false`, `depthWrite: false`, and `toneMapped: false`.
- Body, face, edge, and point selection overlays are attached under selected meshes and use render orders around `128` through `142`.
- Display-edge overlays switch depth testing based on `Visible edges only`; normal x-ray edge overlays use non-depth-tested presentation, while visible-only edges intentionally use depth-tested presentation.
- Sketch profile/component overlays and the extrude command preview already use dedicated overlay groups/materials with explicit render orders.
- Axis gizmo and DOM HUD/radial overlays are outside the main Three scene render path and should not be affected by SSAO, but still need quick regression proof.

#### First Pass Decisions

- AO should affect scene geometry, not make UI/interaction overlays muddy.
- Selection/hover highlights should remain above normal display edges and AO.
- Start with proof before visual changes: many overlays may already render acceptably because they are non-depth-tested and high order.
- If overlays pollute SSAO normal/depth sampling, prefer a narrow post-processing exclusion mechanism over retuning highlight colors.
- Keep `Visible edges only` depth behavior intact; this phase should not turn visible-only edges into x-ray edges just to avoid AO.
- Treat DOM HUD/radial compatibility as regression proof, not renderer work.

### Phase 5 Implementation Spec

#### Exact First Code Cut

Audit and adjust post-process ordering so overlays remain readable under SSAO, adding focused tests where current viewer seams allow it.

Implementation direction:

1. Add focused proof that enabling `postProcessing.ssaoEnabled` does not change topology selection and hover overlay material hierarchy:
   - selected faces stay blue/tone-mapping-free/depth-test-free.
   - hovered faces stay white/tone-mapping-free/depth-test-free.
   - selected/hovered edges and points keep their high render orders.
2. Add proof that display-edge overlays preserve the existing `off` / `on` / `visibleOnly` behavior when SSAO is enabled.
3. Add proof that sketch overlay materials and extrude preview overlays keep their existing depth/tone/render-order contract when SSAO is enabled.
4. Add proof that render-preview mode still bypasses SSAO and does not create overlay-specific side effects.
5. If the SSAO pass includes helper/overlay geometry in its normal/depth pass and that causes muddy interaction layers, add a narrow exclusion path in `postProcessingRuntime` or `Viewer`:
   - identify helper/overlay objects through existing `userData.selectionOverlay`, `userData.hoverOverlay`, display-edge metadata, sketch overlay groups, or helper groups.
   - hide only those helper/overlay objects for the SSAO normal/depth stage if the pass allows a local hook.
   - restore visibility immediately after the pass.
6. If the Three.js `SSAOPass` does not expose a safe internal hook, keep Phase 5 to material/render-order proof and defer deeper pass surgery to a later overlay-order phase rather than patching private internals.
7. Do not retune highlight colors/glow unless a concrete screenshot or test shows the existing contrast fails under SSAO.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/viewer/postProcessingRuntime.ts` only if an overlay exclusion hook is needed
- possibly `src/viewer/overlay/AxisGizmo.ts`
- possibly `src/viewer/sketch/*`
- `docs/CHANGELOG.md`
- this phase doc and `docs/Doc-Log.md`

#### No-Widening Rule

Do not retune the whole highlight system unless SSAO exposes a concrete contrast problem. Do not add Properties controls, SSGI/WebGPU work, new topology generation, snapping/measurement/direct-modeling behavior, or Clay Studio material/light tuning.

#### Implementation Risks

- selected face/edge/point overlays becoming too dark
- gizmo lines getting post-processed as scene geometry
- hidden/back display edges changing unexpectedly
- helper geometry contributing to SSAO normal/depth buffers and creating false contact shadows
- accidentally breaking `Visible edges only` depth-tested behavior while protecting overlays
- reaching into private `SSAOPass` internals too aggressively

#### Checklist

- [x] Prove selected topology overlays remain readable.
- [x] Prove hover overlays remain readable.
- [x] Prove edge display modes behave under SSAO.
- [x] Prove sketch plane/draw overlays are not obscured.
- [x] Prove gizmo/helper lines remain readable.
- [x] Add a narrow exclusion hook only if proof shows SSAO muddies helper overlays.
- [x] Preserve render-preview separation.

#### Verification Shape

- focused viewer tests
- focused post-processing runtime tests only if an exclusion hook is added
- manual screenshot sanity across `Solid`, `Material`, `Rendered`, Clay Studio, and visible-edges-only
- production build
- `git diff --check`

#### Done Shape

Phase 5 is done when SSAO is proven compatible with the current interactive viewport overlays, and any required overlay protection is narrow, test-backed, and does not change geometry/material/export truth.

#### Implementation Result

Shipped on 2026-05-20 17:15:18.

- Added focused viewer proof that enabled SSAO preserves selected and hovered topology overlays with their existing high render orders, `depthTest: false`, `depthWrite: false`, and `toneMapped: false` presentation.
- Added proof that display-edge `on`, `visibleEdgesOnly`, and `off` behavior stays intact under SSAO, including intentionally depth-tested visible-only edges.
- Added proof that sketch profile overlays and extrude preview overlays keep their existing material depth/tone contracts while the SSAO composer path is active.
- Added proof that the axis HUD renders outside the SSAO composer path.
- Kept Phase 5 proof-only because no narrow helper exclusion hook was needed.
- Focused verification passed with `npm.cmd test -- src/viewer/Viewer.test.ts -t "SSAO|post-processing|topology selection and hover|display-edge depth|sketch and extrude overlay|axis HUD"`.

## [x] `Model-Viewport-5 / Phase 6` - `Properties Render Controls Umbrella`

### Phase 6 Summary

#### Purpose

Lock the UI ownership decision for Clay Studio and SSAO controls before adding more controls.

#### Owns

- Properties workspace `Render` as the primary user-facing tuning home
- the split between fast `Shift+D` style switching and slower Properties tuning
- simple label and grouping rules for later control phases
- preservation of existing view-settings persistence ownership

#### Does Not Own

- new toolbar architecture
- new workspace surface
- new material editor semantics
- advanced SSAO slider implementation
- runtime SSAO implementation

#### Current Live Read

- `Shift+D` display radial menu owns display mode selection.
- Properties has a global `Render` section.
- Settings has viewport controls and highlight controls.
- View Toolbar owns explicit view controls.
- Phase 2.1 already made Clay Studio selectable from `Shift+D`, so Properties does not need to replace the quick wheel.
- `PropertiesRenderSection.tsx` currently hosts render-preview quality controls in a single `SettingsSurfaceGroup`.
- The Render section already reads `state.view.renderPreview` and writes with `setViewKey(...)`, matching the store path that later controls need for `viewportStyle` and `postProcessing`.
- `PropertiesSurface.tsx` already imports `propertiesRenderSectionDefinition`, so no new Properties surface or route is needed.
- Phase 4 and Phase 5 now mean the runtime can honestly respond to basic Clay Studio/SSAO settings; Phase 6 should therefore lock ownership, not re-litigate runtime readiness.

#### First Pass Decisions

- Put first post-process controls under Properties `Render`.
- Treat `Shift+D` as the quick activation path.
- Treat Properties as the tuning and persistence-readback path.
- Keep Settings for lower-level defaults only if a later use case proves it belongs there.
- Avoid inventing a separate floating panel for this.
- Keep names clear: `Viewport Style`, `Clay Studio`, `Ambient Occlusion`, `Quality`.
- Split implementation into the already-planned subphases:
  - Phase 6.1: add the Render-section placement/group and first style read/write seam.
  - Phase 6.2: add the simple `Viewport Style` and `Ambient Occlusion` controls.
  - Phase 6.3: add advanced SSAO tuning/status only if screenshots or user testing show the simple controls are too limiting.
- Use `Ambient Occlusion` in user-facing copy instead of `SSAO`; keep SSAO as the internal/runtime term.
- Keep `Render Preview quality` controls in the same Render section, but visually separate them from interactive viewport presentation controls when Phase 6.1 lands.

### Phase 6 Implementation Spec

#### Exact First Code Cut

Update the plan and make the next implementation path explicit: Phase 6 itself is an ownership/umbrella closeout, while Phase 6.1 is the first code-changing slice for Properties `Render` placement.

Implementation direction for the next code slice:

1. Keep `PropertiesRenderSection.tsx` as the owner.
2. Add a compact interactive viewport presentation group above or beside the existing render-preview quality controls.
3. Route future writes through the existing `useUiPrefsStore` view-settings path.
4. Preserve `Shift+D` as the fast toggle; Properties is the slower tuning/readback surface.
5. Do not expose advanced numeric SSAO values in Phase 6.1.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.ts`
- `src/shared/viewSettingsTypes.ts` only if shared simple AO preset options are needed in Phase 6.2
- relevant focused Properties tests

#### No-Widening Rule

Do not create a new workspace surface or modal just for SSAO controls, do not move the `Shift+D` quick style switch out of the wheel, do not add advanced SSAO sliders in the umbrella pass, and do not change runtime SSAO/material/light behavior here.

#### Implementation Risks

- controls spread across too many surfaces
- confusing Clay Studio with `Solid` or `Render Preview`
- making SSAO seem like export/render queue truth
- adding controls before the underlying runtime can respond honestly
- crowding the existing render-preview quality controls
- overusing technical SSAO wording in the user-facing Properties UI

#### Checklist

- [x] Lock Properties `Render` as the primary Clay Studio/SSAO tuning home.
- [x] Keep `Shift+D` as the quick style switch.
- [x] Define the first simple control labels.
- [x] Define the advanced-control deferral.
- [x] Add or update focused UI tests when code changes are made.

#### Verification Shape

- doc-only prep: `git diff --check`
- Phase 6.1 code: focused Properties render-section tests
- Phase 6.2 code: focused Properties render-section tests plus store/persistence proof if simple AO presets become shared settings helpers
- browser sanity after user-facing controls land

#### Done Shape

Phase 6 is done when the plan and implementation path clearly separate quick style activation from Properties `Render` tuning and persistence.

#### Prep Result

Prepped on 2026-05-20 17:18:52.

- `PropertiesRenderSection.tsx` remains the owning UI surface for Clay Studio/SSAO controls.
- `Shift+D` remains the quick style switch.
- Phase 6.1 is now the next code-changing slice for the Render-section placement/group.
- Phase 6.2 owns the simple `Viewport Style` and `Ambient Occlusion` controls.
- Phase 6.3 owns advanced SSAO tuning/status only if later visual review proves it is needed.

#### Implementation Result

Shipped on 2026-05-20 17:21:33.

- Closed Phase 6 as a doc/ownership umbrella instead of widening it into control implementation.
- Confirmed Properties `Render` as the tuning/readback home and `Shift+D` as the quick activation surface.
- Confirmed the simple control names for later code work: `Viewport Style` and `Ambient Occlusion`.
- Left actual control code to Phase 6.1 and Phase 6.2, with Phase 6.3 reserved for advanced tuning/status only if needed.
- Verification passed with `git diff --check`.

## [x] `Model-Viewport-5 / Phase 6.1` - `Properties Render Post-Process Placement`

### Phase 6.1 Summary

#### Purpose

Add the Properties `Render` placement for Clay Studio and post-processing controls without exposing the whole advanced control set yet.

#### Owns

- a Properties `Render` group or subsection for viewport style/post-processing
- connection to the existing `ViewSettings.viewportStyle` and `ViewSettings.postProcessing` owners
- focused proof that the Properties surface can read and write these settings

#### Does Not Own

- SSAO runtime implementation
- advanced strength/radius/softness sliders
- a new settings workspace section
- replacing the `Shift+D` wheel

#### Current Live Read

- `PropertiesRenderSection.tsx` already hosts render-preview controls.
- `ViewSettings.viewportStyle` and `ViewSettings.postProcessing` already exist.
- Clay Studio is already reachable from `Shift+D`.
- `PropertiesRenderSection.tsx` currently renders one `SettingsSurfaceGroup` with `Render Preview quality` as the header and one `SettingsSurfaceEditorPanel` containing the render-preview fields.
- The section already reads the active view from `useUiPrefsStore((state) => state.view...)` and writes through `setViewKey(...)`.
- `PropertiesSurface.test.tsx` is the current focused UI test owner for the Properties `Render` section; it queries controls through `.PropertiesRenderSection` and native `ParaSelect`/button labels.
- The existing render-preview tests expect `Render Preview quality`, `Samples`, `Quality preset`, `Noise cleanup`, and `GPU load` to remain present.

#### First Pass Decisions

- Add a compact `Viewport Style` control in Properties `Render`.
- Use `Standard` and `Clay Studio` labels.
- Add one interactive viewport presentation group before the existing render-preview quality controls.
- Keep the Phase 6.1 group small: `Viewport Style` only.
- Do not add an Ambient Occlusion row yet; Phase 6.2 owns the `Off` / `Low` / `Medium` / `High` mapping and any shared preset helper.
- Keep the existing `Render Preview quality` copy and controls intact so the current render-preview tests stay meaningful.
- Use `ParaSelect` to match the existing section pattern.

### Phase 6.1 Implementation Spec

#### Exact First Code Cut

Add a compact Properties `Render` presentation group that reads and writes the shipped Clay Studio style owner while preserving existing render-preview controls.

Implementation direction:

1. Import or define local `Viewport Style` options:
   - `standard` -> `Standard`
   - `clayStudio` -> `Clay Studio`
2. Read `viewportStyle` from `useUiPrefsStore((state) => state.view.viewportStyle)`.
3. Write style changes through `setViewKey('viewportStyle', value)`.
4. Place the new group inside the existing `PropertiesRenderSection` before `Render Preview quality`.
5. Keep the existing `Render Preview quality` heading, fields, reset behavior, and tests intact.
6. Add focused `PropertiesSurface.test.tsx` proof that:
   - the `Viewport Style` select appears in the Render section.
   - it reflects the current `view.viewportStyle`.
   - changing it writes `standard` / `clayStudio` through the store.
   - render-preview controls still work after the new group is present.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/shared/viewSettingsTypes.ts` only if local label/options prove duplicated or awkward

#### No-Widening Rule

Do not add runtime SSAO, Ambient Occlusion presets, advanced AO sliders, a new workspace surface, Settings defaults, or a new `Shift+D` behavior in this phase.

#### Implementation Risks

- making Properties appear to own render/export truth instead of viewport presentation
- duplicating quick-toggle behavior in a confusing way
- overfilling the Render section before SSAO is visually stable
- breaking existing render-preview controls while adding the new presentation group
- accidentally making Clay Studio read like a render-preview-only feature

#### Checklist

- [x] Add a compact Properties `Render` interactive viewport presentation group.
- [x] Add a `Viewport Style` `ParaSelect` with `Standard` and `Clay Studio`.
- [x] Wire through `ViewSettings.viewportStyle` with `setViewKey('viewportStyle', ...)`.
- [x] Preserve existing render-preview controls and reset behavior.
- [x] Add focused Properties proof in `PropertiesSurface.test.tsx`.

#### Verification Shape

- focused `PropertiesSurface.test.tsx` Render-section tests
- focused store proof only if shared option helpers are added
- production build
- `git diff --check`

#### Done Shape

Phase 6.1 is done when Properties `Render` has a clear, tested place for Clay Studio/post-processing controls without forcing advanced SSAO tuning into the first UI pass.

#### Implementation Result

Shipped on 2026-05-20 17:29:02.

- Added a compact `Viewport presentation` group in `PropertiesRenderSection.tsx`.
- Added a `Viewport Style` `ParaSelect` with `Standard` and `Clay Studio` labels.
- Wired style changes through `setViewKey('viewportStyle', ...)`.
- Preserved the existing `Render Preview quality` controls and reset behavior.
- Added focused `PropertiesSurface.test.tsx` proof that the control reflects/writes `viewportStyle` without disturbing render-preview settings.
- Verification passed with `npm.cmd test -- src/app/workspace/PropertiesSurface.test.tsx -t "Render section|viewport style|render preview settings|render quality"`.

## [x] `Model-Viewport-5 / Phase 6.2` - `Basic Clay Studio And Ambient Occlusion Controls`

### Phase 6.2 Summary

#### Purpose

Expose the first user-facing controls for Clay Studio and SSAO after the runtime path exists.

#### Owns

- `Viewport Style`: `Standard` / `Clay Studio`
- `Ambient Occlusion`: `Off` / `Low` / `Medium` / `High`
- mapping the simple AO choices to normalized `ViewSettings.postProcessing`
- persistence and focused UI proof

#### Does Not Own

- advanced slider tuning
- SSGI controls
- export/render queue settings
- changing render-preview behavior

#### Current Live Read

- The Phase 1 settings contract already has SSAO enabled, intensity, radius, and quality fields.
- The UI should not make users learn low-level SSAO terms before the look is accepted.
- Phase 6.1 added a compact `Viewport presentation` group and `Viewport Style` select in `PropertiesRenderSection.tsx`.
- `PropertiesRenderSection.tsx` already imports view-setting helpers from `viewSettingsTypes.ts`, reads from `useUiPrefsStore((state) => state.view...)`, and writes with `setViewKey(...)`.
- `ViewSettings.postProcessing` already normalizes `ssaoEnabled`, `ssaoIntensity`, `ssaoRadius`, and `ssaoQuality`.
- `postProcessingRuntime.ts` maps `ssaoQuality` to kernel size, `ssaoRadius` to `kernelRadius`, and `ssaoIntensity` into SSAO distance tuning.
- Existing store tests already prove raw `postProcessing` writes normalize/clamp; Phase 6.2 only needs wider store proof if it adds shared preset/read helpers.
- `PropertiesSurface.test.tsx` is the focused Properties test owner for the Render section.

#### First Pass Decisions

- Prefer `Ambient Occlusion` over `SSAO` in user-facing copy.
- Keep the first AO control as a discrete option set: `Off`, `Low`, `Medium`, `High`.
- Map `Off` to `ssaoEnabled: false`.
- Map `Low` / `Medium` / `High` to `ssaoEnabled: true` plus quality/tuning values chosen by Phase 4 visual results.
- Add a small shared preset/read helper in `viewSettingsTypes.ts` so UI and tests use one deterministic mapping.
- Recommended preset shape:
  - `off`: `{ ssaoEnabled: false, ssaoIntensity: 1, ssaoRadius: 1, ssaoQuality: 'medium' }`
  - `low`: `{ ssaoEnabled: true, ssaoIntensity: 0.7, ssaoRadius: 0.75, ssaoQuality: 'low' }`
  - `medium`: `{ ssaoEnabled: true, ssaoIntensity: 1, ssaoRadius: 1, ssaoQuality: 'medium' }`
  - `high`: `{ ssaoEnabled: true, ssaoIntensity: 1.35, ssaoRadius: 1.4, ssaoQuality: 'high' }`
- Recommended exported names:
  - `ViewAmbientOcclusionPreset`
  - `VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS`
  - `createViewAmbientOcclusionPresetSettings(...)`
  - `resolveViewAmbientOcclusionPresetRead(...)`
- If the current `postProcessing` values do not exactly match a preset, read as the nearest enabled quality bucket for the basic UI instead of showing `Custom`; advanced/custom display waits for Phase 6.3.

### Phase 6.2 Implementation Spec

#### Exact First Code Cut

Add the compact Properties `Render` Ambient Occlusion control beside the shipped Viewport Style control, writing through the existing view-settings store.

Implementation direction:

1. Add shared AO preset/read helpers in `src/shared/viewSettingsTypes.ts`.
2. Import those helpers into `PropertiesRenderSection.tsx`.
3. Read `postProcessing` from `useUiPrefsStore((state) => state.view.postProcessing)`.
4. Render a `ParaSelect` labeled `Ambient Occlusion` in the existing `Viewport presentation` group.
5. On change, write `setViewKey('postProcessing', createViewAmbientOcclusionPresetSettings(value))`.
6. Preserve the shipped `Viewport Style` control and all Render Preview controls.
7. Add focused `PropertiesSurface.test.tsx` proof for:
   - AO select appears in Properties `Render`.
   - default/off state reads correctly.
   - selecting `Low`, `Medium`, or `High` writes the expected normalized `postProcessing`.
   - selecting `Off` disables SSAO without disturbing `viewportStyle` or `renderPreview`.
8. Add focused store/shared-helper proof if the new helper lives in `viewSettingsTypes.ts`.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.test.ts` if shared AO preset helpers need direct proof

#### No-Widening Rule

Do not add freeform numeric SSAO sliders, advanced status copy, SSGI controls, runtime tuning changes, Settings defaults, export/render queue behavior, or new workspace surfaces in the first basic UI pass.

#### Implementation Risks

- AO choices not matching the actual runtime visual tuning
- accidentally making Clay Studio a render-preview-only feature
- making `Ambient Occlusion` appear to affect exported files
- overwriting custom future advanced values too aggressively when the user only changes style
- showing technical `SSAO` terms in the user-facing Render section

#### Checklist

- [x] Add `Viewport Style` control.
- [x] Add `Ambient Occlusion` option control.
- [x] Map AO options to normalized post-processing settings.
- [x] Preserve persistence policy.
- [x] Add focused UI tests.
- [x] Add focused shared-helper/store proof if shared AO helpers are introduced.

#### Verification Shape

- focused Properties control tests
- focused store normalization/persistence test if mappings are shared
- browser sanity
- production build
- `git diff --check`

#### Done Shape

Phase 6.2 is done when users can set `Standard` / `Clay Studio` and `Off` / `Low` / `Medium` / `High` Ambient Occlusion from Properties `Render`.

## [x] `Model-Viewport-5 / Phase 6.3` - `Clay Studio Lighting And AO Tuning`

### Phase 6.3 Summary

#### Purpose

Tune the shipped Clay Studio look toward the Pascal reference after live screenshot review showed the AO is now functional but the visual balance is still off.

The next target is not more UI. The target is a better default visual read: softer lighting, less harsh directional shadowing, broader clay-like ambient occlusion, and less black edge dominance where Clay Studio is active.

#### Owns

- Clay Studio-only lighting balance
- key/directional light intensity, shadow softness, and shadow participation for Clay Studio
- hemisphere/fill contribution for the pale clay read
- AO preset value tuning for `Low`, `Medium`, and `High`
- Clay Studio edge-display de-emphasis if black edges fight the soft reference look
- focused visual-regression proof around settings values and preserved non-Clay modes

#### Does Not Own

- new Properties sliders or advanced controls
- changing the basic `Viewport Style` or `Ambient Occlusion` control contract
- Settings defaults
- SSGI implementation
- a general render-effects framework
- production/export/render-preview changes

#### Current Live Read

- User screenshot review after Phase 6.2 shows `Ambient Occlusion: High` is visible and stable, but it still reads weaker and more local than the Pascal reference.
- The Pascal reference gets depth from broad gray accumulation, soft overexposed clay lighting, and subtle grain; it does not read as hard black lamp shadow.
- The current ParaHook Clay Studio read has a harsh dark side/bottom band from directional/key-light contrast and shadowing.
- Black edge/topology lines are more dominant in ParaHook than in the reference and can compete with the soft clay read.
- The likely first fix is to adjust Clay Studio presentation settings in `Viewer.ts`, not expose more user controls.

#### First Pass Decisions

- Keep the Properties controls unchanged for this phase.
- Treat hard directional shadows as the first visual defect.
- Prefer stronger fill and softer/lower-contrast key lighting in Clay Studio over simply cranking AO intensity.
- Tune AO toward broader gray contact depth with less black crushing.
- Only de-emphasize edge lines in Clay Studio if the current edge-display path can do so without hurting selection/highlight truth.
- Keep normal `Rendered`, `Material`, `Solid`, `Wireframe`, and `Render Preview` behavior unchanged.

### Phase 6.3 Implementation Spec

#### Exact First Code Cut

Tune the shipped Clay Studio visual preset and AO presets without adding new UI.

Implementation direction:

1. Read the current Clay Studio branches in `src/viewer/Viewer.ts`, especially material override, environment grade/background, ground, authored-light overrides, shadow settings, grid/axis suppression, and edge/display overlay behavior.
2. Identify where the harsh directional/key-light shadow is introduced in Clay Studio.
3. Adjust Clay Studio lighting to reduce hard directional contrast:
   - lower key/directional intensity where needed
   - increase hemisphere/fill contribution
   - soften or disable Clay Studio cast shadows if the existing shadow map cannot be made soft enough
   - keep the scene bright enough that AO reads as gray accumulation, not black shadow
4. Adjust AO preset mappings in `src/shared/viewSettingsTypes.ts` so `Low` / `Medium` / `High` are broader and softer:
   - increase radius before intensity
   - avoid black crushing
   - keep `Off` unchanged
5. If needed, adjust Clay Studio edge display toward pale/thin read without weakening selection or hover overlays.
6. Add focused tests proving:
   - Clay Studio lighting uses the tuned softer/fill-heavy setup
   - non-Clay modes keep their existing lighting/shadow behavior
   - AO preset mapping changed intentionally and still normalizes
   - edge/selection overlays remain separate from any Clay Studio edge de-emphasis
7. Run browser screenshot sanity against Clay Studio with AO `Off` and `High`.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.test.ts` if AO preset helper values change
- Properties files only if labels/readback need no-op verification

#### No-Widening Rule

Do not add new controls, SSGI, WebGPU settings, export settings, render-preview changes, path-tracing behavior, a grain/noise pass, or a broad material-system refactor in this phase.

#### Implementation Risks

- overcorrecting into a washed-out scene with no usable depth
- replacing hard directional shadows with overly black AO
- weakening selection/hover/topology edge readability while trying to soften Clay Studio lines
- accidentally changing normal rendered lighting instead of Clay Studio-only presentation
- treating the Pascal reference's grainy/path-traced feel as something SSAO alone can fully match

#### Checklist

- [x] Audit current Clay Studio light/material/shadow branch.
- [x] Reduce harsh Clay Studio directional/key-light shadowing.
- [x] Increase soft fill/hemisphere contribution for Clay Studio.
- [x] Tune AO presets toward broader softer contact shading.
- [x] Decide whether Clay Studio edge lines need de-emphasis.
- [x] Preserve non-Clay lighting, shadows, overlays, and render-preview behavior.
- [x] Add focused viewer/store proof.
- [ ] Run browser screenshot sanity for AO `Off` and `High`.

#### Verification Shape

- focused viewer tests
- focused shared AO preset/store tests if preset values change
- browser screenshot sanity
- production build
- `git diff --check`

#### Done Shape

Phase 6.3 is done when Clay Studio no longer reads as harshly side-lit white CAD blocks and instead moves closer to the Pascal reference: bright clay base, soft fill-heavy lighting, broad gray AO contact depth, and no unnecessary black edge dominance.

#### Implementation Result

Shipped on 2026-05-20 18:07:56.

- Clay Studio now uses a warmer pale clay material and ground, softer grade, lower key light, stronger hemisphere/fill, and an added ambient contribution.
- Clay Studio disables directional shadow-map participation so the default look no longer produces hard black side/bottom shadow bands.
- Ambient Occlusion presets now use broader `Low`, `Medium`, and `High` mappings so contact depth reads as soft gray accumulation before intensity is increased.
- Clay Studio edge overlays now use a muted gray and lower opacity while hover/selection overlays remain separate.
- Non-Clay rendered lighting/shadow behavior and render-preview separation are preserved.
- Focused viewer/store/Properties tests and production build passed. Browser smoke confirmed the dev build opens the Model Viewport with visible canvas surfaces; exact AO `Off`/`High` screenshot comparison remains for the later visual QA phase.

## [x] `Model-Viewport-5 / Phase 6.4` - `Clay Studio Ground Contact`

### Phase 6.4 Summary

#### Purpose

Make Clay Studio objects visibly belong to the presentation ground plane.

Screenshot review after Phase 6.3 suggests Ambient Occlusion is working on mesh-to-mesh edges, but the viewer ground plane still reads too flat and disconnected. The next target is not another broad AO retune. The target is ground contact: confirming whether objects are actually near the ground plane, whether the ground participates in the SSAO depth path as expected, and then adding a Clay Studio-only soft contact treatment if SSAO alone is not enough.

#### Owns

- presentation ground-plane contact readability in Clay Studio
- object-to-ground height/bounds verification
- ground-plane SSAO/depth participation proof
- a Clay Studio-only soft blob/contact shadow or ultra-soft ground-shadow fallback if needed
- focused visual/runtime proof that ground contact improves without bringing back hard directional shadows

#### Does Not Own

- changing graph-authored geometry placement
- making the presentation ground plane exportable/model truth
- global shadow retuning outside Clay Studio
- new Properties controls
- SSGI, WebGPU, grain, path tracing, or render-preview changes
- broad material-system changes

#### Current Live Read

- Clay Studio forces the viewer presentation ground plane on.
- Phase 6.3 disabled hard Clay Studio shadow-map participation to remove harsh black side/bottom bands.
- The current screenshot shows mesh AO and edge depth, but little visible floor contact on the ground plane.
- Possible causes include objects not actually intersecting or sitting near the ground plane, SSAO being too weak for large flat depth relationships, or the presentation ground plane not contributing useful depth/normal data to the pass.
- The Pascal reference likely gets floor contact from real scene geometry plus global illumination/path-traced accumulation, not only screen-space AO.

#### First Pass Decisions

- Verify before adding an effect.
- Keep this Clay Studio-only.
- Prefer a soft contact-shadow layer over reintroducing hard directional shadows.
- If shadow maps are used, restrict them to an ultra-soft ground-contact contribution and keep the key-light hard-shadow look disabled.
- Keep AO presets unchanged unless the proof shows the ground-contact issue is a pass-mapping bug rather than a Clay Studio ground treatment gap.

### Phase 6.4 Implementation Spec

#### Exact First Code Cut

1. Audit `Viewer.ts` ground-plane placement, visibility, material, depth write/read behavior, render order, and SSAO composer participation.
2. Add focused proof or diagnostics for Clay Studio object bounds relative to `ground.height`.
3. Confirm whether the ground plane is present in the post-process scene pass and whether its material participates in depth normally.
4. If objects are floating, decide whether Clay Studio should visually contact their bounds with the presentation ground without mutating graph geometry.
5. If SSAO cannot provide readable ground contact, add a Clay Studio-only soft contact treatment:
   - preferred first option: a subtle transparent radial/blob contact shadow projected under visible mesh bounds
   - alternative option: an ultra-soft ground-only shadow setup that does not bring back hard key-light side shadows
6. Keep the treatment presentation-only and disabled outside Clay Studio.
7. Add focused viewer proof that:
   - Clay Studio ground contact is enabled only in Clay Studio
   - non-Clay rendered shadows/ground behavior are unchanged
   - render preview remains separate
   - overlay/selection behavior stays on top of any contact treatment
8. Run browser screenshot sanity for Clay Studio AO `Off` and `High` with ground contact visible.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/viewer/postProcessingRuntime.ts` only if ground participation proves to be a composer/pass issue
- docs closeout files after implementation

#### No-Widening Rule

Do not add UI controls, change authored geometry height, create exportable floor geometry, change non-Clay lighting, reintroduce harsh shadows, or start SSGI/WebGPU work.

#### Implementation Risks

- masking actual geometry-height issues with a fake shadow
- adding a contact layer that fights selection, hover, sketch overlays, or edge display
- making the ground look dirty instead of softly anchored
- reintroducing the harsh directional-shadow problem Phase 6.3 removed
- making contact shadows too expensive on large scenes

#### Checklist

- [x] Audit ground-plane depth/material/post-process participation.
- [x] Verify object bounds relative to the presentation ground plane.
- [x] Decide whether SSAO is insufficient or misconfigured for ground contact.
- [x] Add Clay Studio-only soft contact treatment if needed.
- [x] Preserve non-Clay ground/shadow behavior.
- [x] Preserve render-preview separation and overlay readability.
- [x] Add focused viewer proof.
- [ ] Run browser screenshot sanity for Clay Studio AO `Off` and `High`.

#### Verification Shape

- focused viewer tests
- browser screenshot sanity
- production build
- `git diff --check`

#### Done Shape

Phase 6.4 is done when Clay Studio objects visibly anchor to the presentation ground plane with soft contact depth, without bringing back harsh directional shadows or changing graph/material/export truth.

#### Implementation Result

Shipped on 2026-05-20 19:35:44.

- Clay Studio now owns a presentation-only contact-shadow group projected onto the viewer ground plane under visible base meshes.
- The treatment uses stacked translucent ellipse meshes with muted gray material, no depth writes, and a small ground offset so the ground reads anchored without hard directional shadows.
- The contact layer is disabled and cleared outside Clay Studio, including normal `Rendered` and `Render Preview`.
- The viewer disposes cloned contact-shadow materials, shared geometry, and template materials through the existing lifecycle.
- Focused viewer proof confirms the contact layer appears only in Clay Studio, preserves the Clay Studio material/light/ground behavior, and clears when returning to non-Clay rendered mode.
- Browser smoke confirmed the dev build opens the Model Viewport with visible canvas surfaces; exact AO `Off`/`High` screenshot comparison remains for later visual QA.

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
