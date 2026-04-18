# [x] `Catalog-1.12` - `Item Card Add To Project Action`

## Doc Header

### Doc History
6. 2026-04-18 09:20:47: Implemented `Catalog-1.12 / Phase 2 - Grid Scroll Ownership And Edge Padding Reduction`, widening the shared Catalog shell with one explicit content-body scroll owner, removing the old slotted-shell outer padding assumption, and adding focused `CatalogSurface.test.tsx` proof that the shell now exposes owned scrolling inside the surface without reopening preview, commit, or item-page behavior
5. 2026-04-18 09:13:54: Prepped `Catalog-1.12 / Phase 2 - Grid Scroll Ownership And Edge Padding Reduction` for implementation, grounding the next cut in the live `catalog.css` shell where `.CatalogShell` still carries the outer `padding: 16px`, `.CatalogShellContent` still lacks explicit overflow ownership, `CatalogSurface.tsx` still hosts the shell directly without a separate layout wrapper, and `CatalogSurface.test.tsx` still has no layout proof for internal scroll or split-edge fit so the next pass can stay a small CSS-first shell polish instead of drifting into behavior or action changes
4. 2026-04-18 09:00:00: Added `Catalog-1.12 / Phase 2 - Grid Scroll Ownership And Edge Padding Reduction`, reopening this follow-up branch as a narrow Catalog UI polish pass after shipped `Phase 1` so the grid or content area can own vertical scrolling inside the workspace surface and the outer Catalog shell can stop carrying the extra split-pane edge padding that currently keeps the content from reaching the viewport boundary cleanly
3. 2026-04-18 08:51:00: Implemented `Catalog-1.12 / Phase 1 - Item Card Add To Project Button`, threading the existing `CatalogShell.tsx` add-to-project dispatch seam into `CatalogShellGridMode.tsx`, exposing a direct card-row `Add To Project` affordance only for eligible repo-backed reference entries, and widening `CatalogSurface.test.tsx` so the new direct grid-card commit path is proven against the same downstream Browser-project owner while imports reuse and environment entries stay non-committable from the grid
2. 2026-04-18 08:37:44: Prepped `Catalog-1.12 / Phase 1 - Item Card Add To Project Button` for implementation, grounding the next cut in the live `CatalogShellGridMode.tsx` card action row that still only renders `Open Item Page`, the existing `CatalogShell.tsx` `onAddItemToProject` dispatch seam that is not yet threaded down into the grid, the shipped `catalogActionPlan.ts` `add-to-project` eligibility logic, and the current `CatalogSurface.test.tsx` proof that still only covers the item-page commit path so the next pass stays one narrow card-action affordance plus proof update
1. 2026-04-18 08:29:12: Added this standalone `Catalog-1.12` future doc to compress the next small Catalog foundation follow-up into its own implementation-ready planning surface, locking one first internal phase for adding a direct `Add To Project` button to eligible Catalog item cards while reusing the already-shipped action-plan and Browser-project commit-handoff seams instead of reopening preview-session or item-page ownership

### Purpose

This doc defines the next small follow-up after the shipped `Catalog-1 / Phase 11.x` ownership work.

Use it to answer:
- how grid cards should expose a direct `Add To Project` action without forcing the item page first
- which existing Catalog commit seams should be reused instead of reinvented
- how to keep card-level commit separate from preview loading, item-page ownership, and environment apply behavior

### Why This Phase Exists

`Catalog-1` already proved the honest repo-backed commit path:
- `catalogActionPlan.ts` can resolve eligible reference items to `Add To Project`
- `catalogReferenceCommit.ts` can translate that into one explicit Browser/project handoff
- `CatalogSurface.tsx` can route the request into downstream project-owned truth

But that explicit commit path is still mainly surfaced through the item page.

The grid now has:
- direct selection
- preview-box loading
- double-click item-page open

So the next small foundational cleanup is to let eligible cards expose the same explicit commit action directly in the card action row when that action already exists.

### Scope

This doc covers:
- a direct `Add To Project` button on eligible Catalog grid cards
- reuse of the existing repo-backed action-plan and commit-routing seams
- focused proof that grid-card commit still becomes downstream Browser/project truth
- follow-up Catalog shell polish for owned scrolling and split-edge padding reduction

This doc does not cover:
- preview-session redesign
- item-page action redesign
- multi-select batch commit behavior
- environment-apply card actions
- later family-specific widening for `Catalog-2`, `Catalog-3`, or `Catalog-4`

## Doc Body

### Goal

Let eligible Catalog item cards expose one honest direct `Add To Project` action so users can commit obvious repo-backed reference items straight from the grid while keeping preview temporary, keeping the item page useful as the deeper decision surface, and keeping committed truth downstream of Catalog.

### Boundaries

This phase should:
- only expose the card button for items whose resolved action plan already supports `add-to-project`
- reuse the existing `browser-project` handoff path instead of inventing a parallel commit seam
- keep preview-box click behavior separate from card commit behavior
- preserve the item page as the larger preview and description surface

This phase should not:
- make every card action path conditional in ad hoc UI logic
- widen into environment items or `apply-environment` card actions
- widen into imports reuse getting a second commit path
- turn multi-select into batch `Add To Project` behavior

### Architecture Direction

The healthy read for this phase is:
- `catalogActionPlan.ts` still decides whether a card is eligible for `Add To Project`
- `CatalogShell.tsx` still owns local action dispatch
- `CatalogShellGridMode.tsx` only gains one clearer card affordance
- `CatalogSurface.tsx` still remains the handoff point into downstream Browser/project truth

The healthy product read is:
- a card can still be selected with direct click
- a card preview box can still load temporary preview
- a card can still open the item page
- eligible repo-backed cards can now also commit directly from the grid
- preview is still not commit

### Current Live Read

The current shipped seams already make this follow-up small:

- `src/app/catalog/catalogActionPlan.ts`
  - already resolves repo-backed reference items to `Add To Project`
  - already keeps imports reuse and environment items on their own separate action meanings
- `src/app/catalog/catalogReferenceCommit.ts`
  - already owns the explicit repo-backed commit request shape
- `src/app/catalog/ui/CatalogShell.tsx`
  - already owns the `onAddItemToProject` callback handoff
  - already coordinates grid actions, selection, and preview-session behavior
  - does not yet thread a card-level add handler into `CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already owns the visible card action row
  - currently still only exposes `Open Item Page` there
- `src/app/workspace/CatalogSurface.tsx`
  - already routes repo-backed commit into downstream Browser/project truth
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the item-page commit path
  - still reads through `Open Item Page` plus item-page `Add To Project` assertions rather than a direct grid-card commit assertion
  - is the strongest nearby proof owner for the new direct card action

So the remaining gap is narrow:
- surface the already-shipped commit meaning on eligible grid cards
- prove it uses the same downstream handoff

### Acceptance Read

`Catalog-1.12` is healthy when:
- eligible repo-backed cards show a direct `Add To Project` button
- clicking that button reuses the same explicit downstream Browser/project handoff as the item page
- preview-box behavior, selection behavior, and item-page behavior all remain intact
- imports reuse and environment entries do not gain fake card-level commit behavior

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. Eligible Grid Cards Can Commit Directly`
- [x] `HLG 2. Grid Commit Reuses The Existing Browser-Project Handoff`
- [x] `HLG 3. Preview, Selection, And Item-Page Boundaries Stay Intact`
- [x] `HLG 4. Catalog Content Owns Its Scroll And Split-Edge Fit`

### `Catalog-1.12 Phase 1`

- [x] `1. Eligible Cards Show A Direct Add To Project Button`
- [x] `2. The Grid Button Reuses The Existing Catalog Commit Handoff`
- [x] `3. Preview-Box, Selection, And Open-Item-Page Gestures Stay Separate`
- [x] `HLG 1. Eligible Grid Cards Can Commit Directly`
- [x] `HLG 2. Grid Commit Reuses The Existing Browser-Project Handoff`
- [x] `HLG 3. Preview, Selection, And Item-Page Boundaries Stay Intact`

### `Catalog-1.12 Phase 2`

- [x] `4. The Grid Or Content Area Owns Vertical Scroll Inside The Catalog Surface`
- [x] `5. The Outer Catalog Shell Stops Carrying The Extra Split-Edge Padding`
- [x] `6. Scroll And Edge-Fit Polish Do Not Reopen Commit, Preview, Or Item-Page Ownership`
- [x] `HLG 4. Catalog Content Owns Its Scroll And Split-Edge Fit`

## [x] `Catalog-1.12` - `Phase 1 - Item Card Add To Project Button`

### Summary

This phase adds one direct `Add To Project` button to eligible Catalog grid cards.

It should stay small and reuse the already-shipped action-plan and commit-routing seams instead of reopening preview ownership, item-page action meaning, or downstream Browser/project ownership.

### Implementation Spec
#### Exact First Code Cut

1. Widen the grid-card action row in `CatalogShellGridMode.tsx` so eligible items can render `Add To Project` alongside the existing `Open Item Page` affordance.
2. Thread the existing `CatalogShell.tsx` `onAddItemToProject` dispatch seam into `CatalogShellGridMode.tsx` instead of creating a new direct store write or card-local commit helper.
3. Keep the card preview box, selection click, and double-click-to-open item-page gestures separate from the new commit button.
4. Add focused proof in `CatalogSurface.test.tsx` that card-level `Add To Project` reuses the same downstream Browser/project path and that ineligible cards do not show the button.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/theme/surfaces/catalog.css` only if the card action row needs a small layout adjustment

#### No-Widening Rule

- do not reopen `catalogReferenceCommit.ts` unless a tiny adapter refinement is truly needed
- do not widen into item-page redesign
- do not add environment apply or imports commit affordances to cards
- do not turn this phase into multi-select batch commit behavior

#### Implementation Risks

- duplicating action eligibility logic in the grid instead of reusing the resolved action plan
- accidentally letting imports reuse or environment entries expose a fake `Add To Project` button
- making the card action row too crowded and reopening unrelated card-layout polish

#### Checklist

- [x] eligible grid cards show `Add To Project`
- [x] the grid button reuses the existing downstream Browser/project handoff
- [x] ineligible cards keep their current non-commit behavior
- [x] focused Catalog surface proof covers the new card action path

#### Verification Shape

Minimum verification for this phase should cover:

- at least one eligible repo-backed card shows `Add To Project`
- clicking the grid button creates the same downstream committed result as the item-page path
- imports reuse and environment items do not expose the grid commit button

#### Done Shape

`Phase 1` is done when:

- direct grid-card `Add To Project` exists for eligible items
- the path clearly reuses the existing Catalog-to-Browser/project commit seam
- preview, selection, and item-page responsibilities stay intact

## [x] `Catalog-1.12` - `Phase 2 - Grid Scroll Ownership And Edge Padding Reduction`

### Summary

This phase treats the next follow-up as a narrow Catalog UI polish pass.

It should fix the current usability issue where the grid or item-page content can run below the visible browser or split-pane area without an owned internal scrollbar, and it should remove the extra outer padding that currently keeps the Catalog shell from sitting flush to the viewport edge when split.

### Phase 2 Research Read
#### Current Live Read

The current shipped Catalog shell makes the likely source of the issue fairly clear:

- `src/app/theme/surfaces/catalog.css`
  - `.CatalogShell` currently uses `min-height: 100%` plus `padding: 16px`
  - `.CatalogShellContent` currently carries interior padding but no explicit overflow ownership
  - the card grid and item page can therefore grow taller than the visible split surface without a dedicated scrolling owner in the content lane
- `src/app/workspace/CatalogSurface.tsx`
  - currently renders the Catalog shell directly inside `.CatalogSurface`
  - does not add a separate host wrapper that would own scroll or neutralize outer shell padding
- current Catalog proof
  - `CatalogSurface.test.tsx` currently proves browse, preview, commit, and item-page behavior
  - does not yet prove that the content lane owns scroll or that the Catalog shell reaches the split viewport edge cleanly

So the first honest implementation read is:
- `catalog.css` should stay the primary owner
- `CatalogShell.tsx` should only widen if one extra wrapper or region class is truly necessary
- `CatalogSurface.tsx` should stay thin unless the surface host itself needs one narrow layout class
- `CatalogSurface.test.tsx` should carry one light-touch layout proof instead of turning this into browser-size visual testing

So the likely problem is not Catalog data or action logic.

It is the current shell-box sizing and overflow ownership:
- the outer shell still carries the visible frame padding
- the content lane does not yet own its vertical scroll behavior

#### First Pass Decisions

- treat this as UI polish only
- prefer one explicit scroll owner in the Catalog content lane instead of relying on page-level overflow
- remove or neutralize the outer split-edge padding at the Catalog shell boundary rather than fighting it deeper in card or item-page children
- keep the browse rail and content rail ownership explicit instead of scattering overflow fixes across many inner descendants
- stop at scroll and edge-fit polish without reopening card actions, preview-session logic, or item-page behavior

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Rework the outer Catalog shell box sizing so the shell can fill the workspace surface without the current extra split-edge padding.
2. Give the Catalog content lane one explicit vertical scroll owner so tall grid and item-page content stay reachable inside the surface instead of running off the browser page.
3. Keep the browse rail and preview-session rail behavior stable while the content lane gains the new scroll ownership.
4. Add focused Catalog surface proof that the visible shell now exposes one explicit content scroll owner and that the outer shell no longer carries the old split-edge padding assumption.

#### Likely Files

- `src/app/theme/surfaces/catalog.css`
- `src/app/catalog/ui/CatalogShell.tsx` only if one additional scroll wrapper or region class is truly needed
- `src/app/workspace/CatalogSurface.tsx` only if the surface host needs one narrow layout class or container adjustment
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen `Add To Project` routing
- do not widen into card-layout redesign beyond what scroll and edge-fit polish truly requires
- do not mix this with preview-session relocation or item-page feature changes
- do not solve the problem with page-level overflow hacks when the correct owner is the Catalog shell or content lane

#### Implementation Risks

- putting overflow on the wrong container and creating double-scroll behavior
- fixing the split-edge padding only for one mode while leaving floating or narrow-layout behavior inconsistent
- reopening card spacing or shell styling broadly instead of keeping the change scoped to scroll ownership and outer edge fit

#### Checklist

- [x] the grid or content lane owns vertical scrolling inside the Catalog surface
- [x] the outer Catalog shell no longer carries the extra split-edge padding
- [x] the scroll fix stays local to Catalog shell layout ownership
- [x] focused Catalog surface proof covers the new layout behavior

#### Verification Shape

Minimum verification for this phase should cover:

- tall Catalog content remains reachable inside the surface through an owned internal scrollbar
- the Catalog shell reaches the split viewport edge without the current extra outer padding
- existing preview, selection, item-page, and commit behavior still render inside the polished layout

#### Done Shape

`Phase 2` is done when:

- the Catalog content area owns its vertical scroll behavior
- the outer shell fits the split viewport edge more cleanly
- the fix lands as local Catalog UI polish without reopening behavior ownership seams
