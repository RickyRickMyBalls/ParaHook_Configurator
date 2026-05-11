# Cleanup Gen4 Index

## Doc Header

### Doc History
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

### Codex Level Goals

- [ ] `Cleanup-Gen4-CLG-1` - Separate the shared outer panel split shell from the Settings/Properties section-selector template.
- [ ] `Cleanup-Gen4-CLG-2` - Define a reusable panel-shell contract with left and right slots, adjustable width, scroll containment, responsive behavior, and stable CSS ownership.
- [ ] `Cleanup-Gen4-CLG-3` - Migrate Settings and Properties off duplicated `SettingsSurfaceShell` ownership into the shared panel shell while preserving their section content behavior.
- [ ] `Cleanup-Gen4-CLG-4` - Repoint Catalog's existing two-column shell onto the shared panel foundation without rewriting catalog browse/filter/source logic.
- [ ] `Cleanup-Gen4-CLG-5` - Keep later multi-panel or advanced split behavior as an extension point, not a first-pass requirement.

## [ ] `Gen 4 - Cleanup 1` - `Shared Workspace Panel Shell`

Planning doc:
- `Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`

Status:
- planned
- should start with a read-only owner map and contract lock before component extraction
- should extract the broad panel split shell before migrating `Settings`, `Properties`, or `Catalog`
- should treat the Settings/Properties section rail as a smaller template on top of the shared panel shell
- should keep `Catalog` rail content catalog-owned while moving its outer left/right panel foundation toward the shared shell

### Current Read

- `Catalog` already has adjustable left/right panel width through its `CatalogShell` browse rail.
- `Settings` and `Properties` currently share the `SettingsSurfaceShell` markup/CSS pattern but do not have Catalog-style adjustable panel widths.
- `Properties` is borrowing Settings shell classes directly, which proves the UI pattern is reusable but keeps the ownership informal.
- A shared panel-shell base should sit below those workspace-specific contents so future shell changes do not need to be repeated in multiple surfaces.
