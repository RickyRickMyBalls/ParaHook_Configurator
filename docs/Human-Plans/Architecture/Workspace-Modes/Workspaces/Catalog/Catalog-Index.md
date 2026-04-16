# Catalog Index

## Doc Header

### Doc History
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

The first intended catalog families are:
- foothooks
- shoes
- footpads
- HDRIs
- other later reusable reference families

That workspace should:
- act as its own real workspace mode or surface
- feel like a curated internal library
- expose categories, previews, and details
- make load/apply actions explicit
- let the user keep the model visible by splitting the model viewport and turning the new non-primary pane into `Catalog`
- let the user `Load Preview` into a separate preview viewport before commit
- let the user choose `Add To Project` when the selected reference should become Browser/project truth
- stay honest about what happens after load:
  - references become project/content truth
  - HDRIs become explicit environment/viewer state
  - later types use their own downstream owner seams

It should feel like a real reusable-asset workspace, not a one-off file picker or hidden debug menu.

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

### Core Direction

The first real `Catalog` surface should be a dedicated workspace for reusable repo-backed assets.

Expected first-pass responsibilities:
- open a visible catalog workspace
- behave like a true workspace-mode target when a non-primary split pane changes surface kind
- organize entries into useful asset families
- preview what an item is before load
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
- support one temporary preview step first
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

Use the family phases to organize the dedicated Catalog wishlist items like this:

### `Catalog-1`
  - [ ] `0. Lightweight Card Grid`
  - [ ] `2. Separate Sections For Reference Families`
  - [ ] `3. Preview In A Separate Viewport`
  - [ ] `3A. No Auto-Loaded Previews`
  - [ ] `3B. Multiple Temporary Previews`
  - [ ] `4. Explicit Add-To-Project Commit`
  - [ ] `5. Honest Preview Versus Commit Ownership`
  - [ ] `6. Preview-Friendly Metadata`
  - [ ] `6A. Item Page As The Main Decision Surface`
  #### - foundation target:
    - make `Catalog` a real workspace mode
    - lock the store-page card language
    - lock the preview-versus-commit contract
    - lock the item-page responsibilities
### `Catalog-2`
  - [ ] `1. Move The Current Preloaded References Into Catalog`
  - [ ] `2. Separate Sections For Reference Families`
  - [ ] `3. Preview In A Separate Viewport`
  - [ ] `4. Explicit Add-To-Project Commit`
  - [ ] `6. Preview-Friendly Metadata`
  - [ ] `6A. Item Page As The Main Decision Surface`
  #### - implementation target:
    - move the preloaded `foothooks`, `shoes`, and `footpads` into real curated catalog families
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

  
## [ ] Catalog-1 - Workspace Foundation And Catalog Contract

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

Onboard the first geometry/reference-style catalog families such as hooks, shoes, footpads, and similar stored parts through honest downstream project/content load behavior.

### Owns

- the first real curated reference asset families in the catalog
- moving the current preloaded `foothooks`, `shoes`, and `footpads` into those real curated families
- explicit asset metadata needed to browse and distinguish those families
- honest preview-plus-commit behavior where `Load Preview` is temporary and `Add To Project` makes the chosen asset become explicit project/reference content
- the rule that loaded reference items should become visible through normal downstream content systems instead of staying catalog-local

### Does Not Own

- HDRI/environment apply behavior
- search/scale-up polish beyond what the first reference families strictly need
- final persistence or project-recall rules for every catalog-loaded reference

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
- ParaHook should have one real `Catalog` workspace for repo-backed reusable assets
- the first named families should include hooks, shoes, footpads, HDRIs, and later similar reusable stored assets
- the surface should support categories, previews, details, and explicit load/apply actions
- the catalog should stay distinct from Browser/project truth, user import, and viewer-owned environment state even when those downstream systems consume catalog items after the user chooses them
- the first actual implementation lane should start with workspace foundation plus the catalog-item contract, so later asset-family phases can grow through new focused seams instead of widening existing files
