# ParaHook Roadmap

## Doc Header
### Fold Hack 3
#### Doc History
25. 2026-03-10 00:00: Added an explicit carry-forward map from `[1.5] SP - Phase 11` into the later Browser workspace, output-structure, build-control, visibility/material, and workspace-presentation phases so the first-pass Browser surface can stay narrow without losing the deferred tasks
24. 2026-03-10 00:00: Added the dedicated `11C` task doc in `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md` so save/load interaction with editors now has its own execution-planning surface after `11A` and `11B`, and the roadmap `Plan.md Status` tracker reflects that created phase doc
23. 2026-03-09 22:37: Expanded the `[2.3]` lane text so the later Browser row build-bar work now has a more explicit carry-forward note there, making it clearer that `11B` only establishes simple dirty/saved state while richer loading/build bars belong in that later Browser/build-control surface
22. 2026-03-09 22:36: Added the follow-up roadmap note that `11B` should stop at Browser cached-entry dirty/saved state while richer Browser row loading/build bars stay deferred to a later Browser/build-control phase instead of being pulled into cached graph lifecycle work
21. 2026-03-09 22:32: Added the dedicated `11B` task doc in `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md` so cached graph lifecycle now has its own execution-planning surface and the roadmap `Plan.md Status` tracker reflects that created phase doc
20. 2026-03-09 22:26: Refreshed the roadmap after the real `11A` implementation, checking the `11A` lane-body persistence-core items that landed and recording that the graph-document save/load core now exists as shipped code rather than only a task doc
19. 2026-03-09 21:55: Added the dedicated `11A` task doc in `docs/Phase-Plans/Tasks/Future/01.06 - GE - Phase 11A.md` so graph-document persistence core now has its own implementation-planning surface and the roadmap `Plan.md Status` tracker reflects that created phase doc
18. 2026-03-09 21:43: Advanced the immediate checklist after the real `9C` cut by marking the single-graph cleanup track complete now that `9A`, `9B`, and `9C` have landed, while keeping later routing, persistence, and ownership work pending
17. 2026-03-09 21:43: Refreshed the roadmap after the real `9C` implementation, marking the dedicated `9C` task doc complete in the plan-doc checklist, checking the `9C` lane-body work items that actually landed, and fixing the stale dedicated-doc totals near the top
16. 2026-03-09 18:51: Added the dedicated `9B` task doc in `docs/Phase-Plans/Tasks/Future/01.04 - SP - Phase 9B.md` so the next Browser-foundation phase now has its own execution-planning surface before implementation starts
15. 2026-03-09 18:13: Refreshed the roadmap after the real `9A.3` implementation and backfilled stale `9A.2` lane-body checklist state so the `9A` roadmap details now match what actually landed in code
14. 2026-03-09 17:43: Added the dedicated `9A.3` task doc in `docs/Phase-Plans/Tasks/Future/01.03 - SP - Phase 9A.3.md` and refreshed roadmap `Plan.md Status` tracking so viewport-binding planning now has its own implementation doc before code work starts
13. 2026-03-09 00:00: Added the dedicated `9A.2` task doc in `docs/Phase-Plans/Tasks/Future/01.02 - SP - Phase 9A.2.md` and refreshed the roadmap `Plan.md Status` counts so the roadmap now distinguishes between created phase docs and not-yet-started phases more accurately
12. 2026-03-09 00:00: Refreshed roadmap checklist status after the real `9A.1` cut, marking the new dedicated phase doc and checking only the roadmap bullets that were actually completed by the first graph-document implementation pass
11. 2026-03-09 00:00: Folded more of the raw `CodexNotes` 5 and 6 decisions into the roadmap, including Browser tree shape, viewport/focus rules, build-vs-view separation, graph output handoff meaning, and later `Sub-Parts` / `Publish / Receive` placement
10. 2026-03-09 00:00: Cleaned roadmap lane boundaries by keeping `[1.5] SP - Phase 11` only in Lane `[1]`, replacing the duplicate Lane `[2]` entry with Browser workspace expansion work, fixing local ordering/readability drift, and adding a later explicit `Publish / Receive` execution slot
9. 2026-03-08 00:00: Updated `[1.3] SP - Phase 10` so the roadmap now reflects the newer planning boundary where `SP` owns graph-local routing/preview memory and later `AS` owns richer output structure and Browser-facing hierarchy
8. 2026-03-08 00:00: Expanded `[1.2] GE - Phase 11` with provisional `11A / 11B / 11C` sub-sections so the roadmap now separates graph-document persistence core, cached-graph lifecycle, and save/load editor interaction work
7. 2026-03-08 00:00: Expanded `Lane [1]` to show the provisional `SP - Phase 9A / 9B / 9C` sub-sections so the Browser-foundation roadmap now reflects the current Session 2 planning breakdown
6. 2026-03-08 00:00: Normalized `Lane [1]` phase-part headings to `[1.N]` numbering and expanded each one into a first-pass mini-plan with `Summary`, `CheckList`, and `Likely Files`
5. 2026-03-08 00:00: Filled `Lane [1]` body with `####` phase-part stubs under `### Lane Body` so the first roadmap lane now has a foldable multi-prefix breakdown surface
4. 2026-03-08 00:00: Added a new bottom `Roadmap Lanes` section and seeded `Lane [1]` at `##` depth so larger chronological work groups can span multiple prefixes while staying fold-friendly for later detailed planning
3. 2026-03-08 00:00: Reworked the roadmap around the new Browser and multi-graph ownership decisions from `5_CodexChat.md`, so the next live lane is now `SP` + `GE` foundations first, followed by `AS` output structure and later `VR` browser/viewer controls
2. 2026-03-08 00:00: Reworked this file into a more normal operator roadmap with `Now / Next / Later` direction, grounded in the finished family phase-plan pass and the current app shape
1. 2026-03-08 00:00: Built this file as the clean human roadmap surface for the immediate three-step direction: finish `DOC - Phase 14F`, rebuild the roadmap, then deepen legacy understanding

#### Purpose

This file is the short human-facing roadmap surface.

Use it to keep the current direction clear after the family `Phase-Plans.md` buildout.

#### Scope

This is not the full long-term product vision.

Use this file for:
- the next real execution lanes
- the current ordering of planning and product work
- the short operator-facing reminder of what should happen next

## Doc Body

### Immediate CheckList

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
    - [ ] `1.5 - SP - Phase 11 - Graphs Panel And Nested Parts`
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
  - [ ] - 1.5 - `SP - Phase 11 - Graphs Panel And Nested Parts`
    - [ ] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`

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

### Master Roadmap CheckList

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

#### Bucket 1 - Lane [1] Browser Foundations And Single-Graph Cleanup

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
    - [ ] `Plan.md Status` `[1.3A]`
  - [x] `Roadmap Breakdown` `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
    - [x] `Decision Coverage` `[1.3B]`
    - [ ] `Plan.md Status` `[1.3B]`
  - [x] `Roadmap Breakdown` `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
    - [x] `Decision Coverage` `[1.3C]`
    - [ ] `Plan.md Status` `[1.3C]`

- [x] `Roadmap Breakdown` `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [x] `Decision Coverage` `[1.4]`
  - [ ] `Plan.md Status` `[1.4]`
  - [x] `Roadmap Breakdown` `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
    - [x] `Decision Coverage` `[1.4A]`
    - [ ] `Plan.md Status` `[1.4A]`
  - [x] `Roadmap Breakdown` `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
    - [x] `Decision Coverage` `[1.4B]`
    - [ ] `Plan.md Status` `[1.4B]`
  - [x] `Roadmap Breakdown` `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
    - [x] `Decision Coverage` `[1.4C]`
    - [ ] `Plan.md Status` `[1.4C]`

- [ ] `Roadmap Breakdown` `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
  - [x] `Decision Coverage` `[1.5]`
  - [ ] `Plan.md Status` `[1.5]`

#### Bucket 2 - Lane [2] Browser Workspace And Project Content Expansion

- [ ] `Roadmap Breakdown` `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - [ ] `Decision Coverage` `[2.1]`
  - [ ] `Plan.md Status` `[2.1]`
- [ ] `Roadmap Breakdown` `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
  - [ ] `Decision Coverage` `[2.2]`
  - [ ] `Plan.md Status` `[2.2]`
- [ ] `Roadmap Breakdown` `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
  - [ ] `Decision Coverage` `[2.3]`
  - [ ] `Plan.md Status` `[2.3]`
- [ ] `Roadmap Breakdown` `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
  - [ ] `Decision Coverage` `[2.4]`
  - [ ] `Plan.md Status` `[2.4]`
- [ ] `Roadmap Breakdown` `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
  - [ ] `Decision Coverage` `[2.5]`
  - [ ] `Plan.md Status` `[2.5]`

#### Bucket 3 - Lane [3] Control, Build, And Workspace Systems

- [ ] `Roadmap Breakdown` `[3.1] DR / JK - Control Viz And Graph-Driven Control Surfaces`
  - [ ] `Decision Coverage` `[3.1]`
  - [ ] `Plan.md Status` `[3.1]`
- [ ] `Roadmap Breakdown` `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
  - [ ] `Decision Coverage` `[3.2]`
  - [ ] `Plan.md Status` `[3.2]`
- [ ] `Roadmap Breakdown` `[3.3] VR / SP - Workspace Presentation Modes`
  - [ ] `Decision Coverage` `[3.3]`
  - [ ] `Plan.md Status` `[3.3]`
- [ ] `Roadmap Breakdown` `[3.4] AS / VR - Advanced Output Types And Later Project Packaging`
  - [ ] `Decision Coverage` `[3.4]`
  - [ ] `Plan.md Status` `[3.4]`
- [ ] `Roadmap Breakdown` `[3.5] GE / SP / AS - Publish / Receive Execution`
  - [ ] `Decision Coverage` `[3.5]`
  - [ ] `Plan.md Status` `[3.5]`

#### Master Totals

- `Roadmap Breakdown`
  - done enough: `16`
  - still needs roadmap planning: `11`
- `Decision Coverage`
  - captured enough: `17`
  - still needs decision write-up: `10`
- `Plan.md Status`
  - dedicated docs already made: `8`
  - still needs dedicated docs: `19`


### RoadMap CheckList Total

Use this as the one-glance planning tracker for the roadmap itself.

Meaning:
- `Roadmap breakdown`
  - `[x]` = this item is already broken down enough inside the roadmap/current notes to count as planned at a roadmap level
  - `[ ]` = this item still needs dedicated planning work even at the roadmap level
- `Plan.md status`
  - `[x]` = this item already has its own dedicated plan/task doc
  - `[ ]` = this item still needs its own dedicated `Plan.md`-style doc, even if roadmap info already exists

#### Lane [1] - Browser Foundations And Single-Graph Cleanup

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
- [ ] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`

#### Lane [2] - Browser Workspace And Project Content Expansion

- [ ] `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
- [ ] `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- [ ] `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- [ ] `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- [ ] `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

#### Lane [3] - Control, Build, And Workspace Systems

- [ ] `[3.1] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- [ ] `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- [ ] `[3.3] VR / SP - Workspace Presentation Modes`
- [ ] `[3.4] AS / VR - Advanced Output Types And Later Project Packaging`
- [ ] `[3.5] GE / SP / AS - Publish / Receive Execution`

#### Dedicated Plan.md CheckList Total

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
  - [ ] `[1.3A] SP - Phase 10A - Graph-Aware Build Identity And Routing`
  - [ ] `[1.3B] SP - Phase 10B - Graph-Local Preview And Build Memory`
  - [ ] `[1.3C] SP - Phase 10C - Graph Output Handoff Surface`
- [ ] `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`
  - [ ] `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`
  - [ ] `[1.4B] GE - Phase 12B - Project Content Tree Ownership`
  - [ ] `[1.4C] GE - Phase 12C - Cross-Graph Ownership Rules`
- [ ] `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts`
- [ ] `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
- [ ] `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- [ ] `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- [ ] `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- [ ] `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
- [ ] `[3.1] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- [ ] `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- [ ] `[3.3] VR / SP - Workspace Presentation Modes`
- [ ] `[3.4] AS / VR - Advanced Output Types And Later Project Packaging`
- [ ] `[3.5] GE / SP / AS - Publish / Receive Execution`

#### Roadmap Breakdown Totals

- Planned enough to count as broken down: `16`
- Still needing dedicated planning: `11`
- Grand total roadmap items tracked here: `27`

#### Dedicated Plan.md Totals

- Already has its own dedicated plan/task doc: `6`
- Already has its own dedicated plan/task doc: `8`
- Still needs its own dedicated plan/task doc: `19`
- Grand total roadmap items tracked here: `27`


## Fold Hack 2
### Fold Hack 3
#### Current State

The family `Phase-Plans.md` buildout is now far enough along that the project has a readable map of:
- what already landed
- where the current architecture really is
- which systems are still partial
- which future work already fits the existing prefix system

The app itself is no longer in the "invent the architecture" stage.

The project is now in the "lock the ownership model, build the Browser foundations, and stop polishing the wrong single-graph assumptions" stage.

### Now

#### 1. Build Browser / Multi-Graph Foundations First

This is now the main live lane.

Primary phase targets:
- `SP - Phase 9 - Graph Document Foundations`
- `SP - Phase 10 - Graph Aware Worker And Preview Routing`
- `SP - Phase 11 - Graphs Panel And Nested Parts`
- `GE - Phase 11 - Graph Persistence And Save Load`
- `GE - Phase 12 - Multi-Document Graph Ownership`

##### 1. Info 

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

#### 2. Clean The Single-Graph Editor Only Where It Helps The Browser

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

#### 3. Keep The Part / Param Object Model Moving Toward The New Truth

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

### Next

#### 4. Make Outputs Graph-Aware And Browser-Aware

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

#### 5. Strengthen The Part / Feature / Driver Stack Toward Production Shape

After Browser foundations and graph-aware outputs are clearer:
- harden `PT`
- harden `FS`
- harden `DR`
- tighten the contract between graph compile output and runtime execution
- continue clarifying how `Part`, drivers, inputs, feature stacks, and outputs should relate

This is the lane that turns the newer object model into a more production-credible system.

### Later

#### 6. Build The Browser-Side Viewer Workspace

Once graph/document ownership and graph-aware outputs are stable:
- push `VR`
- add richer Browser/viewer controls
- support reference assets like `.obj`, `.glb`, and `.stl`
- restore stronger layer/material/reference workspace behavior

Likely later targets:
- `VR - Phase 5 - Section Cut Reference Workspace And Layer Material Controls`
- `VR - Phase 6 - Multi Part Rendering And Highlighting`

This is where the Browser becomes a stronger Fusion-like navigation and inspection surface rather than only a graph list.

#### 7. Build The Real Legacy Removal Plan

`LEG` should follow the roadmap, not lead it.

Do this after the Browser and graph-aware output lanes are materially established.

At that point:
- identify which legacy paths are truly blocking the roadmap
- mark which ones are only compatibility seams
- remove the ones that no longer support the chosen product direction

#### 8. Return To Broader Vision Expansion

Only after the working lanes above are healthier:
- export depth
- advanced systems
- richer part families
- cleaner workbench / studio feel
- dedicated decision work such as `Collapsed / Essentials / Expanded`



### Roadmap Lanes

Use this section as the larger chronological view.

Each lane can group multiple phase parts across different prefixes.

Keep each lane at `##` so later planning can fold deeper underneath without running out of heading depth too early.

# [1] Browser Foundations And Single-Graph Cleanup

Summary:
- Turn the current single-graph app into a real graph-document and Browser-ready foundation before deeper editor polish goes any further.
- This lane establishes the file, graph, and ownership model that later output, Browser, and viewer work will depend on.

### Lane Header 
#### Fold Hack 4

Purpose:
- turn the current single-graph editor into the right foundation for the future `Browser`
- establish graph/document ownership before broad editor polish goes further
- clean the current editor only where that cleanup helps the Browser path

Primary phase families:
- `SP`
- `GE`

Likely phase parts:
- `SP - Phase 9 - Graph Document Foundations`
- `SP - Phase 10 - Graph Aware Worker And Preview Routing`
- `SP - Phase 11 - Graphs Panel And Nested Parts`
- `GE - Phase 11 - Graph Persistence And Save Load`
- `GE - Phase 12 - Multi-Document Graph Ownership`

Lane notes:
- this lane may include some single-graph editor cleanup
- that cleanup should stay in service of Browser readiness
- this is the lane where file / graph / Browser ownership becomes real enough to guide later work

Expected outcome:
- the app is no longer organized around one hidden active graph
- the Browser direction is real enough to plan against
- later `AS` output work can attach to the correct ownership structure
- the spaghetti editor is treated as one or more Browser-coordinated viewports into graph documents rather than one app-wide mode/panel

## Lane [1] Body - `First big Update`

### [1.1] [x] - `SP` - Phase 9 - `Graph Document Foundations`

#### Check List & files
Summary:
- make the editor and app treat a `graph` as a first-class document-like object instead of one hidden active graph
- establish the basic graph container shape that later Browser work can depend on

CheckList:
- [ ] define the first graph-document shape in app state
- [ ] separate graph identity from one implicit editor instance
- [ ] define how a file/project can own one or more graphs
- [ ] prepare the editor/store layer for graph switching without losing authorship truth

##### Files

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

####    [1.1A] - `SP` - Phase 9A - `Graph Document Core`

Summary:
- define the graph document as a real app object
- lock the minimum document shape, identity, and persisted authored graph/canvas truth

#### Check List & files
- [x] make empty graph documents valid
- [x] lock the minimum graph document shape
- [ ] lock graph document identity and parent ownership fields
- [x] define what authored graph/canvas state is persisted

Likely Files:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

##### [1.1A.1] - `SP` - Phase 9A.1 - `Graph Document Shape And Identity`

Summary:
- define the minimum real graph-document object, including identity, version, graph payload, and default origin reference

CheckList:
- [x] lock `graphDocumentId`, `name`, and `version`
- [x] define `graph.nodes` and `graph.edges` as the core payload
- [x] keep empty graph documents valid
- [ ] keep the origin concept as a default `0,0,0` reference

Likely Files:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/store/useAppStore.ts`

##### [1.1A.2] - `SP` - Phase 9A.2 - `Graph-Owned Authored Canvas State`

Summary:
- define exactly what authored graph/canvas state belongs inside the graph document core

CheckList:
- [x] keep node positions inside the graph document
- [x] keep edge wiring/connections inside the graph document
- [x] keep node values/config inside the graph document
- [x] keep node mode state:
  - `collapsed`
  - `essentials`
  - `expanded`

Likely Files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/store/useAppStore.ts`

##### [1.1A.3] - `SP` - Phase 9A.3 - `Viewport Binding And First Singleton Split`

Summary:
- make the editor point at a graph document by id and begin splitting the first singleton graph/store seams

CheckList:
- [x] bind editor viewports by `graphDocumentId`
- [x] stop treating `useSpaghettiStore.graph` as the only real graph
- [x] start moving spaghetti document memory out of one app-global bucket
- [x] avoid pulling full Browser/persistence work into this slice

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`

####    [1.1B] - `SP` - Phase 9B - `Multi-Editor Browser Foundation`
#### Check List & files
##### Check List & files
Summary:
- break the one-spaghetti-window assumption
- establish the first real Browser-coordinated multi-editor foundation

CheckList:
- [x] allow more than one graph editor surface to exist
- [x] make focus follow the editor the user is actively working in
- [x] make focus follow the last clicked viewport, not hover
- [x] raise the focused viewport in z-order
- [x] stop treating spaghetti as one app-wide mode/panel
- [x] let the Browser coordinate open/focused graph editors
- [x] add graph switching through the editor header dropdown
- [x] make the focused graph name the first header dropdown/control
- [x] keep only one `meatball editor view` alive at a time
- [x] move current panel/window behavior toward viewport-local state
- [x] keep viewport-owned state limited to:
  - graph binding
  - window mode
  - focus
  - position/size
  - z-order

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/panels/SpaghettiPanel.tsx`

####    [1.1C] - `SP` - Phase 9C - `Graph-Local Compile / Preview Preparation`

Summary:
- prepare the compile/build/preview path so Browser foundations do not still collapse into one global graph/output bridge
- keep `9C` as a bridge into later graph-aware routing and output work without pulling those later systems forward

CheckList:
- [x] make compile/build memory graph-local per graph
- [x] make preview-prep memory graph-local per graph
- [x] soften the current one-global spaghetti compile/build seams
- [x] add enough graph-keyed state to hand off cleanly into `SP - Phase 10`
- [x] keep full routing redesign out of `9C`
- [x] keep Browser-facing output hierarchy out of `9C`
- [x] keep Browser UI and project-ownership work out of `9C`
- [x] keep build bars, build-control UX, and rich viewer reference/material systems out of `9C`

Deferred lane map:
- `SP - Phase 10`
  - full dispatcher/worker routing redesign
- `AS`
  - Browser-facing output hierarchy
  - final `Component / Assembly / Object / Part` output structure
- `SP - Phase 11`
  - Browser UI work
- later `GE` / project work
  - project ownership refinement
- `Lane [2]` / `Lane [3]`
  - build bars
  - build-control UX
  - rich viewer reference/material systems

Likely Files:
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/shared/buildTypes.ts`

### [1.2] [~] - `GE` - Phase 11 - `Graph Persistence And Save Load`

Summary:
- give graphs a real persistence path so the Browser is not only a live-memory concept
- define save/load boundaries before multi-document ownership gets deeper

#### 1.2 Checklist & Files
##### Checklist

CheckList:
- [ ] define the persisted graph document contract
- [ ] define save/load entry points for graph documents
- [ ] keep persisted graph truth separate from viewer-only presentation state
- [ ] confirm graph save/load works with the current compile/build path

##### Files
Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/shared/`
- `src/app/io/`

####    [1.2A] - GE - Phase 11A - Graph Document Persistence Core

Summary:
- implement the real save/load contract for one graph document
- keep the first persistence pass focused on graph-level durable truth

CheckList:
- [x] define the versioned graph-document file format
- [x] validate graph documents on load
- [x] implement graph-document save
- [x] implement graph-document load

Likely Files:
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/shared/`
- `src/app/io/`

####    [1.2B] - GE - Phase 11B - Cached Graph Lifecycle

Summary:
- make cached graph entries behave like a real Browser-owned persistence layer
- connect saved graph documents to live cached graph instances
- allow Browser rows to show simple dirty/saved state
- keep richer Browser row loading/build bars out of `11B`

CheckList:
- [ ] define saved graph versus cached live graph behavior
- [ ] load saved graphs into Browser-owned cached entries
- [ ] support reopen/focus behavior for cached graphs
- [ ] keep cached graph identity stable enough for editor switching
- [ ] allow simple dirty/saved state on cached Browser graph rows
- [ ] defer full Browser row loading/build bars to a later Browser/build-control phase

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/io/`
- `src/shared/`

####    [1.2C] - GE - Phase 11C - Save/Load Interaction With Editors

Summary:
- define how save/load actions affect active editor viewports without turning `GE - Phase 11` into all of Browser
- keep merge/open/swap behavior explicit

CheckList:
- [ ] separate `Open Graph` from `Import Into Current Graph`
- [ ] support `Load Into New Graph`
- [ ] support `Open In New Editor` versus `Swap Current Editor`
- [ ] keep Browser/editor coordination coherent during save/load actions

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

### [1.3] - `SP` - Phase 10 - `Graph Aware Worker And Preview Routing`

Summary:
- make the current worker and preview path graph-aware instead of assuming one global output path
- prepare graph-local output declaration/handoff ownership and graph-local routing
- keep shared worker/viewer services, but route graph-local memory through them by graph identity

#### 1.3 Checklist & Files
##### Checklist

CheckList:
- [ ] route compile/build requests with graph identity
- [ ] make graph compile/build/preview memory graph-local
- [ ] make graph output declaration/handoff ownership graph-local
- [ ] reduce old one-preview / one-assembled / one-global-result assumptions
- [ ] keep build control separate from viewer visibility control
- [ ] keep this phase focused on routing/ownership, not full output hierarchy

##### Files
Likely Files:
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`

#### [1.3A] - SP - Phase 10A - Graph-Aware Build Identity And Routing

Summary:
- route compile/build requests and results with graph identity instead of one global active path

#### 1.3a Checklist & Files
##### Checklist

CheckList:
- [ ] carry graph identity with compile/build requests
- [ ] isolate build state per graph and per build sequence
- [ ] prevent stale or wrong-graph results from overwriting another graph

##### Files
Likely Files:
- `src/app/buildDispatcher.ts`
- `src/worker/worker.ts`
- `src/shared/buildTypes.ts`

##### [1.3B] - `SP - Phase 10B - Graph-Local Preview And Build Memory`

Summary:
- move compile/build/preview memory out of one shared spaghetti bucket and into graph-local ownership

CheckList:
- [ ] move compile/build memory toward graph-local state
- [ ] break one global preview/output bucket assumptions
- [ ] break one global assembled-result assumptions
- [ ] keep app-global, project-local, and graph-local ownership clean

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/bootstrapBuildWiring.ts`

##### [1.3C] - `SP - Phase 10C - Graph Output Handoff Surface`

Summary:
- treat the current `OutputPreview` concept as the graph's output declaration/handoff surface
- stop short of full later output-structure work

CheckList:
- [ ] make each graph own its own output declaration/handoff surface
- [ ] hand graph-owned outputs upward toward Browser/project visibility
- [ ] defer richer object/assembly/sub-part hierarchy work to later `AS`

Likely Files:
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/`
- `src/app/spaghetti/ui/`
- `src/app/store/useAppStore.ts`

### [1.4] - `GE` - Phase 12 - `Multi-Document Graph Ownership`

#### 1.4 Checklist & Files
##### Checklist
Summary:
- define the ownership model for multiple graphs and later multiple files/projects
- make the Browser hierarchy structurally real rather than only visual
- keep the project layer small but honest:
  - `projectFileId`
  - `name`
  - `version`
  - `graphDocuments`
  - `rootAssembly`

##### Files
CheckList:
- [ ] define app truth as a list of graph documents
- [ ] define the higher file/project layer above graphs
- [ ] define ownership boundaries between files, graphs, outputs, and viewer references
- [ ] confirm `Publish / Receive` does not break graph ownership rules
- [ ] keep external reference assets outside `Project File` ownership in the first pass

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`
- `src/app/protocol.ts`

##### [1.4A] - `GE - Phase 12A - Project File Core And Graph Collection Ownership`

Summary:
- define the minimum `Project File` shape and how it owns multiple graph documents without collapsing them back into one active graph

CheckList:
- [ ] define the minimum `Project File` shape
- [ ] define project-local graph collection ownership
- [ ] define cached/active graph lifecycle at the project layer

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/protocol.ts`

##### [1.4B] - `GE - Phase 12B - Project Content Tree Ownership`

Summary:
- define the project-local content tree and how graphs publish `Components` upward into project-owned assemblies, objects, and parts

CheckList:
- [ ] define project-local Browser tree ownership
- [ ] define `Component` as the graph-produced bundle
- [ ] define how project-level assembly/object parenting works above graph-authored content

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`
- `src/app/protocol.ts`

##### [1.4C] - `GE - Phase 12C - Cross-Graph Ownership Rules`

Summary:
- define how graph documents communicate and coexist inside one project without breaking ownership boundaries

CheckList:
- [ ] define `Publish / Receive` ownership rules across graph documents
- [ ] define `Link` versus `Hard Copy`
- [ ] break singleton graph-store assumptions that block project-level ownership

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`

### [1.5] - `SP` - Phase 11 - `Graphs Panel And Nested Parts`

Summary:
- create the first real `Browser`-facing hierarchy surface for graphs and their outputs
- replace the older flat parts-list direction with nested graph/object/part structure
- keep the Browser headed toward a recursive project-content tree, even if the first pass stays simpler
- count the first pass as real when the Browser becomes an honest hierarchy tree for graphs and their first visible outputs, not only a graph launcher

Carry-forward note:
- keep the first pass narrow on purpose:
  - `SP - Phase 11`
    - docked Browser tree
    - stable graph rows
    - expandable graph rows
    - at least one visible child-output level
    - clear open/focused graph state
- defer the richer work into the later roadmap instead of letting it disappear:
  - full project-file ownership
    - `GE - Phase 12`
  - richer Browser workspace behavior, row interaction, and Browser-to-editor / Browser-to-viewer coordination polish
    - `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
  - deeper Browser-facing output structure and final nesting direction
    - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
  - build bars and richer Browser build-status surfaces
    - `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
    - later `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
  - materials and richer visibility controls
    - `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
  - broader workspace presentation polish
    - `[3.3] VR / SP - Workspace Presentation Modes`

#### 1.5 Checklist & Files
##### Checklist
CheckList:
- [ ] build the first graph list / Browser panel surface
- [ ] show nested graph outputs under each graph
- [ ] make the Browser feel like a real docked hierarchy tree rather than only a graph launcher
- [ ] keep the Browser able to grow toward:
  - `Project File -> Assembly tree -> Components / Objects -> Parts`
- [ ] prepare nesting for `object` and `part` rows
- [ ] reflect open/focused graph state clearly in the Browser
- [ ] keep graph-authored output structure separate from project-level placement/nesting
- [ ] leave room for later reference assets, assemblies, visibility, and material controls

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/panels/`
- `src/app/components/`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

# [2] `Browser Workspace And Project Content Expansion`

Summary:
- Turn the new ownership model into a usable Browser workspace with visible project content, graph outputs, and richer viewer-side controls.
- This lane expands into Browser structure, output hierarchy, build/view controls, reference assets, and later material-oriented workflow surfaces.

### Lane Header
#### Fold Hack 4

Purpose:
- take the work explicitly deferred out of `GE - Phase 12` and turn it into real Browser-facing project/content features
- expand from ownership definitions into usable project navigation, output structure, visibility control, and reference workspace behavior

Primary phase families:
- `SP`
- `AS`
- `VR`

Why this lane exists:
- `GE - Phase 12` now stops at ownership and containment
- `SP - Phase 11` remains the final Browser-foundation surface inside Lane `[1]`
- this lane is where the app starts turning that ownership model into the richer Browser/workspace experience

Expected outcome:
- the Browser becomes a real project-content surface rather than only a graph list
- graph outputs become legible as `Components`, `Assemblies`, `Objects`, and `Parts`
- viewer-side reference/material/visibility systems start attaching to the correct project structure

## Lane [2] Body - `Browser/project expansion`

### [2.1] - `VR / SP` - `Browser Workspace Shell And Item Interaction`

Summary:
- expand the first Browser foundation surface into a fuller project workspace with stronger row interaction and inspection affordances
- this is the later home for richer Browser workspace behavior that `SP - Phase 11` should not try to finish in the first hierarchy pass

CheckList:
- [ ] strengthen Browser row interactions beyond the first foundational graph panel
- [ ] add focus, selection, reveal, and row-action behavior that belongs after Lane `[1]`
- [ ] support cleaner Browser-to-editor and Browser-to-viewer coordination
- [ ] add the richer row interaction polish that was intentionally deferred out of the first `SP - Phase 11` pass
- [ ] keep ownership and content hierarchy rules anchored to the completed Lane `[1]` model

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/panels/`
- `src/app/components/`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

### [2.2] - `AS` - Phase 5 - `Browser-Facing Graph Output Structure`

Summary:
- turn graph output handoff into a clearer Browser-facing content structure built around `Component`, `Assembly`, `Object`, and `Part`
- keep `Component` as the graph-produced bundle that the project composes upward
- this is the later home for the deeper nesting and final Browser-facing structure that the first `SP - Phase 11` pass should not have to lock yet

CheckList:
- [ ] map graph output declarations into Browser-visible project content
- [ ] define first-pass `Component -> Object -> Part` display structure
- [ ] decide the deeper/final nesting direction after the first `SP - Phase 11` Browser tree exists
- [ ] support optional `Assembly` grouping above components/objects
- [ ] keep later `Sub-Parts` and `Sub-Components` out of first implementation
- [ ] treat later `Sub-Parts` as a derived split layer under `Part`, not as a first-pass top-level Browser concept

Likely Files:
- `src/app/spaghetti/selectors/`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`

### [2.3] - `AS` - Phase 6 - `Project Content Inspection And Build Control Surface`

Summary:
- expose project-content inspection and build-oriented controls for Browser rows without collapsing back into one flat parts list
- this is the better later home for richer Browser row loading/build bars after `11B` only establishes simple dirty/saved cached-entry state
- this is also the main later home for build-oriented Browser row surfaces intentionally deferred out of the first `SP - Phase 11` Browser hierarchy pass

Carry-forward note:
- `11B`
  - Browser cached graph rows may show simple `dirty/saved` state
- `[1.5]`
  - the first Browser hierarchy pass should not try to finish build bars or richer build-status rows
- `[2.3]`
  - this is where richer Browser row loading/build bars should live later
  - treat those bars as build/runtime inspection UI, not cached-graph lifecycle UI

CheckList:
- [ ] show graph/component/object/part build state in the Browser
- [ ] prepare per-row build bars and build-status surfaces
- [ ] carry richer Browser row loading/build bars here instead of pulling them back into `11B`
- [ ] separate build controls from view controls in the Browser
- [ ] keep `generate/build on-off` separate from `view on-off`
- [ ] leave room for later item actions like isolate, rename, and export

Likely Files:
- `src/app/components/BuildStatsDrawer.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildStatsKeys.ts`

### [2.4] - `VR` - Phase 5 - `Reference Asset Workspace And Project View Layers`

Summary:
- bring reference assets back into the viewer/Browser workspace as clearly separate non-project-owned context layers

CheckList:
- [ ] add Browser/viewer sections for external reference assets
- [ ] keep references outside `Project File` ownership in the first pass
- [ ] support `.obj`, `.glb`, and `.stl` reference loading as workspace context
- [ ] add basic project-versus-reference visibility separation

Likely Files:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/panels/`
- `src/app/store/useAppStore.ts`

### [2.5] - `VR` - Phase 6 - `Browser Controls, Materials, And Rich Visibility`

Summary:
- add the richer Browser/viewer item controls that were intentionally excluded from `GE - Phase 12`
- this is the later home for materials and richer visibility controls that the first `SP - Phase 11` Browser pass should leave out

CheckList:
- [ ] add per-row visibility/material/selectability controls
- [ ] pick up the richer Browser row controls that were intentionally deferred out of the first `SP - Phase 11` pass
- [ ] prepare project-level material access without forcing it into core ownership work
- [ ] add richer Browser interactions and context-menu actions
- [ ] keep full project packaging and asset-in-project export as a still-later concern

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/panels/`
- `src/viewer/Viewer.ts`
- `src/app/store/useAppStore.ts`

# [3] `Control, Build, And Workspace Systems`

Summary:
- capture the deeper control, build orchestration, and workspace features that were discussed during planning but do not belong inside the Browser foundation lanes yet
- keep these systems visible on the roadmap so they can become real later phases instead of staying as scattered notes

### Lane Header
#### Fold Hack 4

Purpose:
- hold the bigger deferred systems around:
  - control-viz and Jake-style control surfaces
  - build sequencing and build bars
  - workspace presentation modes
  - advanced output/project packaging

Primary phase families:
- `DR`
- `JK`
- `AS`
- `VR`

Expected outcome:
- the roadmap keeps room for the systems that govern:
  - control surfaces
  - build sequencing
  - workspace presentation
  - richer output/export behavior

## Lane [3] Body - `later control/build/workspace placeholder`

### [3.1] - `DR / JK` - `Control Viz And Graph-Driven Control Surfaces`

Summary:
- later lane for control-viz spheres, graph-linked controls, driver authority rules, and the deeper convergence between Spaghetti and Jake mode

CheckList:
- [ ] define control-viz sphere ownership and outputs
- [ ] define source control vs downstream offset rules
- [ ] define how control surfaces drive graph params cleanly

### [3.2] - `AS / SP` - `Build Sequencing, Build Bars, And Output Build Control`

Summary:
- later lane for per-part build bars, staged build sequencing, rebuild policies, and mesh/combine control above the current graph-local build memory work

CheckList:
- [ ] expose per-part/per-object build progress
- [ ] define build-sequence control surfaces
- [ ] define deferred mesh/combine behavior across objects/assemblies

### [3.3] - `VR / SP` - `Workspace Presentation Modes`

Summary:
- later lane for `Collapsed / Essentials / Expanded`, cleaner inspectors/toolbars, and other ways to keep the main canvas clean while preserving deep inspectability
- this is the longer-range home for broader workspace-presentation polish after the first Browser hierarchy surface and the first richer Browser workspace pass exist

CheckList:
- [ ] define `Collapsed / Essentials / Expanded`
- [ ] define what stays in canvas vs separate panels
- [ ] carry broader workspace-presentation polish here instead of forcing it into the first `SP - Phase 11` Browser pass
- [ ] define saved workspace/presentation modes later if still useful

### [3.4] - `AS / VR` - `Advanced Output Types And Later Project Packaging`

Summary:
- later lane for non-solid outputs, richer project-file export packaging, and optional inclusion of imported assets in project export

CheckList:
- [ ] support outputs beyond solids later
- [ ] define project-file packaging/export behavior
- [ ] define when imported assets can become project-owned export content

### [3.5] - `GE / SP / AS` - `Publish / Receive Execution`

Summary:
- later lane for turning the locked `Publish / Receive` ownership model into real graph-to-graph behavior with clear link versus hard-copy execution rules

CheckList:
- [ ] implement `Publish / Receive` graph-to-graph data flow with stable identity
- [ ] support `Link` versus `Hard Copy` behavior explicitly
- [ ] keep Browser/project ownership coherent when received data is nested into project content
- [ ] define export restrictions or conversion requirements for linked receive-data
