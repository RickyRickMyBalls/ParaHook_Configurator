# Model Viewport

## Doc Header

### Doc History
54. 2026-05-11 20:13: Marked `Model-Viewport-3 / Phase 8 - Render Settings Runtime Wiring` shipped inside the dedicated future doc after the repo passed Phase 6 render-preview settings into the path-tracer runtime adapter, mapped samples/bounces/render-scale/noise-cleanup/GPU-load to backend settings, restarted active accumulation on quality changes, kept settings inert outside Render Preview, and added focused runtime/HUD proof.
53. 2026-05-11 20:05: Tightened `Model-Viewport-3 / Phase 8 - Render Settings Runtime Wiring` inside the dedicated future doc into an implementation-ready runtime slice around passing Phase 6 `ViewSettings.renderPreview` settings into the render-preview runtime, mapping the values to `three-gpu-pathtracer`, resetting active accumulation on quality changes, keeping settings changes inert outside Render Preview, and preserving export/render-queue deferrals.
52. 2026-05-11 20:03: Marked `Model-Viewport-3 / Phase 7 - Properties Render Section` shipped inside the dedicated future doc after the repo added a global no-focused-item Properties `Render` section, preserved object-scoped `Materials`, wired Phase 6 render-preview settings into ParaSlider and ParaSelect controls, and left runtime settings application to Phase 8.
51. 2026-05-11 19:48: Tightened `Model-Viewport-3 / Phase 7 - Properties Render Section` inside the dedicated future doc into an implementation-ready Properties UI slice around adding a global no-focused-item `Render` section beside object-scoped `Materials`, reusing Phase 6 render-preview settings through ParaSliders and ParaSelects, and deferring runtime settings application to Phase 8.
50. 2026-05-11 19:44: Marked `Model-Viewport-3 / Phase 6 - Render Preview Settings Contract` shipped inside the dedicated future doc after the repo added a nested `ViewSettings.renderPreview` contract, normalized render-preview quality defaults/options, view-settings persistence carry-through, focused store/persistence proof, and aligned the runtime default sample constant while leaving Properties UI and runtime settings application to later phases.
49. 2026-05-11 19:34: Tightened `Model-Viewport-3 / Phase 6 - Render Preview Settings Contract` inside the dedicated future doc into an implementation-ready contract slice around a nested `ViewSettings.renderPreview` owner, deterministic defaults and normalization, persistence-policy carry-through, focused store/persistence proof, and explicit deferral of Properties UI plus runtime settings application to later phases.
48. 2026-05-11 19:30: Extended the dedicated `Model-Viewport-3` future doc with `Phase 6` through `Phase 9` for render-preview cleanup, covering a render settings contract, a Properties workspace `Render` section using ParaSliders and ParaSelects where practical, runtime settings wiring, quality presets, and explicit deferral of export/render-queue/output-file work.
47. 2026-05-11 19:21: Marked `Model-Viewport-3 / Phase 5 - Progressive Render Preview Backend` shipped inside the dedicated future doc after the repo added a `three-gpu-pathtracer` adapter boundary, viewer-owned render-preview sample progress and completion callbacks, Phase 4 HUD-store forwarding, reset-on-camera/scene/view/resize behavior, unsupported fallback reporting, focused mocked-backend tests, and build verification.
46. 2026-05-11 19:02: Tightened `Model-Viewport-3 / Phase 5 - Progressive Render Preview Backend` inside the dedicated future doc into an implementation-ready first backend pass around a `three-gpu-pathtracer` adapter, real sample progress reporting through the Phase 4 HUD contract, reset-on-camera/scene-change semantics, mocked viewer proof, and no render export, queue, or WebGPU migration work in this slice.
45. 2026-05-11 18:38: Marked `Model-Viewport-3 / Phase 4 - Render Preview Status And HUD Contract` shipped inside the dedicated future doc after the repo added the viewport-local render-preview status contract, compact HUD state readout and progress track, ViewerHost stale/reset hooks, focused store/HUD tests, and left `Phase 5 - Progressive Render Preview Backend` as the next open implementation step.
44. 2026-05-11 18:23:47: Tightened `Model-Viewport-3 / Phase 4 - Render Preview Status And HUD Contract` inside the dedicated future doc into an implementation-ready viewport-local status pass around the existing `renderPreview` display mode, compact `ViewportOverlay` HUD, viewport overlay styling, a likely render-preview status store, explicit stale/reset semantics, focused HUD/store tests, and no progressive backend work before Phase 5.
43. 2026-05-11 18:20:36: Marked `Model-Viewport-3 / Phase 3 - Fast Display Mode Viewer Application` shipped inside the dedicated future doc after the viewer added in-place Solid, Wireframe, Material, Rendered, and Render Preview fallback presentation behavior through `Viewer.applyViewSettings(...)`, preserved render-layer geometry identity, and added focused `Viewer.test.ts` proof while leaving render-preview HUD/progress/backend work for later phases.
42. 2026-05-11 18:14:40: Tightened `Model-Viewport-3 / Phase 3 - Fast Display Mode Viewer Application` inside the dedicated future doc into an implementation-ready viewer presentation pass around `Viewer.applyViewSettings(...)`, existing material cache assignment, in-place wireframe/material/solid/rendered mode application, no render-layer rebuilds, focused `Viewer.test.ts` proof, and explicit deferral of render-preview HUD/progress/backend behavior.
41. 2026-05-11 18:10:16: Marked `Model-Viewport-3 / Phase 2 - Shift+D Radial Menu` shipped inside the dedicated future doc after the repo added active-viewer-gated display-mode shortcut routing, a viewport-local radial menu overlay, owner-backed display-mode selection through UI preferences, focused interaction proof, and build verification while leaving live Three.js visual mode application as the next open phase.
40. 2026-05-11 18:01:28: Marked `Model-Viewport-3 / Phase 1 - Display Mode Contract` shipped inside the dedicated future doc after the shared view settings contract gained normalized display modes, legacy wireframe migration, UI preferences setter synchronization, persistence-policy carry-through, and focused store/persistence proof while keeping radial menu and viewer visual application deferred
39. 2026-05-11 16:39:36: Added the dedicated future doc `Future/Model-Viewport_Phase Model-Viewport-3 - Display Mode Radial Menu And Render Preview.md`, reserving the presentation-mode follow-on for a `Shift+D` radial display-mode menu, Solid/Wireframe/Material/Rendered modes, and a fifth render-preview mode with iteration progress in the viewport HUD while keeping display mode separate from `Auto / Draft / Final` result policy
38. 2026-04-18 10:45:51: Marked `Model-Viewport-2 / Phase 5 - Full Primary Workspace Reassignment Coverage` shipped inside the dedicated `Model-Viewport-2` child doc after the repo retired the remaining primary-slot target limits, widened the shared primary-slot workspace coverage to the remaining slotted surfaces through the existing titlebar type submenu path, and completed the current `Model-Viewport-2` ladder while still leaving `Home Page` ownership and startup semantics with the `Home Page` family
37. 2026-04-18 10:38:12: Marked `Model-Viewport-2 / Phase 4 - Restore And Zero-Viewer Honesty` shipped inside the dedicated `Model-Viewport-2` child doc after the repo added one shared active-surface resolver, taught both live store transitions and persisted-layout normalization to re-resolve active workspace ownership to real surviving model viewers or the honest current primary-slot surface, and advanced the later lane so `Phase 5 - Full Primary Workspace Reassignment Coverage` is now the next open step
36. 2026-04-18 10:20:49: Updated the dedicated `Model-Viewport-2` child planning lane to add `Phase 5 - Full Primary Workspace Reassignment Coverage` after the existing restore and zero-viewer honesty pass, reserving the later "switch the main slot to any supported workspace surface" widening as its own explicit follow-up instead of folding it into `Phase 4`
35. 2026-04-18 10:14:29: Marked `Model-Viewport-2 / Phase 3 - Primary Catalog Switch Action` shipped inside the dedicated `Model-Viewport-2` child doc after the repo widened the shared primary-slot supported-surface allowlist to include `Catalog`, let the existing titlebar type submenu dispatch that primary-slot `Catalog` action, and added focused workspace-store plus viewport-menu proof while keeping the remaining unsupported primary targets disabled
34. 2026-04-18 10:04:42: Updated the dedicated `Model-Viewport-2` child planning lane to add `Phase 3 - Primary Catalog Switch Action` as one explicit follow-up after the shipped Browser-first submenu unlock, reserving `Catalog` support as its own narrow widening step and moving the old restore plus zero-viewer closeout to `Phase 4`
33. 2026-04-18 09:58:07: Marked `Model-Viewport-2 / Phase 2 - Main Viewport Switch Action` shipped inside the dedicated `Model-Viewport-2` child doc after the repo enabled primary-slot `Browser` through the existing titlebar viewport-type submenu in `ViewportFrame.tsx`, kept unsupported primary targets disabled, and added focused `ViewportFrame.test.tsx` proof while preserving the already-shipped shared primary-slot reassignment contract underneath
32. 2026-04-18 09:30:19: Marked `Model-Viewport-2 / Phase 1 - Primary Slot Reassignment Contract` shipped inside the dedicated `Model-Viewport-2` child doc after the repo added one explicit primary-slot supported-surface contract, let the shared slot-surface seam switch the primary slot to supported `browser` after startup, preserved the startup default primary `modelViewer`, and added focused workspace-store proof while keeping menus, persistence, and zero-viewer handoff deferred to later `2.x` phases
31. 2026-04-17 21:40:14: Added the dedicated future doc `Future/Model-Viewport_Phase Model-Viewport-2 - Primary Viewport Workspace Reassignment.md`, turning the newly-reserved later `Model-Viewport 2` follow-on into one real planning home with an initial small phase ladder around retiring the protected-main-viewer rule, letting the primary slot switch to another workspace surface, and keeping persistence plus zero-viewer handoff honest
30. 2026-04-17 21:38:04: Added the later family follow-on `Model-Viewport 2 - Primary Viewport Workspace Reassignment`, reserving one explicit model-viewport phase for letting the user switch the current main `Model Viewport` slot to another workspace surface without pretending that the still-open `1.3` geometry/export ladder is no longer the next honest handoff
29. 2026-04-07 08:30: Marked `Model-Viewport 1.3 Phase 6C - Backend Failure Honesty And Focused Verification` shipped inside the dedicated `1.3` child doc after the authoritative worker seam adopted honest `null` fallback handling for OC boot/build failures, released minted `shape_set` handles on rejected bundle assembly, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`
28. 2026-04-07 08:00: Marked `Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration` shipped inside the dedicated `1.3` child doc after the repo bound the authoritative worker seam to the real OC boot helper, resolved worker-side `shape_set` registration around retained backend resources, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 6C - Backend Failure Honesty And Focused Verification`
27. 2026-04-07 07:33: Marked `Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding` shipped inside the dedicated `1.3` child doc after the repo added the real stable `opencascade.js` worker dependency, replaced the placeholder `ocInit.ts` seam with a typed memoized worker-local OC boot helper, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 6B - First Authoritative Retained Result And Shape-Set Registration`
26. 2026-04-07 07:21: Re-split the dedicated `Model-Viewport 1.3` child doc's old oversized `Phase 6 - First Concrete Authoritative Backend Binding` into `Phase 6A / 6B / 6C`, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding`
25. 2026-04-07 07:13: Marked `Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract` shipped inside the dedicated `1.3` child doc after the repo extracted a dedicated worker-owned authoritative builder seam beside `buildModel.ts`, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 6 - First Concrete Authoritative Backend Binding`
24. 2026-04-07 06:17: Marked `Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy` shipped inside the dedicated `1.3` child doc after the repo taught `useAppStore.ts` to resolve explicit build intent from active-viewer viewport mode plus browser policy context, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 5 - Worker-Owned Authoritative Adapter Contract`
23. 2026-04-07 06:00: Marked `Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup` shipped inside the dedicated `1.3` child doc after the repo removed pseudo-authoritative draft promotion, made store-level stale authoritative-handle release unconditional on rejection paths, and refreshed this family handoff so the next honest model-viewport step now points at `Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy`
22. 2026-04-07 05:40: Re-reviewed the dedicated `Model-Viewport 1.3` child doc after the broad shipped `Phase 2` landing, then re-split the remaining `1.3` work from one oversized old `Phase 3 - Export Handoff From Authoritative Geometry` into `Phase 3` through `Phase 11` so this family handoff now points next at `Phase 3 - Honest Authoritative Boundary Cleanup` and treats export as a later staged ladder instead of one final oversized chunk
21. 2026-04-07 05:29: Marked `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption` shipped inside the dedicated `1.3` child doc after the repo added explicit shared authoritative build intent, live side-by-side retained draft and authoritative geometry adoption, and first authoritative-handle release rules, then refreshed this family handoff so the next honest `Model Viewport` step now points at `Phase 3 - Export Handoff From Authoritative Geometry`
20. 2026-04-07 04:49: Tightened `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption` inside the dedicated `1.3` child doc into an implementation-ready next slice by locking the first live authoritative producer to a worker branch beside the current draft path, requiring side-by-side retained draft and authoritative state, and refreshing this family handoff so the next honest model-viewport task now reads as shipping that first real authoritative retained-result path
19. 2026-04-07 04:45: Marked `Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary` shipped inside the dedicated `1.3` child doc after the repo widened the shared retained-result contract to support authoritative-capable bundles while keeping the live producer truth draft-only, and refreshed this family handoff so the next honest model-viewport step now moves into `Phase 2 - Authoritative Execution Path And Retained Result Adoption`
18. 2026-04-07 04:34: Added the dedicated child doc `Future/Model-Viewport_Phase Model-Viewport-1.3 - Authoritative Geometry Execution And Export Handoff.md`, split that authoritative follow-on into internal `Phase 1 / 2 / 3`, tightened `Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary` into the next implementation-ready model-viewport slice, and refreshed this family handoff so `Model-Viewport 1.3` now has its own planning home instead of living only as an open umbrella block
17. 2026-04-07 04:28: Marked `Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` shipped inside the dedicated `1.2` child doc after the repo turned the dead model-viewport `-` button into a real `A / D / F` control, added the first selector-owned geometry-status HUD read, and refreshed this family handoff so `Model-Viewport 1.3 - Authoritative Geometry Execution And Export Handoff` now reads as the next honest follow-on
16. 2026-04-07 04:18: Tightened `Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` inside the dedicated `1.2` child doc into an implementation-ready next slice by grounding the dead top-left mode control in the actual `ViewportFrame` header-button seam, locking the first small viewport-visible status badge, and refreshing this family handoff so the next honest `Model Viewport` task now reads as wiring `A / D / F` plus selector-owned status honesty
15. 2026-04-07 04:14: Marked `Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation` shipped inside the dedicated `1.2` child doc after the repo added one selector-owned viewport result-state seam and moved `ViewerHost` onto that derived draft/final/fallback read model, and refreshed this family handoff so `Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` now reads as the next honest model-viewport task
14. 2026-04-06 17:35: Tightened `Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation` inside the dedicated `1.2` child doc into an implementation-ready next slice by grounding it in the current retained-geometry plus artifact-preview seams, locking the first pending/fallback behavior, and refreshing this family handoff so the next honest model-viewport task now points at that sharpened Phase 2
13. 2026-04-06 16:59: Marked `Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership` shipped inside the dedicated `1.2` child doc after the repo added one viewport-local `Auto / Draft / Final` result-mode seam plus explicit behavior selectors and persistence proof, and refreshed this family handoff so `Phase 2 - Draft/Final Selection And Swap State Derivation` now reads as the next honest model-viewport follow-on
12. 2026-04-06 16:52: Tightened `Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership` inside the dedicated `1.2` child doc into an implementation-ready next slice by locking the first viewport-local `Auto / Draft / Final` ownership and execution/display recommendations, and refreshed this family handoff so the next honest implementation step now points at that sharpened Phase 1 instead of a fully open `1.2`
11. 2026-04-06 16:41: Added the dedicated child doc `Future/Model-Viewport_Phase Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules.md`, split that viewport-behavior follow-on into internal `Phase 1 / 2 / 3`, and refreshed this family handoff so the next open `Model Viewport` lane now has a real implementation-ready planning home instead of living only inside the umbrella `Model-Viewport-1` doc
10. 2026-04-06 16:08: Marked `Model-Viewport 1.1 Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup` shipped in the dedicated child doc after the repo closed the last small retained-geometry compatibility and boundary gaps, and refreshed this family handoff so `Model-Viewport 1.2 - Draft Preview Execution And Viewport Swap Rules` remains the next open follow-on from a cleaner `1.1`
9. 2026-04-06 14:09: Marked `Model-Viewport 1.1 Phase 4 - Retained Result Adoption And Boundary Cleanup` shipped in the dedicated child doc after the repo carried the retained geometry-result bundle through the live worker/build/store path, narrowed the retained contract to the current honest `draft + ok` producer truth, and refreshed this family handoff so `Model-Viewport 1.2 - Draft Preview Execution And Viewport Swap Rules` is again the next open follow-on
8. 2026-04-06 13:54: Reopened the `Model-Viewport 1.1` child lane with a narrow new `Phase 4 - Retained Result Adoption And Boundary Cleanup`, tightened that follow-on in the dedicated child doc, and refreshed this family handoff so the next honest step stays inside `1.1` long enough to close the retained-result adoption gaps review found before `1.2` begins
7. 2026-04-06 13:46: Marked `Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract` shipped in the dedicated child doc after the repo inserted one retained `GeometryResultBundle` layer between raw worker execution and downstream artifact/build-output routing, and refreshed this family handoff so `Model-Viewport 1.2 - Draft Preview Execution And Viewport Swap Rules` now reads as the next open model-viewport follow-on
6. 2026-04-06 13:25: Marked `Model-Viewport 1.1 Phase 2 - Shared Geometry Request / IR Contract` shipped in the dedicated child doc after the repo extracted one shared geometry request contract across both compile paths and the draft worker runtime, and refreshed the family handoff so `Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract` now reads as the next active contract task
5. 2026-04-06 12:57: Marked `Model-Viewport 1.1 Phase 1 - Current Seam Audit` shipped in the dedicated `Model-Viewport-1.1` child doc, and refreshed the family handoff so the first open contract task now reads as `Phase 2 - Shared Geometry Request / IR Contract` instead of leaving all three internal `1.1` phases equally untouched
4. 2026-04-06 12:49: Added the dedicated child phase `Model-Viewport-1.1 - Shared Geometry IR And Result Contract`, split that foundational contract lane into internal `Phase 1 / Phase 2 / Phase 3` sections, and refreshed the family handoff so the next honest tightening step now points at that new child-doc home instead of only referencing `1.1` inline
3. 2026-04-06 12:46: Added the first concrete model-viewport mode recommendation to the family index, locking the dead top-left three-state control as `Auto / Draft / Final` instead of the vaguer `On / Off`, and clarifying that those modes should act as real display-plus-execution policy over draft preview versus authoritative geometry
2. 2026-04-06 11:36: Reformatted this `Model Viewport` family index into the same umbrella-index shape used by stronger family docs such as `extrude-index`, so the geometry-overhaul direction now reads as a real family summary with `Short Version`, `Current Reality`, `Current Code Read`, `Main Architecture Direction`, and an explicit `Model-Viewport-1` phase handoff instead of a lighter placeholder scaffold
1. 2026-04-06 11:36: Created this folderized `Model Viewport` workspace-family home, added the first `Model-Viewport 1` future phase doc, and set the family direction around a geometry-execution reset where fast preview, authoritative B-rep-capable execution, and later clean `.step` export can meet under one honest model-viewport surface

### Purpose

This doc defines the architecture direction for the ParaHook `Model Viewport` family.

Use it to answer:
- what `Model Viewport` is supposed to own in ParaHook
- how model-viewport display behavior should relate to draft preview versus authoritative geometry truth
- how later export handoff should relate to viewport-visible geometry without making the viewport the hidden owner of geometry semantics
- what belongs to the early geometry-overhaul phase versus later follow-ons
- how future `Model Viewport` planning should be split into standalone `Shipped/` and `Future/` phase docs

### Why This Doc Exists

The workspace family already treats `Model Viewport` as a first-class hosted surface.

The repo also already has a fast graph-native geometry path:
- graph compile can produce runtime-facing feature payloads
- the worker can build first-pass extruded meshes
- the viewer can render those results quickly

But the longer-range geometry contract is still thin:
- the current graph-native path is mesh-first
- there is no explicit shared result-class contract for `draft` versus `authoritative` geometry
- there is no viewport-owned preview policy for choosing when draft work should run
- there is not yet one authoritative geometry handoff that later clean `.step` export can trust

This doc exists so later model-viewport and geometry-overhaul work can land against one clear family/index surface instead of continuing as isolated notes spread across `Vision`, `Worker`, `Export`, and the broader workspace umbrella.

### Scope

This doc covers:
- the future role of `Model Viewport` as the live geometry review surface
- the ownership boundary between draft preview display and authoritative geometry truth
- the main request/result seams that need to become explicit before two-speed geometry execution can stay honest
- the first phase structure for later `Shipped/` and `Future/` model-viewport geometry docs

This doc does not cover:
- detailed implementation for any one future model-viewport phase
- detailed camera behavior already owned by `Camera-Controls`
- final export-toolbar behavior already owned by `Export`
- the final kernel-library choice by itself

## Doc Body

### Short Version

ParaHook should treat `Model Viewport` as the honest meeting point between:
- graph-authored geometry intent
- fast draft preview during interaction
- authoritative slower geometry execution
- later clean CAD export handoff

The immediate dedicated follow-on docs for that stack are:
- `Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path`
- `Model-Viewport-1.1 - Shared Geometry IR And Result Contract`
- `Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules`
- `Model-Viewport-1.3 - Authoritative Geometry Execution And Export Handoff`

The next later family follow-on reserved here is:
- `Model-Viewport-2 - Primary Viewport Workspace Reassignment`
- `Model-Viewport-3 - Display Mode Radial Menu And Render Preview`

The current `Model-Viewport-1` status is:
- umbrella phase created
- child ladder locked:
  - `Model-Viewport 1.1 - Shared Geometry IR And Result Contract`
  - `Model-Viewport 1.2 - Draft Preview Execution And Viewport Swap Rules`
  - `Model-Viewport 1.3 - Authoritative Geometry Execution And Export Handoff`
- current handoff:
  - `Model-Viewport-1.1` now has its own dedicated future doc
  - `Model-Viewport-1.2` now has its own dedicated future doc
  - `Model-Viewport-1.3` now has its own dedicated future doc
  - internal status there is now:
    - `Phase 1 - Current Seam Audit`
      - shipped
    - `Phase 2 - Shared Geometry Request / IR Contract`
      - shipped
    - `Phase 3 - Shared Geometry Result Contract`
      - shipped
    - `Phase 4 - Retained Result Adoption And Boundary Cleanup`
      - shipped
    - `Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup`
      - shipped
  - internal status in `Model-Viewport-1.2` is now:
    - `Phase 1 - Viewport Result Mode Contract And Ownership`
      - shipped
    - `Phase 2 - Draft/Final Selection And Swap State Derivation`
      - shipped
    - `Phase 3 - Top-Left Mode Control And User-Facing Status Honesty`
      - shipped
  - internal status in `Model-Viewport-1.3` is now:
    - `Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary`
      - shipped
    - `Phase 2 - Authoritative Execution Path And Retained Result Adoption`
      - shipped
    - `Phase 3 - Honest Authoritative Boundary Cleanup`
      - shipped
    - `Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy`
      - shipped
    - `Phase 5 - Worker-Owned Authoritative Adapter Contract`
      - shipped
    - `Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding`
      - shipped
    - `Phase 6B - First Authoritative Retained Result And Shape-Set Registration`
      - shipped
    - `Phase 6C - Backend Failure Honesty And Focused Verification`
      - shipped
    - `Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`
      - open
    - `Phase 8 - Export Input Contract From Authoritative Results`
      - open
    - `Phase 9 - Export Gating And On-Demand Authoritative Preparation`
      - open
    - `Phase 10 - STEP Writer Adapter And Worker Export Operation`
      - open
    - `Phase 11 - Export Handoff Status, Verification, And 1.3 Closeout`
      - open
  - next honest handoff:
    - `Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`

Important rule:
- the viewport should display geometry states
- it should not become the hidden owner of geometry truth

The next real `Model Viewport` work should center on:
- a real preview policy:
  - `Auto`
  - `Draft`
  - `Final`
- viewport swap rules for draft versus authoritative result replacement
- later authoritative geometry handoff and clean `.step` export staying downstream from the retained geometry-result family
- the first authoritative-capable retained-result contract and placeholder boundary before real engine work widens
- later primary-slot workspace reassignment so the user can switch the main `Model Viewport` to another workspace surface without the shell forcing one protected viewer to remain in place
- later display-mode and render-preview presentation so the user can choose Solid, Wireframe, Material, Rendered, or progressive Render Preview without changing geometry/build truth

### Core Naming Decisions

Use these terms:

- `Model Viewport`
  - the hosted workspace surface where the user inspects live geometry
- `Draft Preview`
  - a fast geometry result intended for interactive edits
- `Authoritative Geometry`
  - the slower geometry result intended to become the durable truth for later export and higher-fidelity execution
- `Preview Policy`
  - the user-facing execution policy that decides when draft preview work should run
- `Auto / Draft / Final`
  - the recommended three-state model-viewport mode labels for the current dead top-left control
- `Geometry Request Contract`
  - the neutral request / IR shape between graph compile and geometry execution
- `Geometry Result Contract`
  - the neutral result bundle shape between geometry execution and downstream viewport/export consumers

Important rule:
- preview policy is not only a visibility toggle
- `Final` should mean skipping draft execution work and prioritizing authoritative geometry, not merely hiding a generated preview artifact

### Current Reality

Right now the repo already has a meaningful first geometry-review seam:
- graph-native geometry compile exists
- the worker can build fast first-pass meshes
- the viewport can show those results quickly
- imported STEP references can also be viewed in the app through the existing import path

But the current system is still underdeveloped:
- it is still the first honest fast geometry seam, not the final geometry architecture
- the runtime result is still mesh-first rather than authoritative B-rep-capable truth
- there is still no explicit result-class split between:
  - `draft`
  - `authoritative`
- there is still no viewport-owned policy for when preview work should run during slider drags and other high-frequency edits
- the current dead top-left three-state control is an available surface for this future policy
- export still does not have one authoritative geometry handoff to consume

### Current Code Read

The current code read matters because some geometry assumptions are now stale.

- the repo already has a useful fast draft base:
  - `src/app/spaghetti/compiler/compileGraph.ts`
    - compiles graph-authored geometry into a runtime-facing feature payload
  - `src/worker/cad/featureStackRuntime.ts`
    - executes the current graph-native geometry payload
  - `src/worker/cad/cadKernelAdapter.ts`
    - builds the current mesh-first geometry very directly
  - `src/worker/cad/cadTypes.ts`
    - exposes the current mesh result contract
- the import-side CAD seam is already broader than the authored geometry seam:
  - `src/viewer/stepReferenceLoader.ts`
    - proves the repo can consume STEP imports through `occt-import-js`
- the vision docs now require a stricter long-range truth model:
  - `docs/Vision.md`
  - `docs/Human-Plans/roadmap/Vision-roadmap.md`
    - now explicitly say preview meshes and clean export outputs should stay downstream from one executed geometry truth

The next main blocker is no longer "can we preview anything at all?"

The next main blocker is contract split:
- the current fast mesh-first path is useful, but it is not yet explicitly named as `draft`
- there is no shared authoritative result shape yet
- there is no explicit viewport swap policy between stale, loading, draft, and authoritative states
- there is no explicit export handoff from authoritative geometry truth

### Main Architecture Direction

#### 1. `Model Viewport` Should Become The Honest Geometry Review Surface

`Model Viewport` should eventually read as the durable live-review surface for geometry state with explicit ownership over:
- showing draft versus authoritative result class honestly
- exposing preview policy to the user
- swapping or preserving geometry state during long-running builds
- staying downstream from graph-authored and worker-executed geometry truth

#### 2. Draft And Authoritative Geometry Must Share One Request/Result Contract Family

The viewport should not consume one ad hoc result shape for fast preview and another unrelated result shape for authoritative geometry.

The long-term rule should be:
- if the graph authors a geometry operation
- both the draft and authoritative paths should consume that same authored meaning
- the viewport should receive one compatible result-contract family instead of unrelated sidecar objects

#### 3. `Model Viewport` Should Stay Downstream From Geometry Execution

`Model Viewport` should display geometry truth, not invent it.

That means:
- graph compile owns authored operation meaning
- worker-side execution owns geometry production
- viewport owns display policy and honesty around those results
- later export should consume authoritative geometry truth without routing geometry semantics back through the viewport

#### 4. Preview Policy Should Be A Real Execution Policy

The intended user-facing policy model is:
- `Auto`
- `Draft`
- `Final`

Important rule:
- these should live in the current top-left three-state viewport control
- `Auto` should show draft preview immediately, then swap to authoritative geometry when it is ready
- `Draft` should show only preview geometry
- `Final` should show only authoritative geometry
- `Final` must mean skipping draft preview work and prioritizing authoritative geometry
- not simply hiding a preview that the worker still spent time generating

#### 5. Future Growth Should Be Split Into Clear Phases

Keep shipped and future `Model Viewport` geometry-overhaul work as standalone docs in:
- `Shipped/`
- `Future/`

Recommended early future phase themes:
- shared geometry request / result contract
- draft preview execution and viewport swap rules
- authoritative geometry execution and export handoff
- later primary viewport workspace reassignment after the protected-main-viewer rule is retired
- later display-mode radial menu and progressive render-preview HUD after the core result-policy seams stay honest
- later follow-ons after the first geometry-overhaul baseline proves itself

### Folder Structure

This folder should use:
- `Model-Viewport-Index.md`
  - the umbrella family index
- `Future/`
  - implementation-ready future model-viewport geometry phases
- `Shipped/`
  - shipped model-viewport geometry history

### Phase Breakdown

1. `Model-Viewport 1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path`
Reason:
- the repo needs one umbrella geometry-overhaul phase before more local preview/export decisions grow ad hoc
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`
Current status:
- open here

2. `Model-Viewport 1.1 - Shared Geometry IR And Result Contract`
Reason:
- the repo first needs one explicit request/result seam before viewport-swap rules or authoritative-build handoff can stay honest
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.1 - Shared Geometry IR And Result Contract.md`
Current status:
- `Phase 1 - Current Seam Audit` shipped there
- `Phase 2 - Shared Geometry Request / IR Contract` shipped there
- `Phase 3 - Shared Geometry Result Contract` is now shipped there
- `Phase 4 - Retained Result Adoption And Boundary Cleanup` is now shipped there

3. `Model-Viewport 1.2 - Draft Preview Execution And Viewport Swap Rules`
Reason:
- the repo next needed explicit viewport-owned result-mode meaning, selection/swap derivation, and one honest visible control/status surface
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules.md`
Current status:
- `Phase 1 - Viewport Result Mode Contract And Ownership` shipped there
- `Phase 2 - Draft/Final Selection And Swap State Derivation` shipped there
- `Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` shipped there

4. `Model-Viewport 1.3 - Authoritative Geometry Execution And Export Handoff`
Reason:
- the repo now needs one explicit authoritative result-class contract, one real authoritative execution path, and one downstream export handoff that stays tied to authoritative geometry truth
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.3 - Authoritative Geometry Execution And Export Handoff.md`
Current status:
- `Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary` shipped there
- `Phase 2 - Authoritative Execution Path And Retained Result Adoption` is shipped there
- `Phase 3 - Honest Authoritative Boundary Cleanup` is shipped there
- `Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy` is now shipped there
- `Phase 5` through `Phase 11` are now also open there as later staged follow-ons

5. `Model-Viewport 2 - Primary Viewport Workspace Reassignment`
Reason:
- the repo still protects one main `Model Viewport`, so the family needs one explicit workspace-facing follow-on for letting the user switch that main slot to another workspace surface such as `Home Page`, `Browser`, or another supported workspace without forcing a permanent model viewer anchor
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-2 - Primary Viewport Workspace Reassignment.md`
Current status:
- `Phase 1 - Primary Slot Reassignment Contract` shipped there
- `Phase 2 - Main Viewport Switch Action` shipped there
- `Phase 3 - Primary Catalog Switch Action` shipped there
- `Phase 4 - Restore And Zero-Viewer Honesty` is now shipped inside that dedicated future doc
- `Phase 5 - Full Primary Workspace Reassignment Coverage` is now shipped inside that dedicated future doc
- reserved here so the user goal of changing the main `Model Viewport` into a different workspace now has one honest planning home

6. `Model-Viewport 3 - Display Mode Radial Menu And Render Preview`
Reason:
- the repo needs one explicit presentation-mode follow-on for choosing how the currently selected model-viewport result is displayed without mixing that choice into `Auto / Draft / Final` geometry result policy
Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-3 - Display Mode Radial Menu And Render Preview.md`
Current status:
- `Phase 1 - Display Mode Contract` shipped there
- `Phase 2 - Shift+D Radial Menu` shipped there
- `Phase 3 - Fast Display Mode Viewer Application` shipped there
- `Phase 4 - Render Preview Status And HUD Contract` shipped there
- `Phase 5 - Progressive Render Preview Backend` shipped there
- `Phase 6 - Render Preview Settings Contract` shipped there
- `Phase 7 - Properties Render Section` shipped there
- `Phase 8 - Render Settings Runtime Wiring` shipped there
- `Phase 9 - Render Quality Presets And Cleanup` is now planned there
- reserved here so `Shift+D` display-mode selection, Solid/Wireframe/Material/Rendered modes, and a fifth progressive render-preview mode with HUD iteration progress have one honest planning home

## [ ] Model-Viewport 1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path

### Summary

#### Purpose:
- create one parent roadmap for the geometry-overhaul direction
- split the work into smaller children before implementation begins

#### Current read:
- this family now has one dedicated umbrella future doc instead of leaving the geometry-overhaul direction only as a summary paragraph here
- the child ladder under that doc is:
  - `1.1`
  - `1.2`
  - `1.3`
- `1.1` is already the strongest candidate for another level of subphasing

### Questions

#### [x] Question 1 - What is the first major `Model Viewport` geometry-overhaul phase?

##### Locked answer
- `Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path`

#### [x] Question 2 - Which child should tighten first?

##### Locked answer
- `Model-Viewport-1.1 - Shared Geometry IR And Result Contract`

### Spec

Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`

Definition of done:
- the family has one explicit umbrella future phase
- that future phase owns the `1.1 / 1.2 / 1.3` ladder
- the family handoff clearly points at `1.1` as the next honest tightening step

## [x] Model-Viewport 1.1 - Shared Geometry IR And Result Contract

### Summary

#### Purpose:
- give the foundational geometry-contract lane its own dedicated planning home before viewport policy and authoritative execution work widen further

#### Current read:
- this child is now the next honest tightening step under `Model-Viewport-1`
- it is now split into four internal phases:
  - `Phase 1 - Current Seam Audit`
  - `Phase 2 - Shared Geometry Request / IR Contract`
  - `Phase 3 - Shared Geometry Result Contract`
  - `Phase 4 - Retained Result Adoption And Boundary Cleanup`
- all four internal phases are now shipped there
- the next open `Model-Viewport-1` step now moves to `1.2`

### Questions

#### [x] Question 1 - Does `1.1` need to be broken into subphases?

##### Locked answer
- yes

##### Why
- it is foundational enough that audit, request contract, and result contract should not be one blurred task

### Spec

Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.1 - Shared Geometry IR And Result Contract.md`

Definition of done:
- the family has one explicit child-doc home for `1.1`
- that child doc now owns its internal `Phase 1 / 2 / 3` ladder

## [ ] Model-Viewport 2 - Primary Viewport Workspace Reassignment

### Summary

#### Purpose:
- let the user change the current main `Model Viewport` into a different workspace surface
- retire the protected-primary-viewer assumption from this family without making `Model Viewport` the owner of broader workspace-shell truth

#### Current read:
- the repo still treats one primary `Model Viewport` as a protected anchor
- the current next honest `Model Viewport` implementation handoff still remains in `Model-Viewport 1.3`
- this later phase is intentionally reserved now so the workspace-facing follow-on has one explicit family home when the repo is ready to let the primary slot switch to `Home Page` or another supported workspace surface
- `Phase 1 - Primary Slot Reassignment Contract` is now shipped in the dedicated future doc
- `Phase 2 - Main Viewport Switch Action` is now shipped in the dedicated future doc
- `Phase 3 - Primary Catalog Switch Action` is now shipped in the dedicated future doc
- `Phase 4 - Restore And Zero-Viewer Honesty` is now shipped in the dedicated future doc
- `Phase 5 - Full Primary Workspace Reassignment Coverage` is now shipped in the dedicated future doc

### Questions

#### [x] Question 1 - What should `Model-Viewport 2` own?

##### Locked answer
- the ability for the user to change the main `Model Viewport` slot to another workspace surface

##### Why
- that behavior currently conflicts with the protected-primary-viewer rule, so it needs one explicit ownership home instead of staying an undocumented shell restriction

### Spec

Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-2 - Primary Viewport Workspace Reassignment.md`

Definition of done:
- the family has one explicit later phase reserved for primary-slot workspace reassignment
- that phase is scoped to switching the main `Model Viewport` slot to another supported workspace surface
- that phase does not pretend `Model Viewport` now owns broader workspace-shell routing, project truth, or `Home Page` ownership
- that phase now has its own dedicated future-doc planning home instead of living only as an inline placeholder here

## [ ] Model-Viewport 3 - Display Mode Radial Menu And Render Preview

### Summary

#### Purpose:
- add one model-viewport display-mode system for choosing how the currently visible geometry result is presented
- let the user press `Shift+D` to pick from a radial menu
- reserve `Solid`, `Wireframe`, `Material`, `Rendered`, and `Render Preview` as the initial display-mode ladder
- keep progressive render-preview progress visible in the viewport HUD without turning presentation into geometry truth

#### Current read:
- the current model-viewport result policy is already named separately as `Auto / Draft / Final`
- current view settings already include presentation concepts such as wireframe, shadows, environment, ground, and materials
- Three.js can support fast interactive presentation modes now, while true path-traced or progressive render preview should be treated as a later special mode
- this lane is intentionally presentation-only and should not replace the still-open `Model-Viewport 1.3` authoritative geometry/export handoff
- `Phase 1 - Display Mode Contract` is now shipped in the dedicated future doc
- `Phase 2 - Shift+D Radial Menu` is now shipped in the dedicated future doc
- `Phase 3 - Fast Display Mode Viewer Application` is now shipped in the dedicated future doc
- `Phase 4 - Render Preview Status And HUD Contract` is now shipped in the dedicated future doc
- `Phase 5 - Progressive Render Preview Backend` is now shipped in the dedicated future doc
- `Phase 6 - Render Preview Settings Contract` is now shipped in the dedicated future doc
- `Phase 7 - Properties Render Section` is now shipped in the dedicated future doc
- `Phase 8 - Render Settings Runtime Wiring` is now shipped in the dedicated future doc
- `Phase 9 - Render Quality Presets And Cleanup` is now planned in the dedicated future doc

### Questions

#### [x] Question 1 - What should `Model-Viewport 3` own?

##### Locked answer
- display-mode selection and render-preview presentation for the active model viewport

##### Why
- display mode answers how visible geometry is drawn, while `Auto / Draft / Final` answers which geometry result class is visible

#### [x] Question 2 - Should render preview be part of the same mode ladder?

##### Locked answer
- yes, as the fifth presentation mode, but with its own HUD progress and unsupported/stale-state honesty

##### Why
- users should be able to ask the viewport for a higher-quality render from the same display-mode picker, while implementation can keep expensive progressive rendering isolated from normal interactive viewport behavior

### Spec

Dedicated future doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-3 - Display Mode Radial Menu And Render Preview.md`

Definition of done:
- the family has one explicit later phase reserved for model-viewport display modes
- that phase includes the `Shift+D` radial menu, the first four fast presentation modes, and the fifth progressive render-preview mode
- render-preview progress is planned as a HUD/status read with iteration or sample progress
- the cleanup ladder adds Properties `Render` settings through ParaSliders and ParaSelects where practical
- the phase stays separate from geometry result policy, build scheduling, authoritative geometry truth, and export ownership

## [ ] Model-Viewport 2 - Primary Viewport Workspace Reassignment

### Summary

#### Purpose:
- let the user change the current main `Model Viewport` into a different workspace surface
- retire the protected-main-viewer assumption from this family without making `Model Viewport` own broader workspace-shell truth

#### Current read:
- the repo still treats one primary `Model Viewport` as a protected anchor
- the current next honest handoff is still `Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`
- this later phase is intentionally reserved now so the workspace-facing follow-on has one explicit family home when the repo is ready to let the primary slot switch to `Home Page` or another supported workspace surface

### Questions

#### [x] Question 1 - What should `Model-Viewport 2` own?

##### Locked answer
- the ability for the user to change the main `Model Viewport` slot to another workspace surface

##### Why
- that behavior currently conflicts with the protected-primary-viewer rule, so it needs one explicit ownership home instead of staying an undocumented shell restriction

### Spec

Dedicated future doc:
- not created yet

Definition of done:
- the family has one explicit later phase reserved for primary-slot workspace reassignment
- that phase is scoped to switching the main `Model Viewport` slot to another supported workspace surface
- that phase does not pretend `Model Viewport` now owns broader workspace-shell routing, project truth, or `Home Page` ownership
