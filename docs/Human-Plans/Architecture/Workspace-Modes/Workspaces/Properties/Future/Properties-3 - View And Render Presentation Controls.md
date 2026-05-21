# Properties 3 - View And Render Presentation Controls

## Doc Header

### Doc History
11. 2026-05-21 07:09:19: Prepped `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` for implementation against the live `ViewSettings.gridVisible` seam, `uiPrefsPersistence` view-settings policy, hard-coded `Viewer.ts` minor/major/double-major grid helpers, existing Properties `Render` grouping, and current Viewer/store/Properties test footholds, narrowing the first implementation cut to a three-layer grid presentation contract that preserves `gridVisible` as the top-level on/off owner.
10. 2026-05-21 06:59:59: Planned `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` after the user asked to move the View Toolbar grid checkbox into Properties `Render` as a new `Grid` section, expanding the idea into a bounded `Grid 1` / `Grid 2` / `Grid 3` layer model that starts from the current viewer minor, major, and double-major grid layers while keeping graph geometry, sketch working grids, and export truth out of scope.
9. 2026-05-21 06:50:32: Implemented `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` with View Toolbar parity for Properties `Render > Shadows` and `Render > Ground`, adding Standard-mode global shadow, selected-light shadow, ground visibility, ground height, and ground material controls while keeping Clay Studio shadow/ground/contact behavior visibly `Preset Locked`.
8. 2026-05-21 06:40:53: Prepped `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` for implementation against the shipped Properties `Render` grouping, existing `ViewToolbar` ground controls, `groundEditHistory` helpers, shared `ViewSettings.ground` contract, and `Viewer.ts` Clay Studio ground/contact overrides, narrowing the next code cut to Standard-mode ground visibility, height, and material controls while keeping Clay Studio contact treatment preset-owned and read-only.
7. 2026-05-21 06:32:26: Implemented `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` by adding Standard-mode Environment Grade sliders to Properties `Render`, locking those controls while Clay Studio is active, preserving the existing `Viewer.ts` Clay Studio grade override, and proving Standard grade writes stay scoped to `ViewSettings.environmentGrade`.
6. 2026-05-21 06:28:39: Prepped `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` for implementation against the shipped grouped Properties `Render` section, existing `ViewToolbar` grade controls, `uiPrefsStore.setEnvironmentGrade(...)`, environment-look history helpers, and the Clay Studio `Viewer.ts` grade override, choosing a first-pass `Preset Locked` Clay Studio policy while allowing active Standard-mode grade sliders.
5. 2026-05-21 06:20:44: Implemented `Properties-3 / Phase 2 - Render Section Grouping And Readback` by grouping Properties `Render` into `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`, adding passive Clay Studio/standard readback rows for Environment/Shadows/Ground, and proving the active controls still only write their existing `ViewSettings` fields.
4. 2026-05-21 06:12:46: Prepped `Properties-3 / Phase 2 - Render Section Grouping And Readback` for implementation against the live `PropertiesRenderSection.tsx`, `PropertiesSurface.test.tsx`, shared `ViewSettings` contract, and Clay Studio viewer runtime branches, narrowing the next code cut to grouped Properties `Render` presentation/readback rows without adding active Environment, Shadows, or Ground controls.
3. 2026-05-20 20:13:19: Implemented `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory` as a docs-only inventory closeout after rereading the live `ViewSettings` contract, current `PropertiesRenderSection.tsx`, and Clay Studio viewer runtime overrides, then marking the inventory complete and making Phase 2's grouping handoff concrete without changing runtime code.
2. 2026-05-20 20:03:45: Prepped `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory` for implementation by reading the live `ViewSettings` contract, current `PropertiesRenderSection.tsx`, and Clay Studio viewer overrides, then locking the inventory pass around explicit `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality` subsections.
1. 2026-05-20 19:53:00: Created this future family plan after the Clay Studio and SSAO work exposed that `Properties` needs an explicit home for viewport/render presentation controls such as `Viewport Style`, Ambient Occlusion, Environment Grade Controls, ground/contact presentation, and render-preview quality, while keeping viewer runtime implementation inside `Model Viewport`.

### Purpose

Use this doc as the dedicated future planning surface for moving appropriate view/render presentation controls into the `Properties` workspace.

This doc exists because the Clay Studio work made one thing clear:
- `Model Viewport` should own viewer runtime behavior.
- `Properties` should own the user-facing property/control surface for render and viewport presentation settings.

Do not use this doc to change geometry truth, material truth, graph execution, export truth, or the viewer renderer implementation.

## Doc Body

### Summary

`Properties-3` should organize the view/render controls that currently feel scattered between viewport-specific planning, Properties `Render`, Settings, and environment/look behavior.

The immediate product concern is Clay Studio:
- Clay Studio currently overrides normal Environment Grade Controls.
- Ambient Occlusion, ground contact, contact shadows, and viewport style now exist as view-presentation settings.
- The user needs one understandable place to see what is preset-driven versus what is still adjustable.

The right split is:
- `Properties Render` owns the user-facing controls and readback.
- `ViewSettings` remains the shared persisted state owner.
- `Viewer.ts` remains the runtime implementation owner.
- `Model-Viewport-5` remains the visual style/runtime family that proved the Clay Studio + SSAO renderer path.

### Current Live Read

Already shipped or in flight:
- `PropertiesSurface` has a `Render` section.
- `PropertiesRenderSection.tsx` exposes Render Preview quality controls.
- `Viewport Style` is exposed in Properties `Render`.
- `Ambient Occlusion` is exposed in Properties `Render`.
- `ViewSettings.viewportStyle` owns `standard` / `clayStudio`.
- `ViewSettings.postProcessing` owns SSAO enablement, intensity, radius, and quality.
- `Viewer.ts` currently overrides Clay Studio material, background, environment grade, lights, ground, edges, and contact shadows while Clay Studio is active.

Problem revealed by review:
- Clay Studio's `CLAY_STUDIO_ENVIRONMENT_GRADE` currently replaces the normal user Environment Grade Controls.
- The UI does not yet explain or organize which controls remain user-driven in Clay Studio and which are preset-owned.
- Ground/contact treatment and AO behavior are viewer presentation effects, but they are not yet organized as a coherent Properties-owned control family.

### Ownership Rules

`Properties-3` owns:
- user-facing render/view presentation control placement
- labels, grouping, disabled/read-only states, and reset behavior for these controls
- deciding which `ViewSettings` fields are surfaced in Properties `Render`
- making Clay Studio preset-owned overrides visible and understandable

`ViewSettings` owns:
- persisted view/render presentation state
- normalized values and default settings
- shared contracts consumed by UI and viewer runtime

`Model Viewport` owns:
- renderer implementation
- post-processing runtime
- ground/contact visual implementation
- Clay Studio runtime overrides
- render-loop behavior and fallbacks

`Properties-3` does not own:
- graph geometry
- material preset truth
- export truth
- path-traced render preview implementation
- SSGI/WebGPU migration
- low-level renderer resource lifecycle

### Control Group Direction

The future `Render` section should become a structured read with these groups:

1. `Viewport Presentation`
   - `Viewport Style`
   - `Ambient Occlusion`
   - Clay Studio preset/readback status

2. `Environment`
   - exposure
   - contrast
   - highlights
   - shadows
   - whites/blacks
   - saturation/temperature/tint if the existing grade owner keeps them
   - environment source/preset readback only if it helps the user understand the current look

3. `Shadows`
   - shadow enablement/readback
   - Clay Studio hard-shadow override readback
   - no low-level shadow-map debug controls

4. `Ground`
   - ground visibility/height/material where appropriate
   - Clay Studio contact treatment readback or toggle only if the visual pass proves a control is needed

5. `Render Preview Quality`
   - existing samples/bounces/scale/noise/GPU load controls
   - kept visually separate from interactive Clay Studio/AO controls

### Clay Studio Grade Decision

The next big organization question:

Should Clay Studio fully override Environment Grade Controls, or should it use a preset base with user-adjustable offsets?

Preferred future direction:
- Clay Studio should have a stable preset base.
- Properties should show the user whether the current grade controls are:
  - `Preset Locked`
  - `User Adjustable`
  - `Offset From Clay Studio`
- If the user expects Grade Controls to work in Clay Studio, implement a small blend/offset contract rather than silently ignoring their sliders.

Important:
- this doc plans the control ownership and user-facing behavior
- the actual runtime grade application remains a `Viewer.ts` / `ViewSettings` implementation detail

## Vision

The `Properties` workspace should become the clean place to understand and adjust how the current viewport/render presentation looks.

For Clay Studio specifically, the user should not have to guess:
- which controls are active
- which controls are preset-owned
- why Grade Controls do or do not affect the look
- whether Ambient Occlusion, ground contact, and render preview are part of the same render family or separate systems

The experience should feel like:
- "I am in Properties > Render."
- "I can see the current viewport presentation style."
- "I can tune or reset the render look without changing geometry or material truth."

## Wishlist Organization

### High Level Goals

- [ ] `Properties-3-HLG-1. Put viewport/render presentation controls in Properties so the user has one clear place to tune the visual look.`
- [ ] `Properties-3-HLG-2. Make Clay Studio's preset-owned overrides honest instead of silently ignoring normal controls.`
- [ ] `Properties-3-HLG-3. Move appropriate ViewSettings controls into Properties Render without making Properties own viewer runtime implementation.`
- [ ] `Properties-3-HLG-4. Keep interactive viewport presentation controls separate from Render Preview quality controls.`
- [ ] `Properties-3-HLG-5. Preserve graph geometry, material truth, export truth, and Model Viewport runtime ownership.`
- [ ] `Properties-3-HLG-6. Let users shape the visible work grid from Properties without turning grid styling into authored geometry or export content.`

### Codex Level Goals

- [ ] Properties-3-CLG-1. Inventory current `ViewSettings` fields and classify which belong in Properties `Render`.
- [ ] Properties-3-CLG-2. Define the Properties `Render` grouping for viewport presentation, grade controls, ground/contact, and render-preview quality.
- [ ] Properties-3-CLG-3. Decide the Clay Studio grade-control policy.
- [ ] Properties-3-CLG-4. Add implementation phases that move controls incrementally without widening viewer runtime behavior.
- [ ] Properties-3-CLG-5. Keep `Model-Viewport-5` as the runtime/visual implementation family and use `Properties-3` for user-facing control organization.
- [ ] Properties-3-CLG-6. Define a bounded grid presentation contract that can represent the current minor, major, and double-major viewer grid layers as user-editable Properties controls.

### `Properties-3 / Phase 1`

- [ ] Audit `ViewSettings` and current Properties `Render` controls.
- [ ] Classify controls as `Properties Render`, `Settings Defaults`, `Model Viewport Runtime`, or `Do Not Surface Yet`.
- [ ] Record the Clay Studio grade override issue.
- [ ] `Properties-3-HLG-1`
- [ ] `Properties-3-HLG-2`
- [ ] `Properties-3-HLG-3`
- [ ] `Properties-3-HLG-5`

### `Properties-3 / Phase 2`

- [ ] Reorganize Properties `Render` into clear groups without adding new runtime behavior.
- [ ] Keep `Viewport Style`, `Ambient Occlusion`, and Render Preview quality readable as separate control clusters.
- [ ] Add readback/disabled copy only where it prevents confusion.
- [ ] `Properties-3-HLG-1`
- [ ] `Properties-3-HLG-4`
- [ ] `Properties-3-HLG-5`

### `Properties-3 / Phase 3`

- [ ] Move or expose appropriate Environment Grade Controls inside Properties `Render`.
- [ ] Decide whether Clay Studio grade is locked, user-adjustable, or offset-based.
- [ ] Preserve current `ViewSettings.environmentGrade` persistence and normalization.
- [ ] `Properties-3-HLG-1`
- [ ] `Properties-3-HLG-2`
- [ ] `Properties-3-HLG-3`
- [ ] `Properties-3-HLG-5`

### `Properties-3 / Phase 4`

- [ ] Add ground/contact presentation controls only if Phase 1/2 review proves they are needed.
- [ ] Keep Clay Studio contact treatment presentation-only.
- [ ] Avoid exposing low-level debug settings.
- [ ] `Properties-3-HLG-1`
- [ ] `Properties-3-HLG-3`
- [ ] `Properties-3-HLG-5`

### `Properties-3 / Phase 5`

- [ ] Add a new Properties `Render > Grid` section.
- [ ] Move the current View Toolbar `Grid` checkbox into Properties as a `ParaSelect` with `Off` / `On`.
- [ ] Add a grid height/offset control that moves the presentation grid without changing ground, sketch planes, graph geometry, or export truth.
- [ ] Plan the current viewer minor, major, and double-major grid layers as `Grid 1`, `Grid 2`, and `Grid 3`.
- [ ] Give each grid layer user-facing controls for enabled state, spacing, color, visual weight, and height offset.
- [ ] Keep arbitrary unlimited grid layers deferred until the fixed three-layer contract is proven useful and stable.
- [ ] `Properties-3-HLG-1`
- [ ] `Properties-3-HLG-3`
- [ ] `Properties-3-HLG-5`
- [ ] `Properties-3-HLG-6`
- [ ] Properties-3-CLG-6.

## [x] `Properties-3 / Phase 1` - `ViewSettings And Render Control Inventory`

### Phase 1 Summary

#### Purpose

Create an implementation-ready inventory of which view/render settings belong in Properties `Render`.

This phase is doc/planning-first. It should prevent another round of opportunistic controls landing in the nearest available surface.

#### Owns

- inventory of existing `ViewSettings` fields
- classification of current and planned render/presentation controls
- Clay Studio grade override policy question
- handoff boundaries between Properties, Settings, ViewSettings, and Model Viewport
- implementation-ready subsection direction for `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`

#### Does Not Own

- source-code implementation
- new UI controls
- runtime renderer changes
- changing defaults

### Phase 1 Implementation Spec

#### Current Live Inventory

`ViewSettings` currently includes these render/presentation fields:

| Field | Current owner | Intended Properties `Render` surface | Phase 1 classification |
| --- | --- | --- | --- |
| `viewportStyle` | `ViewSettings` / `Viewer.ts` | `Viewport Presentation` | Already surfaced; keep here. |
| `postProcessing` / Ambient Occlusion presets | `ViewSettings` / `postProcessingRuntime` | `Viewport Presentation` | Already surfaced; keep preset-level control here. |
| `environmentGrade` | `ViewSettings` / `Viewer.ts` | `Environment` | Should move into Properties `Render` planning; Clay Studio policy needed first. |
| `environmentSource` and `envPreset` | `ViewSettings` / environment preset helpers / `Viewer.ts` | `Environment` | Candidate for readback or later controls; avoid mixing source picking into this first grouping pass unless needed. |
| `lighting` | `ViewSettings` / `Viewer.ts` | `Environment` or `Shadows` | Keep runtime ownership in Model Viewport; Clay Studio currently supplies preset lights, so Phase 2 should use readback only if it surfaces this at all. |
| `shadowsEnabled` | `ViewSettings` / `Viewer.ts` | `Shadows` | Good candidate for a simple Properties `Render` control/readback; Clay Studio currently overrides hard shadows off. |
| `ground` | `ViewSettings` / `Viewer.ts` | `Ground` | Good candidate for Properties `Render`; Clay Studio currently forces ground on and applies a preset material/contact treatment while retaining the stored ground height. |
| `renderPreview` | `ViewSettings` / `renderPreviewRuntime` | `Render Preview Quality` | Already surfaced; keep visually separated from interactive viewport presentation controls. |
| `highlights` | `ViewSettings` / overlay code | Not `Render` for this phase | Leave in Settings or a future selection/overlays lane. |
| `gridVisible` and `axesVisible` | `ViewSettings` / `Viewer.ts` | `Grid` future section for `gridVisible`; axis controls stay separate unless deliberately widened | `gridVisible` is now planned for Phase 5; Clay Studio can continue suppressing grid as a style behavior. |
| `displayMode` and `edgeDisplayMode` | `ViewSettings` / display wheel / viewer | Mostly outside Properties `Render` | Keep `Shift+D` and viewport display controls primary; only `Viewport Style` belongs here now. |

#### Prepared Subsection Direction

The next implementation phases should organize Properties `Render` into:

1. `Viewport Presentation`
   - `Viewport Style`
   - `Ambient Occlusion`
   - Clay Studio readback if needed

2. `Environment`
   - Environment Grade Controls
   - Clay Studio grade policy/readback
   - optional environment preset/source readback later

3. `Shadows`
   - standard `shadowsEnabled`
   - Clay Studio hard-shadow override readback
   - no low-level shadow-map debug controls

4. `Ground`
   - ground enabled/height/material if the current controls are useful
   - Clay Studio ground/contact readback or one simple contact control only if visual review proves it is needed

5. `Grid`
   - grid enabled/readback
   - grid height/offset
   - bounded `Grid 1`, `Grid 2`, and `Grid 3` layer settings if the runtime contract is added
   - Clay Studio grid suppression readback

6. `Render Preview Quality`
   - the existing progressive renderer controls
   - kept separate from interactive Clay Studio/AO presentation controls

#### Clay Studio Grade Policy Prep

Current runtime behavior:
- `Viewer.ts` returns `CLAY_STUDIO_ENVIRONMENT_GRADE` when Clay Studio is active.
- That means normal `ViewSettings.environmentGrade` values are ignored while Clay Studio is active.
- Properties should not expose grade sliders in a way that implies they affect Clay Studio unless the runtime policy changes.

Phase 3 should choose one policy:
- `Preset Locked`: simplest; show readback/disabled state while Clay Studio is active.
- `User Adjustable`: remove the Clay Studio grade override and let normal grade controls drive the look.
- `Offset From Clay Studio`: keep the Clay Studio preset as a base and let user grade controls adjust from it.

Preferred prep answer:
- start Phase 3 with `Preset Locked` readback if implementation must stay small
- use `Offset From Clay Studio` only if the math and UI copy stay easy to understand

#### Exact First Code Cut

This is a docs-only cut:

1. Read `src/shared/viewSettingsTypes.ts`.
2. Read `src/app/workspace/PropertiesRenderSection.tsx`.
3. Read `src/viewer/Viewer.ts` Clay Studio and environment-grade branches.
4. Produce a table or checklist inside this doc that classifies each relevant control:
   - `Viewport Style`
   - `Ambient Occlusion`
   - `Environment Grade Controls`
   - `Ground`
   - `Lighting`
   - `Shadows`
   - `Render Preview Quality`
   - `Highlights`
   - `Axis/Grid`
5. Turn that inventory into Phase 2/3 implementation-ready guidance.

Phase 1 is now prepped to execute exactly that docs-only inventory pass. The key source-backed classification is already captured above; implementation should mostly mark this inventory complete, add any missing source-backed details, and then tighten Phase 2/3 if the live code read finds drift.

Phase 1 implementation closeout:
- the live inventory is now recorded above
- `PropertiesRenderSection.tsx` is confirmed to expose only `Viewport Style`, `Ambient Occlusion`, and Render Preview quality controls today
- `Viewer.ts` is confirmed to own Clay Studio environment grade, lighting, hard-shadow suppression, ground forcing, ground material, and contact-shadow runtime behavior
- Phase 2 should reorganize/read back existing behavior before adding Environment, Shadows, or Ground controls
- Phase 3 should handle the Environment Grade policy decision before active grade sliders are shown for Clay Studio

#### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-3 - View And Render Presentation Controls.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not edit runtime code in Phase 1.

#### Checklist

- [x] Inventory `ViewSettings` render/presentation fields.
- [x] Classify each field by intended surface.
- [x] Capture Clay Studio grade override options.
- [x] Produce Phase 2 grouping guidance.
- [x] Produce Phase 3 grade-control guidance.
- [x] Keep Environment, Shadows, Ground, and Render Preview Quality as separate future subsections.

#### Verification Shape

- docs readback
- `git diff --check`

#### Done Shape

Phase 1 is done when the repo has one clear planning inventory for moving view/render presentation settings into Properties without moving runtime ownership out of Model Viewport.

Done read:
- complete as of 2026-05-20 20:13:19
- no source-code or runtime behavior changed
- next implementation phase is `Properties-3 / Phase 2 - Render Section Grouping And Readback`

## [x] `Properties-3 / Phase 2` - `Render Section Grouping And Readback`

### Phase 2 Summary

#### Purpose

Reorganize the existing Properties `Render` section into clearer presentation groups before adding more controls.

#### Owns

- UI grouping
- labels
- compact readback
- disabled/read-only explanation when needed

#### Does Not Own

- environment grade implementation
- runtime Clay Studio behavior changes
- advanced numeric post-process sliders
- active Environment, Shadows, or Ground controls beyond honest readback/status rows

#### Current Live Read

Source-backed grounding for this implementation phase:
- `src/app/workspace/PropertiesRenderSection.tsx` currently owns the whole Properties `Render` section content.
- The component already reads `view.renderPreview`, `view.viewportStyle`, and `view.postProcessing` from `useUiPrefsStore`.
- The only active controls currently shipped in Properties `Render` are:
  - `Viewport Style`
  - `Ambient Occlusion`
  - `Quality preset`
  - `Samples`
  - `Light bounces`
  - `Render scale`
  - `Noise cleanup`
  - `GPU load`
  - Render Preview `Reset`
- `PropertiesSurface.test.tsx` already has focused coverage for render availability, render-preview writes, viewport-style writes, Ambient Occlusion preset writes, and render-quality preset/custom readback.
- `src/shared/viewSettingsTypes.ts` already carries `shadowsEnabled`, `ground`, `environmentGrade`, `environmentSource`, `renderPreview`, `postProcessing`, and `viewportStyle`.
- `src/viewer/Viewer.ts` still owns runtime behavior:
  - Clay Studio forces a preset environment grade through `CLAY_STUDIO_ENVIRONMENT_GRADE`.
  - Clay Studio forces the runtime ground visible while preserving the stored ground height.
  - Clay Studio uses preset lights with hard shadow casting disabled.
  - Clay Studio contact shadows are runtime presentation overlays, not authored geometry or material truth.

#### First Pass Decisions

- Keep `PropertiesRenderSection.tsx` as the implementation owner for Phase 2.
- Use existing `SettingsSurfaceGroupHeader`, `SettingsSurfaceEditorPanel`, and `SettingsSurfaceEditorGrid` styling before adding new CSS.
- Treat `Environment`, `Shadows`, and `Ground` as readback/status groups in Phase 2, not editable controls.
- Use short, literal section labels:
  - `Viewport Presentation`
  - `Environment`
  - `Shadows`
  - `Ground`
  - `Render Preview Quality`
- Keep `Viewport Style` and `Ambient Occlusion` active under `Viewport Presentation`.
- Keep all Render Preview quality controls and the existing reset action under `Render Preview Quality`.
- Add only small status/readback text for Clay Studio preset-owned behavior, such as:
  - `Grade: Clay Studio preset`
  - `Shadows: Clay Studio preset`
  - `Ground: Clay Studio preset`
- Do not imply disabled rows are editable controls unless the implementation actually renders disabled form controls with clear labels.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. In `src/app/workspace/PropertiesRenderSection.tsx`, keep the existing store reads and write handlers:
   - `renderPreview`
   - `viewportStyle`
   - `postProcessing`
   - `setViewKey`
2. Derive lightweight readback values inside `PropertiesRenderSectionContent`:
   - whether `viewportStyle === 'clayStudio'`
   - `ambientOcclusionRead`
   - `qualityPresetRead`
   - Environment grade readback text for Clay Studio versus Standard
   - Shadows readback text for Clay Studio versus Standard
   - Ground readback text for Clay Studio versus Standard
3. Rework the returned JSX so Properties `Render` is visibly grouped in this order:
   - `Viewport Presentation`
   - `Environment`
   - `Shadows`
   - `Ground`
   - `Render Preview Quality`
4. Keep active controls only where behavior already exists:
   - `Viewport Style`
   - `Ambient Occlusion`
   - all existing Render Preview quality controls
5. Add readback/status rows for `Environment`, `Shadows`, and `Ground`.
6. Keep readback copy short and deterministic.
7. Do not add `setViewKey('environmentGrade', ...)`, `setViewKey('shadowsEnabled', ...)`, or `setViewKey('ground', ...)` in Phase 2.
8. Do not change `src/viewer/Viewer.ts`, `src/shared/viewSettingsTypes.ts`, persistence, defaults, renderer behavior, post-processing runtime behavior, or render-preview runtime behavior.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-3 - View And Render Presentation Controls.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### UI Shape

Recommended first-pass JSX shape:
- one outer `section.PropertiesRenderSection`
- one header/panel pair per group
- existing `ParaSelect` and `ParaSlider` controls unchanged where possible
- simple readback rows for read-only groups, using existing settings surface classes unless a tiny local class is truly needed

Readback rows should answer only:
- what is active now
- whether Clay Studio is preset-owning that behavior
- which later phase owns actual editing

#### No-Widening Rule

Phase 2 is presentation organization only.

Do not:
- introduce new `ViewSettings` fields
- change Clay Studio runtime grade, lighting, shadows, ground, or contact shadow behavior
- move Environment Grade Controls into Properties yet
- add advanced SSAO sliders
- move Render Preview controls out of Properties `Render`
- change graph geometry, material truth, export truth, or renderer ownership

#### Checklist

- [x] Preserve existing `Viewport Style` writes through `setViewKey('viewportStyle', ...)`.
- [x] Preserve existing Ambient Occlusion preset writes through `setViewKey('postProcessing', ...)`.
- [x] Preserve existing Render Preview quality writes through `setViewKey('renderPreview', ...)`.
- [x] Add a visible `Environment` group with readback only.
- [x] Add a visible `Shadows` group with readback only.
- [x] Add a visible `Ground` group with readback only.
- [x] Keep Render Preview quality visually separate from interactive viewport presentation controls.
- [x] Update focused Properties tests for the new group labels and readback.
- [x] Add a regression assertion that Phase 2 does not mutate `environmentGrade`, `shadowsEnabled`, or `ground`.

#### Verification Shape

- `npm test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- production build
- browser sanity on the Properties `Render` tab if the app is already running or easy to start
- `git diff --check`

#### Done Shape

Phase 2 is done when Properties `Render` reads as an organized control surface instead of a mixed list of unrelated render settings.

Done read:
- the active controls still write the same `ViewSettings` fields as before
- Environment, Shadows, and Ground are visible as readback/status groups only
- Clay Studio preset-owned behavior is honest in the UI without changing runtime behavior
- the next implementation phase is still `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy`

Implementation closeout:
- complete as of 2026-05-21 06:20:44
- `PropertiesRenderSection.tsx` now renders `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality` groups
- `Environment`, `Shadows`, and `Ground` are readback-only and do not write `environmentGrade`, `shadowsEnabled`, or `ground`
- focused Properties proof and production build passed
- next implementation phase remains `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy`

## [x] `Properties-3 / Phase 3` - `Environment Grade Controls And Clay Studio Policy`

### Phase 3 Summary

#### Purpose

Decide and implement how Environment Grade Controls behave in Properties `Render`, especially when Clay Studio is active.

#### Owns

- user-facing grade-control placement
- Clay Studio grade policy
- reset/readback behavior

#### Does Not Own

- changing material truth
- SSGI
- path tracing
- render export
- environment preset/source picking migration
- lighting controls
- changing the Clay Studio runtime grade formula in `Viewer.ts`

#### Current Live Read

Source-backed grounding for this implementation phase:
- `src/app/workspace/PropertiesRenderSection.tsx` now owns the grouped Properties `Render` section.
- Phase 2 left `Environment` as a readback-only group with `Grade` status.
- `src/app/components/ViewToolbar.tsx` already has the full environment grade UI under `Grade Controls`:
  - `Exposure`
  - `Contrast`
  - `Highlights`
  - `Shadows`
  - `Whites`
  - `Blacks`
  - `Temperature`
  - `Tint`
  - `Saturation`
- `ViewToolbar` formats multiplier values as `x` and offset values as signed integers.
- `uiPrefsStore.setEnvironmentGrade(...)` already normalizes and persists partial grade patches.
- `environmentLookEditHistory.ts` already owns environment-look history snapshots, undo, redo, and `Change environment look` commits.
- `Viewer.ts` currently resolves Clay Studio grade by returning `CLAY_STUDIO_ENVIRONMENT_GRADE` while Clay Studio is active.
- That means `ViewSettings.environmentGrade` still persists while Clay Studio is active, but it does not affect the rendered Clay Studio look today.

#### First Pass Policy Decision

Use `Preset Locked` for Phase 3.

Meaning:
- Standard viewport style shows active Environment Grade controls in Properties `Render`.
- Clay Studio keeps using `CLAY_STUDIO_ENVIRONMENT_GRADE`.
- Clay Studio shows grade controls as preset-locked readback or disables the grade editing surface with clear copy.
- Editing the saved `ViewSettings.environmentGrade` while Clay Studio is active is out of scope for this phase.
- `Offset From Clay Studio` remains a later possible phase if the product really needs Clay Studio-specific grade offsets.

Why this is the right first cut:
- It makes the current behavior honest without changing the renderer.
- It moves the grade-control surface into Properties where the user expects it.
- It avoids introducing a second grade meaning before there is a clean offset contract.
- It preserves the long-range split: Properties owns the user-facing control surface, `ViewSettings` owns persisted settings, and Model Viewport owns runtime presentation.

#### UI Direction

Inside Properties `Render > Environment`:
- keep the existing `Grade` readback row
- add a compact `Grade Controls` block
- use the same nine grade fields already present in `ViewToolbar`
- label the Clay Studio state as `Preset Locked`
- keep the copy short and literal

Recommended copy:
- Standard:
  - `Grade: View settings grade`
  - `Uses the saved environment grade.`
- Clay Studio:
  - `Grade: Clay Studio preset`
  - `Preset Locked`
  - `Clay Studio uses a fixed presentation grade. Switch to Standard to edit the saved grade.`

Do not add a full environment preset picker, HDRI source picker, look memory controls, lighting controls, or A/B compare controls to Properties in Phase 3.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. In `src/app/workspace/PropertiesRenderSection.tsx`, import the environment-grade type and any existing helper needed for history:
   - `type EnvironmentGradeSettings`
   - `useUiPrefsStore((state) => state.view.environmentGrade)`
   - `useUiPrefsStore((state) => state.setEnvironmentGrade)`
   - environment-look history helpers if the implementation can reuse them cleanly
2. Add local formatting helpers or shared imports equivalent to the existing ViewToolbar grade formatting:
   - multiplier fields: `Exposure`, `Contrast`, `Saturation`
   - offset fields: `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`
3. Add grade sliders under the existing `Environment` group:
   - `Exposure`: `0` to `5`, step `0.01`
   - `Contrast`: `0` to `3`, step `0.01`
   - `Highlights`: `-100` to `100`, step `1`
   - `Shadows`: `-100` to `100`, step `1`
   - `Whites`: `-100` to `100`, step `1`
   - `Blacks`: `-100` to `100`, step `1`
   - `Temperature`: `-100` to `100`, step `1`
   - `Tint`: `-100` to `100`, step `1`
   - `Saturation`: `0` to `3`, step `0.01`
4. When `viewportStyle === 'standard'`, grade sliders are enabled and write through `setEnvironmentGrade(...)`.
5. When `viewportStyle === 'clayStudio'`, use `Preset Locked`:
   - do not change `Viewer.ts`
   - do not apply `ViewSettings.environmentGrade` to Clay Studio
   - do not write grade changes from disabled Clay Studio controls
   - show clear locked readback/copy
6. Preserve Phase 2 readback groups for `Shadows`, `Ground`, and `Render Preview Quality`.
7. Add focused Properties tests:
   - Standard mode renders grade controls and writes `environmentGrade`
   - Standard mode grade edits do not mutate `viewportStyle`, `postProcessing`, `renderPreview`, `shadowsEnabled`, or `ground`
   - Clay Studio mode shows `Preset Locked`
   - Clay Studio locked controls do not write `environmentGrade`
8. Add focused history proof if environment-look history is wired in this phase.
9. Add focused Viewer proof only if runtime grade behavior changes. Under the first-pass `Preset Locked` policy, it should not.

#### Likely Files

- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/environmentLookEditHistory.ts` only if a small export/helper is needed
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-3 - View And Render Presentation Controls.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not:
- change `Viewer.ts` Clay Studio grade resolution
- add a new `ViewSettings` field
- add Clay Studio offset math
- move environment preset/source/HDRI controls into Properties
- move lighting controls into Properties
- remove the existing ViewToolbar controls in the same cut
- change graph geometry, material truth, export truth, post-processing runtime, or render-preview runtime

#### Checklist

- [x] Add Standard-mode Environment Grade controls inside Properties `Render`.
- [x] Keep Clay Studio grade `Preset Locked`.
- [x] Preserve `ViewSettings.environmentGrade` normalization and persistence.
- [x] Preserve the existing Environment/Shadows/Ground/Render Preview grouping from Phase 2.
- [x] Prove Standard grade controls write only `environmentGrade`.
- [x] Prove Clay Studio locked controls do not write `environmentGrade`.
- [x] Leave environment preset/source, lighting, HDRI, look memory, and A/B compare controls out of Properties for this phase.

#### Verification Shape

- focused Properties tests
- focused store/view-settings tests only if settings helpers change
- focused Viewer tests only if grade application changes
- browser visual sanity
- production build
- `git diff --check`

#### Done Shape

Phase 3 is done when the user can tell whether Grade Controls affect Clay Studio, and the behavior matches that read.

Done read:
- Standard mode exposes active Environment Grade controls in Properties `Render`
- Clay Studio clearly reads as `Preset Locked`
- Clay Studio still uses the existing viewer-owned presentation grade
- saved `ViewSettings.environmentGrade` behavior remains normalized and persistent
- Properties does not become the owner of viewer runtime implementation

Implementation closeout:
- complete as of 2026-05-21 06:32:26
- Properties `Render > Environment` now exposes `Exposure`, `Contrast`, `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`, and `Saturation`
- Standard-mode grade sliders write through `uiPrefsStore.setEnvironmentGrade(...)`
- Clay Studio keeps those sliders disabled and reads as `Preset Locked`
- no `Viewer.ts`, `ViewSettings`, persistence, environment preset/source, HDRI, lighting, graph geometry, material truth, or export behavior changed
- focused Properties proof and production build passed
- next implementation phase remains `Properties-3 / Phase 4 - Ground And Contact Presentation Controls`

## [x] `Properties-3 / Phase 4` - `Ground And Contact Presentation Controls`

### Phase 4 Summary

#### Purpose

Expose the existing View Toolbar shadow and ground presentation settings in Properties `Render` without taking ownership of Clay Studio's viewer-owned shadow/ground/contact presentation.

#### Current Live Read

- `ViewSettings.shadowsEnabled` already owns the global saved shadow toggle.
- `ViewSettings.lighting.selectedLightId` plus `ViewSettings.lighting.lights` already own selected-light shadow settings: `castShadow`, `shadowBias`, and `shadowMapSize`.
- `ViewSettings.ground` already owns `enabled`, `height`, and `materialPresetId`.
- The existing View Toolbar already exposes `Shadows`, selected-light shadow controls, `Ground`, `Ground Height`, and `Material` controls for those setting slices.
- `src/app/store/groundEditHistory.ts` already provides undoable helpers for ground visibility, height, and material preset edits.
- `src/app/store/environmentLookEditHistory.ts` already owns undoable environment-light edits.
- `Viewer.ts` already applies the saved ground settings in rendered Standard mode.
- Clay Studio currently suppresses hard shadows, forces the ground on, preserves the saved ground height, swaps in the Clay Studio ground material, and generates Clay Studio-only contact shadow rings when the ground is visible.

#### First-Pass Decision

Phase 4 should not add a new contact-shadow setting yet.

The implementation pass should move the existing shadow and ground presentation controls into Properties `Render` for Standard mode:
- `Shadows`: `Off` / `On`
- selected-light `Cast Shadow`: `Off` / `On`
- selected-light `Shadow Bias`: `-0.01` to `0.01`, step `0.0001`
- selected-light `Shadow Map`: `256` / `512` / `1024` / `2048`
- `Ground`: `Off` / `On`
- `Ground Height`: `-25` to `25`, step `0.5`
- `Material`: `Matte Dark` / `Matte Mid` / `Glossy Studio`

Clay Studio should keep the Shadows and Ground groups visible but locked/read-only:
- hard shadows read as preset-owned/off
- saved ground height remains visible as readback
- ground is shown as forced on by the Clay Studio preset
- Clay Studio material and contact treatment remain `Preset Locked`
- no editable `Ground Contact` control appears in this phase

#### Owns

- user-facing saved shadow and ground control placement in Properties `Render`
- clear Clay Studio readback for forced shadow/ground/contact treatment
- reuse of the existing environment-light history path for undoable selected-light shadow edits
- reuse of the existing ground history path for undoable Properties edits

#### Does Not Own

- graph floor geometry
- export truth
- low-level shadow-map debug knobs
- broad viewer rendering changes
- new contact-shadow settings or Clay Studio contact tuning

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Update `src/app/workspace/PropertiesRenderSection.tsx`.
   - import `GroundMaterialPresetId` from `viewSettingsTypes`
   - import `captureGroundHistorySnapshot`, `commitGroundHistory`, `setGroundEnabledWithHistory`, and `setGroundMaterialPresetWithHistory` from `groundEditHistory`
   - add local ground material options matching `ViewToolbar`
   - keep the existing `Ground` readback/status row
2. Add Standard-mode controls inside the existing Properties `Render > Ground` group.
   - `ParaSelect` label `Ground`, options `Off` / `On`, writes with `setGroundEnabledWithHistory(...)`
   - `ParaSlider` label `Ground Height`, range `-25` to `25`, step `0.5`, writes `ViewSettings.ground.height`
   - commit the height edit once through `commitGroundHistory(...)`, matching the View Toolbar draft/commit pattern
   - `ParaSelect` label `Material`, options `Matte Dark`, `Matte Mid`, and `Glossy Studio`, writes with `setGroundMaterialPresetWithHistory(...)`
3. Lock the editable ground controls while `viewportStyle === 'clayStudio'`.
   - Clay Studio copy should stay honest: ground is forced on, saved height is retained, material/contact treatment is preset-owned
   - disabled controls may still show the saved values, but must not write settings while locked
4. Keep contact treatment read-only.
   - no `Ground Contact` select in this phase
   - no new `ViewSettings` field
   - no `Viewer.ts` contact-shadow behavior change
5. Preserve the Phase 2/3 group order:
   - `Viewport Presentation`
   - `Environment`
   - `Shadows`
   - `Ground`
   - `Render Preview Quality`

#### Implementation Boundaries

- Reuse the existing View Toolbar ground setting labels and option labels.
- Do not move ground controls into Materials; this is presentation ground, not part material editing.
- Do not add reset-all behavior unless the implementation naturally needs it for parity.
- Do not change persistence or normalization unless a focused test proves the current ground path cannot support Properties writes.
- Do not alter Clay Studio runtime material/contact shadow constants.

#### Test Direction

Update `src/app/workspace/PropertiesSurface.test.tsx` to prove:
- Properties `Render` shows the Standard ground controls
- Standard `Ground`, `Ground Height`, and `Material` writes only update `ViewSettings.ground`
- Environment Grade, shadows, viewport style, post-processing, and render preview are not mutated by ground edits
- Clay Studio disables/locks the editable ground controls and does not write ground changes
- the existing readback still says Clay Studio ground/contact behavior is preset-owned

Run the existing `groundEditHistoryStore.test.ts` only if the implementation changes the helper behavior. Run focused Viewer tests only if Phase 4 unexpectedly changes runtime behavior, which the prep does not intend.

#### Verification Shape

- focused Properties tests
- focused ground history tests only if helper behavior changes
- focused Viewer tests only if runtime behavior changes
- production build
- `git diff --check`

#### Done Shape

Phase 4 is done when Properties `Render > Shadows` and `Render > Ground` expose the existing Standard-mode saved View Toolbar shadow and ground presentation controls, Clay Studio remains visibly preset-locked for hard-shadow suppression and forced ground/material/contact behavior, no new contact setting is added, and focused Properties proof confirms edits stay scoped to `ViewSettings.shadowsEnabled`, selected-light shadow fields, and `ViewSettings.ground`.

Done read:
- Properties `Render > Shadows` exposes the View Toolbar shadow setting set: global `Shadows`, selected-light `Cast Shadow`, `Shadow Bias`, and `Shadow Map`.
- Properties `Render > Ground` exposes the View Toolbar ground setting set: `Ground`, `Ground Height`, and `Material`.
- Standard-mode shadow edits write `ViewSettings.shadowsEnabled` and selected-light shadow fields through the existing environment-light setting path.
- Standard-mode ground edits write `ViewSettings.ground` through the existing ground setting/history path.
- Clay Studio keeps Shadows and Ground controls disabled/read-only and reads as `Preset Locked`.
- no `Viewer.ts`, `ViewSettings`, persistence, graph geometry, material truth, export behavior, contact-shadow runtime, or render-preview behavior changed.

Implementation closeout:
- complete as of 2026-05-21 06:50:32
- Properties `Render` now has active Standard-mode View Toolbar parity for the Shadows and Ground sections
- selected-light shadow controls show the selected light name or the existing unsupported/no-selection readback copy
- Clay Studio locks the copied Shadows and Ground controls so preset-owned behavior stays honest
- focused Properties proof passed

## [ ] `Properties-3 / Phase 5` - `Grid Presentation Controls And Layer System`

### Phase 5 Summary

#### Purpose

Add a dedicated Properties `Render > Grid` section that starts by moving the existing View Toolbar `Grid` checkbox into Properties as a `ParaSelect`, then grows the viewer grid into an editable presentation-layer system.

#### User Intent

The desired user read is:
- "Grid is a first-class render/presentation control in Properties."
- "I can turn the grid on/off without hunting in the View Toolbar."
- "I can lift or offset the visible grid separately from ground and geometry."
- "I can tune the line spacing, color, and visual weight of the grid layers."
- "I can add or remove practical grid bands without turning grid lines into modeled geometry."

#### Current Live Read

- `ViewSettings.gridVisible` already owns the saved on/off grid preference.
- `ViewToolbar.tsx` currently exposes `Grid` only as a checkbox in the `View` section.
- `PropertiesRenderSection.tsx` currently has groups for `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`; `Grid` should be inserted between `Ground` and `Render Preview Quality`.
- `Viewer.ts` already has three hard-coded runtime grid layers:
  - minor grid: `GRID_MINOR_STEP = 1`, opacity `0.1`, excludes major and double-major coordinates
  - major grid: `GRID_MAJOR_STEP = 10`, opacity `0.3`, excludes double-major coordinates
  - double-major grid: `GRID_DOUBLE_MAJOR_STEP = 50`, opacity `1`
- The model viewport grid uses a horizontal X/Z plane with tiny Y offsets to avoid z-fighting.
- `uiPrefsPersistence.ts` already treats `gridVisible` as a view-settings persistence field.
- Clay Studio currently suppresses the grid at runtime while preserving the saved `gridVisible` value.
- Sketch working grids and sketch-plane pick grids have their own local hard-coded grid layers and should not be changed by this Properties phase.

#### Prep Decision

Phase 5 should ship the full first-pass grid contract and UI together, but keep the contract bounded:
- keep `ViewSettings.gridVisible` as the canonical top-level `Grid` on/off value
- add a new `ViewSettings.gridPresentation` object for grid height, size, and the three editable grid layers
- do not add `gridPresentation.enabled`; duplicating the top-level enabled state would create two owners
- do not remove the View Toolbar checkbox in the first implementation unless it is trivial after the shared setting works
- keep Clay Studio suppression unchanged and show locked/readback copy in Properties

First-pass user-facing layer names:
- `Grid 1` = minor grid
- `Grid 2` = major grid
- `Grid 3` = double-major grid

The first pass should use `Opacity` as the visible "line weight" control. True pixel line width should stay deferred until a later renderer pass supports fat grid lines reliably.

#### Recommended Product Shape

Use a bounded layer model first:

| User label | Runtime meaning | Default spacing | Default visual role |
| --- | --- | --- | --- |
| `Grid 1` | Minor grid | `1` | quiet dense working grid |
| `Grid 2` | Major grid | `10` | stronger subdivision line |
| `Grid 3` | Double Major grid | `50` | strongest orientation/scale line |

This gives the user the "+/- more grid lines" feeling without opening the first version to arbitrary unbounded layer creation. The UI can present `Grid 1`, `Grid 2`, and `Grid 3` as layer rows with an `On` / `Off` control. If we later need true add/remove, the first expansion should be "enable another fixed layer slot" before supporting unlimited custom layers.

#### Suggested Controls

Top-level `Grid` section:
- `Grid`: `Off` / `On` `ParaSelect`
- `Grid Height`: `ParaSlider`, suggested range `-25` to `25`, step `0.5`
- `Grid Size`: `ParaSlider`, suggested range `25` to `1000`, step `25`

Per grid layer:
- `Layer`: `Off` / `On` `ParaSelect`
- `Spacing`: `ParaSlider`, suggested range `0.1` to `100`, step depends on value scale
- `Color`: color swatch or color input
- `Opacity` or `Weight`: `ParaSlider`, suggested range `0` to `1`, step `0.05`
- `Height Offset`: `ParaSlider`, suggested range `-0.05` to `0.05`, step `0.001`

Line width needs a caveat: Three.js `LineBasicMaterial.linewidth` is not reliable across common WebGL/browser targets, so the first implementation should treat "line width" as visual weight through opacity/color. If true pixel width is important later, plan a follow-up that swaps grid line rendering to a fat-line implementation.

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Add a grid presentation settings contract under `ViewSettings`.
   - preserve `gridVisible` as the top-level on/off field
   - add `gridPresentation` for height, size, and layer styling
   - normalize spacing, size, opacity/weight, colors, and height offsets
   - default the new settings so they reproduce the current minor/major/double-major grid
2. Update persistence and clone/normalization helpers.
   - persisted old projects with only `gridVisible` should keep the current grid look
   - new grid layer settings should persist with view settings
   - `applyPersistedViewPolicy(...)` and `mergePersistedUiPrefsView(...)` should copy `gridPresentation` with the other view-settings fields
3. Update `Viewer.ts` grid runtime.
   - rebuild or update the three grid layers from the normalized settings
   - preserve coordinate exclusion so Grid 1 does not draw over Grid 2/3 and Grid 2 does not draw over Grid 3
   - set each helper position to `gridPresentation.height + layer.heightOffset`
   - keep Clay Studio grid suppression behavior unchanged
   - keep sketch working grids unchanged
4. Update `PropertiesRenderSection.tsx`.
   - add a new `Grid` group between `Ground` and `Render Preview Quality`
   - render top-level `Grid` `ParaSelect`
   - render `Grid Height` and `Grid Size` sliders
   - render `Grid 1`, `Grid 2`, and `Grid 3` controls using compact Properties `Render` controls
5. Leave View Toolbar cleanup as a follow-up unless the implementation is small enough.
   - first pass may keep the existing View Toolbar checkbox as a duplicate control
   - later cleanup can remove the checkbox or point it to the same Properties-owned setting language

#### Concrete File Targets

- `src/shared/viewSettingsTypes.ts`
  - add `GridPresentationSettings`, `GridPresentationLayerSettings`, and `GridPresentationLayerId`
  - add default grid presentation constants
  - add normalization and clone helpers
  - include `gridPresentation` in `ViewSettings`, `DEFAULT_VIEW_SETTINGS`, and `normalizeViewSettings(...)`
- `src/app/store/uiPrefsPersistence.ts`
  - carry `gridPresentation` through view-settings persistence policy paths
- `src/viewer/Viewer.ts`
  - replace hard-coded grid helper construction with normalized grid presentation settings
  - add a narrow grid helper sync/rebuild path
  - preserve Clay Studio and sketch draw visibility suppression
- `src/app/workspace/PropertiesRenderSection.tsx`
  - add `Grid` section controls and Clay Studio locked copy
  - keep `Grid` top-level select wired to `setViewKey('gridVisible', ...)`
  - write grid presentation edits through `setViewKey('gridPresentation', ...)`
- `src/app/workspace/PropertiesSurface.test.tsx`
  - add focused Properties proof for the new section and scoped writes
- `src/viewer/Viewer.test.ts`
  - add focused runtime proof for default layer reproduction and custom grid settings
- `src/app/store/uiPrefsStore.test.ts` and/or `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
  - add focused normalization/persistence proof for old and new view settings

#### Suggested Data Shape

```ts
type GridLayerSettings = {
  id: 'grid1' | 'grid2' | 'grid3'
  enabled: boolean
  spacing: number
  color: string
  opacity: number
  heightOffset: number
}

type GridPresentationSettings = {
  height: number
  size: number
  layers: GridLayerSettings[]
}
```

Default values:

```ts
const DEFAULT_GRID_PRESENTATION_SETTINGS = {
  height: 0,
  size: 300,
  layers: [
    {
      id: 'grid1',
      enabled: true,
      spacing: 1,
      color: '#ffffff',
      opacity: 0.1,
      heightOffset: 0,
    },
    {
      id: 'grid2',
      enabled: true,
      spacing: 10,
      color: '#ffffff',
      opacity: 0.3,
      heightOffset: 0.001,
    },
    {
      id: 'grid3',
      enabled: true,
      spacing: 50,
      color: '#ffffff',
      opacity: 1,
      heightOffset: 0.002,
    },
  ],
}
```

Compatibility note:
- `ViewSettings.gridVisible` remains the canonical on/off field for Phase 5.
- `gridPresentation` owns only the shape and styling of the visible grid.
- Old persisted views without `gridPresentation` normalize to the default values above.
- If a persisted layer is missing or invalid, normalize that one layer back to its default without dropping the other valid layer settings.

#### Normalization Rules

- `height`: finite number, clamp suggested `-25` to `25`
- `size`: finite number, clamp suggested `25` to `1000`
- `spacing`: finite positive number, clamp suggested `0.1` to `100`
- `color`: valid CSS hex string if possible; otherwise default layer color
- `opacity`: finite number, clamp `0` to `1`
- `heightOffset`: finite number, clamp suggested `-0.05` to `0.05`
- `layers`: always normalize back to exactly three layers in `grid1`, `grid2`, `grid3` order
- disabled layers should not draw, but their settings should remain editable and persistent

#### UI Direction

The `Grid` group should be compact and scannable:
- top row: `Grid`, `Grid Height`, `Grid Size`
- layer rows:
  - `Grid 1` read label, then `Layer`, `Spacing`, `Color`, `Opacity`, `Height Offset`
  - `Grid 2` read label, then the same controls
  - `Grid 3` read label, then the same controls

Use `ParaSelect` for binary layer state and `ParaSlider` for numeric values. For color, prefer the existing app color input pattern if one exists in nearby Properties/Toolbar material code; otherwise use a minimal native color input inside the existing Properties field wrapper for the first pass.

Clay Studio policy:
- show the saved settings
- disable active grid controls while Clay Studio is active
- copy should say that Clay Studio suppresses the visible grid as part of the preset
- do not mutate saved grid settings just because Clay Studio is active

#### Boundaries

- Do not change graph geometry, modeled construction lines, export output, or project truth.
- Do not change sketch draw working-grid behavior or sketch-plane pick-grid behavior.
- Do not expose infinite arbitrary custom grid layers in the first cut.
- Do not promise browser-stable true line width until the renderer path supports fat lines.
- Do not move axis overlay styling into this phase unless the user explicitly widens the phase again.
- Do not make Clay Studio show the grid; keep it preset-suppressed unless a separate Clay Studio policy phase changes that.

#### Test Direction

Add focused tests for:
- Properties `Render` shows the new `Grid` group.
- `Grid` `Off` / `On` writes the same saved visibility setting as the View Toolbar checkbox.
- grid height and layer settings write only the new grid presentation settings.
- default settings reproduce minor/major/double-major spacing values.
- Clay Studio shows honest locked/readback copy or keeps grid controls disabled if the saved setting is not visually active.
- Viewer grid runtime uses the normalized grid size, spacing, colors, opacity/weight, and height offsets.
- old persisted view settings without a grid presentation object still normalize to the current grid look.

Suggested focused commands:
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/viewer/Viewer.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx`

#### Verification Shape

- focused Properties tests
- focused `viewSettingsTypes` normalization/persistence tests if a new settings object lands
- focused Viewer grid runtime tests
- production build
- browser or preview sanity check
- `git diff --check`

#### Done Shape

Phase 5 is done when Properties `Render > Grid` exists, the current grid checkbox behavior is represented as a `ParaSelect`, the current minor/major/double-major runtime grid is modeled as `Grid 1`, `Grid 2`, and `Grid 3`, and the user can tune grid visibility, height, spacing, color, and visual weight without affecting geometry, sketch grids, ground, materials, or exports.
