# Settings 2 - Key Bindings And Mode Shortcut Reference

## Doc Header

### Doc History
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
- immediately tell where a shortcut applies

What must stay true:
- the section should feel like part of the same Unreal-style Settings surface
- the grouping should be mode-aware instead of one flat unsorted command wall
- shortcut presets should be exposed as a Settings control without becoming a full rebinding system
- `Console first input priority` should live with shortcut behavior instead of staying in `General`
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

### Codex Level Goals

- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-6. Add a dedicated `Key Bindings` settings section that groups shortcuts by mode or surface context without inventing a new shortcut owner.
- [ ] Settings-Gen1-CLG-7. Add a shortcut preset selector for `Default` and `Blender (working)` while keeping `Blender (working)` copied from `Default` until the real differences are supplied.
- [ ] Settings-Gen1-CLG-8. Move `Console first input priority` from `General` into the `Key Bindings` shortcut settings surface.

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

- [ ] Render the right-pane shortcut read with clear mode or surface grouping.
- [ ] Render the shortcut preset control with `Default` and `Blender (working)` above the grouped shortcut read.
- [ ] Keep the section readable when the number of shortcuts varies heavily across modes.
- [ ] Use stable row language for command name, key chord, and mode label.
- [ ] Preserve honest empty and deferred states in the visible pane.
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-7`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.
- [ ] Settings-Gen1-CLG-7.

### `Settings-2 / Phase 5`

- [ ] Tighten any deep-link or context-launch behavior into the `Key Bindings` section.
- [ ] Add drift-hardening checks so Settings does not silently diverge from the real shortcut owners.
- [ ] Decide whether any later rebinding work should stay here or split into a later Settings family.
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.

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

## [ ] `Settings-2 / Phase 4` - `Grouped Shortcut Pane Rendering`

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

- [ ] render the shortcut preset selector with `Default` and `Blender (working)`
- [ ] keep preset selection local and read-only
- [ ] render grouped shortcut rows in the right pane
- [ ] define stable row formatting for command, keys, and mode
- [ ] keep empty and deferred states readable
- [ ] show deferred groups distinctly from cataloged shortcut rows
- [ ] keep the relocated Console input-priority control working in the same pane
- [ ] avoid changing runtime shortcut behavior or shortcut persistence

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
- the final hardening phase can focus on deep links and drift checks only

## [ ] `Settings-2 / Phase 5` - `Context Launch, Drift Hardening, And Follow-On Boundary`

### Phase 5 Summary

Harden the new shortcut reference surface and decide the follow-on boundary.

This phase should make sure the section stays connected to live shortcut truth and cleanly hand off any later widening.

### Phase 5 Implementation Spec

#### Purpose

Finish the first shortcut-reference lane with stable deep-link behavior, drift checks, and an explicit answer about whether rebinding belongs in a later phase.

#### Owns

- context-launch or deep-link behavior into `Key Bindings`
- drift-hardening checks between Settings and live shortcut owners
- the family handoff for any later shortcut-editing work

#### Does Not Own

- full rebinding semantics
- shortcut profile import/export
- unrelated Settings cleanup outside the `Key Bindings` lane

#### First Pass Decisions

1. Keep deep links narrow and intentional.
2. Add verification that catches source-of-truth drift early.
3. Split later editing work into a new family phase if it grows beyond read-first visibility.

#### Exact First Code Cut

The first implementation pass should:
- add any needed context launch into `Key Bindings`
- harden tests or read adapters against shortcut drift
- record the explicit follow-on boundary for later rebinding work

#### Likely Files

- the Settings routing or workspace-launch helper
- shortcut inventory tests or registry adapter tests
- the `Settings-2` planning doc itself for the final handoff note

#### No-Widening Rule

- do not quietly turn this phase into a full rebinding project
- do not add hidden duplicate shortcut state to make deep links easier
- do not widen into unrelated Input or Advanced settings work

#### Implementation Risks

- context launch can accidentally couple unrelated surfaces too tightly
- drift checks can become brittle if mode labels are not normalized first
- later rebinding work can blur the clean read-first boundary if not split honestly

#### Checklist

- [ ] define any needed context-launch behavior
- [ ] add shortcut drift-hardening verification
- [ ] record the explicit follow-on boundary for rebinding or profile work

#### Verification Shape

- focused routing tests for any deep-link behavior
- a proof that the Settings read still matches live shortcut-owner truth
- a planning check that later widening stays explicit

#### Done Shape

- `Key Bindings` is a stable Settings section
- shortcut visibility stays tied to live owners
- the next shortcut-related widening has an honest boundary
