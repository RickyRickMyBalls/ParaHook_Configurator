# Browser Phase Browser-13 - Phase 6 - Part Row Eyeballs In Browser

## Doc Header

### Doc History
2. 2026-04-16 01:01: Broke `Browser-13 - Phase 6` into smaller codex-friendly subphases with dedicated `Phase 1`, `Phase 2`, and `Phase 3` sections so the part-row eyeball work can be executed one slice at a time instead of as one broad visibility pass
1. 2026-04-16 00:58: Created this dedicated `Browser-13 - Phase 6` planning doc from the umbrella Browser-13 plan as a docs-only implementation-prep surface for Browser part-row eyeball behavior, keeping the scope narrow around the existing `partKey` visibility seam and restore-in-place Browser behavior

### Purpose

This is the dedicated planning doc for `Browser-13 - Phase 6`.

Use it to:
- prep the Browser-owned part-row eyeball follow-on without reopening the broader Browser-13 cleanup scope
- keep one stable implementation-prep surface for the remaining part-row visibility gap
- split the work into codex-sized phases that can be executed one by one without re-planning the whole part-row ladder each turn
- preserve the umbrella Browser-13 doc as the ladder summary while this doc holds the narrower `Phase 6` planning detail

## Doc Body

## [ ] Browser-13 - Phase 6 - Part Row Eyeballs In Browser

### Parent Phase

- umbrella phase:
  - `Browser_Phase Browser-13 - UI Clean Polish And Cleanup.md`
- tracked ladder item:
  - `Browser-13 - Phase 6 - Part Row Eyeballs In Browser`

### Locked Direction

- make the Browser eyeball work reliably for eligible `Part` rows through the existing part visibility seam
- keep this phase Browser-owned and narrow:
  no new visibility model, no Browser-only part state, no isolate mode, and no hierarchy or ownership changes
- reuse the same shared row-eye surface already used elsewhere in Browser instead of inventing a part-only control language
- keep hidden part rows present and restorable in place through the normal Browser hidden-state treatment

### Why This Exists

- after shipped `Phase 4` and `Phase 5`, part rows are the remaining obvious Browser visibility surface that can still feel inconsistent or incomplete
- users naturally expect the row-local eye on a `Part` row to behave like the rest of Browser visibility:
  click `Hide` to hide that part, click `Show` to restore it
- this belongs in Browser-13 because it is a row-surface cleanup follow-on that should reuse the existing part visibility truth instead of reopening deeper scene-management rules

### First-Pass Direction

- verify whether eligible part rows already render the normal Browser eye everywhere they should
- verify whether clicked part-row eyes actually mutate the intended `partKey` visibility state and stay restorable in place
- tighten any presenter, row-VM, or interaction seams needed so Browser part-row eye behavior feels as reliable as object and parent-row eye behavior
- keep ineligible rows honest:
  rows without real part visibility membership should not gain a misleading eye affordance

### Implementation Prep That Matters

- the live Browser row presenter already has a part-row visibility branch, so `Phase 6` should not be framed as inventing the part eye from scratch without first proving the actual remaining gap
- the live Browser interaction path already routes `part` rows through the shared `handleToggleContentVisibility(...)` path using `visibilityPartKeys`
- that means the likely remaining work is narrower:
  prove whether Browser part-row eye rendering, part-key wiring, or restore-in-place behavior is still incomplete or inconsistent in live use
- keep this phase on the existing part visibility truth rather than widening `Phase 6` into selected-set part behavior, Console grammar, or keyboard parity

### Implementation-Prep Read

- `src/app/panels/browserTreeRowPresenter.tsx`
  - already owns the shared Browser eye surface and currently treats eligible `part` rows as part-visibility rows
- `src/app/panels/browserInteractions.ts`
  - already owns the shared content and part visibility mutation route through `handleToggleContentVisibility(...)`
- `src/app/panels/selectBrowserTreeRows.ts`
  - already builds `BrowserPartTreeRowVm` and is the first Browser-side place to inspect if part rows are missing or misreporting visibility membership
- `src/app/store/useAppStore.ts`
  - likely first store-side seam if Browser part rows are missing stable `partKey` visibility truth before the presenter sees them
- `src/app/panels/BrowserPanel.test.tsx`
  - best Browser-level proof target for visible-part hide, hidden-part show, and restore-in-place behavior
- `src/app/panels/browserTreeRowPresenter.test.tsx`
  - good narrow proof target if part-row eye rendering or affordance parity needs isolated presenter coverage
- `src/app/panels/browserInteractions.test.ts`
  - good focused target if explicit part-row toggle routing proof is still missing or incomplete

### Success Condition

- eligible visible `Part` rows show the normal Browser eye and can hide in one click
- eligible hidden `Part` rows keep the normal Browser eye and can show in one click
- clicked part-row eyes operate on the intended `partKey` visibility state instead of a broader unintended target set
- hidden part rows remain understandable and restorable in place through the Browser tree
- object, parent, sketch, and reference row eye behavior does not regress

### Current Live Phase 6 Seams

- `src/app/panels/browserTreeRowPresenter.tsx`
  - likely first presenter seam if part-row eyes still do not render or stay visible consistently
- `src/app/panels/browserInteractions.ts`
  - likely first interaction seam if part-row eye clicks still fail to hide/show the intended part reliably
- `src/app/panels/selectBrowserTreeRows.ts`
  - likely first row-VM seam if part rows still lack the visibility membership truth the presenter expects
- `src/app/store/useAppStore.ts`
  - likely first store seam if the underlying `partsVisibility` or resolved part ownership truth is incomplete before Browser rows are built
- `src/app/panels/BrowserPanel.test.tsx`
  - likely first Browser-level regression target for live row-eye behavior
- `src/app/panels/browserInteractions.test.ts`
  - likely first focused routing-proof target

### Locked In Scope

- Browser part-row eye rendering and hide/show behavior
- restore-in-place treatment for hidden part rows
- row-VM, presenter, and interaction cleanup needed to make part-row eye behavior feel coherent with the rest of Browser
- focused Browser and interaction proof for part-row eye behavior

### Locked Out Of Scope

- part multi-select hide/show semantics beyond the current shipped Browser visibility ladder
- Console, keyboard, or viewer-first parity work
- new part hierarchy semantics, isolate/solo, layers, or visibility presets
- Browser selection-model changes

### Preferred Implementation Shape

1. Start by proving the real live part-row eye gap instead of assuming the current part branch is entirely absent.
2. If the gap is real, trace it backward through `BrowserPartTreeRowVm` truth and the current `partsVisibility` seam before changing presenter code.
3. Reuse the existing Browser eye rendering path and `handleToggleContentVisibility(...)` route instead of adding a part-only setter or part-only button behavior.
4. Keep hidden part rows present and restorable in place through the same Browser tree treatment expected elsewhere.
5. Add narrow Browser-level and interaction-level proof so future visibility cleanup does not regress part-row eyes again.

### Concrete Implementation Targets

- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserTreeRowPresenter.test.tsx`
- `src/app/panels/browserInteractions.test.ts`

### Verification Goals

- visible part row plus clicked `Hide` eye:
  that part becomes hidden
- hidden part row plus clicked `Show` eye:
  that part becomes visible
- repeated hide/show on the same part row remains stable
- hiding a part does not accidentally widen into object-wide or selection-wide behavior unless some other shipped phase explicitly owns that behavior
- Browser tree presentation remains understandable after part rows are hidden

### Questions / Decisions

#### [ ] q6.1 - Should Phase 6 reuse the existing `partKey` visibility seam instead of inventing a part-only Browser model?

Question:
- when `Phase 6` makes the Browser eye work for `Part` rows, should that eye stay on the existing `partKey` visibility seam rather than introducing a separate Browser-local part visibility state?

Suggestion:
- yes
- keep Browser part-row visibility aligned with the existing app truth

#### [ ] q6.2 - Should hidden part rows remain restorable in place through their row eye?

Question:
- after a `Part` row is hidden, should its Browser row remain visible enough in the tree that the user can click the same row eye to restore it directly in place?

Suggestion:
- yes
- keep Browser recovery local and predictable

#### [ ] q6.3 - Should Phase 6 stay single-row-first instead of widening into selected-set part behavior?

Question:
- should `Browser-13 - Phase 6` stay focused on ordinary part-row eye behavior first, leaving any future selected-set part semantics to a separate follow-on if that becomes necessary?

Suggestion:
- yes
- keep this slice small and avoid reopening selected-set complexity right after shipped `Phase 5`

#### [ ] q6.4 - Should Phase 6 first prove whether the gap is presenter-level, row-VM-level, or store-truth-level before editing the eye surface?

Question:
- because the live Browser already has a part-row eye branch, should `Phase 6` first identify whether the remaining issue is eye rendering, row visibility membership, or underlying `partsVisibility` truth before changing the Browser eye surface itself?

Suggestion:
- yes
- keep the fix on the real seam instead of widening the presenter blindly

## [ ] Browser-13 - Phase 6 - Phase 1 - Prove The Live Part Row Eye Gap

- first codex-sized `Phase 6` slice
- purpose:
  - prove the real live part-row eyeball gap before we edit part visibility behavior
  - lock whether the remaining issue is presenter rendering, row-VM truth, or interaction/store truth
- locked direction:
  - treat this phase as proof-first and read-only in spirit even if a tiny doc or test seam needs cleanup
  - do not start by widening the presenter or inventing a part-only visibility rule
  - confirm whether eligible `Part` rows already render the eye, whether the eye click routes correctly, and whether hidden parts remain restorable in place
- likely inspection seams:
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/browserInteractions.test.ts`
- success condition:
  - we can state clearly which of the following is still broken in live behavior:
    eye rendering, part visibility membership, click routing, restore-in-place behavior, or some combination
  - `Phase 2` can then target the real seam instead of taking a broad guess

## [ ] Browser-13 - Phase 6 - Phase 2 - Fix Part Row Eye Eligibility And Row Truth

- second codex-sized `Phase 6` slice
- purpose:
  - fix the Browser-side truth that decides whether a `Part` row should show the eye and remain a valid visibility row
- phase dependency:
  - start only after `Phase 1` identifies a real row-VM, presenter, or store-truth gap
- locked direction:
  - keep this phase focused on part-row eligibility and visibility membership truth
  - if the real issue is row-VM/store truth, solve it here before touching broader click behavior
  - preserve the existing `partKey` seam and keep hidden parts eligible for restore-in-place behavior where appropriate
- likely implementation seams:
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
- success condition:
  - eligible visible `Part` rows render the normal Browser eye
  - eligible hidden `Part` rows still present the normal Browser eye so they can be restored in place
  - ineligible rows do not gain a misleading part-row eye affordance

## [ ] Browser-13 - Phase 6 - Phase 3 - Fix Part Row Eye Behavior And Land Proof

- third codex-sized `Phase 6` slice
- purpose:
  - finish the actual clicked-eye behavior for `Part` rows and lock it down with focused proof
- phase dependency:
  - start after `Phase 1` proves the live seam and after `Phase 2` lands if any eligibility or row-truth changes are needed
- locked direction:
  - route part-row eye clicks through the existing `partKey` visibility contract
  - keep the behavior single-row-first:
    this phase is about normal part-row hide/show and restore-in-place behavior, not selected-set part semantics
  - add proof that hide/show is stable and does not accidentally widen into object-wide or selection-wide behavior
- likely implementation seams:
  - `src/app/panels/browserInteractions.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/browserInteractions.test.ts`
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
- success condition:
  - visible `Part` row plus clicked `Hide` eye hides that part
  - hidden `Part` row plus clicked `Show` eye restores that part in place
  - repeated hide/show on the same part row remains stable
  - object, parent, sketch, and reference visibility behavior does not regress
