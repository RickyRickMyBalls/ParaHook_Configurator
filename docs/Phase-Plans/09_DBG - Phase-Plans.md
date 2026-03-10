# DBG - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
2. 2026-03-08 00:00: Rebuilt the completed `DBG` phases from `docs/CHANGELOG.md`, adding a real summary, grouped checklist, and file-footprint section for `DBG - Phase 1` while leaving later debug-inspection phases as future placeholders
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `DBG` family now has a proper home for later changelog reconstruction, checklist buildout, and future inspection-layer planning

##### Purpose

This file is the simple phase-family history document for the `DBG` prefix.

Use this file for:
- the canonical `DBG` phase sequence
- a simple explanation of what each `DBG` phase did
- understanding how inspection and debug surfaces evolved over time
- seeing where major `DBG` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `DBG` Means

`DBG` is the canonical inspection-layer prefix.

It is used when the main work is about:
- debug inspector surfaces
- inspection-only UI
- deterministic introspection of graph/build/preview state
- developer-facing visibility into compile, preview, and wiring state

##### Format And Depth

Use this file as the planning and checklist home for canonical `DBG` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - DBG - Phase 1 - `Debug Inspector Foundation`

Human Summary: This added the first read-only Debug Inspector drawer for the spaghetti pipeline, giving the app a deterministic inspection surface for compile status, artifacts, preview mapping, and viewer-bound renderables without mutating graph behavior.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is the first direct shipped `DBG` phase in the modern changelog.

It is the foundation for later deeper inspection surfaces.

##### Phase Summary

Current understanding:
- a read-only `Debug Inspector` drawer was added to the Spaghetti panel
- selector-owned debug aggregation was introduced for compile status, artifacts, preview mapping, and viewer inputs
- the inspector stayed deterministic, stable, and non-mutating

##### Files Changed

- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`

### Phase 1 CheckList

- [x] add a read-only `Debug Inspector` drawer to the Spaghetti panel
- [x] introduce a selector-owned debug aggregation layer for compile status, artifacts, preview mapping, and viewer inputs
- [x] keep the inspector deterministic with stable slot ordering, preview ordering, and viewer-input ordering
- [x] preserve non-mutating inspection behavior so showing or hiding the drawer does not change compile, graph, preview, worker, or viewer logic

## [ ] - DBG - Phase 2 - `Graph And Node State Inspector`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DBG` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should deepen graph and node state inspection beyond the first debug drawer

### Phase 2 CheckList

- [ ] define the target graph/node-state inspection scope

## [ ] - DBG - Phase 3 - `Feature Stack Inspector`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DBG` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should expose deeper feature-stack inspection surfaces

### Phase 3 CheckList

- [ ] define the target feature-stack inspection scope

## [ ] - DBG - Phase 4 - `Resolver And Validation Inspector`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DBG` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should expose resolver and validation internals more directly

### Phase 4 CheckList

- [ ] define the target resolver/validation inspection scope

## [ ] - DBG - Phase 5 - `Graph Wiring Inspector`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `DBG` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should expose deeper graph wiring inspection and edge-state tools

### Phase 5 CheckList

- [ ] define the target graph-wiring inspection scope
