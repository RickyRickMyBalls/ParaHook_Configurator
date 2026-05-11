# Gen4 - Cleanup 1 - Shared Workspace Panel Shell

## Doc Header

### Doc History
10. 2026-05-11 14:44:04: Implemented `Gen 4 - Cleanup 1 / Phase 5 - Shell CSS Cleanup And Future Split Handoff`, removed stale `SettingsSurfaceShell` and Catalog mobile bridge CSS after the shared-shell migrations, preserved workspace-specific content styling, closed Gen 4 cleanup, and recorded advanced panel splitting as a future architecture lane.
9. 2026-05-11 14:22:27: Prepared `Gen 4 - Cleanup 1 / Phase 5 - Shell CSS Cleanup And Future Split Handoff` for implementation by locking the cleanup around stale post-migration CSS bridges, preserving workspace-specific rail/content styling, recording the advanced split system as future work only, and naming focused verification for the shared shell consumers.
8. 2026-05-11 14:19:27: Implemented `Gen 4 - Cleanup 1 / Phase 4 - Catalog Outer Shell Adoption`, migrated `CatalogShell` onto `WorkspacePanelSplitShell`, retired the Catalog-local outer browse-rail resize state/listeners/divider, preserved `CatalogShellBrowseRail` plus Catalog content/source/navigation behavior, and advanced the lane so `Phase 5 - Shell CSS Cleanup And Future Split Handoff` becomes the next explicit implementation target.
7. 2026-05-11 13:07:45: Prepared `Gen 4 - Cleanup 1 / Phase 4 - Catalog Outer Shell Adoption` for implementation by locking the migration around `CatalogShell` adopting `WorkspacePanelSplitShell`, retiring the inline browse-rail resize state/listeners, preserving `CatalogShellBrowseRail` and all Catalog content/source/navigation behavior, and keeping broad CSS cleanup deferred to Phase 5.
6. 2026-05-11 12:43:10: Implemented `Gen 4 - Cleanup 1 / Phase 3 - Settings And Properties Section Shell Migration`, migrated `SettingsSurface` and `PropertiesSurface` onto `WorkspacePanelSplitShell`, preserved their existing section/content behavior plus the Properties focused-item list resize handle, and advanced the lane so `Phase 4 - Catalog Outer Shell Adoption` becomes the next explicit implementation target.
5. 2026-05-11 11:56:15: Prepared `Gen 4 - Cleanup 1 / Phase 3 - Settings And Properties Section Shell Migration` for implementation by locking the migration around `SettingsSurface` and `PropertiesSurface` adopting `WorkspacePanelSplitShell`, preserving current section/content behavior, deferring a new `WorkspaceSectionShell` unless duplication remains meaningful after shell adoption, and keeping Catalog migration deferred to Phase 4.
4. 2026-05-11 11:35:03: Implemented `Gen 4 - Cleanup 1 / Phase 2 - Shared Panel Split Shell Extraction`, added `src/app/workspace/WorkspacePanelSplitShell.tsx`, `src/app/workspace/WorkspacePanelSplitShell.test.tsx`, and `src/app/theme/surfaces/workspace-panel-shell.css`, then advanced the lane so `Phase 3 - Settings And Properties Section Shell Migration` becomes the next explicit implementation target.
3. 2026-05-11 11:29:32: Prepared `Gen 4 - Cleanup 1 / Phase 2 - Shared Panel Split Shell Extraction` for implementation by locking the first code cut around a standalone `WorkspacePanelSplitShell`, shared shell CSS owner, component-local width state, Catalog-matched width defaults, and focused shell tests before any Settings, Properties, or Catalog migration starts.
2. 2026-05-11 11:25:23: Implemented `Gen 4 - Cleanup 1 / Phase 1 - Owner Map And Shared Contract Lock` as a docs-only pass by grounding the shared panel-shell contract in the live `CatalogShell`, `SettingsSurface`, `PropertiesSurface`, `catalog.css`, and `settings.css` seams, choosing local first-pass width state, and locking Phase 2 as a shared-shell extraction with no workspace migration.
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
  - owns the current resize behavior through local `browseRailWidth` state, mouse drag listeners, keyboard `ArrowLeft` / `ArrowRight` / `Home` / `End` support, `role="separator"`, and a temporary body-level resizing class
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
  - currently owns the only left/right divider CSS through `CatalogShellColumnResizeHandle`
- `src/app/theme/surfaces/settings.css`
  - owns Settings shell styling that Properties currently borrows
  - currently owns the fixed two-column `SettingsSurfaceShell` grid plus Settings and Properties section/content styling

### Phase 1 Owner Map And Contract Lock

Phase 1 confirms this first-pass ownership map:
- `CatalogShell` owns catalog browse/filter/source/content behavior and the current resize implementation.
- `CatalogShellBrowseRail` owns catalog-specific left-panel content.
- `CatalogShell` content sections own catalog-specific right-panel content, including grid, info page, item page, preview, and navigation actions.
- `SettingsSurface` owns settings section definitions, preference reads/writes, and Settings-specific right-panel content.
- `PropertiesSurface` owns focused-item routing, hosted Properties sections, and Properties-specific right-panel content.
- `settings.css` is currently the informal shared owner for Settings/Properties shell classes, but that ownership should be retired after the shared shell exists.
- `catalog.css` is currently the resize/divider style source to learn from, but Catalog-specific rail/content styles should stay catalog-owned.

The shared component contract should be named `WorkspacePanelSplitShell`.

First-pass `WorkspacePanelSplitShell` responsibilities:
- render a left slot, resize divider, and right slot
- own adjustable left-panel width state
- accept default, minimum, maximum, and keyboard-step width values
- expose accessible vertical separator semantics
- support mouse drag and keyboard resize behavior equivalent to the current Catalog rail
- apply stable shared shell class names and CSS variables for panel width, divider state, and panel scroll containment
- keep content rendering entirely slot-owned by each workspace

First-pass `WorkspacePanelSplitShell` should not:
- own Catalog filter, source, preview, or item navigation behavior
- own Settings section definitions or preference writes
- own Properties focused-object routing, material sections, or internal list-resize behavior
- persist width to `useUiPrefsStore` or `useWorkspaceStore`
- alter workspace slot placement, split tree state, or `ViewportFrame`

Width persistence decision:
- Phase 2 should use component-local width state only.
- Persisted panel widths can be added later through an owner-backed UI preference only after the shared shell is proven across real consumers.

Phase 2 migration decision:
- Phase 2 should extract `WorkspacePanelSplitShell` and prove its slot, clamp, mouse-drag, keyboard, and CSS behavior with focused component tests.
- Phase 2 should not migrate `SettingsSurface`, `PropertiesSurface`, or `CatalogShell` as real consumers.
- Phase 3 should migrate Settings and Properties first.
- Phase 4 should migrate Catalog onto the shared outer shell after the Settings/Properties adoption proves the shared shell.

Final bridge decision:
- Catalog migration remains required inside this `Gen 4 - Cleanup 1` lane unless Phase 4 discovers a concrete blocker.
- If Phase 4 discovers a blocker, it must record a named bridge follow-up before Phase 5 closeout instead of silently leaving Catalog outside the shared foundation.

### Phase 2 Prepared Implementation Handoff

Phase 2 should be the first source-code cut for this lane.

Create:
- `src/app/workspace/WorkspacePanelSplitShell.tsx`
- `src/app/workspace/WorkspacePanelSplitShell.test.tsx`
- `src/app/theme/surfaces/workspace-panel-shell.css`

Update:
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this phase doc
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`

First-pass prop contract:
- `left: ReactNode`
- `right: ReactNode`
- `leftLabel: string`
- `rightLabel: string`
- optional `className`
- optional `defaultLeftWidth`, `minLeftWidth`, `maxLeftWidth`, and `keyboardStep`
- optional `resizeLabel`, defaulting to `Resize workspace panel`
- optional `dataShellKind` or equivalent stable data attribute for tests and future consumers

Initial constants should match the current Catalog behavior unless the implementation discovers a concrete reason to diverge:
- minimum left width: `184`
- default left width: `240`
- maximum left width: `420`
- keyboard step: `16`
- divider width: `8px`
- mobile breakpoint: `860px`

Behavior requirements:
- render the shell as a left slot, vertical resize separator, and right slot
- expose `role="separator"`, `aria-orientation="vertical"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and a clear resize label
- handle mouse drag with document-level `mousemove` / `mouseup` listeners, matching current `CatalogShell` behavior closely enough that Phase 4 can adopt it without rewriting the interaction model
- handle keyboard resize with `ArrowLeft`, `ArrowRight`, `Home`, and `End`
- clamp all width changes between the configured min/max values
- set a shell-level resizing class while dragging, plus a body-level class such as `WorkspacePanelSplitShellIsResizing` if needed for global cursor/user-select behavior
- keep width in component-local state only
- expose a CSS custom property such as `--workspace-panel-shell-left-width`
- hide the divider and stack panels at the mobile breakpoint, matching the current Settings/Catalog responsive direction

Focused test requirements:
- render left and right slot content
- expose the accessible separator and current width attributes
- clamp keyboard resize at min and max
- update width on mouse drag and stop resizing on mouseup
- apply/remove the resizing class during drag cleanup

Implementation guardrails:
- do not import or render `SettingsSurface`, `PropertiesSurface`, `CatalogSurface`, or `CatalogShell` from the new shell test
- do not migrate any real workspace surface in Phase 2
- do not persist panel width to `useUiPrefsStore`, `useWorkspaceStore`, or localStorage
- do not move Catalog-specific CSS out of `catalog.css`
- do not move Settings/Properties section or content CSS out of `settings.css`
- keep the shared CSS limited to outer shell, panel slot, divider, resizing state, scroll containment, and responsive stacking primitives

Suggested verification:
- `npm test -- WorkspacePanelSplitShell.test.tsx`
- `npm run build`

### Phase 3 Prepared Implementation Handoff

Phase 3 should be the first real-consumer migration for the shared shell.

Current live anchors:
- `src/app/workspace/SettingsSurface.tsx`
  - currently renders one outer `SettingsSurfaceShell` wrapper
  - left slot candidate is the existing `SettingsSurfaceRail`
  - right slot candidate is the existing `SettingsSurfaceContent`
  - Settings section definitions, Settings rows, preference reads/writes, and section click routing must stay in `SettingsSurface`
- `src/app/workspace/PropertiesSurface.tsx`
  - currently renders one outer `SettingsSurfaceShell` wrapper
  - left slot candidate is the existing `SettingsSurfaceRail` with `role="tablist"` section buttons
  - right slot candidate is the existing `SettingsSurfaceContent`
  - focused-object routing, hosted Properties section state, and Materials content behavior must stay in `PropertiesSurface`
  - the existing horizontal focused-item list resize handle inside the right panel is not the shared left/right divider and must be preserved unchanged
- `src/app/theme/surfaces/settings.css`
  - currently owns the fixed two-column `SettingsSurfaceShell` grid
  - should keep Settings/Properties rail, section button, content, group, row, Materials, and focused-item styling
  - should stop being the owner of the outer left/right panel grid after Phase 3

Phase 3 should create a small local helper only if it materially reduces duplication:
- preferred first move: migrate `SettingsSurface` and `PropertiesSurface` directly to `WorkspacePanelSplitShell`
- optional follow-up inside the same phase: extract `WorkspaceSectionShell.tsx` only if both surfaces still duplicate enough section-rail/content assembly after using the shared panel shell
- do not extract a generic section registry, section definition owner, or Properties section contract in this phase

Recommended `WorkspacePanelSplitShell` usage:
- Settings:
  - `dataShellKind="settings"`
  - `leftLabel="Settings sections"`
  - `rightLabel="Settings content"`
  - `resizeLabel="Resize Settings sections panel"`
  - `className="SettingsSurfaceShell"` only if keeping this class temporarily is the smallest CSS bridge
- Properties:
  - `dataShellKind="properties"`
  - `leftLabel="Properties shell rail"`
  - `rightLabel="Properties content"`
  - `resizeLabel="Resize Properties sections panel"`
  - `className="SettingsSurfaceShell"` only if keeping this class temporarily is the smallest CSS bridge

Expected code shape:
- import `WorkspacePanelSplitShell` into `SettingsSurface.tsx`
- import `WorkspacePanelSplitShell` into `PropertiesSurface.tsx`
- replace each outer `<div className="SettingsSurfaceShell">` with `WorkspacePanelSplitShell`
- pass the existing `<aside className="SettingsSurfaceRail" ...>` as the `left` slot
- pass the existing `<main className="SettingsSurfaceContent" ...>` as the `right` slot
- avoid moving inner Settings or Properties rendering logic unless an extracted `WorkspaceSectionShell` is clearly worth it

Focused test requirements:
- `SettingsSurface.test.tsx`
  - prove the shared shell renders in Settings, for example through `data-workspace-panel-shell="settings"`
  - prove the Settings resize separator is present and has the expected accessible name
  - prove Settings section clicks still route right-panel content exactly as before
- `PropertiesSurface.test.tsx`
  - prove the shared shell renders in Properties, for example through `data-workspace-panel-shell="properties"`
  - prove the Properties resize separator is present and has the expected accessible name
  - prove the existing Properties hosted section tablist and Materials content still render
  - preserve focused-item list resize tests and do not treat that horizontal handle as the shared shell divider
- `WorkspacePanelSplitShell.test.tsx`
  - should remain passing; add no consumer-specific behavior there unless the shell contract itself changes

Implementation guardrails:
- do not migrate `CatalogShell` or `CatalogSurface`
- do not add new Settings or Properties feature behavior
- do not add persisted panel-width preferences
- do not move Settings section definitions out of `SettingsSurface`
- do not move Properties hosted section definitions, focused-object routing, or Materials behavior out of `PropertiesSurface`
- do not delete broad `SettingsSurfaceShell` CSS until both surfaces are verified on the shared shell and the remaining class usage is understood
- keep CSS cleanup conservative; deep stale CSS retirement belongs in Phase 5 unless a small selector edit is required for Phase 3 correctness

Suggested verification:
- `npm test -- WorkspacePanelSplitShell.test.tsx SettingsSurface.test.tsx PropertiesSurface.test.tsx`
- `npm run build`

### Phase 4 Prepared Implementation Handoff

Phase 4 should migrate Catalog's outer left/right shell onto `WorkspacePanelSplitShell` while leaving Catalog-specific behavior in Catalog.

Current live anchors:
- `src/app/catalog/ui/CatalogShell.tsx`
  - owns inline browse-rail width constants, `browseRailWidth` state, `isBrowseRailResizing` state, resize refs, document-level mouse listeners, keyboard resize handling, and the current `CatalogShellColumnResizeHandle`
  - renders `CatalogShellBrowseRail` as the left panel
  - renders a `CatalogShellRegion CatalogShellContent` section as the right panel
  - owns Catalog browse mode, facet/filter state, search, preview sessions, item page navigation, catalog info toggles, source/import actions, and environment actions
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
  - owns catalog-specific browse/filter/source rail content and should remain Catalog-owned
- `src/app/theme/surfaces/catalog.css`
  - currently owns the outer `CatalogShell` grid and `CatalogShellColumnResizeHandle`
  - should keep Catalog rail/content/card/item/source styling
  - should stop being the owner of the reusable left/right shell grid and divider after Phase 4
- `src/app/catalog/ui/CatalogShell.test.tsx`
  - already has a `catalog-shell-browse-rail-resize` test around the current browse-rail resize path
  - already covers navigation, filter, item page, info page, preview, and source behavior that should remain unchanged
- `src/app/workspace/CatalogSurface.test.tsx`
  - has broad workspace-surface coverage for rendered Catalog content and should stay green

Expected code shape:
- import `WorkspacePanelSplitShell` into `CatalogShell.tsx`
- remove the Catalog-local width constants, `clampCatalogBrowseRailWidth`, `browseRailWidth`, `isBrowseRailResizing`, resize refs, resize effect, resize-start handler, keyboard handler, and `catalogShellStyle`
- replace the outer `<div className="CatalogShell" ...>` plus separate `CatalogShellColumnResizeHandle` with `WorkspacePanelSplitShell`
- pass the existing `CatalogShellBrowseRail` element as `left`
- pass the existing `CatalogShellRegion CatalogShellContent` section as `right`
- use `dataShellKind="catalog"`
- use `leftLabel="Catalog browse rail"`
- use `rightLabel="Catalog content"`
- use `resizeLabel="Resize Catalog browse rail"`
- use `className="CatalogShell"` only as a temporary CSS bridge if useful, but make sure old grid/divider rules do not fight `WorkspacePanelSplitShell`

CSS direction:
- remove or narrow the outer-grid responsibility from `.CatalogShell`
- remove or narrow `.CatalogShellColumnResizeHandle` rules once the shared divider owns the handle
- preserve `.CatalogShellRegion`, `.CatalogShellFilters`, `.CatalogShellContent`, `.CatalogShellContentBody`, cards, filter controls, item page, preview, source, and Catalog-specific responsive content styling
- if keeping `.CatalogShell` as a bridge class, limit it to Catalog-specific shell spacing or token hooks, not grid columns or divider behavior
- keep broad stale CSS cleanup for Phase 5 unless a selector would be actively wrong after the migration

Focused test requirements:
- `CatalogShell.test.tsx`
  - update the browse-rail resize test to assert `data-workspace-panel-shell="catalog"` and the shared shell's `Resize Catalog browse rail` separator
  - preserve mouse/keyboard resize proof through the shared shell
  - preserve Catalog navigation/filter/content tests without class churn
- `CatalogSurface.test.tsx`
  - add or adjust one lightweight assertion that the Catalog surface renders the shared shell, if it is not already covered through `CatalogShell.test.tsx`
- `WorkspacePanelSplitShell.test.tsx`
  - should remain passing; avoid adding Catalog-specific behavior there

Implementation guardrails:
- do not rewrite Catalog browse/filter/search/source/import/preview/item-page logic
- do not move `CatalogShellBrowseRail` content into a generic section shell
- do not use the Settings/Properties section template for Catalog
- do not add persisted Catalog width preferences
- do not migrate advanced split-panel behavior
- do not start Phase 5's broad CSS cleanup early

Suggested verification:
- `npm test -- WorkspacePanelSplitShell.test.tsx CatalogShell.test.tsx CatalogSurface.test.tsx`
- `npm run build`

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

## [x] `Gen 4 - Cleanup 1 / Phase 1` - `Owner Map And Shared Contract Lock`

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

- [x] Confirm current `CatalogShell` panel and divider ownership.
- [x] Confirm current `SettingsSurfaceShell` ownership.
- [x] Confirm current `PropertiesSurface` dependency on Settings shell classes.
- [x] Name the component contract and prop shape at planning level.
- [x] Choose the initial migration order.

#### Verification Shape

- docs-only review
- no runtime tests required

#### Done Shape

- Phase 2 can begin with an explicit shared-shell contract and migration order.
- Phase 2 should extract and test the shared shell first, with real workspace migration deferred to Phase 3 and Phase 4.

## [x] `Gen 4 - Cleanup 1 / Phase 2` - `Shared Panel Split Shell Extraction`

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

Create the shared shell with slot-based left/right content and a reusable divider path. Keep the first consumer to the focused test fixture only.

Do not migrate `SettingsSurface`, `PropertiesSurface`, or `CatalogShell` in Phase 2.

#### Likely Files

- `src/app/workspace/WorkspacePanelSplitShell.tsx`
- `src/app/workspace/WorkspacePanelSplitShell.test.tsx`
- `src/app/theme/surfaces/workspace-panel-shell.css`
- `src/app/theme/v15Theme.css`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`

#### No-Widening Rule

Do not migrate any real workspace surface in this phase.

Do not add persisted width preferences.

Do not start the Settings/Properties section-template extraction.

#### Checklist

- [x] Add shared shell slots.
- [x] Add adjustable left-panel width.
- [x] Add min/max clamping.
- [x] Add keyboard-accessible divider behavior matching the current Catalog behavior.
- [x] Add responsive stacking and hidden-divider behavior at the shared mobile breakpoint.
- [x] Import the new shared shell CSS from `v15Theme.css`.
- [x] Add focused shell tests.

#### Verification Shape

- `npm test -- WorkspacePanelSplitShell.test.tsx`
- `npm run build`

#### Done Shape

- Shared shell exists and is ready for real workspace consumers.
- `Phase 3 - Settings And Properties Section Shell Migration` is now the next explicit implementation target.

## [x] `Gen 4 - Cleanup 1 / Phase 3` - `Settings And Properties Section Shell Migration`

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

Migrate `SettingsSurface` and `PropertiesSurface` as the only real consumers in this phase.

Do not migrate Catalog in Phase 3.

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/WorkspaceSectionShell.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/theme/surfaces/settings.css`
- shared shell CSS owner if a small selector bridge is required
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`

#### No-Widening Rule

Do not add new settings or properties features.

Do not add persisted width preferences.

Do not migrate Catalog.

Do not extract `WorkspaceSectionShell` unless the post-shell-adoption duplication still justifies it.

#### Checklist

- [x] Settings uses shared panel shell.
- [x] Properties uses shared panel shell.
- [x] Settings and Properties still render their current section behavior.
- [x] Adjustable left-panel width is available to both.
- [x] Existing Properties focused-item list resize behavior remains unchanged.
- [x] Tests prove shell adoption without changing business logic.

#### Verification Shape

- `npm test -- WorkspacePanelSplitShell.test.tsx SettingsSurface.test.tsx PropertiesSurface.test.tsx`
- `npm run build`

#### Done Shape

- Settings and Properties no longer hand-share shell classes as their main architecture.
- `Phase 4 - Catalog Outer Shell Adoption` is now complete.
- `Phase 5 - Shell CSS Cleanup And Future Split Handoff` is now complete.
- `Gen 4 - Cleanup 1` is now complete.

## [x] `Gen 4 - Cleanup 1 / Phase 4` - `Catalog Outer Shell Adoption`

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

Retire the Catalog-local outer-shell resize implementation in favor of the shared shell behavior from `WorkspacePanelSplitShell`.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/theme/surfaces/catalog.css`
- shared shell CSS owner
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`

#### No-Widening Rule

Do not rewrite catalog data flow or import/source actions.

Do not move Catalog rail content into `WorkspaceSectionShell`.

Do not add persisted Catalog panel width preferences.

Do not do broad stale CSS cleanup beyond what the migration requires.

#### Checklist

- [x] Catalog uses the shared outer panel shell.
- [x] Catalog browse rail remains catalog-owned.
- [x] Catalog content area remains catalog-owned.
- [x] Existing Catalog width adjustment still works.
- [x] Existing Catalog tests remain focused on behavior, not class churn.
- [x] Catalog-specific source/import/preview/item-page behavior remains unchanged.

#### Verification Shape

- `npm test -- WorkspacePanelSplitShell.test.tsx CatalogShell.test.tsx CatalogSurface.test.tsx`
- `npm run build`

#### Done Shape

- Catalog shares the same panel foundation as Settings and Properties.

### Phase 5 Prepared Implementation Handoff

Phase 5 should close the cleanup lane by removing stale shell-bridge CSS now that Settings, Properties, and Catalog all use `WorkspacePanelSplitShell`.

Current live anchors:

- `src/app/theme/surfaces/settings.css`
  - `.SettingsSurfaceShell` still owns the pre-shared-shell fixed two-column grid, gap, padding, and overflow rules
  - the mobile `.SettingsSurfaceShell` media rule still owns the old stack behavior
  - `.SettingsSurfacePanelShell` is the current shared-shell bridge used by both `SettingsSurface` and `PropertiesSurface`
  - `.SettingsSurfaceRail`, `.SettingsSurfaceContent`, and the rest of the settings/properties content styling still belong in Settings CSS
- `src/app/theme/surfaces/catalog.css`
  - `.CatalogShell` is now only a thin shared-shell class bridge with height/min-width/padding
  - old Catalog outer divider/grid hooks are already gone
  - `.CatalogShellIsResizingBrowseSection` is still valid because it belongs to the Catalog browse-section vertical resize behavior inside `CatalogShellBrowseRail`
- `src/app/theme/surfaces/workspace-panel-shell.css`
  - owns the reusable outer grid, left-width CSS variable, divider, responsive stacking, resize body class, and shared panel slots
- `src/app/workspace/SettingsSurface.tsx`
  - uses `className="SettingsSurfacePanelShell"` and `dataShellKind="settings"`
- `src/app/workspace/PropertiesSurface.tsx`
  - uses `className="SettingsSurfacePanelShell"` and `dataShellKind="properties"`
- `src/app/catalog/ui/CatalogShell.tsx`
  - uses `className="CatalogShell"` and `dataShellKind="catalog"`

Recommended first code cut:

- delete `.SettingsSurfaceShell` and its mobile media rule if no runtime component still references it
- keep `.SettingsSurfacePanelShell` as the Settings/Properties padding bridge unless the implementation chooses a clearer name and updates both surfaces/tests together
- keep `.SettingsSurfacePanelShell .SettingsSurfaceRail, .SettingsSurfacePanelShell .SettingsSurfaceContent` because the shared shell panels need their slotted content to fill height
- keep `.CatalogShell` as a thin Catalog-specific bridge only if removing it would make Catalog lose a stable CSS/test hook or padding/height behavior
- do not remove `.CatalogShellIsResizingBrowseSection`; it is not stale outer-shell CSS
- keep `workspace-panel-shell.css` as the single reusable outer panel-shell owner

Focused tests:

- `WorkspacePanelSplitShell.test.tsx`
  - prove slot, keyboard, drag, clamp, and cleanup behavior remains intact
- `SettingsSurface.test.tsx`
  - prove Settings still renders through `data-workspace-panel-shell="settings"` and section routing still works
- `PropertiesSurface.test.tsx`
  - prove Properties still renders through `data-workspace-panel-shell="properties"` and the focused-object list resize handle remains horizontal
- `CatalogShell.test.tsx`
  - prove Catalog still renders through `data-workspace-panel-shell="catalog"` and the shared browse-rail divider still resizes
- optional targeted `CatalogSurface.test.tsx` owned-scroll/shared-shell test only if selectors touched in Phase 5 affect the workspace surface wrapper

No-widening guardrails:

- do not redesign the shared shell visuals
- do not rename `WorkspacePanelSplitShell`
- do not add persisted panel widths
- do not implement nested/multi-panel splitting
- do not rewrite Settings, Properties, or Catalog business behavior
- do not repair unrelated broad `CatalogSurface.test.tsx` legacy text expectations as part of this phase

Future split handoff note to record when closing Phase 5:

- advanced panel splitting should become a later architecture lane on top of `WorkspacePanelSplitShell`, not inside Gen 4 cleanup closeout
- likely future questions: persisted layout model, multiple panes, docking/splitting commands, drag/drop split targets, and per-workspace layout restore
- Gen 4's done shape is only the stable shared two-panel shell foundation

## [x] `Gen 4 - Cleanup 1 / Phase 5` - `Shell CSS Cleanup And Future Split Handoff`

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

Start with `settings.css`: remove the now-unused `.SettingsSurfaceShell` fixed-grid rules and its mobile media rule after confirming no source file still renders that class. Keep `SettingsSurfacePanelShell` as the current shared-shell bridge for Settings and Properties unless the implementation updates both surfaces and tests to a clearer replacement in the same pass.

Then inspect `catalog.css`: keep `.CatalogShell` only as a thin Catalog bridge if it is still needed for stable height/padding/class ownership, and do not remove `.CatalogShellIsResizingBrowseSection` because that class belongs to the internal browse-section height resize behavior, not the old outer panel divider.

Keep `workspace-panel-shell.css` as the only reusable outer split-shell owner.

#### Likely Files

- `src/app/theme/surfaces/settings.css`
- `src/app/theme/surfaces/catalog.css`
- shared shell CSS owner
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen4-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen4 - Cleanup 1 - Shared Workspace Panel Shell.md`

#### No-Widening Rule

Do not start the advanced split-panel system here. Record it as future work only.

Do not redesign shell visuals, add persisted width preferences, rename `WorkspacePanelSplitShell`, or repair unrelated broad CatalogSurface legacy expectations.

#### Checklist

- [x] Remove stale duplicated shell CSS.
- [x] Preserve workspace-specific content CSS.
- [x] Confirm Settings, Properties, and Catalog still render through the shared shell.
- [x] Add final docs handoff for future advanced panel splitting.

#### Verification Shape

- `npm test -- WorkspacePanelSplitShell.test.tsx SettingsSurface.test.tsx PropertiesSurface.test.tsx CatalogShell.test.tsx`
- optional targeted `npm test -- CatalogSurface.test.tsx -t "uses an explicit content scroll owner inside the shared Catalog shell"` if Catalog shell selectors change
- `npm run build`

#### Done Shape

- `Gen 4 - Cleanup 1` closes with one shared panel-shell foundation and a clear future extension point.
