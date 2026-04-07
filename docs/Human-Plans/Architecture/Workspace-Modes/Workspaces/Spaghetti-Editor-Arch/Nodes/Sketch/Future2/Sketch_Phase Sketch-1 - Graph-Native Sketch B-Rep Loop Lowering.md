# `Sketch-1` - `Graph-Native Sketch B-Rep Loop Lowering`

## Doc Header

### Doc History
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
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - already publishes the shared sketch payload that the worker authoritative path consumes
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already indexes resolved sketch profiles
  - still succeeds only through the rectangle-only `getRectangleBounds(...)` shortcut
- current visible behavior proves the gap:
  - draft preview can show valid closed-profile extrudes
  - `Final` still reports unavailable for closed non-rectangular profiles because the authoritative path cannot yet lower real sketch B-rep geometry

Current internal status:
- `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
  - open
- `Phase 2 - Worker-Owned OC Edge And Wire Lowering`
  - open
- `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
  - open
- `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
  - open

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
  - still gates success on `getRectangleBounds(...)`
  - currently turns supported extrudes into `BRepPrimAPI_MakeBox` instead of consuming a real lowered sketch face
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
- open in this doc

2. `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering`
Reason:
- once the payload is locked, the worker needs one dedicated helper that can turn a resolved closed sketch profile into real OC edges and a closed OC wire
- this is the first kernel-lowering seam that should replace rectangle recognition as the sketch success gate
Current status:
- open in this doc

3. `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
Reason:
- once a closed OC wire exists, the worker can build the first planar face and let authoritative `Geometry/Extrude` consume that face instead of the current `BRepPrimAPI_MakeBox` rectangle shortcut
- this is the phase that should expand `Final` support to the first non-rectangular closed-profile extrudes
Current status:
- open in this doc

4. `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
Reason:
- once the first real sketch-to-face and face-to-extrude path exists, the worker needs one narrow pass that keeps invalid/open-profile failure, OC resource cleanup, and final-mode honesty trustworthy
Current status:
- open in this doc

## [ ] `Sketch - 1 Phase 1` - `Sketch Profile Payload Audit And Contract Lock`

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
- the current payload probably already contains most of what the worker needs
- the main risk is widening the contract blindly before proving where the real gap is

### Questions

#### [x] Question 1 - Should `Phase 1` widen the sketch payload immediately just because the current authoritative path is rectangle-only?

##### Locked answer
- no
- audit first
- widen only if the current `loop` plus existing profile metadata is not sufficient for deterministic worker lowering

##### Why
- the rectangle-only limit may be a worker-lowering gap rather than a payload gap
- premature schema growth would make later cleanup harder

#### [x] Question 2 - What counts as success for this first cut?

##### Locked answer
- one explicit answer about payload sufficiency
- if widening is needed, one minimal shared payload addition with validation and compile coverage
- no kernel-lowering code yet

##### Why
- this keeps the first phase reviewable
- it gives later OC phases a stable input contract

### Spec

Locked first-cut direction:
- inspect the current `ProfileLoop` shape carried through `profilesResolved.loop`
- confirm whether the worker can reconstruct ordered sketch segments from the existing payload alone
- if the answer is no, add only the smallest shared payload needed to preserve that truth
- keep the payload graph-native and serialization-friendly

Likely implementation seams:
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- any direct tests around shared payload validation and compiled sketch profile output

Suggested execution order:
1. Audit the exact shape of `ProfileLoop` as it survives compile.
2. Decide whether the current payload is already sufficient for ordered worker lowering.
3. If not sufficient, widen `GeometryRequestSketchProfile` minimally and update validators.
4. Add focused tests proving one non-rectangular closed profile keeps the required ordered data intact.

Definition of done:
- the worker authoritative path has one locked sketch-profile input contract suitable for later OC lowering
- shared payload growth, if any, is explicit and minimal
- later phases do not need to guess whether missing behavior is a contract problem or a lowering problem

## [ ] `Sketch - 1 Phase 2` - `Worker-Owned OC Edge And Wire Lowering`

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

### Questions

#### [x] Question 1 - Should this phase build wires inside `buildAuthoritativeGeometry.ts` inline?

##### Locked answer
- preferably no
- extract a worker-local helper so the OC lowering logic is testable and does not make the main builder unreadable

##### Why
- the rectangle-special-case code is already making the authoritative builder too specialized
- helper extraction will keep later face/body phases smaller

### Spec

Locked first-cut direction:
- consume the locked profile payload from `Phase 1`
- construct OC edges from the ordered sketch loop segments
- assemble those edges into one closed OC wire
- return an honest failure when the profile cannot be lowered into a valid closed wire

Likely implementation seams:
- one new worker-local sketch B-rep helper file
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused authoritative-lowering tests

Definition of done:
- one closed non-rectangular profile can lower into a worker-owned OC wire
- failure remains explicit for unsupported or invalid profiles
- rectangle detection is no longer the only sketch-success mechanism internally

## [ ] `Sketch - 1 Phase 3` - `Planar Face Construction And Authoritative Extrude Handoff`

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

### Spec

Locked first-cut direction:
- consume the closed wire from `Phase 2`
- construct one planar face
- reuse the current narrow extrude support rules where possible
- make authoritative extrude build from that face instead of rectangle bounds

Likely implementation seams:
- the worker-local sketch B-rep helper
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused authoritative extrude tests

Definition of done:
- the authoritative path can build one supported body extrude from a non-rectangular closed sketch face
- `Final` can render that supported shape where it currently shows unavailable

## [ ] `Sketch - 1 Phase 4` - `Failure Honesty, Resource Cleanup, And Focused Verification`

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

### Spec

Locked first-cut direction:
- preserve honest `null` authoritative fallback for invalid/open/non-lowerable profiles
- verify OC-owned resources are released on partial failure
- keep draft-versus-final behavior explicit after the broader support set lands

Likely implementation seams:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- the extracted worker-local helper
- focused worker and selector/viewer tests where needed

Definition of done:
- the new B-rep-capable sketch path fails honestly
- cleanup remains deterministic
- the widened `Final` support does not regress the phase-7 viewport honesty rules
