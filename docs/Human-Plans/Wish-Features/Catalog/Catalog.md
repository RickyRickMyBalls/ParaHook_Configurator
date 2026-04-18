# Catalog

## Doc Header

### Doc History
6. 2026-04-17 22:12:06: Folded the newer Catalog preview-session direction into the wishlist by replacing the older preview-viewport-only read with empty card preview boxes plus explicit user-triggered preview loading, adding a preview-loaded session list with restore-on-reopen and unload controls, and tightening the phase mapping so `Catalog-1` now owns that baseline while `Catalog-5` still stays focused on later identity and recall follow-through
5. 2026-04-16 17:10:00: Tightened the wishlist read so the old preloaded `foothooks`, `shoes`, and `footpads` no longer read as default Browser-resident content, adding an explicit `Catalog-Gen0` prep step to remove those preloaded reference models from `Browser` first and reframing the later catalog families as optional add-ins the user can choose intentionally
4. 2026-04-16 00:08:43: Expanded the Catalog wishlist again to add the higher-level `System` organizer for Onewheel parts, documenting that the catalog should first distinguish `Platform` versus `Wheel` and later `Hardware`, and capturing the new wheel-side examples for motors and tires so those items can use type-specific fitment metadata without being forced into platform-only filtering
3. 2026-04-15 23:57:42: Added the first explicit Onewheel-part filter wishlist section, documenting the structured filter model for `ADV`, `XR`, `GT`, `Other`, the first part-type filters `Footpads`, `Bumpers`, `Rails`, and `Motors`, the `Other` sub-sections `FootHolds`, `Shoes`, and `Screw & Nuts`, and the recommendation that names like `XR_Footpad_Kush-Wide_Front` should be represented by structured metadata fields instead of parsed display strings
2. 2026-04-15 23:44:46: Expanded the `Catalog` wishlist shape around the newer store-page interaction model, documenting that the grid should use one `1x1` card per item with no previews auto-loaded, that previews should be user-triggered and allow multiple temporary previewed items, and that clicking a card should open an item page whose primary responsibilities are the larger viewport, `Add To Project`, and the description
1. 2026-04-15 23:25:36: Added this dedicated `Catalog` wish-feature planning doc so the newer workspace-family direction has one product-shape and follow-on wishlist home for preloaded `foothooks`, `shoes`, `footpads`, preview-versus-commit behavior, later HDRIs, and larger browse-and-load ideas before every detail turns into implementation phases

### Purpose

This doc defines the broader wishlist direction for `Catalog`.

Use it to answer:
- what larger `Catalog` product ideas are worth capturing before they all become implementation phases
- how the later optional reference families should feel inside the catalog
- how preview and commit should differ
- which wishlist items belong to which `Catalog` architecture phase
- what later follow-ons may be worth adding after the first foundation lands

### Why This Doc Exists

The `Catalog` workspace now has a real architecture home under `Workspace Modes`.

But there is still value in one looser feature-capture surface where we can record:
- how the first later optional asset families should feel
- which actions should exist from the user's point of view
- which later Catalog upgrades feel worth saving without overcommitting implementation detail too early

This doc exists to hold that wider product shape.

## Doc Body

### Short Version

`Catalog` should become the user-facing home for the repo's later optional reusable references and later other curated assets.

The first strong target is:
- remove the current preloaded reference models from `Browser` during `Catalog-Gen0`
- later let the user add `Foothooks`
- later let the user add `Shoes`
- later let the user add `Footpads`
- later add `HDRIs`

The core user flow should be:
- browse a section in a filter-plus-grid store page
- see one empty preview box per card instead of a preloaded repo-backed preview
- click a card preview box or use `Load Preview`
- inspect the temporary preview in that card box or on the item's larger page
- optionally keep other temporary previews open too
- let Catalog remember which items are preview-loaded while the surface is still part of the running session
- `Add To Project`

Important rule:
- preview is temporary
- `Add To Project` is the explicit commit step that makes the item become Browser/project truth

### Store Page Shape

The first strong browse surface should feel like a typical store page.

Recommended first layout:
- left filter rail
- right content area
- one `1x1` card per item in the main grid

Important rule:
- opening `Catalog` should not auto-load any previews
- the user should choose which items they want to preview

#### [ ] 0. Lightweight Card Grid

- every catalog item should get its own `1x1` card
- cards should stay lightweight by default
- the grid should feel fast and browsable even when many assets exist

Useful first card content:
- item image or poster frame
- name
- maybe a small type/family label

### First Wishlist Items

#### [ ] 1. Move The Current Preloaded References Into Catalog

- the current preloaded `foothooks`, `shoes`, and `footpads` should first stop feeling like scattered `Browser` preload behavior
- later they should become explicit curated `Catalog` entries instead
- the user should be able to browse them from one real workspace surface

#### [ ] 2. Separate Sections For Reference Families

The first sections should include:
- `Foothooks`
- `Shoes`
- `Footpads`

Later sections may include:
- `HDRIs`
- other reusable references
- later template or preset families

Important rule:
- the sections should group assets by what they are and how they load
- do not blur reference families and viewer-environment presets into one fake universal category

#### [ ] 3. Explicit Preview Surfaces

- every card should show a preview box even when no preview is loaded yet
- the user should be able to preview a selected reference in that card box before committing it
- this preview should not immediately create Browser/project content
- the item page should still provide the larger preview surface for deeper inspection
- previews should be loaded only when the user asks for them
- the system should allow more than one temporary preview at a time

Suggested first action name:
- `Load Preview`

#### [ ] 3A. No Auto-Loaded Previews

- when the user first opens `Catalog`, no previews should already be loaded
- the grid should not spin up repo-backed previews for every item automatically
- preview should be intentional and user-triggered

Important rule:
- no auto-preview flood on entry
- no hidden project load just because a card or preview box is visible

#### [ ] 3B. Multiple Temporary Previews

- the user should be able to preview more than one item at the same time
- multi-select plus one preview action should be allowed to load more than one card preview at once
- those previewed items should still remain temporary
- previewed items should be easy to close, replace, or compare

#### [ ] 3C. Preview-Loaded Session List And Restore

- Catalog should keep a list of which items are currently preview-loaded
- if the user closes and reopens `Catalog` during the running session, those temporary preview-loaded items should still be there
- this list should stay Catalog-owned and should not masquerade as Browser/project truth

#### [ ] 3D. Preview Unload Controls

- the user should be able to unload one preview-loaded item, several preview-loaded items, or all preview-loaded items
- unload should be available from the preview-loaded list view
- unloading a preview should recover temporary preview weight without affecting committed project content

#### [ ] 4. Explicit Add-To-Project Commit

- once the user is happy with a previewed reference, they should be able to choose `Add To Project`
- that action should:
  - add the chosen asset to Browser/project content
  - make it visible in the real model/project flow
- this should be the moment when the asset stops being only catalog preview state

Suggested first action name:
- `Add To Project`

#### [ ] 5. Honest Preview Versus Commit Ownership

- `Catalog` should own browse and temporary preview choice
- Browser/project content should own committed reference truth
- viewer/environment state should own applied HDRIs

Important rule:
- do not let preview accidentally become the same thing as commit

#### [ ] 6. Preview-Friendly Metadata

Useful first metadata for references:
- label
- family
- thumbnail or preview image
- description
- source path
- tags
- asset type

Useful later metadata:
- dimensions
- notes
- compatibility hints

#### [ ] 6A. Item Page As The Main Decision Surface

- clicking a card should open that item's page inside `Catalog`
- the item page should make three things primary:
  - the larger preview surface
  - `Add To Project`
  - the description

Useful later item-page details:
- tags
- dimensions
- source notes
- usage notes

#### [ ] 6B. Structured Platform And Part Filters

- the first Onewheel-oriented filter model should use structured metadata
- do not make the filter system depend on parsing labels alone

The first high-level organizer should be:
- `Platform`
- `Wheel`
- later `Hardware`

Important rule:
- `Platform Compatibility` should be a filter group, not the only top-level way we organize every part

The first platform filters should include:
- `ADV`
- `XR`
- `GT`
- `Other`

Important rule:
- a part can belong to more than one platform

#### [ ] 6C. Part-Type Filters

The first part-type filters should include:
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

#### [ ] 6D. Name Shape Should Map To Structured Fields

Examples such as:
- `XR_Footpad_Kush-Wide_Front`
- `GT_Footpad_Low-Boy_Rear`
- `Motor_Hypercore_6.5-GT`
- `Motor_Cannoncore_6.0-ADV`
- `Motor_Hypercore_6.0-XR`
- `Tire_Burris_11.5x7.0_Soft`
- `Tire_TFL_12.0x6.9_ThunderCat`

should map cleanly into fields like:
- system
- platform compatibility
- part type
- product name
- position
- motor version when relevant
- tire size or compound when relevant

Important rule:
- the slug can stay useful as an asset id
- but the runtime filter system should read explicit metadata fields first

#### [ ] 6E. Type-Specific Wheel Filters

Wheel-side parts should be allowed to use their own more specific filters.

Useful first wheel filters:
- for `Motors`
  - `Motor Family`
  - `Motor Version`
- for `Tires`
  - `Brand`
  - `Size`
  - `Compound`

Important rule:
- some wheel parts may still carry platform compatibility
- some wheel parts may rely mostly on type-specific fitment metadata instead

### Phase Mapping

Use this mapping to keep wishlist items organized by the phase where they are expected to become real:

- `Catalog-Gen0`
  - remove the current preloaded reference models from the default `Browser` baseline
  - stop starting the user with `foothooks`, `shoes`, and `footpads` already acting like implied Browser content
  - prepare those reference families to return later as intentional optional add-ins
- `Catalog-1`
  - make `Catalog` a real workspace mode
  - define the catalog item contract
  - define sections, store-page card language, empty-card-preview behavior, preview-session workflow, and the structured filter contract
- `Catalog-2`
  - onboard `foothooks`, `shoes`, and `footpads` as later optional curated catalog families after the old Browser preload is gone
  - make `Add To Project` create explicit Browser/project content
  - land the first real item pages and preview behavior for those reference families
- `Catalog-3`
  - onboard `HDRIs` with their own explicit apply path
- `Catalog-4`
  - richer search, tags, metadata, and filter scale-up
- `Catalog-5`
  - item identity follow-through and recall

### Later Wishlist Ideas

These are worth saving, but they should stay behind the first reference-family workflow:

#### [ ] 7. Side-By-Side Preview Compare

- compare two catalog items in preview before committing either one

#### [ ] 8. Better Reference Notes

- show dimensions, intended usage, and quick notes for reference assets where useful

#### [ ] 9. Curated Packs

- later allow grouped packs or themed bundles of reusable references

#### [ ] 10. Template-Like Catalog Entries

- later let the catalog hold not only reference assets but also reusable presets or template-like starting points when those have honest downstream owners

### Summary

The wishlist direction is:
- remove the current preloaded `foothooks`, `shoes`, and `footpads` from the default `Browser` baseline first
- later let the user add `foothooks`, `shoes`, and `footpads` through `Catalog`
- organize them into clear reference-family sections
- show them through a `1x1` card grid with empty preview boxes and no auto-loaded previews on entry
- let the user `Load Preview` into temporary in-card preview boxes only when they ask for it
- allow more than one temporary preview at a time
- let Catalog keep a preview-loaded session list that restores on close/reopen during the running session and offers unload controls
- make the item page center on the larger preview surface, `Add To Project`, and the description
- use structured platform, part-type, product-name, and position filters instead of guessing from labels
- add the higher-level `System` organizer so `Platform` parts and `Wheel` parts do not get forced into the same filter language
- allow motors and tires to use wheel-specific fitment filters where needed
- let the user `Add To Project` to commit the chosen item into Browser/project truth
- keep the later `Catalog` roadmap organized by which phase should make each wishlist item real
