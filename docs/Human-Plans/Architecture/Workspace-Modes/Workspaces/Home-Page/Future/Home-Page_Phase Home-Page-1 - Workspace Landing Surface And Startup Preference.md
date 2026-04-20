# [x] `Home-Page-1` - `Workspace Landing Surface And Startup Preference`

## Doc Header

### Doc History
13. 2026-04-19 15:47:54: Reconciled the `Home-Page-1` family-phase and `Phase 4` checklist markers after Guide-Rail review accepted the launch-action closeout.
12. 2026-04-19 15:36:59: Tightened the `Home-Page-1 / Phase 4 - First Launch Actions And Closeout` implementation spec from Dispatch 2 Explorer findings, naming the existing shell activation, slot-surface switch, and console activation seams the Worker should reuse.
11. 2026-04-19 15:33:59: Aligned the `Home-Page-1` ladder after the `Phase 3.1` closeout so the doc now treats the visible startup toggle as shipped and points the next Dispatch 2 loop at `Phase 4`.
10. 2026-04-19 15:26:27: Recorded the `Home-Page-1 / Phase 3.1 - Visible Startup Toggle And Test Baseline Repair` closeout after the visible Home Page startup toggle shipped, the AppShell baseline was repaired around the new default startup surface, and the remaining AppShell failures were confirmed to sit outside the Home Page startup path.
9. 2026-04-19 15:18:55: Added `Home-Page-1 / Phase 3.1 - Visible Startup Toggle And Test Baseline Repair` after Dispatch 2 Guide-Rail review found the persisted startup preference complete but the user-facing toggle and broad AppShell baseline still open before `Phase 4` can start.
8. 2026-04-19 15:13:29: Recorded the `Home-Page-1 / Phase 3 - Startup Preference` Worker closeout after landing the persisted startup surface preference, fresh-start startup branching, accepted-restore precedence, and focused UI prefs/AppShell proof while leaving launch actions for the next phase.
7. 2026-04-19 15:08:37: Tightened the `Home-Page-1 / Phase 3 - Startup Preference` implementation spec from Dispatch 2 Explorer findings, routing the preference through the existing UI prefs and workspace restore/startup seams, preserving accepted persisted workspace layouts, and keeping Catalog, Environment, storage toggles, and launch actions out of the phase.
6. 2026-04-19 15:04:46: Recorded the Dispatch 2 Guide-Rail review for `Home-Page-1 / Phase 2 - Zero-Viewer Return`, marking `Home-Page-Gen1-CLG-1` and `Home-Page-Gen1-CLG-2` complete while keeping startup preference, launch actions, `Home-Page-Gen1-HLG-1`, and `Home-Page-Gen1-HLG-2` open.
5. 2026-04-19 15:00:10: Recorded the `Home-Page-1 / Phase 2 - Zero-Viewer Return` Worker closeout after closing the root `Model Viewport` began transitioning the primary slot to `homePage`, proving zero-viewer store and persistence behavior plus focused AppShell close behavior while leaving startup preference and launch actions for later phases.
4. 2026-04-19 14:56:23: Tightened the `Home-Page-1 / Phase 2 - Zero-Viewer Return` implementation spec from Dispatch 2 Explorer findings, naming the primary-slot close guard, store root-slot invariant, active-viewer resolver risk, persistence normalization seam, and focused AppShell/store proof needed before Worker dispatch.
3. 2026-04-19 14:49:50: Recorded the `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render` implementation closeout after `homePage` became a real workspace surface kind, catalog entry, primary-slot option, and registry-rendered minimal surface, leaving startup preference, zero-viewer return, storage, launch actions, and orientation content for later phases.
2. 2026-04-19 13:31:41: Prepped this Family Phase Doc against the active `Home-Page-Gen1-Index.md`, adding the missing top-level `## Vision`, tightening the live source read around the actual workspace surface seams, and refreshing the phase ladder, coverage, likely files, verification, and no-widening rules so `Home-Page-1 / Phase 1` is ready for implementation dispatch without widening into storage or orientation work.
1. 2026-04-19 10:36:04: Created this standalone `Home-Page-1` future doc from `Home-Page-Vision.md` and `Home-Page-Index.md`, making the first workspace-surface, zero-viewer return, startup preference, and launch-action cut implementation-ready without widening into storage transparency, graph persistence, or release-orientation work.

### Purpose

This doc defines the first implementation-ready `Home Page` family phase.

Use it to answer:
- how `Home Page` should become a real workspace surface
- how zero open `Model Viewport` surfaces should become valid
- how startup should choose between `Home Page` and direct `Model Viewport`
- which first launch actions belong in the opening surface cut
- what must stay outside the first phase

### Scope

This doc covers:
- first-class workspace-surface registration
- first root-slot rendering for `Home Page`
- last-model-viewport-close return behavior
- one startup preference
- first launch actions into existing workspace owners
- verification shape for the first surface cut

This doc does not cover:
- storage transparency
- graph browser-storage persistence
- destructive storage cleanup
- docs, GitHub, version, or what's-new orientation
- full visual design polish beyond the minimum surface proof

## Doc Body

### Why This Phase Exists

`Home Page` already has a vision doc, but implementation should not start by mixing every wishlist item into one broad surface. The first honest cut is to prove that `Home Page` is a real workspace surface and that ParaHook can live without a protected always-open `Model Viewport`.

This phase should make the shell tell the truth:
- app startup can land on `Home Page`
- the startup preference can opt into direct `Model Viewport`
- closing the last `Model Viewport` can return to `Home Page`
- launch actions hand off to real workspace owners

### Current Live Read

The live workspace model already has a real slot/surface direction from the broader `Workspace 7.x` family. `Home Page` should join that model instead of adding a separate route-only page or another singleton shell path.

The source read before this prep pass found the likely first implementation seams:
- `src/app/workspace/workspaceShellTypes.ts`
  - owns `WorkspaceSurfaceKind`, default slot creation, default `modelViewer` primary slot, active-viewer resolution, and primary-slot surface support
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - owns the canonical surface catalog, labels, render families, host-mode support, split support, and persistence participation
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - owns the render branch for non-model workspace surface kinds
- `src/app/workspace/useWorkspaceStore.ts`
  - owns default workspace slot state, `removeViewportSlot`, `setViewportSlotSurfaceKind`, active-viewer re-resolution, and persisted layout hydration
- `src/app/workspace/workspacePersistence.ts`
  - owns persisted layout serialization/normalization and parses persisted surface kinds through the catalog
- `src/app/workspace/workspaceSurfaceActions.ts`
  - owns reusable focus, float, popout, redock, split, and restore helpers for workspace surfaces
- `src/app/hosts/useAppShellViewportActions.ts`
  - owns the slot close and viewport action path used by AppShell
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - owns workspace spawn/split menu actions
- `src/app/AppShell.tsx`
  - wires the shell state, workspace tree, surface registry, slot actions, detached hosts, and persistence bridges
- focused proof already exists around:
  - `src/app/workspace/workspaceSurfaceCatalog.test.ts`
  - `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
  - `src/app/workspace/useWorkspaceStore.test.ts`
  - `src/app/AppShell.test.tsx`

### Phase Ladder

- Phase 1 shipped the `Home Page` surface registration and minimal render.
- Phase 2 shipped zero-model-viewport return behavior.
- Phase 3 shipped the persisted startup preference branch.
- Phase 3.1 shipped the visible startup toggle and repaired the broad AppShell default-startup test baseline.
- Phase 4 is the next implementation slice and adds first launch actions plus closeout proof.

### Coverage Table

| Phase | HLG coverage | CLG coverage | Likely files |
| --- | --- | --- | --- |
| Phase 1 | `Home-Page-Gen1-HLG-1` | `Home-Page-Gen1-CLG-1` | `workspaceShellTypes.ts`, `workspaceSurfaceCatalog.ts`, `ViewportSurfaceRegistry.tsx`, new `HomePageSurface.tsx`, `workspaceSurfaceCatalog.test.ts`, `ViewportSurfaceRegistry.test.tsx` |
| Phase 2 | `Home-Page-Gen1-HLG-1` | `Home-Page-Gen1-CLG-2` | `useWorkspaceStore.ts`, `workspacePersistence.ts`, `useAppShellViewportActions.ts`, `useWorkspaceStore.test.ts`, `AppShell.test.tsx` |
| Phase 3 | `Home-Page-Gen1-HLG-1`, `Home-Page-Gen1-HLG-2` | `Home-Page-Gen1-CLG-3` | UI preference store/persistence bridge after live seam confirmation, workspace startup initialization, `AppShell.test.tsx` |
| Phase 3.1 | `Home-Page-Gen1-HLG-2` | `Home-Page-Gen1-CLG-3` closeout proof | `HomePageSurface.tsx`, `AppShell.test.tsx`, optional `ViewportSurfaceRegistry.test.tsx` |
| Phase 4 | `Home-Page-Gen1-HLG-1`, `Home-Page-Gen1-HLG-2` | `Home-Page-Gen1-CLG-4` | `HomePageSurface.tsx`, `workspaceSurfaceActions.ts`, `useAppShellWorkspaceMenus.tsx`, `AppShell.test.tsx`, surface styling file if needed |

### Acceptance Read

This phase is ready for implementation when:
- the live surface registry and workspace slot paths have been inspected
- the active implementation phase has a narrow file list and no-widening rule
- protected-last-viewer behavior is handled only in Phase 2, not Phase 1
- startup preference behavior is handled only in Phase 3, not Phase 1
- launch actions are handled only in Phase 4, not Phase 1
- the first phase stays free of storage and release-orientation work

## Vision

`Home-Page-1` is the first `Home Page` Family Phase Doc under `Home-Page-Gen1-Index.md`.

This family phase should prove the workspace truth before adding persistence transparency or orientation content:
- `Home Page` is a real workspace surface kind
- the workspace model can render it through the same surface registry as Catalog, Browser, Console, Dashboard, Notepad, and Spaghetti Editor
- the app can later return to `Home Page` when the last `Model Viewport` closes
- startup can later choose between `Home Page` and direct `Model Viewport`
- launch actions can later hand off to real workspace owners instead of making `Home Page` a hidden owner

The implementation ladder must stay ordered:
- Phase 1 registers and renders the minimal surface only
- Phase 2 changes zero-viewer return behavior
- Phase 3 adds the startup preference
- Phase 3.1 shipped the visible startup toggle and repaired tests for the new default startup surface
- Phase 4 adds first launch actions and closeout proof

Important rule:
- do not mix the phases together just because they all touch the shell
- do not add storage cards, persistence toggles, GitHub/docs links, version content, or what's-new content in this family phase
- do not make `Home Page` a route-only screen outside the workspace surface model

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-1. Home Page should be the first surface the user loads into.`
- [x] `Home-Page-Gen1-HLG-2. There should be a toggle so the user can switch off Home Page first and load directly into Model Viewport.`

### Codex Level Goals

- [x] Home-Page-Gen1-CLG-1. Define `Home Page` as a first-class workspace surface that can occupy the root slot without requiring a live `Model Viewport`.
- [x] Home-Page-Gen1-CLG-2. Replace the protected-last-viewer assumption with an explicit zero-viewer return path to `Home Page`.
- [x] Home-Page-Gen1-CLG-3. Add a startup preference that changes only first-launch behavior and does not disable the `Home Page` surface.
- [x] Home-Page-Gen1-CLG-4. Provide launch and resume actions that hand off to existing workspace owners instead of duplicating Browser, Catalog, graph, or viewer ownership.

### `Home-Page-1 / Phase 1`

- [x] Inspect the current workspace surface type and render map.
- [x] Add `Home Page` as a real surface kind.
- [x] Render the first minimal `HomePageSurface`.
- [x] Keep the first surface free of storage and release-note content.
- [ ] `Home-Page-Gen1-HLG-1`
- [x] `Home-Page-Gen1-CLG-1`

### `Home-Page-1 / Phase 2`

- [x] Inspect the protected-last-model-viewport behavior.
- [x] Replace the forced-surviving-viewer path with an explicit return to `Home Page`.
- [x] Keep reopening `Model Viewport` available through a normal workspace command.
- [x] Prove zero-model-viewport layout state in tests.
- [ ] `Home-Page-Gen1-HLG-1`
- [x] `Home-Page-Gen1-CLG-2`

### `Home-Page-1 / Phase 3`

- [x] Add a `show Home Page first on startup` or equivalent startup preference.
- [x] Default the preference to showing `Home Page` first.
- [x] Route app launch through `Home Page` or direct `Model Viewport` based on the preference.
- [x] Keep manual `Home Page` opening possible regardless of preference.
- [x] `Home-Page-Gen1-HLG-1`
- [x] `Home-Page-Gen1-HLG-2`
- [x] `Home-Page-Gen1-CLG-3`

### `Home-Page-1 / Phase 3.1`

- [x] Expose a visible `Home Page` startup toggle on the `Home Page` surface or another already-existing Home Page-owned surface area.
- [x] Keep the toggle wired to the existing `workspaceStartupSurface` preference without adding a new settings page.
- [x] Repair broad `AppShell.test.tsx` expectations so existing viewer-focused tests intentionally start in `Model Viewport` while the new default-startup tests intentionally start in `Home Page`.
- [x] Prove the visible toggle updates the persisted startup preference.
- [x] `Home-Page-Gen1-HLG-2`
- [x] `Home-Page-Gen1-CLG-3`

### `Home-Page-1 / Phase 4`

- [x] Add first launch actions into existing workspace owners.
- [x] Include at least `Open Model Viewport`, `Open Browser`, `Open Catalog`, and `Open Console` if those owners are already command-addressable.
- [x] Use existing graph/new-project/recent-layout commands when they exist; otherwise leave those actions visibly deferred in the doc rather than inventing a hidden owner.
- [x] Run focused workspace shell and startup tests plus the normal build gate.
- [x] `Home-Page-Gen1-HLG-1`
- [x] `Home-Page-Gen1-HLG-2`
- [x] `Home-Page-Gen1-CLG-4`

## [x] `Home-Page-1 / Phase 1` - `Surface Registry And Minimal Render`

### Phase 1 Summary

#### Purpose

Make `Home Page` a real workspace surface kind and render the minimum useful surface without changing startup or close behavior yet.

#### Owns

- `Home Page` surface kind
- renderer wiring
- minimal surface component
- focused surface-render proof

#### Does Not Own

- startup preference
- last-viewer-close behavior
- storage transparency
- launch action polish

### Phase 1 Implementation Spec

#### Exact First Code Cut

Add `homePage` as a real workspace surface kind in the same ownership pattern as existing optional workspace surfaces, register it in the surface catalog, and render a minimal `HomePageSurface` through `ViewportSurfaceRegistry`.

Keep this first cut deliberately small: prove that the slot/surface system can represent and render `Home Page` without changing startup, close-last-viewer behavior, or launch actions.

#### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
  - add `homePage` to `WorkspaceSurfaceKind`
  - add `homePage` instance-id creation in `createWorkspaceSurfaceInstanceIdForSlot`
  - allow `homePage` in `workspacePrimarySlotSupportsSurfaceKind`
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - add `homePage` render family and catalog entry
  - decide whether `homePage` is optional and persisted; current read should treat it as an optional persisted workspace surface
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - render the new `HomePageSurface` branch
- `src/app/workspace/HomePageSurface.tsx`
  - create the minimal component if no existing surface file owns this surface
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
  - prove parse/support/instance-id behavior for `homePage`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
  - prove the registry renders the minimal `HomePageSurface`
- optional styling file only if the minimal render needs a scoped class to avoid unstyled broken layout

#### No-Widening Rule

Do not add storage reads, graph persistence, version content, launch actions, zero-viewer return behavior, or startup branching in this phase.

#### Verification Shape

- `workspaceSurfaceCatalog.test.ts` focused proof for catalog registration and instance-id behavior
- `ViewportSurfaceRegistry.test.tsx` focused proof that `homePage` renders through the canonical surface registry
- existing workspace store tests should continue to pass if surface-kind union and primary-slot support are correct

#### Done Shape

`Home Page` can be represented and rendered as a workspace surface, but startup and zero-viewer return still behave as before until later phases.

Guide-Rail closeout read:
- implementation checklist items are complete
- `Home-Page-Gen1-HLG-1` remains open until startup behavior lands
- `Home-Page-Gen1-CLG-1` is complete after surface registration plus Phase 2 zero-viewer root-slot proof

## [x] `Home-Page-1 / Phase 2` - `Zero-Viewer Return`

### Phase 2 Summary

#### Purpose

Make zero open `Model Viewport` surfaces a valid workspace state by returning to `Home Page` instead of preserving a protected final viewer.

#### Owns

- last-model-viewport-close behavior
- fallback root-slot surface decision
- tests for zero-viewer layout

#### Does Not Own

- startup preference
- storage transparency
- viewer runtime changes beyond the close/return seam

### Phase 2 Implementation Spec

#### Exact First Code Cut

Change the protected primary-slot close path so closing the last/root `Model Viewport` transitions the primary slot to `homePage` instead of doing nothing or dissolving the root slot.

Current Dispatch 2 Explorer read points at the AppShell close handler and workspace store slot transition logic rather than a separate route system. The new root-home-page state should be represented as a normal slot/surface transition on the primary slot, not a new route, sentinel viewer, or Home Page-only command tree.

#### Likely Files

- `src/app/hosts/useAppShellViewportActions.ts`
  - update `handleCloseViewportSlotFromMenu`, which currently returns early for `defaultPrimaryViewportSlotId`
  - for the primary/root close case, transition the slot to `homePage` through the normal workspace slot mutation seam
- `src/app/workspace/useWorkspaceStore.ts`
  - inspect `removeViewportSlot`, which currently protects the root slot when no parent split node exists
  - add or reuse a narrow store helper if the primary-slot-to-`homePage` transition should be centralized
  - keep active-viewer resolution honest when no model viewer remains
- `src/app/workspace/workspacePersistence.ts`
  - normalize persisted layouts that include `homePage` or no active model-viewer slot without reviving a hidden model viewer
- `src/app/workspace/workspaceShellTypes.ts`
  - inspect `resolveWorkspaceActiveSurfaceInstanceId` because it currently falls back to the primary slot surface id and may need to tolerate a non-viewer active surface when the root is `homePage`
- `src/app/workspace/useWorkspaceStore.test.ts`
  - prove zero-model-viewport/root-home-page state
  - prove persisted or normalized root-`homePage` layout does not recreate a hidden viewer id if that seam is touched
- `src/app/AppShell.test.tsx`
  - prove user-facing primary-slot close behavior transitions from `Model Viewport` to `Home Page`

#### No-Widening Rule

Do not change model-viewport rendering, camera behavior, geometry runtime, or multi-viewport semantics except where the close path requires it. Do not add startup preference behavior in this phase. Do not modify `HomePageSurface`, surface catalog registration, or registry rendering unless a narrow test repair proves Phase 1 wiring is incorrect.

#### Verification Shape

- focused close-last-viewer test
- store-level zero-viewer/root-home-page state test
- persisted or normalized zero-viewer layout test if that seam exists
- `npm run build`

#### Done Shape

Closing the last `Model Viewport` lands on `Home Page`, and the user can reopen a model viewport through an explicit workspace action.

Guide-Rail closeout read:
- implementation checklist items are complete
- `Home-Page-Gen1-HLG-1` remains open until startup behavior lands
- `Home-Page-Gen1-CLG-2` is complete after the root-close and zero-viewer persistence proof

## [ ] `Home-Page-1 / Phase 3` - `Startup Preference`

### Phase 3 Summary

#### Purpose

Add the user preference that chooses between opening `Home Page` first or opening directly into `Model Viewport`.

#### Owns

- startup preference field
- default startup decision
- launch-time branch
- preference proof

#### Does Not Own

- disabling `Home Page`
- zero-viewer return behavior already owned by Phase 2
- graph persistence storage preference

### Phase 3 Implementation Spec

#### Exact First Code Cut

Add one persisted startup preference such as `workspaceStartupSurface: 'homePage' | 'modelViewer'`, default it to `homePage`, and route fresh startup initialization through either `Home Page` or direct `Model Viewport` without changing later manual surface-opening behavior.

Accepted persisted workspace restore wins over the startup preference. When a saved workspace layout exists and the user accepts the restore prompt, hydrate that layout exactly through the existing restore seam. When there is no saved layout, or when the user declines restore and starts fresh, apply the startup preference before the first workspace layout is written back to storage.

#### Likely Files

- `src/app/store/uiPrefsStore.ts`
  - add the startup preference field, default, and setter
  - keep the field separate from `view` because it is app startup behavior, not viewer presentation
- `src/app/store/uiPrefsPersistence.ts`
  - persist and normalize the startup preference alongside the current view snapshot
  - keep legacy persisted view-only shapes valid
- `src/app/store/useUiPrefsPersistenceBridge.ts`
  - hydrate and rewrite the startup preference together with UI prefs before workspace startup branching
- `src/app/workspace/useWorkspacePersistenceBridge.ts`
  - apply the preference only on fresh startup paths
  - preserve the existing restore prompt and accepted persisted layout behavior
- `src/app/workspace/workspaceShellTypes.ts`
  - add or reuse a narrow default-slot-tree helper only if the startup branch needs to seed `homePage` before persistence writes
- `src/app/workspace/useWorkspaceStore.ts`
  - add a narrow helper only if the bridge needs a clean store-owned way to set the fresh root surface
- `src/app/AppShell.test.tsx`
  - prove no persisted layout defaults to `Home Page`
  - prove preference-off fresh startup lands in `Model Viewport`
  - prove persisted layout restore accepted beats the startup preference
  - prove declined restore starts fresh using the preference
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
  - prove the new preference hydrates, normalizes invalid values to the default, and re-persists with legacy view snapshots

#### No-Widening Rule

Do not add a general settings page, graph persistence, storage toggles, launch actions, Catalog behavior, Environment behavior, or zero-viewer return changes in this phase. Do not change `HomePageSurface` content except for a narrow test hook if the Worker proves it is required. Do not make `Home Page` the owner of workspace persistence; this phase only chooses the fresh-start surface.

#### Verification Shape

- default startup lands on `Home Page`
- preference-off startup lands on `Model Viewport`
- accepted persisted workspace restore beats the startup preference
- declined restore starts fresh and then applies the startup preference
- UI prefs persistence keeps the preference through reload and normalizes legacy/invalid values
- manual `Home Page` opening remains possible
- `npm run build`

#### Done Shape

Startup behavior follows the preference, while `Home Page` remains a real workspace surface in all cases.

Guide-Rail closeout read:
- implementation checklist items are complete
- `Home-Page-Gen1-HLG-1` is complete after startup behavior lands
- `Home-Page-Gen1-HLG-2` is complete after the visible user-facing toggle lands in Phase 3.1
- `Home-Page-Gen1-CLG-3` is complete after the fresh-start preference and restore precedence proof
- `Home-Page-Gen1-CLG-4` is complete after the launch actions landed in Phase 4

## [x] `Home-Page-1 / Phase 3.1` - `Visible Startup Toggle And Test Baseline Repair`

### Phase 3.1 Summary

#### Purpose

Close the visible-toggle gap from `Phase 3` and make the broad AppShell test surface honest after default startup changed to `Home Page`.

#### Owns

- visible startup toggle for `workspaceStartupSurface`
- persisted preference update from the visible control
- broad AppShell test baseline repair for default `Home Page` startup
- `Home-Page-Gen1-HLG-2` closeout read

#### Does Not Own

- launch actions beyond the startup toggle
- general settings page
- Catalog behavior
- Environment behavior
- storage transparency toggles
- graph persistence
- new workspace surface kinds

### Phase 3.1 Implementation Spec

#### Exact First Code Cut

Add a visible toggle on `Home Page` that lets the user choose whether future fresh launches start on `Home Page` or directly in `Model Viewport`, using the existing `workspaceStartupSurface` preference from `Phase 3`.

Repair `AppShell.test.tsx` so tests that are about model-viewer mechanics intentionally set startup to `modelViewer`, while tests that are about the new default startup leave or reset the preference to `homePage`.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
  - expose the visible startup toggle
  - read and set `workspaceStartupSurface` through `useUiPrefsStore`
- `src/app/AppShell.test.tsx`
  - add a test helper or before-each override so legacy viewer-focused tests intentionally start in `Model Viewport`
  - keep the default Home Page startup test honest by resetting the UI prefs store to its initial `homePage` default inside that test
  - add proof that the visible toggle changes the startup preference
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
  - run existing preference persistence proof if the toggle test touches only store state
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
  - optional if the visible toggle is easiest to prove at registry level

#### No-Widening Rule

Do not add launch buttons, storage toggles, environment toggles, Catalog controls, or a general settings surface in this repair phase. Do not change startup persistence semantics from `Phase 3` except to expose the preference through a visible control.

#### Verification Shape

- visible toggle appears on `Home Page`
- toggling it updates `workspaceStartupSurface`
- focused startup tests still pass
- broad `npm.cmd test -- src/app/AppShell.test.tsx` passes or any remaining failures are documented as unrelated pre-existing failures
- `npm run build`

#### Done Shape

The user can see and change the startup preference, `Home-Page-Gen1-HLG-2` can be honestly closed, and the AppShell test suite understands the new default `Home Page` startup behavior.

Guide-Rail closeout read:
- implementation checklist items are complete
- `Home-Page-Gen1-HLG-2` is complete after the visible toggle and persisted preference proof landed
- `Home-Page-Gen1-CLG-3` remains complete from Phase 3 while this slice closed the visible-toggle gap and repaired the broad AppShell baseline
- `Home-Page-1 / Phase 4 - First Launch Actions And Closeout` has shipped and the Home Page launch-actions closeout is complete.

## [x] `Home-Page-1 / Phase 4` - `First Launch Actions And Closeout`

### Phase 4 Summary

#### Purpose

Give the first `Home Page` surface useful launch actions that hand off to existing workspace owners.

#### Owns

- first launch actions
- handoff into existing workspace commands
- final closeout proof for `Home-Page-1`

#### Does Not Own

- storage inventory
- graph save-to-browser preference
- GitHub/docs/version/what's-new orientation
- creating new downstream owners for actions that do not already exist

### Phase 4 Implementation Spec

#### Exact First Code Cut

Add action controls for the existing workspace surfaces and commands that are already available, prioritizing `Model Viewport`, `Browser`, `Catalog`, and `Console`.

Use these existing owner seams:
- `Model Viewport`: call the shell-level viewer activation path already exposed through `handleActivateViewerSurface`.
- `Browser`: call the shell-level browser activation path already exposed through `handleActivateBrowserFloatingWindow`.
- `Catalog`: route through the existing viewport slot surface-kind change path, preferably `handleViewportSlotSurfaceKindChange(slotId, 'catalog')`, so retained instances and viewer re-resolution stay with the workspace owner.
- `Console`: call the existing app surface selector with `setActiveSurface('console')`; do not invent a new console launcher API in this phase.

Graph creation and recent-layout restore stay visibly deferred until a real owned command seam exists instead of introducing a hidden action owner.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
  - owns the first minimal launch controls and receives narrow callbacks
- `src/app/workspace/workspaceSurfaceActions.ts`
  - reuse existing surface restore/split/redock helpers where they fit
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - inspect current spawn/split menu actions before adding any Home Page actions
- `src/app/hosts/useAppShellSurfaceActivation.ts`
  - existing viewer and browser activation callbacks live here
- `src/app/hosts/useAppShellViewportActions.ts`
  - existing slot surface-kind switch callback lives here
- `src/app/AppShell.tsx`
  - wire narrow Home Page action callbacks to existing owner seams
- `src/app/AppShell.test.tsx`
  - prove exposed actions use existing owner commands
- surface styling file if the repo uses per-surface CSS and minimal layout needs scoped styles

#### No-Widening Rule

Do not add storage cards, release-note cards, docs browsing, recent-items ownership, or graph persistence in this phase.

#### Verification Shape

- focused action tests for each command exposed
- one narrow AppShell wiring test for the shell-owned callbacks
- startup and zero-viewer tests from prior phases still pass
- normal build gate

#### Done Shape

`Home-Page-1` is complete when the user can start at `Home Page`, choose direct startup to `Model Viewport`, close the last viewer back to `Home Page`, and launch the first supported workspace surfaces from that landing surface.

Guide-Rail closeout read:
- implementation checklist items are complete
- `Home-Page-Gen1-CLG-4` is complete after the launch actions landed through the existing shell seams
- `Home-Page-1` is complete after the launch buttons, startup preference, and zero-viewer return all landed together
- graph creation and recent-layout restore remain visibly deferred until a future phase owns them
