# Transform Phase Transform-2 - Canonical Hierarchy And Target Ownership

## Doc Header

### Doc History
1. 2026-03-26 18:24: Created this standalone `Transform 2` future phase doc under the Transform family, translating the locked hierarchy and target-ownership decisions into an implementation-ready spec for moving beyond the reference-only foundation into the canonical `Transform > Move/Rotate/Scale` path across non-reference target kinds

### Purpose

This phase turns the transform family from a reference-only foundation into the first honest cross-target hierarchy and ownership pass.

Use it to answer:
- what the canonical staged transform hierarchy should be
- how target-local `Move`, `Rotate`, and `Scale` shortcuts should relate to that hierarchy
- which non-reference target kinds should gain real transform ownership in this phase
- which seams should own target-local transform state versus surface adaptation

## Doc Body

## [ ] Transform 2 - Canonical Hierarchy And Target Ownership

### Summary

`Transform 2` is the phase where transform stops reading like one older reference feature plus later one-off add-ons.

It should move valid targets onto one honest staged hierarchy:
- `Select > <Target Kind> > <Target Label> > Transform`
- `Select > <Target Kind> > <Target Label> > Transform > Move`
- `Select > <Target Kind> > <Target Label> > Transform > Rotate`
- `Select > <Target Kind> > <Target Label> > Transform > Scale`

This phase should also add real non-reference target ownership instead of faking those targets through the existing reference transform seams.

Phase outcome:
- `Transform` becomes the canonical first transform entry under valid targets
- direct target-local `Move/Rotate/Scale` remain available only as shortcuts into the canonical branch
- object, folder, and assembly targets gain real transform state paths beside the existing reference path
- transform ownership becomes target-honest while still staying aligned at the product and Console-grammar level

### Owns

- canonical transform hierarchy under valid targets
- adapter-shortcut behavior for direct target-local `Move/Rotate/Scale`
- real non-reference target transform ownership for:
  - object
  - folder
  - assembly
- the first app/store and viewer ownership seams required for those non-reference target families

### Does Not Own

- the reference-first history foundation already covered by `Transform 1`
- the later shared transform-shell behavior and post-commit persistence flow covered by `Transform 3`
- the later move/scale/rotate viewport history visuals and traversal/restore behavior covered by `Transform 4`
- broad Browser row cleanup outside transform entry paths

### Locked Direction

#### 1. `Transform` is the canonical first transform entry

Locked rule:
- yes
- selected transformable targets should expose `Transform`
- `Move`, `Rotate`, and `Scale` should live one level deeper under that branch

Canonical staged shape:
- `Select > <Target Kind> > <Target Label> > Transform`
- `Select > <Target Kind> > <Target Label> > Transform > Move`
- `Select > <Target Kind> > <Target Label> > Transform > Rotate`
- `Select > <Target Kind> > <Target Label> > Transform > Scale`

Example:
- `Select > References > premadefoothooks > XL > Transform > Move`

#### 2. Direct target-local `Move/Rotate/Scale` remain adapter shortcuts only

Locked rule:
- yes, direct target-local `Move`, `Rotate`, and `Scale` may still be allowed
- they are adapter shortcuts only
- direct `Move`, `Rotate`, and `Scale` should auto-enter the canonical `Transform > Move/Rotate/Scale` path
- breadcrumbs should still resolve honestly through `Transform`

Shortcut examples:
- target-local `m` -> `Transform > Move`
- target-local `r` -> `Transform > Rotate`
- target-local `s` -> `Transform > Scale`

Important rule:
- do not let direct target-local `Move/Rotate/Scale` become a second hierarchy owner
- they are convenience entrypoints into the canonical branch, not sibling command families with separate semantics

#### 3. Real non-reference ownership should cover object, folder, and assembly

Locked rule:
- add real object, folder, and assembly transform state paths beside the existing reference path
- do not fake those targets by redirecting them into reference-owned transform

Product direction:
- reference transform and non-reference transform should still feel like one family
- internal ownership may stay parallel at first
- later cleanup may extract shared abstractions only after those target families stabilize

#### 4. Ownership split stays owner-first

Locked rule:
- Browser and Console should stay adapters into the transform family, not transform owners
- live transform execution stays viewer-owned
- target-local session state and committed history stay app/store-owned
- direct Browser or Console shortcuts should not bypass those owner seams

This phase should follow the same owner-first rule already locked by the shared command-ownership architecture direction.

### Public Interfaces And State

Expected staged-navigation growth:

- `src/app/console/stagedNavigation.ts`
  - valid transformable targets expose `Transform`
  - `Move`, `Rotate`, and `Scale` live one level deeper under that branch
  - direct target-local `Move/Rotate/Scale` shortcuts resolve into the canonical branch instead of owning separate staged paths

Expected app/store growth:

- `src/app/store/useAppStore.ts`
  - add target-specific transform session state for:
    - object
    - folder
    - assembly
  - keep those state paths parallel to the existing reference path at first rather than forcing premature generic unification

Expected viewer / bridge growth:

- `src/app/viewerBridge.ts`
  - add target-appropriate session / commit / cancel seams for non-reference target transform ownership
- `src/viewer/Viewer.ts`
  - keep live transform execution viewer-owned while broadening target support

Expected surface wiring:

- `src/app/components/ViewportOverlay.tsx`
  - expose target-appropriate transform toolbar surfaces for the new target families
- `src/app/console/ConsoleDock.tsx`
  - keep Console grammar aligned across target kinds while remaining target-honest in breadcrumbs and ownership

### Required File Targets

Primary implementation seams:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Likely Browser adapter seams:
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/BrowserPanel.tsx`

Expected verification seams:
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`
- Browser-side tests where transformable row actions or target sync need coverage

### Test Plan

Required verification:

- hierarchy:
  - valid transformable targets expose `Transform`
  - `Move`, `Rotate`, and `Scale` live one level deeper under that branch
  - breadcrumbs resolve honestly through `Transform`

- shortcuts:
  - direct target-local `Move/Rotate/Scale` still work as convenience entrypoints
  - direct target-local `m/r/s` auto-enter `Transform > Move/Rotate/Scale`
  - those shortcuts do not produce a second independent hierarchy path

- ownership:
  - object targets gain real transform ownership
  - folder targets gain real transform ownership
  - assembly targets gain real transform ownership
  - those targets do not fake their transform behavior by redirecting into reference-owned transform

- regression:
  - reference transform still works through the same target-honest family
  - existing reference history/session behavior from `Transform 1` remains intact

### Assumptions

- `Transform 1` remains the already-locked reference-first foundation
- `Transform 2` is the first cross-target hierarchy and ownership pass
- reference and non-reference transform state may stay parallel in this phase
- later cleanup may unify abstractions only after the target paths stabilize
