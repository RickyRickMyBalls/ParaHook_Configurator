# Catalog Vision

## Doc Header

### Doc History
30. 2026-04-19 13:16:04: Converted the generation-local `HLG Covered` blocks into stable `Generation N HLG Checklist` sections with full goal wording and checkbox status so generation headings do not need to change when individual HLG complete.
29. 2026-04-19 13:08:15: Normalized the Catalog generation sections to the current `Vision Rails` guide-rail language, keeping each generation fold anchored by `### Generation N Summary` and routing generation ownership, boundary, and family-phase setup guidance through `### Generation N Vision Rails` instead of older vision-spec or phase-creation wording.
28. 2026-04-19 12:31:18: Reformatted the Catalog vision against the updated planning guide rails by nesting supporting vision detail under `## Vision`, clarifying that `Catalog-Gen1-Index.md` is the target Generation 1 routing surface, preserving `Catalog-Index.md` as the older bridge, and naming Generation Index Docs and Family Phase Docs as the downstream planning surfaces.
27. 2026-04-19 00:44:47: Folded the newer `Generation 1` part and filter direction into the generation section as a vision-spec read, making the local Catalog surface, downstream ownership, local taxonomy, filter types, structured metadata, and index-setup handoff detailed enough to feed `Catalog-Index.md` without becoming an implementation spec
26. 2026-04-19 00:40:58: Expanded the `Generation 1` Catalog vision with sharper HLG and summary language for local part-system organization, platform compatibility, part groups, structured metadata, type-specific fitment fields, and predictable filter behavior before external source intake
25. 2026-04-18 20:52:00: Added the PubWheel terminology direction to the active Catalog vision language, replacing full-build `PubWheel` wording with `PubWheel` while keeping platform/source names available only for compatibility and upstream-source context
24. 2026-04-18 20:36:00: Turned the Catalog generation sections into denser generation-vision specs that summarize each generation, name the covered HLG, define ownership boundaries, and provide enough direction to create later family phases without becoming implementation specs
23. 2026-04-18 20:22:00: Reorganized the Catalog HLG block under a top-level `## Vision` section with `### Human Level Goals`, preserving the numbered generation-scoped HLG while matching the newer Environment-style planning format more closely
22. 2026-04-18 20:08:00: Numbered every Catalog human-level goal with stable generation-scoped `Catalog-GenN-HLG-N` identifiers so later CLG, phase plans, and implementation notes can reference them without losing the original user-facing goal text
21. 2026-04-18 19:34:00: Normalized this family vision doc toward the `Doc-Vision.md` foldability contract by making generation entries the primary foldable `##` sections with explicit status markers, adding explicit human-level goals, and keeping supporting vision details at `###` depth while implementation checklists remain in `Catalog-Index.md`
20. 2026-04-18 14:01:44: Closed the older "still in `Generation 0` today" wording now that the `Catalog-Gen0` cleanup-and-prep band has been completed, updating the vision so `Generation 0` reads as the completed prep generation and `Generation 1` reads as the active first real family baseline without widening the north-star into new runtime detail
19. 2026-04-17 22:12:06: Folded the newer preview-session direction into the `Catalog` vision so `Generation 1` now reads as opening with empty card preview boxes instead of preloaded repo-backed previews, allowing explicit in-card and multi-card preview loading, keeping a Catalog-owned preview-loaded item list that restores when the user closes and reopens Catalog during the running session, and adding unload controls so temporary preview state stays lightweight and distinct from `Add To Project`
18. 2026-04-16 17:10:00: Tightened the generational read again so `Generation 0` now explicitly removes the current preloaded reference models from `Browser`, clarifying that `foothooks`, `shoes`, and `footpads` should stop acting like default Browser-resident content during cleanup and should later return only as intentional optional add-ins
17. 2026-04-16 16:55:23: Reframed the catalog vision so it stays honest that the `Catalog` family has not started yet, adding an explicit `Generation 0` cleanup-and-prep read ahead of the later repo-backed catalog build, changing the current-state language so `Generation 1` now reads as the first real family generation instead of the active one, and aligning the vision with the new `Catalog-Gen0-Index.md` planning surface
16. 2026-04-16 12:31:00: Expanded `Generation 1` to include an `Imports` area inside `Catalog`, documenting that the early catalog may show user-uploaded items that already entered ParaHook so the user can place another copy into the model after deleting one, while still keeping import intake itself owned by the separate import system
15. 2026-04-16 12:23:00: Tightened `Generation 1` now that `Generation 2` and `Generation 3` are more concrete, making explicit that the baseline catalog is intentionally repo-backed, simpler, and metadata-light compared with the later external intake, richer fitment normalization, builder, and compatibility-check lanes
14. 2026-04-16 12:10:00: Expanded `Generation 2` linked-source intake again by documenting the Dropbox shared-link split more explicitly, clarifying that some PubParts links point to shared folders while others point to ZIP files, that shared folders may eventually support inspect-first selective download, and that ZIP-file links should use staged archive inspection so ParaHook can filter supported versus unsupported files and let the user choose which importable files to bring in
13. 2026-04-16 11:44:00: Named the first `Generation 3` rule-based compatibility layer the `Ricky Checker`, making explicit that this initial true/false fitment read is manually curated by Ricky and may still say a combination is possible even before later dimensional proof work exists
12. 2026-04-16 11:37:00: Expanded `Generation 3` compatibility again so it now explicitly covers pre-programmed allowed-part rules, builder-owned sub-part requirements such as a rear box needing battery, BMS, and supporting wiring or electronics, and a later `Generation 3.5` direction for dimensional packaging checks such as comparing battery size against rear-box volume and width/length/height constraints
11. 2026-04-16 11:28:00: Expanded `Generation 3` again by adding a first explicit `PubWheel Builder` direction, documenting that later Catalog should include a builder-style flow where the user fills an initially empty required-parts list against a curated PubWheel recipe covering tire, motor, axles, rails, boxes, ESC, battery, footpads, bumpers, fasteners, and accessories
10. 2026-04-16 11:21:00: Added the first explicit `Generation 3` direction for a real catalog compatibility-check system, documenting that `Generation 2` should lay the metadata groundwork as honestly as possible while `Generation 3` should actually evaluate whether a selected part or set of parts will work and report a user-facing true/false compatibility read
9. 2026-04-16 11:09:00: Expanded `Generation 2` again so the catalog system now explicitly separates `Platform` parts from `Wheel` parts, documenting that motors and tires should live under a `Wheel` system instead of being forced under one platform family when their real compatibility crosses multiple boards and depends on fitment details such as axle blocks
8. 2026-04-16 10:58:00: Tightened the `Generation 2` platform read so ParaHook now treats `GT` as the canonical platform family and handles `GTS` through narrower part-compatibility metadata because the shared board shape is mostly the same while electronics and motor stator compatibility can differ, and added the direction that `Catalog` should also include pre-built PubWheel bases the user can load into the model
7. 2026-04-16 10:49:00: Expanded `Generation 2` to cover PubParts intake more concretely, documenting that ParaHook should be able to ingest the PubParts part catalog into the ParaHook `Catalog` shape instead of mirroring the PubParts browse structure, that Dropbox-backed model archives may later support user-triggered download plus import handoff, and that the platform system should widen to include `ADV`, `GT/GTS`, `Pint`, `XR`, and `XR Classic` with separate sub-platform compatibility and cross-platform compatibility metadata
6. 2026-04-16 10:32:00: Reorganized the `Catalog` vision into explicit generations by defining the entire existing repo-backed browse-and-load direction as `Generation 1`, then adding a first `Generation 2` widening lane for curated external catalog integration such as `pubparts.xyz` plus linked `3D` model entries that stay explicit and metadata-backed instead of collapsing `Catalog` into generic web search or user import
5. 2026-04-15 23:57:42: Added the first explicit platform-and-part-oriented filter-system direction to the `Catalog` vision, documenting that the early Catalog should use structured metadata for platform, part type, product name, and position instead of parsing display labels, and locking the first filter groups around `ADV`, `XR`, `GT`, `Other`, `Footpads`, `Bumpers`, `Rails`, `Motors`, and the `Other` sub-sections `FootHolds`, `Shoes`, and `Screw & Nuts`
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
- replacing the planning role of `Catalog-GenN-Index.md` Generation Index Docs
- replacing the implementation-planning role of `Future/Catalog-N - Family Phase Name.md` Family Phase Docs

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

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen1-Index.md`
  - active Generation 1 index
  - useful for routing active Generation 1 HLG and CLG into `Catalog-1`, `Catalog-2`, and later family phases

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`
  - existing Generation 2 index for external catalog integration and linked model-entry planning
  - useful for keeping Generation 2 widening separate from the active local repo-backed Generation 1 baseline

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

`Generation 0` is now the completed cleanup-and-prep generation that made the first real family start possible.

That cleanup first removed the old preloaded reference-model behavior from `Browser` and closed the legacy Browser-owned baseline.

`Generation 1` is now the active first real repo-backed curated browse-and-load workspace direction after that completed prep.

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
- start with one empty preview box per card and no repo-backed previews loaded until the user explicitly asks for one
- click a card preview box or trigger `Load Preview` only for the items the user wants, without committing those assets into project truth yet
- load previews for more than one selected item at a time when the user wants to compare multiple cards
- keep a Catalog-owned preview-loaded list so those temporary previews restore when the user closes and reopens `Catalog` during the running session
- unload one or more preview-loaded items when performance starts to dip
- click into an item page where the preview surface becomes larger and the main actions are `Add To Project` plus description-led inspection
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

## Vision

### Human Level Goals

The `Catalog` family should achieve these human-level goals:

### Generation 0 HLG

- [x] `Catalog-Gen0-HLG-1. remove default Browser-resident reference preload behavior before the first real Catalog family starts`
- [x] `Catalog-Gen0-HLG-2. keep prep and cleanup separate from the first real Catalog runtime generation`
- [x] `Catalog-Gen0-HLG-3. prepare the Catalog family boundary so later repo-backed assets return only as intentional optional choices`

### Generation 1 HLG

- [x] `Catalog-Gen1-HLG-1. let the user keep the model visible while browsing reusable assets in a real Catalog workspace surface`
- [x] `Catalog-Gen1-HLG-2. let repo-backed reusable assets return as intentional optional choices instead of default Browser-resident content`
- [x] `Catalog-Gen1-HLG-3. let the user browse clear item families such as foothooks, shoes, footpads, HDRIs, imports, and later reusable references or preset families`
- [x] `Catalog-Gen1-HLG-4. keep preview, commit, and apply behavior honest by asset type`
- [x] `Catalog-Gen1-HLG-5. let reference-style items preview temporarily before explicit Add To Project`
- [x] `Catalog-Gen1-HLG-6. make Add To Project hand reference items into Browser/project truth instead of leaving them catalog-local`
- [ ] `Catalog-Gen1-HLG-7. keep Browser organization truthful to what the user actually added`
- [x] `Catalog-Gen1-HLG-8. let HDRIs remain optional environment/viewer choices that apply only when the user explicitly chooses them`
- [ ] `Catalog-Gen1-HLG-9. let the user browse and apply repo-backed or user-selected HDRI/EXR environments without pretending they are project geometry`
- [x] `Catalog-Gen1-HLG-10. keep imported user files and curated repo assets distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen1-HLG-11. add more repo-backed part families beyond the first hooks, shoes, and footpads so Catalog becomes the place users browse real reusable parts that ship with the repo`
- [ ] `Catalog-Gen1-HLG-12. organize repo-backed parts into clear first-pass systems and families instead of one flat asset pile`
- [ ] `Catalog-Gen1-HLG-13. let the user switch the Catalog organization between a Part view and a Platform view`
- [ ] `Catalog-Gen1-HLG-14. let the user filter by part type or by platform compatibility without those two browse modes fighting each other`
- [ ] `Catalog-Gen1-HLG-15. introduce the first practical filter model for repo-backed parts, starting from structured metadata such as system, part type, platform compatibility, product name, and position`
- [ ] `Catalog-Gen1-HLG-16. define the first canonical local Catalog systems, platform families, and part groups before external-source integration begins`
- [ ] `Catalog-Gen1-HLG-17. normalize repo-backed parts by real fitment truth instead of only by current source folder or filename`
- [ ] `Catalog-Gen1-HLG-18. make filter behavior predictable, with OR inside one filter group and AND across different filter groups`
- [ ] `Catalog-Gen1-HLG-19. keep the first filter system practical for Generation 1 while leaving room for PubParts source mapping and later compatibility checks`
- [x] `Catalog-Gen1-HLG-20. preserve enough loaded-item identity that downstream systems can remember what curated asset was chosen without turning Catalog into the hidden long-term owner`
- [ ] `Catalog-Gen1-HLG-21. organize local repo-backed parts by system ownership such as Platform, Wheel, and later Hardware before external source intake`
- [ ] `Catalog-Gen1-HLG-22. define canonical local platform families and multi-platform compatibility metadata for ADV, XR, GT, Pint, XR Classic, and Other`
- [ ] `Catalog-Gen1-HLG-23. define first-pass part groups such as Footpads, Bumpers, Rails, Motors, Tires, Boxes, Axle Blocks, FootHolds, Shoes, and Screw & Nuts`
- [ ] `Catalog-Gen1-HLG-24. let Part view and Platform view read from the same structured item metadata instead of becoming separate catalog truths`
- [ ] `Catalog-Gen1-HLG-25. map asset name shapes into explicit metadata fields such as system, platform compatibility, part type, product name, position, motor version, tire size, and compound`
- [ ] `Catalog-Gen1-HLG-26. support wheel-specific fitment fields for motors and tires without forcing wheel-side parts into platform-only filters`

### Generation 2 HLG

- [ ] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`
- [ ] `Catalog-Gen2-HLG-4. let Catalog carry pre-built PubWheel starting assemblies without making them the same thing as individual part listings`

### Generation 3 HLG

- [ ] `Catalog-Gen3-HLG-1. turn curated compatibility metadata into a clear user-facing compatibility check`
- [ ] `Catalog-Gen3-HLG-2. let the user ask whether a part or part combination should work and receive an honest true, false, possible, or unknown read`
- [ ] `Catalog-Gen3-HLG-3. introduce the Ricky Checker as the first curated rule-based compatibility layer`
- [ ] `Catalog-Gen3-HLG-4. let the later PubWheel Builder fill required full-build slots from Catalog item truth instead of inventing a second part universe`

### Generation 3.5 HLG

- [ ] `Catalog-Gen3.5-HLG-1. add dimensional fit and packaging checks on top of the curated Generation 3 compatibility rules`
- [ ] `Catalog-Gen3.5-HLG-2. use rear-box packaging as the first strong proof case for geometry-backed fit checks`
- [ ] `Catalog-Gen3.5-HLG-3. keep dimensional checks as a strengthening layer instead of replacing the earlier curated Ricky Checker truth`

### Catalog Generations

The catalog should be described as evolving through explicit generations.

The point of the generations is not branding.

The point is to make it easy to say:
- what the current vision already covers
- what the next widening lane should add
- what should wait for a later generation instead of being smuggled into the current one

Generation index routing:
- `Generation 1` routes into `Catalog-Gen1-Index.md`.
- `Generation 2` already routes into `Catalog-Gen2-Index.md`.
- `Generation 3` and `Generation 3.5` should get generation indexes only when they become active planning surfaces.

### Supporting Vision Detail

#### Catalog North Star

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

#### What Catalog Is Supposed To Hold

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
- pre-built PubWheel base models the user can load into the model as starting points
- curated external catalog integrations and linked `3D` model references
- graph/document templates if the repo later wants a curated template lane

Important rule:
- the catalog should group assets by what they are and how they load
- do not force geometry references, HDRIs, and later preset bundles into one fake universal item model if their apply behavior is meaningfully different

Important first migration read:
- the current preloaded `foothooks`, `shoes`, and `footpads` should move into `Catalog`
- those should be presented as distinct reference sections instead of staying scattered as ad hoc preload behavior
- the user should also be able to find previously uploaded imported items in an `Imports` area without treating those items as repo-curated assets

#### First Platform And Part Filter Direction

The first reference-heavy `Catalog` pass should be organized around how public-wheel platform parts are actually described in practice.

This is `Generation 1` work.

Gen 1 should set up the local Catalog organization and filter language before `Generation 2` brings in PubParts.

##### Generation 1 Catalog Systems

The first major local Catalog systems should include:
- `Platform`
- `Wheel`
- later `Hardware`

System meaning:
- `Platform`
  - board/frame/platform-owned parts
  - examples: rails, boxes, bumpers, footpads, axle blocks when they are platform-fitment parts
- `Wheel`
  - motor, tire, hub, and wheel-side parts
  - examples: motors, tires, later hubs
- `Hardware`
  - later fasteners, screws, nuts, and small hardware when they need their own browse lane

Important rule:
- systems are not the same as platform families
- the user should be able to organize by `Part` or by `Platform`, but both views should read from the same item metadata

##### Generation 1 Platform Families

The first major platform filter group should include:
- `ADV`
- `XR`
- `GT`
- `Pint`
- `XR Classic`
- `Other`

Important rule:
- a part may belong to more than one platform
- platform should therefore be stored as structured multi-value metadata, not as one single display bucket
- `GT` should be the broad platform family
- `GTS` should be a narrower compatibility note where needed, not a separate top-level platform by default
- PubParts `Floatwheel` should later map into `ADV` during Generation 2 intake

##### Generation 1 Part Groups

The first part-type filter group should include:
- `Footpads`
- `Bumpers`
- `Rails`
- `Motors`
- `Tires`
- `Boxes`
- `Axle Blocks`

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

Important generation boundary:
- `Generation 1` owns the local Catalog organization, platform vocabulary, part groups, and filter behavior
- `Generation 2` owns PubParts and other external-source mapping into this Catalog shape

#### Surface Shape Direction

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

#### Item Page Direction

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

#### Generation 2 Direction

`Generation 2` should extend the earlier store-like item model so `Catalog` can carry both repo-backed entries and curated external-linked entries without lying about the difference.

The first proof case should be `pubparts.xyz`.

That site currently reads as a curated public-wheel library with explicit part collections such as `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR/Funwheel`, `XR Classic`, `Miscellaneous Items`, and `VESC Electronics`, plus supporting resource collections.

Healthy `Generation 2` direction:
- let `Catalog` represent those external curated collections as part of the ParaHook browse surface
- intake the PubParts part list into ParaHook's own catalog-item shape instead of treating the PubParts website layout as the ParaHook runtime contract
- keep the source identity explicit instead of flattening everything into one local-only manifest fiction
- allow some entries to resolve to linked model pages or linked `3D` files rather than only repo paths
- allow later user-triggered download of linked archives such as Dropbox ZIP files, followed by extraction and import handoff when a supported model format is actually present
- distinguish linked shared folders from linked ZIP files instead of pretending every Dropbox link behaves the same way
- let `Catalog` also carry pre-built PubWheel base models that the user can load into the model as a starting configuration
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

#### Generation 2 Dropbox Intake Direction

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

#### Generation 2 Platform Normalization Direction

`Generation 2` should map PubParts-style entries into the Generation 1 platform compatibility system so external source data gets a cleaner ParaHook compatibility read.

It should refine the higher-level part organizer where PubParts exposes useful distinctions, but it should not be the first place where Catalog invents `Part`, `Platform`, `Wheel`, or basic platform-family truth.

The Generation 1 local Catalog systems are:
- `Platform`
- `Wheel`
- later `Hardware`

The Generation 1 core platform families are:
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
- if Generation 1 has not yet needed a sub-platform, Generation 2 may introduce it as source mapping metadata rather than changing the top-level platform list

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

#### Generation 2 Platform Versus Wheel System Direction

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

#### Generation 2 Pre-Built PubWheel Direction

`Generation 2` should also let `Catalog` carry a list of pre-built PubWheel starting assemblies that the user can load into the model.

These should act as curated PubWheel starting assemblies rather than only loose replacement parts.

Healthy examples:
- one pre-built `ADV`
- one pre-built `GT`
- one pre-built `Pint`
- one pre-built `XR`
- one pre-built `XR Classic`
- later variants when a more specific PubWheel starting assembly is genuinely useful

Important rule:
- a pre-built PubWheel entry is not the same thing as an individual part listing
- it should load as a PubWheel starting assembly into the model
- later part browsing should still remain available on top of that loaded base

Healthy product read:
- parts help the user browse and swap individual components
- pre-built PubWheel assemblies help the user start from a known whole-build shape before making changes

Healthy ownership read:
- choosing a pre-built PubWheel from `Catalog` should load that PubWheel into the model through the normal downstream ownership seams
- the catalog should still remain the chooser, not the long-term hidden owner of the loaded PubWheel

#### What Must Stay True

##### 1. `Catalog` Must Stay Distinct From `Browser`

`Catalog` is where the user finds curated reusable assets.

`Browser` is where project/content truth should remain explicit once something is actually in the working project.

Important rule:
- browsing an item in the catalog is not the same thing as owning it in the project
- once the user loads a catalog item, the resulting project/content or viewer state should become visible through the real downstream owners

##### 1A. `Catalog` Must Be A Real Workspace Mode

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

##### 2. Catalog Entries Must Stay Explicit And Curated

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

##### 2A. Filters Must Read From Structured Fields

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

##### 3. Load Actions Must Stay Honest By Asset Type

Different catalog items should apply through honest downstream seams.

Examples:
- foothook, shoe, and footpad references should load as explicit project/reference content
- HDRIs should apply as explicit environment/viewer state only when the user chooses them
- later preset bundles should apply through the specific owner seam that matches their type

Important rule:
- do not make every catalog item pretend to be the same kind of thing once loaded

##### 3A. Preview Must Stay Separate From Commit

For reference-style assets, the first honest user flow should be:
- browse a reference family such as `Foothooks`, `Shoes`, or `Footpads`
- see one `1x1` card per item with an empty preview box and no repo-backed preview auto-loaded
- click a card preview box or choose `Load Preview` only for the item or items the user wants
- see that preview load into the matching card preview box without adding it to project/content truth yet
- if more than one item is selected, let the same preview action load temporary previews into each selected card box
- optionally open the item page when the user wants the larger preview surface, description, and commit action
- keep a Catalog-owned preview-loaded item list so those temporary previews can survive closing and reopening `Catalog` during the running session
- let the user unload preview items from that list when performance starts to dip
- choose `Add To Project` only when the item should become real project content

Important rule:
- `Load Preview` is temporary preview state
- `Add To Project` is the explicit commit action that should hand the asset into Browser/project truth and visible model content
- the preview-loaded list is still temporary Catalog session state, not project truth

Important supporting rule:
- preview should be user-triggered, not automatic for every card in the catalog grid

##### 4. `Catalog` Must Not Become A Hidden Runtime Owner

After a catalog item is loaded, the catalog should not remain the only place that knows it exists.

The loaded result should become visible through the correct owner:
- Browser/project content
- Model Viewport environment/view settings
- later explicit preset/content systems

Important rule:
- the catalog may be the source of a reusable asset
- it should not be the hidden sole owner of the loaded result

##### 5. Curated Catalog Reuse Must Stay Separate From User Import

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

##### 6. HDRIs Must Stay Optional And Explicit

HDRIs belong in the catalog, but environment changes should stay intentional.

Important rule:
- browsing HDRIs should be easy
- applying an HDRI should still be an explicit user choice
- later viewer behavior should keep HDRI usage optional rather than silently on by default

##### 7. The Family Must Stay Generic Enough To Grow

The first catalog targets may lean toward hooks, shoes, footpads, and HDRIs, but the workspace should not hard-code itself into only one product-specific grouping forever.

Important current-state rule:
- before those reference families become selectable catalog entries, `Generation 0` should remove them from the default `Browser` baseline

Important rule:
- keep the catalog generic enough that later reusable reference families, presets, and template-like assets can fit without a full workspace rewrite

#### Success Read

When `Catalog` is working well, the user should be able to say:
- "I can browse the reusable assets that ship with this repo."
- "I can also find previously uploaded imported items in an `Imports` area and place another copy if I deleted one."
- "I can also browse curated external catalog items when ParaHook chooses to integrate them."
- "I can add foothooks, shoes, and footpads later if I want them, instead of starting with them already sitting in Browser."
- "I can choose a pre-built PubWheel from the catalog and load it into the model as a starting point."
- "I can filter down to the family I want."
- "I can filter by real platform family and part type without the system guessing from names."
- "I can ask whether a part or part combination will work, and the catalog can answer clearly."
- "I can open a PubWheel Builder, see the required full-build parts, and fill those slots from the catalog."
- "I can understand when a sub-assembly such as a rear box is still missing required internals or when a part physically does not fit."
- "I can browse a clean card grid without the catalog auto-loading everything."
- "I can preview only the items I care about, and those previews load into the matching card boxes instead of committing automatically."
- "I can preview more than one selected item at a time, keep those temporary previews loaded while I browse, and unload them if performance starts to dip."
- "If I close and reopen Catalog during the same run, my temporary preview-loaded items are still there."
- "I can open an item page with a larger preview surface, read the description, and then decide whether to add it to the project."
- "Loading it makes a clear explicit change in the right downstream system."
- "The catalog helps me reuse stored assets without confusing them with my project's authored truth."

#### Summary

The umbrella direction is now:
- ParaHook should have a real `Catalog` workspace organized as explicit generations
- `Generation 0` is now the completed cleanup-and-prep generation that removed the old Browser-resident preload for reference models such as foothooks, shoes, and footpads
- `Generation 1` is now the first real repo-backed curated browse-and-load catalog for later optional foothooks, shoes, footpads, `HDRIs`, and similar stored references
- `Generation 1` may also include an `Imports` area for previously uploaded items that are already inside ParaHook, without making `Catalog` own import intake
- `Generation 2` should widen that catalog to include curated external integrations such as `pubparts.xyz`, linked `3D` model entries more generally, broader platform-normalization rules, and pre-built PubWheel starting assemblies
- `Generation 3` should turn the `Generation 2` compatibility groundwork into a real compatibility-check system that can tell the user whether a part or build combination should work
- the catalog should remain a curated browse-and-load surface, not a second hidden content owner
- reference-style assets should support empty card preview boxes, explicit temporary preview loading, and a Catalog-owned preview session before commit, and should only become Browser/project truth after explicit `Add To Project`
- loaded items should become explicit downstream truth in Browser/project content, viewer environment state, or other honest owner seams depending on the asset type

## [x] Generation 0 - Cleanup And Prep Before Catalog Family Start

### Generation 0 Summary

`Generation 0` is the completed cleanup-and-prep generation before the first real Catalog runtime.

It exists to make the later Catalog family honest by removing old Browser-resident reference preload behavior and separating prep from the first real curated catalog surface.

### Generation 0 HLG Checklist

- [x] `Catalog-Gen0-HLG-1. remove default Browser-resident reference preload behavior before the first real Catalog family starts`
- [x] `Catalog-Gen0-HLG-2. keep prep and cleanup separate from the first real Catalog runtime generation`
- [x] `Catalog-Gen0-HLG-3. prepare the Catalog family boundary so later repo-backed assets return only as intentional optional choices`

### Generation 0 Vision Rails

#### Final Generation Vision

The final read for `Generation 0` is that ParaHook no longer treats repo-backed reference models as default Browser content.

The user should open the app without inherited Catalog-like reference clutter already sitting in Browser/project truth. Later hooks, shoes, footpads, HDRIs, and other curated assets should return only through explicit Catalog choices.

#### Owns

- inventorying pre-Catalog behavior that leaked through Browser, viewer, shell, or HDRI-adjacent seams
- removing default Browser-resident reference preload behavior
- making prep and cleanup visible as their own generation
- preparing the first Catalog family boundary so `Generation 1` can build instead of rediscovering drift

#### Does Not Own

- the real Catalog workspace surface
- manifest-backed catalog item runtime
- preview, card grid, or item-page behavior
- Add To Project behavior
- HDRI apply behavior
- external-source intake or compatibility checks

#### Phase Creation Read

No new `Generation 0` family phases should be created unless a regression reintroduces preloaded reference clutter or blurs prep into runtime behavior.

If the work adds real catalog browsing, previewing, applying, or loading, it belongs to `Generation 1`.

## [~] Generation 1 - Repo-Backed Curated Catalog

### Generation 1 Summary

`Generation 1` is the first real Catalog product shape: a repo-backed, curated, preview-first workspace where the user browses reusable ParaHook assets and intentionally applies or adds them.

This generation should establish the Catalog organization model before PubParts or other external sources arrive.

### Generation 1 HLG Checklist

- [x] `Catalog-Gen1-HLG-1. let the user keep the model visible while browsing reusable assets in a real Catalog workspace surface`
- [x] `Catalog-Gen1-HLG-2. let repo-backed reusable assets return as intentional optional choices instead of default Browser-resident content`
- [x] `Catalog-Gen1-HLG-3. let the user browse clear item families such as foothooks, shoes, footpads, HDRIs, imports, and later reusable references or preset families`
- [x] `Catalog-Gen1-HLG-4. keep preview, commit, and apply behavior honest by asset type`
- [x] `Catalog-Gen1-HLG-5. let reference-style items preview temporarily before explicit Add To Project`
- [x] `Catalog-Gen1-HLG-6. make Add To Project hand reference items into Browser/project truth instead of leaving them catalog-local`
- [ ] `Catalog-Gen1-HLG-7. keep Browser organization truthful to what the user actually added`
- [x] `Catalog-Gen1-HLG-8. let HDRIs remain optional environment/viewer choices that apply only when the user explicitly chooses them`
- [ ] `Catalog-Gen1-HLG-9. let the user browse and apply repo-backed or user-selected HDRI/EXR environments without pretending they are project geometry`
- [x] `Catalog-Gen1-HLG-10. keep imported user files and curated repo assets distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen1-HLG-11. add more repo-backed part families beyond the first hooks, shoes, and footpads so Catalog becomes the place users browse real reusable parts that ship with the repo`
- [ ] `Catalog-Gen1-HLG-12. organize repo-backed parts into clear first-pass systems and families instead of one flat asset pile`
- [ ] `Catalog-Gen1-HLG-13. let the user switch the Catalog organization between a Part view and a Platform view`
- [ ] `Catalog-Gen1-HLG-14. let the user filter by part type or by platform compatibility without those two browse modes fighting each other`
- [ ] `Catalog-Gen1-HLG-15. introduce the first practical filter model for repo-backed parts, starting from structured metadata such as system, part type, platform compatibility, product name, and position`
- [ ] `Catalog-Gen1-HLG-16. define the first canonical local Catalog systems, platform families, and part groups before external-source integration begins`
- [ ] `Catalog-Gen1-HLG-17. normalize repo-backed parts by real fitment truth instead of only by current source folder or filename`
- [ ] `Catalog-Gen1-HLG-18. make filter behavior predictable, with OR inside one filter group and AND across different filter groups`
- [ ] `Catalog-Gen1-HLG-19. keep the first filter system practical for Generation 1 while leaving room for PubParts source mapping and later compatibility checks`
- [x] `Catalog-Gen1-HLG-20. preserve enough loaded-item identity that downstream systems can remember what curated asset was chosen without turning Catalog into the hidden long-term owner`
- [ ] `Catalog-Gen1-HLG-21. organize local repo-backed parts by system ownership such as Platform, Wheel, and later Hardware before external source intake`
- [ ] `Catalog-Gen1-HLG-22. define canonical local platform families and multi-platform compatibility metadata for ADV, XR, GT, Pint, XR Classic, and Other`
- [ ] `Catalog-Gen1-HLG-23. define first-pass part groups such as Footpads, Bumpers, Rails, Motors, Tires, Boxes, Axle Blocks, FootHolds, Shoes, and Screw & Nuts`
- [ ] `Catalog-Gen1-HLG-24. let Part view and Platform view read from the same structured item metadata instead of becoming separate catalog truths`
- [ ] `Catalog-Gen1-HLG-25. map asset name shapes into explicit metadata fields such as system, platform compatibility, part type, product name, position, motor version, tire size, and compound`
- [ ] `Catalog-Gen1-HLG-26. support wheel-specific fitment fields for motors and tires without forcing wheel-side parts into platform-only filters`

### Generation 1 Vision Rails

#### Final Generation Vision

The final `Generation 1` vision is that `Catalog` feels like a real workspace surface, not a Browser subsection or toolbar picker.

The user should be able to keep the model visible, open Catalog in a workspace pane, browse organized repo-backed assets, load previews only when wanted, compare preview-loaded cards, and then explicitly commit chosen reference-style items into Browser/project truth through `Add To Project`.

HDRIs and EXR environments should also be browseable in this generation, but they must read differently from geometry. They are environment/viewer choices, not project geometry. The user should be able to browse repo HDRIs, browse for a local HDRI or EXR, apply one to the scene, see a simple visual preview, and tune basic environment controls such as background visibility and intensity through the appropriate downstream environment/viewer ownership.

The first repo-backed parts model should be practical and local. Catalog should support organizing/filtering by `Part` or by `Platform`, with both views reading the same metadata instead of creating separate truths. The first filter system should support structured fields such as system, part group, platform compatibility, product name, position, and asset/source identity.

#### Index Setup Guidance

Use this section as the `Generation 1` Vision Rails source when creating or updating `Catalog-Gen1-Index.md`.

This is not an implementation spec. It should give the index enough stable product and ownership truth to derive:
- HLG
- CLG
- wishlist organization
- phase summaries
- later phase-specific implementation specs

The `Catalog-Gen1-Index.md` setup should preserve these `Generation 1` summaries instead of compressing them into one flat filter wish.

#### Workspace And Browse Summary

`Catalog` should be a real workspace surface that can sit beside the model viewport. It should feel like a curated repo-backed library, not a Browser subsection, toolbar picker, or raw folder list.

The first browse shape should stay preview-first and explicit:
- browse repo-backed and already-known imported assets
- keep cards lightweight until the user asks for preview
- support item pages as the deeper decision surface
- keep temporary preview state separate from project truth
- let reference-style items become Browser/project truth only through explicit `Add To Project`

#### Downstream Ownership Summary

`Generation 1` should lock the basic downstream owner split:
- reference-style geometry commits to Browser/project truth
- HDRI and EXR entries apply through environment/viewer ownership
- already-imported user files may appear in Catalog as reuse entries, but Catalog does not own import intake
- Catalog may remember which curated item was chosen, but it must not become the hidden runtime owner after load

#### Local Part Taxonomy Summary

`Generation 1` should define the local repo-backed part vocabulary before `Generation 2` maps external sources into it.

The first local systems should be:
- `Platform`
  - board/frame/platform-owned parts
  - examples: rails, boxes, bumpers, footpads, and axle blocks when they are platform-fitment parts
- `Wheel`
  - wheel-side parts
  - examples: motors, tires, and later hubs
- later `Hardware`
  - fasteners, screws, nuts, and small hardware when they need their own browse lane

Systems are not the same thing as platform families.

The first platform families should be:
- `ADV`
- `XR`
- `GT`
- `Pint`
- `XR Classic`
- `Other`

Important platform rules:
- a part may support more than one platform family
- platform compatibility should be stored as structured multi-value metadata
- `GT` is the broad platform family
- `GTS` should be a narrower compatibility note where needed, not a separate top-level platform by default
- later PubParts `Floatwheel` source naming should map into `ADV` during `Generation 2`

The first part groups should be:
- `Footpads`
- `Bumpers`
- `Rails`
- `Motors`
- `Tires`
- `Boxes`
- `Axle Blocks`
- `FootHolds`
- `Shoes`
- `Screw & Nuts`

#### Main Filter Types Summary

The main Generation 1 filter types should be:
- `System`
  - `Platform`
  - `Wheel`
  - later `Hardware`
- `Platform Compatibility`
  - `ADV`
  - `XR`
  - `GT`
  - `Pint`
  - `XR Classic`
  - `Other`
- `Part Type`
  - `Footpads`
  - `Bumpers`
  - `Rails`
  - `Motors`
  - `Tires`
  - `Boxes`
  - `Axle Blocks`
  - `FootHolds`
  - `Shoes`
  - `Screw & Nuts`
- `Position`
  - `Front`
  - `Rear`
  - `Pair`
  - `Universal`
- `Product Name`
- `Brand`
- `Source Kind`
  - repo-backed
  - imported
  - later external-linked
- `Action`
  - `Load Preview`
  - `Add To Project`
  - `Apply Environment`

Type-specific fields should appear when the selected part type needs them.

For motors, useful fields include:
- `Motor Family`
- `Motor Version`
- later narrower fields such as connector or stator compatibility when those distinctions are real

For tires, useful fields include:
- `Brand`
- `Size`
- `Compound`

Filter behavior should be predictable:
- use OR behavior inside one filter group
- use AND behavior across different filter groups

That means `XR` plus `GT` broadens platform-compatible results, while `XR` plus `Footpads` narrows to footpads compatible with `XR`.

#### Structured Metadata Summary

Asset names and slugs can stay useful as ids, but the runtime filter system should read explicit fields first.

Examples like:
- `XR_Footpad_Kush-Wide_Front`
- `GT_Footpad_Low-Boy_Rear`
- `Motor_Hypercore_6.5-GT`
- `Motor_Cannoncore_6.0-ADV`
- `Motor_Hypercore_6.0-XR`
- `Tire_Burris_11.5x7.0_Soft`
- `Tire_TFL_12.0x6.9_ThunderCat`

should map into structured fields such as:
- system
- platform compatibility
- part type
- product name
- position
- motor family
- motor version
- brand
- tire size
- compound
- source kind
- action

#### Generation Boundary Summary

`Generation 1` owns the local repo-backed taxonomy, local filter behavior, repo-backed source identity, preview/commit/apply ownership, and the practical metadata vocabulary that local Catalog entries need.

`Generation 2` should map PubParts and other curated external source data into this vocabulary instead of inventing a second taxonomy.

`Generation 3` should use this metadata as the basis for compatibility answers instead of replacing visible metadata with hidden rules.

#### Owns

- the real Catalog workspace or split-pane surface
- repo-backed curated asset families
- first-pass asset family organization for foothooks, shoes, footpads, HDRIs, imports, and later local reusable references
- card grid, item page, preview box, `Load Preview`, multi-card preview loading, and preview unload concepts
- `Load All Displayed Previews` as an explicit preview-session action
- `Add To Project` handoff for reference-style geometry
- honest Browser collection creation after add, including one reused `Shoes` parent when shoes are actually added
- repo-backed HDRI inventory from `public/HDRI`
- local HDRI or EXR browse/apply entry point
- simple HDRI thumbnail and simple applied-HDRI preview read
- first local systems, platform families, part groups, and filter behavior
- distinguishing curated repo assets from already-known imported user files
- enough loaded-item identity for downstream systems to remember what was chosen

#### Does Not Own

- importing new arbitrary user files into ParaHook from scratch
- PubParts or other external source adapters
- linked-source item pages, Dropbox archive inspection, or external attribution workflow
- true compatibility checking
- `Ricky Checker`
- PubWheel Builder
- dimensional fit or packaging math
- becoming the long-term owner of loaded project content or active environment state

#### Phase Creation Read

Create `Generation 1` family phases when work is about the local Catalog foundation: surface, repo-backed item records, preview mechanics, Add To Project ownership, Browser organization cleanup, local HDRI browse/apply, local part/platform taxonomy, or first practical filters.

Do not put PubParts, linked archives, compatibility truth, PubWheel Builder slots, or dimensional checks in `Generation 1` unless the phase is only preparing local metadata that later generations will consume.

## [ ] Generation 2 - External Catalog Integration And Linked 3D Model Entries

### Generation 2 Summary

`Generation 2` widens Catalog from local repo-backed curation into curated external-source integration.

The first proof target is PubParts, but the generation should define the source-mapping model broadly enough that external linked `3D` model entries can enter Catalog honestly without becoming generic web browsing.

### Generation 2 HLG Checklist

- [ ] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`
- [ ] `Catalog-Gen2-HLG-4. let Catalog carry pre-built PubWheel starting assemblies without making them the same thing as individual part listings`

### Generation 2 Vision Rails

#### Final Generation Vision

The final `Generation 2` vision is that trusted external catalog sources can appear in the same Catalog workspace while staying visibly distinct from repo-backed assets.

PubParts should map into the `Generation 1` Catalog vocabulary rather than defining ParaHook's runtime truth. External records should be normalized into the same systems, platform families, part groups, and metadata fields where possible, with source metadata preserving where the entry came from and what kind of action it supports.

Some entries may be linked model records instead of repo-local assets. Catalog should be able to show them, identify the source provider, expose source links, and route any download/import/open action honestly. If a PubParts entry points to a Dropbox folder, ZIP file, or linked model page, the item should say that instead of pretending the asset already exists locally.

Pre-built PubWheel starting assemblies may also become Catalog entries in this generation, but they should read as full-build assemblies or starting configurations, not as the same thing as individual part listings.

#### Owns

- curated external source integration
- PubParts as the first external source proof target
- source adapters that normalize external entries into the ParaHook Catalog metadata shape
- explicit source metadata such as source kind, provider, source page URL, linked model URL, linked archive URL, attribution, and source notes
- externally linked item records whose model data does not yet ship with the repo
- honest handoff actions for source pages, linked models, and linked archives
- mapping PubParts `Floatwheel`-style source naming into ParaHook platform vocabulary such as `ADV`
- pre-built PubWheel starting-assembly entries as curated full-build assembly/start records

#### Does Not Own

- redefining the Generation 1 local taxonomy from scratch
- open-ended internet search
- arbitrary web browsing inside Catalog
- replacing the normal user import path
- pretending linked files are local files before handoff/import has happened
- compatibility checking or PubWheel Builder slot validation
- dimensional proof

#### Phase Creation Read

Create `Generation 2` family phases when work is about external source records, source adapters, PubParts mapping, linked model entries, linked archive handoff, source attribution, or pre-built PubWheel entries.

If a phase changes the local part/platform taxonomy, it should explain whether it is correcting a `Generation 1` local model or adding source-mapping metadata needed only for external integration.

## [ ] Generation 3 - Compatibility Check Catalog

### Generation 3 Summary

`Generation 3` turns curated Catalog metadata into an explainable compatibility-check system.

The first compatibility layer is the `Ricky Checker`: a manually curated rule-based read that can answer whether parts, assemblies, or PubWheel Builder selections should work together.

### Generation 3 HLG Checklist

- [ ] `Catalog-Gen3-HLG-1. turn curated compatibility metadata into a clear user-facing compatibility check`
- [ ] `Catalog-Gen3-HLG-2. let the user ask whether a part or part combination should work and receive an honest true, false, possible, or unknown read`
- [ ] `Catalog-Gen3-HLG-3. introduce the Ricky Checker as the first curated rule-based compatibility layer`
- [ ] `Catalog-Gen3-HLG-4. let the later PubWheel Builder fill required full-build slots from Catalog item truth instead of inventing a second part universe`

### Generation 3 Vision Rails

#### Final Generation Vision

The final `Generation 3` vision is that the user can ask Catalog whether a part fits a PubWheel build, whether one part works with another part, or whether a current PubWheel Builder selection is valid.

The answer should be explicit, explainable, and honest. A compatibility result should read as `true`, `false`, `unknown`, or later `possible`, with enough reason text to tell the user what the repo knows and what it does not know.

The `Ricky Checker` should be named and framed as curated human fitment knowledge encoded as rules. It is stronger than tags, but it is not a geometric proof engine. It should build on `Generation 1` and `Generation 2` metadata instead of replacing that metadata with hidden guesses.

The PubWheel Builder direction also belongs here. Builder should reuse Catalog item truth, present a required full-build slot list, let the user fill slots from compatible Catalog items, and evaluate whether the build is complete and compatible.

#### Owns

- user-facing compatibility results for selected parts, part combinations, loaded PubWheel builds, and pre-built PubWheel records
- `Ricky Checker` naming, rule contract, and explainable result language
- curated allowed-part rules
- known part-to-part and part-to-assembly relationships
- PubWheel Builder-owned required slot list
- PubWheel Builder sub-part requirements for assemblies such as rear boxes
- validation of whether a PubWheel Builder selection is complete and compatible
- compatibility reads such as `true`, `false`, `unknown`, and later `possible`

#### Does Not Own

- inventing compatibility without curated truth
- replacing visible metadata tags with hidden checks
- dimensional volume/size proof
- final packaging math
- arbitrary automated inference from filenames alone
- creating a second part universe separate from Catalog item truth

#### Phase Creation Read

Create `Generation 3` family phases when work is about compatibility rule records, compatibility result UI, selected-item compatibility checks, PubWheel build checks, Ricky Checker explanations, PubWheel Builder slots, or builder completion validation.

If a phase needs geometry dimensions or packaging math to answer, it probably belongs to `Generation 3.5` unless `Generation 3` is only preparing the rule surface.

#### PubWheel Builder Direction

`Generation 3` should also introduce a `PubWheel Builder` as part of the catalog experience.

This should not be only a loose browse surface.

It should also be able to act like a full-build recipe or build checklist that starts with an empty list of required parts and lets the user fill those slots from the catalog.

The first intended PubWheel Builder read is:
- the app knows the main parts a complete PubWheel build needs
- the PubWheel Builder presents those required slots clearly
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
- the PubWheel Builder should start from a curated required-parts list, not from a blank unstructured shopping cart
- the slot list is what makes the PubWheel Builder read as `build a PubWheel` instead of only `collect some parts`

Important sub-assembly rule:
- some PubWheel Builder parts should own their own sub-parts list
- a `Rear Box` is one important example
- the rear box may require:
  - `Battery`
  - `BMS`
  - supporting wires or electronics
- the compatibility system should eventually evaluate both the outer PubWheel recipe and these inner sub-assembly requirements

Healthy `Generation 3` read:
- `Catalog`
  - browse parts, assemblies, boards, and external-linked items
- `PubWheel Builder`
  - fill the required full-build slots with chosen catalog items
  - check whether the resulting PubWheel is complete and compatible

Important rule:
- the PubWheel Builder should reuse catalog item truth instead of inventing a second separate part universe
- one part catalog should feed both normal browsing and the PubWheel Builder slot system

## [ ] Generation 3.5 - Dimensional Fit And Packaging Checks

### Generation 3.5 Summary

`Generation 3.5` strengthens the `Generation 3` compatibility system with dimensional fit and packaging checks.

This generation is intentionally a layer on top of Ricky Checker truth, not a replacement for curated allowed-part rules.

### Generation 3.5 HLG Checklist

- [ ] `Catalog-Gen3.5-HLG-1. add dimensional fit and packaging checks on top of the curated Generation 3 compatibility rules`
- [ ] `Catalog-Gen3.5-HLG-2. use rear-box packaging as the first strong proof case for geometry-backed fit checks`
- [ ] `Catalog-Gen3.5-HLG-3. keep dimensional checks as a strengthening layer instead of replacing the earlier curated Ricky Checker truth`

### Generation 3.5 Vision Rails

#### Final Generation Vision

The final `Generation 3.5` vision is that Catalog can reject or warn on combinations that are logically allowed but physically do not fit, when ParaHook has enough geometry or dimension metadata to say so honestly.

The first strong proof case should be rear-box packaging. A selected rear box may be allowed by Ricky Checker rules but still fail dimensional packaging because the chosen battery, BMS, or supporting electronics do not fit inside the available space.

The dimensional read should eventually consider volume, width, length, and height. It should strengthen compatibility answers only when the repo has enough reliable dimensional truth.

#### Owns

- dimension-backed fit checks on top of curated compatibility rules
- rear-box packaging as the first proof case
- volume, width, length, and height metadata where available
- user-facing explanation when a curated-compatible part fails physical packaging
- layered compatibility results that can distinguish rule failure from dimensional failure

#### Does Not Own

- replacing Ricky Checker
- claiming geometric proof without dimension truth
- broad CAD collision solving before the first packaging proof works
- rewriting the Catalog browse taxonomy
- moving PubWheel Builder ownership away from Catalog item truth

#### Phase Creation Read

Create `Generation 3.5` family phases when work is about dimensions, packaging, physical fit checks, rear-box battery/BMS fit, or explaining why a physically constrained assembly fails.

If the work only says whether a part is allowed by curated rules, it belongs to `Generation 3`.
