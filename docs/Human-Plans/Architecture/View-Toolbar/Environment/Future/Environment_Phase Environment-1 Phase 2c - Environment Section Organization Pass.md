# Environment Phase Environment-1 Phase 2c - Environment Section Organization Pass

## Doc Header

### Doc History
5. 2026-04-17 11:25:15: Implemented `Environment-1 / Phase 2c / Phase 1 - Para Migration For View-Level Environment Controls` by replacing the broad `View` section's native `Shadows`, `Tone Mapping`, and paired `Exposure` controls with `ParaSelect` and `ParaSlider`, adding focused `ViewToolbar` proof, and advancing the next internal `Phase 2c` cut to `Phase 2`
4. 2026-04-17 11:21:08: Prepped `Environment-1 / Phase 2c / Phase 1 - Para Migration For View-Level Environment Controls` for implementation by grounding the first cut in the live native `View` controls, the shipped `ParaSelect` and `ParaSlider` seams, the existing `setViewKey` shared-state path, and the current focused toolbar proof surface while keeping tab persistence and dedicated `Shadows` section work deferred to later internal phases
3. 2026-04-17 10:11:10: Reorganized this standalone `Environment-1 / Phase 2c` doc so its main `##` sections now read in the explicit order `Doc Header`, `Doc Body`, `Wishlist Tracking`, then the individual implementation phases, keeping the same `2c` scope while making the planning surface easier to scan
2. 2026-04-17 10:00:23: Expanded this standalone `Environment-1 / Phase 2c` plan into a real wishlist-tracking surface by turning the remaining para-style migration targets in `ViewToolbar.tsx` into explicit checklist items, then organizing them into a small internal phase ladder so Codex can land the environment-surface cleanup one focused control group at a time
1. 2026-04-17 09:47:20: Created this standalone future plan doc for `Environment-1 / Phase 2c`, pulling the environment-section cleanup pass out of the larger `Environment-1` ladder and tightening it around visible View Toolbar organization, including the likely introduction of a dedicated `Shadows` section so shadow controls can stop being split awkwardly across `View` and `Environment`

### Purpose

This doc locks the standalone implementation home for `Environment-1 / Phase 2c`.

Use it to answer:
- how the current `Environment` controls should be reorganized in the `View` toolbar before preset-truth or HDRI/runtime widening
- whether shadow controls should become their own visible `Shadows` section
- how the already-shipped `Ground` section should stay separate from the environment cleanup
- which toolbar-only state or persistence seams are allowed to move as part of this pass

### Why This Phase Exists

The environment lane now has:
- a shipped baseline lighting repair
- a shipped lighting cleanup pass
- a shipped dedicated `Ground` section

What it still does not have is one clearly organized visible toolbar surface.

Right now:
- `Environment` is mostly a thin preset row plus raw light management
- the global `Shadows` toggle still lives up in the broad `View` section
- per-light shadow controls still live inside the selected-light editor
- `Ground` already has its own explicit section

That makes the toolbar harder to scan than it needs to be.

This phase exists to clean up the visible organization before later preset-truth, Browser-light, and HDRI/runtime work widen the lane further.

### Scope

This phase covers:
- visible organization of the `Environment`-owned portion of the `View` toolbar
- section grouping, ordering, wording, and top-level section boundaries
- whether shadow controls become one dedicated `Shadows` section
- the toolbar-local tabs/classic ordering needed to support the organization cleanly
- toolbar-local persistence updates only if a new section key is introduced

This phase does not cover:
- new environment runtime behavior
- lighting retuning
- new shared environment or viewer state
- new preset truth
- HDRI or environment-light runtime
- changes to the already-shipped `Ground` runtime contract

## Doc Body

### Header

Purpose:
- reorganize the current environment-facing toolbar surface so it reads like an intentional set of sections before later environment features arrive

Owns:
- visible grouping and ordering for `Environment`
- the decision to split shadow controls into a dedicated `Shadows` section
- clearer separation between:
  - environment preset-facing controls
  - raw light management
  - shadow management
  - ground controls that already live elsewhere
- toolbar-local tab and classic-stack organization updates required by that visible cleanup

Keeps elsewhere:
- shared environment state shape
- viewer runtime behavior
- light-rig defaults
- ground-plane behavior
- preset-truth expansion
- HDRI/runtime work

### Target Result

At the end of this phase:
- the `Environment` section is easier to scan and understand
- shadow controls are no longer awkwardly split across unrelated sections
- `Ground` remains a dedicated separate section instead of being folded back into `Environment`
- the toolbar keeps the same underlying scene behavior while presenting the controls more clearly
- later preset and HDRI phases have a cleaner visible landing surface

### Current Live Read

Current visible owner seam:
- `src/app/components/ViewToolbar.tsx`
  - currently exposes:
    - `Tone Mapping`
    - `Exposure`
    - a top-level `Environment` section
    - a top-level `Ground` section
    - raw light rows
    - selected-light editing
  - currently splits shadow controls across two places:
    - the global `Shadows` toggle still lives in the broad `View` section
    - per-light shadow controls still live inside the selected-light editor
  - currently keeps `Environment` fairly flat:
    - `Preset`
    - `Lighting`
    - add-light row
    - selected-light editor

Current state and persistence seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - owns the allowed top-level toolbar tab keys for tabs presentation
- `src/app/workspace/workspacePersistence.ts`
  - owns toolbar-local persisted tab validation and fallback behavior

Current environment-state seam:
- `src/shared/viewSettingsTypes.ts`
  - already owns:
    - `envPreset`
    - `lighting.lights`
    - `shadowsEnabled`
    - `ground`
  - should remain structurally unchanged in this phase

Current runtime seam:
- `src/viewer/Viewer.ts`
  - already applies the existing environment, shadows, and ground behavior
  - should remain behaviorally unchanged in this phase

Main implication:
- `Phase 2c` should be a visible surface cleanup only
- it may reorganize section ownership in the toolbar shell
- it must not quietly turn into a runtime or state-model change

### First Pass Decisions

- keep `Phase 2c` presentation-first
- treat `Ground` as already solved by `Phase 2d` and keep it as its own top-level section
- narrow the visible environment cleanup around three clear surfaces:
  - `Environment`
  - `Shadows`
  - `Ground`
- use `Phase 2c` to migrate only the remaining environment-facing settings that are real fits for:
  - `ParaSelect`
  - `ParaSlider`
- keep raw non-shadow light editing under `Environment`
- keep text, color, and vector editing native in this phase
- keep the underlying `ViewSettings` and viewer runtime semantics unchanged
- allow toolbar-local tab-key and persistence updates only if the new visible `Shadows` section requires them

### Suggested Visible Structure

The recommended first reorganization is:

1. Keep `Environment` focused on environment-owned scene setup:
   - `Preset`
   - `Lighting`
   - add-light row
   - selected-light non-shadow fields
2. Add a new top-level `Shadows` section in the `View` toolbar:
   - global `Shadows`
   - selected-light shadow fields when the selected light type supports shadows
3. Keep `Ground` as its own top-level section directly adjacent to the environment family surface
4. Do not move unrelated view toggles such as `Grid` or `Axes` into this pass unless they are already required for the existing `View` section to remain coherent

Reason:
- this gives the current controls one clearer family read without pretending the preset model is already richer than it is
- it also prevents the new `Ground` lane from turning `Environment` into a grab bag

### Shared Phase Rule

This phase should now ship as a few small Codex-sized cuts instead of one broad cleanup bucket.

Shared rule for every subphase:
- do not change viewer runtime behavior
- do not add new shared environment state
- do not widen into materials, snap, or HDRI/runtime work
- keep `Ground` as its own top-level section
- update only the toolbar and toolbar-local persistence seams required by the specific subphase

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/app/workspace/useWorkspaceStore.test.ts`
- toolbar-local state support if needed:
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add new `ViewSettings` fields in `Phase 2c`
- do not change the shipped light rig in `Phase 2c`
- do not change the ground runtime in `Phase 2c`
- do not add new environment presets in `Phase 2c`
- do not widen this pass into HDRI/runtime work
- do not use organization cleanup as a pretext for silent viewer behavior changes

### Implementation Risks

- turning a visible organization pass into a hidden behavior pass
- moving shadow controls in a way that makes the selected-light editing story more confusing instead of clearer
- collapsing `Ground` back into `Environment` and undoing the explicit owner split landed in `Phase 2d`
- introducing a new toolbar tab key without preserving the existing invalid-tab fallback behavior
- over-designing the visible surface before the real preset-truth phase exists

### Checklist

- [ ] confirm the live `Environment`, `View`, and `Ground` toolbar structure in `ViewToolbar.tsx`
- [ ] confirm the remaining para-migration candidates inside the environment-facing toolbar surface
- [ ] lock `Phase 2c` to visible organization and para-style control migration only
- [ ] turn the environment-facing para-migration candidates into explicit wishlist items
- [ ] split the wishlist into small Codex-sized internal phases
- [ ] decide that `Shadows` becomes a dedicated top-level toolbar section
- [ ] keep `Ground` separate from `Environment`
- [ ] defer preset-truth, ground-runtime, Browser, and HDRI/runtime widening out of this pass
- [ ] identify the exact toolbar and persistence seams that may need updates when `Shadows` becomes a section key

### Verification Shape

Minimum verification for this phase should cover:

- the `Environment`, `Shadows`, and `Ground` sections render in the intended top-level order
- the global shadow toggle still drives the same shared state
- the selected-light shadow fields still drive the same light properties
- tabs-mode and classic-mode both expose the reorganized sections correctly
- any new toolbar section key persists and falls back correctly when invalid

### Done Shape

`Phase 2c` is done when:

- the environment-facing toolbar surface is easier to scan than the current mixed layout
- the `Shadows` controls have one explicit visible owner
- the current controls still drive the same runtime behavior they did before
- `Phase 3` can build preset truth on top of a cleaner environment-facing toolbar surface

## Wishlist Tracking

Use this tracker to keep the para-style cleanup honest and scoped to the settings that are strong fits for `ParaSelect` and `ParaSlider`.

### `Phase 2c`
- [x] `0. Global Shadows Toggle -> ParaSelect`
- [x] `1. Tone Mapping -> ParaSelect`
- [x] `2. Exposure -> ParaSlider`
- [ ] `3. Environment Preset -> ParaSelect`
- [ ] `4. Add Light Type -> ParaSelect`
- [ ] `5. Selected Light Enabled -> ParaSelect`
- [ ] `6. Selected Light Type -> ParaSelect`
- [ ] `7. Selected Light Intensity -> ParaSlider`
- [ ] `8. Selected Light Distance -> ParaSlider`
- [ ] `9. Selected Light Decay -> ParaSlider`
- [ ] `10. Selected Spot Angle -> ParaSlider`
- [ ] `11. Selected Spot Penumbra -> ParaSlider`
- [ ] `12. Dedicated Shadows Section`
- [ ] `13. Per-Light Cast Shadow -> ParaSelect`
- [ ] `14. Per-Light Shadow Bias -> ParaSlider`
- [ ] `15. Per-Light Shadow Map -> ParaSelect`
- implementation target:
  - convert the remaining environment-facing native select, checkbox, and range or number controls that are honest fits for the shipped para components
  - keep the cleanup on visible organization and control-surface consistency
  - leave text fields, color fields, and vector triples out of this phase unless a new para input family is explicitly introduced later

### Explicitly Not In This Tracker

These are still native today, but they should not be forced into `Phase 2c` just to satisfy the para-style push:

- text-entry fields such as:
  - `Light name`
  - selected material `Name`
- color-entry fields such as:
  - light `Color`
  - material `Color`
  - material `Emissive`
- vector triples such as:
  - light `Position`
  - light `Target`
- broader non-environment families such as:
  - `Snap`
  - `Materials`

Reason:
- the shipped repo already has `ParaSelect` and `ParaSlider`
- it does not yet have a comparable para-style text, color, or vector editor family
- `Phase 2c` should stay environment-facing instead of turning into a toolbar-wide input-standardization rewrite

## [x] Phase 1 - Para Migration For View-Level Environment Controls

Purpose:
- convert the remaining environment-adjacent controls still living in the broad `View` section to para-style surfaces before deeper environment reorganization starts

Owns:
- `0. Global Shadows Toggle -> ParaSelect`
- `1. Tone Mapping -> ParaSelect`
- `2. Exposure -> ParaSlider`

Does not own:
- moving per-light shadow controls yet
- adding a dedicated `Shadows` section yet
- selected-light editor cleanup yet

This phase should:
- replace the current native `Shadows` checkbox with a para-style control
- replace the current native `Tone Mapping` select with `ParaSelect`
- replace the current native `Exposure` range and number pair with one `ParaSlider`
- keep the underlying state and runtime behavior exactly the same

Exact first code cut:
1. Re-read the current `View` section in `src/app/components/ViewToolbar.tsx`
2. Convert `shadowsEnabled`, `toneMapping`, and `exposure` to para-style controls
3. Add focused `ViewToolbar` proof that those controls still drive the same shared state

### Implementation Spec

### Code-Backed Read

The shipped `Phase 1` cut stayed intentionally narrow and landed through the existing `View` toolbar and para-input surfaces:

- `src/app/components/ViewToolbar.tsx`
  - now renders the target controls in the broad `View` section as para-style inputs:
    - `Shadows` = `ParaSelect`
    - `Tone Mapping` = `ParaSelect`
    - `Exposure` = `ParaSlider`
  - kept all three controls on the same shared top-level view mutation seam:
    - `setViewKey('shadowsEnabled', ...)`
    - `setViewKey('toneMapping', ...)`
    - `setViewKey('exposure', ...)`
  - keeps these controls outside the `Environment` and `Ground` sections, which preserves the intended first para-migration boundary before deeper reorganization
- `src/app/store/uiPrefsStore.ts`
  - continued to own the shared top-level `view` state without needing a new mutation API
- `src/app/components/ParaSelect.tsx`
  - provided the shipped select surface for:
    - `Shadows` as a narrow `On / Off` choice
    - `Tone Mapping` as the current `None / ACES` choice
- `src/app/components/ParaSlider.tsx`
  - replaced the old paired `Exposure` controls without losing direct numeric editing because the shipped slider already includes its own value-edit path
- `src/app/components/ViewToolbar.test.tsx`
  - now includes focused proof that the para-style `Shadows`, `Tone Mapping`, and `Exposure` controls still drive the same shared `view` state
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
  - remained unchanged because this cut did not add a new top-level section key

Main implication:
- `Phase 1` landed fully inside the current `View` section
- it standardized the visible control surface for `Shadows`, `Tone Mapping`, and `Exposure`
- it did not widen into tab-key changes, dedicated `Shadows` ownership, or selected-light editor cleanup

### First Pass Decisions

- keep `Phase 1` fully inside the existing broad `View` section
- convert only the three explicit wishlist items owned by this cut:
  - global `Shadows`
  - `Tone Mapping`
  - `Exposure`
- model `Shadows` as a para-style binary choice rather than leaving it as a checkbox
- use one `ParaSlider` for `Exposure` instead of preserving the current range-plus-number pair
- keep the same `setViewKey` shared-state updates underneath the new visible controls
- do not add a new toolbar section key in this phase
- do not move any per-light shadow controls yet
- do not pull `Preset`, `Add Light`, or selected-light controls into this cut

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- expected no-change seams unless a small bug is discovered while wiring:
  - `src/app/store/uiPrefsStore.ts`
  - `src/app/components/ParaSelect.tsx`
  - `src/app/components/ParaSlider.tsx`
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add a dedicated `Shadows` section in `Phase 1`
- do not add a new toolbar tab key in `Phase 1`
- do not change `ViewSettings` structure in `Phase 1`
- do not change viewer runtime behavior in `Phase 1`
- do not move per-light shadow controls in `Phase 1`
- do not convert `Environment Preset`, `Add Light Type`, or selected-light controls in `Phase 1`
- do not preserve the old `Exposure Value` input as a second visible control just to mirror the old layout

### Implementation Risks

- turning a small para-style migration into a larger `View` section redesign
- accidentally changing the semantic meaning of the global `Shadows` control while replacing the checkbox with a select-like surface
- replacing the paired `Exposure` controls with a `ParaSlider` but forgetting that the current surface still needs direct numeric editability
- widening into tab persistence work even though no new section key is introduced in this phase

### Verification Shape

Minimum verification for this phase should cover:

- the `View` section renders para-style controls for:
  - `Shadows`
  - `Tone Mapping`
  - `Exposure`
- changing the new `Shadows` control still updates `useUiPrefsStore.getState().view.shadowsEnabled`
- changing the new `Tone Mapping` control still updates `useUiPrefsStore.getState().view.toneMapping`
- changing the new `Exposure` slider still updates `useUiPrefsStore.getState().view.exposure`
- tabs-mode still exposes the same current section rail because no new section key was added

### Done Shape

`Phase 1` is done when:

- the view-level environment-adjacent controls no longer use the older checkbox, native select, and paired range-plus-number treatment
- the visible control surface for those three settings matches the shipped para style used elsewhere in the toolbar
- the same shared `view` state changes still occur through the existing seam
- `Phase 2` can move into the `Environment` section without reopening the top-level `View` control treatment

Current status:
- `Phase 1` is implemented
- the shipped cut stays inside the current `View` section and does not require workspace tab or persistence changes
- `Phase 2 - Para Migration For Core Environment Controls` is now the next internal `Phase 2c` code cut

## [ ] Phase 2 - Para Migration For Core Environment Controls

Purpose:
- convert the simplest environment-owned controls to para-style surfaces without entering the full selected-light detail editor yet

Owns:
- `3. Environment Preset -> ParaSelect`
- `4. Add Light Type -> ParaSelect`

Does not own:
- selected-light editor migration
- shadow-section extraction

This phase should:
- replace the native environment `Preset` select with `ParaSelect`
- replace the `Add Light` type select with `ParaSelect`
- leave the add-light name field native

Exact first code cut:
1. Re-read the current top of the `Environment` section
2. Convert `Preset` and `Add Light Type` to `ParaSelect`
3. Add focused toolbar proof for the updated visible contract

## [ ] Phase 3 - Para Migration For Selected-Light Core Tuning

Purpose:
- convert the non-shadow selected-light controls that are honest fits for the current para component set

Owns:
- `5. Selected Light Enabled -> ParaSelect`
- `6. Selected Light Type -> ParaSelect`
- `7. Selected Light Intensity -> ParaSlider`
- `8. Selected Light Distance -> ParaSlider`
- `9. Selected Light Decay -> ParaSlider`
- `10. Selected Spot Angle -> ParaSlider`
- `11. Selected Spot Penumbra -> ParaSlider`

Does not own:
- shadow control extraction
- text, color, or vector control replacement

This phase should:
- migrate the selected-light scalar and mode-like controls to para-style surfaces
- keep:
  - `Name`
  - `Color`
  - `Position`
  - `Target`
  native in this pass

Exact first code cut:
1. Re-read the selected-light editor block in `src/app/components/ViewToolbar.tsx`
2. Convert the scalar and enum-like controls listed above to `ParaSelect` or `ParaSlider`
3. Add focused toolbar proof for one representative light of each supported shape

## [ ] Phase 4 - Dedicated Shadows Section And Shadow Para Controls

Purpose:
- give all shadow-facing controls one explicit visible owner and finish the para-style migration for shadow settings

Owns:
- `12. Dedicated Shadows Section`
- `13. Per-Light Cast Shadow -> ParaSelect`
- `14. Per-Light Shadow Bias -> ParaSlider`
- `15. Per-Light Shadow Map -> ParaSelect`

Does not own:
- new shadow behavior
- new light types
- new shared state

This phase should:
- add one top-level `Shadows` section
- move the global shadow control there
- move the selected-light shadow controls there
- update tabs and persistence only if the new top-level section key requires it

Exact first code cut:
1. Add the top-level `Shadows` section in the toolbar shell
2. Move the current global and per-light shadow controls into that section
3. Convert the per-light shadow controls to para-style surfaces
4. Update toolbar section-key and persistence proof if the new section is added to tabs mode

## [ ] Phase 5 - Final Environment-Surface Order And Wording Cleanup

Purpose:
- do the smallest final visible cleanup after the para-style migrations land so the environment family surface reads intentionally in both `Classic` and `Tabs`

Owns:
- final visible ordering for:
  - `Environment`
  - `Shadows`
  - `Ground`
- wording cleanup where the para migration leaves awkward labels or spacing

Does not own:
- new controls
- new state
- runtime behavior changes

This phase should:
- confirm the final top-level ordering
- confirm the final section labels
- tighten any awkward leftovers from the prior migration cuts

Exact first code cut:
1. Re-read the shipped post-Phase-4 toolbar surface
2. Make only the smallest visible ordering and wording adjustments still needed
3. Add or update focused toolbar proof if the visible order changes
