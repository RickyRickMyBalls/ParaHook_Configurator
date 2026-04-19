# Catalog Gen2 Index

## Doc Header

### Doc History
2. 2026-04-16 12:14:00: Expanded the `Generation 2` wishlist tracking again so external-link intake now distinguishes Dropbox shared-folder links from ZIP-file links, adding explicit tracking items for inspect-first folder intake, staged ZIP inspection, supported-versus-unsupported file classification, and user choice over which supported files to import
1. 2026-04-16 11:55:00: Added this dedicated `Catalog-Gen2-Index.md` planning surface so the newer `Generation 2` catalog direction has one focused home for wishlist tracking around PubParts intake, linked `3D` model entries, platform compatibility normalization, system-level part organization, and pre-built PubWheel onboarding before those lanes split into narrower implementation phases

### Purpose

This file is the focused planning index for `Catalog Generation 2`.

Use it to answer:
- what `Generation 2` of `Catalog` is supposed to add beyond the repo-backed `Generation 1` baseline
- which `Generation 2` wishlist items are currently worth tracking
- how those wishlist items cluster into coherent `Generation 2` lanes
- what later standalone `Generation 2` docs should branch into first

### Scope

This doc covers:
- curated external catalog integration
- linked `3D` model entries and linked archive intake direction
- PubParts normalization into the ParaHook catalog shape
- platform and fitment normalization for platform parts
- system-level part organization for `Generation 2`
- pre-built PubWheel starting assembly onboarding
- wishlist tracking for those `Generation 2` lanes

This doc does not cover:
- the full `Generation 3` compatibility-check runtime
- the later `Ricky Checker` rules engine
- the later `Generation 3.5` dimensional fit math
- one final implementation sequence for every `Generation 2` lane

## Doc Body

### Short Version

`Catalog Generation 2` is where ParaHook should widen from a repo-backed asset library into a richer curated part system.

The main additions are:
- curated external catalog intake, starting with `pubparts.xyz`
- linked `3D` model entries and linked archive handoff
- stronger platform compatibility normalization
- higher-level part-system organization beyond one flat platform list
- pre-built PubWheel starting assembly entries

This doc exists mainly to track those wishes cleanly before they turn into narrower phase docs.

### Why This Doc Exists

`Catalog-Vision.md` now has a real `Generation 2` direction.

That is useful as architecture truth, but it is too broad to serve as the working wishlist map for the next catalog widening lane.

`Catalog-Index.md` also still carries the earlier `Catalog-1` through `Catalog-5` ladder, which is useful family history, but it is not the best surface for the newer `Generation 2` shape that now includes:
- PubParts intake
- external-linked catalog items
- broader platform compatibility truth
- `Platform` versus `Wheel` organization
- pre-built PubWheel assemblies

This doc exists to give those `Generation 2` wishes one explicit tracking home.

### Generation 2 Summary

`Generation 2` should make `Catalog` able to:
- intake curated external catalog sources
- normalize external item truth into the ParaHook catalog contract
- represent linked model pages and linked archives honestly
- widen platform compatibility metadata beyond the simpler `Generation 1` read
- organize parts by the system they really belong to
- carry pre-built PubWheel starting assemblies as starting configurations

Important rule:
- `Generation 2` should still stay metadata-first and curation-first
- it should not jump ahead into pretending it already has the full `Generation 3` compatibility checker

## Wishlist Tracking

Use the `Generation 2` lanes to organize the current wishlist like this:

### `Catalog-Gen2-1` - External Catalog Source Intake
  - [ ] `G2-1. PubParts Source Adapter`
  - [ ] `G2-2. Curated External Catalog Entries`
  - [ ] `G2-3. Source Kind Metadata`
  - [ ] `G2-4. Source Site And Source Collection Labels`
  - [ ] `G2-5. External Item Page URL Support`
  #### - lane target:
    - ingest `pubparts.xyz` into the ParaHook catalog shape
    - keep external source identity explicit
    - avoid mirroring the PubParts website layout as ParaHook runtime truth

### `Catalog-Gen2-2` - Linked Models And Archive Handoff
  - [ ] `G2-6. Linked 3D Model Entries`
  - [ ] `G2-7. Linked Archive URL Metadata`
  - [ ] `G2-8. Dropbox Shared Folder Intake`
  - [ ] `G2-9. Dropbox ZIP Intake`
  - [ ] `G2-10. User-Triggered Archive Download`
  - [ ] `G2-11. Archive Extraction Handoff`
  - [ ] `G2-12. Supported Versus Unsupported File Classification`
  - [ ] `G2-13. Import-Only-When-Supported`
  - [ ] `G2-14. User Choice Of Which Supported Files To Import`
  #### - lane target:
    - allow item entries whose source is a link instead of only a repo-local asset path
    - support later Dropbox ZIP style handoff honestly
    - distinguish inspect-first shared-folder intake from staged ZIP intake
    - keep `open source`, `download`, `import`, and `add to project` as distinct actions

### `Catalog-Gen2-3` - Platform And Fitment Normalization
  - [ ] `G2-15. Canonical Platform Families`
  - [ ] `G2-16. Floatwheel To ADV Mapping`
  - [ ] `G2-17. GT Family Versus GTS Fitment Rules`
  - [ ] `G2-18. XR Classic As Its Own Platform`
  - [ ] `G2-19. Sub-Platform Tags`
  - [ ] `G2-20. Cross-Platform Compatibility Tags`
  - [ ] `G2-21. Narrow Component Fitment Notes`
  #### - lane target:
    - normalize platform truth for `ADV`, `GT`, `Pint`, `XR`, and `XR Classic`
    - keep `GT` as the broad family while allowing narrower `GTS`-specific fitment where needed
    - let one part be compatible with more than one platform family when that is actually true

### `Catalog-Gen2-4` - System-Level Part Organization
  - [ ] `G2-22. Platform Versus Wheel Organizer`
  - [ ] `G2-23. Platform-Owned Part Types`
  - [ ] `G2-24. Wheel-Owned Part Types`
  - [ ] `G2-25. Later Power Organizer`
  - [ ] `G2-26. Later Fasteners Organizer`
  #### - lane target:
    - organize parts by real fitment domain instead of flattening everything into one platform bucket
    - keep `motors` and `tires` out of fake single-platform ownership when they really cross board families
    - leave room for later `Power` and `Fasteners` growth without forcing them into the wrong lane

### `Catalog-Gen2-5` - Pre-Built PubWheel Starting Assemblies
  - [ ] `G2-27. Pre-Built PubWheel Entries`
  - [ ] `G2-28. ADV Starting Assembly`
  - [ ] `G2-29. GT Starting Assembly`
  - [ ] `G2-30. Pint Starting Assembly`
  - [ ] `G2-31. XR Starting Assembly`
  - [ ] `G2-32. XR Classic Starting Assembly`
  - [ ] `G2-33. Load Into Model As Starting Configuration`
  #### - lane target:
    - let the catalog carry full starting PubWheel assemblies in addition to loose parts
    - keep those entries honest as starting assemblies, not only reference parts

### `Catalog-Gen2-6` - Metadata Groundwork For Later Builder And Compatibility
  - [ ] `G2-34. Part-To-Part Allowed Metadata`
  - [ ] `G2-35. Builder-Slot-Friendly Item Fields`
  - [ ] `G2-36. Sub-Assembly Metadata`
  - [ ] `G2-37. Rear Box Supporting-Part Metadata`
  #### - lane target:
    - lay the metadata groundwork that later `Generation 3` builder and compatibility work will depend on
    - stop at metadata and curation truth instead of trying to ship the whole checker here

## Lane Reads

## [ ] Catalog-Gen2-1 - External Catalog Source Intake

### Purpose

Bring curated third-party catalog sources into ParaHook `Catalog` without letting those sources define the ParaHook runtime contract.

### Owns

- source-adapter direction for `pubparts.xyz`
- external-source metadata
- source attribution and source-label truth
- the rule that external entries should normalize into ParaHook catalog items

### Does Not Own

- full archive extraction or import runtime by itself
- the later compatibility checker
- one generic web-search lane

## [ ] Catalog-Gen2-2 - Linked Models And Archive Handoff

### Purpose

Let `Generation 2` entries point at linked models or linked archives honestly, while keeping the user actions explicit and downstream ownership clean.

### Owns

- linked model URLs
- linked archive URLs
- Dropbox shared-folder intake direction
- Dropbox ZIP intake direction
- user-triggered download direction
- extraction and import handoff direction
- staged supported-versus-unsupported file classification
- user choice over which supported files to import

### Does Not Own

- generic auto-import of arbitrary internet URLs
- final Browser ownership logic for every imported asset
- later compatibility proof behavior

## [ ] Catalog-Gen2-3 - Platform And Fitment Normalization

### Purpose

Define the wider platform compatibility truth needed for `Generation 2` so catalog metadata can stop reading as one oversimplified platform list.

### Owns

- canonical platform families
- `ADV`, `GT`, `Pint`, `XR`, and `XR Classic`
- `Floatwheel` to `ADV` mapping
- `GT` as the broad family with narrower `GTS` fitment where needed
- sub-platform tags
- cross-platform compatibility metadata

### Does Not Own

- the later true/false checker itself
- final dimensional fit proof
- every later builder rule

## [ ] Catalog-Gen2-4 - System-Level Part Organization

### Purpose

Organize `Generation 2` parts by the system they actually belong to instead of making every part pretend to be owned by only one board platform.

### Owns

- `Platform` versus `Wheel` as the first explicit systems
- platform-owned part examples such as rails, boxes, bumpers, footpads, and often axle blocks
- wheel-owned part examples such as motors and tires
- the rule that later `Power` and `Fasteners` lanes may branch cleanly from the same organizer

### Does Not Own

- one final repo folder layout
- the later full builder slot model
- compatibility proof logic beyond metadata truth

## [ ] Catalog-Gen2-5 - Pre-Built PubWheel Starting Assemblies

### Purpose

Add full PubWheel starting assemblies to the catalog so the user can begin from a known PubWheel configuration instead of only loose parts.

### Owns

- pre-built PubWheel entries
- one starting PubWheel assembly per main platform family
- the rule that these should load into the model as starting configurations

### Does Not Own

- the later builder flow
- the later compatibility checker
- every later recall or rebinding rule

## [ ] Catalog-Gen2-6 - Metadata Groundwork For Later Builder And Compatibility

### Purpose

Prepare the metadata truth that later `Generation 3` builder and checker work will need, without trying to ship those runtime features inside `Generation 2`.

### Owns

- part-to-part allowed metadata direction
- builder-slot-friendly metadata
- sub-assembly metadata
- rear-box supporting-part metadata

### Does Not Own

- the `Ricky Checker`
- later dimensional fit math
- the full `PubWheel Builder` runtime

### Summary

The `Generation 2` wishlist direction is now:
- intake curated external sources such as `pubparts.xyz`
- support linked models and linked archives honestly
- normalize platform and fitment truth for real platform part families
- organize parts by real systems such as `Platform` and `Wheel`
- onboard pre-built PubWheel assemblies as starting configurations
- prepare the metadata groundwork that `Generation 3` compatibility and builder work will later depend on
