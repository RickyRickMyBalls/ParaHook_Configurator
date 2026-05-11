# Materials 2 - First Material Editing And Action Flows

## Doc Header

### Doc History
7. 2026-05-10 14:25:57: Implemented and closed `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through` by adding grouped all, odd, and even target assignment controls, deterministic target-group derivation, one owner-routed batch assignment history helper, and focused verification for grouped undoable assignment while keeping richer shader and texture fields deferred.
6. 2026-05-10 14:18:59: Prepped `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through` for implementation by narrowing the pass around owner-routed all, odd, and even target assignment reuse, one batch history helper, deterministic target-group derivation from the shipped target rows, and an explicit deferral of richer shader or texture fields until the typed material owner supports them.
5. 2026-05-10 14:11:02: Implemented and closed `Materials-2 / Phase 2 - New Material Assign And Duplicate Flows` by adding owner-routed create-and-assign, assign-to-target, and duplicate-and-assign material history helpers, enabling the hosted lane action rail, and advancing the editing ladder to `Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through`.
4. 2026-05-10 14:05:02: Prepped `Materials-2 / Phase 2 - New Material Assign And Duplicate Flows` for implementation by grounding the first action pass against the shipped editable selected-target controls, existing history-wrapped add and assign helpers, the current per-part assignment owner seam, and one narrow duplicate helper that should seed a real preset from the resolved selected-target material instead of creating lane-local draft state.
3. 2026-05-10 14:01:18: Implemented and closed `Materials-2 / Phase 1 - First Editable Material Property Controls` by adding history-wrapped material preset property updates, replacing the selected-target read rows with editable controls for the current typed preset fields, and advancing the editing ladder to `Phase 2 - New Material Assign And Duplicate Flows`.
2. 2026-05-10 13:52:10: Prepped `Materials-2 / Phase 1 - First Editable Material Property Controls` for implementation by grounding the first editable cut against the shipped `Materials-1` selected-target material read, the current `useUiPrefsStore` material preset owner seam, and the history-wrapped material mutation helpers, while deferring `New Material`, assignment pickers, duplicate flows, and broad material-library behavior to later phases.
1. 2026-05-10 13:15:16: Created this follow-on `Materials-2` family phase doc and prepped its first three phases so the nested materials ladder now has one honest post-foundation home for editable property controls, first-class material actions, and wider assignment or reuse follow-through after `Materials-1` closes the object -> target -> material-read path.

### Purpose

This doc owns the first true editing and action follow-through for the nested `Materials` lane after the `Materials-1` foundation lands.

Use it to answer:
- how the first editable material controls should begin
- where `New Material`, `Assign Material`, and `Duplicate Material` should first live
- how broader assignment and reuse behavior should widen after the first read-only lane foundation is honest

Do not use it for:
- rebuilding the `Properties` shell contract
- redoing the `Materials-1` owner-boundary read
- pretending the whole long-range material system fits in one pass

## Doc Body

### Short Version

`Materials-2` should start only after `Materials-1` makes the object -> target -> material-read flow honest.

This family phase should carry the first real editing ladder:
- `Phase 1` introduces the first editable material property controls - shipped
- `Phase 2` introduces `New Material`, `Assign Material`, and `Duplicate Material` - shipped
- `Phase 3` widens into safer assignment reuse and explicit richer-field deferral - shipped

This doc is editing-first, not foundation-first.

### Scope

This family phase owns:
- the first editable property controls inside the hosted `Materials` lane
- the first material action flows
- the first wider assignment or reuse follow-through after the basic editor exists

This family phase does not own:
- the original object-selection or target-discovery foundation from `Materials-1`
- Browser hierarchy truth
- viewer-runtime ownership
- the entire long-range library or shader system

### Current Live Read

The vision already says the next healthy widening after the first object-focused foundation is:
- editable material properties
- `New Material`
- `Assign Material`
- `Duplicate Material`
- later richer assignment, reuse, and wider field follow-through

That widening is now ready to start because:
- the `Properties` shell contract is landed
- the hosted `Materials` lane no longer fakes shell behavior
- `Materials-1` projects focused object, target list, selected target, and current material read without hidden owner drift
- `Materials-1 / Phase 3` already exposes the selected material preset read and disabled action handoff rail

Current implementation seams:
- `src/app/workspace/materialsSectionViewModel.ts`
  - owns `MaterialsTargetRow` and `resolveSelectedTargetMaterialRead(...)`
  - should stay the first typed read helper for selected-target editing
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
  - owns lane-local selected target state and currently renders display-only material property rows
  - is the first UI host for replacing selected read rows with narrow editable controls
- `src/app/store/uiPrefsStore.ts`
  - owns `updateMaterialPreset(...)`, `setMaterialPresetTransparent(...)` through `updateMaterialPreset(...)`, and existing material preset truth
  - should remain the practical mutation owner seam for the first editable pass
- `src/app/store/materialEditHistory.ts`
  - already wraps material mutation with undo/redo history
  - currently exposes specific wrappers for selected preset, add/delete preset, transparency, per-part mode, assign, and clear
  - may need one narrow new history helper for editing general preset fields instead of calling `updateMaterialPreset(...)` raw from the workspace lane
- `src/shared/viewSettingsTypes.ts`
  - defines the current editable `MaterialPreset` fields available to the first pass

### First Pass Decisions

1. `Materials-2` should begin only after `Materials-1` closes its owner-boundary ladder.
2. The first editing pass should start with the smallest practical property family from the vision.
3. Material actions should be explicit top-level lane actions, not hidden secondary affordances.
4. Wider assignment or reuse behavior should remain a later third pass so the first editable lane stays manageable.

### Implementation Readiness

`Materials-2` should split into three Codex-sized editing phases:
- `Phase 1` - First Editable Material Property Controls - shipped
- `Phase 2` - New Material Assign And Duplicate Flows - shipped
- `Phase 3` - Wider Assignment Reuse And Richer Field Follow-Through - shipped

### Risks

- editing could begin before the owner seams are explicit enough
- new-material creation could become a local orphan draft instead of a real owner-routed action
- broader assignment could widen before single-target editing is stable

### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-1 - Workspace Foundation And Material Owner Read.md`
- `src/app/workspace/PropertiesMaterialsSection.tsx`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts`
- later any new local materials editor or action helpers under `src/app/workspace/`

### No-Widening Rule

- do not collapse Browser, viewer, or object ownership into the materials lane
- do not skip the `Materials-1` foundation and jump straight into broad editing
- do not bundle all later library or shader ambitions into the first editing pass

### Done Shape

This family phase is in good shape when:
- the first property controls are editable through explicit owner seams
- first-class material actions exist in the lane
- wider assignment and reuse behavior has one honest later home

## Vision

`Materials-2` is the first editing-forward follow-on after the object-focused materials foundation.

The intended read is:
- `Materials-1` proves the lane can read honestly
- `Materials-2` proves the lane can edit and act honestly
- later follow-on work can widen richer fields, broader libraries, and cross-object reuse only after those two ladders land

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-1. Materials should have a real workspace-family home under Workspace Modes instead of staying only an implied later need.`
- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [ ] `Materials-Gen1-HLG-4. The first Materials family phase should map the real owner seams before broader library, assignment, or preview behavior is planned.`

### `Materials-2 / Phase 1`

- [x] Add the first editable material property controls for the selected target.
- [x] Keep the first editable property family narrow and owner-honest.
- [x] Preserve object -> target -> material-read continuity while widening into writes.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-2 / Phase 2`

- [x] Add first-class `New Material`, `Assign Material`, and `Duplicate Material` flows.
- [x] Keep action ownership explicit instead of creating local orphan drafts.
- [x] Make the materials lane the honest presentation home for those actions without absorbing upstream owners.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-3`

### `Materials-2 / Phase 3`

- [x] Widen into safer assignment or reuse behavior for more than one target or object context.
- [x] Add the next honest richer field follow-through once the first editor and actions are stable.
- [x] Leave broader library and shader ambitions explicit for later work if they still do not fit.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

## [x] `Materials-2 / Phase 1` - `First Editable Material Property Controls`

### Phase 1 Summary

Add the first real editable material property controls for the selected target inside the hosted `Materials` lane.

This phase should prove:
- the selected target can move from read-only material projection into real editable controls
- the first practical property family from the vision can be edited through explicit owner seams
- the lane can write without becoming a hidden new material owner

### Phase 1 Implementation Spec

#### Purpose

Land the first narrow editable property family for the selected material target.

#### Owns

- editable controls for the first practical property family
- the first write-path binding between hosted materials UI and explicit owner seams
- focused proof that property edits stay scoped to the selected target

#### Does Not Own

- broader material creation flows
- multi-target assignment flows
- richer later shader or texture fields

#### Current Live Read

- `Materials-1 / Phase 3` now renders the selected-target material read from `resolveSelectedTargetMaterialRead(...)`.
- the selected read resolves a concrete `MaterialPreset` after checking per-part override, selected preset, first-preset fallback, and missing states.
- the current `MaterialPreset` shape supports:
  - `name`
  - `color`
  - `metalness`
  - `roughness`
  - `emissive`
  - `emissiveIntensity`
  - `opacity`
  - `transparent`
- the vision names `Double-sided` in the first practical property family, but the current typed preset does not yet include a `doubleSided` field.
- `uiPrefsStore.ts` already owns `updateMaterialPreset(id, patch)`, which can update the currently resolved preset fields.
- `materialEditHistory.ts` already captures full material snapshots and can safely undo/redo material changes, but it does not yet expose a general `updateMaterialPresetWithHistory(...)` helper.
- per-part assignment currently resolves which preset the selected target is using; Phase 1 should edit the resolved preset, not invent a lane-local material draft or start assign/new flows.

#### First Pass Decisions

1. Start with the editable fields that already exist on `MaterialPreset`: `name`, `color`, `metalness`, `roughness`, `opacity`, `emissive`, `emissiveIntensity`, and `transparent`.
2. Treat `transparent` as the current typed stand-in for the vision's first-pass opacity/alpha behavior; do not add `doubleSided` until the material owner type actually supports it.
3. Controls should stay tied to the selected target's resolved preset, not to a floating global preset panel detached from object context.
4. If the selected target resolves through per-part assignment, editing should update that resolved preset only; it should not change assignment, clone a preset, or create a new one.
5. If the selected target falls back to the selected preset or first preset, editing should still update the resolved preset through the same history-wrapped owner seam.
6. If no material preset resolves, render an explicit non-editable pending state instead of creating an implicit draft.
7. Add a narrow history wrapper, likely `updateMaterialPresetWithHistory(...)`, if the workspace would otherwise call `updateMaterialPreset(...)` directly.
8. Keep the existing disabled action rail visible, but do not enable `New Material`, `Assign Material`, or `Duplicate Material` in Phase 1.

#### First Code Cut

This pass should:
- replace the read-only selected-target property projection with the first editable controls for the resolved preset
- use stable controls that fit existing workspace UI patterns:
  - text input for material name
  - color input plus visible color value for base color and emissive color
  - range or numeric controls for metalness, roughness, opacity, and emissive intensity
  - checkbox or toggle for transparency
- wire those controls into the explicit current owner seam through history-wrapped material mutation
- keep `resolveSelectedTargetMaterialRead(...)` as the source of selected target and preset identity
- preserve the disabled action handoff rail for `Materials-2 / Phase 2`
- preserve the object -> target -> selected-target flow already landed by `Materials-1`
- stop before `New Material`, `Assign Material`, or `Duplicate Material`

#### Verification Shape

- proof that changing the selected target changes the bound editable material controls
- proof that editing each first-pass field updates the resolved preset through material history rather than lane-local draft state
- proof that per-part-resolved presets and selected-preset fallback both edit the resolved preset deterministically
- proof that missing material reads stay non-editable
- proof that disabled action handoff buttons remain disabled
- proof that unsupported or shell-owned states remain outside the editable lane

#### Likely Files

- `src/app/workspace/materialsSectionViewModel.ts`
- `src/app/workspace/materialsSectionViewModel.test.ts`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/materialEditHistory.ts`
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/store/uiPrefsStore.ts` only if the current patch API needs a narrow typed widening

#### No-Widening Rule

- do not enable `New Material`, `Assign Material`, or `Duplicate Material` here
- do not introduce a lane-local material draft owner
- do not add `doubleSided` or richer shader fields until the typed material owner supports them
- do not change target-list or shell ownership while adding controls

#### Shipped Read

`Phase 1` shipped the first editable material controls for the selected target's resolved material preset.

The shipped lane now proves:
- selected-target material identity still comes from `resolveSelectedTargetMaterialRead(...)`
- editable controls cover the current typed preset fields: name, base color, metalness, roughness, opacity, emissive color, emissive intensity, and transparency
- preset writes route through the new `updateMaterialPresetWithHistory(...)` wrapper instead of lane-local draft state
- per-part-resolved presets and selected-preset fallback both edit the resolved preset deterministically
- missing material reads remain non-editable
- `New Material`, `Assign Material`, and `Duplicate Material` remain disabled handoff actions for `Phase 2`

#### Verification

- `npm.cmd exec eslint -- src/app/store/materialEditHistory.ts src/app/store/materialEditHistoryStore.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`

## [x] `Materials-2 / Phase 2` - `New Material Assign And Duplicate Flows`

### Phase 2 Summary

Add the first top-level material actions to the hosted lane.

This phase should prove:
- `New Material`, `Assign Material`, and `Duplicate Material` have a real workspace home
- those actions route through explicit owner seams
- the lane can perform first-class material actions without absorbing Browser or object identity ownership

### Phase 2 Implementation Spec

#### Purpose

Turn the first read-and-edit lane into a real action surface for creating and applying materials.

#### Owns

- first-class material action affordances
- explicit action flows for new, assign, and duplicate
- focused proof that those flows stay downstream from real owners

#### Does Not Own

- wider cross-object reuse behavior
- richer field families beyond the first practical set
- final material library architecture

#### Current Live Read

- the vision already names `New Material`, `Assign Material`, and `Duplicate Material` as first-class workspace actions.
- the vision also explicitly warns that `New Material` must not become a local orphan draft, which means this phase must stay owner-honest even if the owner seam still has temporary limitations.
- `Materials-2 / Phase 1` now renders the resolved selected-target preset as editable controls and keeps the action rail visible but disabled.
- `materialEditHistory.ts` already exposes `addMaterialPresetWithHistory(...)` and `assignPartMaterialWithHistory(...)`.
- `uiPrefsStore.addMaterialPreset(preset?)` already creates a real preset, selects it, and can seed fields from a provided partial preset.
- `uiPrefsStore.assignPartMaterial(partId, presetId)` already writes the per-part assignment map and rejects missing preset ids.
- `materialEditHistory.ts` does not yet expose a dedicated duplicate helper, but `addMaterialPresetWithHistory(...)` can already accept a seeded preset through `uiPrefsStore.addMaterialPreset(...)` if widened to pass an optional preset.
- the selected target's `partKey` from `MaterialsTargetRow` is the right single-target assignment key for this first pass.
- the current lane has no material/preset chooser yet; the first assign flow should stay small and use existing preset options from typed material truth.

#### First Pass Decisions

1. Actions should be visible and explicit in the hosted lane, replacing the disabled handoff rail from Phase 1.
2. `New Material` should call an owner-routed history helper that creates a real preset through `uiPrefsStore.addMaterialPreset(...)`.
3. `New Material` should immediately assign the newly created selected preset to the current selected target when a target exists, because the workflow is focused-target-first.
4. `Assign Material` should be a simple selected-target-aware preset picker or compact action row, not a broad library browser.
5. `Duplicate Material` should create a real preset seeded from the resolved selected-target preset, with a deterministic duplicate name such as `<name> Copy`, and should assign that new preset to the selected target.
6. Add one narrow helper if needed, likely `addMaterialPresetWithHistory(seed?)` or `duplicateMaterialPresetWithHistory(...)`, rather than hand-rolling preset creation in the workspace component.
7. Keep all flows single-target-first and selected `partKey` scoped; odds/evens, multi-target assignment, and reusable library browsing stay deferred to Phase 3 or later.
8. If no selected target or no resolved preset exists, keep the affected actions disabled with an explicit pending state.

#### First Code Cut

This pass should:
- enable `New Material`, `Assign Material`, and `Duplicate Material` in the hosted lane's action rail
- use the selected target row from the current lane-local selection as the assignment target
- route new-preset creation through history-wrapped owner helpers
- route assignment through `assignPartMaterialWithHistory(selectedTarget.partKey, presetId, ...)`
- preserve or enable per-part assignment mode only if the current owner seam requires it for assignment to become visible in viewer reads
- provide a compact preset selection surface for assignment using existing `materials.presets`
- duplicate the resolved selected-target preset by seeding a new real preset through the owner seam, not by editing local component state
- keep `New Material` and `Duplicate Material` from creating orphan presets detached from the selected target in the focused-object lane
- stop before broader assignment or reuse logic widens

#### Verification Shape

- proof that each first-class action is available from the lane
- proof that the action flows remain scoped to explicit target identity
- proof that no local orphan material state is created
- proof that `New Material` creates a real preset, selects or resolves it through owner truth, and assigns it to the selected target when possible
- proof that `Assign Material` updates the selected target's per-part assignment through history
- proof that `Duplicate Material` creates a real seeded preset and assigns it to the selected target
- proof that disabled or pending behavior remains honest when no selected target or material preset exists

#### Likely Files

- `src/app/store/materialEditHistory.ts`
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/workspace/materialsSectionViewModel.ts` only if a tiny action-read helper is needed
- `src/app/workspace/materialsSectionViewModel.test.ts` only if that helper is added

#### No-Widening Rule

- do not build a full material library browser here
- do not add multi-target assignment, odds/evens, or cross-object reuse here
- do not create lane-local material drafts
- do not invent a separate material owner outside `uiPrefsStore` and `materialEditHistory`
- do not add richer shader fields while landing action flows

#### Shipped Read

`Phase 2` shipped first-class material action flows in the hosted `Materials` lane.

The shipped lane now proves:
- `New Material` creates a real preset through material history and assigns it to the selected target
- `Assign Material` uses a compact existing-preset picker and writes selected-target per-part assignment through material history
- `Duplicate Material` seeds a real preset from the resolved selected-target preset and assigns the copy to the selected target
- all three action flows stay scoped to the lane-local selected target `partKey`
- action flows enable per-part assignment through the existing material owner seam instead of creating lane-local drafts
- broader material library browsing, multi-target assignment, odds/evens actions, and cross-object reuse remain deferred

#### Verification

- `npm.cmd exec eslint -- src/app/store/materialEditHistory.ts src/app/store/materialEditHistoryStore.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`

## [x] `Materials-2 / Phase 3` - `Wider Assignment Reuse And Richer Field Follow-Through`

### Phase 3 Summary

Widen the first editor and action surface into safer assignment reuse across the current target rows, then leave richer shader or texture fields as an explicit later handoff.

This phase should prove:
- assignment can widen beyond the first narrow single-target flows without inventing a new target owner
- the older `Select All Odds` / `Select All Evens` baseline has a modern equivalent in the hosted lane
- richer material fields stay deferred when the typed material owner cannot honestly store them yet
- later library or shader ambitions have an explicit deferred home instead of being half-shipped here

### Phase 3 Implementation Spec

#### Purpose

Close the first editing ladder by adding deterministic grouped assignment actions for the current focused object's material targets.

#### Owns

- safer widened assignment or reuse behavior for the current target rows
- deterministic all, odd, and even target grouping based on the shipped target-row order
- one history-wrapped batch assignment path that can undo grouped assignment as one user action
- the closeout handoff into any later material-library or broader system work

#### Does Not Own

- the whole final material library universe
- all advanced shader and texture systems
- unrelated object, Browser, or viewer ownership
- persistent arbitrary multi-select state for materials targets
- new shader fields that do not exist on the current `MaterialPreset` type

#### Current Live Read

- `Materials-2 / Phase 1` shipped editable controls for the selected target's resolved `MaterialPreset`.
- `Materials-2 / Phase 2` shipped owner-routed `New Material`, assign, and duplicate actions scoped to the selected target part key.
- `MaterialsTargetRow[]` is now the honest ordered list of material-bearing target rows for the focused object.
- The older inspiration window had grouped target helpers such as `Select All Odds` and `Select All Evens`; the new stack should adapt that as scoped grouped assignment actions, not as a separate legacy selection model.
- `assignMaterialPresetToPartWithHistory(...)` proves the single-target assignment owner seam.
- Grouped assignment should add one narrow batch helper instead of looping independent single-target history entries from the UI.
- The current `MaterialPreset` type still only supports the first-pass fields already exposed in Phase 1, so normal maps, AO, specular, clearcoat, transmission, IOR, UV controls, and similar richer fields should remain a follow-on phase instead of being added as loose UI-only state.

#### First Pass Decisions

1. Use the current `MaterialsTargetRow[]` order as the only grouping source for this pass.
2. Add grouped assignment actions for all rows, odd rows, and even rows when the focused object exposes more than one material target.
3. Treat odd and even groups as one-based user-facing row positions so the first visible row is odd, matching the older window's language.
4. Assign the currently resolved selected-target preset, or the explicit preset chosen in the existing assign picker, to each target in the chosen group.
5. Add one owner-routed batch history helper, likely `assignMaterialPresetToPartsWithHistory(...)`, so grouped assignment becomes one undoable edit.
6. Keep `New Material`, single-target assign, and duplicate behavior from Phase 2 intact.
7. Do not introduce persistent target checkboxes, arbitrary multi-select state, or a material library browser in this closeout pass.
8. Do not add richer shader, texture, or render fields until the typed material owner grows those fields.
9. Record the richer-field deferral as the explicit handoff after this phase closes.

#### First Code Cut

This pass should:
- add a small target-group helper under the materials view-model area that derives all, odd, and even part-key groups from `MaterialsTargetRow[]`
- add a grouped assignment history helper that writes the same preset id to more than one part key in a single history snapshot
- render compact grouped assignment controls near the existing material action rail:
  - assign to all target rows
  - assign to odd target rows
  - assign to even target rows
- disable or hide grouped actions when there is no resolved preset or when the target list does not have enough rows for that group
- keep grouped assignment scoped to the current focused object and current target rows
- preserve the selected-target editor and the Phase 2 single-target actions without rewiring them through a broader library model
- close the first editing ladder with an explicit deferred handoff for richer material fields and broader material library behavior

#### Verification Shape

- proof that all, odd, and even target groups derive deterministically from `MaterialsTargetRow[]`
- proof that grouped assignment writes the chosen preset id to every expected part key and leaves non-group part keys unchanged
- proof that grouped assignment is one undoable history action and restores the prior per-part assignments
- proof that the grouped controls remain unavailable when no selected material preset can be assigned
- proof that Phase 1 editable fields and Phase 2 single-target actions still work after the grouped-action addition
- proof that richer shader and texture fields remain deferred instead of appearing as unsupported UI-only controls

#### Shipped Read

`Phase 3` shipped the first grouped assignment reuse layer for the hosted materials lane.

The shipped lane now proves:
- target groups derive from the existing ordered `MaterialsTargetRow[]` read instead of a new target owner
- `Assign To All`, `Assign To Odds`, and `Assign To Evens` apply the selected resolved preset across visible target rows
- grouped assignment routes through `assignMaterialPresetToPartsWithHistory(...)` as one undoable material-history action
- one-based odd and even grouping adapts the older materials-window baseline to the new hosted lane
- richer shader, texture, and render fields remain deferred until the typed material owner can store them honestly

#### Verification

- `npm.cmd exec eslint -- src/app/store/materialEditHistory.ts src/app/store/materialEditHistoryStore.test.ts src/app/workspace/materialsSectionViewModel.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`
