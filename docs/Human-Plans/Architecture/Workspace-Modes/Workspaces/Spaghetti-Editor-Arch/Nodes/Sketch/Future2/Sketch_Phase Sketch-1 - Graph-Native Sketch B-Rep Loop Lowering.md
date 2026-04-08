# `Sketch-1` - `Graph-Native Sketch B-Rep Loop Lowering`

## Doc Header

### Doc History
9. 2026-04-07 18:30: Marked `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` shipped after the worker hardened sketch-loop lowering to reject open or disconnected segment chains before OC construction, added focused cleanup coverage proving face-construction failure releases already-lowered wire resources, proved malformed supported-subset sketch payloads return honest authoritative `null` without minting shape-set handles, refreshed final-view selector coverage so a handle without renderable authoritative mesh still reports `Final Unavailable`, and completed the `Sketch - 1` ladder so the next family handoff is `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`
8. 2026-04-07 18:24: Tightened `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` into an implementation-ready next slice by grounding it in the shipped face-driven `buildAuthoritativeGeometry.ts` path, the extracted `ocSketchWire.ts` cleanup ownership seams, the current authoritative shape-set registration boundary, and the existing final-view selector contract that must stay honest when authoritative sketch lowering still returns `null`
7. 2026-04-07 18:10: Marked `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff` shipped after the authoritative worker stopped using the rectangle-only `getRectangleBounds(...) + BRepPrimAPI_MakeBox` shortcut for supported body extrudes, widened the shipped `ocSketchWire.ts` helper so it can build a planar face from the lowered wire in world space, rerouted the first authoritative `Sketch -> Extrude(Body)` path through wire-to-face plus prism-style extrusion while preserving the existing plane-frame and resolved-depth semantics, and advanced the ladder so `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` is now next
6. 2026-04-07 17:49: Tightened `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff` into an implementation-ready next slice by grounding it in the shipped `ocSketchWire.ts` helper, the remaining rectangle-only `getRectangleBounds(...) + BRepPrimAPI_MakeBox` path still inside `buildAuthoritativeGeometry.ts`, the existing sketch-plane frame plus resolved depth semantics already used by the current body builder, and the clear need to switch the first authoritative body cut from bounds-derived box creation to wire-to-face plus prism-style extrusion while keeping hardening deferred to `Phase 4`
5. 2026-04-07 17:46: Marked `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering` shipped after the worker gained an extracted `ocSketchWire.ts` helper for lowering validated `ProfileLoop.segments` into OC edges plus one closed wire, the authoritative builder began invoking that wire helper before the old rectangle-only body gate, and focused worker tests proved both typed segment support and the current honest `null` fallback for non-rectangular profiles pending `Phase 3`
4. 2026-04-07 17:39: Tightened `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering` into an implementation-ready next slice by grounding it in the live rectangle-special-case builder inside `buildAuthoritativeGeometry.ts`, the current worker-local OC constructor/method helper seams already in that file, the newly locked `ProfileLoop.segments` contract from `Phase 1`, and the absence of any extracted sketch-lowering helper under `src/worker/authoritative/`, while locking `Phase 2` to edge-and-wire construction only and keeping planar-face plus extrude rerouting deferred to `Phase 3`
3. 2026-04-07 17:36: Marked `Sketch - 1 Phase 1 - Sketch Profile Payload Audit And Contract Lock` shipped after the repo proved the existing `ProfileLoop.segments` contract already preserves typed ordered sketch-segment truth through derivation, compile, and shared payload validation, tightened the shared geometry-request loop validator to enforce real `line2 | bezier2 | arc3pt2` segment shapes, aligned compile-side loop acceptance to that same validator, and refreshed the handoff so `Phase 2 - Worker-Owned OC Edge And Wire Lowering` is now next
2. 2026-04-07 17:27: Tightened `Sketch - 1 Phase 1 - Sketch Profile Payload Audit And Contract Lock` into an implementation-ready next slice by grounding it in the live `ProfileLoop` shape, the deterministic segment expansion already performed in `profileDerivation.ts`, the unchanged compile forwarding in `compileFeatureStack.ts`, and the current shared validator seam in `geometryRequest.ts`, while locking the first recommendation to prove the existing `loop` payload is sufficient before widening schema
1. 2026-04-07 16:58: Created the dedicated child doc for `Sketch - 1`, split the work into `Phase 1` through `Phase 4`, and tightened the first implementation step around auditing and locking the minimal graph-native sketch payload needed for worker-owned OpenCascade edge/wire/face lowering

### Purpose

Use this doc as the dedicated planning and execution surface for the `Sketch - 1` ladder.

The goal here is:
- make `Geometry/Sketch` feed real authoritative B-rep-capable profile lowering
- keep raw OpenCascade object ownership in the worker authoritative path instead of the sketch node/editor layer
- replace the current rectangle-only authoritative sketch success path with general closed-profile lowering
- hand a real sketch-derived face downstream to authoritative `Geometry/Extrude`

### Scope

This phase family covers:
- deciding whether the current graph-native sketch payload is already sufficient for B-rep lowering
- any minimal shared sketch-payload widening needed to preserve ordered loop/segment truth
- worker-owned OC edge, wire, and planar-face lowering for one closed sketch profile
- the first authoritative extrude handoff from that lowered face
- focused hardening around invalid/open profiles, resource cleanup, and final-mode honesty

This phase family does not cover:
- moving OC object creation into the sketch node/editor surface
- broad sketch editor UX changes
- full multi-loop / holes support unless the current payload already makes a tiny extension trivial
- broad extrude feature growth beyond the first face-driven authoritative handoff
- export UI or export writer work

## Doc Body

### Summary

`Sketch - 1` should be the dedicated sketch-family ladder for the first real B-rep-capable authoritative lowering path.

Current baseline:
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - already emits graph-native `sketch` ops with `profilesResolved`
  - already preserves `loop` and `verticesProxy`
- `src/app/spaghetti/features/profileDerivation.ts`
  - already expands authored sketch components into deterministic ordered `Segment2[]`
  - already turns rectangles into four ordered line segments and circles into two ordered three-point arcs before compile
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - already publishes the shared sketch payload that the worker authoritative path consumes
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already indexes resolved sketch profiles
  - now lowers the first supported closed-profile `Body` extrudes through a sketch-wire-to-face plus prism-style authoritative path
- current visible behavior proves the gap:
  - draft preview can show valid closed-profile extrudes
  - `Final` can now show the first supported non-rectangular closed-profile `Body` extrudes, and malformed/open authoritative sketch payloads now fall back honestly without leaking the new OC path

Current internal status:
- `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
  - shipped
- `Phase 2 - Worker-Owned OC Edge And Wire Lowering`
  - shipped
- `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
  - shipped
- `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
  - shipped

Locked recommendation:
- do not treat `Sketch - 1` as one oversized implementation jump
- use `Phase 1` to lock the minimal graph-native payload and avoid premature schema widening
- use `Phase 2` to add one worker-local OC edge/wire lowering seam
- use `Phase 3` to add planar face construction and replace the rectangle-only authoritative extrude shortcut
- use `Phase 4` to harden invalid-profile behavior, cleanup, and final-mode honesty
- keep raw OC ownership downstream from authored sketch truth for the whole ladder

Why this order is healthier:
- it preserves graph-authored truth as the durable owner
- it keeps shared contract growth separate from kernel-lowering logic
- it lets Codex ship the risky OC work in smaller verified pieces
- it avoids mixing sketch payload changes, extrude rerouting, and hardening into one hard-to-review patch

Immediate handoff:
- `Sketch - 1` is complete in this doc
- next family handoff: `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/contracts/geometryRequest.ts`
  - owns the shared `GeometryRequestSketchProfile` payload
  - currently includes:
    - `profileId`
    - `profileIndex`
    - `area`
    - `loop`
    - `verticesProxy`
  - is the exact seam `Phase 1` must audit before adding any new B-rep-ready payload
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - is the graph-native authored sketch-to-runtime contract seam
  - already forwards `deriveProfilesWithDiagnostics(...)` output into `profilesResolved`
  - is the strongest proof that the current sketch path already preserves more than rectangle bounds
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already reads sketch profiles through `buildSketchProfileIndex(...)`
  - now consumes the shipped face-building seam and extrudes supported sketch faces through `BRepPrimAPI_MakePrism`
  - reuses the existing plane-frame plus resolved-depth semantics while no longer keeping rectangle recognition as the primary success gate
- `src/shared/sketchPlaneFrame.ts`
  - already resolves plane plus `planeTransform` into a world-space frame
  - is part of the existing truthful bridge between authored sketch placement and worker geometry lowering
- `src/worker/oc/ocInit.ts`
  - already provides the real worker-local OC boot seam
  - keeps OC dependency ownership out of app/editor layers
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - require preview meshes and clean export outputs to stay downstream from one explicit B-rep-capable geometry truth

### Phase Breakdown

1. `Sketch - 1 Phase 1 - Sketch Profile Payload Audit And Contract Lock`
Reason:
- before adding OC lowering code, the repo needs one honest answer about whether the existing sketch payload already preserves the ordered loop/segment truth the worker needs
- this is the phase that should either confirm the current payload is sufficient or make the smallest explicit shared-contract widening needed
Current status:
- shipped in this doc

2. `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering`
Reason:
- once the payload is locked, the worker needs one dedicated helper that can turn a resolved closed sketch profile into real OC edges and a closed OC wire
- this is the first kernel-lowering seam that should replace rectangle recognition as the sketch success gate
Current status:
- shipped in this doc

3. `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
Reason:
- once a closed OC wire exists, the worker can build the first planar face and let authoritative `Geometry/Extrude` consume that face instead of the current `BRepPrimAPI_MakeBox` rectangle shortcut
- this is the phase that should expand `Final` support to the first non-rectangular closed-profile extrudes
Current status:
- shipped in this doc

4. `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
Reason:
- once the first real sketch-to-face and face-to-extrude path exists, the worker needs one narrow pass that keeps invalid/open-profile failure, OC resource cleanup, and final-mode honesty trustworthy
Current status:
- shipped in this doc

## [x] `Sketch - 1 Phase 1` - `Sketch Profile Payload Audit And Contract Lock`

### Summary

#### Purpose:
- lock the smallest shared graph-native sketch payload that the worker authoritative path actually needs for B-rep lowering

#### Owns:
- auditing whether `loop` already preserves the needed ordered segment truth
- any minimal widening to `GeometryRequestSketchProfile`
- compile-path and validation updates required to make that payload explicit and stable
- focused tests that prove the worker will receive deterministic profile data

#### Does not own:
- OC object creation
- face or body construction
- rerouting authoritative extrude success yet

#### Current strongest read:
- the current payload probably already contains the ordered segment truth the worker needs
- `ProfileLoop.segments` is already a typed graph-native array of `line2 | bezier2 | arc3pt2`
- the main risk is widening the contract blindly before proving whether the real gap is actually only in worker-side OC lowering

#### Current code-backed read:
- `src/app/spaghetti/features/featureTypes.ts`
  - already defines `ProfileLoop` as:
    - `segments: Segment2[]`
    - `winding: 'CCW' | 'CW'`
  - already defines `Segment2` as the exact segment-family union the worker needs to inspect:
    - `line2`
    - `bezier2`
    - `arc3pt2`
- `src/app/spaghetti/features/profileDerivation.ts`
  - already canonicalizes authored sketch components into deterministic numeric segment payloads
  - already emits one ordered closed-loop segment chain into `ProfileOutput.loop`
  - already computes `verticesProxy` only as a preview/runtime proxy rather than the canonical loop truth
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - currently forwards `profile.loop` unchanged into `profilesResolved.loop`
  - is therefore not flattening sketch profiles down to rectangles or vertex-only data today
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - already validates and serializes `loop`
  - is the correct seam to touch only if the audit proves a real missing worker input

### Questions

#### [x] Question 1 - Should `Phase 1` widen the sketch payload immediately just because the current authoritative path is rectangle-only?

##### Locked answer
- no
- audit first
- widen only if the current `loop` plus existing profile metadata is not sufficient for deterministic worker lowering

##### Why
- the rectangle-only limit may be a worker-lowering gap rather than a payload gap
- premature schema growth would make later cleanup harder

#### [x] Question 2 - What is the strongest current recommendation after reading the live loop contract?

##### Locked answer
- assume the current `loop` payload is sufficient unless the implementation audit finds a specific missing datum
- treat `verticesProxy` as non-authoritative helper data, not the primary B-rep contract

##### Why
- the live code already preserves ordered typed sketch segments through derivation and compile
- the worker should lower from the richer loop contract instead of driving new schema from the weaker preview proxy

#### [x] Question 3 - What counts as success for this first cut?

##### Locked answer
- one explicit answer, backed by code and tests, that the current `loop` payload is sufficient or insufficient
- if widening is needed, one minimal shared payload addition with validation and compile coverage
- no kernel-lowering code yet

##### Why
- this keeps the first phase reviewable
- it gives later OC phases a stable input contract

### Spec

Locked first-cut direction:
- inspect the current `ProfileLoop` shape carried through `profilesResolved.loop`
- prove whether the worker can reconstruct ordered sketch segments from the existing payload alone
- prefer keeping `GeometryRequestSketchProfile` unchanged if `loop.segments` is already sufficient
- if the answer is no, add only the smallest shared payload needed to preserve the specific missing datum
- keep the payload graph-native and serialization-friendly
- explicitly keep `verticesProxy` in the helper/preview lane rather than promoting it to authoritative loop truth

Likely implementation seams:
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/profileDerivation.ts`
- direct tests around shared payload validation and compiled sketch profile output

Suggested execution order:
1. Audit the exact `ProfileLoop` / `Segment2` shape as it survives profile derivation and compile.
2. Lock one explicit answer about whether `loop.segments` already gives the worker enough typed ordered data for OC lowering.
3. If not sufficient, widen `GeometryRequestSketchProfile` minimally and update validators.
4. Add focused tests proving one non-rectangular closed profile keeps the required ordered loop data intact through compile and shared-contract validation.

Definition of done:
- the worker authoritative path has one locked sketch-profile input contract suitable for later OC lowering
- the phase explicitly answers whether the current `loop` payload was already sufficient
- shared payload growth, if any, is explicit and minimal
- later phases do not need to guess whether missing behavior is a contract problem or a lowering problem

## [x] `Sketch - 1 Phase 2` - `Worker-Owned OC Edge And Wire Lowering`

### Summary

#### Purpose:
- add the first worker-local OC helper that turns one resolved closed sketch profile into OC edges and one closed wire

#### Owns:
- the first OC edge-construction seam for graph-native sketch profiles
- one worker-local wire assembly helper
- replacing rectangle recognition as the first sketch success criterion inside the authoritative path

#### Does not own:
- face construction
- extrude rerouting
- broader editor or contract redesign

#### Current strongest read:
- `Phase 1` already proved the worker should lower from `profile.loop.segments`, not from `verticesProxy`
- `buildAuthoritativeGeometry.ts` already contains reusable OC constructor/method/resource helpers, but still mixes sketch recognition and body construction into one rectangle-specific path
- the healthiest next step is one extracted worker-local sketch-wire helper that can be tested in isolation before any face or extrude work lands

#### Current code-backed read:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already has worker-local OC utility seams:
    - `constructOcValue(...)`
    - `invokeOcMethod(...)`
    - `releaseOcResources(...)`
  - currently uses those helpers only for rectangle-special-cased `BRepPrimAPI_MakeBox` body construction
  - does not yet have any extracted sketch-profile-to-wire helper
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - now locks `ProfileLoop.segments` as a validated typed segment union:
    - `line2`
    - `bezier2`
    - `arc3pt2`
  - is now strong enough to serve as the sole sketch-wire input for this phase
- `src/worker/authoritative/`
  - currently contains only `buildAuthoritativeGeometry.ts` plus its tests
  - is the clearest proof that `Phase 2` should extract one new worker-local helper file rather than making the main builder larger

### Questions

#### [x] Question 1 - Should this phase build wires inside `buildAuthoritativeGeometry.ts` inline?

##### Locked answer
- preferably no
- extract a worker-local helper so the OC lowering logic is testable and does not make the main builder unreadable

##### Why
- the rectangle-special-case code is already making the authoritative builder too specialized
- helper extraction will keep later face/body phases smaller

#### [x] Question 2 - What should this phase use as its source of sketch truth?

##### Locked answer
- lower from `profile.loop.segments`
- do not use `verticesProxy` as the primary OC wire input

##### Why
- `Phase 1` already proved the loop contract preserves the richer typed ordered sketch-segment truth
- `verticesProxy` is still only helper geometry for preview/runtime approximation and rectangle recognition legacy paths

#### [x] Question 3 - What should count as success in this phase?

##### Locked answer
- one extracted worker-local helper can build OC edges and one closed OC wire for one supported closed sketch profile
- the helper returns honest failure for unsupported or invalid lowering cases
- no planar face or body construction lands yet

##### Why
- that keeps the first OC sketch lowering step small enough to verify cleanly
- it prevents `Phase 2` from silently absorbing `Phase 3`

### Spec

Locked first-cut direction:
- consume the locked profile payload from `Phase 1`
- construct OC edges from the ordered sketch loop segments
- assemble those edges into one closed OC wire
- return an honest failure when the profile cannot be lowered into a valid closed wire
- keep face construction and authoritative extrude rerouting out of scope for this pass

Likely implementation seams:
- one new worker-local sketch B-rep helper file under `src/worker/authoritative/`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused authoritative-lowering tests

Suggested execution order:
1. Extract one worker-local helper that accepts `GeometryRequestSketchProfile` plus the live OC helper utilities already present in `buildAuthoritativeGeometry.ts`.
2. Lower supported `line2`, `bezier2`, and `arc3pt2` loop segments into OC edges.
3. Assemble those edges into one closed wire and return it with owned-resource cleanup responsibility clearly defined.
4. Add focused tests that prove:
   - a non-rectangular closed profile can lower into a wire
   - malformed or unsupported lowering cases fail honestly
   - the main authoritative builder can call the helper without yet widening into face/body construction

Definition of done:
- one closed non-rectangular profile can lower into a worker-owned OC wire
- failure remains explicit for unsupported or invalid profiles
- rectangle detection is no longer the only sketch-success mechanism internally
- the phase leaves planar face construction and extrude rerouting clearly deferred to `Phase 3`

## [x] `Sketch - 1 Phase 3` - `Planar Face Construction And Authoritative Extrude Handoff`

### Summary

#### Purpose:
- build the first planar face from the lowered OC wire and reroute authoritative extrude through that face

#### Owns:
- planar face construction from one closed sketch-derived wire
- replacing the current `BRepPrimAPI_MakeBox` rectangle shortcut for the first supported authoritative extrude set
- the first expansion of `Final` support to general closed-profile `Body` extrudes

#### Does not own:
- broad extrude semantics growth
- boolean operations
- broad taper/offset support

#### Current strongest read:
- `Phase 3` has now landed the first real sketch-face authoritative handoff, so the remaining gap is no longer sketch recognition or the primary body-construction primitive
- the next honest work is the narrower `Phase 4` pass around invalid/open-profile failure, OC resource cleanup, and final-mode honesty verification
- the healthiest follow-on is to harden the new face-driven path before widening into broader extrude semantics

#### Current code-backed read:
- `src/worker/authoritative/ocSketchWire.ts`
  - now returns one worker-owned OC wire plus owned resources for one validated closed sketch profile
  - now also exposes the planar face-building seam that the authoritative body path consumes
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - still computes `startDepth` plus total `depth` through `resolveExtrusionDepths(...)`
  - still resolves authored plane placement through `resolveSketchPlaneFrame(...)`
  - now builds the first supported authoritative body shape through face-driven `BRepPrimAPI_MakePrism` extrusion instead of the old rectangle-only box shortcut
- current `Phase 3` tests now prove:
  - supported non-rectangular closed profiles mint non-null authoritative geometry
  - supported rectangular profiles still succeed through the same new face-driven path
  - unsupported extrude kinds such as current `Walls` still fail honestly

### Questions

#### [x] Question 1 - Should `Phase 3` keep rectangle bounds as the main body-construction path and only add face construction as a sidecar?

##### Locked answer
- no
- switch the first authoritative body path to wire-to-face plus prism-style extrusion for the supported sketch/extrude subset

##### Why
- leaving the rectangle box path as primary would keep the main geometry truth split across two body-building stories
- this phase should be the first real handoff from graph-native sketch profile to authoritative body construction

#### [x] Question 2 - What support set should this phase keep?

##### Locked answer
- keep the same narrow first authoritative body set where possible:
  - one closed profile
  - `extrudeType = Body`
  - positive depth under the current `OneSide / TwoSides / Symmetric` depth resolver
  - current `taperResolved = 0`
  - current `offsetResolved = 0`

##### Why
- the goal here is to replace the body-construction primitive, not to widen authored extrude semantics at the same time
- this keeps the first face-driven body cut reviewable and testable

#### [x] Question 3 - What should success look like for this phase?

##### Locked answer
- one non-rectangular closed-profile `Sketch -> Extrude(Body)` graph now produces a non-null authoritative result and can therefore appear in `Final`
- rectangle profiles continue to work through the same new face-driven path
- later failure/resource hardening stays deferred to `Phase 4`

##### Why
- this is the first user-visible payoff of the sketch B-rep ladder
- keeping hardening separate prevents this phase from silently absorbing cleanup and failure-matrix work too

### Spec

Locked first-cut direction:
- consume the closed wire from `Phase 2`
- construct one planar face from that wire
- extrude that face into a body through one OC prism-style path
- reuse the current narrow support rules and existing depth / plane-frame semantics where possible
- remove rectangle bounds as the primary success gate for supported authoritative body extrudes
- keep failure/resource hardening and broader extrude widening out of scope for this pass

Likely implementation seams:
- `src/worker/authoritative/ocSketchWire.ts`
  - likely widened slightly to expose the face-building helper or a composable wire result
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused tests in:
  - `src/worker/authoritative/ocSketchWire.test.ts`
  - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`

Suggested execution order:
1. Reuse the shipped wire helper instead of rebuilding segment lowering inside the main authoritative builder.
2. Add one worker-local OC face-construction seam from the closed wire.
3. Replace the current rectangle-only body builder with one face-driven extrusion path that still honors the existing plane frame and resolved depth semantics.
4. Add focused coverage proving:
   - a supported non-rectangular closed profile now yields a non-null authoritative result
   - the current supported rectangular case still succeeds through the new face-driven path
   - unsupported extrude kinds such as current `Walls` still fail honestly

Definition of done:
- the authoritative path can build one supported body extrude from a non-rectangular closed sketch face
- the old rectangle-only body shortcut is no longer the primary success path for supported authoritative body extrudes
- `Final` can render that supported shape where it currently shows unavailable
- resource/failure hardening still remains clearly deferred to `Phase 4`

## [x] `Sketch - 1 Phase 4` - `Failure Honesty, Resource Cleanup, And Focused Verification`

### Summary

#### Purpose:
- harden the new sketch-to-face-to-extrude path so failure and cleanup behavior stay honest

#### Owns:
- focused invalid/open-profile failure coverage
- OC resource cleanup on partial lowering failure
- final-mode honesty verification after the broader support expansion

#### Does not own:
- new feature growth
- editor-surface changes
- export writer work

#### Current strongest read:
- `Phase 4` has now proven the new face-driven path rejects malformed/open segment chains before OC construction instead of trusting every non-empty loop payload
- the worker cleanup seams now have focused regression coverage around post-wire face-construction failure and pre-registration authoritative fallback, so OC resources stay local until shape-set registration succeeds
- final-mode honesty still runs through the authoritative mesh-preview selector lane, and the shipped coverage now proves a bare authoritative handle without renderable mesh does not silently masquerade as `Final`

#### Current code-backed read:
- `src/worker/authoritative/ocSketchWire.ts`
  - now validates that `ProfileLoop.segments` form a contiguous closed chain before any OC edge/wire construction begins
  - already releases transient OC resources during edge, wire, and face construction
  - now has focused failure-path coverage for face-construction failure after a wire was created
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already returns `null` for unsupported extrude kinds, invalid depth semantics, OC boot failure, face-lowering failure, prism failure, and bundle-assembly failure
  - already owns pre-registration OC shape cleanup locally and only hands long-lived resources to `registerAuthoritativeShapeSet(...)` after successful construction
  - now proves malformed open/disconnected supported-subset sketch payloads stay honest and do not mint authoritative handles even when draft preview geometry still exists
- `src/worker/authoritativeGeometryStore.ts`
  - already disposes registered shape-set resources only after a handle is minted
  - is the boundary that makes it important for pre-registration worker failures to clean up everything locally before registration happens
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already renders `Final` only from authoritative `meshPreview`
  - already keeps artifact preview as a fallback path and reports final unavailability through the explicit selector/status lane
  - now has focused coverage proving that authoritative sketch lowering without renderable mesh still surfaces `Final Unavailable` honestly

### Questions

#### [x] Question 1 - Should `Phase 4` widen the supported sketch/extrude feature set while it hardens failure behavior?

##### Locked answer
- no
- keep the current supported subset fixed and spend this phase on failure honesty, cleanup, and verification only

##### Why
- support widening would make it harder to tell whether new regressions come from feature growth or from the hardening pass itself
- `Phase 3` already delivered the first real user-visible payoff, so the next healthiest move is to make that path trustworthy

#### [x] Question 2 - Where should OC cleanup ownership stay after the new face-driven handoff?

##### Locked answer
- keep helper-local cleanup inside `ocSketchWire.ts`
- keep pre-registration body-shape cleanup inside `buildAuthoritativeGeometry.ts`
- do not move cleanup responsibility into app/store/viewer layers

##### Why
- OC ownership still belongs in the worker authoritative path
- the authoritative shape-set store should only own resources after successful registration, not as a fallback cleanup bucket for builder failures

#### [x] Question 3 - What should success look like for this phase?

##### Locked answer
- invalid, open, or otherwise non-lowerable supported-subset sketch profiles return `null` authoritatively without leaking OC-owned resources or minting handles
- the current successful rectangular and non-rectangular supported body cases remain green
- final-mode selector/status behavior stays honest when authoritative sketch lowering is unavailable

##### Why
- this hardening pass is about trustworthiness, not new geometry breadth
- the worker and viewport need one explicit proof that `Final` only appears when authoritative geometry really exists

### Spec

Locked first-cut direction:
- preserve honest `null` authoritative fallback for invalid/open/non-lowerable profiles
- verify OC-owned resources are released on partial failure
- keep draft-versus-final behavior explicit after the broader support set lands

Likely implementation seams:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritative/ocSketchWire.ts`
- `src/worker/authoritativeGeometryStore.ts`
- focused worker and selector/status tests where needed:
  - `src/worker/authoritative/ocSketchWire.test.ts`
  - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

Suggested execution order:
1. Identify the narrow invalid/open/non-lowerable sketch cases that should still return `null` under the current supported subset.
2. Tighten helper or builder cleanup only where the current face-driven path still has an unproven partial-failure branch.
3. Add focused worker tests proving failed wire/face/prism construction releases owned OC resources and does not mint `shape_set` handles.
4. Add or refresh selector/status coverage proving final-mode UI stays honest when authoritative sketch lowering remains unavailable.

Definition of done:
- the new B-rep-capable sketch path fails honestly
- cleanup remains deterministic
- the widened `Final` support does not regress the phase-7 viewport honesty rules
