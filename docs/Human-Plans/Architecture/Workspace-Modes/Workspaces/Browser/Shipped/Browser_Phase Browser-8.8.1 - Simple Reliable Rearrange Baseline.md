# Browser Phase Browser-8.8.1 - Simple Reliable Rearrange Baseline

## Doc Header

### Doc History
3. 2026-03-28 15:08: Marked `Browser-8.8.1 - Simple Reliable Rearrange Baseline` shipped after landing the simpler real-row Browser drag baseline, removing fake placeholder / hidden-source-row preview behavior, and keeping the visible drop explanation limited to one exact insert line or owner highlight while the pointer/session foundation from `8.7` stays intact
2. 2026-03-28 21:18: Tightened `Browser-8.8.1 - Simple Reliable Rearrange Baseline` into a more implementation-ready Browser phase by locking the exact visible drag grammar, simple top/middle/bottom band rules, source-row stability rule, Browser-panel target seams, and a sharper reorder/into/invalid/cancel verification matrix
1. 2026-03-28 21:14: Created this standalone future Browser phase doc so the post-`8.7` drag reset now has a dedicated first-step implementation surface for rebuilding Browser rearrange behavior around one simple, reliable insert-line and owner-highlight model before any richer hierarchy preview returns

### Purpose

This phase is the first restart step after shipped `Browser-8.7`.

Use it to:
- rebuild Browser drag into a normal, boring rearrange system first
- keep the pointer/session foundation from `8.7`
- remove the current fake-branch preview complexity before adding details back in

## Doc Body

## [x] Browser-8.8.1 - Simple Reliable Rearrange Baseline

### Summary

Reset the visible Browser drag interaction to a simpler and more trustworthy baseline.

Phase outcome:
- drag uses one calm lifted-row treatment
- `before` / `after` uses one precise insert line
- `into` uses one clear owner highlight
- the source row stays visibly stable while dragging
- no fake duplicate branch preview is shown
- no hidden-source-row or temporary rewired-tree illusion is shown

Shipped result:
- real Browser rows stay mounted during drag instead of collapsing into a fake placeholder branch
- `before` / `after` targeting now reads through one exact insert line on the hovered target row
- `into` targeting now reads through one clear owner-shell highlight on the valid container row
- the earlier hidden-source-row and fake local-branch placeholder path is removed from the live rearrange interaction

### Owns

- the first simplified visible drag model after `8.7`
- the removal of the current fake local-tree placeholder approach
- the baseline `before` / `after` / `into` drag grammar
- simple, reliable hit testing and preview display

### Does Not Own

- richer hierarchy-line preview
- junction-dot guidance
- heavier motion polish
- depth-lane interaction
- new legality rules

### Locked Direction

- keep the Browser-level pointer engine from `8.7`
- keep the store-side legality and committed move/reparent truth
- remove:
  - fake local-branch placeholder preview
  - hidden-source-row preview behavior
  - temporary rewired-tree simulation
- first-pass visible drag language should be only:
  - lifted dragged row
  - one insert line for `before` / `after`
  - one owner highlight for `into`
- the visible grammar should be exact:
  - `before` = one horizontal insert line above the target row
  - `after` = one horizontal insert line below the target row
  - `into` = one clear owner-shell highlight on the valid container row
- Browser should show only one active drop explanation at a time:
  - either insert line
  - or owner highlight
  - never both together for one active target
- keep hit testing simple:
  - top band = `before`
  - middle band = `into`
  - bottom band = `after`
- if the current band is illegal for the hovered row, Browser should resolve to:
  - the nearest legal intent for that row when one exists
  - otherwise explicit invalid-target feedback
- source-row rule:
  - the dragged row stays mounted and visually stable during drag
  - Browser must not hide it, collapse it, or replace it with a fake branch placeholder
- do not let motion/animation own drag correctness in this phase
- keep committed mutation only on pointer release when the resolved target is valid
- all other lifecycle paths must clear the drag session without mutation

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
  - owns pointer session, activation threshold, and release/cancel cleanup
- `browserContentDrag.ts`
  - owns simple band resolution and drop-intent derivation
- `browserTreeSections.tsx`
  - renders only the simpler insert-line / owner-highlight preview model
- `browserTreeRowPresenter.tsx`
  - keeps dragged-row display calm and stable
- `browser.css`
  - styles the simpler preview model without fake tree rewrite treatment

### Checklist

- keep the pointer-driven session engine
- remove fake local-tree placeholder rendering
- keep the source row visible and stable
- render one insert line for `before` / `after`
- render one owner highlight for `into`
- keep invalid-target feedback explicit
- keep commit only on pointer release
- keep cancel cleanup reliable on:
  - pointer cancel
  - `Escape`
  - blur
  - visibility loss
- keep dragged-row selection handoff from `8.7`
- keep Browser/Console selection sync unchanged

### Test Plan

- click still selects without starting drag
- drag activates only after threshold
- same-parent reorder shows one insert line and commits exactly where shown
- valid `into` target shows one owner highlight and commits exactly where shown
- invalid target does not commit and clears cleanly on cancel/release
- source row stays visibly stable while dragging
- drag cleanup clears all preview state on cancel
- `Escape`, blur, and visibility loss clear preview state without mutation
- dragged owner stays selected during drag and after successful drop
- existing Browser create/rename/delete behavior remains unchanged

### Assumptions

- `8.8.1` intentionally favors reliability over visual richness
- richer hierarchy/tree guidance can return later only if the simpler model feels solid
