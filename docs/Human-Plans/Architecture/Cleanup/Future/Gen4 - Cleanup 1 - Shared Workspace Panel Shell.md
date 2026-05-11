# Gen4 - Cleanup 1 - Shared Workspace Panel Shell

## Doc Header

### Doc History
1. 2026-05-10 13:30:05: Created this first `Gen 4` future cleanup doc for the shared workspace panel-shell lane, preserving the user's intent to unify `Catalog`, `Settings`, and `Properties` around one adjustable two-panel system while keeping each workspace responsible for its own panel content.

### Purpose

This doc owns the first `Cleanup Gen4` family phase.

Use it to plan:
- the shared adjustable two-panel workspace shell
- the smaller Settings/Properties-style section selector template
- the migration path for `Settings`, `Properties`, and `Catalog`
- the boundary between common panel infrastructure and workspace-specific content

Do not use it to:
- rewrite catalog import/source behavior
- add new settings features
- add new properties material controls
- replace the outer `ViewportFrame`
- start an advanced arbitrary split-panel system before the two-panel shell is proven

## Doc Body

### Family-Phase Goal

Create one reusable workspace panel-shell foundation for screens that present a left panel and a right content panel.

The shared foundation should own:
- left/right panel layout
- adjustable divider behavior
- default and clamped left-panel width
- responsive stacking or collapse behavior
- panel chrome, scroll containment, and shared CSS tokens
- a future extension point for richer panel splitting

The shared foundation should not own:
- Catalog filter/search/source state
- Settings section definitions or preference writes
- Properties focused-item routing or material lane behavior
- workspace slot placement, split tree ownership, or viewport frame controls

### Two-Layer Model

Layer 1:
- `WorkspacePanelSplitShell`
- broad reusable left/right panel shell
- used by `Catalog`, `Settings`, and `Properties`

Layer 2:
- `WorkspaceSectionShell` or `WorkspaceSectionRail`
- smaller convenience template for section-button screens
- used by `Settings` and `Properties`
- not required for `Catalog`

This keeps the app unified without pretending every workspace's left panel does the same job.

### Current Live Read

Current code shape:
- `src/app/catalog/ui/CatalogShell.tsx`
  - owns a catalog-specific two-column shell with a resizable browse rail
  - left panel is `CatalogShellBrowseRail`
  - right panel is catalog content, item page, or info page
- `src/app/workspace/SettingsSurface.tsx`
  - owns the Settings two-column shell using `SettingsSurfaceShell`
  - left panel is a section list
  - right panel renders the selected section groups
- `src/app/workspace/PropertiesSurface.tsx`
  - reuses `SettingsSurfaceShell` and related Settings shell classes
  - left panel is a hosted properties section tab list
  - right panel renders focused-item shell status or hosted section content
- `src/app/theme/surfaces/catalog.css`
  - owns catalog-specific shell, rail, divider, and content styling
- `src/app/theme/surfaces/settings.css`
  - owns Settings shell styling that Properties currently borrows

### Boundary Rules

- Keep the outer `ViewportFrame` unchanged unless a later phase explicitly needs integration polish.
- Keep panel width ownership local to the shared panel shell or a workspace UI preference only after the first contract is proven.
- Do not move Catalog browse/filter state into a shared section system.
- Do not move Settings/Properties section definitions into Catalog.
- Treat advanced multi-panel splitting as later capability, not a first-pass deliverable.
- Preserve tests around `CatalogSurface`, `SettingsSurface`, and `PropertiesSurface` during each migration slice.

### Acceptance Read

This family phase is complete when:
- a shared two-panel workspace shell exists
- Settings and Properties use the shared shell instead of hand-sharing `SettingsSurfaceShell` classes
- Catalog either uses the shared panel shell or has a clearly documented final bridge phase if its migration needs one more pass
- adjustable left/right width is available to Settings and Properties through the shared panel shell
- Catalog keeps its existing richer left-panel content behavior
- the shared CSS owner is no longer split between unrelated Settings and Catalog shell primitives

## Vision

The app should feel like one system.

When a workspace has a left navigation/control panel and a right content panel, that shape should come from one shared shell. The contents can vary by workspace, but the shell behavior should not be reinvented or copied by hand.

This advances `Cleanup Gen4` by turning a visible UI pattern into an explicit architecture pattern.

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen4-HLG-1` - Define one reusable two-panel workspace shell so Catalog, Settings, and Properties feel like one unified app pattern.
- [ ] `Cleanup-Gen4-HLG-2` - Bring adjustable left/right panel width behavior from Catalog-style screens into Settings and Properties.
- [ ] `Cleanup-Gen4-HLG-3` - Keep each workspace's panel content owned by that workspace, so Catalog can keep richer function/filter controls while Settings and Properties can keep section selectors.
- [ ] `Cleanup-Gen4-HLG-4` - Leave room for a more advanced workspace panel splitting system later without overbuilding the first cleanup pass.

### Codex Level Goals

- [ ] CLG 1. Lock the live owner map and name the shared shell contract before code moves.
- [ ] CLG 2. Extract a shared panel split shell with slot-based left/right content and adjustable divider behavior.
- [ ] CLG 3. Build or extract a Settings/Properties section selector template on top of the shared panel shell.
- [ ] CLG 4. Migrate Settings and Properties first because they already share shell shape informally.
- [ ] CLG 5. Migrate or bridge Catalog's outer shell without disturbing catalog-specific browse, source, preview, and item-page behavior.
- [ ] CLG 6. Leave advanced arbitrary panel splitting as a named later extension point.

### `Gen 4 - Cleanup 1 / Phase 1`

- [ ] `HLG 1. Define one reusable two-panel workspace shell so Catalog, Settings, and Properties feel like one unified app pattern.`
- [ ] Map current shell owners and CSS owners.
- [ ] Name the shared shell component contract.
- [ ] Decide whether panel width persistence is first-pass local state or UI preference state.
- [ ] Stop before runtime code extraction.

### `Gen 4 - Cleanup 1 / Phase 2`

- [ ] `HLG 1. Define one reusable two-panel workspace shell so Catalog, Settings, and Properties feel like one unified app pattern.`
- [ ] `HLG 2. Bring adjustable left/right panel width behavior from Catalog-style screens into Settings and Properties.`
- [ ] Extract the shared two-panel shell.
- [ ] Preserve adjustable divider behavior.
- [ ] Add focused component proof for width clamping and panel slots.

### `Gen 4 - Cleanup 1 / Phase 3`

- [ ] `HLG 2. Bring adjustable left/right panel width behavior from Catalog-style screens into Settings and Properties.`
- [ ] `HLG 3. Keep each workspace's panel content owned by that workspace, so Catalog can keep richer function/filter controls while Settings and Properties can keep section selectors.`
- [ ] Move Settings onto the shared shell.
- [ ] Move Properties onto the shared shell.
- [ ] Extract or clarify the smaller section-selector template used by both.

### `Gen 4 - Cleanup 1 / Phase 4`

- [ ] `HLG 1. Define one reusable two-panel workspace shell so Catalog, Settings, and Properties feel like one unified app pattern.`
- [ ] `HLG 3. Keep each workspace's panel content owned by that workspace, so Catalog can keep richer function/filter controls while Settings and Properties can keep section selectors.`
- [ ] Repoint Catalog's outer two-column foundation toward the shared shell.
- [ ] Keep `CatalogShellBrowseRail` and catalog content routing catalog-owned.
- [ ] Preserve current catalog browse rail resize behavior.

### `Gen 4 - Cleanup 1 / Phase 5`

- [ ] `HLG 4. Leave room for a more advanced workspace panel splitting system later without overbuilding the first cleanup pass.`
- [ ] Remove stale duplicated shell CSS.
- [ ] Record the extension point for later advanced panel splitting.
- [ ] Close the family phase with focused regression coverage and docs handoff.

## [ ] `Gen 4 - Cleanup 1 / Phase 1` - `Owner Map And Shared Contract Lock`

### Phase 1 Summary

#### Purpose

Lock the first-pass shared shell contract before source extraction.

#### Owns

- owner map for current two-panel workspace shells
- shared-shell naming and responsibility split
- first-pass width persistence decision
- exact migration order

#### Does Not Own

- component extraction
- CSS migration
- runtime behavior changes
- Catalog, Settings, or Properties feature changes

#### First Pass Decisions

- shared outer shell should be slot-based
- Settings/Properties section selector should be a smaller template above that shell
- Catalog should share the outer shell but keep catalog-specific rail content

### Phase 1 Implementation Spec

#### Exact First Code Cut

No source code cut.

This phase should update the planning doc with a code-grounded owner map after reading the live files.

#### Likely Files

- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not create components in Phase 1.

#### Checklist

- [ ] Confirm current `CatalogShell` panel and divider ownership.
- [ ] Confirm current `SettingsSurfaceShell` ownership.
- [ ] Confirm current `PropertiesSurface` dependency on Settings shell classes.
- [ ] Name the component contract and prop shape at planning level.
- [ ] Choose the initial migration order.

#### Verification Shape

- docs-only review
- no runtime tests required

#### Done Shape

- Phase 2 can begin with an explicit shared-shell contract and migration order.

## [ ] `Gen 4 - Cleanup 1 / Phase 2` - `Shared Panel Split Shell Extraction`

### Phase 2 Summary

#### Purpose

Extract the reusable left/right panel shell without migrating all workspaces at once.

#### Owns

- shared panel shell component
- adjustable divider behavior
- base CSS owner
- focused shell tests

#### Does Not Own

- Settings/Properties section template extraction
- Catalog behavior migration
- advanced multi-panel splitting

### Phase 2 Implementation Spec

#### Exact First Code Cut

Create the shared shell with slot-based left/right content and a reusable divider path. Keep the first consumer narrow, likely with a test fixture or one low-risk Settings/Properties migration if Phase 1 approves it.

#### Likely Files

- `src/app/workspace/WorkspacePanelSplitShell.tsx`
- `src/app/workspace/WorkspacePanelSplitShell.test.tsx`
- `src/app/theme/surfaces/workspace-panel-shell.css` or an existing surface CSS owner chosen in Phase 1
- `src/app/theme/v15Theme.css`

#### No-Widening Rule

Do not migrate all three surfaces in this phase unless Phase 1 explicitly narrows the extraction to a tiny safe path.

#### Checklist

- [ ] Add shared shell slots.
- [ ] Add adjustable left-panel width.
- [ ] Add min/max clamping.
- [ ] Add keyboard-accessible divider behavior if the existing Catalog behavior is carried over.
- [ ] Add focused shell tests.

#### Verification Shape

- focused shell tests
- relevant TypeScript/build check if source changes are made

#### Done Shape

- Shared shell exists and is ready for real workspace consumers.

## [ ] `Gen 4 - Cleanup 1 / Phase 3` - `Settings And Properties Section Shell Migration`

### Phase 3 Summary

#### Purpose

Move Settings and Properties onto the shared panel shell and make their section-selector pattern explicit.

#### Owns

- Settings shared-shell adoption
- Properties shared-shell adoption
- smaller section rail/content template if useful
- focused Settings/Properties tests

#### Does Not Own

- Catalog migration
- new settings content
- new properties sections

### Phase 3 Implementation Spec

#### Exact First Code Cut

Replace direct `SettingsSurfaceShell` markup ownership with the shared panel shell, then factor the common section rail/content pattern only as far as it reduces real duplication.

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/WorkspaceSectionShell.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- shared shell CSS owner

#### No-Widening Rule

Do not add new settings or properties features.

#### Checklist

- [ ] Settings uses shared panel shell.
- [ ] Properties uses shared panel shell.
- [ ] Settings and Properties still render their current section behavior.
- [ ] Adjustable left-panel width is available to both.
- [ ] Tests prove shell adoption without changing business logic.

#### Verification Shape

- focused Settings/Properties tests
- shell tests
- TypeScript/build check as needed

#### Done Shape

- Settings and Properties no longer hand-share shell classes as their main architecture.

## [ ] `Gen 4 - Cleanup 1 / Phase 4` - `Catalog Outer Shell Adoption`

### Phase 4 Summary

#### Purpose

Bring Catalog onto the shared panel foundation while preserving its richer catalog-owned rail and content behavior.

#### Owns

- Catalog outer panel-shell migration
- preservation of browse rail resize behavior
- catalog-specific rail/content ownership boundary
- focused Catalog tests

#### Does Not Own

- catalog source/import behavior
- catalog item card redesign
- catalog filter redesign
- Settings/Properties template changes

### Phase 4 Implementation Spec

#### Exact First Code Cut

Use the shared panel shell around `CatalogShellBrowseRail` and the existing Catalog content area. Keep catalog content routing, navigation history, preview sessions, and source options unchanged.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/theme/surfaces/catalog.css`
- shared shell CSS owner

#### No-Widening Rule

Do not rewrite catalog data flow or import/source actions.

#### Checklist

- [ ] Catalog uses the shared outer panel shell.
- [ ] Catalog browse rail remains catalog-owned.
- [ ] Catalog content area remains catalog-owned.
- [ ] Existing Catalog width adjustment still works.
- [ ] Existing Catalog tests remain focused on behavior, not class churn.

#### Verification Shape

- focused Catalog shell tests
- CatalogSurface tests affected by shell selectors
- TypeScript/build check as needed

#### Done Shape

- Catalog shares the same panel foundation as Settings and Properties.

## [ ] `Gen 4 - Cleanup 1 / Phase 5` - `Shell CSS Cleanup And Future Split Handoff`

### Phase 5 Summary

#### Purpose

Remove stale duplicated shell CSS and record the future split-system extension point.

#### Owns

- CSS cleanup after all migrations
- final regression proof
- Gen4 handoff notes
- explicit advanced split deferral

#### Does Not Own

- implementing arbitrary nested panel splitting
- adding new workspace features

### Phase 5 Implementation Spec

#### Exact First Code Cut

Delete or narrow stale `SettingsSurfaceShell` and `CatalogShell` outer-shell CSS once their responsibilities live in the shared shell. Keep workspace-specific content styling where it still belongs.

#### Likely Files

- `src/app/theme/surfaces/settings.css`
- `src/app/theme/surfaces/catalog.css`
- shared shell CSS owner
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`

#### No-Widening Rule

Do not start the advanced split-panel system here. Record it as future work only.

#### Checklist

- [ ] Remove stale duplicated shell CSS.
- [ ] Preserve workspace-specific content CSS.
- [ ] Confirm Settings, Properties, and Catalog still render through the shared shell.
- [ ] Add final docs handoff for future advanced panel splitting.

#### Verification Shape

- focused surface tests
- shell tests
- build/type check as needed

#### Done Shape

- `Gen 4 - Cleanup 1` closes with one shared panel-shell foundation and a clear future extension point.
