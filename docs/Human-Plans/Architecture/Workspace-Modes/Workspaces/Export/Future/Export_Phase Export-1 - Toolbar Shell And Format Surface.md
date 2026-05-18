# [x] `Export-1` - `Toolbar Shell And Format Surface`

## Doc Header

### Doc History
10. 2026-05-18 08:08:06: Marked `Export-1 / Phase 4 - Project File, Spaghetti File, And Later Export Neighbors` shipped after adding the Export surface's read-only related outputs owner map for geometry export, graph file, project file, and spaghetti file neighbors, keeping `Export STEP` as the only executable Export action, preserving graph/project/spaghetti persistence ownership and schemas, adding focused neighbor tests, passing production build verification, and closing `Export-1`.
9. 2026-05-18 08:04:34: Prepped `Export-1 / Phase 4 - Project File, Spaghetti File, And Later Export Neighbors` for implementation by grounding the closeout cut in the live Browser `Export STEP` versus `Save Graph File` split, graph-document persistence owner, current `ProjectFile` store/schema owner, and the rule that Export may present save/export neighbors as clearly labeled owner handoffs without taking over durable project or graph persistence schemas.
8. 2026-05-18 08:00:58: Marked `Export-1 / Phase 3 - Format-Specific Settings And Detail Controls` shipped after replacing the generic Export settings readout with format-specific `STEP`, `STL`, `OBJ`, and `GLB` settings groups, keeping `STEP` B-rep honest, showing unavailable mesh/scene/package formats as deferred, adding focused settings visibility tests, and passing production build verification.
7. 2026-05-18 07:55:26: Prepped `Export-1 / Phase 3 - Format-Specific Settings And Detail Controls` for implementation by grounding the settings cut in the live `ExportSurface` generic readout, current `STEP`-only executable format list, non-graph target review-only behavior, and the rule that unavailable mesh/scene formats may show read-only deferred setting groups but must not expose fake working controls or route export behavior.
6. 2026-05-18 07:50:16: Marked `Export-1 / Phase 2 - Target Collection And Selection Integration` shipped after adding app-owned export target state, selection-seeded target replacement, removable target review rows, graph-document-only `STEP` execution, non-graph target review-only gating, focused store/surface coverage, and production build proof.
5. 2026-05-18 07:39:13: Prepped `Export-1 / Phase 2 - Target Collection And Selection Integration` for implementation by grounding the target-list cut in the live `WorkspaceSelectedTarget` union, `workspaceSelection.explicitSelectedTargets`, Browser selection commands, the current `ExportSurface` active-graph fallback, and the rule that only graph-document STEP targets should execute until broader target-to-export contracts exist.
4. 2026-05-18 07:22:34: Re-opened the top-level `Export-1` family phase as an active multi-phase doc after Phase 1 shipped, folding the near-term target collection, format settings, and project/spaghetti export-neighbor work into internal Phases 2 through 4 so the Export family stays cleaner before any separate `Export-2+` docs are created.
3. 2026-05-18 07:17:59: Marked `Export-1 / Phase 1 - Workspace Surface, STEP Action, And Honest Format Shell` shipped after the repo registered `export` as an optional persisted workspace surface, added the first `ExportSurface`, rendered `STEP`, `STL`, `OBJ`, and `GLB` with only `STEP` executable, routed `Export STEP` through the existing authoritative graph export handoff, added focused surface/catalog/type-choice tests, and passed production build verification.
2. 2026-05-18 07:07:32: Prepped `Export-1 / Phase 1 - Workspace Surface, STEP Action, And Honest Format Shell` for implementation after `Model-Viewport-1.3` closed the worker-owned authoritative STEP handoff, grounding the first Export cut in the current workspace-surface registry, app export status store, Browser graph STEP action, and the no-viewer-mesh export rule.
1. 2026-03-26 20:03: Created this first standalone `Export` phase doc to define the initial visible export surface as a shared-toolbar-based tool with first format choices, first section layout, and one explicit export action entry path.

### Purpose

This family phase defines the first honest visible `Export` surface for ParaHook and keeps the near-term target, format, settings, and save/export-neighbor work together until the surface is mature enough to split into later `Export-2+` family phases.

Use it to answer:
- what the first export tool should look like
- how it should enter the current workspace surface system
- which export formats should be visible first
- which format is actually executable in phase 1
- what should count as done for the first Export UI cut

### Scope

This doc covers:
- the first `Export` workspace surface registration
- a visible export body with targets, format, settings, and result/status regions
- the first active `STEP` action wired to the existing authoritative export handoff
- honest unavailable states for formats that do not have worker writers yet
- focused verification for surface registration and the STEP action path

This doc does not cover:
- worker-side STL, OBJ, or GLB writers
- broad multi-target collection
- project-file or spaghetti-file save/export ownership
- mesh-derived export from Three.js viewport state
- a separate B-rep viewer or kernel surface

## Doc Body

### Goal

Create the first real `Export` workspace surface instead of leaving export as only a Browser row action or worker capability.

The surface should let the user see an export job shape, choose from the first visible format family, and run the currently honest `STEP` export path when a graph has authoritative B-rep export input ready.

### Current Code Read

Useful current seams:
- `src/app/workspace/workspaceShellTypes.ts`
  - `WorkspaceSurfaceKind` does not yet include `export`.
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - optional surfaces are registered by kind, render family, support flags, persistence, and coordination.
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - workspace surfaces render through `renderFamily` branches.
- `src/app/workspace/workspaceViewportTypeChoices.ts`
  - right-click viewport type choices derive from registered slotted surfaces and optional aliases.
- `src/app/store/useAppStore.ts`
  - already owns `requestGraphDocumentStepExport(...)`, `requestSpaghettiStepExport(...)`, and graph export status after `Model-Viewport 1.3 / Phase 11`.
- `src/app/bootstrapBuildWiring.ts`
  - already downloads worker-provided STEP bytes and logs export runtime status.
- `src/app/panels/selectBrowserTreeRows.ts`
  - Browser graph rows already expose `Export STEP` as a narrow handoff.

Important current gap:
- there is no dedicated `ExportSurface` workspace UI where the user can review target, format, readiness, action, and result status together.

### Ownership Boundary

`Export-1` owns:
- registering `export` as an optional workspace surface
- rendering the first visible Export surface
- showing the active graph export target read
- showing the format family with `STEP` active and non-STEP formats unavailable/deferred
- routing the surface's `Export STEP` action through the existing app-store export handoff
- reading graph export status without duplicating worker routing logic

`Export-1` does not own:
- new worker writers
- export geometry reconstruction
- final multi-target collection
- project or spaghetti persistence
- changing the Browser's existing `Export STEP` handoff except as needed to keep language consistent

### Hard Rule

The first Export surface must not export from:
- Three.js scene objects
- draft preview meshes
- final viewport meshes
- selected camera/viewer state

The active `STEP` action must route through the existing authoritative export path:

```text
ExportSurface
  -> useAppStore.requestGraphDocumentStepExport(...)
  -> prepareGraphDocumentExport(...)
  -> buildDispatcher.requestGraphExport(...)
  -> worker STEP writer from retained authoritative B-rep shape_set
```

### Surface Shape

The first surface should be a normal workspace surface, matching the current workspace registry pattern.

Recommended first implementation:
- add `export` to `WorkspaceSurfaceKind`
- add `export` to the workspace surface catalog as optional, persisted, slotted/split-capable
- use `renderFamily: 'export'`
- add an `ExportSurface` component under `src/app/workspace/`
- render it from `ViewportSurfaceRegistry`
- add `EXP` as a viewport type alias

Initial support flags should be conservative:
- `slotted: true`
- `floating: false`
- `popout: false`
- `split: true`

Reason:
- Settings and Properties already use this conservative optional-surface shape.
- Floating/popout can be enabled later once the surface has enough independent workflow polish.

### First Body Sections

The surface should have four clear sections.

#### Targets

First-pass target:
- the active graph document

The target read should show:
- graph label/id
- whether there is an authoritative export-ready result
- pending/blocked/exporting/success/failed state when known

If no active graph document exists:
- show an empty state
- keep export action disabled

#### Format

Visible first format list:
- `STEP`
- `STL`
- `OBJ`
- `GLB`

Phase 1 executable format:
- `STEP`

Non-executable formats should be visible but disabled/unavailable with clear copy such as:
- `Not wired yet`

This avoids pretending mesh or scene formats are already honest.

#### Settings

Phase 1 settings should stay minimal:
- filename/readiness text is acceptable if it is already available
- no fake universal detail slider
- no tessellation controls until a mesh-format phase actually owns them

#### Action / Result

The action area should include:
- one explicit `Export STEP` button
- disabled states for no graph, pending preparation, blocked preparation, or unsupported selected format
- success/failure status read from `graphDocumentExportStatusById`

The action should call:
- `requestGraphDocumentStepExport(activeGraphDocumentId)`

Fallback:
- if the active graph id is not available through the surface read, use the same active Spaghetti graph route as `requestSpaghettiStepExport()` only as a transitional bridge.

### Phase 1 Implementation Spec

1. Register `export` as a workspace surface.
   - Update `WorkspaceSurfaceKind`.
   - Update `WorkspaceSurfaceRenderFamily`.
   - Update `OptionalWorkspaceSurfaceKind`.
   - Add a catalog entry with default label `Export`.
   - Add focused catalog tests for parse, optional status, split support, persistence, and explicit slot instance id.

2. Add viewport type choice support.
   - Add `EXP` alias in `workspaceViewportTypeChoices.ts`.
   - Add or update focused type-choice coverage if existing tests assert aliases/labels.

3. Add `ExportSurface`.
   - Use the existing workspace surface visual language.
   - Keep the body dense and tool-like, not a marketing/landing page.
   - Include sections for `Targets`, `Format`, `Settings`, and `Action`.
   - Keep text concise and stateful.

4. Wire the active STEP action.
   - Read the active graph document identity from existing app/spaghetti store selectors.
   - Read graph export status from `useAppStore`.
   - Call `requestGraphDocumentStepExport(graphDocumentId)` for the active `STEP` export.
   - Do not call worker APIs directly from the component.

5. Render from the workspace registry.
   - Add an `export` render branch in `ViewportSurfaceRegistry`.
   - Add focused registry/surface tests proving the surface renders through a workspace slot.

6. Keep unavailable formats honest.
   - Render `STL`, `OBJ`, and `GLB` as visible unavailable options.
   - Do not route those formats to STEP.
   - Do not add fake worker requests for them.

7. Update tracking.
   - Update this phase doc as shipped if implemented.
   - Update `Export-Index.md`.
   - Add `docs/CHANGELOG.md` for the implementation.
   - Add `docs/Doc-Log.md` for docs changes.

### Verification Plan

Focused tests should cover:
- workspace catalog registration for `export`
- viewport type choice label/alias inclusion
- `ViewportSurfaceRegistry` renders `ExportSurface`
- `ExportSurface` shows the format list with only `STEP` executable
- clicking `Export STEP` calls `requestGraphDocumentStepExport(...)` with the active graph id
- no graph disables the export action
- unavailable formats do not trigger export

Build verification:
- `npm.cmd run build`

### Active Internal Phase Ladder

Keep these near-term cuts inside `Export-1`:

1. `[x] Workspace Surface, STEP Action, And Honest Format Shell`
   - shipped
   - first workspace surface, first format shell, and authoritative `STEP` action

2. `[x] Target Collection And Selection Integration`
   - shipped
   - app-owned export targets can be seeded from Browser/workspace selection truth
   - target review stays independent from camera/viewer-derived ownership

3. `[x] Format-Specific Settings And Detail Controls`
   - shipped
   - settings readouts now follow the selected format
   - unavailable mesh/scene/package formats show deferred settings without fake working controls

4. `[x] Project File, Spaghetti File, And Later Export Neighbors`
   - shipped
   - related outputs now distinguish geometry export, graph file, project file, and spaghetti file ownership without taking over persistence schemas

Separate `Export-2+` docs remain deferred until worker writers or later result-management work are ready.

## Wishlist Organization

### High Level Goals

- [x] `Export-HLG-1` - `Create a real visible Export workspace surface instead of hiding export behind a Browser row action.`
- [x] `Export-HLG-2` - `Keep true B-rep STEP export downstream from authoritative worker geometry, not Three.js viewer meshes.`
- [x] `Export-HLG-3` - `Show the export format family early while being honest about which formats are actually wired.`
- [x] `Export-HLG-4` - `Leave room for target collection, settings, and save/export neighbors without overloading Phase 1.`

### `Export-1 / Phase 1`

- [x] HLG: `Export-HLG-1`
- [x] HLG: `Export-HLG-2`
- [x] HLG: `Export-HLG-3`
- [x] CLG: register `export` as an optional workspace surface
- [x] CLG: render the first `ExportSurface`
- [x] CLG: route only `STEP` through the authoritative export handoff
- [x] CLG: show non-STEP formats as unavailable/future
- [x] CLG: prove the surface action and registration with focused tests

### `Export-1 / Phase 2`

- [x] HLG: `Export-HLG-1`
- [x] HLG: `Export-HLG-4`
- [x] CLG: read explicit Browser/workspace selection truth as export target candidates
- [x] CLG: show an editable target review list inside `ExportSurface`
- [x] CLG: preserve graph/project/content identity for each target
- [x] CLG: keep active graph STEP export working as the narrow fallback path

### `Export-1 / Phase 3`

- [x] HLG: `Export-HLG-3`
- [x] HLG: `Export-HLG-4`
- [x] CLG: introduce format-specific settings groups
- [x] CLG: keep STEP settings separate from mesh/scene settings
- [x] CLG: avoid fake universal tessellation or detail controls

### `Export-1 / Phase 4`

- [x] HLG: `Export-HLG-4`
- [x] CLG: place project-file and spaghetti-file save/export neighbors without owning their schemas
- [x] CLG: clarify which actions belong to Export versus project or graph persistence
- [x] CLG: define the handoff point for later `Export-2+` docs

## [x] `Export-1 / Phase 1` - `Workspace Surface, STEP Action, And Honest Format Shell`

### Phase 1 Summary

This phase creates the first user-visible Export workspace surface and wires its active `STEP` action through the authoritative B-rep export path that already exists after `Model-Viewport-1.3`.

It should make export feel like a real workspace tool without pretending that all later export formats, target collection, or settings are already solved.

### Phase 1 Implementation Spec

Implement the surface in the current workspace-surface model:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceViewportTypeChoices.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- new `src/app/workspace/ExportSurface.tsx`
- focused tests near each changed owner

The first active action is:
- `Export STEP`

The action must call:
- `useAppStore.getState().requestGraphDocumentStepExport(graphDocumentId)` through component/store wiring

Definition of done:
- shipped: `export` appears as a workspace surface choice
- shipped: the Export surface renders in a workspace slot
- shipped: `STEP` is the only enabled export format
- shipped: disabled/pending/blocked/exporting/success/failed states are visible enough for the first cut
- shipped: the action uses the authoritative export handoff
- shipped: no export path reads Three.js viewer geometry
- shipped: focused tests and build pass

### Shipped Implementation

1. Registered the Export workspace surface.
   - `WorkspaceSurfaceKind` now includes `export`.
   - `workspaceSurfaceCatalog.ts` registers `Export` as an optional persisted slotted/split-capable surface.
   - `workspaceViewportTypeChoices.ts` exposes the `EXP` compact alias.

2. Added the first visible Export surface.
   - `src/app/workspace/ExportSurface.tsx` renders `Targets`, `Format`, `Settings`, and `Action` sections.
   - The target section reads the active graph document and shows whether an authoritative B-rep result is already retained.

3. Kept format honesty.
   - `STEP`, `STL`, `OBJ`, and `GLB` are visible.
   - Only `STEP` is executable in this phase.
   - Non-STEP formats remain visible as unavailable/not wired yet.

4. Routed the active export action through authoritative B-rep export.
   - `Export STEP` calls `requestGraphDocumentStepExport(graphDocumentId)`.
   - The component does not call worker APIs directly.
   - The UI keeps viewer mesh export off and does not read Three.js scene state.

5. Added focused verification.
   - workspace catalog coverage proves `export` parsing, optional status, persistence, split support, conservative floating/popout support, and explicit slot id.
   - viewport type choice coverage proves the `EXP` alias.
   - registry coverage proves `ExportSurface` renders from `ViewportSurfaceRegistry`.
   - `ExportSurface` coverage proves the STEP action, no-graph disabled state, and unavailable-format non-routing.

6. Verified the build.
   - focused Export tests passed.
   - production build passed with the existing OCCT/browser externalization and chunk-size warnings.

## [x] `Export-1 / Phase 2` - `Target Collection And Selection Integration`

### Phase 2 Summary

This phase should make the Export surface review real export targets instead of only showing the active graph as a single implicit target.

The target list should come from explicit Browser/workspace selection truth and graph/project/content identity. It should not infer export targets from the current camera, hovered viewport meshes, or Three.js scene objects.

### Phase 2 Current Code Read

Useful current seams:
- `src/app/store/useAppStore.ts`
  - exports `WorkspaceSelectedTarget`
  - `workspaceSelection.selectedTarget` stores the primary selected target
  - `workspaceSelection.explicitSelectedTargets` stores multi-selection from Browser/workspace interactions
  - `graphDocumentExportStatusById` stores graph-level STEP export status
  - `requestGraphDocumentStepExport(graphDocumentId)` is the only active executable geometry export action
- `src/app/store/workspaceSelectionCommands.ts`
  - owns shared selected-target and explicit-selection commits
  - already applies cross-surface selection side effects without mutating project content
- `src/app/panels/browserInteractions.ts`
  - resolves Browser rows into `WorkspaceSelectedTarget`
  - already supports graph-document, graph-node, object/reference-style selection flows
- `src/app/workspace/ExportSurface.tsx`
  - currently renders only the active graph as an implicit target
  - currently calls `requestGraphDocumentStepExport(activeGraphDocument.graphDocumentId)` directly

Important current gap:
- there is no app-owned export target list yet.
- `ExportSurface` cannot preserve a user-reviewed target set independently from current Browser selection.
- non-graph targets have no executable STEP export contract yet, so Phase 2 must review them honestly without routing them to the graph STEP handoff.

### Phase 2 Ownership Boundary

Phase 2 owns:
- a small app-owned export target list derived from explicit workspace targets
- target normalization for graph-document, graph-node, object, component, assembly, reference-item, and part selections
- target rows inside `ExportSurface`
- add/replace-from-selection and remove-target behavior
- export-action gating so `STEP` executes only when the selected export target maps to a graph document

Phase 2 does not own:
- exporting arbitrary project objects
- deriving STEP from object mesh rows
- exporting selected viewport meshes
- multi-file batch export
- STL/OBJ/GLB target execution
- project-file or spaghetti-file save/export placement

### Phase 2 Target Model

Recommended app-side model:

```ts
export type ExportWorkspaceTarget =
  | { kind: 'graph-document'; graphDocumentId: string }
  | { kind: 'graph-node'; graphDocumentId: string; nodeId: string }
  | { kind: 'object'; objectId: string }
  | { kind: 'component'; componentId: string }
  | { kind: 'assembly'; assemblyId: string }
  | { kind: 'reference-item'; referenceId: string }
  | { kind: 'part'; partKey: string }
```

Recommended state:

```ts
exportWorkspaceTargets: ExportWorkspaceTarget[]
activeExportWorkspaceTargetKey: string | null
```

Recommended actions:
- `setExportWorkspaceTargets(targets)`
- `replaceExportWorkspaceTargetsFromSelection()`
- `removeExportWorkspaceTarget(targetKey)`
- `setActiveExportWorkspaceTarget(targetKey)`

Normalization rules:
- keep ids exactly as authored/project ids
- dedupe targets by stable key
- preserve order from `workspaceSelection.explicitSelectedTargets`
- if explicit selection is empty, use `workspaceSelection.selectedTarget`
- if selection is still empty, fall back to the active graph document only for display/action continuity

### Phase 2 Execution Rule

`Export STEP` may execute only for:
- `ExportWorkspaceTarget.kind === 'graph-document'`

For Phase 2, other target kinds should show:
- visible row identity
- clear unsupported status such as `Target review only`
- disabled export action if selected as the active export target

Reason:
- worker STEP export currently consumes authoritative graph export input.
- object/component/assembly target export needs a later published-output or target-to-authoritative-input contract.
- this phase is a target review surface, not a new geometry export contract.

### Phase 2 Implementation Spec

1. Add an export target model and state.
   - Define `ExportWorkspaceTarget` and target-key helpers near the app-store/export surface owner.
   - Add `exportWorkspaceTargets` and `activeExportWorkspaceTargetKey` to `AppState`.
   - Add actions for replacing from selection, setting targets, removing targets, and selecting the active export target.

2. Seed targets from current selection.
   - `replaceExportWorkspaceTargetsFromSelection()` should read:
     - `workspaceSelection.explicitSelectedTargets`
     - `workspaceSelection.selectedTarget`
   - It should normalize supported target kinds into `ExportWorkspaceTarget`.
   - It should not mutate Browser selection or project content.

3. Keep the active graph fallback.
   - If the export target list is empty, `ExportSurface` should still show the active graph fallback row.
   - The fallback row should behave like Phase 1 so current STEP export remains usable.

4. Render target review rows.
   - Show target label, kind, id/detail, and readiness.
   - Provide a remove action for app-owned export target rows.
   - Do not remove the underlying Browser/project item.
   - Keep fallback active graph row non-destructive.

5. Gate `Export STEP` by target kind.
   - If active target is a graph document, call `requestGraphDocumentStepExport(graphDocumentId)`.
   - If active target is graph-node/object/component/assembly/reference/part, disable export and show target-review-only messaging.
   - Do not invent object-to-STEP export in this phase.

6. Add focused tests.
   - Store tests for target normalization, dedupe, remove, and no Browser/project mutation.
   - `ExportSurface` tests for:
     - selected graph-document target routes STEP export
     - object/component/reference target renders but disables STEP
     - remove target only removes export target state
     - empty list still shows active graph fallback
     - unavailable non-STEP formats still do not execute.

Likely code owners:
- `src/app/workspace/ExportSurface.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/selection/`
- `src/app/panels/`
- focused `ExportSurface` and store tests

Definition of done:
- shipped: the Export surface can show more than a single implicit active graph target
- shipped: selected targets are explicit graph/project/content ids
- shipped: removing a target does not mutate Browser/project truth
- shipped: `Export STEP` still routes through authoritative graph export for graph targets
- shipped: non-graph targets are visible but not executable as STEP
- shipped: no target path exports viewer meshes

### Phase 2 Shipped Implementation

1. Added app-owned export target state.
   - `useAppStore` now owns `ExportWorkspaceTarget`, stable target keys, `exportWorkspaceTargets`, and `activeExportWorkspaceTargetKey`.
   - Export targets normalize supported workspace selections while rejecting unsupported or viewer-only targets.

2. Seeded export targets from workspace selection.
   - `replaceExportWorkspaceTargetsFromSelection()` reads explicit workspace selections first and falls back to the primary selected target.
   - Target replacement dedupes by stable key and preserves authored graph/project/content ids.
   - Removing export targets does not mutate Browser/workspace selection truth.

3. Rendered target review in `ExportSurface`.
   - The surface shows app-owned target rows with label, kind, detail, active selection, and remove controls.
   - The active graph document remains as a fallback row when no app-owned target list exists.
   - Non-graph targets render as review-only targets.

4. Kept `STEP` execution graph-document-only.
   - `Export STEP` executes only for active graph-document targets.
   - Object, component, assembly, reference, part, and graph-node targets disable the action with `Target review only`.
   - No path exports Three.js viewer meshes.

5. Added focused verification.
   - Store coverage proves selection normalization, dedupe, fallback-from-selected-target behavior, stable target keys, and remove-without-selection-mutation behavior.
   - Surface coverage proves graph-document target export routing, non-graph review-only gating, remove behavior, unavailable format non-routing, and active-graph fallback continuity.
   - Production build passed with the existing OCCT/browser externalization and chunk-size warnings.

## [x] `Export-1 / Phase 3` - `Format-Specific Settings And Detail Controls`

### Phase 3 Summary

This phase should make Export settings honest by showing settings that match the selected format instead of pretending all formats share one universal detail model.

`STEP` should stay CAD/B-rep oriented. Mesh or scene formats should only gain detail controls when their actual writer path exists or is being implemented.

### Phase 3 Current Code Read

Useful current seams:
- `src/app/workspace/ExportSurface.tsx`
  - owns the visible `STEP`, `STL`, `OBJ`, and `GLB` format options
  - stores selected format as local component state
  - currently renders one generic `Settings` readout with `Geometry source`, `Viewer mesh export`, and `Selected format`
  - disables export for non-`STEP` formats through the existing `Format not wired yet` branch
  - already gates export by active target kind after Phase 2
- `src/app/workspace/ExportSurface.test.tsx`
  - already covers `STEP` as the only executable format
  - already proves unavailable formats do not route through `requestGraphDocumentStepExport(...)`
  - can be extended to prove settings copy changes with the selected format
- `src/app/theme/surfaces/export.css`
  - already has `ExportSurfaceReadout` and panel styling that can support a settings-specific readout/list without a new surface architecture

Important current gap:
- the Settings panel still says `Phase 1` and presents a generic readout.
- selecting `STL`, `OBJ`, or `GLB` changes export disabled state, but the Settings panel does not explain why those formats have no active controls yet.
- `STEP` does not yet have its own B-rep-specific settings group, even if the group is intentionally minimal/read-only.

### Phase 3 Ownership Boundary

Phase 3 owns:
- format-specific settings presentation inside `ExportSurface`
- a small settings view model for `STEP`, `STL`, `OBJ`, and `GLB`
- honest read-only/deferred settings rows for unavailable formats
- copy that distinguishes CAD/B-rep settings from mesh/scene settings
- focused tests proving settings follow selected format and unsupported settings do not trigger export

Phase 3 does not own:
- adding STL/OBJ/GLB worker writers
- adding executable mesh tessellation controls
- adding persistent export presets
- changing the graph STEP worker handoff
- changing target collection behavior from Phase 2
- project-file or spaghetti-file save/export placement

### Phase 3 Settings Model

Recommended local model:

```ts
type ExportFormatSettingsView = {
  formatId: ExportFormatOption['id']
  heading: string
  rows: Array<{
    label: string
    value: string
  }>
  note: string
  controlsEnabled: boolean
}
```

Recommended `STEP` rows:
- `Geometry source` -> `Authoritative worker B-rep`
- `Shape ownership` -> `Graph document target`
- `Viewer mesh export` -> `Off`

Recommended unavailable-format rows:
- `Writer status` -> `Not wired yet`
- `Geometry source` -> `Deferred worker writer`
- `Viewer mesh export` -> `Off`

The exact copy can be adjusted during implementation, but the behavior must stay stable:
- `STEP` settings read as CAD/B-rep settings.
- `STL` settings read as future mesh export settings.
- `OBJ` and `GLB` settings read as future scene/package export settings.
- unavailable formats must not render enabled sliders, checkboxes, or selectors that imply working export behavior.

### Phase 3 Execution Rule

Changing the selected format may change the visible settings group, but it must not:
- create a worker request for unavailable formats
- enable `Export STEP` for non-`STEP` formats
- mutate export targets
- export from viewport meshes

The action area remains the source of executable readiness:
- `STEP` can execute only when the active export target is a graph document and status does not block export.
- `STL`, `OBJ`, and `GLB` stay disabled with `Format not wired yet`.

### Phase 3 Implementation Spec

1. Add a format-specific settings view model.
   - Keep it local to `ExportSurface.tsx` unless implementation pressure clearly wants a small helper file.
   - Derive the active settings group from the existing `selectedFormatOption`.
   - Keep `controlsEnabled` false for unavailable formats.

2. Replace the generic Settings readout.
   - Rename the panel strong label from `Phase 1` to a format-specific label.
   - Render the selected format's rows and note.
   - Preserve the explicit `Viewer mesh export: Off` truth.

3. Keep `STEP` settings minimal and B-rep honest.
   - Show that STEP derives from authoritative worker B-rep geometry.
   - Do not add tessellation, decimation, or scene packaging settings to STEP.
   - Do not add filename/preset persistence unless already trivially available without widening ownership.

4. Show unavailable format settings as deferred.
   - Selecting `STL`, `OBJ`, or `GLB` should update the Settings panel.
   - Their setting rows should explain the future writer boundary.
   - They must not expose enabled controls or change export behavior.

5. Add focused tests.
   - Prove `STEP` settings show B-rep/source rows.
   - Prove selecting `STL` changes settings to mesh-writer deferred copy and keeps export disabled.
   - Prove selecting `OBJ` or `GLB` shows scene/package deferred copy.
   - Prove unavailable settings do not call `requestGraphDocumentStepExport(...)`.

Likely code owners:
- `src/app/workspace/ExportSurface.tsx`
- `src/app/workspace/ExportSurface.test.tsx`
- `src/app/theme/surfaces/export.css` if the readout needs small styling support

Definition of done:
- shipped: selected format controls what settings appear
- shipped: `STEP` does not show fake tessellation settings
- shipped: unavailable formats do not expose enabled executable settings
- shipped: tests prove unsupported settings cannot trigger export behavior

### Phase 3 Shipped Implementation

1. Added a format-specific settings view model.
   - `ExportSurface` now maps `STEP`, `STL`, `OBJ`, and `GLB` to distinct settings readouts.
   - The settings panel heading follows the selected format instead of showing a stale phase label.

2. Kept `STEP` B-rep honest.
   - `STEP` settings show authoritative worker B-rep as the geometry source.
   - The readout keeps shape ownership tied to the graph document target.
   - No tessellation, decimation, mesh detail, or scene-package controls were added to `STEP`.

3. Made unavailable format settings explicit.
   - `STL` shows deferred worker mesh writer settings.
   - `OBJ` shows deferred worker scene writer settings.
   - `GLB` shows deferred worker package writer settings.
   - Unavailable formats show `Executable controls deferred` and keep viewer mesh export off.

4. Preserved export behavior.
   - Selecting unavailable formats still disables export with `Format not wired yet`.
   - The surface still does not export from Three.js viewer meshes.
   - No new worker writer or target export contract was introduced.

5. Added focused verification.
   - `ExportSurface` tests prove `STEP` settings are B-rep/source oriented.
   - Tests prove `STL`, `OBJ`, and `GLB` settings switch to deferred copy.
   - Tests prove unavailable settings do not call `requestGraphDocumentStepExport(...)`.
   - Production build passed with the existing OCCT/browser externalization and chunk-size warnings.

## [x] `Export-1 / Phase 4` - `Project File, Spaghetti File, And Later Export Neighbors`

### Phase 4 Summary

This phase should decide how project-file and spaghetti-file save/export-adjacent actions appear near Export without making Export own every persistence schema.

The goal is UX placement clarity, not schema migration.

### Phase 4 Current Code Read

Useful current seams:
- `src/app/workspace/ExportSurface.tsx`
  - already owns the visible Export workspace body
  - currently has target, format, settings, and action panels
  - currently only executes geometry export through `requestGraphDocumentStepExport(...)`
- `src/app/panels/selectBrowserTreeRows.ts`
  - graph document rows already show two distinct actions:
    - `Export STEP`
    - `Save Graph File`
  - this is the existing user-facing proof that geometry export and graph-file persistence are different workflows
- `src/app/panels/useBrowserPanelController.ts`
  - routes `Export STEP` to `requestGraphDocumentStepExport(graphDocumentId)`
  - routes `Save Graph File` to graph persistence save behavior
- `src/app/io/graphDocumentPersistence.ts`
  - owns graph-document file IO, including `.parahook-graph.json`
  - this is graph/spaghetti document persistence, not geometry export
- `src/app/store/useAppStore.ts`
  - currently owns `ProjectFile` and `currentProject`
  - project-file schema is store/project-content ownership, not Export-surface ownership

Important current gap:
- the Export surface does not yet explain adjacent save/export actions.
- users can see `Export STEP` and `Save Graph File` in Browser, but Export does not provide a compact owner map that explains why those actions are separate.
- there is no explicit Phase 4 closeout decision about whether `Export-1` should create a new `Export-2+` doc after the first surface family, or keep later work deferred until real worker writers/project persistence owners are ready.

### Phase 4 Ownership Boundary

Phase 4 owns:
- visible Export-surface copy/readouts that distinguish geometry export from graph/project persistence
- optional neighbor rows/cards for:
  - `Geometry export`
  - `Graph file`
  - `Project file`
  - `Spaghetti file`
- labels that point each neighbor to the correct owner
- tests proving the Export surface does not label graph/project save behavior as geometry export
- the final `Export-1` family closeout decision and next-doc handoff

Phase 4 does not own:
- implementing project-file save/load
- changing graph-document file serialization
- adding a new spaghetti-file schema
- moving Browser graph save behavior into Export
- changing STEP export worker behavior
- adding STL/OBJ/GLB writers

### Phase 4 Neighbor Model

Recommended local display model:

```ts
type ExportNeighborActionView = {
  id: 'geometry-step' | 'graph-file' | 'project-file' | 'spaghetti-file'
  label: string
  owner: string
  status: 'available' | 'browser-owned' | 'deferred'
  description: string
}
```

Recommended first rows:
- `Geometry export`
  - owner: `Export / Worker`
  - status: `Available for STEP`
  - description: true B-rep STEP export from authoritative worker geometry
- `Graph file`
  - owner: `Graph persistence / Browser`
  - status: `Available in Browser`
  - description: save graph document JSON, separate from geometry export
- `Project file`
  - owner: `Project persistence`
  - status: `Deferred`
  - description: durable project schema remains with project/persistence owners
- `Spaghetti file`
  - owner: `Graph persistence`
  - status: `Deferred / Graph-file path`
  - description: graph/spaghetti document save remains graph-file persistence, not Export geometry output

Implementation can adjust exact copy, but the action meaning must stay stable:
- geometry export means output such as `STEP`
- graph file means graph-document JSON persistence
- project file means project persistence
- spaghetti file means graph/spaghetti document persistence, not B-rep export

### Phase 4 Execution Rule

Phase 4 should not add new executable save/load behavior unless the code already exposes a narrow, owner-backed action that can be called without moving ownership.

Default expected implementation:
- add a read-only `Related outputs` / `Save neighbors` panel or section inside `ExportSurface`
- keep `Export STEP` as the only executable Export action
- point graph-file save to the Browser-owned `Save Graph File` action by label/status, not by duplicating its handler
- mark project/spaghetti persistence as deferred or owner-backed elsewhere

### Phase 4 Implementation Spec

1. Add a neighbor readout in `ExportSurface`.
   - Prefer a compact panel/section over new workflow chrome.
   - Show geometry export, graph file, project file, and spaghetti file as distinct rows.
   - Use plain labels that separate `Export STEP` from `Save Graph File`.

2. Keep executable behavior unchanged.
   - Do not duplicate Browser graph-save handlers inside Export.
   - Do not add project-file save/load.
   - Do not add spaghetti-file schema work.
   - Keep `Export STEP` as the only active Export-surface action.

3. Make owner handoffs explicit.
   - `Geometry export` should point to `Export / Worker`.
   - `Graph file` should point to graph persistence / Browser.
   - `Project file` should point to project persistence.
   - `Spaghetti file` should point to graph persistence unless a narrower graph/spaghetti family later splits it.

4. Add focused tests.
   - Prove the Export surface renders distinct labels for geometry export and graph file save.
   - Prove project file and spaghetti file rows are visible but not executable from this phase.
   - Prove selecting unavailable formats still does not change neighbor action availability.
   - Preserve existing `Export STEP` action coverage.

5. Close or hand off `Export-1`.
   - If this implementation completes the first surface-and-format family, mark `Export-1` as shipped in this doc and the index.
   - Decide whether the next real work should create `Export-2 - Multi-Format Worker Writers And Result Management` or remain deferred until the worker writer family is ready.
   - Do not create `Export-2` automatically unless the implementation outcome clearly needs the next standalone doc.

Likely code owners:
- `src/app/workspace/ExportSurface.tsx`
- `src/app/workspace/ExportSurface.test.tsx`
- `src/app/theme/surfaces/export.css` if the neighbor readout needs styling
- Browser graph action labels only if the current `Export STEP` / `Save Graph File` wording needs consistency cleanup
- Export family docs
- persistence-family docs if a narrower owner must be referenced

Definition of done:
- shipped: project-file and graph/spaghetti-file actions are not confused with geometry export
- shipped: `STEP` remains a geometry export
- shipped: graph-file save remains distinct from geometry export
- shipped: persistence schemas remain with their owning systems
- shipped: the next `Export-2+` boundary is explicitly defined or deferred

### Phase 4 Shipped Implementation

1. Added a related outputs owner map in `ExportSurface`.
   - The new read-only `Related Outputs` panel lists geometry export, graph file, project file, and spaghetti file neighbors.
   - `Geometry export` points to `Export / Worker` and stays available for `STEP`.
   - `Graph file` points to `Graph persistence / Browser` and stays available through the existing Browser save path.
   - `Project file` points to `Project persistence` and remains deferred.
   - `Spaghetti file` points to `Graph persistence` and remains deferred on the graph-file path.

2. Kept executable behavior unchanged.
   - `Export STEP` remains the only active Export-surface action.
   - Browser graph-save behavior was not duplicated inside Export.
   - No project-file save/load behavior, graph-document serialization change, or spaghetti-file schema was introduced.

3. Closed the first Export surface family.
   - `Export-1` now covers the first surface, target review, format-specific settings, and save/export-neighbor ownership readout.
   - Separate `Export-2+` docs are deferred until real multi-format worker writers or result-management work are ready.

4. Added focused verification.
   - `ExportSurface` tests prove geometry export and graph file save render as distinct neighbors.
   - Tests prove project file and spaghetti file neighbors are visible but not executable.
   - Tests prove unavailable formats do not change neighbor ownership or trigger export behavior.
   - Focused Export tests, TypeScript, and production build passed with the existing OCCT/browser externalization and chunk-size warnings.
