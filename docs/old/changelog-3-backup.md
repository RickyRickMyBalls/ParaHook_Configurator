# CHANGELOG

Numbering rule for major entries:
- Prefix each new `##` section with a sequential command index: `[NNN]`.
- Increment by 1 for every new Codex-added section.

<!-- ============================================================ -->
## [082] 2026-03-05 18:53 (Docs Policy: Preserve Full Completed Phase Blocks In Tasklist)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation/process update only.
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.

### Summary of Implementation
- Updated `AGENTS.md` so tasklist maintenance instructions explicitly forbid deleting old phase task lists after completion.
- Added a rule that completed phases must remain as full completed checklist blocks with accomplished items marked `[x]`.
- Clarified that completed phase sections should retain visible phase headers and separator lines in the tasklist, similar in spirit to changelog section boundaries.

### Files Changed
- `AGENTS.md`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Future tasklist maintenance is now required to preserve full historical completed phase blocks instead of collapsing them into short summaries or deleting older phase task lists.

### Verification Steps
- Reviewed updated `AGENTS.md` instructions for tasklist maintenance consistency.
- No build or test run required for this docs-only policy update.

<!-- ============================================================ -->
## [081] 2026-03-05 18:46 (Phase FS-3 Feature Dependency Visualization)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept FS-2 feature ordering, enable/disable semantics, and compile behavior unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or new graph wiring systems.

### Summary of Implementation
- Extended the shared FS-2 dependency utility to emit deterministic feature rows plus feature-to-feature and driver-to-feature dependency edges without mutating graph or feature state.
- Threaded selector-owned feature row ids, row indexes, and internal dependency edges through `selectNodeVm` so part-node rendering reads deterministic dependency VMs instead of recomputing feature graph logic in the UI.
- Updated the part node UI to register stable driver/feature row anchors and render a local internal dependency overlay only in `everything` mode when the existing `Show internal wiring` toggle is enabled.
- Kept dependency styling structural-only so existing DR-1 warnings/diagnostics remain the status layer, while disabled or ineffective features/wires stay visible in muted form.
- Added deterministic regression coverage for dependency graph analysis, selector VM output, feature row anchors, and node overlay gating.

### Files Changed
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Part-template nodes in `everything` mode can now show deterministic internal dependency wires for existing driver-to-feature and feature-to-feature relationships when `Show internal wiring` is enabled.
- Collapsed and compact node modes remain unchanged and do not render the internal dependency overlay.
- Disabled or ineffective features remain visible in the feature stack and dependency visualization without changing compile/runtime behavior.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [080] 2026-03-05 18:35 (Phase FS-2 Feature Stack Core Operations Expansion)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept selector-driven UI flow unchanged.
- Added no multi-part support, boolean operations, sketch solver tooling, or alternate geometry pipelines.

### Summary of Implementation
- Added generic feature-stack enabled-state support with backward-compatible default enable behavior for legacy stored features.
- Introduced shared feature dependency analysis so compile, validation, diagnostics, and reorder guards all use the same prior-enabled-feature ordering rules.
- Hardened `compileFeatureStack` to emit deterministic IR from the effective enabled feature order only, while preserving feature ids and current runtime payload shape.
- Added commit-boundary feature editing actions for move-up, move-down, and enable/disable in the Spaghetti store, with deterministic rejection of dependency-breaking reorders.
- Updated the feature stack UI to expose row-level Up/Down and Enable/Disable controls while keeping disabled features visible and locally editable in place.
- Preserved Cube’s existing render path while ensuring disabled or misordered feature dependencies resolve as unresolved through the current compile/runtime/artifact pipeline.

### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Feature stacks now support deterministic feature enable/disable state without changing graph topology or the existing render pipeline.
- Feature reorders are allowed only when they preserve valid enabled-feature dependency ordering.
- Disabled features remain visible in the stack UI but are excluded from compiled/runtime feature execution.
- Cube remains renderable through the existing FS-1 pipeline, and disabling its extrude feature leaves it unresolved at runtime instead of producing a render artifact.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [079] 2026-03-05 18:17 (Phase FS-1A Spaghetti Build Stats / Cache Panel Integration)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept the FS-1 solid/artifact contract unchanged.
- Kept title-bar stats panel expand/collapse behavior unchanged.
- Added no new node types, geometry features, cache-engine redesign, or multi-part support.

### Summary of Implementation
- Added a shared deterministic build-stats key helper so spaghetti builds derive canonical source/build part rows from the same profile patch content already sent to the worker.
- Narrowed spaghetti build request translation to a minimal profile patch and carried forward a canonical `partKeys` list for stats seeding, keeping `cube` keyed by build identity rather than preview slot identity.
- Extended app build wiring so `BuildDispatcher` resets stats rows from a provider-driven canonical part-key list, preserving legacy ordering while letting spaghetti builds seed rows like `cube` plus `assembled`.
- Updated worker build progress routing so spaghetti builds emit part progress/cache rows for canonical spaghetti part keys derived from the payload, with `assembled` remaining last.
- Scoped cache/progress routing changes so `sp_*` changed ids invalidate the relevant spaghetti row set without redesigning cache semantics.
- Added deterministic regression coverage for shared key derivation, spaghetti build request translation, dispatcher row seeding, and worker progress/cache output.

### Files Changed
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/app/buildDispatcher.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/signatures.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- The Build Stats panel now shows spaghetti build rows using canonical source/build identity such as `cube`, instead of falling back to the legacy fixed row list for spaghetti builds.
- Repeated unchanged spaghetti builds now surface deterministic cache-hit rows aligned with the same canonical spaghetti part keys that drive viewport-visible artifacts.
- Legacy build stats ordering remains unchanged, and `assembled` still appears as the final row.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [078] 2026-03-05 18:08 (Phase UI-2.4 Spaghetti Panel Split Resize Ownership Fix)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout and resize ownership.

### Summary of Implementation
- Moved the vertical resize handle behavior from `SpaghettiEditor` into `SpaghettiPanel`, where the actual header-versus-canvas split is defined.
- Changed the resize logic to control the canvas wrap height directly so dragging the handle now shrinks the expanded header block instead of only resizing content inside the canvas region.
- Tightened the header block flex rules so the expanded header can collapse into its own scrollbar while the lower editor area grows.
- Removed the old inner-editor resize state and handle ownership from `SpaghettiEditor`.

### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Dragging the resize bar now resizes the actual panel split between the collapsible header section and the lower editor/canvas section.
- With the header expanded, the handle can move through space that was previously blocked because the header now shrinks and scrolls instead of staying fixed above the editor.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [077] 2026-03-05 18:04 (Phase UI-2.3 Spaghetti Editor Minimum Height Reduction)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor resize clamp behavior.

### Summary of Implementation
- Reduced the Spaghetti editor minimum manual resize height from `280px` to `100px`.
- Preserved the existing top resize handle behavior and bottom-anchored editor layout while allowing the handle to move higher.

### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- The Spaghetti editor can now be resized much shorter before the top handle hits its minimum-height stop.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [076] 2026-03-05 17:57 (Phase UI-2.2 Spaghetti Panel Header Scroll Relocation)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti panel/editor layout behavior.

### Summary of Implementation
- Moved the scrollable overflow region up from the expanded editor toolbar area into the collapsible Spaghetti panel header block.
- Added a dedicated header scroll container so the section beginning at `How To Use Spaghetti Editor` scrolls independently when the panel is short.
- Removed the expanded-toolbar scrollbar so the lower editor controls and canvas region remain separate from the header scroll behavior.

### Files Changed
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- When the Spaghetti panel header is expanded, the help/sample/compile/status section now owns the scrollbar.
- The expanded/collapsed mode controls and canvas area no longer show that scrollbar.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [075] 2026-03-05 17:49 (Phase UI-2.1 Spaghetti Editor Minimum Width Tightening)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to floating Spaghetti editor window sizing behavior.

### Summary of Implementation
- Reduced the floating Spaghetti editor minimum width in `AppShell` from `560` to `320`.
- Tightened the minimum window width so the editor can shrink to roughly the same width footprint as the top-left `ParaHook Generator v20` title bar region.

### Files Changed
- `src/app/AppShell.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- The floating Spaghetti editor can now be resized narrower before hitting its minimum width limit.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [074] 2026-03-05 17:43 (Phase UI-2 Spaghetti Canvas Vertical Resize Handle)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Limited the change to Spaghetti editor layout/UI behavior.

### Summary of Implementation
- Added a drag handle above the Spaghetti editor content so users can resize the full editor block vertically from its top edge while keeping it bottom-anchored.
- Implemented pointer-driven editor-height resizing in `SpaghettiEditor` with minimum-height and parent-height clamping.
- Added double-click reset behavior on the resize bar to restore the default flexible editor height.
- Added scrollable editor-body behavior so header controls and canvas remain reachable when the editor is resized shorter.
- Styled the resize control as a dedicated top splitter/grab bar inside the Spaghetti editor shell.

### Files Changed
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- The Spaghetti editor block can now be manually dragged taller or shorter from a top resize bar while staying anchored to the bottom of its panel.
- When the editor is resized smaller than its content, the editor body scrolls instead of clipping the header/canvas controls.
- Default behavior remains unchanged until the user drags the handle; double-click resets the manual height.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [073] 2026-03-05 17:28 (Phase FS-1 Feature Stack Solid Contract Lock)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no new geometry kinds, multi-part support, booleans, or graph architecture changes.

### Summary of Implementation
- Locked `src/shared/buildTypes.ts` as the canonical solid artifact contract and made `PartArtifact` require `partKey` and `partKeyStr`.
- Added shared artifact identity helpers for canonical part-key parsing, validation, and viewer-part wrapping.
- Collapsed `src/shared/partsTypes.ts` onto the canonical shared contract so the repo no longer carries a second competing `PartArtifact` definition.
- Formalized preview resolution as `slotId -> sourceNodeId -> sourcePartKeyStr -> PartArtifact` in the OutputPreview selector path.
- Removed the preview-time `partKeyStr` rewrite and replaced it with explicit slot-scoped `viewerKey` metadata while preserving source artifact identity.
- Updated `ViewerHost` and `Viewer` to consume slot-keyed viewer entries with canonical artifacts, keeping spaghetti-mode slot visibility/selection behavior unchanged.
- Tightened build-result validation to treat current worker artifacts as canonical instead of optional/best-effort identity payloads.
- Added deterministic regression coverage for the shared artifact contract, preview slot/source mapping, and repeated graph-produced Cube artifact builds.

### Files Changed
- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/shared/partsTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/viewer/Viewer.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/stageAssembler.ts`
- `src/worker/products/foothook/parts/baseplate.ts`
- `src/worker/products/foothook/parts/heelKick.ts`
- `src/worker/products/foothook/parts/toeHook.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Preview slot identity now stays explicit as `viewerKey` instead of being encoded by mutating `PartArtifact.partKeyStr`.
- Canonical artifacts retain source part identity all the way into preview/viewer flow.
- Spaghetti-mode slot visibility, selection, and unresolved-slot exclusion behavior remain unchanged.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [072] 2026-03-05 17:10 (Phase FS-0B First Renderable Part Through Existing Part Pipeline)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Kept selector-driven preview/viewer flow unchanged.
- Added no parallel mesh-output architecture, scripting nodes, or subgraph/container systems.

### Summary of Implementation
- Added `Part/CubeProof` as a minimal cube-aligned proof node with a deterministic rectangle-to-extrude default Feature Stack and the existing OutputPreview-consumable output kind.
- Extended compile-time part ownership so `PART_NODE_SPECS` and `computeFeatureStackIrParts()` map `Part/CubeProof` to `cubeProof`.
- Documented the two critical path handoffs:
  - part node type to compile-owned `partKey`
  - OutputPreview slot edge to `nodeId -> partKey -> artifact` lookup
- Narrowed worker-side bridging to the existing pipeline:
  - reused `sp_featureStackIR` execution in the worker runtime
  - derived deterministic bounds from runtime geometry
  - emitted graph-produced `cubeProof` output as the existing `PartArtifact { kind: 'box', params }` envelope
- Relaxed shared/app-side artifact validation just enough to accept non-legacy graph-produced part ids like `cubeProof`, while preserving legacy build ordering behavior.
- Added deterministic compile/runtime/selector coverage for the proof part and preserved DR-1 unresolved-slot preview exclusion behavior.

### Files Changed
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Graph-produced `cubeProof` parts now flow through the existing `PartArtifact -> OutputPreview -> selector -> ViewerHost` path.
- Missing proof-part artifacts remain excluded from preview rendering while slot connectivity behavior stays unchanged.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [071] 2026-03-05 15:37 (Phase VM-1B Selector Contract Hardening)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview invariants unchanged.
- Added no new node types or geometry features.
- Limited this phase to selector contract hardening and UI import/consumption cleanup.

### Summary of Implementation
- Standardized selector access through `src/app/spaghetti/selectors/index.ts` and expanded barrel exports for hardened VM contracts/types.
- Hardened selector contracts and identities:
  - `selectNodeVm` now emits full `NodeVm` metadata used by canvas/node rendering (title/template/ports/sections/row-group metadata) with stable `nodeId`.
  - `selectDriverVm` now emits stable `DriverRowVm` identities (`rowId` + `paramId` where applicable) and section-grouped row identity data.
  - `selectPreviewRenderVm` now emits `PreviewRenderVm` (`items` + `viewerParts`) with stable preview ids and viewer-ready artifacts.
  - `selectDiagnosticsVm` now emits stable diagnostics items with deterministic `id` while preserving existing DR-1 status semantics.
- Added same-reference memoization guards across hardened selectors where safe (`selectNodeVm`, `selectDriverVm`, `selectPreviewRenderVm`, `selectDiagnosticsVm`, parts-list panel VM).
- Removed remaining target UI-local shaping from raw graph/state:
  - `SpaghettiCanvas` now passes selector-provided node display metadata to `NodeView` instead of rebuilding from node definitions in render.
  - `NodeView` now consumes selector-provided driver grouping/index metadata and selector-provided OutputPreview row identities for keys.
  - `PartsListPanel` now consumes selector-shaped panel VM (`selectPartsListPanelVm`) from barrel and no longer builds slot labels/secondary text or trailing-empty handling locally.
  - `ViewerHost` now consumes selector-provided preview VM (`viewerParts`) from barrel and no longer reshapes preview artifacts locally.
- Added selector barrel contract test plus VM snapshot coverage for Node/Driver/Preview/Diagnostics contracts.

### Files Changed
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/index.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectDiagnosticsVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectDriverVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/__snapshots__/selectPreviewRenderVm.test.ts.snap`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- No feature-level behavior changes introduced.
- UI rendering now consumes hardened selector VM contracts directly for target surfaces; existing VM-1/DR-1 behavior remains preserved.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed; build succeeded.

<!-- ============================================================ -->
## [070] 2026-03-05 13:08 (Phase DR-1 Driver Diagnostics & Invalid Wiring Visualization)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Kept topology mutation boundaries unchanged (`graphCommands/` + `normalizeGraphForStoreCommit` only).
- Kept OutputPreview slot normalization invariant unchanged (exactly one trailing empty slot in graph state).
- Kept selector-driven UI integration pattern.

### Summary of Implementation
- Extended diagnostics selector VM with deterministic edge + slot state:
  - added `edgeStatusById` keyed by stable `edgeId` identity,
  - added `slotStatus` for OutputPreview slots (`ok` / `unresolved` / `empty`),
  - added deterministic reason precedence (`missingPort > cycle > typeMismatch > unresolved > ok`) and aggregated `reasons`.
- Kept endpoint-derived helpers secondary-only by documenting `buildEndpointGroupingKey(...)` for grouping/contract semantics (not diagnostics identity).
- Updated canvas wire rendering to read diagnostics and apply dashed wire class for non-`ok` edges without changing interaction behavior.
- Updated node VM + node UI:
  - driver rows now surface warning indicators/tooltips from `edgeStatusById`,
  - OutputPreview rows now carry/render slot state and unresolved warning indicator metadata.
- Extended parts-list selector/UI with slot statuses and unresolved warning indicators while preserving panel-only trailing-empty hide behavior.
- Extended preview render selector to skip `unresolved` slots so unresolved entries remain visible in Parts List but are excluded from preview mesh rendering.
- Added deterministic tests for missing-port/type-mismatch/unresolved/cycle status classification and selector/view-model behavior.

### Files Changed
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Non-`ok` edges now render dashed in Spaghetti canvas.
- Driver rows with non-`ok` driver-input edges now show warning indicators and tooltip diagnostics.
- OutputPreview slot state is explicitly represented as `ok` / `unresolved` / `empty`.
- Preview rendering now skips slots marked `unresolved`; unresolved slots remain visible in Parts List UI.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [069] 2026-03-05 12:13 (Phase CT-1 Contract Lock: Resolver/Validator/Canvas Parity)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview invariants.
- Added no topology mutation in evaluator/selector/render/compile paths.
- Kept topology mutation limited to graph commands + deterministic normalization.

### Summary of Implementation
- Added shared endpoint contract module at `src/app/spaghetti/contracts/endpoints.ts`:
  - driver alias canonicalization (`drv:*`/`drv:in:*` to canonical `out:drv:*`/`in:drv:*`)
  - node-type-aware canonicalization entrypoint
  - canonical endpoint key builder with driver-input param-level collapse for max-connection counting
  - unified endpoint resolver using effective ports + registry defs
  - unified `validateConnectionContract(...)` with deterministic code outcomes for port/path/type/max rules.
- Rewired canvas cheap-check (`validateConnectionCheap`) to call shared contract only:
  - preserved driver input auto-replace drop semantics via projected-edge validation using `planConnectEdgeWithAutoReplace`
  - standardized UI rejection messaging from shared reason codes.
- Rewired `validateGraph` connection decisions to shared contract:
  - added `validateGraphConnectionDecision(...)` test helper export
  - preserved cycle exclusion behavior for feature/driver path-unsupported and feature same-node unsupported edges
  - preserved deterministic edge iteration and diagnostics ordering behavior.
- Updated driver input auto-replace target keying to use shared canonical endpoint key helper.
- Added CT-1 parity test suite asserting canvas cheap-check and validator contract decision agreement (`ok` + `code`) across driver aliases, mixed alias counting behavior, unit mismatch, OutputPreview dynamic slot ports, feature virtual ports, and composite leaf-path rules.

### Files Changed
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Canvas cheap-check now derives rejection codes/messages from the shared contract engine used by `validateGraph`.
- Driver-input drop validation remains replace-friendly by validating projected post-auto-replace topology before command commit.
- Validator and canvas now share deterministic endpoint resolution/canonicalization and connection decision codes, reducing parity drift risk.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [068] 2026-03-05 11:48 (Phase VM-1 Derived View Model Selectors)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not change OutputPreview behavior/invariants.
- Added no topology mutation in selectors.
- Kept UI integration incremental with selector-backed derivation in existing render flow.

### Summary of Implementation
- Added pure deterministic selector layer under `src/app/spaghetti/selectors/`:
  - `selectNodeVm` for node-card derived rows/details/composite input state and driver VM assembly.
  - `selectDriverVm` for driven driver row state and numeric offset/effective derivation.
  - `selectPreviewRenderVm` as OP-5 parity wrapper with `isReady` metadata.
  - `selectDiagnosticsVm` for merged/stable/grouped diagnostics VM.
- Refactored `SpaghettiCanvas` node render-data derivation to use `selectNodeVm` via `useMemo`, removing large inline derivation logic.
- Routed cycle-check diagnostics grouping through `selectDiagnosticsVm` (pure derived-only usage).
- Updated viewer preview wiring to use `selectPreviewRenderVm` while preserving render contract.
- Added selector test coverage for deterministic ordering, offset-mode correctness, OP-5 parity, stable diagnostics ordering, and idempotence.

### Files Changed
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectDriverVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/selectDriverVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/components/ViewerHost.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- No topology/runtime protocol changes.
- UI derivation logic is now selector-backed, improving determinism and testability with behavior parity preserved.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [067] 2026-03-05 11:28 (Phase CK-1 Graph Command Kernel)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` behavior.
- Did not modify OutputPreview behavior/invariants.
- Added no new node types.
- Kept UI refactor minimal by replacing topology mutations with graph command calls.
- Preserved deterministic command behavior and post-command normalization flow.

### Summary of Implementation
- Introduced centralized graph command kernel under `src/app/spaghetti/graphCommands/` with pure `(graph) => nextGraph` commands:
  - `addNode`, `removeNode`, `addEdge`, `removeEdge`, `replaceEdge`, `setNodeParams`, `setNodePosition`
  - `connectEdgeWithAutoReplace` + `planConnectEdgeWithAutoReplace` wrapper around driver input auto-replace planning.
- Added `applyGraphCommand(cmd)` to `useSpaghettiStore` and wired it through existing normalization (`normalizeGraphForStoreCommit`) and waypoint pruning.
- Updated store legacy `addEdge`/`removeEdge` methods to route topology changes via graph commands.
- Refactored canvas topology writes to command calls:
  - wire connect/replace now uses `planConnectEdgeWithAutoReplace` + `connectEdgeWithAutoReplace`
  - edge detach/delete now uses `removeEdge` command via `applyGraphCommand`
  - node add now uses `addNode` command via `applyGraphCommand`
- Refactored `SpaghettiEditor` node add flow to use `addNode` command.
- Added command-layer tests covering add/remove node/edge, auto-replace connect behavior, determinism, and OutputPreview non-deletable invariant through store command+normalization path.

### Files Changed
- `src/app/spaghetti/graphCommands/types.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/removeNode.ts`
- `src/app/spaghetti/graphCommands/addEdge.ts`
- `src/app/spaghetti/graphCommands/removeEdge.ts`
- `src/app/spaghetti/graphCommands/replaceEdge.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
- `src/app/spaghetti/graphCommands/index.ts`
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Topology mutations are now centralized through graph command functions plus store commit normalization.
- Existing user-facing behavior is preserved; OutputPreview singleton invariant remains enforced after command commits.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [066] 2026-03-05 11:13 (Phase 2C v2.2: Driven Numeric Driver Offset Mode)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph.ts` or `evaluateGraph.ts` implementation files.
- Did not modify OutputPreview behavior/invariants.
- Introduced no new node types.
- Kept topology mutations out of evaluation/selector/render/compile paths; normalization-only params patching used.
- Did not auto-delete edges for unresolved/invalid driver states.

### Summary of Implementation
- Added optional part-node param metadata for driven numeric offsets:
  - `driverOffsetByParamId?: Record<string, number>`
  - `driverDrivenByParamId?: Record<string, true>`
- Extended store commit normalization to:
  - detect driven numeric nodeParam drivers via whole-port `in:drv:*` / `drv:in:*` incoming edges,
  - initialize missing numeric offsets to `0` on first driven state,
  - canonicalize and persist `driverDrivenByParamId` for currently driven numeric params,
  - preserve existing offsets on disconnect while clearing stale driven markers.
- Updated driver virtual output resolution so numeric `out:drv:*` emits:
  - base value when not driven,
  - `base + offset` when `driverDrivenByParamId[paramId] === true`.
- Extended driver VM contract for numeric rows with driven offset mode data:
  - `DriverNumberChange` now supports `kind: 'nodeParamOffset'`,
  - numeric rows can expose `offsetMode`, `drivenValue`, `offsetInput`, and `effectiveValue`.
- Updated canvas render data + driver edit path:
  - derives numeric driven/effective values from evaluation + stored offset,
  - patches `params.driverOffsetByParamId[paramId]` for offset edits.
- Updated numeric driver row UI:
  - non-driven numeric rows unchanged,
  - driven numeric rows show read-only driven value, editable offset control, and read-only effective value,
  - unresolved driven behavior remains intact with unresolved messaging.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- Driven numeric driver virtual outputs now emit effective values (`driven + offset`) when driven metadata is present.
- Numeric driver rows in driven mode now expose an editable local offset and read-only effective readout.
- Driven-but-unresolved behavior remains unresolved; offset is not applied in unresolved state.
- Non-numeric drivers and non-driven numeric drivers retain prior behavior.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [065] 2026-03-05 01:22 (Roadmap Restore: Revert to Previous Tree-Backed Layout)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only rollback of roadmap structure.
- No source/runtime/schema/protocol changes.
- Preserved existing changelog entries without edits.

### Summary of Implementation
- Reverted `docs/roadmap.md` from the condensed execution-queue format back to the prior version.
- Restored the full trailing history tree and hierarchy sections that were previously present at the end of the file.
- Preserved prior track ordering and checklist content in the restored roadmap format.

### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Roadmap document returns to the prior tree-inclusive presentation.

### Verification Steps
- Reviewed `docs/roadmap.md` and confirmed `## History Tree` and trailing hierarchy content are present.
- Confirmed new changelog section inserted at top with next sequential index `[065]`.

<!-- ============================================================ -->
## [064] 2026-03-05 01:21 (Phase DR-0 Driver Input+Output Ports: Canonical IDs + Dual-Read Compatibility)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept worker protocol unchanged.
- Kept graph `schemaVersion` unchanged.
- Did not modify `compileGraph` or `evaluateGraph` implementation files.
- Did not modify OutputPreview behavior/invariants.
- No new node types introduced.
- Limited canvas changes to minimal driver-wire exposure/parity paths.

### Summary of Implementation
- Switched canonical driver virtual port IDs to:
  - input: `in:drv:<paramId>`
  - output: `out:drv:<paramId>`
- Preserved dual-read compatibility for legacy aliases:
  - `drv:in:<paramId>`
  - `drv:<paramId>`
- Updated driver virtual port helpers to parse both canonical + legacy forms, emit canonical builders, and provide canonicalization helpers.
- Updated canvas driver-row port mapping to bind by parsed `paramId` (`rowId = drv:<paramId>`) and prefer canonical ports when both aliases are present.
- Updated driver-input auto-replace endpoint keying so canonical/legacy driver-input aliases collapse to one logical replace target.
- Updated full validator endpoint counting to canonicalize driver-input endpoint keys so mixed alias edges respect the single-connection contract.
- Expanded tests to cover canonical contract, compatibility aliases, unit mismatch rejection for `in:drv:*`, and mixed-alias max-connection behavior.

### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/features/effectivePorts.test.ts`
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- New canonical IDs are now first-class for driver virtual wiring:
  - `out:drv:*` for driver outputs
  - `in:drv:*` for driver inputs
- Legacy IDs remain accepted for backwards compatibility.
- Mixed canonical/legacy driver-input aliases now resolve as one logical endpoint for max-connection enforcement/auto-replace semantics.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed; build succeeded.

<!-- ============================================================ -->
## [063] 2026-03-05 01:15 (Roadmap Reorganization: Execution Queue + Track Consolidation)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update.
- No source code, schema, runtime, worker, or protocol changes.
- Preserved historical implementation detail in existing changelog/archive docs.

### Summary of Implementation
- Replaced `docs/roadmap.md` with a focused working roadmap structure:
  - explicit `Now`, `Next`, and `After Next` execution queue,
  - grouped active tracks by delivery concern (driver wiring, geometry/feature stack, sketch reliability, architecture hardening),
  - separated recently completed milestones from open work,
  - moved long-form history out of the working document via reference pointers.
- Aligned current priorities with recent logs:
  - OutputPreview track marked complete through `OP-6.1`,
  - recent completions called out for `[060]` and `[062]`,
  - queue centered on open driver and parity work.

### Files Changed
- `docs/roadmap.md`
- `docs/CHANGELOG.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Planning workflow now has a single concise execution view with reduced duplication/noise.

### Verification Steps
- Reviewed `docs/roadmap.md` section order and status grouping for consistency.
- Confirmed new entry inserted at top of `docs/CHANGELOG.md` with sequential index `[063]`.

<!-- ============================================================ -->
## [062] 2026-03-04 22:12 (Post-4A Hardening: Tessellation Determinism + CCW Lock)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Kept tessellation strictly at the compile-to-worker boundary (`compileGraph` payload assembly path).
- Preserved worker protocol and runtime contract:
  - `schemaVersion` remains `1`,
  - runtime ops remain `sketch` and `extrude` only.
- Kept analytic `ProfileLoop.segments` authoritative in app state.
- Did not move tessellation into worker/runtime layers.

### Summary of Implementation
- Extracted runtime tessellation into compiler-local helper `runtimeTessellation.ts` and wired `compileGraph` to use it.
- Added deterministic tessellation constants and pipeline:
  - canonicalize to 6 decimals,
  - epsilon-based duplicate suppression (`EPSILON = 1e-6`) after canonicalization,
  - closure snap after full segment emission,
  - CCW enforcement using open-ring signed area with implicit closing edge.
- Implemented closure behavior to avoid synthetic close-point appends while normalizing near-closure deterministically.
- Added compile payload determinism test for curved `sketch -> closeProfile -> extrude` fixture:
  - byte-identical payload JSON across runs,
  - `schemaVersion` lock,
  - runtime op set lock (no emitted `closeProfile` op),
  - CCW/non-negative loop area assertion.
- Added focused tessellation unit tests for epsilon join suppression, closure snap/no double-close, CCW enforcement, and repeat determinism.

### Files Changed
- `src/app/spaghetti/compiler/runtimeTessellation.ts`
- `src/app/spaghetti/compiler/runtimeTessellation.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Runtime sketch vertices emitted by compile-time tessellation are now epsilon-hardened and canonicalized deterministically.
- Near-closure endpoints are snapped deterministically; runtime payload remains worker-compatible with unchanged schema/op set.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/compiler/runtimeTessellation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: tests passed and build succeeded.

<!-- ============================================================ -->
## [061] 2026-03-04 22:01 (Phase 4A Runtime Bridge: Added Next-Task Changelog Entry)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.

### Summary of Implementation
- Added changelog tracking entry for the queued Phase 4A runtime bridge task:
  - analytic `ProfileLoop.segments` bridge to runtime vertex loops,
  - tessellation at compile-to-runtime boundary only,
  - runtime ops contract remains `sketch` + `extrude`.

### Files Changed
- `docs/listofchanges.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Change tracking now includes the Phase 4A runtime bridge next task.

### Verification Steps
- Reviewed `docs/listofchanges.md` for format consistency and sequential section index (`[061]`).

<!-- ============================================================ -->
## [060] 2026-03-04 20:57 (Phase 2B v2.0: Expand Feature Virtual Inputs to Extrude Taper/Offset)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains single source of truth across validator/canvas/evaluator/UI.
- NodeView remains generic.

### Summary of Implementation
- Expanded feature virtual input contract from `Extrude.depth` only to `Extrude.depth`, `Extrude.taper`, and `Extrude.offset`.
- Added deterministic virtual ID/type handling for:
  - `fs:in:<featureId>:extrude:depth` (`number:mm`)
  - `fs:in:<featureId>:extrude:taper` (`number:deg`)
  - `fs:in:<featureId>:extrude:offset` (`number:mm`)
- Added optional extrude params `taper`/`offset` using locked literal defaults `{ kind: 'lit', value: 0 }`.
- Added validator + cheap-check parity for feature virtual path rejection with `FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
- Extended compile/evaluate flow so taper/offset overrides are deterministic and IR extrude fields are always present:
  - `depthResolved`, `taperResolved`, `offsetResolved`.
- Extended extrude UI rows and wiring state for depth/taper/offset with driven lock + unresolved behavior consistency.
- Added/updated tests for virtual ports, validation parity, evaluate determinism, compile overrides/defaults, and UI rendering behavior.

### Files Changed
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Users can now wire into extrude taper/offset feature params using feature virtual inputs.
- Feature virtual inputs remain whole-port only; path-based connections are explicitly rejected.
- Occupied `fs:in:*` endpoints still reject in cheap-check (`maxConnectionsIn = 1`), unchanged from feature input contract.
- Compiled extrude IR now always includes deterministic resolved numeric fields for taper and offset.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
## [059] 2026-03-04 20:33 (Renumber NODE Tasklist Sections After Duplicate 7)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved changelog format and top-insert ordering.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` section numbering to resolve duplicate `7` and increment subsequent sections.
- Applied requested sequence adjustment:
  - second `7` -> `8`,
  - all following section numbers incremented by `+1`.
- Resulting section sequence from that point is now monotonic and unambiguous.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Tasklist numbering/readability improved.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` headings to confirm corrected numbering order.
- Confirmed new changelog entry inserted at top with next sequential index `[059]`.

<!-- ============================================================ -->
## [058] 2026-03-04 20:28 (Update NODE Tasklist for Phase 2C v2.1 Completion)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only checklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes in this step.
- Preserved existing changelog format and reverse-chronological insertion.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to add Phase 2C v2.1 (`Driver Input Auto-Replace`) as implemented.
- Added completed checklist items for:
  - scoped auto-replace on `drv:in:*`,
  - duplicate-drop no-op behavior,
  - deterministic replace/heal semantics,
  - whole-port endpoint-key lock,
  - cycle check enforcement at final drop commit.
- Renumbered downstream sections to keep sequence consistent:
  - Feature wiring expansion moved to section 10,
  - Phase 3 moved to section 11,
  - Quality gates moved to section 12.
- Added Phase 2C v2.1 full regression gate completion line.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Planning/checklist documents now reflect Phase 2C v2.1 completion.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for section numbering, status marks, and quality-gate alignment with implemented work.
- Confirmed changelog entry inserted at top with next sequential index `[058]`.

<!-- ============================================================ -->
## [057] 2026-03-04 20:26 (Phase 2C v2.1: Driver Input Auto-Replace on Drop)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- Resolver remains the single source of truth for endpoint typing/availability.
- `maxConnectionsIn` contract for `drv:in:*` remains 1 in final graph state.
- NodeView remained generic (no part-type UI branching added).

### Summary of Implementation
- Implemented deterministic auto-replace planning for driver virtual input targets (`drv:in:*`) via a new pure helper module.
- Added whole-port endpoint-key lock for driver virtual inputs:
  - endpoint matching ignores path component and uses empty normalized path key.
- Added drop-time replacement semantics:
  - exact duplicate drop on clean occupied target is a no-op (existing edge preserved),
  - otherwise remove all existing incoming edges on same driver endpoint and append one new edge,
  - cycle checks run against the final candidate graph before commit.
- Updated canvas drop commit to use one atomic `applyGraphPatch` for replacement (remove+add together).
- Updated cheap-check semantics for occupied `drv:in:*` targets:
  - allowed when type/unit/path checks pass (replace-allowed),
  - path/type/unit invalid cases still reject as before.
- Added tests for endpoint-key behavior, replacement/no-op/healing logic, and cheap-check scope lock for occupied driver targets.

### Files Changed
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts` (new)
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts` (new)
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Dropping a new compatible wire onto an occupied `drv:in:<paramId>` now replaces prior incoming edge(s) deterministically (`last drop wins`).
- Dropping the exact same connection again on a clean occupied driver input is now a no-op.
- Occupied non-driver inputs continue to enforce max-connection rejection in cheap-check.
- Cycle rejection still occurs at final drop commit (cheap-check still does not perform cycle checks).

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/driverInputAutoReplace.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
## [056] 2026-03-04 20:13 (Update Checklists for Phase 2C v2 Completion)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update for task tracking/checklists.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- Preserved existing changelog format and reverse-chronological insertion.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v2 (Wire -> Driver) as implemented.
- Added explicit completed checklist coverage for:
  - strict `drv:in:<paramId>` virtual input contract,
  - path-rejection parity code `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`,
  - driven-unresolved lock semantics and parity tests.
- Added Phase 2C v2 regression quality gate completion (`test` + `build` passing).
- Updated `docs/tasks/master-tasks.md` to reflect current state:
  - moved current priority to Phase 2B v2+ expansion work,
  - refreshed active/backlog items,
  - added completed milestones for Phase 2A, 2C v1, and 2C v2.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/checklist documents now reflect current implementation status.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for phase status and checklist consistency.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[056]`.

<!-- ============================================================ -->
## [055] 2026-03-04 20:08 (Phase 2C v2: Wire -> Driver Virtual Inputs with Deterministic Parity)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag/drop redesign.
- Kept NodeView generic (row-metadata-driven; no part-type branching).
- Preserved resolver parity across validator, cheap-check, evaluator, and UI pin rendering.

### Summary of Implementation
- Added driver virtual input contract for Part nodeParam drivers:
  - `drv:in:<paramId>` with strict parser lock (`^[A-Za-z0-9_]+$`, non-empty, no extra `:`).
  - input direction, whole-port only, `maxConnectionsIn = 1`.
- Extended effective input resolver to include driver virtual inputs after declared and feature virtual inputs.
- Added deterministic path rejection for driver virtual inputs:
  - `validateGraph` emits `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`.
  - `validateConnectionCheap` returns matching code plus locked reason text:
    `Driver virtual inputs do not support path connections.`
- Integrated evaluation override semantics:
  - wired `drv:in:*` overrides `resolvedParams[paramId]` non-mutatively.
  - wired-but-unresolved keeps node driven/unresolved (no fallback to manual param).
  - driver virtual outputs read from resolved params, preserving deterministic order.
- Added UI wiring/render support on driver rows:
  - driver input pins + existing output pins rendered for eligible nodeParam rows.
  - driver row editor locks when driven.
  - deterministic unresolved indicator shown when driven but unresolved.
- Updated tests for parser/listing, validator parity, cheap/full parity, evaluator overrides, unresolved lock behavior, and NodeView pin/lock rendering.

### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/types.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Users can now wire `node.out -> drv:in:<paramId>` for Part nodeParam number/vec2 drivers with resolver-consistent validation.
- Driver rows can expose both input and output virtual pins; featureParam rows remain excluded.
- Driven drivers become read-only while wired.
- Wired-but-unresolved drivers remain locked and unresolved; manual param value is not silently used.
- Driver virtual input paths are deterministically rejected with parity across cheap and full validation.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/driverVm.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
## [054] 2026-03-04 19:51 (Update NODE Tasklist for Phase 2C v1 Completion)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only tasklist update.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler code changes in this step.
- Preserved existing changelog entry format and reverse-chronological insertion rule.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to mark Phase 2C v1 Driver -> Input wiring as implemented.
- Marked all Phase 2C v1 checklist items complete.
- Added explicit completion item for `drv:<paramId>` parser charset lock:
  - `^[A-Za-z0-9_]+$` (non-empty, no `:`).
- Restored/kept downstream future sections (`Phase 2C v2`, `Phase 2B v2+`, `Phase 3`, and quality gates) in correct order after tasklist refresh.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- No runtime behavior changes.
- Project planning/task tracking now reflects Phase 2C v1 as complete.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for:
  - updated Phase 2C v1 status and items,
  - intact section ordering through sections 8-11,
  - checklist legend/difficulty format consistency.

<!-- ============================================================ -->
## [053] 2026-03-04 19:48 (Phase 2C v1 Closure Hardening: Driver ParamId Charset + Determinism Locks)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Kept Phase 2C v1 scope lock: nodeParam driver outputs only; featureParam driver outputs excluded.

### Summary of Implementation
- Hardened `drv:<paramId>` parsing to enforce v1 param-id charset lock:
  - non-empty
  - no `:`
  - regex `^[A-Za-z0-9_]+$`
- Retained single-source resolver behavior for driver virtual outputs (`effectivePorts`) and existing evaluator/canvas/UI integration.
- Added deterministic test coverage for malformed `drv:*` IDs and repeated evaluation equality for driver virtual output wiring.

### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts`
- `src/app/spaghetti/features/driverVirtualPorts.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Malformed driver virtual output IDs (for example `drv:width-mm`, `drv:width mm`, `drv:`) are now rejected deterministically by parser/is-check.
- Deterministic driver virtual output evaluation behavior is now explicitly locked by repeat-equality test coverage.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
## [052] 2026-03-04 19:06 (Phase 2C v1 Driver Virtual Output Wiring)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop redesign.
- Feature stack remains embedded in `node.params.featureStack`.
- v1 lock enforced: nodeParam drivers only (`nodeParamNumber`/`nodeParamVec2`), featureParam drivers excluded.

### Summary of Implementation
- Added virtual driver output port module with deterministic ID contract `drv:<paramId>`.
- Extended Part driver control metadata to support explicit `wireOutputType` and populated it for Part nodeParam drivers.
- Updated effective output resolver so declared outputs and driver virtual outputs are resolved from one source.
- Updated evaluator to append driver virtual outputs into `outputsByNodeId` from canonical node param values/fallback semantics (no node compute changes).
- Updated canvas render data to expose driver output port metadata by rowId and kept cheap validation parity through shared resolver.
- Updated NodeView to render output pins on nodeParam driver rows (right-end aligned; pin remains before row move controls when present).
- Added tests for helper contract, validator/evaluator behavior, resolver parity, and UI rendering expectations.

### Files Changed
- `src/app/spaghetti/features/driverVirtualPorts.ts` (new)
- `src/app/spaghetti/features/driverVirtualPorts.test.ts` (new)
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part node nodeParam driver rows now expose wireable output pins when `wireOutputType` metadata is present.
- `drv:<paramId> -> input` edges are now resolved/validated/evaluated consistently across cheap canvas validation and full graph validation.
- Driver virtual outputs are available in evaluation output maps (for example `outputsByNodeId[nodeId]['drv:widthMm']`).
- FeatureParam drivers (for example first extrude depth) remain non-wireable in v1.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/driverVirtualPorts.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`
- Result: all tests passed and build succeeded.

<!-- ============================================================ -->
## [051] 2026-03-04 18:47 (Center Reorder Button Glyph and Increase Font Size)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer CSS-only UI tweak.
- No worker/protocol/scheduler changes.
- No schema/compiler/runtime behavior changes.
- No drag-and-drop changes.

### Summary of Implementation
- Updated row reorder button text/glyph alignment to centered layout.
- Increased reorder button glyph size from `2px` to `10px`.
- Added explicit centering properties on `.SpaghettiSectionRowMoveButton`:
  - `display: inline-flex`
  - `align-items: center`
  - `justify-content: center`
  - `text-align: center`

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Up/down arrow glyphs in reorder buttons are now centered and visibly larger.

### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `font-size: 10px`
  - centered flex alignment properties present.

<!-- ============================================================ -->
## [050] 2026-03-04 18:46 (Set Row Reorder Button Size to 20x5)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer CSS style tweak only.
- No worker/protocol/scheduler changes.
- No schema/runtime/compiler behavior changes.
- No drag-and-drop behavior changes.

### Summary of Implementation
- Updated row reorder button dimensions to requested size:
  - `width: 20px`
  - `height: 5px`
- Applied to `.SpaghettiSectionRowMoveButton` hover/non-hover selector block.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Reorder up/down controls now render at `20x5` size.

### Verification Steps
- Confirmed CSS values in `.SpaghettiSectionRowMoveButton`:
  - `min-width: 20px`
  - `width: 20px`
  - `height: 5px`

<!-- ============================================================ -->
## [049] 2026-03-04 18:46 (Align Output Row Reorder Controls to Full Row Height)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer UI alignment update only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop behavior changes.

### Summary of Implementation
- Updated output row reorder controls to use the full-height alignment mode already used for top/bottom pinning.
- Output section up/down buttons now stretch/alignment-match the row container and pin top/bottom consistently instead of staying center-stacked.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Output row reorder arrows now align to full row height (top and bottom anchors), matching row container bounds.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed output row move wrapper now uses `alignToValueBar: true`.

<!-- ============================================================ -->
## [048] 2026-03-04 18:44 (Pin Row Reorder Arrows to Row Top/Bottom)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer CSS alignment tweak only.
- No worker/protocol/scheduler changes.
- No schema/validation/compiler/runtime behavior changes.
- No drag-and-drop changes.

### Summary of Implementation
- Updated the value-bar-aligned row move control container to stretch across the full row height.
- Removed offset-based positioning that pushed controls downward.
- Kept vertical `space-between` so:
  - up arrow is pinned to row top,
  - down arrow is pinned to row bottom.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Row reorder arrows now align to the top and bottom bounds of the row container instead of being offset toward the bottom.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS for `.SpaghettiSectionRowMoveControls--valueBarAligned`:
  - `align-self: stretch`
  - `margin-top: 0`
  - `height: auto`
  - `min-height: 100%`
  - `justify-content: space-between`

<!-- ============================================================ -->
## [047] 2026-03-04 18:44 (Resize and Re-Align Row Reorder Arrows)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer UI styling/layout update only.
- No worker/protocol/scheduler changes.
- No schema/normalization/compiler behavior changes.
- No drag-and-drop implementation changes.

### Summary of Implementation
- Updated row reorder button dimensions from `5x5` to `8x8`.
- Kept compact glyph sizing.
- Added value-bar alignment mode for row move controls:
  - top button aligned to the top of the value-bar zone,
  - bottom button aligned to the bottom of the value-bar zone.
- Applied this alignment mode for Drivers and number-driven Inputs, while preserving centered controls for rows without value bars (for example many Outputs).

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Reorder up/down arrows are now larger (`8x8`) and vertically pinned to the value-bar bounds where applicable.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx`
- Confirmed CSS values:
  - `.SpaghettiSectionRowMoveButton` width/height `8px`
  - `.SpaghettiSectionRowMoveControls--valueBarAligned` uses `margin-top: 20px`, `height: 24px`, `justify-content: space-between`

<!-- ============================================================ -->
## [046] 2026-03-04 18:41 (Shrink Row Reorder Arrow Controls)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer styling update only.
- No worker/protocol/scheduler changes.
- No schema/runtime logic changes.
- No drag-and-drop or feature-stack migration changes.

### Summary of Implementation
- Reduced row reorder arrow control dimensions and glyph size for the `SpaghettiSectionRowMoveButton` style.
- Applied requested values:
  - button size `5px x 5px`
  - `font-size: 2px`

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Reorder up/down arrow controls in Drivers/Inputs/Outputs row move UI now render at much smaller size.

### Verification Steps
- Confirmed CSS values in `SpaghettiSectionRowMoveButton`:
  - `min-width: 5px`
  - `width: 5px`
  - `height: 5px`
  - `font-size: 2px`

<!-- ============================================================ -->
## [045] 2026-03-04 18:40 (Phase 2A: Row Ordering Metadata v1 for Part VM Rows)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- No schema version bump.
- No drag-and-drop added.
- Feature Stack row ordering not introduced in this phase.
- NodeView kept generic (shared row-move controls, no new part-type branching logic).

### Summary of Implementation
- Added `partRowOrder` metadata support for part params (`drivers`, `inputs`, `outputs`) in Part node params schemas.
- Added new deterministic helper module `partRowOrder.ts` for:
  - stable row ID construction (`drv:*`, `in:*`, `out:*`),
  - deterministic normalize/repair behavior,
  - section ordering application,
  - output endpoint reordering while keeping reserved output rows fixed,
  - deterministic adjacent swap + no-op metadata clearing.
- Refactored `driverVm` row IDs from index-based IDs to stable deterministic IDs.
- Integrated silent canonicalization in store normalization path (no diagnostics emitted from store).
- Integrated single-source diagnostics in `validateGraph`:
  - new warning code `partRowOrder_invalid_shape_repaired`,
  - no warning on metadata absence,
  - params validation uses repaired params for non-fatal malformed metadata handling.
- Integrated ordered VM row rendering in canvas pipeline before `NodeView` render.
- Added up/down reorder controls for Drivers/Inputs/Outputs rows in `NodeView`.
- Added deterministic persistence for row reorder operations in `SpaghettiCanvas`:
  - initializes from current natural order when metadata absent,
  - applies pure adjacent swaps,
  - clears section metadata when returning to natural order,
  - removes `partRowOrder` when all sections are empty/undefined.

### Files Changed
- `src/app/spaghetti/parts/partRowOrder.ts`
- `src/app/spaghetti/parts/partRowOrder.test.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part VM rows now have stable deterministic IDs used for ordering metadata.
- Part nodes can persist per-section row ordering in `params.partRowOrder`.
- Invalid `partRowOrder` shapes are repaired deterministically; warning emitted only from `validateGraph` with code `partRowOrder_invalid_shape_repaired`.
- Drivers/Inputs/Outputs rows can be reordered via up/down controls; ordering is deterministic and metadata is minimized when equal to natural order.
- Reserved output rows remain fixed in natural positions and are not reorderable in v1.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/parts/partRowOrder.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [044] 2026-03-04 18:23 (Update Task Lists After Phase 2 v1 Completion)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes in this step.
- No drag-and-drop or feature-stack architecture migration changes in this step.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to reflect current project status after Phase 2 v1:
  - marked Phase 2B v1 virtual feature-input wiring scope as implemented,
  - split future work into Phase 2A (row ordering), Phase 2B v2+ (wiring expansion), and Phase 3 migration path,
  - refreshed quality gates with explicit Phase 2 v1 verification completion.
- Updated `docs/tasks/master-tasks.md` from placeholder state to an actionable board:
  - set current priority to Phase 2A,
  - listed active work for row-ordering metadata,
  - added backlog for Phase 2A/2B v2/Phase 3,
  - recorded completed Phase 1 and Phase 2 v1 milestones.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- None. This change updates task planning/status documents only.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated phase status markers and section numbering.
- Reviewed `docs/tasks/master-tasks.md` for synchronized priority/active/backlog/completed state.
- Confirmed changelog entry inserted at top with next sequential index `[044]`.

<!-- ============================================================ -->
## [043] 2026-03-04 18:21 (Phase 2 v1: External Feature-Input Wiring via Virtual Ports)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Phase 2 v1 scope locked to:
  - inputs only,
  - `Extrude.depth` only,
  - no composite paths,
  - `maxConnectionsIn = 1`,
  - external-only simplification (`from.nodeId !== to.nodeId`) for feature-target edges.

### Summary of Implementation
- Added deterministic virtual feature input port contract:
  - `fs:in:<featureId>:extrude:depth`,
  - parse/build helpers,
  - virtual input listing in feature-stack order,
  - deterministic compile-time extrude depth override utility.
- Added shared effective-port resolver utilities and used them across compiler/canvas/UI listing to keep endpoint behavior consistent.
- Updated validation/evaluation/compile pipeline:
  - `validateGraph` now resolves virtual feature inputs, enforces max incoming constraints, and emits `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED` for same-node feature-target edges (documented v1 simplification).
  - `evaluateGraph` now resolves virtual feature inputs into `inputsByNodeId[nodeId][virtualPortId]`.
  - `compileGraph` now applies evaluated virtual depth inputs as deterministic in-memory overrides before feature-stack IR compilation.
- Updated UI for Extrude-only wiring row:
  - added wireable depth endpoint inside `ExtrudeFeatureView`,
  - reused canvas pointer/anchor/drop validation handlers,
  - added driven-state UX: wired depth disables manual editing and shows driven value.
- Added/updated tests for virtual port helpers, resolver consistency, validator rules, evaluation mapping, compile determinism/override behavior, and UI rendering/disabled behavior.

### Files Changed
- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part nodes now expose virtual feature input endpoints for extrude depth (`fs:in:<featureId>:extrude:depth`) in app-layer validation/evaluation/UI/compile flow.
- External wires can drive `Extrude.depth`; driven values override embedded depth literals at compile time only.
- Same-node feature-target edges are rejected in v1 with deterministic error code `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED`.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/features/featureVirtualPorts.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts src/app/spaghetti/compiler/compileGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test -- src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/compiler/compileGraph.test.ts`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [042] 2026-03-04 17:55 (Create docs/tasks Master Task File)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update under `docs/`.
- No worker/protocol/scheduler changes.
- No source/schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work in this step.

### Summary of Implementation
- Created new directory: `docs/tasks/`.
- Added `docs/tasks/master-tasks.md` as a central task-tracking document.
- Seeded the file with a deterministic baseline structure:
  - legend,
  - current priority,
  - active work,
  - backlog,
  - completed.

### Files Changed
- `docs/tasks/master-tasks.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- None. Documentation scaffolding only.

### Verification Steps
- Confirmed `docs/tasks/` exists.
- Confirmed `docs/tasks/master-tasks.md` exists with starter sections.
- Confirmed changelog entry inserted at top with next sequential index `[042]`.

<!-- ============================================================ -->
## [041] 2026-03-04 17:53 (Update NODE Tasklist Status for Phase 1 Closure)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime, schema, or renderer code changes.
- No drag-and-drop or feature-stack migration implementation in this step.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` status markers to reflect completed Phase 1 closure work.
- Marked all Phase 1 checklist items complete for:
  - Part container contract (`partSlots`) metadata/normalization/invariants/diagnostics.
  - Locked Part section render order.
  - Required tests and verification tasks.
- Marked Quality Gates entries complete to match current verification and changelog compliance state.
- Left future roadmap sections (Phase 2 and Phase 3) unchanged.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- None. This change updates planning/status documentation only.

### Verification Steps
- Reviewed `docs/NODE-tasklist.md` for updated `[x]` statuses in Sections 2, 3, 4, and 7.
- Confirmed changelog entry inserted at the top with next sequential index `[041]`.

<!-- ============================================================ -->
## [040] 2026-03-04 17:51 (Phase 1 Closure Hardening: Non-Fatal partSlots Parse + Deterministic Coverage)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only changes in spaghetti schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded in `node.params.featureStack`.
- No drag-and-drop implementation.
- Drivers/Inputs/Outputs remain VM-row generated.

### Summary of Implementation
- Updated graph schema parsing so malformed legacy `partSlots` payloads do not hard-fail graph parsing:
  - `spaghettiNodeSchema.partSlots` now accepts unknown payloads at parse boundary.
  - `spaghettiGraphSchema` transform preserves malformed `partSlots` payloads for deterministic downstream repair/validation.
- Kept deterministic normalization and repair architecture unchanged:
  - store canonicalization (`normalizeGraphUiPositions`) still normalizes Part-node `partSlots` silently.
  - validation remains the single warning source for `partSlots` diagnostics.
- Expanded deterministic test coverage:
  - added schema compatibility tests proving malformed `partSlots` payloads parse successfully,
  - added validator invalid-shape matrix tests (`null`, array, string, partial, extra key, false value),
  - added validator reproducibility test for stable warning list/order across runs,
  - added store test proving non-Part nodes are not `partSlots`-normalized.
- Renderer contract remains locked and covered:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`
  - Feature Stack still sourced from embedded `node.params.featureStack`.

### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Malformed legacy `partSlots` payloads no longer cause parse-time graph rejection.
- Deterministic repair path remains app-driven (store normalization + validator diagnostics), preserving backward compatibility.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/schema/spaghettiSchema.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [039] 2026-03-04 17:43 (Add Easy-to-Hard Scale to NODE Tasklist Titles)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update in `docs`.
- No worker/protocol/scheduler changes.
- No app runtime or schema behavior changes.
- No drag-and-drop or feature-stack migration implementation.

### Summary of Implementation
- Updated `docs/NODE-tasklist.md` to include an explicit difficulty scale definition:
  - `1 = easiest`, `100 = hardest`.
- Added `Easy to Hard: X/100` labels directly on each major checklist section title to provide immediate complexity guidance.
- Preserved existing checklist structure and status markers (`[ ]`, `[~]`, `[x]`).

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- None. This is a documentation clarity update only.

### Verification Steps
- Reviewed all major section headings in `docs/NODE-tasklist.md` to confirm each includes a `1-100` difficulty score.
- Confirmed changelog entry is inserted at the top with next sequential index `[039]`.

<!-- ============================================================ -->
## [038] 2026-03-04 17:40 (Add NODE Tasklist Checklist)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Documentation-only update in app docs.
- No worker/protocol/scheduler changes.
- No schema/runtime behavior changes.
- No drag-and-drop or feature-stack migration work performed.

### Summary of Implementation
- Added `docs/NODE-tasklist.md` with a full status checklist covering:
  - locked Phase 1 architectural decisions,
  - Phase 1 container contract tasks (`partSlots` metadata, normalization, invariants, diagnostics),
  - locked part section render order requirements,
  - required tests and verification gates,
  - Phase 2 feature-level wiring roadmap,
  - optional Phase 3 true child-container migration path.
- Checklist uses standardized state markers: `[ ]`, `[~]`, `[x]`.

### Files Changed
- `docs/NODE-tasklist.md`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- None. This change adds planning/documentation only.

### Verification Steps
- Reviewed checklist structure and status markers for deterministic formatting.
- Confirmed changelog entry inserted at top with next sequential index.

<!-- ============================================================ -->
## [037] 2026-03-04 17:39 (Phase 1 Part Container Contract)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only changes in schema/store/validator/canvas tests.
- No worker/protocol/scheduler changes.
- Feature Stack remains embedded at `node.params.featureStack`.
- No drag-and-drop implementation was added.
- Node row-generation architecture remains VM-driven.

### Summary of Implementation
- Added additive `partSlots` structural metadata to `SpaghettiNode` with the Phase 1 contract keys:
  - `drivers: true`
  - `inputs: true`
  - `featureStack: true`
  - `outputs: true`
- Added strict graph-schema parsing support for optional `partSlots`.
- Added new deterministic part-slots utility module:
  - `DEFAULT_PART_SLOTS`
  - `isPartNodeType(...)`
  - `hasValidPartSlots(...)`
  - `normalizePartSlots(...)`
- Integrated deterministic part-slots normalization into graph load canonicalization (`normalizeGraphUiPositions`) for part nodes.
- Added non-fatal deterministic validation warnings for part-slot normalization states:
  - `partSlots_missing_normalized`
  - `partSlots_invalid_shape_repaired`
- Refactored part template section rendering to an explicit ordered descriptor list, locking visible order to:
  - Drivers -> Inputs -> Feature Stack -> Outputs
- Added tests for part-slot normalization/repair, warning-code emission, render-order lock, and Feature Stack embedded-source behavior.

### Files Changed
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/parts/partSlots.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part nodes are now canonically persisted with `partSlots` metadata after load normalization.
- Legacy part nodes missing `partSlots` are deterministically normalized to the default container contract.
- Invalid `partSlots` shapes are deterministically repaired to the default container contract.
- Validator now emits deterministic warning diagnostics for missing/invalid part-slot metadata.
- Part template section rendering order is explicitly locked by descriptor ordering.

### Verification Steps
- `npm.cmd run test`
- `npm.cmd run build`

<!-- ============================================================ -->
## [036] 2026-03-04 03:55 (Expand/Collapse and Toolbar Visibility Improvements)
<!-- ============================================================ -->

### Edit Times (HH:MM)
- 03:49
- 03:52
- 03:55
- 03:56
- 04:00

### Scope / Constraints Honored
- App-layer UI/CSS updates in Spaghetti node template controls and headers.
- No compileGraph, worker, protocol, scheduler, or schema changes.
- Kept behavior metadata-driven with generic section/group collapse interactions.

### Summary of Implementation
- Restored toolbar control visibility by keeping the toolbar toggle button mounted in both open and closed states (show/hide states only).
- Unified driver section presentation to avoid duplicate top-level and grouped `Drivers` labels, then adjusted default driver grouping behavior.
- Enabled collapsible driver subgroups for default/unlabeled driver rows so drivers expand/collapse consistently with section/group headers (`Properties` bucket used where no explicit group label exists).

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Toolbar control button now remains visible after opening the editor.
- Duplicate `Drivers` headers for Baseplate-style default-group drivers were removed.
- Driver buckets now participate in section/group collapse interactions.
- Node dragging in Spaghetti canvas now requires pointer events to originate in top node chrome (`SpaghettiNodeHeader`, `SpaghettiNodePresetRow`, or toolbar editor region), preventing unintended drags from ports/rows.
- Added a global “Pin Size” toolbar slider to control port dot diameter for both input and output pins across nodes.
- Port dot size now follows a shared canvas-level CSS variable (`--sp-port-dot-size`) so updates apply instantly and consistently to all node pins (including template and legacy ports).

### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
## [035] 2026-03-04 03:38 (Fit Node Preset Picker Width to Content)
<!-- ============================================================ -->

### Edit Times (HH:MM)
- 03:38
- 03:44
- 03:47
- 03:29
- 03:30
- 03:32
- 03:36
- 03:39
- 03:42
- 03:48
- 03:49
- 03:52
- 03:53
- 03:55

### Scope / Constraints Honored
- UI/CSS-only adjustment in Spaghetti node preset picker.
- No compileGraph, worker protocol, or graph schema changes.
- Added a generic, metadata-driven section/group collapse model for part-node template sections using stable UI-store keys.
- Preserved node drag/select interaction safety by marking section/group headers as `data-sp-interactive="1"` and keeping drag guard centralized.
- Kept behavior deterministic and node-specific by scoping collapse state to `nodeId` and stable section/group IDs.

### Summary of Implementation
- Changed the node preset picker control width behavior so the dropdown width now shrinks to fit its displayed text (for example `> default`).
- Updated `.SpaghettiNodePresetControls` to auto-width and made the `<select>` intrinsic-content width with nowrap text.
- In output template rows, anchored output header text by position: node output names now align to the top-left corner and output type labels align to the bottom-right near the anchor.
- In output template rows, expanded output header to full row height so type labels can anchor to the row bottom (not only the header token height), reducing the perceived bottom offset from header padding.
- In output template rows, changed the header layout to a 3-row grid so the type sits on a lower row (with extra space) and removed the `â†’` glyph from type labels.
- Mirrored the output node-row styling to template input rows in `v15Theme.css`:
  - input rows now use the slider-driven row height variable (default 40),
  - input row header text is mirrored (name top-right, type bottom-left) with type text using `var(--sp-port-color)`,
  - input composite toggle chevrons are hidden in template sections,
  - input rows keep 50% lane width and are anchored in the left input side while matching output row padding/appearance.
- Updated `Other/Debug (Legacy)` in full part-node mode to match section header styling and added collapse toggles for the parent section and each child section.
- Added a reusable section-header render helper in `NodeView.tsx` so Feature Stack and other collapsible toolbar sections use a common collapse interaction.
- Restored the part-node toolbar control toggle button in `NodeView.tsx` and made toolbar editor rows conditional on that toggle, so the control panel expands on demand rather than always rendering.

### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Template preset picker no longer uses a fixed/stretch width and now matches the selected label width.
- `Other/Debug (Legacy)` and its child sections now support collapse controls in the same format as Drivers/Inputs/Outputs.
- Feature Stack section now collapses via the same shared helper pattern used by other node toolbar headers.
- Added generic top-level section collapse for Drivers/Inputs/Feature Stack/Outputs, plus subgroup collapse in Drivers and Feature Stack.
- Added explicit output composite wire-up for group state while keeping output composite toggle UI removed where requested for output rows.
- Toolbar control button now remains visible after opening the node toolbar editor (toggles between show/hide states rather than disappearing).
- For default unlabeled driver buckets (e.g., Baseplate), suppressed redundant inner `Drivers` group headers so only the top-level section header is shown.
- Restored default/unlabeled driver buckets as collapsible subgroups so drivers can expand/collapse like other section/group headers.
- Default/unlabeled driver bucket header now renders as `Properties` to avoid duplicating the top-level `Drivers` section label while preserving collapse behavior.

### Verification Steps
- `npm.cmd run build` (passed).

<!-- ============================================================ -->
## [034] 2026-03-04 03:24 (Add Global Output Height Slider in Node Toolbar Editor)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer UI/CSS update only for Spaghetti canvas/node editor controls.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Added an `Output Height` slider under existing node toolbar controls (`Sensitivity`, wiring toggle).
- Implemented as global shared state in `SpaghettiCanvas` so changing it in any node updates all output rows.
- Applied the value via CSS custom property (`--sp-output-row-min-height`) on canvas root.
- Updated output row min-height CSS to consume the variable with fallback.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Node toolbar editor now includes an `Output Height` slider.
- Output row minimum height for all nodes updates live from that single slider value.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [033] 2026-03-04 03:21 (Set Output Row Minimum Height to 25px)
<!-- ============================================================ -->

### Scope / Constraints Honored
- CSS/UI-only sizing update for template output rows.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Updated output lane row minimum height to a fixed `25px` for `.SpaghettiTemplateSection--outputs .SpaghettiPort--out`.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now enforce at least 25px height.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [032] 2026-03-04 03:20 (Increase Output Row Height in Template Outputs Lane)
<!-- ============================================================ -->

### Scope / Constraints Honored
- CSS/UI-only update in Spaghetti template output row styling.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Increased output row vertical size by raising output row minimum height and vertical padding.
- Increased output header minimum height to keep label/type alignment centered within the taller row.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Output endpoint rows in the Outputs section now render taller than before.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [031] 2026-03-04 03:19 (Half-Width Input/Output Lanes + Output Row Height Match)
<!-- ============================================================ -->

### Scope / Constraints Honored
- CSS/UI-only layout adjustments for Spaghetti node template lanes.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Restored half-width lane behavior for template endpoint rows:
  - input lane is half-width and anchored left,
  - output lane is half-width and anchored right.
- Kept output pin offset at the outer right edge while preserving lane anchoring.
- Matched output row vertical sizing to input row sizing by aligning output row padding/header min-height with input row baseline.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Input endpoint rows now occupy left half of section width.
- Output endpoint rows now occupy right half of section width.
- Output endpoint row height now visually matches input endpoint row height.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [030] 2026-03-04 03:17 (Align Template Section Widths + Move Output Pins to Outer Edge)
<!-- ============================================================ -->

### Scope / Constraints Honored
- CSS/UI-only layout updates for Spaghetti node template.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Made all template sections use the same width treatment as Drivers by applying the section margin rule to every `.SpaghettiTemplateSection` instead of only the first section.
- Matched port-column widths to driver-style full section width:
  - input port column in template sections now full width,
  - outputs port column now full width (removed half-width right-anchored layout).
- Moved output pins farther right to align with the outer section edge:
  - output row overflow set to visible,
  - output pin offset moved outward.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Inputs/Feature Stack/Outputs sections now visually align in width with Drivers.
- Output rows span full section width instead of half-width.
- Output socket pin sits on the outer right edge, matching the driver-side pin feel.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [029] 2026-03-04 03:14 (Fix Node Selection/Right-Side Click Regression by Wire Layer Ordering)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-layer CSS interaction fix only.
- No graph/compiler/worker/protocol/schema changes.

### Summary of Implementation
- Lowered Spaghetti wire layer stacking order so node surfaces are above wires for pointer interaction.
- This prevents wire hit targets from stealing right-side node clicks and selection interactions.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Node selection/highlight interactions now take precedence over overlapping wire strokes on node rows, including right/output side clicks.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [028] 2026-03-04 03:11 (Remove Output Composite Toggle Button for Inner Spline)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only change in Spaghetti node view rendering.
- No compile graph, worker protocol, or schema/runtime changes.

### Summary of Implementation
- Removed the output composite toggle button hook from composite output row rendering in `NodeView`.
- `Inner` spline output rows no longer render the right-side chevron/toggle button.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Composite outputs still render, but their toggle button is no longer shown in output rows.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [027] 2026-03-04 03:09 (Typed Sockets and Wires by Port Kind)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer Spaghetti canvas/view updates only.
- `compileGraph`, worker protocol, and graph schema were not changed.
- Node rendering remains metadata-driven via `port.type.kind` (no node-type branching).

### Summary of Implementation
- Added a shared type color source in canvas layer:
  - `TYPE_COLOR_MAP` plus `getTypeColor(kind)` in `typeColors.ts`.
- Updated `PortView` socket rendering:
  - socket color now resolves from `getTypeColor(port.type.kind)`,
  - root port row now sets `--sp-port-color` from the same map for consistent color usage.
- Updated wire rendering to inherit source endpoint kind color:
  - `SpaghettiCanvas` resolves source endpoint kind (including composite leaf paths),
  - computes `edgeColorById` using source kind -> `getTypeColor`,
  - passes per-edge colors into `WireLayer`.
- Updated `WireLayer` rendering:
  - each wire path now uses its edge color,
  - crossing loop stroke and waypoint stroke follow the same edge color,
  - preview wire uses source color when available.
- Made compatibility blocking explicit for kind mismatch:
  - connection validation now rejects `from.kind !== to.kind` with a dedicated reason,
  - unit mismatch remains blocked as a separate check.

### Files Changed
- `src/app/spaghetti/canvas/typeColors.ts` (new)
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/WireLayer.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Socket circles now always color from the shared type map keyed by `port.type.kind`.
- Wires now inherit color from the source endpoint type, including composite leaf-field connections.
- Drag-preview wire color follows the current source endpoint when determinable.
- Connection attempts with mismatched endpoint kinds are rejected with an explicit kind-mismatch message.

### Verification Steps
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [026] 2026-03-04 03:40 (Spaghetti Node UI Tweak Pass v2: Driver/Section Styling, Output Streamline, Node Toolbar Editor)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer UI/view changes only.
- No worker/runtime/protocol/scheduler/compile-payload contract changes.
- `NodeView` remained metadata-driven (no node-type branching introduced).
- Deterministic row ordering preserved (no new sort logic added).

### Summary of Implementation
- Performed iterative visual cleanup to push node styling toward Blender-like compactness:
  - tighter row density, smaller sockets, cleaner spacing primitives,
  - driver field endcaps redesigned as integrated clickable caps (step down/up),
  - pin/cap alignment tuned to section box boundaries.
- Unified/expanded section interaction model:
  - clickable section header hit-areas for `Drivers`, `Inputs`, `Feature Stack`, `Outputs`,
  - collapsible section behavior with pins-only rendering for driver/input/output sections.
- Added collapsed driver pin-value readout:
  - small numeric labels above output-side pins in pins-only mode.
- Added node-level toolbar editor launcher beside preset:
  - unlabeled toggle button,
  - hidden editor area above `Drivers`,
  - scrub sensitivity slider,
  - internal wiring visibility toggle.
- Reworked number field styling behavior:
  - restored and refined fill/empty contrast,
  - stronger scrub glow while dragging,
  - text casing and typography normalized to chosen header style baseline (then adjusted back to non-uppercase for field content),
  - text selectability enabled.
- Output section style modernization:
  - compact inline text style (`name -> type`),
  - half-width right-anchored output rows,
  - output row background tinted by output type color,
  - overflow/pin containment fixes within section box.
- Wire layering adjustments:
  - raised spaghetti wire layer above node baseplate/output UI surfaces per UX request.

### Style Standards Established (Current)
- Section headers (`Drivers`, `Inputs`, etc.) define the typography baseline for node control labels.
- Driver number fields:
  - compact single-row control,
  - integrated dark endcaps,
  - distinct empty-area color vs. fill color,
  - pin visibility and line presentation tuned for clarity.
- Outputs:
  - right-anchored half-width compact presentation,
  - no fill-bar treatment for standard output rows,
  - inline directional text emphasis and type-color tinting.
- Preset row controls:
  - toolbar toggle and dropdown match height/border/background family.

### Files Changed
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/fields/NumberField.tsx`
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (UI)
- Drivers/Inputs/Outputs can collapse independently from section headers.
- Driver pins-only mode now shows lightweight numeric value labels near output pins.
- Node toolbar editor is opt-in per node and exposes:
  - scrub sensitivity,
  - internal wiring visibility.
- Endcaps now support click-based incremental stepping.

### Notes
- This entry captures an iterative polish pass with many micro-adjustments in CSS/layout layering.
- Intentional outcome: preserve existing graph semantics while improving node readability and edit ergonomics.

<!-- ============================================================ -->
## [025] 2026-03-04 01:02 (Part Template UI Polish v1: Shared Blender NumberField + Baseplate Width/Length Driver Refactor)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI/view-model/compiler-evaluator app-layer changes only.
- No worker runtime, protocol contract, scheduler, or auto-build behavior changes.
- `NodeView` remains generic and metadata-driven (no node-type branching added).
- Deterministic ordering preserved from registry/VM order (no sorting introduced).

### Summary of Implementation
- Added evaluator-resolved inputs exposure for UI consumption without Canvas-side partial evaluation:
  - `EvaluationResult.inputsByNodeId` now carries the already-resolved per-node inputs map.
- Extended driver VM endpoint row metadata and registry endpoint-driver metadata:
  - endpoint rows now support `displayValue`, `inputWiringDisabled`, and `drivenMessage`,
  - endpoint driver specs now support `wiringDisabled` and `visibility` (`always` / `connectedOnly`).
- Implemented shared numeric controls used by both port rows and driver rows:
  - new `NumberField` with Blender-like square scrub zone + numeric input (single scrub math implementation),
  - new `Vec2Field` composed from two `NumberField` controls with compact `X`/`Y` labels and equal-width layout.
- Refactored `PortView` to consume shared `NumberField` controls and added `resolvedValueLabel` support:
  - input type badge now shows resolved numeric display (e.g. `235.6 mm`) when available,
  - fallback remains type badge when unresolved.
- Refactored `NodeView` driver rows to use shared `NumberField` / `Vec2Field` controls.
- Made collapsed mode editing baseline across modes:
  - `rowViewMode.collapsed.showEditors` set to `true` with tests updated.
- Implemented Baseplate Width/Length driver refactor with selected soft compatibility:
  - Width/Length moved to non-wireable `nodeParam` drivers,
  - legacy width/length input rows preserved as connected-only, read-only migration rows.
- Updated node/port CSS to establish shared row primitives and Blender-style control visuals:
  - driver rows no longer reserve pin gutters or show ghost lane visuals,
  - outputs now support compact right-anchored badge cluster while preserving full-row hit area/wiring behavior.

### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/canvas/fields/NumberField.tsx` (new)
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx` (new)
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Collapsed/essentials/everything now share the same editable Number/Vec2 control baseline; expanded modes add sections/rows instead of changing control style.
- Driver controls now use a unified Blender-like scrub+input control style with no arrows/spinners.
- Numeric input badges can display resolved values when known; unresolved inputs continue to display type badges.
- Baseplate Width/Length primary editing is now in Drivers; legacy width/length input rows appear only when wired and are read-only/non-wireable.
- Output rows keep full-width interaction/wiring behavior while visually right-anchoring the output badge cluster.

### Verification Steps
- `npm.cmd run test -- src/app/spaghetti/canvas/rowViewMode.test.ts src/app/spaghetti/canvas/driverVm.test.ts src/app/spaghetti/compiler/evaluateGraph.test.ts` (passed)
- `npm.cmd run test` (passed)
- `npm.cmd run build` (passed)

<!-- ============================================================ -->
## [024] 2026-03-04 00:29 (HeelKick Part Template v2: ToeHook-Parity Drivers/Ports + Payload-Compatible Anchor Mapping)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI/data-model + spaghetti compiler/store compatibility updates only.
- No worker/protocol/scheduler runtime changes.
- `NodeView` remains generic and metadata-driven; no node-type branches added.
- Deterministic ordering preserved via registry driver order and first-seen group order.
- Registry remains the single source of truth for default node params.

### Summary of Implementation
- Converted existing `Part/HeelKick` node definition to ToeHook-parity part-template shape:
  - Drivers (Global/Profile A/Profile B), non-wireable.
  - Inputs: `anchorSpline`, `railMath` (wireable).
  - Outputs: `hookLoft` with opaque `toeLoft` kind (wireable).
- Added heel-specific deterministic defaults (different from ToeHook) for profile controls:
  - `profileA_end`, `profileA_endCtrl`, `profileA_baseCtrl`,
  - `profileB_end`, `profileB_endCtrl`, `profileB_baseCtrl`.
- Added legacy input alias support on HeelKick:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }`.
- Mirrored ToeHook payload compatibility strategy for HeelKick in compiler:
  - added explicit heel anchor mapping helper (`uiPortId: anchorSpline`, `payloadKey: anchorSpline2`) with invariant comment,
  - added fallback resolution order for heel anchor input:
    1) canonical `anchorSpline`, then
    2) legacy `anchorSpline2`.
- Added compile-time canonicalization pass for legacy input aliases before evaluation/validation, enabling raw legacy graphs to compile without requiring store normalization first.
- Added optional dev fixture for quick manual check:
  - `createValidBaseplateHeelKickGraph()`,
  - panel button: `Load Baseplate - HeelKick`.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- HeelKick now renders full part template sections with populated grouped drivers and pin-bearing inputs/outputs.
- HeelKick accepts legacy incoming anchor edges targeting `anchorSpline2` and canonicalizes/resolves them to `anchorSpline` paths.
- Build payload contract for heel remains unchanged (`...anchorSpline2`).

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [023] 2026-03-04 00:20 (ToeHook Part Template Population v2: Alias Compatibility + Registry Defaults + Opaque Types)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI/data-model and compiler/store compatibility updates for Spaghetti graphing.
- No worker runtime/protocol/scheduler behavior changes.
- Payload key compatibility preserved (`anchorSpline2` remains emitted for ToeHook build inputs).
- Deterministic ordering preserved for driver/input/output rows and grouped drivers (first-seen group order, registry row order).

### Summary of Implementation
- Populated `Part/ToeHook` template metadata with deterministic default drivers/inputs/outputs:
  - Drivers (non-wireable): Global + Profile A + Profile B rows (number + vec2 param controls),
  - Inputs (wireable): `anchorSpline`, `railMath`,
  - Outputs (wireable): `toeLoft`.
- Added registry-level backward compatibility alias metadata:
  - `legacyInputPortAliases: { anchorSpline2: 'anchorSpline' }` on ToeHook.
- Added store-level canonicalization for incoming edge target input port ids using registry aliases, so legacy edges targeting `anchorSpline2` normalize to canonical `anchorSpline`.
- Added single authoritative default param source in registry:
  - `defaultParams` on node definitions,
  - `getDefaultNodeParams(type)` accessor returning a fresh cloned object,
  - updated both add-node flows (`SpaghettiCanvas`, `SpaghettiEditor`) to consume registry defaults.
- Extended generic driver VM and NodeView rendering:
  - new non-wireable node-param driver rows (number and vec2),
  - grouped Drivers rendering is fully metadata-driven and stable (no sorting),
  - no node-type branching added to `NodeView`.
- Added new opaque port kinds:
  - `railMath`, `toeLoft` in shared type/schema unions and UI color mappings.
- Tightened opaque evaluator validation:
  - accepts only `null` or `{ __opaqueRef: string }`,
  - rejects arbitrary objects to avoid silent type masking.
- Added explicit ToeHook UI-to-payload port mapping function in compiler with hard invariant comment:
  - UI input port id: `anchorSpline`,
  - payload key: `anchorSpline2`.
  - Compile path includes fallback support for legacy-stored `anchorSpline2` input edges.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/theme/v15Theme.css`
- `src/app/spaghetti/canvas/driverVm.test.ts` (new)
- `src/app/spaghetti/store/useSpaghettiStore.test.ts` (new)
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- ToeHook part nodes now render meaningful default rows under:
  - Drivers -> Inputs -> Feature Stack -> Outputs.
- ToeHook Drivers are non-wireable controls; Inputs/Outputs remain pin-based wireable endpoints.
- Legacy ToeHook input edge targets using `anchorSpline2` are canonicalized to `anchorSpline` in normalized graph state.
- Build payload contract remains unchanged: ToeHook anchor value still emitted as `anchorSpline2`.
- Opaque kinds `railMath`/`toeLoft` are now wire/display-capable with strict placeholder value validation.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [022] 2026-03-03 23:05 (Baseplate Outputs v1 Cleanup: Public Interface Tightening)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI/registry-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic output ordering behavior preserved.

### Summary of Implementation
- Updated `Part/Baseplate` output port declarations to the minimal public set by removing incidental outer spline output exposure:
  - kept: `anchorSpline2` (wireable public endpoint),
  - removed from public outputs: `offsetSpline2` (intermediate/internal artifact).
- Kept existing output-driver taxonomy unchanged:
  - `Inner Spline Anchor` endpoint row remains in `Outputs`,
  - reserved `Mesh Output` pending row remains endpoint-less and non-wireable.
- Updated Baseplate compute return shape to remove undeclared `offsetSpline2`, keeping evaluator validation green while preserving compiler/integration code paths unchanged.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Baseplate now exposes only intended public output endpoint (`Inner Spline Anchor`) plus reserved mesh pending row in template output rows.
- In `everything` mode, Baseplate no longer contributes incidental endpoint(s) to `Other Outputs` via port-subtraction.

### Verification Steps
- `rg -n "offsetSpline2|Base Plate Spline \\(Outer\\)" src/app/spaghetti/registry/nodeRegistry.ts`
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`

<!-- ============================================================ -->
## [021] 2026-03-03 22:56 (Part Node Template v1 Taxonomy Refactor: Drivers / Inputs / Outputs)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only refactor in canvas/view-model layers.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved from metadata arrays and stable endpoint-key subtraction.

### Summary of Implementation
- Refactored part-template row taxonomy in VM and `NodeView` from `Input Drivers/Output Drivers` to:
  - `Drivers` (feature-param controls, non-wireable),
  - `Inputs` (wireable endpoint rows),
  - `Outputs` (pinned endpoint rows + reserved rows),
  - `Other Outputs` (everything-only, non-pinned endpoint rows).
- Updated `driverVm` output shape to `drivers`, `inputs`, `outputs`, `otherOutputs` while keeping existing metadata fields (`inputDrivers`, `outputDrivers`) unchanged for minimal API churn.
- Updated part-template render order in `NodeView` to:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`,
- Locked collapsed-mode rendering behavior in UI:
  - drivers rows render,
  - inputs rows render with anchors/pins,
  - feature stack internals are hidden,
  - outputs rows render.
- Updated reserved mesh row interaction markers:
  - row and dot now include both `data-sp-interactive="1"` and `data-sp-disabled-port="1"`,
  - row remains endpoint-less and non-wireable.
- Updated canvas interactive-target guard so disabled reserved port targets are still treated as interactive UI targets (preventing node-drag capture on that control area).

### Files Changed
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part node sections now display locked taxonomy labels: `Drivers`, `Inputs`, `Feature Stack`, `Outputs`.
- `Outputs` remains the last core section in all modes.
- Reserved mesh pending row remains disabled/non-wireable but no longer behaves like non-interactive empty space for node drag/select hit-testing.

### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [020] 2026-03-03 20:44 (Remove Baseplate Title-Click Mode Buttons; Keep Right-Click Mode Menu)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Removed Baseplate header click-to-open mode picker from `NodeView`.
- Removed associated callback wiring from `SpaghettiCanvas`.
- Removed now-unused mode-picker styles from theme.
- Right-click node context menu (`collapsed` / `essentials` / `expanded`) remains the active mode-switch UI.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking Baseplate title/top no longer opens row-mode buttons.
- Row mode switching from nodes is now right-click menu driven.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [019] 2026-03-03 20:39 (Context Menu Routing: Blank Canvas Adds Nodes, Node Blocks Switch Row Mode)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only interaction update.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Updated viewport right-click behavior in `SpaghettiCanvas`:
  - If target is inside a `.SpaghettiNode`, open node row-mode context menu.
  - If target is on blank canvas area, open existing add-node search menu.
- Added canvas-level node row-mode context menu using `SpaghettiContextMenu` with 3 options:
  - `collapsed`
  - `essentials`
  - `expanded` (maps to internal `everything` row mode)
- Menus are mutually exclusive:
  - opening node mode menu closes add-node menu,
  - opening add-node menu closes node mode menu.
- Added Escape handling for the node row-mode context menu.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Right-click on blank node editor space now shows the add-node search menu only.
- Right-click on any node block (Baseplate, Toe Hook, Heel Kick, etc.) now shows row-mode options instead of add-node menu.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [018] 2026-03-03 20:34 (Baseplate Header Mode Picker: Collapsed / Essentials / Expanded)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only behavior and styling changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Replaced Baseplate title click behavior with a header mode picker.
- Clicking the top Baseplate header now toggles a 3-button mode menu:
  - `collapsed`
  - `essentials`
  - `expanded`
- Mode button mapping:
  - `collapsed` => row mode `collapsed`
  - `essentials` => row mode `essentials`
  - `expanded` => row mode `everything` (internal expanded mode)
- Added compact button styles and active-state highlighting for current row mode.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking the top of a Baseplate node now opens mode options instead of immediately forcing `collapsed`.
- Selecting a mode button switches the canvas into that mode and closes the picker.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [017] 2026-03-03 20:30 (Align Scrub Slider Left Edge with Preset Dropdown)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only style adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph semantic changes.

### Summary of Implementation
- Introduced a shared right-column width token for Baseplate controls (`clamp(140px, 50%, 170px)`).
- Applied the shared width to:
  - `Preset` dropdown (`.SpaghettiNodePresetRow select`),
  - scrub controls row (`.SpaghettiNodeScrubControls`).
- Kept scrub slider at 50% width and right-anchored within that aligned control column.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Scrub slider no longer spans the full node row.
- Slider left edge now aligns with the `default` preset dropdown left edge above.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [016] 2026-03-03 20:28 (Scrub Toggle Presets Restored with Continuous Half-Width Slider)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only change in canvas layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Reintroduced scrub toggle button in Baseplate sketch header with two presets:
  - `low` preset => `0%`,
  - `high` preset => `100%`.
- Kept continuous slider behavior (`0..100`) and in-between values.
- Preset state is derived from current slider position and toggles between the two preset endpoints.
- Existing slider layout remains half-width and right-anchored.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Users can now freely scrub with the slider and also jump instantly between low/high preset values via the toggle button.
- Slider remains half-width and anchored right as requested.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [015] 2026-03-03 20:27 (Baseplate Scrub Slider: Half-Width Right Anchor + Continuous 0-100)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only changes in canvas/theme layers.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Replaced binary scrub mode (`low`/`high`) with a continuous numeric scrub setting (`0..100`) in `NodeView`/`PortView`.
- Updated Baseplate scrub control UI:
  - slider range now `0..100` with fractional movement (`step=0.1`),
  - removed low/high toggle button,
  - value display now shows percentage.
- Updated scrub drag behavior in `PortView` to interpolate threshold and sensitivity across the full slider range.
- Updated theme styles so the scrub slider is half-width and remains right-anchored in its row.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Scrub speed now glides smoothly from 0 to 100 and uses in-between values.
- Slider occupies half the scrub row width and stays aligned to the right.
- Scrub mode toggle button is removed in favor of continuous slider control.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [014] 2026-03-03 20:25 (Baseplate Drivers Label Moved Below Scrub Controls)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only layout adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate/runtime behavior changes.

### Summary of Implementation
- Updated Baseplate sketch header layout styles to stack content vertically.
- Positioned scrub speed controls on the first row and the `Drivers` label on the second row.
- Kept existing control behavior and interaction handling unchanged.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- `Drivers` is no longer horizontally aligned with the speed controls; it now appears one row lower.
- Scrub controls remain right-aligned and functionally unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [013] 2026-03-03 20:24 (Baseplate Title Click Forces Collapsed Row Mode)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only change.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate semantic changes.

### Summary of Implementation
- Added a dedicated `onBaseplateTitleClick` callback from `SpaghettiCanvas` to `NodeView`.
- In `NodeView`, made the title text interactive only for Baseplate nodes:
  - stops pointer-down propagation to avoid node drag initiation from title clicks,
  - invokes the callback on click.
- In `SpaghettiCanvas`, callback sets row mode directly to `collapsed`.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking the `Baseplate` text in the node header now forces canvas row mode to `collapsed`.
- Other node title clicks are unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [012] 2026-03-03 22:38 (Data-Driven Part Template v1: Driver VM + Template-Flag NodeView)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only refactor in canvas/registry/theme layers.
- No edits under `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved via metadata order and stable endpoint keys.

### Summary of Implementation
- Added explicit part-template metadata to node definitions:
  - `template?: 'part'`
  - `inputDrivers` and `outputDrivers` specs
  - feature-param driver (`firstExtrudeDepth`) and reserved output (`mesh`, `pending`) support.
- Added generic driver VM resolver (`driverVm.ts`) that maps node metadata + params to render rows without node-type branching in `NodeView`.
- Refactored `NodeView` to a template-driven renderer:
  - chooses part-template path only via `template === 'part'`,
  - renders canonical section order,
  - keeps Output Drivers pinned before everything-only sections,
  - renders Input Drivers rows even in collapsed mode,
  - renders reserved mesh row as disabled (dot visible, non-wireable, no endpoint registration).
- Updated `SpaghettiCanvas` to:
  - precompute and pass compact `driverVm`,
  - handle driver numeric edits generically (`nodeParam` + `featureParam:firstExtrudeDepth`),
  - keep `otherOutputs` deterministic as all outputs minus output-driver endpoints.
- Updated `FeatureStackView` with `mode: 'summary' | 'full'` and wired summary/full behavior by row mode.
- Added disabled-port interaction guard support for reserved rows using `data-sp-disabled-port="1"`.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part-node layout is now metadata/template driven rather than node-type branching in `NodeView`.
- Collapsed mode keeps Input Driver and Output Driver endpoint anchors visible; hidden internals do not register anchors.
- Essentials mode shows only drivers + feature stack summary (legacy/debug sections hidden).
- Everything mode shows drivers + full feature stack, then other outputs and legacy/debug sections.
- Reserved Mesh Output row is visibly disabled, always shows a dot, and is non-interactive for wiring.

### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [011] 2026-03-03 20:20 (Input Node Click Promotes Collapsed Row Mode to Essentials)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only change in allowed layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Updated `handleNodePointerDown` in `SpaghettiCanvas` to resolve the clicked node before drag start.
- In `collapsed` row mode, clicking an input/source-style node now schedules `setRowViewMode('essentials')`.
- Input/source-style node detection is based on node definition shape: zero inputs and at least one output.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking an input/source node while canvas row mode is `collapsed` now opens row mode to `essentials`.
- Existing node selection and drag initiation behavior for non-interactive node surface remains unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [010] 2026-03-03 20:08 (Selected Baseplate Chevron Interaction Guard via Interactive Targets)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No row-mode or composite-evaluation semantic changes.

### Summary of Implementation
- Added reusable interactive-target predicate in canvas:
  - `isSpaghettiInteractiveTarget(target: EventTarget | null)`.
  - Matches `data-sp-interactive="1"` first, then form-control and existing Spaghetti interactive selectors.
- Updated `handleNodePointerDown` in `SpaghettiCanvas`:
  - replaced inline interactive selector logic with predicate call,
  - removed early interactive-branch `stopPropagation`,
  - retained existing drag-init path behavior for non-interactive node surface.
- Marked interactive controls with `data-sp-interactive="1"`:
  - composite chevron button,
  - value bar container/track,
  - range input,
  - context-menu root container.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- When Baseplate node is selected, clicking `Anchor Point 1` (and other composite) chevron now expands/collapses immediately without requiring deselection.
- Node drag still starts from non-interactive node areas.
- Port wire drag, value scrubbing, and context menu interactions remain available through interactive elements.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [009] 2026-03-03 18:09 (Anchor Bar Click Forces Essentials Mode Deterministically)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only patch in canvas layer.
- No changes under `features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- Row-mode transition remains render/UI-only behavior.

### Summary of Implementation
- Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars.
- Detection now resolves to the parent composite group root port label (`Anchor Point 1..5`) so leaf `X/Y` bar clicks are included.
- Mode transition is forced one-way to `essentials` via `requestAnimationFrame` to avoid ending in any other row mode during the same click cycle.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking any sketch anchor-point value bar now settles row mode to `essentials` deterministically, including clicks on expanded leaf bars.
- No compile/evaluate/runtime behavior changed.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [008] 2026-03-03 18:03 (Canvas Drag Rerender Guard for Port Drop State)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI repair only in allowed canvas layer.
- No changes in `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler edits.
- Row mode and composite expansion behavior remain render-only concerns.

### Summary of Implementation
- Added a stable `connectionDragAnchor` snapshot in `SpaghettiCanvas` derived only from anchor identity fields (`direction`, `nodeId`, `portId`, `path`).
- Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full `connectionDrag` object.
- This prevents per-pointer-move callback identity churn from propagating into memoized `NodeView` props during wire dragging.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- While dragging a wire, node drop-state rendering now updates based on anchor/hover target changes rather than every pointer-position update, reducing avoidable node rerenders.
- No graph compile/evaluate semantics were changed; no row mode or composite state semantics were changed.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [007] 2026-03-03 17:55 (UI Stabilization Amendments: Composite Map State + Output Leaf Rendering)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No CAD/feature execution logic moved into UI.
- No compiler behavior changes for graph semantics.
- Row modes remain render-only controls.

### Summary of Implementation
- Added row-mode helper flags in `rowViewMode` limited to row concerns only:
  - `showEditors`
  - `showDebugInfo`
  - `renderLeafRows`
  - `forceLeafRows`
- Added composite expansion key helper with exact parent-key format:
  - `spComp|in|${nodeId}|${portId}`
  - `spComp|out|${nodeId}|${portId}`
- Moved composite expansion state ownership to `SpaghettiCanvas` using `Map<string, boolean>` and map-safe update helpers.
- Removed `evaluateSpaghettiGraph` usage from `NodeView`; node evaluation/derived display data are now prepared in `SpaghettiCanvas` and passed as node-scoped props.
- Kept `NodeView` render-focused and memoized while avoiding broad store subscriptions.
- Implemented composite output leaf rendering with deterministic field-tree traversal and mode-gated visibility:
  - `collapsed`: parent only
  - `essentials`: expansion-gated leaves
  - `everything`: forced leaf visibility without mutating stored expansion state
- Ensured output leaf anchors mount only when leaf rows are rendered; parent anchors remain mounted.
- Replaced per-node inline hover/drop wrappers from canvas render loop with stable shared callbacks.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/compositeExpansion.ts`
- `src/app/spaghetti/canvas/compositeExpansion.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes
- Row mode semantics are now explicit and deterministic for composite leaves across input/output columns.
- Composite expansion state is now parent-row scoped for both directions (`in` and `out`) and stored as canvas-local map state.
- `NodeView` no longer performs graph evaluation; UI rendering is separated from evaluation logic.
- Output composite ports now expose deterministic leaf rows/anchors when visible by mode.
- No compiler/worker/protocol behavior changes.

### Perf Check
- Method: render-path stability audit focused on `NodeView` subtree invalidation sources.
- Verified changes:
  - node-scoped derived render payload is memoized in `SpaghettiCanvas` (`nodeRenderDataById`),
  - composite expansion mutation bumps revision for the affected node only,
  - shared hover/drop handlers are stable callbacks rather than per-node inline wrappers.
- Result: non-node canvas state updates no longer introduce avoidable node-subtree prop churn from those prior wrapper/data patterns.

### CSS Impact
- Global theme selectors changed: none.
- Local class strategy retained; no `v15Theme.css` selector edits were required for this pass.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [006] 2026-03-03 17:04 (Expose Fields + View Modes)
<!-- ============================================================ -->

### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior changes.
- Determinism preserved for composite field ordering and path-aware endpoint handling.
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Legacy mixed whole+leaf graphs preserved with warning behavior; no edge deletion.
- Parent composite anchor remains active in collapsed row mode.
- Part panel ordering preserved when visible: `uiSections -> params -> Feature Stack`.

### Summary
- Added `fieldTree` composite definitions for `spline2` and `profileLoop` with deterministic leaf traversal.
- Added deterministic tests for new `fieldTree` leaf paths.
- Extended `validateGraph` tests with test-local `profileLoop` fixture node defs (no runtime node-type additions).
- Added expanded-canvas row view modes: `collapsed`, `essentials` (default), `everything`.
- Wrapped `NodeView` in `React.memo` and passed `rowViewMode` as a stable union prop from `SpaghettiCanvas`.
- Enforced composite expansion state key scope to parent row only: `spComp|in|${nodeId}|${portId}`.
- Applied mode filters:
  - `collapsed`: parent rows/anchors visible, leaf rows hidden.
  - `essentials`: labels/types/editors/composite expansion visible; debug/info hidden.
  - `everything`: full debug/info visibility and full field disclosure rendering.
- Generalized composite handling beyond vec2 while preserving existing driven-authority behavior.
- Normalized baseplate spline output display labels to:
  - `Base Plate Spline (Inner)`
  - `Base Plate Spline (Outer)`
- Added minimal `spComp_` and `spView_` CSS hooks for mode/control styling.

### Files Changed
- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/types/fieldTree.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes
- Composite types `spline2` and `profileLoop` now expose deterministic leaf paths in app-layer field tree introspection.
- Row mode now controls node-port disclosure without mutating graph edges or compile/evaluate semantics.
- In collapsed row mode, parent composite anchors remain wireable while leaf anchors are hidden.
- Essentials mode now suppresses debug/info UI while preserving core port labels, type tags, editors, and composite expansion interactions.
- Everything mode shows debug/info panels and full recursive composite leaf rendering.
- Baseplate spline output labels are standardized for UI display without changing port IDs/types.

### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [005] 2026-03-03 16:05 (Feature Stack v1 Debug Preview: App-Layer IR-Driven UI)
<!-- ============================================================ -->

### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior added.
- Deterministic ordering/labels/rendering enforced for preview and diagnostics.
- Feature Stack panel placement updated to locked order: `uiSections -> params -> Feature Stack`.

### Summary
- Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side `compileFeatureStack` calls).
- Extracted shared compile helper in `compileGraph` so payload emission and UI cache use the same part IR derivation path.
- Added store-level cache and selector for per-part Feature Stack IR mapped from nodeId.
- Added sketch profile SVG previews with deterministic fit mapping, closed-loop visual enforcement, stable labels, and stable numeric formatting.
- Added extrude preview summary and profile highlight based strictly on `profileRef.profileId`.
- Applied deterministic diagnostics sort/key policy and per-level badge counts.
- Added namespaced `fsPrev_*` styles and pure-function tests for preview determinism.

### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/ui/features/profilePreview.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes
- Feature previews now consume compile-path part IR via store cache (`getPartFeatureStackIrForNode`) instead of recompiling in UI.
- Sketch preview profile ordering is now deterministic: area descending, then `profileId` ascending.
- Sketch/extrude preview labels now use `A..Z`, then `Profile <n>` fallback.
- Extrude preview highlight now keys only on `profileRef.profileId`.
- Diagnostics display now applies stable ordering (`error`, `warning`, `info`, then message, then featureId) and deterministic keys.
- Part node panel order is now `uiSections -> params -> Feature Stack`.

### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [004] 2026-03-03 15:37 (Feature Stack v1 Worker Pipeline: Option-B Runtime Execution)
<!-- ============================================================ -->

### Scope / Constraints
- Implemented worker + CAD runtime execution for Feature Stack v1 with deterministic in-memory mesh-pack adapter.
- No scheduler behavior changes.
- No shared protocol contract changes.
- No auto-build behavior changes.
- Legacy build result envelope remains `PartArtifact[]`.
- Worker payload handling remains branch-specific flat profile patch (`payload.sp_featureStackIR` namespace).

### Summary
- Added app compile emission for Option-B sketch payload:
  - `IRSketch.profilesResolved: [{ profileId, area, vertices[] }]`
  - deterministic ordered loop vertices with CCW normalization
  - runtime closes loops when needed
- Added worker feature stack runtime that:
  - executes parts in sorted key order
  - executes features in IR order
  - treats app-emitted `profileId` as authoritative
  - does not re-derive profiles from lines
  - extrudes by `profileRef.profileId` with `bodyId = ir.bodyId ?? ir.featureId`
  - applies first-wins policy on duplicate `bodyId`
  - performs deterministic mesh-pack merge (not CAD boolean fuse)
- Added bounded deterministic diagnostics:
  - dedup key: `${partKey}|${featureId}|${reason}`
  - single flush per build via worker build orchestrator
- Integrated runtime into active worker build path through a new thin `buildModel` coordinator while preserving legacy artifacts output.

### Files Changed
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/products/foothook/buildFoothook.ts`
- `docs/listofchanges.md`

### Behavior Changes
- App compile IR now includes `profilesResolved` loop geometry for sketch ops (Option-B lock).
- Worker Feature Stack execution is active when `sp_featureStackIR` is present in current payload patch namespace.
- Worker now emits at most one aggregated warning log per build for unique runtime warnings.
- Runtime merge semantics are deterministic mesh concatenation in stable bodyId order; no CAD boolean claims.

### Verification
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`
- Vite large-chunk warning remains unchanged (non-regression).

<!-- ============================================================ -->
## [003] 2026-03-03 (Feature Stack v1 Spec-Alignment: App Layer)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only changes.
- No worker/protocol/scheduler contract changes.
- No auto-build behavior changes.
- `buildRequestSchema.profile` remains `z.record(z.string(), z.unknown())`.
- Existing composite/path/wiring behavior preserved.

### Feature API Alignment
- Added canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- Kept compatibility alias:
  - `deriveProfilesFromLines = deriveProfiles`
- Added canonical auto-link export:
  - `pickDefaultProfileRef(stack, insertIndex)`
- Kept compatibility alias:
  - `findDefaultExtrudeProfileRef = pickDefaultProfileRef`
- Aligned diagnostics type to canonical shape:
  - `Diagnostic = { featureId, level, message }`
- Kept compatibility type alias:
  - `FeatureDiagnostic = Diagnostic`

### Determinism and Derivation Contract
- Updated profile derivation to locked deterministic rules:
  - point keys use exact `${String(x)}|${String(y)}`
  - exact literal endpoints (no tolerance rounding path)
  - deterministic adjacency and traversal
  - canonical signature normalization (rotation + direction)
  - stable FNV-1a 32-bit base36 profile IDs
  - zero-area loop rejection
  - stable output sorting: area desc, signature asc, profileId asc

### Store / UI Alignment
- Store now uses canonical helpers:
  - `deriveProfiles(...)`
  - `pickDefaultProfileRef(...)`
- Added/used part stack helpers:
  - `getPartFeatureStack(node)`
  - `setPartFeatureStack(node, stack)`
- Sketch profile outputs are recomputed immediately after line edits.
- Feature stack UI diagnostics no longer rely on `diagnostic.code`.
- Diagnostics keys are deterministic:
  - `${featureId}|${level}|${message}|${index}`
- Extrude collapsed summary now matches spec format:
  - `Profile: <SketchShort>/<ProfileLabel>, Depth: <value>`
- Profile labels use `A..Z` then `Profile <n>` fallback.

### Compile / Payload Alignment
- `sp_featureStackIR` compile emission aligned to non-empty feature stack presence.
- Emitted IR payload remains:
  - `{ schemaVersion: 1, parts: Record<PartKey, IR[]> }`
- Existing part-key mapping retained (`baseplate`, `toeHook#1`, `heelKick#1`) with deterministic behavior.
- Patch/change detection path continues using stable hashing and includes `sp_featureStackIR`.

### Files Changed
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

### Interaction Boundary Guard Fix (2026-03-04)
- Fix: prevent node drag/select from capturing UI control pointerdown; audit interactive markers.
- Added shared interaction helper `src/app/spaghetti/spInteractive.ts`:
  - `isInteractiveTarget(target)` selector guard
  - `SP_INTERACTIVE_PROPS` (`data-sp-interactive` + pointerdown stopPropagation)
- Updated canvas drag/select boundary handling:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` now uses `isInteractiveTarget` in node pointerdown handling
  - stage deselect pointerdown now ignores interactive targets
- Audited/updated interactive control guards in:
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - `src/app/spaghetti/canvas/NodeView.tsx`

<!-- ============================================================ -->
## [002] 2026-03-03 (Spaghetti Floating Window Follow-up: Default Geometry + Drag)
<!-- ============================================================ -->

### Floating Window Behavior
- Updated default Spaghetti floating window open anchor to start around 30% down from viewport top.
- Re-enabled normal dragging immediately on open (removed resize-first drag gating).
- First drag now marks the floating window as user-positioned so it behaves like a normal float window.
- Updated default open width to span from the left side to the left side of the gizmo/right overlay area.
- Updated default open height to span from the 30% top anchor down to the viewport bottom (subject to existing clamp/padding).

### Files Changed
- `src/app/AppShell.tsx`

<!-- ============================================================ -->
## [001] 2026-03-03 (Compiled Master Entry)
<!-- ============================================================ -->

### Scope / Locked Invariants
- App-layer only changes in this phase; no worker/protocol/scheduler contract changes.
- Compile/build remains explicit; canvas interactions do not auto-trigger build.
- Determinism preserved for path-aware logic and composite handling (edge traversal sorted by `edgeId` where required).
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Parent composite anchor remains active while collapsed.
- Legacy mixed graphs (whole + leaf edges) are preserved; UI warns but does not delete edges.

### Canvas and Node Editor UX
- Added right-click canvas node-add menu with search, placing nodes at cursor.
- Added typed color coding for ports/anchors so colors match port kinds.
- Updated anchor measurement to use actual small port-circle elements.
- Fixed floating editor/canvas anchoring so node editor fills/anchors correctly in floating window.
- Added collapsible `Preview Mode` and `Parts List` sections.
- Updated node layout to top-left inputs and bottom-right outputs.
- Baseplate node now presents `Drivers` and `Sketch Inputs` sections with grouped labels.

### Wire Routing and Editing
- Added wire curviness slider (`0` linear, `25` baseline, `100` highly curved).
- Added reroute-point editing:
  - double-click wire to add point
  - drag point to reshape
  - double-click point to remove
  - supports multiple points per wire
- Enforced node-end tangency:
  - outputs depart right-tangent
  - inputs arrive left-tangent
- Added tangent controls for selected waypoints:
  - `Flip Tangent Side 1`
  - `Flip Tangent Side 2`
- Reworked waypoint segment routing to keep tangency through reroute points.

### Numeric Controls and Baseplate Sketch UX
- Moved Baseplate `width`/`length` to inline port controls.
- Added matching inline template for `Primitive/Number`.
- Unified value-bar control includes:
  - blue fill by min/max range
  - label + value in one row
  - arrow step nudging
  - horizontal drag-scrub
- Added Baseplate vec2 sketch inputs `anchorPoint1..anchorPoint5` under `Sketch Inputs`.
- Each vec2 sketch input uses 50/50 `X`/`Y` inline layout.
- Width/Length driver updates resync sketch points to canonical rectangle.
- Added Baseplate scrub-speed toggle (`low` blue / `high` green) and increased `high` sensitivity.

### Composite Field Tree and Path Endpoint System
- Added composite field introspection:
  - `getFieldTree`
  - `getFieldNodeAtPath`
  - `isCompositeFieldNode`
  - `listLeafFieldPaths`
  - vec2 mapping for `vec2:mm` and `vec2:unitless` -> `{ x, y }`
- Upgraded endpoints to optional path:
  - `EdgeEndpoint = { nodeId, portId, path?: string[] }`
  - schema keeps no-path compatibility and validates non-empty path segments when present
- Store normalization updates:
  - empty path -> `undefined`
  - legacy synthetic migrations:
    - `anchorPointNX` -> `anchorPointN` + `path: ['x']`
    - `anchorPointNY` -> `anchorPointN` + `path: ['y']`
  - connection drag now carries `fromPath`
- Canvas anchor keys and wire rendering are path-aware:
  - `buildPortAnchorKey` includes encoded path token
  - `parsePortAnchorKey` added
  - wire lookup/render includes endpoint paths
- Connection flow (`SpaghettiCanvas`) is path-aware:
  - hover compatibility checks full endpoint `(nodeId, portId, path)`
  - duplicate detection checks full endpoint
  - rewire uses exact input endpoint (including leaf path)
  - cycle check remains node-level via `validateGraph`
  - details lines display endpoint paths
- Composite renderer changes:
  - NodeView owns transient expansion map
  - PortView local expansion removed
  - composite leaf rows generated from field tree paths
  - child rows register path endpoints/anchors
  - Baseplate vec2 uses canonical `x`/`y` child paths (no synthetic scalar ports)
- Validator updates:
  - base port/path existence checks
  - path endpoints must resolve to leaf
  - leaf type exact-match
  - duplicate leaf target rejection
  - max connections enforced per endpoint key (`node + port + path`)
  - cycle detection unchanged
- Evaluator updates (deterministic):
  - composite input priority:
    1) leaf-path wires
    2) whole-port wire fallback
    3) literal fallback
    4) type-default fallback
  - respects `from.path`
  - edge ordering sorted by `edgeId`
  - unresolved optional composites inject defaults per locked decisions
- Compile helper updates:
  - whole-port compile lookup ignores target leaf edges
  - source extraction respects optional `from.path`

### Composite Vec2 Parent UX (Break/Group + Info Menu)
- Collapsed composite vec2 parent rows render inline `X`/`Y` value bars (blue tone, 50/50 split).
- Parent anchor remains active while collapsed.
- Inline editors continue using existing literal param backing values (no new literal store).
- Whole-port driven authority mode:
  - NodeView computes local driven maps from store edges (sorted by `edgeId`)
  - whole-driven: collapsed/expanded leaf editors become read-only
  - whole-driven: leaf drop/rewire blocked with status `Driven by parent wire`
  - leaf-driven (x/y only): per-axis disable on collapsed row
  - whole display prefers evaluated source output; falls back to literal when unresolved
  - legacy whole+leaf preserved with warning badge `Leaf override exists`
- Parent-row context menu (node-scoped absolute menu):
  - `Break composite` / `Group pins`
  - `Show info` / `Hide info`
  - closes on outside click and `Escape`
  - right-click prevents default/propagation so canvas add-node menu is not triggered
- Menu positioning fix:
  - opens under cursor correctly under canvas transforms/zoom
  - coordinates account for node scale
- Removed top-right composite action buttons in favor of context menu actions.
- Added CSS support for inline XY, driven/disabled states, warning badge, and menu visuals.

### Testing and Tooling
- Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence.
- Added `npm run test` script and `vitest` dev dependency.

### Files Changed (Grouped by Area)
- Canvas/UI core:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `src/app/spaghetti/canvas/WireLayer.tsx`
  - `src/app/spaghetti/canvas/spaghettiWires.ts`
  - `src/app/spaghetti/canvas/types.ts`
- Node/port/composite UI:
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - `src/app/spaghetti/ui/ExpandedEditor.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Schema/store/types:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/spaghetti/types/fieldTree.ts`
- Compiler/runtime behavior:
  - `src/app/spaghetti/compiler/validateGraph.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
- Registry/theme/tooling/tests:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/theme/v15Theme.css`
  - `package.json`
  - `src/app/spaghetti/types/fieldTree.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`

### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)
