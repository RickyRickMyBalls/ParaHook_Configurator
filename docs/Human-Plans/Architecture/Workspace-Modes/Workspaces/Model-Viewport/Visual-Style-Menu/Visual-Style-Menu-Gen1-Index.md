# Visual Style Menu Gen 1 Index

## Doc Header

### Doc History
27. 2026-05-22 10:54:37: Marked `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` shipped after adding the persisted edge-follow preference, center radial-menu lock affordance, follow-versus-preserve display-mode recipe behavior, and focused proof.
26. 2026-05-22 10:34:07: Marked `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` implementation-ready after naming `edgeRecipeFollowsDisplayMode` as the UI preference owner and routing the first code cut through the shared display-mode recipe helper, UI prefs persistence, `useViewerDisplayModeMenu`, and Square/Circle radial menu rendering.
25. 2026-05-22 10:31:12: Added `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` as the next planned radial-menu behavior lane for a center lock button that decides whether display-mode changes apply their edge preset recipe or preserve the user's current edge choice.
24. 2026-05-21 23:48:05: Recorded the Circle center hit-test fix that layers the inner edge controls above the large masked outer wedge buttons.
23. 2026-05-21 23:29:14: Recorded the Circle interaction simplification that keeps the pie-slice visuals but returns outside visual-style wedges to direct click-and-close behavior.
22. 2026-05-21 23:25:53: Recorded the Circle outer-button border polish that adds pie-sector rim highlights and changes the outer guide ring from pink to a smaller blue ring.
21. 2026-05-21 23:19:48: Recorded the Circle outer-label refinement that stacks each short/full visual-style label pair inside one counter-rotated wedge label group.
20. 2026-05-21 23:08:11: Recorded the Circle outer-ring thickness refinement that keeps the outside diameter while reducing the inner cutout so labels fit better inside the pie sectors.
19. 2026-05-21 23:04:43: Recorded the Circle outer-ring scale refinement that enlarges the outside pie sectors so the visual-style labels have more room around the center cluster.
18. 2026-05-21 22:54:08: Recorded the Circle outer-control refinement that turns the six outside visual-style buttons into clipped annular pie-slice sectors instead of rounded cards over the ring.
17. 2026-05-21 22:49:48: Recorded the shipped Circle outer-ring visual refinement that adds an inert segmented pie layer behind the six outside visual-style choices without changing Circle or Square behavior.
16. 2026-05-21 22:42:49: Marked `Visual-Style-Menu-1 / Phase 4 - Circle Interaction Model` shipped after adding Circle-only pointer-direction outer visual-style selection while preserving inner edge click behavior and Square click behavior.
15. 2026-05-21 22:38:54: Prepped `Visual-Style-Menu-1 / Phase 4 - Circle Interaction Model` for implementation around Circle-only pointer-direction outer selection, inner edge click preservation, and existing display/style/edge helper writes.
14. 2026-05-21 22:35:29: Marked `Visual-Style-Menu-1 / Phase 3 - Circle Layout Rendering` shipped after adding the Circle `Shift+D` visual layout with the existing option membership and click behavior preserved.
13. 2026-05-21 22:31:25: Prepped `Visual-Style-Menu-1 / Phase 3 - Circle Layout Rendering` as the next implementation slice, limiting it to Circle visual layout rendering with the existing option membership and click handlers while leaving direction-based behavior to Phase 4.
12. 2026-05-21 22:09:21: Marked `Visual-Style-Menu-1 / Phase 2 - Recipe Resolver And Square Runtime Preservation` shipped after wiring the `Shift+D` runtime through the selected recipe resolver while preserving the Square rendered layout and deferring Circle rendering to Phase 3.
11. 2026-05-21 21:59:52: Prepped `Visual-Style-Menu-1 / Phase 2 - Recipe Resolver And Square Runtime Preservation` as the next implementation slice, routing it through the live display-mode menu hook and ViewerHost Square renderer while deferring Circle rendering to Phase 3.
10. 2026-05-21 21:50:26: Shipped the `Visual-Style-Menu-1 / Phase 1.1` Settings polish follow-up so Settings `ParaSelect` and `ParaSlider` controls visually match the compact Properties control rows before Phase 2 begins runtime radial-menu consumption.
9. 2026-05-21 21:40:01: Refined the shipped Phase 1 Settings UI so the radial-menu preset appears in its own `Radial Menu` subsection under `Settings > Viewport`, separated from viewport highlight controls.
8. 2026-05-21 21:37:19: Marked `Visual-Style-Menu-1 / Phase 1 - Settings Radial Menu Recipe Select` shipped after adding the persisted Settings `Viewport` radial-menu preset selector, shared recipe contract, preference history wrapper, and focused proof while keeping runtime radial-menu consumption queued for Phase 2.
7. 2026-05-21 21:30:59: Revised the `Visual-Style-Menu-1 / Phase 1` placement so the first radial-menu recipe selector lives under `Settings > Viewport > Radial Menu` instead of becoming a new top-level Settings section.
6. 2026-05-21 21:25:15: Prepped `Visual-Style-Menu-1 / Phase 1 - Settings Radial Menu Recipe Select` against the live Settings, UI prefs, persistence, and preference-history seams, narrowing the first implementation slice to a persisted `Square`/`Circle` recipe selector with no radial-menu runtime consumption yet.
5. 2026-05-21 21:20:08: Updated the `Visual-Style-Menu-1` route to use a five-phase ladder that separates Settings recipe selection, Square runtime preservation, Circle layout rendering, Circle interaction behavior, and final recipe inventory/follow-up routing.
4. 2026-05-21 21:16:16: Expanded the `Circle` preset planning read so its center edge controls are four quarter-pie click targets, an offset spacer ring separates the clusters, and the outside visual-style ring uses direction-based selection.
3. 2026-05-21 21:10:23: Clarified `Visual-Style-Menu-1` so `Square` retains the current radial menu, `Circle` is the first aesthetic-only alternate preset, and add/subtract visual-style membership remains deferred.
2. 2026-05-21 21:05:45: Added the `Visual-Style-Menu-1 - Settings Workspace Radial Menu Recipes` future doc as the first family phase, shifting the opening route from inventory-only cleanup into Settings-backed radial-menu recipe presets.
1. 2026-05-21 20:59:19: Created the Generation 1 index for the Model Viewport Visual Style Menu family, routing shipped `Shift+D` radial-menu behavior and likely follow-up cleanup into one dedicated planning surface.

### Purpose

This index organizes Generation 1 of the Model Viewport Visual Style Menu family.

Use it for:
- indexing the current visual-style radial menu behavior
- deciding where future `Shift+D` menu cleanup and polish phases should live
- keeping menu behavior aligned with Properties `Render` and Geometry Display without making the radial menu own detailed tuning

## Doc Body

### Generation Goal

Generation 1 turns the already-shipped `Shift+D` visual-style radial into an explicit family:
- visible display modes and built-in viewport styles stay quick actions
- center edge choices stay aligned with Geometry Display edge recipes
- Properties `Render` remains the detailed tuning and readback owner
- future menu polish can be planned without re-opening older Model Viewport runtime phase docs

### Preserved High Level Goals

- [ ] `Visual-Style-Menu-Gen1-HLG-1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [ ] `Visual-Style-Menu-Gen1-HLG-2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`
- [ ] `Visual-Style-Menu-Gen1-HLG-3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`

### Codex Level Goals

- [ ] CLG 1. Inventory the shipped radial menu choices, owners, and readback rules.
- [ ] CLG 2. Keep new edge-style menu choices routed through Geometry Display recipes instead of parallel state.
- [ ] CLG 3. Reserve follow-up menu polish in this family before widening the runtime UI again.

## Family Structure

### Vision

- `Visual-Style-Menu-Vision.md`
  - owns the broad direction and human-level goals

### Generation Index

- `Visual-Style-Menu-Gen1-Index.md`
  - owns the Generation 1 phase routing

### Future

- `Future/`
  - holds implementation-ready future docs when the menu needs cleanup, polish, or restructuring

### Shipped

- `Shipped/`
  - holds completed Visual Style Menu records if a future phase is moved out of active planning

## Phase Routing

### [~] Visual-Style-Menu-1 - Settings Workspace Radial Menu Recipes

#### Goal

Add a Settings workspace radial-menu section with a ParaSelect preset control whose choices are named recipes for radial-menu behavior, then route later runtime consumption through that recipe owner without turning Settings into the display-state owner.

#### Owns

- Settings `Viewport` radial-menu preference placement
- ParaSelect recipe choices for radial-menu settings, starting with `Square` and `Circle`
- persisted selected radial-menu recipe id
- Square runtime preservation before Circle rendering
- aesthetic-only radial-menu layout variation before visual-style membership editing exists
- `Circle` layout rules for quarter-pie inner edge controls, spacer ring separation, and direction-based outer visual-style selection
- Circle interaction rules that keep the outside layer direction-based and the inside layer click-based
- boundaries between radial-menu behavior preferences and live view-setting state
- follow-up routing for radial-menu recipe consumption and inventory cleanup
- a center edge-recipe follow-lock affordance that controls whether display-mode changes also apply display-mode edge recipes

#### Does Not Own

- moving detailed Properties `Render` controls into Settings
- storing current display mode, render preset, or edge preset as radial-menu recipe state
- adding user-authored custom radial-menu layouts in the first phase
- adding or subtracting which visual styles appear in each recipe
- moving detailed Properties controls into the radial menu
- changing geometry, build, export, or project truth

#### Status

- Phase 1 is shipped: Settings now owns the persisted `Square` / `Circle` radial-menu recipe selector under its own `Viewport > Radial Menu` subsection.
- Phase 1.1 is shipped: Settings `ParaSelect` and `ParaSlider` controls now use the compact Properties-style row presentation.
- Phase 2 is shipped: `Shift+D` now resolves the selected recipe while rendering the Square layout for every recipe in this phase.
- Phase 3 is shipped: selected `Circle` now renders its first alternate visual layout while preserving existing click handlers.
- Phase 4 is shipped: Circle outer visual-style choices are direction-based while inner edge choices remain click-based.
- Circle outer-ring visual polish is shipped: the six outside visual-style buttons are thickened clipped annular pie-slice sectors with stacked short/full labels.
- Phase 5 is next: close the first Settings-backed recipe model with shipped recipe inventory and follow-up routing.
- Phase 6 is shipped: the center edge-recipe follow-lock button is backed by `edgeRecipeFollowsDisplayMode`, so display-mode changes can either follow display-mode edge recipes or preserve the current edge preset.
- Future doc exists at `Future/Visual-Style-Menu-1 - Settings Workspace Radial Menu Recipes.md`.

## Current Shipped References

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-3 - Display Mode Radial Menu And Render Preview.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-4 - Semantic Topology Display And Selection.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-5 - Clay Studio And SSAO Viewport Style.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-4 - Render Presets And Viewport Style Consolidation.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-6 - Geometry Display Surfaces Edges And Points.md`
