# Settings 2 - Key Bindings And Mode Shortcut Reference

## Doc Header

### Doc History
25. 2026-05-12 20:42:10: Prepared `Settings-2 / Phase 10 - Custom Shortcut Runtime Application` for implementation against the shipped custom preset model, local Settings override UI, `resolveViewerCameraShortcutAction`, `routeKeyboardInput`, `useViewerCameraShortcuts`, the Viewer-local Zoom Object fallback, and the need for one shared custom-aware shortcut preference/read seam before edited keyboard camera shortcuts can affect runtime.
24. 2026-05-12 13:23:31: Implemented and closed `Settings-2 / Phase 9 - Normal CAD Camera Control Visibility` with a source-backed `Normal camera controls` shortcut group for read-only `Orbit`, `Pan`, and `Zoom` viewport gesture rows, preserving existing viewer pointer/camera behavior and focused source-map, read-model, and Settings proof.
23. 2026-05-12 12:46:27: Prepared `Settings-2 / Phase 9 - Normal CAD Camera Control Visibility` for implementation against the live `Viewer.ts` pointer gesture handlers, `CameraController.ts` temporary pan/orbit helpers, OrbitControls wheel zoom ownership, existing middle-button pan and Ctrl+middle-button orbit tests, and the read-only normal camera gesture boundary before runtime custom shortcut application.
22. 2026-05-12 12:36:21: Added a follow-up `Settings-2 / Phase 9 - Normal CAD Camera Control Visibility` before runtime shortcut application so the Key Bindings surface can catalog normal viewport camera controls such as orbit, pan, and zoom as read-only mouse/gesture rows before custom bindings are applied through live routing owners.
21. 2026-05-12 11:34:40: Implemented and closed `Settings-2 / Phase 8 - Editable Shortcut Rows And Custom Preset UI` with visible edit controls for supported shortcut rows, click-to-listen keyboard capture, in-memory custom preset labels for `Default (custom)` and `Blender (working custom)`, reset-to-base behavior, inline overlap messages anchored beside both conflicting shortcut values, focused Settings tests, and no runtime shortcut-routing application.
20. 2026-05-12 11:07:11: Revised `Settings-2 / Phase 8 - Editable Shortcut Rows And Custom Preset UI` so overlapping shortcuts do not use a blocking confirmation popup; overlap is allowed inline and communicated through anchored row messages beside each affected shortcut value.
19. 2026-05-12 11:06:20: Clarified `Settings-2 / Phase 8 - Editable Shortcut Rows And Custom Preset UI` interaction rules so editable shortcut values enter a listening state when clicked, capture the next supported keyboard shortcut, show an overlap confirmation dialog with `Cancel` and `Allow overlap`, and render anchored conflict messages beside both overlapping rows before runtime shortcut application begins.
18. 2026-05-12 10:22:49: Implemented and closed `Settings-2 / Phase 7 - Editable Shortcut Contract And Custom Preset Model` with a shortcut custom-preset model helper, custom preset ids and labels for `Default (custom)` plus `Blender (working custom)`, immutable base-preset reads, reset-to-base override filtering, editable versus read-only row state, binding override formatting, conflict reads for editable shortcut rows, focused tests, and no visible edit controls or runtime input-routing changes.
17. 2026-05-12 10:15:03: Prepared `Settings-2 / Phase 7 - Editable Shortcut Contract And Custom Preset Model` for implementation against the shipped read-only shortcut inventory, `shortcutPresetReads`, current `ShortcutPresetId` base-preset union, Settings-local preset selection, Fly Mode display-binding rows, and the need for a non-UI custom preset contract that can represent `Default (custom)`, `Blender (working custom)`, reset-to-base, editable versus read-only row state, and conflict reads before runtime routing or visible edit controls are introduced.
16. 2026-05-12 10:07:54: Implemented and closed `Settings-2 / Phase 6 - Fly Mode Control Subsection` by extending the source-backed Fly Mode shortcut group with read-only `Entry` and `While flying` sections, adding pointer-look and movement rows for `Mouse move`, `W/A/S/D`, `Space`, `Control`, `Shift`, and Drone-only `Q/E`, preserving runtime Fly Mode behavior, and adding focused source-map, read-model, and Settings proof.
15. 2026-05-12 09:58:05: Prepared `Settings-2 / Phase 6 - Fly Mode Control Subsection` for implementation against the live `Viewer.ts` fly movement resolver, `inputRouting.ts` `viewer-fly` ownership, pointer-look handling, and existing Viewer tests for `W/A/S/D`, `Space`, `Control`, `Shift`, and `Q/E` while keeping runtime behavior and editable bindings deferred.
14. 2026-05-12 09:46:47: Implemented `Settings-2 / Phase 5 - Fly Mode Entry Binding Visibility` with a source-backed Fly Mode gesture binding, `Right click hold` grouped under Viewport in Key Bindings, generic display-binding support for non-keyboard shortcuts, focused source-map/read-model/Settings tests, and no pointer-behavior or Fly Mode movement-control changes.
13. 2026-05-12 09:42:05: Prepared `Settings-2 / Phase 5 - Fly Mode Entry Binding Visibility` for implementation against the live `Viewer.ts` fly-activation owner, `viewerBridge` fly activation type, `ViewToolbar` right-click option read, and `inputRouting` `viewer-fly` owner while keeping movement controls, pointer behavior, and editable bindings deferred.
12. 2026-05-12 09:32:19: Expanded the `Settings-2` ladder with follow-on phases for showing the right-click-hold fly-mode entry binding, rendering a Fly Mode subsection for movement/look controls, introducing editable key-binding ownership, marking changed presets as custom variants such as `Default (custom)`, and applying custom bindings without hiding conflict and reset work.
11. 2026-05-12 09:21:58: Implemented `Settings-2 / Phase 4 - Grouped Shortcut Pane Rendering` with the visible read-only shortcut preset selector, grouped cataloged shortcut rows, distinct deferred shortcut groups, preserved Console input-priority control behavior, focused Settings tests, and no persisted preset or keyboard-routing changes.
10. 2026-05-12 09:13:25: Prepared `Settings-2 / Phase 4 - Grouped Shortcut Pane Rendering` for implementation against the shipped `shortcutInventoryReadModel`, live `Key Bindings` Settings pane, existing `ParaSelect` control path, and focused Settings tests while keeping Blender shortcut differences, custom rebinding, keyboard-routing changes, and deep-link hardening deferred.
9. 2026-05-12 09:05:46: Implemented `Settings-2 / Phase 3 - Key Bindings Section Entry And Routing` by adding the live `Key Bindings` Settings section route, moving `Console first input priority` out of `General`, preserving the existing owner-backed history write, and keeping grouped shortcut rows plus preset rendering deferred to Phase 4.
8. 2026-05-12 08:58:03: Prepared `Settings-2 / Phase 3 - Key Bindings Section Entry And Routing` for implementation against the live `SettingsSurface` section id, section list, row projection, General control branch, initial-section routing, and Settings tests while preserving the no-grouped-rendering and no-preset-selector boundary.
7. 2026-05-12 08:52:15: Implemented `Settings-2 / Phase 2 - Shared Shortcut Read Model And Mode Normalization` with a read-only shortcut inventory read model, normalized row and group contracts, copied `Default` / `Blender (working)` preset reads, and focused tests for cataloged rows, deferred groups, ordering, and preset parity.
6. 2026-05-12 08:46:25: Prepared `Settings-2 / Phase 2 - Shared Shortcut Read Model And Mode Normalization` for implementation against the shipped Phase 1 source map, naming the shared shortcut row/group contract, default and copied `Blender (working)` preset reads, deferred group handling, likely helper/test files, and the no-Settings-UI boundary.
5. 2026-05-12 08:41:59: Implemented `Settings-2 / Phase 1 - Shortcut Inventory Source Map` with a read-only shortcut inventory source-map helper and focused tests for cataloged viewer camera bindings, routing-owner-only seams, Console input-priority behavior ownership, and fragmented inline shortcut areas.
4. 2026-05-12 08:13:26: Prepared `Settings-2 / Phase 1 - Shortcut Inventory Source Map` for implementation by grounding the source-map pass in the live `cameraShortcuts`, `inputRouting`, viewer display-mode, Console input-priority, and fragmented inline shortcut seams while preserving the no-read-model and no-UI boundary.
3. 2026-05-12 08:07:06: Added the shortcut preset selector direction to the Settings 2 high-level goals with `Default` and copied `Blender (working)` presets, and moved the planned Console input-priority control ownership from `General` into the `Key Bindings` shortcut settings lane.
2. 2026-05-07 15:42:03: Re-audited this family phase doc for Codex-sized execution and split the broader shortcut-reference ladder into five smaller phases for source mapping, read-model normalization, section-entry routing, grouped pane rendering, and final deep-link or drift-hardening follow-through.
1. 2026-05-07 15:06:41: Created this `Settings-2` family phase doc so the Settings workspace can gain a dedicated `Key Bindings` section that lists shortcuts by mode and surface context without inventing a second shortcut owner.

### Purpose

This doc owns the dedicated `Key Bindings` family phase for the `Settings` workspace.

Use it to answer:
- how the `Key Bindings` section should appear inside the existing Settings shell
- how shortcuts should be grouped by mode or surface context
- how the right pane should read when one mode has many bindings and another has only a few
- how Settings should stay downstream from the systems that already define shortcut behavior

Do not use it for:
- changing shortcut semantics just to make the list cleaner
- full rebinding, shortcut conflict resolution, or profile management unless a later phase explicitly owns that widening
- a separate shortcut browser outside the Settings workspace
- unrelated owner-backed settings sections that still belong in `Settings-1`

## Doc Body

### Short Version

`Settings-2` should add a dedicated `Key Bindings` section to the Settings workspace.

That section should:
- list shortcuts clearly
- group them by mode or surface context
- expose a shortcut preset selector with `Default` and `Blender (working)` presets
- own the Console input-priority control that currently reads as `Console first input priority`
- show the key or gesture for entering Fly Mode, including the current right-click-hold behavior
- show a Fly Mode subsection for the controls used while flying
- show normal viewport camera controls such as orbit, pan, and zoom before runtime rebinding is widened
- eventually let users change shortcut bindings and mark the active preset as a custom variant when they do
- explain where each shortcut applies
- stay readable when some modes are dense and others are sparse
- reuse the real shortcut owners instead of inventing a second shortcut source of truth

The first pass should be read-first.

It should prove:
- the Settings section exists
- the right pane can group shortcuts by mode
- each shortcut row can explain the command plus the active keys
- the section stays downstream from the real shortcut owners

Important planning rule:
- keep each implementation phase small enough that Codex can execute it in one pass
- split source mapping, data normalization, routing, rendering, and hardening into separate phases instead of bundling them together

### Scope

This phase owns:
- the dedicated `Key Bindings` settings section
- the shortcut preset selector for `Default` and `Blender (working)`
- the Settings relocation of `Console first input priority` from `General` into the shortcut/key-bindings surface
- the first shortcut inventory read in the Settings right pane
- the Fly Mode entry binding and in-mode control readout
- normal viewport camera control visibility for orbit, pan, and zoom gestures
- later editable shortcut bindings and preset custom-state behavior
- the grouping model for shortcuts by mode or surface context
- mode labels, section headings, and empty-state language for shortcut visibility
- the first context-launch rules if another surface should deep-link into `Key Bindings`

This phase does not own:
- a full shortcut rebinding system
- per-mode shortcut persistence changes that are not already owned elsewhere
- hidden local copies of shortcut registries
- unrelated Settings sections such as `General`, `Workspace`, or `Viewport`
- broad input-device configuration beyond what is needed to explain shortcuts honestly

### Current Planning Read

The Settings shell already exists and can route to dedicated sections.

What is still missing is one honest place where the user can answer:
- what shortcuts exist
- which mode they belong to
- whether the same key means different things in different contexts

The healthy first read is:
- `Key Bindings` becomes one explicit row in the Settings section rail
- the section exposes a preset control for `Default` and `Blender (working)`, with `Blender (working)` initially copied from `Default` until the real shortcut differences are supplied
- `Console first input priority` moves out of `General` and into the shortcut settings surface so keyboard behavior controls live beside shortcut reference
- the right pane groups shortcuts by mode or surface context
- Fly Mode becomes a first-class shortcut group with `Right click hold` as the current entry behavior
- Fly Mode also gets a nested control read for the movement and look controls active while flying
- normal CAD camera controls such as orbit, pan, and zoom should be cataloged as viewport gesture rows before custom shortcut routing is applied
- editable shortcut rows arrive only after the read model can represent binding ownership, conflicts, reset behavior, and custom preset state honestly
- each group uses stable labels such as `Browser`, `Spaghetti Editor`, `Viewport`, or later equivalent live mode names
- sparse groups stay visible instead of being hidden just because they have fewer shortcuts
- missing or not-yet-cataloged shortcut areas are shown honestly as deferred rather than guessed

### Ownership Boundary

The Settings workspace should read shortcut truth from the real owners.

That means:
- if a mode already has a shortcut registry or canonical definition, project it
- if shortcut text is currently scattered, this phase should define the first honest read contract without pretending the duplication is solved
- Settings may organize and label the read
- Settings should not become a hidden new shortcut owner

Important rule:
- visibility first
- ownership drift never

## Vision

`Settings-2` belongs to `Settings` Generation 1.

This family phase exists so the Settings workspace can become a clearer navigation surface for command discoverability, not just value editing.

The intended user-facing promise is:
- open `Settings`
- click `Key Bindings`
- choose a shortcut preset such as `Default` or `Blender (working)`
- adjust shortcut-input behavior such as `Console first input priority`
- scan shortcuts by mode
- see that Fly Mode starts from right-click hold
- see the controls used while in Fly Mode
- see normal CAD camera controls for orbit, pan, and zoom
- change a shortcut and have the selected preset become a custom variant instead of silently rewriting the base preset
- immediately tell where a shortcut applies

What must stay true:
- the section should feel like part of the same Unreal-style Settings surface
- the grouping should be mode-aware instead of one flat unsorted command wall
- shortcut presets should be exposed as a Settings control without becoming a full rebinding system
- `Console first input priority` should live with shortcut behavior instead of staying in `General`
- Fly Mode should be visible as both an entry gesture and an in-mode control set
- normal viewport camera controls should be visible before runtime shortcut application is trusted
- user-edited shortcuts should create custom preset state instead of mutating the named base preset invisibly
- the right pane should stay readable before any later rebinding work exists
- the systems that actually define the shortcut behavior should keep owning that behavior

## Wishlist Organization

### High Level Goals

- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [ ] `Settings-Gen1-HLG-7. Settings should include a Key Bindings section that lists shortcuts clearly by mode and surface context.`
- [ ] `Settings-Gen1-HLG-8. Key Bindings should expose shortcut presets as a ParaSelect-style Settings control with Default and Blender (working), where Blender (working) initially copies Default until real Blender shortcut differences are supplied.`
- [ ] `Settings-Gen1-HLG-9. Key Bindings should own the Console first input priority control instead of leaving that shortcut behavior toggle in General.`
- [ ] `Settings-Gen1-HLG-10. Key Bindings should show the Fly Mode entry binding, including the current right-click-hold behavior.`
- [ ] `Settings-Gen1-HLG-11. Key Bindings should show a Fly Mode subsection for the controls used while flying.`
- [ ] `Settings-Gen1-HLG-12. Key Bindings should let users change shortcut bindings while preserving named presets by switching edited presets into custom variants.`
- [ ] `Settings-Gen1-HLG-13. Key Bindings should show normal CAD viewport camera controls such as orbit, pan, and zoom before runtime shortcut application is widened.`

### Codex Level Goals

- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-6. Add a dedicated `Key Bindings` settings section that groups shortcuts by mode or surface context without inventing a new shortcut owner.
- [ ] Settings-Gen1-CLG-7. Add a shortcut preset selector for `Default` and `Blender (working)` while keeping `Blender (working)` copied from `Default` until the real differences are supplied.
- [ ] Settings-Gen1-CLG-8. Move `Console first input priority` from `General` into the `Key Bindings` shortcut settings surface.
- [ ] Settings-Gen1-CLG-9. Add Fly Mode entry and in-mode controls to the shortcut inventory and grouped Key Bindings read.
- [ ] Settings-Gen1-CLG-10. Add editable shortcut binding ownership with custom preset naming such as `Default (custom)` after user changes.
- [ ] Settings-Gen1-CLG-11. Add normal CAD camera control visibility for orbit, pan, and zoom as viewport gesture rows before runtime shortcut application.

### `Settings-2 / Phase 1`

- [x] Identify the first live shortcut-owner seams for the modes or surfaces that already expose bindings.
- [x] Record which areas still have only inline or fragmented shortcut truth.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-7`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-6.

### `Settings-2 / Phase 2`

- [x] Define the shared shortcut read model for command label, key chord, and mode label.
- [x] Decide the first stable group labels, ordering rules, and deferred-state language for mode-aware reads.
- [x] Define the shortcut preset read shape for `Default` and `Blender (working)`, with `Blender (working)` initially copied from `Default`.
- [x] Keep the first pass read-only unless a binding is already owner-editable elsewhere.
- [x] Show deferred or uncataloged shortcut areas honestly instead of guessing.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-7`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-6.
- [x] Settings-Gen1-CLG-7.

### `Settings-2 / Phase 3`

- [x] Add the `Key Bindings` entry to the Settings section rail.
- [x] Route the existing Settings shell cleanly into the dedicated `Key Bindings` section.
- [x] Move the existing `Console first input priority` control out of `General` and into the `Key Bindings` section.
- [x] Keep this slice focused on entry and routing, not full grouped content rendering.
- [x] `Settings-Gen1-HLG-2`
- [x] `Settings-Gen1-HLG-3`
- [x] `Settings-Gen1-HLG-7`
- [x] `Settings-Gen1-HLG-9`
- [x] Settings-Gen1-CLG-2.
- [x] Settings-Gen1-CLG-6.
- [x] Settings-Gen1-CLG-8.

### `Settings-2 / Phase 4`

- [x] Render the right-pane shortcut read with clear mode or surface grouping.
- [x] Render the shortcut preset control with `Default` and `Blender (working)` above the grouped shortcut read.
- [x] Keep the section readable when the number of shortcuts varies heavily across modes.
- [x] Use stable row language for command name, key chord, and mode label.
- [x] Preserve honest empty and deferred states in the visible pane.
- [x] `Settings-Gen1-HLG-3`
- [x] `Settings-Gen1-HLG-5`
- [x] `Settings-Gen1-HLG-7`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-5.
- [x] Settings-Gen1-CLG-6.
- [x] Settings-Gen1-CLG-7.

### `Settings-2 / Phase 5`

- [x] Map and render the Fly Mode entry binding, including `Right click hold`.
- [x] Keep Fly Mode entry visible as a cataloged shortcut or honest deferred source, depending on the live owner seam.
- [x] `Settings-Gen1-HLG-7`
- [x] `Settings-Gen1-HLG-10`
- [x] Settings-Gen1-CLG-6.
- [x] Settings-Gen1-CLG-9.

### `Settings-2 / Phase 6`

- [ ] Add a Fly Mode subsection for in-mode movement and look controls.
- [ ] Keep Fly Mode controls grouped under Fly Mode instead of flattening them into generic Viewport shortcuts.
- [ ] `Settings-Gen1-HLG-7`
- [ ] `Settings-Gen1-HLG-10`
- [ ] `Settings-Gen1-HLG-11`
- [ ] Settings-Gen1-CLG-6.
- [ ] Settings-Gen1-CLG-9.

### `Settings-2 / Phase 7`

- [ ] Define editable shortcut binding ownership, persistence, reset, and conflict-read contracts.
- [ ] Define custom preset naming for changed base presets such as `Default (custom)` and `Blender (working custom)`.
- [ ] Keep this phase contract-first before visible edit controls.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] `Settings-Gen1-HLG-12`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-7.
- [ ] Settings-Gen1-CLG-10.

### `Settings-2 / Phase 8`

- [ ] Render editable shortcut rows in Key Bindings for bindings that have the new editable owner contract.
- [ ] When the user changes a shortcut while on a named preset, update the visible preset to that preset's custom variant.
- [ ] Preserve reset behavior back to the named preset.
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-8`
- [ ] `Settings-Gen1-HLG-12`
- [ ] Settings-Gen1-CLG-7.
- [ ] Settings-Gen1-CLG-10.

### `Settings-2 / Phase 9`

- [x] Add normal CAD viewport camera controls for orbit, pan, and zoom to the Key Bindings read.
- [x] Keep normal camera controls grouped under Viewport instead of mixing them into Fly Mode.
- [x] Keep normal camera controls read-only until a real editable mouse/gesture owner contract exists.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-7`
- [x] `Settings-Gen1-HLG-13`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-6.
- [x] Settings-Gen1-CLG-11.

### `Settings-2 / Phase 10`

- [ ] Apply custom shortcut bindings through the real routing owners.
- [ ] Add conflict prevention or conflict warning behavior before custom bindings become active.
- [ ] Prove runtime shortcut behavior follows the custom preset without mutating the named base preset.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] `Settings-Gen1-HLG-12`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-7.
- [ ] Settings-Gen1-CLG-10.

### `Settings-2 / Phase 11`

- [ ] Tighten any deep-link or context-launch behavior into the `Key Bindings` section.
- [ ] Add drift-hardening checks so Settings does not silently diverge from the real shortcut owners.
- [ ] Record the follow-on boundary for advanced shortcut work such as import/export profiles.
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] `Settings-Gen1-HLG-12`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.
- [ ] Settings-Gen1-CLG-10.

## [x] `Settings-2 / Phase 1` - `Shortcut Inventory Source Map`

### Phase 1 Summary

Map the first honest source of shortcut truth for visible modes and surfaces.

This phase should identify where the current shortcut truth lives before any shared read model or UI rendering starts.

The implementation prep target is one narrow source-map helper or contract that names current shortcut owner areas and explicitly marks fragmented areas for later normalization.

### Phase 1 Implementation Spec

#### Purpose

Establish one clear source map for shortcut inventory before the Settings UI starts normalizing or rendering a mode-grouped shortcut surface.

This phase should make the live shortcut landscape inspectable by code, without deciding final row labels, preset behavior, grouping order, or Settings presentation.

#### Owns

- the first shortcut inventory source map
- the first honest owner-area list for shortcut truth
- the first explicit note about fragmented or inline-only shortcut areas
- a read-only contract that later phases can use to decide which shortcut areas are cataloged versus deferred

#### Does Not Own

- the shared shortcut read model itself
- shortcut preset selection or `Default` / `Blender (working)` behavior
- moving `Console first input priority` out of `General`
- the visible Settings `Key Bindings` pane
- full rebinding semantics

#### Current Live Read

The Settings shell exists, but shortcut discoverability is still likely fragmented across the app's mode-specific surfaces.

This phase should ground the future ladder against the live shortcut owners before any shared grouping rules become sticky.

Initial live seams to map:
- `src/app/cameraShortcuts.ts` already exposes `viewerCameraShortcutBindings` for viewer camera preset and Zoom Object shortcuts.
- `src/app/inputRouting.ts` owns shared keyboard-routing decisions and routing owner names such as `viewer-camera-shortcuts`, `viewer-display-mode`, `console-entry`, `sketch-plane`, `sketch-draw`, `reference-selection`, `reference-transform`, `staged-console`, and `flat-console`.
- `src/app/useViewerDisplayModeMenu.ts` wires the active-viewer `Shift+D` display-mode shortcut through the shared routing seam, but the key itself currently lives as routing logic rather than a reusable binding registry.
- `src/app/workspace/SettingsSurface.tsx` currently renders `Console first input priority` in `General`; Phase 1 should name that as an owner-backed shortcut-behavior setting to relocate later, not move it yet.
- Some shortcut behavior still appears as inline key handling in surface controllers or mode hooks and should be marked fragmented/deferred instead of guessed into a clean registry.

#### First Pass Decisions

1. Prefer one explicit owner map over ad hoc inline shortcut strings.
2. Record fragmentation honestly before trying to normalize it away.
3. Keep this slice read-only and discovery-focused.
4. Stop before defining the final Settings read shape.
5. Treat routing owners and binding registries as different kinds of shortcut truth, and label them separately.
6. Mark `Console first input priority` as a shortcut-behavior setting owner, not a shortcut binding.

#### Exact First Code Cut

The first implementation pass should:
- add one source-map helper or registry adapter that identifies the first shortcut owner seams
- include cataloged entries for the current viewer camera shortcut binding seam and shared input-routing owner seam
- record which surfaces still lack one honest shortcut owner as explicit deferred/fragmented areas
- expose enough structure for focused tests to assert owner ids, source files, and deferred status
- stop before defining the shared read model or rendering the Settings section UI

#### Likely Files

- `src/app/shortcutInventorySourceMap.ts` or a similarly narrow source-map helper
- `src/app/shortcutInventorySourceMap.test.ts`
- `src/app/cameraShortcuts.ts` only if the implementation needs to re-export or lightly annotate the existing viewer camera binding seam
- `src/app/inputRouting.ts` only if the implementation needs exported routing-owner metadata; avoid changing routing behavior
- no `SettingsSurface.tsx` changes unless a tiny import-free type reference is truly needed

#### No-Widening Rule

- do not introduce a second shortcut registry
- do not define the final visible group layout yet
- do not add the `Key Bindings` section entry yet
- do not add the shortcut preset selector yet
- do not move `Console first input priority` yet
- do not add rebinding UI
- do not change any keyboard-routing behavior
- do not widen into unrelated input-device configuration

#### Implementation Risks

- some shortcut truth may still live as inline definitions instead of one central read
- some modes may expose actions but not one explicit registry surface
- this read can tempt premature normalization before the owner map is honest
- treating `inputRouting.ts` as a binding registry would blur routing ownership with displayable shortcut inventory
- over-cataloging inline handlers can create fake certainty before the real owner seams are known

#### Checklist

- [x] add the first shortcut inventory source-map helper
- [x] identify the live viewer camera shortcut binding seam
- [x] identify the shared input-routing owner seam
- [x] mark display-mode `Shift+D` as catalogable but currently routed through input-routing logic
- [x] mark `Console first input priority` as an owner-backed shortcut-behavior setting for later relocation
- [x] record fragmented or inline-only shortcut areas as deferred
- [x] keep the helper read-only and free of Settings UI dependencies

#### Verification Shape

- focused tests for the source map or owner-read helper
- a proof that the viewer camera shortcut seam is cataloged from the existing binding owner instead of duplicated manually
- a proof that routing-owner-only areas are identified without pretending they are full shortcut binding registries
- a check that fragmented or inline-only areas remain explicit instead of being silently skipped
- a check that no Settings UI route, preset selector, or Console input-priority relocation is introduced in Phase 1

#### Done Shape

- the shortcut inventory source map is explicit
- the live owner/deferred distinction is visible in code and tests
- the next phase can normalize one shared read model without guessing the owners
- the visible Settings section can be built later without inventing shortcut ownership

## [x] `Settings-2 / Phase 2` - `Shared Shortcut Read Model And Mode Normalization`

### Phase 2 Summary

Define the shared read model that later UI phases will consume.

This phase should turn the Phase 1 owner map into one stable contract for command label, key chord, mode label, ordering, and deferred-state behavior.

It should also define the first preset read shape so the later visible selector can show `Default` and `Blender (working)` without implying a full rebinding editor exists.

The implementation target is a read-model helper over `shortcutInventorySourceMap.ts`, not a Settings component.

### Phase 2 Implementation Spec

#### Purpose

Create one shared shortcut read model before the Settings shell starts routing or rendering the `Key Bindings` pane.

This phase should convert the Phase 1 source-map entries into normalized groups that later UI can render directly:
- displayable shortcut rows where the source has honest binding data
- deferred groups where the source is routing-only, behavior-setting-only, or fragmented
- preset reads for `Default` and `Blender (working)` that currently resolve to the same groups

#### Owns

- the shared shortcut read model
- mode-label normalization
- group ordering rules
- shortcut preset read shape for `Default` and `Blender (working)`
- deferred-state and empty-state language for uncataloged areas
- the first normalized command/key row shape for cataloged bindings

#### Does Not Own

- the visible Settings section entry
- the visible preset selector
- grouped pane rendering
- moving `Console first input priority` from `General`
- changing shortcut semantics or adding new shortcut bindings
- full rebinding semantics

#### Current Live Read

Once the owner map exists, the next risk is drifting into UI work before the shape of the shortcut read is stable.

This phase should make the later routing and rendering work consume one clean contract.

Phase 1 now provides:
- `viewer-camera-shortcuts` as the first cataloged binding registry with `viewerCameraShortcutBindings`
- `shared-input-routing-owners` as routing-owner-only data, not displayable binding rows
- `viewer-display-mode-shortcut` as a routing-owner-only seam for `Shift+D`
- `console-input-priority` as a behavior-setting source that belongs near shortcuts later but is not a binding row
- `fragmented-inline-shortcuts` as deferred inline shortcut-like key handling

Phase 2 should normalize that into group data without reaching back into Settings UI or route handlers.

#### First Pass Decisions

1. Treat mode or surface context as the primary grouping axis.
2. Normalize labels only enough to support one stable read.
3. Keep the contract read-only unless a binding is already owner-editable elsewhere.
4. Preserve explicit deferred reads where shortcut coverage is incomplete.
5. Treat `Blender (working)` as a copied `Default` preset until the real Blender shortcut differences are supplied.
6. Use `sourceId` to preserve provenance from the Phase 1 source map on every group or row.
7. Normalize key chords from existing binding data instead of hard-coding a second shortcut list.
8. Keep behavior settings such as `Console first input priority` as deferred/context groups until Phase 3 relocates controls.

#### Exact First Code Cut

The first implementation pass should:
- add one shared read-model helper that consumes `getShortcutInventorySourceMap()`
- define one row contract for `id`, `commandLabel`, `keyChord`, `modeLabel`, `sourceId`, and optional `contextNote`
- define one group contract for `id`, `label`, `modeLabel`, `status`, `rows`, and optional `deferredReason`
- define one preset read contract for `Default` and copied `Blender (working)`
- normalize viewer camera bindings into displayable rows using the existing binding objects
- preserve routing-owner-only, behavior-setting, and fragmented entries as deferred groups with readable reasons
- define stable group ordering: cataloged viewport groups first, routing-owner-only groups next, behavior-setting groups next, fragmented groups last
- stop before adding the Settings section entry or grouped pane rendering

#### Likely Files

- `src/app/shortcutInventoryReadModel.ts`
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/shortcutInventorySourceMap.ts` only if a small exported type or source status helper is needed
- no `src/app/workspace/SettingsSurface.tsx` changes
- no `src/app/inputRouting.ts` behavior changes
- no `src/app/cameraShortcuts.ts` behavior changes

#### No-Widening Rule

- do not add the visible `Key Bindings` section yet
- do not render the preset selector yet
- do not add a full preset editor or per-command rebinding UI
- do not add rebinding UI
- do not force every mode to adopt one final schema beyond what the shared read needs
- do not move `Console first input priority` yet
- do not change `Default`, `Blender (working)`, or any runtime shortcut behavior
- do not widen into unrelated input-device configuration

#### Implementation Risks

- mode labels may differ across surfaces and need a first normalization pass
- the preset read can look like editable rebinding if the first contract is not clearly read-first
- shared ordering rules can hide real owner differences if they are too aggressive
- deferred-state language can become vague if it is not tied to the Phase 1 owner map
- converting routing-owner-only seams into rows too early would invent displayable shortcut truth
- copying `Default` into `Blender (working)` can drift later if the read model forks data instead of sharing the same resolved groups for now

#### Checklist

- [x] add the shared shortcut read-model helper
- [x] define the shortcut row and group contracts
- [x] normalize viewer camera bindings into displayable rows from the existing binding owner
- [x] define the first shortcut preset read shape for `Default` and copied `Blender (working)`
- [x] define stable mode labels and ordering rules
- [x] define deferred-state and empty-state language from Phase 1 source statuses
- [x] keep the contract read-only and free of Settings UI dependencies

#### Verification Shape

- focused tests for the shared read model
- a proof that `Blender (working)` currently resolves to the same shortcut set as `Default`
- a proof that cataloged viewer camera bindings become rows without duplicating the binding list
- a proof that routing-owner-only and fragmented entries become deferred groups instead of fake rows
- a proof that at least two source-map entries normalize into one contract
- a check that deferred groups remain explicit
- a check that Phase 2 adds no Settings section route, visible preset selector, Console input-priority relocation, or keyboard-routing change

#### Done Shape

- the shared shortcut read contract is explicit
- the `Default` and `Blender (working)` preset contract is explicit
- cataloged and deferred shortcut areas both normalize into one stable contract
- later routing and rendering phases can consume one stable model
- no visible Settings UI has widened ahead of the contract

## [x] `Settings-2 / Phase 3` - `Key Bindings Section Entry And Routing`

### Phase 3 Summary

Add the dedicated `Key Bindings` section entry to the Settings shell.

This phase should make the Settings shell route into `Key Bindings` cleanly, without yet bundling in the full grouped pane rendering work.

It should also move `Console first input priority` out of `General` so shortcut behavior controls land in the shortcut-owned section.

The implementation target is the existing `SettingsSurface` shell and tests. It should add a real section route with a narrow placeholder pane plus the relocated Console input-priority control, not the Phase 4 shortcut list.

### Phase 3 Implementation Spec

#### Purpose

Add the `Key Bindings` section to the Settings surface and route into its dedicated pane using the shared read contract from Phase 2.

This phase should make the section addressable through `initialSectionId="keyBindings"` and visible in the left rail, while keeping the right pane intentionally narrow until Phase 4 renders grouped rows.

#### Owns

- the `Key Bindings` row in the Settings section rail
- the Settings-shell routing into the `Key Bindings` pane
- relocation of the existing `Console first input priority` control from `General` into `Key Bindings`
- the first dedicated empty or placeholder pane state for the section entry
- tests proving the owner-backed Console input-priority write still uses the existing history path from its new section

#### Does Not Own

- grouped shortcut row rendering
- shortcut preset rendering
- changing or consuming the visible shortcut read model in Settings
- new shortcut semantics
- conflict-resolution UI

#### Current Live Read

Once the shared read contract exists, the next narrow slice is the Settings-shell entry and routing seam.

The section should feel native to the existing Settings shell:
- one section rail entry
- one dedicated route target
- one relocated Console input-priority control
- one stable handoff into the later grouped read surface

Current live seams:
- `src/app/workspace/SettingsSurface.tsx` owns the `SettingsSectionId` union and `settingsSections` rail descriptor list.
- `buildSettingsRows(...)` currently projects `console-input-priority` into the `general` section.
- The JSX branch for `section.id === 'general'` currently renders the `Console first input priority` switch above General rows.
- `initialSectionId` already routes Settings into specific sections such as `general`, `browser`, and `workspace`.
- `src/app/workspace/SettingsSurface.test.tsx` currently has a General-section proof for editing Console input priority; Phase 3 should move that proof to `keyBindings` and add a negative General proof.
- The Phase 2 `shortcutInventoryReadModel` exists for later handoff, but Phase 3 should not render its groups yet.

#### First Pass Decisions

1. Keep this slice focused on section entry and routing only.
2. Preserve the existing Settings shell layout.
3. Use a narrow placeholder or loading read if the grouped pane is not rendered yet.
4. Stop before full grouped-row presentation.
5. Remove the Console input-priority control from `General` when it lands in `Key Bindings`.
6. Let `All` include the Key Bindings summary/control row so the all-settings overview remains honest.
7. Use `keyBindings` as the section id to avoid punctuation-sensitive ids and keep TypeScript section routing simple.
8. Keep the section copy clear that full shortcut rows and preset selection arrive later.

#### Exact First Code Cut

The first implementation pass should:
- add `keyBindings` to `SettingsSectionId`
- add the `Key Bindings` settings section entry
- route the Settings shell into the dedicated `Key Bindings` pane
- move `Console first input priority` from `General` into the dedicated `Key Bindings` pane
- update the `console-input-priority` row projection from `general` to `keyBindings`
- add a narrow Key Bindings pane state that can host the relocated control plus deferred copy for grouped shortcuts
- preserve the existing shell layout and `All` behavior
- stop before rendering the full grouped shortcut rows

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- no `src/app/shortcutInventoryReadModel.ts` changes unless a type import is truly needed for placeholder copy
- no `src/app/inputRouting.ts` changes
- no `src/app/store/uiPrefsStore.ts` changes

#### No-Widening Rule

- do not add grouped row rendering yet
- do not render `shortcutInventoryReadModel` groups yet
- do not render the `Default` / `Blender (working)` preset selector yet
- do not duplicate the Console input-priority control in both `General` and `Key Bindings`
- do not add editing controls unless already supported by an owner seam
- do not change the `consoleInputPriorityMode` store contract or edit-history helper
- do not change keyboard routing behavior
- do not widen into search, favorites, or custom profiles in this routing cut

#### Implementation Risks

- the `All` view may need a deliberate decision about whether `Key Bindings` participates there immediately
- routing can accidentally couple too tightly to one temporary pane component
- placeholder states can become sticky if Phase 4 is not kept clearly separate
- moving the Console input-priority control can leave stale General-section copy or tests if the owner shift is incomplete
- forgetting to update `SettingsSectionId` will block contextual launch typing even if the rail renders
- leaving `console-input-priority` in General rows would make ownership look split even if the control moves
- adding Phase 4 grouped rows early would blur the routing slice and make test scope too large

#### Checklist

- [x] add `keyBindings` to the Settings section id/type list
- [x] add the `Key Bindings` section rail entry
- [x] route the Settings shell into the `Key Bindings` pane
- [x] move `Console first input priority` out of `General` and into `Key Bindings`
- [x] move the `console-input-priority` read row from `General` to `Key Bindings`
- [x] add a narrow deferred/placeholder handoff for later grouped shortcut rows
- [x] keep the shell layout unchanged
- [x] keep the pane handoff narrow enough for later grouped rendering

#### Verification Shape

- focused Settings tests for section routing into `Key Bindings`
- a rail-order proof that `All` remains first and `Key Bindings` appears as a normal Settings section
- a proof that `General` no longer renders the Console input-priority control
- a proof that `Key Bindings` renders and updates the existing Console input-priority owner
- a proof that `initialSectionId="keyBindings"` lands on the dedicated pane
- a proof that `All` still exposes the moved Console input-priority read without duplicating it in General
- a proof that the shell reaches the dedicated pane cleanly
- a check that the Settings shell layout remains unchanged

#### Done Shape

- `Key Bindings` exists as a real Settings section
- `Console first input priority` belongs to the shortcut section instead of `General`
- the existing Console input-priority history/store behavior still works from the new section
- the shell can route into a dedicated pane cleanly
- the next grouped-rendering phase has a narrow stable entry point

## [x] `Settings-2 / Phase 4` - `Grouped Shortcut Pane Rendering`

### Phase 4 Summary

Render the grouped shortcut read inside the dedicated `Key Bindings` pane.

This phase should make shortcut visibility real in the right pane, using the shared read contract and section routing prepared earlier.

It should render the first preset selector above the grouped shortcut read, with `Default` and `Blender (working)` available before real Blender differences are filled in.

### Phase 4 Implementation Spec

#### Purpose

Present the grouped shortcut read clearly once the Settings shell can already route into the `Key Bindings` pane.

This phase should replace the temporary Phase 3 handoff copy with the first visible shortcut reference surface. It should consume the Phase 2 read model directly, render the current preset choice, and show both displayable shortcut rows and honest deferred groups.

#### Owns

- the right-pane grouped shortcut surface
- the visible shortcut preset selector
- first-pass shortcut row presentation and grouping layout
- visible empty and deferred states
- local preset selection state for the read-only `Default` / `Blender (working)` view
- tests proving the visible rows come from the read model instead of a second hand-written shortcut list

#### Does Not Own

- new shortcut semantics
- conflict-resolution UI
- multi-profile keymap management
- custom preset editing
- supplying the real Blender shortcut differences
- changing the `Console first input priority` store or edit-history owner
- changing keyboard routing behavior
- deep-link or drift-hardening follow-through

#### Current Live Read

Once the section entry and routing are stable, the main remaining work is visible grouped rendering.

The section should feel native to the existing Settings shell:
- one section rail entry
- one preset selector for `Default` and `Blender (working)`
- one grouped right-pane read
- one clear command-plus-key presentation style

Current live seams:
- `src/app/shortcutInventoryReadModel.ts` exposes `shortcutPresetReads`, `getShortcutInventoryReadModel(presetId)`, displayable `groups`, `rows`, and deferred group reasons.
- `src/app/workspace/SettingsSurface.tsx` already has a dedicated `section.id === 'keyBindings'` branch with the relocated `Console first input priority` control.
- The Phase 3 Key Bindings branch currently shows placeholder copy that should be replaced by the preset selector plus grouped read.
- Existing Settings option controls already use `ParaSelect`; Phase 4 should reuse that path for the shortcut preset selector.
- `src/app/workspace/SettingsSurface.test.tsx` already proves Key Bindings routing and Console input-priority editing; Phase 4 should extend those tests around visible preset and grouped row output.
- The current read model only has a cataloged Viewport group from viewer camera shortcuts, while routing-owner-only, behavior-setting, and fragmented areas are deferred. The UI should show that honestly.

#### First Pass Decisions

1. Keep grouping visible and easy to scan.
2. Use mode labels as first-class headings.
3. Keep rows simple: command, keys, and optional context note.
4. Preserve honest empty and deferred states.
5. Keep `Blender (working)` visibly selectable but behaviorally copied from `Default` until its shortcut differences are supplied.
6. Keep preset selection local to the Settings pane because Phase 4 is a read selector, not a persisted shortcut profile.
7. Render displayable groups and deferred groups in the same section so the user can see both what is known and what is still not cataloged.
8. Keep the relocated Console input-priority control above or beside the shortcut read as an owner-backed shortcut behavior setting, not as a shortcut row.
9. Use the Phase 2 read-model labels and key chords as source truth instead of retyping shortcut labels in Settings.
10. Keep the `All` view honest by allowing the Key Bindings grouped surface to appear when `All` renders the Key Bindings group, but do not turn All into a separate shortcut browser.

#### Exact First Code Cut

The first implementation pass should:
- import and consume `shortcutPresetReads`, `getShortcutInventoryReadModel`, and the `ShortcutPresetId` type in `SettingsSurface.tsx`
- add local selected-preset state initialized to `default`
- render the shortcut preset selector above the grouped shortcut rows using `ParaSelect`
- keep `Blender (working)` selectable while the read model resolves it through copied Default data
- render grouped shortcut rows in the Key Bindings right pane
- render deferred groups with clear text from `deferredReason` instead of pretending those shortcuts are fully cataloged
- keep the existing `Console first input priority` control in the Key Bindings pane
- replace the Phase 3 placeholder copy with the real grouped-read surface
- preserve the existing shell layout and `All` behavior
- keep uncataloged shortcut areas visible as deferred reads

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/app/shortcutInventoryReadModel.ts` only if the UI needs a tiny display helper that clearly belongs with the read model
- no `src/app/shortcutInventorySourceMap.ts` changes unless a missing label blocks honest rendering
- no `src/app/inputRouting.ts` changes
- no `src/app/store/uiPrefsStore.ts` changes

#### No-Widening Rule

- do not add custom preset creation or per-command editing
- do not add editing controls unless already supported by an owner seam
- do not collapse mode groups into one long flat list
- do not persist selected shortcut preset yet
- do not invent Blender-specific shortcut differences before the user supplies them
- do not move, duplicate, or change the Console input-priority store owner
- do not add search, filtering, favorites, import/export, or conflict resolution
- do not change shortcut routing semantics
- do not widen into search, favorites, or custom profiles in this first surface cut

#### Implementation Risks

- the preset selector can imply Blender behavior is complete if `Blender (working)` is not labeled honestly
- long lists can become visually noisy if headings and row density are not disciplined
- some shortcuts may need contextual notes to avoid ambiguous command names
- empty and deferred states can look too similar if they are not separated intentionally
- rendering deferred groups too quietly would make missing shortcut coverage look complete
- rendering the Console input-priority setting as a shortcut row would blur behavior-setting ownership
- retyping shortcut labels in Settings would create the ownership drift this family is meant to avoid
- making preset selection persistent now would imply profile management before the model owns it

#### Checklist

- [x] render the shortcut preset selector with `Default` and `Blender (working)`
- [x] keep preset selection local and read-only
- [x] render grouped shortcut rows in the right pane
- [x] define stable row formatting for command, keys, and mode
- [x] keep empty and deferred states readable
- [x] show deferred groups distinctly from cataloged shortcut rows
- [x] keep the relocated Console input-priority control working in the same pane
- [x] avoid changing runtime shortcut behavior or shortcut persistence

#### Verification Shape

- a preset selector proof that `Default` and `Blender (working)` both render
- a proof that `Blender (working)` still reads the copied default bindings until real differences are supplied
- a grouped rendering proof for the cataloged Viewport viewer-camera shortcuts
- a deferred-group proof for routing-owner-only or fragmented shortcut areas
- a proof that the visible shortcut rows include command label and key chord text from the read model
- a proof that changing the visible preset does not change keyboard routing or persisted settings
- a proof that the Console input-priority control still updates the existing owner from the Key Bindings pane
- focused Settings tests for the visible `Key Bindings` pane
- a check that the Settings shell layout remains unchanged

#### Done Shape

- the preset selector is visible without claiming full rebinding support
- the right pane can list shortcuts by mode or surface context
- cataloged and deferred shortcut areas are both visible and clearly different
- `Default` and `Blender (working)` are visible, with Blender still copied from Default
- Console input-priority remains an owner-backed shortcut behavior setting in the same pane
- the surface feels like part of the same store-like Settings workspace
- later phases can add Fly Mode visibility, editable shortcut ownership, runtime application, and final hardening without blurring the read-first cut

## [x] `Settings-2 / Phase 5` - `Fly Mode Entry Binding Visibility`

### Phase 5 Summary

Add the Fly Mode entry binding to the Key Bindings read.

This phase should show that Fly Mode is entered by right-click hold, while still staying read-first and downstream from the live viewport input owner.

### Phase 5 Implementation Spec

#### Purpose

Make the Fly Mode entry gesture visible in Settings so users can discover how to enter it without guessing.

This phase should add the row from a source-backed inventory adapter, not by hand-writing one extra Settings-only line. The goal is one honest Fly Mode entry row in the already-rendered grouped Key Bindings pane.

#### Owns

- locating the live owner for Fly Mode entry behavior
- adding `Right click hold` to the shortcut inventory read as the Fly Mode entry binding
- rendering the Fly Mode entry in the existing Key Bindings grouped surface
- focused proof that the row reads from the inventory model

#### Does Not Own

- Fly Mode movement controls
- changing the Fly Mode entry gesture
- rebinding or custom preset behavior
- broader mouse/input-device settings

#### Current Live Read

The current Fly Mode entry behavior is owned by the viewer, not Settings.

Live seams:
- `src/viewer/Viewer.ts` defines `DEFAULT_FLY_ACTIVATION_MODE` as `right-click`.
- `src/viewer/Viewer.ts` exposes `getFlyActivationMode()`, `setFlyActivationMode(...)`, and `setOnFlyActivationModeChange(...)`.
- `src/viewer/Viewer.ts` starts a fly session from right-button `pointerdown` when `flyActivationMode === 'right-click'` and `canStartFlySession(event)` is true.
- `src/app/viewerBridge.ts` exports `FlyActivationMode = 'right-click' | 'always-on'`.
- `src/app/components/ViewToolbar.tsx` already presents the fly activation setting as `Right Click` / `Always On`.
- `src/app/inputRouting.ts` already has the active keyboard owner `viewer-fly`, but that applies after Fly Mode is active and belongs to Phase 6 movement controls.

Phase 5 should therefore treat `Right click hold` as the entry gesture for the current default activation mode and should point to `Viewer.ts` plus `viewerBridge.ts` as the source truth. It should not move the View Toolbar setting, and it should not make the entry gesture configurable yet.

#### First Pass Decisions

1. Treat Fly Mode entry as a Viewport shortcut group unless a narrower owner label exists.
2. Show the gesture text as `Right click hold`.
3. Use a new source-map/read-model adapter for mouse or gesture bindings if the existing keyboard binding type is too narrow.
4. Keep the row read-only.
5. Label the group as `Fly Mode` with mode/context `Viewport`.
6. Preserve `viewer-fly` movement keys as deferred to Phase 6.
7. Keep `Always On` visible only as source context if needed; do not render it as the primary entry binding row for this phase.

#### Exact First Code Cut

The first implementation pass should:
- add one Fly Mode entry source or row to the shortcut inventory source/read model with `Viewer.ts` source provenance
- represent the gesture as `Right click hold`
- keep the row under a `Fly Mode` / `Viewport` group
- render the row in the existing Key Bindings grouped pane
- update focused source-map/read-model/Settings tests

#### Likely Files

- `src/app/shortcutInventorySourceMap.ts`
- `src/app/shortcutInventorySourceMap.test.ts`
- `src/app/shortcutInventoryReadModel.ts`
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/viewer/Viewer.ts` only if an exported constant is needed for the entry binding label
- `src/app/viewerBridge.ts` only if the read model needs the `FlyActivationMode` type
- no `src/app/components/ViewToolbar.tsx` changes unless a shared option label is extracted cleanly

#### No-Widening Rule

- do not add Fly Mode movement controls yet
- do not change pointer-lock, camera, or mouse behavior
- do not add editable shortcut controls
- do not invent a persisted mouse-binding profile
- do not move or duplicate the View Toolbar Fly Mode activation setting
- do not render Fly Mode movement keys before Phase 6
- do not expose `Always On` as an editable shortcut preset behavior

#### Implementation Risks

- right-click may also be used by context menus in other surfaces, so the row needs a clear Viewport/Fly Mode context
- inline viewport input code may not yet expose a clean binding registry
- mouse gestures need formatting that does not collide with keyboard-only row assumptions
- the current `ViewerCameraShortcutBinding` type is keyboard-specific, so the inventory model may need a small generic row shape rather than forcing mouse gestures into `code`
- showing `Right click hold` must not imply all right-click behavior across the app enters Fly Mode
- `Always On` is a viewer mode setting and can confuse the entry-binding row if it is mixed into the shortcut list too early

#### Checklist

- [x] identify the Fly Mode entry owner
- [x] add `Right click hold` as the Fly Mode entry binding
- [x] render the Fly Mode entry in Key Bindings
- [x] keep the row read-only and source-backed

#### Verification Shape

- source-map/read-model proof for the Fly Mode entry binding
- Settings proof that `Right click hold` appears under Fly Mode or Viewport
- proof that the row has `Viewer.ts` provenance or otherwise consumes a shared source-backed constant
- no behavior-change proof for viewport input

#### Done Shape

- Fly Mode entry is visible in Key Bindings
- the row reads as `Right click hold`
- movement controls remain deferred to Phase 6

## [x] `Settings-2 / Phase 6` - `Fly Mode Control Subsection`

### Phase 6 Summary

Add a Fly Mode subsection that lists the controls used while flying.

This phase should show movement/look controls under Fly Mode as an in-mode control set instead of mixing them into the generic Viewport shortcut list.

### Phase 6 Implementation Spec

#### Purpose

Make Fly Mode discoverable after entry by showing the controls that matter while the right-click-hold fly state is active.

This phase should extend the existing source-backed Fly Mode group instead of creating a second unrelated Viewport group. The user should be able to read both how to enter Fly Mode and the first set of in-mode controls directly under Fly Mode.

#### Owns

- the Fly Mode grouped subsection shape
- movement/look control rows for Fly Mode
- any needed read-model support for nested or contextual groups
- focused proof that Fly Mode controls stay grouped below Fly Mode

#### Does Not Own

- editing Fly Mode controls
- changing Fly Mode movement behavior
- mouse sensitivity or camera tuning
- general viewport shortcut rebinding

#### Current Live Read

Fly Mode in-control behavior is already present in the viewer and keyboard routing.

Live seams:
- `src/viewer/Viewer.ts` has `resolveFlyMovementKey(...)`, mapping `W`, `S`, `A`, `D`, `Space`, `Control`, `Shift`, `Q`, and `E`.
- `src/viewer/Viewer.ts` handles pointer movement through `updateFlySessionPointer(...)`, applying look deltas while Fly Mode is active.
- `src/viewer/Viewer.ts` treats `Q` / `E` as roll controls in Drone mode and skips roll in Free Cam mode.
- `src/app/inputRouting.ts` has `isViewerFlyMovementKey(...)` and routes active fly movement keys to owner `viewer-fly`.
- `src/viewer/Viewer.test.ts` already proves right-click Fly Mode starts, pointer movement applies look deltas, `W` moves forward, `Control` descends, `Shift` boosts, and `Q` / `E` roll in Drone mode.

Phase 6 should use those live seams as source truth and render read-only controls such as:
- `Look` - `Mouse move`
- `Forward` - `W`
- `Backward` - `S`
- `Left` - `A`
- `Right` - `D`
- `Up` - `Space`
- `Down` - `Control`
- `Boost` - `Shift`
- `Roll left` - `Q`
- `Roll right` - `E`

The `Q` / `E` rows should carry a context note that roll applies to Drone mode, because Free Cam intentionally suppresses roll keys.

#### First Pass Decisions

1. Use a Fly Mode group or subgroup label, not a flat Viewport list.
2. Prefer live owner constants if they exist; otherwise add an honest source-map adapter.
3. Keep movement controls read-only.
4. If a control cannot be mapped cleanly, show it as deferred rather than guessing.
5. Reuse the Phase 5 `Fly Mode` group if practical so entry and in-mode controls stay together.
6. Add generic display bindings for mouse-look and movement rows instead of forcing everything into keyboard-only binding types.
7. Add context notes where behavior is mode-specific, especially Drone-only roll controls.
8. Do not surface Fly Move Speed or Roll Speed sliders here; those remain View/HUD tuning controls, not key-binding rows.

#### Exact First Code Cut

The first implementation pass should:
- add Fly Mode control display bindings to the existing Fly Mode source entry or a clearly linked Fly Mode controls entry
- include source provenance for `Viewer.ts` and `inputRouting.ts`
- render the controls under the Fly Mode grouping in Key Bindings
- preserve the existing `Enter Fly Mode` / `Right click hold` row
- add context notes for mouse-look and Drone-only roll controls
- add focused source-map, read-model, and Settings tests

#### Likely Files

- `src/app/shortcutInventorySourceMap.ts`
- `src/app/shortcutInventorySourceMap.test.ts`
- `src/app/shortcutInventoryReadModel.ts`
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/viewer/Viewer.ts` only if exported control constants are needed
- no `src/app/inputRouting.ts` behavior changes

#### No-Widening Rule

- do not make Fly Mode controls editable yet
- do not add input sensitivity settings
- do not change runtime Fly Mode behavior
- do not flatten Fly Mode into unrelated Viewport shortcuts
- do not move Fly Mode speed sliders from View Toolbar/HUD into Key Bindings
- do not expose Free Cam/Drone mode switching as a shortcut-binding row
- do not persist any new shortcut profile state

#### Implementation Risks

- Fly Mode controls may be spread across pointer and keyboard handlers
- nested group UI can become visually noisy if it is overbuilt
- mouse-look controls may need special row language compared with key chords
- `Control` can be both a modifier and a held movement key, so the row should say `Control` plainly and tests should preserve the existing `viewer-fly` routing behavior.
- `Q` / `E` are intentionally ignored for roll in Free Cam, so they need context rather than being presented as universal Fly Mode controls.
- adding a second Fly Mode group could split entry and in-mode controls in a confusing way.

#### Checklist

- [x] map Fly Mode in-mode controls
- [x] render a Fly Mode subsection below the entry binding
- [x] keep controls read-only
- [x] preserve honest deferred rows for unmapped controls

#### Verification Shape

- proof that Fly Mode controls render under Fly Mode
- proof that the entry row remains visible with `Right click hold`
- source-map/read-model proof for `W/A/S/D`, `Space`, `Control`, `Shift`, and `Q/E`
- Settings proof for pointer-look and movement rows
- proof that controls remain read-only
- no runtime Fly Mode behavior change

#### Done Shape

- Key Bindings shows how to enter Fly Mode
- Key Bindings shows what to do while in Fly Mode
- editable shortcut work remains deferred to Phase 7+

#### Implementation Closeout

Phase 6 shipped as a read-only shortcut reference pass.

The existing source-backed `Fly Mode` group now renders an `Entry` row for `Enter Fly Mode` / `Right click hold` and a `While flying` subsection for `Look`, `Forward`, `Backward`, `Left`, `Right`, `Up`, `Down`, `Boost`, `Roll left`, and `Roll right`. The `Q` / `E` roll rows carry the Drone-only context note, and the source entry now records `Viewer.ts`, `viewerBridge.ts`, and `inputRouting.ts` provenance.

Runtime Fly Mode behavior, speed settings, mode switching, persisted profiles, and editable shortcut bindings remain deferred.

## [x] `Settings-2 / Phase 7` - `Editable Shortcut Contract And Custom Preset Model`

### Phase 7 Summary

Define the data and ownership contract for editable shortcuts.

This phase should establish how custom shortcut values are represented before the UI starts accepting edits.

### Phase 7 Implementation Spec

#### Purpose

Create a real editable shortcut contract that can preserve named presets, represent user changes, detect conflicts, and reset safely.

#### Owns

- editable shortcut binding schema
- custom preset naming rules
- reset-to-base behavior contract
- conflict read model
- persistence owner decision for custom shortcut bindings

#### Does Not Own

- visible edit controls
- applying custom bindings to runtime input routing
- import/export profile management
- advanced multi-device input mapping

#### Current Live Read

The shortcut surface now has enough read-only shape to define the editing contract without starting UI editing yet.

Live seams:
- `src/app/shortcutInventoryReadModel.ts` owns `ShortcutPresetId`, `ShortcutPresetRead`, `shortcutPresetReads`, `ShortcutInventoryRow`, and `getShortcutInventoryReadModel(presetId)`.
- `shortcutPresetReads` currently exposes immutable base reads for `Default` and `Blender (working)`, with `Blender (working)` copied from `Default`.
- `SettingsSurface.tsx` stores the selected shortcut preset locally through `selectedShortcutPresetId`; no shortcut preset state is persisted yet.
- `ShortcutInventoryRow` can represent keyboard and non-keyboard display rows, and Phase 6 added `sectionLabel` for grouped Fly Mode rows.
- Existing rows do not yet declare whether they are editable, what command id a future edit should write to, or which owner can apply the edit.
- Deferred groups still exist for routing-only, behavior-setting, and fragmented shortcut areas; Phase 7 should keep those read-only until an editable owner contract exists.

Phase 7 should create the model contract that later UI and runtime phases consume. The useful first contract is:
- base preset ids: `default`, `blender-working`
- custom preset ids or reads derived from a base preset, not mutations of the base preset
- custom display labels:
  - `Default (custom)`
  - `Blender (working custom)`
- editable row metadata that can say whether a row is editable, read-only, or deferred
- binding override records keyed by stable shortcut row or command ids
- conflict reads that can name the conflicting command rows before runtime application
- reset-to-base behavior that removes overrides for the active base preset

#### First Pass Decisions

1. Named presets such as `Default` and `Blender (working)` are base presets.
2. User edits should not mutate base presets invisibly.
3. If the user starts on `Default` and edits a value, the active preset becomes `Default (custom)`.
4. If the user starts on `Blender (working)` and edits a value, the active preset becomes `Blender (working custom)` unless a later naming pass chooses a clearer label.
5. Reset should return the custom preset to its base preset values.
6. Conflict data should be representable before edits are applied.
7. Phase 7 should keep the contract in a small shortcut-domain helper instead of embedding it in `SettingsSurface.tsx`.
8. Phase 7 should not persist custom shortcut state unless the persistence boundary is fully tested; an in-memory/custom read helper is acceptable for this contract phase.
9. Rows without editable owner metadata remain read-only even if the custom preset model exists.

#### Exact First Code Cut

The first implementation pass should:
- add a shortcut custom preset contract helper near the shortcut inventory/read-model files
- add editable shortcut binding and override types
- add base-preset-to-custom-preset read helpers
- add reset-to-base behavior for custom override sets
- add conflict-state reads for duplicate binding values inside the editable subset
- add explicit editable/read-only row state to the read contract only where the owner is known
- add tests for base-to-custom naming, immutable base presets, reset semantics, and conflict reads
- stop before visible edit controls

#### Likely Files

- `src/app/shortcutCustomPresetModel.ts` or a similarly narrow helper
- `src/app/shortcutCustomPresetModel.test.ts`
- `src/app/shortcutInventoryReadModel.ts` if the row/read contract needs editable-state fields
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/shortcutInventorySourceMap.ts` only if editable owner metadata belongs beside the source entries
- no `src/app/workspace/SettingsSurface.tsx` changes unless a type import is needed for compile coverage
- no `src/app/inputRouting.ts` behavior changes

#### No-Widening Rule

- do not render editable controls yet
- do not apply custom bindings to live routing yet
- do not silently persist partial custom state without reset/conflict tests
- do not add import/export or sharing
- do not make routing-only or fragmented shortcut groups editable by default
- do not convert `Console first input priority` into a key binding
- do not change `Default` or `Blender (working)` base preset reads when creating custom variants

#### Implementation Risks

- mutating base presets would make `Default` stop meaning default
- conflict handling can become ambiguous if it is only UI text
- persistence ownership needs to be explicit before runtime routing consumes it
- row ids may not be stable enough for persisted custom overrides unless the contract names a stable command id
- mouse gestures such as `Right click hold` and `Mouse move` may need a binding value shape that is not keyboard-only
- exposing custom reads too early in Settings can make users think runtime shortcut behavior already changed

#### Checklist

- [x] define editable binding schema
- [x] define base preset versus custom preset reads
- [x] define `Default (custom)` behavior after edits
- [x] define `Blender (working custom)` behavior after edits
- [x] define reset semantics
- [x] define conflict read shape
- [x] keep visible edit controls deferred

#### Verification Shape

- tests for custom preset naming from `Default`
- tests for custom preset naming from `Blender (working)`
- tests that base presets remain unchanged
- tests for reset back to base values
- tests for conflict read output
- tests that read-only/deferred rows are not treated as editable
- no Settings edit-control proof yet
- no runtime input-routing proof yet

#### Done Shape

- editable shortcut ownership is explicit
- custom preset behavior is safe before UI editing exists
- Phase 8 can render edit controls without inventing state rules

#### Implementation Closeout

Phase 7 shipped as a contract-only custom shortcut model pass.

The new `shortcutCustomPresetModel` helper defines base-to-custom preset reads, custom ids, custom labels, override application, reset-to-base filtering, binding formatting, and conflict reads. `Default` and `Blender (working)` remain immutable base reads, while changed override sets can resolve to `Default (custom)` or `Blender (working custom)`.

The shortcut read model now marks rows as `editable` or `read-only` and carries binding values for editable keyboard registry rows. Viewer camera shortcut rows are the first editable contract rows because they come from a stable keyboard binding registry. Fly Mode gesture and mouse rows remain read-only until a later owner contract says otherwise.

No Settings edit controls, persisted shortcut profiles, or runtime input-routing behavior changed.

## [x] `Settings-2 / Phase 8` - `Editable Shortcut Rows And Custom Preset UI`

### Phase 8 Summary

Render editable shortcut rows in Key Bindings.

This phase should let users change supported shortcuts and immediately show the active preset as a custom variant.

### Phase 8 Implementation Spec

#### Purpose

Turn supported read-only shortcut rows into editable rows using the Phase 7 custom preset contract.

#### Owns

- visible shortcut edit controls
- custom preset label updates after user edits
- reset control for custom presets
- conflict warning display before runtime application
- shortcut-listening capture state for supported editable rows
- row-anchored overlap messages for every conflicting row

#### Does Not Own

- runtime routing application for custom shortcuts
- advanced import/export profiles
- unsupported shortcut owners that still lack an editable contract
- automatic conflict resolution or forced uniqueness

#### First Pass Decisions

1. Only rows backed by editable owner contracts become editable.
2. Unsupported or deferred rows remain read-only/deferred.
3. Changing a value while viewing a base preset switches the selector label to the matching custom preset.
4. Conflict warnings should appear before the user trusts a binding.
5. Editing starts by clicking the shortcut value, then the row enters a listening state for the next supported keyboard shortcut.
6. If the captured shortcut overlaps another editable row, allow the overlap inline and show anchored warning messages on both affected rows.
7. Phase 8 should not use a blocking popup or confirmation dialog for overlap.

#### Interaction Contract

1. Editable shortcut rows should present the current binding value as the edit target.
2. Clicking the value should put that row into a clear `Listening...` or equivalent capture state.
3. The next supported keyboard shortcut becomes the candidate binding.
4. `Escape` should cancel listening without changing the row.
5. If the candidate binding has no conflict, apply it immediately through the Phase 7 custom preset helper.
6. If the candidate binding overlaps another editable row, apply it and show inline overlap messages instead of opening a modal or popup.
7. Overlap messages should be anchored on the right side of each affected shortcut row, positioned to the left of the shortcut value so the warning reads with the value it explains.
8. The overlap copy should name the conflicting command when possible.

#### Exact First Code Cut

The first implementation pass should:
- render editable controls for supported shortcut rows
- update the active preset label to `Default (custom)` or the current base preset's custom label after edits
- support click-to-listen keyboard capture for editable values
- render reset behavior
- show anchored conflict warnings from the Phase 7 conflict read on both overlapping rows
- add focused Settings tests

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/theme/surfaces/settings.css`
- shortcut preset/custom binding helper
- focused Settings tests

#### No-Widening Rule

- do not apply custom shortcuts to runtime routing yet
- do not make unsupported rows editable
- do not hide conflicts
- do not silently overwrite or clear another row's shortcut when overlap is allowed
- do not use a modal or popup confirmation for overlap
- do not add import/export profiles

#### Implementation Risks

- editable rows can imply runtime behavior changed before Phase 10
- custom labels can become confusing if reset and base labels are not clear
- unsupported deferred rows need to stay visually distinct
- click-to-listen capture needs to avoid stealing ordinary typing from search fields, selects, or other editable Settings controls
- overlap warnings need to be visible without making the shortcut value hard to read

#### Checklist

- [x] render editable controls for supported shortcuts
- [x] support click-to-listen capture from the shortcut value
- [x] switch active base preset to a custom label after edits
- [x] render reset-to-base behavior
- [x] render anchored conflict warnings beside both overlapping rows
- [x] keep unsupported rows read-only

#### Verification Shape

- Settings test for editing from `Default` to `Default (custom)`
- Settings test for editing from `Blender (working)` to its custom variant
- reset test back to base preset
- conflict warning display test for both affected rows
- overlap edit test proving the conflicting binding is accepted inline
- no runtime routing change proof

#### Done Shape

- users can edit supported shortcut rows in Settings
- custom preset labels make the mutation visible
- custom bindings are not yet trusted by runtime until Phase 10

### Phase 8 Shipped Result

Phase 8 shipped the first visible editable shortcut UI for supported keyboard rows.

Editable shortcut values now render as buttons. Clicking a supported value enters a `Listening...` state, `Escape` cancels capture, and the next supported non-modifier key writes an in-memory custom binding through the Phase 7 custom preset helper. Editing `Default` changes the selector label to `Default (custom)`, editing `Blender (working)` changes it to `Blender (working custom)`, and `Reset shortcut preset` clears the active preset's overrides back to its base read.

Overlaps are accepted inline. When two editable rows share the same binding, both rows show an anchored overlap message immediately to the left of the shortcut value. Unsupported and deferred shortcut rows remain read-only.

No custom shortcut bindings are applied to runtime input routing yet; Phase 10 owns that boundary.

## [x] `Settings-2 / Phase 9` - `Normal CAD Camera Control Visibility`

### Phase 9 Summary

Catalog normal viewport camera controls.

This phase should make orbit, pan, and zoom visible in Key Bindings before custom shortcut bindings are applied through live routing owners.

### Phase 9 Implementation Spec

#### Purpose

Add normal CAD camera control visibility to the Key Bindings surface without changing camera behavior.

#### Owns

- normal viewport camera control rows for orbit, pan, and zoom
- mouse and wheel gesture display for the current default camera controls
- a clear Viewport subsection that separates normal camera controls from Fly Mode controls
- source-map and read-model proof that these rows come from the real viewer/camera owner seam or are honestly labeled as display-only gesture rows

#### Does Not Own

- changing orbit, pan, or zoom behavior
- rebinding mouse gestures
- applying custom shortcut overrides to runtime routing
- Fly Mode controls, which already have their own read section
- advanced input-device settings such as sensitivity or per-device profiles

#### Current Live Read

The Key Bindings pane already lists keyboard camera presets, Zoom Object, Fly Mode entry, and Fly Mode movement/look rows.

The normal CAD camera controls are still missing from the visible shortcut read. Those controls are expected by users who scan for camera behavior, but they are gesture/pointer controls rather than simple keyboard bindings.

Live seams for the first implementation pass:
- `src/viewer/Viewer.ts` owns the normal pointer gesture routing for middle-button pan, Ctrl+middle-button orbit, Fly Mode right-click, and console camera modes.
- `src/viewer/scene/CameraController.ts` owns `beginTemporaryOrbitDrag`, `updateTemporaryOrbitDrag`, `beginTemporaryPanDrag`, `updateTemporaryPanDrag`, and the OrbitControls mouse-button binding policy.
- `CameraController.applyMouseBindings()` currently keeps OrbitControls `LEFT`, `MIDDLE`, and `RIGHT` mouse buttons disabled for default direct OrbitControls drags, while Viewer starts temporary drags explicitly.
- Middle-button drag is the current normal pan gesture. It starts only after the held middle button moves past the click threshold, which keeps middle-button double-click frame-all separate from pan.
- Ctrl+middle-button drag is the current normal orbit gesture.
- Mouse wheel zoom is handled by OrbitControls/CameraController during normal viewing; `Viewer.ts` only intercepts wheel while Fly Mode is active to adjust fly speed.
- `src/viewer/Viewer.test.ts` already proves middle-button double-click frame-all is separate from pan, middle-button pan starts only after movement threshold, and axis-gizmo orbit forwards through the temporary orbit seam.
- `src/viewer/scene/CameraController.test.ts` already proves temporary pan/orbit helpers and OrbitControls mouse-button policy.

#### First Pass Decisions

1. Treat normal orbit, pan, and zoom as Viewport camera controls.
2. Keep them read-only until a real editable mouse/gesture contract exists.
3. Separate normal camera controls from Fly Mode controls so right-click-hold Fly Mode does not blur with regular orbit/pan/zoom.
4. Use current live viewer behavior as the source of truth where it is explicit; if the source is still inline, catalog the row honestly with source provenance instead of inventing a new owner.
5. Stop before runtime shortcut application so Phase 10 applies custom bindings against a more complete visible inventory.
6. Use a distinct source-map entry such as `viewer-normal-camera-controls` instead of adding these rows to `viewer-camera-shortcuts`, because keyboard camera presets and pointer camera gestures have different ownership and editability.
7. Keep the first visible rows to `Orbit`, `Pan`, and `Zoom`; do not widen into frame-all, Zoom Window, console camera commands, sensitivity, or profile settings unless the implementation discovers a blocking reason.
8. Use `sectionLabel: 'Normal camera'` or equivalent so normal controls sit near other Viewport rows without flattening into Fly Mode's `Entry` / `While flying` sections.

#### Exact First Code Cut

The first implementation pass should:
- inspect the live viewer camera control handlers for orbit, pan, and zoom
- add a cataloged display-binding source entry for normal camera controls
- include rows for `Orbit` as `Ctrl+middle mouse drag`, `Pan` as `Middle mouse drag`, and `Zoom` as `Mouse wheel`
- render those rows in the existing Key Bindings grouped read under Viewport
- keep the rows read-only
- add focused source-map, read-model, and Settings tests

#### Likely Files

- `src/app/shortcutInventorySourceMap.ts`
- `src/app/shortcutInventorySourceMap.test.ts`
- `src/app/shortcutInventoryReadModel.ts`
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/viewer/Viewer.ts` only if a tiny exported label/contract helper is needed; no pointer behavior edits should be required
- `src/viewer/scene/CameraController.ts` only if a tiny exported label/contract helper is needed; no camera behavior edits should be required

#### No-Widening Rule

- do not change pointer behavior, camera behavior, or wheel behavior
- do not make mouse gestures editable in this phase
- do not apply custom keyboard shortcuts to runtime routing
- do not move Fly Mode controls out of their existing Fly Mode group
- do not invent Blender-specific differences yet
- do not add Zoom Window, frame-all, console camera modes, sensitivity, or profile import/export to this slice

#### Implementation Risks

- normal camera controls can be confused with Fly Mode controls if the grouping is not explicit
- pointer gestures may live inline, so the implementation should avoid pretending there is a mature editable registry
- showing read-only mouse controls beside editable keyboard rows needs clear row styling so users do not think every value can be clicked
- wheel zoom is owned by OrbitControls behavior rather than a local keyboard registry, so source provenance needs to be explicit and read-only

#### Checklist

- [x] identify the live normal camera control owner seam for orbit, pan, and zoom
- [x] add normal camera control rows to the shortcut inventory read
- [x] group normal camera controls under Viewport separately from Fly Mode
- [x] keep normal camera control rows read-only
- [x] prove the Settings pane renders orbit, pan, and zoom controls without changing runtime camera behavior

#### Verification Shape

- source-map test for normal camera control rows
- read-model test for Viewport grouping and read-only gesture rows
- Settings test proving orbit, pan, and zoom appear in Key Bindings
- focused proof that the new rows are read-only while existing editable keyboard camera rows remain editable
- no runtime camera behavior changes

#### Done Shape

- users can see normal CAD camera controls in Key Bindings
- orbit, pan, and zoom are visible before custom runtime shortcut application begins
- Phase 10 can apply custom keyboard bindings without leaving the camera-control inventory obviously incomplete

### Phase 9 Shipped Result

Phase 9 shipped normal CAD camera control visibility as a read-only shortcut inventory pass.

The shortcut source map now includes a `Normal camera controls` cataloged group backed by the live Viewer and CameraController owner seams. It renders `Orbit` as `Ctrl+middle mouse drag`, `Pan` as `Middle mouse drag`, and `Zoom` as `Mouse wheel` under a `Normal camera` subsection in the Key Bindings pane.

The new rows are read-only display bindings. Existing editable keyboard camera shortcut rows stay editable, Fly Mode stays in its own group, and no pointer, wheel, camera, shortcut-routing, or runtime custom-binding behavior changed.

## [x] `Settings-2 / Phase 10` - `Custom Shortcut Runtime Application`

### Phase 10 Summary

Apply custom shortcut bindings through the real runtime owners.

This phase should make changed shortcuts actually affect input behavior without mutating the base presets.

### Phase 10 Implementation Spec

#### Purpose

Connect custom shortcut bindings to the live input-routing and shortcut-resolution owners.

#### Owns

- runtime consumption of custom shortcut bindings
- conflict prevention or blocking before activation
- persistence of active custom preset behavior
- tests proving custom shortcuts affect runtime behavior

#### Does Not Own

- new advanced editor features
- import/export profiles
- shortcuts that still lack an editable owner contract
- unrelated input-device settings

#### Current Live Read

Phase 8 made shortcut edits visible in Settings, but those overrides are still local component state.

Runtime camera shortcut handling still reads the base shortcut definitions:
- `src/app/cameraShortcuts.ts` owns `viewerCameraShortcutBindings` and `resolveViewerCameraShortcutAction(event, inputPriorityMode)`.
- `src/app/inputRouting.ts` calls `resolveViewerCameraShortcutAction` to decide whether `viewer-camera-shortcuts` owns a keyboard event before flat Console capture.
- `src/app/useViewerCameraShortcuts.ts` calls `routeKeyboardInput`, then calls `resolveViewerCameraShortcutAction` again to perform the actual camera preset or Zoom Object command.
- `src/viewer/Viewer.ts` has a viewer-local Zoom Object fallback that also calls `resolveViewerCameraShortcutAction`.
- `src/app/shortcutCustomPresetModel.ts` can apply override values to editable read rows and detect conflicts, but it does not yet expose a runtime resolver.
- `src/app/workspace/SettingsSurface.tsx` currently owns `selectedShortcutBasePresetId` and `shortcutBindingOverrides` locally, so runtime code cannot consume the edited preset yet.
- Only editable keyboard rows from `viewer-camera-shortcuts` are ready for runtime application. Fly Mode, normal camera mouse gestures, routing-owner-only rows, behavior settings, and fragmented rows remain read-only/deferred.
- `Console first input priority` still changes Zoom Object semantics: `console-first` expects `Shift+Z`, while `shortcuts-first` allows plain `Z` for Zoom Object. Phase 10 must preserve that special rule unless it explicitly normalizes it through the custom resolver.

#### First Pass Decisions

1. Custom bindings must flow into real shortcut owners, not a Settings-only mirror.
2. Base presets remain immutable.
3. Conflicting custom bindings should be blocked or clearly inactive until resolved.
4. Runtime behavior should have focused tests at the owner seam.
5. Start with viewer camera keyboard shortcuts only.
6. Move shortcut preset selection and overrides out of `SettingsSurface` into one shared owner seam that Settings and runtime can both read.
7. Add one custom-aware runtime resolver for viewer camera shortcuts instead of duplicating override lookup inside `inputRouting`, `useViewerCameraShortcuts`, and `Viewer.ts`.
8. Use the same active custom read for both route ownership and command execution so a changed shortcut cannot route differently than it executes.
9. Keep custom state in memory unless persistence can be added with focused migration/normalization tests inside the same slice.
10. Do not make read-only mouse gestures, Fly Mode controls, display-mode routing, or fragmented inline shortcuts runtime-editable in this phase.

#### Runtime Conflict Rule

Settings may continue to show overlaps inline, because Phase 8 intentionally allows overlap edits.

Runtime must not silently choose one overlapping command as the winner. The first implementation pass should choose one deterministic behavior and prove it:
- preferred: conflicting effective custom bindings are excluded from runtime resolution while non-conflicting custom bindings still apply
- acceptable if simpler: if any conflict exists in the active custom preset, runtime uses the base preset until conflicts are resolved

#### Exact First Code Cut

The first implementation pass should:
- add a shared shortcut preference/runtime read owner for active base preset id and binding overrides
- update Settings to read/write the shared shortcut owner instead of keeping custom overrides local only
- add a custom-aware viewer camera shortcut resolver that can consume the active preset and override set
- update `routeKeyboardInput`, `useViewerCameraShortcuts`, and the Viewer-local Zoom Object fallback to use the same custom-aware resolver/read
- wire custom bindings into supported shortcut resolution
- preserve base preset defaults
- block or warn on conflicts before activation
- preserve the existing `Console first input priority` Zoom Object behavior
- add focused runtime, routing, custom-preset, and Settings tests

#### Likely Files

- `src/app/shortcutCustomPresetModel.ts`
- `src/app/shortcutCustomPresetModel.test.ts`
- a new small shortcut preference owner near the shortcut inventory/custom model files, or an existing store if one already clearly owns user shortcut preferences
- `src/app/cameraShortcuts.ts`
- `src/app/cameraShortcuts.test.ts`
- `src/app/inputRouting.ts`
- `src/app/inputRouting.test.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `src/viewer/Viewer.ts`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `SettingsSurface` tests only where UI reflects active behavior
- targeted runtime shortcut tests

#### No-Widening Rule

- do not make every fragmented shortcut editable at once
- do not add import/export profiles
- do not bypass existing input-routing ownership
- do not remove conflict protection
- do not add runtime editing for Fly Mode, normal camera mouse gestures, display-mode shortcuts, or routing-only rows
- do not change pointer, wheel, Fly Mode, camera preset command, or Zoom Object command behavior except for custom keyboard binding resolution
- do not silently persist custom shortcut state without migration and reset tests
- do not invent Blender-specific shortcut differences yet

#### Implementation Risks

- runtime and Settings can drift if custom bindings are applied through a hidden copy
- conflicts can make shortcuts feel broken if activation is too permissive
- persisted custom state needs migration/normalization rules
- route ownership and command execution can diverge if `routeKeyboardInput` and `useViewerCameraShortcuts` do not share the same resolver inputs
- the Viewer-local Zoom Object fallback can keep old behavior if it is not updated with the same runtime read
- `Console first input priority` can regress if Zoom Object custom resolution does not preserve the plain-Z versus Shift+Z rule

#### Checklist

- [x] apply custom bindings through real shortcut owners
- [x] keep base presets immutable
- [x] enforce or surface conflicts before activation
- [x] prove runtime behavior follows custom bindings
- [x] move active shortcut preset and override reads into a shared owner seam
- [x] keep read-only gesture/deferred rows out of runtime custom application

#### Verification Shape

- runtime test for a changed shortcut
- proof the base preset remains unchanged
- conflict test
- routing test proving a custom binding claims `viewer-camera-shortcuts`
- execution test proving the custom binding triggers the intended camera command
- test proving conflicts are not silently activated
- test proving `Console first input priority` still affects Zoom Object correctly
- Settings test proving the UI still switches to custom labels and reset writes through the shared owner
- persistence/normalization test if storage is introduced

#### Done Shape

- edited shortcuts can affect runtime behavior
- named base presets remain safe
- custom preset state is honest and test-backed
- route ownership and command execution use the same effective shortcut read
- unsupported shortcut families remain visibly read-only/deferred

### Phase 10 Shipped Result

Phase 10 shipped the first runtime application pass for custom shortcut bindings.

Shortcut preset selection and binding overrides now live in a shared shortcut preference store instead of local Settings-only state. Settings still shows the same click-to-listen custom preset UI, but the active preset and overrides are now available to runtime shortcut owners.

Viewer camera keyboard shortcuts now resolve through one custom-aware runtime seam used by `inputRouting`, `useViewerCameraShortcuts`, and the Viewer-local Zoom Object fallback. Supported custom bindings can trigger the real camera preset and Zoom Object behavior, base presets remain immutable, and overlapping effective bindings are excluded from runtime resolution so the app does not silently choose a winner.

This phase intentionally kept Fly Mode controls, normal camera mouse gestures, display-mode routing, and fragmented shortcut families read-only/deferred. Custom shortcut state remains in memory only; persistence and advanced profile management stay outside this phase.

## [x] `Settings-2 / Phase 11` - `Context Launch, Drift Hardening, And Advanced Boundary`

### Phase 11 Summary

Harden the expanded shortcut surface and record the next advanced boundary.

This phase should make sure the section stays connected to live shortcut truth after fly-mode visibility, normal camera-control visibility, and custom bindings exist.

### Phase 11 Implementation Spec

#### Purpose

Finish the Key Bindings family phase with stable deep-link behavior, drift checks, and an explicit boundary for advanced shortcut work.

#### Owns

- context-launch or deep-link behavior into `Key Bindings`
- drift-hardening checks between Settings and live shortcut owners
- follow-on boundary for advanced shortcut profile work

#### Does Not Own

- import/export profiles
- cloud/shared shortcut presets
- shortcut persistence or migration
- editable Fly Mode, mouse gesture, display-mode, or fragmented shortcut rows
- unrelated Settings cleanup outside the `Key Bindings` lane

#### Current Live Read

Phases 1 through 10 have made Key Bindings a real Settings section with visible shortcut inventory, preset reads, editable viewer-camera keyboard rows, inline overlap messages, and runtime application for supported custom viewer-camera bindings.

The current launch and routing seams are:
- `src/app/AppShell.tsx` owns `settingsSurfaceInitialSectionId` and `handleOpenSettingsSurface(initialSectionId)`.
- floating hosts already call `onOpenSettings(...)` with section ids such as `browser`, `workspace`, `storage`, and `general`.
- `src/app/workspace/SettingsSurface.tsx` exports `SettingsSectionId`, accepts `initialSectionId`, and already has focused tests proving direct `keyBindings` landing works.
- no current host or shortcut row has a dedicated "open Settings to Key Bindings" affordance yet.

The current shortcut drift seams are:
- `src/app/shortcutInventorySourceMap.ts` owns the source map and keeps cataloged rows tied to live owners such as `viewerCameraShortcutBindings`.
- `src/app/shortcutInventoryReadModel.ts` normalizes source rows and preset reads for Settings.
- `src/app/viewerCameraShortcutRuntime.ts` applies active custom viewer-camera keyboard bindings for runtime behavior.
- existing tests prove the read model follows current `viewerCameraShortcutBindings`, but there is no explicit final-family drift test tying the runtime action map, editable rows, and Settings read together.

The current advanced-boundary seams are:
- custom shortcut state is in memory only.
- Blender differences remain intentionally unfilled.
- Fly Mode controls, normal camera gestures, display-mode shortcut, routing-owner-only rows, behavior-setting rows, and fragmented inline shortcuts are visible or deferred but not runtime-editable.

#### First Pass Decisions

1. Keep deep links narrow and intentional.
2. Add verification that catches source-of-truth drift early.
3. Split advanced profile work out of Settings-2 if it grows beyond this family phase.
4. Reuse `handleOpenSettingsSurface('keyBindings')` instead of adding a second Settings launcher contract.
5. Treat context launch as an affordance into the canonical Settings surface, not a separate mini editor or popup.
6. Add drift-hardening at the source/read/runtime boundary before adding any new visible shortcut families.
7. Record a follow-on family/phase boundary for persistence, import/export, Blender-specific differences, and broader editable shortcut families instead of folding them into Phase 11.

#### Exact First Code Cut

The first implementation pass should:
- add a narrow context launch affordance that opens the canonical Settings surface directly to `Key Bindings`
- prefer an existing settings button/menu surface if one is already the natural shortcut-help entry point
- keep the launch handler typed with `SettingsSectionId` and route through `handleOpenSettingsSurface('keyBindings')`
- add or harden tests proving the affordance opens Settings on the `Key Bindings` section
- add a shortcut drift-hardening test that proves editable viewer-camera read rows remain aligned with runtime-supported viewer-camera actions
- add a shortcut drift-hardening test or assertion that read-only/deferred groups stay non-editable until they have an owner contract
- update this doc with the final Settings-2 handoff and name the advanced follow-on boundary

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- one natural host/component that can expose the Key Bindings launch if already present in the current UI flow
- `src/app/shortcutInventoryReadModel.test.ts`
- `src/app/viewerCameraShortcutRuntime.test.ts`
- `src/app/workspace/SettingsSurface.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Settings/Future/Settings-2 - Key Bindings And Mode Shortcut Reference.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not quietly turn this phase into import/export profiles
- do not add hidden duplicate shortcut state to make deep links easier
- do not widen into unrelated Input or Advanced settings work
- do not add shortcut persistence
- do not add Blender-specific shortcut differences
- do not make Fly Mode, normal camera gestures, display-mode routing, or fragmented inline shortcut families editable
- do not create a second Settings surface or local shortcut editor for the launch affordance
- do not change runtime shortcut behavior except for defects found by the drift-hardening tests

#### Implementation Risks

- context launch can accidentally couple unrelated surfaces too tightly
- drift checks can become brittle if mode labels are not normalized first
- later advanced profile work can blur the clean family boundary if not split honestly
- a new launch affordance can be visually noisy if it is placed in the wrong shell surface
- runtime-supported viewer-camera actions can drift from editable Settings rows if the action map and source map are maintained separately
- deferred groups can accidentally become editable if the read model treats display bindings like keyboard owner bindings

#### Checklist

- [x] define any needed context-launch behavior
- [x] add shortcut drift-hardening verification
- [x] record the explicit follow-on boundary for advanced profile work
- [x] reuse the canonical Settings section launch path
- [x] prove Key Bindings direct landing from the chosen affordance
- [x] prove editable viewer-camera rows stay aligned with runtime-supported actions
- [x] prove read-only/deferred shortcut families remain non-editable

#### Verification Shape

- focused routing tests for any deep-link behavior
- a proof that the Settings read still matches live shortcut-owner truth
- a planning check that later widening stays explicit
- focused AppShell or host test for opening Settings directly to `Key Bindings`
- shortcut inventory/runtime drift test for viewer-camera editable rows
- focused Settings test only if the visible section or launch path changes

#### Done Shape

- `Key Bindings` is a stable Settings section
- shortcut visibility and custom behavior stay tied to live owners
- advanced profile work has an honest boundary
- one intentional UI path can bring the user straight to Key Bindings when shortcut help/settings are needed
- Settings-2 is ready to close without hiding persistence, Blender differences, or broader editable shortcut families inside this phase

### Phase 11 Shipped Result

Phase 11 shipped the final Key Bindings family hardening pass for Settings-2.

The Home Page help rail now includes a `Key Bindings` shortcut that opens the canonical Settings surface directly to the `Key Bindings` section through the existing Settings launch seam. This gives users one intentional orientation/help path into shortcut settings without adding a second shortcut editor or popup.

The shortcut tests now include final drift-hardening coverage for the expanded family:
- editable viewer-camera rows must stay aligned with runtime-supported viewer-camera actions
- read-only display rows and deferred shortcut families must stay non-editable until they have owner contracts
- the Home Page launch path must land in the canonical Settings `Key Bindings` section

Advanced shortcut work remains explicitly outside Settings-2: persistence, migration, Blender-specific differences, import/export profiles, Fly Mode editing, mouse gesture editing, display-mode editing, and fragmented shortcut-family editing all need their own future boundary instead of being hidden inside this closeout phase.
