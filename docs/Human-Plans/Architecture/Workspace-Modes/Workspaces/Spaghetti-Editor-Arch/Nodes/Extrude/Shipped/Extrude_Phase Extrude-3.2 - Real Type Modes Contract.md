# `Extrude-3.2` - `Real Type Modes Contract`

## Doc Header

### Doc History
1. 2026-04-05 12:02: Marked `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup` shipped after the remaining visible authored-surface wording was aligned to the real `Body / Walls` geometry story in both the live node summary and the feature-style extrude surface, while keeping later `Direction`, `Wall Thickness`, `Taper Angle`, and `Operation` work explicitly deferred
1. 2026-04-05 11:58: Tightened `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup` into an implementation-ready cleanup slice by grounding it in the now-shipped `Body / Walls` runtime split, locking the remaining work to visible authored-surface wording and row-truth cleanup only, and explicitly keeping `Direction`, `Wall Thickness`, `Taper Angle`, and `Operation` out of scope
1. 2026-04-05 11:55: Marked `Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning` shipped after the compiler and worker runtime began carrying the authored `Body / Walls` split into real capped-versus-uncapped extrude geometry while keeping the current single `SolidBody` output lane, and recorded that the next follow-on is now `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup`
1. 2026-04-05 11:45: Tightened `Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning` into an implementation-ready slice by grounding it in the current `Geometry/Extrude -> SolidBody` graph contract, the graph compiler's single extrude IR path, the worker runtime's always-capped body emission, and the open question of how `Walls` should ride that same first artifact lane without forcing a whole new graph type family yet
1. 2026-04-05 11:41: Marked `Extrude 3.2 Phase 1 - Type Names And Authored State Contract` shipped after the live `Extrude Type` row, selector state, and selector VM all stopped using the placeholder `Basic / Twist` story and now normalize onto the real authored `Body / Walls` contract while keeping the deeper geometry split explicitly deferred to `Phase 2`
2. 2026-04-05 11:34: Split `Extrude-3.2` into smaller execution-sized subphases so the type-semantics work no longer tries to rename the selector, lock the authored state contract, land real `Body` versus `Walls` geometry meaning, and clean up the visible row surface all in one pass, while tightening `Extrude 3.2 Phase 1` into an implementation-ready first slice
3. 2026-04-05 11:31: Reworked this doc from a single broad type-semantics note into a real `Extrude 3.2` through `Extrude 3.5` ladder grounded in the locked `Body` versus `Walls` direction, the Fusion-style `Profiles` plus `Direction` row stack, the later `Depth` / `Start Depth` / `End Depth` split, `Taper Angle`, `Wall Thickness`, and the explicitly deferred `Operation` question
4. 2026-04-05 11:19: Carved the broader `Extrude 3.2 - Real Type Modes Contract` slice out of the umbrella `Extrude-3` ladder so the next authored-semantics work now has its own dedicated future planning home instead of living only as one section inside the larger functional-completion phase stack

### Purpose

Use this doc as the dedicated planning and execution surface for the first real authored-semantics phase after the finished `Extrude-3.1` enum-row groundwork.

The goal here is:
- lock the real authored `Type` choices
- define what each type actually means
- decide what each type produces and which later controls are valid
- stop `Extrude Type` from staying a selector whose downstream meaning is still implied
- stage the later `Direction`, depth-split, taper, wall-thickness, and operation follow-ons behind one explicit authored contract

### Scope

This phase covers:
- the real authored type choices for `Geometry/Extrude`
- what each type means in node state, feature state, preview, and output intent
- the intended authored row stack after `Profiles`
- which later controls should appear, disappear, or change meaning by type

This phase does not cover:
- the reusable enum-row template itself
- the full implementation of direction-specific rows
- `Start Depth` / `End Depth` behavior implementation
- `Taper Angle` implementation
- `Wall Thickness` implementation
- `Operation` implementation
- compile/runtime convergence for those later controls

## Doc Body

### Summary

`Extrude-3.2` is now the first authored-semantics phase in a longer `Extrude 3.2` through `Extrude 3.5` ladder after the completed `Extrude-3.1` enum-row groundwork.

Current read:
- `Extrude Type` now exists as a real input row under `Inputs`
- the selector row, driven numeric contract, fill, and endcaps are now stable enough to reuse
- but the actual authored meaning of the type choices is still thin
- the repo still needs one honest contract for:
  - what the type options are called
  - what each one produces
  - what each one makes valid or invalid in the authored surface
  - how the later authored row stack should branch behind that choice

Locked recommendation:
- lock `Type` first as:
  - `Body`
  - `Walls`
- treat `Type` as result geometry meaning, not boolean/operation meaning
- stage the later authored stack as:
  - `Profiles`
  - `Direction`
  - `Depth`
  - `Start Depth`
  - `End Depth`
  - `Taper Angle`
  - `Wall Thickness`
  - later `Operation`
- keep boolean/result-ownership style `Operation` work explicitly deferred until after the type, direction, and wall contract are honest

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the live `SketchProfile -> Type -> Depth` authored row surface
  - is where later type-aware control visibility has to become honest
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries local and effective type state
  - is the main seam for type-aware node truth
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already owns the current extrude param and input contract
  - is the narrowest place to evolve the authored type contract
- `src/app/spaghetti/features/featureTypes.ts`
  - is where the later authored type meaning should become explicit in the feature contract
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - is the likely follow-on authored surface that must stop drifting from the node meaning

### Phase Breakdown

1. `Extrude 3.2 Phase 1 - Type Names And Authored State Contract`
Reason:
- the first safe implementation cut is to replace the placeholder live `Basic` / `Twist` story with the intended real authored names and state contract before runtime geometry meaning changes

2. `Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning`
Reason:
- once the authored names and state contract are live, the next missing truth is making preview/runtime/output meaning differ honestly between capped `Body` and uncapped `Walls`

3. `Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup`
Reason:
- after the names and geometry meaning are real, the node and feature surfaces need a short cleanup pass so labels, empty states, and row copy stop sounding like the old placeholder type story

4. `Extrude 3.3 Phase 1 - Direction Modes And Depth Row Contract`
Reason:
- once `Type` is locked, the next missing authored truth is how `One Side`, `Two Sides`, and `Symmetric` change the visible depth-row stack

5. `Extrude 3.4 Phase 1 - Taper Angle And Wall Thickness Contract`
Reason:
- once `Type` and `Direction` are explicit, the repo can honestly decide when `Taper Angle` exists for all extrudes and when `Wall Thickness` should appear only for `Walls`

6. `Extrude 3.5 Phase 1 - Operation Contract`
Reason:
- result ownership and boolean-style operation meaning should stay separate from the earlier geometry-shape contract and only land after `Type`, `Direction`, and wall behavior are stable

## [x] Extrude 3.2 Phase 1 - Type Names And Authored State Contract

### Summary

#### Purpose:
- replace the placeholder live type names
- lock the authored type options in node state and selector state
- define the first honest meaning of those types at the state-contract layer
- prepare later geometry/runtime and surface-honesty work without doing everything at once

#### Current read:
- the live selector now uses:
  - `Body`
  - `Walls`
- the broader authored story discussed around `Extrude-3` still needs the deeper geometry split that follows next
- this is the phase where the repo should stop speaking abstractly and name the real authored modes you want

#### Locked direction:
- keep the work in one `Extrude` node first
- land the exact type names here first:
  - `Body`
  - `Walls`
- lock the authored state contract and visible selector language before the deeper geometry/runtime split
- treat `Type` as geometry-result shape, not yet as boolean/result-ownership operation
- leave the actual capped-versus-uncapped runtime output behavior to the next `3.2` subphase

### Questions / Decisions

#### [ ] Question 1 - What are the real authored type choices?

##### Must lock
- the exact option names
- their order in the selector

##### Why
- the selector now exists, so the next missing truth is what the choices actually are

##### Locked first answer
- `Body`
- `Walls`

#### [ ] Question 2 - What does each type produce?

##### Must lock
- output identity
- preview meaning
- downstream wiring expectation

##### Why
- the type split only helps if each option changes something real

##### Locked first answer
- `Body` produces a capped extrude
- `Walls` produces an uncapped extrude with side faces only
- this phase should lock that split conceptually, while the next `3.2` subphase is where preview/runtime/output behavior becomes honest

#### [ ] Question 3 - Which later controls should vary by type?

##### Must lock
- row visibility
- disabled states
- type-specific follow-on controls

##### Why
- later extent/depth/taper work should inherit one explicit type contract instead of rediscovering it

##### Locked first answer
- `Profiles` stays core for both types
- `Direction` stays core for both types
- `Depth` / `Start Depth` / `End Depth` stay core for both types
- `Taper Angle` is expected to stay available for both types unless later implementation proves otherwise
- `Wall Thickness` appears only when `Type = Walls`
- `Operation` stays deferred and should not be folded into `Type`

#### [ ] Question 4 - Do these types stay inside one `Extrude` node first?

##### Suggested answer
- yes

##### Why
- the user is still choosing one authored modeling operation, and splitting the family too early increases surface drift

#### [ ] Question 5 - Is `Operation` part of `Type`?

##### Suggested answer
- no

##### Why
- `Type` should describe what geometry gets generated
- `Operation` should later describe what happens to that generated result inside the model
- keeping them separate preserves a cleaner authored contract

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`

Locked first-cut direction:
1. replace the abstract live `Basic` / `Twist` story with the intended real authored names:
   - `Body`
   - `Walls`
2. make the selector, local authored state, and effective row state all speak the same real names
3. lock the intended authored row stack behind that type contract:
   - `Profiles`
   - `Direction`
   - `Depth`
   - `Start Depth`
   - `End Depth`
   - `Taper Angle`
   - `Wall Thickness`
   - later `Operation`
4. lock that `Body` means capped-result intent and `Walls` means uncapped-wall intent at the authored-contract level, without yet requiring the runtime path to honor it fully
5. lock that `Wall Thickness` exists only for `Walls`
6. lock that `Operation` is a later separate concern
7. keep the shell under `Inputs` and `Outputs`

Explicit exclusions:
- do not reopen the shared enum-row template work from `Extrude-3.1`
- do not implement capped-versus-uncapped preview/runtime output behavior yet in this phase
- do not implement `Direction` rows in this phase
- do not split `Depth` yet in this phase
- do not add `Taper Angle` yet in this phase
- do not add `Wall Thickness` yet in this phase
- do not implement `Operation` yet in this phase
- do not widen into compile/runtime rollout beyond what is strictly needed to lock the authored contract

Definition of done:
- the real authored type choices are named explicitly as `Body` and `Walls`
- node state and selector state both speak those names consistently
- each type has an honest authored meaning at the contract layer
- the future row stack is named explicitly
- `Wall Thickness` is reserved for `Walls`
- `Operation` is explicitly deferred instead of silently implied
- later `Extrude 3.2 Phase 2`, `Extrude 3.2 Phase 3`, `Extrude-3.3`, `Extrude-3.4`, and `Extrude-3.5` work can build on one locked type contract instead of another implied selector

Shipped implementation notes:
1. `src/app/spaghetti/registry/nodeRegistry.ts` now treats `Body` and `Walls` as the canonical authored enum values, while still normalizing older stored `Basic` / `Twist` params for compatibility.
2. `src/app/spaghetti/selectors/selectNodeVm.ts` now exposes the effective and local extrude type state through that same canonical `Body / Walls` language.
3. `src/app/spaghetti/canvas/NodeView.tsx` now renders the shared `Type` row with `Body / Walls` options and removes the last visible `Basic / Twist` selector language from the live authored surface.
4. The actual capped-versus-uncapped geometry split remains explicitly deferred to `Extrude 3.2 Phase 2`.

## [x] Extrude 3.2 Phase 2 - Body Versus Walls Geometry Meaning

### Summary

#### Purpose:
- make preview/runtime/output meaning differ honestly between `Body` and `Walls`
- stop the row from being a renamed selector whose generated result is still identical underneath

#### Current read:
- after `Phase 1`, the selector names are correct
- but the actual generated meaning is still identical underneath:
  - `src/app/spaghetti/registry/nodeRegistry.ts` still publishes the same `SolidBody` result whenever a profile and positive depth exist
  - `src/app/spaghetti/compiler/compileGraph.ts` still emits one generic `extrude` runtime op with no `Body/Walls` distinction
  - `src/worker/cad/featureStackRuntime.ts` still always creates a capped extruded body shape
  - `src/app/spaghetti/compiler/evaluateGraph.ts` still only validates the current `solidBody` output contract
- so this phase is the first real place where authored `Body` versus `Walls` has to become visible in generated geometry truth

#### Locked direction:
- `Body` should produce a capped extrude result
- `Walls` should produce an uncapped side-wall result
- keep this pass narrow and tied to result meaning, not the later row-stack expansion
- keep the current single output row first if possible, instead of inventing a whole new graph artifact family in the same pass
- no further split is required yet if `Walls` can ride the current first output lane while changing the generated geometry honestly

### Questions / Decisions

#### [ ] Question 1 - What artifact/output type should `Walls` produce in the current graph/runtime path?

##### Suggested answer
- keep the current single output lane first
- let `Walls` ride the existing `SolidBody`-published path for now as the temporary graph/runtime carrier, while changing the generated geometry to uncapped wall output

##### Why
- the current graph validator, compiler, node registry, and runtime all already assume one `solidBody`-typed output path
- forcing a brand-new surface/sheet artifact family here would widen `Phase 2` far beyond the immediate authored geometry split
- the honest first goal is making the generated geometry differ, not finishing the long-term artifact taxonomy in the same pass

#### [ ] Question 2 - How much of that split must be visible in preview immediately versus only in final artifact/runtime?

##### Suggested answer
- visible in both preview and final runtime output in the same phase

##### Why
- `Type` is already a live authored selector under `Inputs`
- if preview still shows a capped body while runtime later behaves like walls, the row stays semantically dishonest
- this phase should close that gap at the first believable level

#### [ ] Question 3 - Does `Walls` need `Wall Thickness` before this phase can land?

##### Suggested answer
- no

##### Why
- `Walls` can first mean "uncapped extrusion of the selected profile" without wall-thickness controls
- `Wall Thickness` is already staged explicitly for the later `Extrude-3.4` contract lane
- keeping thickness out of this pass keeps `Phase 2` focused on the first geometry split only

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/worker/cad/featureStackRuntime.ts`

Locked first-cut direction:
1. keep `Body` and `Walls` as the same authored selector introduced in `Phase 1`
2. keep one visible output row first
3. make `Body` continue producing the current capped extrude result
4. make `Walls` produce an uncapped side-wall result through the same first graph/runtime output lane
5. update preview/runtime messaging so the node surface stops implying the two modes are still the same
6. keep `Direction`, `Wall Thickness`, and `Operation` out of this pass

Explicit exclusions:
- do not reopen `Extrude 3.2 Phase 1` naming/state-contract work
- do not add `Direction` rows or split `Depth`
- do not add `Wall Thickness`
- do not add `Taper Angle`
- do not create a brand-new graph artifact family unless the existing first output lane proves impossible
- do not widen into `Operation`

Verification focus:
- focused registry/compiler/runtime tests proving `Body` and `Walls` no longer resolve to identical geometry meaning
- selector/view-model tests proving the authored `Type` row still stays aligned with the generated result story
- `tsc` build
- if direct `NodeView` suites still hit the known `Worker is not defined` startup blocker, record that explicitly and rely on focused coverage plus live UI verification

Definition of done:
- `Body` and `Walls` no longer produce the same effective geometry meaning
- preview/runtime truth is no longer drifting from the selector names
- the phase lands without forcing `Direction`, `Wall Thickness`, or `Operation` into scope

Shipped implementation notes:
1. `src/app/spaghetti/features/featureTypes.ts`, `src/app/spaghetti/features/featureSchema.ts`, and `src/app/spaghetti/features/compileFeatureStack.ts` now carry `extrudeType: Body | Walls` through the canonical feature-stack contract and compiled IR.
2. `src/app/spaghetti/compiler/compileGraph.ts` now preserves that authored `extrudeType` when `Geometry/Extrude` is lowered into the graph-native runtime payload.
3. `src/worker/cad/cadKernelAdapter.ts` and `src/worker/cad/featureStackRuntime.ts` now treat `Body` as capped and `Walls` as uncapped side-wall extrusion while preserving the existing first `SolidBody` output lane.
4. `src/app/spaghetti/canvas/NodeView.tsx` no longer tells the user that the `Walls` split lands in a future phase; the row copy now matches the shipped geometry behavior.
5. Focused compiler/runtime/build tests now prove the `Walls` path survives compilation and emits uncapped meshes instead of the same capped result as `Body`.

## [x] Extrude 3.2 Phase 3 - Type Surface Honesty Cleanup

### Summary

#### Purpose:
- clean up the remaining visible authored-surface wording after the real type contract and geometry meaning land
- make the node and feature surfaces describe the now-shipped `Body` versus `Walls` split honestly and consistently
- remove any leftover wording that still implies placeholder type behavior or future-tense geometry meaning

#### Current read:
- after `Phase 1` and `Phase 2`, the main semantics should be right
- the remaining likely debt is now surface-level:
  - row labels
  - empty states
  - summary copy
  - helper text
  - feature-surface wording
- the current runtime/compiler contract should not need to widen again for this phase
- this should stay a cleanup pass on visible authored truth, not another semantics or geometry phase

#### Locked direction:
- keep this as a short cleanup slice
- do not reopen the type contract or widen into direction/taper/wall-thickness work
- keep the existing row order stable:
  - `SketchProfile`
  - `Type`
  - `Depth`
- keep the current single output row stable
- no further split is required yet if the remaining work stays on visible authored-surface honesty only

### Questions / Decisions

#### [ ] Question 1 - Which visible labels and helper copy still sound like the older placeholder type story?

##### Locked first answer
- any wording that still implies:
  - the geometry split is deferred
  - `Type` is still just a renamed placeholder selector
  - both type options still produce the same result
- the cleanup should also catch any places where `SolidBody`-lane wording accidentally sounds `Body`-only even when `Walls` is selected

#### [ ] Question 2 - Which surfaces must agree in this cleanup phase?

##### Locked first answer
- `Geometry/Extrude` node surface
- feature-oriented extrude editing surface if it still exists and is reachable
- any summary/empty-state/helper copy that references the generated result

##### Why
- after `Phase 2`, authored truth is only as strong as the surface language that explains it

#### [ ] Question 3 - Does this phase change any geometry or visibility rules?

##### Suggested answer
- no

##### Why
- geometry/result meaning already landed in `Phase 2`
- later row visibility branching belongs to `Extrude-3.3` and `Extrude-3.4`

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- any helper copy/empty-state seams touched by the earlier two phases

Locked first-cut direction:
1. audit the live `Geometry/Extrude` node surface for any remaining `Body / Walls` wording drift
2. update visible summaries, placeholders, and helper text so:
   - `Body` clearly reads as capped
   - `Walls` clearly reads as uncapped side-wall output
3. update any feature-surface copy to match that same authored story
4. keep the current row structure and selector behavior unchanged
5. keep the current single output lane unchanged

Explicit exclusions:
- do not change compiler/runtime geometry behavior again in this phase
- do not add `Direction`
- do not split `Depth`
- do not add `Taper Angle`
- do not add `Wall Thickness`
- do not add `Operation`
- do not reopen enum-row foundation or `Extrude-3.1` work

Verification focus:
- focused static render or selector-surface tests where helpful
- `tsc` build if any implementation files change
- if direct `NodeView` suites still hit the known `Worker is not defined` startup blocker, record that explicitly and rely on focused coverage plus live UI verification

Definition of done:
- the visible authored surface speaks the same `Body` versus `Walls` story the contract and generated result now use
- no visible helper copy still implies the `Walls` geometry split is deferred
- no visible summary/empty-state text still reads like the old placeholder type story

Shipped implementation notes:
1. `src/app/spaghetti/canvas/NodeView.tsx` now uses type-aware extrude summary copy so `Body` reads as a capped result and `Walls` reads as uncapped side walls in both ready and waiting states.
2. `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx` now surfaces the authored `Type` directly and uses matching `Body / Walls` result wording in its feature summary text.
3. `src/app/spaghetti/canvas/NodeView.test.tsx` now records the updated visible node-summary wording for `Body` and `Walls`.
