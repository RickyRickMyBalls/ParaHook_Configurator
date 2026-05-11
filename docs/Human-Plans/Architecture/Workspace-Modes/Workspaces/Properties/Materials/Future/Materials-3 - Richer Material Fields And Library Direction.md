# Materials 3 - Richer Material Fields And Library Direction

## Doc Header

### Doc History
11. 2026-05-10 17:08:15: Noted that `Materials-4` now exists as the open-ended cleanup-discovered follow-through family phase, so `Phase 4` can route to it when cleanup or the lane audit produces a concrete owner-backed scope.
10. 2026-05-10 17:03: Prepped `Materials-3 / Phase 4 - Next Materials Lane Routing Audit` for implementation as a documentation-first routing pass that chooses between material library/preset browsing, texture asset ownership, or the next owner-backed shader field before any broader runtime controls are added.
9. 2026-05-10 16:53: Implemented and closed `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff` by projecting the owner-backed `doubleSided` field as a compact hosted `Double-sided` checkbox, routing edits through material history, and keeping library, texture, and broader shader work as explicit follow-on planning.
8. 2026-05-10 15:49: Prepped `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff` for implementation by grounding it against the landed `doubleSided` owner field, choosing a compact selected-material checkbox control, preserving the existing history edit path, and making the material-library handoff documentation-only inside this phase.
7. 2026-05-10 15:43: Implemented and closed `Materials-3 / Phase 2 - First Typed Richer Field Expansion` by adding typed `doubleSided` material owner state, preserving double-sided rendering by default, wiring front-sided opt-out consumption in the viewer, and proving normalization, history, duplication, and runtime side behavior with focused tests.
6. 2026-05-10 15:36:12: Implemented and closed `Materials-3 / Phase 1 - Richer Field Owner Audit And First Field Choice` as a documentation-only audit, choosing `doubleSided` as the first richer typed field for Phase 2, preserving the current viewer `DoubleSide` behavior by defaulting the field to `true`, and explicitly deferring texture, UV, library, and shader-model fields.
5. 2026-05-10 15:28:44: Implemented and closed `Materials-3 / Phase 0.1 - Whole Imported Object Material Target Fallback` by adding stable whole-import target rows for partless focused imported references, routing hosted material actions to the fallback key, and teaching the viewer to consume whole-object fallback assignments after exact part assignments fail.
4. 2026-05-10 15:18:26: Added `Materials-3 / Phase 0.1 - Whole Imported Object Material Target Fallback` as the required follow-up to Phase 0, covering imported references that have no stored part rows and no terminal source part key by creating a stable whole-object assignment target and wiring viewer consumption before richer-field work resumes.
3. 2026-05-10 15:09:02: Implemented and closed `Materials-3 / Phase 0 - Imported Object Material Target Discovery` by routing terminal imported part references into the Materials target list, replacing the engineer-facing no-target copy with a clearer user-facing empty state, adding focused view-model coverage, and advancing the ladder to `Phase 1 - Richer Field Owner Audit And First Field Choice`.
2. 2026-05-10 15:04:34: Added `Materials-3 / Phase 0 - Imported Object Material Target Discovery` as the prerequisite readiness phase before richer-field work, so imported references can expose real material target rows and the current `Target discovery pending` path can be fixed or clarified before Phase 1 audits new material fields.
1. 2026-05-10 14:30:36: Created this `Materials-3` family phase doc to carry the next post-editing ladder after `Materials-2`, splitting richer material field ownership, first typed field expansion, and library-direction handoff into separate implementation phases instead of widening the hosted Materials lane all at once.

### Purpose

This doc owns the next richer material-field and library-direction planning ladder after the first hosted `Materials` editor and action flows have shipped.

Use it to answer:
- which richer material fields should become real typed owner state next
- how the first wider material field family should land without becoming UI-only state
- when material library or preset browsing should stay deferred instead of bundled into field editing
- how `Materials` can keep widening while staying downstream from the real material owner systems

Do not use it for:
- redoing the `Materials-1` focused object, target row, or selected material read foundation
- redoing the `Materials-2` first editor, action rail, or grouped assignment flows
- adding a full shader graph, texture manager, or material library in one pass
- making the `Materials` workspace a hidden second owner of object, Browser, or viewer truth

## Doc Body

### Short Version

`Materials-3` should widen the material system only after the first object-focused editing ladder is stable.

This family phase should carry one prerequisite discovery cleanup plus three small richer-field decisions:
- `Phase 0` makes imported objects expose honest material target rows before richer field work starts
- `Phase 0.1` added a whole-import fallback target for imported objects that expose no child material rows
- `Phase 1` audited the typed material owner and chose `doubleSided` as the first safe richer field family
- `Phase 2` landed the first typed richer field expansion through owner-routed history
- `Phase 3` projected that field in the hosted lane and wrote the later material-library boundary clearly
- `Phase 4` chooses the next honest materials lane before library, texture, or shader controls widen runtime again

This doc is richer-field-first, not library-first.

### Scope

This family phase owns:
- imported-object material target discovery readiness when the focused reference object currently has no target rows
- richer material field planning after the first editor and action ladder
- typed material owner expansion for the next safe field family
- first UI follow-through for any new fields that actually become owner-backed
- explicit handoff language for broader material library, texture asset, or preset-browser work

This family phase does not own:
- the original object-selection or material-target foundation from `Materials-1`
- the first editable property controls and grouped assignment reuse from `Materials-2`
- Browser hierarchy truth
- texture asset import or storage systems unless a later phase doc explicitly owns them
- viewer-runtime material preview architecture beyond proving the new typed fields are consumable where already appropriate

### Current Live Read

The shipped Materials ladder now proves:
- the `Properties` shell can host the nested `Materials` lane
- focused objects can project material target rows
- selecting a target resolves material truth from per-part assignment, selected preset, or first preset fallback
- editable first-pass fields write through material history
- `New Material`, `Assign Material`, and `Duplicate Material` are owner-routed actions
- grouped all, odd, and even assignment reuse works through one undoable batch history action

Current material field coverage:
- shipped editable fields:
  - `name`
  - `color`
  - `metalness`
  - `roughness`
  - `opacity`
  - `emissive`
  - `emissiveIntensity`
  - `transparent`
  - `Double-sided`
- owner-backed richer field now represented in typed material truth:
  - `doubleSided`, defaulting to `true` to preserve the viewer's current double-sided runtime behavior
- likely next fields once the owner seam is wider:
  - `Normal map`
  - `Normal strength`
  - `Ambient occlusion`
  - `AO strength`
  - `Specular`
  - `Clearcoat`
  - `Clearcoat roughness`
  - `Transmission`
  - `IOR`
  - `Alpha mode`
  - `Alpha cutoff`
  - `UV tiling`
  - `UV offset`
  - `UV rotation`

Current implementation seams:
- `src/app/workspace/materialsSectionViewModel.ts`
  - already reads imported/reference target rows from `referenceWorkspace.partRowsByReferenceId`
  - currently shows `Target discovery pending` when the focused imported object has no stored part rows
- `src/app/store/references/referenceWorkspaceTypes.ts`
  - defines stored reference part rows through `ReferenceWorkspacePartVm`
- `src/app/store/references/referenceWorkspaceState.ts`
  - initializes and helps manage imported reference workspace state
- `src/app/store/useAppStore.ts`
  - owns imported reference records, order, and part-row persistence
- `src/shared/viewSettingsTypes.ts`
  - owns the current `MaterialPreset` type and defaults
  - must be widened before the hosted lane exposes any new owner-backed field
- `src/app/store/uiPrefsStore.ts`
  - owns material preset mutation and sanitization
  - must sanitize any new field family instead of letting UI store raw values
- `src/app/store/materialEditHistory.ts`
  - already wraps material preset updates and batch assignments
  - should remain the write-path seam for new fields
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
  - owns the hosted field controls
  - should project only fields that exist on typed material truth
- viewer material consumers
  - consume exact part-key assignments first and now fall back to whole-import object assignment keys for partless imported references

### First Pass Decisions

1. `Materials-3` should not begin with texture asset slots unless the app already has an honest texture asset owner to point at.
2. The likely smallest first typed field is `doubleSided` because the vision lists it in the first practical family and it does not require texture asset storage.
3. Fields that require external assets, UV transforms, or shader-model expansion should stay in later phases unless Phase 1 proves their owner seams are already ready.
4. Any new field must be added to `MaterialPreset`, defaults, normalization or sanitization, material history comparison, and UI controls together.
5. The hosted lane should never expose controls for fields that are not owner-backed.
6. Material library and preset browsing should get an explicit follow-on handoff if it does not fit beside typed field expansion.

### Implementation Readiness

`Materials-3` should split into three Codex-sized phases:
- `Phase 0` - Imported Object Material Target Discovery - shipped
- `Phase 0.1` - Whole Imported Object Material Target Fallback - shipped
- `Phase 1` - Richer Field Owner Audit And First Field Choice - shipped
- `Phase 2` - First Typed Richer Field Expansion - shipped
- `Phase 3` - Hosted Field Projection And Library Handoff - shipped
- `Phase 4` - Next Materials Lane Routing Audit - active next

### Risks

- richer fields could become UI-only state if the typed owner is not widened first
- texture-like fields could imply asset storage that does not exist yet
- viewer rendering could drift from material truth if new fields are added only to the workspace lane
- material library behavior could crowd out the smaller field-owner work
- imported objects could remain uneditable if reference part rows are missing or not routed into Materials before richer-field work starts

### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
- `src/app/workspace/materialsSectionViewModel.ts`
- `src/app/workspace/materialsSectionViewModel.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/references/referenceWorkspaceTypes.ts`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts`
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- viewer material-consumer files only if the selected field has runtime render consequences

### No-Widening Rule

- do not add texture/map picker UI before a texture asset owner exists
- do not add library browsing into the same pass as first typed field expansion
- do not add unsupported shader fields as inert display rows
- do not move material truth into the workspace lane
- do not widen Browser, object selection, or viewer ownership while adding material fields
- do not start richer-field implementation while focused imported references still cannot expose material targets

### Done Shape

This family phase is in good shape when:
- imported objects can expose stable material target rows to the hosted Materials lane
- the next richer material field family is typed and owner-backed
- the hosted lane exposes only fields the owner can really store
- material history can undo and redo the wider fields
- any still-deferred library, texture, shader, or asset work has a clear follow-on home

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-1. Materials should have a real workspace-family home under Workspace Modes instead of staying only an implied later need.`
- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [ ] `Materials-Gen1-HLG-4. The first Materials family phase should map the real owner seams before broader library, assignment, or preview behavior is planned.`

### `Materials-3 / Phase 0`

- [x] Detect focused imported reference rows and resolve their reference ids reliably.
- [x] Ensure imported/reference part rows reach the Materials target list when they exist.
- [x] Identify whether the current `Target discovery pending` path is caused by missing stored part rows, wrong reference id resolution, or import/load timing.
- [x] Replace the engineer-facing pending state with a user-facing empty or loading message when no material targets are truly available.
- [x] Prove imported objects can show real material target rows before richer field work starts.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-3 / Phase 0.1`

- [x] Add one stable whole-import material target when an imported reference has no stored part rows and no terminal `sourcePartKey`.
- [x] Use a deterministic fallback part key, likely `reference-object:<referenceId>`, so assignment can persist through existing material history.
- [x] Make `Assign Material`, `New Material`, and `Duplicate Material` work against the fallback target.
- [x] Update viewer material consumption so the fallback assignment visibly applies to the whole imported object.
- [x] Keep part-row and terminal-part assignments higher priority than the whole-object fallback when they exist.
- [x] Keep grouped odd/even actions disabled or irrelevant for a single fallback target.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-3 / Phase 1`

- [x] Audit the current typed material owner and mutation seams for richer field readiness.
- [x] Choose the smallest safe first richer field family.
- [x] Decide whether `doubleSided` should be the first typed expansion or whether another field has stronger live owner support.
- [x] Keep texture, UV, and library behavior deferred unless the audit proves an existing owner.
- [x] Start only after imported-object material target discovery is no longer blocking the focused Materials workflow.
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-3 / Phase 2`

- [x] Add the first selected richer field family to typed material truth.
- [x] Update defaults, normalization, sanitization, equality, and material history.
- [x] Add focused tests for owner-backed storage and undo or redo behavior.
- [x] Keep UI projection minimal until the typed owner is stable.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-3 / Phase 3`

- [x] Project the new owner-backed field controls in the hosted Materials lane.
- [x] Prove the controls write through material history and remain scoped to the resolved selected preset.
- [x] Write the explicit follow-on boundary for material library, texture asset, and broader shader work.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`

### `Materials-3 / Phase 4`

- [ ] Audit the live seams for preset/library browsing, texture asset ownership, and the next scalar or shader material field.
- [ ] Choose one next lane instead of adding library, texture, and shader controls together.
- [ ] Produce the exact follow-on implementation handoff, either as a later `Materials-3` phase or a new `Materials-4` family phase doc.
- [ ] Keep runtime code unchanged unless the audit discovers a small documentation-generated correction.
- [ ] `Materials-Gen1-HLG-3`
- [ ] `Materials-Gen1-HLG-4`

## [x] `Materials-3 / Phase 0` - `Imported Object Material Target Discovery`

### Phase 0 Summary

Make focused imported objects expose real material target rows to the hosted Materials lane before richer field work begins.

This phase should prove:
- imported/reference object focus can resolve to the correct reference id
- stored reference part rows become Materials target rows when they exist
- the current `Target discovery pending` state is either fixed or replaced with a clear user-facing empty or loading state
- richer material field work is not blocked by missing imported target discovery

### Phase 0 Implementation Spec

#### Purpose

Close the imported-object target discovery gap that currently prevents some focused imported objects from showing editable material targets.

#### Owns

- focused imported reference row id resolution for Materials
- imported/reference part-row routing into the Materials target list
- the user-facing pending or empty-state copy when no imported material targets are available
- focused proof that imported objects can enter the same target-list and material-editing flow as authored objects

#### Does Not Own

- richer material field implementation
- material library or texture asset browsing
- Browser hierarchy redesign
- viewer-runtime material architecture beyond reading the already stored imported part rows

#### Current Live Read

- `referenceWorkspace.partRowsByReferenceId` already stores `ReferenceWorkspacePartVm` rows for some imported references.
- `buildMaterialsTargetRows(...)` already attempts to read reference rows by matching `buildImportedReferenceRowId(referenceId)` against the focused object id.
- The current runtime can still show `Target discovery pending` for focused imported rows, which means one of the following is true:
  - the imported reference has no stored part rows yet
  - the focused object id does not resolve to the expected reference id
  - the import/load path stores part rows later than the Materials lane reads them
  - the focused object is a terminal imported child whose part-row behavior needs a different material target read

#### First Pass Decisions

1. Treat this as prerequisite readiness work before richer material fields.
2. Preserve `referenceWorkspace.partRowsByReferenceId` as the first material target source for imported references.
3. Do not create a parallel Materials-only imported part store.
4. If imported part rows are genuinely unavailable, make the UI copy user-facing instead of showing implementation terms.
5. Keep assignment keys stable through imported `partKey` values such as `reference-part:<referenceId>:<meshIndex>`.
6. Add focused tests for the failing imported-object shape that currently shows target discovery pending.

#### First Code Cut

This pass should:
- inspect focused imported reference ids from Browser/selection paths
- tighten `buildMaterialsTargetRows(...)` or nearby helpers so imported objects resolve their stored part rows reliably
- keep authored object target rows unchanged
- update the pending/empty copy for imported objects without material rows
- prove that imported references with stored part rows show target rows and can feed selected material reads

#### Verification Shape

- view-model proof for focused imported reference rows with stored part rows
- hosted Materials proof that imported objects show the target list instead of the generic pending state when part rows exist
- proof that a truly partless imported reference gets a clear user-facing empty/loading message
- no richer field tests in Phase 0

#### Shipped Read

`Phase 0` shipped the imported-object target discovery readiness pass.

The shipped lane now proves:
- imported references with stored part rows still project those rows into Materials
- terminal imported part references with `sourcePartKey` and `sourceMeshIndex` now project as a single material target row
- imported assignment keys stay stable through the existing imported part key
- the no-target state now reads as `No material parts found` instead of the old engineer-facing `Target discovery pending`
- richer field work can start without the specific terminal imported-part target discovery gap blocking the selected-target flow

#### Verification

- `npm.cmd exec eslint -- src/app/workspace/materialsSectionViewModel.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`

## [x] `Materials-3 / Phase 0.1` - `Whole Imported Object Material Target Fallback`

### Phase 0.1 Summary

Add a whole-object material assignment fallback for focused imported references that do not expose child part rows or terminal source part keys.

This phase should prove:
- imported objects with no discovered parts can still receive a material assignment
- the fallback target has a stable key that existing material history can write to
- the viewer consumes that fallback so assignment visibly affects the imported object
- part-specific imported assignments remain higher priority whenever real part rows exist

### Phase 0.1 Implementation Spec

#### Purpose

Let the user assign a material to a whole imported object even when the import path cannot expose sub-part material rows.

#### Owns

- whole imported object fallback target rows in the Materials lane
- stable fallback assignment key design, likely `reference-object:<referenceId>`
- material assignment through the existing `Assign Material`, `New Material`, and `Duplicate Material` flows
- viewer material consumption of the fallback assignment
- focused tests for whole-import assignment persistence and visibility-read routing

#### Does Not Own

- richer material field implementation
- texture asset import
- material library browsing
- part-extraction improvements for imports that should eventually expose sub-parts
- replacing real part rows with whole-object fallback rows when real part rows exist

#### Current Live Read

- `Materials-3 / Phase 0` fixed terminal imported part references that already have `sourcePartKey` and `sourceMeshIndex`.
- The user's current focused imported object still shows `No material parts found` because it has no stored `partRowsByReferenceId[referenceId]` rows and no terminal `sourcePartKey`.
- The existing assignment path only needs a stable target `partKey` before it can write through material history.
- UI-only assignment is not enough; the viewer must also resolve the fallback key when rendering the imported object.

#### First Pass Decisions

1. Add the fallback only after stored part rows and terminal source part keys are absent.
2. Use a deterministic whole-object assignment key so the same imported reference keeps the same material target across renders.
3. Prefer `reference-object:<referenceId>` unless live viewer material code already has a better whole-import key convention.
4. Keep real part-row assignments higher priority than whole-object fallback assignments.
5. Hide or disable grouped odds and evens behavior for the single fallback target.
6. Keep the fallback scoped to imported references, not authored graph objects.

#### First Code Cut

This pass should:
- extend imported target discovery to return one fallback target row for partless imported references
- make the fallback row label use the imported reference label and a clear whole-object detail
- verify existing material action flows can assign to the fallback target
- update viewer material resolution to check the whole-import fallback key when part-specific keys are unavailable
- add focused tests for Materials target rows, assignment storage, and viewer fallback consumption

#### Verification Shape

- view-model proof that partless focused imported references get one fallback target row
- hosted UI proof that `Assign Material` can write to the fallback key
- viewer or resolver proof that the fallback key is consumed for imported-object material rendering
- proof that imported references with real part rows still show those part rows instead of the fallback
- build proof

#### Shipped Read

`Phase 0.1` shipped the whole imported object material fallback pass.

The shipped lane now proves:
- partless focused imported references project one stable `reference-object:<referenceId>` Materials target row
- the fallback target appears only after stored part rows and terminal source-part keys are absent
- hosted `Assign Material`, `New Material`, and `Duplicate Material` actions can use the fallback key through existing material history
- grouped odd and even actions remain inert for the single fallback target
- viewer material resolution checks exact rendered part assignments first, then consumes the whole-import fallback key for rendered imported parts

#### Verification

- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesSurface.test.tsx src/viewer/Viewer.test.ts`
- `npm.cmd run build`

## [x] `Materials-3 / Phase 1` - `Richer Field Owner Audit And First Field Choice`

### Phase 1 Summary

Audit the live material owner seams and choose the first safe richer field family.

This phase should prove:
- the next field is chosen from real typed owner readiness, not UI ambition
- texture, UV, and library work are not accidentally pulled into a field-audit pass
- the implementation path for Phase 2 is narrow enough to build safely

### Phase 1 Implementation Spec

#### Purpose

Create the code-grounded handoff for the first richer material field expansion.

#### Owns

- a current owner-seam audit for richer fields
- the first field-family choice for `Materials-3 / Phase 2`
- explicit deferral of fields whose owners are not ready

#### Does Not Own

- source-code field implementation
- UI controls for new fields
- texture asset import or library browsing

#### Current Live Read

- `MaterialPreset` currently supports the fields shipped through `Materials-2`.
- The vision's first practical list still includes `Double-sided`.
- Texture/map, UV, and shader-specific fields have broader owner implications than simple scalar or boolean fields.
- Material history comparison currently enumerates preset fields and must be widened with any new typed field.

#### First Pass Decisions

1. Read `MaterialPreset`, defaults, normalization, sanitization, history equality, and viewer consumers before choosing the first field.
2. Prefer `doubleSided` if it remains the smallest honest owner-backed field.
3. If a different field is chosen, document why its owner and viewer seams are already stronger.
4. Keep the output as a prep update to this doc and the generation index, not runtime behavior.

#### First Code Cut

This pass should:
- inspect the typed material owner and mutation seams
- name the selected first field family for Phase 2
- list exact files and tests Phase 2 should touch
- explicitly defer any field families that require missing owners

#### Verification Shape

- proof-by-doc that the chosen field maps to typed owner, mutation, history, UI, and viewer seams
- proof-by-doc that deferred fields are named rather than silently dropped
- no runtime tests required unless Phase 1 also adjusts docs generated from code

#### Audit Result

`Phase 1` chose `doubleSided` as the first richer typed material field for `Materials-3 / Phase 2`.

Why `doubleSided` is the right next field:
- it is already listed in the first practical material property family in `Materials-Vision.md`
- it is a simple boolean field and does not need texture asset storage, UV transforms, library browsing, or shader graph ownership
- `MaterialPreset` is the correct typed owner because the existing shipped fields already live there
- `uiPrefsStore` can sanitize it as boolean owner state without inventing UI-local material truth
- `materialEditHistory` can include it in snapshot cloning and equality so undo and redo remain material-only
- the viewer already applies `DoubleSide` globally today, so Phase 2 can preserve current behavior by defaulting `doubleSided` to `true`

Phase 2 should not make the viewer less legible by silently changing existing material side behavior. The safe implementation is:
- add `doubleSided: boolean` to `MaterialPreset`
- set every default preset and fallback material preset to `doubleSided: true`
- normalize persisted or older material presets so missing `doubleSided` becomes `true`
- apply `preset.doubleSided ? DoubleSide : FrontSide` in the viewer material consumer
- leave the hosted UI control for Phase 3 unless Phase 2 needs a small store-only proof helper

#### Deferred Field Families

- Texture/map fields remain deferred because there is no honest texture asset owner or picker contract in this phase.
- Normal, ambient occlusion, and UV transform fields remain deferred because they need asset slots, UV storage, and renderer consumption beyond one boolean owner field.
- Specular, clearcoat, transmission, IOR, alpha mode, and alpha cutoff remain deferred because they widen shader/render semantics and should not be introduced as inert UI-only rows.
- Material library, preset browsing, shared material instance, and source metadata remain deferred to a later library or preset-family handoff.

#### Phase 2 Handoff

Exact Phase 2 code cut:
- update `src/shared/viewSettingsTypes.ts` to add `doubleSided` to `MaterialPreset`, default presets, fallback normalization, and cloned material settings
- update `src/app/store/uiPrefsStore.ts` so `sanitizePreset(...)`, `addMaterialPreset(...)`, and partial preset creation preserve or default `doubleSided`
- update `src/app/store/materialEditHistory.ts` so snapshot equality compares `doubleSided` and duplicate material creation preserves it
- update `src/viewer/Viewer.ts` so `applyPresetToMaterial(...)` maps `doubleSided` to `DoubleSide` or `FrontSide`, with defaults preserving the current double-sided render read
- add focused tests in `src/app/store/uiPrefsStore.test.ts`, `src/app/store/materialEditHistoryStore.test.ts`, and `src/viewer/Viewer.test.ts`

Verification target for Phase 2:
- focused ui-prefs tests proving defaulting and sanitization
- material history undo/redo proof for `doubleSided`
- viewer proof that `true` uses double-sided rendering and `false` uses front-sided rendering
- `npm.cmd run build`

## [x] `Materials-3 / Phase 2` - `First Typed Richer Field Expansion`

### Phase 2 Summary

Add the first selected richer field family to typed material truth.

This phase should prove:
- the new field is stored in `MaterialPreset`
- defaults and sanitization keep the field valid
- material history can undo and redo the field
- viewer or downstream consumers remain stable

### Phase 2 Implementation Spec

#### Purpose

Land the owner-backed material field before exposing it broadly in the hosted lane.

#### Owns

- typed material preset expansion
- defaults and normalization or sanitization updates
- material history equality and undo or redo proof
- any narrow runtime consumer update required by the chosen field

#### Does Not Own

- a full UI redesign
- texture asset storage
- material library browsing
- broad shader model work

#### Current Live Read

`Phase 1` chose `doubleSided` as the first typed richer field family, and `Phase 2` has now landed it as owner-backed material preset state.

The viewer runtime keeps the old default by treating missing or default `doubleSided` as `true`, while `false` now maps to `FrontSide` as an explicit opt-out.

#### First Pass Decisions

1. Do not start until `Phase 1` names the chosen first field.
2. Keep the field family small enough to test fully in one pass.
3. Add UI only if the field can be cleanly projected without hiding the owner-backed storage proof.
4. Default `doubleSided` to `true` so the existing CAD preview legibility behavior does not regress.
5. Treat `false` as the new explicit opt-out state that maps to front-sided rendering.

#### First Code Cut

This pass should:
- update the typed material preset shape with `doubleSided: boolean`
- update default material presets, persisted normalization, and sanitization
- update material history snapshot equality and duplicate seed copying
- add store-level tests proving mutation and undo or redo
- update viewer consumers so `doubleSided` controls the material side while preserving the current default render behavior

#### Verification Shape

- typecheck and focused tests for the new field
- material history undo or redo proof
- build proof

#### Shipped Read

`Phase 2` added `doubleSided: boolean` to `MaterialPreset`, default material presets, runtime fallback presets, persisted material normalization, UI-store sanitization, material history equality, duplicate preset seeding, and the viewer material consumer.

The shipped default is intentionally `true` so existing CAD preview legibility stays unchanged. A material preset with `doubleSided: false` now renders through `FrontSide`.

Hosted UI projection remains deferred to `Phase 3`; the field is real owner state first, then it can become a compact lane control.

#### Verification

- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts src/app/store/materialEditHistoryStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`

## [x] `Materials-3 / Phase 3` - `Hosted Field Projection And Library Handoff`

### Phase 3 Summary

Expose the new owner-backed field in the hosted Materials lane and write the next library boundary.

This phase should prove:
- richer fields appear only after typed ownership exists
- UI controls edit the resolved selected preset through material history
- broader material library, preset browsing, texture asset, and shader work have an explicit next home

### Phase 3 Implementation Spec

#### Purpose

Complete the first richer-field loop from typed owner to hosted UI.

#### Owns

- hosted lane controls for the Phase 2 field family
- focused selected-target editing proof
- the next explicit planning handoff for material library or shader work

#### Does Not Own

- material library implementation
- texture asset import
- shader graph or advanced render pipeline work
- new object or Browser ownership

#### Current Live Read

`Phase 2` landed `doubleSided` as the first typed field family. `Phase 3` now projects it in the hosted Materials lane as a compact selected-material checkbox.

#### First Pass Decisions

1. Reuse the existing selected material preset edit pattern from `Materials-2 / Phase 1`.
2. Keep controls compact and scoped to the selected resolved preset.
3. Write a follow-on doc if material library or texture work is now the next real step.
4. Project `doubleSided` as one checkbox row beside the existing boolean `transparent` row.
5. Label the control `Double-sided` and keep the copy user-facing: checked means the material renders from both sides, unchecked means front side only.
6. Do not add texture, library, shader, or preset-browser controls in this phase.

#### First Code Cut

This pass should:
- add `doubleSided` to `materialControlRows` in `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- render it as `input[type="checkbox"]` with `aria-label="Edit double-sided rendering"`
- route writes through `updateResolvedPreset({ doubleSided: event.currentTarget.checked })`
- preserve `New Material`, assign, duplicate, and grouped assignment flows
- keep `createNewMaterialSeed(...)` preserving `doubleSided` from the selected preset, as Phase 2 already added
- update `src/app/workspace/PropertiesSurface.test.tsx` so the hosted lane exposes the control, clicking it updates `default_matte.doubleSided`, and the edit lands in material history
- update the docs with the next library or shader handoff

#### Verification Shape

- hosted UI test for editing `doubleSided`
- store history proof remains intact through the same `Edit material properties` source path
- build proof

#### Prepared Implementation Read

`Phase 3` is ready to implement.

The implementation should be a narrow hosted-lane projection pass:
- no new owner state
- no viewer changes
- no new history helper
- no texture or material-library implementation

The likely runtime edit is one checkbox row in the selected material property controls. It should follow the existing `transparent` control pattern and use the already-landed `doubleSided` field.

The explicit library handoff should stay documentation-only in this phase. After the checkbox lands, the next material-family planning surface can decide whether to open a material-library/preset-browser phase, a texture asset owner phase, or another typed shader-field phase.

#### Shipped Read

`Phase 3` shipped the owner-backed hosted projection for `doubleSided`.

The hosted Materials lane now includes a `Double-sided` checkbox beside the other selected material property controls. Checking it keeps the current double-sided viewer behavior; unchecking it writes `doubleSided: false`, which the viewer already consumes as front-sided rendering.

This pass did not implement a material library, texture asset picker, shader graph, or broader preset browser. Those remain the explicit next planning choices after the first richer-field loop is complete.

#### Verification

- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx src/app/store/uiPrefsStore.test.ts src/app/store/materialEditHistoryStore.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`

## [ ] `Materials-3 / Phase 4` - `Next Materials Lane Routing Audit`

### Phase 4 Summary

Choose the next honest Materials lane after the first owner-backed richer field is fully projected.

This phase should prove:
- material library or preset browsing is not added before its owner shape is explicit
- texture fields are not added before texture asset ownership exists
- the next scalar or shader field is not added before the viewer/material type consequences are understood
- the next implementation handoff is narrow enough for one Codex pass

### Phase 4 Implementation Spec

#### Purpose

Turn the Phase 3 library/texture/shader handoff into one concrete next-lane decision.

#### Owns

- live seam audit for material presets, assignment UI, and any library-like state that already exists
- live seam audit for texture asset ownership or the lack of it
- live seam audit for the next owner-backed non-texture material fields
- one explicit next-lane recommendation and implementation-ready handoff

#### Does Not Own

- runtime material library implementation
- texture upload, texture storage, or map-slot UI
- shader graph work
- adding more hosted controls in the same pass
- moving material truth out of `MaterialPreset`

#### Current Live Read

The hosted Materials lane now edits:
- `name`
- `color`
- `metalness`
- `roughness`
- `opacity`
- `emissive`
- `emissiveIntensity`
- `transparent`
- `doubleSided`

The lane already has material creation, assignment, duplicate, grouped assignment, and a preset select for assigning existing presets. That is not yet a full material library or preset browser.

Texture and map-like fields remain deferred because no texture asset owner, texture picker, map-slot persistence model, or viewer texture-loading contract has been proven in this family.

The next possible non-texture material fields include:
- `alphaMode`
- `alphaCutoff`
- `clearcoat`
- `clearcoatRoughness`
- `ior`
- `transmission`
- `specular`

Those need a viewer/material-consumer audit before implementation because the current viewer material path is based on the existing material preset fields and may need a material-type or property-support decision.

#### First Pass Decisions

1. Treat Phase 4 as documentation-first unless a tiny correction is required to keep the docs in sync with live code.
2. Prefer a material-library or preset-browser lane only if the audit can name an owner for reusable material identity beyond the current `ViewSettings['materials'].presets`.
3. Prefer a texture lane only if an asset owner and viewer texture-loading path can be named without inventing panel-local state.
4. Prefer another scalar or shader field only if it can be represented in `MaterialPreset`, sanitized in `uiPrefsStore`, compared in material history, projected in the hosted lane, and consumed by the viewer without a broad render-pipeline rewrite.
5. If none of the lanes are implementation-ready, create the smallest owner-prep phase instead of adding inert controls.

#### First Code Cut

This pass should:
- inspect `src/shared/viewSettingsTypes.ts` for current material owner shape
- inspect `src/app/store/uiPrefsStore.ts` and `src/app/store/materialEditHistory.ts` for mutation and history seams
- inspect `src/app/workspace/PropertiesMaterialsSectionContent.tsx` and `src/app/workspace/PropertiesSurface.test.tsx` for hosted projection and proof patterns
- inspect `src/viewer/Viewer.ts` for material consumer support and material class constraints
- inspect the Materials vision/index docs for library and texture boundaries
- update this doc and `Materials-Gen1-Index.md` with the chosen next lane and exact follow-on implementation checklist

#### Verification Shape

- documentation proof naming the selected next lane
- documentation proof naming the deferred lanes and why they remain deferred
- no runtime tests required unless Phase 4 makes a source-code correction
- `docs/Doc-Log.md` entry for the prep or audit result

#### Prepared Implementation Read

`Phase 4` is ready to implement as a documentation-first routing audit.

The expected output is not another control. The expected output is one clear next implementation target:
- the now-reserved `Materials-4` open follow-through lane if cleanup or the audit produces a concrete owner-backed scope
- a `Materials-4` material library or preset browsing doc if reusable material identity is ready to plan
- a texture asset owner phase if texture storage and viewer loading can be grounded
- a later `Materials-3 / Phase 5` typed field expansion if the next scalar or shader field is honestly smaller
- or an owner-prep cleanup phase if none of those lanes are ready
