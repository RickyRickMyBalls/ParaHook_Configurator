# Browser Phase Browser-5.5 - Reference Batch Load Queue And Aggregate Progress

## Doc Header

### Doc History
3. 2026-03-25 15:56: Marked Browser-5.5 shipped after the shared reference batch queue landed, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered one-at-a-time `Load All` queue, aggregate root/category progress bars, shared Browser/Console load-all entrypoints, and completion narration when the batch finishes
2. 2026-03-25 13:20: Made this Browser-5.5 follow-up implementation-ready, locking the shared `referenceLoadBatch` state shape, deterministic queue ordering, batch replacement semantics, aggregate root/category progress math, and the concrete `useAppStore` plus `ViewerHost` plus Browser row seams needed to ship honest one-at-a-time reference loading
1. 2026-03-25 13:17: Created this standalone future Browser follow-up doc to capture the next reference-loading phase, locking the direction that `Load All` and category-level reference loading should become one shared queued batch with aggregate Browser progress instead of many independent per-item loading bars

### Purpose

This phase turns Browser-side reference loading into a real batch process with one shared queue and one honest aggregate progress model.

Use it to answer:
- how `Load All` should sequence reference loading
- where the reference batch owner should live
- how Browser root/category bars should represent overall progress
- how item-level load state should coexist with batch-level progress

## Doc Body

## [x] Browser-5.5 - Reference Batch Load Queue And Aggregate Progress

### Summary

This phase makes `Load All` and category-level reference loading behave like one queued process instead of many loosely-triggered per-item loads.

Phase outcome:
- `Load All` loads references one at a time in deterministic order
- category-level load actions use the same batch model on a narrower target set
- the `References` root bar represents the whole batch progress
- category bars may represent their local share of that same batch
- item rows still keep their own local `unloaded / loading / loaded / error` state

### Shipped Result

The first shipped Browser-5.5 cut landed the shared reference batch queue and aggregate-progress layer:
- root and category `Load All` actions now start one shared `referenceLoadBatch` session instead of relying on broad visible-list load discovery
- `ViewerHost` now consumes that batch one item at a time, so references load sequentially in deterministic order and later items do not begin until the active item resolves
- the `References` root row and participating category rows now derive their bars from aggregate batch truth instead of replaying per-item `0 -> 100` progress
- item rows still keep their local `unloaded / loading / loaded / error` state while the root/category bars represent whole-batch progress
- Browser and Console `Load All` entrypoints now dispatch into the same shared batch-start seam, and the Console now prints both per-item loaded confirmations and one final completion line when the batch finishes

### Owns

- shared reference batch-load session state
- deterministic sequential reference load ordering
- aggregate Browser progress semantics for `References` root and category rows
- category-level and root-level `Load All` queue creation

### Does Not Own

- reference transform behavior
- Browser selection or Console scope routing
- worker build-pipeline execution
- final BrowserPanel structural cleanup

### Public Interfaces And State

This phase should add one shared batch owner seam for reference loading.

Recommended first state shape:
- `referenceLoadBatch: null | {`
- `requestId: string`
- `source: 'root-load-all' | 'category-load-all'`
- `targetIds: string[]`
- `remainingIds: string[]`
- `activeReferenceId: string | null`
- `completedIds: string[]`
- `failedIds: string[]`
- `startedAt: number`
- `}`

Important rules:
- `visibilityById` remains the desired-visible state
- `loadStateById` remains per-item `unloaded / loading / loaded / error`
- `referenceLoadBatch` owns the overall batch process truth
- Browser root/category rows should derive aggregate progress from `referenceLoadBatch`, not from whichever item happens to be loading right now

Current seam read:
- `loadAllReferences()` currently only flips visibility and resets errored rows
- `ViewerHost` currently loops visible unloaded references and awaits `viewer.ensureReferenceLoaded(item)`
- that broad effect loop is not a safe long-term batch owner because per-item state mutations can retrigger the effect and begin later items early

So the first implementation-ready rule is:
- move batch ownership into shared app/viewer seams explicitly
- do not rely on broad visible-list effect churn as the queue model

### Locked Direction

#### 1. Batch owner location

`Load All` should not stay as a Browser-local convenience toggle.

Locked rule:
- the batch owner should live in shared app/viewer seams
- Browser should read and present that truth
- Console and Browser should both dispatch into the same shared batch-start action
- this should not be framed as a worker-first phase unless reference loading is later moved onto a real worker boundary

#### 2. Sequential loading

Root/category reference loads should execute one item at a time.

Locked rule:
- strict queued one-at-a-time loading is the target behavior
- later references should not begin loading just because earlier per-item state mutations retrigger a broad visibility sync
- deterministic order should follow Browser tree order:
  - root batch uses the visible Browser reference-tree category/item order
  - category batch uses that category's item order
- the batch owner should track:
  - target ids
  - active id
  - completed ids
  - failed ids
  - remaining ids

Execution rule:
- when a batch starts, only one `activeReferenceId` may be in-flight at a time
- viewer execution should only advance to the next id after the active one resolves `loaded` or `error`
- stale async completions from an older batch must not mutate a newer batch; use `requestId` to guard handoff

#### 3. Batch replacement and completion

Reference batch starts should replace older unfinished batches cleanly.

Locked rule:
- starting a new root/category batch replaces any unfinished older batch
- already-loaded references may remain loaded and visible
- the new batch should recompute its own `targetIds`, `remainingIds`, and progress from current truth
- the batch completes when every targeted id has landed in either:
  - `loaded`
  - `error`

This phase does not need:
- pause/resume
- multi-batch coexistence
- per-batch transcript history beyond simple start/completion lines if wanted later

#### 4. Aggregate progress bars

Browser root/category bars should show overall batch progress, not restart `0 -> 100` for each object.

Locked rule:
- `References` root bar should reflect:
  - `(completed + failed) / total targeted items`
- category bars should show the category-local share of the active batch when that category owns or participates in the active batch
- item rows can still use local `loading / loaded / error` state
- failed items count as completed for the aggregate batch bar so one bad asset does not leave the batch visually stuck forever

Display rule:
- root/category aggregate bars should not replay `0 -> 100` for each item
- root/category bars should move forward only when the batch meaningfully advances
- item rows may still animate or show local loading state independently

#### 5. Console and Browser action ownership

`Load All` entry surfaces should dispatch into the same batch-start seam.

Locked rule:
- Browser right-click `Load All`
- Console `References > Load All`
- Console `References > Footpads > Load All`
- all dispatch into the same shared batch-start actions

This phase should prefer actions like:
- `startReferenceLoadBatchForAll()`
- `startReferenceLoadBatchForCategory(categoryId)`

over keeping `loadAllReferences()` as a pure visibility-toggle helper

### Initial Direction

The safest first cut is:
- add one shared `referenceLoadBatch` session in app state
- convert root/category `Load All` actions into batch-start actions
- keep those actions responsible for:
  - making targeted ids visible
  - resetting errored ids to `unloaded`
  - seeding one deterministic queue
- let `ViewerHost` consume the active queue one id at a time using `requestId`-guarded progression
- derive Browser root/category progress from batch truth, while leaving item-level row state intact

That keeps ownership honest:
- Browser presents aggregate batch truth
- shared app state owns the batch session
- viewer reference execution performs the actual loading
- worker build lanes remain separate unless reference loading later truly migrates there

### Required File Targets

Expected implementation seam owners:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`

Possible related verification seams:
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

### Test Plan

Required Browser-5.5 verification:

- root `Load All`:
  - starts one shared reference batch with all targeted ids in Browser tree order
  - loads targeted references one at a time
  - does not start later loads before the active load resolves
  - completes with the batch cleared or marked idle once all targeted ids are `loaded` or `error`

- category `Load All`:
  - starts one shared category batch
  - loads only the category's references
  - keeps the same batch semantics as root `Load All`
  - uses the category's item order as the queue order

- batch replacement:
  - starting a new category/root batch while another is active replaces the old batch cleanly
  - stale async completion from the replaced batch does not corrupt the new active batch

- aggregate progress:
  - `References` root bar advances by completed-target count instead of replaying per-item `0 -> 100`
  - failed items still advance batch completion
  - category bar reflects the category-local share when appropriate
  - root/category bars never reset per object while one batch is still active

- item state:
  - individual rows still show `loading / loaded / error`
  - individual row state does not overwrite the root/category aggregate meaning

- Console/Browser parity:
  - Browser root/category `Load All` and Console root/category `Load All` both start the same shared batch type
  - Console-triggered `Load All` produces the same Browser aggregate progress behavior as Browser-triggered `Load All`

### Assumptions

- current reference loading is still driven from viewer-side reference execution instead of the build worker pipeline
- Browser remains the main visual surface for reference aggregate progress
- Console root/category `Load All` actions continue to dispatch into shared app state, not Browser-local handlers
- this first cut does not need byte-level file download progress; aggregate item-completion progress is enough
