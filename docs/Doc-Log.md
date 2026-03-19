# Doc Log

## Doc Header

### Doc History
1. 2026-03-18 16:09: Created this file as the canonical permanent log for document changes and split docs tracking away from `docs/CHANGELOG.md`

### Purpose

This file is the canonical permanent history for document changes in `/20/parahook`.

Use it for:
- docs created, renamed, reorganized, or rewritten under `docs/`
- `README.md` updates
- architecture, planning, and repo-rules documentation changes
- documentation-structure and canonical-source updates

Do not use it for:
- shipped code, schema, config, or runtime behavior changes
- temporary chill-mode batch logging
- active task checklists that belong inside their own task docs

### Doc-Log Rules

- each permanent doc-log entry in `## Doc Body` starts with an HTML divider comment
- the main entry heading for new entries should use `###` in this shape:
  - `### [NNN] - YYYY-MM-DD HH:MM - `DOC - Title``
- increment `[NNN]` by `1` for each new permanent entry
- add new permanent entries at the top of the live entry list
- directly under the entry wrapper, include one headerless summary line in this shape:
  - `HUMAN SUMMARY: 1-3 sentences about what this document change did`
- standard entry subsections use `####`
- prefer this subsection order:
  - `HUMAN SUMMARY: ...`
  - `#### Scope`
  - `#### Summary`
  - `#### Files Changed`
  - `#### Notes`
- when chill mode is active, use `docs/Chill-Log.md` for rapid doc-batch logging and consolidate later into `docs/Doc-Log.md` when needed
- keep numbering sequential unless the user explicitly asks for a renumber pass

## Doc Body

<!-- ENTRY 055 -->
### [055] - 2026-03-19 00:07 - `DOC - Update Toolbar Template Doc With New Shared Features`
<!-- ENTRY 055 -->
HUMAN SUMMARY: `Updated the shared toolbar architecture doc so it reflects the newer template features already proven by the sketch-plane toolbar. The note now covers title-bar density modes, accent-tinted body scrollbars, and the reusable horizontal subsection split bar.` 

#### Scope
- Updated the shared toolbar architecture doc only.
- Kept the change focused on documenting new template capabilities, not changing runtime code.
- Used the existing `Toolbar.md` note as the canonical template doc instead of creating a duplicate `Template.md`.

#### Summary
- Added the newer shared toolbar-template features to `docs/Human-Plans/Architecture/Toolbar.md`.
- Documented:
  - `collapsed / essentials / expanded` density modes
  - the shared `-/e/+` title-bar density-cycle pattern
  - accent-tinted body scrollbar expectations
  - the reusable horizontal subsection split bar
- Updated the ownership and guardrail sections so these behaviors are treated as shared shell features rather than sketch-only behavior.

#### Files Changed
- `docs/Human-Plans/Architecture/Toolbar.md`
- `docs/Doc-Log.md`

#### Notes
- `Toolbar.md` is currently the canonical shared template note under `docs/Human-Plans/Architecture/`; there is no separate `Template.md` file there right now.

<!-- ENTRY 054 -->
### [054] - 2026-03-18 23:58 - `DOC - Add Toolbar Architecture Doc`
<!-- ENTRY 054 -->
HUMAN SUMMARY: `Added a new architecture doc for the reusable viewport toolbar template so the shared shell contract is documented outside the sketch doc. The new note locks the key template details: draggable title bar, title-bar close action, all-edge and all-corner resize, sectioned body layout, and object-type-based color theming.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Kept the change focused on documenting the shared toolbar template rather than changing runtime code.
- Captured the color-theme rule explicitly so future viewport toolbars inherit object-type-driven chrome.

#### Summary
- Created `docs/Human-Plans/Architecture/Toolbar.md`.
- Documented the reusable viewport toolbar shell as a floating-window template.
- Recorded the important shared requirements:
  - draggable title bar
  - title-bar close action
  - all-edge resize
  - all-corner resize
  - sectioned body layout
  - object-type-based color theme
- Clarified the ownership split between shared shell chrome and tool-specific body content.

#### Files Changed
- `docs/Human-Plans/Architecture/Toolbar.md`
- `docs/Doc-Log.md`

#### Notes
- The first concrete consumer remains the sketch-plane toolbar, but the new doc is intentionally generic so future viewport tools can reuse the same template honestly.

<!-- ENTRY 053 -->
### [053] - 2026-03-18 22:49 - `DOC - Split Sketch Cleanup Part 2 Into 2A And 2B`
<!-- ENTRY 053 -->
HUMAN SUMMARY: `Split the sketch architecture doc’s single `3.2B-2-Cleanup Part 2` implementation-ready spec into two smaller implementation-ready subphases so real Three ghost-plane ownership lands first in `2A`, and reused `TransformGizmo` attachment plus live draft transform lands second in `2B`.` 

#### Scope
- Updated the sketch node architecture doc only.
- Kept the change focused on breaking one larger cleanup phase into two smaller implementation-ready phases.
- Did not change runtime code.

#### Summary
- Replaced the single `3.2B-2-Cleanup Part 2` implementation-ready spec with:
  - `3.2B-2-Cleanup Part 2A - Real Three Ghost Planes And Preview Pivot`
  - `3.2B-2-Cleanup Part 2B - Reused TransformGizmo Attachment And Live Draft Transform`
- Kept `2A` focused on viewer ownership, Three ghost planes, preview pivot, grid/helper, and raycast plane picking.
- Kept `2B` focused on attaching the existing viewer `TransformGizmo` to the preview pivot and mapping live draft move/rotate back into sketch-plane draft state.
- Recorded the sequencing/default assumption that `2A` should ship before `2B`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- Both new subphases remain origin-plane only and keep geometry-derived picking deferred to `3.2B-3`.

<!-- ENTRY 052 -->
### [052] - 2026-03-18 22:44 - `DOC - Make Sketch Cleanup Part 2 Implementation-Ready`
<!-- ENTRY 052 -->
HUMAN SUMMARY: `Updated the sketch architecture doc so `3.2B-2-Cleanup Part 2` is now implementation-ready, locking the reuse of the existing viewer `TransformGizmo`, the addition of three real Three-rendered ghost origin planes, and the ownership split between `ViewportOverlay`, `sketchPlanePickSession`, and a new viewer-side sketch-plane helper module.` 

#### Scope
- Updated the sketch node architecture doc only.
- Turned the previous open-question checklist into a locked implementation-ready spec.
- Did not change runtime code.

#### Summary
- Replaced the open `Cleanup Part 2` question list with locked defaults.
- Recorded the decision to reuse the existing viewer `TransformGizmo` for sketch-plane `move + rotate`.
- Recorded the decision to add three real Three-rendered ghost planes around a temporary sketch-plane preview pivot.
- Added an implementation-ready spec covering:
  - viewer ownership
  - temporary preview pivot/helper lifecycle
  - raycasting against ghost planes
  - live draft mapping
  - overlay-vs-viewer responsibilities
  - visual defaults
  - test targets

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This section is now ready to drive the next implementation pass directly.

<!-- ENTRY 051 -->
### [051] - 2026-03-18 22:37 - `DOC - Add Sketch Cleanup Part 2 Three-Render Decision Checklist`
<!-- ENTRY 051 -->
HUMAN SUMMARY: `Added a new `3.2B-2-Cleanup Part 2` section to the sketch architecture doc so the next cleanup pass has a structured decision checklist for replacing the DOM/CSS ghost planes and origin cues with real Three-rendered viewer content.` 

#### Scope
- Updated the sketch node architecture doc only.
- Focused on planning the next cleanup pass after the first main-viewport integration.
- Did not change runtime code or lock final implementation answers yet.

#### Summary
- Added a dedicated `3.2B-2-Cleanup Part 2` section under the sketch architecture doc.
- Captured the intended target of moving the origin gizmo, axis cues, and ghost origin planes into real viewer-owned Three rendering.
- Added checklist-style open questions with suggestions for:
  - viewer ownership
  - Three meshes/helpers
  - raycasting
  - draft-state mapping
  - active-plane highlighting
  - temporary lifecycle
  - test expectations
  - a possible dedicated sketch-plane viewer helper module

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This keeps the next cleanup pass decision-focused before implementation starts.

<!-- ENTRY 050 -->
### [050] - 2026-03-18 22:19 - `DOC - Refine Sketch 3.2B-2 Cleanup Visual Targets`
<!-- ENTRY 050 -->
HUMAN SUMMARY: `Refined the sketch `3.2B-2-Cleanup` phase so it now explicitly owns restoring the compact sketch-plane toolbar style and moving the source-pick interaction into the real main model viewport with a central origin gizmo and three clickable ghost origin planes.` 

#### Scope
- Updated the sketch node architecture doc only.
- Tightened the cleanup-phase product targets rather than changing runtime code.
- Kept the change local to `3.2B-2-Cleanup`.

#### Summary
- Added the requirement that cleanup should return the sketch-plane session toolbar to the earlier compact title-bar style keyed off the sketch-plane pin color.
- Added the intended main-viewport interaction composition:
  - origin gizmo at the world origin
  - three ghost origin planes/boxes
  - direct click targets on those planes
  - compact side controls instead of a faux embedded viewport panel
- Updated the cleanup findings and acceptance targets to match that intended layout.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This keeps the cleanup phase focused on making the first `3.2B-2` viewport-pick cut read honestly in the main viewer before broader geometry-pick or transform-tool follow-on work.

<!-- ENTRY 049 -->
### [049] - 2026-03-18 22:14 - `DOC - Add Sketch 3.2B-2 Cleanup Phase Definition`
<!-- ENTRY 049 -->
HUMAN SUMMARY: `Added a real `3.2B-2-Cleanup` phase section to the sketch architecture doc so the post-implementation cleanup work for the first viewport-first sketch-plane pick cut is now captured explicitly instead of living as ad hoc follow-up.` 

#### Scope
- Updated the sketch node architecture doc only.
- Focused on replacing the placeholder `3.2B-2-Cleanup` phase with a concrete cleanup definition.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Replaced the placeholder `3.2B-2-Cleanup` heading with a real titled cleanup phase.
- Documented what that cleanup phase owns after the first viewport-first source-pick implementation lands.
- Captured the current cleanup findings around:
  - faux mini-viewport feel
  - main model viewport ownership
  - draft-versus-committed cleanup
  - temporary console/dev seams
- Added a recommended acceptance target so this cleanup phase can later become implementation-ready without rediscovering the same issues.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This phase intentionally stays inside `3.2B-2` follow-through.
- It does not pull `3.2B-3` geometry-driven picking or later generic transform-tool work forward.

<!-- ENTRY 048 -->
### [048] - 2026-03-18 21:54 - `DOC - Make Sketch 3.2B-2 Section Implementation-Ready`
<!-- ENTRY 048 -->
HUMAN SUMMARY: `Revised the `3.2B-2` phase section in the sketch node architecture doc so it now contains its own implementation-ready spec, including the locked viewport-first source-pick flow, implementation seams, acceptance checks, and out-of-scope boundaries, and promoted the remaining `3.2B-2` default suggestions into explicit decisions so the phase reads as decision-complete in one place.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `3.2B-2` phase section and its matching decision checklist.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an implementation-ready spec directly under the `3.2B-2` phase heading.
- Locked the remaining `3.2B-2` defaults covering origin-only scope, world-space-only first gizmo behavior, preview boundaries, row/live-session behavior, deferred face picking, and extension of the existing `sketchPlanePickSession` seam.
- Reframed the `3.2b-2` decision block as a decision-complete checklist rather than an open-question surface.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is a docs-only planning/spec update intended to make the next implementation command straightforward.

<!-- ENTRY 047 -->
### [047] - 2026-03-18 21:47 - `DOC - Lock Sketch 3.2B-2 Live Gizmo Session And First Gizmo Scope`
<!-- ENTRY 047 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decisions `6` and `7`, locking the first viewport-first source-pick cut to one continuous live placement session and keeping the first gizmo toolset to `move + rotate` while leaving `Flip` outside the gizmo for now.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to two `3.2B-2` product decisions about same-session gizmo behavior and first gizmo control scope.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist items `6` and `7` as decided.
- Recorded that origin-plane pick should immediately open the sketch-origin gizmo in the same live placement session and stay active until `Done` or `Enter`.
- Clarified that the first viewport gizmo should support `move + rotate`, while `Flip` remains in the row/control surface until a later phase.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the viewport gizmo session.

<!-- ENTRY 046 -->
### [046] - 2026-03-18 21:42 - `DOC - Restore Numeric Order In Sketch 3.2B-2 Decisions`
<!-- ENTRY 046 -->
HUMAN SUMMARY: `Reordered the `3.2B-2` viewport-pick decision questions in the sketch node architecture doc so the later-added picker replacement questions no longer interrupt the numeric flow and the checklist now reads cleanly from `1` through `15`.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to question ordering/readability inside the `3.2B-2` decision block.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Moved `3.2B-2` questions `14` and `15` down below question `13`.
- Preserved the decision content for `14` and the open suggestion for `15`.
- Restored a strictly increasing numeric order for the full decision checklist.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is a readability/maintenance cleanup only.

<!-- ENTRY 045 -->
### [045] - 2026-03-18 21:41 - `DOC - Lock Sketch 3.2B-2 Picker Replacement Direction`
<!-- ENTRY 045 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `14`, locking the direction that the current sketch-plane picker should be expanded into the newer viewport-first source-pick tool and should replace the old overlay picker instead of living beside it as a second long-term workflow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on one `3.2B-2` product decision about picker replacement versus parallel picker systems.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `14` as decided.
- Recorded that the existing sketch-plane picker should be expanded into the newer viewport-first source-pick tool.
- Clarified that the newer viewport-first path should become the canonical replacement workflow rather than leaving two equal long-term picker systems alive.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and still allows a short transitional overlap during implementation if needed.

<!-- ENTRY 044 -->
### [044] - 2026-03-18 21:39 - `DOC - Update Sketch Viewport-Pick Plan With Current Code Reality`
<!-- ENTRY 044 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc with current code findings so the viewport-first source-pick plan now explicitly reflects the repo's existing collapsed-window shell, distinguishes it from panel header collapse, and records that the current `Pick In Viewport` flow is still an older overlay-based `XY / XZ / YZ` picker that `3.2B-2` should replace.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Refined the `3.2B-2` planning surface with current implementation truth from the app shell, panel, and viewport overlay code.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a `Current code reality` block to the sketch viewport-pick section.
- Clarified that the existing compact source-pick surface should reuse the real window-level `Spaghetti Editor` `collapsed mode`, not the separate panel header-collapse behavior.
- Added two new `3.2B-2` planning questions covering replacement of the legacy overlay picker and whether to extend the current `sketchPlanePickSession` seam versus introducing a richer dedicated session model.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and reflects code research rather than shipped implementation.

<!-- ENTRY 043 -->
### [043] - 2026-03-18 21:35 - `DOC - Lock Sketch 3.2B-2 Collapsed-Mode Bar Decision`
<!-- ENTRY 043 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `3`, locking the viewport-pick compact surface to the existing preset `Spaghetti Editor` `collapsed mode` so source picking hides the editor body and reuses the top bar instead of introducing a separate mini-shell concept.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision about the compact source-pick surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `3` as decided.
- Recorded that entering viewport-first source pick should force the `Spaghetti Editor` into its preset `collapsed mode`.
- Clarified that this mode hides the editor body and reuses the remaining top bar as the visible shell during active pick.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the collapsed-mode transition.

<!-- ENTRY 042 -->
### [042] - 2026-03-18 21:33 - `DOC - Normalize Sketch 3.2B-2 Questions Into Collapsible Question Blocks`
<!-- ENTRY 042 -->
HUMAN SUMMARY: `Reformatted the `3.2B-2` viewport-pick decision area in the sketch node architecture doc so each question now has its own collapsible `####` block with nested `##### Decision` and `##### Suggestion` sections, making the planning surface easier to collapse and use question-by-question.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the formatting and readability of the `3.2B-2` decision surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Converted the remaining `3.2B-2` questions into consistent collapsible question blocks.
- Added a `##### Suggestion` subsection under each question.
- Cleaned up the already-answered first two questions so they match the same structure as the unanswered ones.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning/doc-structure cleanup only and does not itself answer the remaining open `3.2B-2` questions.

<!-- ENTRY 041 -->
### [041] - 2026-03-18 21:28 - `DOC - Refocus Vision Roadmap Into A True North-Star Document`
<!-- ENTRY 041 -->
HUMAN SUMMARY: `Performed a large cleanup pass on the vision roadmap so it now reads more like a true north-star document and less like a second execution roadmap, keeping the product destination, guardrails, and major feature families while removing most of the lane-and-phase-style execution residue.` 

#### Scope
- Updated the high-level vision roadmap under `docs/Human-Plans/roadmap/`.
- Reworked the internal structure substantially while preserving the main ParaHook product and architecture direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Replaced the older detailed lane/phase-heavy middle of `Vision-roadmap.md` with cleaner sections for:
  - `Core System Shape`
  - `What Must Stay True`
  - `Desired End State`
  - `Major Future Feature Families`
  - `High-Level Growth Path`
- Kept the higher-level `North Star`, `Product Vision`, `First-Pass Guardrails`, `Decision Filter`, and closing decision-check surfaces.
- Preserved important long-range directions including graph-native ownership, explicit output handoff, browser/content separation, the app-wide console command-language idea, and the Replicad-aligned node-language direction.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This was an architecture/documentation refocus pass only and does not change the execution roadmap or create new implementation phases by itself.

<!-- ENTRY 040 -->
### [040] - 2026-03-18 21:22 - `DOC - Add Console Command-Language Vision To Vision Roadmap`
<!-- ENTRY 040 -->
HUMAN SUMMARY: `Cleaned up the vision roadmap slightly by adding the long-term app-wide `Console` command-language direction to the higher-level `Product Vision` and `User Experience Shape` sections, so the north-star doc now reflects that future workspace grammar instead of leaving it only in the detailed console architecture file.` 

#### Scope
- Updated the high-level vision roadmap under `docs/Human-Plans/roadmap/`.
- Kept the cleanup intentionally small and limited to the long-term console/workspace-command direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added one `Product Vision` bullet describing the future app-wide `Console` as a command language across workspace, graph, node, and feature domains.
- Added one `User Experience Shape` bullet clarifying that console command flows should become part of the same workspace grammar rather than spawning per-feature mini command systems.
- Added the matching local doc-history entry.

#### Files Changed
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is vision/architecture alignment only and does not create a new execution phase by itself.

<!-- ENTRY 039 -->
### [039] - 2026-03-18 21:20 - `DOC - Add Long-Term Console Command-Language Sentence To Roadmap`
<!-- ENTRY 039 -->
HUMAN SUMMARY: `Updated the live roadmap so Lane `[4]` now explicitly acknowledges the long-term console direction as an app-wide command language that can navigate and act across workspace, graph, node, and feature domains, while leaving the fuller detail in the dedicated console architecture doc.` 

#### Scope
- Updated the live roadmap under `docs/Human-Plans/roadmap/`.
- Limited the change to one roadmap-level sentence plus local roadmap doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added one long-term console-command-language sentence to the Lane `[4]` summary in `roadmap.md`.
- Kept the roadmap change short and high level.
- Left the detailed command-language structure in `docs/Human-Plans/Architecture/Console.md`.

#### Files Changed
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Doc-Log.md`

#### Notes
- This is roadmap/architecture alignment only and does not create a new execution phase by itself.

<!-- ENTRY 038 -->
### [038] - 2026-03-18 21:19 - `DOC - Add Long-Term Graph And Node Command-Language Vision To Console Architecture`
<!-- ENTRY 038 -->
HUMAN SUMMARY: `Expanded the app-wide console architecture doc with a larger long-term command-language vision, recording that the console should eventually be able to navigate graph and node domains entirely through typed command sequences and that future sketch-console actions should plug into that same command system instead of becoming a separate sketch-only console design.` 

#### Scope
- Updated the app-wide console architecture doc under `docs/Human-Plans/Architecture/`.
- Focused the change on the console's long-term command-language direction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a new long-term command-language section to `Console.md`.
- Recorded the future direction that the console should support hierarchical command navigation across app, workspace, graph, node, and later sketch-specific domains.
- Added example command-path language for selecting graphs, entering node scope, and finding or adding sketch nodes.
- Clarified that sketch-plane console actions should eventually plug into the app-wide console grammar rather than creating a separate sketch-only command system.

#### Files Changed
- `docs/Human-Plans/Architecture/Console.md`
- `docs/Doc-Log.md`

#### Notes
- This is architecture/planning work only and does not change the first-pass console implementation boundary.

<!-- ENTRY 037 -->
### [037] - 2026-03-18 21:11 - `DOC - Add Sketch Console Integration Architecture Section`
<!-- ENTRY 037 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a dedicated `Console integration` section so the project now has one stable place to define how early `SketchPlane` viewport-pick work should expose session tracing, status inspection, and temporary developer-side console commands without confusing that debugging seam with the permanent user-facing UI.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the early viewport-pick/debugging workflow around `SketchPlane`.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a dedicated `Console integration` section to the sketch architecture doc.
- Defined console integration as a development/debugging seam rather than the final primary interface.
- Recorded three desired console roles: session tracing, status inspection, and temporary command hooks.
- Captured currently planned/accepted command examples like `Enter` for confirm and `x` for cancel, plus future candidates like `status` and `help`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This section is intended to support the early `3.2B-2` viewport-pick buildout before every session action has a polished permanent UI surface.

<!-- ENTRY 036 -->
### [036] - 2026-03-18 21:10 - `DOC - Lock Sketch 3.2B-2 Exit Model Decision`
<!-- ENTRY 036 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `2`, locking the viewport-pick exit model so the active sketch-plane source session can be exited by the `X` action in the sketch-plane surface, by `Esc`, and by typing `x` in the console during development.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision and its exit-model notes.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `2` as decided.
- Recorded that the active viewport-pick session should exit from the `X` action in the sketch-plane surface.
- Recorded `Esc` as the keyboard exit action and `x` in the console as a development/debugging exit path.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the exit behavior.

<!-- ENTRY 035 -->
### [035] - 2026-03-18 21:08 - `DOC - Lock Sketch 3.2B-2 Confirm-On-Accept Decision`
<!-- ENTRY 035 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc to answer `3.2B-2` decision `1`, locking the viewport-first pick session to stay live until the user explicitly confirms, adding the direction for a confirm action plus `Enter` shortcut, and recording that session steps/actions should be written to the console during development.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to one answered `3.2B-2` decision and its associated implementation notes.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Marked `3.2B-2` checklist item `1` as decided.
- Recorded that viewport-pick should wait for explicit user confirmation instead of auto-committing on first valid click.
- Added the recommendation for a confirm action in the `SketchPlane` surface, an `Enter` shortcut, and console/session tracing while the workflow is still being built.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning capture only and does not yet implement the confirm flow or console tracing.

<!-- ENTRY 034 -->
### [034] - 2026-03-18 21:24 - `DOC - Number Sketch 3.2B-2 Decision Checklist Items`
<!-- ENTRY 034 -->
HUMAN SUMMARY: `Added explicit numbering to the open `3.2B-2` viewport-pick checklist items in the sketch node architecture doc so each remaining decision can be referenced directly during planning discussion and later implementation follow-through.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to numbering the existing `3.2B-2` checklist items.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added explicit numbers `1` through `13` to the `3.2B-2` open decision checklist.
- Kept the existing option lists and decision wording intact.
- Made the section easier to reference in follow-up planning conversations.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation-formatting work only and does not change the underlying phase scope.

<!-- ENTRY 033 -->
### [033] - 2026-03-18 21:22 - `DOC - Convert Sketch 3.2B-2 Open Questions Into A Checklist`
<!-- ENTRY 033 -->
HUMAN SUMMARY: `Reformatted the open `3.2B-2` viewport-pick product questions in the sketch node architecture doc into a checklist so the remaining decisions for that phase can be answered and tracked directly in place as the planning converges.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to formatting the open `3.2B-2` decision list into checklist form.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Converted the `3.2b-2` open questions into checkbox items.
- Kept the option lists underneath the affected decisions so the current design space remains visible.
- Made the section easier to use as a live planning/decision checklist.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation-formatting work only and does not change the underlying sketch-phase direction.

<!-- ENTRY 032 -->
### [032] - 2026-03-18 21:19 - `DOC - Add Sketch 3.2B-2 Implementation Questions To Decisions Section`
<!-- ENTRY 032 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a new `Decisions` section for `3.2B-1` through `3.2B-3`, marking `3.2B-1` as effectively settled and capturing the remaining product questions that still need answers before `3.2B-2` can be treated as implementation-ready.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on execution-readiness and open questions for the next sketch viewport-pick phase.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added concrete blocking questions under `3.2b-2` covering viewport-pick commit model, exit behavior, compact-bar controls, valid geometry types, gizmo scope, preview requirements, and whether model-face picking belongs in the first cut.
- Clarified that `3.2b-1` is effectively complete for planning purposes.
- Clarified that geometry-derived picking decisions should mostly remain in `3.2b-3` unless intentionally pulled earlier.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change is planning/documentation only and is meant to make the next sketch phase easier to scope before implementation begins.

<!-- ENTRY 031 -->
### [031] - 2026-03-18 21:12 - `DOC - Normalize Sketch 3.2B-N Subphase Heading Format`
<!-- ENTRY 031 -->
HUMAN SUMMARY: `Reformatted the local `3.2B-N` subphase map in the sketch node architecture doc so the subphases now use one consistent checkbox-style `##` heading pattern, marking the first shipped sketch cuts as complete and the remaining follow-ons as future work.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to subphase-heading formatting and local doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Normalized the `3.2B-N` subphase headings to a consistent `## [ ] / [x]` format.
- Marked `3.2B-0` and `3.2B-1` as completed in the local planning map.
- Marked `3.2B-2` through `3.2B-6` as unchecked future phases.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change is documentation-structure cleanup only and does not alter the underlying sketch architecture direction.

<!-- ENTRY 030 -->
### [030] - 2026-03-18 20:54 - `DOC - Create Transform Tool Architecture Surface`
<!-- ENTRY 030 -->
HUMAN SUMMARY: `Created a new architecture doc for the ParaHook `Transform Tool`, using the current reference toolbar as the first proof surface and defining what must change for the tool to become a general transform/session architecture that can target more than references.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Focused the change on transform-tool ownership, target generalization, and the boundary between viewer/runtime transforms and authored/source transforms.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a dedicated `Transform Tool` architecture surface.
- Defined the current `ReferenceTransformToolbar` as the first proof, not the final product.
- Recorded the need for generic target identity, target adapters, capability matrices, and per-target persistence policy.
- Clarified how sketch-plane placement can reuse transform-tool language while still remaining an authored/source target rather than a plain viewer/runtime target.

#### Files Changed
- `docs/Human-Plans/Architecture/Transform-Tool.md`
- `docs/Doc-Log.md`

#### Notes
- This doc complements the existing future task doc `[2.4F]` by providing the broader architecture direction above the phase/task layer.

<!-- ENTRY 029 -->
### [029] - 2026-03-18 20:51 - `DOC - Add Expanded SketchPlane Row Parameter-Stack Vision`
<!-- ENTRY 029 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the `SketchPlane` setup flow is now explicitly described as conceptual steps that should render as grouped editable rows inside the expanded input surface, not as a locked wizard, allowing the user to adjust reference, move, rotate, and flip in any order.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` UI-structure vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an explicit expanded-row UI structure for `SketchPlane`.
- Clarified that the setup “steps” are planning/mental-model steps, not enforced interaction order.
- Recorded that the expanded row should behave like a grouped parameter stack using `ParaSelect` and `ParaSlider` rows.
- Clarified that users should be free to set `Flip`, move, rotate, or reference values in any order.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This strengthens the distinction between conceptual setup flow and the actual node-row interaction model.

<!-- ENTRY 028 -->
### [028] - 2026-03-18 20:39 - `DOC - Reframe SketchPlane Pick-In-Viewport As One Hybrid Source Workflow`
<!-- ENTRY 028 -->
HUMAN SUMMARY: `Updated the sketch node architecture doc so `Pick In Viewport` is no longer described as two separate modes and is instead framed as one hybrid source workflow where the session opens on the origin planes by default but also accepts existing sketch geometry and model faces in the same placement flow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` source-pick framing.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Removed the stricter two-mode wording from the `Pick In Viewport` planning surface.
- Reframed viewport source picking as one hybrid workflow.
- Kept the origin/world-plane entry state, but clarified that the same session should also accept existing sketch geometry and model faces as valid source references.
- Clarified that the later sketch-origin gizmo / transform tool should remain the same regardless of how the initial source was chosen.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This replaces the earlier stronger two-mode framing with a simpler hybrid interaction model.

<!-- ENTRY 027 -->
### [027] - 2026-03-18 20:38 - `DOC - Add Default Origin-Mode And Three-Plane Viewport Entry To SketchPlane Pick Flow`
<!-- ENTRY 027 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so `Pick In Viewport` now explicitly starts in `Origin Mode`, places the sketch-origin gizmo at the world origin by default, and shows the three Fusion-style origin reference boxes/planes as the first viewport picking surface.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` viewport-pick interaction.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the rule that `Pick In Viewport` should load into `Origin Mode` by default.
- Added the rule that the sketch-origin gizmo should appear at the world origin on entry.
- Added the requirement that the user initially sees the three origin reference boxes/planes, similar to Fusion-style origin-plane picking.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This clarifies the initial entry state for viewport picking before the user switches into geometry-derived source behavior.

<!-- ENTRY 026 -->
### [026] - 2026-03-18 20:36 - `DOC - Clarify Two Pick-In-Viewport Input Modes For SketchPlane`
<!-- ENTRY 026 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so `Source > Pick In Viewport` now explicitly supports two input modes: an origin/world-plane mode starting from `0,0,0`, and a geometry-derived mode that starts from existing model references such as edges before entering the same sketch-plane placement workflow.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` viewport-pick planning surface.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added an explicit two-mode model for `Pick In Viewport`.
- Defined `Origin Mode` as starting from `0,0,0` plus one of the world/origin planes.
- Defined `Geometry Mode` as deriving the sketch-plane start from existing model geometry, with edges as the first likely useful reference.
- Clarified that both modes should converge back into the same sketch-plane placement workflow and transform tool.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This is planning structure only and does not yet add or rename any implementation phases.

<!-- ENTRY 025 -->
### [025] - 2026-03-18 20:32 - `DOC - Add 3.2B-N Sketch Subphase Map To Sketch Architecture Doc`
<!-- ENTRY 025 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc with a local `3.2B-N` subphase map that treats the current shipped `[3.2B]` work as `3.2B-0` and breaks the next sketch follow-ons into numbered cuts for source, viewport pick, geometry-driven setup, browser structure, and later sketch-content growth.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Added planning structure only; no runtime code, schema, or UI behavior changed.
- Focused the change on decomposing sketch work into future `3.2B-N` subphases inside the architecture doc.

#### Summary
- Added a `3.2B-N` sketch subphase map.
- Treated the currently shipped `[3.2B] Sketch Operation Authoring` work as `3.2B-0`.
- Added future subphases `3.2B-1` through `3.2B-6` for sketch-plane source/transform, viewport-first picking, geometry-driven setup, browser structure, browser depth, and later sketch-content/export ownership.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This numbering split currently lives in the architecture doc as the sketch-local decomposition direction and does not by itself rewrite the live roadmap file.

<!-- ENTRY 024 -->
### [024] - 2026-03-18 20:27 - `DOC - Add SketchPlane Flip Control To Architecture Vision`
<!-- ENTRY 024 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` transform surface now includes a simple `Flip` control, described as a `ParaSelect`-style direction toggle for quickly reversing sketch direction without requiring deeper manual rotation.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the `Sketch plane` transform/control vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added `Flip` to the long-term `SketchPlane` transform surface.
- Recorded that `Flip` should use `ParaSelect` as a simple discrete orientation control.
- Clarified that `Flip` is meant to quickly reverse sketch direction, not replace the richer transform controls.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This change extends the control-template rules already captured for `ParaSelect` and `ParaSlider` in the same sketch node architecture surface.

<!-- ENTRY 023 -->
### [023] - 2026-03-18 20:26 - `DOC - Add Free SketchPlane Placement And Geometry-Selection Highlighting Vision`
<!-- ENTRY 023 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` source workflow now explicitly includes free placement/orientation through the sketch-origin gizmo and geometry-driven auto-setup with required viewport edge/highlight feedback.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the long-term `Sketch plane` source and viewport-selection vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the requirement that the sketch-origin gizmo should allow the user to place the sketch plane wherever they want and rotate it however they want.
- Added the direction that model-geometry selection should eventually auto-set the sketch plane from qualifying references.
- Recorded the need for viewer-side edge highlighting, fill/tint feedback, and clear hover-versus-committed selection states during that workflow.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing `Pick In Viewport` and sketch-origin gizmo vision rather than replacing it.

<!-- ENTRY 022 -->
### [022] - 2026-03-18 20:24 - `DOC - Add Collapsed Pick-In-Viewport And Sketch Origin Gizmo Vision`
<!-- ENTRY 022 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `Pick In Viewport` flow now explicitly collapses the spaghetti editor into a compact bar, promotes a dedicated sketch-origin gizmo/transform tool in the viewport, and calls for extra spatial reference cues during sketch-plane placement.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the long-term viewport-pick interaction under the `Sketch plane` section.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the explicit interaction sequence for `Pick In Viewport`.
- Recorded that the spaghetti editor should collapse into a compact top bar while source-pick is active.
- Clarified that the viewport should show a dedicated sketch-origin gizmo / transform tool for placement.
- Added the need for additional spatial reference cues around that origin gizmo during placement.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing viewport-first `SketchPlane` source direction and makes the temporary collapsed editor presentation explicit.

<!-- ENTRY 021 -->
### [021] - 2026-03-18 20:22 - `DOC - Add SketchPlane Viewport Gizmo And Ghost Preview Requirement`
<!-- ENTRY 021 -->
HUMAN SUMMARY: `Expanded the sketch node architecture doc so the long-term `SketchPlane` source direction now explicitly calls for viewport gizmo support and ghost plane/grid rendering, making it clear that future source picking should become a real placement workflow rather than remain only a static picker.` 

#### Scope
- Updated the sketch node architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Limited the change to the long-term `Sketch plane` source-pick vision.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the requirement that the future sketch-plane picker should gain a viewport gizmo.
- Added the requirement for ghost plane boxes and ghost grid previews in the viewport.
- Clarified that the long-term source workflow should become a real placement workflow before sketch drawing begins.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This extends the existing viewport-first source-pick direction already captured in the same sketch node architecture doc.

<!-- ENTRY 020 -->
### [020] - 2026-03-18 20:20 - `DOC - Add SketchPlane Vision To Sketch Node Architecture Doc`
<!-- ENTRY 020 -->
HUMAN SUMMARY: `Expanded the sketch node architecture surface with a dedicated `Sketch plane` section that defines `SketchPlane` as the sketch's nested source/setup surface, locks the `Source + Transform` mental model, and records the intended row-mode, viewport-pick, and browser-boundary rules for future work.` 

#### Scope
- Updated the moved sketch architecture doc under `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/`.
- Focused the change on the new `## Sketch plane` section and local doc history.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added the `Sketch plane` vision directly into the sketch node architecture doc.
- Defined `SketchPlane` as a nested setup surface rather than the whole sketch object.
- Locked the user-facing split of `Source` plus `Transform`.
- Recorded the intended `collapsed / essentials / expanded` behavior, viewport-first source-pick direction, and the rule that `SketchPlane` remains nested under `Sketches`.

#### Files Changed
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- The user had already moved the original sketch architecture file into the Spaghetti editor architecture tree before this update.

<!-- ENTRY 019 -->
### [019] - 2026-03-18 20:14 - `DOC - Create Sketch Architecture Surface`
<!-- ENTRY 019 -->
HUMAN SUMMARY: `Created a new dedicated architecture doc for \`Sketch\` so the project has one stable place to define sketch source/setup, browser placement, viewport exposure, and future sketch-content ownership before Phase 190 implementation continues.` 

#### Scope
- Added one new architecture doc under `docs/Human-Plans/Architecture/`.
- Kept the change focused on the broader `Sketch` object direction rather than a single `SketchPlane` row tweak.
- Did not change runtime code, schema, or UI behavior.

#### Summary
- Added a new `Sketch` architecture surface.
- Locked the direction that `Sketch` is the wider authored content family while `SketchPlane` remains a nested setup/input surface.
- Recorded the intended browser structure `Content > References / Assembly / Sketches`.
- Recorded the expose/eyeball direction for sketch viewport preview without downstream consumption.
- Separated immediate source-workflow planning from later sketch-content and export work.

#### Files Changed
- `docs/Human-Plans/Architecture/Sketch.md`
- `docs/Doc-Log.md`

#### Notes
- This new architecture doc is intended to absorb and stabilize sketch direction that had previously been spread across the active Codex notes.

<!-- ENTRY 018 -->
### [018] - 2026-03-18 19:29 - `DOC - Split SketchPlane Browser Phase Into 6A And 6B`
<!-- ENTRY 018 -->
HUMAN SUMMARY: `Reworked note `190` so the old single browser-integration phase is now split into `6A` and `6B`, with `6A` captured as the implementation-ready browser-structure and sketch-exposure pass and `6B` left as the prepared deeper integration follow-on once source-pick state is stable.` 

#### Scope
- Limited this change to active planning/document-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making the browser phase of the sketch-plane plan implementation-safe.

#### Summary
- Replaced the single `190 Phase 6 - Browser Integration` block with:
  - `190 Phase 6A - Browser Structure And Sketch Exposure`
  - `190 Phase 6B - Deeper Browser Integration`
- Moved the browser-family and eyeball/exposure suggestions into `6A`.
- Kept source-pick relaunch, active session state, and richer sketch child-row behavior in `6B`.
- Clarified that `6A` is the recommended first browser pass and that `6B` remains a prepared follow-on.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 017 -->
### [017] - 2026-03-18 19:25 - `DOC - Add Sketch Exposure Eyeball Suggestion To Picker And Browser Plan`
<!-- ENTRY 017 -->
HUMAN SUMMARY: `Expanded the active sketch-plane/browser planning note with a new suggestion that sketches should gain an `eyeball`-style expose toggle, allowing an in-progress sketch to be surfaced into content/browser preview flows and shown in the model viewport even before it drives a downstream output node.` 

#### Scope
- Limited this change to active planning/product-behavior capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on sketch preview exposure during authoring.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the recommendation that sketches should support an explicit expose/visibility toggle for content/browser preview.
- Clarified that exposed sketches should be previewable in the viewport without requiring a downstream output-producing node and should align with the future `Content > Sketches` family.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 016 -->
### [016] - 2026-03-18 19:24 - `DOC - Add Content-Level Sketches Browser Structure Suggestion To Picker Plan`
<!-- ENTRY 016 -->
HUMAN SUMMARY: `Expanded the active sketch-plane picker plan with a browser-structure suggestion that `Sketches` should eventually become a first-class `Content` family alongside `References` and `Assembly`, while keeping `SketchPlane` and `Source` nested inside each sketch rather than lifting them to the top level.` 

#### Scope
- Limited this change to active planning/information-architecture capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on the browser placement suggestion for future sketch content.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the recommendation that browser structure should eventually read as `Content > References / Assembly / Sketches`.
- Clarified that `Sketches` would be the lifted family, while `SketchPlane` / `Source` remain child state within each sketch item.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 015 -->
### [015] - 2026-03-18 19:19 - `DOC - Add Browser Integration Phase To SketchPlane Picker Plan`
<!-- ENTRY 015 -->
HUMAN SUMMARY: `Expanded the active sketch-plane picker plan so `190` now includes a browser-integration phase, capturing the recommendation that sketch-plane/source state and source-pick re-entry should eventually be surfaced in the browser instead of living only inside the node row.` 

#### Scope
- Limited this change to active planning/product-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on browser integration for the future sketch-plane/source workflow.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added a new browser-integration phase to the sketch-plane picker roadmap.
- Captured the recommendation that the browser should expose sketch source state and provide a way to relaunch source-pick once the underlying picker/session model is stabilized.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 014 -->
### [014] - 2026-03-18 19:17 - `DOC - Reframe SketchPlane Picker Note Around Execution Phases`
<!-- ENTRY 014 -->
HUMAN SUMMARY: `Reworked the active sketch-plane picker note again so `190` is now organized around a few implementation phases instead of many small topic headers, making it easier to collapse by execution slice and use as a practical roadmap.` 

#### Scope
- Limited this change to active planning/document-structure cleanup under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making note `[190]` read like phased execution work.

#### Summary
- Added phase-based subsection headers to note `[190]`.
- Grouped the existing planning content into picker cleanup, viewport-first mode, live preview, face-pick decision, and source-summary follow-through phases.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 013 -->
### [013] - 2026-03-18 19:13 - `DOC - Break SketchPlane Source Picker Note Into Collapsible Subsections`
<!-- ENTRY 013 -->
HUMAN SUMMARY: `Reworked the active sketch-plane source-picker note into clearly headed sub-sections so the `190` planning entry can collapse cleanly in the editor and be scanned as smaller implementation slices instead of one long block.` 

#### Scope
- Limited this change to active planning/document-structure cleanup under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on making note `[190]` easier to navigate in the editor.

#### Summary
- Broke note `[190]` into labeled sub-sections covering current state, problem, goal, UX requirements, preview guidance, session-state guidance, naming, open product choice, and implementation order.
- Kept the underlying planning content intact while making it easier to collapse and reopen by topic.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 012 -->
### [012] - 2026-03-18 19:11 - `DOC - Expand SketchPlane Source Picker Note With Viewport-First UX Requirements`
<!-- ENTRY 012 -->
HUMAN SUMMARY: `Expanded the active sketch-plane source-picker note with two concrete UX requirements: entering source-pick should collapse/minimize the spaghetti editor enough to favor the model viewport, and the viewport should show live plane/face preview feedback similar to Fusion-style sketch-plane picking.` 

#### Scope
- Limited this change to active planning/UX-direction capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the update on viewport-first picker behavior for the future `SketchPlane` source flow.

#### Summary
- Updated note `[190]` in the active Codex notes file.
- Added the requirement that source-pick mode should shift the user into a viewport-first temporary state by collapsing/minimizing the spaghetti editor.
- Added the requirement that the viewport should show live origin-plane and/or face preview feedback during source picking.
- Updated the recommended implementation order to include editor-collapse behavior and preview work before richer source-summary follow-ons.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 011 -->
### [011] - 2026-03-18 19:09 - `DOC - Add SketchPlane Source Picker Upgrade Note`
<!-- ENTRY 011 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry for the next `SketchPlane` follow-on pass, focused on upgrading the current `Pick In Viewport` action and floating sketch-plane picker so they match the newer `Source` model instead of the older temporary plane-picker wording and framing.` 

#### Scope
- Limited this change to active planning/UI-flow capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the future `SketchPlane` source-picker and viewport-pick flow.

#### Summary
- Added a new `[190]` note to the active Codex notes file.
- Captured the mismatch between the new `SketchPlane > Source` structure and the older temporary viewport plane-picker wording.
- Recorded the recommended next-pass goals, naming cleanup, and implementation order for the picker upgrade.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 010 -->
### [010] - 2026-03-18 19:00 - `DOC - Add Implementation-Ready SketchPlane V1 Consolidation Note`
<!-- ENTRY 010 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that consolidates the recent `SketchPlane` planning into one implementation-ready v1 plan, including the locked `Source` and `Transform` control groups, row-mode behavior, shared `ParaSelect` and `ParaSlider` control choices, and the explicit deferred-scope boundaries.` 

#### Scope
- Limited this change to active planning/implementation-prep capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on turning the recent `SketchPlane` planning thread into one implementation-ready reference entry.

#### Summary
- Added a new `[189]` note to the active Codex notes file.
- Consolidated the current `SketchPlane` v1 structure, hierarchy, control-template rules, and row-mode behavior.
- Added explicit sections for deferred scope, invariants that must remain true during implementation, and the recommended implementation order.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 009 -->
### [009] - 2026-03-18 18:58 - `DOC - Add SketchPlane ParaSlider Control-Template Note`
<!-- ENTRY 009 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry locking the control-template direction that future authored `SketchPlane` controls should reuse the shared `ParaSlider` language already established in the spaghetti `i` menu and related surfaces, instead of introducing one-off numeric controls.` 

#### Scope
- Limited this change to active planning/UI-control-language capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the shared control-template decision for future `SketchPlane` authoring rows.

#### Summary
- Added a new `[188]` note to the active Codex notes file.
- Recorded that future authored numeric controls under `SketchPlane` should default to the repo's shared `ParaSlider` template.
- Clarified that this applies to editable nested controls in `essentials` / `expanded`, not necessarily the compact collapsed top-row summary.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 008 -->
### [008] - 2026-03-18 18:56 - `DOC - Add SketchPlane V1 Source And Transform Plan Note`
<!-- ENTRY 008 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that defines the recommended `SketchPlane` v1 structure as just two user-facing control groups, `Source` and `Transform`, and explicitly records what that first version should still leave out for later phases.` 

#### Scope
- Limited this change to active planning/product-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the `SketchPlane` v1 product shape and deferred-scope boundaries.

#### Summary
- Added a new `[187]` note to the active Codex notes file.
- Captured the recommended v1 `SketchPlane` split of `Source` plus `Transform`.
- Added a dedicated section describing what v1 should intentionally leave out and what follow-on work still needs to be added later.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 007 -->
### [007] - 2026-03-18 18:48 - `DOC - Add Replicad SketchPlane Orientation Model Note`
<!-- ENTRY 007 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry capturing the verified `replicad` plane/orientation model, the gap between that model and the repo's current `SketchPlane` enum, and the resulting recommendation that future sketch-plane work should move toward a richer composite authored object.` 

#### Scope
- Limited this change to active planning/reference capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on verified `replicad` plane/orientation capabilities and their implications for the future `SketchPlane` structure.

#### Summary
- Added a new `[186]` note to the active Codex notes file.
- Recorded that the repo currently only supports `XY | YZ | XZ` for `SketchPlane`.
- Captured that `replicad` supports richer named planes plus real `Plane` objects with origin and axis orientation data.
- Recorded the resulting structure recommendation that future `SketchPlane` work should likely evolve toward a richer composite object instead of staying a thin primitive plane enum forever.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 006 -->
### [006] - 2026-03-18 18:42 - `DOC - Add SketchPlane Composite-Type Structure Note`
<!-- ENTRY 006 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry capturing the likely schema direction that \`SketchPlane\` should remain the parameter name while its underlying value evolves into a richer composite type that can hold plane, transform, and offset together.` 

#### Scope
- Limited this change to active planning/schema-structure capture under `docs/`.
- Did not change runtime code, schema, or UI behavior.
- Focused the note on the future `SketchPlane` parameter/type relationship.

#### Summary
- Added a new `[185]` note to the active Codex notes file.
- Recorded the recommendation to keep `SketchPlane` as the port/parameter name.
- Captured the likely direction of introducing a richer composite type such as `sketchPlane` instead of overloading primitive `plane`.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 005 -->
### [005] - 2026-03-18 18:37 - `DOC - Add SketchPlane Parent Row And Nested Transform Row Note`
<!-- ENTRY 005 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry locking the structure decision that \`SketchPlane\` remains the parent managed input row while \`Transform\` becomes a nested child row inside it, with parent row mode controlling body visibility and child row mode controlling transform-surface depth.` 

#### Scope
- Limited this change to active planning/interaction-architecture capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input-row hierarchy.

#### Summary
- Added a new `[184]` note to the active Codex notes file.
- Captured the parent/child hierarchy for `SketchPlane` and its future nested `Transform` row.
- Locked the distinction between parent row mode and child transform-row mode for future implementation work.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 004 -->
### [004] - 2026-03-18 18:31 - `DOC - Add SketchPlane Transform-Surface Row-Mode Note`
<!-- ENTRY 004 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry describing the future vision for embedding full transform controls inside the managed \`SketchPlane\` input row and defining how that transform surface should be divided across \`collapsed\`, \`essentials\`, and \`expanded\` row modes.` 

#### Scope
- Limited this change to active planning/UX-architecture capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input row and its future transform-surface design.

#### Summary
- Added a new `[183]` note to the active Codex notes file.
- Captured the transform-surface vision for the managed `SketchPlane` input row.
- Recorded recommended grouping, row-mode division, and the sequencing rule that the data model should be settled before the full UI is implemented.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 003 -->
### [003] - 2026-03-18 18:31 - `DOC - Add SketchPlane Input Row Vision And Terminology Note`
<!-- ENTRY 003 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry that locks the correct term for the current \`SketchPlane\` surface and records the intended product direction for upgrading it from a generic port-details row into a dedicated sketch-plane control surface.` 

#### Scope
- Limited this change to active planning/terminology capture under `docs/`.
- Did not change runtime code or UI behavior.
- Focused the note on the managed `SketchPlane` input row only.

#### Summary
- Added a new `[182]` note to the active Codex notes file.
- Locked the preferred term as `managed SketchPlane input row`.
- Captured the current-code truth, why `input node` is the wrong term, and the desired future UX direction for the row.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 002 -->
### [002] - 2026-03-18 18:03 - `DOC - Add Sketch Output Cleanup Research Note To Active Codex Notes`
<!-- ENTRY 002 -->
HUMAN SUMMARY: `Added a new active Codex-notes entry documenting the current sketch-output-row architecture, why it still feels older than the cleaned-up input row, and what concrete code targets remain to migrate the output rows onto the same shared port-row style.` 

#### Scope
- Limited this change to active planning/research notes under `docs/`.
- Did not change any runtime code or UI behavior.
- Kept the note focused on the current `Geometry/Sketch` output-row cleanup path.

#### Summary
- Added a new `[181]` note to the active Codex notes file.
- Captured the current output-row render path and the specific wrapper still causing the older output-row behavior.
- Recorded the recommended migration direction, open UX questions, concrete file targets, and acceptance goals for the future cleanup.

#### Files Changed
- `docs/Human-Plans/CodexNotes/12_CodexChatNotes.md`
- `docs/Doc-Log.md`

#### Notes
- This is documentation/planning capture only; no implementation work was performed in this change.

<!-- ENTRY 001 -->
### [001] - 2026-03-18 16:09 - `DOC - Create Doc-Log And Split Document Tracking From CHANGELOG`
<!-- ENTRY 001 -->
HUMAN SUMMARY: `Created the new permanent document-history file at \`docs/Doc-Log.md\` and updated \`AGENTS.md\` so document changes now route here while shipped code and runtime work continue to use \`docs/CHANGELOG.md\`.` 

#### Scope
- Limited this change to repository documentation workflow rules.
- Did not rewrite existing `docs/CHANGELOG.md` history.
- Kept `docs/Chill-Log.md` reserved for chill-mode logging.

#### Summary
- Added `docs/Doc-Log.md` as the canonical permanent log for documentation changes.
- Updated `AGENTS.md` so code/system work continues to use `docs/CHANGELOG.md`.
- Updated `AGENTS.md` so document changes use `docs/Doc-Log.md`.
- Fixed the stale Codex-notes path in `AGENTS.md` so it points at the current `docs/Human-Plans/CodexNotes/` location.

#### Files Changed
- `AGENTS.md`
- `docs/Doc-Log.md`

#### Notes
- This file starts at entry `[001]`.
- Earlier documentation history remains in existing docs and local `Doc History` sections.
