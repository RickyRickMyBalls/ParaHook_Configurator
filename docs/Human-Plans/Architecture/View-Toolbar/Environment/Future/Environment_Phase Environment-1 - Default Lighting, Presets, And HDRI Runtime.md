# Environment Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime

## Doc Header

### Doc History
39. 2026-04-18 23:31:45: Marked `Environment-1 / Phase 11` implemented after the focused closeout proof test covered baseline preset state, preset divergence and reapply, and active HDRI tuning, then closed the family lane in the source doc while leaving `Environment-2` as the remaining open environment work
38. 2026-04-18 23:24:11: Implemented `Environment-1 / Phase 10` by adding HDRI-only active environment orientation through environment-owned source state, applying that orientation to viewer `scene.environmentRotation` and `scene.backgroundRotation`, routing Browser source-row eye visibility to active HDRI background visibility, and proving the store, toolbar, Browser, and viewer seams while leaving startup baseline retuning, grading, persistence, compare workflow, Catalog browsing, final family proof, and closeout to later phases
37. 2026-04-18 23:14:35: Implemented `Environment-1 / Phase 9` by splitting active HDRI lighting intensity from background intensity, exposing HDRI-only active-environment controls in the View toolbar, routing the new tune actions through environment-owned view state, and proving the viewer applies separate `scene.environmentIntensity` and `scene.backgroundIntensity` values while leaving startup baseline retuning, orientation, grading, persistence, and Catalog browsing out of scope
36. 2026-04-18 23:06:29: Implemented `Environment-1 / Phase 8` by keeping the active HDRI as one Environment-owned Browser source row, splitting the viewer HDRI runtime into explicit background-treatment and environment-light contribution helpers, proving HDRI texture contribution can light models directly while direct lights remain intact, and leaving visible intensity, background-versus-lighting tune controls, orientation, grading, persistence, and baseline retuning out of scope
35. 2026-04-18 23:00:11: Implemented `Environment-1 / Phase 7` by making the View toolbar read and edit the currently selected environment light, retiring the toolbar-local light picker and toolbar enabled selector, routing light visibility through the Browser row eye to environment-owned `LightSpec.enabled`, and adding focused toolbar plus Browser proof while keeping true environment-light runtime, HDRI browsing, intensity/background separation, grading, persistence, and baseline retuning out of scope
34. 2026-04-18 21:45:00: Implemented `Environment-1 / Phase 6.3` by extending the shared View Transform target/session seam to selected environment lights, attaching the viewer gizmo to environment-light helpers, committing translate drafts back through `LightSpec.position`, gating non-positioned lights out of the move path, and adding focused store/viewer proof while keeping selected-light settings, rotate/scale light semantics, true environment-light runtime, and HDRI work out of scope
33. 2026-04-18 21:28:00: Prepped `Environment-1 / Phase 6.3` with an implementation spec for registering selected environment lights as shared View Transform targets, moving them through the existing translate gizmo/session seam, and committing position changes back into environment-owned light specs without widening into selected-light settings, toolbar-list retirement, true environment-light runtime, or HDRI work
32. 2026-04-18 21:16:00: Implemented `Environment-1 / Phase 6.2` by adding an honest selected environment-light frame command and viewer helper-framing seam, routing Browser environment-light double-click and Console `Zoom > Object` through it, proving missing helpers do not frame all silently, and leaving View Transform movement plus selected-light toolbar settings for later phases
31. 2026-04-18 20:50:00: Prepped `Environment-1 / Phase 6.2` with an implementation spec for selected environment-light framing, grounding Browser and Console zoom routing in the existing viewer framing seams while keeping movement, selected-light settings, and true HDRI runtime out of scope
30. 2026-04-18 20:35:00: Added the next environment-object HLG for object framing and View Transform movement, then chunked it into `Environment-1 / Phase 6.2` for selected-environment-object zoom/framing and `Environment-1 / Phase 6.3` for moving selected environment objects through the shared View Transform toolbar before the later selected-light settings pass
29. 2026-04-18 20:00:00: Implemented corrective `Environment-1 / Phase 6.1` by routing selected environment-light deletes through the shared selection and command seam, feeding Console selected-environment-object context from environment-owned truth, and keeping the later toolbar-population pass out of scope while `Phase 7` remains the next active cut
28. 2026-04-18 19:10:50: Implemented corrective `Environment-1 / Phase 5.2` by routing Browser `Environment` rows through the mature content-row chrome path, removing the bespoke `BrowserContentStateBar--environment` branch, and keeping the `Phase 5.1` Environment row contract and selection behavior intact while later delete, Console, toolbar, and HDRI runtime work remains out of scope
27. 2026-04-18 19:08:00: Added corrective `Environment-1 / Phase 5.2` as the Browser visual-parity follow-up after `Phase 5.1`, keeping `Environment` as a real Browser collection row while explicitly moving its row chrome onto the same visual language as `Assembly`, `References`, and normal content rows before delete, Console, toolbar, or HDRI runtime work continues
26. 2026-04-18 18:45:00: Implemented corrective `Environment-1 / Phase 5.1` by replacing the boxed Browser `Environment` subsection with a normal `Content > Environment` tree row, deriving the current source and environment-light child rows from shared environment truth, keeping source wording honest about the missing true HDRI runtime, and resolving `environment-light` targets back to `environment-light-row:<lightId>` Browser row ids without widening into toolbar population or Phase 6.1
25. 2026-04-18 18:30:00: Added the family-level `## Vision` section above `## Wishlist Organization`, preserving the human-readable `Environment-1` summary vision plus the current HLG list before the doc compresses that intent into CLG, phase chunking, wishlist checklists, phase summaries, implementation specs, and worker tasks
24. 2026-04-18 18:10:13: Prepped corrective `Environment-1 / Phase 5.1` inside this family doc so the Browser `Environment` surface normalizes from a boxed custom subsection into a real Browser collection row under `Content`, derived from default, added, or loaded environment objects with source and light child rows plus viewport-pick-to-Browser-row follow-through, while keeping toolbar population, transforms, true HDRI runtime, and later phases out of scope
23. 2026-04-18 17:48:16: Closed `Environment-1 / Phase 6` by adding viewport wireframe light objects plus the shared selected environment-object contract for Browser rows and viewport picks, then advanced the remaining ladder to `Phase 7` without widening into toolbar population or true HDRI runtime
22. 2026-04-18 17:34:35: Closed `Environment-1 / Phase 5` by adding the Browser `Environment` section plus active light and HDRI rows from shared environment truth, then advanced the remaining ladder to `Phase 6` without widening into viewport helpers or toolbar routing
21. 2026-04-18 17:46:00: Tightened the `Environment-1` family doc after the shipped `Phase 4` pass so the summary, `Phase 3` handoff read, and `Phase 4` status now point honestly at `Phase 5` as the next legal cut instead of leaving stale pre-implementation wording behind
20. 2026-04-18 17:30:00: Closed `Environment-1 / Phase 4` by adding the visible environment tuning surface, quick studio controls, honest preset divergence handling, and the selected-preset reapply path while keeping the startup baseline and later Browser/HDRI work out of scope
19. 2026-04-18 17:31:00: Tightened the `Environment-1` planning guardrails so any new settings surfaced in the `View Toolbar` should prefer the existing para-style control language first, explicitly steering later environment tuning and selected-light editing toward `ParaSlider`, `ParaSelect`, and `ParaVec3`-style controls instead of ad hoc widget patterns
18. 2026-04-18 17:24:00: Re-prepped this `Environment-1` family-phase doc around the stronger Blender-like environment-object vision, replacing the softer optional Browser-light wording with explicit Browser-and-viewport environment-object `HLG` plus `CLG`, adding active HDRI ownership under one `Environment` content section, and expanding the remaining ladder from `Phase 4` through `Phase 11` so visible tuning, Browser rows, viewport wireframes, selection-driven toolbar editing, real environment runtime, and final closeout each keep one honest owner
17. 2026-04-18 16:49:23: Closed the remaining `Phase 3` preset-honesty follow-through by surfacing divergence when exposure or lighting edits drift away from the selected named preset, moving preset background behavior into the shared preset definition seam, and marking `Environment-1-HLG-2` complete so `Phase 4` can stay focused on visible tuning without widening into later family work
16. 2026-04-18 16:22:23: Reformatted this `Environment-1` family-phase doc into the current standalone future-doc shape by adding a proper family summary, `## Wishlist Organization`, explicit `High Level Goals` plus `CLG`, and one cleaner top-level phase ladder, while keeping the startup-baseline guardrail, the shipped `Phase 1` through `Phase 3` reality, and the remaining `Phase 4` through `Phase 8` execution order honest
15. 2026-04-18 16:46:00: Cleaned up this `Environment-1` phase doc so the shipped baseline-lighting work remains preserved as historical context while the remaining open ladder is explicitly reframed around opt-in preset truth, visible environment cleanup, Browser-light workflow if still needed, and true HDRI runtime without changing the current startup scene by default
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

### Purpose

This doc is the standalone future execution surface for `Environment-1`.

Use it to answer:
- how the first real environment lane should preserve the current startup scene while adding opt-in environment workflows
- how named presets, visible tuning, Browser and viewport environment objects, and true HDRI runtime should be phased honestly
- which `Environment-1` goals are already advanced versus still open
- how the remaining implementation ladder should run from the corrective `Phase 5.1` through `Phase 11`

### Why This Phase Exists

The current environment surface is stronger than it was at the start of the family, but it is still incomplete.

The repo now has:
- a preserved startup baseline
- a brighter default scene
- a dedicated `Ground` lane
- a first named preset model and shared preset-apply seam

Remaining gaps after the first selected-light and HDRI runtime cuts:
- environment-light tuning, separation, orientation, and final family proof

This doc exists to keep the first environment family honest all the way from the preserved baseline to a real environment runtime without widening into later grading and workflow-polish work that belongs to `Environment-2`.

### Scope

This family phase covers:
- preservation of the shipped startup scene as the locked default baseline
- named environment preset language and preset-apply truth
- visible environment tuning controls
- one dedicated normal Browser `Environment` tree row under `Content`
- Browser-visible and viewport-visible environment objects for lights and the active HDRI
- selection-driven light editing through Browser, viewport, and toolbar
- selected environment-object zoom/framing and View Transform movement
- retirement of the older toolbar-local light list once Browser ownership lands honestly
- true environment-light runtime plus the minimum useful tune controls
- final `Environment-1` proof and closeout

This family phase does not cover:
- Photoshop-like post-look grading sliders
- final persistence, recall, or A/B compare workflow polish
- browseable HDRI catalog ownership

## Doc Body

### Summary

`Environment-1` is the first real environment family lane.

The family is part-shipped today:
- `Phase 1`, `Phase 2`, `Phase 2b`, `Phase 2c`, `Phase 2d`, `Phase 3`, and `Phase 4` are landed or honestly closed
- `Phase 5` landed the first Browser environment surface, and corrective `Phase 5.1` normalized it into a real `Content > Environment` tree row with source and light children
- viewport-picked `environment-light` targets now resolve back to matching Browser row ids
- `Phase 6` through `Phase 11` remain open after that corrective Browser hierarchy pass, except where prior records already mark shipped behavior

The current startup scene is intentionally locked as the preserved baseline.

The family has already advanced from one thin `envPreset` label toward a real preset apply seam that now surfaces divergence honestly, and the Browser now has a normalized environment-owned tree surface, but the family is not done:
- lights are still managed from a toolbar list instead of behaving like scene objects
- later selected-light editing still needs to route from the selected environment object into the toolbar
- the viewer still does not have true environment-light contribution
- the family-level preset-honesty goal is now closed, and the remaining open work should continue after the normalized Browser row identity now provided by `Phase 5.1`

### Owns

- preservation of the currently shipped default startup scene as the locked baseline
- named environment presets and preset-to-scene apply truth
- visible environment tuning controls
- one dedicated normal Browser `Environment` tree row for active environment objects
- Browser-visible and viewport-visible light-object representation
- selection-driven light setting editing and shared View Transform movement through Browser, viewport, and toolbar
- active HDRI ownership as an `Environment` content entry after selection
- true environment-light contribution
- environment intensity and background-versus-lighting separation
- basic orientation control if still needed
- end-to-end family proof and closeout for the first environment lane

### Does Not Own

- Photoshop-like grade sliders
- final-image grading ownership
- long-term persistence or compare polish
- browseable HDRI asset-library ownership

### Current Live Read

Current shared environment seam:
- `src/shared/viewSettingsTypes.ts`
  - now owns:
    - `envPreset`
    - explicit preset definitions
    - default preset-apply patching for `envPreset`, `exposure`, and `lighting`
    - shared ground settings
    - active HDRI lighting intensity
    - active HDRI background visibility and background intensity
    - active HDRI orientation

Current mutation seam:
- `src/app/store/uiPrefsStore.ts`
  - now owns one shared `applyEnvironmentPreset(...)` seam
  - now owns one shared `applyHdriEnvironment(...)` seam plus HDRI lighting intensity, background visibility, background intensity, and orientation mutations
  - still allows direct manual edits to exposure and light fields after a preset is chosen
  - now leaves the visible surface free to mark when the live scene diverges from the chosen preset

Current visible surface:
- `src/app/components/ViewToolbar.tsx`
  - now exposes:
    - the named preset selector
    - an honest preset-honesty read that surfaces divergence after manual edits
    - selected-light editing from Browser or viewport selection
    - the active HDRI source read and HDRI-only lighting intensity, background visibility, background intensity, and orientation controls
    - the dedicated `Ground` and `Shadows` sections through the earlier `Phase 2c` and `Phase 2d` follow-through

Current Browser-facing surface:
- the Browser now has one normal `Content > Environment` collection row derived from environment-owned source and light truth
- the current environment source row uses one stable active source row id for preset, custom, or HDRI sources
- the active HDRI source row now uses the normal Browser eye to toggle active HDRI background visibility through Environment-owned source state
- environment light rows use the normal Browser eye to toggle `LightSpec.enabled`
- viewport-picked environment lights resolve back to the matching Browser row
- selected environment lights populate the Environment toolbar from `view.lighting.selectedLightId`

Current viewport-object read:
- viewport wireframe helpers now exist for environment lights and participate in the shared selected environment-object contract
- selected positioned environment lights can be framed and moved through the shared View Transform toolbar
- the viewport object language should remain:
  - point lights
  - spot lights
  - directional lights
  - area lights

Current runtime seam:
- `src/viewer/Viewer.ts`
  - already applies:
    - tone mapping
    - exposure
    - background treatment from the shared preset definition seam
    - active HDRI textures to `scene.environment` for model lighting
    - separate active HDRI lighting and background intensity values
    - active HDRI orientation through `scene.environmentRotation` and `scene.backgroundRotation`
    - direct-light specs
    - material presets
    - ground runtime

Important honest read:
- the startup baseline is preserved and should stay preserved
- named presets now exist and apply through one shared seam
- manual exposure or lighting edits now surface as divergence when the live scene drifts away from the chosen preset
- background behavior now comes from the shared preset-definition seam instead of a viewer-local branch
- `Environment-1-HLG-2` is now complete
- the remaining open work is `Phase 11` focused end-to-end proof and honest `Environment-1` closeout

### Done Shape

`Environment-1` is done when:
- the startup scene still boots into the preserved baseline unless the user explicitly chooses otherwise
- environment presets read as honest named scene states
- the user can do meaningful everyday scene tuning without dropping straight into raw light editing
- active environment content lives in one normal Browser `Environment` tree row under `Content`, with environment-owned child rows instead of a boxed custom subsection
- lights behave like real scene objects in both the Browser and the model viewport
- viewport-picked environment lights resolve back to their matching Browser rows
- selected environment objects can be framed or zoomed to like normal viewport objects
- selected environment objects can be moved through the shared View Transform toolbar while staying backed by environment-owned truth
- selecting a light in the Browser or viewport populates the toolbar for that exact light
- the older toolbar-local light list is gone
- Browser row visibility owns light on or off through the eye control
- the active HDRI is represented as one `Environment` content entry
- the viewer has true environment-light contribution instead of only background switching
- that runtime is tunable enough to be useful
- the family has focused proof and can be closed honestly before `Environment-2`

## Vision

### Vision Summary

`Environment-1` should make the scene environment feel like real, editable scene content while preserving the current startup baseline.

The user should be able to work with environment content in the same mental model used for other model-viewport objects:
- lights and environment source entries should live under a real Browser `Environment` collection row
- the `Environment` row and its children should use the same normal Browser row visual language as `Assembly`, `References`, and other content rows instead of looking like a custom boxed panel or unstyled special case
- environment objects should be represented in the model viewport when that representation helps selection and editing
- selecting an environment object in the Browser or viewport should point every surface at the same selected environment object
- selected environment objects should be frameable or zoomable like normal scene objects, so the user can quickly navigate to the light or environment helper they are editing
- selected environment objects should be movable through the shared View Transform toolbar, with transform edits writing back to environment-owned object truth rather than a duplicate viewport-only helper state
- the View Toolbar should expose the selected environment object's practical settings using the existing para-style control language where it fits
- environment object visibility, deletion, transform-oriented actions, and Console context should behave like normal object workflows where possible
- active HDRI or environment-light contribution should be represented honestly only when the underlying runtime truth exists

The important product intent is that `Environment` is not a fake Browser panel. It is a real Browser collection row derived from environment-owned objects that exist by default or are added or loaded by the user. Browser, viewport, toolbar, and Console surfaces should remain downstream of that environment-owned truth instead of creating a second hidden owner.

### Human Level Goals

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `Environment-1-HLG-2. Make Environment Presets Honest`
- [ ] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [ ] `Environment-1-HLG-6. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-7. Make Chosen Environment Lighting Tunable`
- [x] `Environment-1-HLG-8. Delete Selected Environment Objects Like Real Scene Objects`
- [x] `Environment-1-HLG-9. Expose Selected Environment Objects In Console Context Like Real Objects`
- [x] `Environment-1-HLG-10. Zoom To Selected Environment Objects Like Real Scene Objects`
- [ ] `Environment-1-HLG-11. Move Selected Environment Objects Through The Shared View Transform Toolbar`

Vision rule:
- add new HLG here first, then derive CLG, then chunk those CLG into Codex-sized phases before updating the wishlist

## Wishlist Organization

### High Level Goals

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `Environment-1-HLG-2. Make Environment Presets Honest`
- [ ] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [ ] `Environment-1-HLG-6. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-7. Make Chosen Environment Lighting Tunable`
- [x] `Environment-1-HLG-8. Delete Selected Environment Objects Like Real Scene Objects`
- [x] `Environment-1-HLG-9. Expose Selected Environment Objects In Console Context Like Real Objects`
- [x] `Environment-1-HLG-10. Zoom To Selected Environment Objects Like Real Scene Objects`
- [ ] `Environment-1-HLG-11. Move Selected Environment Objects Through The Shared View Transform Toolbar`

Important rule:
- only check off an `Environment-1-HLG` when the full family ladder has really achieved it
- do not check off an HLG just because one intermediate phase moved it forward

### Codex Level Goals

- [ ] `Environment-1-CLG-1. Keep The Shipped Startup Scene Preserved As The Locked Baseline Through Every Remaining Phase`
- [ ] `Environment-1-CLG-2. Keep Environment As The Owner Of Active Environment State And Selected Environment Objects`
- [ ] `Environment-1-CLG-3. Keep Catalog As The Owner Of Browseable HDRI Assets Instead Of Active Scene State`
- [ ] `Environment-1-CLG-4. Add One Dedicated Browser Content Section Named Environment`
- [ ] `Environment-1-CLG-5. Keep Browser Rows, Viewport Picks, And Toolbar Population On One Selected Environment-Object Contract`
- [ ] `Environment-1-CLG-6. Represent Lights As Browser Rows And Viewport Wireframe Objects Only`
- [ ] `Environment-1-CLG-7. Use Browser Eye Visibility As The On-Or-Off Toggle For Lights`
- [ ] `Environment-1-CLG-8. Retire The Old View-Toolbar Light List Once Browser Ownership Lands`
- [ ] `Environment-1-CLG-9. Store The Active HDRI Under The Same Environment Content Surface`
- [ ] `Environment-1-CLG-10. Prefer Para-Style Toolbar Controls For New Environment Settings Whenever The Existing Control Family Fits`
- [ ] `Environment-1-CLG-11. Keep Prep, Implementation, Verification, And Cleanup Distinct Across The Remaining Ladder`
- [x] `Environment-1-CLG-12. Make Preset Honesty Explicit Before Claiming The Family Is Done`
- [ ] `Environment-1-CLG-13. Add One Final Family Closeout Entry Only When Environment-1 Is Actually Complete`
- [x] `Environment-1-CLG-14. Route Selected Environment Object Delete Through The Shared Selection Command Path`
- [x] `Environment-1-CLG-15. Add Console Breadcrumbs And Real-Object Actions For Selected Environment Objects`
- [x] `Environment-1-CLG-16. Keep Environment Object Actions Backed By Environment-Owned Truth`
- [x] `Environment-1-CLG-17. Make Environment Browser Rows Use Normal Browser Visual Parity Instead Of Special-Case Chrome`
- [x] `Environment-1-CLG-18. Route Environment Object Zoom Through The Existing Selected-Object Framing Path`
- [ ] `Environment-1-CLG-19. Register Selected Environment Objects As Valid View Transform Targets`
- [ ] `Environment-1-CLG-20. Persist Environment Object Transform Edits Back To Environment-Owned Light Truth`

### `Environment-1 Phase 1`

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `0. Lock The Exact Baseline Contract And No-Widening Boundary`
- [x] `1. Name The Current Dark-Viewport Failures Before Later Runtime Widening`

### `Environment-1 Phase 2`

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `2. Brighten The Default Scene Without Widening Into Presets`
- [x] `3. Improve The Default Light Balance`
- [x] `4. Reduce Grid Dominance`

### `Environment-1 Phase 2b`

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `5. Do One Honest Lighting Cleanup Pass Before Preset Truth`

### `Environment-1 Phase 2c`

- [x] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [x] `6. Reorganize The Environment-Facing Toolbar Surface`
- [x] `7. Give Shadow-Facing Controls One Explicit Visible Owner`
- [x] `8. Keep Ground Separate From Environment`

### `Environment-1 Phase 2d`

- [x] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [x] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [x] `9. Add The First Honest Ground Or Floor Read`

### `Environment-1 Phase 3`

- [x] `Environment-1-HLG-2. Make Environment Presets Honest`
- [x] `10. Replace The Thin Preset Label With Named Preset Truth`
- [x] `11. Route View Toolbar And Catalog Through One Shared Preset-Apply Seam`
- [x] `12. Preserve The Baseline As The Default Startup Choice`
- [x] `13. Finish The Remaining Preset-Honesty Follow-Through Around Divergence And Background Ownership`

### `Environment-1 Phase 4`

- [x] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [x] `14. Add Better Visible Scene Controls In The Environment Section`
- [x] `15. Add Quick Studio Tuning Sliders`
- [x] `16. Make The Visible Contract For Preset Versus Custom Scene Editing Honest`

- Phase 4 is now complete: the Environment section ships the first practical tuning surface and an honest preset-versus-custom read.

### `Environment-1 Phase 5`

- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [x] `17. Add A Dedicated Content Environment Surface`
- [x] `18. Move Active Lights Into Environment-Owned Browser Rows`
- [x] `19. Keep Browser Downstream From Environment-Owned Truth`
- [ ] `19A. Normalize The Environment Surface Into A Normal Browser Tree Row`

### `Environment-1 Phase 5.1`

- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `19A. Normalize Environment Into A Real Browser Collection Row Under Content`
- [ ] `19B. Add Current Environment Source And Environment Light Child Rows`
- [ ] `19C. Resolve Viewport-Picked Environment Lights Back To Matching Browser Rows`
- [ ] `19D. Avoid HDRI Runtime Overclaiming In The Browser Tree`

### `Environment-1 Phase 5.2`

- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [x] `Environment-1-CLG-17. Make Environment Browser Rows Use Normal Browser Visual Parity Instead Of Special-Case Chrome`
- [x] `19E. Route Environment Rows Through Normal Browser Row Visual Treatment`
- [x] `19F. Reuse Assembly Or References-Style Content State Bars For Environment Rows`
- [x] `19G. Remove The Unstyled Environment Row Chrome That Makes The Normal Tree Row Look Boxed Or Ugly`
- [x] `19H. Preserve The Phase 5.1 Environment-Owned Data Contract While Fixing Presentation Only`

### `Environment-1 Phase 6`

- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [ ] `20. Render Lights As Wireframe Viewport Objects`
- [ ] `21. Give Each Light Type One Honest Lightweight Object Shape`
- [ ] `22. Keep Browser Selection And Viewport Picks On One Selected Environment-Object Contract`

### `Environment-1 Phase 6.1`

- [x] `Environment-1-HLG-8. Delete Selected Environment Objects Like Real Scene Objects`
- [x] `Environment-1-HLG-9. Expose Selected Environment Objects In Console Context Like Real Objects`
- [x] `Environment-1-CLG-14. Route Selected Environment Object Delete Through The Shared Selection Command Path`
- [x] `Environment-1-CLG-15. Add Console Breadcrumbs And Real-Object Actions For Selected Environment Objects`
- [x] `Environment-1-CLG-16. Keep Environment Object Actions Backed By Environment-Owned Truth`
- [x] `22A. Add Delete-Key Handling For Selected Environment Objects`
- [x] `22B. Add Console Breadcrumbs For Selected Environment Objects`
- [x] `22C. Add Console Real-Object Actions For Selected Environment Objects`
- [x] `22D. Keep Delete, Hide/Show, And Back Actions Routed Through Environment-Owned Truth`

### `Environment-1 Phase 6.2`

- [x] `Environment-1-HLG-10. Zoom To Selected Environment Objects Like Real Scene Objects`
- [x] `Environment-1-CLG-18. Route Environment Object Zoom Through The Existing Selected-Object Framing Path`
- [x] `22E. Add Selected Environment Object Bounds Or Frame Targets`
- [x] `22F. Make Console And Browser Zoom Actions Frame The Selected Environment Object`
- [x] `22G. Keep Environment Object Zoom Selection-Driven Instead Of Camera-Special-Cased`

### `Environment-1 Phase 6.3`

- [ ] `Environment-1-HLG-11. Move Selected Environment Objects Through The Shared View Transform Toolbar`
- [ ] `Environment-1-CLG-19. Register Selected Environment Objects As Valid View Transform Targets`
- [ ] `Environment-1-CLG-20. Persist Environment Object Transform Edits Back To Environment-Owned Light Truth`
- [ ] `22H. Route Selected Environment Objects Into The Shared View Transform Toolbar`
- [ ] `22I. Move Environment Light Position Through The Shared Transform Commit Path`
- [ ] `22J. Keep Viewport Helpers, Browser Rows, Console Context, And Toolbar Transform On One Environment-Owned Object`

### `Environment-1 Phase 7`

- [ ] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [ ] `23. Populate The Toolbar From The Selected Light`
- [ ] `24. Support Light-Setting Editing For The Selected Light`
- [ ] `25. Retire The Old Toolbar Light List And Use Browser Eye Visibility For Light On-Or-Off`

### `Environment-1 Phase 8`

- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `Environment-1-HLG-6. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `26. Keep Active HDRI Ownership Inside The Environment Content Surface`
- [ ] `27. Add The First True Environment-Light Runtime`
- [ ] `28. Keep Background Treatment And Light Contribution As Explicit Separate Concepts`

### `Environment-1 Phase 9`

- [ ] `Environment-1-HLG-6. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-7. Make Chosen Environment Lighting Tunable`
- [ ] `29. Add Environment Intensity`
- [ ] `30. Add Background-Versus-Lighting Separation`

### `Environment-1 Phase 10`

- [x] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [x] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [x] `Environment-1-HLG-7. Make Chosen Environment Lighting Tunable`
- [x] `31. Add Basic Orientation Control If Still Needed`
- [x] `32. Close Remaining Environment-Object Cleanup Around Selection, Visibility, And Toolbar Routing`

### `Environment-1 Phase 11`

- [ ] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [ ] `Environment-1-HLG-4. Represent Environment Content As Real Browser And Viewport Objects`
- [ ] `Environment-1-HLG-5. Make Light Editing Selection-Driven Through Browser, Viewport, And Toolbar`
- [ ] `Environment-1-HLG-6. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-7. Make Chosen Environment Lighting Tunable`
- [ ] `33. Add Focused End-To-End Proof Across Presets, Environment Objects, Toolbar Selection, And HDRI Runtime`
- [ ] `34. Add Final Family Closeout`

## [x] `Environment-1` - `Phase 1 - Confirm The First Environment Contract And Baseline Target`

### Phase 1 Summary

#### Purpose

Lock the exact first environment contract around what the brighter default scene must improve before any runtime widening begins.

#### Owns

- current dark-scene read confirmation
- the exact baseline target
- the first no-widening boundary before presets, Browser environment-object work, and HDRI runtime

#### Does Not Own

- visible UI growth
- true HDRI runtime
- Browser environment-object workflow

#### Current Status

`Phase 1` is shipped as a docs-only contract-lock pass.

### Phase 1 Implementation Spec

#### Shipped Read

- locked the baseline target around brighter midtones, better key and fill balance, less dominant grid, and better dark-model separation
- kept `envPreset` explicitly framed as a thin early seam rather than pretending it was already true environment lighting
- allowed `Phase 2` to use only the already-existing baseline-ready seams

#### Done Shape

`Phase 1` is done because later phases no longer need to rediscover what the baseline target was supposed to mean.

## [x] `Environment-1` - `Phase 2 - Ship The Default Lighting Baseline Repair`

### Phase 2 Summary

#### Purpose

Make the out-of-box viewport materially better before the user touches anything.

#### Owns

- default background improvement
- exposure baseline tuning
- default light-balance repair
- grid-intensity reduction
- first dark-material readability support

#### Does Not Own

- named presets
- Browser `Environment` rows or viewport light objects
- HDRI runtime

#### Current Status

`Phase 2` is shipped.

### Phase 2 Implementation Spec

#### Shipped Read

- retuned the shipped baseline scene while keeping the same narrow runtime seam
- kept the work inside the default scene instead of widening into new shared environment state
- left later preset, Browser, and HDRI work deferred honestly

#### Done Shape

`Phase 2` is done because the startup scene became readable enough to preserve as the later locked baseline.

## [x] `Environment-1` - `Phase 2b - Default Lighting Cleanup And Balance Polish`

### Phase 2b Summary

#### Purpose

Do one honest lighting cleanup pass through the existing baseline rig before widening into presets and runtime work.

#### Owns

- key-light cleanup
- fill cleanup
- rim cleanup
- focused proof for the baseline rig

#### Does Not Own

- new environment state
- preset truth
- visible tuning surfaces

#### Current Status

`Phase 2b` is shipped.

### Phase 2b Implementation Spec

#### Shipped Read

- refined the baseline rig without reopening the broader family contract
- kept the startup scene stable enough to preserve as the baseline for the rest of the family

#### Done Shape

`Phase 2b` is done because later phases can now build on the preserved baseline rather than continuing baseline churn.

## [x] `Environment-1` - `Phase 2c - Environment Section Organization Pass`

### Phase 2c Summary

#### Purpose

Give the environment-facing toolbar surface one clearer visible organization before preset and runtime widening continues.

#### Owns

- visible toolbar organization
- the dedicated `Shadows` section move
- final `Environment`, `Shadows`, and `Ground` top-level ownership split

#### Does Not Own

- new environment runtime behavior
- new shared environment state
- preset truth
- HDRI runtime

#### Current Status

`Phase 2c` is honestly closed.

The detailed internal `Phase 2c` ladder lives in:
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 Phase 2c - Environment Section Organization Pass.md`

Closure read:
- the dedicated `Shadows` section landed
- `Ground` stayed separate
- the final optional wording-only cleanup slice was intentionally skipped by user decision

### Phase 2c Implementation Spec

#### Source Of Truth

Use the standalone child doc above as the detailed execution record for the shipped internal `2c` ladder.

#### Done Shape

`Phase 2c` is done because the visible toolbar surface is cleaner without claiming any new preset or HDRI runtime behavior.

## [x] `Environment-1` - `Phase 2d - Ground Plane And Floor Read Lane`

### Phase 2d Summary

#### Purpose

Add the first honest ground or floor read so models sit in a more legible studio space than grid-only world zero.

#### Owns

- the first ground-plane runtime
- the dedicated `Ground` toolbar section
- a narrow shared `ground` settings contract

#### Does Not Own

- preset truth
- Browser `Environment` rows or viewport light objects
- HDRI runtime

#### Current Status

`Phase 2d` is shipped.

### Phase 2d Implementation Spec

#### Shipped Read

- added the shared `ground` state contract
- added the dedicated `Ground` section with para-style controls
- landed one viewer-owned visible studio floor runtime

#### Done Shape

`Phase 2d` is done because later preset work no longer has to rediscover basic floor ownership.

## [x] `Environment-1` - `Phase 3 - Add Named Environment Presets And Preset Truth`

### Phase 3 Summary

#### Purpose

Replace the earlier thin environment read with a named preset model without changing the startup default scene.

#### Owns

- named preset language
- preset-to-light-rig mapping
- the first shared preset-apply seam
- the contract between the preserved baseline and opt-in preset choice

#### Does Not Own

- Browser `Environment` rows or viewport light objects
- true HDRI runtime
- post-look grading

#### Current Status

`Phase 3` is shipped and the family-level preset-honesty follow-through is now complete.

The landed result:
- added the first named preset set:
  - `Baseline`
  - `Studio`
  - `Dark Studio`
- routes both the View Toolbar and Catalog through one shared `applyEnvironmentPreset(...)` seam
- preserves the startup baseline as the default scene and default preset choice
- surfaces divergence when manual exposure or lighting edits move the live scene away from the selected preset
- keeps preset background behavior in the shared preset definition seam instead of a viewer-local branch

The next open work:
- `Phase 5` should move active lights and the chosen HDRI into one dedicated Browser `Environment` section
- `Phase 5` should keep Browser downstream from environment-owned truth and stop before viewport-object rendering, selection-driven toolbar routing, or HDRI runtime

### Phase 3 Implementation Spec

#### Shipped Read

Primary landed seams:
- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/app/workspace/CatalogSurface.tsx`
- `src/viewer/Viewer.ts`

What landed:
- explicit shared preset definitions
- one shared preset-apply patch for `envPreset`, `exposure`, and `lighting`
- one visible preset selector in the toolbar
- one Catalog apply path that uses the same environment-owned preset seam

What stayed deferred honestly:
- true environment-light runtime
- Browser `Environment` rows and viewport light objects
- final-image grading

#### Done Shape

`Phase 3` is done because named presets now read honestly, the selected preset no longer hides divergence after manual exposure or lighting edits, and preset background behavior lives in the shared preset definition seam.

## [x] `Environment-1` - `Phase 4 - Add The Visible Environment Tuning Surface`

### Phase 4 Summary

#### Purpose

Make the environment section a practical everyday control surface for opt-in environment tuning instead of a thin preset picker plus raw light editor.

#### Owns

- clearer environment-section control grouping
- quick studio-tuning sliders
- the visible contract for keeping preset changes and custom scene edits readable while the tuning surface grows

#### Does Not Own

- Browser `Environment` rows
- true HDRI runtime
- final-image grading

#### Current Status

`Phase 4` is shipped.

The landed result:
- the Environment section now exposes a practical first visible tuning surface
- tone mapping and exposure now sit in the Environment section as quick studio controls
- the preset-versus-custom read stays honest when the live scene diverges
- the selected preset can be reapplied from the same visible surface

The next open work:
- `Phase 5` should add the Browser `Environment` section and rows
- `Phase 5` should keep Browser downstream from environment-owned truth without widening into viewport light objects or true HDRI runtime

#### First Pass Decisions

- keep the preserved startup baseline unchanged at startup
- add practical scene-tuning controls on top of the active environment state rather than hiding everything inside raw light rows
- keep the visible preset-versus-custom read honest as the tune surface grows
- prefer the existing para-style control family first whenever the setting naturally fits:
  - `ParaSlider`
  - `ParaSelect`
  - `ParaVec3`-style button controls
- keep this phase inside the visible environment surface and the active environment-state contract
- do not widen this phase into true HDRI runtime or Browser `Environment` row work

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Re-read the live preset and tuning seams in:
   - `src/shared/viewSettingsTypes.ts`
   - `src/app/store/uiPrefsStore.ts`
   - `src/app/components/ViewToolbar.tsx`
2. Add the first practical visible environment-tuning controls for the current preset-driven scene
3. Make the visible preset-versus-custom editing contract honest enough that manual edits no longer read like an unchanged named preset by default
4. Keep the startup baseline preserved and opt-in only

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`
- focused proof if needed:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/app/store/useAppStore.test.ts`
  - `src/app/store/uiPrefsStore.test.ts`

#### No-Widening Rule

- do not add Browser `Environment` rows in `Phase 4`
- do not add true environment-light runtime in `Phase 4`
- do not widen into Photoshop-like grading
- do not retune the preserved baseline startup scene automatically

#### Implementation Risks

- leaving the preset label looking more authoritative than the live scene after manual edits
- building only more raw-light controls instead of a practical preset-driven tune surface
- adding ad hoc toolbar widgets when an existing para-style control would cover the setting cleanly
- silently rewriting the baseline scene instead of keeping edits opt-in

#### Checklist

- [x] add the first practical visible tuning controls on top of the preset model
- [x] make the visible preset-versus-custom contract honest
- [x] preserve the startup baseline as the default startup choice
- [x] keep Browser, HDRI runtime, and grading work deferred

#### Verification Shape

Minimum verification for this phase should cover:
- the environment section exposes practical scene-tuning controls beyond the thin preset select
- the visible preset read stays honest after manual scene edits
- the startup scene still boots into the preserved baseline

#### Done Shape

`Phase 4` is done when:
- the user can tune the scene meaningfully without diving into raw light rows for every small change
- the visible preset-versus-custom scene read is honest enough that `Environment-1-HLG-3` advances materially

## [~] `Environment-1` - `Phase 5 - Add The Browser Environment Section And Rows`

### Phase 5 Summary

#### Purpose

Create the first dedicated `Content > Environment` home for active environment objects so lights stop behaving like hidden toolbar-only state.

#### Owns

- the first Browser `Environment` surface under `Content`
- Browser rows for active lights
- one honest current-environment source read without pretending true HDRI runtime has landed
- the first Browser-facing environment-object organization contract

#### Does Not Own

- a second Browser-local environment owner
- viewport wireframe objects
- selection-driven toolbar population
- HDRI runtime

#### Current Live Read

- the Browser now has one dedicated `Environment` surface, but it landed as a boxed custom subsection instead of a normal tree row
- active lights have a Browser-facing home from environment-owned truth
- the current environment source still needs one honest child row that does not overclaim true HDRI runtime
- `Environment` must stay the active owner of environment truth after Browser rows appear

#### First Pass Decisions

- add one explicit `Environment` surface under `Content`
- represent active lights and the current environment source as Browser rows instead of only toolbar-local controls
- keep Browser downstream from environment-owned truth instead of inventing Browser-local state
- do not widen into viewport-object rendering or toolbar-routing yet

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Re-read the current Browser content-section seams and environment-owned light truth
2. Add one dedicated Browser `Environment` surface under `Content`
3. Add rows for active lights and the current environment source through environment-owned state only

#### Likely Files

- Browser-facing content surfaces where the new `Environment` section belongs
- `src/app/store/uiPrefsStore.ts`
- `src/shared/viewSettingsTypes.ts`
- environment docs and indexes

#### No-Widening Rule

- do not create a second Browser-local environment owner
- do not widen this phase into viewport wireframe objects
- do not widen this phase into toolbar selection routing
- do not widen this phase into grading or persistence work

#### Implementation Risks

- letting Browser become a second hidden owner for environment light truth
- landing Browser rows without one explicit `Environment` section contract
- treating HDRI like a completed runtime contribution before the true HDRI phase exists

#### Checklist

- [x] add one dedicated Browser `Environment` surface
- [x] represent active lights as Browser rows
- [~] represent the current environment source honestly without overclaiming HDRI runtime
- [x] keep Browser downstream from environment-owned truth

#### Verification Shape

Minimum verification for this phase should cover:
- Browser shows one explicit `Environment` surface
- active lights and the current environment source appear there honestly
- Browser does not become a second environment owner

#### Done Shape

`Phase 5` is only partially sufficient after the first implementation because:
- the Browser has an environment-owned surface, but it is boxed instead of a real Browser collection row
- active lights have one Browser home, but the current environment source row still needs the normal tree hierarchy contract
- `Phase 5.1` must normalize the Browser hierarchy before the family relies on Browser row identity for viewport picks or later toolbar routing

## [x] `Environment-1` - `Phase 5.1 - Normalize The Browser Environment Tree Row Hierarchy`

### Phase 5.1 Summary

#### Purpose

Correct the Browser shape from a boxed custom `Environment` subsection into a real Browser collection row under `Content`, derived from the environment objects the user gets by default or later adds or loads, with environment-owned children that later viewport picks and toolbar routing can resolve to honestly.

#### Owns

- one real Browser `Environment` collection row under `Content`
- environment-owned child rows below that parent
- a current environment source child row that does not claim true HDRI runtime
- environment light child rows under the same parent
- review follow-through that viewport-picked environment lights resolve back to matching Browser rows

#### Does Not Own

- toolbar population from the selected light
- transform editing
- true HDRI runtime
- environment intensity or background-versus-lighting separation
- Phase 7 or later toolbar-routing work

#### Current Live Read

- `Phase 5.1` replaced the custom boxed Browser subsection with a natural `Content > Environment` tree hierarchy
- Browser row identity is now stable enough for later selected-toolbar routing to build on it
- the first honest child rows are:
  - the current environment source row
  - environment light rows
- the current environment source row should describe the selected source or preset honestly without pretending the viewer has true HDRI light contribution yet
- viewport-picked environment lights resolve back to the corresponding Browser row ids such as `environment-light-row:<lightId>`

#### First Pass Decisions

- make `Environment` a real Browser collection row under `Content`
- place the current environment source row and environment light rows under that parent
- keep Browser rows downstream from environment-owned truth
- keep the active source language honest until true HDRI runtime exists
- map viewport-picked environment lights back to the matching Browser environment-light row when the pick seam is present

### Phase 5.1 Implementation Spec

#### Exact First Code Cut

1. Re-read the Browser tree selector, row-family, presenter, and panel-controller seams that currently render the boxed environment subsection
2. Replace the boxed `Environment` subsection with a real Browser collection row under `Content`
3. Add child rows for the current environment source and environment lights from environment-owned truth
4. Ensure viewport-picked environment lights resolve to the matching Browser environment-light row id where the viewport pick seam already exists
5. Keep HDRI wording limited to current source or selected environment source unless true HDRI runtime is actually present

#### Likely Files

- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserRowFamilies.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- focused proof:
  - `src/app/panels/selectBrowserTreeRows.test.ts`
  - `src/app/panels/browserTreeSections.test.tsx`
  - `src/app/panels/browserInteractions.test.ts`

#### No-Widening Rule

- do not populate the toolbar from selected environment lights
- do not add transform editing
- do not add true HDRI runtime
- do not add environment intensity, background-versus-lighting separation, or orientation controls
- do not widen into `Phase 7` or later work

#### Implementation Risks

- keeping the boxed subsection while only renaming it as a tree row
- creating Browser-local environment state instead of deriving rows from environment-owned truth
- overclaiming HDRI runtime by labeling the source row as a real lighting contribution before that runtime exists
- resolving viewport-picked lights to light ids only without synchronizing the matching Browser row

#### Checklist

- [x] make `Environment` a real Browser collection row under `Content`
- [x] add the current environment source child row
- [x] add environment light child rows
- [x] keep all rows derived from environment-owned truth
- [x] keep HDRI/runtime language honest
- [x] resolve viewport-picked environment lights back to the matching Browser row

#### Verification Shape

Minimum verification for this phase should cover:
- Browser renders `Environment` as a normal tree row under `Content`
- expanding `Environment` shows the current environment source row and light rows
- no Browser row claims true HDRI runtime if the runtime is not present
- a viewport-picked environment light maps back to the matching Browser row id when the viewport pick seam exists

#### Done Shape

`Phase 5.1` is done when:
- the Browser environment surface is a natural tree hierarchy instead of a boxed custom subsection
- the first child rows are the current environment source and environment lights
- viewport-picked environment lights can resolve to the matching Browser row without adding toolbar population or true HDRI runtime

## [x] `Environment-1` - `Phase 5.2 - Browser Environment Row Visual Parity`

### Phase 5.2 Summary

#### Purpose

Fix the visual follow-through after `Phase 5.1`: the Browser `Environment` surface should not merely be structurally normal in the tree data. It should also look and behave visually like the mature Browser rows around it, especially the `Assembly 1` and `References` collection rows that use the shared content-state bar language.

#### Owns

- Environment row visual parity with normal Browser collection rows
- removing the unstyled custom `isEnvironmentRow` / `BrowserContentStateBar--environment` look that makes the row appear like a boxed or ugly special case
- reusing the established content-row surface treatment for the `Environment` root where possible
- making environment source and light child rows read as natural nested Browser rows
- focused Browser presenter/theme proof that Environment rows receive the expected row classes or styled state bars

#### Does Not Own

- changing the environment-owned row data contract from `Phase 5.1`
- adding true HDRI runtime or claiming HDRI lighting contribution
- changing viewport wireframe light object behavior
- adding delete-key behavior
- adding Console breadcrumbs or real-object actions
- populating the View Toolbar from selected lights
- changing the underlying startup scene lighting baseline

#### Current Live Read

- `Phase 5.1` made `Environment` a real `Content > Environment` tree row structurally
- the presenter still routes environment rows through a custom Environment visual branch
- the custom Environment branch emits `BrowserContentStateBar--environment` classes that do not have matching visual definitions in the Browser theme
- the `Environment` row therefore falls back to generic button/card chrome while `Assembly 1` gets the polished content-row state-bar treatment
- this phase should close that visual mismatch before the Browser row becomes the base for later delete, Console, and toolbar work

#### First Pass Decisions

- keep the `Environment` data hierarchy from `Phase 5.1`
- prefer reusing the same content-row visual path as `Assembly`, `component`, `object`, or `References` rows instead of inventing another bespoke Environment skin
- if Environment-specific classes remain, they must be fully styled and must inherit the transparent row-main treatment used by mature Browser rows
- child rows should stay visually quieter than the root row while still reading as normal nested Browser rows
- implementation should be presentation-only unless a tiny presenter-class adjustment is required to reach the shared Browser row chrome

#### Implementation Status

`Phase 5.2` is implemented. The next legal cut is `Phase 6.1`, and it should keep the `Phase 5.1` data contract intact.

### Phase 5.2 Implementation Spec

#### Exact First Code Cut

1. Re-read the `Phase 5.1` Environment row contract and keep the Environment row ids, child ordering, and viewport selection behavior unchanged.
2. In `src/app/panels/browserTreeRowPresenter.tsx`, remove the Environment-only custom visual branch as the primary chrome path and make the Environment root and child rows reuse the mature Browser content-row treatment as closely as possible.
3. In `src/app/theme/surfaces/browser.css`, make any remaining Environment-specific classes inherit the same polished row-main and state-bar language that already makes `Assembly` and `References` look finished.
4. Keep the fix presentation-only: no row-data changes, no new selection semantics, and no runtime behavior beyond Browser visual parity.

#### Likely Files

- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`
- focused proof:
  - `src/app/panels/browserTreeSections.test.tsx`
  - `src/app/panels/browserTreeRowPresenter.test.tsx`
  - `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not change the `Phase 5.1` Environment row contract, child ordering, or row ids
- do not add delete-key behavior, Console breadcrumbs/actions, toolbar population, true HDRI runtime, viewport helper changes, or startup lighting changes
- do not widen into later phases or into a second Environment-only Browser visual language
- do not touch the Browser selection model except to preserve the existing `Phase 5.1` behavior

#### Implementation Risks

- leaving the Environment root on the bespoke `BrowserContentStateBar--environment` branch and missing the parity goal
- styling the root row but forgetting the child Environment rows, so the hierarchy still reads like a special case
- accidentally changing visibility, expansion, or selection behavior while cleaning up the chrome
- overfitting the CSS so the Environment fix breaks mature `Assembly` or `References` rows

#### Verification Commands

- `pnpm test -- src/app/panels/browserTreeSections.test.tsx src/app/panels/browserTreeRowPresenter.test.tsx src/app/panels/BrowserPanel.test.tsx`
- `pnpm test -- src/app/panels/browserTreeSections.test.tsx`
- optional browser UI spot-check: confirm Environment now matches the mature Browser row language while `Phase 5.1` row identity and selection behavior still pass

#### Done Checklist

- [x] Environment root uses the same polished Browser content-row chrome as the mature collection rows
- [x] Environment child rows remain nested and visually quiet but no longer look like an unstyled special case
- [x] the presenter and CSS changes stay presentation-only and preserve the `Phase 5.1` row contract
- [x] focused Browser presenter/panel tests pass for the Environment row parity path

#### Verification Shape

Minimum verification for this phase should cover:
- Browser `Environment` root uses normal content-row visual treatment instead of generic boxed button chrome
- environment source and light children remain visible under `Environment`
- existing `Phase 5.1` row identity behavior still passes, including viewport-picked environment lights resolving back to matching Browser rows
- no tests or snapshots imply true HDRI runtime or selected-toolbar behavior that this phase does not own

#### Done Shape

`Phase 5.2` is done when:
- `Environment` visually matches the mature Browser tree-row language used by rows like `Assembly 1` and `References`
- no unstyled Environment-only state-bar class creates the boxed or ugly row appearance
- the fix stays presentation-scoped and preserves the `Phase 5.1` environment-owned Browser row contract

## [ ] `Environment-1` - `Phase 6 - Add Viewport Light Objects And Shared Selection`

### Phase 6 Summary

#### Purpose

Make the environment lights read like real scene objects in the model viewport while keeping Browser rows, viewport picks, and selected-object truth aligned.

#### Owns

- wireframe viewport-object representation for environment lights
- one honest object-shape language per light type
- the first shared selected environment-object contract across Browser and viewport

#### Does Not Own

- filled meshes or production render geometry for light helpers
- toolbar population details
- true environment-light runtime

#### Current Live Read

- the Browser now has an `Environment` section, but the viewport still lacks object language
- lights are not yet selectable as visible helpers in the viewport
- Browser selection and viewport picks still do not share one selected environment-object contract

#### First Pass Decisions

- render light helpers as wireframes only
- keep each light type visually distinct but lightweight
- start with one honest shape language:
  - point light -> sphere
  - spot light -> cone
  - directional light -> sun-arrow or directional-disc with heading
  - area light -> rectangle
- keep Browser row selection and viewport picking pointed at one shared selected environment object

### Phase 6 Implementation Spec

#### Exact First Code Cut

1. Re-read the current Browser environment rows, viewer light runtime, and selection seams
2. Render wireframe light helpers in the viewport
3. Make Browser row selection and viewport picks resolve to the same selected environment object

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- Browser selection or content surfaces that host environment rows
- `src/viewer/Viewer.ts`
- focused proof:
  - `src/viewer/Viewer.test.ts`

#### No-Widening Rule

- do not widen into true environment-light runtime in `Phase 6`
- do not widen into toolbar edit-surface migration in `Phase 6`
- do not render filled light meshes

#### Implementation Risks

- letting viewport helpers become decorative only instead of selectable environment objects
- inventing one shape language in Browser and a different one in the viewport
- widening into toolbar routing before selection identity is stable

#### Checklist

- [ ] add wireframe viewport objects for environment lights
- [ ] keep one lightweight shape per light type
- [ ] keep Browser rows and viewport picks on one selected environment-object contract

#### Verification Shape

Minimum verification for this phase should cover:
- light helpers appear in the viewport as wireframes
- each light type reads as a distinct object shape
- selecting a Browser row or viewport helper points at the same selected environment object

#### Done Shape

`Phase 6` is done when:
- environment lights read as real selectable scene objects in the viewport without widening into full toolbar migration or HDRI runtime

## [x] `Environment-1` - `Phase 6.1 - Shared Delete And Console Context For Selected Environment Objects`

### Phase 6.1 Summary

#### Purpose

Make selected environment objects behave like real scene objects for delete and Console-context reading without widening into the later toolbar-population pass.

#### Owns

- delete-key routing for selected environment objects through the shared selection and command path
- Console context for selected environment objects, including breadcrumbs and object-style actions
- environment-owned truth as the backing source for both delete and Console reads

#### Does Not Own

- toolbar population from selected environment objects
- transform editing for selected environment objects
- new Browser hierarchy normalization
- true environment-light runtime

#### Current Live Read

- `Phase 5.1` already normalized the Browser `Environment` row and child rows
- `Phase 6` already established the selected environment-object contract in the viewport
- selected environment objects now delete through the shared selection and command path like real scene objects
- Console now shows selected environment objects with real-object breadcrumbs and object-style actions

#### First Pass Decisions

- route delete for selected environment objects through the shared selection/command path wherever that path already exists
- keep delete behavior backed by environment-owned truth instead of Browser-local or Console-local copies
- make Console reuse real-object-style context affordances such as breadcrumbs, delete, hide or show, and back where those actions make sense
- keep this as a follow-up to the selection identity work from `Phase 5.1` and `Phase 6`, not a toolbar population pass

### Phase 6.1 Implementation Spec

#### Exact First Code Cut

1. Re-read the selected environment-object contract from `Phase 6` and the Browser row identity from `Phase 5.1`
2. Route Delete-key handling for selected environment objects through the shared selection and command path
3. Feed Console selected-environment-object context from environment-owned truth so breadcrumbs and object-style actions appear for those selections

#### Likely Files

- `src/app/panels/browserInteractions.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsolePanel.tsx`
- `src/app/console/consoleReferenceContentCommands.ts`
- `src/app/console/consoleFormatters.ts`
- focused proof:
  - `src/app/panels/browserInteractions.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/consoleReferenceContentCommands.test.ts`

#### No-Widening Rule

- do not implement the later toolbar-population pass in `Phase 6.1`
- do not reopen Browser hierarchy normalization from `Phase 5.1`
- do not add new viewport object shapes or true environment-light runtime
- do not introduce Browser-local or Console-local copies of selected environment-object truth

#### Implementation Risks

- routing Delete from the wrong selected-object source and accidentally making environment objects diverge from the shared selection path
- showing Console breadcrumbs that read like copied Browser state instead of environment-owned truth
- drifting into toolbar selection or transform editing before the shared delete and Console-context contract is settled

#### Checklist

- [x] route Delete-key handling for selected environment objects through the shared selection path
- [x] show selected environment objects in Console context with breadcrumbs
- [x] expose normal object-style actions such as delete, hide or show, and back where appropriate
- [x] keep all of those actions backed by environment-owned truth

#### Verification Shape

Minimum verification for this phase should cover:
- pressing Delete on a selected environment object deletes that object through the shared selection path
- Console shows the selected environment object with breadcrumbs
- Console exposes normal object-style actions for the selected environment object
- the readout stays backed by environment-owned truth instead of Browser-local or Console-local copies

#### Done Shape

`Phase 6.1` is done when:
- selected environment objects delete like real scene objects
- Console treats selected environment objects like real selected objects with honest breadcrumbs and actions
- the phase stays a follow-up to `Phase 5.1` and `Phase 6` without widening into toolbar population

## [x] `Environment-1` - `Phase 6.2 - Frame Selected Environment Objects`

### Phase 6.2 Summary

#### Purpose

Make selected environment objects zoomable and frameable like normal scene objects, so the user can quickly navigate to a light or environment helper before editing it.

#### Owns

- selected environment-object zoom or frame behavior
- the bounds or target-point contract needed for environment-object framing
- Console and Browser zoom actions that frame the selected environment object through the existing selected-object framing path

#### Does Not Own

- View Transform movement for selected environment objects
- selected-light setting controls in the View Toolbar
- true environment-light runtime
- new light helper shape language beyond what `Phase 6` already established

#### Current Live Read

- `Phase 6` gives environment lights selectable viewport helper identity
- `Phase 6.1` gives selected environment lights Console context and object-style actions
- selected environment lights still need an honest frame target before object-local zoom can behave like it does for normal scene objects

#### First Pass Decisions

- keep zoom/framing downstream of the selected environment-object contract
- derive frame targets from environment-owned light truth, not from decorative helper-only state
- use the existing selected-object framing path where possible instead of adding an environment-only camera shortcut
- keep this phase focused on navigation only; movement belongs to `Phase 6.3`

### Phase 6.2 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed `environment-light` selection contract from `src/app/components/ViewerHost.tsx`, `src/app/panels/browserInteractions.ts`, `src/app/store/workspaceSelectionCommands.ts`, and `src/app/store/useAppStore.ts`.
2. Add one shared viewer command for framing a selected environment light by `lightId`, parallel to `frameSelectedCommand(...)` and `frameReferenceCommand(...)`, instead of forcing environment lights into `selectedPartKey`.
3. Add a viewer-side frame target seam that resolves `lightId` to the live environment-light helper generated from shared `ViewSettings.lighting.lights`; frame the helper object when present and return a boolean success value so callers can keep current no-op/fallback behavior honest.
4. Route Browser environment-light double-click or zoom intent through that shared command after resolving the row back to `environment-light-row:<lightId>`.
5. Route Console selected environment-light `Zoom > Object` through the same command by carrying `environmentLightId` through the existing `contentObjectSelected` and `contentObjectZoomRoot` staged-navigation session.
6. Add focused proof for the viewer command, Browser row routing, Console staged navigation, and Console command execution.

#### Concrete File Focus

- `src/app/viewerBridge.ts`
  - extend the viewer bridge contract with an environment-light framing method that returns success/failure.
- `src/app/viewCommands.ts`
  - add the shared command wrapper, likely `frameEnvironmentLightCommand(lightId, viewportId?, options?)`.
- `src/viewer/Viewer.ts`
  - add the actual frame implementation against `environmentLightHelpersById`.
  - keep helper placement derived from `applySpecToEnvironmentLightHelper(...)`, which already consumes environment-owned light specs.
- `src/app/panels/browserInteractions.ts`
  - update `handleDoubleSelectBrowserRow(...)` so `rowKind === 'environment-light'` frames the selected light helper.
  - do not route through `visibilityPartKeys`; environment-light rows do not have part keys.
- `src/app/console/stagedNavigation.ts`
  - add `ROOT_ZOOM_CHOICE` to environment-light selected choices.
  - keep `contentObjectZoomRoot` carrying `selections.environmentLightId` so Back returns to the selected light context.
- `src/app/console/useConsoleInteraction.ts`
  - when `Zoom > Object` is executing and the staged session has `environmentLightId`, call the new shared environment-light frame command before falling back to the existing part/reference warning path.
- Focused tests:
  - `src/viewer/Viewer.test.ts`
  - `src/app/viewCommands.test.ts`
  - `src/app/panels/browserInteractions.test.ts`
  - `src/app/console/stagedNavigation.test.ts`
  - `src/app/console/ConsoleDock.test.tsx`

#### No-Widening Rule

- Do not make environment lights masquerade as `part:*` selections or populate `selectedPartKey`; their selected target remains `{ kind: 'environment-light', lightId }`.
- Do not implement View Transform movement, transform target registration, gizmo activation, or light-position commits; that remains `Phase 6.3`.
- Do not add or retire selected-light toolbar controls; selected-light settings remain later toolbar work.
- Do not change helper shape language, light runtime contribution, HDRI source behavior, preset truth, or baseline lighting.
- Do not introduce Browser-local or Console-local light geometry; the frame target must resolve from environment-owned light truth and the live viewer helper map.

#### Implementation Risks

- The current `frameSelectedCommand(partKey)` path falls back to `frameAll()` for missing part ids, which would hide failed environment-light resolution if reused blindly.
- Browser object double-click currently frames object rows via `visibilityPartKeys` and references via `referenceIds`; environment-light rows need their own branch because their selected `partKey` is intentionally `null`.
- Console zoom currently depends on `resolveSelectedObjectPartKeyForZoom()` and `resolveSelectedReferenceIdForZoom()`, so selected environment lights will continue warning until `environmentLightId` is checked explicitly.
- Helper objects are decorative but their placement is already derived from `ViewSettings.lighting.lights`; the implementation should frame the helper while documenting that the truth source is still the light spec.
- Hidden or deleted lights can leave stale selected context during edge cases; the command should return `false` when no live helper exists instead of silently framing all.

#### Verification Shape

Minimum focused verification for this implementation should cover:
- `Viewer.frameEnvironmentLight(...)` frames the helper for a live `lightId` and returns `true`.
- `Viewer.frameEnvironmentLight(...)` returns `false` for a missing `lightId` without calling `frameAll()`.
- Browser double-click on an `environment-light` row calls the new environment-light frame command and does not require `visibilityPartKeys`.
- Console selected environment-light context exposes `Zoom`, and `Zoom > Object` calls the same environment-light frame command.
- Existing object and reference zoom tests still pass, proving the shared selected-object framing path was extended rather than replaced.

#### Checklist

- [x] add selected environment-object frame targets or bounds
- [x] route Browser-selected environment-object zoom through the selected-object framing path
- [x] route Console-selected environment-object zoom through the same framing path
- [x] keep viewport helper framing backed by environment-owned light truth

#### Verification Shape

Minimum verification for this phase should cover:
- selected environment-light zoom frames the helper or light position
- Browser and Console zoom actions resolve to the same selected environment object
- object-local zoom does not bypass shared selected-object truth

#### Done Shape

`Phase 6.2` is done when:
- selected environment objects can be zoomed to like real scene objects without widening into movement or selected-light settings

Current status:
- `Phase 6.2` is implemented and focused verification passed
- Browser environment-light double-click routes through the shared environment-light frame command
- Console selected environment-light `Zoom > Object` routes through the same frame command and keeps Back returning to the selected environment-light context
- missing environment-light helpers return framing failure without silently framing all
- `Phase 6.3` now owns the movement-only cut on top of this framing path

## [x] `Environment-1` - `Phase 6.3 - Move Selected Environment Objects Through View Transform`

### Phase 6.3 Summary

#### Purpose

Let the user move selected environment objects through the shared View Transform toolbar, with transform commits writing back to environment-owned light truth.

#### Owns

- registering selected environment objects as valid View Transform targets
- moving environment light position through the shared transform commit path
- keeping viewport helpers, Browser rows, Console context, and View Transform state pointed at the same environment-owned object after movement

#### Does Not Own

- per-light setting controls such as intensity, type, color, cone angle, or shadow controls
- retirement of the old toolbar-local light list
- true environment-light runtime
- HDRI transform or orientation controls

#### Current Live Read

- selected environment lights can be represented, selected, deleted, zoomed, and shown in Console context
- positioned environment lights can now participate in the shared transform target model
- the later selected-light settings pass should still not own basic object movement because movement now rides the existing View Transform toolbar contract

#### First Pass Decisions

- treat environment light position as the first transform-supported field
- use the existing View Transform toolbar language instead of inventing a one-off environment movement widget
- write transform commits back into the shared environment light data so the helper, Browser row, Console context, and renderer stay honest
- leave non-position transforms and per-light settings for later phases unless the current light type already has a safe existing transform field

### Phase 6.3 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed `Phase 6.2` environment-light frame/helper seam and the existing View Transform target model.
2. Extend the shared View Transform target/session contract to include environment lights without changing the selected workspace target shape:
   - keep workspace selection as `{ kind: 'environment-light', lightId }`
   - add a View Transform target shape such as `{ kind: 'environment-light', lightId }` only inside the transform/session APIs
3. Add one environment-light transform shell/session path that mirrors the existing reference/content-object shell lifecycle closely enough for the shared View Transform toolbar to render and start translate entries.
4. Limit the first transform mode to translate/move for light types with a real `LightSpec.position` field.
5. Feed the active environment-light transform session into `ViewerHost -> viewer.setViewerTransformSession(...)`, then teach the viewer to attach the transform gizmo to the matching `environmentLightHelpersById` helper.
6. On transform change, convert the helper translation draft into a new light `position` draft for the active light.
7. On transform commit, write the committed `position` back through environment-owned truth, most likely `useUiPrefsStore.getState().updateLight(lightId, { position })`, then let normal `applyViewSettings(...)` refresh the light, helper, Browser row metadata, and Console context.
8. Preserve Browser and Console selection after commit; do not rewrite selection into `part:*`, content-object ids, or toolbar-local selected-light state.

#### Concrete File Focus

- `src/app/store/useAppStore.ts`
  - extend `ViewerTransformTarget`, `ActiveViewerTransformSession`, and selectors such as `selectActiveViewerTransformTarget(...)`, `selectActiveViewerTransformSession(...)`, `selectActiveViewerTransformHistoryEntries(...)`, and `selectActiveViewerTransformSnapState(...)` only as much as environment-light translate support requires
  - add environment-light transform shell/session actions or a minimal generic branch for active environment-light target lifecycle
  - keep any environment-light transform draft narrow to position/move state rather than adopting full reference transform history unless the current generic helpers can be reused safely
- `src/app/viewerBridge.ts`
  - extend `ViewerTransformTarget` and `ViewerTransformSession` with the environment-light target shape so `ViewerHost` and `Viewer` agree on the same target id
- `src/app/components/ViewerHost.tsx`
  - include active environment-light transform sessions in `activeViewerTransformSession`
  - accept viewer transform change events for `target.kind === 'environment-light'`
  - commit active environment-light translate drafts back to `useUiPrefsStore.updateLight(...)`
  - keep `setViewerTransformSession(...)` synchronized without touching content-object transform groups
- `src/viewer/Viewer.ts`
  - extend `setViewerTransformSession(...)`, `getActiveViewerTransformObject()`, active entry-origin reads, and transform-change target emission to support environment-light helpers by `lightId`
  - attach the transform gizmo to `environmentLightHelpersById.get(lightId)` when an environment-light transform session is active
  - keep helper placement source-of-truth in `applySpecToEnvironmentLightHelper(...)`; the gizmo move should be a draft/commit path, not a second persistent helper transform owner
- `src/app/components/ReferenceTransformToolbar.tsx`
  - render the existing View Transform shell for an environment-light target, preferably with translate/move enabled and rotate/scale disabled or inert for this phase
  - use the current active transform target/session selectors rather than special-casing a separate light movement panel
- `src/app/console/stagedNavigation.ts`, `src/app/console/useConsoleInteraction.ts`, and `src/app/console/ConsoleDock.tsx`
  - route selected environment-light `Move` or `Transform > Move` into the same transform shell only if needed to match existing object behavior
  - keep Back returning to the selected environment-light context
- Focused proof:
  - `src/app/store/useAppStore.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/viewer/Viewer.test.ts`
  - `src/app/components/ReferenceTransformToolbar.test.tsx`
  - existing Browser/Console selected-environment-light tests where movement entry points are covered

#### No-Widening Rule

- Do not implement per-light settings such as intensity, color, type, target, cone angle, distance, decay, shadow settings, or enabled state; those remain selected-light toolbar work in `Phase 7` or later.
- Do not retire or redesign the old toolbar-local light list.
- Do not add true environment-light runtime, HDRI orientation, HDRI placement, environment intensity, or background-versus-lighting separation.
- Do not make environment lights look like content objects, references, or `part:*` selections just to reuse transforms.
- Do not add rotate or scale support unless the existing View Transform code requires harmless defaults; if exposed, they must not commit any environment-light setting in this phase.
- Do not create a second persistent helper-position store; committed movement must update the environment-owned `LightSpec.position`.

#### Implementation Risks

- The active View Transform target union currently assumes only `reference` and `content-object`, so a partial target extension can silently fall into the content-object branch if every selector and switch is not updated together.
- Existing reference/content-object transform history is rich and may be overkill for light movement; reusing it without a clear persistence mapping could accidentally create hidden light transform history instead of a direct position commit.
- `LightSpec` types such as `ambient` and `hemisphere` do not have applicable positions after normalization, so the first cut should gate transformability to positioned light types or fail gracefully.
- The viewer helper is the gizmo attachment object, but the persistent truth is still `ViewSettings.lighting.lights`; direct helper mutation must be treated as draft state only.
- `applyViewSettings(...)` will recreate or reposition helpers from the light spec, so commit ordering should avoid a snap-back frame where the gizmo moves the helper but the store has not yet accepted the position.
- Console and Browser both already use selected environment-light context; movement entry should preserve that context rather than switching to a content-object transform session.

#### Verification Shape

Minimum focused verification for this implementation should cover:
- selecting an environment light can open or activate the shared View Transform toolbar without setting `selectedPartKey`.
- starting a translate/move entry for a positioned environment light attaches the viewer gizmo to the matching environment-light helper.
- changing the viewer transform draft updates the active environment-light transform draft for that same `lightId`.
- committing the move calls the environment-owned light mutation path and updates `LightSpec.position`.
- after commit, `Viewer.applyViewSettings(...)` places the environment-light helper at the committed position.
- Browser selected row id, Console selected context, and `view.lighting.selectedLightId` still point at the same light after movement.
- non-positioned light types do not expose a broken move path or commit bogus position data.

#### Checklist

- [x] register selected environment lights as transformable View Transform targets
- [x] move environment light position through the shared transform commit path
- [x] update viewport helper placement from the committed environment-owned light truth
- [x] keep Browser and Console selection stable after movement

#### Implementation Result

- selected environment lights are represented in the shared View Transform target/session union without rewriting workspace selection into a content object or `part:*` target
- the shared View Transform toolbar can show an environment-light target and keeps the first cut translate-only
- `ViewerHost` starts an environment-light transform shell for selected positioned lights and keeps non-positioned light types out of the move path
- `Viewer` attaches the gizmo to the matching `environmentLightHelpersById` helper and reports helper translation through the shared viewer-transform callback
- committed movement writes back through `useUiPrefsStore.updateLight(lightId, { position })`, so `applyViewSettings(...)` remains the helper placement source of truth
- focused proof now covers the store commit path, non-positioned light gating, helper movement callback, helper framing path, and the full production build

#### Verification Shape

Minimum verification for this phase should cover:
- [x] selecting an environment light enables the shared View Transform toolbar for that target
- [x] committing a move updates the environment-owned light position
- [x] the viewport helper reflects the moved position
- [x] Browser and Console still refer to the same selected environment object after the move

#### Done Shape

`Phase 6.3` is done when:
- selected environment objects can be moved through the shared View Transform toolbar like real scene objects, without widening into selected-light settings or true environment-light runtime

## [x] `Environment-1` - `Phase 7 - Route Selected Lights Into The Toolbar`

### Phase 7 Summary

#### Purpose

Make light setting editing selection-driven so clicking a light in the Browser or viewport populates the toolbar for that exact light instead of relying on the old toolbar-local list.

#### Owns

- toolbar population from the selected light
- selected-light setting controls that are not already owned by the shared View Transform toolbar
- retirement of the old toolbar-local light list
- Browser eye visibility as the light on-or-off control

#### Does Not Own

- true environment-light runtime
- HDRI intensity and background-versus-lighting separation
- Catalog HDRI browsing

#### Current Live Read

- Browser rows and viewport helpers can exist first, but the toolbar still needs to follow selected-object truth
- object framing and movement should already be handled by `Phase 6.2` and `Phase 6.3`
- the old toolbar-local light list should retire once selection-driven editing exists
- light visibility should move onto Browser row eye behavior instead of a second light-list owner

#### First Pass Decisions

- populate the toolbar from the selected light only
- let the toolbar own per-light settings for the selected light while View Transform owns basic object movement
- prefer the existing para-style control family first for selected-light editing where the control semantics fit:
  - `ParaSlider`
  - `ParaSelect`
  - `ParaVec3`-style button controls
- retire the older toolbar-local list instead of keeping two competing light-picking surfaces
- route light on or off through the Browser eye control

### Phase 7 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed selected environment-object seam from `Phase 6.3`
2. Populate toolbar controls from the selected light
3. Retire the older toolbar-local light list and route light visibility through Browser eye behavior

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`
- Browser-facing environment surfaces where row-eye visibility is rendered
- `src/viewer/Viewer.ts`

#### No-Widening Rule

- do not widen into true environment-light runtime
- do not widen into HDRI browsing or grading
- do not keep the old toolbar list alive as a second selector after the new contract lands

#### Implementation Risks

- keeping both the Browser and toolbar list as competing light selectors
- making viewport selection behave differently from Browser selection
- introducing one-off selected-light widgets when the para-style controls already match the setting
- treating Browser eye visibility and toolbar visibility as separate truths

#### Checklist

- [x] populate the toolbar from the selected light
- [x] support selected-light setting edits through the toolbar
- [x] retire the older toolbar-local light list
- [x] use Browser eye visibility for light on or off

#### Verification Shape

Minimum verification for this phase should cover:
- [x] selecting a light in the Browser populates the toolbar for that light
- [x] selecting a light helper in the viewport populates the same toolbar state
- [x] selected-light settings use the existing para-style control family where it fits
- [x] Browser eye visibility turns lights on or off without a second owner

#### Implementation Result

- the Environment toolbar now exposes one `Selected Light` editor that follows `view.lighting.selectedLightId`, which Browser and viewport environment-light selection already update through the shared selected-target seam
- the older toolbar-local light list, per-row selector, delete button, and toolbar enabled selector are gone, leaving Browser and viewport selection as the light-picking source
- selected-light edits remain on the existing para-style control family for type, intensity, vectors, distance, decay, spot settings, and shadow settings
- Browser environment-light rows now render the normal visibility eye, and clicking it writes to `LightSpec.enabled` through the Browser interaction dependency instead of creating separate toolbar visibility truth
- focused tests cover the retired toolbar list, selected-light editor controls, Browser-eye rendering, and Browser-eye-to-light-enabled routing

#### Verification Result

- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx src/app/panels/browserInteractions.test.ts src/app/panels/browserTreeRowPresenter.test.tsx`
- `npm.cmd exec tsc -- --noEmit --pretty false`

#### Done Shape

`Phase 7` is done when:
- light editing is genuinely selection-driven across Browser, viewport, and toolbar, and the old toolbar light list is gone

## [x] `Environment-1` - `Phase 8 - Add Active HDRI Ownership And The First True Environment-Light Runtime`

### Phase 8 Summary

#### Purpose

Make the chosen HDRI a first-class environment entry and move the viewer from preset-background-only behavior into true environment-light contribution.

#### Owns

- active HDRI ownership under the Browser `Environment` section
- the first honest environment-light runtime seam
- the split between background treatment and light contribution

#### Does Not Own

- intensity and background-versus-lighting tune controls
- final proof and family closeout
- Catalog HDRI browsing

#### Current Live Read

- the Browser can now own one active HDRI entry
- direct lights still carry the real scene-lighting load today
- background treatment and light contribution need an explicit runtime seam before later tune controls

#### First Pass Decisions

- keep the active HDRI represented as one environment-owned Browser entry
- add true environment-light contribution without silently replacing direct-light ownership
- keep background treatment and light contribution conceptually separate even if the first cut keeps them visually coupled
- stop before later tune controls and final proof

### Phase 8 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed Browser `Environment` section, selected-object seam, and viewer background apply seam
2. Keep active HDRI ownership inside the `Environment` content surface
3. Add one explicit environment-light runtime seam
4. Keep background treatment and light contribution as explicit separate concepts

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- Browser-facing environment surfaces where the active HDRI row lives
- `src/viewer/Viewer.ts`
- focused proof:
  - `src/viewer/Viewer.test.ts`

#### No-Widening Rule

- do not widen into intensity or background-separation controls yet
- do not widen into grading, persistence, or Catalog browseable HDRI ownership
- do not reopen baseline-scene retuning

#### Implementation Risks

- treating the chosen HDRI as Catalog-owned active state instead of Environment-owned active state
- keeping environment-light contribution too implicit and recreating split-truth
- making background and lighting contribution too tangled to tune later

#### Checklist

- [x] keep the active HDRI owned under the Browser `Environment` section
- [x] add one explicit environment-light runtime seam
- [x] keep background treatment and light contribution conceptually separate

#### Verification Shape

Minimum verification for this phase should cover:
- the active HDRI has one honest Environment-owned content entry
- environment changes can affect model lighting directly instead of only changing background appearance
- the environment-light runtime seam is explicit enough to tune later

#### Implementation Result

- the Browser source child under `Content > Environment` now uses one active environment-source row identity for preset, custom, or HDRI sources instead of deriving HDRI row identity from the selected preset id
- HDRI sources still flow through environment-owned `ViewSettings.environmentSource`, so Catalog apply remains an upstream handoff and does not own the active runtime state
- `Viewer.applyEnvironmentSource(...)` now resolves background treatment and environment-light contribution separately before applying the shared HDRI texture
- the HDRI texture is applied to `scene.environment` for model-light contribution while `scene.background` remains a separate treatment path that can stay hidden or show the HDRI background
- direct lights continue to apply from `ViewSettings.lighting.lights`; this phase does not replace the key, fill, rim, or selected-light ownership model

#### Verification Result

- `npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/browserTreeSections.test.tsx src/viewer/Viewer.test.ts`
- `npm.cmd exec tsc -- --noEmit --pretty false`

#### Done Shape

`Phase 8` is done when:
- the chosen HDRI is represented as one first-class environment entry
- the viewer has true environment-light contribution instead of only preset-driven background switching

## [x] `Environment-1` - `Phase 9 - Add Environment Intensity And Background-Versus-Lighting Separation`

### Phase 9 Summary

#### Purpose

Make the new environment-light runtime practically tunable.

#### Owns

- environment intensity
- background-versus-lighting separation
- the first honest visible tune controls for the chosen environment

#### Does Not Own

- Catalog HDRI browsing
- final closeout or grading work

#### Current Live Read

- once `Phase 8` lands, the environment-light runtime will still need practical tune controls
- the family still needs one honest split between background appearance and lighting contribution

#### First Pass Decisions

- expose intensity for environment-light contribution
- allow background appearance and lighting contribution to move together or separately where appropriate
- keep those controls attached to the active chosen environment state instead of the untouched startup baseline

### Phase 9 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed runtime seam from `Phase 8`
2. Add environment intensity and background-versus-lighting separation
3. Keep the visible controls grounded in the environment surface

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/viewer/Viewer.ts`

#### No-Widening Rule

- do not widen into grading sliders
- do not widen into browsing or asset-library work
- do not silently rewrite the startup baseline

#### Implementation Risks

- adding tune controls that are too tied to one hardcoded environment look
- making the new controls debug-only instead of user-facing environment controls

#### Checklist

- [x] add environment intensity
- [x] add background-versus-lighting separation
- [x] keep the controls attached to the active chosen environment state

#### Verification Shape

Minimum verification for this phase should cover:
- [x] the environment-light runtime is visibly tunable
- [x] background and lighting contribution can be separated honestly

#### Implementation Result

- `EnvironmentSourceSettings` now carries active HDRI `intensity` for lighting and `backgroundIntensity` for background treatment separately, while preset and custom sources keep neutral values and do not alter the locked startup baseline.
- `uiPrefsStore` now normalizes active HDRI tune values and exposes dedicated mutations for HDRI lighting intensity, background visibility, and background intensity.
- The View toolbar `Environment` section now includes an `Active Environment` read with HDRI-only `Lighting Intensity`, `Background`, and `Background Intensity` controls grounded in the active environment source state.
- `Viewer.applyEnvironmentSource(...)` now feeds `scene.environmentIntensity` from the lighting runtime and `scene.backgroundIntensity` from the background runtime, so HDRI lighting contribution and HDRI background appearance can diverge honestly.

#### Verification Result

- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts src/app/components/ViewToolbar.test.tsx src/viewer/Viewer.test.ts`
- `npm.cmd exec tsc -- --noEmit --pretty false`

#### Done Shape

`Phase 9` is done when:
- `Environment-1-HLG-7` advances from idea to real visible tune behavior

## [x] `Environment-1` - `Phase 10 - Add Basic Orientation And Final Environment-Object Cleanup`

### Phase 10 Summary

#### Purpose

Finish the minimum remaining practical controls and cleanup around the new environment-object workflow before final proof.

#### Owns

- optional orientation control if it is still needed
- final cleanup around selection, visibility, and toolbar-routing seams
- last-mile environment-object polish required for honesty

#### Does Not Own

- grading sliders
- persistence or compare workflow polish
- final family closeout

#### Current Live Read

- after `Phase 9`, the environment-object workflow should be mostly real but may still need one narrow cleanup pass
- this phase should finish the minimum practical control surface only

#### First Pass Decisions

- add orientation only if it still materially helps the runtime
- tighten the selection, visibility, and toolbar-routing seams only where they remain inconsistent
- stop before final proof and closeout

### Phase 10 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed post-`Phase 9` family state
2. Add orientation only if it is still needed
3. Close the remaining environment-object cleanup around selection, visibility, and toolbar routing

#### Likely Files

- `src/shared/viewSettingsTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- Browser-facing environment surfaces
- `src/app/components/ViewToolbar.tsx`
- `src/viewer/Viewer.ts`

#### No-Widening Rule

- do not widen into grading or persistence work
- do not reopen baseline-scene retuning
- do not keep the family open just to collect unrelated polish

#### Implementation Risks

- adding orientation even if it is not needed just because the original wishlist mentioned it
- using cleanup as an excuse to reopen earlier family boundaries
- letting one small mismatch between Browser, viewport, and toolbar survive into final proof

#### Checklist

- [x] add orientation only if still needed
- [x] close remaining environment-object cleanup around selection, visibility, and toolbar routing

#### Verification Shape

Minimum verification for this phase should cover:
- orientation exists only if it materially helps
- Browser, viewport, and toolbar still resolve through one honest environment-object contract
- the active HDRI and light objects still keep one clear owner

#### Implementation Result

- `EnvironmentSourceSettings` now carries HDRI-only `rotationDeg` state with neutral defaults for preset and custom sources, so orientation remains attached to the active environment source instead of becoming viewer-local state.
- `uiPrefsStore` now normalizes and preserves HDRI orientation through active HDRI apply and exposes one environment-owned orientation mutation for the View toolbar.
- The View toolbar `Active Environment` controls now include an HDRI-only `Orientation` slider alongside lighting intensity, background visibility, and background intensity.
- `Viewer.applyEnvironmentSource(...)` now applies active HDRI orientation to both `scene.environmentRotation` and `scene.backgroundRotation`, keeping environment lighting and background treatment aligned.
- The Browser active HDRI source row now exposes the normal visibility eye as a downstream background-visibility control, while environment light rows still route their eye through `LightSpec.enabled`.

#### Verification Result

- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts src/app/components/ViewToolbar.test.tsx src/app/panels/browserInteractions.test.ts src/app/panels/browserTreeRowPresenter.test.tsx src/app/panels/selectBrowserTreeRows.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd exec tsc -- --noEmit --pretty false`

#### Done Shape

`Phase 10` is done when:
- the environment-object workflow is clean enough that final proof no longer depends on known seam mismatches

## [x] `Environment-1` - `Phase 11 - Add Focused End-To-End Proof And Family Closeout`

### Phase 11 Summary

#### Purpose

Close the first environment family with focused proof that the combined baseline, preset, Browser, viewport, toolbar, and runtime story is honest.

#### Owns

- focused end-to-end proof for the combined family
- final docs cleanup and closeout
- the final honest `Environment-1` completion read before `Environment-2`

#### Does Not Own

- new feature widening
- grading or persistence work

#### Current Live Read

- after `Phase 10`, the family should be close enough to close with one focused final pass
- this phase should prove the behavior and close the family without reopening earlier design work

#### First Pass Decisions

- tighten proof around the preserved baseline, preset truth, visible tuning, Browser environment objects, selection-driven toolbar editing, and real environment runtime
- close the family docs honestly
- stop before `Environment-2` work

### Phase 11 Implementation Spec

#### Exact First Code Cut

1. Re-read the landed post-`Phase 10` family state
2. Add focused end-to-end proof across the full environment-object workflow
3. Close the family docs honestly

#### Likely Files

- focused proof:
  - `src/viewer/Viewer.test.ts`
  - `src/app/components/ViewToolbar.test.tsx`
  - Browser-facing tests where environment rows and eye visibility are covered
- docs closeout surfaces:
  - `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
  - `docs/CHANGELOG.md`
  - `docs/Doc-Log.md`

#### No-Widening Rule

- do not widen into grading or persistence work
- do not reopen baseline-scene retuning
- do not keep the family open just to collect unrelated polish

#### Implementation Risks

- using final proof as an excuse to reopen earlier family boundaries
- closing the family without proving Browser, viewport, and toolbar alignment on the same selected environment object

#### Checklist

- [x] add focused end-to-end proof across presets, environment objects, toolbar selection, and HDRI runtime
- [x] close the family docs honestly

#### Implementation Result

- Added a focused closeout proof test in `src/app/components/ViewToolbar.test.tsx` that covers the Environment-1 baseline preset state, preset divergence and reapply path, and active HDRI tuning controls in one narrow pass.
- Kept the existing Browser and viewer proof surfaces intact so the overall Environment-1 lane still reads honestly across the Browser row contract, selection-driven toolbar editing, and HDRI runtime seams.
- Closed the family docs without widening into grading, persistence, or any `Environment-2` behavior.

#### Verification Shape

Minimum verification for this phase should cover:
- preserved startup baseline
- preset truth and visible preset contract
- visible tuning controls
- Browser `Environment` section plus active lights and HDRI entry
- viewport wireframe light objects
- selection-driven toolbar population and Browser-eye light visibility
- true environment-light runtime
- intensity and background-versus-lighting separation

#### Verification Result

- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx src/app/panels/browserTreeSections.test.tsx src/app/panels/browserTreeRowPresenter.test.tsx src/viewer/Viewer.test.ts`
- `npm.cmd run build`

#### Done Shape

`Phase 11` is done when:
- the whole first environment lane is honest enough to close before `Environment-2`
- the family closeout docs can mark `Environment-1` complete without pretending later grading work already shipped
- `Environment-1` is now closed out, and the remaining environment work lives in `Environment-2`
