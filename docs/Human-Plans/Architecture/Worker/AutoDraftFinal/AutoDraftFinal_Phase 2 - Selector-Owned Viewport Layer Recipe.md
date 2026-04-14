# AutoDraftFinal Phase 2 - Selector-Owned Viewport Layer Recipe

## Doc Header

### Doc History
3. 2026-04-13 22:24: Closed the narrow `Phase 2.1` follow-up by tightening branch-local eligibility to require selector-visible overlay truth, letting branch-local recipes carry `previewMesh` or `previewBrep` styling directly, making `layerRecipe.kind` fall back to `base-only` when no overlay exists, aligning the stale branch-local draft proof to the new selector contract, and hardening the frozen-base compatibility bridge so branch-local final/live can still dim the committed baseline blue without widening into Phase 3 baseline redesign
2. 2026-04-13 22:09: Completed the initial `Phase 2 - Selector-Owned Viewport Layer Recipe` landing by adding a selector-owned `layerRecipe` contract to `selectViewportResultState.ts`, threading the interaction-time preview and frozen-base compatibility inputs through `buildViewportResultSelectorOptions.ts`, reducing `ViewerHost.tsx` to recipe consumption instead of a mode ladder, and adding explicit selector recipe proofs for branch-local live interaction, settled auto/live, draft/on-release, and final/live overlay cases with both targeted vitest suites passing
1. 2026-04-13 22:00: Prepped `Phase 2 - Selector-Owned Viewport Layer Recipe` for implementation by grounding the phase in the now-frozen Phase 1 matrix, the current `selectViewportResultState.ts` state surface, and the remaining `ViewerHost.tsx` layer-assembly ladder so the next slice can move `base` / `baseline` / `overlay` ownership into the selector without widening into baseline-source cleanup yet

### Purpose

This phase makes the selector own the actual viewport layer recipe.

It exists so `ViewerHost.tsx` stops deciding which product story wins after the selector has already decided visible-result truth.

### Owns

- the selector-owned recipe for:
  - `base`
  - `baseline`
  - `overlay`
- recipe-level presentation state selection for each visible layer
- recipe-level changed-versus-unchanged membership using the currently available preview and retained truth
- removing mode-meaning decisions from the `ViewerHost.tsx` layer ladder when the selector can answer them directly

### Does Not Own

- explicit committed-baseline ownership cleanup
- redesign of `frozenInteractionBaseRef`
- broad `ViewerHost.tsx` simplification beyond what is required to consume the new recipe
- worker invalidation or recomposition changes

## Doc Body

### Goal

- move viewport layer ownership from host fallback branches into one selector-owned recipe contract

### Expected File Targets

- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 2 - Selector-Owned Viewport Layer Recipe.md`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Current Live Read For This Phase

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now owns the frozen Phase 1 matrix:
    - visible result class
    - visible source kind
    - `lastLoaded`, `previewMesh`, and `previewBrep` presentation states
    - retained base and overlay candidates
  - still stops short of saying:
    - which parts go into `base`
    - which parts go into `baseline`
    - which parts go into `overlay`
  - it exposes enough raw material to do that:
    - `renderVm`
    - `retainedBaseRenderVm`
    - `overlayRenderVm`
    - `visiblePresentationStateId`
    - `retainedBasePresentationStateId`
    - `overlayPresentationStateId`
- `src/app/components/ViewerHost.tsx`
  - currently still decides the visible layer recipe in `viewportRenderLayers`
  - still contains the branch ladder that picks between:
    - branch-local retained-baseline layers
    - retained final plus overlay
    - retained final only
    - retained draft plus overlay
    - retained draft only
    - visible base only
  - this is the main remaining seam from `Phase 0`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - already owns honest `allAccepted` versus `rebuiltOnly` preview membership
  - should stay the membership seam, not be reimplemented inside `ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
  - already proves:
    - branch-local helper split
    - retained final plus preview-ready overlay
    - settled draft read-through
  - should become the downstream read-through proof surface once the selector hands the host a more complete recipe

### Recipe Contract To Introduce

The selector-owned recipe should answer these questions directly:

#### 1. `base`

- which parts are the stable visible base for this state
- which presentation state styles that base

#### 2. `baseline`

- whether a separate retained changed-part baseline exists
- which parts belong to that baseline
- which presentation state styles that baseline

#### 3. `overlay`

- whether a preview overlay exists
- which parts belong to that overlay
- which presentation state styles that overlay
- what opacity class it uses:
  - draft-style overlay
  - live `previewBrep` overlay when allowed

#### 4. recipe kind

- whether the current state is:
  - base-only
  - retained-plus-overlay
  - branch-local retained-baseline

This does not need to be a user-facing enum, but the host must no longer infer it by replaying mode logic.

### First Proof Graph

- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- one branch rebuilds while the sibling is retained
- expected result for this phase:
  - selector-owned recipe names:
    - unchanged sibling in `base`
    - changed old shape in `baseline`
    - changed rebuilt preview in `overlay`
  - `ViewerHost.tsx` consumes that recipe directly instead of reconstructing it from mixed selector and runtime fields

### First Proof Set

- one selector proof for each of these recipe edges:
  - branch-local two-extrude live interaction returns a three-layer recipe
  - settled `Auto / Live` accepted draft returns a base-only `lastLoaded` recipe
  - `Final / Live` preview-ready authoritative state returns the correct final/live overlay recipe without host reinterpretation
  - `Draft / On Release` settled draft returns a base-only draft `lastLoaded` recipe
- one host read-through proof that `ViewerHost.tsx` can render the selector-owned recipe without re-deciding mode meaning

### Implementation Target

- `selectViewportResultState.ts` returns a richer, recipe-level viewport contract
- `ViewerHost.tsx` becomes a thinner recipe consumer
- the mode matrix remains selector-owned instead of being replayed through host branches

### Verification Bar

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - recipe-level tests cover:
    - branch-local three-layer case
    - settled base-only cases
    - final live overlay case
- `src/app/components/ViewerHost.test.tsx`
  - read-through tests prove the host can render the new recipe without changing product meaning
- targeted vitest runs:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx`

### Landed Result

- `selectViewportResultState.ts`
  - now returns a selector-owned `layerRecipe` with:
    - recipe kind
    - base parts and presentation state
    - baseline parts and presentation state
    - overlay parts and presentation state
    - overlay opacity class
  - now uses the existing retained, overlay, and preview truth plus one small compatibility bridge:
    - interaction-time accepted preview membership
    - frozen base parts and presentation state
- `buildViewportResultSelectorOptions.ts`
  - now forwards the compatibility inputs the selector needs so recipe meaning can move out of `ViewerHost.tsx`
- `ViewerHost.tsx`
  - no longer replays the old mode ladder to decide:
    - branch-local retained baseline
    - retained-plus-overlay
    - base-only fallback
  - now consumes `viewportResultState.layerRecipe` and only resolves final viewer styles from the recipe
- `selectViewportResultState.test.ts`
  - now contains explicit recipe assertions for:
    - settled `Auto / Live`
    - settled `Draft / On Release`
    - branch-local two-extrude `Auto / Live`
    - `Final / Live` preview-ready overlay
- `ViewerHost.test.tsx`
  - existing read-through proofs stayed green after the host lost recipe ownership

### Phase 2.1 Follow-Up Result

- `selectViewportResultState.ts`
  - branch-local layering now requires selector-visible overlay truth instead of letting raw rebuilt-only membership invent a second product story
  - branch-local recipes now reuse the same overlay styling contract as the rest of the selector:
    - `previewMesh` at `0.5`
    - `previewBrep` at `0.75`
  - retained draft and retained final states now return `base-only` whenever no real overlay exists, so `layerRecipe.kind` matches the actual rendered shape
- `ViewerHost.tsx`
  - still remains a recipe consumer
  - keeps the frozen-base bridge, but now remembers idle accepted geometry as `lastLoaded` when needed so branch-local final/live can dim the committed baseline blue during interaction
- tests
  - now prove:
    - branch-local draft layering only activates when selector-visible overlay truth exists
    - branch-local authoritative preview-ready overlay can render as green `previewBrep`
    - settled no-overlay retained states report `base-only`
    - final/live host read-through does not leak yellow draft branch-local overlay

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Implementation Order

1. Add the recipe shape to `selectViewportResultState.ts` without changing the frozen Phase 1 meaning.
2. Add failing selector tests for the first branch-local and settled recipe cases.
3. Move the smallest honest slice of `viewportRenderLayers` decision-making into selector-owned recipe assembly.
4. Narrow `ViewerHost.tsx` so it consumes the recipe first and only falls back where the new recipe does not yet cover a state.
5. Re-run selector and host proofs, then stop before widening into committed-baseline ownership cleanup.

### Important Rule

- this phase is about recipe ownership, not baseline-source ownership
- use the truth already exposed by:
  - `retainedBaseRenderVm`
  - `overlayRenderVm`
  - rebuilt-only preview membership
- do not widen into `frozenInteractionBaseRef` redesign yet unless the recipe contract cannot be expressed without one tiny compatibility bridge

### Stop Rule

- stop once the selector is the owner of `base` / `baseline` / `overlay` recipe meaning
- stop before redesigning how the committed baseline is captured over time
