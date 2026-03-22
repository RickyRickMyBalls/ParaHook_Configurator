## [ ] - `3.2B-SketchPlane-3` - `Geometry-Driven Auto-Setup And Selection Highlighting`

### Header

Purpose:
- allow model geometry to help drive sketch-plane setup

Owns:
- click geometry to infer sketch-plane placement/orientation
- first useful edge/geometry-driven auto-setup
- viewer hover/selection highlighting
- edge-line highlight feedback
- filled/tinted selection feedback
- hover versus committed source feedback

### Questions / Decisions

#### [ ] - `q1` Use the later `### 3.2B-3` section as the detailed working decision surface for this phase.

##### Suggestion
- yes
- keep this phase centered on geometry-driven source inference and highlight language
- keep the deeper source-type questions in the later dedicated decision block

#### [x] - `q2` Decide the first qualifying geometry-source set for the first honest cut.

##### Suggestion
- locked direction:
- keep origin planes available
- add planar-face picking as the first geometry-derived source path
- do not open first-pass source inference to:
  - arbitrary edges as standalone source owners
  - vertices / points
  - curved faces
  - free multi-reference inference

Reason:
- planar faces are the first geometry class that already carries a clear sketch-plane answer:
  - plane orientation
  - stable normal
  - obvious surface highlight language
- this keeps `3.2B-SketchPlane-3` as a real source/setup follow-on instead of a general geometry-picking research phase

#### [x] - `q3` Decide whether geometry-driven setup should create a second pick/session model.

##### Suggestion
- locked direction:
- no
- geometry-derived source picking should stay inside the current `sketchPlanePickSession`
- do not invent a second `facePickSession` or separate geometry-only sketch-plane mode

Reason:
- the repo already has the right broad seams for this work:
  - one canonical `sketchPlanePickSession`
  - shared `runSketchPlaneCommand(...)`
  - shared `returnActiveSketchSessionOneLevel()`
  - shared console feature-assist descriptors for sketch-plane prompt/choice state
- this phase should deepen the pick inputs and source metadata, not replace the session model

#### [x] - `q4` Decide the first honest highlight language for geometry-derived source pick.

##### Suggestion
- locked direction:
- use three visible source states:
  - `Hover Candidate`
  - `Draft Selected Source`
  - `Committed Source`
- first-pass viewport reads should be:
  - `Hover Candidate`
    - face tint plus edge outline
  - `Draft Selected Source`
    - stronger tint plus edge outline plus candidate sketch grid/plane read
  - `Committed Source`
    - normal authored sketch preview after the session ends

Important rule:
- edge highlighting belongs here primarily as feedback around a hovered or selected planar face
- do not treat "highlighted edge" as meaning that loose edge selection itself is already a supported authored source type

#### [x] - `q5` Decide what face selection should do to the current sketch-plane session.

##### Suggestion
- locked direction:
- clicking a qualifying planar face should:
  - update draft source metadata
  - derive a draft sketch plane from that face
  - transition the existing session into `adjust`
  - keep `Move`, `Rotate`, `Back`, `Done`, `Enter`, `X`, and `Esc` working through the same current sketch-plane session verbs
- authored sketch values should still commit only on confirm

Default derivation:
- use a stable face-derived plane frame
- use a stable face-space anchor for the initial draft origin
  - default: face center / centroid unless a stronger existing face-frame seam already exists in code
- let the user refine that result immediately with the current draft move/rotate controls

#### [x] - `q6` Decide how much source metadata this phase must preserve.

##### Suggestion
- locked direction:
- preserve enough geometry-source metadata that the sketch can honestly report where the draft plane came from
- but do not block the phase on full long-term associativity or face-topology persistence

First preserved metadata target:
- source kind:
  - `origin-plane`
  - `planar-face`
- owning object/reference identity when available
- stable face key when available
- sampled face-plane frame used to derive the draft plane

Important rule:
- if stable downstream face identity is not fully trustworthy yet, this phase may still ship with:
  - authored plane + transform as the canonical committed geometry truth
  - geometry-source metadata as advisory/source-trace data
- do not stall the UX phase waiting for the final long-term parametric reattachment model

#### [x] - `q7` Decide what console/support behavior must remain aligned during this phase.

##### Suggestion
- locked direction:
- keep using the same sketch-plane command/prompt seam
- geometry-derived picking should extend session trace/status reads, not create a second console language

First new trace/status events:
- `geometry hover`
- `geometry selected`
- `draft source updated`
- `draft plane derived from face`

### Implementation Spec

Purpose:
- turn the cleaned-up viewport-first origin-plane session into one broader source-pick session that can also consume qualifying model geometry honestly

Current code-to-target mapping:
- current canonical sketch-plane session seam:
  - `sketchPlanePickSession`
- current stable depth model already exists as:
  - `stage: 'pick'`
  - `stage: 'adjust'`
- current deeper adjust scopes already exist as:
  - `adjustScope: 'root'`
  - `adjustScope: 'move'`
  - `adjustScope: 'move-snap'`
  - `adjustScope: 'rotate'`
  - `adjustScope: 'rotate-snap'`
- current draft ownership already exists as:
  - `draftPlane`
  - `previewPlane`
  - `draftTransform`
- current command/routing seams already exist as:
  - `runSketchPlaneCommand(...)`
  - `returnActiveSketchSessionOneLevel()`
- current console assist seam already exists as:
  - feature-assist prompt descriptors in `ConsoleDock`
  - staged/feature shared prefill + choice cycling from `[4.1N]`

Phase boundary:
- `[3.2B-SketchPlane-3]` should extend the current sketch-plane source session so it can derive draft setup from planar geometry
- this phase should not redesign:
  - the sketch-plane session hierarchy
  - the sketch command routing model
  - the console assist model
  - the generic viewer transform-tool architecture
  - browser/expose ownership
- those are already handled elsewhere or belong to later phases

First supported source set:
- existing origin planes:
  - `XY`
  - `XZ`
  - `YZ`
- qualifying planar model faces

Not supported yet:
- curved faces
- loose edge-as-source authoring
- point/vertex source picking
- multi-reference plane solving
- final live-associative source reattachment rules

Locked user flow:
1. user enters `Pick In Viewport`
2. the same cleaned-up sketch-plane source session opens
3. user may still choose:
   - `XY`
   - `XZ`
   - `YZ`
4. user may instead hover a qualifying planar face in the main viewport
5. hovered face shows:
   - tinted face fill
   - highlighted boundary edges
6. clicking that face updates the active draft source to `planar-face`
7. the session derives a draft sketch plane from the selected face
8. the session transitions into the existing `adjust` depth
9. the user refines the result with the existing controls:
   - `Move`
   - `Rotate`
10. `Done` or `Enter` commits the authored sketch-plane values
11. `Back`, `X`, and `Esc` continue to use the same existing sketch-plane session return/exit behavior

Ownership rule:
- face hover and face selection are pick-stage inputs into the existing sketch-plane session
- `Move` and `Rotate` remain adjust-stage tools inside that same session
- do not split "geometry pick" and "plane adjust" into separate feature products

First data/model target:
- extend the temporary session state so it can remember:
  - draft source kind
  - draft source reference metadata
  - derived face-plane frame
- keep authored sketch truth compatible with the current committed feature fields:
  - plane
  - plane transform
- if source-reference metadata is available at commit time, preserve it as source-trace metadata
- if not, still allow commit of the derived plane/transform result

Highlight language:
- `Hover Candidate`
  - face tint plus edge outline
- `Draft Selected Source`
  - stronger tint
  - stronger edge outline
  - candidate sketch grid / plane preview
- `Committed Source`
  - normal authored sketch preview after session close

Console / prompt alignment:
- keep the existing sketch-plane feature-assist descriptor as the prompt owner
- do not invent a second feature-session prompt system for geometry pick
- extend console/session tracing so the debug read can report:
  - whether the active draft source is `origin-plane` or `planar-face`
  - the currently hovered candidate when useful
  - the currently selected draft source
- shared sketch commands remain:
  - `Back`
  - `Done`
  - `Enter`
  - `X`
  - `Move`
  - `Rotate`
- geometry hover itself remains viewport-driven, not a typed console action

Implementation seams:
- extend `sketchPlanePickSession` instead of replacing it
- add viewer hit-testing for qualifying planar faces during `SketchPlane > Plane Selection`
- derive one stable draft plane frame from the selected planar face
- transition into the existing adjust/root state after selection
- keep `runSketchPlaneCommand(...)` as the owner for post-selection sketch-plane actions
- keep `returnActiveSketchSessionOneLevel()` as the owner for one-level back behavior after geometry-derived selection
- publish readable command/session trace lines when geometry-derived source state changes

Acceptance checks:
- origin-plane picking still works through the same session after this phase lands
- hovering a qualifying planar face shows a clear candidate read in the main viewport
- clicking a qualifying planar face updates draft source state and opens the existing adjust depth instead of a second special-case mode
- `Move` and `Rotate` continue to operate on draft state only
- `Back` from adjust returns to pick/selection without committing authored values
- `X` and `Esc` still cancel through the existing sketch-plane cleanup path
- `Done` and `Enter` still commit through the existing confirm path
- the session can report whether the active source came from:
  - origin-plane
  - planar-face
- no second sketch-plane pick session or second console-prompt system is introduced

Out of scope for this phase:
- non-planar geometry inference
- standalone edge source authoring
- full constraint/inference solving between multiple references
- browser/expose work
- final source associativity/rebuild behavior across topology changes


