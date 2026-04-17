# Environment Phase Environment-1 Phase 2c - Environment Section Organization Pass

## Doc Header

### Doc History
13. 2026-04-17 15:42:27: Implemented `Environment-1 / Phase 2c / Phase 3.1 - Selected-Light Tail Style Parity` by converting the remaining selected-light shadow-tail controls to `ParaSelect` and `ParaSlider`, restyling the adjacent `Position` and `Target` rows into one more intentional local tail treatment, adding focused proof for the tail branches, and advancing the next internal `Phase 2c` cut to `Phase 4`
12. 2026-04-17 15:31:00: Prepped `Environment-1 / Phase 2c / Phase 3.1 - Selected-Light Tail Style Parity` for implementation by grounding the next cut in the live selected-light `VectorFieldGrid` tail, the remaining native shadow-tail controls, the unchanged `updateLight(...)` and `shadowSizes` seams, and the already-shipped selected-light branch proof while keeping dedicated `Shadows` section ownership deferred
11. 2026-04-17 15:27:01: Added `Environment-1 / Phase 2c / Phase 3.1 - Selected-Light Tail Style Parity` as the next explicit follow-on after the shipped core selected-light migration, capturing that the selected-light editor still has native-styled `Position`, `Target`, and shadow-tail controls that should receive one honest style-alignment pass before the later dedicated `Shadows` section extraction
10. 2026-04-17 15:10:06: Implemented `Environment-1 / Phase 2c / Phase 3 - Para Migration For Selected-Light Core Tuning` by converting the selected-light editor's core enabled, type, intensity, distance, decay, angle, and penumbra controls to `ParaSelect` and `ParaSlider`, adding focused branch-proof in `ViewToolbar.test.tsx`, and advancing the next internal `Phase 2c` cut to `Phase 4`
9. 2026-04-17 15:00:01: Reformatted the standalone `Environment-1 / Phase 2c` wishlist section to match the current `Architecture Setup` default by replacing `Wishlist Tracking` with `Wishlist Organization`, adding a `High Level Goals` block, and mapping the smaller checklist items onto explicit per-phase organization blocks without changing the underlying `2c` scope
8. 2026-04-17 14:54:27: Prepped `Environment-1 / Phase 2c / Phase 3 - Para Migration For Selected-Light Core Tuning` for implementation by grounding the next cut in the live selected-light editor branches, the existing `updateLight(...)` normalization seam, the type-default reset path, and the focused `ViewToolbar` proof surface while keeping name, color, vector, and shadow controls deferred
7. 2026-04-17 14:33:16: Implemented `Environment-1 / Phase 2c / Phase 2 - Para Migration For Core Environment Controls` by replacing the top-of-section native `Environment` preset and add-light type selectors with `ParaSelect`, adding focused `ViewToolbar` proof that the shared `envPreset` seam and local add-light type flow still behave the same way, and advancing the next internal `Phase 2c` cut to `Phase 3`
6. 2026-04-17 14:15:19: Prepped `Environment-1 / Phase 2c / Phase 2 - Para Migration For Core Environment Controls` for implementation by grounding the next cut in the live native `Environment` preset and add-light type controls, the existing shared `envPreset` mutation seam, the local `addLightType` toolbar state, the shipped `ParaSelect` surface, and the focused `ViewToolbar` proof path while keeping selected-light editor, tab-key, and dedicated `Shadows` section work deferred
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

## Wishlist Organization

Use this section to keep the para-style cleanup honest and scoped to the settings that are strong fits for `ParaSelect` and `ParaSlider`.

### High Level Goals

- [ ] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [ ] `HLG 2. Give shadow-facing controls one explicit visible owner`
- [ ] `HLG 3. Finish the para-style migration only for environment-facing controls that are honest fits for the shipped para surfaces`

### Environment-1 / Phase 2c `Phase 1`

- [x] HLG 1. `Reorganize the environment-facing toolbar surface so it is easier to scan`
- [x] `HLG 3. Finish the para-style migration only for environment-facing controls that are honest fits for the shipped para surfaces`
- [x] `0. Global Shadows Toggle -> ParaSelect`
- [x] `1. Tone Mapping -> ParaSelect`
- [x] `2. Exposure -> ParaSlider`

### Environment-1 / Phase 2c `Phase 2`

- [x] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [x] `HLG 3. Finish the para-style migration only for environment-facing controls that are honest fits for the shipped para surfaces`
- [x] `3. Environment Preset -> ParaSelect`
- [x] `4. Add Light Type -> ParaSelect`

### `Environment-1 / Phase 2c Phase 3`

- [x] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [x] `HLG 3. Finish the para-style migration only for environment-facing controls that are honest fits for the shipped para surfaces`
- [x] `5. Selected Light Enabled -> ParaSelect`
- [x] `6. Selected Light Type -> ParaSelect`
- [x] `7. Selected Light Intensity -> ParaSlider`
- [x] `8. Selected Light Distance -> ParaSlider`
- [x] `9. Selected Light Decay -> ParaSlider`
- [x] `10. Selected Spot Angle -> ParaSlider`
- [x] `11. Selected Spot Penumbra -> ParaSlider`

### `Environment-1 / Phase 2c Phase 3.1`

- [x] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [x] `HLG 3. Finish the para-style migration only for environment-facing controls that are honest fits for the shipped para surfaces`
- [x] `12. Selected Light Position Tail Styling`
- [x] `13. Selected Light Target Tail Styling`
- [x] `14. Per-Light Cast Shadow -> ParaSelect`
- [x] `15. Per-Light Shadow Bias -> ParaSlider`
- [x] `16. Per-Light Shadow Map -> ParaSelect`

### `Environment-1 / Phase 2c Phase 4`

- [ ] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [ ] `HLG 2. Give shadow-facing controls one explicit visible owner`
- [ ] `17. Dedicated Shadows Section`

### `Environment-1 / Phase 2c Phase 5`

- [ ] `HLG 1. Reorganize the environment-facing toolbar surface so it is easier to scan`
- [ ] `Final visible order and wording cleanup`

Implementation target:
- convert the remaining environment-facing native select, checkbox, and range or number controls that are honest fits for the shipped para components
- keep the cleanup on visible organization and control-surface consistency
- leave text fields, color fields, and broader vector-editor standardization out of this phase unless a narrower selected-light tail pass explicitly owns the local exception

### Explicitly Not In This Wishlist

These are still native today, but they should not be forced into `Phase 2c` just to satisfy the para-style push:

- text-entry fields such as:
  - `Light name`
  - selected material `Name`
- color-entry fields such as:
  - light `Color`
  - material `Color`
  - material `Emissive`
- broader vector-editor standardization outside the selected-light tail pass, such as:
  - non-environment vector editors
  - toolbar-wide vector input standardization
- broader non-environment families such as:
  - `Snap`
  - `Materials`

Reason:
- the shipped repo already has `ParaSelect` and `ParaSlider`
- it still does not have a comparable repo-wide para-style text, color, or vector editor family
- `Phase 3.1` only widens selected-light `Position` and `Target` styling because those controls are part of the same remaining selected-light tail shown in the live editor
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

## [x] Phase 2 - Para Migration For Core Environment Controls

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

### Implementation Spec

### Code-Backed Read

The shipped `Phase 2` cut stayed intentionally narrow and landed through the top of the existing `Environment` section plus the existing para-input surface:

- `src/app/components/ViewToolbar.tsx`
  - now renders the top of the `Environment` section with:
    - `Preset` = `ParaSelect` bound to `view.envPreset`
    - `Add Light Type` = `ParaSelect` bound to the local `addLightType` toolbar state
    - a native `Light name` text input beside that type select
  - kept the two target controls on the same separate but existing owner seams:
    - `Preset` -> `setViewKey('envPreset', ...)`
    - `Add Light Type` -> `setAddLightType(...)`
  - keeps those controls above the raw light list and selected-light editor, which preserves the intended second para-migration boundary before the deeper light-editor work begins
- `src/shared/viewSettingsTypes.ts`
  - continued to own `envPreset` as the same thin shared environment preset contract:
    - `none`
    - `studio`
  - remained structurally unchanged in this phase
- `src/app/store/uiPrefsStore.ts`
  - continued to own the shared top-level `view` state and existing `envPreset` mutation path without needing a new API
- `src/app/components/ParaSelect.tsx`
  - provided the shipped para-style select surface for both owned controls in this cut:
    - `Preset`
    - `Add Light Type`
- `src/app/components/ViewToolbar.test.tsx`
  - now includes focused proof that the para-style `Preset` control still drives the shared `envPreset` seam and that the para-style `Add Light Type` control still drives the local add-light flow
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
  - remained unchanged because this cut still did not add a new top-level section key

Main implication:
- `Phase 2` landed at the very top of the current `Environment` section
- it standardized `Preset` and `Add Light Type` into para-style controls
- it did not widen into raw light-row restructuring, selected-light editor migration, or dedicated `Shadows` ownership

### First Pass Decisions

- keep `Phase 2` fully inside the existing `Environment` section
- convert only the two explicit wishlist items owned by this cut:
  - `Environment Preset`
  - `Add Light Type`
- keep `Light name` native in this phase
- keep the same owner split underneath the new visible controls:
  - `Preset` stays on the shared `setViewKey('envPreset', ...)` seam
  - `Add Light Type` stays on the local `setAddLightType(...)` seam
- do not move or redesign the raw light list in this phase
- do not enter the selected-light editor in this phase
- do not add a new toolbar section key in this phase

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- expected no-change seams unless a small bug is discovered while wiring:
  - `src/shared/viewSettingsTypes.ts`
  - `src/app/store/uiPrefsStore.ts`
  - `src/app/components/ParaSelect.tsx`
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not convert selected-light editor controls in `Phase 2`
- do not move per-light shadow controls in `Phase 2`
- do not add a dedicated `Shadows` section in `Phase 2`
- do not change `ViewSettings` structure in `Phase 2`
- do not change viewer runtime behavior in `Phase 2`
- do not convert the `Light name` text field in `Phase 2`
- do not redesign the raw light list or add-light action flow in `Phase 2`

### Implementation Risks

- widening a small top-of-section para migration into a larger `Environment` section re-layout
- accidentally turning the local `Add Light Type` selector into shared environment truth when it is still just toolbar-local add-light state
- touching the `Light name` input just because it sits beside the type selector even though text-entry migration is explicitly out of scope
- widening into tab or persistence work even though no new section key is introduced in this phase

### Verification Shape

Minimum verification for this phase should cover:

- the `Environment` section renders para-style controls for:
  - `Preset`
  - `Add Light Type`
- changing the new `Preset` control still updates `useUiPrefsStore.getState().view.envPreset`
- changing the new `Add Light Type` control still updates the local toolbar selection used by the add-light flow
- the `Light name` input remains present and native
- tabs-mode still exposes the same current section rail because no new section key was added

### Done Shape

`Phase 2` is done when:

- the top of the `Environment` section no longer uses native select controls for `Preset` and `Add Light Type`
- those controls match the shipped para style used elsewhere in the toolbar
- the shared `envPreset` seam and local `addLightType` seam still behave the same way they did before
- `Phase 3` can move into the selected-light editor without reopening the top-of-section control treatment

Current status:
- `Phase 2` is implemented
- the shipped cut stays at the top of the current `Environment` section and does not require workspace tab or persistence changes
- `Phase 3 - Para Migration For Selected-Light Core Tuning` is now the next internal `Phase 2c` code cut

## [x] Phase 3 - Para Migration For Selected-Light Core Tuning

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

### Implementation Spec

### Code-Backed Read

The shipped `Phase 3` cut stayed entirely inside the existing selected-light editor that renders after the raw light list and add-light row:

- `src/app/components/ViewToolbar.tsx`
  - now renders the selected-light editor with para-style controls for the core mode-like and scalar tuning owned by this phase:
    - `Enabled` = `ParaSelect`
    - `Type` = `ParaSelect`
    - `Intensity` = `ParaSlider`
    - `Distance` and `Decay` = `ParaSlider` when the selected type supports distance settings
    - `Angle (deg)` and `Penumbra` = `ParaSlider` when the selected type is `spot`
  - keeps these neighboring controls native exactly as scoped:
    - `Name`
    - `Color`
    - `Position`
    - `Target`
    - shadow controls
  - kept the selected-light editor on the same helper and mutation boundaries:
    - `supportsPosition(...)`
    - `supportsTarget(...)`
    - `supportsDistance(...)`
    - `supportsSpot(...)`
    - `supportsShadow(...)`
    - `getLightTypeDefaults(type)` when the selected-light `Type` changes
- `src/app/store/uiPrefsStore.ts`
  - continued to own the only mutation seam this phase needed:
    - `updateLight(id, patch)`
  - continued to normalize branch-only fields after every update:
    - removes `position` when the new type does not support it
    - removes `target` when the new type does not support it
    - removes `distance` and `decay` when the new type does not support them
    - removes `angleDeg` and `penumbra` when the new type is no longer `spot`
    - removes shadow fields when the new type no longer supports shadows
- `src/shared/viewSettingsTypes.ts`
  - continued to define the same shared `LightType` and `LightSpec` contract without widening
  - continued to ship a default light rig with representative selected-light shapes:
    - `Key` = `directional`
    - `Fill` = `hemisphere`
    - `Rim` = `directional`
- `src/app/components/ParaSelect.tsx`
- `src/app/components/ParaSlider.tsx`
  - provided the shipped para-style control surfaces for the selected-light core tuning without inventing new editor widgets
- `src/app/components/ViewToolbar.test.tsx`
  - now includes focused proof that the selected-light core para controls still drive the same selected light and that the `point`, `spot`, and non-distance branches still appear and disappear correctly

Main implication:
- `Phase 3` shipped as a UI-only migration on top of the same `updateLight(...)` path and existing type-helper branching
- it standardized the selected-light editor's core scalar and mode-like controls without widening into vector, color, or shadow redesign

### First Pass Decisions

- keep `Phase 3` fully inside the existing selected-light editor
- convert only the explicit owned controls in this phase:
  - `Enabled` -> `ParaSelect`
  - `Type` -> `ParaSelect`
  - `Intensity` -> `ParaSlider`
  - `Distance` -> `ParaSlider`
  - `Decay` -> `ParaSlider`
  - `Angle (deg)` -> `ParaSlider`
  - `Penumbra` -> `ParaSlider`
- collapse the current paired `Intensity` range-plus-number treatment into one `ParaSlider` instead of preserving two visible controls for the same field
- keep the underlying mutation seams unchanged:
  - type changes stay on `updateLight(selectedLight.id, { type, ...getLightTypeDefaults(type) })`
  - scalar updates stay on `updateLight(selectedLight.id, { ... })`
- keep these controls native in this phase:
  - `Name`
  - `Color`
  - `Position`
  - `Target`
  - shadow controls
- preserve the current branch rules instead of flattening the editor:
  - `Distance` and `Decay` appear only for `point` and `spot`
  - `Angle (deg)` and `Penumbra` appear only for `spot`

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- expected no-change seams unless a small bug is discovered while wiring:
  - `src/app/store/uiPrefsStore.ts`
  - `src/shared/viewSettingsTypes.ts`
  - `src/app/components/ParaSelect.tsx`
  - `src/app/components/ParaSlider.tsx`
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not convert `Name` in `Phase 3`
- do not convert `Color` in `Phase 3`
- do not convert `Position` or `Target` vector editing in `Phase 3`
- do not move shadow controls or add a dedicated `Shadows` section in `Phase 3`
- do not change `LightSpec` shape or `updateLight(...)` normalization behavior in `Phase 3`
- do not redesign the raw light list or add-light flow in `Phase 3`
- do not add tab or persistence work in `Phase 3`

### Implementation Risks

- widening a focused selected-light para migration into a larger editor redesign just because all the controls sit in one panel
- accidentally bypassing the existing type-change reset path and leaving stale branch-only fields on the wrong light shape
- making `Intensity` less precise or less readable when collapsing the current paired range-plus-number pattern into one para slider
- forgetting that `Distance`, `Decay`, `Angle`, and `Penumbra` only exist on some light types and therefore need proof that the para controls appear and disappear on the right branches
- touching shadow controls while working near the same conditional editor block even though that ownership belongs to `Phase 4`

### Verification Shape

Minimum verification for this phase should cover:

- the selected default light renders para-style controls for:
  - `Enabled`
  - `Type`
  - `Intensity`
- the selected-light editor still leaves these controls native:
  - `Name`
  - `Color`
  - `Position`
  - `Target`
- changing `Enabled` through the new para control still updates `useUiPrefsStore.getState().view.lighting.lights`
- changing `Type` through the new para control still rides the existing type-default reset path
- switching the selected light to `point` shows para-style `Distance` and `Decay`
- switching the selected light to `spot` shows para-style `Angle (deg)` and `Penumbra`
- switching the selected light to a non-distance, non-spot type such as `ambient` or `hemisphere` hides those branch-only para controls cleanly

### Done Shape

`Phase 3` is done when:

- the selected-light editor no longer uses native checkbox/select/range controls for the core mode-like and scalar tuning owned by this phase
- the selected-light editor still keeps text, color, vector, and shadow controls on their current native surfaces
- the current type-specific editor branches still appear and disappear correctly after type changes
- `Phase 4` can move shadow ownership without reopening the selected-light core tuning treatment

Current status:
- `Phase 3` is implemented
- the shipped cut stayed fully inside the selected-light editor and did not require shared state or persistence widening
- `Phase 4 - Dedicated Shadows Section Ownership Cleanup` is now the next internal `Phase 2c` code cut

## [x] Phase 3.1 - Selected-Light Tail Style Parity

Purpose:
- finish the remaining selected-light editor style cleanup after the shipped core-tuning migration so the tail of the panel no longer drops back to the older native look

Owns:
- `12. Selected Light Position Tail Styling`
- `13. Selected Light Target Tail Styling`
- `14. Per-Light Cast Shadow -> ParaSelect`
- `15. Per-Light Shadow Bias -> ParaSlider`
- `16. Per-Light Shadow Map -> ParaSelect`

Does not own:
- moving shadow controls into their final top-level section yet
- text or color control replacement
- repo-wide vector editor standardization

This phase should:
- restyle the remaining selected-light tail controls that still visually fall back to the older native treatment
- keep:
  - `Name`
  - `Color`
  native in this pass
- bring the current `Position` and `Target` rows into one more intentional editor style without pretending there is already a reusable repo-wide para vector family
- convert the still-native shadow-tail controls to the same para surfaces already used elsewhere:
  - `Cast Shadow` -> `ParaSelect`
  - `Shadow Bias` -> `ParaSlider`
  - `Shadow Map` -> `ParaSelect`

Exact first code cut:
1. Re-read the bottom of the selected-light editor block in `src/app/components/ViewToolbar.tsx`
2. Convert the shadow-tail controls to `ParaSelect` and `ParaSlider`
3. Restyle the adjacent `Position` and `Target` rows so the selected-light tail reads as one intentional editor surface
4. Add focused toolbar proof that the selected-light tail still drives the same light fields and keeps the current type-gated visibility

### Implementation Spec

### Code-Backed Read

The shipped `Phase 3.1` cut finished the remaining selected-light editor tail styling after the shipped core-tuning migration:

- `src/app/components/ViewToolbar.tsx`
  - now renders the selected-light editor tail with:
    - `Position` and `Target` as one more intentional local tail surface instead of the older loose `VectorFieldGrid` rows
    - `Cast Shadow` = `ParaSelect`
    - `Shadow Bias` = `ParaSlider`
    - `Shadow Map` = `ParaSelect`
  - kept those controls on the same selected-light owner seams:
    - vector values still update through `updateLight(selectedLight.id, { position: ... })`
    - vector values still update through `updateLight(selectedLight.id, { target: ... })`
    - shadow values still update through `updateLight(selectedLight.id, { castShadow: ... })`
    - shadow values still update through `updateLight(selectedLight.id, { shadowBias: ... })`
    - shadow values still update through `updateLight(selectedLight.id, { shadowMapSize: ... })`
  - kept `Shadow Map` on the same local option contract:
    - `256`
    - `512`
    - `1024`
    - `2048`
  - kept the same type-helper visibility boundaries:
    - `supportsPosition(...)`
    - `supportsTarget(...)`
    - `supportsShadow(...)`
- `src/app/store/uiPrefsStore.ts`
  - continued to own the same `updateLight(id, patch)` seam for all selected-light tail fields
  - continued to normalize unsupported vector and shadow fields away when the selected light type changes
- `src/app/theme/foundation/base.css`
  - now gives the selected-light vector tail one local style treatment so the bottom of the editor reads like one continuous surface instead of switching back to the older native look
- `src/app/components/ViewToolbar.test.tsx`
  - now extends the selected-light proof surface to cover the tail migration:
    - vector-tail rendering
    - shadow-tail para controls
    - preserved `shadowSizes` options
    - preserved type-gated visibility through the existing branch changes

Main implication:
- the selected-light editor now reads as one continuous migrated surface from the top controls through the tail
- `Phase 4` can focus on dedicated `Shadows` section ownership without mixing that move with leftover tail-style cleanup

### First Pass Decisions

- keep `Phase 3.1` fully inside the existing selected-light editor
- convert only the remaining shadow-tail controls to para-style surfaces:
  - `Cast Shadow`
  - `Shadow Bias`
  - `Shadow Map`
- keep `Shadow Map` on the existing `shadowSizes` option list instead of widening the underlying shadow-size contract
- treat `Position` and `Target` as a selected-light tail style-alignment pass, not as a claim that the repo now has a general para vector-input family
- prefer one local selected-light tail styling treatment for `Position` and `Target` rather than introducing a new shared vector component family in this phase
- keep the same underlying `updateLight(...)` mutation path for all selected-light tail fields
- do not move the global `Shadows` control or selected-light shadow controls into a new top-level section in this phase

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- expected no-change seams unless a small bug is discovered while wiring:
  - `src/app/store/uiPrefsStore.ts`
  - `src/shared/viewSettingsTypes.ts`
  - `src/app/components/ParaSelect.tsx`
  - `src/app/components/ParaSlider.tsx`
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add the dedicated `Shadows` section in `Phase 3.1`
- do not change `LightSpec` shape or `updateLight(...)` normalization behavior in `Phase 3.1`
- do not convert `Name` or `Color` in `Phase 3.1`
- do not widen into repo-wide vector input standardization in `Phase 3.1`
- do not change viewer runtime behavior in `Phase 3.1`
- do not add tab or persistence work in `Phase 3.1`

### Implementation Risks

- widening a small remaining editor-tail cleanup into a larger selected-light editor redesign
- accidentally coupling shadow-tail restyling to the later `Shadows` section extraction and making the next phase harder to isolate
- pretending `Position` and `Target` now have a reusable para-vector standard when this phase only needs local tail-style parity
- breaking the current type-gated visibility for vector and shadow rows while restyling the bottom of the editor

### Verification Shape

Minimum verification for this phase should cover:

- the selected-light editor tail no longer drops back to the older native visual treatment for:
  - `Cast Shadow`
  - `Shadow Bias`
  - `Shadow Map`
- the selected-light editor tail reads consistently for:
  - `Position`
  - `Target`
- changing the new shadow-tail controls still updates `useUiPrefsStore.getState().view.lighting.lights`
- the `Shadow Map` control still exposes the same size options:
  - `256`
  - `512`
  - `1024`
  - `2048`
- `Position` and `Target` still render only for the supported light types after the tail restyle
- shadow-tail controls still render only for the supported light types after the style migration
- existing selected-light branch proof should only need extension, not replacement

### Done Shape

`Phase 3.1` is done when:

- the selected-light editor tail reads like one continuous styled surface instead of ending in a native-looking block
- shadow-tail controls have the same visible input language as the rest of the migrated selected-light editor
- `Phase 4` can focus only on dedicated `Shadows` section ownership and section-key fallout

Current status:
- `Phase 3.1` is implemented
- the shipped cut stayed fully inside the selected-light editor and kept the same `updateLight(...)` plus `shadowSizes` seams
- `Phase 4 - Dedicated Shadows Section Ownership Cleanup` is now the next internal `Phase 2c` code cut

## [ ] Phase 4 - Dedicated Shadows Section Ownership Cleanup

Purpose:
- give all shadow-facing controls one explicit visible owner after the remaining selected-light tail styling is finished

Owns:
- `17. Dedicated Shadows Section`

Does not own:
- new shadow behavior
- new light types
- new shared state
- leftover shadow-tail style conversion already owned by `Phase 3.1`

This phase should:
- add one top-level `Shadows` section
- move the global shadow control there
- move the already-restyled selected-light shadow controls there
- update tabs and persistence only if the new top-level section key requires it

Exact first code cut:
1. Add the top-level `Shadows` section in the toolbar shell
2. Move the current global and per-light shadow controls into that section without reopening their control treatment
3. Update toolbar section-key and persistence proof if the new section is added to tabs mode

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
