## Doc Body

### `Immediate CheckList`
#### FOld Hack 4
##### Fold Hack 5
- [x] 1. `DOC - Phase 14F - Phase-Plans Setup`
  - the family phase-plan system is now usable enough to guide next-step decisions

- [x] 2. `Roadmap Buildout`
  - the next execution lane is now clearer
  - the roadmap is aligned with the rebuilt family phase files
  - the Browser / multi-graph direction is now the first major product lane
  - Planning order so far:
    - [x] `1.1A - SP - Phase 9A - Graph Document Core`
    - [x] `1.1B - SP - Phase 9B - Multi-Editor Browser Foundation`
    - [x] `1.1C - SP - Phase 9C - Graph-Local Compile / Preview Preparation`
    - [x] `1.2 - GE - Phase 11 - Graph Persistence And Save Load`
    - [x] `1.3 - SP - Phase 10 - Graph Aware Worker And Preview Routing`
    - [x] `1.4 - GE - Phase 12 - Multi-Document Graph Ownership`
    - [x] `1.5 - SP - Phase 11 - Graphs Panel And Nested Parts`
    - [x] `1.6 - SP - Phase 12 - Shared Viewport Composition`
  - Lane `[1]` detail status:
  - [x] - 1.1 - `SP - Phase 9 - Graph Document Foundations`
    - [x] `[1.1A] SP - Phase 9A - Graph Document Core`
    - [x] `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`
    - [x] `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`
  - [x] - 1.2 - `GE - Phase 11 - Graph Persistence And Save Load`
    - [x] `[1.2] GE - Phase 11 - Graph Persistence And Save Load`
  - [x] - 1.3 - `SP - Phase 10 - Graph Aware Worker And Preview Routing`
    - [x] `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`
  - [x] - 1.4 - `GE - Phase 12 - Multi-Document Graph Ownership`
    - [x] `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [x] - 1.5 - `SP - Phase 11 - Graphs Panel And Nested Parts`
    - [x] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
  - [x] - 1.6 - `SP - Phase 12 - Shared Viewport Composition`
    - [x] `[1.6] SP - Phase 12 - Shared Viewport Composition`

- [ ] 3. `Browser / Multi-Graph Foundations`
  - establish the file / graph / browser ownership structure first
  - prepare the single-graph editor to become graph-document aware
  - avoid deepening the wrong single-graph assumptions before the Browser exists

- [ ] 4. `Graph-Aware Output Structure`
  - move from one flat parts list toward graphs, assemblies, objects, and parts
  - make `OutputPreview` graph-local
  - align preview/output structure with the Browser hierarchy

- [x] 5. `Single-Graph Cleanup In Service Of Browser`
  - `9A`, `9B`, and `9C` removed the main single-graph ownership/runtime assumptions blocking Browser foundations
  - further work now belongs more to routing, persistence, and project ownership than to single-graph cleanup itself

- [ ] 6. `Future Visibility / Reference Workspace`
  - keep viewer-side visibility/material/reference controls on the roadmap
  - delay the richer Browser-side viewer controls until graph/output ownership is stable

##### Master Roadmap CheckList

Use this as the single top-level checklist for roadmap status.

Meaning:
- `Roadmap Breakdown`
  - `[x]` = this item is already broken down enough in the roadmap/current notes
  - `[ ]` = this item still needs more roadmap-level planning
- `Decision Coverage`
  - `[x]` = the main decisions for this item are already captured in `docs/Human-Plans/Decisions.MD`
  - `[ ]` = the main decisions for this item still need to be written/compiled there
- `Plan.md Status`
  - `[x]` = this item already has its own dedicated plan/task doc
  - `[ ]` = this item still needs its own dedicated plan/task doc

##### Bucket 1 - Lane [1] Browser Foundations And Single-Graph Cleanup

- [x] `Roadmap Breakdown` `[1.1] SP - Phase 9 - Graph Document Foundations`
  - [x] `Decision Coverage` `[1.1]`
  - [ ] `Plan.md Status` `[1.1]`
  - [x] `Roadmap Breakdown` `[1.1A] SP - Phase 9A - Graph Document Core`
    - [x] `Decision Coverage` `[1.1A]`
    - [ ] `Plan.md Status` `[1.1A]`
    - [x] `Roadmap Breakdown` `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`
      - [x] `Decision Coverage` `[1.1A.1]`
      - [x] `Plan.md Status` `[1.1A.1]`
    - [x] `Roadmap Breakdown` `[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State`
      - [x] `Decision Coverage` `[1.1A.2]`
      - [x] `Plan.md Status` `[1.1A.2]`
    - [x] `Roadmap Breakdown` `[1.1A.3] SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
      - [x] `Decision Coverage` `[1.1A.3]`
      - [x] `Plan.md Status` `[1.1A.3]`
  - [x] `Roadmap Breakdown` `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`
    - [x] `Decision Coverage` `[1.1B]`
    - [x] `Plan.md Status` `[1.1B]`
  - [x] `Roadmap Breakdown` `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`
    - [x] `Decision Coverage` `[1.1C]`
    - [x] `Plan.md Status` `[1.1C]`

- [x] `Roadmap Breakdown` `[1.2] GE - Phase 11 - Graph Persistence And Save Load`
  - [x] `Decision Coverage` `[1.2]`
  - [ ] `Plan.md Status` `[1.2]`
  - [x] `Roadmap Breakdown` `[1.2A] GE - Phase 11A - Graph Document Persistence Core`
    - [x] `Decision Coverage` `[1.2A]`
    - [x] `Plan.md Status` `[1.2A]`
  - [x] `Roadmap Breakdown` `[1.2B] GE - Phase 11B - Cached Graph Lifecycle`
    - [x] `Decision Coverage` `[1.2B]`
    - [x] `Plan.md Status` `[1.2B]`
  - [x] `Roadmap Breakdown` `[1.2C] GE - Phase 11C - Save/Load Interaction With Editors`
    - [x] `Decision Coverage` `[1.2C]`
    - [x] `Plan.md Status` `[1.2C]`

- [x] `Roadmap Breakdown` `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`
  - [x] `Decision Coverage` `[1.3]`
  - [ ] `Plan.md Status` `[1.3]`
  - [x] `Roadmap Breakdown` `[1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing`
    - [x] `Decision Coverage` `[1.3A]`
    - [x] `Plan.md Status` `[1.3A]`
  - [x] `Roadmap Breakdown` `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
    - [x] `Decision Coverage` `[1.3B]`
    - [x] `Plan.md Status` `[1.3B]`
  - [x] `Roadmap Breakdown` `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
    - [x] `Decision Coverage` `[1.3C]`
    - [x] `Plan.md Status` `[1.3C]`

- [x] `Roadmap Breakdown` `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [x] `Decision Coverage` `[1.4]`
  - [ ] `Plan.md Status` `[1.4]`
  - [x] `Roadmap Breakdown` `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
    - [x] `Decision Coverage` `[1.4A]`
    - [x] `Plan.md Status` `[1.4A]`
  - [x] `Roadmap Breakdown` `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
    - [x] `Decision Coverage` `[1.4B]`
    - [x] `Plan.md Status` `[1.4B]`
  - [x] `Roadmap Breakdown` `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
    - [x] `Decision Coverage` `[1.4C]`
    - [x] `Plan.md Status` `[1.4C]`

- [x] `Roadmap Breakdown` `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
  - [x] `Decision Coverage` `[1.5]`
  - [x] `Plan.md Status` `[1.5]`
- [x] `Roadmap Breakdown` `[1.6] SP - Phase 12 - Shared Viewport Composition`
  - [x] `Decision Coverage` `[1.6]`
  - [x] `Plan.md Status` `[1.6]`

##### Bucket 2 - Lane [2] Browser Workspace And Project Content Structure

- [x] `Roadmap Breakdown` `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - [x] `Decision Coverage` `[2.1]`
  - [x] `Plan.md Status` `[2.1]`
  - [x] `Roadmap Breakdown` `[2.1A] VR - Browser Workspace Shell And Row Interaction`
    - [x] `Decision Coverage` `[2.1A]`
    - [x] `Plan.md Status` `[2.1A]`
  - [x] `Roadmap Breakdown` `[2.1B] SP / VR - Browser, Editor, And Shared Viewer Coordination`
    - [x] `Decision Coverage` `[2.1B]`
    - [x] `Plan.md Status` `[2.1B]`
  - [x] `Roadmap Breakdown` `[2.1C] VR / SP - Browser Row Action Cleanup And Context Menus`
    - [ ] `Decision Coverage` `[2.1C]`
    - [ ] `Plan.md Status` `[2.1C]`
  - [x] `Roadmap Breakdown` `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes`
    - [ ] `Decision Coverage` `[2.1D]`
    - [x] `Plan.md Status` `[2.1D]`
  - [x] `Roadmap Breakdown` `[2.1E] VR / SP - Dockable Left Panels And In-App Floating Panel Shell`
    - [x] `Decision Coverage` `[2.1E]`
    - [x] `Plan.md Status` `[2.1E]`
  - [x] `Roadmap Breakdown` `[2.1F] VR / SP - Graph Documents Child Sections`
    - [x] `Decision Coverage` `[2.1F]`
    - [x] `Plan.md Status` `[2.1F]`
- [x] `Roadmap Breakdown` `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
  - [x] `Decision Coverage` `[2.2]`
  - [x] `Plan.md Status` `[2.2]`
  - [x] `[2.2A]` first shipped Browser-facing content structure cut
  - [x] `[2.2B]` graph-owned publish seam cleanup and final closeout proof
  - [x] `Closeout` make the graph-owned publish seam tell the same singleton-versus-grouped truth as the project/browser lift
  - [x] `Closeout` tighten the authored `OutputPreview` seam so the structured publish payload reads as the canonical Phase 5 contract
  - [x] `Closeout` verify the remaining `02.2` acceptance claims end-to-end at the graph seam, project lift, and Browser read-model layers
  - [x] `Closeout` add or adjust direct tests around the graph-owned publish seam above the app-store lift
- [x] `Roadmap Breakdown` `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
  - [x] `Decision Coverage` `[2.3]`
  - [x] `Plan.md Status` `[2.3]`
- [x] `Roadmap Breakdown` `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
  - [x] `Decision Coverage` `[2.4]`
  - [x] `Plan.md Status` `[2.4]`
  - [x] `Roadmap Breakdown` `[2.4A]` static-manifest reference workspace
    - [x] `Decision Coverage` `[2.4A]`
    - [x] `Plan.md Status` `[2.4A]`
  - [x] `Roadmap Breakdown` `[2.4B]` expanded reference file support
    - [x] `Decision Coverage` `[2.4B]`
    - [x] `Plan.md Status` `[2.4B]`
  - [x] `Roadmap Breakdown` `[2.4C]` user reference import from disk
    - [x] `Decision Coverage` `[2.4C]`
    - [x] `Plan.md Status` `[2.4C]`
  - [x] `Roadmap Breakdown` `[2.4D]` reference transform controls
    - [x] `Decision Coverage` `[2.4D]`
    - [x] `Plan.md Status` `[2.4D]`
  - [x] `Roadmap Breakdown` `[2.4E]` reference transform timelines
    - [x] `Decision Coverage` `[2.4E]`
    - [x] `Plan.md Status` `[2.4E]`
  - [x] `Roadmap Breakdown` `[2.4F]` general content transform toolbar
    - [ ] `Decision Coverage` `[2.4F]`
    - [x] `Plan.md Status` `[2.4F]`
- [x] `Roadmap Breakdown` `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
  - [ ] `Decision Coverage` `[2.5]`
  - [ ] `Plan.md Status` `[2.5]`

##### Bucket 3 - Lane [3] Node, Wire, Driver, Part, And Feature Authoring Hardening

- [x] `Roadmap Breakdown` `[3.1] NI - Phase 6 - Node System Cleanup And Growth`
  - [ ] `Decision Coverage` `[3.1]`
  - [ ] `Plan.md Status` `[3.1]`
- [x] `Roadmap Breakdown` `[3.2] NI - Phase 7 / 8 - Wire UX And Flow Readability`
  - [ ] `Decision Coverage` `[3.2]`
  - [ ] `Plan.md Status` `[3.2]`
- [x] `Roadmap Breakdown` `[3.3] DR - Phase 13 / 14 / 16 - Driver And Param System Expansion`
  - [ ] `Decision Coverage` `[3.3]`
  - [ ] `Plan.md Status` `[3.3]`
- [x] `Roadmap Breakdown` `[3.4] PT - Phase TBD - Part Node Hardening`
  - [ ] `Decision Coverage` `[3.4]`
  - [ ] `Plan.md Status` `[3.4]`
- [x] `Roadmap Breakdown` `[3.5] FS - Phase TBD - Feature Stack Growth`
  - [ ] `Decision Coverage` `[3.5]`
  - [ ] `Plan.md Status` `[3.5]`

##### Bucket 4 - Lane [4] Console, Debug, And Workspace Feedback

- [x] `Roadmap Breakdown` `[4.1] VR / SP / DBG - Console And Layered Transcript`
  - [ ] `Decision Coverage` `[4.1]`
  - [x] `Plan.md Status` `[4.1]`

##### Bucket 5 - Lane [5] Control, Build, And Workspace Systems

- [x] `Roadmap Breakdown` `[5.1] VR / SP - Workspace Modes`
  - [ ] `Decision Coverage` `[5.1]`
  - [ ] `Plan.md Status` `[5.1]`
- [x] `Roadmap Breakdown` `[5.1E] VR / SP - Multi-Window Editor Surfaces And Detached Pop-Out`
  - [ ] `Decision Coverage` `[5.1E]`
  - [ ] `Plan.md Status` `[5.1E]`
- [x] `Roadmap Breakdown` `[5.2] DR / JK - Control Viz And Graph-Driven Control Surfaces`
  - [ ] `Decision Coverage` `[5.2]`
  - [ ] `Plan.md Status` `[5.2]`
- [x] `Roadmap Breakdown` `[5.3] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
  - [ ] `Decision Coverage` `[5.3]`
  - [ ] `Plan.md Status` `[5.3]`
- [x] `Roadmap Breakdown` `[5.4] AS / VR - Advanced Output Types And Later Project Packaging`
  - [ ] `Decision Coverage` `[5.4]`
  - [ ] `Plan.md Status` `[5.4]`
- [x] `Roadmap Breakdown` `[5.5] GE / SP / AS - Publish / Receive Execution`
  - [ ] `Decision Coverage` `[5.5]`
  - [ ] `Plan.md Status` `[5.5]`
- [x] `Roadmap Breakdown` `[5.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`
  - [ ] `Decision Coverage` `[5.6]`
  - [ ] `Plan.md Status` `[5.6]`

##### Master Totals

- `Roadmap Breakdown`
  - done enough: `43`
  - still needs roadmap planning: `0`
- `Decision Coverage`
  - captured enough: `26`
  - still needs decision write-up: `17`
- `Plan.md Status`
  - dedicated docs already made: `19`
  - still needs dedicated docs: `24`


##### RoadMap CheckList Total

Use this as the one-glance planning tracker for the roadmap itself.

Meaning:
- `Roadmap breakdown`
  - `[x]` = this item is already broken down enough inside the roadmap/current notes to count as planned at a roadmap level
  - `[ ]` = this item still needs dedicated planning work even at the roadmap level
- `Plan.md status`
  - `[x]` = this item already has its own dedicated plan/task doc
  - `[ ]` = this item still needs its own dedicated `Plan.md`-style doc, even if roadmap info already exists

##### Lane [1] - Browser Foundations And Single-Graph Cleanup

- [x] `[1.1] SP - Phase 9 - Graph Document Foundations`
  - [x] `[1.1A] SP - Phase 9A - Graph Document Core`
    - [x] `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`
    - [x] `[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State`
    - [x] `[1.1A.3] SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
  - [x] `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`
  - [x] `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`
- [x] `[1.2] GE - Phase 11 - Graph Persistence And Save Load`
  - [x] `[1.2A] GE - Phase 11A - Graph Document Persistence Core`
  - [x] `[1.2B] GE - Phase 11B - Cached Graph Lifecycle`
  - [x] `[1.2C] GE - Phase 11C - Save/Load Interaction With Editors`
- [x] `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`
  - [x] `[1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing`
  - [x] `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
  - [x] `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
- [x] `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [x] `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
  - [x] `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
  - [x] `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
- [x] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
- [x] `[1.6] SP - Phase 12 - Shared Viewport Composition`

##### Lane [2] - Browser Workspace And Project Content Structure

- [x] `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - [x] `[2.1A] VR - Browser Workspace Shell And Row Interaction`
  - [x] `[2.1B] SP / VR - Browser, Editor, And Shared Viewer Coordination`
  - [x] `[2.1C] VR / SP - Browser Row Action Cleanup And Context Menus`
  - [~] `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes`
  - [~] `[2.1E] VR / SP - Dockable Left Panels And In-App Floating Panel Shell`
  - [x] `[2.1F] VR / SP - Graph Documents Child Sections`
- [x] `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- [x] `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- [ ] `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- [x] `[2.4A]` static-manifest reference workspace
- [x] `[2.4B]` expanded reference file support
- [x] `[2.4C]` user reference import from disk
- [x] `[2.4D]` reference transform controls
- [x] `[2.4E]` reference transform timelines
- [ ] `[2.4F]` general content transform toolbar
- [ ] `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

##### Lane [3] - Node, Wire, Driver, Part, And Feature Authoring Hardening

- [ ] `[3.1] NI - Phase 6 - Node System Cleanup And Growth`
- [ ] `[3.2] NI - Phase 7 / 8 - Wire UX And Flow Readability`
- [ ] `[3.3] DR - Phase 13 / 14 / 16 - Driver And Param System Expansion`
- [ ] `[3.4] PT - Phase TBD - Part Node Hardening`
- [ ] `[3.5] FS - Phase TBD - Feature Stack Growth`

##### Lane [4] - Console, Debug, And Workspace Feedback

- [x] `[4.1] VR / SP / DBG - Console And Layered Transcript`

##### Lane [5] - Control, Build, And Workspace Systems

- [~] `[5.1] VR / SP - Workspace Modes`
- [ ] `[5.1E] VR / SP - Multi-Window Editor Surfaces And Detached Pop-Out`
- [ ] `[5.2] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- [ ] `[5.3] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- [ ] `[5.4] AS / VR - Advanced Output Types And Later Project Packaging`
- [ ] `[5.5] GE / SP / AS - Publish / Receive Execution`
- [ ] `[5.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`

##### Dedicated Plan.md CheckList Total

- [ ] `[1.1] SP - Phase 9 - Graph Document Foundations`
  - [ ] `[1.1A] SP - Phase 9A - Graph Document Core`
    - [x] `[1.1A.1] SP - Phase 9A.1 - Graph Document Shape And Identity`
    - [x] `[1.1A.2] SP - Phase 9A.2 - Graph-Owned Authored Canvas State`
    - [x] `[1.1A.3] SP - Phase 9A.3 - Viewport Binding And First Singleton Split`
  - [x] `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`
  - [x] `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`
- [ ] `[1.2] GE - Phase 11 - Graph Persistence And Save Load`
  - [x] `[1.2A] GE - Phase 11A - Graph Document Persistence Core`
  - [x] `[1.2B] GE - Phase 11B - Cached Graph Lifecycle`
  - [x] `[1.2C] GE - Phase 11C - Save/Load Interaction With Editors`
- [ ] `[1.3] SP - Phase 10 - Graph Aware Worker And Preview Routing`
  - [x] `[1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing`
  - [x] `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
  - [x] `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
- [ ] `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [x] `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
  - [x] `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
  - [x] `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
- [x] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
- [x] `[1.6] SP - Phase 12 - Shared Viewport Composition`
- [x] `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - [x] `[2.1A] VR - Browser Workspace Shell And Row Interaction`
  - [x] `[2.1B] SP / VR - Browser, Editor, And Shared Viewer Coordination`
  - [ ] `[2.1C] VR / SP - Browser Row Action Cleanup And Context Menus`
  - [x] `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes`
  - [x] `[2.1E] VR / SP - Dockable Left Panels And In-App Floating Panel Shell`
  - [x] `[2.1F] VR / SP - Graph Documents Child Sections`
- [x] `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- [x] `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- [ ] `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- [x] `[2.4A]` static-manifest reference workspace
- [x] `[2.4B]` expanded reference file support
- [x] `[2.4C]` user reference import from disk
- [x] `[2.4D]` reference transform controls
- [x] `[2.4E]` reference transform timelines
- [x] `[2.4F]` general content transform toolbar
- [ ] `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
- [ ] `[3.1] NI - Phase 6 - Node System Cleanup And Growth`
- [ ] `[3.2] NI - Phase 7 / 8 - Wire UX And Flow Readability`
- [ ] `[3.3] DR - Phase 13 / 14 / 16 - Driver And Param System Expansion`
- [ ] `[3.4] PT - Phase TBD - Part Node Hardening`
- [ ] `[3.5] FS - Phase TBD - Feature Stack Growth`
- [x] `[4.1] VR / SP / DBG - Console And Layered Transcript`
- [ ] `[5.1] VR / SP - Workspace Modes`
- [ ] `[5.1E] VR / SP - Multi-Window Editor Surfaces And Detached Pop-Out`
- [ ] `[5.2] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- [ ] `[5.3] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- [ ] `[5.4] AS / VR - Advanced Output Types And Later Project Packaging`
- [ ] `[5.5] GE / SP / AS - Publish / Receive Execution`
- [ ] `[5.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`

##### Roadmap Breakdown Totals

- Planned enough to count as broken down: `43`
- Still needing dedicated planning: `0`
- Grand total roadmap items tracked here: `43`

##### Dedicated Plan.md Totals

- Already has its own dedicated plan/task doc: `20`
- Still needs its own dedicated plan/task doc: `23`
- Grand total roadmap items tracked here: `43`



##### Current State

The family `Phase-Plans.md` buildout is now far enough along that the project has a readable map of:
- what already landed
- where the current architecture really is
- which systems are still partial
- which future work already fits the existing prefix system

The app itself is no longer in the "invent the architecture" stage.

The project is now in the "lock the ownership model, build the Browser foundations, and stop polishing the wrong single-graph assumptions" stage.

### `Now`
#### Fold Hack 4
##### 1. Build Browser / Multi-Graph Foundations First


This is now the main live lane.

Primary phase targets:
- `SP - Phase 9 - Graph Document Foundations`
- `SP - Phase 10 - Graph Aware Worker And Preview Routing`
- `SP - Phase 11 - Graphs Panel And Nested Parts`
- `GE - Phase 11 - Graph Persistence And Save Load`
- `GE - Phase 12 - Multi-Document Graph Ownership`

###### 1. Info 

Primary phase families:
- `SP`
- `GE`

Why this comes first:
- the Browser is becoming a core ownership and navigation system, not a small UI add-on
- the app truth is now defined as a `list of graphs`
- graphs own their authored truth and their produced outputs
- the user-facing hierarchy panel is likely the future `Browser`
- broad canvas polish on top of the wrong single-graph model would create more rework later

Immediate product goals:
- make graphs first-class document-like objects
- support a higher-level Browser surface above graph-local output structure
- prepare the current editor so one file can own multiple graphs
- allow later support for working across multiple files/projects
- keep the project-content direction honest:
  - `Project File -> Assembly tree -> Components / Objects -> Parts`
- keep external reference assets outside project-owned truth in the first pass

##### 2. Clean The Single-Graph Editor Only Where It Helps The Browser

This still matters, but it is no longer the first independent lane.

Use cleanup work to support the Browser lane:
- remove or reduce single-graph assumptions that block graph-document ownership
- clean the current `OutputPreview` and parts-list seams that will need to become graph-local
- clean node/editor behavior only where the current structure fights the next ownership model

This is mostly:
- `SP`
- `VM`
- `NI`

But it should stay subordinate to the Browser foundations rather than replace them.

##### 3. Keep The Part / Param Object Model Moving Toward The New Truth

The planning pass clarified several object-model rules that should guide near-term cleanup:
- `Part node` is the host, not the hard-coded final identity
- `Part type` and `preset` are separate layers
- graphs own authored param truth
- `Publish / Receive` is the future same-graph and cross-graph reuse path
- full authored truth should remain inspectable even if the main canvas stays clean

This work belongs across:
- `PT`
- `DR`
- `FS`
- `SP`

### `Next`
#### Fold Hack 4
##### 4. Make Outputs Graph-Aware And Browser-Aware

Once Browser foundations are in place, the next lane is output structure.

Primary phase family:
- `AS`

Primary phase targets:
- `AS - Phase 5 - OutputPreview Render Path Stabilization`
- `AS - Phase 6 - Graph Aware Parts And Preview Inspection`

What this should lock:
- `OutputPreview` is graph-local
- one graph may produce multiple visible outputs
- a graph may own multiple `objects` and/or `assemblies`
- the old global parts list should continue evolving into a nested Browser/scene structure
- current useful depth stays:
  - `graph -> assembly -> object -> part`

This is where the app moves from "graph-aware authoring exists" toward "graph-aware outputs are actually legible and trustworthy."

##### 5. Strengthen The Part / Feature / Driver Stack Toward Production Shape

After Browser foundations and graph-aware outputs are clearer:
- harden `PT`
- harden `FS`
- harden `DR`
- tighten the contract between graph compile output and runtime execution
- continue clarifying how `Part`, drivers, inputs, feature stacks, and outputs should relate

This is the lane that turns the newer object model into a more production-credible system.

### `Later`

#### Fold Hack 4
##### 6. Build The Browser-Side Viewer Workspace

Once graph/document ownership and graph-aware outputs are stable:
- push `VR`
- add richer Browser/viewer controls
- support reference assets like `.obj`, `.glb`, and `.stl`
- restore stronger layer/material/reference workspace behavior

Likely later targets:
- `VR - Phase 5 - Section Cut Reference Workspace And Layer Material Controls`
- `VR - Phase 6 - Multi Part Rendering And Highlighting`

This is where the Browser becomes a stronger Fusion-like navigation and inspection surface rather than only a graph list.

##### 7. Build The Real Legacy Removal Plan

`LEG` should follow the roadmap, not lead it.

Do this after the Browser and graph-aware output lanes are materially established.

At that point:
- identify which legacy paths are truly blocking the roadmap
- mark which ones are only compatibility seams
- remove the ones that no longer support the chosen product direction

##### 8. Return To Broader Vision Expansion

Only after the working lanes above are healthier:
- export depth
- advanced systems
- richer part families
- cleaner workbench / studio feel
- dedicated decision work such as `Collapsed / Essentials / Expanded`



### Roadmap Lanes
#### Fold Hack 4
##### Fold Hack 5
Use this section as the larger chronological view.

Each lane can group multiple phase parts across different prefixes.

Keep each lane at `##` so later planning can fold deeper underneath without running out of heading depth too early.
