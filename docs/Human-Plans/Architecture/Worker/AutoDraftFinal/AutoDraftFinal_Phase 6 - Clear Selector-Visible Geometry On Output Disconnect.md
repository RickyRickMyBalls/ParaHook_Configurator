# AutoDraftFinal Phase 6 - Clear Selector-Visible Geometry On Output Disconnect

## Doc Header

### Doc History
6. 2026-04-13 23:30: Completed `Phase 6.4 - Verification And Stop` and closed the overall `Phase 6` slice after re-running the targeted selector plus host suites, confirming the disconnect fix remains isolated to selector-visible stale-result clearing and empty-layer read-through, and explicitly stopping before widening into the separate post-commit comparison-baseline cleanup question
5. 2026-04-13 23:29: Completed `Phase 6.3 - Host Empty-Layer Read-Through Proof` by adding one focused `ViewerHost.test.tsx` proof where accepted final geometry still exists in runtime but `Output Preview` is disconnected, then locking that the viewer receives empty `base`, `baseline`, and `overlay` layers, with both targeted host plus selector vitest suites still green
4. 2026-04-13 23:27: Completed `Phase 6.2 - Selector Proof For Disconnected Output` by adding one explicit selector test that keeps accepted authoritative geometry in runtime inputs while disconnecting `Output Preview`, then locking that the selector returns no visible result, no retained base, no overlay, and an empty recipe, with both targeted selector and host vitest suites still green on top of the landed `Phase 6.1` guard
3. 2026-04-13 23:25: Completed `Phase 6.1 - Selector Disconnect Guard` by tightening `selectViewportResultState.ts` so accepted authoritative, accepted draft, and preview-ready authoritative visibility all respect current output continuation when `previewPreparation` exists, narrowing the fix back to disconnect truth after confirming explicit member-publication final rendering still needs to remain valid, and keeping both selector plus host targeted vitest suites green without widening into baseline cleanup or new proofs yet
2. 2026-04-13 23:10: Prepped `Phase 6.1` through `Phase 6.4` for implementation by turning each sub-phase into an explicit code slice with current live seam read, exact file targets, implementation target, proof bar, and stop rule so the disconnect fix can land as one narrow selector-first patch set instead of another vague cleanup pass
1. 2026-04-13 23:07: Reworked `Phase 6 - Clear Selector-Visible Geometry On Output Disconnect` into the older worker-phase implementation format with explicit `## [ ]` sub-phases after live research showed the disconnect bug is most likely a selector-visible stale-result gap: retained fallback geometry already clears on dependency break, but current accepted geometry can still appear to survive after `Output Preview` loses all continuation, so this phase now has one implementation-ready home for fixing visible-result truth before any separate comparison-baseline wipe cleanup

### Purpose

This doc defines the next narrow follow-up phase under `AutoDraftFinal`.

Use it to answer:
- why disconnecting all `Output Preview` wires can still leave geometry visible
- where selector-visible stale-result truth should clear accepted geometry
- how to prove the disconnect path all the way through selector and host
- how to keep this fix separate from the later question of wiping old comparison baseline geometry after ordinary commit

### Why This Phase Exists

Today the family already has:
- a frozen mode and timing matrix
- selector-owned layer-recipe meaning
- explicit committed-baseline ownership
- a thinner `ViewerHost`
- a full nine-state proof matrix

That is enough for the main family contract.

It is not enough for the disconnect edge case.

Current live read:
- retained fallback geometry already clears when the current dependency graph no longer resolves the output
- but current accepted visible geometry can still survive if it remains renderable
- disconnecting every `Output Preview` wire should mean:
  - no current output continuation
  - no visible geometry
- instead, old accepted geometry can still appear to linger

This phase exists to close that stale-visible-result gap without widening into runtime redesign or general post-commit baseline cleanup.

### Scope

This phase covers:
- selector-visible disconnect and dependency-break clearing for accepted geometry
- disconnect protection for:
  - accepted authoritative geometry
  - accepted draft geometry
  - preview-ready authoritative geometry
- one selector proof for disconnected output
- one host read-through proof for empty viewer layers after disconnect

This phase does not cover:
- broad runtime accepted-result lifecycle redesign
- ordinary post-commit comparison-baseline wipe timing
- new mode-family behavior
- viewer-engine changes

## Doc Body

## [x] Phase 6 - Clear Selector-Visible Geometry On Output Disconnect

### Header

Purpose:
- make a disconnected `Output Preview` show no geometry by fixing selector-visible stale-result truth first

Owns:
- selector-visible clearing when `Output Preview` has no valid continuation
- disconnect protection for accepted and preview-ready geometry lanes
- proof that disconnect produces empty viewport layers

Does not own:
- broad runtime cleanup
- post-commit comparison-baseline wipe behavior
- new `Auto / Draft / Final` mode semantics

### Current Constraints

This phase starts from the landed groundwork in:
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Vision.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 2 - Selector-Owned Viewport Layer Recipe.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 3 - Explicit Committed Baseline Ownership.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 4 - Simplify ViewerHost To Render The Recipe.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 5 - Full Nine-State Proof Matrix And Residue Removal.md`

Locked starting constraints:
- selector-owned recipe meaning must remain the owner of visible-result truth
- `ViewerHost.tsx` should remain a consumer, not become the place that patches disconnect semantics
- this fix should stay narrow and avoid reopening the whole family
- the disconnect bug should be solved before the separate baseline-wipe question is widened into code

Current live seams this phase should read against:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

Current code-backed read:
- `selectViewportResultState.ts`
  - already clears retained fallback geometry through:
    - `hasCurrentOutputContinuation(...)`
    - `doesCurrentOutputMatchGeometryResultPartKeys(...)`
    - `resolveRetainedBaseCandidate(...)`
  - still promotes current accepted geometry whenever it remains renderable and mode allows it
  - therefore still allows the stale-visible-result path after disconnect
- `ViewerHost.tsx`
  - now mostly consumes selector-owned recipe truth
  - is therefore unlikely to be the primary cause if stale geometry stays visible
- existing tests
  - already prove retained geometry clears when the current dependency graph no longer resolves the output
  - do not yet prove that current accepted visible geometry is also blocked by the same disconnect

Important current-reality rule:
- disconnecting all `Output Preview` wires should behave as "this viewport currently has no output"
- the viewport should therefore show no geometry, not an old accepted result and not an old comparison baseline

### Locked Direction

#### 1. Disconnect should be treated as a hard visible-result break

The guiding rule for this phase is:
- if `Output Preview` has no valid continuation, there is no current visible result

That means:
- accepted authoritative geometry is not visible
- accepted draft geometry is not visible
- preview-ready authoritative geometry is not visible
- retained base is cleared
- overlay is cleared

Important rule:
- do not let "still renderable in runtime" outrank "no current output continuation"

#### 2. The fix should live in selector-visible truth, not in host suppression

The host should not become the owner of:
- disconnect detection
- stale accepted result blocking
- special empty-layer patches for this case

Important rule:
- fix the selector's winner rules first
- let the host inherit the fix through the existing recipe contract

#### 3. This phase should stay separate from post-commit baseline wipe cleanup

There is a related but separate rule:
- after ordinary release or commit, the old changed-part comparison baseline should go away

That is not the first target here.

Important rule:
- baseline wipe alone will not solve the disconnect bug if stale accepted geometry still wins as the visible result

### Implementation Target

`Phase 6` should make one contract shift real:

- dependency-break clearing should apply to selector-visible accepted lanes, not only retained fallback lanes

The minimum meaningful behavior change should be:
1. `Output Preview` loses all valid continuation
2. accepted authoritative geometry still exists in runtime state
3. selector returns no visible geometry
4. host renders empty layers

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Likely supporting files:
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

This phase is only done if it proves both:
- selector-visible stale accepted geometry is blocked after disconnect
- viewer layers are empty after disconnect

Required proof:
- disconnecting all `Output Preview` wires yields:
  - `visibleResultClass = null`
  - `visibleSourceKind = 'none'`
  - cleared retained base
  - cleared overlay
- host read-through yields:
  - `baseParts = []`
  - `baselineParts = []`
  - `overlayParts = []`

### Implementation Order

1. Tighten selector-visible disconnect rules.
2. Add the focused selector proof.
3. Add the focused host read-through proof.
4. Re-run targeted suites and stop.

### Landed Result

- `selectViewportResultState.ts`
  - now treats disconnected `Output Preview` as a hard visible-result break whenever `previewPreparation` exists
  - no longer lets accepted authoritative, accepted draft, or preview-ready authoritative geometry remain visible solely because they are still renderable
- `selectViewportResultState.test.ts`
  - now locks the disconnect case where accepted final geometry still exists in runtime but must not stay visible
- `ViewerHost.test.tsx`
  - now locks the matching read-through case where the cleared selector state reaches the viewer as empty `base`, `baseline`, and `overlay` layers

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

## [x] Phase 6.1 - Selector Disconnect Guard

### Goal

- make selector-visible current accepted geometry obey the same disconnect and dependency-break truth already used by retained fallback clearing

### Owns

- tightening `selectViewportResultState.ts` so the current visible winner cannot remain:
  - accepted authoritative
  - accepted draft
  - preview-ready authoritative
  when `Output Preview` has no valid continuation

### File Targets

- `src/app/spaghetti/selectors/selectViewportResultState.ts`

### Current Live Read

- `hasCurrentOutputContinuation(...)` already computes the current disconnect truth
- `resolveRetainedBaseCandidate(...)` already uses that truth to clear retained fallback geometry
- the remaining gap is later in `selectViewportResultState(...)`, where current accepted geometry can still win through:
  - visible final selection
  - visible draft selection
  - preview-ready authoritative selection

### Implementation Target

- make the visible winner rules respect disconnect and dependency break before current accepted geometry is promoted
- keep the fix selector-owned:
  - no new host-side disconnect branches
  - no runtime-only workaround

### Verification Bar

- selector behavior must now treat disconnected output as:
  - no visible current result
  - no retained base
  - no overlay

### Done When

- current accepted visible geometry no longer survives just because it remains renderable in runtime state

### Landed Result

- `selectViewportResultState.ts`
  - current accepted authoritative visibility now requires current output continuation when `previewPreparation` exists
  - current accepted draft visibility now requires current output continuation when `previewPreparation` exists
  - preview-ready authoritative visibility now requires current output continuation when `previewPreparation` exists
- scope
  - the fix was intentionally narrowed to disconnect truth
  - explicit member-publication final rendering remains valid and was not widened into part-key-equality enforcement

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Important Rule

- do not widen this sub-phase into baseline wipe timing or runtime cleanup

### Stop Rule

- stop once `selectViewportResultState.ts` can no longer promote stale accepted geometry after disconnect

## [x] Phase 6.2 - Selector Proof For Disconnected Output

### Goal

- add one explicit selector proof for the stale-visible-result disconnect case

### Owns

- one focused selector test where:
  - `Output Preview` exists
  - all slots are disconnected or empty
  - accepted authoritative geometry still exists

### File Targets

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Current Live Read

- the selector suite already proves:
  - retained geometry clears when the current dependency graph no longer resolves the output
  - output membership drops can clear retained visibility
- it does not yet prove the stronger disconnect case where accepted authoritative geometry still exists but must not stay visible

### Implementation Target

- add one focused test that mirrors the live bug:
  - disconnected or empty `Output Preview`
  - accepted authoritative geometry still present
  - expected empty visible result

### Verification Bar

- the new test must lock:
  - `visibleResultClass = null`
  - `visibleSourceKind = 'none'`
  - `retainedBaseState = 'cleared-by-dependency-break'` or equivalent cleared state
  - empty `retainedBaseRenderVm`
  - empty `overlayRenderVm`
  - empty `layerRecipe` parts

### Done When

- the selector proof locks:
  - `visibleResultClass = null`
  - `visibleSourceKind = 'none'`
  - empty retained base
  - empty overlay
  - empty recipe parts

### Landed Result

- `selectViewportResultState.test.ts`
  - now contains one explicit disconnect proof where:
    - `Output Preview` is disconnected
    - accepted authoritative geometry still exists in runtime inputs
    - selector-visible result is empty
  - the proof now locks:
    - no visible result
    - no retained base
    - no overlay
    - empty `layerRecipe`

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Important Rule

- keep this as one explicit disconnect proof, not another broad matrix expansion

### Stop Rule

- stop once the stale-visible-result disconnect case has one durable selector proof

## [x] Phase 6.3 - Host Empty-Layer Read-Through Proof

### Goal

- prove the selector disconnect state reaches the viewer as empty layers

### Owns

- one focused host read-through proof for:
  - empty `baseParts`
  - empty `baselineParts`
  - empty `overlayParts`

### File Targets

- `src/app/components/ViewerHost.test.tsx`

### Current Live Read

- `ViewerHost.tsx` should now inherit this behavior from selector-owned recipe truth
- the host suite already proves:
  - presentational recipe mapping
  - branch-local live behavior
  - settled layer read-through
- it does not yet prove the disconnect path reaches the viewer as empty layers

### Implementation Target

- add one focused host proof where the disconnect-cleared selector state reaches:
  - empty `baseParts`
  - empty `baselineParts`
  - empty `overlayParts`

### Verification Bar

- the host proof should confirm no host-side fallback reintroduces stale geometry after selector clearing

### Done When

- the host suite proves the selector-owned disconnect clearing reaches the viewer without host-side patch logic

### Landed Result

- `ViewerHost.test.tsx`
  - now contains one focused disconnect proof where:
    - accepted final geometry still exists in runtime
    - `Output Preview` has no continuation
    - viewer render layers are empty
  - the proof now locks:
    - `baseParts = []`
    - `baselineParts = []`
    - `overlayParts = []`

### Verification Result

- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass
- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass

### Important Rule

- keep the host proof read-through only
- do not add new host behavior in this sub-phase

### Stop Rule

- stop once the host proves it forwards the cleared selector state as empty layers

## [x] Phase 6.4 - Verification And Stop

### Goal

- verify the narrow disconnect fix and stop before widening into unrelated cleanup

### Owns

- targeted verification:
  - `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `npm test -- src/app/components/ViewerHost.test.tsx`

### Implementation Target

- verify the selector-first disconnect fix as one narrow patch set
- leave any remaining post-commit comparison-baseline question for a later slice unless it still reproduces after this fix

### Verification Bar

- both targeted suites pass
- the disconnect bug can now be described specifically as closed by selector-visible stale-result clearing

### Done When

- both targeted suites pass
- the disconnect bug is closed as a selector-visible stale-result fix
- the later question of post-commit comparison-baseline wipe remains separate unless still proven necessary after this lands

### Landed Result

- targeted verification re-ran cleanly after the 6.1 through 6.3 changes
- the disconnect slice is now complete without widening into additional cleanup

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Important Rule

- fix visible-result truth first
- do not start by wiping the old committed comparison baseline only

### Stop Rule

- stop once disconnecting all `Output Preview` wires reliably yields no visible geometry through selector and host proofs
- stop before widening into the separate post-commit comparison-baseline cleanup unless that issue still remains afterward
