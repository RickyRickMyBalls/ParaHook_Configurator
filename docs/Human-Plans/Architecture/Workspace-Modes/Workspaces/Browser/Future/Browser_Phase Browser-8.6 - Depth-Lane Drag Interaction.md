# Browser Phase Browser-8.6 - Depth-Lane Drag Interaction

## Doc Header

### Doc History
2. 2026-03-28 20:10: Tightened `Browser-8.6 - Depth-Lane Drag Interaction` into a more implementation-ready Browser phase by locking the lane-derivation model, the visual guidance contract, the default-lane and hysteresis behavior, the primary Browser drag seams, and a sharper manual/automated verification matrix on top of shipped `8.5`
1. 2026-03-28 20:08: Created this standalone future Browser phase doc so the post-`8.5` nested drag interaction upgrade now has its own dedicated planning surface, keeping the richer vertical-slot plus horizontal-depth lane behavior separate from the earlier drag-session architecture stabilization

### Purpose

This phase is the interaction-model upgrade that follows shipped `Browser-8.5 - Drag Session Architecture Cleanup`.

Use it to:
- add a richer nested drag interaction without re-opening the drag-session foundation work
- let users choose both the vertical landing slot and the legal ownership depth during one drag
- make nested reparenting read more clearly in assemblies, subassemblies, and components

## Doc Body

## [ ] Browser-8.6 - Depth-Lane Drag Interaction

### Summary

Add a two-axis nested drag model on top of the stabilized Browser drag-session foundation.

Phase outcome:
- vertical movement chooses the provisional slot band
- horizontal movement chooses the legal ownership depth for that band
- the provisional preview updates live as both slot and owner depth change

### Owns

- the nested drag interaction model for choosing legal owner depth during drag
- horizontal depth-lane calculation and switching
- visual lane guidance and active-lane emphasis
- live preview retargeting when depth choice changes the owner

### Does Not Own

- the foundational drag-session cleanup already shipped in `8.5`
- new move legality beyond the current Browser hierarchy rules
- auto-expand-on-hover unless later added explicitly

### Locked Direction

- use an explicit two-axis drag model:
  - vertical movement chooses the provisional slot band
  - horizontal movement chooses the legal ownership depth for that band
- farther left maps to broader / higher parents
- farther right maps to deeper / more nested legal owners
- derive horizontal depth lanes only from the legal owners for the current vertical band
- use equal-width lanes in the first pass
- collapsed legal owners still participate when they are valid for the current band
- bias the initial active lane toward the most local/default owner for that vertical band
- when depth choice changes the owner, move the provisional preview immediately to the new correct slot/depth
- add a small amount of horizontal hysteresis to avoid noisy lane flicker

### Locked Implementation Shape

- keep `8.6` layered on top of the shipped `8.5` drag-session coordinator:
  - do not re-collapse drag session, legality, and preview ownership back into one block
- extend the Browser drag preview derivation with a second step:
  - first resolve the current vertical slot band
  - then derive the legal owner-depth set for that band
  - then choose one active depth lane from that legal owner set
- the active depth lane should be derived from:
  - the current horizontal cursor position within the active drag width
  - equal-width lane partitioning
  - a small hysteresis window around lane boundaries
- the preview builder should own:
  - active lane count
  - active lane index
  - active owner depth
  - provisional row depth/indent
  - lane guidance visibility
- the renderer should show explicit lane guidance only when:
  - more than one legal owner depth exists for the current vertical band
- lane guidance should stay lightweight:
  - subtle vertical separators
  - stronger active-lane emphasis
  - provisional row depth that clearly matches the chosen lane
- when horizontal movement changes the chosen legal owner depth:
  - the provisional preview row should jump immediately to the new correct slot/depth
  - Browser should not preserve the previous preview slot if that conflicts with the new owner depth
- collapsed valid owners should still participate in lane choice if they are part of the legal owner set for that band

### Implementation Targets

Primary seams:
- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification seams:
- `src/app/panels/BrowserPanel.test.tsx`

### Checklist

- extend the drag-preview derivation to resolve legal owner-depth lanes from the active vertical band
- add horizontal lane selection with equal-width partitions
- add a small hysteresis buffer so lane switching does not flicker near boundaries
- bias the initial active lane toward the most local/default owner for that band
- render lightweight lane guidance when multiple legal depths exist
- keep collapsed valid owners available as lane choices
- keep the provisional row depth/indent aligned with the chosen lane
- preserve shipped `8.4` legality and shipped `8.5` drag-session structure

### Test Plan

- same vertical band, multiple legal owners:
  - drag through a band where two legal owner depths exist
  - moving left/right should switch the active owner depth predictably
- three-lane case:
  - drag through a band where three legal owner depths exist
  - the active lane should follow the equal-width split cleanly
- default-lane bias:
  - on first entry into a multi-lane band, Browser should choose the most local/default owner depth before the user moves horizontally
- hysteresis:
  - small left/right jitter near a lane boundary should not constantly flip the active owner
- preview jump:
  - when the chosen owner depth changes, the provisional row should jump to the new correct slot/depth immediately
- collapsed valid owner:
  - collapsed owner still participates when legal and still reads distinctly
- regression:
  - shipped `8.5` drag cleanup remains stable
  - shipped `8.4` legality matrix remains unchanged
  - no real tree mutation occurs before drop

### Assumptions

- this phase depends on shipped `8.5`
- equal-width lanes are sufficient for the first pass
- auto-expand-on-hover remains out of scope
- legality is still bounded by the shipped Browser hierarchy rules

### Intended Outcome

- nested reparenting reads clearly without delicate hover precision
- the user can choose:
  - where the row lands vertically
  - which legal parent depth owns it
- the provisional preview remains trustworthy while moving across nested hierarchy

### Follow-On Relationship

This phase depends on shipped `Browser-8.5 - Drag Session Architecture Cleanup`.

Locked sequencing:
- `8.5` made drag steady
- `8.6` makes drag smarter
