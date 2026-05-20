# `Sketch-3` - `Browser Sketch Profile Row Projection`

## Doc Header

### Doc History
10. 2026-05-19 23:49: Added the outside-Extrude empty viewport click cleanup follow-up after the shared object-selection empty-pick path began clearing transient `viewportSelectedSketchProfiles`, matching object deselection behavior while leaving active Extrude selected profile sources intact and proving the behavior through focused ViewerHost and Browser profile tests plus production build verification
9. 2026-05-19 23:37: Marked `Sketch - 3 Phase 4 - Browser Profile Interaction Proof` shipped after Browser `SketchProfile` row clicks began toggling viewport profile selections, Shift-click began selecting all same-sketch Browser profile members, active Extrude sessions mirrored selected profile sources through the existing command-session setter, workspace multi-select drift stayed out of profile rows, and focused interaction/render tests plus production build verification passed
8. 2026-05-19 23:31: Tightened `Sketch - 3 Phase 4 - Browser Profile Interaction Proof` into an implementation-ready two-way interaction slice around letting Browser `SketchProfile` row clicks update `viewportSelectedSketchProfiles`, mirroring active Extrude selected profile sources when a command session is active, preserving graph/profile ownership, keeping selected text out of row copy, and proving single-profile toggle, same-sketch Shift expansion, clearing, and no command accept behavior
7. 2026-05-19 23:28: Marked `Sketch - 3 Phase 3 - Viewport Selection Visual Sync` shipped after Browser profile rows began projecting viewport and active Extrude selected profile sources onto matching `SketchProfile` row selected visuals, preserving neutral row text, filtering stale selections, auto-revealing collapsed sketch/profile ancestors, and adding focused Browser render proof plus production build verification
6. 2026-05-19 23:22: Tightened `Sketch - 3 Phase 3 - Viewport Selection Visual Sync` into an implementation-ready one-way projection slice around reading `viewportSelectedSketchProfiles` and active Extrude selected profile sources, matching them to Browser `SketchProfile` row ids by graph document id, sketch node id, and profile id, visually selecting matching Browser rows without literal selected text, and auto-revealing collapsed ancestors without mutating graph or Browser ownership truth
5. 2026-05-19 23:09: Marked `Sketch - 3 Phase 2 - Expandable SketchProfiles Browser Tree Projection` shipped after Browser sketch rows with resolved profiles became expandable into visible `SketchProfiles` aggregate rows and ordered `SketchProfile` member rows through existing content collapse state, with focused selector, interaction, render, and production-build proof while leaving viewport selection sync for Phase 3
4. 2026-05-19 23:03:29: Tightened `Sketch - 3 Phase 2 - Expandable SketchProfiles Browser Tree Projection` into an implementation-ready rendering slice around consuming the shipped `profileProjectionRows`, making sketch rows expandable when profile children exist, rendering the aggregate `SketchProfiles` row, expanding that row into `SketchProfile` children through existing Browser collapse state, and proving the visible hierarchy without adding viewport selection sync or graph ownership changes
3. 2026-05-19 23:00:08: Marked `Sketch - 3 Phase 1 - Browser Row Model And Identity Contract` shipped after the Browser selector gained `sketch-profiles` and `sketch-profile` VM row kinds, deterministic aggregate/member row id helpers, graph-authored profile member projection rows, member port ids, and focused selector proof while keeping visible Browser hierarchy rendering deferred to Phase 2
2. 2026-05-19 22:53:32: Tightened `Sketch - 3 Phase 1 - Browser Row Model And Identity Contract` into an implementation-ready slice around selector-owned Browser row VM kinds, deterministic aggregate/member row ids, graph/sketch/profile identity fields, and focused row-model tests while keeping actual Browser tree rendering, viewport visual sync, and two-way selection out of scope
1. 2026-05-19 22:08:52: Created the `Sketch - 3` planning doc for Browser projection of graph-authored `SketchProfiles` and individual `SketchProfile:<profileId>` closed-loop rows, keeping Browser as a derived presentation surface over sketch profile truth and preserving visual selection without literal selected-state row wording

### Purpose

Use this doc as the dedicated planning and execution surface for the `Sketch - 3` lane.

The goal here is:
- make Browser sketch rows expandable into profile rows
- show one aggregate `SketchProfiles` Browser row per graph-authored sketch
- show one individual `SketchProfile` Browser row per resolved closed-loop profile member
- let viewport-selected closed profiles have a matching visual place in the Browser tree
- keep Browser projection downstream from graph-authored sketch truth

### Scope

This phase family covers:
- Browser row identity for sketch profile aggregate and member rows
- expandable Browser hierarchy beneath each sketch row
- visual projection of selected or preselected sketch profiles into Browser rows
- row labels, counts, collapse behavior, and focused Browser tests

This phase family does not cover:
- changing sketch profile derivation
- changing `Geometry/Sketch` output port semantics
- changing `Geometry/Extrude` graph wiring rules
- adding new source geometry, profile-loop solving, or B-rep lowering behavior
- adding literal `selected` row text when visual selection state is enough

## Doc Body

### Summary

`Sketch - 2` made the graph/node side of `SketchProfiles` more explicit:
- one parent `SketchProfiles` output means the full ordered closed-profile array
- one child `SketchProfile:<profileId>` member means one specific closed loop

`Sketch - 3` should project that same identity into the Browser.

Recommended Browser shape:

```text
Sketches
  Sketch
    SketchProfiles
      SketchProfile
      SketchProfile
```

The Browser should not invent profile membership. It should read the same resolved profile list and profile ids already owned by graph-authored sketch truth.

### Current Code-Backed Read

- `src/app/panels/selectBrowserTreeRows.ts`
  - already renders `Sketches` root rows and individual `sketch` rows
  - currently treats sketch rows as leaves
  - already carries `profileCount` on each sketch row
- `src/app/store/useAppStore.ts`
  - already derives project-content sketch Browser rows from graph-authored sketch nodes
  - already computes profile counts from sketch feature outputs
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already renders node-side `SketchProfiles` and child `SketchProfile` rows from resolved profiles
  - is the live proof that the aggregate/member row identity exists outside Browser
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - already owns `buildSketchProfileMemberPortId(profileId)`
  - already normalizes `SketchProfile:<profileId>` member identity
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already has transient viewport selected sketch-profile state
  - already synchronizes active Extrude selected profile sources through exact profile member identities

### Main Direction

Browser profile rows should be projection rows.

That means:
- the Browser row tree can show profile aggregate/member structure
- Browser row selection can visually reflect viewport profile selection
- Browser can later become a two-way selection affordance
- Browser must not become the canonical owner of profile existence, order, or membership

### Row Identity

Use stable identities derived from sketch truth:

- aggregate row:
  - graph document id
  - sketch node id
  - `SketchProfiles`
- member row:
  - graph document id
  - sketch node id
  - profile id
  - `SketchProfile:<profileId>`

The profile row should survive label wording changes as long as the underlying profile id stays stable.

### Visual Selection Rule

Do not write literal `selected` row text.

The row should use the Browser's existing selected/highlighted visual language when it represents the same closed profile that is selected or preselected in the viewport.

Reason:
- the viewport already shows selected closed profiles visually
- Browser should provide a matching location in the hierarchy
- repeating `selected` in text makes the Browser noisier without improving identity

### Phase Breakdown

1. `Sketch - 3 Phase 1 - Browser Row Model And Identity Contract`
Reason:
- before rendering more rows, the Browser needs explicit row kinds or row traits for aggregate and member sketch-profile projection
Current status:
- shipped

2. `Sketch - 3 Phase 2 - Expandable SketchProfiles Browser Tree Projection`
Reason:
- once row identity is explicit, each sketch row can expand to show the aggregate `SketchProfiles` row and individual member rows
Current status:
- shipped

3. `Sketch - 3 Phase 3 - Viewport Selection Visual Sync`
Reason:
- once the rows exist, viewport profile selection/preselection can visually map to the matching Browser row without adding selected-state copy
Current status:
- shipped

4. `Sketch - 3 Phase 4 - Browser Profile Interaction Proof`
Reason:
- once one-way viewport-to-Browser sync exists, Browser-to-viewport profile interaction can be considered as its own proof instead of being smuggled into passive projection
Current status:
- shipped

## [x] `Sketch - 3 Phase 1` - `Browser Row Model And Identity Contract`

### Phase 1 Summary

Define the Browser VM shape for sketch-profile projection rows before changing the visible Browser hierarchy.

This phase should answer:
- whether profile aggregate/member rows need new `BrowserTreeRowKind` values
- how row ids are built
- what identity fields are carried for graph document id, sketch node id, and profile id
- how selection/highlight state can be represented visually without adding selected text

Recommended answer:
- add explicit row kinds for the projection rows:
  - `sketch-profiles`
  - `sketch-profile`
- build row ids deterministically from the owning graph document, sketch node, and profile id
- add enough fields to the row VM for later rendering and selection sync without making Browser own profile membership
- prove the selector can create the row models behind the current tree before Phase 2 makes them visible in the full hierarchy

### Phase 1 Implementation Spec

#### Shipped Result

- added explicit Browser row-model support for:
  - `sketch-profiles`
  - `sketch-profile`
- added deterministic row id helpers:
  - `sketch-profiles-row:<graphDocumentId>:<nodeId>`
  - `sketch-profile-row:<graphDocumentId>:<nodeId>:<profileId>`
- surfaced sketch profile ids and indexes from graph-authored project-content sketch rows
- attached selector-derived `profileProjectionRows` to Browser sketch rows without changing the visible `contentRows` hierarchy
- reused `buildSketchProfileMemberPortId(profileId)` for member profile port identity
- added focused selector proof that:
  - the visible sketch hierarchy remains unchanged
  - aggregate/member profile projection rows are deterministic
  - member rows carry exact `SketchProfile:<profileId>` ids
  - selected visual identity can be represented by row id
  - labels and metadata avoid literal `selected` wording

#### Owns

- row type definitions in the Browser tree VM layer
- deterministic row id helpers for aggregate and member profile rows
- selector-owned derivation of profile aggregate/member row VMs from graph-authored sketch rows
- focused selector tests for row ids, metadata, and graph/sketch/profile identity fields
- preserving current Browser visual behavior until the hierarchy-rendering phase

#### Does Not Own

- making sketch rows visibly expandable in the Browser
- rendering the `SketchProfiles` and `SketchProfile` rows in `BrowserPanel`
- syncing viewport selected-profile visuals into Browser rows
- selecting profiles from Browser rows
- changing sketch profile derivation, graph output ports, or Extrude wiring behavior
- adding literal `selected` text to row labels or metadata

#### Current Strongest Read

- `src/app/panels/selectBrowserTreeRows.ts`
  - owns `BrowserTreeRowKind`, row VM types, and the final tree projection shape
  - already has `BrowserSketchTreeRowVm` with `graphDocumentId`, `nodeId`, `featureId`, `profileCount`, `authoringGraphDocumentId`, and `authoringNodeId`
  - currently marks sketch rows as leaves, which Phase 1 should not change visibly yet
- `src/app/store/useAppStore.ts`
  - already creates project-content sketch rows from graph-authored `Geometry/Sketch` nodes
  - already reads sketch feature output profile counts
  - may need the derived profile list surfaced on the sketch project-content row, or Phase 1 may derive member rows from available graph/sketch data before `selectBrowserTreeRows(...)`
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - already owns `buildSketchProfileMemberPortId(profileId)`
  - should be reused for member identity instead of duplicating the `SketchProfile:` string convention
- `src/app/panels/selectBrowserTreeRows.test.ts`
  - is the first proving surface for selector output without widening into Browser rendering behavior

#### Row Contract

Add or prepare row VM support for:

- aggregate `SketchProfiles` row:
  - `rowKind: 'sketch-profiles'`
  - `graphDocumentId`
  - `nodeId`
  - `featureId`
  - `profileCount`
  - `authoringGraphDocumentId`
  - `authoringNodeId`
  - deterministic `rowId`, suggested shape:
    - `sketch-profiles-row:<graphDocumentId>:<nodeId>`
- member `SketchProfile` row:
  - `rowKind: 'sketch-profile'`
  - `graphDocumentId`
  - `nodeId`
  - `featureId`
  - `profileId`
  - `profileIndex`
  - `profilePortId`, built with `buildSketchProfileMemberPortId(profileId)`
  - `authoringGraphDocumentId`
  - `authoringNodeId`
  - deterministic `rowId`, suggested shape:
    - `sketch-profile-row:<graphDocumentId>:<nodeId>:<profileId>`

#### Implementation Steps

1. Add `sketch-profiles` and `sketch-profile` to `BrowserTreeRowKind`.
2. Add typed Browser row VMs for aggregate and member sketch-profile projection rows.
3. Add local row id helper functions in the Browser selector layer unless an existing row-id helper owner already fits.
4. Derive aggregate/member row VM data from the existing graph-authored sketch profile source without rendering it under the visible sketch tree yet.
5. Add focused selector tests that prove:
   - a sketch with no profiles does not create member rows
   - a sketch with multiple profiles can create one aggregate row and one member row per profile
   - member rows carry the exact `SketchProfile:<profileId>` member port id
   - labels and metadata do not include literal `selected`
   - graph document id, sketch node id, profile id, and authoring fields are stable
- do not change graph or sketch derivation behavior

#### Acceptance Read

- row identity is deterministic
- rows can be selected/highlighted by identity
- no Browser row becomes a source of profile membership truth
- current visible Browser hierarchy remains unchanged until Phase 2
- tests prove the row model can represent the aggregate and member profile rows cleanly

## [x] `Sketch - 3 Phase 2` - `Expandable SketchProfiles Browser Tree Projection`

### Phase 2 Summary

Render the Browser hierarchy beneath each sketch row.

The intended hierarchy is:

```text
Sketch
  SketchProfiles
    SketchProfile
```

This phase should consume the `profileProjectionRows` that Phase 1 now attaches to Browser sketch rows. It should not rediscover profile identity, derive profiles a second way, or add new sketch/profile ownership.

### Phase 2 Implementation Spec

#### Shipped Result

Phase 2 shipped the visible Browser projection of the Phase 1 profile row model:
- Browser `sketch` rows are expandable when their Phase 1 `profileProjectionRows` include a `sketch-profiles` aggregate row
- expanded sketch rows append the visible `SketchProfiles` aggregate row beneath the sketch
- expanded aggregate rows append ordered `SketchProfile` member rows beneath `SketchProfiles`
- both sketch-row collapse and aggregate-row collapse reuse `collapsedContentRowIds`
- row labels and metadata stay neutral, with no literal selected-state text
- viewport selected-profile sync and Browser profile-click behavior remain deferred to Phase 3 or later

Implementation landed in:
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`

Verification:
- `cmd /c npm.cmd exec -- vitest run src/app/panels/selectBrowserTreeRows.test.ts --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/browserInteractions.test.ts --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/BrowserPanel.test.tsx -t "renders sketch profiles as expandable Browser children" --reporter verbose`
- `cmd /c npm.cmd run build`

#### Owns

- making Browser `sketch` rows expandable when `profileProjectionRows` exists and contains an aggregate row
- rendering the `sketch-profiles` aggregate row as a visible child of the sketch row
- rendering `sketch-profile` member rows as visible children of the aggregate row when that aggregate row is expanded
- preserving existing Browser guide/indent behavior so the new rows read as part of the same tree
- using existing `collapsedContentRowIds` for both sketch row collapse and aggregate profile row collapse
- focused selector/render tests for collapsed sketch, expanded sketch with collapsed aggregate, and expanded aggregate with member rows

#### Does Not Own

- changing the Phase 1 row id contract
- changing sketch profile derivation or graph output ports
- changing `Geometry/Extrude` wiring or selected-profile auto-wiring
- syncing viewport selected-profile state into Browser row visuals
- clicking Browser profile rows to select viewport profiles
- adding literal `selected` labels or metadata
- adding context-menu actions, visibility toggles, drag/drop, or row-level commands for profile rows

#### Current Strongest Read

- `src/app/panels/selectBrowserTreeRows.ts`
  - already owns the visible Browser tree assembly
  - already handles `orderedSketchRows` under the `Sketches` root
  - should become the main implementation seam for inserting projection rows beneath each sketch
- `BrowserSketchTreeRowVm.profileProjectionRows`
  - is the shipped Phase 1 input for this rendering pass
  - should be consumed directly instead of deriving profile rows again
- `collapsedContentRowIds`
  - already controls content-family collapse state
  - should govern:
    - collapsed sketch row hides its profile aggregate/member rows
    - collapsed `sketch-profiles` aggregate row hides member rows
- `src/app/panels/browserRowFamilies.ts`
  - already classifies `sketch-profiles` and `sketch-profile` as sketch-family rows after Phase 1
  - should not need a broader family-system rewrite
- `src/app/panels/browserTreeRowPresenter.tsx`
  - should be checked only for row-kind-specific assumptions
  - the first pass should reuse the generic Browser row shell if possible
- `src/app/panels/selectBrowserTreeRows.test.ts`
  - is the first proof surface for row ordering, depths, guides, collapse behavior, row identities, and no selected text
- `src/app/panels/BrowserPanel.test.tsx`
  - is the likely render proof if the selector changes are not enough to prove the rows can render through the panel

#### Locked Rendering Rules

- Sketch rows:
  - remain under `Sketches`
  - become `isExpandable: true` only when a `sketch-profiles` projection row exists
  - use `collapsedContentRowIds` with the sketch row id to decide whether profile children are visible
- `SketchProfiles` aggregate row:
  - appears directly beneath its owning sketch row when the sketch row is expanded
  - uses `rowKind: 'sketch-profiles'`
  - label stays `SketchProfiles`
  - metadata should be count-only, such as `2 profiles`
  - is expandable when member rows exist
  - uses its own row id in `collapsedContentRowIds` to decide whether member rows are visible
- `SketchProfile` member rows:
  - appear beneath the aggregate row only when the aggregate row is expanded
  - use `rowKind: 'sketch-profile'`
  - label stays `SketchProfile`
  - metadata should stay neutral, such as `Profile 1`
  - no literal `selected` wording
- Empty profile state:
  - sketches with no `profileProjectionRows` should stay visually as they are now
  - do not add an empty `SketchProfiles` row in Phase 2 unless the shipped Phase 1 model starts producing one

#### Implementation Steps

1. Update the sketch-row assembly in `selectBrowserTreeRows.ts` to read each sketch row's `profileProjectionRows`.
2. Mark a sketch row expandable when it has an aggregate `sketch-profiles` projection child.
3. After pushing an expanded sketch row, append the aggregate row with correct depth and tree guides.
4. If the aggregate row is expanded, append its `sketch-profile` member rows with correct depth and tree guides.
5. Keep guide behavior deterministic for:
   - the last sketch under `Sketches`
   - the aggregate row under its sketch
   - the last profile member under `SketchProfiles`
6. Add focused tests that prove:
   - collapsing the sketch row hides aggregate and member rows
   - expanding the sketch row shows the aggregate row
   - collapsing the aggregate row hides member rows
   - expanding the aggregate row shows member rows in profile order
   - labels/meta still avoid literal `selected`
   - Phase 1 profile ids and member port ids survive the visible projection

#### Acceptance Read

- collapsed sketch rows remain readable
- expanded sketch rows reveal `SketchProfiles`
- expanded aggregate rows reveal stable member rows
- counts match the resolved profile array
- visible rows are still projection rows over graph-authored sketch truth
- viewport selection sync remains a clean Phase 3 follow-on

## [x] `Sketch - 3 Phase 3` - `Viewport Selection Visual Sync`

### Phase 3 Summary

Map viewport-selected or preselected closed profiles onto the matching Browser profile row.

This phase makes the Browser row tree reflect the profile highlight/selection the viewport already owns. It does not make Browser profile rows the source of profile selection yet.

### Phase 3 Implementation Spec

#### Shipped Result

Phase 3 shipped the one-way selected-profile visual projection:
- Browser now reads `viewportSelectedSketchProfiles` from `useSpaghettiStore`
- active Extrude command `selectedProfileSources` also project into Browser profile rows after parsing `SketchProfile:<profileId>` member ports
- matching uses the existing Browser row id contract for `graphDocumentId`, sketch `nodeId`, and `profileId`
- stale selected profile identities are ignored when no matching Browser `SketchProfile` projection row exists
- projected profile row ids are added to Browser selected-row visuals without replacing unrelated Browser/workspace selection
- selected profile rows keep neutral labels and metadata with no literal `selected` text
- collapsed owning sketch rows and `SketchProfiles` aggregate rows auto-open while a valid projected selected profile is present
- Browser profile row clicks remain unchanged and do not select viewport profiles in this phase

Implementation landed in:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`

Verification:
- `cmd /c npm.cmd exec -- vitest run src/app/panels/BrowserPanel.test.tsx -t "sketch profile" --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/selectBrowserTreeRows.test.ts --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/browserInteractions.test.ts --reporter verbose`
- `cmd /c npm.cmd run build`

#### Owns

- reading existing viewport-selected sketch profile identity from `useSpaghettiStore`
- mapping selected profile identities to existing Phase 1 Browser `sketch-profile` row ids
- visually selecting/highlighting matching `SketchProfile` Browser rows through the Browser's existing selected row styling
- preserving multi-profile selection so more than one `SketchProfile` row can be visually selected at once
- revealing the selected profile row in the Browser by opening the owning sketch row and `SketchProfiles` aggregate row when a valid selected row is currently hidden by content collapse state
- focused tests for selection projection, clearing behavior, multi-profile behavior, and no literal selected text

#### Does Not Own

- changing graph-authored sketch profile derivation
- changing `Geometry/Sketch` output port semantics
- changing `Geometry/Extrude` selected-profile wiring behavior
- selecting viewport profiles by clicking Browser `SketchProfile` rows
- changing local Browser row selection into the source of viewport profile truth
- adding literal `selected` labels or metadata to profile rows
- adding new context menus, visibility commands, row actions, drag/drop, or graph mutations

#### Current Strongest Read

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `viewportSelectedSketchProfiles`
  - each selection carries `graphDocumentId`, `sketchNodeId`, `profileId`, and `portId`
  - active Extrude command profile sources also represent profile selection through `selectedProfileSources`
- `src/app/components/ViewerHost.tsx`
  - already merges `viewportSelectedSketchProfiles` with active Extrude `selectedProfileSources` into viewport `selectedProfileIdsBySketchNodeId`
  - already parses active Extrude member ports through `parseSketchProfileMemberPortId(...)`
  - proves the viewport can select multiple profile ids for a sketch
- `src/app/panels/useBrowserPanelController.ts`
  - already resolves workspace/local Browser selection into `selectedBrowserRowId`, `selectedBrowserRowIds`, and `groupedSelectedBrowserRowIds`
  - already passes those ids into `selectBrowserTreeRows(...)`
  - is the expected handoff point for adding viewport-selected profile row ids into Browser visual selection without changing the selector row contract
- `src/app/panels/selectBrowserTreeRows.ts`
  - already marks rows selected by row id
  - already has `buildBrowserSketchProfileRowId(graphDocumentId, nodeId, profileId)` from Phase 1
  - should not need to rediscover profiles or own viewport selection state
- `src/app/panels/browserInteractions.ts`
  - already owns Browser collapse toggles for `sketch` and `sketch-profiles`
  - should not gain viewport-selection mutation in this phase

#### Locked Sync Rules

- Selection source:
  - first source is `viewportSelectedSketchProfiles`
  - while an Extrude command session is active, include the session `selectedProfileSources` by parsing `SketchProfile:<profileId>` member ports and pairing them with the active command `graphDocumentId`
- Row matching:
  - match only when `graphDocumentId`, sketch `nodeId`, and `profileId` all resolve to an existing Browser `SketchProfile` projection row
  - build row ids through the Phase 1 Browser helper, not ad hoc strings
  - ignore stale profile selections that no longer have a matching Browser row
- Visual state:
  - put matching member row ids into the Browser selected-row visual path
  - preserve existing workspace/local Browser selection; viewport profile row ids should be additive visual selection, not a destructive replacement
  - do not add selected-state copy to labels, metadata, tooltips, or row counts
- Collapse behavior:
  - if a valid viewport-selected profile row is under a collapsed sketch or collapsed `SketchProfiles` aggregate, auto-open those ancestors so the visual selection has somewhere visible to land
  - ancestor reveal should only adjust Browser collapse state and should not mutate graph truth, sketch truth, viewport selection truth, or profile membership
- Clearing behavior:
  - clearing `viewportSelectedSketchProfiles` and active Extrude selected sources clears the projected Browser profile visual selection
  - clearing should not clear an unrelated Browser-local selection

#### Implementation Steps

1. In `useBrowserPanelController.ts`, subscribe to `viewportSelectedSketchProfiles` and active `extrudeCommandSession?.selectedProfileSources`.
2. Derive `viewportSelectedSketchProfileBrowserRowIds` by:
   - using each stored selection's `graphDocumentId`, `sketchNodeId`, and `profileId`
   - parsing Extrude selected source member ports with `parseSketchProfileMemberPortId(...)`
   - building Browser row ids through `buildBrowserSketchProfileRowId(...)`
   - filtering to ids that exist in the current Browser profile projection rows
3. Merge those ids into the Browser selected-row visual inputs passed to `selectBrowserTreeRows(...)`.
4. Add an ancestor-reveal effect that removes the owning sketch row id and owning `sketch-profiles` aggregate row id from `collapsedContentRowIds` when a valid viewport-selected profile row is hidden.
5. Keep Browser row click behavior unchanged for profile rows.
6. Add focused tests that prove:
   - one viewport-selected profile marks the matching `SketchProfile` Browser row selected
   - multiple viewport-selected profiles mark multiple matching member rows selected
   - active Extrude selected profile sources also project to Browser profile rows
   - clearing viewport and Extrude selected sources removes the projected profile-row selection
   - selected rows do not add literal `selected` text
   - collapsed ancestors auto-open for a valid selected profile row without changing graph/profile truth

Acceptance read:
- selecting a closed profile in the viewport can be represented in Browser
- multiple selected profiles can visually mark multiple matching member rows
- clearing viewport selection clears the projected Browser visual state
- selected profile rows are visible even if their sketch or aggregate row was previously collapsed
- Browser projection does not mutate graph truth
- Browser profile rows do not become the source of viewport selection in this phase

## [x] `Sketch - 3 Phase 4` - `Browser Profile Interaction Proof`

### Phase 4 Summary

Consider the opposite interaction direction after passive visual sync is stable.

This phase should make clicking a Browser `SketchProfile` row select or toggle the matching viewport profile through the same identity path the viewport already uses. Browser still remains a projection/control surface, not the owner of sketch profile truth.

### Phase 4 Implementation Spec

#### Shipped Result

Phase 4 shipped Browser-to-viewport profile interaction:
- Browser `SketchProfile` row clicks now toggle the matching `viewportSelectedSketchProfiles` identity
- clicking an already selected Browser profile row clears that profile selection
- Shift-clicking a Browser `SketchProfile` row selects all visible/resolved `SketchProfile` rows for the same sketch
- active Extrude command sessions mirror Browser-driven profile selection into `setExtrudeCommandSelectedProfileSources(...)`
- Browser profile clicks set local Browser row selection and close menus without calling workspace explicit multi-select, graph-node activation, Extrude accept, or Extrude node creation behavior
- Phase 3 projection remains the visual path, so Browser profile rows still use existing selected-row visuals without literal `selected` copy

Follow-up:
- outside an active Extrude command, empty viewport clicks now clear transient `viewportSelectedSketchProfiles` through the same empty-pick path that clears normal object/workspace selection
- active Extrude selected profile sources stay intact because command selection remains command-owned until the user changes or cancels that command

Implementation landed in:
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

Verification:
- `cmd /c npm.cmd exec -- vitest run src/app/panels/browserInteractions.test.ts --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/BrowserPanel.test.tsx -t "sketch profile" --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/panels/selectBrowserTreeRows.test.ts --reporter verbose`
- `cmd /c npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "preselects a viewport sketch profile|toggles multiple viewport sketch profile preselections|routes viewport object picks" --reporter verbose`
- `cmd /c npm.cmd run build`

#### Owns

- single-click selection behavior for visible Browser `SketchProfile` member rows
- routing Browser-selected profile identities into `useSpaghettiStore.setViewportSelectedSketchProfiles(...)`
- preserving the Phase 3 Browser visual projection path instead of inventing a second selected-row state
- mirroring active Extrude command selected profile sources through `setExtrudeCommandSelectedProfileSources(...)` when an Extrude command session is active
- keeping Browser `SketchProfile` row selection as profile selection, not workspace graph-node/object selection
- focused interaction and render tests for Browser row click, toggle-off, Shift expansion, active Extrude sync, and no literal selected text

#### Does Not Own

- changing sketch profile derivation
- changing `SketchProfiles` / `SketchProfile:<profileId>` output-port semantics
- accepting or committing Extrude commands
- creating new Extrude nodes
- changing Browser aggregate `SketchProfiles` row clicks beyond existing collapse behavior
- changing Browser sketch row clicks or graph-node focus behavior
- adding row text that says `selected`
- making Browser rows own profile membership, profile order, or graph wiring truth

#### Current Strongest Read

- `src/app/panels/selectBrowserTreeRows.ts`
  - already carries `graphDocumentId`, `nodeId`, `profileId`, `profilePortId`, and `profileIndex` on `sketch-profile` rows
  - should not need a row-shape change for Phase 4
- `src/app/panels/browserInteractions.ts`
  - owns `handleSelectBrowserRow(...)`
  - currently sets local Browser row selection first and then routes known row kinds through workspace/graph/content behavior
  - is the correct place to intercept `row.rowKind === 'sketch-profile'` before generic graph/content selection logic
- `src/app/panels/useBrowserPanelController.ts`
  - already passes store and workspace dependencies into `createBrowserRowInteractionHandlers(...)`
  - should pass the minimal profile-selection dependencies needed by the interaction layer:
    - `viewportSelectedSketchProfiles`
    - `extrudeCommandSession`
    - `setViewportSelectedSketchProfiles`
    - `setExtrudeCommandSelectedProfileSources`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns `viewportSelectedSketchProfiles`
  - already owns `setViewportSelectedSketchProfiles(...)`
  - already owns active Extrude selected profile source synchronization through `setExtrudeCommandSelectedProfileSources(...)`
- `src/app/components/ViewerHost.tsx`
  - is the existing behavior model:
    - normal profile pick toggles one selected profile identity
    - Shift profile pick expands to all selectable profiles for that sketch
    - active Extrude sessions mirror selected sources into the command session
  - Phase 4 should match that behavior instead of defining a second Browser-specific profile-selection grammar

#### Locked Interaction Rules

- Single click on a Browser `SketchProfile` row:
  - set local Browser selected row id to the clicked profile row
  - close Browser menus
  - toggle the matching `{ graphDocumentId, sketchNodeId, profileId, portId }` in `viewportSelectedSketchProfiles`
  - if it was already selected, remove it
  - if it was not selected, append it to current selections for that graph document
  - keep selections from other graph documents untouched unless the existing viewport selection path proves they should be filtered
- Shift-click on a Browser `SketchProfile` row:
  - select all visible/resolved profile rows for the clicked row's sketch
  - use each row's `profilePortId`
  - match the viewport's same-sketch expansion behavior
- Ctrl-click:
  - should not create workspace explicit multi-select for profile rows in Phase 4
  - safest first pass is to treat Ctrl-click like normal profile toggle unless implementation discovers a local convention that makes this risky
- Active Extrude session:
  - after computing the next Browser-driven profile selections, call `setExtrudeCommandSelectedProfileSources(...)`
  - pass only selections for the active command graph document
  - use `{ nodeId: sketchNodeId, portId }` so the existing live Extrude sync remains the only graph-wiring mutation path
- Browser/workspace selection:
  - do not call `setWorkspaceExplicitSelection(...)` for `sketch-profile` rows
  - do not call graph-node activation or viewer frame commands
  - do not change `SketchProfiles` aggregate collapse behavior
- Clearing:
  - clicking an already-selected Browser profile row removes that profile from viewport-selected profiles
  - if active Extrude has no remaining selected profile sources after the toggle, mirror the empty selected source list through the existing setter
- Row text:
  - no literal `selected` copy should appear in labels, metadata, tooltips, counts, or console messages

#### Implementation Steps

1. Extend `BrowserRowInteractionDeps` with the minimal sketch-profile selection dependencies from `useSpaghettiStore`.
2. In `useBrowserPanelController.ts`, subscribe to and pass:
   - `viewportSelectedSketchProfiles`
   - `extrudeCommandSession`
   - `setViewportSelectedSketchProfiles`
   - `setExtrudeCommandSelectedProfileSources`
3. In `browserInteractions.ts`, intercept `row.rowKind === 'sketch-profile'` near the start of `handleSelectBrowserRow(...)`.
4. Build the clicked selection from the row:
   - `graphDocumentId`
   - `sketchNodeId: row.nodeId`
   - `profileId`
   - `portId: row.profilePortId`
5. For normal click, toggle that selection inside the current viewport-selected profile list.
6. For Shift-click, derive all `sketch-profile` rows in the Browser tree with the same `graphDocumentId` and `nodeId`, then replace that sketch's selections with those rows.
7. If an active Extrude command session exists, mirror the next selection list into `setExtrudeCommandSelectedProfileSources(...)` for that session's graph document.
8. Add focused tests in:
   - `src/app/panels/browserInteractions.test.ts`
   - `src/app/panels/BrowserPanel.test.tsx`
9. Run focused Browser interaction/render tests plus production build.

Acceptance read:
- Browser-to-viewport profile selection uses the same identity contract as viewport-to-Browser projection
- clicking a Browser `SketchProfile` row visually selects the same profile through the Phase 3 projection path
- clicking the selected Browser `SketchProfile` row again clears that profile selection
- Shift-clicking a Browser `SketchProfile` row selects all profile members for that sketch
- active Extrude selected profile sources stay synchronized with Browser-driven profile selection
- Browser row clicks do not invent profile membership
- command/session side effects remain explicit and test-covered
- Browser profile clicks do not accept, commit, or create Extrude graph nodes
