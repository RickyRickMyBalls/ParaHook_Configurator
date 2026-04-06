## [ ] - `Extrude-1B` - `Graph-Node And Feature-Stack Extrude Contract Convergence`

### Summary

#### Purpose:
- clean up the split between the current `Geometry/Extrude` graph node and the feature-stack extrude surface after `Extrude-1A` lands

#### Owns:
- the first canonical single-profile extrude contract shared across the graph node and feature-stack path
- visible-parameter honesty for the current authored extrude surface
- deciding whether `taper/offset` become real runtime behavior now or leave the visible authored surface until later
- keeping the first converged contract narrow before plural `EWR` growth

#### Does not own:
- the immediate authored-plane placement bug from `Extrude-1A`
- plural profile-input rollout
- boolean, combine, cut, or intersect behavior
- later extent families beyond the first converged contract

#### Current seam read:

- the graph node currently exposes:
  - `ExtrusionProfile + Depth -> SolidBody`
  - in `src/app/spaghetti/registry/nodeRegistry.ts`
  - surfaced in `src/app/spaghetti/canvas/NodeView.tsx`
- the feature-stack extrude path currently exposes:
  - `profileRef + depth/taper/offset -> bodyId`
  - in `src/app/spaghetti/features/featureTypes.ts`
  - compiled in `src/app/spaghetti/features/compileFeatureStack.ts`
  - surfaced in `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `taper` and `offset` are currently visible on the feature-stack surface but runtime still behaves as depth-only
- the repo should not widen into plural `EWR` profile-input authoring while even the single-profile contract is still split

Current strongest read:
- after `Extrude-1A`, the next biggest extrude debt will be contract drift and visible parameter dishonesty, not authored-plane placement

### Questions

#### [x] Question 1 - Should the first converged contract stay single-profile?

##### Locked answer
- yes
- keep the first converged contract to:
  - one profile reference
  - one positive depth
  - one body output
- do not widen into plural-profile authoring until the single-profile contract is stable and honest

##### Why
- the repo should not widen into plural `EWR` rollout while even the single-profile contract is still split
- a narrower honest contract is a better base for later growth than a larger drifting one

#### [x] Question 2 - What should happen to `taper` and `offset` in the first converged contract?

##### Locked answer
- visible authored parameters must be honest
- if runtime support is not landing in this phase, remove, hide, or explicitly defer those controls from the active authored surface
- do not keep editable no-op controls as if they were already part of the shipped contract

##### Why
- users already see these controls on the feature-stack surface
- no-op controls make the contract look more complete than runtime really is

#### [x] Question 3 - Which surface should convergence start from?

##### Locked answer
- start from the narrowest honest common contract:
  - one selected/resolved profile
  - one positive depth
  - one produced body
- then align the graph-node registry/view model and the feature-stack types/editor around that shared shape

##### Why
- convergence is easier if both surfaces meet at the smallest already-useful truth
- it avoids widening into later extent or plural-profile work before the first common contract is stable

### Spec

Implementation-ready spec:
- `Extrude-1B` is the first contract cleanup after the authored-plane placement seam is truthful
- this phase should not reopen the `Extrude-1A` runtime placement repair unless convergence work proves a missing dependency

Implementation seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

Implementation steps:
1. Choose the first canonical shared extrude contract for the single-profile phase.
2. Align graph-node and feature-stack naming around that contract.
3. Make visible parameters honest:
   - either implement `taper/offset` end to end
   - or remove/defer them from the active authored surface until runtime support exists
4. Refresh node VM and editor summary text so the graph node and feature-stack surface describe the same behavior.
5. Keep the phase narrow:
   - no plural-profile rollout
   - no boolean family growth
   - no browser restructuring

Acceptance checks:
- the graph node and feature-stack surface describe the same first-cut single-profile extrude behavior
- users no longer see editable no-op extrude parameters presented as live behavior
- the converged contract remains compatible with the shipped `Extrude-1A` placement fix

Definition of done:
- there is one honest first-cut single-profile extrude contract
- graph-node and feature-stack extrude surfaces stop drifting
- visible authored parameters match real runtime behavior
