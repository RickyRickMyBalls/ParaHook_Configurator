# Browser Phase Browser-14 - Phase 9 - High-Part Explode Performance Optimization

## Doc Header

### Doc History
1. 2026-04-16 07:34:41: Created this standalone Browser-14 follow-on so the new high-part explode optimization lane has its own planning home after the shipped Phase 8 live-runtime handoff proved the correct user-facing direction but still left very wide explodes as a meaningful performance hotspot

### Purpose

This phase optimizes `Explode` for large part-count reference objects.

Use it to:
- keep Browser-14's real exploded-child ownership model intact for wide explodes
- reduce the up-front fan-out pause when one loaded wrapper becomes many child objects at once
- improve large-explode responsiveness without widening into a general reference-runtime or import-cache redesign

## Doc Body

## [ ] Browser-14 - Phase 9 - High-Part Explode Performance Optimization

### Summary

`Browser-14 / Phase 8` fixed the worst UX cliff:
- exploding a loaded wrapper no longer drops every new child into the old hidden-unloaded state
- the viewer now hands live loaded runtime into the exploded children when that wrapper is already on screen

That solved the "now I have to load everything back in" problem.

The remaining issue is scale:
- a wide explode such as `50+` parts is still a real fan-out
- Browser still creates many independent child objects
- the viewer still has to prepare many child runtimes in one burst
- so the action can still feel heavy even though it is now truthful and immediately visible

This phase exists to optimize that wide explode path without backing away from the real result.

### Owns

- high-part explode responsiveness for already-loaded wrappers
- reducing the one-burst fan-out cost of live exploded-child handoff
- keeping the first visible post-explode state responsive for large child counts
- focused proof around one deliberately wide explode scenario

### Does Not Own

- changing what `Explode` means
- reverting to Browser-only fake child rows
- broad import/runtime cache redesign
- non-explode reference loading performance in general
- multi-select explode or new command surfaces

### Locked Direction

- keep the result real:
  - one wrapper still becomes many independent exploded child objects
- optimize the burst, not the ownership:
  - do not solve this by collapsing the child set back into a fake aggregate
- keep the first pass narrow:
  - target the immediate high-count explode path only
  - avoid turning this phase into a broad loader-architecture rewrite
- preserve the truthful fallback:
  - later restore or reload should still use the existing isolated child-load path when live handoff is unavailable

### Current Seam Read

- `src/app/components/ViewerHost.tsx`
  - already detects the wrapper-to-children explode swap
  - already calls the Phase-8 live handoff seam before the wrapper is removed from the viewer
  - is the first place where a large explode can be chunked, staged, or otherwise made less burst-heavy
- `src/app/viewerBridge.ts`
  - already exposes the narrow viewer-owned handoff seam
  - is the right contract boundary if the optimization needs one more explicit knob such as staged handoff or batched child windows
- `src/viewer/Viewer.ts`
  - already clones the live wrapper runtime and isolates one truthful source mesh per exploded child during handoff
  - is the strongest candidate if large explodes need cheaper clone/isolation behavior or staged processing
- `src/viewer/Viewer.test.ts`
  - already proves truthful isolated exploded loads and the new live handoff path
  - should grow one focused high-part explode proof rather than many near-duplicate micro-tests
- `src/app/components/ViewerHost.test.tsx`
  - already proves that a loaded wrapper can hand off into loaded visible exploded children
  - is the likely proof surface for "large explode stays responsive enough and avoids the old unload cliff"

### Ready-To-Start Checklist

- measure the current wide explode path so the next pass improves a known hotspot instead of guessing
- identify whether the main cost is:
  - per-child clone work
  - per-child isolation work
  - Browser/store state fan-out
  - or one synchronous burst across all three
- choose one narrow optimization strategy for the first pass:
  - staged handoff
  - chunked viewer work
  - lighter clone/isolation for the live path
  - or another equally narrow approach grounded in the measured hotspot
- preserve the current truthful exploded-child fallback path for later reload and restore

### Acceptance Read

- exploding a high-part wrapper still produces real independent exploded child objects
- the initial explode interaction for wide part counts feels more responsive than the current all-at-once fan-out
- the children still appear as truthful live exploded results instead of reverting to hidden placeholders
- later reload and restore continue to use the existing isolated exploded-child load path

### Concrete Implementation Targets

Primary expected targets:
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Supporting targets if needed:
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Tests

- exploding a wrapper with many truthful parts still yields one child object per part
- the optimized path does not regress immediate visible post-explode continuity
- the high-part path avoids the old "all children start off/unloaded" behavior
- the truthful isolated child-load fallback still works when the live handoff path is unavailable

### Assumptions

- the current remaining pain is performance cost, not correctness of the explode result
- very wide explodes are worth a dedicated optimization pass because they amplify the real object-count fan-out more than ordinary explodes do
- the safest first optimization is likely staged or narrowed work inside the already-shipped ViewerHost plus viewer handoff seam rather than another store-owned explode mutation
