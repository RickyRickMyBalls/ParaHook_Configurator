# `Import-1` - `Multi-OBJ Batch Import`

## Doc Header

### Doc History
13. 2026-04-15: Marked `Import-1` shipped after the `.obj` batch-import lane landed end to end, moved this phase record from `Future/` to `Shipped/`, and closed the parent umbrella so the import family now treats multi-`.obj` batch import as completed work rather than an open future plan
12. 2026-04-15: Implemented `Import-1 Phase 5 - Narrow Regression And Cleanup Pass` by collapsing the duplicated single-file promise lifecycle in `importReferenceFile.ts` into one shared internal import path, keeping the public helper exports stable, preserving `.obj` as the only batch-enabled type in `Import-1`, and closing the lane with focused helper tests, Browser import tests, and a clean TypeScript build
11. 2026-04-15: Tightened `Import-1 Phase 5 - Narrow Regression And Cleanup Pass` into an implementation-ready closeout slice by re-reading the shipped helper/controller/test seams and locking the only honest remaining cleanup to deduplicating the helper promise path in `importReferenceFile.ts`, keeping the `.obj`-only batch scope intact, and proving the final state with the focused helper and Browser import tests rather than widening the feature any further
10. 2026-04-15: Implemented `Import-1 Phase 4 - Browser-Level Batch Interaction Coverage` by expanding `BrowserPanel.test.tsx` to mock `importReferenceFilesFromDisk`, keeping the existing single-file `glb` coverage intact, and adding one focused `.obj` batch import test that proves the Browser path now calls the batch helper, inserts multiple references from one menu action, and closes the import menu without changing runtime/controller/helper code
9. 2026-04-15: Tightened `Import-1 Phase 4 - Browser-Level Batch Interaction Coverage` into an implementation-ready BrowserPanel test-only slice by locking the exact mock seam in `BrowserPanel.test.tsx` that still exposes only `importReferenceFileFromDiskMock`, confirming the current import test only proves one `glb` insert, and defining the next work as adding a companion `importReferenceFilesFromDisk` mock plus one `.obj` batch import test while leaving runtime code untouched
8. 2026-04-15: Implemented `Import-1 Phase 3 - Browser Controller Batch Insertion` by updating `useBrowserPanelController.ts` so only the `.obj` import branch now consumes `importReferenceFilesFromDisk('obj')`, resolves one landing parent for the whole action, inserts each returned file through repeated `addImportedReference(...)` calls, and selects the last imported row while leaving `.step` / `.stl` / `.glb` on the existing single-file helper path and still deferring BrowserPanel mock/test rewiring to `Phase 4`
7. 2026-04-15: Tightened `Import-1 Phase 3 - Browser Controller Batch Insertion` into an implementation-ready controller slice by locking the exact live `useBrowserPanelController.ts` seam that still calls `importReferenceFileFromDisk(fileType).then((file) => ...)`, confirming that only the `.obj` branch should swap to `importReferenceFilesFromDisk(...)`, keeping `.step` / `.stl` / `.glb` on the current single-file path, and explicitly deferring the BrowserPanel mock/test rewiring to `Phase 4`
6. 2026-04-15: Implemented `Import-1 Phase 2 - OBJ Multi-Select Helper Behavior` by teaching the new batch helper path to request `input.multiple = true` only for `.obj`, leaving non-`.obj` batch calls and the single-file compatibility helper on their prior single-select behavior, and extending `importReferenceFile.test.ts` to cover the exact multi-select gating rules without touching Browser/controller code yet
5. 2026-04-15: Tightened `Import-1 Phase 2 - OBJ Multi-Select Helper Behavior` into an implementation-ready helper-only slice after re-reading the shipped Phase 1 code, locking that the batch helper already returns all provided files and that Phase 2 now only needs to enable `input.multiple` for the `.obj` batch path, keep non-`.obj` batch callers single-select by default, and extend helper tests around that exact rule without touching Browser/controller behavior yet
4. 2026-04-15: Implemented `Import-1 Phase 1 - Batch-Capable Helper Contract` by adding the new `importReferenceFilesFromDisk(...)` helper export, widening the local input test shape so a later batch picker can set `multiple`, keeping `importReferenceFileFromDisk(...)` alive as the compatibility single-file seam, and covering the new helper contract in `importReferenceFile.test.ts` without changing Browser behavior yet
3. 2026-04-15: Tightened `Import-1` into an implementation-ready plan by locking the staged helper strategy around a new batch-capable helper export that can coexist with the current single-file helper, grounding each internal phase in the exact current `importReferenceFile.ts`, `importReferenceFile.test.ts`, `useBrowserPanelController.ts`, and `BrowserPanel.test.tsx` seams, and choosing `select the last imported row` as the simplest explicit Browser post-batch behavior
2. 2026-04-15: Reworked `Import-1` into a smaller internal `Phase 1` through `Phase 5` ladder so Codex can implement the batch-`.obj` improvement one narrow seam at a time across helper shape, helper behavior, Browser controller batch insertion, Browser test coverage, and final narrow regression cleanup instead of treating helper/controller/verification as one broader pass
1. 2026-04-15: Created this standalone future phase doc for `Import-1`, turning the current request for multi-`.obj` selection into a planning-only execution surface grounded in the live single-file Browser import helper, the existing one-file controller handoff, and the already-batch-safe imported-reference store path

### Purpose

This doc defines the first focused import-family phase for batch `.obj` selection.

Use it to answer:
- what should change to let users pick multiple `.obj` files at once
- which current seams already support repeated imported references
- which part of the flow is still single-file today
- how to keep the first implementation narrow and low-risk
- what should stay out of scope until later import phases

### Why This Phase Exists

The current Browser import flow already supports importing user reference assets, but the `.obj` picker interaction is still one-file-at-a-time.

That creates unnecessary friction when a user wants to load a set of related `.obj` references:
- they must reopen the import menu repeatedly
- they must repeat the same file-type choice for every file
- the store and viewer can already cope with multiple imported references, but the picker path prevents that convenience

The first honest fix is not a whole import-system rewrite.

The first honest fix is:
- let the `.obj` picker accept multiple files in one action
- return the selected files through the existing import seam
- insert them through the already-working imported-reference path

## Doc Body

## [x] `Import-1` - `Multi-OBJ Batch Import`

### Summary

#### Purpose:
- make the existing `.obj` Browser import action capable of importing a user-selected batch of `.obj` files in one picker session

#### Target result:
- clicking `Import .obj` opens a file picker that allows multi-selection
- the helper returns every selected `.obj` file, not just the first one
- the Browser controller inserts each selected file through the existing imported-reference path
- imported references still land under the same resolved parent and still use the current duplicate-label rules
- cancel behavior stays honest and does not add partial placeholder rows

#### Current code-backed read:
- `src/app/references/importReferenceFile.ts`
  - creates the browser file input
  - applies the file-type accept string
  - currently resolves only `input.files?.[0]`
- `src/app/panels/useBrowserPanelController.ts`
  - owns the Browser import-menu callback
  - currently expects one imported file result
  - currently calls `addImportedReference(...)` once
- `src/app/store/useAppStore.ts`
  - already supports repeated `addImportedReference(...)` calls
  - already disambiguates duplicate labels
- `src/viewer/Viewer.ts`
  - already loads each imported reference independently by file type

### Scope

This phase covers:
- multi-select enablement for the existing `.obj` Browser import action
- returning a batch of selected `.obj` files from the import helper
- looping imported-reference creation through the existing Browser controller path
- keeping selected imported rows under the same resolved landing parent
- updating tests so the batch behavior is verified at helper and Browser-controller level

This phase does not cover:
- batch enablement for `.step`, `.stl`, or `.glb`
- `.obj` sidecar `.mtl` file support
- texture-bundle import
- drag-and-drop import
- progress bars, toasts, or batch-status UI
- partial-failure recovery UI inside a mixed batch
- changing how imported references are stored or rendered after insertion

### Locked Direction

- keep the first batch-import change scoped to `.obj`
- keep the user entrypoint as the existing Browser `Import Reference` menu
- keep import ownership in the current imported-reference store path
- do not add a second batch-only store action unless the implementation later proves it is truly needed
- treat the helper/controller contract as the main seam to widen
- use a staged helper migration:
  - keep the current single-file helper alive initially
  - add a new batch-capable helper export for the later `.obj` path
  - migrate only the `.obj` Browser branch first
- use `select the last imported row` as the explicit post-batch Browser selection rule

### Implementation-Ready Decisions

These decisions are now locked for the first implementation pass:

- helper strategy
  - add a new batch-capable helper export in `src/app/references/importReferenceFile.ts`
  - do not widen `importReferenceFileFromDisk(...)` in the first patch
- batch metadata shape
  - keep `ImportedReferenceFile` as the per-file unit
  - the new helper should return `ImportedReferenceFile[]`
- `.obj` scope
  - only the `.obj` Browser action should consume the batch helper in `Import-1`
- controller insertion strategy
  - keep using repeated `addImportedReference(...)` calls
  - do not add a new store batch action
- Browser selection rule
  - after a successful batch insert, select the last imported row
- non-`.obj` behavior
  - `.step`, `.stl`, and `.glb` stay on the current single-file helper path during `Import-1`

### Live Seam Read

The current live code shape that `Import-1` should target is:

- `src/app/references/importReferenceFile.ts`
  - `InputLike` does not currently expose a `multiple` field
  - `importReferenceFileFromDisk(...)` returns `Promise<ImportedReferenceFile>`
  - the helper resolves only `input.files?.[0]`
- `src/app/references/importReferenceFile.test.ts`
  - the current tests only prove one-file success and cancel
- `src/app/panels/useBrowserPanelController.ts`
  - the Browser import callback currently consumes one imported file in:
    - `importReferenceFileFromDisk(fileType).then((file) => { ... })`
  - it currently adds exactly one imported reference and selects exactly one row
- `src/app/panels/BrowserPanel.test.tsx`
  - the Browser import test currently mocks one imported-file result and asserts one `addImportedReference(...)` call

This means the implementation prep should stay focused on:
- one helper file
- one helper test file
- one Browser controller seam
- one Browser test seam

### Current State

The current import lane is structurally single-file.

The key reasons are:
- the helper creates a file input without a multi-select contract
- the helper resolves only the first file from the file list
- the Browser controller consumes that helper as a single-file promise and inserts exactly one reference row

The store is not the bottleneck:
- repeated imported-reference creation already exists
- duplicate labels are already handled
- viewer loading is already reference-by-reference

So the implementation risk is mostly around keeping the picker/helper/controller contract clean and keeping tests aligned with the new batch shape.

### Target State

After `Import-1`:

- the `.obj` import button should allow multi-selection in the native picker
- one successful picker action should import every chosen `.obj` file
- each imported file should still become its own imported reference record
- duplicate names should still be disambiguated by the existing store logic
- the Browser should still resolve one landing parent for the action and apply it consistently to the batch
- canceling the picker should still behave like a no-op

### Internal Phase Ladder

The first implementation should not land as one mixed patch.

The smallest honest ladder is:

1. `Import-1 Phase 1 - Batch-Capable Helper Contract`
2. `Import-1 Phase 2 - OBJ Multi-Select Helper Behavior`
3. `Import-1 Phase 3 - Browser Controller Batch Insertion`
4. `Import-1 Phase 4 - Browser-Level Batch Interaction Coverage`
5. `Import-1 Phase 5 - Narrow Regression And Cleanup Pass`

Reason:
- this keeps type/contract work separate from behavior changes
- this keeps Browser insertion separate from helper mechanics
- this keeps tests from turning into an afterthought at the end of one large patch
- this gives later requests like `prep phase 2` or `implement phase 3` one obvious meaning

### Recommended Implementation Order

When implementation starts, the preferred order is:

1. land `Phase 1` and `Phase 2` in `src/app/references/importReferenceFile.ts` plus `src/app/references/importReferenceFile.test.ts`
2. land `Phase 3` in `src/app/panels/useBrowserPanelController.ts`
3. land `Phase 4` in `src/app/panels/BrowserPanel.test.tsx`
4. use `Phase 5` only for any tiny cleanup left by the staged rollout

Reason:
- the helper can be stabilized before the Browser path depends on it
- the Browser patch then becomes a narrow consumer change
- the Browser test can reflect the final behavior instead of guessing ahead of the implementation

## [x] `Import-1` - `Phase 1 - Batch-Capable Helper Contract`

### Purpose

- lock the helper-side batch shape without yet switching the Browser controller over to batch insertion

### Goal

- create the narrow type and export seam that later phases can consume cleanly

### Locked Direction

- keep the current per-file metadata shape for each imported file
- add or expose a batch-capable helper contract instead of forcing the whole app to switch in the same patch
- allow later phases to consume an array of imported-file records
- keep cancel/error semantics explicit in the helper contract
- do not yet change Browser import behavior in this phase

### Expected Implementation Shape

- add the batch-facing helper type/export in `src/app/references/importReferenceFile.ts`
- keep the per-file record shape as the unit of import metadata
- add `multiple?: boolean` to the local input-like test/browser shape if needed
- use a new batch-capable helper export that can coexist temporarily with the old single-file path

### Planned File Touches

- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts`

### Why This Phase Is Separate

- this is the smallest seam where single-file behavior is currently encoded
- separating the contract change first makes the Browser follow-on more mechanical
- if the contract feels awkward here, we learn that before touching controller behavior

### Verification

- TypeScript and import callers still read clearly after the helper seam is introduced
- the phase leaves one obvious helper contract for the next phase to exercise
- the old single-file helper still compiles and remains available for non-`.obj` callers

### Shipped Notes

- `src/app/references/importReferenceFile.ts` now exports:
  - `importReferenceFilesFromDisk(...)`
  - the existing compatibility helper `importReferenceFileFromDisk(...)`
- the local `InputLike` shape now allows a later phase to set `multiple` without changing Browser behavior yet
- `src/app/references/importReferenceFile.test.ts` now covers:
  - the new batch helper export
  - compatibility behavior for the single-file helper when the batch helper can yield more than one file

## [x] `Import-1` - `Phase 2 - OBJ Multi-Select Helper Behavior`

### Purpose

- make the helper actually support selecting multiple `.obj` files while keeping the change scoped to `.obj`

### Goal

- enable `.obj` multi-select in the picker and return all selected `.obj` files through the batch helper seam

### Locked Direction

- keep multi-select scoped to `.obj`
- keep the helper responsible for object-URL creation
- keep zero-file selection as the existing no-import/cancel path
- do not yet widen `.step`, `.stl`, or `.glb`
- do not touch Browser/controller behavior in this phase

### Current Live Read

After shipped `Phase 1`, the helper state is now:

- `importReferenceFilesFromDisk(...)`
  - already returns every file present in `input.files`
  - already creates one `ImportedReferenceFile` record per selected file
- `createReferenceImportInput(...)`
  - still only sets:
    - `input.type = 'file'`
    - `input.accept = ...`
  - does not yet set `input.multiple`
- `importReferenceFileFromDisk(...)`
  - still delegates to the batch helper and returns the first file

That means `Phase 2` is now narrower than the earlier plan suggested.

The actual missing product behavior is:
- the `.obj` batch helper path still never asks the native picker for multi-select

### Implementation-Ready Decisions

These are now locked for `Phase 2`:

- enable `input.multiple = true` only for the batch `.obj` helper path
- keep `input.multiple` unset for:
  - batch helper calls on non-`.obj` file types
  - the existing single-file compatibility helper path
- keep the implementation inside `src/app/references/importReferenceFile.ts`
- do not add new Browser or store changes in this phase

### Expected Implementation Shape

- update the helper input configuration so the batch `.obj` path can opt into multi-select
- keep the existing batch file-mapping logic as-is unless the implementation uncovers a real bug
- keep the helper-level cancel path explicit when the picker returns zero files
- keep the old single-file helper untouched unless it can trivially delegate without widening risk
- prefer a tiny helper seam such as:
  - an internal option/config argument
  - or a file-type-gated `multiple` assignment inside the batch helper input creation path

### Exact File Focus

Phase 2 should stay inside:

- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts`

It should not touch:

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`

### Planned File Touches

- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts`

### Why This Phase Is Separate

- this isolates the native file-input behavior change from Browser/store concerns
- the helper can be proven in tests before any UI workflow is switched over
- after Phase 1, this is now the smallest honest product-enabling helper slice left

### Verification

- helper test proving the batch `.obj` path sets `input.multiple = true`
- helper test proving the batch `.obj` path still returns all selected files in order
- helper test or assertion proving batch helper calls for non-`.obj` types leave `input.multiple` unset
- helper test proving the single-file compatibility helper still behaves as before
- existing cancel/no-file behavior remains covered and unchanged

### Ready-To-Implement Summary

`Phase 2` is ready when Codex treats it as:

1. one helper-file change to request multi-select for batch `.obj`
2. one helper-test update to prove that exact behavior
3. no Browser/controller/store work yet

### Shipped Notes

- `src/app/references/importReferenceFile.ts` now requests `input.multiple = true` only for:
  - `importReferenceFilesFromDisk('obj', ...)`
- the batch helper still leaves `multiple` unset for non-`.obj` file types
- `importReferenceFileFromDisk(...)` still uses the single-select path and remains the compatibility seam for the later Browser migration
- `src/app/references/importReferenceFile.test.ts` now proves:
  - batch `.obj` enables multi-select
  - batch non-`.obj` calls keep single-select behavior
  - single-file compatibility helper behavior stays unchanged

## [x] `Import-1` - `Phase 3 - Browser Controller Batch Insertion`

### Purpose

- switch the Browser `.obj` action from single imported-file consumption to batch insertion

### Goal

- let one `.obj` import action create many imported references through the existing store path

### Locked Direction

- change only the Browser controller seam in this phase
- resolve the landing parent once for the import action
- reuse that same parent target for every imported file in the batch
- call the existing `addImportedReference(...)` action repeatedly
- keep duplicate-label behavior owned by the store
- keep the Browser menu entrypoint unchanged
- swap only the `.obj` branch to the batch helper
- keep `.step`, `.stl`, and `.glb` on `importReferenceFileFromDisk(...)`
- do not rework BrowserPanel mocks/tests in this phase

### Current Live Read

After shipped `Phase 1` and `Phase 2`, the live controller still does:

- `setImportMenu(null)`
- `importReferenceFileFromDisk(fileType)`
- `.then((file) => {`
  - `addImportedReference({ ...file, ...resolveImportLandingParent() })`
  - `setLocalSelectedBrowserRowId(buildImportedReferenceRowId(referenceId))`
- `})`

That means the current Browser path is still structurally:
- one helper call
- one imported file
- one inserted reference
- one selected row

The helper layer is now ready for batching because:
- `importReferenceFilesFromDisk('obj', ...)` will request multi-select
- the batch helper will return every chosen `.obj` file

So the real missing behavior in `Phase 3` is only:
- consuming the batch helper in the `.obj` controller branch
- looping the returned files through the existing store action
- selecting the last imported row after the loop

### Implementation-Ready Decisions

These are now locked for `Phase 3`:

- import both helpers in `src/app/panels/useBrowserPanelController.ts`
- branch on `fileType === 'obj'`
  - `.obj`
    - use `importReferenceFilesFromDisk('obj')`
  - all others
    - keep using `importReferenceFileFromDisk(fileType)`
- resolve the landing parent once before the insert loop
- for `.obj` batch insertion:
  - call `addImportedReference(...)` once per returned file
  - capture the last returned `referenceId`
  - call `setLocalSelectedBrowserRowId(...)` once with that last inserted row
- keep the existing cancel/error handling semantics
- do not update BrowserPanel mocks/tests until `Phase 4`

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- change the import list so the controller can access both:
  - `importReferenceFileFromDisk`
  - `importReferenceFilesFromDisk`
- keep one shared `resolveImportLandingParent()` result for the whole action
- use a narrow conditional so only `.obj` switches to the batch helper
- insert each returned imported file through the existing store path
- keep the final local Browser selection behavior simple and explicit:
  - select the last imported row after the batch completes
- leave non-`.obj` menu items on their current single-file path

### Exact File Focus

Phase 3 should stay inside:

- `src/app/panels/useBrowserPanelController.ts`

It should not touch:

- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`

### Planned File Touches

- `src/app/panels/useBrowserPanelController.ts`

### Why This Phase Is Separate

- the controller change should become small once helper behavior is already proven
- keeping store insertion repeated instead of redesigned lowers risk
- deferring BrowserPanel mock/test updates keeps this turn focused on the real product seam instead of test rewiring noise

### Verification

- one `.obj` import action can trigger multiple `addImportedReference(...)` calls
- all imported files use the same resolved landing parent for the batch
- canceling still performs no insert
- the final selected Browser row is the last imported reference from the batch

### Ready-To-Implement Summary

`Phase 3` is ready when Codex treats it as:

1. one controller-file import update to bring in the batch helper
2. one narrow `.obj` branch that loops batch results through `addImportedReference(...)`
3. one explicit `last imported row` selection update
4. no BrowserPanel mock/test rewiring yet

### Shipped Notes

- `src/app/panels/useBrowserPanelController.ts` now imports both:
  - `importReferenceFileFromDisk`
  - `importReferenceFilesFromDisk`
- only the `.obj` Browser import branch now uses the batch helper
- `.step`, `.stl`, and `.glb` still use the existing single-file helper path
- the controller now:
  - resolves one landing parent for the full `.obj` action
  - inserts each returned `.obj` file through repeated `addImportedReference(...)`
  - selects the last imported row after batch insertion
- BrowserPanel mock/test rewiring is still intentionally deferred to `Phase 4`

## [x] `Import-1` - `Phase 4 - Browser-Level Batch Interaction Coverage`

### Purpose

- lock the user-facing Browser behavior with focused tests once the controller is batch-aware

### Goal

- prove the Browser-level interaction honestly instead of relying only on helper tests

### Locked Direction

- keep these tests focused on the `.obj` batch path
- verify observable Browser/controller behavior, not store internals already covered elsewhere
- do not invent new UI rules that the implementation does not actually need
- do not change runtime/controller/helper code in this phase

### Current Live Read

After shipped `Phase 3`, the remaining gap is in `src/app/panels/BrowserPanel.test.tsx`:

- the file currently hoists only:
  - `importReferenceFileFromDiskMock`
- the module mock for `../references/importReferenceFile` currently exports only:
  - `importReferenceFileFromDisk: (...args) => importReferenceFileFromDiskMock(...args)`
- the current import test still proves only:
  - one `glb` import
  - one `addImportedReference(...)` call

That means the BrowserPanel test layer still does not reflect the shipped `.obj` controller behavior:
- `.obj` now uses `importReferenceFilesFromDisk('obj')`
- `.obj` can now insert multiple references from one click path

### Implementation-Ready Decisions

These are now locked for `Phase 4`:

- add a second BrowserPanel test mock:
  - `importReferenceFilesFromDiskMock`
- update the `vi.mock('../references/importReferenceFile', ...)` block so it exports both helper mocks
- keep the existing single-file `glb` test for non-`.obj` behavior coverage
- add one focused `.obj` batch import test
- assert from that `.obj` test:
  - `importReferenceFilesFromDiskMock` is called with `'obj'`
  - `currentAppState.addImportedReference` is called once per returned `.obj` file
  - each call uses the same resolved landing parent
  - the import menu closes cleanly after the action
- do not add extra UI expectations beyond what the current BrowserPanel test harness can already observe cleanly
- final row selection coverage is optional here unless the test harness can assert it cheaply; if it becomes noisy, keep that check out of `Phase 4`

### Expected Implementation Shape

- update `src/app/panels/BrowserPanel.test.tsx`
- add one new top-level mock variable for `importReferenceFilesFromDiskMock`
- initialize/reset that mock in `beforeEach`
- extend the import-reference module mock so BrowserPanel can call both helper mocks
- keep the existing single-file import test for `glb`
- add one new test that covers a batch `.obj` import from the existing `Import Reference` menu
- assert multiple `addImportedReference(...)` calls from one click path
- assert the import menu closes cleanly

### Planned File Touches

- `src/app/panels/BrowserPanel.test.tsx`

### Exact File Focus

Phase 4 should stay inside:

- `src/app/panels/BrowserPanel.test.tsx`

It should not touch:

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts`

### Why This Phase Is Separate

- Browser interaction tests tend to be noisier than the implementation itself
- keeping them in their own phase makes it easier for Codex to stabilize the surface without mixing in more product changes
- after Phase 3, the main remaining risk is stale test coverage rather than missing runtime behavior

### Verification

- BrowserPanel test proves one `.obj` click path can import multiple files
- BrowserPanel test confirms the `.obj` branch uses the batch helper mock instead of the single-file helper mock
- BrowserPanel test keeps the existing single-file `glb` path honest
- BrowserPanel test confirms the batch path does not require a new menu surface

### Ready-To-Implement Summary

`Phase 4` is ready when Codex treats it as:

1. one BrowserPanel test-file mock expansion for the batch helper
2. one new `.obj` batch import test
3. no runtime/controller/helper changes

### Shipped Notes

- `src/app/panels/BrowserPanel.test.tsx` now hoists both:
  - `importReferenceFileFromDiskMock`
  - `importReferenceFilesFromDiskMock`
- the import-reference module mock now exposes both helper seams to the BrowserPanel test harness
- the existing single-file `glb` import test remains in place for non-`.obj` coverage
- BrowserPanel now has a focused `.obj` batch import test that proves:
  - the `.obj` path calls `importReferenceFilesFromDisk('obj')`
  - one menu action can trigger multiple `addImportedReference(...)` calls
  - the batch insert uses the expected landing parent
  - the import menu closes after the action

## [x] `Import-1` - `Phase 5 - Narrow Regression And Cleanup Pass`

### Purpose

- finish the first batch-import lane with a small regression sweep and any tiny cleanup exposed by the earlier slices

### Goal

- leave the `.obj` batch path clean, explicit, and narrowly verified without widening the feature

### Locked Direction

- keep this phase for small cleanup only
- do not turn this pass into `.mtl`, textures, drag-and-drop, or all-file-type parity
- prefer clarifying names/comments/tests over structural expansion
- keep `.obj` as the only batch-enabled file type for `Import-1`
- do not change Browser/controller behavior unless a tiny cleanup is truly necessary

### Current Live Read

After shipped `Phase 4`, the remaining runtime and test seams are already behaving correctly:

- `src/app/references/importReferenceFile.ts`
  - exports both:
    - `importReferenceFilesFromDisk(...)`
    - `importReferenceFileFromDisk(...)`
  - still contains duplicated promise/onchange/cleanup logic between the batch and single-file helpers
- `src/app/panels/useBrowserPanelController.ts`
  - already uses the batch helper only for `.obj`
  - already keeps `.step`, `.stl`, and `.glb` on the single-file path
- `src/app/panels/BrowserPanel.test.tsx`
  - already covers:
    - one single-file `glb` import
    - one batch `.obj` import

That means the final honest `Import-1` cleanup target is not more feature work.

The final honest target is:
- remove any small helper duplication or awkward transitional naming left by the staged rollout
- then prove the shipped `.obj` batch path and non-`.obj` single-file paths still hold

### Implementation-Ready Decisions

These are now locked for `Phase 5`:

- cleanup may touch:
  - `src/app/references/importReferenceFile.ts`
  - `src/app/references/importReferenceFile.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
- the preferred cleanup is:
  - collapse the duplicated single-file promise path so `importReferenceFileFromDisk(...)` delegates cleanly to the batch helper without re-implementing the same input/onchange/cleanup flow
- keep helper export names unchanged in `Import-1`
- keep controller branching unchanged in `Import-1`
- keep `.obj` as the only batch-enabled file type in `Import-1`
- if no meaningful cleanup remains after the regression sweep, the phase can close with test/verification only

### Expected Implementation Shape

- simplify `src/app/references/importReferenceFile.ts` so the single-file helper reuses the shipped batch path instead of duplicating the same promise lifecycle
- keep the public helper exports stable
- keep the tests readable around:
  - single-file `glb`
  - batch `.obj`
- do one final narrow regression pass across helper and Browser import coverage

### Planned File Touches

- `src/app/references/importReferenceFile.ts`
- `src/app/references/importReferenceFile.test.ts` if helper expectations need tiny wording/assertion cleanup
- `src/app/panels/BrowserPanel.test.tsx` only if a tiny readability cleanup is truly needed

### Exact File Focus

Phase 5 should prefer staying inside:

- `src/app/references/importReferenceFile.ts`

It should avoid touching:

- `src/app/panels/useBrowserPanelController.ts`

unless a tiny cleanup is truly necessary for readability only

### Why This Phase Is Separate

- staged implementation often leaves tiny naming or compatibility leftovers
- having an explicit cleanup phase prevents those leftovers from getting bundled into bigger feature phases later
- after Phase 4, the most visible remaining issue is helper duplication, not missing product behavior

### Verification

- `.obj` batch import remains covered end to end
- non-`.obj` imports still behave as before
- the final code and tests no longer read like a temporary transition if the earlier phases introduced one

### Ready-To-Implement Summary

`Phase 5` is ready when Codex treats it as:

1. one small helper cleanup pass to remove duplicated single-file promise logic if it can be done cleanly
2. zero feature widening
3. one final focused regression sweep using:
   - `src/app/references/importReferenceFile.test.ts`
   - the BrowserPanel import tests

### Shipped Notes

- `src/app/references/importReferenceFile.ts` now routes both public helpers through one shared internal import path instead of duplicating the same promise/onchange/cleanup lifecycle
- `importReferenceFileFromDisk(...)` still remains the public compatibility single-file helper
- `importReferenceFilesFromDisk(...)` still remains the public batch helper
- `.obj` is still the only batch-enabled type in `Import-1`
- the controller and BrowserPanel test surfaces did not need further behavior changes in this cleanup pass
- `Import-1` now closes with:
  - helper coverage
  - Browser import coverage
  - a clean TypeScript build

### Questions / Decisions

#### [ ] Question 1 - Should the first batch cut apply only to `.obj`?

##### Suggested answer
- yes, and this is now locked for `Import-1`

##### Why
- the request is specifically about `.obj`
- the current user pain is already clear there
- a narrow file-type-specific cut lowers risk and keeps the phase honest

#### [ ] Question 2 - Should batch insertion use the existing store action repeatedly?

##### Suggested answer
- yes, and this is now locked for `Import-1`

##### Why
- the store already supports repeated imported-reference insertion
- duplicate labels are already handled there
- introducing a new batch-only store action would widen the first change without clear payoff

#### [ ] Question 3 - How should landing-parent resolution work for a batch?

##### Suggested answer
- resolve the landing parent once and reuse it for all files in the same batch, and this is now locked for `Import-1`

##### Why
- the import action is one user gesture from one Browser location
- per-file parent variation would be surprising and is not needed for the first pass

#### [ ] Question 4 - Should the first implementation widen the existing helper or add a new batch helper?

##### Suggested answer
- add a new batch-capable helper export first

##### Why
- this keeps `.step`, `.stl`, and `.glb` on the current single-file path during the `.obj` rollout
- this makes `Phase 1` small enough to land without immediately changing Browser behavior
- this gives `Phase 5` a clean place to remove or consolidate compatibility seams later if that still feels worthwhile

#### [ ] Question 5 - Which imported row should the Browser select after a successful batch?

##### Suggested answer
- select the last imported row

##### Why
- it is simple and deterministic
- it matches the final item inserted by the batch loop
- it avoids inventing a new multi-selection requirement for the Browser during `Import-1`

### Risks

- changing the helper from single-item output to batch output could force test and caller updates anywhere the current single-file contract is assumed
- if selection/focus behavior is updated carelessly, the Browser could end up only selecting the first imported row or the wrong final row after batch insertion
- widening too early into all file types or `.mtl` sidecars would make the first change broader than the user actually asked for

### Non-Goals

Do not expand `Import-1` into:
- material parsing for `.obj`
- texture import
- filesystem folder import
- drag-and-drop
- import-session progress UI
- persistence/export redesign for imported references

### Verification

Minimum proof for this phase:

1. `Import-1 Phase 1` locks one batch-capable helper contract that later phases can consume cleanly.
2. `Import-1 Phase 2` proves `.obj` helper multi-select behavior and cancel handling.
3. `Import-1 Phase 3` proves one Browser `.obj` action can create multiple imported references.
4. `Import-1 Phase 4` proves the Browser-level interaction from the existing import menu.
5. `Import-1 Phase 5` leaves the final lane narrow, readable, and free of accidental feature widening.

### Exit Criteria

`Import-1` is ready to implement when:
- the internal phase ladder is small enough for one-Codex-turn slices
- the staged helper strategy is locked
- the helper contract change is locked
- the controller batch-insert direction is locked
- the final Browser selection rule is locked
- the out-of-scope lines are explicit
- verification expectations are narrow enough to keep the first implementation honest
