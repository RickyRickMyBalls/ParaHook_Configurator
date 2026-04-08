# Sketch 2

## Doc Header

### Doc History
10. 2026-04-07 18:30: Marked `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` shipped after the worker hardened the new face-driven authoritative path around open/disconnected loop rejection, cleanup coverage, and final-view honesty, and completed the `Sketch - 1` ladder so the next family handoff is now `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`
9. 2026-04-07 18:24: Tightened `Sketch - 1 Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` inside `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md` into an implementation-ready next slice by grounding it in the shipped face-driven authoritative builder, extracted OC helper cleanup seams, authoritative shape-set registration boundary, and the existing final-view selector path that must stay honest when authoritative sketch lowering still returns `null`
8. 2026-04-07 18:10: Marked `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff` shipped after the authoritative worker switched the first supported `Sketch -> Extrude(Body)` path from the old rectangle-only box shortcut to wire-to-face plus prism-style extrusion, and advanced the family handoff so `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification` is now next
7. 2026-04-07 17:49: Tightened `Sketch - 1 Phase 3 - Planar Face Construction And Authoritative Extrude Handoff` inside `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md` into an implementation-ready next slice by locking it to consuming the shipped OC wire helper, replacing the remaining rectangle-only `getRectangleBounds(...) + BRepPrimAPI_MakeBox` body path with wire-to-face plus prism-style extrusion for the same narrow supported body set, and keeping cleanup/hardening deferred to `Phase 4`
6. 2026-04-07 17:46: Marked `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering` shipped after the worker authoritative path gained an extracted `ocSketchWire.ts` helper, started lowering validated sketch loops into OC edges and one closed wire before the old rectangle-only body gate, and advanced the `Sketch - 1` ladder so `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff` is now next
5. 2026-04-07 17:39: Tightened `Sketch - 1 Phase 2 - Worker-Owned OC Edge And Wire Lowering` inside `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md` into an implementation-ready next slice by locking it to worker-local sketch-wire extraction from `ProfileLoop.segments`, the existing OC helper seams inside `buildAuthoritativeGeometry.ts`, and focused wire-only verification before planar-face or authoritative-extrude work lands in `Phase 3`
4. 2026-04-07 17:36: Marked `Sketch - 1 Phase 1 - Sketch Profile Payload Audit And Contract Lock` shipped after the repo proved the existing graph-native `ProfileLoop.segments` contract is already sufficient for typed ordered sketch-segment handoff, hardened the shared loop validator around real segment shapes, aligned compile-side loop acceptance to that same validator, and advanced the `Sketch - 1` ladder so `Phase 2 - Worker-Owned OC Edge And Wire Lowering` is now next
3. 2026-04-07 17:27: Added `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface` as the separate post-`Sketch - 1` node-cleanup lane, locking that the sketch node should expose `SketchProfiles` as the parent array output for all closed profiles, reveal one child row per sketch profile when expanded, and keep the all-profiles-versus-single-profile wiring semantics out of the current B-rep lowering ladder
2. 2026-04-07 16:58: Added the dedicated child planning doc `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`, re-split `Sketch - 1` into four smaller subphases for payload lock, worker OC wire lowering, face-plus-extrude handoff, and final hardening, and tightened the family handoff so the next honest implementation step is now `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
1. 2026-04-07 16:50: Added `Sketch - 1` as the new implementation-ready phase for the B-rep-capable sketch lowering gap, grounding the next sketch work in the live graph-native profile contract, the current rectangle-only authoritative builder shortcut, and the need for worker-owned OpenCascade wire/face construction downstream from authored sketch truth

### Purpose

Use this file as the next sketch-family planning surface for the B-rep-capable sketch follow-on.

The goal here is:
- make `Geometry/Sketch` feed real authoritative curve/loop lowering
- let downstream `Geometry/Extrude` consume general sketch-derived B-rep-ready profiles instead of the current rectangle-only shortcut
- keep authored sketch/node truth separate from worker-owned OpenCascade object construction
- give the sketch node a cleaner output surface after the B-rep groundwork is split away

## Doc Body

### Short Version

The next honest sketch phase should not make the UI node instantiate OpenCascade objects directly.

Instead, `Sketch - 1` should make the sketch node family publish the full B-rep-ready loop/curve information the authoritative worker path actually needs, then add the worker-side lowering seam that turns those authored sketch profiles into real OC edges, wires, and faces.

The dedicated child planning doc now lives at:
- `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`

The next separate node-cleanup lane after that groundwork is:
- `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`

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
  - now lowers the first supported closed-profile `Body` extrudes through worker-owned OC wire-to-face plus prism-style construction
  - no longer depends on rectangle recognition as the only authoritative sketch success path for that supported subset
- `src/worker/cad/cadKernelAdapter.ts`
  - already shows the repo has a geometry concept for `wire` and `face`
  - is a useful hint for the kind of worker-owned lowering seam the authoritative OC path now needs
- current user-visible behavior proves the gap:
  - draft preview can show a valid closed sketch extrude
  - `Final` can now show the first supported non-rectangular closed-profile `Body` extrudes, and the shipped hardening pass now keeps malformed authoritative sketch payloads from silently faking final success

### Main Direction

`Sketch - 1` should be the first phase that makes sketch output truly B-rep-capable for the authoritative path.

The recommendation is:
- do not make the `Geometry/Sketch` UI/editor surface own raw OpenCascade objects
- do make the authored sketch/runtime contract explicit enough that the worker can build real OC edges, wires, and faces from sketch-authored loops
- treat the worker authoritative layer as the only place where B-rep objects are constructed
- keep preview meshes downstream from that same geometry truth once the authoritative path succeeds
- break the work into smaller subphases so contract growth, OC lowering, extrude handoff, and hardening do not land as one oversized Codex slice
- keep later sketch-node output cleanup and `SketchProfiles` array behavior in a separate follow-on instead of widening the B-rep ladder
- keep the next immediate implementation pass on hardening the shipped face-driven path instead of widening support again before failure honesty and cleanup are explicitly proven

## [x] - `Sketch - 1` - `Graph-Native Sketch B-Rep Loop Lowering`

### Header

- Status: shipped foundation phase
- Goal: make authored `Geometry/Sketch` profiles lower into real worker-owned B-rep sketch geometry instead of only supporting the current rectangle-only shortcut
- Dedicated child doc:
  - `Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`
- Current subphase status:
  - `Phase 1 - Sketch Profile Payload Audit And Contract Lock`
    - shipped
  - `Phase 2 - Worker-Owned OC Edge And Wire Lowering`
    - shipped
  - `Phase 3 - Planar Face Construction And Authoritative Extrude Handoff`
    - shipped
  - `Phase 4 - Failure Honesty, Resource Cleanup, And Focused Verification`
    - shipped

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

#### Immediate handoff

- `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`

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
- invalid/open authoritative sketch payloads now fail honestly without leaking the worker-owned OC path
- the sketch node/editor still does not become the owner of raw OC objects

## [ ] - `Sketch - 2` - `Sketch Node Output Cleanup And Profile Array Surface`

### Header

- Status: proposed follow-on phase
- Goal: clean up the sketch node output surface so `SketchProfiles` behaves as the parent array output for all closed profiles while still allowing one child profile to be wired explicitly

### Questions / Decisions

#### [x] - `q1` Should the all-profiles output behavior be folded into `Sketch - 1`?

##### Suggestion

- no
- keep `Sketch - 1` focused on authoritative B-rep lowering
- use `Sketch - 2` for node-surface and graph-wiring cleanup

##### Why

- this is mainly a node/output contract and UX question, not kernel-lowering work
- mixing array-output semantics into the B-rep ladder would make the implementation and verification surface much broader

#### [x] - `q2` What should the parent `SketchProfiles` row mean?

##### Suggestion

- treat `SketchProfiles` as the parent array output for every closed profile resolved from the sketch
- wiring that dark-green parent row into `Geometry/Extrude` should mean:
  - consume all closed profiles

##### Why

- this matches the user-facing expectation that the parent row represents the whole resolved sketch-profile collection
- it gives the graph one clean aggregate output instead of pretending only one profile exists

#### [x] - `q3` What should happen when the row is expanded?

##### Suggestion

- expanding `SketchProfiles` should reveal one child row per resolved sketch profile
- wiring one child row into `Geometry/Extrude` should mean:
  - consume only that selected profile

##### Why

- this gives the user both aggregate and per-profile control without inventing a second hidden profile-selection system
- it aligns better with the longer-term plural profile direction already noted elsewhere in sketch/extrude planning

### Implementation Spec

#### Suggested phase title

- `Sketch - 2 - Sketch Node Output Cleanup And Profile Array Surface`

#### Suggested scope

1. Clean up the sketch node output contract.
   - lock `SketchProfiles` as the parent array output for all closed profiles
   - stop treating the current singular `SketchProfile` row as the only durable output story
2. Add expandable child profile rows.
   - when the user expands `SketchProfiles`, show one row per resolved profile
   - keep row identity stable enough for wiring and selection
3. Define graph wiring meaning.
   - parent row wired to `Extrude` means all profiles
   - one child row wired to `Extrude` means one specific profile
4. Clean up visible node wording and output presentation.
   - make output counts and row labels match the actual resolved profile set
   - keep empty-state wording honest when no closed profiles exist

#### Likely files

- sketch node selector / VM seams
- sketch node `NodeView` output-row rendering seams
- shared wire/output-row identity helpers if the current row model is too singular
- `Geometry/Extrude` input interpretation seams for aggregate-versus-single-profile consumption

#### Definition of done

- the sketch node has one clean parent `SketchProfiles` output for all closed profiles
- expanding that row reveals one child row per resolved profile
- the user can wire either the whole profile array or one specific child profile intentionally
- this behavior stays clearly separate from the worker-owned B-rep lowering path in `Sketch - 1`
