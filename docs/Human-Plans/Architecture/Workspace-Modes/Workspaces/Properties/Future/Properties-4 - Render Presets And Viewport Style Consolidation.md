# Properties-4 - Render Presets And Viewport Style Consolidation

## Doc Header

### Doc History
13. 2026-05-21 09:22:52: Recorded the shipped `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` implementation after contact shadows moved into neutral saved render settings, Properties `Render > Shadows` controls, built-in preset recipe writes, and viewer setting consumption.
12. 2026-05-21 09:13:14: Prepped `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` for implementation as a contact-shadow extraction slice, grounding the next code cut in a neutral `ViewSettings.contactShadows` contract, Properties `Render > Shadows` controls, built-in preset recipe writes, viewer consumption, and focused Properties/store/viewer proof.
11. 2026-05-21 09:10:13: Implemented `Properties-4 / Phase 4 - Remaining Render Presentation Contracts` as a docs-only contract matrix, classifying the remaining hidden presentation ingredients and selecting `Contact Shadows` as the first `Properties-4 / Phase 4.1` extraction target.
10. 2026-05-21 09:07:24: Revised `Properties-4 / Phase 4` so this Properties-4 doc owns the remaining render-setting extraction ladder, adding `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` as the follow-up implementation slice instead of relying on `Properties-5`.
9. 2026-05-21 09:02:03: Prepped `Properties-4 / Phase 4 - Remaining Render Presentation Contracts` as a bounded contract-classification implementation slice that inventories the remaining runtime-only presentation values, decides which ones should become neutral Properties `Render` settings versus runtime implementation details, and hands actual new feature/control work into `Properties-5` phases instead of widening this preset-consolidation doc.
8. 2026-05-21 08:55:50: Refined the shipped Phase 3 render-control layout by moving the visible Ambient Occlusion control from `Viewport Presentation` into the `Shadows` group so hard shadows and screen-space shadow/contact-depth tuning read together in Properties `Render`.
7. 2026-05-21 08:49:27: Implemented `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` by expanding built-in render-preset recipes into visible saved Properties `Render` values, keeping neutral render controls editable after preset application, and changing the viewer to consume saved environment grade, hard shadows, ground visibility, and grid visibility instead of preset-identity branches for those values.
6. 2026-05-21 08:39:12: Re-prepped `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` around neutral render settings first and preset recipes second, replacing the Clay Studio override-extraction framing with a model where built-in presets apply visible values for normal Properties `Render` controls and the viewer consumes those settings regardless of preset identity.
5. 2026-05-21 08:26:39: Prepped `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` for implementation against the shipped Phase 2 helper path and current Properties `Render` controls, narrowing the first recipe-value cut to built-in preset settings that already have visible controls: Environment Grade, hard shadows, Ground enabled/height, Grid visibility/presentation, and Ambient Occlusion / post-processing, while deferring Clay Studio material override, background, lighting rig, edge styling, and contact-shadow rings to later explicit contracts.
4. 2026-05-21 08:21:41: Implemented `Properties-4 / Phase 2 - Shared Built-In Preset Selection Path` by adding legacy-backed render-preset helpers around `ViewSettings.viewportStyle`, exposing separate Properties `Render` `Display Mode` and `Render Preset` controls, routing Shift+D and Properties Clay Studio selection through the same helper, and changing normal Shift+D display-mode choices so they no longer clear preset-owned render settings.
3. 2026-05-21 08:10:51: Prepped `Properties-4 / Phase 2 - Shared Built-In Preset Selection Path` for implementation against the live Shift+D hook, ViewerHost menu, Properties Render section, shared `ViewSettings` contracts, and focused tests, narrowing the first runtime cut to a legacy-backed `Render Preset` helper, a visible Properties `Display Mode` select, `Viewport Style` label migration, and removal of the Shift+D normal-display-mode reset that currently wipes preset-owned render settings.
2. 2026-05-21 08:06:38: Implemented `Properties-4 / Phase 1 - Preset Inventory And Vocabulary` as a docs-only source inventory, clarifying that `Clay Studio` should become a render-preset recipe made from normal Properties `Render` settings rather than a separate display mode, that Shift+D should quick-apply display-mode and render-preset settings without hiding their ingredients, and that the next implementation phase should split `Display Mode` from `Render Preset` instead of preserving the current Clay Studio-only rendered-mode coupling.
1. 2026-05-21 07:49:21: Added this future planning doc after the user clarified that Shift+D viewport styles should become render-setting presets whose values are visible and editable in Properties `Render`, with `Standard`, `Clay Studio`, and later custom presets all flowing through one shared preset application/read model instead of hidden viewer-only overrides.

### Purpose

This doc plans the next `Properties` render/presentation family phase after `Properties-3`.

Use it to:
- consolidate the Shift+D display/style menu and Properties `Render > Viewport Style` select
- turn viewport styles into explicit render-setting presets
- make preset-applied values visible in Properties `Render` in real time
- retire hidden Clay Studio viewer overrides only after the equivalent settings have a visible owner
- create the path toward `Rendered (Custom)` and later user-defined render presets

Do not use it to:
- change graph geometry, modeled content, sketch grids, or export truth
- make render presets rebuild geometry
- make custom preset storage before the preset read/apply model is honest
- collapse display modes and render presets into one ambiguous setting

## Doc Body

### Live Starting Point

The current runtime has two related but not-equivalent entry points:

- Shift+D opens the viewer display-mode menu.
  - choosing a normal display mode sets `viewportStyle: 'standard'`
  - choosing `Clay Studio` sets `viewportStyle: 'clayStudio'` and forces `displayMode: 'rendered'`
- Properties `Render > Viewport Style` writes only `ViewSettings.viewportStyle`.
  - it does not force `displayMode: 'rendered'`
  - it can therefore select `Clay Studio` while Clay Studio is not visually active if the display mode is not rendered

The viewer currently treats Clay Studio as active only when:
- `viewportStyle === 'clayStudio'`
- the resolved display mode is `rendered`
- render preview is not active

When active, Clay Studio currently applies hidden viewer-owned overrides:
- hides grid visually
- hides axes visually
- disables rendered hard shadows
- forces ground visible
- uses Clay Studio ground material
- uses Clay Studio object material instead of saved material assignments
- uses Clay Studio environment grade
- uses Clay Studio background color
- uses Clay Studio lighting rig
- adds Clay Studio contact-shadow presentation
- changes display-edge overlay color and opacity

Some of those values now have visible Properties controls:
- Environment Grade
- Shadows
- Ground
- Grid
- Ambient Occlusion / post-processing
- Render Preview quality

Some still do not:
- environment background color/source preset details
- environment light preset rig as a preset package
- Clay Studio material override
- Clay Studio edge overlay styling
- Clay Studio contact-shadow policy and tuning
- preset identity/read state such as `Rendered`, `Clay Studio`, `Rendered (Custom)`, or user custom presets

### Product Direction

`Viewport Style` should become `Render Preset` language, and `Clay Studio` should become a preset recipe made from normal render settings instead of a separate viewer mode.

The user-facing model should be:
- Shift+D is a quick-access surface for display mode and render-preset choices.
- Properties `Render` is the full visible surface for the same ingredients.
- Display Mode remains an editable setting:
  - `Wireframe`
  - `Solid`
  - `Material`
  - `Rendered`
  - `Render Preview`
- Render Preset is a saved recipe of render/presentation settings.
- `Clay Studio` is one built-in recipe, not a special sibling to `Wireframe`, `Solid`, or `Material`.
- A user should be able to start in `Wireframe`, tune Properties `Render` settings enough to look like a clay-studio presentation, and later save that as a custom preset.
- Selecting a preset applies the settings that make that preset true.
- The controls below the preset select visibly update as the preset is applied.
- Editing any preset-owned setting can move the preset read into a custom state.
- Later, users can save a custom preset starting from `Rendered`, `Clay Studio`, or another built-in preset.

Suggested naming:
- use `Display Mode` for the base drawing method:
  - `Solid`
  - `Material`
  - `Wireframe`
  - `Rendered`
  - `Render Preview`
- rename or reinterpret `Viewport Style` as `Render Preset`:
  - `Rendered`
  - `Clay Studio`
  - later custom presets

Important distinction:
- display mode decides how geometry is drawn
- render preset applies a bundle of render/presentation settings
- both can live in Shift+D, but they should not be stored or reasoned about as one blurry setting
- normal display-mode changes should not silently discard preset-owned render settings
- a built-in preset may choose a default display mode when applied, but the preset's ingredients should remain visible and editable afterward

## Vision

Render presets should become visible, editable starting points for viewer presentation.

The healthy end state:
- Shift+D and Properties call the same preset selection code
- Properties `Render` is the visible read/edit surface for preset-owned values
- preset selection writes or overlays explicit setting values instead of relying on unreachable viewer constants
- hidden viewer overrides shrink over time to only true runtime implementation details
- custom preset reads can emerge from the same comparison model used for built-in presets

This preserves the larger project vision:
- viewer presentation stays downstream from authored geometry truth
- render presets remain rebuild-free presentation state
- `Properties` can host render controls without becoming the owner of geometry or export behavior
- shared contracts replace one-off menu behavior

## Wishlist Organization

### High Level Goals

- [ ] `Properties-4-HLG-1. Shift+D quick choices and Properties Render controls should share one vocabulary for Display Mode and Render Preset instead of two similar controls with different side effects.`
- [ ] `Properties-4-HLG-2. Render presets should become visible render-setting recipes whose affected values can be watched and edited in Properties Render.`
- [ ] `Properties-4-HLG-3. Runtime presentation values should move into neutral Properties Render settings once each value has a visible setting or explicit preset contract.`
- [ ] `Properties-4-HLG-4. The system should support custom preset reads such as Rendered (Custom) and later user-saved presets built from existing starting points.`
- [ ] `Properties-4-HLG-5. Render presets must stay presentation-only and must not change graph geometry, sketch truth, material authoring truth, or export output.`

### `Properties-4 / Phase 1`

- [x] Inventory every live Shift+D display-mode and viewport-style effect.
- [x] Separate display-mode effects from render-preset effects.
- [x] Define the first render-preset vocabulary and read model.
- [x] Decide whether the visible select label should remain `Viewport Style` for now or move toward `Render Preset`.
- [x] `Properties-4-HLG-1`
- [x] `Properties-4-HLG-2`
- [x] `Properties-4-HLG-5`

### `Properties-4 / Phase 2`

- [x] Add shared render-preset definitions for `Standard` / `Rendered` and `Clay Studio`.
- [x] Add one helper for applying a preset recipe to saved view settings.
- [x] Route Shift+D preset choices and Properties preset choices through the same helper.
- [x] Split Display Mode from Render Preset so normal display-mode changes do not silently reset preset-owned render settings.
- [x] Add focused tests proving Shift+D and Properties produce the same state.
- [x] `Properties-4-HLG-1`
- [x] `Properties-4-HLG-2`
- [x] `Properties-4-HLG-5`

### `Properties-4 / Phase 3`

- [x] Make the existing Properties controls visibly reflect preset-applied values.
- [x] Move the first safe preset-applied values into explicit saved settings where matching controls already exist.
- [x] Start with Environment Grade, Shadows, Ground, Grid, and Ambient Occlusion / post-processing.
- [x] Keep runtime-only presentation behavior hidden until it has neutral visible controls or a dedicated contract.
- [x] `Properties-4-HLG-2`
- [x] `Properties-4-HLG-3`
- [x] `Properties-4-HLG-5`

### `Properties-4 / Phase 4`

- [ ] Add visible render-setting surfaces or explicit contracts for remaining runtime presentation values.
- [ ] Cover background, lighting rig, material override, edge overlay styling, and contact-shadow policy.
- [ ] Retire viewer constants only after their replacement setting/preset path is proven.
- [ ] Keep object material authoring truth separate from temporary presentation material override.
- [ ] `Properties-4-HLG-2`
- [ ] `Properties-4-HLG-3`
- [ ] `Properties-4-HLG-5`

### `Properties-4 / Phase 5`

- [ ] Add preset match/divergence reads.
- [ ] Show `Rendered`, `Clay Studio`, or `Custom` style labels from the current settings.
- [ ] Support `Clay Studio (Custom)` / `Rendered (Custom)` read language if the previous selected preset is known.
- [ ] Do not add saved custom preset management yet unless the read model is stable.
- [ ] `Properties-4-HLG-4`
- [ ] `Properties-4-HLG-5`

### `Properties-4 / Phase 6`

- [ ] Add first user custom preset management if the built-in preset model is stable.
- [ ] Allow saving the current render settings as a named preset.
- [ ] Allow applying a saved custom preset through the same Shift+D / Properties shared path.
- [ ] Decide later whether custom presets are user prefs, project state, or authored content.
- [ ] `Properties-4-HLG-4`
- [ ] `Properties-4-HLG-5`

## [x] `Properties-4 / Phase 1` - `Preset Inventory And Vocabulary`

### Phase 1 Summary

Create the source-grounded inventory that separates display modes from render presets.

This phase should not change runtime behavior. It should document and test-read the live behavior enough to prepare the shared preset contract.

### Phase 1 Inventory Result

#### Live Shift+D Path

Shift+D currently opens one visual menu that mixes three ideas:

- Display Mode choices:
  - `Solid`
  - `Wireframe`
  - `Material`
  - `Rendered`
  - `Render Preview`
- Edge Display Mode choices:
  - `Edges on`
  - `Edges off`
  - `Visible edges only`
- Viewport Style choice:
  - `Clay Studio`

Current Shift+D behavior:
- choosing any normal display mode writes `displayMode` and resets `viewportStyle` to `standard`
- choosing `Clay Studio` writes `viewportStyle: 'clayStudio'` and forces `displayMode: 'rendered'`
- choosing an edge display mode writes only `edgeDisplayMode`

This means the current code treats `Clay Studio` like a special mode even though the desired product vocabulary is that `Clay Studio` is a render-preset recipe.

#### Live Properties Render Path

Properties `Render` currently has:

- `Viewport Style`
  - writes only `ViewSettings.viewportStyle`
  - does not force `displayMode: 'rendered'`
- `Ambient Occlusion`
  - writes `ViewSettings.postProcessing`
- `Environment`
  - exposes grade sliders in Standard mode
  - locks grade sliders in Clay Studio
- `Shadows`
  - exposes saved hard-shadow and selected-light shadow controls in Standard mode
  - locks hard-shadow controls in Clay Studio
- `Ground`
  - exposes saved ground visibility, height, and material in Standard mode
  - locks ground controls in Clay Studio
- `Grid`
  - exposes saved grid visibility, height, size, and three grid layers in Standard mode
  - locks grid controls in Clay Studio
- `Render Preview Quality`
  - exposes render-preview settings

The mismatch is still live:
- Shift+D `Clay Studio` also changes `displayMode`
- Properties `Viewport Style -> Clay Studio` only changes `viewportStyle`

#### Live Viewer Effect Inventory

Current display-mode effects:

- `displayMode: 'solid'`
  - uses solid inspection material
  - uses display-mode wireframe only if resolved wireframe is active
  - does not show rendered-only ground or hard shadows
- `displayMode: 'wireframe'`
  - resolves mesh materials to wireframe presentation
  - makes edge overlays visible through the wireframe path
  - does not show rendered-only ground or hard shadows
- `displayMode: 'material'`
  - uses material-mode material cache
  - uses material-mode neutral inspection light
  - suppresses normal environment lighting/background behavior
  - uses material-mode environment grade
  - does not show rendered-only ground or hard shadows
- `displayMode: 'rendered'`
  - uses saved material assignments
  - can use saved hard shadows
  - can use saved ground
  - can use saved environment/background/lighting
- `displayMode: 'renderPreview'`
  - resolves internally as rendered for some presentation reads
  - runs render-preview runtime
  - suppresses Clay Studio activation
  - bypasses SSAO post-processing runtime

Current Clay Studio effects:

- active only when `viewportStyle === 'clayStudio'`, resolved display mode is `rendered`, and render preview is not active
- hides visible model grid
- hides axes helper
- disables rendered hard shadows
- forces ground visible while preserving saved ground height
- uses Clay Studio ground material
- uses Clay Studio object material override
- uses Clay Studio environment grade
- uses Clay Studio background color
- uses Clay Studio lighting rig
- adds soft contact-shadow rings under visible meshes
- changes edge overlay color and opacity

Current Ambient Occlusion / SSAO behavior:

- SSAO is owned by `ViewSettings.postProcessing`
- Clay Studio does not have a separate saved AO preset today
- Clay Studio's soft grounding comes from custom contact-shadow rings, not from a Clay-only SSAO contract

#### Vocabulary Decision

Use this vocabulary for the next implementation phases:

- `Display Mode`
  - the base drawing method
  - examples: `Wireframe`, `Solid`, `Material`, `Rendered`, `Render Preview`
  - should be visible in Properties `Render`
- `Render Preset`
  - a named recipe of render/presentation settings
  - examples: `Standard`, `Clay Studio`, later user presets
  - replaces user-facing `Viewport Style` language over time
- `Render Settings`
  - the editable ingredients below the preset
  - examples: Ambient Occlusion, Environment Grade, Background, Lighting, Hard Shadows, Contact Shadows, Ground, Grid, Axes, Presentation Material, Edge Styling, Render Preview quality

Important product decision:
- `Clay Studio` should not stay a separate special mode from `Solid`, `Material`, or `Wireframe`.
- `Clay Studio` should be reproducible by editing Properties `Render` settings.
- A preset may apply a default display mode, but Display Mode remains an editable setting after the preset is applied.
- Shift+D can remain a fast chooser, but the settings it applies should be visible in Properties `Render`.

#### Phase 2 Handoff

The next implementation phase should:

- rename the visible Properties control from `Viewport Style` toward `Render Preset`
- add or expose `Display Mode` in Properties `Render > Viewport Presentation`
- stop normal Shift+D display-mode choices from automatically wiping preset-owned render settings
- route Shift+D `Clay Studio` and Properties `Render Preset -> Clay Studio` through one helper
- keep the first helper narrow enough that it applies only the shared selection state, leaving deeper Clay Studio setting extraction to later phases
- prioritize extracting hard shadows and soft contact shadows into Properties `Render > Shadows` as the first Clay Studio recipe ingredients after the shared selection path is honest

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Read the current Shift+D menu path.
   - `src/app/useViewerDisplayModeMenu.ts`
   - `src/app/components/ViewerHost.tsx`
   - `src/app/inputRouting.ts`
2. Read the current Properties preset path.
   - `src/app/workspace/PropertiesRenderSection.tsx`
3. Read the current viewer runtime effects.
   - `src/viewer/Viewer.ts`
   - focus `resolveClayStudioActive(...)`, `resolveDisplayModeGroundSettings(...)`, `resolveDisplayModeEnvironmentGrade(...)`, `applyDisplayModeLights(...)`, grid/axes visibility, material resolution, edge styling, contact shadows, and post-processing runtime state
4. Add a compact inventory section to this doc or a follow-up note in this doc.
5. Decide the first naming bridge:
   - keep UI label `Viewport Style` while internals move to `renderPreset`
   - or rename the Properties label to `Render Preset` in the implementation phase

#### Boundaries

- no runtime behavior changes
- no new settings fields unless required for inventory tests
- no removal of Clay Studio viewer overrides yet
- no custom preset storage

#### Test Direction

No new runtime test should be required unless the inventory reveals stale assumptions. If a test is added, keep it read-only around current Shift+D and Properties state differences.

#### Done Shape

Phase 1 is done when the live preset/display-mode effects are inventoried and the next implementation phase knows exactly which fields should be controlled by a shared preset helper.

### Phase 1 Landed Read

- The inventory confirms that current Shift+D mixes Display Mode, Edge Display Mode, and Viewport Style.
- The inventory confirms that current Properties `Viewport Style` does not have the same side effects as Shift+D `Clay Studio`.
- The product vocabulary is now `Display Mode`, `Render Preset`, and `Render Settings`.
- `Clay Studio` is planned as a built-in render-preset recipe, not a separate display mode.
- Phase 2 should split Display Mode from Render Preset, expose Display Mode in Properties `Render`, route preset selection through one helper, and avoid silently clearing preset-owned render settings when display mode changes.

## [x] `Properties-4 / Phase 2` - `Shared Built-In Preset Selection Path`

### Phase 2 Summary

Make Shift+D and Properties call one shared preset selection path.

This phase should fix the current mismatch where Shift+D `Clay Studio` and Properties `Viewport Style` do not apply the same state, while beginning the vocabulary migration from `Viewport Style` to `Render Preset`.

### Phase 2 Prep Read

#### Live Code Seams

Implement against:

- `src/shared/viewSettingsTypes.ts`
  - current `ViewDisplayMode`
  - current `ViewportStyle`
  - current `VIEW_DISPLAY_MODES`
  - current `VIEWPORT_STYLE_OPTIONS`
  - candidate home for the first legacy-backed render-preset helper
- `src/app/useViewerDisplayModeMenu.ts`
  - current `selectDisplayMode(...)` writes `displayMode` and resets `viewportStyle: 'standard'`
  - current `selectViewportStyle(...)` writes `viewportStyle` and forces `displayMode: 'rendered'` for Clay Studio
- `src/app/components/ViewerHost.tsx`
  - Shift+D menu currently renders display mode options and `Clay Studio` style option in one menu
  - Phase 2 should keep this visual shape unless a tiny label tweak falls out naturally
- `src/app/workspace/PropertiesRenderSection.tsx`
  - current `Viewport Style` select writes only `viewportStyle`
  - Phase 2 should rename/bridge that visible label to `Render Preset`
  - Phase 2 should add a visible `Display Mode` select in `Render > Viewport Presentation`
- tests:
  - `src/app/useViewerDisplayModeMenu.test.tsx`
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/app/components/ViewerHost.test.tsx` if the Shift+D rendered behavior assertion needs parity updates

#### First Runtime Cut

Keep the schema migration small:

- keep `ViewSettings.viewportStyle` as the legacy backing field for now
- add render-preset naming helpers around the existing field instead of introducing a new persisted `renderPresetId` yet
- use a type alias or explicit comments if helpful, but avoid a broad storage rename in Phase 2

Suggested helper shape:

- `type RenderPresetId = ViewportStyle`
- `const VIEW_RENDER_PRESET_OPTIONS = VIEWPORT_STYLE_OPTIONS`
- `isViewRenderPresetId(...)`
- `createRenderPresetViewPatch(presetId, currentView)`
- `createDisplayModeViewPatch(displayMode)`

The helper behavior should be:

- applying `standard` / `Standard`:
  - writes `viewportStyle: 'standard'`
  - preserves the current `displayMode`
  - does not reset Environment, Shadows, Ground, Grid, Ambient Occlusion, Render Preview, or material settings
- applying `clayStudio` / `Clay Studio`:
  - writes `viewportStyle: 'clayStudio'`
  - defaults `displayMode` to `rendered` so the existing viewer Clay Studio branch still becomes visibly active
  - does not yet migrate Clay Studio constants into saved settings
- applying a normal Display Mode:
  - writes only `displayMode`
  - does not reset `viewportStyle`
  - does not reset preset-owned render settings

This deliberately means a user can apply `Clay Studio`, switch Display Mode to `Wireframe`, and keep the selected render preset identity for later custom-read work. The current viewer may not apply every Clay ingredient outside Rendered yet; later phases extract those ingredients into normal Properties settings.

#### UI Cut

Properties `Render > Viewport Presentation` should show:

- `Display Mode`
  - `Solid`
  - `Wireframe`
  - `Material`
  - `Rendered`
  - `Render Preview`
- `Render Preset`
  - `Standard`
  - `Clay Studio`

For Phase 2, do not add saved custom presets, custom labels, or preset-match readback. The visible label may be `Render Preset`; the backing field may remain `viewportStyle`.

Shift+D can keep the current visual menu shape:

- display-mode buttons still select display mode
- `Clay Studio` still appears as a quick preset button
- edge-display buttons remain separate

The behavior change is that display-mode buttons should no longer clear the selected preset field to Standard.

#### Test Prep

Update or add focused proof:

- Shift+D `Clay Studio` and Properties `Render Preset -> Clay Studio` produce the same view state:
  - `viewportStyle: 'clayStudio'`
  - `displayMode: 'rendered'`
- Shift+D normal display mode changes do not clear `viewportStyle`.
  - start with `{ displayMode: 'rendered', viewportStyle: 'clayStudio' }`
  - choose `solid`
  - expect `{ displayMode: 'solid', viewportStyle: 'clayStudio' }`
- Properties `Display Mode` select writes `displayMode`.
  - changing to `wireframe` should preserve the current `viewportStyle`
- Properties `Render Preset -> Standard` preserves current display mode and unrelated render settings.
- Existing Ambient Occlusion, Environment, Shadows, Ground, Grid, and Render Preview tests should still pass after selector-label updates.

#### Deferred Work

Do not include these in Phase 2:

- saved custom preset management
- `Rendered (Custom)` / `Clay Studio (Custom)` readback
- migrating Clay Studio grade, background, lighting, material override, edge styling, hard-shadow suppression, or contact-shadow rings into saved settings
- changing `Viewer.ts` Clay Studio activation rules beyond what the shared selection path requires
- changing graph geometry, material authoring truth, sketch grids, export behavior, or render preview runtime

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Add shared helpers near view-setting contracts or view commands.
   - suggested names:
     - `createRenderPresetViewPatch(...)`
     - `applyRenderPresetToViewSettings(...)`
     - `selectRenderPreset(...)`
     - `createDisplayModeViewPatch(...)`
2. Define first built-in presets.
   - `standard` / `rendered`
   - `clayStudio`
3. Add or expose `Display Mode` in Properties `Render > Viewport Presentation`.
4. Rename or bridge the visible Properties label from `Viewport Style` toward `Render Preset`.
5. Make `useViewerDisplayModeMenu.selectViewportStyle(...)` use the render-preset helper.
6. Make `PropertiesRenderSection.handleViewportStyleChange(...)` use the same helper.
7. Make `useViewerDisplayModeMenu.selectDisplayMode(...)` stop resetting preset-owned render settings to Standard.
8. Choose the first transition behavior for built-in Clay Studio:
   - it may default the Display Mode to `Rendered` when first applied
   - changing Display Mode afterward should not erase the recipe ingredients
   - deeper support for Clay-style settings in Wireframe/Solid/Material can land as the ingredients become explicit Properties settings
9. Add focused tests:
   - Shift+D Clay Studio and Properties Clay Studio produce equivalent view state
   - choosing a normal display mode does not silently discard preset-owned render settings
   - Properties exposes the current Display Mode read/write path
   - Properties selecting Standard does not unexpectedly destroy unrelated render settings

#### Boundaries

- do not migrate hidden Clay Studio override constants yet
- do not add custom presets
- do not change display-mode menu visuals beyond what the shared path requires
- do not rename persisted `viewportStyle` storage yet unless the implementation can keep full backward compatibility in the same small cut

#### Done Shape

Phase 2 is done when Shift+D and Properties select the same built-in preset state through one helper, Properties exposes `Display Mode` and `Render Preset` as separate controls, Clay Studio selection can no longer be visually inert because display mode stayed non-rendered, and normal display-mode changes no longer wipe preset-owned render settings.

### Phase 2 Landed Read

- `src/shared/viewSettingsTypes.ts` now exposes `RenderPresetId`, `VIEW_RENDER_PRESET_OPTIONS`, `isViewRenderPresetId(...)`, `createDisplayModeViewPatch(...)`, and `createRenderPresetViewPatch(...)` while keeping `ViewSettings.viewportStyle` as the legacy backing field.
- Shift+D normal display-mode choices now write only `displayMode`, preserving the current render preset instead of resetting it to Standard.
- Shift+D Clay Studio and Properties `Render Preset -> Clay Studio` now use the same render-preset helper and produce `viewportStyle: 'clayStudio'` plus `displayMode: 'rendered'`.
- Properties `Render > Viewport Presentation` now exposes separate `Display Mode` and `Render Preset` controls.
- The visible Properties label has moved from `Viewport Style` to `Render Preset`.
- Clay Studio ingredient extraction remains deferred; hard shadows and soft contact shadows are still the recommended first Shadows-group extraction after this shared selection contract.

## [x] `Properties-4 / Phase 3` - `Visible Preset Values For Existing Render Controls`

### Phase 3 Summary

Make built-in preset application update the already-visible Properties controls where those controls already exist.

This is the first real step toward watching the preset change the settings in real time.

### Phase 3 Prep Read

#### Live Code Seams

Implement against:

- `src/shared/viewSettingsTypes.ts`
  - current `createRenderPresetViewPatch(...)`
  - current `RenderPresetId`
  - current defaults and normalizers for `environmentGrade`, `shadowsEnabled`, `ground`, `gridVisible`, `gridPresentation`, and `postProcessing`
  - candidate home for first built-in preset recipe definitions
- `src/app/useViewerDisplayModeMenu.ts`
  - already calls `createRenderPresetViewPatch(...)`
  - should receive expanded recipe patches automatically through the helper
- `src/app/workspace/PropertiesRenderSection.tsx`
  - already calls `createRenderPresetViewPatch(...)`
  - currently contains some preset-lock copy around Environment, Shadows, Ground, and Grid
  - Phase 3 should make controls editable wherever a normal saved setting owns the value
- `src/viewer/Viewer.ts`
  - current preset-specific runtime branches still force or suppress some values even if saved settings change
  - Phase 3 should make the viewer consume neutral saved settings wherever those settings now own behavior
- tests:
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/app/useViewerDisplayModeMenu.test.tsx`
  - `src/viewer/Viewer.test.ts`
  - `src/app/store/uiPrefsStore.test.ts`

#### Neutral Settings First

Phase 3 should not extract "Clay Studio" as a special mode.

It should promote normal Properties `Render` settings as the visible ingredients that every preset writes and every user can edit:

- `Display Mode`
- `Render Preset`
- `Environment Grade`
- `Hard Shadows`
- `Ground`
- `Grid`
- `Ambient Occlusion`

Contact Shadows is the next recommended neutral Shadows setting, but it is not yet an existing visible control. Treat the current soft rings as one future value of a normal `Contact Shadows` control, not as a Clay-only concept to preserve.

#### First Recipe Values

Add built-in preset recipe values only for fields with visible controls today. The recipe names are examples of starting points; the saved settings remain the owner after application.

`Standard` should:
- write `viewportStyle: 'standard'`
- preserve current `displayMode`
- apply standard saved values for the first exposed preset-owned fields:
  - `environmentGrade`: default view environment grade
  - `shadowsEnabled`: default hard-shadow state
  - `ground`: default ground settings
  - `gridVisible`: default grid visibility
  - `gridPresentation`: default grid presentation
  - `postProcessing`: default Ambient Occlusion / post-processing settings
- preserve unrelated settings:
  - lighting
  - environment source/background
  - materials
  - render-preview quality
  - edge display mode
  - axes/axis overlay

`Clay Studio` should apply one built-in recipe:
- write `viewportStyle: 'clayStudio'`
- default `displayMode` to `rendered`
- apply the first visible preset values:
  - `environmentGrade`: the current `Viewer.ts` `CLAY_STUDIO_ENVIRONMENT_GRADE` values
  - `shadowsEnabled`: `false`
  - `ground.enabled`: `true`
  - `ground.height`: preserve the current saved height unless a later product choice says the preset should snap to zero
  - `ground.materialPresetId`: preserve current saved material for Phase 3 because presentation-material override is not yet a neutral editable setting
  - `gridVisible`: `false`
  - `gridPresentation`: preserve current grid presentation values while turning the visible grid off
  - `postProcessing`: choose one visible Ambient Occlusion preset value, with `medium` as the recommended first cut because the current soft contact feel comes mostly from contact-shadow presentation, not heavy SSAO

#### Neutral Runtime Ownership

Once Phase 3 moves a value into a visible saved setting, the viewer should read that setting instead of branching on preset identity for that value.

Move these behaviors to neutral saved settings:

- Environment Grade:
  - `resolveDisplayModeEnvironmentGrade(...)` should stop returning a hard-coded preset grade once the preset writes that grade into `ViewSettings.environmentGrade`
  - material mode can keep its material-mode grade override
- hard shadows:
  - `resolveDisplayModeShadowsEnabled(...)` should read `ViewSettings.shadowsEnabled`
  - the preset-applied `shadowsEnabled: false` should own the default
- ground visibility:
  - `resolveDisplayModeGroundSettings(...)` should read `ViewSettings.ground.enabled`
  - the preset-applied `ground.enabled: true` should own the default
- grid visibility:
  - the viewer should stop hiding grid solely because a preset is active once `gridVisible: false` is preset-applied
  - the preset-applied `gridVisible: false` should own the default

Keep these runtime-only values for later phases until each has a neutral setting or explicit contract:

- presentation ground material
- object presentation material
- background color/source
- lighting rig
- edge overlay color/opacity
- soft contact-shadow rings
- axes helper suppression, unless Phase 3 explicitly adds an `Axes` visible render setting

#### Properties UI Policy

Once Phase 3 moves a value into saved preset-applied settings, that control should stay editable for any display mode or built-in preset unless there is a narrower reason to disable it.

Unlock in Phase 3:
- Environment Grade sliders
- hard-shadow `Shadows` select
- selected-light shadow controls only if hard shadows are no longer preset-locked; do not change selected light values as part of preset application
- Ground `Ground` and `Ground Height`
- Grid `Grid`, `Grid Height`, `Grid Size`, and grid layer controls
- Ambient Occlusion already stays editable

Keep locked or hidden only where the value still has no visible setting owner:
- no contact-shadow controls yet
- no presentation-material override controls yet
- no background color/source recipe controls yet
- no lighting-rig recipe controls yet
- no edge styling controls yet

Readback copy should change from `Preset Locked` toward `Preset Applied` or normal setting copy where the saved values now own behavior. Avoid copy that implies Clay Studio itself owns the value.

#### Test Prep

Add or update focused proof:

- selecting a built-in preset from Properties visibly changes saved settings:
  - `viewportStyle: 'clayStudio'`
  - `displayMode: 'rendered'`
  - `environmentGrade` equals the preset recipe grade
  - `shadowsEnabled` is `false`
  - `ground.enabled` is `true`
  - `gridVisible` is `false`
  - `postProcessing` equals the chosen Ambient Occlusion recipe
- selecting `Standard` from Properties applies Standard visible recipe values while preserving unrelated settings.
- selecting the same preset from Shift+D applies the same visible recipe values as Properties.
- after selecting a built-in preset, Environment Grade, Shadows, Ground, and Grid controls are editable where Phase 3 moved the values into saved settings.
- viewer tests prove neutral saved settings win after preset application:
  - a rendered view can show hard shadows if saved `shadowsEnabled` is turned back on
  - a rendered view can show ground off if saved `ground.enabled` is turned off
  - a rendered view can show grid if saved `gridVisible` is turned back on
  - the viewer uses saved `environmentGrade`

#### Deferred Work

Do not include these in Phase 3:

- contact-shadow settings or sliders
- hard-shadow/contact-shadow split beyond using existing `shadowsEnabled`
- presentation material settings
- presentation ground material editing
- background/source controls
- lighting rig controls
- edge overlay styling controls
- `Rendered (Custom)` / `Clay Studio (Custom)` readback
- saved custom presets
- persisted `renderPresetId` storage rename
- graph geometry, sketch truth, material authoring truth, export behavior, or render-preview runtime changes

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Extend built-in preset definitions with explicit saved values for settings already exposed in Properties:
   - `environmentGrade`
   - `shadowsEnabled`
   - `ground`
   - `gridVisible`
   - `gridPresentation`
   - `postProcessing`
2. When a preset is selected, apply those values to `ViewSettings`.
3. Keep a minimal `viewportStyle` or `renderPresetId` identity field only if needed for readback.
4. Update Properties readback:
   - controls should show the actual saved values after preset selection
   - locked copy should only remain for values still hidden/runtime-owned
5. Add tests proving selecting built-in presets visibly changes the existing Properties controls.

#### Boundaries

- do not move presentation material, lighting rig, edge styling, background, or contact shadows unless the phase explicitly exposes a neutral setting for them
- do not remove viewer fallbacks until all equivalent saved settings exist
- do not mutate graph/material authoring truth

#### Done Shape

Phase 3 is done when the existing Properties controls visibly reflect the first built-in render preset values and the viewer consumes neutral saved settings for those values regardless of which preset last applied them.

### Phase 3 Landed Read

- Built-in render-preset application now writes saved visible recipe values for `environmentGrade`, `shadowsEnabled`, `ground`, `gridVisible`, `gridPresentation`, and `postProcessing`.
- `Clay Studio` applies one built-in recipe through the shared helper: rendered display mode, Clay grade values, hard shadows off, ground on while preserving height/material, grid off while preserving presentation layers, and Ambient Occlusion `Medium`.
- `Standard` applies the default visible render recipe while preserving the current display mode.
- Properties `Render` controls for Environment Grade, Shadows, Ground, Grid, and Ambient Occlusion stay editable after a preset is applied.
- Ambient Occlusion now lives in the `Shadows` group with hard shadows and selected-light shadow controls.
- The viewer now consumes saved environment grade, saved hard-shadow state, saved ground visibility, and saved grid visibility for rendered preset views instead of forcing those values from preset identity.
- Runtime-only presentation values remain intentionally deferred: presentation material, presentation ground material, background, lighting rig, edge styling, contact-shadow controls, axes suppression, custom readback, saved custom presets, and storage renaming.

## [x] `Properties-4 / Phase 4` - `Remaining Render Presentation Contracts`

### Phase 4 Summary

Classify the remaining runtime-only presentation values into explicit contracts before adding new controls.

This phase should not try to implement every remaining Render feature at once. It should make the hidden pieces legible, decide which pieces need neutral setting owners, and split the extraction work into follow-up `Properties-4` sub-phases, starting with `Properties-4 / Phase 4.1`.

### Phase 4 Prep Read

#### Why This Phase Exists

Phase 3 moved the first visible preset ingredients into normal saved settings:

- Environment Grade
- hard shadows
- Ground visibility
- Grid visibility
- Ambient Occlusion / post-processing

The remaining presentation values are still partly runtime-owned by `Viewer.ts` and partly conceptual. If they are implemented directly from the current hidden constants, the system will slide back toward treating `Clay Studio` as a special mode.

Phase 4 should keep the vocabulary honest:

- `Presentation Material` is a neutral setting family.
- `Presentation Ground Material` is a neutral setting family or a sub-setting of Ground.
- `Background` is a neutral Environment/Background setting family.
- `Lighting Preset` is a neutral Environment/Lighting setting family.
- `Edge Styling` is a neutral presentation setting family.
- `Contact Shadows` is a neutral Shadows setting family.
- `Axes` visibility is a neutral viewport presentation setting if it becomes user-controlled by presets.

Clay Studio can apply values for those settings later, but it should not own the concepts.

#### Live Code Seams To Inventory

Implementation should inventory, not mutate, these seams:

- `src/viewer/Viewer.ts`
  - `CLAY_STUDIO_DISPLAY_MODE_MATERIAL`
  - `CLAY_STUDIO_GROUND_MATERIAL`
  - `CLAY_STUDIO_ENVIRONMENT_BACKGROUND`
  - `CLAY_STUDIO_LIGHTS`
  - `CLAY_STUDIO_EDGE_COLOR`
  - `CLAY_STUDIO_EDGE_XRAY_OPACITY`
  - `CLAY_STUDIO_EDGE_VISIBLE_OPACITY`
  - `CLAY_STUDIO_CONTACT_SHADOW_*`
  - `resolveClayStudioActive(...)`
  - `applyEnvironmentSource(...)`
  - `applyDisplayModeLights(...)`
  - `applyGroundSettings(...)`
  - `syncClayStudioContactShadows(...)`
  - edge-overlay material/styling paths
- `src/shared/viewSettingsTypes.ts`
  - current `ViewSettings` fields
  - current render-preset helper
  - current neutral setting gaps
- `src/app/workspace/PropertiesRenderSection.tsx`
  - current section order
  - current visible render controls
  - places where new controls would eventually belong
- docs:
  - this `Properties-4` doc
  - `Properties-Gen1-Index.md`

#### Contract Classification Buckets

Use these buckets for each remaining value:

- `Neutral Setting Needed`
  - the user should eventually see and edit it in Properties `Render`
  - presets should later write values for it
- `Runtime Detail`
  - implementation detail that should not become a user-facing setting yet
  - should be documented so it is not mistaken for a preset-owned setting
- `Properties-4 Extraction Candidate`
  - should become a real neutral `Properties > Render` control in this preset-consolidation ladder
  - should be ordered into `Properties-4.1`, `Properties-4.2`, or later `Properties-4` sub-phases
- `Do Not Author`
  - should stay out of graph geometry, material truth, export truth, or project authored content

#### Recommended First Classification

- `Presentation Material`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: object inspection material is presentation-only and must stay separate from real Materials authoring truth
- `Presentation Ground Material`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: current Ground material control edits saved ground material, but Clay-style ground material is a presentation recipe value that may need a clearer setting/recipe contract
- `Background`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: background color/source should belong to Environment/Background, not a Clay-specific viewer branch
- `Lighting Preset`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: lighting rigs should become selectable/readable presentation lighting settings before built-in presets write them
- `Edge Styling`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: edge color/opacity controls should be normal presentation settings if they become user-authored
- `Contact Shadows`
  - bucket: `Neutral Setting Needed`, `Properties-4 Extraction Candidate`
  - reason: current soft rings should become one possible value of a neutral Shadows/Contact Shadows setting
- `Axes suppression`
  - bucket: `Neutral Setting Needed` only if presets should control axes; otherwise `Runtime Detail`
  - reason: axes may remain a viewport helper preference rather than a render-preset ingredient

### Phase 4 Implementation Spec

#### Exact First Code Cut

This should be a docs-only implementation pass unless the user explicitly widens it.

1. Add a `Remaining Presentation Contract Matrix` section to this doc.
2. For each remaining runtime-only value, record:
   - current live owner
   - current visible user control, if any
   - recommended neutral setting family
   - which `Properties-4` extraction sub-phase should own it
   - whether presets should later write it
   - what must stay out of authored geometry/material/export truth
3. Add at least one follow-up `Properties-4` sub-phase when a classified value is ready for extraction.
4. Update the family index with the Phase 4 landed read.
5. Add `docs/Doc-Log.md`.

#### Expected Matrix Rows

Include at least:

- presentation object material
- presentation ground material
- background color/source behavior
- lighting rig/preset
- edge overlay color
- edge overlay opacity
- contact-shadow enabled/type
- contact-shadow strength/opacity
- contact-shadow spread/radius
- contact-shadow height fade
- axes visibility/suppression policy

#### Boundaries

- do not add new runtime controls in this phase unless the user explicitly asks
- do not make Clay Studio presentation material edit real material presets
- do not put contact shadows into modeled geometry
- do not change export truth
- do not make lighting rows broader than needed for preset visibility
- do not add saved custom preset management
- do not collapse `Display Mode` and `Render Preset`
- do not mark a remaining value "done" just because it is inventoried
- do not rely on `Properties-5` for this preset-extraction ladder

#### Done Shape

Phase 4 is done when the remaining runtime-only presentation values are explicitly classified, each has a recommended neutral setting family or runtime-detail status, and the next control-building work is captured as `Properties-4` follow-up phases instead of living as hidden viewer constants.

### Remaining Presentation Contract Matrix

| Runtime Value | Current Live Owner | Visible Control Today | Neutral Setting Family | Extraction Owner | Presets Write Later | Authored Truth Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Presentation object material | `Viewer.ts` `CLAY_STUDIO_DISPLAY_MODE_MATERIAL`, display-mode material application | No direct Properties control | `Render > Surface Presentation` | `Properties-4 / Phase 4.3` candidate | Yes | Must not edit real material presets, per-part material assignments, graph geometry, or export truth |
| Presentation ground material | `Viewer.ts` `CLAY_STUDIO_GROUND_MATERIAL`, `applyGroundSettings(...)` Clay branch | Ground material control exists, but Clay branch overrides it | `Render > Ground` presentation material | `Properties-4 / Phase 4.4` candidate | Yes | Must not make Clay ground override the authored material system or modeled geometry |
| Background color/source behavior | `Viewer.ts` `CLAY_STUDIO_ENVIRONMENT_BACKGROUND`, `applyEnvironmentSource(...)` Clay branch | Environment grade is visible; background color/source is not | `Render > Environment > Background` | `Properties-4 / Phase 4.2` candidate | Yes | Must stay viewer presentation, not graph content or export background truth |
| Lighting rig/preset | `Viewer.ts` `CLAY_STUDIO_LIGHTS`, `applyDisplayModeLights(...)` Clay branch | Selected-light controls exist; preset-level lighting rig control does not | `Render > Environment > Lighting` | `Properties-4 / Phase 4.5` candidate | Yes | Must not mutate authored scene lights beyond saved presentation lighting settings |
| Edge overlay color | `Viewer.ts` `CLAY_STUDIO_EDGE_COLOR`, `applyEdgeOverlayPresentation(...)` | Edge display mode exists; color control does not | `Render > Edges` | `Properties-4 / Phase 4.6` candidate | Yes | Must stay overlay presentation, not topology geometry or selection truth |
| Edge overlay opacity | `Viewer.ts` `CLAY_STUDIO_EDGE_XRAY_OPACITY`, `CLAY_STUDIO_EDGE_VISIBLE_OPACITY`, `applyEdgeOverlayPresentation(...)` | Edge display mode exists; opacity control does not | `Render > Edges` | `Properties-4 / Phase 4.6` candidate | Yes | Must stay overlay presentation, not topology geometry or selection truth |
| Contact-shadow enabled/type | `Viewer.ts` `syncClayStudioContactShadows(...)`, `CLAY_STUDIO_CONTACT_SHADOW_RINGS` | No visible contact-shadow control | `Render > Shadows > Contact Shadows` | `Properties-4 / Phase 4.1` | Yes | Must stay viewer-only presentation, not modeled geometry, real lights, real material, or export truth |
| Contact-shadow strength/opacity | `Viewer.ts` `CLAY_STUDIO_CONTACT_SHADOW_RINGS` opacity values and cloned materials | No visible contact-shadow control | `Render > Shadows > Contact Shadows` | `Properties-4 / Phase 4.1` | Yes | Must stay viewer-only presentation and not change hard shadow maps |
| Contact-shadow spread/radius | `Viewer.ts` `CLAY_STUDIO_CONTACT_SHADOW_RINGS` scale values and `CLAY_STUDIO_CONTACT_SHADOW_MIN_RADIUS` | No visible contact-shadow control | `Render > Shadows > Contact Shadows` | `Properties-4 / Phase 4.1` | Yes | Must stay viewer-only presentation and not change mesh bounds or geometry |
| Contact-shadow height fade | `Viewer.ts` `CLAY_STUDIO_CONTACT_SHADOW_HEIGHT_FADE`, bounds-to-ground fade math | No visible contact-shadow control | `Render > Shadows > Contact Shadows` | `Properties-4 / Phase 4.1` | Yes | Must stay viewer-only presentation and not change object placement or ground height |
| Axes visibility/suppression policy | `ViewSettings.axesVisible`, `Viewer.ts` Clay branch suppressing axes helper with `settings.axesVisible && !resolveClayStudioActive()` | Existing saved axes visibility is not in Properties `Render` | `Render > Viewport Helpers` only if presets should own it | Runtime Detail for now | No for now | Axis helper remains a viewport helper preference until a later explicit phase makes it preset-authored |

### Phase 4 Landed Read

- The remaining hidden Clay Studio ingredients are now classified as neutral render-setting families instead of Clay-owned concepts.
- `Contact Shadows` is the first extraction target because it belongs naturally in the existing `Shadows` group beside hard shadows and Ambient Occlusion, has no existing user control, and can be made presentation-only without touching geometry, real materials, or export truth.
- `Background`, `Presentation Material`, `Presentation Ground Material`, `Lighting`, and `Edges` remain `Properties-4` follow-up candidates, ordered after contact shadows because each needs either a broader UI decision or a tighter separation from existing material/light owners.
- `Axes` remains a runtime detail for now because hiding axes in Clay Studio is still a helper-display policy, not yet a user-facing render-preset ingredient.
- The next code-changing phase should be `Properties-4 / Phase 4.1 - First Remaining Setting Extraction`, scoped to neutral Contact Shadow settings under `Properties > Render > Shadows`.

## [x] `Properties-4 / Phase 4.1` - `First Remaining Setting Extraction`

### Phase 4.1 Summary

Extract the first classified runtime-only presentation values into real neutral `Properties > Render` settings.

This is the first code-changing follow-up after Phase 4. It should move a small, high-value group out of Clay-specific viewer branches and into normal saved render settings that built-in presets can write and users can edit.

### Phase 4.1 Candidate Scope

Phase 4 selected `Contact Shadows` as the first extraction target because it gives the clearest user-facing win with the lowest ownership risk.

- `Contact Shadows`
  - section: `Properties > Render > Shadows`
  - likely controls: on/off, opacity/strength, spread/radius, height fade
  - current Clay Studio soft rings become one possible preset-written value

If Contact Shadows grows too broad during implementation, keep `Phase 4.1` to on/off plus one strength/spread read and add `Phase 4.1b` or `Phase 4.2` for deeper tuning instead of mixing in Background or Presentation Material work.

### Phase 4.1 Prep Read

#### Why This Cut Comes First

Contact Shadows are the cleanest first extraction because they are currently presentation-only, Clay Studio-only, and already visually grouped with the user's current shadow mental model.

The implementation should turn "Clay Studio draws soft rings under objects" into "the current render settings have contact shadows enabled with these values." Clay Studio should simply write those values through the same built-in preset helper used by other visible preset ingredients.

#### Live Code Seams

- `src/shared/viewSettingsTypes.ts`
  - add a neutral `ViewContactShadowSettings` contract
  - add defaults, normalization, equality/copy handling, persistence policy coverage if this repo's view-copy helpers require it
  - update built-in render-preset recipe helpers so `Clay Studio` writes contact-shadow values and `Standard` resets to defaults
- `src/app/workspace/PropertiesRenderSection.tsx`
  - add `Contact Shadows` controls inside the existing `Shadows` group, below Ambient Occlusion
  - use a `ParaSelect` for `Off` / `On`
  - use compact sliders/steppers for a first bounded tuning set
- `src/viewer/Viewer.ts`
  - rename or generalize the Clay-only contact-shadow group path as needed without over-refactoring
  - make visibility depend on `ViewSettings.contactShadows.enabled`, rendered display mode, ground visibility, and visible mesh bounds
  - make opacity/strength, spread, and height fade come from saved settings instead of `CLAY_STUDIO_CONTACT_SHADOW_*` constants
- tests:
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
  - `src/viewer/Viewer.test.ts`

#### Recommended Settings Shape

Add one nested neutral setting:

```ts
type ViewContactShadowSettings = {
  enabled: boolean
  opacity: number
  spread: number
  heightFade: number
}
```

Recommended first ranges:

- `opacity`
  - range: `0` to `1`
  - default Standard value: `1` while `enabled` is `false`
  - Clay Studio recipe value: tuned to match the current ring opacity feel
- `spread`
  - range: `0.5` to `2`
  - default Standard value: `1`
  - Clay Studio recipe value: `1`
- `heightFade`
  - range: `1` to `16`
  - default Standard value: `8`
  - Clay Studio recipe value: `8`

Keep ring count, ring color, y-offset, and exact internal ring ratios as runtime details for this phase. Those can become later controls only if the user actually needs them.

#### Exact First Code Cut

1. Add `ViewSettings.contactShadows`.
   - default: disabled
   - normalized on load
   - copied/persisted with the rest of view presentation settings
2. Update built-in preset recipes.
   - `Clay Studio`: `enabled: true`, plus values matching the current soft contact-shadow look
   - `Standard`: disabled/default contact shadows
3. Add `Contact Shadows` controls under `Properties > Render > Shadows`.
   - `Contact Shadows` `Off` / `On`
   - `Opacity`
   - `Spread`
   - `Height Fade`
4. Update viewer contact-shadow rendering.
   - draw contact shadows from `view.contactShadows`
   - do not require `viewportStyle === 'clayStudio'`
   - require rendered display mode and visible ground
   - preserve current visual output when Clay Studio preset is selected
5. Add focused proof.
   - Properties writes only `contactShadows`
   - Clay Studio preset writes enabled contact-shadow settings
   - Standard preset resets contact shadows to defaults
   - viewer creates contact-shadow rings from settings in rendered mode
   - viewer hides contact shadows when the setting, rendered mode, or ground visibility disables them

#### Implementation Boundaries

- do not add Background, Presentation Material, Lighting, or Edge controls in this phase
- do not add contact-shadow color controls yet
- do not add ring-count, ring-ratio, y-offset, or per-object controls yet
- do not make contact shadows part of graph geometry, real object materials, real lights, exported output, or saved custom preset management
- do not collapse `Display Mode` and `Render Preset`
- do not remove existing hard-shadow or selected-light shadow controls

#### Verification

Run at least:

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/app/store/scenePresentationEditHistoryReadiness.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

### Phase 4.1 Landed Read

- Added normalized `ViewSettings.contactShadows` settings with `enabled`, `opacity`, `spread`, and `heightFade`.
- Added `Contact Shadows`, `Contact Opacity`, `Contact Spread`, and `Contact Height Fade` controls under Properties `Render > Shadows`, below Ambient Occlusion.
- Updated built-in render presets so `Clay Studio` writes enabled contact-shadow settings and `Standard` resets them to defaults.
- Updated the viewer contact-shadow ring path so rings render from saved contact-shadow settings in rendered mode with visible ground, instead of requiring Clay Studio identity.
- Kept ring color, ring count, ring ratios, y-offset, per-object contact controls, Background, Presentation Material, Presentation Ground Material, Lighting, Edges, graph geometry, material truth, real light truth, export truth, saved custom presets, and Display Mode / Render Preset collapse out of scope.
- Verified with focused Properties/store/viewer tests, production build, and `git diff --check`.

### Phase 4.1 Boundaries

- add saved neutral render settings before presets write them
- update built-in preset recipe helpers so `Clay Studio` writes normal settings instead of hidden viewer-only constants
- update `Viewer.ts` to consume the saved neutral setting
- keep user edits after preset application editable
- do not mutate graph geometry, real object materials, export truth, or authored content
- do not add saved custom preset management yet
- do not collapse `Display Mode` and `Render Preset`

## [ ] `Properties-4 / Phase 5` - `Preset Match And Custom Readback`

### Phase 5 Summary

Add the read logic that compares current settings to built-in preset definitions and reports preset/custom state honestly.

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Add a preset read helper.
   - suggested name: `resolveRenderPresetRead(...)`
2. Compare current render settings against built-in preset definitions.
3. Return a stable read:
   - exact built-in match
   - derived custom state
   - unknown custom state
4. Update UI copy:
   - `Rendered`
   - `Clay Studio`
   - `Rendered (Custom)`
   - `Clay Studio (Custom)`
   - `Custom`
5. Add focused tests for match/divergence.

#### Boundaries

- do not add save/delete custom preset UI yet
- do not overfit comparison to floating-point noise; use existing normalized settings where possible

#### Done Shape

Phase 5 is done when Properties and Shift+D can honestly show whether the current render settings match a built-in preset or have diverged into a custom read.

## [ ] `Properties-4 / Phase 6` - `First Saved Custom Presets`

### Phase 6 Summary

Add user-created render presets after the built-in preset contract and custom readback are stable.

### Phase 6 Implementation Spec

#### Open Ownership Decision

Before implementation, decide whether saved custom presets are:
- user preferences
- project state
- authored content

Default recommendation:
- start as user preferences if presets are personal workspace presentation preferences
- move to project state only when sharing/publishing requires project-specific preset definitions
- avoid authored content until render presets affect outputs beyond local presentation

#### Candidate First Cut

- save current render settings as named preset
- apply named preset through the same shared path
- rename saved preset
- delete saved preset
- keep built-in presets undeletable

#### Boundaries

- do not make custom presets affect geometry or export truth
- do not create a separate hidden preset owner outside the shared render-preset helper
- do not make custom preset UI before built-in match/divergence reads are stable

#### Done Shape

Phase 6 is done when a user can save the current Properties `Render` state as a named custom preset and later apply it through the same Shift+D / Properties path as built-in presets.
