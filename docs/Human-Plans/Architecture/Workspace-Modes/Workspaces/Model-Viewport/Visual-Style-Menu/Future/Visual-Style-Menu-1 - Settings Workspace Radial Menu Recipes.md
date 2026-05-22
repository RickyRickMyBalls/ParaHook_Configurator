# Visual-Style-Menu-1 - Settings Workspace Radial Menu Recipes

## Doc Header

### Doc History
26. 2026-05-22 10:54:37: Implemented and closed `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` with a persisted `edgeRecipeFollowsDisplayMode` UI preference, a center radial-menu lock button, display-mode recipe preserve-edge behavior while unlocked, and focused store/persistence/hook/menu proof.
25. 2026-05-22 10:34:07: Prepped `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` for implementation by grounding the center lock button in the live UI prefs persistence path, the shared display-mode recipe helper, the `useViewerDisplayModeMenu` action seam, and the Square/Circle radial menu DOM so the phase can add follow-versus-preserve behavior without blocking manual edge edits.
24. 2026-05-22 10:31:12: Added `Visual-Style-Menu-1 / Phase 6 - Edge Recipe Follow Lock` to plan a tiny center lock affordance that lets display-mode changes either follow the display-mode edge recipe or preserve the user's current edge preset.
23. 2026-05-21 23:48:05: Fixed Circle center hit testing by layering the center edge cluster above the masked outer wedge buttons while preserving the current visuals and click behavior.
22. 2026-05-21 23:29:14: Returned Circle outer visual-style wedges to normal direct click-and-close behavior while keeping the pie-slice visuals and center edge click behavior.
21. 2026-05-21 23:25:53: Refined the Circle outer wedge presentation with button-like radial/conic border highlights, a subtle label shadow, and a smaller blue guide ring replacing the louder pink ring.
20. 2026-05-21 23:19:48: Refined Circle outer wedge labels by wrapping each short/full visual-style label pair in one counter-rotated stacked text group so side wedges render on two lines instead of collapsing into one string.
19. 2026-05-21 23:08:11: Thickened the Circle outer annular pie sectors by reducing the inner cutout while keeping the same outer diameter, giving the outside visual-style labels more room inside each wedge.
18. 2026-05-21 23:04:43: Enlarged the Circle outer pie ring and annular wedge buttons to roughly double the previous outside circle size so the six visual-style sectors have more room around the center cluster.
17. 2026-05-21 22:54:08: Refined the Circle outer controls so the six outside visual-style buttons themselves are clipped annular pie-slice sectors rather than rounded cards sitting over a pie guide.
16. 2026-05-21 22:49:48: Shipped a Circle visual refinement that adds an inert segmented outer pie layer behind the six Circle visual-style choices so the outside ring reads like the sketched pie slices without changing Circle direction behavior or option actions.
15. 2026-05-21 22:42:49: Implemented and closed `Visual-Style-Menu-1 / Phase 4 - Circle Interaction Model` with Circle-only pointer-direction outer visual-style selection, inner edge click preservation, active direction feedback, and focused Circle/Square Shift+D proof while preserving existing helper-path writes.
14. 2026-05-21 22:38:54: Prepped `Visual-Style-Menu-1 / Phase 4 - Circle Interaction Model` against the shipped Circle layout, narrowing the next slice to pointer-angle outer-ring direction selection, inner edge click preservation, existing helper writes, and focused tests that Square behavior remains unchanged.
13. 2026-05-21 22:35:29: Implemented and closed `Visual-Style-Menu-1 / Phase 3 - Circle Layout Rendering` by letting selected `Circle` become the rendered recipe, adding a Circle-specific `Shift+D` layout with a circular center edge cluster, inert spacer ring, and rounded outer visual-style ring, while preserving existing click handlers and deferring direction-based behavior to Phase 4.
12. 2026-05-21 22:31:25: Prepped `Visual-Style-Menu-1 / Phase 3 - Circle Layout Rendering` against the Phase 2 selected/rendered recipe seam, live `ViewerHost` radial-menu DOM, and `viewport-overlay.css` menu classes, narrowing the phase to Circle visual layout only with existing click handlers and direction-based behavior still deferred to Phase 4.
11. 2026-05-21 22:09:21: Implemented and closed `Visual-Style-Menu-1 / Phase 2 - Recipe Resolver And Square Runtime Preservation` by routing `Shift+D` through the resolved visual-style menu recipe, exposing selected versus rendered recipe ids for proof, keeping `Square` as the Phase 2 rendered layout even when `Circle` is selected, and adding focused hook/component tests.
10. 2026-05-21 21:59:52: Prepped `Visual-Style-Menu-1 / Phase 2 - Recipe Resolver And Square Runtime Preservation` against the live `useViewerDisplayModeMenu` hook, `ViewerHost` radial-menu renderer, `visualStyleMenuRecipes` contract, and focused hook/component tests, keeping the phase to runtime recipe consumption plus exact `Square` parity with no `Circle` rendering.
9. 2026-05-21 21:50:26: Shipped the quick `Visual-Style-Menu-1 / Phase 1.1 - Settings Para Control Visual Match` follow-up so Settings workspace `ParaSelect` and `ParaSlider` controls use the compact Properties-style row treatment, including chevron select caps for Settings `ParaSelect` controls.
8. 2026-05-21 21:40:01: Refined the shipped Phase 1 Settings placement so the radial-menu preset sits in its own labeled `Radial Menu` subsection inside `Settings > Viewport`, separated from the existing viewport highlight controls.
7. 2026-05-21 21:37:19: Implemented and closed `Visual-Style-Menu-1 / Phase 1 - Settings Radial Menu Recipe Select` with a persisted Settings `Viewport` radial-menu preset selector, shared `Square`/`Circle` recipe contract, UI preference history wrapper, persistence fallback, and focused Settings/store/persistence proof while leaving runtime radial-menu consumption deferred.
6. 2026-05-21 21:30:59: Revised the Phase 1 prep so the radial-menu selector lands as a `Settings > Viewport > Radial Menu` subsection instead of a new top-level Settings section, treating the current `Viewport` Settings area as the model-viewport/viewer-presentation preference bucket for this first pass.
5. 2026-05-21 21:25:15: Prepped `Visual-Style-Menu-1 / Phase 1 - Settings Radial Menu Recipe Select` for implementation against the live Settings surface, UI prefs store, persistence bridge, and preference-history seams, narrowing the first cut to a new Settings `Radial Menu` section, a persisted `Square`/`Circle` recipe id, and focused Settings/store/persistence proof with no runtime radial-menu consumption yet.
4. 2026-05-21 21:20:08: Split the original broad recipe-consumption phase into a five-phase ladder: Settings recipe select, resolver plus Square runtime preservation, Circle layout rendering, Circle interaction model, and recipe inventory/follow-up routing.
3. 2026-05-21 21:16:16: Expanded the `Circle` preset intent so the center edge menu becomes four quarter-pie slices, an offset spacer ring separates the clusters, the six visual-style choices sit on an outer circle, outer choices are direction-based, and the inner edge layer remains click-based.
2. 2026-05-21 21:10:23: Revised the first recipe plan so the existing `Shift+D` menu is retained as the `Square` preset, the first new preset is `Circle`, and the Circle pass is explicitly aesthetic-only while add/subtract visual-style membership is deferred.
1. 2026-05-21 21:05:45: Created this future doc to plan the first Visual Style Menu family phase around adding Settings workspace controls for `Shift+D` radial-menu behavior, starting with a ParaSelect preset/recipe model for the radial menu section.

### Purpose

This doc plans the first implementation-ready phase for the Model Viewport Visual Style Menu family.

Use it for:
- adding radial-menu settings into the Settings workspace
- defining a ParaSelect preset/recipe control for radial-menu behavior
- keeping the `Shift+D` visual-style menu configurable without making Settings own geometry or render truth
- preserving the current quick radial menu shape while preparing later visual-style menu polish

Do not use it for:
- changing the graph, build, export, or geometry execution path
- moving detailed Properties `Render` controls into Settings
- adding saved custom render presets beyond the first radial-menu preset recipe model
- redesigning the full radial menu layout before the Settings-backed recipe owner exists

## Doc Body

### Family Phase Goal

`Visual-Style-Menu-1` makes the quick `Shift+D` visual-style menu configurable from the Settings workspace.

The first pass should add a dedicated radial-menu settings section and a ParaSelect-style preset control whose options are recipes. Each recipe should apply a known set of settings for the radial menu behavior rather than storing a vague selected-preset label that becomes a second owner.

The visual target starts from the current menu shape:
- outer choices for `Wireframe`, `Material`, `Solid`, `Rendered`, `Clay Studio`, and `Render Preview`
- center choices for `On`, `Off`, `Only`, and `Hidden`
- selected states that read back from real view settings

The first recipe names are:
- `Square`
  - the current shipped menu layout
  - the default recipe
- `Circle`
  - a new aesthetic-only layout recipe
  - uses the same menu choices and actions as `Square` in the first pass
  - converts the center edge menu into four quarter-pie click targets
  - adds an offset spacer ring between the center edge controls and the outer visual-style controls
  - places `Wireframe`, `Material`, `Rendered`, `Render Preview`, `Clay Studio`, and `Solid` on an outer circular layer
  - uses direction-based selection for the outer visual-style layer while the inner edge layer remains click-based

Later phases may add or subtract which visual styles appear in a recipe, but `Visual-Style-Menu-1` should not introduce that membership editor yet.

### Boundary Rules

- Settings may own user preference defaults for how the radial menu presents and behaves.
- View settings remain the owner for actual display mode, render preset, and Geometry Display edge recipe state.
- Properties `Render` remains the detailed tuning surface for viewport presentation settings.
- The radial menu should consume Settings preferences and shared view-setting helpers; it should not invent its own durable display-state contract.
- Recipes should be explicit objects with stable labels and values, not one-off branching inside the radial menu component.

### Architecture Direction

The clean direction is:

```text
Settings > Viewport > Radial Menu
  -> ParaSelect recipe choice
  -> persisted UI preference
  -> shared recipe resolver
  -> Shift+D radial menu presentation/behavior
  -> existing view-setting writes when a radial option is selected
```

The Settings workspace should expose the user's preference. The radial menu should apply that preference only when it decides how to show or arrange the menu. Actual selected visual mode should still come from `ViewSettings`.

### Acceptance Read

This family phase is successful when the repo has a clear implementation path for adding a `Settings > Viewport > Radial Menu` subsection with a ParaSelect recipe selector, preserving the shipped layout as `Square`, rendering the alternate `Circle` layout, proving Circle's outside-direction/inside-click interaction model, and leaving later add/subtract visual-style membership work as an explicit follow-up instead of hiding it inside the first preset pass.

## Vision

The visual-style menu should feel like a fast, deliberate viewport command surface, while Settings gives the user a calm place to choose how that surface behaves.

The first version should focus on preset recipes for the radial menu settings, not a broad custom editor. The menu stays quick; Settings gets the durable preference; Properties keeps detailed render and geometry-display tuning.

`Square` is the current menu preserved as a named preset. `Circle` is the first alternate preset and should only change the menu's aesthetic/layout presentation for now.

In the `Circle` preset, the center cluster should read as a true radial control: `On`, `Off`, `Only`, and `Hidden` each occupy one quarter of the center circle. A visible empty spacer ring should separate that click-based center control from the outer visual-style ring. The outer ring holds the six visual choices and should behave directionally, so moving toward a direction chooses the outside visual-style option while clicking the center still chooses only one of the edge options.

## Wishlist Organization

### High Level Goals

- [ ] `Visual-Style-Menu-Gen1-HLG-1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [ ] `Visual-Style-Menu-Gen1-HLG-2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`
- [ ] `Visual-Style-Menu-Gen1-HLG-3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`
- [ ] `Visual-Style-Menu-1-HLG-1. Add different radial menu settings into the Settings workspace.`
- [ ] `Visual-Style-Menu-1-HLG-2. Make a ParaSelect preset control with different recipes for the radial menu settings.`

### Codex Level Goals

- [ ] CLG 1. Add a Settings workspace section for radial-menu preferences without mixing it with Properties render tuning.
- [ ] CLG 2. Define the first radial-menu preset recipe contract with stable option ids, labels, and resolved settings.
- [ ] CLG 3. Route the radial menu through the recipe resolver while keeping view-setting writes on the existing display-mode and Geometry Display owners.
- [ ] CLG 4. Prove that recipe selection persists and that the menu still reads active visual state from real view settings.

### `Visual-Style-Menu-1 / Phase 1`

- [x] Add the Settings `Viewport` subsection for radial-menu preferences.
- [x] Add the first ParaSelect preset/recipe control for radial-menu settings.
- [x] Include `Square` as the default recipe for the current menu and `Circle` as the first aesthetic-only alternate.
- [x] Store the chosen recipe in UI preferences.
- [x] Keep the recipe value separate from current display mode, current render preset, and current edge preset.
- [x] Keep add/subtract visual-style membership editing deferred.
- [x] `HLG 1. Add different radial menu settings into the Settings workspace.`
- [x] `HLG 2. Make a ParaSelect preset control with different recipes for the radial menu settings.`

### `Visual-Style-Menu-1 / Phase 2`

- [x] Route the `Shift+D` radial menu through the selected radial-menu recipe.
- [x] Keep `Square` visually and behaviorally identical to the current shipped menu.
- [x] Preserve the current option writes for display modes, render presets, and edge recipes.
- [x] Keep the menu's checked states based on live `ViewSettings`.
- [x] `HLG 1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [x] `HLG 3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`

### `Visual-Style-Menu-1 / Phase 3`

- [x] Make the `Circle` center edge cluster four quarter-pie click targets.
- [x] Add the offset spacer ring between the inner edge cluster and outer visual-style ring.
- [x] Place the same six visual-style choices on the outer circular layer.
- [x] Keep `Circle` aesthetic/layout-only, not a visual-style membership editor.
- [x] `HLG 1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [x] `HLG 2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`

### `Visual-Style-Menu-1 / Phase 4`

- [x] Make the `Circle` outer visual-style ring direction-based.
- [x] Keep the `Circle` inner edge layer click-based.
- [x] Preserve action routing through existing display-mode, render-preset, and edge-recipe helpers.
- [x] Keep the menu's checked states based on live `ViewSettings`.
- [x] `HLG 1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [x] `HLG 3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`

### `Visual-Style-Menu-1 / Phase 5`

- [ ] Add focused proof for recipe persistence, Settings UI selection, and radial-menu consumption.
- [ ] Document the shipped recipe list and any deferred recipes.
- [ ] Leave full custom radial-menu editing for a later family phase.
- [ ] `HLG 2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`

### `Visual-Style-Menu-1 / Phase 6`

- [x] Add a tiny lock/unlock button in the center of the `Shift+D` radial menu.
- [x] Treat the lock as "edge preset follows display-mode recipe" rather than "edge controls are disabled."
- [x] Default the follow lock to enabled so display-mode recipes continue applying their edge recipe by default.
- [x] When the follow lock is enabled, display-mode changes apply the display-mode recipe for surfaces and edges.
- [x] When the follow lock is disabled, display-mode changes apply the display-mode recipe for non-edge presentation while preserving the user's current edge preset/settings.
- [x] Keep direct edge preset changes available regardless of lock state.
- [x] Keep Properties `Render > Geometry Display` as the detailed edge tuning owner.
- [x] `HLG 2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`
- [x] `HLG 3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`

## [x] `Visual-Style-Menu-1 / Phase 1` - `Settings Radial Menu Recipe Select`

### Phase 1 Summary

#### Purpose

Add the first Settings workspace control for radial-menu preferences: a ParaSelect preset control that chooses between named radial-menu recipes.

#### Owns

- a new `Radial Menu` subsection inside the existing Settings `Viewport` section
- the first radial-menu recipe option list
- a persisted UI preference for the selected radial-menu recipe
- ParaSelect read/write behavior for the selected recipe
- reset/default behavior for the first recipe selector

#### Does Not Own

- changing the `Shift+D` runtime menu yet
- adding user-authored custom radial-menu layouts
- changing display mode, render preset, or Geometry Display edge preset contracts
- replacing Properties `Render` controls
- adding new visual styles to the viewport

#### Current Live Read

- `src/app/workspace/SettingsSurface.tsx` owns the Settings section rail, active-section content switch, `SettingsSectionId`, and section-specific editor controls.
- The existing Settings `Viewport` section is the current model-viewport/viewer-presentation preference bucket, covering projection, axis overlay, and viewport highlight settings.
- Settings already imports `ParaSelect` and uses it for shortcut preset and Spaghetti window appearance choices, so the radial-menu preset should use the same control pattern.
- `src/app/store/uiPrefsStore.ts` owns durable UI preference fields such as `workspaceStartupSurface`, `workspacePanelShellPaddingPx`, and `workspaceNestedResizeKeepsFarPane`, with setter methods and normalization where needed.
- `src/app/store/uiPrefsPersistence.ts` serializes, normalizes, hydrates, and writes the durable UI preference snapshot through `serializePersistedUiPrefs(...)`, `normalizePersistedUiPrefs(...)`, and the persistence bridge.
- `src/app/store/uiPreferenceEditHistory.ts` already wraps Settings-owned UI preference edits such as workspace pane radius, panel padding, nested resize behavior, startup surface, and console input priority.
- `src/app/workspace/SettingsSurface.test.tsx`, `src/app/store/uiPrefsStore.test.ts`, and `src/app/store/useUiPrefsPersistenceBridge.test.tsx` are the likely focused proof surfaces for Phase 1.
- The current `Shift+D` radial menu has outer visual-style choices and a four-option center edge cluster, but Phase 1 should not read or alter that runtime component yet.

#### First Pass Decisions

1. The first Settings control should be a ParaSelect, not a grid of switches.
2. The first option should be `Square`, which retains the current menu shape as the default recipe.
3. The first alternate option should be `Circle`, which is aesthetic-only in this family phase.
4. `Circle` should be specified as a layout recipe with an inner quarter-pie edge control, a spacer ring, and an outer visual-style ring.
5. Place the first radial-menu control inside the existing Settings `Viewport` section as a `Radial Menu` subsection/group.
6. The durable preference should be a selected recipe id such as `radialMenuRecipeId`, not a current display mode, render preset, or edge preset value.
7. Recipe constants should live in one small shared app module that both Settings and later radial-menu runtime code can import.
8. Persisted unknown recipe ids should normalize back to `Square`.
9. The Settings edit should use a history-wrapped UI preference helper, matching the existing Settings preference pattern.
10. Later recipes can adjust menu arrangement, density, or which quick edge cluster is emphasized, but Phase 1 only needs the owner and selector.
11. Add/subtract visual-style membership editing is a later feature, not part of the first recipe selector.
12. Recipe selection should not imply a current viewport style selection.
13. `Custom` should not ship as a selectable first-pass recipe unless the implementation already has enough structural readback to support it honestly.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a small radial-menu recipe contract module, likely `src/app/visualStyleMenuRecipes.ts`, with:
   - `VisualStyleMenuRecipeId`
   - `DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID`
   - `visualStyleMenuRecipeOptions`
   - `normalizeVisualStyleMenuRecipeId(...)`
   - `getVisualStyleMenuRecipeDefinition(...)` or an equivalent resolver for later phases
2. Add the first recipe ids:
   - `Square`
   - `Circle`
3. Give `Circle` enough recipe metadata to describe:
   - inner edge control shape: quarter-pie
   - spacer ring: enabled
   - outer visual-style control shape: ring
   - outer interaction: direction-based
   - inner interaction: click-based
4. Add `radialMenuRecipeId` to `UiPrefsState` in `src/app/store/uiPrefsStore.ts`, defaulting to `Square`.
5. Add `setRadialMenuRecipeId(...)` to normalize writes through `normalizeVisualStyleMenuRecipeId(...)`.
6. Add `radialMenuRecipeId` to `src/app/store/uiPrefsPersistence.ts` serialization, normalization, hydration, merge/write path, and persistence tests.
7. Add a `setRadialMenuRecipeWithHistory(...)` helper in `src/app/store/uiPreferenceEditHistory.ts` with a stable target id such as `ui-pref:radialMenuRecipeId`.
8. Add a `Radial Menu` subsection/group inside the existing `viewport` Settings content in `src/app/workspace/SettingsSurface.tsx`.
9. Add a `Preset` ParaSelect in that subsection using the recipe options.
10. Add a read row under the existing `viewport` section so `All` and `Viewport` both expose the selected radial-menu preset summary.
11. Wire the ParaSelect to `setRadialMenuRecipeWithHistory(...)`.
12. Add focused tests for default value, selecting `Circle`, selecting back to `Square`, persistence hydration, invalid persisted fallback, and the Settings section/render path.

#### Likely Files

- `src/app/visualStyleMenuRecipes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/useUiPrefsPersistenceBridge.ts`
- `src/app/store/uiPreferenceEditHistory.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `src/app/store/uiPreferenceEditHistoryStore.test.ts`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- shared Settings workspace CSS if the section needs a small layout class

#### No-Widening Rule

Do not import or consume the selected recipe from `ViewerHost`, `useViewerDisplayModeMenu`, or viewport overlay rendering in Phase 1. The first cut should create the Settings owner, recipe contract, persistence path, and selector only, so Phase 2 can prove `Square` runtime preservation deliberately.

#### Implementation Result

Phase 1 shipped the Settings-side radial-menu recipe owner only. `src/app/visualStyleMenuRecipes.ts` now defines the first `Square` and `Circle` recipe ids, labels, normalized fallback behavior, ParaSelect options, and Circle layout metadata for later runtime phases. `src/app/store/uiPrefsStore.ts`, `src/app/store/uiPrefsPersistence.ts`, and `src/app/store/useUiPrefsPersistenceBridge.ts` now persist `radialMenuRecipeId` with unknown values falling back to `Square`. `src/app/store/uiPreferenceEditHistory.ts` wraps recipe edits for undo/redo metadata, and `src/app/workspace/SettingsSurface.tsx` exposes the selector in its own `Radial Menu` subsection inside the existing Settings `Viewport` surface with a summary row for `All` / `Viewport` reads.

The live `Shift+D` radial menu remains untouched in this phase; selected recipe consumption starts in Phase 2.

#### Implementation Risks

- The recipe selector could accidentally look like it changes the current viewport style.
- A stored selected recipe id could become parallel state if the radial menu starts using it as actual display state.
- Settings and Properties could blur if the recipe starts carrying detailed render or edge-style values that belong in Properties.
- `Circle` could accidentally become a feature-membership editor if implementation tries to add/remove visual styles too early.
- Forgetting the persistence bridge or serializer would make the selector look editable for one session but not survive reload.
- Adding the section without a summary row could make it disappear from `All` if the existing Settings grouping only includes sections with rows.
- Skipping the history wrapper would make this Settings edit inconsistent with nearby UI preferences.

#### Checklist

- [x] Add the typed selected radial-menu recipe preference.
- [x] Add `Square` and `Circle` recipe constants/options and a `Square` fallback resolver.
- [x] Include `Circle` metadata for quarter-pie inner edge controls, spacer ring, outer visual-style ring, direction-based outer interaction, and click-based inner interaction.
- [x] Add the Settings `Viewport` radial-menu subsection/group.
- [x] Add the `Preset` ParaSelect.
- [x] Add the UI preference history wrapper.
- [x] Add persistence serialization, hydration, and unknown-id fallback proof.
- [x] Add Settings `Viewport` subsection and ParaSelect proof for `Square` and `Circle`.
- [x] Keep the current radial menu runtime untouched.

#### Verification Shape

- focused Settings workspace test for rendering and selecting the radial-menu preset
- focused UI prefs/store test for normalization and persistence
- focused UI preference history test for the new recipe setter
- focused persistence bridge test for saved `Circle` hydration and invalid persisted fallback to `Square`
- no viewer runtime tests required until Phase 2 consumes the recipe

#### Done Shape

Phase 1 is shipped. Settings exposes `Viewport > Radial Menu` as its own subsection with a persisted `Preset` ParaSelect, `Square` is the default current-layout recipe, `Circle` is available as an aesthetic-only alternate, the selected recipe is normalized, history-wrapped, persisted, and test-covered, and the live `Shift+D` menu still behaves exactly as before because runtime consumption remains deferred.

## [x] `Visual-Style-Menu-1 / Phase 1.1` - `Settings Para Control Visual Match`

### Phase 1.1 Summary

#### Purpose

Make the Settings workspace `ParaSelect` and `ParaSlider` controls visually match the compact controls already used by Properties, starting with the new `Viewport > Radial Menu` preset selector and nearby viewport highlight sliders.

#### Owns

- Settings workspace Para control presentation polish
- compact row sizing for Settings `ParaSelect` and `ParaSlider` controls
- chevron cap glyphs for Settings `ParaSelect` controls
- focused Settings proof that the radial-menu selector and viewport sliders use the intended control structure

#### Does Not Own

- changing saved Settings values
- changing `ParaSelect` or `ParaSlider` behavior
- changing Properties control behavior
- changing the live `Shift+D` radial menu

#### Implementation Result

Settings editor fields now inherit the compact Properties-style `ParaSelect` / `ParaSlider` row treatment from `src/app/theme/surfaces/settings.css`, and Settings `ParaSelect` instances in `src/app/workspace/SettingsSurface.tsx` use chevron caps to match Properties controls. The radial-menu preset selector remains in the `Viewport > Radial Menu` subsection, and highlight sliders remain in `Viewport Highlights`.

#### Verification Shape

- focused Settings test for the radial-menu subsection, chevron select cap, and viewport highlight slider structure

#### Done Shape

Phase 1.1 is shipped when Settings `ParaSelect` and `ParaSlider` controls visually align with Properties-style compact rows without changing saved values, edit history, persistence, or runtime radial-menu behavior.

## [x] `Visual-Style-Menu-1 / Phase 2` - `Recipe Resolver And Square Runtime Preservation`

### Phase 2 Summary

#### Purpose

Wire the `Shift+D` radial menu to the selected Settings recipe while proving the default `Square` recipe keeps the current shipped menu visually and behaviorally intact.

#### Owns

- reading the selected radial-menu recipe in the radial menu host/hook
- resolving unknown or missing recipe ids back to `Square`
- applying the `Square` recipe without changing the current menu layout
- keeping active option state tied to `ViewSettings`
- focused proof that recipe wiring does not regress current menu behavior

#### Does Not Own

- rendering the `Circle` layout
- implementing direction-based outer-ring selection
- adding new viewport styles
- changing Geometry Display recipe semantics
- adding custom recipe authoring
- moving detailed render settings into the radial menu

#### Current Live Read

- `src/app/visualStyleMenuRecipes.ts` now owns `Square` / `Circle` recipe definitions, `DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID`, `normalizeVisualStyleMenuRecipeId(...)`, and `getVisualStyleMenuRecipeDefinition(...)`.
- `src/app/store/uiPrefsStore.ts` owns the saved `radialMenuRecipeId` preference and normalizes direct writes.
- `src/app/store/uiPrefsPersistence.ts` and `src/app/store/useUiPrefsPersistenceBridge.ts` persist and hydrate the recipe id, already falling invalid values back to `Square`.
- `src/app/useViewerDisplayModeMenu.ts` owns the `Shift+D` open/close state and the existing actions for display mode, viewport style, and center edge choices.
- `src/app/components/ViewerHost.tsx` owns the current visual Square layout through `displayModeMenuOptions`, `viewportStyleMenuOptions`, `edgeDisplayModeMenuOptions`, and the `ViewportDisplayModeMenu*` DOM/CSS classes.
- `src/app/components/ViewerHost.test.tsx` already proves the four center edge controls and the Clay Studio outer entry.
- `src/app/useViewerDisplayModeMenu.test.tsx` already proves keyboard ownership, display-mode writes, edge writes, hidden-line writes, and menu close/stay-open behavior.

#### First Pass Decisions

1. The runtime should consume a resolved recipe definition, not branch directly on raw persisted strings.
2. The safest Phase 2 seam is a small hook/view-model addition that exposes the resolved recipe id/definition to `ViewerHost`.
3. `Square` should be the only rendered layout in Phase 2, even when the stored recipe is `Circle`.
4. `Circle` may be read and recognized by the resolver, but the renderer should continue to use Square until Phase 3 adds the Circle render path.
5. Unknown, missing, or test-injected bad recipe ids should resolve to `Square`.
6. The current active-state rules must remain unchanged:
   - display-mode buttons read `ViewSettings.displayMode` while `viewportStyle` is `standard`
   - Clay Studio reads `ViewSettings.viewportStyle`
   - center edge buttons read `ViewSettings.edgeDisplayMode` and `ViewSettings.geometryDisplay.edges.preset`
7. Center edge choices should keep their current behavior: edge choices do not close the menu, display-mode/style choices do close it.
8. If a recipe layout mode is introduced in the DOM, Phase 2 should label it as Square/current layout and keep CSS output identical.
9. Tests should prove runtime consumption is wired without relying on visual screenshots.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Import `getVisualStyleMenuRecipeDefinition(...)` and the recipe types from `src/app/visualStyleMenuRecipes.ts` near the existing display-mode menu runtime seam.
2. Read `radialMenuRecipeId` from `useUiPrefsStore` in the runtime menu owner.
3. Resolve the stored id through the shared recipe resolver instead of trusting the raw string.
4. Expose the resolved recipe to `ViewerHost` through the existing `displayModeMenu` hook result or a small adjacent local selector, preferring the least invasive seam.
5. Keep the actual rendered layout on the existing Square DOM/CSS structure for every resolved recipe in Phase 2.
6. If `Circle` is selected in Settings, the menu should still render the Square layout in Phase 2 while the resolver/read path is proven.
7. Keep all option arrays and handlers routed through the existing helpers:
   - `selectDisplayMode(...)`
   - `selectViewportStyle(...)`
   - `selectEdgeDisplayMode(...)`
8. Keep active state based on current display mode, render preset, and edge preset.
9. Add focused hook/component tests proving:
   - default `Square` recipe is resolved and the current menu still renders
   - selected `Circle` is read/resolved without changing the rendered Square layout yet
   - a bad recipe id falls back to `Square`
   - the six outer choices and four center edge choices remain present
   - current close/stay-open behavior is unchanged

#### Likely Files

- `src/app/useViewerDisplayModeMenu.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/useViewerDisplayModeMenu.test.tsx`
- radial-menu CSS near viewport overlay styling

#### No-Widening Rule

Do not render the `Circle` preset in this phase. This phase exists to create the runtime recipe seam and prove `Square` parity before introducing a second layout.

Do not move `displayModeMenuOptions`, `viewportStyleMenuOptions`, or `edgeDisplayModeMenuOptions` into recipe membership editing in this phase. Recipe membership stays fixed until a later add/subtract visual-style phase.

Do not change `src/app/visualStyleMenuRecipes.ts` metadata unless a type-only field is needed for Square parity proof. The Phase 1 contract already contains enough shape data for Phase 2.

#### Implementation Result

Phase 2 shipped the runtime recipe seam without changing the visible `Shift+D` menu. `src/app/useViewerDisplayModeMenu.ts` now resolves the saved `radialMenuRecipeId` through the shared recipe resolver and exposes both the selected recipe and the Phase 2 rendered recipe. `src/app/components/ViewerHost.tsx` stamps the menu with selected and rendered recipe ids so tests can prove `Circle` is read while the rendered layout remains `Square`.

The existing option handlers, option membership, active-state reads, center edge stay-open behavior, and outer display/style close behavior remain unchanged.

#### Verification Shape

- `npm.cmd test -- --run src/app/useViewerDisplayModeMenu.test.tsx`
- `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx -t "Shift\\+D"`
- focused proof that `Square` still exposes the same six outer choices and four center edge choices
- focused proof that selected `Circle` is read by the runtime seam but still rendered with the Square layout in Phase 2
- no Settings workspace tests required unless the resolver/prefs contract changes

#### Done Shape

Phase 2 is shipped. The radial menu consumes the Settings-selected recipe, `Square` remains the shipped rendered layout, unknown recipe ids fall back safely, selected `Circle` is read without rendering Circle yet, and active/readback state still comes from real view settings.

## [x] `Visual-Style-Menu-1 / Phase 3` - `Circle Layout Rendering`

### Phase 3 Summary

#### Purpose

Render the `Circle` preset as an alternate aesthetic layout with the same available choices as `Square`.

#### Owns

- four inner quarter-pie visual edge targets for `On`, `Off`, `Only`, and `Hidden`
- an empty spacer ring between inner and outer control layers
- an outer circular layer for `Wireframe`, `Material`, `Rendered`, `Render Preview`, `Clay Studio`, and `Solid`
- visual active-state styling in the Circle layout

#### Does Not Own

- direction-based selection behavior
- adding or removing visual-style options per recipe
- changing the action semantics of any menu option
- changing Properties render or Geometry Display tuning controls

#### Current Live Read

- `src/app/useViewerDisplayModeMenu.ts` now exposes the selected recipe and the rendered recipe. Phase 2 keeps `renderedRecipe` as `Square`; Phase 3 should let selected `Circle` become the rendered recipe.
- `src/app/components/ViewerHost.tsx` owns the current `Shift+D` render branch with:
  - `ViewportDisplayModeMenu` as the menu root
  - `ViewportDisplayModeMenuCenter` as the center edge cluster
  - `ViewportDisplayModeMenuEdgeItem` for `On`, `Off`, `Only`, and `Hidden`
  - `ViewportDisplayModeMenuItem` for outer visual-style entries
  - selected/rendered recipe data attributes from Phase 2
- `src/app/theme/surfaces/viewport-overlay.css` owns the current Square layout. The root menu is already circular, but the center edge cluster and outer choices are still card/grid controls.
- `src/app/components/ViewerHost.test.tsx` now has focused `Shift+D` proof for center edge controls, Clay Studio, and Circle-read/Square-render behavior.

#### First Pass Decisions

1. Phase 3 should flip `renderedRecipe` to the selected resolved recipe, so `Circle` can render as Circle.
2. Square should stay on the existing DOM/class path and remain visually unchanged.
3. Circle can share the same option arrays and click handlers as Square.
4. Circle should use recipe/layout-specific wrapper classes rather than changing the global Square classes in place.
5. The Circle center layer should expose four edge buttons with the same labels and `aria-checked` semantics as Square.
6. The Circle center layer should look like four quarter-pie sectors. If true CSS pie clipping is awkward in the first cut, use a circular center container with four clipped/rounded quadrant buttons and document any visual compromise in the implementation result.
7. The spacer ring should be visible and inert. It must not become a fifth center option or pointer target.
8. The outer six visual-style controls should sit on an outer circular layer and remain click targets in Phase 3.
9. Outer directional activation, hover preview, pointer-angle mapping, and gesture selection stay deferred to Phase 4.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Update the Phase 2 runtime seam so `renderedRecipe` follows the selected resolved recipe when it is `Circle`.
2. Branch the radial-menu render path in `ViewerHost` by `displayModeMenu.renderedRecipe.id`.
3. Keep `Square` on the existing card/grid layout and CSS classes.
4. Add Circle-specific wrapper/classes for:
   - four inner quarter-pie edge segments
   - a visible inert spacer ring
   - six outer visual-style slots around the center
5. Reuse the current `edgeDisplayModeMenuOptions`, `displayModeMenuOptions`, and `viewportStyleMenuOptions`; do not create a new membership list.
6. Preserve all existing click handlers temporarily so Circle can be visually proven before directional behavior lands.
7. Keep current `aria-label`, `role="menuitemradio"`, and `aria-checked` behavior for every option.
8. Keep center edge choices stay-open and outer visual-style choices close-on-select.
9. Add focused rendering tests for Circle option presence, grouping, labels, active-state readback, and recipe data attributes.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/useViewerDisplayModeMenu.ts` only if the view model needs layout grouping metadata

#### No-Widening Rule

Do not make Circle directional in this phase. The target is visible layout shape only: inner pie, spacer ring, outer ring, same choices.

Do not add or remove visual-style options. `Circle` must show the same four edge choices and six outer visual-style choices as `Square`.

Do not change Properties, Settings persistence, render presets, Geometry Display recipes, or the selected view-setting owners.

#### Implementation Result

Phase 3 shipped the first Circle visual layout. `src/app/useViewerDisplayModeMenu.ts` now lets the selected recipe become the rendered recipe, and `src/app/components/ViewerHost.tsx` branches the menu root with a recipe-specific class plus an inert spacer ring for Circle. `src/app/theme/surfaces/viewport-overlay.css` adds the Circle presentation: a rounded center edge cluster, quadrant-shaped center edge buttons, a visible spacer ring, and rounded outer visual-style targets.

The same four center edge choices, six outer visual-style choices, click handlers, active-state reads, and close/stay-open behavior remain in place. Direction-based outer selection remains deferred to Phase 4.

#### Verification Shape

- `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx -t "Shift\\+D"`
- `npm.cmd test -- --run src/app/useViewerDisplayModeMenu.test.tsx` if the hook rendered-recipe seam changes
- focused component proof that selected `Circle` sets both selected and rendered recipe ids to `circle`
- focused component proof that Circle renders four center edge targets, one spacer ring, and six outer visual-style targets
- proof that clicking Circle center edge targets still writes through the existing edge-display helpers and keeps the menu open
- proof that clicking Circle outer visual-style targets still writes through existing display/style helpers and closes the menu
- proof that Square tests still pass

#### Done Shape

Phase 3 is shipped. Selecting `Circle` renders the inner quarter-pie edge control, spacer ring, and outer visual-style ring with the same choices as `Square`.

## [x] `Visual-Style-Menu-1 / Phase 4` - `Circle Interaction Model`

### Phase 4 Summary

#### Purpose

Make the rendered Circle preset behave like the intended radial menu: outside visual-style choices are direction-based, while inside edge choices remain click-based.

#### Owns

- direction detection for the outer Circle visual-style layer
- click handling for the inner quarter-pie edge layer
- action routing from Circle segments to existing display-mode, render-preset, and edge-recipe helpers
- focused proof that direction selection and click selection do not conflict

#### Does Not Own

- changing the Circle visual membership list
- adding custom recipe authoring
- changing Square behavior
- moving render or edge tuning into the radial menu

#### Current Live Read

- Phase 3 ships `ViewportDisplayModeMenu--circle`, `ViewportDisplayModeMenuSpacerRing`, `ViewportDisplayModeMenuCenter`, `ViewportDisplayModeMenuEdgeItem`, and `ViewportDisplayModeMenuItem` for the Circle layout.
- Circle currently shares the same click handlers as Square:
  - center edge choices call `displayModeMenu.selectEdgeDisplayMode(...)` and keep the menu open
  - outer visual-style choices call `selectDisplayMode(...)` or `selectViewportStyle(...)` and close the menu
- `ViewerHost` already has all option membership and active-state readback in one place.
- No existing pointer-angle or direction-selection helper exists for this menu.
- `ViewerHost.test.tsx` already proves Circle renders with the same choices and click behavior.

#### First Pass Decisions

1. Direction behavior should only apply when `displayModeMenu.renderedRecipe.id === 'circle'`.
2. Square must keep its current explicit click-only outer buttons.
3. The Circle root should listen for pointer movement / pointer down or pointer up and derive a direction from the pointer position relative to the menu center.
4. Direction mapping should use the same outer option order as the rendered Circle items so styling and action routing stay aligned.
5. The center edge layer remains click-only and should stop propagation enough that inner clicks do not trigger outer direction selection.
6. The inert spacer ring should remain non-interactive.
7. The first implementation can commit the selected outer direction on pointer up/click in the outer layer; it does not need drag customization, custom thresholds, or hover-only command previews.
8. A visual hover/active-direction marker is useful, but the committed write must still go through `selectDisplayMode(...)` or `selectViewportStyle(...)`.
9. Direction tests can mock `getBoundingClientRect(...)` on the menu root and dispatch pointer/mouse events with client coordinates.
10. If pointer event support is awkward in JSDOM, prefer a small pure helper for angle-to-option-index mapping and test that helper directly, plus one component smoke test.

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Add a small direction helper near the radial-menu component or hook, such as:
   - pointer point + menu rect -> angle
   - angle + item count -> outer option index
   - index -> existing outer visual-style option
2. Apply direction handling only to `ViewportDisplayModeMenu--circle`.
3. Add transient selected/hovered direction state for Circle outer items if needed for visual feedback.
4. On Circle outer direction commit, route through the existing action paths:
   - display-mode option -> `displayModeMenu.selectDisplayMode(option.mode)`
   - viewport-style option -> `displayModeMenu.selectViewportStyle(option.style)`
5. Keep all center edge buttons as normal click targets calling `displayModeMenu.selectEdgeDisplayMode(option.mode)`.
6. Ensure inner edge clicks do not accidentally trigger an outer direction commit.
7. Keep current `aria-checked` readback based on real view settings.
8. Preserve Phase 3 Circle layout classes and Square layout classes.
9. Add focused tests for:
   - angle/direction mapping across all six outer slots
   - Circle outer direction commit writes the expected display/style setting and closes the menu
   - Circle inner edge click writes the expected edge setting and keeps the menu open
   - Square outer click behavior still works as before
   - active checked-state readback still comes from view settings

#### Likely Files

- `src/app/useViewerDisplayModeMenu.ts`
- `src/app/useViewerDisplayModeMenu.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`

#### No-Widening Rule

Do not add gesture complexity beyond the first outside-direction/inside-click split. No drag customization, no per-recipe visual-style membership editor, and no custom user recipes.

Do not change the Circle visual layout from Phase 3 except for necessary direction-active styling.

Do not change the shared option membership list or the saved Settings recipe contract.

#### Implementation Result

Phase 4 shipped Circle-only direction selection. `src/app/components/ViewerHost.tsx` now derives a Circle outer-ring direction from pointer position relative to the menu center, highlights the active direction, and commits the matched visual-style option through the existing display-mode or viewport-style helper. The center edge cluster remains click-based and stops inner clicks from becoming outer direction commits.

Square remains click-based, Circle option membership remains unchanged, and all final writes still go through the existing display/style/edge owners.

#### Verification Shape

- `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx -t "Shift\\+D|Circle"`
- `npm.cmd test -- --run src/app/useViewerDisplayModeMenu.test.tsx` if a shared direction helper lands in the hook
- focused pure-helper tests for angle-to-index mapping if a helper is extracted
- focused component tests for Circle outer direction selection
- focused component tests for inner quarter-pie click targets
- regression proof that Square still uses the existing click behavior

#### Done Shape

Phase 4 is shipped. Circle's outer ring selects visual styles by direction, Circle's inner edge layer selects edge options by click, and both layers still write through the existing display and edge owners.

#### Follow-Up Visual Refinement

The shipped Circle layout now includes an inert segmented outer pie layer behind the six outside visual-style choices. The layer draws the outer circumference, inner ring boundary, and six radial dividers so the Circle preset reads more like the sketched pie-slice ring while preserving the existing option buttons, direction mapping, and click/write behavior.

A follow-up visual pass changed the actual six outer Circle buttons into clipped annular pie-slice sectors so `WRF`, `MAT`, `RND`, `PRV`, `CLY`, and `SOL` are the wedge controls themselves instead of rounded cards placed on top of the ring.

The outer Circle ring was then enlarged so the annular pie sectors have more room around the center edge cluster. A later visual pass kept that outer diameter but reduced the inner cutout so the outside ring is thicker and the labels have more room inside each wedge.

The outer wedge labels now render as a single stacked label group per sector, keeping the short code and full label separated by a line break even on the left and right side wedges.

## [ ] `Visual-Style-Menu-1 / Phase 5` - `Recipe Inventory And Follow-Up Routing`

### Phase 5 Summary

#### Purpose

Close the first family phase by documenting the shipped `Square` and `Circle` recipes, their behavior, deferred recipe ideas, and the next visual-style menu route.

#### Owns

- shipped `Square` and `Circle` recipe inventory
- deferred recipe candidates
- deferred add/subtract visual-style membership editing
- follow-up routing for custom recipes or menu layout polish
- doc and changelog maintenance when implementation ships

#### Does Not Own

- implementing custom recipes
- implementing add/subtract visual-style membership editing
- broad radial-menu redesign beyond the shipped Circle preset
- replacing Properties tuning surfaces

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Update this doc with the shipped recipe names and behavior.
2. Update the Visual Style Menu generation index with the next family phase route if needed.
3. Add any missing focused proof for recipe fallback, Square parity, Circle layout, or Circle interaction found during implementation.
4. Keep later custom editing as a new phase rather than adding it to the Phase 1 selector.

#### Verification Shape

- doc/index consistency search for `Visual-Style-Menu-1`
- all focused tests added by Phases 1 through 4 should still pass

#### Done Shape

Phase 5 is done when the first Settings-backed recipe model is documented, tested, and ready for the next Visual Style Menu family phase to build on.

## [x] `Visual-Style-Menu-1 / Phase 6` - `Edge Recipe Follow Lock`

### Phase 6 Summary

#### Purpose

Add a small center lock button to the `Shift+D` radial menu that controls only what happens when the user changes display mode.

The lock means "edges follow display-mode recipes." It does not prevent the user from changing edges manually.

#### Owns

- a tiny lock/unlock affordance in the center of the radial menu
- persisted or view-presentation preference state for whether edge recipes follow display-mode changes
- display-mode recipe application behavior when the follow lock is enabled
- preserving current edge preset/settings when the follow lock is disabled
- focused proof that manual edge changes still work in both lock states

#### Does Not Own

- disabling or blocking the center edge preset buttons
- moving detailed edge controls out of Properties `Render`
- changing Geometry Display edge recipe definitions themselves
- changing graph, build, export, or model geometry truth
- adding custom display-mode recipe authoring

#### Current Live Read

- `createDisplayModeViewPatch(...)` in `src/shared/viewSettingsTypes.ts` is the current shared display-mode recipe helper.
- `useViewerDisplayModeMenu(...)` applies display-mode and edge actions for the `Shift+D` menu.
- `ViewerHost.tsx` renders the Square and Circle radial menu surfaces and already has a center edge-control region.
- Properties `Render` applies the same display-mode recipe helper and remains the detailed read/write surface for Geometry Display surfaces and edges.
- The recent display-mode recipe passes made `Wireframe` surfaces-off with xray edges and `Material` surfaces-on with Hidden Line edges.

#### Behavior Contract

1. Follow lock enabled:
   - changing display mode applies the display-mode recipe edge preset
   - examples:
     - `Material` applies Hidden Line edges
     - `Wireframe` applies xray/all edges and hides surfaces
   - manual edge changes still work after the display-mode change
2. Follow lock disabled:
   - changing display mode does not change the current edge preset/settings
   - manual edge changes still work
   - display mode can still change surfaces, render style, and other non-edge recipe-owned presentation settings
3. Toggling the lock should not immediately rewrite the current edge preset by itself.
4. The lock readback should communicate follow behavior, not editability.

#### Implementation Direction

1. Add a narrowly named UI preference field: `edgeRecipeFollowsDisplayMode`.
2. Default it to `true`.
3. Persist and normalize the field beside `radialMenuRecipeId` in the UI prefs persistence path.
4. Add `setEdgeRecipeFollowsDisplayMode(...)` to `useUiPrefsStore`.
5. Add a history-wrapped setter only if Phase 6 exposes the value in Settings. The narrow first cut can keep the setter direct from the radial-menu button.
6. Extend `createDisplayModeViewPatch(...)` with an options object such as `{ includeEdgeRecipe?: boolean }`, defaulting to `true`.
7. When `includeEdgeRecipe` is `true`, keep the current behavior:
   - display-mode recipe writes display mode
   - display-mode recipe writes surfaces
   - display-mode recipe writes the recipe-owned edge preset/settings
8. When `includeEdgeRecipe` is `false`, display-mode recipe writes display mode and surfaces but preserves:
   - `edgeDisplayMode`
   - `geometryDisplay.edges`
9. Update `useViewerDisplayModeMenu.selectDisplayMode(...)` to pass `includeEdgeRecipe: edgeRecipeFollowsDisplayMode`.
10. Leave Properties `Render` using the default include-edge behavior for now unless a later phase explicitly adds the same lock there.
11. Render a center lock button with clear locked/unlocked icon states for both Square and Circle layouts.
12. Keep edge preset buttons routed through the existing edge action path.

#### Exact First Code Cut

1. `src/app/store/uiPrefsStore.ts`
   - add `edgeRecipeFollowsDisplayMode: boolean`
   - default it to `true`
   - add `setEdgeRecipeFollowsDisplayMode(value: boolean): void`
2. `src/app/store/uiPrefsPersistence.ts`
   - add the boolean to `PersistedUiPrefsState`
   - serialize it beside `radialMenuRecipeId`
   - normalize unknown persisted values to `true`
3. `src/app/store/useUiPrefsPersistenceBridge.ts`
   - hydrate, merge, and write the new field through the same route as `radialMenuRecipeId`
4. `src/shared/viewSettingsTypes.ts`
   - change `createDisplayModeViewPatch(...)` to accept an optional include-edge flag
   - preserve current edge settings when the flag is false
   - keep default behavior unchanged for existing callers
5. `src/app/useViewerDisplayModeMenu.ts`
   - read `edgeRecipeFollowsDisplayMode`
   - pass the include-edge flag when selecting display modes
   - expose lock state and toggle action in `ViewerDisplayModeMenuState`
6. `src/app/components/ViewerHost.tsx`
   - render a center lock button inside `ViewportDisplayModeMenuCenter`
   - use an icon-style affordance rather than a text-heavy label
   - keep the existing four edge buttons clickable around it
7. `src/app/theme/surfaces/viewport-overlay.css`
   - position the lock button in the exact center for Square and Circle layouts
   - avoid covering the existing edge quarter controls in Circle
8. Focused tests:
   - `src/app/store/uiPrefsStore.test.ts`
   - `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
   - `src/app/useViewerDisplayModeMenu.test.tsx`
   - `src/app/components/ViewerHost.test.tsx`

#### Acceptance Read

- The radial menu shows a center lock/unlock button.
- With the lock enabled, changing from Material to Solid applies Solid's edge recipe.
- With the lock disabled, changing from Material to Solid preserves the user's current edge preset/settings.
- Changing edge presets manually still works while locked and while unlocked.
- The behavior is covered by focused `Shift+D` menu tests and at least one shared recipe/helper test.

#### Verification Shape

- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx -t "edge recipe|radial menu|persistence"`
- `npm.cmd test -- --run src/app/useViewerDisplayModeMenu.test.tsx src/app/components/ViewerHost.test.tsx -t "display mode|edge recipe|lock|Shift\\+D"`
- `npm.cmd run build`
- `git diff --check`

#### Done Shape

Phase 6 is done when the lock button is visible in the radial menu, persisted as a UI preference, and proven to control only display-mode edge-recipe following while leaving manual edge preset edits available.

#### Implementation Result

Implemented on 2026-05-22.

- Added the persisted `edgeRecipeFollowsDisplayMode` UI preference, defaulting to enabled.
- Added the radial-menu center lock button with locked/unlocked readback.
- Kept manual edge preset buttons active regardless of lock state.
- Let display-mode changes include edge recipes while locked and preserve current edge settings while unlocked.
- Proved the behavior through focused store, persistence, hook, and `ViewerHost` tests.
