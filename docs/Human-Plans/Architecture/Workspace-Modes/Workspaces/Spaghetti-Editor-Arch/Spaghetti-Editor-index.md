# Spaghetti-Editor Index

## Doc Header

### Doc History
94. 2026-05-25 14:39:45: Marked `Spaghetti-Editor 11 / Phase 1 - Canvas Viewport Persistence Build Isolation` shipped after graph-canvas viewport persistence moved to document-only revision scope with focused worker-build isolation proof.
93. 2026-05-25 14:34:33: Added `Spaghetti-Editor 11 - Canvas Viewport Persistence Build Isolation` as the planned fix lane for `Bug 25`, separating graph-canvas pan/zoom persistence from geometry revision and worker build invalidation.
92. 2026-05-25 14:27:43: Added and closed `Spaghetti-Editor 10 / Phase 4 - Crossing Background Drag Start` after user testing showed blue Window selection worked but green Crossing selection could fail when the right-to-left drag began on visible background outside the transformed stage.
91. 2026-05-25 14:22:43: Added and closed `Spaghetti-Editor 10 / Phase 3 - Canvas Multi-Selection Fit` after research showed middle-mouse double-click was still framing only the primary selected graph node instead of the full Window/Crossing-selected canvas set.
90. 2026-05-25 14:08:22: Added and closed `Spaghetti-Editor 10 / Phase 2 - Spaghetti Canvas Window/Crossing Selection Restore` after user testing clarified that model-viewport window selection worked but the Spaghetti graph canvas still lacked an empty-space window-selection drag owner.
89. 2026-05-25 13:59:07: Added and closed `Spaghetti-Editor 10 / Phase 1 - Viewer Window/Crossing Direction Repair` after the shared viewer window-selection helper was found reversed from the shipped left-to-right `Window`, right-to-left `Crossing` contract.
88. 2026-05-20 14:04:09: Added the `Spaghetti-Editor 9 / Phase 1` stable Extrude part-identity follow-up after console logs showed the first Extrude could be built as `extrude` and later addressed as `extrude#1`; compiled Extrude parts now start numbered at `extrude#1` so repeat Extrude does not rename Object 1 out from under retained display or build-entry matching.
87. 2026-05-20 13:14:39: Added the `Spaghetti-Editor 9 / Phase 1` new-branch active preview layering follow-up after repeat-Extrude testing showed accepted sibling Extrudes disappeared when typing depth for a third Extrude; new branch overlays now keep accepted siblings as retained base when there is no matching baseline key.
86. 2026-05-20 10:28:46: Added the `Spaghetti-Editor 9 / Phase 1` auto final build loop guard after console proof showed the worker completed the second Extrude final build and auto mode immediately re-requested it; current accepted authoritative-target bundles now stop same-revision auto follow-through loops even when export-grade authoritative geometry is unavailable.
85. 2026-05-20 10:16:26: Replaced the `Spaghetti-Editor 9 / Phase 1` undo/redo follow-up after user testing showed the command interaction wrapper tinted retained geometry blue and still did not settle repeat Extrude; accepted Extrude commands now create edit-history graph snapshots from before the live node/auto-wire existed so Undo can remove the committed Extrude.
84. 2026-05-20 09:52:26: Tightened the shipped `Spaghetti-Editor 9 / Phase 1` fix after undo/redo testing showed the repeat-Extrude graph data and final result could load correctly when history replay flushed state; `ViewerHost` now owns the active Extrude command browser-build interaction so `OK`/`Cancel` releases and promotes staged final results without needing undo/redo.
83. 2026-05-20 09:15:28: Tightened the shipped `Spaghetti-Editor 9 / Phase 1` fix after screenshot proof showed the post-`OK` repeat-Extrude state still hiding Object 1, adding retained committed final rendering from raw accepted `OutputPreview` artifact VMs when the graph revision has advanced and the committed geometry result has no standalone mesh preview.
82. 2026-05-20 09:04:52: Marked `Spaghetti-Editor 9 / Phase 1 - Retain Existing Output Entries During Repeat Extrude` shipped after the A/D/F viewport result selector gained retained output-overlap matching for additive repeat-Extrude output slots, keeping the first accepted Extrude visible while a second output slot is pending without changing worker supersession.
81. 2026-05-20 08:19:45: Prepped `Spaghetti-Editor 9 / Phase 1 - Retain Existing Output Entries During Repeat Extrude` for implementation, narrowing the first code cut to selector-first retained output-entry overlap proof, explicit member-publication safety, stale-result gate preservation, and optional store-level repeat-Extrude coverage only if the selector proof cannot cover the slot-widening path.
80. 2026-05-20 08:00:24: Added `Spaghetti-Editor 9 - Repeat Extrude Retained Output While Building` as the next workspace-level plan after the repeat-Extrude unload investigation, routing the first fix toward retained output-entry continuity while a second Extrude build is pending before any broader worker diagnostics.
79. 2026-05-20 00:09: Marked `Spaghetti-Editor 8 / Phase 3.7 - Profile-First Extrude Numeric Depth Handoff` shipped after active Extrude depth sessions began consuming finite Console numeric input for preview updates and `Enter` began committing through the existing live command accept path.
78. 2026-05-20 00:02:57: Refined `Spaghetti-Editor 8 / Phase 3.7 - Profile-First Extrude Numeric Depth Handoff` so the target flow is now explicitly `Shift+E`, closed-profile click, numeric depth preview update, then `Enter` commit through the existing Extrude accept path.
77. 2026-05-19 23:55:43: Added `Spaghetti-Editor 8 / Phase 3.7 - Profile-First Extrude Numeric Depth Handoff` to the viewport-first Extrude ladder so the next implementation slice can make preselected-profile `Extrude` starts immediately own numeric depth input instead of asking for another profile or falling through to root Console parsing.
76. 2026-05-19 22:50:18: Recorded the Phase 3.6 repeat-Extrude cleanup after profile-driven command starts stopped implicitly reusing a selected prior Extrude node, making a second Extrude on the same selected profile create a new `Geometry/Extrude` operation while preserving explicit reused-node editing as a separate opt-in path.
75. 2026-05-19 22:34:25: Recorded the Phase 3.6 output-preview follow-up after accepted live Extrude command nodes began auto-wiring `SolidBody` into the first open `System/OutputPreview` solid slot when not already published, completing the viewport-command `SketchProfile -> Geometry/Extrude -> OutputPreview` graph chain without creating a second Extrude node.
74. 2026-05-19 22:21:30: Marked `Spaghetti-Editor 8 / Phase 3.6 - Extrude Commit Cancel Proof And Phase 3 Closeout` shipped after toolbar `OK` began accepting the existing live Extrude command node with durable params and committed summaries, while Cancel preserved live graph rollback and no second Extrude node was introduced.
73. 2026-05-19 22:14:36: Marked `Spaghetti-Editor 8 / Phase 3.6 - Extrude Commit Cancel Proof And Phase 3 Closeout` implementation-ready after grounding the next slice in the live Extrude command graph, narrowing `OK` to accepting/finalizing the existing live node and wires with durable params and committed summaries instead of creating a second Extrude node.
72. 2026-05-19 22:02:52: Marked `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` shipped after the active Extrude command began deriving transient selected-profile/depth preview data through `ViewerHost`, sending it over a narrow viewer bridge VM, and rendering first-pass translucent preview caps and side walls without mutating graph truth or accepting the command.
71. 2026-05-19 21:26:05: Refreshed the `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` implementation-ready read after the profile-selection follow-ups, so the next slice now explicitly starts from toggle multi-profile selection, blue selected-profile state, white hover priority, and visible singular profile wires before adding transient depth preview presentation.
70. 2026-05-19 20:53:26: Marked `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` implementation-ready after grounding the next slice in the live Extrude session depth/profile state, 3.5B selected-profile overlay projection, `ViewerHost` preview derivation point, `viewerBridge`/`Viewer` overlay seams, and the no-acceptance rule that preview presentation must not write graph params, accepted output, Build Path rows, or command summaries.
69. 2026-05-19 20:41:28: Marked `Spaghetti-Editor 8 / Phase 3.5B - Viewport Profile Hover And Preselection` shipped after graph-authored closed sketch profiles gained first-pass filled selectable regions, white hover highlight, transient viewport preselection outside Extrude, same-sketch Shift-click expansion, selected/hovered overlay projection, and root Extrude startup seeding through the existing live node/wire session path.
68. 2026-05-19 20:27:26: Marked `Spaghetti-Editor 8 / Phase 3.5B - Viewport Profile Hover And Preselection` implementation-ready after the Phase 3.5A live graph contract shipped, narrowing the next slice to selectable-profile fill, white hover highlight, transient profile preselection outside Extrude, startup seeding through `startExtrudeCommandSession(...)`, and active Extrude click parity without adding depth preview, OK acceptance, Build Path, or Settings UI scope.
67. 2026-05-19 20:17: Marked `Spaghetti-Editor 8 / Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract` shipped after the shared Extrude command session began creating/reusing live graph nodes on command start, Console and viewport profile selections began auto-wiring exact `SketchProfile:<profileId>` rows into the live node, and Cancel gained rollback behavior for command-created nodes/wires and reused-node profile input replacement.
66. 2026-05-19 20:03:02: Marked `Spaghetti-Editor 8 / Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract` implementation-prepped after grounding the first cut in the live store/session actions, graph mutation seams, Console root/profile-token routing, `ViewerHost` profile-pick routing, sketch-profile connection normalization helpers, and a concrete rollback model for created versus reused Extrude nodes.
65. 2026-05-19 19:51:27: Reworked the remaining `Spaghetti-Editor 8 / Phase 3` Extrude ladder around live graph auto-wiring, adding `Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract`, shifting profile hover/preselection to `Phase 3.5B`, shifting depth preview volume to `Phase 3.5C`, and clarifying that `Extrude` start should create/reuse the graph node while profile clicks auto-wire exact sketch profile member rows before `OK` acceptance.
64. 2026-05-19 19:47:21: Marked `Spaghetti-Editor 8 / Phase 3.5A - Viewport Profile Hover And Preselection` implementation-prepped after grounding the next cut in the shipped profile pick callback, graph-authored sketch overlay profile ids, `ViewerHost` active/visible sketch projection, transient Extrude session source updater, and a narrow no-mutation viewport profile preselection owner before Phase 3.5B preview volume and Phase 3.6 commit work.
63. 2026-05-19 19:42:24: Added `Spaghetti-Editor 8 / Phase 3.5B - Extrude Depth Preview Volume And Value Feedback` from the selected-profile extrusion preview reference, keeping the target as transient selected-profile cap, translucent depth preview volume, and viewport direction/value feedback before Phase 3.6 owns durable `OK` commit.
62. 2026-05-19 19:38:33: Added `Spaghetti-Editor 8 / Phase 3.5A - Viewport Profile Hover And Preselection` to the Phase 3 continuation so closed graph-authored sketch profiles become visibly selectable outside active Extrude sessions, with first-pass filled selectable regions, white hover highlight, transient profile preselection, and Extrude startup consuming any valid preselected profiles before Phase 3.6 commit work.
61. 2026-05-19 19:14:48: Marked `Spaghetti-Editor 8 / Phase 3.5 - Profile Picking Count And Preview State` shipped after viewport graph-authored sketch profile clicks gained a dedicated viewer bridge callback, active Extrude sessions gained no-mutation selected-profile updates, Shift-click selects every profile from the picked sketch only, and the model-viewport toolbar count/depth state now reflects the picked profiles while `OK` commit remains Phase 3.6 scope.
60. 2026-05-19 19:06:52: Marked `Spaghetti-Editor 8 / Phase 3.5 - Profile Picking Count And Preview State` implementation-prepped after grounding the next slice in `ViewerHost` sketch profile overlays, `viewerBridge` callback ownership, the existing transient Extrude session source updater, and `buildSketchProfileMemberPortId(...)`, with the implementation narrowed to viewport graph-authored profile picks, shift-click same-sketch expansion, toolbar count/depth updates, and no graph mutation.
59. 2026-05-19 19:01:25: Marked `Spaghetti-Editor 8 / Phase 3.4 - Model Viewport Extrude Toolbar Shell` shipped after `ViewerHost` gained the shared-session-backed Extrude toolbar, selected count/depth/operation/status display, Cancel transient-session clearing, and focused render/cancel no-graph-mutation proof while keeping profile picking, preview, drag handles, and OK commit deferred to later Phase 3 slices.
58. 2026-05-19 18:54:59: Marked `Spaghetti-Editor 8 / Phase 3.4 - Model Viewport Extrude Toolbar Shell` implementation-prepped after grounding the next slice in the shipped transient Extrude session owner, `ViewerHost` overlay seam, Console active-session projection, and focused toolbar render/cancel/no-graph-mutation proof while leaving profile picking, preview, drag handles, and commit behavior to later phases.
57. 2026-05-19 12:36:07: Marked `Spaghetti-Editor 8 / Phase 3.3 - Viewport Shortcut Modal Guarding` shipped after viewport command shortcuts became idle-only through shared routing, active Extrude and other modal command/session owners now block viewport `S`, and the existing idle viewport `S` Sketch shortcut remained covered by regression tests.
56. 2026-05-19 12:28:13: Marked `Spaghetti-Editor 8 / Phase 3.3 - Viewport Shortcut Modal Guarding` implementation-prepped after grounding the next slice in `routeKeyboardInput(...)`, `routeConsoleGlobalKey(...)`, and the docked/popout viewport `S` handlers, with the first implementation limited to keeping viewport command shortcuts idle-only while sketch plane, sketch draw/review, staged Console, reference transform, and active Extrude sessions own input.
55. 2026-05-19 11:00:21: Marked `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` shipped after Console profile prompt routing landed for active Extrude sessions, including pure sketch-profile Console choices, text token resolution into transient profile sources, no-root-command fallthrough while selecting profiles, and no graph mutation before later commit work.
54. 2026-05-19 10:43:01: Added the no-duplicate-Extrude-command guardrail to the `Spaghetti-Editor 8 / Phase 3.2A` handoff, recording that root `Extrude` is a shortcut into the canonical `Graph > Extrude` workflow and must share the same `extrudeCommandSession` plus later atomic graph-authoring commit path.
53. 2026-05-19 10:40:25: Marked `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` implementation-prepped after grounding the slice in the shipped `extrudeCommandSession`, current Console submit routing, `setExtrudeCommandSelectedProfileSources(...)`, and the existing sketch profile member port contract while keeping graph commit, viewport picking, toolbar, preview, and Build Path work out of scope.
52. 2026-05-19 10:37:45: Added `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` between the shipped session owner and viewport shortcut guard so the active root `Extrude` session can make Console ask for sketch-profile input before toolbar, viewport picking, preview, or commit phases continue.
51. 2026-05-19 10:15:09: Marked `Spaghetti-Editor 8 / Phase 3.2 - Real Extrude Session Owner And Command Tree` shipped after the shared Extrude command-session helper and Spaghetti store slice landed, root Console `Extrude` began creating `Extrude > Select Profiles > Depth` session state, Escape cancellation cleared the session, and focused tests plus production build verified no graph mutation on start or cancel.
50. 2026-05-19 10:05:12: Marked `Spaghetti-Editor 8 / Phase 3.2 - Real Extrude Session Owner And Command Tree` implementation-prepped after narrowing the next slice to a shared transient Extrude command-session owner, Console-visible `Extrude > Select Profiles > Depth` command-tree projection, start/cancel/step-transition proof, and explicit toolbar-as-viewer boundary with profile picking, drag handle, preview, graph commit, and Build Path work deferred.
49. 2026-05-19 09:41:36: Marked `Spaghetti-Editor 8 / Phase 3.1 - Atomic Extrude Graph Commit Repair` shipped after `authorExtrudeGraphCommand` moved to a preflighted `ExtrudeGraphCommandPlan` plus one atomic `commitExtrudeGraphPlan(...)` boundary, preserving Build Path-ready committed summaries while preventing helper-owned partial node or profile-wire mutation from being reported as cancellation.
48. 2026-05-19 09:27:48: Refined the `Spaghetti-Editor 8 / Phase 3` Extrude continuation from the reference screenshot so the remaining open work now explicitly targets the staged `Extrude > Select Profiles > Depth` command tree, shift-click all-profiles selection inside one sketch, and depth drag-handle/value behavior, with `Phase 3.2` widened to include the Console/session staging needed before toolbar and picking work builds on it.
47. 2026-05-19 09:22:10: Marked `Spaghetti-Editor 8 / Phase 3.1 - Atomic Extrude Graph Commit Repair` implementation-prepped after grounding the next slice in the live `authorExtrudeGraphCommand` partial-mutation risk, with the repair narrowed to pre-mutation failure proof, atomic plan/commit behavior, and preserved committed-summary output before viewport toolbar work continues.
46. 2026-05-19 09:12:52: Split the open `Spaghetti-Editor 8 / Phase 3` Extrude continuation into explicit `Phase 3.1` through `Phase 3.6` follow-up sections for atomic commit repair, real session ownership, modal shortcut guards, toolbar shell, profile picking/preview state, and commit/cancel closeout before broader Build Path or arrangement follow-ons.
45. 2026-05-19 08:47:12: Marked `Spaghetti-Editor 8 / Phase 5 - Background Node Layout And Arrangement Modes` shipped after the pure command-created node placement planner landed with downstream, bridge, stacked-repeat, fallback, existing-position preservation, and edge-inferred anchor tests while leaving call-site integration and arrangement UI as follow-ons.
44. 2026-05-19 08:44:05: Marked `Spaghetti-Editor 8 / Phase 5 - Background Node Layout And Arrangement Modes` prepped as a pure command-created node placement planner over existing graph positions, with downstream, bridge, repeated-node, and fallback placement rules while preserving existing positioned nodes and leaving full arrangement UI for later.
43. 2026-05-19 08:41:03: Marked `Spaghetti-Editor 8 / Phase 4 - Build Path Projection Handoff` shipped after the pure Build Path projection helper and tests landed for committed Sketch/Extrude graph-command summaries, cancelled-command skips, explicit graph document ids, graph-id preservation, and optional build-result linkage without Build Path UI or worker checkpoint/replay scope.
42. 2026-05-19 08:35:53: Marked `Spaghetti-Editor 8 / Phase 4 - Build Path Projection Handoff` prepped as a Spaghetti-side projection contract over accepted graph-command summaries, leaving Build Path UI, worker checkpoint/replay, restore, branch, and scrub behavior to later Build Path and Worker phases.
41. 2026-05-19 08:23:25: Prepped `Spaghetti-Editor 8 / Phase 3 - Root Extrude And Viewport Profile Selection Toolbar` for implementation around root `Extrude`, transient viewport Extrude session state, sketch-profile selection/counting, graph-authored commit/cancel, and reuse of the shipped Extrude `SketchProfiles` collection/multi-wire contract.
40. 2026-05-19 08:20:56: Marked `Spaghetti-Editor 8 / Phase 2 - Shared Command To Graph Authoring Seam` shipped after the shared Sketch graph-authoring owner landed with selected/first/fresh sketch creation tests and the console hook became a thin caller for graph mutation.
39. 2026-05-19 08:14:37: Prepped `Spaghetti-Editor 8 / Phase 2 - Shared Command To Graph Authoring Seam` for implementation as the extraction of existing Sketch graph-authoring decisions into a shared owner that console, viewport shortcut, and later toolbar/session callers can use.
38. 2026-05-19 08:09:08: Marked `Spaghetti-Editor 8 / Phase 1 - Viewport Command Commit Contract` shipped after the shared command commit contract landed with lifecycle-state tests and root Sketch/New Sketch/viewport shortcut integration.
37. 2026-05-19 08:04:06: Prepped `Spaghetti-Editor 8 / Phase 1 - Viewport Command Commit Contract` for implementation as a narrow command lifecycle guardrail, defining preview/session/commit/cancel boundaries, likely ownership surfaces, non-goals, verification targets, and the handoff that Phase 3 root Extrude should use.
36. 2026-05-19 08:00:03: Clarified the `Spaghetti-Editor 8` phase relevance read after the first root Sketch/New Sketch proof, keeping all five phases while marking Phase 1 as a guardrail, Phase 2 as the active shared command-authoring spine, Phase 3 as the next root Extrude/profile-toolbar target, and Phase 4/5 as deferred Build Path and layout follow-ons.
35. 2026-05-19 01:19:25: Added `Spaghetti-Editor 8 / Phase 3 - Root Extrude And Viewport Profile Selection Toolbar` to the viewport command-authoring ladder, placing Fusion-style Extrude profile picking and toolbar workflow before Build Path projection and background node layout follow-ons.
34. 2026-05-19 00:42:25: Expanded `Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge` with a background node layout and arrangement phase, making neat automatic placement plus later dependency, command-flow, compact-chain, grouped-output, and manual arrangement reads part of the viewport-command bridge instead of leaving command-created nodes to pile up.
33. 2026-05-19 00:36:42: Added `Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge` as the next workspace-level planning surface for Fusion/Blender-style viewport command operation that still authors normal Spaghetti nodes and wires in the background, while defining how those accepted graph commits can later feed Build Path as a history projection instead of a second model.
32. 2026-05-19 00:34:37: Marked `Spaghetti-Editor 7 / Phase 4 - Narrow Pane Visual Proof And Closeout` shipped after the final proof-only pass reran split-host fit, one-button `e / +`, essentials-body, panel/canvas, AppShell handoff, and production build checks; no runtime files needed changes, DOM-level proof covered the original narrow-pane requirements, and no immediate `Spaghetti-Editor 7` follow-on was required.
31. 2026-05-19 00:29:23: Prepped `Spaghetti-Editor 7 / Phase 4 - Narrow Pane Visual Proof And Closeout` after the Phase 3 essentials-body follow-up, locking the final slice to focused regression reruns for split-host fit, one-button `e / +`, essentials body propagation, split-host console handoff, production build verification, and a narrow split-pane visual/manual check without adding new density, graph, node, overlay, or workspace-shell behavior.
30. 2026-05-19 00:20:11: Added the `Spaghetti-Editor 7 / Phase 3` follow-up fix after the split-pane button changed to `e` without making the slotted editor body render essentials mode; `ViewportSurfaceRegistry` now forwards editor viewport presentation flags into `SpaghettiPanel` so split-hosted essentials mode hides expanded panel chrome and canvas-toolbar content.
29. 2026-05-19 00:14:12: Marked `Spaghetti-Editor 7 / Phase 3 - Split Pane Local Minus Rule` shipped after split-pane Spaghetti `e / +` density behavior moved onto the shared primary `ViewportFrame` button, removing the adjacent duplicate density supplement while preserving right-click viewport-type access and floating/windowed Spaghetti `- / e / + / O` behavior.
28. 2026-05-19 00:08:47: Corrected the `Spaghetti-Editor 7 / Phase 3` handoff after the live split-pane screenshot showed the shared `ViewportFrameModeButton` `-` sitting beside the Spaghetti `+` density button; the next slice now explicitly folds Spaghetti split-pane `e / +` density onto the shared primary header button, removes the duplicate density supplement, preserves right-click viewport-type access, and leaves floating/windowed `- / e / + / O` behavior unchanged.
27. 2026-05-19 00:05:51: Prepped `Spaghetti-Editor 7 / Phase 3 - Split Pane Local Minus Rule` against the shipped Phase 2 split-pane header lane and the live floating Spaghetti titlebar cycle, locking the next slice to prove split-hosted panes intentionally expose no Spaghetti-local `-`, keep only the pane-local `e / +` density control, preserve shared `ViewportFrame` close/remove ownership, and leave floating `- / e / + / O` behavior unchanged.
26. 2026-05-19 00:01:35: Marked `Spaghetti-Editor 7 / Phase 2 - Split Pane e And + Mode Behavior` shipped after split-hosted Spaghetti panes gained a shared `ViewportFrame` header density control that cycles `+` to compact essentials and `e` back to full editor mode through existing editor viewport presentation state while preserving slotted placement, overlay separation, and the deferred local `-` policy.
25. 2026-05-18 23:56:25: Prepped `Spaghetti-Editor 7 / Phase 2 - Split Pane e And + Mode Behavior` against the live `WorkspaceViewportTree` header supplement seam, split-host Spaghetti registry path, presentation store, and console activation tests, locking the next slice to pane-local `e / +` controls in the shared `ViewportFrame` header without mounting the floating Spaghetti titlebar, changing overlay `O`, or deciding the local `-` policy.
24. 2026-05-18 23:46:59: Marked `Spaghetti-Editor 7 / Phase 1 - Split Pane Chrome Fit` shipped after the split Spaghetti surface gained narrow-pane fit targeting, graph/focus picker truncation discipline, compact accessible canvas-toolbar labels, disabled toolbar readability, and focused panel/canvas/registry proof without changing split-pane `e / +` behavior or the local `-` rule.
23. 2026-05-18 15:41:11: Prepped `Spaghetti-Editor 7 / Phase 1 - Split Pane Chrome Fit` in the standalone future doc, grounding the first implementation cut in the split Spaghetti slot wrapper, floating-handle titlebar lanes, graph-document picker CSS, and canvas-toolbar long-label controls while keeping `e / +`, local `-`, node row-density, and shared workspace close behavior out of Phase 1.
22. 2026-05-18 15:31:57: Added `Spaghetti-Editor 7 - Split Pane Density And Local Mode Controls` as the next split-hosted Spaghetti Editor cleanup plan, covering crowded titlebar and graph-selector fit, narrow canvas-toolbar readability, useful split-pane `e / +` behavior, and an explicit local `-` rule that does not duplicate shared workspace pane close ownership.
21. 2026-05-17 14:57:56: Added `Spaghetti-Editor 6 - Draft Mesh And Authoritative B-Rep Auto Pipeline` as the clean workspace-level plan for fast live draft meshes, separate authoritative B-rep generation, Auto draft-to-final swapping, and authoritative-only export truth for Spaghetti-authored geometry.
20. 2026-05-02 09:39:04: Added `Spaghetti-Editor 5 - Meatball Dock Persistence Across Split Layouts` as the next open Spaghetti-editor follow-on after Bug 23 research showed the docked meatball editor is likely being reclassified out of `meatball editor view` during split-right handling, giving the family a dedicated future phase home for dock ownership and regression proof.
19. 2026-05-02 08:06:26: Marked `Spaghetti-Editor 3 / Phase 4 - Essentials Canvas Background Transparency Cleanup` shipped in the umbrella read, confirming that `e` mode now has its own Spaghetti editor titlebar `BG` slider and essentials-only canvas readability tuning without reopening overlay ownership.
18. 2026-05-02 07:59:17: Tightened the `Spaghetti-Editor 3` umbrella read by adding `Phase 4 - Essentials Canvas Background Transparency Cleanup` as the next implementation-ready slice, so the remaining `e`-mode readability polish has its own honest follow-on focused on a Spaghetti editor titlebar canvas-background transparency slider instead of widening the shipped overlay-titlebar phase.
17. 2026-05-02 07:36:15: Marked `Spaghetti-Editor 3 / Phase 3 - Overlay Titlebar Controls And Surface Cleanup` shipped in the umbrella read, confirming that the model viewport titlebar now owns visible overlay state, graph naming, direct `O` exit, and the first background-transparency control while the old floating overlay chip path is retired.
16. 2026-05-02 07:24:31: Marked `Spaghetti-Editor 3 / Phase 2 - Overlay Viewport Ownership And Hit-Testing` shipped in the umbrella read, confirming that `O` now lives under the active viewport host instead of a blocking global shell, and tightened the next implementation-ready slice to `Phase 3 - Overlay Titlebar Controls And Surface Cleanup` around the remaining temporary floating exit chip, viewport-titlebar overlay wording, and first readability control handoff.
15. 2026-05-01 20:47:53: Tightened the `Spaghetti-Editor 3` umbrella read after shipping `Phase 1`, confirming that the next implementation-ready slice is now `Phase 2 - Overlay Viewport Ownership And Hit-Testing` grounded in the live `overlay` shell state, viewport-host seam, and existing `Shift` viewer-control behavior.
14. 2026-05-01 20:27:32: Tightened the `Spaghetti-Editor 3` umbrella read after prepping `Phase 1 - Window Density Truth And O Mode Entry` for implementation, confirming that the next code cut should stay on the shell-level `- / e / + / O` split before the later overlay ownership and titlebar cleanup phases.
13. 2026-05-01 20:23:22: Updated the `Spaghetti-Editor 3` umbrella summary so the accidental new `Phase 0` stays removed, the new overlay workspace-behavior slice now lives as `Phase 2 - Overlay Viewport Ownership And Hit-Testing`, and the former titlebar cleanup follow-on is renumbered to `Phase 3`.
12. 2026-05-01 20:18:48: Removed `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` from the `Spaghetti-Editor 3` ladder after review showed it should stay as boundary context in the standalone plan rather than as a real family execution phase.
11. 2026-05-01 20:12:19: Added `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` to the `Spaghetti-Editor 3` phase ladder so the editor presentation-state versus canonical node-CAD undo boundary is tracked before the `O` mode implementation phases.
10. 2026-04-13: Reframed the new `Spaghetti-Editor 4` family from a generic node-toolbar-host lane into `Spaghetti-Editor 4 - Left Node Palette And Drag-Drop Surface`, so the umbrella index now matches the intended compact hideable left toolbar for browsing, organizing, and dragging node types onto the canvas
9. 2026-04-13: Added the open umbrella phase `Spaghetti-Editor 4 - Canvas Node Toolbar Host And Launcher Contract` plus the dedicated future doc `Future/Spaghetti-Editor 4 - Canvas Node Toolbar Host And Launcher Contract.md` so generic canvas-owned node-toolbar hosting, launcher behavior, and family handoff now have one clean planning home instead of living only as scattered node-family toolbar notes
8. 2026-04-06: Added the open umbrella phase `Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation` plus the dedicated future doc `Future/Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation.md` so the proposed new `O` titlebar mode, the cleanup of the current overlay-on-model-viewport experiment, and the restoration of `e` to real essential float-window meaning now have one clean planning home
7. 2026-04-06: Marked `Spaghetti-Editor 2 - New Node Spawn Mode And Toolbar Cycle Control` shipped after the editor gained the global spawn-mode cycle control and creation-time node-mode stamping, and refreshed the umbrella phase summary so the new-node compact-default cleanup now reads as landed workspace behavior
6. 2026-04-06: Prepared `Spaghetti-Editor 2` for implementation by adding the dedicated future doc `Future/Master_Spaghetti_Phase Spaghetti-Editor-2 - New Node Spawn Mode And Toolbar Cycle Control.md`, narrowing the umbrella index entry so the spawn-default and toolbar-cycle work now points at one implementation-ready source of truth
5. 2026-04-06: Added the open umbrella phase `Spaghetti-Editor 2 - New Node Spawn Mode And Toolbar Cycle Control` so the editor-level cleanup around first-spawn node density and a future global `Collapsed / Essentials / Expanded` spawn-default cycle button has one clean planning home instead of being scattered across node-family docs
4. 2026-03-28: Corrected the umbrella source-doc pointers after a repo audit by treating this file as the live `Spaghetti-Editor-Arch` entry point, moving the older `Spaghetti-Editor-Explained.md` reference into archived-background context, and replacing the dead local `01.2 - Browser Workspace.md` pointer with the live `Browser` family index
3. 2026-03-25: Added the standalone future phase doc for `Master Spaghetti-1` under `Spaghetti-Editor-Arch/Future/`, turning the first smart-wiring umbrella phase into an implementation-ready planning surface grounded on the real current `SketchProfile -> Geometry/Extrude -> OutputPreview in:solid:<slotId>` path
2. 2026-03-25: Added the first explicit `Master Spaghetti` phase section, seeding a new umbrella `Smart Wiring` proving slice so cross-node canvas QoL behavior like sketch-wire-to-output auto-extrude insertion has one narrow workspace-level planning home without turning the whole doc into a mixed execution backlog
1. 2026-03-25: Created this umbrella index for `Spaghetti-Editor-Arch` so the folder has one clear entry-point doc that explains what `Master Spaghetti` owns, which subfamilies already have real phase ladders, and where deeper execution planning should live

### Purpose

This file is the umbrella index for the `Spaghetti-Editor-Arch` folder.

Use it to answer:
- what `Master Spaghetti` is supposed to be
- which docs under this folder are current source-of-truth docs
- which parts of the Spaghetti architecture already have real phase ladders
- which work should stay in umbrella docs versus move into subfamily docs

### Scope Note

This doc is intentionally an index and architecture map.

It is the right place for:
- folder-level orientation
- ownership boundaries between the main Spaghetti surfaces
- source-doc links
- current family status

It is not the right place for:
- detailed execution specs for sketch growth
- detailed execution specs for extrude growth
- node-family command backlogs
- browser-specific implementation phases

Those should stay in their dedicated family docs.

## Doc Body

### Short Version

`Master Spaghetti` is the umbrella architecture map for the Spaghetti workspace.

It should explain how the major pieces fit together, but it should not become the execution home for every concrete feature.

The real phase ladders now mostly live in subfamilies, especially:
- `Nodes`
- `Nodes/Sketch`
- `Nodes/Extrude`

### Current Role Of `Master Spaghetti`

Right now `Master Spaghetti` should be treated as:
- the folder entry point
- the current high-level architecture map
- the place that explains how graph documents, editor viewports, canvas, Browser, runtime, and viewer fit together

Right now it should not be treated as:
- the main execution backlog for node behavior
- the main execution backlog for sketch tooling
- the main execution backlog for extrude authoring

Important rule:
- if the work is about a specific node family, it should usually land in that node-family doc
- if the work is about how the whole Spaghetti workspace is structured, it can live here

### Main Architecture Layers

The current Spaghetti workspace is bigger than one floating node editor.

The main layers are:
- graph documents
- editor viewports
- graph canvas
- node registry and node families
- part-internal feature stack editing
- graph-local runtime state
- graph-owned published output state
- Browser workspace coordination
- shared viewer targeting and composition

### Current Source Docs For This Area

#### `Master Spaghetti`

Current role:
- umbrella architecture map
- current workspace-level mental model

Primary docs:
- this file
- `docs/Archive/Spaghetti-Editor-Explained.md`
  - archived background explainer, not the live family index

#### `Browser Workspace`

Current role:
- browser structure and browser-to-editor coordination inside the Spaghetti architecture area

Current source doc:
- `docs/Human-Plans/Architecture/Browser/Browser-Index.md`

#### `Nodes`

Current role:
- node-family planning umbrella
- node inventory
- shared `EWR` direction

Primary docs:
- `Nodes/Nodes-Index.md`
- `Nodes/Sketch/Sketch.md`
- `Nodes/Extrude/extrude-index.md`

### Current Family Status

#### [~] `Master Spaghetti`

Current read:
- this family is still mainly an umbrella architecture map
- it now has one first proving-slice phase for cross-node smart-wiring behavior
- it now also has a small editor-shell and canvas-chrome ladder for shared spawn-mode, overlay, and a left-side node palette
- it now has a viewport-command bridge plan for command commits that should author graph nodes and wires behind the scenes while later feeding Build Path history projection
- it still does not have a deep standalone ladder like `Sketch`
- deeper feature planning should keep moving into subfamilies instead of bloating the umbrella doc

#### `Spaghetti-Editor 3` Next Slice

Current read:
- `Phase 1`, `Phase 2`, `Phase 3`, and `Phase 4` are now shipped
- `O` now enters honestly, stays viewport-local, and is visibly announced from the model viewport titlebar instead of a leftover floating-shell chip
- the model viewport titlebar now owns:
  - direct `O` exit
  - active overlaid graph naming
  - the first background-transparency readability control
- `e` mode now has its own compact Spaghetti editor titlebar `BG` slider for canvas background transparency
- no immediate `Spaghetti-Editor 3` follow-on slice is required until a broader editor appearance or settings expansion is intentionally planned

#### `Spaghetti-Editor 7` Next Slice

Current read:
- `Phase 1 - Split Pane Chrome Fit` is now shipped with responsive split-host fit targeting, shrink-safe title/focus picker lanes, compact accessible canvas-toolbar labels, disabled toolbar readability, and focused panel/canvas/registry proof
- `Phase 2 - Split Pane e And + Mode Behavior` is now shipped with a Spaghetti-only shared `ViewportFrame` header-start control that uses existing editor viewport presentation state to cycle `+` into compact essentials and `e` back to full editor mode without mounting the floating Spaghetti titlebar inside the pane
- `Phase 3 - Split Pane Local Minus Rule` is now shipped with Spaghetti split-pane `e / +` density folded onto the shared primary header button, the duplicate density supplement removed, right-click viewport-type access preserved, and floating Spaghetti `- / e / + / O` behavior unchanged
- the Phase 3 follow-up now forwards split-hosted editor viewport presentation flags into `SpaghettiPanel`, so `e` mode changes the slotted panel body to essentials mode instead of only changing the header button label
- `Phase 4 - Narrow Pane Visual Proof And Closeout` is now shipped as the final proof-only closeout after focused regression reruns, production build proof, and DOM-level narrow split-pane validation confirmed no additional behavior change was needed
- no immediate `Spaghetti-Editor 7` follow-on is required unless a new split-pane polish request appears outside the original crowded-titlebar, `e / +`, local `-`, and compact-toolbar goals
- this work belongs to the Spaghetti Editor shell rather than node-family behavior, because it changes editor hosting and presentation fit, not graph-authored truth

#### `Spaghetti-Editor 8` Next Slice

Current read:
- this is now the active planning bridge for viewport-first CAD command authoring
- the user should be able to operate from the model viewport, console, shortcuts, or toolbar while accepted commands still create/update normal Spaghetti graph truth
- `Phase 1 - Viewport Command Commit Contract` is shipped with a narrow lifecycle contract over preview/session/commit/cancel behavior and root Sketch integration
- `Phase 2 - Shared Command To Graph Authoring Seam` is shipped with the current Sketch node create/reuse mutation extracted into a shared graph-command authoring owner
- `Phase 3 - Root Extrude And Viewport Profile Selection Toolbar` is shipped with live command-session, toolbar, profile-pick, live node, live profile wires, accepted output-preview wiring, profile visual affordance, transient depth preview, durable `OK` acceptance, and Cancel rollback
- the remaining Phase 3 UX target should read as `Extrude > Select Profiles > Depth`, where closed profiles are visibly selectable, plain profile clicks toggle individual sketch profile rows into or out of the selected set, shift-click selects all compatible profiles in the same sketch, and the depth preview/value appears after selected profiles exist
- repeated profile-driven Extrude commands are new operations by default; selecting the same closed profile and accepting Extrude again should create a second `Geometry/Extrude` node rather than mutate the prior accepted Extrude
- `Phase 3.7 - Profile-First Extrude Numeric Depth Handoff` is shipped: active `Extrude > Depth` now consumes finite numeric Console input for transient preview/session depth updates, and `Enter` commits through the existing accept path
- `Phase 3.1 - Atomic Extrude Graph Commit Repair` is shipped with `authorExtrudeGraphCommand` using a preflighted plan and one atomic commit boundary instead of separate helper-owned node and wire callbacks
- `Phase 3.2 - Real Extrude Session Owner And Command Tree` is shipped with a shared transient session owner plus Console-visible command-tree projection; the toolbar should later read and dispatch against this owner, not own the Extrude truth itself
- `Phase 3.2A - Extrude Select Profiles Console Prompt` is shipped as the Console prompt bridge: the active `Extrude > Select Profiles` session now owns the next Console token before root parsing, can resolve text profile choices into transient selected profile sources, and still keeps root `Extrude` as a shortcut into canonical `Graph > Extrude` rather than a duplicate command owner
- the remaining Phase 3 continuation is now split into `Phase 3.1` through `Phase 3.6`:
  - `Phase 3.1` - shipped atomic Extrude graph commit repair
  - `Phase 3.2` - shipped real Extrude session owner and Console-visible command tree
  - `Phase 3.2A` - shipped Console prompt bridge for `Extrude > Select Profiles`
  - `Phase 3.3` - shipped viewport shortcut modal guarding
  - `Phase 3.4` - shipped model viewport Extrude toolbar shell
  - `Phase 3.5` - shipped profile picking count and preview state
  - `Phase 3.5A` - shipped live Extrude node and profile auto-wiring contract
  - `Phase 3.5B` - shipped viewport profile hover and preselection
  - `Phase 3.5C` - shipped extrude depth preview volume and value feedback
  - `Phase 3.6` - shipped Extrude commit/cancel proof and Phase 3 closeout
  - `Phase 3.7` - shipped profile-first Extrude numeric depth handoff
- `Build Path` should later present those accepted graph command commits as a history-style row projection instead of owning separate command geometry
- Build Path projection and full node arrangement modes remain relevant, but should wait until accepted Sketch/Extrude command commits create enough graph truth to summarize and arrange

#### [~] `Nodes`

Current read:
- this is the deepest real planning tree under `Spaghetti-Editor-Arch`
- shared node structure and concrete geometry-node growth already live there

Current main tracks:
- shared `EWR` foundation
- `Sketch`
- `Extrude`

#### [~] `Sketch`

Current read:
- `Sketch` already has the most mature phase ladder in this folder
- most concrete sketch authoring, console, snap, and modify growth belongs there

#### [ ] `Extrude`

Current read:
- `Extrude` now has a real family doc
- it is still early and only at the first open phase
- concrete sketch-to-extrude authored behavior should land there instead of in `Master Spaghetti`

### Current Ownership Boundaries

#### Workspace-Level Ownership

`Master Spaghetti` should own:
- graph-document mental model
- editor viewport mental model
- canvas versus Browser versus viewer relationship
- graph-owned versus Browser-local versus project-owned truth boundaries

#### Node-Family Ownership

`Nodes` should own:
- node-family structure
- node inventory
- row-tree and wire contract direction

`Sketch` should own:
- sketch plane setup
- sketch draw authoring
- sketch command growth
- sketch browser/content follow-ons

`Extrude` should own:
- profile-to-body consumption rules
- extrude preview/runtime alignment
- extrude authoring follow-ons
- sketch-to-extrude authored workflow rules

### Placement Rule For New Work

Use this rule before creating or extending a phase:

- if the feature changes the whole Spaghetti workspace mental model, start here
- if the feature changes a specific node family's behavior, put it in that node family
- if the feature is mainly about Browser coordination, put it in the Browser family
- if the feature is mainly about canvas wiring behavior for a specific node family, prefer that node-family doc first unless the behavior is clearly generic across many node families

### Current Gap

The main current gap is not a missing node-family phase ladder.

The main gap is that `Master Spaghetti` still reads more like a useful explanation doc with one first proving slice than a mature family index with a deep shipped/open ladder.

That is acceptable for now as long as:
- the subfamilies keep carrying the real execution detail
- this doc stays clean and does not turn into a mixed backlog dump

### Suggested Maintenance Direction

The next useful cleanup direction for this folder is:
- keep `Master Spaghetti` as the clean umbrella entry point
- keep any `Master Spaghetti` phases limited to clearly cross-node workspace/canvas behavior
- keep `Nodes` as the main node-planning umbrella
- keep pushing concrete `Sketch` and `Extrude` execution work into their own family docs
- only give `Master Spaghetti` its own phase ladder later if truly workspace-level Spaghetti work starts accumulating again


## Phases

### [ ] Spaghetti-Editor 1 - Smart Wiring And Intent-Aware Auto-Insert First Pass

Standalone phase doc:
- `Future/Master_Spaghetti_Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass.md`

#### Purpose

Add the first honest cross-node QoL wiring behavior to the Spaghetti canvas.

This phase should prove that the canvas can understand a clear authored intent, insert the missing intermediate node automatically, and complete the expected wiring path instead of forcing the user to spawn and place every bridge node manually.

#### Owns

- the first workspace-level `smart wiring` behavior in the graph canvas
- interpreting one narrow drag/drop intent at wire-connect time
- automatic insertion of one intermediate geometry node when the source and target imply a missing feature step
- automatic wiring of the inserted node so the final graph matches the intended authored flow
- first user-facing rules for when smart insertion should happen versus when the drag should just fail or stay manual

#### Does Not Own

- transform-aware extrude runtime or preview alignment
- the deeper `Extrude` profile contract
- generic node recommendation systems
- broad AI-style graph authoring
- every later QoL auto-fix in the same phase

#### First Proving Slice

The first proving slice is the feature discussed here:

- when the user drags a sketch wire to an output node
- and that output path expects a body/solid result instead of a sketch profile
- the canvas should automatically:
  - create one `Geometry/Extrude` node
  - wire the sketch output into the new extrude input
  - wire the new extrude output into the target output node

The intended authored result is:

- `SketchProfile`
  - into `Geometry/Extrude`
- `Geometry/Extrude`
  - into the output-facing target slot

Important rule:
- this first phase is not "auto-build any missing chain"
- it is one narrow, deterministic authored shortcut for the most obvious sketch-to-solid bridge

#### Why This Lives Here

This phase belongs in `Master Spaghetti` because it is not only an `Extrude` feature.

It is the first umbrella rule for:
- canvas drag intent
- graph mutation at drop time
- automatic intermediate-node insertion

`Extrude` still owns the deeper body/profile contract, but `Master Spaghetti` owns the first workspace rule that the canvas may insert a missing node when the user's wiring intent is obvious.

#### Hard Rules

- only trigger auto-insert when the source/target pairing clearly implies one missing `Sketch -> Extrude -> Output` bridge
- do not silently rewrite existing unrelated graph structure
- do not trigger when the direct connection is already valid and honest
- do not spawn more than one intermediate node in this first pass
- keep the inserted node type deterministic:
  - `Geometry/Extrude`
- place the new node in a predictable canvas location between source and target
- leave later smart-wiring families for later phases once this first intent path proves stable

#### Questions / Decisions

##### [ ] `q1` Should the first smart-wiring pass trigger only on sketch-profile to output-facing body targets?

##### Suggestion

Yes.

Keep the first pass narrow:
- sketch-profile source
- output-facing solid/body target
- one inserted `Geometry/Extrude`

Do not broaden into other inferred chains until this one feels honest.

##### [ ] `q2` Should the first inserted extrude use default params rather than opening a new configuration wizard?

##### Suggestion

Yes.

Spawn the extrude with normal default params and wire it immediately.

The value of the feature is:
- fewer clicks
- preserved graph flow

Not:
- interrupting the drop with another setup mode.

##### [ ] `q3` Should the first smart-wiring pass prefer one stable graph mutation path shared by mouse-drop and any future command/toolbar trigger?

##### Suggestion

Yes.

The first implementation should aim for one canonical graph-mutation seam so future QoL entry points can reuse the same insertion behavior instead of cloning drag-specific graph-edit logic.

#### Acceptance Shape

- dragging from a sketch output toward an output-facing body target can succeed even when a direct profile-to-output connection is not the right final graph
- the canvas inserts one `Geometry/Extrude` node automatically
- the inserted node lands between the source and target in a predictable location
- the sketch output is wired into the new extrude input
- the new extrude output is wired into the target output slot
- the resulting graph is readable and editable like a normal manually-authored graph
- the behavior stays narrow and deterministic instead of trying to infer many different missing chains

### [x] Spaghetti-Editor 2 - New Node Spawn Mode And Toolbar Cycle Control

Standalone phase doc:
- `Future/Master_Spaghetti_Phase Spaghetti-Editor-2 - New Node Spawn Mode And Toolbar Cycle Control.md`

#### Purpose

Add one honest editor-level control for how newly created nodes should appear when they first spawn on the canvas.

This phase should separate:
- the mode of already-existing nodes
- the default mode applied to future newly spawned nodes

The goal is to let the user cycle one global `new node spawn mode` preference between:
- `Collapsed`
- `Essentials`
- `Expanded`

without rewriting the visible state of nodes that are already on the graph.

Implementation-ready phase details now live in the standalone doc above.

Short read:
- add one global `new node spawn mode` preference
- expose it as a toolbar cycle control
- stamp that chosen mode onto newly created nodes
- keep existing nodes untouched
- ship `Collapsed` as the first default so new nodes open with visible rails and compact one-line rows

Shipped read:
- the toolbar cycle control is live
- new nodes now inherit the selected spawn mode at creation time
- existing nodes do not get restyled when the preference changes

### [ ] Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation

Standalone phase doc:
- `Future/Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation.md`

#### Purpose

Add a fourth titlebar option, `O`, so overlay-on-model-viewport becomes a real editor presentation mode instead of continuing to overload `e`.

This phase should separate:
- float-window density:
  - `- / e / +`
- overlay placement:
  - `O`

Implementation-ready phase details now live in the standalone doc above.

Short read:
- restore `e` to real essential float-window meaning
- make `O` the explicit overlay-on-model-viewport mode
- keep node row-density separate from this mode system
- lock viewport-local overlay ownership and hit-testing before later titlebar/control polish

Shipped outcome:
- `Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup`
- `e` mode now owns its own compact titlebar readability control while the viewport-titlebar overlay ownership from `Phase 3` stays separate and intact

Initial phase breakdown:
- `Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry`
- `Spaghetti-Editor 3 - Phase 2 - Overlay Viewport Ownership And Hit-Testing`
- `Spaghetti-Editor 3 - Phase 3 - Overlay Titlebar Controls And Surface Cleanup`
- `Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup`

### [ ] Spaghetti-Editor 4 - Left Node Palette And Drag-Drop Surface

Standalone phase doc:
- `Future/Spaghetti-Editor 4 - Left Node Palette And Drag-Drop Surface.md`

#### Purpose

Add one honest left-side node palette for the Spaghetti canvas so the user can browse, search, and organize addable node types without relying only on the temporary canvas add menu.

This phase should separate:
- generic canvas-owned node palette behavior
- family-specific node definitions and organization labels

Implementation-ready phase details now live in the standalone doc above.

Short read:
- add one compact hideable toolbar on the left side of the canvas
- reuse the existing addable node list instead of inventing a second node-source truth
- organize nodes so the user can browse and search them more easily
- support dragging node types from the palette onto the canvas
- keep the current temporary add menu only as compatibility residue until the palette is good enough to replace or narrow it

Initial phase breakdown:
- `Spaghetti-Editor 4 - Phase 1 - Left Palette Host And Visibility`
- `Spaghetti-Editor 4 - Phase 2 - Organized Node List And Search Surface`
- `Spaghetti-Editor 4 - Phase 3 - Drag-And-Drop Node Spawn And Add-Menu Handoff`

### [ ] Spaghetti-Editor 5 - Meatball Dock Persistence Across Split Layouts

Standalone phase doc:
- `Future/Spaghetti-Editor 5 - Meatball Dock Persistence Across Split Layouts.md`

#### Purpose

Keep the docked meatball editor visible after splitting the model viewport right by separating dock ownership from the split-induced `expanded` fallback that currently appears to drop the meatball surface out of the left toolbar.

This phase should separate:
- dock ownership truth for the meatball slot
- split-right reclassification behavior for Spaghetti surfaces
- the user-visible requirement that the docked editor remain present after the split finishes

Implementation-ready phase details now live in the standalone doc above.

Short read:
- preserve the docked meatball editor across split-right instead of letting it disappear
- keep the left dock honest about whether a meatball surface is still owned
- trace the split transition in the Spaghetti workspace shell and store
- add one focused regression for the exact repro path

Initial phase breakdown:
- `Spaghetti-Editor 5 - Phase 1 - Preserve Meatball Dock Ownership Through Split-Right`

### [ ] Spaghetti-Editor 6 - Draft Mesh And Authoritative B-Rep Auto Pipeline

Standalone phase doc:
- `Future/Spaghetti-Editor 6 - Draft Mesh And Authoritative B-Rep Auto Pipeline.md`

#### Purpose

Compile the high-level geometry experience where Spaghetti-authored graph truth feeds both a fast draft mesh path and a separate authoritative B-rep path.

This phase should separate:
- draft mesh generation for live parameter feedback
- authoritative B-rep generation for final display and export
- viewport result policy for `Auto`, `Draft`, and `Final`
- node-family B-rep widening work that belongs in deeper node docs

Short read:
- draft meshes should update quickly while the user is changing parameters
- authoritative B-rep geometry should build on a separate path from the same graph intent
- `Auto` should show draft while editing and swap to the matching final B-rep-derived display when ready
- export should consume authoritative B-rep geometry only, never draft mesh truth

Initial phase breakdown:
- `Spaghetti-Editor 6 - Phase 1 - Draft And Authoritative Support Audit`
- `Spaghetti-Editor 6 - Phase 2 - Revision Matching And Worker Supersession`
- `Spaghetti-Editor 6 - Phase 3 - Node-Family Authoritative Widening Ladder`
- `Spaghetti-Editor 6 - Phase 4 - Auto Draft-To-Final Viewport Policy Verification`
- `Spaghetti-Editor 6 - Phase 5 - Authoritative Export Handoff Completion`
- `Spaghetti-Editor 6 - Phase 6 - Mesh-Truth Leak Cleanup And HLG Closeout`

### [x] Spaghetti-Editor 7 - Split Pane Density And Local Mode Controls

Standalone phase doc:
- `Future/Spaghetti-Editor 7 - Split Pane Density And Local Mode Controls.md`

#### Purpose

Make the Spaghetti Editor feel native and readable when it is hosted inside a split workspace pane.

This phase should separate:
- split-pane titlebar and graph-selector fit
- local split-pane `e / +` density behavior
- the local Spaghetti `-` rule
- shared workspace pane close/split ownership

Short read:
- fix overlapping split-pane Spaghetti titlebar and graph selector text
- make the lower canvas toolbar fit narrow panes without oversized labels or collisions
- make `e` and `+` useful as split-pane local compact/full controls
- decide whether the local Spaghetti `-` should be hidden, disabled, or mapped to a real pane-local state
- keep workspace close/remove behavior owned by the shared workspace shell

Initial phase breakdown:
- `[x] Spaghetti-Editor 7 - Phase 1 - Split Pane Chrome Fit`
- `[x] Spaghetti-Editor 7 - Phase 2 - Split Pane e And + Mode Behavior`
- `[x] Spaghetti-Editor 7 - Phase 3 - Split Pane Local Minus Rule`
- `[x] Spaghetti-Editor 7 - Phase 4 - Narrow Pane Visual Proof And Closeout`

### [~] Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge

Standalone phase doc:
- `Future/Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge.md`

#### Purpose

Define the bridge where Fusion/Blender-style viewport operation, console commands, shortcuts, and toolbar actions still author the Spaghetti graph in the background.

This phase should separate:
- transient viewport command preview
- accepted graph-command commits
- automatic node creation and wiring
- later Build Path projection over those accepted graph commits

Short read:
- the user should be able to model mostly from the viewport
- committing commands like `Sketch` or `Extrude` should create or update real Spaghetti nodes, params, and wires
- automatic wiring should reuse one shared graph-command/planner direction instead of being cloned per surface
- command-created nodes should land neatly in the Spaghetti editor instead of piling up
- later arrangement modes can make the same graph easier to read without changing graph truth
- Build Path should later show those accepted command commits as history rows while Spaghetti remains the dependency truth

Initial phase breakdown:
- `[x] Spaghetti-Editor 8 - Phase 1 - Viewport Command Commit Contract` - shipped implementation guardrail for preview/session/commit/cancel boundaries
- `[x] Spaghetti-Editor 8 - Phase 2 - Shared Command To Graph Authoring Seam` - shipped shared owner for Sketch graph authoring
- `[~] Spaghetti-Editor 8 - Phase 3 - Root Extrude And Viewport Profile Selection Toolbar` - first runtime slice shipped for root Extrude command entry, no-mutation session start, and shared Extrude profile-wire authoring; viewport toolbar/profile-pick UI remains next
- `[x] Spaghetti-Editor 8 - Phase 3.1 - Atomic Extrude Graph Commit Repair` - shipped repair that moved Extrude graph authoring to a preflighted plan plus one atomic commit boundary before visible toolbar commit depends on the helper
- `[x] Spaghetti-Editor 8 - Phase 3.2 - Real Extrude Session Owner And Command Tree` - shipped shared transient command state for root Console `Extrude`, Console/session labels for `Extrude > Select Profiles > Depth`, Escape cancellation, and first selected-profiles-to-depth transition proof while toolbar, picking, preview, graph commit, and Build Path work stay deferred
- `[x] Spaghetti-Editor 8 - Phase 3.2A - Extrude Select Profiles Console Prompt` - shipped active Extrude Console prompt routing, pure sketch-profile token resolution into transient profile sources, no-root-command fallthrough while selecting profiles, and no graph mutation before later commit work
- `[x] Spaghetti-Editor 8 - Phase 3.3 - Viewport Shortcut Modal Guarding` - shipped idle-only viewport command shortcut guarding so active command/session owners block root viewport command shortcuts
- `[x] Spaghetti-Editor 8 - Phase 3.4 - Model Viewport Extrude Toolbar Shell` - shipped shell-only viewport toolbar over the owned session state, with selected count, depth, operation, blocked/ready state, and Cancel proof while profile picking, preview, and commit remain deferred
- `[x] Spaghetti-Editor 8 - Phase 3.5 - Profile Picking Count And Preview State` - shipped viewport profile-pick handoff for graph-authored sketch profiles, shift-click same-sketch expansion, toolbar count/depth updates, and no graph mutation before OK commit
- `[x] Spaghetti-Editor 8 - Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract` - shipped live graph node creation/reuse on Extrude start, exact sketch-profile row auto-wiring on Console and viewport profile picks, and command-owned Cancel rollback for created versus reused Extrude nodes before visual polish
- `[x] Spaghetti-Editor 8 - Phase 3.5B - Viewport Profile Hover And Preselection` - shipped first-pass selectable closed-profile fill, white hover highlight, transient profile preselection outside Extrude, same-sketch Shift-click expansion, and Extrude startup seeding into the live auto-wiring path
- `[x] Spaghetti-Editor 8 - Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` - shipped transient selected-profile cap and depth-driven extrusion preview volume projection, with no-graph-mutation proof before durable OK acceptance
- `[x] Spaghetti-Editor 8 - Phase 3.6 - Extrude Commit Cancel Proof And Phase 3 Closeout` - shipped live command-node accept/cancel closeout: `OK` finalizes durable depth/default params and keeps live profile wires, while Cancel preserves rollback behavior
- `[x] Spaghetti-Editor 8 - Phase 3.7 - Profile-First Extrude Numeric Depth Handoff` - shipped active `Extrude > Depth` numeric input ownership, live session/preview depth updates from typed finite numbers, and Enter-to-accept through the existing live command commit path
- `[x] Spaghetti-Editor 8 - Phase 4 - Build Path Projection Handoff` - shipped pure projection contract over accepted graph-command summaries, with cancelled commands skipped and graph ids preserved for later Build Path phases
- `[x] Spaghetti-Editor 8 - Phase 5 - Background Node Layout And Arrangement Modes` - shipped pure command-created node placement planner before later call-site integration and arrangement-mode UI

### [~] Spaghetti-Editor 9 - Repeat Extrude Retained Output While Building

Standalone phase doc:
- `Future/Spaghetti-Editor 9 - Repeat Extrude Retained Output While Building.md`

#### Purpose

Keep already accepted Extrude output visible while a repeat Extrude adds another `OutputPreview` slot and the new build is still pending.

This phase should separate:
- valid retained output-entry display continuity
- new pending output entries
- worker supersession and diagnostics

Short read:
- the first accepted Extrude should stay visible after accepting a second Extrude
- adding a second output slot should not make the viewport treat the whole previous result as invalid
- stale build-result gates should stay strict
- worker diagnostics should come after retained display continuity is proven

Initial phase breakdown:
- `[x] Spaghetti-Editor 9 - Phase 1 - Retain Existing Output Entries During Repeat Extrude` - shipped selector-owned retained output-overlap repair, committed `OutputPreview` artifact fallback, accepted Extrude edit-history snapshots, an auto final build loop guard, and new-branch active preview layering that keeps accepted sibling outputs visible
- `[ ] Spaghetti-Editor 9 - Phase 2 - Second Build Pending Diagnostics`

### [x] Spaghetti-Editor 10 - Viewer Window Selection Direction Repair

Standalone phase doc:
- `Future/Spaghetti-Editor 10 - Viewer Window Selection Direction Repair.md`

#### Purpose

Restore the shipped viewer `Window` / `Crossing` selection direction rule for the viewport-first Spaghetti workflow.

Short read:
- left-to-right drag should be `Window` selection and require full containment
- right-to-left drag should be `Crossing` selection and capture overlapped candidates
- the repair belongs in the shared viewer helper so object marquee selection and idle sketch selection stay aligned
- the Spaghetti graph canvas itself should also support empty-space Window/Crossing selection for graph nodes
- middle-mouse double-click should fit all graph-canvas selected nodes after a Window/Crossing multi-selection
- visible scroller background should not be a dead start zone for right-to-left Crossing selection

Initial phase breakdown:
- `[x] Spaghetti-Editor 10 - Phase 1 - Viewer Window/Crossing Direction Repair` - shipped shared helper and focused test repair for the left-to-right `Window`, right-to-left `Crossing` contract
- `[x] Spaghetti-Editor 10 - Phase 2 - Spaghetti Canvas Window/Crossing Selection Restore` - shipped empty-canvas graph-node Window/Crossing selection, visible selection rectangle styling, selected-node visual projection, focused canvas tests, and production build proof
- `[x] Spaghetti-Editor 10 - Phase 3 - Canvas Multi-Selection Fit` - shipped middle-mouse double-click fitting for the current graph-canvas selected-node set after Window/Crossing selection
- `[x] Spaghetti-Editor 10 - Phase 4 - Crossing Background Drag Start` - shipped scroller-background drag ownership so green Crossing selection can begin from visible canvas background outside the transformed stage

### [x] Spaghetti-Editor 11 - Canvas Viewport Persistence Build Isolation

Standalone phase doc:
- `Future/Spaghetti-Editor 11 - Canvas Viewport Persistence Build Isolation.md`

Related bug:
- `docs/Bugs/25_2026-05-25_spaghetti-canvas-zoom-triggers-worker-build.md`

#### Purpose

Make Spaghetti graph-canvas pan/zoom persistence document-only so editor navigation does not advance geometry revision or trigger worker builds.

Short read:
- wheel zoom and canvas pan should stay local and immediate
- persisted `graph.ui.viewport` should survive reopen/remount
- graph-canvas viewport persistence should update document/UI metadata only
- `currentGraphRevision` should not move for zoom/pan-only changes
- build subscriptions should not request worker builds from canvas navigation

Initial phase breakdown:
- `[x] Spaghetti-Editor 11 - Phase 1 - Canvas Viewport Persistence Build Isolation` - shipped a dedicated document-only graph viewport persistence action, routed `SpaghettiCanvas` through it, and proved no worker build request occurs
