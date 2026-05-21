# Properties-5 - Render Section Detail And Feature Organization

## Doc Header

### Doc History
14. 2026-05-21 14:19:49: Added the next Ambient Occlusion phase ladder after `Properties-5 / Phase 2.4`, making GTAO the next implementation target and parking later engine comparison, engine-specific settings, ground-contact AO, resolution/performance, and stacking/custom-preset work as separate future phases.
13. 2026-05-21 13:39:41: Implemented `Properties-5 / Phase 2.3 - SAOPass AO Type` by adding `SAO` as a real Properties `AO Type` option backed by Three.js `SAOPass`, preserving `Basic SSAO` and `Off`, keeping unsupported AO engines out of the UI, and proving the multi-engine runtime boundary.
12. 2026-05-21 13:28:30: Split the AO engine expansion plan so `Properties-5 / Phase 2.3` owns adding `SAOPass` as the first real alternate AO type and new `Properties-5 / Phase 2.4` owns the later `GTAOPass` denoise/settings runtime contract.
11. 2026-05-21 13:24:53: Prepped `Properties-5 / Phase 2.3 - AO Engine Candidate Comparison` for implementation as the first real AO type expansion after the selector, focusing on adding a supported `SAO` option if runtime smoke proof passes while comparing `GTAO` as a candidate and keeping `N8AO` / `Ground Contact AO` out of the first code cut.
10. 2026-05-21 12:58:09: Implemented `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` by adding the saved `aoType` post-processing owner, a Properties `Render > Shadows` `AO Type` ParaSelect with `Off` and `Basic SSAO`, legacy `ssaoEnabled` migration, Basic SSAO runtime gating, and focused store/Properties/viewer proof.
9. 2026-05-21 12:28:09: Prepped `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` for implementation as an additive AO type contract and Properties ParaSelect, with `Off` and `Basic SSAO` as the first working options and `SAO`, `GTAO`, `N8AO`, and `Ground Contact AO` reserved as named follow-up candidates.
8. 2026-05-21 11:42:49: Clarified that the future AO type ParaSelect should show proper engine or strategy names in the user-facing Properties UI, with `Type 1 / Type 2 / Type 3` kept only as internal planning placeholders until the actual AO candidates are chosen.
7. 2026-05-21 11:23:33: Added the goal for a future AO type ParaSelect under Properties `Render > Shadows`, where Ambient Occlusion becomes `Off / Type 1 / Type 2 / Type 3` so different AO engines or strategies can be compared before one becomes the preferred clay-studio grounding path.
6. 2026-05-21 10:34:32: Implemented `Properties-5 / Phase 2 - Advanced Ambient Occlusion Controls` by adding saved AO Contact Bias and AO Distance Threshold settings, Properties `Render > Shadows` sliders, SSAO runtime mapping, and focused store/Properties/viewer proof.
5. 2026-05-21 10:13:04: Prepped `Properties-5 / Phase 2 - Advanced Ambient Occlusion Controls` for implementation against the current Three.js `SSAOPass` runtime, narrowing the first advanced AO cut to supported Contact Bias and Distance Threshold controls while reserving Resolution / Scale for a follow-up runtime-contract phase.
4. 2026-05-21 09:48:54: Implemented `Properties-5 / Phase 1 - Basic Ambient Occlusion Controls` by adding AO Intensity, AO Radius, and AO Quality to Properties `Render > Shadows`, adding `Custom` AO preset readback for diverged enabled settings, and preserving the existing AO preset and Contact Shadows separation.
3. 2026-05-21 09:33:47: Prepped `Properties-5 / Phase 1 - Basic Ambient Occlusion Controls` for implementation against the existing `ViewSettings.postProcessing` contract, Properties `Render > Shadows` section, AO preset helpers, viewer post-processing runtime, and focused store/Properties/viewer tests.
2. 2026-05-21 09:29:43: Added the Ambient Occlusion user-control ladder under Properties `Render > Shadows`, replacing the placeholder first phase with basic AO tuning controls and adding the advanced AO falloff, distance, and resolution phase.
1. 2026-05-21 08:59:48: Added this future planning doc as the next Properties `Render` detailing surface after the user asked to provide phases one by one for adding render features and organizing new Render sections.

### Purpose

This doc owns the next Properties `Render` detailing ladder after the first render-preset consolidation work.

Use it to:
- capture user-provided phases for the Properties `Render` section one by one
- add new render features as neutral settings before presets write them
- organize new sections and move existing controls into clearer groups
- keep `Display Mode`, `Render Preset`, and editable `Render Settings` understandable without collapsing them into one ambiguous control
- prepare implementation phases before touching runtime code

Do not use it to:
- change graph geometry, sketch truth, material authoring truth, or export output
- make render settings trigger geometry rebuilds
- hide new behavior inside preset identity without a visible setting owner
- combine `Display Mode` and `Render Preset` into one data concept without an explicit user-approved phase

## Doc Body

### Starting Point

`Properties-3` and `Properties-4` established the current Properties `Render` foundation:

- `Viewport Presentation`
  - `Display Mode`
  - `Render Preset`
- `Environment`
  - visible Environment Grade controls
- `Shadows`
  - hard shadows
  - Ambient Occlusion
  - selected-light shadow controls
- `Ground`
  - ground on/off
  - ground height
  - ground material
- `Grid`
  - grid on/off
  - grid height and size
  - `Grid 1` / `Grid 2` / `Grid 3` layer controls
- `Render Preview Quality`
  - render preview sampling and quality controls

The important vocabulary remains:

- `Display Mode` chooses the broad viewport rendering mode.
- `Render Preset` applies a starting recipe over normal render settings.
- `Render Settings` are the visible editable ingredients below the preset row.

### Phase Intake Rule

The user will provide `Properties-5` phases one by one.

When a new phase is provided:

- add it as the next top-level implementation phase in this doc
- preserve the user's intent in the `High Level Goals` block when it adds a new human-facing goal
- write a scoped implementation spec before implementation
- keep each phase small enough to implement and verify independently
- update the family index and tracking docs when the phase is prepped or shipped

### Boundary Rules

New render controls should be normal settings first.

Preset behavior should follow this order:

1. Add or expose the neutral setting.
2. Let the user edit it in Properties `Render`.
3. Let built-in presets apply values for it.
4. Let later custom presets read and save combinations of those settings.

Keep runtime-only viewer presentation details temporary until they have a visible setting or explicit contract.

## Vision

`Properties-5` should turn the Render section into a clearer, richer control surface without making it feel like a pile of unrelated switches.

The desired result is a Render section where:

- shadows, contact depth, and occlusion live together
- Ambient Occlusion exposes simple preset control first, then user-tunable advanced controls without muddying the default view
- ground and grid have clear separate ownership
- lighting, background, materials, and edge presentation can be added without becoming Clay Studio-only concepts
- presets become understandable starting points rather than hidden modes
- the user can tune any preset into their own look by changing visible controls

## Wishlist Organization

### High Level Goals

- [ ] `Properties-5-HLG-1. Detail the Properties Render section phase by phase from user-provided slices.`
- [ ] `Properties-5-HLG-2. Add new render features as visible neutral settings instead of hidden preset-only behavior.`
- [ ] `Properties-5-HLG-3. Organize new and existing Render sections so related controls live together.`
- [ ] `Properties-5-HLG-4. Preserve the separate concepts of Display Mode, Render Preset, and Render Settings unless a later explicit phase changes that.`
- [ ] `Properties-5-HLG-5. Make Ambient Occlusion user-tunable in Properties Render Shadows without making the default Shadows group feel overloaded.`
- [ ] `Properties-5-HLG-6. Let Ambient Occlusion support multiple selectable AO engines or strategies so clay-studio grounding can be compared instead of over-tuning one SSAO pass.`

### Codex Level Goals

- [ ] CLG 1. Keep each user-provided render-section slice in a bounded `Properties-5 / Phase N` section before implementation.
- [ ] CLG 2. Route new settings through existing `ViewSettings`, Properties, viewer, persistence, and test seams where possible.
- [ ] CLG 3. Keep presets as recipe writers over visible settings, not hidden behavior owners.
- [ ] CLG 4. Keep docs tracking current as each phase is prepped and shipped.

### `Properties-5 / Phase 1`

- [x] Add basic Ambient Occlusion tuning controls under Properties `Render > Shadows`.
- [x] Expose AO `Intensity`, `Radius`, and `Quality` as visible saved settings.
- [x] Keep the existing AO preset select as the quick control.
- [x] `Properties-5-HLG-1`
- [x] `Properties-5-HLG-2`
- [x] `Properties-5-HLG-3`
- [x] `Properties-5-HLG-5`

### `Properties-5 / Phase 2`

- [x] Add advanced Ambient Occlusion controls under Properties `Render > Shadows`.
- [x] Expose supported `Contact Bias` and `Distance Threshold` controls through the current SSAO runtime.
- [x] Split `Resolution / Scale` into a follow-up phase because the current runtime needs a separate composer/render-target contract before exposing it honestly.
- [x] Keep advanced controls grouped so default Shadows use stays simple.
- [x] `Properties-5-HLG-1`
- [x] `Properties-5-HLG-2`
- [x] `Properties-5-HLG-3`
- [x] `Properties-5-HLG-5`

### `Properties-5 / Phase 2.1`

- [ ] Add Ambient Occlusion `Resolution / Scale` after the runtime resolution contract is explicit.
- [ ] Decide whether AO resolution scales the whole post-processing composer, only the SSAO pass, or a future AO-only render target.
- [ ] Keep this deferred until after `Properties-5 / Phase 2.4` and reconcile it through `Properties-5 / Phase 2.8` once multiple AO engines exist.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-5`

### `Properties-5 / Phase 2.2`

- [x] Add a saved AO type owner and a Properties `AO Type` ParaSelect with proper user-facing names.
- [x] Make `Off` and `Basic SSAO` the first working options.
- [x] Keep the existing `Ambient Occlusion` preset select as the Basic SSAO preset/readback control for now.
- [x] Reserve `SAO`, `GTAO`, `N8AO`, and `Ground Contact AO` as named follow-up candidates after compatibility tests.
- [x] Do not stack AO engines by default until each type has a clear visual purpose and performance read.
- [x] `Properties-5-HLG-1`
- [x] `Properties-5-HLG-2`
- [x] `Properties-5-HLG-5`
- [x] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.3`

- [x] Add `SAO` as the first real alternate AO type after `Basic SSAO`.
- [x] Back the `SAO` option with Three.js `SAOPass` runtime behavior.
- [x] Keep `Basic SSAO` and `Off` behavior unchanged.
- [x] Keep `GTAO` out of this phase so it can get a separate denoise/settings contract.
- [x] Keep `N8AO` and custom `Ground Contact AO` out of scope until dependency/runtime ownership is explicitly planned.
- [x] `Properties-5-HLG-1`
- [x] `Properties-5-HLG-2`
- [x] `Properties-5-HLG-5`
- [x] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.4`

- [ ] Add `GTAO` as a separate AO type only after the SAO path proves the multi-engine runtime boundary.
- [ ] Give `GTAOPass` its own denoise/output/settings contract instead of squeezing it into the SAO pass.
- [ ] Decide which GTAO parameters should be user-facing and which should stay runtime defaults.
- [ ] Keep `N8AO`, custom `Ground Contact AO`, and AO stacking out of scope.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.5`

- [ ] Compare the shipped AO engines against the clay-studio grounding goal.
- [ ] Record which engine is best for tight creases, broad ground contact, and performance.
- [ ] Decide which AO engine should become the recommended Clay Studio-style starting point.
- [ ] Keep UI changes out unless the comparison reveals a small obvious default fix.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.6`

- [ ] Add engine-specific AO setting rows only for settings that users can understand and tune safely.
- [ ] Separate generic AO controls from Basic SSAO / SAO / GTAO-specific controls if the shared labels become misleading.
- [ ] Consider renaming saved `ssao*` fields to a generic AO contract only after migration and compatibility rules are explicit.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-3`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.7`

- [ ] Decide whether a dedicated `Ground Contact AO` strategy is needed after Basic SSAO, SAO, and GTAO are visible.
- [ ] Plan custom shader/runtime ownership only if shipped AO passes cannot create Revit/Pascal-style object-to-ground contact.
- [ ] Keep new dependencies or shader code out until the visual target and owner are clear.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.8`

- [ ] Return to AO `Resolution / Scale` after the active AO engines are known.
- [ ] Decide whether resolution is global composer scale, per-engine scale, or an AO-only target scale.
- [ ] Add user-facing quality/performance controls only where the runtime contract is honest.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

### `Properties-5 / Phase 2.9`

- [ ] Decide whether AO stacking should exist at all.
- [ ] If stacking is useful, define named combinations such as broad contact plus tight creases instead of raw multi-pass clutter.
- [ ] Keep custom render-preset save/readback separate unless the user explicitly pulls it into this phase.
- [ ] `Properties-5-HLG-1`
- [ ] `Properties-5-HLG-2`
- [ ] `Properties-5-HLG-4`
- [ ] `Properties-5-HLG-5`
- [ ] `Properties-5-HLG-6`

## [x] `Properties-5 / Phase 1` - `Basic Ambient Occlusion Controls`

### Phase 1 Summary

#### Purpose

Expose the existing Ambient Occlusion tuning settings that already map cleanly to the current `ViewSettings.postProcessing` contract.

This phase should make AO feel like a real user-adjustable shadow/depth setting instead of only a simple `Off / Low / Medium / High` preset.

#### Owns

- Properties `Render > Shadows` controls for:
  - `Ambient Occlusion`
  - `AO Intensity`
  - `AO Radius`
  - `AO Quality`
- Saved user edits through the existing post-processing settings owner.
- Preset-read behavior that can show the simple AO preset as `Custom` when numeric values diverge from `Off / Low / Medium / High`.

#### Does Not Own

- New runtime shader features beyond the current AO intensity/radius/quality support.
- Advanced AO controls:
  - Contact Bias / Falloff
  - Distance Threshold
  - Resolution / Scale
- Contact Shadow controls, which shipped in `Properties-4 / Phase 4.1`.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

### Phase 1 Implementation Spec

#### Prep Read

The current implementation already has the correct saved setting owner for the first AO controls:

- `ViewSettings.postProcessing.ssaoIntensity`
- `ViewSettings.postProcessing.ssaoRadius`
- `ViewSettings.postProcessing.ssaoQuality`

The current viewer post-processing runtime already consumes those fields:

- `src/viewer/postProcessingRuntime.ts`
  - maps `ssaoIntensity` into SSAO pass distance behavior
  - maps `ssaoRadius` into `kernelRadius`
  - maps `ssaoQuality` into kernel size
- `src/viewer/Viewer.ts`
  - updates the live post-processing runtime through `updateSettings(...)`
  - recreates the runtime when quality changes require a new kernel

This means Phase 1 should be a UI/readback/settings-proof slice, not a new renderer feature slice.

#### Current Code Seams

- `src/shared/viewSettingsTypes.ts`
  - `ViewPostProcessSettings`
  - `VIEW_AMBIENT_OCCLUSION_PRESET_OPTIONS`
  - `createViewAmbientOcclusionPresetSettings(...)`
  - `resolveViewAmbientOcclusionPresetRead(...)`
  - `normalizeViewPostProcessSettings(...)`
  - `MIN_VIEW_SSAO_INTENSITY`, `MAX_VIEW_SSAO_INTENSITY`
  - `MIN_VIEW_SSAO_RADIUS`, `MAX_VIEW_SSAO_RADIUS`
  - `VIEW_SSAO_QUALITY_OPTIONS`
- `src/app/workspace/PropertiesRenderSection.tsx`
  - existing `Ambient Occlusion` select in the `Shadows` group
  - existing `postProcessing` store read
  - existing `setViewKey('postProcessing', ...)` path
- `src/viewer/postProcessingRuntime.ts`
  - runtime proof that updates already consume intensity/radius/quality
- tests:
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/viewer/Viewer.test.ts`

#### Implementation Decisions

- Keep `Ambient Occlusion` as the first control in the AO cluster.
- Add `AO Intensity`, `AO Radius`, and `AO Quality` immediately under it.
- Use `ParaSlider` for:
  - `AO Intensity`
  - `AO Radius`
- Use `ParaSelect` for:
  - `AO Quality`
- Keep Contact Shadows below the AO cluster so the group reads:
  - hard shadows
  - Ambient Occlusion
  - AO tuning
  - Contact Shadows
  - selected-light shadows
- Add a `Custom` read value for the AO preset select when the saved `postProcessing` values do not exactly match `Off`, `Low`, `Medium`, or `High`.
  - This is a read/display state only.
  - Selecting an actual option should still write the full preset.
  - Do not add saved custom preset management.
- Keep advanced AO fields out of this phase:
  - Contact Bias / Falloff
  - Distance Threshold
  - Resolution / Scale

#### Exact First Code Cut

1. Keep the existing `Ambient Occlusion` preset select in Properties `Render > Shadows`.
2. Add AO numeric controls under the same Shadows group:
   - `AO Intensity`
     - user meaning: how dark/strong occlusion is
     - higher means deeper creases and more contact darkness
   - `AO Radius`
     - user meaning: how far AO searches around surfaces
     - lower means tighter crease detail
     - higher means broader soft grounding/contact depth
   - `AO Quality`
     - user meaning: sampling/detail level
     - lower is faster but rougher
     - higher is cleaner but more expensive
3. Use the existing `ViewSettings.postProcessing` fields where possible:
   - `ssaoIntensity`
   - `ssaoRadius`
   - `ssaoQuality`
4. Preserve existing AO preset writes.
   - Selecting `Off / Low / Medium / High` should still write a complete normalized post-processing preset.
   - Editing intensity/radius/quality should leave the saved settings editable and should not silently reset to a preset.
5. Add a readable custom state if the current values do not match a preset.
   - Suggested select read: `Custom`
   - Do not build saved custom preset management in this phase.

#### Detailed First Code Cut

1. Add an AO preset read type if needed.
   - suggested: `ViewAmbientOcclusionPresetRead = ViewAmbientOcclusionPreset | 'custom'`
   - update `resolveViewAmbientOcclusionPresetRead(...)` so diverged enabled AO values return `custom`
   - keep disabled AO values reading as `off`
2. Add a `Custom` option/read label to the Properties AO select.
   - if `ParaSelect` requires a selectable option for the current value, include `custom` as disabled or read-only if the component supports it
   - if disabled options are not supported, include `Custom` as a visible option but guard `onChange` so selecting `custom` does not write anything
3. Add AO tuning controls under the AO select.
   - `AO Intensity`
     - `min`: `MIN_VIEW_SSAO_INTENSITY`
     - `max`: `MAX_VIEW_SSAO_INTENSITY`
     - `step`: `0.01`
   - `AO Radius`
     - `min`: `MIN_VIEW_SSAO_RADIUS`
     - `max`: `MAX_VIEW_SSAO_RADIUS`
     - `step`: `0.01`
   - `AO Quality`
     - options: `Low`, `Medium`, `High`
4. Add a small local patch helper.
   - suggested: `updateAmbientOcclusionSettings(patch: Partial<ViewPostProcessSettings>)`
   - merge against the current `postProcessing`
   - write through `setViewKey('postProcessing', ...)`
   - let existing normalization clamp values
5. Keep AO settings separate from Contact Shadows.
   - no writes to `contactShadows`
   - no viewer ring changes

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts`
- `src/viewer/Viewer.test.ts`

#### Verification Shape

- AO preset select still writes `Off / Low / Medium / High`.
- AO Intensity edits only `postProcessing.ssaoIntensity`.
- AO Radius edits only `postProcessing.ssaoRadius`.
- AO Quality edits only `postProcessing.ssaoQuality`.
- The viewer post-processing runtime receives updated settings without geometry rebuilds.
- Existing Contact Shadows controls remain under the Shadows group and keep writing `contactShadows`.
- Production build and `git diff --check` pass.

#### Phase 1 Landed Read

- Properties `Render > Shadows` now exposes `AO Intensity`, `AO Radius`, and `AO Quality` directly under the existing `Ambient Occlusion` preset select.
- The AO preset select still writes the complete `Off / Low / Medium / High` post-processing presets.
- Diverged enabled AO values now read as `Custom` instead of pretending to still be `Low`, `Medium`, or `High`.
- Manual AO tuning writes through the existing saved `ViewSettings.postProcessing` owner and does not touch `ViewSettings.contactShadows`.
- Contact Shadows remain a separate Shadows-group control cluster below the AO controls.
- Focused store, Properties, and viewer tests pass for the existing runtime update path.

#### Focused Test Additions

- `src/app/store/uiPrefsStore.test.ts`
  - diverged AO enabled values read as `custom`
  - disabled AO values still read as `off`
  - existing `Off / Low / Medium / High` preset mappings remain stable
- `src/app/workspace/PropertiesSurface.test.tsx`
  - Shadows group includes `Ambient Occlusion`, `AO Intensity`, `AO Radius`, and `AO Quality`
  - changing AO Intensity writes only `postProcessing.ssaoIntensity`
  - changing AO Radius writes only `postProcessing.ssaoRadius`
  - changing AO Quality writes only `postProcessing.ssaoQuality`
  - selecting an AO preset still writes the complete preset
  - Contact Shadows controls remain present and keep using `contactShadows`
- `src/viewer/Viewer.test.ts`
  - existing post-processing runtime update proof remains valid for intensity/radius/quality
  - add or adjust focused proof only if UI edits expose a missing runtime update expectation

#### Required Verification

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 1 is done when Properties `Render > Shadows` gives users visible control over AO Intensity, Radius, and Quality while preserving the existing AO preset workflow and current viewer post-processing ownership.

## [x] `Properties-5 / Phase 2` - `Advanced Ambient Occlusion Controls`

### Phase 2 Summary

#### Purpose

Add the deeper Ambient Occlusion controls that map cleanly to the current Three.js `SSAOPass` runtime.

This phase should make AO more art-directable without turning the basic Shadows group into an intimidating wall of sliders.

#### Owns

- Properties `Render > Shadows` advanced AO controls for:
  - `AO Contact Bias`
  - `Distance Threshold`
  - a small `Advanced AO` grouping affordance if the current section needs visual separation.
- Additive saved settings under the existing post-processing owner.
- Viewer post-processing runtime mapping for the new settings.

#### Does Not Own

- Replacing the existing AO preset system.
- Adding a new post-processing engine unless the current runtime cannot support the controls.
- Contact Shadow ring color/count/ratio controls.
- Ambient Occlusion `Resolution / Scale`.
  - This needs a follow-up runtime decision because the current composer owns one post-processing size path, not an AO-only internal-resolution contract.
- A custom AO shader/pass or continuous falloff curve beyond the current `SSAOPass` distance window.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

### Phase 2 Implementation Spec

#### Prep Read

The current runtime already maps basic AO settings into `SSAOPass`:

- `ssaoQuality` -> kernel size
- `ssaoRadius` -> `SSAOPass.kernelRadius`
- `ssaoIntensity` -> derived `SSAOPass.minDistance` and `SSAOPass.maxDistance`

The current Three.js pass exposes two threshold fields that line up with the next user-facing controls:

- `SSAOPass.minDistance`
  - repo-facing meaning for this phase: `AO Contact Bias`
  - human meaning: prevents tiny near-surface depth differences from becoming dirty AO artifacts
- `SSAOPass.maxDistance`
  - repo-facing meaning for this phase: `AO Distance Threshold`
  - human meaning: prevents surfaces that are too far apart from darkening each other

`Resolution / Scale` is not a safe same-phase UI control yet because the current runtime only has one composer `setSize(...)` path. It needs a follow-up phase to decide whether the whole post-processing composer, only the AO buffer, or a future AO-specific render target owns that scale.

#### Current Code Seams

- `src/shared/viewSettingsTypes.ts`
  - `ViewPostProcessSettings`
  - `normalizeViewPostProcessSettings(...)`
  - AO preset helpers and preset equality/readback
  - SSAO min/max/default constants near existing intensity/radius constants
- `src/viewer/postProcessingRuntime.ts`
  - `resolveSsaoRuntimeSettings(...)`
  - live `ssaoPass.minDistance` / `ssaoPass.maxDistance` updates
- `src/viewer/Viewer.ts`
  - existing post-processing runtime update/recreate path
- `src/app/workspace/PropertiesRenderSection.tsx`
  - existing `Render > Shadows` AO cluster
  - `updateAmbientOcclusion(...)` patch helper
- tests:
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/viewer/Viewer.test.ts`

#### Implementation Decisions

- Add two new saved fields to `ViewPostProcessSettings`:
  - `ssaoContactBias`
  - `ssaoDistanceThreshold`
- Place both controls under the existing AO cluster, after `AO Quality` and before `Contact Shadows`.
- Use `ParaSlider` for both controls.
- Keep labels human-readable:
  - `AO Contact Bias`
  - `AO Distance Threshold`
- Keep the existing AO preset select and Phase 1 controls visible.
- Update built-in AO preset definitions so preset selection writes the new advanced fields too.
- Update preset equality and `Custom` readback so changing either advanced field makes the AO preset select read `Custom`.
- Preserve existing visual behavior as much as possible by setting preset defaults to match the current derived runtime values.
- Do not add an inert `Resolution / Scale` control in this phase.

#### Exact First Code Cut

1. Extend the AO settings contract additively.
   - `ssaoContactBias`
     - user meaning: how quickly near-contact AO begins after tiny depth differences
     - runtime mapping: `SSAOPass.minDistance`
     - goal: reduce dirty/self-occlusion artifacts near contact areas
   - `ssaoDistanceThreshold`
     - user meaning: max distance where surfaces can affect each other
     - runtime mapping: `SSAOPass.maxDistance`
     - goal: avoid broad muddy shading between far-apart surfaces
2. Add normalization defaults and persistence/copy coverage.
   - Add min/max/default constants beside the existing SSAO intensity/radius constants.
   - Suggested starting ranges:
     - `ssaoContactBias`: `0` to `0.02`, default `0.003`
     - `ssaoDistanceThreshold`: `0.025` to `0.35`, default `0.1`
   - Use preset-specific values that preserve the current low/medium/high runtime look:
     - Low distance threshold near `0.066`
     - Medium distance threshold near `0.087`
     - High distance threshold near `0.104`
     - Contact bias values derived from the current intensity formula unless implementation testing suggests a clearer default.
3. Add an `Advanced AO` control cluster under `Render > Shadows`.
   - Keep the basic `Ambient Occlusion`, `AO Intensity`, `AO Radius`, and `AO Quality` controls visible.
   - Place `AO Contact Bias` and `AO Distance Threshold` under them.
   - Keep Contact Shadows below the AO cluster.
4. Map the new settings into the viewer post-processing runtime.
   - `resolveSsaoRuntimeSettings(...)` should read saved bias/threshold directly instead of deriving both only from intensity.
   - `updateSettings(...)` should live-update `ssaoPass.minDistance` and `ssaoPass.maxDistance` without runtime recreation when quality stays the same.
5. Add focused proof for settings writes, runtime mapping, default normalization, and build safety.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/viewer/postProcessingRuntime.ts`
- `src/viewer/Viewer.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts`
- `src/viewer/Viewer.test.ts`

#### Verification Shape

- Advanced AO settings normalize to safe defaults.
- User edits write only the intended post-processing fields.
- Viewer runtime receives Contact Bias and Distance Threshold and live-updates the active SSAO pass.
- AO preset selection still writes complete known preset values.
- Editing Contact Bias or Distance Threshold makes the AO preset select read `Custom`.
- Contact Shadows remain separate from AO and continue using `ViewSettings.contactShadows`.
- Production build and `git diff --check` pass.

#### Phase 2 Landed Read

- `ViewSettings.postProcessing` now includes saved `ssaoContactBias` and `ssaoDistanceThreshold` values.
- Properties `Render > Shadows` now exposes `AO Contact Bias` and `AO Distance Threshold` sliders below the Phase 1 AO controls and above Contact Shadows.
- AO presets now write stable advanced AO values, and changing either advanced value makes the Ambient Occlusion preset select read `Custom`.
- The viewer SSAO runtime now maps the saved values directly into `SSAOPass.minDistance` and `SSAOPass.maxDistance`.
- Resolution / Scale remains reserved for `Properties-5 / Phase 2.1`.

#### Focused Test Additions

- `src/app/store/uiPrefsStore.test.ts`
  - default normalization fills the new advanced AO fields for legacy settings
  - invalid advanced AO values clamp to safe ranges
  - AO presets include stable advanced values
  - diverged advanced AO values read as `custom`
- `src/app/workspace/PropertiesSurface.test.tsx`
  - Shadows group includes `AO Contact Bias` and `AO Distance Threshold`
  - changing each slider writes only the intended `postProcessing` field
  - Contact Shadows controls remain separate and still write `contactShadows`
- `src/viewer/Viewer.test.ts`
  - `resolveSsaoRuntimeSettings(...)` maps the saved fields into `minDistance` and `maxDistance`
  - live settings updates forward the changed bias/threshold to the existing SSAO pass without requiring quality/kernel recreation

#### Required Verification

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2 is done when users can tune AO Contact Bias and Distance Threshold from Properties `Render > Shadows` through real saved settings and runtime behavior, with Resolution / Scale reserved for the explicit Phase 2.1 runtime-contract follow-up instead of hidden behind an inert control.

## [ ] `Properties-5 / Phase 2.1` - `Ambient Occlusion Resolution Scale Contract`

### Phase 2.1 Summary

#### Purpose

Add AO `Resolution / Scale` only after the runtime ownership is explicit.

This phase should decide whether the control scales:

- the full post-processing composer
- only the SSAO buffer/pass
- a future AO-specific render target

#### Does Not Own

- Contact Bias or Distance Threshold, which belong to Phase 2.
- Render Preview sample count or path-tracer resolution.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

#### First Planning Read

Do not implement a user-facing `Resolution / Scale` control until the runtime path can make the quality/performance tradeoff real and testable.

## [x] `Properties-5 / Phase 2.2` - `Ambient Occlusion Type Select`

### Phase 2.2 Summary

#### Purpose

Move Ambient Occlusion toward a selectable engine/strategy model instead of treating one SSAO pass as the only possible AO behavior.

This phase should create the contract and UI slot for comparing AO engines without forcing the project to choose every future AO renderer in the first implementation pass.

The user-facing goal is a `ParaSelect` with proper AO engine or strategy names, such as:

- `Off`
- `Basic SSAO`
- `SAO`
- `GTAO`
- `N8AO`
- `Ground Contact AO`

`Type 1 / Type 2 / Type 3` may be useful as internal planning placeholders while candidates are being compared, but those labels should not ship in the Properties UI.

#### Owns

- A saved AO type owner.
- A Properties `Render > Shadows` `AO Type` ParaSelect with proper user-facing names.
- `Off` and `Basic SSAO` as the first working options.
- Keeping the existing `Ambient Occlusion` preset select as the Basic SSAO preset/readback control for now.
- Letting the runtime decide whether post-processing AO should be active from the AO type plus existing display-mode/render-preview rules.
- Reserving later named options for alternate AO strategies after compatibility testing.

#### Does Not Own

- Choosing final option names blindly before an engine comparison.
- Implementing `SAO`, `GTAO`, `N8AO`, or `Ground Contact AO` behavior in the first code cut.
- Stacking AO engines by default.
- Replacing Contact Shadows or ground-contact shadows.
- Removing the existing Ambient Occlusion preset select.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

### Phase 2.2 Implementation Spec

#### Prep Read

The current installed Three version already includes these candidate pass files:

- `three/examples/jsm/postprocessing/SSAOPass.js`
- `three/examples/jsm/postprocessing/SAOPass.js`
- `three/examples/jsm/postprocessing/GTAOPass.js`

The current runtime has one post-processing helper:

- `src/viewer/postProcessingRuntime.ts`
  - creates an `EffectComposer`
  - adds `RenderPass`
  - adds the current `SSAOPass`
  - adds `OutputPass`
  - maps current `ViewSettings.postProcessing` fields into the active SSAO pass

The first implementation should not widen into an engine bake-off yet. It should add the saved/type-selection seam and keep the current behavior available as `Basic SSAO`.

#### Current Code Seams

- `src/shared/viewSettingsTypes.ts`
  - `ViewPostProcessSettings`
  - post-processing defaults and normalization
  - Ambient Occlusion preset helpers
  - render-preset recipe helpers
- `src/app/workspace/PropertiesRenderSection.tsx`
  - existing `Ambient Occlusion` preset select
  - existing AO tuning controls
  - existing `updateAmbientOcclusion(...)` patch helper
- `src/viewer/postProcessingRuntime.ts`
  - current Basic SSAO runtime
- `src/viewer/Viewer.ts`
  - post-processing enable/update/recreate branch
- tests:
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/app/workspace/PropertiesSurface.test.tsx`
  - `src/viewer/Viewer.test.ts`

#### Implementation Decisions

- Add a new AO type enum/string union.
  - suggested public type: `ViewAmbientOcclusionType`
  - first supported values:
    - `off`
    - `basicSsao`
  - reserved later values:
    - `sao`
    - `gtao`
    - `n8ao`
    - `groundContactAo`
- Add `VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS`.
- Add `DEFAULT_VIEW_AMBIENT_OCCLUSION_TYPE`.
- Add `aoType` or `ambientOcclusionType` to `ViewPostProcessSettings`.
  - recommended: `aoType`
  - default: `off`
- Keep `ssaoEnabled` during the first cut as a compatibility bridge.
  - `aoType: 'off'` should normalize/write `ssaoEnabled: false`.
  - `aoType: 'basicSsao'` should normalize/write `ssaoEnabled: true`.
  - legacy settings with `ssaoEnabled: true` and no `aoType` should normalize to `basicSsao`.
  - legacy settings with `ssaoEnabled: false` and no `aoType` should normalize to `off`.
- Add a Properties `AO Type` ParaSelect above the existing `Ambient Occlusion` preset select.
  - labels:
    - `Off`
    - `Basic SSAO`
  - do not show `Type 1 / Type 2 / Type 3`.
- Keep the existing `Ambient Occlusion` preset select for Basic SSAO presets.
  - Suggested first-cut behavior: leave it visible for now even when AO Type is `Off`, but selecting a preset should set `aoType: 'basicSsao'` except selecting `Off`, which should set `aoType: 'off'`.
  - A later polish pass may disable or visually tuck SSAO-only controls when a non-SSAO AO type is selected.
- Do not add SAO/GTAO/N8AO UI options until they are actually runtime-supported.
  - The doc can reserve names, but the app should not expose dead choices.

#### Exact First Code Cut

1. Extend `ViewPostProcessSettings` with `aoType`.
2. Add normalization and legacy migration behavior.
3. Update AO preset helpers:
   - `Off` writes `aoType: 'off'` and `ssaoEnabled: false`.
   - `Low / Medium / High` write `aoType: 'basicSsao'` and `ssaoEnabled: true`.
4. Add `AO Type` options and labels in `PropertiesRenderSection.tsx`.
5. Add `handleAmbientOcclusionTypeChange(...)`.
   - `Off` writes `aoType: 'off'` and `ssaoEnabled: false`.
   - `Basic SSAO` writes `aoType: 'basicSsao'` and `ssaoEnabled: true` while preserving current SSAO tuning values.
6. Update the viewer post-processing gate so Basic SSAO remains the only active runtime AO type in this phase.
7. Add focused tests for:
   - default normalization
   - legacy `ssaoEnabled` -> `aoType` migration
   - Properties `AO Type` writes
   - AO presets writing the correct `aoType`
   - viewer runtime only creates Basic SSAO when `aoType === 'basicSsao'`

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-5 - Render Section Detail And Feature Organization.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Verification Shape

- The Properties Shadows group shows `AO Type` with `Off` and `Basic SSAO`.
- `Off` disables post-processing AO.
- `Basic SSAO` preserves the current SSAO runtime path.
- Selecting AO presets still works and updates the AO type correctly.
- Legacy persisted settings without `aoType` normalize correctly.
- No dead `SAO`, `GTAO`, `N8AO`, or `Ground Contact AO` options ship yet.
- Production build and `git diff --check` pass.

#### Required Verification

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2.2 is done when Properties `Render > Shadows` has a saved, named `AO Type` selector where `Off` and `Basic SSAO` work correctly, while future AO engines remain planned names instead of inert UI options.

#### Phase 2.2 Landed Read

Phase 2.2 shipped the saved AO type owner as `ViewPostProcessSettings.aoType`.

The first working user-facing options are:

- `Off`
- `Basic SSAO`

`ssaoEnabled` remains as a compatibility bridge, but normalized view settings now derive it from `aoType` when the type is present. Legacy saved settings without `aoType` still migrate from the old `ssaoEnabled` value.

Properties `Render > Shadows` now shows `AO Type` above the existing `Ambient Occlusion` preset select. Selecting `Basic SSAO` preserves the current SSAO tuning values, selecting `Off` disables runtime AO, and selecting AO presets writes the correct AO type.

The viewer post-processing branch now treats `Basic SSAO` as the only active runtime AO type for this phase. `SAO`, `GTAO`, `N8AO`, and `Ground Contact AO` remain planned candidate names only; no dead options ship in the UI.

Focused proof covered store normalization/migration, Properties AO type and preset writes, viewer runtime gating, the focused viewer post-processing tests, and production build verification.

### Phase 2.2 Later Candidate Read

Potential AO option meanings:

- `Off`
  - no post-processing AO
- `Basic SSAO`
  - current Three.js `SSAOPass`
  - best for tight crease/detail exploration
- `SAO` or `GTAO`
  - candidate alternate AO engine such as `SAOPass` or a compatible GTAO path
  - goal: broader and more stable object/ground contact
- `N8AO` or `Ground Contact AO`
  - candidate high-quality/art-directed AO path such as N8AO or a custom ground-contact-focused strategy
  - goal: closer to the Pascal/Revit clay-studio grounding reference

Stacking can be explored later, but only after each type has a clear job. A likely future hybrid would be:

- one AO type for broad ground/contact grounding
- one subtle pass for tight crease detail
- Contact Shadows for explicit floor receiver shadows

Do not make stacking the default until performance, haloing, double-darkening, and ground behavior are tested.

## [x] `Properties-5 / Phase 2.3` - `SAOPass AO Type`

### Phase 2.3 Summary

#### Purpose

Turn the new `AO Type` selector into a real comparison tool by adding `SAO` as the first supported alternate AO engine beside `Basic SSAO`.

The product goal is to test a higher-quality built-in Three AO pass against the current Basic SSAO path without widening into every possible AO engine at once.

#### Owns

- Adding `SAO` as a real supported AO type option if it can be proven through runtime smoke tests.
- Backing `SAO` with Three.js `SAOPass`.
- Keeping `Basic SSAO` unchanged as the baseline.
- Keeping `Off` unchanged as the no-AO option.
- Updating the post-processing runtime to choose the correct AO pass from `ViewPostProcessSettings.aoType`.
- Focused proof that unsupported or unimplemented AO names do not appear in the UI.

#### Does Not Own

- Adding placeholder `Type 1 / Type 2 / Type 3` labels.
- Shipping `GTAO`.
- Adding `N8AO` or any new package dependency.
- Building a custom `Ground Contact AO` shader.
- Stacking AO engines.
- Hiding or removing Basic SSAO tuning controls.
- Solving all ground-plane AO/contact-shadow quality issues in one pass.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

### Phase 2.3 Implementation Spec

#### Prep Read

The current app already has the AO type owner from Phase 2.2:

- `ViewPostProcessSettings.aoType`
- `VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS`
- Properties `Render > Shadows` `AO Type`
- viewer runtime gating through `isViewBasicSsaoEnabled(...)`

The current installed Three.js package includes the SAO pass file:

- `node_modules/three/examples/jsm/postprocessing/SAOPass.js`

Local `SAOPass` read:

- `SAOPass`
  - constructor shape: `new SAOPass(scene, camera, resolution?)`
  - exposes `params.saoBias`, `params.saoIntensity`, `params.saoScale`, `params.saoKernelRadius`, `params.saoMinResolution`, and blur params
  - Three docs comment says it is better quality than `SSAOPass` but more expensive
  - first candidate because it is closer to the current composer shape than `GTAOPass`

#### Implementation Decisions

- Implementation target is `SAO`.
- Extend the public AO type union only for options that actually ship.
  - add `sao` only if the runtime pass is created, resized, rendered, disposed, and tested
  - do not add `gtao`, `n8ao`, or `groundContactAo` to `VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS` unless the implementation truly supports them
- Keep the Properties label proper and simple:
  - `SAO`
- Keep `Basic SSAO` as the baseline option and current preset/tuning owner.
- Let `SAO` reuse the current AO tuning fields for the first pass where the mapping is reasonable:
  - `ssaoIntensity` -> SAO intensity
  - `ssaoRadius` -> SAO kernel radius or scale mapping
  - `ssaoContactBias` -> SAO bias
  - `ssaoDistanceThreshold` -> only map if there is a real equivalent; otherwise leave unmapped and document it
  - `ssaoQuality` -> blur/sample/kernel profile if needed
- If the mapping feels too misleading during implementation, add an explicit landed note and keep SAO behind runtime defaults rather than inventing inaccurate labels.
- Do not rename existing `ssao*` fields in this phase.
  - They are currently the saved AO tuning bridge.
  - A later cleanup can rename them to generic `ao*` after multiple engines settle.

#### Exact First Code Cut

1. Add `sao` to `ViewAmbientOcclusionType` only after runtime support is ready.
2. Add `SAO` to `VIEW_AMBIENT_OCCLUSION_TYPE_OPTIONS` and Properties labels.
3. Replace the runtime's Basic-SSAO-only factory branch with an AO pass branch:
   - `basicSsao` -> current `SSAOPass`
   - `sao` -> new `SAOPass`
   - `off` -> no post-processing runtime
4. Keep the runtime type-specific implementation small.
   - A helper or small branch is fine.
   - Do not build a large abstraction until there are at least two working engines with shared needs.
5. Make `updateSettings(...)` return `false` when the AO type changes.
   - This lets the existing viewer dispose/recreate runtime cleanly between `Basic SSAO` and `SAO`.
6. Map resize/dispose behavior for `SAOPass`.
   - Ensure composer resize still works.
   - Dispose pass-owned targets/materials if the pass exposes `dispose()`.
7. Add focused tests:
   - Properties `AO Type` includes `SAO` only when supported.
   - selecting `SAO` writes `aoType: 'sao'`.
   - viewer creates an SAO runtime path for `aoType: 'sao'`.
   - changing between `basicSsao` and `sao` recreates the runtime.
   - `Off` still disables the runtime.
   - `GTAO`, `N8AO`, and `Ground Contact AO` are not present in the UI yet.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts`
- `src/viewer/postProcessingRuntime.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-5 - Render Section Detail And Feature Organization.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Verification Shape

- `AO Type` shows `Off`, `Basic SSAO`, and `SAO`.
- `SAO` is backed by a real runtime pass, not a dead option.
- `Basic SSAO` behavior and tests remain stable.
- `Off` still disposes/disables post-processing AO.
- Switching AO type recreates the post-processing runtime when needed.
- No unimplemented AO names appear in Properties.
- Production build and `git diff --check` pass.

#### Required Verification

- `npm.cmd test -- src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2.3 is done when the Properties `AO Type` selector has one additional real AO engine option backed by runtime behavior and proof, with unsupported candidates kept out of the UI and documented as future comparison work.

#### Phase 2.3 Landed Read

- Properties `Render > Shadows > AO Type` now shows `Off`, `Basic SSAO`, and `SAO`.
- `SAO` is backed by Three.js `SAOPass` inside the existing post-processing composer path.
- `Basic SSAO` still uses the existing `SSAOPass` path, and `Off` still prevents AO runtime creation.
- Runtime AO selection now recreates the post-processing runtime when the AO type changes so the pass implementation swaps cleanly.
- The saved compatibility mirror keeps `ssaoEnabled: true` for any non-off AO type while `aoType` remains the real type owner.
- The simple Ambient Occlusion preset read shows `Custom` for `SAO`; picking a strength preset returns the type to `Basic SSAO`.
- `GTAO`, `N8AO`, and custom `Ground Contact AO` remain out of the UI until their runtime paths are separately planned and proven.
- Next AO engine handoff is `Properties-5 / Phase 2.4 - GTAOPass AO Type`.

#### First Planning Read

Start and finish this phase with `SAO`. It is the most honest first comparison because it is already available in Three, has a smaller constructor/runtime shape than `GTAO`, and directly represents the next quality step beyond the current `SSAOPass`.

Keep `GTAO` close as Phase 2.4, but do not force it into the SAO pass. `N8AO` and custom ground-contact AO should get separate future phases because they imply dependency choice or custom shader ownership.

## [ ] `Properties-5 / Phase 2.4` - `GTAOPass AO Type`

### Phase 2.4 Summary

#### Purpose

Add `GTAO` as its own AO type after the SAO runtime path proves the multi-engine post-processing boundary.

The product goal is to evaluate a richer, denoised AO pass for broader and more stable object-to-ground contact without overloading the simpler SAO implementation phase.

#### Owns

- Adding `GTAO` as a real supported AO type option if runtime proof passes.
- Backing `GTAO` with Three.js `GTAOPass`.
- Deciding the first GTAO runtime defaults and which settings, if any, should become visible Properties controls later.
- Keeping `Basic SSAO`, `SAO`, and `Off` behavior stable.
- Focused proof that switching between AO engines recreates or updates the runtime correctly.

#### Does Not Own

- Reworking the SAO implementation.
- Adding `N8AO` or any new package dependency.
- Building a custom `Ground Contact AO` shader.
- Stacking AO engines.
- Exposing every GTAO internal parameter as a user slider in the first pass.
- Saved custom render-preset management.
- Graph geometry, material truth, real light truth, or export truth.

### Phase 2.4 Implementation Spec

#### Prep Read

The current installed Three.js package includes:

- `node_modules/three/examples/jsm/postprocessing/GTAOPass.js`

Local `GTAOPass` read:

- constructor shape: `new GTAOPass(scene, camera, width, height, parameters, aoParameters, pdParameters)`
- exposes AO parameters such as:
  - `radius`
  - `distanceExponent`
  - `thickness`
  - `distanceFallOff`
  - `scale`
  - `samples`
- includes denoise/output controls
- likely visually stronger than SAO, but it needs a clearer runtime/settings/readback contract than SAO

#### Implementation Decisions

- Add `gtao` to `ViewAmbientOcclusionType` only when the runtime path is real.
- Add the user-facing label `GTAO`.
- Use explicit GTAO defaults first.
- Do not expose GTAO-specific sliders until the first runtime result is visible and stable.
- If existing generic AO controls can map honestly, use them cautiously:
  - `ssaoIntensity` may map to blend intensity or scale.
  - `ssaoRadius` may map to GTAO radius.
  - `ssaoQuality` may map to samples/denoise profile.
  - `ssaoContactBias` and `ssaoDistanceThreshold` should not be force-mapped unless there is a clear GTAO equivalent.
- Keep the existing `ssao*` field names for this phase; rename to generic `ao*` only in a later cleanup after multiple engines settle.

#### Exact First Code Cut

1. Add `gtao` to the AO type union and options only after runtime support is ready.
2. Add `GTAO` to the Properties `AO Type` labels.
3. Extend the post-processing runtime branch:
   - `basicSsao` -> current `SSAOPass`
   - `sao` -> `SAOPass`
   - `gtao` -> `GTAOPass`
   - `off` -> no post-processing runtime
4. Map GTAO resize, render, update, and dispose behavior.
5. Make `updateSettings(...)` recreate the runtime when switching between AO engines.
6. Add focused tests:
   - Properties `AO Type` includes `GTAO` only when supported.
   - selecting `GTAO` writes `aoType: 'gtao'`.
   - viewer creates a GTAO runtime path for `aoType: 'gtao'`.
   - switching between `basicSsao`, `sao`, and `gtao` recreates the runtime when needed.
   - `Off` still disables the runtime.
   - `N8AO` and `Ground Contact AO` are not present in the UI yet.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/uiPrefsStore.test.ts`
- `src/viewer/postProcessingRuntime.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-5 - Render Section Detail And Feature Organization.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Verification Shape

- `AO Type` shows `Off`, `Basic SSAO`, `SAO`, and `GTAO`.
- `GTAO` is backed by a real runtime pass, not a dead option.
- Existing `Basic SSAO` and `SAO` behavior remain stable.
- `Off` still disposes/disables post-processing AO.
- Switching AO type recreates the post-processing runtime when needed.
- No unimplemented AO names appear in Properties.
- Production build and `git diff --check` pass.

#### Required Verification

- `npm.cmd test -- src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 2.4 is done when `GTAO` is a real Properties `AO Type` option backed by runtime behavior and proof, with its denoise/settings complexity documented instead of being hidden inside the simpler SAO phase.

## [ ] `Properties-5 / Phase 2.5` - `AO Engine Visual Comparison And Default Direction`

### Phase 2.5 Summary

#### Purpose

Compare `Basic SSAO`, `SAO`, and `GTAO` against the real clay-studio contact goal before adding more controls.

The product question is simple: which engine makes boxes feel grounded on the floor, which engine handles tight corners, and which one is worth making the recommended preset starting point?

#### Owns

- Visual comparison of the shipped AO engines.
- A small written read of strengths and weaknesses:
  - tight crease detail
  - broad object-to-ground contact
  - visible halos or back-side bleed
  - performance feel
  - stability during camera movement
- Recommendation for the next default or preset recipe.
- A follow-up list of settings that need user control.

#### Does Not Own

- Adding a new AO engine.
- Adding custom shaders.
- Adding AO stacking.
- Renaming saved AO fields.
- Saved custom render-preset management.

#### Done Shape

Phase 2.5 is done when the team has a written comparison of the shipped AO engines and one recommended next direction for clay-studio-style grounding.

## [ ] `Properties-5 / Phase 2.6` - `Engine-Specific AO Settings And Generic AO Contract`

### Phase 2.6 Summary

#### Purpose

Expose the AO settings that only make sense after multiple engines exist, without pretending every AO engine uses the same knobs.

This is where shared labels such as `AO Radius` can either stay generic or split into engine-specific rows if the visual meaning diverges.

#### Owns

- Deciding which settings are generic across AO engines.
- Deciding which settings are Basic SSAO-only, SAO-only, or GTAO-only.
- Adding visible Properties rows for high-value engine-specific settings.
- Planning any saved-settings migration from `ssao*` names to generic `ao*` names.

#### Does Not Own

- Adding new AO engines.
- Building a custom ground-contact shader.
- Saved custom render-preset management.
- Collapsing Display Mode and Render Preset.

#### Done Shape

Phase 2.6 is done when Properties shows only honest AO controls for the selected engine, and the saved AO contract has either a clear migration plan or a deliberate compatibility read for keeping current names longer.

## [ ] `Properties-5 / Phase 2.7` - `Ground Contact AO Decision`

### Phase 2.7 Summary

#### Purpose

Decide whether ParaHook needs a dedicated ground-contact AO strategy after the built-in AO engines have been compared.

This phase exists because the desired Revit/Pascal-like look may require a pass that understands floor contact more directly than generic screen-space AO.

#### Owns

- Deciding whether `Ground Contact AO` should become a real AO type.
- Defining whether it is:
  - a custom shader/pass
  - a contact-shadow extension
  - a preset recipe using existing AO plus Contact Shadows
  - not needed
- Capturing the first implementation boundary if it is needed.

#### Does Not Own

- Implementing the custom shader.
- Adding new dependencies.
- Stacking multiple AO engines.
- Changing graph geometry, material truth, real light truth, or export truth.

#### Done Shape

Phase 2.7 is done when `Ground Contact AO` is either rejected, deferred with a clear reason, or promoted into a separate implementation phase with a real runtime owner.

## [ ] `Properties-5 / Phase 2.8` - `AO Resolution Scale And Performance Controls`

### Phase 2.8 Summary

#### Purpose

Return to AO `Resolution / Scale` after the app has more than one AO engine, so the quality/performance control maps to the actual runtime shape.

#### Owns

- Deciding whether AO resolution belongs to:
  - the full post-processing composer
  - each AO pass
  - an AO-only render target
  - engine-specific quality profiles
- Adding user-facing resolution/performance controls only where the behavior is predictable.
- Keeping defaults usable on normal scenes.

#### Does Not Own

- New AO engines.
- Custom ground-contact shader work.
- Saved custom render-preset management.
- Broader render-preview sampling controls.

#### Done Shape

Phase 2.8 is done when AO quality/performance controls are honest for the shipped AO engines and do not imply a fake universal resolution behavior.

## [ ] `Properties-5 / Phase 2.9` - `AO Stacking And Preset Recipes`

### Phase 2.9 Summary

#### Purpose

Decide whether AO stacking is useful enough to expose, or whether presets should simply choose one AO engine plus Contact Shadows.

#### Owns

- Testing whether layered AO creates better grounding or just double-darkens the scene.
- Defining any stackable recipes by purpose:
  - broad ground contact
  - tight crease detail
  - soft contact shadowing
- Deciding whether stack controls should be user-facing, preset-only, or rejected.

#### Does Not Own

- Full saved custom render-preset management unless explicitly pulled in later.
- Adding new AO engines.
- Rewriting the whole Render section.

#### Done Shape

Phase 2.9 is done when AO stacking has a clear yes/no product decision and any accepted stack behavior is expressed as understandable preset recipes rather than raw technical clutter.
