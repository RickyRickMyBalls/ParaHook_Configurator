# Extrude

## Doc Header

### Doc History
6. 2026-03-25: Aligned the extrude-family vision with the broader `EWR` node direction, locking the long-term model so `Sketch` exposes child `SketchProfile` rows under `SketchProfiles` while `Extrude` normalizes one or more selected/wired sketch profiles into a real plural input contract instead of pretending repeated single-profile links are the final shape
5. 2026-03-25: Expanded the extrude vision from single-profile consumption to multi-profile selection, locking the direction that one extrude node can collect and own multiple upstream sketch-profile references through either viewport picking or spaghetti wiring
4. 2026-03-25: Added the intended Fusion-style sketch-to-extrude workflow and explicit ownership split, locking the direction that `Sketch` owns plane/transform/entities/profiles while `Extrude` owns profile selection plus extrusion parameters and resolves profile references from any sketch during command-driven authoring
3. 2026-03-25: Locked `Extrude-1` question `q1` to carry `plane + planeTransform` through the extrude feature-stack/runtime contract, keeping sketch placement truth explicit instead of flattening it away upstream
2. 2026-03-25: Added the first explicit `Extrude` phase section at the bottom of this index, splitting the family into a real phase ladder and seeding `[Extrude-1]` as a transform-aware preview/runtime alignment phase with initial questions and decisions
1. 2026-03-25: Created the initial `Extrude` node-family scaffold with top-level index doc plus `Shipped/` and `Future/` folders, framing the current `Geometry/Extrude` path as an underdeveloped proof-of-concept seam that still needs real runtime, preview, and authored-behavior planning

### Purpose

This doc defines the architecture direction for the ParaHook `Extrude` family.

Use it to answer:
- what `Extrude` is supposed to own in ParaHook
- how `Geometry/Extrude` should relate to upstream sketch/profile truth
- how preview/runtime behavior should line up with authored sketch transforms
- what belongs to the early shipped seam versus later real extrude behavior
- how future extrude planning should be split into standalone shipped and future phase docs

### Why This Doc Exists

The current `Geometry/Extrude` path exists, but it is still closer to a proof of concept than a finished authored feature family.

Right now it can publish a first-pass body preview from a sketch profile, but the full product contract is still thin:
- profile ownership is narrow
- transform-aware runtime behavior is incomplete
- extent/boolean/body-management behavior is still missing
- browser and console behavior are not yet fully developed as an extrude family

This doc exists so future extrude work can land against one clear architecture/index surface instead of continuing as isolated fixes.

### Scope

This doc covers:
- the future role of `Extrude` as an authored modeling family
- the ownership boundary between sketch/profile truth and extrude-produced body truth
- the main runtime/preview seams that need to become transform-aware
- the status structure for later `Shipped/` and `Future/` extrude phase docs

This doc does not cover:
- detailed implementation for any one future extrude phase
- final UI styling
- full boolean kernel design
- non-extrude solid features like loft, revolve, or sweep

## Doc Body

### Short Version

ParaHook should treat `Extrude` as a real authored solid-feature family, not just as a temporary sketch-profile consumer.

The current `Geometry/Extrude` node is a useful first seam, but it is not yet a complete product surface.

The next real extrude work should center on:
- profile-to-body contract cleanup
- transform-aware preview/runtime alignment
- richer extent/body behavior
- cleaner browser/console ownership

### Core Naming Decisions

Use these terms:

- `Extrude`
  - the authored modeling feature family
- `Geometry/Extrude`
  - the current graph node that produces an extruded body from a selected profile
- `Profile`
  - a closed sketch region consumed by the extrude
- `Body`
  - the solid result produced by the extrude
- `Preview`
  - the visible viewer result of the current authored extrude
- `Runtime`
  - the worker/build path that produces the mesh/body artifact

Important rule:
- sketch owns profile authoring
- extrude owns body production from that profile
- preview and runtime should agree on the same placement/orientation contract
- long-term downstream profile consumption should align with the `EWR` direction rather than freezing the current first-pass singular port shape

### Current Reality

Right now the repo already has a meaningful first extrude seam:
- `Geometry/Extrude` exists as a node
- a sketch profile can drive a first-pass output preview
- the worker can emit a first mesh-backed extrude artifact
- the viewer can render that artifact

But the current system is still underdeveloped:
- it behaves like a proof-of-concept path
- transformed sketch placement is not yet carried cleanly through the full extrude runtime contract
- extent semantics are thin
- body-management semantics are thin
- the feature family does not yet have a mature architecture roadmap like `Sketch`

### Main Architecture Direction

#### 1. `Extrude` Should Become A Real Authored Solid Feature

`Extrude` should eventually read as a durable authored modeling operation with explicit ownership over:
- consumed profile references
- extent/depth behavior
- resulting body identity
- later boolean/body interaction rules

#### 2. Preview And Runtime Must Share One Placement Contract

The viewer preview should not use one coordinate story while the runtime mesh uses another.

The long-term rule should be:
- if a sketch/profile is transformed in authored space
- the extrude preview must emerge from that same transformed profile in world space
- the worker/runtime path and viewer path must consume the same resolved placement contract

#### 3. Extrude Should Stay Downstream From Sketch

`Extrude` should consume sketch/profile truth, not duplicate sketch ownership.

That means:
- sketch owns curves and closed profiles
- extrude references one or more resolved profiles
- extrude produces body truth from that profile

#### 3.1. Extrude Should Align With The `EWR` Profile Hierarchy

The long-term node-contract direction should match the broader `Nodes` / `EWR` vision:

- `Sketch` exposes:
  - one top-level `SketchProfiles` output
  - expandable child `SketchProfile` rows underneath it
- downstream geometry nodes consume those child `SketchProfile` rows
- `Extrude` should not depend forever on a fake singular-only profile model once multiple profile consumption is supported

Important rule:
- the source-side row shape can stay singular per child row:
  - one `SketchProfile` row = one profile object
- but the extrude-side authored input should become plural when the user adds more than one of them
- repeated profile additions should normalize into one honest plural extrude-input contract rather than acting like accidental repeated single-profile links

#### 4. Extrude Should Follow A Fusion-Style Sketch-To-Feature Flow

The intended user flow is:

- step 1:
  - the user sets up a sketch node
  - sketch owns:
    - sketch plane
    - transform
    - sketch draw
    - derived profiles
- step 2:
  - the user starts the extrude command from the console or from the extrude node surface in the spaghetti editor
  - the user can pick one or more profiles in the viewport from any sketch
  - the user commits those profile choices
  - the system should capture the correct profile wire/reference from the correct sketch for each picked profile and plug them into the active extrude node
- the user should also be able to author the same relationship directly in the graph by dragging a spaghetti line from a sketch output to the extrude input
  - in the longer-term `EWR` shape, that means dragging one or more child `SketchProfile` rows from under `SketchProfiles` into the extrude profile-input surface
- step 3:
  - the user edits the remaining extrude parameters
  - examples:
    - depth
    - flip
    - extrusion type
    - later paraslider/paraselect-driven controls

Important rule:
- `Sketch` owns sketch plane and transform truth
- `Extrude` does not become the owner of copied sketch placement data
- `Extrude` should store and consume one or more profile references to upstream sketch truth
- runtime/build can resolve each chosen profile plus the owning sketch frame when producing the body
- the viewport-pick path and the spaghetti-wire path should converge on the same underlying profile-reference contract instead of creating two different extrude-input models
- if the user adds multiple sketch profiles, the extrude-side input model should read as a real plural profile collection, not as a singular field with hidden repeated attachments

#### 5. Future Growth Should Be Split Into Clear Phases

Keep shipped and future extrude work as standalone docs in:
- `Shipped/`
- `Future/`

Recommended early future phase themes:
- transform-aware extrude preview/runtime alignment
- plural profile-input contract aligned with `EWR`
- richer extent modes
- body ownership and boolean behavior
- taper/offset/thickness follow-ons
- browser and console cleanup for authored extrudes

### Folder Structure

This folder should use:
- `extrude-index.md`
  - the family index / architecture surface
- `Shipped/`
  - standalone docs for landed extrude phases
- `Future/`
  - standalone docs for open extrude phases

### Current Status

Shipped phase docs:
- none yet

Future phase docs:
- none yet

### Suggested Starting Backlog

The highest-value next extrude planning cuts are probably:
- transform-aware sketch/profile consumption so extrude preview actually emerges from the authored sketch plane
- viewport profile-pick authoring so an extrude command can select one or more profiles from any sketch and commit the right profile references
- graph-wire profile authoring so dragging spaghetti lines from sketch outputs to extrude input lands on that same profile-reference model
- EWR-aligned plural extrude input so multiple selected/wired `SketchProfile` rows become one honest plural contract on the extrude side
- one honest runtime contract for plane plus transform instead of plane-only fallback behavior
- a clearer authored model for body identity, result ownership, and later boolean operations

## Extrude Phase Ladder

### Why This Needs A Real First Phase

The current extrude path already exists in code, but it still behaves like a proof-of-concept seam.

The first real extrude phase should not try to solve every later feature concern at once.

The safest first focus is:
- make preview/runtime placement honest
- make sketch-to-extrude contract honest
- keep richer feature growth for later phases

### [ ] Extrude-1 - Transform-Aware Preview And Runtime Alignment
#### header
##### Purpose

Make `Geometry/Extrude` emerge from the authored sketch/profile location and orientation instead of behaving like a plane-only fallback build.

##### Owns

- the first canonical extrude placement contract between sketch and extrude
- carrying enough sketch-plane transform truth into the extrude build/runtime path
- aligning viewer preview and worker/runtime output so they describe the same body placement
- proving the first transform-aware path still behaves correctly when one extrude consumes multiple upstream profiles
- first regression coverage for translated and rotated sketch-driven extrudes

##### Does Not Own

- final boolean behavior
- advanced extent modes
- taper growth beyond the current placeholder seam
- body combine/cut/intersect feature semantics
- broader browser or console redesign for extrude

##### Locked Direction

The first real `Extrude` fix should treat the current mismatch as a contract problem, not as a viewer-only visual patch.

Hard rules:
- the viewer preview must not invent a different body placement story than the runtime mesh
- extrude should consume upstream sketch/profile placement truth rather than ignoring it
- the first fix should preserve the current sketch-owns-profile and extrude-owns-body split
- one extrude node must be allowed to consume multiple profile references
- multi-profile consumption should be modeled honestly as a plural contract, not as a permanent singular-port workaround
- do not duplicate sketch transform logic in multiple drifting formats if one shared contract can be used

Recommended first outcome:
- translated sketch on `XY` extrudes from the translated profile
- rotated or in-plane-rotated sketch extrudes from the rotated profile
- `XZ` and `YZ` extrudes still work after the transform-aware contract lands

#### Questions / Decisions

##### [x] q1 - Where should the canonical sketch placement contract live for the first real extrude fix?

Question:
- should the first fix carry `plane + planeTransform` through the feature-stack/runtime IR directly, or should the system resolve fully world-space profile/body geometry earlier and keep the worker extrude seam mostly geometry-only?

Suggestion:
- carry `plane + planeTransform` through the IR first
- keep the contract explicit instead of hiding transform resolution in a viewer-only or compile-only side path
- this is the safer first step because it keeps the authored sketch truth readable while avoiding an immediate larger world-geometry refactor

Decision:
- lock the first real extrude fix to carry `plane + planeTransform` through the feature-stack/runtime IR
- keep sketch placement truth explicit
- do not flatten sketch placement away into an earlier hidden world-geometry conversion as the primary first fix

##### [ ] q2 - Should the first implementation transform the input profile before extrusion or extrude in local plane space and transform the produced mesh afterward?

Question:
- for the first real fix, is it cleaner to move profile vertices into resolved world placement before building the mesh, or to keep the current local-plane extrusion and apply one resulting transform to mesh vertices after the fact?

Suggestion:
- prefer one explicit post-extrude mesh transform if it can cleanly reuse the existing sketch-plane basis math
- this keeps the current local profile derivation and local plane extrusion logic more intact for the first cut
- if the mesh-transform path becomes messy around normals/winding or later boolean needs, switch to resolved-world profile generation instead

##### [ ] q3 - What exact regression matrix should gate the first shipped extrude alignment phase?

Question:
- what is the minimum test set that proves the first real extrude alignment fix is honest without pulling later boolean/extent behavior into scope?

Suggestion:
- require at least:
- translated `XY` sketch -> extrude stays attached
- rotated `XY` sketch -> extrude matches sketch orientation
- in-plane-rotated sketch -> extrude matches local profile rotation
- `XZ` translated sketch -> extrude stays attached
- `YZ` translated sketch -> extrude stays attached
- keep this first matrix focused on placement/orientation truth only
