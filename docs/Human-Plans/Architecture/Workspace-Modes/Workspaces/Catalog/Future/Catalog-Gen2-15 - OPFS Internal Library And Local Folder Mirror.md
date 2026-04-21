# Catalog-Gen2-15 - OPFS Internal Library And Local Folder Mirror

## Doc Header

### Doc History
1. 2026-04-21 11:55:57: Created this `Catalog-Gen2-15` Family Phase Doc to plan the OPFS-backed ParaHook Internal Library as the default PubParts source cache and the optional user-selected Local Library folder as a visible filesystem mirror.

### Purpose

This file owns the next PubParts source-library direction after the browser-honest ZIP staged importer and accepted-reference rehydration closeouts.

Use it to answer:
- how OPFS should become ParaHook's default Internal Library for PubParts source files
- how cached source bytes, extracted files, manifests, and inspection results should relate to `Add To Project`
- how a user-selected Local Library folder should mirror files for visibility without becoming required
- what Dropbox/CORS/API/helper behavior remains separate from storage

Do not use it for:
- bypassing browser sandbox rules
- silently writing to arbitrary local disk folders
- eager downloading every PubParts ZIP/archive
- replacing Import review or project asset ownership
- STEP loader fidelity, `.stp` support, builder behavior, or compatibility verdicts

## Doc Body

### Family Phase Goal

Make PubParts `Add To Project` feel like an app-managed source library while staying browser-honest.

The default experience should not require the user to choose a local folder every time. ParaHook should use OPFS as an Internal Library where it can persist source files after explicit user action:

```text
Internal Library/
  PubParts/
    parts/
      <catalog-item-slug>/
        pubparts-source.json
        source/
        archives/
        extracted/
        importable/
        inspections/
```

The optional experience should let the user pick a real filesystem folder once, then mirror PubParts source and extracted files there when permission is available:

```text
<UserSelectedRoot>/PubParts/
  parts/
    <catalog-item-slug>/
      pubparts-source.json
      source/
      downloads/
      extracted/
      importable/
```

### Ownership Boundary

Catalog owns:
- source identity, item identity, source-options status, and user-facing `Add To Project` flow
- deciding whether a PubParts source is cached, inspected, extracted, ready for Import review, mirrored, or permission-blocked
- showing Internal Library and Local Library state without making either one project truth

The OPFS/Internal Library owner seam owns:
- capability detection
- directory and manifest convention
- reading/writing cached source bytes and extracted files
- invalidating cached results when the source URL or freshness metadata changes
- exposing cache state to Catalog and Import handoff code

The Local Library mirror owner seam owns:
- directory picker setup
- permission/reconnect state
- mirroring OPFS-managed files into the user-selected visible folder
- open-folder affordances where browser support allows them

Import owns:
- staged Import review
- accepted file type validation
- project/imported-reference creation
- final accepted asset ownership

Later helper/API/native owners own:
- Dropbox-blocked remote-byte fetching
- shared-folder listing
- direct native downloads into a real folder

### Important Constraint

OPFS does not solve Dropbox access by itself.

It solves this question:

```text
Once ParaHook has source bytes, where can it store, inspect, and reuse them without prompting every time?
```

It does not solve this question:

```text
Can ParaHook fetch or list this PubParts Dropbox source from the browser?
```

If browser fetch is blocked, the source bytes must come from `Open Source` / `Choose Local ZIP`, a helper/API materializer, or a later native downloader before OPFS can cache them.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-19. make PubParts Add To Project feel like an app-managed parts library by using OPFS as ParaHook's default Internal Library for cached source bytes, extracted files, manifests, and inspection results, with an optional one-time user-selected Local Library folder mirror for visible files`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-35. Add an OPFS-backed Internal Library owner for PubParts source bytes, ZIPs, extracted candidates, source manifests, and inspection results that only caches files after an explicit user action.
- [ ] Catalog-Gen2-CLG-36. Add an optional user-selected Local Library folder mirror that can copy OPFS-managed PubParts source/extracted/importable files into a visible filesystem folder when permission is available.

### `Catalog-Gen2-15 / Phase 1`

- [ ] Define the OPFS owner seam and browser capability read.
- [ ] Define the PubParts Internal Library directory convention.
- [ ] Define the cache manifest shape for provider id, Catalog item id, source URL, source freshness, source file name, byte size, inspection state, extracted candidates, and import handoff state.
- [ ] Define unavailable and storage-quota states.
- [ ] Keep ZIP extraction, Import accept, folder mirror, and remote-byte helper behavior out of Phase 1 unless needed for a tiny proof.
- [ ] `Catalog-Gen2-HLG-19`
- [ ] Catalog-Gen2-CLG-35 boundary slice.

### `Catalog-Gen2-15 / Phase 2`

- [ ] Persist explicitly user-acted PubParts source bytes into OPFS.
- [ ] Persist extracted supported candidates and inspection results.
- [ ] Reopen source options from Internal Library cache when the source URL/freshness still matches.
- [ ] Invalidate stale cache entries when PubParts source metadata changes.
- [ ] Keep eager all-PubParts download out of scope.
- [ ] `Catalog-Gen2-HLG-19`
- [ ] Catalog-Gen2-CLG-35 cache slice.

### `Catalog-Gen2-15 / Phase 3`

- [ ] Add optional Local Library folder setup.
- [ ] Mirror OPFS-managed source/extracted/importable files into the selected visible folder when permission is available.
- [ ] Show permission-needed, reconnect, enabled, disabled, unavailable, and mirrored/not-mirrored states.
- [ ] Keep Internal Library as the default source of app-managed cached state.
- [ ] `Catalog-Gen2-HLG-19`
- [ ] Catalog-Gen2-CLG-36 folder mirror slice.

## [ ] `Catalog-Gen2-15 / Phase 1` - `OPFS Capability And Internal Library Boundary`

### Phase 1 Summary

Plan and introduce the Internal Library boundary before storing PubParts source bytes.

### Phase 1 Implementation Spec

Status: planned.

Implementation should start by researching existing persistence/storage owner seams, then add the smallest OPFS capability and manifest owner that can be tested without changing the current PubParts ZIP staged importer behavior.

Acceptance:
- OPFS capability is checked through a small owner seam rather than directly in Catalog components.
- PubParts Internal Library path/manifest conventions are documented in code or tests.
- Browser unavailable/quota/error states are representable.
- Current `Add To Project`, source-options, local ZIP fallback, Import review, and viewer rehydration behavior remain unchanged.
- Focused owner tests plus the current Catalog source-options tests pass.
