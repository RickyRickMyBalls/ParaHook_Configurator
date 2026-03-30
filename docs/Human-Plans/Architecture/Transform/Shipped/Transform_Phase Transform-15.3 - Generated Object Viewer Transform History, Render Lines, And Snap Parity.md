# Transform Phase Transform-15.3 - Generated Object Viewer Transform History, Render Lines, And Snap Parity

## Doc Header

### Doc History
3. 2026-03-29 11:38: Shipped this phase after generated objects gained the same active `Viewer Transform` history-overlay/render-line path and shared gizmo-snap viewer contract verification as references, while the remaining object Console-root difference stayed a narrow compatibility adapter for later cleanup
2. 2026-03-29 11:18: Tightened this phase into an implementation-ready post-`15.2` parity pass by grounding it in the surviving split history maps, the reference-first viewport history/render-line overlay path, and the remaining Console transform-root adapter seams that still keep generated objects from feeling fully equal on history, render-line, and snap features
1. 2026-03-29 10:39: Created this standalone future phase after `Transform 15.2` so generated objects can gain practical `Viewer Transform` parity for transform history, viewport history/render-line visuals, and snap behavior without reopening the shared-session cleanup itself

### Purpose

This phase brings generated objects up to the same practical `Viewer Transform` feature level the user already relies on for references.

Use it to answer:
- how generated objects should participate in `Viewer Transform History`
- whether generated objects should gain the same viewport history/render-line visuals
- how much snap parity should be treated as part of the shared transform feature surface
- which differences should stay only because of true capability limits

## Doc Body

## [x] Transform 15.3 - Generated Object Viewer Transform History, Render Lines, And Snap Parity

### Summary

`Transform 15.3` starts after:
- `Transform 15.2`
  - reference and generated-object transform session plumbing has converged behind one shared `Viewer Transform` session model

This phase shipped as the first post-`15.2` parity cut.

It landed the practical feature-parity work the user cared about most for generated objects:
- `Viewer Transform History`
- viewport history/render-line visuals
- snap behavior and snap UI parity

### Owns

- generated-object parity in the shared `Viewer Transform History` surface
- generated-object parity for viewport transform-history/render-line visuals where those visuals depend on shared history truth
- generated-object parity for snap behavior and snap UI where the feature is part of the shared transform contract
- cleanup of any remaining generated-object reduced-feature-tier behavior for those shared transform features

### Does Not Own

- another transform-session model rewrite
- durable generated-object graph or Replicad truth
- multi-select transform
- reference-only timeline capability widening if generated objects still do not honestly support it
- reference-only camera lock widening if generated objects still do not honestly support it

### Locked Outcome

- generated objects should participate in the same practical `Viewer Transform History` experience
- generated objects should gain the same viewport history/render-line visuals where those visuals depend on shared transform history, not on reference-only runtime identity
- generated objects should gain the same snap behavior and snap UI where snap is already part of the shared `Viewer Transform` feature surface
- after this phase, generated-object `Viewer Transform` should no longer feel like a reduced version of the reference path for those core features

### Shipped Result

After shipped `15.2`, the public session contract was already shared. This phase closed the most visible remaining parity gap:
- `ViewerHost.tsx`
  - now builds the active history overlay from the shared active target/session/history selectors instead of only from `activeReferenceTransformSession`
- `viewerBridge.ts`
  - now exposes one target-aware `ViewerTransformHistoryOverlayVm` contract for committed history visuals
- `Viewer.ts`
  - now reads that target-aware history overlay contract against either the active reference object or the active content-object pivot
- `ReferenceTransformHistoryHelper.ts`
  - now accepts the shared target-aware history overlay VM without needing a second object-only visual helper
- `ViewerHost.test.tsx`
  - now proves committed move/rotate/scale history overlay parity for generated objects
  - now proves generated-object snap values still reach the shared viewer gizmo contract

### History Parity Direction

- generated objects should use the same `Viewer Transform History` surface pattern the reference path uses
- object history should not feel quieter, thinner, or second-class just because object truth remains viewer-only underneath
- history grouping, scrub behavior, and active-session visibility should stay aligned with the shared transform shell
- keep any wording honest about viewer-only object truth where necessary, but do not reduce the feature surface because of that truth distinction alone
- this shipped without deleting the lower split storage maps
- this shipped by making the public history-overlay path target-aware above those lower maps

### Viewport Render-Line Direction

- generated objects should gain the same viewport transform-history/render-line treatment the reference path already uses where the visuals depend only on:
  - shared transform history
  - shared scrub state
  - shared active draft/commit state
- do not leave generated objects without those visuals merely because the earlier implementation work was reference-first
- if a visual depends on truly reference-only runtime identity, keep that difference honest and leave it for the later capability audit
- this shipped by widening the existing `ViewerHost`/viewer overlay path instead of building a second object-only overlay system

### Snap Parity Direction

- generated objects should gain the same practical snap behavior and snap UI the reference path already has
- if snap is part of the shared `Viewer Transform` feature surface, generated objects should not remain on a reduced snap tier because of leftover adapter drift
- mode-level snap affordances, per-axis snap affordances, preview behavior, and viewer execution should stay aligned wherever they already depend on shared transform state instead of reference-only runtime identity
- this phase treated move/rotate/scale snap parity as part of the same feature contract
- explicit reference-only exceptions such as timeline-driven `rotate-snap` behavior can stay out of scope if they still honestly depend on reference-only capability

### Implementation Direction

- treat this as a shared-feature parity pass, not another UI fork
- keep one shared `Viewer Transform` toolbar and one shared session model
- use the shared session and target-capability seam from `15.2` to drive:
  - history reads and writes
  - render-line/history-overlay behavior
  - snap behavior and snap UI
- this shipped the history/render-line parity widening and verified shared snap delivery for generated objects
- it did not reopen the `15.2` session-shape debate

### First-Pass Implementation Lock

- keep one toolbar and one active session model
- keep the split lower history maps only if they no longer create visible feature drift
- keep `contentObjectTransformRoot` as a narrow compatibility adapter for later cleanup instead of reopening the Console-root split in the same pass
- prefer widening the existing reference-first overlay/snap helpers before inventing object-only clones
- leave true reference-only extras such as timeline-specific `rotate-snap` behavior to `15.4` if they still need a capability decision after the shared parity work

### Concrete Implementation Targets

Primary parity targets:
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/referenceTransformConsole.ts`
- `src/app/console/stagedNavigation.ts`

Supporting runtime targets if needed:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/ReferenceTransformMoveSnapHelper.ts`
- `src/viewer/ReferenceTransformRotateSnapHelper.ts`

### Tests

- generated objects render into the same practical `Viewer Transform History` surface as references
- generated-object history scrub behavior matches the shared shell expectations
- generated objects render the same viewport transform-history/render-line visuals where those visuals depend on shared history truth
- generated-object snap behavior matches the shared snap contract for move, rotate, and scale where the feature is not truly reference-only
- generated-object snap UI matches the shared toolbar sections and interaction model
- Console transform entry for generated objects reaches the same practical history/snap affordances even if the root scope id remains adapter-backed underneath
- move snap visuals and rotate snap preview behavior stay aligned for generated objects wherever the underlying viewer helpers are target-agnostic
- reference transform behavior remains unchanged
- any feature that still remains reference-only after this phase is reference-only for an explicit capability reason, not because the object path never received the feature work

### Assumptions

- the user's main parity goal is not every possible reference-only extra
- the user mainly wants generated objects to inherit:
  - `Viewer Transform History`
  - viewport transform-history/render-line visuals
  - snap behavior and snap UI
- `15.2` has already removed the duplicated backend/session fork so this phase can focus on feature parity directly
