# Environment Index

## Doc Header

### Doc History
7. 2026-04-17 15:35:10: Updated this environment-family index to check off the top-level `Environment-1` wishlist items that are now honestly shipped, and refreshed the current reality read so the umbrella checklist matches the landed brighter baseline-lighting work plus the still-open preset, Browser-light, HDRI, and grading follow-ons
6. 2026-04-17 10:04:20: Updated this environment-family index so the active follow-on `Environment-1 / Phase 2c` pointer now reflects the new standalone wishlist-tracking doc shape, including its small internal phase ladder for para-style environment control migration, dedicated `Shadows` section work, and final visible ordering cleanup
5. 2026-04-17 09:47:20: Added the standalone future plan doc `Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md` and refreshed this environment-family index so the next active cleanup cut now has its own explicit planning home around visible toolbar organization, likely including a dedicated `Shadows` section, instead of staying embedded only inside the larger `Environment-1` ladder
4. 2026-04-16 19:08:18: Collapsed the old five-phase environment ladder into two larger family phases, added the new standalone future doc `Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`, and rewrote the wishlist mapping plus phase summary so the first environment lane now covers the old baseline-lighting, visible-preset, Browser-light-control, and true HDRI/runtime work while the second lane stays focused on Photoshop-like grading plus persistence and workflow polish
3. 2026-04-16 19:01:10: Added a new environment-family wishlist item for Browser-facing light control so users can turn on or manage helpful scene lights while reading objects in the model viewport, and tightened the ownership notes so any later Browser surface remains a downstream control or read surface over environment-owned light truth instead of becoming a second hidden light owner
2. 2026-04-16 18:56:41: Expanded this index into a real environment-family planning surface by adding a dedicated wishlist mapping plus the first five-phase ladder, organizing the desired brighter Blender-like viewport look around default-lighting baseline repair, preset truth, real HDRI/environment runtime, later Photoshop-like grading controls, and final persistence or compare polish instead of leaving `Environment` as only a thin folder pointer
1. 2026-04-16 18:43:12: Added this umbrella index for the new `Environment` subfamily under `View-Toolbar/Environment/`, locking one dedicated planning home for viewport lighting, scene atmosphere, environment presets, and later HDRI-facing control direction while keeping renderer plumbing and asset-library ownership in their own canonical families

### Purpose

This file is the umbrella planning index for the `Environment` subfamily under `View-Toolbar`.

Use it to answer:
- what the `Environment` subfamily is supposed to own
- how lighting, atmosphere, and environment-preset docs should be organized
- what should stay in visible environment controls versus renderer/runtime seams
- where later standalone environment phase docs should branch

### Scope Note

This doc is intentionally about the `Environment` subfamily only.

It is mainly about:
- visible viewport lighting controls
- scene-atmosphere presets and environment variants
- exposure, tone-mapping, and environment-selection direction
- the user-facing environment surface inside the `View` toolbar

It is not the main home for:
- low-level renderer implementation details
- asset-library browsing for HDRIs or environment packs
- material-authoring direction
- broader model-viewport runtime ownership

Those still belong in their own canonical docs.

## Doc Body

### Short Version

The `Environment` subfamily should become the forward planning home for viewport lighting and scene-atmosphere behavior that the user can see and control directly.

That means:
- default lighting rigs
- key, fill, rim, and shadow-preset direction
- environment preset behavior such as `Studio`, `Dark`, `Neutral`, or later richer scene variants
- visible exposure and tone-mapping controls when they belong to the environment surface

It should not become:
- a hidden second owner for renderer internals
- the asset-library owner for HDRI packs
- a grab bag for all material or viewport-runtime work

### Why This Doc Exists

The repo now has a visible `Environment` section in the `View` toolbar, plus a growing need for better default lighting, scene readability, and later richer preset behavior.

What was missing was one simple planning home that answers:
- what environment controls belong in the visible toolbar
- how lighting rigs and preset behavior should evolve
- where HDRI-backed environment behavior should connect without making `Catalog` or renderer code the wrong owner

This doc exists to give that environment-facing work one clean family home under `View-Toolbar`.

### Family Structure

Use this folder like this:

- `Environment-Index.md`
  - umbrella environment-family index
  - ownership summary
  - future environment-doc landing surface
- `Future/`
  - later standalone environment execution/planning docs when individual environment lanes become implementation-ready
  - `Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`
  - `Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`
- `Shipped/`
  - shipped records for completed environment-family cuts

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Environment`
  - visible environment and lighting controls in the `View` toolbar
  - scene-atmosphere preset behavior
  - user-facing exposure, tone-mapping, and lighting-rig direction
- `Catalog`
  - browseable HDRI or environment-pack assets
  - reusable curated environment families that the user can choose from
- `Browser`
  - optional read or control surfaces for scene lights if users later need Browser-visible light entries to help read model content in the viewport
  - must remain a downstream surface over environment-owned light state rather than becoming a separate light owner
- `Model-Viewport`
  - renderer/runtime seams that make environment changes visible in the viewport
  - shared viewport behavior once the chosen environment state is applied
- `Materials`
  - material-preset authorship and per-part material behavior
- `Camera-Controls`
  - camera movement, gesture ownership, and navigation behavior

Important rule:
- do not let `Environment` quietly absorb renderer-runtime ownership just because environment controls affect the viewport
- do not let `Catalog` become the owner of active environment state after the user has chosen an environment
- do not let `Browser` become a second hidden source of truth for light rigs if it later gains light rows or quick light actions

### Core Direction

The first `Environment` planning read should stay tightly focused on the visible viewport environment surface.

Good first-family ownership:
- default scene lighting quality
- better default key and fill balance
- later rim or accent-light direction
- environment preset naming and behavior
- tone-mapping and exposure controls that belong to visible view state
- eventual HDRI-selection affordances once the runtime can support them honestly

Bad first-family ownership:
- inventing renderer-only complexity with no visible user-facing control surface
- burying environment behavior inside ad hoc debug toggles
- mixing environment-state ownership with asset-library browsing or material editing

### Current Reality Read

Current shipped viewer truth is no longer only the original thin baseline:
- tone mapping and exposure already exist
- one simple `Environment` preset surface already exists
- direct light editing already exists
- material presets already exist
- the default viewer baseline now ships with brighter exposure plus stronger key, fill, and rim separation than the original dark scene
- the first dedicated `Ground` section and floor runtime already exist
- the visible environment-facing controls have already started moving onto the para-style surface through the shipped `Environment-1 / Phase 2c` internal cuts

Current remaining gap against the desired Blender-like read:
- the background is still too close to black
- the grid is still visually louder than the model in darker scenes
- the preset model is still a thin `envPreset` surface instead of honest named preset truth with per-preset rig ownership
- the environment-surface cleanup still needs the dedicated `Shadows` section plus final ordering cleanup
- there is not yet a true HDRI-backed environment runtime
- there is not yet any environment intensity or background-versus-lighting separation control
- there is not yet a Photoshop-like post-grade slider family for contrast, highlights, shadows, whites, blacks, temperature, tint, or saturation
- there is not yet any Browser-visible light-management surface for quickly helping model-viewport readability

Important current rule:
- keep the planning honest about the split between scene controls and image-grade controls
- scene-lighting sliders can land earlier through existing view-state seams
- Photoshop-like grade sliders require a later post-process or color-grade seam and should not be described as already present

## Wishlist Tracking

Use the family phases to organize the current environment wishlist like this:

### `Environment-1`
- [x] `0. Brighter Default Scene`
- [ ] `1. Neutral Dark Gray Background`
- [x] `2. Better Default Key And Fill Balance`
- [x] `3. Rim Or Edge Separation For Dark Models`
- [ ] `4. Softer, Less Dominant Grid`
- [x] `5. Better Default Read For Dark Materials`
- [ ] `6. Honest Environment Preset Language`
- [ ] `7. Per-Preset Lighting Rig Definitions`
- [ ] `8. Better Visible Scene Controls In The Environment Section`
- [ ] `9. Quick Studio Tuning Sliders`
- [ ] `9A. Browser-Facing Light Entries For Model Viewport Visibility`
- [ ] `10. Real HDRI Or Environment-Lighting Runtime`
- [ ] `11. Environment Intensity`
- [ ] `12. Background Versus Lighting Separation`
- [ ] `13. Optional HDRI Rotation Or Similar Basic Orientation Control`
- implementation target:
  - make the out-of-box viewport look less crushed and closer to the desired Blender reference
  - define named environment looks such as `Neutral`, `Studio`, `Dark Studio`, or later similar variants
  - make the visible toolbar controls honest and useful without pretending full post-grading already exists
  - add Browser-facing light controls only as a downstream environment surface if that workflow still proves necessary
  - move from a fake background-only preset model toward true environment lighting with honest tuning seams

### `Environment-2`
- [ ] `14. Photoshop-Like Grade Sliders`
- [ ] `15. Exposure, Contrast, Highlights, Shadows, Whites, And Blacks`
- [ ] `16. Temperature, Tint, And Saturation`
- [ ] `17. Honest Scene Controls Versus Final Image Grade Split`
- [ ] `18. Per-Viewport Environment Persistence`
- [ ] `19. Preset Recall And Quick A/B Compare`
- [ ] `20. Polished Production-Ready Environment Workflow`
- implementation target:
  - add the later image-grade layer only after the environment runtime is strong enough to justify it
  - keep the split between scene controls and final-image grading explicit
  - make the environment surface feel finished for everyday use through persistence, recall, and compare helpers once the visual system itself is already strong

### Phase Ladder

The `Environment` subfamily should now grow through an explicit two-phase ladder.

## [ ] Environment-1 - Default Lighting, Presets, And HDRI Runtime

Current source doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`
- current active follow-on planning doc:
  - `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`
  - current `2c` focus:
    - small internal phases for para-style migration of remaining environment-facing controls
    - dedicated `Shadows` section extraction
    - final environment-surface ordering cleanup

### Purpose

Combine the old baseline-lighting, visible-preset, Browser-light-control, and true HDRI/runtime lanes into one larger first environment phase that can still ship through small internal steps.

### Owns

- brighter default scene balance
- neutral dark-gray background direction
- better default key and fill balance
- rim or edge-separation direction for dark models
- grid visibility or intensity tuning so the model stays more important than the floor
- the first honest default-material readability pass where needed to support the environment goal
- named environment preset language
- preset-to-light-rig mapping
- clearer visible environment controls
- Browser-facing light-management surface if model-viewport readability still needs it
- true environment-light contribution
- environment intensity
- background-versus-lighting separation
- basic HDRI orientation control if needed

### Does Not Own

- Photoshop-like grade sliders
- long-term persistence or compare workflow polish

## [ ] Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish

### Purpose

Close the family by adding the later post-look grading layer plus the persistence and workflow polish that should only arrive after `Environment-1` has already made the scene system honest.

### Owns

- Photoshop-like grading controls such as:
  - exposure
  - contrast
  - highlights
  - shadows
  - whites
  - blacks
  - temperature
  - tint
  - saturation
- the explicit split between scene-state tuning and final-image grade tuning
- per-viewport environment persistence where appropriate
- preset recall and re-application rules
- quick compare or A/B helpers if they are still needed
- workflow polish for an environment-tuning loop that feels production-ready

### Does Not Own

- the browseable HDRI catalog
- the first baseline-lighting repair
- the first preset language
- the first HDRI runtime
- the first grade-slider runtime seam

### Summary

Recommended implementation order:
- `Environment-1` first, because the default scene is still too dark and the first real win requires one combined lane spanning baseline repair, visible presets, Browser light control, and true environment-light runtime
- `Environment-2` second, once Photoshop-like sliders can be backed by a real grading seam and the environment system is strong enough to justify persistence or compare polish

Guardrail:
- keep the family honest about the split between:
  - default scene readability
  - visible preset and Browser control surfaces
  - true HDRI/environment runtime
  - post-look grading plus later persistence polish
