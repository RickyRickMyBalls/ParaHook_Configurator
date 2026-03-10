# Decisions

## Doc History
1. 2026-03-09 00:00: Rebuilt this file from the roadmap and recent `CodexNotes` so it now acts as a clean Lane `[1]` decision register instead of an older unresolved backlog

## Purpose

This file records the important decisions that are already locked from the current roadmap planning work.

Current scope:
- base this file on `Lane [1]` of the roadmap first
- capture phase-by-phase decisions already made
- keep the focus on locked direction, not open brainstorming

This file is now for:
- decisions already made
- ownership rules that should not drift
- phase-specific guidance that later plan docs should build on

This file is not currently for:
- broad unresolved product backlog questions
- later-lane speculation unless it directly affects Lane `[1]`

## Current Decision Scope

Active source of truth for this file:
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/CodexNotes/5_CodexChatNotes.md`
- `docs/Human-Plans/CodexNotes/6_CodexChatNotes.md`
- `docs/Archive/CodexContext/5_CodexContext.md`

Current coverage:
- `Lane [1] Browser Foundations And Single-Graph Cleanup`

Later, this file can grow to include:
- Lane `[2]` decisions once those phases are planned
- Lane `[3]` decisions once those systems are planned

## Master Decision CheckList

Use this as the one-glance decision tracker for the roadmap phases currently covered here.

Meaning:
- `[x]` = the key decisions for this phase are already captured in this file
- `[ ]` = this phase still needs a fuller decision pass

### Bucket 1 - Lane [1] Browser Foundations And Single-Graph Cleanup

- [x] `[1.1] SP - Phase 9 - Graph Document Foundations`
  - decisions captured:
    - graph documents are first-class objects
    - graph truth is authored truth
    - Browser foundations need stable graph-document identity before later persistence/routing/project work
  - [x] `[1.1A] SP - Phase 9A - Graph Document Core`
    - decisions captured:
      - empty graph documents are valid
      - graph identity must be explicit
      - authored graph/canvas truth belongs inside the graph document core
    - [x] `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`
      - decisions captured:
        - explicit graph-document identity
        - `graph.nodes` / `graph.edges` as core payload
        - versioned shape suitable for later persistence
        - default origin reference can stay lightweight
    - [x] `[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State`
      - decisions captured:
        - graph owns node positions
        - graph owns wiring
        - graph owns node values/config
        - graph owns node mode state
    - [x] `[1.1A.3] SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
      - decisions captured:
        - editor viewports bind to graph by id
        - one-global-graph assumption must start breaking here
        - spaghetti document memory should start leaving one app-global bucket
  - [x] `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`
    - decisions captured:
      - editor = viewport into graph
      - Browser coordinates editor viewports
      - focus follows last click
      - focused viewport rises in z-order
      - one `meatball editor view` max
      - graph switching happens through header dropdown
      - spaghetti should stop being one app-wide mode/panel
  - [x] `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`
    - decisions captured:
      - `9C` is a bridge phase
      - compile/build memory becomes graph-local
      - preview-prep memory becomes graph-local
      - shared worker/viewer can stay shared
      - `9C = bridge`, `10 = routing`, `AS = output structure`, `SP 11 = Browser surface`

- [x] `[1.2] GE - Phase 11 - Graph Persistence And Save Load`
  - decisions captured:
    - persistence is graph-document focused first
    - Browser owns graph document list and cached graph lifecycle
    - persistence should not sprawl into full Browser/project systems
  - [x] `[1.2A] GE - Phase 11A - Graph Document Persistence Core`
    - decisions captured:
      - graph documents need a versioned save/load contract
      - load validates graph-document shape
      - save/load focuses on durable graph truth
  - [x] `[1.2B] GE - Phase 11B - Cached Graph Lifecycle`
    - decisions captured:
      - Browser owns cached graph entries
      - saved graph = durable record
      - cached graph = live loaded editor instance
      - open should create or focus Browser-owned cached entry
  - [x] `[1.2C] GE - Phase 11C - Save/Load Interaction With Editors`
    - decisions captured:
      - `Open Graph` vs `Import Into Current Graph` stays explicit
      - `Load Into New Graph` stays explicit
      - Browser/editor coordination must stay coherent across multiple viewports
      - Browser-owned graph activity stays independent from current viewport

- [x] `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`
  - decisions captured:
    - `SP 10` owns routing and graph-local preview/build ownership
    - later `AS` owns richer Browser-facing output structure
    - build-vs-view separation is required
    - shared worker/viewer services stay shared but graph-aware
  - [x] `[1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing`
    - decisions captured:
      - requests/results carry graph identity
      - build state is isolated per graph and per build sequence
      - stale/wrong-graph results cannot overwrite another graph
  - [x] `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
    - decisions captured:
      - preview/build memory leaves the one shared spaghetti bucket
      - one-preview / one-assembled / one-global-result assumptions must break
      - graph-local progress may later need per-part/per-object tracking
  - [x] `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
    - decisions captured:
      - `OutputPreview` is the graph's output declaration/handoff surface
      - each graph owns its output handoff surface
      - graph-owned outputs hand upward toward Browser/project visibility
      - richer hierarchy work is deferred to `AS`

- [x] `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - decisions captured:
    - `Project File` sits above graph documents
    - ownership split is `app-global / project-local / graph-local`
    - Browser becomes structurally real without absorbing full Browser UI polish
  - [x] `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
    - decisions captured:
      - minimum `Project File` shape
      - `Project File` owns graph documents
      - project-local graph collection/activity lives above editors
  - [x] `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
    - decisions captured:
      - graph-produced bundle is best described as `Component`
      - project composes `Components` upward
      - Browser tree supports simple and richer assembly/object/part shapes
      - `Sub-Parts` and `Sub-Components` are later extensions
  - [x] `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
    - decisions captured:
      - cross-graph communication uses `Publish / Receive`
      - `Link` vs `Hard Copy`
      - export requires linked receive-data to convert to `Hard Copy`
      - external references stay outside `Project File` ownership in the first pass

- [ ] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
  - current decision coverage:
    - this is the next open Browser-foundation planning target
    - Browser is the user-facing hierarchy panel
    - Browser should stay able to grow toward:
      - `Project File -> Assembly tree -> Components / Objects -> Parts`
    - graph-authored output structure must stay separate from project-level placement/nesting
    - full later output hierarchy and rich viewer/material workspace systems stay out of scope
  - remaining decision gap:
    - first-pass Browser row model
    - graph row vs output row structure
    - first-pass nested object/part display behavior
    - Browser action surface and focus/view/generate rules at the row level

### Master Totals

- fully decision-covered phases/sub-phases: `16`
- partially covered / still-open decision targets: `1`
- total roadmap items tracked here: `17`

## Lane [1] - Foundation Decisions

### Lane [1] Overall

Locked direction:
- the project is now Browser-first
- the app is no longer planned around one hidden active graph
- the app is being planned around:
  - `Project File -> Browser -> Graph Documents -> Graph Outputs`
- single-graph cleanup is only justified when it helps the Browser/document path

Lane `[1]` boundary:
- this lane establishes:
  - graph-document identity
  - editor viewport behavior
  - graph-local compile/build memory
  - graph-aware routing
  - project-local ownership above graphs
  - the first Browser surface
- this lane does not try to finish:
  - full Browser polish
  - full output hierarchy depth
  - rich viewer/material/reference workspace behavior

### [1.1] SP - Phase 9 - Graph Document Foundations

Locked direction:
- a `graph` must become a first-class document-like object
- the app should stop treating one implicit editor instance as the only real graph
- Browser foundations need a stable graph-document model before later save/load, routing, and project ownership work

#### [1.1A] SP - Phase 9A - Graph Document Core

Locked direction:
- empty graph documents must be valid
- graph identity must be explicit rather than implied by one global spaghetti store
- authored graph/canvas truth belongs inside the graph document core

##### [1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity

Locked decisions:
- the graph document should have explicit identity
- `graph.nodes` and `graph.edges` are the core payload
- empty graph documents are valid
- the graph document should carry stable versioned shape suitable for later persistence work
- the origin concept can remain a default `0,0,0` reference rather than a heavy early system

##### [1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State

Locked decisions:
- the graph owns authored truth
- authored graph/canvas state includes:
  - node positions
  - edge wiring
  - node values/config
  - node mode:
    - `collapsed`
    - `essentials`
    - `expanded`
- viewer presentation state should not be confused with graph-authored truth

##### [1.1A.3] SP - Phase 9A.3 - Viewport Binding And First Singleton Split

Locked decisions:
- editor viewports should point at graph documents by id
- `useSpaghettiStore.graph` cannot remain the only real graph
- spaghetti document memory needs to move out of one app-global bucket
- this slice should not absorb full Browser or persistence work yet

#### [1.1B] SP - Phase 9B - Multi-Editor Browser Foundation

Locked direction:
- the spaghetti editor is a viewport into a graph document, not the owner of graph truth
- the Browser coordinates editor viewports
- spaghetti must stop being one app-wide mode/panel

Locked viewport model:
- minimum viewport state:
  - `editorViewportId`
  - `graphDocumentId`
  - `isFocused`
  - `windowMode`
  - optional:
    - position
    - size
    - z-order

Locked viewport modes:
- `collapsed`
- `meatball editor view`
- `expanded`
- `separateWindow`

Locked focus rules:
- focus follows the last clicked editor viewport
- hover does not change focus
- the focused viewport rises in z-order
- Browser should reflect focused/open viewport state
- only one `meatball editor view` can exist at a time

Locked interaction rules:
- graph switching inside one editor viewport happens through the graph-name dropdown in the editor header
- Browser is the viewport manager and project navigation surface
- Browser does not own graph nodes, edges, params, or compile/build truth
- viewport-owned state should stay limited to:
  - graph binding
  - window behavior
  - local UI presentation
  - focus
  - position/size
  - z-order

Current seam decisions:
- the one-window spaghetti assumption in `AppShell.tsx` must eventually go
- the app-global `legacy / spaghetti` mode seam is a transitional blocker, not the long-term design

#### [1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation

Locked direction:
- `9C` is a bridge phase
- it should prepare graph-local compile/build memory and preview-prep memory without absorbing full routing or Browser-facing output hierarchy

Locked graph-local compile/build memory bundle:
- `lastCompileResult`
- `previousBuildInputs`
- `pendingChangedParamIds`
- `pendingStatsPartKeys`
- `pendingInstances`
- optional per-graph `lastBuildSeq`

Locked graph-local preview-prep bundle:
- graph-local output declaration state
- graph-local preview candidate list
- graph-local source/build part identity mapping
- graph-local build-stats-ready part keys
- graph-local "what this graph is trying to preview" memory

Locked infrastructure rule:
- one worker lifecycle can stay shared
- one viewer shell can stay shared
- compile/build/preview-prep state should still become graph-local and graph-keyed

Locked boundary rule:
- `9C = bridge`
- `10 = routing`
- `AS = output structure`
- `SP 11 = Browser surface`

### [1.2] GE - Phase 11 - Graph Persistence And Save Load

Locked direction:
- persistence is graph-document focused first
- Browser owns the graph document list and cached graph lifecycle
- graph persistence should become real without trying to finish the full project file or full Browser UX

#### [1.2A] GE - Phase 11A - Graph Document Persistence Core

Locked decisions:
- the first persistence pass is graph-document persistence
- graph documents need a versioned save/load contract
- load should validate graph-document shape
- save/load should focus on graph-level durable truth

#### [1.2B] GE - Phase 11B - Cached Graph Lifecycle

Locked decisions:
- Browser owns cached graph entries
- a saved graph document is the durable record
- a cached graph is the live loaded editor instance of that saved graph
- opening a saved graph should create or focus a Browser-owned cached entry
- cached graph identity must remain stable enough for editor switching

#### [1.2C] GE - Phase 11C - Save/Load Interaction With Editors

Locked decisions:
- save/load interactions must stay explicit:
  - `Open Graph`
  - `Import Into Current Graph`
  - `Load Into New Graph`
- loading/opening a saved graph is not the same thing as importing/merging into the current graph
- Browser/editor coordination must stay coherent when multiple editor viewports exist
- Browser should keep graph activity independent from whichever editor viewport currently shows a graph

### [1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing

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
  - project/browser graph collection and higher-level organization
- `graph-local`
  - compile/build memory
  - preview/output memory
  - graph output declaration/handoff memory

Locked build-vs-view rule:
- `generate/build on/off` belongs to graph/project/build truth
- `view on/off` belongs to viewer/Browser truth
- those controls must not collapse into one toggle

#### [1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing

Locked decisions:
- requests/results must be graph-aware
- build state must be isolated per graph and per build sequence
- stale or wrong-graph results must not overwrite another graph's state

#### [1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory

Locked decisions:
- compile/build/preview memory should move out of one shared spaghetti bucket
- the app must stop assuming:
  - one global preview/output bucket
  - one global assembled result
  - one global spaghetti compile/build memory path
- graph-local build progress may later need per-part/per-object tracking inside each graph

#### [1.3C] SP - Phase 10C - Graph Output Handoff Surface

Locked decisions:
- `OutputPreview` should be treated as the graph's output declaration / handoff surface
- it is not only a visual preview widget
- each graph should own its own output declaration/handoff surface
- graph-owned outputs are handed upward toward Browser/project visibility
- this phase stops short of full later `Component / Assembly / Object / Part` hierarchy work

### [1.4] GE - Phase 12 - Multi-Document Graph Ownership

Locked direction:
- `Project File` sits above graph documents
- the project uses a three-layer ownership model:
  - `app-global`
  - `project-local`
  - `graph-local`
- Browser becomes structurally real at the project/content level without trying to finish full Browser UI polish

Locked minimum `Project File` shape:
- `projectFileId`
- `name`
- `version`
- `graphDocuments`
- `rootAssembly`

#### [1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership

Locked decisions:
- `Project File` owns multiple graph documents
- many graphs can exist in one project at once
- no single editor viewport should redefine project truth back into one only-real graph
- project-local state includes:
  - graph document list
  - cached graph lifecycle
  - graph activity state per project

#### [1.4B] GE - Phase 12B - Project Content Tree Ownership

Locked decisions:
- the graph-produced bundle is best described as a `Component`
- recommended ownership stack:
  - `Graph Document`
    - authors one `Component`
  - `Component`
    - graph-produced bundle
  - `Project File`
    - composes those components upward
  - `Assembly`
    - groups `Components` and/or `Objects`
  - `Object`
    - contains `Parts`
  - `Part`
    - may later contain `Sub-Parts`
- `Project File` owns higher-level placement and nesting in the Browser
- the Browser tree can support:
  - simple `Project File -> Object -> Part`
  - richer `Project File -> Assembly -> Component/Object -> Part`

Later-structure note kept alive:
- `Sub-Parts` are a later derived split layer under `Part`
- `Sub-Components` may later be needed for deeper graph-owned output organization

#### [1.4C] GE - Phase 12C - Cross-Graph Ownership Rules

Locked decisions:
- cross-graph communication should use `Publish / Receive`
- `Publish / Receive` supports:
  - `Link`
  - `Hard Copy`

Locked `Link` rule:
- source graph keeps ownership
- receiving graph stays live-linked to source data

Locked `Hard Copy` rule:
- receiving graph copies the data into graph-local owned state
- copied data no longer depends on live updates from the source graph

Locked export rule:
- if a graph with linked received data is exported as a standalone graph file, linked data should first be converted to `Hard Copy`

Locked references rule:
- external reference assets stay outside `Project File` ownership in the first pass
- they can remain visible in Browser/viewer space without becoming project-authored graph/content truth

### [1.5] SP - Phase 11 - Graphs Panel And Nested Parts

Current decision state:
- this is the next open Browser-foundation planning target
- the Browser phase should become the first real Browser-facing hierarchy surface

Locked carry-forward rules from earlier phases:
- Browser is the user-facing hierarchy panel
- Browser should remain able to grow toward:
  - `Project File -> Assembly tree -> Components / Objects -> Parts`
- graph-authored output structure must remain separate from project-level placement/nesting
- this phase is Browser surface work, not the place to absorb full later output hierarchy or rich viewer/material workspace systems

## Short Version

Lane `[1]` now has a locked foundation direction:
- graph documents are real objects
- editor windows are viewports into graphs
- compile/build/preview memory moves toward graph-local ownership
- worker/viewer services can stay shared if requests/results are graph-aware
- `Project File` sits above graph documents
- graphs publish `Components` upward into project content
- `Publish / Receive` uses `Link` versus `Hard Copy`
- Browser owns view/navigation/workspace coordination
- graph owns authored truth

The main open item after these locked decisions is:
- `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
