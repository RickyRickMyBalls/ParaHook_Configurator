# Environment Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime

## Doc Header

## Doc History
14. 2026-04-17 09:47:20: Added the standalone future plan doc `Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`, tightening `Environment-1 / Phase 2c` around a visible toolbar organization pass that likely introduces one dedicated `Shadows` section while keeping `Ground` separate and leaving runtime behavior unchanged
13. 2026-04-17 02:14:33: Implemented `Environment-1 / Phase 2d - Ground Plane And Floor Read Lane` as a standalone pass by adding a shared `ground` contract, a dedicated `Ground` View Toolbar section with para-style visibility, height, and material controls, a viewer-owned visible studio floor runtime, and focused toolbar, workspace-persistence, and viewer proof while leaving `Phase 2c` still pending as the next active cleanup cut
12. 2026-04-17 02:03:35: Prepped `Environment-1 / Phase 2d - Ground Plane And Floor Read Lane` for implementation by grounding it in the live `Viewer.ts`, `viewSettingsTypes.ts`, `ViewToolbar.tsx`, `ParaSelect.tsx`, and `ParaSlider.tsx` seams, and locking the first cut to a new visible `Ground` toolbar section with an on or off `ParaSelect`, a raise or lower `ParaSlider`, and a narrow ground-material selection surface
11. 2026-04-17 01:58:40: Updated the `Environment-1` ladder to insert `Phase 2c - Environment Section Organization Pass` as the next narrow View Toolbar organization cut and `Phase 2d - Ground Plane And Floor Read Lane` immediately after it, so environment UI cleanup and ground-runtime work each get their own explicit owner before the preset-truth phase begins
10. 2026-04-17 01:54:21: Implemented `Environment-1 / Phase 2b - Default Lighting Cleanup And Balance Polish` by widening and warming the shipped default key light, slightly strengthening and neutralizing the fill, softening and pushing back the rim, adding focused `Viewer.test.ts` proof for the retuned rig, and advancing the lane to `Phase 3` without reopening backgrounds, grid, preset truth, or UI scope
9. 2026-04-17 01:49:08: Updated the shipped `Environment-1 / Phase 2 - Ship The Default Lighting Baseline Repair` result by restoring the grid opacities to their pre-Phase-2 values on request while keeping the brighter exposure, stronger light rig, original darker backgrounds, and existing no-widening environment seams intact
8. 2026-04-17 01:46:36: Added `Environment-1 / Phase 2b - Default Lighting Cleanup And Balance Polish` as a narrow post-Phase-2 follow-up so the environment lane can do one honest lighting cleanup pass through the existing light rig before widening into preset truth, visible tuning controls, or HDRI/runtime work
7. 2026-04-17 01:40:13: Updated the shipped `Environment-1 / Phase 2 - Ship The Default Lighting Baseline Repair` result by restoring the default and `studio` background colors to their original darker values on request while keeping the brighter exposure, stronger light rig, quieter grid, and existing no-widening environment seams intact
6. 2026-04-17 01:35:54: Implemented `Environment-1 / Phase 2 - Ship The Default Lighting Baseline Repair` by retuning the shipped default exposure, light rig, background, and grid intensity inside the existing `ViewSettings` and `Viewer.ts` seams, adding focused `Viewer.test.ts` proof, and marking `Phase 3` as the next active implementation cut without widening into preset truth, new shared settings, or toolbar growth
5. 2026-04-17 01:24:22: Prepped `Environment-1 / Phase 2 - Ship The Default Lighting Baseline Repair` for implementation by grounding the baseline-repair pass in the live default view-state contract, current `Viewer.ts` background and grid constants, and existing material-apply seam, while locking the no-widening rule that this cut must stay inside default retuning only without new shared settings, preset truth, or toolbar growth
4. 2026-04-17 01:20:19: Implemented `Environment-1 / Phase 1 - Confirm The First Environment Contract And Baseline Target` as a docs-only contract-lock pass by removing stray copy noise, keeping the completed `Phase 1` checklist and boundary rules intact, and explicitly setting `Phase 2` as the next active implementation cut
3. 2026-04-17 00:19:55: Prepped `Environment-1 / Phase 1 - Confirm The First Environment Contract And Baseline Target` for implementation by closing the remaining `Phase 2` boundary ambiguity around grid-intensity reduction, explicitly allowing baseline-only grid runtime retuning in `Viewer.ts` without new shared state or UI growth, and marking the `Phase 1` contract checklist complete
2. 2026-04-16 19:54:14: Prepped `Environment-1 / Phase 1 - Confirm The First Environment Contract And Baseline Target` for implementation by grounding the phase in the live `ViewToolbar.tsx`, `viewSettingsTypes.ts`, `uiPrefsStore.ts`, and `Viewer.ts` seams, locking the exact baseline-read contract and no-widening boundary before later lighting repair, preset, Browser-light, and HDRI-runtime work begins
1. 2026-04-16 19:08:18: Created this standalone future phase doc for `Environment-1`, combining the old baseline-lighting, visible preset-controls, and true HDRI/environment-runtime goals into one implementation-ready lane with an explicit internal phase ladder so the brighter Blender-like viewport target can ship in small honest cuts

## Purpose

This doc locks the first `Environment` phase.

Use it to answer:
- how the first real environment lane should improve the dark default viewport
- how visible environment presets should be introduced
- how Browser-facing light controls should stay downstream from environment-owned light truth
- how true HDRI or environment-light runtime should arrive without pretending it already exists

## Why This Phase Exists

The current environment surface is too thin for the quality bar you want.

Right now the viewer has:
- exposure
- tone mapping
- basic background switching
- direct light editing

But it still does not have:
- a real preset system for environment looks
- Browser-facing light entries for quick readability help
- true HDRI-backed environment lighting

This phase exists to give those first three old environment lanes one clean execution home instead of scattering them across multiple tiny umbrella phases too early.

## Scope

This phase covers:
- default viewport lighting baseline repair
- visible environment preset language and tuning controls
- Browser-facing light management as a downstream control surface if needed
- true environment-light runtime and first HDRI-facing controls

This phase does not cover:
- Photoshop-like post-look grading sliders
- final persistence, recall, or A/B compare workflow polish
- the browseable HDRI catalog itself

## Doc Body

## [ ] Environment-1 - Default Lighting, Presets, And HDRI Runtime

### Header

Purpose:
- make the viewport read much closer to the desired Blender-style studio scene by fixing the baseline lighting, giving the user a real preset surface, and then widening into honest environment-light runtime

Owns:
- brighter default scene readability
- named environment presets
- visible environment tuning controls
- Browser-facing light read or control rows if the model viewport still needs that workflow
- true environment-light contribution and basic HDRI-facing runtime controls

Keeps elsewhere:
- Photoshop-like final image grading
- long-term persistence or compare polish
- browseable HDRI asset-library ownership

### Target Result

At the end of this phase:
- the default viewport no longer crushes dark models into unreadable black
- the environment section has a clear named preset model
- the model viewport can be helped by Browser-visible light controls if that workflow is still needed
- environment lighting is no longer just a background-color trick
- the viewer can use true environment-light contribution with honest tuning seams

### Current Live Read

Current visible owner seam:
- `src/app/components/ViewToolbar.tsx`
  - already exposes:
    - tone mapping
    - exposure
    - one thin `Environment` preset select
    - raw light rows and light editing
  - does not yet expose:
    - a real environment-preset language
    - a compact tuning surface for common studio adjustments
    - Browser-facing light read or control paths

Current shared settings seam:
- `src/shared/viewSettingsTypes.ts`
  - already owns:
    - `toneMapping`
    - `exposure`
    - `envPreset`
    - `lighting.lights`
    - material presets
  - does not yet own:
    - a richer environment-preset contract
    - true environment-light contribution settings
    - HDRI intensity or orientation values

Current runtime seam:
- `src/viewer/Viewer.ts`
  - already applies:
    - renderer tone mapping
    - renderer exposure
    - background color
    - direct light specs
    - material presets
  - does not yet apply:
    - true `scene.environment` style environment-light contribution
    - post-grade controls

Important implementation read:
- the shipped baseline readability repair already lands through the existing light, background, material, and exposure seams
- the later HDRI/runtime work needs a new honest environment-light seam
- Browser-facing light rows must remain downstream from the environment-owned light state

## [x] Phase 1 - Confirm The First Environment Contract And Baseline Target

Purpose:
- lock the exact first environment contract around what the brighter default scene must improve before any runtime widening begins

Owns:
- current dark-scene read confirmation
- the exact Blender-like readability target
- the first settings-contract decisions for baseline lighting versus later preset and HDRI widening

This phase should:
- confirm the current default-lighting shortfalls in the live viewer seams
- lock the baseline target around:
  - brighter midtones
  - neutral dark-gray background
  - better key and fill balance
  - less dominant grid
  - better dark-model separation
- identify which current settings can already support the first pass
- identify the minimum new settings that should not be delayed if the first pass needs them

Does not own:
- visible UI growth yet
- true HDRI runtime yet

Done when:
- the environment baseline target is explicit enough that later implementation can stay narrow

## Implementation Spec

## Code-Backed Read

The current Phase 1 seam is intentionally narrow, but it needs one explicit implementation read before later lighting work starts:

- `src/shared/viewSettingsTypes.ts`
  - already owns the current environment-facing shared state for:
    - `toneMapping`
    - `exposure`
    - `envPreset`
    - `lighting.lights`
    - material presets
  - still models `envPreset` as the thin union:
    - `none`
    - `studio`
  - still ships the dark default baseline:
    - `toneMapping: 'aces'`
    - `exposure: 1`
    - `envPreset: 'none'`
    - one directional `key`
    - one hemisphere `fill`
- `src/app/store/uiPrefsStore.ts`
  - already clones and updates the shared view state
  - already owns the add, update, select, and delete seams for light rows
  - is the current mutation owner that later baseline or preset changes will route through
- `src/app/components/ViewToolbar.tsx`
  - already exposes:
    - tone mapping
    - exposure
    - the `Environment` preset select
    - raw light rows and light editing
  - currently keeps the environment surface thin:
    - one preset select
    - then direct light rows
  - does not yet expose a compact baseline-focused scene-tuning surface
- `src/viewer/Viewer.ts`
  - currently applies:
    - renderer tone mapping
    - renderer exposure
    - background color
    - direct light specs
    - material presets
  - still owns the current grid-visual tuning at runtime:
    - grid visibility comes from shared view state
    - grid opacity and line-strength tuning are still hardcoded in `Viewer.ts`
  - still treats environment preset mostly as background choice:
    - `studio` switches the background color
    - there is no true environment-light contribution yet

Main implication:
- `Phase 1` should not try to fix the scene yet
- it should lock the current contract and exactly name which current seams are sufficient for `Phase 2` baseline repair and which gaps must stay deferred to later phases
- it should make the grid rule explicit so `Phase 2` can reduce grid dominance without pretending that a new shared environment setting is required first

## First Pass Decisions

- keep `Phase 1` as a contract-and-baseline-read pass only
- do not widen this phase into immediate lighting retuning, preset expansion, or HDRI runtime work
- treat the current environment owner split as:
  - `viewSettingsTypes.ts` = shared environment state contract
  - `uiPrefsStore.ts` = state mutation owner
  - `ViewToolbar.tsx` = visible control owner
  - `Viewer.ts` = runtime apply owner
- lock the baseline target around the current observed failures:
  - scene too dark in the midtones
  - background too close to black
  - insufficient fill and rim separation for dark models
  - grid reading louder than the model in dark scenes
- lock the current environment limitation explicitly:
  - `envPreset` is not yet true environment lighting
  - it is currently a thin background-state choice layered on top of direct lights
- lock the current grid ownership explicitly:
  - `gridVisible` is already shared view state
  - grid intensity reduction for `Phase 2` is allowed as a narrow runtime retune inside `Viewer.ts`
  - `Phase 2` must not add new shared grid settings or new toolbar controls just to reduce default grid dominance
- keep Browser-facing light rows out of `Phase 1`
  - this pass may name them as later workflow need
  - but it should not yet decide Browser UI shape beyond the downstream-owner rule

## Exact First Code Cut

The implementation-ready first cut is:

1. Re-read and confirm the live environment seams in:
   - `src/shared/viewSettingsTypes.ts`
   - `src/app/store/uiPrefsStore.ts`
   - `src/app/components/ViewToolbar.tsx`
   - `src/viewer/Viewer.ts`
2. Add one narrow implementation-ready contract read inside this doc that explicitly records:
   - the shipped default environment state
   - the current preset limitation
   - the exact baseline visual failures the next pass must repair
3. Lock the `Phase 2` implementation boundary so it can use only the existing baseline-ready seams:
   - exposure
   - background color or preset
   - light defaults
   - grid runtime tuning inside `Viewer.ts` only
   - material defaults if needed for scene readability
4. Explicitly defer from `Phase 1`:
   - new visible controls
   - Browser light surfaces
   - true environment-light runtime
   - post-look grading

## Likely Files

- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`
- optional code-read targets for confirmation only:
  - `src/shared/viewSettingsTypes.ts`
  - `src/app/store/uiPrefsStore.ts`
  - `src/app/components/ViewToolbar.tsx`
  - `src/viewer/Viewer.ts`

## No-Widening Rule

- do not change the shipped lighting defaults in `Phase 1`
- do not add new environment presets in `Phase 1`
- do not add new toolbar controls in `Phase 1`
- do not add Browser-facing light rows in `Phase 1`
- do not add true HDRI or environment-light runtime in `Phase 1`
- do not widen this contract pass into Photoshop-like grading planning beyond explicitly deferring it

## Implementation Risks

- blurring the contract read and the actual baseline repair into one mixed pass
- silently treating the current `envPreset` background toggle as if it already means true environment lighting
- under-specifying the baseline target so `Phase 2` widens into generic scene polish instead of a narrow readability repair
- letting Browser-facing light workflow questions leak into the baseline contract before the default scene itself is fixed

## Checklist

- [x] confirm the live shared environment state seam in `viewSettingsTypes.ts`
- [x] confirm the live mutation seam in `uiPrefsStore.ts`
- [x] confirm the live visible control seam in `ViewToolbar.tsx`
- [x] confirm the live runtime apply seam in `Viewer.ts`
- [x] lock the exact current baseline-read failures for the dark viewport
- [x] lock the explicit rule that `envPreset` is not yet true environment lighting
- [x] lock the exact `Phase 2` boundary around baseline readability repair only
- [x] keep all later preset, Browser, HDRI-runtime, and grading work deferred

## Verification Shape

Minimum verification for this phase should cover:

- the doc accurately reflects the currently shipped environment state contract
- the doc explicitly names the default baseline values and current environment-owner seams
- the doc clearly distinguishes:
  - direct-light baseline repair
  - later preset work
  - later Browser light workflow
  - later true environment-light runtime
  - later Photoshop-like grading
- `Phase 2` can be started from this doc without reopening what the baseline target actually is

## Done Shape

`Phase 1` is done when:

- the current environment contract is named clearly enough that later passes do not need to rediscover it
- the exact visual failures of the current dark viewport are explicitly locked
- the next implementation pass can target default readability repair without drifting into presets, Browser workflow, or HDRI runtime too early
- grid-dominance reduction is explicitly allowed as a narrow `Viewer.ts` runtime retune during `Phase 2` instead of reopening the contract for new shared settings

Current status:
- `Phase 1` is implemented as a docs-only contract-lock pass
- the next active implementation cut is `Phase 2 - Ship The Default Lighting Baseline Repair`

## [x] Phase 2 - Ship The Default Lighting Baseline Repair

Purpose:
- make the out-of-box viewport look materially better before the user touches anything

Owns:
- default background improvement
- exposure baseline tuning
- default light-balance repair
- grid-intensity reduction
- first dark-material readability support where needed

This phase should:
- brighten the default scene without flattening it into gray mush
- move the background away from near-black toward a better neutral dark gray
- reduce the grid's visual dominance
- improve the default light rig so dark models get stronger readable fill
- add first rim or separation help if needed

Does not own:
- preset switching
- Browser light rows
- HDRI runtime

Done when:
- the default viewport reads clearly enough that the model is more important than the grid or background

### Implementation Spec

### Code-Backed Read

The current `Phase 2` seam is intentionally narrow and should stay grounded in the already-shipped default state plus the existing viewer runtime constants:

- `src/shared/viewSettingsTypes.ts`
  - currently ships the default environment baseline as:
    - `toneMapping: 'aces'`
    - `exposure: 1`
    - `envPreset: 'none'`
    - default `lighting.lights` = one directional `key` plus one hemisphere `fill`
    - default selected material preset = `default_matte`
  - currently ships the default material preset set as:
    - `default_matte`
    - `studio_plastic`
    - `brushed_metal`
    - `highlight_gloss`
  - already has enough shared state for baseline repair without adding fields:
    - exposure
    - `envPreset`
    - `lighting.lights`
    - material presets
- `src/app/store/uiPrefsStore.ts`
  - still clones `DEFAULT_VIEW_SETTINGS` into the live UI view state
  - already routes baseline retunes automatically once the shared defaults change
  - does not need new mutation APIs for this phase as long as the state shape stays the same
- `src/viewer/Viewer.ts`
  - still owns the currently dark background baseline constants:
    - `DEFAULT_BACKGROUND = '#0b0b0f'`
    - `STUDIO_BACKGROUND = '#151922'`
  - still owns the currently loud grid constants:
    - minor grid opacity `0.1`
    - major grid opacity `0.3`
    - double-major grid opacity `1`
  - already applies the baseline-ready runtime seams:
    - `renderer.toneMappingExposure = settings.exposure`
    - `scene.background` from `envPreset`
    - `applyLights(settings.lighting.lights)`
    - `applyMaterialSettings(settings.materials)`
  - already applies material preset changes through the existing `MeshStandardMaterial` path
- `src/app/components/ViewToolbar.tsx`
  - already exposes the existing controls needed to prove the baseline repair stays inside current seams:
    - exposure
    - `Environment` preset select
    - raw light rows
    - material preset editor
  - should not gain new UI in this phase

Main implication:
- `Phase 2` should repair the shipped default scene by retuning existing defaults and existing viewer runtime constants only
- `Phase 2` should not introduce a richer environment contract just to make the scene brighter
- material help is allowed only as a narrow support seam after background, exposure, light balance, and grid dominance have been corrected first

### First Pass Decisions

- keep `Phase 2` as a baseline-repair pass only
- keep the shared environment state shape unchanged in this phase
- keep the default preset contract unchanged in this phase:
  - do not add new `envPreset` values
  - do not treat `studio` as newly-real preset truth yet
- prefer the baseline repair order as:
  - background and exposure retune first
  - default light rig rebalance second
  - grid dominance reduction third
  - default-material readability help only if the scene still reads too dark after the earlier tuning
- keep the default environment entrypoint honest:
  - prefer retuning the `'none'` baseline instead of changing the default startup state to pretend a richer preset model already exists
- keep the default material entrypoint honest:
  - if readability support is needed, retune `default_matte`
  - do not switch startup to a different existing material preset just to hide lighting problems
- allow one narrow default separation-light addition only if the existing key/fill pair cannot achieve the target read
  - any added light must still use the existing `LightSpec` model and existing raw light-row UI
  - this is still baseline repair, not preset expansion

### Exact First Code Cut

The implementation-ready first cut is:

1. Retune the shared default baseline in `src/shared/viewSettingsTypes.ts` only through existing fields:
   - exposure
   - default light intensities and positions
   - optional one-light separation addition if needed
   - default material preset values only if needed after light and background retuning
2. Retune the viewer-only baseline constants in `src/viewer/Viewer.ts` only through existing runtime seams:
   - `DEFAULT_BACKGROUND`
   - grid layer opacities
3. Keep the startup default contract structurally unchanged:
   - keep `envPreset` inside the current thin union
   - keep the existing toolbar and store APIs unchanged
   - keep `scene.background` on the current background-selection path
4. Add focused proof that the repair stayed narrow:
   - the default viewport is brighter and less crushed
   - the grid is quieter
   - dark models separate from the background more clearly
   - the existing `Environment` section still shows the same control surface, with only the default light rows reflecting any baseline rig change

### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- optional proof-only reads:
  - `src/app/store/uiPrefsStore.ts`
  - `src/app/components/ViewToolbar.tsx`
  - `src/app/components/ViewToolbar.test.tsx`
- docs update target after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add new `ViewSettings` fields in `Phase 2`
- do not add new environment presets in `Phase 2`
- do not add a new compact environment tuning surface in `Phase 2`
- do not add Browser-facing light rows in `Phase 2`
- do not add true environment-light runtime in `Phase 2`
- do not add post-grade controls in `Phase 2`
- do not switch the startup environment to fake preset truth by introducing new `envPreset` meaning early
- do not use a startup material-preset swap as the main fix for a dark scene that should be solved through baseline lighting first

### Implementation Risks

- over-brightening the viewport into flat gray instead of keeping readable contrast
- solving the scene mainly by switching materials instead of repairing the default light and background balance
- letting a new third light become an uncontrolled preset-expansion step instead of a narrow baseline-readability fix
- changing startup preset meaning in a way that makes `Phase 3` redundant or confusing
- reducing grid dominance by inventing a new setting instead of staying inside the allowed `Viewer.ts` runtime retune seam

### Checklist

- [x] lock the current default background, light, grid, and material baseline in code-backed terms
- [x] lock the rule that `Phase 2` must stay inside existing shared state and existing runtime seams
- [x] lock the preferred repair order so material help stays downstream from lighting and background repair
- [x] lock the rule that default preset truth and visible UI growth stay deferred to later phases
- [x] name the likely implementation and verification files for the first cut

### Verification Shape

Minimum verification for this phase should cover:

- shared defaults still use the same `ViewSettings` shape
- the viewer still applies baseline scene state through the same runtime seams:
  - exposure
  - background selection
  - direct lights
  - material presets
- the default viewport reads brighter and clearer in manual proof without adding new controls
- the grid is visibly less dominant while still remaining available through the existing `gridVisible` toggle
- if a new default separation light is added, it appears through the existing raw light-row surface without any UI expansion
- focused automated proof should land in `src/viewer/Viewer.test.ts` where practical, with `ViewToolbar` proof only if the changed default light count needs explicit regression coverage

### Done Shape

`Phase 2` is done when:

- the shipped default scene is materially easier to read before any user edits
- the startup background is no longer near-black
- default light balance gives dark models clearer readable separation
- the grid no longer competes with the model as the loudest visual element
- any default-material support stays narrow and clearly secondary to the lighting repair
- the implementation remains inside the existing state model, toolbar surface, and viewer runtime seams

Current status:
- `Phase 2` is implemented as a narrow default-retuning pass
- the brighter exposure and stronger light rig remain shipped
- the default background colors were later restored to their original darker values on request
- the grid opacities were later restored to their original pre-Phase-2 values on request
- the next active implementation cut is `Phase 2c - Environment Section Organization Pass`

## [x] Phase 2b - Default Lighting Cleanup And Balance Polish

Purpose:
- do one narrow cleanup pass on the shipped default light rig so the environment baseline reads cleaner before the lane widens into preset truth

Owns:
- cleanup tuning for the shipped key, fill, and rim light relationship
- cleaner default light color balance if needed
- cleanup tuning for light positions, targets, and intensities inside the existing light model
- small shadow-readability cleanup only if it is directly tied to the default light rig

This phase should:
- tighten the shipped Phase 2 rig so it feels more intentional and less like a first-pass rescue
- improve how the key, fill, and rim lights work together on dark models
- reduce any remaining muddy or over-obvious separation-light behavior
- keep the default environment read cleaner without reopening the background or preset contract

Does not own:
- new shared environment fields
- new environment presets
- visible environment UI growth
- Browser light rows
- HDRI runtime

Done when:
- the default light rig feels cleaner and more balanced while still staying inside the existing baseline seams

Current status:
- `Phase 2b` is implemented as a narrow lighting-only cleanup pass
- the shipped default rig now uses:
  - a warmer, wider, slightly higher `key`
  - a slightly stronger but more neutral `fill`
  - a softer, less aggressive `rim` pushed farther off-axis for large dark models
- the original darker backgrounds and original pre-Phase-2 grid opacities remain unchanged in this follow-up
- the next active implementation cut is `Phase 2c - Environment Section Organization Pass`

### Implementation Spec

### Code-Backed Read

The current `Phase 2b` seam should stay even narrower than `Phase 2` and focus on the already-shipped default light rig:

- `src/shared/viewSettingsTypes.ts`
  - now owns the shipped default baseline light truth:
    - brighter `exposure`
    - stronger `key`
    - stronger `fill`
    - one shipped `rim` light
  - already exposes every seam this cleanup pass needs:
    - light intensities
    - light colors
    - light positions
    - light targets
    - existing shadow flags
- `src/viewer/Viewer.ts`
  - already applies all light cleanup changes through the current direct-light path:
    - `applyLights(settings.lighting.lights)`
    - `applySpecToLight(...)`
  - should not gain a second lighting-owner seam in this phase
- `src/app/components/ViewToolbar.tsx`
  - already shows the raw light rows that reflect the shipped default rig
  - should remain unchanged in this phase

Main implication:
- `Phase 2b` is for cleaning up the shipped default rig, not for widening the environment model
- if the current readability win feels slightly rough, this is the place to refine it before `Phase 3` turns lighting into named preset truth

### First Pass Decisions

- keep `Phase 2b` lighting-only
- prefer tuning in this order:
  - key and fill balance first
  - rim-light cleanup second
  - shadow-readability cleanup only if directly needed
- keep the background constants unchanged in this phase unless a lighting adjustment proves impossible without them
- do not add or remove environment presets in this phase
- do not add a fourth default light unless the current three-light rig clearly cannot be cleaned up through tuning alone
- prefer reducing awkwardness over chasing another dramatic brightness jump

### Exact First Code Cut

The implementation-ready first cut is:

1. Re-read the shipped default light rig in `src/shared/viewSettingsTypes.ts`
2. Retune only the existing default light entries where needed:
   - intensity
   - color
   - position
   - target
   - shadow flags or bias only if directly needed
3. Keep `Viewer.ts` on the same existing light-apply runtime path
4. Add focused proof only if the cleanup changes alter default light count, default IDs, or a directly testable runtime expectation

### Likely Files

- `src/shared/viewSettingsTypes.ts`
- optional proof:
  - `src/viewer/Viewer.test.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add new `ViewSettings` fields in `Phase 2b`
- do not add new environment presets in `Phase 2b`
- do not add new toolbar controls in `Phase 2b`
- do not widen this cleanup into Browser or HDRI/runtime work
- do not use `Phase 2b` to quietly start preset-truth mapping early

### Implementation Risks

- turning a cleanup pass into a second broad baseline rewrite
- chasing subjective polish without locking a concrete lighting issue first
- widening into preset semantics instead of keeping this pass on default-rig cleanup only
- adding more default lights when the real need is tuning the existing ones

### Checklist

- [x] define `Phase 2b` as a narrow follow-up after the shipped Phase 2 baseline repair
- [x] lock `Phase 2b` to existing light-rig seams only
- [x] defer preset truth, visible UI, Browser, and HDRI/runtime work out of this follow-up
- [x] make `Phase 2b` the next active implementation cut

### Verification Shape

Minimum verification for this phase should cover:

- the cleanup stays inside the existing default light model
- the raw light-row surface remains the same
- the default rig reads cleaner without reopening the broader environment contract

### Done Shape

`Phase 2b` is done when:

- the shipped default rig feels cleaner and more balanced than the first Phase 2 pass
- the cleanup remains clearly lighting-focused
- `Phase 3` can start from a more intentional default rig instead of a rough first rescue pass

## [ ] Phase 2c - Environment Section Organization Pass

Current source doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`

Purpose:
- reorganize the current `Environment` section in the View Toolbar so the existing controls read like one intentional surface before new environment runtime features are added

Owns:
- control grouping and ordering inside the current `Environment` section
- clearer separation between baseline scene controls and raw per-light editing
- environment-section wording and structure cleanup in the current toolbar surface

This phase should:
- make the current `Environment` section easier to scan and understand without adding new environment behavior
- give the existing background, exposure, preset, shadow, grid, and light rows a cleaner information hierarchy
- prepare the section so later preset truth, ground-plane controls, and HDRI/runtime work can land on a more stable visible surface

Does not own:
- new environment runtime behavior
- new shared environment fields
- preset-truth expansion
- ground-plane rendering
- Browser light rows

Done when:
- the current `Environment` section feels cleaner and more intentional while still exposing the same underlying behavior

### Implementation Spec

### Code-Backed Read

The current `Phase 2c` seam is a visible-organization pass only:

- `src/app/components/ViewToolbar.tsx`
  - already owns the visible `Environment` section
  - currently mixes the thin preset row, baseline scene toggles, and raw light rows into one relatively flat surface
  - is the primary owner for this pass
- `src/shared/viewSettingsTypes.ts`
  - should remain structurally unchanged in this phase
- `src/viewer/Viewer.ts`
  - should remain behaviorally unchanged in this phase unless a tiny naming or hook-up cleanup is required to support the same visible organization

Main implication:
- `Phase 2c` is about making the existing environment controls read better, not about introducing a new environment feature

### First Pass Decisions

- keep `Phase 2c` presentation-first
- prefer grouping in this order:
  - baseline scene controls
  - preset-facing controls
  - raw light rows
- keep the same current environment behavior and state model underneath the reorganized section
- do not quietly fold the ground-plane idea into this pass

### Exact First Code Cut

The implementation-ready first cut is:

1. Re-read the current `Environment` section structure in `src/app/components/ViewToolbar.tsx`
2. Reorganize the existing rows so the section reads more clearly without changing the current shared contract
3. Keep the current control set honest:
   - no new environment state fields
   - no new runtime features
   - no preset-truth widening yet
4. Add focused `ViewToolbar` proof only where the organization pass changes a meaningful visible grouping or ordering contract

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- optional proof:
  - `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not add new `ViewSettings` fields in `Phase 2c`
- do not add a ground plane in `Phase 2c`
- do not add new environment presets in `Phase 2c`
- do not widen this pass into HDRI/runtime work
- do not use organization cleanup as a pretext for silent behavior changes

### Implementation Risks

- turning a UI-organization pass into a hidden behavior pass
- reorganizing the section in a way that makes the later ground or preset lanes harder to place
- over-designing the control surface before the real preset model exists

### Checklist

- [x] add a narrow owner for environment-section organization before new ground runtime work
- [x] lock `Phase 2c` to current `ViewToolbar` structure and wording cleanup only
- [x] defer ground, preset-truth, Browser, and HDRI/runtime work out of this pass
- [x] make `Phase 2c` the next active implementation cut

### Verification Shape

Minimum verification for this phase should cover:

- the `Environment` section remains on the same state and runtime seams
- the visible grouping is cleaner without introducing new environment behavior
- any proof added is focused on the visible toolbar contract, not viewer runtime changes

### Done Shape

`Phase 2c` is done when:

- the `Environment` section is easier to scan and understand than the current flat layout
- the current controls still drive the same behavior they did before
- `Phase 2d` can add the ground lane on top of a cleaner visible surface

## [x] Phase 2d - Ground Plane And Floor Read Lane

Purpose:
- add the first honest ground or floor read for the environment lane so models can sit in a more legible studio space than grid-only world zero, and expose that floor through one dedicated `Ground` section in the View Toolbar

Owns:
- the first viewer-owned ground-plane runtime
- one dedicated `Ground` section in the View Toolbar
- the first explicit ground control contract:
  - on or off
  - raise or lower
  - ground material selection
- the ownership boundary between the existing grid and the new ground surface

This phase should:
- decide the smallest honest first ground behavior for the viewer
- improve object grounding and shadow read without widening straight into full environment preset or HDRI work
- keep the ground lane explicit instead of hiding it inside a broader preset or toolbar cleanup pass
- make the first `Ground` section feel like a dedicated tool surface instead of burying floor controls inside `Environment`

Does not own:
- full preset-truth mapping
- HDRI runtime
- Browser light rows
- post-look grading

Done when:
- the viewer has an explicit first ground or floor read that improves scene grounding without pretending the environment model is already complete

### Implementation Spec

### Code-Backed Read

The current `Phase 2d` seam should stay grounded in the existing viewer runtime and current toolbar/control seams:

- `src/viewer/Viewer.ts`
  - already owns the grid runtime at world zero
  - already owns shadow-enabled model rendering
  - is the natural owner for a first ground-plane or floor mesh
- `src/shared/viewSettingsTypes.ts`
  - currently has no explicit ground-plane contract
  - now needs one narrow shared `ground` state owner because this cut explicitly exposes user-facing toolbar controls for:
    - on or off state
    - height or vertical offset
    - ground material selection
- `src/app/components/ViewToolbar.tsx`
  - already imports and uses both `ParaSelect` and `ParaSlider`
  - currently has no dedicated `Ground` section
  - is the visible owner for the new section this phase introduces
- `src/app/components/ParaSelect.tsx`
  - already provides the correct para-style select control shape for:
    - on or off
    - ground material selection
- `src/app/components/ParaSlider.tsx`
  - already provides the correct para-style slider surface for:
    - raise or lower ground height

Main implication:
- `Phase 2d` should no longer be treated as a hidden viewer-only default
- this cut now explicitly owns both:
  - the first ground-plane runtime
  - the first visible `Ground` toolbar section that drives it through shared view state

### First Pass Decisions

- keep `Phase 2d` honest about what kind of ground read it is shipping
- ship `Ground` as a separate View Toolbar section instead of adding these controls under `Environment`
- use one `ParaSelect` for ground visibility with the narrow first contract:
  - `Off`
  - `On`
- use one `ParaSlider` for vertical offset so the ground can be raised or lowered relative to world zero
- use one narrow ground-material control surface for the first cut
  - prefer a dedicated ground-material preset select over a full editable material editor
  - do not reuse the model-material preset editor as the ground owner
- explicitly define the relationship between:
  - grid
  - shadows
  - ground-plane visibility
- do not widen the first ground cut into a full environment-preset or HDRI pass
- keep the first ground-material contract narrow and fixed enough that the floor stays a viewer-presentational surface rather than becoming a second authored material system

### Exact First Code Cut

The implementation-ready first cut is:

1. Add one narrow shared `ground` contract in `src/shared/viewSettingsTypes.ts` for:
   - visibility or mode
   - vertical offset
   - ground material preset id
2. Add one dedicated `Ground` section in `src/app/components/ViewToolbar.tsx` using:
   - `ParaSelect` for on or off
   - `ParaSlider` for raise or lower
   - `ParaSelect` for material
3. Implement the ground-plane runtime in `src/viewer/Viewer.ts` through one honest floor mesh seam driven by the shared `ground` state
4. Add focused proof for:
   - shared ground defaults
   - toolbar control wiring
   - viewer runtime application of visibility, height, and material selection

### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/viewer/Viewer.ts`
- focused proof:
  - `src/viewer/Viewer.test.ts`
  - `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

### No-Widening Rule

- do not use `Phase 2d` to quietly start preset truth
- do not bundle HDRI runtime into the ground lane
- do not widen into full environment-surface redesign
- do not add multiple competing floor systems
- do not turn `Phase 2d` into a full authored material editor for the ground plane
- do not make the new `Ground` section a catch-all owner for unrelated environment controls

### Implementation Risks

- tying the first ground behavior too tightly to one model size or one import shape
- making the ground visually heavier than the model
- making the ground-material control too broad and accidentally creating a second material-authoring lane
- placing the new `Ground` section in a way that conflicts with the `Phase 2c` toolbar-organization pass instead of layering on top of it cleanly

### Checklist

- [x] add a dedicated ground-lane owner after the environment-section organization pass
- [x] lock the first ground cut to a dedicated `Ground` section with:
  - on or off control
  - raise or lower control
  - ground material control
- [x] ground the visible control surface in the live `ParaSelect` and `ParaSlider` seams
- [x] keep preset-truth, Browser, and HDRI/runtime widening deferred out of this lane
- [x] place `Phase 2d` before the preset-truth phase

### Verification Shape

Minimum verification for this phase should cover:

- the new `Ground` section renders through the shared para-style controls
- the shared `ground` state stays narrow and explicit
- the chosen ground read lands through one honest runtime seam
- the relationship between grid, shadows, ground visibility, ground height, and ground material is explicit

### Done Shape

`Phase 2d` is done when:

- models feel more grounded in the default viewer scene than they do with grid-only world zero
- the user can explicitly:
  - turn ground on or off
  - raise or lower the ground plane
  - choose a ground material
- the first ground behavior is explicit and testable
- `Phase 3` can widen into preset truth without having to rediscover basic floor ownership

Current status:
- `Phase 2d` is implemented as a standalone dedicated ground-lane pass
- `Phase 2c` remains the next active implementation cut
- the standalone implementation-planning home for `Phase 2c` now lives at:
  - `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`
- the shipped first cut now includes:
  - a shared `ground` state contract
  - a new `Ground` toolbar section
  - one `ParaSelect` visibility control
  - one `ParaSlider` height control
  - one narrow ground-material preset control
  - one viewer-owned visible studio floor that receives shadows without replacing the grid

## [ ] Phase 3 - Add Named Environment Presets And Preset Truth

Purpose:
- replace the thin current environment read with a real preset model

Owns:
- named preset language
- preset-to-light-rig mapping
- the contract between default scene state and authored preset state

This phase should:
- define the first honest preset set such as:
  - `Neutral`
  - `Studio`
  - `Dark Studio`
- map each preset to explicit lighting and background behavior
- keep the preset truth in environment-owned state rather than scattering it through toolbar-only assumptions

Does not own:
- Browser light surfaces
- HDRI runtime
- post-look grading

Done when:
- environment presets are real named scene states instead of only background labels

## [ ] Phase 4 - Add The Visible Environment Tuning Surface

Purpose:
- make the environment section a practical everyday control surface rather than a thin advanced-only light editor

Owns:
- clearer environment-section control grouping
- quick studio-tuning sliders
- the visible contract for editing presets versus editing the current scene

This phase should:
- add practical visible controls for common scene tuning such as:
  - exposure
  - background brightness
  - light-balance or environment brightness style controls
- keep raw low-level light editing available where needed without making it the only workflow
- make the environment section feel intentional and legible

Does not own:
- Browser light rows yet
- HDRI runtime yet

Done when:
- the user can tune the scene meaningfully without diving into raw light rows for every small change

## [ ] Phase 5 - Add Browser-Facing Light Entries As A Downstream Surface

Purpose:
- give users a Browser-visible way to manage helpful scene lights for model-viewport readability if that workflow still proves valuable after the earlier baseline and preset work

Owns:
- Browser-facing light entries or quick light actions
- the rule that Browser only reads or controls environment-owned light truth

This phase should:
- decide the smallest honest Browser surface for light visibility or management
- keep that surface downstream from the environment-owned state
- help users read objects in the model viewport more easily when working through Browser-heavy flows

Does not own:
- the main light-truth data model
- a second Browser-local lighting system
- HDRI runtime

Done when:
- Browser can help with light readability without becoming a second hidden lighting owner

## [ ] Phase 6 - Add True Environment-Light Runtime

Purpose:
- move beyond background-color-only environment behavior into real environment-light contribution

Owns:
- the first honest environment-light runtime seam
- environment-light contribution separate from direct lights
- the split between background look and light contribution

This phase should:
- add true environment lighting to the viewer runtime
- keep the environment-light seam explicit and distinct from direct lights
- preserve compatibility with the earlier preset model

Does not own:
- browseable HDRI library selection
- later post-grade sliders

Done when:
- environment changes can affect model lighting directly instead of only changing the background

## [ ] Phase 7 - Add HDRI Intensity And Background-Versus-Lighting Separation

Purpose:
- make the new environment-light runtime practically controllable

Owns:
- environment intensity
- background-versus-light contribution separation
- first honest apply or tune controls once an environment is already chosen

This phase should:
- expose intensity for environment-light contribution
- let the user control whether the background appearance and the lighting contribution move together or stay distinct where appropriate
- keep the visible controls grounded in the environment surface rather than in debug-only runtime toggles

Does not own:
- HDRI browsing catalog
- orientation controls if they are not yet needed

Done when:
- the environment-light runtime is visibly tunable and not locked to one hardcoded look

## [ ] Phase 8 - Add Basic HDRI Orientation And Final Proof

Purpose:
- finish the first environment-runtime lane with the minimum remaining practical controls and focused proof

Owns:
- optional HDRI or environment rotation or orientation control
- focused cleanup
- end-to-end proof that the combined environment lane is honest

This phase should:
- add basic environment orientation control if the runtime needs it to make presets useful
- tighten proof around:
  - default lighting baseline
  - preset truth
  - visible tuning controls
  - Browser-facing light surface
  - true environment-light runtime
- stop before post-look grading or persistence widening

Does not own:
- Photoshop-like sliders
- persistence or compare workflow polish

Done when:
- the whole old `Environment-1` through `Environment-3` target is achieved through one finished first lane

## Summary

Recommended implementation order:
- `Phase 1` lock the first environment contract
- `Phase 2` fix the dark default viewport
- `Phase 2b` clean up the shipped default light rig
- `Phase 3` establish real preset truth
- `Phase 4` add the practical tuning surface
- `Phase 5` add Browser-facing light entries if still needed
- `Phase 6` add true environment-light runtime
- `Phase 7` make that runtime tunable
- `Phase 8` close with orientation and proof

Guardrail:
- keep this entire lane focused on default lighting, presets, Browser light controls, and true HDRI or environment runtime
- do not widen this phase into Photoshop-like grading or long-term persistence polish
