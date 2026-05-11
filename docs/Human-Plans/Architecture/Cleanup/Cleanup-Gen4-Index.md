# Cleanup Gen4 Index

## Doc Header

### Doc History
11. 2026-05-11 14:59:19: Added `Gen 4 - Cleanup 2 - Workspace Shell Setting Standardization` as the next cleanup lane for making shared workspace shell settings apply across all `WorkspacePanelSplitShell` consumers, starting with the `Workspace panel shell padding` ParaSlider affecting Catalog, Settings, and Properties through the shared shell contract.
10. 2026-05-11 14:44:04: Implemented `Gen 4 - Cleanup 1 / Phase 5 - Shell CSS Cleanup And Future Split Handoff`, removed stale post-migration shell CSS, preserved workspace-specific content styling, and closed the generation with advanced panel splitting deferred to a future architecture lane.
9. 2026-05-11 14:22:27: Prepared `Gen 4 - Cleanup 1 / Phase 5 - Shell CSS Cleanup And Future Split Handoff` for implementation by naming stale post-migration CSS bridges, preserving workspace-specific rail/content styling, keeping advanced split behavior deferred, and locking focused shared-shell verification.
8. 2026-05-11 14:19:27: Implemented `Gen 4 - Cleanup 1 / Phase 4 - Catalog Outer Shell Adoption`, migrated `CatalogShell` onto `WorkspacePanelSplitShell`, preserved the Catalog-owned browse rail and content behavior, and advanced the generation read so `Phase 5 - Shell CSS Cleanup And Future Split Handoff` becomes the next explicit implementation target.
7. 2026-05-11 13:07:45: Prepared `Gen 4 - Cleanup 1 / Phase 4 - Catalog Outer Shell Adoption` for implementation by locking Catalog as the next shared-shell consumer, preserving `CatalogShellBrowseRail` plus Catalog source/content/navigation ownership, and deferring broad shell CSS retirement to Phase 5.
6. 2026-05-11 12:43:10: Implemented `Gen 4 - Cleanup 1 / Phase 3 - Settings And Properties Section Shell Migration`, migrated Settings and Properties onto `WorkspacePanelSplitShell`, preserved their existing section/content behavior, and advanced the generation read so `Phase 4 - Catalog Outer Shell Adoption` becomes the next explicit implementation target.
5. 2026-05-11 11:56:15: Prepared `Gen 4 - Cleanup 1 / Phase 3 - Settings And Properties Section Shell Migration` for implementation by locking Settings and Properties as the only real shared-shell consumers in the next pass, preserving their current section/content ownership, and keeping Catalog plus broad CSS cleanup deferred.
4. 2026-05-11 11:35:03: Implemented `Gen 4 - Cleanup 1 / Phase 2 - Shared Panel Split Shell Extraction`, added the standalone `WorkspacePanelSplitShell` component, shared shell CSS owner, and focused shell tests, then advanced the generation read so `Phase 3 - Settings And Properties Section Shell Migration` becomes the next explicit implementation target.
3. 2026-05-11 11:29:32: Prepared `Gen 4 - Cleanup 1 / Phase 2 - Shared Panel Split Shell Extraction` for implementation by locking the standalone shared-shell file set, Catalog-matched local resize constants, component-test proof, and no-real-workspace-migration boundary for the next source pass.
2. 2026-05-11 11:25:23: Implemented `Gen 4 - Cleanup 1 / Phase 1 - Owner Map And Shared Contract Lock` as a docs-only contract pass, locking `WorkspacePanelSplitShell` as the shared shell name, choosing local first-pass width state, and making `Phase 2 - Shared Panel Split Shell Extraction` the next explicit implementation target with real workspace migration deferred.
1. 2026-05-10 13:30:05: Created this `Cleanup Gen4` index as the shared workspace panel-shell cleanup generation, grounding the new lane in the live read that `Catalog`, `Settings`, and `Properties` all want the same adjustable two-panel workspace foundation even though their left-panel content is different.

### Purpose

This doc is the Generation 4 planning index for `Cleanup`.

Use it to decide:
- how the workspace two-panel screen pattern should become one shared shell system
- why `Catalog`, `Settings`, and `Properties` should share panel infrastructure without sharing all business logic
- which future docs own the real phased cleanup plans
- how this generation should make the app feel more unified without flattening each workspace's purpose

Do not use it for:
- implementing the shared shell directly
- forcing `Catalog` to use the same section-button template as `Settings` and `Properties`
- replacing the broader `Workspace-Modes` family planning
- moving workspace data truth out of the existing stores

## Doc Body

### Generation Goal

Generation 4 should turn the repeated two-panel workspace pattern into a real shared panel-shell foundation.

The live user-facing read is simple:
- `Catalog` has a left browse/filter/source rail and a right results/item/content area
- `Settings` has a left section rail and a right active-section content area
- `Properties` has a left hosted-section rail and a right focused-item content area

These screens should feel like members of one app family.

The goal is not to make every workspace use identical controls.

The goal is to:
- share the outer adjustable left/right panel system
- let each workspace own the content that appears inside each panel
- reuse the simple section-selector template where it fits
- preserve `Catalog`'s richer browse/filter rail instead of squeezing it into the settings/properties section-button model
- give later workspace shells a common base for resizing, responsive behavior, panel chrome, scroll containment, and future split behavior

### Current Routing

- `Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`
  - phased plan for extracting the shared adjustable two-panel workspace shell and migrating `Settings`, `Properties`, and `Catalog` onto the shared panel foundation without mixing their content logic
- `Future/Gen4 - Cleanup 2 - Workspace Shell Setting Standardization.md`
  - phased plan for standardizing shared shell settings after the first migration, starting with moving `workspacePanelShellPaddingPx` consumption into `WorkspacePanelSplitShell` so the Workspace padding ParaSlider affects Catalog, Settings, Properties, and future shared-shell consumers

### No-Widening Rule

Gen 4 setup does not implement runtime behavior.

It must not:
- introduce a second workspace layout owner beside `useWorkspaceStore`
- move settings truth out of `useUiPrefsStore`
- move properties focus truth out of the app-store selection path
- rewrite `Catalog` source/import behavior
- merge `Catalog` filter logic with `Settings` or `Properties` section routing
- collapse the shared viewport `ViewportFrame` with the inner workspace panel shell

### Acceptance Read

Gen 4 planning setup is acceptable when the Cleanup family has:
- one generation index for shared workspace panel-shell cleanup
- one concrete future doc for the first shared panel-shell lane
- an explicit two-layer model:
  - shared adjustable panel shell
  - optional section-selector template for Settings/Properties-style screens
- clear rules that `Catalog` can share the outer panel system while keeping catalog-specific rail content
- a phased path that can bring Settings/Properties width adjustment up to Catalog's current behavior

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen4-HLG-1` - Define one reusable two-panel workspace shell so Catalog, Settings, and Properties feel like one unified app pattern.
- [ ] `Cleanup-Gen4-HLG-2` - Bring adjustable left/right panel width behavior from Catalog-style screens into Settings and Properties.
- [ ] `Cleanup-Gen4-HLG-3` - Keep each workspace's panel content owned by that workspace, so Catalog can keep richer function/filter controls while Settings and Properties can keep section selectors.
- [ ] `Cleanup-Gen4-HLG-4` - Leave room for a more advanced workspace panel splitting system later without overbuilding the first cleanup pass.
- [ ] `Cleanup-Gen4-HLG-5` - Standardize shared workspace shell settings so one ParaSlider affects all workspace shell types.
- [ ] `Cleanup-Gen4-HLG-6` - Keep workspace-specific content owned by each workspace while moving shared frame behavior into the shared shell.
- [ ] `Cleanup-Gen4-HLG-7` - Make future workspace shell settings obvious to add without duplicating Settings/Properties/Catalog glue.

### Codex Level Goals

- [ ] `Cleanup-Gen4-CLG-1` - Separate the shared outer panel split shell from the Settings/Properties section-selector template.
- [ ] `Cleanup-Gen4-CLG-2` - Define a reusable panel-shell contract with left and right slots, adjustable width, scroll containment, responsive behavior, and stable CSS ownership.
- [ ] `Cleanup-Gen4-CLG-3` - Migrate Settings and Properties off duplicated `SettingsSurfaceShell` ownership into the shared panel shell while preserving their section content behavior.
- [ ] `Cleanup-Gen4-CLG-4` - Repoint Catalog's existing two-column shell onto the shared panel foundation without rewriting catalog browse/filter/source logic.
- [ ] `Cleanup-Gen4-CLG-5` - Keep later multi-panel or advanced split behavior as an extension point, not a first-pass requirement.
- [ ] `Cleanup-Gen4-CLG-6` - Route shared workspace shell settings through `WorkspacePanelSplitShell` instead of surface-specific bridge CSS.
- [ ] `Cleanup-Gen4-CLG-7` - Prove Catalog, Settings, and Properties consume shared shell settings from the same shell contract.

## [ ] `Gen 4 - Cleanup 1` - `Shared Workspace Panel Shell`

Planning doc:
- `Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`

Status:
- `Phase 1 - Owner Map And Shared Contract Lock` is now complete as a docs-only pass
- `WorkspacePanelSplitShell` is the locked shared-shell name for the first implementation pass
- Phase 2 should use component-local panel width state first, not persisted workspace or UI preference state
- `Phase 2 - Shared Panel Split Shell Extraction` is now complete
- Phase 2 added `WorkspacePanelSplitShell.tsx`, `WorkspacePanelSplitShell.test.tsx`, and `workspace-panel-shell.css` without migrating real workspace surfaces
- `Phase 3 - Settings And Properties Section Shell Migration` is now complete
- Phase 3 migrated only `SettingsSurface` and `PropertiesSurface` onto `WorkspacePanelSplitShell`
- Phase 3 preserved Settings section routing, Properties hosted section behavior, and the existing Properties focused-item list resize handle
- `Phase 4 - Catalog Outer Shell Adoption` is now complete
- Phase 4 migrated `CatalogShell` onto `WorkspacePanelSplitShell` while preserving `CatalogShellBrowseRail`, Catalog content routing, source/import actions, preview, item-page, and info-page behavior
- Phase 4 retired Catalog's inline outer resize state/listeners in favor of the shared shell
- Phase 4 did not use the Settings/Properties section template for Catalog or add persisted panel-width preferences
- `Phase 5 - Shell CSS Cleanup And Future Split Handoff` is now complete
- Phase 5 removed stale `SettingsSurfaceShell` fixed-grid CSS now that Settings and Properties use `SettingsSurfacePanelShell` on top of `WorkspacePanelSplitShell`
- Phase 5 preserved workspace-specific content styling, including Settings/Properties rail/content styling and Catalog browse-section resize styling
- Phase 5 kept advanced nested/multi-panel splitting as a documented future lane only
- `Gen 4 - Cleanup 1` is now complete with Settings, Properties, and Catalog sharing one adjustable panel-shell foundation
- should treat the Settings/Properties section rail as a smaller template on top of the shared panel shell
- should keep `Catalog` rail content catalog-owned while moving its outer left/right panel foundation toward the shared shell

### Current Read

- `Catalog`, `Settings`, and `Properties` now share `WorkspacePanelSplitShell` as the adjustable left/right panel foundation.
- `Settings` and `Properties` keep their section rail/content styling on top of the shared panel shell.
- `Catalog` keeps its richer browse/filter/source rail and content routing on top of the shared panel shell.
- `workspace-panel-shell.css` owns the reusable outer split-shell grid, divider, resize cursor, responsive stacking, and left-width CSS variable.
- advanced nested/multi-panel splitting remains a future architecture lane, not part of this completed cleanup pass.

## [ ] `Gen 4 - Cleanup 2` - `Workspace Shell Setting Standardization`

Planning doc:
- `Future/Gen4 - Cleanup 2 - Workspace Shell Setting Standardization.md`

Status:
- `Gen 4 - Cleanup 2` is now planned as the next cleanup lane
- Phase 1 should move `workspacePanelShellPaddingPx` consumption into `WorkspacePanelSplitShell`
- Phase 1 should make the existing Settings Workspace ParaSlider affect Catalog, Settings, and Properties
- Phase 1 should keep the default at `0 px`
- Phase 2 should clean up Settings-named shared-shell padding bridges after the shared shell owns the setting
- Phase 3 should record the future shared-shell setting contract without implementing nested panel splitting

### Current Read

- `workspacePanelShellPaddingPx` is already stored, persisted, and editable through Settings > Workspace.
- Settings and Properties currently consume that setting through `SettingsSurfacePanelShell` and `--settings-surface-panel-shell-padding`.
- Catalog uses `WorkspacePanelSplitShell` but does not yet consume the padding setting.
- The setting is conceptually shared, so its consumption should move into `WorkspacePanelSplitShell`.

### Acceptance Read

`Gen 4 - Cleanup 2` is acceptable when:
- the Workspace padding ParaSlider affects every current `WorkspacePanelSplitShell` consumer
- shared shell setting names are not Settings-specific
- future workspace shell settings have a documented implementation home
- workspace-specific content logic remains owned by its workspace
