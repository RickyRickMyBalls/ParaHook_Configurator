# Browser Phase Browser-8.8.4 - Reintroduce Richer Hierarchy Guidance Carefully

## Doc Header

### Doc History
2. 2026-03-28 15:48: Tightened `Browser-8.8.4 - Reintroduce Richer Hierarchy Guidance Carefully` into a more implementation-ready Browser follow-on by locking a restrained first pass around subtle active-branch line emphasis and an optional small junction marker, while explicitly keeping the simpler insertion-slot plus owner-support cues primary and sharpening the expected Browser seams plus verification matrix
1. 2026-03-28 21:14: Created this standalone future Browser phase doc so the Browser drag restart now has a dedicated fourth-step planning surface for carefully reintroducing richer hierarchy guidance only after the simpler rearrange system feels trustworthy again

### Purpose

This phase follows `Browser-8.8.3`.

Use it to:
- reintroduce richer hierarchy guidance only after the simpler drag system is proven solid
- keep the simpler baseline as the safety rail
- add only the smallest hierarchy details that improve clarity without replacing the simpler slot/owner language

## Doc Body

## [ ] Browser-8.8.4 - Reintroduce Richer Hierarchy Guidance Carefully

### Summary

Layer richer hierarchy guidance back into Browser drag only if it clearly improves clarity over the simpler rearrange baseline.

Phase outcome:
- Browser regains subtle active-branch line guidance
- Browser may regain one small junction marker when it improves precision
- Browser still keeps the simpler slot/owner language as the main explanation
- the simpler baseline remains the fallback if richer guidance feels fragile again

### Owns

- restrained active-branch hierarchy guidance
- optional small junction-marker return
- careful hierarchy emphasis layered under the simpler slot/owner cues

### Does Not Own

- the basic drag baseline itself
- move legality changes
- drag architecture replacement
- fake local-tree preview
- depth-lane interaction
- full attached branch rewrite

### Locked Direction

- richer hierarchy guidance returns only after the simpler system feels solid
- any richer preview must prove it improves clarity rather than adding fragility
- the `8.8.1` baseline must remain readable even if these details are turned back on
- first pass stays restrained:
  - emphasize the active branch/tree guides near the current landing slot
  - optionally render one small junction marker at the current attachment point
  - do not reintroduce a fake local-tree preview or fake duplicate branch
- the simpler drag language remains primary:
  - blue insertion slot still answers `where will this row land`
  - owner support highlight still answers `who will own it`
  - any richer hierarchy cue is tertiary support only
- hierarchy guidance should be local:
  - only the affected branch and nearby guides should react
  - do not re-light the whole tree
- if the added hierarchy cue makes drag feel noisier or more fragile, remove it instead of defending it

### Implementation Targets

Primary seams:
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/theme/surfaces/browser.css`

Supporting verification:
- `src/app/panels/BrowserPanel.test.tsx`

Primary code-shape expectation:
- `browserTreeRowPresenter.tsx`
  - can expose one small extra visual state for active hierarchy support without replacing the existing slot/owner cues
- `browserTreeSections.tsx`
  - keeps hierarchy guidance local to the affected branch/rows and does not reintroduce placeholder-branch rendering
- `browser.css`
  - owns subtle guide emphasis, optional junction marker styling, and the visual balance that keeps hierarchy guidance secondary
- `BrowserPanel.test.tsx`
  - verifies richer hierarchy support only appears alongside the simpler cues, never instead of them

### Checklist

- add subtle active-branch line emphasis
- evaluate one small junction marker
- keep insertion slot primary
- keep owner highlight secondary
- keep the simpler baseline as fallback

### Test Plan

- richer hierarchy guidance never replaces the insertion slot as the primary landing cue
- richer guidance never replaces owner support as the ownership cue
- active branch emphasis stays local to the affected branch and nearby guides
- optional junction marker improves precision without becoming a new target box
- richer guidance never reintroduces duplicate-source or fake-branch confusion
- fallback cleanup remains reliable
- same-parent reorder and cross-parent moves remain readable with the richer guidance enabled

### Assumptions

- `8.8.1` through `8.8.3` are already stable
- this phase is optional detail layering, not a required correctness fix
- the first implementation pass should bias toward subtle line emphasis before anything more ambitious
