# Browser-11.5 - Cross-Parent First-Drop Ordering Parity

## Doc Header

### Doc History
2. 2026-03-29 09:47: Tightened `Browser-11.5 - Cross-Parent First-Drop Ordering Parity` into an implementation-ready Browser follow-on by grounding it in the live `browserContentDrag` preview-versus-commit mismatch, the shared `resolveProjectContentOwnerDrop(...)` same-parent-only reorder rule, and the focused Browser drag regressions that already prove the current cross-parent landing-slot display still commits as plain owner `into`
1. 2026-03-29 09:47: Added `Browser-11.5 - Cross-Parent First-Drop Ordering Parity` as the next Browser follow-on after shipped `11.4`, locking the narrower drag-polish direction that first cross-parent drops into a target owner like `Assembly 1` should land directly at the intended child slot instead of requiring an initial owner-row `into` drop plus a second reorder move

## Doc Body

## Summary

Polish Browser cross-parent drag so the first legal drop into a target owner can land directly at the intended child slot.

Locked outcome:
- dragging an object or movable container toward children inside `Assembly 1` should be able to land directly in the intended slot on that first cross-parent move
- the user should not need to first drop onto the `Assembly 1` owner row and then do a second reorder drag just to get the right initial position
- Browser should keep the same visible `before` / `after` / `into` grammar while making the first cross-parent drop more honest and less fussy
- this phase should stay a drag-polish and drop-resolution pass, not a new hierarchy or owner-model phase

## Why This Phase Exists

After shipped `Browser-11.4`, the ownership and container model is much cleaner:
- object rows can live under real assemblies/components
- category containers like `Shoes` can reparent through the shared owner move seam
- surviving root/category rows now behave through normal owner-facing Browser logic

But one interaction gap still shows up during real use:
- moving into `Assembly 1` works
- but the first cross-parent drop often only succeeds when the user drops directly on the owner row itself
- dropping near the intended child slot inside that target owner still feels less capable than a later same-parent reorder

That means the Browser truth is good, but the first-drop experience still lags behind the visible drag grammar.

## Focus

- keep the current shared drag language:
  - `before`
  - `after`
  - `into`
- make legal cross-parent first drops into a target owner commit directly into the intended child slot when the hover already communicates that slot clearly
- preserve the current shared owner-drop legality seam instead of inventing a second placement-only contract
- stay out of scope of broader runtime/reference redesign

## Current Code Reality

- `src/app/panels/browserContentDrag.ts`
  - already knows how to render a visible landing slot for a legal cross-parent move
  - today it does that by turning a resolved `into` move into a display-only `after` slot when the owner already has visible children
  - that means the preview can look like “land after `Object 1` inside `Assembly 1`” even though the committed drop target is still just `{ assemblyId: 'assembly-1', position: 'into' }`
- `src/app/store/useAppStore.ts`
  - `resolveProjectContentOwnerDrop(...)` only allows `before` / `after` when dragged and target rows already share the same parent
  - cross-parent moves therefore cannot currently commit as true ordered insertion beside a target child on the first drop
  - the store instead falls back to `kind: 'reparent'` with `position: 'into'`
- `src/app/panels/useBrowserPanelController.ts`
  - commits exactly the resolved drop target from the drag session
  - so if preview is showing a landing slot but the drop target still resolves as owner `into`, the commit truth follows `into`, not the visible slot
- `src/app/panels/BrowserPanel.test.tsx`
  - already contains the key regression proving the mismatch:
    - the Browser shows a visible insert line for a legal cross-parent drop
    - the committed move still calls `moveProjectContentOwner(...)` with `{ kind: 'assembly', assemblyId: 'assembly-1', position: 'into' }`

So the real gap is not “the Browser can’t point at a slot.”
The real gap is:
- preview can point at the slot
- commit still only knows “move into that owner”

## Current Interaction Gap

Right now the Browser can truthfully move rows into `Assembly 1`, but the first-drop affordance still has one friction point:
- dropping directly on `Assembly 1` as an owner works
- dropping near a desired insertion position inside `Assembly 1` during that first cross-parent move does not always commit there directly

So the user experience still reads like:
- first drop onto the owner
- then reorder

instead of:
- drag once
- land exactly where intended

## Implementation Direction

- treat this as a drop-resolution and preview-commit alignment pass
- preserve one shared legality contract
- keep the visible Browser grammar honest so the rendered slot guidance matches what the first cross-parent drop will actually do
- prefer refining the current `browserContentDrag` preview/commit resolution and shared owner-drop handling over inventing a special insertion mode

Implementation lock:
- `11.5` should not fake this in the presenter
- it should either:
  - widen the shared drop contract so some cross-parent `before` / `after` drops become legal when they clearly mean “reparent into this owner and insert beside this visible child”
  - or add a tightly-scoped commit remap that converts the displayed cross-parent landing slot into the equivalent ordered move before calling `moveProjectContentOwner(...)`
- whichever path we take, preview and commit must finally agree

## Likely Affected Areas

- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/useAppStore.ts`
- Browser drag regression tests, especially `BrowserPanel.test.tsx`

## First-Pass Direction

- if a cross-parent drag is hovering in a way that visibly communicates a legal slot under `Assembly 1` or another legal owner, commit directly to that slot on drop
- keep owner-highlight-only `into` behavior for the cases where there really is no meaningful visible child slot yet, such as empty or collapsed owners
- do not break same-parent reorder or already-shipped container/object move behavior while tightening first-drop ordering

Preferred first pass:
- keep empty/collapsed owner drops as plain `into`
- only upgrade cross-parent first-drop ordering when:
  - the target owner already has visible children
  - the Browser is already showing a clear slot beside a concrete anchor row
- preserve current same-parent reorder semantics unchanged

## Scope

This phase covers:
- cross-parent first-drop ordering inside a legal target owner
- preview-versus-commit alignment for those drops
- keeping the current shared drag grammar while making first landing order more trustworthy

This phase does not cover:
- new owner-model work
- new hierarchy structure
- runtime/reference redesign
- multi-row drag

## Test Plan

- `BrowserPanel.test.tsx`
  - update the existing cross-parent landing-slot regression so the committed move now matches the visible slot instead of plain owner `into`
  - keep the collapsed/empty owner regression proving those cases still commit as `into`
  - add at least one object move and one movable container move proving first-drop ordering parity under `Assembly 1`
- store/controller coverage
  - verify same-parent reorder behavior stays unchanged
  - verify first cross-parent ordering only applies when there is a real visible anchor child to order against
- regression boundary
  - no change to illegal-target rules
  - no regression to already-shipped category-container drag parity
  - no new special drag grammar for reference-backed rows

## Expected Result

- moving `Shoe 1 GLB`, `Large.step`, or a movable grouping row into `Assembly 1` should be able to land directly at the intended child position on the first drop when the Browser is already showing that target clearly
- the Browser should feel less like `drop into owner first, then reorder`
- the Browser should feel more like one honest drag system across same-parent reorder and cross-parent landing
