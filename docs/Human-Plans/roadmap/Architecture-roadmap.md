# ParaHook Architecture Roadmap

## Doc Header

### Doc History
26. 2026-04-01 18:03: Promoted `Build Path` out of the catch-all open-family list into the main `### Suggested Working Order`, placing it after the current workspace cleanup ladder, later `AppShell` cleanup, and `Edit History` groundwork while also tightening the family read so it now describes a scrub-friendly derived CAD-command diff surface rather than a second undo/history system
25. 2026-04-01 17:59: Reordered the roadmap `### Suggested Working Order` so the live `Workspace 7.5-7` through `Workspace 7.5-11` cleanup ladder now sits explicitly ahead of `Workspace 5.3`, removed the already-shipped `App Shell` ladder from the active queue, and added one deferred later `AppShell` cleanup follow-on after the current workspace cleanup stack instead of leaving that future pass implicit
24. 2026-04-01 13:36: Added the shipped `App Shell` ladder into the `### Suggested Working Order` section after that checklist was reformatted into numbered `####` family blocks, keeping the earlier shell groundwork visible in-sequence instead of only down in shipped reference
23. 2026-04-01 13:31: Normalized the visible roadmap checklist naming toward family-first architecture labels such as `Workspace 1`, `Layers 1`, `View Toolbar 1`, and `App Shell 1`, while keeping older bracketed or dashed ids only as secondary references in parentheses so the working order reads more like the newer family docs
22. 2026-04-01 13:25: Reworked the roadmap `## To do` section into a cleaner grouped sequence after comparing it against the newer workspace and family docs, keeping shipped items visible, pulling `Layers` into the near-term open-family ladder, and demoting stale standalone backlog shorthand like a future `AppShell` refactor or vague worker follow-on until those become real source-doc phases
21. 2026-03-31 11:05: Added `Workspace Modes` into this cross-family roadmap and rebuilt the `## To do` checklist from the live family docs, so the roadmap now reflects the shipped `Workspace 0.1` through `Workspace 6` work plus the active `Workspace 5.3` and `Workspace 7.x` follow-ons instead of the stale older shorthand list
20. 2026-03-28 14:06: Refreshed the source-doc pointers in this cross-family roadmap after a docs audit by replacing stale `Layers.md` and archived Spaghetti explainer paths with the real live family index docs, so the roadmap now points at the current umbrella files that actually exist in the repo
19. 2026-03-28 13:19: Reordered the roadmap `## To do` list so the new `Edit History` groundwork now sits ahead of later `Build Path` sync, and replaced the old roadmap-only `BuildPath-1` placeholder with a descriptive `BuildPath-first-standalone-phase-doc` checklist item so the near-term sequence stays aligned with the current family source docs
18. 2026-03-28 13:16: Added the new `Edit History` family to this cross-family roadmap, wiring in the first open `Edit History 1` through `Edit History 5` ladder so the roadmap now tracks canonical undo/redo foundation, graph and parameter commit coverage, Browser-plus-Console parity, transform commit integration, and later `Build Path` sync beside the older architecture families
17. 2026-03-26 20:03: Added the new `Export` family to this cross-family roadmap, wiring in the first open `Export-1` through `Export-4` ladder so the roadmap now tracks the export toolbar surface, target collection, format-specific settings, and later project/spaghetti save-export neighbors beside the older architecture families
16. 2026-03-26 15:40: Added the new `Layers` family to this cross-family roadmap, wiring in the open `Layers-1` through `Layers-4` ladder so the roadmap now tracks layer foundation, manager-plus-console controls, sketch entity ownership, and authored 3D object visibility beside the older architecture families
15. 2026-03-25 22:17: Cleaned up this cross-family roadmap after shipping `Browser-6 - BrowserPanel Structure And Row-Family Cleanup`, updated the Browser family read to the post-Browser-6 state with eleven shipped cuts, and advanced the remaining open Browser architecture work to the smaller `Browser-7` follow-on bucket
14. 2026-03-25 21:55: Added a practical `To do` checklist section to this cross-family roadmap, rewriting the near-term sequence from the current live architecture families instead of the older roadmap-lane labels so the file now has one Browser-to-Build-Path working list for what to finish before the first honest `Build Path` cut
13. 2026-03-25 21:49: Marked `[5.1G] Surface-Agnostic Command Ownership And Adapter Expansion` shipped in this cross-family roadmap, updated the Console family read so shared workspace-selection outcomes and shared view commands now count as landed owner-first console groundwork, and left the Console family partial only because the smaller `[4.1I5]` staged-grammar hardening follow-on still remains open
12. 2026-03-25 21:25: Refreshed this cross-family roadmap against the newer Browser and Master Spaghetti source docs, so the Browser family now acknowledges both `Browser-6` and the later `Browser-7` cleanup bucket while the Spaghetti Editor family notes the existing standalone `Master Spaghetti-1` follow-on instead of reading like that ladder is still purely undecided
11. 2026-03-25 21:10: Marked `[5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion` shipped in this cross-family roadmap, updated the Worker family read to a fully shipped seven-phase worker ladder, and closed the Worker architecture family as complete until a new follow-on family is introduced
10. 2026-03-25 20:13: Marked `[5.3A-6] Result Semantics, Browser Truth, And Console Truth` shipped in this cross-family roadmap, updated the Worker family read to six shipped groundwork phases, and advanced the remaining open Worker follow-on to the final graph-native cutover and legacy-contract deletion stage
9. 2026-03-25 19:03: Marked `[5.3A-5] Legacy Runtime And Startup Fallback Removal` shipped in this cross-family roadmap, updated the Worker family read to five shipped groundwork phases, and advanced the remaining open Worker follow-ons to the later result-semantics plus final graph-native cutover stages
8. 2026-03-25 18:22: Marked `[5.3A-4] Dispatcher Boundary Cleanup` shipped in this cross-family roadmap, updated the Worker family read to four shipped groundwork phases, and advanced the remaining open Worker follow-ons to the later legacy-runtime removal plus Browser/Console truth cuts
7. 2026-03-25 15:56: Marked `Browser-5.3`, `Browser-5.4`, and `Browser-5.5` shipped in this cross-family roadmap, updated the Browser family read to ten shipped Browser cuts, and advanced the remaining open Browser work to the single `Browser-6` BrowserPanel and row-family cleanup follow-on
6. 2026-03-25 10:16: Marked `Browser-5.2 - Implicit Parent Multi-Selection` shipped in this cross-family roadmap, updated the Browser family read to seven shipped Browser cuts, and advanced the remaining open Browser follow-ons to `Browser-5.3` selection-to-console integration plus `Browser-6` panel/row-family cleanup
5. 2026-03-25 09:44: Marked `Browser-5.1 - Reference Selection Cleanup` shipped in this cross-family roadmap, updated the Browser family read to six shipped Browser cuts, and advanced the remaining open Browser follow-ons to `Browser-5.2` grouped parent multi-selection plus `Browser-6` panel/row-family cleanup
4. 2026-03-25 02:41: Reworked the `Nodes` section in this roadmap into subfamily groupings, so `Nodes` now breaks into foldable `Sketch` and `Extrude` `###` sections with the individual node-family tasks moved down to `####` headings instead of one long flat phase list
3. 2026-03-25 02:38: Reworked this roadmap from a split `Quick Checklist` plus later repeated family summaries into one foldable family-by-family status map, so each architecture family now uses a status-marked `##` heading and foldable `###` phase headings instead of duplicating checklist bullets and separate lower sections
2. 2026-03-25 02:32: Expanded this roadmap so it also tracks the current architecture-family state for `Build Path`, `Radio`, `Camera Controls`, and `View Toolbar`, keeping the cross-family checklist aligned with the newer docs beyond the original `Browser` / `Console` / `Spaghetti Editor` / `Nodes` / `Worker` / `AppShell` set
1. 2026-03-25 01:45: Created this roadmap as the architecture-family tracker for the current `Browser`, `Console`, `Spaghetti Editor`, `Nodes`, `Worker`, and `AppShell` phase docs, so the newer folderized architecture planning surfaces have one compact cross-family status map under `docs/Human-Plans/roadmap/`

### Purpose

This file tracks the live phase state across the newer architecture-family docs under:
- `docs/Human-Plans/Architecture/`

Use it to answer:
- which architecture families already have real phase ladders
- which phases are shipped versus still open
- where the current source-of-truth doc lives for each family
- which family still needs phase-structure cleanup before deeper work continues

### Scope

This file covers:
- `Browser`
- `Console`
- `Edit History`
- `Export`
- `Layers`
- `Build Path`
- `Radio`
- `Camera Controls`
- `View Toolbar`
- `Workspace Modes`
- `Spaghetti Editor`
- `Nodes`
- `Worker`
- `AppShell`

This file does not replace:
- `docs/Human-Plans/roadmap/roadmap.md`
  - execution-order roadmap
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - north-star product direction

## Doc Body

### Short Version

The newer architecture docs are no longer just isolated notes.

Several of them now act like real family indexes with their own shipped/open phase ladders.

This roadmap is the compact cross-family tracker for that newer architecture phase structure, including the newer viewport/audio/history families that now have their own dedicated architecture homes.

The `Layers` family now belongs in that tracker too because it has a real four-phase execution ladder instead of only one umbrella note.

The `Edit History` family now belongs in that tracker too because it has a real five-phase execution ladder instead of only one umbrella concept note.

The `Workspace Modes` family now belongs in that tracker too because it has a real shipped-and-future phase ladder instead of living only as old task-doc residue.

### Source Docs

- `Browser`
  - `docs/Human-Plans/Architecture/Browser/Browser-Index.md`
- `Console`
  - `docs/Human-Plans/Architecture/Console/Console.md`
- `Edit History`
  - `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md`
- `Export`
  - `docs/Human-Plans/Architecture/Export/Export-Index.md`
- `Layers`
  - `docs/Human-Plans/Architecture/Layers/Layers-index.md`
- `Build Path`
  - `docs/Human-Plans/Architecture/Build-Path/Build-Path-Index.md`
- `Radio`
  - `docs/Human-Plans/Architecture/Radio/Radio.md`
- `Camera Controls`
  - `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `View Toolbar`
  - `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
- `Workspace Modes`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `Spaghetti Editor`
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `Nodes`
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`
- `Worker`
  - `docs/Human-Plans/Architecture/Worker/Worker.md`
- `AppShell`
  - `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`

### Status Legend

- `[x]`
  - shipped / locked complete
- `[~]`
  - active / partial / family exists but still open
- `[ ]`
  - planned / not started

## [~] Browser
### Info
Source doc:
- `docs/Human-Plans/Architecture/Browser/Browser-Index.md`

Current read:
- `Browser` is one of the cleanest newer architecture families right now
- it already has a compact ladder with eleven shipped cuts plus one named open follow-on
- the next open work is now:
  - `Browser-7`
- `Browser-7` is the accumulating cleanup bucket after the shipped Browser-6 structural split, and its first narrow shipped follow-on has already landed under the local `Browser-7.x` tracking

### [x] Browser-1 - Build Policy Icon Surface
### [x] Browser-2 - Cascade And Effective Policy Truth
### [x] Browser-3 - Runtime Build Policy Execution
### [x] Browser-4 - Row Click And Action Ownership Cleanup
### [x] Browser-5 - Selection And Focus Sync
### [x] Browser-5.1 - Reference Selection Cleanup
### [x] Browser-5.2 - Implicit Parent Multi-Selection
### [x] Browser-5.3 - Selection To Console Context For Content And References
### [x] Browser-5.4 - Explicit Additive Multi-Select
### [x] Browser-5.5 - Reference Batch Load Queue And Aggregate Progress
### [x] Browser-6 - BrowserPanel Structure And Row-Family Cleanup
### [ ] Browser-7 - Browser Cleanup Follow-Ons

## [~] Console
### Info

Source docs:
- `docs/Human-Plans/Architecture/Console/Console.md`
- `docs/Human-Plans/Architecture/Console/Shipped/Console_Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion.md`

Current read:
- the console family already has a real newer mini-ladder for:
  - command capture
  - staged grammar
  - input ownership
  - context sync
  - canonical workspace intents
- shared owner-first command expansion is now shipped too:
  - canonical workspace-selection outcomes
  - shared view commands
  - surface adapters over shared owners
- the main remaining open console-family follow-on is now:
  - `[4.1I5]` robustness and prompt quality under the staged grammar lane

### [x] [4.1H] Hybrid Command Capture And Shortcut Unification
### [~] [4.1I] Hierarchical Path Grammar
### [x] [4.1J] Input Ownership And Coordination Cleanup
### [x] [4.1K] Surface-Driven Console Context Sync
### [x] [4.1L] Command Transcript Sublayers
### [x] [4.1M] Staged Choice Prefill And Arrow Cycling
### [x] [4.1N] Feature Session Prompt Descriptors
### [x] [4.1P] Assisted Prefill Replace-On-Type Across Levels
### [x] [5.1F] Workspace Selection, Surface Activation, And Canonical Intents
### [x] [5.1G] Surface-Agnostic Command Ownership And Adapter Expansion

## [ ] Edit History
### Info

Source doc:
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md`

Current read:
- the `Edit History` family now has a real first implementation ladder instead of only an umbrella concept
- the family is explicitly framed around one canonical authored-change history for:
  - graph edits
  - parameter commits
  - Browser/content organization
  - committed transforms
  - console-issued mutations over the same authored seams
- none of the phases are shipped yet
- the family currently reads as one clean five-step path:
  - canonical entry and transaction foundation
  - graph and parameter commit coverage
  - Browser/content organization plus Console parity
  - committed transform integration and shared dispatch
  - later `Build Path` sync and derived-reader follow-through

### [ ] Edit History 1 - Canonical Entry And Transaction Foundation
### [ ] Edit History 2 - Spaghetti Graph And Parameter Commit Coverage
### [ ] Edit History 3 - Browser Content Organization And Console Parity
### [ ] Edit History 4 - Viewer Transform Commit Integration And Shared Dispatch
### [ ] Edit History 5 - Build Path Sync, Derived Readers, And Later History UX

## [ ] Layers
### Info

Source docs:
- `docs/Human-Plans/Architecture/Layers/Layers-index.md`
- `docs/Human-Plans/Architecture/Layers/Future/Layers_Phase Layers-1 - Layer State, Membership, And Visibility Foundation.md`
- `docs/Human-Plans/Architecture/Layers/Future/Layers_Phase Layers-2 - Layer Manager And Console Command Surface.md`
- `docs/Human-Plans/Architecture/Layers/Future/Layers_Phase Layers-3 - Sketch Entity Layer Ownership.md`
- `docs/Human-Plans/Architecture/Layers/Future/Layers_Phase Layers-4 - Authored 3D Object Layer Ownership And Visibility.md`

Current read:
- the `Layers` family is now a real future-facing ladder rather than only a concept umbrella
- the four phases are intentionally split across the live code seams for:
  - shared layer state
  - manager and Console controls
  - sketch-session ownership
  - Browser and viewer-owned 3D content visibility
- none of the phases are shipped yet
- the family currently reads as one clean four-step path:
  - foundation
  - manager plus Console controls
  - sketch entities
  - authored 3D objects

### [ ] Layers-1 - Layer State, Membership, And Visibility Foundation
### [ ] Layers-2 - Layer Manager And Console Command Surface
### [ ] Layers-3 - Sketch Entity Layer Ownership
### [ ] Layers-4 - Authored 3D Object Layer Ownership And Visibility

## [ ] Export
### Info

Source docs:
- `docs/Human-Plans/Architecture/Export/Export-Index.md`
- `docs/Human-Plans/Architecture/Export/Future/Export_Phase Export-1 - Toolbar Shell And Format Surface.md`

Current read:
- the `Export` family now has a real umbrella home instead of living only as canonical `EX` placeholders or scattered later notes
- the first direction is explicitly user-facing:
  - a shared-toolbar-based export surface
  - target review for authored objects and references
  - first format choices
  - later honest save/export neighbors such as project file and spaghetti file
- none of the export-family phases are shipped yet
- the family currently reads as one clean four-step path:
  - export surface shell
  - target collection
  - format-specific settings
  - later persistence-adjacent export neighbors

### [ ] Export-1 - Toolbar Shell And Format Surface
### [ ] Export-2 - Target Collection And Selection Integration
### [ ] Export-3 - Format-Specific Settings And Detail Controls
### [ ] Export-4 - Project File, Spaghetti File, And Later Export Neighbors

## [~] Build Path
### Info

Source doc:
- `docs/Human-Plans/Architecture/Build-Path/Build-Path-Index.md`

Current read:
- `Build Path` has a clear umbrella architecture direction, but not a real standalone phase ladder yet
- the current family doc is still mainly:
  - concept
  - placement recommendation
  - first constraints
  - open `q1` through `q6`
- the concept should be read as:
  - a derived scrub-friendly CAD-command / transform-diff surface
  - not a replacement for `Spaghetti`
  - not the same thing as `Edit History`
- the likely dependency order is:
  - current workspace cleanup first so the slim timeline surface has a stable home
  - earlier `Edit History` groundwork next so the timeline can consume a canonical committed-diff seam without becoming the undo/history system itself
- the next cleanup for this family is still probably to branch the first real standalone phase doc into `Future/` once the first honest read-only scrub slice is tightened around that narrower role

### [~] Build Path - Umbrella Concept And First Questions

## [~] Radio
### Info

Source doc:
- `docs/Human-Plans/Architecture/Radio/Radio.md`

Current read:
- `Radio` is now one of the more mature architecture families in the repo
- the family has a long real phase ladder:
  - console-first foundations
  - runtime playback bridge
  - visible toolbar/control surface
  - sampler growth
  - waveform follow-on
- the remaining open architecture-side phases are:
  - `Phase 8` `Hardening And Follow-Through`
  - `Phase 11` `Source Waveform Visualization`

### [x] Phase 1 - [4.1O1] - Radio 1 - Root, Scope, And Guided Prompt Sessions
### [x] Phase 2 - [4.1O2] - Radio 2 - Canonical Session State And Defaults
### [x] Phase 3 - [4.1O2] - Command Identity Template System
### [x] Phase 4 - [4.1O3] - Radio 3 - Console Trigger Wiring
### [x] Phase 5 - Runtime Source Bridge
### [x] Phase 6 - Real Link Playback Bridge
### [x] Phase 7 - Radio Toolbar And Control Surface
### [ ] Phase 8 - Hardening And Follow-Through
### [x] Phase 9 - Sampler Sequencer Surface
### [x] Phase 10 - Shared Radio Toolbar Tree And Step Detail Expansion
### [ ] Phase 11 - Source Waveform Visualization

## [~] Camera Controls
### Info

Source doc:
- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`

Current read:
- the `Camera Controls` family now has a clean `[5.0H-1]` through `[5.0H-5]` ladder
- the first four phases are shipped:
  - sketch camera blocking
  - Fusion-style viewport baseline
  - graph-canvas / model-viewport coexistence
  - camera console commands
- the remaining open follow-on is:
  - `[5.0H-5]` `Shared View Input Owner Model`

### [x] [5.0H-1] Sketch Draw Camera Blocking
### [x] [5.0H-2] Fusion-Style Model Viewport Camera Baseline
### [x] [5.0H-3] Spaghetti Canvas And Model Viewport Coexistence
### [x] [5.0H-4] Camera Console Commands
### [ ] [5.0H-5] Shared View Input Owner Model

## [ ] View Toolbar
### Info

Source doc:
- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`

Current read:
- the `View Toolbar` family has a real ladder, but it is still entirely future-facing
- the family is currently organized around four open cuts:
  - shared command dispatch plus projection entry
  - projection surface plus lens controls
  - grid/background/core view state
  - gizmo/helper/legacy feel follow-ons
- this is the main architecture home for explicit camera/view controls, not low-level gesture ownership

### [ ] [5.0I-1] Shared View Command Dispatch And Projection Console Entry
### [ ] [5.0I-2] Projection Surface, ParaSelect, And Lens Controls
### [ ] [5.0I-3] Grid, Background, And Core View State
### [ ] [5.0I-4] Gizmo, Helpers, And Legacy Feel Follow-Ons

## [~] Workspace Modes
### Info

Source doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current read:
- the `Workspace Modes` family now has a real shipped ladder plus explicit future follow-ons instead of only the older `05.1*` task-doc carry-forward
- the shipped workspace groundwork now includes:
  - `Workspace 0.1` through `Workspace 5.2`
  - `Workspace 6`
  - the shipped `Workspace 7.1` through `Workspace 7.5-6` slot, host-contract, multi-editor, replacement, and first split-plus-console groundwork recorded in the family index
- the main remaining open follow-ons are now:
  - `Workspace 7.5-7`
  - `Workspace 7.5-8`
  - `Workspace 7.5-9`
  - `Workspace 7.5-10`
  - `Workspace 7.5-11`
  - `Workspace 5.3`
- the family no longer reads like early extraction work is still pending:
  - `Workspace 1`
  - `Workspace 2`
  - `Workspace 3`
  - `Workspace 4`
  - `Workspace 5`
  - `Workspace 6`
  all count as shipped groundwork in the current source doc

### [x] Workspace 0.1 - Codebase Research And Implementation Audit
### [x] Workspace 1 - Shared Workspace Owner And State Extraction
### [x] Workspace 2 - First Hosted Surface Migration And Transitional Adapters
### [x] Workspace 3 - Viewport-Local Chrome And Toolbar Host
### [x] Workspace 4 - Persistence, Saved Modes, And Migration
### [x] Workspace 5 - Multi-Window Surfaces And Detached Browser Pop-Out
### [x] Workspace 5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore
### [x] Workspace 5.2 - Multiple Editor Surface Instances And Graph Binding
### [ ] Workspace 5.3 - Open Editors Multi-Graph Workspace UX And Session Truth
### [x] Workspace 6 - Workspace Selection, Surface Activation, And Canonical Intents
### [ ] Workspace 7 - Viewport Slot Architecture And Surface Swapping

## [~] Spaghetti Editor
### Info

Source docs:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Future/Master_Spaghetti_Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass.md`

Current read:
- the `Spaghetti Editor` umbrella doc is still more of a current architecture map than a true family phase index
- this family is still lighter than `Browser`, `Console`, or `Worker` as a phase-tracked architecture family
- but it is no longer purely phase-less:
  - there is now one standalone future `Master Spaghetti-1` follow-on under `Future/`
- the main remaining structure question is whether future umbrella planning should keep branching as occasional `Master Spaghetti` follow-ons plus subfamilies like:
  - `Nodes`
  - Browser/workspace coordination
  - or whether it should grow into a denser dedicated ladder later

### [~] Master Spaghetti - Umbrella Architecture Map
### [ ] Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass

## [~] Nodes
### Info

Source docs:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`

Current read:
- the node family now has the deepest architecture-side phase tree
- the current structure is really three linked tracks:
  - shared node / `EWR` foundation
  - sketch authoring family
  - extrude follow-on family

Important note:
- `Extrude` now has its own family index, but it is still at the very first open phase:
  - `Extrude-1`

### [~] Sketch

#### [x] [3.2A-0.1] Sketch To Extrude To Preview Contract Repair
#### [ ] [3.2A-1] EWR Foundation And Shared Row Contract
#### [ ] [3.2A-2] Geometry Sketch EWR Vertical Slice
#### [ ] [3.2A-3] Downstream Geometry Node Hierarchy Expansion
#### [ ] [3.2A-4] Registry Alignment And Legacy Cleanup

#### [x] [3.2B] Sketch Operation Authoring Family Map
#### [x] [3.2B-0] Existing Sketch Operation Authoring
#### [x] [3.2B-SketchPlane-1] Source And Transform Surface
#### [ ] [3.2B-SketchPlane-2] Viewport-First Source Pick And Sketch Origin Gizmo
#### [ ] [3.2B-SketchPlane-2-Cleanup] Main Viewport Integration And First-Pass Workflow Cleanup
#### [ ] [3.2B-SketchPlane-3] Geometry-Driven Auto-Setup And Selection Highlighting
#### [x] [3.2B-S1] Sketch Session Hierarchy Model
#### [x] [3.2B-S2] SketchPlane Session Cleanup
#### [x] [3.2B-S3] SketchDraw Session Cleanup
#### [x] [3.2B-S4] Sketch Return One Level
#### [x] [3.2B-S5] Sketch Toolbar And Console Command Alignment
#### [x] [3.2B-S6] SketchPlane Move Axis Numeric Entry
#### [x] [3.2B-S7] SketchPlane Transform History
#### [ ] [3.2B-S8] SketchPlane Move Again Re-Arm

#### [x] [3.2B-Console-1] SketchDraw Scoped Command Surface
#### [ ] [3.2B-Console-2] SketchDraw Staged Command Routing
#### [ ] [3.2B-Console-3] Shared Sketch Command Tree And Scope Providers

#### [x] [3.2B-DrawSketch-1] Viewer-Owned Live Draw Preview
#### [x] [3.2B-DrawSketch-1-Cleanup] Viewport Draw Workflow Cleanup
#### [x] [3.2B-DrawSketch-2] Multi-Step Tool Sessions And Commit Rules
#### [x] [3.2B-DrawSketch-3] Selection, Editing, And Richer Sketch Feedback
#### [x] [3.2B-DrawSketch-4] Rectangle Tool And Corner Workflow
#### [x] [3.2B-DrawSketch-5] Circle Tool And Center-Radius Workflow
#### [ ] [3.2B-DrawSketch-6] Snap Growth
#### [ ] [3.2B-DrawSketch-7] Entity Transform And Modify Tools

#### [ ] [3.2B-4] Sketch Exposure And Browser Structure
#### [ ] [3.2B-5] Sketch Browser Depth And Authored Content Surfaces
#### [~] [3.2B-6] Sketch Content Ownership And Later Export

### [ ] Extrude

#### [ ] Extrude-1 - Transform-Aware Preview And Runtime Alignment

## [x] Worker
### Info

Source doc:
- `docs/Human-Plans/Architecture/Worker/Worker.md`

Current read:
- the worker family has a clean sequential `[5.3A-1]` through `[5.3A-7]` ladder
- all seven phases are now shipped groundwork
- the shared worker boundary is graph-native only and the family currently has no remaining open worker cleanup phase

### [x] [5.3A-1] Worker Audit And Legacy Startup Inventory
### [x] [5.3A-2] Graph-Native Worker Contract And Separate-Build Identity
### [x] [5.3A-3] Worker Lane Definition And Execution-Intent Model
### [x] [5.3A-4] Dispatcher Boundary Cleanup
### [x] [5.3A-5] Legacy Runtime And Startup Fallback Removal
### [x] [5.3A-6] Result Semantics, Browser Truth, And Console Truth
### [x] [5.3A-7] Graph-Native Worker Cutover And Legacy Contract Deletion

## [x] AppShell
### Info

Source doc:
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`

Current read:
- the current dedicated `AppShell` family is fully shipped for its local `[5.0F]` cleanup ladder
- there is no open `5.0F` follow-on left inside the current AppShell family doc
- if a later `AppShell` cleanup returns, it should be treated as a new workspace-driven follow-on after the current `Workspace 7.5-7` through `Workspace 7.5-11` ladder and `Workspace 5.3`, not as a reopening of the shipped `[5.0F]` family

### [x] [5.0F] AppShell Cleanup And Host Seam Extraction
### [x] [5.0F-1] AppShell Runtime Host Extraction
### [x] [5.0F-2] AppShell Window And Dock Host Extraction

## To do

This checklist should mirror the live family sections above.

Keep shipped items visible when they are part of a family that was previously stale in this file, so recent completed work does not disappear during roadmap cleanup.

### Suggested Working Order

#### [~] - 1 - Workspace-Modes
- [x] `Workspace 0.1`
- [x] `Workspace 1`
- [x] `Workspace 2`
- [x] `Workspace 3`
- [x] `Workspace 4`
- [x] `Workspace 5`
- [x] `Workspace 5.1`
- [x] `Workspace 5.2`
- [x] `Workspace 6`
- [ ] `Workspace 7.5-7`
- [ ] `Workspace 7.5-8`
- [ ] `Workspace 7.5-9`
- [ ] `Workspace 7.5-10`
- [ ] `Workspace 7.5-11`
- [ ] `Workspace 5.3`

#### [ ] - 2 - Later AppShell Cleanup
- [ ] `AppShell - Later Workspace Cleanup Follow-On`

#### [ ] - 3 - View Toolbar
- [ ] `View Toolbar 1` (`[5.0I-1]`)
- [ ] `View Toolbar 2` (`[5.0I-2]`)
- [ ] `View Toolbar 3` (`[5.0I-3]`)
- [ ] `View Toolbar 4` (`[5.0I-4]`)

#### [ ] - 4 - Sketch
- [ ] `Sketch 1` (`[3.2A-1]`)
- [ ] `Sketch 2` (`[3.2A-2]`)
- [ ] `Sketch 3` (`[3.2A-3]`)
- [ ] `Sketch 4` (`[3.2A-4]`)
- [ ] `SketchPlane 2` (`[3.2B-SketchPlane-2]`)
- [ ] `SketchPlane 2 Cleanup` (`[3.2B-SketchPlane-2-Cleanup]`)
- [ ] `SketchPlane 3` (`[3.2B-SketchPlane-3]`)
- [ ] `Sketch S8` (`[3.2B-S8]`)
- [ ] `Sketch Console 2` (`[3.2B-Console-2]`)
- [ ] `Sketch Console 3` (`[3.2B-Console-3]`)
- [ ] `Draw Sketch 6` (`[3.2B-DrawSketch-6]`)
- [ ] `Draw Sketch 7` (`[3.2B-DrawSketch-7]`)
- [ ] `Sketch 4` (`[3.2B-4]`)
- [ ] `Sketch 5` (`[3.2B-5]`)
- [~] `Sketch 6` (`[3.2B-6]`)

#### [ ] - 5 - Extrude
- [ ] `Extrude 1`

#### [ ] - 6 - Layers
- [ ] `Layers 1`
- [ ] `Layers 2`
- [ ] `Layers 3`
- [ ] `Layers 4`

#### [ ] - 7 - Edit History
- [ ] `Edit History 1`
- [ ] `Edit History 2`
- [ ] `Edit History 3`
- [ ] `Edit History 4`
- [ ] `Edit History 5`

#### [~] - 8 - Build Path
- [~] `Build Path - Umbrella Concept And First Questions`

#### [ ] - 9 - Export
- [ ] `Export 1`
- [ ] `Export 2`
- [ ] `Export 3`
- [ ] `Export 4`
- [ ] `Master Spaghetti 1`

### Other Open Families

- [ ] `Browser 7`
- [~] `Console 4.1I`
- [ ] `Camera Controls 5` (`[5.0H-5]`)
- [ ] `Radio 8`
- [ ] `Radio 11`

### Shipped Reference

- [x] `Browser 1`
- [x] `Browser 2`
- [x] `Browser 3`
- [x] `Browser 4`
- [x] `Browser 5`
- [x] `Browser 5.1`
- [x] `Browser 5.2`
- [x] `Browser 5.3`
- [x] `Browser 5.4`
- [x] `Browser 5.5`
- [x] `Browser 6`
- [x] `App Shell 1` (`[5.0F]`)
- [x] `App Shell 2` (`[5.0F-1]`)
- [x] `App Shell 3` (`[5.0F-2]`)
- [x] `Worker 1` (`[5.3A-1]`)
- [x] `Worker 2` (`[5.3A-2]`)
- [x] `Worker 3` (`[5.3A-3]`)
- [x] `Worker 4` (`[5.3A-4]`)
- [x] `Worker 5` (`[5.3A-5]`)
- [x] `Worker 6` (`[5.3A-6]`)
- [x] `Worker 7` (`[5.3A-7]`)

## Next Cleanup

The likely next maintenance pass for this file is:
- add more family notes only when a source architecture doc gains a real new phase
- avoid inventing roadmap-only phase ids that do not exist in the family source docs
- keep `Spaghetti Editor` explicit as a current gap until it gets a denser architecture-side phase ladder of its own
- let `Build Path` stay marked as an umbrella concept family until its first standalone execution phase exists
- keep the workspace checklist synced to the native `Workspace-Modes` family docs instead of reviving the older `Workspace-1/2/3` shorthand again
