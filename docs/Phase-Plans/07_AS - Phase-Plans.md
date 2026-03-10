# AS - Phase-Plans
## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
2. 2026-03-08 00:00: Rebuilt the completed `AS` phases from `docs/CHANGELOG.md`, keeping `AS - Phase 3` as an inferred gap phase and adding real summaries, grouped checklists, and file-footprint sections for `AS - Phase 1`, `2`, `3`, and `4`
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `AS` family now has a proper home for later changelog reconstruction, checklist buildout, and future preview-assembly planning

##### Purpose

This file is the simple phase-family history document for the `AS` prefix.

Use this file for:
- the canonical `AS` phase sequence
- a simple explanation of what each `AS` phase did
- understanding how preview assembly and part-output identity evolved over time
- seeing where major `AS` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `AS` Means

`AS` is the canonical preview-assembly prefix.

It is used when the main work is about:
- parts list behavior
- part ordering
- artifact identity
- assembled-output direction
- preview assembly mapping between produced parts and visible output

##### Format And Depth

Use this file as the planning and checklist home for canonical `AS` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - AS - Phase 1 - `Parts List Replacement` - Reconstructed

Human Summary: This removed the history-scrubber direction from the restart baseline and replaced it with a parts-list model, shifting the product toward part-driven inspection instead of time-travel UI.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart band.

It is the first clear `AS` move away from the old scrubber/history mindset.

##### Phase Summary

Current understanding:
- the restart baseline dropped the history-scrubber direction
- a parts-list model became the main inspection surface
- selection moved toward part-focused controls instead of scrubbing through time
- future history support was pushed out of the base product direction

##### Files Changed

- `src/app/panels/PartsListPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`

### Phase 1 CheckList

- [x] remove the history-scrubber direction from the restart baseline
- [x] replace it with a parts-list inspection model
- [x] make part selection focus relevant controls instead of time-travel UI
- [x] treat future history support as optional later layering rather than the base product surface

## [x] - AS - Phase 2 - `Deterministic Part Ordering` - Reconstructed

Human Summary: This locked deterministic visible part ordering, making part order a stable product rule tied to pipeline/build order rather than ad hoc UI sorting.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart band.

It follows directly from the shift into a parts-list-first product surface.

##### Phase Summary

Current understanding:
- base parts were locked first as the default visible ordering
- future toe instances were inserted after the base parts in deterministic sequence
- visible order became a stable product rule rather than arbitrary UI sorting
- later parts were tied to declared build/pipeline order

##### Files Changed

- `src/shared/partsTypes.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Phase 2 CheckList

- [x] lock base parts first as the default visible ordering
- [x] insert future toe instances after the base parts in deterministic sequence
- [x] treat visible part order as a stable product rule
- [x] lock later parts to declared pipeline/build order instead of ad hoc UI order

## [?] - AS - Phase 3 - `First Parts / Artifact Baseline`

Human Summary: This is an inferred bridge phase that likely established the first stable part/artifact identity layer, turning the restart from one preview mesh into named output parts.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is an inferred gap phase from the reconstructed history band rather than a fully evidenced completed log entry.

##### Phase Summary

Current understanding:
- this likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work
- this likely turned the product from one preview mesh into named output parts
- this likely gave later part-order and assembled-output work a concrete baseline

##### Files Changed

- exact file set unknown
- likely touched `src/shared/partsTypes.ts`
- likely touched `src/shared/buildTypes.ts`
- likely touched `src/worker/pipeline/artifactEmitter.ts`

### Phase 3 CheckList

- [?] define the first stable part/artifact identity layer between restart and later assembled-output work
- [?] turn the product from one preview mesh into named output parts
- [?] provide the likely baseline for later part-order and assembled-direction work

## [x] - AS - Phase 4 - `Canonical Part Identity And Assembled Direction` - Reconstructed

Human Summary: This clarified part identity as a canonical concept and strengthened the distinction between part outputs and the assembled output, moving the product away from a looser single-preview-blob model.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It sits directly after the earlier inferred part/artifact baseline.

##### Phase Summary

Current understanding:
- part identity was clarified as a canonical concept instead of a loose preview blob
- the distinction between part outputs and the assembled output was strengthened
- the product moved away from looser `final` wording toward assembled identity

##### Files Changed

- `src/shared/partsTypes.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Phase 4 CheckList

- [x] clarify part identity as a canonical product concept
- [x] strengthen the distinction between part outputs and the assembled output
- [x] move the product away from loose `final` wording toward assembled identity

## [ ] - AS - Phase 5 - `OutputPreview Render Path Stabilization`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `AS` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should stabilize the OutputPreview render path after the earlier parts/artifact assembly phases

### Phase 5 CheckList

- [ ] define the target OutputPreview stabilization scope

## [ ] - AS - Phase 6 - `Graph Aware Parts And Preview Inspection`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `AS` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should make preview assembly and inspection more graph-aware

### Phase 6 CheckList

- [ ] define the target graph-aware preview inspection scope
