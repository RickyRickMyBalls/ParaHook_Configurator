# Browser Phase Browser-8.7 - Pointer-Driven Drag Engine Rebuild

## Doc Header

### Doc History
3. 2026-03-28 20:55: Marked `Browser-8.7 - Pointer-Driven Drag Engine Rebuild` shipped after landing the Browser-level pointer drag session, threshold-based activation, central row-geometry hit testing, selection handoff on drag start, local-branch preview derivation, and the active junction marker while preserving the store-side move/reparent truth
2. 2026-03-28 20:41: Tightened `Browser-8.7 - Pointer-Driven Drag Engine Rebuild` into a more implementation-ready Browser phase by locking the one-phase absorption of the narrower `8.6` depth-choice ideas, the pointer-session threshold and ownership model, the Browser row-geometry registration seam, the local-branch-only live-tree preview contract, and a sharper pointer-first verification matrix
1. 2026-03-28 20:34: Created this standalone future Browser phase doc so the Browser family now has one dedicated planning surface for the larger drag-engine rebuild fallback, preserving the direction to keep Browser content legality/tree truth while later replacing the native HTML drag interaction layer with a pointer-driven engine if the patched native path still feels too glitchy

### Purpose

This phase is the shipped Browser drag-engine rebuild after `Browser-8.5`, and it absorbed the narrower `8.6` depth-lane interaction ideas so the Browser only needed one larger drag rewrite.

Use it to:
- replace the fragile parts of the Browser drag interaction without rewriting Browser content truth
- move the Browser away from native HTML drag lifecycle quirks
- let the live hierarchy tree itself become the main drag guidance system

## Doc Body

## [x] Browser-8.7 - Pointer-Driven Drag Engine Rebuild

### Summary

Replace the Browser's native-drag interaction layer with a pointer-driven drag engine while preserving the structured content legality, hierarchy truth, and committed move/reparent semantics already established in earlier Browser phases.

Phase outcome:
- Browser drag is driven by one pointer-based interaction engine instead of row-native HTML drag events
- the hierarchy tree stays visually live and connected during drag
- provisional branch lines, indent/depth shifts, and one active junction dot explain the current temporary ownership before drop
- vertical movement chooses slot band and horizontal movement chooses legal owner depth inside the same rebuilt engine

Shipped result:
- Browser drag now begins through one pointer-session model with a real movement threshold instead of immediate native drag activation
- drag start promotes the dragged owner into selection immediately
- Browser rows register geometry centrally so drag hit testing comes from shared row metrics rather than row-local native drag events
- provisional drag preview now stays derived from one shared drag frame, including the local-branch drop slot and active junction marker
- Browser pointer cancellation and fallback cleanup now clear stale drag state more reliably than the older row-native lifecycle

### Owns

- the Browser drag interaction-engine replacement
- pointer-driven drag session ownership and cleanup
- Browser-level hit testing from geometry instead of row-native drag lifecycle
- live hierarchy-line drag guidance
- active junction/intersection feedback for the current provisional attachment point
- the smarter nested drag behavior previously sketched as `8.6`

### Does Not Own

- the structured Browser hierarchy legality matrix itself
- store-side committed move/reparent truth
- content-owner data model rewrites
- unrelated Browser CRUD or selection changes
- whole-content-tree preview rewiring in the first pass

### Landed Direction

- preserved the existing Browser content truth where it was already good:
  - structured content owner legality
  - store-side move/reparent truth
  - owner-target descriptors
- absorbed the `8.6` interaction intent into `8.7`:
  - vertical movement chooses the provisional slot band
  - horizontal movement chooses the legal ownership depth for that band
  - equal-width depth lanes are the first-pass lane model
  - the initial active lane biases toward the most local/default owner
  - a small horizontal hysteresis buffer prevents noisy lane flipping
- replaced the fragile interaction layer:
  - row-native drag lifecycle handling
  - native ghost behavior
  - row-local cleanup assumptions
- moved to one Browser-level pointer-driven drag engine that owns:
  - source owner
  - current pointer position
  - hovered slot band
  - chosen owner depth
  - provisional preview layout
  - commit / cancel / cleanup
- kept the hierarchy tree visually live and connected during drag:
  - provisional branch lines redraw in place
  - provisional indent/depth updates with the chosen temporary owner
  - the provisional row reads as attached to the temporary branch
  - one small active junction dot marks the current attachment point
- kept committed tree mutation only on drop
- used a drag-start threshold so pointer down alone does not immediately count as drag

### Implementation Targets

Primary seams:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification seams:
- `src/app/panels/BrowserPanel.test.tsx`

### Public / Internal Interfaces

- replaced row drag handlers in the Browser row presenter with pointer-driven callbacks and drag-state display
- expanded the Browser drag-session helpers to carry:
  - pending-vs-active drag state
  - pointer coordinates
  - active slot band
  - legal owner-depth lanes
  - active lane index
  - active junction point
  - local branch preview payload
- added one Browser-level row-geometry registration seam so the controller can resolve hit testing without row-local drag lifecycle
- kept app-store durable schema unchanged
- kept the Browser move-legality API unchanged

### Verification

- `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx`
- `cmd /c npx tsc --noEmit`
- `cmd /c npm run build`

### Intended Outcome

- Browser drag feels more like rearranging a live hierarchy tree than hitting invisible drop boxes
- tree lines and the current junction explain the move more clearly than floating overlay boxes
- drag cleanup and hit testing are more reliable than the earlier native HTML drag path
