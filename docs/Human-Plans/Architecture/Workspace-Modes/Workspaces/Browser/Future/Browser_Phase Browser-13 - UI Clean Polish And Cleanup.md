# Browser Phase Browser-13 - UI Clean Polish And Cleanup

## Doc Header

### Doc History
17. 2026-04-16 00:59: Created the dedicated `Browser-13 - Phase 6 - Part Row Eyeballs In Browser` planning doc in `Future/` and linked the new detail surface back into the umbrella Browser-13 ladder so the next part-row visibility follow-on can be prepped independently of the broader cleanup summary
16. 2026-04-16 00:56: Added `Browser-13 - Phase 6 - Part Row Eyeballs In Browser` as the next docs-only planning slice after shipped `Phase 5`, framing it as a narrow Browser-owned follow-on that makes part-row eyes reliably hide/show through the existing part visibility seam instead of inventing a new part-specific visibility model
15. 2026-04-16 00:53: Marked `Browser-13 - Phase 5 - Selected Row Eye Acts On The Current Selected Content Set` complete after live confirmation that selected reference-backed object eyes now fan the clicked hide/show intent across the eligible selected reference set, and closed the dedicated Phase 5 family doc as retained shipped-attempt history instead of an open debugging surface
14. 2026-04-16 00:40: Marked `Browser-13 - Phase 3 - Multi-Select Hide And Unhide In Browser` complete after shipping selection-aware Browser row-menu `Hide` / `Show` batching for eligible multi-selected rows, including authored content rows plus imported reference rows, while keeping single-row eye behavior separate for the still-open `Phase 5` work
13. 2026-04-16 00:36: Tightened `Phase 5 Attempt 3` into implementation-prep shape through the family doc, locking the immediate live fix around selected reference-backed object eyes, the `handleToggleReferenceVisibility(...)` seam, shared selected-target to `referenceIds` resolution, and focused missing Browser interaction proof for selected reference-object eye fan-out
12. 2026-04-16 00:31: Narrowed the immediate `Phase 5` working focus through the new family doc around the live reference-backed object repro, recording that selected reference-object eyes currently route through the reference visibility handler rather than the content fan-out seam and that `Attempt 3` should therefore start by proving and fixing selected reference-id fan-out instead of patching generic content-row visibility again
11. 2026-04-16 00:24: Added a dedicated `Browser-13 - Phase 5 Family - Selected Row Eye Selected-Set Attempts` tracking doc after repeated targeted-test-passing but live-failing implementation attempts, so the unresolved Phase 5 behavior, attempt history, and next debugging direction have one stable planning surface instead of living only in chat
10. 2026-04-16 00:06: Tightened the revised `Browser-13 - Phase 5` into implementation-prep shape by locking `workspaceSelection.resolvedContentSelection` as the first hide/show-selected authority, calling out `useBrowserPanelController.ts -> browserInteractions.ts` as the likely handoff seam, and narrowing the remaining preflight question to whether viewport-driven selection already keeps that shared selected-content payload in sync strongly enough for Browser-eye fan-out
9. 2026-04-15 23:58: Revised `Browser-13 - Phase 5` around the stronger cross-surface selection seam after reviewing Browser, Viewer, Console, and workspace-selection code, replacing the earlier Browser-row-local fan-out framing with a `resolvedContentSelection`-first direction so clicking a selected row eye can act as `hide/show selected content` across Browser or viewport-driven selection
8. 2026-04-15 23:48: Tightened `Browser-13 - Phase 5 - Selected Row Hide Applies To The Eligible Multi-Selection` into implementation-prep shape after checking the live Browser row presenter, controller selection derivation, interaction toggle path, and BrowserPanel multi-select proof, locking the actual fan-out seam around selection-aware row-eye handling instead of vague batch-visibility wording
7. 2026-04-15 23:40: Marked `Browser-13 - Phase 4 - Assembly / Component Row Eyeballs In Browser` complete after implementation shipped through the shared Browser visibility seam, and added `Browser-13 - Phase 5 - Selected Row Hide Applies To The Eligible Multi-Selection` as the next selection-aware visibility follow-on so clicking one selected row eye can fan the explicit visibility intent across the current eligible Browser multi-selection
6. 2026-04-15 23:27: Tightened `Browser-13 - Phase 4 - Assembly / Component Row Eyeballs In Browser` into implementation-prep shape after checking the live Browser row presenter, visibility interaction, and BrowserPanel proof, recording that eligible assembly/component eyes already route through the shared content-visibility seam today and narrowing the remaining Phase 4 question to any authored-parent eye gap or row-surface parity cleanup that still justifies work
5. 2026-04-15 23:14: Added `Browser-13 - Phase 4 - Assembly / Component Row Eyeballs In Browser` as the next Browser-13 cleanup follow-on after the batch-visibility slice, locking a Browser-owned row-surface pass that makes authored parent visibility eyes feel explicit and consistent while reusing the existing authored-container visibility contract instead of inventing new hide semantics
4. 2026-04-15 22:49: Tightened `Browser-13 - Phase 3 - Multi-Select Hide And Unhide In Browser` into implementation-prep shape inside this umbrella doc, locking the batch-visibility direction, the likely Browser-owned selection and visibility seams, the out-of-scope boundaries, and the focused verification goals needed before coding starts
3. 2026-04-15 22:43: Added `Browser-13 - Phase 3 - Multi-Select Hide And Unhide In Browser` as the next Browser-13 follow-on, locking a narrow Browser-owned batch-visibility slice so selected eligible rows can hide or unhide together without widening into new visibility semantics, isolate modes, or broader scene-management features
2. 2026-04-15 22:34: Folded shipped `Browser-13 - Phase 1` and `Browser-13 - Phase 2` detail back into this umbrella doc and promoted it to the canonical working planning surface for the Browser-13 ladder, so current Browser cleanup work can be read from one place while the dedicated `13.x` docs remain as narrower implementation and history records
1. 2026-04-15 11:59:58: Created this standalone future Browser phase doc to track a dedicated UI polish and cleanup pass after the heavier Browser structure/progress ladder, so the panel can be cleaned up visually without reopening ownership or hierarchy architecture

### Purpose

This phase is the canonical Browser-13 planning surface.

Use it to:
- track the Browser-13 ladder from the umbrella cleanup direction through the shipped `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, and `Phase 5` slices plus the planned `Phase 6` follow-on
- keep current Browser-13 planning readable from one main doc instead of hopping across the split `13.x` docs first
- preserve the dedicated `13.x` docs as narrower implementation and shipping records
- keep Browser-13 focused on UI cleanup and usability polish instead of reopening Browser hierarchy or ownership architecture

## Doc Body

## [ ] Browser-13 - UI Clean Polish And Cleanup

### Summary

`Browser-13` started as a Browser presentation polish pass after the heavier `8` through `12.1` structure and progress ladder.

The Browser-13 ladder now already includes two shipped usability foundations:
- `Phase 1`
  - fixed docked Browser overflow containment so tall object lists stay inside the panel and scroll locally
- `Phase 2`
  - restored user-adjustable Browser size in both docked and floating host modes

That means the remaining Browser-13 work is narrower and cleaner:
- Browser row truth is much better
- Browser size and overflow behavior are now in a healthier place
- Browser row-menu batch visibility is now in place for eligible multi-selected rows
- the selected-row-eye visibility follow-on is now shipped
- the next remaining visibility follow-on is part-row eyeball behavior in Browser
- the broader remaining gap is visual cohesion across row families, action surfaces, spacing, pills, icons, and stale presentation seams

Use this umbrella doc as the main Browser-13 working plan:
- start here for current ladder status and scope
- keep the dedicated `Phase 1`, `Phase 2`, and `Phase 2.x` docs as supporting detail/history records
- use the dedicated `Phase 5 Family` doc as the retained attempt ledger for how the selected-row-eye work was debugged and closed

### Browser-13 State

Shipped inside Browser-13 so far:
- `Phase 1`
  - docked Browser content now stays bounded and scrollable inside the panel
- `Phase 2`
  - docked and floating Browser size is user-adjustable again through the existing shell ownership seams
- `Phase 3`
  - eligible multi-selected Browser rows can now hide or show together through one normal Browser row-menu action
- `Phase 5`
  - one selected eligible Browser row eye now applies its explicit hide or show intent across the current selected content set instead of only the clicked row, including the selected reference-backed object path that had remained live-broken

Still open inside Browser-13:
- `Phase 6`
  - make the Browser eyeball work reliably for `Part` rows through the existing part visibility seam, including direct hide/show and restore-in-place behavior
- the broader row-surface and presentation cleanup that makes the Browser feel like one coherent UI instead of several generations layered together

Shipped inside Browser-13 more recently:
- `Phase 3`
  - Browser row menus now surface grouped `Hide` / `Show` for eligible multi-selected rows, including authored object selections and grouped imported reference selections, while keeping mixed-state or ineligible selections honest
- `Phase 4`
  - eligible authored `Assembly` and `Component` rows now surface the Browser eye through the existing shared visibility seam, including reference-backed visibility membership where needed

### Owns

- Browser UI polish across existing row families
- cleanup of stale or redundant Browser presentation codepaths
- row spacing and indentation rhythm where the current layout feels uneven
- icon, pill, label, and action alignment consistency
- state-surface polish for hover, selected, loading, error, and disabled treatments when the underlying Browser behavior stays the same
- Browser-local usability groundwork like overflow containment and resize affordances when those changes preserve current Browser truth

### Does Not Own

- new Browser ownership semantics
- hierarchy or drag-model changes
- widening part promotion or imported-object routing
- new Console command grammar
- viewer or transform behavior changes beyond Browser-local visual cleanup

### Locked Direction

- keep `Browser-13` presentation-first:
  - no hidden hierarchy or owner-model changes inside the cleanup work
- prefer one coherent Browser row language across row families:
  - only keep distinct visual treatments when they carry real meaning
- delete stale presentation seams when safe:
  - do not layer more CSS and row special-casing on top of already-obsolete UI branches
- allow small usability polish:
  - clearer hover/action visibility is allowed
  - action behavior itself should not change
- treat shipped `Phase 1` and `Phase 2` behavior as the Browser-13 baseline:
  - later cleanup work should build on top of contained scrolling and reachable resizing instead of reopening those seams unless a regression is found

### Current Gap

`Phase 1` and `Phase 2` closed two important usability gaps:
- Browser overflow containment is now shipped
- Browser resize affordances are now shipped in both docked and floating modes

The next remaining Browser-13 gap is part-row visibility affordance clarity:
- Browser part rows should participate in the normal Browser eye language instead of feeling like a partial or unreliable edge case
- part-row hide/show should reuse the existing part visibility seam and keep hidden parts restorable directly in place
- this should stay narrow:
  no new layer semantics, no Browser-only part visibility state, and no hierarchy or ownership changes

The broader remaining Browser-13 gap is visual cohesion:
- row families still use slightly different spacing or label rhythm without a meaningful reason
- icons, pills, and actions do not align consistently across content, reference-backed, and utility rows
- hover, selection, loading, and error surfaces feel close but not fully unified
- stale CSS branches or Browser-local presenter conditions still reflect earlier UI assumptions more than the current Browser model

### Direction

- audit Browser row families and identify presentation-only inconsistencies
- unify spacing, padding, and vertical rhythm first
- normalize icon, label, pill, and action placement across row families where meaning allows it
- simplify Browser UI styling and codepaths where earlier special cases are no longer justified
- land the follow-on part-row visibility slice that makes Browser part-row eyes feel reliable and consistent through the existing part visibility seam
- preserve current row truth and interaction rules while making the Browser feel calmer and more intentional

# Phase Ladder

## [x] Browser-13 - Phase 1 - Scrollable Browser Content When Object Lists Overflow

- first concrete Browser-13 usability and cleanup slice
- locked direction:
  - Browser content must stay contained within the Browser panel instead of running off the bottom of the app when many objects are present
  - when the Browser tree is taller than the available panel height, the Browser should expose a vertical scrollbar so users can scroll through the full object list
  - keep the Browser header and chrome stable while the object list area becomes the scrollable region
  - treat this as overflow containment and usability cleanup, not as a hierarchy or row-behavior change
- why this existed:
  - large object lists were pushing Browser rows off the bottom of the visible app instead of remaining inside a bounded panel
  - users could not reliably reach all Browser rows when panel content exceeded the available viewport height
  - the Browser needed a normal local scroll container so long projects stayed usable
- implementation prep that mattered:
  - `BrowserPanel.tsx` already rendered `.BrowserPanelBody` as the natural Browser-local scroll container around `.BrowserTree`
  - `browser.css` already gave `.BrowserPanelBody` `overflow-y: auto`, which pointed to a height and flex containment leak rather than a missing scrollbar style
  - the live dock path was `PrimaryViewportLeftDockPanelTarget--browser -> BrowserPanelRoot -> BrowserPanelBody`
  - `PanelStack.isConstrained` already had its own outer scroll path, so the phase intentionally preferred fixing Browser-local containment before widening outer dock scrolling behavior
- shipped result:
  - the docked Browser target now owns a real flex and min-height containment contract, so long Browser object lists stay bounded inside the Browser panel instead of pushing rows off the bottom of the app
  - `.BrowserPanelBody` remains the Browser-local scroll owner and now gets first priority for wheel forwarding before the outer left-dock stack
  - `Attempt 2` widened the constrained left-dock stack path into the normal unsplit primary viewport shell, so Browser no longer relies on split-only layout gating before it can behave like a bounded scrollable dock panel
  - `Attempt 3` removed the remaining docked Browser stretch-to-fill contract, so short Browser content now reads content-sized first and only becomes scrollable after it reaches the available viewport-bounded left-dock height
  - the empty meatball dock sibling now collapses unless it has real content or a preview ghost, which prevents that unused slot from stealing Browser height
- retained detail doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-13 - Phase 1 - Scrollable Browser Content When Object Lists Overflow.md`

## [x] Browser-13 - Phase 2 - Re-Adjustable Docked And Floating Browser Size

- second concrete Browser-13 usability and cleanup slice
- locked direction:
  - users should be able to re-adjust Browser size in both supported Browser host modes:
    docked Browser width in the left rail and floating Browser window size in floating mode
  - preserve the current Browser host-mode model instead of inventing a new Browser-only layout system
  - keep this phase about resize affordances, persistence, and safe clamp behavior, not Browser hierarchy or content truth
  - when Browser is docked, resizing must widen the whole left rail so the ParaHook Generator title and status panel above Browser grows together with it
- why this existed:
  - after `Phase 1`, Browser overflow behavior was healthier, but users still needed a direct way to tune how much space the Browser gets
  - docked Browser width already rode the shared left-dock seam, but that needed to be treated explicitly as a Browser usability surface
  - floating Browser already persisted a size contract in workspace state, but it still needed a user-facing resize affordance so people could intentionally reshape the window
- implementation prep that mattered:
  - docked Browser already lived on the shared primary left-dock width path through `leftDockWidth`, `.PrimaryViewportLeftDockResizeHandle`, and `handleLeftDockResizeStart`
  - floating Browser already stored `browserShell.size`, and `BrowserDockHost.tsx` already owned `clampBrowserFloatingSize` plus `setBrowserFloatingSize`
  - `.BrowserFloatingWindow` already had min and max shell bounds in `windows.css`, which meant the missing piece was the user-facing resize seam and handle path rather than a new storage contract
  - the phase needed to preserve console anchoring, split behavior, drag-to-move, popout, and dock transitions while resize affordances were clarified
- shipped result:
  - docked Browser width stays on the shared `leftDockWidth` rail contract instead of introducing a Browser-only dock-width state
  - the docked shared resize seam now lives on the visible right edge of the whole left rail, so the ParaHook Generator title and status panel plus Browser widen together where users expect to grab the seam
  - floating Browser now supports direct edge and corner resizing through the existing `browserShell.size` contract
  - Browser size changes remain clamped and persisted through the existing workspace shell state instead of temporary local UI state
- shipped subphases:
  - `Phase 2.1`
    - kept docked Browser width on the shared left-rail resize seam and made the shared-width coupling explicit and testable
  - `Phase 2.2`
    - added direct floating Browser resize handles and stored width and height updates through the existing clamp path
  - `Phase 2.3`
    - re-homed the shared docked resize handle onto the full left-dock content edge so the real user-facing seam is reachable in the live UI
- retained detail doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-13 - Phase 2 - Re-Adjustable Docked And Floating Browser Size.md`

## [x] Browser-13 - Phase 3 - Multi-Select Hide And Unhide In Browser

- third concrete Browser-13 usability and cleanup slice
- locked direction:
  - allow eligible multi-selected Browser rows to hide together and unhide together through the existing Browser visibility authority
  - keep this phase Browser-owned:
    the action should start from Browser multi-selection and Browser visibility affordances instead of inventing a new Console or viewer-first control surface
  - reuse the current single-row visibility behavior as the source of truth instead of inventing a separate batch visibility model
  - keep the phase narrow:
    no isolate mode, no visibility presets, no new layer system, and no hidden hierarchy or ownership changes
- why this exists:
  - `Phase 1` and `Phase 2` fixed Browser size and overflow usability, but visibility cleanup still becomes tedious when users need to act on many selected rows
  - Browser already has meaningful multi-selection, so one-row-at-a-time hide or unhide is the next obvious friction point
  - batch visibility control belongs in the same Browser usability family as the recent overflow and resize fixes because it reduces repetitive Browser-only cleanup work without reopening deeper model questions
- first-pass direction:
  - let Browser multi-selection drive one hide action when the selected visible rows are eligible for the current Browser visibility path
  - let Browser multi-selection drive one unhide action when the selected hidden rows are eligible for the current Browser visibility path
  - keep mixed selections honest:
    ineligible rows should not silently gain new visibility semantics just because they are selected alongside eligible rows
  - keep the Browser tree stable after the action:
    selected rows should remain understandable in-place through the current hidden-state treatment instead of disappearing from the Browser tree
- implementation prep that matters:
  - build on the existing Browser multi-selection contract instead of adding a second selection model
  - reuse the current Browser visibility seam that already owns single-row hide and unhide behavior
  - batch actions should resolve eligibility from the same row types and visibility truth already used by ordinary Browser hide and unhide, so single-row and multi-row behavior do not diverge
  - the action surface should live where Browser visibility already feels natural:
    row actions, selection-aware Browser affordances, and other Browser-local visibility entry points should stay consistent
- success condition:
  - when the user multi-selects eligible visible Browser rows, Browser can hide them together through one normal action
  - when the user multi-selects eligible hidden Browser rows, Browser can unhide them together through one normal action
  - mixed or partially ineligible selections stay predictable and do not invent unsupported visibility behavior for row types that still lack that contract
  - Browser selection, hierarchy, drag, and existing single-row visibility behavior remain stable after the batch action lands
- shipped result:
  - Browser row menus now surface grouped `Hide` / `Show` when the clicked row belongs to a meaningful eligible multi-selection with a non-ambiguous all-visible or all-hidden state
  - the grouped action stays Browser-owned and row-menu-local, which keeps it distinct from the still-open `Phase 5` selected-eye work
  - authored content rows batch through shared `setPartVisibility(...)`, while imported reference rows batch through shared `setReferenceItemVisibility(...)`
  - mixed-state or ineligible selected sets continue to withhold the grouped visibility action instead of guessing
- current live Phase 3 seams:
  - Browser multi-selection already exists and should remain the only selection authority for this phase
  - Browser single-row hide and unhide behavior already defines the visibility truth that batch actions must reuse
  - the likely implementation work lives where Browser already resolves:
    selected rows, row eligibility, visibility affordances, and selection-aware actions
  - this should stay Browser-local first:
    no new viewer-first visibility authority and no separate batch-only state map
- locked Phase 3 in-scope:
  - adding one Browser-owned batch hide path for eligible multi-selected visible rows
  - adding one Browser-owned batch unhide path for eligible multi-selected hidden rows
  - deriving batch eligibility from the same row kinds and visibility truth already used by current single-row Browser hide and unhide
  - clarifying Browser action availability for all-visible, all-hidden, or mixed selected sets without changing the underlying visibility semantics
  - adding focused regression coverage around multi-select hide and unhide behavior
- locked Phase 3 out-of-scope:
  - isolate, solo, visibility presets, layers, or scene-management systems
  - new visibility semantics for row kinds that still do not participate in the current Browser visibility contract
  - widening the work into Console command grammar, keyboard shortcuts, or viewer-only controls
  - changing selection semantics, ownership routing, hierarchy shape, or drag behavior
  - inventing a separate batch-visibility persistence model
- preferred Phase 3 implementation shape:
  1. Reuse the current Browser multi-selection set as input.
  2. Filter that set through the same existing row-visibility eligibility logic used by single-row Browser actions.
  3. Surface one batch `Hide` action when the selected eligible rows are currently visible.
  4. Surface one batch `Show` or `Unhide` action when the selected eligible rows are currently hidden.
  5. Keep mixed selections honest by disabling or withholding actions that would imply unsupported semantics for ineligible rows.
  6. Commit the visibility change through the same underlying Browser visibility action path already used for one row, just repeated or batched over the eligible selection set.
- concrete implementation targets:
  - `src/app/panels/BrowserPanel.tsx`
    - likely owns selected-row action wiring or selection-aware Browser affordances
  - `src/app/panels/useBrowserPanelController.ts`
    - likely owns selected Browser rows plus action eligibility and command handlers
  - `src/app/panels/browserTreeRowActions.tsx`
    - likely needs selection-aware hide and unhide affordance widening if row actions reflect selected-set behavior
  - `src/app/panels/browserContextMenu.ts`
    - if Browser right-click actions are selection-aware, this is a likely place to keep batch visibility parity honest
  - `src/app/panels/BrowserPanel.test.tsx`
    - focused Browser multi-select visibility coverage should live here
  - `src/app/panels/browserInteractions.test.ts`
    - if visibility routing already has focused interaction proof, extend that proof instead of creating a new ad hoc suite
- verification goals:
  - all-visible eligible selection:
    one Browser action hides the full eligible selected set
  - all-hidden eligible selection:
    one Browser action unhides the full eligible selected set
  - mixed visible and hidden eligible selection:
    the action surface stays explicit and predictable instead of guessing a contradictory state change
  - mixed eligible and ineligible selection:
    Browser does not silently invent visibility behavior for unsupported row kinds
  - non-regression:
    single-row hide and unhide still behave exactly as before, and Browser selection plus hierarchy remain stable after batch visibility changes
- Questions / Decisions:

  #### [ ] q3.1 - Should Phase 3 operate only on rows already eligible for the existing single-row Browser visibility contract?

  Question:
  - when the user multi-selects rows, should `Phase 3` apply only to the subset of selected rows that already support the current Browser hide and unhide behavior, instead of widening visibility to new row kinds in the same pass?

  Suggestion:
  - yes
  - batch behavior should reuse the existing eligibility truth rather than creating new visibility semantics

  #### [ ] q3.2 - Should mixed visible and hidden selections avoid ambiguous one-click toggles?

  Question:
  - if the selected eligible rows include both visible and hidden rows, should Browser avoid a single ambiguous toggle and instead require an explicit action state that matches the current selected-set truth?

  Suggestion:
  - yes
  - keep batch visibility explicit rather than guessing whether the user means `Hide` or `Show`

  #### [ ] q3.3 - Should Phase 3 stay Browser-local instead of also widening to Console and keyboard in the same pass?

  Question:
  - should `Browser-13 - Phase 3` land first as a Browser-owned multi-select visibility slice without also adding Console parity or keyboard parity in the same implementation?

  Suggestion:
  - yes
  - keep this pass small and implementation-ready before deciding whether later parity follow-ons are needed

## [x] Browser-13 - Phase 4 - Assembly / Component Row Eyeballs In Browser

- fourth concrete Browser-13 usability and cleanup slice
- locked direction:
  - ensure eligible authored `Assembly` and `Component` rows expose the same normal Browser eyeball affordance as other Browser visibility rows
  - keep this phase Browser-owned and row-surface-first:
    reuse the existing Browser visibility contract instead of inventing new authored-container hide semantics
  - make the parent-row eyeball read like the standard Browser visibility affordance:
    placement, hover treatment, hidden-state treatment, and disabled behavior should feel consistent with the shared row language
  - keep the phase narrow:
    no new layer system, no new Console grammar, no keyboard parity expansion, and no hierarchy or ownership changes
- why this exists:
  - `Phase 3` reduces repetitive multi-row visibility work, but Browser still needs assembly/component parent visibility to feel like one coherent row language instead of a special-case seam
  - live Browser code already has authored-container visibility groundwork and already routes eligible content-row eyes through the shared content visibility path, so the remaining Browser-13 question is whether any authored parent rows still miss that affordance or still present it inconsistently
  - this phase should only justify code changes where authored assembly/component visibility still lags the normal Browser row surface in a user-visible way
- first-pass direction:
  - verify the same Browser eye affordance used by other eligible rows is available on authored `Assembly` / `Component` rows
  - derive visibility eligibility from the current authored-container visibility truth, including aggregated descendant visibility membership and current visible versus hidden state
  - keep hidden parent rows present and restorable in place through the normal Browser hidden-state treatment
  - align icon placement, hover reveal, selected-state behavior, and disabled treatment with the shared row surface instead of introducing a parent-only eye style
- implementation prep that matters:
  - the live Browser row presenter already treats `assembly`, `component`, and `object` rows with non-empty `visibilityPartKeys` as content visibility rows, so Phase 4 should not start from the assumption that authored parent eyes do not exist at all
  - the live Browser visibility button path already routes content-row eye clicks through `onToggleContentVisibility`
  - earlier authored-container visibility work already locked parent hide onto the shared aggregated descendant visibility seam, so this phase should not introduce a second authored-container-only setter or state model
  - the live Browser interaction path already handles `assembly`, `component`, `object`, and `part` rows through one `handleToggleContentVisibility(...)` path that flips `row.isVisible` by fanning over `row.visibilityPartKeys`
  - Browser row presenter and row-action seams already own where visibility eyes render and how row hover or selection reveals them
  - if `Phase 3` lands first, selected-set visibility affordances and single-row assembly/component eyeballs still need to resolve through the same visibility truth instead of diverging into separate rules
- implementation-prep read:
  - `src/app/panels/browserTreeRowPresenter.tsx` already gates the Browser eye through `isContentVisibilityRow` and `canShowVisibilityToggle`, and that content path already includes `assembly` plus `component` rows when `visibilityPartKeys.length > 0`
  - `src/app/panels/browserInteractions.ts` already owns `handleToggleContentVisibility(...)`, which returns early only when `visibilityPartKeys.length === 0` and otherwise fans the new visibility state through `setPartVisibility(...)`
  - `src/app/panels/BrowserPanel.test.tsx` already proves `Hide Assembly 1` and `Hide Component 1` render in Browser for authored container rows with visibility membership
  - that means `Phase 4` should not be framed as "invent the assembly/component eye from scratch"
  - the real implementation-prep question is narrower:
    identify whether any authored assembly/component rows that should have the eye still fail to get it because their row VM lacks visibility membership, or whether the remaining gap is only row-surface polish and consistency
- success condition:
  - no eligible authored `Assembly` / `Component` row that should expose Browser visibility remains missing the normal Browser eye affordance
  - any remaining authored parent eye gap resolves through the existing Browser visibility path instead of a new special-case setter
  - hidden authored parents stay visible in Browser and can be restored directly in place
  - Browser row alignment and action surfaces remain coherent after any remaining authored-parent eye cleanup lands
- shipped result:
  - authored `Assembly` and `Component` Browser rows now remain eye-eligible when their visibility membership comes from owned reference-backed children instead of only direct rendered part keys
  - the shared Browser eye presenter, Browser interaction routing, and Browser context-menu visibility path all continue to reuse the same underlying visibility truth instead of branching into a parent-only toggle system
  - focused selector, presenter, interaction, and context-menu proof now covers authored parent visibility membership plus the Browser eye surface for those rows
- current live Phase 4 seams:
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - already owns the standard Browser eye affordance
    - already treats `assembly` and `component` rows as content visibility rows when `visibilityPartKeys.length > 0`
  - `src/app/panels/browserInteractions.ts`
    - already owns the underlying content visibility mutation path through `handleToggleContentVisibility(...)`
    - should remain the only authored-parent visibility mutation route
  - `src/app/store/useAppStore.ts`
    - likely remains the place where any missing authored-parent visibility membership truth would originate if a row that should show the eye still does not
  - `src/app/panels/selectBrowserTreeRows.ts`
    - already carries `isVisible` and `visibilityPartKeys` onto `BrowserAssemblyTreeRowVm` and `BrowserComponentTreeRowVm`
    - likely Browser-side seam if authored parent row VMs still need normalization before the presenter can render the eye consistently
  - `src/app/panels/browserTreeRowActions.tsx`
    - likely only matters if any remaining gap is hover/action-surface consistency rather than missing eligibility
  - `src/app/panels/BrowserPanel.test.tsx`
    - already contains Browser-level authored container visibility proof
    - likely place to extend any remaining authored-parent row-eye rendering and interaction coverage
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
    - good target if we need narrower presenter-level proof for row-family affordance parity
  - `src/app/panels/browserInteractions.test.ts`
    - already proves the shared content visibility interaction path
    - likely place to extend proof if authored assembly/component rows need more explicit routing coverage
- locked Phase 4 in-scope:
  - confirming whether any eligible authored `Assembly` / `Component` rows still miss the Browser eye in live Browser
  - fixing any remaining authored-parent eye gap by reusing the existing authored-container visibility eligibility and mutation seams
  - aligning hover, placement, disabled, and hidden-state presentation with the shared Browser row language
  - adding focused tests for authored container row-eye rendering and hide/show interaction
- locked Phase 4 out-of-scope:
  - new visibility semantics beyond the existing authored-container visibility contract
  - context-menu, Console, or keyboard parity work that belongs to other visibility ladders or later follow-ons
  - layers, isolate/solo, visibility presets, or hierarchy changes
  - widening the work into batch visibility behavior beyond what `Phase 3` already owns
- preferred Phase 4 implementation shape:
  1. Start by proving whether there is still a real authored-parent eye gap in live Browser instead of assuming the eye is absent.
  2. If a gap exists, trace it backward through `selectBrowserTreeRows.ts` row VMs and the store-owned visibility membership truth before changing presenter code.
  3. Reuse the existing shared Browser eye rendering path and `handleToggleContentVisibility(...)` route instead of adding a parent-only toggle surface.
  4. Keep hidden parent rows present in the tree with the same restore-in-place visibility treatment expected elsewhere in Browser.
  5. Tighten row spacing and action alignment only as needed so authored parent eyes read as part of one shared row language.
- concrete implementation targets:
  - `src/app/panels/selectBrowserTreeRows.ts`
    - first Browser-side target if authored assembly/component rows still need row-VM visibility normalization
  - `src/app/store/useAppStore.ts`
    - likely first store-side target if authored parent visibility membership is missing before rows reach Browser
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - only needs changes if the row VMs are already correct but the eye still does not render consistently
  - `src/app/panels/browserTreeRowActions.tsx`
    - likely only needs changes for hover/action-surface cleanup
  - `src/app/panels/browserInteractions.ts`
    - should remain unchanged unless explicit authored-parent routing proof is missing
  - `src/app/panels/BrowserPanel.test.tsx`
    - focused Browser row-eye interaction and parity coverage should live here
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
    - presenter-level rendering proof can live here if row-family eye parity needs isolated coverage
  - `src/app/panels/browserInteractions.test.ts`
    - extend only if we need explicit authored assembly/component interaction proof beyond the existing shared content toggle test
- verification goals:
  - authored visible `Assembly` / `Component` rows with visibility membership show the eye and can hide in one click
  - authored hidden `Assembly` / `Component` rows keep the eye and can show in one click
  - authored rows without real visibility membership do not gain a misleading eye affordance
  - existing object, part, sketch, and reference row eye behavior does not regress
  - if `Phase 3` multi-select visibility is already live, adding the per-row eye does not conflict with selected-set visibility affordances
- Questions / Decisions:

  #### [x] q4.1 - Should Phase 4 reuse the existing authored-container visibility contract instead of inventing a Browser-13-specific parent hide rule?

  Question:
  - when `Phase 4` adds assembly/component row eyeballs, should those eyes route through the already-established authored-container visibility truth instead of introducing a second parent-row visibility rule just for the Browser-13 cleanup ladder?

  Suggestion:
  - yes
  - reuse the current authored-container visibility seam so the cleanup stays presentation-first

  #### [x] q4.2 - Should Phase 4 first prove a real authored-parent eye gap before changing the shared presenter path?

  Question:
  - because the live Browser row presenter and BrowserPanel proof already show authored assembly/component eyes when `visibilityPartKeys` are present, should `Phase 4` only make code changes after we identify a concrete authored-parent row case that still misses the eye or still renders it inconsistently?

  Suggestion:
  - yes
  - avoid redundant churn if the base eye already exists and the remaining gap is narrower than the original phase wording

  #### [x] q4.3 - Should hidden assembly/component rows remain restorable in place through their row eyeball?

  Question:
  - after an authored `Assembly` or `Component` row is hidden, should its Browser row stay present with the normal eye affordance so the user can restore it directly in place instead of losing that parent entry from the tree?

  Suggestion:
  - yes
  - keep the Browser tree stable and let the row eye remain the local recovery surface

  #### [x] q4.4 - Should Phase 4 stay row-surface-local instead of widening into context menu, Console, or keyboard parity in the same pass?

  Question:
  - should `Browser-13 - Phase 4` stay focused on making the assembly/component row eyeball explicit inside the Browser surface first, leaving any wider command-surface parity follow-ons to separate visibility planning?

  Suggestion:
  - yes
  - keep the cleanup slice small and tied to the Browser row surface

## [x] Browser-13 - Phase 5 - Selected Row Eye Acts On The Current Selected Content Set

- fifth concrete Browser-13 usability and cleanup slice
- locked direction:
  - when the user has a meaningful current content selection from Browser or viewport and clicks the normal hide or show eye on one selected eligible `Assembly`, `Component`, or `Object` row, Browser should apply that explicit visibility intent across the full selected content set instead of only the clicked row
  - keep this phase selection-aware but rooted in shared workspace content truth:
    reuse the current `workspaceSelection.resolvedContentSelection` plus the current Browser visibility contract instead of inventing a separate Browser-row-local selection visibility model
  - let the clicked row eye define the target state:
    clicking `Hide` means hide the current selected content set, and clicking `Show` means show the current selected content set
  - keep the phase narrow:
    no new row kinds, no new visibility semantics, no isolate mode, no hierarchy changes, and no widening into Console or keyboard parity in the same pass
- why this exists:
  - even after explicit batch visibility affordances exist, users will still naturally reach for the row-local eye on one of the selected items they are already acting on
  - if the clicked row is part of the current selected content set, one-row-only behavior feels surprising because the app already treats that selected content set as real shared context in other places
  - Console and Viewer already trust the shared selected-content payload more than Browser row highlighting does, so this phase should align the Browser eye with that stronger app-wide selection truth
  - this is a good follow-on after `Phase 3` and `Phase 4` because it builds on shipped multi-selection and the now-clean assembly/component eye surface instead of introducing a brand-new action family
- first-pass direction:
  - only fan the action out when the clicked row is part of the current selected content set and that set meaningfully contains more than one targeted item
  - resolve the target set from the current `workspaceSelection.resolvedContentSelection` payload first, not from Browser row highlighting
  - use the clicked control state as the explicit intent for the whole selected content set, skipping targets already in the requested end state
  - keep ineligible rows honest:
    selected content that still does not participate in the Browser visibility contract should not gain new hide or show semantics just because it is present in the broader selection
- implementation prep that matters:
  - Browser multi-selection already exists, but it is not the strongest source of truth for this phase
  - `Phase 3` already owns the broader batch-visibility direction, so `Phase 5` should be framed as selection-aware row-eye behavior, not a replacement for explicit selected-set actions
  - `Phase 4` already cleaned up authored `Assembly` and `Component` row eye eligibility, so the selected-row fan-out can stay on the shared Browser visibility path across the eligible row families that already own that eye
  - the likely implementation seams now center on the shared workspace selected-content payload plus the existing Browser row-eye interaction path, not on reconstructing the target set from selected Browser rows alone
  - implementation should treat Browser row selection as presentation truth only:
    the row eye should not rebuild `hide selected` from `selectedBrowserRowIds` or `row.isSelected` if `resolvedContentSelection` already exists
- implementation-prep read:
  - `src/app/panels/browserTreeRowPresenter.tsx` currently invokes `onToggleContentVisibility?.(row)` from the row eye, so the presenter already forwards only the clicked row and should not need a new selection-specific icon or button surface for this phase
  - `src/app/panels/browserInteractions.ts` currently owns `handleToggleContentVisibility(row)`, and that path still tries to derive the fan-out set from Browser rows plus explicit Browser selection instead of starting from the app's canonical selected-content payload
  - `src/app/panels/useBrowserPanelController.ts` already reads `workspaceSelection.resolvedContentSelection`, but today that state is used more for grouped selection decoration than as the first authority for row-eye visibility fan-out
  - `src/app/store/useAppStore.ts` already defines `WorkspaceResolvedContentSelection`, derives it through `setWorkspaceExplicitSelection(...)`, and exposes `setWorkspaceResolvedContentSelection(...)`, so the app already has a canonical selected-content payload with `partKeys` and grouped row membership plus an explicit synchronization seam for non-Browser surfaces
  - `src/app/components/ViewerHost.tsx` already trusts `workspaceResolvedContentSelection.partKeys` for grouped content highlighting, and `src/app/console/ConsoleDock.tsx` already falls back to `resolvedContentSelection` for selected-set operations, which is strong evidence that the Browser eye should trust the same payload
  - `src/app/panels/BrowserPanel.test.tsx` already proves Browser multi-selection behavior like ctrl-click add and grouped selection persistence, so `Phase 5` should extend that live Browser proof instead of inventing a brand-new test harness
  - that means `Phase 5` should not start by widening the presenter or inventing a second selected-set visibility state
  - the real implementation-prep question is narrower:
    verify whether viewport-driven selection already keeps `workspaceSelection.resolvedContentSelection` in sync strongly enough for Browser-eye selected-set hide and show; if not, fix that synchronization seam first instead of teaching the Browser eye to scrape viewport selection separately
- success condition:
  - when the user has a selected visible content set and clicks `Hide` on one selected eligible row, Browser hides the whole eligible selected content set
  - when the user has a selected hidden content set and clicks `Show` on one selected eligible row, Browser shows the whole eligible selected content set
  - when the clicked row is not part of the current selected content set, Browser keeps the normal single-row behavior
  - mixed eligible and ineligible selections stay predictable and do not invent visibility behavior for unsupported row kinds
  - Browser hierarchy, selection stability, and the underlying visibility contract remain unchanged after the selected-row fan-out lands
- shipped result:
  - selected Browser eye clicks now fan the clicked hide/show intent across the eligible selected reference-backed set instead of toggling only the clicked reference object
  - the fix landed in the shared Browser reference-visibility interaction seam rather than a Browser-row-highlight-only reconstruction path
  - single-row eye behavior remains intact when the clicked row is outside the current meaningful selected set
  - focused interaction and Browser-level regression proof now covers the imported-reference selected-eye case that had remained live-broken through the earlier attempts
- current live Phase 5 seams:
  - `src/app/store/useAppStore.ts`
    - already defines `WorkspaceResolvedContentSelection`
    - already derives `resolvedContentSelection` through `setWorkspaceExplicitSelection(...)`
    - should be treated as the first selected-content authority for this phase
  - `src/app/panels/useBrowserPanelController.ts`
    - already reads `workspaceResolvedContentSelection`
    - should likely pass that shared selected-content payload more explicitly into the row-eye visibility decision instead of relying on Browser-row-local selected ids alone
    - is the likely handoff seam into `createBrowserRowInteractionHandlers(...)`
  - `src/app/panels/browserInteractions.ts`
    - already owns the underlying row visibility dispatch path
    - should remain the only place that fans the explicit target visibility state into the actual visibility setters
    - is the likely place to swap Browser-row-local selected-set reconstruction for `resolvedContentSelection`-first visibility targeting
    - for the current live repro, it likely also needs a reference-object selected-set branch because reference-backed object eyes currently route through `handleToggleReferenceVisibility(...)`
  - immediate Attempt 3 note:
    - the first live-fix slice is now narrowed to selected reference-backed object eyes
    - prefer shared selected-target to `referenceIds` resolution before another generic content-row fan-out rewrite
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - already forwards only the clicked row through `onToggleContentVisibility?.(row)`
    - should keep rendering the same per-row eye affordance without needing selection-specific icon variants
  - `src/app/components/ViewerHost.tsx`
    - already trusts `workspaceResolvedContentSelection.partKeys` for grouped content highlighting
    - confirms that cross-surface selected-content state already exists and is viable
  - `src/app/console/ConsoleDock.tsx`
    - already falls back to `workspaceSelection.resolvedContentSelection` for selected-set operations
    - confirms that selected content already has a working app-wide payload beyond Browser row state
  - `src/app/panels/BrowserPanel.test.tsx`
    - already contains Browser-level multi-select selection proof
    - likely first Browser-level proof target for Browser-driven selected-set hide and show behavior
  - `src/app/components/ViewerHost.test.tsx`
    - likely needed if we want end-to-end proof that viewport-driven content selection also participates in Browser-eye selected-set hide and show behavior
- `src/app/panels/browserInteractions.test.ts`
    - already contains shared visibility interaction proof
    - good focused target for proving that selected-row eye clicks resolve from the shared selected-content payload rather than Browser-row-local selection reconstruction
- retained family tracking doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-13 - Phase 5 Family - Selected Row Eye Selected-Set Attempts.md`
  - now retained as closed implementation history for the shipped fix rather than as an open debugging surface
- locked Phase 5 in-scope:
  - making one selected eligible row eye apply its explicit hide or show intent to the current eligible selected content set
  - preserving ordinary single-row eye behavior when there is no meaningful selected content set or the clicked row is outside that set
  - reusing `workspaceSelection.resolvedContentSelection` plus the existing Browser eligibility and visibility mutation seams instead of inventing a separate selected-set visibility state model
  - adding focused regression coverage for Browser-driven and viewport-driven selected-set hide and show behavior where the shared selected-content payload exists
- locked Phase 5 out-of-scope:
  - new visibility semantics for unsupported row kinds
  - isolate, solo, layers, visibility presets, or hierarchy changes
  - changing Browser selection rules or row-eye presentation language
  - widening the work into Console, keyboard, or viewer-first parity in the same pass
- preferred Phase 5 implementation shape:
  1. Start from the clicked Browser row eye and determine whether that row belongs to the current shared selected content set.
  2. If not, preserve the current single-row behavior exactly.
  3. If yes, resolve the selected content payload from `workspaceSelection.resolvedContentSelection` first, including its grouped row membership and visibility-ready part keys.
  4. Use the clicked row's current visible or hidden state to derive one explicit target visibility state for that selected content payload.
  5. Feed that explicit target state through the same shared Browser visibility mutation path already used for one row, just applied over the selected content payload instead of inventing a separate batch-only setter.
  6. Keep mixed eligible and ineligible selections honest by only operating on the eligible subset of the shared selected content payload and leaving unsupported content unchanged.
  7. If `Phase 4` parent/reference-backed parity still matters for this selected-set action, decide whether `WorkspaceResolvedContentSelection` needs widening beyond `partKeys` plus `groupedRowIds` so the eye can represent both rendered-part and reference-backed visibility targets through one shared payload.
  8. Do not add a Browser-only fallback that rebuilds the selected set from highlighted Browser rows unless the shared selected-content payload is proven unavailable for a supported surface.
- concrete implementation targets:
  - `src/app/store/useAppStore.ts`
    - first place to inspect if `WorkspaceResolvedContentSelection` needs widening beyond `partKeys` plus `groupedRowIds`
    - first place to verify whether viewport-driven selection should call `setWorkspaceResolvedContentSelection(...)` more explicitly for grouped content
  - `src/app/panels/useBrowserPanelController.ts`
    - likely best place to pass the shared selected-content payload into Browser-eye behavior more explicitly
  - `src/app/panels/browserInteractions.ts`
    - likely needs a `resolvedContentSelection`-first wrapper around the current row visibility dispatch path or a helper that applies one explicit target state to one selected content payload
  - `src/app/panels/browserTreeRowPresenter.tsx`
    - likely should remain unchanged unless the row handler signature must widen beyond one clicked row
  - `src/app/components/ViewerHost.tsx`
    - inspect only if viewport-driven content selection needs more explicit payload synchronization before Browser-eye selected-set hide can trust the shared selection state
  - `src/app/panels/BrowserPanel.test.tsx`
    - good place for Browser-eye integration proof against shared selected-content state
  - `src/app/components/ViewerHost.test.tsx`
    - good place for viewport-driven selected-content proof if the phase explicitly promises Browser-or-viewport selection support
  - `src/app/panels/browserInteractions.test.ts`
    - good place for focused shared-selected-content fan-out coverage
- verification goals:
  - selected visible eligible content set plus clicked selected `Hide` eye:
    all eligible selected content becomes hidden
  - selected hidden eligible content set plus clicked selected `Show` eye:
    all eligible selected content becomes visible
  - clicked row outside the current selected content set:
    only that row changes
  - Browser-driven multi-selection:
    Browser eye uses the shared selected-content payload instead of Browser-row-local reconstruction
  - viewport-driven multi-selection:
    Browser eye can hide or show the shared selected-content payload when the clicked Browser row belongs to that same selected set
  - payload-first routing:
    Browser eye behavior continues to work even when Browser row highlighting is not sufficient on its own, as long as `resolvedContentSelection` is correct
  - selected content set with one clicked row already at the target state:
    targets already matching the requested end state stay stable while remaining eligible selected content still converges correctly
  - mixed eligible and ineligible selection:
    only the eligible subset changes
  - already-in-target-state rows:
    remain stable without creating contradictory toggles
- Questions / Decisions:

  #### [ ] q5.1 - Should the clicked selected row eye define the target visibility state for the full eligible selected content set?

  Question:
  - when the user clicks `Hide` or `Show` on a row that is already part of the current selected content set, should that clicked control define the explicit target state for the whole eligible selected content set?

  Suggestion:
  - yes
  - this keeps the action explicit and avoids inventing a second selected-set-only toggle language

  #### [ ] q5.2 - Should Browser preserve single-row eye behavior when the clicked row is outside the current selected content set or that set only targets one item?

  Question:
  - if the user clicks the eye on a row that is not part of the current selected content set, or there is no meaningful selected content set yet, should Browser keep the existing one-row hide or show behavior?

  Suggestion:
  - yes
  - selected-set fan-out should only happen when the user is clearly acting inside a meaningful shared selected-content state

  #### [ ] q5.3 - Should Phase 5 operate only on the eligible subset of the current selected content payload instead of widening visibility semantics?

  Question:
  - when the current selected content payload includes row kinds that still do not participate in the Browser visibility contract, should the selected-row eye apply only to the eligible subset and leave unsupported content unchanged?

  Suggestion:
  - yes
  - keep the phase honest and reuse existing visibility truth rather than widening semantics under selection

  #### [ ] q5.4 - Should Phase 5 stay focused on Browser-eye behavior even though it should trust shared cross-surface selected-content state?

  Question:
  - should `Browser-13 - Phase 5` land first as a Browser row-eye behavior follow-on that trusts shared selected-content state, without also widening the same behavior into right-click menus, Console commands, or keyboard shortcuts?

  Suggestion:
  - yes
  - keep the implementation small while still rooting it in the stronger app-wide selection contract

  #### [ ] q5.5 - Should Phase 5 fix `resolvedContentSelection` synchronization first if viewport-driven grouped selection does not already populate that payload strongly enough?

  Question:
  - if viewport-driven grouped content selection can exist without a trustworthy `workspaceSelection.resolvedContentSelection`, should `Phase 5` first fix that synchronization seam instead of teaching the Browser eye to inspect viewport selection through a separate path?

  Suggestion:
  - yes
  - keep one selected-content authority for Browser, Viewer, and Console instead of adding a second visibility-only selection path

## [ ] Browser-13 - Phase 6 - Part Row Eyeballs In Browser

- sixth concrete Browser-13 usability and cleanup slice
- locked direction:
  - make the Browser eyeball work reliably for eligible `Part` rows through the existing part visibility seam
  - keep this phase Browser-owned and narrow:
    no new visibility model, no Browser-only part state, no isolate mode, and no hierarchy or ownership changes
  - reuse the same shared row-eye surface already used elsewhere in Browser instead of inventing a part-only control language
  - keep hidden part rows present and restorable in place through the normal Browser hidden-state treatment
- why this exists:
  - after shipped `Phase 4` and `Phase 5`, part rows are the remaining obvious Browser visibility surface that can still feel inconsistent or incomplete
  - users naturally expect the row-local eye on a `Part` row to behave like the rest of Browser visibility:
    click `Hide` to hide that part, click `Show` to restore it
  - this belongs in Browser-13 because it is a row-surface cleanup follow-on that should reuse the existing part visibility truth instead of reopening deeper scene-management rules
- first-pass direction:
  - verify whether eligible part rows already render the normal Browser eye everywhere they should
  - verify whether clicked part-row eyes actually mutate the intended `partKey` visibility state and stay restorable in place
  - tighten any presenter, row-VM, or interaction seams needed so Browser part-row eye behavior feels as reliable as object and parent-row eye behavior
  - keep ineligible rows honest:
    rows without real part visibility membership should not gain a misleading eye affordance
- implementation prep that matters:
  - the live Browser row presenter already has a part-row visibility branch, so `Phase 6` should not be framed as inventing the part eye from scratch without first proving the actual remaining gap
  - the live Browser interaction path already routes `part` rows through the shared `handleToggleContentVisibility(...)` path using `visibilityPartKeys`
  - that means the likely remaining work is narrower:
    prove whether Browser part-row eye rendering, part-key wiring, or restore-in-place behavior is still incomplete or inconsistent in live use
  - keep this phase on the existing part visibility truth rather than widening `Phase 6` into selected-set part behavior, Console grammar, or keyboard parity
- implementation-prep read:
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
- success condition:
  - eligible visible `Part` rows show the normal Browser eye and can hide in one click
  - eligible hidden `Part` rows keep the normal Browser eye and can show in one click
  - clicked part-row eyes operate on the intended `partKey` visibility state instead of a broader unintended target set
  - hidden part rows remain understandable and restorable in place through the Browser tree
  - object, parent, sketch, and reference row eye behavior does not regress
- current live Phase 6 seams:
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
- locked Phase 6 in-scope:
  - Browser part-row eye rendering and hide/show behavior
  - restore-in-place treatment for hidden part rows
  - row-VM, presenter, and interaction cleanup needed to make part-row eye behavior feel coherent with the rest of Browser
  - focused Browser and interaction proof for part-row eye behavior
- locked Phase 6 out-of-scope:
  - part multi-select hide/show semantics beyond the current shipped Browser visibility ladder
  - Console, keyboard, or viewer-first parity work
  - new part hierarchy semantics, isolate/solo, layers, or visibility presets
  - Browser selection-model changes
- preferred Phase 6 implementation shape:
  1. Start by proving the real live part-row eye gap instead of assuming the current part branch is entirely absent.
  2. If the gap is real, trace it backward through `BrowserPartTreeRowVm` truth and the current `partsVisibility` seam before changing presenter code.
  3. Reuse the existing Browser eye rendering path and `handleToggleContentVisibility(...)` route instead of adding a part-only setter or part-only button behavior.
  4. Keep hidden part rows present and restorable in place through the same Browser tree treatment expected elsewhere.
  5. Add narrow Browser-level and interaction-level proof so future visibility cleanup does not regress part-row eyes again.
- concrete implementation targets:
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
  - `src/app/panels/browserInteractions.test.ts`
- retained detail doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-13 - Phase 6 - Part Row Eyeballs In Browser.md`
- verification goals:
  - visible part row plus clicked `Hide` eye:
    that part becomes hidden
  - hidden part row plus clicked `Show` eye:
    that part becomes visible
  - repeated hide/show on the same part row remains stable
  - hiding a part does not accidentally widen into object-wide or selection-wide behavior unless some other shipped phase explicitly owns that behavior
  - Browser tree presentation remains understandable after part rows are hidden
- Questions / Decisions:

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

### Implementation Direction

- start from the current Browser row presenter and Browser surface CSS
- identify row-family branches that exist only because older Browser phases landed incrementally
- collapse those branches into a smaller shared visual language where possible
- tune state surfaces so hover, selection, loading, error, and disabled treatments feel related instead of individually tuned
- treat shipped `Phase 1` overflow containment and shipped `Phase 2` resize affordances as settled groundwork while doing later Browser-13 cleanup
- verify each cleanup change against the current Browser behavior so the phase remains polish-only

### Questions / Decisions

#### [ ] q1 - Should this phase stay strictly presentation-only instead of reopening Browser ownership or drag behavior?

Question:
- should `Browser-13` stay limited to Browser UI polish and cleanup, leaving any new hierarchy, ownership, or drag behavior changes to separate future phases?

Suggestion:
- yes
- keep `Browser-13` safe, visual, and cleanup-focused

#### [ ] q2 - Should this phase prefer one shared visual language across row families unless a difference carries real meaning?

Question:
- when Browser rows differ today, should `Browser-13` default toward one shared row language unless a specific row family truly needs a distinct treatment to communicate meaning?

Suggestion:
- yes
- reduce one-off styling and let meaning come from a smaller set of purposeful differences

#### [ ] q3 - Should stale CSS and presenter branches be removed as part of the cleanup when they no longer match the current Browser model?

Question:
- if this phase finds dead or obsolete Browser UI branches left behind by earlier work, should the cleanup remove them instead of only layering more polish on top?

Suggestion:
- yes
- the cleanup should leave the Browser UI codepath simpler, not just prettier

#### [ ] q4 - Should small hover/action visibility polish be allowed as long as Browser behavior does not change?

Question:
- should `Browser-13` allow small non-behavioral usability polish such as clearer hover affordances or more consistent action visibility, provided the underlying Browser actions and rules remain unchanged?

Suggestion:
- yes
- improve clarity, but do not smuggle in new interaction rules

### Concrete Implementation Targets

Primary expected targets for the remaining open Browser-13 cleanup:
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting targets if needed:
- `src/app/panels/browserTreeRowActions.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserTreeRowPresenter.test.tsx`
- `src/app/store/useAppStore.ts`

Historical Browser-13 foundation targets already used by shipped `Phase 1` and `Phase 2`:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/theme/shell/windows.css`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/workspace/useWorkspaceStore.ts`

### Tests

- shipped Browser-13 overflow containment from `Phase 1` remains intact while later cleanup work lands
- shipped Browser-13 resize affordances from `Phase 2` remain intact in docked and floating Browser modes
- Browser row families still render the same underlying truth while spacing and alignment become more consistent
- selected, hovered, loading, error, and disabled states remain visually distinct and readable after the cleanup
- Browser action affordances stay discoverable without changing their behavior
- eligible authored `Assembly` / `Component` rows expose the same clear row-eye affordance users expect elsewhere in Browser
- imported-object, part, container, and utility rows still read correctly after shared-surface cleanup
- no existing Browser drag, selection, or action behavior regresses during the polish pass

### Assumptions

- the Browser now needs a calmer cleanup pass more than another structural rewrite
- enough Browser UI inconsistency has accumulated across shipped phases to justify one dedicated cleanup phase
- the best version of this phase improves cohesion and removes stale seams without changing Browser truth
- making this umbrella doc the main Browser-13 planning surface will keep later Browser cleanup work easier to track than relying on the split `Phase 1` and `Phase 2` records alone
