# AutoDraftFinal Phase 3 - Explicit Committed Baseline Ownership

## Doc Header

### Doc History
2. 2026-04-13 22:36: Completed `Phase 3 - Explicit Committed Baseline Ownership` by replacing the old frozen render-history selector inputs with explicit committed-baseline inputs, teaching `ViewerHost.tsx` to snapshot retained committed-source parts instead of `viewportRenderLayers.baseParts`, threading the new committed-baseline contract through `buildViewportResultSelectorOptions.ts`, keeping `selectViewportResultState.ts` on the same Phase 2 recipe surface while consuming committed baseline truth directly, and keeping both targeted selector plus host vitest suites green
1. 2026-04-13 22:28: Prepped `Phase 3 - Explicit Committed Baseline Ownership` for implementation by grounding the phase in the post-Phase-2.1 live seam: `ViewerHost.tsx` still freezes the last idle rendered base and branch-stable accepted preview parts into `frozenInteractionBaseRef`, then threads that compatibility bridge through `buildViewportResultSelectorOptions.ts` into `selectViewportResultState.ts`, so the next slice now has one explicit target for replacing host-history baseline capture with committed-source ownership

### Purpose

This phase makes committed baseline ownership explicit.

It exists so branch-local viewport layering stops depending on host-render history and starts depending on one honest committed-source contract.

### Owns

- the source of truth for:
  - changed-part retained baseline
  - unchanged stable base during interaction
- when the interaction baseline is captured
- when the interaction baseline is invalidated or refreshed
- reducing `frozenInteractionBaseRef` from product logic to a minimal rendering aid if any host cache still remains

### Does Not Own

- changing the frozen Phase 1 mode matrix
- redesigning the selector-owned layer recipe from Phase 2
- broad `ViewerHost.tsx` simplification beyond what is required to remove baseline ownership from the host
- worker invalidation or dependency-map redesign

## Doc Body

### Goal

- replace implicit host-frozen baseline capture with one explicit committed-baseline contract that the selector can trust during branch-local interaction

### Expected File Targets

- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 3 - Explicit Committed Baseline Ownership.md`
- `src/app/components/buildViewportResultSelectorOptions.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Current Live Read For This Phase

- `src/app/components/ViewerHost.tsx`
  - still owns `frozenInteractionBaseRef`
  - when interaction is inactive, it freezes:
    - `viewportRenderLayers.baseParts`
    - `currentAcceptedOutputPreviewRenderVm.viewerParts`
    - a best-effort base presentation state:
      - `retainedBasePresentationStateId`
      - otherwise `lastLoaded` when base parts exist
  - that means the current baseline contract is still:
    - "remember what the host last rendered at idle"
    - not:
      - "remember the committed base source for this interaction"
- `src/app/components/buildViewportResultSelectorOptions.ts`
  - currently acts only as the transport seam for the frozen-base compatibility bridge:
    - `interactionAcceptedOutputPreviewRenderVm`
    - `interactionAcceptedRebuiltPreviewRenderVm`
    - `hasFrozenInteractionBase`
    - `frozenBaseParts`
    - `frozenBranchStableParts`
    - `frozenBasePresentationStateId`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now owns recipe meaning, but branch-local recipe assembly still consumes host-frozen baseline inputs
  - `resolveViewportLayerRecipe(...)` currently activates branch-local layering using:
    - frozen base parts
    - frozen branch-stable parts
    - rebuilt-only overlay parts
    - frozen base presentation state
  - so the selector still cannot distinguish:
    - explicit committed baseline truth
    - last-idle rendered fallback
- `src/app/components/ViewerHost.test.tsx`
  - now proves the narrow compatibility bridge well enough for Phase 2.1
  - but the remaining branch-local happy paths still rely on the host having cached the correct idle scene before interaction starts

### Baseline Contract To Introduce

The new baseline contract should answer these questions directly:

#### 1. committed base source

- what exact committed result lane supplies the interaction baseline:
  - committed authoritative
  - committed draft
  - retained accepted base

#### 2. branch-stable membership

- which parts are explicitly unchanged and should stay at full-strength blue during interaction
- which parts belong to the changed branch and should remain in the retained baseline lane

#### 3. presentation state

- what presentation state the committed baseline should use when reused during interaction
- this should no longer be guessed from:
  - the last rendered recipe
  - the current host layer styles

#### 4. lifecycle

- when the committed interaction baseline is captured
- what change invalidates it
- when it is refreshed after a new committed winner becomes idle truth

### First Proof Graph

- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- one branch rebuilds while the sibling is retained
- expected result for this phase:
  - branch-local interaction can be reconstructed from:
    - committed baseline source
    - explicit unchanged membership
    - rebuilt-only overlay membership
  - not from:
    - "whatever idle render the host last happened to show"

### First Proof Set

- one selector proof for each of these baseline edges:
  - branch-local interaction still works after removing dependence on host-frozen idle render history
  - final/live branch-local baseline uses committed final source explicitly
  - draft/live branch-local baseline uses committed draft source explicitly when draft is the correct committed lane
  - no stale settled draft bridge can be reused as the committed final baseline source
- one host read-through proof that interaction can start with the correct branch-local baseline even if the previous idle render path was not the same visual recipe

### Implementation Target

- `buildViewportResultSelectorOptions.ts`
  - forwards explicit committed-baseline inputs instead of a host-owned frozen recipe snapshot
- `selectViewportResultState.ts`
  - consumes explicit baseline source truth and produces the same recipe shapes without needing host history to infer baseline meaning
- `ViewerHost.tsx`
  - stops owning committed-baseline meaning
  - may still keep a tiny rendering aid cache if the viewer needs one, but that cache must no longer determine which committed source is correct

### Verification Bar

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - covers:
    - branch-local baseline from committed final source
    - branch-local baseline from committed draft source
    - stale idle render does not corrupt committed baseline choice
- `src/app/components/ViewerHost.test.tsx`
  - proves the host can start interaction with the right branch-local baseline after the committed-baseline ownership move
- targeted vitest runs:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx`

### Landed Result

- `buildViewportResultSelectorOptions.ts`
  - now forwards explicit committed-baseline inputs:
    - committed interaction base parts
    - committed interaction branch-stable parts
    - committed interaction base presentation state
  - no longer forwards the old frozen render-history names into the selector
- `selectViewportResultState.ts`
  - still returns the same Phase 2 `layerRecipe`
  - but branch-local assembly now consumes committed baseline inputs directly instead of `hasFrozenInteractionBase` plus frozen render-history fields
- `ViewerHost.tsx`
  - still keeps a tiny interaction snapshot bridge
  - but that bridge now snapshots:
    - `retainedBaseRenderVm.viewerParts`
    - accepted preview branch-stable parts
    - retained-base presentation state
  - it no longer snapshots `viewportRenderLayers.baseParts` as if the last rendered scene were the committed baseline source
- tests
  - existing branch-local selector proofs now run through the committed-baseline input names
  - the live branch-local host proof now seeds an idle committed final preview bundle before drag, matching the explicit committed-baseline contract instead of relying on rebuilt-only overlay membership alone

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Implementation Order

1. Identify the minimum explicit committed-baseline inputs the selector needs, without redesigning the Phase 2 recipe shape.
2. Add failing selector tests that prove committed baseline source is no longer equivalent to last idle rendered layers.
3. Thread the explicit baseline inputs through `buildViewportResultSelectorOptions.ts`.
4. Update `selectViewportResultState.ts` so branch-local recipe assembly uses explicit committed baseline truth.
5. Reduce `ViewerHost.tsx` so `frozenInteractionBaseRef` no longer owns baseline source meaning.
6. Re-run selector and host proofs, then stop before widening into broader `ViewerHost` simplification.

### Important Rule

- this phase is about baseline-source ownership, not recipe redesign
- keep the Phase 2 `layerRecipe` surface stable unless a tiny supporting field is truly required
- do not widen into:
  - new mode semantics
  - viewer rendering redesign
  - worker scheduling or invalidation work

### Stop Rule

- stop once the selector can build branch-local recipes from explicit committed-baseline truth instead of host-history capture
- stop before the broader `ViewerHost.tsx` cleanup that belongs to Phase 4
