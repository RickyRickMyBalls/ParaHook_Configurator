# ParaHook Architecture Roadmap

## Doc Header

### Doc History
15. 2026-03-25 22:17: Cleaned up this cross-family roadmap after shipping `Browser-6 - BrowserPanel Structure And Row-Family Cleanup`, updated the Browser family read to the post-Browser-6 state with eleven shipped cuts, and advanced the remaining open Browser architecture work to the smaller `Browser-7` follow-on bucket
14. 2026-03-25 21:55: Added a practical `To do` checklist section to this cross-family roadmap, rewriting the near-term sequence from the current live architecture families instead of the older roadmap-lane labels so the file now has one Browser-to-Pasta-Path working list for what to finish before the first honest `Pasta Path` cut
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
2. 2026-03-25 02:32: Expanded this roadmap so it also tracks the current architecture-family state for `Pasta Path`, `Radio`, `Camera Controls`, and `View Toolbar`, keeping the cross-family checklist aligned with the newer docs beyond the original `Browser` / `Console` / `Spaghetti Editor` / `Nodes` / `Worker` / `AppShell` set
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
- `Pasta Path`
- `Radio`
- `Camera Controls`
- `View Toolbar`
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

### Source Docs

- `Browser`
  - `docs/Human-Plans/Architecture/Browser/Browser-Index.md`
- `Console`
  - `docs/Human-Plans/Architecture/Console/Console.md`
- `Pasta Path`
  - `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`
- `Radio`
  - `docs/Human-Plans/Architecture/Radio/Radio.md`
- `Camera Controls`
  - `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `View Toolbar`
  - `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
- `Spaghetti Editor`
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-Explained.md`
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

## [~] Pasta Path
### Info

Source doc:
- `docs/Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md`

Current read:
- `Pasta Path` has a clear umbrella architecture direction, but not a real standalone phase ladder yet
- the current family doc is still mainly:
  - concept
  - placement recommendation
  - first constraints
  - open `q1` through `q6`
- the next cleanup for this family is probably to branch the first actual execution phase into `Future/` once the first honest read-only scrub slice is chosen

### [~] Pasta Path - Umbrella Concept And First Questions

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

## [~] Spaghetti Editor
### Info

Source docs:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-Explained.md`
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

### [x] [5.0F] AppShell Cleanup And Host Seam Extraction
### [x] [5.0F-1] AppShell Runtime Host Extraction
### [x] [5.0F-2] AppShell Window And Dock Host Extraction

## To do

- [x] `Browser-6`
- [ ] `Browser-7`
- [ ] `SketchPlane-2`
- [ ] `SketchPlane-2-Cleanup`
- [ ] `SketchPlane-3`
- [ ] `SketchPlane-S8`
- [ ] `Sketch-Console-2`
- [ ] `Sketch-Console-3`
- [ ] `DrawSketch-6`
- [ ] `DrawSketch-7`
- [ ] `Nodes-3.2A-1`
- [ ] `Nodes-3.2A-2`
- [ ] `Nodes-3.2A-3`
- [ ] `Extrude-1`
- [ ] `Nodes-3.2A-4`
- [ ] `Sketch-4`
- [ ] `Sketch-5`
- [ ] `Sketch-6`
- [ ] `Camera-5`
- [ ] `ViewToolbar-1`
- [ ] `Workspace-1`
- [ ] `Workspace-2`
- [ ] `Workspace-3`
- [ ] `PastaPath-1`

## Next Cleanup

The likely next maintenance pass for this file is:
- add more family notes only when a source architecture doc gains a real new phase
- avoid inventing roadmap-only phase ids that do not exist in the family source docs
- keep `Spaghetti Editor` explicit as a current gap until it gets a real architecture-side phase ladder of its own
- let `Pasta Path` stay marked as an umbrella concept family until its first standalone execution phase exists
