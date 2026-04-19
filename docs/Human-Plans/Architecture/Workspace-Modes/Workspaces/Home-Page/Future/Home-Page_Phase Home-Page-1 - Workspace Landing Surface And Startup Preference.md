# [ ] `Home-Page-1` - `Workspace Landing Surface And Startup Preference`

## Doc Header

### Doc History
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

- Phase 1 registers and renders the `Home Page` surface.
- Phase 2 makes zero-model-viewport return behavior legal.
- Phase 3 adds the startup preference branch.
- Phase 4 adds first launch actions and closeout proof.

### Coverage Table

| Phase | HLG coverage | CLG coverage | Likely files |
| --- | --- | --- | --- |
| Phase 1 | `Home-Page-Gen1-HLG-1` | `Home-Page-Gen1-CLG-1` | `workspaceShellTypes.ts`, `workspaceSurfaceCatalog.ts`, `ViewportSurfaceRegistry.tsx`, new `HomePageSurface.tsx`, `workspaceSurfaceCatalog.test.ts`, `ViewportSurfaceRegistry.test.tsx` |
| Phase 2 | `Home-Page-Gen1-HLG-1` | `Home-Page-Gen1-CLG-2` | `useWorkspaceStore.ts`, `workspacePersistence.ts`, `useAppShellViewportActions.ts`, `useWorkspaceStore.test.ts`, `AppShell.test.tsx` |
| Phase 3 | `Home-Page-Gen1-HLG-1`, `Home-Page-Gen1-HLG-2` | `Home-Page-Gen1-CLG-3` | UI preference store/persistence bridge after live seam confirmation, workspace startup initialization, `AppShell.test.tsx` |
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
- Phase 4 adds first launch actions and closeout proof

Important rule:
- do not mix the phases together just because they all touch the shell
- do not add storage cards, persistence toggles, GitHub/docs links, version content, or what's-new content in this family phase
- do not make `Home Page` a route-only screen outside the workspace surface model

## Wishlist Organization

### High Level Goals

- [ ] `Home-Page-Gen1-HLG-1. Home Page should be the first surface the user loads into.`
- [ ] `Home-Page-Gen1-HLG-2. There should be a toggle so the user can switch off Home Page first and load directly into Model Viewport.`

### Codex Level Goals

- [ ] Home-Page-Gen1-CLG-1. Define `Home Page` as a first-class workspace surface that can occupy the root slot without requiring a live `Model Viewport`.
- [ ] Home-Page-Gen1-CLG-2. Replace the protected-last-viewer assumption with an explicit zero-viewer return path to `Home Page`.
- [ ] Home-Page-Gen1-CLG-3. Add a startup preference that changes only first-launch behavior and does not disable the `Home Page` surface.
- [ ] Home-Page-Gen1-CLG-4. Provide launch and resume actions that hand off to existing workspace owners instead of duplicating Browser, Catalog, graph, or viewer ownership.

### `Home-Page-1 / Phase 1`

- [ ] Inspect the current workspace surface type and render map.
- [ ] Add `Home Page` as a real surface kind.
- [ ] Render the first minimal `HomePageSurface`.
- [ ] Keep the first surface free of storage and release-note content.
- [ ] `Home-Page-Gen1-HLG-1`
- [ ] `Home-Page-Gen1-CLG-1`

### `Home-Page-1 / Phase 2`

- [ ] Inspect the protected-last-model-viewport behavior.
- [ ] Replace the forced-surviving-viewer path with an explicit return to `Home Page`.
- [ ] Keep reopening `Model Viewport` available through a normal workspace command.
- [ ] Prove zero-model-viewport layout state in tests.
- [ ] `Home-Page-Gen1-HLG-1`
- [ ] `Home-Page-Gen1-CLG-2`

### `Home-Page-1 / Phase 3`

- [ ] Add a `show Home Page first on startup` or equivalent startup preference.
- [ ] Default the preference to showing `Home Page` first.
- [ ] Route app launch through `Home Page` or direct `Model Viewport` based on the preference.
- [ ] Keep manual `Home Page` opening possible regardless of preference.
- [ ] `Home-Page-Gen1-HLG-1`
- [ ] `Home-Page-Gen1-HLG-2`
- [ ] `Home-Page-Gen1-CLG-3`

### `Home-Page-1 / Phase 4`

- [ ] Add first launch actions into existing workspace owners.
- [ ] Include at least `Open Model Viewport`, `Open Browser`, `Open Catalog`, and `Open Console` if those owners are already command-addressable.
- [ ] Use existing graph/new-project/recent-layout commands when they exist; otherwise leave those actions visibly deferred in the doc rather than inventing a hidden owner.
- [ ] Run focused workspace shell and startup tests plus the normal build gate.
- [ ] `Home-Page-Gen1-HLG-1`
- [ ] `Home-Page-Gen1-HLG-2`
- [ ] `Home-Page-Gen1-CLG-4`

## [ ] `Home-Page-1 / Phase 1` - `Surface Registry And Minimal Render`

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

## [ ] `Home-Page-1 / Phase 2` - `Zero-Viewer Return`

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

Find the guard that prevents closing the primary/root model viewer or dissolving the last model-viewer slot, then route that state transition into a `homePage` root surface while preserving normal commands for reopening a model viewport.

Current source read points at the AppShell close handler and workspace store slot transition logic rather than a separate route system.

#### Likely Files

- `src/app/hosts/useAppShellViewportActions.ts`
  - inspect `handleCloseViewportSlotFromMenu`, which currently ignores the primary slot
- `src/app/workspace/useWorkspaceStore.ts`
  - update slot transition behavior if the root slot needs to become `homePage`
  - keep active-viewer resolution honest when no model viewer remains
- `src/app/workspace/workspacePersistence.ts`
  - normalize persisted layouts that include `homePage` or no active model-viewer slot
- `src/app/workspace/useWorkspaceStore.test.ts`
  - prove zero-model-viewport/root-home-page state
- `src/app/AppShell.test.tsx`
  - prove user-facing close-last-viewer behavior if the close path is AppShell-owned

#### No-Widening Rule

Do not change model-viewport rendering, camera behavior, geometry runtime, or multi-viewport semantics except where the close path requires it. Do not add startup preference behavior in this phase.

#### Verification Shape

- focused close-last-viewer test
- store-level zero-viewer/root-home-page state test
- persisted or normalized zero-viewer layout test if that seam exists

#### Done Shape

Closing the last `Model Viewport` lands on `Home Page`, and the user can reopen a model viewport through an explicit workspace action.

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

Add one preference such as `show Home Page first on startup`, default it to true, and route startup initialization through either `Home Page` or direct `Model Viewport` without changing later manual surface-opening behavior.

#### Likely Files

- UI preference store or workspace preference seam after live inspection
- UI preference persistence bridge if startup preferences are persisted there
- `src/app/workspace/workspaceShellTypes.ts` if the default slot tree needs a startup-surface option
- `src/app/workspace/useWorkspaceStore.ts` if initial workspace state is store-owned
- `src/app/AppShell.tsx` if startup branching is shell-owned after hydration/restore
- startup preference tests in the existing UI preference or AppShell test surface

#### No-Widening Rule

Do not add a general settings page, graph persistence, storage toggles, or zero-viewer return changes in this phase.

#### Verification Shape

- default startup lands on `Home Page`
- preference-off startup lands on `Model Viewport`
- manual `Home Page` opening remains possible

#### Done Shape

Startup behavior follows the preference, while `Home Page` remains a real workspace surface in all cases.

## [ ] `Home-Page-1 / Phase 4` - `First Launch Actions And Closeout`

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

Add action controls for the existing workspace surfaces and commands that are already available, prioritizing `Model Viewport`, `Browser`, `Catalog`, and `Console`. If graph creation or recent-layout restore already has a clean command seam, expose it here; otherwise leave it for a later phase instead of inventing a hidden action owner.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
  - owns the first minimal launch actions
- `src/app/workspace/workspaceSurfaceActions.ts`
  - reuse existing surface restore/split/redock helpers where they fit
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - inspect current spawn/split menu actions before adding any Home Page actions
- `src/app/AppShell.tsx`
  - wire Home Page action callbacks only if the action owner lives at shell level
- `src/app/AppShell.test.tsx`
  - prove exposed actions use existing owner commands
- surface styling file if the repo uses per-surface CSS and minimal layout needs scoped styles

#### No-Widening Rule

Do not add storage cards, release-note cards, docs browsing, recent-items ownership, or graph persistence in this phase.

#### Verification Shape

- focused action tests for each command exposed
- startup and zero-viewer tests from prior phases still pass
- normal build gate

#### Done Shape

`Home-Page-1` is complete when the user can start at `Home Page`, choose direct startup to `Model Viewport`, close the last viewer back to `Home Page`, and launch the first supported workspace surfaces from that landing surface.
