# `VRI-3` - `Change Impact And Dependency Visibility`

## Doc Header

### Doc History
11. 2026-04-09 10:14: Marked `VRI-3.5 - Untouched Truth Hardening And Family Handoff` shipped after the runtime inspector began deriving compact untouched meaning from accepted target-versus-affected ids through the existing `runtimeInspectorVm` summary seam, repeated accepted edits now replace untouched summary truth cleanly in the left-dock proof surface, and `VRI-3` now closes as the first honest change-impact subset before later dependency-linked widening
10. 2026-04-09 10:08: Tightened `VRI-3.5 - Untouched Truth Hardening And Family Handoff` into the implementation-ready next slice by grounding it in the shipped `acceptedBuildImpact` target-versus-affected ids, the current `runtimeInspectorVm` summary-plus-group read seam, the visible left-dock impact surface that now stops before untouched meaning, and the focused store-plus-left-dock proof seams before `VRI-3` closes
9. 2026-04-09 10:05: Marked `VRI-3.4 - Impact Row Surface` shipped after the runtime inspector began rendering grouped rebuilt, reused, and evicted impact rows beneath the compact summary through the existing grouped VM seam, calm row styling, and focused left-dock proof, and the family handoff now moves forward to `VRI-3.5 - Untouched Truth Hardening And Family Handoff`
8. 2026-04-09 10:00: Tightened `VRI-3.4 - Impact Row Surface` into the implementation-ready next slice by grounding it in the shipped grouped `changeImpactGroups` VM, the current `TitleStatusBar` summary-only render boundary, the existing impact-card styling seam in `base.css`, and the focused left-dock proof surface before untouched-truth hardening begins in `VRI-3.5`
7. 2026-04-09 09:56: Marked `VRI-3.3 - Impact Entry VM And Grouping Contract` shipped after the runtime inspector VM gained one grouped accepted-impact entry contract with stable rebuilt, reused, and evicted ordering plus viewer-target label fallback from authored node naming to compact build identity, and focused left-dock proof now covers grouped-contract presence, order, labels, and hidden-before-first-accept behavior before visible row rendering begins in `VRI-3.4`
6. 2026-04-09 09:48: Marked `VRI-3.2 - Compact Change Impact Summary Surface` shipped after the runtime inspector gained one compact viewer-target `Change Impact` summary derived only from the accepted graph-runtime impact snapshot, then tightened `VRI-3.3 - Impact Entry VM And Grouping Contract` into the implementation-ready next slice around accepted impact-entry shaping, viewer-target graph label resolution, and the current summary-plus-left-dock proof seams before visible grouped rows land in `VRI-3.4`
5. 2026-04-09 09:31: Tightened `VRI-3.2 - Compact Change Impact Summary Surface` into an implementation-ready next slice by grounding it in the shipped `acceptedBuildImpact` graph-runtime snapshot, the current combined `runtimeInspectorVm` queue/archive shaping seam, the live `TitleStatusBar` section stack where the first compact `Change Impact` summary should land beneath archive truth, and the focused left-dock proof surface before grouped impact-row VM work begins in `VRI-3.3`
4. 2026-04-09 09:26: Marked `VRI-3.1 - Accepted Impact Read Contract And Store Widening` shipped after `useSpaghettiStore` widened graph runtime state with one durable accepted impact snapshot that copies request-time changed-param and affected-build-unit truth into accepted build identity plus finalized bundle outcomes at acceptance time, and focused store proof now covers null-before-first-accept, accepted snapshot persistence, replacement, and stale-ignore behavior before visible `Change Impact` UI begins in `VRI-3.2`
3. 2026-04-09 09:18: Tightened `VRI-3.1 - Accepted Impact Read Contract And Store Widening` into an implementation-ready first slice by grounding it in the live `buildInputsToRequest` request-time impact derivation, the current `useAppStore` graph-build staging path, the existing `useSpaghettiStore` graph-runtime acceptance seam where pending impact inputs currently clear, and the focused `useSpaghettiStore.test.ts` proof surface before visible change-impact UI widens in `VRI-3.2`
2. 2026-04-09 09:17: Split the broader middle `VRI-3` work into a sharper five-step ladder by separating impact entry/grouping VM work from the later visible impact-row surface, so the change-impact lane now reads as safer to implement one Codex-sized slice at a time before untouched-truth hardening closes the family
1. 2026-04-09 09:10: Added this standalone future phase doc for `VRI-3`, turning the next viewport runtime-inspector lane into a small-chunk execution ladder focused on preserving accepted change-impact truth, surfacing compact rebuilt-versus-reused summary meaning, widening into ownership-aware impact rows, and closing with honest untouched/dependency handoff instead of leaving `VRI-3` as only a one-line umbrella placeholder

### Purpose

Use this doc as the dedicated planning and execution surface for the third `Viewport Runtime Inspector` delivery lane.

The goal here is:
- explain what changed because of the latest accepted edit
- keep rebuilt, reused, evicted, and untouched meaning grounded in accepted runtime truth
- connect impact rows back to graph/build ownership only where the runtime already exposes that meaning
- keep the first impact surface compact and viewport-local instead of turning it into a dependency explorer too early
- break the work into small implementation-ready chunks before later graph-linked dependency visualization grows wider

### Scope

This phase covers:
- accepted change-impact read-model widening for the runtime inspector
- compact summary visibility for the latest accepted edit
- first grouped impact rows tied to accepted build-unit ownership where that truth already exists
- focused hardening for untouched derivation and family handoff

This phase does not cover:
- a full graph dependency browser
- graph-region highlighting or click-through inspection
- speculative invalidation or untouched rows that the accepted runtime cannot support honestly
- queue mutation or scheduler changes already owned by `VRI-2`

## Doc Body

### Summary

`VRI-3` is the dedicated change-impact lane for making the viewport runtime inspector explain the latest accepted edit instead of only the current queue and recent archive.

Current read:
- `VRI-1` already shipped the shell, viewport stats, one current task card, and one combined inspector VM
- `VRI-2` already shipped the active queue, recent archive, and lifecycle hardening
- the missing truth is what the last accepted edit actually did:
  - which params changed
  - which build units were affected
  - what rebuilt
  - what reused prior results
  - what stayed untouched
- the next honest delivery should stay narrow:
  - preserve accepted impact truth first
  - surface compact impact summary second
  - lock impact entry and grouping contracts third
  - render ownership-aware impact rows fourth
  - harden untouched derivation and handoff last

Locked recommendation:
- stage the third delivery in Codex-sized cuts:
  - widen the accepted impact read contract first
  - render summary counts second
  - lock grouped impact VM contracts third
  - render grouped impact rows fourth
  - harden untouched truth and family handoff last
- keep `VRI-3` honest:
  - no fake dependency stories
  - no guessed untouched rows when the runtime lacks the accepted baseline
  - no graph-jump UI yet

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already derives `changedParamIds` plus `affectedBuildUnitIds` for each requested graph build
- `src/app/store/useAppStore.ts`
  - is the current app-owned seam that issues accepted graph builds and stages the request-time change-impact inputs into graph runtime state
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns per-graph runtime truth such as `pendingChangedParamIds`, `pendingAffectedBuildUnitIds`, `latestAcceptedBuildUnitIds`, and `acceptedBuildBundle`, making it the strongest likely owner for a persisted accepted impact snapshot
- `src/app/buildDispatcher.ts`
  - already preserves accepted `changedParamIds` on build results and remains the stale-acceptance owner that should not be duplicated in inspector code
- `src/app/store/runtimeInspectorVm.ts`
  - is the current combined inspector view-model seam and the natural owner for shaping compact change-impact presentation once the underlying accepted truth exists
- `src/app/components/TitleStatusBar.tsx`
  - is the current runtime-inspector presentation seam for the left-dock shell and the strongest owner for a later compact `Change Impact` section beneath the shipped queue/archive surfaces
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - is the strongest store-proof seam for accepted impact snapshot persistence because it already owns graph-runtime acceptance behavior
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for the future impact summary and grouped-row rendering inside the left-dock runtime inspector

### Phase Breakdown

1. `VRI-3.1 - Accepted Impact Read Contract And Store Widening`
Reason:
- the first honest cut is preserving latest accepted impact truth after build settle instead of losing the request-time change inputs when pending state clears
Current status:
- shipped
- current handoff:
  - `VRI-3.2 - Compact Change Impact Summary Surface`

2. `VRI-3.2 - Compact Change Impact Summary Surface`
Reason:
- once accepted impact truth exists in app state, the next smallest useful value is one compact summary showing what changed, what rebuilt, and what reused
Current status:
- shipped
- current handoff:
  - `VRI-3.3 - Impact Entry VM And Grouping Contract`

3. `VRI-3.3 - Impact Entry VM And Grouping Contract`
Reason:
- after the compact summary lands, the next missing truth is the compact VM contract for accepted impact entries, grouping, labels, and tones before visible row rendering widens
Current status:
- shipped
- current handoff:
  - `VRI-3.4 - Impact Row Surface`

4. `VRI-3.4 - Impact Row Surface`
Reason:
- once the grouped impact VM exists, the next missing truth is one visible impact-row section beneath the summary without mixing presentation work back into store/VM widening
Current status:
- shipped
- current handoff:
  - `VRI-3.5 - Untouched Truth Hardening And Family Handoff`

5. `VRI-3.5 - Untouched Truth Hardening And Family Handoff`
Reason:
- once impact rows exist, the final work is tightening untouched derivation, summary stability, and the handoff to later graph-linked dependency visualization
Current status:
- shipped
- this closes `VRI-3` as the first honest change-impact runtime-inspector subset

## [x] VRI-3.1 - Accepted Impact Read Contract And Store Widening

### Summary

#### Purpose:
- preserve the latest accepted change-impact truth after build settle
- keep changed params, affected build units, and accepted outcome summary available to the runtime inspector even after pending request state clears
- avoid deriving impact truth from console text or retroactive UI guesses

#### Current strongest read:
- this slice is now shipped
- today the strongest live impact truth already exists in specific seams:
  - `buildInputsToRequest.ts`
    - derives request-time `changedParamIds` and `affectedBuildUnitIds`
  - `useAppStore.ts`
    - stages those values into graph runtime state when a graph build request is issued
  - `useSpaghettiStore.ts`
    - already stores `pendingChangedParamIds`, `pendingAffectedBuildUnitIds`, `pendingTargetBuildUnitIds`, `latestAcceptedBuildUnitIds`, and `acceptedBuildBundle`
- the shipped current read now specifically is:
  - `src/app/spaghetti/integration/buildInputsToRequest.ts`
    - already computes the request-time impact inputs from the current build inputs versus the previous build inputs, with `changedParamIds` and `affectedBuildUnitIds` both flowing into the app-side build request
  - `src/app/store/useAppStore.ts`
    - already stages those request-time impact inputs into `stageGraphBuildRequest(...)` along with `buildRequestId`, `buildSeq`, and pending target build units when an accepted graph build is issued
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - already persists those staged pending values under `compileBuild`, but `acceptGraphBuildResult(...)` currently clears the pending arrays once acceptance succeeds without preserving a durable accepted impact snapshot for later inspector reads
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - already finalizes one accepted `BuildResultBundle` that preserves accepted per-entry `rebuilt`, `retained`, and `evicted` outcomes, making that same acceptance seam the natural place to capture the accepted impact snapshot too
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
    - already proves graph-runtime request and acceptance behavior, but does not yet prove that accepted impact truth survives settle or that stale/older acceptance paths cannot overwrite the latest accepted snapshot
- the missing seam is not impact truth generation
- the missing seam is a persisted accepted impact snapshot because:
  - `pendingChangedParamIds` and `pendingAffectedBuildUnitIds` are request-time only
  - those pending arrays clear on accepted result
  - the inspector cannot truthfully explain the last accepted edit once the request has settled
- the first missing contract is one accepted impact read model that survives accepted completion with:
  - accepted build identity
  - changed params
  - affected build units
  - target build units
  - accepted summary counts
  - accepted per-entry outcome status where the bundle already exposes it

#### Locked direction:
- keep graph-runtime acceptance ownership in `useSpaghettiStore.ts`
- preserve dispatcher-owned stale filtering instead of inventing a second inspector-side stale gate
- copy request-time impact inputs into one accepted impact snapshot only when the accepted result lands
- keep the accepted snapshot derived from the same accepted bundle that `acceptGraphBuildResult(...)` already finalizes instead of creating a second outcome ledger elsewhere
- keep the first accepted impact contract graph-document scoped and viewer-target readable
- do not invent untouched rows yet unless the accepted baseline and accepted affected set are both explicitly available

#### Implementation-ready seam read:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - is the strongest lower seam for understanding which request-time impact facts already exist and therefore should be preserved rather than recomputed later
- `src/app/store/useAppStore.ts`
  - is the strongest request bridge seam to keep staging impact inputs honestly into graph runtime state when a build is issued
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - is the strongest owner for an accepted impact snapshot because graph runtime state already owns both the request-time impact inputs and the accepted build bundle, and `acceptGraphBuildResult(...)` is where accepted replacement rules already live
- `src/app/buildDispatcher.ts`
  - is the strongest lower-level truth seam that already preserves accepted `changedParamIds` and stale filtering, and should not need ownership changes for this slice
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - is the strongest proof seam for accepted impact snapshot persistence, replacement, and stale-ignore behavior before visible UI widens
- `src/app/store/runtimeInspectorVm.ts`
  - should only change in this slice if a tiny read helper is needed for later consumers; visible inspector shaping remains deferred to `VRI-3.2`

#### Non-goals for this slice:
- do not render the change-impact section yet
- do not widen into graph-highlight or dependency-jump interactions
- do not guess untouched items from the entire project surface

### Questions / Decisions

#### [x] Question 1 - Where should latest accepted impact truth live?

##### Current answer
- in `GraphRuntimeState` under `useSpaghettiStore.ts`

##### Why
- the graph runtime already owns request-time impact inputs plus accepted build bundle truth for the viewer-target graph

#### [x] Question 2 - What facts must the first accepted impact snapshot preserve?

##### Current answer
- changed params, affected build units, target build units, accepted build identity, and accepted bundle outcome summary

##### Why
- later summary and grouped-row UI cannot recover that meaning honestly once pending request state clears

### Implementation Spec

Likely files:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/runtimeInspectorVm.ts` only if a minimal read helper becomes necessary

Locked first-pass accepted impact contract:
- one graph-runtime accepted impact object with:
  - `seq`
  - `graphDocumentId`
  - `buildRequestId`
  - `changedParamIds`
  - `affectedBuildUnitIds`
  - `targetBuildUnitIds`
  - accepted build summary from `acceptedBuildBundle.summary`
  - accepted per-entry outcomes from `acceptedBuildBundle.entries`, preserving:
    - `buildUnitId`
    - `outputEntryId`
    - `sourceNodeId`
    - `status`
    - `resultClass`
- keep the first-pass snapshot intentionally compact and accepted-build-local instead of trying to encode a full dependency map
- if the graph runtime has no accepted build yet, the accepted impact snapshot should remain `null` instead of inventing an empty impact story

Locked lifecycle mapping:
1. build request issued
   - stage request-time `changedParamIds`, `affectedBuildUnitIds`, and `targetBuildUnitIds` exactly as today
2. accepted build result lands
   - copy the still-pending impact inputs into one accepted impact snapshot before the pending arrays clear
   - pair that snapshot with the accepted bundle summary and entry statuses
3. stale or rejected result lands
   - do not replace the accepted impact snapshot
4. later accepted build replaces prior impact
   - replace the accepted impact snapshot for that graph/runtime slot with the newer accepted truth
5. worker error or cleared in-flight request without accepted result
   - do not synthesize a fake accepted impact snapshot from failed or unaccepted pending state

Locked first-cut direction:
1. widen graph runtime state so the latest accepted edit keeps one persisted accepted impact snapshot
2. feed that snapshot only from the existing request bridge plus accepted result acceptance path already owned by `useAppStore` and `useSpaghettiStore`
3. preserve explicit accepted build identity, changed params, affected units, target units, and per-entry outcome truth from the finalized accepted bundle
4. prove accepted snapshot replacement, null-before-first-accept behavior, and stale-ignore behavior in `useSpaghettiStore.test.ts`
5. leave visible change-impact rendering to `VRI-3.2`
6. keep stale-result ownership in `buildDispatcher.ts` and existing runtime acceptance rules

Scope honored:
- keep this slice on accepted impact truth widening only
- do not widen visible UI beyond what proof needs

Acceptance checks:
- the app now owns one explicit accepted change-impact snapshot for the viewer-target graph runtime
- request-time changed params and affected build units survive accepted completion instead of disappearing with pending-state cleanup
- the first accepted snapshot stays `null` until an accepted build really lands instead of inventing empty impact state from pending or failed work
- stale filtered results do not overwrite the accepted impact snapshot
- later accepted builds replace the prior accepted impact snapshot for the same graph/runtime slot
- the accepted impact snapshot is stable enough for the compact summary surface in `VRI-3.2`
- `useSpaghettiStore.test.ts` proves request, accept, replace, null-before-first-accept, and stale-ignore transitions against the widened accepted impact contract before UI lands

Implementation status:
- shipped

Shipped read:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - now owns one `acceptedBuildImpact` snapshot per graph runtime, preserving accepted build identity, request-time changed/affected/target ids, accepted summary counts, and accepted per-entry outcomes when a build result is accepted
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - now proves the accepted impact snapshot stays `null` before first acceptance, persists request-time impact truth after accepted settle, replaces older accepted truth with newer accepted truth, and stays unchanged when stale results are rejected at the graph-runtime boundary

Closeout notes:
- this slice intentionally lands accepted impact truth only and does not render visible `Change Impact` UI yet
- the next family handoff is `VRI-3.2 - Compact Change Impact Summary Surface`

## [x] VRI-3.2 - Compact Change Impact Summary Surface

### Summary

#### Purpose:
- render one compact `Change Impact` summary beneath the shipped queue/archive surfaces
- make the latest accepted edit readable through calm changed, rebuilt, reused, and evicted counts
- keep the first impact surface summary-first instead of jumping directly into long row lists

#### Current strongest read:
- this slice is now shipped
- the summary source-of-truth now already exists from `VRI-3.1`:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - now owns one per-graph `acceptedBuildImpact` snapshot containing changed params, affected build units, target build units, accepted summary counts, and accepted per-entry rebuilt, retained, and evicted outcomes
- the shipped post-`VRI-3.1` read now specifically is:
  - `src/app/store/runtimeInspectorVm.ts`
    - now shapes the combined inspector shell, current task, active queue, archive, and one compact viewer-target `changeImpactSummary` block from accepted impact truth without mixing label/copy rules into JSX
  - `src/app/components/TitleStatusBar.tsx`
    - now renders the expanded inspector as stacked sections for viewport stats, current runtime task, active queue, archive, and one quiet `Change Impact` summary section beneath archive truth
  - `src/app/theme/foundation/base.css`
    - now owns the compact summary-card plus calm metric-tile treatment that keeps the first impact surface quieter than the current task and active queue
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - now proves both no-summary-before-first-accept behavior and visible accepted summary counts once the viewer-target runtime owns one accepted impact snapshot
- the missing seam is no longer compact summary visibility
- the next missing seam is one grouped impact-entry VM contract that can widen the summary into honest rebuilt, reused, and evicted row groups without making `TitleStatusBar.tsx` assemble build ownership meaning inline

#### Locked direction:
- source summary values from the accepted impact snapshot only
- keep changed-param copy compact and explicit
- keep the first summary viewer-target local and quieter than the active queue
- prefer explicit accepted terms over speculative dependency prose
- keep `TitleStatusBar.tsx` presentation-led by shaping summary labels and counts in `runtimeInspectorVm.ts`
- show no `Change Impact` section when the viewer-target graph has no accepted impact snapshot yet instead of inventing empty zero-state impact meaning

#### Implementation-ready seam read:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - is now the shipped owner for accepted impact truth and should remain read-only for this slice unless a tiny selector helper is needed
- `src/app/store/runtimeInspectorVm.ts`
  - is the strongest owner for deriving one compact accepted-impact summary VM from the shipped graph-runtime snapshot while keeping summary formatting out of the presentation component
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest visible seam for adding one summary-first `Change Impact` section beneath the shipped archive region without mixing data shaping into JSX
- `src/app/theme/foundation/base.css`
  - is the strongest visual seam for introducing a quieter summary card or metric-row treatment that does not compete with the current-task or active-queue cards
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for summary presence, count copy, and no-summary fallback behavior

#### Non-goals for this slice:
- do not render grouped rebuilt, reused, or evicted rows yet
- do not add build-unit labels, source-node labels, or graph-jump interactions yet
- do not infer untouched counts unless the accepted snapshot already supports them explicitly
- do not widen into dependency explanation beyond accepted changed, affected, rebuilt, reused, and evicted summary meaning

### Questions / Decisions

#### [x] Question 1 - What should the first visible summary count?

##### Current answer
- changed params, affected build units, rebuilt entries, reused or retained entries, and evicted entries

##### Why
- those values already exist in the shipped accepted impact snapshot and can be rendered honestly without inventing untouched or deeper dependency meaning

#### [x] Question 2 - Where should summary copy and formatting live?

##### Current answer
- in `runtimeInspectorVm.ts`, with `TitleStatusBar.tsx` staying presentation-led

##### Why
- the inspector already uses one combined VM seam for queue/archive shaping, and this keeps the summary contract reusable for later grouped-row widening

#### [x] Question 3 - When should the first `Change Impact` section be visible?

##### Current answer
- only when the viewer-target graph has an accepted impact snapshot

##### Why
- showing a zero-filled summary before first accepted build would invent an empty impact story instead of reflecting accepted runtime truth

### Implementation Spec

Likely files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts` only if a tiny viewer-target read helper becomes necessary

Locked first-pass summary VM contract:
- expose one optional `changeImpactSummary` block through `runtimeInspectorVm.ts`
- keep that summary `null` when no accepted impact snapshot exists for the viewer-target graph
- when present, keep the summary compact and presentation-ready with:
  - section label:
    - `Change Impact`
  - one compact changed-param line:
    - either a count-led summary such as `2 params changed`
    - or a short explicit list when the count stays small enough to remain calm and readable
  - one compact count set for:
    - affected build units
    - rebuilt
    - reused or retained
    - evicted
- keep wording tied directly to accepted snapshot truth:
  - use `reused` for `retainedCount`
  - do not claim untouched meaning yet
- prefer one summary card or compact metric row over a list of entry rows

Locked first-cut direction:
1. derive one compact accepted-impact summary block in `runtimeInspectorVm.ts` from the viewer-target graph's shipped `acceptedBuildImpact` snapshot
2. add one visible `Change Impact` section beneath the shipped archive section in `TitleStatusBar.tsx`
3. keep the section quieter than the current runtime task and active queue so the first impact surface reads as summary context, not a second task list
4. keep changed-param copy explicit but bounded so long param lists collapse into calm count-led wording
5. prove both summary visibility and no-summary fallback behavior in the left-dock test surface before grouped-row VM work begins

Scope honored:
- keep this slice on compact summary visibility only
- leave impact entry/grouping and visible row rendering to `VRI-3.3` and `VRI-3.4`

Acceptance checks:
- the expanded runtime inspector can show one compact `Change Impact` summary when the viewer-target graph has an accepted impact snapshot
- summary values come only from the shipped accepted impact snapshot, not from queue/archive state or console copy
- changed-param wording stays compact and explicit without expanding into long row lists
- the summary distinguishes rebuilt, reused or retained, and evicted counts honestly
- no `Change Impact` section appears before the first accepted impact snapshot exists
- `PrimaryViewportLeftDock.test.tsx` proves visible summary counts and no-summary fallback before grouped impact-row work begins

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now exposes one optional `changeImpactSummary` block from the viewer-target graph's accepted impact snapshot, including bounded changed-param wording plus compact affected, rebuilt, reused, and evicted metrics
- `src/app/components/TitleStatusBar.tsx`
  - now renders one quiet `Change Impact` section beneath archive truth when accepted impact exists, keeping the first impact surface summary-first instead of widening directly into row lists
- `src/app/theme/foundation/base.css`
  - now styles the first impact surface as a calm summary card with compact metric tiles that do not compete with the current runtime task or active queue
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves both the hidden-before-first-accept fallback and the visible accepted summary-copy/count behavior for the left-dock runtime inspector

Closeout notes:
- this slice intentionally lands only the compact summary surface and does not render grouped impact rows yet
- the next family handoff is `VRI-3.3 - Impact Entry VM And Grouping Contract`

## [x] VRI-3.3 - Impact Entry VM And Grouping Contract

### Summary

#### Purpose:
- widen from compact summary into one explicit impact-entry VM and grouping contract
- keep rebuilt and reused rows distinct in shaping before the UI renders them
- attach grouping and label meaning to accepted build-unit or source-node ownership only where the bundle already exposes that truth

#### Current strongest read:
- this slice is now shipped
- the compact summary foundation from `VRI-3.2` now already exists:
  - `src/app/store/runtimeInspectorVm.ts`
    - now reads the viewer-target graph's accepted impact snapshot and exposes both one compact `changeImpactSummary` and one grouped accepted-impact entry contract, keeping grouped row shaping in the shared VM seam instead of spreading label logic into JSX
  - `src/app/components/TitleStatusBar.tsx`
    - still renders only the compact summary section beneath archive truth, preserving a stable visual placement seam for later grouped-row rendering in `VRI-3.4`
- the shipped accepted impact entry truth from `VRI-3.1` now specifically is:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - still preserves `acceptedBuildImpact.entries` with `buildUnitId`, `outputEntryId`, `sourceNodeId`, `status`, and `resultClass`, and the shipped grouped VM now reads those accepted entries directly without widening runtime storage
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - still exposes `viewerTargetGraphDocumentId`, `selectViewerTargetGraphDocument(...)`, and `partKeyByNodeId`, and the shipped grouped VM now uses that same viewer-target metadata to resolve authored labels before falling back to compact build identity
  - `src/app/spaghetti/integration/buildInputsToRequest.ts`
    - already ties `buildUnitId` and `outputEntryId` back to preview-output-slot plus `sourceNodeId` identity, confirming that accepted impact rows should stay grounded in build-output ownership rather than looser dependency prose
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
    - still owns one honest node-display-label helper shape, and the shipped grouped VM now mirrors that authored-node-first label preference instead of leading with raw build ids
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - now proves grouped-contract presence, group ordering, authored-label preference plus fallback detail shaping, and hidden-before-first-accept behavior before visible grouped rows widen in `VRI-3.4`
- the missing seam is no longer grouped impact-entry shaping
- the next missing seam is the visible row surface that renders the now-shipped grouped VM beneath the compact summary without mixing presentation work back into `runtimeInspectorVm.ts`

#### Locked direction:
- derive row groups from accepted impact entries plus accepted summary truth
- prefer honest build-unit or source-node labels over speculative dependency prose
- keep the first grouping contract in `runtimeInspectorVm.ts` and leave visible row presentation to the next slice
- keep the grouping viewer-target local by reading only the accepted impact snapshot plus current viewer-target graph metadata already in app state
- keep evicted entries explicit and separate instead of collapsing them into rebuilt or omitted history
- do not invent untouched or dependency-chain rows yet

#### Implementation-ready seam read:
- `src/app/store/runtimeInspectorVm.ts`
  - is the strongest owner for deriving one `changeImpactGroups` VM contract from the existing `changeImpactSummary`, viewer-target graph document, and accepted impact entries while keeping presentation decisions out of JSX
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - should remain the read-only owner for accepted impact truth in this slice, though the new VM will likely read `selectViewerTargetGraphDocument(...)`, `selectViewerTargetGraphRuntime(...)`, and `partKeyByNodeId` together for compact row-label shaping
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - is the strongest existing lower seam for node-display-label behavior, and should be referenced or mirrored carefully rather than replaced with a looser impact-row-only labeling rule
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest proof seam for grouped-impact VM behavior before visible grouped-row rendering begins, especially for group presence, ordering, row labels, and null/empty fallback rules
- `src/app/components/TitleStatusBar.tsx`
  - should only change in this slice if a tiny placeholder/read hook becomes necessary; visible grouped-row rendering remains deferred to `VRI-3.4`

#### Non-goals for this slice:
- do not render grouped rows in the visible inspector yet
- do not add click-through graph navigation or highlight behavior
- do not widen accepted impact storage just to support labels the viewer-target graph can already resolve
- do not add untouched or dependency-explainer groups yet

### Questions / Decisions

#### [x] Question 1 - What should the first grouped entry contract separate?

##### Current answer
- rebuilt, reused, and evicted rows as distinct groups, with empty groups omitted

##### Why
- those statuses already exist explicitly in accepted impact entries, and separating them in VM shaping keeps later row rendering honest and calm

#### [x] Question 2 - What should row labels prefer first?

##### Current answer
- viewer-target authored node labels or node-def labels resolved from `sourceNodeId`, with build-unit or output-entry identity only as a compact fallback

##### Why
- accepted impact entries already carry `sourceNodeId`, and authored node naming is more truthful and readable than exposing raw build ids as the first visible label

#### [x] Question 3 - Where should grouped impact-row ordering live?

##### Current answer
- in `runtimeInspectorVm.ts`

##### Why
- the grouped entry order is part of the shared runtime-inspector read model and should be stable before presentation work widens in `VRI-3.4`

### Implementation Spec

Likely files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts` only if a tiny viewer-target selector helper is necessary
- `src/app/spaghetti/selectors/selectNodeVm.ts` only if the existing node-label logic needs a small shared helper

Locked first-pass grouped impact VM contract:
- keep `changeImpactSummary` exactly as shipped from `VRI-3.2`
- add one optional `changeImpactGroups` block through `runtimeInspectorVm.ts`
- keep that grouped block `null` when there is no accepted impact snapshot for the viewer-target graph
- when present, expose compact presentation-ready groups in stable order:
  - `rebuilt`
  - `reused`
  - `evicted`
- each group should preserve:
  - stable group key
  - visible group label
  - quiet tone or status kind for later row presentation
  - compact row list
- each row should preserve:
  - stable key derived from accepted impact entry identity
  - `buildUnitId`
  - `outputEntryId`
  - `sourceNodeId`
  - compact primary label
  - optional secondary detail only if the accepted viewer-target graph already exposes it honestly
  - row tone/status aligned to the accepted entry status
- omit empty groups instead of emitting zero-row placeholders

Locked first-cut direction:
1. derive one grouped impact-entry VM in `runtimeInspectorVm.ts` from the viewer-target graph's accepted impact snapshot and viewer-target graph metadata already present in app state
2. resolve compact primary row labels from accepted `sourceNodeId` through the current viewer-target graph first, falling back to compact build identity only when authored node naming is unavailable
3. keep rebuilt, reused, and evicted groups distinct in the VM so later rendering can stay presentation-led
4. prove grouped VM presence, group ordering, row-label shaping, and no-groups-before-first-accept behavior in the left-dock test surface
5. leave visible grouped-row rendering, section markup, and CSS treatment to `VRI-3.4`

Scope honored:
- keep this slice on grouped impact-entry shaping only
- keep visible inspector work deferred until the grouped VM contract is locked

Acceptance checks:
- the runtime inspector VM can expose one grouped accepted-impact contract for the viewer-target graph without relying on queue/archive state
- grouped rows are derived only from accepted impact entries and viewer-target graph metadata already present in app state
- rebuilt, reused, and evicted groups stay distinct and omit empty groups
- compact row labels prefer honest authored node meaning before falling back to raw build identity
- no grouped impact contract appears before the first accepted impact snapshot exists
- `PrimaryViewportLeftDock.test.tsx` proves grouped-contract presence, order, row labels, and hidden-before-first-accept behavior before visible grouped-row work begins

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now exposes one optional `changeImpactGroups` block with stable rebuilt, reused, and evicted groups plus compact row entries that preserve accepted build identity while preferring authored viewer-target node labels first
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves grouped-contract presence, stable group ordering, authored-label-first fallback shaping, and null-before-first-accept behavior through the combined inspector VM surface without widening visible grouped rows yet

Closeout notes:
- this slice intentionally lands only the grouped impact-entry VM contract and does not render visible grouped rows yet
- the next family handoff is `VRI-3.4 - Impact Row Surface`

## [x] VRI-3.4 - Impact Row Surface

### Summary

#### Purpose:
- render the grouped impact rows beneath the compact summary
- keep rebuilt, reused, and evicted groups visibly distinct without widening into deeper dependency UI
- keep the first visible row section compact and presentation-led

#### Current strongest read:
- this slice is now shipped
- the grouped impact contract from `VRI-3.3` stayed intact while the visible row surface widened through the existing presentation seam:
  - `src/app/store/runtimeInspectorVm.ts`
    - still exposes one optional `changeImpactSummary` block plus one optional `changeImpactGroups` block with stable rebuilt, reused, and evicted ordering, row tones, authored-label preference, and compact fallback detail, and the shipped UI now reads that contract directly without re-grouping rows in JSX
  - `src/app/components/TitleStatusBar.tsx`
    - now renders the compact `Change Impact` summary card plus visible rebuilt, reused, and evicted row groups beneath it while staying presentation-led
  - `src/app/theme/foundation/base.css`
    - now styles one compact grouped impact-list surface with calm rebuilt, reused, and evicted group plus row tones that stay quieter than the current-task and queue cards
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - now proves the real rendered `Change Impact` section keeps summary-first ordering, shows rebuilt, reused, and evicted groups in stable order, renders row labels plus optional detail, and still stays hidden before first accepted impact truth exists
- the missing seam is no longer visible grouped-row rendering
- the next missing seam is untouched-truth hardening and repeated-edit stability before later dependency-linked widening begins in `VRI-3.5`

#### Locked direction:
- source visible grouped rows from the shipped `changeImpactGroups` VM only
- keep `TitleStatusBar.tsx` presentation-led rather than assembling ownership meaning inline
- keep the first visible row section quieter than the active queue and current-task surfaces
- preserve summary-first ordering by rendering grouped rows beneath the compact accepted-impact card instead of replacing it
- keep rebuilt, reused, and evicted group labels explicit and omit empty groups rather than adding zero-row placeholders
- keep the first row surface read-only:
  - no graph-jump affordances
  - no hover highlight coupling
  - no dependency-chain prose
- keep row copy compact by showing the shipped primary label first and optional secondary detail only when the grouped VM already provides it honestly

#### Implementation-ready seam read:
- `src/app/store/runtimeInspectorVm.ts`
  - stayed the shipped owner for impact grouping and row labels in this slice, with no regrouping logic pushed into presentation
- `src/app/components/TitleStatusBar.tsx`
  - was the strongest visible seam for rendering grouped impact rows directly beneath the existing summary card while keeping the component presentation-led
- `src/app/theme/foundation/base.css`
  - was the strongest style seam for adding one compact grouped-list treatment with distinct but calm rebuilt, reused, and evicted tones that do not overpower the current-task or queue cards
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - was the strongest proof seam for real rendered row visibility, section ordering, row copy, group separation, and hidden-before-first-accept behavior

#### Non-goals for this slice:
- do not widen accepted impact storage or regroup row contracts in the runtime store
- do not add untouched or unaffected rows yet
- do not add click-through graph navigation, selection sync, or highlight behavior
- do not widen the runtime inspector into a dependency browser or explainer surface

### Questions / Decisions

#### [x] Question 1 - Where should visible impact row grouping stay owned?

##### Current answer
- in `runtimeInspectorVm.ts`, with `TitleStatusBar.tsx` only rendering the already-grouped VM

##### Why
- the grouping, label, and row-tone contract already shipped in `VRI-3.3`, and moving that logic into JSX would undo the clean shaping boundary the earlier slice established

#### [x] Question 2 - What should the first visible row surface preserve?

##### Current answer
- the compact summary card first, then explicit rebuilt, reused, and evicted groups beneath it, with each row showing its shipped primary label and optional detail only when present

##### Why
- the summary remains the quickest accepted-edit read, and the first row surface should widen into detail without discarding that overview or inventing deeper dependency storytelling

#### [x] Question 3 - When should grouped rows be visible?

##### Current answer
- only when the viewer-target graph has an accepted impact snapshot and the grouped VM exposes at least one non-empty group

##### Why
- showing placeholder groups before accepted truth exists would invent an empty impact story instead of reflecting the shipped accepted-impact contract honestly

### Implementation Spec

Likely files:
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- `src/app/store/runtimeInspectorVm.ts` only if a tiny helper is necessary to keep JSX presentation-led

Locked first-pass visible row contract:
- keep `changeImpactSummary` and `changeImpactGroups` exactly as shipped from `VRI-3.2` and `VRI-3.3`
- when `changeImpactSummary` is present:
  - keep the summary card visible first
  - render the grouped impact rows directly beneath that card inside the same `Change Impact` section
- when `changeImpactGroups` is `null`:
  - render no grouped impact-row surface
- when groups are present:
  - render groups in the shipped VM order:
    - `rebuilt`
    - `reused`
    - `evicted`
  - each group should show:
    - visible group label
    - compact row count or quiet status cue only if the JSX can do so without recomputing grouping logic
    - the group's row list
  - each row should show:
    - shipped primary label
    - optional detail when present
    - quiet tone aligned to the shipped group tone
  - keep rows read-only and non-interactive in this first pass

Locked first-cut direction:
1. widen `TitleStatusBar.tsx` so the rendered `Change Impact` section shows the shipped grouped rows directly beneath the existing summary card
2. add one compact grouped-list and row treatment in `base.css` that keeps rebuilt, reused, and evicted visually distinct but calmer than active queue and current-task cards
3. reuse the grouped VM contract as-is instead of rebuilding labels, statuses, or grouping inside JSX
4. prove visible row rendering in `PrimaryViewportLeftDock.test.tsx`, including section presence, stable group order, row labels plus optional detail, and hidden-before-first-accept behavior
5. leave untouched derivation, repeated-edit stability hardening, and later dependency-linked handoff to `VRI-3.5`

Scope honored:
- keep this slice on visible grouped-row rendering only
- keep accepted impact truth, grouping ownership, and label shaping in the already-shipped lower seams

Acceptance checks:
- the expanded runtime inspector now renders the shipped grouped change-impact rows beneath the compact summary when the viewer-target graph has accepted impact truth
- visible groups follow the shipped rebuilt, reused, and evicted ordering from `runtimeInspectorVm.ts`
- row copy uses the shipped grouped VM labels and optional detail instead of reconstructing ownership meaning inside `TitleStatusBar.tsx`
- rebuilt, reused, and evicted rows are visually distinct but quieter than the active queue and current-task cards
- no grouped impact rows appear before the first accepted impact snapshot exists
- `PrimaryViewportLeftDock.test.tsx` proves visible grouped-row presence, ordering, row copy, and hidden-before-first-accept behavior before `VRI-3.5` untouched-truth hardening begins

Implementation status:
- shipped

Shipped read:
- `src/app/components/TitleStatusBar.tsx`
  - now renders grouped rebuilt, reused, and evicted impact rows directly beneath the compact `Change Impact` summary, keeping the section summary-first while reading the already-shaped VM contract without rebuilding grouping logic in JSX
- `src/app/theme/foundation/base.css`
  - now styles the grouped impact surface with calm group shells and quieter row treatments that keep rebuilt, reused, and evicted meaning distinct without competing with the current-task or queue cards
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves visible grouped-row rendering, stable group order, row label plus detail copy, and hidden-before-first-accept behavior through the real left-dock runtime-inspector surface

Closeout notes:
- this slice intentionally lands the first visible grouped impact-row surface only and does not yet derive untouched or unaffected rows
- the next family handoff is `VRI-3.5 - Untouched Truth Hardening And Family Handoff`

## [x] VRI-3.5 - Untouched Truth Hardening And Family Handoff

### Summary

#### Purpose:
- harden untouched or unaffected derivation where the accepted baseline truly supports it
- stabilize summary and row behavior across repeated accepted edits
- close `VRI-3` cleanly so later graph-linked dependency visualization can build on honest impact truth

#### Current strongest read:
- the accepted impact contract plus visible grouped row surface are now both shipped
- today the strongest live seams already expose the exact ingredients needed for honest untouched derivation:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - already persists one accepted impact snapshot per graph runtime with both `affectedBuildUnitIds` and `targetBuildUnitIds`, making it the strongest owner for any untouched comparison without inventing a second baseline
  - `src/app/store/runtimeInspectorVm.ts`
    - already shapes the accepted summary and grouped rows for the viewer-target graph, making it the strongest seam for deriving any compact untouched count or copy while keeping that logic out of JSX
  - `src/app/components/TitleStatusBar.tsx`
    - now renders summary plus grouped rows, but still stops before any explicit untouched or unaffected wording, making it the visible seam where the final honest `VRI-3` hardening should land
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
    - already proves accepted snapshot persistence and replacement behavior, but does not yet prove that target-versus-affected truth stays stable enough for untouched derivation across later accepts
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - already proves summary and grouped-row visibility through the real left-dock surface, but does not yet prove untouched copy, repeated-accept replacement stability, or the fallback when untouched truth is zero or unsupported
- the missing seam is no longer visible grouped-row rendering
- the next missing seam is honest untouched hardening because:
  - the runtime already knows which build units were targeted and which were actually affected at acceptance time
  - the inspector currently exposes rebuilt, reused, and evicted meaning but not the still-targeted untouched remainder
  - `VRI-3` cannot close cleanly until repeated accepted edits prove the summary and row surface stay stable when untouched meaning appears, disappears, or returns to zero

#### Locked direction:
- derive untouched meaning only from the shipped accepted impact snapshot:
  - compare `targetBuildUnitIds` against `affectedBuildUnitIds`
  - do not guess from total project surface, queue history, or graph traversal
- keep untouched ownership in `runtimeInspectorVm.ts`, with `TitleStatusBar.tsx` remaining presentation-led
- keep the untouched story compact:
  - one count or short copy in the summary-first `Change Impact` section is acceptable
  - do not add a new long untouched row group unless the shipped VM can support it calmly and honestly
- preserve accepted-edit-local meaning:
  - untouched should mean `targeted but not affected by the accepted edit`
  - not `everything in the graph that did not rebuild`
- harden repeated-accept behavior so newer accepted snapshots replace prior untouched meaning cleanly
- close `VRI-3` without widening into graph-jump, hover highlight, or dependency-chain explanation

#### Implementation-ready seam read:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - should remain the read-only owner for accepted impact truth in this slice, though a tiny selector helper would be acceptable if needed for clearer target-versus-affected reads
- `src/app/store/runtimeInspectorVm.ts`
  - is the strongest owner for deriving untouched count, summary wording, and any small VM hardening tied to repeated accepted builds
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest visible seam for showing the final untouched-aware summary or note without reintroducing derivation logic into JSX
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - is the strongest proof seam for accepted snapshot replacement and untouched-supporting baseline stability
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for untouched copy, repeated-edit stability, and honest hidden or zero fallback behavior

#### Non-goals for this slice:
- do not widen accepted impact storage into a dependency map
- do not add graph-region highlight, click-through navigation, or dependency-chain prose
- do not claim untouched meaning when `targetBuildUnitIds` or `affectedBuildUnitIds` are missing or insufficient
- do not reopen queue/archive ownership or earlier grouped-row presentation work

### Questions / Decisions

#### [x] Question 1 - What should untouched mean in the first honest runtime-inspector read?

##### Current answer
- build units that were targeted in the accepted build but were not in the accepted affected set

##### Why
- that comparison is already preserved in the accepted impact snapshot, and it stays tied to the accepted edit instead of drifting into a project-wide untouched claim

#### [x] Question 2 - Where should untouched derivation live?

##### Current answer
- in `runtimeInspectorVm.ts`

##### Why
- untouched count and wording are part of the shared change-impact read model, and keeping them there preserves the current shaping boundary between VM and `TitleStatusBar.tsx`

#### [x] Question 3 - How should the first untouched surface stay visible?

##### Current answer
- as compact summary-aware copy or metric treatment inside the existing `Change Impact` section, only when the accepted target-versus-affected comparison yields honest meaning

##### Why
- `VRI-3` should close with one calm accepted-impact explanation surface, not a second expanding row family that overstates what the runtime currently knows

#### Locked direction:
- only expose untouched truth when accepted target-versus-affected comparison is explicit
- keep dependency graph exploration deferred
- close `VRI-3` with a stable accepted impact model and a clean handoff to a later graph-linked lane

### Implementation Spec

Likely files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- `src/app/components/TitleStatusBar.tsx` only if a small visible copy or metric slot is needed for the untouched-aware summary

Locked first-pass untouched hardening contract:
- keep `acceptedBuildImpact` storage exactly as shipped
- derive untouched support from:
  - `targetBuildUnitIds`
  - `affectedBuildUnitIds`
- only treat untouched as explicit when:
  - both sets exist on the accepted snapshot
  - the target set is large enough to compare honestly
- keep the final untouched contract compact and accepted-edit-local:
  - one untouched count or short untouched line in the summary is acceptable
  - grouped rebuilt, reused, and evicted rows should remain unchanged unless a tiny VM/supporting copy adjustment is necessary
- when no untouched units exist:
  - prefer zero-aware stable summary behavior over inventing a placeholder untouched story

Locked first-cut direction:
1. derive one untouched count or compact untouched status from the shipped accepted impact snapshot in `runtimeInspectorVm.ts` by comparing target-versus-affected build units
2. keep untouched wording honest and bounded in the existing `Change Impact` section instead of widening into a new dependency or untouched row explorer
3. prove store-level stability for accepted snapshot replacement and untouched-supporting target-versus-affected truth in `useSpaghettiStore.test.ts` if a focused hardening regression is needed
4. prove visible untouched-aware summary behavior and repeated-accept replacement behavior in `PrimaryViewportLeftDock.test.tsx`
5. close `VRI-3` by leaving one stable handoff note toward later graph-linked dependency visualization without implementing that later lane here

Scope honored:
- keep this slice on untouched-truth hardening, repeated-accept stability, and family closeout only
- keep dependency exploration and graph-linked navigation deferred

Acceptance checks:
- the runtime inspector derives untouched meaning only when the accepted impact snapshot explicitly supports target-versus-affected comparison
- untouched count or copy stays tied to the latest accepted edit instead of drifting into a project-wide untouched claim
- later accepted builds replace prior untouched meaning cleanly without leaving stale summary or row residue
- rebuilt, reused, and evicted group behavior remains stable while untouched hardening lands
- `useSpaghettiStore.test.ts` and or `PrimaryViewportLeftDock.test.tsx` prove the accepted target-versus-affected comparison, replacement stability, and honest visible untouched behavior needed to close `VRI-3`
- `VRI-3` can close after this slice without promising dependency-browser behavior that the runtime does not yet expose

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now derives one compact `Untouched` metric only from the accepted target-versus-affected build-unit comparison, keeping untouched meaning accepted-edit-local and leaving storage ownership unchanged
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves untouched metric visibility, zero-aware summary behavior when all targeted units were affected, and repeated accepted-edit replacement so stale untouched summary copy cannot linger after later accepts

Closeout notes:
- this slice intentionally closes `VRI-3` with compact untouched-aware summary hardening only and does not widen into graph-linked dependency navigation or a new untouched row family
- the later family handoff remains a future dependency-linked lane built on top of the now-stable accepted impact summary and grouped-row seams
