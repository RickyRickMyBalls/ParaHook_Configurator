# Materials 1 - Workspace Foundation And Material Owner Read

## Doc Header

### Doc History
8. 2026-05-10 13:48:22: Implemented and closed `Materials-1 / Phase 3 - First Material Property Projection And Action Handoff` by adding the selected-target material read helper, projecting display-only material properties in the hosted lane, proving per-part and preset fallback resolution, and closing the `Materials-1` foundation ladder for the later `Materials-2` editing pass.
7. 2026-05-10 13:41:08: Prepped `Materials-1 / Phase 3 - First Material Property Projection And Action Handoff` for implementation by grounding the selected-target material read against the shipped lane-local target rows, the current `ViewSettings['materials']` preset and per-part assignment truth, and disabled action handoff affordances that keep editable material mutation deferred to `Materials-2`.
6. 2026-05-10 13:37:50: Implemented and closed `Materials-1 / Phase 2 - Material-Bearing Target List Projection And Selection Flow` by extending the materials VM with normalized target rows, projecting authored object part keys and imported/reference stored part rows in the hosted lane, keeping selected material target state lane-local, and advancing the foundation ladder to `Phase 3 - First Material Property Projection And Action Handoff`.
5. 2026-05-10 13:31:45: Prepped `Materials-1 / Phase 2 - Material-Bearing Target List Projection And Selection Flow` for implementation by grounding it against the shipped phase-1 materials VM/content split, the exported `resolveOwnedContentSelection(...)` authored-object part-key path, the imported-reference `ReferenceWorkspacePartVm` rows keyed through `buildImportedReferenceRowId(...)`, and a lane-local selected-target state that must not mutate app-global workspace selection.
4. 2026-05-10 13:25:24: Implemented and closed `Materials-1 / Phase 1 - Focused Object Intake And Current Material Truth Read` by adding a lane-local materials phase-1 view model, replacing the hosted `Materials` placeholder with a read-only focused-object/material-owner seam projection, proving no editable controls ship in the first pass, and advancing the foundation ladder to `Phase 2 - Material-Bearing Target List Projection And Selection Flow`.
3. 2026-05-10 13:22:23: Tightened `Materials-1 / Phase 1` for implementation by adding the old materials-window reference as the minimum full-ladder UX contract, grounding the first code cut against the live hosted placeholder, typed view-material truth, history-wrapped mutation seam, viewer per-part consumer, and reference-part descriptor path, and clarifying that Phase 1 must prepare the VM seam without prematurely shipping the full editor.
2. 2026-05-10 13:15:16: Expanded the `Materials-1` ladder to add explicit `Phase 2 - Material-Bearing Target List Projection And Selection Flow` and `Phase 3 - First Material Property Projection And Action Handoff` planning sections, keeping the first family doc as the full foundation ladder before the later editing-focused `Materials-2` follow-on begins.
1. 2026-05-10 13:05:32: Created this standalone `Materials-1` family phase doc and prepped `Phase 1 - Focused Object Intake And Current Material Truth Read` for implementation by grounding the first runtime cut against the landed `Properties` shell contract, the current workspace-selection object-target seam, the existing reference-part descriptor read path, and the current viewer or ui-prefs material truth that still lives outside the `Properties -> Materials` lane.

### Purpose

This doc owns the first runtime foundation for the nested `Materials` lane inside `Properties`.

Use it to answer:
- how `Materials` should start from the landed `Properties` shell
- what the first focused-object materials read should be
- where current material truth likely lives today
- what the first `Materials` lane should own versus only project

Do not use it for:
- redefining the already-landed `Properties` shell contract
- pretending the full material editor is already implementation-ready
- broad library, shader, assignment, or preview-system planning that depends on later owner clarification

## Doc Body

### Short Version

`Materials-1` should begin as the first real child-lane runtime pass inside the landed `Properties` shell.

The first honest read is still foundational:
- inherit focused-object context from the shell instead of rebuilding routing
- identify the first material-bearing target read that can actually be projected in the lane
- map current material truth and mutation seams without claiming a new owner
- stop before a broad materials editor is pretended into existence

This family phase should split into three Codex-sized passes:
- `Phase 1` reads focused object intake plus current material truth - shipped
- `Phase 2` projects the first material-bearing target list and target selection flow - shipped
- `Phase 3` projects the first material-property read plus action handoff without widening into the full editor - shipped

### Old Materials Window Reference Minimum

The attached older-generation ParaHook materials window is not the architecture source, but it is the user-facing baseline for the combined `Materials-1` and `Materials-2` outcome.

The new stack should adapt the flow to the current `Properties -> Materials` workspace instead of copying the old floating window, but the full first materials ladder should have no less than the old visible capability:
- a clear `Materials` surface title and close or shell framing through the shared workspace model
- a focused item read such as `Focused item: Footpad_2`
- an object-part or material-target list for the focused object
- target selection rows, including repeated material/slot labels when multiple slots exist
- grouped target actions equivalent to `Select All Odds` and `Select All Evens` once multi-target selection is honest
- visible material properties for the selected target, at minimum color, metalness, roughness, and opacity
- a color swatch plus editable color value
- a first-class `New Material` action
- a material or preset list that includes defaults such as `Default Material`, `White`, `Gray`, `Black`, `Blue`, and `Red`

Implementation routing:
- `Materials-1 / Phase 1` prepares the focused-object and material-truth VM seam that can support this baseline later.
- `Materials-1 / Phase 2` owns the first focused target list and selection behavior.
- `Materials-1 / Phase 3` owns the selected-target material-property read and action handoff.
- `Materials-2` owns editable property controls, `New Material`, assignment, duplication, and any honest grouped or preset-list action flow.

Important boundary:
- do not treat the screenshot as permission to rebuild the old repo's shell or hidden ownership model
- do treat it as a minimum UX completeness bar for the first finished materials ladder

### Scope

This family phase owns:
- the first `Materials` lane runtime foundation inside `Properties`
- the first code-grounded material owner-boundary read
- the first object-focused target projection direction
- the first implementation-ready handoff into later target-list and property-read passes

This family phase does not own:
- the `Properties` shell contract, active section framing, or shell-owned empty states
- the final material owner model for the whole repo
- a full material field editor
- broad library, preset-browser, or preview-authoring behavior

### Current Live Read

The live app seams now point at one honest first `Materials` runtime ladder:

- `src/app/workspace/PropertiesSurface.tsx`
  - already owns the active `Materials` section host inside the landed `Properties` shell
  - already passes one explicit section context into the hosted lane
  - should remain the shell owner while `Materials-1` widens only the child-lane runtime
- `src/app/workspace/PropertiesMaterialsSection.tsx`
  - owns the section registration wrapper for the hosted `Materials` lane
  - should remain a thin definition file instead of carrying hook-heavy component logic
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
  - now renders the hosted lane content from shell context plus the lane VM
  - is the likely first host for Phase 2 target-list UI and lane-local selected-target state
- `src/app/workspace/materialsSectionViewModel.ts`
  - now owns the phase-1 material owner read model
  - is the likely helper to extend with Phase 2 target-row shaping instead of inventing a second VM file unless the target-list logic becomes large enough to split
- `src/app/workspace/propertiesSectionContract.tsx`
  - already owns the explicit shell-to-section contract
  - already guarantees that `Materials` only opens when the focused target is an object
  - should stay the top-level section contract instead of being replaced by materials-local routing
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts`
  - already owns focused-target selection flow at the app level
  - already distinguishes object selection from part, graph, and reference-target selection
  - is the honest upstream seam for the focused object entering `Materials`
- `src/app/store/useAppStore.ts`
  - exports `resolveOwnedContentSelection(...)`, which resolves authored object targets into real `partKeys`
  - exports `buildImportedReferenceRowId(...)`, which is the stable row-id bridge for matching an object row back to an imported reference record
  - defines `ReferenceWorkspacePartVm`, which already carries `rowId`, `partKey`, `label`, and `sourceMeshIndex` for loaded multi-part reference content
  - should be read by the lane through selectors or narrow helper inputs, not mutated by lane-local target selection
- `src/shared/viewSettingsTypes.ts`
  - already defines current material preset truth, selected preset truth, per-part material mode, and per-part assignment mapping
  - exposes one real typed material snapshot, but that snapshot is still view-settings-scoped rather than clearly object-owned inside `Properties`
- `src/app/store/uiPrefsStore.ts`
  - already owns the live mutation seam for material presets, per-part mode, and per-part assignment
  - is currently the practical source of truth for runtime material settings
  - should be treated as the current owner seam to read honestly, not as proof that the long-range owner model is settled
- `src/app/store/materialEditHistory.ts`
  - already wraps the current material mutations in explicit history entries
  - proves that the repo already has a real material mutation path, even though it is still routed through view settings
- `src/viewer/Viewer.ts`
  - already consumes `view.materials` and resolves per-part materials through `resolveMaterialForPart(...)`
  - already maps per-part assignment by `partKey`
  - proves that the viewer is a consumer of material truth, not the intended top-level `Materials` lane owner
- `src/viewer/referencePartDescriptors.ts`
  - already exposes one deterministic part-descriptor read for multi-mesh reference objects
  - is the clearest existing target-list seam for imported reference content
- `src/viewer/referenceStructureInspection.ts`
  - already packages those part descriptors into object-structure inspection summaries
  - suggests that imported or reference-backed objects may already have material-bearing target descriptors available before `Materials` invents its own part-discovery model

What is still missing is the clean bridge between:
- focused object selection from the landed `Properties` shell
- object-specific target discovery the hosted `Materials` lane can project
- the current typed material truth that still lives in shared view settings and viewer consumption paths

### First Pass Decisions

1. `Materials-1` must start from the landed shell contract and must not recreate top-level `Properties` routing.
2. The first pass should be object-first and read-only enough to make the owner seams explicit before broad editor behavior begins.
3. The current material truth should be read honestly from `view.materials` plus the viewer's per-part consumption seam, even if that truth is still too view-scoped for the final architecture.
4. The first materials target-list direction should prefer existing explicit descriptors such as reference-part descriptors or resolved content selection over viewer-only mesh crawling from inside the workspace lane.
5. The first runtime pass should define one lane-local VM or helper seam for focused object plus material-bearing targets before any real property field editing is attempted.

### Implementation Readiness

`Materials-1` should split into three Codex-sized runtime-foundation phases:
- `Phase 1` - Focused Object Intake And Current Material Truth Read - shipped
- `Phase 2` - Material-Bearing Target List Projection And Selection Flow - shipped
- `Phase 3` - First Material Property Projection And Action Handoff - shipped

### Risks

- the lane could bypass the landed shell and free-read app state again
- the first pass could mistake viewer consumption truth for the final long-range materials owner model
- the lane could invent ad hoc target discovery instead of reusing explicit part or content seams
- broad property editing could widen before the object-to-target bridge is honest

### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-2 - Shared Properties Workspace Shell And Section Hosting.md`
- `src/app/workspace/PropertiesMaterialsSection.tsx`
- `src/app/workspace/propertiesSectionContract.tsx`
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts`
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/referenceStructureInspection.ts`
- `src/viewer/Viewer.ts`

### No-Widening Rule

- do not rebuild `Properties` shell framing or shell-owned empty states here
- do not ship the whole materials editor in the first pass
- do not invent a second hidden material owner inside the workspace lane
- do not treat viewer-only mesh state as the only legal target-discovery source if an app-level descriptor seam already exists

### Done Shape

This family phase is in good shape when:
- the first `Materials` lane begins from the landed shell contract
- the current material truth and mutation seams are explicitly mapped
- the first object-to-target read is honest enough to support a later target-list pass
- later property editing can widen without first untangling shell glue or hidden owner assumptions

## Vision

`Materials-1` turns the nested `Materials` lane from a placeholder hosted section into a real child-lane runtime path.

The intended Generation 1 read is:
- `Properties-2` already landed the shell
- `Materials-1` now owns the first lane-specific owner read
- later `Materials-2` or follow-on passes can widen target list, property projection, and action flow only after that foundation is honest

Important promise:
- this first pass should make the owner seams clearer, not hide them behind a premature editor UI

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-1. Materials should have a real workspace-family home under Workspace Modes instead of staying only an implied later need.`
- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [ ] `Materials-Gen1-HLG-4. The first Materials family phase should map the real owner seams before broader library, assignment, or preview behavior is planned.`

### `Materials-1 / Phase 1`

- [x] Read focused object intake from the landed `Properties` shell contract.
- [x] Map the current typed material truth and mutation seams without overclaiming them as the final owner model.
- [x] Define the first lane-local read model for focused object plus material-bearing target discovery.
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-1 / Phase 2`

- [x] Project the first material-bearing target list for the focused object.
- [x] Define the first target selection flow inside the hosted `Materials` lane.
- [x] Keep target discovery downstream from explicit object or descriptor seams.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-1 / Phase 3`

- [x] Project the first selected-target material read.
- [x] Define the first action handoff for later `New Material`, assign, or edit behavior without widening into the full editor.
- [x] Close the first `Materials-1` ladder so later runtime passes can widen honestly.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

## [x] `Materials-1 / Phase 1` - `Focused Object Intake And Current Material Truth Read`

### Phase 1 Summary

Start the first real `Materials` runtime pass from the landed `Properties` shell and map the current material truth honestly.

This phase should prove:
- the hosted `Materials` lane can inherit focused object context from the shell
- the lane can identify the current typed material truth and mutation seams without pretending the final owner model is settled
- the first lane-local read model can be defined before target-list or property-edit UI widens

### Phase 1 Implementation Spec

#### Purpose

Create the first runtime owner-boundary read for the hosted `Materials` lane.

#### Owns

- focused object intake from the shell contract
- current material truth read mapping
- the first lane-local VM or helper seam for target discovery follow-through

#### Does Not Own

- the final material target-list UI
- editable property controls
- new-material or assignment actions

#### Current Live Read

- `PropertiesMaterialsSection.tsx` already receives `PropertiesSectionContext`, which means `Materials-1` can start from `selectedTarget` plus `focusSummary` without new top-level glue.
- `PropertiesMaterialsSection.tsx` is still only a placeholder card stack, so the first implementation pass should replace that placeholder with a real lane-local read model rather than adding more explanatory copy.
- `propertiesSectionContract.tsx` already prevents the lane from opening unless the focused target is an object, which is the current boundary for the first object-first pass.
- `workspaceSelectionAppStoreSlice.ts` is the upstream owner for focused object selection and already supports explicit object selection as a first-class target kind.
- `viewSettingsTypes.ts` defines the current typed material snapshot as `view.materials`, including `presets`, `selectedPresetId`, `usePerPart`, and `perPart`.
- `uiPrefsStore.ts` currently owns material mutations through `selectMaterialPreset`, `updateMaterialPreset`, `addMaterialPreset`, `deleteMaterialPreset`, `setUsePerPartMaterial`, `assignPartMaterial`, `clearPartMaterial`, and `setPerPartMaterialMap`.
- `materialEditHistory.ts` wraps current material mutations in explicit undo/redo history entries, proving the current mutation seam exists and should be named honestly even before `Materials-2` starts using it.
- `Viewer.ts` consumes the current material truth by `partKey` through `resolveMaterialForPart(...)`, which makes it the clearest current consumer seam but not the intended workspace owner.
- `referencePartDescriptors.ts` and `referenceStructureInspection.ts` already expose the clearest explicit material-bearing target descriptor path for multi-part reference content.
- the current object-focused shell passes only a selected object id and focus summary; Phase 1 must either derive a legal descriptor-read status from existing seams or explicitly mark target discovery as not yet available for that object kind.

#### First Pass Decisions

1. The first pass should replace the placeholder explanatory copy in `PropertiesMaterialsSection.tsx` with a lane-local read that names the current focused object and current material truth seam.
2. The first pass should prefer a local `Materials` VM or helper file over embedding all owner-read logic inline inside the section component.
3. The first pass should stay read-focused and documentation-honest even if the current truth still routes through `useUiPrefsStore`.
4. The phase should explicitly call out whether the focused object currently has a target-discovery seam or whether later work still needs one.
5. The phase should preserve the old-window baseline as a future-facing read in the UI copy or VM contract only where it helps the next phases, without adding grouped selection, property editors, or material creation in Phase 1.

#### First Code Cut

This first pass should:
- keep the hosted lane inside `PropertiesMaterialsSection.tsx` or a close local extraction
- read the focused object from the shell context instead of from app-global selectors
- define one helper or VM seam that reports:
  - focused object label and id from the shell context
  - current material truth source as typed view settings
  - current mutation source as ui-prefs plus material edit history
  - current viewer consumer as per-part `partKey` resolution
  - current object-to-target discovery status
  - the minimum old-window feature groups still owed by later phases
- render that read in a way that makes the next target-list pass obvious, with explicit rows for focused object, material truth, mutation/history seam, viewer consumer seam, and target-discovery readiness
- stop before real target selection, material property controls, or mutation UI

#### Verification Shape

- focused section proof that the hosted `Materials` lane still receives object context only through the shell contract
- proof that the lane names the current material truth or mutation seam explicitly
- proof that unsupported or empty states remain shell-owned and are not recreated locally in the materials lane
- proof that Phase 1 does not add editable controls, grouped target selection, material creation, or preset assignment yet
- proof that the first VM makes the screenshot-derived minimum follow-on capability visible to the planning handoff without pretending it is already shipped

#### Likely Files

- `src/app/workspace/PropertiesMaterialsSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/workspace/propertiesSectionContract.tsx` only if the phase needs one tiny metadata widening
- one new local materials VM or helper under `src/app/workspace/`, likely a `materialsSectionViewModel`-style helper if the local naming pattern stays simple
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts`
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/referenceStructureInspection.ts`

#### No-Widening Rule

- do not add real property editors here
- do not add mutation UI here
- do not add `New Material`, assign, duplicate, odds/evens, or preset-list behavior here
- do not widen the shell contract beyond what the lane truly needs for the read model
- do not make the materials lane responsible for shell-owned unsupported or empty states

#### Implementation Risks

- if the first pass hides the current material truth behind vague copy, `Phase 2` still will not know which owner seam it can trust
- if the lane free-reads app stores directly, later materials extraction will bypass the landed shell contract
- if target discovery is assumed instead of explicitly read or marked missing, the next target-list phase can overclaim readiness

#### Shipped Read

`Phase 1` shipped a lane-local materials phase-1 view model and replaced the hosted placeholder with a read-only seam projection.

The shipped lane now proves:
- focused object id enters through `PropertiesSectionContext`
- material truth is named as typed `view.materials`
- mutations and undo/redo are named as `uiPrefsStore + materialEditHistory`
- viewer material consumption is named as per-part `partKey` resolution
- descriptor-backed target discovery is explicitly pending for `Phase 2`
- the old materials-window baseline is reserved as later work without shipping editor controls early

#### Verification

- `npm.cmd exec eslint -- src/app/workspace/materialsSectionViewModel.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesMaterialsSection.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts`
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`

## [x] `Materials-1 / Phase 2` - `Material-Bearing Target List Projection And Selection Flow`

### Phase 2 Summary

Project the first real material-bearing target list for the focused object and define the first target selection flow inside the hosted lane.

This phase should prove:
- the hosted `Materials` lane can show explicit target identity for the current focused object
- one target can become the selected material target without inventing a second object-selection owner
- the target list stays downstream from real object or descriptor seams instead of viewer-only crawling
- imported/reference targets can show the same kind of part-row identity the old materials window showed, while authored graph objects can at least project their resolved part key as the first material target

### Phase 2 Implementation Spec

#### Purpose

Turn the owner-read foundation from `Phase 1` into the first real object-focused target list inside the `Materials` lane.

#### Owns

- the first target-list VM for the focused object
- lane-local selected-target UI state
- the first explicit target identity projection inside the hosted lane

#### Does Not Own

- editable material property controls
- new-material or assignment actions
- broad multi-target behavior

#### Current Live Read

- `Phase 1` has already shipped `materialsSectionViewModel.ts` and `PropertiesMaterialsSectionContent.tsx`, so Phase 2 should extend that seam instead of reintroducing placeholder card logic.
- `PropertiesMaterialsSection.tsx` should remain a thin section definition wrapper; target-list UI belongs in `PropertiesMaterialsSectionContent.tsx` or a close extracted child component.
- `resolveOwnedContentSelection(...)` already resolves authored project object targets into `partKeys`; for a single authored object this is the first honest target-list source.
- `ReferenceWorkspaceState.partRowsByReferenceId` already stores `ReferenceWorkspacePartVm` rows with `rowId`, `partKey`, `label`, and `sourceMeshIndex` for loaded imported/reference content.
- `buildImportedReferenceRowId(referenceId)` provides the stable bridge from a selected object row id back to imported reference records, so Phase 2 can support loaded imported/reference object rows without crawling viewer meshes.
- `referencePartDescriptors.ts` plus `referenceStructureInspection.ts` remain the origin of truthful imported part descriptors, but the `Materials` lane should prefer stored app/runtime rows over re-running inspection inside the workspace.
- `workspaceSelectionAppStoreSlice.ts` already owns upstream focused object selection and should remain the only owner for object-level selection.
- the current repo still does not prove one unified app-level material-bearing target seam for every object type, so this phase must stay honest about which object kinds can actually project target rows now.

#### First Pass Decisions

1. Selected material target state belongs to the hosted `Materials` lane, not to the umbrella `Properties` shell.
2. The first target list should prefer explicit descriptors and resolved content seams over viewer mesh traversal from inside the workspace lane.
3. The first phase-2 pass can support only the object families whose target descriptors are already honest, as long as unsupported object kinds are explicit.
4. The target list should stay single-select in the first pass.
5. Target rows should use one lane-local shape with at least `targetId`, `label`, `partKey`, `sourceKind`, and a short `detail` so Phase 3 can read the selected target without re-deriving identity from DOM text.
6. If a focused object resolves to exactly one authored `partKey`, render that as the first single target row instead of reporting the object as unsupported.
7. If a focused imported/reference object has stored `ReferenceWorkspacePartVm` rows, render those rows in their stored order.
8. If no target rows can be derived, render an explicit lane-local "target discovery pending" state inside the hosted lane while keeping shell-owned unsupported states unchanged.

#### First Code Cut

This pass should:
- extend the current materials VM or introduce one close helper that maps the focused object plus app target sources into visible material target rows
- read the focused object through `PropertiesSectionContext`
- read authored object part keys through `resolveOwnedContentSelection(...)`
- read imported/reference object part rows through `referenceWorkspace.importedReferencesById`, `importedReferenceOrder`, `partRowsByReferenceId`, and `buildImportedReferenceRowId(...)`
- render the target list in the upper portion of the `Materials` lane, above the existing owner-read and old-window-baseline sections or in a clearly labeled first group
- allow one target row to become the selected material target inside the lane through component-local state
- default the selected target to the first available row and keep that default stable when the focused object changes
- keep shell-owned unsupported and empty states above the lane unchanged
- stop before editable material property controls or mutation actions begin

#### Verification Shape

- focused section proof that the hosted lane projects explicit target rows for supported focused objects
- proof that selecting one target only mutates lane-local selected-target state and does not rewrite top-level workspace selection ownership
- proof that object kinds without target descriptors remain explicitly unsupported instead of silently rendering fake rows
- focused VM proof for:
  - authored object target rows from `resolveOwnedContentSelection(...)`
  - imported/reference object target rows from stored `ReferenceWorkspacePartVm` rows
  - no-target pending state when neither source produces rows
- UI proof that editable material controls, `New Material`, assignment, duplicate, odds/evens, and preset-list behavior still do not ship in Phase 2

#### Likely Files

- `src/app/workspace/materialsSectionViewModel.ts`
- `src/app/workspace/materialsSectionViewModel.test.ts`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/app/workspace/PropertiesMaterialsSection.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/store/useAppStore.ts` only if a narrow exported selector is truly needed
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts` only if one tiny selector widening is truly needed
- avoid changing `src/viewer/referencePartDescriptors.ts` or `src/viewer/referenceStructureInspection.ts` unless the stored descriptor shape is insufficient

#### No-Widening Rule

- do not add property editing controls here
- do not add mutation UI here
- do not add `New Material`, assign, duplicate, odds/evens, or preset-list behavior here
- do not promote lane-local target selection into app-global focused selection ownership
- do not assume every focused object already has one legal target-discovery seam
- do not crawl live viewer meshes or Three.js object trees from the workspace lane
- do not mutate `workspaceSelection.selectedTarget`, `explicitSelectedTargets`, or `resolvedContentSelection` when the user selects a material target row

#### Implementation Risks

- if target identity is vague, later property editing will still not know what it is editing
- if the lane infers targets from viewer internals only, the workspace can drift into viewer-owned shadow truth
- if selected target state leaks upward, the shell and lane boundaries will blur again
- if the first target-list VM mixes authored graph part keys and imported reference part rows without a normalized lane-local target shape, Phase 3 will have to rebuild the identity contract before it can show material reads

#### Shipped Read

`Phase 2` shipped normalized `MaterialsTargetRow` support in the materials VM and rendered the first target-list section inside the hosted lane.

The shipped lane now proves:
- authored object target rows derive from `resolveOwnedContentSelection(...)` part keys
- imported/reference object target rows derive from stored `ReferenceWorkspacePartVm` rows through `buildImportedReferenceRowId(...)`
- material target selection stays component-local and does not rewrite app-global workspace selection
- objects without target rows show an explicit lane-local pending state
- editor controls, material writes, `New Material`, assignment, duplicate, odds/evens, and preset-list behavior remain deferred

#### Verification

- `npm.cmd exec eslint -- src/app/workspace/materialsSectionViewModel.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts`
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`

## [x] `Materials-1 / Phase 3` - `First Material Property Projection And Action Handoff`

### Phase 3 Summary

Project the first selected-target material read and close the foundation ladder with one clear handoff into later editing behavior.

This phase should prove:
- the selected target can reveal its current material read in the lower portion of the lane
- the lane can name the first future actions without pretending they are fully implemented
- `Materials-1` ends with an honest object -> target -> material-read flow

### Phase 3 Implementation Spec

#### Purpose

Close the first `Materials-1` ladder by turning selected-target identity into a real material-property read surface and explicit next-action handoff.

#### Owns

- the first selected-target material read projection
- the first lower-pane property-read framing
- the handoff seam for later `New Material`, assign, duplicate, and edit flows

#### Does Not Own

- editable field controls
- mutation UI
- richer library or multi-target reuse behavior

#### Current Live Read

- `Phase 2` now provides normalized `MaterialsTargetRow` values with stable `targetId`, `label`, `partKey`, `sourceKind`, and `detail` fields.
- `PropertiesMaterialsSectionContent.tsx` now keeps the active material target in lane-local state and falls back to the first projected row when no local target has been clicked yet.
- `viewSettingsTypes.ts` defines `MaterialPreset` with `name`, `color`, `metalness`, `roughness`, `emissive`, `emissiveIntensity`, `opacity`, and `transparent`, plus `selectedPresetId`, `usePerPart`, and `perPart` assignment mapping.
- `uiPrefsStore.ts` and `materialEditHistory.ts` already define the mutation path for presets and per-part assignment, but Phase 3 should only read that truth.
- `Viewer.ts` already resolves effective material by `partKey`; the lane should mirror that typed read path from `ViewSettings['materials']` instead of pulling live mesh state out of the viewer.
- the vision already calls out practical property controls and first-class actions, but this phase should show them as read-only facts or disabled/reserved handoff affordances until `Materials-2`.

#### First Pass Decisions

1. The selected-target material read should live in `materialsSectionViewModel.ts` beside target-row shaping unless implementation pressure proves it needs a split file.
2. The read helper should accept the selected `MaterialsTargetRow` plus `ViewSettings['materials']` and return one explicit read result instead of letting the component derive material state inline.
3. Effective material resolution should follow current viewer behavior: use `materials.perPart[target.partKey]` only when `usePerPart` is enabled and the mapped preset exists, otherwise use `selectedPresetId` when it exists, otherwise fall back to the first preset, otherwise expose an explicit missing-material read.
4. The read surface should show the selected target, assignment source, material name, color swatch/value, metalness, roughness, opacity, and any currently modeled transparent/emissive facts that can be shown without editing.
5. `New Material`, `Assign Material`, and `Duplicate Material` should appear as disabled or reserved handoff actions only, with no mutation callbacks and no editable form controls.
6. `Materials-1` should close once the lane can project focused object, selected target, and current material read without shell glue.

#### First Code Cut

This pass should:
- add the first lower-pane selected-target material read surface
- extend the VM with a selected-target material-read helper that resolves per-part override, selected preset, first-preset fallback, and missing-preset states
- render the property read below the target list in `PropertiesMaterialsSectionContent.tsx`
- include color, metalness, roughness, opacity, and current transparent/emissive facts as display-only values
- surface the first disabled action rail for later `Materials-2` work, likely `New Material`, `Assign Material`, and `Duplicate Material`
- keep all action buttons inert and stop before editable fields or write flows begin

#### Verification Shape

- proof that the lower section changes when the selected target changes
- proof that per-part override resolution wins when `usePerPart` is enabled and the selected target has a mapped preset
- proof that selected preset fallback and first-preset fallback are deterministic
- proof that the projected material read comes from explicit current truth seams instead of free-reading shell-local placeholders
- proof that action handoff affordances are visible, disabled or inert, and do not mutate material truth yet

#### Likely Files

- `src/app/workspace/materialsSectionViewModel.ts`
- `src/app/workspace/materialsSectionViewModel.test.ts`
- `src/app/workspace/PropertiesMaterialsSectionContent.tsx`
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts`
- `src/app/workspace/PropertiesSurface.test.tsx`

#### No-Widening Rule

- do not add editable controls here unless the owner seam is already truly explicit
- do not commit mutation UI here
- do not widen into reusable library browsing here
- do not reintroduce shell-owned placeholder copy in place of a real material read

#### Implementation Risks

- if the lower pane still shows only vague copy, later editing work will have to rebuild the lane again
- if the phase jumps straight into mutation UI, the owner-boundary work can get bypassed
- if action handoff stays implicit, `Materials-2` will not have a clean editing entry point

#### Shipped Read

`Phase 3` shipped the first selected-target material-property projection in the hosted `Materials` lane.

The shipped lane now proves:
- selected target rows feed one typed `resolveSelectedTargetMaterialRead(...)` helper
- per-part assignments win when `usePerPart` is enabled and the mapped preset exists
- selected preset and first-preset fallback resolution are deterministic
- the lane displays material name, source, color, metalness, roughness, opacity, transparency, and emissive facts without editable controls
- `New Material`, `Assign Material`, and `Duplicate Material` are visible as disabled handoff actions for `Materials-2`
- target selection and action handoff do not mutate app-global workspace selection or material truth

#### Verification

- `npm.cmd exec eslint -- src/app/workspace/materialsSectionViewModel.ts src/app/workspace/materialsSectionViewModel.test.ts src/app/workspace/PropertiesMaterialsSectionContent.tsx src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd test -- --run src/app/workspace/materialsSectionViewModel.test.ts`
- `npm.cmd test -- --run src/app/workspace/PropertiesSurface.test.tsx`
- `npm.cmd run build`
