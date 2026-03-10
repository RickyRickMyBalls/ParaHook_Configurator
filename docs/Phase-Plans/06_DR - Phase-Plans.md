# DR - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
3. 2026-03-08 00:00: Added a cautious legacy/removal pass to the `DR` family checklist blocks, marking the old pre-canonical driver ID forms and the still-supported primitive-value compatibility path as `L` items while leaving the rest of the phase history as active canonical behavior
2. 2026-03-08 00:00: Rebuilt the completed `DR` phases from `docs/CHANGELOG.md`, promoting `DR - Phase 3` to reconstructed status and adding real summaries, grouped detailed checklists, and file-footprint sections for `DR - Phase 3` and `DR - Phase 7` through `12`
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `DR` family now has a proper home for later changelog reconstruction, checklist buildout, and future driver-system planning

##### Purpose

This file is the simple phase-family history document for the `DR` prefix.

Use this file for:
- the canonical `DR` phase sequence
- a simple explanation of what each `DR` phase did
- understanding how the control and value-routing layer evolved over time
- seeing where major `DR` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `DR` Means

`DR` is the canonical control and value-layer prefix.

It is used when the main work is about:
- driver identity and driver routing
- parameter ownership and exposure
- input-node and parameter-node systems
- promoted values and user-facing control surfaces
- value-flow rules between graph editing, compile, and runtime behavior

##### Format And Depth

Use this file as the planning and checklist home for canonical `DR` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - DR - Phase 3 - `Param Ownership / Routing v20` - Reconstructed

Human Summary: This applied modern param ownership and changed-id routing to the `/20/` restart direction, tying part-owned params more directly to affected-part routing and future selective recompute behavior.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It sits directly on top of the early `PT` ownership move and turns that ownership into a real routing model.

##### Phase Summary

Current understanding:
- modern param ownership and changed-id routing were applied to the `/20/` direction
- part-owned param namespaces became more tightly linked to affected-part routing behavior
- flat global rebuild thinking was reduced in favor of more controlled routing toward selective recompute

##### Files Changed

- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`

### Phase 3 CheckList

- [x] apply modern param ownership to the `/20/` restart direction
- [x] tie changed-id routing more directly to part-owned param namespaces
- [x] strengthen the bridge between param routing and future selective recompute
- [x] reduce flat global rebuild thinking in favor of controlled part-aware routing

## [x] - DR - Phase 7 - `Expose Fields And View Modes`

Human Summary: This expanded deterministic field-tree support and added the `collapsed / essentials / everything` row-view modes, making composite value fields easier to inspect without breaking generic node rendering.

### Phase 7 Overview
#### Fold Hack 4

##### Phase Notes

This is the first later direct changelog-backed `DR` maturity pass in the modern app-layer node UI.

It mixes value-surface exposure work with deterministic composite-field handling and view-mode control.

##### Phase Summary

Current understanding:
- `fieldTree` support was expanded for `spline2` and `profileLoop` with deterministic leaf traversal
- composite value exposure became more general than the old vec2-only path
- row-view modes were formalized so nodes can show a compact essential view or a full debug-heavy view without changing graph semantics
- node UI disclosure and composite expansion stayed metadata-driven and generic

##### Files Changed

- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/types/fieldTree.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/theme/v15Theme.css`

### Phase 7 CheckList

- [x] add deterministic `fieldTree` composite definitions for `spline2` and `profileLoop`
- [x] extend validation/test coverage for the new composite leaf paths
- [x] add expanded row-view modes: `collapsed`, `essentials`, and `everything`
- [x] keep parent composite anchors active in collapsed row mode while hiding leaf rows
- [x] generalize composite handling beyond vec2 while preserving driven-authority behavior
- [x] standardize baseplate spline output display labels
- [x] add minimal styling/hooks for view-mode and control-surface rendering

## [x] - DR - Phase 8 - `Virtual Feature Wiring Expansion`

Human Summary: This was the major DR expansion wave that turned driver and feature wiring into a real app-layer contract, adding virtual driver ports, virtual feature inputs, deterministic row ordering metadata, auto-replace semantics, and expanded extrude wiring for depth, taper, and offset.

### Phase 8 Overview
#### Fold Hack 4

##### Phase Notes

This phase is evidenced by multiple direct changelog entries:
- `Row Ordering Metadata`
- `External Feature-Input Wiring`
- `Driver Virtual Output Wiring`
- `Driver ParamId Determinism Locks`
- `Driver Virtual Inputs`
- `Driver Input Auto-Replace`
- `Expand Extrude Taper And Offset Inputs`

This is the main contract-building wave that made driver and feature wiring feel like one real deterministic system instead of disconnected experiments.

##### Phase Summary

Current understanding:
- part rows gained stable deterministic ordering metadata and reorder controls
- feature-stack wiring moved beyond embedded literals through virtual feature inputs
- driver rows gained both virtual outputs and virtual inputs with strict parser/endpoint rules
- occupied driver-input targets gained deterministic auto-replace behavior
- extrude feature wiring expanded from depth-only to depth, taper, and offset while staying deterministic across validation, evaluation, compile, and UI paths

##### Files Changed

- `src/app/spaghetti/features/featureVirtualPorts.ts`
- `src/app/spaghetti/features/featureVirtualPorts.test.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/features/driverVirtualPorts.ts` (new)
- `src/app/spaghetti/features/driverVirtualPorts.test.ts` (new)
- `src/app/spaghetti/parts/partRowOrder.ts` (new)
- `src/app/spaghetti/parts/partRowOrder.test.ts` (new)
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/canvas/types.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/canvas/driverInputAutoReplace.ts` (new)
- `src/app/spaghetti/canvas/driverInputAutoReplace.test.ts` (new)
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/theme/v15Theme.css`

### Phase 8 CheckList

- [x] add deterministic `partRowOrder` metadata, repair logic, and per-section row reordering for Drivers / Inputs / Outputs
- [x] lock stable row IDs (`drv:*`, `in:*`, `out:*`) and deterministic row-order persistence/minimization rules
- [x] add virtual feature input contracts for extrude feature params and keep resolver behavior shared across validation, evaluation, compile, and UI
- [x] support external wires driving extrude depth with deterministic compile-time override behavior
- [L] add virtual driver output ports with deterministic `drv:<paramId>` IDs and row-level output pin rendering
- [L] harden `drv:<paramId>` parsing with the v1 charset lock
- [L] add virtual driver input ports `drv:in:<paramId>` with whole-port-only path rules and driven/unresolved row behavior
- [x] add deterministic auto-replace behavior for occupied `drv:in:*` targets
- [x] expand extrude virtual inputs from `depth` only to `depth`, `taper`, and `offset`
- [x] preserve generic `NodeView` / shared resolver architecture throughout the whole expansion wave

## [x] - DR - Phase 9 - `Canonical Driver ID Contract`

Human Summary: This locked canonical driver virtual port IDs around `out:drv:<paramId>` and `in:drv:<paramId>`, while keeping dual-read compatibility for the earlier aliases so old graphs would still work.

### Phase 9 Overview
#### Fold Hack 4

##### Phase Notes

This is the cleanup and contract-lock phase after the broader Phase 8 driver-wiring expansion.

It narrows the earlier driver ID story into one canonical contract without breaking legacy reads.

##### Phase Summary

Current understanding:
- canonical driver IDs were locked to `out:drv:<paramId>` and `in:drv:<paramId>`
- legacy aliases remained readable for backwards compatibility
- validator, canvas, and auto-replace logic all moved toward one canonical endpoint identity model

##### Files Changed

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

### Phase 9 CheckList

- [x] switch canonical driver IDs to `out:drv:<paramId>` and `in:drv:<paramId>`
- [L] preserve dual-read compatibility for legacy `drv:in:*` and `drv:*` aliases
- [L] canonicalize driver-input auto-replace endpoint keys across alias forms
- [x] update canvas driver-row mapping to prefer canonical ports when aliases coexist
- [x] expand tests for alias compatibility, unit mismatch rejection, and mixed-alias max-connection behavior

## [x] - DR - Phase 10 - `Driven Numeric Driver Offset Mode`

Human Summary: This added driven numeric offset mode so a driven numeric parameter can expose the incoming driven value, a local editable offset, and the final effective value without mutating the core driver contract.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This phase builds directly on the canonical driver identity work from Phase 9.

It turns driven numeric rows into richer control surfaces without pushing topology mutation into evaluation or compile layers.

##### Phase Summary

Current understanding:
- optional metadata was added for numeric driven-state tracking and per-param offsets
- store normalization now persists driven markers and initializes numeric offsets deterministically
- numeric driver outputs can now emit `base + offset` when driven
- UI rows for numeric drivers gained a clear driven value / editable offset / effective value model

##### Files Changed

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

### Phase 10 CheckList

- [x] add `driverOffsetByParamId` and `driverDrivenByParamId` metadata for driven numeric params
- [x] extend store normalization to initialize, persist, and clear driven markers deterministically
- [x] make numeric `out:drv:*` emit `base + offset` when driven
- [x] extend driver VM data with offset-mode, driven, and effective-value fields
- [x] update numeric driver row UI to show driven value, editable offset, and effective value
- [x] preserve unresolved driven behavior without silently falling back to manual values

## [x] - DR - Phase 11 - `Driver Diagnostics And Invalid Wiring Visualization`

Human Summary: This expanded selector-driven diagnostics so driver edges and OutputPreview slots can surface deterministic invalid/unresolved state, making broken wiring visible in both the canvas and the parts list.

### Phase 11 Overview
#### Fold Hack 4

##### Phase Notes

This phase sits on top of the newer selector layer and uses that derived state to make driver and slot diagnostics much more visible.

It is partly `DR` and partly cross-surface UI parity work, but the core ownership is still driver/slot validity feedback.

##### Phase Summary

Current understanding:
- diagnostics VM grew stable edge-level and slot-level status state
- wire rendering started showing invalid/unresolved edges visually
- driver rows and OutputPreview slots gained warning indicators driven from the same deterministic selector layer
- unresolved preview slots stopped rendering into the preview mesh while still remaining visible in the parts list

##### Files Changed

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

### Phase 11 CheckList

- [x] extend diagnostics VM with stable edge-status and slot-status state
- [x] define deterministic reason precedence for invalid/unresolved wiring diagnostics
- [x] render non-`ok` edges as dashed in the canvas
- [x] surface warning indicators on driver rows and OutputPreview slots
- [x] keep unresolved slots visible in Parts List while excluding them from preview mesh rendering
- [x] preserve selector-driven deterministic diagnostics ordering and grouping behavior

## [x] - DR - Phase 12 - `Param And Input Node Foundation`

Human Summary: This introduced real authored param nodes for number, boolean, and vec2 values, replacing the old primitive-only authoring path with proper utility nodes and selector-owned compact rendering.

### Phase 12 Overview
#### Fold Hack 4

##### Phase Notes

This is the first clear direct foundation phase for the longer-term param-node and input-node roadmap.

It keeps old primitive nodes readable/evaluable while moving new authoring toward explicit param utility nodes.

##### Phase Summary

Current understanding:
- new authored utility nodes were added for `Param/Number`, `Param/Boolean`, and `Param/Vec2`
- legacy primitive number/vec2 nodes were hidden from new authoring while staying compatible
- selector-owned compact helper-node rendering replaced older primitive output-port editing special cases
- value nodes now edit through command-routed param changes instead of older ad hoc UI paths

##### Files Changed

- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`
- `src/app/theme/v15Theme.css`

### Phase 12 CheckList

- [x] add authored utility nodes for `Param/Number`, `Param/Boolean`, and `Param/Vec2` with deterministic defaults and stable `value` outputs
- [L] hide legacy primitive number/vec2 nodes from new authoring while keeping them readable and evaluable
- [x] add selector-owned compact VM/rendering for authored utility values
- [x] route utility-node edits through `setNodeParams` graph commands
- [x] add compact helper-node styling and rendering for number/boolean/vec2 value nodes
- [x] expand deterministic tests for registry contracts, evaluation, selector output, contract parity, and node rendering

## [ ] - DR - Phase 13 - `Canonical Driver Node Contract`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 13 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should formalize the canonical driver-node contract after the earlier driver identity and diagnostics work

### Phase 13 CheckList

- [ ] define the target driver-node contract
- [ ] connect it to the existing `DR` ladder once roadmap work reaches this phase

## [ ] - DR - Phase 14 - `Input And Parameter Node System Completion`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 14 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should complete the input-node and parameter-node system after the earlier foundation work

### Phase 14 CheckList

- [ ] define the target completion scope for the input-node and parameter-node system
- [ ] connect it to the existing `DR` ladder once roadmap work reaches this phase

## [ ] - DR - Phase 15 - `Pin To Input And Promoted Parameter System`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 15 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should unify pin-to-input behavior with promoted parameter workflows and cleaner user-facing value ownership

### Phase 15 CheckList

- [ ] define the target promoted-parameter and pin-to-input scope
- [ ] connect it to the existing `DR` ladder once roadmap work reaches this phase

## [ ] - DR - Phase 16 - `User Facing Versus Internal Driver Metadata`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 16 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should separate user-facing driver meaning from internal metadata and routing-only details

### Phase 16 CheckList

- [ ] define the target metadata split between user-facing and internal driver concerns
- [ ] connect it to the existing `DR` ladder once roadmap work reaches this phase
