# Catalog Vision

## Doc Header

### Doc History
6. 2026-04-16 10:32:00: Reorganized the `Catalog` vision into explicit generations by defining the entire existing repo-backed browse-and-load direction as `Generation 1`, then adding a first `Generation 2` widening lane for curated external catalog integration such as `pubparts.xyz` plus linked `3D` model entries that stay explicit and metadata-backed instead of collapsing `Catalog` into generic web search or user import
5. 2026-04-15 23:57:42: Added the first explicit Onewheel-oriented filter-system direction to the `Catalog` vision, documenting that the early Catalog should use structured metadata for platform, part type, product name, and position instead of parsing display labels, and locking the first filter groups around `ADV`, `XR`, `GT`, `Other`, `Footpads`, `Bumpers`, `Rails`, `Motors`, and the `Other` sub-sections `FootHolds`, `Shoes`, and `Screw & Nuts`
4. 2026-04-15 23:44:46: Updated the `Catalog` vision again to match the newer store-style browse flow, documenting that the main catalog surface should open with no previews loaded, that every item should render as a `1x1` card inside a filter-plus-grid store layout, that users should trigger previews only for the items they want and may keep multiple temporary previews open, and that clicking an item should open a larger item page whose primary responsibilities are the viewport, `Add To Project`, and the description
3. 2026-04-15 23:25:36: Expanded the `Catalog` north-star to capture the first reference-family and action-flow direction more explicitly, documenting that the preloaded `foothooks`, `shoes`, and `footpads` should move into `Catalog` as distinct reference sections, that users should be able to `Load Preview` into a separate preview viewport before commit, and that `Add To Project` should hand the chosen asset into Browser or project truth plus the model viewport instead of leaving it catalog-local
2. 2026-04-15 22:03:14: Tightened the `Catalog` north-star so it now explicitly says `Catalog` must ship as its own real workspace mode or surface inside the shared workspace model, with the first honest tiled read being that a user can split the model viewport and turn the new non-primary pane into `Catalog` instead of treating the catalog as a sidecar overlay or Browser-only subpanel
1. 2026-04-15 20:24:35: Added this dedicated `Catalog-Vision.md` north-star doc under `Workspace-Modes/Workspaces/Catalog/` so the repo now has one stable planning home for a curated workspace where users can browse repo-backed reusable assets such as hooks, shoes, footpads, HDRIs, and later loadable reference families without turning the catalog into a hidden second Browser or project-truth owner

### Purpose

This doc captures the long-range vision for the `Catalog` workspace in ParaHook.

Use it to answer:
- what the `Catalog` workspace is supposed to be for
- what `generation` the `Catalog` vision is in today
- what the next `Catalog` generation should add without weakening the current ownership rules
- what kinds of reusable assets should belong in the catalog
- how repo-backed catalog browsing should relate to Browser/project truth
- how geometry references versus HDRIs should differ once the user loads them
- what must stay true so the catalog remains a curated loading surface instead of becoming a second hidden content system

Do not use it for:
- one specific implementation checklist
- pretending the catalog itself owns project content after load
- replacing the implementation-planning role of a future `Catalog-Index.md`

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping the catalog aligned with explicit authored/project truth and downstream viewer behavior

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that reusable asset browsing stays a real workspace capability instead of a one-off configurator shortcut

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - umbrella workspace family
  - useful for how `Catalog` should fit alongside other workspace surfaces

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md`
  - Browser/project-content ownership family
  - useful for the rule that loaded catalog items should become explicit project/content truth instead of remaining catalog-only runtime state

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
  - model-viewport family
  - useful for how loaded references, previews, and later HDRI environment changes should remain viewer-facing consequences rather than catalog-owned hidden truth

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Index.md`
  - catalog family umbrella and phased planning surface
  - useful for execution order, boundary rules, and future standalone `Catalog` docs

- `docs/Human-Plans/Wish-Features/Catalog/Catalog.md`
  - broader product-shape and follow-on wishlist surface
  - useful for tracking larger Catalog feature ideas and mapping them to later `Catalog` phases

## Doc Body

### Why This Doc Exists

ParaHook already has a growing need for reusable curated assets that do not start as user-imported files every time:
- premade foothooks
- premade shoes
- footpads
- HDRIs
- later reusable reference families or environment kits

But the repo did not yet have one stable answer to:
- what the `Catalog` workspace is meant to do
- how repo-backed reusable assets should be discovered
- how those assets should become explicit loaded truth after the user chooses them
- how the catalog should stay distinct from both `Browser` and one-off environment toggles

Without a vision doc, the catalog risks drifting into one of two weak shapes:
- a hard-coded product-specific picker with no real workspace identity
- a hidden second content system that quietly owns loaded references or environment state outside normal project/content seams

This doc exists to keep the catalog on the narrow honest path between those two failures.

### Short Version

`Catalog` should be described as evolving through explicit generations.

`Generation 1` is the current repo-backed curated browse-and-load workspace direction.

`Generation 2` should widen that workspace so it can also integrate curated external catalog sources such as `pubparts.xyz` and support linked `3D` model entries more generally.

It should also be treated as its own real workspace mode or surface inside the shared workspace system, not as a nested Browser panel or one-off overlay.

When it is good, it should let the user:
- scan organized asset families quickly
- preview what an item is before committing
- load the item through an explicit action
- open `Catalog` in its own pane after splitting the model viewport, so the user can keep the model visible while browsing reusable assets
- browse a filter-plus-grid store surface where each item appears as its own `1x1` card
- start with no previews loaded until the user explicitly asks for one
- `Load Preview` only for the items the user wants, without committing those assets into project truth yet
- keep more than one temporary preview open when the user wants to compare multiple items
- click into an item page where the preview viewport becomes larger and the main actions are `Add To Project` plus description-led inspection
- choose `Add To Project` when the previewed asset should become real project content
- understand whether the item becomes:
  - project/reference content
  - environment/viewer state
  - later another explicit reusable preset type

The first intended catalog families are:
- foothooks
- shoes
- footpads
- HDRIs
- other later reusable reference or preset families

Important rule:
- the catalog should help the user choose reusable assets
- it should not become the hidden long-term owner of those assets once they are loaded

### Catalog Generations

The catalog should be described as evolving through explicit generations.

The point of the generations is not branding.

The point is to make it easy to say:
- what the current vision already covers
- what the next widening lane should add
- what should wait for a later generation instead of being smuggled into the current one

#### Generation 1 - Repo-Backed Curated Catalog

`Generation 1` is the current catalog baseline.

Everything else currently described in this doc should be read as `Generation 1` unless a later section explicitly says `Generation 2`.

`Generation 1` means:
- `Catalog` is a real workspace mode or split-pane surface
- the first catalog families are repo-backed and curated
- the first browse flow is store-like, filterable, and preview-first
- `Load Preview` stays separate from `Add To Project`
- load behavior stays honest by asset type
- Browser, project truth, and viewer state remain the downstream owners after commit

In short:

`Generation 1` is the repo-backed, curated, explicit browse-and-load catalog.

It is not yet the external-linked catalog.

#### Generation 2 - External Catalog Integration And Linked 3D Model Entries

`Generation 2` should widen `Catalog` from only repo-backed reusable assets into a curated workspace that can also surface selected external catalog sources and linked `3D` model entries.

The first concrete proof target for this generation should be:
- integrating `https://pubparts.xyz/` into `Catalog` as a curated external source

This generation should make room for:
- curated external catalog integrations
- catalog entries whose main source is a link instead of only a repo-local asset path
- linked `3D` model entries more generally, even when the model does not ship inside the ParaHook repo
- explicit source metadata that says whether an item is repo-backed, externally linked, or later another source type

The main promise of `Generation 2` is:
- users can browse trusted external part libraries through the same `Catalog` workspace
- ParaHook can represent `3D` model links explicitly instead of pretending every useful asset must already live in the repo
- linked-source items remain curated, inspectable, and honest about where they come from
- the catalog still does not become a generic search engine, hidden downloader, or arbitrary web browser

Important rule:
- `Generation 2` should add curated external source integration
- it should not collapse `Catalog` into open-ended internet browsing or replace the separate user-import path

Likely first `Generation 2` metadata additions:
- source kind
- source site or provider
- external item page URL
- linked model URL when relevant
- attribution or source notes
- any later open, import, or handoff action that matches the linked asset type honestly

### Catalog North Star

The long-range target is a workspace that feels like a curated internal asset library:
- repo-backed
- later able to include curated external-linked sources
- explicit
- searchable
- previewable
- store-like
- safe to load
- extensible to more reusable asset families later

The catalog should be thought of as:
- a curated selection surface for reusable assets that ship with or live alongside the repo
- its own workspace mode or surface that can occupy a non-primary split pane beside the model viewport

not as:
- a second Browser tree
- a hidden runtime stash of loaded content
- a one-off toolbar picker for one narrow asset type

### What Catalog Is Supposed To Hold

The catalog should start with repo-backed reusable assets that the user may want to bring into a working session repeatedly.

Good first catalog families:
- foothooks
- shoes
- footpads
- HDRIs
- other reusable references or sample parts stored in the repo

Good later catalog families:
- material or finish starter packs
- lighting or environment presets built on top of HDRIs
- reusable assemblies or kit parts
- curated external catalog integrations and linked `3D` model references
- graph/document templates if the repo later wants a curated template lane

Important rule:
- the catalog should group assets by what they are and how they load
- do not force geometry references, HDRIs, and later preset bundles into one fake universal item model if their apply behavior is meaningfully different

Important first migration read:
- the current preloaded `foothooks`, `shoes`, and `footpads` should move into `Catalog`
- those should be presented as distinct reference sections instead of staying scattered as ad hoc preload behavior

### First Onewheel Filter Direction

The first reference-heavy `Catalog` pass should be organized around how Onewheel parts are actually described in practice.

The first major platform filter group should be:
- `ADV`
- `XR`
- `GT`
- `Other`

Important rule:
- a part may belong to more than one platform
- platform should therefore be stored as structured multi-value metadata, not as one single display bucket

The first part-type filter group should include:
- `Footpads`
- `Bumpers`
- `Rails`
- `Motors`

Under the broader `Other` bucket, the first sub-sections should include:
- `FootHolds`
- `Shoes`
- `Screw & Nuts`

Important rule:
- use explicit fields for:
  - platform compatibility
  - part type
  - product name
  - mount position
- do not rely on string-splitting the user-facing label as the main runtime truth

Example:
- `XR_Footpad_Kush-Wide_Front`
  - platform compatibility:
    - `XR`
  - part type:
    - `Footpad`
  - product name:
    - `Kush Wide`
  - mount position:
    - `Front`
- `GT_Footpad_Low-Boy_Rear`
  - platform compatibility:
    - `GT`
  - part type:
    - `Footpad`
  - product name:
    - `Low-Boy`
  - mount position:
    - `Rear`

Healthy storage rule:
- keep the human-readable label separate from the structured fields
- if a slug or asset id uses underscore naming, treat that as a transport or file id, not as the canonical metadata source

### Surface Shape Direction

The first strong visual direction should feel closer to a modern store page than to a file browser.

Recommended first browse layout:
- a filter rail on the left
- a main content area on the right
- one `1x1` card per item in the main grid

Important rule:
- the card grid should stay lightweight
- opening `Catalog` should not auto-load live previews for every item

Each card should primarily act as:
- a browse target
- a clear named entry for one asset
- a way into the item's larger detail page

### Item Page Direction

Clicking an item card should open that item's `Catalog` page.

The item page should make three things primary:
- the larger preview viewport
- `Add To Project`
- the description

Useful later supporting details may include:
- tags
- source notes
- dimensions
- compatibility or usage notes

### Generation 2 Direction

`Generation 2` should extend the earlier store-like item model so `Catalog` can carry both repo-backed entries and curated external-linked entries without lying about the difference.

The first proof case should be `pubparts.xyz`.

That site currently reads as a curated Onewheel library with explicit part collections such as `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR/Funwheel`, `XR Classic`, `Miscellaneous Items`, and `VESC Electronics`, plus supporting resource collections.

Healthy `Generation 2` direction:
- let `Catalog` represent those external curated collections as part of the ParaHook browse surface
- keep the source identity explicit instead of flattening everything into one local-only manifest fiction
- allow some entries to resolve to linked model pages or linked `3D` files rather than only repo paths
- keep downstream ownership honest if the user later opens, imports, previews, or adds one of those linked items

Important rule:
- an external-linked catalog item should still be a curated catalog entry
- it should not be treated as the same thing as arbitrary paste-a-URL intake

Healthy product read:
- `Generation 1`
  - repo-backed curated catalog items
- `Generation 2`
  - repo-backed items plus curated external-linked catalog items

Healthy architecture read:
- the catalog item contract should eventually be able to express both local asset sources and linked external sources
- the UI should be able to show where an item comes from
- action language should stay honest about whether the user is previewing locally, opening a source page, importing a linked model, or adding a managed repo-backed asset to the project

### What Must Stay True

#### 1. `Catalog` Must Stay Distinct From `Browser`

`Catalog` is where the user finds curated reusable assets.

`Browser` is where project/content truth should remain explicit once something is actually in the working project.

Important rule:
- browsing an item in the catalog is not the same thing as owning it in the project
- once the user loads a catalog item, the resulting project/content or viewer state should become visible through the real downstream owners

#### 1A. `Catalog` Must Be A Real Workspace Mode

`Catalog` should not be trapped as only:
- a Browser subsection
- a toolbar flyout
- an overlay floating on top of the model viewport

The first honest workspace read is:
- the user can split the model viewport
- the new non-primary pane can switch to `Catalog`
- the model viewport remains visible in the sibling pane while the catalog occupies the other pane

Important rule:
- `Catalog` should participate in the same shared workspace model used by other hosted surfaces
- the primary protected slot may stay `modelViewer`-only, but non-primary split panes should be able to become `Catalog`

#### 2. Catalog Entries Must Stay Explicit And Curated

The catalog should not depend on vague folder magic alone.

It should eventually have explicit metadata such as:
- stable item id
- label
- family/category
- tags
- preview media
- source path or source link
- load behavior
- platform compatibility
- part type
- mount position when relevant
- product name

Important rule:
- prefer one explicit manifest-style read over ad hoc UI branching on filenames

#### 2A. Filters Must Read From Structured Fields

The first Catalog filters should read from explicit item metadata, not from display labels alone.

Suggested first fields:
- `platformTags`
  - examples:
    - `['XR']`
    - `['GT']`
    - `['XR', 'GT']`
    - `['Other']`
- `partType`
  - examples:
    - `Footpad`
    - `Bumper`
    - `Rail`
    - `Motor`
    - `FootHold`
    - `Shoe`
    - `ScrewNut`
- `position`
  - examples:
    - `Front`
    - `Rear`
    - `Pair`
    - `Universal`
- `productName`
  - examples:
    - `Kush Wide`
    - `Low-Boy`

Suggested filter behavior:
- multi-select inside the same group
- `OR` behavior within one group by default
- `AND` behavior across different groups

That means:
- `XR` plus `GT`
  - shows parts compatible with either platform
- `XR` plus `Footpads`
  - shows only `XR` parts that are also `Footpads`

#### 3. Load Actions Must Stay Honest By Asset Type

Different catalog items should apply through honest downstream seams.

Examples:
- foothook, shoe, and footpad references should load as explicit project/reference content
- HDRIs should apply as explicit environment/viewer state only when the user chooses them
- later preset bundles should apply through the specific owner seam that matches their type

Important rule:
- do not make every catalog item pretend to be the same kind of thing once loaded

#### 3A. Preview Must Stay Separate From Commit

For reference-style assets, the first honest user flow should be:
- browse a reference family such as `Foothooks`, `Shoes`, or `Footpads`
- see one `1x1` card per item with no preview auto-loaded
- select one item
- choose `Load Preview` only for that item
- see that item in a temporary preview viewport without adding it to project/content truth yet
- optionally keep multiple temporary previews open if the user wants to compare more than one item
- choose `Add To Project` only when the item should become real project content

Important rule:
- `Load Preview` is temporary preview state
- `Add To Project` is the explicit commit action that should hand the asset into Browser/project truth and visible model content

Important supporting rule:
- preview should be user-triggered, not automatic for every card in the catalog grid

#### 4. `Catalog` Must Not Become A Hidden Runtime Owner

After a catalog item is loaded, the catalog should not remain the only place that knows it exists.

The loaded result should become visible through the correct owner:
- Browser/project content
- Model Viewport environment/view settings
- later explicit preset/content systems

Important rule:
- the catalog may be the source of a reusable asset
- it should not be the hidden sole owner of the loaded result

#### 5. Curated Catalog Reuse Must Stay Separate From User Import

`Generation 1` catalog entries are curated repo-backed reusable assets.

`Generation 2` may widen that to include curated external-linked entries.

That is different from:
- user import from disk
- arbitrary external references
- one-off temporary files

Important rule:
- keep `curated catalog asset` separate from `user imported file`
- those systems can feel adjacent without collapsing into one blurry intake path

#### 6. HDRIs Must Stay Optional And Explicit

HDRIs belong in the catalog, but environment changes should stay intentional.

Important rule:
- browsing HDRIs should be easy
- applying an HDRI should still be an explicit user choice
- later viewer behavior should keep HDRI usage optional rather than silently on by default

#### 7. The Family Must Stay Generic Enough To Grow

The first catalog targets may lean toward hooks, shoes, footpads, and HDRIs, but the workspace should not hard-code itself into only one product-specific grouping forever.

Important rule:
- keep the catalog generic enough that later reusable reference families, presets, and template-like assets can fit without a full workspace rewrite

### Success Read

When `Catalog` is working well, the user should be able to say:
- "I can browse the reusable assets that ship with this repo."
- "I can also browse curated external catalog items when ParaHook chooses to integrate them."
- "I can browse preloaded foothooks, shoes, and footpads in their own sections."
- "I can filter down to the family I want."
- "I can filter by real Onewheel platform and part type without the system guessing from names."
- "I can browse a clean card grid without the catalog auto-loading everything."
- "I can preview only the items I care about, and I can keep more than one preview open if I want."
- "I can open an item page with a larger viewport, read the description, and then decide whether to add it to the project."
- "Loading it makes a clear explicit change in the right downstream system."
- "The catalog helps me reuse stored assets without confusing them with my project's authored truth."

### Summary

The umbrella direction is now:
- ParaHook should have a real `Catalog` workspace organized as explicit generations
- `Generation 1` is the repo-backed curated browse-and-load catalog for preloaded foothooks, shoes, footpads, HDRIs, and similar stored references
- `Generation 2` should widen that catalog to include curated external integrations such as `pubparts.xyz` and linked `3D` model entries more generally
- the catalog should remain a curated browse-and-load surface, not a second hidden content owner
- reference-style assets should support a temporary preview step before commit and should only become Browser/project truth after explicit `Add To Project`
- loaded items should become explicit downstream truth in Browser/project content, viewer environment state, or other honest owner seams depending on the asset type
