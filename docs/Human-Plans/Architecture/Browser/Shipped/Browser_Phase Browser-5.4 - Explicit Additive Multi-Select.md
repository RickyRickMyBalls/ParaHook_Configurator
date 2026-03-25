# Browser Phase Browser-5.4 - Explicit Additive Multi-Select

## Doc Header

### Doc History
2. 2026-03-25 15:56: Marked Browser-5.4 shipped after explicit additive multi-select landed, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered shared explicit-selection set, range anchor, modifier-aware Browser click behavior, grouped parent-selection unioning, and synthetic `Multi Select` Console scope
1. 2026-03-25 14:39: Created this standalone future Browser follow-up doc and made it implementation-ready, locking the explicit multi-select model around ordinary-click replacement, `Ctrl+click` toggle membership, `Shift+click` visible-range expansion, one primary selected target plus one range anchor, honest merging with rooted grouped parent selection, and the later synthetic `Multi Select` Console scope for explicit mixed sets

### Purpose

This phase adds explicit additive Browser multi-select after the Browser-5 shared selection groundwork, the Browser-5.2 rooted grouped parent-selection model, and the Browser-5.3 selection-to-console routing pass landed.

Use it to answer:
- how explicit multi-select should coexist with one primary selected target
- how `Ctrl+click` and `Shift+click` should edit the current selection set
- how rooted grouped parent selection should merge with explicit additive selection
- what Console scope explicit mixed selection should produce

## Doc Body

## [x] Browser-5.4 - Explicit Additive Multi-Select

### Summary

This phase adds explicit additive and range-based Browser multi-select on top of the already-shipped rooted selection model.

Phase outcome:
- ordinary click still replaces the current selection with one target
- `Ctrl+click` adds or removes explicit root targets from the current selection set
- `Shift+click` selects a visible Browser-row range from the current anchor to the clicked row
- parent content targets still keep their Browser-5.2 rooted grouped-selection meaning
- explicit mixed selection uses a synthetic `Multi Select` Console scope instead of pretending to be one rooted `Select` scope

### Shipped Result

The first shipped Browser-5.4 cut landed explicit additive Browser multi-select:
- `workspaceSelection.selectedTarget` now stays as the canonical primary target while shared `explicitSelectedTargets` and `selectionAnchorTarget` carry the additive selection set and range anchor
- ordinary click still replaces selection, `Ctrl+click` now toggles content/reference roots into or out of the explicit set, and `Shift+click` now builds a same-section visible range from the current anchor
- removing the current primary target now promotes the most recently remaining explicit target so the shared selection model keeps one stable primary target whenever the set still contains rows
- parent content targets still contribute their rooted grouped descendant payload inside explicit sets, so effective content selection becomes the union of each selected rooted payload instead of flattening parents into anonymous child-only rows
- explicit mixed multi-selection now routes the Console into synthetic `Select > Multi Select`, while collapsing back to one explicit target returns to the ordinary single-target `Select > ...` scope

### Owns

- explicit additive selection-set editing in Browser
- one primary selected target plus one explicit selection set
- range-anchor and visible-range selection rules
- merge behavior between explicit additive selection and rooted grouped parent selection
- synthetic `Multi Select` Console scope for explicit mixed sets

### Does Not Own

- marquee or lasso tools
- viewport-first additive picking UX
- final transform-command richness for multi-select
- reference batch loading
- BrowserPanel structural cleanup

### Public Interfaces And State

This phase should preserve `workspaceSelection.selectedTarget` as the primary selected target truth.

This phase should add explicit-selection state beside that primary target:
- one explicit selection collection of user-chosen root targets
- one range anchor target

Recommended first shape:
- keep `selectedTarget` as the primary last-committed target
- add an explicit multi-select collection for the current Browser-chosen roots
- add a `selectionAnchorTarget` used by `Shift+click`
- keep Browser-5.2 `resolvedContentSelection` for rooted parent content selection

Important rules:
- explicit selection should store root targets, not only flattened leaf descendants
- each explicit target keeps its own rooted meaning:
  - `object` contributes itself
  - `component` contributes itself plus its resolved descendants
  - `assembly` contributes itself plus its resolved descendants
  - `reference-item` contributes itself
- do not derive the explicit selection set from Browser-local row styling alone
- Console and viewport highlight should consume shared selection truth after Browser updates it

### Locked Selection Model

#### 1. Click grammar

Explicit additive multi-select uses the standard desktop click grammar.

Locked rule:
- ordinary click replaces the whole selection with the clicked target
- `Ctrl+click` toggles the clicked target in the explicit selection set
- `Shift+click` selects the visible Browser range from the current anchor to the clicked row
- if no anchor exists yet, `Shift+click` falls back to ordinary single-select behavior

#### 2. One primary target still exists

Explicit multi-select does not remove the need for one primary selected target.

Locked rule:
- keep one primary selected target as the most recently committed clicked target
- keep the explicit selection collection beside that primary target
- the primary target owns:
  - last-click focus semantics
  - later command defaults where one item still needs to be surfaced first
  - the range anchor update on ordinary click and `Ctrl+click`

#### 3. Rooted grouped parent selection still keeps its meaning

Parent content targets continue to behave like rooted grouped selections even inside explicit sets.

Locked rule:
- selecting an `Assembly` or `Component` still contributes one rooted grouped selection payload
- do not flatten parent content targets into anonymous child-only rows inside the explicit set
- the effective resolved execution selection is the union of every explicit target's rooted payload
- grouped parent selection and explicit additive selection must merge honestly instead of fighting each other

#### 4. Range behavior uses visible Browser order

Range selection should follow what the user can currently see in the Browser.

Locked rule:
- `Shift+click` range uses the current visible Browser row order after expand/collapse state is applied
- hidden rows are not included in the range
- non-selectable rows may be skipped, but the visible row order is still the range backbone
- this phase does not invent semantic graph-only range rules separate from Browser order

#### 5. Explicit mixed sets use `Multi Select`

Explicitly mixed multi-select should not pretend to be one rooted `Select` scope.

Locked rule:
- one rooted content selection still uses the existing `Select > ...` Console path
- an explicit set containing more than one root target should route into a synthetic `Multi Select` scope
- if the explicit set collapses back to one target, Console returns to the ordinary Browser-5.3 single-target scope

### Initial Direction

The safest first cut is:
- keep Browser-5.2 rooted selection truth intact
- add explicit-selection state beside that rooted model instead of replacing it
- let `Ctrl+click` and `Shift+click` edit explicit root targets only
- derive the final effective selection/highlight set from the union of each explicit target's rooted payload
- let Console consume that shared truth and use `Multi Select` only for genuine explicit mixed sets

That keeps ownership honest:
- Browser edits the shared selection set
- shared workspace state owns the selection truth
- Console consumes that truth for scope routing
- the later transform/tool layers can reuse the same explicit selection model

### Required File Targets

Expected implementation seam owners:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`

Possible related verification seams:
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

### Test Plan

Required Browser-5.4 verification:

- ordinary click:
  - replaces the whole explicit selection with one target
  - updates the primary target
  - updates the range anchor

- `Ctrl+click` add/remove:
  - adds an unselected target to the explicit selection set
  - removes a selected target from the explicit selection set
  - keeps one stable primary target after each toggle

- `Shift+click` range:
  - uses the visible Browser row order from the current anchor to the clicked row
  - includes only currently visible selectable rows
  - falls back safely when no anchor exists yet

- rooted parent merge:
  - `Assembly` or `Component` explicit selection still contributes its resolved grouped descendants
  - mixing parent and leaf targets produces one honest unioned effective selection set
  - Browser grouped-highlight rules remain readable and do not erase the root-row styling

- Console scope:
  - one explicit selected target still routes to the existing `Select > ...` scope
  - more than one explicit root target routes to synthetic `Multi Select`
  - collapsing the set back to one target returns to the single-target scope

- deselect and replacement:
  - ordinary click on a new target replaces the whole set
  - empty Browser click clears the explicit selection set
  - empty viewport click clears the shared lightweight selection when no stronger tool owns it
  - `Esc` remains backup clear only when no stronger tool/session owns it

- regression:
  - Browser-5 ordinary single-select behavior still works
  - Browser-5.2 rooted grouped parent-selection behavior still works
  - Browser-5.3 content/reference selection-to-console routing still works for single-target selection
  - Browser-5.5 reference batch loading behavior remains unrelated and unchanged

### Assumptions

- Browser-5 shared target truth remains the base selection seam.
- Browser-5.2 rooted grouped parent-selection truth remains the basis for parent content targets inside explicit sets.
- Browser-5.3 single-target selection-to-console routing remains the baseline when the explicit set contains only one target.
- This phase focuses on Browser-originated explicit additive selection first; richer viewport-originated additive picking may remain a later follow-up if it is not already practical from shared state.
