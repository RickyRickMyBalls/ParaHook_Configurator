# Browser Phase Browser-8.4 - Reparenting And Drop Rules

## Doc Header

### Doc History
3. 2026-03-28 11:49: Marked `Browser-8.4 - Reparenting And Drop Rules` shipped after landing the first Browser drag/drop pass for authored content owners, including same-parent reorder, cross-parent reparent, honest drop-intent affordances, and moved-owner selection retention across Browser and store seams
2. 2026-03-28 18:55: Tightened this standalone future Browser phase doc into a more concrete implementation-ready `Browser-8.4` spec by locking exact first-pass draggable owner kinds, explicit drop intents (`before` / `after` / `into`), selection behavior after successful drop, Browser-only entry for the first pass, and a sharper execution checklist for reorder versus reparent without widening into multi-select or imported hierarchy
1. 2026-03-28 17:30: Created this standalone future Browser phase doc and tightened it into an implementation-ready `Browser-8.4` spec by locking the first drag/drop scope, the legal drop matrix, world-placement-preserving reparent behavior, collapsed-owner drop behavior, authored-content-first scope, and a sharper Browser/store/Console verification checklist

### Purpose

This phase defines the first real Browser drag/drop and reparenting pass.

Use it to answer:
- which Browser rows can be dragged and dropped first
- which parent-child relationships are legal in the first reparent matrix
- how local versus world transform should behave when a row changes parents
- how Browser affordances should communicate valid and invalid drop targets
- what should stay out of scope before later hierarchy widening like nested `SubComponent`

## Doc Body

## [x] Browser-8.4 - Reparenting And Drop Rules

### Summary

`Browser-8.1` cleaned up owner-versus-leaf selection.

`Browser-8.2` added the first authored container CRUD.

`Browser-8.3` added a shared selected-owner seam across Browser, Console, and `Viewer Transform`.

`Browser-8.4` should make that structured hierarchy movable.

The first pass should support:
- same-parent reorder
- cross-parent reparent into legal structured containers
- both leaf objects and transformable containers

Shipped first-pass outcome:
- drag/drop exists in the Browser UI
- same-parent reorder and cross-parent reparent ship together
- reparent preserves world placement and recalculates local transform under the new parent
- collapsed valid owners can accept a drop directly
- invalid drops are rejected honestly with clear Browser intent
- first pass stays on authored structured content owners first
- the first pass is single-row drag/drop only
- successful drop keeps the moved row selected
- Browser drag/drop is the only entry surface in this phase; Console reflects the moved-owner result but has no direct drag/drop parity yet

### Owns

- Browser drag/drop affordances for structured content owners and leaf rows
- the first legal drop matrix for:
  - `Assembly`
  - `Subassembly`
  - `Component`
  - `Object / Part`
- same-parent reorder behavior
- cross-parent reparent behavior
- transform preservation rules during reparent
- Browser valid/invalid drop communication

### Does Not Own

- pure non-transform folders
- full imported/reference-backed hierarchy reparenting
- nested `SubComponent` legality
- full Console drag/drop parity
- new container CRUD
- multi-select drag/drop
- keyboard-driven reorder commands
- auto-expand-on-hover tree behavior beyond what is required for clear drop intent

### Locked Direction

#### 1. Same-parent reorder and cross-parent reparent should ship together

Locked rule:
- first-pass `Browser-8.4` should include:
  - same-parent reorder
  - cross-parent reparent

This keeps one coherent Browser drag/drop model instead of forcing users to learn one behavior for reorder and another later for reparent.

If scope pressure rises, keep the code structured so cross-parent reparent remains the higher-value capability, but the target shipped direction is still both together.

#### 2. World placement should win during reparent

Locked rule:
- when a row is dropped into a new valid parent:
  - keep world placement stable
  - recalculate local transform relative to the new parent container

Do not keep the old local transform if that makes the row visibly jump under its new parent.

This rule should hold for:
- transformable container owners
- leaf object/part rows

#### 3. Collapsed valid owners should accept drop directly

Locked rule:
- a collapsed valid owner should still accept a drop directly
- do not require the user to expand a container first just to reparent into it

Hover affordance is acceptable, but pre-expansion should not be mandatory.

#### 4. First-pass drag/drop should stay on authored structured content owners first

Locked rule:
- first-pass drag/drop should stay on authored structured content owners first
- do not widen the first implementation to imported/reference-backed hierarchy rows yet

That means:
- authored `Assembly`
- authored `Component`
- authored/movable `Object / Part`

Later widening can include imported/reference-backed hierarchy once the legality matrix and transform-preservation behavior are stable.

#### 5. The first legal drop matrix should stay explicit

Locked rule:
- first-pass legal containment should be:
  - `Assembly -> Subassembly / Component / Object-Part`
  - `Subassembly -> Subassembly / Component / Object-Part`
  - `Component -> Object-Part`
  - `Object-Part -> none`

Do not imply later `SubComponent` behavior from this first matrix.

Later hierarchy widening may add:
- `Component -> SubComponent`
- `SubComponent -> Object-Part`

but that should be introduced explicitly in a later phase.

#### 6. Invalid drops should reject honestly

Locked rule:
- invalid drops should not silently coerce into another target
- Browser should show clear valid/invalid drop intent

Rejected drop examples:
- dropping any row onto `Object / Part`
- dropping a container into an illegal child type
- dropping a row into itself or its own descendant branch

#### 7. The first drag set should stay explicit

Locked rule:
- first-pass draggable rows should be limited to authored content owners:
  - authored `Assembly`
  - authored `Component`
  - authored movable `Object / Part`
- imported/reference-backed hierarchy rows should not become draggable in this first pass
- runtime root rows or synthetic grouping rows should not become draggable in this first pass

This keeps the first legality matrix honest and avoids widening drag/drop into row species that still have different ownership rules.

#### 8. Drop intent should use one explicit Browser contract

Locked rule:
- the first Browser drag/drop contract should distinguish exactly three drop intents:
  - `before`
  - `after`
  - `into`
- `before` and `after` are valid only when the dragged row and target row share the same parent
- `into` is valid only when the target row is a legal container owner under the first drop matrix
- Browser hover treatment should communicate which of those three intents is currently active

Do not silently reinterpret:
- an invalid `into` as `after`
- an invalid `before`/`after` as `into`

#### 9. Successful drop should keep selection on the moved owner

Locked rule:
- after successful reorder or reparent:
  - keep the moved row selected
  - move Browser focus/highlight to the moved owner in its new location
  - keep Console content scope aligned to that moved owner

Do not fall back to the old parent selection after a successful drop.

### Concrete First-Pass Read

After this phase lands, the intended Browser behavior should allow:

- drag `Object 3` within `Assembly 1` to reorder it among siblings
- drag `Object 3` from `Assembly 1` into `Component 2`
- drag `Component 1` from one authored `Assembly` into another valid `Assembly` or `Subassembly`
- drag a collapsed valid `Assembly` target without expanding it first
- drag `Component 2` above or below its sibling within the same `Assembly`

And it should reject:

- dropping any row onto an `Object / Part`
- dropping a row into its own descendant branch
- dropping onto incompatible imported/reference-backed hierarchy in this first pass

### Public Interfaces / State Direction

The first implementation should keep drop legality and reparent execution centralized.

Likely state and seam work:
- `src/app/store/useAppStore.ts`
  - shared reparent/reorder actions
  - legality helpers
  - parent-child tree mutation helpers
  - local-transform recalculation during reparent
- `src/app/store/workspaceSelectionCommands.ts`
  - keep selection truth aligned after reorder/reparent when needed
- Browser panel/controller files under `src/app/panels/`
  - drag lifecycle
  - drop targeting
  - valid/invalid hover intent
  - row-menu or row-shell drag handles if needed

Likely shared internal shapes:
- one Browser drag payload describing:
  - dragged owner kind
  - dragged owner id
  - current parent id
- one Browser drop target payload describing:
  - target owner kind
  - target owner id
  - intended drop position:
    - `before`
    - `after`
    - `into`

### Suggested Implementation Targets

Primary likely code surfaces:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- Browser row-model / row-shell files under `src/app/panels/`

Likely supporting seams:
- Browser row-family capability mapping files
- Browser selection helpers
- shared transform/placement helpers already used by content owners

Likely test surfaces:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- store-focused tests near `useAppStore`

### Implementation Checklist

- [ ] Add one shared Browser drag/drop capability seam for authored structured content owners.
- [ ] Add one shared drag payload and drop-target payload shape instead of ad hoc row-family-specific drag data.
- [ ] Add centralized legality helpers for the first drop matrix.
- [ ] Add centralized store mutation helpers for:
  - same-parent reorder
  - cross-parent reparent
- [ ] Keep reorder semantics explicit:
  - `before`
  - `after`
- [ ] Keep reparent semantics explicit:
  - `into`
- [ ] Recalculate local transform on reparent while preserving world placement.
- [ ] Reject self-drop and descendant-cycle drops.
- [ ] Add Browser hover intent for:
  - valid drop target
  - invalid drop target
  - collapsed valid owner target
- [ ] Keep the moved row selected and focused after successful drop.
- [ ] Keep imported/reference-backed hierarchy out of the first legal drop set.
- [ ] Keep selection/focus honest after reorder or reparent.

### Test Plan

Store / model
- same-parent reorder updates sibling order correctly
- reorder does not change parent ownership
- cross-parent reparent updates the Browser tree correctly
- invalid parent/child combinations are rejected
- self-drop and descendant-cycle drops are rejected
- reparent preserves world placement and recalculates local transform
- successful reorder or reparent leaves the moved owner selected

Browser UI
- valid rows can be dragged
- valid targets show valid hover intent
- invalid targets show invalid hover intent
- collapsed valid owners accept direct drop
- `before` / `after` intent appears only for same-parent reorder
- `into` intent appears only for valid container reparent
- reorder and reparent update visible Browser structure correctly

Compatibility
- `Browser-8.1` parent-owner selection stays intact
- `Browser-8.2` authored container CRUD stays intact
- `Browser-8.3` shared selected-owner target seam stays intact
- no imported/reference-backed hierarchy drag/drop is introduced yet
- no `SubComponent` legality is introduced yet

### Assumptions

- first-pass drag/drop is Browser UI only
- first-pass scope is authored structured content owners first
- first-pass drag/drop is single-row only
- same-parent reorder and cross-parent reparent ship together
- world placement wins during reparent
- collapsed valid owners can accept direct drop
- later `SubComponent` support remains out of scope

### Follow-On Polish

- strengthen the drag-preview layer so the provisional parent target reads more clearly while the mouse moves
- keep real Browser tree mutation on drop, but make the hover state feel like the dragged owner is jumping between candidate assemblies/components in real time
- likely next-pass presentation work:
  - stronger active target highlight
  - clearer provisional `into` container treatment
  - a more readable dragged-row ghost or placeholder
