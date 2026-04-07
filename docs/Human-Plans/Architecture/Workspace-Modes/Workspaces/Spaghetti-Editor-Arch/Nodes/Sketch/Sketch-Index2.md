# Sketch 2

## Doc Header

### Doc History
2. 2026-04-07 16:58: Added the dedicated child planning doc `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`, re-split `Sketch - 1` into four smaller subphases for payload lock, worker OC wire lowering, face-plus-extrude handoff, and final hardening, and tightened the family handoff so the next honest implementation step is now `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
1. 2026-04-07 16:50: Added `Sketch - 1` as the new implementation-ready phase for the B-rep-capable sketch lowering gap, grounding the next sketch work in the live graph-native profile contract, the current rectangle-only authoritative builder shortcut, and the need for worker-owned OpenCascade wire/face construction downstream from authored sketch truth

### Purpose

Use this file as the next sketch-family planning surface for the B-rep-capable sketch follow-on.

The goal here is:
- make `Geometry/Sketch` feed real authoritative curve/loop lowering
- let downstream `Geometry/Extrude` consume general sketch-derived B-rep-ready profiles instead of the current rectangle-only shortcut
- keep authored sketch/node truth separate from worker-owned OpenCascade object construction

## Doc Body

### Short Version

The next honest sketch phase should not make the UI node instantiate OpenCascade objects directly.

Instead, `Sketch - 1` should make the sketch node family publish the full B-rep-ready loop/curve information the authoritative worker path actually needs, then add the worker-side lowering seam that turns those authored sketch profiles into real OC edges, wires, and faces.

The dedicated child planning doc now lives at:
- `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`

### Current Code-Backed Read

- `src/app/spaghetti/features/compileFeatureStack.ts`
  - already emits graph-native `sketch` ops with `profilesResolved`
  - already preserves `loop` plus `verticesProxy`
  - is the current authored sketch-to-runtime contract seam
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - already gives `Geometry/Sketch` and `Geometry/Extrude` a shared request payload
  - is the correct place to grow a more explicit B-rep-ready sketch payload if the current profile shape is not yet sufficient
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already reads sketch profiles through `buildSketchProfileIndex(...)`
  - currently only succeeds when `getRectangleBounds(...)` can recognize a rectangle from `verticesProxy`
  - is therefore still using a rectangle-special-case shortcut instead of a real sketch-to-B-rep lowering path
- `src/worker/cad/cadKernelAdapter.ts`
  - already shows the repo has a geometry concept for `wire` and `face`
  - is a useful hint for the kind of worker-owned lowering seam the authoritative OC path now needs
- current user-visible behavior proves the gap:
  - draft preview can show a valid closed sketch extrude
  - `Final` still reports unavailable for general closed profiles that do not match the rectangle-only authoritative shortcut

### Main Direction

`Sketch - 1` should be the first phase that makes sketch output truly B-rep-capable for the authoritative path.

The recommendation is:
- do not make the `Geometry/Sketch` UI/editor surface own raw OpenCascade objects
- do make the authored sketch/runtime contract explicit enough that the worker can build real OC edges, wires, and faces from sketch-authored loops
- treat the worker authoritative layer as the only place where B-rep objects are constructed
- keep preview meshes downstream from that same geometry truth once the authoritative path succeeds
- break the work into smaller subphases so contract growth, OC lowering, extrude handoff, and hardening do not land as one oversized Codex slice

## [ ] - `Sketch - 1` - `Graph-Native Sketch B-Rep Loop Lowering`

### Header

- Status: proposed next phase
- Goal: make authored `Geometry/Sketch` profiles lower into real worker-owned B-rep sketch geometry instead of only supporting the current rectangle-only shortcut
- Dedicated child doc:
  - `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`
- Current subphase status:
  - `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
    - open
  - `Phase 2 - Worker-Owned OC Edge And Wire Lowering`
    - open
  - `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
    - open
  - `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
    - open

### Questions / Decisions

#### [x] - `q1` Should this phase put OpenCascade object creation directly inside the sketch node/editor layer?

##### Suggestion

- no
- keep the sketch node responsible for authored curve/loop truth only
- put actual OC edge/wire/face construction in the worker authoritative path

##### Why

- this preserves graph-authored truth as the source of ownership
- it avoids coupling editor/runtime state to worker-owned kernel objects
- it matches the repo direction that preview and export should derive downstream from one geometry execution truth

#### [x] - `q2` What should `Sketch - 1` actually ship first?

##### Suggestion

- ship the first general sketch-profile lowering seam, not every downstream body feature
- split the work into smaller slices:
  - first lock whether the current graph-native sketch payload is already sufficient
  - then add OC edge/wire lowering
  - then add planar face plus authoritative extrude handoff
  - then harden failure behavior and verification

##### Why

- this is the real missing foundation behind the current `Final Unavailable` gap for non-rectangular closed profiles
- it keeps each implementation pass small enough to ship and verify honestly
- it lets later extrude/body work build on one honest sketch B-rep seam without mixing every risk together

### Implementation Spec

#### Suggested phase title

- `Sketch - 1 - Graph-Native Sketch B-Rep Loop Lowering`

#### Suggested scope

1. `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
   - verify whether `profilesResolved.loop` already carries enough ordered segment data for B-rep lowering
   - if not, widen the shared sketch profile contract in `src/app/spaghetti/contracts/geometryRequest.ts` and `src/app/spaghetti/features/compileFeatureStack.ts`
2. `Phase 2 - Worker-Owned OC Edge And Wire Lowering`
   - add one worker helper that turns a resolved sketch profile into OC edges and one closed wire
3. `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
   - add planar face construction and let the authoritative extrude path consume that face instead of rectangle recognition
4. `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
   - prove invalid/open profiles still fail honestly
   - prove resource cleanup and draft-versus-final honesty still hold

#### Likely files

- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- one new worker-local sketch B-rep helper file if the lowering logic needs extraction
- focused tests in:
  - `src/app/spaghetti/features/compileFeatureStack.test.ts`
  - `src/app/spaghetti/compiler/compileGraph.test.ts`
  - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`

#### Definition of done

- the sketch/runtime contract can drive real worker-owned B-rep sketch lowering for one closed profile
- the authoritative worker path no longer depends on rectangle recognition as the only sketch success path
- a valid closed non-rectangular `Sketch -> Extrude(Body)` graph can advance farther through `Final` than it can today
- the sketch node/editor still does not become the owner of raw OC objects
