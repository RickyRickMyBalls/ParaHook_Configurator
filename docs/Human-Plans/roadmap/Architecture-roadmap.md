# ParaHook Architecture Roadmap

## Doc Header

### Doc History
28. 2026-04-13 15:00: Refreshed this roadmap against the live `Cleanup`, `Build Path`, and `Viewport Runtime Inspector` family indexes, adding the previously missing `Cleanup` and `Viewport Runtime Inspector` families, marking the now-shipped `Cleanup 1` through `Cleanup 10` ladder plus shipped `VRI-1` through `VRI-3.5` slices, and tightening the `Build Path` source-doc read around the new dedicated vision doc and the real lowercase `build-path-index.md` entrypoint
27. 2026-04-10 09:25: Refreshed this roadmap against the live changelog plus the current Browser, Workspace, Worker, Model-Viewport, Sketch, and Extrude family docs, marking the newly shipped `Browser-12`, `Sketch-1`, `Extrude-4` through `Extrude-7`, `Worker Vision Phase 1` and `Phase 2`, and the latest `Worker-Vision-3` internal phases while replacing the stale `Workspace 7.5-7` through `7.5-11` ladder with the real open `Workspace 7.2b`, `Workspace 7.5`, `Workspace 7.5-4`, `Workspace 7.5-5`, and `Workspace 7.5-17` follow-ons
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
- `Cleanup`
- `Radio`
- `Camera Controls`
- `View Toolbar`
- `Workspace Modes`
- `Model Viewport`
- `Spaghetti Editor`
- `Nodes`
- `Worker`
- `Worker Vision`
- `Viewport Runtime Inspector`
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

The `Cleanup` family now belongs in that tracker too because it has become a real cross-cutting shipped-and-future architecture ladder rather than only one broad vision note.

The `Viewport Runtime Inspector` family now belongs in that tracker too because it already has a shipped `VRI-1` through `VRI-3` ladder and one real open `VRI-4` follow-on instead of living only as a viewport wish-list note.

### Source Docs

- `Browser`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md`
- `Console`
  - `docs/Human-Plans/Architecture/Console/Console.md`
- `Edit History`
  - `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md`
- `Export`
  - `docs/Human-Plans/Architecture/Export/Export-Index.md`
- `Layers`
  - `docs/Human-Plans/Architecture/Layers/Layers-index.md`
- `Build Path`
  - `docs/Human-Plans/Architecture/Build-Path/build-path-index.md`
  - `docs/Human-Plans/Architecture/Build-Path/Build-Path_Vision.md`
- `Cleanup`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `Radio`
  - `docs/Human-Plans/Architecture/Radio/Radio.md`
- `Camera Controls`
  - `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
- `View Toolbar`
  - `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
- `Workspace Modes`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `Model Viewport`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
- `Spaghetti Editor`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `Nodes`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch-Index2.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`
- `Worker`
  - `docs/Human-Plans/Architecture/Worker/Worker.md`
- `Worker Vision`
  - `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `Viewport Runtime Inspector`
  - `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Viewport-Runtime-Inspector-Index.md`
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
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md`

Current read:
- `Browser` is much larger than the older `1` through `7` read this roadmap was still carrying
- the family now has shipped work through:
  - `Browser-12`
- the remaining open Browser work is no longer just one cleanup bucket:
  - `Browser-7`
  - `Browser-8`
  - `Browser-9`
  - `Browser-10`
  - `Browser-11`
  - `Browser-12.1`
- several of those umbrellas already contain shipped subphases, so the roadmap should keep both the umbrella phase and the landed child cuts visible

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
### [x] Browser-7.1 - Viewport Explicit Multi-Select Sync
### [ ] Browser-8 - Container Versus Leaf Browser Model
### [x] Browser-8.1 - Container And Leaf Target Semantics
### [x] Browser-8.2 - Folder CRUD In Browser UI And Console
### [x] Browser-8.3 - Shared Leaf Target Entry For Viewer Transform And Multi-Select Prep
### [x] Browser-8.4 - Reparenting And Drop Rules
### [x] Browser-8.5 - Drag Session Architecture Cleanup
### [ ] Browser-8.6 - Depth-Lane Drag Interaction
### [x] Browser-8.7 - Pointer-Driven Drag Engine Rebuild
### [ ] Browser-8.8 - Reliable Drag Interaction Rebuild
### [x] Browser-8.8.1 - Simple Reliable Rearrange Baseline
### [x] Browser-8.8.2 - Target Clarity And Trust Tuning
### [x] Browser-8.8.3 - Motion And Rearrange Polish
### [ ] Browser-8.8.4 - Reintroduce Richer Hierarchy Guidance Carefully
### [ ] Browser-9 - Reference Tree Convergence Into Standard Content Hierarchy
### [x] Browser-9.1 - Reference Tree Convergence Baseline
### [x] Browser-9.2 - Import Landing And Hierarchy Mapping
### [x] Browser-9.3 - Part Row Exposure For Imported Objects
### [x] Browser-9.4 - Imported Object Promotion To True Content Owners
### [x] Browser-9.5 - Library Object Rows And Direct Placement Drag
### [x] Browser-9.6 - Placement Shelf Removal And Single Object Identity
### [x] Browser-9.7 - Normal Assembly Component Rows For Reference Hierarchy
### [ ] Browser-10 - Unified Project Object Tree Source Of Truth
### [x] Browser-10.1 - Unified Reference-Backed Project Owner Records
### [x] Browser-10.2 - Single Browser Tree Derivation
### [x] Browser-10.3 - Unified Owner Routing Across Browser Console And Viewer
### [x] Browser-10.4 - Load And Runtime Traits On Normal Nodes
### [x] Browser-10.5 - Compatibility Seam Retirement
### [ ] Browser-11 - Real Project-Owned Reference Containers And Full Container Parity
### [x] Browser-11.1 - Promote Visible Reference Containers Into Real Owner Records
### [x] Browser-11.2 - Container Drag And Reparent Parity
### [x] Browser-11.3 - Grouping Label Survival And Tree Simplification
### [x] Browser-11.4 - Adapted Container Seam Retirement
### [x] Browser-11.5 - Cross-Parent First-Drop Ordering Parity
### [x] Browser-12 - Part Row Surface Cleanup And Usability Polish
### [ ] Browser-12.1 - Real STEP Import Row Progress

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

Source docs:
- `docs/Human-Plans/Architecture/Build-Path/build-path-index.md`
- `docs/Human-Plans/Architecture/Build-Path/Build-Path_Vision.md`

Current read:
- `Build Path` now has both:
  - one stable north-star vision doc
  - one umbrella index for sequencing and ownership split
- the family still does not have a real standalone implementation ladder yet
- the current family read is:
  - authored graph diffs plus accepted checkpoints
  - non-destructive historical scrubbing by default
  - worker/runtime history truth first
  - workspace-mode UX second
- the concept should be read as:
  - a git-like authored graph history surface backed by accepted checkpoints
  - not a replacement for `Spaghetti`
  - not the same thing as `Edit History`
- the likely dependency order is:
  - current workspace cleanup first so the slim timeline surface has a stable home
  - earlier `Edit History` groundwork next so the timeline can consume a canonical committed-diff seam without becoming the undo/history system itself
- the next cleanup for this family is still probably to branch the first real standalone phase doc into `Future/` once the first honest read-only scrub slice is tightened around that narrower role

### [~] Build Path - Umbrella Concept And First Questions

## [~] Cleanup
### Info

Source doc:
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`

Current read:
- `Cleanup` is no longer just a broad vision lane
- it is now a real cross-cutting family with a long shipped ladder plus one remaining follow-on:
  - `Cleanup 1` through `Cleanup 10`
    - shipped
  - `Cleanup 11`
    - open
- the completed cleanup work now covers:
  - startup truth
  - canonical owner locking
  - shared worker boundary repair
  - workspace and Browser derivation cleanup
  - graph accepted-result ownership
  - CAD authoring and packaging cleanup
  - Browser/Console sink reduction
  - optional workspace-family scope decisions
- the main remaining family follow-on is:
  - `Cleanup 11 - Naming, Docs, And Honest Label Hardening`

### [x] Cleanup 1 - Startup Path Canonicalization
### [x] Cleanup 2 - Canonical Owner Decision Lock
### [x] Cleanup 3 - Shared Boundary And Worker Contract Repair
### [x] Cleanup 4 - Workspace Truth And AppShell Simplification
### [x] Cleanup 4A - Workspace Surface Catalog And Capability Registry
### [x] Cleanup 5 - Project Content And Browser Derivation Cleanup
### [x] Cleanup 6 - Graph Runtime And Accepted Result Ownership
### [x] Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification
### [x] Cleanup 8 - CAD Node Family Packaging And Command Library Extraction
### [x] Cleanup 8A - Feature-Stack And Graph-Native CAD Contract Convergence
### [x] Cleanup 9 - Browser And Console Complexity Reduction
### [x] Cleanup 10 - Optional Workspace Family Scope Decisions
### [ ] Cleanup 11 - Naming, Docs, And Honest Label Hardening

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
- the `Workspace Modes` family kept moving after this roadmap stopped updating
- the shipped groundwork now includes:
  - `Workspace 0.1` through `Workspace 6`
  - `Workspace 7.1`
  - `Workspace 7.2`
  - `Workspace 7.2c`
  - `Workspace 7.2d`
  - `Workspace 7.2e`
  - `Workspace 7.2f`
  - `Workspace 7.3`
  - `Workspace 7.5-1`
  - `Workspace 7.5-2`
  - `Workspace 7.5-3`
- the active open follow-ons are now the real native workspace docs:
  - `Workspace 5.3`
  - `Workspace 7`
  - `Workspace 7.2b`
  - `Workspace 7.5`
  - `Workspace 7.5-4`
  - `Workspace 7.5-5`
  - `Workspace 7.5-17`

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
### [x] Workspace 7.1 - Viewport Slot Foundations, Header Shell, And First Split Loop
### [x] Workspace 7.2 - Duplicated Surface Instances, Restore Rules, And Host-Mode Parity
### [ ] Workspace 7.2b - Host-Mode Parity And Split-Host Retirement
### [x] Workspace 7.2c - Primary Viewport Left Dock Unification
### [x] Workspace 7.2c-1 - Primary Viewport Left Dock Host Extraction
### [x] Workspace 7.2c-2 - Left Dock Ref Repoint And Behavior Parity
### [x] Workspace 7.2c-3 - Old Left Dock Shell Retirement And Cleanup
### [x] Workspace 7.2d - Explicit Browser Toolbar Ownership And Left-Dock Rehoming
### [x] Workspace 7.2d-1 - Browser Toolbar Owner State And AppShell Repoint
### [x] Workspace 7.2d-2 - Browser Toolbar Claim And Rehoming Parity
### [x] Workspace 7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking
### [x] Workspace 7.2e-1 - Cursor-Driven Pane Split Preview Precision
### [x] Workspace 7.2e-2 - Adaptive Dual Ghost Nested Split Suggestions
### [x] Workspace 7.2f - Dual-Band Edge Intent And Whole-Browser Split Signaling
### [x] Workspace 7.2f-1 - Dual-Band Edge Intent State And Right-Side Proof
### [x] Workspace 7.2f-2 - Four-Side Expansion And Whole-Browser Ghost Layering
### [x] Workspace 7.3 - Multiple Model Viewports And Per-Viewport Runtime Parity
### [x] Workspace 7.3-1 - Second Model Viewport Runtime And Slot Truth
### [x] Workspace 7.3-2 - Per-Viewport Host Targeting And Viewer Rehome Parity
### [ ] Workspace 7.5 - Surface Host Standardization And Reusable Window Contract
### [x] Workspace 7.5-1 - Shared Surface Placement Contract And Host Route Ownership
### [x] Workspace 7.5-2 - Spaghetti Edge-Dock Split Truth And Workspace-Owned Resize
### [x] Workspace 7.5-3 - Host Adapter Retirement And Future Surface Onboarding
### [~] Workspace 7.5-4 - Browser And Spaghetti Shell Parity Cleanup
### [~] Workspace 7.5-5 - Multiple Spaghetti Editor Surface Parity
### [~] Workspace 7.5-17 - Dashboard And Notepad Surface Onboarding

## [~] Model Viewport
### Info

Source doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`

Current read:
- `Model Viewport` now has its own real family home instead of living only as workspace spillover
- the umbrella `Model-Viewport 1` phase is still open, but its first child ladder already moved:
  - `Model-Viewport 1.1`
    - shipped
- the next open work remains inside the `Model-Viewport 1` umbrella after the shared geometry request/result groundwork

### [ ] Model-Viewport 1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path
### [x] Model-Viewport 1.1 - Shared Geometry IR And Result Contract

## [~] Spaghetti Editor
### Info

Source docs:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Master_Spaghetti_Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass.md`

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
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch-Index2.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`

Current read:
- the node family now has the deepest architecture-side phase tree
- the current structure is really three linked tracks:
  - shared node / `EWR` foundation
  - sketch authoring family
  - extrude follow-on family

Important note:
- `Extrude` is no longer stuck at the first open phase
- the live family index now shows:
  - `Extrude-1A`
    - shipped
  - `Extrude-4`
    - shipped
  - `Extrude-5`
    - shipped
  - `Extrude-6`
    - shipped
  - `Extrude-7`
    - shipped
- `Sketch` also now has a newer child ladder beyond the older `3.2A` and `3.2B` tracks:
  - `Sketch-1`
    - shipped
  - `Sketch-2`
    - in progress through the changelog even though the family index still reads it as a follow-on

### [~] Sketch

#### [x] Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering
#### [~] Sketch-2 - Sketch Node Output Cleanup And Profile Array Surface

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

### [~] Extrude

#### [~] Extrude-1 - Transform-Aware Preview And Runtime Alignment Family
#### [x] Extrude-1A - Sketch Plane Transform Through Graph-Native Extrude
#### [ ] Extrude-1B - Graph-Node And Feature-Stack Extrude Contract Convergence
#### [~] Extrude-2 - Node Enrichment And Toolbar Polish
#### [x] Extrude-2.1 - Extrude Input Pin Template Parity
#### [~] Extrude-3 - Type Modes And Functional Completion
#### [x] Extrude-3.1 - Enum Input Row And Type Selector
#### [x] Extrude-3.2 - Real Type Modes Contract
#### [x] Extrude-3.3 - Direction Modes And Depth Row Contract
#### [~] Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty
#### [x] Extrude-4 - Closed Profile Selection And Consumption Contract
#### [x] Extrude-5 - Output Row Standardization And UI Cleanup
#### [x] Extrude-6 - SketchProfiles Collection Input Contract
#### [x] Extrude-7 - Multi-Wire SketchProfiles Input Enablement

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

## [~] Worker Vision
### Info

Source doc:
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`

Current read:
- the original `Worker` ladder is still fully shipped, but the live worker planning surface now continues through the newer `Worker Vision` family
- the current worker-vision state is:
  - `Worker Vision Phase 1`
    - shipped
  - `Worker Vision Phase 2`
    - shipped
  - `Worker Vision Phase 3`
    - open umbrella with `Worker-Vision-3 Phase 1` through `Phase 5` shipped and `Phase 6` still open
  - `Worker Vision Phase 4`
    - open
  - `Worker Vision Phase 5`
    - open

### [x] Worker Vision Phase 1 - Request Supersession And Cooperative Early Abort
### [x] Worker Vision Phase 2 - Draft Preview Scheduling And Settle Rules
### [ ] Worker Vision Phase 3 - Authoritative Scheduling And Final Acceptance Rules
### [x] Worker-Vision-3 Phase 1 - Authoritative Policy Contract And Request-Time Ownership
### [x] Worker-Vision-3 Phase 2 - Authoritative Waiting State And Latest-Intent Replacement
### [x] Worker-Vision-3 Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow
### [x] Worker-Vision-3 Phase 4 - Accepted Draft Versus Authoritative Promotion Rules
### [x] Worker-Vision-3 Phase 5 - Hardening And Family Handoff
### [ ] Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup
### [ ] Worker Vision Phase 4 - Shared Runtime Publication For Browser, Console, And Viewport Runtime Inspector
### [ ] Worker Vision Phase 5 - Export And Long-Lived Runtime Reuse Over Accepted Authoritative Truth

## [~] Viewport Runtime Inspector
### Info

Source doc:
- `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Viewport-Runtime-Inspector-Index.md`

Current read:
- `Viewport Runtime Inspector` is now a real worker-adjacent family, not only a vision note
- the live family already has three shipped ladders:
  - `VRI-1`
    - shipped
  - `VRI-2`
    - shipped
  - `VRI-3`
    - shipped
- the current open follow-on is:
  - `VRI-4`
    - open
- the shipped runtime-inspector work already covers:
  - shell and combined read-model foundation
  - viewport stats
  - current task
  - queue and archive truth
  - accepted change-impact summary and grouped rows
  - untouched-result hardening before later multi-lane widening

### [x] VRI-1 - Foundation Runtime Surface
### [x] VRI-1.1 - Panel Shell And Expand Collapse Contract
### [x] VRI-1.2 - Viewport Stats Foundation
### [x] VRI-1.3 - Active Runtime Task Card
### [x] VRI-1.4 - Combined Inspector Read Model And Hardening
### [x] VRI-2 - Queue Visibility And Archive Truth
### [x] VRI-2.1 - Queue Read Contract And Store Widening
### [x] VRI-2.2 - Active Queue Surface
### [x] VRI-2.3 - Archive Truth Surface
### [x] VRI-2.4 - Queue Lifecycle Hardening And Handoff
### [x] VRI-3 - Change Impact And Dependency Visibility
### [x] VRI-3.1 - Accepted Impact Read Contract And Store Widening
### [x] VRI-3.2 - Compact Change Impact Summary Surface
### [x] VRI-3.3 - Impact Entry VM And Grouping Contract
### [x] VRI-3.4 - Impact Row Surface
### [x] VRI-3.5 - Untouched Truth Hardening And Family Handoff
### [ ] VRI-4 - Multi-Lane Runtime Cards And Parallel Graph Execution

## [x] AppShell
### Info

Source doc:
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`

Current read:
- the current dedicated `AppShell` family is fully shipped for its local `[5.0F]` cleanup ladder
- there is no open `5.0F` follow-on left inside the current AppShell family doc
- if a later `AppShell` cleanup returns, it should be treated as a new workspace-driven follow-on after the current open workspace lane such as `Workspace 7.2b`, `Workspace 7.5`, `Workspace 7.5-4`, `Workspace 7.5-5`, `Workspace 7.5-17`, and `Workspace 5.3`, not as a reopening of the shipped `[5.0F]` family

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
- [x] `Workspace 7.1`
- [x] `Workspace 7.2`
- [ ] `Workspace 7.2b`
- [x] `Workspace 7.2c`
- [x] `Workspace 7.2d`
- [x] `Workspace 7.2e`
- [x] `Workspace 7.2f`
- [x] `Workspace 7.3`
- [ ] `Workspace 7.5`
- [~] `Workspace 7.5-4`
- [~] `Workspace 7.5-5`
- [~] `Workspace 7.5-17`
- [ ] `Workspace 5.3`

#### [~] - 2 - Cleanup
- [x] `Cleanup 1`
- [x] `Cleanup 2`
- [x] `Cleanup 3`
- [x] `Cleanup 4`
- [x] `Cleanup 4A`
- [x] `Cleanup 5`
- [x] `Cleanup 6`
- [x] `Cleanup 7`
- [x] `Cleanup 8`
- [x] `Cleanup 8A`
- [x] `Cleanup 9`
- [x] `Cleanup 10`
- [ ] `Cleanup 11`

#### [ ] - 3 - Later AppShell Cleanup
- [ ] `AppShell - Later Workspace Cleanup Follow-On`

#### [ ] - 4 - Model Viewport
- [ ] `Model-Viewport 1`
- [x] `Model-Viewport 1.1`

#### [ ] - 5 - View Toolbar
- [ ] `View Toolbar 1` (`[5.0I-1]`)
- [ ] `View Toolbar 2` (`[5.0I-2]`)
- [ ] `View Toolbar 3` (`[5.0I-3]`)
- [ ] `View Toolbar 4` (`[5.0I-4]`)

#### [ ] - 6 - Sketch
- [x] `Sketch-1`
- [~] `Sketch-2`
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

#### [~] - 7 - Extrude
- [~] `Extrude 1`
- [x] `Extrude 1A`
- [ ] `Extrude 1B`
- [~] `Extrude 2`
- [x] `Extrude 2.1`
- [~] `Extrude 3`
- [x] `Extrude 3.1`
- [x] `Extrude 3.2`
- [x] `Extrude 3.3`
- [~] `Extrude 3.4`
- [x] `Extrude 4`
- [x] `Extrude 5`
- [x] `Extrude 6`
- [x] `Extrude 7`

#### [ ] - 8 - Layers
- [ ] `Layers 1`
- [ ] `Layers 2`
- [ ] `Layers 3`
- [ ] `Layers 4`

#### [ ] - 9 - Edit History
- [ ] `Edit History 1`
- [ ] `Edit History 2`
- [ ] `Edit History 3`
- [ ] `Edit History 4`
- [ ] `Edit History 5`

#### [~] - 10 - Build Path
- [~] `Build Path - Umbrella Concept And First Questions`

#### [ ] - 11 - Worker Vision
- [x] `Worker Vision 1`
- [x] `Worker Vision 2`
- [ ] `Worker Vision 3`
- [x] `Worker-Vision-3 Phase 1`
- [x] `Worker-Vision-3 Phase 2`
- [x] `Worker-Vision-3 Phase 3`
- [x] `Worker-Vision-3 Phase 4`
- [x] `Worker-Vision-3 Phase 5`
- [ ] `Worker-Vision-3 Phase 6`
- [ ] `Worker Vision 4`
- [ ] `Worker Vision 5`

#### [~] - 12 - Viewport Runtime Inspector
- [x] `VRI 1`
- [x] `VRI 1.1`
- [x] `VRI 1.2`
- [x] `VRI 1.3`
- [x] `VRI 1.4`
- [x] `VRI 2`
- [x] `VRI 2.1`
- [x] `VRI 2.2`
- [x] `VRI 2.3`
- [x] `VRI 2.4`
- [x] `VRI 3`
- [x] `VRI 3.1`
- [x] `VRI 3.2`
- [x] `VRI 3.3`
- [x] `VRI 3.4`
- [x] `VRI 3.5`
- [ ] `VRI 4`

#### [ ] - 13 - Export
- [ ] `Export 1`
- [ ] `Export 2`
- [ ] `Export 3`
- [ ] `Export 4`
- [ ] `Master Spaghetti 1`

### Other Open Families

- [ ] `Browser 7`
- [ ] `Browser 8`
- [ ] `Browser 9`
- [ ] `Browser 10`
- [ ] `Browser 11`
- [ ] `Browser 12.1`
- [~] `Console 4.1I`
- [ ] `Camera Controls 5` (`[5.0H-5]`)
- [ ] `Radio 8`
- [ ] `Radio 11`

### Shipped Reference

1. [x] `App Shell 1` (`[5.0F]`)
2. [x] `App Shell 2` (`[5.0F-1]`)
3. [x] `App Shell 3` (`[5.0F-2]`)
4. [x] `Worker 1` (`[5.3A-1]`)
5. [x] `Worker 3` (`[5.3A-3]`)
6. [x] `Worker 2` (`[5.3A-2]`)
7. [x] `Browser 1`
8. [x] `Browser 2`
9. [x] `Browser 3`
10. [x] `Browser 4`
11. [x] `Browser 5`
12. [x] `Browser 5.1`
13. [x] `Browser 5.2`
14. [x] `Browser 5.3`
15. [x] `Browser 5.5`
16. [x] `Browser 5.4`
17. [x] `Worker 4` (`[5.3A-4]`)
18. [x] `Worker 5` (`[5.3A-5]`)
19. [x] `Worker 6` (`[5.3A-6]`)
20. [x] `Worker 7` (`[5.3A-7]`)
21. [x] `Browser 6`
22. [x] `Browser 7.1`
23. [x] `Browser 8.3`
24. [x] `Browser 8.4`
25. [x] `Browser 8.8.1`
26. [x] `Browser 8.8.2`
27. [x] `Browser 8.1`
28. [x] `Browser 8.8.3`
29. [x] `Browser 8.2`
30. [x] `Browser 9.1`
31. [x] `Browser 9.2`
32. [x] `Browser 9.3`
33. [x] `Browser 9.4`
34. [x] `Browser 9.5`
35. [x] `Browser 8.5`
36. [x] `Browser 9.6`
37. [x] `Browser 9.7`
38. [x] `Browser 8.7`
39. [x] `Browser 10.1`
40. [x] `Browser 10.2`
41. [x] `Browser 10.3`
42. [x] `Browser 10.4`
43. [x] `Browser 10.5`
44. [x] `Browser 11.1`
45. [x] `Browser 11.2`
46. [x] `Browser 11.3`
47. [x] `Browser 11.4`
48. [x] `Browser 11.5`
49. [x] `Browser 12`
50. [x] `Workspace 7.1`
51. [x] `Workspace 7.2`
52. [x] `Workspace 7.2c`
53. [x] `Workspace 7.2d`
54. [x] `Workspace 7.2e`
55. [x] `Workspace 7.2f`
56. [x] `Workspace 7.3`
57. [x] `Workspace 7.5-1`
58. [x] `Workspace 7.5-2`
59. [x] `Workspace 7.5-3`
60. [x] `Extrude 1A`
61. [x] `Extrude 2.1`
62. [x] `Extrude 3.1`
63. [x] `Extrude 3.2`
64. [x] `Extrude 3.3`
65. [x] `Model-Viewport 1.1`
66. [x] `Sketch-1`
67. [x] `Extrude 4`
68. [x] `Extrude 5`
69. [x] `Extrude 6`
70. [x] `Extrude 7`
71. [x] `VRI 1`
72. [x] `VRI 1.1`
73. [x] `VRI 1.2`
74. [x] `VRI 1.3`
75. [x] `VRI 1.4`
76. [x] `VRI 2`
77. [x] `VRI 2.1`
78. [x] `VRI 2.2`
79. [x] `VRI 2.3`
80. [x] `VRI 2.4`
81. [x] `VRI 3`
82. [x] `VRI 3.1`
83. [x] `VRI 3.2`
84. [x] `VRI 3.3`
85. [x] `VRI 3.4`
86. [x] `VRI 3.5`
87. [x] `Worker Vision 1`
88. [x] `Worker Vision 2`
89. [x] `Worker-Vision-3 Phase 1`
90. [x] `Worker-Vision-3 Phase 2`
91. [x] `Worker-Vision-3 Phase 3`
92. [x] `Worker-Vision-3 Phase 4`
93. [x] `Worker-Vision-3 Phase 5`
94. [x] `Cleanup 1`
95. [x] `Cleanup 2`
96. [x] `Cleanup 3`
97. [x] `Cleanup 4`
98. [x] `Cleanup 4A`
99. [x] `Cleanup 5`
100. [x] `Cleanup 6`
101. [x] `Cleanup 7`
102. [x] `Cleanup 8`
103. [x] `Cleanup 8A`
104. [x] `Cleanup 9`
105. [x] `Cleanup 10`

## Next Cleanup

The likely next maintenance pass for this file is:
- add more family notes only when a source architecture doc gains a real new phase
- avoid inventing roadmap-only phase ids that do not exist in the family source docs
- keep the newer `Worker Vision`, `Model Viewport`, `Sketch-1/2`, and `Extrude-6/7` ladders synced from their native family docs instead of leaving them changelog-only
- keep the newer `Cleanup` and `Viewport Runtime Inspector` ladders synced from their native family indexes now that both families have real shipped/open phase trees
- keep `Spaghetti Editor` explicit as a current gap until it gets a denser architecture-side phase ladder of its own
- let `Build Path` stay marked as an umbrella concept family until its first standalone execution phase exists, while keeping the new vision doc and the umbrella index read aligned
- keep the workspace checklist synced to the native `Workspace-Modes` family docs instead of reviving the older `Workspace 7.5-7` through `7.5-11` shorthand after the live family has moved on
