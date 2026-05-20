# `Sketch-3` - `Browser Sketch Profile Row Projection`

## Doc Header

### Doc History
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
- proposed

2. `Sketch - 3 Phase 2 - Expandable SketchProfiles Browser Tree Projection`
Reason:
- once row identity is explicit, each sketch row can expand to show the aggregate `SketchProfiles` row and individual member rows
Current status:
- proposed

3. `Sketch - 3 Phase 3 - Viewport Selection Visual Sync`
Reason:
- once the rows exist, viewport profile selection/preselection can visually map to the matching Browser row without adding selected-state copy
Current status:
- proposed

4. `Sketch - 3 Phase 4 - Focused Browser Interaction Proof`
Reason:
- once the row tree and visual sync exist, focused tests should lock collapse behavior, counts, row identity, and no graph ownership drift
Current status:
- proposed

## [ ] `Sketch - 3 Phase 1` - `Browser Row Model And Identity Contract`

### Phase 1 Summary

Define the Browser VM shape for sketch-profile projection rows.

This phase should answer:
- whether profile aggregate/member rows need new `BrowserTreeRowKind` values
- how row ids are built
- what identity fields are carried for graph document id, sketch node id, and profile id
- how selection/highlight state can be represented visually without adding selected text

### Phase 1 Implementation Spec

Likely first-cut direction:
- add explicit Browser row VM types for:
  - `sketch-profiles`
  - `sketch-profile`
- include:
  - `graphDocumentId`
  - `nodeId`
  - `profileId` for member rows
  - `profileIndex`
  - `authoringGraphDocumentId`
  - `authoringNodeId`
- do not change graph or sketch derivation behavior

Acceptance read:
- row identity is deterministic
- rows can be selected/highlighted by identity
- no Browser row becomes a source of profile membership truth

## [ ] `Sketch - 3 Phase 2` - `Expandable SketchProfiles Browser Tree Projection`

### Phase 2 Summary

Render the Browser hierarchy beneath each sketch row.

The intended hierarchy is:

```text
Sketch
  SketchProfiles
    SketchProfile
```

### Phase 2 Implementation Spec

Likely first-cut direction:
- make sketch rows expandable when they have profile projection children
- render a `SketchProfiles` aggregate child row beneath the sketch row
- make the aggregate row expandable when profiles exist
- render one `SketchProfile` child row per resolved profile member
- keep empty/no-profile behavior compact and honest

Acceptance read:
- collapsed sketch rows remain readable
- expanded sketch rows reveal `SketchProfiles`
- expanded aggregate rows reveal stable member rows
- counts match the resolved profile array

## [ ] `Sketch - 3 Phase 3` - `Viewport Selection Visual Sync`

### Phase 3 Summary

Map viewport-selected or preselected closed profiles onto the matching Browser profile row.

### Phase 3 Implementation Spec

Likely first-cut direction:
- read existing viewport sketch-profile selection identity
- match by graph document id, sketch node id, and profile id
- apply Browser visual selected/highlight state to the matching `SketchProfile` row
- do not append literal selected text to row labels or metadata

Acceptance read:
- selecting a closed profile in the viewport can be represented in Browser
- multiple selected profiles can visually mark multiple matching member rows
- clearing viewport selection clears the projected Browser visual state
- Browser projection does not mutate graph truth

## [ ] `Sketch - 3 Phase 4` - `Focused Browser Interaction Proof`

### Phase 4 Summary

Lock the new Browser row behavior with focused tests.

### Phase 4 Implementation Spec

Likely tests:
- selector test for one sketch with no profiles
- selector test for one sketch with multiple profiles
- selector test for collapsed sketch and collapsed `SketchProfiles` rows
- Browser render test proving aggregate/member rows appear when expanded
- Browser render or interaction test proving visual selected state does not require selected text

Acceptance read:
- the Browser tree remains derived from graph/sketch truth
- collapse state works at sketch and aggregate levels
- profile member rows preserve stable identity
- selected-profile visual projection stays a presentation layer
