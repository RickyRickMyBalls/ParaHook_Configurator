# Browser Phase Browser-5.2 - Implicit Parent Multi-Selection

## Doc Header

### Doc History
2. 2026-03-25 10:16: Marked Browser-5.2 shipped after the grouped parent-selection code landed, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered one-root-plus-resolved-descendant selection model, grouped viewport highlight, softer grouped Browser child-row highlight, and unchanged Browser-5 deselect rules
1. 2026-03-25 10:06: Created this standalone future Browser follow-up doc and made it implementation-ready, locking the grouped parent-selection model around one primary root target plus a resolved descendant selection set, immediate grouped highlight behavior, unchanged Browser-5 deselect rules, and the boundary that later explicit `Ctrl+click` and `Shift+click` multi-select remains outside this phase

### Purpose

This phase adds implicit grouped selection for parent content rows after the Browser-5 shared selection groundwork and the Browser-5.1 reference-selection cleanup landed.

Use it to answer:
- how parent content rows should resolve to real descendant selection sets
- how one root target should coexist with many resolved selected children
- how grouped viewport highlight should behave
- how grouped parent selection should stay separate from later explicit additive multi-select

## Doc Body

## [x] Browser-5.2 - Implicit Parent Multi-Selection

### Summary

This phase makes parent content selection behave like one rooted grouped selection instead of a fake single-item selection.

Phase outcome:
- selecting an `Assembly` keeps one assembly root target
- selecting a `Component` keeps one component root target
- the workspace also resolves the selectable descendant content rows under that root into one grouped selection set
- the viewport highlights that whole resolved set immediately
- later move/rotate/scale work can apply from one root selection to the whole subtree

This phase does not yet ship later explicit additive multi-select.

### Shipped Result

The first shipped Browser-5.2 cut landed the grouped parent-selection layer:
- Browser `Assembly` selection now keeps the assembly as the primary selected target while resolving its descendant content rows into one grouped selection set
- Browser `Component` selection now keeps the component as the primary selected target while resolving its descendant content rows into one grouped selection set
- Browser `Object` selection now resolves to just that object
- the viewport now highlights the whole resolved grouped content-selection set immediately
- the Browser now keeps the root row on the stronger selected style while grouped descendant rows receive a softer grouped-selection highlight
- grouped parent selection still keeps the Browser-5 deselect and replacement rules unchanged

### Owns

- implicit grouped selection from parent content rows
- one root target plus resolved descendant selection-set truth
- grouped content highlight behavior in the viewport
- grouped-selection replacement and deselect behavior

### Does Not Own

- explicit additive multi-select
- `Ctrl+click` add/remove selection
- `Shift+click` anchor-to-range selection
- marquee/lasso selection tools
- final transform tool design
- Browser-5.3 content/reference selection to console-context integration

### Public Interfaces And State

This phase should preserve `workspaceSelection.selectedTarget` as the primary selected target.

Add one grouped-selection seam beside that primary target:
- a resolved grouped selection set for content descendants

Recommended shape:
- keep `selectedTarget` as the one primary Browser/Console/workspace target
- add a resolved content-selection collection derived from that target when the target is:
  - `assembly`
  - `component`
  - `object`

Minimum in-scope target families:
- `assembly`
- `component`
- `object`

Out of scope:
- reference rows
- graph rows
- explicit additive manual multi-select

### Locked Selection Model

#### 1. Parent content resolution

Parent content rows resolve to descendant grouped selection.

Locked rule:
- selecting an `Assembly` resolves to all selectable descendants under that assembly
- selecting a `Component` resolves to all selectable descendants under that component
- selecting an `Object` resolves to just that object
- keep the resolved set deterministic and tree-driven

#### 2. One root target remains primary

The parent/root remains the primary selected target even when many descendants are resolved.

Locked rule:
- keep one parent/root as the primary selected target for Browser, Console, and later transform ownership
- keep the resolved descendants as the grouped selection set used for viewport highlight and later transform operations
- do not collapse parent selection into an anonymous flat child-only set

#### 3. Grouped viewport highlight

Selecting a parent should immediately highlight all resolved descendants.

Locked rule:
- highlight all resolved descendants immediately
- use the same outline/glow family already used for object/reference selection
- no fill
- no size change
- do not invent a second heavier grouped-selection style in this phase

#### 4. Deselect and replacement

Grouped parent selection should keep the Browser-5 deselect baseline.

Locked rule:
- selecting a different target replaces the whole grouped selection
- empty viewport click clears the grouped selection
- empty Browser click clears the Browser row selection
- `Esc` is only a backup clear when no stronger tool/session owns it

### Initial Direction

The safest first cut is:
- keep Browser row selection rooted in one target
- derive the grouped descendant set from existing Browser/content tree ownership
- use that resolved set only for selection/highlight truth in this phase

That keeps the system understandable:
- one thing is selected as the root
- many descendants are resolved underneath it

It also sets up later phases cleanly:
- Browser-5.3 can route that rooted selection into the nearest valid console context
- later transform work can operate on the resolved descendant set from one root
- later explicit additive multi-select can extend the model without rewriting ordinary single-click behavior

### Required File Targets

Expected implementation seam owners:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

### Test Plan

Required Browser-5.2 verification:

- Browser `Assembly` row single-click:
  - keeps the assembly as the primary selected target
  - resolves all selectable descendants under that assembly into the grouped selection set
  - highlights all resolved descendants in the viewport

- Browser `Component` row single-click:
  - keeps the component as the primary selected target
  - resolves all selectable descendants under that component into the grouped selection set
  - highlights all resolved descendants in the viewport

- Browser `Object` row single-click:
  - keeps the object as the primary selected target
  - resolves only that object

- Replacement and deselect:
  - clicking another target replaces the entire grouped selection
  - empty viewport click clears grouped selection
  - empty Browser click clears Browser row selection
  - `Esc` only clears when no stronger tool/session owns it

- Regression:
  - Browser-5 Viewer-to-Browser follow still works for leaf object selection
  - Browser-5.1 reference selection behavior remains unchanged
  - ordinary click still means single-select
  - no explicit additive `Ctrl+click` or range `Shift+click` behavior is introduced yet

### Assumptions

- Browser-5 shared target truth remains the base selection seam.
- Browser-5.1 reference cleanup remains shipped and unchanged by this phase.
- Later explicit additive multi-select still uses the standard model:
  - ordinary click = single-select
  - `Ctrl+click` = add/remove selection
  - `Shift+click` = anchor-to-range selection
- Browser-5.3 selection-to-console integration should build on this rooted grouped-selection model rather than bypass it.
