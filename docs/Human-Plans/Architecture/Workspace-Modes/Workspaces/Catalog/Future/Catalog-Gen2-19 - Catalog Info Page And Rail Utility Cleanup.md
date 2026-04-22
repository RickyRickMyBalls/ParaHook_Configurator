# Catalog-Gen2-19 - Catalog Info Page And Rail Utility Cleanup

## Doc Header

### Doc History
2. 2026-04-21 20:29:36: Completed `Catalog-Gen2-19 / Phase 1 - Catalog Info Page And Rail Utility Cleanup` after Catalog gained one top-right `Catalog Info` content-header action, Staged Sources and Local Downloads moved from the left browse rail into the combined info page, focused CatalogShell tests passed, and production build verification passed.
1. 2026-04-21 20:28:57: Created this small Catalog Gen2 follow-up phase after the user asked to move `Local Downloads` and `Staged Sources` out of the left browse rail and considered combining them behind one top-right `Catalog Info` button instead of adding two title-bar buttons.

### Purpose

This doc prepares a narrow Catalog UI cleanup: move source utility reads out of the left browse rail and into one content-area `Catalog Info` page.

### Scope

This doc covers:
- one top-right `Catalog Info` button in the Catalog content title bar
- one combined Catalog Info page for Staged Sources and Local Downloads
- removing Staged Sources and Local Downloads from the left browse rail
- preserving the existing staged-source clear controls and local-library status reads

This doc does not cover:
- changing PubParts source staging behavior
- changing Local Library mirror writes or folder grants
- changing source-options, ZIP inspection, Import review, project acceptance, preview behavior, builder behavior, or compatibility behavior
- adding a second title-bar button for each utility page

## Doc Body

### Recommendation

Use one `Catalog Info` page instead of two title-bar buttons.

The two utility reads are related: both are Catalog source lifecycle/status surfaces, not browse-section filters. Combining them keeps the left rail focused on Catalog navigation and avoids cluttering the title bar with process-specific controls.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-24. keep the Catalog left browse rail focused on browse navigation by moving source utility/status reads into a dedicated Catalog Info page reached from the content title bar`

### `Catalog-Gen2-19 Phase 1`

- [x] `Catalog-Gen2-CLG-46. Add one Catalog Info title-bar action that opens a combined content page for Staged Sources and Local Downloads, remove those sections from the left rail, and preserve existing staged-source clear plus local-library status behavior.`

## [x] `Catalog-Gen2-19 / Phase 1` - `Catalog Info Page And Rail Utility Cleanup`

### Phase 1 Summary

Add one top-right `Catalog Info` page action and move the Staged Sources plus Local Downloads reads into that page.

### Phase 1 Owns

- `Catalog Info` title-bar action in the Catalog content header
- content-mode routing for a Catalog Info page
- combined Staged Sources and Local Downloads page content
- left rail cleanup so browse sections and preview session remain, while source utility blocks move out
- focused CatalogShell behavior tests

### Phase 1 Does Not Own

- source staging semantics
- local-library mirror writes or folder chooser behavior
- source-options dialog behavior
- Import/project acceptance
- ZIP/archive inspection
- preview, builder, or compatibility behavior
- persistent storage schema changes

### Phase 1 Implementation Spec

Status: complete.

#### Implementation Status

- Added `CatalogShellInfoPage` as the combined Catalog Info content page for Staged Sources and Local Downloads.
- Added `catalog-info` content-mode routing and one top-right `Catalog Info` content-header action in `CatalogShell`.
- Removed the Staged Sources and Local Downloads blocks from `CatalogShellBrowseRail`, leaving browse navigation and Preview Session in the left rail.
- Preserved staged-source clear controls, local-library mirror status, and empty-state copy on the new info page.
- Added focused CatalogShell coverage proving the utility sections no longer render in the left rail and appear on the Catalog Info page.
- Verified the focused CatalogShell tests and production build.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/catalog/ui/CatalogShellInfoPage.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/theme/surfaces/catalog.css`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- `docs/Doc-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`

#### Implementation Direction

1. Add `catalog-info` to `CatalogContentMode`.
2. Add a single content-header button anchored to the right side of the Catalog content title bar.
3. Make the button open the `catalog-info` content mode; when already on the info page, it may act as a return-to-catalog control.
4. Extract the existing Staged Sources and Local Downloads rail blocks into a `CatalogShellInfoPage` component.
5. Remove those two blocks and their source-specific props from `CatalogShellBrowseRail`.
6. Keep Preview Session in the left rail.
7. Add focused tests proving the source utility regions are no longer in the left rail and are visible after opening Catalog Info.

#### Verification

- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx`
- `npm.cmd run build`

#### Stop Condition

Stop when one top-right Catalog Info action opens a combined utility page, Staged Sources and Local Downloads no longer render in the left browse rail, existing source utility status/clear reads remain available on the info page, focused CatalogShell tests pass, build passes, and tracking docs are updated.
