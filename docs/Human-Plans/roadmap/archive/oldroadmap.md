# ParaHook Roadmap

## Doc Header
### Fold Hack 3
#### FOld Hack 4
###### Doc History
62. 2026-03-15 23:04: Broke the shipped UI cleanup wave into labeled roadmap subphases inside the live lane sections, grouping the implemented work under `[2.1C]`, `[2.1D]`, `[2.1E]`, `[2.3]`, and `[3.3]` so the Browser/editor shell cleanup, build/save row surfaces, and workspace-presentation systems now have clearer lane-level homes
61. 2026-03-15 23:00: Reconciled the live Lane `[2.1]` roadmap state against the shipped Browser and Spaghetti UI cleanup wave, marking `[2.1C]` complete, keeping `[2.1D]` as the active partial shell/UI lane instead of missing, and moving `[2.1E]` out of the stale not-started state so the fixed-slot left-dock docking pass reads as landed with only a small follow-up tail remaining
60. 2026-03-12 20:40: Added `[2.1E] VR / SP - Dockable Left Panels And In-App Floating Panel Shell` as the next shared left-dock shell follow-up after the first Browser popout work and the active `2.1D` Spaghetti shell wave, creating a dedicated future task doc that locks one reusable in-app dock/floating system for the `Browser` and docked `meatball editor` instead of treating Browser re-docking as a one-off patch
59. 2026-03-12 18:32: Compiled the shipped Spaghetti editor UI cleanup back into `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes`, marking that lane slice as actively in progress now that the first-pass titlebar controls, meatball/split/maximize behavior, internal toolbar restructuring, and shell-polish follow-ups have landed in code
58. 2026-03-12 15:38: Expanded `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes` with a true header-only `collapsed` mode, clarifying that the new `__` button should hide the editor body while leaving the top bar visible over the model viewport and explicitly distinguishing that state from the separate docked `meatball editor view`
57. 2026-03-12 15:31: Tightened `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes` with an explicit split-mode transition matrix, defining what `meatball editor view`, `X`, detached/new-browser, split-toggle, and maximize should each do when the editor is already docked in the top/bottom split layout
56. 2026-03-12 15:26: Expanded `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes` again so the new half-height split mode is no longer just a fixed 50/50 docked layout; it now explicitly requires a user-adjustable divider between the top model viewport and the bottom `Spaghetti Editor` pane
55. 2026-03-12 15:22: Expanded `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes` so the floating-editor titlebar plan now also includes a half-height split-view action that docks the editor into the lower half of the current app window while the viewport owns the upper half, explicitly distinguishing that mode from the normal floating overlay behavior
54. 2026-03-12 15:15: Added `[2.1D] VR / SP - Spaghetti Floating Window Controls And View Modes` under Lane `[2.1]`, giving the next Spaghetti titlebar/window-state cleanup a natural roadmap home for in-app minimize/maximize/close behavior while explicitly deferring true detached/new-browser editor windows to `SP - Phase 13`
53. 2026-03-12 14:24: Updated Lane `[2.1]` so the newly identified Fusion-style Browser cleanup has a natural roadmap home as `[2.1C] VR / SP - Browser Row Action Cleanup And Context Menus`, clarifying that row-action decluttering belongs with Browser interaction work rather than later `[3.3]` workspace-presentation polish and refreshing the roadmap trackers to include that new follow-up cut
52. 2026-03-12 14:15: Implemented `[2.1B] SP / VR - Browser, Editor, And Shared Viewer Coordination`, adding explicit Browser `Reveal` actions for graph and published-output rows, reusing the existing graph-scoped `viewerTargetGraphDocumentId` reveal path when shared composition is inactive, showing read-only shared-composition participation status in Browser rows, and closing the main shipped work for `[2.1]` as the combined `2.1A + 2.1B` Browser workspace wave
51. 2026-03-12 14:06: Added the dedicated `02.1B - SP-VR - Browser, Editor, And Shared Viewer Coordination.md` execution spec, locking the remaining coordination half of `[2.1]` around explicit `Reveal`, read-only shared-composition status, graph-scoped viewer targeting, and the rule that Browser row click stays selection-only while editor movement remains action-driven
50. 2026-03-12 13:58: Implemented `[2.1A] VR - Browser Workspace Shell And Row Interaction`, landing a shared Browser row-shell contract, Browser-local row selection, explicit graph `Open` and viewport `Focus` actions, and the first calm graph-focused row rollout in `BrowserPanel`, while leaving `[2.1B]` as the remaining coordination cut in Lane `[2]`
49. 2026-03-12 13:40: Added the dedicated `02.1A - VR - Browser Workspace Shell And Row Interaction.md` execution spec, locking the first Browser-local row/workspace-shell cut for Lane `[2]` and updating the roadmap trackers so `[2.1A]` now counts as decision-complete with its own implementation-ready plan doc while `[2.1B]` stays open
48. 2026-03-13 10:48: Finished the final `ASS#` pass for `[2.1]`, locking the shared `VR` and `SP` Browser-workspace questions, creating the dedicated `02.1 - VR-SP - Browser Workspace Shell And Item Interaction.md` future task doc, and marking `[2.1]` as both decision-complete and plan-doc-created in the roadmap trackers
47. 2026-03-13 10:18: Added a `Lane 1 -> Later Lanes` handoff block at the end of Lane `[1]`, grouping everything intentionally deferred out of the Browser/ownership foundation wave by later home so the transition into Lane `[2]` and Lane `[3]` reads as one explicit carry-forward list instead of scattered reminders
46. 2026-03-13 10:06: Refreshed the roadmap after the real `SP - Phase 11` implementation, marking `[1.5]` complete in the lane body and checklist surfaces now that the Browser ships a `Graph Documents` branch with expandable graph rows, published graph output child rows, and clear graph open/focused state without pulling later Browser workspace or output-structure work forward
45. 2026-03-13 00:06: Added the dedicated `01.5 - SP - Phase 11.md` future task doc after the `ASS#` loop refreshed the `SP 11` planning surface, so `[1.5]` now counts as having a created task doc in the roadmap trackers even though the phase itself is still not implemented
44. 2026-03-12 23:44: Refreshed the roadmap after the real `SP - Phase 12` implementation, adding `[1.6] Shared Viewport Composition` into Lane `[1]`, marking its roadmap/decision/doc status complete, and recording that the shared viewer now supports explicit multi-graph composition with focus-independent membership and fallback to the old single viewer-target path
43. 2026-03-11 20:56: Refreshed the roadmap after the real `12B` implementation, marking `[1.4B]` complete in the lane body now that `useAppStore` owns first-pass project content, `rootAssemblyId` points to one real root assembly record, resolved graph outputs lift into project-owned components, and the Browser reads a thin project-content surface above graph-owned publication
42. 2026-03-11 18:10: Reworked the dedicated `12B` task doc in `docs/Phase-Plans/Tasks/Old/01.4b - GE - Phase 12b.md` into a decision-complete implementation spec, and refreshed the roadmap `Plan.md Status` tracker so `[1.4B]` now counts as having a real phase doc
41. 2026-03-11 17:40: Refreshed the roadmap after the real `12A` implementation, marking `[1.4A]` complete in the lane body now that the app owns a first in-memory `ProjectFile`, project graph membership is explicit above graph runtime state, and spaghetti graph-aware build routing no longer defaults to the fake legacy runtime project id
40. 2026-03-11 17:18: Added the dedicated `12A` task doc in `docs/Phase-Plans/Tasks/Future/01.4A - GE - Phase 12A.md` so project file core and graph collection ownership now has its own implementation-ready execution spec, and refreshed the roadmap `Plan.md Status` tracker to reflect that created phase doc
39. 2026-03-11 16:34: Marked the lane-body `GE - Phase 11 - Graph Persistence And Save Load` section complete now that `11A`, `11B`, and `11C` are all shipped, while intentionally leaving the parent `[1.2]` `Plan.md Status` tracker unchanged because there is still no separate umbrella `1.2` task doc
38. 2026-03-11 16:21: Refreshed the roadmap after the real `10C` implementation, marking `[1.3C]` and the lane-body `SP - Phase 10` output-handoff items complete now that graph-owned published output surfaces exist in spaghetti runtime state and the current output-facing read surfaces no longer reconstruct publication meaning independently
37. 2026-03-11 13:43: Added the dedicated `10C` task doc in `docs/Phase-Plans/Tasks/Future/01.3C - SP - Phase 10C.md` so graph output handoff now has its own implementation-ready execution spec, and refreshed the roadmap `Plan.md Status` tracker and dedicated-doc totals to reflect that created phase doc
36. 2026-03-11 12:28: Refreshed the roadmap checklist markers after the family-doc alignment pass so `[1.5]` and the later Browser/output/workspace carry-forward items now count as roadmap-broken-down entries while still remaining unchecked for decision coverage and dedicated task-doc status
35. 2026-03-11 11:16: Refreshed the roadmap after the real `10B` implementation, marking the `[1.3B]` lane-body subphase complete now that accepted spaghetti build outputs are graph-local, the shared viewer reads from explicit viewer-target state, and the main spaghetti read surfaces no longer depend on app-global spaghetti `parts` as canonical runtime truth
34. 2026-03-11 04:00: Reworked the dedicated `10B` task doc in `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md` into an implementation-ready execution spec grounded in the locked family decisions and the live `useAppStore` / `ViewerHost` / `useSpaghettiStore` seams that still keep spaghetti preview/build memory too global after `10A`
33. 2026-03-11 03:10: Added the dedicated `10B` task doc in `docs/Phase-Plans/Tasks/Future/01.3B - SP - Phase 10B.md` so graph-local preview/build memory now has its own planning surface, and refreshed the roadmap `Plan.md Status` tracker to reflect that created phase doc
32. 2026-03-11 03:00: Refreshed the roadmap after the real `10A` implementation by marking the `[1.3A]` lane-body subphase complete now that graph-aware build identity, per-graph stale-drop routing, graph-routed app entry points, and the first routing proof-bar tests exist in shipped code
31. 2026-03-11 01:40: Added the dedicated `10A` task doc in `docs/Phase-Plans/Tasks/Future/01.3A - SP - Phase 10A.md` so graph-aware build identity and routing now has its own implementation-planning surface, and refreshed the roadmap `Plan.md Status` tracker to reflect that created phase doc
30. 2026-03-11 00:35: Refreshed the roadmap after the real `11C` implementation by marking the `[1.2C]` lane-body phase complete now that explicit Browser/editor save-load actions, focused-editor save targeting, clone-on-load graph copies, and explicit new-editor versus swap behavior exist in shipped code
29. 2026-03-10 00:00: Refreshed the roadmap after the real `11B` implementation, marking the cached-graph lifecycle lane body items complete now that Browser-backed cached entries, dirty/saved row state, and first-pass Browser file load/save actions exist in shipped code
28. 2026-03-10 00:00: Normalized the roadmap format note and phase-heading convention so roadmap titles also carry `[ ] / [~] / [x]` status markers for folded list views
27. 2026-03-10 00:00: Added a header-level format note locking the roadmap fold-depth pattern so lane bodies, phase entries, and per-phase `Summary / Checklist / Files` sections stay optimized for heading-level list views
26. 2026-03-10 00:00: Added a first-pass legacy phase-out carry-forward plan into the roadmap by attaching cleanup/removal tasks to the later Browser, build-contract, workspace, and final cleanup phases instead of creating a separate lane too early
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

##### Purpose

This file is the short human-facing roadmap surface.

Use it to keep the current direction clear after the family `Phase-Plans.md` buildout.

##### Scope

This is not the full long-term product vision.

Use this file for:
- the next real execution lanes
- the current ordering of planning and product work
- the short operator-facing reminder of what should happen next

Related setup/structure doc:
- `docs/Human-Plans/roadmap/Roadmap-Setup.md`
  - use this when you want to move format/meta/tracker structure out of `roadmap.md` without changing the live lane body

##### Format Note

Use heading depth intentionally so the roadmap can be re-viewed as different folded lists with editor heading controls.

Preferred pattern:
- `##`
  - lane body
- `###`
  - phase or subphase entry
- `####`
  - section bucket such as `Summary`
- `#####`
  - foldable detail buckets such as `Checklist` and `Files`
- phase/subphase headings should also carry status markers when possible:
  - `[ ]`
    - not started
  - `[~]`
    - in progress / partial
  - `[x]`
    - complete

Keep this pattern consistent where possible so `Ctrl+2`, `Ctrl+3`, and `Ctrl+4` views remain useful.


# [1] `Browser Foundations And Single-Graph Cleanup`

Summary:
- Turn the current single-graph app into a real graph-document and Browser-ready foundation before deeper editor polish goes any further.
- This lane establishes the file, graph, and ownership model that later output, Browser, and viewer work will depend on.

### Lane Header 
#### Fold Hack 4
##### Fold Hack 5

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

## Lane [1] Body - `Restructure`

### [1.1] [x] - `SP` - Phase 9 - `Graph Document Foundations`

#### Summary
Summary:
- make the editor and app treat a `graph` as a first-class document-like object instead of one hidden active graph
- establish the basic graph container shape that later Browser work can depend on
##### Checklist and files
CheckList:
- [ ] define the first graph-document shape in app state
- [ ] separate graph identity from one implicit editor instance
- [ ] define how a file/project can own one or more graphs
- [ ] prepare the editor/store layer for graph switching without losing authorship truth


Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

####    [1.1A] [x] - `SP` - Phase 9A - `Graph Document Core`

Summary:
- define the graph document as a real app object
- lock the minimum document shape, identity, and persisted authored graph/canvas truth

##### Check List & files
- [x] make empty graph documents valid
- [x] lock the minimum graph document shape
- [ ] lock graph document identity and parent ownership fields
- [x] define what authored graph/canvas state is persisted

Likely Files:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

##### [1.1A.1] [x] - `SP` - Phase 9A.1 - `Graph Document Shape And Identity`

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

##### [1.1A.2] [x] - `SP` - Phase 9A.2 - `Graph-Owned Authored Canvas State`

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

##### [1.1A.3] [x] - `SP` - Phase 9A.3 - `Viewport Binding And First Singleton Split`

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

####    [1.1B] [x]  - `SP` - Phase 9B - `Multi-Editor Browser Foundation`
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

####    [1.1C] [x] - `SP` - Phase 9C - `Graph-Local Compile / Preview Preparation`

Summary:
- prepare the compile/build/preview path so Browser foundations do not still collapse into one global graph/output bridge
- keep `9C` as a bridge into later graph-aware routing and output work without pulling those later systems forward
##### Info
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

### [1.2] [x] - `GE` - Phase 11 - `Graph Persistence And Save Load`

##### Summary
Summary:
- give graphs a real persistence path so the Browser is not only a live-memory concept
- define save/load boundaries before multi-document ownership gets deeper

CheckList:
- [x] define the persisted graph document contract
- [x] define save/load entry points for graph documents
- [x] keep persisted graph truth separate from viewer-only presentation state
- [x] confirm graph save/load works with the current compile/build path

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/shared/`
- `src/app/io/`

####    [1.2A] [x] - GE - Phase 11A - `Graph Document Persistence Core`

##### Info

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

####    [1.2B] [x] - GE - Phase 11B - `Cached Graph Lifecycle`

Summary:
- make cached graph entries behave like a real Browser-owned persistence layer
- connect saved graph documents to live cached graph instances
- allow Browser rows to show simple dirty/saved state
- keep richer Browser row loading/build bars out of `11B`

##### Info
CheckList:
- [x] define saved graph versus cached live graph behavior
- [x] load saved graphs into Browser-owned cached entries
- [x] support reopen/focus behavior for cached graphs
- [x] keep cached graph identity stable enough for editor switching
- [x] allow simple dirty/saved state on cached Browser graph rows
- [x] defer full Browser row loading/build bars to a later Browser/build-control phase

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/io/`
- `src/shared/`

####    [1.2C] [x] - GE - Phase 11C - `Save/Load Interaction With Editors`

Summary:
- define how save/load actions affect active editor viewports without turning `GE - Phase 11` into all of Browser
- keep merge/open/swap behavior explicit

##### Info
CheckList:
- [x] separate `Open Graph` from `Import Into Current Graph`
- [x] support `Load Into New Graph`
- [x] support `Open In New Editor` versus `Swap Current Editor`
- [x] keep Browser/editor coordination coherent during save/load actions

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

### [1.3] [x] - `SP` - Phase 10 - `Graph Aware Worker And Preview Routing`

#### Summary

CheckList:
- [x] route compile/build requests with graph identity
- [x] make graph compile/build/preview memory graph-local
- [x] make graph output declaration/handoff ownership graph-local
- [x] reduce old one-preview / one-assembled / one-global-result assumptions
- [x] keep build control separate from viewer visibility control
- [x] keep this phase focused on routing/ownership, not full output hierarchy


Likely Files:
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`
Summary:
- make the current worker and preview path graph-aware instead of assuming one global output path
- prepare graph-local output declaration/handoff ownership and graph-local routing
- keep shared worker/viewer services, but route graph-local memory through them by graph identity

####    [1.3A] [x] - SP - Phase 10A - Graph-Aware Build Identity And Routing

Summary:
- route compile/build requests and results with graph identity instead of one global active path


CheckList:
- [x] carry graph identity with compile/build requests
- [x] isolate build state per graph and per build sequence
- [x] prevent stale or wrong-graph results from overwriting another graph

Likely Files:
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/worker/worker.ts`
- `src/shared/buildTypes.ts`

####    [1.3B] [x] - `SP - Phase 10B - Graph-Local Preview And Build Memory`

Summary:
- move compile/build/preview memory out of one shared spaghetti bucket and into graph-local ownership

CheckList:
- [x] move accepted spaghetti build/preview memory into graph-local runtime state
- [x] make the shared viewer resolve spaghetti preview from explicit viewer-target state
- [x] stop app-global spaghetti `parts` from being canonical preview/build truth
- [x] keep shared viewer presentation state separate from graph-local runtime truth

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/bootstrapBuildWiring.ts`

####    [1.3C] [x] - `SP - Phase 10C - Graph Output Handoff Surface`

Summary:
- treat the current `OutputPreview` concept as the graph's output declaration/handoff surface
- stop short of full later output-structure work

CheckList:
- [x] make each graph own its own output declaration/handoff surface
- [x] hand graph-owned outputs upward toward Browser/project visibility
- [x] defer richer object/assembly/sub-part hierarchy work to later `AS`

Likely Files:
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/`
- `src/app/spaghetti/ui/`
- `src/app/store/useAppStore.ts`

### [1.4] [x] - `GE` - Phase 12 - `Multi-Document Graph Ownership`

#### 1.4 Checklist & Files

Summary:
- shipped the `GE - Phase 12` ownership wave through `12A`, `12B`, and `12C`
- made project-above-graphs ownership real with:
  - `Project File`
  - graph collection membership
  - project content ownership
  - cross-graph ownership rules
- kept the project layer small but honest in the first pass:
  - `projectFileId`
  - `name`
  - `version`
  - `graphDocuments`
  - `rootAssemblyId`
- kept later reference-asset ownership and richer publish/receive workflow UX deferred beyond this lane


CheckList:
- [x] define app truth as a list of graph documents
- [x] define the higher file/project layer above graphs
- [x] land `12A` project file core and graph collection ownership
- [x] land `12B` project content tree ownership
- [x] land `12C` cross-graph ownership rules
- [x] define ownership boundaries between files, graphs, outputs, and viewer references
- [x] confirm `Publish / Receive` does not break graph ownership rules in the first linked-reference pass
- [x] keep external reference assets outside `Project File` ownership in the first pass

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/outputSurface.ts`

####    [1.4A] [x] - `GE - Phase 12A - Project File Core And Graph Collection Ownership`

Summary:
- define the minimum `Project File` shape and how it owns multiple graph documents without collapsing them back into one active graph

CheckList:
- [x] define the minimum `Project File` shape
- [x] define project-local graph collection ownership
- [x] define cached/active graph lifecycle at the project layer

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/protocol.ts`

####    [1.4B] [x] - `GE - Phase 12B - Project Content Tree Ownership`

Summary:
- define the project-local content tree and how graphs publish `Components` upward into project-owned assemblies, objects, and parts

CheckList:
- [x] define project-local Browser tree ownership
- [x] define `Component` as the graph-produced bundle
- [x] define how project-level assembly/object parenting works above graph-authored content

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/store/useAppStore.test.ts`

####    [1.4C] [x] - `GE - Phase 12C - Cross-Graph Ownership Rules`

Summary:
- made cross-graph ownership real by storing graph-authored receive references on graph documents and resolving them against explicit published-output ids
- kept source graph publication ownership separate from receiving-graph authored intent and project/browser-derived composition
- added first-pass unresolved linked-receive behavior without depending on active graph, viewer target, or focused viewport state

CheckList:
- [x] define `Publish / Receive` ownership rules across graph documents
- [x] define `Link` versus `Hard Copy`
- [x] break singleton graph-store assumptions that block project-level ownership

Likely Files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`

### [1.5] [x] - `SP` - Phase 11 - `Graphs Panel And Nested Parts`

##### Summary

Summary:
- shipped the first real `Browser`-facing hierarchy surface for graphs and their published outputs
- the Browser now shows `Project -> Graph Documents -> graph rows -> published graph output rows`
- graph rows remain the Browser-owned navigation tree while child rows stay graph-owned publication reads from `GraphOutputSurface`
- this first pass is real because the Browser is no longer only a graph launcher, but it still stops short of full project-content nesting or richer Browser workspace controls

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
- [x] build the first graph list / Browser panel surface
- [x] show nested graph outputs under each graph
- [x] make the Browser feel like a real docked hierarchy tree rather than only a graph launcher
- [x] keep the Browser able to grow toward:
  - `Project File -> Assembly tree -> Components / Objects -> Parts`
- [x] prepare nesting for `object` and `part` rows
- [x] reflect open/focused graph state clearly in the Browser
- [x] keep graph-authored output structure separate from project-level placement/nesting
- [x] leave room for later reference assets, assemblies, visibility, and material controls

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/app/spaghetti/outputSurface.ts`

### [1.6] [x] - `SP` - Phase 12 - `Shared Viewport Composition`

##### Summary

Summary:
- ship the first honest shared viewer composition seam above the existing graph-document and viewport foundations
- keep composition truth runtime-owned in the spaghetti coordination layer instead of deriving it from focus state
- let the shared viewer render resolved preview contributions from more than one participating graph document while preserving the current single viewer-target fallback when no shared composition exists

CheckList:
- [x] add explicit shared composition session state above focused viewport state
- [x] make graph documents the first-pass composition members
- [x] add explicit viewport-authored join/leave actions for shared composition membership
- [x] render the resolved union of participating graph preview contributions in the shared viewer
- [x] qualify viewer identities so same-slot outputs from different graphs do not collide
- [x] keep focus changes from silently redefining shared composition membership
- [x] preserve today's single `viewerTargetGraphDocumentId` behavior when no shared composition session exists
- [x] add first-pass tests for explicit membership, duplicate-graph participation, and shared render identity

Likely Files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`

### Lane [1] -> Later Lanes Handoff

Summary:
- Lane `[1]` finished the graph/project/browser/viewer foundations.
- It intentionally did not try to finish the richer Browser workspace, final output hierarchy, build-control systems, or final cleanup work.
- Use this list as the explicit handoff from Lane `[1]` into the next lanes.

Deferred out of Lane `[1]` into Lane `[2]`:
- richer Browser row interaction, reveal behavior, and Browser-to-editor / Browser-to-viewer coordination polish
  - `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
- deeper Browser-facing output/content structure beyond one thin published graph-output row level
  - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- project-content inspection, build-status rows, build bars, and Browser build-control surfaces
  - `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- external reference-asset workspace layers kept outside first-pass `Project File` ownership
  - `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- per-row visibility, materials, selectability, context-menu actions, and richer Browser controls
  - `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

Deferred out of Lane `[1]` into Lane `[3]`:
- graph-driven control-viz and Jake/control-surface convergence
  - `[3.1] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- staged build sequencing, per-output build bars, and the eventual graph-native worker contract
  - `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- broader workspace presentation modes and later panel/tool layout cleanup
  - `[3.3] VR / SP - Workspace Presentation Modes`
- advanced output types and later project packaging/export behavior
  - `[3.4] AS / VR - Advanced Output Types And Later Project Packaging`
- full `Publish / Receive` execution behavior above the shipped ownership rules from `12C`
  - `[3.5] GE / SP / AS - Publish / Receive Execution`
- final removal of the remaining legacy compatibility path after the graph-native workspace fully replaces it
  - `[3.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`

Plain-English rule:
- Lane `[1]` made the app structurally honest.
- Lane `[2]` should make that structure usable.
- Lane `[3]` should add the deeper control, build, packaging, execution, and cleanup systems on top.

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

### [2.1] [~] - `VR / SP` - `Browser Workspace Shell And Item Interaction`

##### Summary

Summary:
- split the first Browser workspace expansion wave into:
  - one `VR`-leaning Browser row/workspace shell cut
  - one `SP / VR` coordination cut for Browser, editor, and shared-viewer behavior
- one `VR / SP` cleanup cut for turning the current row-action-heavy Browser into a calmer tree-first workspace surface
- one `VR / SP` shell/window-state cut for making the floating `Spaghetti Editor` header behave like a real editor window with in-app minimize/maximize/close controls, now partially landed as the active Spaghetti shell and toolbar cleanup wave
- one `VR / SP` shared left-dock shell cut for letting `Browser` and the docked `meatball editor` use the same in-app docked/floating/ghost-preview movement system
- keep all four cuts anchored to the finished Lane `[1]` ownership model instead of re-fighting graph/project truth

CheckList:
- [x] land `[2.1A]` as the first Browser workspace shell and row-interaction cut
- [x] land `[2.1B]` as the first Browser/editor/shared-viewer coordination cut
- [x] land `[2.1C]` as the Browser row-action cleanup and context-menu cut
- [~] land `[2.1D]` as the Spaghetti floating window-controls and view-mode cut
- [~] land `[2.1E]` as the shared dockable left-panel shell cut for `Browser` and `meatball editor`
- [x] keep Browser interaction state separate from graph/project ownership truth
- [x] keep Browser selection separate from editor focus and shared-composition membership
- [ ] reduce Browser/workspace behavior that still depends on the old `Legacy` versus `Spaghetti` split once the graph-native workspace can stand on its own

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/panels/`
- `src/app/components/`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`

### [2.1A] [x] - `VR` - `Browser Workspace Shell And Row Interaction`

##### Summary

Summary:
- shipped the first Browser-local workspace-shell cut by moving graph rows, published output rows, and viewport rows onto one shared row anatomy
- row-body click now creates Browser-local selection instead of silently retargeting editor state
- explicit graph `Open` and viewport `Focus` actions keep movement/focus behavior visible while `Content` stays mostly unchanged

CheckList:
- [x] add lightweight Browser selection state
- [x] apply one calm row anatomy across graph, output, and viewport rows
- [x] add small right-aligned row controls and clear row-state affordances
- [x] keep Browser-local selection separate from editor focus and shared composition
- [x] keep the hierarchy primary and the row controls secondary

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`

### [2.1D] [~] - `VR / SP` - `Spaghetti Floating Window Controls And View Modes`

##### Summary

Summary:
- this lane slice is now the natural home for the shipped Spaghetti shell/UI cleanup wave, not just the original floating-window-control concept
- replace the old top-right `Drag` label with a real titlebar control family and keep the titlebar itself as the drag surface
- ship the first in-app window/view-state set for the active editor surface:
  - collapse to a header-only strip
  - minimize to `meatball editor view`
  - maximize inside the current app/browser window
  - restore from maximized state back to the default floating-editor size on a second maximize click
  - dock into a half-height split layout where the viewport is on top and the editor is on the bottom
  - close the current editor surface
- fold the first-pass internal Spaghetti toolbar cleanup into this same lane:
  - move graph/build controls into the titlebar
  - make the inner toolbar a calmer grouped surface
  - keep `Focus Node` pinned above the scrollable toolbar block
  - separate toolbar collapse behavior from the canvas toolbar and shell/window controls
- keep the future detached/new-browser affordance concept attached to this window-bar family while deferring true separate-browser behavior to `SP - Phase 13`

Sub-phase labels for the shipped cleanup wave:
- `[2.1D.1] [x] - Core floating shell window modes and titlebar controls`
- `[2.1D.2] [x] - Internal toolbar consolidation, retained-band collapse, and grouped section cleanup`
- `[2.1D.3] [x] - Split detach/dock ergonomics, split containment, and action-tray shell polish`
- `[2.1D.4] [~] - Remaining detached-window affordance and later shell follow-up tail`

CheckList:
- [x] remove the top-right `Drag` label from the floating editor header
- [x] keep the title bar draggable without spending the action slot on drag text
- [x] add a `__` collapse action that hides the editor body and leaves only the top editor bar/icons visible over the model viewport
- [x] add a down-left-arrow minimize action that sends the active viewport into `meatball editor view`
- [x] add a square maximize action that expands the active viewport inside the current app window
- [x] make the square maximize action toggle back to the default floating-editor size when clicked again from the maximized state
- [x] add a half-height split-view action that docks the editor into the bottom half of the current app window and gives the viewport the top half
- [x] make the split-view action a true non-overlay mode instead of just shrinking the floating editor over the viewport
- [x] make split mode start at a sensible default half-height ratio but expose a user-draggable divider so the top viewport and bottom editor sizes can be rebalanced
- [x] define split-mode button behavior:
  - `meatball editor view` exits split mode, restores full model viewport, and moves the editor into the toolbar area under `Parts List`
  - `X` exits split mode and closes the editor surface
  - detached/new-browser exits split mode, restores the full model viewport, and moves the editor into the separate-browser surface
  - `split mode` toggles off and returns to the previous non-split state
  - `maximize` exits split mode and returns to the full in-app overlay editor state over the model viewport
- [x] keep `collapsed` distinct from `meatball editor view`:
  - `collapsed` = header-only strip still visible over the model viewport
  - `meatball editor view` = editor moved into the dedicated dock panel below `Parts List`
- [x] add an `X` close action for the current editor surface
- [x] add the first titlebar shell/toolbar controls needed by the shipped cleanup wave:
  - titlebar graph selector
  - combined quick build action
  - titlebar toolbar toggle
  - titlebar canvas-toolbar toggle
  - `SP` / `MB` mode indicator-toggles
- [x] fold the first internal Spaghetti toolbar cleanup into this phase:
  - grouped collapsible toolbar sections
  - fixed `Focus Node` row above the toolbar scroll block
  - canvas mode controls moved down into the canvas toolbar
  - toolbar-box spacing/scroll cleanup so the top controls and the scroll area read as separate surfaces
- [ ] decide whether the up-right-arrow `open in new browser` affordance should:
  - stay deferred entirely
  - or ship only when real detached-window behavior exists
- [x] keep true detached/new-browser editor windows out of this cut and defer them to `SP - Phase 13`

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/theme/v15Theme.css`

### [2.1E] [~] - `VR / SP` - `Dockable Left Panels And In-App Floating Panel Shell`

##### Summary

Summary:
- the first fixed-slot reusable left-dock shell pass is now shipped for `Browser` and `meatball editor`, with only a small follow-up tail left if we want to harden the panel movement system further
- turn the first Browser floating work into one reusable left-dock shell system instead of leaving it as a Browser-only patch
- let the docked `Browser` and docked `meatball editor` share the same in-app movement contract:
  - docked by default
  - explicit pop-out
  - drag-out from the blue titlebar
  - drag-back into a fixed dock target
  - compact ghost-preview placeholder on valid dock hover
- when dragged out, `meatball editor` should immediately restore the normal floating `Spaghetti Editor` rather than becoming a separate floating meatball shell
- keep this cut intentionally narrower than a full movable-panels framework by leaving `Preview Mode` and `Parts List` docked-only for now

Sub-phase labels for the shipped cleanup wave:
- `[2.1E.1] [x] - Single Browser pop-out host and floating-shell cleanup`
- `[2.1E.2] [x] - Shared fixed-slot Browser/meatball dock shell with ghost previews`
- `[2.1E.3] [x] - Left-dock resize bar, split viewport, and split-constrained dock shell behavior`
- `[2.1E.4] [x] - Floating editor spawn anchoring and dock/editor collision push-lock polish`

CheckList:
- [x] introduce one reusable left-panel shell model in `AppShell` for:
  - `browser`
  - `meatball-editor`
- [x] replace Browser-only dock/floating drag logic with panel-keyed shared shell logic
- [x] keep dock targets fixed rather than introducing arbitrary panel reordering:
  - Browser docks only to the top Browser slot
  - meatball docks only to the meatball slot below `Parts List`
- [x] show a compact ghost-preview placeholder over a valid dock target:
  - white translucent fill
  - dashed white border
  - normal panel-entry height rather than full panel height
- [~] animate downstream left-dock content downward while the preview is active
- [x] let the docked meatball titlebar drag out by restoring the normal floating `Spaghetti Editor` shell and drag back into its dock slot by re-entering `meatball editor view`
- [~] preserve panel collapsed state across docked/floating transitions
- [x] keep detached/new-browser behavior and fully generic movable panels out of this cut

Likely Files:
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/v15Theme.css`

### [2.1B] [x] - `SP / VR` - `Browser, Editor, And Shared Viewer Coordination`

##### Summary

Summary:
- make Browser selection, editor focus, and shared-viewer targeting feel like one coherent workspace without collapsing them back into one singleton target
- keep explicit open/focus actions as the path that moves editor state
- let explicit Browser `Reveal` actions point at the viewer without silently changing shared-composition membership

CheckList:
- [x] keep Browser selection separate from focused editor viewport state
- [x] keep explicit open/focus actions as the only first-pass editor-movement path
- [x] add explicit graph-scoped `Reveal` actions without inventing a new emphasis-state model
- [x] keep Browser actions from silently retargeting shared composition or changing composition membership
- [x] make the different workspace targets legible:
  - selected Browser item
  - focused editor viewport
  - viewer target / reveal target
  - shared-composition membership

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### [2.1C] [x] - `VR / SP` - `Browser Row Action Cleanup And Context Menus`

##### Summary

Summary:
- turn the current Browser from a row-action-heavy launcher into a calmer tree-first workspace surface closer to the intended Fusion-style Browser direction
- move heavy row commands such as `Save`, `Open`, `Reveal`, `New Editor`, `Swap Editor`, `Focus`, and `Close` out of the always-visible row face and into row options/context menus
- keep the Browser selection-first while preserving the explicit editor/viewer actions already introduced in `[2.1A]` and `[2.1B]`

Sub-phase labels for the shipped cleanup wave:
- `[2.1C.1] [x] - Browser row action-strip removal and right-click context menus`
- `[2.1C.2] [x] - Overflow affordance, `Open Editors` row cleanup, and active-session row polish`

CheckList:
- [x] remove the full visible action-strip treatment from graph and viewport rows
- [x] make Browser rows read primarily as:
  - chevron
  - icon/state
  - label
  - quiet meta
- [x] add right-click row options for existing graph, output, and viewport actions
- [x] decide whether a tiny overflow affordance is still needed for discoverability after right-click exists
- [x] keep click semantics calm:
  - single-click selects
  - explicit options/context actions perform commands
- [x] keep deeper hierarchy work, materials/visibility stacks, and broader workspace-presentation systems out of this cut

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/theme/v15Theme.css`

### [2.2] [ ] - `AS` - Phase 5 - `Browser-Facing Graph Output Structure`

##### Summary

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
- [ ] replace the older flat legacy parts-list mental model with the real project-content hierarchy once that structure exists

Likely Files:
- `src/app/spaghetti/selectors/`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`

### [2.3] [~] - `AS` - Phase 6 - `Project Content Inspection And Build Control Surface`

##### Summary

Summary:
- expose project-content inspection and build-oriented controls for Browser rows without collapsing back into one flat parts list
- this is the better later home for richer Browser row loading/build bars after `11B` only establishes simple dirty/saved cached-entry state
- this is also the main later home for build-oriented Browser row surfaces intentionally deferred out of the first `SP - Phase 11` Browser hierarchy pass

Sub-phase labels for the shipped cleanup wave:
- `[2.3A] [x] - Browser graph-row one-line policy/status shell`
- `[2.3B] [x] - Graph-row save/export split and runtime-owned build freshness`
- `[2.3C] [ ] - Deeper project-content inspection and per-object/per-part build control`

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
- [x] prepare first graph-row build bars and build-status surfaces without pulling them back into `11B`
- [x] carry richer Browser row loading/build bars into a Browser/build-control lane instead of keeping them inside cached-graph lifecycle semantics
- [x] separate graph-row save/export state from graph-row build/runtime state
- [ ] separate build controls from view controls in the Browser
- [ ] keep `generate/build on-off` separate from `view on-off`
- [ ] leave room for later item actions like isolate, rename, and export

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/BuildStatsDrawer.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildStatsKeys.ts`

### [2.4] [ ] - `VR` - Phase 5 - `Reference Asset Workspace And Project View Layers`

##### Summary

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

### [2.5] [ ] - `VR` - Phase 6 - `Browser Controls, Materials, And Rich Visibility`

##### Summary

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

### [3.1] [ ] - `DR / JK` - `Control Viz And Graph-Driven Control Surfaces`

##### Summary

Summary:
- later lane for control-viz spheres, graph-linked controls, driver authority rules, and the deeper convergence between Spaghetti and Jake mode

CheckList:
- [ ] define control-viz sphere ownership and outputs
- [ ] define source control vs downstream offset rules
- [ ] define how control surfaces drive graph params cleanly

### [3.2] [ ] - `AS / SP` - `Build Sequencing, Build Bars, And Output Build Control`

##### Summary

Summary:
- later lane for per-part build bars, staged build sequencing, rebuild policies, and mesh/combine control above the current graph-local build memory work
- this is also the first credible home for replacing the old `BoxParams`-centric worker contract with a graph-native build contract once graph/project ownership is mature enough

CheckList:
- [ ] expose per-part/per-object build progress
- [ ] define build-sequence control surfaces
- [ ] define deferred mesh/combine behavior across objects/assemblies
- [ ] define the graph-native worker request/result contract that should replace the current legacy compatibility path
- [ ] remove dependence on graph-to-legacy request translation once the graph-native contract is real

### [3.3] [~] - `VR / SP` - `Workspace Presentation Modes`

Summary:
- later lane for `Collapsed / Essentials / Expanded`, cleaner inspectors/toolbars, and other ways to keep the main canvas clean while preserving deep inspectability
- this is the longer-range home for broader workspace-presentation polish after the first Browser hierarchy surface and the first richer Browser workspace pass exist

Sub-phase labels for the shipped cleanup wave:
- `[3.3A] [x] - Spaghetti window appearance shell and per-viewport style controls`
- `[3.3B] [x] - Para slider/select presentation primitives and clamp-edit mode`
- `[3.3C] [x] - Compact/expanded `View` gizmo and right-dock presentation`
- `[3.3D] [ ] - Saved workspace modes and broader later workspace cleanup`

CheckList:
- [ ] define `Collapsed / Essentials / Expanded`
- [ ] define what stays in canvas vs separate panels
- [x] prove the first reusable workspace-presentation systems in shipped code:
  - per-window appearance/settings
  - clamp-aware sliders/selects
  - compact/expanded `View` presentation
- [ ] carry broader workspace-presentation polish here instead of forcing it into the first `SP - Phase 11` Browser pass
- [ ] define saved workspace/presentation modes later if still useful
- [ ] remove legacy-only panels and workspace affordances once graph-native Browser/workspace coverage makes them redundant

### [3.4] [ ] - `AS / VR` - `Advanced Output Types And Later Project Packaging`

Summary:
- later lane for non-solid outputs, richer project-file export packaging, and optional inclusion of imported assets in project export

CheckList:
- [ ] support outputs beyond solids later
- [ ] define project-file packaging/export behavior
- [ ] define when imported assets can become project-owned export content

### [3.5] [ ] - `GE / SP / AS` - `Publish / Receive Execution`

Summary:
- later lane for turning the locked `Publish / Receive` ownership model into real graph-to-graph behavior with clear link versus hard-copy execution rules

CheckList:
- [ ] implement `Publish / Receive` graph-to-graph data flow with stable identity
- [ ] support `Link` versus `Hard Copy` behavior explicitly
- [ ] keep Browser/project ownership coherent when received data is nested into project content
- [ ] define export restrictions or conversion requirements for linked receive-data

### [3.6] [ ] - `GE / SP / VR` - `Final Legacy Phase-Out And Compatibility Cleanup`

Summary:
- final cleanup lane for removing the old hybrid-app branches after graph-native authoring, Browser/project hierarchy, build execution, and workspace presentation fully replace them
- do not start this as a deletion-first refactor; it only becomes valid after the earlier replacement phases have actually landed

CheckList:
- [ ] remove the app-wide `Legacy` versus `Spaghetti` mode split once one graph-native workspace path is sufficient
- [ ] remove `BoxPanel` and other box-param-only UI after graph-native authoring fully covers the needed workflow
- [ ] collapse `useAppStore` branches that only exist to bridge legacy parameter editing
- [ ] delete obsolete compatibility translation and request-shape glue after the graph-native worker contract is live
- [ ] remove stale product/build assumptions that only existed for the legacy box-builder path
- [ ] do a dead-code cleanup pass across app, worker, and viewer seams after the old path is no longer user-facing
