# Home-Page-7 - PubParts Library Toggle And Storage Visibility

## Doc Header

### Doc History
1. 2026-04-20 20:24:16: Created this `Home-Page-7` Family Phase Doc so the PubParts local-library workflow has a Home Page toggle/status owner for enabling, disabling, configuring, and summarizing the global local library while Catalog owns item-level local downloads and Import owns folder scanning.

### Purpose

This file is the Family Phase Doc for `Home-Page-7`.

Use it to answer:
- how Home Page should expose the global PubParts Local Library toggle
- which local-library states Home Page should show
- how Home Page should coordinate with Catalog `Local Downloads`
- where Home Page stops before owning local filesystem scanning or Catalog item truth

Do not use it for:
- Catalog item download lists
- local file scanning
- folder handle internals
- archive extraction
- imported-reference commits
- remote download behavior

## Doc Body

### Family Phase Goal

`Home-Page-7` should add the Home Page side of the PubParts local-library workflow.

The user should be able to see and control the global local-library setting from Home Page:
- not configured
- permission needed
- enabled
- disabled
- unavailable in this browser/runtime
- last scan/found summary

Turning the toggle off should stop automatic known-folder scans or local-library behavior. It should not delete the user's downloaded files.

### Ownership Boundary

Home Page owns:
- the global PubParts Local Library toggle/status row
- a setup/configure affordance for the library root descriptor
- a clear or forget-library affordance that removes app memory of the root without deleting files
- app-level status text that points item-level details to Catalog

Catalog owns:
- the PubParts `Local Downloads` section
- per-item prepared/downloaded/extracted/found/import-ready/imported reads
- item-page actions around prepare folder, scan folder, and import found files

Import owns:
- local folder permission
- known-folder scanning
- supported-file detection
- staging supported files into the Import dialog

### Acceptance Read

This family phase is complete when:
- Home Page has a visible PubParts Local Library toggle/status row
- the row can represent not configured, permission needed, enabled, disabled, unavailable, and scan summary states
- the row can link or point to Catalog `Local Downloads` for item-level details
- disabling the toggle does not imply deleting downloaded files
- Home Page does not own file handles, scanning, per-item manifests, or imports
- focused Home Page/Catalog/Import tests and `npm.cmd run build` pass for each implementation phase

## Wishlist Organization

### High Level Goals

- [ ] `Home-Page-Gen1-HLG-22. Home Page should include a PubParts Local Library toggle/status row so the user can enable, disable, configure, and inspect the global local download library without making Home Page own Catalog item truth or Import scanning.`

### Codex Level Goals

- [ ] Home-Page-Gen1-CLG-21. Add a PubParts Local Library toggle/status row that reports not configured, permission needed, enabled, disabled, unavailable, and scan summary states while routing item-level local downloads to Catalog and folder scanning to Import.

### `Home-Page-7 / Phase 1`

- [ ] Prep the PubParts Local Library toggle/status contract.
- [ ] Decide the visible states and row placement inside Storage Management or the Home control deck.
- [ ] Define how the row points to Catalog `Local Downloads`.
- [ ] Keep file scanning and local handles out of Home Page.
- [ ] `Home-Page-Gen1-HLG-22`
- [ ] Home-Page-Gen1-CLG-21 boundary/status slice.

### `Home-Page-7 / Phase 2`

- [ ] Implement the Home Page toggle/status row after Manager approves Worker prep.
- [ ] Wire the row to the local-library owner seam created by Catalog/Import planning.
- [ ] Show enabled, disabled, not configured, permission needed, unavailable, and scan summary states.
- [ ] Keep downloaded-file deletion out of scope.
- [ ] `Home-Page-Gen1-HLG-22`
- [ ] Home-Page-Gen1-CLG-21 visible row slice.

### `Home-Page-7 / Phase 3`

- [ ] Close out Home Page local-library visibility with focused tests and `npm.cmd run build`.
- [ ] Add a follow-up phase if the row cannot point to Catalog `Local Downloads` yet.
- [ ] `Home-Page-Gen1-HLG-22`
- [ ] Home-Page-Gen1-CLG-21 closeout slice.

## [ ] `Home-Page-7 / Phase 1` - `PubParts Library Toggle Boundary And Status Contract`

### Phase 1 Summary

Phase 1 should prep the Home Page toggle/status contract before implementation.

The Worker should read the existing Home Page storage rows, Catalog local-library plan, and Import local source library plan, then add the implementation spec here for Manager approval.

### Phase 1 Implementation Spec

Status: not prepped.

Worker prep should answer:
- where the PubParts Library toggle should appear in the current Home Page control-deck layout
- which owner seam stores enabled/disabled/configured status
- how Home Page can show a scan/found summary without becoming the scanner
- how the row links or points to Catalog `Local Downloads`
- which tests prove disabling the toggle does not delete files or clear Catalog/Import truth
