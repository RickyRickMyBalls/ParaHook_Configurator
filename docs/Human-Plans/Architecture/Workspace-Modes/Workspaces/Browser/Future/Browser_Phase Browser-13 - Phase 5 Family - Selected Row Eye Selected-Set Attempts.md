# Browser Phase Browser-13 - Phase 5 Family - Selected Row Eye Selected-Set Attempts

## Doc Header

### Doc History
5. 2026-04-16 00:54: Closed this family doc after live confirmation that `Atempt 3 Phase 2` fixed the selected reference-backed object eye repro, reframing the document as retained shipped-attempt history instead of an active unresolved debugging surface
4. 2026-04-16 00:52: Implemented `Atempt 3 Phase 2` in the Browser reference-eye path by resolving selected `referenceIds` from shared selection truth instead of row-target key flavor, adding grouped-row fallback for narrower explicit target sets, and landing focused proof in `browserInteractions.test.ts` and `BrowserPanel.test.tsx`
3. 2026-04-16 00:47: Filled the new `Atempt 3 Phase 1` and `Atempt 3 Phase 2` sections at the end of this family doc, splitting Attempt 3 into a proof-first routing slice and a follow-on implementation slice, and tightening `Atempt 3 Phase 2` into implementation-prep shape around selected reference-id fan-out in the Browser reference-eye path
2. 2026-04-16 00:31: Set up `Attempt 3` around the newly confirmed live repro on reference-backed object rows after checking Browser eye routing, Console selected-set resolution, and workspace selection ownership, recording that reference-backed object eyes currently route through the reference-visibility handler while `resolvedContentSelection` for imported-reference object targets carries neither `partKeys` nor grouped row membership, which explains why earlier content-visibility fan-out attempts never fixed this case
1. 2026-04-16 00:24: Created this Phase 5 family doc after multiple implementation attempts failed to reproduce the intended live Browser behavior, so Browser-13 can track the selected-row-eye problem, what we already tried, why those attempts were insufficient, and what to inspect next without rewriting the same context in chat

### Purpose

This is the retained attempt-history doc for `Browser-13 - Phase 5`.

Use it to:
- track each concrete implementation attempt against the selected-row-eye problem
- preserve the difference between passing targeted tests and the live repro that stayed broken until `Atempt 3 Phase 2`
- keep one stable record of the debugging path, shipped seam, and why the final fix was narrower than the earlier attempts
- avoid losing the shipped Phase 5 implementation history across chat turns now that the behavior is closed

## Doc Body

## [x] Browser-13 - Phase 5 Family - Selected Row Eye Selected-Set Attempts

### Parent Phase

- umbrella phase:
  - `Browser_Phase Browser-13 - UI Clean Polish And Cleanup.md`
- tracked ladder item:
  - `Browser-13 - Phase 5 - Selected Row Eye Acts On The Current Selected Content Set`

### Locked Problem Statement

When the user has a meaningful current content selection from Browser or viewport and clicks the normal hide or show eye on one selected eligible row, the Browser eye should act like `hide/show selected content`, not like `hide/show only this one row`.

The intended behavior remains:
- if the clicked eligible `Assembly`, `Component`, or `Object` row is part of the current selected content set, its clicked eye defines the target visibility state for that selected content set
- if the clicked row is outside the current selected content set, Browser keeps ordinary single-row eye behavior

### Confirmed Live Symptom

This family doc started because live use was still failing:
- user multi-selected objects in Browser
- user clicked the eye on one of those selected objects
- only the clicked object hid instead of the full selected set

The narrowed live repro that ultimately mattered was:
- reference-backed object rows
- Browser multi-selection on those rows
- clicked selected eye only hiding the clicked reference object

Closed result:
- that repro is now fixed in live use
- selected reference-backed object eyes now apply the clicked hide/show intent across the eligible selected reference set

### What This Family Owns

- tracking each attempted Browser-eye implementation for Phase 5
- recording what each attempt assumed about selection truth
- recording where test proof diverged from live behavior
- keeping the current recommended next inspection path explicit before another code attempt lands

### What This Family Does Not Own

- shipping Phase 5 by itself
- redefining Browser-13 scope
- inventing new visibility semantics or new row kinds
- replacing the umbrella Browser-13 doc

### Attempt Ledger

#### Attempt 1 - Browser-Row-Local Fan-Out

- implementation direction:
  - treat the Browser eye as selection-aware by fanning out from currently selected Browser rows and Browser explicit selected targets
- key seam:
  - `src/app/panels/browserInteractions.ts`
- why it looked plausible:
  - Browser already decorates rows with selection state
  - explicit selected targets already existed in workspace selection
- result:
  - targeted tests passed
  - live Browser behavior still only hid the clicked row
- current read on why it was insufficient:
  - it trusted Browser-row-local selection reconstruction more than the app's canonical selected-content payload
  - it likely matched synthetic test setup better than live cross-surface selection truth

#### Attempt 2 - `resolvedContentSelection`-First Object Fan-Out

- implementation direction:
  - move object-row eye fan-out toward `workspaceSelection.resolvedContentSelection.partKeys`
  - keep authored `Assembly` / `Component` fan-out anchored to explicit selected roots so parent rows would not accidentally widen selection through overlapping aggregate visibility keys
- key seams:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/panels/browserInteractions.ts`
- added proof:
  - focused interaction tests
  - BrowserPanel coverage for narrower explicit-target cases
- result:
  - targeted tests passed again
  - user still reported the live Browser only hid the clicked row
- current read on why it was still insufficient:
  - either the live click path is still not receiving a trustworthy multi-item selected-content payload at click time
  - or the clicked-row membership test still does not match the real row/state shape used in the live Browser
  - or the test harness still models selection and payload synchronization more optimistically than the real app

#### Attempt 3 - Reference-Backed Object Selected-Eye Proof And Reference-Id Fan-Out

- implementation direction:
  - start from the confirmed live repro on reference-backed object rows instead of generic object rows
  - prove the exact click path and selected payload for one selected reference-object eye click before widening behavior again
  - treat this as a reference-visibility selected-set problem first, not as another content-visibility fan-out patch
- key seams to inspect first:
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/console/ConsoleDock.tsx`
- why this attempt exists:
  - the current user repro is specifically on reference objects
  - reference-backed object eyes currently route through `onToggleReferenceVisibility`, not `onToggleContentVisibility`
  - previous Phase 5 attempts mainly widened the content-visibility path, so they never fully owned this reference-object eye path
- locked Attempt 3 question:
  - when the user clicks the eye on one selected reference-backed object row, should Browser resolve the full selected reference-object set through shared selected-target/reference-id truth and apply the clicked hide or show intent across that reference-id set?
  - suggested answer:
    - yes
    - this should be the first concrete live-fix target for Attempt 3

### What We Learned

- passing narrow Browser interaction tests is not enough for this phase
- BrowserPanel mock selection proof can still miss live-state differences
- the Console path proving grouped hide works is a strong clue that the main gap is not the raw ability to hide many items, but the Browser eye's live handoff into that same selection truth
- `workspaceSelection.resolvedContentSelection` is still the best architectural direction, but the app needs stronger proof about the actual payload present at the moment the Browser eye is clicked
- reference-backed objects expose an even narrower seam:
  - Browser routes their eye through the reference-visibility handler
  - `resolvedContentSelection` for imported-reference object targets currently resolves to empty `partKeys` and empty `groupedRowIds`
  - Console grouped behavior already supplements selected content with `referenceIds` derived from selected targets through `resolveReferenceIdsForWorkspaceTarget(...)`

### Current Best Hypothesis

The unresolved bug is probably one of these:
- Browser or viewport multi-selection is not populating `workspaceSelection.resolvedContentSelection` the way Phase 5 assumes at the exact moment the eye handler runs
- the Browser eye handler is receiving the right payload, but the live clicked row cannot be matched back into that payload using the current row membership logic
- there is a stale or lagging handoff between visible Browser row VMs and workspace selection state, so the click is evaluated against older selection truth than the user sees

For the current narrowed repro, the most likely cause is even more specific:
- the clicked reference-backed object eye is entering `handleToggleReferenceVisibility(...)`
- that handler still only toggles the clicked `referenceId`
- the shared selected-content payload used by Attempt 2 does not currently carry the reference ids needed to fan that action across the selected reference-object set

### Why Existing Tests Were Not Sufficient

- they proved intended routing under controlled state
- they did not fully prove the real live selection payload at click time
- they were better at verifying handler logic than at verifying Browser-to-store synchronization in the actual app flow
- at least one earlier BrowserPanel mock path widened object multi-select membership more generously than the live store, which made Phase 5 easier to satisfy in tests than in reality
- they also did not center the real reference-object eye routing path:
  - the live selected reference-object eye currently routes through the reference handler
  - the earlier implementation work concentrated on the content handler

### Recommended Next Step Before Another Code Attempt

Do not start with another blind fan-out patch.

Instead:
1. inspect the real `workspaceSelection` payload at the exact moment a selected Browser eye is clicked
2. verify:
   - `selectedTarget`
   - `explicitSelectedTargets`
   - `resolvedContentSelection`
   - clicked row `rowId`
   - clicked row `visibilityPartKeys`
   - clicked row `referenceId`
   - whether the eye routed through `handleToggleReferenceVisibility(...)` or `handleToggleContentVisibility(...)`
3. compare that live payload for:
   - Browser-origin multi-select
   - viewport-origin grouped selection
   - the same selected set through the Console path that already works
   - specifically for reference-backed object rows
4. only after that, decide whether the real fix belongs in:
   - selection synchronization
   - selected-target to `referenceIds` resolution
   - clicked-row membership resolution
   - the Browser reference or content eye interaction handler

### Suggested Next Implementation Slice

The next real attempt should be framed as:
- `Phase 5 Attempt 3 - Reference-Backed Object Eye Uses Selected Reference Set`

That attempt should aim to answer:
- is `resolvedContentSelection` correct when the eye is clicked
- is the clicked reference-object eye actually entering the reference visibility path
- what shared selected-target or selected-content payload already exposes the full selected reference-id set
- whether Browser should reuse the Console-style `resolveReferenceIdsForWorkspaceTarget(...)` path for selected reference-object eye fan-out

### Attempt 3 Prep

- locked live starting point:
  - reproduce on multi-selected reference-backed object rows first
- key code facts already confirmed:
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - reference-backed object rows are treated as `isReferenceVisibilityRow`
    - their eye invokes `onToggleReferenceVisibility?.(row)`
  - `src/app/panels/browserInteractions.ts`
    - `handleToggleReferenceVisibility(...)` still toggles only the clicked `referenceId`
    - `handleToggleContentVisibility(...)` contains the earlier selected-set fan-out attempts, but that is not the primary seam for this repro
  - `src/app/store/useAppStore.ts`
    - `resolveOwnedContentSelection(...)` for imported-reference object targets returns empty `partKeys` and empty `groupedRowIds`
    - that means `resolvedContentSelection` alone cannot currently describe the selected reference-object set strongly enough for this eye path
  - `src/app/console/ConsoleDock.tsx`
    - the Console selected-set path already derives grouped `referenceIds` from selected targets through `resolveReferenceIdsForWorkspaceTarget(...)`
- focused test gap already confirmed:
  - `src/app/panels/browserInteractions.test.ts` currently has no selected reference-object eye fan-out proof
  - the current interaction proof only covers:
    - clicked single reference rows
    - content-row selected-set fan-out
    - authored parent reference-backed membership
  - that means Attempt 3 should add the reference-object selected-eye case explicitly instead of treating it as covered by the generic object tests
- implementation-prep that matters:
  - the live repro does not require reopening generic content-row fan-out first
  - the first implementation seam should stay inside the Browser eye interaction layer:
    `browserTreeRowPresenter.tsx -> handleToggleReferenceVisibility(...)`
  - selected reference ids should come from shared workspace selected-target truth, not Browser row highlighting
  - `resolveReferenceIdsForWorkspaceTarget(...)` is already the existing shared helper that knows how to derive reference ids from:
    - explicit `reference-item` targets
    - reference-backed `object` targets
    - selected `component` / `assembly` targets
  - because imported-reference object targets currently resolve to empty `partKeys` and empty `groupedRowIds`, Attempt 3 should not block on widening `resolvedContentSelection` before shipping the reference-object fix
- locked Attempt 3 in-scope:
  - selected-eye hide or show fan-out for reference-backed object rows
  - resolving the selected reference set from shared selected targets or a shared reference-id helper
  - preserving one-row reference-eye behavior when the clicked row is not part of a meaningful selected reference set
  - adding focused interaction and Browser-level regression proof for selected reference-object eye fan-out
- locked Attempt 3 out-of-scope:
  - another generic content-row fan-out rewrite
  - widening every Phase 5 row family at once
  - changing Browser selection rules
  - inventing a Browser-only selected reference state
  - broad `WorkspaceResolvedContentSelection` redesign unless the reference-id helper path proves insufficient
- preferred Attempt 3 direction:
  1. prove the clicked selected reference-object eye goes through `handleToggleReferenceVisibility(...)`
  2. resolve the selected reference-object set from shared selected targets using `resolveReferenceIdsForWorkspaceTarget(...)` or an equivalent shared helper
  3. if the clicked reference object belongs to a meaningful selected reference set, use its clicked eye state to hide or show that whole selected reference-id set
  4. preserve single-row reference-eye behavior when the clicked row is outside the selected set or the set contains only one item
  5. only widen `WorkspaceResolvedContentSelection` if that turns out to be the cleaner long-term shared payload than deriving selected `referenceIds` from the selected targets
- concrete implementation targets:
  - `src/app/panels/browserInteractions.ts`
    - first implementation target
    - `handleToggleReferenceVisibility(...)` likely needs a selected-reference fan-out branch before the current clicked-row-only toggle
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - likely should remain unchanged
    - only inspect if the clicked reference-object eye is not actually routing where the current code says it should
  - `src/app/store/useAppStore.ts`
    - use existing `resolveReferenceIdsForWorkspaceTarget(...)` if possible
    - only widen shared selected-content payload shape if the helper path is not enough
  - `src/app/panels/browserInteractions.test.ts`
    - add focused proof for:
      - selected imported-reference object eye hides all selected reference ids
      - clicked unselected imported-reference object eye still hides only one
  - `src/app/panels/BrowserPanel.test.tsx`
    - add a Browser-level repro test using reference-backed object rows, not only authored object rows
- success condition:
  - selected reference-backed object eye now behaves like `hide/show selected reference objects`
  - one clicked selected reference-backed object eye hides or shows the full selected eligible reference set
  - one clicked unselected reference-backed object eye still behaves like a normal single-row reference toggle
  - authored object selected-eye behavior does not regress while this narrower reference fix lands
- focused verification goals:
  - Browser multi-select reference objects plus clicked selected `Hide` eye:
    all selected eligible reference objects hide
  - Browser multi-select reference objects plus clicked selected `Show` eye:
    all selected eligible reference objects show
  - clicked unselected reference object eye:
    only that one reference object toggles
  - ordinary authored object eye behavior does not regress
  - Console grouped hide/show semantics still align with the Browser reference-object eye path

### Exit Criteria For Closing This Family Doc

This family doc is now closed because all of the following are true:
- Browser-origin multi-select plus clicked selected eye hides or shows the full eligible selected set in live use
- the selected reference-backed object repro that drove `Atempt 3` is confirmed fixed
- focused interaction and Browser tests now match the shipped reference-eye path closely enough to hold the regression
- the remaining Browser-13 work is no longer blocked on this selected-row-eye failure

## Atempt 3 Phase 1

- name:
  - `Atempt 3 Phase 1 - Prove The Live Reference-Backed Eye Route And Selected Reference Set`
- purpose:
  - narrow Attempt 3 to one proof-first slice before changing behavior again
  - confirm the exact live eye route and the exact selected-set payload for the current failing reference-object repro
- locked direction:
  - treat this as a trace-and-proof phase, not a behavior phase
  - verify the real live seam before modifying `handleToggleReferenceVisibility(...)`
  - preserve the current Browser eye behavior while gathering the proof
- what this phase proved:
  - reference-backed object rows are rendered as reference-visibility rows in `browserTreeRowPresenter.tsx`
  - their eye invokes `onToggleReferenceVisibility?.(row)`, not `onToggleContentVisibility?.(row)`
  - the current reference visibility handler still toggles only the clicked `referenceId`
  - `resolveOwnedContentSelection(...)` for imported-reference object targets does not currently provide the `partKeys` or grouped row membership needed to describe the selected reference-object set by itself
  - the Console path already resolves grouped `referenceIds` from shared selected targets through `resolveReferenceIdsForWorkspaceTarget(...)`
- shipped result:
  - Attempt 3 is now grounded on the real failing seam instead of the earlier generic content-row seam
  - we no longer need to guess whether the reference-object repro is entering the content visibility handler
  - the next implementation slice can target selected reference-id fan-out directly
- concrete read that Phase 1 locked:
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/console/ConsoleDock.tsx`
- exit condition:
  - complete
  - this proof work is already captured in this family doc and does not need more code before Phase 2 starts

## Atempt 3 Phase 2

- name:
  - `Atempt 3 Phase 2 - Selected Reference-Backed Object Eye Fans Out Across The Selected Reference Set`
- purpose:
  - implement the real live fix for the current failing repro:
    selected reference-backed object rows should hide or show together when the user clicks the eye on one selected reference-backed object row
- locked direction:
  - keep this slice reference-eye-local:
    do not reopen generic content-row fan-out here
  - reuse shared selected-target truth to derive the selected reference-id set
  - keep single-row reference-eye behavior exactly as-is when the clicked row is not part of a meaningful selected reference set
  - keep the Browser eye surface unchanged:
    fix the behavior behind the existing eye instead of adding a new control
- why this phase exists:
  - `Atempt 3 Phase 1` proved the current repro is entering the reference visibility path
  - earlier Phase 5 implementation work mainly widened the content visibility path, which cannot fully fix the live reference-object case
  - the Console path already demonstrates that grouped reference visibility can be derived from shared selected targets
- implementation-prep that matters:
  - the first implementation target should be `src/app/panels/browserInteractions.ts`
  - specifically:
    `handleToggleReferenceVisibility(...)` needs a selected-set branch ahead of the clicked-row-only toggle
  - selected reference ids should be resolved from shared selected targets through `resolveReferenceIdsForWorkspaceTarget(...)` or one shared helper built from the same truth
  - the clicked row should only decide:
    - whether the action is `Hide` or `Show`
    - whether the clicked reference row belongs to the selected reference set
  - if the selected set contains more than one eligible selected reference id and includes the clicked row, the handler should fan that one explicit target state across the selected reference ids
  - if not, the handler should preserve the existing clicked-row-only reference toggle behavior
  - do not block this slice on redesigning `WorkspaceResolvedContentSelection`
  - if we later want one shared payload for all row families, that can remain follow-on work after the reference-object fix ships
- preferred implementation shape:
  1. Start in `handleToggleReferenceVisibility(row)`.
  2. Resolve the current explicit selected targets from workspace selection.
  3. Derive selected `referenceIds` from those shared targets using the same reference-id ownership rules the app already trusts elsewhere.
  4. Confirm the clicked reference-backed row's `referenceId` is inside that selected reference-id set.
  5. If the selected reference-id set is meaningful and not ambiguous, apply the clicked eye's explicit target state to the full selected reference-id set through `setReferenceItemVisibility(...)`.
  6. Otherwise preserve the current single-row reference toggle.
- locked in-scope:
  - selected-eye hide or show fan-out for reference-backed object rows
  - selected-eye hide or show fan-out for direct imported reference rows if they share the same reference handler and selected-reference truth
  - shared selected-target to `referenceIds` resolution
  - focused interaction and Browser-level regression proof for the reference-eye selected-set path
- locked out-of-scope:
  - generic authored-object selected-eye fan-out
  - another `resolvedContentSelection` redesign
  - Browser row-menu batch visibility changes
  - Browser selection model changes
  - new visibility semantics for unsupported row kinds
- concrete implementation targets:
  - `src/app/panels/browserInteractions.ts`
    - add selected-reference fan-out ahead of the clicked-row-only reference toggle
  - `src/app/store/useAppStore.ts`
    - reuse `resolveReferenceIdsForWorkspaceTarget(...)` if possible
    - only add a new helper if the interaction layer needs a cleaner shared selected-reference resolver
  - `src/app/panels/browserInteractions.test.ts`
    - add focused proof for selected imported-reference object eye fan-out
    - add proof that clicked unselected reference rows still only toggle themselves
  - `src/app/panels/BrowserPanel.test.tsx`
    - add a Browser-level regression for selected reference-backed object eye hide/show
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - likely unchanged unless the routed handler needs a different call shape
- verification goals:
  - Browser multi-select reference-backed objects plus clicked selected `Hide` eye:
    all selected eligible reference ids hide
  - Browser multi-select reference-backed objects plus clicked selected `Show` eye:
    all selected eligible reference ids show
  - clicked unselected reference-backed object eye:
    only that one reference id toggles
  - direct reference rows that share the same handler remain predictable
  - ordinary authored object eye behavior does not regress
- implementation result:
  - `handleToggleReferenceVisibility(...)` now resolves selected `referenceIds` from shared selection truth instead of depending on object-vs-reference target key matching
  - the selected reference set can now fan out from:
    - explicit selected reference/object targets
    - grouped selected row ids when that shared selected-content payload is stronger than the explicit target list
  - the clicked row still falls back to the original single-row toggle when its `referenceId` is not part of a meaningful selected reference set
  - focused proof now exists for:
    - selected reference-backed object eye fan-out from reference-item selection targets
    - grouped selected reference-row fallback when explicit targets are narrower
    - Browser-level imported reference row eye fan-out across a visible Browser multi-selection
- success condition:
  - the user can select reference objects `1-10` in Browser, click the eye on `Object 1`, and all selected eligible reference objects hide together
  - the same selected-set path can show them again from one selected reference-object eye click when they are all hidden
  - the live Browser now matches the expected reference-object behavior instead of only hiding the clicked row
