# Catalog Vision

## Doc Header

### Doc History
18. 2026-04-16 17:10:00: Tightened the generational read again so `Generation 0` now explicitly removes the current preloaded reference models from `Browser`, clarifying that `foothooks`, `shoes`, and `footpads` should stop acting like default Browser-resident content during cleanup and should later return only as intentional optional add-ins
17. 2026-04-16 16:55:23: Reframed the catalog vision so it stays honest that the `Catalog` family has not started yet, adding an explicit `Generation 0` cleanup-and-prep read ahead of the later repo-backed catalog build, changing the current-state language so `Generation 1` now reads as the first real family generation instead of the active one, and aligning the vision with the new `Catalog-Gen0-Index.md` planning surface
16. 2026-04-16 12:31:00: Expanded `Generation 1` to include an `Imports` area inside `Catalog`, documenting that the early catalog may show user-uploaded items that already entered ParaHook so the user can place another copy into the model after deleting one, while still keeping import intake itself owned by the separate import system
15. 2026-04-16 12:23:00: Tightened `Generation 1` now that `Generation 2` and `Generation 3` are more concrete, making explicit that the baseline catalog is intentionally repo-backed, simpler, and metadata-light compared with the later external intake, richer fitment normalization, builder, and compatibility-check lanes
14. 2026-04-16 12:10:00: Expanded `Generation 2` linked-source intake again by documenting the Dropbox shared-link split more explicitly, clarifying that some PubParts links point to shared folders while others point to ZIP files, that shared folders may eventually support inspect-first selective download, and that ZIP-file links should use staged archive inspection so ParaHook can filter supported versus unsupported files and let the user choose which importable files to bring in
13. 2026-04-16 11:44:00: Named the first `Generation 3` rule-based compatibility layer the `Ricky Checker`, making explicit that this initial true/false fitment read is manually curated by Ricky and may still say a combination is possible even before later dimensional proof work exists
12. 2026-04-16 11:37:00: Expanded `Generation 3` compatibility again so it now explicitly covers pre-programmed allowed-part rules, builder-owned sub-part requirements such as a rear box needing battery, BMS, and supporting wiring or electronics, and a later `Generation 3.5` direction for dimensional packaging checks such as comparing battery size against rear-box volume and width/length/height constraints
11. 2026-04-16 11:28:00: Expanded `Generation 3` again by adding a first explicit `Onewheel Builder` direction, documenting that later Catalog should include a builder-style flow where the user fills an initially empty required-parts list against a curated board recipe covering tire, motor, axles, rails, boxes, ESC, battery, footpads, bumpers, fasteners, and accessories
10. 2026-04-16 11:21:00: Added the first explicit `Generation 3` direction for a real catalog compatibility-check system, documenting that `Generation 2` should lay the metadata groundwork as honestly as possible while `Generation 3` should actually evaluate whether a selected part or set of parts will work and report a user-facing true/false compatibility read
9. 2026-04-16 11:09:00: Expanded `Generation 2` again so the catalog system now explicitly separates `Platform` parts from `Wheel` parts, documenting that motors and tires should live under a `Wheel` system instead of being forced under one platform family when their real compatibility crosses multiple boards and depends on fitment details such as axle blocks
8. 2026-04-16 10:58:00: Tightened the `Generation 2` platform read so ParaHook now treats `GT` as the canonical platform family and handles `GTS` through narrower part-compatibility metadata because the shared board shape is mostly the same while electronics and motor stator compatibility can differ, and added the direction that `Catalog` should also include pre-built Onewheel bases the user can load into the model
7. 2026-04-16 10:49:00: Expanded `Generation 2` to cover PubParts intake more concretely, documenting that ParaHook should be able to ingest the PubParts part catalog into the ParaHook `Catalog` shape instead of mirroring the PubParts browse structure, that Dropbox-backed model archives may later support user-triggered download plus import handoff, and that the platform system should widen to include `ADV`, `GT/GTS`, `Pint`, `XR`, and `XR Classic` with separate sub-platform compatibility and cross-platform compatibility metadata
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

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen0-Index.md`
  - current cleanup-and-prep planning surface before the first real `Catalog` family phase starts
  - useful for honest `Generation 0` tracking and keeping prep distinct from `Generation 1`

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

`Generation 0` is the current cleanup-and-prep state because the family has not started yet.

That cleanup should first remove the old preloaded reference-model behavior from `Browser`.

`Generation 1` is the first real repo-backed curated browse-and-load workspace direction after that prep.

`Generation 2` should widen that workspace so it can also integrate curated external catalog sources such as `pubparts.xyz` and support linked `3D` model entries more generally.

`Generation 3` should turn the earlier compatibility metadata into a real check system that can tell the user whether a chosen part or build combination will actually work.

Later `Generation 3.5` style work could make those checks smarter by adding dimensional fit and packaging math.

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

#### Generation 0 - Cleanup And Prep Before Catalog Family Start

`Generation 0` is the current state because the `Catalog` family has not started yet.

This generation is prep only.

It should be used to:
- inventory where catalog-like behavior already leaks through preloaded references, `HDRI` handling, Browser-adjacent seams, or shell touchpoints
- clean up ownership boundaries before the real workspace family starts
- move the preloaded reference models out of `Browser`
- prepare the first curated asset and metadata baseline
- lock what should count as the actual `Generation 1` start

What `Generation 0` does well:
- keeps the docs honest about current status
- gives cleanup work one explicit home instead of mixing it into the first runtime phase
- removes the misleading Browser-resident default reference-model baseline before later optional add-ins arrive
- reduces the risk that `Catalog-1` starts by rediscovering drift instead of building the family

What `Generation 0` does not yet do:
- ship a real `Catalog` workspace surface
- ship the first manifest runtime
- ship preview or commit behavior
- ship the repo-backed browse-and-load baseline itself

Important rule:
- `Generation 0` is not a partial `Generation 1`
- if the work starts adding a real `Catalog` surface, manifest runtime, preview flow, or asset loading path, that work belongs to `Generation 1`

In short:

`Generation 0` is the cleanup-and-prep band before the first real catalog build starts.

That includes removing the current Browser preload for reference models so later add-ins stay intentional.

#### Generation 1 - Repo-Backed Curated Catalog

`Generation 1` is the first real catalog baseline after `Generation 0` cleanup and prep.

Unless a later section explicitly says `Generation 2` or `Generation 3`, the intended first real browse-and-load behavior described in this doc should be read as `Generation 1`.

`Generation 1` means:
- `Catalog` is a real workspace mode or split-pane surface
- the first catalog families are repo-backed and curated
- `foothooks`, `shoes`, and `footpads` return only as intentional optional add-ins, not as default Browser-resident preload
- `Catalog` may also expose an `Imports` area for user-uploaded items that already entered ParaHook
- the first browse flow is store-like, filterable, and preview-first
- `Load Preview` stays separate from `Add To Project`
- load behavior stays honest by asset type
- Browser, project truth, and viewer state remain the downstream owners after commit

What `Generation 1` does well:
- gives ParaHook one real curated catalog workspace
- makes repo-backed assets browseable without hidden ownership
- lets the user add later optional reference families only when they actually want them
- gives the user one place to find previously uploaded items they can place again
- keeps preview-versus-commit honest
- supports a simpler first-pass metadata and filter read for the earliest catalog families

What `Generation 1` does not yet do:
- intake curated external sources such as `pubparts.xyz`
- treat linked models and linked archives as first-class catalog entries
- require the richer `Platform` versus `Wheel` versus later `Power` and `Fasteners` organization
- carry the later pre-built Onewheel board direction as a required baseline feature
- run the `Ricky Checker` or any other true/false compatibility checker
- host the later `Onewheel Builder`
- perform dimensional fit or packaging math

Important rule:
- `Generation 1` should stay intentionally simpler than the later generations
- it should not be treated as incomplete just because it does not already contain the external-source, builder, or compatibility-check behavior that belongs later

Important `Generation 1` imports rule:
- the `Imports` area should be a reuse and recall surface for items already uploaded into ParaHook
- it should not redefine the import pipeline itself
- import intake still belongs to the import or user-file system, while `Catalog` may surface the already-known imported items as reusable entries

In short:

`Generation 1` is the repo-backed, curated, explicit browse-and-load catalog.

It is not yet the external-linked catalog.

#### Generation 2 - External Catalog Integration And Linked 3D Model Entries

`Generation 2` should widen `Catalog` from only repo-backed reusable assets into a curated workspace that can also surface selected external catalog sources and linked `3D` model entries.

The first concrete proof target for this generation should be:
- integrating `https://pubparts.xyz/` into `Catalog` as a curated external source

This generation should make room for:
- curated external catalog integrations
- source adapters that intake structured third-party catalog data and normalize it into the ParaHook catalog contract
- catalog entries whose main source is a link instead of only a repo-local asset path
- linked `3D` model entries more generally, even when the model does not ship inside the ParaHook repo
- explicit source metadata that says whether an item is repo-backed, externally linked, or later another source type

The main promise of `Generation 2` is:
- users can browse trusted external part libraries through the same `Catalog` workspace
- ParaHook can reorganize external sources like PubParts into the ParaHook browse model instead of being forced to copy the source site's organization exactly
- ParaHook can represent `3D` model links explicitly instead of pretending every useful asset must already live in the repo
- linked-source items remain curated, inspectable, and honest about where they come from
- the catalog still does not become a generic search engine, hidden downloader, or arbitrary web browser

Important rule:
- `Generation 2` should add curated external source integration
- it should not collapse `Catalog` into open-ended internet browsing or replace the separate user-import path

Likely first `Generation 2` metadata additions:
- source kind
- source site or provider
- source collection or source section label when helpful
- external item page URL
- linked model URL when relevant
- linked archive download URL when relevant
- attribution or source notes
- any later open, import, or handoff action that matches the linked asset type honestly

#### Generation 3 - Compatibility Check Catalog

`Generation 3` should make the catalog able to evaluate compatibility instead of only storing best-effort compatibility metadata.

`Generation 2` should still do its best to define compatibility honestly through:
- platform family
- frame family
- sub-platform tags
- wheel-versus-platform system classification
- narrower fitment metadata where needed

But `Generation 2` should still be read mainly as:
- explicit compatibility metadata
- manual curation
- strong best-effort fitment truth

`Generation 3` should add one stronger promise:
- the catalog can run a compatibility check and tell the user whether a selected part or part combination should work

The main promise of `Generation 3` is:
- the user can ask whether a part fits the currently loaded board or pre-built board
- the user can ask whether one part works with another part
- the system can answer `true` or `false` instead of only showing tags and leaving the rest implicit
- the catalog can explain why something does or does not fit when the repo has enough truth to say so honestly
- the catalog can also host a `Onewheel Builder` flow where the user fills a board recipe from a required-parts list instead of only browsing disconnected individual items
- the compatibility system can use pre-programmed allowed-part rules for known assemblies and known part relationships

The first user-facing name for this rule-based layer should be:
- `Ricky Checker`

Why:
- the user should understand that this first true/false read comes from Ricky's manually curated fitment knowledge
- the name makes it explicit that the answer is a trusted human-programmed rule read, not a fully automatic geometric proof
- that also leaves room for later stronger checks without pretending the first layer is more objective than it really is

Important rule:
- `Generation 3` compatibility checks should build on the curated metadata groundwork from `Generation 2`
- they should not replace honest metadata with hidden guesses

Healthy `Generation 3` examples:
- check whether a selected motor works with the current board when the required axle blocks are present or absent
- check whether a `GT`-family part also works with `XR Classic`
- check whether a fastener matches the specific part or assembly the user is trying to install
- check whether a chosen set of parts still produces one compatible pre-built board configuration
- check whether the current builder selection fills every required board slot and whether the chosen combination is still valid as one build
- check whether a selected rear box allows the battery, BMS, and supporting electronics the user is trying to pair with it

Healthy user-facing read:
- `true`
  - this should work
- `false`
  - this should not work
- later maybe `unknown`
  - the repo does not have enough truth yet to claim compatibility honestly

Important rule:
- if the catalog cannot prove compatibility honestly, it should not pretend
- broader metadata and notes may still exist, but the check result should stay explicit about whether the answer is proven, rejected, or not yet known

Healthy `Generation 3` compatibility read:
- first use curated allowed-part truth
- explicitly encode which parts are allowed to work with which other parts
- let builder-owned slots and sub-slots evaluate against those allowed-part rules
- keep the result explainable instead of magical

Healthy `Ricky Checker` read:
- `true`
  - Ricky says this should work
- `false`
  - Ricky says this should not work
- later maybe `possible`
  - Ricky believes this may work, but the repo does not yet have enough stronger proof to claim a hard yes

### Generation 3 Onewheel Builder Direction

`Generation 3` should also introduce a `Onewheel Builder` as part of the catalog experience.

This should not be only a loose browse surface.

It should also be able to act like a board recipe or build checklist that starts with an empty list of required parts and lets the user fill those slots from the catalog.

The first intended builder read is:
- the app knows the main parts a complete Onewheel build needs
- the builder presents those required slots clearly
- the user fills those slots by choosing compatible items from the catalog
- the compatibility system can evaluate the resulting combination as the build fills in
- some slots can also own sub-part requirements that must be satisfied for the larger build to count as complete and valid

The first required-part list should include:
- `Tire`
- `Motor`
- `Axles`
- `Rails`
- `Boxes`
- `ESC`
- `Battery`
- `Footpads`
- `Bumpers`
- `Fasteners`
- `Accessories`

Important rule:
- the builder should start from a curated required-parts list, not from a blank unstructured shopping cart
- the slot list is what makes the builder read as `build a board` instead of only `collect some parts`

Important sub-assembly rule:
- some builder parts should own their own sub-parts list
- a `Rear Box` is one important example
- the rear box may require:
  - `Battery`
  - `BMS`
  - supporting wires or electronics
- the compatibility system should eventually evaluate both the outer board recipe and these inner sub-assembly requirements

Healthy `Generation 3` read:
- `Catalog`
  - browse parts, assemblies, boards, and external-linked items
- `Onewheel Builder`
  - fill the required board slots with chosen catalog items
  - check whether the resulting board is complete and compatible

Important rule:
- the builder should reuse catalog item truth instead of inventing a second separate part universe
- one part catalog should feed both normal browsing and the builder slot system

### Generation 3.5 - Dimensional Fit And Packaging Checks

Later `Generation 3.5` work could make the compatibility checker more exact by adding dimensional and volume-based fit checks on top of the earlier pre-programmed rules.

The first strong proof case should be rear-box packaging.

Concrete example:
- if the selected box is `XR_Box_Rear`
- and the user tries to add `Battery_20s2p.obj`
- the system may eventually reject that combination for two different reasons:
  - the pre-programmed compatibility rules say that battery is not allowed for that box or board
  - the dimensional packaging check says the battery does not physically fit

The later dimensional read should eventually consider:
- overall volume
- width
- length
- height

Important rule:
- `Generation 3.5` should refine the `Generation 3` checker
- it should not replace the earlier curated allowed-part truth
- packaging math should strengthen the answer when ParaHook has enough geometry truth to do so honestly
- later dimensional checks should read as a stronger lane layered on top of the earlier `Ricky Checker`, not as a rewrite of why the first rule-based answers exist

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

`Generation 1` may also include an `Imports` area that lists user-uploaded items already known to ParaHook.

Good first catalog families:
- foothooks
- shoes
- footpads
- HDRIs
- imported user items that the user may want to place again after deleting one from the model
- other reusable references or sample parts stored in the repo

Good later catalog families:
- material or finish starter packs
- lighting or environment presets built on top of HDRIs
- reusable assemblies or kit parts
- pre-built Onewheel base models the user can load into the model as starting points
- curated external catalog integrations and linked `3D` model references
- graph/document templates if the repo later wants a curated template lane

Important rule:
- the catalog should group assets by what they are and how they load
- do not force geometry references, HDRIs, and later preset bundles into one fake universal item model if their apply behavior is meaningfully different

Important first migration read:
- the current preloaded `foothooks`, `shoes`, and `footpads` should move into `Catalog`
- those should be presented as distinct reference sections instead of staying scattered as ad hoc preload behavior
- the user should also be able to find previously uploaded imported items in an `Imports` area without treating those items as repo-curated assets

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
- intake the PubParts part list into ParaHook's own catalog-item shape instead of treating the PubParts website layout as the ParaHook runtime contract
- keep the source identity explicit instead of flattening everything into one local-only manifest fiction
- allow some entries to resolve to linked model pages or linked `3D` files rather than only repo paths
- allow later user-triggered download of linked archives such as Dropbox ZIP files, followed by extraction and import handoff when a supported model format is actually present
- distinguish linked shared folders from linked ZIP files instead of pretending every Dropbox link behaves the same way
- let `Catalog` also carry pre-built Onewheel base models that the user can load into the model as a starting board configuration
- organize imported or repo-backed parts under ParaHook systems that match real fitment truth instead of blindly mirroring one source site's platform buckets
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
- a PubParts source adapter should be able to map PubParts fields into ParaHook catalog fields instead of leaking PubParts-only naming directly into the rest of the app
- the UI should be able to show where an item comes from
- action language should stay honest about whether the user is previewing locally, opening a source page, importing a linked model, or adding a managed repo-backed asset to the project

### Generation 2 Dropbox Intake Direction

`Generation 2` should treat Dropbox links as two different intake shapes:
- shared folder links
- ZIP-file links

Important rule:
- ParaHook should not assume every Dropbox link can be handled the same way

For shared folder links, the healthy direction is:
- inspect the folder first
- filter the available files by what ParaHook can import
- let the user choose which file or files they want
- download only the selected files when that is honestly possible

For ZIP-file links, the healthy direction is:
- treat the ZIP as one downloaded archive first
- inspect the archive contents after download
- classify the contents into:
  - importable now
  - unsupported for now
  - support or reference files such as PDFs
- let the user choose one, many, or all supported files for import

Important rule:
- ZIP-file links should use staged archive inspection
- shared-folder links may later support inspect-first selective download
- the user should still see unsupported files in the staged chooser so nothing disappears silently

Healthy example:
- one PubParts Dropbox ZIP may contain:
  - two `.step` files
  - one `.f3d` file
  - one `.pdf`
- ParaHook should show that:
  - the `.step` files are importable now
  - the `.f3d` file is not importable now
  - the `.pdf` is a support/reference file
- the user should then be able to choose which supported files to import

### Generation 2 Platform Normalization Direction

`Generation 2` should widen the Onewheel platform system so ParaHook can organize PubParts-style entries with a cleaner compatibility read.

It should also widen the higher-level part organizer so ParaHook can sort parts by the system they really belong to, not only by one board family.

The first major catalog systems should include:
- `Platform`
- `Wheel`
- later `Hardware`

The core platform families should include:
- `ADV`
- `GT`
- `Pint`
- `XR`
- `XR Classic`

Important mapping rule:
- PubParts `Floatwheel` entries should map into ParaHook `ADV`

Important canonical-family rule:
- ParaHook should treat `GT` as the platform family
- `GTS` should not become a separate top-level platform family by default

Why:
- `GT` and `GTS` share the same overall board shape for many catalog purposes
- they use the same rails, box, screws, bumpers, footpads, and motor/axle shape
- the main differences live in narrower areas such as electronics and the motor stator

That means:
- many parts that fit `GT` should read as broadly `GT`-family compatible
- only the parts that truly differ should carry narrower `GTS`-specific compatibility notes

The platform system should also allow sub-platforms.

Example:
- `ADV`
  - `Pro`
  - `Standard`

Important rule:
- platform family and sub-platform should be stored separately
- a part may support one or more platform families
- a part may support one or more sub-platforms when that distinction actually matters
- if the distinction does not matter for a given part, the item should remain compatible at the broader family level instead of being forced into fake sub-platform precision

Important specialization rule:
- some parts will need narrower compatibility fields beyond platform family and sub-platform
- for example, electronics or motor internals may need a more specific fitment distinction even when the rest of the board family is shared
- that narrower fitment should refine the item metadata without forcing ParaHook to split one broadly shared board family into multiple fake top-level platforms

Important compatibility rule:
- most parts will work across more than one board family or sub-platform
- compatibility will need to be defined per part instead of guessed from the source section name alone
- cross-platform compatibility must be allowed explicitly

Concrete example:
- a `GT` footpad may also work with `XR Classic`
- the catalog should therefore allow one item to carry both compatibility tags instead of making the user choose only one platform bucket

Healthy storage direction:
- keep source grouping separate from ParaHook compatibility truth
- a PubParts source section may suggest a likely default platform family, but ParaHook should normalize final compatibility into explicit fields
- sub-platforms should refine compatibility, not replace the broader platform family
- narrow component-specific compatibility should remain separate from broad platform-family compatibility
- the final item page should be able to show both broad family compatibility and narrower sub-platform notes when needed

### Generation 2 Platform Versus Wheel System Direction

`Generation 2` should make one additional organizer explicit:
- not every part should live under a platform-family folder or platform-family browse branch

Some parts primarily belong to the board platform structure.

Examples:
- rails
- boxes
- bumpers
- footpads
- axle blocks

Some parts primarily belong to the wheel system instead.

Examples:
- motors
- tires
- later hubs and other wheel-side parts

Important rule:
- if a part can fit more than one board family and the real compatibility depends on bridge parts such as axle blocks, do not force that part into one platform bucket as if it only belongs there

Concrete example:
- a motor may fit an `XR`
- that same motor may also fit a `GT` when the correct axle blocks are used
- the catalog should therefore treat that motor as a `Wheel` part with explicit compatibility metadata instead of storing it as if it were an `XR`-only part

Healthy organization read:
- `Platform`
  - parts mainly owned by board/frame/platform fitment
- `Wheel`
  - parts mainly owned by motor/tire/hub-side fitment

This means:
- `rails`, `boxes`, `bumpers`, `footpads`, and often `axle blocks` will usually read as `Platform` parts
- `motors` and `tires` should usually read as `Wheel` parts
- later metadata should describe which platform families, frame families, or adapter parts make a given wheel-side item compatible

Important rule:
- the top-level catalog system should follow the part's real fitment domain
- compatibility metadata should then describe where that part can actually be used

### Generation 2 Pre-Built Onewheel Direction

`Generation 2` should also let `Catalog` carry a list of pre-built Onewheels that the user can load into the model.

These should act as curated starting boards rather than only loose replacement parts.

Healthy examples:
- one pre-built `ADV`
- one pre-built `GT`
- one pre-built `Pint`
- one pre-built `XR`
- one pre-built `XR Classic`
- later variants when a more specific starting board is genuinely useful

Important rule:
- a pre-built Onewheel entry is not the same thing as an individual part listing
- it should load as a starting board or starting assembly into the model
- later part browsing should still remain available on top of that loaded base

Healthy product read:
- parts help the user browse and swap individual components
- pre-built boards help the user start from a known whole-board shape before making changes

Healthy ownership read:
- choosing a pre-built board from `Catalog` should load that board into the model through the normal downstream ownership seams
- the catalog should still remain the chooser, not the long-term hidden owner of the loaded board

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
- sub-platform compatibility when relevant
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
- `subPlatformTags`
  - examples:
    - `['ADV-Pro']`
    - `['ADV-Standard']`
    - `['GTS-Electronics']`
    - `['GTS-Stator']`
    - empty when the part works at the broader platform-family level
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

Important widening rule:
- `Generation 1` may start with the simpler early platform groups
- `Generation 2` should widen the compatibility model so the catalog can represent `ADV`, `GT`, `Pint`, `XR`, and `XR Classic`, plus later sub-platform and component-fitment distinctions where they are genuinely needed
- `Generation 3` should use that widened compatibility model as the basis for actual compatibility checks instead of reopening the catalog shape from scratch

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

`Generation 1` may also surface imported items through an `Imports` area once those items are already inside ParaHook.

That is different from:
- user import from disk
- arbitrary external references
- one-off temporary files

Important rule:
- keep `curated catalog asset` separate from `user imported file`
- those systems can feel adjacent without collapsing into one blurry intake path

Important supporting rule:
- showing imported items in `Catalog` after intake is not the same thing as making `Catalog` own the import flow
- import intake still starts in the import system
- `Catalog` only becomes a later reuse surface for items ParaHook already knows about

#### 6. HDRIs Must Stay Optional And Explicit

HDRIs belong in the catalog, but environment changes should stay intentional.

Important rule:
- browsing HDRIs should be easy
- applying an HDRI should still be an explicit user choice
- later viewer behavior should keep HDRI usage optional rather than silently on by default

#### 7. The Family Must Stay Generic Enough To Grow

The first catalog targets may lean toward hooks, shoes, footpads, and HDRIs, but the workspace should not hard-code itself into only one product-specific grouping forever.

Important current-state rule:
- before those reference families become selectable catalog entries, `Generation 0` should remove them from the default `Browser` baseline

Important rule:
- keep the catalog generic enough that later reusable reference families, presets, and template-like assets can fit without a full workspace rewrite

### Success Read

When `Catalog` is working well, the user should be able to say:
- "I can browse the reusable assets that ship with this repo."
- "I can also find previously uploaded imported items in an `Imports` area and place another copy if I deleted one."
- "I can also browse curated external catalog items when ParaHook chooses to integrate them."
- "I can add foothooks, shoes, and footpads later if I want them, instead of starting with them already sitting in Browser."
- "I can choose a pre-built Onewheel from the catalog and load it into the model as a starting point."
- "I can filter down to the family I want."
- "I can filter by real Onewheel platform and part type without the system guessing from names."
- "I can ask whether a part or part combination will work, and the catalog can answer clearly."
- "I can open a Onewheel Builder, see the required board parts, and fill those slots from the catalog."
- "I can understand when a sub-assembly such as a rear box is still missing required internals or when a part physically does not fit."
- "I can browse a clean card grid without the catalog auto-loading everything."
- "I can preview only the items I care about, and I can keep more than one preview open if I want."
- "I can open an item page with a larger viewport, read the description, and then decide whether to add it to the project."
- "Loading it makes a clear explicit change in the right downstream system."
- "The catalog helps me reuse stored assets without confusing them with my project's authored truth."

### Summary

The umbrella direction is now:
- ParaHook should have a real `Catalog` workspace organized as explicit generations
- `Generation 0` is the current cleanup-and-prep state because the family has not started yet
- `Generation 0` should remove the current Browser-resident preload for reference models such as foothooks, shoes, and footpads
- `Generation 1` is the first real repo-backed curated browse-and-load catalog for later optional foothooks, shoes, footpads, `HDRIs`, and similar stored references
- `Generation 1` may also include an `Imports` area for previously uploaded items that are already inside ParaHook, without making `Catalog` own import intake
- `Generation 2` should widen that catalog to include curated external integrations such as `pubparts.xyz`, linked `3D` model entries more generally, broader platform-normalization rules, and pre-built Onewheel starting boards
- `Generation 3` should turn the `Generation 2` compatibility groundwork into a real compatibility-check system that can tell the user whether a part or build combination should work
- the catalog should remain a curated browse-and-load surface, not a second hidden content owner
- reference-style assets should support a temporary preview step before commit and should only become Browser/project truth after explicit `Add To Project`
- loaded items should become explicit downstream truth in Browser/project content, viewer environment state, or other honest owner seams depending on the asset type
