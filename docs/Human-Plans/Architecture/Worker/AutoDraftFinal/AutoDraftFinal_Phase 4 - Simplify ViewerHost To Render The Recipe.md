# AutoDraftFinal Phase 4 - Simplify ViewerHost To Render The Recipe

## Doc Header

### Doc History
2. 2026-04-13 22:43: Completed `Phase 4 - Simplify ViewerHost To Render The Recipe` by collapsing the remaining host adaptation work into small presentational helpers, removing the leftover exported branch-local assembly helper, routing the host through a single `buildViewerViewportRenderLayers(...)` adapter for selector-owned recipe rendering, keeping the small committed-baseline bridge and interaction preview fallback intact without reintroducing product meaning, and keeping both targeted host plus selector vitest suites green
1. 2026-04-13 22:39: Prepped `Phase 4 - Simplify ViewerHost To Render The Recipe` for implementation by grounding the phase in the post-Phase-3 live seam: `ViewerHost.tsx` no longer owns recipe meaning or committed-baseline source selection, but it still owns interaction-time preview fallback acquisition, the small committed-baseline bridge lifecycle, presentation-style resolution, and the final recipe-to-viewer layer adaptation, so the next slice now has one explicit plan for shrinking the host into a thinner render adapter

### Purpose

This phase reduces `ViewerHost.tsx` from a coordination-heavy seam into a thinner render adapter.

It exists so the host mostly consumes selector-owned recipe truth and forwards it to the viewer, instead of continuing to carry leftover layer and interaction assembly responsibilities.

### Owns

- simplifying the remaining `ViewerHost.tsx` viewport-result path
- reducing leftover helper and bridge residue that no longer owns product meaning
- keeping the host focused on:
  - reading selector-owned state
  - resolving presentation styles
  - forwarding the final render-layer payload to `Viewer`

### Does Not Own

- changing the frozen Phase 1 matrix
- redesigning the Phase 2 `layerRecipe` contract
- changing committed-baseline source ownership from Phase 3
- full nine-state proof hardening, which belongs to Phase 5
- viewer-engine rendering redesign unrelated to viewport recipe consumption

## Doc Body

### Goal

- make `ViewerHost.tsx` a smaller, clearer render adapter now that recipe ownership and committed-baseline ownership are already upstream

### Expected File Targets

- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 4 - Simplify ViewerHost To Render The Recipe.md`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/viewer/Viewer.ts`

### Current Live Read For This Phase

- `src/app/components/ViewerHost.tsx`
  - no longer decides viewport recipe meaning
  - no longer owns committed-baseline source truth
  - but it still owns several pieces of adaptation and bridge logic:
    - interaction-time accepted-preview runtime fallback acquisition
    - `allAccepted` versus `rebuiltOnly` preview VM derivation
    - `committedInteractionBaselineRef` lifecycle
    - mapping `layerRecipe` presentation ids to concrete viewer styles
    - dimming baseline style locally in the host
    - final assembly of `ViewerViewportRenderLayers`
  - this is much smaller than the old seam, but still larger than a pure render adapter
- `src/app/components/ViewerHost.tsx`
  - still exports `buildBranchLocalRetainedBaselineLayers(...)`
  - that helper reflects older host-owned branch-local assembly behavior
  - Phase 4 should decide whether it:
    - stays only as a tiny presentational helper
    - moves closer to viewer-only adaptation
    - or is removed if no longer needed
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now owns:
    - mode meaning
    - overlay truth
    - branch-local recipe shape
    - committed-baseline inputs
  - Phase 4 should avoid moving any of that meaning back into the host
- `src/viewer/Viewer.ts`
  - still expects a `ViewerViewportRenderLayers` payload
  - the host should end this phase mostly as the seam that converts selector recipe plus presentation settings into that payload

### Simplification Target

The host should end this phase feeling like:

#### 1. selector consumer

- read selector-owned viewport result state
- read presentation settings
- produce the final viewer layer payload without re-deciding product behavior

#### 2. minimal interaction bridge owner

- keep only the smallest bridge required for interaction runtime plumbing
- do not let bridge code reintroduce product semantics

#### 3. thin style adapter

- apply presentation settings to:
  - base
  - baseline
  - overlay
- keep dimming logic and opacity handling local only if they remain purely presentational

### First Proof Graph

- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- one branch rebuilds while the sibling is retained
- expected result for this phase:
  - `ViewerHost.tsx` still renders the same branch-local and settled recipes
  - but the host path is visibly smaller and no longer carries unnecessary branch-local helper residue or extra adaptation fan-out

### First Proof Set

- one host proof for:
  - settled base-only read-through
  - retained-plus-overlay read-through
  - branch-local retained-baseline read-through
- one proof that the remaining host helper surface is either:
  - purely presentational
  - or removed if no longer required
- no new selector proofs are required unless a tiny helper extraction changes the selector-facing contract

### Implementation Target

- `ViewerHost.tsx`
  - reduce the viewport-result path to:
    - gather selector inputs
    - maintain the minimum interaction bridge
    - map recipe presentation ids to final viewer styles
    - send the finished layer payload to the viewer
- `ViewerHost.test.tsx`
  - stop proving older host-owned assembly helpers as if they were product-meaning owners
  - keep proofs focused on read-through behavior
- `Viewer.ts`
  - only touch if a tiny presentational contract cleanup makes the host materially smaller

### Verification Bar

- `src/app/components/ViewerHost.test.tsx`
  - read-through tests stay green for:
    - base-only
    - retained-plus-overlay
    - branch-local retained-baseline
- targeted vitest runs:
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Landed Result

- `ViewerHost.tsx`
  - now concentrates the remaining viewport-result work into small presentational helpers:
    - interaction accepted preview VM derivation
    - committed interaction baseline snapshot creation
    - selector recipe to `ViewerViewportRenderLayers` adaptation
  - no longer exports or depends on the older host-owned `buildBranchLocalRetainedBaselineLayers(...)` helper
  - keeps the same runtime behavior, but the host path is visibly thinner and more adapter-shaped
- `ViewerHost.test.tsx`
  - no longer proves the older branch-local assembly helper as if it owned product meaning
  - now proves the purely presentational selector-recipe-to-viewer-layer mapping helper instead

### Verification Result

- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass
- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass

### Implementation Order

1. Identify the remaining host responsibilities that are still purely presentational versus accidental residue.
2. Collapse any leftover host helper or branch-local assembly residue that no longer owns product meaning.
3. Keep only the smallest interaction-runtime fallback and committed-baseline bridge needed for the current viewer seam.
4. Re-check that `ViewerHost.tsx` still renders the same selector-owned recipes.
5. Re-run host and selector proofs, then stop before widening into full nine-state proof expansion.

### Important Rule

- this phase is about host reduction, not new behavior
- do not move selector-owned meaning back into `ViewerHost.tsx`
- do not widen into:
  - new mode semantics
  - new baseline ownership rules
  - full proof-matrix work

### Stop Rule

- stop once the remaining viewport-result path in `ViewerHost.tsx` is clearly a thin render adapter over selector-owned recipe truth
- stop before Phase 5 proof hardening and residue cleanup beyond the host seam
