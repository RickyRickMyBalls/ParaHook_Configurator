## [ ] - `3.2B-DrawSketch-6` - `Snap Growth`

### Header

Purpose:
- define the next sketch-draw snap family after the shipped origin-only snap
- split the work into smaller snap follow-ons instead of treating all snap growth as one phase

Owns:
- the snap-family phase split
- shared snap-control direction in the sketch-draw toolbar
- the first endpoint-snap vertical slice
- later room for midpoint / center / other snap growth

### Questions / Decisions

#### [x] - `q1` Decide the first endpoint candidate set.

##### Suggestion
- locked direction:
- include:
  - line endpoints
  - polyline segment endpoints
  - rectangle corners
  - the existing origin snap
- do not include yet:
  - midpoint
  - center
  - tangent
  - intersection
  - tracking/inference-only guides

#### [x] - `q2` Decide whether endpoint snap should be tool-specific or shared across the active point-placement tools.

##### Suggestion
- locked direction:
- shared
- any active point-placement tool should be able to consume endpoint snaps when it is asking for the next point

#### [x] - `q3` Decide the exact first endpoint extraction rules per committed entity type.

##### Suggestion
- locked direction:
- include:
  - `line`
    - `a`
    - `b`
  - `pline`
    - every committed segment start/end endpoint
    - adjacent repeated endpoints should be de-duplicated before snap ranking
  - `rectangle`
    - the four committed corners
- do not include yet:
  - `circle` center
  - `circle` edge witness
  - profile-derived points
  - any endpoint from the currently active uncommitted draft

#### [x] - `q4` Decide how endpoint snap should coexist with the already-shipped origin snap.

##### Suggestion
- locked direction:
- origin stays in the same shared snap search
- first ranking rule:
  - nearest qualifying candidate in screen-space inside the active snap radius wins
- if origin and endpoint are both inside range:
  - choose the nearer one
- do not add a special origin-priority override in this phase

#### [x] - `q5` Decide when endpoint snap is allowed to drive the committed point.

##### Suggestion
- locked direction:
- only while an active point-placement draw tool is asking for a point
- include:
  - `Line`
  - `PLine`
  - `Rectangle`
  - `Circle`
- do not apply in:
  - idle `Sketch Draw` selection mode
  - typed `Vec2` parsing itself
  - later entity move/edit workflows

#### [x] - `q6` Decide the first user-visible feedback contract for endpoint snap.

##### Suggestion
- locked direction:
- keep the current snap marker and reuse it for endpoint snap
- when snapped:
  - hover point resolves to the snapped coordinate
  - marker sits on the snapped endpoint
  - console/status path uses the snapped coordinate, not the unsnapped hover coordinate
- do not add endpoint labels, badges, or richer inference guides in this phase

#### [x] - `q7` Decide where the current sketch-draw snap controls should live before richer snap types are added.

##### Suggestion
- locked direction:
- move `Snap` and `Snap Distance` out of the sketch-draw `i` menu settings subsection
- create a dedicated main `Snap` section in the `Sketch Draw` toolbar
- first contents of that section:
  - `Snap`
  - `Snap Distance`
- later snap-family rows can expand there:
  - `Endpoint`
  - `Midpoint`
  - `Center`
  - others
- leave visual-only rows such as crosshair and point-symbol controls in the existing settings/customization surface

#### [x] - `q8` Decide whether the first endpoint-snap implementation should reuse the already-shipped sketch-draw snap prefs.

##### Suggestion
- locked direction:
- reuse the existing persisted prefs:
  - `sketchDrawSnapEnabled`
  - `sketchDrawSnapDistancePx`
- do not invent a second endpoint-specific toggle/value pair in this phase
- endpoint snap should honor the same on/off and radius controls that origin snap already uses

### Implementation Spec

- current code truth:
  - `GeometrySketchDrawHelper` already has:
    - a visible snap marker
    - origin snap search
  - `geometrySketchSession.drawDraft.hoverSnapTarget` is still limited to:
    - `origin`
  - the sketch-draw snap prefs already exist and already flow through the viewer overlay vm:
    - `src/app/store/uiPrefsStore.ts`
    - `src/app/components/ViewerHost.tsx`
  - the current toolbar placement is still under the sketch-draw settings subsection in:
    - `src/app/components/ViewportOverlay.tsx`
- current gap:
  - there is no candidate gathering or session typing for committed sketch endpoints yet
  - the current toolbar layout does not expose snap as a first-class sketch-draw section yet
- first data-model target:
  - extend the draw-draft snap-target shape so hover can carry:
    - `origin`
    - `endpoint`
  - first endpoint payload should preserve at minimum:
    - snapped sketch-space coordinate
    - source component id / row id
    - small source kind such as `line`, `pline`, or `rectangle`
- first endpoint extraction target:
  - gather committed candidates from the active sketch node only
  - include:
    - line `a/b`
    - pline committed segment endpoints
    - rectangle corners
  - exclude:
    - current draft geometry
    - circle center/edge
    - profile-derived points
- first honest runtime target:
  - first UI cleanup:
    - move `Snap` and `Snap Distance` into a dedicated `Snap` section in the main `Sketch Draw` toolbar
    - keep those controls bound to the existing sketch-draw snap prefs
  - while a point-based draw command is active, the hover point should snap to the nearest qualifying endpoint inside the existing snap radius
  - the snap marker should move onto that endpoint
  - confirm should commit the snapped coordinate through the same canonical point-confirm seam already used by click and typed `Vec2`
  - origin snap should keep working as it does today
- nearest-candidate choice should stay deterministic:
  - use nearest endpoint in screen-space within the active snap radius
- likely runtime ownership remains near:
  - `src/app/components/ViewportOverlay.tsx`
    - move `Snap` and `Snap Distance` into a dedicated `Sketch Draw` toolbar section
  - `src/viewer/geometrySketchOverlay.ts`
    - collect committed endpoint candidates from active sketch content
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - store the resolved snapped hover point and target kind in the draw draft
  - `src/viewer/sketch/GeometrySketchDrawHelper.ts`
    - render the shared snap marker against endpoint targets
  - `src/app/console/ConsoleDock.tsx`
    - continue reflecting the snapped coordinate through existing live draw breadcrumb/status output
- first verification target:
  - viewport hover near a committed endpoint resolves to that exact endpoint coordinate
  - clicking while snapped commits the snapped coordinate, not the raw hover coordinate
  - typed `Vec2` submit still bypasses hover snap and commits the typed coordinate directly
  - if no candidate is inside radius, current free-hover/origin behavior remains unchanged
- this phase should not add:
  - midpoint snap
  - center snap
  - tangent/perpendicular snap
  - full inference/tracking overlays
  - constraint solving

### Acceptance Checks

- a dedicated `Snap` section exists in the main `Sketch Draw` toolbar
- that section owns `Snap` and `Snap Distance`
- the old sketch-draw settings subsection no longer owns those two rows
- active `Line` placement can snap to an existing committed endpoint
- active `PLine` placement can continue from an existing committed endpoint
- rectangle corners participate as snap targets
- `Circle` center and edge placement can consume endpoint snaps from existing line / pline / rectangle geometry
- origin snap still works after endpoint snap is added
- nearest-candidate choice stays deterministic when multiple endpoints are inside the snap radius

### Subphases

#### [ ] - `3.2B-DrawSketch-6.0` - `Snap Toolbar And Shared Snap Controls`

Purpose:
- move snap controls into a first-class `Snap` section before more snap types are added

Owns:
- toolbar reorganization
- shared snap on/off control ownership
- shared snap distance control ownership
- reuse of the existing sketch-draw snap prefs

First targets:
- move `Snap` and `Snap Distance` out of the sketch-draw settings submenu
- create a dedicated main `Snap` section in the `Sketch Draw` toolbar
- keep the controls wired to:
  - `sketchDrawSnapEnabled`
  - `sketchDrawSnapDistancePx`
- leave visual-only draw settings in the existing settings/customization surface

#### [ ] - `3.2B-DrawSketch-6.1` - `Endpoint Snap First Pass`

### Header

Purpose:
- extend the shipped origin snap into the first committed-geometry object snap

Owns:
- committed endpoint candidate gathering
- origin-plus-endpoint ranking
- snapped hover/confirm behavior
- shared point-placement tool reuse across `Line`, `PLine`, `Rectangle`, and `Circle`

Keeps out of scope:
- midpoint / center / quadrant snap
- nearest / perpendicular / tangent / intersection snap
- ortho / polar / object-snap tracking
- per-snap toggles and symbol customization

### Current Seam Read

- `GeometrySketchDrawHelper` already computes:
  - sketch-plane hover point
  - origin snap hit-testing
  - snap marker rendering
- `ViewerHost` already forwards:
  - hover point
  - `snapTarget`
  through the existing geometry-sketch callbacks
- `useSpaghettiStore` already owns:
  - `geometrySketchSession.drawDraft.hoverPoint`
  - `geometrySketchSession.drawDraft.hoverSnapTarget`
  - canonical point confirm via `confirmGeometrySketchDrawPoint(...)`
- current hard limit:
  - `hoverSnapTarget` is still only `origin | null`
  - no committed endpoint candidate gathering exists yet
- current toolbar snap prefs already exist from `6.0` groundwork:
  - `sketchDrawSnapEnabled`
  - `sketchDrawSnapDistancePx`

### Questions / Decisions

#### [x] - `q1` Which committed entity types supply endpoint candidates in the first cut?

##### Suggestion
- locked direction:
- include committed:
  - `line`
    - `a`
    - `b`
  - `pline`
    - all committed segment endpoints
  - `rectangle`
    - four corners
- exclude:
  - `circle`
  - active draft geometry
  - profile-derived points

#### [x] - `q2` How should origin and endpoint candidates compete?

##### Suggestion
- locked direction:
- one shared ranking pass
- nearest qualifying candidate in screen-space inside the active snap radius wins
- no special origin override

#### [x] - `q3` Which active tools can consume endpoint snap in this first cut?

##### Suggestion
- locked direction:
- `Line`
- `PLine`
- `Rectangle`
- `Circle`
- only while the tool is actively asking for a point

#### [x] - `q4` What is the first snap-target data expansion?

##### Suggestion
- locked direction:
- extend the current `hoverSnapTarget` shape beyond `origin`
- first new target kind:
  - `endpoint`
- preserve enough payload to identify:
  - snapped coordinate
  - source component row / id
  - source kind

### Implementation Spec

Recommended file changes:
- edit `src/viewer/geometrySketchOverlay.ts`
- edit `src/app/spaghetti/store/useSpaghettiStore.ts`
- edit `src/viewer/sketch/GeometrySketchDrawHelper.ts`
- edit `src/app/components/ViewerHost.tsx`
- edit `src/app/console/ConsoleDock.tsx`
- add or update focused tests near:
  - `src/viewer/geometrySketchOverlay.test.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/console/ConsoleDock.test.tsx`

Implementation steps:
1. extend the geometry-sketch overlay vm snap-target type so it can represent `endpoint`
2. add committed endpoint candidate extraction from the active sketch content:
   - line endpoints
   - pline segment endpoints
   - rectangle corners
3. de-duplicate repeated pline endpoints before ranking
4. rank origin plus endpoint candidates in one screen-space pass using the existing snap radius
5. return the winning snapped coordinate and target kind through the existing viewer hover callback
6. store that resolved endpoint target in `geometrySketchSession.drawDraft.hoverSnapTarget`
7. keep `confirmGeometrySketchDrawPoint(...)` as the canonical commit seam; do not invent a second snap-specific confirm path
8. reuse the existing snap marker in `GeometrySketchDrawHelper`
9. keep live console/status readouts showing the snapped coordinate rather than the raw hover coordinate

Required behavior-preservation rules:
- do not break origin snap
- do not change typed `Vec2` input behavior
- do not widen into midpoint/center/quadrant or tracking aids
- do not require a new endpoint-specific preference toggle in this phase

Verification:
- run:
  - `src/viewer/geometrySketchOverlay.test.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/console/ConsoleDock.test.tsx`
- manually smoke-check:
  - line start snaps to committed line endpoint
  - pline continues from a committed endpoint
  - rectangle corner snaps to a committed rectangle corner
  - circle center and edge-point stages can both consume endpoint snap
  - origin still wins when it is the nearest valid candidate
  - free hover still works when no candidate is inside the snap radius

Definition of done:
- committed line / pline / rectangle endpoints participate in one shared snap search
- active `Line`, `PLine`, `Rectangle`, and `Circle` sessions can consume those endpoint snaps
- `hoverSnapTarget` can represent `endpoint`, not only `origin`
- the existing snap marker and console/status flow reflect the snapped endpoint correctly
- no midpoint/center/quadrant or tracking behavior is accidentally pulled into this cut

Later likely children:
- `3.2B-DrawSketch-6.2`
  - midpoint / quadrant / center snap
- `3.2B-DrawSketch-6.3`
  - nearest / perpendicular / tangent / intersection snap
- `3.2B-DrawSketch-6.4+`
  - ortho / polar tracking / object snap tracking
- `3.2B-DrawSketch-6.5+`
  - richer snap symbol and per-snap preference growth

### Bigger Vision

#### AutoCAD-Like Snap Families To Plan For

- object snaps:
  - endpoint
  - midpoint
  - center
  - quadrant
  - nearest
  - perpendicular
  - tangent
  - intersection
  - apparent intersection
  - extension
  - parallel
  - later if relevant:
    - node
    - insertion
- tracking aids:
  - ortho
  - polar tracking
  - object snap tracking

#### Suggested ParaHook Snap Growth Order

- first:
  - shared snap toolbar and shared snap prefs
  - endpoint snap
- next:
  - midpoint
  - quadrant on circles/arcs
  - center on circles/arcs
- then:
  - nearest
  - perpendicular
  - tangent
  - intersection
- then:
  - ortho
  - polar tracking by angle increment
  - object snap tracking / extension guides
- later:
  - per-snap enable/disable rows
  - per-snap marker/symbol customization
  - temporary snap overrides

#### Suggested Snap Subphase Ladder

- `[3.2B-DrawSketch-6.0]`
  - `Snap Toolbar And Shared Snap Controls`
  - move `Snap` / `Snap Distance` into a first-class toolbar section
  - keep one shared master snap toggle and one shared snap radius
- `[3.2B-DrawSketch-6.1]`
  - `Endpoint Snap First Pass`
  - first committed-geometry snap target
  - shared across `Line`, `PLine`, `Rectangle`, and `Circle`
- `[3.2B-DrawSketch-6.2]`
  - `Midpoint Center And Quadrant Snaps`
  - add the first geometric helper snaps that do not require line-solution math
  - covers:
    - midpoint
    - circle/arc center
    - circle/arc quadrant
- `[3.2B-DrawSketch-6.3]`
  - `Nearest Perpendicular Tangent And Intersection`
  - add the first computed relation-based snaps
  - covers:
    - nearest
    - perpendicular
    - tangent
    - intersection
    - apparent intersection if worth keeping with the same math pass
- `[3.2B-DrawSketch-6.4]`
  - `Ortho And Polar Tracking`
  - add directional drafting aids separate from object snaps
  - covers:
    - ortho
    - polar tracking
    - polar angle increment controls
- `[3.2B-DrawSketch-6.5]`
  - `Object Snap Tracking Extension And Parallel`
  - add guide-driven snap/tracking behavior that builds on prior snap targets
  - covers:
    - object snap tracking
    - extension
    - parallel
- `[3.2B-DrawSketch-6.6]`
  - `Snap Preferences Symbols And Temporary Overrides`
  - expand the settings surface once the main snap families are real
  - covers:
    - per-snap enable/disable rows
    - symbol visibility/style growth
    - marker scale refinements
    - temporary snap overrides

Recommended minimum safe count:
- `7` subphases total
- reason:
  - `6.0` / `6.1` keep the current toolbar cleanup separate from the first real object snap
  - `6.2` / `6.3` separate simple geometric snaps from computed relation snaps
  - `6.4` keeps line-tracking aids separate from object snaps
  - `6.5` keeps guide-driven tracking math separate from plain tracking and plain snaps
  - `6.6` keeps UX/settings growth from blocking the core snap math phases

#### Suggested View-Toolbar Direction

- `Snap`
  - master on/off
  - snap distance
- `Object Snaps`
  - endpoint
  - midpoint
  - center
  - quadrant
  - nearest
  - perpendicular
  - tangent
  - intersection
- `Tracking`
  - ortho
  - polar
  - object snap tracking
- `Polar`
  - angle increment
  - later additional angle set
- `Symbols`
  - master symbol on/off
  - marker scale
  - later per-snap symbol visibility/style

#### Suggested Product Rules

- keep one shared snap distance for the early phases
- do not make every snap type customizable immediately
- keep object snaps and tracking aids as separate concepts
- treat ortho and polar as line/tracking aids, not as object snaps
- let the view toolbar become the long-term home for running snap state, while `Sketch Draw` keeps a local `Snap` section for active authoring
