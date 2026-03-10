# SP - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
4. 2026-03-10 00:00: Replaced the old `SP - Phase 9` placeholder with a real completed-phase summary that folds in the shipped `9A.1`, `9A.2`, `9A.3`, `9B`, and `9C` work so the family file now reflects what actually landed across graph documents, viewport binding, Browser foundations, and graph-local runtime preparation
3. 2026-03-10 00:00: Expanded `SP - Phase 11` from a placeholder into a question-driven planning surface for `[1.5] Graphs Panel And Nested Parts`, adding a small achievements block, an active question checklist, and one subsection per open planning question
2. 2026-03-08 00:00: Rebuilt the completed `SP` phases from `docs/CHANGELOG.md`, promoting `SP - Phase 1` through `3` to reconstructed status and adding real summaries, grouped checklists, and file-footprint sections for `SP - Phase 1` through `7`
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `SP` family now has a proper home for later changelog reconstruction, checklist buildout, and future spaghetti-system planning

##### Purpose

This file is the simple phase-family history document for the `SP` prefix.

Use this file for:
- the canonical `SP` phase sequence
- a simple explanation of what each `SP` phase did
- understanding how the spaghetti graph/editor system evolved over time
- seeing where major `SP` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `SP` Means

`SP` is the canonical spaghetti-system-layer prefix.

It is used when the main work is about:
- spaghetti graph schema/store/compiler foundations
- graph authoring integration into the live app
- spaghetti window/editor layout and UX systems
- spaghetti-specific tooling and workflow surfaces

##### Format And Depth

Use this file as the planning and checklist home for canonical `SP` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - SP - Phase 1 - `Spaghetti Editor S1 - Schema / Validation / Store` - Reconstructed

Human Summary: This landed the first real spaghetti graph subsystem, adding schema, validation, registry, and store foundations so the graph editor stopped being just an idea and became a concrete owned layer.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It is the first serious owned subsystem milestone for the spaghetti editor.

##### Phase Summary

Current understanding:
- the first serious spaghetti graph schema and registry foundation landed
- validation and cycle-awareness were added around the graph model
- spaghetti gained its own store foundation and became a real subsystem

##### Files Changed

- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`

### Phase 1 CheckList

- [x] land the first serious spaghetti graph schema and registry foundation
- [x] add validation and cycle-awareness around the graph model
- [x] give spaghetti its own store foundation so it becomes a real subsystem

## [x] - SP - Phase 2 - `Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton` - Reconstructed

Human Summary: This added the first compute, evaluate, and compile skeleton for spaghetti graphs, introducing compile-shape thinking so the graph could produce meaningful build-facing data.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It is the phase where spaghetti stopped being only schema/store and started becoming a compile-capable authoring system.

##### Phase Summary

Current understanding:
- the first compute/evaluate skeleton for the graph system was added
- compile-shape thinking was introduced into the spaghetti layer
- the graph was prepared to produce deterministic build-facing data

##### Files Changed

- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`

### Phase 2 CheckList

- [x] add the first compute/evaluate skeleton for the graph system
- [x] introduce compile-shape thinking into the spaghetti layer
- [x] prepare the graph to produce deterministic build-facing data

## [x] - SP - Phase 3 - `Spaghetti Editor S3 - Compile To Build Integration` - Reconstructed

Human Summary: This connected spaghetti compile output into the live build path, turning spaghetti from an isolated graph/editor experiment into a real authoring input mode for the main app.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It is the bridge from isolated graph experimentation into the real live build path.

##### Phase Summary

Current understanding:
- spaghetti compile output was connected into the live build path
- spaghetti stopped being only an isolated graph/editor experiment
- the current worker path was preserved while feeding it graph-produced build intent

##### Files Changed

- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/buildModel.ts`
- `src/shared/buildTypes.ts`

### Phase 3 CheckList

- [x] connect spaghetti compile output into the live build path
- [x] turn spaghetti into a real authoring input mode
- [x] preserve the current worker path while feeding it graph-produced build intent

## [x] - SP - Phase 4 - `Floating Window Follow-up - Default Geometry + Drag`

Human Summary: This stabilized the initial floating spaghetti window by fixing the default open geometry and restoring normal drag behavior immediately on open.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is the first direct shipped `SP` follow-up after the earlier reconstructed foundation phases.

##### Phase Summary

Current understanding:
- the default spaghetti floating-window anchor was moved lower in the viewport
- normal dragging was re-enabled immediately on open
- first drag now marks the floating window as user-positioned
- default open width and height were updated to fit the available workbench space more sensibly

##### Files Changed

- `src/app/AppShell.tsx`

### Phase 4 CheckList

- [x] update the default floating-window open anchor and geometry
- [x] re-enable normal dragging immediately on open
- [x] mark the floating window as user-positioned on first drag
- [x] size the default open window to fit the available workbench space more sensibly

## [x] - SP - Phase 5 - `Spaghetti Window And Layout Foundations`

Human Summary: This hardened the spaghetti window and layout system through a cluster of follow-up fixes, mainly around minimum sizing, header scroll ownership, resize behavior, and tighter layout control.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This phase is evidenced by multiple direct shipped changelog entries:
- `Vertical Resize Handle`
- `Minimum Width Tightening`
- `Header Scroll Relocation`
- `Minimum Height Reduction`
- `Split Resize Ownership Fix`

This is the main layout-foundation wave for the modern spaghetti window.

##### Phase Summary

Current understanding:
- the spaghetti editor gained a top-edge vertical resize handle
- minimum width and height behavior were tightened so the editor can shrink further without breaking its shell
- header scroll ownership was moved out of the wrong container
- resize ownership was split more cleanly between the window shell and inner editor layout

##### Files Changed

- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/v15Theme.css`

### Phase 5 CheckList

- [x] add a top-edge vertical resize handle for the spaghetti editor block
- [x] tighten minimum width behavior
- [x] reduce minimum height so the editor can resize smaller
- [x] relocate header scroll ownership to the correct container
- [x] split resize ownership more cleanly between outer window geometry and inner editor layout
- [x] preserve bottom-anchored editor behavior while allowing manual height control

## [x] - SP - Phase 6 - `Resizable Debug Inspector Drawer`

Human Summary: This added a second vertical resize handle for the Debug Inspector drawer so the spaghetti debug surface could resize independently of the main editor area.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This is a direct shipped follow-up to the earlier spaghetti window/layout foundation work.

##### Phase Summary

Current understanding:
- a second vertical resize handle was added above the `Debug Inspector` drawer
- the drawer got its own height state with drag-to-resize and double-click reset behavior
- the drawer layout was updated so the toggle stays fixed while the inspector body scrolls inside the resized area

##### Files Changed

- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`

### Phase 6 CheckList

- [x] add a dedicated vertical resize handle above the `Debug Inspector` drawer
- [x] give the drawer its own height state with drag-to-resize and double-click reset behavior
- [x] update the drawer layout so the toggle stays fixed while the body scrolls inside the resized area

## [x] - SP - Phase 7 - `Spaghetti Editor Window Update Phase Plan`

Human Summary: This created the dedicated phase plan for the next spaghetti window/layout update, capturing current resize bugs and the requested future window-mode expansion.

### Phase 7 Overview
#### Fold Hack 4

##### Phase Notes

This is a documentation-only shipped `SP` phase that still belongs to the spaghetti family because it planned the next spaghetti window/layout wave directly.

##### Phase Summary

Current understanding:
- a dedicated spaghetti window-update phase-plan doc was added
- the current resize/layout bugs were captured in one place
- a four-mode spaghetti window feature request was folded into the next planning surface
- ownership was split more explicitly between `AppShell` outer window geometry and `SpaghettiPanel` inner layout behavior

##### Files Changed

- `docs/Phases/UI_Window-Update_PhasePlan.md`

### Phase 7 CheckList

- [x] add a dedicated phase-plan doc for the next spaghetti window/layout phase
- [x] capture the current resize/layout bugs in one place
- [x] capture the four-mode spaghetti window feature request
- [x] recommend the ownership split between `AppShell` outer geometry and `SpaghettiPanel` inner layout behavior

## [ ] - SP - Phase 8 - `Spaghetti Editor Toolbar Redesign`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 8 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should redesign the spaghetti editor toolbar

### Phase 8 CheckList

- [ ] define the target toolbar redesign scope

## [x] - SP - Phase 9 - `Graph Document Foundations`

Human Summary: This was the main Browser-foundation wave for spaghetti. It turned graphs into explicit documents, moved a first slice of authored canvas truth into graph ownership, introduced explicit editor viewport binding, made the Browser the first honest viewport manager, and moved compile/build plus preview-prep runtime toward graph-local ownership.

### Phase 9 Overview
#### Fold Hack 4

##### Phase Notes

This phase is no longer a placeholder.

It is the shipped foundation wave that covered:
- `9A.1`
- `9A.2`
- `9A.3`
- `9B`
- `9C`

This is the phase where the app stopped being shaped around one implicit spaghetti graph/editor path and started being shaped around:
- graph documents
- editor viewports
- Browser-managed open/focus behavior
- graph-local runtime preparation for later routing work

##### Phase Summary

Current understanding:
- `9A.1` introduced the first explicit `GraphDocument` contract and runtime document container
- `9A.2` moved per-node row mode into graph-owned authored canvas truth under `SpaghettiGraph.ui`
- `9A.3` introduced the first explicit `EditorViewport` record and explicit viewport-to-graph binding
- `9B` made the Browser the first real open/focus viewport manager and added graph switching through the editor header
- `9C` moved compile/build memory and preview-preparation memory into graph-local runtime buckets
- by the end of `SP - Phase 9`, the main single-graph assumptions blocking Browser-first architecture had been removed

##### Phase Sub-Phases

###### `9A.1` - `Graph Document Shape And Identity`

- added the first canonical `GraphDocument` contract:
  - `graphDocumentId`
  - `name`
  - `version`
  - `graph`
- wrapped the current singleton graph into the first graph-document layer
- redirected canonical graph reads/writes through the document seam
- kept viewport/editor-local state and `edgeWaypoints` out of the canonical document contract

###### `9A.2` - `Graph-Owned Authored Canvas State`

- kept node positions graph-owned
- moved per-node row mode into `SpaghettiGraph.ui.nodeModesByNodeId`
- narrowed `useSpaghettiUiStore` away from node-mode truth
- kept section/group/composite collapse, menus, selection, hover, drag, and pan/zoom local

###### `9A.3` - `Viewport Binding And First Singleton Split`

- added the first explicit `EditorViewport` contract
- bound editor viewport identity to `graphDocumentId`
- rewired `AppShell`, `SpaghettiPanel`, and `SpaghettiEditor` through explicit viewport/document binding
- kept `activeGraphDocumentId` as a temporary compatibility bridge for the compile/build path

###### `9B` - `Multi-Editor Browser Foundation`

- expanded `useSpaghettiStore` into a real Browser/open-focus viewport manager
- moved floating viewport geometry into viewport-managed state
- added the docked Browser tree shell with graph rows and open-viewport rows
- added graph switching through the editor-header graph dropdown
- locked focus, z-order, and single `meatball editor view` rules
- replaced the old one-window spaghetti assumption with Browser-first open/focus behavior

###### `9C` - `Graph-Local Compile / Preview Preparation`

- moved compile/build memory into graph-local runtime buckets
- moved preview-preparation memory into graph-local ownership
- removed the old spaghetti-global compile/build bucket from `useAppStore`
- reconnected build wiring, viewer preview prep, and spaghetti runtime reads through graph-keyed state
- left full worker/result routing redesign for `SP - Phase 10`

##### Files Changed

- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `docs/Phase-Plans/Tasks/Future/01.01 - SP - Phase 9A.1.md`
- `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md`
- `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md`
- `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md`
- `docs/Phase-Plans/Tasks/Future/01.05 - SP - Phase 9C.md`
- `docs/Human-Plans/roadmap/roadmap.md`

### Phase 9 CheckList

- [x] define the first canonical `GraphDocument` contract and document container
- [x] move graph identity away from one implicit singleton graph seam
- [x] move per-node row mode into graph-owned authored canvas truth
- [x] introduce the first explicit `EditorViewport` contract and viewport binding seam
- [x] make the Browser the first real open/focus viewport manager
- [x] add graph switching inside one editor viewport through the header dropdown
- [x] move viewport geometry into viewport-managed state
- [x] move compile/build memory into graph-local runtime ownership
- [x] move preview-preparation memory into graph-local runtime ownership
- [x] remove the main single-graph assumptions blocking later Browser, persistence, and routing work

## [ ] - SP - Phase 10 - `Graph Aware Worker And Preview Routing`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should make worker and preview routing more graph-aware

### Phase 10 CheckList

- [ ] define the target graph-aware worker/preview routing scope

## [ ] - SP - Phase 11 - `Graphs Panel And Nested Parts`

Human Summary: Active planning surface. This phase now has a question-driven setup for `[1.5]` so the first real Browser hierarchy surface can be clarified before a dedicated task doc is created or implementation starts.

### Phase 11 Overview
#### Fold Hack 4

##### Phase Notes

This is currently the main open `SP` planning target inside Lane `[1]`.

It is the Browser-surface follow-up after:
- `SP - Phase 9`
- `SP - Phase 10`
- `GE - Phase 12`

This section should be used like a compact planning pad until `SP - Phase 11` is clear enough to justify a dedicated task doc.

##### Phase Summary

Current planning understanding:
- this phase should become the first real Browser-facing hierarchy surface
- it should show graphs and their outputs in a way that can grow later into:
  - `Project File -> Assembly tree -> Components / Objects -> Parts`
- it should stay separate from:
  - full project ownership definition
  - full Browser workspace polish
  - richer later output hierarchy and row-control systems

##### Small Achievements

- [x] promoted `SP - Phase 11` from a placeholder to an active planning surface
- [x] added a first-pass question list for `[1.5]`
- [ ] resolve the first-pass Browser row model
- [ ] resolve the first-pass graph-row versus output-row structure
- [ ] resolve what row actions belong in the first implementation
- [ ] create the dedicated `SP - Phase 11` task doc after the core questions are answered

### Phase 11 Planning Questions
#### Fold Hack 5

##### Planning Notes

- Use this as the active question list for `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`.
- When a question is answered, update both:
  - the `Phase 11 Question CheckList`
  - and the matching `#### QN` section below
- Keep this phase focused on the first Browser hierarchy surface, not later project/workspace systems.

##### Phase 11 Question CheckList

- [x] Q1 - What is the minimum first-pass Browser surface that should count as real for `SP - Phase 11`?
- [x] Q2 - How should graph rows relate to output rows in the first Browser hierarchy pass?
- [x] Q3 - How deep should nested output display go in the first pass?
- [x] Q4 - What row actions and quick controls belong in scope for the first pass?
- [x] Q5 - How should Browser focus, selection, and reveal behavior relate to editor/viewer state?
- [ ] Q6 - What should stay out of `SP - Phase 11` so it does not sprawl into later `AS`, `VR`, or `GE` work?

#### [x] Q1 - What is the minimum first-pass Browser surface that should count as real for `SP - Phase 11`?

##### Why This Matters

- this phase needs a clear minimum win condition
- without that, it can drift into a vague mix of Browser polish, project ownership, and output structure work

##### Working Read

- `SP - Phase 11` should count as real when the Browser stops being only a graph launcher and becomes the first honest left-side hierarchy surface for graph-owned content

##### Recommended First Pass

- a docked left Browser tree, not a temporary flat panel
- one stable row per graph document
- graph rows can expand and collapse
- the Browser clearly reflects which graph is open and focused
- the row structure is built as a tree so later `Component / Object / Part` depth can grow without redesigning the Browser layout

##### Do Not Require Yet

- full project-file ownership
- visible output/content rows
- rich row actions or context menus
- build bars
- materials and richer visibility controls
- final deep nesting rules
- polished Browser workspace behavior

##### Roadmap Placement For Deferred Items

- do not drop these items just because they are out of the first `SP - Phase 11` pass
- keep them explicitly deferred into the roadmap lanes that already fit them best:
  - full project-file ownership
    - `GE - Phase 12`
  - richer Browser workspace behavior, row actions, and Browser-to-editor / Browser-to-viewer interaction polish
    - `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - deeper Browser-facing content structure and final nesting direction
    - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
  - build bars and richer build-status row surfaces
    - `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
    - later `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
  - materials and richer visibility controls
    - `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

##### Working Notes

- plain-English win condition:
  - the Browser is now a real hierarchy tree for graph documents, not just a place to open graphs

#### [x] Q2 - How should graph rows relate to output rows in the first Browser hierarchy pass?

##### Why This Matters

- this is the main structural question for `[1.5]`
- it decides whether the Browser is still basically a graph list, or has become the first real content tree

##### Working Read

- the long-term target hierarchy stays:
  - `Project File`
    - `Graph Documents`
      - `Graph A`
      - `Graph B`
      - `Graph C`
    - `Project Content`
      - `Assembly Root`
        - `Assembly`
          - `Component (from Graph A)`
            - `Object`
              - `Part`
          - `Component (from Graph B)`
            - `Object`
              - `Part`
- that target is still correct
- but the first `SP - Phase 11` Browser pass should not try to render the real `Project Content` branch yet

##### Recommended First-Pass Decision

- in the first Browser hierarchy pass, graph rows remain the primary real tree rows
- the Browser should establish the `Graph Documents` side of the target hierarchy first
- `Project` can exist as the top shell/container
- `Graph Documents` should be the first real content branch under that shell
- visible output rows should stay out of the first pass, even though the eventual target includes project content built from graph-produced components

##### Why This Is The Best Cut

- it preserves the correct long-term target instead of changing it
- it gives `[1.5]` a real Browser hierarchy win without forcing final content-structure decisions too early
- it prevents `SP - Phase 11` from absorbing:
  - `GE - Phase 12` project ownership work
  - `[2.2]` Browser-facing output structure work
- it keeps the first hierarchy pass aligned with what the app already has today:
  - `Project`
  - graph list/tree surface
  - open/focused viewport state

##### What This Leaves For Later

- `Project Content` as a real Browser branch
- `Assembly Root`
- `Assembly`
- `Component`
- `Object`
- `Part`
- visible output/content rows derived from graphs

##### Roadmap Ownership Of The Deferred Structure

- `GE - Phase 12`
  - project-file ownership
  - graph documents versus project content ownership split
- `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
  - visible Browser-facing content structure
  - `Component / Object / Part` display direction
- later Browser/content phases
  - richer project-content interaction and controls

##### Working Notes

- plain-English rule:
  - keep the target hierarchy
  - but only build the `Project -> Graph Documents -> Graph rows` side in the first `SP - Phase 11` pass

#### [x] Q3 - How deep should nested output display go in the first pass?

##### Why This Matters

- the first pass needs enough nesting to prove the hierarchy model
- but too much depth too early could pull in later `AS` structure work

##### Working Read

- recommended first-pass nested output depth:
  - none
- the first `SP - Phase 11` pass should not render visible output/content rows yet
- that means the first real Browser depth should stop at:
  - `Project`
    - `Graph Documents`
      - `Graph A`
      - `Graph B`
      - `Graph C`
- if the Browser also shows utility branches such as `Open Viewports`, treat those as coordination/runtime branches, not output hierarchy

##### Working Notes

- this keeps `SP - Phase 11` aligned with the narrower first-pass decision from `Q2`
- it avoids half-implementing:
  - `Project Content`
  - `Assembly`
  - `Component`
  - `Object`
  - `Part`
- visible output/content depth should begin later under the phases that already own that work:
  - `GE - Phase 12`
  - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- plain-English rule:
  - first make the Browser real as a graph-document tree
  - add real content/output depth later

#### [x] Q4 - What row actions and quick controls belong in scope for the first pass?

##### Why This Matters

- the Browser should do more than only display rows
- but row actions can easily sprawl into later build, visibility, material, and context-menu systems

##### Working Read

- recommended first-pass graph-row actions:
  - click graph row to open/focus that graph
  - show simple row status:
    - `Closed`
    - `Open`
    - `Focused`
  - allow normal tree expand/collapse behavior where that helps the graph-documents branch feel like a real Browser tree
- keep `New Graph` and `Duplicate Focused` as panel-level actions, not per-row graph actions
- keep viewport close/focus actions in the `Open Viewports` branch, not on graph-document rows

##### Working Notes

- this keeps graph rows about graph-document navigation, not mini toolbars
- this also keeps the row model aligned with the first-pass Browser scope from `Q1` through `Q3`
- intentionally leave these for later:
  - context menus
  - rename
  - delete
  - duplicate-on-row
  - `view` / `generate` toggles
  - build bars
  - materials / visibility controls
  - output/content-specific actions
- plain-English rule:
  - first-pass graph rows should mainly be open/focus rows with clear state, not crowded action surfaces

#### [x] Q5 - How should Browser focus, selection, and reveal behavior relate to editor/viewer state?

##### Why This Matters

- once the Browser shows graph outputs, row state will need to stay coherent with:
  - focused editor viewport
  - active graph
  - later viewer selection/reveal behavior

##### Working Read

- recommended first-pass rule:
  - Browser focus should clearly mirror the active graph/editor state
  - clicking a graph row in the Browser should open/focus that graph
  - Browser highlight should mean:
    - this is the graph currently open/focused in the editor path
  - Browser selection should stay lightweight and should not become a separate heavy selection model yet
  - reveal behavior should not become its own real feature yet beyond open/focus behavior

##### Working Notes

- this keeps Browser and editor behavior coherent without creating a second competing selection system
- this also keeps `[1.5]` out of later viewer/content selection and reveal work
- intentionally leave these for later:
  - multi-row selection
  - viewer reveal / isolate behavior
  - Browser selection that differs from editor focus
  - content-row selection under `Project Content`
  - richer sync between Browser rows and viewer-picked objects/parts
- plain-English rule:
  - in the first pass, the Browser should mostly reflect which graph you are in, not become a full selection/reveal system

#### [ ] Q6 - What should stay out of `SP - Phase 11` so it does not sprawl into later `AS`, `VR`, or `GE` work?

##### Why This Matters

- this is the guardrail question
- it keeps the phase from absorbing too much of:
  - later output hierarchy work
  - later Browser workspace systems
  - later project ownership work

##### Working Read

- keep out for now:
  - full `GE - Phase 12` project ownership rules
  - richer `AS` content hierarchy depth beyond the first honest Browser surface
  - richer `VR` row controls, materials, and visibility systems
  - later build bars and deeper build-control UX

##### Working Notes

- pending

### Phase 11 CheckList

- [x] create the first question-driven planning surface for `[1.5]`
- [ ] define the minimum first-pass Browser surface
- [ ] define graph-row versus output-row structure
- [ ] define first-pass nested output depth
- [ ] define first-pass row actions and focus rules
- [ ] define what stays out of scope
- [ ] convert the answered planning surface into a dedicated task doc

## [ ] - SP - Phase 12 - `Shared Viewport Composition`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 12 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should add shared viewport composition behavior

### Phase 12 CheckList

- [ ] define the target shared viewport composition scope

## [ ] - SP - Phase 13 - `Multi Window Graph Editing`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 13 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should add multi-window graph editing

### Phase 13 CheckList

- [ ] define the target multi-window graph editing scope

## [ ] - SP - Phase 14 - `Multi Graph Debug And Polish`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 14 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should add multi-graph debug and polish work

### Phase 14 CheckList

- [ ] define the target multi-graph debug/polish scope
