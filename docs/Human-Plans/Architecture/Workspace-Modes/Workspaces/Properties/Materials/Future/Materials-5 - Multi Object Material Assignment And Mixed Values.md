# Materials 5 - Multi Object Material Assignment And Mixed Values

## Doc Header

### Doc History
19. 2026-05-11 11:19: Added a `Materials-5 / Phase 2.1` follow-up so focused item row toggles now remove or restore the object from shared Browser/viewport selection while keeping the row pinned in Materials for re-highlighting.
18. 2026-05-11 11:05: Added a `Materials-5 / Phase 2.1` follow-up fix so clicking a focused item row toggles Materials assignment inclusion, preserves the active-detail switch, and keeps excluded rows visually muted instead of resetting on re-render.
17. 2026-05-11 10:40: Updated the `Materials-5 / Phase 4` multi-object project-material list read so every resolved material used by included focused targets highlights in the Project materials list instead of only the first active preset.
16. 2026-05-11 10:33: Updated the `Materials-5 / Phase 4` multi-edit behavior so direct multi-object edits update the resolved materials by default, with an off-by-default `Create new material on multi edit` toggle preserving the copy-and-assign path when needed.
15. 2026-05-11 10:24: Implemented `Materials-5 / Phase 4 - Multi Object Field Editing` by routing direct multi-object field edits through patched per-target preset copies, one undoable material-history entry, and focused scalar/color edit tests.
14. 2026-05-11 10:18: Prepped `Materials-5 / Phase 4 - Multi Object Field Editing` for implementation against the shipped mixed-value read projection, compact editor update handlers, material history snapshot layer, preset creation/assignment helpers, and focused multi-object edit verification seams.
13. 2026-05-11 09:41: Implemented `Materials-5 / Phase 3 - Mixed Selected Material Read` with aggregate selected-material field reads, compact `Multiple values` rendering, and read-only multi-object editor controls ahead of Phase 4 editing.
12. 2026-05-11 09:23: Prepped `Materials-5 / Phase 3 - Mixed Selected Material Read` for implementation against the live assignment scope, selected-material read resolver, compact editor controls, and focused view-model/Properties surface test seams.
11. 2026-05-11 08:33: Added a `Materials-5 / Phase 2.1` follow-up fix so using the focused item `x` on a single selected object clears the mirrored selected part state through the shared workspace selection clear command.
10. 2026-05-11 08:27: Implemented `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics` by splitting the focused-item Properties surface coverage into assignment-only unhighlighting, inactive-row `x` removal, and active-row `x` removal proofs.
9. 2026-05-11 08:22: Prepped `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics` against the live focused-item include/remove controls, assignment-scope handoff, project-material assignment path, and current broad regression test, with the next cut narrowed to explicit semantic proof and any small behavior tightening needed.
8. 2026-05-11 08:17: Added `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics` as the next follow-up phase to lock the two separate focused-item actions: Materials-only inclusion toggling versus true global deselect/removal with the right-anchored `x`.
7. 2026-05-11 07:42: Strengthened the `Materials-5 / Phase 2` focused-item remove proof so the right-anchored `x` button is covered for removing the active focused object from `selectedTarget`, `explicitSelectedTargets`, `selectionAnchorTarget`, and resolved content part keys.
6. 2026-05-11 07:24: Added the `Materials-5 / Phase 2` focused-item inclusion follow-up so focused material objects start highlighted, can be unhighlighted to exclude them from assignment, and can be removed from the focused item list with a right-anchored `x` control.
5. 2026-05-11 07:16: Implemented `Materials-5 / Phase 2 - Project Material Batch Assignment` by routing multi-object project-material row clicks through the Phase 1 `assignmentScope.partKeys` and the existing batch material-history helper while preserving single-object assignment behavior.
4. 2026-05-10 23:08: Prepped `Materials-5 / Phase 2 - Project Material Batch Assignment` for implementation against the shipped Phase 1 `assignmentScope`, the current project-material row click handler, the existing `assignMaterialPresetToPartsWithHistory(...)` batch helper, and focused Properties surface/history verification.
3. 2026-05-10 23:03: Implemented `Materials-5 / Phase 1 - Multi Object Target Read And Assignment Scope` by passing selected object targets through the Properties section context, adding a Materials assignment-scope view-model read, exposing non-visual scope data hooks, and proving the read with focused view-model and Properties surface tests.
2. 2026-05-10 22:36: Prepped `Materials-5 / Phase 1 - Multi Object Target Read And Assignment Scope` for implementation against the live Properties shell context, focused-object list, material target-row helpers, imported-reference fallback rows, and existing material-history batch assignment seam.
1. 2026-05-10 21:55:15: Created this `Materials-5` family phase doc to plan multi-object material application from the Project materials list plus mixed-value selected-material reads when the shared workspace selection contains more than one material-bearing object.

### Purpose

This doc owns the next Materials behavior widening after `Materials-4` finished the compact content cleanup.

Use it to answer:
- how selecting a project material should apply to multiple selected objects
- how the Materials panel should read when selected objects have different material values
- how mixed values should be shown without creating a panel-local material owner
- how multi-object assignment should stay downstream from real material targets and material history

Do not use it for:
- adding a full material library
- adding texture assets, shader graphs, or new material fields
- replacing `ViewSettings['materials']` or material history
- changing Browser or Catalog ownership
- changing non-material workspace selection semantics

## Doc Body

### Short Version

When the user selects multiple objects, Materials should be able to act on that selection as a real batch target.

Main user read:
- if two objects are selected and the user clicks `Brushed Metal`, both objects should receive `Brushed Metal`
- if the selected objects have different material values, selected-material controls should show a clear `Multiple values` state instead of pretending one object's values are the whole selection
- changing a field from the mixed editor should apply the new value across the selected material targets through material history

This should widen Materials from active-object-only editing into multi-object editing without moving material truth into the workspace lane.

### Current Live Read

Shipped before this doc:
- `Materials-4` added a compact focused-object list for one or many selected objects
- choosing a focused-object row changes the active Materials object without collapsing the shared multi-selection
- the project material preset list assigns a preset to the currently selected material target
- grouped all/odds/evens assignment works across target rows for the active focused object
- selected-material controls edit one resolved material preset through `updateResolvedPreset(...)`
- material assignment writes already have history helpers for one part and many parts

Current limitation:
- multi-selection is visible, but project material assignment still behaves like an active focused-object/target operation
- the selected-material editor still reads from one selected target's resolved preset
- if two selected objects have different values, the controls do not yet show `Multiple values`

### Scope

This family phase owns:
- deriving material-bearing targets from every object in the shared selected-object list
- applying a clicked project material preset to all selected objects or their selected/default material targets when multiple objects are selected
- preserving active focused-object behavior for single-object selection
- showing mixed-value state in selected-material controls when selected objects disagree
- applying edited fields across the selected material targets when a mixed field is changed
- preserving material history and undo behavior for multi-object assignment and edits

This family phase does not own:
- material-library browsing
- texture, shader, or map fields
- changing how workspace selection is stored
- turning the Materials panel into a second material owner
- changing Project materials preset storage
- changing viewer material consumption beyond using existing assignment maps

### Implementation Readiness

`Materials-5` should split into Codex-sized phases:
- `Phase 1` - Multi Object Target Read And Assignment Scope
- `Phase 2` - Project Material Batch Assignment
- `Phase 2.1` - Focused Item Inclusion And Global Deselect Semantics
- `Phase 3` - Mixed Selected Material Read
- `Phase 4` - Multi Object Field Editing

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [ ] `Materials-Gen1-HLG-5. Materials should support natural multi-object workflows without forcing users to edit one object at a time.`

### `Materials-5 / Phase 1`

- [x] Derive material-bearing targets for all selected objects in the shared workspace selection.
- [x] Keep the focused-object list as the active-detail selector, not the only assignment scope.
- [x] Add a clear view-model read that distinguishes single-object scope from multi-object scope.
- [x] Preserve active focused-object behavior when only one object is selected.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-5`

### `Materials-5 / Phase 2`

- [x] When multiple objects are selected, clicking a project material preset assigns that preset to every selected object's material target scope.
- [x] Preserve the existing single-object project material row assignment behavior.
- [x] Route batch assignment through material history as one undoable action.
- [x] Keep assignment downstream from material target rows and part keys.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-5`

### `Materials-5 / Phase 2.1`

- [ ] Separate Materials-only focused-item inclusion from true global object deselection.
- [ ] Let focused item list row toggling exclude or include objects for material assignment without changing model viewport or Browser selection.
- [ ] Let the right-anchored `x` remove an object from the focused item list and deselect it from global model viewport or Browser selection.
- [ ] Keep project-material assignment scoped only to focused items that remain highlighted/included.
- [ ] Prove selected-target, explicit-selection, selection-anchor, and resolved-content truth match the `x` removal behavior.
- [ ] `Materials-Gen1-HLG-2`
- [ ] `Materials-Gen1-HLG-3`
- [ ] `Materials-Gen1-HLG-5`

### `Materials-5 / Phase 3`

- [ ] Detect mixed selected-material values across the multi-object selection.
- [ ] Show `Multiple values` for fields that disagree, including base color, metalness, roughness, opacity, emissive color, transparency, rendering, and related selected-material controls.
- [ ] Preserve exact single-value display when all selected objects agree.
- [ ] Avoid storing mixed-value state as material truth.
- [ ] `Materials-Gen1-HLG-2`
- [ ] `Materials-Gen1-HLG-3`
- [ ] `Materials-Gen1-HLG-5`

### `Materials-5 / Phase 4`

- [ ] Let editing a mixed or agreed selected-material field apply the edited value across the selected material target scope.
- [ ] Preserve material history and undo as one meaningful batch edit.
- [ ] Keep field editing owner-routed through existing material preset and assignment seams where possible.
- [ ] Do not add unsupported material fields or a panel-local draft material owner.
- [ ] `Materials-Gen1-HLG-2`
- [ ] `Materials-Gen1-HLG-3`
- [ ] `Materials-Gen1-HLG-5`

## [x] `Materials-5 / Phase 1` - `Multi Object Target Read And Assignment Scope`

### Phase 1 Summary

Prepare the Materials view model to understand the full selected-object material scope.

This phase should not change assignment behavior yet. It should make the data shape honest enough that Phase 2 can apply one project material to all selected objects.

### Owns

- reading all selected object targets from the shared workspace selection
- deriving material target rows or fallback target keys per selected object
- exposing whether the current Materials scope is single-object or multi-object
- preserving the focused-object list as the active-detail selector

### Does Not Own

- applying materials to multiple objects
- changing selected-material field editing
- mixed-value UI
- new material owner fields

### Implementation Direction

Read the live `Properties` and Materials selection seams before implementation.

Prepared live seam read:
- `PropertiesSurface.tsx` already reads `workspaceSelection.explicitSelectedTargets`, keeps multi-selection intact when a focused-object row is clicked, and builds a deduped object-only focused-object list.
- `propertiesSectionContract.tsx` currently passes only the active `selectedTarget` plus `focusSummary` into section content, so Materials cannot yet receive the full selected-object scope through the shell contract.
- `materialsSectionViewModel.ts` already derives target rows for the active selected object through `buildMaterialsTargetRows(...)`.
- `buildReferencePartTargetRows(...)` already covers stored reference part rows, terminal imported source part keys, and the whole-imported-object fallback target key.
- `materialEditHistory.ts` already has `assignMaterialPresetToPartsWithHistory(...)`, but this phase should not call it yet. Phase 1 is only the read/scope foundation for Phase 2.

Implementation-ready direction:
1. Extend `PropertiesSectionContext` with an object-only selected-target scope, derived from `explicitSelectedTargets` when present and otherwise the active `selectedTarget`.
2. Keep the existing focused-object row behavior in `PropertiesSurface.tsx`, but pass the same deduped object target list through the section context so hosted sections do not read workspace selection directly.
3. Add a Materials multi-object scope shape in `materialsSectionViewModel.ts`, for example a scope kind of `single-object` or `multi-object`, grouped rows per object, flattened assignment rows, and a deduped assignment part-key list.
4. Reuse the existing authored-object and imported-reference target-row derivation for each selected object. If a helper extraction is needed, prefer a small object-target helper over duplicating target-row logic.
5. Preserve current active focused-object detail behavior: the visible material target list and selected-material editor should still read from the active focused object in Phase 1.
6. Expose the new multi-object assignment scope separately from active-object detail rows. A small non-visual data hook on the Materials root is acceptable for tests, but no visible assignment behavior should change in this phase.
7. Keep non-object selections out of the material assignment scope.

Phase 1 is ready to implement.

### Implementation Result

Shipped implementation:
- `PropertiesSectionContext` now carries an object-only `selectedObjectTargets` scope from the shared Properties shell.
- `PropertiesSurface.tsx` passes the same deduped focused-object target list that feeds the visible focused-object list into hosted section context.
- `materialsSectionViewModel.ts` now builds a separate `assignmentScope` with `single-object` or `multi-object` kind, object groups, flattened target rows, deduped part keys, object count, and target count.
- Imported-reference target derivation still uses stored part rows, terminal imported part rows, and whole imported-object fallback keys.
- The visible material target list and selected-material editor still read the active focused object only.
- `PropertiesMaterialsSectionContent.tsx` exposes non-visual assignment-scope data hooks for tests and Phase 2.

Not changed:
- clicking a project material row still assigns only to the current selected target
- grouped all/odds/evens actions still operate on the active focused object's visible target rows
- mixed-value UI and multi-object field editing remain deferred

### Verification Shape

- focused view-model tests for single-object scope, two selected authored objects, imported-reference fallback scope, and ignored non-object selections
- Properties surface test proving multi-selection still shows the focused-object list and exposes the multi-object assignment scope read
- no behavior change to project material assignment yet
- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`
- changelog and doc-log entries when runtime code changes

## [x] `Materials-5 / Phase 2` - `Project Material Batch Assignment`

### Phase 2 Summary

Make project material row clicks respect multi-object selection.

When two objects are selected and the user clicks `Brushed Metal`, both selected objects should receive `Brushed Metal`.

### Owns

- applying one project material preset to every selected object's material assignment target
- preserving single-object assignment behavior
- routing the multi-object operation through one undoable material history action
- updating UI copy or metadata enough to make the batch scope legible

### Does Not Own

- mixed-value selected-material field display
- editing material fields across multiple objects
- project material search behavior
- material-library behavior

### Implementation Direction

Use the Phase 1 multi-object material assignment scope.

Prepared live seam read:
- `PropertiesMaterialsSectionContent.tsx` still routes project-material row clicks through `handleAssignMaterial(preset.id)`.
- `handleAssignMaterial(...)` currently requires the lane-local `selectedTarget` and writes only `selectedTarget.partKey` through `assignMaterialPresetToPartWithHistory(...)`.
- `viewModel.assignmentScope` now exposes `kind`, `objectCount`, `targetCount`, and deduped `partKeys` for the full selected-object material target scope.
- `assignMaterialPresetToPartsWithHistory(...)` already dedupes part ids, enables per-part material mode, writes one preset id to every part id, and records one undoable history entry.
- `materialEditHistoryStore.test.ts` already proves the batch helper undo/redo behavior, so the Phase 2 surface test should prove the Materials click uses that helper correctly.

Implementation-ready direction:
1. Keep single-object assignment behavior on the same path when `viewModel.assignmentScope.kind === 'single-object'`.
2. When `viewModel.assignmentScope.kind === 'multi-object'`, make project-material row clicks assign the clicked preset to `viewModel.assignmentScope.partKeys` through `assignMaterialPresetToPartsWithHistory(...)`.
3. Disable project-material preset rows only when there is no active selected target and the assignment scope has no assignable part keys.
4. Use one history label such as `Assign material to selected objects`, with a target id that identifies the batch assignment rather than one active part key.
5. Do not change `New Material`, `Duplicate Material`, selected-material field editing, grouped all/odds/evens actions, or project-material search behavior in this phase.
6. Keep the visible target list and selected-material editor tied to the active focused object. Only the clicked project-material assignment should widen to the multi-object scope.
7. If a multi-object selection includes an object with no material targets, assign to the available `assignmentScope.partKeys` and leave empty objects unchanged.
8. Add/extend a Properties surface test where two selected authored objects click `Brushed Metal` and both authored part keys receive `brushed_metal`.
9. Add a surface-level undo/redo assertion or a focused history assertion proving the batch click creates one undoable material-history entry.

Phase 2 is ready to implement.

### Implementation Result

Shipped implementation:
- `PropertiesMaterialsSectionContent.tsx` keeps single-object project-material assignment on the existing `assignMaterialPresetToPartWithHistory(...)` path.
- Multi-object project-material row clicks now assign the clicked preset to `viewModel.assignmentScope.partKeys` through `assignMaterialPresetToPartsWithHistory(...)`.
- The multi-object click records one undoable material-history entry labelled `Assign material to selected objects`.
- Project-material rows remain enabled for multi-object assignment when the Phase 1 scope has assignable part keys.
- The focused target list, selected-material editor, grouped all/odds/evens actions, `New Material`, `Duplicate Material`, and project-material search behavior are unchanged.
- `PropertiesSurface.test.tsx` proves two selected authored objects both receive `Brushed Metal` from one project-material row click, then undo/redo as one history entry.

Phase 2 follow-up:
- focused object rows now start included/highlighted for material assignment
- the left include toggle can unhighlight an object while keeping it visible in the focused item list
- project-material row clicks now assign only to the highlighted focused item rows
- the right-anchored `x` button removes an object from the focused item list and shared explicit workspace selection
- single included rows still assign through the single-part history path, even if the active detail row is different

Next handoff:
- `Phase 3` should use the shipped multi-object assignment scope to aggregate selected-material reads and show `Multiple values` when selected objects disagree.

### Verification Shape

- focused Properties surface test for two selected objects assigning one project material
- material history undo proof for the batch assignment
- existing single-object project material assignment tests still pass
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd run build`
- changelog and doc-log entries when runtime code changes

## [x] `Materials-5 / Phase 2.1` - `Focused Item Inclusion And Global Deselect Semantics`

### Phase 2.1 Summary

Lock the two different actions in the `Materials > Focused items` list.

User workflow:
1. User selects many objects in the model viewport or Browser.
2. Materials shows those objects in the focused item list and highlights/includes them for material assignment by default.
3. User can click the focused item inclusion control to unhighlight an object for Materials assignment only. The object stays selected globally and stays visible in the list.
4. User can click the right-anchored `x` to remove an object from the focused item list and deselect it globally from the model viewport or Browser selection.

### Owns

- clear separation between Materials-only inclusion state and global workspace selection state
- focused item rows starting highlighted/included for material assignment
- unhighlighting a focused item without mutating `workspaceSelection`
- right-anchored `x` removal mutating shared workspace selection truth
- assignment scope using only highlighted/included focused items
- tests that cover active and inactive row removal from shared selection truth

### Does Not Own

- mixed-value selected-material field display
- multi-object field editing
- changing Browser or viewport selection storage
- changing project-material preset storage
- broad selection UX outside the Materials focused-item list

### Implementation Direction

Start from the current Phase 2 follow-up implementation and make the semantics explicit.

Prepared live seam read:
- `PropertiesSurface.tsx` derives `focusedObjectRows` from `workspaceSelection.explicitSelectedTargets` with a single `selectedTarget` fallback.
- `includedFocusedObjectIds` is local Materials/Properties UI state and currently resets to include every focused object whenever the focused object row id list changes.
- `selectedObjectTargets` passed into `resolvePropertiesShellState(...)` is filtered by `includedFocusedObjectIds`, so the Materials assignment scope already follows highlighted rows.
- `handleFocusedObjectIncludedToggle(...)` currently changes only `includedFocusedObjectIds`; it does not call any workspace selection setter.
- `handleFocusedObjectRemove(...)` calls `setWorkspaceExplicitSelection(...)` with the removed object filtered out, and moves active `selectedTarget` / `selectionAnchorTarget` to the first remaining explicit target when needed.
- `PropertiesMaterialsSectionContent.tsx` already assigns project materials from `viewModel.assignmentScope.partKeys`, so unhighlighted rows are excluded from project-material assignment.
- `PropertiesSurface.test.tsx` has one broad test covering unhighlight exclusion and active-row removal, but the phase should make this easier to trust by asserting the two semantics separately and clearly.

Expected behavior:
1. The focused-item list should be populated from shared workspace selection.
2. Every focused item should start highlighted/included for Materials assignment.
3. Clicking the row inclusion control should only change Materials assignment inclusion.
4. Clicking the row inclusion control should not remove the object from `workspaceSelection.selectedTarget`, `workspaceSelection.explicitSelectedTargets`, `workspaceSelection.selectionAnchorTarget`, or Browser/viewport selection truth.
5. Project material row clicks should apply only to highlighted/included focused items.
6. Clicking the right-anchored `x` should remove the object from the focused item list and shared explicit selection.
7. If the removed object was the active `selectedTarget`, selection should move to the next remaining selected object or become empty if none remain.
8. `resolvedContentSelection` should recalculate so removed object part keys are no longer present.
9. Keep the active-detail focused row behavior separate from the inclusion toggle and `x` removal.

Implementation-ready direction:
1. Keep the existing include toggle as Materials-local state, not global selection state.
2. Make sure include toggling an active or inactive row leaves `workspaceSelection.selectedTarget`, `workspaceSelection.explicitSelectedTargets`, and `workspaceSelection.selectionAnchorTarget` unchanged.
3. Keep `selectedObjectTargets` flowing to Materials from highlighted/included focused rows only.
4. Keep project-material assignment using the Materials assignment scope, not all globally selected objects.
5. Keep the right-anchored `x` wired through `setWorkspaceExplicitSelection(...)` so Browser/model viewport shared selection truth is changed.
6. Add or split tests so there is a direct inactive-row `x` proof and a direct active-row `x` proof.
7. Add a direct inclusion-toggle proof that global selected truth stays untouched while the assignment target count and assignment result change.
8. Preserve the current compact focused-row shell and do not redesign the list controls in this phase.

Phase 2.1 is ready to implement.

### Implementation Result

Shipped implementation:
- `PropertiesSurface.test.tsx` now has separate focused-item tests for assignment-only unhighlighting, inactive-row `x` removal, and active-row `x` removal.
- The inclusion-toggle proof locks that unhighlighting a focused material object changes only the Materials assignment scope and leaves `selectedTarget`, `explicitSelectedTargets`, `selectionAnchorTarget`, and resolved content part keys unchanged.
- The project-material assignment proof locks that unhighlighted focused rows stay globally selected but do not receive the clicked project material.
- The inactive-row `x` proof locks that removing a non-active focused row mutates shared explicit workspace selection and recalculates resolved part keys while keeping the active object selected.
- The active-row `x` proof locks that removing the active focused row clears it from `selectedTarget`, `explicitSelectedTargets`, `selectionAnchorTarget`, and resolved content part keys by moving focus to the remaining object.
- Follow-up fix: when the `x` removes the only focused object, `PropertiesSurface.tsx` now routes through `clearWorkspaceTargetSelection(...)` so mirrored selection state such as `selectedPartKey` is cleared along with `workspaceSelection`.
- `PropertiesSurface.test.tsx` now proves the single-object `x` path clears the row, selected target, explicit selection, anchor, resolved content selection, and selected part mirror.
- Follow-up fix: clicking a focused item row now toggles assignment inclusion while still switching the active material-detail object, and excluded rows stay muted even when focused or active.
- Follow-up fix: focused item rows are now pinned in the Materials surface while row toggles remove or restore the object from shared workspace selection, so Browser/viewport highlighting follows inclusion without dropping the row from Materials.

Next handoff:
- `Phase 3` should use the now-locked focused item inclusion scope as the trusted source for mixed selected-material reads.

### Verification Shape

- Properties surface test where unhighlighting an object keeps it globally selected but excludes it from material assignment
- Properties surface test where `x` removes an inactive object from explicit global selection
- Properties surface test where `x` removes the active object from selected target, explicit selection, anchor, and resolved part keys
- existing Phase 2 batch assignment tests still pass
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd run build` if runtime code changes
- changelog and doc-log entries when runtime code changes

## [x] `Materials-5 / Phase 3` - `Mixed Selected Material Read`

### Phase 3 Summary

Teach the selected-material editor to show `Multiple values` when the multi-object selection disagrees.

### Owns

- comparing selected-material values across the multi-object material scope
- showing `Multiple values` for disagreeing fields
- preserving normal values when all selected objects agree
- keeping mixed-value state as a read projection only

### Does Not Own

- applying field edits across multiple objects
- adding new material fields
- changing project material assignment behavior

### Implementation Direction

This phase should start after Phase 2 proves the multi-object assignment scope.

Prepared live seam read:
- `materialsSectionViewModel.ts` already builds `assignmentScope` from `context.selectedObjectTargets`, dedupes part keys, and preserves the active focused object's visible `targetRows`.
- `resolveSelectedTargetMaterialRead(...)` is currently single-target only: selected target row -> per-part preset -> selected preset -> first preset fallback.
- `PropertiesMaterialsSectionContent.tsx` currently derives `selectedMaterialRead` from the active visible `selectedTarget`, then renders the compact editor directly from `selectedMaterialRead.preset`.
- The compact editor controls are normal editable controls for `name`, base color, emissive color, metalness, roughness, opacity, emissive intensity, transparency, and rendering.
- The current edit path still calls `updateMaterialPresetWithHistory(...)` against one resolved preset. Phase 3 should not widen that path.

Implementation-ready direction:
1. Add a view-model-level aggregate read for the assignment scope, likely beside `resolveSelectedTargetMaterialRead(...)`, that resolves each included assignment-scope target row through the same per-part -> selected preset -> first preset fallback order.
2. Keep single-object scope returning the existing single-target read behavior so current single selection remains unchanged.
3. For multi-object scope, compare resolved preset fields across the included `assignmentScope.targetRows`.
4. Track per-field read state for:
   - `name`
   - `color`
   - `emissive`
   - `metalness`
   - `roughness`
   - `opacity`
   - `emissiveIntensity`
   - `transparent`
   - `doubleSided`
5. Return a concrete field value only when all included material targets agree; otherwise return a mixed marker displayed as `Multiple values`.
6. Prefer a small typed result shape over string-only rows so the editor can decide which controls should be normal, mixed, or pending.
7. In the compact editor, show `Multiple values` for mixed fields without writing any material changes.
8. Mixed fields should be neutral/read-only in this phase. For sliders/selects/color/name fields, either disable the control or replace the control surface with a compact `Multiple values` row/badge; do not let a Phase 3 interaction mutate materials.
9. Keep the project material preset list assignment behavior from Phase 2 unchanged; clicking a project material still applies that preset to included focused items.
10. Keep active-detail target selection behavior unchanged; the material target list still follows the active focused object, while the selected-material read can aggregate over the included focused items.

Phase 3 is ready to implement.

### Implementation Result

Shipped implementation:
- `materialsSectionViewModel.ts` now exposes `resolveSelectedMaterialScopeRead(...)`, which preserves the existing single-target read path and aggregates multi-object assignment-scope target rows.
- Multi-object selected-material reads compare `name`, base color, emissive color, metalness, roughness, opacity, emissive intensity, transparency, and rendering.
- Fields that agree return concrete values; fields that differ return mixed markers shown as `Multiple values`.
- `PropertiesMaterialsSectionContent.tsx` now reads selected material state from the included focused-item assignment scope instead of only the active visible target when multiple objects are included.
- Mixed text/color/select fields render compact `Multiple values` rows.
- Mixed scalar fields show `Multiple values` through the compact `ParaSlider` surface.
- Multi-object selected-material controls are read-only in this phase, so changing fields remains deferred to `Phase 4`.
- The project material preset list assignment behavior from Phase 2 is unchanged.

Next handoff:
- `Phase 4` should decide the exact write semantics for multi-object field editing, especially whether edits mutate a shared preset or create per-object material copies when selected targets disagree.

### Verification Shape

- view-model tests for single-object scope preserving current resolved selected-material read behavior
- view-model tests for multi-object scope with agreed values showing concrete values
- view-model tests for multi-object scope with different color/scalar/mode fields returning mixed markers
- Properties surface test where two included focused objects with different material assignments show `Multiple values`
- Properties surface test or assertion proving Phase 3 mixed controls do not edit material truth
- existing Phase 2 batch assignment and Phase 2.1 inclusion/remove tests still pass
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd run build`
- changelog and doc-log entries when runtime code changes

## [x] `Materials-5 / Phase 4` - `Multi Object Field Editing`

### Phase 4 Summary

Let selected-material field edits apply across the multi-object material scope.

After this phase, if two selected objects have different roughness values and the user changes `Roughness`, both selected objects should receive the edited roughness value through material history.

### Owns

- applying edited material field values across the selected material target scope
- resolving how shared preset edits versus per-object assignment copies should behave
- preserving one meaningful undo entry per user edit
- keeping the UI honest about mixed values after an edit

### Does Not Own

- new material fields
- shader/texture/library behavior
- changing workspace selection ownership

### Implementation Direction

Prepared live seam read:
- `Phase 3` shipped `resolveSelectedMaterialScopeRead(...)` and typed field reads so the compact editor knows which fields agree and which fields are mixed.
- `PropertiesMaterialsSectionContent.tsx` currently blocks `updateResolvedPreset(...)` whenever `selectedMaterialRead.targetCount > 1`; Phase 4 should replace that guard with a multi-object write path.
- Single-object edits still use `updateMaterialPresetWithHistory(...)` against the resolved preset id.
- Project-material row clicks already apply one preset id to every included assignment-scope part key through `assignMaterialPresetToPartsWithHistory(...)`.
- `materialEditHistory.ts` snapshots the full `ViewSettings['materials']` tree before and after a mutation, so a new multi-object edit helper can still produce one undoable history entry.
- `uiPrefsStore.addMaterialPreset(...)` creates a preset and selects it, while `assignPartMaterial(...)` maps a part key to a preset id. There is no direct helper yet for creating several patched per-target copies inside one history action.
- `duplicateMaterialPresetForPartWithHistory(...)` already demonstrates the safe copy-and-assign model for one target.

Open decision before implementation:
- whether multi-object field edits should mutate a shared preset when all selected targets already use the same preset, or create/assign per-object material copies when targets differ

Implementation-ready direction:
1. Keep single-object edits on the existing `updateMaterialPresetWithHistory(...)` path.
2. Add a material-history helper for multi-target field edits, likely in `materialEditHistory.ts`, that accepts included assignment-scope target rows plus a `Partial<MaterialPreset>` patch and commits one undoable history entry.
3. Safe default: direct multi-object field edits should create a patched material preset copy per included target and assign each copy to that target's part key.
4. The helper should resolve each target row through the same per-part -> selected preset -> first preset fallback read used by Phase 3, then seed the copy from that target's resolved preset.
5. The helper should call `setUsePerPartMaterial(true)` and assign every included part key to its newly created patched preset.
6. Name the generated per-target copies deterministically enough for tests, for example `<base material name> Multi Edit` or `<base material name> <field> Edit`; do not expose naming as a Phase 4 UX decision.
7. Preserve project material list behavior: clicking a project material row still assigns the same chosen project preset to all included targets. Only direct field controls create per-target edited copies.
8. Re-enable compact editor controls for multi-object reads by routing scalar/color/select changes through the multi-object edit helper.
9. For mixed fields, controls should use a neutral starting value from `selectedMaterialRead.preset` or the first resolved preset, but the displayed value should remain `Multiple values` until the user changes it.
10. After the user changes a mixed field, the selected-material read should refresh and show the edited concrete value for that field when all included targets now agree.
11. Keep field scope narrow to the Phase 3 fields: name, base color, emissive color, metalness, roughness, opacity, emissive intensity, transparency, and rendering.
12. Keep grouped all/odds/evens assignment actions, `New Material`, `Duplicate Material`, and project material search unchanged.

Phase 4 is ready to implement.

### Implementation Result

Shipped implementation:
- `materialEditHistory.ts` now exposes `updateMaterialPresetCopiesForPartsWithHistory(...)` for one undoable multi-target field edit.
- Direct multi-object field edits create patched material preset copies per included target and assign each created preset to that target's part key.
- Single-object field edits still use the existing `updateMaterialPresetWithHistory(...)` path.
- `PropertiesMaterialsSectionContent.tsx` now routes multi-object direct field edits through the new copy-and-assign helper instead of blocking them.
- Mixed scalar controls can be changed from the compact `ParaSlider` surface, and the edited field becomes a concrete agreed value after the write.
- Mixed base-color edits can be applied from the compact color input, creating per-target copies that preserve each target's other material values.
- Project-material row assignment remains unchanged and still assigns one chosen project preset to all included targets.

Follow-up adjustment:
- Direct multi-object edits now update the resolved materials by default, even when those material presets are shared by other objects.
- `PropertiesMaterialsSectionContent.tsx` adds an off-by-default `Create new material on multi edit` toggle for users who want the safer copy-and-assign behavior.
- `materialEditHistory.ts` now also exposes `updateMaterialPresetsForPartsWithHistory(...)` for one undoable multi-target edit of existing resolved presets.
- The copy-and-assign helper remains available and is used only when the toggle is enabled.
- Project material rows now highlight every resolved preset used by the included focused-item assignment scope, so multi-object selections with different materials show all participating project materials as active.

Completed verification:
- material-history helper test for patched per-target preset copies, per-part assignments, and undo/redo
- material-history helper test for updating existing resolved presets once per unique preset id
- Properties surface test for editing mixed `Metalness` across included focused objects
- Properties surface test for editing mixed `Base color` across included focused objects
- Properties surface test proving the copy-and-assign behavior only runs when `Create new material on multi edit` is enabled
- Properties surface assertion proving two different selected object materials both highlight in the Project materials list

### Verification Shape

- material-history helper test proving one multi-object field edit creates patched per-target preset copies, assigns them to every included part key, and commits one undoable entry
- Properties surface test for editing a mixed scalar field such as `Metalness` across two included focused objects
- Properties surface test for editing a mixed color field such as `Base color` across two included focused objects
- assertion that after editing a mixed field, the read for that field becomes a concrete agreed value instead of `Multiple values`
- undo/redo proof for the multi-object edit
- existing Phase 2 project-material batch assignment and Phase 3 mixed-read tests still pass
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/workspace/materialsSectionViewModel.test.ts src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd run build`
- changelog and doc-log entries
