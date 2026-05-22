# Properties-6 - Geometry Display Surfaces Edges And Points

## Doc Header

### Doc History
28. 2026-05-21 20:38:33: Implemented and closed `Properties-6 / Phase 5.6 - Recipe Select Readback Option Model` by adding reusable `ParaSelect` display-label support for readback values outside the selectable option list, removing `Custom` from normal Edge Preset choices, and syncing Properties edge writes with the legacy `edgeDisplayMode` bridge so `Off` remains reachable from Properties.
27. 2026-05-21 19:53:12: Added and prepped `Properties-6 / Phase 5.6 - Recipe Select Readback Option Model` after the user clarified that `Custom` should only appear as an edge preset readback when settings drift from a built-in recipe, not as a permanent selectable list option, making the next implementation a reusable `ParaSelect` readback/display-value fix before point styling.
26. 2026-05-21 19:12:16: Implemented and closed `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` with a read-only `Custom` edge preset selector state derived from mode, depth, hidden-edge visibility, and hidden-edge line style, while preserving built-in-only persistence and keeping edge color, opacity, hidden-line dash/gap styling, hover, and selected edits out of the first custom-readback signature.
25. 2026-05-21 18:58:22: Prepped `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` against the shipped Phase 5.4 recipe settings, narrowing the first implementation to a read-only `Custom` preset state derived from `mode`, `depthMode`, `hiddenEdges`, and `lineStyle` while leaving color, opacity, dash/gap styling, and saved custom render presets out of the first recipe signature.
24. 2026-05-21 18:55:19: Implemented and closed `Properties-6 / Phase 5.4 - Edge Depth Hidden Edges And Line Style` with saved `hiddenEdges` and `lineStyle` edge settings, restored Properties `Edge Depth`, added conditional `Hidden Edges` and `Line Style` controls, and moved viewer hidden-edge overlays onto the editable recipe settings instead of the `Hidden Line` preset name.
23. 2026-05-21 18:39:09: Prepped `Properties-6 / Phase 5.4 - Edge Depth Hidden Edges And Line Style` against the live `geometryDisplay.edges.depthMode`, hidden-line preset mapping, Properties edge controls, and viewer hidden-line overlay paths, narrowing implementation to adding saved hidden-edge visibility and line-style settings, restoring `Edge Depth`, and making `Hidden Line` a recipe over those editable settings.
22. 2026-05-21 18:31:59: Revised the Phase 5.4 and Phase 5.5 edge-preset follow-up plan so `Hidden Line` becomes a recipe over normal editable edge settings: `Edge Depth`, `Hidden Edges`, and `Line Style`, with hidden-edge visibility tied to `Edge Depth: Xray` and `Custom` readback planned when those recipe settings drift from a built-in preset.
21. 2026-05-21 18:21:23: Added `Properties-6 / Phase 5.4 - Edge Depth Control And Preset Sync` and `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` follow-ups before point work so edge depth can return as an editable setting and preset changes can read back as `Custom` when the user changes preset-owned edge settings.
20. 2026-05-21 18:14:57: Implemented and closed `Properties-6 / Phase 5.3 - Hidden Line Styling And Recipe Prep` with saved hidden-line color, opacity, dash length, and gap length settings, Properties controls shown only for the `Hidden Line` edge preset, viewer dashed-layer consumption, and a clean Phase 6 point-styling handoff.
19. 2026-05-21 18:09:20: Prepped `Properties-6 / Phase 5.3 - Hidden Line Styling And Recipe Prep` against the shipped `Hidden Line` preset runtime, viewer dashed overlay constants, shared edge settings contract, and current Properties edge controls, narrowing implementation to hidden-line color, opacity, dash size, and gap size controls shown only when `Edge Preset` is `Hidden Line`.
18. 2026-05-21 18:05:31: Implemented and closed `Properties-6 / Phase 5.2 - Hidden Line Edge Preset Runtime` with a real `Hidden Line` edge preset, normalized compatibility mapping, Properties option exposure, dashed sibling edge overlays for semantic and mesh fallback display edges, and focused store, Properties, and viewer proof while leaving styling controls to Phase 5.3.
17. 2026-05-21 18:00:32: Prepped `Properties-6 / Phase 5.2 - Hidden Line Edge Preset Runtime` against the live edge preset contract, semantic and mesh edge overlay maps, `LineBasicMaterial` display-edge path, and topology hover/selected overlays, narrowing implementation to a real `Hidden Line` preset with solid visible edges plus separate dashed hidden-edge overlays while deferring hidden-line styling controls to Phase 5.3.
16. 2026-05-21 17:56:54: Implemented and closed `Properties-6 / Phase 5.1 - Edge Preset Model And Depth UI Cleanup` with a saved `geometryDisplay.edges.preset` owner, `Edge Preset` Properties control, hidden `Edge Depth` UI, compatibility mapping to existing edge mode/depth fields, and focused store, Properties, and viewer proof.
15. 2026-05-21 17:56:54: Prepped `Properties-6 / Phase 5.1 - Edge Preset Model And Depth UI Cleanup` against the live `geometryDisplay.edges.mode`, `depthMode`, legacy `edgeDisplayMode` bridge, Properties `Edges` and `Edge Depth` controls, and viewer display-edge depth behavior, choosing a compatibility-preserving preset owner instead of deleting the existing runtime fields in the first pass.
14. 2026-05-21 16:51:07: Added numbered `Properties-6 / Phase 5.N` edge follow-ups so the current edge mode/depth overlap can be cleaned into one `Edge Preset` control before point work, with separate future slices for `Hidden Line` runtime rendering and hidden-line styling.
13. 2026-05-21 16:39:01: Removed unsupported edge thickness from the shipped `Properties-6` Geometry Display contract and controls after confirming the current Three.js `LineBasicMaterial` path cannot reliably render non-1px line widths in the browser, leaving edge color, opacity, and depth as the honest editable edge settings until a future fat-line renderer exists.
12. 2026-05-21 16:29:39: Implemented and closed `Properties-6 / Phase 5 - Edge Hover And Highlight Styles` with saved `geometryDisplay.edges.hover` and `geometryDisplay.edges.selected` color, opacity, and thickness styles, condensed Properties controls inside the `Edges` subsection, a compatibility bridge to existing highlight edge fields, and viewer topology edge overlay consumption while preserving point styling and helper overlays.
11. 2026-05-21 16:20:27: Prepped `Properties-6 / Phase 5 - Edge Hover And Highlight Styles` for implementation by grounding it against the shipped `geometryDisplay.edges` default style owner, current `ViewSettings.highlights` edge color/glow/thickness fields, Properties Geometry Display edge controls, and `Viewer.ts` topology edge overlay reads, choosing a narrow hover/selected edge style bridge while preserving point styling and helper overlays for later phases.
10. 2026-05-21 16:15:00: Added a shipped follow-up for collapsible Properties `Render > Geometry Display` subsections so `Surfaces`, `Edges`, and `Points` keep their current controls but can each fold independently while staying open by default.
9. 2026-05-21 16:03:46: Implemented and closed `Properties-6 / Phase 4 - Edge Visibility And Default Style` with saved default edge color, opacity, thickness, and depth settings under `geometryDisplay.edges`, Properties controls that stay hidden while `Edges` is `Off`, legacy `edgeDisplayMode` bridge preservation, and viewer display-edge overlay consumption for normal mesh and semantic edges while leaving edge hover/selected styling for Phase 5.
8. 2026-05-21 15:55:04: Prepped `Properties-6 / Phase 4 - Edge Visibility And Default Style` for implementation by grounding it against the shipped `geometryDisplay.edges.mode` bridge, current Properties `Edges` control, mesh/semantic edge overlay paths, and existing highlight-owned edge hover/selected overlays, narrowing the first code cut to default edge color, opacity, thickness, and depth behavior for normal display edges while keeping edge hover/selected styling in Phase 5.
7. 2026-05-21 15:51:01: Implemented and closed `Properties-6 / Phase 3 - Surface Hover And Highlight Styles` with surface hover, selected face, and selected body color/opacity settings under `geometryDisplay.surfaces`, Properties `Render > Geometry Display` controls, a two-way `ViewSettings.highlights` compatibility bridge, and viewer overlay reads for body/face surface overlays while leaving edge and point styling to later phases.
6. 2026-05-21 15:38:55: Prepped `Properties-6 / Phase 3 - Surface Hover And Highlight Styles` for implementation by grounding it against the shipped `geometryDisplay.surfaces` contract, existing `ViewSettings.highlights` surface color/opacity fields, Settings viewport highlight controls, and `Viewer.ts` body/face overlay paths, choosing a narrow color/opacity bridge instead of full material-like hover/selected surface materials.
5. 2026-05-21 15:33:44: Implemented and closed `Properties-6 / Phase 2 - Surface Source And Custom Default Material` with `Surface Source` in Properties `Render > Geometry Display`, a persisted display-only custom surface material using the existing `MaterialPreset` field shape, condensed custom controls, and viewer consumption that overrides generated part surface presentation without mutating project material truth.
4. 2026-05-21 15:27:16: Prepped `Properties-6 / Phase 2 - Surface Source And Custom Default Material` for implementation by grounding it against the shipped `geometryDisplay` Phase 1 contract, the existing `MaterialPreset` shape, `PropertiesRenderSection`, `PropertiesColorControl`, `uiPrefsPersistence`, and `Viewer.ts` material-resolution path, choosing a display-only custom surface material override that does not mutate project material truth.
3. 2026-05-21 15:04:04: Implemented and closed `Properties-6 / Phase 1 - Geometry Display Contract And Section Shell` with a normalized `ViewSettings.geometryDisplay` contract, Properties `Render > Geometry Display` controls for Surfaces, Edges, and Points, edge-mode compatibility with legacy `edgeDisplayMode`, generated-surface viewer visibility, and focused store, Properties, and viewer proof while leaving runtime point rendering deferred.
2. 2026-05-21 14:55:14: Prepped `Properties-6 / Phase 1 - Geometry Display Contract And Section Shell` for implementation by grounding the first cut against the live `ViewSettings.edgeDisplayMode`, `ViewSettings.highlights`, `PropertiesRenderSection`, `uiPrefsPersistence`, and `Viewer.ts` mesh/edge/topology seams, choosing a small `geometryDisplay` contract with surface visibility, edge mode, and point visibility while keeping custom materials, color styling, recipe rewrites, and broad point-system unification out of Phase 1.
1. 2026-05-21 14:47:01: Added this future planning doc after the user asked for a new Properties `Render` section for turning surfaces, edges, and points on/off, controlling default/hover/highlight colors, allowing surfaces to use either the material set or a custom material-like surface style, and making this the path from wireframe through Clay Studio instead of keeping those looks as hidden mode-specific viewer behavior.

### Purpose

This doc owns the `Properties-6` family phase for a new Properties `Render` section tentatively named `Geometry Display`.

Use it to plan:
- surface visibility and source control
- edge visibility and styling
- point visibility and styling
- default, hover, and selected/highlight appearance for surfaces, edges, and points
- the path from existing wireframe behavior to editable render-display settings
- the path from Clay Studio's hard-coded presentation material and muted edges to normal preset-written settings

Do not use it to:
- change graph geometry, topology truth, sketch truth, or export output
- make display settings trigger geometry rebuilds
- replace the material-authoring workspace or material library
- turn viewer presentation settings into authored CAD material truth
- collapse `Display Mode`, `Render Preset`, and `Render Settings` into one concept

## Doc Body

### Starting Point

The current render surface already has several pieces that should be reused instead of reinvented:

- `ViewSettings.materials`
  - owns the current material set and per-part material assignments
- `ViewSettings.edgeDisplayMode`
  - owns a first edge visibility shape: `on`, `off`, and `visibleEdgesOnly`
- `ViewSettings.highlights`
  - owns several hover and selected colors, opacity, glow, point size, and edge thickness values
- `Viewer.ts`
  - applies the live display modes, Clay Studio material override, semantic edge overlays, mesh edge overlays, topology point/edge/face overlays, and selected/hover state presentation
- `Properties > Render`
  - already owns neutral view/render presentation settings without becoming the viewer runtime owner

The new section should not create another hidden owner. It should collect these related presentation ingredients into one visible model:

```text
Properties > Render > Geometry Display
  Surfaces
  Edges
  Points
```

### Main Boundary Rules

- Surfaces, edges, and points are viewer presentation settings.
- They are downstream from geometry and material truth.
- `Material Set` means use existing assigned material presentation.
- `Custom` surface style means a render/display material override, not a new authored material assignment.
- Built-in presets such as `Standard`, `Wireframe`, and `Clay Studio` should eventually write these neutral settings as recipes.
- User edits after applying a preset should stay editable and visible.
- Keep first implementation phases small enough to verify with focused Properties/store/viewer tests.

### Suggested Data Shape

The final shape should probably live under `ViewSettings.geometryDisplay` or a similarly named presentation owner.

Suggested end-state direction:

```ts
geometryDisplay: {
  surfaces: {
    visible: boolean
    source: 'materialSet' | 'custom'
    customMaterial: MaterialPresetLike
    hoverMaterial: MaterialPresetLike
    selectedMaterial: MaterialPresetLike
  }
  edges: {
    preset: 'off' | 'visibleOnly' | 'xray' | 'hiddenLine'
    defaultColor: string
    hoverColor: string
    selectedColor: string
    opacity: number
    hiddenLine?: {
      color: string
      opacity: number
      dashSize: number
      gapSize: number
    }
  }
  points: {
    visible: boolean
    defaultColor: string
    hoverColor: string
    selectedColor: string
    opacity: number
    size: number
    depthMode: 'surface' | 'xray'
  }
}
```

This is planning language, not a locked code contract. Phase 1 should confirm the smallest compatible contract against current `ViewSettings`, `PropertiesRenderSection`, `Viewer.ts`, and existing tests before implementation.

### Acceptance Read

`Properties-6` is done when a user can use Properties `Render` to intentionally choose whether surfaces, edges, and points are visible, tune their default/hover/selected presentation, decide whether surfaces use assigned materials or a custom material-like display style, and apply built-in presets that write these same settings instead of relying on hidden Clay Studio or wireframe-only branches.

## Vision

`Properties-6` should make the actual geometry drawing language visible.

The user-facing idea is:
- surfaces are the filled bodies
- edges are the line language over or instead of bodies
- points are the vertex/control/topology markers
- each can be shown or hidden
- each has default, hover, and selected/highlight presentation
- surfaces can either respect the current material set or use a custom render-display material

This should become the bridge from `Wireframe` to `Clay Studio`:
- `Wireframe` should become mostly a recipe over surface/edge settings.
- `Clay Studio` should become mostly a recipe over custom surface material, muted edges, lighting/AO/contact settings, and ground settings.
- `Standard` should remain the normal material-set surface read with edges and points off unless enabled.

## Wishlist Organization

### High Level Goals

- [ ] `Properties-6-HLG-1. Add a new Properties Render section for Surfaces, Edges, and Points.`
- [ ] `Properties-6-HLG-2. Let users turn surfaces, edges, and points on or off.`
- [ ] `Properties-6-HLG-3. Let users change default, hover, and highlight colors for surfaces, edges, and points.`
- [ ] `Properties-6-HLG-4. Let surface color come from either the current material set or a custom user-defined surface material.`
- [ ] `Properties-6-HLG-5. Let custom surface style use material-like controls such as transparency, metalness, roughness, emissive, and sidedness.`
- [ ] `Properties-6-HLG-6. Use this system as the path from wireframe through Clay Studio instead of keeping those looks as hard-coded special modes.`

### Codex Level Goals

- [ ] CLG 1. Add one neutral saved presentation contract for geometry display without changing graph geometry or export truth.
- [ ] CLG 2. Add one Properties `Render > Geometry Display` section that condenses controls by visible/source state.
- [ ] CLG 3. Reuse existing material-preset field shapes where custom surface style needs material-like controls.
- [ ] CLG 4. Reuse existing edge/topology/highlight runtime seams where possible instead of adding duplicate overlays.
- [ ] CLG 5. Move built-in display/preset behavior toward recipe writes over visible settings.
- [ ] CLG 6. Keep each implementation phase small, testable, and reversible.

### `Properties-6 / Phase 1`

- [ ] Create the saved geometry-display contract.
- [ ] Add the `Geometry Display` section shell.
- [ ] Add top-level `Surfaces`, `Edges`, and `Points` visibility controls.
- [ ] Keep the first runtime behavior narrow and backwards-compatible.
- [ ] `Properties-6-HLG-1`
- [ ] `Properties-6-HLG-2`
- [ ] CLG 1.
- [ ] CLG 2.
- [ ] CLG 6.

### `Properties-6 / Phase 2`

- [ ] Add surface source control: `Material Set` versus `Custom`.
- [ ] Add custom default surface material controls using the material-preset field shape.
- [ ] Map custom surface display into viewer presentation without mutating authored material assignments.
- [ ] `Properties-6-HLG-1`
- [ ] `Properties-6-HLG-4`
- [ ] `Properties-6-HLG-5`
- [ ] CLG 1.
- [ ] CLG 3.

### `Properties-6 / Phase 3`

- [ ] Add surface hover and selected/highlight style controls.
- [ ] Decide whether hover/selected surface style starts as color/opacity only or the full material-like shape.
- [ ] Route surface hover/selected rendering through the existing highlight overlay seams where possible.
- [ ] `Properties-6-HLG-3`
- [ ] `Properties-6-HLG-5`
- [ ] CLG 3.
- [ ] CLG 4.

### `Properties-6 / Phase 4`

- [ ] Add edge mode and default edge styling controls.
- [ ] Use `Off`, `Visible Only`, and `All` labels for the first edge visibility model unless the live runtime requires a narrower split.
- [ ] Add edge color, opacity, thickness, and depth behavior only after confirming what the current overlay runtime can honestly support.
- [ ] `Properties-6-HLG-1`
- [ ] `Properties-6-HLG-2`
- [ ] `Properties-6-HLG-3`
- [ ] CLG 1.
- [ ] CLG 4.

### `Properties-6 / Phase 5`

- [ ] Add edge hover and selected/highlight controls.
- [ ] Keep semantic/topology selection overlays readable over surface display changes.
- [ ] Preserve existing sketch/extrude helper overlay contracts.
- [ ] `Properties-6-HLG-3`
- [ ] CLG 4.
- [ ] CLG 6.

### `Properties-6 / Phase 5.1`

- [ ] Replace the overlapping `Edges` mode plus `Edge Depth` UI with one `Edge Preset` control.
- [ ] Keep the shipped behavior of `Off`, `Visible Only`, and `All/Xray` while making the labels clearer.
- [ ] Hide depth as an implementation detail unless a later renderer needs an advanced override.
- [ ] Preserve existing edge color, opacity, hover, and selected controls.
- [ ] `Properties-6-HLG-1`
- [ ] `Properties-6-HLG-2`
- [ ] `Properties-6-HLG-3`
- [ ] CLG 1.
- [ ] CLG 2.
- [ ] CLG 4.

### `Properties-6 / Phase 5.2`

- [ ] Add the `Hidden Line` edge preset as a real viewer rendering behavior.
- [ ] Render front/visible edges as solid lines.
- [ ] Render behind-surface edges as dashed, muted hidden lines.
- [ ] Keep graph geometry, export truth, selection routing, and helper overlays unchanged.
- [ ] `Properties-6-HLG-2`
- [ ] `Properties-6-HLG-3`
- [ ] `Properties-6-HLG-6`
- [ ] CLG 4.
- [ ] CLG 6.

### `Properties-6 / Phase 5.3`

- [x] Add hidden-line styling controls only after the runtime proof is shipped.
- [x] Consider hidden edge color, opacity, dash length, and gap length controls.
- [x] Keep default edge hover/selected controls separate from hidden-line styling.
- [x] Prepare the Wireframe/technical-drawing recipe handoff without moving the full preset system into this phase.
- [x] `Properties-6-HLG-3`
- [x] `Properties-6-HLG-6`
- [x] CLG 2.
- [ ] CLG 5.
- [ ] CLG 6.

### `Properties-6 / Phase 5.4`

- [x] Restore `Edge Depth` as an editable setting under the edge preset controls.
- [x] Add `Hidden Edges` as an editable setting that only shows when `Edge Depth` is `Xray`.
- [x] Add `Line Style` as an editable setting for the hidden-edge layer, starting with `Solid` and `Dashed`.
- [x] Let built-in edge presets automatically write their intended `Edge Depth`, `Hidden Edges`, and `Line Style` recipe values.
- [x] Keep edge depth, hidden edges, and line style hidden while `Edge Preset` is `Off`.
- [x] Reframe `Hidden Line` as a recipe instead of a special one-off preset behavior.
- [x] Keep custom preset readback deferred to Phase 5.5.
- [x] `Properties-6-HLG-3`
- [x] `Properties-6-HLG-6`
- [x] CLG 2.
- [x] CLG 6.

### `Properties-6 / Phase 5.5`

- [x] Add `Custom` edge preset readback when user-edited settings no longer match a built-in edge preset recipe.
- [x] Define the edge preset recipe signature for `Off`, `Visible Only`, `Xray`, and `Hidden Line`.
- [x] Make selecting a built-in preset apply that preset recipe again.
- [x] Keep `Custom` as a readback state, not a separate saved recipe system.
- [x] Preserve full saved custom render presets for the later preset handoff phase.
- [x] `Properties-6-HLG-3`
- [x] `Properties-6-HLG-6`
- [x] CLG 2.
- [x] CLG 5.
- [x] CLG 6.

### `Properties-6 / Phase 5.6`

- [x] Fix `ParaSelect` so readback-only values such as `Custom` can display without becoming permanent selectable/cyclable options.
- [x] Keep `Edge Preset` selectable recipes limited to `Off`, `Visible Only`, `Xray`, and `Hidden Line`.
- [x] Show `Custom` only when the current edge settings do not match a built-in recipe.
- [x] Make `Off` reachable from Properties by left cap, dropdown/menu, and from `Custom` readback.
- [x] Add focused proof for `Visible Only -> Off`, `Hidden Line -> Off`, and `Custom -> Off` interactions.
- [x] Keep this fix reusable for future render, AO, material, and recipe/preset readback selects.
- [x] `Properties-6-HLG-3`
- [x] `Properties-6-HLG-6`
- [x] CLG 2.
- [x] CLG 5.
- [x] CLG 6.

### `Properties-6 / Phase 6`

- [ ] Add point visibility and default point styling controls.
- [ ] Add point size, color, opacity, and depth behavior if the live topology point runtime supports them cleanly.
- [ ] Keep control points, topology points, sketch points, and transform handles distinct if they are not the same runtime owner.
- [ ] `Properties-6-HLG-1`
- [ ] `Properties-6-HLG-2`
- [ ] `Properties-6-HLG-3`
- [ ] CLG 1.
- [ ] CLG 4.

### `Properties-6 / Phase 7`

- [ ] Add point hover and selected/highlight controls.
- [ ] Verify point styling remains legible with surfaces off, transparent surfaces, visible-only edges, all edges, and Clay Studio-like custom surfaces.
- [ ] `Properties-6-HLG-3`
- [ ] CLG 4.
- [ ] CLG 6.

### `Properties-6 / Phase 8`

- [ ] Wire built-in display modes and render presets into the geometry-display contract.
- [ ] Make `Standard` use material-set surfaces and normal edge/point defaults.
- [ ] Make `Wireframe` use geometry-display settings instead of a separate permanent viewer-only branch where possible.
- [ ] Make `Clay Studio` write custom clay surface style and muted edge/point settings as part of its recipe.
- [ ] `Properties-6-HLG-6`
- [ ] CLG 5.

### `Properties-6 / Phase 9`

- [ ] Add readback/custom-state handling after built-in recipes write geometry-display settings.
- [ ] Decide how `Rendered (Custom)`, `Wireframe (Custom)`, and `Clay Studio (Custom)` should read when users tweak surfaces, edges, and points.
- [ ] Keep saved user custom render presets out unless the current `Properties-4` preset-readback work has landed.
- [ ] `Properties-6-HLG-6`
- [ ] CLG 5.

### `Properties-6 / Phase 10`

- [ ] Retire duplicated viewer-only display branches only after neutral geometry-display settings cover their behavior.
- [ ] Remove stale compatibility paths when their retirement conditions are met.
- [ ] Keep graph geometry, material truth, and export truth unchanged while cleaning up presentation ownership.
- [ ] `Properties-6-HLG-6`
- [ ] CLG 5.
- [ ] CLG 6.

## [x] `Properties-6 / Phase 1` - `Geometry Display Contract And Section Shell`

### Phase 1 Summary

#### Purpose

Create the smallest saved and visible home for geometry display settings.

Phase 1 should make the new section real without trying to solve all styling at once.

#### Owns

- a normalized `ViewSettings` geometry-display contract or equivalent presentation owner
- Properties `Render > Geometry Display` section placement
- first controls for `Surfaces`, `Edges`, and `Points` visibility
- basic viewer consumption for those visibility settings only where the live runtime already has a clear path

#### Does Not Own

- custom surface material controls
- hover/selected styling controls
- edge thickness/depth model changes
- point-size/depth model changes
- Clay Studio or Wireframe recipe rewrites
- saved custom render presets

#### Current Live Read

- surfaces currently render through `Viewer.ts` `partMeshes`, `baselinePartMeshes`, `overlayPartMeshes`, imported/reference object meshes, and display-mode material resolution.
- normal generated part surfaces are the safest first Phase 1 target; baseline/overlay/reference surface visibility should be audited before being included so helper or retained-preview visuals are not accidentally hidden.
- edges currently have display-mode and semantic overlay paths plus saved `ViewSettings.edgeDisplayMode`.
- `edgeDisplayMode` already expresses the likely Phase 1 user labels:
  - `off` -> `Off`
  - `visibleEdgesOnly` -> `Visible Only`
  - `on` -> `All`
- current display-mode changes also write `edgeDisplayMode` in the store, so Phase 1 must decide whether `geometryDisplay.edges.mode` replaces it immediately or mirrors it through a compatibility bridge.
- topology point pick targets exist in `Viewer.ts`, but visible point presentation appears through selected/hover topology overlays and sketch/control helper systems rather than one universal point owner.
- `ViewSettings.highlights` already owns surface, edge, and point hover/selected style values, but Phase 1 should not migrate those fields yet.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a small normalized geometry-display settings object to `ViewSettings`:
   ```ts
   geometryDisplay: {
     surfaces: {
       visible: boolean
     }
     edges: {
       mode: 'off' | 'visibleOnly' | 'all'
     }
     points: {
       visible: boolean
     }
   }
   ```
2. Default the new contract so current behavior is preserved:
   - `surfaces.visible: true`
   - `edges.mode` should mirror current `DEFAULT_VIEW_EDGE_DISPLAY_MODE` on first read
   - `points.visible: true`
3. Normalize, clone, persist, and restore the contract through existing view-settings paths.
4. Add a `Geometry Display` group to `PropertiesRenderSection`.
5. Place the group after `Viewport Presentation` and before `Environment` unless implementation finds a stronger local layout reason.
6. Add three first controls:
   - `Surfaces` `On / Off`
   - `Edges` `Off / Visible Only / All`
   - `Points` `On / Off`
7. Bridge `Edges` to the existing `edgeDisplayMode` behavior in the smallest safe way:
   - either replace the Properties-facing `edgeDisplayMode` owner with `geometryDisplay.edges.mode`
   - or keep `edgeDisplayMode` as a compatibility field and derive it from `geometryDisplay.edges.mode`
   - do not leave two independently editable edge-mode owners.
8. Map `Surfaces` to generated part mesh surface visibility without deleting geometry or material assignments.
9. Keep selection outlines, hover/selected overlays, gizmos, sketch helpers, extrude previews, and retained build overlays visible unless Phase 1 explicitly proves they are generated part surfaces.
10. Map `Points` only to the topology point presentation/pick path if the implementation can do it without confusing sketch/control/gizmo points.
11. If point ownership is not clean enough, save and expose `Points` but mark runtime point consumption as deferred in the shipped changelog and tests.
12. Add focused store, Properties, and viewer proof.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not add color/material editors in Phase 1. The first phase is only the contract, section, and visibility foundation.

Also keep out:
- `Material Set` / `Custom` surface source
- custom surface material fields
- default/hover/selected color controls
- edge opacity/thickness/depth controls
- point size/opacity/depth controls
- Wireframe or Clay Studio recipe rewrites
- saved custom render preset behavior
- broad topology/sketch/control point unification

#### First Pass Decisions

- Name the section `Geometry Display`.
- Use `Surfaces`, `Edges`, and `Points` as the visible row labels.
- Use `Visible Only` rather than `Visible Edges Only` in the first UI label to keep the select compact.
- Treat the existing `edgeDisplayMode` storage as a migration/compatibility concern, not a second long-term owner.
- Treat `Points` as a visible saved setting in Phase 1 even if runtime point rendering is partially deferred, because the section needs the full Surfaces / Edges / Points shape from the start.
- Keep Phase 1 downstream from material truth: hiding surfaces is a viewport presentation choice, not a material assignment or graph/content visibility change.

#### Verification Shape

- store normalization and persistence proof
- generic `setViewKey('geometryDisplay', ...)` proof
- display-mode compatibility proof that existing display-mode changes still produce the expected edge display outcome
- Properties write proof for surfaces/edges/points visibility
- viewer proof that surface and edge visibility changes do not rebuild geometry
- viewer proof that selected outlines and hover/selected overlays remain legible when surfaces are off
- focused proof that points are either controlled honestly or explicitly left as a later owner if the live point systems are not unified enough
- production build

#### Done Shape

Phase 1 is done when `Properties > Render > Geometry Display` exists, saves the three basic visibility choices, and the viewer obeys the choices that Phase 1 explicitly owns without changing geometry, material truth, graph truth, selection truth, or export truth.

#### Shipped Read

- Added `ViewSettings.geometryDisplay` with saved `surfaces.visible`, `edges.mode`, and `points.visible` fields.
- Kept legacy `edgeDisplayMode` synced as the viewer compatibility bridge so existing edge behavior and display-mode migration still work.
- Added Properties `Render > Geometry Display` after `Viewport Presentation` with `Surfaces`, `Edges`, and `Points` controls.
- Mapped generated part surface visibility through material presentation so edge overlays can remain visible while surfaces are hidden.
- Left broad runtime point rendering deferred because topology, sketch, control, and selection point systems do not yet share one clean presentation owner.

## [x] `Properties-6 / Phase 2` - `Surface Source And Custom Default Material`

### Phase 2 Summary

#### Purpose

Let surfaces either use current assigned materials or a custom display material.

#### Owns

- `Surface Source`: `Material Set` / `Custom`
- custom default surface material fields
- viewer use of the custom material as a presentation override

#### Does Not Own

- hover/selected custom surface styles
- actual material-library creation or assignment
- per-object material editing
- Wireframe or Clay Studio preset rewrites

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Extend the shipped Phase 1 `ViewSettings.geometryDisplay.surfaces` object instead of adding a sibling owner:
   ```ts
   surfaces: {
     visible: boolean
     source: 'materialSet' | 'custom'
     customMaterial: MaterialPreset
   }
   ```
2. Default `source` to `materialSet` so current material behavior remains unchanged.
3. Default `customMaterial` to a display-only material that starts from the current default matte material values but carries its own stable id/name such as:
   - `id: 'geometry_display_surface_custom'`
   - `name: 'Custom Surface'`
4. Reuse the existing `MaterialPreset` field shape for the first custom display material:
   - `color`
   - `metalness`
   - `roughness`
   - `emissive`
   - `emissiveIntensity`
   - `opacity`
   - `transparent`
   - `doubleSided`
5. Normalize `customMaterial` through the same safe value rules as material presets:
   - valid hex colors only, fallback to defaults
   - scalar ranges clamped to current material/editor ranges
   - `doubleSided` defaults to `true`
   - `transparent` defaults to `false`
6. Clone, persist, restore, and compare the extended `geometryDisplay` contract through existing view-settings paths.
7. Add a `Surface Source` select inside Properties `Render > Geometry Display`:
   - `Material Set`
   - `Custom`
8. Keep the custom material controls hidden while `Surface Source` is `Material Set`.
9. When `Surface Source` is `Custom`, show a compact surface material editor under the Geometry Display group.
10. Reuse existing Properties control patterns where possible:
   - `PropertiesColorControl` for `Surface Color`
   - `PropertiesColorControl` for `Surface Emissive`
   - `ParaSlider` for `Metalness`, `Roughness`, `Opacity`, and `Emissive`
   - `ParaSelect` for `Transparency` and `Rendering`
11. Name the controls so they do not collide with the Materials section's material-truth controls:
   - `Surface Color`
   - `Surface Emissive Color`
   - `Surface Metalness`
   - `Surface Roughness`
   - `Surface Opacity`
   - `Surface Emissive`
   - `Surface Transparency`
   - `Surface Rendering`
12. Map the custom material into `Viewer.ts` as a generated part surface presentation override only when:
   - `geometryDisplay.surfaces.visible` is `true`
   - `geometryDisplay.surfaces.source` is `custom`
   - the mesh is a normal generated part mesh owned by `partMeshes`
13. Do not write the custom surface material into:
   - `ViewSettings.materials.presets`
   - `ViewSettings.materials.selectedPresetId`
   - `ViewSettings.materials.perPart`
   - authored graph/content material data
14. Keep `Material Set` as the normal branch through `resolveMaterialForPart`.
15. Create or cache one viewer material for the custom surface override and update it through the same material application rules used for `MaterialPreset`.
16. Preserve Phase 1 surface visibility:
   - `Surfaces: Off` still hides generated part surface material even if source is `Custom`
   - edge overlays remain visible when enabled
17. Keep Clay Studio/Wireframe recipe rewrites out of Phase 2:
   - display modes may still override or influence material behavior exactly as they do today
   - do not make Clay Studio a Geometry Display recipe yet
18. Add focused proof that `Material Set` and `Custom` round-trip and render differently.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not turn the Phase 2 custom surface material into project material authoring.

Keep out:
- new project material creation
- per-part assignment changes
- Materials section workflow changes
- hover/selected surface styling
- edge or point styling
- custom render preset saving
- Wireframe and Clay Studio recipe migration
- runtime point rendering unification

#### First Pass Decisions

- Use `Surface Source` as the visible label.
- Use `Material Set` for the current assigned-material path.
- Use `Custom` for the display-only override path.
- Use the existing `MaterialPreset` field shape for `customMaterial` so Phase 2 does not invent a near-duplicate material schema.
- Treat `customMaterial` as viewport presentation state, not material truth.
- Keep the custom editor condensed behind `Surface Source: Custom`.
- Put custom material controls under the existing `Geometry Display` section instead of sending the user to the Materials section.
- Do not give the custom material a project-material row, target row, assignment action, or material library identity.

#### Verification Shape

- store normalization proof for:
  - legacy Phase 1 `geometryDisplay.surfaces` without `source`
  - valid custom material round-trip
  - invalid custom material fallback/clamping
- persistence proof that the extended `geometryDisplay` follows view-settings persistence policy
- Properties proof that:
  - `Surface Source` defaults to `Material Set`
  - custom controls are hidden for `Material Set`
  - custom controls appear for `Custom`
  - changing custom fields writes only `view.geometryDisplay.surfaces.customMaterial`
  - `view.materials` remains unchanged
- viewer proof that:
  - `Material Set` still resolves the assigned/default material
  - `Custom` uses the custom surface material for generated part meshes
  - switching back to `Material Set` restores material assignment behavior
  - `Surfaces: Off` still hides surfaces regardless of source
  - geometry is not rebuilt when source or custom values change
- production build

#### Done Shape

Phase 2 is done when the user can switch surfaces between current material assignments and one custom display material with material-like controls.

#### Shipped Read

- Extended `ViewSettings.geometryDisplay.surfaces` with `source` and `customMaterial`.
- Added `Surface Source` to Properties `Render > Geometry Display` with `Material Set` and `Custom`.
- Kept custom material controls hidden while `Surface Source` is `Material Set`.
- Added custom controls for surface color, emissive color, metalness, roughness, opacity, emissive intensity, transparency, and rendering.
- Mapped `Custom` into generated part surface material presentation without changing `ViewSettings.materials`.
- Preserved `Surfaces: Off` and edge-overlay behavior from Phase 1.

## [x] `Properties-6 / Phase 3` - `Surface Hover And Highlight Styles`

### Phase 3 Summary

#### Purpose

Make surface hover and selected/highlight presentation editable from the same section.

#### Owns

- surface hover color/material direction
- surface selected/highlight color/material direction
- integration with existing face/body selection overlays

#### Does Not Own

- edge hover/selected controls
- point hover/selected controls
- topology-selection behavior changes

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Use a smaller color/opacity style shape for Phase 3, not full material-like hover/selected materials.
2. Extend the shipped `geometryDisplay.surfaces` contract with explicit surface interaction styles:
   ```ts
   surfaces: {
     visible: boolean
     source: 'materialSet' | 'custom'
     customMaterial: MaterialPreset
     hover: {
       color: string
       opacity: number
     }
     selected: {
       color: string
       opacity: number
     }
     bodySelected: {
       color: string
       opacity: number
     }
   }
   ```
3. Default the new fields from the current `ViewSettings.highlights` surface reads:
   - `hover.color` <- `highlights.hoverColor`
   - `hover.opacity` <- `highlights.surfaceHoverOpacity`
   - `selected.color` <- `highlights.selectedColor`
   - `selected.opacity` <- `highlights.surfaceSelectedOpacity`
   - `bodySelected.color` <- `highlights.bodySelectedColor`
   - `bodySelected.opacity` <- `highlights.bodySelectedOpacity`
4. Normalize all style colors with the existing hex-color rules.
5. Normalize all opacity values with the existing highlight opacity ranges:
   - hover opacity: `0.05` to `0.9`
   - selected face opacity: `0.05` to `0.95`
   - selected body opacity: `0.05` to `0.85`
6. Keep `ViewSettings.highlights` as a compatibility bridge for this phase, because Settings still exposes broader highlight controls and edge/point highlight values still live there.
7. When `geometryDisplay.surfaces` styles are changed from Properties, also update the corresponding `ViewSettings.highlights` fields so existing viewer reads and Settings readback stay synchronized.
8. Do not duplicate edge/point highlight ownership in Phase 3.
9. Add condensed Properties controls under `Render > Geometry Display` after the custom surface material controls:
   - `Surface Hover Color`
   - `Surface Hover Opacity`
   - `Surface Selected Color`
   - `Surface Selected Opacity`
   - `Body Selected Color`
   - `Body Selected Opacity`
10. Keep these controls visible regardless of `Surface Source` so hover/selected behavior is editable for both `Material Set` and `Custom` surface sources.
11. Keep the custom default surface material controls gated behind `Surface Source: Custom`.
12. Update `Viewer.ts` surface overlay reads to prefer `geometryDisplay.surfaces.hover`, `selected`, and `bodySelected` once the bridge exists.
13. Preserve existing topology-selection behavior:
   - face hover uses semantic face hover overlay geometry
   - face selected uses semantic face selection overlay geometry
   - whole-body selected uses selected body overlay geometry
14. Preserve edge and point overlay behavior exactly as-is.
15. Do not change selection routing, hover picking, topology identity, body/face selection semantics, or graph/content selection truth.
16. Add focused proof that Properties writes the surface interaction styles and keeps the legacy `highlights` bridge synchronized.
17. Add viewer proof that hover, selected face, and selected body overlays consume the new surface style values without rebuilding geometry.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/workspace/SettingsSurface.tsx` only if readback wording or reset behavior needs a bridge note
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not use Phase 3 to migrate all highlight settings.

Keep out:
- edge hover/selected controls
- point hover/selected controls
- edge thickness/glow migration
- point size/glow migration
- replacing Settings viewport highlight controls entirely
- full material-like hover/selected surface materials
- hover/selection behavior changes
- topology selection identity changes
- sketch, gizmo, transform, or helper styling

#### First Pass Decisions

- Phase 3 owns surface interaction styling only.
- Use color plus opacity, not full material fields, for hover/selected surfaces.
- Include both face-selected and whole-body-selected styles because the viewer has distinct overlay paths for face selection and body selection.
- Keep `ViewSettings.highlights` as the compatibility bridge until the later edge/point phases can move the rest of the highlight family honestly.
- Properties `Geometry Display` becomes the main user-facing home for surface hover/selected styling, while Settings may remain the broader legacy/highlight settings surface during the bridge.
- Controls remain visible for both `Material Set` and `Custom` surface sources.
- This phase should not change how hover/selection targets are determined.

#### Verification Shape

- store normalization proof for:
  - legacy Phase 2 `geometryDisplay.surfaces` without interaction styles
  - valid surface hover/selected/body-selected styles
  - invalid colors and out-of-range opacities falling back/clamping
- bridge proof that Properties surface style writes update both:
  - `view.geometryDisplay.surfaces.hover/selected/bodySelected`
  - the corresponding `view.highlights` fields
- Settings compatibility proof only if Settings reset/read behavior needs adjustment
- Properties proof that the six surface interaction controls appear in Geometry Display and write the expected saved fields
- viewer proof that:
  - face hover overlay uses `surfaces.hover`
  - face selected overlay uses `surfaces.selected`
  - whole body selected overlay uses `surfaces.bodySelected`
  - edge and point overlays still use their existing highlight fields
  - geometry is not rebuilt by style edits
- production build

#### Done Shape

Phase 3 is done when default, hover, and selected surface presentation are controlled from `Geometry Display`.

#### Shipped Read

- Added `hover`, `selected`, and `bodySelected` color/opacity styles to `geometryDisplay.surfaces`.
- Added `Surface Hover Color`, `Surface Hover Opacity`, `Surface Selected Color`, `Surface Selected Opacity`, `Body Selected Color`, and `Body Selected Opacity` to Properties `Render > Geometry Display`.
- Kept the new controls visible for both `Material Set` and `Custom` surface sources.
- Added a two-way compatibility bridge between `geometryDisplay.surfaces` styles and existing `ViewSettings.highlights` surface fields.
- Updated viewer face-hover, face-selected, and body-selected overlay reads to use `geometryDisplay.surfaces`.
- Preserved edge and point overlay styling for later phases.

## [x] `Properties-6 / Phase 4` - `Edge Visibility And Default Style`

### Phase 4 Summary

#### Purpose

Make edge visibility and default edge look explicit.

#### Owns

- edge mode: `Off`, `Visible Only`, `All`
- default edge color/opacity/depth where supported
- first depth behavior decision if needed

#### Does Not Own

- edge hover/selected styling
- replacing every helper/sketch overlay
- fat-line renderer upgrades unless required by proof

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Keep the shipped Phase 1 `geometryDisplay.edges.mode` and legacy `edgeDisplayMode` bridge.
2. Extend `geometryDisplay.edges` with a small default edge style:
   ```ts
   edges: {
     mode: 'off' | 'visibleOnly' | 'all'
     color: string
     opacity: number
     depthMode: 'surface' | 'xray'
   }
   ```
3. Default the new style to the current display-edge look:
   - color: neutral light display edge color already used by mesh/semantic overlays
   - opacity: current normal display-edge overlay opacity
   - depth mode: `xray` for the current `All`-style overlay behavior unless proof shows `Visible Only` needs `surface`
4. Normalize:
   - color through existing hex-color rules
   - opacity to `0` through `1`
   - depth mode to the supported enum
5. Add Properties controls under `Render > Geometry Display`, after the existing `Edges` mode selector and before `Points`:
   - `Edge Color`
   - `Edge Opacity`
   - `Edge Depth`
6. Hide the edge style controls when `Edges` is `Off`.
7. Keep the `Edges` mode selector always visible so the user can turn edges back on.
8. Route normal generated-part display-edge overlays through `geometryDisplay.edges`:
   - mesh fallback edge overlays
   - semantic/topology edge display overlays used for normal edge display
9. Preserve `Off`, `Visible Only`, and `All` behavior:
   - `Off` hides normal display edges
   - `Visible Only` preserves visible-edge depth behavior
   - `All` preserves xray/all-edge behavior
10. Do not move edge hover or edge selected/highlight overlay colors, glow, or thickness yet.
11. Keep topology edge picking targets available according to the existing picking/selection behavior.
12. Do not alter sketch/extrude helper overlays, transform/gizmo overlays, orientation widget edges, grid lines, selection outlines, or point overlays.
13. Add focused store proof for normalization and legacy `edgeDisplayMode` bridge preservation.
14. Add focused Properties proof that edge style controls hide when `Edges` is `Off`, show when `Visible Only` or `All`, and write expected saved fields.
15. Add viewer proof that normal display-edge overlays consume the new default edge color/opacity/depth settings while selected/hovered edge overlays still read existing `ViewSettings.highlights`.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not use Phase 4 to migrate all edge styling.

Keep out:
- edge hover styling
- edge selected/highlight styling
- highlight glow migration
- point styling
- sketch/extrude helper styling
- transform/gizmo/helper overlays
- fat-line renderer replacement unless a focused proof shows the existing line material cannot support the shipped control honestly
- Wireframe and Clay Studio preset recipes
- display-mode vocabulary changes

#### First Pass Decisions

- Phase 4 owns default display-edge appearance only.
- `geometryDisplay.edges.mode` remains the visible owner of `Off`, `Visible Only`, and `All`.
- `edgeDisplayMode` remains a compatibility bridge for older runtime reads until the later cleanup phase can retire it safely.
- Edge hover and edge selected/highlight presentation stay in `ViewSettings.highlights` until Phase 5.
- Browser line width cannot reliably render thickness beyond `1` through the current `LineBasicMaterial` path, so edge thickness is not a shipped Geometry Display control until a future fat-line renderer exists.
- Edge depth should be explicit because it is the practical difference between visible-only edge display and xray/all-edge display.

#### Verification Shape

- store normalization proof for:
  - legacy Phase 3 `geometryDisplay.edges` without style fields
  - invalid colors and out-of-range opacity values falling back or clamping
  - `edgeDisplayMode` writes still updating `geometryDisplay.edges.mode`
- Properties proof for:
  - `Edges: Off` hides edge style controls
  - `Edges: Visible Only` and `Edges: All` show edge style controls
  - color, opacity, and depth writes update `geometryDisplay.edges`
- viewer proof for:
  - normal display edge overlays use saved edge color and opacity
  - `Visible Only` still depth-tests as visible-only
  - `All` still xray-renders as all-edge display
  - hover/selected edge overlays still use existing highlight fields
- production build

#### Done Shape

Phase 4 is done when edge visibility and default edge appearance are normal editable render settings.

#### Shipped Read

- Extended `geometryDisplay.edges` with saved default `color`, `opacity`, and `depthMode`.
- Preserved the existing `geometryDisplay.edges.mode` / `edgeDisplayMode` compatibility bridge.
- Added `Edge Color`, `Edge Opacity`, and `Edge Depth` controls to Properties `Render > Geometry Display`.
- Kept edge style controls hidden while `Edges` is `Off`, with the `Edges` selector always visible.
- Routed normal semantic and mesh display-edge overlays through `geometryDisplay.edges`.
- Preserved `Visible Only` depth-tested behavior and `All` xray behavior by default.
- Removed edge thickness from the shipped Geometry Display contract after confirming the current viewer line path cannot reliably render it.
- Kept edge hover/selected overlays on existing `ViewSettings.highlights` fields for Phase 5.
- Kept sketch/extrude helper overlays, transform/gizmo overlays, selection outlines, point overlays, and preset recipes out of scope.

## [x] `Properties-6 / Phase 5` - `Edge Hover And Highlight Styles`

### Phase 5 Summary

#### Purpose

Make edge hover and selected/highlight presentation editable from `Geometry Display`.

#### Owns

- edge hover color/opacity
- edge selected color/opacity
- preservation of topology and sketch/extrude overlay readability

#### Does Not Own

- point styling
- semantic topology behavior changes

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Extend the shipped `geometryDisplay.edges` contract with explicit edge interaction styles:
   ```ts
   edges: {
     mode: 'off' | 'visibleOnly' | 'all'
     color: string
     opacity: number
     depthMode: 'surface' | 'xray'
     hover: {
       color: string
       opacity: number
     }
     selected: {
       color: string
       opacity: number
     }
   }
   ```
2. Default the new fields from the current edge highlight reads:
   - `hover.color` <- `highlights.hoverColor`
   - `hover.opacity` <- `0.65 + highlights.hoverGlow * 0.35`
   - `selected.color` <- `highlights.selectedColor`
   - `selected.opacity` <- `0.7 + highlights.selectedGlow * 0.3`
3. Normalize:
   - colors through the existing hex-color rules
   - opacity to `0` through `1`
4. Add compatibility helpers similar to the Phase 3 surface bridge:
   - create edge styles from existing `ViewSettings.highlights`
   - update the relevant legacy highlight fields when Geometry Display edge hover/selected controls are changed
5. Keep `ViewSettings.highlights` as a compatibility bridge for this phase because Settings still owns broader highlight controls and point highlight values still live there.
6. Do not move point hover/selected color, point size, surface styles, glow fields as public Geometry Display controls, or Settings highlight ownership beyond the edge bridge.
7. Add condensed controls in the `Edges` subsection after the default edge controls:
   - `Edge Hover Color`
   - `Edge Hover Opacity`
   - `Edge Selected Color`
   - `Edge Selected Opacity`
8. Keep all edge style controls hidden while `Edges` is `Off`, including default, hover, and selected controls.
9. Keep the `Edges` mode selector visible so the user can turn the edge subsection behavior back on.
10. Update `Viewer.ts` topology edge hover and selected overlays to read:
   - `geometryDisplay.edges.hover`
   - `geometryDisplay.edges.selected`
11. Preserve the existing overlay shape and behavior:
   - hover edge uses semantic edge hover overlay geometry
   - selected edge uses semantic edge selection overlay geometry
   - both stay `depthTest: false`, `depthWrite: false`, and `toneMapped: false`
   - render order remains unchanged unless proof finds a real legibility regression
12. Preserve semantic topology pick priority and selected-edge outline behavior.
13. Preserve normal display-edge overlays from Phase 4:
   - `Edge Color`
   - `Edge Opacity`
   - `Edge Depth`
14. Preserve sketch/extrude helper overlays, transform/gizmo overlays, orientation widget edges, grid lines, selection outlines, point overlays, and render-preset recipes.
15. Add store proof for:
   - legacy Phase 4 `geometryDisplay.edges` without hover/selected styles
   - invalid edge hover/selected colors and out-of-range opacity values falling back or clamping
   - Geometry Display edge style writes updating the matching compatibility highlight fields
   - direct `highlights` writes still refreshing the edge hover/selected Geometry Display bridge
16. Add Properties proof for:
   - `Edges: Off` hides default, hover, and selected edge style controls
   - `Edges: Visible Only` and `Edges: All` show default, hover, and selected edge style controls
   - all six hover/selected controls write expected saved fields
17. Add viewer proof for:
   - selected topology edge overlays use `geometryDisplay.edges.selected`
   - hovered topology edge overlays use `geometryDisplay.edges.hover`
   - point overlays still read existing point highlight fields
   - surface overlays still read `geometryDisplay.surfaces`
   - normal display-edge overlays still read the default `geometryDisplay.edges` style from Phase 4
18. Run focused store, Properties, viewer tests, production build, and browser visual verification if the browser backend is available.

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/workspace/PropertiesRenderSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not use Phase 5 to migrate every highlight setting.

Keep out:
- point hover styling
- point selected/highlight styling
- point size/glow migration
- surface style changes
- Settings highlight UI replacement
- sketch/extrude helper styling
- transform/gizmo/helper overlays
- orientation widget edge styling
- Wireframe and Clay Studio preset recipes
- display-mode vocabulary changes
- topology selection routing or pick-priority changes

#### First Pass Decisions

- Phase 5 owns semantic/topology edge hover and selected presentation only.
- Use color and opacity for hover/selected edge styles.
- Store those styles under `geometryDisplay.edges.hover` and `geometryDisplay.edges.selected`.
- Keep glow as a legacy compatibility input for deriving the first opacity defaults, but do not add `Edge Hover Glow` or `Edge Selected Glow` controls in Geometry Display.
- Keep `ViewSettings.highlights` as the bridge until point styling and cleanup phases can migrate the remaining highlight family honestly.
- Hide the interaction edge controls with the rest of the edge style controls when `Edges` is `Off`.
- Do not change whether an edge can be selected or hovered; only change how the overlay is styled.

#### Verification Shape

- store normalization proof for:
  - legacy Phase 4 geometry display without edge interaction styles
  - invalid colors falling back
  - opacity clamping
  - bridge writes from Geometry Display edge interaction styles to legacy highlight fields
  - bridge writes from legacy highlight fields back into Geometry Display edge interaction styles
- Properties proof for:
  - `Edges: Off` hides edge interaction controls
  - `Edges: Visible Only` and `Edges: All` show edge interaction controls
  - edge hover color/opacity writes
  - edge selected color/opacity writes
- viewer proof for:
  - hovered topology edge overlay uses `geometryDisplay.edges.hover`
  - selected topology edge overlay uses `geometryDisplay.edges.selected`
  - normal display edges keep using default `geometryDisplay.edges.color/opacity/depthMode`
  - selected/hovered points still use the existing point highlight fields
  - selected/hovered faces still use `geometryDisplay.surfaces`
  - overlay depth/readability flags remain unchanged
- production build
- browser visual check of the `Edges` subsection after implementation when available

#### Done Shape

Phase 5 is done when default, hover, and selected edge presentation are controlled from `Geometry Display`.

#### Shipped Read

- Extended `geometryDisplay.edges` with saved `hover` and `selected` color and opacity styles.
- Added `Edge Hover Color`, `Edge Hover Opacity`, `Edge Selected Color`, and `Edge Selected Opacity` controls inside the collapsible `Edges` subsection.
- Kept all default, hover, and selected edge style controls hidden while `Edges` is `Off`.
- Preserved the `edgeDisplayMode` bridge and normal display-edge default styling from Phase 4.
- Added a compatibility bridge so edge interaction style edits project into existing highlight edge color/glow fields without letting unrelated edge default edits overwrite the bridge.
- Updated topology edge hover and selected overlays to read `geometryDisplay.edges.hover` and `geometryDisplay.edges.selected`.
- Removed edge thickness from Phase 5 after confirming the current viewer line path cannot reliably render it.
- Preserved point styling, surface styling, sketch/extrude helper overlays, transform/gizmo overlays, selection behavior, and render-preset recipes for later phases.

## [x] `Properties-6 / Phase 5.1` - `Edge Preset Model And Depth UI Cleanup`

### Phase 5.1 Summary

#### Purpose

Make edge visibility/depth understandable as one preset choice.

The current `Edges: Off / Visible Only / All` control and `Edge Depth: Surface / Xray` control overlap conceptually. Phase 5.1 should turn that into one user-facing `Edge Preset` control while preserving the shipped renderer behavior.

#### Owns

- `Edge Preset` UI language
- mapping the current `Off`, `Visible Only`, and `All/Xray` behavior into one visible selector
- hiding `Edge Depth` from normal Properties UI
- compatibility mapping from the shipped `geometryDisplay.edges.mode` and `geometryDisplay.edges.depthMode` fields

#### Does Not Own

- actual `Hidden Line` dashed rendering
- fat-line renderer upgrades
- point styling
- Wireframe or Clay Studio recipe rewrites
- graph geometry, topology truth, or export behavior

#### Prep Read

- Live settings already had `geometryDisplay.edges.mode` and `geometryDisplay.edges.depthMode`.
- Live Properties UI exposed both `Edges` and `Edge Depth`, which made `All` plus `Xray` feel like two names for the same behavior.
- Live viewer rendering already consumes the legacy `edgeDisplayMode` bridge plus edge `depthMode`.
- The first implementation should add one visible `preset` owner while keeping `mode` and `depthMode` as compatibility/runtime fields.
- `Hidden Line` should stay out of this phase because it needs real dashed hidden-edge rendering proof.

### Phase 5.1 Implementation Spec

#### Exact First Code Cut

1. Add or expose one edge preset concept:
   ```ts
   edges: {
     preset: 'off' | 'visibleOnly' | 'xray'
   }
   ```
2. Preserve compatibility with existing saved fields:
   - `mode: 'off'` maps to `preset: 'off'`
   - `mode: 'visibleOnly'` maps to `preset: 'visibleOnly'`
   - `mode: 'all'` plus `depthMode: 'xray'` maps to `preset: 'xray'`
   - `mode: 'all'` plus `depthMode: 'surface'` maps to `preset: 'visibleOnly'` unless implementation proof finds a useful separate meaning
3. Replace the Properties `Edges` selector label with `Edge Preset`.
4. Use user-facing options:
   - `Off`
   - `Visible Only`
   - `Xray`
5. Remove the visible `Edge Depth` control from `Geometry Display`.
6. Keep `Edge Color`, `Edge Opacity`, `Edge Hover Color`, `Edge Hover Opacity`, `Edge Selected Color`, and `Edge Selected Opacity` visible when the preset is not `Off`.
7. Keep all edge style controls hidden when the preset is `Off`.
8. Keep the viewer behavior unchanged:
   - `Off` hides normal display edges
   - `Visible Only` uses depth-tested visible edges
   - `Xray` renders all display edges through surfaces
9. Keep legacy `edgeDisplayMode` bridge behavior stable until the cleanup phase can retire it safely.
10. Add focused store, Properties, and viewer proof for the mapping.

#### Done Shape

Phase 5.1 is done when the user sees one clear `Edge Preset` choice instead of a duplicated mode/depth decision, and the current three behaviors still render the same.

#### Shipped Read

- Added a saved `geometryDisplay.edges.preset` value with `Off`, `Visible Only`, and `Xray` states.
- Kept `geometryDisplay.edges.mode` and `geometryDisplay.edges.depthMode` as compatibility/runtime fields derived from the preset.
- Replaced the Properties `Edges` selector label with `Edge Preset`.
- Removed the visible `Edge Depth` control from Properties `Render > Geometry Display`.
- Preserved `Edge Color`, `Edge Opacity`, `Edge Hover Color`, `Edge Hover Opacity`, `Edge Selected Color`, and `Edge Selected Opacity` when the preset is not `Off`.
- Preserved existing viewer behavior: `Off` hides display edges, `Visible Only` depth-tests visible edges, and `Xray` renders all display edges through surfaces.
- Preserved the legacy `edgeDisplayMode` bridge for display-mode and saved-settings compatibility.
- Left `Hidden Line`, hidden-line styling controls, point styling, Wireframe recipes, and Clay Studio recipes to later phases.

## [x] `Properties-6 / Phase 5.2` - `Hidden Line Edge Preset Runtime`

### Phase 5.2 Summary

#### Purpose

Add `Hidden Line` as a real edge preset, not just a UI label.

`Hidden Line` should show normal visible/front edges as solid lines and behind-surface edges as dashed, softer lines.

#### Owns

- `Hidden Line` preset runtime behavior
- viewer overlay strategy for solid visible edges plus dashed hidden edges
- proof that hidden lines stay readable over material-set and custom surfaces
- proof that topology selection, hover, and helper overlays keep their current priority

#### Does Not Own

- broad render-preset rewrites
- point styling
- edge thickness
- graph geometry or export line generation
- turning hidden-line view into a 2D drawing/export mode

### Phase 5.2 Implementation Spec

#### Current Live Read

- Phase 5.1 shipped `geometryDisplay.edges.preset` with `off`, `visibleOnly`, and `xray`.
- The compatibility fields still exist:
  - `geometryDisplay.edges.mode`
  - `geometryDisplay.edges.depthMode`
  - legacy `edgeDisplayMode`
- Properties `Render > Geometry Display > Edges` now exposes one `Edge Preset` control and hides `Edge Depth`.
- `Viewer.ts` normal display edges currently use one `LineSegments` overlay per generated part path:
  - semantic topology-backed edge overlays in `semanticEdgeOverlaysByPartKey`
  - fallback mesh edge overlays in `meshEdgeWireframeOverlaysByPartKey`
- Normal display edge presentation currently flows through `applyEdgeOverlayPresentation(...)`, which writes color, opacity, and depth behavior onto `LineBasicMaterial`.
- Topology hover and selected edges already use separate overlay objects and should remain above normal display edges.
- The current edge overlay maps are presentation-only and downstream from preview mesh geometry, so adding hidden-line overlays must not change graph geometry, material truth, or export output.

#### Implementation Direction

Use a two-layer display-edge strategy for `Hidden Line`:

1. Keep the normal solid edge overlay as the visible/front edge layer.
2. Add a second hidden-edge overlay for the same edge geometry.
3. Render the hidden layer as dashed and muted.
4. Keep hidden-line style values internal defaults for this phase.
5. Reuse existing semantic and mesh edge geometry creation where possible.
6. Keep selected and hovered topology edge overlays separate and higher priority.

The first implementation should prefer one of these renderer shapes:

- Add hidden-line sibling overlays beside the existing semantic and mesh edge overlays.
- Or, if a sibling map is too much for one pass, add a small owner helper that creates paired solid/hidden line overlays from the same `BufferGeometry`.

Do not overload the existing single overlay material for hidden-line behavior, because `Hidden Line` needs different solid/hidden presentation at the same time.

#### Exact First Code Cut

1. Extend the edge preset enum to include:
   ```ts
   'hiddenLine'
   ```
2. Add `Hidden Line` to the `Edge Preset` control.
3. Keep `Hidden Line` hidden or disabled only if the renderer proof fails; do not ship a non-working option.
4. Map `hiddenLine` to the compatibility fields in the least surprising way:
   - `mode: 'all'`
   - `depthMode: 'xray'`
   - `edgeDisplayMode: 'on'`
   - hidden-line-specific rendering should branch from `preset`, not from those compatibility fields alone.
5. Render the visible/front edge layer with the current default edge color and opacity.
6. Render the behind-surface edge layer as dashed, muted lines.
7. Prefer an implementation that reuses existing semantic/mesh edge overlay geometry.
8. Use a separate dashed material/overlay if needed instead of overloading the normal xray layer.
9. Keep selected/hovered topology edge overlays above hidden-line display edges.
10. Verify the look with surfaces:
   - material-set surfaces
   - custom opaque surfaces
   - custom transparent surfaces
   - surfaces off
11. Keep the first hidden-line styling defaults hard-coded or normalized under the edge preset contract; detailed user controls belong to Phase 5.3.
12. Add focused store proof that `hiddenLine` normalizes, persists, and derives the compatibility fields.
13. Add focused Properties proof that `Edge Preset` includes `Hidden Line` and still hides edge styling when `Off`.
14. Add focused viewer proof that:
   - `Visible Only` behavior is unchanged.
   - `Xray` behavior is unchanged.
   - `Hidden Line` creates or activates a dashed hidden-edge layer.
   - selected and hovered topology edge overlays still render above display edges.
15. Run production build and browser visual check if the browser backend is available.

#### Open Runtime Questions

- Whether current `LineDashedMaterial` plus computed line distances works reliably with the generated `LineSegments` edge geometry.
- Whether the hidden layer should draw with `depthTest: false` plus low opacity, or use a two-pass depth approach if the current runtime supports it cleanly.
- Whether imported/reference mesh edge overlays can share the same hidden-line behavior in the first pass or should be explicitly deferred.

#### First Pass Decisions

- `Hidden Line` is a real preset option only if the viewer renders both layers.
- Use `LineDashedMaterial` only if the implementation can compute line distances for the relevant `LineSegments` geometry and prove the dash renders in tests or browser.
- If `LineDashedMaterial` cannot be proven quickly, do not ship a fake dashed control; keep Phase 5.2 open or implement a minimal dashed segment geometry helper.
- Hidden-line defaults should start conservative:
  - hidden color derives from the current edge color unless a fixed muted fallback is clearer.
  - hidden opacity should be lower than the normal edge opacity.
  - dash and gap sizes are internal constants for this phase.
- Surfaces off may reasonably show only the normal solid/xray edge layer if there is no meaningful behind-surface read without surfaces.
- Imported/reference mesh hidden-line parity can be deferred if generated-part semantic and mesh fallback overlays are proven first.

#### Done Shape

Phase 5.2 is done when `Hidden Line` visibly renders solid front edges plus dashed behind-surface edges in the viewer and does not change selection, graph geometry, material truth, or export truth.

#### Shipped Read

- Extended `geometryDisplay.edges.preset` with `hiddenLine`.
- Added `Hidden Line` to the Properties `Edge Preset` control.
- Mapped `hiddenLine` to the existing compatibility fields as `mode: 'all'`, `depthMode: 'xray'`, and `edgeDisplayMode: 'on'`.
- Added dashed hidden-line sibling overlays for semantic topology-backed display edges and mesh fallback display edges.
- Kept the normal display-edge overlay as the solid visible/front layer.
- Used internal hidden-line opacity, dash, and gap defaults for this phase.
- Kept selected and hovered topology edge overlays separate from display-edge overlays.
- Kept hidden-line styling controls, Wireframe recipes, Clay Studio recipes, point styling, edge thickness, graph geometry, material truth, and export truth out of scope.
- Left imported/reference hidden-line parity as future proof unless it already shares the generated part overlay path.

## [x] `Properties-6 / Phase 5.3` - `Hidden Line Styling And Recipe Prep`

### Phase 5.3 Summary

#### Purpose

Make hidden-line presentation tunable after the renderer exists.

#### Owns

- hidden-line color/opacity controls if Phase 5.2 proves the runtime path
- dash/gap controls if the dashed line material can honor them reliably
- first recipe-read notes for technical drawing / wireframe-like looks

#### Does Not Own

- saved custom render presets
- full Wireframe and Clay Studio recipe rewrites
- edge thickness or fat-line rendering
- drawing/export generation

### Phase 5.3 Implementation Spec

#### Current Live Read

- Phase 5.2 shipped `geometryDisplay.edges.preset: 'hiddenLine'`.
- The viewer now creates hidden-line sibling overlays for:
  - semantic topology-backed display edges
  - mesh fallback display edges
- The normal edge color and opacity still drive the solid visible/front edge layer.
- The dashed hidden layer currently derives from:
  - `edgeStyle.color`
  - `edgeStyle.opacity * HIDDEN_LINE_EDGE_OPACITY_MULTIPLIER`
  - `HIDDEN_LINE_EDGE_DASH_SIZE`
  - `HIDDEN_LINE_EDGE_GAP_SIZE`
- `LineDashedMaterial` is already in use and `computeLineDistances()` is already called for the dashed overlays.
- Properties already has an `Edges` subsection with:
  - `Edge Preset`
  - `Edge Color`
  - `Edge Opacity`
  - hover color/opacity
  - selected color/opacity

#### Implementation Direction

Add a small hidden-line style object under the existing edge display owner:

```ts
edges: {
  hiddenLine: {
    color: string
    opacity: number
    dashSize: number
    gapSize: number
  }
}
```

`Edge Color` and `Edge Opacity` should keep controlling the solid visible/front edge layer. The new hidden-line controls should affect only the dashed hidden layer.

The first control set should be:

- `Hidden Edge Color`
- `Hidden Edge Opacity`
- `Dash Length`
- `Gap Length`

Use `Length` instead of `Size` in the UI because it reads more naturally for the user, but keep code names such as `dashSize` and `gapSize` if that matches `LineDashedMaterial`.

#### Exact First Code Cut

1. Add hidden-line style settings only after Phase 5.2 proves the renderer path:
   ```ts
   hiddenLine: {
     color: string
     opacity: number
     dashSize: number
     gapSize: number
   }
   ```
2. Default the hidden-line style from the current Phase 5.2 runtime constants:
   - color starts as the default edge color unless a muted default is already better in the shipped look
   - opacity should match the current effective hidden-line opacity
   - dash size should match `HIDDEN_LINE_EDGE_DASH_SIZE`
   - gap size should match `HIDDEN_LINE_EDGE_GAP_SIZE`
3. Normalize:
   - color through existing hex-color rules
   - opacity from `0` to `1`
   - dash size to a small positive bounded range
   - gap size to a small positive bounded range
4. Show hidden-line controls only when `Edge Preset` is `Hidden Line`.
5. Keep normal edge color/opacity as the solid visible-edge layer.
6. Keep hidden-line styling separate from hover and selected edge styling.
7. Update `Viewer.ts` hidden-line dashed materials to read:
   - `geometryDisplay.edges.hiddenLine.color`
   - `geometryDisplay.edges.hiddenLine.opacity`
   - `geometryDisplay.edges.hiddenLine.dashSize`
   - `geometryDisplay.edges.hiddenLine.gapSize`
8. Preserve the normal solid edge layer:
   - it still reads `geometryDisplay.edges.color`
   - it still reads `geometryDisplay.edges.opacity`
   - it stays depth-tested while `Hidden Line` is active
9. Add focused store proof that:
   - missing legacy `hiddenLine` style normalizes to defaults
   - invalid color falls back
   - opacity clamps
   - dash/gap values clamp
10. Add focused Properties proof that controls hide when the preset is not `Hidden Line`.
11. Add focused Properties proof that the four hidden-line controls write the expected saved fields.
12. Add focused viewer proof that hidden-line settings update the dashed layer without changing normal solid edge settings.
13. Record the later Phase 8 recipe handoff:
   - Wireframe can choose `Xray` or `Hidden Line` depending on intended look.
   - Clay Studio can keep muted visible edges unless a later preset explicitly chooses hidden-line edges.
14. Run focused store, Properties, and viewer tests plus production build.

#### First Pass Decisions

- Do not add a separate hidden-line color picker expansion model if the existing `PropertiesColorControl` can be reused directly.
- Do not expose hidden-line thickness.
- Do not add alternate dash presets yet; numeric dash/gap controls are enough for the first editable pass.
- Do not make hidden-line style controls visible for `Xray`, because `Xray` has no dashed hidden layer.
- Keep hidden-line style under `geometryDisplay.edges`, not under render presets or material settings.
- Keep hidden-line recipe integration deferred to Phase 8 after the editing surface is stable.

#### Done Shape

Phase 5.3 is done when hidden-line styling is editable only for the hidden-line preset and the later recipe phases have a clean handoff.

#### Shipped Read

- Added a saved `geometryDisplay.edges.hiddenLine` style object with `color`, `opacity`, `dashSize`, and `gapSize`.
- Added normalized bounds for hidden-line dash and gap sizes so bad saved values cannot create zero-length or oversized dash patterns.
- Added `Hidden Edge Color`, `Hidden Edge Opacity`, `Dash Length`, and `Gap Length` controls inside Properties `Render > Geometry Display > Edges`.
- Kept the hidden-line controls visible only when `Edge Preset` is `Hidden Line`.
- Kept normal `Edge Color` and `Edge Opacity` as the solid visible/front edge layer while hidden-line controls affect only the dashed hidden layer.
- Updated the viewer dashed hidden-line material to read the saved hidden-line color, opacity, dash size, and gap size settings.
- Kept edge hover and selected styles separate from hidden-line styling.
- Kept hidden-line thickness, alternate dash presets, full Wireframe/Clay Studio recipe writes, saved custom render presets, graph geometry, material truth, and export truth out of this phase.
- Advanced the next Geometry Display handoff to Phase 6 point visibility and default styling.

## [x] `Properties-6 / Phase 5.4` - `Edge Depth Hidden Edges And Line Style`

### Phase 5.4 Summary

#### Purpose

Bring `Edge Depth`, `Hidden Edges`, and `Line Style` back into the visible settings model so `Hidden Line` becomes a recipe of ordinary editable controls instead of a special hidden branch.

#### Owns

- visible `Edge Depth` control under the edge subsection
- `Hidden Edges` visibility/control tied to `Edge Depth: Xray`
- first `Line Style` control for the hidden-edge layer
- preset-to-setting synchronization
- compatibility with the existing `geometryDisplay.edges.depthMode` viewer field

#### Does Not Own

- `Custom` preset readback
- new edge renderer types
- hidden-line thickness
- dotted/dash-dot variants beyond the first line-style contract
- saved custom render presets
- point styling

### Phase 5.4 Implementation Spec

#### Prep Read

- `ViewGeometryDisplaySettings.edges.depthMode` already exists and is normalized in `src/shared/viewSettingsTypes.ts`, but Phase 5.1 made it preset-derived and removed the visible Properties control.
- `geometryDisplay.edges.preset` currently has `off`, `visibleOnly`, `xray`, and `hiddenLine`.
- `geometryDisplayEdgePresetToMode(...)` maps both `xray` and `hiddenLine` to `mode: 'all'`.
- `geometryDisplayEdgePresetToDepthMode(...)` currently maps `visibleOnly` to `surface` and every other preset to `xray`.
- `geometryDisplayEdgeModeAndDepthToPreset(...)` currently cannot infer `hiddenLine`, because hidden-line behavior is only represented by the preset.
- Properties `Render > Geometry Display > Edges` currently shows:
  - `Edge Preset`
  - `Edge Color`
  - `Edge Opacity`
  - hidden-line color, opacity, dash length, and gap length only when `preset === 'hiddenLine'`
  - hover and selected edge style controls
- `Edge Depth` is not currently rendered in `PropertiesRenderSection.tsx`.
- The viewer currently decides the hidden-edge layer with `resolveHiddenLineEdges()` using `geometryDisplay.edges.preset === 'hiddenLine'`.
- The viewer currently forces the solid display-edge layer to depth-tested while hidden-line is active by folding `hiddenLineEdges` into `visibleEdgesOnly`.
- The hidden dashed layer already exists in separate semantic and mesh fallback overlay maps and already reads `geometryDisplay.edges.hiddenLine`.

#### Prep Decision

Phase 5.4 should add two new saved edge settings under `geometryDisplay.edges`:

```ts
hiddenEdges: boolean
lineStyle: 'solid' | 'dashed'
```

Use `hiddenEdges` instead of making hidden-edge visibility implicit in `preset`, and use `lineStyle` as the first line-style owner for the hidden-edge layer. Do not move dash/gap values; keep them in `geometryDisplay.edges.hiddenLine`.

`Hidden Line` should become a preset recipe that applies:

```ts
{
  preset: 'hiddenLine',
  mode: 'all',
  depthMode: 'xray',
  hiddenEdges: true,
  lineStyle: 'dashed'
}
```

`Xray` should apply:

```ts
{
  preset: 'xray',
  mode: 'all',
  depthMode: 'xray',
  hiddenEdges: false,
  lineStyle: 'solid'
}
```

`Visible Only` should apply:

```ts
{
  preset: 'visibleOnly',
  mode: 'visibleOnly',
  depthMode: 'surface',
  hiddenEdges: false,
  lineStyle: 'solid'
}
```

`Off` should apply:

```ts
{
  preset: 'off',
  mode: 'off',
  depthMode: 'xray',
  hiddenEdges: false,
  lineStyle: 'solid'
}
```

If the user changes `Edge Depth` to `Surface`, hide `Hidden Edges` and keep the saved hidden-edge visibility off for this first pass. That keeps the runtime honest and avoids a hidden on-state that has no visible effect. A later custom-readback phase can decide whether preserving hidden toggles across depth changes is useful.

For Phase 5.4, `Line Style` should show only when `Hidden Edges` is `On`. The front/visible edge layer remains solid regardless of the hidden-edge line style.

#### Current Live Read

- Phase 5.1 hid `Edge Depth` to remove overlap while the preset model settled.
- Phase 5.2 added `Hidden Line` as a real preset.
- Phase 5.3 added hidden-line style controls.
- `geometryDisplay.edges.depthMode` still exists as the viewer-facing depth owner.
- Users now need direct control over `Surface` versus `Xray` depth again, while presets should still set sane defaults.
- The hidden-line behavior is clearer if behind-surface edge visibility is tied to `Edge Depth: Xray`.
- The dashed hidden-line look is clearer if dash behavior is represented as a `Line Style` setting.

#### Implementation Direction

Show `Edge Depth` when `Edge Preset` is not `Off`. Treat presets as recipes that set editable settings, not as a reason to hide those settings forever.

Add these normal settings under the edge owner:

- `Edge Depth`: `Surface` / `Xray`
- `Hidden Edges`: `Off` / `On`
- `Line Style`: `Solid` / `Dashed`

`Hidden Edges` should only be shown when `Edge Depth` is `Xray`, because surface-depth edges do not have a behind-surface layer to reveal. If `Edge Depth` changes back to `Surface`, the UI can hide `Hidden Edges`; implementation can either preserve the saved value for later Xray return or normalize it off, but the decision should be explicit in prep before coding.

`Line Style` should start as the style for the hidden-edge layer. The front/visible edge layer should remain solid for this phase so the technical drawing look stays readable.

Built-in preset recipe defaults should be:

- `Off`: display edges hidden; no visible depth/hidden-edge/line-style controls
- `Visible Only`: edges on, `Edge Depth: Surface`, `Hidden Edges: Off`, `Line Style: Solid`
- `Xray`: edges on, `Edge Depth: Xray`, `Hidden Edges: Off`, `Line Style: Solid`
- `Hidden Line`: edges on, `Edge Depth: Xray`, `Hidden Edges: On`, visible/front edges solid, hidden-edge layer `Line Style: Dashed`

If the user changes `Edge Depth`, `Hidden Edges`, or `Line Style`, keep the underlying saved edge settings accurate immediately. The visible preset readback may still remain the selected preset until Phase 5.5 adds `Custom` detection.

#### Exact First Code Cut

1. Add `ViewGeometryDisplayEdgeLineStyle = 'solid' | 'dashed'`.
2. Add `VIEW_GEOMETRY_DISPLAY_EDGE_LINE_STYLES` and `isViewGeometryDisplayEdgeLineStyle(...)`.
3. Extend `ViewGeometryDisplaySettings.edges` and `LegacyViewSettingsInput.geometryDisplay.edges` with:
   - `hiddenEdges: boolean`
   - `lineStyle: ViewGeometryDisplayEdgeLineStyle`
4. Normalize legacy/missing values so existing saved views default to `hiddenEdges: false` and `lineStyle: 'solid'`, except the `hiddenLine` preset normalizes to `hiddenEdges: true` and `lineStyle: 'dashed'`.
5. Update preset helpers so built-in preset selection writes the recipe fields listed in the prep decision.
6. Reintroduce the Properties `Edge Depth` control below `Edge Opacity`.
7. Add a `Hidden Edges` `Off` / `On` control shown only when `Edge Depth` is `Xray`.
8. Add a `Line Style` control with `Solid` and `Dashed`, shown only when `Hidden Edges` is `On` and scoped to the hidden-edge layer.
9. Keep `Edge Depth`, `Hidden Edges`, and `Line Style` hidden while `Edge Preset` is `Off`.
10. Make preset selection update:
   - `geometryDisplay.edges.mode`
   - `geometryDisplay.edges.depthMode`
   - the hidden-edge visibility setting
   - the hidden-edge line-style setting
11. Update `Viewer.ts` so hidden-edge overlay visibility comes from `geometryDisplay.edges.hiddenEdges && geometryDisplay.edges.depthMode === 'xray'`, not directly from `preset === 'hiddenLine'`.
12. Update `Viewer.ts` so the solid/front display-edge layer is depth-tested whenever hidden edges are on.
13. Update `Viewer.ts` so `lineStyle: 'dashed'` uses the existing dashed hidden-line material path.
14. For `lineStyle: 'solid'`, use a solid hidden-edge material path if one can be done narrowly with the existing overlay geometry; if not, keep the control scoped to `Dashed` in this phase and record the follow-up before implementation.
15. Preserve hidden-line runtime behavior:
   - solid front/visible layer remains depth-tested
   - hidden layer remains xray/non-depth-tested only when hidden edges are on
   - hidden layer becomes dashed only when line style is dashed
16. Add focused store proof that:
   - old settings normalize to hidden edges off and solid line style
   - `hiddenLine` normalizes to hidden edges on and dashed line style
   - invalid line style falls back to solid
   - depth `Surface` normalizes hidden edges off
17. Add focused Properties proof that:
   - `Edge Depth` is hidden for `Off`
   - `Edge Depth` is visible for `Visible Only`, `Xray`, and `Hidden Line`
   - `Hidden Edges` is hidden for `Surface`
   - `Hidden Edges` is visible for `Xray`
   - `Line Style` is visible only while hidden edges are on
   - changing `Edge Depth` writes `geometryDisplay.edges.depthMode`
   - changing `Hidden Edges` and `Line Style` writes their saved settings
18. Add focused viewer proof that:
   - `Xray` with `Hidden Edges: Off` does not show the hidden-edge layer
   - `Hidden Edges: On` shows the behind-surface layer
   - `Line Style: Dashed` applies the dashed material
19. Run focused store/Properties/viewer proof plus production build.

#### Done Shape

Phase 5.4 is done when edge depth, hidden-edge visibility, and hidden-edge line style are editable normal settings, and `Hidden Line` is just the built-in recipe that turns on xray hidden dashed edges.

#### Shipped Read

- Added saved `geometryDisplay.edges.hiddenEdges` and `geometryDisplay.edges.lineStyle`.
- Added the `solid` / `dashed` line-style contract and normalizer.
- Restored the Properties `Edge Depth` control while edges are not `Off`.
- Added `Hidden Edges` as an `Off` / `On` control that appears only when `Edge Depth` is `Xray`.
- Added `Line Style` as a `Solid` / `Dashed` control that appears only while hidden edges are on.
- Kept hidden-edge color and opacity visible while hidden edges are on, and kept dash/gap controls visible only for dashed hidden edges.
- Updated built-in edge preset selection so `Visible Only`, `Xray`, and `Hidden Line` apply full recipe values for mode, depth, hidden-edge visibility, and line style.
- Updated viewer hidden-edge overlays to read `hiddenEdges && depthMode === 'xray'` instead of checking `preset === 'hiddenLine'`.
- Preserved the solid/front edge layer as depth-tested whenever hidden edges are on.
- Preserved custom preset readback for Phase 5.5.

## [x] `Properties-6 / Phase 5.5` - `Edge Preset Custom Readback`

### Phase 5.5 Summary

#### Purpose

Make `Edge Preset` read honestly as `Custom` when the user changes preset-owned edge settings away from a built-in recipe.

#### Owns

- `Custom` edge preset readback
- recipe matching for built-in edge presets
- built-in preset re-application behavior

#### Does Not Own

- saved named custom render presets
- full Wireframe/Clay Studio recipe migration
- material truth
- graph/export output
- point styling

### Phase 5.5 Implementation Spec

#### Prep Read

- Phase 5.4 shipped the first honest edge recipe settings:
  - `geometryDisplay.edges.mode`
  - `geometryDisplay.edges.depthMode`
  - `geometryDisplay.edges.hiddenEdges`
  - `geometryDisplay.edges.lineStyle`
- `geometryDisplay.edges.preset` still stores only built-in values: `off`, `visibleOnly`, `xray`, and `hiddenLine`.
- `VIEW_GEOMETRY_DISPLAY_EDGE_PRESETS` does not include `custom` yet.
- Properties `Edge Preset` currently displays the saved preset directly.
- Selecting a built-in preset in `PropertiesRenderSection.tsx` applies the recipe helpers:
  - `geometryDisplayEdgePresetToMode(...)`
  - `geometryDisplayEdgePresetToDepthMode(...)`
  - `geometryDisplayEdgePresetToHiddenEdges(...)`
  - `geometryDisplayEdgePresetToLineStyle(...)`
- Manual edits to `Edge Depth`, `Hidden Edges`, or `Line Style` currently update their saved settings but do not update preset readback.
- Viewer behavior now reads the recipe settings directly, so Phase 5.5 should not need a viewer implementation change unless the compatibility bridge changes.

#### Prep Decision

Use `Custom` as a readback-only preset state for the Properties selector. Do not persist `custom` into `ViewGeometryDisplayEdgePreset` in the first pass.

The first recipe signature should include only the structural edge recipe fields:

```ts
{
  mode: ViewGeometryDisplayEdgeMode
  depthMode: ViewGeometryDisplayEdgeDepthMode
  hiddenEdges: boolean
  lineStyle: ViewGeometryDisplayEdgeLineStyle
}
```

Do not include these fields in the first `Custom` match:

- default edge color
- default edge opacity
- hidden-edge color
- hidden-edge opacity
- hidden-edge dash size
- hidden-edge gap size
- hover/selected edge styles

Reason: color, opacity, and dash/gap are style tuning fields. If those immediately force `Custom`, the preset selector becomes too jumpy while the user is simply adjusting the look inside a chosen recipe. Phase 9 can later handle wider render-preset custom readback across full visual recipes.

The readback rules should be:

- `Off`: `mode: 'off'`
- `Visible Only`: `mode: 'visibleOnly'`, `depthMode: 'surface'`, `hiddenEdges: false`, `lineStyle: 'solid'`
- `Xray`: `mode: 'all'`, `depthMode: 'xray'`, `hiddenEdges: false`, `lineStyle: 'solid'`
- `Hidden Line`: `mode: 'all'`, `depthMode: 'xray'`, `hiddenEdges: true`, `lineStyle: 'dashed'`
- `Custom`: anything else

`lineStyle` should matter only when `hiddenEdges` is true. If `hiddenEdges` is false, normalize or compare line style as `solid` for recipe matching so a hidden saved dashed value does not force `Custom` while hidden edges are off.

Selecting a built-in preset should still write that preset's full recipe and should replace a `Custom` readback immediately.

#### Current Live Read

- `Edge Preset` currently stores one of the built-in states.
- Users can edit edge style values that are conceptually part of those presets.
- Once Phase 5.4 restores `Edge Depth` and adds `Hidden Edges` plus `Line Style`, a user can make combinations that no longer match `Visible Only`, `Xray`, or `Hidden Line` exactly.

#### Implementation Direction

Add a `Custom` readback state for edge presets. `Custom` should mean "the current edge display recipe settings are user-edited and do not match a built-in recipe." It should not become a full saved preset library.

The recipe matching surface should include:

- edge preset/mode visibility
- edge depth
- hidden-edge visibility
- hidden-edge line style
- default edge color and opacity should stay out of the Phase 5.5 recipe signature
- hidden-line color, opacity, dash size, and gap size should stay out of the Phase 5.5 recipe signature

The first implementation should define the recipe boundary explicitly before coding. The selected boundary is structural edge behavior only: visibility/mode, depth, hidden-edge visibility, and hidden-edge line style. The important product behavior is that the selector does not keep claiming a built-in preset after the user changes the settings that define that preset.

#### Exact First Code Cut

1. Add a read type such as `ViewGeometryDisplayEdgePresetRead = ViewGeometryDisplayEdgePreset | 'custom'`.
2. Add a `resolveViewGeometryDisplayEdgePresetRead(...)` helper in `src/shared/viewSettingsTypes.ts`.
3. Keep `ViewGeometryDisplayEdgePreset` persistence limited to the built-in preset values.
4. Add a `Custom` display option to Properties `Edge Preset` without allowing it to be selected as a recipe write.
5. Make Properties compute the selector value from `resolveViewGeometryDisplayEdgePresetRead(geometryDisplay.edges)`.
6. When the selector changes to a built-in preset, apply that preset recipe exactly as Phase 5.4 does now.
7. If the selector receives `custom`, do nothing; `Custom` is readback-only.
8. When the user changes `Edge Depth`, `Hidden Edges`, or `Line Style`, let the computed readback become `Custom` when no built-in recipe matches.
9. Keep color, opacity, hidden-line style, hover, and selected edits from changing the preset readback in Phase 5.5.
10. Preserve the legacy `edgeDisplayMode` bridge.
11. Add focused store/shared proof for:
   - each built-in recipe resolves to its preset
   - structural drift resolves to `custom`
   - color/opacity/dash/gap edits do not force `custom`
   - selecting `custom` is not accepted as a saved `preset`
12. Add focused Properties proof for:
   - selecting a built-in preset applies its recipe
   - editing a recipe-owned field changes readback to `Custom`
   - selecting a built-in preset again exits `Custom`
   - editing edge color/opacity or hidden-line color/dash tuning does not force `Custom`
13. Add focused viewer proof only if implementation changes viewer-facing mode/depth or hidden-edge visibility behavior.
14. Run focused proof plus production build.

#### Done Shape

Phase 5.5 is done when edge presets behave like editable recipes: built-ins apply known looks, user edits read back as `Custom`, and later Wireframe/Clay Studio recipe work has a clean preset-read model.

#### Shipped Result

- Added `ViewGeometryDisplayEdgePresetRead` so `Custom` can exist as a selector readback without becoming a saved `ViewGeometryDisplayEdgePreset`.
- Added `resolveViewGeometryDisplayEdgePresetRead(...)` to match edge recipes from `mode`, `depthMode`, `hiddenEdges`, and `lineStyle`.
- Kept `lineStyle` ignored for preset matching while hidden edges are off, so a saved dashed hidden-line value does not force `Custom` when hidden edges are disabled.
- Added a `Custom` option to Properties `Edge Preset` and made the selector read from the resolver.
- Kept selecting `Custom` as a no-op, while selecting any built-in preset reapplies that preset's full recipe.
- Follow-up note: after user review, this first `Custom` option model is too literal. `Custom` should not stay in the selectable/cyclable list all the time; Phase 5.6 owns the reusable select/readback fix.
- Preserved built-in-only persistence for `geometryDisplay.edges.preset`.
- Added focused shared/store proof for built-in recipe matching, structural drift, style-only edits, and built-in persistence.
- Added focused Properties proof for recipe drift reading as `Custom`, built-in re-application exiting `Custom`, and style tuning staying on the current built-in readback.
- Did not change viewer runtime behavior because Phase 5.4 already moved hidden-edge rendering onto the editable recipe settings.

#### Verification

- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts -t "geometry display|edge display mode|wireframe|edited edge preset"`
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx -t "geometry display|edge display styles|hidden-line edge styles|edited edge preset recipes"`
- `npm.cmd run build`

## [x] `Properties-6 / Phase 5.6` - `Recipe Select Readback Option Model`

### Phase 5.6 Summary

#### Purpose

Fix the edge preset selector so readback-only recipe states such as `Custom` display when they are true, but do not become permanent selectable recipes.

This phase exists because the Phase 5.5 implementation made `Custom` a normal option in the `Edge Preset` list. That proved the recipe-readback model but created bad interaction behavior: the user can see `Visible Only`, but cannot reliably click the left cap or use the menu to choose `Off` from Properties.

#### Owns

- reusable `ParaSelect` support for a displayed/readback value that is not part of the selectable option list
- `Edge Preset` option cleanup so only real recipes are selectable
- `Off` interaction proof from normal and custom readback states

#### Does Not Own

- new edge recipes
- saved custom render presets
- broader render-preset custom readback
- point styling
- viewer runtime changes, unless a regression proves the wrong setting is being written

### Phase 5.6 Implementation Spec

#### Prep Read

- `ParaSelect` currently uses one `options` array for all behavior:
  - displayed label lookup
  - left/right cap cycling
  - drag handle index mapping
  - native select options
  - custom menu options
- Phase 5.5 added `custom` into `geometryDisplayEdgePresetOptions` so the selector can display `Custom`.
- `updateEdgePreset('custom')` is intentionally a no-op because `Custom` is not a saved recipe.
- The screenshot/user report shows `Edge Preset: Visible Only` cannot be moved to `Off` from Properties by the left cap or dropdown/menu.
- Shift+D can still turn edges off because it bypasses the Properties `ParaSelect` and calls the edge display mode path directly.
- The disappearing edge setting rows should not block the write; `Off` should write first and then the rows can unmount.

#### Prep Decision

Treat `Custom` as a readback display value, not as an option.

For edge presets, the selectable recipe list is exactly:

- `Off`
- `Visible Only`
- `Xray`
- `Hidden Line`

`Custom` should appear only when the computed readback is `custom`. It should not appear as a normal menu item, cap target, drag target, or saved value.

The reusable `ParaSelect` direction should be one of these shapes:

```tsx
<ParaSelect
  value={recipeValue}
  displayedValue={readbackValue}
  displayedLabel="Custom"
  options={recipeOptions}
/>
```

or a similar prop that lets the component render a label for a value that is not in `options`.

The important component rule:

- `options` are selectable choices.
- `displayedValue` / display override is current-state readback.
- Caps, drag, native select, and menu choose from `options` only.
- A displayed readback value outside `options` must not prevent choosing any real option.

#### Implementation Direction

Prefer a reusable `ParaSelect` change over an edge-only workaround. Future recipe/preset controls will need the same split between "current settings read as custom" and "these are the recipes the user can choose."

For Phase 5.6, keep the UI simple:

- Do not show `Custom` in the open option list unless the component already supports clearly disabled/status rows.
- Do show `Custom` in the closed select value area when the readback is custom.
- If the user is on `Custom` and clicks the left or right cap, move to a real adjacent recipe in a predictable way.
- If the user is on `Custom` and opens the menu, show only the real recipes and allow `Off`.

#### Exact First Code Cut

1. Update `ParaSelect` props so a caller can provide a display label/value that does not need to exist in `options`.
2. Keep `selectedOption` for write/cycle behavior based on `options`.
3. Add a separate displayed option/label resolution for the visible label and fill/readback.
4. Make left/right caps skip any display-only/readback value and cycle only through selectable `options`.
5. Make drag and native select choose only selectable `options`.
6. Remove `custom` from `geometryDisplayEdgePresetOptions`.
7. Pass the computed edge preset readback as the display override.
8. Keep `updateEdgePreset` accepting only built-in `ViewGeometryDisplayEdgePreset` values.
9. Add focused `ParaSelect` proof if there is an existing component test seam, or focused Properties proof if not.
10. Add focused Properties proof for:
    - `Visible Only` left cap writes `Off`
    - dropdown/menu can choose `Off`
    - `Hidden Line` can choose `Off`
    - a `Custom` readback can choose `Off`
    - `Custom` is not listed as a normal recipe option
11. Run focused Properties proof plus build.

#### Done Shape

Phase 5.6 is done when `Edge Preset` can show `Custom` only as a current readback state, while the user can always choose a real built-in recipe such as `Off` from Properties. The reusable select behavior should be ready for later render-preset, AO-preset, material-recipe, and other custom-readback controls.

#### Shipped Result

- Added `displayedLabel` support to `ParaSelect` so a control can display a readback label even when the readback value is not in the selectable option list.
- Kept cap cycling, drag behavior, native select values, and custom menu options based on real selectable `options`.
- Removed `custom` from the normal `Edge Preset` options.
- Kept `Custom` visible in the closed Edge Preset value when the computed recipe readback is custom.
- Fixed the Properties edge write path so edge recipe edits also provide the matching legacy `edgeDisplayMode`, preventing normalizer compatibility logic from restoring the old edge mode over a new `Off` recipe.
- Added focused Properties proof that `Visible Only -> Off`, `Hidden Line -> Off`, and `Custom -> Off` work, and that `Custom` is not listed as a normal recipe option.

#### Verification

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx -t "geometry display|edge display styles|hidden-line edge styles|edited edge preset recipes|keeps Custom out"`
- `npm.cmd run build`

## [ ] `Properties-6 / Phase 6` - `Point Visibility And Default Style`

### Phase 6 Summary

#### Purpose

Make point visibility and default point look explicit without confusing topology points, sketch points, control points, and transform handles.

#### Owns

- first user-facing `Points` visibility control
- default point color, opacity, and size if one honest runtime owner exists
- clear separation from non-geometry gizmo/handle systems

#### Does Not Own

- point hover/selected styling
- unifying unrelated point-like helper systems if they need separate owners

### Phase 6 Implementation Spec

#### Exact First Code Cut

1. Audit the live point-like runtime systems.
2. Decide which point family `Properties-6` controls first.
3. Add default point style settings only for the chosen point family.
4. Add Properties controls and viewer proof.

#### Done Shape

Phase 6 is done when point visibility and default style have one honest owner, even if some helper/gizmo point-like visuals are explicitly left out.

## [ ] `Properties-6 / Phase 7` - `Point Hover And Highlight Styles`

### Phase 7 Summary

#### Purpose

Complete default/hover/selected point styling for the point family owned by Phase 6.

#### Owns

- point hover style
- point selected/highlight style
- legibility proof across surface and edge display combinations

#### Does Not Own

- transform gizmo handles
- sketch command handles unless Phase 6 explicitly selected them

### Phase 7 Implementation Spec

#### Exact First Code Cut

1. Add point hover and selected settings.
2. Bridge existing point highlight values if applicable.
3. Add Properties controls and viewer proof for hover/selected point presentation.

#### Done Shape

Phase 7 is done when the selected point family has default, hover, and selected controls in `Geometry Display`.

## [ ] `Properties-6 / Phase 8` - `Wireframe And Clay Studio Recipe Integration`

### Phase 8 Summary

#### Purpose

Make built-in display modes and render presets write or consume geometry-display settings instead of keeping every look in separate hard-coded branches.

#### Owns

- Standard recipe read
- Wireframe recipe read
- Clay Studio geometry-display recipe read
- preserving existing Shift+D and Properties preset behavior

#### Does Not Own

- saved custom presets
- broad render-preset custom readback
- path-traced Render Preview output parity

### Phase 8 Implementation Spec

#### Exact First Code Cut

1. Map current Standard, Wireframe, and Clay Studio visual intent to geometry-display settings.
2. Decide which settings are written by display-mode selection versus render-preset selection.
3. Make Clay Studio write custom surface material and muted edge settings as normal recipe values where possible.
4. Keep behavior-compatible fallbacks for any runtime branch not yet safely retired.
5. Add focused proof for Shift+D, Properties render preset, and direct display-mode changes.

#### Done Shape

Phase 8 is done when Wireframe and Clay Studio are visibly on the path toward editable geometry-display recipes.

## [ ] `Properties-6 / Phase 9` - `Custom Readback And Preset Handoff`

### Phase 9 Summary

#### Purpose

Make geometry-display edits understandable after users tweak a built-in look.

#### Owns

- custom readback for Standard/Wireframe/Clay Studio-like settings
- handoff into saved custom render presets when the preset lane is ready
- clear user-facing names for custom edited looks

#### Does Not Own

- saved custom preset implementation if `Properties-4` has not landed the base preset machinery yet

### Phase 9 Implementation Spec

#### Exact First Code Cut

1. Compare current geometry-display settings against built-in recipe values.
2. Add readback copy or helper state for diverged presets.
3. Record the saved-custom-preset handoff if the actual save/manage UI is still out of scope.

#### Done Shape

Phase 9 is done when the UI can honestly show that a user has edited the geometry-display look away from a built-in recipe.

## [ ] `Properties-6 / Phase 10` - `Presentation Branch Cleanup`

### Phase 10 Summary

#### Purpose

Retire old viewer-only branches only after the neutral geometry-display contract covers them.

#### Owns

- cleanup of replaced presentation branches
- compatibility seam retirement
- focused behavior-preservation proof

#### Does Not Own

- new features
- geometry changes
- material truth changes

### Phase 10 Implementation Spec

#### Exact First Code Cut

1. Inventory viewer presentation branches still bypassing geometry-display settings.
2. Delete branches whose retirement conditions are met.
3. Keep narrow compatibility bridges only where a live display mode still needs them.
4. Add focused regression proof around display modes, presets, overlays, selection, and render-preview separation.

#### Done Shape

Phase 10 is done when the geometry-display system is the normal owner for the behaviors it covers and stale branches are gone instead of quietly becoming permanent.
