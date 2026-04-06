# Browser Phase Browser-7.5 - Final Transform Direction And Phase Split

## Doc Header

### Doc History
13. 2026-03-26 18:05: Shifted the transform ladder again so the old Browser `7.3` reference-first foundation now counts as `Transform 1`, with the later phases moving up to `Transform 2`, `Transform 3`, and `Transform 4`, keeping the first real transform phase aligned with the already-existing history/session foundation instead of starting numbering only after it
12. 2026-03-26 18:00: Renamed the next transform ladder from Browser-numbered `8.1`, `8.2`, and `8.3` into `Transform 1`, `Transform 2`, and `Transform 3` so the new Transform family can own the forward phase naming cleanly instead of keeping the remaining transform execution slices tied to Browser numbering
11. 2026-03-26 17:50: Reframed the umbrella `7.5` execution ladder into three named Browser phases `8.1`, `8.2`, and `8.3`, collapsing the earlier lettered slices into a cleaner next-phase sequence for transform hierarchy and ownership, shared transform shell behavior, and later viewport-history visuals plus traversal/cleanup
10. 2026-03-26 17:46: Tightened the umbrella `7.5` transform direction by locking the first viewport-history clutter rules and by breaking the umbrella into a concrete subphase ladder, clarifying that selected history rows render strongest while older rows fade, merged-away rows disappear from both the toolbar and viewport visuals, non-uniform scale should use an ellipsoid-style overlay instead of a pure sphere, and the remaining transform work should be split into explicit `7.5A` through `7.5E` execution slices around hierarchy, target-state ownership, shared history shell, viewport visuals, and later cleanup
9. 2026-03-26 17:39: Expanded the umbrella `7.5` transform direction again to lock first visualization directions for scale and rotate history, clarifying that scale history should compare original versus committed scale with sphere overlays, while rotate history should compare original versus committed plane-normal directions with an AutoCAD-style angle-dimension visual between the two directions
8. 2026-03-26 17:35: Expanded the umbrella `7.5` transform direction again to lock a viewport transform-history path visualization, clarifying that when a target has multiple committed move-history entries the viewport should draw a line from the origin through each successive committed origin point so the user can read the movement path alongside the toolbar history list
7. 2026-03-26 17:31: Expanded the umbrella `7.5` transform direction again to lock post-commit return behavior, clarifying that after a committed target-local transform like `Move > Vec3` the Console should return to the same target's `Transform` root `Choose next` scope so the transform toolbar/session shell stays alive and transform history remains in view
6. 2026-03-26 17:27: Expanded the umbrella `7.5` transform direction again to lock typed plane-entry behavior, clarifying that paths like `Select > Object > <Label> > Transform > Move > XY` should expect a `Vec2` input such as `10,10` instead of a float, parallel to the single-axis float-entry rule and aligned with the sketch-plane transform precedent
5. 2026-03-26 17:24: Expanded the umbrella `7.5` transform direction again to lock typed axis-entry behavior, clarifying that after a target-level or transform-level `Move` shortcut the Console may continue into `X / Y / Z` numeric prompts, and that paths like `Select > Object > <Label> > Transform > Move > X` should expect a float input in the same way sketch-plane transform already does
4. 2026-03-26 17:20: Expanded the umbrella `7.5` transform direction to allow direct selected-target `Move`, `Rotate`, and `Scale` shorthand as adapter shortcuts into the canonical `Transform > Move/Rotate/Scale` branch, locking the rule that target-scope `m / r / s` may auto-enter the deeper transform path while breadcrumbs still resolve honestly through `Transform`
3. 2026-03-26 17:07: Locked the final Browser transform hierarchy so valid selected targets should expose `Transform` first, with `Move`, `Rotate`, and `Scale` living one level deeper under that branch rather than directly on the selected target scope, and recorded the canonical staged breadcrumb shape using the explicit reference example `Select > References > premadefoothooks > XL > Transform > Move`
2. 2026-03-26 17:02: Reframed this future Browser phase from an object-only transform ownership follow-on into the umbrella Browser transform phase, so `7.5` now defines the final transform direction first and explicitly plans to break that larger target model into narrower implementation subphases instead of treating object transform as the whole phase
1. 2026-03-26 16:52: Created this standalone future Browser follow-on to define a real object-owned transform state path, keeping it explicitly separate from the reference-first `Browser-7.3` work while locking the need for an object Console entry point, object-local toolbar ownership, and non-reference transform state instead of a fake redirect into the reference transform session

### Purpose

This phase defines the Browser transform umbrella direction.

Use it to answer:
- what the final Browser transform target model should be
- how reference-owned and object-owned transform paths should relate
- what shared Console and toolbar grammar should be reused across target kinds
- how transform history and later traversal/restore should fit together
- how to split that larger transform direction into narrower implementation phases afterward

## Doc Body

## [ ] Browser-7.5 - Final Transform Direction And Phase Split

### Summary

This phase is the umbrella Browser transform phase.

It should define the final transform direction first, then break actual implementation into narrower subphases.

That means:
- do not treat the current reference-first `7.3` cut as the whole final transform model
- do not treat object transform as a one-off add-on with no larger target picture
- use `7.5` to lock how Browser-selected targets should eventually participate in one honest transform family, while still allowing target-specific ownership under the hood

Phase outcome:
- Browser has one explicit umbrella transform direction
- the final target model for transform is locked before implementation keeps branching
- the old `7.3` reference-first cut now reads as `Transform 1`
- `7.4` stays the later history traversal / restore direction
- later implementation splits can be derived from one coherent transform target instead of growing ad hoc

### Owns

- the final Browser transform target picture
- the relationship between reference transform and object transform
- the long-term direction for transform history plus traversal/restore
- the phase split needed to implement that direction safely
- the decision about which transform concerns stay shared versus target-specific

### Does Not Own

- pretending the entire transform family can ship as one patch
- forcing premature generic abstractions before the target model is locked
- detailed assembly or multi-select transform behavior in the same phase
- unrelated Browser row cleanup outside transform direction

### Why This Exists Above Browser-7.3 And Browser-7.4

`Browser-7.3` is reference-first.

The current implementation already has:
- `referenceWorkspace.activeTransformReferenceId`
- `ReferenceTransformToolbar`
- viewer wiring for reference transform sessions

There is no equivalent honest object transform state path yet.

And `Browser-7.4` is already the later history traversal / restore idea, not the place to decide the whole target model.

So without an umbrella transform phase, one of two bad things happens:
- it becomes a fake redirect into reference transform
- or object transform quietly grows without a locked final ownership picture

This phase exists to avoid both.

### Locked Direction

#### 1. Browser should have one transform family, not one reference feature plus one later object patch

Locked rule:
- Browser transform should be treated as one family with target-specific ownership underneath
- valid selected targets should eventually have an honest transform entry path
- reference transform and object transform should feel related at the product level, even if their state paths are different internally

Target picture:
- references remain valid transform targets
- authored objects should become valid transform targets
- assemblies should become valid transform targets
- folder-like Browser containers that are intended to behave as transformable targets should also follow the same staged transform path

Final hierarchy rule:
- when a user selects a valid transform target, the selected-target scope should expose `Transform`
- `Move`, `Rotate`, and `Scale` should live one level deeper under `Transform`
- do not keep the final Browser transform hierarchy as direct target-local `Move`, `Rotate`, and `Scale` entries at the first selected-target level

Shortcut rule:
- valid selected-target scopes may still expose direct `Move`, `Rotate`, and `Scale` as convenience entries or typed aliases
- those direct entries are adapter shortcuts, not separate hierarchy owners
- choosing `Move`, `Rotate`, or `Scale` from the selected-target scope should auto-enter:
  - `Transform`
  - then the chosen transform mode
- breadcrumbs and active session state should still resolve through the canonical transform branch, for example:
  - `Select > References > premadefoothooks > XL > Transform > Move`
- the same rule should apply to typed shortcuts like:
  - `m`
  - `r`
  - `s`

Canonical staged shape:
- `Select > <Target Kind> > <Target Label> > Transform`
- `Select > <Target Kind> > <Target Label> > Transform > Move`
- `Select > <Target Kind> > <Target Label> > Transform > Rotate`
- `Select > <Target Kind> > <Target Label> > Transform > Scale`

Explicit reference example:
- `Select > References > premadefoothooks > XL > Transform > Move`

Live-session extension:
- once the user is inside a live transform, the active Console path may continue deeper from that staged breadcrumb, for example:
  - `Select > References > premadefoothooks > XL > Transform > Move > Vec3 [...]`
  - `Select > Object > <Label> > Transform > Move > X`
  - `Select > Object > <Label> > Transform > Move > XY`

Post-commit return rule:
- after a committed transform step, the Console should return to the same target-local `Transform` root instead of exiting all the way back to the broader selected-target scope
- canonical example:
  - user is at `Select > Object > <Label> > Transform > Move > Vec3`
  - user commits the move
  - Console returns to:
    - `Select > Object > <Label> > Transform > Choose next`
- this keeps the transform toolbar/session shell alive and keeps target-local transform history visible between repeated transform steps

#### 2. Reference-owned and object-owned state can stay parallel at first

Locked rule:
- do not force reference and object transform into one generic store branch before the target model is stable
- parallel target-specific ownership is acceptable in the first real object pass
- later cleanup can extract a shared transform-session primitive if both sides stabilize

This means:
- `7.3` can stay reference-owned
- a later object transform subphase can add object-owned state beside it
- a later cleanup can unify abstractions only after both are real

#### 3. `Select > Object` should eventually open a real transform path

Locked rule:
- object scope should not stop at `Zoom` forever
- `Select > Object > <Object Label>` should eventually expose a real transform entry
- object transform should not be implemented as a disguised reference redirect

Preferred first-pass direction for the later object subphase:
- add `Transform` under object scope
- let that branch expose:
  - `Move`
  - `Rotate`
  - `Scale`
- let those second-layer commands open the real object transform session and object-local toolbar

#### 4. Shared Console transform grammar should stay aligned where practical

Locked rule:
- reference and object transform should share the same broad Console transform language when the behaviors match
- target identity should still stay honest in the breadcrumb and ownership path

Expected shared grammar:
- `Move`
- `Rotate`
- `Scale`
- `Vec3`
- `X`
- `Y`
- `Z`
- `XY`
- `XZ`
- `YZ`
- `CommitTransform`

Shortcut grammar rule:
- if the current selected target supports transform, target-local typed shortcuts may resolve directly into the canonical transform branch:
  - `m` -> `Transform > Move`
  - `r` -> `Transform > Rotate`
  - `s` -> `Transform > Scale`
- this should be treated as Console adapter convenience, not as a second transform hierarchy

Typed numeric-entry rule:
- once a live transform mode is active, deeper in-session transform options should behave consistently across supported target kinds
- if the user enters:
  - `Move > X`
  - `Move > Y`
  - `Move > Z`
- the Console should then expect a float input for that axis, using the same broad pattern already proven by sketch-plane transform
- canonical example:
  - `Select > Object > <Label> > Transform > Move > X`
  - next Console input expects a float like `10`
- the same expectation should apply to equivalent single-axis transform options for other supported target kinds, including references, when those target families expose the same live transform grammar

Typed plane-entry rule:
- once a live transform mode is active, plane options should also have an explicit typed-input expectation
- if the user enters:
  - `Move > XY`
  - `Move > XZ`
  - `Move > YZ`
- the Console should then expect a `Vec2` input for that plane, not a float
- canonical example:
  - `Select > Object > <Label> > Transform > Move > XY`
  - next Console input expects a vec2 like `10,10`
- the same expectation should apply to equivalent plane options for other supported target kinds, including references, when those target families expose the same live transform grammar

#### 5. History and traversal should be one coherent ladder

Locked rule:
- append-on-commit transform history is the foundation layer
- later traversal / preview / restore is the follow-on layer
- do not conflate those into the same first implementation cut
- post-commit return should stay inside the target-local `Transform` root so repeated transform steps can continue while history remains visible in the same session shell

Viewport history-visualization rule:
- when a target has multiple committed move-history entries, the viewport should visualize that movement history as a connected path
- draw a line from the original origin to each successive committed moved origin point in order
- this path should let the user read the historical movement route alongside the textual transform-history entries in the toolbar
- this visualization is primarily tied to committed move history, not rotate/scale history
- the visual should stay aligned with the same committed history list the toolbar renders rather than inventing a second unsynced preview path

Scale history-visualization rule:
- scale history should use its own comparative viewport rendering instead of reusing move-path lines
- show one sphere at the original scale state
- show a second sphere at the newly committed scale state
- the purpose is to let the user read how the target's scale changed between committed states without relying only on text rows
- this should be treated as the scale-parallel history visual in the same family as move-path rendering
- if the committed scale is non-uniform, prefer an ellipsoid-style overlay over a perfect sphere so axis differences remain visible

Rotate history-visualization rule:
- rotate history should use its own comparative viewport rendering instead of reusing move-path lines
- show the original plane-normal direction
- show the newly committed plane-normal direction
- render a dimension-style angle arc or angle-dimension guide between those two directions in the same broad visual spirit as an AutoCAD angle dimension
- the goal is directional comparison, not numeric angle readout
- do not require a visible numeric label in this first locked direction; showing the direction change clearly is enough

Viewport emphasis rule:
- the selected or currently active history row should render with the strongest viewport emphasis
- older committed history visuals should remain visible but faded
- this applies to move, scale, and rotate history visuals so the viewport does not become unreadable as the list grows

Merge visibility rule:
- when history rows are merged away, they should disappear from both:
  - the toolbar history list
  - the viewport history visuals
- do not keep stale merged-away history segments or overlays visible after the merge operation

This means:
- `7.3` is the history foundation direction
- `7.4` is the traversal / restore direction
- both should now be understood as sub-directions under the larger transform umbrella

#### 6. Viewer execution stays viewer-owned

Locked rule:
- live transform execution stays viewer-owned
- app/store owns active target identity, committed snapshots, and history
- Console owns assisted prompt/prefill state

This remains true whether the target is a reference or a later object target.

### Planned Split After Direction Is Locked

Expected next-phase ladder:

- `Transform 1`
  - reference-first live transform session and append-on-commit history foundation
  - prove the history/store/commit callback model on the already-real reference path
- `Transform 2`
  - canonical transform hierarchy and target ownership
  - move valid transform targets onto the honest `Select > <Target> > Transform > Move/Rotate/Scale` hierarchy
  - keep target-local `m / r / s` as convenience adapters into that canonical branch
  - add real object/folder/assembly transform state paths beside the existing reference path
  - add target-local toolbar ownership for those non-reference transform sessions
- `Transform 3`
  - shared target-local transform shell behavior
  - keep post-commit return inside `Transform > Choose next`
  - keep toolbar/history shell alive across repeated committed transform steps
  - align append-on-commit, lock, and merge semantics across target kinds
- `Transform 4`
  - viewport history visuals, traversal, and finish pass
  - land move-path rendering, scale overlays, rotate direction/angle guides, active-row emphasis, and merge-aligned visual cleanup
  - add traversal / preview / restore behavior
  - finish with any later shared transform-session cleanup only after reference and non-reference target paths have both stabilized

This doc should define that split rather than letting each implementation pass improvise it.

### Public Interfaces And State

Expected eventual state growth:

- `src/app/store/useAppStore.ts`
  - target-specific transform session state for each supported transform target family
  - target-local transform-history ownership
- `src/app/console/stagedNavigation.ts`
  - real `Transform` entries for valid Browser-selected target scopes
  - `Move`, `Rotate`, and `Scale` one level deeper under that branch
- `src/app/console/ConsoleDock.tsx`
  - target-honest transform assist/session handling
- `src/app/components/ViewportOverlay.tsx`
  - target-appropriate transform toolbar surfaces
- `src/app/viewerBridge.ts`
  - target-appropriate viewer session / commit / cancel seams

The exact file ownership can still be broken up by subphase.

### Test Plan

- the Browser family explicitly shows one umbrella transform phase instead of isolated transform follow-ons
- `Transform 1`, `7.4`, and later transform work read as coherent sub-directions under that umbrella
- the long-term Browser vision explicitly includes later transform-history traversal and restore
- the transform family no longer implies that object transform can be solved by a fake redirect into reference transform

### Assumptions / Defaults

- `7.5` is the umbrella Browser transform phase
- `Transform 1` is the reference-first foundation direction
- `7.4` remains the later history traversal / restore direction
- later object transform implementation should be derived from this umbrella direction, not improvised separately
- it is acceptable for later implementation subphases to keep reference and object transform state parallel before any later abstraction cleanup
