# Export Index

## Doc Header

### Doc History
11. 2026-05-18 08:14:11: Added `Export-2 - Cleanup And Feature Enrichment` as the next open Export family phase after `Export-1` closed, keeping it as a lightweight user-defined phase-by-phase cleanup and enrichment runway rather than pre-filling speculative worker-writer or persistence-schema work.
10. 2026-05-18 08:08:06: Marked `Export-1 / Phase 4 - Project File, Spaghetti File, And Later Export Neighbors` shipped and closed the first Export surface family after the Export surface gained read-only related outputs owner labels for geometry export, graph file, project file, and spaghetti file, preserving Export's `STEP`-only executable behavior and deferring `Export-2+` until real worker writer or result-management work is ready.
9. 2026-05-18 08:04:34: Prepped `Export-1 / Phase 4 - Project File, Spaghetti File, And Later Export Neighbors` for implementation inside the active `Export-1` doc, keeping the closeout task scoped to visible geometry-export versus graph/project/spaghetti persistence owner labels, no schema migration, no duplicated Browser graph-save handler, and an explicit `Export-1` closeout or `Export-2+` handoff decision.
8. 2026-05-18 08:00:58: Marked `Export-1 / Phase 3 - Format-Specific Settings And Detail Controls` shipped after the Export surface gained selected-format settings groups, B-rep-honest `STEP` settings, deferred non-STEP mesh/scene/package setting readouts, focused settings tests, and production build proof.
7. 2026-05-18 07:55:26: Prepped `Export-1 / Phase 3 - Format-Specific Settings And Detail Controls` for implementation inside the active `Export-1` doc, keeping the next task scoped to format-specific settings presentation, minimal B-rep-honest `STEP` settings, and read-only/deferred non-STEP setting groups without adding mesh/scene writers.
6. 2026-05-18 07:50:16: Marked `Export-1 / Phase 2 - Target Collection And Selection Integration` shipped after the Export surface gained app-owned target review from workspace selection, removable target rows that do not mutate Browser/project truth, graph-document-only `STEP` execution, non-graph review-only gating, focused tests, and production build proof.
5. 2026-05-18 07:39:13: Prepped `Export-1 / Phase 2 - Target Collection And Selection Integration` for implementation inside the active `Export-1` doc, keeping the next task focused on app-owned export target review seeded from workspace selection while preserving graph-document-only STEP execution.
4. 2026-05-18 07:22:34: Cleaned up this index after the first Export surface shipped, reformatting it as a compact family scan surface and folding the near-term target collection, format settings, and persistence-neighbor work back into `Export-1` as internal implementation phases instead of separate sibling family phases.
3. 2026-05-18 07:17:59: Marked `Export-1 / Phase 1 - Workspace Surface, STEP Action, And Honest Format Shell` shipped after the repo added the optional `export` workspace surface, first `ExportSurface`, `EXP` viewport alias, `STEP`-only executable format shell, and authoritative graph STEP action wiring, then moved the next family handoff to `Export-2 - Target Collection And Selection Integration`.
2. 2026-05-18 07:07:32: Re-prepped `Export-1 / Phase 1 - Workspace Surface, STEP Action, And Honest Format Shell` after `Model-Viewport-1.3` shipped the authoritative STEP handoff, tightening the first Export implementation boundary around the current workspace-surface registry, `STEP` as the only active format, unavailable non-STEP format honesty, and no viewer-mesh export.
1. 2026-03-26 20:03: Created this folderized `Export` architecture family, added the first `Export-1` future phase doc, and defined the export-toolbar direction for selecting authored 3D objects/references, choosing format/detail settings, and leaving room for later project-file and spaghetti-file save/export behavior.

### Purpose

This file is the umbrella planning index for the `Export` workspace family.

Use it to answer:
- what the visible `Export` surface owns
- where active Export implementation work lives
- how Export stays separate from worker file writers and persistence systems
- what should happen next after the first visible surface

### Scope

This doc covers:
- user-facing Export workspace direction
- current family-phase routing
- target, format, settings, and action ownership boundaries
- follow-on handoff after the first Export family phase

This doc does not cover:
- final worker-side writers for every export format
- final project-file schema
- final spaghetti-document persistence rules
- B-rep viewer/runtime implementation

### Family Structure

- `Export-Index.md`
  - umbrella scan surface and current routing
- `Future/`
  - active and future Export family phase docs
- `Shipped/`
  - completed Export records when a whole family phase is archived

Current roadmap home:
- canonical phase family:
  - `EX`
- active architecture family phase:
  - `Export-2 - Cleanup And Feature Enrichment`

## Doc Body

### Short Version

ParaHook needs one real `Export` workspace surface.

That surface should let the user:
- review what will be exported
- choose an output format
- see honest format readiness
- trigger export explicitly
- understand whether the export comes from authoritative geometry or is not available yet

The first shipped cut is intentionally narrow:
- `STEP` is active
- `STL`, `OBJ`, and `GLB` are visible but unavailable
- `STEP` routes through authoritative worker-owned B-rep export
- no export path reads Three.js viewer meshes

### Current Status

`Export-1` is shipped and closed as the first multi-phase Export surface family doc.

Shipped inside `Export-1`:
- Phase 1:
  - `Workspace Surface, STEP Action, And Honest Format Shell`
- Phase 2:
  - `Target Collection And Selection Integration`
- Phase 3:
  - `Format-Specific Settings And Detail Controls`
- Phase 4:
  - `Project File, Spaghetti File, And Later Export Neighbors`

Open inside `Export-1`:
- none

Current next task:
- define and prep `Export-2 / Phase 1` when the first cleanup or feature-enrichment target is chosen.

### Cross-Doc Boundaries

`Export` owns:
- visible export workspace surface
- target collection/review UI
- format choice UI
- user-facing export settings
- export action entrypoints and result/status reads

`Export` does not own:
- worker-side deterministic file writer internals
- project-file schema
- graph/spaghetti save/load schema
- viewer geometry state
- B-rep runtime generation

Neighbor ownership:
- `Worker`
  - actual deterministic export execution
  - B-rep/mesh/scene writer implementations
- `Model-Viewport`
  - viewport presentation and final/draft display honesty
  - not export geometry ownership
- `Browser`
  - authored graph/content selection truth that Export can consume
- `Workspace-Modes`
  - surface placement, split, floating, and popout behavior
- project and graph persistence families
  - durable save/load contracts

Hard rule:
- clean export outputs must derive from explicit authoritative geometry/export contracts, not from Three.js viewer meshes or camera state.

### Active Family Phase

#### `Export-2 - Cleanup And Feature Enrichment`

Doc:
- `Future/Export-2 - Cleanup And Feature Enrichment.md`

Goal:
- provide a clean open runway for Export cleanup and feature enrichment after the first visible Export surface shipped.

Current rule:
- the user will define `Export-2` phase by phase.
- do not implement Phase 1 until its concrete cleanup or enrichment target is chosen and prepped.
- keep larger worker-writer, persistence-schema, or B-rep-viewer widening in separate future family phases when needed.

#### `Export-1 - Toolbar Shell And Format Surface`

Doc:
- `Future/Export_Phase Export-1 - Toolbar Shell And Format Surface.md`

Goal:
- build the first real Export workspace surface and widen it just enough to support honest target review, format readiness, settings, and save/export-neighbor placement.

Internal implementation phases:

1. `[x] Workspace Surface, STEP Action, And Honest Format Shell`
   - shipped the optional `export` workspace surface
   - shipped the first `ExportSurface`
   - made `STEP` executable through the authoritative B-rep handoff
   - kept `STL`, `OBJ`, and `GLB` visible but unavailable

2. `[x] Target Collection And Selection Integration`
   - shipped an app-owned export target list seeded from workspace selection
   - lets the user review/remove targets without mutating Browser/project truth
   - keeps graph-document targets executable through STEP
   - keeps non-graph targets visible but not executable until a later target-to-export contract exists

3. `[x] Format-Specific Settings And Detail Controls`
   - shipped selected-format settings copy/readouts
   - kept `STEP` minimal and B-rep honest
   - kept unavailable mesh/scene/package settings deferred without executable controls
   - kept mesh and scene settings visibly separate from CAD/STEP settings

4. `[x] Project File, Spaghetti File, And Later Export Neighbors`
   - shipped read-only related output neighbors for geometry export, graph file, project file, and spaghetti file
   - kept project persistence and graph persistence ownership separate
   - avoided turning Export into the owner of every save/load contract
   - closed `Export-1`

### Later Family Phases

`Export-1` is closed. `Export-2` is now the active cleanup and feature-enrichment runway.

Likely later family phases:
- `Export-3 - Multi-Format Worker Writers And Result Management`
  - when STL/OBJ/GLB execution is ready to become real
- `Export-4 - Export Presets, History, And Batch Jobs`
  - when the app needs durable export recipes, repeat exports, or job history
- `Export-5 - Manufacturing Metadata And Advanced Output Packages`
  - when output packaging grows beyond simple file export

### What Must Stay True

- The Export surface is user-facing workflow, not the source of geometry truth.
- `STEP` must stay downstream from authoritative B-rep worker geometry.
- Mesh formats should not quietly fake correctness by exporting the viewport.
- Target identity should come from graph/project/content ownership, not camera state.
- Save/export-adjacent outputs may appear here, but their durable schemas remain with their owning persistence families.

### Summary

The cleaned-up routing is:
- keep `Export-1` as the shipped first surface-and-format family
- use `Export-2` as the open cleanup and feature-enrichment lane
- treat geometry export, graph file, project file, and spaghetti file as distinct owner-labeled neighbors
- delay worker-writer, persistence-schema, or output-package family phases until those systems are ready for their own explicit plans
