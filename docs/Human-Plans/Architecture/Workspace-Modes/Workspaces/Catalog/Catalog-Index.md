# Catalog Index

## Doc Header

### Doc History
15. 2026-04-17 23:36:00: Added the first standalone `Catalog-2` future planning doc under `Future/`, linking the family index to a real implementation-ready reference-family plan that compresses the existing `Catalog-2` lane from this index plus the broader `Catalog-Vision.md` `Generation 1` direction into one small phase ladder for onboarding `foothooks`, `shoes`, and `footpads` as real optional curated families
14. 2026-04-17 22:12:06: Folded the newer Catalog preview-session direction into this `Generation 1` umbrella, reframing preview as empty card preview boxes plus explicit user-triggered preview loading instead of only a separate preview viewport, adding the new preview-loaded session-list and unload-control wishlist items, and tightening the `Catalog-1` planning read so the foundation lane now explicitly owns in-card preview loading, multi-select preview loading, restore-on-reopen within the running session, and unload controls without widening into project recall
13. 2026-04-17 18:13:42: Added a dedicated `Generation 1 Vision` section so this index now acts as the more specific Gen 1 planning umbrella under the broader `Catalog-Vision.md`, tying the detailed `Catalog-1` through `Catalog-5` phase ladder back to one explicit Gen 1 browse, preview, commit, HDRI, metadata, and recall direction
12. 2026-04-16 17:10:00: Tightened the `Catalog` family read again so `Generation 0` now explicitly includes moving the preloaded reference models out of `Browser`, clarifying that `foothooks`, `shoes`, and `footpads` should stop appearing as default Browser-resident content during cleanup and should instead arrive later as optional add-in families the user can choose
11. 2026-04-16 16:55:23: Reframed the `Catalog` family index so it now stays honest that the family has not started yet, adding the new `Catalog-Gen0-Index.md` planning surface for cleanup-and-prep work before the first real family phase, clarifying that `Catalog-1` through `Catalog-5` now read as the planned `Generation 1` ladder rather than the current state, and preserving `Catalog-Gen2-Index.md` as the later widening surface
10. 2026-04-16 12:31:00: Expanded the early `Catalog` family read to include an `Imports` area for previously uploaded items already known to ParaHook, clarifying that this belongs in the early catalog baseline as a reuse surface while import intake itself still belongs to the separate import system, and adding a matching wishlist-tracking item under the earlier `Catalog-1` lane
9. 2026-04-16 12:23:00: Updated the main `Catalog` family index now that explicit catalog generations exist, adding the new `Catalog-Gen2-Index.md` planning surface to the family structure and clarifying that the older `Catalog-1` through `Catalog-5` ladder remains useful as the earlier family or foundation lane while the newer `Generation 2` widening work has its own focused tracking surface
8. 2026-04-16 00:08:43: Expanded the Catalog filter-system direction again by adding a higher-level `System` organizer above platform-specific filtering, documenting that Onewheel parts should first be grouped into `Platform`, `Wheel`, and later `Hardware`, and clarifying that wheel-side items such as motors and tires may use type-specific fitment metadata instead of always depending on platform compatibility tags
7. 2026-04-15 23:57:42: Added the first explicit Onewheel-part filter section to the `Catalog` family index, documenting the structured filter direction for platform compatibility, part type, product name, and mount position, and locking the first filter groups around `ADV`, `XR`, `GT`, `Other`, plus `Footpads`, `Bumpers`, `Rails`, `Motors`, and the `Other` sub-sections `FootHolds`, `Shoes`, and `Screw & Nuts`
6. 2026-04-15 23:46:59: Expanded the `## Wishlist Tracking` section so it now mirrors the full dedicated `Wish-Features/Catalog/Catalog.md` item list instead of only summarizing phase themes, mapping every current Catalog wishlist item into the `Catalog-1` through `Catalog-5` ladder so those wishes can be tracked against the phase where they are expected to land
5. 2026-04-15 23:25:36: Expanded the `Catalog` family docs around the new reference-workflow product shape by linking a dedicated `Wish-Features/Catalog/Catalog.md` wishlist surface, updating the family summary with the `Load Preview` versus `Add To Project` behavior for preloaded `foothooks`, `shoes`, and `footpads`, and adding a phase-mapping read so those wishlist items can be organized against the `Catalog` phase ladder
4. 2026-04-15 22:03:14: Tightened the `Catalog` family read so it now explicitly treats `Catalog` as its own workspace mode or surface inside the shared workspace model, locking the first tiled proof as `split a model viewport, then switch the new non-primary pane to Catalog` instead of leaving the catalog readable as a sidecar shell
3. 2026-04-15 20:43:11: Reworked the `Catalog` family ladder so `Catalog-1` through `Catalog-5` now each render as their own top-level `##` phase sections in the same style used by stronger workspace-family indexes such as `Browser-Index.md`, replacing the earlier compact bullet ladder with clearer per-phase ownership reads and follow-on boundaries
2. 2026-04-15 20:24:35: Added the first standalone future phase doc `Future/Catalog_Phase Catalog-1 - Workspace Foundation And Catalog Contract.md`, tightened the family ladder so the opening `Catalog` cut now explicitly focuses on workspace onboarding plus the catalog-item contract before asset-family widening, and recorded the clean-file rule that later reference and HDRI work should branch from that foundation instead of bloating existing shell or Browser files
1. 2026-04-15 20:24:35: Added this folderized `Catalog` workspace-family home and defined the first umbrella direction for a curated repo-backed asset workspace where users can browse and load reusable families such as hooks, shoes, footpads, HDRIs, and later other reference or preset types without blurring Browser/project ownership

### Purpose

This file is the umbrella planning index for the `Catalog` family under `Workspace Modes`.

Use it to answer:
- what the `Catalog` workspace should own
- what kinds of repo-backed reusable assets should belong there first
- how `Catalog` should differ from `Browser`, import, and viewer-only toggles
- what the visible catalog surface should look like
- what future standalone `Catalog` docs should branch into
- where the current `Generation 0` planning surface lives
- where the newer `Generation 2` planning surface lives

### Scope

This doc covers:
- the user-facing `Catalog` workspace surface
- repo-backed reusable asset browsing
- category/filter/preview direction
- explicit load/apply behavior by asset type
- likely first phase split for the catalog family

This doc does not cover:
- the final implementation of every asset loader
- detailed Browser/content persistence rules
- the final viewer HDRI runtime by itself
- all possible future reusable asset families

### Family Structure

Use this folder like this:

- `Catalog-Vision.md`
  - north-star product and ownership direction
- `Catalog-Index.md`
  - umbrella planning index
  - family summary
  - future routing surface
- `Catalog-Gen0-Index.md`
  - focused cleanup-and-prep surface for the current `Generation 0`
  - useful for drift inventory, ownership cleanup, metadata prep, and locking the `Generation 1` start boundary
- `Catalog-Gen2-Index.md`
  - focused wishlist and lane-tracking surface for `Generation 2`
  - useful for PubParts intake, linked-model intake, platform normalization, system organization, and pre-built board onboarding
- `docs/Human-Plans/Wish-Features/Catalog/Catalog.md`
  - broader product-shape and follow-on wishlist surface
  - phase-mapping home for larger `Catalog` wishes
- `Future/`
  - standalone implementation-ready `Catalog` phase docs
- `Shipped/`
  - shipped records for completed `Catalog` cuts

## Doc Body

### Short Version

ParaHook should gain one real `Catalog` workspace where the user can browse reusable assets stored in the repo and load them intentionally.

The family is still in `Generation 0` today because the real `Catalog` family has not started yet.

The immediate `Generation 0` cleanup read is:
- move the preloaded reference models out of `Browser`
- stop starting the user with browser-resident `foothooks`, `shoes`, and `footpads`
- let those reference families become later optional add-ins instead

The first intended catalog families are:
- foothooks
- shoes
- footpads
- HDRIs
- an `Imports` area for user-uploaded items already inside ParaHook
- other later reusable reference families

That workspace should:
- act as its own real workspace mode or surface
- feel like a curated internal library
- expose categories, previews, and details
- make load/apply actions explicit
- let the user find imported items they already uploaded so they can place another one after deleting it from the model
- let the user keep the model visible by splitting the model viewport and turning the new non-primary pane into `Catalog`
- let the user start from empty card preview boxes and explicitly `Load Preview` into those card boxes before commit
- let the user preview more than one selected card at a time and keep those temporary previews in a Catalog-owned session list during the running app session
- let the user unload preview items from that session list when performance starts to dip
- let the user choose `Add To Project` when the selected reference should become Browser/project truth
- stay honest about what happens after load:
  - references become project/content truth
  - HDRIs become explicit environment/viewer state
  - later types use their own downstream owner seams

It should feel like a real reusable-asset workspace, not a one-off file picker or hidden debug menu.

Important current planning read:
- this main index still works as the umbrella family home
- the current prep and cleanup work belongs in `Catalog-Gen0-Index.md`
- the current `Generation 0` prep should explicitly remove the old Browser-resident preloaded reference-model baseline
- the older `Catalog-1` through `Catalog-5` ladder now reads as the planned `Generation 1` family or foundation lane, not the current state
- the newer widening work that now belongs to explicit `Generation 2` should be tracked in `Catalog-Gen2-Index.md` instead of being forced into the older phase ladder

### Generation 1 Vision

Use this section as the more specific `Generation 1` read for the `Catalog` family.

`Catalog-Vision.md` stays the kickoff idea and broad family north star.

This index should now carry the more detailed `Generation 1` vision that the `Catalog-1` through `Catalog-5` ladder is expected to deliver.

The healthy `Generation 1` read is:
- ParaHook gains one real repo-backed `Catalog` workspace after the `Generation 0` cleanup is complete
- the user can browse a lightweight card-grid catalog instead of inheriting preloaded reference content in `Browser`
- `foothooks`, `shoes`, and `footpads` return only as intentional optional catalog families instead of default Browser-resident content
- `Catalog` also includes an `Imports` area for items ParaHook already knows about after import intake, so the user can place another copy later without making `Catalog` the import owner
- the main browse flow is preview-first and store-like rather than auto-loaded or filesystem-like
- the user can open an item page that acts as the main decision surface for a selected entry
- the card grid should expose one empty preview box per item so visual preview remains available without auto-loading repo-backed content
- clicking a preview box or triggering `Load Preview` should load temporary preview state only for the chosen item or selected items
- `Load Preview` stays temporary and separate from `Add To Project`
- multiple temporary previews may remain open when the user wants to compare items
- Catalog may keep a preview-loaded item list during the running session so closing and reopening the surface restores those temporary previews
- preview-loaded items should be unloadable from that list without affecting project truth
- `Add To Project` makes the chosen reference become explicit Browser or project truth instead of leaving it catalog-local
- `HDRIs` remain in the catalog, but keep their own explicit viewer or environment apply path instead of pretending to be geometry content
- the catalog grows through stronger tags, metadata, search, and richer reference notes without reopening the earlier ownership split
- later `Generation 1` follow-through keeps catalog item identity and recall honest after load without turning `Catalog` into the hidden runtime owner

What this `Generation 1` vision should feel like:
- a real split-pane workspace surface, not a Browser subsection or one-off overlay
- a curated internal library, not raw folder walking or arbitrary internet intake
- a clean `1x1` card-grid browse surface with no auto-loaded previews
- empty card preview boxes that stay lightweight until the user explicitly loads temporary preview state
- explicit item-family sections for the first reference families plus `HDRIs`
- one larger item page whose primary responsibilities are the larger preview surface, the description, and the honest action for that asset type
- a preview flow that supports comparison without silently committing content
- a small preview-session manager inside Catalog so the user can see what is currently preview-loaded and unload those temporary items when needed
- a commit flow that hands the selected result into the correct downstream owner

What this `Generation 1` vision should not require yet:
- curated external-source intake such as `pubparts.xyz`
- linked-model or linked-archive entries as first-class catalog items
- the richer `Platform` versus `Wheel` versus later `Power` and `Fasteners` organization as required baseline scope
- the later pre-built board catalog lane
- the `Ricky Checker`, the later `Onewheel Builder`, or dimensional fit math

The detailed `Generation 1` ladder should be read like this:

- `Catalog-1`
  - foundation and workspace onboarding
  - the first catalog-item contract
  - the first visible shell direction
  - the card-grid, `Imports`, preview-versus-commit, and item-page baseline
- `Catalog-2`
  - the first real reference-family onboarding for `foothooks`, `shoes`, and `footpads`
  - explicit preview and `Add To Project` behavior for those reference families
- `Catalog-3`
  - `HDRI` onboarding through an explicit environment apply path that stays separate from reference loading
- `Catalog-4`
  - richer search, tags, metadata, better reference notes, and catalog scale-up
- `Catalog-5`
  - recall, rebind, item identity follow-through, and later comparison or remembered-catalog behavior where it is actually needed

Important rule:
- this `Generation 1` vision is the detailed family umbrella for the early catalog
- later docs should implement against this ladder without quietly pulling `Generation 2` widening into the baseline

Important boundary rule:
- if a question is about the broad catalog family, use `Catalog-Vision.md`
- if a question is about what `Generation 1` is supposed to deliver through the detailed phase ladder, use this index
- if a question is about the current cleanup band before the family starts, use `Catalog-Gen0-Index.md`
- if a question is about the later widening lane, use `Catalog-Gen2-Index.md`

### Why This Doc Exists

The repo now has a clear need for reusable stored assets that users should be able to bring into the app without re-importing everything manually each time.

But there is not yet one dedicated architecture-family doc for the visible user-facing `Catalog` surface.

This doc exists to define:
- what the visible catalog workspace should be
- what categories it should start with
- how browse/preview/load should be organized
- how the catalog should stay cleanly separated from Browser/project truth and viewer ownership

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Catalog`
  - browse repo-backed reusable assets
  - surface previously imported items for reuse after intake
  - show categories, tags, previews, and item details
  - trigger explicit load/apply actions
- `Browser`
  - own project/content truth after a reference asset is loaded
- `Model Viewport`
  - display loaded geometry or environment changes
- environment/view settings
  - own active HDRI or later viewer-environment state
- import/user-file systems
  - own arbitrary user-imported file intake

Important rule:
- do not let the catalog workspace become the hidden owner of loaded content or viewer state after the user has already chosen the asset
- showing already-imported items in `Catalog` is acceptable as a reuse surface
- but the original import intake flow should still remain import-system-owned

### Core Direction

The first real `Catalog` surface should be a dedicated workspace for reusable repo-backed assets.

Expected first-pass responsibilities:
- open a visible catalog workspace
- behave like a true workspace-mode target when a non-primary split pane changes surface kind
- organize entries into useful asset families
- show an `Imports` area for user-uploaded items that ParaHook already knows about
- show one empty preview box per card and let the user explicitly load temporary previews into those boxes
- keep a temporary preview-loaded item list inside Catalog during the running session
- show enough metadata to understand the item
- let the user load/apply it explicitly

This should feel closer to:
- reusable asset browsing
- curated selection
- explicit load/apply

than to:
- ad hoc filesystem browsing
- one hidden asset registry
- a product-specific narrow picker that cannot grow

### Asset Classes

The first catalog families should include:
- foothooks
- shoes
- footpads
- HDRIs

Later families may include:
- reusable reference objects
- reusable assemblies
- material starter packs
- environment packs
- graph/document templates

Important rule:
- the family index should keep naming the first real asset classes explicitly
- but the architecture should stay generic enough to onboard later reusable families without replacing the workspace concept

### Data Direction

The catalog should eventually read from one explicit curated item list rather than relying only on raw folder walking.

Good first metadata fields:
- stable item id
- display label
- family/category
- tags
- description
- preview image or thumbnail
- source asset path
- asset type
- load/apply action kind
- platform compatibility
- part type
- product name
- mount position when relevant

Important rule:
- prefer one explicit manifest-style catalog source over scattered UI-level filename rules

### Filter System Direction

The first Onewheel-oriented filter system should use structured metadata fields instead of guessing from display labels.

Suggested first metadata shape:
- `system`
  - higher-level grouping such as `Platform`, `Wheel`, or later `Hardware`
- `platformTags`
  - multi-value compatibility tags
- `partType`
  - one explicit part-type value
- `productName`
  - the actual part or product name
- `position`
  - front/rear/pair/universal when relevant

The first high-level organizer should be:
- `Platform`
- `Wheel`
- later `Hardware`

Recommended first platform filter group:
- `ADV`
- `XR`
- `GT`
- `Other`

Important rule:
- a part can belong to multiple platform filters
- `platformTags` should therefore support multiple values

Recommended first part-type filter group:
- `Footpads`
- `Bumpers`
- `Rails`
- `Motors`
- `Tires`

Under the broader `Other` branch, the first sub-sections should include:
- `FootHolds`
- `Shoes`
- `Screw & Nuts`

Useful first grouping read:
- `Platform`
  - `Footpads`
  - `Bumpers`
  - `Rails`
- `Wheel`
  - `Motors`
  - `Tires`
- later `Hardware`
  - `FootHolds`
  - `Shoes`
  - `Screw & Nuts`

Important rule:
- `Platform Compatibility` should be a filter group, not the only top-level organizer
- wheel-side items are real parts too, but they are not always best described first by board platform

Suggested filter behavior:
- multi-select inside one filter group
- `OR` within the same group
- `AND` across different groups

Suggested filter grouping order:
1. `System`
2. `Part Type`
3. `Platform Compatibility`
4. type-specific spec filters

Examples:
- selecting `XR` and `GT`
  - shows parts compatible with either platform
- selecting `XR` and `Footpads`
  - shows only `XR` parts whose `partType` is `Footpad`

Suggested type-specific filter extensions:
- for `Motors`
  - `Motor Family`
  - `Motor Version`
- for `Tires`
  - `Brand`
  - `Size`
  - `Compound`

Example structured reads:
- `XR_Footpad_Kush-Wide_Front`
  - system:
    - `Platform`
  - platform compatibility:
    - `XR`
  - part type:
    - `Footpad`
  - product name:
    - `Kush Wide`
  - position:
    - `Front`
- `GT_Footpad_Low-Boy_Rear`
  - system:
    - `Platform`
  - platform compatibility:
    - `GT`
  - part type:
    - `Footpad`
  - product name:
    - `Low-Boy`
  - position:
    - `Rear`
- `Motor_Hypercore_6.5-GT`
  - system:
    - `Wheel`
  - platform compatibility:
    - `GT`
  - part type:
    - `Motor`
  - product name:
    - `Hypercore`
  - motor version:
    - `6.5`
- `Motor_Cannoncore_6.0-ADV`
  - system:
    - `Wheel`
  - platform compatibility:
    - `ADV`
  - part type:
    - `Motor`
  - product name:
    - `Cannoncore`
  - motor version:
    - `6.0`
- `Motor_Hypercore_6.0-XR`
  - system:
    - `Wheel`
  - platform compatibility:
    - `XR`
  - part type:
    - `Motor`
  - product name:
    - `Hypercore`
  - motor version:
    - `6.0`
- `Tire_Burris_11.5x7.0_Soft`
  - system:
    - `Wheel`
  - platform compatibility:
    - empty or not required
  - part type:
    - `Tire`
  - product name:
    - `Burris`
  - size:
    - `11.5x7.0`
  - compound:
    - `Soft`
- `Tire_TFL_12.0x6.9_ThunderCat`
  - system:
    - `Wheel`
  - platform compatibility:
    - empty or not required
  - part type:
    - `Tire`
  - product name:
    - `ThunderCat`
  - brand:
    - `TFL`
  - size:
    - `12.0x6.9`

Important rule:
- keep the slug or asset id separate from the curated metadata fields
- the filter system should read structured metadata first, not parse labels as its main source of truth

### Surface Shape

The catalog workspace should feel like a purpose-built browse-and-load surface.

Recommended first visible regions:

#### 1. Categories / Filters

- family list such as:
  - hooks
  - shoes
  - footpads
  - HDRIs
- tags or quick filters
- later search

#### 2. Asset Grid Or List

- thumbnail or preview-first browse surface
- clear item labels
- fast scan of the current category/filter result

#### 3. Details / Preview

- larger preview
- description
- tags
- source notes or dimensions where relevant
- clear asset-type label such as:
  - reference
  - HDRI
  - later preset or template

#### 4. Explicit Action Area

- `Load Preview`
- `Add To Project`
- `Apply HDRI`
- later other honest actions by asset type

Important rule:
- do not hide the action meaning
- the UI should make it clear whether the item will become project content, viewer environment state, or another later explicit result

### Loading Direction

Geometry/reference-like catalog items should:
- render with empty preview boxes by default instead of auto-loading repo-backed previews
- support one temporary preview step first through an explicit in-card preview load
- allow one preview action to target more than one selected card
- keep a Catalog-owned preview-loaded item list during the running session so closing and reopening the surface restores those temporary previews
- let the user unload preview items from that list without affecting project truth
- create explicit project/reference content only after the user commits them
- show up through the normal downstream content systems once committed
- remain inspectable after load outside the catalog itself

HDRI catalog items should:
- remain optional
- apply only when the user explicitly chooses them
- stay clearly classified as environment/viewer state rather than project geometry content

Important rule:
- `load` is not one universal behavior
- keep the user-facing action language honest for each asset type



### Workspace-Modes Direction

`Catalog` should be treated as a real workspace surface inside the broader workspace system.

That means it should be able to live as:
- `Windowed`
- `Tiled`
- later `Pop-Out` if the broader workspace family supports it for this surface type

The first tiled proof should be:
- split the `modelViewer`
- keep the original pane as `modelViewer`
- switch the new non-primary pane to `Catalog`

Important rule:
- do not make `Catalog` a special one-off shell that sits outside the shared workspace model
- do not require the user to close or replace the primary `modelViewer` just to browse the catalog beside it


## Wishlist Tracking

These wishlist mappings should be read as the planned `Generation 1` ladder after the `Generation 0` cleanup-and-prep work is complete.

Use the family phases to organize the dedicated Catalog wishlist items like this:

### `Catalog-1`
  - [ ] `0. Lightweight Card Grid`
  - [ ] `0A. Imports Area For Previously Uploaded Items`
  - [ ] `2. Separate Sections For Reference Families`
  - [ ] `3. Explicit Preview Surfaces`
  - [ ] `3A. No Auto-Loaded Previews`
  - [ ] `3B. Multiple Temporary Previews`
  - [ ] `3C. Preview-Loaded Session List And Restore`
  - [ ] `3D. Preview Unload Controls`
  - [ ] `4. Explicit Add-To-Project Commit`
  - [ ] `5. Honest Preview Versus Commit Ownership`
  - [ ] `6. Preview-Friendly Metadata`
  - [ ] `6A. Item Page As The Main Decision Surface`
  #### - foundation target:
    - make `Catalog` a real workspace mode
    - lock the store-page card language
    - add an `Imports` area for items already uploaded into ParaHook without moving import intake into `Catalog`
    - lock the empty-card-preview plus preview-session baseline
    - lock the preview-versus-commit contract
    - lock the item-page responsibilities
### `Catalog-2`
  - [ ] `1. Move The Current Preloaded References Into Catalog`
  - [ ] `2. Separate Sections For Reference Families`
  - [ ] `3. Explicit Preview Surfaces`
  - [ ] `4. Explicit Add-To-Project Commit`
  - [ ] `6. Preview-Friendly Metadata`
  - [ ] `6A. Item Page As The Main Decision Surface`
  #### - implementation target:
    - onboard `foothooks`, `shoes`, and `footpads` as later optional curated catalog families after `Generation 0` removes the old Browser preload baseline
    - make `Add To Project` create explicit Browser/project content
    - land the first real item pages and preview behavior for those reference families
### `Catalog-3`
  - [ ] `5. Honest Preview Versus Commit Ownership`
  #### - implementation target:
    - onboard `HDRIs` with their own explicit apply path
    - keep HDRI preview or apply behavior honest against the earlier reference workflow
### `Catalog-4`
  - [ ] `6. Preview-Friendly Metadata`
  - [ ] `8. Better Reference Notes`
  - [ ] `9. Curated Packs`
  - [ ] `10. Template-Like Catalog Entries`
  - implementation target:
    - richer search, tags, metadata, and catalog scale-up
### `Catalog-5`
  - [ ] `7. Side-By-Side Preview Compare`
  - [ ] `9. Curated Packs`
  - [ ] `10. Template-Like Catalog Entries`
  - implementation target:
    - item identity follow-through
    - recall and rebind rules
    - later comparison or richer remembered catalog behavior where needed

  
## [x] Catalog-1 - Workspace Foundation And Catalog Contract

### Purpose

Establish `Catalog` as a real workspace family with one explicit catalog-item contract and one clean visible shell direction before any asset-family-specific loading logic widens the implementation.

### Owns

- workspace-surface onboarding for `Catalog`
- the first catalog-item contract and manifest-style source-of-truth direction
- the first shell regions for:
  - categories/filters
  - asset list/grid
  - details/preview
  - explicit action area
- the clean file-boundary rule that later `Catalog` growth should add focused new seams instead of bloating existing Browser, viewer, or shell files

### Does Not Own

- the full onboarding of every hook, shoe, footpad, or HDRI family
- final project recall semantics for loaded catalog items
- the final HDRI runtime by itself

Current source doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog_Phase Catalog-1 - Workspace Foundation And Catalog Contract.md`

## [ ] Catalog-2 - Reference Asset Families And Explicit Load Into Project Content

### Purpose

Onboard the first geometry/reference-style catalog families such as hooks, shoes, footpads, and similar stored parts through honest downstream project/content load behavior after the old Browser-resident preload behavior is gone.

### Owns

- the first real curated reference asset families in the catalog
- onboarding `foothooks`, `shoes`, and `footpads` as later optional curated families instead of default Browser-resident content
- explicit asset metadata needed to browse and distinguish those families
- honest preview-plus-commit behavior where `Load Preview` is temporary and `Add To Project` makes the chosen asset become explicit project/reference content
- the rule that loaded reference items should become visible through normal downstream content systems instead of staying catalog-local

### Does Not Own

- HDRI/environment apply behavior
- search/scale-up polish beyond what the first reference families strictly need
- final persistence or project-recall rules for every catalog-loaded reference

Current source doc:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog_Phase Catalog-2 - Reference Asset Families And Explicit Load Into Project Content.md`

## [ ] Catalog-3 - HDRI Catalog And Explicit Environment Apply Path

### Purpose

Add HDRIs as a dedicated catalog family with their own explicit environment application path instead of forcing them through the same loading semantics as geometry/reference assets.

### Owns

- HDRI item classification in the catalog
- HDRI-specific previews and metadata where needed
- explicit `apply HDRI` behavior
- the rule that HDRIs remain optional viewer/environment state rather than project geometry content

### Does Not Own

- the earlier geometry/reference-family loading path
- broader search and metadata scale-up work unless the HDRI family truly needs a small extension
- later project recall/history policy for all applied HDRIs

## [ ] Catalog-4 - Search, Tags, Metadata, And Catalog Scale-Up

### Purpose

Widen the catalog from a first curated library into a more scalable reusable-asset workspace with stronger browse/filter/search ergonomics and richer metadata support.

### Owns

- richer tag/filter support
- search behavior
- stronger metadata reads
- the first scale-up rules for larger asset-family counts
- keeping the browse experience usable as the catalog grows beyond the first few families

### Does Not Own

- the original workspace-foundation contract
- the first reference-family or HDRI onboarding cuts themselves
- the final project/session identity follow-through after assets are loaded

## [ ] Catalog-5 - Project Recall And Catalog Item Identity Follow-Through

### Purpose

Decide how loaded catalog items should be remembered or referenced across project/session truth without making the catalog itself the hidden long-term owner of those results.

### Owns

- catalog-item identity follow-through after load
- the relationship between stored catalog ids and downstream project or viewer state
- recall/rebind rules where they are needed
- keeping the owner split honest while still letting projects remember which curated asset was chosen

### Does Not Own

- the original workspace-surface onboarding
- the first reference-family load path
- the first HDRI apply path
- generic search and browse scale-up that belongs in `Catalog-4`

### Summary

The umbrella direction is now:
- the `Catalog` family is still in `Generation 0` cleanup and prep today because the first real family phase has not started yet
- `Catalog-Gen0-Index.md` is the focused planning surface for that prep-only work
- `Generation 0` should move the preloaded reference models out of `Browser` so the user no longer starts with shoes, footpads, and foothooks as implied default content
- ParaHook should have one real `Catalog` workspace for repo-backed reusable assets
- the early baseline may also include an `Imports` area for user-uploaded items already known to ParaHook
- the first named families should still include hooks, shoes, footpads, HDRIs, and later similar reusable stored assets, but those reference families should arrive later as explicit optional add-ins
- the surface should support categories, previews, details, and explicit load/apply actions
- the catalog should stay distinct from Browser/project truth, user import, and viewer-owned environment state even when those downstream systems consume catalog items after the user chooses them
- the first actual implementation lane should still start with workspace foundation plus the catalog-item contract, but that now reads as the beginning of `Generation 1` after the `Generation 0` cleanup-and-prep work is complete
