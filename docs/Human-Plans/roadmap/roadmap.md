# ParaHook Roadmap

## Doc Header
### Fold Hack 3
#### FOld Hack 4
###### Doc History
105. 2026-03-20 01:16: Added `[4.1N] Feature Session Prompt Descriptors` to the live console roadmap as the shipped follow-on that extends the assisted staged-choice seam into active feature sessions, so `Sketch Plane` and idle `Sketch Draw` now publish shared prompt/choice/prefill descriptors instead of relying on one-off input seeding
104. 2026-03-20 00:58: Added `vi1` and `vi2` into the live console roadmap as shipped follow-ons `[4.1L] Command Transcript Sublayers` and `[4.1M] Staged Choice Prefill And Arrow Cycling`, so the console lane now has a real roadmap home for the `Commands.User / Commands.System` transcript split and the staged-choice prefill/cycling refinement instead of leaving them only as bottom-of-file architecture vision notes
103. 2026-03-20 00:50: Marked `[3.2B-S4] Sketch Return One Level` complete after adding one shared sketch-local back-step seam in the store, routing sketch `Escape` and console `back` through it, and exposing visible sketch-plane / sketch-draw toolbar `Back` actions without widening the work into whole-app navigation architecture
102. 2026-03-20 00:44: Added a new `[3.2B-S1]` through `[3.2B-S5]` sketch-session cleanup family under `[3.2B] Sketch Operation Authoring`, giving the shipped sketch hierarchy/session cleanup work and the remaining return-level / toolbar-console alignment follow-ons a real roadmap home instead of leaving them only as local `Sketch.md` architecture labels
101. 2026-03-19 18:33: Marked `[4.1J4] Cleanup And Hardening` complete after collapsing reference-transform `Escape` exit onto one real session seam, proving flat console capture resumes predictably after higher-priority sessions end, and adding the extra routing regressions that guard against accidental precedence drift for the hardened command/input model
100. 2026-03-19 18:27: Marked `[4.1J3] Session Migration` complete after moving the busiest conflicting sessions onto the shared routing seam, preventing staged/flat console capture from reclaiming printable token input while higher-priority feature sessions are active, and proving the migrated precedence with targeted console/input-routing regressions
99. 2026-03-19 18:15: Marked `[4.1J2] Shared Input Routing Seam` complete after adding one shared keyboard owner-selection seam, routing the first real precedence checks through it, and wiring console capture, sketch-plane, sketch-draw, and reference-transform listeners through the same `owner + decision` contract without pulling broader workspace-selection coordination into the phase
98. 2026-03-19 15:05: Synced the console roadmap with the shipped staged-command and input-ownership work by adding `[4.1I]` and `[4.1J]`, marking `[4.1I1-I4]` and `[4.1J1]` complete, and leaving `[4.1I5]` plus `[4.1J2-J4]` open as the next real follow-ons
97. 2026-03-19 13:31: Marked `[4.1H] Hybrid Command Capture And Shortcut Unification` complete after the console input now auto-captures printable typing without requiring `/`, keeps `/` as optional explicit focus, protects real text fields, routes typed aliases like `m` through visible command submission, and keeps the parent `[4.1]` lane partial only because `[4.1E-G]` still remain
96. 2026-03-19 11:24: Tightened the new console follow-on `[4.1H]` so the live roadmap now explicitly treats `/` as optional, `m / r / s` as typed-first command entry in that phase, and the shared-dispatcher/protected-field rules as the real acceptance shape rather than leaving hybrid capture vague
95. 2026-03-19 11:12: Added a new console follow-on subphase `[4.1H] Hybrid Command Capture And Shortcut Unification` so the roadmap now has an explicit home for the post-`4.1C` direction where printable typing can auto-enter the console without `/`, shortcut aliases can flow through the same command dispatcher, and real text fields still keep keyboard ownership
94. 2026-03-18 21:20: Expanded the Lane `[4]` console roadmap summary with one explicit long-term command-language sentence, so the live roadmap now acknowledges that the app-wide `Console` should eventually navigate and act across workspace, graph, node, and feature domains instead of remaining only a shell/transcript surface
93. 2026-03-18 14:15: Marked `[3.2B] Sketch Operation Authoring` and `[3.2C] Extrude Foundation` complete in the live roadmap after the graph-native sketch authoring, main-viewport sketch rendering split, and first `Geometry/Extrude -> SolidBody` implementation landed, while keeping the parent `[3.2]` lane partial because `[3.2D] Loft Foundation` remains open
92. 2026-03-18 11:05: Added a compact top-level roadmap checklist grouped by lane so `roadmap.md` now has one quick scan surface that mirrors the numbered `###` phase entries below, and normalized `[5.0E]` to partial status so the new checklist matches the still-open lane body
91. 2026-03-18 10:36: Marked `[3.2A] Data Types And Sketch Foundation` complete in the live roadmap after the `Geometry/Sketch` shell, geometry port kinds, and in-app sketch-plane picker landed, and moved the parent `[3.2]` foundational geometry lane to partial status now that the first subphase is shipped while `[3.2B-D]` remain open
90. 2026-03-18 10:21: Expanded the `[3.2]` foundational geometry lane into real `###` roadmap subsections for `[3.2A]` through `[3.2D]`, so each geometry subphase now has its own foldable summary/checklist block instead of living only as inline labels under the parent lane
89. 2026-03-17 18:39: Re-opened the parent `[5.0]` cleanup family by adding a new `[5.0E]` pre-workspace standardization cut for the `Spaghetti Editor` surface model, so editor-view cleanup and viewport-type normalization have an explicit bridge phase before the deeper `[5.1]` workspace lane locks pane-hosting vocabulary and surface switching
88. 2026-03-17 18:28: Broadened the `[5.1]` workspace-family read so later browser `Pop-Out` is now a shared viewport/surface capability for the whole lane instead of sounding editor-only, renamed `[5.1E]` accordingly, and treated the shipped `Console` pop-out as the first proof of that later host mode
87. 2026-03-17 17:58: Marked `[5.0D]` complete after removing the old title-bar `Build Stats` drawer path, deleting dead shell/panel files and unowned output-list selectors, pruning the dead app-store `assembled` residue, moving the task doc to `Tasks/Old`, and closing the parent `[5.0]` cleanup family as fully shipped
86. 2026-03-17 17:09: Marked `[5.0C]` complete after removing the live app-level `legacy` input and `Parts / Assembled` viewer split from the store/viewer/build/runtime path, moved the task doc to `Tasks/Old`, and kept `[5.0D]` as the deferred residue-cleanup cut instead of stretching `5.0C` into the full final purge
85. 2026-03-17 16:45: Marked `[5.0B]` complete after removing `Parts List` and `Box Params` from the default AppShell left-dock stack, updated the parent `5.0` bridge-lane checklist to reflect the landed shell subtraction, and kept the remaining deeper legacy/input cleanup deferred to `[5.0C]` and `[5.0D]`
84. 2026-03-17 15:05: Marked `[5.1B]` complete after shipping the current split-pane authoring cut on top of the AppShell/Spaghetti split proof, updated the workspace-mode lane checklist to reflect landed divider authoring controls, and synced the subphase family status now that the task doc has moved to `Tasks/Old`
83. 2026-03-17 14:45: Added `[5.1E]` under `[5.1] Workspace Modes` as the explicit later home for multi-window `Spaghetti Editor` surfaces and detached/browser pop-out growth, keeping that work attached to the shared workspace-model family instead of renumbering the rest of Lane `[5]`
82. 2026-03-17 14:34: Marked `[5.0A]` complete in the roadmap after the runtime implementation landed, flipped the matching parent `[5.0]` checklist items for `spaghetti`-first startup and `Preview Mode` shell removal, and moved the parent lane itself to partial status now that the `5.0` cleanup family has begun shipping
81. 2026-03-17 14:28: Added `[5.0D]` as a deferred post-`5.0C` cleanup cut, so Lane `[5.0]` now has an explicit home for dead shell surfaces, stale panel-era files, and leftover viewer residue that should be classified later without blocking `[5.1] Workspace Modes`
80. 2026-03-17 13:28: Expanded `[5.0]` into real foldable roadmap subphases by adding dedicated `###` sections for `[5.0A]`, `[5.0B]`, and `[5.0C]`, so the pre-workspace cleanup lane now matches the structure used elsewhere instead of only listing a suggested subphase family inline
79. 2026-03-17 13:26: Expanded `[5.0]` into an explicit cleanup-family read by adding a recommended `[5.0A-C]` breakdown, separating `spaghetti`-by-default startup and visible shell cleanup from the later `legacy input-mode branch removal` code cleanup so the roadmap no longer treats hiding old UI and deleting old logic as one step
78. 2026-03-17 13:00: Added a new `[5.0] VR / SP - Pre-Workspace Shell Cleanup And Legacy Panel Reduction` bridge lane ahead of `[5.1]`, giving the immediate cleanup of `Preview Mode`, `Parts List`, and `Box Params` a real roadmap home before the broader workspace-mode system starts replacing shell layout behavior
77. 2026-03-17 12:40: Re-homed the broader workspace-layout family from `[5.3]` to `[5.1]`, shifted the old control-viz and build-control placeholders to `[5.2]` and `[5.3]`, and expanded the new `[5.1] VR / SP - Workspace Modes` lane body around the dedicated `05.1A` through `05.1D` future task-doc split while keeping the earlier shipped workspace-presentation groundwork visible as landed history instead of consuming the new execution slots
76. 2026-03-17 11:11: Refreshed the `[4.1]` roadmap row so it now matches the real shipped console state after `4.1A` and `4.1B`, marking the collapsed/expanded shell, layer transcript, tools, floating/pop-out/list modes, and shared styling work as landed while explicitly carrying the remaining command-routing, richer filtering, result UX, inspector bridge, and hotkey-customization work forward into later `4.1C+` subphases
75. 2026-03-17 00:41: Reworked the roadmap lane structure so the console/debug system now owns the new Lane `[4]` as a first-class cross-cutting workspace-feedback lane, and shifted the older deferred control/build/workspace systems out to the new Lane `[5]` so later build orchestration and packaging work no longer hide the pulled-forward console direction
74. 2026-03-17 00:41: Added `[2.4F]` under the `2.4` reference-workspace lane as the next future carry-forward for generalizing the shipped reference transform toolbar into a viewer-side transform session for any eligible `Content` object, so the broader content-transform idea now has a dedicated roadmap home instead of being stranded as an ad hoc follow-up to the reference-only toolbar
73. 2026-03-17 10:42: Added `[4.3E] VR / SP / DBG - Console And Layered Transcript` under the `Workspace Presentation Modes` lane so the new app-wide console concept now has a real roadmap home as a collapsed/expanded workspace presentation surface with command feedback, layered debug/event text, and central keyboard-routing direction instead of floating only as an architecture note
72. 2026-03-16 23:10: Shipped `[2.4E]` as the fifth completed reference-workspace cut, moving the new reference-transform timeline system out of future planning and into implemented history now that the toolbar supports per-value `Basic / Timeline` mode switching, speed sliders, editable curve graphs, cycle modes, and runtime evaluation across reference transform channels
71. 2026-03-16 22:47: Added `[2.4E]` under the `2.4` reference-workspace lane as the next future carry-forward for timeline-driven reference transform values, so the new `Basic / Timeline` right-click mode idea, per-value speed slider, curve graph, and cycle modes now have a real roadmap home instead of living only in ad hoc chat notes
70. 2026-03-16 20:11: Expanded `[3.2] Foundational Geometry Node System` into explicit sub-phase checklist blocks for `[3.2A]` through `[3.2D]`, so the roadmap now records the intended acceptance shape for `Data Types / Sketch Foundation`, `Sketch Operation Authoring`, `Extrude Foundation`, and `Loft Foundation` instead of only listing the labels plus one combined checklist
69. 2026-03-16 18:07: Reworked Lane `[3]` so the new foundational geometry-authoring cluster now has its own `[3.2]` roadmap home between generic node cleanup and later wire/driver/part/feature hardening, adding a dedicated `SP / NI / FS / GE` sub-lane for `Data Types`, `Sketch`, `Extrude`, and `Loft` and shifting the later Lane `[3]` numbering down by one
68. 2026-03-16 14:53: Expanded `[4.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control` with explicit selective-build notes so the roadmap now says unaffected sibling published rows must stay clean/cached when another object changes, `Content` rebuild bars must come from runtime chunk truth instead of graph-level fallback state, and first-build versus stale-after-change must be distinguished in later build-state rules
67. 2026-03-16 14:31: Implemented and closed `[2.1F] VR / SP - Graph Documents Child Sections`, replacing the old raw graph child publish-entry list with `Needs Rebuild` plus `Nodes`, making `Needs Rebuild` object-based and filtered to produced stale/unresolved rows, wiring graph-child click back to authoring reveal, and marking the follow-up complete in the roadmap
66. 2026-03-16 14:13: Added the new `[2.1F] VR / SP - Graph Documents Child Sections` follow-up under Lane `[2.1]`, giving the post-`2.3` `Graph Documents` cleanup a real roadmap home for the later `Needs Rebuild` plus `Nodes` split instead of incorrectly pushing that work into `[2.4]` reference-assets scope
65. 2026-03-16 13:35: Closed `[2.3]` after the real Phase 6 implementation shipped, marking the published `Content` build/control lane complete now that content rows rebuild on click, graph rows stay document-oriented, parent and object build bars exist in the Browser, inline content policy chips default to `Live`, and secondary `View In Graph` traceability is wired without collapsing `Content` back into graph-row language
64. 2026-03-16 13:17: Promoted `02.3` into the active execution-spec stage by refreshing the `[2.3]` lane wording to match the locked `AS - Phase 6` answers, replacing the stale lighter-`Object` wording with the real-object/slimmer-bar rule and clarifying that primary `Content` row click means `Select + Rebuild` while `Graph Documents` stays intentionally simple
63. 2026-03-16 11:25: Reworked the roadmap lane structure against the newer vision roadmap, renaming Lane `[1]` around graph-native ownership, re-scoping Lane `[2]` around `Graph Documents` versus `Content`, adding a new authoring-hardening Lane `[3]`, and pushing the later build/control/workspace placeholder systems into Lane `[4]` so the execution roadmap no longer hides the missing post-workspace authoring lane
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

## Quick Checklist

This is the one-glance checklist view.

It mirrors the numbered `###` roadmap entries below without replacing the detailed lane bodies.

Status legend:
- `[x]` shipped
- `[~]` active / partial
- `[ ]` not started

### Lane [1] - `Graph-Native Foundation And Ownership`

- [x] `[1.1]` `Graph Document Foundations`
- [x] `[1.2]` `Graph Persistence And Save Load`
- [x] `[1.3]` `Graph Aware Worker And Preview Routing`
- [x] `[1.4]` `Multi-Document Graph Ownership`
- [x] `[1.5]` `Graphs Panel And Nested Parts`
- [x] `[1.6]` `Shared Viewport Composition`

### Lane [2] - `Browser Workspace And Project Content Structure`

- [~] `[2.1]` `Browser Workspace Shell And Item Interaction`
- [x] `[2.1A]` `Browser Workspace Shell And Row Interaction`
- [x] `[2.1B]` `Browser, Editor, And Shared Viewer Coordination`
- [x] `[2.1C]` `Browser Row Action Cleanup And Context Menus`
- [~] `[2.1D]` `Spaghetti Floating Window Controls And View Modes`
- [~] `[2.1E]` `Dockable Left Panels And In-App Floating Panel Shell`
- [x] `[2.1F]` `Graph Documents Child Sections`
- [x] `[2.2]` `Browser-Facing Graph Output Structure`
- [x] `[2.3]` `Project Content Inspection And Build Control Surface`
- [x] `[2.4]` `Reference Asset Workspace And Project View Layers`
- [ ] `[2.5]` `Browser Controls, Materials, And Rich Visibility`

### Lane [3] - `Node, Wire, Driver, Part, And Feature Authoring Hardening`

- [ ] `[3.1]` `Node System Cleanup And Growth`
- [~] `[3.2]` `Foundational Geometry Node System`
- [x] `[3.2A]` `Data Types And Sketch Foundation`
- [x] `[3.2B]` `Sketch Operation Authoring`
- [x] `[3.2B-S1]` `Sketch Session Hierarchy Model`
- [x] `[3.2B-S2]` `SketchPlane Session Cleanup`
- [x] `[3.2B-S3]` `SketchDraw Session Cleanup`
- [x] `[3.2B-S4]` `Sketch Return One Level`
- [ ] `[3.2B-S5]` `Sketch Toolbar / Console Command Alignment`
- [x] `[3.2C]` `Extrude Foundation`
- [ ] `[3.2D]` `Loft Foundation`
- [ ] `[3.3]` `Wire UX And Flow Readability`
- [ ] `[3.4]` `Driver And Param System Expansion`
- [ ] `[3.5]` `Part Node Hardening`
- [ ] `[3.6]` `Feature Stack Growth`

### Lane [4] - `Console, Debug, And Workspace Feedback`

- [~] `[4.1]` `Console And Layered Transcript`
- [x] `[4.1A]` `Console Shell And Transcript Core`
- [x] `[4.1B]` `Console Floating And Pop-Out Modes`
- [x] `[4.1C]` `Command Input And Keyboard Routing`
- [x] `[4.1D]` `Layered Event Feeds And Filtering`
- [ ] `[4.1E]` `Command Results, Errors, And Follow-Up UX`
- [ ] `[4.1F]` `Debug Inspector Bridge And Richer Later Diagnostics`
- [ ] `[4.1G]` `Hotkey Customization And Shortcut Profiles`
- [x] `[4.1H]` `Hybrid Command Capture And Shortcut Unification`
- [~] `[4.1I]` `Staged Scoped Command Navigation`
- [x] `[4.1I1]` `Staged Grammar Core`
- [x] `[4.1I2]` `Console Session Integration`
- [x] `[4.1I3]` `First Executable Vertical Slice`
- [x] `[4.1I4]` `Missing-Branch Recovery And Node Creation`
- [ ] `[4.1I5]` `Robustness And Prompt Quality`
- [x] `[4.1J]` `Input Ownership And Coordination Cleanup`
- [x] `[4.1J1]` `Input Ownership Audit`
- [x] `[4.1J2]` `Shared Input Routing Seam`
- [x] `[4.1J3]` `Session Migration`
- [x] `[4.1J4]` `Cleanup And Hardening`
- [x] `[4.1K]` `Surface-Driven Console Context Sync`
- [x] `[4.1L]` `Command Transcript Sublayers`
- [x] `[4.1M]` `Staged Choice Prefill And Arrow Cycling`
- [x] `[4.1N]` `Feature Session Prompt Descriptors`

### Lane [5] - `Control, Build, And Workspace Systems`

- [~] `[5.0]` `Pre-Workspace Shell Cleanup And Legacy Panel Reduction`
- [x] `[5.0A]` `Spaghetti Default Startup And Preview-Mode Shell Removal`
- [x] `[5.0B]` `Legacy Left-Dock Panel Reduction`
- [x] `[5.0C]` `Legacy Input-Mode Branch Removal`
- [x] `[5.0D]` `Deferred Legacy Residue And Dead-Surface Cleanup`
- [~] `[5.0E]` `Spaghetti Editor Surface Standardization And Viewport-Type Cleanup`
- [~] `[5.1]` `Workspace Modes`
- [ ] `[5.2]` `Control Viz And Graph-Driven Control Surfaces`
- [ ] `[5.3]` `Build Sequencing, Build Bars, And Output Build Control`
- [ ] `[5.4]` `Advanced Output Types And Later Project Packaging`
- [ ] `[5.5]` `Publish / Receive Execution`
- [ ] `[5.6]` `Final Legacy Phase-Out And Compatibility Cleanup`


# [1] `Graph-Native Foundation And Ownership`

Summary:
- Turn the old hybrid single-graph app into an explicit graph-document, project, and Browser-ready foundation before deeper workspace or authoring growth goes further.
- This lane establishes the graph/document/project ownership model that later output publication, Browser content, and worker/runtime truth will depend on.

### Lane Header 
#### Fold Hack 4
##### Fold Hack 5

Purpose:
- turn the old single-graph editor into the right graph/project foundation for the future `Browser`
- establish graph/document/project ownership before broad workspace or authoring polish goes further
- clean the current editor only where that cleanup helps the ownership transition

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
- that cleanup should stay in service of graph/project/browser ownership readiness
- this is the lane where file / graph / Browser ownership becomes real enough to guide later work

Expected outcome:
- the app is no longer organized around one hidden active graph
- the Browser direction is real enough to plan against
- later `AS` output work can attach to the correct ownership structure
- the spaghetti editor is treated as one or more Browser-coordinated viewports into graph documents rather than one app-wide mode/panel

## Lane [1] Body - `Graph-Native Foundation And Ownership`

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
- `Lane [2]` / `Lane [5]`
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
    - later `[5.3] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
  - materials and richer visibility controls
    - `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`
  - broader workspace presentation polish
    - `[5.1] VR / SP - Workspace Modes`

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
- It intentionally did not try to finish the richer Browser workspace, final output hierarchy, build-control systems, authoring hardening, or final cleanup work.
- Use this list as the explicit handoff from Lane `[1]` into the next lanes.

Deferred out of Lane `[1]` into Lane `[2]`:
- richer Browser row interaction, reveal behavior, and Browser-to-editor / Browser-to-viewer coordination polish
  - `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`
- deeper Browser-facing output/content structure beyond one thin published graph-output row level
  - `[2.2] AS - Phase 5 - Browser-Facing Graph Output Structure`
- published-content row meaning, build-status rows, row-level policy surfaces, and first honest Browser build-control surfaces
  - `[2.3] AS - Phase 6 - Project Content Inspection And Build Control Surface`
- external reference-asset workspace layers kept outside first-pass `Project File` ownership
  - `[2.4] VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- per-row visibility, materials, selectability, context-menu actions, and richer Browser controls
  - `[2.5] VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

Deferred out of Lane `[1]` into Lane `[3]`:
- node-system cleanup, wire readability, driver/value growth, part-node hardening, and feature-stack growth
  - `[3] Node, Wire, Driver, Part, And Feature Authoring Hardening`

Deferred out of Lane `[1]` into Lane `[5]`:
- broader workspace modes, pane-based hybrid layout, and later panel/tool layout cleanup
  - `[5.1] VR / SP - Workspace Modes`
- graph-driven control-viz and Jake/control-surface convergence
  - `[5.2] DR / JK - Control Viz And Graph-Driven Control Surfaces`
- staged build sequencing, truthful per-output build bars, and the eventual graph-native worker contract
  - `[5.3] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
- advanced output types and later project packaging/export behavior
  - `[5.4] AS / VR - Advanced Output Types And Later Project Packaging`
- full `Publish / Receive` execution behavior above the shipped ownership rules from `12C`
  - `[5.5] GE / SP / AS - Publish / Receive Execution`
- final removal of the remaining legacy compatibility path after the graph-native workspace fully replaces it
  - `[5.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`

Plain-English rule:
- Lane `[1]` made the app structurally honest.
- Lane `[2]` should make that structure usable as a Browser/project workspace.
- Lane `[3]` should make graph authoring strong enough to deserve that workspace.
- Lane `[4]` should add the deeper build/runtime, control-surface, packaging, execution, and cleanup systems on top.

# [2] `Browser Workspace And Project Content Structure`


Summary:
- Turn the new ownership model into a usable Browser/project workspace with visible `Graph Documents`, published `Content`, and clearer project-content structure.
- This lane owns the split between authoring/document rows and published build-chunk rows before the later runtime/build-contract lane makes every lower-level chunk fully honest.

### Lane Header
#### Fold Hack 4

Purpose:
- take the work explicitly deferred out of `GE - Phase 12` and turn it into real Browser-facing project/content features
- expand from ownership definitions into usable project navigation, output publication, `Graph Documents` versus `Content`, and later reference/visibility behavior

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

## Lane [2] Body - `Browser/project workspace and content structure`

### [2.1] [~] - `VR / SP` - `Browser Workspace Shell And Item Interaction`

##### Summary

Summary:
- split the first Browser workspace expansion wave into:
  - one `VR`-leaning Browser row/workspace shell cut
  - one `SP / VR` coordination cut for Browser, editor, and shared-viewer behavior
- one `VR / SP` cleanup cut for turning the current row-action-heavy Browser into a calmer tree-first workspace surface
- one `VR / SP` shell/window-state cut for making the floating `Spaghetti Editor` header behave like a real editor window with in-app minimize/maximize/close controls, now partially landed as the active Spaghetti shell and toolbar cleanup wave
- one `VR / SP` shared left-dock shell cut for letting `Browser` and the docked `meatball editor` use the same in-app docked/floating/ghost-preview movement system
- one `VR / SP` graph-documents child-section cut for giving graph rows a later `Needs Rebuild` plus `Nodes` expansion shape without collapsing them back into published `Content`
- keep all five cuts anchored to the finished Lane `[1]` ownership model instead of re-fighting graph/project truth

CheckList:
- [x] land `[2.1A]` as the first Browser workspace shell and row-interaction cut
- [x] land `[2.1B]` as the first Browser/editor/shared-viewer coordination cut
- [x] land `[2.1C]` as the Browser row-action cleanup and context-menu cut
- [~] land `[2.1D]` as the Spaghetti floating window-controls and view-mode cut
- [~] land `[2.1E]` as the shared dockable left-panel shell cut for `Browser` and `meatball editor`
- [x] land `[2.1F]` as the later `Graph Documents` child-section split for `Needs Rebuild` and `Nodes`
- [x] keep Browser interaction state separate from graph/project ownership truth
- [x] keep Browser selection separate from editor focus and shared-composition membership
- [ ] leave only the non-blocking shell/polish tail here and keep the next real work moving into `[2.2]` / `[2.3]`

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

### [2.1F] [x] - `VR / SP` - `Graph Documents Child Sections`

##### Summary

Summary:
- give `Graph Documents` a later child-section shape that is more useful than the current raw publish-entry list without collapsing graph rows into a second `Content` tree
- keep graph rows as the authoring/document surface, but let them later expand into two clearly different child sections:
  - `Needs Rebuild`
  - `Nodes`
- keep this as Browser/graph-documents behavior, not as a rewrite of the completed `[2.3]` `Content` build-control surface

CheckList:
- [x] add a `Needs Rebuild` child section under each graph document
- [x] keep `Needs Rebuild` first and normally open
- [x] show only produced graph-owned published objects/outputs that currently need rebuild
- [x] hide empty/non-producing rows such as `s002`
- [x] remove rows from `Needs Rebuild` once they are rebuilt and clean
- [x] add a `Nodes` child section under each graph document
- [x] keep `Nodes` second and normally closed
- [x] let `Nodes` act as the authored node inventory for the current graph canvas
- [x] avoid mixing authored node inventory and pending rebuild work into one flat child list
- [x] keep this graph-side expansion separate from the published `Content` hierarchy

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

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

### [2.2] [x] - `AS` - Phase 5 - `Browser-Facing Graph Output Structure`

##### Summary

Summary:
- turn graph output handoff into a clearer Browser-facing content structure with a real split between `Graph Documents` and published `Content`
- keep graph-owned authored publication metadata separate from project-owned assembly/content placement
- make the first honest content hierarchy conditional:
  - singleton `Assembly -> Object`
  - multi-object `Assembly -> Component -> Object`
- leave `Part` for the later lane that can make it a truthful independent build chunk
- shipped through closeout:
  - the graph-owned publish seam, project lift, and Browser tree now tell the same singleton-collapse truth
  - later row policy/build bars stay in `[2.3]`

Sub-phase labels for the current closeout split:
- `[2.2A] [x] - First shipped Browser-facing content structure cut`
- `[2.2B] [x] - Graph-owned publish seam cleanup and final closeout proof`

CheckList:
- [x] evolve `OutputPreview` from a slot-only seam into a structured publish payload
- [x] map graph-authored publish declarations into Browser-visible project content without inferring structure from final meshes alone
- [x] define the first-pass published hierarchy as:
  - singleton `Assembly -> Object`
  - multi-object `Assembly -> Component -> Object`
- [x] keep singleton publish groups object-native and only create real `Component` rows when a publish group has two or more objects
- [x] preserve `objectId` when a singleton publish group later becomes multi-object and gains a new parent `componentId`
- [x] let multiple separate singleton publish groups from one graph document lift as separate direct object rows under the root assembly
- [x] keep stable published ids explicit:
  - `assemblyId`
  - conditional `componentId`
  - `objectId`
  - later `partId`
- [x] keep root/sub assembly differences in hierarchy relationships instead of creating different id kinds
- [x] defer full `Part` rows until the publish contract and worker/runtime can represent them honestly
- [x] replace the older flat legacy parts-list mental model with the real project-content hierarchy once that structure exists

Closeout CheckList For `[2.2] -> [x]`:
- [x] make the graph-owned publish seam tell the same singleton-versus-grouped truth as the project/browser lift instead of always reading as a published-component surface
- [x] tighten the authored `OutputPreview` seam so the structured publish payload reads as the canonical Phase 5 publish contract, not just a compatibility bridge
- [x] verify the remaining `02.2` acceptance claims end-to-end at the graph seam, project lift, and Browser read-model layers
- [x] add/adjust direct tests around the graph-owned publish seam so the final `02.2` closeout truth is covered above the app-store lift
- [x] after the closeout pass, flip `[2.2]` from `[~]` to `[x]` and keep later row policy/build bars in `[2.3]`

Likely Files:
- `src/app/spaghetti/selectors/`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`

### [2.3] [x] - `AS` - Phase 6 - `Project Content Inspection And Build Control Surface`

##### Summary

  Summary:
  - turn published `Content` into the first honest build-surface model without collapsing it back into `Graph Documents`
  - keep `Graph Documents` as the authoring/document surface while `Content` becomes the published-entity execution and policy surface
  - this is the later home for the first real `Assembly` / `Component` / `Object` row meaning after `11B` only established simple dirty/saved cached-entry state
  - shipped through closeout:
    - content rows now own `Select + Rebuild`, Browser-facing build bars, inline policy chips, and calmer secondary source-trace actions
    - graph rows stay simple and document-oriented instead of inheriting published build-control behavior

  Sub-phase labels for the shipped cleanup wave:
  - `[2.3A] [x] - Graph-row one-line policy/status groundwork`
  - `[2.3B] [x] - Graph-row save/export split and runtime-owned build freshness`
  - `[2.3C] [x] - Published content row interaction model and `Graph Documents` versus `Content` split`
  - `[2.3D] [x] - First dominant parent bars and slimmer real `Object` bars`
  - `[2.3E] [x] - Row policy versus view-control separation and calmer source-trace language`

Carry-forward note:
- `11B`
  - Browser cached graph rows may show simple `dirty/saved` state
- `[1.5]`
  - the first Browser hierarchy pass should not try to finish build bars or richer build-status rows
- `[2.3]`
  - this is where published `Content` rows should gain real row meaning, policy surfaces, and first honest build/loading bars
  - keep those rows separate from graph-document save/export/readiness UI
  - treat those bars as published build/runtime inspection UI, not cached-graph lifecycle UI

  CheckList:
  - [x] make `Content` read as published project structure instead of a second graph list
  - [x] keep `Graph Documents` as the authoring/document surface and `Content` as the published build-chunk surface
  - [x] make primary row click on `Content` mean `Select + Rebuild` for that published row/branch
  - [x] move graph/source traceability into secondary actions such as `view in graph` and right-click instead of primary row text
  - [x] show assembly/component/object build state in the Browser
  - [x] prepare first graph-row build bars and build-status surfaces without pulling them back into `11B`
  - [x] carry richer Browser row loading/build bars into a Browser/build-control lane instead of keeping them inside cached-graph lifecycle semantics
  - [x] separate graph-row save/export state from graph-row build/runtime state
  - [x] make `Assembly` and `Component` the first dominant bar rows while giving `Object` a real but slimmer bar
  - [x] keep row policy controls separate from viewer/material/presentation controls
  - [x] default published content rows to `Live` on load as the target model
  - [x] place the first build-policy control on published `Content` rows as an inline row chip
  - [x] leave room for parent-driven policy, mixed child state, and later `SEQ / ALL` execution mode
  - [x] separate build controls from view controls in the Browser
  - [x] keep `generate/build on-off` separate from `view on-off`
  - [x] leave room for later item actions like isolate, rename, and export

Likely Files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/BuildStatsDrawer.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/buildStatsKeys.ts`

### [2.4] [x] - `VR` - Phase 5 - `Reference Asset Workspace And Project View Layers`

##### Summary

Summary:
- bring reference assets back into the viewer/Browser workspace as clearly separate non-project-owned context layers

CheckList:
- [x] add Browser/viewer sections for external reference assets
- [x] keep references outside `Project File` ownership in the first pass
- [x] support `.obj`, `.glb`, and `.stl` reference loading as workspace context
- [x] add basic project-versus-reference visibility separation
- [x] keep the first shipped cut as static-manifest reference workspace support before later import-system growth
- [x] leave `.step` reference loading as a later follow-up inside `[2.4]`, not a hidden out-of-scope orphan
- [x] leave user-added reference import from disk as a later follow-up inside `[2.4]`, not a separate forgotten system
- [x] leave reference transform controls as a later follow-up inside `[2.4]`, with a right-click `Transform Object` entrypoint and a floating transform toolbar instead of burying that work inside import flow

Later follow-up shape inside `[2.4]`:
- `[2.4A]` static-manifest reference workspace
  - first Browser `References` subtree
  - static checked-in manifest
  - lazy load on first toggle
  - blue/gray viewer-state rows
- `[2.4B]` expanded reference file support
  - add `.step` reference loading
  - deepen loader coverage and error handling for more real-world reference assets
- `[2.4C]` user reference import from disk
  - let users bring in their own reference models
  - first as workspace/viewer imports rather than project-owned content
  - later persistence/project-management decisions can stay separate if needed
- `[2.4D]` reference transform controls
  - right-click reference rows to enter `Transform Object`
  - show a floating transform toolbar on screen
  - first toolbar actions: `Move`, `Rotate`, `Scale`, `Reset Transform`
  - keep this separate from the first user-import flow
- `[2.4E]` reference transform timelines
  - shipped the first per-value `Basic / Timeline` mode inside the reference transform toolbar
  - timeline mode now expands that value into a boxed section with a `Speed` slider and editable motion graph
  - shipped first cycle modes: `Left to Right`, `Bounce`, and `Right to Left`
  - keeps animated value behavior separate from the shipped manual-only `02.4D` control surface
- `[2.4F]` general content transform toolbar
  - generalize the shipped reference transform toolbar into a viewer-side transform session for any eligible `Content` object
  - keep this viewer/runtime-owned and separate from Replicad/source-authoring transforms
  - likely becomes the lane where Browser-selected `m / r / s` can open the shared transform session outside the reference-only flow

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

# [3] `Node, Wire, Driver, Part, And Feature Authoring Hardening`

Summary:
- make the graph editor itself strong enough to act like a real authoring tool instead of only a structurally honest shell
- keep this lane visible now that the newer vision split made it clear the execution roadmap was missing the post-workspace authoring hardening lane

### Lane Header
#### Fold Hack 4

Purpose:
- harden the graph authoring system after the ownership/workspace foundations are honest
- improve node, wire, driver, part, and feature-stack surfaces without pushing those concerns into the Browser/content lanes
- keep generic node/editor behavior in the node system instead of solving authoring problems through one-off workspace chrome

Primary phase families:
- `NI`
- `DR`
- `PT`
- `FS`

Expected outcome:
- the roadmap keeps room for the systems that make ParaHook a stronger authoring environment:
  - clearer node families
  - more legible wire flow
  - richer driver/value systems
  - stronger part-node contracts
  - a deeper feature-stack authoring surface

## Lane [3] Body - `authoring-system hardening`

### [3.1] [ ] - `NI` - Phase 6 - `Node System Cleanup And Growth`

##### Summary

Summary:
- later lane for clearer node families, stronger generic node rendering rules, and a better spawn/palette model that does not depend on one-off panel behavior

CheckList:
- [ ] clarify node-family boundaries and intended registry ownership
- [ ] improve palette/spawn ergonomics without hard-coding product-specific paths
- [ ] strengthen generic node rendering contracts so future node growth does not require one-off UI branches

### [3.2] [~] - `SP / NI / FS / GE` - `Foundational Geometry Node System`

##### Summary

Summary:
- give the first real geometry-authoring nodes a dedicated roadmap home instead of burying them under generic node cleanup or much later feature-stack growth
- turn the current architecture work in `Spaghetti-Types.md` into an explicit staged lane slice for:
  - `Data Types`
  - `Sketch`
  - `Extrude`
  - `Loft`
- keep this cluster ahead of the broader wire/driver/part/feature hardening work because it defines the first honest graph-native geometry-authoring contract

CheckList:
- [ ] keep `[3.2A]` through `[3.2D]` as the staged execution split for the first graph-native geometry path
- [ ] keep `Sketch`, `Extrude`, and `Loft` user-facing and mode-based instead of collapsing back into hidden helper seams
- [ ] land the foundational geometry path ahead of the broader wire/driver/part/feature hardening wave

### [3.2A] [x] - `Data Types And Sketch Foundation`

Summary:
- lock the minimum honest geometry type language needed to support the first real authored-node path
- ship the first real `Sketch` node shell with honest top-level inputs and outputs
- keep this phase focused on the type vocabulary plus the `Sketch` seam, not deep sketch authoring breadth yet

CheckList:
- [x] lock the minimum honest geometry type language needed to support the first real authored-node path
- [x] explicitly lock the first real graph data types needed for geometry authoring:
  - `[Float]`
  - `[Boolean]`
  - `[Enum]`
  - `[Vec2]`
  - `[Vec3]`
  - `[Transform2D]`
  - `[Plane]`
  - `[SketchCurve]`
  - `[SketchCurves]`
  - `[SketchProfiles]`
  - `[SketchProfile]`
  - `[SolidBody]`
- [x] ship the first real `Sketch` node shell with honest top-level inputs and outputs
- [x] keep this phase focused on the type vocabulary plus the `Sketch` seam, not deep sketch authoring breadth yet

### [3.2B] [x] - `Sketch Operation Authoring`
#### FoldHack 4
Summary:
- ship the first real sketch operation flow inside the `Sketch` system
- make the first sketch-operation set sufficient to produce one honest selected closed profile for downstream body features
- leave wider sketch-command parity, constraint solving, and full builder polish out of the first pass

CheckList:
- [x] ship the first real sketch operation flow inside the `Sketch` system:
  - `Line`
  - `Arc3Point`
  - `BezierSpline`
  - `CloseProfile`
  - `ProfileSelect`
- [x] make the first sketch-operation set sufficient to produce one honest selected closed profile for downstream body features
- [x] leave wider sketch-command parity, constraint solving, and full builder polish out of the first pass

#### [x] `3.2B-SketchPlane-1` - `Source And Transform Surface`

Summary:
- turn `SketchPlane` into a real authored setup surface instead of a thin plane row
- give the sketch a clear `Source + Transform` seam before deeper viewport-driven setup and drawing flows
- keep this first cut row-owned and parameter-surface-driven

CheckList:
- [x] ship the first honest `SketchPlane` source/setup row
- [x] support richer `Source + Transform` controls in the sketch node surface
- [x] keep the first pass honest around authored setup values without dragging geometry-derived picking in yet

#### [~] `3.2B-SketchPlane-2` - `Viewport-First Source Pick And Sketch Origin Gizmo`

Summary:
- move sketch-plane setup into a real viewport-first source-pick flow
- use the main model viewport for origin-plane selection, ghost planes, and the sketch-origin gizmo
- keep this origin-plane-focused while the cleanup work makes the first real viewport flow fully honest

CheckList:
- [x] replace the older overlay-style plane picker with a real viewport-first source-pick session
- [x] collapse the spaghetti editor out of the way during active sketch-plane placement
- [x] ship the first real origin-plane pick plus move/rotate gizmo loop
- [~] finish the follow-on cleanup so the main viewport, toolbar chrome, and viewer-owned helper behavior all read as one honest interaction surface
- [ ] keep geometry-driven face/edge setup deferred to the next sketch-plane cut

#### [ ] `3.2B-SketchPlane-3` - `Geometry-Driven Auto-Setup And Selection Highlighting`

Summary:
- extend sketch-plane setup beyond origin planes into geometry-driven placement
- let planar model faces and later valid sketch-derived geometry help define plane placement and orientation
- add the viewer-side hover/selection/highlight rules that make those picks understandable

CheckList:
- [ ] allow first useful geometry-driven sketch-plane setup beyond `XY / XZ / YZ`
- [ ] infer sketch-plane placement/orientation from selected planar geometry
- [ ] add clear hover, active, and committed source-highlighting feedback
- [ ] keep this as a sketch-plane/source family step rather than pushing it into later Browser or workspace lanes

#### [ ] `3.2B-DrawSketch-1` - `Viewer-Owned Live Draw Preview`

Summary:
- move the first honest `Draw Sketch` interaction into the real Three model viewport instead of treating the floating toolbar as the drawing surface
- keep the toolbar as the control surface while the viewer owns hover preview, point capture, and temporary draw geometry
- start with the smallest honest viewport-draw set:
  - `Line`
  - `Rectangle`
  - `Circle`

CheckList:
- [ ] let `SketchDraw -> Draw` open a real viewer-owned draw session
- [ ] render temporary active-tool preview directly in the Three viewport
- [ ] let viewport point picks drive the first committed sketch entities
- [ ] keep the floating `Draw Sketch` toolbar as the session-control surface, not the canvas

#### [ ] `3.2B-DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

Summary:
- turn viewport drawing into real multi-step tool sessions instead of one-click point drops
- keep temporary entity state session-local until the current tool step is accepted cleanly
- make commit/cancel behavior honest before taking on richer editing breadth

CheckList:
- [ ] add explicit multi-step progression for the first viewport draw tools
- [ ] keep live draft geometry temporary until the current entity is accepted
- [ ] define clean accept/cancel behavior for in-progress draw sessions
- [ ] extend the viewport draw flow to:
  - `Arc3Point`
  - `BezierSpline`

#### [ ] `3.2B-DrawSketch-3` - `Selection, Editing, And Richer Sketch Feedback`

Summary:
- deepen `Draw Sketch` from raw placement into a fuller sketch authoring surface
- add viewport-side entity selection, editing, and richer sketch feedback states
- keep this attached to the sketch authoring family instead of pushing it into later Browser or workspace lanes

CheckList:
- [ ] add viewport hover/selected/active feedback for sketch entities
- [ ] allow editing existing sketch entities from the real viewport
- [ ] add richer snapping/inference aids for sketch drawing
- [ ] keep committed sketch components graph/store-owned while temporary interaction remains viewer-owned

#### [x] `[3.2B-S1]` - `Sketch Session Hierarchy Model`

Summary:
- define the selected sketch node as the stable parent scope for sketch-local sessions
- make `SketchPlane` and `SketchDraw` read as explicit child session levels instead of detached one-off modes
- lock the named hierarchy so later `Esc`, prompt, and toolbar/console cleanup work can target stable levels

CheckList:
- [x] keep the selected sketch node as the stable parent scope
- [x] define `SketchPlane` as `Plane Selection -> Adjust`
- [x] define `SketchDraw` as `Session Idle -> Tool Selected -> Draft Active`
- [x] remove the fake default-tool assumption for representing an open draw session

#### [x] `[3.2B-S2]` - `SketchPlane Session Cleanup`

Summary:
- clean up `SketchPlane` so it reads like one session with two depths
- keep plane selection, adjust, cancel, and console prompt behavior aligned across the store, overlay, and console
- preserve camera-adjust compatibility while the active sketch-plane command surface stays alive

CheckList:
- [x] enter `SketchPlane` at `Plane Selection`
- [x] let `XY / XZ / YZ` advance into `Adjust`
- [x] let `Esc` from `Adjust` return to `Plane Selection`
- [x] keep cancel from `Plane Selection` restoring the selected sketch-node scope

#### [x] `[3.2B-S3]` - `SketchDraw Session Cleanup`

Summary:
- clean up `SketchDraw` so the console and overlay describe the explicit idle/tool/draft hierarchy honestly
- keep `SketchDraw` durable instead of falling out of the session on extra `Esc`
- preserve explicit exit on `x` or the close button

CheckList:
- [x] enter `SketchDraw` at `Session Idle`
- [x] print an idle-session prompt instead of `Sketch Draw started`
- [x] let `Esc` step back `Draft Active -> Tool Selected -> Session Idle`
- [x] keep idle `Esc` inside `SketchDraw`

#### [x] `[3.2B-S4]` - `Sketch Return One Level`

Summary:
- unify one-level return behavior across sketch surfaces instead of continuing to hand-code unrelated `Esc` branches
- make `Esc`, visible `Back`, and toolbar back/cancel actions call the same underlying one-level-return behavior where appropriate
- keep full close/exit actions like `X` distinct from one-level return

CheckList:
- [x] expose one shared sketch-local return-one-level seam
- [x] route keyboard `Esc` through that seam
- [x] route console `Back` through that seam
- [x] route toolbar back/cancel actions through that seam when they mean one-level return

#### [ ] `[3.2B-S5]` - `Sketch Toolbar / Console Command Alignment`

Summary:
- make the sketch toolbar hierarchy, console command hierarchy, and sketch session hierarchy describe the same structure
- keep toolbar sections as visible command groups instead of letting toolbar clicks and console tokens grow separate behavior
- reuse the same sketch-session verbs underneath both surfaces

CheckList:
- [ ] map toolbar parent surfaces like `Sketch Plane` and `Sketch Draw` to command scopes
- [ ] map toolbar sections to command groups
- [ ] map toolbar actions and console tokens to the same underlying sketch-session verbs
- [ ] keep toolbar and console prompt/state reads aligned with the active sketch session level

### [3.2C] [x] - `Extrude Foundation`

Summary:
- prove the first body-producing authored-node path:
  - `Sketch -> Extrude -> SolidBody`
- ship the first real `Extrude` node as a user-facing mode-based surface rather than a low-level helper wrapper
- keep the first shipped `Extrude` contract small and honest around profile input plus the minimum distance/direction-style controls

CheckList:
- [x] prove the first body-producing authored-node path:
  - `Sketch -> Extrude -> SolidBody`
- [x] ship the first real `Extrude` node as a user-facing mode-based surface rather than a low-level helper wrapper
- [x] keep the first shipped `Extrude` contract small and honest around profile input plus the minimum distance/direction-style controls
- [x] avoid dragging later feature-stack, boolean, shell, or manufacturing semantics into this first extrusion cut

### [3.2D] [ ] - `Loft Foundation`

Summary:
- add `Loft` as the next real profile-based body feature after extrusion
- keep the first `Loft` surface mode-based and user-facing rather than exposing low-level engine helper outputs directly
- start with the smallest honest `StartProfile / EndProfile -> SolidBody` contract before taking on richer rails, intermediates, or advanced continuity controls

CheckList:
- [ ] add `Loft` as the next real profile-based body feature after extrusion
- [ ] keep the first `Loft` surface mode-based and user-facing rather than exposing low-level engine helper outputs directly
- [ ] start with the smallest honest `StartProfile / EndProfile -> SolidBody` contract before taking on richer rails, intermediates, or advanced continuity controls
- [ ] use this phase to prove ParaHook can support the next more organic profile-to-body step after prismatic extrusion

### [3.3] [ ] - `NI` - Phase 7 / 8 - `Wire UX And Flow Readability`

##### Summary

Summary:
- later lane for making wire flow easier to read and debug once the ownership/workspace foundation is in place

CheckList:
- [ ] improve wire rendering readability
- [ ] improve validation readability around broken or mismatched flows
- [ ] decide whether active-path or read-flow overlays help enough to earn a permanent place

### [3.4] [ ] - `DR` - Phase 13 / 14 / 16 - `Driver And Param System Expansion`

##### Summary

Summary:
- later lane for richer driver/value flow, grouped param systems, and stronger downstream control contracts

CheckList:
- [ ] strengthen driver contracts above today’s narrower value-flow seams
- [ ] add richer param-node capability where the current graph still feels too shell-like
- [ ] leave room for grouped and equation-ready value flow later

### [3.5] [ ] - `PT` - Phase TBD - `Part Node Hardening`

##### Summary

Summary:
- later lane for making the `Part` node a stronger host contract instead of leaving it as a thin transitional wrapper

CheckList:
- [ ] strengthen part definition and metadata seams
- [ ] keep presets and part type as separate layers instead of one fused identity
- [ ] improve part-facing inputs/outputs without hard-coding product-specific assumptions

### [3.6] [ ] - `FS` - Phase TBD - `Feature Stack Growth`

##### Summary

Summary:
- later lane for adding more feature operations and making feature-stack authoring feel more trustworthy as a real CAD authoring surface

CheckList:
- [ ] expand feature operations beyond the current thin stack
- [ ] improve feature diagnostics and failure readability
- [ ] clean up feature-stack authoring ergonomics where the flow still feels like scaffolding

# [4] `Console, Debug, And Workspace Feedback`

Summary:
- pull the app-wide `Console` and its related debug/feedback surfaces into their own lane so they can move sooner without being buried under later control/build/package systems
- treat the `Console` as a first-class workspace feedback surface for commands, shortcuts, worker/app notes, diagnostics, and layered transcript output
- long term, evolve the `Console` into an app-wide command language that can navigate and act across workspace, graph, node, and feature domains instead of remaining only a shell/transcript surface

### Lane Header
#### Fold Hack 4

Purpose:
- hold the cross-cutting workspace feedback systems around:
  - command feedback
  - shortcut feedback
  - worker/app transcript output
  - layered debug text and later inspection handoff

Primary phase families:
- `VR`
- `SP`
- `DBG`

Expected outcome:
- the roadmap has one clear home for:
  - the bottom console line
  - the expanded debug/transcript panel
  - future layered debug output
  - shared keyboard-routing and feedback presentation

## Lane [4] Body - `console and debug workspace feedback`

### [4.1] [~] - `VR / SP / DBG` - `Console And Layered Transcript`

##### Summary

Summary:
- the app-wide `Console` is now real as a shared workspace feedback surface instead of debug text being stranded inside local tools
- shipped work now covers the bottom collapsed row, the expanded transcript shell, layered feedback lines, console appearance/tools controls, the first alternate presentation modes, the hybrid command-capture follow-on, the first staged graph/sketch command tree, and the input-ownership audit
- the remaining `4.1` work is now:
  - later result UX
  - inspector bridge
  - hotkey customization
  - surface-driven console context sync on top of the shared workspace-selection seams from `[5.1F]`

CheckList:

### [4.1A] [x] - `Console Shell And Transcript Core`

- collapsed bottom-row `Console`
- expanded resizable black-panel `Console`
- app-global shared transcript/state seam
- visible layer row
- appearance/tools controls in the `i` menu

### [4.1B] [x] - `Console Floating And Pop-Out Modes`

- `Floating`
- `Pop-Out`
- `List`

### [4.1C] [x] - `Command Input And Keyboard Routing`

- narrow-core typed commands
- `/` focus entry
- strict command parsing
- command history recall
- immediate `M / R / S` and secondary-only `X / Y / Z` routing

### [4.1D] [x] - `Layered Event Feeds And Filtering`

- added `View`, `Browser`, and `Transforms` layers
- isolate mode
- subset mode
- diagnostics pin
- broader Browser / View / Transform publishers

### [4.1E] [ ] - `Command Results, Errors, And Follow-Up UX`

- richer command result formatting
- clearer follow-up/help/error presentation

### [4.1F] [ ] - `Debug Inspector Bridge And Richer Later Diagnostics`

- stronger console-to-inspector bridge
- deeper structured diagnostics

### [4.1G] [ ] - `Hotkey Customization And Shortcut Profiles`

- user hotkey rebinding
- conflict detection
- restore-default behavior

### [4.1H] [x] - `Hybrid Command Capture And Shortcut Unification`

- printable-key auto-capture into the console when no normal text-editing field owns focus
- `/` remains optional for explicit console focus/open, but is no longer required to start typing
- explicit real-text-field guards so parameter fields and other editors never leak typing into the console
- one shared dispatcher for typed commands, auto-captured command text, and shortcut aliases
- standalone `m / r / s` become typed-first command entry in this phase instead of silent immediate hotkeys

### [4.1I] [~] - `Staged Scoped Command Navigation`

- extend the console beyond flat command submission into staged scoped navigation one token at a time
- shipped work now covers:
  - `Graph` as the first staged root
  - live staged console session state
  - real `Graph -> Sketch -> Sketch Plane / Sketch Draw` navigation
  - missing-sketch recovery by creating a real sketch node when the branch is empty
- remaining work stays in:
  - `[4.1I5]` prompt quality and robustness

### [4.1I1] [x] - `Staged Grammar Core`

- dedicated staged grammar seam outside the UI component
- scoped alias resolution and deterministic numeric selection
- structured staged results for `advance / execute / invalid / cancelled`

### [4.1I2] [x] - `Console Session Integration`

- staged session state now lives at the console layer
- accepted staged tokens show transcript breadcrumb and next-prompt feedback
- staged cancel/reset is wired into the live console session

### [4.1I3] [x] - `First Executable Vertical Slice`

- real navigation from `Graph` into a selected sketch
- real `Sketch Draw` and `Sketch Plane` execution from the staged tree
- single-choice auto-advance works for graph and sketch entity scopes

### [4.1I4] [x] - `Missing-Branch Recovery And Node Creation`

- if `Graph > Sketch` finds no sketches, create one real `Geometry/Sketch` node
- place it deterministically in the graph canvas
- select/focus it and continue the staged session into that created sketch

### [4.1I5] [ ] - `Robustness And Prompt Quality`

- better scoped error copy
- better next-choice prompts
- clearer breadcrumb labels
- stronger recovery when graphs or sketches disappear during an active staged session

### [4.1J] [x] - `Input Ownership And Coordination Cleanup`

- clean up key ownership across:
  - console capture
  - staged console
  - sketch-plane pick
  - sketch draw
  - reference transform
  - viewer / overlay seams
- shipped work now covers the audit, target ownership contract, shared routing seam, session migration, and hardening pass
- the console/input ownership model now has one real precedence path instead of depending on scattered accidental listener order

### [4.1J1] [x] - `Input Ownership Audit`

- explicit current-owner table for `Esc`, `Enter`, `Space`, `m / r / s`, `x`, and `b / back`
- explicit target-owner table and input-priority contract
- locked token rule that keeps command input space-free where practical so `Space` and `Enter` can both submit in token-based command contexts

### [4.1J2] [x] - `Shared Input Routing Seam`

- add one shared seam that decides which active owner gets a key before feature logic runs
- route the first real precedence checks through an explicit `owner + decision` contract
- wire console capture, sketch-plane pick, sketch-draw, and reference-transform listeners through that seam without turning `ConsoleDock` or `AppShell` into a god object

### [4.1J3] [x] - `Session Migration`

- move sketch-plane pick, sketch draw, staged console, and reference transform onto the shared routing seam
- stop staged/flat console capture from reclaiming printable token input while higher-priority feature sessions are active
- keep migrated session listeners as delegates/no-ops for routed keys instead of independent precedence systems

### [4.1J4] [x] - `Cleanup And Hardening`

- remove or simplify redundant routed-key listeners where safe
- add regression tests for priority conflicts and routed-session resume
- harden cancel/exit/focus edge cases
- keep real text-entry ownership and command-scoped `Space` behavior stable
- a narrower reserved immediate-key set outside the typed-first path
- transcript/history visibility for the actual typed token or alias instead of silent shortcut-only side paths

### [4.1K] [x] - `Surface-Driven Console Context Sync`

- keep UI workspace context and staged console scope visibly synchronized
- clicking `Spaghetti Editor` should move the console into the nearest graph scope when a graph is active
- clicking a graph-family node like `Sketch` should move the console into the matching node-family scope without auto-running child commands
- clicking away from the active authoring surface should return the console to the nearest valid parent/root context
- `Browser` and `Spaghetti` interactions should produce the same console scope when they resolve to the same shared target
- this phase should consume shared `activeSurface` and `selectedTarget` truth from `[5.1F]` instead of inventing panel-local command state again

### [4.1L] [x] - `Command Transcript Sublayers`

- split command transcript meaning into:
  - `Commands.User`
  - `Commands.System`
- keep the `Commands` family filter behaving as one command-layer family
- make it easier to visually distinguish what the user typed from what the console returned without inventing a second transcript product

### [4.1M] [x] - `Staged Choice Prefill And Arrow Cycling`

- prefill the first valid staged choice directly into the input row
- highlight the current targeted staged choice in the bottom summary strip
- let `ArrowUp` and `ArrowDown` cycle sibling staged choices while preserving manual typing override
- keep this as a narrow staged-navigation usability refinement instead of turning the console into a chooser-only palette

### [4.1N] [x] - `Feature Session Prompt Descriptors`

- extend the assisted prompt seam beyond staged navigation so active feature sessions can publish:
  - `label`
  - `choices`
  - `prefill`
- keep staged navigation higher priority, but let the console fall back to the active feature-session descriptor when no staged session is alive
- first shipped consumers are:
  - `Sketch Plane`
  - idle `Sketch Draw`
- the console now uses that shared descriptor seam for:
  - prompt rendering
  - input prefill
  - targeted choice tracking
  - `ArrowUp / ArrowDown` choice cycling
  - manual typing override

# [5] `Control, Build, And Workspace Systems`

Summary:
- capture the deeper control, build orchestration, and workspace features that were discussed during planning but do not belong inside the Browser, authoring-hardening, or the newly promoted console/debug lane
- leave room for one narrow shell-cleanup bridge before the broader workspace-mode system starts
- keep these systems visible on the roadmap so they can become real later phases instead of staying as scattered notes

### Lane Header
#### Fold Hack 4

Purpose:
- hold the bigger deferred systems around:
  - pre-workspace shell cleanup and legacy panel reduction
  - workspace modes and hybrid pane layout
  - control-viz and Jake-style control surfaces
  - build sequencing and truthful build bars
  - advanced output/project packaging

Primary phase families:
- `DR`
- `JK`
- `AS`
- `VR`

Expected outcome:
- the roadmap keeps room for the systems that govern:
  - shell cleanup before workspace replacement
  - workspace modes and shared layout
  - control surfaces
  - build sequencing
  - richer output/export behavior

## Lane [5] Body - `later control/build/workspace placeholder`

### [5.0] [~] - `VR / SP` - `Pre-Workspace Shell Cleanup And Legacy Panel Reduction`

Summary:
- narrow bridge lane for reducing the shell clutter that is currently consuming the left dock before `[5.1] Workspace Modes` tries to replace layout behavior more broadly
- this is the right home for shrinking or removing the always-open legacy-style panels that are taking up space without yet doing a broad final legacy purge

CheckList:
- [x] shrink, demote, or remove the current `Preview Mode` card from the always-open left-dock stack
- [x] decide whether `Parts List` should:
  - merge into `Browser`
  - become a later hosted tool surface
  - or be reduced as legacy shell clutter
- [x] shrink, hide, or phase down `Box Params` if it is still acting as large always-open legacy UI
- [x] make `spaghetti` the default startup/input path before hiding the visible legacy branch UI
- [x] plan one later cleanup cut that actually removes the `legacy` input-mode branch from code after the shell no longer depends on it
- [x] preserve any still-needed behavior while reducing permanent left-dock footprint
- [x] keep this lane narrow:
  - do not turn it into the final broad legacy purge
  - do not absorb the real hybrid workspace system from `[5.1]`
- [ ] standardize the `Spaghetti Editor` surface model enough that `5.1` can normalize viewport types and pane switching without inheriting ambiguous editor-specific shell vocabulary

### [5.0A] [x] - `Spaghetti Default Startup And Preview-Mode Shell Removal`

Summary:
- make `spaghetti` the default startup/input path before the visible `Preview Mode` branch UI disappears
- remove the visible `Legacy / Spaghetti` chooser from the left dock once the app no longer needs that branch as the primary entry seam

CheckList:
- [x] change startup so the app lands in `spaghetti` by default
- [x] verify the main viewer/build flow still behaves correctly without the user touching `Preview Mode`
- [x] hide or remove the `Preview Mode` card from the default left-dock stack
- [x] preserve any still-needed non-branch preview behavior in a lighter surface if needed

### [5.0B] [x] - `Legacy Left-Dock Panel Reduction`

Summary:
- remove the remaining large transitional left-dock cards that are still competing with `Browser` for shell space
- keep any still-needed behavior, but stop letting `Parts List` and `Box Params` consume permanent left-dock real estate

CheckList:
- [x] hide `Parts List` from the default left-dock stack
- [x] hide `Box Params` from the default left-dock stack
- [x] decide whether surviving `Parts List` behavior belongs in `Browser`, a lighter shell entry, or a later hosted tool surface
- [x] preserve any still-needed `Box Params` behavior somewhere lighter if it is still needed temporarily

### [5.0C] [x] - `Legacy Input-Mode Branch Removal`

Summary:
- remove the `legacy` versus `spaghetti` input-mode branch from code after the shell no longer depends on it
- treat this as a real cleanup cut, not just an implied side effect of hiding old panels

CheckList:
- [x] remove the visible `setInputMode('legacy' | 'spaghetti')` branch UI completely
- [x] remove `inputMode: 'legacy' | 'spaghetti'` branching once `spaghetti` is the only real startup path
- [x] clean up remaining legacy-conditionals in viewer routing, build routing, panel rendering, and left-dock behavior
- [x] verify the app no longer depends on hidden `legacy` mode to remain usable

### [5.0D] [x] - `Deferred Legacy Residue And Dead-Surface Cleanup`

Summary:
- deferred cleanup cut for whatever is still left behind after the real `5.0A-C` shell and input-branch work lands
- use this to prune dead surface files, stale styling, panel-era tests, and leftover viewer residue without pretending that all of it must block `[5.1]`

CheckList:
- [x] remove dead shell-surface files that no longer have a real future owner
- [x] clean up stale CSS, tests, imports, and mocks from removed `Preview Mode`, `Parts List`, and `Box Params` surfaces
- [x] remove the remaining dead `parts` / `assembled` app-level residue instead of keeping it as a half-live viewer concept
- [x] keep or remove spaghetti output-list helpers based on whether they still have a real next owner
- [x] keep this phase deferred by default:
  - do not block `[5.1]` unless one of these leftovers becomes a direct workspace blocker

### [5.0E] [~] - `Spaghetti Editor Surface Standardization And Viewport-Type Cleanup`

Summary:
- narrow bridge cut for cleaning up the `Spaghetti Editor` surface model before the deeper workspace lane starts standardizing viewport types and pane switching
- use this to decide what the full `Spaghetti Editor` is, what the `meatball editor` is, and which editor presentation should count as the canonical first-class viewport type

CheckList:
- [ ] decide whether `Spaghetti Editor` is the canonical graph-editor viewport type
- [ ] decide whether `meatball editor` is:
  - a compact editor presentation
  - a separate viewport type
  - or a temporary shell bridge that should be phased down later
- [ ] standardize the editor-family naming so `5.1` can use one honest viewport-type list
- [ ] clean up leftover editor-specific shell terminology that would make pane switching or viewport-type menus ambiguous
- [ ] keep this cut narrow:
  - do not absorb the whole workspace hosting system from `[5.1]`
  - do not turn it into detached/browser pop-out implementation

### [5.1] [~] - `VR / SP` - `Workspace Modes`
#### Header
Summary:
- later lane for the shared hybrid workspace system:
  - `Windowed` plus `Tiled` presentation
  - left-dock split entry
  - pane-tree layout
  - divider authoring
  - hybrid tiled/windowed tool-surface hosting
  - canonical workspace selection and active-surface truth
  - shared cross-surface intent routing for major workspace domains
  - persistence and saved workspace modes
  - later multi-window surface growth and detached/browser pop-out on top of the same shared host model
- this is now the real roadmap home for the broader workspace-mode architecture in `docs/Human-Plans/Architecture/Workspace-Modes.md`
- this is also the right family for the newer canonical workspace-selection / surface-activation seam now described in `docs/Human-Plans/Architecture/Console.md`, because that work is broader than console routing and should unify `Console`, `Browser`, `Spaghetti Editor`, and `Viewer` as workspace surfaces over shared truth
- the older smaller workspace-presentation cleanup wave stays recorded here as already-landed groundwork, but no longer owns the future execution numbering

CheckList:
- [x] create the dedicated `[5.1A]` through `[5.1D]` task-doc family for workspace modes
- [ ] lock one shared workspace-layout owner near `AppShell`
- [ ] lock the canonical tile-tree model:
  - branch node = split direction + ratio + priority
  - leaf node = hosted tool-surface instance
- [ ] reuse the existing left-dock `[]` button as the first tiled-entry control
- [x] lock divider-line authoring, resize, merge, and row/column priority rules
- [ ] lock hybrid tool-surface hosting and tiled/windowed transitions for:
  - `Model Viewer`
  - `Browser`
  - `Console`
  - `Gizmo/View`
  - `Spaghetti Editor`
- [x] lock one canonical workspace-selection seam for:
  - `activeGraphDocumentId`
  - `activeEditorViewportId`
  - `selectedTarget`
  - `activeSurface`
- [x] lock one canonical cross-surface intent layer so `Console`, `Browser`, `Spaghetti Editor`, and `Viewer` can produce the same outcomes through the same intents instead of panel-local glue
- [ ] lock persistence, saved workspace-mode follow-up, and migration off the old special-case Spaghetti split path
- [ ] keep later multi-window `Spaghetti Editor` growth attached to this same workspace family so in-app duplicate editor surfaces and detached/browser pop-out reuse the shared surface-instance model instead of bypassing it
- [ ] expand later browser `Pop-Out` beyond `Console` so any supported viewport/tool surface can move into a new browser window on top of the same shared workspace host model

Shipped groundwork already landed:
- [x] per-window appearance shell and per-viewport style controls
- [x] para slider/select presentation primitives and clamp-edit mode
- [x] compact/expanded `View` gizmo and right-dock presentation

Planned subphase family:
- `[5.1A] [ ] - Workspace Layout Foundation And Left-Dock Entry`
- `[5.1B] [x] - Split Pane Authoring And Divider Controls`
- `[5.1C] [ ] - Hybrid Tool Surface Hosting And Floating-Tiled Transitions`
- `[5.1D] [ ] - Workspace Persistence, Saved Modes, And Migration`
- `[5.1E] [ ] - Multi-Window Surfaces And Detached Browser Pop-Out`
- `[5.1F] [x] - Workspace Selection, Surface Activation, And Canonical Intents`

### [5.2] [ ] - `DR / JK` - `Control Viz And Graph-Driven Control Surfaces`

Summary:
- later lane for control-viz spheres, graph-linked controls, driver authority rules, and the deeper convergence between Spaghetti and Jake mode

CheckList:
- [ ] define control-viz sphere ownership and outputs
- [ ] define source control vs downstream offset rules
- [ ] define how control surfaces drive graph params cleanly

### [5.3] [ ] - `AS / SP` - `Build Sequencing, Build Bars, And Output Build Control`

Summary:
- later lane for truthful per-object/per-part build bars, staged build sequencing, rebuild policies, and mesh/combine control above the current graph-local build memory work
- this is the first credible home for replacing the old `BoxParams`-centric worker contract with a graph-native build contract once Lane `[2]` has already made the published `Content` hierarchy honest

CheckList:
- [ ] expose per-part/per-object build progress
- [ ] define build-sequence control surfaces
- [ ] make sibling published rows real independent build chunks in worker/runtime instead of graph-scoped UI abstractions
- [ ] keep unaffected sibling published rows clean/cached when another object changes
- [ ] derive `Content` rebuild bars from runtime chunk truth instead of graph-level rebuild fallback state
- [ ] distinguish clearly between:
  - never built
  - stale / needs rebuild
  - building
  - clean / cached
- [ ] define invalidation boundaries so only downstream affected published rows are marked stale
- [ ] define policy/execution truth split clearly:
  - project/app state owns row policy
  - worker/runtime owns row execution truth
- [ ] define deferred mesh/combine behavior across objects/assemblies
- [ ] define the graph-native worker request/result contract that should replace the current legacy compatibility path
- [ ] remove dependence on graph-to-legacy request translation once the graph-native contract is real

### [5.4] [ ] - `AS / VR` - `Advanced Output Types And Later Project Packaging`

Summary:
- later lane for non-solid outputs, richer project-file export packaging, and optional inclusion of imported assets in project export

CheckList:
- [ ] support outputs beyond solids later
- [ ] define project-file packaging/export behavior
- [ ] define when imported assets can become project-owned export content

### [5.5] [ ] - `GE / SP / AS` - `Publish / Receive Execution`

Summary:
- later lane for turning the locked `Publish / Receive` ownership model into real graph-to-graph behavior with clear link versus hard-copy execution rules

CheckList:
- [ ] implement `Publish / Receive` graph-to-graph data flow with stable identity
- [ ] support `Link` versus `Hard Copy` behavior explicitly
- [ ] keep Browser/project ownership coherent when received data is nested into project content
- [ ] define export restrictions or conversion requirements for linked receive-data

### [5.6] [ ] - `GE / SP / VR` - `Final Legacy Phase-Out And Compatibility Cleanup`

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
