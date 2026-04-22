# Edit History Gen2-1 - Durable Scene Presentation Undo Candidates

## Doc Header

### Doc History
64. 2026-04-22 06:39:43: Manager accepted `Edit-History-Gen2-1 / Phase 2.6 - Display Projection Workspace Preference Routing` after rerunning focused scene presentation readiness and production build verification; closed `Edit-History-Gen2-HLG-1` and `Edit-History-Gen2-1` because remaining presentation candidates are implemented, explicitly deferred for native/slider commit-boundary reasons, or routed to workspace-preference planning.
63. 2026-04-22 06:37:08: Implemented proof-only `Edit-History-Gen2-1 / Phase 2.6 - Display Projection Workspace Preference Routing` by extending scene presentation readiness tests to prove raw global display preference writes stay canonical-history-free and redo-preserving, projection mode and axis overlay enabled have separate global and viewport-local paths, and environment-look ownership remains separate from broader view settings without adding runtime display/projection undo entries.
62. 2026-04-22 06:35:13: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.6 - Display Projection Workspace Preference Routing` spec for proof-only implementation after confirming projection and axis overlay enabled mix global persisted view settings with viewport-local workspace state, raw display preferences still need no-entry/redo proof, and runtime display/projection undo must remain deferred.
61. 2026-04-22 06:33:43: Tightened `Edit-History-Gen2-1 / Phase 2.6 - Display Projection Workspace Preference Routing` into a Worker-ready proof/routing spec after researching live `ViewToolbar`, `viewCommands`, `uiPrefsStore`, `uiPrefsPersistence`, and existing ViewToolbar tests for projection mode, grid, wireframe, axis overlay enabled/style, axes, shadows, and orbit display/control seams.
60. 2026-04-22 06:31:23: Manager accepted `Edit-History-Gen2-1 / Phase 2.5e - Material Range ParaSlider Commit Entries` after rerunning focused ViewToolbar material range/material, material-history, environment-look-history, and production build verification; Material Metalness/Roughness `ParaSlider` runtime undo is accepted and remaining durable presentation routing advances to prep-only `Phase 2.6 - Display Projection Workspace Preference Routing`.
59. 2026-04-22 06:27:51: Updated `Edit-History-Gen2-1 / Phase 2.5e - Material Range ParaSlider Commit Entries` closeout after final focused ViewToolbar material range/material reruns and production build verification passed with only known Vite warnings.
58. 2026-04-22 06:26:37: Implemented `Edit-History-Gen2-1 / Phase 2.5e - Material Range ParaSlider Commit Entries` by migrating only Material Metalness and Roughness to `ParaSlider`, preserving raw live material updates on `onChange`, committing one canonical material-only `Change material` entry on `onChangeEnd`, adding focused ViewToolbar range coverage for live no-entry, completion, undo/redo, no-op redo preservation, and environment-look exclusion, and recording focused material/environment regression plus production build verification.
57. 2026-04-22 06:22:54: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.5e - Material Range ParaSlider Commit Entries` spec for implementation after confirming the live native range controls, accepted material-only snapshot helper, `Ground Height` / selected-light `ParaSlider` commit precedents, and existing `ParaSlider.onChangeEnd` pointer, Home/End, and typed-value completion behavior.
56. 2026-04-22 06:21:26: Tightened `Edit-History-Gen2-1 / Phase 2.5e - Material Range ParaSlider Commit Entries` into a Worker-ready runtime spec for a narrow local `ViewToolbar` migration of Material Metalness and Roughness from native range inputs to `ParaSlider`, using raw live `updateMaterialPreset(...)` on `onChange`, one canonical material-only commit on `onChangeEnd`, explicit `viewer-material` metadata, no-op/redo requirements, and focused ViewToolbar verification gates.
55. 2026-04-22 06:19:43: Manager accepted `Edit-History-Gen2-1 / Phase 2.5d - Material Native Range Commit Boundary Proof` after rerunning focused ViewToolbar range, material-history, environment-look-history, and production build verification; native Material Metalness/Roughness runtime undo remains deferred from raw native ranges and advances to prep-only `Phase 2.5e - Material Range ParaSlider Commit Entries`.
54. 2026-04-22 06:17:15: Implemented proof-focused `Edit-History-Gen2-1 / Phase 2.5d - Material Native Range Commit Boundary Proof` by adding focused `ViewToolbar` coverage proving raw Material Metalness and Roughness native range updates mutate `view.materials`, create no canonical entries, preserve redo, and stay material-only without changing `EnvironmentLookSnapshot`, while keeping runtime range undo deferred because no reliable native completed-change boundary was proven.
53. 2026-04-22 06:15:42: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.5d - Material Native Range Commit Boundary Proof` spec for proof/test implementation after confirming live Metalness and Roughness native range controls use raw `onChange`, `ParaSlider.onChangeEnd` exists only as a later approved migration path, and runtime range undo must stay deferred until a reliable completed-change boundary is proven.
52. 2026-04-22 06:14:25: Tightened `Edit-History-Gen2-1 / Phase 2.5d - Material Native Range Commit Boundary Proof` into a Worker-ready proof-first spec after researching live `ViewToolbar` native Metalness and Roughness range seams, documenting raw `onChange` behavior, material-only ownership, intermediate drag/key spam risks, no-op/redo proof requirements, metadata targets for any later runtime slice, and stop conditions for broad input architecture or unapproved `ParaSlider` migration work.
51. 2026-04-22 06:11:05: Manager accepted `Edit-History-Gen2-1 / Phase 2.5c - Native Presentation Color Boundary Proof` after rerunning focused ViewToolbar color, material-history, environment-look-history, and production build verification; runtime native color undo remains deferred and durable presentation routing advances to prep-only `Phase 2.5d - Material Native Range Commit Boundary Proof`.
50. 2026-04-22 06:08:05: Implemented proof-focused `Edit-History-Gen2-1 / Phase 2.5c - Native Presentation Color Boundary Proof` by adding focused ViewToolbar color coverage proving raw Material Base Color, Material Emissive Color, and selected-light Color inputs update their owning state, create no canonical entries, preserve redo, and stay owner-separated between material-only and environment-look snapshots while keeping runtime native color undo deferred.
49. 2026-04-22 06:06:34: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.5c - Native Presentation Color Boundary Proof` spec for proof/test implementation after confirming live native color inputs still use raw `onChange`, material colors and selected-light Color have separate history owners, native picker completion is unproven, and runtime color undo must not be added without a reliable completed-change boundary.
48. 2026-04-22 06:05:05: Tightened `Edit-History-Gen2-1 / Phase 2.5c - Native Presentation Color Boundary Proof` into a Worker-ready proof-first spec after researching live `ViewToolbar` native color seams for selected-light Color, Material Base Color, and Material Emissive Color, documenting owner separation between environment-look and material history, native picker spam risks, no-op/redo proof requirements, metadata targets for any later runtime slice, and stop conditions for custom picker or broad input architecture work.
47. 2026-04-22 06:04:23: Manager accepted `Edit-History-Gen2-1 / Phase 2.5b - Material Typed Numeric Commit Entries` after rerunning focused material numeric, material, material-history, and production build verification; durable presentation routing advances to prep-only `Phase 2.5c - Native Presentation Color Boundary Proof`.
46. 2026-04-22 06:01:23: Implemented `Edit-History-Gen2-1 / Phase 2.5b - Material Typed Numeric Commit Entries` by routing Material Emissive Intensity and Opacity focus sessions through canonical material-only history commits, preserving raw finite live updates, restoring Escape cancellations, guarding invalid numeric input at the ViewToolbar boundary, adding focused ViewToolbar material numeric coverage, recording material-history regression and production build verification, and keeping Metalness/Roughness deferred.
45. 2026-04-22 05:58:36: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.5b - Material Typed Numeric Commit Entries` spec for implementation after confirming live Emissive Intensity and Opacity native number inputs, raw `updateMaterialPreset(...)` seams, material-only snapshot support, invalid/non-finite guard requirements, and Metalness/Roughness native range deferral.
44. 2026-04-22 05:56:04: Tightened `Edit-History-Gen2-1 / Phase 2.5b - Material Typed Numeric Commit Entries` into a Worker-ready runtime spec for Emissive Intensity and Opacity native number focus sessions using material-only snapshots, raw finite live updates, blur/Enter commits, Escape/invalid no-stranded-mutation handling, normalized no-op comparison, and explicit native range deferral for Metalness and Roughness.
43. 2026-04-22 05:54:55: Manager accepted `Edit-History-Gen2-1 / Phase 2.5a - Material Name Focus Session Commit Entries` after rerunning focused material-name, material, material-history, and production build verification; durable presentation routing advances to prep-only `Phase 2.5b - Material Typed Numeric Commit Entries`.
42. 2026-04-22 05:50:20: Implemented `Edit-History-Gen2-1 / Phase 2.5a - Material Name Focus Session Commit Entries` by routing Material preset Name focus sessions through canonical material-only history commits, preserving raw live typing, restoring cancelled Escape edits without invalidating redo, adding focused ViewToolbar material-name coverage, recording material history regression verification, and production build verification.
41. 2026-04-22 05:47:03: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.5a - Material Name Focus Session Commit Entries` spec for implementation after confirming the live Material Name input, selected-light Name precedent, material-only snapshot helper, raw typing preservation, Enter/blur duplicate guard, and Escape no-stranded-mutation requirement.
40. 2026-04-22 05:45:43: Tightened `Edit-History-Gen2-1 / Phase 2.5a - Material Name Focus Session Commit Entries` into a Worker-ready runtime spec for Material preset Name only, using the accepted material-only snapshot helper, raw live typing preservation, blur/Enter one-entry commits, Escape no-stranded-mutation handling, native text undo preservation, focused verification, and explicit exclusions for color/range/numeric controls.
39. 2026-04-22 05:44:59: Manager accepted the docs-only `Edit-History-Gen2-1 / Phase 2.5 - Material Text Color And Range Commit Boundary Proof` prep after live seam review confirmed Material Name is the smallest likely runtime slice, typed number inputs should split separately, native range controls still need completion-boundary proof, and native color work should remain a shared proof with selected-light Color.
38. 2026-04-22 05:43:12: Tightened `Edit-History-Gen2-1 / Phase 2.5 - Material Text Color And Range Commit Boundary Proof` into a Worker-ready routing/proof spec after researching live `ViewToolbar` material Name, native color, range, and numeric inputs, raw `useUiPrefsStore.updateMaterialPreset(...)`, the accepted material-only history helper, and selected-light Color deferral boundaries while keeping runtime implementation deferred.
37. 2026-04-22 05:40:57: Manager accepted `Edit-History-Gen2-1 / Phase 2.4 - Ground Setting Commit Entries` after rerunning focused ground history, ViewToolbar ground-filtered, readiness, environment-look, material, and production build verification; durable presentation routing advances to prep-only `Phase 2.5 - Material Text Color And Range Commit Boundary Proof`.
36. 2026-04-22 05:38:17: Implemented `Edit-History-Gen2-1 / Phase 2.4 - Ground Setting Commit Entries` by adding a ground-only canonical history helper, routing ViewToolbar Ground enabled/material/height controls through focused ground commits, preserving raw `setView(...)` behavior, recording focused ground/ViewToolbar/readiness/environment/material verification, and production build verification.
35. 2026-04-22 05:34:37: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.4 - Ground Setting Commit Entries` spec after confirming live `ViewToolbar` ground enabled/material seams, existing `ParaSlider.onChangeEnd` support, raw `setView(...)` preservation, ground-only snapshot scope, canonical `viewer-ground` metadata, and Ground Height split guard.
34. 2026-04-22 05:32:25: Tightened `Edit-History-Gen2-1 / Phase 2.4 - Ground Setting Commit Entries` into a Worker-ready runtime spec for safe ground enabled/material select commits, a ground-only snapshot helper over `view.ground`, raw `setView(...)` preservation, and a conditional Ground Height split unless `ParaSlider.onChangeEnd` can be wired narrowly.
33. 2026-04-22 05:31:30: Manager accepted `Edit-History-Gen2-1 / Phase 2.3 - Ground Settings Ownership And Commit Boundary Proof` after rerunning focused readiness, environment-look, material, ViewToolbar ground-filtered, and production build verification; runtime ground entries advance to prep-only `Phase 2.4 - Ground Setting Commit Entries`, with Ground Height split unless a narrow `ParaSlider.onChangeEnd` boundary is approved.
32. 2026-04-22 05:27:52: Implemented the proof-focused `Edit-History-Gen2-1 / Phase 2.3 - Ground Settings Ownership And Commit Boundary Proof` by adding readiness coverage for `view.ground` persistence ownership, raw no-entry/redo preservation, exclusion from environment-look and material-only history restores, built-in `GroundMaterialPresetId` semantics, adjacent boundary regressions, and production build verification.
31. 2026-04-22 05:25:47: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.3 - Ground Settings Ownership And Commit Boundary Proof` spec for a proof-first implementation after confirming `view.ground` storage under `viewSettingsPersistence`, built-in `GroundMaterialPresetId` values, current raw `ViewToolbar` / `setView(...)` seams, and the need to defer runtime ground entries until height commit boundaries are proven.
30. 2026-04-22 05:24:27: Tightened `Edit-History-Gen2-1 / Phase 2.3 - Ground Settings Ownership And Commit Boundary Proof` into a Worker-ready proof-first spec after researching `ViewToolbar` ground controls, `useUiPrefsStore.setView(...)` / local `setGround(...)`, `view.ground`, `GroundMaterialPresetId`, `viewSettingsPersistence`, and existing ground-focused ViewToolbar/readiness tests while keeping runtime ground undo deferred.
29. 2026-04-22 05:23:35: Manager accepted `Edit-History-Gen2-1 / Phase 2.2 - Material Preset And Per-Part Commit Entries` after rerunning focused material history, uiPrefs material, scene presentation readiness, ViewToolbar material, and production build verification; safe discrete material runtime entries are accepted while material text/color/range, selected-light Color, and ground/display candidates remain routed to later prep.
28. 2026-04-22 05:20:28: Implemented `Edit-History-Gen2-1 / Phase 2.2 - Material Preset And Per-Part Commit Entries` by adding a material-only canonical history helper, routing safe discrete ViewToolbar material callbacks, preserving raw setter boundaries, and recording focused material/uiPrefs/readiness/ViewToolbar/build verification.
27. 2026-04-22 05:17:01: Manager approved the prepped `Edit-History-Gen2-1 / Phase 2.2 - Material Preset And Per-Part Commit Entries` spec after confirming the live `ViewToolbar` material callbacks, raw `useUiPrefsStore` material setters, accepted material-only snapshot boundary, no-op semantics, generated-id redo concerns, and split guards for material text/color/range controls.
26. 2026-04-22 05:15:38: Tightened `Edit-History-Gen2-1 / Phase 2.2 - Material Preset And Per-Part Commit Entries` into a Worker-ready runtime spec for safe discrete material commits only, using a proposed material snapshot over `view.materials` while keeping material text/color/range controls and broader view settings deferred.
25. 2026-04-22 05:15:02: Manager accepted `Edit-History-Gen2-1 / Phase 2.1 - Material Ownership And Commit Boundary Proof` after rerunning focused material readiness, uiPrefs material, environment-look regression, and production build verification; runtime material undo advanced to prep-only `Phase 2.2 - Material Preset And Per-Part Commit Entries` while text/color/range controls remain split until their commit boundaries are proven.
24. 2026-04-22 05:10:43: Implemented the proof-focused `Edit-History-Gen2-1 / Phase 2.1 - Material Ownership And Commit Boundary Proof` by adding focused material readiness and ui-prefs store tests that prove material persistence ownership, raw no-entry/redo preservation, generated id/delete fallback/per-part cleanup semantics, and the future split between safe discrete commits and text/color/range commit-boundary work.
23. 2026-04-22 05:08:29: Manager approved `Edit-History-Gen2-1 / Phase 2.1 - Material Ownership And Commit Boundary Proof` for a focused proof/test implementation after confirming live material setters, generated id/delete fallback/per-part cleanup behavior, broader `viewSettingsPersistence` storage, and full `ViewSettings` exclusion risks.
22. 2026-04-22 05:06:59: Tightened `Edit-History-Gen2-1 / Phase 2.1 - Material Ownership And Commit Boundary Proof` into a Worker-ready proof-first spec after researching `ViewToolbar` material preset/per-part controls, raw `useUiPrefsStore` material setters, `view.materials` storage, `viewSettingsPersistence`, and current input boundaries while keeping runtime material undo deferred.
21. 2026-04-22 05:05:33: Manager accepted the docs-only `Edit-History-Gen2-1 / Phase 2 - Remaining Presentation Candidate Routing` prep after live seam review confirmed selected-light Color remains boundary-deferred, material/per-part material is the next proof candidate, ground should split later if material becomes broad, projection/axis/display overlap workspace preferences, and captured-look helpers belong outside Gen 2 runtime undo unless promoted.
20. 2026-04-22 05:02:31: Added `Edit-History-Gen2-1 / Phase 2 - Remaining Presentation Candidate Routing` as a docs-only routing/proof spec for selected-light Color, material/per-part material, ground settings, axis/grid/projection/wireframe/display options, and captured-look comparison helpers after researching current `ViewToolbar`, `uiPrefsStore`, persistence, workspace local-view, and viewer command seams.
19. 2026-04-22 05:01:39: Manager accepted `Edit-History-Gen2-1 / Phase 1.1c` after rerunning focused selected-light Name, selected-light editor, workspace-selection delete, environment-look, Browser environment, console environment-light, uiPrefs, and production build verification; selected-light Color remains deferred and `Edit-History-Gen2-HLG-1` remains open for remaining presentation candidate routing.
18. 2026-04-22 04:59:11: Repaired `Edit-History-Gen2-1 / Phase 1.1c` selected-light Name Escape handling so Escape no longer clears the pending draft and leaves a raw name mutation outside canonical history; focused name and selected-light verification passed.
17. 2026-04-22 04:55:33: Implemented `Edit-History-Gen2-1 / Phase 1.1c - Selected Light Text Color And Delete Commit Entries` by adding selected-light Name focus-session history, a history-aware shared environment-light delete wrapper, focused tests, and the explicit Color deferral.
16. 2026-04-22 04:53:14: Manager approved the prepped `Edit-History-Gen2-1 / Phase 1.1c` spec for implementation with selected-light Name and Delete in scope, Color explicitly deferred unless a reliable completed-change boundary is proven without a custom picker or broad input model, and the shared environment-light delete command wrapper constrained to preserve selection side effects.
15. 2026-04-22 04:51:03: Tightened `Edit-History-Gen2-1 / Phase 1.1c - Selected Light Text Color And Delete Commit Entries` into a Worker-ready prep spec after researching selected-light Name and Color inputs in `ViewToolbar`, the shared `deleteWorkspaceSelectedEnvironmentLight(...)` dependency seam, `workspaceSelectionCommands` tests, and the accepted environment-look history helper while keeping source/test/runtime implementation deferred.
14. 2026-04-22 04:49:13: Manager accepted `Edit-History-Gen2-1 / Phase 1.1b` after rerunning focused selected-light ViewToolbar, environment-look store, uiPrefs, ParaSlider, and production build verification; kept `Edit-History-Gen2-HLG-1` open for `Phase 1.1c` selected-light name/color/delete split coverage before broader durable presentation closeout.
13. 2026-04-22 04:45:42: Implemented `Edit-History-Gen2-1 / Phase 1.1b - Selected Light Editor Commit Entries` by routing selected-light discrete selects, scalar sliders, vector axes, and shadow controls through canonical environment-look history commits while keeping raw light setters history-free and splitting name/color/delete to focused follow-ups.
12. 2026-04-22 04:43:23: Manager approved the prepped `Edit-History-Gen2-1 / Phase 1.1b` spec for implementation after confirming selected-light editor controls use raw light setters today, `ParaSlider` and `ParaVec3Field` have commit-end seams, the existing environment-look helper owns the restore payload, and delete/name/color must split if they cannot remain narrow one-entry commits.
11. 2026-04-22 04:41:49: Tightened `Edit-History-Gen2-1 / Phase 1.1b - Selected Light Editor Commit Entries` into a Worker-ready prep spec after researching `ViewToolbar` selected-light controls, `ParaSlider`/`ParaVec3Field` commit-end seams, `useUiPrefsStore` light setters, the accepted `environmentLookEditHistory` helper, and current focused tests while keeping runtime implementation deferred.
10. 2026-04-22 04:40:30: Manager accepted `Edit-History-Gen2-1 / Phase 1.1` after rerunning focused environment-look, ViewToolbar, CatalogSurface, Browser, ParaSlider, readiness, uiPrefs, and production build proof; kept `Edit-History-Gen2-HLG-1` open for a narrow selected-light editor follow-up before broader durable presentation closeout.
9. 2026-04-22 04:36:48: Repaired the `Edit-History-Gen2-1 / Phase 1.1` acceptance proof by adding real ViewToolbar and CatalogSurface canonical-entry assertions, proving Catalog environment undo restores the prior source without Browser/project content ownership, and fixing `ParaSlider` Home/End keyboard changes to fire `onChangeEnd` once.
8. 2026-04-22 04:31:34: Implemented `Edit-History-Gen2-1 / Phase 1.1` with a store-adjacent environment look history helper, focused undo/redo tests, ViewToolbar preset/HDRI/grade commit routing, Catalog environment apply/local browse routing, Browser environment background/light toggle routing, and production build verification while leaving broad selected-light editor controls as the only possible lighting follow-up.
7. 2026-04-22 04:27:02: Manager approved `Edit-History-Gen2-1 / Phase 1.1` for implementation after confirming the store-adjacent wrapper boundary, `EnvironmentLookSnapshot` restore payload, raw-setter no-entry preservation, `ParaSlider.onChangeEnd` seam, Catalog/Browse environment handoff routing, Browser environment row split guard, and no-widening rules.
6. 2026-04-22 04:25:25: Tightened `Edit-History-Gen2-1 / Phase 1.1 - Environment Look Commit Entries` into a Worker-ready runtime undo spec after researching `useUiPrefsStore`, `uiPrefsPersistence`, `ViewToolbar`, `ParaSlider`, `CatalogSurface`, Browser environment rows, and canonical edit-history seams while keeping source/test/runtime implementation deferred.
5. 2026-04-22 04:22:20: Manager accepted `Edit-History-Gen2-1 / Phase 1` after focused readiness, uiPrefs, Catalog environment handoff, and production build verification passed; `Edit-History-Gen2-CLG-1` is complete for ownership/storage/commit-boundary proof, while `Edit-History-Gen2-HLG-1` stays open for `Phase 1.1` runtime environment-look undo entries.
4. 2026-04-22 04:20:02: Implemented `Edit-History-Gen2-1 / Phase 1` as a proof-focused readiness pass by adding focused tests for environment look persistence ownership, broader view/material exclusion, raw environment action no-entry/no-redo-invalidation behavior, Catalog viewer-environment handoff ownership, adjacent uiPrefs/Catalog regressions, and production build verification while leaving runtime undo wrappers for `Phase 1.1`.
3. 2026-04-22 04:17:39: Manager approved `Edit-History-Gen2-1 / Phase 1` as a proof-focused implementation pass after confirming environment look state is a durable user-preference candidate, persistence boundaries and raw no-entry proof are required before runtime undo wrappers, and `Phase 1.1 - Environment Look Commit Entries` remains the likely first runtime slice after this proof.
2. 2026-04-22 04:16:22: Tightened `Edit-History-Gen2-1 / Phase 1` into a Worker-ready ownership and commit-boundary proof spec after live seam research found durable user-preference environment look state in `useUiPrefsStore`, persistence policy in `uiPrefsPersistence`, Catalog HDRI apply handoff seams, and viewer runtime readers, while recommending runtime undo split into a later environment-look entry phase instead of widening this proof pass.
1. 2026-04-22 04:12:09: Created this Gen 2 future planning surface for durable scene, material, environment, lighting, and display-preset undo candidates before any runtime implementation starts.

### Purpose

This doc routes durable scene presentation settings that might later become canonical undo entries.

## Doc Body

### Owns

- authored scene presentation settings after they are modeled as durable project or user state
- material, lighting, environment, display-preset, or visibility-preset commits only when they have clear owner records and commit boundaries
- exclusion proof that camera navigation, transient viewer state, preview/cache/provider state, and runtime display refreshes do not create canonical history entries

### Does Not Own

- camera navigation or view orbit/pan/zoom
- runtime viewer state, preview sessions, cache/provider/load state, scene render progress, or transient source browsing
- Browser/project content organization, Viewer Transform entries, graph/CAD/sketch authoring, Build Path UI, history panel UI, persistence, collaboration, checkpoints, or branching

### Ownership / Storage Questions

- Which store owns durable scene/material/environment settings: project content, workspace preferences, user preferences, or a new presentation owner?
- Are settings project-authored, user-authored, or both?
- Which values are persisted today, and which are runtime-only?
- What is the commit boundary for sliders, menus, presets, and reset actions?
- Can undo/redo restore a setting without rewinding provider/cache/material-load state?

### Acceptance Read

This candidate is implementation-ready only when a prep pass identifies concrete durable setting owners, stable commit APIs, focused tests, and exclusion proof for runtime/view/cache/provider state.

### No-Widening Rule

Do not implement scene/material/environment undo until ownership and storage are explicit. Do not capture camera navigation, runtime render state, preview/cache/provider state, source browsing, transient viewer state, or broad presentation infrastructure.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen2-HLG-1` - Evaluate durable presentation settings as authored undo candidates only after project/user ownership and commit boundaries are explicit.

### Codex Level Goals

- [x] `Edit-History-Gen2-CLG-1` - Define durable scene/material/environment ownership, storage, commit boundaries, and exclusion proof before implementation.

## [x] `Edit-History-Gen2-1 / Phase 1` - `Ownership And Commit Boundary Proof`

### Phase 1 Summary

Purpose:
- prove which scene/material/environment presentation settings are durable authored state, which are user preferences, and which remain runtime/view/cache/provider state
- make the next runtime implementation legal only after the owned state, commit boundary, restore payload, and exclusion proof are named

Owns:
- ownership and storage proof for current durable scene presentation candidates
- commit-boundary mapping for the current Environment-owned view settings seam
- no-entry proof plan for raw current presentation actions before any canonical adapter is introduced
- a split decision for the first runtime undo slice after proof

Does Not Own:
- canonical runtime undo implementation
- source/test changes during prep
- material authoring beyond current `ViewSettings.materials` ownership research
- camera navigation, runtime viewer state, preview/cache/provider state, Catalog source browsing, transient viewer state, or broad presentation infrastructure

Current Live Seams:
- `src/app/store/uiPrefsStore.ts`
  - owns current user preference state for `view`, `environmentPersistence`, `viewSettingsPersistence`, `capturedEnvironmentLook`, and environment comparison state
  - environment look setters include `applyEnvironmentPreset(...)`, `applyHdriEnvironment(...)`, `setEnvironmentGrade(...)`, `setHdriEnvironmentBackgroundVisible(...)`, `setHdriEnvironmentIntensity(...)`, `setHdriEnvironmentBackgroundIntensity(...)`, `setHdriEnvironmentRotation(...)`, `addLight(...)`, `deleteLight(...)`, and `updateLight(...)`
  - material-related setters include `selectMaterialPreset(...)`, `updateMaterialPreset(...)`, `addMaterialPreset(...)`, `deleteMaterialPreset(...)`, `setUsePerPartMaterial(...)`, `assignPartMaterial(...)`, `clearPartMaterial(...)`, and `setPerPartMaterialMap(...)`
- `src/app/store/uiPrefsPersistence.ts`
  - persists `ViewSettings`
  - `environmentPersistence` stores `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
  - `viewSettingsPersistence` stores projection/grid/ground/axis/material state, so material and ground settings need a separate ownership decision from environment look
- `src/shared/viewSettingsTypes.ts`
  - defines `ViewSettings`, `EnvironmentLookSnapshot`, `EnvironmentSourceSettings`, `LightSpec`, material presets, ground settings, environment look snapshot helpers, and equality helpers for environment look snapshots
- `src/app/components/ViewToolbar.tsx`
  - routes visible environment controls into `useUiPrefsStore`
  - current grade and HDRI controls call setters directly during changes; those need explicit commit semantics before runtime history can avoid per-tick spam
- `src/app/catalog/catalogEnvironmentApply.ts`
  - resolves eligible repo-backed environment Catalog items into one `viewer-environment` handoff contract
- `src/app/workspace/CatalogSurface.tsx`
  - routes Catalog environment apply into `applyHdriEnvironment(...)`
  - Catalog browsing and preview state must remain excluded
- `src/app/panels/useBrowserPanelController.ts` and `src/app/panels/browserInteractions.ts`
  - Browser environment source and light rows toggle background visibility or light enabled state through `useUiPrefsStore`
- `src/app/components/ViewerHost.tsx` and `src/viewer/Viewer.ts`
  - read `ViewSettings` and apply it to viewer runtime through `applyViewSettings(...)`; these are derived/runtime readers, not canonical undo owners

First-Pass Decisions:
- Current durable authored candidate exists: user-preference environment look state in `useUiPrefsStore`, persisted through `uiPrefsPersistence`.
- Phase 1 should be proof-focused and should not create canonical entries yet.
- The first runtime undo slice after Phase 1 should be split as `Edit-History-Gen2-1 / Phase 1.1 - Environment Look Commit Entries`, not mixed with material presets or all presentation settings.
- Phase 1.1 should initially own environment look state only: `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`.
- Material presets/per-part material, ground settings, axis/grid/projection/wireframe/display options, and environment look comparison/captured-look helpers should remain deferred until ownership and commit boundaries are reviewed separately.

### Phase 1 Implementation Spec

Exact first code cut:
- proof/test-focused only; do not implement runtime undo entries in Phase 1
- add focused readiness tests, likely in a new `src/app/store/scenePresentationEditHistoryReadiness.test.ts` or focused additions to `src/app/store/uiPrefsStore.test.ts`
- prove `environmentPersistence` owns durable environment look state by verifying `uiPrefsPersistence` serializes/merges `envPreset`, `environmentGrade`, `environmentSource`, and `lighting` separately from broader `viewSettingsPersistence`
- prove current raw environment actions remain history-free by checking `editHistoryStore.getUndoEntries()` stays empty after representative raw calls to `applyEnvironmentPreset(...)`, `applyHdriEnvironment(...)`, `setEnvironmentGrade(...)`, HDRI tuning setters, and light update/toggle seams
- prove Catalog environment apply is only an eligible `viewer-environment` handoff and does not imply Browser/project content ownership
- prove viewer runtime readers are downstream by using existing `Viewer.test.ts` or selector-level proof only if a narrow test already exists; do not create a broad Viewer integration suite for this proof pass

Likely files for Phase 1 proof:
- `src/app/store/uiPrefsStore.ts` read-only unless a tiny test seam is missing
- `src/app/store/uiPrefsPersistence.ts` read-only unless a tiny test seam is missing
- `src/shared/viewSettingsTypes.ts` read-only unless a tiny test seam is missing
- `src/app/store/uiPrefsStore.test.ts`
- new `src/app/store/scenePresentationEditHistoryReadiness.test.ts` if keeping the proof separate is clearer
- `src/app/catalog/catalogEnvironmentApply.test.ts` if Catalog handoff proof needs extension
- `src/app/catalog/catalogActionPlan.test.ts` if eligibility proof needs extension
- `src/app/workspace/CatalogSurface.test.tsx` only if a small handoff proof is required; report unrelated Catalog/Pubwheel failures instead of widening

Likely first runtime follow-up after Phase 1:
- `Edit-History-Gen2-1 / Phase 1.1 - Environment Look Commit Entries`
- add history-aware wrappers on top of raw `useUiPrefsStore` environment look setters
- commit one canonical entry per completed environment look action only when the environment look snapshot changes
- use `EnvironmentLookSnapshot` as the restore payload for `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
- leave raw setters history-free for setup/tests and live per-tick controls until explicit begin/end commit callbacks exist

No-Widening Rule:
- do not implement runtime undo in Phase 1
- do not make camera navigation, runtime viewer state, preview/cache/provider state, Catalog source browsing, transient viewer state, command transcript/recall, Browser/project content, Viewer Transform, Build Path, history UI, persistence architecture, collaboration, checkpoints, or branching canonical undo owners
- do not route material presets, ground settings, grid/projection/display options, environment comparison helpers, or captured-look recall into canonical history in this phase
- do not broadly refactor `ViewToolbar`, `CatalogSurface`, `ViewerHost`, `Viewer`, `uiPrefsStore`, or persistence

Implementation Risks:
- `ViewToolbar` grade and HDRI sliders currently call setters directly during changes, so runtime undo must not be added to raw setters without commit lifecycle support.
- `uiPrefsStore` contains both environment look and broader view/material preferences; a broad `ViewSettings` snapshot would over-capture projection, grid, ground, material, axis overlay, and possibly session-like display state.
- `capturedEnvironmentLook` and `environmentLookComparisonActive` are workflow/comparison state, not authored scene settings; restoring them would blur Gen 2 and Gen 3 boundaries.
- Catalog environment apply uses repo source paths and object URLs; runtime undo must not own Catalog browsing, provider/cache, or preview session state.
- Viewer `applyViewSettings(...)` is runtime projection of current preferences; it should be tested as a downstream reader, not wired as an undo owner.

Checklist:
- [x] Verify live durable owner for environment look state.
- [x] Verify persistence policy boundaries between `environmentPersistence` and `viewSettingsPersistence`.
- [x] Verify raw environment store actions create no canonical entries before wrappers exist.
- [x] Verify Catalog environment action eligibility remains a handoff to `viewer-environment`, not Browser/project content.
- [x] Verify runtime/view/cache/provider/session state remains outside the proof.
- [x] Record whether Phase 1.1 should implement environment look entries first.

Focused Verification:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` if a new focused proof file is added
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/store/useUiPrefsPersistenceBridge.test.tsx` if persistence bridge behavior is touched or asserted
- `npm.cmd test -- --run src/app/catalog/catalogEnvironmentApply.test.ts` if Catalog handoff proof is touched
- `npm.cmd test -- --run src/app/catalog/catalogActionPlan.test.ts` if eligibility proof is touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- update `docs/CHANGELOG.md` only for implementation/test behavior changes
- update this phase doc and `docs/Doc-Log.md` for docs maintenance
- do not update the family index until Manager accepts the proof or later runtime phase

Stop Condition:
- stop and report instead of implementing runtime undo if the proof shows environment look state cannot be restored without capturing broader `ViewSettings`, Catalog provider/cache/source state, viewer runtime state, or local comparison workflow state
- stop and split if material presets, ground, display options, or environment look entries require different owners or commit lifecycles

Done Shape:
- Phase 1 is done when focused proof confirms the durable environment look owner, persistence boundary, current no-entry behavior, and runtime/view/cache/provider exclusions.
- `Edit-History-Gen2-CLG-1` can be recommended complete for ownership and boundary definition after Phase 1 proof passes; it does not imply runtime undo entries have shipped.
- `Edit-History-Gen2-HLG-1` should remain open until at least one durable presentation setting family has an accepted runtime undo implementation or Manager explicitly treats the HLG as planning-only.

### Phase 1 Closeout

Status:
- complete after focused proof and production build verification

Proof Added:
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
  - proves `environmentPersistence` owns `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
  - proves broader `viewSettingsPersistence` state such as projection, grid, wireframe, ground, and material settings remains outside the first environment look candidate
  - proves raw environment actions remain history-free and do not invalidate redo before wrappers exist
  - proves Catalog environment apply remains a `viewer-environment` handoff rather than Browser/project content ownership

Verification:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` passed
- `npm.cmd test -- --run src/app/catalog/catalogEnvironmentApply.test.ts` passed
- `npm.cmd run build` passed with the known Vite externalized `path` / `crypto` and chunk-size warnings

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-CLG-1` complete for ownership/storage/commit-boundary proof on 2026-04-22 04:22:20
- `Edit-History-Gen2-HLG-1` remains open for `Edit-History-Gen2-1 / Phase 1.1 - Environment Look Commit Entries` or another accepted runtime undo implementation

## [x] `Edit-History-Gen2-1 / Phase 1.1` - `Environment Look Commit Entries`

### Phase 1.1 Summary

Purpose:
- implement the first runtime durable presentation undo slice by routing completed environment look commits into canonical `editHistoryStore` entries
- preserve the accepted Phase 1 ownership boundary: environment look is durable user preference state, while Catalog browsing, provider/cache/preview state, viewer runtime state, camera navigation, and comparison workflow state remain excluded
- avoid per-tick history spam by keeping raw environment setters history-free and committing only at explicit menu/button or interaction-end boundaries

Owns:
- canonical undo/redo entries for environment look commits over `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
- narrow environment look snapshot/restore payloads based on `EnvironmentLookSnapshot`
- history-aware wrappers above raw `useUiPrefsStore` environment actions
- focused UI/controller routing only where it is needed to call the history-aware wrapper at an already-completed commit boundary
- no-op protection for unchanged normalized environment look snapshots

Does Not Own:
- material/grid/ground/projection/display settings, material presets, per-part material maps, captured environment look state, or comparison toggle state
- Catalog source browsing, provider/cache/load/preview state, object URL lifecycle policy, local library metadata, or unsupported Catalog actions
- viewer runtime state, camera/navigation, active surface/session state, command transcript/recall, Browser/project content, Viewer Transform, Build Path, history UI, persistence architecture, collaboration, checkpoints, or branching
- source/test implementation during prep

Current Live Seams:
- `src/app/store/uiPrefsStore.ts`
  - raw environment look setters include `applyEnvironmentPreset(...)`, `applyHdriEnvironment(...)`, `setEnvironmentGrade(...)`, `setHdriEnvironmentBackgroundVisible(...)`, `setHdriEnvironmentIntensity(...)`, `setHdriEnvironmentBackgroundIntensity(...)`, `setHdriEnvironmentRotation(...)`, `addLight(...)`, `deleteLight(...)`, and `updateLight(...)`
  - raw setters must remain available and history-free for setup, tests, live updates, and any future non-authored runtime paths
  - state also contains broader `view` preferences and comparison helpers, so a full `ViewSettings` snapshot would over-capture
- `src/app/store/uiPrefsPersistence.ts` and `src/shared/viewSettingsTypes.ts`
  - `EnvironmentLookSnapshot` and `environmentPersistence` identify the allowed restore payload for `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
  - broader `viewSettingsPersistence` state such as projection, grid, ground, display, wireframe, and material state remains out of this phase
- `src/app/store/editHistoryStore.ts`
  - accepted canonical owner for synchronous `EditHistoryEntry` commits, no-op ignore, redo invalidation, and undo/redo reader APIs
- `src/app/components/ViewToolbar.tsx`
  - preset menu and reapply button call `applyEnvironmentPreset(...)`
  - grade sliders currently call `setEnvironmentGrade(...)` via `updateEnvironmentGrade(...)`
  - HDRI controls call `setHdriEnvironmentBackgroundVisible(...)`, `setHdriEnvironmentIntensity(...)`, `setHdriEnvironmentBackgroundIntensity(...)`, and `setHdriEnvironmentRotation(...)`
  - selected light controls call `addLight(...)`, `deleteLight(...)`, and `updateLight(...)`
  - capture/recall/compare controls stay excluded workflow helpers
- `src/app/components/ParaSlider.tsx`
  - supports continuous `onChange(...)` plus committed `onChangeEnd(...)` on pointer release, cancel, keyboard step, and typed commit
  - this is the preferred seam for live raw setter updates plus one history commit at interaction end
- `src/app/workspace/CatalogSurface.tsx`
  - `handleApplyEnvironment(...)` and `handleBrowseLocalEnvironment(...)` call raw `applyHdriEnvironment(...)` after Catalog/environment eligibility checks
  - Catalog apply should become an environment look commit handoff, not Browser/project content ownership
  - Catalog browsing, provider/cache, preview, and source-option state must remain no-entry
- `src/app/panels/useBrowserPanelController.ts`
  - Browser environment rows route source background visibility through `setHdriEnvironmentBackgroundVisible(...)`
  - Browser light rows route enabled toggles through `updateLight(lightId, { enabled })`
  - Browser selection, expand/collapse, drag preview, and project content state are excluded
- Existing focused tests:
  - `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/app/catalog/catalogEnvironmentApply.test.ts`
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/app/workspace/CatalogSurface.test.tsx` if CatalogSurface routing needs UI proof
  - `src/app/panels/browserInteractions.test.ts` if Browser environment row routing changes
  - `src/app/store/editHistoryStore.test.ts` for owner regression only if the canonical owner contract is touched

First-Pass Decisions:
- add a small environment-look history adapter near app-store ownership, preferably `src/app/store/environmentLookEditHistory.ts` or an equivalently narrow helper adjacent to `uiPrefsStore`
- do not import `editHistoryStore` directly into broad UI widgets; UI/controller seams should call a narrow wrapper such as `commitEnvironmentLookWithHistory(...)`, `applyEnvironmentPresetWithHistory(...)`, or `applyHdriEnvironmentWithHistory(...)`
- keep raw `useUiPrefsStore` setters history-free; wrappers read a before `EnvironmentLookSnapshot`, call the existing raw action or receive an already-live-updated final state, compare the normalized after snapshot, and commit one `EditHistoryEntry` only when the environment look changed
- use `EnvironmentLookSnapshot` as the undo/redo payload and restore only `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
- immediate menu/button commits should call a wrapper once after the accepted raw action: preset select/reapply, Catalog HDRI apply/local browse, HDRI background select, Browser source background toggle, Browser light enabled toggle, add light, and delete light
- sliders and typed numeric fields should keep continuous `onChange(...)` raw updates and use `onChangeEnd(...)` to commit one entry from the interaction-start snapshot to the final snapshot; if the interaction-start snapshot is not available without refactor, implement a tiny begin/end helper instead of making raw setters historyful
- lighting is part of the accepted environment look payload, but if selected-light add/delete/update controls require broad ViewToolbar or Browser controller rewiring, split implementation into `Phase 1.1a - Environment Source And Grade Commit Entries` and `Phase 1.1b - Environment Lighting Commit Entries`

### Phase 1.1 Implementation Spec

Exact First Code Cut:
- add a narrow environment look history helper adjacent to `uiPrefsStore`
- helper responsibilities:
  - read a normalized `EnvironmentLookSnapshot` from current `useUiPrefsStore` state
  - compare before/after snapshots for no-op protection
  - restore only `envPreset`, `environmentGrade`, `environmentSource`, and `lighting` into `view`
  - commit a synchronous canonical entry with stable metadata such as label `Change environment look`, source surface `viewer-environment`, deterministic source id/label, and target labels for preset, HDRI, grade, or light changes when known
- route `ViewToolbar` environment preset/HDRI/grade/light completion boundaries through wrapper calls while preserving continuous raw live updates
- route `CatalogSurface` accepted environment apply/local browse through the wrapper after existing eligibility succeeds
- route Browser environment row background and light enabled toggles through the wrapper only if that can be done without changing Browser project-content ownership behavior
- add focused tests proving undo/redo, no-op, raw setter no-entry, slider collapse, Catalog handoff, Browser environment row ownership, and exclusion of broader view/runtime state

Likely Files:
- `src/app/store/uiPrefsStore.ts`
- new `src/app/store/environmentLookEditHistoryStore.test.ts` or `src/app/store/scenePresentationEditHistoryStore.test.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx` only if a focused CatalogSurface handoff proof is practical
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.test.ts` only if Browser environment-row callback wiring changes
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts` for regression proof if the helper shares readiness fixtures
- `src/app/store/uiPrefsStore.test.ts` if raw setter or persistence boundaries are touched
- `src/app/store/editHistoryStore.ts` read-only unless an unexpected owner contract bug blocks the slice

No-Widening Rule:
- do not make raw environment setters automatically historyful
- do not snapshot or restore full `ViewSettings`
- do not route material presets, grid, ground, projection, display, captured-look comparison, Catalog browsing/provider/cache/preview, viewer runtime state, camera/navigation, command transcript/recall, Browser/project content, Viewer Transform, Build Path, history UI, persistence architecture, collaboration, checkpoints, or branching into canonical history
- do not refactor `ViewToolbar`, `CatalogSurface`, Browser panel controllers, `uiPrefsStore`, or `ParaSlider` beyond the smallest callback/wrapper additions needed for commit boundaries

Implementation Risks:
- `ViewToolbar` sliders currently call raw setters directly during every tick; history must use `ParaSlider.onChangeEnd(...)` or a tiny begin/end helper to avoid one entry per tick.
- `EnvironmentLookSnapshot` includes the entire lighting list, so light reorder/id stability and no-op comparison must be deterministic before lighting controls are marked covered.
- Catalog local HDRI browse can use object URLs; undo/redo should restore the accepted `environmentSource` value already held by state but must not introduce new object URL lifecycle ownership.
- Browser environment rows sit beside project tree state; wrapper routing must not capture selection, expand/collapse, project content, or preview state.
- A full `setView(...)` restore may accidentally overwrite material/grid/ground/projection/display settings if the helper is too broad; restore must merge only the environment look fields.

Checklist:
- [x] Add environment look snapshot read/compare/restore helper scoped to `EnvironmentLookSnapshot`.
- [x] Add history-aware wrapper(s) that call existing raw environment actions or commit already-live final snapshots.
- [x] Keep raw environment setters history-free and covered by no-entry tests.
- [x] Wire immediate menu/button environment look commits through wrappers.
- [x] Wire slider/typed environment look interactions to commit once at interaction end.
- [x] Prove no-op unchanged snapshots create no entry and do not invalidate redo.
- [x] Prove undo/redo restores only environment look state and preserves material/grid/ground/projection/display, captured comparison state, Catalog provider/cache/preview, viewer runtime, camera/navigation, Browser selection, command transcript, and command recall.
- [x] Prove Catalog environment apply remains `viewer-environment` ownership, not Browser/project content ownership.
- [x] Prove Browser environment row toggles remain environment look commits and do not capture Browser organization state if that wiring is included.
- [x] Update `docs/CHANGELOG.md`, this future doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` if a new focused history file is added
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` if uiPrefs store behavior is touched
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "Environment"` if ViewToolbar callback wiring changes
- `npm.cmd test -- --run src/app/catalog/catalogEnvironmentApply.test.ts` if Catalog eligibility/handoff behavior is touched
- `npm.cmd test -- --run src/app/workspace/CatalogSurface.test.tsx -t "environment"` if CatalogSurface routing changes and the focused test surface remains reliable
- `npm.cmd test -- --run src/app/panels/browserInteractions.test.ts` if Browser environment row callback routing changes
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` only if the canonical owner contract is touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- update `docs/CHANGELOG.md` only during runtime/test implementation
- update this phase doc with implementation closeout, checklist truth, Doc History, and verification notes after implementation passes
- update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or family index until Manager accepts the implementation result

Stop Condition:
- stop and report instead of widening if undo/redo requires restoring full `ViewSettings`, material/grid/ground/projection/display settings, captured look/comparison state, Catalog source browsing/provider/cache/preview, object URL lifecycle policy, viewer runtime state, or camera/navigation
- stop and split if lighting controls require broad `ViewToolbar`, Browser controller, or environment-object infrastructure changes beyond narrow callback routing
- stop and split if slider commit boundaries require a broad `ParaSlider` rewrite instead of using existing `onChangeEnd(...)`

Done Shape:
- Phase 1.1 is done when completed environment look actions create one canonical undo entry per semantic commit, no-op/raw/live paths remain no-entry, undo/redo restores only `EnvironmentLookSnapshot` state, and focused tests plus build pass.
- `Edit-History-Gen2-HLG-1` can be recommended complete for the first durable presentation runtime undo slice only after Manager accepts the environment look implementation; if lighting is split out, Manager should decide whether source/grade/HDRI coverage is enough to close HLG-1 or whether HLG-1 stays open for `Phase 1.1b`.

### Phase 1.1 Closeout

Status:
- complete after focused environment-look, adjacent routing, and production build verification

Runtime Behavior Added:
- `src/app/store/environmentLookEditHistory.ts` now provides the narrow environment-look snapshot, restore, action-wrapper, and commit seam over `EnvironmentLookSnapshot`
- canonical `Change environment look` entries restore only `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
- raw `useUiPrefsStore` environment setters remain history-free
- ViewToolbar preset/reapply, HDRI background select, grade/HDRI slider interaction-end commits, and Add Light button route through environment look history wrappers
- Catalog environment apply and local HDRI browse route through environment look history wrappers after existing eligibility succeeds
- Browser environment source background and environment-light enabled toggles route through environment look history wrappers
- `ParaSlider` Home/End keyboard changes now match arrow/cap/drag/typed commit behavior by calling `onChangeEnd(...)` once after `onChange(...)`

Wiring Proof:
- `src/app/components/ViewToolbar.test.tsx` now proves real ViewToolbar preset, grade, and add-light actions create canonical `viewer-environment` entries
- `src/app/workspace/CatalogSurface.test.tsx` now proves real Catalog environment apply creates a canonical `viewer-environment` entry and undo restores the previous environment source while leaving Browser/project content ownership untouched
- Browser row callbacks are wired in `src/app/panels/useBrowserPanelController.ts` through the environment-look wrapper; the reliable focused test seam remains `src/app/panels/browserInteractions.test.ts`, which proves the pure Browser row behavior calls the injected environment source/light callbacks without project-organization ownership, while `src/app/store/environmentLookEditHistoryStore.test.ts` proves those wrapper callbacks create and restore canonical environment-look entries

Verification:
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` passed
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "Environment"` passed
- `npm.cmd test -- --run src/app/workspace/CatalogSurface.test.tsx -t "environment"` passed
- `npm.cmd test -- --run src/app/panels/browserInteractions.test.ts` passed
- `npm.cmd test -- --run src/app/components/ParaSlider.test.tsx` passed
- `npm.cmd run build` passed with the known Vite externalized `path` / `crypto` and chunk-size warnings

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 1.1` on 2026-04-22 04:40:30 as the first runtime durable presentation undo slice after focused environment-look, ViewToolbar, CatalogSurface, Browser, ParaSlider, readiness, uiPrefs, and production build verification passed
- `Edit-History-Gen2-HLG-1` remains open for `Phase 1.1b - Selected Light Editor Commit Entries` before broader durable presentation closeout

## [x] `Edit-History-Gen2-1 / Phase 1.1b` - `Selected Light Editor Commit Entries`

### Phase 1.1b Summary

Purpose:
- finish the remaining lighting runtime undo slice after Phase 1.1 accepted environment preset/source/grade/HDRI commits, Catalog/Browse handoffs, Browser source background/light enabled toggles, and Add Light
- route selected-light editor commits through canonical `editHistoryStore` using the accepted `EnvironmentLookSnapshot` restore payload
- keep raw `useUiPrefsStore` light setters history-free and commit exactly one entry only at existing discrete or interaction-end boundaries

Owns:
- selected environment-light update commits from `ViewToolbar` selected-light controls
- selected environment-light delete commits if the current delete seam can be routed without broad shared-selection or workspace command rewrites
- no-op protection for missing selected lights, unchanged normalized light values, type-gated unsupported properties, and delete of missing lights
- focused proof that selected-light undo/redo restores only `envPreset`, `environmentGrade`, `environmentSource`, and `lighting` through `EnvironmentLookSnapshot`
- focused proof that raw `updateLight(...)` / `deleteLight(...)` remain history-free outside the wrapper

Does Not Own:
- material/grid/ground/projection/display settings
- full lighting architecture, new light schema work, light reorder UX, or broad ViewToolbar redesign
- Catalog browsing/provider/cache/preview state, viewer runtime state, camera/navigation, Browser/project content, history UI, persistence, collaboration, checkpoints, or branching
- command transcript/recall, Browser organization, Viewer Transform, Build Path, selected-light transform shell behavior, or shared keyboard dispatch changes

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - selected-light editor derives `selectedLight` from `view.lighting.selectedLightId`
  - text/color inputs currently call raw `updateLight(selectedLight.id, { name })` and `updateLight(selectedLight.id, { color })` on every input change
  - Type, Cast Shadow, and Shadow Map `ParaSelect` controls currently call raw `updateLight(...)` immediately on selection changes
  - selected-light scalar controls use `ParaSlider` for Intensity, Distance, Decay, Angle, Penumbra, and Shadow Bias; these should keep raw `onChange(...)` live ticks and commit through `onChangeEnd(...)`
  - selected-light vector controls use `ParaVec3Field` for Position and Target; `ParaVec3Field` already forwards `onChangeEndAxis(...)` through `ParaVec3Slider` / `ParaSlider`
  - Add Light is already covered by Phase 1.1; this phase should not re-route it except for regression proof
- `src/app/store/uiPrefsStore.ts`
  - raw `updateLight(id, patch)` normalizes type-gated fields and removes inapplicable position/target/distance/spot/shadow properties
  - raw `deleteLight(id)` removes the light and advances `selectedLightId` to the first remaining light or `null`
  - raw setters must remain available and history-free for setup/tests/live updates
- `src/app/store/environmentLookEditHistory.ts`
  - accepted helper already captures/restores `EnvironmentLookSnapshot`, commits `Change environment look` entries, and preserves no-op/redo behavior
  - likely sufficient for selected-light updates because `lighting` is part of the snapshot; implementation should extend wrapper use rather than create a second owner
- `src/app/components/ParaSlider.tsx`
  - after the Phase 1.1 repair, pointer, keyboard arrow/cap/Home/End, cancel, and typed commit boundaries can call `onChangeEnd(...)`
- `src/app/components/ParaVec3Field.tsx` and `src/app/components/ParaVec3Slider.tsx`
  - already expose and forward `onChangeEndAxis(...)`, so selected-light Position/Target can commit one semantic entry at axis interaction end
- `src/app/components/ViewToolbar.test.tsx`
  - already covers selected-light core tuning, type-gated branches, vector controls, and shadow controls
  - best focused surface for proving real selected-light editor wiring creates canonical `viewer-environment` entries
- `src/app/store/environmentLookEditHistoryStore.test.ts`
  - already proves helper-level lighting undo/redo and raw setter no-entry behavior; add selected-light missing/no-op/delete coverage here if it keeps ViewToolbar tests smaller
- `src/app/store/workspaceSelectionCommands.ts` and `src/app/store/workspaceSelectionCommands.test.ts`
  - own a shared selection deletion path for environment lights
  - only route through history in this phase if it is a tiny wrapper around the same environment-look helper; otherwise leave as a documented follow-up instead of widening

First-Pass Decisions:
- implementation is safe as a narrow follow-up if it reuses `captureEnvironmentLookHistorySnapshot(...)`, `commitEnvironmentLookHistory(...)`, and `runEnvironmentLookHistoryAction(...)`
- selected-light scalar/vector drag or keyboard changes should not create entries during live ticks; use the existing `onChangeEnd(...)` / `onChangeEndAxis(...)` callbacks to commit one entry after the interaction
- selected-light text fields should use a tiny focus-session draft (`onFocus` capture, raw `onChange` live updates, `onBlur` commit) if done in this phase; Enter commit is optional only if it can avoid duplicate blur-after-Enter entries without rewriting local input state
- selected-light discrete selects can commit immediately through `runEnvironmentLookHistoryAction(...)` because the selection change is already a completed semantic action
- delete should be included only for the currently visible selected-light editor or an existing selected-light delete command if the route is narrow; do not rewrite shared workspace selection deletion just to claim delete coverage
- metadata should stay under the existing label `Change environment look`, source surface `viewer-environment`, and deterministic light target ids such as `environment-light:<lightId>:intensity`, `environment-light:<lightId>:position:x`, or `environment-light:<lightId>:delete`

### Phase 1.1b Implementation Spec

Exact First Code Cut:
- add small ViewToolbar-local helpers or a tiny store-adjacent helper function that:
  - captures an environment-look snapshot before selected-light live edits
  - runs the existing raw `updateLight(...)` / `deleteLight(...)` action
  - calls `commitEnvironmentLookHistory(...)` only when the normalized environment look changed
  - uses deterministic target metadata for light id, field, and readable field label
- wire selected-light discrete controls through the wrapper:
  - Type
  - Cast Shadow
  - Shadow Map
  - Color if color input should be treated as a discrete committed input in current tests
- wire selected-light live controls through begin/end semantics:
  - Intensity
  - Position axis
  - Target axis
  - Distance
  - Decay
  - Angle
  - Penumbra
  - Shadow Bias
- wire selected-light Name through a blur commit if it can be done with a tiny focus-session draft; otherwise document it as a follow-up inside Phase 1.1c instead of broadening the input model
- wire selected-light delete only if the existing editor or selection delete seam exposes a narrow committed delete action; otherwise keep delete as the explicit split/stop condition
- leave raw `useUiPrefsStore` light actions history-free and preserve existing ViewToolbar selected-light behavior

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/environmentLookEditHistory.ts` only if a tiny shared target-metadata/helper function avoids duplicated ViewToolbar code
- `src/app/store/environmentLookEditHistoryStore.test.ts`
- `src/app/store/uiPrefsStore.ts` read-only unless a tiny missing selector blocks focused tests
- `src/app/components/ParaSlider.test.tsx` only if selected-light implementation exposes a commit-boundary regression
- `src/app/components/ParaVec3Field.test.tsx` / `src/app/components/ParaVec3Slider.test.tsx` only if vector commit-end behavior is touched
- `src/app/store/workspaceSelectionCommands.ts` and `src/app/store/workspaceSelectionCommands.test.ts` only if selected-light delete is included through the shared selection path

No-Widening Rule:
- do not make raw `useUiPrefsStore` setters automatically historyful
- do not restore full `ViewSettings`; restore only the accepted `EnvironmentLookSnapshot`
- do not add new light schema, light reorder, light grouping, selected-light transform-shell undo, or broad ViewToolbar state architecture
- do not route material/grid/ground/projection/display, captured-look comparison, Catalog provider/cache/preview, viewer runtime/camera/navigation, Browser/project content, command transcript/recall, history UI, persistence, collaboration, checkpoints, or branching into canonical history
- do not change shared keyboard dispatch or native text-input undo behavior

Implementation Risks:
- name/color text inputs currently update raw state on every keystroke or browser color event; canonical history needs a focus/blur or change-end boundary to avoid per-character or per-drag entries.
- type changes normalize and remove unsupported fields; undo/redo must restore the whole environment look snapshot so removed type-gated fields can return deterministically.
- `deleteLight(...)` changes selection by choosing the first remaining light; undo/redo through lighting snapshot can restore selection, but routing shared selection delete may touch broader workspace selection behavior if not kept local.
- vector controls already have `onChangeEndAxis(...)`, but a single drag only commits one axis; multi-axis editing is naturally multiple semantic commits unless a broader vector transaction is added, which this phase should not do.
- selected-light shadow controls live in the Shadows tab while core light controls live in Environment; tests must cover both without broad ViewToolbar assertions.

Checklist:
- [x] Reuse `EnvironmentLookSnapshot` capture/restore for selected-light editor commits.
- [x] Keep raw `updateLight(...)` and `deleteLight(...)` history-free.
- [x] Commit discrete selected-light controls once per completed selection/change where a narrow selected-light editor seam exists.
- [x] Commit slider and vector selected-light controls once at `onChangeEnd(...)` / `onChangeEndAxis(...)`.
- [x] Add focused type-gated selected-light tests that prove canonical entries for implemented controls.
- [x] Prove undo/redo restore boundaries through the existing environment-look store regression that preserves broader view/material state.
- [x] Decide and document whether selected-light delete is implemented now or split to a follow-up.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "selected-light"` or the closest focused selected-light/environment filter available
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` if raw light setter behavior or normalization proof is touched
- `npm.cmd test -- --run src/app/store/workspaceSelectionCommands.test.ts` only if selected-light delete is routed through the shared selection command path
- `npm.cmd test -- --run src/app/components/ParaVec3Field.test.tsx` / `npm.cmd test -- --run src/app/components/ParaVec3Slider.test.tsx` only if vector commit-end behavior changes

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- update `docs/CHANGELOG.md` only during runtime/test implementation
- update this phase doc with implementation closeout, checklist truth, verification notes, and Doc History after implementation passes
- update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete until Manager accepts the implementation

Stop Condition:
- stop and report instead of widening if selected-light history requires a broad ViewToolbar input-state rewrite, a new local draft model for every field, shared keyboard/native text undo changes, or full `ViewSettings` restoration
- split into a smaller `Phase 1.1c` if selected-light delete can only be implemented through broad shared selection/workspace command changes
- split if name/color controls cannot be made one-entry-per-commit without per-character/per-drag spam or duplicate blur-after-Enter commits

Done Shape:
- Phase 1.1b is done when selected-light editor controls that have narrow commit boundaries create canonical `viewer-environment` entries, no-op/raw/live paths remain no-entry, undo/redo restores only environment look state, focused tests and build pass, and any unsupported selected-light delete or text-input corner is explicitly deferred.
- `Edit-History-Gen2-HLG-1` can be recommended complete only if Manager accepts that selected-light editor coverage plus Phase 1.1 covers the current durable environment look runtime undo surface; otherwise keep HLG-1 open for the named split follow-up.

### Phase 1.1b Closeout

Status:
- complete after focused selected-light ViewToolbar proof, environment-look store regression, and production build verification

Runtime Behavior Added:
- ViewToolbar selected-light Type, Cast Shadow, and Shadow Map discrete controls now route completed changes through canonical `Change environment look` entries with `viewer-environment` source metadata.
- ViewToolbar selected-light Intensity, Distance, Decay, Angle, Penumbra, Shadow Bias, Position axis, and Target axis controls keep raw live updates during interaction and commit one canonical environment-look entry at `ParaSlider.onChangeEnd(...)` / `ParaVec3Field.onChangeEndAxis(...)`.
- Existing raw `useUiPrefsStore.updateLight(...)` and `deleteLight(...)` actions remain history-free for setup/tests/live paths.
- Selected-light entries reuse the accepted `EnvironmentLookSnapshot` restore payload and do not snapshot full `ViewSettings`.

Split Decisions:
- Name remains split out because the current text input updates raw state per keystroke and needs a small focus-session draft to avoid per-character history and duplicate blur/Enter commits.
- Color remains split out because native color input events can fire during picker drags; it needs the same one-entry focus/change-end treatment before claiming canonical history.
- Delete remains split out because no local selected-light editor delete button exists in this phase, and the shared selection delete command would require a separate narrow routing proof to avoid broad workspace-selection rewrites.

Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "selected-light"` passed
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed
- `npm.cmd run build` passed with the known Vite externalized `path` / `crypto` and chunk-size warnings

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 1.1b` on 2026-04-22 04:49:13 for selected-light editor commit entries over the implemented discrete, scalar, vector, and shadow controls after focused selected-light ViewToolbar, environment-look store, uiPrefs, ParaSlider, and production build verification passed.
- `Edit-History-Gen2-HLG-1` remains open for `Phase 1.1c - Selected Light Text Color And Delete Commit Entries` before broader durable presentation closeout.

## [x] `Edit-History-Gen2-1 / Phase 1.1c` - `Selected Light Text Color And Delete Commit Entries`

### Phase 1.1c Summary

Purpose:
- implement or explicitly split the remaining selected-light editor commits that were deferred from Phase 1.1b
- route selected-light Name through a tiny focus-session draft if it can preserve native text input undo while focused and commit once on blur/Enter
- route selected-light Delete through the existing shared environment-light delete dependency seam if it can keep selection side effects unchanged
- defer selected-light Color unless the current native color input can expose a reliable completed-change boundary without a broader color-picker model

Owns:
- selected-light Name canonical environment-look entries, if implemented through a narrow focus-session draft
- selected-light Delete canonical environment-look entries, if implemented by wrapping the existing `deleteLight` dependency at the current Browser/console command call sites or a tiny command helper
- explicit Color split/defer decision if no reliable commit boundary exists
- no-op protection for unchanged names, missing lights, missing delete targets, and delete paths where raw deletion changes nothing
- focused proof that undo/redo restores only `EnvironmentLookSnapshot` state while preserving broader view/project/runtime exclusions

Does Not Own:
- broad ViewToolbar input architecture, shared keyboard/native text undo changes, new light schema, light reorder/grouping, material/grid/ground/projection/display history, Catalog provider/cache/preview, viewer runtime/camera/navigation, Browser/project content, history UI, persistence, collaboration, checkpoints, or branching

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - selected-light Name input is a plain controlled text input bound to `selectedLight.name`
  - current Name `onChange` calls raw `updateLight(selectedLight.id, { name })` on every keystroke
  - selected-light Color input is a native `input[type="color"]` bound to `selectedLight.color`
  - current Color `onChange` calls raw `updateLight(selectedLight.id, { color })`; browser color pickers may emit multiple intermediate `input`/`change` events during picker interaction depending on platform
  - no local selected-light delete button exists in the current editor section
- `src/app/store/uiPrefsStore.ts`
  - raw `updateLight(id, patch)` normalizes light values and remains history-free
  - raw `deleteLight(id)` removes the light and advances `selectedLightId`; it remains history-free
- `src/app/store/environmentLookEditHistory.ts`
  - accepted helper can capture before/after `EnvironmentLookSnapshot`, commit no-op-protected entries, and restore only `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
  - same helper should be reused for Name and Delete rather than adding a new history owner
- `src/app/store/workspaceSelectionCommands.ts`
  - `deleteWorkspaceSelectedEnvironmentLight(...)` accepts `deleteLight` as a dependency and already centralizes environment-light deletion plus next-selection side effects
  - this is the preferred narrow Delete seam: wrap only the `deleteLight` dependency or add a tiny history-aware command wrapper while preserving return shape and selection side effects
- `src/app/panels/useBrowserPanelController.ts`
  - calls `deleteWorkspaceSelectedEnvironmentLight(...)` for Browser environment-light delete
  - implementation may only touch it if routing through a history-aware delete dependency is needed
- `src/app/console/useConsoleInteraction.ts`
  - calls `deleteWorkspaceSelectedEnvironmentLight(...)` for console delete flows
  - implementation should preserve command transcript/recall behavior and only route the authored light delete through the environment-look helper
- focused tests:
  - `src/app/components/ViewToolbar.test.tsx` covers selected-light editor controls and is the likely Name proof surface
  - `src/app/store/workspaceSelectionCommands.test.ts` already covers environment-light delete selection side effects and is the likely Delete proof surface
  - `src/app/store/environmentLookEditHistoryStore.test.ts` proves helper-level restore/no-op/raw-setter boundaries

First-Pass Decisions:
- Name is safe to implement narrowly with a ViewToolbar-local `useRef<EnvironmentLookSnapshot | null>` focus-session draft:
  - capture on focus
  - keep raw per-keystroke `updateLight(...)` updates during editing
  - commit once on blur or Enter using `commitEnvironmentLookHistory(...)`
  - guard duplicate blur-after-Enter by clearing the draft before blur can commit again
  - do not intercept Ctrl/Meta text undo; let the input keep native editing behavior
- Color should split/defer unless implementation finds a reliable one-entry boundary:
  - native color inputs do not provide a universally reliable commit-end boundary in the current app
  - do not invent a custom color picker or broad local draft model in this phase
  - implementation may keep Color raw/history-free and document it as the remaining follow-up
- Delete is safe to implement narrowly if it wraps the existing delete dependency:
  - capture before deletion
  - call existing `deleteWorkspaceSelectedEnvironmentLight(...)` with the same dependencies/target/options
  - commit after the command returns a non-null result
  - preserve `WorkspaceSelectedEnvironmentLightDeleteResult | null` return behavior and current next-selection side effects

### Phase 1.1c Implementation Spec

Exact First Code Cut:
- add a tiny selected-light name draft in `ViewToolbar`:
  - `selectedLightNameDraftRef: EnvironmentLookSnapshot | null`
  - `beginSelectedLightNameDraft()` on input focus
  - raw `updateLight(...)` on `onChange`
  - `commitSelectedLightNameDraft(lightId)` on blur and Enter
  - clear the draft before committing to avoid duplicate blur-after-Enter entries
  - use target metadata such as `targetId: environment-light:<lightId>:name`, `targetLabel: Environment light name`
- do not route Color unless a narrow existing completed-change event is proven during implementation; if not, leave Color raw/history-free and mark as split
- add a narrow history-aware delete wrapper, likely near `workspaceSelectionCommands` or in a small store-adjacent helper:
  - preserve raw `deleteWorkspaceSelectedEnvironmentLight(...)`
  - expose a wrapper such as `deleteWorkspaceSelectedEnvironmentLightWithHistory(...)` or wrap the `deleteLight` dependency at Browser/console call sites
  - commit only after the raw command returns non-null
  - use target metadata such as `targetId: environment-light:<lightId>:delete`, `targetLabel: Environment light delete`
- update Browser and console call sites only if needed to route the existing authored delete command through the wrapper
- add focused tests for Name, Delete, raw no-entry, duplicate blur/Enter guard, and no-op/missing target behavior

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/store/workspaceSelectionCommands.test.ts`
- `src/app/panels/useBrowserPanelController.ts` only if Browser delete dependency routing must change
- `src/app/console/useConsoleInteraction.ts` only if console delete dependency routing must change
- `src/app/store/environmentLookEditHistory.ts` only if a tiny shared light target metadata helper is useful
- `src/app/store/environmentLookEditHistoryStore.test.ts`
- `src/app/store/uiPrefsStore.ts` read-only unless a tiny selector/test seam is missing

No-Widening Rule:
- do not make raw `updateLight(...)` or `deleteLight(...)` automatically historyful
- do not restore full `ViewSettings`; restore only `EnvironmentLookSnapshot`
- do not add a custom color picker, new light schema, light reorder/grouping, broad ViewToolbar input architecture, shared keyboard/native text undo changes, or command transcript/recall undo
- do not route material/grid/ground/projection/display, Catalog provider/cache/preview, viewer runtime/camera/navigation, Browser/project content, selected-light transform shell behavior, history UI, persistence, collaboration, checkpoints, or branching into canonical history

Implementation Risks:
- blur-after-Enter can double-commit Name unless the draft is cleared before the blur handler runs.
- text inputs must preserve native Ctrl/Meta undo while focused; do not route shared keyboard handling or intercept text editing shortcuts.
- native color input completion behavior is platform/browser-dependent; claiming Color without a reliable testable boundary risks per-drag or per-picker spam.
- Delete is shared by Browser and console; wrapping too high could capture command transcript/recall, while wrapping too low could make raw setup calls historyful.
- Undoing a delete restores lighting selection from the snapshot; Browser/workspace selected-target side effects after undo should not be widened in this phase unless already handled by the accepted snapshot boundary.

Checklist:
- [x] Implement selected-light Name one-entry focus-session commit or stop/split if duplicate/native-undo behavior cannot stay narrow.
- [x] Keep selected-light Color raw/history-free unless a reliable completion boundary is found.
- [x] Implement selected-light Delete through a narrow wrapper around the existing shared environment-light delete command or stop/split if it requires broad workspace/console rewiring.
- [x] Preserve raw `updateLight(...)` / `deleteLight(...)` no-entry behavior.
- [x] Add no-op, missing-light, unchanged-name, duplicate blur-after-Enter, and delete no-entry tests.
- [x] Prove undo/redo restore only environment-look state and do not capture Browser/project content, command transcript/recall, viewer runtime, camera/navigation, or broader view settings.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "selected-light"` for Name editor proof
- `npm.cmd test -- --run src/app/store/workspaceSelectionCommands.test.ts` for Delete seam proof if touched
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/panels/browserInteractions.test.ts` only if Browser controller routing changes need nearby regression proof
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "environment light"` only if console routing changes require targeted proof and remains focused/reliable

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- update `docs/CHANGELOG.md` only during runtime/test implementation
- update this phase doc with implementation closeout, checklist truth, split decisions, verification notes, and Doc History after implementation passes
- update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete until Manager accepts the implementation

Stop Condition:
- stop and split if Name needs broad local input architecture or shared keyboard/native text undo changes
- stop and split Color if no reliable existing completed-change boundary exists
- stop and split Delete if preserving Browser and console return/selection behavior requires broad workspace-selection rewrites or command transcript/recall changes

Done Shape:
- Phase 1.1c is done when Name and narrow selected-light Delete either create one canonical `viewer-environment` entry per committed action or are explicitly split, Color is either safely implemented or explicitly deferred, raw setters remain history-free, focused tests and build pass, and the phase doc states whether `Edit-History-Gen2-HLG-1` can close or must remain open for Color/delete follow-up.

### Phase 1.1c Closeout

Status:
- complete after focused selected-light Name, shared Delete, environment-look regression, and production build verification

Runtime Behavior Added:
- ViewToolbar selected-light Name edits now capture an environment-look snapshot on focus, keep raw `updateLight(...)` updates during typing, and commit one canonical `Change environment look` entry on blur or Enter.
- Name commit clears the draft before blur can run again, avoiding duplicate blur-after-Enter entries while preserving native text input undo behavior during focus.
- Name Escape now follows the normal text-input path instead of clearing the draft, so a typed raw name cannot persist without the eventual blur/Enter canonical entry.
- `deleteWorkspaceSelectedEnvironmentLightWithHistory(...)` now wraps the accepted shared environment-light delete command, preserves the raw command return shape and next-selection side effects, and commits a canonical environment-look entry only when the raw command returns a non-null result.
- Browser and console environment-light delete call sites now use the history-aware wrapper without changing command transcript/recall ownership.
- Raw `updateLight(...)`, raw `deleteLight(...)`, and raw `deleteWorkspaceSelectedEnvironmentLight(...)` remain history-free for setup/tests/live paths.

Color Decision:
- Color remains deferred. The current native `input[type="color"]` does not expose a reliable existing completed-change boundary across picker interactions, and this phase did not add a custom color picker or broad input-state model.

Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "selected-light name"` passed after the Escape repair
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "selected-light"` passed
- `npm.cmd test -- --run src/app/store/workspaceSelectionCommands.test.ts` passed
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed
- `npm.cmd run build` passed

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 1.1c` for selected-light Name and Delete commit entries on 2026-04-22 05:01:39.
- `Edit-History-Gen2-HLG-1` remains open for a next prep pass to route remaining presentation candidates, including the native selected-light Color commit-boundary deferral and the earlier material/grid/ground/projection/display exclusions.
- Delete has no required follow-up in the current phase; Color is intentionally not marked shipped because the current native color input still lacks a reliable completed-change boundary.

## [x] `Edit-History-Gen2-1 / Phase 2` - `Remaining Presentation Candidate Routing`

### Phase 2 Summary

Purpose:
- route the remaining durable scene presentation candidates after the accepted environment-look slices without starting runtime undo implementation
- classify selected-light Color, material presets/per-part material, ground settings, display/view options, and captured-look comparison helpers into the correct later proof or implementation lanes
- keep `Edit-History-Gen2-HLG-1` honest by separating implemented environment-look history from presentation candidates that still need ownership, storage, or commit-boundary proof

Owns:
- selected-light Color routing after the native input commit-boundary deferral from Phase 1.1c
- material preset and per-part material ownership/storage routing
- ground setting ownership/storage routing
- axis/grid/projection/wireframe/display option routing across scene-presentation and workspace-preference boundaries
- captured environment look, quick compare, and recall-helper routing as workflow/session/reader candidates rather than canonical authored runtime undo
- a Worker-ready next-step recommendation for whether the remaining presentation surface should continue as proof-only or split into smaller implementation phases

Does Not Own:
- runtime undo implementation for Color, material, ground, grid, axis, projection, wireframe, display, or captured-look helpers
- a custom color picker or broad ViewToolbar input architecture
- full `ViewSettings` snapshots or restoration
- history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview state, viewer runtime/camera/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel cleanup

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - selected-light Color still uses a native color input that updates through raw light mutation without a reliable existing completed-change boundary
  - material, ground, environment, display, projection, grid, wireframe, and axis overlay controls converge on `useUiPrefsStore` view/environment actions
  - captured look, recall, and quick-compare controls call the ui-prefs captured-look/comparison actions
- `src/app/store/uiPrefsStore.ts`
  - accepted environment-look history already restores only `EnvironmentLookSnapshot` fields: `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
  - material preset, per-part material, ground, projection, grid, wireframe, and axis overlay live under broader `ViewSettings`/view persistence rather than the accepted environment-look payload
  - `capturedEnvironmentLook`, `environmentLookComparisonActive`, and `environmentLookComparisonRestore` behave as workflow/session comparison helpers, not durable authored scene output
- `src/app/store/uiPrefsPersistence.ts` and `src/shared/viewSettingsTypes.ts`
  - define the broader view/presentation persistence surface that must be split before any runtime undo wrapper can safely restore material, ground, grid, projection, wireframe, or display state
- `src/app/viewCommands.ts`
  - owns view command helpers such as projection changes; camera/navigation remains excluded
- `src/app/workspace/workspacePersistence.ts` and `src/app/workspace/workspaceShellTypes.ts`
  - persist viewport-local projection, axis overlay, and workspace layout preferences, creating a boundary with `Edit-History-Gen2-3 - Workspace Layout And Preference Undo Candidates`
- current focused proof surfaces include `src/app/store/scenePresentationEditHistoryReadiness.test.ts`, `src/app/store/uiPrefsStore.test.ts`, `src/app/store/uiPrefsPersistenceBridge.test.tsx`, `src/app/components/ViewToolbar.test.tsx`, `src/app/viewCommands.test.ts`, and workspace persistence tests

First-Pass Decisions:
- Phase 2 is docs-only routing and should not mark `Edit-History-Gen2-HLG-1` complete by itself.
- Selected-light Color stays deferred until a reliable completed-change boundary exists without a custom picker or broad input-state model.
- Material presets and per-part material are plausible durable user-authored presentation candidates, but they need a proof phase before runtime undo because they live in the broader `ViewSettings` surface.
- Ground settings are plausible durable user-preference candidates, but should split from material if sharing one restore payload would require broad `ViewSettings` capture.
- Axis/grid/projection/wireframe/display options are mixed presentation and workspace/local-view preferences. Projection and axis overlay especially overlap with workspace persistence and should route toward `Edit-History-Gen2-3` unless a later proof establishes a presentation-owned snapshot.
- Captured environment look, quick compare, and recall helpers are comparison/workflow state. They should not become Gen2 runtime undo entries; route them to Gen3 reader/history UX planning only if the user promotes comparison recall as durable authored content.

Candidate Routing Recommendation:
- `Selected-light Color`: defer; requires a future tiny color-input completion-boundary proof or a deliberate custom picker phase before runtime undo is safe.
- `Material presets / per-part material`: next best candidate for `Phase 2.1 - Material Ownership And Commit Boundary Proof`; likely Gen2 runtime undo only after a narrow material snapshot is proven.
- `Ground settings`: route to a later `Phase 2.2` proof/implementation after material, or split earlier if ground has a simpler independent snapshot.
- `Axis/grid/projection/wireframe/display`: route as ownership-proof work, with projection/axis overlay cross-referenced to workspace layout/preference undo rather than claimed here.
- `Captured environment look / quick compare / recall`: exclude from Gen2 runtime undo; document as Gen3 reader/history UX or workflow comparison planning if promoted.

### Phase 2 Implementation Spec

Exact First Code Cut If Approved:
- keep Phase 2 itself docs-only unless Manager explicitly approves a proof implementation subphase
- create a focused proof subphase before runtime wrappers, preferably `Edit-History-Gen2-1 / Phase 2.1 - Material Ownership And Commit Boundary Proof`
- in that proof subphase, add tests that:
  - identify material preset/per-part material storage and raw setter boundaries
  - prove raw material and ground/display/view actions are history-free before wrappers exist
  - prove captured-look comparison/recall actions are no-entry workflow helpers
  - prove broader view/runtime/provider/camera/navigation state remains outside canonical edit history
- only after proof passes should a later runtime implementation add narrow snapshot/restore helpers for one candidate family at a time

Likely Files For Later Proof/Implementation:
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/uiPrefsPersistenceBridge.test.tsx`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/store/environmentLookEditHistoryStore.test.ts` for regression if the accepted environment-look helper is reused
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/viewCommands.ts`
- `src/app/viewCommands.test.ts`
- `src/app/workspace/workspacePersistence.ts` read-only unless the later phase is explicitly moved to workspace preferences
- `src/app/workspace/useWorkspaceStore.test.ts` or focused workspace persistence tests if projection/axis overlay routing needs proof

No-Widening Rule:
- do not implement runtime undo in this Phase 2 routing pass
- do not add selected-light Color history through native per-event updates
- do not add a custom color picker, broad ViewToolbar input architecture, or shared input model
- do not snapshot or restore full `ViewSettings`
- do not route material, ground, projection, grid, axis, wireframe, display, captured-look, quick-compare, or recall helpers into canonical history until a later Manager-approved subphase proves ownership and commit boundaries
- do not route camera/navigation, viewer runtime state, Catalog provider/cache/preview state, Browser/project content, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, or unrelated Catalog/Pubwheel work

Implementation Risks:
- `ViewSettings` mixes durable authored presentation, user preferences, workspace-local view settings, and workflow state; restoring it wholesale would rewind unrelated settings.
- Native color inputs can emit continuous changes with browser-dependent completion behavior, so Color needs a deliberate boundary before canonical entries.
- Material and per-part material may need different target metadata and payload shapes from environment look.
- Ground settings may be simple durable preferences, but grouping them with material/display options risks an oversized snapshot.
- Projection and axis overlay have workspace-local persistence seams and may belong in Gen2 workspace preference planning instead of scene-presentation undo.
- Captured-look comparison state can look like presentation state, but it is closer to reader/workflow comparison state and should not become authored runtime undo accidentally.

Checklist:
- [x] Route selected-light Color as deferred pending a reliable completion-boundary proof.
- [x] Route material presets/per-part material as the recommended next proof subphase.
- [x] Route ground settings as a durable-preference candidate that should split if material proof becomes broad.
- [x] Route axis/grid/projection/wireframe/display as ownership-proof candidates, with projection/axis overlay cross-boundary noted for workspace preferences.
- [x] Route captured environment look, quick compare, and recall helpers out of Gen2 runtime undo and toward Gen3 reader/history UX only if promoted.
- [x] Keep Phase 2 docs-only and avoid claiming `Edit-History-Gen2-HLG-1` complete.
- [x] Update this phase doc and `docs/Doc-Log.md`; leave `docs/CHANGELOG.md` untouched.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsPersistenceBridge.test.tsx`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material|ground|color|compare|projection|grid|wireframe"`
- `npm.cmd test -- --run src/app/viewCommands.test.ts` if projection/view command ownership is included
- focused workspace persistence tests only if projection/axis overlay is claimed by a later workspace-preference phase

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- for this prep, update this future doc and `docs/Doc-Log.md` only
- do not update `docs/CHANGELOG.md` unless a later implementation changes runtime/test behavior
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete during prep; Manager handles status after acceptance

Stop Condition:
- stop and split if selected-light Color requires a custom picker, broad input architecture, or per-event native color history
- stop and split if material/per-part material cannot be restored without full `ViewSettings`
- stop and route to Gen2 workspace preferences if projection, axis overlay, or display options prove to be workspace-local rather than scene-presentation owned
- stop and route to Gen3 if captured-look comparison/recall needs reader/history UX rather than authored runtime undo

Done Shape:
- Phase 2 is done when the remaining presentation candidates are classified into explicit future lanes, the next implementation-ready proof target is named, no runtime undo is started, docs tracking is updated, and `Edit-History-Gen2-HLG-1` remains open for Manager to close only after the remaining durable presentation candidate decisions are accepted or explicitly deferred.

### Phase 2 Closeout

Status:
- complete as docs-only routing after Manager live seam review

Manager Review:
- accepted selected-light Color as deferred because the current native input still has no reliable completed-change boundary
- accepted material presets/per-part material as the next proof target because they are durable user-facing presentation state under broader `ViewSettings`
- accepted ground as a later split candidate if material ownership proof becomes broad
- accepted projection/axis/display routing as cross-boundary with workspace preference planning unless a later proof finds a presentation-owned snapshot
- accepted captured environment look, quick compare, and recall helpers as workflow/comparison state outside Gen 2 runtime undo unless promoted to Gen 3 reader/history UX

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2` on 2026-04-22 05:05:33.
- `Edit-History-Gen2-HLG-1` remains open for `Phase 2.1 - Material Ownership And Commit Boundary Proof`.

## [x] `Edit-History-Gen2-1 / Phase 2.1` - `Material Ownership And Commit Boundary Proof`

### Phase 2.1 Summary

Purpose:
- prove whether material presets and per-part material mapping are a safe durable scene-presentation undo candidate before adding runtime material history entries
- define the narrow material snapshot boundary independently from full `ViewSettings`, accepted environment-look history, ground, display, projection, workspace-local view state, and captured-look comparison helpers
- document real ViewToolbar and ui-prefs material commit boundaries so a later implementation can avoid per-tick/per-character history spam

Owns:
- material preset list selection, add, and delete behavior as currently exposed by `ViewToolbar`
- material preset name, base color, emissive color, metalness, roughness, emissive intensity, opacity, and transparent edits as current raw material editor controls
- per-part material mode toggle, part assignment, and clear assignment behavior
- `useUiPrefsStore` material setter boundaries: `selectMaterialPreset(...)`, `updateMaterialPreset(...)`, `addMaterialPreset(...)`, `deleteMaterialPreset(...)`, `setUsePerPartMaterial(...)`, `assignPartMaterial(...)`, `clearPartMaterial(...)`, and `setPerPartMaterialMap(...)`
- `view.materials` shape and `viewSettingsPersistence` storage proof
- proof that raw material actions are history-free and do not invalidate canonical redo before history wrappers exist

Does Not Own:
- runtime material undo entries
- selected-light Color implementation
- custom color picker or broad material editor input architecture
- full `ViewSettings` snapshot/restore
- ground, projection, grid, wireframe, display, workspace local-view, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/provider/camera/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - reads `view.materials.presets`, `view.materials.selectedPresetId`, `view.materials.usePerPart`, and `view.materials.perPart`
  - selects presets by clicking `ListRow` entries and calling `selectMaterialPreset(preset.id)`
  - deletes presets via the row `Del` button and `deleteMaterialPreset(preset.id)`, disabled when only one preset remains
  - adds presets via `addMaterialPreset()`
  - edits preset `name` through a text input that currently calls raw `updateMaterialPreset(...)` on every change
  - edits `color` and `emissive` through native color inputs that currently call raw `updateMaterialPreset(...)` on change, with no proven completed-change boundary
  - edits `metalness`, `roughness`, `emissiveIntensity`, and `opacity` through native range inputs that currently call raw `updateMaterialPreset(...)` on change
  - edits `transparent` through a checkbox that currently commits one discrete raw `updateMaterialPreset(...)`
  - toggles per-part material through `setUsePerPartMaterial(event.target.checked)`
  - assigns and clears per-part material through a native select and `Clear` button, calling `assignPartMaterial(...)` or `clearPartMaterial(...)`
- `src/app/store/uiPrefsStore.ts`
  - stores material state under `view.materials`
  - `uniqueMaterialId(...)` generates `mat_${Date.now() + salt}` ids for added presets
  - `sanitizePreset(...)` clamps numeric material fields
  - `addMaterialPreset(...)` clones from the selected or first preset, creates a new selected preset, and writes it into `view.materials.presets`
  - `deleteMaterialPreset(...)` no-ops when only one preset remains, selects the first remaining preset if the active preset is deleted, and removes per-part assignments that pointed at the deleted preset
  - `assignPartMaterial(...)` no-ops for missing preset ids
  - `clearPartMaterial(...)` no-ops when no assignment exists for the part
- `src/shared/viewSettingsTypes.ts`
  - defines `MaterialPreset`, `MaterialPresetId`, `PartMaterialMap`, and `ViewSettings['materials']`
  - `normalizeViewSettings(...)` clones material presets and per-part maps but does not define a material-only snapshot
- `src/app/store/uiPrefsPersistence.ts`
  - persists materials only when `viewSettingsPersistence` is true
  - applies and merges materials as part of broader view settings, alongside projection, orbit, grid, axes, ground, axis overlay, and other display/user-view state
- Focused test seams likely include `src/app/store/uiPrefsStore.test.ts`, `src/app/store/uiPrefsPersistenceBridge.test.tsx`, `src/app/store/scenePresentationEditHistoryReadiness.test.ts`, and `src/app/components/ViewToolbar.test.tsx`

First-Pass Decisions:
- Phase 2.1 should remain proof/test-only. It should not add canonical material entries yet.
- The later runtime implementation should introduce a narrow material snapshot, not reuse `EnvironmentLookSnapshot` and not snapshot full `ViewSettings`.
- Button/select/checkbox operations are likely one-entry candidates after proof: preset select, preset add, preset delete, transparent toggle, per-part mode toggle, assignment, and clear.
- Text name edits need a focus-session draft like selected-light Name if runtime undo is later approved.
- Native color inputs for base color and emissive should remain deferred unless a reliable completion boundary is proven without a custom picker or broad material editor model.
- Native range inputs need explicit commit-end treatment before runtime undo. The current raw range controls only expose `onChange`; a later implementation must either add a tiny commit boundary or split numeric material sliders to a follow-up.
- Added preset ids are generated by the raw store seam; a future runtime undo entry must preserve the generated id on redo instead of allocating a new id.
- Delete fallback selection and per-part map cleanup are part of the authored material payload and must be proven before any restore path ships.

Recommended Split:
- Keep Phase 2.1 as proof-only.
- If proof passes, create a later runtime subphase such as `Phase 2.2 - Material Preset And Per-Part Commit Entries`.
- Split native material Color/Emissive and range sliders from the first runtime pass unless a tiny, reliable commit-end seam is proven during Phase 2.1.

### Phase 2.1 Implementation Spec

Exact First Code Cut If Approved:
- add or extend focused proof tests without changing runtime behavior:
  - prove `view.materials` is a durable user-presentation state under `viewSettingsPersistence`
  - prove material state is separate from `EnvironmentLookSnapshot`
  - prove raw material setters create no canonical edit-history entries and do not invalidate redo
  - prove add/delete behavior for generated ids, selected preset fallback, one-preset delete no-op, missing preset assignment no-op, and delete cleanup of `perPart`
  - prove per-part mode, assignment, and clear are stored only in `view.materials`
  - prove captured-look/compare/recall, ground, projection/grid/wireframe/display, workspace local view, viewer runtime/cache/provider/camera/navigation, Browser/project content, command transcript/recall, and accepted environment-look history are excluded from material proof
- do not route ViewToolbar material controls through canonical history in this proof pass
- do not add a material history helper until a later runtime implementation phase

Likely Files:
- `src/app/store/uiPrefsStore.ts` read-only unless a tiny test helper is absolutely required
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/uiPrefsPersistenceBridge.test.tsx`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/store/editHistoryStore.ts` read-only for canonical no-entry/redo assertions
- `src/app/store/environmentLookEditHistoryStore.test.ts` only for regression if proof touches accepted environment-look boundaries
- `src/app/components/ViewToolbar.tsx` read-only unless a later implementation needs commit-boundary wiring
- `src/app/components/ViewToolbar.test.tsx`
- `src/shared/viewSettingsTypes.ts` read-only unless a later phase adds a material snapshot type
- `src/app/store/uiPrefsPersistence.ts` read-only unless a later phase extracts material persistence helpers

No-Widening Rule:
- no runtime material undo implementation in Phase 2.1
- no custom color picker, broad material editor state model, or full ViewToolbar material rewrite
- no full `ViewSettings` snapshot/restore
- no changes to selected-light Color, ground, projection, grid, wireframe, display, workspace preferences, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/provider/camera/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel files
- keep raw material setters history-free and do not make `useUiPrefsStore` material actions automatically canonical

Implementation Risks:
- material state currently lives inside broad `ViewSettings`, so a careless restore path would rewind ground, projection, grid, axis overlay, display options, and other view preferences.
- native color inputs and native range inputs currently expose only `onChange`; runtime undo would spam history unless a commit boundary is added or those controls split out.
- text name editing must preserve native text undo while focused and avoid blur-after-Enter duplicates if later made historyful.
- generated preset ids must be captured from the successful raw add result/state delta; redo must restore the same id instead of calling raw add again.
- delete has authored side effects beyond removing the preset: selected fallback and per-part cleanup.
- per-part assignments depend on live part ids from the currently rendered viewer parts list; history payloads should store only the material map, not viewer runtime/part-reader state.

Checklist:
- [x] Prove material storage belongs to `view.materials` and `viewSettingsPersistence`.
- [x] Prove material state is not part of accepted `EnvironmentLookSnapshot` restore.
- [x] Prove raw material preset select/add/delete/update setters are no-entry and preserve redo.
- [x] Prove raw per-part mode/assignment/clear setters are no-entry and preserve redo.
- [x] Prove generated preset id, selected fallback, one-preset delete no-op, missing preset assignment no-op, and delete per-part cleanup semantics.
- [x] Document which material controls are safe future one-entry commits and which must split for text/color/range commit boundaries.
- [x] Keep full `ViewSettings`, ground, display/projection/grid/wireframe, workspace local view, captured-look comparison, runtime/provider/cache/camera, Browser/project, command transcript/recall, and unrelated Catalog/Pubwheel state excluded.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` after proof verification.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsPersistenceBridge.test.tsx`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` only if accepted environment-look helper boundaries are touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- for prep, update this future doc and `docs/Doc-Log.md` only
- do not update `docs/CHANGELOG.md` unless a later implementation changes runtime/test behavior
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete during prep; Manager handles status after acceptance

Stop Condition:
- stop and keep Phase 2.1 proof-only if material ownership cannot be represented without full `ViewSettings`
- stop and split native color fields if no reliable completed-change boundary exists
- stop and split native range fields if adding commit-end semantics would require broad material editor rewrites
- stop and route per-part material elsewhere if assignments prove to depend on runtime viewer part state rather than durable material preferences
- stop and report if tests require touching Catalog/Pubwheel or unrelated viewer/provider/cache behavior

Done Shape:
- Phase 2.1 is done when focused proof can identify material ownership/storage, raw no-entry behavior, no-op/fallback/delete cleanup semantics, safe versus unsafe future commit boundaries, and exclusion from environment look/full view/runtime/workspace state. It should recommend whether the next Manager action is a runtime material entry phase, a smaller material commit-boundary prep, or a split that defers color/range/text controls.

### Phase 2.1 Closeout

Status:
- complete after focused material ownership proof and production build verification

Proof Added:
- `scenePresentationEditHistoryReadiness.test.ts` now proves raw material preset and per-part material actions create no canonical entries, preserve existing redo, and do not alter the accepted `EnvironmentLookSnapshot` boundary.
- `uiPrefsStore.test.ts` now proves material state lives in `view.materials`, generated preset ids are retained by the store seam, numeric material fields are sanitized, selected-preset fallback occurs on delete, one-preset delete is a no-op, missing preset assignment is a no-op, missing assignment clear is a no-op, and deleting a preset removes per-part assignments pointing at it.

Future Commit Boundary Decision:
- Safe likely one-entry future material commits: preset selection, preset add, preset delete, transparent toggle, per-part mode toggle, per-part assignment, and per-part clear.
- Split or prove before runtime undo: preset name text edits need a focus-session draft, native base/emissive color inputs need a reliable completed-change boundary, and native range edits need a commit-end seam before they can avoid per-change history spam.
- Runtime material undo remains deferred; this phase added proof only and no canonical material wrappers or entries.

Verification:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` passed with 12 tests.
- `npm.cmd run build` passed with the known Vite browser-externalized module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.1` on 2026-04-22 05:15:02 after focused material readiness, uiPrefs material, environment-look regression, and production build verification passed.
- `Edit-History-Gen2-HLG-1` remains open for runtime material commit entries and later ground/display routing.
- Recommended next Manager action is prep-only `Phase 2.2 - Material Preset And Per-Part Commit Entries`, limited to safe discrete material controls. Material preset text, native color inputs, and native range inputs remain split until their commit boundaries are proven.

## [x] `Edit-History-Gen2-1 / Phase 2.2` - `Material Preset And Per-Part Commit Entries`

### Phase 2.2 Summary

Purpose:
- implement the first runtime material undo slice over the safe discrete material controls proven in Phase 2.1
- route one semantic canonical entry per completed material preset/per-part action without adding history spam for text, native color, or range controls
- restore only `view.materials`, not full `ViewSettings`, accepted environment look state, ground, display, projection, workspace-local view state, viewer runtime state, or provider/cache state

Owns:
- material preset selection
- material preset add
- material preset delete
- material preset `transparent` checkbox toggle
- per-part material mode toggle
- per-part material assignment
- per-part material clear
- no-op detection for unchanged selected preset, unsupported/missing preset ids, one-preset delete, missing per-part assignments, duplicate assignments, and unchanged per-part mode
- stable undo/redo restoration for generated material ids, selected preset fallback, and delete cleanup of `perPart`

Does Not Own:
- material preset name text edits
- material base color or emissive native color inputs
- material numeric range inputs such as `metalness`, `roughness`, `emissiveIntensity`, or `opacity`
- selected-light Color
- ground, display, projection, grid, wireframe, axis overlay, workspace preference state, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel files

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - `selectMaterialPreset(preset.id)` on material list row click
  - `addMaterialPreset()` on `Add Preset`
  - `deleteMaterialPreset(preset.id)` on row `Del`, disabled while one preset remains
  - `updateMaterialPreset(selectedPreset.id, { transparent })` on the transparent checkbox
  - `setUsePerPartMaterial(event.target.checked)` on the per-part mode checkbox
  - `assignPartMaterial(partKeyStr, value)` and `clearPartMaterial(partKeyStr)` through per-part select / `Clear`
  - text/color/range material fields call raw `updateMaterialPreset(...)` on every change and remain out of this phase
- `src/app/store/uiPrefsStore.ts`
  - raw material setters remain available and history-free for setup, tests, and future live interactions
  - `addMaterialPreset(...)` generates `mat_${Date.now() + salt}` and selects the new preset
  - `deleteMaterialPreset(...)` no-ops for one preset, falls selection back to the first remaining preset if the active preset is deleted, and removes `perPart` assignments that point at the deleted preset
  - `assignPartMaterial(...)` no-ops for unknown preset ids
  - `clearPartMaterial(...)` no-ops when no assignment exists
- `src/shared/viewSettingsTypes.ts`
  - `ViewSettings['materials']` contains the exact target state for this phase: `presets`, `selectedPresetId`, `usePerPart`, and `perPart`
  - a future helper should clone/normalize this material subset and compare it without touching the rest of `ViewSettings`
- `src/app/store/editHistoryStore.ts`
  - canonical owner already supports direct synchronous entries, no-op ignores, redo invalidation, and read APIs

First-Pass Decisions:
- Add a narrow material history helper/wrapper seam rather than making raw `useUiPrefsStore` material setters automatically historyful.
- Prefer store-adjacent helper functions under `src/app/store/`, parallel in spirit to `environmentLookEditHistory`, but scoped to material snapshots.
- The restore payload should be a material-only snapshot over `view.materials`: `presets`, `selectedPresetId`, `usePerPart`, and `perPart`.
- Do not reuse `EnvironmentLookSnapshot`; materials are intentionally outside that accepted restore boundary.
- Do not snapshot full `ViewSettings`; undo/redo must preserve ground, projection, grid, wireframe, axis overlay, captured look/compare/recall state, environment look, viewer runtime/cache/navigation, and workspace local view state.
- For generated material ids, commit after the raw add completes by comparing before/after snapshots and preserving the resulting generated id in the after snapshot. Redo restores that same id from the snapshot instead of invoking raw add again.
- For delete, store before/after material snapshots so undo restores the deleted preset, previous selected id, and previous `perPart` assignments, while redo reapplies the delete fallback and cleanup exactly as the raw command produced them.
- For discrete ViewToolbar actions, each wrapper should return or expose enough result information for tests to prove one entry per semantic action and no entry for unchanged/no-op actions.

Recommended Scope Shape:
- Implement safe discrete controls in one phase if the material snapshot helper stays small and store-adjacent.
- Keep material text/color/range controls split to later phases because their current native inputs lack accepted commit boundaries.
- If ViewToolbar wiring becomes broad, stop after adding store-level material wrappers/tests and report UI routing as a follow-up instead of rewriting the material editor.

### Phase 2.2 Implementation Spec

Exact First Code Cut:
- add a narrow material snapshot/helper module or store-adjacent functions, likely in `src/app/store/materialEditHistory.ts` or near `uiPrefsStore`
  - `createMaterialSnapshot(view.materials)` or equivalent clone helper
  - `areMaterialSnapshotsEqual(...)`
  - `restoreMaterialSnapshot(snapshot)` through `useUiPrefsStore.setState(...)` / `setView(...)` preserving all non-material `view` fields
  - `commitMaterialChangeWithHistory({ label, targetId, targetLabel, before, after, apply? })` or action-specific wrappers
- add history-aware wrappers for the safe discrete operations:
  - `selectMaterialPresetWithHistory(id)`
  - `addMaterialPresetWithHistory(preset?)`
  - `deleteMaterialPresetWithHistory(id)`
  - `setMaterialPresetTransparentWithHistory(id, transparent)`
  - `setUsePerPartMaterialWithHistory(enabled)`
  - `assignPartMaterialWithHistory(partId, presetId)`
  - `clearPartMaterialWithHistory(partId)`
- keep raw `selectMaterialPreset(...)`, `addMaterialPreset(...)`, `deleteMaterialPreset(...)`, `updateMaterialPreset(...)`, `setUsePerPartMaterial(...)`, `assignPartMaterial(...)`, and `clearPartMaterial(...)` history-free
- wire only the owned discrete `ViewToolbar` controls to the history-aware wrappers if that can stay tiny and local
- leave text/color/range material controls raw/history-free

Likely Files:
- `src/app/store/uiPrefsStore.ts`
- `src/app/store/materialEditHistory.ts` or an equivalent small store-adjacent helper file
- `src/app/store/materialEditHistoryStore.test.ts` or focused additions to `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/store/uiPrefsStore.test.ts` for raw setter regression if wrappers touch store typing
- `src/app/components/ViewToolbar.tsx` only for tiny discrete callback routing
- `src/app/components/ViewToolbar.test.tsx` only if UI wiring changes need focused proof
- `src/app/store/environmentLookEditHistoryStore.test.ts` only if accepted environment-look boundaries are touched, which should not be necessary
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout

No-Widening Rule:
- do not implement material preset name, base color, emissive color, metalness, roughness, emissiveIntensity, or opacity history
- do not add a custom color picker, broad material editor input architecture, or global input model
- do not restore full `ViewSettings`
- do not change selected-light Color, ground, display, projection, grid, wireframe, axis overlay, workspace preferences, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel files
- do not make raw material setters automatically canonical

Implementation Risks:
- material add currently derives an id from `Date.now()`; redo must restore the committed after snapshot with the original generated id rather than calling raw add and allocating another id.
- material delete changes three authored material fields at once: `presets`, `selectedPresetId`, and `perPart`. Undo/redo must restore all three together.
- part material assignment ids are derived from live rendered part keys, but the history payload should store only the material map keys/values, not viewer runtime part reader state.
- if ViewToolbar material callbacks are too intertwined with the broad editor section, store-level wrappers may be safer for the first implementation and UI routing should split.
- no-op detection must compare normalized material snapshots; shallow object identity is not enough.

Checklist:
- [x] Add a material-only snapshot/compare/restore helper over `view.materials`.
- [x] Add history-aware wrappers for preset select/add/delete, transparent toggle, per-part mode toggle, assignment, and clear.
- [x] Keep raw material setters history-free and covered by regression tests.
- [x] Prove generated material id is preserved across undo/redo of add.
- [x] Prove delete undo/redo restores deleted preset, selected fallback, and per-part cleanup.
- [x] Prove unchanged/no-op operations create no entry and do not invalidate redo.
- [x] Prove undo/redo preserves environment look, ground, projection/grid/wireframe/display, captured-look comparison, workspace local view, viewer runtime/cache/navigation, Browser/project content, and command transcript/recall boundaries as far as the focused test seam exposes.
- [x] Wire owned discrete ViewToolbar controls only if the change stays tiny and focused.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` if a new focused material history test is added
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"` if ViewToolbar callback routing changes
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` only if accepted environment-look helper boundaries are touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation must update `docs/CHANGELOG.md` for runtime/test behavior
- implementation must update this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation must update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if material restoration requires full `ViewSettings`
- stop if generated id preservation cannot be proven with snapshot restore
- stop if delete undo/redo cannot restore selected fallback and per-part cleanup deterministically
- stop if ViewToolbar routing requires a broad material editor refactor; report store-level proof/wrapper status and split UI wiring
- stop if text/color/range controls must be touched to support the discrete controls

Done Shape:
- Phase 2.2 is done when safe discrete material actions create one canonical entry per committed action, no-op operations stay no-entry and preserve redo, undo/redo restore only material snapshot state with generated ids/delete cleanup preserved, raw setters remain history-free, split controls remain deferred, focused tests and build pass, and docs/tracking are updated.

### Phase 2.2 Closeout

Status:
- complete after focused material history, uiPrefs, readiness, ViewToolbar, and production build verification

Runtime Behavior Added:
- Added a store-adjacent material edit-history helper over material-only snapshots of `view.materials`.
- Canonical `Change material` entries now cover preset selection, preset add, preset delete, transparent toggle, per-part mode toggle, per-part assignment, and per-part clear.
- Undo/redo restores only material snapshot state and preserves generated material ids, selected fallback, and delete cleanup of `perPart`.
- Raw `useUiPrefsStore` material setters remain history-free for setup/tests/live paths.
- ViewToolbar routes only the safe discrete material callbacks through the history-aware wrappers.

Deferred Controls:
- Material preset name text, base/emissive native color inputs, and numeric range/number inputs remain raw/history-free until a later commit-boundary phase proves safe one-entry behavior.
- Selected-light Color, ground, display/projection/workspace preferences, full `ViewSettings` snapshots, history UI, persistence architecture, collaboration/checkpoints/branching, Catalog provider/cache/preview, and viewer runtime/cache/navigation remain out of scope.

Verification:
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` passed with 12 tests.
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"` passed with 1 test and 38 skipped.
- `npm.cmd run build` passed with the known Vite browser-externalized module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.2` on 2026-04-22 05:23:35 after focused material history, uiPrefs material, scene presentation readiness, ViewToolbar material, and production build verification passed.
- `Edit-History-Gen2-HLG-1` remains open for remaining durable presentation routing.
- Recommended next Manager action is prep-only `Phase 2.3 - Ground Settings Ownership And Commit Boundary Proof`; material text/color/range and selected-light Color remain split until their commit boundaries are proven, while display/projection/workspace-preference candidates remain routed separately.

## [x] `Edit-History-Gen2-1 / Phase 2.3` - `Ground Settings Ownership And Commit Boundary Proof`

### Phase 2.3 Summary

Purpose:
- prove whether current Ground controls are durable user presentation state, workspace/view preference state, or runtime-only state before any canonical ground undo entries are added
- identify the smallest safe future commit boundary for ground enabled/off, ground height, and ground material preset selection
- prove raw ground mutations remain history-free before wrappers exist and do not invalidate redo

Owns:
- ownership/storage proof for `view.ground`
- proof of current raw ground setter behavior through the live ViewToolbar/uiPrefs seams
- a split decision for future runtime ground commit entries
- exclusion proof that ground settings are outside accepted `EnvironmentLookSnapshot` and material-only history snapshots

Does Not Own:
- runtime ground undo entries during this prep/proof phase
- full `ViewSettings` snapshots
- grid, projection, wireframe, axis overlay, display options, workspace local view state, camera/navigation, viewer runtime/cache/provider, material preset editing, selected-light Color, material text/color/range controls, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - defines `groundEnabledOptions` and `groundMaterialOptions`
  - imports `GroundMaterialPresetId`
  - owns a local `setGround(patch)` helper that calls `setView({ ground: { ...view.ground, ...patch } })`
  - Ground section routes:
    - `ParaSelect` label `Ground` for enabled/off state
    - `ParaSlider` label `Ground Height` with raw `onChange={(value) => setGround({ height: value })}`
    - `ParaSelect` label `Material` with `GroundMaterialPresetId` values
- `src/app/store/uiPrefsStore.ts`
  - exposes raw `setView(...)` / `setViewKey(...)`; there is no dedicated `setGround(...)` store API today
  - raw setters are currently history-free and should remain available for setup/live updates
- `src/shared/viewSettingsTypes.ts`
  - defines `GroundMaterialPresetId = 'matte_dark' | 'matte_mid' | 'glossy_studio'`
  - defines `GroundSettings` as `enabled`, `height`, and `materialPresetId`
  - includes `ground` in `ViewSettings`
  - `DEFAULT_VIEW_SETTINGS.ground` defaults to disabled, height `0`, material preset `matte_mid`
  - `GroundMaterialPresetId` is a built-in ground presentation id, not a reference to editable `view.materials.presets`
- `src/app/store/uiPrefsPersistence.ts`
  - persists `ground` only under `viewSettingsPersistence`
  - does not include `ground` in `environmentPersistence`
- Existing focused tests:
  - `src/app/components/ViewToolbar.test.tsx` already has a ground section test around line 3156 proving Ground UI routes into the shared ground view seam
  - `src/app/store/scenePresentationEditHistoryReadiness.test.ts` already proves environment-only persistence preserves existing `ground`, and view-settings persistence carries `ground`
  - `src/app/store/environmentLookEditHistoryStore.test.ts` proves accepted environment-look undo/redo preserves `view.ground`
  - `src/app/store/materialEditHistoryStore.test.ts` proves material-only undo/redo preserves `view.ground`
  - `src/app/store/uiPrefsStore.test.ts` is the likely place for raw state normalization/no-op semantics if a store-level proof is needed

First-Pass Decisions:
- Current ground settings are durable user presentation preferences under broader `viewSettingsPersistence`, not environment look state and not material preset state.
- Phase 2.3 should be proof-first, not runtime implementation, because Ground currently has no dedicated store API and the height control is a live `ParaSlider.onChange` path with no accepted commit-end wrapper.
- Ground material selection uses built-in `GroundMaterialPresetId` values and should not depend on authored material preset snapshot/restore behavior from Phase 2.2.
- A later runtime phase can probably be small if it adds a ground-only snapshot helper over `view.ground`, keeps raw `setView(...)` history-free, routes Ground enabled/material select immediately, and adds a slider end boundary for Ground Height.
- If a future implementation cannot keep Ground Height one-entry without touching broad `ViewToolbar` or `ParaSlider` architecture, split Ground Height from discrete enabled/material preset commits.

Recommended Scope Shape:
- implement Phase 2.3 as proof/test-only first
- only after Manager acceptance, consider a separate runtime phase such as `Phase 2.4 - Ground Setting Commit Entries`
- keep ground enabled and material preset select as likely discrete runtime candidates
- keep ground height behind explicit slider commit-boundary proof, using `ParaSlider.onChangeEnd` if it can be wired narrowly

### Phase 2.3 Implementation Spec

Exact First Code Cut:
- add or extend focused proof tests; do not add canonical ground entries yet
- prove `view.ground` is persisted through `viewSettingsPersistence` and not through `environmentPersistence`
- prove `view.ground` is outside `EnvironmentLookSnapshot` restore and material-only snapshot restore
- prove raw ground updates through `useUiPrefsStore.setView({ ground: ... })` are history-free and preserve redo before wrappers exist
- prove current ViewToolbar Ground controls route only to raw ground state, not canonical edit history
- prove `GroundMaterialPresetId` is built-in ground state and not an authored material preset id dependency

Likely Files:
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/environmentLookEditHistoryStore.test.ts` only if accepted environment-look boundaries need extra proof
- `src/app/store/materialEditHistoryStore.test.ts` only if material snapshot exclusion needs extra proof
- `src/app/components/ViewToolbar.test.tsx` with filter `ground` if ViewToolbar routing proof is extended
- `src/app/components/ViewToolbar.tsx` read-only for proof; no production code expected
- `src/app/store/uiPrefsStore.ts` read-only unless a tiny test seam is missing
- `src/shared/viewSettingsTypes.ts` read-only unless a tiny test seam is missing

No-Widening Rule:
- do not implement runtime ground undo entries during this proof phase
- do not create a full `ViewSettings` history helper
- do not make raw `setView(...)` or `setViewKey(...)` canonical
- do not connect ground material ids to editable material presets
- do not touch grid/projection/wireframe/axis/display/workspace-local-view history
- do not touch material preset editing, selected-light Color, material text/color/range controls, Catalog provider/cache/preview, viewer runtime/cache/provider, camera/navigation, Browser/project content, history UI, persistence architecture, collaboration, checkpoints, branching, command transcript/recall, or unrelated Catalog/Pubwheel files

Implementation Risks:
- `setGround(...)` is currently local to `ViewToolbar`, so a runtime phase may need either a small store-adjacent helper that reads/writes `view.ground` directly or a tiny exported wrapper near ui prefs.
- Ground Height is a live slider path; making it historyful without `onChangeEnd` would create history spam.
- Because `viewSettingsPersistence` groups ground with projection/grid/wireframe/material state, future restore must snapshot only `view.ground` and not the whole persisted view-settings group.
- Ground material ids are built-in ids; future tests should prevent accidental coupling to editable material preset ids.

Checklist:
- [x] Prove `view.ground` belongs to broader `viewSettingsPersistence`.
- [x] Prove `view.ground` is excluded from `EnvironmentLookSnapshot` restore.
- [x] Prove `view.ground` is excluded from material-only history restore.
- [x] Prove raw ground state updates are no-entry and preserve redo before wrappers exist.
- [x] Prove current ViewToolbar Ground controls route to raw ground state without canonical entries.
- [x] Document whether later runtime work should be one phase or split enabled/material select from height slider.
- [x] Keep full `ViewSettings`, grid/projection/wireframe/display/workspace, viewer runtime/cache/provider, camera/navigation, material editing, selected-light Color, history UI, persistence architecture, collaboration/checkpoints/branching, and unrelated Catalog/Pubwheel state excluded.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` only after a future proof implementation changes tests/source/docs.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "ground"` if ViewToolbar proof is extended
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` if environment-look exclusion proof is extended
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` if material snapshot exclusion proof is extended

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md` only
- future proof implementation updates `docs/CHANGELOG.md` only if source/test/runtime behavior changes
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if ground state cannot be proven independently from full `ViewSettings`
- stop if Ground Height cannot be proven without broad `ViewToolbar`/slider/input architecture changes
- stop if ground material ids are found to depend on editable material preset records
- stop if proof requires touching Catalog/Pubwheel or unrelated viewer/runtime/provider/cache paths

Done Shape:
- Phase 2.3 is done when focused proof establishes ground ownership/storage, raw no-entry behavior, exclusion from environment-look and material snapshot restores, built-in ground material id semantics, and a safe split decision for any later runtime ground entries. It should recommend whether Manager should approve a proof implementation first, or go directly to a small runtime ground commit phase after proof acceptance.

### Phase 2.3 Closeout

Status:
- complete after focused readiness, environment-look, material, ViewToolbar ground-filtered, and production build verification

Proof Added:
- `scenePresentationEditHistoryReadiness.test.ts` now proves raw `useUiPrefsStore.setView({ ground: ... })` updates create no canonical entries and preserve redo before wrappers exist.
- Ground state is proven to persist under broader `viewSettingsPersistence`, while `environmentPersistence` leaves `ground` at the base view value.
- `GroundMaterialPresetId` is proven as a built-in ground id set (`matte_dark`, `matte_mid`, `glossy_studio`) that is not dependent on editable `view.materials.presets`.
- Accepted environment-look history undo/redo and Phase 2.2 material-only history undo/redo are proven to preserve ground mutations made after those entries committed.

Future Split Decision:
- Ground enabled/off and built-in ground material preset selection are likely safe discrete runtime candidates after proof acceptance.
- Ground Height should remain split or require a narrow `ParaSlider.onChangeEnd` commit boundary before runtime undo; the current live path is raw `onChange`.
- Runtime ground history remains deferred; this phase added proof only and no canonical ground wrappers or entries.

Verification:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed with 7 tests.
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed with 6 tests.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "ground"` passed with 2 tests and 37 skipped; the filter also matches one background-named environment test.
- `npm.cmd run build` passed with the known Vite browser-externalized module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.3` on 2026-04-22 05:31:30 after focused readiness, environment-look, material, ViewToolbar ground-filtered, and production build verification passed.
- `Edit-History-Gen2-HLG-1` remains open for runtime ground entries and other remaining durable presentation routing.
- Recommended next Manager action is prep-only `Phase 2.4 - Ground Setting Commit Entries`, with ground enabled/off and built-in material select as likely runtime scope and Ground Height split/deferred unless a narrow `ParaSlider.onChangeEnd` boundary is approved.

## [x] `Edit-History-Gen2-1 / Phase 2.4` - `Ground Setting Commit Entries`

### Phase 2.4 Summary

Purpose:
- add the first runtime ground undo slice after Phase 2.3 proved `view.ground` ownership and exclusion boundaries
- route safe completed Ground controls into canonical edit history without making raw `setView(...)` historyful
- restore only `view.ground`, not full `ViewSettings`, environment look, material snapshots, display/workspace preference state, viewer runtime state, or provider/cache state

Owns:
- ground enabled/off select
- built-in ground material preset select
- Ground Height only if the current `ParaSlider` can be wired narrowly through `onChangeEnd` while preserving raw live `onChange`
- no-op detection for unchanged enabled state, unchanged material preset, and unchanged normalized height
- redo preservation for no-op wrapper calls
- one canonical entry per completed ground semantic action

Does Not Own:
- runtime entries for grid, projection, wireframe, axis overlay, display options, workspace local view, material preset editing, material text/color/range controls, selected-light Color, full `ViewSettings`, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/provider, camera/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work
- rewriting `ParaSlider`, `ViewToolbar`, or `useUiPrefsStore` broadly

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - Ground enabled/off uses a `ParaSelect` labelled `Ground`
  - Ground Height uses `ParaSlider` with raw `onChange={(value) => setGround({ height: value })}`
  - Ground Material uses a `ParaSelect` labelled `Material`
  - `setGround(patch)` is local and calls `setView({ ground: { ...view.ground, ...patch } })`
- `src/app/store/uiPrefsStore.ts`
  - raw `setView(...)` and `setViewKey(...)` remain available and history-free
  - no dedicated `setGround(...)` API exists today
- `src/shared/viewSettingsTypes.ts`
  - `GroundSettings` contains `enabled`, `height`, and `materialPresetId`
  - `GroundMaterialPresetId` is the built-in id set `matte_dark`, `matte_mid`, and `glossy_studio`
- `src/app/store/editHistoryStore.ts`
  - canonical owner already provides no-op ignoring, redo invalidation only on real commits, read APIs, and synchronous undo/redo
- Phase 2.3 proof:
  - raw ground updates are history-free
  - ground persists under `viewSettingsPersistence`
  - environment-look and material-only snapshot restores preserve ground mutations

First-Pass Decisions:
- Add a store-adjacent ground history helper, likely `src/app/store/groundEditHistory.ts`, rather than making raw `useUiPrefsStore.setView(...)` canonical.
- Snapshot only `view.ground`.
- Use `normalizeViewSettings({ ...state.view, ground: snapshot })` during restore so other view fields remain current.
- Route ViewToolbar enabled/off and material select through wrappers if the UI change stays local.
- Include Ground Height only if it can keep live ticks raw and commit one entry from `ParaSlider.onChangeEnd`.
- If Ground Height needs a broader slider or toolbar refactor, split it to `Phase 2.5 - Ground Height Commit Boundary` and implement only enabled/material select in Phase 2.4.

Recommended Scope Shape:
- approve Phase 2.4 for runtime implementation over enabled/off and material select
- optionally include Ground Height in the same implementation only after inspecting the existing `ParaSlider` props and proving a tiny `onChangeEnd` wiring in ViewToolbar is enough
- keep raw ground state updates history-free for setup, tests, and any live-drag style paths

### Phase 2.4 Implementation Spec

Exact First Code Cut:
- add a ground-only snapshot/helper module, likely `src/app/store/groundEditHistory.ts`
  - `GroundHistorySnapshot = ViewSettings['ground']`
  - `captureGroundHistorySnapshot()`
  - `restoreGroundHistorySnapshot(snapshot)`
  - `areGroundHistorySnapshotsEqual(left, right)`
  - `commitGroundHistory(beforeSnapshot, options)`
  - `runGroundHistoryAction(action, options)`
- add action wrappers:
  - `setGroundEnabledWithHistory(enabled, options?)`
  - `setGroundMaterialPresetWithHistory(materialPresetId, options?)`
  - `setGroundHeightWithHistory(height, options?)` only if Ground Height stays in Phase 2.4
- keep raw `useUiPrefsStore.setView(...)` and `setViewKey(...)` history-free
- wire `ViewToolbar` Ground enabled/off and Material selects to wrappers
- for Ground Height:
  - keep `onChange` raw for live preview
  - commit only in `onChangeEnd` using the captured before value or wrapper call against final value
  - if a clean start/end capture is not already available or tiny to add, defer to Phase 2.5

Entry Label / Metadata:
- label: `Change ground setting`
- source:
  - `surface: 'viewer-ground'`
  - `sourceId: 'ground'`
  - `sourceLabel: 'Ground'`
- target ids:
  - `ground:enabled`
  - `ground:material`
  - `ground:height` only if included
- target labels:
  - `Ground visibility`
  - `Ground material`
  - `Ground height` only if included

Likely Files:
- `src/app/store/groundEditHistory.ts`
- `src/app/store/groundEditHistoryStore.test.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts` for regression only if proof needs adjustment
- `src/app/store/environmentLookEditHistoryStore.test.ts` if accepted environment-look boundaries are touched, which should not be necessary
- `src/app/store/materialEditHistoryStore.test.ts` if material boundaries are touched, which should not be necessary
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout

No-Widening Rule:
- do not implement or modify grid, projection, wireframe, axis overlay, display options, workspace local view preferences, material preset editing, material text/color/range controls, selected-light Color, full `ViewSettings` snapshots, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/provider, camera/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel files
- do not make raw `setView(...)` or `setViewKey(...)` automatically historyful
- do not couple ground material ids to editable material presets
- do not rewrite `ParaSlider` or `ViewToolbar`; split Height if narrow commit-end wiring is not enough

No-Op / Redo Preservation Requirements:
- unchanged enabled/off commit returns false or otherwise creates no entry
- unchanged material preset commit creates no entry
- unchanged normalized height commit creates no entry if height is included
- invalid or unsupported ground material ids should be rejected by typing/normalization and should not create canonical entries
- no-op wrapper calls must preserve existing redo entries
- real ground commits invalidate redo through the canonical owner exactly like prior accepted adapters

Implementation Risks:
- `setGround(...)` is currently local to `ViewToolbar`; the helper may need an internal `applyGroundPatch(...)` function rather than a public uiPrefs store method.
- Ground Height uses raw live `onChange`; committing from each tick would violate the phase.
- Ground material ids are built-in; tests should guard against accidental dependence on editable material presets.
- A ground snapshot restore must preserve environment look, material state, projection/grid/wireframe/display, captured look/compare state, and other view fields.

Checklist:
- [x] Add ground-only snapshot/compare/restore helper over `view.ground`.
- [x] Add history-aware wrappers for ground enabled/off and ground material select.
- [x] Include Ground Height only if it can use narrow `ParaSlider.onChangeEnd` commit semantics; otherwise split to Phase 2.5.
- [x] Keep raw `setView(...)` / current raw ground path history-free.
- [x] Route only owned ViewToolbar Ground controls through wrappers.
- [x] Prove real commits create `Change ground setting` entries with `viewer-ground` metadata.
- [x] Prove no-op ground wrapper calls create no entry and preserve redo.
- [x] Prove undo/redo restores only `view.ground` and preserves environment look, material state, projection/grid/wireframe/display, captured-look comparison, viewer runtime/cache/provider, Browser/project content, command transcript/recall, and unrelated state exposed by focused tests.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/store/groundEditHistoryStore.test.ts` if a new focused ground history suite is added
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "ground"` if ViewToolbar wiring changes
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` only if environment-look boundaries are touched
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` only if material boundaries are touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation must update `docs/CHANGELOG.md` for runtime/test behavior
- implementation must update this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation must update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if ground restore requires full `ViewSettings`
- stop if enabled/material select wrappers require broad `ViewToolbar` or uiPrefs store refactors
- split Ground Height to Phase 2.5 if a one-entry commit cannot be proven with tiny `onChangeEnd` wiring
- stop if ground material ids prove dependent on editable material presets
- stop if proof or implementation would touch Catalog/Pubwheel, viewer runtime/cache/provider, or unrelated workspace preference paths

Done Shape:
- Phase 2.4 is done when ground enabled/off and built-in material preset selection create one canonical ground entry per real commit, no-op calls preserve redo, undo/redo restore only `view.ground`, raw ground setters stay history-free, Ground Height is either safely included with a commit-end boundary or explicitly split, focused tests and build pass, and docs/tracking are updated.

### Phase 2.4 Closeout

Status:
- complete after focused ground history, ViewToolbar ground-filtered, readiness, environment-look, material, and production build verification

Runtime Behavior Added:
- Added a store-adjacent ground edit-history helper over ground-only snapshots of `view.ground`.
- Canonical `Change ground setting` entries now cover Ground enabled/off, built-in Ground material preset selection, and Ground Height.
- ViewToolbar routes Ground enabled/off, Material, and Height completion through history-aware wrappers while keeping live Ground Height `onChange` raw for preview.
- Undo/redo restores only `view.ground` and preserves environment look, material state, projection/grid/wireframe/display, and other unrelated view state exposed by focused tests.
- Raw `useUiPrefsStore.setView(...)` / `setViewKey(...)` paths remain history-free.

Ground Height Decision:
- Ground Height was included in Phase 2.4 because existing `ParaSlider.onChangeEnd` already supports a narrow commit-end boundary for drag, keyboard, and numeric commits.
- No `ParaSlider` architecture change was needed.

Verification:
- `npm.cmd test -- --run src/app/store/groundEditHistoryStore.test.ts` passed with 4 tests.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "ground"` passed with 2 tests and 37 skipped; the filter also matches one background-named environment test.
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed with 7 tests.
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed with 6 tests.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed with 5 tests.
- `npm.cmd run build` passed with the known Vite browser-externalized module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.4` on 2026-04-22 05:40:57 after focused ground history, ViewToolbar ground-filtered, readiness, environment-look, material, and production build verification passed.
- `Edit-History-Gen2-HLG-1` remains open for remaining durable presentation candidates and Manager status decisions.
- Recommended next Manager action is prep-only `Phase 2.5 - Material Text Color And Range Commit Boundary Proof`, with material preset name/base color/emissive color/native range controls and the earlier selected-light Color deferral reviewed for reliable completed-change boundaries before any runtime implementation.

## [x] `Edit-History-Gen2-1 / Phase 2.5` - `Material Text Color And Range Commit Boundary Proof`

### Phase 2.5 Summary

Purpose:
- route the remaining material editor input classes after accepted discrete material commits and ground commits
- prove which raw material text, native color, range, and numeric controls can safely become one-entry canonical material commits without per-tick history spam
- keep runtime implementation deferred until each input class has a reliable completion boundary and no-op/redo behavior proof

Owns:
- material preset Name text input routing and focus-session commit-boundary proof
- material base Color native input routing decision
- material Emissive native color input routing decision
- material numeric/range routing decisions for Metalness, Roughness, Emissive Intensity, and Opacity
- comparison against the earlier selected-light Color deferral so native color inputs are routed consistently
- no-op and redo-preservation requirements for any later text/range/color material wrapper

Does Not Own:
- runtime material text/color/range history entries in this prep pass
- already accepted discrete material commits from Phase 2.2: preset select, add, delete, transparent toggle, per-part mode, per-part assignment, and per-part clear
- selected-light Color implementation, except as a boundary comparison for native color inputs
- ground settings, environment look, selected-light name/delete/scalar/vector controls, material preset schema changes, custom color picker work, broad ViewToolbar/input architecture, full `ViewSettings` snapshotting, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - material preset Name is a native `input type="text"` with raw `updateMaterialPreset(selectedPreset.id, { name: value })` on every `onChange`
  - material base Color and Emissive are native `input type="color"` controls with raw `updateMaterialPreset(...)` on `onChange`
  - Metalness and Roughness are native `input type="range"` controls with raw `updateMaterialPreset(...)` on `onChange`
  - Emissive Intensity and Opacity are native `input type="number"` controls with raw `updateMaterialPreset(...)` on `onChange`
  - accepted discrete material controls already call `selectMaterialPresetWithHistory(...)`, `addMaterialPresetWithHistory(...)`, `deleteMaterialPresetWithHistory(...)`, `setMaterialPresetTransparentWithHistory(...)`, `setUsePerPartMaterialWithHistory(...)`, `assignPartMaterialWithHistory(...)`, and `clearPartMaterialWithHistory(...)`
- `src/app/store/uiPrefsStore.ts`
  - raw `updateMaterialPreset(id, patch)` sanitizes and writes material presets and remains history-free
  - material numeric values are normalized by existing preset sanitization; any history wrapper must compare normalized material snapshots, not raw input strings
- `src/app/store/materialEditHistory.ts`
  - accepted helper snapshots and restores only `view.materials`
  - `commitMaterialHistory(beforeSnapshot, options)` already performs normalized no-op detection and canonical entry creation
  - future text/range/color wrappers should reuse this helper instead of snapshotting full `ViewSettings`
- accepted patterns from earlier phases:
  - selected-light Name used a focus-session boundary: capture before on focus, allow raw typing, commit once on blur/Enter, and prevent blur-after-Enter duplicates
  - `ParaSlider`-based controls use raw live `onChange` plus `onChangeEnd` for semantic commits
  - selected-light Color remains deferred because native color inputs do not expose a cross-browser reliable completed-change boundary in the current UI

First-Pass Decisions:
- Phase 2.5 should remain proof/routing first, then split runtime implementation into smaller phases by input class.
- Material Name is likely safe as a near runtime phase if it copies the accepted selected-light Name focus-session pattern and explicitly handles Escape so a raw name mutation is not stranded outside history.
- Emissive Intensity and Opacity are likely safe as a typed numeric focus-session phase if Enter/blur commits once, raw `onChange` remains live, invalid/current normalization is respected, and native text undo while focused is preserved.
- Metalness and Roughness are not immediately safe as native range commits because the current controls have only raw `onChange`; approve runtime only after a tiny completion seam is proven, such as a local pointer/key/blur boundary or a narrow conversion to an existing commit-end control.
- Base Color and Emissive Color should defer to a shared native color-boundary proof with selected-light Color unless a reliable completed-change boundary is found without a custom color picker or broad input model.
- Runtime wrappers, when approved, should use material-only snapshots from `materialEditHistory`, not `EnvironmentLookSnapshot`, ground snapshots, or full `ViewSettings`.

Commit-Boundary Decision Table:

| Control | Current seam | Boundary risk | Recommended route | Near runtime readiness |
| --- | --- | --- | --- | --- |
| Material Name | native text `onChange` -> raw `updateMaterialPreset(... { name })` | per-keystroke raw mutation; blur-after-Enter duplicate risk; Escape must not leave no-history persisted mutation | split to `Phase 2.5a - Material Name Focus Session Commit Entries`; capture material snapshot on focus, raw updates while focused, commit once on blur/Enter, restore-or-commit on Escape | likely safe after focused proof |
| Base Color | native color `onChange` -> raw `updateMaterialPreset(... { color })` | native picker may emit during drag/intermediate selection; no current completed-change seam | defer to shared native color-boundary proof with selected-light Color and Emissive Color | not ready |
| Emissive Color | native color `onChange` -> raw `updateMaterialPreset(... { emissive })` | same native color completion risk as Base Color | defer to shared native color-boundary proof | not ready |
| Metalness | native range `onChange` -> raw `updateMaterialPreset(... { metalness })` | drag/key ticks currently indistinguishable from completed commits | split to numeric/range boundary proof; approve runtime only with a tiny completion seam or narrow `ParaSlider` migration | needs proof |
| Roughness | native range `onChange` -> raw `updateMaterialPreset(... { roughness })` | same native range completion risk as Metalness | split to numeric/range boundary proof | needs proof |
| Emissive Intensity | native number `onChange` -> raw `updateMaterialPreset(... { emissiveIntensity })` | raw typed updates while focused; Enter/blur duplicate risk; normalized numeric equality must drive no-op behavior | split to typed numeric focus-session commit entries, possibly with Opacity | likely safe after focused proof |
| Opacity | native number `onChange` -> raw `updateMaterialPreset(... { opacity })` | same typed numeric focus-session risk as Emissive Intensity | split to typed numeric focus-session commit entries | likely safe after focused proof |
| Selected-light Color | native color raw update path from Phase 1.1c | same native color completion risk; outside material ownership | use only as comparison input for shared native color-boundary proof | not part of material runtime phase |

Recommended Split:
- `Phase 2.5a - Material Name Focus Session Commit Entries`
  - runtime-ready first if Manager wants an implementation slice
  - owns Name only
  - prove native text undo, Enter/blur one-entry behavior, Escape behavior, no-op/redo preservation, and material-only restore scope
- `Phase 2.5b - Material Typed Numeric Commit Entries`
  - owns Emissive Intensity and Opacity first; include Metalness/Roughness only if a tiny native range completion seam is proven
  - preserve raw live preview and commit one entry on blur/Enter or completed range interaction
- `Phase 2.5c - Native Presentation Color Boundary Proof`
  - proof-only unless a reliable boundary is found
  - covers material Base Color, material Emissive Color, and selected-light Color consistently

### Phase 2.5 Implementation Spec

Exact First Code Cut If Approved:
- keep the first approved implementation as a narrow proof or a single-control runtime slice rather than all remaining inputs at once
- for a material Name runtime slice:
  - add a tiny focus-session draft in `ViewToolbar` or a small helper adjacent to `materialEditHistory`
  - capture `captureMaterialHistorySnapshot()` on focus
  - keep raw `useUiPrefsStore.getState().updateMaterialPreset(...)` / existing `updateMaterialPreset(...)` path for live typing
  - call `commitMaterialHistory(beforeSnapshot, { label: 'Change material', targetId: 'material-preset:<id>:name', targetLabel: 'Material preset name' })` on blur or Enter
  - clear the draft before a blur triggered by Enter can double-commit
  - handle Escape by restoring the captured snapshot or by removing the Escape special-case; do not allow an untracked raw name mutation to persist
- for a typed numeric runtime slice:
  - use the same material snapshot helper and target metadata per property
  - commit after blur/Enter from normalized store values, not raw string drafts
  - keep raw live typing through `updateMaterialPreset(...)`
  - do not intercept shared keyboard undo; editable inputs must retain native undo while focused
- for a native range runtime slice:
  - prove a tiny completed-change seam before committing entries
  - acceptable options are a local pointer/key/blur completion boundary with focused tests, or a narrow conversion to an existing `ParaSlider` commit-end contract
  - split/stop if implementation requires a broad material editor rewrite
- for native color:
  - do not implement until proof finds a reliable completed-change boundary
  - stop if the only path is per-event canonical commits or a custom color picker outside the approved scope

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/materialEditHistory.ts`
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `docs/CHANGELOG.md` only during later implementation/proof changes
- this phase doc and `docs/Doc-Log.md`

Entry Label / Metadata For Later Runtime Slices:
- label: `Change material`
- source:
  - `surface: 'viewer-material'`
  - `sourceId: 'materials'`
  - `sourceLabel: 'Materials'`
- target ids:
  - `material-preset:<id>:name`
  - `material-preset:<id>:color`
  - `material-preset:<id>:emissive`
  - `material-preset:<id>:metalness`
  - `material-preset:<id>:roughness`
  - `material-preset:<id>:emissiveIntensity`
  - `material-preset:<id>:opacity`
- target labels should be deterministic, readable labels such as `Material preset name`, `Material base color`, `Material emissive color`, `Material metalness`, `Material roughness`, `Material emissive intensity`, and `Material opacity`

No-Widening Rule:
- do not implement runtime changes during this prep
- do not make raw `updateMaterialPreset(...)` automatically historyful
- do not snapshot or restore full `ViewSettings`
- do not change material preset schema, create a custom color picker, rewrite material editor architecture, or replace native inputs broadly
- do not implement selected-light Color, ground/display/projection/workspace preference history, environment look changes, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work

No-Op / Redo Preservation Requirements:
- unchanged normalized material snapshots must create no entry
- wrapper calls that sanitize to the current stored value must preserve redo
- invalid numeric drafts should preserve current raw behavior and should not create a canonical entry unless the normalized stored material actually changes
- missing selected presets, missing material ids, or unsupported controls must create no entry
- real commits invalidate redo only through canonical `editHistoryStore.commitEntry(...)`
- undo/redo must restore only `view.materials` and preserve environment look, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, and unrelated state exposed by focused tests

Implementation Risks:
- native color inputs may emit intermediate values while the user drags inside the browser color picker; treating every event as a commit would spam history
- native range controls currently lack `onChangeEnd`, unlike accepted `ParaSlider` paths
- text and number focus-session drafts can accidentally double-commit on Enter followed by blur unless the draft is cleared before blur
- Escape can strand raw `updateMaterialPreset(...)` changes outside canonical history if it only clears a draft without restoring or committing
- numeric values must be compared after `sanitizePreset(...)` normalization

Checklist:
- [x] Research live `ViewToolbar` material text/color/range/number seams.
- [x] Confirm raw `updateMaterialPreset(...)` remains the current live update path for deferred inputs.
- [x] Confirm accepted `materialEditHistory` helper snapshots only `view.materials` and can support later wrappers.
- [x] Route each remaining control to a concrete implementation, proof, or deferral lane.
- [x] Keep selected-light Color as comparison-only and outside material runtime scope.
- [ ] Implement any runtime wrapper. This prep intentionally does not.
- [ ] Run focused tests/build. Not required for docs-only prep.

Focused Verification For Later Implementation:
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- if a native color proof is approved, add or run the smallest focused ViewToolbar/selected-light color test filter available

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- docs-only prep updates this phase doc and `docs/Doc-Log.md`
- later runtime/test implementation must update `docs/CHANGELOG.md`
- later implementation must update this phase doc with checklist truth, verification notes, closeout, and Doc History
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if text or numeric focus-session commits would break native text undo while focused
- stop if Escape, blur, or Enter cannot be made one-entry and cannot avoid stranded raw mutations
- stop if native color cannot provide a reliable completed-change boundary without a custom picker or broad input model
- stop if native range history requires a broad ViewToolbar/input architecture rewrite instead of a tiny completion seam
- stop if restore requires full `ViewSettings` or touches environment/ground/display/workspace state
- stop if implementation would touch Catalog/Pubwheel or unrelated viewer/runtime/cache/provider paths

Done Shape:
- Phase 2.5 prep is done when the remaining material Name, base Color, Emissive Color, Metalness, Roughness, Emissive Intensity, and Opacity controls are mapped to safe implementation/proof/defer lanes, likely files and tests are named, no-op/redo/restore requirements are explicit, and Manager can choose the next small implementation slice without widening Gen2 presentation undo.

### Phase 2.5 Closeout

Status:
- complete as a docs-only routing/proof phase after Manager live seam review

Decision:
- Material Name is the next smallest likely runtime implementation slice and should move to prep-only `Phase 2.5a - Material Name Focus Session Commit Entries`.
- Emissive Intensity and Opacity should remain split to a later typed numeric focus-session phase.
- Metalness and Roughness should remain split until a native range completion boundary or narrow `ParaSlider` migration is proven.
- Base Color, Emissive Color, and selected-light Color should remain split to a shared native color-boundary proof.

Verification:
- Docs-only prep; no tests or build were required.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5` on 2026-04-22 05:44:59 after reviewing the live `ViewToolbar` material editor, native color input, numeric/range, `useUiPrefsStore.updateMaterialPreset(...)`, `materialEditHistory`, and selected-light Color seams.
- `Edit-History-Gen2-HLG-1` remains open for runtime material Name entries, typed numeric/range proof, native color proof, and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.5a - Material Name Focus Session Commit Entries`.

## [x] `Edit-History-Gen2-1 / Phase 2.5a` - `Material Name Focus Session Commit Entries`

### Phase 2.5a Summary

Purpose:
- add the smallest runtime material text commit slice after Phase 2.5 routed the remaining material inputs
- make Material preset Name edits undoable as one canonical material entry per completed focus session
- preserve raw live typing, native text-input undo while focused, and material-only snapshot restore boundaries

Owns:
- Material preset Name input only in `ViewToolbar`
- focus-session capture for the selected material preset name editor
- raw live typing via the existing `updateMaterialPreset(...)` path
- one canonical `Change material` entry on blur or Enter only when the normalized material snapshot changed
- duplicate prevention for Enter followed by blur
- Escape behavior that does not leave a raw name mutation persisted outside canonical history
- no-entry behavior for unchanged normalized names, missing selected preset, missing material id, and unsupported/mismatched focus sessions

Does Not Own:
- material base color, material emissive color, material Metalness, material Roughness, material Emissive Intensity, material Opacity, selected-light Color, material schema changes, custom color picker work, broad input architecture, full `ViewSettings`, ground/environment/display/workspace settings, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work
- making raw `useUiPrefsStore.updateMaterialPreset(...)` automatically historyful

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - reads `updateMaterialPreset` from `useUiPrefsStore`
  - renders Material preset Name as a native `input type="text"`
  - current `onChange` calls `updateMaterialPreset(selectedPreset.id, { name: event.target.value })`
  - accepted discrete material callbacks already route through `materialEditHistory` wrappers in the same component
- `src/app/store/materialEditHistory.ts`
  - `captureMaterialHistorySnapshot()` captures only `view.materials`
  - `restoreMaterialHistorySnapshot(...)` restores only `view.materials`
  - `commitMaterialHistory(beforeSnapshot, options)` already handles normalized no-op detection and canonical entry creation
- `src/app/store/uiPrefsStore.ts`
  - raw `updateMaterialPreset(...)` sanitizes the preset and remains available for live typing/setup/tests
- prior accepted text pattern:
  - selected-light Name uses focus-session semantics and proved the need to avoid Escape clearing a draft while leaving raw mutated text behind

First-Pass Decisions:
- implement the first code cut in `ViewToolbar` unless an even smaller local helper next to `materialEditHistory` keeps the component cleaner
- keep the input controlled by the live store value; do not introduce a broad local text model
- capture a material snapshot and material id on focus
- let every `onChange` continue using the raw `updateMaterialPreset(...)` path so native text undo remains browser-local while focused
- commit on blur or Enter through `commitMaterialHistory(...)`
- clear the active draft before Enter-triggered blur can attempt a second commit
- handle Escape by restoring the captured material snapshot and clearing the draft, or use another explicit rule with focused proof that no raw mutation persists without history
- do not route other material inputs through this draft

### Phase 2.5a Implementation Spec

Exact First Code Cut:
- in `src/app/components/ViewToolbar.tsx`, add a tiny Material Name focus-session draft:
  - captured `MaterialHistorySnapshot`
  - captured material preset id
  - a committed/cancelled guard to prevent duplicate blur commits
- on Material Name focus:
  - if a selected preset exists, capture `captureMaterialHistorySnapshot()` and the selected preset id
  - if no selected preset exists, do not create a draft
- on Material Name change:
  - keep current raw behavior: `updateMaterialPreset(selectedPreset.id, { name: event.target.value })`
  - do not call canonical history on each keystroke
- on blur:
  - if there is an active draft for the same material id, call `commitMaterialHistory(beforeSnapshot, metadata)`
  - clear the draft after commit/no-op
  - if no active draft exists, do nothing
- on Enter:
  - commit the active draft using the same blur metadata
  - clear the draft before triggering blur or before blur can run
  - optionally blur the input after committing if that matches existing selected-light Name behavior
- on Escape:
  - restore the captured material snapshot and clear the draft, or otherwise prove no raw typed mutation persists without canonical history
  - do not create a canonical entry for Escape cancel
  - do not change shared keyboard/native text undo behavior

Entry Metadata:
- label: `Change material`
- source:
  - `surface: 'viewer-material'`
  - `sourceId: 'materials'`
  - `sourceLabel: 'Materials'`
- target:
  - `targetId: 'material-preset:<id>:name'`
  - `targetLabel: 'Material preset name'`

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/materialEditHistory.ts` only if a tiny helper reduces duplication; prefer no helper change if component-local code is smaller
- `src/app/store/materialEditHistoryStore.test.ts` for material restore/no-op regression if helper behavior changes
- `src/app/store/uiPrefsStore.test.ts` only if raw name sanitization behavior needs regression coverage
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout

No-Widening Rule:
- do not implement material base color, emissive color, metalness, roughness, emissiveIntensity, opacity, selected-light Color, custom color picker work, native range proof, typed numeric material commits, material schema changes, broad input architecture, full `ViewSettings`, ground/environment/display/workspace settings, history UI, persistence architecture, collaboration, checkpoints, branching, Catalog provider/cache/preview, viewer runtime/cache/navigation, Browser/project content, command transcript/recall, or unrelated Catalog/Pubwheel work
- do not make raw `updateMaterialPreset(...)` historyful
- do not replace the Name input with a broad custom field architecture

No-Op / Redo Preservation Requirements:
- unchanged normalized Material Name creates no canonical entry
- committing after raw typing that sanitizes back to the starting material snapshot creates no entry and preserves redo
- missing selected preset, missing material id, stale draft id, or unsupported target creates no entry
- Escape cancel creates no canonical entry and preserves redo while restoring the captured material name
- real Material Name commits invalidate redo only through canonical `editHistoryStore.commitEntry(...)`
- undo/redo restores only `view.materials` and preserves environment look, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, and unrelated state exposed by focused tests

Implementation Risks:
- Enter can fire a commit and then blur can fire another unless the draft is cleared before blur sees it
- Escape can strand a raw `updateMaterialPreset(...)` mutation outside history if it only clears the draft
- a selected material id can change mid-focus if the preset list is altered; commit should validate the draft id against current state and no-op/clear if it is missing
- native text undo must remain local to the focused input; do not intercept Ctrl/Meta+Z or shared keyboard routing

Checklist:
- [x] Add Material Name focus-session draft capture.
- [x] Preserve raw live `updateMaterialPreset(...)` on input change.
- [x] Commit one `Change material` entry on blur when the normalized material snapshot changed.
- [x] Commit one `Change material` entry on Enter and prevent blur-after-Enter duplicate commits.
- [x] Handle Escape so no raw name mutation remains persisted without canonical history.
- [x] Prove unchanged, missing preset/id, stale draft, and Escape paths create no entry and preserve redo.
- [x] Prove undo/redo restores Material Name through material-only snapshots without restoring unrelated presentation/runtime state.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material name"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` only if raw preset sanitization or store behavior is touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation must update `docs/CHANGELOG.md` for runtime/test behavior
- implementation must update this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation must update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if the focus-session implementation cannot preserve native text-input undo while focused
- stop if Escape cannot either restore or otherwise prevent a no-history persisted raw name mutation
- stop if the implementation requires broad ViewToolbar/input architecture changes
- stop if material-only snapshot restore proves insufficient and full `ViewSettings` would be required
- stop if the work would touch color/range/numeric material inputs, selected-light Color, Catalog/Pubwheel, viewer runtime/cache/provider, Browser/project, or unrelated workspace preference paths

Done Shape:
- Phase 2.5a is done when Material preset Name commits create exactly one canonical material entry on blur or Enter, unchanged/missing/Escape paths create no entry and preserve redo, raw live typing remains history-free, native text undo is preserved while focused, undo/redo restores only material state, focused tests and build pass, and docs/tracking are updated.

### Phase 2.5a Closeout

Status:
- complete after focused ViewToolbar material-name/material verification, material history regression verification, and production build verification

Runtime Behavior Added:
- Material preset Name edits now use a focused-session draft in `ViewToolbar`.
- Raw `updateMaterialPreset(...)` still handles live typing and no canonical entry is created per keystroke.
- Blur commits one canonical `Change material` entry when the material-only snapshot changed.
- Enter commits the same canonical entry and clears the draft before blur can duplicate it.
- Escape restores the captured material-only snapshot, creates no canonical entry, and preserves redo.
- Other material inputs remain outside this phase and keep their existing raw/deferred paths.

Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material name"` passed with 2 tests and 39 skipped.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"` passed with 3 tests and 38 skipped.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` was not run because raw store behavior was not changed.
- `npm.cmd run build` passed with the known Vite browser-externalized module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5a` on 2026-04-22 05:54:55 after rerunning focused material-name, material, material-history, and production build verification.
- `Edit-History-Gen2-HLG-1` remains open for typed numeric/range material inputs, native color proof, selected-light Color, and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.5b - Material Typed Numeric Commit Entries`, scoped first to Emissive Intensity and Opacity typed number focus sessions; Metalness and Roughness should join only if a tiny native range completion boundary is proven, otherwise they should split to a later range-proof phase.

## [x] `Edit-History-Gen2-1 / Phase 2.5b` - `Material Typed Numeric Commit Entries`

### Phase 2.5b Summary

Purpose:
- add the next small material input runtime slice after accepted Material Name focus-session commits
- make typed numeric Material Emissive Intensity and Opacity commits undoable as one canonical material entry per completed focus session
- keep native range Material Metalness and Roughness routed to a separate proof unless a tiny completed-change boundary is proven before implementation

Owns:
- Material Emissive Intensity native `input type="number"` focus-session commits
- Material Opacity native `input type="number"` focus-session commits
- material-only snapshot capture/compare/restore using `captureMaterialHistorySnapshot()` and `commitMaterialHistory(...)`
- raw live finite numeric updates through `updateMaterialPreset(...)`
- blur and Enter commit boundaries with duplicate blur-after-Enter prevention
- Escape cancel/restore behavior so no raw numeric mutation remains outside canonical history
- invalid numeric handling that creates no fake entry, avoids stranded raw mutations, and preserves redo
- no-entry behavior for unchanged normalized values, missing selected preset, missing material id, stale draft id, and unsupported controls

Does Not Own:
- Material Base Color, Material Emissive Color, selected-light Color, custom color picker work, Material Name, material schema changes, broad input architecture, full `ViewSettings`, ground/environment/display/workspace settings, history UI, persistence architecture, collaboration, checkpoints, branching, Browser/project content, command transcript/recall, Catalog/Pubwheel files, viewer runtime/cache/provider/navigation, or unrelated workspace preference paths
- runtime Metalness/Roughness history unless the implementation proves a tiny native range completion seam without broad input architecture changes
- making raw `useUiPrefsStore.updateMaterialPreset(...)` automatically historyful

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - Emissive Intensity is a native `input type="number"` with `min={0}`, `max={2}`, `step={0.05}`, `value={selectedPreset.emissiveIntensity}`, and raw `updateMaterialPreset(selectedPreset.id, { emissiveIntensity: Number(event.target.value) })` on `onChange`
  - Opacity is a native `input type="number"` with `min={0}`, `max={1}`, `step={0.05}`, `value={selectedPreset.opacity}`, and raw `updateMaterialPreset(selectedPreset.id, { opacity: Number(event.target.value) })` on `onChange`
  - Metalness and Roughness are native `input type="range"` controls with raw `updateMaterialPreset(...)` on every `onChange` and no current completion callback
- `src/app/store/uiPrefsStore.ts`
  - `updateMaterialPreset(id, patch)` remains the raw setter
  - `sanitizePreset(...)` clamps `emissiveIntensity` to `0..2` and `opacity` to `0..1`
  - normalized/sanitized store values, not raw input strings, must decide no-op vs real canonical commit
- `src/app/store/materialEditHistory.ts`
  - accepted material helper snapshots and restores only `view.materials`
  - `commitMaterialHistory(beforeSnapshot, options)` already handles material-only no-op comparison and canonical metadata defaults
- accepted precedent from Phase 2.5a:
  - Material Name uses a focus-session draft with raw live updates, blur/Enter commit, duplicate guard, and Escape snapshot restore

First-Pass Decisions:
- Phase 2.5b runtime implementation should own Emissive Intensity and Opacity only.
- Use a shared, tiny material numeric focus-session draft in `ViewToolbar`, keyed by material preset id and property name.
- Keep finite numeric changes live through `updateMaterialPreset(...)` during focus.
- Commit from the material-only before snapshot on blur or Enter using post-sanitized store state.
- Clear the draft before Enter-triggered blur can double-commit.
- Escape should restore the captured material snapshot and create no canonical entry.
- Invalid/non-finite numeric input should not be turned into a fake canonical history entry. If implementation can prevent a non-finite value from reaching `updateMaterialPreset(...)` with a tiny local guard, do so; otherwise stop and repair the raw numeric path before committing history.
- Metalness and Roughness should split to `Phase 2.5d - Material Native Range Commit Boundary Proof` unless a narrow, well-tested range completion seam appears during implementation.

Range Decision Table:

| Control | Current seam | Completion boundary today | Phase 2.5b decision | Later route |
| --- | --- | --- | --- | --- |
| Emissive Intensity | native number `onChange` -> raw `updateMaterialPreset(... { emissiveIntensity })` | blur/Enter can be added as a focus-session boundary | include in runtime scope | one canonical `Change material` entry on blur/Enter |
| Opacity | native number `onChange` -> raw `updateMaterialPreset(... { opacity })` | blur/Enter can be added as a focus-session boundary | include in runtime scope | one canonical `Change material` entry on blur/Enter |
| Metalness | native range `onChange` -> raw `updateMaterialPreset(... { metalness })` | none; drag/key ticks are currently raw changes | defer from runtime unless tiny boundary is proven | `Phase 2.5d - Material Native Range Commit Boundary Proof` or narrow `ParaSlider` migration |
| Roughness | native range `onChange` -> raw `updateMaterialPreset(... { roughness })` | none; drag/key ticks are currently raw changes | defer from runtime unless tiny boundary is proven | `Phase 2.5d - Material Native Range Commit Boundary Proof` or narrow `ParaSlider` migration |

### Phase 2.5b Implementation Spec

Exact First Code Cut:
- in `src/app/components/ViewToolbar.tsx`, add a tiny typed material numeric focus-session draft:
  - captured `MaterialHistorySnapshot`
  - captured material preset id
  - captured property id: `emissiveIntensity` or `opacity`
  - duplicate/cancel guard matching the Phase 2.5a Material Name pattern
- on Emissive Intensity / Opacity focus:
  - if a selected preset exists, capture `captureMaterialHistorySnapshot()`, the selected preset id, and the property id
  - if no selected preset exists, do not create a draft
- on numeric change:
  - parse the native value into a finite number before calling the raw setter
  - for finite values, keep current live behavior by calling `updateMaterialPreset(selectedPreset.id, { property: value })`
  - for non-finite/invalid values, do not call canonical history; either leave the draft active until blur/Enter resolves to a finite normalized value, or restore/clear on blur/Enter if no valid store change exists
  - do not create a canonical entry per typed tick
- on blur:
  - if there is an active draft for the same material id and property, call `commitMaterialHistory(beforeSnapshot, metadata)`
  - commit must compare post-sanitized material snapshots
  - clear the draft after commit/no-op
  - if no active matching draft exists, do nothing
- on Enter:
  - commit the active draft using the same blur metadata
  - clear the draft before triggering blur or before blur can run
  - blur the input only if it preserves existing native input behavior and matches the Material Name pattern
- on Escape:
  - restore the captured material snapshot and clear the draft
  - do not create a canonical entry
  - preserve redo if there was no real committed entry
  - do not intercept global undo/redo shortcuts or alter shared keyboard dispatch

Invalid Numeric Behavior:
- invalid/non-finite input must not create a canonical entry
- invalid/non-finite input must not invalidate redo
- invalid/non-finite input must not leave a raw material mutation stranded outside history
- if the browser/native number input emits an empty string that the current raw path normalizes to a finite clamped value, treat the resulting sanitized store snapshot as the source of truth; commit only if that snapshot changed from the captured snapshot
- if tests prove `NaN` or another non-finite value can reach `sanitizePreset(...)`, stop and add a tiny finite guard in `ViewToolbar` or split a raw numeric sanitizer repair before adding canonical history entries

Entry Metadata:
- label: `Change material`
- source:
  - `surface: 'viewer-material'`
  - `sourceId: 'materials'`
  - `sourceLabel: 'Materials'`
- targets:
  - Emissive Intensity:
    - `targetId: 'material-preset:<id>:emissiveIntensity'`
    - `targetLabel: 'Material emissive intensity'`
  - Opacity:
    - `targetId: 'material-preset:<id>:opacity'`
    - `targetLabel: 'Material opacity'`
- do not add Metalness/Roughness target metadata in Phase 2.5b unless the range boundary is explicitly approved during implementation

Likely Files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/materialEditHistory.ts` only if a tiny helper avoids duplicated focus-session boilerplate; prefer component-local code if smaller
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/store/uiPrefsStore.test.ts` only if raw numeric sanitization or finite guard behavior changes
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout

No-Widening Rule:
- do not implement Material Base Color, Material Emissive Color, selected-light Color, custom color picker work, Material Name changes, material schema changes, broad input architecture, full `ViewSettings`, ground/environment/display/workspace settings, history UI, persistence architecture, collaboration, checkpoints, branching, Browser/project content, command transcript/recall, Catalog/Pubwheel files, viewer runtime/cache/provider/navigation, or unrelated workspace preference paths
- do not make raw `updateMaterialPreset(...)` historyful
- do not replace the material editor with a new shared field framework
- do not route Metalness/Roughness unless a tiny range completion boundary is found and tested without widening; otherwise split them

No-Op / Redo Preservation Requirements:
- unchanged normalized Emissive Intensity or Opacity creates no canonical entry
- values clamped/sanitized back to the starting snapshot create no canonical entry and preserve redo
- missing selected preset, missing material id, stale draft id, stale property id, unsupported property, invalid/non-finite value with no normalized store change, or blur without active draft creates no entry
- Escape cancel restores the captured material snapshot, creates no entry, and preserves redo
- real typed numeric commits invalidate redo only through canonical `editHistoryStore.commitEntry(...)`
- undo/redo restores only `view.materials` and preserves environment look, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, and unrelated state exposed by focused tests

Implementation Risks:
- native number inputs can emit empty or invalid intermediate text; history must follow normalized store changes, not raw strings
- Enter followed by blur can double-commit unless the draft is cleared before blur sees it
- Escape can strand a raw numeric mutation outside history if it clears the draft without restoring
- Metalness/Roughness ranges would spam history if each `onChange` becomes a commit
- adding a finite guard could accidentally change current raw numeric behavior; test before and after carefully, and split if this becomes broader than ViewToolbar-local input handling

Checklist:
- [x] Add typed material numeric focus-session draft for Emissive Intensity and Opacity.
- [x] Preserve raw finite live `updateMaterialPreset(...)` on number input change.
- [x] Commit one `Change material` entry on blur when the normalized material snapshot changed.
- [x] Commit one `Change material` entry on Enter and prevent blur-after-Enter duplicate commits.
- [x] Handle Escape so no raw numeric mutation remains persisted without canonical history.
- [x] Prove invalid/non-finite input creates no fake entry, preserves redo, and does not strand raw mutation.
- [x] Prove unchanged/clamped-to-same values, missing preset/id, stale draft, and unsupported property paths create no entry and preserve redo.
- [x] Prove undo/redo restores typed numeric material values through material-only snapshots without restoring unrelated presentation/runtime state.
- [x] Keep Metalness/Roughness out of runtime unless a tiny range completion boundary is explicitly proven; otherwise document the split.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after implementation verification.

Focused Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material numeric"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` only if raw numeric sanitization or finite guard behavior changes

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation must update `docs/CHANGELOG.md` for runtime/test behavior
- implementation must update this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation must update `docs/Doc-Log.md` for doc maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if native numeric focus sessions cannot preserve native local undo while focused
- stop if invalid/non-finite handling requires a broad input model or shared field architecture
- stop if Escape cannot restore/cancel without leaving a no-history raw mutation
- stop if implementation needs full `ViewSettings` snapshots or touches environment/ground/display/workspace state
- stop if routing Metalness/Roughness would require per-tick commits, broad input architecture, or unproven native range completion behavior; split to a range proof phase
- stop if work would touch native color inputs, selected-light Color, Catalog/Pubwheel, viewer runtime/cache/provider, Browser/project, command transcript/recall, or unrelated workspace preference paths

Done Shape:
- Phase 2.5b is done when Emissive Intensity and Opacity commits create exactly one canonical material entry on blur or Enter, unchanged/clamped/missing/invalid/Escape paths create no entry and preserve redo, raw finite live typing remains history-free, native input undo is preserved while focused, undo/redo restores only material state, Metalness/Roughness are either explicitly excluded or safely proven through a tiny boundary, focused tests and build pass, and docs/tracking are updated.

Closeout:
- 2026-04-22 06:01:23: Phase 2.5b implemented the approved Emissive Intensity and Opacity slice in `ViewToolbar` with component-local focus-session drafts, material-only snapshots, `commitMaterialHistory(...)`, Escape restore/cancel behavior, duplicate blur-after-Enter protection, and a tiny finite/blank numeric guard at the input boundary so invalid input does not create fake entries or leave raw mutations. Metalness and Roughness remain deferred to a native range commit-boundary proof phase.

Verification Notes:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material numeric"` passed.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"` passed.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5b` on 2026-04-22 06:04:23 after rerunning focused material numeric, material, material-history, and production build verification.
- `Edit-History-Gen2-HLG-1` remains open for native color proof, material Metalness/Roughness native range proof, selected-light Color, and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.5c - Native Presentation Color Boundary Proof`, covering material Base Color, material Emissive Color, and selected-light Color as a proof-first slice unless a reliable completed-change seam is found.

## [x] `Edit-History-Gen2-1 / Phase 2.5c` - `Native Presentation Color Boundary Proof`

### Phase 2.5c Summary

Purpose:
- prove whether current native presentation color inputs expose a reliable completed-change boundary before adding runtime undo entries
- keep native picker intermediate events from spamming canonical history
- route Material Base Color / Material Emissive Color and selected-light Color separately because they belong to different canonical owners

Owns:
- Material Base Color native `input type="color"` proof/routing in `ViewToolbar`
- Material Emissive Color native `input type="color"` proof/routing in `ViewToolbar`
- selected-light Color native `input type="color"` proof/routing in `ViewToolbar`
- no-entry/redo preservation proof for raw color live updates before runtime wrappers exist
- exact metadata, owner, and stop/split rules for any later runtime color commit slice

Does Not Own:
- Material Metalness/Roughness native range controls
- Material Name, Emissive Intensity, or Opacity controls already accepted in prior phases
- selected-light non-color controls already accepted in earlier selected-light phases
- custom color picker work
- broad input architecture or shared color field framework
- full `ViewSettings` snapshots
- ground/environment/display/workspace settings outside the named color fields
- history UI, persistence architecture, collaboration, checkpoints, branching
- Browser/project content, command transcript/recall, Catalog/Pubwheel, viewer runtime/cache/provider/navigation, or unrelated workspace preference paths

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - selected-light Color: native `input type="color"` with `value={selectedLight.color}` and raw `onChange={(event) => updateLight(selectedLight.id, { color: event.target.value })}`
  - Material Base Color: native `input type="color"` with `value={selectedPreset.color}` and raw `onChange={(event) => updateMaterialPreset(selectedPreset.id, { color: event.target.value })}`
  - Material Emissive Color: native `input type="color"` with `value={selectedPreset.emissive}` and raw `onChange={(event) => updateMaterialPreset(selectedPreset.id, { emissive: event.target.value })}`
- `src/app/store/environmentLookEditHistory.ts`
  - accepted selected-light owner and restore payload for environment-look history; selected-light Color belongs here if a future runtime boundary is proven
- `src/app/store/materialEditHistory.ts`
  - accepted material-only snapshot/restore/commit owner; material Base/Emissive Color belongs here if a future runtime boundary is proven
- `src/app/store/uiPrefsStore.ts`
  - raw `updateLight(...)` and `updateMaterialPreset(...)` setters remain history-free
- `src/app/components/ViewToolbar.test.tsx`
  - existing selected-light/material tests provide the likely focused UI proof surface
- `src/app/store/environmentLookEditHistoryStore.test.ts` and `src/app/store/materialEditHistoryStore.test.ts`
  - existing owner-level regression surfaces for no-op/redo/restore boundaries

First-Pass Decisions:
- Phase 2.5c should be proof-first by default.
- Do not implement runtime color entries unless tests show a reliable completed-change event can be used consistently for native color inputs without replacing the native picker.
- Preserve raw `onChange` live updates for picker preview while proof is gathered.
- Material Base/Emissive Color must use the material owner and material-only snapshots.
- Selected-light Color must use the environment-look owner and `EnvironmentLookSnapshot`.
- Do not merge owners or invent a shared "presentation color" history owner.

Color Decision Table:

| Control | Owner if runtime later approved | Current seam | Reliable completion boundary today | Phase 2.5c decision | Later runtime metadata |
| --- | --- | --- | --- | --- | --- |
| Material Base Color | material / `viewer-material` | native color `onChange` -> raw `updateMaterialPreset(... { color })` | unproven; native picker may emit multiple `input/change` events depending on browser | proof-first, no runtime by default | `targetId: 'material-preset:<id>:color'`, `targetLabel: 'Material base color'` |
| Material Emissive Color | material / `viewer-material` | native color `onChange` -> raw `updateMaterialPreset(... { emissive })` | unproven; native picker may emit multiple `input/change` events depending on browser | proof-first, no runtime by default | `targetId: 'material-preset:<id>:emissive'`, `targetLabel: 'Material emissive color'` |
| Selected-light Color | environment look / `viewer-environment` | native color `onChange` -> raw `updateLight(... { color })` | unproven; native picker may emit multiple `input/change` events depending on browser | proof-first, no runtime by default | `targetId: 'environment-light:<id>:color'`, `targetLabel: 'Environment light color'` |

Recommendation:
- approve Phase 2.5c as a proof/test implementation first.
- if proof finds no reliable native completion boundary, close Phase 2.5c as a routing/exclusion proof and split runtime color entries to a later custom picker or explicit color-field architecture phase.
- if proof finds one narrow boundary such as focus/blur that works in jsdom and browser behavior without per-drag spam, Manager may approve a follow-up runtime slice; do not combine proof and runtime unless explicitly assigned.

### Phase 2.5c Implementation Spec

Exact First Code Cut:
- add focused proof tests only unless the proof exposes a tiny missing test seam:
  - render `ViewToolbar`
  - exercise current native color inputs with raw `input`/`change` events
  - prove raw color updates currently create no canonical edit-history entries and preserve redo before wrappers exist
  - prove Material Base/Emissive Color update `view.materials` and remain separate from `EnvironmentLookSnapshot`
  - prove selected-light Color updates `view.lighting` and remains separate from material-only snapshots
  - verify no test assumes every intermediate native picker event is a completed semantic commit
- do not route runtime color entries during this proof unless Manager changes the assignment to implementation and an already reliable completion seam is proven.

Allowed Runtime Path If A Reliable Seam Exists Later:
- Material Base Color:
  - capture `MaterialHistorySnapshot` at the start of a proven completed interaction boundary
  - keep raw live `updateMaterialPreset(...)` during picker movement
  - call `commitMaterialHistory(beforeSnapshot, { targetId: 'material-preset:<id>:color', targetLabel: 'Material base color' })` exactly once after completion
- Material Emissive Color:
  - same as base color, with `targetId: 'material-preset:<id>:emissive'` and `targetLabel: 'Material emissive color'`
- Selected-light Color:
  - capture `EnvironmentLookSnapshot` at the start of a proven completed interaction boundary
  - keep raw live `updateLight(...)` during picker movement
  - call `commitEnvironmentLookHistory(beforeSnapshot, { targetId: 'environment-light:<id>:color', targetLabel: 'Environment light color' })` exactly once after completion
- any runtime path must guard duplicate blur/change/focus exits and prove no-op/redo behavior before acceptance.

Likely Files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/components/ViewToolbar.tsx` only if a tiny test seam or later approved runtime callback is required
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/store/environmentLookEditHistoryStore.test.ts`
- `docs/CHANGELOG.md` only during later proof/test implementation
- this phase doc and `docs/Doc-Log.md` during prep/proof closeout

No-Widening Rule:
- do not add a custom color picker
- do not introduce a shared color input framework
- do not rewrite the material editor or selected-light editor
- do not make raw `updateMaterialPreset(...)` or `updateLight(...)` historyful
- do not snapshot full `ViewSettings`
- do not route Material Metalness/Roughness ranges, Material Name/numeric controls, selected-light non-color controls, ground/environment/display/workspace settings, Catalog/Pubwheel, Browser/project content, viewer runtime/cache/provider/navigation, command transcript/recall, history UI, persistence, collaboration, checkpoints, or branching

No-Op / Redo Rules:
- raw color updates before wrappers must create no canonical entries and must preserve redo
- repeated same color values must create no future canonical entry
- missing selected preset, missing selected light, stale ids, invalid color strings rejected by current inputs, and unchanged normalized snapshots must create no future entry
- future runtime undo/redo must restore only the owning snapshot:
  - material colors restore only `view.materials`
  - selected-light Color restores only `EnvironmentLookSnapshot`
- future runtime undo/redo must not restore the other owner, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, or Catalog state

Implementation Risks:
- native color input behavior differs by browser; `input`/`change` may fire repeatedly while the picker is open
- jsdom may not faithfully model native color picker completion
- treating every `change` event as completion can spam canonical history
- focus/blur may not represent color picker completion consistently
- selected-light and material color fields share UI shape but not history owner
- Escape/cancel semantics are browser-dependent for native color pickers and should not be invented without product/UI backing

Checklist:
- [x] Add proof coverage for raw Material Base Color updates staying history-free and preserving redo.
- [x] Add proof coverage for raw Material Emissive Color updates staying history-free and preserving redo.
- [x] Add proof coverage for raw selected-light Color updates staying history-free and preserving redo.
- [x] Prove material color changes belong to material-only snapshots, not `EnvironmentLookSnapshot`.
- [x] Prove selected-light Color belongs to environment-look snapshots, not material-only snapshots.
- [x] Document whether native color completion is reliable enough for a later runtime phase.
- [x] If no reliable boundary exists, split runtime color undo to a custom picker or explicit color-field architecture phase.
- [x] Keep native picker intermediate events from becoming canonical history spam.
- [x] Update this phase doc and `docs/Doc-Log.md` during prep/proof closeout; update `docs/CHANGELOG.md` only for proof/test or runtime behavior changes.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "color"`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts`
- any additional narrow focused proof test added for native color event behavior

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation later updates `docs/CHANGELOG.md`
- proof/test implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if reliable native color completion cannot be proven without custom picker work
- stop if the only available path would commit one canonical entry per picker intermediate event
- stop if implementation would require broad input architecture, shared keyboard changes, full `ViewSettings` snapshots, owner merging, or raw setter history
- stop if selected-light Color cannot use environment-look history independently from material history
- stop if material colors cannot use material history independently from environment-look history
- stop if work would touch Catalog/Pubwheel, Browser/project, viewer runtime/cache/provider/navigation, command transcript/recall, persistence, collaboration, checkpoints, or branching

Done Shape:
- Phase 2.5c is done when focused proof clearly states whether native color inputs have a safe completed-change boundary; current raw color paths are proven history-free/no-redo-invalidating; owner separation between material colors and selected-light Color is proven; metadata and no-op/redo rules for any future runtime phase are documented; native picker intermediate events are not promoted to canonical entries; focused tests/build pass if implementation proof is assigned; and docs/tracking are updated.

Closeout:
- 2026-04-22 06:08:05: Phase 2.5c added focused `ViewToolbar` proof for the current native color inputs without adding runtime color entries. Material Base Color and Material Emissive Color raw updates now have proof that they mutate `view.materials`, create no canonical entries, preserve redo, and change material-only snapshots without changing `EnvironmentLookSnapshot`. Selected-light Color raw updates now have proof that they mutate `view.lighting`, create no canonical entries, preserve redo, and change environment-look snapshots without changing material-only snapshots.

Native Color Boundary Decision:
- no reliable runtime native color completion boundary is proven in this phase.
- native color undo remains deferred; a future runtime phase should either prove a narrow completed-change seam first or introduce an explicit color-field/custom-picker architecture without per-intermediate-event canonical spam.

Verification Notes:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "color"` passed.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed.
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5c` on 2026-04-22 06:11:05 after rerunning focused ViewToolbar color, material-history, environment-look-history, and production build verification.
- `Edit-History-Gen2-HLG-1` remains open for material Metalness/Roughness native range proof, native color runtime deferral/future architecture routing, and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.5d - Material Native Range Commit Boundary Proof`, covering Material Metalness and Roughness native range controls as a proof-first slice unless a reliable completed-change seam or narrow `ParaSlider` migration can be approved.

## [x] `Edit-History-Gen2-1 / Phase 2.5d` - `Material Native Range Commit Boundary Proof`

### Phase 2.5d Summary

Purpose:
- prove whether current native Material Metalness and Roughness range controls expose a reliable completed-change boundary before adding runtime undo entries
- prevent drag/key intermediate range events from spamming canonical history
- keep material range ownership scoped to material-only snapshots and the `viewer-material` source

Owns:
- Material Metalness native `input type="range"` proof/routing in `ViewToolbar`
- Material Roughness native `input type="range"` proof/routing in `ViewToolbar`
- no-entry/redo preservation proof for raw range live updates before wrappers exist
- metadata and stop/split rules for any future runtime material range commit slice
- decision on whether a narrow `ParaSlider` migration is the right next runtime path

Does Not Own:
- Material Base Color / Emissive Color native color runtime
- Material Name, Emissive Intensity, or Opacity controls already accepted in prior phases
- selected-light controls
- custom picker work
- broad input architecture or shared material editor framework
- full `ViewSettings` snapshots
- ground/environment/display/workspace settings outside the named material range fields
- history UI, persistence architecture, collaboration, checkpoints, branching
- Browser/project content, command transcript/recall, Catalog/Pubwheel, viewer runtime/cache/provider/navigation, or unrelated workspace preference paths

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - Material Metalness: native `input type="range"` with `min={0}`, `max={1}`, `step={0.01}`, `value={selectedPreset.metalness}`, and raw `onChange={(event) => updateMaterialPreset(selectedPreset.id, { metalness: Number(event.target.value) })}`
  - Material Roughness: native `input type="range"` with `min={0}`, `max={1}`, `step={0.01}`, `value={selectedPreset.roughness}`, and raw `onChange={(event) => updateMaterialPreset(selectedPreset.id, { roughness: Number(event.target.value) })}`
- `src/app/store/materialEditHistory.ts`
  - accepted material-only snapshot/restore/commit owner for future runtime entries if a safe boundary is proven
- `src/app/store/uiPrefsStore.ts`
  - raw `updateMaterialPreset(...)` setter remains history-free and clamps range values through `sanitizePreset(...)`
- `src/app/components/ParaSlider.tsx`
  - existing slider component has `onChange` and `onChangeEnd` semantics used by other accepted environment/ground/material numeric phases; migration may be a small future runtime route only if it does not broaden material editor architecture
- `src/app/components/ViewToolbar.test.tsx`
  - likely focused UI proof surface
- `src/app/store/materialEditHistoryStore.test.ts`
  - existing owner-level regression surface for material-only snapshot/redo behavior

First-Pass Decisions:
- Phase 2.5d should be proof-first by default.
- Current native range `onChange` is a live update seam, not a proven completion boundary.
- Do not implement runtime range history through raw native `onChange`.
- Preserve raw range live updates while proof is gathered.
- Future runtime should use material-only snapshots and `commitMaterialHistory(...)`.
- The likely safe runtime path is a narrow migration of only Metalness/Roughness controls to `ParaSlider` with raw `onChange` and one `onChangeEnd` commit, but this requires Manager approval as a runtime implementation phase.

Range Decision Table:

| Control | Owner if runtime later approved | Current seam | Reliable completion boundary today | Phase 2.5d decision | Later runtime metadata |
| --- | --- | --- | --- | --- | --- |
| Material Metalness | material / `viewer-material` | native range `onChange` -> raw `updateMaterialPreset(... { metalness })` | unproven; drag/key changes can emit many intermediate events | proof-first, no runtime by default | `targetId: 'material-preset:<id>:metalness'`, `targetLabel: 'Material metalness'` |
| Material Roughness | material / `viewer-material` | native range `onChange` -> raw `updateMaterialPreset(... { roughness })` | unproven; drag/key changes can emit many intermediate events | proof-first, no runtime by default | `targetId: 'material-preset:<id>:roughness'`, `targetLabel: 'Material roughness'` |

Recommendation:
- approve Phase 2.5d as a proof/test implementation first.
- if proof finds native range completion is not reliable, close Phase 2.5d as a routing/exclusion proof and split runtime range entries to a narrow `ParaSlider` migration phase.
- if proof finds an existing reliable completion seam, Manager may approve a follow-up runtime slice, but do not combine proof and runtime unless explicitly assigned.

### Phase 2.5d Implementation Spec

Exact First Code Cut:
- add focused proof tests only unless the proof exposes a tiny missing test seam:
  - render `ViewToolbar`
  - exercise current native Metalness and Roughness range inputs with raw `input`/`change` events
  - prove raw range updates currently mutate `view.materials`
  - prove raw range updates create no canonical edit-history entries and preserve redo before wrappers exist
  - prove range updates affect material-only snapshots and do not affect `EnvironmentLookSnapshot`
  - verify no test assumes every intermediate range event is a completed semantic commit
- do not route runtime range entries during this proof unless Manager changes the assignment to runtime implementation and a reliable completion seam is already proven.

Allowed Runtime Path If A Reliable Seam Exists Later:
- Metalness:
  - capture `MaterialHistorySnapshot` at the start of a proven completed interaction boundary
  - keep raw live `updateMaterialPreset(...)` during range movement
  - call `commitMaterialHistory(beforeSnapshot, { targetId: 'material-preset:<id>:metalness', targetLabel: 'Material metalness' })` exactly once after completion
- Roughness:
  - capture `MaterialHistorySnapshot` at the start of a proven completed interaction boundary
  - keep raw live `updateMaterialPreset(...)` during range movement
  - call `commitMaterialHistory(beforeSnapshot, { targetId: 'material-preset:<id>:roughness', targetLabel: 'Material roughness' })` exactly once after completion
- If native range cannot provide a reliable boundary, a later approved runtime phase may migrate only these two controls to `ParaSlider`, using `onChange` for raw live updates and `onChangeEnd` for one canonical entry.
- any runtime path must guard no-op/clamped-to-same values and prove redo preservation before acceptance.

Likely Files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/components/ViewToolbar.tsx` only if a tiny test seam or later approved runtime migration is required
- `src/app/store/materialEditHistoryStore.test.ts`
- `src/app/components/ParaSlider.test.tsx` only if a future runtime migration touches `ParaSlider` behavior
- `docs/CHANGELOG.md` only during later proof/test implementation
- this phase doc and `docs/Doc-Log.md` during prep/proof closeout

No-Widening Rule:
- do not add runtime range entries in proof-only assignment
- do not route native range `onChange` directly to canonical history
- do not migrate broader material editor controls to `ParaSlider`
- do not rewrite the material editor or add shared range-field architecture
- do not make raw `updateMaterialPreset(...)` historyful
- do not snapshot full `ViewSettings`
- do not route Material Base/Emissive Color, Material Name/numeric controls, selected-light controls, ground/environment/display/workspace settings, Catalog/Pubwheel, Browser/project content, viewer runtime/cache/provider/navigation, command transcript/recall, history UI, persistence, collaboration, checkpoints, or branching

No-Op / Redo Rules:
- raw range updates before wrappers must create no canonical entries and must preserve redo
- repeated same range values must create no future canonical entry
- values clamped/sanitized back to the starting material snapshot must create no future entry and preserve redo
- missing selected preset, missing material id, stale ids, invalid native range values rejected by current inputs, and unchanged normalized snapshots must create no future entry
- future runtime undo/redo must restore only `view.materials`
- future runtime undo/redo must not restore environment look, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, or Catalog state

Implementation Risks:
- native range inputs fire many `input` / `change` events during drag and keyboard adjustment
- jsdom may not faithfully model browser drag completion
- committing every `onChange` would spam canonical history
- using `mouseup` / `pointerup` globally would risk broad input architecture and missed keyboard commits
- migrating to `ParaSlider` could be safe for two controls, but only if it remains a local ViewToolbar substitution and existing `ParaSlider` tests cover completion semantics
- material range controls share material ownership with accepted material entries, but runtime must not restore full `ViewSettings`

Checklist:
- [x] Add proof coverage for raw Metalness updates staying history-free and preserving redo.
- [x] Add proof coverage for raw Roughness updates staying history-free and preserving redo.
- [x] Prove range changes belong to material-only snapshots, not `EnvironmentLookSnapshot`.
- [x] Document whether native range completion is reliable enough for a later runtime phase.
- [x] If no reliable native boundary exists, split runtime range undo to a narrow `ParaSlider` migration or explicit range-field architecture phase.
- [x] Keep drag/key intermediate events from becoming canonical history spam.
- [x] Update this phase doc and `docs/Doc-Log.md` during prep/proof closeout; update `docs/CHANGELOG.md` only for proof/test or runtime behavior changes.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material range"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- any additional narrow focused proof test added for native range event behavior

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation later updates `docs/CHANGELOG.md`
- proof/test implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if reliable native range completion cannot be proven without broad input architecture
- stop if the only available path would commit one canonical entry per drag/key intermediate event
- stop if implementation would require global pointer listeners, shared keyboard changes, full `ViewSettings` snapshots, owner merging, or raw setter history
- stop if a `ParaSlider` migration would affect material color/name/numeric controls or broader material editor layout
- stop if work would touch Catalog/Pubwheel, Browser/project, viewer runtime/cache/provider/navigation, command transcript/recall, persistence, collaboration, checkpoints, or branching

Done Shape:
- Phase 2.5d is done when focused proof clearly states whether native Metalness/Roughness range inputs have a safe completed-change boundary; current raw range paths are proven history-free/no-redo-invalidating; material-only ownership is proven; metadata and no-op/redo rules for any future runtime phase are documented; drag/key intermediate events are not promoted to canonical entries; focused tests/build pass if implementation proof is assigned; and docs/tracking are updated.

Closeout:
- 2026-04-22 06:17:15: Phase 2.5d added focused `ViewToolbar` proof for the current native Material Metalness and Roughness range inputs without adding runtime range entries. Raw range input/change events now have proof that they mutate `view.materials`, create no canonical entries, preserve redo, and change material-only snapshots without changing `EnvironmentLookSnapshot`.

Native Range Boundary Decision:
- no reliable runtime native range completion boundary is proven in this phase.
- runtime Material Metalness/Roughness undo remains deferred; a future runtime phase should either prove a narrow completed-change seam first or explicitly approve a small `ParaSlider` migration / range-field architecture that keeps live range ticks history-free and commits one canonical material entry on completion.

Verification Notes:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "range"` passed.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed.
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5d` on 2026-04-22 06:19:43 after rerunning focused ViewToolbar range, material-history, environment-look-history, and production build verification.
- `Edit-History-Gen2-HLG-1` remains open for native color runtime deferral/future architecture routing, material range runtime routing if later approved, and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.5e - Material Range ParaSlider Commit Entries`, limited to a local Material Metalness/Roughness `ParaSlider` migration and one canonical material entry per completed range interaction.

## [x] `Edit-History-Gen2-1 / Phase 2.5e` - `Material Range ParaSlider Commit Entries`

### Phase 2.5e Summary

Purpose:
- implement the narrow runtime path approved by the Phase 2.5d proof: replace only Material Metalness and Roughness native range controls with `ParaSlider` so completed range interactions can commit exactly one canonical material entry
- keep raw live range movement fast and history-free through `updateMaterialPreset(...)`
- use `ParaSlider.onChangeEnd(...)` as the semantic completion boundary for pointer, keyboard, and typed value commits

Owns:
- Material Metalness range control in `ViewToolbar`
- Material Roughness range control in `ViewToolbar`
- one canonical `Change material` entry per completed Metalness/Roughness interaction when the normalized material snapshot changed
- no-op/redo preservation when the completed value matches the starting material snapshot
- undo/redo restoration through existing material-only snapshot helpers

Does Not Own:
- Material Base Color or Emissive Color runtime
- Material Name, Emissive Intensity, or Opacity controls already accepted in prior phases
- selected-light controls
- custom picker work
- broad input architecture or shared field framework
- full `ViewSettings` snapshots
- ground, environment, display, projection, or workspace preference settings
- history UI, persistence architecture, collaboration, checkpoints, branching
- Browser/project content, command transcript/recall, Catalog/Pubwheel, viewer runtime/cache/provider/navigation, or unrelated files

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - currently renders Material Metalness and Roughness as native `input type="range"` fields with raw `onChange` calls to `updateMaterialPreset(...)`
  - already imports and uses `ParaSlider` elsewhere in the toolbar for completed slider interactions
  - already has material focus-session code for Name/typed numeric controls that can serve as a local pattern for snapshot-before/live-update/commit-after without adding shared input architecture
- `src/app/components/ParaSlider.tsx`
  - exposes `onChange(value)` for live updates
  - exposes `onChangeEnd(value)` for pointer-up completion
  - calls `onChangeEnd(...)` for Home/End keyboard changes
  - calls `onChangeEnd(...)` for typed value commit through its inline value editor
- `src/app/components/ParaSlider.test.tsx`
  - already covers Home/End committing `onChangeEnd` once
  - should only be touched if `ParaSlider` behavior changes
- `src/app/store/materialEditHistory.ts`
  - accepted material-only helpers: `captureMaterialHistorySnapshot(...)`, `commitMaterialHistory(...)`, and material-only restore behavior
- `src/app/store/materialEditHistoryStore.test.ts`
  - accepted regression surface for material-only undo/redo/no-op behavior
- `src/app/components/ViewToolbar.test.tsx`
  - required focused UI proof surface for the actual migrated controls

First-Pass Decisions:
- Phase 2.5e is a runtime implementation phase, not another proof-only pass.
- Keep the migration local to `ViewToolbar`; do not generalize material editor inputs.
- Use one component-local draft/snapshot per range interaction:
  - capture the material snapshot before the first live update for the active range interaction
  - call raw `updateMaterialPreset(...)` during `ParaSlider.onChange(...)`
  - call `commitMaterialHistory(...)` during `ParaSlider.onChangeEnd(...)`
- Do not make raw `updateMaterialPreset(...)` historyful.
- Do not change `ParaSlider` unless focused tests prove an existing completion behavior regressed.
- Runtime range undo remains material-owned: `viewer-material`, not environment look or full view settings.

### Phase 2.5e Implementation Spec

Exact First Code Cut:
- in `src/app/components/ViewToolbar.tsx`, replace only the Metalness and Roughness native range inputs with `ParaSlider` controls:
  - `label="Metalness"` / `label="Roughness"`
  - `min={0}`, `max={1}`, `step={0.01}`
  - `value={selectedPreset.metalness}` / `value={selectedPreset.roughness}`
  - `onChange={(value) => updateMaterialPreset(selectedPreset.id, { metalness: value })}` and equivalent Roughness raw live update
  - `onChangeEnd={...}` commits through material-only history
- add tiny component-local helpers if needed:
  - capture `captureMaterialHistorySnapshot()` before the first live change for a given preset/field interaction
  - clear the draft after `commitMaterialHistory(...)`
  - if `onChangeEnd(...)` fires without a prior draft, capture the immediate-before state and let unchanged comparison return no-entry
- use the existing `commitMaterialHistory(...)` helper; do not add a new material range owner.
- do not modify `ParaSlider` unless a focused failing test proves a real completion-boundary bug.

Metadata:
- label: `Change material`
- source:
  - `surface: 'viewer-material'`
  - `sourceId: 'materials'`
  - `sourceLabel: 'Materials'`
- Metalness:
  - `targetId: 'material-preset:<id>:metalness'`
  - `targetLabel: 'Material metalness'`
- Roughness:
  - `targetId: 'material-preset:<id>:roughness'`
  - `targetLabel: 'Material roughness'`

Keyboard / Pointer / Typed Completion Requirements:
- pointer drag:
  - `ParaSlider.onChange(...)` may fire continuously and must remain raw/history-free
  - `ParaSlider.onChangeEnd(...)` commits one canonical entry at pointer-up when the material snapshot changed
- Home/End:
  - rely on existing `ParaSlider` behavior that calls `onChange(...)` and `onChangeEnd(...)` for Home/End
  - focused `ViewToolbar` tests must prove Home/End creates one canonical entry when the value changes
- typed value commit:
  - rely on existing `ParaSlider` inline value editor and `onChangeEnd(...)` commit path
  - focused `ViewToolbar` tests should cover typed commit if it is practical with current DOM seams; otherwise cite existing `ParaSlider` typed-commit behavior and cover one keyboard completion path in `ViewToolbar`
- `ParaSlider` regression tests are required only if this phase changes `ParaSlider` behavior.

No-Widening Rule:
- do not route native range `onChange` directly to canonical history
- do not migrate Material Base/Emissive Color, Material Name, Emissive Intensity, Opacity, selected-light controls, ground/environment/display/projection/workspace settings, or any unrelated controls
- do not add a shared field framework, custom range component architecture, or material editor rewrite
- do not make raw `updateMaterialPreset(...)` historyful
- do not snapshot full `ViewSettings`
- do not touch Catalog/Pubwheel, Browser/project content, viewer runtime/cache/provider/navigation, command transcript/recall, history UI, persistence, collaboration, checkpoints, or branching

No-Op / Redo Rules:
- live ticks must create no canonical entries
- same-value completion must create no entry and preserve redo
- completed values that clamp/sanitize back to the starting material snapshot must create no entry and preserve redo
- missing selected preset, stale selected preset id, missing material id, or unmounted controls must create no entry and preserve redo
- a new successful range commit after undo must invalidate redo through the existing canonical owner behavior
- undo/redo must restore only `view.materials`, preserving environment look, ground, display/projection/grid/wireframe, workspace local view state, viewer runtime/cache/provider state, Browser/project content, command transcript/recall, and Catalog state

Implementation Risks:
- `ParaSlider` may have a richer DOM structure than native range inputs; `ViewToolbar` layout/tests should target labels/accessible text instead of fragile internal structure where possible
- blur-after-typed-commit or Home/End may call completion paths in quick succession; no-op snapshot comparison must prevent duplicate entries
- if a local range draft remains after unmount or preset switch, the implementation must clear it rather than leave stale commits
- if migrating the two controls causes broad CSS/layout churn, stop and split rather than refactor the material editor
- if `ParaSlider` does not expose a practical test seam for typed value commit in `ViewToolbar`, cover pointer/keyboard completion locally and rely on existing `ParaSlider` tests for typed value completion unless Manager asks for a deeper UI proof

Checklist:
- [x] Replace only Material Metalness and Roughness native range controls with `ParaSlider`.
- [x] Keep `onChange(...)` raw/live/history-free.
- [x] Commit one `Change material` entry on `onChangeEnd(...)` when Metalness changed.
- [x] Commit one `Change material` entry on `onChangeEnd(...)` when Roughness changed.
- [x] Prove undo/redo restores material range values through material-only snapshots.
- [x] Prove no-op/same-value completion preserves redo and creates no entry.
- [x] Prove live ticks create no canonical entries.
- [x] Prove environment look remains unchanged by material range undo/redo.
- [x] Leave `ParaSlider` untouched unless a focused completion-boundary regression requires repair.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` after verification.

Focused Verification:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material range"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"`
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/components/ParaSlider.test.tsx` only if `ParaSlider` behavior changes

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation must update `docs/CHANGELOG.md` for runtime/test behavior
- implementation must update this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation must update `docs/Doc-Log.md` for docs maintenance
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if migration requires broad material editor layout/input architecture changes
- stop if completion cannot be made one-entry without changing `ParaSlider` globally
- stop if live ticks would create canonical entries
- stop if undo/redo requires full `ViewSettings` or owner merging with environment look
- stop if missing/stale preset handling cannot preserve redo without broad store changes
- stop if implementation would touch Catalog/Pubwheel, Browser/project, viewer runtime/cache/provider/navigation, command transcript/recall, history UI, persistence, collaboration, checkpoints, or branching

Done Shape:
- Phase 2.5e is done when Material Metalness and Roughness use `ParaSlider` in `ViewToolbar`, live movement remains raw/history-free, completed pointer/keyboard/typed slider interactions create one canonical `Change material` entry only when `view.materials` changed, no-op completions preserve redo, undo/redo restores only material state, environment look remains unchanged, focused tests and build pass, and docs/tracking are updated.

Closeout:
- 2026-04-22 06:26:37: Phase 2.5e migrated only Material Metalness and Roughness from native range inputs to `ParaSlider` controls in `ViewToolbar`. Live `ParaSlider.onChange(...)` updates remain raw `updateMaterialPreset(...)` calls, while `ParaSlider.onChangeEnd(...)` commits one canonical material-only `Change material` entry when the range value changes. No `ParaSlider` source changes were required.

Verification Notes:
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material range"` passed.
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "material"` passed.
- `npm.cmd test -- --run src/app/store/materialEditHistoryStore.test.ts` passed.
- `npm.cmd test -- --run src/app/store/environmentLookEditHistoryStore.test.ts` passed.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.5e` on 2026-04-22 06:31:23 after rerunning focused ViewToolbar material range/material, material-history, environment-look-history, and production build verification.
- `Edit-History-Gen2-HLG-1` remains open for native color runtime deferral/future architecture routing and remaining display/projection/workspace-preference routing.
- Recommended next Manager action is prep-only `Phase 2.6 - Display Projection Workspace Preference Routing`, limited to deciding which remaining display/projection/workspace-preference candidates are durable authored state before any runtime implementation.

## [x] `Edit-History-Gen2-1 / Phase 2.6` - `Display Projection Workspace Preference Routing`

### Phase 2.6 Summary

Purpose:
- classify the remaining display, projection, and workspace-preference presentation controls after material range acceptance
- prove current raw display/projection preference seams remain outside canonical edit history until ownership and commit boundaries are separately approved
- route each candidate to Gen2-1 durable presentation, Gen2-3 workspace layout/preference planning, or durable exclusion without starting runtime undo implementation

Owns:
- routing/proof for projection mode, grid visible, wireframe, axis overlay enabled, and axis overlay style
- routing/proof for adjacent display/view preference candidates found in the live seams: axes visible, shadows enabled, and orbit enabled
- no-entry and redo-preservation proof requirements for the current raw seams
- a decision table that separates global persisted view settings from viewport-local/session/workspace state

Does Not Own:
- runtime undo entries by default
- material, ground, environment look, native color, selected-light, or already accepted material range behavior
- viewer runtime state, camera navigation, camera presets, scrub/playhead state, or viewport runtime readers
- workspace layout implementation, dock/floating/open/tab/rect state, focus/menu state, or persistence architecture changes
- history UI, collaboration, checkpoints, branching, Catalog/Pubwheel work, Browser/project content, command transcript/recall, or unrelated files

Current Live Seams:
- `src/app/components/ViewToolbar.tsx`
  - projection buttons call `setProjectionModeCommand('perspective' | 'orthographic', viewportId)`
  - effective view merges global `useUiPrefsStore().view` with `localViewState?.projectionMode` and `localViewState?.axisOverlayEnabled`
  - Grid and Wireframe checkboxes call `setViewKey('gridVisible', ...)` and `setViewKey('wireframe', ...)`
  - Axes and Shadows controls call `setViewKey('axesVisible', ...)` and `setViewKey('shadowsEnabled', ...)`
  - Axis Overlay enabled writes viewport-local state through `setViewportLocalViewState(viewportId, { axisOverlayEnabled })` when a `viewportId` is present, otherwise it falls back to global `setViewKey('axisOverlayEnabled', ...)`
  - Axis Overlay style uses `updateAxisOverlayStyle(...)`, which reads `useUiPrefsStore.getState().view.axisOverlayStyle` and writes `setView({ axisOverlayStyle: ... })`
  - Axis Overlay style sliders currently use raw `ParaSlider.onChange(...)` only; discrete style selects use raw `ParaSelect.onChange(...)`
  - Orbit Enabled calls `setViewKey('orbitEnabled', ...)` but controls viewer interaction/navigation behavior, not authored scene presentation geometry/material/light state
- `src/app/viewCommands.ts`
  - `setProjectionModeCommand(mode, viewportId)` writes viewport-local projection through `useWorkspaceStore.getState().setViewportLocalViewState(...)` when `viewportId` exists
  - without a viewport id, it writes global `useUiPrefsStore.getState().setViewKey('projectionMode', mode)`
- `src/app/store/uiPrefsStore.ts`
  - raw `setView(...)` and `setViewKey(...)` normalize and write `view` settings directly
  - these raw setters currently remain history-free and are used by setup/tests/live UI paths
- `src/app/store/uiPrefsPersistence.ts`
  - `viewSettingsPersistence` owns `projectionMode`, `orbitEnabled`, `gridVisible`, `axesVisible`, `shadowsEnabled`, `wireframe`, `ground`, `axisOverlayEnabled`, `axisOverlayStyle`, and `materials`
  - `environmentPersistence` separately owns `envPreset`, `environmentGrade`, `environmentSource`, and `lighting`
- `src/app/components/ViewToolbar.test.tsx`
  - already covers projection command routing
  - already covers display toggle wiring for Orbit Enabled, Grid, Axes, Wireframe, and Axis Overlay
  - already covers Axis Overlay style updates

First-Pass Decisions:
- Phase 2.6 should be proof-only/routing first, not a runtime undo phase.
- `viewSettingsPersistence` proves several settings are durable user presentation preferences, but mixed viewport-local overrides mean a single runtime owner is not yet safe.
- Projection mode is split between global persisted view settings and viewport-local workspace state; it should route to proof and likely Gen2-3 workspace preference planning before any runtime undo entry is approved.
- Axis Overlay enabled is similarly split between global view settings and viewport-local state; proof must distinguish those paths.
- Grid visible, Wireframe, Axes visible, and Shadows enabled are global persisted display preferences with clear raw setter seams, but they still need raw no-entry proof before any Gen2-1 runtime display preference helper is approved.
- Axis Overlay style is durable under `viewSettingsPersistence`, but its sliders are raw `onChange(...)` updates and its selects are discrete changes; any future runtime work should split slider commit-boundary proof from discrete select wrappers.
- Orbit Enabled should not be a Gen2-1 presentation runtime undo candidate in this pass because it changes viewer control/navigation behavior; route it to Gen2-3 workspace layout/preference planning or keep it excluded unless the user promotes it.
- Existing raw setters must remain history-free for setup/tests/live updates.

Decision Table:

| Candidate | Current seam | Storage/owner read | Routing decision | Later route |
| --- | --- | --- | --- | --- |
| Projection mode | `setProjectionModeCommand(mode, viewportId)` | global `view.projectionMode` under `viewSettingsPersistence`; viewport-local override through `useWorkspaceStore` when `viewportId` exists | proof-only; no runtime entry in Phase 2.6 | split global persisted preference vs viewport-local workspace preference before runtime; likely Gen2-3 for viewport-local behavior |
| Grid visible | `setViewKey('gridVisible', checked)` | global `view.gridVisible` under `viewSettingsPersistence` | proof-only; no-entry/redo proof first | possible later Gen2-1 display preference entry if Manager approves a display-only helper |
| Wireframe | `setViewKey('wireframe', checked)` | global `view.wireframe` under `viewSettingsPersistence` | proof-only; no-entry/redo proof first | possible later Gen2-1 display preference entry if Manager approves a display-only helper |
| Axis overlay enabled | `setViewportLocalViewState(viewportId, { axisOverlayEnabled })` when viewport-local; otherwise `setViewKey('axisOverlayEnabled', checked)` | global `view.axisOverlayEnabled` under `viewSettingsPersistence`; viewport-local override when present | proof-only; mixed owner makes runtime unsafe in this phase | route viewport-local behavior to Gen2-3; global fallback can split later if needed |
| Axis overlay style | `updateAxisOverlayStyle(...)` -> `setView({ axisOverlayStyle })` | global `view.axisOverlayStyle` under `viewSettingsPersistence` | proof-only; sliders lack approved completion boundary | split discrete style selects from slider commit-boundary proof before runtime |
| Axes visible | `setViewKey('axesVisible', checked)` | global `view.axesVisible` under `viewSettingsPersistence` | proof-only; no-entry/redo proof first | possible later Gen2-1 display preference entry or Gen2-3 workspace preference if treated as user-layout preference |
| Shadows enabled | `setViewKey('shadowsEnabled', value === 'on')` | global `view.shadowsEnabled` under `viewSettingsPersistence` | proof-only; must remain separate from environment lighting and selected-light shadow editor history | possible later Gen2-1 display/render preference entry after proof |
| Orbit enabled | `setViewKey('orbitEnabled', checked)` | global `view.orbitEnabled` under `viewSettingsPersistence` | exclude from Gen2-1 runtime undo for now; viewer interaction/navigation preference | Gen2-3 workspace layout/preference routing or durable exclusion |

### Phase 2.6 Implementation Spec

Exact First Code Cut / Proof-Only Cut:
- add focused proof tests only; do not add runtime wrappers or canonical display/projection entries
- preferred proof surface:
  - extend `src/app/store/scenePresentationEditHistoryReadiness.test.ts` or add a narrow display/projection readiness test if that keeps setup smaller
  - add focused `src/app/components/ViewToolbar.test.tsx` coverage only if proof needs the real toolbar wiring path rather than store-level raw setter seams
- prove raw global display preference updates currently:
  - mutate the expected `useUiPrefsStore().view` field
  - create no canonical edit-history entries
  - preserve redo when canonical redo already exists
- prove projection and axis overlay enabled can use viewport-local workspace state and therefore must not be claimed as simple Gen2-1 global presentation entries in this phase
- prove `viewSettingsPersistence` owns the global display/projection/material/ground fields while `environmentPersistence` remains separate for environment look
- document any raw seam that cannot be tested without broad ViewToolbar/workspace setup as a follow-up, not as implemented runtime behavior

Likely Files For Later Proof:
- `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/store/uiPrefsStore.test.ts` only if raw setter/persistence behavior needs direct proof
- `src/app/viewCommands.ts` and workspace store tests only if projection local/global split proof needs command-level coverage
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during proof implementation closeout

No-Widening Rule:
- do not implement runtime display/projection/workspace preference undo entries in Phase 2.6
- do not add a generic view-settings history helper without a narrower Manager-approved runtime phase
- do not snapshot full `ViewSettings`
- do not touch material, ground, environment, native color, selected-light, viewer transform, Browser/project, Catalog/Pubwheel, Build Path, history UI, persistence architecture, collaboration, checkpoints, branching, command transcript/recall, or unrelated work
- do not change camera navigation, camera presets, viewer runtime state, scrub/playhead behavior, or workspace layout implementation
- do not refactor `ViewToolbar`, `uiPrefsStore`, `viewCommands`, or workspace local-view state for proof setup

No-Op / Redo Rules For Later Proof:
- raw display/projection preference writes in this phase must create no canonical entries
- raw no-op writes must preserve redo and not invalidate canonical redo
- viewport-local projection or axis overlay writes must not create global presentation history entries
- raw global display preference writes must not capture or restore material, ground, environment look, Catalog/provider/cache/preview state, Browser/project content, viewer runtime state, or workspace layout state

Implementation Risks:
- projection and axis overlay enabled have mixed global and viewport-local ownership; claiming them as Gen2-1 runtime entries could wrongly capture workspace-local state
- Axis Overlay style sliders use raw `onChange(...)` only; runtime undo would risk one entry per slider tick without a separate completion-boundary phase
- Orbit Enabled is persisted but changes interaction/navigation behavior, so treating it as scene presentation could widen Gen2-1 into camera/navigation ownership
- ViewToolbar tests already have broad coverage; keep any future proof filtered and focused to avoid chasing unrelated UI expectations

Checklist:
- [x] Prove raw global display preference writes are canonical-history-free and redo-preserving.
- [x] Prove projection mode has both global and viewport-local paths.
- [x] Prove axis overlay enabled has both global and viewport-local paths.
- [x] Prove Axis Overlay style is durable `viewSettingsPersistence` state while leaving runtime slider commit boundaries unimplemented.
- [x] Route Grid/Wireframe/Axes/Shadows as possible later Gen2-1 display preference candidates only after proof.
- [x] Route Projection and viewport-local Axis Overlay enabled to Gen2-3 workspace preference planning or a later split.
- [x] Route Orbit Enabled away from Gen2-1 runtime undo unless the user promotes viewer-control preferences.
- [x] Keep material, ground, environment, native color, Catalog/Pubwheel, camera/navigation, runtime/cache/provider, history UI, persistence architecture, collaboration, checkpoints, and branching out of scope.
- [x] Update docs/tracking after proof implementation if Manager approves it.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts -t "display"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "display"`
- `npm.cmd test -- --run src/app/components/ViewToolbar.test.tsx -t "projection"` if projection command/local-view proof is added
- `npm.cmd test -- --run src/app/store/uiPrefsStore.test.ts` only if raw setter/persistence tests are touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation later updates `docs/CHANGELOG.md`
- proof/test implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- proof/test implementation later updates `docs/Doc-Log.md`
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-1` complete; Manager handles acceptance/status

Stop Conditions:
- stop if proving projection or axis overlay enabled requires workspace layout implementation or broad local-view refactors
- stop if display preference proof requires runtime undo wrappers rather than negative tests
- stop if Axis Overlay style proof requires new slider architecture or shared input framework
- stop if candidate classification would require full `ViewSettings` snapshots, persistence architecture changes, camera/navigation ownership, history UI, Catalog/Pubwheel work, collaboration, checkpoints, or branching

Done Shape:
- Phase 2.6 prep is done when the remaining display/projection/workspace-preference candidates are classified, live seams and risks are named, proof-only first code cut is explicit, candidate routing between Gen2-1 and Gen2-3 is clear, focused verification/build gates are listed, and docs/tracking are updated.
- Phase 2.6 implementation/proof will be done only after focused tests prove raw no-entry/redo boundaries, mixed viewport-local ownership is documented by test, no runtime wrappers are added, focused tests/build pass, and docs/tracking are updated.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-1 / Phase 2.6` on 2026-04-22 06:39:43 after rerunning focused scene presentation readiness and production build verification.
- `Edit-History-Gen2-HLG-1` is complete because Gen2-1 accepted runtime undo for environment/lighting/material/ground candidates where commit boundaries were explicit, proved and deferred native color/axis-style slider paths that lack reliable commit boundaries, and routed projection plus viewport-local axis overlay behavior to workspace-preference planning.
- Recommended next Manager action is move the retained Worker lane to `Edit-History-Gen2-2 / Phase 1 - Productivity Content Ownership And Commit Boundary Proof`.

Closeout:
- 2026-04-22 06:37:08: Phase 2.6 added focused readiness proof only, with no runtime display/projection undo entries. Raw global display preference writes for Grid, Wireframe, Axes, Shadows, and Axis Overlay style now have proof that they mutate `useUiPrefsStore().view`, create no canonical entries, preserve redo, and stay separated from `EnvironmentLookSnapshot`. Projection mode and Axis Overlay enabled now have proof of separate global and viewport-local paths.

Verification Notes:
- `npm.cmd test -- --run src/app/store/scenePresentationEditHistoryReadiness.test.ts` passed.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Runtime Decision:
- Runtime display/projection undo remains deferred. Grid/Wireframe/Axes/Shadows may be future Gen2-1 display preference candidates after a narrow runtime helper is approved. Projection mode and viewport-local Axis Overlay enabled should route to Gen2-3 workspace preference planning or a later split because they can write viewport-local workspace state. Axis Overlay style needs a separate slider/discrete commit-boundary decision before runtime entries.

Acceptance Recommendation:
- Recommend Manager accept Phase 2.6 as proof-only. `Edit-History-Gen2-HLG-1` remains open for future display/preference runtime slices or for Manager-directed closure after routing decisions are accepted.
