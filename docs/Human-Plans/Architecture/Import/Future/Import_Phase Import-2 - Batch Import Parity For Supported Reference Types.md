# `Import-2` - `Batch Import Parity For Supported Reference Types`

## Doc Header

### Doc History
1. 2026-04-15: Created this standalone future phase doc for `Import-2`, translating the later request for "batch import any file" into an honest ParaHook planning lane for batch-selection parity across the currently supported import menu file types (`.step`, `.stl`, `.obj`, `.glb`) instead of promising arbitrary new file-format support

### Purpose

This doc defines the next import-family phase after the shipped `.obj` batch lane.

Use it to answer:
- how batch import should expand beyond `.obj`
- which file types are actually in scope for the next parity pass
- how to keep the follow-on work honest to the current import menu
- how the parity work should be broken into Codex-sized slices
- what still stays out of scope after batch parity lands

### Why This Phase Exists

`Import-1` intentionally started narrow with `.obj`.

That was the right first step because:
- the user pain was concrete there
- the helper/controller seams could be widened safely
- the existing store already supported repeated imported-reference insertion

But the user-facing import surface is broader than just `.obj`.

The current `Import Reference` menu already offers:
- `.step`
- `.stl`
- `.obj`
- `.glb`

Once `.obj` batch import is shipped, the next honest product question is:
- why can the user batch import one supported menu type but not the others?

So `Import-2` should be the parity lane that extends the same batch-selection affordance across the rest of the currently supported menu file types without pretending ParaHook suddenly supports arbitrary new file extensions.

## Doc Body

## [ ] `Import-2` - `Batch Import Parity For Supported Reference Types`

### Summary

#### Purpose:
- extend the shipped `.obj` batch-import pattern to the rest of the currently supported import menu file types

#### Target result:
- the user can batch select `.step`, `.stl`, `.obj`, and `.glb` from the existing import menu
- each selected file still becomes its own imported reference record
- the Browser still resolves one landing parent per import action
- duplicate labels still stay owned by the existing store behavior
- the same import menu can support batch import parity without adding a new surface

#### Scope statement:
- `Import-2` means batch parity for all currently supported menu file types
- `Import-2` does not mean support for arbitrary new formats outside:
  - `.step`
  - `.stl`
  - `.obj`
  - `.glb`

### Current State

After shipped `Import-1`, the family direction is:

- `.obj`
  - batch import lane exists
  - helper/controller path has already been widened
- `.step`
  - still single-select
- `.stl`
  - still single-select
- `.glb`
  - still single-select

That means the remaining user-facing inconsistency is not the Browser menu itself.

The remaining inconsistency is:
- helper multi-select gating still favors `.obj`
- controller batch migration still favors `.obj`
- BrowserPanel coverage still needs parity once the runtime path expands

### Locked Direction

- keep the follow-on honest to the current supported import menu file types only
- reuse the already-established `Import-1` batch architecture instead of inventing a second parity path
- prefer one shared batch import behavior for all supported file types unless a specific loader proves it cannot safely follow that rule
- keep file-type-specific parsing, materials, or asset-pipeline quirks out of the parity lane unless they directly block the basic batch interaction
- keep the Browser entrypoint unchanged

### Non-Goals

`Import-2` should not expand into:
- arbitrary new file extensions
- `.obj` `.mtl` or texture bundle work
- archive import
- drag-and-drop import
- import progress UI
- persistence redesign for imported references
- type-specific transform or loader refactors that are unrelated to basic batch selection parity

### Internal Phase Ladder

The cleanest parity ladder is:

1. `Import-2 Phase 1 - Helper Multi-Select Parity For Supported Types`
2. `Import-2 Phase 2 - Browser Controller Batch Parity For Supported Types`
3. `Import-2 Phase 3 - BrowserPanel Parity Coverage`
4. `Import-2 Phase 4 - Narrow Cleanup And Regression Pass`

Reason:
- the helper gating should widen before the controller consumes it
- the controller path should widen before BrowserPanel expectations are rewritten
- the parity lane should stay incremental rather than mixing runtime and test churn in one patch

## [ ] `Import-2` - `Phase 1 - Helper Multi-Select Parity For Supported Types`

### Purpose

- extend batch-helper multi-select gating from `.obj` to the rest of the supported import menu file types

### Goal

- make `importReferenceFilesFromDisk(...)` request multi-select for every currently supported import menu type

### Locked Direction

- widen the batch helper for:
  - `.step`
  - `.stl`
  - `.glb`
- keep the existing compatibility single-file helper alive unless later cleanup removes it safely
- do not touch Browser/controller behavior in this phase

### Expected Implementation Shape

- update the helper gating in `src/app/references/importReferenceFile.ts`
- widen the helper tests in `src/app/references/importReferenceFile.test.ts`
- prove batch-helper multi-select parity for all supported menu file types

## [ ] `Import-2` - `Phase 2 - Browser Controller Batch Parity For Supported Types`

### Purpose

- extend the Browser controller batch path from `.obj` to all supported import menu file types

### Goal

- let one import action batch-insert `.step`, `.stl`, `.obj`, or `.glb` through the same existing store path

### Locked Direction

- reuse the existing `addImportedReference(...)` insertion pattern
- keep one resolved landing parent per import action
- keep the last imported row as the explicit final selection rule unless a better shared rule is already proven by then
- do not widen the UI beyond the current import menu

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- remove the `.obj`-only controller branching in favor of batch parity across supported menu types
- keep cancel/error handling semantics aligned with the shipped import flow

## [ ] `Import-2` - `Phase 3 - BrowserPanel Parity Coverage`

### Purpose

- make the BrowserPanel test surface reflect the full supported batch-import parity behavior

### Goal

- prove that each supported import menu entry can follow the batch path honestly through the existing Browser surface

### Locked Direction

- keep the tests focused on supported menu file types only
- verify observable Browser/controller behavior
- do not reopen helper or controller design in this phase

### Expected Implementation Shape

- extend `src/app/panels/BrowserPanel.test.tsx`
- add parity coverage for non-`.obj` batch imports
- keep the existing focused `.obj` batch test as part of the final parity surface

## [ ] `Import-2` - `Phase 4 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the parity lane with any small cleanup left behind by the staged rollout

### Goal

- leave supported batch import parity clean and explicit without widening the feature family

### Locked Direction

- keep this pass narrow
- do not turn it into new format support
- prefer cleanup, clarity, and regression hardening only

### Verification

Minimum proof for `Import-2`:

1. supported import menu file types can all request multi-select through the batch helper
2. Browser/controller runtime can batch insert each supported menu file type
3. BrowserPanel coverage reflects the supported batch parity honestly
4. the import menu does not need a new surface to expose the parity behavior

### Exit Criteria

`Import-2` is ready to implement when:
- the scope is locked to current supported menu file types
- the helper-first, controller-second, test-third ladder is clear
- the doc does not overpromise arbitrary new file-format support
