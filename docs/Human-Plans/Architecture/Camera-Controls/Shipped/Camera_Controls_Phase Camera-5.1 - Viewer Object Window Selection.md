# Camera Controls Phase Camera-5.1 - Viewer Object Window Selection

## Doc Header

### Doc History
5. 2026-03-27 20:40: Corrected the lingering plain-language drag-direction contradiction so this phase now matches the implemented sketch-aligned rule everywhere: drag right is `Window` full enclosure and drag left is `Crossing` overlap
4. 2026-03-27 20:16: Added an explicit plain-language drag-direction rule so the phase now says directly that dragging left highlights anything overlapped while dragging right only captures objects that are fully enclosed, instead of relying only on the `Window` / `Crossing` shorthand
3. 2026-03-27 20:15: Tightened this phase into a more implementation-ready viewer-selection spec by locking the first eligible object classes, drag-start ownership rules, minimum marquee threshold, screen-space capture model, replace-selection semantics, and sharper viewer/host/store verification guidance
2. 2026-03-27 19:44: Renamed this live phase record from `5.0H-5.1` to `Camera-5.1` so the camera-controls family can start using the simpler `Camera-*` phase names while preserving the earlier mixed-numbering history entries
1. 2026-03-27 17:50: Created this standalone future phase doc for `[5.0H-5.1]`, translating the next camera-controls follow-on into an implementation-ready plan for drag-window object selection in the 3D viewer after the shipped camera baseline and the broader shared input-owner architecture direction

### Purpose

This doc defines the `[Camera-5.1]` follow-on under the camera-controls family.

Use it to answer:
- what the first viewer object window-selection pass should do
- how drag-window selection should coexist with camera gestures, hover, and future gizmos
- what `Window` versus `Crossing` should mean in the 3D viewer
- which seams should own marquee visuals, hit collection, and shared selection sync

### Why This Phase Exists

The shipped camera-controls work already established the core rule that camera input should be fallback behavior instead of stealing every plain viewport interaction.

That opened the door for stronger authoring interactions in the model viewport, but there is still no dedicated phase for one of the most important CAD-style follow-ons:
- press in empty viewport space
- drag a visible window
- select the objects captured by that window

This needs its own phase because it touches several boundaries at once:
- pointer ownership
- screen-space marquee rendering
- world-object hit collection
- final selection truth in app/browser state

It should not be left as an implied side effect of sketch selection or a generic future gizmo phase.

### Scope

This phase covers:
- first-pass 3D viewer object window selection
- drag-window ownership in the model viewport
- marquee overlay visuals
- first `Window` versus `Crossing` selection behavior
- first replace-selection semantics for viewer-selected objects
- selection result handoff into the shared app selection truth

This phase does not cover:
- sketch-entity-only box selection inside `Sketch Draw`
- polygon or fence selection
- additive/subtractive multi-select modifiers beyond what existing app selection already supports
- deep layer/lock/filter rules
- final object-selection command language
- arbitrary generated preview-only geometry that does not already participate in shared selection truth

## Doc Body

## [ ] - `[Camera-5.1]` - `Viewer Object Window Selection`

### Header

Purpose:
- add the first honest drag-window object-selection pass for the 3D viewer without widening into every later selection-set or filtering feature

Owns:
- marquee drag start/update/end behavior in the model viewport
- first visible selection rectangle
- first object-capture rules for `Window` and `Crossing`
- minimum drag threshold between click and marquee
- handoff from viewer hit results into shared selection truth

Keeps for later phases:
- fence selection
- polygon selection
- previous / last selection sets
- richer additive/subtractive selection grammar
- layer/lock/filter-aware selection policies

### Target Result

- the user can start a drag in empty model-viewport space and get a visible selection window
- dragging left-to-right performs `Window` selection
- dragging right-to-left performs `Crossing` selection
- dragging right should only highlight/capture objects that are fully enclosed by the marquee
- dragging left should highlight/capture anything the marquee overlaps
- the viewer can resolve which currently renderable objects fall inside or intersect that window
- releasing the drag updates the same shared selection truth the rest of the app already reads
- a tiny accidental pointer wobble still behaves like ordinary click-space, not a fake marquee
- camera pan/orbit do not steal that drag once the selection session has claimed it

### Current Seam Read

- `src/viewer/Viewer.ts` is the likely owner for:
  - viewport pointer capture for the model view
  - screen-space marquee overlay drawing
  - screen-space object projection/capture
- `src/app/components/ViewerHost.tsx` is the likely seam for:
  - passing current selected object state into the viewer
  - passing the current selectable viewer object identities/results into the viewer if they are not already locally derivable
  - receiving finalized selection results back out of the viewer
- `src/app/viewerBridge.ts` is the natural bridge for any new viewer callbacks such as:
  - finalized selected viewer-object keys
- current browser/app selection state already exists for:
  - parts/content selection
  - references
- current runtime already distinguishes viewer-owned render identity from broader authored/source truth, so this phase should select against the same stable viewer-facing keys the host can map back into shared app selection
- current camera-controls direction already says viewport tool interaction should beat camera navigation, so this phase should plug into that same ownership model instead of inventing a viewer-only exception

### Questions / Decisions

#### [x] - `q0` What should count as an eligible object in the first pass?

##### Suggestion
- keep the first cut narrow to objects that already have a real shared selection landing surface
- first eligible targets:
  - renderable part/content objects
  - loaded references that already participate in the shared selection model
- first ineligible targets:
  - gizmos and direct view widgets
  - grid/axes/helper visuals
  - temporary preview-only geometry with no stable shared selection identity

#### [x] - `q0.1` What identity should the marquee operate on?

##### Suggestion
- use stable viewer-facing object keys for hit collection
- map those keys back into the existing shared app selection truth in `ViewerHost` / store boundaries
- do not make the viewer directly own the long-term selected-object state

#### [x] - `q1` What should `Window` versus `Crossing` mean?

##### Suggestion
- left-to-right drag:
  - `Window`
  - object must be fully contained by the drag window
- right-to-left drag:
  - `Crossing`
  - object may be partially inside or intersect the drag window
- plain-language rule:
  - drag right = must be fully inside
  - drag left = anything overlapped counts
- keep the first rule explicit and CAD-like rather than inventing one ambiguous drag mode

#### [x] - `q2` How should the user see which drag mode is active?

##### Suggestion
- use one visible rectangle for both modes
- differentiate the modes through styling:
  - `Window` = one calmer solid-line treatment
  - `Crossing` = one visibly different treatment such as dashed or tinted contrast
- keep the first pass simple and readable instead of adding labels or a floating HUD immediately

#### [x] - `q3` When is the drag allowed to start selection instead of camera behavior?

##### Suggestion
- only start object-window selection from empty viewport space when no higher-priority owner claims the pointer first:
  - active modal tool interaction
  - hovered gizmo/widget hit
  - explicit in-viewport control
- use a small minimum drag threshold before the session visibly upgrades from click-candidate to marquee:
  - below threshold = still ordinary click-space
  - beyond threshold = marquee owns the pointer stream
- once the selection drag session starts, camera pan/orbit must stay out of that pointer stream until release

#### [x] - `q3.1` How should simple click versus marquee drag divide?

##### Suggestion
- mouse/pointer down in empty viewport space may arm marquee-candidate state
- if release happens before the minimum drag threshold is crossed:
  - treat it as ordinary empty-space click behavior
- if threshold is crossed:
  - show the marquee
  - begin `Window`/`Crossing` capture updates
  - suppress camera ownership until release

#### [x] - `q4` How should the final selection apply to existing selection truth?

##### Suggestion
- reuse the current shared selection model instead of inventing a viewer-local selected-object list
- first pass should behave like a plain replace-selection action unless an already-shipped modifier policy exists that should be preserved
- if the committed marquee contains eligible objects:
  - replace current viewer-object selection with that captured set
- if the committed marquee captures nothing:
  - follow the repo's existing empty-space selection semantics instead of inventing a marquee-only exception

#### [x] - `q5` How should containment/intersection be measured in the first cut?

##### Suggestion
- use screen-space capture against each eligible rendered object's projected 2D bounds for the first cut
- `Window`:
  - the projected object bounds must be fully contained by the marquee rectangle
- `Crossing`:
  - the projected object bounds may intersect the marquee rectangle
- do not widen the first pass into perfect per-triangle or occlusion-aware selection math unless the current viewer seams already make that almost free

#### [x] - `q6` Should hidden or occluded objects be captured?

##### Suggestion
- keep the first cut limited to the currently renderable/selectable visible object set the viewer already treats as active scene content
- do not intentionally include hidden/off objects
- do not promise deep occlusion correctness in this first pass unless existing viewer picking already provides it cheaply

### Implementation Spec

Recommended file changes:
- edit `src/viewer/Viewer.ts`
- edit `src/app/viewerBridge.ts`
- edit `src/app/components/ViewerHost.tsx`
- edit the relevant store/selection seam that already owns selected content/reference truth
- likely edit the viewer-side object/hit helper or add one small helper if the screen-space bounds math would otherwise bloat `Viewer.ts`
- likely edit tests in:
  - `src/app/components/ViewerHost.test.tsx`
  - a viewer test near `src/viewer/Viewer.ts`
- optional if selection math deserves isolation:
  - add a narrow helper such as a viewer window-selection helper with focused tests

Implementation steps:
1. define the first model-viewport drag-window session state:
   - idle
   - armed from empty-space pointer down
   - dragging after threshold
   - committed/cancelled
2. gate session start through the current viewport ownership rules:
   - tool/gizmo/widget owners win first
   - empty-space selection drag can arm otherwise
3. lock one small minimum drag threshold so click-space and marquee-space stay distinct
4. add the first marquee overlay rendering in the viewer:
   - anchor point
   - live rectangle update
   - direction-aware styling for `Window` versus `Crossing`
5. define the first eligible viewer-object set:
   - stable viewer-facing keys only
   - only objects with real shared selection landing surfaces
6. compute first-pass capture results in screen space:
   - full containment for `Window`
   - rectangle intersection for `Crossing`
7. return the finalized captured viewer keys through the viewer bridge into shared app selection state
8. preserve existing click-select and camera behavior outside active marquee sessions

Required behavior-preservation rules:
- do not break the shipped model-viewport camera baseline:
  - `Wheel` zoom
  - `MMB` pan
  - `Ctrl + MMB` orbit
- do not let the marquee start from gizmo handles or toolbar/widget surfaces
- do not create a second viewer-local source of truth for selection
- do not widen the first pass into sketch-only entity selection rules or polygon/fence variants
- do not require a full shared `Camera-5` owner-model refactor first if this pass can honestly reuse the current viewer-side arbitration seams
- do not promise perfect hidden-surface or per-triangle selection accuracy in the first pass unless existing seams already provide it

Verification:
- run the focused viewer and host tests touched by the implementation
- add or update tests for:
  - empty-space down + sub-threshold release does not falsely commit marquee selection
  - left-to-right `Window` capture
  - right-to-left `Crossing` capture
  - only eligible object classes are captured
  - camera gesture non-interference once marquee drag owns the pointer
  - shared selection handoff from viewer to app state
- manually smoke-check:
  - click empty viewport space without dragging
  - drag right in empty viewport space
  - drag right over one object fully
  - drag right across several objects partially and confirm partial overlap alone does not count
  - drag left across several objects partially and confirm overlap does count
  - drag that captures nothing still follows normal empty-space selection semantics
  - drag starting on a gizmo or direct widget should not begin marquee selection

Definition of done:
- the model viewport supports a visible drag-window selection pass for viewer objects
- `Window` and `Crossing` are both honest and direction-based
- click-space versus marquee-space is separated by one concrete threshold rule
- the resulting selection updates shared app truth rather than a local viewer-only cache
- the feature lands without absorbing later selection-set, polygon, or filter work
