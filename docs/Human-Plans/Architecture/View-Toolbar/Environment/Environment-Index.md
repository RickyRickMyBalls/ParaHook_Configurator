# Environment Index

## Doc Header

### Doc History
29. 2026-04-19 10:18:08: Added the dedicated `Environment-2 / Phase 5` cleanup future doc after review found the first four `Environment-2` phases landed the right scaffold but still need grade-fidelity, local-HDRI persistence, and closeout-language cleanup before the family should read as fully polished
28. 2026-04-19 00:14:32: Removed the stale Environment-1 handoff note that still described remaining open work as living in `Environment-2` after `Environment-2` itself closed out
27. 2026-04-19 00:07:26: Marked `Environment-2 / Phase 4` implemented after the recall helpers, A/B compare toggle, and remembered-look workflow landed downstream from the existing persistence seam, then closed `Environment-2` honestly and advanced the index to a fully complete environment-family read
26. 2026-04-19 00:00:23: Marked `Environment-2 / Phase 3` implemented after the active environment look gained persistence through the existing view/workspace seam, older saved views without the nested `environmentGrade` state normalized safely on load, the stored look stayed downstream from scene and HDRI ownership, and `Phase 4` became the next legal `Environment-2` cut
25. 2026-04-18 23:52:19: Marked `Environment-2 / Phase 2` implemented after the visible Photoshop-like grade slider family landed on top of the nested `environmentGrade` seam, the scene-versus-grade split stayed downstream from scene and HDRI ownership, and `Phase 3` became the next legal `Environment-2` cut
24. 2026-04-18 23:31:45: Marked `Environment-1` fully closed out after the Phase 11 proof landed, updated the current reality read and family status to show the lane as complete, and left `Environment-2` as the remaining open environment work
23. 2026-04-18 23:24:11: Marked `Environment-1 / Phase 10` implemented after active HDRI orientation landed as Environment-owned source state, the viewer began applying HDRI orientation to environment and background rotation, and the Browser active HDRI source row gained downstream background visibility through the normal row eye, making `Phase 11 - Add Focused End-To-End Proof And Family Closeout` the next active cut
22. 2026-04-18 23:14:35: Marked `Environment-1 / Phase 9` implemented after active HDRI lighting intensity split from background intensity, HDRI-only active-environment controls landed in the View toolbar, and the viewer began applying separate environment and background intensity values, making `Phase 10 - Add Basic Orientation And Final Environment-Object Cleanup` the next active cut
21. 2026-04-18 23:06:29: Marked `Environment-1 / Phase 8` implemented after the active HDRI source became one Environment-owned Browser content row and the viewer runtime split HDRI background treatment from true environment-light contribution while preserving direct-light ownership and leaving tune controls for `Phase 9`
20. 2026-04-18 23:00:11: Marked `Environment-1 / Phase 7` implemented after the View toolbar became selected-environment-light driven, the competing toolbar-local light list and enabled selector were retired, and Browser row eye visibility became the light on/off path, making `Phase 8 - Add Active HDRI Ownership And The First True Environment-Light Runtime` the next active cut
19. 2026-04-18 21:45:00: Marked `Environment-1 / Phase 6.3` implemented after selected positioned environment lights gained shared View Transform target/session support, viewer-helper gizmo attachment, and `LightSpec.position` commit proof, making `Phase 7 - Route Selected Lights Into The Toolbar` the next active cut
18. 2026-04-18 21:20:00: Marked `Environment-1 / Phase 6.2` implemented after selected environment lights gained an honest viewer frame command plus Browser and Console zoom routing, making `Phase 6.3 - Move Selected Environment Objects Through View Transform` the next active cut
17. 2026-04-18 20:35:00: Inserted `Environment-1 / Phase 6.2` and `Phase 6.3` ahead of the selected-light toolbar pass so selected environment objects can first be zoomed to and moved through the shared View Transform toolbar before `Phase 7` handles selected-light settings and toolbar-list retirement
16. 2026-04-18 20:00:00: Marked `Environment-1 / Phase 6.1` implemented after routing selected environment-light deletes through the shared selection path and exposing selected environment objects in Console with honest breadcrumbs and object-style actions, while leaving `Phase 7` as the next active cut for toolbar population
15. 2026-04-18 19:10:50: Marked corrective `Environment-1 / Phase 5.2` implemented after routing Browser `Environment` rows through the mature content-row chrome path and removing the bespoke environment state-bar branch, while leaving `Phase 5.1` row identity intact and advancing the next active cut to `Phase 6.1`
14. 2026-04-18 19:08:00: Added corrective `Environment-1 / Phase 5.2` as the next active Browser visual-parity cut, so the real `Content > Environment` tree row from `Phase 5.1` can be brought onto the same normal Browser row chrome as `Assembly` and `References` before the later delete, Console, toolbar, or HDRI runtime lanes continue
13. 2026-04-18 18:45:00: Marked corrective `Environment-1 / Phase 5.1` implemented after normalizing the Browser `Environment` surface into a real `Content > Environment` tree row with environment-owned current source and light child rows, plus `environment-light` target-to-row resolution, while leaving selected-toolbar routing, delete-key behavior, Console actions, and true HDRI runtime for later phases
12. 2026-04-18 18:10:13: Added the corrective `Environment-1 / Phase 5.1` prep read to normalize the Browser `Environment` surface from a boxed custom subsection into a normal synthetic tree row under `Content`, with current environment source and light child rows plus viewport-pick-to-Browser-row follow-through, making `Phase 5.1` the next active cut before later toolbar or HDRI work
11. 2026-04-18 17:48:16: Marked `Environment-1 / Phase 6` complete by adding viewport wireframe light objects and the shared selected environment-object contract for Browser rows and viewport picks, then advanced the next active cut to `Phase 7` while leaving toolbar population and true HDRI runtime for later
10. 2026-04-18 17:34:35: Marked `Environment-1 / Phase 5` complete by adding the Browser `Environment` section plus active light and HDRI rows from shared environment truth, then advanced the next active cut to `Phase 6` without widening into viewport helpers or toolbar routing
9. 2026-04-18 16:49:23: Marked `Environment-1 / Phase 3` complete by moving preset-divergence honesty and preset-background ownership into the shared preset truth seam, and left `Phase 4` as the next visible tuning cut without widening into HDRI or Browser-light work
8. 2026-04-18 16:38:00: Cleaned up this environment-family index to lock the currently shipped scene look as the preserved startup baseline, so remaining environment work now reads as opt-in preset, HDRI, Browser-light, and grading follow-through instead of implying more default-scene retuning
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

Important guardrail for all open environment work:
- keep the currently shipped default scene look as the locked startup baseline
- make new environment presets, HDRI runtime, scene tuning, and grading opt-in after explicit user choice

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
  - `Environment_Phase Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish.md`
  - `Environment_Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty.md`
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
- `Environment-1` is now fully closed out through `Phase 11`

Current remaining gap against the desired environment workflow:
- the later Photoshop-like post-grade slider family now has its own standalone `Environment-2` future doc
- `Environment-2 / Phase 1` through `Phase 4` shipped the grade-state scaffold, visible controls, persistence bridge, and recall or compare helpers
- review found that the lane still needs a dedicated `Phase 5` cleanup pass for grade-fidelity honesty, local HDRI persistence, and final closeout language
- the visible grade slider surface, persistence bridge, and workflow polish are shipped as scaffolding, but the family should not read as fully polished until `Phase 5` closes

Important current rule:
- keep the currently shipped default scene look stable at startup
- keep the planning honest about the split between scene controls and image-grade controls
- new environment presets, HDRI runtime, and scene-lighting sliders must be opt-in instead of silently rewriting the baseline viewer look
- named presets now read honestly when manual edits diverge, and background behavior now comes from the shared preset-definition seam instead of a viewer-local branch
- Photoshop-like grade sliders are now present and should stay attached to the active environment look instead of acting like scene-state controls

## Wishlist Tracking

Use the family phases to organize the current environment wishlist like this:

### `Environment-1`
- [x] `0. Brighter Default Scene`
- [x] `1. Preserve The Current Default Background Baseline`
- [x] `2. Better Default Key And Fill Balance`
- [x] `3. Rim Or Edge Separation For Dark Models`
- [x] `4. Preserve The Current Default Grid Baseline`
- [x] `5. Better Default Read For Dark Materials`
- [x] `6. Honest Environment Preset Language`
- [x] `7. Per-Preset Lighting Rig Definitions`
- [x] `8. Better Visible Scene Controls In The Environment Section`
- [x] `9. Quick Studio Tuning Sliders`
- [x] `9A. Browser-Facing Light Entries For Model Viewport Visibility`
- [x] `10. Real HDRI Or Environment-Lighting Runtime`
- [x] `11. Environment Intensity`
- [x] `12. Background Versus Lighting Separation`
- [x] `13. Optional HDRI Rotation Or Similar Basic Orientation Control`
- implementation target:
  - keep the currently shipped startup viewport look stable and move remaining environment work into explicit opt-in flows
  - define named environment looks such as `Neutral`, `Studio`, `Dark Studio`, or later similar variants
  - make the visible toolbar controls honest and useful without pretending full post-grading already exists
  - add Browser-facing light controls only as a downstream environment surface if that workflow still proves necessary
  - move from a thin background-only preset model toward true environment lighting with honest tuning seams

### `Environment-2`
- [x] `14. Photoshop-Like Grade Sliders`
- [x] `15. Exposure, Contrast, Highlights, Shadows, Whites, And Blacks`
- [x] `16. Temperature, Tint, And Saturation`
- [x] `17. Honest Scene Controls Versus Final Image Grade Split`
- [x] `18. Per-Viewport Environment Persistence`
- [x] `19. Preset Recall And Quick A/B Compare`
- [~] `20. Polished Production-Ready Environment Workflow`
- [ ] `21. Environment-2 Phase 5 Cleanup For Grade Fidelity, Persistence Honesty, And Closeout Language`
- Current source doc:
  - `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish.md`
  - `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty.md`
- implementation target:
  - add the later image-grade layer only after the environment runtime is strong enough to justify it
  - keep the split between scene controls and final-image grading explicit
  - make the environment surface feel finished for everyday use through persistence, recall, and compare helpers once the visual system itself is already strong
  - use `Environment-2 / Phase 5` to clean up the places where the first four phases overclaimed grade fidelity, persistence scope, or production-ready closeout

### Phase Ladder

The `Environment` subfamily should now grow through an explicit two-phase ladder.

## [x] Environment-1 - Default Lighting, Presets, And HDRI Runtime

Current source doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`
- `Phase 11 - Add Focused End-To-End Proof And Family Closeout` is closed out and the family is complete

### Purpose

Close the remaining Browser hierarchy normalization, selection-driven toolbar-routing, and true HDRI/runtime lanes while keeping the currently shipped default startup scene unchanged unless a later decision explicitly reopens that baseline.

### Owns

- preservation of the currently shipped default startup scene as the locked baseline
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

## [x] Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish

Current source doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish.md`
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-2 Phase 5 - Cleanup, Grade Fidelity, And Persistence Honesty.md`

### Purpose

Make `Environment-2` the post-look grading lane for the environment family, keeping the later workflow polish downstream from the already-honest scene and HDRI ownership seams.

The phase 1 seam is already implemented, the visible slider surface now ships in `Phase 2`, the persistence bridge landed in `Phase 3`, and `Phase 4` added the first recall and compare helpers.

Review after closeout reopened one dedicated cleanup pass as `Phase 5`, so this lane should now read as scaffolded but not fully polished until grade-fidelity, local-HDRI persistence, and final language cleanup land.

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

### Current Live Read

- `Phase 2` is implemented and the visible grade slider surface is live
- `Phase 3` is implemented and the active environment look now persists through the existing view/workspace seam
- `Phase 4` is implemented and the first recall or compare helpers exist
- `Phase 5` is now the active cleanup pass for grade fidelity, persistence honesty, and closeout language
- the remaining open work for `Environment-2` lives in the dedicated `Phase 5` cleanup doc

### Summary

Recommended family direction:
- `Environment-1` is complete and should remain preserved as shipped history
- `Environment-2 / Phase 1` through `Phase 4` should remain preserved as shipped scaffold history
- `Environment-2 / Phase 5` is now the active cleanup lane before the family should read as fully polished

Guardrail:
- keep the family honest about the split between:
  - the locked default startup scene
  - visible preset and Browser control surfaces
  - true HDRI/environment runtime
  - post-look grading plus later persistence polish

Environment-1 status:
- fully closed out
- no remaining open family work is tracked in this environment lane

Environment-2 status:
- cleanup reopened through `Phase 5`
