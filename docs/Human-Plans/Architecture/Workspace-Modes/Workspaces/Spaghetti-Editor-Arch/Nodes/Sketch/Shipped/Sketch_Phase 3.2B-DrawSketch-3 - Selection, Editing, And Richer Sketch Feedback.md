## [x] - `3.2B-DrawSketch-3` - `Selection And Delete`

### Header

Purpose:
- add the first honest entity-selection pass to `Sketch Draw` so the user can target existing sketch content and remove it without leaving the sketch authoring surface

Owns:
- committed-entity selection inside `Sketch Draw`
- entity-selection behavior inside idle `Sketch Draw`
- viewport hover and selected feedback for existing sketch entities
- blue `Window Selection` and green `Crossing Selection` box behavior
- one clear delete path for the current selection set
- selection sync between viewport picks and the `Entities` list
- the explicit separation between entity selection and later profile review
- the boundary before later move/edit/grip work

### Questions / Decisions

#### [x] - `q1` Decide the first selection behavior.

##### Suggestion
- locked direction:
- include:
  - single click selection
  - blue `Window Selection`
  - green `Crossing Selection`
- wording:
  - `Window Selection`
    - entities must be fully enclosed by the box
  - `Crossing Selection`
    - entities only need to intersect, touch, or cross the box
- use the current sketch rule:
  - mouse move `-X`
    - blue `Window Selection`
  - mouse move `+X`
    - green `Crossing Selection`
- do not add paint select or lasso select in the first cut

#### [x] - `q2` Decide the first selectable entity set.

##### Suggestion
- locked direction:
- include only committed top-level sketch entities:
  - `line`
  - `pline`
  - `rectangle`
  - `circle`
- do not select draft geometry
- do not select rectangle corners, polyline subsegments, or other sub-entity handles in this phase

#### [x] - `q3` Decide the first delete triggers.

##### Suggestion
- locked direction:
- support:
  - viewport keyboard `Delete`
  - local console `delete` / `del`
  - one visible toolbar/list delete action when a selection exists
- delete should act immediately on the current selection set with no extra confirm prompt in the first cut

#### [x] - `q4` Decide how selection should interact with active draw tools.

##### Suggestion
- locked direction:
- selection should live in idle `Sketch Draw`, not as a peer draw tool
- after a draw-tool commit, `Sketch Draw` returns to idle draw selection behavior
- in idle draw state:
  - click on an entity can single-select it
  - click in empty viewport space starts the selection-window anchor
  - mouse movement previews `Window` or `Crossing` based on the drag direction rule above
- `Enter` or `Previous` can re-arm the last draw tool from idle draw state
- arming `Line`, `PLine`, `Rectangle`, or `Circle` should clear the current selection set and leave idle draw selection behavior
- active draft placement should not compete with committed-entity targeting in this phase

#### [x] - `q5` Decide how `DS-3` relates to the existing `review` mode.

##### Suggestion
- locked direction:
- `DS-3` owns entity selection, not profile review
- entity selection should extend:
  - `geometrySketchSession.mode === 'draw'`
  - `drawStage === 'sessionIdle'`
- the current `geometrySketchSession.mode === 'review'` remains the separate profile-review surface
- do not overload one `review` label to mean both:
  - closed-profile selection
  - committed-entity selection

#### [x] - `q6` Decide the first selection-set replacement rules.

##### Suggestion
- locked direction:
- with no modifier system in this phase:
  - clicking an entity replaces the current selection set with that one entity
  - clicking empty space with no drag clears selection
  - completing a `Window` or `Crossing` drag replaces the current selection set with the matched entities
  - clicking an `Entities` row replaces the current selection set with that one entity
- additive selection belongs to a later follow-on

### Implementation Spec

- numbering note:
  - keep the `3.2B-DrawSketch-3` id for continuity even though `[3.2B-DrawSketch-4]` and `[3.2B-DrawSketch-5]` already shipped before this refocus
- current code truth:
  - the viewer already renders committed sketch geometry and an `Entities` list under `Sketch Draw`
  - sketch components already have stable ids and first-class types:
    - `line`
    - `pline`
    - `rectangle`
    - `circle`
  - the runtime already distinguishes:
    - `geometrySketchSession.mode === 'draw'`
    - `geometrySketchSession.mode === 'review'`
  - current code truth is that `review` is already being used for profile review UI, including profile-card selection and `setGeometrySketchSelectedProfile(...)`
  - so `DS-3` should not reuse `review` for entity selection
  - the current gap is not geometry ownership
  - the current gap is entity targeting inside idle draw, selected-state storage, and destructive commands against committed sketch content
- first recommended state shape:
  - extend `geometrySketchSession` with sketch-draw-local entity-selection state such as:
    - `selectedComponentIds: string[]`
    - `hoveredComponentId: string | null`
    - `selectionWindowDraft`
      - `anchor: Vec2`
      - `current: Vec2`
      - `mode: 'window' | 'crossing'`
- current code-to-target mapping:
  - `useSpaghettiStore.ts`
    - keep entity selection under:
      - `geometrySketchSession.mode === 'draw'`
      - `drawStage === 'sessionIdle'`
    - extend:
      - `runGeometrySketchDrawCommand(...)`
      with:
      - `delete`
      - `del`
      behavior for the current selection set while idle
  - `ViewerHost.tsx`
    - current draw hover/click routing already reaches:
      - `setGeometrySketchDrawHoverPoint(...)`
      - `confirmGeometrySketchDrawPoint(...)`
    - this phase should add idle entity-hit routing beside that point-confirm path
  - `ViewportOverlay.tsx`
    - the `Entities` list is already present in draw mode
    - this phase should sync row clicks and selected styling to the same entity-selection state
  - `ViewportOverlay.tsx`
    - keep profile cards and `setGeometrySketchSelectedProfile(...)` under the separate profile-review surface
- first implementation target:
  - while `geometrySketchSession.mode === 'draw'` and `drawStage === 'sessionIdle'`, moving over committed sketch content can surface one hover candidate
  - clicking a committed entity replaces selection with that one entity
  - clicking empty viewport space with no drag clears selection
  - clicking empty viewport space then dragging starts a selection-window anchor
  - dragging from that anchor previews:
    - blue `Window Selection`
      - fully enclosed entities only
    - green `Crossing Selection`
      - touched/intersected entities included
  - completing the drag replaces the current selection set with the matched entity ids
  - clicking an entity row in `Entities` replaces selection with that same committed component
  - viewport and `Entities` list selection stay in sync
  - selected rows and selected viewport geometry both receive visible selected styling
  - `Delete`, `delete`, or `del` removes the selected component set and clears selection
- selection ownership should stay sketch-session-local:
  - one selected committed component-id set
  - one hover candidate id
- one active selection-window draft:
  - anchor point
  - current box
  - current mode:
    - `window`
    - `crossing`
- arming `Line`, `PLine`, `Rectangle`, or `Circle` should clear selection and return the viewer to draw targeting instead of mixing entity pick and point pick at the same time
- after a tool commit, `Sketch Draw` should return to idle draw selection behavior instead of immediately staying armed on the last draw tool
- `pline` should behave as one top-level selectable entity in this phase
- this phase does not own:
  - closed-profile selection
  - profile review mode
  - drag/move of existing entities
  - grip handles
  - corner/segment-level rectangle or polyline editing
  - additive modifier-based multi-select beyond the selection box result itself
  - endpoint snap
  - broader inference systems
- success means `Sketch Draw` can now do the first real review action on committed content:
  - return to idle draw after a draw commit
  - select one or more committed entities via click or selection box
  - read that selection in both viewport and list
  - delete it directly
- targeted verification matrix:
  - `useSpaghettiStore.test.ts`
    - selection-set replace/clear/delete behavior in idle draw
  - `ConsoleDock.test.tsx`
    - idle draw `delete` / `del` routing and `Enter` re-arm behavior
  - `ViewportOverlay.test.tsx`
    - entity-row selection sync and selected styling
  - viewer-side sketch overlay or draw-helper tests
    - `Window` vs `Crossing` candidate resolution
