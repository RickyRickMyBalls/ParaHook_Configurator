# PT - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
3. 2026-03-08 00:00: Rebuilt `PT - Phase 1`, `2`, `5`, and `6` from `docs/CHANGELOG.md`, promoted `PT - Phase 1` and `2` to explicit reconstructed phases, and added detailed summaries, grouped checklists, and file-footprint sections for the currently evidenced `PT` family
2. 2026-03-08 00:00: Replaced the generic grouped placeholder with the canonical `PT` phase ladder from `docs/Phase-Plans/00_Phase-Setup.md` so this family file now reflects the actual required phase numbers
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `PT` family now has a ready home for later changelog/history reconstruction and future planning

##### Purpose

This file is the simple phase-family history document for the `PT` prefix.

Use this file for:
- the canonical `PT` phase sequence
- a simple explanation of what each `PT` phase did
- understanding how the part-system layer evolved over time
- seeing where major `PT` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `PT` Means

`PT` is the canonical part-system prefix.

It is used when the main work is about:
- part identity and part ownership
- part-template structure
- part container behavior
- part-specific geometry implementation
- the relationship between graph-owned parts and the produced build artifacts

##### Format And Depth

Use this file as the planning and checklist home for canonical `PT` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - PT - Phase 1 - `Independent Part Thinking` - Reconstructed

Human Summary: This reframed the restarted app around independently buildable parts, making parts visible, selectable, and eventually independently rebuildable instead of treating the product as one opaque output blob.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart history band.

It is the first real `PT` ownership shift in the modern `/20/` restart story.

##### Phase Summary

Current understanding:
- the app was reframed around independently buildable parts instead of one monolithic product result
- parts became focusable, visible, and eventually independently rebuildable
- the UI direction started organizing around real product pieces and part-focused controls

##### Files Changed

- `src/shared/partsTypes.ts`
- `src/shared/productSchema.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`

### Phase 1 CheckList

- [x] reframe the restarted app around independently buildable parts
- [x] treat parts as focusable and visible product pieces
- [x] prepare the product for multiple future part instances instead of one monolithic output
- [x] tie part-list selection to part-focused controls so the UI can stay organized around real pieces

## [x] - PT - Phase 2 - `Param Ownership Direction` - Reconstructed

Human Summary: This established early part-owned param namespace direction around baseplate, toe, and heel instances, making per-part param identity the foundation for later routing and recompute work.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart history band.

It follows directly from the move into independently owned parts.

##### Phase Summary

Current understanding:
- early param ownership was defined around `bp_*`, `th1_*`, and `hk1_*`
- the same ownership pattern was extended to future part instances
- param identity was tied to part-instance thinking instead of flat global buckets

##### Files Changed

- `src/app/store/useAppStore.ts`
- `src/shared/partRouting.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

### Phase 2 CheckList

- [x] define early param namespace direction around `bp_*`, `th1_*`, and `hk1_*`
- [x] extend that ownership pattern to future part instances
- [x] frame param ownership as the basis for scalable per-part recompute
- [x] keep param identity tied to part-owned routing instead of flat global buckets

## [x] - PT - Phase 5 - `Part Template Population`

Human Summary: This populated the first real part-template surface by locking the `Drivers / Inputs / Feature Stack / Outputs` taxonomy, cleaning Baseplate outputs, and bringing ToeHook and HeelKick to deterministic template-driven node definitions.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This is the first large concrete `PT` implementation cluster in the shipped changelog.

The visible work spans taxonomy cleanup, template population, compiler compatibility, and shared numeric control refactors.

##### Phase Summary

Current understanding:
- part-template rows were normalized to the canonical `Drivers -> Inputs -> Feature Stack -> Outputs` taxonomy
- Baseplate outputs were reduced to the intended public set
- ToeHook and HeelKick were both populated as real template-driven part nodes with deterministic defaults and compatibility handling
- shared `NumberField` and `Vec2Field` controls were introduced so driver and endpoint rows used one consistent editing surface

##### Files Changed

- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/driverVm.test.ts`
- `src/app/spaghetti/canvas/fields/NumberField.tsx` (new)
- `src/app/spaghetti/canvas/fields/Vec2Field.tsx` (new)
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/dev/sampleGraph.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`

### Phase 5 CheckList

- [x] refactor part-template taxonomy from `Input Drivers / Output Drivers` into:
  - `Drivers`
  - `Inputs`
  - `Outputs`
  - `Other Outputs`
- [x] lock part-template render order to `Drivers -> Inputs -> Feature Stack -> Outputs`
- [x] clean `Part/Baseplate` outputs down to the intended public set while keeping reserved rows and evaluator validation green
- [x] populate `Part/ToeHook` template metadata with deterministic default drivers, inputs, outputs, and default params
- [x] add ToeHook compatibility alias metadata and canonicalize legacy `anchorSpline2` input targets to `anchorSpline`
- [x] populate `Part/HeelKick` template metadata to ToeHook-parity shape with heel-specific deterministic defaults
- [x] add HeelKick compatibility alias handling and canonical payload mapping for `anchorSpline`
- [x] add shared `NumberField` / `Vec2Field` controls for both driver rows and endpoint rows
- [x] move Baseplate Width/Length primary editing into Drivers while keeping legacy connected-only migration rows visible
- [x] keep `NodeView` generic and metadata-driven without node-type branching

## [x] - PT - Phase 6 - `Part Container Contract`

Human Summary: This established the explicit part container contract through `partSlots`, schema parsing, normalization, and deterministic validation so part nodes could persist their structural sections without hard-failing old graphs.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This phase is evidenced by two shipped changelog entries:
- `PT - Phase 6 - Part Container Contract`
- `PT - Phase 6 - Part Container Contract - Closure Hardening`

##### Phase Summary

Current understanding:
- additive `partSlots` metadata was introduced as the container contract for part nodes
- load canonicalization, validation warnings, and render ordering were locked around that contract
- closure hardening then relaxed parse-boundary failure while preserving deterministic downstream repair and warnings

##### Files Changed

- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiSchema.test.ts`
- `src/app/spaghetti/parts/partSlots.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

### Phase 6 CheckList

- [x] add additive `partSlots` structural metadata to `SpaghettiNode` with the phase-contract keys:
  - `drivers`
  - `inputs`
  - `featureStack`
  - `outputs`
- [x] add strict graph-schema parsing support for optional `partSlots`
- [x] add deterministic part-slots utilities for defaulting, validation, and normalization
- [x] integrate deterministic `partSlots` normalization into graph load canonicalization
- [x] emit deterministic validation warnings for missing or invalid `partSlots` states
- [x] lock part template section rendering to `Drivers -> Inputs -> Feature Stack -> Outputs`
- [x] update parse handling so malformed legacy `partSlots` payloads do not hard-fail graph parsing
- [x] preserve malformed payloads at the schema boundary for deterministic downstream repair
- [x] keep validation as the single warning source for `partSlots` diagnostics
- [x] add deterministic schema/store/validator/render-order coverage for the container contract and closure hardening

## [ ] - PT - Phase 7 - `Baseplate Hardening Presets And Metadata`

Human Summary: This future canonical `PT` phase number is seeded from `00_Phase-Setup.md` so the family file already reflects the planned part-system ladder.

### Phase 7 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future planned `PT` phase from the canonical setup ladder.

##### Phase Summary

Current understanding:
- this future `PT` phase exists in the canonical ladder
- detailed planning and execution content still need to be added later

### Phase 7 CheckList

- [ ] add future planning detail when this phase becomes active

## [ ] - PT - Phase 8 - `ToeHook Hardening And Production Controls`

Human Summary: This future canonical `PT` phase number is seeded from `00_Phase-Setup.md` so the family file already reflects the planned part-system ladder.

### Phase 8 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future planned `PT` phase from the canonical setup ladder.

##### Phase Summary

Current understanding:
- this future `PT` phase exists in the canonical ladder
- detailed planning and execution content still need to be added later

### Phase 8 CheckList

- [ ] add future planning detail when this phase becomes active

## [ ] - PT - Phase 9 - `HeelKick Hardening And Production Controls`

Human Summary: This future canonical `PT` phase number is seeded from `00_Phase-Setup.md` so the family file already reflects the planned part-system ladder.

### Phase 9 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future planned `PT` phase from the canonical setup ladder.

##### Phase Summary

Current understanding:
- this future `PT` phase exists in the canonical ladder
- detailed planning and execution content still need to be added later

### Phase 9 CheckList

- [ ] add future planning detail when this phase becomes active

## [ ] - PT - Phase 10 - `Baseplate Geometry v0`

Human Summary: This future canonical `PT` phase number is seeded from `00_Phase-Setup.md` so the family file already reflects the planned part-system ladder.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future planned `PT` phase from the canonical setup ladder.

##### Phase Summary

Current understanding:
- this future `PT` phase exists in the canonical ladder
- detailed planning and execution content still need to be added later

### Phase 10 CheckList

- [ ] add future planning detail when this phase becomes active
