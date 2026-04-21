# Catalog-Gen2-9 - Local PubParts Library Folder And Auto-Discovery Handoff

## Doc Header

### Doc History
4. 2026-04-20 21:52:10: Closed `Catalog-Gen2-9` after the browser-honest PubParts local-library loop shipped with persistent local-library status, per-item folder and manifest metadata, a Home Page PubParts Library toggle/status row, a Catalog `Local Downloads` rail section, one advancing item-page local-library action, existing Import-owned local file picker handoff, focused tests, and `npm.cmd run build`, while leaving silent disk scanning, automatic folder creation, remote byte fetching, archive extraction, native direct download, STEP fidelity, builder behavior, and compatibility verdicts to later owners.
3. 2026-04-20 20:32:22: Simplified the user-facing `Catalog-Gen2-9` action plan so the Catalog item page should expose one primary PubParts local-library action that advances to the next honest state, preserving prepare, open-source, scan, import, and later preview as internal resolver states instead of separate competing buttons.
2. 2026-04-20 20:24:16: Expanded this `Catalog-Gen2-9` plan so the local PubParts library workflow explicitly includes a Home Page enable/configure/status toggle and a Catalog `Local Downloads` section that lists PubParts items with local downloaded, extracted, found, unsupported, needs-extraction, import-ready, and imported states.
1. 2026-04-20 20:15:13: Created this `Catalog-Gen2-9` Family Phase Doc to route the reopened PubParts local-download problem into a user-granted local library folder, per-item folder convention, source manifests, known-folder scan handoff, and Import-owned staged local file intake instead of relying on an unknown browser downloads location.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-9`.

Use it to answer:
- how PubParts downloads should become organized on the user's local drive
- how Catalog should know which local folder belongs to one PubParts item
- how source manifests should preserve PubParts attribution and source version history
- where Catalog stops and Import starts for local filesystem access
- how the app should avoid pretending it can silently read the user's downloads folder

Do not use it for:
- silently scanning arbitrary local folders
- replacing the normal staged Import dialog
- direct remote byte fetching into local disk
- Dropbox shared-folder listing or ZIP extraction inside Catalog
- STEP loader fidelity, compatibility checks, or builder runtime behavior

## Doc Body

### Family Phase Goal

`Catalog-Gen2-9` should turn the current PubParts import button into a trustworthy local-library loop.

The current shipped behavior is honest but clumsy:
- Catalog can open the source page or linked download.
- Catalog can launch the staged Import dialog for files the user already has locally.
- ParaHook does not know where the browser saved or extracted the source file.

The target workflow is:
1. User grants or chooses a `PubParts Library` root folder.
2. Catalog can prepare a predictable per-item folder for a PubParts source.
3. The user downloads or extracts source files into that known folder.
4. Import scans the known folder for supported files.
5. Catalog shows found-file/import readiness on the item page.
6. Home Page shows the global PubParts Library toggle/status row.
7. Catalog shows a `Local Downloads` section listing PubParts items that already have local source state.
8. The user uses one primary item-page action that advances the next honest step.
9. The user imports selected found files through the existing staged Import review path with PubParts attribution.

### Folder Convention

The first folder convention should stay plain and inspectable:

```text
<UserSelectedRoot>/PubParts/
  parts/
    <catalog-item-slug>/
      pubparts-source.json
      source/
      downloads/
      extracted/
      importable/
      versions/
        <source-version-key>/
          manifest.json
          files/
```

The exact implementation can tighten names later, but the first phase should preserve these ideas:
- one root library folder chosen by the user
- one predictable folder per PubParts Catalog item
- one source manifest beside the downloaded source
- one versioned file area so future source updates do not overwrite history
- separate places for downloaded archives, extracted contents, and importable supported files

### Source Manifest Shape

The first manifest should be source metadata, not project truth.

It should preserve:
- ParaHook Catalog item id
- PubParts provider name
- PubParts source page URL
- linked source/archive URL
- source title
- normalized platform/type metadata where useful
- source freshness such as `dropboxZipLastUpdated`
- source version key
- local files discovered by scan
- scan timestamp and scan result status

### Ownership Boundary

Catalog owns:
- the visible PubParts item identity
- the local library status on Catalog cards or item pages
- the Catalog `Local Downloads` section that summarizes known local PubParts item states
- the per-item folder naming convention
- source manifest fields that preserve attribution and source version identity
- one primary item-page local-library action whose label advances through setup, open-source/download, scan, import, and later preview states
- internal action states such as prepare folder, scan folder, import found files, and preview local file without presenting all of them as competing primary buttons
- clear copy that says browser download location is not automatic truth

Import owns:
- requesting or using local folder permission
- scanning local folder contents
- classifying supported files
- turning supported local files into staged import files
- archive extraction if a later Import phase ships it
- preserving source attribution through staged import and accepted imported references

Home/storage owns:
- showing the configured PubParts library root or storage lane in storage management
- exposing the global PubParts Library toggle/status row
- showing whether the library is not configured, permission needed, enabled, disabled, unavailable, or recently scanned
- distinguishing browser storage buckets from user-granted local filesystem roots

### Browser Boundary

The browser version must stay honest:
- it cannot silently read `Downloads`
- it cannot create folders anywhere on disk without a user grant
- it cannot know where the user saved a file after a normal browser download
- it should rely on explicit folder permission or explicit file picking

A later desktop/native owner may add direct download into the PubParts library folder. That future owner should not be described as already shipped by this phase.

### Acceptance Read

This family phase is complete when:
- the docs and implementation agree on the local PubParts library boundary
- Catalog can show a PubParts item has a prepared local folder or needs one
- source manifests can preserve PubParts attribution and source version identity
- the app can scan a known user-granted local folder or route to explicit local file picking as fallback
- found supported files can be handed to the staged Import dialog with PubParts attribution
- Home Page can enable/disable/configure the PubParts local-library workflow through a visible toggle/status row
- Catalog has a `Local Downloads` section for prepared, downloaded, extracted, found, unsupported, needs-extraction, import-ready, and imported PubParts item states
- Catalog item pages expose one primary PubParts local-library action at a time, with the label driven by the next available state
- preview remains planned until a known local previewable or importable file exists
- unsupported, not-found, not-granted, and needs-extraction states are visible
- focused Catalog/Import tests and `npm.cmd run build` pass for each implementation phase
- no silent local drive scanning, remote byte fetch, archive extraction, STEP loader fidelity, builder behavior, or compatibility verdict sneaks in

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-11. let PubParts downloads resolve through a user-chosen local PubParts library folder so ParaHook can organize per-item folders, scan known local files, and hand supported files to Import without relying on an unknown browser Downloads location`
- [x] `Catalog-Gen2-HLG-12. give Catalog a Local Downloads section so the user can see which PubParts parts or items already have local downloaded, extracted, found, unsupported, or import-ready files`
- [x] `Catalog-Gen2-HLG-13. simplify PubParts item-page download/import/preview workflow into one primary action that advances the next honest step instead of exposing separate process buttons for prepare, scan, import, and preview`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-17. Replace the unknown browser-download-location dependency with a user-granted local PubParts library folder, per-item source manifests, local folder scan status, and staged Import handoff for discovered supported files.
- [x] Catalog-Gen2-CLG-18. Add a Catalog `Local Downloads` section and Home Page toggle coordination so users can enable the PubParts library globally and inspect which PubParts items already have local files.
- [x] Catalog-Gen2-CLG-19. Collapse the PubParts item-page local-library workflow into one primary action resolver that selects the next honest label/action from setup, open source, scan local files, import found files, and later preview local file states.

### `Catalog-Gen2-9 / Phase 1`

- [x] Block the local PubParts library boundary and folder contract.
- [x] Record the browser sandbox rule and fallback path.
- [x] Define Catalog-owned versus Import-owned responsibilities.
- [x] Define the first per-item folder convention and manifest fields.
- [x] Keep implementation browser-honest by avoiding silent disk scanning or automatic folder creation.
- [x] `Catalog-Gen2-HLG-11`
- [x] Catalog-Gen2-CLG-17 boundary and folder-contract slice.

### `Catalog-Gen2-9 / Phase 2`

- [x] Add Catalog-visible local-folder status, the `Local Downloads` section, and one-primary-action item-page planning.
- [x] Define internal action resolver states for setup, open source/download, scan local files, import found files, and later preview local file.
- [x] Define local download section states for prepared, downloaded, extracted, supported-found, unsupported-only, needs-extraction, import-ready, and imported.
- [x] Coordinate with Home Page toggle/status state instead of creating a second Catalog-only enable switch.
- [x] Keep folder permission and scanning implementation owned by Import.
- [x] Preserve external source entry, staged local source, and imported project asset as separate lifecycle states.
- [x] `Catalog-Gen2-HLG-9`
- [x] `Catalog-Gen2-HLG-10`
- [x] `Catalog-Gen2-HLG-11`
- [x] `Catalog-Gen2-HLG-12`
- [x] `Catalog-Gen2-HLG-13`
- [x] Catalog-Gen2-CLG-16 status/read slice.
- [x] Catalog-Gen2-CLG-17 Catalog UI/status slice.
- [x] Catalog-Gen2-CLG-18 Catalog local-downloads section and Home toggle coordination slice.
- [x] Catalog-Gen2-CLG-19 one-primary-action resolver slice.

### `Catalog-Gen2-9 / Phase 3`

- [x] Coordinate the Import-family local source library scanner handoff.
- [x] Route supported local files through the existing staged Import dialog.
- [x] Preserve PubParts attribution into staged import files and accepted imported references.
- [x] Surface not-granted, no-files-found, unsupported, needs-extraction, and ready-to-import states.
- [x] `Catalog-Gen2-HLG-10`
- [x] `Catalog-Gen2-HLG-11`
- [x] Catalog-Gen2-CLG-15 Import handoff slice.
- [x] Catalog-Gen2-CLG-17 scan/import handoff slice.

### `Catalog-Gen2-9 / Phase 4`

- [x] Audit whether the local-library workflow satisfies the user download/import goal.
- [x] Add a follow-up phase if folder scanning, archive extraction, or source-version history is still partial.
- [x] Route native/desktop direct downloader work to a later owner if browser limits still block the best experience.
- [x] Run focused tests plus `npm.cmd run build`.
- [x] `Catalog-Gen2-HLG-11`
- [x] Catalog-Gen2-CLG-17 closeout slice.

## [x] `Catalog-Gen2-9 / Phase 1` - `Local Library Boundary And Folder Contract`

### Phase 1 Summary

Phase 1 blocked the exact local library contract and shipped the browser-honest metadata/storage slice.

### Phase 1 Implementation Spec

Status: complete.

Implemented:
- whether the app has any current File System Access API helpers
- where local folder permission should live if implemented
- whether current staged Import helpers can accept local files with PubParts attribution
- how Home Page storage should distinguish browser storage from a user-granted local folder
- how the Home Page PubParts Library toggle/status row should coordinate with Catalog without duplicating ownership
- where the Catalog `Local Downloads` section should live in the browse/item-page flow
- how the item page should resolve exactly one primary local-library action label at a time
- which later preview states should be reserved until a known local file exists
- what tests should prove the browser boundary stays honest

### Phase 1 Closeout

Shipped:
- `pubPartsDownloadsStorage.ts` now stores PubParts local-library status and per-item local source records beside staged source-link records without dropping existing staged state.
- Per-item records preserve a predictable folder layout under `PubParts/parts/<item-slug>/`, including manifest, source, downloads, extracted, importable, and versioned file paths.
- Source manifests preserve PubParts attribution, Catalog item identity, source/archive URLs, collection metadata, source version key, and source metadata.
- Home Page Storage Management exposes a `PubParts Library` toggle/status control through the PubParts storage owner seam.
- Catalog browse rail exposes a `Local Downloads` section for prepared local-library metadata records.
- PubParts item pages expose one local-library primary action that advances from `Prepare PubParts Folder` to `Stage Source Link` to `Import Local Files`.
- The import step still uses the existing Import-owned local file picker and staged Import review handoff with PubParts attribution.

Not shipped:
- silent reads of `Downloads`.
- automatic folder creation on disk.
- File System Access API handle persistence.
- remote byte fetching or native direct download.
- Dropbox folder listing, ZIP extraction, or archive content scanning.
- STEP loader fidelity.
- builder/runtime load behavior.
- compatibility verdicts.

Verification:

```powershell
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts src/app/workspace/HomePageSurface.test.tsx src/app/workspace/homePageStorageTransparency.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Result: passed with 50 tests.

```powershell
npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/pubPartsSource.test.ts
```

Result: passed with 61 tests.

```powershell
npm.cmd run build
```

Result: passed.
