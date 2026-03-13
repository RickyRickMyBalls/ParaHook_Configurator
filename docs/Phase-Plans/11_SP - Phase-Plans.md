# SP - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
32. 2026-03-12 14:45: Added a `2.1C` carry-forward note under the shared `[2.1]` `SP` planning surface so the family doc now explicitly captures the Browser/shell honesty issue after shipped `2.1A` / `2.1B`, including the mismatch where `Open Viewports` currently reads like literal visible spaghetti windows even though the shell still mostly renders one active editor surface at a time, and points that naming/coordination cleanup at `2.1C` rather than later `SP - Phase 13`
31. 2026-03-13 10:48: Locked the shared `[2.1]` `SP` coordination questions and created the first dedicated future task doc, so the Browser-to-editor/viewer side of `Lane [2.1]` now has a closed first-pass decision surface and a plan-doc handoff for the next implementation-spec rewrite
30. 2026-03-13 10:41: Tightened the shared `[2.1]` `SP` suggested answers to match the intended Browser click behavior, clarifying that single-click Browser selection may drive presentation-only viewer emphasis while explicit open/focus actions still own editor movement and Browser interactions must not silently retarget shared composition truth
29. 2026-03-13 10:40: Closed out the parent `SP - Phase 10` family section so it now reads as a shipped routing/runtime/output-handoff phase family backed by completed `10A`, `10B`, and `10C` work instead of still reading like an open planning surface
28. 2026-03-13 10:34: Added first-pass suggested answers under the shared `[2.1]` `SP` questions so the coordination side of the lane now has a concrete proposal for Browser-to-editor focus rules, open/focus versus shared-viewer actions, remaining singleton assumptions to break, and the stop line before later multi-window or broader workspace orchestration work
27. 2026-03-13 10:28: Added a shared `Lane [2.1]` coordination question surface in the `SP` family doc so the Browser-to-editor, graph-viewport, and shared-viewer coordination questions now have a planning home separate from the more Browser/workspace-semantic questions placed in `VR - Phase-Plans.md`
26. 2026-03-13 10:06: Implemented `SP - Phase 11`, so the Browser now ships an honest `Project -> Graph Documents -> published graph output rows` hierarchy in `BrowserPanel`, with graph-row focus/open state and one thin graph-owned child-output level read from `GraphOutputSurface` instead of leaving this phase as planning-only Browser tree work
25. 2026-03-13 00:12: Locked `SP - Phase 11` questions `Q6` through `Q8`, setting the final first-pass boundary so the Browser hierarchy phase now clearly stops at graph rows plus published graph output rows, keeps project ownership versus Browser structure separated across `GE` and later `AS` work, and reads those first child rows from `useSpaghettiStore` rather than project-content state
24. 2026-03-12 23:58: Re-ran the `ASS#` planning loop for `SP - Phase 11`, updating the old narrower Browser-only assumptions after shipped `GE - Phase 12` and `SP - Phase 12`, adding the missing out-of-scope and implementation-prep questions, and shifting the first-pass recommendation toward expandable graph rows with one thin graph-owned child-output level before a dedicated `01.5` task doc is created
23. 2026-03-12 23:44: Implemented `SP - Phase 12`, adding a runtime-owned shared viewer composition session in `useSpaghettiStore`, explicit viewport-authored join/leave actions in `SpaghettiPanel`, graph-qualified shared preview union rendering in `ViewerHost`, and automated coverage proving composition membership stays explicit and stable when focus changes
22. 2026-03-12 23:14: Locked `SP - Phase 12` questions `12.Q1` through `12.Q5`, then added `12.Q6` through `12.Q9` as the final implementation-prep layer covering composition unit, authoring entry path, render rule, and fallback/default behavior so the later `SP 12` task-doc rewrite can be written against one near-complete decision surface
21. 2026-03-12 22:48: Added first-pass suggested answers under `SP - Phase 12` questions `12.Q1` through `12.Q5`, so the family doc now carries a concrete proposal for what shared viewport composition means, which surfaces participate, where composition truth should live, what visible proof makes the phase real, and what later work must stay out of scope before deciding whether to split subphases
20. 2026-03-12 22:42: Replaced the `SP - Phase 12` placeholder with a short question-driven planning surface covering the exact meaning of shared viewport composition, the first-pass viewport ownership cut, coordination rules, the minimum visible proof bar, and the out-of-scope line so the phase can be shaped before deciding whether it needs subphases
19. 2026-03-11 16:21: Implemented `SP - Phase 10C`, adding graph-owned published output surfaces to spaghetti runtime state, rerouting current output-facing readers in the parts list and debug inspector to that canonical handoff seam, and proving the first-pass graph-isolation and slot-state behavior with automated tests
18. 2026-03-11 13:31: Locked the `10C` implementation-prep answers in the family doc, converting the remaining output-handoff questions into resolved first-pass decisions with a graph-owned output surface, derived authored-versus-published rules, graph-scoped identity, explicit slot states, seam boundaries, and proof-bar limits aligned to the vision roadmap
17. 2026-03-11 12:16: Removed the stale lower `10B` draft question block so `SP - Phase 10` now has one canonical answered `10B` section and one active `10C` question section instead of duplicate `10B` planning surfaces
16. 2026-03-11 12:10: Normalized the remaining ambiguous `Phase 10` question labels so the live and archived `10B / 10C` question blocks now read with explicit subphase ids instead of generic `Q1 / Q2 / Q3` markers
15. 2026-03-11 12:03: Added a dedicated `10C` question block under `SP - Phase 10C` so the remaining output-declaration and handoff decisions now have their own implementation-prep surface before a `10C` task doc is created
14. 2026-03-11 11:16: Implemented `SP - Phase 10B`, moving accepted spaghetti build outputs into graph-local runtime state, adding explicit viewer-target ownership in the spaghetti store, rerouting the shared viewer and spaghetti read surfaces away from app-global spaghetti parts, and covering the first-pass behavior with automated tests
13. 2026-03-11 03:45: Locked `10B.Q6` in the family doc, defining the minimum automated proof bar for graph-local preview/build memory so `10B` now has a full first-pass decision set before the implementation-doc rewrite
12. 2026-03-11 03:35: Locked the first five `10B` implementation-prep answers in the family doc, defining the exact seam cut, the minimal request/result contract reuse, explicit shared-viewer targeting, multi-graph overwrite safety, and the out-of-scope boundary for graph-local preview/build memory
11. 2026-03-11 03:20: Added a dedicated `10B` question block under `SP - Phase 10B` so graph-local preview/build memory now has its own open implementation-prep checklist instead of relying only on the broader mixed `Phase 10` question list
10. 2026-03-11 03:10: Added the dedicated `10B` task doc in `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md` so graph-local preview/build memory now has its own planning surface before the implementation-ready pass
9. 2026-03-11 03:00: Implemented the first real `SP - Phase 10A` routing cut, carrying graph-aware request/result identity through the dispatcher, worker build path, app-store entry points, and graph-local runtime guards, and proving the first-pass stale-drop/isolation behavior with automated tests
8. 2026-03-11 00:00: Locked `SP - Phase 10A` at the family-doc level by converting `10A.Q1` through `10A.Q7` from open routing questions into resolved planning answers, including the first-pass synthetic `projectFileId` rule, graph-local build-sequence ownership, compatibility-wrapper policy, and the minimum automated proof bar
7. 2026-03-11 00:00: Added a `10A`-specific implementation-question block under `SP - Phase 10` so the graph-aware routing subphase now explicitly tracks the remaining request/result, stale-drop, ownership, and test-bar questions before a task doc is created
6. 2026-03-11 00:00: Split the active `SP - Phase 10` planning surface into explicit working subphases `10A`, `10B`, and `10C` inside the family doc so the routing, runtime-memory, and output-handoff work can be prepared and tracked separately
5. 2026-03-11 00:00: Promoted `SP - Phase 10` from a future placeholder to an active planning surface for `[1.3]`, folding in the already-locked roadmap/Codex-note routing decisions and adding the remaining implementation-prep questions for graph-aware worker and preview routing
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

## [x] - SP - Phase 10 - `Graph Aware Worker And Preview Routing`

Human Summary: This shipped the graph-aware routing/runtime wave for spaghetti through completed `10A`, `10B`, and `10C` cuts. By the end of `SP - Phase 10`, compile/build requests carried graph identity, preview/build memory became graph-local, and each graph owned a real output handoff surface instead of the app relying on one global spaghetti runtime path.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This phase is no longer an open planning target.

It is the worker/preview routing bridge after:
- `SP - Phase 9`
- `GE - Phase 11`

It set up the real graph-aware runtime path before:
- `GE - Phase 12`
- `SP - Phase 11`

##### Phase Summary

Current shipped understanding:
- this phase routed compile/build requests and results by graph identity
- it kept one shared worker shell and one shared viewer shell while making runtime memory graph-local
- it treated `OutputPreview` as the graph's output declaration / handoff surface through the shipped `GraphOutputSurface` seam
- it broke the remaining one-preview / one-assembled / one-global-result assumptions without absorbing later Browser hierarchy work
- it landed as a three-part family:
  - `10A`
  - `10B`
  - `10C`

##### Small Achievements

- [x] promoted `SP - Phase 10` from a placeholder to an active planning surface
- [x] folded the already-locked `[1.3A]`, `[1.3B]`, and `[1.3C]` direction into the family doc
- [x] split the family doc planning surface into explicit `10A / 10B / 10C` working subphases
- [x] resolved the routing, runtime-memory, and output-handoff decision surface
- [x] implemented the full `10A / 10B / 10C` family

### Phase 10 CheckList

- [x] define the target graph-aware worker/preview routing scope
- [x] carry forward the locked family-level `[1.3]` decisions from roadmap/Codex notes
- [x] break `SP - Phase 10` into explicit working subphases
- [x] write down the first dedicated `10A` implementation-question block
- [x] set the minimum completion bar for `10A`
- [x] set the minimum completion bar for `10B`
- [x] set the minimum completion bar for `10C`
- [x] resolve the first-pass worker request/result contract
- [x] resolve viewer-target selection versus graph-local build truth
- [x] resolve the exact first-pass seam cut across `useAppStore`, build wiring, dispatcher, and viewer host
- [x] create the dedicated `10A`, `10B`, and `10C` task docs

### Phase 10 Working Breakdown
#### Fold Hack 5

##### Breakdown Notes

- `SP - Phase 10` should no longer be treated as one flat implementation chunk.
- Use the three-part split below as the working breakdown for future task docs and implementation order.
- The intended dependency order is:
  - `10A`
  - `10B`
  - `10C`

#### [x] `SP - Phase 10A - Graph-Aware Build Identity And Routing`

Working role:
- define the graph-aware request/result envelope
- route compile/build work by graph identity
- add stale-drop safety so one graph's build result cannot overwrite another graph

Minimum win condition:
- the worker/build path no longer behaves like there is only one active spaghetti graph
- requests and results are tagged strongly enough to isolate graph runtime state

Do not absorb yet:
- richer Browser output structure
- final output handoff modeling
- broader project-content hierarchy work

##### `10A` Decision CheckList

- [x] `10A.Q1` - What exact request envelope should leave the app shell for compile-only versus build requests?
- [x] `10A.Q2` - What exact result envelope must come back so wrong-graph and stale results can be dropped safely?
- [x] `10A.Q3` - Where should `buildSeq` truth live in the first pass?
- [x] `10A.Q4` - Which layer owns stale-drop enforcement in the first pass?
- [x] `10A.Q5` - What happens if editor focus or Browser focus changes while a graph build is in flight?
- [x] `10A.Q6` - Should `compileSpaghetti()` and `requestSpaghettiBuild()` remain shell entry points, or should `10A` replace them with graph-routed APIs?
- [x] `10A.Q7` - What is the minimum automated test bar that must pass before `10A` counts as real?

#### [x] `10A.Q1` - What exact request envelope should leave the app shell for compile-only versus build requests?

##### Why This Matters

- `10A` is mainly about routing identity, so the request shape has to be explicit before implementation starts
- otherwise compile/build calls can still hide one-active-graph assumptions behind shared shell helpers

##### Locked Answer

Use one shared graph-routed outer request envelope for both compile-only and build requests, with a required `requestKind` field to distinguish them.

Recommended first-pass request shape:

```ts
type GraphBuildRequestKind = 'compile' | 'build'

type GraphBuildRequestEnvelope = {
  requestKind: GraphBuildRequestKind
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  buildSeq: number
  payload: CompileRequestPayload | BuildRequestPayload
}
```

First-pass rule:
- both compile-only and build requests use the same outer routing envelope
- both must carry:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
  - `buildSeq`
- only the inner `payload` and `requestKind` differ

First-pass implementation defaults:
- `projectFileId` uses one synthetic runtime project id until `GE - Phase 12` introduces real project ownership
- compile uses the same graph-routed envelope shape but is handled locally in app/store routing
- build continues through worker dispatch behind the same routing contract

Why this is the right cut:
- routing identity stays identical for compile and build
- stale-drop logic does not split into two systems
- shared worker/service infrastructure can stay shared while runtime truth stays graph-local

#### [x] `10A.Q2` - What exact result envelope must come back so wrong-graph and stale results can be dropped safely?

##### Why This Matters

- `10A` is not real if the app cannot prove that an incoming result belongs to the graph and request that produced it
- result identity is the safety half of graph-aware routing

##### Locked Answer

Use one shared outer result envelope that echoes the full routing identity from the request.

Recommended first-pass result shape:

```ts
type GraphBuildResultKind = 'compile' | 'build'
type GraphBuildResultStatus = 'ok' | 'error' | 'partial'

type GraphBuildResultEnvelope = {
  resultKind: GraphBuildResultKind
  status: GraphBuildResultStatus
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  buildSeq: number
  diagnostics?: GraphDiagnostic[]
  payload?: CompileResultPayload | BuildResultPayload
}
```

First-pass acceptance rule:
- a result may be accepted only if:
  - `projectFileId` matches the current project runtime
  - `graphDocumentId` matches the target graph runtime bucket
  - `buildSeq` is still valid for that graph
  - `buildRequestId` matches the in-flight/latest request identity when checked

Important rule:
- partial and diagnostics-only results use the same acceptance rules
- wrong-graph results are rejected
- stale same-graph results are rejected

#### [x] `10A.Q3` - Where should `buildSeq` truth live in the first pass?

##### Why This Matters

- stale-drop logic is only as good as the source of truth for request ordering
- if `buildSeq` ownership is vague, routing and acceptance rules will be inconsistent across stores and dispatcher code

##### Locked Answer

`buildSeq` truth should live per graph in graph-local runtime state, not as one app-global sequence source.

Recommended first-pass graph runtime routing fields:

```ts
type GraphRoutingRuntimeState = {
  latestIssuedBuildSeq: number
  latestAcceptedBuildSeq: number | null
  inFlightBuildRequestId: string | null
  inFlightBuildSeq: number | null
}
```

Rule:
- `latestIssuedBuildSeq` is the primary stale-drop truth
- `latestAcceptedBuildSeq` is kept for accepted-result/runtime inspection truth
- dispatcher may mirror this state temporarily, but it is not the canonical owner

Why:
- this matches the already-locked ownership split:
  - `app-global` = shared worker/viewer shell
  - `project-local` = graph collection/lifecycle
  - `graph-local` = compile/build/runtime truth

#### [x] `10A.Q4` - Which layer owns stale-drop enforcement in the first pass?

##### Why This Matters

- the code already has several seams involved in build dispatch and result handling
- `10A` needs one clear owner for accepting or rejecting returned results

##### Locked Answer

Primary stale-drop enforcement should live in the request/result routing seam, with a second defensive guard in graph-local runtime setters.

First-pass ownership split:

Primary owner:
- result-handling / routing seam
- likely centered in:
  - `bootstrapBuildWiring.ts`
  - `buildDispatcher.ts`

Secondary defensive owner:
- graph-runtime write path in `useSpaghettiStore`

Rule:
- results are accepted/rejected at the routing seam
- graph-local setters must still refuse stale or wrong-target writes if called incorrectly

Why:
- keeps acceptance logic centralized
- protects graph-local truth from accidental misuse
- avoids spreading half-logic across app shell, viewer, Browser, and graph store

#### [x] `10A.Q5` - What happens if editor focus or Browser focus changes while a graph build is in flight?

##### Why This Matters

- graph-aware routing must stay tied to the original requested graph, not whichever graph becomes focused later
- otherwise focus changes would quietly reintroduce one-active-graph runtime behavior

##### Locked Answer

Rule:
- a build remains bound to the graph identity it was requested for, even if editor focus or Browser focus changes before the result returns
- request ownership follows `graphDocumentId`
- not focused viewport
- not focused Browser row
- not current viewer target

Practical result:
- if:
  - Graph A build starts
  - user switches editor focus to Graph B
  - user switches Browser focus
  - user swaps a viewport to another graph
- the returning result still belongs to Graph A and must write only into Graph A's runtime bucket

UI implication:
- a non-focused graph may still show:
  - in-flight build state
  - completed build state
- that is correct and should remain visible in Browser/runtime status later

#### [x] `10A.Q6` - Should `compileSpaghetti()` and `requestSpaghettiBuild()` remain shell entry points, or should `10A` replace them with graph-routed APIs?

##### Why This Matters

- these are the most obvious current singleton-shaped entry points
- `10A` needs a clear answer on whether they remain thin shell helpers or are replaced by graph-document-first APIs

##### Locked Answer

Keep them for one first-pass compatibility step as thin wrappers, but make the real canonical entry points graph-routed APIs.

Recommended canonical APIs:

```ts
compileGraphDocument(graphDocumentId: string): CompileResult
requestGraphDocumentBuild(graphDocumentId: string): CompileResult
```

Compatibility bridge:
- existing helpers may remain briefly as wrappers, but they must:
  - require or receive explicit `graphDocumentId`
  - forward directly into the graph-routed APIs
  - stop inferring one "current spaghetti graph" from singleton state

Rule:
- keep old names only as migration seams
- do not keep old singleton behavior
- keep synchronous compile-result returns in the first pass for UI compatibility

#### [x] `10A.Q7` - What is the minimum automated test bar that must pass before `10A` counts as real?

##### Why This Matters

- `10A` is mostly routing safety, so tests are the clearest proof that graph isolation actually works
- without an explicit test bar, it will be too easy to claim the phase is done while stale-drop gaps remain

##### Locked Answer

`10A` counts as real only if the routing safety behavior is proved by automated tests.

Minimum required test bar:
- wrong-graph result is rejected
- stale same-graph result is rejected
- two graphs can issue builds without overwriting each other's runtime state
- focus changes during an in-flight build do not rebind the result to the new focused graph
- viewport graph switch during an in-flight build does not rebind the result
- graph-runtime setter rejects stale direct writes
- compatibility wrappers forward explicit graph identity correctly

##### `10A` Readiness Note

`10A` should only be treated as implementation-ready when the dedicated task doc includes coverage for:
- wrong-graph result is rejected
- stale same-graph result is rejected
- concurrent graph isolation
- focus-change safety
- viewport-switch safety
- graph-runtime stale-write guard coverage
- wrapper forwarding coverage
- graph-routed compile requests handled locally
- graph-routed build requests handled through worker dispatch
- the replacement plan for the synthetic runtime `projectFileId` once `GE - Phase 12` lands

#### [x] `SP - Phase 10B - Graph-Local Preview And Build Memory`

Working role:
- finish moving compile/build/preview runtime buckets into graph-local ownership
- remove the last remaining one-global-preview / one-global-result assumptions
- keep the shared worker shell and shared viewer shell while routing graph-local state through them

Minimum win condition:
- each graph owns its own build/preview runtime memory bundle
- switching focus does not redefine runtime truth back into one global spaghetti bucket

Implementation note:
- accepted spaghetti build outputs now live in graph-local runtime state
- explicit `viewerTargetGraphDocumentId` now drives shared-viewer spaghetti reads
- `ViewerHost`, `PartsListPanel`, `DebugInspectorDrawer`, and `ViewToolbar` no longer depend on app-global spaghetti `parts` as canonical preview/build truth

Do not absorb yet:
- one-viewer-per-graph architecture
- richer later Browser row systems
- full project ownership migration

##### `10B` Decision CheckList

- [x] `10B.Q1` - Which exact current code seams must `10B` replace or reroute in the first implementation?
- [x] `10B.Q2` - What is the minimum first-pass request/result contract between the shared app shell, worker path, and graph-local runtime state?
- [x] `10B.Q3` - How should the shared viewer choose which graph-local preview bundle to show without collapsing build truth and view truth?
- [x] `10B.Q4` - What stale-drop and overwrite rules must be required for multi-graph build safety in the first pass?
- [x] `10B.Q5` - What should stay out of `10B` so it does not sprawl into later `AS`, `GE - Phase 12`, or `SP - Phase 11` work?
- [x] `10B.Q6` - What is the minimum automated test bar that must pass before `10B` counts as real?

#### [x] `10B.Q1` - Which exact current code seams must `10B` replace or reroute in the first implementation?

##### Why This Matters

- the family direction is already locked, but implementation will still drift if the first seam cut is vague
- `10B` needs to be explicit about which runtime-owning seams still behave like there is one global spaghetti bucket

##### Locked Answer

`10B` should reroute the seams that still behave like there is one global spaghetti runtime bucket, while leaving shared app shells and shared worker/viewer lifecycles intact.

First-pass seams to change:
- `src/app/store/useAppStore.ts`
  - stop owning the app-global spaghetti runtime bucket
  - remove or stop using:
    - `spaghettiLastCompile`
    - `spaghettiPreviousBuildInputs`
    - `spaghettiPendingChangedParamIds`
    - `spaghettiPendingStatsPartKeys`
    - `spaghettiPendingInstances`
    - any remaining one-bucket spaghetti preview/build state
  - old shell triggers may remain as wrappers, but runtime truth must move out
- `src/app/bootstrapBuildWiring.ts`
  - stop reading one implicit active spaghetti runtime path
  - route request/result handling through graph-keyed runtime access
  - become the main bridge from shared dispatch flow into graph-local runtime buckets
- `src/app/buildDispatcher.ts`
  - stop treating stale-drop and latest-request truth as one global spaghetti path
  - keep shared dispatch infrastructure, but key request/result handling by graph identity
  - do not write one app-global "current spaghetti result" bucket
- `src/app/components/ViewerHost.tsx`
  - stop reading one singleton spaghetti preview/render path
  - read from an explicit viewer target that resolves to one graph-local preview bundle
  - do not use focused graph/editor as implicit build truth

Seams that can stay shared:
- one app shell
- one worker lifecycle
- one viewer shell
- one Browser shell

First-pass rule:
- `10B` replaces global spaghetti runtime ownership, not shared infrastructure

#### [x] `10B.Q2` - What is the minimum first-pass request/result contract between the shared app shell, worker path, and graph-local runtime state?

##### Why This Matters

- `10B` should reuse the graph-aware routing contract from `10A` instead of inventing a second preview/build envelope
- graph-local runtime writes still need a clear minimum identity contract so wrong-target or stale writes can be rejected safely

##### Locked Answer

Use one shared outer request/result contract with graph routing identity, but keep it as small as possible.

Minimum first-pass request contract:

```ts
type GraphBuildRequestEnvelope = {
  requestKind: 'compile' | 'build'
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  buildSeq: number
  payload: CompileRequestPayload | BuildRequestPayload
}
```

Minimum first-pass result contract:

```ts
type GraphBuildResultEnvelope = {
  resultKind: 'compile' | 'build'
  status: 'ok' | 'error' | 'partial'
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  buildSeq: number
  diagnostics?: GraphDiagnostic[]
  payload?: CompileResultPayload | BuildResultPayload
}
```

Important rule:
- compile and build use the same outer routing contract
- result must echo enough identity to allow:
  - wrong-graph rejection
  - stale-result rejection
  - graph-local runtime writes

Not needed yet:
- do not add:
  - `assemblyId`
  - `objectId`
  - `partId`
  - explicit Browser-tree identity
  - richer `OutputPreview` routing tokens beyond graph identity plus request identity

#### [x] `10B.Q3` - How should the shared viewer choose which graph-local preview bundle to show without collapsing build truth and view truth?

##### Why This Matters

- the shared viewer can stay app-global, but what it renders must stop being treated as the owner of graph build truth
- `10B` needs an explicit presentation target so later Browser/editor behavior can evolve without rewriting runtime ownership again

##### Locked Answer

The shared viewer should use an explicit viewer target state, not raw editor focus and not build ownership.

Recommended first-pass viewer rule:

Use:

```ts
viewerTargetGraphDocumentId: string | null
```

as explicit view-selection state.

Why this is the right cut:
- editor focus is about where commands go
- Browser focus is about navigation/highlight
- build truth belongs to graph-local runtime state
- viewer selection is its own presentation decision

First-pass behavior:
- a graph may remain built even when it is not the current viewer target
- switching viewer target changes only what the shared viewer renders
- it does not change:
  - graph build truth
  - graph in-flight state
  - graph request ownership

Recommended default behavior:
- for the first pass, it is acceptable for viewer target to follow the focused editor viewport by default
- but it must do so through an explicit viewer-target setter/update rule, not through implicit ownership

That means:
- focus may update viewer target
- viewer target remains a separate state concept
- future Browser controls can override or extend that later without architectural rewrite

#### [x] `10B.Q4` - What stale-drop and overwrite rules must be required for multi-graph build safety in the first pass?

##### Why This Matters

- multi-graph preview/build memory is not real unless accepted results stay isolated per graph and stale results cannot overwrite newer truth
- `10B` needs the overwrite rule to stay explicit even though `10A` already established routing identity

##### Locked Answer

First-pass multi-graph safety requires graph-isolated request ordering and strict acceptance rules.

Required rules:
1. wrong-graph results are always rejected
   - a result tagged for Graph B can never write into Graph A runtime state
2. stale same-graph results are always rejected
   - if Graph A has already issued a newer request, an older returning result cannot overwrite Graph A runtime buckets
3. newer same-graph requests supersede older pending requests
   - first pass should use supersede, not explicit cancellation, as the rule
   - older requests may still finish, but their results are dropped if no longer current
4. acceptance should be based on per-graph routing truth
   - minimum per graph:
     - `latestIssuedBuildSeq`
     - `latestAcceptedBuildSeq`
     - `inFlightBuildRequestId`
     - `inFlightBuildSeq`
5. partial results may update only if they pass normal acceptance checks
   - a partial result is still subject to:
     - graph match
     - seq validity
     - request identity validity
6. accepted results may update only the runtime buckets that belong to that graph
   - no result may write into:
     - app-global singleton spaghetti state
     - another graph's runtime memory
     - viewer selection state directly as build truth

First-pass overwrite rule:
- a newer same-graph request does not need explicit cancellation in `10B`
- it only needs stale-drop-safe supersession

#### [x] `10B.Q5` - What should stay out of `10B` so it does not sprawl into later `AS`, `GE - Phase 12`, or `SP - Phase 11` work?

##### Why This Matters

- `10B` sits between completed `10A` routing identity and later `10C` output handoff
- the phase needs a clean stop line so it does not absorb Browser hierarchy, project ownership, or richer output structure work

##### Locked Answer

`10B` should stop at graph-local runtime memory, shared-viewer targeting, and multi-graph safety. It should not absorb output structure, Browser hierarchy growth, or project-ownership redesign.

Keep in scope for `10B`:
- graph-local compile/build memory finalization
- graph-local preview-prep / preview bundle ownership
- shared viewer reading from explicit graph-local preview bundles
- graph-aware stale-drop / overwrite safety
- removal of the last one-global spaghetti runtime assumptions

Keep out of scope:
- full `Project File` ownership growth
- `Component / Assembly / Object / Part` Browser-facing hierarchy
- richer Browser row controls and Browser UX polish
- build bars / build-control UI
- materials / visibility workspace systems
- one-viewer-per-graph architecture
- one-worker-per-graph architecture
- final `OutputPreview` / graph-output handoff semantics beyond what `10C` owns

Phase-boundary rule:
- `10A` = request/result routing identity
- `10B` = graph-local runtime memory and viewer-target separation
- `10C` = graph output declaration / handoff surface
- later `AS` = richer output structure
- later `SP 11` = Browser-facing hierarchy surface
- later `GE 12` = fuller project ownership structure

##### `10B` Locked Answers So Far

- `10B.Q1`
  - reroute `useAppStore.ts`, `bootstrapBuildWiring.ts`, `buildDispatcher.ts`, and `ViewerHost.tsx` away from one global spaghetti runtime bucket and toward graph-keyed runtime ownership, while keeping app shell, worker lifecycle, Browser shell, and viewer shell shared
- `10B.Q2`
  - use one minimal shared request/result contract carrying `requestKind`/`resultKind`, `projectFileId`, `graphDocumentId`, `buildRequestId`, and `buildSeq`, with no later output-structure ids added yet
- `10B.Q3`
  - the shared viewer should choose what to render through an explicit `viewerTargetGraphDocumentId` state, not by collapsing build truth into editor focus or Browser focus; a graph may remain built even when not currently viewed
- `10B.Q4`
  - require wrong-graph rejection, stale same-graph rejection, per-graph request ordering truth, same-graph supersession without mandatory cancellation, and graph-local-only runtime writes for accepted results
- `10B.Q5`
  - keep `10B` limited to graph-local runtime memory, explicit viewer targeting, and multi-graph overwrite safety; keep Browser hierarchy, project ownership growth, richer output structure, and build-control UI out of scope
- `10B.Q6`
  - `10B` counts as real only when automated tests prove that compile/build runtime memory and preview-preparation memory are isolated per graph, the shared viewer resolves its render source from explicit viewer-target state rather than singleton spaghetti state, and stale or wrong-graph results can no longer overwrite another graph's accepted runtime buckets

#### [x] `10B.Q6` - What is the minimum automated test bar that must pass before `10B` counts as real?

##### Why This Matters

- `10B` can look correct in manual usage while still leaking graph-local state back into one shared bucket
- a concrete proof bar prevents the phase from being marked done on architecture language alone

##### Locked Answer

`10B` counts as real only when automated tests prove that graph-local runtime memory is isolated per graph, the shared viewer reads from explicit viewer-target state instead of implicit singleton spaghetti state, and accepted request/result flow can no longer overwrite another graph's runtime buckets.

Minimum required test bar:
1. graph-local compile/build memory is isolated per graph
   - seed Graph A and Graph B
   - write compile/build runtime data into Graph A
   - assert Graph B runtime bundle is unchanged
   - repeat in reverse direction
   - this proves `10B` actually removed the one-global spaghetti runtime bucket
2. graph-local preview-preparation state is isolated per graph
   - seed Graph A and Graph B
   - update preview-prep / preview bundle state for Graph A
   - assert Graph B preview-prep state is unchanged
   - verify graph-local preview candidate lists and preview identity mappings do not bleed across graphs
   - this proves preview-prep ownership is graph-local, not app-global
3. shared viewer reads from explicit `viewerTargetGraphDocumentId`
   - seed graph-local preview bundles for Graph A and Graph B
   - set `viewerTargetGraphDocumentId = Graph A`
   - assert viewer selector resolves Graph A bundle
   - switch target to Graph B
   - assert viewer selector resolves Graph B bundle
   - this proves the viewer is no longer implicitly tied to one singleton spaghetti path
4. viewer targeting is separate from build truth
   - Graph A has accepted build/runtime data
   - Graph B is the current `viewerTargetGraphDocumentId`
   - assert viewer renders Graph B preview bundle
   - assert Graph A accepted runtime/build state remains intact and unchanged
   - this proves build truth and view truth are not collapsed together
5. a graph may remain built while not currently viewed
   - Graph A accepts build/runtime state
   - set viewer target to Graph B
   - assert Graph A still retains accepted compile/build/preview memory
   - assert Graph A is not cleared or re-authored just because it is no longer the current viewer target
   - this proves non-viewed graphs can remain built
6. wrong-graph results cannot overwrite another graph's runtime buckets
   - dispatch/accept a result tagged for Graph A
   - attempt to route/write it into Graph B path
   - assert Graph B runtime bundle does not change
   - assert only Graph A runtime bundle is eligible
   - this is the `10B`-side proof that graph-local runtime writes are still isolated correctly after `10A` routing
7. stale same-graph results cannot overwrite accepted graph-local runtime state
   - Graph A issues `seq 1`
   - Graph A issues `seq 2`
   - `seq 2` becomes accepted runtime truth
   - `seq 1` arrives later
   - assert `seq 1` does not overwrite:
     - compile/build memory
     - preview-prep memory
     - accepted preview bundle
   - this proves graph-local runtime buckets obey stale-drop rules instead of `last write wins`
8. same-graph newer request supersedes older pending state without requiring explicit cancellation
   - Graph A issues `seq 1` then `seq 2`
   - assert runtime tracks `seq 2` as latest issued/in-flight truth
   - late `seq 1` may still arrive
   - assert `seq 1` is dropped without needing explicit cancellation machinery
   - this locks the first-pass supersede rule
9. accepted partial results obey the same graph/seq acceptance rules
   - send a partial result for the correct graph and current seq
   - assert allowed preview/build runtime buckets update only if acceptance passes
   - send a stale or wrong-graph partial result
   - assert it is rejected
   - this proves partial results do not bypass routing safety
10. `useAppStore` no longer acts as canonical owner of one global spaghetti runtime bucket
    - assert selectors / state writes for spaghetti compile/build memory now resolve through graph-keyed runtime state
    - assert old one-bucket runtime fields are removed, unused, or no longer canonical
    - verify writes happen through graph-local storage paths instead
    - this is the seam-level proof that `10B` actually completed the ownership move
11. `ViewerHost` no longer resolves preview/render state from one singleton spaghetti path
    - mount/select viewer VM with multiple graph-local preview bundles available
    - assert output depends on explicit viewer target
    - assert focused editor alone does not silently redefine viewer truth unless it updates viewer target through the explicit rule
    - this proves the viewer seam was really rerouted

Minimum acceptance statement:
- `10B` is complete only if tests prove all of the following:
  - compile/build runtime memory is graph-local
  - preview-prep / preview bundle state is graph-local
  - the shared viewer reads from explicit viewer-target state
  - view truth stays separate from build truth
  - wrong-graph and stale same-graph results cannot overwrite graph-local runtime state
  - same-graph newer requests supersede older pending requests safely
  - old one-global spaghetti runtime seams are no longer canonical

#### [x] `SP - Phase 10C - Graph Output Handoff Surface`

Working role:
- treat `OutputPreview` as the graph's output declaration / handoff surface
- define the minimum graph-owned output surface needed for later Browser/project visibility
- stop at handoff semantics instead of full later output hierarchy

Minimum win condition:
- `OutputPreview` is no longer treated only as a local visual node
- each graph has a real output declaration surface that can hand upward into later systems

Do not absorb yet:
- full `Component / Assembly / Object / Part` structure
- later output organization/polish
- Browser workspace feature growth outside the minimal handoff seam

##### `10C` Question CheckList

- [x] `10C.Q1` - What exact graph-owned output declaration shape should `10C` publish from `OutputPreview` in the first pass?
- [x] `10C.Q2` - Does `OutputPreview` node state remain the authored source of truth while `10C` derives a separate published output surface, or does `10C` rewrite output truth directly into graph runtime state?
- [x] `10C.Q3` - What identity must each published output entry carry for later Browser/project handoff without dragging full `assembly / object / part` structure into `10C`?
- [x] `10C.Q4` - How should empty, unresolved, and resolved output slots be represented in the first-pass graph output surface?
- [x] `10C.Q5` - Which current code seams actually change in `10C`, and which should stay owned by completed `10B` or later `AS / GE - Phase 12` work?
- [x] `10C.Q6` - What is the minimum automated proof bar that must pass before `10C` counts as real?
- [x] `10C.Q7` - What must stay out of `10C` so it does not collapse into full Browser hierarchy, output-structure, or project-ownership work?

#### [x] `10C.Q1` - What exact graph-owned output declaration shape should `10C` publish from `OutputPreview` in the first pass?

Answer:

`10C` should publish one graph-owned `outputSurface` object with minimal graph-level metadata plus one entry per declared output slot.

Recommended first-pass shape:

```ts
type GraphOutputSurface = {
  graphDocumentId: string;
  publishedAtBuildSeq: number | null;
  surfaceVersion: number;

  entries: GraphPublishedOutputEntry[];
};

type GraphPublishedOutputEntry = {
  outputEntryId: string;
  slotId: string;
  sourceNodeId: string;

  label: string;
  state: 'empty' | 'unresolved' | 'resolved';

  acceptedArtifactKey: string | null;
  diagnosticsState?: 'none' | 'hasDiagnostics' | 'unknown';
};
```

Why this is the right cut:
- stronger than a raw `publishedOutputs[]` list
- still smaller than later Browser/project hierarchy
- gives later systems one canonical graph-owned handoff object to read
- preserves slot-oriented declaration meaning instead of flattening everything into only resolved artifacts

First-pass rule:
- publish one graph-owned output surface per graph
- each declared slot becomes one published entry
- keep graph-level metadata minimal:
  - `graphDocumentId`
  - `publishedAtBuildSeq`
  - `surfaceVersion`

#### [x] `10C.Q2` - Does `OutputPreview` node state remain the authored source of truth while `10C` derives a separate published output surface, or does `10C` rewrite output truth directly into graph runtime state?

Answer:

`OutputPreview` node state should remain the authored source of truth, and `10C` should derive a separate graph-owned published output surface from:
- authored graph/node state
- accepted graph-local build outputs
- graph-local preview/output readiness state

Rule:
- authored declaration intent stays with the graph/node layer
- published output surface is a derived graph-owned handoff object
- do not rewrite authored output declaration truth directly into an opaque runtime-only replacement

Why this is the right first pass:
- keeps authored declaration explicit
- avoids over-promoting runtime-only state into the new source of truth
- gives later Browser/project systems a stable handoff object
- keeps the authored-versus-published split clean

Plain-English rule:
- `OutputPreview` still says what the graph means to publish
- `10C` adds the graph-owned object that says what is currently published from that declaration

#### [x] `10C.Q3` - What identity must each published output entry carry for later Browser/project handoff without dragging full `assembly / object / part` structure into `10C`?

Answer:

Each published output entry should carry slot-scoped graph-output identity, not later hierarchy ids.

Recommended first-pass entry identity:

```ts
type GraphPublishedOutputEntry = {
  outputEntryId: string;
  slotId: string;
  sourceNodeId: string;
  label: string;

  state: 'empty' | 'unresolved' | 'resolved';

  acceptedArtifactKey: string | null;
};
```

Identity rule:
- minimum required identity:
  - `outputEntryId`
  - `slotId`
  - `sourceNodeId`
- optional but useful:
  - `acceptedArtifactKey`

Why this is the right cut:
- stable enough for:
  - UI diffing
  - later Browser/project handoff
  - selector identity
- does not force:
  - `assemblyId`
  - `objectId`
  - `partId`

Recommended identity strategy:
- `outputEntryId` should be graph-output-entry-scoped, derived from graph + source node + slot identity, rather than from accepted artifact identity alone
- that keeps entry identity stable even when a slot is unresolved or temporarily empty

#### [x] `10C.Q4` - How should empty, unresolved, and resolved output slots be represented in the first-pass graph output surface?

Answer:

The first-pass graph output surface should publish all declared slots, with explicit entry state.

Required states:
- `empty`
- `unresolved`
- `resolved`

Recommended first-pass entry shape:

```ts
type GraphPublishedOutputEntry = {
  outputEntryId: string;
  slotId: string;
  sourceNodeId: string;

  label: string;
  state: 'empty' | 'unresolved' | 'resolved';

  acceptedArtifactKey: string | null;
  diagnosticsState?: 'none' | 'hasDiagnostics' | 'unknown';
};
```

Rules:
- `empty`
  - slot is declared but has no bound/resolved output yet
- `unresolved`
  - slot is declared and intended, but current accepted runtime/build state cannot resolve it
- `resolved`
  - slot is declared and currently maps to accepted graph-local output

Why this is the right cut:
- later systems should not need to reconstruct output intent from graph edges again
- publishing all declared slots preserves declaration truth even before resolution succeeds

Diagnostics rule:
- first pass may keep diagnostics inline at entry level in a minimal form
- do not turn `10C` into a broader diagnostics architecture

#### [x] `10C.Q5` - Which current code seams actually change in `10C`, and which should stay owned by completed `10B` or later `AS / GE - Phase 12` work?

Answer:

`10C` should add one canonical graph-owned output handoff seam and reroute current output-facing read surfaces to it, while leaving viewer-target ownership in `10B` and Browser/project hierarchy in later phases.

Primary seams to change in `10C`:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - add graph-owned output surface state
  - add selectors/actions to derive/store published output entries per graph
- `src/app/spaghetti/previewPreparation.ts`
  - stop being the implicit long-term owner of graph publication meaning
  - may still contribute source data, but should not remain the publication seam
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - continue to own viewer render-VM concerns
  - do not keep acting like the only place where output meaning is inferred
- `src/app/spaghetti/partsList/selectPartsListItems.ts`
  - reroute current spaghetti output-oriented read models to the canonical graph-owned output surface where appropriate
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
  - expose/inspect graph-owned output declaration state instead of only viewer-preview-oriented runtime data

Seams that stay owned by `10B`:
- `ViewerHost.tsx`
  - explicit viewer-target ownership
  - viewer-target-following render reads
  - shared presentation state
  - visibility
  - selection
  - current viewer target

Seams that stay deferred:
- Browser hierarchy readers
- project composition readers
- `Component / Assembly / Object / Part` structure
- `GE - Phase 12` project ownership growth

Working seam rule:
- `10C` adds one canonical graph-owned output handoff seam and reroutes output-facing read models to it
- `10C` does not reopen viewer-target ownership and does not build Browser hierarchy

#### [x] `10C.Q6` - What is the minimum automated proof bar that must pass before `10C` counts as real?

Answer:

`10C` counts as real only when tests prove that graph-owned output declaration is distinct from viewer-target presentation and distinct from raw runtime build memory.

Minimum required test bar:
1. Graph output surfaces are isolated per graph
   - `Graph A` and `Graph B` both declare output slots
   - updating `Graph A` output surface does not mutate `Graph B` output surface
2. Declared slots publish into graph-owned output surfaces
   - authored `OutputPreview` slot declarations produce graph-owned published entries
   - entries exist even before full resolution
3. Empty, unresolved, and resolved states are represented correctly
   - declared-but-empty slot -> `empty`
   - declared-but-unresolved slot -> `unresolved`
   - declared-and-resolved slot -> `resolved`
4. Accepted build-output changes update only the correct graph's output surface
   - accepted runtime change for `Graph A` updates only `Graph A` published entries
   - `Graph B` remains unchanged
5. Viewer-target changes do not rewrite graph output declaration truth
   - switch `viewerTargetGraphDocumentId`
   - assert published output surface for each graph remains unchanged
6. Published output entries are readable without singleton viewer-preview reconstruction
   - parts/debug/output read selectors can consume graph-owned output surface directly
   - they do not need to reconstruct publication ad hoc from one viewer-preview path
7. Wrong-graph or stale writes cannot overwrite another graph's output surface
   - stale/wrong-graph runtime update is rejected
   - published output surface remains correct
8. First-pass output declaration remains minimal
   - tests confirm no required dependency on:
     - `assemblyId`
     - `objectId`
     - `partId`

Minimum acceptance statement:
- `10C` is complete only if tests prove all of the following:
  - each graph owns a stable published output surface
  - slot states are represented explicitly
  - accepted runtime changes update only the correct graph
  - viewer-target changes do not redefine graph publication truth
  - current output-facing readers can consume the graph-owned output surface directly
  - stale and wrong-graph writes are rejected
  - the first-pass contract stays minimal

#### [x] `10C.Q7` - What must stay out of `10C` so it does not collapse into full Browser hierarchy, output-structure, or project-ownership work?

Answer:

`10C` should stop once each graph has a real graph-owned output declaration / handoff surface that later systems can consume.

Keep in scope:
- graph-owned output declaration surface
- first-pass published output entry shape
- slot-state representation
- graph-owned handoff selectors/read models
- rerouting output-oriented read surfaces away from ad hoc preview-only meaning

Keep out of scope:
- full `Component / Assembly / Object / Part` structure
- Browser hierarchy growth
- Browser row UX / Browser workspace controls
- project ownership growth
- `Project File` composition rules
- one-viewer-per-graph or one-worker-per-graph architecture
- richer materials / visibility workspace behavior
- later `AS` output organization, naming, and sub-part structure
- final export packaging semantics

Phase-boundary rule:
- `10A` = routing identity
- `10B` = graph-local preview/build memory
- `10C` = graph-owned output declaration / handoff
- later `AS` = richer Browser-facing output structure
- later `GE - Phase 12` = project ownership and composition

Clean locked answers:
- `10C.Q1`
  - use a graph-owned `outputSurface` object with minimal graph-level metadata and one published entry per declared output slot
- `10C.Q2`
  - keep `OutputPreview` node state as the authored declaration source of truth, and derive a separate graph-owned published output surface from authored graph state plus accepted graph-local runtime outputs
- `10C.Q3`
  - each published entry should carry stable slot-scoped identity: `outputEntryId`, `slotId`, and `sourceNodeId`, with optional accepted artifact identity, but no later hierarchy ids
- `10C.Q4`
  - publish all declared slots in the first pass, with explicit entry states for `empty`, `unresolved`, and `resolved`, plus optional minimal inline diagnostics state
- `10C.Q5`
  - change `useSpaghettiStore`, output-oriented selectors, and output-facing read surfaces to consume one canonical graph-owned output surface; keep viewer-target ownership in `10B` and Browser/project hierarchy in later phases
- `10C.Q6`
  - minimum proof bar: graph-isolated output surfaces, correct slot-state representation, graph-correct runtime-to-output updates, viewer-target independence, direct read-surface consumption of graph-owned output surface, stale/wrong-graph write rejection, and minimal-contract verification
- `10C.Q7`
  - keep `10C` limited to graph-owned output declaration / handoff only; keep Browser hierarchy, project ownership, richer output structure, and later UI/polish work out of scope

### Phase 10 Planning Questions
#### Fold Hack 5

##### Planning Notes

- Use this as the active question list for `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`.
- Do not reopen the already-locked family direction unless a later contradiction is found in code.
- Questions here should stay implementation-facing:
  - request/result identity
  - graph-local runtime ownership
  - shared viewer/worker routing
  - first-pass seam cuts
- Keep later Browser hierarchy, project ownership, and richer output organization out of this section.

##### Family-Level Direction Already Locked

Locked direction:
- `SP - Phase 10` owns routing and graph-local preview/build ownership
- it should break one-preview / one-assembled / one-global-result assumptions
- later `AS` work owns richer Browser-facing output structure

Locked minimum routing identity:
- compile/build requests should carry:
  - `projectFileId`
  - `graphDocumentId`
  - `buildSeq` or `buildRequestId`

Locked ownership split:
- `app-global`
  - shared workspace shell
  - shared viewer shell
  - shared worker lifecycle
- `project-local`
  - project/Browser graph collection and higher-level organization
- `graph-local`
  - compile/build memory
  - preview/output memory
  - graph output declaration/handoff memory

Locked build-vs-view rule:
- `generate/build on/off` belongs to graph/project/build truth
- `view on/off` belongs to viewer/Browser truth
- those controls must not collapse into one toggle

Locked working split:
- `[1.3A]`
  - graph-aware build identity and routing
- `[1.3B]`
  - graph-local preview and build memory
- `[1.3C]`
  - graph output declaration / handoff surface through `OutputPreview`

##### Subphase Readiness CheckList

- [x] `10A` is clear enough to justify a dedicated task doc
- [x] `10B` is clear enough to justify a dedicated task doc
- [ ] `10C` is clear enough to justify a dedicated task doc

## [x] - SP - Phase 11 - `Graphs Panel And Nested Parts`

Human Summary: This phase ships the first honest Browser hierarchy tree for graph-owned publication: the Browser now shows `Graph Documents` as expandable rows, derives one thin published-output child level from each graph's `GraphOutputSurface`, and keeps graph-row state aligned with open/focused editor viewport status without collapsing into full project-content or Browser-workspace behavior.

### Phase 11 Overview
#### Fold Hack 4

##### Phase Notes

This phase was the final Browser-foundation cut inside Lane `[1]` before shared viewport composition.

It is the Browser-surface follow-up after:
- `SP - Phase 9`
- `SP - Phase 10`
- `GE - Phase 12`

The planning surface below remains as the historical decision record for the shipped first-pass Browser hierarchy cut.

##### Phase Summary

Current shipped understanding:
- the Browser now has a real `Graph Documents` branch under `Project`
- graph rows are expandable and show one thin child-output level
- those child rows are published graph output rows derived from `GraphOutputSurface`
- open/focused graph state stays visible on the graph rows
- the phase deliberately stops before:
  - fuller project-content nesting
  - Browser workspace controls
  - deeper `Assembly / Component / Object / Part` structure

##### Small Achievements

- [x] promoted `SP - Phase 11` from a placeholder to an active planning surface
- [x] added and locked a first-pass question list for `[1.5]`
- [x] resolved the first-pass Browser row model
- [x] resolved the first-pass graph-row versus output-row structure
- [x] resolved the first implementation row-action boundary
- [x] created the dedicated `SP - Phase 11` task doc
- [x] implemented the first shipped Browser hierarchy cut

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
- [x] Q6 - What should stay out of `SP - Phase 11` so it does not sprawl into later `AS`, `VR`, or `GE` work?
- [x] Q7 - What exact child-row unit should appear under graph rows in the first `SP - Phase 11` pass?
- [x] Q8 - Which store owns the first child-output Browser rows in `SP - Phase 11`?

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
- one thin child-output level appears under expanded graph rows
- the Browser clearly reflects which graph is open and focused
- the row structure is built as a tree so later `Component / Object / Part` depth can grow without redesigning the Browser layout

##### Do Not Require Yet

- full project-file ownership
- full project-content nesting
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
  - the Browser is now a real hierarchy tree for graph documents and their first thin child-output rows, not just a place to open graphs

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
- but the first `SP - Phase 11` Browser pass should not try to render the full real `Project Content` branch yet

##### Recommended First-Pass Decision

- in the first Browser hierarchy pass, graph rows remain the primary real tree rows
- the Browser should establish the `Graph Documents` side of the target hierarchy first
- `Project` can exist as the top shell/container
- `Graph Documents` should be the first real content branch under that shell
- graph rows should expand to one thin graph-owned child-output level in the first pass
- that child level should stay graph-authored and graph-scoped rather than becoming full project-content nesting under the graph row

##### Why This Is The Best Cut

- it preserves the correct long-term target instead of changing it
- it gives `[1.5]` a real Browser hierarchy win without forcing final project-content structure decisions too early
- it prevents `SP - Phase 11` from absorbing:
  - `GE - Phase 12` project ownership work
  - `[2.2]` Browser-facing output structure work
- it keeps the first hierarchy pass aligned with what the app already has today:
  - `Project`
  - graph list/tree surface
  - graph-owned output surfaces
  - open/focused viewport state

##### What This Leaves For Later

- full `Project Content` as a richer Browser branch
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
  - but only build the `Project -> Graph Documents -> Graph rows -> first graph-owned output rows` side in the first `SP - Phase 11` pass

#### [x] Q3 - How deep should nested output display go in the first pass?

##### Why This Matters

- the first pass needs enough nesting to prove the hierarchy model
- but too much depth too early could pull in later `AS` structure work

##### Working Read

- recommended first-pass nested output depth:
  - one child-output level under each graph row
- the first `SP - Phase 11` pass should render visible child-output rows
- that means the first real Browser depth should stop at:
  - `Project`
    - `Graph Documents`
      - `Graph A`
        - `Output`
      - `Graph B`
        - `Output`
      - `Graph C`
        - `Output`
- if the Browser also shows utility branches such as `Open Viewports`, treat those as coordination/runtime branches, not output hierarchy

##### Working Notes

- this keeps `SP - Phase 11` aligned with the updated first-pass decision from `Q2`
- it proves the Browser hierarchy with one real expandable child level without half-implementing:
  - `Assembly`
  - `Object`
  - `Part`
  - richer project-content nesting
- deeper visible output/content depth should continue later under the phases that already own that work:
  - fuller `GE - Phase 12` project-content read surfaces
  - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- plain-English rule:
  - first make the Browser real as a graph-document tree with one honest child-output row level
  - add deeper content/output depth later

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
- recommended first-pass child-row actions:
  - no independent heavy action surface
  - child rows may be clickable for lightweight reveal/open-context behavior later, but the first pass should prioritize readability over action density
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
  - first-pass graph rows should mainly be open/focus rows with clear state, and child rows should mostly prove hierarchy rather than become mini toolbars

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

#### [x] Q6 - What should stay out of `SP - Phase 11` so it does not sprawl into later `AS`, `VR`, or `GE` work?

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

- what is already established in the tracked docs:
  - this phase was only promoted to a question-driven planning surface so the first real Browser hierarchy pass could be clarified before a task doc or implementation
  - the roadmap already carries an explicit defer map from `[1.5] SP - Phase 11` into later Browser workspace, output-structure, build-control, visibility/material, and workspace-presentation phases
  - `Q2` through `Q5` already narrowed the first pass to:
    - `Project -> Graph Documents -> Graph rows -> first child-output rows`
    - one thin graph-owned child-output level
    - simple open/focus state on graph rows
    - lightweight Browser/editor sync instead of a full selection/reveal system
- what that means `SP - Phase 11` already did in planning:
  - defined the first Browser tree as a graph-document hierarchy surface, not a full content tree
  - explicitly deferred deeper content/output structure to later `AS`
  - explicitly deferred richer Browser controls and visibility/material workspace behavior to later `VR`
  - explicitly deferred fuller project/content ownership to later `GE - Phase 12`
- what is still left to lock in `Q6`:
  - convert those carried-forward deferrals into one final explicit out-of-scope answer block
  - name the exact later homes for each deferred cluster in one place:
    - `AS`
      - deeper Browser-facing output/content structure
    - `VR`
      - richer row controls, build bars, visibility/material/reference behavior, and workspace presentation
    - `GE - Phase 12`
      - fuller `Project File` / graph-document / project-content ownership rules
  - make the stop line explicit enough that `[1.5]` can justify its own task doc without reopening later Browser/workspace phases

Locked answer:
- keep out of `SP - Phase 11`:
  - project ownership foundations:
    - `Project File`
    - graph collection ownership
    - project-derived content hierarchy
  - fuller project-content nesting under:
    - `Assembly`
    - `Component`
    - `Object`
    - `Part`
  - Browser branches that reorganize project-owned content beyond the first thin graph-owned published output rows
  - richer Browser row controls:
    - context menus
    - rename
    - delete
    - duplicate-on-row
    - view/generate toggles
    - build bars
    - visibility/material controls
  - Browser-driven shared viewer composition authoring and richer Browser-to-viewer coordination polish
  - detached-window behavior
  - viewer reveal/isolate systems and separate Browser selection models
- later homes:
  - `GE - Phase 12`
    - `Project File`
    - graph collection ownership
    - project-content ownership foundations
  - later `AS` phases
    - deeper Browser-facing output structure
    - final visible nesting/presentation of:
      - `Component`
      - `Object`
      - `Part`
      - `Assembly`
  - `[2.1] VR / SP`
    - richer Browser workspace shell and row interaction behavior
  - `[2.2] AS - Phase 5`
    - deeper Browser-facing output/content structure
  - `[2.3] AS - Phase 6`
    - build-status and build-control row surfaces
  - `[2.5] VR - Phase 6`
    - visibility/material/reference controls
  - `SP - Phase 12`
    - shared viewer composition
    - multi-viewport composition
  - `SP - Phase 13`
    - multi-window editing
- plain-English rule:
  - `SP - Phase 11` creates a Browser tree, not the full Browser workspace

#### [x] Q7 - What exact child-row unit should appear under graph rows in the first `SP - Phase 11` pass?

##### Why This Matters

- once the first pass includes one child-output level, the phase needs one explicit row unit
- without this, the Browser can drift into:
  - project components
  - object/part rows
  - mixed graph-owned and project-owned children under the same graph row

##### Working Read

- likely candidates now that `GE - Phase 12` exists:
  - graph-owned output surface entries
  - project-owned component rows
  - placeholder output summary rows derived from graph publication

Locked answer:
- the first child-row unit under graph rows should be:
  - published graph output rows
- those rows should represent:
  - `GraphPublishedOutputEntry`
- and should be derived from each graph document's:
  - `GraphOutputSurface`
- that means:
  - the Browser can show:
    - `Project`
      - `Graph Documents`
        - `Graph A`
          - `Published Output 1`
          - `Published Output 2`
  - published graph output rows stay graph-scoped in the first pass
- do not use as the first child-row unit:
  - full project-owned component rows
  - object rows
  - part rows
- why this is the right cut:
  - it gives `SP - Phase 11` one honest child-output level
  - it keeps graph-authored output structure separate from project-level placement
  - it avoids collapsing `SP - Phase 11` into the later `Component / Object / Part` work
- plain-English rule:
  - expand graphs to show what each graph publishes, not yet how the project fully nests that content

#### [x] Q8 - Which store owns the first child-output Browser rows in `SP - Phase 11`?

##### Why This Matters

- `SP - Phase 11` needs one clear read boundary for the new child rows
- without this, the Browser can accidentally mix:
  - graph-owned publication truth
  - project-owned content truth
  - convenience UI state

##### Working Read

- likely candidate seams:
  - `useSpaghettiStore`
    - graph output surfaces
  - `useAppStore`
    - project content tree
  - some mixed Browser-only derived row state

Locked answer:
- the first published graph output rows in `SP - Phase 11` should read from:
  - graph-owned output surfaces in `useSpaghettiStore`
- specifically:
  - `GraphOutputSurface`
- Browser UI state such as expanded/collapsed graph rows should remain:
  - workspace / Browser UI state
- `useAppStore` project content should remain:
  - a separate project-content read seam
  - not the primary source of truth for graph-row child rows in the first pass
- Browser row expansion/open state remains UI/workspace state, but the child-row content itself should come from graph-owned publication truth
- why this is the right cut:
  - it keeps graph output rows honest under graph rows
  - it avoids merging project placement semantics into the graph branch too early
  - it leaves `GE` and later `AS` phases room to deepen project-content Browser structure without rewriting the graph branch again
- plain-English rule:
  - graph rows come from the graph store
  - project rows come from the project store
  - `SP - Phase 11` only implements the first half

### Phase 11 CheckList

- [x] create the first question-driven planning surface for `[1.5]`
- [x] define the minimum first-pass Browser surface
- [x] define graph-row versus output-row structure
- [x] define first-pass nested output depth
- [x] define first-pass row actions and focus rules
- [x] define what stays out of scope
- [x] define the exact first child-row unit
- [x] define the Browser truth boundary for first child rows
- [x] convert the answered planning surface into a dedicated task doc
- [x] implement the first Browser hierarchy tree with published graph output rows

## [x] - SP - Phase 12 - `Shared Viewport Composition`

Human Summary: This phase now ships the first honest shared viewport composition seam: graph-document membership is runtime-owned in `useSpaghettiStore`, editor viewports explicitly join or leave the shared composition, and the shared viewer can render resolved preview contributions from more than one graph without falling back to focus as truth.

### Phase 12 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `SP` phase.

This phase sits after:
- `SP - Phase 11`
- `GE - Phase 12`

It should only be shaped once:
- Browser graph/project ownership is honest enough to support multi-surface viewport behavior
- cross-graph ownership no longer depends on active-graph singleton assumptions

##### Phase Summary

Current working understanding:
- this phase should define the first real shared viewport composition behavior
- it should explain how multiple viewport surfaces coordinate without collapsing back into one implicit viewer/editor path
- it should stay narrower than later multi-window editing and later debug/polish work

##### Active Question Surface

- [x] `12.Q1` - What does `shared viewport composition` actually mean in the first pass of `SP - Phase 12`?
- [x] `12.Q2` - Which viewport/surface types participate in the first composition cut?
- [x] `12.Q3` - What state owns composed viewport membership, target, and coordination truth?
- [x] `12.Q4` - What minimum visible behavior makes `SP - Phase 12` count as real?
- [x] `12.Q5` - What should stay out of `SP - Phase 12` so it does not sprawl into `SP - Phase 13`, `SP - Phase 14`, or later Browser/workspace phases?
- [x] `12.Q6` - What is the exact first-pass composition unit in `SP - Phase 12`?
- [x] `12.Q7` - How should the user author shared composition membership in the first pass?
- [x] `12.Q8` - What exact render rule should the shared viewer use for participating members?
- [x] `12.Q9` - What is the fallback/default behavior when no shared composition session exists yet?

#### [x] `12.Q1` - What does `shared viewport composition` actually mean in the first pass of `SP - Phase 12`?

##### Why This Matters

- the phase title is still broader than the actual likely first cut
- if this is not defined first, the phase can sprawl into:
  - Browser workspace behavior
  - multi-window graph editing
  - later viewer/debug polish

##### Working Read

- the first pass should probably mean:
  - one workspace can coordinate more than one viewport surface intentionally
  - those surfaces can share a coherent composition target or target set
  - composition truth should not depend on whichever editor or viewer happens to be focused

Locked answer:
- first-pass `shared viewport composition` should mean:
  - one shared viewer composition model can intentionally include more than one graph document at the same time
  - one or more editor viewports can participate in that composition without owning it
  - the composed result shown in the shared viewer is driven by explicit composition membership, not by whichever viewport is focused
- first pass should count as:
  - one honest workspace-level composition seam above single-graph viewer targeting
- first pass should not mean:
  - every viewport surface in the app becomes fully composable
  - detached multi-window orchestration
  - final Browser/content interaction behavior
- plain-English rule:
  - let multiple graph surfaces feed one intentional shared viewer composition without using focus as truth

##### Working Notes

- plain-English rule:
  - define the first honest multi-viewport composition seam, not every future viewport feature

#### [x] `12.Q2` - Which viewport/surface types participate in the first composition cut?

##### Why This Matters

- `SP - Phase 12` should not assume every viewport-like surface belongs in the first implementation
- the first pass needs a narrow surface set or it will absorb later workspace work

##### Working Read

- likely first-pass surfaces to consider:
  - shared viewer viewport
  - graph/editor viewports
- likely out of first pass unless later evidence says otherwise:
  - detached windows
  - debug-only surfaces
  - Browser-only interaction shells

Locked answer:
- first-pass participating surfaces should be:
  - the shared viewer viewport
  - normal graph/editor viewports that are already graph-document-bound
- first-pass participating authored units should be:
  - graph documents, referenced through explicit viewport/workspace composition membership
- keep out of the first cut:
  - detached/separate windows
  - Debug Inspector and other debug-only surfaces
  - Browser-only shells that do not render composition
  - later special-purpose view layers or reference-asset workspaces
- plain-English rule:
  - first make existing editor viewports and the shared viewer cooperate; do not widen the surface set yet

##### Working Notes

- plain-English rule:
  - include only the surfaces required to make shared composition real

#### [x] `12.Q3` - What state owns composed viewport membership, target, and coordination truth?

##### Why This Matters

- this is the ownership question for `SP - Phase 12`
- without this answer, composition can collapse back into:
  - `activeGraphDocumentId`
  - `viewerTargetGraphDocumentId`
  - focused viewport convenience state

##### Working Read

- likely first-pass ownership questions:
  - is composition membership viewport-authored, workspace-authored, or spaghetti-store-authored?
  - how does composition target state differ from focus state?
  - what ids must be explicit so composition does not depend on labels or focus?

Locked answer:
- first-pass composition truth should be workspace/runtime-owned in the spaghetti coordination layer
- it should not be graph-authored truth
- it should not be project-content truth
- it should not be derived from:
  - `activeGraphDocumentId`
  - `viewerTargetGraphDocumentId`
  - focused editor viewport state
- first-pass composition state should explicitly carry:
  - composition session or shared-composition id
  - participating graph document ids
  - shared viewer composition identity
- focus state may influence convenience actions, but it must not redefine composition membership
- plain-English rule:
  - focus can point at composition; focus cannot be composition

##### Working Notes

- plain-English rule:
  - lock the truth boundary before choosing UI behavior

#### [x] `12.Q4` - What minimum visible behavior makes `SP - Phase 12` count as real?

##### Why This Matters

- recent structural phases were necessary, but `SP - Phase 12` should cash some of that into visible workspace behavior
- this answer decides whether the phase is worth keeping as one phase or should split

##### Working Read

- likely proof targets:
  - more than one viewport can participate in one intentional composition model
  - composition state stays coherent when focus changes
  - the result is visible to the user as a real workspace behavior, not only hidden store plumbing

Locked answer:
- `SP - Phase 12` should count as real when:
  - the user can compose more than one graph document into one shared viewer result
  - that composition remains stable when editor focus changes
  - the user can tell which graph viewports are participating in the shared composition
  - adding or removing a participating graph changes the visible composed result
- first-pass proof should be visible in the workspace as:
  - one shared viewer showing composed participation from multiple graph viewports/documents
  - simple membership/state cues, not only hidden store data
- plain-English rule:
  - this phase should make multi-graph viewport coordination visible and trustworthy

##### Working Notes

- plain-English rule:
  - this phase should make the app feel more multi-surface, not just more abstract

#### [x] `12.Q5` - What should stay out of `SP - Phase 12` so it does not sprawl into `SP - Phase 13`, `SP - Phase 14`, or later Browser/workspace phases?

##### Why This Matters

- this is the guardrail question
- it decides whether `SP - Phase 12` needs subphases or can stay as one narrow phase

##### Working Read

- likely keep out for now:
  - full multi-window graph editing
  - deeper Browser workspace interaction systems
  - later debug/polish and presentation work
  - richer output/content hierarchy behavior already deferred to later lanes

Locked answer:
- keep out of `SP - Phase 12`:
  - full detached multi-window graph editing
  - later Browser selection/reveal/action systems
  - deeper Browser-facing output/content hierarchy work
  - debug-inspector expansion and later debug polish
  - final workspace presentation/layout systems
  - richer visibility/material/reference workspace behavior
  - later publish/receive workflow UX
- likely later homes:
  - `SP - Phase 13`
    - detached and broader multi-window editing behavior
  - `SP - Phase 14`
    - debug and polish work
  - later Browser/workspace lanes
    - richer interaction, hierarchy, and presentation work
- subphase rule:
  - if the first implementation cannot stay focused on one shared viewer composition seam over existing editor viewports, then split `SP - Phase 12` after these answers are accepted
- plain-English rule:
  - keep `SP 12` about one shared composition model, not all future viewport UX

##### Working Notes

- plain-English rule:
  - if the first pass cannot be described cleanly without absorbing those later clusters, split `SP - Phase 12` into subphases after these questions are answered

#### [x] `12.Q6` - What is the exact first-pass composition unit in `SP - Phase 12`?

##### Why This Matters

- the implementation still needs one explicit answer for what a composed member actually is
- without this, `SP - Phase 12` can drift into:
  - graph-output structure work
  - project-content composition work
  - later Browser-facing ownership semantics

##### Working Read

- likely candidates:
  - graph documents
  - published output entries
  - project components

Locked answer:
- the first-pass composition unit should be:
  - graph documents
- that means:
  - shared composition membership is a set of graph document ids
  - the shared viewer composes each participating graph's current viewer-facing preview contribution
- first pass should not use:
  - published output entries as membership units
  - project components as membership units
- why this cut is right:
  - it matches the current single `viewerTargetGraphDocumentId` seam cleanly
  - it keeps `SP - Phase 12` in viewer/workspace coordination rather than Browser/content semantics
  - it avoids pulling `SP 12` into later output-structure and project-content phases
- plain-English rule:
  - first compose whole graph contributions, not finer-grained content units

##### Working Notes

- this is the cleanest first-pass unit that makes the viewer multi-graph without redefining ownership

#### [x] `12.Q7` - How should the user author shared composition membership in the first pass?

##### Why This Matters

- the phase needs an explicit entry path or it will fall back into implicit focus-driven behavior
- the first authoring entry path also determines whether `SP - Phase 12` stays a viewport/workspace phase or drifts into Browser interaction work

##### Working Read

- likely first-pass choices:
  - explicit viewport action
  - Browser graph-row action
  - automatic composition from whatever viewports are open

Locked answer:
- first-pass shared composition membership should be authored through:
  - an explicit graph/editor viewport action
- that action should:
  - add the viewport's bound graph document to the shared composition
  - remove it from the shared composition
  - make participation explicit to the user
- first pass should not use:
  - automatic participation from all open viewports
  - Browser-first authoring as the primary path
- why this cut is right:
  - it keeps `SP - Phase 12` anchored to viewport/workspace behavior
  - it avoids Browser sprawl before later Browser interaction phases
  - it prevents composition membership from being inferred from focus or open-state alone
- plain-English rule:
  - the user should explicitly join a viewport/graph to the shared composition

##### Working Notes

- a later phase can still add Browser-side composition actions after the first viewport-owned path exists

#### [x] `12.Q8` - What exact render rule should the shared viewer use for participating members?

##### Why This Matters

- the shared viewer needs one deterministic first-pass render rule
- without this, the implementation doc will drift into ambiguous handling for unresolved graphs or competing participant order

##### Working Read

- likely first-pass rule:
  - the viewer should render some deterministic union of the participating members
- open details still needing one prep answer:
  - do unresolved participants render nothing or placeholder state?
  - what determines composition/render order?

Locked answer:
- the first-pass shared viewer should render:
  - the union of resolved participating graph contributions
- unresolved participants should:
  - stay visible as composition members in UI state
  - render nothing into the shared viewer until they have a resolved contribution
- deterministic render/composition order should be:
  - explicit composition membership order
  - and if no explicit member ordering is stored yet, fall back to graph document order
- first pass should not require:
  - per-output-entry composition rules
  - deeper object/part conflict resolution
  - final assembly semantics
- plain-English rule:
  - resolved members contribute to the shared viewer; unresolved members remain members but do not render

##### Working Notes

- this keeps `SP - Phase 12` visible and deterministic without pulling in later output-structure decisions

#### [x] `12.Q9` - What is the fallback/default behavior when no shared composition session exists yet?

##### Why This Matters

- the implementation still needs a bridge from today's single-target viewer behavior to the new shared-composition model
- without this answer, the first pass can create unclear viewer defaults and weak onboarding into the new behavior

##### Working Read

- likely choices:
  - keep today's single viewer-target behavior until composition is explicitly authored
  - make every graph implicitly part of composition
  - show nothing until the user starts a composition session

Locked answer:
- if no shared composition session exists yet:
  - keep today's single `viewerTargetGraphDocumentId` behavior as the default fallback
- once the user explicitly starts a shared composition:
  - the shared composition session becomes the viewer's active composition source
  - a one-graph composition is valid as a trivial first composed state
- focus changes may:
  - seed convenience actions
  - suggest likely next composition members
- focus changes must not:
  - silently redefine shared composition membership
- why this cut is right:
  - it preserves current behavior until the user opts into composition
  - it gives `SP - Phase 12` a clean migration path from current single-target viewer logic
  - it avoids a confusing empty viewer or over-implicit auto-composition rule
- plain-English rule:
  - default to today's viewer-target behavior until the user explicitly creates shared composition

##### Working Notes

- this is the cleanest first-pass bridge from current viewer targeting into later shared composition behavior

### Phase 12 CheckList

- [x] create the first short question-driven planning surface for `SP - Phase 12`
- [x] define what `shared viewport composition` means in the first pass
- [x] define which viewport/surface types participate first
- [x] define the ownership boundary for composition truth
- [x] define the minimum visible proof bar
- [x] define the out-of-scope guardrail
- [x] define the exact composition unit
- [x] define the first authoring entry path
- [x] define the first-pass render rule
- [x] define the fallback/default behavior
- [x] decide whether `SP - Phase 12` stays single-phase or splits into subphases

## [ ] - SP / VR - Lane [2.1] - `Browser Workspace Shell And Item Interaction`

Human Summary: Active planning surface. This shared lane section holds the `SP` side of `[2.1]`, focusing only on Browser-to-editor, graph-viewport, and shared-viewer coordination questions that remain after Lane `[1]`.

### Lane [2.1] SP Overview
#### Fold Hack 4

##### Phase Notes

- This is a shared lane-planning surface, not a new canonical numbered `SP` phase.
- Use this section only for the coordination questions that still depend on graph documents, editor viewports, or shared viewer behavior.
- Keep Browser/workspace interaction semantics in the matching `VR` family section.

##### Phase Summary

Current planning understanding:
- `[2.1]` should not re-fight the ownership work from Lane `[1]`
- it should define how Browser interactions coordinate with:
  - focused editor viewports
  - graph open/reveal behavior
  - shared viewer participation and emphasis
- it should stop before detached multi-window work and later full Browser-side shared-composition workflows

### Lane [2.1] SP Question Surface
#### Fold Hack 5

##### Planning Notes

- Use this as the active question list for the `SP` side of `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`.
- Keep these questions about editor/viewer coordination behavior, not about Browser controls, materials, or final output hierarchy.

##### Lane [2.1] SP Question CheckList

- [x] `2.1.SP.Q1` - How should Browser row interactions coordinate with focused editor viewport state in the first `[2.1]` pass?
- [x] `2.1.SP.Q2` - Which Browser actions should coordinate only open/focus behavior, and which should coordinate shared-viewer behavior?
- [x] `2.1.SP.Q3` - What graph/editor/viewer singleton assumptions still need to be broken for `[2.1]` to feel like one workspace instead of separate shells?
- [x] `2.1.SP.Q4` - What must stay out of the `SP` side of `[2.1]` so it does not collapse into `SP - Phase 13` or re-open `SP - Phase 12`?

#### [x] `2.1.SP.Q1` - How should Browser row interactions coordinate with focused editor viewport state in the first `[2.1]` pass?

##### Why This Matters

- Lane `[1]` established open/focus behavior, but `[2.1]` likely needs a clearer Browser-to-editor coordination rule
- without this, Browser interactions can become inconsistent across graph rows, content rows, and open viewport state

Locked answer:
- the first `[2.1]` pass should keep one clear rule:
  - Browser selection does not automatically equal editor focus
  - explicit open/focus actions still control focused editor viewport state
- graph-row behavior should be:
  - select on single-click
  - open/focus on the existing primary-open action
- single-click graph-row selection may also request presentation-only viewer emphasis for that graph's currently resolved published outputs
- that emphasis must not:
  - open/focus an editor viewport
  - retarget shared composition
  - change shared composition membership
- non-graph rows may:
  - select
  - request reveal/emphasis
  - but should not silently retarget the focused editor viewport unless the action is explicit
- plain-English rule:
  - Browser rows can point at editor context, but only explicit open/focus actions should move editor focus

#### [x] `2.1.SP.Q2` - Which Browser actions should coordinate only open/focus behavior, and which should coordinate shared-viewer behavior?

##### Why This Matters

- `SP - Phase 12` already made shared composition explicit
- `[2.1]` needs to decide whether Browser interactions can point at, reveal, or author that behavior without collapsing the phase boundary

Locked answer:
- first-pass Browser actions should split like this:
  - open/focus actions
    - open graph in editor
    - focus existing editor viewport
    - swap focused editor where already supported
  - shared-viewer coordination actions
    - reveal/emphasize current selected graph or published output
    - optionally show whether a graph is already participating in shared composition
- graph-row click itself should stay in the lighter category:
  - selection
  - optional presentation-only emphasis
  - not composition authoring
- first pass should not make the Browser the primary authoring surface for:
  - shared composition membership
  - composition ordering
  - multi-graph viewer workflows
- plain-English rule:
  - Browser can point at shared-viewer state in `[2.1]`, but it should not take over `SP 12`

#### [x] `2.1.SP.Q3` - What graph/editor/viewer singleton assumptions still need to be broken for `[2.1]` to feel like one workspace instead of separate shells?

##### Why This Matters

- some Browser/editor/viewer interactions may still feel split across separate app modes or convenience singletons
- `[2.1]` needs to identify which of those seams are still blocking a coherent workspace shell

Locked answer:
- `[2.1]` should keep breaking the assumption that:
  - the focused editor viewport is the only meaningful workspace target
  - the active graph is the same thing as the selected Browser target
  - the viewer only needs one implicit current target
  - Browser interaction is just another name for editor focus
- first pass should make these distinctions clearer:
  - selected Browser item
  - focused editor viewport
  - active shared-viewer emphasis target
  - composition membership
- plain-English rule:
  - one workspace can have several meaningful targets at once, and `[2.1]` should make that legible instead of hiding it

#### [x] `2.1.SP.Q4` - What must stay out of the `SP` side of `[2.1]` so it does not collapse into `SP - Phase 13` or re-open `SP - Phase 12`?

##### Why This Matters

- the `SP` side of `[2.1]` sits close to:
  - multi-window editing
  - shared composition workflows
  - broader workspace orchestration
- it needs a stop line before those later phases

Locked answer:
- keep out of the `SP` side of `[2.1]`:
  - detached multi-window graph editing
  - Browser-authored shared composition membership workflows
  - deeper viewer/workspace orchestration rules
  - new graph/runtime ownership seams that should already be settled from Lane `[1]`
- later homes:
  - `SP - Phase 13`
    - multi-window editing
  - later follow-up beyond `SP - Phase 12`
    - richer shared-composition workflow behavior if still needed
- plain-English rule:
  - `[2.1]` should improve coordination ergonomics, not create a new workspace architecture

### Lane [2.1] SP Carry-Forward - `2.1C Browser/Shell Honesty Cleanup`
#### Fold Hack 5

##### Carry-Forward Notes

- After shipped `2.1A` / `2.1B`, one remaining Browser problem is not deeper hierarchy or richer controls.
- It is that some Browser labels and Browser row claims are reading ahead of what the shell literally shows today.

##### Working Read

- `2.1C` should likely clarify the relationship between:
  - `Graph Documents`
    - graph documents that exist
  - `Open Viewports`
    - current editor viewport/session records in store
  - visible floating `Spaghetti Editor`
    - the currently active editor surface the shell actually renders
- if the shell still mostly renders one active editor surface at a time, `2.1C` should either:
  - rename `Open Viewports` to something more honest
  - or reduce the Browser wording so it no longer reads like literal multi-window truth already exists
- do not treat that naming/semantics cleanup as the same thing as true multi-window support

##### Boundary Reminder

- `2.1C`
  - Browser/shell honesty and Browser row-semantics cleanup
- `SP - Phase 13`
  - true multi-window graph editing where the Browser can later list literal visible editor windows without ambiguity

##### Plain-English Rule

- do not let the Browser promise a stronger multi-window shell than the current app actually renders
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
