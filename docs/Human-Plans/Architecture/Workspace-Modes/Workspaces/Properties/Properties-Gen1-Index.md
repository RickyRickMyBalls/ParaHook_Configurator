# Properties Gen1 Index

## Doc Header

### Doc History
82. 2026-05-21 19:12:16: Marked `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` shipped after adding a read-only `Custom` edge preset state for recipe drift, keeping saved presets built-in-only, and advancing the Geometry Display handoff to `Properties-6 / Phase 6 - Point Visibility And Default Style`.
81. 2026-05-21 18:58:22: Prepped `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` against the shipped Phase 5.4 edge recipe settings, choosing a read-only `Custom` state based on mode, depth, hidden-edge visibility, and hidden-edge line style while keeping color, opacity, dash/gap tuning, and saved custom render presets out of the first recipe signature.
80. 2026-05-21 18:55:19: Marked `Properties-6 / Phase 5.4 - Edge Depth Hidden Edges And Line Style` shipped after adding saved hidden-edge visibility and line-style settings, restoring `Edge Depth`, adding conditional `Hidden Edges` and `Line Style` controls, and routing viewer hidden-edge overlays through those recipe settings.
79. 2026-05-21 18:39:09: Prepped `Properties-6 / Phase 5.4 - Edge Depth Hidden Edges And Line Style` against the live edge settings contract, Properties controls, and viewer hidden-line overlay paths, narrowing implementation to saved `hiddenEdges` and `lineStyle` settings plus visible `Edge Depth`, `Hidden Edges`, and `Line Style` controls before custom readback.
78. 2026-05-21 18:31:59: Revised the `Properties-6 / Phase 5.4` and `Phase 5.5` follow-up read so hidden-line behavior becomes a recipe over editable `Edge Depth`, `Hidden Edges`, and `Line Style` settings, with hidden-edge visibility tied to `Edge Depth: Xray` and `Custom` readback planned for recipe drift.
77. 2026-05-21 18:21:23: Added `Properties-6 / Phase 5.4 - Edge Depth Control And Preset Sync` and `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` before point work so Geometry Display can restore editable edge depth and show `Custom` when user-edited edge settings no longer match a built-in preset recipe.
76. 2026-05-21 18:14:57: Marked `Properties-6 / Phase 5.3 - Hidden Line Styling And Recipe Prep` shipped after hidden-line color, opacity, dash length, and gap length became saved Geometry Display settings, Properties controls, and viewer dashed-layer inputs, advancing the Geometry Display handoff to Phase 6 point visibility and default styling.
75. 2026-05-21 18:09:20: Prepped `Properties-6 / Phase 5.3 - Hidden Line Styling And Recipe Prep` against the shipped hidden-line preset runtime, narrowing implementation to hidden-edge color, opacity, dash length, and gap length controls shown only when `Edge Preset` is `Hidden Line`.
74. 2026-05-21 18:05:31: Marked `Properties-6 / Phase 5.2 - Hidden Line Edge Preset Runtime` shipped after adding the `Hidden Line` edge preset, compatibility mapping, Properties option, and dashed sibling edge overlays for semantic and mesh fallback display edges while deferring hidden-line styling controls.
73. 2026-05-21 18:00:32: Prepped `Properties-6 / Phase 5.2 - Hidden Line Edge Preset Runtime` against the shipped edge preset owner and live viewer edge overlay maps, narrowing implementation to a real `Hidden Line` preset with solid visible edges plus separate dashed hidden-edge overlays while keeping hidden-line styling controls in Phase 5.3.
72. 2026-05-21 17:56:54: Marked `Properties-6 / Phase 5.1 - Edge Preset Model And Depth UI Cleanup` shipped after Geometry Display gained an `Edge Preset` owner, the Properties `Edge Depth` control was removed from the normal UI, and the existing edge mode/depth compatibility bridge stayed intact.
71. 2026-05-21 17:56:54: Prepped `Properties-6 / Phase 5.1 - Edge Preset Model And Depth UI Cleanup` against the live edge mode/depth contract and Properties controls, choosing a compatibility-preserving `geometryDisplay.edges.preset` owner before the hidden-line runtime phase.
70. 2026-05-21 16:51:07: Added `Properties-6 / Phase 5.1`, `Phase 5.2`, and `Phase 5.3` as numbered edge follow-ups for replacing the overlapping edge mode/depth UI with one `Edge Preset`, adding a real `Hidden Line` renderer, and only then exposing hidden-line styling controls.
69. 2026-05-21 16:39:01: Removed unsupported edge thickness from the shipped `Properties-6` Geometry Display read after confirming the current viewer line path cannot reliably render non-1px line widths, keeping color, opacity, and depth as the current editable edge settings.
68. 2026-05-21 16:29:39: Marked `Properties-6 / Phase 5 - Edge Hover And Highlight Styles` shipped after adding saved edge hover/selected color, opacity, and thickness styles, exposing the controls in the `Edges` Geometry Display subsection, bridging legacy highlight edge fields, and routing viewer topology edge overlays through the new owner.
67. 2026-05-21 16:20:27: Prepped `Properties-6 / Phase 5 - Edge Hover And Highlight Styles` for implementation with a narrow `geometryDisplay.edges.hover/selected` bridge over current highlight edge color, glow-derived opacity, and thickness reads, preserving point styling, helper overlays, and topology behavior for later phases.
66. 2026-05-21 16:15:00: Recorded the Geometry Display organization refinement after Properties `Render > Geometry Display` gained independently collapsible `Surfaces`, `Edges`, and `Points` subsections without changing the saved geometry-display contract.
65. 2026-05-21 16:03:46: Marked `Properties-6 / Phase 4 - Edge Visibility And Default Style` shipped after adding saved default edge color, opacity, thickness, and depth settings under `geometryDisplay.edges`, exposing condensed Properties controls, preserving the legacy edge-mode bridge, and routing normal viewer display-edge overlays through the new edge style owner.
64. 2026-05-21 15:55:04: Prepped `Properties-6 / Phase 4 - Edge Visibility And Default Style` for implementation with default display-edge color, opacity, thickness, and depth settings under `geometryDisplay.edges`, condensed Properties controls that hide while `Edges` is `Off`, viewer consumption for normal mesh/semantic edge display overlays, and edge hover/selected styling left to Phase 5.
63. 2026-05-21 15:52:21: Marked `Properties-6 / Phase 3 - Surface Hover And Highlight Styles` shipped after adding surface hover, selected face, and selected body color/opacity styles to `geometryDisplay.surfaces`, exposing those controls in Properties `Render > Geometry Display`, bridging them with existing `ViewSettings.highlights`, and routing viewer body/face overlay reads through the new surface style owner.
62. 2026-05-21 15:38:55: Prepped `Properties-6 / Phase 3 - Surface Hover And Highlight Styles` for implementation with surface hover, selected face, and selected body color/opacity controls in Geometry Display, a compatibility bridge to existing `ViewSettings.highlights`, and viewer overlay consumption without changing selection or topology behavior.
61. 2026-05-21 15:33:44: Marked `Properties-6 / Phase 2 - Surface Source And Custom Default Material` shipped after adding `Surface Source`, custom display-material controls, custom surface material normalization, and viewer-only generated surface material override behavior without changing project material truth.
60. 2026-05-21 15:27:16: Prepped `Properties-6 / Phase 2 - Surface Source And Custom Default Material` for implementation with `Surface Source` as `Material Set / Custom`, a display-only `customMaterial` using the existing `MaterialPreset` field shape, condensed custom material controls inside Properties `Render > Geometry Display`, and viewer consumption that avoids mutating project material truth.
59. 2026-05-21 15:04:04: Marked `Properties-6 / Phase 1 - Geometry Display Contract And Section Shell` shipped after adding the saved Geometry Display contract, Properties Render section, Surfaces / Edges / Points controls, edge-mode compatibility bridge, and generated-surface viewer consumption while leaving custom styling and runtime point rendering to later phases.
58. 2026-05-21 14:55:14: Prepped `Properties-6 / Phase 1 - Geometry Display Contract And Section Shell` for implementation with a narrow geometry-display contract, section placement, Surfaces / Edges / Points visibility controls, edge-mode compatibility guidance, generated-surface runtime scope, and a point-ownership deferral rule if the live point systems cannot be cleanly unified in the first cut.
57. 2026-05-21 14:47:01: Added `Properties-6 - Geometry Display Surfaces Edges And Points` as the next Properties Render planning surface for user-editable surface, edge, and point visibility/styling, custom surface display material controls, and the path toward Wireframe and Clay Studio as editable geometry-display recipes.
56. 2026-05-21 14:19:49: Added the next Properties-5 Ambient Occlusion phase ladder after `GTAOPass AO Type`, keeping `Properties-5 / Phase 2.4` as the next implementation handoff while parking AO comparison, engine-specific controls, ground-contact AO, resolution/performance, and stacking/preset-recipe decisions as later phases.
55. 2026-05-21 13:39:41: Recorded the shipped `Properties-5 / Phase 2.3 - SAOPass AO Type` implementation after `SAO` became a real Properties `Render > Shadows` AO type backed by Three.js `SAOPass`, preserving `Basic SSAO` and advancing the AO engine handoff to `Properties-5 / Phase 2.4 - GTAOPass AO Type`.
54. 2026-05-21 13:28:30: Split the AO engine expansion plan so `Properties-5 / Phase 2.3` owns `SAOPass AO Type` and `Properties-5 / Phase 2.4` owns `GTAOPass AO Type`, keeping GTAO's denoise/settings contract separate from the simpler SAO runtime pass.
53. 2026-05-21 13:24:53: Prepped `Properties-5 / Phase 2.3 - AO Engine Candidate Comparison` for implementation as the first real AO type expansion after Phase 2.2, prioritizing `SAO` as the first supported alternate AO engine while keeping `GTAO`, `N8AO`, and custom ground-contact AO out of the first code cut unless runtime proof makes them honest.
52. 2026-05-21 12:58:09: Recorded the shipped `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` implementation after `AO Type` became a saved Properties `Render > Shadows` control with `Off` and `Basic SSAO`, legacy `ssaoEnabled` migration, Basic SSAO runtime gating, and focused proof.
51. 2026-05-21 12:28:09: Prepped `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` for implementation as a saved AO type owner plus Properties `AO Type` ParaSelect where only `Off` and `Basic SSAO` ship first and later AO engines remain named follow-up candidates.
50. 2026-05-21 11:42:49: Clarified the future AO type selector plan so the Properties UI should show proper AO engine or strategy names such as `Basic SSAO`, `SAO`, `GTAO`, `N8AO`, or `Ground Contact AO` instead of shipping placeholder `Type 1 / Type 2 / Type 3` labels.
49. 2026-05-21 11:23:33: Added the future `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` goal so Properties `Render > Shadows` can move toward an `Off / Type 1 / Type 2 / Type 3` AO ParaSelect for comparing AO engines or strategies.
48. 2026-05-21 10:34:32: Recorded the shipped `Properties-5 / Phase 2 - Advanced Ambient Occlusion Controls` implementation after AO Contact Bias and AO Distance Threshold became saved Properties Render settings mapped into the SSAO runtime.
47. 2026-05-21 10:13:04: Prepped `Properties-5 / Phase 2 - Advanced Ambient Occlusion Controls` for implementation as the supported SSAO Contact Bias and Distance Threshold slice, with AO Resolution / Scale split into a follow-up runtime-contract phase.
46. 2026-05-21 09:48:54: Recorded the shipped `Properties-5 / Phase 1 - Basic Ambient Occlusion Controls` implementation after Properties `Render > Shadows` gained AO Intensity, AO Radius, AO Quality, and `Custom` AO preset readback while keeping Contact Shadows separate.
45. 2026-05-21 09:33:47: Prepped `Properties-5 / Phase 1 - Basic Ambient Occlusion Controls` for implementation around the existing `ViewSettings.postProcessing` AO intensity, radius, and quality fields, Properties `Render > Shadows` controls, AO custom readback, and focused store/Properties/viewer proof.
44. 2026-05-21 09:29:43: Added the `Properties-5` Ambient Occlusion Shadows control ladder, making Phase 1 own basic AO Intensity, Radius, and Quality controls while Phase 2 owns advanced AO Contact Bias / Falloff, Distance Threshold, and Resolution / Scale controls.
43. 2026-05-21 09:22:52: Recorded the shipped `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` implementation after Contact Shadows became neutral saved Properties Render settings with Shadows controls, preset recipe writes, viewer consumption, and focused proof.
42. 2026-05-21 09:13:14: Prepped `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` for implementation as the contact-shadow extraction slice, with a neutral saved `ViewSettings.contactShadows` contract, Properties `Render > Shadows` controls, Clay Studio preset recipe writes, viewer setting consumption, and focused proof.
41. 2026-05-21 09:10:13: Recorded the shipped docs-only `Properties-4 / Phase 4 - Remaining Render Presentation Contracts` implementation after the remaining hidden presentation ingredients were classified into a contract matrix and `Contact Shadows` was selected as the first `Properties-4 / Phase 4.1` extraction target.
40. 2026-05-21 09:07:24: Revised the `Properties-4 / Phase 4` prep read so `Properties-4` owns the remaining render-setting extraction ladder, with `Properties-4 / Phase 4.1 - First Remaining Setting Extraction` as the next code-changing follow-up instead of relying on `Properties-5`.
39. 2026-05-21 09:02:03: Prepped `Properties-4 / Phase 4 - Remaining Render Presentation Contracts` as a docs-only contract-classification slice for the remaining runtime-only presentation values, routing actual new render controls and feature organization into `Properties-5` phases.
38. 2026-05-21 08:59:48: Added `Properties-5 - Render Section Detail And Feature Organization` as the next Properties Render planning surface so the user can provide render-section feature and organization phases one by one without overloading the completed preset-consolidation doc.
37. 2026-05-21 08:55:50: Recorded the Phase 3 render-control layout refinement after Ambient Occlusion moved from Properties `Render > Viewport Presentation` into the `Shadows` group so shadow, light-shadow, and screen-space occlusion controls read as one shadow-focused cluster.
36. 2026-05-21 08:49:27: Recorded the shipped `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` implementation after built-in render presets started writing visible neutral Properties Render settings, Properties kept those controls editable after preset application, and the viewer began consuming saved environment grade, hard shadows, ground visibility, and grid visibility instead of preset-identity branches for those values.
35. 2026-05-21 08:39:12: Re-prepped `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` around neutral Properties `Render` settings and built-in preset recipes, clarifying that Phase 3 should make existing controls show and own preset-applied values rather than treating Clay Studio as a separate extracted mode.
34. 2026-05-21 08:26:39: Prepped `Properties-4 / Phase 3 - Visible Preset Values For Existing Render Controls` against the shipped Phase 2 helper path, current Properties Render controls, and Clay Studio viewer override seams, narrowing the next implementation cut to built-in preset recipe values for Environment Grade, hard shadows, Ground enabled/height, Grid visibility/presentation, and Ambient Occlusion / post-processing while deferring Clay Studio material, background, lighting, edge styling, and contact-shadow contracts.
33. 2026-05-21 08:21:41: Recorded the shipped `Properties-4 / Phase 2 - Shared Built-In Preset Selection Path` implementation after shared render-preset helpers landed around legacy `viewportStyle` storage, Properties `Render > Viewport Presentation` gained separate `Display Mode` and `Render Preset` controls, Shift+D and Properties Clay Studio selection started using the same helper, and normal Shift+D display-mode choices stopped clearing preset-owned render settings.
32. 2026-05-21 08:10:51: Prepped `Properties-4 / Phase 2 - Shared Built-In Preset Selection Path` against the live Shift+D hook, ViewerHost display-mode menu, Properties Render section, shared `ViewSettings` contract, and focused test seams, choosing a small legacy-backed first cut that keeps `viewportStyle` storage, exposes `Display Mode` and `Render Preset` separately in Properties, routes Clay Studio selection through one helper, and stops normal display-mode choices from clearing preset-owned render settings.
31. 2026-05-21 08:06:38: Recorded the docs-only `Properties-4 / Phase 1 - Preset Inventory And Vocabulary` closeout after the live Shift+D, Properties Render, and viewer-effect inventory clarified that `Clay Studio` should become a render-preset recipe made from normal Properties `Render` settings, not a separate display mode, and advanced the render-preset consolidation handoff to `Properties-4 / Phase 2 - Shared Built-In Preset Selection Path`.
30. 2026-05-21 07:49:21: Added `Properties-4 - Render Presets And Viewport Style Consolidation` as the next render/presentation future doc after the user clarified that Shift+D viewport styles should become visible render-setting presets in Properties `Render`, with `Standard`, `Clay Studio`, and later custom presets flowing through one shared preset selection/read model instead of hidden viewer-only overrides.
29. 2026-05-21 07:28:24: Recorded the shipped `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` implementation after Properties `Render > Grid` gained the shared `Grid` on/off select plus height, size, and `Grid 1` / `Grid 2` / `Grid 3` layer controls, with `ViewSettings.gridPresentation` persisted and normalized, the viewer grid rebuilt from editable presentation layers, and Clay Studio keeping grid controls locked/read-only.
28. 2026-05-21 07:09:19: Prepped `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` for implementation against the live `ViewSettings.gridVisible` owner, `uiPrefsPersistence` view-settings copy paths, hard-coded `Viewer.ts` minor/major/double-major grid helpers, and current Properties `Render` group order, locking the first code cut to a three-layer `gridPresentation` contract that keeps `gridVisible` as the top-level on/off setting.
27. 2026-05-21 06:59:59: Planned `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` after the user asked to move the View Toolbar `Grid` checkbox into Properties `Render`, setting the next render/presentation handoff around a new `Grid` section with `Grid` on/off, grid height, and a bounded `Grid 1` / `Grid 2` / `Grid 3` layer model for minor, major, and double-major spacing/color/weight controls.
26. 2026-05-21 06:50:32: Recorded the shipped `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` implementation after Properties `Render > Shadows` and `Render > Ground` gained View Toolbar parity for global shadows, selected-light shadow controls, ground visibility, ground height, and ground material, with Clay Studio keeping those controls locked/read-only as preset-owned presentation behavior.
25. 2026-05-21 06:40:53: Prepped `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` against the shipped Properties `Render` grouping, existing View Toolbar ground controls, `groundEditHistory` helpers, shared `ViewSettings.ground`, and Clay Studio viewer ground/contact overrides, choosing Standard-mode ground visibility, height, and material controls while leaving Clay Studio contact treatment preset-owned and read-only.
24. 2026-05-21 06:32:26: Recorded the shipped `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` implementation after Properties `Render > Environment` gained Standard-mode Environment Grade sliders, Clay Studio kept those controls `Preset Locked`, and the next active render handoff advanced to `Properties-3 / Phase 4 - Ground And Contact Presentation Controls`.
23. 2026-05-21 06:28:39: Prepped `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` for implementation by choosing the first-pass `Preset Locked` Clay Studio policy, grounding the next cut in the existing `ViewToolbar` grade controls, `uiPrefsStore.setEnvironmentGrade(...)`, environment-look history helpers, and the `Viewer.ts` Clay Studio grade override, while keeping presets, HDRI/source, lighting, and runtime grade math out of scope.
22. 2026-05-21 06:20:44: Recorded the shipped `Properties-3 / Phase 2 - Render Section Grouping And Readback` implementation after Properties `Render` gained visible `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality` groups, with Environment/Shadows/Ground staying readback-only and the next active render handoff advancing to `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy`.
21. 2026-05-21 06:12:46: Prepped `Properties-3 / Phase 2 - Render Section Grouping And Readback` against the live `PropertiesRenderSection.tsx`, `PropertiesSurface.test.tsx`, shared `ViewSettings` fields, and Clay Studio viewer runtime branches, narrowing the next implementation pass to Properties `Render` grouping and readback rows while deferring active Environment, Shadows, and Ground controls.
20. 2026-05-20 20:13:19: Recorded the docs-only closeout for `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory`, confirming that the current live implementation exposes `Viewport Style`, Ambient Occlusion, and Render Preview quality in Properties `Render` while Clay Studio environment grade, lighting, hard-shadow suppression, ground forcing, ground material, and contact shadows remain Model Viewport runtime behavior for later readback/grouping phases.
19. 2026-05-20 20:03:45: Prepped `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory` by grounding the next docs-only pass in the live `ViewSettings` contract, current Properties `Render` section, and Clay Studio viewer overrides, with future Properties `Render` subsections now explicitly aimed at `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`.
18. 2026-05-20 19:53:00: Added `Properties-3 - View And Render Presentation Controls` as the future family plan for organizing viewport/render presentation controls under Properties `Render`, including `Viewport Style`, Ambient Occlusion, Environment Grade Controls, ground/contact presentation, and Render Preview quality while keeping viewer runtime ownership in `Model Viewport`.
17. 2026-05-10 13:15:16: Expanded the nested materials follow-through by adding explicit `Materials-1` phase-2 and phase-3 planning plus the new `Materials-2` future doc, so the `Properties` umbrella now points at a full foundation ladder and a later editing ladder instead of implying that all post-foundation work still lives inside one materials phase.
16. 2026-05-10 13:05:32: Added the new standalone `Materials-1` future doc under the nested `Properties/Materials/Future/` home, tightened the active subfamily handoff so the live implementation owner now points at that doc instead of the generation index, and locked the next nested runtime cut to `Phase 1 - Focused Object Intake And Current Material Truth Read`.
15. 2026-05-10 12:58:35: Recorded the landed `Properties-2 / Phase 3 - Child Section Contract And Shell States` closeout after the shared shell gained an explicit section-facing contract plus shell-owned empty/unsupported/no-section behavior, and advanced the active family handoff out of the shell ladder and into `Materials-1` as the first child-lane runtime owner-mapping pass.
14. 2026-05-10 12:56:14: Prepped `Properties-2 / Phase 3 - Child Section Contract And Shell States` for implementation by grounding the final shared-shell closeout against the landed `PropertiesSurface` section host, tightening the next cut around one explicit section-facing contract plus shell-owned non-happy-path states, and keeping `Materials-1` as the first child-lane runtime owner-mapping pass after that.
13. 2026-05-10 12:52:18: Recorded the landed `Properties-2 / Phase 2 - Section Registry And Tab Framing` pass after the shared `Properties` shell replaced its phase-1 placeholder with a real section host, made `Materials` the first active hosted section and default-tab read, and advanced the active family-level implementation handoff to `Properties-2 / Phase 3 - Child Section Contract And Shell States`.
12. 2026-05-10 12:50:31: Prepped `Properties-2 / Phase 2 - Section Registry And Tab Framing` for implementation by grounding the next shared-shell pass against the live `PropertiesSurface.tsx` placeholder shell, locking `Materials` as the first real hosted section and default-tab read, and tightening the proof boundary around shell-owned section framing instead of materials-specific behavior.
11. 2026-05-10 12:13:32: Recorded the landed `Properties-2 / Phase 1 - Workspace Mount And Focus Context` shared-shell pass after the family registered the real optional `Properties` workspace surface, added the canonical surface-registry branch, landed the first shell-level focused-target read, and advanced the active next implementation handoff to `Properties-2 / Phase 2 - Section Registry And Tab Framing`.
10. 2026-05-10 12:05:25: Prepped `Properties-2 / Phase 1 - Workspace Mount And Focus Context` for implementation by grounding the first shared-shell cut against the live workspace-surface catalog, surface-registry, workspace-store placement seam, and existing workspace-selection owner path so the new `Properties` shell can mount honestly before tab framing or materials-specific runtime behavior begins.
9. 2026-05-10 12:01:29: Recorded the landed `Properties-1 / Phase 3 - Later Lane Reservation And Closeout` umbrella closeout, locking future candidates such as `Transform` to reservation-only status, closing `Properties-1` as a structural family phase, and advancing the active family-level handoff to `Properties-2 / Phase 1` while keeping `Materials-1` explicit as the first child-lane runtime-forward lane after that shared shell.
8. 2026-05-10 11:55:14: Added the new follow-on family phase `Properties-2 - Shared Properties Workspace Shell And Section Hosting`, updated the generation ladder so the family now records the missing shared runtime shell between the structural umbrella and the nested `Materials-1` lane, and kept `Materials-1` explicit as the first child-lane runtime-forward pass after that shell lands.
7. 2026-05-10 11:30:56: Prepped `Properties-1 / Phase 3 - Later Lane Reservation And Closeout` for implementation by tightening the reservation-only rule for later property-group candidates, keeping the umbrella closeout narrow, and making `Materials-1` the explicit next family-level implementation handoff after the umbrella finishes.
6. 2026-05-10 11:28:44: Recorded the landed `Properties-1 / Phase 2` handoff pass after the family locked the no-overlap contract between umbrella routing and nested materials-specific owner mapping, made `Materials-1` the explicit first material-specific runtime-forward lane, and advanced the remaining umbrella work to `Phase 3 - Later Lane Reservation And Closeout`.
5. 2026-05-10 11:27:21: Prepped `Properties-1 / Phase 2 - Materials Handoff And Owner Boundary` for implementation by tightening the umbrella-to-materials no-overlap rule, keeping the next active materials runtime-forward lane explicit, and narrowing the remaining umbrella work after that to reservation-and-closeout only.
4. 2026-05-10 11:24:25: Recorded the landed `Properties-1 / Phase 1` umbrella pass after the family locked the top-level meaning of `Properties` plus focused-item entry above the nested `Materials` lane, and advanced the active next internal handoff inside the umbrella doc to `Phase 2 - Materials Handoff And Owner Boundary`.
3. 2026-05-10 11:22:51: Prepped the new standalone `Properties-1` family phase doc for implementation by tightening the umbrella handoff around focused-item entry, nested `Materials-1` ownership, and reservation-only later lanes, while keeping the current generation index aimed at one small structural pass before the materials runtime lane begins.
2. 2026-05-10 11:07:51: Added the first standalone family phase doc `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`, updated this generation index so the umbrella now points at one explicit implementation-planning owner surface, and kept the next runtime-forward handoff aimed at the nested `Materials-1` lane instead of inventing a broad premature Properties runtime pass.
1. 2026-05-10 10:53:15: Added the new active `Properties` Generation 1 planning index so the workspace family now has a real umbrella home above the moved `Materials` subfamily, with the first generation intentionally centered on focused-item property editing and the first concrete subfamily routed into `Properties/Materials/`.

### Purpose

This file is the active `Generation 1` planning index for the `Properties` workspace family under `Workspace Modes`.

Use it to answer:
- what the `Properties` workspace family is supposed to be for
- how `Properties` should fit the hybrid workspace model
- how focused-item property editing should be organized before many subfamilies appear
- which Generation 1 goals belong to the umbrella workspace family versus the first `Materials` subfamily
- what the first `Properties` family phase should be

Do not use it for:
- the broad long-range north-star if the family later needs `Properties-Vision.md`
- detailed implementation-phase specs that belong in standalone `Future/` family phase docs
- treating one specific property group such as `Materials` as if it already defines the entire family forever

### Family Structure

Use this folder like this:

- `Properties-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Materials/`
  - first concrete `Properties` subfamily
  - current home for object-focused material editing vision and generation routing
- `Future/`
  - standalone implementation-ready `Properties` family phase docs
- `Shipped/`
  - shipped records for completed `Properties` umbrella cuts

Important setup note:
- `Properties` is now the workspace-family umbrella
- `Materials` is the first nested property-editing subfamily, not the whole workspace identity
- if the umbrella widens enough that it needs a broader north-star, add `Properties-Vision.md` later instead of overloading this index

## Doc Body

### Short Version

`Properties` should become the real workspace surface for focused-item inspection and editing.

The family should leave room for multiple property groups over time, not just one:
- `Materials`
- later transforms or object-level metadata if they belong here
- later other property sections that are too specific to justify their own whole workspace

The first concrete subfamily is `Materials`.

That means the first honest umbrella read is:
- `Properties` is the workspace family
- `Materials` is the first major section or subfamily inside it
- the umbrella should stay broad enough to host later property groups
- the first implementation work should still stay narrow and owner-honest

The first family lane is `Properties-1`.

`Properties-1` should stay structural:
- define the umbrella workspace direction
- define how focused-item property editing relates to subfamilies
- keep the first runtime-planning handoff aligned to the moved `Materials` subfamily instead of inventing fake parallel work

### Current Planning Read

This file owns the active `Generation 1` family-phase routing for the `Properties` workspace.

Current legal family-phase ladder:
- `Properties-1` - Workspace Umbrella And Focused-Item Property Routing
- `Properties-2` - Shared Properties Workspace Shell And Section Hosting
- `Properties-3` - View And Render Presentation Controls
- `Properties-4` - Render Presets And Viewport Style Consolidation
- `Properties-5` - Render Section Detail And Feature Organization
- `Properties-6` - Geometry Display Surfaces Edges And Points

Current subfamily read:
- `Materials` is the first active `Properties` subfamily
- current materials north-star and generation routing live under:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-1 - Workspace Foundation And Material Owner Read.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-2 - First Material Editing And Action Flows.md`

Current planning rules:
- use this index to choose and bound umbrella `Properties-N` family phases
- use the nested `Materials` docs for materials-specific direction and later implementation planning
- do not start runtime implementation from this index alone
- keep the umbrella broad enough to host more than `Materials`, but do not invent extra subfamilies until they are real

Current active implementation-planning owner:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-1 - Workspace Foundation And Material Owner Read.md`

Current landed umbrella closeout:
- `Properties-1` is now structurally complete

Current landed shared-shell follow-on:
- `Properties-2` is now complete as the first runtime shell ladder

Current next family-level handoff:
- `Properties-6 - Geometry Display Surfaces Edges And Points` for the new Surfaces / Edges / Points render-display section and the path from Wireframe to Clay Studio as editable settings

Current render/presentation prep read:
- `Properties-3 / Phase 1` is complete as a docs-only ViewSettings inventory pass.
- `Properties-3 / Phase 2` is complete as the first runtime grouping/readback pass.
- `Properties-3 / Phase 3` is complete as the first Environment Grade controls and Clay Studio locked-policy pass.
- `Properties-3 / Phase 4` is complete as the View Toolbar Shadows/Ground parity pass.
- `Properties-3 / Phase 5` is complete as the Grid presentation controls and layer-system pass.
- Properties `Render` should organize future controls into `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, `Grid`, and `Render Preview Quality`.
- Clay Studio grade, hard-shadow, and ground/contact behavior should be treated as preset-owned runtime readback until a later phase deliberately changes that policy.

Current next Properties render/presentation phase:
- pick a new `Properties-3` follow-up only if the View Toolbar duplicate checkbox cleanup, true fat-line grid rendering, or another render/presentation control needs its own bounded phase.

Current render-preset consolidation handoff:
- `Properties-4 - Render Presets And Viewport Style Consolidation`
- `Properties-4 / Phase 1` is complete as a docs-only source inventory and vocabulary pass.
- `Properties-4 / Phase 2` is complete as the shared built-in preset selection path.
- Shift+D and Properties `Render` should share one vocabulary for `Display Mode`, `Render Preset`, and `Render Settings`.
- `Clay Studio` should become a render-preset recipe made from normal Properties `Render` settings, not a separate display mode.
- Built-in presets should start with `Standard` / `Rendered` and `Clay Studio`.
- Runtime presentation values should move into neutral Properties Render settings only after each affected value has a visible setting or explicit preset contract.
- Later phases should support `Rendered (Custom)`, `Clay Studio (Custom)`, and saved user custom presets.

Current Properties-4 Phase 2 landed read:
- `ViewSettings.viewportStyle` remains the legacy backing field, with shared render-preset naming helpers around it.
- Properties `Render > Viewport Presentation` now exposes separate `Display Mode` and `Render Preset` controls.
- Shift+D `Clay Studio` and Properties `Render Preset -> Clay Studio` use the same helper and produce `viewportStyle: 'clayStudio'` plus `displayMode: 'rendered'`.
- Shift+D normal display-mode choices write only `displayMode`, so they no longer wipe preset-owned render settings back to Standard.
- Properties `Display Mode` changes preserve the current render preset.
- Deeper preset recipe ingredient work remains for later phases, with hard shadows and soft contact shadows still the recommended first Shadows-group ingredients.

Current Properties-4 Phase 3 landed read:
- built-in render presets now apply visible saved recipe values, not just `viewportStyle`
- `ViewSettings.viewportStyle` remains the legacy backing field
- Clay Studio writes rendered display mode, Clay grade values, hard shadows off, ground on while preserving saved height/material, grid off while preserving presentation layers, and Ambient Occlusion `Medium`
- Standard writes the default visible render recipe while preserving the current display mode
- Environment, Shadows, Ground, Grid, and Ambient Occlusion controls stay editable after preset application because those neutral saved settings now own behavior
- Ambient Occlusion now lives under the `Shadows` group rather than `Viewport Presentation`
- the viewer consumes saved environment grade, hard shadows, ground visibility, and grid visibility instead of branching on preset identity for those values
- presentation material override, ground material override, background, lighting rig, edge styling, contact-shadow controls, axes suppression, custom readback, saved custom presets, and storage renaming remain out of Phase 3

Current Properties-4 Phase 4 prep read:
- implement as a docs-only contract-classification pass unless the user explicitly widens it
- inventory the remaining runtime-only presentation values in `Viewer.ts`: presentation object material, presentation ground material, background, lighting rig, edge overlay styling, contact-shadow rings/tuning, and axes suppression policy
- classify each remaining value as `Neutral Setting Needed`, `Runtime Detail`, `Properties-4 Extraction Candidate`, or `Do Not Author`
- keep Clay Studio as one preset recipe that can later write those values, not the owner of the concepts
- add `Properties-4` follow-up sub-phases for the actual extraction work, starting with `Properties-4 / Phase 4.1 - First Remaining Setting Extraction`
- do not add new controls, mutate runtime behavior, add saved custom presets, collapse `Display Mode` and `Render Preset`, or touch graph/material/export truth

Current Properties-4 Phase 4.1 prep read:
- extract the first classified hidden presentation value into a saved neutral `Properties > Render` setting
- selected first target is `Contact Shadows` under `Properties > Render > Shadows`
- add a neutral nested `ViewSettings.contactShadows` contract with `enabled`, `opacity`, `spread`, and `heightFade`
- built-in presets should write those saved neutral settings, with `Clay Studio` matching the current soft ring look and `Standard` resetting to defaults
- `Viewer.ts` should consume `view.contactShadows` instead of requiring Clay Studio identity for contact-shadow rendering
- Properties should expose `Contact Shadows` `Off` / `On`, `Opacity`, `Spread`, and `Height Fade` in the existing `Shadows` group below Ambient Occlusion
- user edits after preset application should remain editable
- keep ring color, ring count, ring ratios, y-offset, per-object controls, Background, Presentation Material, Presentation Ground Material, Lighting, Edges, real Materials authoring truth, graph geometry, export truth, saved custom preset management, and Display Mode / Render Preset separation out of scope
- focused proof should cover Properties writes, preset recipe writes, settings normalization/persistence, viewer ring creation/hiding, production build, and `git diff --check`

Current Properties-4 Phase 4.1 landed read:
- Contact Shadows now have neutral saved `ViewSettings.contactShadows` settings with `enabled`, `opacity`, `spread`, and `heightFade`
- Properties `Render > Shadows` now exposes `Contact Shadows`, `Contact Opacity`, `Contact Spread`, and `Contact Height Fade`
- Clay Studio writes enabled contact-shadow settings through the built-in preset helper; Standard resets them to defaults
- viewer contact-shadow rings now render from saved settings in rendered mode with visible ground instead of requiring Clay Studio identity
- ring color, ring count, ring ratios, y-offset, per-object controls, Background, Presentation Material, Presentation Ground Material, Lighting, Edges, graph geometry, material truth, real light truth, export truth, saved custom presets, and Display Mode / Render Preset collapse remain out of scope
- next render-preset consolidation handoff is `Properties-4 / Phase 5 - Preset Match And Custom Readback`

Current Properties-4 Phase 4 landed read:
- remaining hidden presentation ingredients now have a contract matrix in `Properties-4`
- `Contact Shadows` is the first extraction target because it fits the existing `Shadows` group beside hard shadows and Ambient Occlusion
- `Axes` remains a runtime detail for now instead of a preset-authored setting
- `Background`, presentation object material, presentation ground material, lighting, and edge styling stay in the `Properties-4` follow-up ladder rather than moving to `Properties-5`

Current render-section detailing handoff:
- `Properties-5 - Render Section Detail And Feature Organization`
- `Properties-5 / Phase 1 - Basic Ambient Occlusion Controls` is complete.
- Phase 1 added `AO Intensity` and `AO Radius` sliders, an `AO Quality` select, and a `Custom` AO preset read when saved enabled AO values diverge from `Off / Low / Medium / High`.
- Phase 1 kept Contact Shadows separate, kept advanced AO controls out, and verified store/readback, Properties writes, existing viewer post-processing runtime updates, and focused test coverage.
- `Properties-5 / Phase 2 - Advanced Ambient Occlusion Controls` is complete.
- Phase 2 added saved `ssaoContactBias` and `ssaoDistanceThreshold` fields, exposed `AO Contact Bias` and `AO Distance Threshold` sliders under Properties `Render > Shadows`, mapped them into `SSAOPass.minDistance` and `SSAOPass.maxDistance`, and kept Contact Shadows separate.
- `Properties-5 / Phase 2.1 - Ambient Occlusion Resolution Scale Contract` should own AO `Resolution / Scale` after the runtime can honestly decide whether scale belongs to the whole composer, only the SSAO pass, or a future AO-only render target.
- `Properties-5 / Phase 2.2 - Ambient Occlusion Type Select` is complete.
- Phase 2.2 added a saved `aoType` owner, a Properties `AO Type` ParaSelect with only `Off` and `Basic SSAO` as working choices, legacy `ssaoEnabled` migration, AO preset writes that update the type correctly, and viewer runtime gating so only `Basic SSAO` creates the current SSAO composer path.
- Later AO options such as `GTAO`, `N8AO`, or `Ground Contact AO` remain reserved candidate names until their runtime paths are real.
- `Properties-5 / Phase 2.3 - SAOPass AO Type` is complete.
- Phase 2.3 added `SAO` as the first real alternate AO type beside `Basic SSAO`, backed it with Three.js `SAOPass`, kept unsupported AO engines out of the UI, and kept the Ambient Occlusion preset read as `Custom` for `SAO`.
- `Properties-5 / Phase 2.4 - GTAOPass AO Type` is the next AO engine handoff so GTAO can get a separate denoise/output/settings contract.
- Later AO phases now stay ordered as: Phase 2.5 AO engine visual comparison/default direction, Phase 2.6 engine-specific AO settings and generic AO contract, Phase 2.7 Ground Contact AO decision, Phase 2.8 AO resolution scale/performance controls, and Phase 2.9 AO stacking/preset recipes.
- `N8AO` remains future dependency-planning work outside the current Phase 2 ladder unless the user explicitly promotes it.
- New render controls should become neutral visible settings before built-in presets write values for them.
- Section organization changes should keep related controls together, such as shadows with Ambient Occlusion/contact-depth controls.
- `Display Mode`, `Render Preset`, and `Render Settings` stay separate data concepts unless a later explicit phase changes that.

Current geometry-display handoff:
- `Properties-6 - Geometry Display Surfaces Edges And Points`
- user intent is a new Properties `Render` section for `Surfaces`, `Edges`, and `Points`
- surfaces, edges, and points should each have visibility controls
- surfaces should support `Material Set` or `Custom` source
- custom surface display should use material-like controls such as color, opacity/transparent, metalness, roughness, emissive, and sidedness without mutating material authoring truth
- default, hover, and selected/highlight styling should become editable for surfaces, edges, and points
- this should become the path for rendering Wireframe through Clay Studio as normal visible settings and preset recipes
- `Properties-6 / Phase 1 - Geometry Display Contract And Section Shell` shipped the first saved section shell

Current Properties-6 Phase 1 shipped read:
- `ViewSettings.geometryDisplay` now saves `surfaces.visible`, `edges.mode`, and `points.visible`
- Properties `Render > Geometry Display` now sits after `Viewport Presentation` and before `Environment`
- `Surfaces`, `Edges`, and `Points` controls write the saved Geometry Display contract
- `geometryDisplay.edges.mode` is bridged to legacy `edgeDisplayMode` so old viewer behavior and display-mode migration stay intact
- generated part surface visibility now obeys `Surfaces` without deleting geometry or material assignments
- runtime point rendering remains deferred until the topology/sketch/control point owners are unified by later phases

Current Properties-6 Phase 2 shipped read:
- `geometryDisplay.surfaces` now carries `source: 'materialSet' | 'custom'` and a display-only `customMaterial`
- `Surface Source` defaults to `Material Set` so existing assigned material behavior remains the default
- custom material state is stored in `ViewSettings.geometryDisplay`, not in `ViewSettings.materials`
- Properties `Render > Geometry Display` shows custom surface controls only when `Surface Source` is `Custom`
- custom controls cover color, emissive color, metalness, roughness, opacity, emissive intensity, transparency, and rendering
- the viewer maps `Custom` into generated part surface material presentation without changing project material presets, selected preset, per-part assignments, graph truth, or export truth
- Phase 1 `Surfaces: Off` behavior and edge visibility remain intact with custom surfaces
- hover/selected styling, edge/point styling, Wireframe recipes, Clay Studio recipes, custom preset saving, and runtime point rendering remain later phases

Current Properties-6 Phase 3 shipped read:
- `geometryDisplay.surfaces` now carries `hover`, `selected`, and `bodySelected` color/opacity style objects
- the new surface interaction styles default from and synchronize with existing `ViewSettings.highlights` fields
- Properties `Render > Geometry Display` now shows `Surface Hover Color`, `Surface Hover Opacity`, `Surface Selected Color`, `Surface Selected Opacity`, `Body Selected Color`, and `Body Selected Opacity`
- those controls stay visible for both `Material Set` and `Custom` surface sources
- the viewer now reads face-hover, face-selected, and body-selected overlay colors/opacities from `geometryDisplay.surfaces`
- edge/point hover styling, topology selection behavior, sketch/gizmo/helper styling, and full highlight-family migration remain later-phase work

Current Properties-6 Phase 4 shipped read:
- `geometryDisplay.edges` now carries default display-edge `color`, `opacity`, and `depthMode`
- the shipped `geometryDisplay.edges.mode` / legacy `edgeDisplayMode` compatibility bridge is preserved
- Properties `Render > Geometry Display` now shows `Edge Color`, `Edge Opacity`, and `Edge Depth` only when `Edges` is not `Off`
- the `Edges` mode selector stays visible in all states
- viewer normal display-edge overlays consume the new default edge settings for mesh fallback and semantic/topology display edges
- `Visible Only` keeps depth-tested behavior and `All` keeps xray behavior by default
- edge hover/selected overlay colors and glow moved into Geometry Display in Phase 5
- edge thickness was removed from Geometry Display because the current viewer `LineBasicMaterial` path cannot reliably render non-1px line widths in the browser
- sketch/extrude helper overlays, transform/gizmo overlays, selection outlines, point overlays, Wireframe recipes, and Clay Studio recipes remain out of Phase 4

Current Properties-6 Phase 5.N follow-up read:
- `Properties-6 / Phase 5.1 - Edge Preset Model And Depth UI Cleanup` shipped one `Edge Preset` control over `Off`, `Visible Only`, and `Xray`.
- Phase 5.1 hides `Edge Depth` from normal Properties UI and keeps the existing edge mode/depth fields as compatibility/runtime mappings derived from the preset.
- Phase 5.1 preserved edge color, opacity, hover color/opacity, selected color/opacity, viewer display-edge behavior, and the legacy `edgeDisplayMode` bridge.
- `Properties-6 / Phase 5.2 - Hidden Line Edge Preset Runtime` shipped a real `Hidden Line` preset with solid visible/front edges plus separate dashed behind-surface display edges.
- Phase 5.2 added `hiddenLine` to the edge preset enum and Properties `Edge Preset` select while deriving existing compatibility fields from that preset.
- Phase 5.2 added sibling hidden-line overlays that reuse existing semantic and mesh edge geometry instead of overloading the current one-material display-edge overlay.
- Phase 5.2 preserved graph geometry, export truth, topology selection, hover overlays, helper overlays, and material truth.
- `Properties-6 / Phase 5.3 - Hidden Line Styling And Recipe Prep` shipped saved hidden-line color, opacity, dash length, and gap length controls shown only when `Edge Preset` is `Hidden Line`.
- Phase 5.3 keeps normal edge color/opacity as the solid visible/front layer and routes the hidden-line style only to the dashed hidden layer.
- Phase 5.3 kept hidden-line thickness, alternate dash presets, Wireframe recipes, Clay Studio recipes, and saved custom render presets out of scope.
- `Properties-6 / Phase 5.4 - Edge Depth Hidden Edges And Line Style` shipped saved `hiddenEdges` and `lineStyle` settings plus visible `Edge Depth`, conditional `Hidden Edges`, and conditional `Line Style` controls.
- Hidden-edge viewer overlays now read `geometryDisplay.edges.hiddenEdges && geometryDisplay.edges.depthMode === 'xray'` instead of checking the `Hidden Line` preset name.
- `Hidden Line` is now a recipe: edges on, `Edge Depth: Xray`, `Hidden Edges: On`, visible/front edges solid, hidden-edge layer dashed.
- `Properties-6 / Phase 5.5 - Edge Preset Custom Readback` shipped `Custom` as a read-only selector state derived from mode, depth, hidden-edge visibility, and hidden-edge line style.
- Phase 5.5 keeps saved `geometryDisplay.edges.preset` limited to built-in presets and treats selecting `Custom` as a no-op.
- Edge color, opacity, hidden-edge color, dash/gap, hover, and selected styling do not force `Custom` in the first readback signature.
- `Properties-6 / Phase 6 - Point Visibility And Default Style` is the next Geometry Display handoff.

Current Properties-3 Phase 2 prep read:
- implement against `src/app/workspace/PropertiesRenderSection.tsx`
- keep the existing active controls for `Viewport Style`, Ambient Occlusion, and Render Preview quality
- add `Environment`, `Shadows`, and `Ground` as readback/status groups only
- do not add active `environmentGrade`, `shadowsEnabled`, or `ground` writes until later phases explicitly own those behavior decisions
- keep Clay Studio grade, hard-shadow, ground, and contact treatment as Model Viewport runtime preset-owned behavior for this pass

Current Phase 2 landed read:
- Properties `Render` now visibly separates `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`.
- `Viewport Style`, Ambient Occlusion, and Render Preview quality still write the same existing `ViewSettings` fields.
- `Environment`, `Shadows`, and `Ground` are passive readback/status groups only.
- Phase 3 still owns any active Environment Grade policy/control change.

Current Phase 3 prep read:
- first-pass Clay Studio policy is `Preset Locked`
- Standard mode should expose active Environment Grade sliders in Properties `Render`
- Clay Studio should keep the existing `Viewer.ts` `CLAY_STUDIO_ENVIRONMENT_GRADE` override
- Clay Studio grade controls should be locked/read-only with clear copy instead of silently editing a value that does not affect the Clay Studio look
- reuse the existing grade field set from `ViewToolbar`: `Exposure`, `Contrast`, `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`, and `Saturation`
- preserve `uiPrefsStore.setEnvironmentGrade(...)` normalization and persistence
- do not move environment preset/source, HDRI, lighting, look memory, or A/B compare controls into Properties in Phase 3

Current Phase 3 landed read:
- Properties `Render > Environment` now exposes the existing Environment Grade field set: `Exposure`, `Contrast`, `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`, and `Saturation`.
- Standard mode grade sliders write through the existing `uiPrefsStore.setEnvironmentGrade(...)` normalization path.
- Clay Studio keeps the grade controls disabled and reads as `Preset Locked`.
- `Viewer.ts` still owns the Clay Studio runtime grade override.
- Environment preset/source, HDRI, lighting, look memory, A/B compare, and offset math remain out of scope.

Current Phase 4 prep read:
- Standard mode should expose the existing saved View Toolbar shadow controls in Properties `Render > Shadows`: `Shadows`, selected-light `Cast Shadow`, `Shadow Bias`, and `Shadow Map`.
- Standard mode should expose the existing saved View Toolbar ground controls in Properties `Render > Ground`: `Ground`, `Ground Height`, and `Material`.
- Reuse the existing View Toolbar labels, material preset options, environment-light history helpers, and `groundEditHistory` undo helpers where possible.
- Clay Studio should keep the Shadows and Ground groups visible but locked/read-only because it suppresses hard shadows, forces ground on, retains saved height, uses a preset material, and owns contact treatment in `Viewer.ts`.
- Do not add a `Ground Contact` control, new `ViewSettings` field, or Clay Studio contact-shadow runtime change in Phase 4.
- Focus implementation proof on Properties shadow and ground controls writing only `ViewSettings.shadowsEnabled`, selected-light shadow fields, and `ViewSettings.ground`.

Current Phase 4 landed read:
- Properties `Render > Shadows` now exposes the View Toolbar `Shadows`, selected-light `Cast Shadow`, `Shadow Bias`, and `Shadow Map` controls.
- Properties `Render > Ground` now exposes the View Toolbar `Ground`, `Ground Height`, and `Material` controls.
- Standard-mode shadow and ground controls write the existing `ViewSettings` and selected-light fields without changing viewer runtime behavior.
- Clay Studio keeps the copied Shadows and Ground controls disabled/read-only and reads as `Preset Locked`.
- Ground contact remains preset-owned with no new user setting.

Current Phase 5 planning read:
- Add a new Properties `Render > Grid` section after `Ground` and before `Render Preview Quality`.
- Move the current View Toolbar `Grid` checkbox into Properties as a `ParaSelect` with `Off` / `On`.
- Add a grid height/offset control for the visible presentation grid without changing ground, sketch planes, graph geometry, or export truth.
- Treat the current viewer grid runtime as three user-facing layers: `Grid 1` for minor spacing, `Grid 2` for major spacing, and `Grid 3` for double-major spacing.
- First implementation should use a bounded three-layer model before supporting unlimited custom grid layers.
- Suggested per-layer controls are `On` / `Off`, spacing, color, opacity/visual weight, and small height offset.
- True pixel line width should be deferred unless the grid renderer moves to a fat-line implementation, because common WebGL line width support is unreliable.
- Clay Studio should keep grid suppression preset-owned unless a later Clay Studio policy phase changes that.

Current Phase 5 prep read:
- Keep `ViewSettings.gridVisible` as the canonical top-level `Grid` on/off setting.
- Add `ViewSettings.gridPresentation` for grid height, grid size, and exactly three normalized layers.
- Default `gridPresentation` should reproduce the live viewer grid: size `300`, height `0`, `Grid 1` spacing `1` opacity `0.1`, `Grid 2` spacing `10` opacity `0.3` height offset `0.001`, and `Grid 3` spacing `50` opacity `1` height offset `0.002`.
- Do not add `gridPresentation.enabled`; that would create a second on/off owner beside `gridVisible`.
- Carry `gridPresentation` through the existing view-settings persistence policy paths in `uiPrefsPersistence.ts`.
- Update `Viewer.ts` through a narrow grid-helper sync/rebuild path instead of touching sketch working grids or graph geometry.
- Disable or lock Properties grid controls while Clay Studio is active, but do not mutate saved grid settings.
- First implementation should keep the View Toolbar checkbox unless removing it is trivial after the shared `gridVisible` path is proven.
- Focus proof on Properties scoped writes, settings normalization/persistence, viewer layer rendering defaults/customization, Clay Studio suppression, production build, and `git diff --check`.

Current Phase 5 landed read:
- Properties `Render > Grid` now exists after `Ground` and before `Render Preview Quality`.
- `Grid` writes the existing top-level `ViewSettings.gridVisible` field through an `Off` / `On` `ParaSelect`.
- `ViewSettings.gridPresentation` owns grid height, grid size, and exactly three normalized `Grid 1` / `Grid 2` / `Grid 3` layers.
- The viewer rebuilds the visible model-viewport grid from the grid presentation contract, including size, spacing, color, opacity, and height offsets.
- Clay Studio keeps grid controls disabled/read-only while preserving saved grid settings.
- Graph geometry, sketch grids, ground, materials, export behavior, axis overlay, and true fat-line rendering stayed out of scope.

Current sibling runtime handoff:
- `Properties / Materials`

Current next implementation phase inside that handoff:
- `Materials-1 / Phase 1 - Focused Object Intake And Current Material Truth Read`

Current live prep read for that handoff:
- inherit focused object intake from the now-landed shared shell contract
- map the current typed material truth and mutation seams without overclaiming them as the final owner model
- define the first lane-local read model before target-list or property-edit behavior widens

Current next child-lane runtime handoff after that shell foundation:
- `Materials-1`

### Vision

`Properties` should be the workspace family for editing the currently focused item's inspectable and editable property groups.

The healthy Generation 1 read is:
- `Properties` is a real workspace surface under the shared hybrid workspace model
- the workspace is driven by focused object or item context
- the workspace is sectioned by property group rather than pretending one flat panel is enough forever
- `Materials` is the first active property group and should not be mistaken for the entire final family
- the workspace must stay downstream from the real owner systems for each property group

Important boundary rule:
- if a question is about materials-specific workflow, use the nested `Materials` docs
- if a question is about the broader focused-item property workspace direction, use this index until a future `Properties-Vision.md` exists
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc or the nested subfamily docs

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] `Properties-Gen1-HLG-6. Properties should be able to host workspace-level view/render presentation controls without becoming the owner of viewer runtime behavior.`
- [ ] `Properties-Gen1-HLG-7. Properties Render should expose editable geometry-display settings for surfaces, edges, and points so display styles like Wireframe and Clay Studio can become visible recipes instead of hidden viewer branches.`

### Codex Level Goals

- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.
- [ ] Properties-Gen1-CLG-5. Create one shared-shell follow-on family phase so nested property-group lanes can mount into a real `Properties` workspace surface before child-lane runtime behavior widens.
- [ ] Properties-Gen1-CLG-6. Create one view/render presentation controls family phase so `Viewport Style`, Ambient Occlusion, Environment Grade Controls, ground/contact presentation, and Render Preview quality can be organized under Properties `Render`.
- [ ] Properties-Gen1-CLG-7. Create one geometry-display family phase so surfaces, edges, points, custom display material, hover/highlight styling, and Wireframe/Clay Studio recipe migration have an explicit implementation ladder.

### `Properties-1`

- [ ] Create the standalone `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md` Family Phase Doc.
- [ ] Define the umbrella workspace boundary between `Properties` and its first nested `Materials` subfamily.
- [ ] Keep the first umbrella phase structural instead of competing with the nested materials planning lane.
- [ ] Leave room for later property-group subfamilies without forcing them into this first pass.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-4.

Landed read:
- `Properties-1` is now complete as the structural umbrella closeout
- future candidates such as `Transform` stay reservation-only
- the next shared runtime foundation now belongs to `Properties-2`

### `Properties-2`

- [ ] Create the standalone `Future/Properties-2 - Shared Properties Workspace Shell And Section Hosting.md` Family Phase Doc.
- [x] Mount the real shared `Properties` workspace shell before child-lane runtime behavior widens.
- [x] Make focused-item context enter once at the shell level and flow down into hosted sections.
- [x] Make `Materials` the first hosted property-group section without collapsing the whole workspace into one hard-coded lane.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-5.

### `Properties / Materials`

- [ ] Keep the current materials-specific vision and generation routing under `Properties/Materials/`.
- [ ] Let materials-specific runtime planning continue through the nested subfamily docs instead of flattening it back into the umbrella.
- [ ] Use `Materials` as the first proof that the `Properties` umbrella can host a real property-group workspace lane.
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.

### `Properties-3`

- [x] Create the standalone `Future/Properties-3 - View And Render Presentation Controls.md` Family Phase Doc.
- [x] Organize the existing and planned `ViewSettings` presentation controls under Properties `Render`.
- [x] Keep `Model Viewport` as the viewer runtime owner.
- [x] Decide how Clay Studio should interact with Environment Grade Controls.
- [x] Move View Toolbar Shadows and Ground settings into Properties `Render`.
- [x] Keep Render Preview quality controls visually separate from interactive viewport presentation controls.
- [x] Plan and implement the Properties `Render > Grid` section with a bounded `Grid 1` / `Grid 2` / `Grid 3` layer model.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-5`
- [ ] `Properties-Gen1-HLG-6`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-6.

### `Properties-4`

- [x] Create the standalone `Future/Properties-4 - Render Presets And Viewport Style Consolidation.md` Family Phase Doc.
- [x] Consolidate Shift+D viewport-style selection and Properties `Render` preset selection through one shared path.
- [x] Turn viewport styles into visible render-setting presets instead of hidden viewer-only override modes.
- [x] Make preset-applied values visible in Properties `Render` as the controls below the preset select change.
- [x] Move runtime presentation values into neutral Properties Render settings only after matching setting or preset contracts exist.
- [ ] Plan the path toward `Rendered (Custom)`, `Clay Studio (Custom)`, and later saved custom render presets.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-5`
- [ ] `Properties-Gen1-HLG-6`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-6.

### `Properties-6`

- [x] Create the standalone `Future/Properties-6 - Geometry Display Surfaces Edges And Points.md` Family Phase Doc.
- [x] Add a new Properties `Render > Geometry Display` section.
- [x] Let users turn Surfaces, Edges, and Points on/off from Properties.
- [x] Let Surfaces use either the current Material Set or a Custom display material.
- [x] Let the Custom surface display material expose material-like controls such as color, opacity/transparent, metalness, roughness, emissive, and sidedness.
- [ ] Let Surfaces, Edges, and Points each get default, hover, and selected/highlight presentation controls.
- [x] Convert edge visibility/depth into one `Edge Preset` control before point styling work continues.
- [x] Add a real `Hidden Line` edge preset with dashed behind-surface edges after renderer proof.
- [ ] Move Wireframe and Clay Studio toward visible geometry-display recipe settings instead of permanent hidden viewer-only branches.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-6`
- [ ] `Properties-Gen1-HLG-7`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-6.
- [ ] Properties-Gen1-CLG-7.

### Phase Prep Notes

- the first umbrella phase should stay about family shape and routing, not heavy runtime work
- the next family-level follow-on should be the shared `Properties-2` shell before nested child-lane runtime behavior widens
- materials-specific implementation planning should continue in the nested `Materials` docs
- later property-group subfamilies should only be added when they are real enough to justify their own planning surface

## [x] `Properties-1` - `Workspace Umbrella And Focused-Item Property Routing`

### Family Phase Summary

Create the first implementation-planning surface for the new `Properties` workspace umbrella.

This phase should make the umbrella shape and nested-subfamily routing concrete before broader runtime implementation starts.

The first family phase should stay small:
- one umbrella workspace boundary
- one focused-item property-editing routing answer
- one explicit relationship to the nested `Materials` subfamily
- no fake all-at-once properties architecture

Landed read:
- the umbrella meaning is explicit
- the focused-item entry rule is explicit
- the no-overlap handoff into the nested `Materials` lane is explicit
- later lanes such as `Transform` remain reservation-only
- the next family-level implementation handoff is now `Properties-2`

### HLG / CLG Coverage

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.

### Owns

- the first `Properties` workspace umbrella read
- the first focused-item property-editing family boundary
- the routing relationship between the umbrella and the nested `Materials` subfamily

### Does Not Own

- the full materials-specific workflow, which belongs in `Properties/Materials/`
- the complete runtime properties system
- later property-group subfamilies that are not yet real enough to plan honestly

## [x] `Properties-2` - `Shared Properties Workspace Shell And Section Hosting`

### Family Phase Summary

Create the first runtime-ready shared shell for the `Properties` workspace.

This phase should make the shell and section-hosting contract concrete before the nested `Materials-1` runtime lane begins.

The second family phase should stay shell-first:
- one shared workspace mount
- one focused-item shell-level read
- one section or tab host for nested child lanes
- one clean handoff into `Materials-1`

Current landed read:
- `Phase 1` mounted the real shared `Properties` workspace shell and focused-target entry seam.
- `Phase 2` turned that shell into a real hosted-section frame with `Materials` as the first active section and default tab.
- `Phase 3` closed the shell with an explicit section-facing contract plus shell-owned empty, unsupported, and no-section states.
- the next active runtime handoff now belongs to `Materials-1`.

### HLG / CLG Coverage

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-5. Create one shared-shell follow-on family phase so nested property-group lanes can mount into a real `Properties` workspace surface before child-lane runtime behavior widens.

### Owns

- the first shared `Properties` workspace shell
- the first section-hosting contract for nested property-group lanes
- the family-level handoff into `Materials-1`

### Does Not Own

- materials-specific owner mapping and field behavior
- the full runtime material system
- future property-group subfamilies that are not yet honest to plan
