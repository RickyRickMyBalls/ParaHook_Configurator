# AutoDraftFinal Phase 7 - Clear Old Comparison Baseline After Commit

## Doc Header

### Doc History
6. 2026-04-14 00:01: Completed `Phase 7.4 - Host Read-Through Proof For Post-Commit Cleanup` by adding one focused `ViewerHost` proof that starts from the same two-branch live branch-local comparison shape, then flips only the interaction state to settled while deliberately leaving the graph-scoped browser interaction flag behind, locking the intended read-through: the viewer now receives the settled draft winner as a plain `lastLoaded` base layer with no `baselineParts` and no overlay instead of continuing to render the old branch-local comparison baseline
5. 2026-04-13 23:58: Completed `Phase 7.3 - Selector Proof For Post-Commit Cleanup` by adding one focused selector proof that keeps the exact same two-branch graph, committed baseline inputs, and rebuilt-only changed branch from the live branch-local interaction case, then flips only the interaction state to settled and locks the post-commit contract: the winner remains visible as settled `lastLoaded` draft truth while the old branch-local comparison baseline disappears and the recipe collapses back to `base-only`
4. 2026-04-13 23:54: Completed `Phase 7.2 - Clear The Old Baseline At Settle` by tightening the viewport-facing interaction signal so selector-owned comparison layering now requires both the graph-scoped browser interaction flag and active UI interaction, which cleanly separates lingering scheduler interaction state from actual user comparison time; `buildViewportResultSelectorOptions.ts` now gates `isInteractionActive` on `isInteracting`, `ViewerHost.tsx` and `ViewportOverlay.tsx` both thread that UI interaction signal into the selector options, and the selector-options unit coverage now locks that a lingering browser build interaction without active UI interaction must already be treated as settled for viewport purposes
3. 2026-04-13 23:39: Completed `Phase 7.1 - Find The Settled Baseline Leak` by tracing the post-commit old-baseline path through selector, app interaction flags, and `ViewerHost`, then locking the seam attribution: the settled comparison baseline is not primarily leaking from the selector's settled recipe, because branch-local retained-baseline layering is still gated on `isInteractionActive`; the stronger primary seam is the interaction lifecycle that still feeds `isInteractionActive` from `browserInteractionGraphDocumentIds`, with `committedInteractionBaselineRef` as the secondary bridge that keeps the old baseline snapshot alive until interaction is truly cleared
2. 2026-04-13 23:36: Prepped `Phase 7.1` through `Phase 7.5` for implementation by turning each sub-phase into a concrete code slice with current live seam read, exact file targets, implementation target, verification bar, and stop rule so the post-commit comparison-baseline cleanup can land as one narrow follow-up instead of another vague viewport cleanup pass
1. 2026-04-13 23:34: Added `Phase 7 - Clear Old Comparison Baseline After Commit` as the next narrow post-Phase-6 follow-up after the disconnect slice closed, making the next remaining viewport issue explicit: once the user releases, commits, or explicitly builds, the old changed-part `last committed` comparison geometry should disappear instead of lingering underneath the new winner, so this phase now has one dedicated home for that cleanup without reopening the stale-visible-result disconnect work

### Purpose

This doc defines the next narrow follow-up phase under `AutoDraftFinal`.

Use it to answer:
- when the old changed-part comparison baseline should stop being visible
- how commit, on-release promotion, and manual build should clear that baseline
- where selector, host, or interaction bridge state may still let the old baseline linger
- how to prove this cleanup without breaking unchanged-geometry stability

### Why This Phase Exists

Today the family already has:
- a frozen mode and timing matrix
- selector-owned layer-recipe meaning
- explicit committed-baseline ownership
- a thinner `ViewerHost`
- a full nine-state proof matrix
- a closed disconnect fix where stale accepted geometry no longer survives after `Output Preview` loses continuation

That is enough for disconnect truth.

It is not yet enough for ordinary post-commit cleanup.

Current product read:
- during live interaction, the changed part may keep its old blue comparison baseline
- that baseline is useful only while the user is still comparing old versus new
- once the user releases, commits, or explicitly builds, that old comparison baseline should disappear
- after that point, the viewport should show only:
  - unchanged committed geometry
  - the new winning changed geometry

This phase exists to close that lingering-comparison-baseline gap without widening back into disconnect rules or family-wide redesign.

### Scope

This phase covers:
- clearing the old changed-part comparison baseline after:
  - live release
  - on-release commit
  - manual explicit build start
- selector and/or host cleanup needed to stop rendering that old baseline after commit
- proof that unchanged sibling geometry remains stable while the changed-part comparison baseline disappears

This phase does not cover:
- disconnected `Output Preview` stale-result clearing
- broad runtime lifecycle redesign
- new mode-family behavior
- worker invalidation changes

## Doc Body

## [ ] Phase 7 - Clear Old Comparison Baseline After Commit

### Header

Purpose:
- make the old changed-part comparison baseline disappear once the user commits, releases, or explicitly builds

Owns:
- post-commit comparison-baseline clearing
- live-to-settled cleanup of changed-part retained comparison layers
- proof that the winner remains visible while the old baseline goes away

Does not own:
- disconnect clearing
- broad baseline ownership redesign
- new mode semantics

### Current Constraints

This phase starts from the landed groundwork in:
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Vision.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 3 - Explicit Committed Baseline Ownership.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 4 - Simplify ViewerHost To Render The Recipe.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 5 - Full Nine-State Proof Matrix And Residue Removal.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 6 - Clear Selector-Visible Geometry On Output Disconnect.md`

Locked starting constraints:
- the old comparison baseline is useful only during active comparison
- unchanged geometry stability must remain intact
- the new winner must stay visible while the old baseline is cleared
- this phase should stay separate from the already-closed disconnect bug

Current likely seams this phase should read against:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

Current code-backed suspicion:
- selector-owned recipe meaning is now strong, but commit-time cleanup may still be inheriting:
  - retained-base presentation
  - committed interaction baseline bridge state
  - old branch-local assumptions from interaction
- the remaining issue is likely not "which result wins" but "when old comparison baseline state is cleared"

Important current-reality rule:
- after commit or release, the viewport should stop showing "before" and "after" for the changed part at the same time unless a mode explicitly requires comparison, which the current family does not

### Locked Direction

#### 1. The old comparison baseline is interaction-only

The guiding rule for this phase is:
- the old changed-part blue comparison baseline is only valid during active comparison

That means:
- active drag may show:
  - unchanged geometry
  - old changed-part baseline
  - new preview overlay
- settled post-commit state should not keep the old changed-part baseline visible

Important rule:
- do not let interaction comparison state leak into settled state

#### 2. Clearing the baseline must not clear the winner

The fix must preserve:
- unchanged committed geometry
- the new winning changed geometry

It must only remove:
- the old changed-part comparison baseline

Important rule:
- do not solve this by blanking the whole viewport or by suppressing the new winner

#### 3. Live, on-release, and manual should all clear the old baseline at their settle point

The settle point is:
- `Live`
  - when drag ends
- `On Release`
  - when release starts the visible winner transition
- `Manual`
  - when explicit build starts the visible winner transition

Important rule:
- the timing of the settle point differs by policy
- the cleanup rule should remain shared

### Implementation Target

`Phase 7` should make one behavior shift real:

- once the state is no longer an active comparison state, the old changed-part baseline is not rendered

The minimum meaningful behavior change should be:
1. user drags one changed branch and sees old versus new
2. user releases or builds
3. old changed-part comparison baseline disappears
4. new winner remains visible
5. unchanged sibling geometry remains stable

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

This phase is only done if it proves both:
- the old changed-part comparison baseline disappears after settle
- the new winner and unchanged geometry remain correct

Required proof:
- one selector proof for post-commit baseline clearing
- one host read-through proof that settled layers no longer include the old baseline

### Suggested Phase Ladder

## [x] Phase 7.1 - Find The Settled Baseline Leak

Goal:
- identify whether the lingering old baseline is selector-owned, host-bridge-owned, or both

Owns:
- tracing the settled-state leak seam through selector recipe and host bridge state

File targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`

Current live read:
- selector-owned recipe meaning is already responsible for:
  - visible winner
  - base, baseline, and overlay recipe shape
- `ViewerHost.tsx` still owns:
  - committed interaction baseline bridge lifecycle
  - read-through of selector-owned layers into viewer layers
- the likely leak is one of:
  - selector still emitting `baselineParts` after settle
  - host bridge retaining old committed interaction baseline beyond active comparison
  - both

Implementation target:
- name the exact settled-state leak seam before changing behavior
- confirm whether the comparison baseline survives because:
  - recipe still asks for it
  - bridge state still feeds it
  - or both

Verification bar:
- the seam attribution must be precise enough that `Phase 7.2` can patch one owner first instead of guessing

Done when:
- the exact settled-state leak seam is named before code changes begin

Landed result:
- primary seam:
  - app and host interaction lifecycle
  - `buildViewportResultSelectorOptions.ts` still feeds `isInteractionActive` directly from `browserInteractionGraphDocumentIds`
  - `selectViewportResultState.ts` only emits the branch-local retained-baseline recipe while `isInteractionActive` is true
- secondary seam:
  - `ViewerHost.tsx` keeps `committedInteractionBaselineRef`
  - that bridge only refreshes once interaction is no longer active
- locked read:
  - this does not look like a settled selector recipe leak first
  - it looks like interaction state and its bridge snapshot are staying alive too long after commit or release

Verification result:
- code-read attribution only
- no runtime code or tests changed in this sub-phase

Important rule:
- do not start deleting bridge state or recipe branches before the leak owner is clear

Stop rule:
- stop once the settled baseline leak is attributable to a named seam

## [x] Phase 7.2 - Clear The Old Baseline At Settle

Goal:
- change the code so the old changed-part comparison baseline is no longer rendered once the state settles

Owns:
- the narrow behavior fix that removes old changed-part baseline visibility after settle

File targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- possibly `src/app/components/ViewerHost.tsx` only if the leak is host-bridge-owned

Current live read:
- the winner itself is already correct more often than not
- the remaining problem is stale comparison-baseline visibility after settle
- this should likely be expressed as:
  - no branch-local retained-baseline recipe after settle
  - no stale committed interaction baseline feeding settled layers

Implementation target:
- remove the old changed-part baseline from settled states while preserving:
  - unchanged geometry
  - the new winning changed geometry

Verification bar:
- settled states must no longer render old comparison baseline geometry
- the new winner must remain visible

Done when:
- settled states no longer keep the old changed-part baseline visible

Important rule:
- clear only the old comparison baseline
- do not disturb the winner or unchanged geometry

Stop rule:
- stop once settled states no longer emit the old comparison baseline

Landed result:
- `buildViewportResultSelectorOptions.ts` no longer treats graph-scoped browser build interaction as sufficient for viewport comparison layering on its own
- selector-facing `isInteractionActive` now requires:
  - the graph-scoped browser interaction flag
  - active UI interaction via `isInteracting`
- `ViewerHost.tsx` and `ViewportOverlay.tsx` both now pass that UI interaction signal into the selector options
- this keeps scheduler interaction state available for build-policy and release queue ownership while preventing the viewport from carrying the old changed-part comparison baseline after the real interaction has already ended

Verification result:
- targeted selector-options proof added to lock the new settle-time interaction contract

## [x] Phase 7.3 - Selector Proof For Post-Commit Cleanup

Goal:
- add one focused selector proof for old-baseline clearing after settle

Owns:
- one focused selector proof for the post-commit cleanup rule

File targets:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Current live read:
- the selector suite already proves:
  - branch-local comparison layering during interaction
  - settled winners across the mode/policy matrix
- it does not yet prove the transition from:
  - active comparison with old baseline
  - to settled winner without old baseline

Implementation target:
- add one test that captures the exact settle point:
  - old baseline present during interaction
  - old baseline gone after settle
  - winner still visible

Verification bar:
- the selector proof must lock:
  - no settled `baselineParts`
  - no settled branch-local comparison recipe
  - winner still present

Done when:
- the selector suite locks that post-commit state keeps the winner but drops the old comparison baseline

Important rule:
- keep this as one focused settle proof, not another full matrix expansion

Stop rule:
- stop once the selector has one durable proof for post-commit baseline clearing

Landed result:
- `selectViewportResultState.test.ts` now includes one focused settle-transition proof that reuses the same two-branch graph shape and committed interaction baseline inputs as the live branch-local interaction case
- the proof locks the exact post-commit cleanup contract:
  - active comparison can have branch-local retained-baseline layering
  - settled state must not keep `baselineParts`
  - settled state must not keep a branch-local recipe kind
  - the changed winner remains visible as settled `lastLoaded` draft truth

Verification result:
- targeted selector suite coverage only in this sub-phase

## [x] Phase 7.4 - Host Read-Through Proof For Post-Commit Cleanup

Goal:
- prove the settled no-old-baseline state reaches the viewer correctly

Owns:
- one focused host read-through proof for settled post-commit cleanup

File targets:
- `src/app/components/ViewerHost.test.tsx`

Current live read:
- the host suite already proves:
  - branch-local interaction layering
  - settled base-only and overlay read-through
  - disconnect empty-layer read-through
- it does not yet prove the settle transition where old baseline disappears but the winner remains

Implementation target:
- add one host proof that locks:
  - no settled `baselineParts`
  - winner still present in `baseParts` or `overlayParts` as appropriate

Verification bar:
- the host proof must confirm the old comparison baseline is gone without blanking the whole viewport

Done when:
- the host suite locks that settled layers do not include the old changed-part baseline

Important rule:
- keep the host proof read-through only
- do not reintroduce host-owned behavior decisions here

Stop rule:
- stop once the host proves the settled state no longer renders the old baseline

Landed result:
- `ViewerHost.test.tsx` now includes one focused settle-transition read-through proof that starts from the same two-branch live branch-local comparison setup as the interaction proof, then flips only the interaction state to settled while deliberately leaving the graph-scoped browser interaction flag behind
- the proof locks the intended post-commit viewer contract:
  - no settled `baselineParts`
  - no settled overlay
  - the changed winner still renders as the settled `lastLoaded` base

Verification result:
- targeted host suite coverage only in this sub-phase

## [ ] Phase 7.5 - Verification And Stop

Goal:
- verify the cleanup and stop before widening into new viewport behavior changes

Owns:
- targeted verification for the post-commit cleanup slice

Verification:
- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm test -- src/app/components/ViewerHost.test.tsx`

Implementation target:
- verify the narrow post-commit cleanup fix and stop
- leave any further visual cleanup for a later slice if new evidence appears

Verification bar:
- both targeted suites pass
- the old-baseline settle issue is closed as a narrow cleanup

Done when:
- both targeted suites pass
- the post-commit old-baseline issue is closed without reopening disconnect cleanup or family-wide redesign

Important rule:
- do not piggyback new viewport behavior changes onto this verification step

Stop rule:
- stop once the targeted suites pass and the old-baseline settle bug is closed
