# `VRI-2` - `Queue Visibility And Archive Truth`

## Doc Header

### Doc History
9. 2026-04-09 09:05: Marked `VRI-2.4 - Queue Lifecycle Hardening And Handoff` shipped after focused lifecycle proof locked that a newly accepted build start replaces prior queue/archive truth through the existing `beginBuild(...)` seam, stale progress/result/error traffic stays filtered by `buildDispatcher`, bounded archive rollover remains calm at the store cap, and the left-dock proof now verifies the visible inspector does not drift into mixed-build residue before the family hands forward to `VRI-3`
8. 2026-04-09 09:01: Tightened `VRI-2.4 - Queue Lifecycle Hardening And Handoff` into an implementation-ready final slice by grounding it in the shipped `buildDispatcher` stale-acceptance ledger, the current `runtimeInspectorTaskStore` begin-build replacement plus bounded archive seam, the accepted `bootstrapBuildWiring` lifecycle bridge, and the existing lifecycle plus left-dock proof surfaces before `VRI-2` closes into `VRI-3`
7. 2026-04-09 08:55: Marked `VRI-2.3 - Archive Truth Surface` shipped after `runtimeInspectorVm` widened again to expose a visible archive list from the shipped bounded `archive` store seam, `TitleStatusBar` began rendering a quieter archive section beneath the active queue with distinct completed, reused, and error row tones, and focused left-dock proof verified that recent resolved rows remain visible without duplicating the current error fallback
6. 2026-04-09 08:51: Tightened `VRI-2.3 - Archive Truth Surface` into an implementation-ready next slice by grounding it in the shipped `runtimeInspectorTaskStore` archive seam, the current `runtimeInspectorVm` active-queue-first shaping, the live `TitleStatusBar` active-queue presentation path, and the existing left-dock proof surface, locking the first visible archive section contract before lifecycle hardening work begins in `VRI-2.4`
5. 2026-04-09 08:49: Marked `VRI-2.2 - Active Queue Surface` shipped after `runtimeInspectorVm` widened from one visible task output to one ordered active-queue card list, `TitleStatusBar` began rendering the first active queue beneath the current runtime-task header with the top card still strongest and queued cards directly below it, and focused left-dock proof verified accepted order without widening into archive UI yet
4. 2026-04-09 08:45: Tightened `VRI-2.2 - Active Queue Surface` into an implementation-ready next slice by grounding it in the shipped `runtimeInspectorTaskStore` active-queue truth, the current `runtimeInspectorVm` fallback behavior, the live `TitleStatusBar` task-card seam, and the existing left-dock presentation tests, locking the first active-queue card-list contract and the visible top-card-versus-queued-card rendering rules before archive UI widens in `VRI-2.3`
3. 2026-04-09 08:36: Marked `VRI-2.1 - Queue Read Contract And Store Widening` shipped after the runtime inspector widened from one `currentTask` seam into explicit active-queue plus bounded recent-archive state in `runtimeInspectorTaskStore`, accepted dispatcher lifecycle hooks in `bootstrapBuildWiring` began moving queued, active, done, reused, and error entries through that store without inventing fake ordering, and focused lifecycle plus left-dock proof verified the widened contract before visible queue/archive sections land
2. 2026-04-09 08:30: Tightened `VRI-2.1 - Queue Read Contract And Store Widening` into an implementation-ready first `VRI-2` slice by grounding it in the live `bootstrapBuildWiring`, `buildDispatcher`, `runtimeInspectorTaskStore`, and lifecycle-test seams, locking the first explicit queue/archive state contract, the accepted hook-to-state transition rules, and the bounded archive behavior needed before visible queue/archive rendering widens
1. 2026-04-09 08:18: Created this standalone future phase doc for `VRI-2`, turning the next viewport runtime-inspector lane into a small-chunk execution ladder focused on honest active-queue truth, quieter archive truth, and the minimum worker-to-app read-model widening needed to expose queued, active, done, reused, and error runtime cards without inventing fake ordering or dependency impact

### Purpose

Use this doc as the dedicated planning and execution surface for the second `Viewport Runtime Inspector` delivery lane.

The goal here is:
- expose the active runtime queue in honest top-to-bottom execution order
- expose recently resolved runtime cards in a quieter archive region
- keep queued, active, reused, done, and error states visibly distinct
- keep the queue grounded in accepted worker/build lifecycle truth instead of decorative placeholder cards
- break the work into small implementation-ready chunks before later change-impact phases

### Scope

This phase covers:
- app-facing queue and archive read-model widening for the runtime inspector
- active queue visibility beneath the already-shipped current-task surface
- archive visibility for recently resolved tasks
- focused hardening for stale batch replacement and bounded archive retention

This phase does not cover:
- change-impact or dependency-map visibility
- invalidated-versus-untouched explanation beyond queue/archive truth
- queue patching semantics beyond what the accepted dispatcher/runtime hooks already expose honestly
- speculative task naming or fake queue rows

## Doc Body

### Summary

`VRI-2` is the dedicated queue-and-archive lane for making the viewport runtime inspector explain more than one active task.

Current read:
- `VRI-1` already shipped the shell, viewport stats, one current task card, and one combined inspector model
- the missing truth is what sits behind that active item:
  - what is queued next
  - what just resolved
  - whether a resolved task completed, reused prior work, or failed
- the next honest delivery should stay narrow:
  - worker-backed queue truth first
  - active queue rendering second
  - archive rendering third
  - stale-batch hardening last

Locked recommendation:
- stage the second delivery in Codex-sized cuts:
  - widen the runtime read contract first
  - render active queue cards second
  - render archive groups third
  - harden stale-batch and retention behavior last
- keep `VRI-2` honest:
  - no fake queue ordering
  - no fake reuse states
  - no change-impact map yet

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/buildDispatcher.ts`
  - already exposes accepted runtime hooks plus ordered worker `build_progress` states such as `queued`, `cache_hit`, `building`, `done`, and `error`
- `src/app/bootstrapBuildWiring.ts`
  - is the current app-owned seam that turns accepted dispatcher lifecycle truth into runtime-inspector state, but today it collapses the queue down to one `currentTask`
- `src/app/store/runtimeInspectorTaskStore.ts`
  - is the current minimal task seam that must widen or give way to a queue/archive-capable inspector store
- `src/app/store/runtimeInspectorVm.ts`
  - is the current combined inspector view-model seam and the natural owner for queue/archive presentation shaping once the underlying task truth exists
- `src/app/components/TitleStatusBar.tsx`
  - is the current runtime-inspector presentation seam for the left-dock shell and the strongest owner for the next visible queue/archive sections
- `src/app/bootstrapBuildWiring.test.ts`
  - is the strongest lifecycle-proof seam for queue/archive truth because it already verifies the accepted build start/progress/result bridge
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for the combined queue/archive matrix inside the left-dock runtime inspector

### Phase Breakdown

1. `VRI-2.1 - Queue Read Contract And Store Widening`
Reason:
- the first honest cut is widening the current-task-only seam into an explicit active-queue plus archive-capable store before the UI widens again
Current status:
- shipped
- current handoff:
  - `VRI-2.2 - Active Queue Surface`

2. `VRI-2.2 - Active Queue Surface`
Reason:
- once the queue truth exists in app state, the next smallest useful value is showing the ordered active queue beneath the current runtime task card
Current status:
- shipped
- current handoff:
  - `VRI-2.3 - Archive Truth Surface`

3. `VRI-2.3 - Archive Truth Surface`
Reason:
- after the active queue is visible, the next missing truth is where resolved tasks go and how `done`, `reused`, and `error` states stay distinct after leaving the queue
Current status:
- shipped
- current handoff:
  - `VRI-2.4 - Queue Lifecycle Hardening And Handoff`

4. `VRI-2.4 - Queue Lifecycle Hardening And Handoff`
Reason:
- once queue and archive surfaces exist, the final work is tightening stale-batch replacement, bounded archive retention, and the family handoff to later change-impact work
Current status:
- shipped
- current handoff:
  - `VRI-3 - Change Impact And Dependency Visibility`
- this closes `VRI-2` as the first honest queue/archive runtime-inspector subset

## [x] VRI-2.1 - Queue Read Contract And Store Widening

### Summary

#### Purpose:
- widen the runtime-inspector task seam from one `currentTask` into explicit queue/archive truth
- keep that truth app-owned and fed only by accepted dispatcher/build lifecycle hooks
- avoid widening visible UI more than necessary until the data shape is honest

#### Current strongest read:
- this slice is now shipped
- today the strongest live queue truth already exists lower in the stack:
  - `buildDispatcher` accepts ordered `build_progress` messages with `queued`, `cache_hit`, `building`, `done`, and `error`
  - `bootstrapBuildWiring.ts` used to collapse those lifecycle reads into one `currentTask`
- the missing seam is not worker truth
- the missing seam is an app-facing queue/archive store shape that can preserve:
  - active ordered entries
  - recently resolved entries
  - per-entry state, label, progress, and detail
  - accepted build identity such as `seq`, `graphDocumentId`, and `buildRequestId`

#### Locked direction:
- keep accepted dispatcher lifecycle truth as the only owner for queue/archive membership
- prefer widening `runtimeInspectorTaskStore.ts` into a queue-capable inspector store or replacing it with a clearly named successor under `src/app/store/`
- do not derive queue rows from console transcript text
- do not synthesize fake queued cards from aggregate progress percentages
- keep archive retention intentionally small and bounded from the start
- preserve queue order directly from accepted `build_progress` arrival order for the active accepted build only
- map `cache_hit` into explicit archive `reused` truth instead of leaving it as a second active-card status

#### Implementation-ready seam read:
- `src/app/bootstrapBuildWiring.ts`
  - is the strongest owner seam for app-facing queue lifecycle bridging because it already receives accepted build start, progress, result, and worker-error hooks
- `src/app/store/runtimeInspectorTaskStore.ts`
  - is the strongest current store seam to widen or replace because it already owns inspector task truth and is intentionally still small
- `src/app/buildDispatcher.ts`
  - is the strongest lower-level truth seam that already preserves accepted order and stale-build filtering, and should not need ownership changes for this slice
- `src/app/bootstrapBuildWiring.test.ts`
  - is the strongest proof seam for queue/archive lifecycle state transitions before UI rendering widens

#### Non-goals for this slice:
- do not render the full queue yet
- do not add archive UI yet
- do not widen into change-impact or dependency visibility
- do not promise mid-build queue patching semantics beyond what the accepted runtime hooks already expose

### Questions / Decisions

#### [x] Question 1 - Where should queue truth enter app land?

##### Current answer
- through `bootstrapBuildWiring.ts` from accepted `buildDispatcher` runtime hooks

##### Why
- that is already the app-owned bridge for accepted build lifecycle truth

#### [x] Question 2 - What should the first widened task seam preserve?

##### Current answer
- active ordered queue entries plus a small recent archive with explicit resolved-state labels

##### Why
- later UI slices need honest state before they can render queue/archive sections safely

#### [x] Question 3 - What states must stay distinct at the store level?

##### Current answer
- `queued`, `active`, `done`, `reused`, and `error`

##### Why
- if those states collapse too early, the later archive surface cannot recover honest meaning

### Implementation Spec

Likely files:
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/runtimeInspectorTaskStore.ts` or a clearly named replacement under `src/app/store/`
- `src/app/bootstrapBuildWiring.test.ts`

Locked first-pass store contract:
- one app-facing runtime-inspector state object with:
  - `activeQueue`
    - ordered entries for the current accepted build only
  - `archive`
    - a small recent resolved list
- each entry should preserve:
  - `seq`
  - `graphDocumentId`
  - `buildRequestId`
  - `partKey` when present
  - inspector label
  - visible status text
  - `progress01`
  - detail/message text
  - explicit inspector state from:
    - `queued`
    - `active`
    - `done`
    - `reused`
    - `error`
- keep the first-pass archive retention bounded in store code from the start instead of leaving it unowned until `VRI-2.4`

Locked lifecycle mapping:
1. `onBuildRequestStarted`
   - reset inspector queue/archive state for the newly accepted build identity
   - seed one top-level active queue entry for the build request with `queued` inspector meaning until part-level progress begins
2. `onBuildProgress`
   - upsert the matching active queue entry by accepted identity plus `partKey`
   - keep `queued` entries in active queue order
   - treat `building` as active-queue `active`
   - move `cache_hit`, `done`, and `error` entries out of the active queue and into the recent archive using `reused`, `done`, and `error`
3. `onBuildResultSettled`
   - remove any unresolved build-level placeholder row that would otherwise linger after accepted completion
   - keep already-archived resolved rows visible instead of clearing inspector truth back to empty immediately
4. `onWorkerError`
   - archive the accepted failed build or task as `error` when identity exists
   - fall back to one build-runtime error archive row when only the broader runtime error is known

Locked first-cut direction:
1. widen the inspector task read into queue/archive-capable app state
2. feed that state from accepted build start/progress/result/error hooks only
3. preserve explicit per-entry state and accepted build identity
4. keep archive retention bounded from the first pass
5. leave visible queue/archive rendering to `VRI-2.2` and `VRI-2.3`
6. keep stale-build filtering owned by `buildDispatcher.ts` rather than recreating a second stale gate in inspector state

Scope honored:
- keep this slice on runtime truth widening only
- do not widen visible UI beyond what proof needs

Acceptance checks:
- the app now owns one explicit runtime-inspector queue/archive state shape
- accepted build progress can produce ordered queued and active entries
- accepted resolved items can move into an archive state without disappearing
- stale filtered events do not need new ownership outside the existing dispatcher/build bridge
- `cache_hit` no longer masquerades as an active in-flight card once this widened store exists
- `bootstrapBuildWiring.test.ts` proves build start, progress, cache-hit, done, result-settle, and worker-error transitions against the widened store before any queue/archive UI lands

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorTaskStore.ts`
  - now owns explicit `activeQueue` plus bounded recent `archive` state, along with queue upsert, resolution, failure, and build-settle helpers keyed by accepted build identity
- `src/app/bootstrapBuildWiring.ts`
  - now maps accepted build start, progress, result-settle, and worker-error hooks into queue/archive state instead of rewriting one `currentTask`
- `src/app/store/runtimeInspectorVm.ts`
  - now derives the current visible task from the widened queue state and falls back to the latest archived error without exposing archive UI early
- `src/app/bootstrapBuildWiring.test.ts`
  - now proves queued, active, reused, done, result-settle, and error transitions through the widened store contract
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now stays aligned with the widened store shape while keeping the visible inspector surface on the existing single-card presentation until `VRI-2.2`

Closeout notes:
- this slice intentionally lands queue/archive truth before queue/archive rendering
- the next family handoff is `VRI-2.2 - Active Queue Surface`

## [x] VRI-2.2 - Active Queue Surface

### Summary

#### Purpose:
- render the active queue beneath the already-shipped current-task presentation
- keep execution order visible from top to bottom
- make queued-versus-active meaning readable without inventing completion history yet

#### Current strongest read:
- this slice is now shipped
- once `VRI-2.1` lands, the visible inspector should already have:
  - one active queue list in app state
  - explicit per-entry queue states
  - the existing combined inspector VM seam
- the shipped post-`VRI-2.1` read now specifically is:
  - `runtimeInspectorTaskStore.ts`
    - owns ordered `activeQueue` truth and bounded recent `archive` truth
  - `runtimeInspectorVm.ts`
    - still collapses visible inspector task output down to one current card, which is the exact seam this slice should widen next
  - `TitleStatusBar.tsx`
    - still renders one `Current Runtime Task` section and one card body, which means the visible queue remains intentionally deferred rather than partially implied
- the remaining work is rendering that ordered active queue in the runtime inspector without losing the compact `VRI-1` shell readability

#### Locked direction:
- keep the top active item visually strongest
- show queued items beneath it in true execution order
- let queued items read as pending work with quieter progress affordances than the active top item
- preserve the existing current-task meaning by treating it as the first active queue card rather than a second competing concept
- keep the first active-queue pass sourced directly from `activeQueue` order instead of re-sorting in presentation code
- keep archive rows invisible in this slice even though archive state already exists in app land

#### Implementation-ready seam read:
- `src/app/store/runtimeInspectorVm.ts`
  - is the strongest combined-model seam for reshaping `activeQueue` entries into one visible card list while keeping `TitleStatusBar.tsx` presentation-focused
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest presentation seam for replacing the current single-card body with an active-top plus queued-below section beneath the existing task subheader
- `src/app/theme/foundation/base.css`
  - is the strongest visual seam for differentiating active versus queued cards without destabilizing the compact title shell
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for active-top plus queued-below rendering order

#### Non-goals for this slice:
- do not add the quieter archive region yet
- do not widen into queue-updated pulse behavior yet
- do not add dependency-impact copy

### Questions / Decisions

#### [x] Question 1 - What should the top queue card be?

##### Current answer
- the already-running active item, rendered as the first card in the ordered active queue

##### Why
- that keeps one execution story instead of splitting `current task` and `queue` into separate unrelated concepts

#### [x] Question 2 - How should queued cards differ from the top active card?

##### Current answer
- queued cards should stay visibly pending and quieter, with no implication that their local progress is already advancing

##### Why
- per-card progress should remain task-local and honest

### Implementation Spec

Likely files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

Locked first-pass view-model contract:
- expose one ordered active-queue card list through `runtimeInspectorVm.ts`
- keep each visible queue card compact and presentation-ready with:
  - title
  - status label
  - progress label
  - optional progress percent
  - graph document id when present
  - detail copy when present
  - visible tone
  - explicit queue role:
    - `active`
    - `queued`
- keep the existing top-level `task` output only if it remains the first active queue card under the hood rather than a second competing concept
- prefer deriving the visible active queue from `runtimeInspectorTaskStore.activeQueue` only and leave `archive` shaping to `VRI-2.3`

Locked first-cut direction:
1. teach the combined inspector VM to expose an ordered active queue card list from the shipped `activeQueue` store seam
2. render an `Active Queue` section beneath the current runtime task surface, with the top active card first and queued cards directly below it
3. style the first active card and queued cards distinctly but coherently, without implying queued local progress is already running
4. keep `TitleStatusBar.tsx` presentation-led by moving queue-card shaping into the VM instead of building per-entry formatting logic inline
5. prove top-to-bottom order and queued-versus-active rendering in left-dock tests

Scope honored:
- keep this slice on active queue visibility only
- leave resolved/archive truth to `VRI-2.3`

Acceptance checks:
- the expanded inspector shows more than one active queue card when honest runtime truth exists
- queued entries render beneath the active item in accepted order
- the top active card remains visually strongest
- `TitleStatusBar.tsx` stays presentation-led rather than growing new queue-stitching logic inline
- the visible inspector no longer depends on archive fallback to explain more than one active item

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now exposes queued-below card output from the shipped `activeQueue` store seam while keeping the top current-task story anchored in the first queue card
- `src/app/components/TitleStatusBar.tsx`
  - now renders an `Active Queue` section beneath `Current Runtime Task`, with the top card still strongest and queued cards listed directly below it in accepted order
- `src/app/theme/foundation/base.css`
  - now gives queued cards a quieter visual treatment than the top active card without introducing archive styling yet
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves the expanded inspector renders multiple active queue cards in accepted order and keeps the top card ahead of the queued rows

Closeout notes:
- this slice intentionally stops at active queue visibility and does not expose archive UI yet
- the next family handoff is `VRI-2.3 - Archive Truth Surface`

## [x] VRI-2.3 - Archive Truth Surface

### Summary

#### Purpose:
- expose where resolved tasks go after leaving the active queue
- keep `done`, `reused`, and `error` states visually distinct
- make the archive quieter than the active queue without making it disappear

#### Current strongest read:
- this slice is now shipped
- once `VRI-2.2` lands, the active queue should already be visible
- the next missing truth is the lifecycle after resolution:
  - completed tasks should not vanish
  - reused tasks should not masquerade as completed work
  - error tasks should remain legible after leaving the active queue
- the shipped post-`VRI-2.2` read now specifically is:
  - `runtimeInspectorTaskStore.ts`
    - already owns bounded `archive` truth with explicit `done`, `reused`, and `error` states
  - `runtimeInspectorVm.ts`
    - still keeps archive mostly hidden except for the narrow error fallback path, which is the exact seam this slice should widen next
  - `TitleStatusBar.tsx`
    - already renders the visible active queue and therefore now has a clear placement seam for one quieter archive section below it

#### Locked direction:
- add one visibly quieter archive region beneath the active queue
- keep the first archive intentionally small and recent
- group or label archive rows so `Completed`, `Reused`, and `Error` remain distinct
- prefer compact recent-history truth over a large scrolling transcript
- source archive rows directly from the shipped bounded `archive` store seam instead of reconstructing outcomes from the active queue or console transcript
- keep archive presentation secondary to the active queue so the viewport inspector still reads as current-work-first

#### Implementation-ready seam read:
- the queue/archive store added in `VRI-2.1`
  - is the owner for which resolved entries remain visible and how long they stay retained
- `src/app/store/runtimeInspectorVm.ts`
  - is the strongest owner for exposing a compact archive VM with explicit tone/group meaning while keeping archive shaping out of `TitleStatusBar.tsx`
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest presentation seam for adding one quieter archive section below the now-shipped active queue
- `src/app/theme/foundation/base.css`
  - is the strongest visual seam for making archive rows calmer than active queue rows
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for resolved state grouping and quieter archive rendering

#### Non-goals for this slice:
- do not widen into deeper batch-replacement hardening yet
- do not add dependency-impact explanations
- do not turn the archive into a full transcript log

### Questions / Decisions

#### [x] Question 1 - What archive states should the first pass expose?

##### Current answer
- `Completed`, `Reused`, and `Error`

##### Why
- that matches the family vision while keeping the first archive truth compact and meaningful

#### [x] Question 2 - How should archive rows compare visually to active queue rows?

##### Current answer
- archive rows should be quieter and lower emphasis than active queue rows

##### Why
- the user should still understand recent outcomes without losing focus on current work

### Implementation Spec

Likely files:
- the queue/archive store under `src/app/store/`
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

Locked first-pass archive view-model contract:
- expose one compact visible archive list through `runtimeInspectorVm.ts`
- derive that list from `runtimeInspectorTaskStore.archive` only
- keep each archive row compact and presentation-ready with:
  - title
  - status label
  - optional progress label only when it still helps explain the final outcome
  - graph document id when present
  - detail copy when present
  - explicit archive tone:
    - `done`
    - `reused`
    - `error`
- keep the first archive pass flat and recent rather than inventing deeper nesting or transcript-like detail

Locked first-cut direction:
1. expose a small recent archive list through the combined inspector VM from the shipped `archive` store seam
2. render a quieter archive section beneath the active queue
3. keep completed, reused, and error tones distinct without making archive rows compete with the active queue visually
4. keep `TitleStatusBar.tsx` presentation-led by moving archive shaping and labeling into the VM instead of assembling archive meaning inline
5. prove that resolved rows move out of the active queue and remain visible in archive form

Scope honored:
- keep this slice on visible archive truth only
- leave stale-batch hardening to `VRI-2.4`

Acceptance checks:
- resolved runtime tasks no longer disappear immediately
- archive rows distinguish `done`, `reused`, and `error`
- active queue and archive stay visually distinct
- the runtime inspector still reads as a compact viewport-local surface rather than a transcript log
- the current error fallback no longer stands in for the only visible archive behavior once archive UI exists

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now exposes a visible archive card list from the shipped bounded `archive` store seam while filtering out the fallback error row when that same row is already occupying the current-task slot
- `src/app/components/TitleStatusBar.tsx`
  - now renders an `Archive` section beneath the active queue with one quieter recent-history list
- `src/app/theme/foundation/base.css`
  - now gives archive cards calmer completed, reused, and error treatments than the active queue while preserving distinct outcome tones
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves the expanded inspector keeps recent resolved rows visible in archive form and avoids duplicate error rendering when the current-task fallback is in use

Closeout notes:
- this slice intentionally stops at visible archive truth and does not reopen queue/archive lifecycle ownership yet
- the next family handoff is `VRI-2.4 - Queue Lifecycle Hardening And Handoff`

## [x] VRI-2.4 - Queue Lifecycle Hardening And Handoff

### Summary

#### Purpose:
- harden queue/archive behavior around stale batch replacement and bounded retention
- close `VRI-2` cleanly so later change-impact work can build on stable runtime history truth
- avoid letting the archive or queue surface drift into misleading leftovers from superseded builds

#### Current strongest read:
- this slice is now shipped
- by the time it began, the inspector already rendered:
  - an active queue
  - a recent archive
  - explicit resolved-state meaning
- the shipped post-`VRI-2.3` read that drove implementation specifically was:
  - `buildDispatcher.ts`
    - already drops stale progress, result, and worker-error traffic per routing ledger using accepted `seq` plus `buildRequestId`, which means this slice should harden inspector lifecycle behavior without creating a second stale-event gate
  - `runtimeInspectorTaskStore.ts`
    - already owns the calm first-pass archive cap through `ARCHIVE_LIMIT`, and `beginBuild(...)` already replaces visible queue/archive truth when a newly accepted build starts
  - `bootstrapBuildWiring.ts`
    - already bridges accepted build start, progress, result-settle, and worker-error hooks into that queue/archive store, which makes it the natural app-owned seam for lifecycle hardening proof
  - `bootstrapBuildWiring.test.ts`
    - already proves the basic queue/archive lifecycle transitions, but it does not yet prove accepted-build replacement, stale-drop insulation, or bounded archive rollover explicitly
  - `PrimaryViewportLeftDock.test.tsx`
    - already proves the visible queue plus archive matrix, but it does not yet prove that a replacement build leaves no misleading queue/archive residue on the rendered inspector
- the remaining work is making the now-visible surface hold up when a newer accepted build replaces older pending work and when recent archive truth rolls past the first bounded retention window
- the shipped result now specifically is:
  - `runtimeInspectorTaskStore.ts`
    - still owns the accepted replacement boundary and calm recent-history cap, now with an exported retention constant so proof stays aligned with the shipped archive window instead of duplicating magic numbers
  - `bootstrapBuildWiring.test.ts`
    - now proves that a newly accepted build clears prior queue/archive truth, stale same-routing lifecycle traffic stays ignored by the dispatcher-owned acceptance seam, and archive rollover keeps only the most recent bounded window
  - `PrimaryViewportLeftDock.test.tsx`
    - now proves the visible inspector reads only the replacement build truth instead of drifting into mixed-build queue/archive residue after superseded state is replaced

#### Locked direction:
- rely on existing dispatcher stale-build filtering instead of inventing a second stale-owner seam
- keep queue/archive state revision-aware using accepted `seq` and `buildRequestId`
- retain only a small recent archive window
- treat a newly accepted build start as the visible replacement boundary for prior queue/archive truth rather than trying to preserve mixed-build residue in the inspector
- close `VRI-2` with a stable queue/archive model and a clean handoff to change-impact work

#### Implementation-ready seam read:
- `src/app/buildDispatcher.ts`
  - already owns stale-build filtering and should remain the lower-level acceptance seam
- `src/app/bootstrapBuildWiring.ts`
  - is the strongest app seam for proving that accepted new builds replace prior inspector truth only through the existing dispatcher lifecycle hooks
- the queue/archive store under `src/app/store/`
  - is the strongest owner for bounded retention and the accepted-build replacement boundary because `beginBuild(...)`, `resolveEntry(...)`, `failBuild(...)`, and `settleBuild(...)` already define the first honest lifecycle contract
- `src/app/store/runtimeInspectorVm.ts`
  - should only change if the hardening work needs a small copy adjustment or fallback cleanup after replacement behavior is locked
- `src/app/bootstrapBuildWiring.test.ts`
  - is the strongest lifecycle-proof seam for accepted-build replacement, stale-drop insulation, and bounded archive retention
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam for confirming the post-hardening inspector does not display misleading mixed-build residue

#### Non-goals for this slice:
- do not widen into dependency impact visualization
- do not invent queue patching or invalidation explanations that the runtime does not expose yet
- do not turn the archive into indefinite history
- do not reopen queue or archive presentation styling unless a small visibility fix is required by the lifecycle hardening

### Questions / Decisions

#### [x] Question 1 - Who should own stale-build acceptance?

##### Current answer
- `buildDispatcher.ts` stays the lower-level stale-acceptance owner, with app state only reflecting accepted lifecycle truth

##### Why
- that preserves one acceptance boundary instead of duplicating stale filtering in the inspector

#### [x] Question 2 - What should this final slice prove before `VRI-2` closes?

##### Current answer
- queue/archive truth stays readable and bounded even when newer accepted work supersedes older pending work

##### Why
- later change-impact work will depend on stable recent runtime history rather than drifting leftovers

### Implementation Spec

Likely files:
- `src/app/bootstrapBuildWiring.ts`
- the queue/archive store under `src/app/store/`
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/bootstrapBuildWiring.test.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- this doc and the family index for `VRI-2` handoff wording

Locked first-cut direction:
1. prove that a newly accepted build start replaces the visible prior queue/archive state through the existing `bootstrapBuildWiring -> runtimeInspectorTaskStore.beginBuild(...)` path
2. keep stale progress, result, and worker-error rejection owned by `buildDispatcher.ts` and verify the inspector only reflects accepted lifecycle traffic after replacement
3. prove the bounded recent archive window remains calm and recent when more than the first-pass retention count resolves
4. add only the smallest VM/UI adjustment needed if replacement hardening exposes stale fallback or mixed-build copy drift
5. close `VRI-2` with a clean handoff to `VRI-3`

Scope honored:
- keep this slice on queue/archive lifecycle hardening only
- leave change-impact truth to the next phase family lane

Acceptance checks:
- a newly accepted build start clears or replaces prior visible queue/archive truth instead of leaving mixed-build inspector residue
- stale progress, stale results, and stale worker errors remain filtered by the dispatcher and do not re-enter the inspector through a second app-side ownership path
- archive retention remains bounded and calm, with only the most recent resolved rows staying visible once the cap is exceeded
- the queue/archive model is stable enough for later change-impact extension
- `VRI-2` is ready to hand forward into `VRI-3`

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorTaskStore.ts`
  - now exports the bounded archive retention constant that the shipped lifecycle proof uses as its single recent-history cap reference
- `src/app/bootstrapBuildWiring.test.ts`
  - now proves accepted-build replacement, dispatcher-owned stale-drop insulation for superseded same-routing lifecycle traffic, and bounded archive rollover through the existing queue/archive bridge
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves the visible inspector renders only replacement-build truth after prior queue/archive state is superseded instead of showing mixed-build residue

Closeout notes:
- this slice intentionally closes `VRI-2` without widening into change-impact or dependency explanation
- the next family handoff is `VRI-3 - Change Impact And Dependency Visibility`
