# Properties-7 - Environment Light Settings Extraction

## Doc Header

### Doc History

3. 2026-05-22 16:09:28: Implemented and closed `Properties-7` Phases 1 through 6 after Properties Render gained the Environment Lights browser/editor, type-aware selected-light controls, light list actions, preset recipe restoration/readback, shadow quality fields, and real `rectArea` support.
2. 2026-05-22 15:47:07: Updated `Properties-7 / Phase 1` so the Environment Lights section begins with a compact mini light browser for selecting the environment light before editing its settings.
1. 2026-05-22 15:40:13: Created the docs-only `Properties-7` future plan for extracting environment light controls from the narrow selected-light shadow read into a fuller Properties `Render > Environment Lights` section.

### Purpose

Plan the next Properties Render light-control surface before runtime implementation starts.

This phase exists because the current Properties Render surface can edit some selected-light shadow values, but the fuller light model already has more user-editable presentation settings: brightness, color, light type, direction, position, distance, falloff, spotlight cone shape, and shadow quality.

### Source Read

Primary external light-model references:
- Three.js `Light`: https://threejs.org/docs/pages/Light.html
- Three.js `DirectionalLight`: https://threejs.org/docs/api/en/lights/DirectionalLight
- Three.js `PointLight`: https://threejs.org/docs/pages/PointLight.html
- Three.js `SpotLight`: https://threejs.org/manual/en/lights.html
- Three.js `HemisphereLight`: https://threejs.org/docs/api/en/lights/HemisphereLight.html
- Three.js `RectAreaLight`: https://threejs.org/manual/en/lights.html
- Three.js `LightShadow`: https://threejs.org/docs/api/en/lights/shadows/LightShadow.html

Local source read:
- `src/shared/viewSettingsTypes.ts` defines the saved `LightSpec` contract for `directional`, `point`, `spot`, `hemisphere`, and `ambient` lights.
- `src/app/store/uiPrefsStore.ts` already normalizes type-specific light defaults and clears settings that do not apply to a selected light type.
- `src/app/components/ViewToolbar.tsx` already contains a fuller selected-light editor with type, color, intensity, position, target, distance, decay, spot angle, penumbra, and shadow controls.
- `src/app/workspace/PropertiesRenderSection.tsx` currently exposes only selected-light shadow controls from that wider model.
- `src/viewer/Viewer.ts` maps saved light specs into Three.js light instances.

## Doc Body

### Family Phase Goal

Make Properties `Render` the normal place to inspect and customize environment lights, while keeping the viewer as the runtime owner and keeping light settings downstream from saved presentation settings.

The immediate goal is not to invent a new lighting engine. It is to move the editable light settings that already exist in the saved model and View Toolbar into a clearer Properties section, then plan honest follow-ups for settings that are not yet in the repo contract.

### Current Problem

Properties Render currently exposes selected-light shadow controls, but that makes light editing feel like a shadow-only feature.

The user should be able to select an environment light and adjust the full relevant control set for that light:
- enabled state
- light name
- light type
- brightness / intensity
- color
- position when applicable
- target when applicable
- distance / decay when applicable
- spotlight cone angle / penumbra when applicable
- shadow enabled, bias, and map size when applicable

### Light Type Read

Current repo-supported light types:
- `Ambient`: color and intensity only; it has no direction and cannot cast shadows.
- `Hemisphere`: sky color, ground color, intensity, and an up/down orientation model; it cannot cast shadows.
- `Directional`: color, intensity, position, target, and shadows; useful as a sun-like light with parallel rays.
- `Point`: color, intensity, position, distance, decay, and shadows; useful as an omnidirectional bulb-like light.
- `Spot`: color, intensity, position, target, distance, decay, cone angle, penumbra, and shadows; useful as a cone light with edge softness.
- `RectArea`: color, intensity, position, target, width, and height; useful as a true panel-like area light without shadows in the current renderer path.

Disk size read:
- The repo light contract now supports width and height only for `rectArea` lights.
- A spotlight's `angle` and `penumbra` are shape and edge-softness controls, not disk size.
- `LightShadow.radius`, `normalBias`, and `blurSamples` are saved shadow-quality controls, not physical light size.
- Three.js `RectAreaLight` is the shipped path for a real panel/area-size light. It remains shadowless in this first contract because the live Three.js rect-area path does not cast normal shadow maps.

### Proposed Properties Organization

Add a dedicated Properties `Render > Environment Lights` group below the existing Environment background/HDRI controls and before unrelated render-detail groups.

Suggested group shape:
- `Light Browser` mini list for all environment lights in the scene
- `Light` selector or selected-light readback
- `Enabled`
- `Name`
- `Type`
- `Color`
- `Brightness`
- `Position` for directional, point, and spot lights
- `Target` for directional and spot lights
- `Distance` and `Decay` for point and spot lights
- `Angle` and `Penumbra` for spot lights
- `Shadows` subsection for directional, point, and spot lights

The old `Selected Light Shadows` group should be retired or folded into this new section once the fuller selected-light surface exists. It should not remain as an isolated shadow-only group below other unrelated settings.

The mini light browser should make selection obvious before editing:
- show each light as one compact row
- show light name
- show light type
- show enabled state
- show a small color swatch when useful
- make the active row visually selected
- keep add, delete, duplicate, and reorder actions out of the first cut unless the implementation needs one of them to make selection work

### Contract Direction

Use the existing `LightSpec` contract first:
- keep `intensity` as the saved brightness owner
- keep `color` as the saved light color owner
- keep `position` and `target` gated by light type
- keep `distance` and `decay` gated to point and spot lights
- keep `angleDeg` and `penumbra` gated to spot lights
- keep `castShadow`, `shadowBias`, and `shadowMapSize` gated to directional, point, and spot lights

Only add new saved fields after a separate runtime proof:
- `groundColor` for hemisphere lights, if the current saved model cannot faithfully expose it
- `shadowNormalBias`, `shadowRadius`, or `shadowBlurSamples`, if shadow softness/quality needs more than current bias/map-size controls
- `rectArea` or another area-light type, if the user really wants physical light size controls

### Implementation Boundary

This family phase should not:
- change geometry, graph, material, or export truth
- make HDRI background/source controls pretend to be editable direct lights
- collapse Render Preset, Display Mode, Environment, Shadows, Geometry Display, and Environment Lights into one mixed section
- add physical area-light settings until the renderer path and saved contract are proved
- treat shadow softness as the same thing as light disk size

### Acceptance Read

This plan is ready for implementation when:
- the first implementation phase has one narrow section move or section shell
- each visible control maps to a real saved field or a clearly planned new field
- unsupported settings are hidden by light type instead of disabled without explanation
- shadow settings live with the selected light they affect
- a user can understand which light they are editing before touching brightness or shadows

## Vision

Properties should make render presentation feel inspectable and editable without turning the Properties workspace into the viewer runtime owner.

Environment lights are presentation settings. They can be saved, edited, and used by render presets, but they stay downstream from the viewer and separate from model geometry, material ownership, export behavior, and graph truth.

The long-term direction is a Properties Render surface where lighting recipes are visible ingredients. Clay Studio, Standard, custom render presets, HDRI background choices, and hand-tuned lights should all eventually read as normal settings rather than hidden branches.

## Wishlist Organization

### High Level Goals

- [x] `Properties-7-HLG-1. Properties Render should expose environment light customization beyond the current selected-light shadow-only controls.`
- [x] `Properties-7-HLG-2. Light controls should be type-aware so users see brightness, shadows, direction, falloff, cone, and shape controls only when they honestly apply.`
- [x] `Properties-7-HLG-3. Environment light settings should remain viewer-presentation settings and should not affect model, material, graph, or export truth.`
- [x] `Properties-7-HLG-4. Render presets should eventually be able to use visible light settings as recipe ingredients instead of hidden runtime overrides.`

### Codex Level Goals

- [x] Properties-7-CLG-1. Create a Properties `Render > Environment Lights` planning lane.
- [x] Properties-7-CLG-2. Add a compact environment-light browser so users can choose which light they are editing.
- [x] Properties-7-CLG-3. Move selected-light shadow controls into a fuller selected-light environment-light section.
- [x] Properties-7-CLG-4. Expose the existing saved `LightSpec` fields before adding new light-contract fields.
- [x] Properties-7-CLG-5. Separate shadow softness, spotlight cone softness, and physical area-light size into honest implementation decisions.
- [x] Properties-7-CLG-6. Keep later render-preset recipe integration separate from the first selected-light editor extraction.

## [x] `Properties-7 / Phase 1` - `Environment Light Browser And Section Shell`

### Family Phase Summary

Create the dedicated Properties `Render > Environment Lights` section, add a compact mini browser list of all environment lights in the current lighting rig, and move the current selected-light shadow controls into the selected-light editor area below that browser.

The first implementation slice should stay mostly organizational:
- keep the existing saved fields
- keep the existing shadow behavior
- let the user select the light to edit from a small list inside the section
- make selected-light shadow settings read as part of light editing, not as a separate shadow-only island
- make selected-light identity obvious before any brightness or shadow control appears

Suggested row read:
- color swatch
- light name
- light type
- enabled toggle or enabled readback
- selected-row state

### Owns

- new Environment Lights group placement
- mini light browser rows for the current environment lights
- selecting the active light from inside Properties Render
- moving current selected-light shadow controls into that group
- selected-light readback naming
- no new saved-light contract fields

### Does Not Own

- add light
- duplicate light
- delete light
- reorder light
- new light types
- physical disk/area size
- render-preset custom matching

### Acceptance Read

- Properties Render has a clear `Environment Lights` group.
- The group begins with a compact list of environment lights.
- Selecting a row changes which light the section edits.
- The existing selected-light shadow controls still work.
- The selected-light shadow controls no longer appear as an unrelated lower group.
- No runtime lighting behavior changes unless required by the section move.

## [x] `Properties-7 / Phase 2` - `Basic Selected Light Controls`

### Family Phase Summary

Expose the common selected-light settings that every saved light can honestly own.

Controls:
- Enabled
- Name
- Type
- Color
- Brightness

Implementation should reuse the existing light-type normalization path so type changes keep defaults predictable and remove fields that no longer apply.

### Owns

- common selected-light settings
- type select
- brightness/intensity vocabulary decision in Properties UI
- focused tests for selected-light writes

### Does Not Own

- position/target vectors
- spot cone settings
- new shadow softness fields
- area-light size

### Acceptance Read

- A user can select a light and edit its common settings from Properties Render.
- Type changes keep the light valid.
- Ambient and hemisphere lights do not show unsupported shadow controls.

## [x] `Properties-7 / Phase 3` - `Type Specific Direction Falloff And Cone Controls`

### Family Phase Summary

Expose the settings that apply only to specific current light types.

Controls:
- Position for directional, point, and spot lights
- Target for directional and spot lights
- Distance and Decay for point and spot lights
- Angle and Penumbra for spot lights

### Owns

- type-gated vector controls
- type-gated point and spot falloff controls
- type-gated spot cone controls
- parity with the fuller View Toolbar light editor where the saved model already supports it

### Does Not Own

- shadow camera bounds
- physical area-light size
- light helpers or viewport gizmo editing

### Acceptance Read

- Only applicable controls render for each light type.
- Saved values round-trip through Properties, the store, and the viewer.
- Spot `Angle` and `Penumbra` are described and tested as cone controls, not disk-size controls.

## [x] `Properties-7 / Phase 4` - `Shadow Quality And Softness Follow Up`

### Family Phase Summary

Decide whether the current shadow controls are enough or whether the saved light contract should add more shadow-quality fields.

Candidate controls:
- Shadow Bias, already supported
- Shadow Map, already supported
- Normal Bias, if shadow acne control needs it
- Shadow Radius, if the active renderer shadow mode makes it useful
- Blur Samples, if VSM shadow paths are introduced or already active

### Owns

- proof of which Three.js shadow fields matter in the current renderer
- any new saved shadow-quality fields
- clear naming so users do not confuse shadow softness with physical light size

### Does Not Own

- area-light implementation
- global shadow renderer changes without a separate proof
- post-processing ambient occlusion controls

### Acceptance Read

- New shadow controls only ship if they affect the live renderer.
- Existing shadow controls keep working.
- The UI separates shadow quality from light type, cone shape, and physical area-light size.

## [x] `Properties-7 / Phase 5` - `Advanced Light List Actions And Preset Recipe Integration`

### Family Phase Summary

After selected-light browsing and editing work, plan how users manage multiple lights and how built-in render presets write visible light recipes.

Candidate controls:
- Add light
- Duplicate light
- Delete light
- Reorder light
- Restore preset light recipe
- Show custom readback when current light settings no longer match the selected render preset

### Owns

- advanced light-list management actions
- render-preset recipe relationship
- custom-readback handoff with the render-preset consolidation lane

### Does Not Own

- first selected-light editor
- first mini light browser selection model
- unrelated HDRI source controls
- geometry-display recipes

### Acceptance Read

- Add, duplicate, delete, and reorder are planned separately from the first mini browser and selected-light settings extraction.
- Built-in presets can use visible light settings without hiding runtime-only lighting branches.
- Custom readback follows the same predictable recipe philosophy as the rest of Properties Render.

## [x] `Properties-7 / Phase 6` - `Area Light Candidate`

### Family Phase Summary

Only after the current light model is exposed, decide whether to add a new area-light type for true size controls.

This is the honest home for user-facing width, height, radius, disk, or panel-size language.

### Owns

- deciding whether the repo should support an area light type
- renderer/material proof for Three.js `RectAreaLight` or another area-light strategy
- saved contract changes for physical light size

### Does Not Own

- pretending current point, directional, or spot lights have disk size
- adding size controls that do not affect the rendered result
- breaking existing saved light specs

### Acceptance Read

- The repo either gains a proved area-light path or records why it should stay deferred.
- Any size control maps to a real rendered light shape.
- Existing environment-light editing remains stable.

## Shipped Closeout

Properties-7 shipped as one completed manager/worker loop across Phases 1 through 6.

Completed runtime behavior:
- Properties `Render` now has a dedicated `Environment Lights` group below Environment controls.
- The compact light browser selects `lighting.selectedLightId` and shows name, type, enabled state, row order, and color swatch.
- Selected-light editing now owns enabled state, name, type, color, brightness, type-gated position/target/falloff/cone controls, and light-local shadow controls.
- Selected-light shadows no longer live as an isolated lower `Selected Light Shadows` island.
- Light management supports add, duplicate, delete, and reorder from Properties Render.
- Built-in render presets can restore visible lighting recipes, and the section shows preset/custom lighting readback.
- The saved light contract now includes shadow-quality fields and a proved `rectArea` type with width and height.
- The viewer consumes the new light fields through saved presentation settings without changing model, material, graph, or export truth.

Verification:
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/viewer/Viewer.test.ts`
- `npx.cmd tsc -b`
