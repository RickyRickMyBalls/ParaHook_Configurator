## [x] - `3.2B-DrawSketch-1-Cleanup` - `Viewport Draw Workflow Cleanup`

### Header

Purpose:
- clean up the first shipped `DrawSketch-1` pass so the line/polyline workflow reads as one honest drafting session in the main model viewport instead of a first-cut prototype with leftover seams

Owns:
- draw-session visual cleanup after the first viewer-owned `Line` / `PLine` cut
- toolbar wording and section cleanup for `SketchDraw`
- camera / grid / origin polish for the aligned sketch-draw view
- ghost preview readability and temporary-chain clarity
- cleanup of first-pass local console/dev seams that should stay explicitly temporary
- draft-versus-committed honesty during an active draw session

### Questions / Decisions

#### [x] - `q1` Keep this cleanup phase focused on honesty and polish, not on expanding tool scope.

##### Suggestion
- yes
- use this phase to clean up:
  - viewport drafting feel
  - toolbar/session clarity
  - preview readability
  - confirm/cancel polish
- do not let this phase absorb:
  - new draw tools
  - richer snapping/inference
  - editing of existing entities
  - browser/deeper expose work

### Implementation Spec

Implemented cleanup from the shipped `DrawSketch-1` pass:

- tightened the real viewer-owned ghost preview so `Line` and `PLine` both show honest in-progress geometry in the main viewport instead of feeling like they only appear on commit
- stabilized the draft-to-committed handoff so the ghost preview and final committed line render on the same effective sketch plane without a visible jump on second click
- removed start/end/cursor marker drift by moving the drafting markers into the sketch-plane local frame so they stay visually locked to the same surface as the drawn geometry
- kept the active aligned sketch grid centered and readable while preserving the chosen sketch-plane view as the drafting surface
- expanded the `Sketch Draw` `i Menu` with first-pass real draw-visual controls for:
  - snap on/off
  - snap distance
  - crosshair size
  - start point on/off
  - start point symbol type
  - start point symbol size
- improved start-point defaults so the first loaded drafting marker is smaller and calmer:
  - default symbol is `circle`
  - default size is reduced
  - min clamp is low enough for fine tuning
- added `PLine` point-symbol controls in the `i Menu` for:
  - on/off
  - point size
  - symbol type
- added visible historical `PLine` point markers so prior polyline points remain readable in a muted color while the active last point still reads as the live endpoint

Cleanup boundaries that were kept intact:

- no new draw tools were added
- no richer snapping/inference system was added beyond first-pass origin behavior and visibility controls
- no selection/editing of existing entities was pulled forward
- no browser/expose work was mixed into this cleanup

Result:

- `3.2B-DrawSketch-1` now reads as a more honest first drafting loop
- `3.2B-DrawSketch-2` remains the next deeper session/lifecycle phase
- `3.2B-DrawSketch-3` remains the later selection/editing/richer-feedback phase


