# Import-8 - Local Source Library And PubParts Folder Intake

## Doc Header

### Doc History
3. 2026-04-20 20:32:22: Clarified that Import-8 should return scan/action summaries that let Catalog present one primary PubParts local-library button and later preview-ready states without exposing separate filesystem process actions or local file handles.
2. 2026-04-20 20:24:16: Expanded this `Import-8` plan so the local source-library scan contract must return enough status for the Home Page PubParts Library toggle and Catalog `Local Downloads` section, including enabled/disabled, permission, found-file summary, unsupported-only, needs-extraction, and ready-to-import states.
1. 2026-04-20 20:15:13: Created this `Import-8` Family Phase Doc as the Import-family owner for user-granted local source library access, PubParts folder scanning, supported-file discovery, and staged import handoff after Catalog Gen2 identified that a browser source-download button cannot reliably organize downloaded files by itself.

### Purpose

This file is the Family Phase Doc for `Import-8`.

Use it to answer:
- how Import should use a known user-granted local folder as a source library
- how PubParts per-item folders should be scanned for supported files
- how source manifests from Catalog should preserve attribution during staged import
- how unsupported, missing, needs-extraction, and ready-to-import states should surface
- where this lane stops before archive extraction, remote downloads, or format-specific fidelity

Do not use it for:
- silently scanning arbitrary user folders
- direct remote byte downloads
- Dropbox shared-folder listing
- ZIP extraction unless a later phase explicitly opens it
- STEP units/tessellation fidelity
- Catalog item identity or browse UI ownership

## Doc Body

### Family Phase Goal

`Import-8` should let ParaHook import from a known local source library folder instead of asking the user to hunt through the normal browser downloads location every time.

The first proof target is Catalog's PubParts library workflow:
- Catalog knows the external source item and expected per-item folder.
- Import owns permission to read the local folder.
- Import scans that known folder for supported files.
- Import stages selected supported files into the existing reviewed Import dialog.
- Source attribution from Catalog manifests survives through staged import and accepted imported references.
- Home Page can summarize whether the local library is enabled, permissioned, unavailable, or needs attention without becoming the scanner.
- Catalog can render a `Local Downloads` section from scan results without owning file handles.
- Catalog can resolve one primary next action from Import's scan summary instead of exposing multiple filesystem process buttons.

### Ownership Boundary

Import owns:
- folder permission or folder-picker behavior
- known-folder scanning
- supported file discovery for `.step`, `.glb`, `.obj`, `.stl`, and later `.stp` when the reference type supports it
- turning discovered files into staged import files
- staged import review and commit behavior
- failure states for not-granted, missing files, unsupported files, and partial scan results
- scan summaries that Home Page and Catalog can display without retaining file handles
- next-action summary states for setup, open source, scan, import found files, and later preview-ready local files

Catalog owns:
- PubParts item identity
- source page and source/archive URLs
- local library folder status in the Catalog item workflow
- per-item source manifest fields
- the decision to ask Import to scan a specific known folder
- the `Local Downloads` section that displays per-item scan status
- the one-primary-action item-page resolver that consumes Import scan summaries

This phase should not make Catalog own file handles or make Import own external catalog browse truth.

### Local Folder Contract

The first Catalog-provided folder shape is expected to be:

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

Import should not need this exact path hard-coded everywhere. The implementation should prefer a small source-library scan contract that receives:
- provider
- catalog item id
- display title
- expected folder handle or folder path descriptor
- source manifest data
- supported file extensions
- attribution metadata to attach to staged files
- caller display target, such as Home summary or Catalog local-downloads section

### Browser Boundary

The browser implementation must be permissioned:
- use a user-granted directory handle where available
- fall back to explicit file selection where directory handles are unavailable
- never silently read `Downloads`
- never assume the browser download destination

### Acceptance Read

This family phase is complete when:
- Import has a documented local source-library scan contract
- a known PubParts item folder can be scanned after user permission
- supported files can be staged into the existing reviewed Import dialog with PubParts attribution
- no-files-found, unsupported, needs-extraction, permission-missing, disabled, unavailable, and ready states are distinguishable
- Catalog can ask for a scan/import handoff without owning filesystem details
- Home Page can render a global toggle/status summary without owning filesystem details
- focused Import/Catalog tests and `npm.cmd run build` pass
- no direct remote download, archive extraction, STEP loader fidelity, builder behavior, or compatibility verdict ships by accident

## Wishlist Organization

### High Level Goals

- [ ] `Import-HLG-LocalSourceLibrary-1. let known user-granted source-library folders feed the reviewed Import path without making the user manually hunt through arbitrary downloads locations`
- [ ] `Import-HLG-LocalSourceLibrary-2. preserve source attribution from Catalog-owned manifests when local source files enter the staged Import dialog`

### Codex Level Goals

- [ ] Import-8-CLG-1. Add a permissioned local source-library scan contract for known folders.
- [ ] Import-8-CLG-2. Detect supported local files and route them into the existing staged Import dialog with attribution.
- [ ] Import-8-CLG-3. Report not-granted, no-files-found, unsupported, needs-extraction, and ready-to-import states to the caller.
- [ ] Import-8-CLG-4. Return Home Page and Catalog-safe source-library summaries without exposing local file handles to those surfaces.
- [ ] Import-8-CLG-5. Return enough next-action and preview-readiness status for Catalog to render one primary local-library action instead of separate process buttons.

### `Import-8 / Phase 1`

- [ ] Prep the folder permission and scan-contract implementation plan.
- [ ] Audit current file-picker, staged import, and source-attribution seams.
- [ ] Decide whether the first runtime target is directory handles, explicit file picker fallback, or both.
- [ ] Keep code changes out until Worker prep is approved.
- [ ] Import-8-CLG-1 boundary slice.

### `Import-8 / Phase 2`

- [ ] Implement known-folder supported-file scanning.
- [ ] Preserve source manifest attribution on discovered supported files.
- [ ] Return clear scan states for permission, empty folder, unsupported files, needs extraction, and ready files.
- [ ] Return scan summary data that can drive Home Page toggle status and Catalog `Local Downloads` rows.
- [ ] Return next-action data that can drive one primary Catalog action and later preview-ready states.
- [ ] Keep remote downloads and archive extraction out of scope.
- [ ] Import-8-CLG-1.
- [ ] Import-8-CLG-3.
- [ ] Import-8-CLG-4.
- [ ] Import-8-CLG-5.

### `Import-8 / Phase 3`

- [ ] Stage discovered supported files into the existing reviewed Import dialog.
- [ ] Preserve PubParts source attribution into staged files and accepted imported references.
- [ ] Prove Catalog can request the handoff without owning local file handles.
- [ ] Prove Home Page can show toggle/status summary without owning local file handles.
- [ ] Import-8-CLG-2.
- [ ] Import-8-CLG-4.
- [ ] Import-8-CLG-5.

### `Import-8 / Phase 4`

- [ ] Close out the local source-library handoff with focused Import/Catalog verification and `npm.cmd run build`.
- [ ] Add a follow-up phase if archive extraction, desktop/native downloading, or `.stp` support is still the user-visible blocker.
- [ ] Import-8-CLG-1.
- [ ] Import-8-CLG-2.
- [ ] Import-8-CLG-3.
- [ ] Import-8-CLG-4.
- [ ] Import-8-CLG-5.

## [ ] `Import-8 / Phase 1` - `Folder Permission And Scan Contract`

### Phase 1 Summary

Phase 1 should prep the runtime contract for local source-library scanning before implementation.

The Worker should read the existing staged Import and source-attribution code, then add the implementation spec here for Manager approval.

### Phase 1 Implementation Spec

Status: not prepped.

Worker prep should answer:
- what current staged import helper can receive `File` objects with attribution
- where a user-granted directory handle should be stored during a session
- whether local folder access needs a feature-detection fallback
- what exact scan result shape Catalog should consume
- what exact scan summary shape Home Page should consume
- how Import reports preview-ready local files without forcing Catalog to hold file handles
- which tests should prove no silent local folder access is attempted

