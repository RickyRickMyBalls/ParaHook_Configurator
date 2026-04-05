## Doc Header

### Doc History
6. 2026-04-05 11:19: Carved `Extrude-3.2 - Real Type Modes Contract` out into its own dedicated future doc so the first post-`Extrude-3.1` authored-semantics lock now has a real implementation home instead of living only as one section inside this broader `Extrude-3` umbrella ladder
5. 2026-04-05 11:15: Reformatted `Extrude-3 - Type Modes And Functional Completion` into a real multi-phase ladder so the next authored extrude work now reads as explicit `Extrude 3 Phase N` slices, with the completed `Extrude-3.1` enum-row groundwork recognized as the finished first phase and the remaining semantics, extent, taper, and runtime-convergence work broken into separately scannable follow-ons
4. 2026-04-05 09:41: Carved task `1` out into the dedicated future phase `Extrude-3.1 - Enum Input Row And Type Selector`, locking that the first explicit `Extrude Type` control should land as the first reusable primitive `enum input row` template and reserving `Extrude-3.1-1` / `Extrude-3.1-2` if that lane later needs its own subphases
3. 2026-04-05 09:28: Tightened the `Extrude-3` node-shell direction by locking that the authored `Type`, extent-mode, depth, and taper controls should all live under `Inputs`, the old `Details` section should be deleted, and the extrude node should settle into an `Inputs` plus `Outputs` shell only
2. 2026-04-05 09:26: Expanded the `Extrude-3` task stack after the next authored feature requests by locking the follow-on extent-mode selector to `One Side`, `Two Sides`, and `Symmetrical`, adding `Taper Angle` as the next explicit task, and recording that choosing `Two Sides` should replace the single `Depth` row with `Start Depth` plus `End Depth`
1. 2026-04-05 09:22: Created this dedicated `Extrude-3` future doc as the first explicit task stack for getting `Extrude` to feel functionally complete beyond the landed placement repair and the still-open toolbar polish lane, locking task `1` to a real `Type` `ParaSelector` with `Body` and `Profile` options while staging the downstream contract, runtime, and surface work that choice implies

## Doc Body

### Summary

`Extrude-3` is the authored-semantics ladder for getting `Geometry/Extrude` from “good proving node” to “honest feature surface.”

Current read:
- the enum-row groundwork is now done through the finished `Extrude-3.1` ladder
- the node shell direction is locked:
  - `Inputs`
  - `Outputs`
  - no new `Details` bucket
- the next real work is no longer “how do we render the selector row?”
- the next real work is:
  - what `Type` actually means
  - how extent modes change the row surface
  - when `Depth` splits honestly
  - when `Taper Angle` becomes real
  - how compile/runtime/preview converge on the authored meaning

Locked recommendation:
- treat `Extrude-3.1` as the completed row-template/foundation phase for this family
- use the remaining `Extrude-3` phases to settle authored meaning and runtime truth
- keep all authored extrude controls under `Inputs`
- do not regrow a `Details` section just because the semantics become richer

### Current Code-Backed Read

The strongest owner seams for the remaining `Extrude-3` ladder are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the live `SketchProfile -> Type -> Depth` authored row surface
  - is the proving surface for later mode-aware control visibility
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries effective/local type state and depth state
  - is the main seam for later mode-aware node truth
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already owns the current extrude param and input contract
  - is the narrowest place to evolve authored type/extent inputs honestly
- `src/app/spaghetti/features/featureTypes.ts`
  - is where later authored type/extent meaning should become explicit in the feature contract
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - is where the later authored type/extent/taper meaning has to survive compilation
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - are the likely follow-on authored surfaces that need to stop drifting from the node surface

### Phase Breakdown

1. `Extrude 3 Phase 1 - Enum Row Foundation And Type Selector`
Reason:
- the repo first needed a reusable enum-row template plus a real `Extrude Type` row before the authored type semantics could be made honest

2. `Extrude 3 Phase 2 - Real Type Modes Contract`
Reason:
- now that the selector row exists, the next honest step is deciding what the type choices actually mean instead of leaving them as label-only modes
Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`

3. `Extrude 3 Phase 3 - Extent Mode Selector And Depth Row Split`
Reason:
- once type semantics are locked, the next major authored lever is extent behavior, and that is what forces the later `Depth` row split into `Start Depth` / `End Depth`

4. `Extrude 3 Phase 4 - Taper Angle And Type-Aware Surface Honesty`
Reason:
- after type and extent are explicit, the next debt is surfacing `Taper Angle` honestly and making visibility/editability follow the selected authored mode

5. `Extrude 3 Phase 5 - Compile Runtime Preview And Result Convergence`
Reason:
- once the authored surface is honest, the remaining work is pushing that same meaning through compile/runtime/preview/output ownership so the feature stops pretending one fixed always-body / one-sided contract underneath richer UI

## [x] Extrude 3.1 - Enum Row Foundation And Type Selector

### Summary

#### Purpose:
- give `Extrude` a real `Type` row
- establish the reusable enum-row template first

#### Current read:
- this work was split into the dedicated `Extrude-3.1` ladder because it needed its own row-template subphases
- that ladder is now complete through:
  - shared enum-row foundation
  - visual shell parity
  - whole-number driven enum input
  - fill/endcap cleanup

#### Locked output:
- `Extrude Type` exists as a real input row under `Inputs`
- the shared enum row is now stable enough to reuse on later selectors

### Questions / Decisions

#### [x] Question 1 - Should this selector groundwork stay inside `Extrude-3` or live as its own dedicated ladder?

##### Locked answer
- its own dedicated ladder

##### Why
- the row-template work was materially different from the later authored-semantics work

#### [x] Question 2 - Is this phase still open?

##### Locked answer
- no

##### Why
- the `Extrude-3.1` ladder is now complete and should be treated as finished groundwork

### Implementation Spec

Shipped implementation home:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.1 - Enum Input Row And Type Selector.md`

Shipped output:
- real `Type` row under `Inputs`
- stable shared enum-row template
- unitless whole-number-driven enum slot mapping
- settled enum fill/endcap behavior

Definition of done:
- `Extrude-3.1` is complete
- later `Extrude-3` work can assume the row template exists and is no longer the blocker

## [ ] Extrude 3.2 - Real Type Modes Contract

### Summary

#### Purpose:
- decide what the authored extrude type choices actually mean

#### Current read:
- `Type` now exists as a real row, but the broader authored semantics are still thin
- the current live options are still `Basic` and `Twist`
- the wider authored story discussed for `Extrude-3` is not yet locked into one honest feature contract

#### Locked direction:
- use this phase to lock the real authored meaning of the type choices
- do not let `Type` stay as another selector whose downstream meaning is implied or deferred forever

### Questions / Decisions

#### [ ] Question 1 - What are the real authored type choices?

##### Working direction
- lock the exact three types you want here before implementation starts

##### Why
- this is the first place where the repo should stop speaking abstractly and name the real authored modes

#### [ ] Question 2 - Do those types stay as one `Extrude` node or split into separate later nodes?

##### Suggested answer
- keep them as one `Extrude` node first

##### Why
- the user is still choosing one authored modeling operation, and splitting the family too early creates more surface drift

#### [ ] Question 3 - What does each type produce?

##### Must lock
- output identity
- preview meaning
- downstream wiring expectation
- which later controls are valid

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

Locked first-cut direction:
1. name the real authored type options explicitly
2. define what each type means in authored state
3. define which controls should appear or disappear for each type
4. keep the shell under `Inputs` and `Outputs`

Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`

Definition of done:
- `Type` is no longer label-only
- each type has an explicit authored meaning
- the node surface and feature surface can now be made mode-aware honestly

## [ ] Extrude 3.3 - Extent Mode Selector And Depth Row Split

### Summary

#### Purpose:
- add the next authored selector for extent behavior
- make depth rows tell the truth once extent modes diverge

#### Current read:
- after type meaning is explicit, the next missing authored lever is how the extrusion extends from the source profile
- the current one-row `Depth` story is only honest for the one-sided case

#### Locked direction:
- add `Extent Type`
- first options:
  - `One Side`
  - `Two Sides`
  - `Symmetrical`
- replace the single `Depth` row with `Start Depth` plus `End Depth` when `Two Sides` is active

### Questions / Decisions

#### [x] Question 1 - What should the extent selector options be?

##### Locked answer
- `One Side`
- `Two Sides`
- `Symmetrical`

#### [x] Question 2 - What should happen to `Depth` under `Two Sides`?

##### Locked answer
- replace it with:
  - `Start Depth`
  - `End Depth`

#### [ ] Question 3 - What is the honest row story for `Symmetrical`?

##### Must lock
- whether it keeps one `Depth` row
- whether it uses one centered magnitude row
- whether direction/flip lives elsewhere

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- shared numeric-row helpers if additional scalar rows are needed

Definition of done:
- extent mode is explicit
- `Two Sides` no longer pretends one `Depth` row is enough
- the visible row set matches the authored extent mode honestly

## [ ] Extrude 3.4 - Taper Angle And Type-Aware Surface Honesty

### Summary

#### Purpose:
- make `Taper Angle` a real authored control instead of another visible debt
- make the authored surfaces respond honestly to the selected type/extent mode

#### Current read:
- taper is part of user expectation around extrude
- it should not appear as a no-op or always-on control if it only applies in specific authored cases

#### Locked direction:
- add `Taper Angle`
- make its visibility/editability depend on the selected authored mode honestly
- keep the authored controls under `Inputs`

### Questions / Decisions

#### [x] Question 1 - What is the next scalar control after extent mode?

##### Locked answer
- `Taper Angle`

#### [ ] Question 2 - Which type/extent combinations should actually surface it?

##### Must lock
- visibility
- editability
- fallback/disabled behavior

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/features/featureTypes.ts`

Definition of done:
- `Taper Angle` is either implemented honestly or not shown as active authored behavior
- the visible control set now depends on the selected authored mode instead of staying fixed

## [ ] Extrude 3.5 - Compile Runtime Preview And Result Convergence

### Summary

#### Purpose:
- carry the authored type/extent/taper meaning all the way through compile, runtime, preview, and result ownership

#### Current read:
- even once the node surface is honest, the feature is still incomplete if runtime silently behaves as one fixed contract underneath richer UI

#### Locked direction:
- thread the selected authored meaning through:
  - registry/view-model reads
  - feature-stack types
  - compile output
  - worker/runtime behavior
  - preview/output shaping
- keep the landed sketch-plane transform contract intact

### Questions / Decisions

#### [ ] Question 1 - How should each type/mode be represented through compile/runtime?

##### Must lock
- compile payload shape
- runtime branch ownership
- preview shaping

#### [ ] Question 2 - How should result ownership and downstream compatibility be named?

##### Must lock
- output identity
- browser/workspace labeling
- downstream compatibility expectations

### Implementation Spec

Likely files:
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- runtime/worker extrude paths
- preview/output shaping selectors and consumers

Acceptance checks:
- selected authored type and extent survive round-trip through authored state
- preview/runtime behavior matches the selected type/mode
- result ownership is explicit and truthful
- the landed authored-plane placement repair remains intact

Definition of done:
- authored extrude modes are no longer UI-only
- compile/runtime/preview/output all follow the same authored contract
- `Extrude-3` can be considered functionally honest enough to hand into later family growth instead of more contract cleanup
