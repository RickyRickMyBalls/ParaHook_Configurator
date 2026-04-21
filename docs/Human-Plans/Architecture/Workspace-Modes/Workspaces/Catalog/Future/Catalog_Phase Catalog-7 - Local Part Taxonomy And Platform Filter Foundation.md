# [x] `Catalog-7` - `Local Part Taxonomy And Platform Filter Foundation`

## Doc Header

### Doc History
15. 2026-04-20 14:25: Recorded the `Catalog-7 / Phase 4` implementation closeout after the local `CatalogItemWheelFitment` contract, repo/import pass-through readiness, item-page detail helper/rendering path, and focused contract/source/helper tests landed without fabricating live motor or tire Catalog records, reopening filters, mapping PubParts, or adding compatibility/build/dimensional behavior.
14. 2026-04-20 14:22:25: Prepared `Catalog-7 / Phase 4` for implementation by recording the live Catalog contract, seed, source, shared-helper, item-page, asset, and focused-test seams for narrow wheel-specific motor and tire fitment fields while preserving the no-PubParts/no-external/no-verdict/no-builder/no-dimensional-proof boundary before the `Catalog-Gen2-3` gate.
13. 2026-04-19 13:08:15: Added the missing top-level `## Vision` section so this active Catalog-7 Family Phase Doc matches the current Architecture Setup guide-rail order before `## Wishlist Organization`, while preserving the shipped Phase 1 through Phase 3 read and leaving Phase 4 as the next open implementation phase.
12. 2026-04-19 10:32:03: Recorded the Catalog-7 Phase 3 implementation closeout after grouped local taxonomy filters replaced the flat selected-tag gate, preserving OR inside each selected group, AND across selected groups, separate search narrowing, and browse-mode presentation independence with focused source, shell, and surface tests plus `npm run build`.
11. 2026-04-19 10:17:24: Tightened the Phase 3 prep read so implementation can replace the flat `selectedTags` surface with grouped filter state while keeping ownership in the existing shell/helper seam.
10. 2026-04-19 10:15:42: Tightened the Phase 3 prep read so the implementation spec names the live `CatalogShell` search/tag state, the current flat `every` tag gate in `catalogShellShared`, and the exact OR-within-group and AND-across-groups filter contract before implementation dispatch.
9. 2026-04-19 10:12:51: Cleaned up the Phase 2 closeout doc shape so Wishlist Organization keeps a compact Phase 2 checklist and the implementation-ready Phase 2 section remains the single top-level phase record.
8. 2026-04-19 10:08:46: Repaired the Catalog-7 Phase 2 browse semantics so Part browse sections are derived from `partGroups` and Platform browse sections are derived from `platformCompatibility`, while imports and HDRIs stay on honest special lanes and the focused shell and surface proofs were rerun.
7. 2026-04-19 10:02:02: Recorded the Catalog-7 Phase 2 implementation closeout after adding Part and Platform browse reads over the shared Catalog metadata contract, keeping browse-mode switching shell-owned and presentation-only, and proving the mode switch with focused shell and surface tests.
6. 2026-04-19 09:53:39: Tightened the Phase 2 prep gate to name the focused Catalog shell test path alongside the heavier surface proof before implementation dispatch.
5. 2026-04-19 09:50:57: Prep-only live inspection of `CatalogShell`, `CatalogShellGridMode`, `CatalogShellBrowseRail`, `catalogShellShared`, `CatalogShell.test.tsx`, and `CatalogSurface.test.tsx` confirmed the Phase 2 browse-mode seam stays inside the shared shell and existing surface tests before any runtime edits.
4. 2026-04-19 09:48:34: Tightened the Phase 1 closeout read so HLG that still depend on later filter semantics or motor/tire field work stay marked partial instead of fully complete.
3. 2026-04-19 09:40:16: Recorded the Catalog-7 Phase 1 implementation closeout after the local taxonomy contract and seed metadata fields landed for the repo-backed reference families, focused contract/source tests passed, and Phase 2 remained the next open lane.
2. 2026-04-19 09:40:16: Tightened the Catalog-7 CLG checklist formatting so field names remain inline code while full CLG sentences stay readable as planning checklist text.
1. 2026-04-19 09:34:25: Created this standalone Catalog-7 future doc from the Catalog vision and index so the local part-taxonomy and platform-filter foundation can carry a Codex-sized phase ladder with coverage, summaries, implementation specs, likely files, verification shapes, and done shapes without widening into runtime behavior.

### Purpose

This doc defines the `Catalog-7` local part-taxonomy and platform-filter foundation for `Generation 1`.

Use it to answer:
- how Catalog should define its own local taxonomy before external source intake
- how the first repo-backed parts should be grouped, filtered, and browsed
- how `Part` view and `Platform` view should read from one structured item contract
- how later external-source mapping must target ParaHook's own catalog vocabulary instead of replacing it
- how this lane stays local, repo-backed, and implementation-ready without touching runtime behavior yet

### Scope

This doc covers:
- local taxonomy contract and seed metadata
- browse-mode split between `Part` view and `Platform` view
- filter semantics for part type, platform compatibility, and other structured metadata
- wheel-side fitment fields for motors and tires
- the Codex-sized phase ladder for the Catalog-7 foundation

This doc does not cover:
- `Generation 2` PubParts or external-source intake
- linked archives or Dropbox-backed entries
- user-facing compatibility verdicts or builder slots
- dimensional fit, packaging math, or geometry-backed checks
- runtime implementation before the owning phase is actually dispatched

## Doc Body

### Why This Phase Exists

Catalog already knows how to browse assets and apply HDRIs. The next honest step is to give the local parts lane a stable vocabulary that can describe repo-backed items without flattening them into filenames or source folders.

This phase family exists so Catalog can:
- organize local parts into systems and part groups
- expose a `Part` browse read and a `Platform` browse read over the same item truth
- let filters behave predictably
- keep the local taxonomy vocabulary ready for later PubParts mapping without importing external-source assumptions too early
- reserve wheel-side fitment detail for the parts that actually need it

### Current Live Read

The current vision and index already mark Catalog-7 as the next open local taxonomy lane. This future doc now makes that lane implementation-ready without starting runtime behavior.

The local catalog vocabulary that should remain authoritative here is:
- `System`
- `Platform Compatibility`
- `Part Type`
- `Position`
- `Product Name`
- `Brand`
- `Source Kind`
- `Action`

The local platform families should remain:
- `ADV`
- `XR`
- `GT`
- `Pint`
- `XR Classic`
- `Other`

The first-pass part groups should remain:
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

### Phase Ladder

- Phase 1 seeds the local taxonomy contract and seed metadata.
- Phase 2 adds `Part` and `Platform` browse modes over the same structured item truth.
- Phase 3 made filter semantics predictable across the shared shell and source helpers.
- Phase 4 adds wheel-specific fitment fields and item-detail presentation for motors and tires.

### Coverage Table

| Phase | HLG coverage | CLG coverage | Likely files |
| --- | --- | --- | --- |
| Phase 1 | `Catalog-Gen1-HLG-11`, `Catalog-Gen1-HLG-12`, `Catalog-Gen1-HLG-15`, `Catalog-Gen1-HLG-16`, `Catalog-Gen1-HLG-21`, `Catalog-Gen1-HLG-22`, `Catalog-Gen1-HLG-23`, `Catalog-Gen1-HLG-25` | `Catalog-Gen1-CLG-6`, `Catalog-Gen1-CLG-15`, `Catalog-Gen1-CLG-16`, `Catalog-Gen1-CLG-17`, `Catalog-Gen1-CLG-19`, `Catalog-Gen1-CLG-22` | `src/app/catalog/catalogItemContract.ts`, `src/app/catalog/catalogSeedItems.ts`, `src/app/catalog/catalogSource.ts`, `src/app/catalog/catalogSource.test.ts` |
| Phase 2 | `Catalog-Gen1-HLG-13`, `Catalog-Gen1-HLG-14`, `Catalog-Gen1-HLG-24` | `Catalog-Gen1-CLG-7`, `Catalog-Gen1-CLG-18` | `src/app/catalog/ui/CatalogShell.tsx`, `src/app/catalog/ui/CatalogShellGridMode.tsx`, `src/app/catalog/ui/CatalogShellBrowseRail.tsx`, `src/app/catalog/ui/catalogShellShared.ts`, `src/app/catalog/ui/CatalogShell.test.tsx`, `src/app/workspace/CatalogSurface.test.tsx` |
| Phase 3 | `Catalog-Gen1-HLG-14`, `Catalog-Gen1-HLG-15`, `Catalog-Gen1-HLG-18`, `Catalog-Gen1-HLG-19` | `Catalog-Gen1-CLG-8`, `Catalog-Gen1-CLG-14`, `Catalog-Gen1-CLG-21` | `src/app/catalog/catalogActionPlan.ts`, `src/app/catalog/catalogSource.ts`, `src/app/catalog/ui/CatalogShell.tsx`, `src/app/catalog/ui/catalogShellShared.ts`, `src/app/workspace/CatalogSurface.test.tsx` |
| Phase 4 | `Catalog-Gen1-HLG-17`, `Catalog-Gen1-HLG-21`, `Catalog-Gen1-HLG-25`, `Catalog-Gen1-HLG-26` | `Catalog-Gen1-CLG-17`, `Catalog-Gen1-CLG-19`, `Catalog-Gen1-CLG-20`, `Catalog-Gen1-CLG-22` | `src/app/catalog/catalogItemContract.ts`, `src/app/catalog/catalogSeedItems.ts`, `src/app/catalog/catalogSource.ts`, `src/app/catalog/ui/catalogShellShared.ts`, `src/app/catalog/ui/CatalogShellItemPage.tsx`, `src/app/catalog/catalogItemContract.test.ts`, `src/app/catalog/catalogSource.test.ts`, `src/app/catalog/ui/catalogShellShared.test.ts`, `src/app/workspace/CatalogSurface.test.tsx` |

### Acceptance Read

This future doc is ready for Phase 1 implementation when:
- every Catalog-7 HLG and CLG above is linked to at least one phase
- each phase only claims the HLG and CLG it actually advances
- the local taxonomy contract is narrow enough to implement without widening into PubParts or compatibility verdicts
- the phase ladder is small enough to dispatch one Codex-sized task at a time

## Vision

Catalog-7 is the `Generation 1` local taxonomy and platform-filter foundation lane.

This Family Phase Doc turns the `Catalog-Gen1-Index.md` part, platform, and local metadata direction into four Codex-sized implementation phases:
- local taxonomy contract and seed metadata
- `Part` and `Platform` browse modes over the same catalog item truth
- predictable grouped filter semantics
- wheel-specific motor and tire fitment metadata

The promise is narrow: Catalog should have a local repo-backed vocabulary that is practical now and stable enough for later PubParts, compatibility, PubWheel Builder, and dimensional-fit generations to map into.

This family phase does not make Catalog the owner of external source intake, compatibility verdicts, builder slots, or dimensional proof.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen1-HLG-11. add more repo-backed part families beyond the first hooks, shoes, and footpads so Catalog becomes the place users browse real reusable parts that ship with the repo`
- [x] `Catalog-Gen1-HLG-12. organize repo-backed parts into clear first-pass systems and families instead of one flat asset pile`
- [x] `Catalog-Gen1-HLG-13. let the user switch the Catalog organization between a Part view and a Platform view`
- [~] `Catalog-Gen1-HLG-14. let the user filter by part type or by platform compatibility without those two browse modes fighting each other`
- [~] `Catalog-Gen1-HLG-15. introduce the first practical filter model for repo-backed parts, starting from structured metadata such as system, part type, platform compatibility, product name, and position`
- [x] `Catalog-Gen1-HLG-16. define the first canonical local Catalog systems, platform families, and part groups before external-source integration begins`
- [~] `Catalog-Gen1-HLG-17. normalize repo-backed parts by real fitment truth instead of only by current source folder or filename`
- [x] `Catalog-Gen1-HLG-18. make filter behavior predictable, with OR inside one filter group and AND across different filter groups`
- [x] `Catalog-Gen1-HLG-19. keep the first filter system practical for Generation 1 while leaving room for PubParts source mapping and later compatibility checks`
- [x] `Catalog-Gen1-HLG-21. organize local repo-backed parts by system ownership such as Platform, Wheel, and later Hardware before external source intake`
- [x] `Catalog-Gen1-HLG-22. define canonical local platform families and multi-platform compatibility metadata for ADV, XR, GT, Pint, XR Classic, and Other`
- [x] `Catalog-Gen1-HLG-23. define first-pass part groups such as Footpads, Bumpers, Rails, Motors, Tires, Boxes, Axle Blocks, FootHolds, Shoes, and Screw & Nuts`
- [x] `Catalog-Gen1-HLG-24. let Part view and Platform view read from the same structured item metadata instead of becoming separate catalog truths`
- [x] `Catalog-Gen1-HLG-25. map asset name shapes into explicit metadata fields such as system, platform compatibility, part type, product name, position, motor version, tire size, and compound`
- [x] `Catalog-Gen1-HLG-26. support wheel-specific fitment fields for motors and tires without forcing wheel-side parts into platform-only filters`

### Codex Level Goals

- [x] Catalog-Gen1-CLG-6. Define the local repo-backed part taxonomy and filter metadata before PubParts integration.
- [x] Catalog-Gen1-CLG-7. Support Part and Platform browse modes from the same item metadata.
- [x] Catalog-Gen1-CLG-8. Make filter behavior predictable with OR inside a filter group and AND across groups.
- [x] Catalog-Gen1-CLG-14. Keep Gen 1 practical while leaving PubParts, PubWheel Builder, Ricky Checker, and dimensional checks to later generations.
- [x] Catalog-Gen1-CLG-15. Define `System` as a local organizer with `Platform`, `Wheel`, and later `Hardware` before external source intake.
- [x] Catalog-Gen1-CLG-16. Define canonical local platform families and store platform compatibility as structured multi-value metadata.
- [x] Catalog-Gen1-CLG-17. Define the first local part groups and route them into systems without flattening motors or tires into platform-only ownership.
- [x] Catalog-Gen1-CLG-18. Keep `Part` view and `Platform` view as two browse reads over one shared item metadata contract.
- [x] Catalog-Gen1-CLG-19. Map repo asset name shapes into explicit metadata fields instead of treating display labels or source folders as runtime truth.
- [x] Catalog-Gen1-CLG-20. Add type-specific fitment metadata lanes for motors and tires where platform compatibility alone is insufficient.
- [x] Catalog-Gen1-CLG-21. Preserve predictable filter semantics: OR inside one selected filter group and AND across different groups.
- [x] Catalog-Gen1-CLG-22. Make the local Catalog taxonomy vocabulary the target that `Generation 2` external-source mapping must translate into.

### `Catalog-7 / Phase 1`

- [x] Seed the local item contract with stable taxonomy fields.
- [x] Seed the canonical local platform families and first-pass part groups.
- [x] Keep the catalog source and catalog tests aligned to the local taxonomy contract.
- [x] `Catalog-Gen1-HLG-11`
- [x] `Catalog-Gen1-HLG-12`
- [x] `Catalog-Gen1-HLG-15`
- [x] `Catalog-Gen1-HLG-16`
- [x] `Catalog-Gen1-HLG-21`
- [x] `Catalog-Gen1-HLG-22`
- [x] `Catalog-Gen1-HLG-23`
- [x] `Catalog-Gen1-HLG-25`
- [x] `Catalog-Gen1-CLG-6`
- [x] `Catalog-Gen1-CLG-15`
- [x] `Catalog-Gen1-CLG-16`
- [x] `Catalog-Gen1-CLG-17`
- [x] `Catalog-Gen1-CLG-19`
- [x] `Catalog-Gen1-CLG-22`

### `Catalog-7 / Phase 2`

- [x] Add the shell-owned `Part` and `Platform` browse-mode switch.
- [x] Derive Part browse sections from `partGroups`.
- [x] Derive Platform browse sections from `platformCompatibility`.
- [x] Keep imports and HDRIs as honest special lanes.
- [x] Prove mode switching through focused shell and surface tests.
- [x] `Catalog-Gen1-HLG-13`
- [~] `Catalog-Gen1-HLG-14`
- [x] `Catalog-Gen1-HLG-24`
- [x] `Catalog-Gen1-CLG-7`
- [x] `Catalog-Gen1-CLG-18`

### `Catalog-7 / Phase 3`

- [x] Lock predictable filter semantics in shared helper code.
- [x] Keep filter and search state shared across shell and source helpers.
- [x] Prove OR-within and AND-across behavior in tests.
- [x] `Catalog-Gen1-HLG-14`
- [x] `Catalog-Gen1-HLG-15`
- [x] `Catalog-Gen1-HLG-18`
- [x] `Catalog-Gen1-HLG-19`
- [x] `Catalog-Gen1-CLG-8`
- [x] `Catalog-Gen1-CLG-14`
- [x] `Catalog-Gen1-CLG-21`

### `Catalog-7 / Phase 4`

- [x] Add wheel-specific fitment fields to the item contract and seed data.
- [x] Surface those fields in the item page and detail presentation.
- [x] Keep tests focused on fitment metadata and presentation.
- [~] `Catalog-Gen1-HLG-17`
- [x] `Catalog-Gen1-HLG-21`
- [x] `Catalog-Gen1-HLG-25`
- [x] `Catalog-Gen1-HLG-26`
- [x] `Catalog-Gen1-CLG-17`
- [x] `Catalog-Gen1-CLG-19`
- [x] `Catalog-Gen1-CLG-20`
- [x] `Catalog-Gen1-CLG-22`

## [x] `Catalog-7 / Phase 1` - `Local Taxonomy Contract And Seed Metadata`

### Phase 1 Summary

#### Purpose

Establish the local catalog item contract and seed metadata that make repo-backed part taxonomy explicit before any browse-mode or filter presentation widens.

#### Owns

- local taxonomy fields on the catalog item contract
- seed metadata for canonical platform families and first-pass part groups
- stable source/test proof for the local taxonomy contract
- the first repo-backed metadata shape that later browse modes and filters can rely on

#### Does Not Own

- `Part` and `Platform` browse-mode switching
- filter semantics or search behavior beyond the contract shape
- wheel-specific fitment fields
- external-source intake or linked archives

#### Coverage

- HLG: `Catalog-Gen1-HLG-11`, `Catalog-Gen1-HLG-12`, `Catalog-Gen1-HLG-15`, `Catalog-Gen1-HLG-16`, `Catalog-Gen1-HLG-21`, `Catalog-Gen1-HLG-22`, `Catalog-Gen1-HLG-23`, `Catalog-Gen1-HLG-25`
- CLG: `Catalog-Gen1-CLG-6`, `Catalog-Gen1-CLG-15`, `Catalog-Gen1-CLG-16`, `Catalog-Gen1-CLG-17`, `Catalog-Gen1-CLG-19`, `Catalog-Gen1-CLG-22`

#### Current Live Read

The catalog already has a shared item model and seeded items. This phase sharpens that shape so local repo-backed parts have explicit system, platform, and part-group truth before the UI starts branching on browse modes.

#### First Pass Decisions

- keep taxonomy fields structured, not label-derived
- treat platform compatibility as multi-value metadata
- keep source kind and action type honest on the item contract
- seed the canonical platform families and part groups in one local vocabulary

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Normalize the catalog item contract around the local taxonomy fields.
2. Seed canonical platform families and first-pass part groups in the repo-backed source data.
3. Keep source and source tests aligned to the new contract shape.
4. Add focused proof that the taxonomy contract stays local and structured.

#### Likely Files

- `src/app/catalog/catalogItemContract.ts`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogSource.test.ts`

#### No-Widening Rule

- do not add `Part` or `Platform` browse-mode UI here
- do not add filter math or search semantics here
- do not add wheel-specific fitment fields here
- do not widen into PubParts or external-source mapping

#### Implementation Risks

- flattening local taxonomy into folder names or display labels
- losing multi-value platform compatibility in the seed shape
- mixing browse semantics into the contract layer too early
- letting external-source assumptions leak into repo-backed seed metadata

#### Checklist

- [x] the catalog item contract carries the local taxonomy fields explicitly
- [x] the seed data includes canonical local platform families and part groups
- [x] source tests prove the structured taxonomy contract stays stable
- [x] repo-backed items remain local and repo-owned

#### Verification Shape

Minimum verification for this phase should cover:
- item contract fields exist and are used consistently
- seeded items expose the canonical local platform and part-group metadata
- source tests prove the contract is still local and structured
- no browse-mode, filter, or external-source behavior is introduced

#### Done Shape

`Catalog-7 / Phase 1` is done when the local taxonomy contract and seed metadata are explicit enough for later browse and filter work to build on without reinterpreting filenames.

## [x] `Catalog-7 / Phase 2` - `Part And Platform Browse Modes`

### Phase 2 Summary

#### Purpose

Add the two browse reads, `Part` and `Platform`, so the same structured item metadata can be organized in more than one honest way without creating a second catalog truth.

#### Owns

- the shell-level `Part` and `Platform` browse-mode switch
- shared presentation helpers for mode-specific grouping and display
- grid and browse-rail behavior that routes both modes through the same item metadata
- surface tests for mode switching and browse stability

#### Does Not Own

- new taxonomy fields or seed metadata widening
- predictable filter semantics beyond the mode split
- wheel-specific fitment fields
- external-source mapping or compatibility verdicts

#### Coverage

- HLG: `Catalog-Gen1-HLG-13`, `Catalog-Gen1-HLG-14`, `Catalog-Gen1-HLG-24`
- CLG: `Catalog-Gen1-CLG-7`, `Catalog-Gen1-CLG-18`

#### Current Live Read

Catalog now lets the user switch between `Part` and `Platform` reads over the shared item metadata contract. Part sections derive from `partGroups`, Platform sections derive from `platformCompatibility`, and imports plus HDRIs stay as honest special lanes without forking source truth.

#### First Pass Decisions

- keep mode switching presentation-only
- use one shared item contract for both modes
- let `CatalogShell` own mode state
- let `catalogShellShared` own labels and grouping helpers
- keep shell and surface tests pointed at the shared seam before any filter work starts

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Add the visible `Part` versus `Platform` control in `CatalogShell`.
2. Route mode-specific grouping and labels through shared helpers.
3. Teach the grid and browse rail to read the active mode without changing source ownership.
4. Prove the same metadata can support both browse reads.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not add new taxonomy fields in this phase
- do not add filter semantics or search helpers here
- do not add wheel fitment logic here
- do not fork the contract into mode-specific item shapes

#### Implementation Risks

- turning browse mode into a second catalog truth
- duplicating grouping logic instead of sharing it
- making the grid depend on the wrong helper boundary
- coupling mode switching to filter semantics too early

#### Checklist

- [x] Catalog can switch between `Part` and `Platform` browse reads
- [x] both modes read from the same structured metadata contract
- [x] shared helpers own the mode-specific grouping and labels
- [x] shell and surface tests prove the browse surface stays stable

#### Verification Shape

Minimum verification for this phase should cover:
- switching between `Part` and `Platform` modes in the shared shell
- identical items still resolving through one contract and one set of shared helpers
- mode changes do not invent new source truth or change the local taxonomy contract
- shell and surface tests prove the browse surface remains stable while the new browse mode is introduced

#### Done Shape

`Catalog-7 / Phase 2` is done when the user can browse the same local catalog items as either parts or platforms without the two views drifting apart, and the shared shell plus surface tests prove the switch stays on the existing Catalog seam.

## [x] `Catalog-7 / Phase 3` - `Predictable Filter Semantics`

### Phase 3 Summary

#### Purpose

Lock the filter and search behavior so local taxonomy filters behave predictably across the shared Catalog shell and source helpers, with OR inside one filter group and AND across different filter groups.

#### Owns

- filter helper logic and shell state for local taxonomy filters
- the group-aware predicate contract that resolves `OR` inside a single selected group
- the cross-group gate that requires `AND` across different selected groups
- source/test proof for the filter contract
- surface tests for filter combinations and mode interaction

#### Does Not Own

- the taxonomy contract itself
- the browse-mode split from Phase 2
- wheel-specific fitment fields
- external-source mapping or compatibility verdicts

#### Coverage

- HLG: `Catalog-Gen1-HLG-14`, `Catalog-Gen1-HLG-15`, `Catalog-Gen1-HLG-18`, `Catalog-Gen1-HLG-19`
- CLG: `Catalog-Gen1-CLG-8`, `Catalog-Gen1-CLG-14`, `Catalog-Gen1-CLG-21`

#### Current Live Read

`CatalogShell` now owns grouped selected-filter state alongside active section, browse mode, and search text. `catalogShellShared` owns the grouped local taxonomy options and predicate: selected values inside one group match as a union, selected values across different groups intersect, and search text remains a separate narrowing gate after the grouped filter predicate. Part and Platform browse modes still change presentation and section reads without changing the filter math, while imports and HDRIs remain honest special lanes.

#### First Pass Decisions

- keep group semantics stable and documented before any later browse or fitment work
- make the shared helper layer responsible for grouped filter options and the `OR`/`AND` behavior
- let `CatalogShell` own grouped selected-filter state instead of treating all selected filter values as one flat tag list
- keep mode-specific presentation separate from filter rules
- keep search as an independent gate that still runs through the shared helper path
- leave later compatibility and external-source mapping untouched

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Add grouped local taxonomy filter option helpers in `catalogShellShared.ts`, with first-pass groups such as `partGroups`, `platformCompatibility`, `systemKey`, `partType`, and existing `tags` only where they remain useful as a generic group.
2. Replace flat `selectedTags` shell state with grouped selected-filter state, so multiple selected values inside one group are evaluated as a union and selected values across different groups are evaluated as intersections.
3. Add a group-aware filter predicate in `catalogShellShared.ts` that keeps the current section and search gates but evaluates selected values as `OR` inside a group and `AND` across groups.
4. Keep visible-item counts and displayed filter counts aligned with the same shared filter gate so the counts stay honest.
5. Prove the new contract with source, shell, and surface tests that cover single-group OR, multi-group AND, empty results, and browse-mode interaction.

#### Likely Files

- `src/app/catalog/catalogActionPlan.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen the taxonomy contract here
- do not add the browse-mode split again here
- do not add wheel fitment fields here
- do not widen into PubParts, external-source mapping, or compatibility verdicts
- do not replace the current shared search/filter seam with a second parallel filter store

#### Implementation Risks

- accidental `OR` across groups instead of inside them
- accidental `AND` inside one group, which would make multi-select filters too strict
- filter state drifting away from the same metadata contract
- source-folder fallbacks sneaking back in as truth
- mode-specific logic mutating filter semantics
- search accidentally becoming another filter group instead of a separate gate

#### Checklist

- [x] filter semantics stay `OR` within a group and `AND` across groups
- [x] shell state and helper logic share one grouped filter contract
- [x] source tests cover the stable filter behavior
- [x] surface tests cover single-group and multi-group combinations
- [x] search remains a separate gate across the same shared helper path

#### Verification Shape

Minimum verification for this phase should cover:
- one filter group with multiple selections returning the union of matching items
- multiple filter groups combined together returning only items that satisfy every group
- predictable empty and non-empty results
- search text acting as a separate gate after the group predicate
- filter counts and visible item counts reading from the same grouped predicate
- no accidental browse-mode, taxonomy contract, or special-lane regression

#### Done Shape

`Catalog-7 / Phase 3` is done when local filters behave predictably, the shared helper contract clearly expresses OR-within-group and AND-across-groups semantics, and the shell and surface tests prove the same math across both browse reads.

## [x] `Catalog-7 / Phase 4` - `Wheel-Specific Motor And Tire Fitment Fields`

### Phase 4 Summary

#### Purpose

Add the wheel-side fitment fields that motors and tires need so they do not have to pretend platform compatibility alone is enough.

#### Owns

- wheel-side fitment metadata on the item contract and seed data
- item-page and detail presentation for motor and tire fitment fields
- tests that prove the wheel-specific metadata stays structured
- the last local taxonomy refinement before external-source mapping begins

#### Does Not Own

- generic browse-mode switching
- the filter semantics already stabilized in Phase 3
- external-source ingestion or linked archives
- compatibility verdicts or builder slots

#### Coverage

- HLG: `Catalog-Gen1-HLG-17`, `Catalog-Gen1-HLG-21`, `Catalog-Gen1-HLG-25`, `Catalog-Gen1-HLG-26`
- CLG: `Catalog-Gen1-CLG-17`, `Catalog-Gen1-CLG-19`, `Catalog-Gen1-CLG-20`, `Catalog-Gen1-CLG-22`

#### Current Live Read

The local taxonomy is already strong enough for broad part browsing. Motors and tires still need a narrower fitment lane, and that lane should stay explicit instead of being inferred from platform-only tags.

The current live seams are:
- `CatalogItemRecord` in `src/app/catalog/catalogItemContract.ts` already carries `systemKey`, `platformCompatibility`, `partType`, `position`, `productName`, `brand`, `partGroups`, `metadata`, source branches, preview media, and action kind, but it has no wheel-specific fitment object.
- `CatalogItemSystem` already includes `Wheel`, and `CatalogItemPartGroup` already includes `Motors` and `Tires`; Phase 4 should use those existing local taxonomy values instead of inventing new source kinds or platform-mapping lanes.
- `src/app/catalog/catalogSeedItems.ts` currently duplicates the seed contract shape locally and seeds footpads, shoes, foothooks, an ADV board assembly, and HDRIs; no repo-backed motor or tire assets are currently present under `public/Catalog`, so implementation must not invent fake motor/tire catalog records just to satisfy runtime seed coverage.
- `src/app/catalog/catalogSource.ts` builds repo-backed `CatalogItemRecord`s from seed records and must pass through any optional wheel-fitment field for real repo-backed motor or tire entries.
- `src/app/catalog/ui/catalogShellShared.ts` owns shared item/source label and detail helpers; it is the right place for a small pure wheel-fitment detail helper.
- `src/app/catalog/ui/CatalogShellItemPage.tsx` already renders structured `item.metadata` before notes and source details; Phase 4 should render wheel-fitment rows in that item-detail area instead of hiding them in source details.
- focused coverage already lives in `catalogItemContract.test.ts`, `catalogSource.test.ts`, `catalogShellShared.test.ts`, and `CatalogSurface.test.tsx`.

#### First Pass Decisions

- keep wheel fitment fields narrow and explicit
- prefer structured metadata over filename heuristics
- add a single optional `wheelFitment` object on `CatalogItemRecord` rather than widening platform compatibility, filters, or source metadata
- use the smallest structured shape needed for local motor and tire truth:
  - `motorVersion?: string`
  - `hubSizeInches?: string`
  - `tireSize?: string`
  - `tireCompound?: string`
- apply `motorVersion` plus optional `hubSizeInches` to motor records and `tireSize`, `tireCompound`, plus optional `hubSizeInches` to tire records
- let `CatalogRepoSeedItem` carry the same optional `wheelFitment` object so real local/repo-backed motor and tire seeds can pass it through
- do not add invented runtime seed records when no real repo-backed motor or tire asset exists; use focused test literals for contract/helper proof if implementation cannot add a real local motor or tire seed honestly
- show fitment details where item pages can explain them clearly, near the existing metadata/detail block and before source details
- keep filter groups unchanged in Phase 4; wheel fitment is display/contract truth, not new filter semantics in this cut
- leave compatibility verdicts for later generations

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Add an optional local `wheelFitment` contract to `CatalogItemRecord` with the narrow fields `motorVersion`, `hubSizeInches`, `tireSize`, and `tireCompound`.
2. Add the same optional `wheelFitment` shape to `CatalogRepoSeedItem` and carry it through `buildCatalogRepoItem` without interpreting it as platform compatibility, part groups, metadata rows, or source truth.
3. Keep runtime seed additions honest:
   - if real repo-backed motor or tire assets are present or Manager supplies them, seed those records with `systemKey: 'Wheel'`, `partGroups: ['Motors']` or `['Tires']`, and the matching `wheelFitment` fields
   - if no real local motor/tire asset is available, do not create fake Catalog records; prove the new contract and helper behavior with focused test literals while leaving seed data ready for real repo-backed entries
4. Add a small shared helper in `catalogShellShared.ts`, such as `buildCatalogWheelFitmentDetails(item)`, that returns stable label/value rows only for present fields:
   - `Motor Version`
   - `Hub Size`
   - `Tire Size`
   - `Tire Compound`
5. Render the wheel-fitment rows in `CatalogShellItemPage.tsx` near the existing item metadata/detail presentation, before notes and source details, with no source-path assumptions.
6. Preserve the broader local taxonomy contract, browse modes, grouped filters, search behavior, action behavior, and external-source lanes from earlier phases.

#### Likely Files

- `src/app/catalog/catalogItemContract.ts`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/catalogItemContract.test.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not add compatibility verdicts here
- do not add PubParts mapping here
- do not add external source intake or map PubParts platform/type strings into this field
- do not reopen the filter semantics here
- do not widen into builder or dimensional fit behavior
- do not add builder slots, Gen3 compatibility verdicts, or `Catalog-Gen2-3` platform mapping here
- do not create fake repo-backed motor or tire assets or source records
- do not make wheel-fitment fields drive add-to-project, archive, import, or preview behavior

#### Implementation Risks

- treating wheel fitment as a platform-wide rule
- hiding wheel details behind source filenames instead of metadata
- letting item-page presentation drift away from the contract
- leaking external-source assumptions into local taxonomy data
- introducing fake motor or tire seeds because the current repo asset tree has no motor/tire catalog files
- making wheel-fitment fields into filter semantics before the Manager assigns a filter-specific phase

#### Checklist

- [x] wheel-specific fitment fields exist for motors and tires
- [x] item-page presentation can show the new fitment fields clearly
- [x] tests prove the fitment metadata stays structured
- [x] the local taxonomy contract still reads cleanly after the wheel-side widening
- [x] Phase 4 stays sufficient as the Gen1 gate before `Catalog-Gen2-3` without pulling Gen2 platform mapping into this local taxonomy phase

#### Verification Shape

Minimum verification for this phase should cover:
- `catalogItemContract.test.ts` proves `CatalogItemRecord` accepts structured motor/tire `wheelFitment` fields without changing source kinds or action kinds.
- `catalogSource.test.ts` proves repo seed pass-through keeps `wheelFitment` structured for real repo-backed entries or, if no real motor/tire seed exists, proves existing repo/import/external source snapshots remain stable while the optional contract stays available.
- `catalogShellShared.test.ts` proves the wheel-fitment detail helper returns the expected rows for motor and tire test literals, omits missing optional fields, and returns no rows for non-wheel items.
- `CatalogSurface.test.tsx` proves the item page can display wheel-fitment rows when a local repo-backed wheel item is present, or keeps existing repo/import/external item-page behavior stable if the implementation only adds helper-level proof due to no real motor/tire assets.
- no regression to `Part`/`Platform` browse modes, grouped filter semantics, source labeling, external linked-source behavior, or `add-to-project` behavior.
- focused tests first, then `npm.cmd run build` for the implementation pass.

#### Done Shape

`Catalog-7 / Phase 4` is done when Catalog has a narrow local `wheelFitment` contract and item-page/detail presentation path for motor and tire fields, the source seam can preserve those fields for honest repo-backed wheel records, focused tests prove the structure without fake source data, and the Gen1 local taxonomy gate is ready for later `Catalog-Gen2-3` mapping work to target without importing Gen2 mapping into this phase.

#### Implementation Closeout

Phase 4 is complete as the Gen1 fitment gate before `Catalog-Gen2-3`.

Completed:
- `CatalogItemWheelFitment` now carries `motorVersion`, `hubSizeInches`, `tireSize`, and `tireCompound` as optional structured local fields.
- `CatalogItemRecord` and `CatalogRepoSeedItem` now accept optional `wheelFitment`.
- repo-backed items and remembered imports can preserve `wheelFitment` when a real repo-backed wheel record exists.
- item-page detail rendering can show wheel fitment rows through the shared helper path.
- focused contract/source/helper tests prove the shape without adding fake live motor or tire catalog records.

Truthful remaining caveat:
- no live motor or tire Catalog cards were added because the repo currently has no real motor/tire assets under `public/Catalog`; `Catalog-Gen1-HLG-17` therefore stays partial until real repo-backed wheel records can carry real fitment truth.

This phase did not add PubParts mapping, external source intake, compatibility verdicts, builder slots, dimensional proof, filter rewrites, or `Catalog-Gen2-3` mapping.
