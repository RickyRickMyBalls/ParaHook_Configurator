## [x] [3.2B-S7] - `SketchPlane Transform History`

This follow-on turns the current one-segment sketch-plane move guide into a readable committed path history, so the user can see how the plane reached its present placement from the origin instead of only seeing the latest draft/final transform.

Phase state:
- locked
- implementation-ready
- shipped

Locked target read:

```text
Graph
└─ Sketch node selected
   └─ SketchPlane
      └─ Adjust
         └─ Move
            ├─ active draft move guide
            └─ Transform History
               ├─ Origin
               ├─ P1
               ├─ P2
               └─ Final
```

Important rule:
- every committed sketch-plane move should append one landed point to a committed history chain
- the viewport should draw a segment from the previously committed point to the newly committed point
- the toolbar should show the same ordered history the viewport is drawing
- `Origin` must remain a persistent preserved anchor for the history chain
- sketch-plane history must persist with the sketch-plane placement instead of resetting when the user leaves and later re-enters `SketchPlane`
- the `Transform History` section chevron should only hide/show the history rows
- the separate `Merge History` button should actually compact the stored history entries
- locking a history entry should preserve that checkpoint during collapse
- the active final sketch-plane placement must always remain intact even when history is collapsed

Example:
- user enters:
  - `G > S > SP > M`
- first commit lands at:
  - `Vec3(3,3,3)`
- second commit lands at:
  - `Vec3(3,6,3)`
- third commit lands at:
  - `Vec3(1,6,0)`
- result:
  - toolbar history reads like:
    - `Origin`
    - `Vec(+3, +3, +3)`
    - `Vec(+0, +3, +0)`
    - `Vec(-2, +0, -3)`
  - viewport history reads like:
    - `origin -> p1 -> p2 -> p3`

Current code-to-target mapping:
- current sketch-plane session already has live move command ownership in:
  - `sketchPlanePickSession`
- current move-command origin / guide behavior already exists from the shipped live-move work
- current viewport already knows how to draw the active move guide between the last committed point and the live draft point
- current gap:
  - only the most recent command-origin / draft segment is visible
  - there is no committed multi-step point history
  - there is no toolbar section that explains how the plane got to the current placement
  - there is no collapse/lock behavior for that history

Phase boundary:
- `[3.2B-S7]` should add:
  - committed sketch-plane translation history
  - viewport history path rendering
  - toolbar-visible `Transform History`
  - collapse and lock behavior for history entries
- `[3.2B-S7]` should not add:
  - authored browser/export ownership for the history
  - rotate-history parity
  - general undo/redo redesign
  - per-frame drag sampling
  - non-sketch transform history

### Questions / Decisions

#### [x] `q1` Decide what should count as a history entry.

##### Suggestion
- locked direction:
- only committed sketch-plane move results should become history entries
- do not record transient mouse-drag samples
- do not append an entry until the move command is actually accepted

#### [x] `q2` Decide whether the history should store diffs or landed points as the primary user-facing read.

##### Suggestion
- locked direction:
- preserve landed points as the primary history read
- the user should be able to read:
  - `origin -> p1 -> p2 -> p3`
- collapse may internally add diffs, but the visible meaning should still be the committed point chain

#### [x] `q3` Decide where the history should appear first.

##### Suggestion
- locked direction:
- add a dedicated collapsible `Transform History` section to the `SketchPlane` toolbar
- keep the first cut local to the sketch-plane surface instead of expanding into browser/authored-content surfaces

#### [x] `q4` Decide how the viewport should represent the history.

##### Suggestion
- locked direction:
- draw one line segment per committed span
- each segment connects:
  - previous committed point
  - next committed point
- keep the active live move guide separate so in-progress motion can still sit on top of the committed path

#### [x] `q5` Decide what `Merge History` should do.

##### Suggestion
- locked direction:
- `Merge History` is the user-facing button label for the compaction action
- merge history is a real compaction action, not just a temporary hide/show view
- with no locked entries, collapse should reduce the history list to:
  - `Origin`
  - final `Vec3`
- with locked entries, collapse should preserve:
  - `Origin`
  - any locked entries
  - final `Vec3`
- the final resulting sketch-plane position must remain the same
- collapse is a history compaction action, not a transform mutation

#### [x] `q6` Decide what `Lock` should do.

##### Suggestion
- locked direction:
- locking a history entry preserves that checkpoint during collapse
- collapse should only combine the unlocked spans between preserved locked entries
- if the last committed entry is locked, collapse can reduce the later span entirely into that locked final entry

#### [x] `q7` Decide where the first path should start.

##### Suggestion
- locked direction:
- start the first committed history path from origin
- the user should be able to read how the sketch plane left origin and reached its later placements

#### [x] `q8` Decide whether this phase should include rotation history.

##### Suggestion
- locked direction:
- no
- the first honest cut should focus on committed translation `Vec3` history only
- later work can decide whether rotation gets its own parallel history model

#### [x] `q9` Decide whether transform history should reset when the user leaves `SketchPlane`.

##### Suggestion
- locked direction:
- no
- transform history must persist with the sketch-plane placement
- leaving and later re-entering `SketchPlane` should restore the same committed history chain
- this keeps the plane history readable and avoids implying that the plane moved without explanation

#### [x] `q10` Decide whether `Origin` should be a normal lockable row.

##### Suggestion
- locked direction:
- no
- `Origin` should always remain preserved
- `Origin` is not a normal lock-toggle row
- collapse should always keep `Origin` as the first visible anchor of the chain

#### [x] `q11` Decide whether the section chevron and `Merge History` mean the same thing.

##### Suggestion
- locked direction:
- no
- the section chevron only hides/shows the `Transform History` entry list
- `Merge History` is a separate action button docked on the top-right of the `Transform History` header row
- `Merge History` compacts the actual history entries
- reopening the section with the chevron should not restore entries that were already compacted by `Merge History`

#### [x] `q12` Decide how each transform-history row should read.

##### Suggestion
- locked direction:
- each row should read as the committed diff from the previous point, not only the absolute landed point
- first-pass row format:
  - `Vec(+3, +6, -5)`
- include explicit signs on each axis so the direction of travel is readable at a glance
- `Origin` remains the fixed first anchor row and does not use the diff format

#### [x] `q13` Decide whether the user can unmerge after `Merge History`.

##### Suggestion
- locked direction:
- no
- `Merge History` is destructive for the stored history entries in the first cut
- there is no dedicated `Unmerge History` action
- once rows are merged, the user cannot restore the earlier pre-merge entries through the transform-history UI

#### [x] `q14` Decide whether locked rows need special viewport styling.

##### Suggestion
- locked direction:
- no
- locked rows should affect which checkpoints survive `Merge History`
- but locked rows do not need unique color, marker, or line styling in the viewport for the first cut
- preserve the lock meaning in the toolbar rows and path logic only

### Implementation Spec

Purpose:
- make the sketch-plane move story inspectable after multiple commits
- let the toolbar explain the same committed path the viewport is drawing
- give the user a way to preserve important checkpoints while simplifying noisy intermediate move history

#### Current Code-To-Target Mapping

- likely runtime ownership remains near the existing sketch-plane session/store seams in:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/components/ViewportOverlay.tsx`
  - `src/viewer/sketch/SketchPlanePickHelper.ts`
- current code truth:
  - the sketch-plane session already tracks current draft and committed transform state
  - the shipped move-guide follow-on already established a command-origin/start marker plus current guide line behavior
  - the missing piece is not baseline move visualization
  - the missing piece is persistent committed point history plus toolbar-visible history controls
- target:
  - one ordered history chain attached to sketch-plane placement truth
  - one shared read for toolbar rows and viewport line segments
  - one collapse/lock model that changes history presentation without changing the active final transform

#### Scope

Owned here:
- committed translation history entries for sketch-plane move accepts
- ordered point-chain reconstruction:
  - `origin -> p1 -> p2 -> ... -> final`
- toolbar `Transform History` section
- per-entry lock state
- `Merge History` behavior
- viewport line-segment rendering for the committed path

Not owned here:
- rotate history
- authored browser/export persistence
- replacing undo/redo
- live drag ghost trails
- global transform-history UI outside `SketchPlane`

#### Data Shape Direction

First recommended state shape inside or beside the existing sketch-plane placement session:

```ts
type SketchPlaneTransformHistoryEntry = {
  id: string
  point: Vec3
  locked: boolean
}

type SketchPlaneTransformHistoryState = {
  origin: Vec3
  committedEntries: SketchPlaneTransformHistoryEntry[]
  sectionCollapsed: boolean
}
```

Important behavior notes:
- `origin` remains the first anchor for the visible chain
- `origin` is always preserved and should not participate in normal lock toggling
- `committedEntries` stores landed points in chronological order
- the history state should persist with the sketch-plane placement instead of being discarded when the local toolbar session closes
- `sectionCollapsed` is only for toolbar show/hide behavior
- `Merge History` compacts `committedEntries` themselves
- lock state belongs to the history entries themselves
- row display should derive signed per-step diffs from the committed point chain

#### Toolbar Direction

- add a collapsible `Transform History` section to the sketch-plane toolbar
- dock a `Merge History` button on the top-right of that same section header row
- render committed entries in chronological order
- render `Origin` as the fixed first preserved anchor
- each visible row after `Origin` should read as the signed diff from the previous preserved point:
  - `Vec(+3, +6, -5)`
- add `Lock` per entry
- the section chevron should only hide/show the list under the header
- `Merge History` should compact the actual list entries
- after `Merge History`:
  - with no locked entries:
    - `Origin`
    - final point
  - with locked entries:
    - `Origin`
    - locked entries in order
    - final point

#### Viewport Direction

- draw one committed line segment between each visible pair of history points
- when the section is hidden by the chevron, the viewport path should still use the actual current history data
- after `Merge History`, the viewport path should redraw from the compacted history entries
- keep the active move guide independent:
  - committed path remains the history
  - live guide remains the current in-progress motion from the last committed point to the draft point
- do not add special viewport styling for locked rows in the first cut

#### Collapse Rules

- collapse must not change the actual final sketch-plane transform
- collapse must not delete locked entries
- collapse must preserve the visual path checkpoints represented by:
  - `origin`
  - any locked entries
  - final point
- `origin` must always survive collapse without needing its own lock state
- all unlocked intermediate spans between preserved checkpoints should be compacted away
- if there are no locked entries, collapse should reduce the list directly to:
  - `origin`
  - final point
- when merged rows survive, their visible label should still print the signed diff represented by that preserved span
- merge is destructive for the stored history rows in the first cut
- there is no dedicated unmerge action in this phase

Example:
- expanded:
  - `origin -> p1 -> p2(lock) -> p3 -> p4`
- collapsed:
  - `origin -> p2(lock) -> p4`

Example when last point is locked:
- expanded:
  - `origin -> p1 -> p2 -> p3(lock)`
- collapsed:
  - `origin -> p3(lock)`

#### Implementation Steps

1. Add committed transform-history state to the sketch-plane session/store seam.
- initialize history from origin when the sketch-plane placement is first created
- append one new committed point whenever a move command is accepted
- when the user later re-enters `SketchPlane`, rehydrate the existing committed history instead of starting a fresh chain

2. Derive visible history rows from raw history state.
- support section hide/show independently from history compaction
- when `Merge History` runs, rewrite the stored history list to keep:
  - `Origin`
  - locked entries in order
  - final point

3. Publish toolbar-facing history data.
- add a `Transform History` section to the sketch-plane toolbar
- render entry rows plus `Lock` and `Merge History` controls

4. Publish viewport-facing history path data.
- send visible history points/segments to the sketch-plane overlay/helper that already owns the current move guide visuals
- render the committed chain separately from the active draft guide

5. Keep command acceptance as the only append point.
- do not append on drag frames
- do not append on canceled moves
- do not append on section show/hide toggles
- do not append on merge-history compaction

#### Verification Matrix

- first accepted move from origin creates:
  - `origin -> p1`
- second accepted move creates:
  - `origin -> p1 -> p2`
- canceled move does not append a new history point
- leaving and re-entering `SketchPlane` restores the same committed history chain
- expanded toolbar shows all committed points in order
- expanded toolbar prints signed per-step diffs after `Origin`
- expanded viewport draws one segment per committed span
- section chevron hide/show does not change stored history entries
- `Merge History` with no locked entries preserves:
  - `origin -> final`
- locking `p2` then collapsing preserves:
  - `origin -> p2 -> final`
- locking only the last point then collapsing preserves:
  - `origin -> final`
- after `Merge History`, the earlier pre-merge rows cannot be restored through a dedicated unmerge control
- locked rows do not receive special viewport-only styling in the first cut
- collapse does not change the actual final sketch-plane transform
- active live move guide still renders from the last committed point to the draft point during a new move
