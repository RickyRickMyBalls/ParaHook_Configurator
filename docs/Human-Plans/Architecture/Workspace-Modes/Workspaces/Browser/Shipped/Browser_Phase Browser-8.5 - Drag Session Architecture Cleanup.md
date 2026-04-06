# Browser Phase Browser-8.5 - Drag Session Architecture Cleanup

## Doc Header

### Doc History
3. 2026-03-28 19:58: Marked `Browser-8.5 - Drag Session Architecture Cleanup` shipped after landing the drag-session refactor across the Browser panel/controller, extracting dedicated drag-session and preview helper seams, strengthening Browser-level cleanup fallback behavior, and keeping the dragged source row mounted while the provisional preview remains derived until drop
2. 2026-03-28 19:49: Tightened `Browser-8.5 - Drag Session Architecture Cleanup` into a more implementation-ready Browser phase by locking the drag-session state shape, the pure legality and preview-builder split, Browser-level cleanup fallbacks, concrete implementation seams, and a sharper verification matrix while keeping the later `8.6` depth-lane interaction explicitly out of scope
1. 2026-03-28 19:45: Created this standalone future Browser phase doc so the drag-session cleanup work now has its own dedicated planning surface separate from the umbrella Browser-8 index, keeping the reliability/foundation rebuild distinct from the later `Browser-8.6` depth-lane interaction upgrade

### Purpose

This phase is the structural cleanup pass for Browser drag/drop after the first shipped `8.4` reorder/reparent work and the later `8.4.x` preview polish follow-ons.

Use it to:
- stabilize drag-session ownership before more interaction features are layered on
- separate drag-session truth from preview layout and animation concerns
- remove the remaining fragility around native drag cleanup, provisional preview state, and row rendering during active drag

## Doc Body

## [x] Browser-8.5 - Drag Session Architecture Cleanup

### Summary

Rebuild the Browser drag/drop system into a cleaner layered model so reorder and reparent behavior stays smooth, predictable, and recoverable during active drag.

Phase outcome:
- Browser drag has one clear session owner
- legality resolution is derived cleanly instead of being interwoven with row-local DOM state
- provisional preview layout is derived separately from committed tree mutation
- drag cancellation and cleanup become reliable even when the drag lifecycle gets interrupted

Shipped result:
- Browser drag session state now flows through a clearer coordinator shape instead of one mixed row-handler block
- drop legality and provisional preview derivation now live in dedicated helper seams
- Browser-level fallback cleanup now clears stale drag preview state more reliably on interrupted drag
- the dragged source row stays mounted while preview layout remains derived until real drop commit

### Owns

- Browser drag-session state ownership
- separation between legality resolution, preview derivation, and rendering
- Browser-level drag cleanup / cancel / recovery behavior
- cleanup of the current row-local/native-drag coupling that still causes glitchy preview or stuck drag state

### Does Not Own

- the richer left/right hierarchy-depth interaction model
- horizontal depth lanes or lane hysteresis
- new drop legality beyond the shipped `8.4` move matrix
- auto-expand-on-hover

### Current Problem Read

The current drag system works, but it is still too fragile because several concerns are mixed together:

- row-local native drag lifecycle and Browser-level cleanup are too tightly coupled
- provisional preview layout and drop legality are too interwoven
- row rendering and FLIP animation are still carrying more lifecycle responsibility than they should
- the drag source and preview slot can still feel unstable when the rendered list changes during active drag

### Suggested Direction

- introduce one Browser drag-session coordinator that owns:
  - drag source identity
  - current hovered candidate
  - resolved drop intent
  - validity
  - cleanup / cancel / recovery
- move drop legality into a pure resolver that does not depend on row-local DOM behavior
- move provisional preview into a pure preview-layout builder that derives:
  - source-row treatment
  - provisional slot / gap placement
  - `before` / `after` / `into` guides
- keep the real dragged source row mounted during native drag
- keep FLIP/layout animation focused only on row motion:
  - not lifecycle correctness
  - not cleanup fallback
- add one reliable Browser-level cleanup path so drag state clears even if row-level `dragend` or `drop` is skipped or interrupted

### Locked Implementation Shape

- keep one explicit Browser drag session object in the panel/controller seam
- that drag session should describe:
  - source row id
  - source owner target
  - current hovered row id
  - current resolved intent
  - current resolved drop target
  - current preview metadata
  - cleanup status
- split derivation into three layers:
  - drag session state
  - pure legality resolver
  - pure preview-layout builder
- the legality resolver should only answer:
  - valid or invalid
  - `before` / `after` / `into`
  - resolved target owner
- the preview-layout builder should only answer:
  - how the source row should render during drag
  - where the provisional gap / slot should render
  - which row gets target emphasis
- keep committed move/reparent mutation only on drop
- do not mutate real Browser tree order while the session is still dragging
- keep the dragged source row mounted:
  - do not replace it with the preview slot
  - do not depend on unmount/remount to create the provisional landing state
- Browser-level cleanup should clear drag session state on:
  - successful drop
  - row-level drag end
  - cancel / escape
  - browser/window-level fallback loss of drag lifecycle
- keep current `8.4` legality rules and current `8.4.1` / `8.4.2` visual intent as much as possible unless the cleanup requires simpler rendering to stay reliable

### Implementation Targets

Primary seams:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification seams:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`

### Checklist

- introduce one explicit Browser drag session coordinator shape
- move legality resolution into a pure helper seam
- move preview-row / gap derivation into a pure preview builder seam
- keep the real dragged source row mounted during drag
- make preview rendering depend on derived session state instead of row-local lifecycle tricks
- add Browser-level cleanup fallback so stale drag state cannot remain stuck
- keep FLIP/layout animation limited to layout motion
- preserve current `8.4` reorder/reparent legality and current drop commit ownership

### Test Plan

- same-parent reorder:
  - drag object within one assembly
  - provisional preview updates live
  - no stuck drag styling remains after drop or cancel
- cross-parent reparent:
  - drag object into component
  - preview stays stable while crossing candidates
  - dropping commits correctly and keeps the moved owner selected
- interrupted drag cleanup:
  - start drag and cancel / lose lifecycle
  - provisional drag state clears
  - no preview slot or source-row drag style remains stuck
- source-row stability:
  - dragged row stays mounted during drag
  - preview does not rely on replacing the source row
- invalid target:
  - invalid affordance appears
  - no stale preview slot remains after leaving the invalid state
- regression:
  - existing `8.4` legality matrix stays unchanged
  - existing Browser CRUD and normal selection behavior stay unchanged
  - `8.6` left/right depth lanes are still not present in this phase

### Assumptions

- this is a Browser-only architecture cleanup pass
- the shipped `8.4` legality matrix remains the truth for allowed moves
- real Browser tree mutation still happens only on drop
- `Browser-8.6` depth-lane interaction remains explicitly out of scope

### Intended Outcome

- no stuck drag styling
- no fake duplicate-row feel
- stable provisional targeting while crossing candidate owners
- smoother row displacement during reorder and reparent preview
- clearer separation between:
  - drag session state
  - legality
  - preview layout
  - rendering / animation
  - committed mutation on drop

### Primary Seams

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

### Follow-On Relationship

This phase should land before `Browser-8.6 - Depth-Lane Drag Interaction`.

Locked sequencing:
- `8.5` makes drag steady
- `8.6` makes drag smarter
