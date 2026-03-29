# Browser Phase Browser-8.8.3 - Motion And Rearrange Polish

## Doc Header

### Doc History
4. 2026-03-28 15:44: Marked `Browser-8.8.3 - Motion And Rearrange Polish` shipped after adding calmer lifted-row and insert-line motion, plus a display-intent layer so legal cross-parent moves keep a visible blue landing slot while owner highlight stays secondary support
3. 2026-03-28 15:36: Tightened `Browser-8.8.3 - Motion And Rearrange Polish` into a more implementation-ready Browser follow-on by locking the exact cross-parent insert-line rule, keeping motion secondary to target trust, sharpening the expected Browser drag seams, and expanding the verification matrix around legal cross-parent slot communication
2. 2026-03-28 15:32: Expanded `Browser-8.8.3 - Motion And Rearrange Polish` so the next Browser drag follow-on now explicitly keeps the blue insert-line language consistent across cross-parent moves, locking that a legal move into another assembly/component should still show the landing slot while owner highlight remains secondary ownership support
1. 2026-03-28 21:14: Created this standalone future Browser phase doc so the Browser drag restart now has a dedicated third-step polish surface for adding back light motion only after the simpler rearrange baseline and target clarity feel trustworthy

### Purpose

This phase follows shipped `Browser-8.8.2`.

Use it to:
- add motion polish back in after the simplified drag system feels correct
- keep animation secondary to correctness
- keep the visible drop explanation consistent when legal cross-parent moves occur

## Doc Body

## [x] Browser-8.8.3 - Motion And Rearrange Polish

### Summary

Add light motion polish back into the simplified Browser drag interaction without making animation responsible for drag correctness.

Phase outcome:
- dragged rows feel calmer while moving
- row displacement feels smoother
- insert-line settle feels cleaner
- legal cross-parent drops still read through a clear landing slot

Shipped result:
- dragged Browser rows now get a calmer lifted motion treatment while active instead of feeling fully static
- Browser row shells and insert lines now settle more softly through small transition polish
- Browser drag now separates committed drop intent from display intent, so legal cross-parent `into` moves can still commit as `into` while rendering a blue landing slot at the correct visible child boundary
- expanded valid owners now keep owner highlight as secondary support while the primary cue answers where the row will land
- collapsed or empty owners keep the existing `into` highlight path when there is no visible landing slot to show yet

### Owns

- light drag-motion polish
- row displacement polish
- insert-line settle polish
- consistent insert-line language across legal cross-parent moves

### Does Not Own

- correctness of target resolution
- fake-tree preview
- hierarchy-line rewiring
- depth-lane interaction
- new legality behavior

### Locked Direction

- motion must stay secondary to clarity
- animation must not become responsible for drag correctness
- keep the simpler `8.8.1` visible grammar intact while adding polish
- keep the drop language consistent even across parent changes:
  - when a dragged row moves from one assembly/component into another valid owner, Browser should still show the blue insert-line where the row will land inside the receiving owner
  - owner highlight can remain, but only as a secondary cue for who will own the row after drop
  - the primary cue should continue to answer `where will this row land`
- in the first pass of this phase:
  - legal cross-parent moves should prefer a visible insertion slot over owner-highlight-only explanation
  - owner highlight should support the insertion slot, not replace it
- keep the simpler restart constraints intact:
  - no fake local-tree preview
  - no hidden-source-row behavior
  - no depth-lane interaction
  - no heavier hierarchy guidance
- motion scope stays intentionally light:
  - calm lifted-row treatment
  - row displacement settle
  - insert-line settle/refinement
  - no motion system that tries to explain legality on its own

### Implementation Targets

Primary seams:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification:
- `src/app/panels/BrowserPanel.test.tsx`

Primary code-shape expectation:
- `useBrowserPanelController.ts`
  - keeps pointer/session ownership unchanged while exposing the resolved legal cross-parent landing slot to the view layer
- `browserContentDrag.ts`
  - keeps legality untouched but may refine preview-intent output so valid cross-parent moves keep a concrete insertion-slot answer
- `browserTreeSections.tsx`
  - adds light displacement/settle behavior without reintroducing placeholder branches
- `browserTreeRowPresenter.tsx`
  - keeps `before` / `after` / `into` visually distinct while allowing owner-highlight support to coexist with the primary insertion-slot cue during legal cross-parent moves
- `browser.css`
  - owns the subtle motion, settle timing, and clearer slot-versus-owner visual balance

### Checklist

- add calm lifted-row motion
- improve row displacement feel
- improve insert-line settle
- keep cross-parent legal moves on the same insert-line language
- make cross-parent legal moves prefer a visible landing slot over owner-highlight-only explanation
- keep motion subtle
- keep target clarity unchanged

### Test Plan

- drag still commits exactly where the indicator shows
- motion does not introduce stale preview state
- row displacement feels smoother without changing legality
- cross-parent legal moves still show a clear insertion slot instead of switching to owner-highlight-only explanation
- same-parent reorder still uses the same insert-line language after motion tuning
- legal move into another assembly/component still answers `where will this row land` before it answers `who will own it`
- invalid targets do not start looking valid because of added motion
- Browser create/rename/delete and selection handoff remain unchanged

### Assumptions

- `8.8.1` and `8.8.2` are already behaving correctly
- this phase is polish and communication tuning only
- legality and committed move/reparent truth stay unchanged
