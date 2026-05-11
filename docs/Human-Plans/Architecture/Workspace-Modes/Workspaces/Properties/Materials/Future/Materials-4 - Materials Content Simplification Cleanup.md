# Materials 4 - Materials Content Simplification Cleanup

## Doc Header

### Doc History
30. 2026-05-11 08:40: Tightened the selected-material text input sizing so the full-width `Name` field uses border-box sizing and respects the right padding of its row.
29. 2026-05-11 08:38: Tightened the selected-material `Name` row label column so the material name input can fill the available row width instead of being constrained by the shared two-column field ratio.
28. 2026-05-10 21:48:04: Removed the visible `Search materials` label from the `Materials-4 / Phase 5` Project materials search field while keeping the accessible input label.
27. 2026-05-10 21:46:12: Implemented a `Materials-4 / Phase 5` follow-up that adds a compact Project materials search field between the project-material actions and preset list.
26. 2026-05-10 21:41:50: Implemented a `Materials-4 / Phase 5` follow-up so creating or duplicating a project material no longer resets the user-sized project-material list height.
25. 2026-05-10 21:30:48: Implemented and closed `Materials-4 / Phase 5 - Compact Material Action Rail` by moving project-material creation actions into the project-material section and compacting grouped assignment actions.
24. 2026-05-10 21:24:42: Prepped `Materials-4 / Phase 5 - Compact Material Action Rail` for implementation against the live project-material preset section, large material action cards, grouped assignment cards, and existing owner-routed material history tests.
23. 2026-05-10 21:20:36: Implemented a `Materials-4 / Phase 4.1` default-color follow-up so zero-intensity default material presets now seed emissive color as white while keeping emissive intensity at zero.
22. 2026-05-10 21:15:15: Implemented and closed `Materials-4 / Phase 4.1 - Reusable Material Color Control Template` by extracting the expanded base-color picker into a reusable selected-material color control and applying it to emissive color.
21. 2026-05-10 21:09:59: Prepped `Materials-4 / Phase 4.1 - Reusable Material Color Control Template` for implementation against the live inline base-color block, emissive color row, HSV/RGB helpers, and selected-material history update path.
20. 2026-05-10 21:07:06: Added `Materials-4 / Phase 4.1 - Reusable Material Color Control Template` as the follow-up that should extract the expanded color picker behavior and reuse it for emissive color before Phase 5 action cleanup.
19. 2026-05-10 21:00:47: Tuned the `Materials-4 / Phase 4` hue follow-up so the rainbow track uses muted theme-fit color stops, a subtle dark overlay, and an inset track shadow instead of full-saturation picker colors.
18. 2026-05-10 20:56:30: Implemented a `Materials-4 / Phase 4` hue follow-up that adds a `Hue` `ParaSlider` to the expanded base-color controls with a scoped rainbow track while preserving the hex material color owner.
17. 2026-05-10 20:48:46: Updated the `Materials-4 / Phase 4` base-color follow-up so the expanded color controls use HSV-style `Saturation` and `Brightness` sliders instead of a HSL lightness `White/Black` slider.
16. 2026-05-10 20:43:29: Implemented a `Materials-4 / Phase 4` base-color follow-up so the compact `Base color` row can expand into RGB `ParaSlider` controls plus a black-to-white lightness slider while keeping the native color picker available.
15. 2026-05-10 20:32:46: Implemented a `Materials-4 / Phase 4` styling follow-up so selected-material `ParaSlider` and `ParaSelect` rows opt into the same compact cap, track, fill, marker, and typography treatment as the view toolbar controls.
14. 2026-05-10 20:27:17: Implemented and closed `Materials-4 / Phase 4 - Inline Material Source And Compact Control Layout` with compact selected-material controls, inline material-source badge, and shared `ParaSlider` / `ParaSelect` control usage.
13. 2026-05-10 20:19:31: Prepped `Materials-4 / Phase 4 - Inline Material Source And Compact Control Layout` for implementation against the live selected-material row-card controls, shared `ParaSlider` / `ParaSelect` components, and the existing material-history update path.
12. 2026-05-10 20:17:16: Added the Phase 5 action-placement rule that `New Material` and `Duplicate Material` should move into the `Project materials` section because they create project material presets, while grouped target assignment remains scoped to material targets.
11. 2026-05-10 20:10:33: Added the Phase 4 control-language rule that compact selected-material controls should use existing `ParaSlider` and `ParaSelect` controls where they fit instead of inventing one-off native input styling.
10. 2026-05-10 20:04:14: Implemented and closed `Materials-4 / Phase 3 - Project Material Preset List` with a compact project-material list under material targets, row assignment through existing material history, and removal of the duplicate assign dropdown row.
9. 2026-05-10 19:56:36: Prepped `Materials-4 / Phase 3 - Project Material Preset List` for implementation against the existing `ViewSettings['materials'].presets`, `assignMaterialPresetToPartWithHistory(...)`, and current assign-dropdown UI seam.
8. 2026-05-10 19:49:03: Recast `Materials-4 / Phase 3` from an inline source-badge cleanup into a project material preset list under the material targets, moving the source-badge cleanup into the later compact-control phase.
7. 2026-05-10 19:37:23: Tightened the `Materials-4 / Phase 2` scroll-list sizing follow-up so focused-object and material-target lists default to about three rows while shrinking to one or two rows when fewer items exist.
6. 2026-05-10 19:33:33: Added the `Materials-4 / Phase 2` focused-list follow-up so the focused-object list now uses the same dark-scrollbar and bottom-resize shell as the material target list.
5. 2026-05-10 18:02:49: Implemented and closed `Materials-4 / Phase 2 - Focused Item List And Target Header Simplification` with a shared-selection focused-object list, active object switching, and cleaner material-target copy.
4. 2026-05-10 17:58:23: Prepped `Materials-4 / Phase 2 - Focused Item List And Target Header Simplification` for implementation as a shared-selection object list that preserves multi-select rows while changing the active Materials object.
3. 2026-05-10 17:50:11: Implemented and closed `Materials-4 / Phase 1 - Diagnostic And Reference-Proof Row Removal` by removing the bottom owner-seam and reference-baseline proof sections from the ready Materials UI while preserving the material editor, target list, actions, and resize behavior.
2. 2026-05-10 17:48:01: Prepped `Materials-4 / Phase 1 - Diagnostic And Reference-Proof Row Removal` for implementation by grounding it in the live bottom `viewModel.rows` owner-seam block, the `viewModel.owedFeatureGroups` reference-baseline block, and the existing Properties surface assertions that should flip from proving those labels are present to proving they are absent.
1. 2026-05-10 17:44:31: Created this `Materials-4` cleanup family phase doc to turn the open-ended simplification direction into a concrete phased ladder for removing diagnostic/proof rows, simplifying focused-object and target headers, compressing material-source display, tightening material controls, and compacting action flows toward the older Materials window inspiration.

### Purpose

This doc owns the next user-facing Materials content cleanup after the first hosted Materials editing and richer-field loops shipped.

Use it to answer:
- which visible Materials content should remain for normal users
- which phase-proof or diagnostic rows should leave the ready UI
- how the hosted Materials lane should move closer to the older compact material editor inspiration
- how to simplify layout without moving material truth into the workspace panel

Do not use it for:
- adding new material owner fields
- adding texture asset storage, external material-library browsing, or shader graph behavior
- changing material assignment semantics beyond presenting the existing project preset assignment path
- moving material truth out of `ViewSettings['materials']`, `MaterialPreset`, or material history

## Doc Body

### Short Version

`Materials-4` is a cleanup and presentation pass.

The goal is to make the ready Materials panel feel like a simple material editor:
- focused object list
- material targets list
- project material preset list for applying existing project materials to the selected target
- selected material controls
- compact material actions
- no visible implementation proof scaffolding

The first slices should remove developer/proof content before changing control layout. The later slices can then compress the still-useful controls into a layout closer to the older Materials screenshot.

### Current Live Read

Already cleaned up before this doc:
- the material target list is compact and scrollable
- the list uses a Catalog-style dark scrollbar
- the list height can be resized from the bottom edge
- the separate selected-target summary row was removed
- the ready-state Properties shell contract block was removed
- the top `Materials-2 / Phase 3` proof header was removed
- the bottom `Materials owner seam read` diagnostic block was removed
- the bottom `Reference Baseline` / `Old window capability still owed` block was removed
- the static focused-item header was replaced by a compact focused-object list
- the focused-object list now uses a dark scrollbar and bottom resize handle like the material target list
- both focused-object and material-target lists now default to about three rows and shrink for one-row or two-row selections
- material-target copy was simplified away from `Object Part` and implementation-source explanations

Still too noisy:
- applying an existing project material is still hidden behind a form-style assign dropdown instead of a visible material list
- `Material source` is still a full row instead of compact context
- controls and actions still use large explanatory cards

### Cleanup Rules

1. Keep behavior stable unless the phase explicitly says otherwise.
2. Prefer hiding or compressing proof/debug content over changing owner state.
3. Preserve test coverage for material selection, editing, assignment, grouped assignment, history, and target-list resize.
4. Keep internal ids available in metadata where useful, but do not make them primary visible copy.
5. Do not add new material fields or storage owners while simplifying layout.
6. A visible project material list may replace the current assign dropdown, but it must use the existing `ViewSettings['materials'].presets` and material-history assignment path.

### Likely Files

- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/theme/surfaces/settings.css`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`

### `Materials-4 / Phase 1`

- [x] Remove bottom diagnostic/proof sections from the ready Materials UI.
- [x] Keep empty and unsupported shell states intact.
- [x] Preserve runtime material selection, edit, assignment, grouped assignment, and resize behavior.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-4 / Phase 2`

- [x] Add a compact focused-item object list that can represent one or many selected objects.
- [x] Let choosing a focused item update the active Materials content area.
- [x] Preserve the shared multi-selection list instead of collapsing it to one item when a row is chosen.
- [x] Simplify material-target visible copy.
- [x] Hide long internal ids from primary visible text while preserving stable metadata.
- [x] Rename `Object Part` style copy into plain user-facing material-target wording.
- [x] Remove implementation explanation text about authored part keys and reference rows from the normal ready UI.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-4 / Phase 3`

- [x] Add a compact project material preset list under the material targets.
- [x] Source rows from the existing `ViewSettings['materials'].presets` project material owner.
- [x] Let choosing a preset assign it to the currently selected material target through the existing material history path.
- [x] Keep the selected material editor updated after a list assignment.
- [x] Replace or visually absorb the current `Assign material preset` dropdown without changing assignment semantics.
- [x] Keep the source-state read available for a later compact badge pass.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-4 / Phase 4`

- [ ] Compress `Material source` from a full row into a small badge or inline label near the selected material name.
- [ ] Keep the source visible enough to explain selected preset, per-part assignment, and fallback reads.
- [ ] Preserve `data-selected-material-read-source` and test visibility for source-state proof.
- [ ] Convert selected-material property controls from large explanatory rows into compact editor controls.
- [ ] Keep name, color, metalness, roughness, opacity, emissive, transparency, and double-sided editable.
- [ ] Preserve history-wrapped `updateResolvedPreset(...)` behavior.
- [ ] Keep controls accessible with stable labels.
- [ ] `Materials-Gen1-HLG-2`
- [ ] `Materials-Gen1-HLG-3`

### `Materials-4 / Phase 4.1`

- [x] Extract the expanded `Base color` row into a reusable material color-control template.
- [x] Reuse the template for `Base color`.
- [x] Reuse the template for `Emissive color`.
- [x] Keep native color picker, `Hue`, `Saturation`, `Brightness`, and `R/G/B` controls available in the template.
- [x] Preserve the muted hue-track styling and compact Para control shell.
- [x] Preserve `updateResolvedPreset(...)` as the write path for both `color` and `emissive`.
- [x] Avoid changing `MaterialPreset` shape, material history semantics, viewer consumption, or material assignment behavior.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-4 / Phase 5`

- [x] Convert material actions from large cards into compact action controls.
- [x] Keep `New Material`, assign preset, duplicate, all, odds, and evens flows.
- [x] Preserve disabled states when no selected target or material preset is available.
- [x] Keep grouped assignment behavior downstream from the current target rows.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

## [x] `Materials-4 / Phase 1` - `Diagnostic And Reference-Proof Row Removal`

### Phase 1 Summary

Remove the remaining bottom proof/debug content from the ready Materials panel.

This phase should make the normal UI stop showing:
- `Materials owner seam read`
- `Material truth source`
- `Mutation and history seam`
- `Viewer consumer seam`
- `Target discovery status`
- `Reference Baseline`
- `Old window capability still owed`

### Owns

- removing ready-state diagnostic/proof sections from visible Materials content
- preserving behavior and tests for the real material editor
- keeping shell empty and unsupported states visible where they are still useful

### Does Not Own

- focused-object header rewrite
- target header wording rewrite
- compacting controls or actions
- changing material owner state

### Implementation Direction

Remove the rendered diagnostic and owed-feature groups from `PropertiesMaterialsSectionContent.tsx`.

Update `PropertiesSurface.test.tsx` so it proves those proof labels are absent in the ready Materials UI while still proving the real target list, controls, actions, and history behavior remain.

Exact removal targets:
- remove the `SettingsSurfaceRowList` with `aria-label="Materials owner seam read"` that maps `viewModel.rows`
- remove the `SettingsSurfaceGroup` with `aria-label="Materials follow-on baseline"` that maps `viewModel.owedFeatureGroups`

Exact test update:
- replace ready-state expectations that currently require `Material truth source`, `uiPrefsStore + materialEditHistory`, `1 target row projected`, and `Old window capability still owed`
- add absence checks for those proof labels
- keep all existing checks for material target list, selected material fields, actions, grouped actions, target-list resize, and material edit behavior

Do not remove or change:
- `buildMaterialsPhase1ViewModel(...)` rows or owed-feature data generation yet; those can remain model-level proof data until a later internal cleanup decides whether they are unused
- empty shell state
- unsupported shell state
- material target list
- selected material editor controls
- material action and grouped-action behavior

### Prepared Implementation Read

`Phase 1` is ready to implement.

This should be a small UI cleanup pass:
1. Remove the two bottom proof sections from `PropertiesMaterialsSectionContent.tsx`.
2. Update `PropertiesSurface.test.tsx` to assert those labels are absent while retaining behavior checks.
3. Run the focused Properties surface test.
4. Run the production build.
5. Record the implementation in `docs/CHANGELOG.md` and `docs/Doc-Log.md`.

### Verification Shape

- focused Properties surface test
- production build
- `docs/CHANGELOG.md` entry
- `docs/Doc-Log.md` entry

### Implementation Result

- Removed the rendered `viewModel.rows` owner-seam proof block from the ready Materials UI.
- Removed the rendered `viewModel.owedFeatureGroups` reference-baseline block from the ready Materials UI.
- Updated the Properties surface regression to prove those proof labels and regions are absent while the material editor controls and action flows remain covered.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`; `npm.cmd run build`.

## [x] `Materials-4 / Phase 2` - `Focused Item List And Target Header Simplification`

### Phase 2 Summary

Make the top of the Materials panel behave like a user-facing focused-object picker instead of a static contract header.

When the shared workspace selection contains multiple selected objects, Materials should show those objects in a compact `Focused items` list. The selected row in that list is the active object feeding the material target list and selected-material editor. Choosing another object should switch the active Materials read to that object without deleting the wider multi-selection set.

### Owns

- adding a compact focused-item list above the Materials content area
- deriving the list from shared workspace selection, especially `workspaceSelection.explicitSelectedTargets`
- letting the user choose the active Materials object from that list
- preserving the shared multi-selection list when the active object changes
- simplifying material-target section label and summary
- hiding long internal ids from primary visible text
- preserving internal ids in metadata where tests or debugging still need them

### Does Not Own

- removing bottom diagnostics already owned by Phase 1
- changing Browser or viewer selection gestures
- adding a new Materials-only selection owner
- control layout compression
- action layout compression

### Implementation Direction

Use the existing shared selection seams:
- read `workspaceSelection.selectedTarget`
- read `workspaceSelection.explicitSelectedTargets`
- write active-object changes through `setWorkspaceExplicitSelection(...)` when there is an existing explicit multi-selection, preserving the same `explicitSelectedTargets`
- fall back to `setWorkspaceSelectedTarget(...)` only for a normal single-object selection path

The focused-item list should:
- render only object targets that Materials can inspect in this phase
- show one row when only one object is selected
- show multiple rows when multiple objects are selected
- mark the active object row with stable metadata such as `data-properties-focused-object-active="true"`
- preserve object ids in attributes or button titles, not as primary visible text
- use user-facing labels from project content or imported-reference labels where available

Choosing a row should:
- update `workspaceSelection.selectedTarget` to that object
- keep `workspaceSelection.explicitSelectedTargets` populated with the original selected object set
- cause the existing Materials content body to re-render against the newly active object
- keep lane-local selected material target behavior scoped to the active object

Prefer copy like:
- `Focused items`
- user-facing file or object label
- `Material targets`
- `31 parts`

Avoid copy like:
- `Object Part`
- long reference row ids
- implementation explanations about target-row source ownership

Exact implementation candidates:
- in `PropertiesSurface.tsx`, build a focused-object list from `workspaceSelection.explicitSelectedTargets` plus the current `selectedTarget` fallback
- in `PropertiesSurface.tsx`, replace the static `Focused Item` header detail with the focused-item list
- in `PropertiesMaterialsSectionContent.tsx`, rename the target group eyebrow/copy from implementation-facing object-part wording to `Material targets` copy
- in `PropertiesSurface.test.tsx`, add a multi-object selection case proving the focused-item list stays populated and clicking the second row changes the active Materials content

Do not change:
- material target row discovery rules
- per-part material assignment semantics
- grouped material action semantics
- material edit history behavior
- the later `Material source` row, which now belongs to Phase 4

### Prepared Implementation Read

`Phase 2` is ready to implement.

This should be a shared-selection presentation pass:
1. Add the focused-item list in `PropertiesSurface.tsx`.
2. Preserve multi-selection by using `setWorkspaceExplicitSelection(...)` when choosing among explicit selected objects.
3. Simplify the material-target header wording in `PropertiesMaterialsSectionContent.tsx`.
4. Update `PropertiesSurface.test.tsx` for the single-object clean copy and multi-object focused-item switching behavior.
5. Run the focused Properties surface test.
6. Run the production build.
7. Record the implementation in `docs/CHANGELOG.md` and `docs/Doc-Log.md`.

### Verification Shape

- focused Properties surface test for visible copy and metadata
- focused Properties surface test for multi-selected object list switching
- production build
- changelog and doc-log entries

### Implementation Result

- Added a compact `Focused items` object list in the Properties shell.
- Matched the focused-object list shell to the material target list with dark scrolling and bottom-edge resize behavior.
- Set both scroll lists to derive their default height from item count: one row for one item, two rows for two items, and about three rows for larger lists.
- The list is sourced from shared workspace selection and falls back to the active selected object for single-object selection.
- Clicking a focused-object row switches `workspaceSelection.selectedTarget` while preserving the existing `explicitSelectedTargets` list during multi-selection.
- Simplified material target row labels/details and the material-target header copy.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts`; `npm.cmd run build`.

## [x] `Materials-4 / Phase 3` - `Project Material Preset List`

### Phase 3 Summary

Add a visible project material list under the material targets so users can apply existing project materials without hunting through a dropdown.

This is still a focused-object workflow, not a full material-library browser. The list should show the current project's `MaterialPreset[]` entries and apply the chosen preset to the currently selected object part or fallback whole-object target.

### Owns

- rendering a compact project material preset list below the material target list
- sourcing rows from `ViewSettings['materials'].presets`
- selecting/applying a preset to the current material target through the existing material history assignment path
- updating the selected material read and editor after assignment
- keeping the current assign-dropdown capability either replaced by or visually absorbed into the new list

### Does Not Own

- external library browsing
- new material storage owners
- texture asset or shader graph work
- changing selected target state
- changing assignment semantics
- compacting the full selected-material editor layout

### Implementation Direction

Place the project material list directly after `Material targets`.

Each row should read as a material choice, not an implementation proof row:
- material name as the primary label
- compact color/surface hint if the current UI can expose it cleanly
- active state when that preset is the resolved material for the selected target

Choosing a row should reuse the same owner-routed path as the current `Assign material preset` control:
- assign to the selected material target
- enable per-part material state where needed
- preserve undo/history behavior
- update the selected material editor to the chosen preset

The list should default to a compact height like the focused-object and target lists, with dark scrolling if the project has more materials than fit.

### Prepared Implementation Read

`Phase 3` is ready to implement.

The implementation should promote the existing assignment dropdown behavior into a visible project material preset list, without changing material ownership or assignment semantics.

Live code seams:
- `PropertiesMaterialsSectionContent.tsx` already receives `materials` from `useUiPrefsStore((state) => state.view.materials)`.
- `materials.presets` is the current project-visible preset list and should be the Phase 3 row source.
- `selectedTarget`, `selectedMaterialRead`, and `selectedMaterialPreset` already resolve the active target and active material read.
- `handleAssignMaterial(presetId)` already calls `assignMaterialPresetToPartWithHistory(...)` with the selected target part key.
- `assignMaterialPresetToPartWithHistory(...)` already enables per-part material state and assigns the preset through one history-wrapped action.

Implementation direction:
1. Add a compact `Project materials` list directly after the `Material targets` section and before `Selected material properties`.
2. Render one row per `materials.presets` entry.
3. Mark the row active when its preset id matches `selectedMaterialPreset?.id`.
4. Clicking a row should call the existing `handleAssignMaterial(preset.id)`.
5. Disable or no-op row assignment when there is no selected material target.
6. Use the same compact scroll-list shell direction as the focused-object and material-target lists: dark scrollbar, about three rows by default, shrink for one or two presets, and bottom resize if implementation scope stays small enough.
7. Remove or visually absorb the current `Assign Material` dropdown row from the large action list so there is not a duplicate assignment control.
8. Preserve `New Material`, `Duplicate Material`, and grouped all/odds/evens actions.

Suggested row content:
- material name
- small color swatch using `preset.color`
- compact secondary hint from current fields such as metalness, roughness, opacity, or `Double-sided` only if it stays readable

Suggested data/test hooks:
- `data-project-material-list="compact"`
- `data-project-material-row={preset.id}`
- `data-project-material-selected={isActive}`
- accessible list label: `Project material presets`
- row button labels should include the material name

Do not change:
- `ViewSettings['materials']` shape
- `MaterialPreset` fields
- selected target state
- target-row discovery
- per-part assignment behavior
- material history snapshot semantics
- viewer material consumption
- external material-library, texture, or shader ownership

### Verification Shape

- focused Properties surface tests prove project material rows render from presets
- choosing a project material row assigns it to the selected target through material history
- existing create, assign, duplicate, all, odds, and evens tests continue to pass or are adjusted to the new list UI
- production build
- changelog and doc-log entries

### Implementation Result

- Added a compact `Project materials` preset list under `Material targets`, sourced from `ViewSettings['materials'].presets`.
- Added project-material row state, color swatches, active-row markers, dark scroll behavior, and a bottom resize handle matching the other Materials lists.
- Reused `handleAssignMaterial(...)` and `assignMaterialPresetToPartWithHistory(...)` so clicking a preset row assigns it to the selected material target through existing history-wrapped material ownership.
- Removed the duplicate large `Assign Material` dropdown row from the material action area while preserving `New Material`, duplicate, and grouped assignment actions.
- Updated Properties surface coverage for preset rows, selected state, list resize behavior, project-material assignment, and whole imported object fallback assignment.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts`; `npm.cmd run build`.

## [x] `Materials-4 / Phase 4` - `Inline Material Source And Compact Control Layout`

### Phase 4 Summary

Compress the selected material source and editor controls so they feel like a tool panel, not a list of explanatory cards.

### Owns

- moving material source into a compact badge or inline label near the selected material name
- compact visual layout for material fields
- using existing `ParaSlider` and `ParaSelect` controls where they fit the field type and interaction
- preserving all shipped editable fields
- preserving accessible labels and history-wrapped writes

### Does Not Own

- adding new material fields
- texture, library, or shader work
- action rail redesign

### Implementation Direction

The selected-material header should be able to read like:
- `Default Matte` with `Selected preset`
- `Brushed Metal` with `Per-part assignment`
- fallback read with an honest fallback badge

Group controls into compact rows or fields:
- name
- base color
- metalness and roughness as `ParaSlider` candidates
- opacity as a `ParaSlider` candidate
- emissive color and intensity
- transparency and double-sided toggles, using `ParaSelect` where the boolean choice reads better as an explicit mode

Control-language rule:
- prefer existing shared `ParaSlider` controls for scalar material values such as metalness, roughness, opacity, and emissive intensity when the commit/history boundary can stay clean
- prefer existing shared `ParaSelect` controls for small discrete material choices when they read better than a raw checkbox or native select
- keep native text and color inputs only where there is not yet a suitable Para control or where replacing them would widen the phase

### Prepared Implementation Read

`Phase 4` is ready to implement.

The implementation should make the selected-material editor read like a compact tool panel while preserving the current material owner, assignment, and history behavior.

Live code seams:
- `PropertiesMaterialsSectionContent.tsx` owns the selected-material header, material-source row, and editable material control rows.
- `selectedMaterialRead.sourceLabel` is the source text currently rendered as the full `Material source` row.
- `selectedMaterialPreset` is the resolved editable preset.
- `updateResolvedPreset(patch)` already routes writes through `updateMaterialPresetWithHistory(...)`.
- `ParaSlider` exists at `src/app/components/ParaSlider.tsx`.
- `ParaSelect` exists at `src/app/components/ParaSelect.tsx`.

Implementation direction:
1. Import and use `ParaSlider` / `ParaSelect` in `PropertiesMaterialsSectionContent.tsx`.
2. Move the visible `Material source` read out of its full row and into compact selected-material header context, as a badge or inline label next to the selected material name.
3. Preserve `data-selected-material-read-source` and `data-selected-material-read-status` on the selected-material control container.
4. Replace the large explanatory `SettingsSurfaceRowCard` control presentation with a compact selected-material editor shell.
5. Convert scalar fields to `ParaSlider` where practical:
   - metalness: `0..1`, step `0.01`, percentage display
   - roughness: `0..1`, step `0.01`, percentage display
   - opacity: `0..1`, step `0.01`, percentage display
   - emissive intensity: `0..2`, step `0.01`, percentage-style display matching the current field
6. Convert discrete mode fields to `ParaSelect` where practical:
   - transparency: `Opaque` / `Transparent`
   - double-sided rendering: `Front-sided` / `Double-sided`
7. Keep native text/color inputs for material name, base color, and emissive color in this phase unless a suitable existing Para control already fits without widening scope.
8. Keep `updateResolvedPreset(...)` as the write path so material history behavior remains owner-routed.
9. Do not move `New Material`, `Duplicate Material`, or grouped target assignment controls in Phase 4; those are Phase 5.

History boundary note:
- Phase 4 may preserve the current immediate update behavior for material field edits while changing presentation.
- Do not introduce a new material draft owner just to get `ParaSlider.onChangeEnd` batching in this phase.
- If a future pass wants cleaner one-entry slider commits, plan it separately against the material-history snapshot seam.

Suggested data/test hooks:
- `data-selected-material-editor="compact"`
- `data-selected-material-source-badge={selectedMaterialRead.source}`
- `data-selected-material-control={fieldId}`

Do not change:
- `ViewSettings['materials']` shape
- `MaterialPreset` fields
- selected target state
- project-material preset list behavior
- material assignment actions
- grouped assignment behavior
- viewer material consumption
- external material-library, texture, or shader ownership

### Verification Shape

- selected material read tests prove `per-part`, selected preset, and fallback source still route correctly
- existing edit-history material control tests continue to pass
- tests prove `ParaSlider` / `ParaSelect` use where Phase 4 adopts those controls
- targeted DOM proof for compact editor shell
- tests prove the old full `Material source` row is gone while source data remains available
- production build
- changelog and doc-log entries

### Implementation Result

- Replaced the selected-material row-card editor with a compact `PropertiesSelectedMaterialEditor` shell.
- Moved the visible material-source read from a full `Material source` row into an inline source badge while preserving `data-selected-material-read-source`, `data-selected-material-read-status`, and compact source-badge hooks.
- Reused `ParaSlider` for metalness, roughness, opacity, and emissive intensity with the existing history-wrapped material update path.
- Reused `ParaSelect` for transparency and rendering side mode so the boolean choices read as explicit material modes.
- Kept material name, base color, and emissive color as native controls for this phase.
- Preserved project-material list behavior, material actions, grouped assignment actions, target state, material owner shape, and viewer consumption.
- Updated Properties surface coverage for the compact selected-material editor, source badge, selected material controls, Para control-backed editing, and source-read preservation.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts`; `npm.cmd run build`.

### Phase 4 Styling Follow-Up

- Tightened the selected-material `ParaSlider` and `ParaSelect` CSS scope so the controls inherit the view-toolbar-style cap sizing, track borders, fill treatment, marker styling, and compact 10px typography.
- Kept the follow-up styling-only; material ownership, field behavior, history writes, target selection, project-material assignment, and action placement are unchanged.

### Phase 4 Base Color Follow-Up

- Changed the compact `Base color` row into an expandable row with a chevron toggle.
- Kept the native base-color picker in the collapsed row for direct color selection.
- Added a `Hue` `ParaSlider` with a scoped rainbow track so the expanded color controls expose the color-family strip from the native picker.
- Tuned the hue track with muted color stops and a dark overlay so it fits the Materials panel theme instead of using raw full-saturation picker colors.
- Added `Saturation` and `Brightness` `ParaSlider` controls that map to the same HSV-style dimensions exposed by the native color picker's top square.
- Added expanded RGB `ParaSlider` controls for red, green, and blue channels.
- Preserved the existing `updateMaterialPresetWithHistory(...)` route through `updateResolvedPreset(...)`.

## [x] `Materials-4 / Phase 4.1` - `Reusable Material Color Control Template`

### Phase 4.1 Summary

Turn the now-good base-color picker into a reusable selected-material color-control template, then apply that same template to emissive color.

### Owns

- extracting the expanded color-control behavior from the inline `Base color` row
- reusing the extracted control for `Base color`
- reusing the extracted control for `Emissive color`
- preserving native color input plus `Hue`, `Saturation`, `Brightness`, and `R/G/B` ParaSlider controls
- preserving the muted hue-track styling
- preserving history-wrapped writes through `updateResolvedPreset(...)`

### Does Not Own

- changing `MaterialPreset` shape
- adding new color fields
- changing `emissiveIntensity`
- adding texture, shader, or library behavior
- moving material actions

### Implementation Direction

Create one local reusable color-control component or helper in the Materials selected-material editor boundary. The component should receive:
- stable `id` used for data hooks
- visible `label`
- current hex `value`
- `isExpanded`
- `onExpandedChange`
- `onChange(nextHexColor)`

Use it for:
- `Base color`, writing `{ color: nextHexColor }`
- `Emissive color`, writing `{ emissive: nextHexColor }`

Keep current helper behavior:
- hex to RGB
- RGB to HSV
- HSV to RGB
- RGB to hex
- hue as `0..360`
- saturation and brightness as `0..1`
- RGB channels as `0..255`

Expected data hooks:
- `data-selected-material-control="color"`
- `data-selected-material-control="emissive"`
- `data-selected-material-color-control="hue"`
- `data-selected-material-color-control="saturation"`
- `data-selected-material-color-control="brightness"`
- `data-selected-material-color-control="red"`
- `data-selected-material-color-control="green"`
- `data-selected-material-color-control="blue"`

For duplicate hook groups, scope test queries under the relevant color control container instead of expecting page-wide uniqueness.

### Prepared Implementation Read

`Phase 4.1` is ready to implement.

Live code seams:
- `PropertiesMaterialsSectionContent.tsx` currently owns the inline expanded `Base color` row, `isBaseColorExpanded`, `selectedBaseColorRgb`, `selectedBaseColorHsv`, and `updateBaseColor*` helpers.
- `Emissive color` is currently still a simple native color input row that writes `{ emissive: event.currentTarget.value }`.
- Existing color helpers already cover hex parsing, RGB formatting, hue formatting, RGB-to-HSV, HSV-to-RGB, and RGB-to-hex conversion.
- Existing selected-material writes must keep routing through `updateResolvedPreset(...)`, which wraps `updateMaterialPresetWithHistory(...)`.
- Current CSS already styles `.PropertiesSelectedMaterialField--expandable`, `.PropertiesSelectedMaterialColorSliders`, `.PropertiesSelectedMaterialControl`, and the muted hue track scoped by `data-selected-material-color-control="hue"`.

Implementation direction:
1. Extract the inline base-color expanded row into a local reusable component in `PropertiesMaterialsSectionContent.tsx`, unless the file becomes too large and a nearby component file is clearly better.
2. Suggested component name: `MaterialColorControl`.
3. Suggested props:
   - `id: 'color' | 'emissive'`
   - `label: string`
   - `value: string`
   - `isExpanded: boolean`
   - `onExpandedChange: (nextExpanded: boolean) => void`
   - `onChange: (nextHexColor: string) => void`
   - `nativeInputLabel: string`
   - `expandButtonLabel: string`
   - `expandedControlsLabel: string`
4. Move the color-specific derived state into the reusable component:
   - `rgb = parseHexColor(value)`
   - `hsv = rgbToHsv(rgb)`
   - RGB channel updates call `onChange(rgbToHex(...))`
   - Hue, saturation, and brightness updates call `onChange(rgbToHex(hsvToRgb(...)))`
5. Add `isEmissiveColorExpanded` state next to `isBaseColorExpanded`.
6. Render `MaterialColorControl` for base color:
   - `id="color"`
   - `label="Base color"`
   - `value={selectedMaterialPreset.color}`
   - `onChange={(color) => updateResolvedPreset({ color })}`
7. Render `MaterialColorControl` for emissive color:
   - `id="emissive"`
   - `label="Emissive color"`
   - `value={selectedMaterialPreset.emissive}`
   - `onChange={(emissive) => updateResolvedPreset({ emissive })}`
8. Remove the old base-color-only derived state and `updateBaseColor*` helpers from the parent once the component owns them.
9. Keep the existing CSS selectors and styling; add only narrow selectors if the reusable component needs a stable wrapper hook.

Do not change:
- `MaterialPreset` fields
- material history semantics
- selected target state
- project-material assignment behavior
- grouped assignment behavior
- viewer material consumption
- `emissiveIntensity`
- Phase 5 action placement

Test direction:
- Update the existing selected-material edit test so base-color color controls are queried under `[data-selected-material-control="color"]`.
- Add coverage that `[data-selected-material-control="emissive"]` has its own expand button, expanded controls, and hue/saturation/brightness/RGB rows.
- Add an interaction assertion that changing emissive through one expanded slider updates `default_matte.emissive` through material history.
- Keep the native color input checks for both base color and emissive color.

### Verification Shape

- tests prove base color still expands and updates through material history
- tests prove emissive color now expands and updates through material history
- tests prove both color controls expose Hue, Saturation, Brightness, and RGB rows
- existing selected-material edit tests continue to pass
- production build
- changelog and doc-log entries

### Implementation Result

- Added a local `MaterialColorControl` template in `PropertiesMaterialsSectionContent.tsx`.
- Moved RGB/HSV derived state and channel update helpers into the reusable color-control boundary.
- Replaced the inline `Base color` block with `MaterialColorControl`.
- Replaced the simple `Emissive color` row with the same expandable `MaterialColorControl`.
- Preserved native color inputs, Hue, Saturation, Brightness, R, G, and B sliders for both color fields.
- Preserved `updateResolvedPreset(...)` writes for both `color` and `emissive`.
- Updated Properties surface coverage so base color and emissive color each prove their expanded controls and history-backed updates.
- Follow-up: changed the zero-intensity default material preset emissive colors from black to white, including the viewer fallback and no-base new-preset fallback, so the Emissive color control opens on white by default without making materials glow.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts`; `npm.cmd run build`.

## [x] `Materials-4 / Phase 5` - `Compact Material Action Rail`

### Phase 5 Summary

Compress the material actions so they stop reading like explanatory cards.

### Owns

- compact action rail or action group for new, assign, duplicate, all, odds, and evens
- moving `New Material` / add material and `Duplicate Material` into the `Project materials` section as compact project-material actions
- keeping grouped all, odds, and evens assignment controls near the target-assignment workflow
- preserving owner-routed material history actions
- preserving disabled states

### Does Not Own

- changing assignment grouping rules
- changing preset ownership
- adding full material-library browsing

### Implementation Direction

Prefer smaller buttons/select controls with clear labels. Keep explanations out of the normal ready UI unless they are needed for disabled state clarity.

Action-placement direction:
- `New Material` / add material belongs in `Project materials` because it creates a project material preset and assigns it to the selected target
- `Duplicate Material` belongs in `Project materials` because it creates another project material preset from the current material and assigns the copy
- grouped all, odds, and evens assignment can remain near the target or action area because they apply the current resolved material across target rows
- do not leave duplicate large action cards below the selected-material editor once the project-material actions move

### Prepared Implementation Read

`Phase 5` is ready to implement.

Live code seams:
- `PropertiesMaterialsSectionContent.tsx` currently renders the `Project materials` section before `Selected material properties`.
- Project-material rows already call `handleAssignMaterial(preset.id)` through the existing `assignMaterialPresetToPartWithHistory(...)` path.
- `handleNewMaterial()` already calls `createAndAssignMaterialPresetWithHistory(...)` and creates a real project material preset assigned to the selected target.
- `handleDuplicateMaterial()` already calls `duplicateMaterialPresetForPartWithHistory(...)` and creates a real copied project material preset assigned to the selected target.
- `canRunMaterialAction` already captures the disabled state for `New Material` and `Duplicate Material`.
- The current large action cards live under `aria-label="Material actions"` inside the `Selected material properties` section and expose `data-material-action="New Material"` and `data-material-action="Duplicate Material"`.
- Grouped all/odds/evens actions currently live under `aria-label="Grouped material actions"` and expose `data-material-group-action`.
- Existing tests already prove creation, project-row assignment, duplication, grouped even assignment, grouped odd assignment, and history labels.

Implementation direction:
1. Add a compact project-material action strip inside the `Project materials` section, close to the preset list header or directly above the preset rows.
2. Move `New Material` and `Duplicate Material` buttons into that strip.
3. Keep their current `data-material-action` hooks, click handlers, disabled behavior, and accessible names.
4. Remove the large `aria-label="Material actions"` row-card block from below the selected-material editor.
5. Keep the visible project-material preset list assignment behavior unchanged.
6. Convert grouped all/odds/evens assignment cards into a compact grouped action strip near the target-assignment workflow.
7. Keep grouped action hooks, labels, handlers, disabled states, target counts, and history labels unchanged.
8. Add only narrow CSS under `settings.css` for compact action rails/buttons, reusing the existing dark Materials control tone.

Do not change:
- material preset ownership
- material assignment semantics
- grouped assignment rules
- material history labels
- selected target state
- selected-material editor fields
- project material row behavior
- material library or texture scope

Test direction:
- Update the ready Materials test so `New Material` and `Duplicate Material` are found inside `aria-label="Project material actions"`.
- Assert the old `aria-label="Material actions"` large row-card block is absent.
- Keep the existing create/assign/duplicate test, but query the moved buttons from the project-material action region.
- Keep grouped assignment behavior tests, but query all/odds/evens from the compact grouped action region.
- Keep the expectation that the old `Assign Material` dropdown copy stays absent.

### Verification Shape

- existing create, assign, duplicate, all, odds, and evens tests continue to pass
- tests prove `New Material` and `Duplicate Material` are available from the `Project materials` section
- production build
- changelog and doc-log entries

### Implementation Result

- Added a compact `Project material actions` rail inside the `Project materials` section.
- Moved `New Material` and `Duplicate Material` into that rail while preserving their `data-material-action` hooks, click handlers, disabled state, and history behavior.
- Removed the old large `Material actions` row-card block from below the selected-material editor.
- Replaced grouped all/odds/evens row cards with a compact `Grouped material actions` rail while preserving `data-material-group-action` hooks, labels, target counts, disabled state, and history labels.
- Kept project material row assignment unchanged.
- Added scoped Materials action-rail styling in `settings.css`.
- Updated Properties surface tests to query the moved project-material actions and compact grouped action region.
- Follow-up: preserved the current project-material list height when `New Material` or `Duplicate Material` adds presets, so the list does not resize after those actions.
- Follow-up: added a compact Project materials search field below the project-material action rail and above the preset list, filtering visible presets by name or id without changing preset ownership or assignment behavior.
- Follow-up: removed the visible `Search materials` label from that search field while preserving the input's accessible name.
- Verification: `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts`; `npm.cmd run build`.
