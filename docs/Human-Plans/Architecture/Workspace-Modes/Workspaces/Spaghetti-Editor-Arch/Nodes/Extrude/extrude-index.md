# Extrude

## Doc Header

### Doc History
64. 2026-04-08 08:33: Added `Extrude-5 - Output Row Standardization And UI Cleanup` to this family index as the next dedicated node-surface cleanup lane, locking that the current `SolidBody` output should be rebuilt around the shared standardized output-row template instead of staying a one-off custom block while the broader all-node rollout can follow later
63. 2026-04-08 08:26: Marked `Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening` shipped inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md`, then cleaned that child doc plus this family index into a closed shipped-lane read so `Extrude-4` no longer points at stale open `3B/3C` handoff text
62. 2026-04-08 08:06: Tightened `Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the current aggregate compile, draft-runtime, and authoritative-runtime tests, and by locking the remaining work to deterministic ordering plus failure-honesty alignment rather than reopening visible copy or execution semantics
61. 2026-04-08 08:03: Marked `Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty` shipped after the visible `Geometry/Extrude` surface stopped claiming aggregate `SketchProfiles` is not executable, the selector-owned extrude VM gained aggregate-aware target-summary state, and the feature-style extrude summaries adopted `Profile Target` wording before the family handoff advances to `Phase 3C - Focused Verification And Failure Matrix Hardening`
60. 2026-04-08 07:45: Tightened `Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the stale singular-only `Geometry/Extrude` node copy still living in `NodeView.tsx`, the still-singular feature-panel summary in `ExtrudeFeatureView.tsx`, and the selector-owned summary seam in `selectNodeVm.ts`, while locking that pass to visible honesty only so aggregate closed-profile execution now reads truthfully without reopening runtime or result-ownership work
59. 2026-04-08 07:42: Marked `Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption` shipped after the `Geometry/Extrude` `SolidBody` publish contract began accepting aggregate `SketchProfiles` input as one feature-owned result, the draft/runtime aggregate result kind became explicitly `aggregate_extrusion`, and focused graph plus retained-result tests proved aggregate execution still yields one output token and one retained body artifact before the family handoff advances to `Phase 3B - Node Toolbar And Result Copy Honesty`
58. 2026-04-08 07:31: Tightened `Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the already-live one-output `SolidBody` graph contract, the aggregate compile/runtime result seams, and the recommendation that one aggregate extrude feature should keep publishing one feature-owned result even when disconnected geometry exists underneath
57. 2026-04-08 07:22: Marked `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty` shipped after the worker draft/runtime and authoritative/runtime paths both began resolving explicit aggregate `allFromSketch` selection without hidden singular fallback, then refreshed the family handoff so the next extrude-owned follow-on inside `Extrude-4` is `Phase 3A - SolidBody Result Ownership For Aggregate Consumption`
56. 2026-04-08 07:13: Tightened `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the still-singular worker selection seams in `featureStackRuntime.ts` and `buildAuthoritativeGeometry.ts`, and by locking that both runtime paths should resolve the explicit aggregate branch honestly instead of falling back through legacy `profileRef`
55. 2026-04-08 07:05: Marked `Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing` shipped after whole-port `SketchProfiles -> ExtrusionProfile` wiring became the explicit aggregate compile lane, graph compilation began emitting `profileSelection.mode = 'allFromSketch'` while preserving sketch-derived profile order, and focused parity plus compile tests proved the aggregate branch stays explicit while the family handoff advances to `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty`
54. 2026-04-08 06:52: Tightened `Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the shipped `profileSelection` payload, the still-rejected whole-port `SketchProfiles -> ExtrusionProfile` aggregate lane, and the recommendation that compile ownership should explicitly map parent whole-port wiring to `mode: 'allFromSketch'` while preserving deterministic sketch/profile order
53. 2026-04-08 06:28: Marked `Extrude 4 Phase 2A - Explicit Aggregate Selection Payload Contract` shipped after the graph-to-worker extrude request contract gained the explicit `profileSelection` descriptor, both current emit paths began populating its singular branch while preserving the legacy `profileRef` runtime seam, and focused contract tests proved the new payload shape without widening aggregate execution yet
52. 2026-04-07 21:57: Tightened `Extrude 4 Phase 2A - Explicit Aggregate Selection Payload Contract` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the live singular `profileRef` request boundary plus both current emit paths, and by locking the recommendation to add one explicit extrude-owned `profileSelection` descriptor before later compile routing and worker resolution widening
51. 2026-04-07 21:43: Marked `Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract` shipped after the live `Geometry/Extrude` surface stopped implying whole-port `SketchProfiles` aggregate execution, the visible profile-target copy now stays explicitly singular around `SketchProfile`, and focused validation coverage now keeps aggregate-to-singular wiring honest while the family handoff advances to `Extrude 4 Phase 2 - Compile And Runtime Selection Contract`
50. 2026-04-07 21:33: Tightened `Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract` inside `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md` into an implementation-ready next slice by grounding it in the live aggregate-versus-singular sketch outputs, the still-singular `Geometry/Extrude` input and `profileRef` compile/runtime contract, and the recommendation to lock authored parent-versus-child meaning first while deferring all-profiles execution to `Phase 2`
49. 2026-04-07 18:44: Retired the stale open `Extrude-0 - Graph-Native Authoritative B-Rep Extrude Lowering` phase after the narrow worker-authoritative closed-profile `Body` path landed through the shipped `Sketch - 1` ladder, added the dedicated future phase `Extrude-4 - Closed Profile Selection And Consumption Contract`, and refreshed this family read so the next new extrude-owned lane is profile-selection and consumption ownership rather than pre-surface kernel groundwork
48. 2026-04-07 16:54: Added `Extrude-0 - Graph-Native Authoritative B-Rep Extrude Lowering` to this family index as the new pre-surface foundation phase for replacing the current rectangle-only authoritative shortcut with worker-owned OpenCascade sketch-face to extruded-body lowering, while keeping raw kernel object ownership out of the `Geometry/Extrude` node/editor layer
47. 2026-04-06 10:49: Marked `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` shipped after the graph-native `Geometry/Extrude` node began hiding `Taper Angle` outside the first honest `Body + OneSide` support set while preserving authored taper state non-destructively, then refreshed the family handoff so `Extrude 3.4 Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup` now reads as the next honest slice
46. 2026-04-06 10:42: Tightened `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` into an implementation-ready next slice by locking the first honest support set to `Body + OneSide`, choosing hidden-over-disabled behavior for unsupported combinations, and keeping the work scoped to selector plus `NodeView` visibility truth before any taper runtime widening
45. 2026-04-06 10:38: Marked `Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract` shipped after the graph-native `Geometry/Extrude` node gained the real `Taper Angle` row and authored taper ownership state, then refreshed the family handoff so `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` now reads as the next honest slice
44. 2026-04-06 10:15: Tightened `Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract` inside `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty.md` into an implementation-ready next slice by locking the first row id, authored param direction, visible row order, and focused verification plan, so the family now points at one sharper taper-state task instead of a broad taper umbrella
43. 2026-04-06 10:10: Added the dedicated future phase `Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty` after the graph-native node-side `Extrude-3.3` ladder closed, refreshed the family read so the next honest authored follow-on is now a dedicated taper-and-visibility lane instead of one paragraph inside the broader `Extrude-3` umbrella, and kept later runtime/result convergence work visible behind that new execution home
42. 2026-04-06 09:53: Corrected the shipped `Extrude-3.3` `Symmetric` read so the visible `Depth` value now means total centered span in the graph-native runtime, making `Depth = 20` resolve to `10` per side instead of `20` per side
41. 2026-04-06 09:50: Marked `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` shipped after the graph-native `Geometry/Extrude` path began carrying authored `OneSide / TwoSides / Symmetric` meaning through compile/runtime execution and live node wording, closing the node-side `Extrude-3.3` ladder while keeping older feature-stack direction parity explicitly out of scope for a later follow-on
40. 2026-04-06 09:31: Tightened `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` into an implementation-ready next slice by locking the first graph-native runtime owner, the `OneSide / TwoSides / Symmetric` meanings, the explicit direction-aware IR fields, and the decision to keep older feature-stack direction parity out of scope for that cut
39. 2026-04-06 08:58: Marked `Extrude 3.3 Phase 2 - Depth Row Surface Split And Visibility Rules` shipped after the live `Geometry/Extrude` node gained honest direction-aware `Depth` versus `Start Depth / End Depth` row visibility plus non-destructive split-depth fallback behavior, then refreshed the family summary so `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` now reads as the next honest follow-on
38. 2026-04-06 08:46: Marked `Extrude 3.3 Phase 1 - Direction Names And Authored State Contract` shipped after the live node gained the real authored `Direction` row and selector-owned direction state, then refreshed the family summary so `Extrude 3.3 Phase 2 - Depth Row Surface Split And Visibility Rules` now reads as the next honest implementation-ready follow-on
37. 2026-04-06 08:17: Added the dedicated future phase `Extrude-3.3 - Direction Modes And Depth Row Contract` after the full `Extrude-3.2` `Body / Walls` contract landed, refreshed the family summary so the next honest authored follow-on is now the `Direction` selector plus later depth-row branching lane, and kept the broader `Extrude-3` umbrella aligned with that new focused execution home
36. 2026-04-05 20:55: Marked `Extrude 3.1 Phase 8 - Type Row And Runtime Source Of Truth Trace` shipped after the live unwired `Geometry/Extrude` `Type` row and the visible `SolidBody` summary stopped drifting from the authored `node.params.extrudeType` truth already used by the compiler/runtime path, so the `Extrude-3.1` ladder is closed again and the family can hand forward into `Extrude-3.3`
35. 2026-04-05 20:44: Tightened `Extrude 3.1 Phase 8 - Type Row And Runtime Source Of Truth Trace` into an implementation-ready end-to-end debug slice by locking the exact `NodeView`, selector, compile, and runtime seams plus the required visible-row and built-result proof chain, so this family now points at one sharply scoped next step instead of a vague reopened reserve
34. 2026-04-05 20:41: Reopened the `Extrude-3.1` family again by adding `Extrude 3.1 Phase 8 - Type Row And Runtime Source Of Truth Trace` after the live app still showed a mismatch between the visible `Type` row and the actual `Body / Walls` result, so this family now points at one explicit end-to-end truth-trace across node params, selector VM, and compile/runtime output before more enum-row polish happens
33. 2026-04-05 20:36: Marked `Extrude 3.1 Phase 7 - Enum Row Live Write And Render Trace` shipped after the visible `Type` row was traced back to a drifted hand-rolled enum interaction path, restored onto the real shared `ParaSelect` behavior core, and reconnected to node-row scrub behavior, so the `Extrude-3.1` ladder now reads as closed groundwork again and can hand forward into broader authored extrude work
32. 2026-04-05 20:13: Tightened `Extrude 3.1 Phase 7 - Enum Row Live Write And Render Trace` into an implementation-ready debug slice by grounding it in the real visible row, node write, selector, and canvas render seams, so this family now points at one explicit live-chain truth-finding pass instead of another broad enum-row redesign
31. 2026-04-05 20:10: Reopened the `Extrude-3.1` family again by adding `Extrude 3.1 Phase 7 - Enum Row Live Write And Render Trace` after the shipped `Phase 6` interaction repair still failed to make the visible `Type` row stick on `Walls`, so this family now treats the next honest step as a narrow truth-finding pass through the live `onChange`, node-param write, and selector/render chain before more enum-row redesign happens
30. 2026-04-05 20:05: Marked `Extrude 3.1 Phase 6 - Enum Row Integration Verification And Cleanup` shipped after the live `Extrude Type` row adopted a simpler direct-arrow plus center-menu interaction path that finally makes `Body / Walls` selection trustworthy from the real node surface, so this family now treats the full `Extrude-3.1` enum-row ladder as closed groundwork and hands forward into `Extrude-3.3`
29. 2026-04-05 13:27: Tightened `Extrude 3.1 Phase 6 - Enum Row Integration Verification And Cleanup` into an implementation-ready final live-canvas slice focused on the still-broken visible `Type` row, so this family now treats `Phase 6` as a real next task centered on arrow/menu reliability and real canvas-surface trustworthiness rather than a vague post-`Phase 5` reserve
28. 2026-04-05 13:04: Marked `Extrude 3.1 Phase 5 - Primitive Enum Row Value Ownership Parity` shipped after the live `Geometry/Extrude` `Type` row stopped treating the evaluator’s default unwired numeric input as authoritative and now follows the same local-versus-driven ownership rule already proven by `Depth`, so this family now points at `Phase 6` only as a final integration-hardening reserve
27. 2026-04-05 12:57: Reopened the `Extrude-3.1` ladder after the live `Type` row still showed the classic primitive-row ownership mismatch, so this family now adds `Extrude 3.1 Phase 5 - Primitive Enum Row Value Ownership Parity` plus `Extrude 3.1 Phase 6 - Enum Row Integration Verification And Cleanup` as explicit post-`Phase 4` homes for aligning enum-row local-versus-driven behavior with `Depth` and for any final live-surface hardening still needed after that
26. 2026-04-05 12:02: Marked `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup` shipped after the remaining visible `Body / Walls` wording drift was removed from the live node summary and the feature-style extrude surface, so this family now points forward into `Extrude-3.3` as the next broader authored-row follow-on
25. 2026-04-05 11:55: Marked `Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning` shipped after the authored `Body / Walls` split began flowing through the graph-native compiler and worker runtime as real capped-versus-uncapped extrude geometry while staying on the current first `SolidBody` output lane, so this family now points at `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup` as the next follow-on
24. 2026-04-05 11:41: Marked `Extrude 3.2 Phase 1 - Type Names And Authored State Contract` shipped after the live `Extrude Type` row and selector VM stopped speaking the placeholder `Basic / Twist` story and now normalize onto the real authored `Body / Walls` contract, so this family now points at `Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning` as the next honest follow-on
23. 2026-04-05 11:19: Added the dedicated future phase `Extrude-3.2 - Real Type Modes Contract` by carving the first post-`Extrude-3.1` authored-semantics lock out of the broader `Extrude-3` umbrella, so the family now has one explicit home for deciding the real extrude type choices and what each one means before extent, taper, and runtime-convergence follow-ons land
22. 2026-04-05 11:10: Marked `Extrude 3.1 Phase 4 - Enum Row Fill And Endcap Cleanup` shipped after the shared enum row moved onto the sturdier custom `ParaSelect` track path, its fill and step arrows began responding through the same shared interaction logic, and its endcap chevrons were tightened to the same settled geometry as `Depth`, so the full `Extrude-3.1` ladder now reads as finished enum-row groundwork
21. 2026-04-05 11:02: Added `Extrude 3.1 Phase 4 - Enum Row Fill And Endcap Cleanup` to the `Extrude-3.1` ladder after the real driven `Type` input contract shipped, so the family now has one narrow follow-on for fixing the still-broken enum fill response, unreliable step arrows, and the remaining mismatch against the settled `Depth` endcap treatment before the broader `Extrude-3` authored-semantics work resumes
20. 2026-04-05 10:56: Marked `Extrude 3.1 Phase 3 - Whole-Number Driven Enum Input` shipped after `Geometry/Extrude` gained a real unitless-number `Type` input pin with stable enum-row color treatment and deterministic whole-number-driven `Basic` / `Twist` selection, so the full `Extrude-3.1` ladder now reads as shipped groundwork and the next honest follow-on returns to the broader `Extrude-3` authored-semantics stack
19. 2026-04-05 10:21: Marked `Extrude 3.1 Phase 2 - Enum Row Visual Shell Parity` shipped after the live `Extrude` input stack settled into `SketchProfile -> Type -> Depth`, the shared enum row shed its nested selector-box look, and the family index now points at `Extrude 3.1 Phase 3` as the next honest enum-row step
18. 2026-04-05 10:08: Reworked `Extrude-3.1` into a real `3.1-1` through `3.1-3` ladder after the first shared enum-row foundation shipped, so the family now treats the landed shared row template as `Phase 3.1-1`, stages enum-row visual shell parity next in `Phase 3.1-2`, and keeps the later whole-number-driven enum-input contract visible as `Phase 3.1-3`
17. 2026-04-05 09:58: Marked `Extrude-3.1 - Enum Input Row And Type Selector` directionally shipped after the repo gained the first shared enum-row helper plus shared `StructuredWireEnumRow` view, moved `Extrude Type` into `Inputs`, and deleted the old local `Details`-hosted button group, while recording that real wire-bearing enum ports still need a later graph type-system lane
16. 2026-04-05 09:41: Added the dedicated future phase `Extrude-3.1 - Enum Input Row And Type Selector` by carving task `1` out of the broader `Extrude-3` stack, locking that the first explicit `Extrude Type` control should become the first reusable primitive `enum input row`, and refreshing this family index so that narrower follow-on is visible beside the wider functional-completion lane
15. 2026-04-05 09:30: Tightened the Extrude family toolbar direction by locking that `Extrude-2` should remove the visible `Extrude Geometry` title from the node template, reuse that header area for one button that opens the extrude toolbar, and prove that titleless launcher pattern on `Extrude` before `Sketch` follows later
14. 2026-04-05 09:28: Tightened the Extrude family read again by locking that the authored extrude controls should all live under `Inputs`, the old node `Details` section should be deleted, and the node shell should settle into `Inputs` plus `Outputs` while the later toolbar and feature-completion lanes continue
13. 2026-04-05 09:22: Added the dedicated future phase `Extrude-3 - Type Modes And Functional Completion` as the first explicit task stack for getting `Extrude` functionally closer to a real authored feature after the placement-repair and toolbar-polish setup passes, locking task `1` to a `Type` `ParaSelector` with `Body` and `Profile` while updating this family index so that broader feature-completion lane is now discoverable beside `Extrude-1B` and `Extrude-2`
12. 2026-04-04 22:54: Marked `Extrude-2.1 - Extrude Input Pin Template Parity` complete after the dedicated extrude template adopted the managed row-and-pin treatment for its `ExtrusionProfile` input, keeping the broader `Extrude-2` toolbar shell open while updating this family index so the next enrichment work now starts after that landed row-only polish slice
11. 2026-04-04 22:37: Added the dedicated future subphase `Extrude-2.1 - Extrude Input Pin Template Parity`, tightened it into an implementation-ready row-only slice grounded in the decent `SketchPlane` / `SketchDraw` managed input-row language, and updated this family index so the next `Extrude-2` execution step now points at that narrower input-row parity work instead of a vague broad toolbar start
10. 2026-04-04 22:28: Refreshed this `Extrude` family index after the landed authored-plane and preview-alignment repair ladder so it now records what actually fixed `Sketch -> Extrude -> OutputPreview`, marks `Extrude-1A` as shipped work inside the umbrella family read, and seeds the next `Extrude-2` node-enrichment plus dedicated-toolbar phase
9. 2026-04-04 20:44: Reformatted the live `Extrude` phase ladder to match the newer dashboard-family phase style so the umbrella `Extrude-1` block now reads as one `##` phase with only `### Summary`, `### Questions`, and `### Spec`, while the dedicated `Extrude-1A` and `Extrude-1B` future docs now use that same three-section phase shape too
8. 2026-04-04 20:35: Split the broad `Extrude-1` umbrella into the narrower future subphases `Extrude-1A` and `Extrude-1B`, making the immediate authored-plane placement bug implementation-ready as a standalone graph-native transform-propagation spec while pushing graph-node versus feature-stack contract convergence plus visible-parameter honesty into a separate follow-on phase
7. 2026-04-04 20:29: Refreshed this index against the live code so it now records that mesh-backed `OutputPreview` rendering is no longer the main extrude blocker, while the real open seams are `planeTransform` not flowing through extrude IR/runtime, the split graph-node versus feature-stack extrude contracts, the still-aspirational plural `EWR` profile direction, and the visible-but-not-runtime-honest `taper/offset` feature-stack parameters
6. 2026-03-25: Aligned the extrude-family vision with the broader `EWR` node direction, locking the long-term model so `Sketch` exposes child `SketchProfile` rows under `SketchProfiles` while `Extrude` normalizes one or more selected/wired sketch profiles into a real plural input contract instead of pretending repeated single-profile links are the final shape
5. 2026-03-25: Expanded the extrude vision from single-profile consumption to multi-profile selection, locking the direction that one extrude node can collect and own multiple upstream sketch-profile references through either viewport picking or spaghetti wiring
4. 2026-03-25: Added the intended Fusion-style sketch-to-extrude workflow and explicit ownership split, locking the direction that `Sketch` owns plane/transform/entities/profiles while `Extrude` owns profile selection plus extrusion parameters and resolves profile references from any sketch during command-driven authoring
3. 2026-03-25: Locked `Extrude-1` question `q1` to carry `plane + planeTransform` through the extrude feature-stack/runtime contract, keeping sketch placement truth explicit instead of flattening it away upstream
2. 2026-03-25: Added the first explicit `Extrude` phase section at the bottom of this index, splitting the family into a real phase ladder and seeding `[Extrude-1]` as a transform-aware preview/runtime alignment phase with initial questions and decisions
1. 2026-03-25: Created the initial `Extrude` node-family scaffold with top-level index doc plus `Shipped/` and `Future/` folders, framing the current `Geometry/Extrude` path as an underdeveloped proof-of-concept seam that still needs real runtime, preview, and authored-behavior planning

### Purpose

This doc defines the architecture direction for the ParaHook `Extrude` family.

Use it to answer:
- what `Extrude` is supposed to own in ParaHook
- how `Geometry/Extrude` should relate to upstream sketch/profile truth
- how preview/runtime behavior should line up with authored sketch transforms
- what belongs to the early shipped seam versus later real extrude behavior
- how future extrude planning should be split into standalone shipped and future phase docs

### Why This Doc Exists

The current `Geometry/Extrude` path is no longer just a broken proof-of-concept seam.

The first real authored-placement repair ladder has now landed:
- graph-native extrude carries authored sketch `planeTransform`
- worker mesh generation uses the resolved sketch plane frame
- mesh-backed `OutputPreview` renders authored artifact geometry in world space instead of a display-only layout space
- active sketch-plane/origin draft edits can drive a transient live extrude preview in the active viewport
- ordinary project-mode graph preview solids no longer get recentered through content-object pivots by default

But the full product contract is still thin:
- profile ownership is still narrow
- the graph-node and feature-stack extrude contracts do not yet line up cleanly
- extent/boolean/body-management behavior is still missing
- there is still no dedicated extrude toolbar or richer authored-node polish surface
- browser and console behavior are not yet fully developed as an extrude family

This doc exists so later extrude work can land against one clear architecture/index surface instead of continuing as isolated fixes.

### Scope

This doc covers:
- the future role of `Extrude` as an authored modeling family
- the ownership boundary between sketch/profile truth and extrude-produced body truth
- the main runtime/preview seams that need to become transform-aware
- the status structure for later `Shipped/` and `Future/` extrude phase docs

This doc does not cover:
- detailed implementation for any one future extrude phase
- final UI styling
- full boolean kernel design
- non-extrude solid features like loft, revolve, or sweep

## Doc Body

### Short Version

ParaHook should treat `Extrude` as a real authored solid-feature family, not just as a temporary sketch-profile consumer.

The immediate authored-plane bug is now fixed well enough that `Sketch -> Extrude -> OutputPreview` can stay truthful in normal use.

The repo now also has a first narrow authoritative closed-profile `Body` path for supported `Final` builds:
- worker-owned sketch-loop-to-wire plus face construction
- prism-style body lowering downstream from graph-authored truth
- no longer rectangle-only as the sole authoritative success path

The next real extrude work should center on:
- closing the remaining `Extrude-3.4` taper/runtime honesty lane
- keeping the now-shipped `Extrude-4` closed-profile consumption contract under regression coverage while later open-path or wider sketch-surface follow-ons stay separate
- node enrichment and a dedicated extrude toolbar
- graph-node versus feature-stack contract cleanup
- making visible extrude parameters honest
- keeping the node shell to `Inputs` plus `Outputs` instead of regrowing a `Details` section
- removing the visible `Extrude Geometry` title and using that header area for one toolbar-open button
- carrying the now-landed shared enum-row template from `Extrude Type` into the broader authored type/mode semantics
- bringing the `SolidBody` output row onto the shared standardized output-row template so `Extrude` stops carrying a one-off output block
- richer extent/body behavior
- cleaner browser/console ownership

The current dedicated follow-on docs for that stack are:
- `Extrude-3 - Type Modes And Functional Completion`
- `Extrude-3.1 - Enum Input Row And Type Selector`
- `Extrude-3.2 - Real Type Modes Contract`
- `Extrude-3.3 - Direction Modes And Depth Row Contract`
- `Extrude-4 - Closed Profile Selection And Consumption Contract`
- `Extrude-5 - Output Row Standardization And UI Cleanup`

The current `Extrude-3.1` status is:
- `Phase 3.1-1 - Shared Enum Row Foundation And First Extrude Adoption`
- `Phase 3.1-2 - Enum Row Visual Shell Parity`
- `Phase 3.1-3 - Whole-Number Driven Enum Input`
- `Phase 3.1-4 - Enum Row Fill And Endcap Cleanup`
- `Phase 3.1-5 - Primitive Enum Row Value Ownership Parity`
- `Phase 3.1-6 - Enum Row Integration Verification And Cleanup`
- `Phase 3.1-7 - Enum Row Live Write And Render Trace`
- `Phase 3.1-8 - Type Row And Runtime Source Of Truth Trace`

That means the `Extrude-3.1` ladder is now closed again:
  - the shared enum-row groundwork is fully shipped
  - the live unwired `Type` row now shares the same authored `Body / Walls` source of truth as the compile/runtime path
  - current handoff:
    - move forward into the broader authored extrude follow-ons under `Extrude-3.2` and `Extrude-3.3`

After that, the next honest broader extrude follow-on returns to the `Extrude-3` authored-semantics lane:
- real type meaning
- extent-mode meaning
- later depth-row splitting and taper follow-ons

The immediate dedicated home for that next semantics lock is:
- `Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`

The current `Extrude-3.2` status is:
- `Phase 1 - Type Names And Authored State Contract` shipped
- `Phase 2 - Body Versus Walls Geometry Meaning` shipped
- `Phase 3 - Type Surface Honesty Cleanup` shipped

That means the next honest broader extrude follow-on now moves into:
- `Extrude-3.3`
- `Direction` modes and depth-row branching

The immediate dedicated home for that next direction/depth contract is:
- `Future/Extrude_Phase Extrude-3.3 - Direction Modes And Depth Row Contract.md`

The current `Extrude-3.3` status is:
- `Phase 1 - Direction Names And Authored State Contract` shipped
- `Phase 2 - Depth Row Surface Split And Visibility Rules` shipped
- `Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` shipped

That means the graph-native node-side `Extrude-3.3` ladder is now closed:
- the authored `Direction` contract now reaches compile/runtime meaning
- `TwoSides` and `Symmetric` no longer build through the old one-sided extent assumption
- live node waiting/output wording now matches the first shipped direction semantics

What remains outside this closed `Extrude-3.3` cut is:
- any later older feature-stack extrude direction parity work
- later authored extrude follow-ons such as taper/thickness/operation questions under the broader `Extrude-3` lane

That means the immediate next honest authored follow-on now is:
- `Extrude-3.4`
- `Taper Angle` and type-aware surface honesty

The immediate dedicated home for that next taper lane is:
- `Future/Extrude_Phase Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty.md`

The current `Extrude-3.4` status is:
- `Phase 1 - Taper Angle Names And Authored State Contract` shipped
- `Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` shipped
- current handoff:
  - `Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup`
  - first shipped visible support set:
    - `Body + OneSide`

The immediate next implementation-ready slice inside that taper lane now is:
- `Extrude 3.4 Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup`

The next separate extrude-owned contract lane after that now is:
- `Extrude-4`
- `Closed Profile Selection And Consumption Contract`

The dedicated future doc for that lane now is:
- `Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md`

That lane is now closed for the current shipped subset:
- one selected child closed profile
- the parent `SketchProfiles` aggregate as all closed profiles from the source sketch
- future open-path, wall, or broader sketch-surface work should live in separate follow-on docs instead of reopening this lane

The next dedicated extrude-owned UI cleanup lane after that now is:
- `Extrude-5`
- `Output Row Standardization And UI Cleanup`

### Core Naming Decisions

Use these terms:

- `Extrude`
  - the authored modeling feature family
- `Geometry/Extrude`
  - the current graph node that produces an extruded body from a selected profile
- `Profile`
  - a closed sketch region consumed by the extrude
- `Body`
  - the solid result produced by the extrude
- `Preview`
  - the visible viewer result of the current authored extrude
- `Runtime`
  - the worker/build path that produces the mesh/body artifact

Important rule:
- sketch owns profile authoring
- extrude owns body production from that profile
- preview and runtime should agree on the same placement/orientation contract
- long-term downstream profile consumption should align with the `EWR` direction rather than freezing the current first-pass singular port shape

### Current Reality

Right now the repo already has a meaningful first extrude seam:
- `Geometry/Extrude` exists as a node
- a sketch profile can drive a first-pass output preview
- the worker can emit a first mesh-backed extrude artifact
- the viewer can render that artifact
- the old box-only preview collapse is no longer the main blocker
- the authored-plane placement bug has now been repaired through a linked runtime-plus-viewer ladder:
  - graph-native extrude carries `planeTransform`
  - worker mesh generation uses the resolved sketch plane frame
  - preview meshes now stay in authored world space
  - live sketch-plane/origin draft edits can temporarily re-drive the active extrude preview
  - project-mode graph preview solids no longer route through always-on content-object pivot centering

But the current system is still underdeveloped:
- it is still the first honest extrude seam, not a finished feature family
- the worker authoritative path now has one narrow real B-rep-backed closed-profile `Body` success lane, and the first honest parent-versus-child closed-profile consumption contract is now shipped for that subset, but wider open-path and later surface follow-ons still remain
- the repo currently has two different extrude surfaces instead of one canonical contract:
  - the graph node exposes `ExtrusionProfile + Depth -> SolidBody`
  - the feature-stack path exposes `profileRef + depth/taper/offset -> bodyId`
- the long-term plural `EWR` profile-input direction is still architectural intent, not the current implementation contract
- the feature-stack `taper` and `offset` controls are visible today but runtime still behaves as depth-only
- extent semantics are thin
- body-management semantics are thin
- the authored node surface is still sparse and does not yet have a dedicated extrude toolbar
- the current `SolidBody` output row still reads like a custom block instead of the calmer standardized output-row template the broader node family wants
- the feature family does not yet have a mature architecture roadmap like `Sketch`

### Current Code Read

The current code read matters because some earlier extrude assumptions are now stale.

- the user-facing `Sketch -> Extrude -> OutputPreview` placement bug is no longer the next main phase target:
  - `planeTransform` now flows through the graph-native compile/runtime path
  - viewer-side mesh preview no longer re-lays out authored artifact geometry as display-only gallery content
  - active draft sketch-plane edits have a transient preview bridge in the active viewport
  - ordinary graph preview solids no longer go through always-on pivot centering
- the next major blocker is now contract split:
  - `Geometry/Extrude` graph-node behavior is still much simpler than the feature-stack extrude behavior and editor surface
  - future work should pick a canonical extrude contract instead of letting both surfaces drift
- the next profile-selection gap is now explicit:
  - the first authoritative closed-profile `Body` path exists downstream from the shipped `Sketch - 1` ladder
  - the first honest child-versus-parent `SketchProfiles` consumption contract is now shipped for the current closed-profile subset
  - wider open-path or sketch-surface cleanup can continue in separate follow-on docs instead of reopening the same contract question
- the next major user-facing gap is surface quality:
  - there is still no dedicated extrude toolbar
  - the node surface is still too thin for a solid-feature family that now has a trustworthy viewport result
  - the node shell should stay on `Inputs` plus `Outputs` only as the authored controls grow
  - the current visible `Extrude Geometry` title is a weaker use of header space than a direct toolbar-open button
  - the current `SolidBody` output row still needs to move onto the same calmer shared output-row language now expected across nodes
- the plural `EWR` profile-input direction is still useful long-term guidance, but it should not be mistaken for the next direct implementation target while the repo is still single-profile in practice
- `taper` and `offset` are now user-visible debt:
  - they already exist in the feature-stack UI/compiler shape
  - but runtime does not yet honor them
  - that makes them a real contract-honesty problem rather than only later backlog

### Main Architecture Direction

#### 1. `Extrude` Should Become A Real Authored Solid Feature

`Extrude` should eventually read as a durable authored modeling operation with explicit ownership over:
- consumed profile references
- extent/depth behavior
- resulting body identity
- later boolean/body interaction rules

#### 2. Preview And Runtime Must Share One Placement Contract

The viewer preview should not use one coordinate story while the runtime mesh uses another.

The long-term rule should be:
- if a sketch/profile is transformed in authored space
- the extrude preview must emerge from that same transformed profile in world space
- the worker/runtime path and viewer path must consume the same resolved placement contract

#### 3. Extrude Should Stay Downstream From Sketch

`Extrude` should consume sketch/profile truth, not duplicate sketch ownership.

That means:
- sketch owns curves and closed profiles
- extrude references one or more resolved profiles
- extrude produces body truth from that profile

#### 3.1. Extrude Should Align With The `EWR` Profile Hierarchy

The long-term node-contract direction should match the broader `Nodes` / `EWR` vision:

- `Sketch` exposes:
  - one top-level `SketchProfiles` output
  - expandable child `SketchProfile` rows underneath it
- downstream geometry nodes consume those child `SketchProfile` rows
- `Extrude` should not depend forever on a fake singular-only profile model once multiple profile consumption is supported

Important rule:
- the source-side row shape can stay singular per child row:
  - one `SketchProfile` row = one profile object
- but the extrude-side authored input should become plural when the user adds more than one of them
- repeated profile additions should normalize into one honest plural extrude-input contract rather than acting like accidental repeated single-profile links

#### 4. Extrude Should Follow A Fusion-Style Sketch-To-Feature Flow

The intended user flow is:

- step 1:
  - the user sets up a sketch node
  - sketch owns:
    - sketch plane
    - transform
    - sketch draw
    - derived profiles
- step 2:
  - the user starts the extrude command from the console or from the extrude node surface in the spaghetti editor
  - the user can pick one or more profiles in the viewport from any sketch
  - the user commits those profile choices
  - the system should capture the correct profile wire/reference from the correct sketch for each picked profile and plug them into the active extrude node
- the user should also be able to author the same relationship directly in the graph by dragging a spaghetti line from a sketch output to the extrude input
  - in the longer-term `EWR` shape, that means dragging one or more child `SketchProfile` rows from under `SketchProfiles` into the extrude profile-input surface
- step 3:
  - the user edits the remaining extrude parameters
  - examples:
    - depth
    - flip
    - extrusion type
    - later paraslider/paraselect-driven controls

Important rule:
- `Sketch` owns sketch plane and transform truth
- `Extrude` does not become the owner of copied sketch placement data
- `Extrude` should store and consume one or more profile references to upstream sketch truth
- runtime/build can resolve each chosen profile plus the owning sketch frame when producing the body
- the viewport-pick path and the spaghetti-wire path should converge on the same underlying profile-reference contract instead of creating two different extrude-input models
- if the user adds multiple sketch profiles, the extrude-side input model should read as a real plural profile collection, not as a singular field with hidden repeated attachments

#### 5. Future Growth Should Be Split Into Clear Phases

Keep shipped and future extrude work as standalone docs in:
- `Shipped/`
- `Future/`

Recommended early future phase themes:
- contract convergence between the graph-node and feature-stack extrude paths
- transform-aware extrude preview/runtime alignment
- making visible extrude parameters honest
- plural profile-input contract aligned with `EWR` after the single-profile contract stops drifting
- richer extent modes
- body ownership and boolean behavior
- taper/offset/thickness follow-ons after first-cut honesty
- browser and console cleanup for authored extrudes

### Folder Structure

This folder should use:
- `extrude-index.md`
  - the family index / architecture surface
- `Shipped/`
  - standalone docs for landed extrude phases
- `Future/`
  - standalone docs for open extrude phases

### Current Status

Landed repair ladder now recorded in this family read:
- `Extrude-1A` worker/runtime placement repair is landed
- the post-`Extrude-1A` viewer/output-preview drift ladder in `docs/Bugs/12_GeometrySketch-Extrude-OutputPreview-Authored-Coordinate-Drift.md` is closed through its active-viewport and grouping-gate fixes
- the first narrow worker-authoritative closed-profile `Body` path is landed downstream through the shipped `Sketch - 1` ladder

Standalone shipped phase docs:
- none yet

Active future phase docs:
- `Future/Extrude_Phase Extrude-1B - Graph-Node And Feature-Stack Extrude Contract Convergence.md`
- `Future/Extrude_Phase Extrude-2 - Node Enrichment And Toolbar Polish.md`
- `Future/Extrude_Phase Extrude-2.1 - Extrude Input Pin Template Parity.md`
- `Future/Extrude_Phase Extrude-3 - Type Modes And Functional Completion.md`
- `Future/Extrude_Phase Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty.md`
- `Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md`

Historical planning doc still worth keeping:
- `Future/Extrude_Phase Extrude-1A - Sketch Plane Transform Through Graph-Native Extrude.md`
  - original implementation-ready plan for the landed placement repair

### Suggested Starting Backlog

The highest-value next extrude planning cuts are probably:
- finishing `Extrude 3.4 Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup` so the authored taper surface and runtime stop drifting
- keeping the now-shipped `Extrude-4` closed-profile consumption contract under regression coverage while later open-path, wall, or sketch-surface follow-ons stay in their own docs
- adding `Extrude-5 - Output Row Standardization And UI Cleanup` so the current `SolidBody` output row adopts the calmer standardized row template before that output language widens across all nodes
- shipping `Extrude-2` node enrichment and the first dedicated extrude toolbar now that viewport placement is trustworthy
- removing the visible `Extrude Geometry` title and using that header area as the one-button extrude-toolbar launcher
- locking the first real feature-completion task stack in `Extrude-3`, starting with:
  - `Type` as a `ParaSelector`
  - `Body`
  - `Profile`
- deleting the old node `Details` section so those authored controls live under `Inputs` and the node stays `Inputs` plus `Outputs`
- deciding the first honest toolbar surface for:
  - profile target summary and re-pick
  - depth
  - direction / flip
  - start / review / commit flow
- choosing one canonical extrude contract that both the graph node and the feature-stack path can converge toward
- making `taper/offset` honest by either implementing them in runtime or deferring/hiding them from the visible authored surface until the kernel path supports them
- keeping the shipped authored-plane and preview-alignment repair ladder under regression coverage instead of reopening it as the primary next extrude target
- a clearer authored model for body identity, result ownership, and later boolean operations

## Extrude Phase Ladder

### Phase Ordering Note

The current extrude path already exists in code, and the first narrow worker-authoritative closed-profile `Body` path has now shipped through the `Sketch - 1` ladder.

That means:
- keep `Extrude-0` as historical planning only rather than a live open phase
- keep the remaining `Extrude-3.4` taper lane visible as the current authored-surface follow-on
- keep `Extrude-4` as the shipped closed-profile selection and consumption lane for the current subset rather than a still-open next step
- do not reopen pre-surface kernel groundwork here when the narrow authoritative body path already exists downstream from graph truth

The same principle still matters going forward:
- keep worker-authoritative B-rep grounding separate from node-surface polish
- keep placement truth guarded
- keep richer feature growth for later phases
- do not widen the next live phase until the current authored surface is honest
- treat the new `Extrude-5` row cleanup as node-surface standardization work, not as a hidden runtime/result-contract rewrite

## [~] Extrude-1 - Transform-Aware Preview And Runtime Alignment Family

### Summary

#### Purpose:
- make `Geometry/Extrude` emerge from the authored sketch/profile location and orientation instead of behaving like a plane-only fallback build

#### Owns:
- the first canonical extrude placement contract between sketch and extrude
- the first canonical ownership split between the graph-node and feature-stack extrude contracts
- carrying enough sketch-plane transform truth into the extrude build/runtime path
- aligning viewer preview and worker/runtime output so they describe the same body placement
- proving the first transform-aware path for the current single-profile seam before widening further
- first regression coverage for translated and rotated sketch-driven extrudes

#### Does not own:
- final boolean behavior
- advanced extent modes
- full plural `EWR` rollout for multi-profile extrude authoring
- body combine/cut/intersect feature semantics
- broader browser or console redesign for extrude

#### Current family read:
- the first real `Extrude` fix should treat the current mismatch as a contract problem, not as a viewer-only visual patch
- the viewer preview must not invent a different body placement story than the runtime mesh
- extrude should consume upstream sketch/profile placement truth rather than ignoring it
- the first fix should preserve the current sketch-owns-profile and extrude-owns-body split
- the first shipped fix should define one canonical extrude contract for the current single-profile seam before widening into plural-profile authoring
- do not let the graph-node and feature-stack extrude surfaces keep drifting as separate product stories
- visible parameters must be honest:
  - if `taper` and `offset` stay exposed, the architecture should treat their runtime support as real debt
  - do not describe them as merely future work while they are already part of the authored surface
- do not duplicate sketch transform logic in multiple drifting formats if one shared contract can be used

#### Done shape:
- translated sketch on `XY` extrudes from the translated profile
- rotated or in-plane-rotated sketch extrudes from the rotated profile
- `XZ` and `YZ` extrudes still work after the transform-aware contract lands
- the graph-node and feature-stack extrude paths point at the same first-cut placement and parameter story

#### Current shipped output:
- graph-native `Geometry/Extrude` now carries authored sketch `planeTransform` through compile/runtime and generates mesh geometry from the resolved sketch plane frame
- mesh-backed preview artifacts now render in authored world space instead of being re-laid out as display-only parts
- active sketch-plane/origin draft edits can temporarily re-drive the active extrude preview without mutating accepted build truth
- ordinary project-mode graph preview solids no longer route through content-object pivot-centering unless an actual transform-tool session or override needs that grouping
- the original screenshot-class bug where the body sat on the viewer origin instead of the sketch origin is now treated as fixed by the landed repair ladder

#### Why this needs a split:
- `Extrude-1` is too broad to ship honestly as one unchecked block
- the repo currently has two different jobs hiding inside the same umbrella:
  - the immediate user-facing bug:
    - `Sketch -> Extrude -> OutputPreview` does not honor the authored sketch plane transform
  - the follow-on contract cleanup:
    - the graph node and feature-stack extrude surfaces do not yet line up cleanly
    - visible `taper/offset` parameters are not yet runtime-honest
- the first one should become an implementation-ready narrow fix now
- the second one should stay a separate follow-on so the authored-plane bug can land without waiting for the broader contract cleanup

#### Sub-phase breakdown:
- `[x] Extrude-1A - Sketch Plane Transform Through Graph-Native Extrude`
  - landed first implementation-ready fix for the authored-plane placement bug
  - canonical target:
    - `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview`
  - historical planning doc:
    - `Future/Extrude_Phase Extrude-1A - Sketch Plane Transform Through Graph-Native Extrude.md`
- `[ ] Extrude-1B - Graph-Node And Feature-Stack Extrude Contract Convergence`
  - follow-on cleanup after `Extrude-1A`
  - owns the first canonical single-profile extrude contract and visible-parameter honesty
  - standalone future doc:
    - `Future/Extrude_Phase Extrude-1B - Graph-Node And Feature-Stack Extrude Contract Convergence.md`

### Questions

#### [x] Question 1 - Where should the canonical sketch placement contract live for the first real extrude fix?

##### Locked answer
- carry `plane + planeTransform` through the feature-stack/runtime IR first

##### Why
- it keeps the contract explicit instead of hiding transform resolution in a viewer-only or compile-only side path
- it is the safer first step because it keeps the authored sketch truth readable while avoiding an immediate larger world-geometry refactor

#### [x] Question 2 - Should `Extrude-1` be split into sub-phases?

##### Locked answer
- yes
- `Extrude-1` now acts as the umbrella family block
- `Extrude-1A` is the immediate implementation-ready first ship target
- `Extrude-1B` is the follow-on cleanup after the placement seam is truthful

##### Why
- the authored-plane placement fix should not ship inside the same unchecked phase as graph-node versus feature-stack contract cleanup and visible-parameter honesty
- splitting the immediate placement bug into `Extrude-1A` keeps the first shipped fix narrow enough to implement and verify cleanly

#### [x] Question 3 - What is the first practical execution order inside `Extrude-1` now?

##### Locked answer
- `Extrude-1A` landed first
- keep `Extrude-1B` as the later contract-honesty follow-on
- do not reopen the placement ladder as the next main job unless a new regression proves that a still-missing seam remains

##### Why
- the authored-plane and viewer-origin bug needed to be removed before later surface polish could be read honestly
- later contract cleanup should now land on top of that truthful path instead of reopening the old placement drift

### Spec

Locked first-cut direction:
- use `Extrude-1` as the umbrella family phase only
- ship the immediate authored-plane placement repair through `Extrude-1A`
- stage graph-node versus feature-stack contract convergence plus visible-parameter honesty in `Extrude-1B`
- keep the first shipped repair focused on the current single-profile graph-native seam
- do not widen this first family pass into plural `EWR` profile rollout

Suggested execution order:
1. Keep the landed `Extrude-1A` repair ladder under regression coverage.
2. Run `Extrude-2` for node enrichment and the first dedicated extrude toolbar.
3. Continue into `Extrude-1B` when the next contract-honesty cleanup is ready.

Verification matrix for the umbrella family:
- translated `XY` sketch -> extrude stays attached
- rotated `XY` sketch -> extrude matches sketch orientation
- in-plane-rotated sketch -> extrude matches local profile rotation
- `XZ` translated sketch -> extrude stays attached
- `YZ` translated sketch -> extrude stays attached
- simple graph-node `Geometry/Sketch -> Geometry/Extrude` and feature-stack extrude cases agree on the same first-cut placement contract once both subphases are complete

## [ ] Extrude-2 - Node Enrichment And Toolbar Polish

### Summary

#### Purpose:
- turn the now-truthful first-pass extrude result into a more usable authored surface with a dedicated extrude toolbar

#### Owns:
- the first dedicated `Extrude` toolbar
- a richer node-facing extrude surface for the current honest single-profile seam
- toolbar, node, and console wording alignment for active extrude authoring
- a clearer user flow for reviewing profile target, depth, and direction without widening the kernel contract yet

#### Does not own:
- reopening the landed `Extrude-1A` placement repair
- the full graph-node versus feature-stack contract cleanup from `Extrude-1B`
- plural profile-input rollout
- boolean or richer extent-family behavior
- `taper/offset` runtime support unless a later contract-honesty phase explicitly takes that work

#### Current seam read:
- the viewport result is finally trustworthy enough that surface polish is now worth doing
- the current `Geometry/Extrude` node still reads as a thin proof surface compared to `Sketch`
- there is still no dedicated extrude toolbar, so the user has no single focused place to review or tweak active extrude authoring
- the first toolbar must stay honest to the currently supported runtime contract instead of exposing future-only controls too early

Current strongest read:
- the next highest-value extrude improvement is no longer another placement fix
- it is a clearer authored surface centered on one dedicated extrude toolbar, one direct node-level launcher button, and better node polish

#### Sub-phase breakdown:
- `[x] Extrude-2.1 - Extrude Input Pin Template Parity`
  - first dedicated execution slice inside `Extrude-2`
  - owns matching the `ExtrusionProfile` row and pin to the decent managed sketch-row language already visible on `SketchPlane` and `SketchDraw`
  - dedicated future doc:
    - `Future/Extrude_Phase Extrude-2.1 - Extrude Input Pin Template Parity.md`

### Questions

#### [x] Question 1 - Should the first enrichment phase create a dedicated extrude toolbar?

##### Locked answer
- yes

##### Why
- `Extrude` now has a trustworthy viewport result and needs a matching authored control surface
- the current node-only surface is too thin for repeated day-to-day extrude authoring

#### [x] Question 2 - Should the new toolbar become the durable source of truth for extrude data?

##### Locked answer
- no
- the graph node and store remain the durable source of truth
- the toolbar is the active authoring surface layered on top of that stored node data

##### Why
- this keeps the repo aligned with the existing authored-graph truth model
- it avoids creating a second hidden extrude state model

#### [x] Question 3 - What should the first toolbar expose?

##### Locked answer
- expose only the currently honest first-pass controls:
  - current profile target summary
  - profile re-pick / review entry
  - depth
  - direction / flip
  - lightweight start / review / commit flow affordances
- defer future-only controls until they are backed by a real runtime contract

##### Why
- the first toolbar should make the current extrude seam easier to use, not pretend the later feature family is already shipped
- honest narrower controls are better than another surface with visible no-op debt

#### [x] Question 4 - Should `Extrude-2` wait for `Extrude-1B`?

##### Locked answer
- no
- `Extrude-2` can begin now as long as it stays inside the current honest single-profile runtime surface

##### Why
- the user-facing toolbar and node polish do not need to wait for the full later contract-convergence lane
- this keeps the next improvement focused on workflow quality while `Extrude-1B` remains the deeper contract-honesty follow-on

### Spec

Locked first-cut direction:
- create one dedicated extrude toolbar as the main active extrude authoring surface
- keep the graph node as the durable authored truth
- align toolbar labels, node summary text, and console wording around the same first-pass single-profile contract
- keep the first toolbar honest to the already-supported runtime behavior
- do not widen this phase into boolean, plural profile, or no-op parameter growth

Likely implementation seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- one new dedicated extrude-toolbar surface and its host wiring near the existing workspace or spaghetti toolbar surfaces

Suggested execution order:
1. Keep the landed `Extrude-2.1` row-and-pin polish under regression coverage.
2. Define the first toolbar shell and how it activates from the current extrude node flow.
3. Mirror the honest current extrude controls into that toolbar:
   - profile target summary
   - depth
   - direction / flip
4. Refresh node summary text so the node and toolbar describe the same authored state.
5. Keep `taper/offset` and richer extent controls out of the first toolbar unless the underlying runtime contract becomes honest first.
6. Add focused UI coverage for toolbar visibility, node-toolbar sync, and unchanged extrude build behavior.

Acceptance checks:
- the user has one dedicated toolbar for active extrude authoring
- the toolbar and node surface describe the same current extrude state
- the first toolbar exposes only honest currently supported controls
- the landed authored-plane and preview-alignment fixes remain unchanged by the new surface work

Definition of done:
- `Geometry/Extrude` no longer relies only on a thin node surface for everyday authoring
- the first extrude toolbar exists and feels aligned with the current runtime truth
- later contract cleanup can still proceed separately through `Extrude-1B`

## [ ] Extrude-3 - Type Modes And Functional Completion

### Summary

#### Purpose:
- stack the remaining authored tasks needed to make `Extrude` work more like a real feature instead of staying a thin depth-first proof surface

#### Owns:
- the first explicit feature-completion task stack after the landed placement repair
- adding `Type` as a real authored extrude selector
- defining what `Body` and `Profile` mean before more extrude controls widen the drift

#### Does not own:
- reopening `Extrude-1A`
- replacing the broader `Extrude-2` toolbar shell work
- plural `EWR` profile rollout
- boolean family growth

#### Current strongest read:
- after placement truth and the first row/template work, the next missing authored lever is `Type`
- that should become explicit before more extrude feature surface grows around an implied always-body contract

#### Dedicated future doc:
- `Future/Extrude_Phase Extrude-3 - Type Modes And Functional Completion.md`
- `Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`

## [x] Extrude-4 - Closed Profile Selection And Consumption Contract

### Summary

#### Purpose:
- define how `Geometry/Extrude` should consume closed profiles honestly now that the first narrow worker-authoritative closed-profile `Body` path already exists

#### Owns:
- the first explicit parent-versus-child closed-profile consumption contract for `Geometry/Extrude`
- deciding what wiring the parent `SketchProfiles` output versus one child closed profile should mean
- keeping closed-profile selection ownership in `Extrude` while upstream profile derivation stays in `Sketch`
- the first honest surface/runtime wording for one-selected-profile versus all-closed-profiles consumption

#### Does not own:
- reopening the already-landed narrow worker-authoritative B-rep groundwork
- open-path or wall-style extrusion behavior
- broader sketch-output cleanup beyond the minimum handoff needed from `Sketch - 2`
- boolean/body-operation growth
- unrelated toolbar polish that still belongs to `Extrude-2`

#### Current strongest read:
- this lane is now shipped for the current closed-profile subset
- `Geometry/Extrude` now distinguishes and executes:
  - one selected child closed profile
  - the parent `SketchProfiles` aggregate as all closed profiles from the source sketch
- aggregate compile, draft-runtime, authoritative, and visible-surface seams now read intentionally aligned for that shipped subset
- current status:
  - `Phase 1 - Closed Profile Reference And Surface Contract`
    - shipped
  - `Phase 2A - Explicit Aggregate Selection Payload Contract`
    - shipped
  - `Phase 2B - Compile Graph And Geometry Request Routing`
    - shipped
  - `Phase 2C - Worker Selection Resolution And Failure Honesty`
    - shipped
  - `Phase 3A - SolidBody Result Ownership For Aggregate Consumption`
    - shipped
  - `Phase 3B - Node Toolbar And Result Copy Honesty`
    - shipped
  - `Phase 3C - Focused Verification And Failure Matrix Hardening`
    - shipped
  - family handoff:
    - closed for the current closed-profile subset
    - future open-path, wall, or broader sketch-surface work should live in separate follow-on docs

#### Dedicated future doc:
- `Future/Extrude_Phase Extrude-4 - Closed Profile Selection And Consumption Contract.md`
  - historical closeout doc for the shipped `Extrude-4` lane

## [ ] Extrude-5 - Output Row Standardization And UI Cleanup

### Summary

#### Purpose:
- make the `Geometry/Extrude` `SolidBody` output row look like the shared standardized output-row template instead of a one-off custom block

#### Owns:
- the first dedicated extrude cleanup for the `SolidBody` output-row shell
- aligning label lane, value/status lane, pin placement, border treatment, and attached helper body with the calmer shared row language already expected across nodes
- proving the first extrude-side adoption slice for the broader `Nodes-3` output-row standardization direction
- making the waiting/help copy feel attached to one reusable output row instead of a separate floating card

#### Does not own:
- changing extrude compile/runtime behavior
- changing result ownership or adding new output kinds
- reopening `Extrude-4` closed-profile selection semantics
- broad all-node rollout beyond locking the first extrude proving slice

#### Current strongest read:
- the input side has moved much closer to the shared row-template language, but the output side still reads like a custom tile plus detached note
- the current `SolidBody` row should become one calmer standardized output row with an attached body, not a visually separate widget living under `Outputs`
- `Extrude` is the right first proving slice because it already has one stable visible output and a clear before/after mismatch against the intended shared node language

### Questions

#### [x] Question 1 - Should `Extrude-5` stay a UI cleanup phase instead of widening into result-contract work?

##### Locked answer
- yes

##### Why
- the current problem is row-template drift, not missing geometry ownership
- keeping this lane UI-only prevents output-row polish from reopening already-shipped compile/runtime decisions

#### [x] Question 2 - What should the first cleanup target be?

##### Locked answer
- the `SolidBody` output row plus its attached waiting/help body

##### Why
- that is the visible mismatch on the current `Geometry/Extrude` surface
- fixing one stable output row first is the cleanest way to prove the standardized template before widening to other nodes

#### [x] Question 3 - Should `Extrude-5` be treated as part of the broader shared-node row direction?

##### Locked answer
- yes
- `Extrude-5` should act as one family-owned proving slice under the broader `Nodes-3` output-row standardization direction

##### Why
- this keeps the repo aligned with the shared `Structured Wire Rows` goal instead of inventing another extrude-only output style
- the extrude family can prove the row cleanup locally without pretending the all-node rollout is already complete

### Spec

Locked first-cut direction:
- rebuild the current `SolidBody` output area around one standardized output-row template
- keep one visible `SolidBody` output row first instead of widening into multiple result rows
- align the output row shell with the calmer shared row treatment already proven on the stronger input rows
- keep the helper/waiting copy visually attached to that row as its body instead of a detached second block
- use this phase as the first extrude-owned `Nodes-3` adoption slice, not as a separate custom output-system fork

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- any shared node-row/output-row helper seams that currently own the standardized row template for other node surfaces

Acceptance checks:
- the `SolidBody` output row reads like the same family as the settled shared row template
- the output pin placement and row shell no longer feel like a custom tile
- the attached waiting/help body reads as part of the output row instead of a separate floating panel
- `Extrude` output semantics stay unchanged while the visible row structure becomes cleaner

Definition of done:
- `Geometry/Extrude` no longer ships one-off output-row chrome beside otherwise standardized input rows
- the family now has one explicit planning home for output-row cleanup before that same template language widens across all nodes
