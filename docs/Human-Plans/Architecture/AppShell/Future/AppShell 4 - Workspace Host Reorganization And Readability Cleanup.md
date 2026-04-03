# AppShell 4 - Workspace Host Reorganization And Readability Cleanup

## Doc Header

### Doc History
12. 2026-04-03 19:24: Marked `Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup` as shipped after the new `src/app/hosts/useAppShellWorkspaceMenus.tsx` seam landed and the focused AppShell, ConsoleDock, staged-navigation, and `tsconfig` no-emit verification passed, closing the optional final menu-cleanup lane and leaving `AppShell 4` fully shipped through the remaining workspace-menu cluster extraction
11. 2026-04-03 19:13: Tightened `Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup` into an implementation-ready optional slice by re-reading the live post-Phase-5 menu band still inline in `src/app/AppShell.tsx`, locking the exact viewport-spawn, left-dock-resize, floating-split-submenu, and workspace-split-menu seams, the hook contract, sequencing, and the keep-it-optional rule for the last AppShell 4 cleanup pass
10. 2026-04-03 19:10: Marked `Phase 5 - Extract Viewport Tree Composition` as shipped after the new `src/app/workspace/WorkspaceViewportTree.tsx` seam landed and the focused AppShell, ConsoleDock, staged-navigation, and `tsconfig` no-emit verification passed, leaving only the optional `Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup` lane open if the remaining shell-adjacent menu glue still deserves its own seam later
9. 2026-04-03 18:56: Marked `Phase 4 - Extract Console Transition Host` as shipped after the new `src/app/hosts/useAppShellConsoleTransition.ts` seam landed and the focused AppShell, ConsoleDock, staged-navigation, and `tsconfig` no-emit verification passed, then tightened `Phase 5 - Extract Viewport Tree Composition` into an implementation-ready slice by re-reading the live post-Phase-4 render and composition band still inline in `src/app/AppShell.tsx`, locking the exact recursive tree seams, prop contract, sequencing, and exclusions for the next AppShell 4 code pass
8. 2026-04-03 18:41: Marked `Phase 3 - Extract Viewport Slot Action Host` as shipped after the new `src/app/hosts/useAppShellViewportActions.ts` seam landed and the focused AppShell, ConsoleDock, staged-navigation, and `tsconfig` no-emit verification passed, then tightened `Phase 4 - Extract Console Transition Host` into an implementation-ready slice by re-reading the live post-Phase-3 console drag-out and split-preview subsystem still inline in `src/app/AppShell.tsx`, locking the exact state, helper, callback, render-adjacent, contract, sequencing, and exclusion boundaries for the next AppShell 4 code pass
7. 2026-04-03 18:27: Marked `Phase 2 - Extract Surface Activation And Console Handoff` as shipped after the new `src/app/hosts/useAppShellSurfaceActivation.ts` seam landed and the focused shell plus console suites and a `tsconfig` no-emit check passed, then tightened `Phase 3 - Extract Viewport Slot Action Host` into an implementation-ready slice by re-reading the live post-Phase-2 slot-action band in `src/app/AppShell.tsx`, locking the exact callback and helper targets, the generic-versus-console header-drag boundary, the hook contract, sequencing, and exclusions for the next AppShell 4 code pass
6. 2026-04-03 18:14: Marked `Phase 1 - Extract Workspace Shell Selectors` as shipped after the new `src/app/hosts/useAppShellWorkspaceSelectors.ts` seam landed and the focused shell plus console suites passed, then tightened `Phase 2 - Extract Surface Activation And Console Handoff` into an implementation-ready slice by re-reading the live activation, handoff, and surface-clear band in `src/app/AppShell.tsx`, locking the exact target callbacks, effect callers, hook contract, sequencing, and exclusions for the next AppShell 4 code pass
5. 2026-04-03 17:54: Tightened `Phase 1 - Extract Workspace Shell Selectors` again after a second live read of the current selector band in `src/app/AppShell.tsx`, locking the exact in-scope derived reads, the nearby-but-still-local boundary around split defaults, dock-preview booleans, detached-viewer layout effects, and the browser-slot suppression ref effect, plus a clearer grouped hook contract and execution order for the first AppShell 4 code pass
4. 2026-04-03 17:49: Tightened `Phase 1 - Extract Workspace Shell Selectors` into an implementation-ready slice after re-reading the live derived-state band in `src/app/AppShell.tsx`, locking the first selector extraction around the active-editor slot, spaghetti visibility summaries, split-menu target summaries, slot counts, detached-surface summaries, root-left split detection, and primary-slot constraint reads while explicitly excluding mutating slot handlers, console transition logic, and viewport-tree rendering from the first AppShell 4 code pass
3. 2026-04-03 17:45: Converted the post-`Phase 0` planning notes in this doc into an explicit future-phase ladder, replacing the older generic first-cut and suggested-order prose with concrete `Phase 1` through `Phase 6` sections so later AppShell cleanup can execute against named scoped slices instead of re-deriving the next extraction order from the audit notes each time
2. 2026-04-03 17:43: Reworked this future AppShell phase into a research-first organization lane by adding an explicit `Phase 0 - Responsibility Audit And Future Phase Setup` section after a fresh live read of `src/app/AppShell.tsx`, renaming the doc to the simpler `AppShell 4` reference form, and tightening the traced responsibility bands so later AppShell phases can branch from one shared shell-audit baseline instead of jumping straight into extraction guesses
1. 2026-04-03 17:39: Created this standalone future AppShell phase doc as the new non-numbered post-`5.0F` organization lane, translating the current `Workspace 7.x` shell overload into an implementation-ready readability and ownership cleanup focused on splitting `AppShell.tsx` into clearer workspace selectors, surface-action handlers, and viewport-tree composition seams without pretending it belongs to the older legacy phase-number ladder

### Purpose

This doc defines the next AppShell cleanup lane after the shipped `5.0F` bridge work.

Use it to answer:
- what the current `AppShell` overload really is now
- which parts of `AppShell.tsx` should be reorganized first for readability and ownership
- which extraction seams improve Codex and human navigation without changing workspace behavior
- how to keep this cleanup as a refactor and organization pass instead of a hidden feature phase

### Why This Phase Exists

The shipped `5.0F-1` and `5.0F-2` work removed the older runtime-host and browser-editor controller overload from `AppShell`.

That cleanup was real.

But the later `Workspace 7.x` family widened `AppShell.tsx` again from a different direction.

The current problem is no longer mainly:
- inline radio runtime ownership
- browser dock host ownership
- spaghetti window host ownership

The current problem is that `AppShell.tsx` has become the main integration bucket for:
- workspace-slot derived state
- workspace surface activation and console handoff glue
- viewport slot action handlers
- console float-to-split transition logic
- recursive viewport-tree render composition

This phase exists to give that newer overload one honest planning surface without forcing it into the older numbered bridge ladder.

### Scope

This phase covers:
- the research-first shell audit needed before future extraction phases are locked
- reorganizing `src/app/AppShell.tsx` into clearer internal seams
- extracting hook or helper ownership where the behavior already belongs together
- reducing the amount of workspace-mode policy that must be rediscovered from one giant shell file
- preserving current behavior while improving readability and maintenance boundaries

This phase does not cover:
- new workspace behavior
- new viewport capabilities
- visual redesign
- store-contract redesign just to shorten files
- a new legacy AppShell roadmap number

## Doc Body

## [x] AppShell 4 - Workspace Host Reorganization And Readability Cleanup

### Header

Purpose:
- reorganize the current workspace-host layer in `AppShell.tsx` so the shell reads like a composition root plus a few explicit owner seams instead of one large mixed workspace host

Owns:
- post-`5.0F` AppShell readability cleanup
- extraction boundaries for workspace selectors, surface actions, console transition handling, and viewport-tree composition
- behavior-preserving refactor sequencing

Keeps in `AppShell`:
- top-level app composition
- mounting of major workspace surfaces and shell overlays
- narrow app-level coordination that still genuinely belongs at the shell root

## [x] Phase 0 - Responsibility Audit And Future Phase Setup

### Header

Purpose:
- trace the current `AppShell.tsx` responsibility bands from the real code before future AppShell extraction phases are locked

Current read:
- the file is currently about `2.9k` lines
- it is not one uniform problem; it is a stack of several distinct responsibility clusters living in one shell body
- the biggest risk in future cleanup is starting with extraction guesses instead of a shared audit baseline

### Traced Responsibility Bands

#### Band 1. Local helper functions and detached-viewer support

Strongest visible seams:
- `DetachedViewerPopoutWindow(...)`
- `collectLeafSlotIdsFromLayoutNode(...)`
- `findParentSplitNodeIdForLayoutNode(...)`
- `clampConsoleTransitionFloatingRect(...)`
- `clampDetachedViewerFloatingRect(...)`

Read:
- these are mostly shell-adjacent helpers
- they are not the main readability problem by themselves
- they matter because later phases should avoid mixing them into unrelated workspace extraction hooks unless the ownership is truly shared

#### Band 2. Derived shell selectors and summary reads

Strongest visible seams:
- `activeEditorSlot`
- spaghetti surface visibility summaries
- split-menu target derivation
- browser and console slot counts
- detached-surface summaries
- `rootLeftSplitSlotIds`
- `primaryViewportSlotIsConstrained`

Read:
- this is one of the best first extraction targets
- it is mostly read-only logic
- today it is buried among mutation handlers and render composition, which makes the shell hard to scan

#### Band 3. Surface activation and console handoff glue

Strongest visible seams:
- `activateSpaghettiWorkspaceContext(...)`
- `handleActivateSpaghettiFloatingWindow(...)`
- `handleActivateSpaghettiSurface(...)`
- `handleActivateViewerSurface(...)`
- browser floating activation and surface-clear helpers

Read:
- this is another coherent band
- it owns deliberate surface activation plus workspace-selection and console-context publishing
- it should likely become one dedicated activation hook rather than staying inline in the compositor

#### Band 4. Spawn menu and shell menu coordination

Strongest visible seams:
- `viewportSpawnMenu`
- spawn-position resolution
- spawn action handlers
- floating split submenu open or close coordination
- outside-click and menu-lifecycle effects

Read:
- this band is real, but probably secondary
- it should not be the first future phase unless the first cleanup still leaves `AppShell` hard to read

#### Band 5. Floating-surface and split-menu handlers

Strongest visible seams:
- floating split menu openers
- split commit handlers
- split ratio reset
- split priority changes
- floating or slot close flows

Read:
- this band is broader than one menu
- it overlaps with viewport actions and should probably stay near that future phase instead of becoming its own premature extraction

#### Band 6. Viewport slot action family

Strongest visible seams:
- `handleViewportSlotSplit(...)`
- `handleViewportSlotSurfaceKindChange(...)`
- `handleViewportSlotFloat(...)`
- `handleViewportSlotHeaderDragOut(...)`
- `handleViewportSlotPopOut(...)`
- primary left-dock split toggle and related slot retargeting

Read:
- this is the clearest mutating workspace-action band in the file
- it is probably the highest-value future extraction after the read-only selectors and activation glue
- this band should stay grouped by slot behavior rather than being scattered across tiny files

#### Band 7. Console transition host logic

Strongest visible seams:
- console transition viewport bounds resolution
- console split-preview resolution
- console transition split commit
- drag cleanup
- split ghost style calculation
- console slot-header drag-out transition flow

Read:
- this is a dedicated subsystem hiding inside `AppShell`
- it has unusual pointer and preview behavior that deserves its own host seam
- it should stay separate from generic viewport actions in future cleanup

#### Band 8. Viewport tree composition

Strongest visible seams:
- `renderViewportSlot(...)`
- `renderViewportLayoutNode(...)`
- recursive split-layout rendering
- `viewerSurface`
- spawn menu portal and main shell render tree

Read:
- this is the main composition band
- it is hard to understand while action and activation logic still live above it
- this wants a dedicated workspace composition component once the first logic extractions are settled

### Locked Conclusions From Phase 0

- the first future AppShell phases should not start with generic utility extraction
- read-only selectors are the safest first seam
- surface activation and console handoff are the next strongest seam
- viewport slot actions and console transition logic are separate enough that they should not be forced into one hook
- recursive viewport-tree composition should likely become a dedicated component, but only after the heavier logic bands are pulled upward into named seams
- spawn-menu cleanup is real, but it is not one of the first two highest-value phases

### Recommended Future Phase Order

1. `Phase 1 - Extract Workspace Shell Selectors`
2. `Phase 2 - Extract Surface Activation And Console Handoff`
3. `Phase 3 - Extract Viewport Slot Action Host`
4. `Phase 4 - Extract Console Transition Host`
5. `Phase 5 - Extract Viewport Tree Composition`
6. optional later phase only if still needed:
   `Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup`

### Done Shape For Phase 0

- one shared live code read exists for `AppShell.tsx`
- future AppShell phases can cite this audit instead of reopening the same shell scan
- the next extraction order is grounded in real responsibility bands instead of intuition

## [x] Phase 1 - Extract Workspace Shell Selectors

### Header

Purpose:
- move the read-only derived workspace shell summaries out of the main `AppShell` body so the compositor stops mixing state derivation with mutation handlers and render composition

Current read:
- the strongest first-cut selector band currently lives across the derived-state cluster around `activeEditorSlot`, spaghetti visibility summaries, split-menu target summaries, slot counts, detached-surface summaries, `rootLeftSplitSlotIds`, and `primaryViewportSlotIsConstrained`
- this band is already mostly read-only and does not need a store redesign
- this makes it the safest first extraction because it should reduce scan cost without reopening runtime behavior

Current live Phase 1 seams:
- `src/app/AppShell.tsx`
  - `activeEditorSlot`
  - `hasVisibleSpaghettiInAppShell`
  - `hasSlottedSpaghettiSurface`
  - `hasDetachedSpaghettiSurface`
  - `hasPopoutSpaghettiSurface`
  - `hasFocusableSpaghettiSurface`
  - `workspaceSplitMenuTargetSurfaceInstanceId`
  - `workspaceSplitMenuTargetEditorViewportId`
  - `workspaceSplitMenuTargetEditorViewport`
  - `workspaceSplitMenuTargetEditorSurface`
  - `workspaceSplitMenuTargetEditorSlot`
  - `workspaceSplitMenuTargetSplitPriority`
  - `browserSlotCount`
  - `consoleSlotCount`
  - `activeDetachedBrowserSurface`
  - `activeDetachedConsoleSurface`
  - `workspaceSplitMenuTargetSurfaceKind`
  - `detachedViewerFloatingSurfaces`
  - `detachedViewerPopoutSurfaces`
  - `rootLeftSplitSlotIds`
  - `suppressLegacyDockedBrowserSurface`
  - `suppressLegacyDockedConsoleSurface`
  - `primaryViewportSlotIsConstrained`

Nearby-but-still-local reads for later phases:
- `editorViewportSplitViewSignature`
- `splitRatio`
- `splitPriority`
- `isBrowserDockPreviewActive`
- `isMeatballDockPreviewActive`
- `getDefaultDetachedViewerFloatingRect(...)`
- `setDetachedViewerFloatingRect(...)`
- the detached-viewer floating-rect effects
- the `browserSlotCountRef` and runtime-projected Browser suppression effect

Read:
- the in-scope list is the real first selector band and should move together
- the nearby local values above may stay beside the effects or handlers that still own them
- `detachedViewerFloatingSurfaces` and `detachedViewerPopoutSurfaces` should move as read-only summaries even though the floating-rect effects that consume them stay local in `AppShell`

### Locked Direction

- keep Phase 1 strictly read-only
- extract grouped shell summaries, not one-selector-per-file noise
- let `AppShell.tsx` consume one named selector hook and keep its existing mutation handlers for later phases
- do not mix activation, slot actions, console transition logic, or viewport rendering into this first cut
- keep effect ownership in `AppShell` when the effect itself is not part of the selector seam yet

Locked Phase 1 in-scope:
- the derived reads listed under `Current live Phase 1 seams`
- the minimum selector-local fallback math needed for split-menu target summaries
- grouped selector return values for spaghetti visibility, split-menu targeting, detached-surface summaries, Browser or Console suppression summaries, and layout-constraint summaries

Locked Phase 1 out-of-scope:
- `editorViewportSplitViewSignature`
- `splitRatio` or `splitPriority` if they are still being used as direct local defaults outside the grouped selector seam
- Browser or Meatball dock-preview booleans
- detached-viewer floating-rect creation, drag, and cleanup effects
- the runtime-projected Browser suppression state effect driven by `browserSlotCountRef`
- any mutating slot, activation, console-transition, spawn-menu, or render-tree logic

Strongest target seams:
- `activeEditorSlot`
- `hasVisibleSpaghettiInAppShell`
- `hasSlottedSpaghettiSurface`
- `hasDetachedSpaghettiSurface`
- `hasPopoutSpaghettiSurface`
- `hasFocusableSpaghettiSurface`
- `workspaceSplitMenuTargetSurfaceInstanceId`
- `workspaceSplitMenuTargetEditorViewportId`
- `workspaceSplitMenuTargetEditorViewport`
- `workspaceSplitMenuTargetEditorSurface`
- `workspaceSplitMenuTargetEditorSlot`
- `workspaceSplitMenuTargetSplitPriority`
- `browserSlotCount`
- `consoleSlotCount`
- `activeDetachedBrowserSurface`
- `activeDetachedConsoleSurface`
- `workspaceSplitMenuTargetSurfaceKind`
- `detachedViewerFloatingSurfaces`
- `detachedViewerPopoutSurfaces`
- `rootLeftSplitSlotIds`
- `suppressLegacyDockedBrowserSurface`
- `suppressLegacyDockedConsoleSurface`
- `primaryViewportSlotIsConstrained`

Preferred landing shape:
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`

Rules:
- keep the seam read-only
- do not move mutating slot behavior into this phase
- prefer returning grouped derived values instead of many tiny selectors
- prefer one object argument plus one grouped return object so the first hook stays easy to repoint and later expand

Explicit exclusions:
- `handleViewportSlotSplit(...)`
- `handleViewportSlotSurfaceKindChange(...)`
- `handleViewportSlotFloat(...)`
- `handleViewportSlotHeaderDragOut(...)`
- `handleViewportSlotPopOut(...)`
- `activateSpaghettiWorkspaceContext(...)`
- console transition preview or commit logic
- `renderViewportSlot(...)`
- `renderViewportLayoutNode(...)`

Preferred hook contract:
- input shape should be one object passed from `AppShell`
- minimum first-cut inputs:
  - `activeEditorViewport`
  - `activeEditorViewportId`
  - `activeEditorSurface`
  - `viewportSlotsById`
  - `viewportLayoutNodesById`
  - `viewportSlotRootNodeId`
  - `editorViewportsById`
  - `editorSurfacePlacementById`
  - `detachedSlotSurfaceById`
  - `workspaceSplitMenu`
  - `isLeftDockViewportSplit`
  - `browserToolbarOwnerSurfaceInstanceId`
  - `suppressRuntimeProjectedDockedBrowserSurface`
- grouped return shape should stay domain-named, for example:
  - `spaghetti`
  - `splitMenuTarget`
  - `slotCounts`
  - `detachedSurfaces`
  - `dockSuppression`
  - `layout`
- the first hook should not take refs, setter callbacks, or DOM nodes
- the first hook should not publish side effects

Implementation spec:
1. Create `src/app/hosts/useAppShellWorkspaceSelectors.ts`.
2. Move only the in-scope derived workspace summaries into that hook.
3. Keep `editorViewportSplitViewSignature`, split defaults, dock-preview booleans, detached-viewer floating-rect helpers or effects, and the `browserSlotCountRef` effect local in `AppShell`.
4. Pass the minimum live inputs needed from `AppShell` into the hook:
   - workspace slot and layout maps
   - active editor and active editor surface inputs
   - detached-surface maps
   - editor viewport maps
   - workspace split-menu state
   - left-dock split truth
   - browser toolbar owner input
   - runtime-projected dock suppression flag
5. Return grouped selector output instead of many separate hook calls.
6. Repoint `AppShell.tsx` to consume the grouped selector output while leaving the surrounding effects and handlers in place.
7. Keep all behavior-identical downstream mutation handlers untouched for this phase.

Expected grouped output shape should cover:
- spaghetti visibility and focusability summaries
- split-menu target summaries
- slot-count summaries
- detached Browser and Console surface summaries
- browser and console suppression summaries
- detached viewer surface summaries
- root-left split and primary-slot constraint summaries

Phase 1 execution order:
1. Extract the active-editor slot and spaghetti visibility summaries first.
2. Extract the floating split-menu target summary family as one grouped band.
3. Extract Browser or Console slot counts plus detached-surface summaries.
4. Extract root-left split and primary-slot constraint summaries.
5. Repoint `AppShell.tsx` to the grouped hook output.
6. Confirm the adjacent detached-viewer and Browser suppression effects still read the same values without moving into the hook.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellWorkspaceSelectors.ts`

### Phase 1 Checklist

- [x] create `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- [x] move the in-scope read-only selector band into that hook
- [x] keep nearby effect-owned values local in `AppShell.tsx`
- [x] repoint the shell to one grouped selector return object
- [x] confirm no mutating handlers or render-tree code moved with the selector pass

Verification:
- run `src/app/AppShell.test.tsx`
- run any focused workspace or console suite that fails due to changed selector wiring
- confirm the detached-viewer floating-window effects still behave the same after the selector repoint
- confirm the Browser toolbar suppression effect still behaves the same when `browserSlotCount` changes
- re-read the `AppShell.tsx` body and confirm the derived-state cluster is materially smaller while behavior logic remains in place for later phases

Done shape:
- the middle derived-state cluster is no longer inline in `AppShell.tsx`
- the shell can read its workspace summaries from one named seam
- the first AppShell 4 code phase lands without changing runtime behavior

Shipped read:
- `src/app/hosts/useAppShellWorkspaceSelectors.ts` now owns the grouped read-only selector band for AppShell workspace summaries.
- `src/app/AppShell.tsx` now consumes that grouped selector seam while keeping split defaults, dock-preview booleans, detached-viewer floating effects, and the Browser suppression ref effect local.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`

## [x] Phase 2 - Extract Surface Activation And Console Handoff

### Header

Purpose:
- move deliberate surface activation and workspace-selection or console-handoff publishing into one explicit shell activation seam

Current read:
- the next strongest post-Phase-1 band is the activation cluster that still resolves which shell surface is active, which editor or viewer should become current, when workspace selection should be updated, and what console handoff or clear message should be published
- this band is smaller than the later viewport-action family, but it is still spread across direct callbacks plus a few shell effects
- tightening it now should make the middle shell band read more like activation wiring and less like mixed shell glue

Current live Phase 2 seams:
- `src/app/AppShell.tsx`
  - `activateSpaghettiWorkspaceContext(...)`
  - `handleActivateSpaghettiFloatingWindow(...)`
  - `handleActivateSpaghettiSurface(...)`
  - `handleActivateViewerSurface(...)`
  - `handleActivateBrowserFloatingWindow(...)`
  - `requestAppShellSurfaceClear(...)`
  - the `floatingShellActivationRequest` effect
  - the `lost-spaghetti-visibility` clear effect
  - the browser floating-shell reset effect that clears stale floating-shell highlight when Browser is no longer floating or popped out
  - the global outside-click effect that clears Browser or Spaghetti shell focus

Nearby-but-still-local reads for later phases:
- `handleOpenViewportSpawnMenu(...)`
- `handleSpawnViewportSpaghettiEditor(...)`
- `handleSpawnViewportBrowser(...)`
- viewport spawn menu search state and portal rendering
- slot split, float, popout, close, and type-switch handlers
- console transition preview and drag cleanup state
- viewport-tree render callbacks and JSX composition

Read:
- the activation callbacks and clear effects form one real owner seam because they all decide active shell truth plus console publication side effects
- the spawn menu can stay local for now even though it calls viewer or browser or spaghetti activation helpers
- this phase should keep the signatures of the existing activation callbacks as stable as possible so the shell repoint stays narrow

Strongest target seams:
- `activateSpaghettiWorkspaceContext(...)`
- `handleActivateSpaghettiFloatingWindow(...)`
- `handleActivateSpaghettiSurface(...)`
- `handleActivateViewerSurface(...)`
- `handleActivateBrowserFloatingWindow(...)`
- `requestAppShellSurfaceClear(...)`
- the `floatingShellActivationRequest` effect and the activation-related clear effects

Preferred landing shape:
- `src/app/hosts/useAppShellSurfaceActivation.ts`

Rules:
- keep this phase focused on activation intent and handoff publication
- do not mix viewport-tree rendering or split-pointer mechanics into the hook
- let the hook own effectful activation logic; unlike Phase 1, this seam is not meant to stay pure

Locked Phase 2 in-scope:
- explicit surface activation callbacks for spaghetti, viewer, and floating Browser surfaces
- active-shell truth updates tied to those callbacks
- workspace selection updates and console workspace-context handoff publication
- shell surface-clear publication and the activation-related clear effects that depend on it
- the `floatingShellActivationRequest` effect that replays external activation intent into current shell truth

Locked Phase 2 out-of-scope:
- viewport spawn menu state, filtering, positioning, and portal render logic
- slot split, float, popout, close, or type-switch mutation handlers
- detached-viewer floating-window layout effects
- persistence hydration or serialization effects
- console transition preview or commit logic
- recursive viewport rendering and slot-frame composition

Preferred hook contract:
- input shape should be one object passed from `AppShell`
- minimum first-cut inputs:
  - `setActiveEditorViewportId`
  - `setActiveFloatingShell`
  - `setActiveSurface`
  - `setViewportSpawnMenu`
  - `setActiveViewerViewportId`
  - `setWorkspaceSelectedTarget`
  - `requestConsoleContextSync`
  - `requestConsoleWorkspaceContextHandoff`
  - `floatingShellActivationRequest`
  - `hasVisibleSpaghettiInAppShell`
  - `hasFocusableSpaghettiSurface`
  - `isBrowserFloating`
  - `isBrowserPoppedOut`
  - `workspaceActiveSurface`
  - `sketchPlanePickSession`
- it is acceptable for the hook to keep using `useAppStore.getState()` and `useSpaghettiStore.getState()` internally where the current activation path already depends on live store snapshots
- grouped return shape should cover:
  - spaghetti activation callbacks
  - viewer activation callback
  - Browser floating activation callback
  - shell surface-clear helper
- the hook should not take DOM refs or viewport-menu positioning inputs

Implementation spec:
1. Create `src/app/hosts/useAppShellSurfaceActivation.ts`.
2. Move `activateSpaghettiWorkspaceContext(...)` and its two public spaghetti wrapper callbacks into that hook.
3. Move `handleActivateViewerSurface(...)`, `handleActivateBrowserFloatingWindow(...)`, and `requestAppShellSurfaceClear(...)` into the hook.
4. Move the `floatingShellActivationRequest`, `lost-spaghetti-visibility`, Browser floating-shell reset, and global outside-click effects into the hook if they still read as part of the same activation or clear band after the callback extraction.
5. Keep viewport spawn menu creation and spawn-position logic local in `AppShell`, but repoint those handlers to call the returned activation callbacks.
6. Repoint `AppShell.tsx` and the mounted host props to consume the returned activation seam.
7. Keep slot mutations, console transition logic, and render composition untouched for later phases.

Expected hook output shape should cover:
- spaghetti activation callbacks for floating and non-floating surfaces
- viewer activation callback
- Browser floating activation callback
- shell surface-clear helper

Phase 2 execution order:
1. Move `activateSpaghettiWorkspaceContext(...)` and its wrapper callbacks first.
2. Move viewer activation and shell surface-clear publication next.
3. Move Browser floating activation plus the external floating-shell activation effect.
4. Fold the activation-related clear effects into the same hook if they still only depend on activation-band inputs.
5. Repoint spawn-menu handlers and host props to the returned callbacks without moving the spawn menu itself.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellSurfaceActivation.ts`

### Phase 2 Checklist

- [x] create `src/app/hosts/useAppShellSurfaceActivation.ts`
- [x] move the activation and console-handoff callback band into that hook
- [x] keep spawn-menu state and viewport-action mutations out of the hook
- [x] repoint `AppShell.tsx` and host props to the returned activation callbacks
- [x] confirm the activation-related clear effects still behave the same after the repoint

Done shape:
- `AppShell.tsx` no longer owns the full activation and handoff cluster inline
- workspace selection and console sync rules have one clearer owner seam

Verification:
- run `src/app/AppShell.test.tsx`
- run `src/app/console/ConsoleDock.test.tsx`
- run any focused shell or workspace suite that fails due to activation callback rewiring
- manually re-read the middle shell band and confirm activation plus clear logic is materially reduced without pulling spawn-menu or viewport-action work forward

Shipped read:
- `src/app/hosts/useAppShellSurfaceActivation.ts` now owns the explicit AppShell activation and shell-surface-clear band for spaghetti, viewer, and floating Browser surfaces.
- `src/app/AppShell.tsx` now consumes that activation seam while keeping viewport spawn-menu state, slot mutations, console transition mechanics, and render composition local for later phases.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `npx tsc -p tsconfig.json --noEmit`

## [x] Phase 3 - Extract Viewport Slot Action Host

### Header

Purpose:
- move the mutating viewport-slot action family out of the shell body while keeping slot behavior grouped in one place and keeping console transition ownership separate

Current read:
- after the shipped selector and activation passes, the next dominant inline band is the slot-action cluster around close, split, surface-kind switch, float, popout, browser or spaghetti drag-out setup, and primary left-dock split retargeting
- this band is now the clearest mutating workspace seam still living directly in `AppShell.tsx`
- the main risk is letting the console drag-out transition math get absorbed into the same host even though that subsystem already has its own later phase

Current live Phase 3 seams:
- `src/app/AppShell.tsx`
  - `handleCloseViewportSlotFromMenu(...)`
  - `createDuplicatedEditorSurfaceInstanceId(...)`
  - `resolveEditorSurfaceInstanceIdForSlotSwitch(...)`
  - `handleViewportSlotSplit(...)`
  - `handleViewportSlotSurfaceKindChange(...)`
  - `handleViewportSlotFloat(...)`
  - `handleViewportSlotHeaderDragOut(...)`
  - `handleViewportSlotPopOut(...)`
  - `handleTogglePrimaryLeftDockSlotSplit(...)`

Nearby-but-still-local reads for later phases:
- `resolveConsoleTransitionViewportBounds(...)`
- `resolveConsoleTransitionSplitDockPreview(...)`
- `commitConsoleTransitionWorkspaceSplit(...)`
- `stopConsoleTransitionDrag(...)`
- `consoleTransitionSplitDockGhostStyle`
- the console-specific branch inside `handleViewportSlotHeaderDragOut(...)` that owns floating-rect clamping, split-preview updates, pointer listeners, and split commit
- floating split-menu openers or close flows
- viewport spawn menu state and rendering
- `renderViewportSlot(...)`
- `renderViewportLayoutNode(...)`

Read:
- the close, split, type-switch, float, popout, and primary-left-dock retargeting callbacks form one real owner seam because they are all slot mutations or direct slot-host consequences
- `createDuplicatedEditorSurfaceInstanceId(...)` and `resolveEditorSurfaceInstanceIdForSlotSwitch(...)` should move with this phase because they are helper ownership for the slot-action family rather than general shell utilities
- `handleViewportSlotHeaderDragOut(...)` should not move as one opaque block; the browser and spaghetti drag-out setup belongs with the slot-action host, while the console transition branch should stay delegated to the later console-transition phase

Strongest target seams:
- `handleCloseViewportSlotFromMenu(...)`
- `createDuplicatedEditorSurfaceInstanceId(...)`
- `resolveEditorSurfaceInstanceIdForSlotSwitch(...)`
- `handleViewportSlotSplit(...)`
- `handleViewportSlotSurfaceKindChange(...)`
- `handleViewportSlotFloat(...)`
- `handleViewportSlotPopOut(...)`
- `handleTogglePrimaryLeftDockSlotSplit(...)`
- the browser or spaghetti portions of `handleViewportSlotHeaderDragOut(...)` plus a delegated console handoff path

Preferred landing shape:
- `src/app/hosts/useAppShellViewportActions.ts`

Rules:
- keep slot behavior grouped by domain
- avoid scattering one action per helper file
- preserve current workspace behavior exactly
- do not absorb console transition preview or pointer-cleanup mechanics into this hook
- prefer keeping the returned callback names close to the existing shell callbacks so the repoint stays narrow

Locked Phase 3 in-scope:
- slot close flows including spaghetti close cleanup, Browser split teardown, and Console dock reset side effects
- slot split actions including Browser side-ratio preference, model-viewer camera pose replay, and console activity logging
- slot surface-kind changes including spaghetti-editor reuse or duplicate fallback and protected-primary handling
- slot float actions including Browser floating-shell setup, model-viewer detach-to-floating behavior, and generic slot float routing
- slot popout actions including the primary model-viewer copy path, Browser popout activation, and generic popout routing
- primary left-dock split toggle behavior including reuse of existing left-side Browser surfaces or detached Browser restore paths
- the browser or spaghetti header-drag-out setup path if it is extracted through a dispatcher that leaves the console transition branch delegated outside this hook

Locked Phase 3 out-of-scope:
- console transition viewport-bounds resolution
- console floating-rect clamp, drag, split-preview, ghost-style, or split-commit logic
- shell surface activation and console-handoff publication already moved in `Phase 2`
- viewport spawn menu state, filtering, positioning, and portal rendering
- detached-viewer floating-window layout effects
- persistence hydration or serialization effects
- recursive viewport rendering and slot-frame composition

Preferred hook contract:
- input shape should be one object passed from `AppShell`
- minimum first-cut inputs:
  - `appShellRef`
  - `activeEditorViewport`
  - `activeDetachedBrowserSurface`
  - `browserSlotCount`
  - `editorSurfaceBindingById`
  - `editorSurfacePlacementById`
  - `editorViewportsById`
  - `isBrowserViewportSplit`
  - `isLeftDockViewportSplit`
  - `primaryViewportId`
  - `rootLeftSplitSlotIds`
  - `viewportSlotsById`
  - `setActiveSurface`
  - `setActiveViewerViewportId`
  - `setBrowserFloatingPosition`
  - `setBrowserFloatingSize`
  - `setBrowserSlotHeaderDragSeed`
  - `setSpaghettiSlotHeaderDragSeed`
  - `setBrowserViewportSplitRatio`
  - `setIsBrowserPoppedOut`
  - `setIsBrowserViewportSplit`
  - `setIsLeftDockViewportSplit`
  - `setLeftDockResizeMenu`
  - `closeEditorViewport`
  - `createDetachedViewportSurfaceCopy`
  - `detachViewportSlotSurface`
  - `floatWorkspaceSurface`
  - `popoutWorkspaceSurface`
  - `removeViewportSlot`
  - `restoreDetachedSurfaceByKind`
  - `setViewportSlotSurfaceKind`
  - `splitViewportSlot`
  - one delegated console callback, for example `onStartConsoleSlotHeaderDragOut(...)`, if `handleViewportSlotHeaderDragOut(...)` is repointed in this phase
- it is acceptable for the hook to keep using `useWorkspaceStore.getState()`, `useSpaghettiStore.getState()`, `useConsoleStore.getState()`, and viewer-bridge helpers internally where the current slot-action path already depends on live post-mutation reads
- grouped return shape should cover:
  - slot close callback
  - slot split callback
  - slot surface-kind change callback
  - slot float callback
  - slot header-drag-out callback or dispatcher
  - slot popout callback
  - primary left-dock split toggle callback
- the hook should not take console split-preview refs or ghost-style state because those belong to `Phase 4`

Implementation spec:
1. Create `src/app/hosts/useAppShellViewportActions.ts`.
2. Move `createDuplicatedEditorSurfaceInstanceId(...)` and `resolveEditorSurfaceInstanceIdForSlotSwitch(...)` into that hook with the slot-action family they support.
3. Move `handleCloseViewportSlotFromMenu(...)`, `handleViewportSlotSplit(...)`, `handleViewportSlotSurfaceKindChange(...)`, `handleViewportSlotFloat(...)`, `handleViewportSlotPopOut(...)`, and `handleTogglePrimaryLeftDockSlotSplit(...)` into the hook.
4. If `handleViewportSlotHeaderDragOut(...)` still reads as part of the same action family after extraction, move only the browser or spaghetti dispatcher ownership into the hook and keep the console transition branch delegated through a passed callback.
5. Repoint `renderViewportSlot(...)`, left-dock controls, and any mounted host props in `AppShell.tsx` to consume the returned action callbacks.
6. Keep console transition helpers, preview state, cleanup refs, and split-ghost rendering local in `AppShell` for `Phase 4`.
7. Keep viewport-tree composition and spawn-menu rendering untouched for later phases.

Expected hook output shape should cover:
- close, split, surface-kind change, float, popout, and left-dock split toggle callbacks
- the browser or spaghetti header-drag-out setup callback if that dispatcher moves now
- no console transition preview state, ghost style, or pointer-cleanup refs

Phase 3 execution order:
1. Move the editor duplication or reuse helpers first so later slot actions can stay self-contained.
2. Move close, split, and surface-kind change callbacks next.
3. Move float and popout callbacks after that.
4. Move primary left-dock split toggle behavior once the generic slot actions are already grouped.
5. Repoint the viewport-frame action props and left-dock toggle usage to the returned hook callbacks.
6. Only fold in the browser or spaghetti header-drag-out dispatcher if the console branch can stay clearly delegated outside the hook.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellViewportActions.ts`

### Phase 3 Checklist

- [x] create `src/app/hosts/useAppShellViewportActions.ts`
- [x] move the slot-action callback band and its editor-surface helper ownership into that hook
- [x] keep console transition preview and pointer-cleanup mechanics out of the hook
- [x] repoint `AppShell.tsx` render callbacks and left-dock controls to the returned slot-action callbacks
- [x] confirm the slot-action and left-dock retargeting behavior still match the pre-extraction shell

Done shape:
- split, float, popout, close, left-dock retargeting, and slot type-switch actions no longer dominate the AppShell body
- the next console-transition pass can target a smaller dedicated subsystem without re-opening generic slot mutations
- future workspace changes can target one slot-action seam instead of reopening the shell

Verification:
- run `src/app/AppShell.test.tsx`
- run `src/app/console/ConsoleDock.test.tsx`
- run `src/app/console/stagedNavigation.workspaceModes.test.ts`
- run any focused workspace or host suite that fails due to slot-action rewiring
- manually re-read the shell band and confirm the remaining inline console transition logic is materially more isolated from the generic slot-action family

Shipped read:
- `src/app/hosts/useAppShellViewportActions.ts` now owns the generic viewport-slot action family for close, split, surface-kind switch, float, popout, left-dock retargeting, and the browser or spaghetti header-drag dispatch path.
- `src/app/AppShell.tsx` now delegates that slot-action seam while keeping the console drag-out transition branch, preview state, cleanup refs, and split-ghost rendering local for the next phase.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/stagedNavigation.workspaceModes.test.ts`
  - `npx tsc -p tsconfig.json --noEmit`

## [x] Phase 4 - Extract Console Transition Host

### Header

Purpose:
- separate the console-specific drag-out, floating, split-preview, and split-commit subsystem from generic slot actions

Current read:
- after the shipped selector, activation, and slot-action passes, the most coherent remaining inline subsystem is now the console drag-out band that seeds the floating rect, resolves split previews, owns pointer listeners and cleanup refs, commits the transition split, and renders the split ghost
- this is now materially isolated from the generic slot-action family because `useAppShellViewportActions.ts` already delegates the console header-drag branch back into `AppShell`
- the main risk in this phase is splitting the console transition state, refs, and cleanup lifecycle across too many places instead of moving them as one host seam

Current live Phase 4 seams:
- `src/app/AppShell.tsx`
  - `clampConsoleTransitionFloatingRect(...)`
  - `consoleTransitionSplitDockPreview`
  - `isConsoleTransitionDragActive`
  - `consoleTransitionSplitDockPreviewRef`
  - `consoleTransitionDragCleanupRef`
  - `resolveConsoleTransitionViewportBounds(...)`
  - `resolveConsoleTransitionSplitDockPreview(...)`
  - `commitConsoleTransitionWorkspaceSplit(...)`
  - `stopConsoleTransitionDrag(...)`
  - the cleanup `useEffect(...)` that stops an in-flight console transition drag on unmount
  - `consoleTransitionSplitDockGhostStyle`
  - `handleConsoleViewportSlotHeaderDragOut(...)`
  - the split-ghost portal render near the bottom shell JSX

Nearby-but-still-local reads for later phases:
- `findParentSplitNodeIdForLayoutNode(...)`
- `clampDetachedViewerFloatingRect(...)`
- detached-viewer floating-window drag or layout state
- viewport spawn menu state and rendering
- `renderViewportSlot(...)`
- `renderViewportLayoutNode(...)`
- top-level shell composition and the final portal mounting for render-only consumers outside the console transition seam

Read:
- the preview state, cleanup refs, bounds math, preview resolution, split commit, ghost-style calculation, and console header-drag callback form one real host seam because they all exist only to support the same console float-to-split transition lifecycle
- `clampConsoleTransitionFloatingRect(...)` should move with this phase because it is console-specific transition math rather than a general shell helper
- the final ghost JSX may stay mounted from `AppShell.tsx` if Phase 4 returns render-ready preview state and style, but the ownership of when that ghost exists should move into the new console-transition host
- `useAppShellViewportActions.ts` should keep receiving one delegated `onStartConsoleViewportSlotHeaderDragOut(...)` callback from this phase rather than re-absorbing transition logic

Strongest target seams:
- `clampConsoleTransitionFloatingRect(...)`
- `consoleTransitionSplitDockPreview`
- `isConsoleTransitionDragActive`
- `consoleTransitionSplitDockPreviewRef`
- `consoleTransitionDragCleanupRef`
- `resolveConsoleTransitionViewportBounds(...)`
- `resolveConsoleTransitionSplitDockPreview(...)`
- `commitConsoleTransitionWorkspaceSplit(...)`
- `stopConsoleTransitionDrag(...)`
- the cleanup `useEffect(...)`
- `consoleTransitionSplitDockGhostStyle`
- `handleConsoleViewportSlotHeaderDragOut(...)`

Preferred landing shape:
- `src/app/hosts/useAppShellConsoleTransition.ts`

Rules:
- keep this subsystem separate from generic viewport actions
- keep pointer-preview logic together instead of splitting math from ownership
- preserve the current console drag-out behavior exactly, including the seeded floating rect, live split-preview updates, protected pointer-id checks, and unmount cleanup
- do not absorb recursive viewport rendering, floating split-menu behavior, or detached-viewer logic into this hook

Locked Phase 4 in-scope:
- console transition preview state and drag-active state
- console transition cleanup refs and cleanup helper ownership
- console floating-rect clamp math and viewport-bounds resolution
- split-preview resolution and split-commit helpers for the console transition path
- the cleanup effect that stops an active console drag on unmount
- the console slot-header drag-out callback that seeds floating mode, attaches pointer listeners, updates the preview, and commits the split on release
- returning the preview state and derived ghost style needed by `AppShell.tsx` to keep rendering the split ghost without owning the subsystem logic itself

Locked Phase 4 out-of-scope:
- generic slot close, split, float, popout, or surface-kind actions already moved in `Phase 3`
- spaghetti or Browser header-drag setup already moved behind `useAppShellViewportActions.ts`
- viewport spawn menu state, filtering, positioning, and portal rendering
- detached-viewer floating-window drag or popout logic
- persistence hydration or serialization effects
- recursive viewport rendering and slot-frame composition beyond consuming the returned console transition state

Preferred hook contract:
- input shape should be one object passed from `AppShell`
- minimum first-cut inputs:
  - `appShellRef`
  - `viewportRef`
  - `viewportSlotsById`
  - `floatWorkspaceSurface`
  - `setConsoleFloatingRect`
- it is acceptable for the hook to keep using `useConsoleStore.getState()` internally and to import `commitWorkspaceSurfaceRootSplit(...)`, `commitWorkspaceSurfaceSlotSplit(...)`, and `resolveWorkspaceSplitDockPreview(...)` directly where the current transition path already depends on those shared runtime helpers
- grouped return shape should cover:
  - `isConsoleTransitionDragActive`
  - `consoleTransitionSplitDockPreview`
  - `consoleTransitionSplitDockGhostStyle`
  - `handleConsoleViewportSlotHeaderDragOut(...)`
- the hook should own the cleanup refs and unmount cleanup effect internally instead of passing raw pointer-cleanup refs back to `AppShell`

Implementation spec:
1. Create `src/app/hosts/useAppShellConsoleTransition.ts`.
2. Move `clampConsoleTransitionFloatingRect(...)` into that host file with the console transition seam it supports.
3. Move `consoleTransitionSplitDockPreview`, `isConsoleTransitionDragActive`, `consoleTransitionSplitDockPreviewRef`, and `consoleTransitionDragCleanupRef` into the hook.
4. Move `resolveConsoleTransitionViewportBounds(...)`, `resolveConsoleTransitionSplitDockPreview(...)`, `commitConsoleTransitionWorkspaceSplit(...)`, and `stopConsoleTransitionDrag(...)` into the hook.
5. Move the cleanup `useEffect(...)` and `handleConsoleViewportSlotHeaderDragOut(...)` into the hook.
6. Return the preview state, ghost style, drag-active truth, and console header-drag callback to `AppShell.tsx`.
7. Repoint `useAppShellViewportActions.ts` usage in `AppShell.tsx` so its delegated console header-drag callback comes from the new hook.
8. Keep the split-ghost JSX render local in `AppShell.tsx` unless the final hook extraction makes a tiny render helper obviously cleaner without crossing into Phase 5 composition work.

Expected hook output shape should cover:
- the console header-drag-out callback used by `useAppShellViewportActions.ts`
- the drag-active truth used to suppress docked header-seed replay
- the split-preview value and the derived ghost style used by the portal render
- no generic slot-action callbacks and no viewport-tree render functions

Phase 4 execution order:
1. Move the preview state, drag-active state, and cleanup refs first.
2. Move the bounds, preview, split-commit, and stop helpers next.
3. Move the console header-drag callback and unmount cleanup effect into the hook.
4. Return the preview state, ghost style, and drag-active truth to `AppShell.tsx`.
5. Repoint the delegated console header-drag callback passed into `useAppShellViewportActions.ts`.
6. Re-read the remaining AppShell body and confirm the inline console-transition subsystem is gone while the ghost render still mounts cleanly from returned state.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellConsoleTransition.ts`

### Phase 4 Checklist

- [x] create `src/app/hosts/useAppShellConsoleTransition.ts`
- [x] move the console transition state, cleanup refs, and helper band into that hook
- [x] keep the generic viewport-slot action seam in `useAppShellViewportActions.ts` and feed it the returned console header-drag callback
- [x] repoint `AppShell.tsx` to consume returned preview state, drag-active truth, and ghost style from the hook
- [x] confirm console drag-out, split-preview, split commit, and unmount cleanup behavior still match the pre-extraction shell

Done shape:
- console float-to-split behavior has one named host seam
- `AppShell.tsx` no longer hides the console drag-out and split-preview subsystem inline
- the later viewport-tree composition phase can consume a cleaner shell body without reopening console pointer logic

Verification:
- run `src/app/AppShell.test.tsx`
- run `src/app/console/ConsoleDock.test.tsx`
- run `src/app/console/stagedNavigation.workspaceModes.test.ts`
- run any focused shell or workspace suite that fails due to console transition rewiring
- manually re-read the shell band and confirm the remaining AppShell inline logic no longer owns the console drag-out lifecycle directly

Shipped read:
- `src/app/hosts/useAppShellConsoleTransition.ts` now owns the console drag-out, split-preview, cleanup, split-commit, and ghost-style subsystem behind one named host seam.
- `src/app/AppShell.tsx` now consumes that hook for the delegated console header-drag callback, drag-active truth, preview state, and ghost style while keeping the split-ghost portal render local to avoid widening into viewport-tree composition too early.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/stagedNavigation.workspaceModes.test.ts`
  - `npx tsc -p tsconfig.json --noEmit`

## [x] Phase 5 - Extract Viewport Tree Composition

### Header

Purpose:
- move recursive viewport rendering into a dedicated workspace composition component after the heavier logic bands have clearer homes

Current read:
- after the shipped selector, activation, slot-action, and console-transition passes, the dominant remaining inline `AppShell.tsx` band is now the viewport render tree itself rather than another mixed logic subsystem
- the recursive `renderViewportSlot(...)` and `renderViewportLayoutNode(...)` pair now reads mostly as composition, but it still hides a lot of slot-frame wiring, primary-left-dock embedding, registry branching, and split-layout JSX inside the shell body
- the main risk in this phase is re-homing mutating workspace logic into a new component instead of letting the new tree stay render-focused and consume the already-extracted action or activation seams through props

Current live Phase 5 seams:
- `src/app/AppShell.tsx`
  - `renderViewportSlot(...)`
  - `renderViewportLayoutNode(...)`
  - recursive `ViewportSplitLayout` rendering
  - `ViewportFrame` wiring for split, float, popout, close, drag-out, and surface-kind callbacks
  - the `modelViewer` versus `ViewportSurfaceRegistry` branch inside slot rendering
  - primary `PrimaryViewportLeftDock` embedding inside the primary model-viewer slot path
  - `viewerSurface`
  - the `viewerSurface` handoff into `SpaghettiWindowHost`

Nearby-but-still-local reads for later phases:
- `handleViewportLayoutDividerPointerDown(...)`
- viewport spawn-menu state, filtering, positioning, and portal rendering
- detached-viewer floating-window drag or layout state
- detached-viewer floating and popout window rendering
- shell-level composition below `return (...)` that mounts `SpaghettiWindowHost`, `ConsoleDock`, Browser hosts, overlays, and portal-only consumers outside the viewport tree

Read:
- `renderViewportSlot(...)`, `renderViewportLayoutNode(...)`, and `viewerSurface` form one real composition seam because they exist to build one recursive workspace viewport tree from the current slot and layout maps
- `ViewportFrame`, `ViewportWorkspaceHost`, `ViewportSurfaceRegistry`, and `PrimaryViewportLeftDock` should move with that tree because they are part of how a slot renders, not separate owner seams
- `handleViewportLayoutDividerPointerDown(...)` may stay owned by `AppShell` and be threaded into the tree as a callback because the mutating divider-resize behavior is still action logic, not render-tree ownership
- the viewport spawn menu and detached-viewer window surfaces should stay local for now so Phase 5 does not widen into every remaining viewport-adjacent portal or floating surface in one pass

Preferred landing shape:
- `src/app/workspace/WorkspaceViewportTree.tsx`

Rules:
- keep this component mostly compositional
- avoid moving heavy mutation logic back into the render tree component
- pass activation, slot-action, left-dock, and divider callbacks in as props instead of re-deriving those seams inside the component
- keep viewport spawn-menu portals, detached-viewer floating or popout windows, and top-level shell composition out of this phase unless a tiny render-only prop move is obviously required

Locked Phase 5 in-scope:
- the recursive viewport tree from `viewportSlotRootNodeId` down through leaf-slot rendering
- `renderViewportSlot(...)` and `renderViewportLayoutNode(...)`
- recursive split-layout JSX and slot-frame wiring
- the `modelViewer` versus `ViewportSurfaceRegistry` slot-render branch
- primary `PrimaryViewportLeftDock` embedding inside the primary model-viewer slot path
- `viewerSurface` creation and the handoff of that renderable tree back to `AppShell`

Locked Phase 5 out-of-scope:
- viewport spawn-menu state, search input, item filtering, and portal rendering
- detached-viewer floating-window drag or layout state
- detached-viewer floating and popout window rendering
- selector ownership already moved in `Phase 1`
- activation ownership already moved in `Phase 2`
- generic slot-action ownership already moved in `Phase 3`
- console drag-out preview, ghost-style, and cleanup ownership already moved in `Phase 4`
- persistence hydration or serialization effects
- top-level shell composition outside the viewport tree

Strongest target seams:
- `renderViewportSlot(...)`
- `renderViewportLayoutNode(...)`
- recursive split-layout rendering
- `ViewportFrame` wiring
- `ViewportWorkspaceHost` and `ViewportSurfaceRegistry` slot branching
- primary `PrimaryViewportLeftDock` embedding
- `viewerSurface`

Preferred component contract:
- prefer one props object passed from `AppShell`
- minimum first-cut props:
  - `viewportSlotRootNodeId`
  - `viewportSlotsById`
  - `viewportLayoutNodesById`
  - `leftDockWidth`
  - `isLeftDockViewportSplit`
  - `primaryViewportSlotIsConstrained`
  - `isBrowserDockPreviewActive`
  - `isMeatballDockPreviewActive`
  - `browserPresentationMode`
  - `isBrowserCollapsed`
  - `windowSettingsOpenByViewportId`
  - `dockedBrowserHostRef`
  - `dockedMeatballHostRef`
  - `onActivateSpaghettiSurface`
  - `onActivateViewerSurface`
  - `onOpenViewportSpawnMenu`
  - `onCycleBrowserPresentationMode`
  - `onRequestViewportSlotSurfaceKind`
  - `onSplitViewportSlot`
  - `onFloatViewportSlot`
  - `onPopOutViewportSlot`
  - `onCloseViewportSlot`
  - `onViewportSlotHeaderDragOut`
  - `onViewportLayoutDividerPointerDown`
  - `onLeftDockResizeStart`
  - `onLeftDockResizeContextMenu`
  - `onLeftDockSplitTogglePointerDown`
  - `onLeftDockSplitToggleClick`
- the component should return one renderable viewport tree value rather than owning shell-level portals or detached floating surfaces
- the component should not read stores directly if `AppShell` already has the resolved values needed for tree composition

Implementation spec:
1. Create `src/app/workspace/WorkspaceViewportTree.tsx`.
2. Move `renderViewportSlot(...)` into that component first with its `ViewportFrame`, `ViewportWorkspaceHost`, `ViewportSurfaceRegistry`, and primary-left-dock render wiring.
3. Move `renderViewportLayoutNode(...)` and the recursive `ViewportSplitLayout` JSX next.
4. Replace the inline `viewerSurface` derivation in `AppShell.tsx` with one `WorkspaceViewportTree` render value.
5. Keep viewport action, activation, divider-resize, left-dock, and console-transition ownership in `AppShell.tsx` or the already-extracted hooks, and thread those callbacks into the component through props.
6. Leave viewport spawn-menu portals, detached-viewer floating or popout windows, and the rest of the shell return tree local in `AppShell.tsx`.
7. Re-read the bottom of `AppShell.tsx` and confirm the remaining shell body now reads primarily as top-level surface composition.

Expected component output shape should cover:
- one renderable `viewerSurface` tree rooted at `viewportSlotRootNodeId`
- no selector derivation, no generic slot-action ownership, and no console transition preview state
- no viewport spawn-menu portal and no detached-viewer floating-window ownership

Phase 5 execution order:
1. Extract the leaf-slot render path with its frame and registry or viewer-host branching first.
2. Extract the recursive split-layout render path next.
3. Thread the existing activation, slot-action, divider, and left-dock callbacks through the new component props.
4. Repoint `AppShell.tsx` to use the new `WorkspaceViewportTree` output for `viewerSurface`.
5. Confirm the remaining bottom shell band is mostly top-level composition plus the still-local spawn-menu and detached-viewer surfaces.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/workspace/WorkspaceViewportTree.tsx`

### Phase 5 Checklist

- [x] create `src/app/workspace/WorkspaceViewportTree.tsx`
- [x] move the recursive viewport tree render band into that component
- [x] keep slot-action, activation, divider-resize, and console-transition ownership outside the component and pass them through props
- [x] repoint `AppShell.tsx` so `viewerSurface` comes from the new viewport-tree component
- [x] confirm viewport-tree rendering and primary-left-dock behavior still match the pre-extraction shell

Done shape:
- the bottom of `AppShell.tsx` reads mostly as top-level composition
- recursive viewport layout no longer competes with logic-heavy shell handlers for attention
- viewport-tree changes can target one dedicated component instead of reopening the shell body

Verification:
- run `src/app/AppShell.test.tsx`
- run `src/app/console/ConsoleDock.test.tsx`
- run `src/app/console/stagedNavigation.workspaceModes.test.ts`
- run any focused workspace or host suite that fails due to viewport-tree rewiring
- manually re-read the remaining shell band and confirm viewport spawn-menu or detached-viewer surfaces are still local while the recursive viewport tree is no longer inline

Shipped read:
- `src/app/workspace/WorkspaceViewportTree.tsx` now owns the recursive viewport-tree composition seam, including slot-frame wiring, split-layout rendering, registry or viewer-host branching, and primary left-dock embedding.
- `src/app/AppShell.tsx` now consumes that component as `viewerSurface` while keeping divider-resize ownership, viewport spawn-menu portals, detached-viewer window rendering, and the rest of the shell-level composition local.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/stagedNavigation.workspaceModes.test.ts`
  - `npx tsc -p tsconfig.json --noEmit`

## [x] Phase 6 - Spawn Menu And Minor Shell Menu Coordination Cleanup

### Header

Purpose:
- clean up the remaining spawn-menu and small shell-menu coordination band only if the earlier phases still leave the shell harder to read than it should be

Current read:
- after the shipped selector, activation, slot-action, console-transition, and viewport-tree passes, the remaining inline shell-adjacent logic is now mostly the menu cluster rather than another large runtime subsystem
- that cluster is broader than only the viewport spawn popup; it also includes the left-dock resize menu, the workspace split-menu surface, the floating split submenu hover or lock state, and the small position or open or close helpers that feed those menus
- this phase should stay optional because the shell may already read honestly enough, but if one final cleanup is still worthwhile this is now the cleanest remaining inline band

Current live Phase 6 seams:
- `src/app/AppShell.tsx`
  - `viewportSpawnMenuRef`
  - `viewportSpawnMenuInputRef`
  - `viewportSpawnMenu`
  - `isFloatingSplitSubmenuHovered`
  - `isFloatingSplitSubmenuLocked`
  - the `useEffect(...)` that focuses and dismisses `viewportSpawnMenu`
  - `handleOpenViewportSpawnMenu(...)`
  - `resolveViewportSpawnPosition(...)`
  - `handleSpawnViewportSpaghettiEditor(...)`
  - `handleSpawnViewportBrowser(...)`
  - `viewportSpawnMenuItems`
  - the `useEffect(...)` that clears floating split submenu hover or lock state when `workspaceSplitMenu` leaves `floating-titlebar`
  - `handleFloatingSplitSubmenuMouseEnter(...)`
  - `handleFloatingSplitSubmenuMouseLeave(...)`
  - `handleToggleFloatingSplitSubmenu(...)`
  - `handleFloatingSplitMenu(...)`
  - `handleCommitFloatingSurfaceSplit(...)`
  - `handleSelectFloatingSurfaceSplitDockSide(...)`
  - `handleResetSplitRatio(...)`
  - `handleSetSplitPriority(...)`
  - `handleCloseSplitFromMenu(...)`
  - `handleCloseSurfaceFromFloatingMenu(...)`
  - `leftDockResizeMenuStyle`
  - `workspaceSplitMenuStyle`
  - `viewportSpawnMenuSurface`
  - the left-dock resize menu JSX
  - the workspace split-menu JSX

Nearby-but-still-local reads if this phase lands:
- `useAppShellDockController` ownership for left-dock pointer resizing, preview state, and menu openers
- viewport divider-resize ownership
- detached-viewer floating or popout window rendering
- top-level shell composition around Browser, Console, Spaghetti, and Radio hosts
- selector summaries that already belong to `useAppShellWorkspaceSelectors.ts`

Read:
- the viewport spawn menu and the two shell menu surfaces are coupled by one pattern: open or close state, light filtering or hover state, compact action helpers, and small render surfaces that still live inline in `AppShell.tsx`
- this is not worth another extraction unless the remaining menu cluster still materially distracts from the shell read after Phase 5
- if it does still feel noisy, the cleanup should move the state, action helpers, and render-ready menu data together instead of splitting menu math from menu JSX into tiny fragments

Strongest target seams:
- `viewportSpawnMenu`
- spawn-position resolution
- spawn action helpers
- floating split submenu hover or lock coordination
- `leftDockResizeMenuStyle`
- `workspaceSplitMenuStyle`
- `viewportSpawnMenuSurface`
- left-dock resize menu JSX
- workspace split-menu JSX

Preferred landing shape:
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`

Rules:
- keep this phase optional
- do not force a final extraction if the shell already reads honestly after Phases 1 through 5
- keep left-dock pointer-resize ownership in `useAppShellDockController`
- prefer one menu-focused host seam that returns render-ready menu state and callbacks instead of many tiny helpers
- do not re-absorb selector, activation, viewport-action, console-transition, or viewport-tree ownership into this final pass

Locked Phase 6 in-scope:
- viewport spawn-menu open-state coordination, input focus or dismiss effect, spawn-position resolution, search filtering, action items, and portal render ownership
- floating split submenu hover or lock state and the small reset effect tied to `workspaceSplitMenu`
- floating-surface split-menu action helpers and divider-scope split-menu action helpers
- left-dock resize menu and workspace split-menu style derivation
- left-dock resize menu and workspace split-menu render surfaces

Locked Phase 6 out-of-scope:
- left-dock resize pointer handling and preview ownership in `useAppShellDockController`
- viewport divider-resize ownership
- detached-viewer floating-window drag or render ownership
- Browser dock host behavior
- Spaghetti window host behavior
- selector ownership already moved in `Phase 1`
- activation ownership already moved in `Phase 2`
- viewport action ownership already moved in `Phase 3`
- console transition ownership already moved in `Phase 4`
- viewport-tree composition ownership already moved in `Phase 5`

Preferred hook contract:
- input shape should be one object passed from `AppShell`
- minimum first-cut inputs:
  - `viewportRef`
  - `viewportSpawnMenu`
  - `workspaceSplitMenu`
  - `leftDockResizeMenu`
  - `activeDetachedConsoleSurface`
  - `activeGraphDocumentId`
  - `graphDocumentOrder`
  - `editorViewportsById`
  - `splitRatio`
  - `viewportLayoutNodesById`
  - `workspaceSplitMenuTargetSurfaceInstanceId`
  - `workspaceSplitMenuTargetEditorViewport`
  - `workspaceSplitMenuTargetEditorSurface`
  - `workspaceSplitMenuTargetEditorSlot`
  - `workspaceSplitMenuTargetSplitPriority`
  - `workspaceSplitMenuTargetSurfaceKind`
  - `resolveViewerTargetSlotId`
  - `handleActivateViewerSurface`
  - `handleActivateSpaghettiSurface`
  - `handleActivateBrowserFloatingWindow`
  - `openGraphDocumentInNewViewport`
  - `setEditorViewportPosition`
  - `setEditorViewportSplitDirection`
  - `setEditorViewportSplitPriority`
  - `setEditorViewportSplitRatio`
  - `setEditorViewportWindowMode`
  - `setViewportLayoutSplitRatio`
  - `setViewportSpawnMenu`
  - `setWorkspaceSplitMenu`
  - `setIsBrowserPoppedOut`
  - `setIsBrowserViewportSplit`
  - `setBrowserFloating`
  - `setBrowserFloatingPosition`
  - `setBrowserFloatingSize`
  - `closeEditorViewport`
  - `removeViewportSlot`
  - `splitWorkspaceSurfaceToSide`
  - it is acceptable for the hook to keep using `useConsoleStore.getState()` internally where the current close path already depends on that shared runtime seam
- grouped return shape should cover:
  - `handleOpenViewportSpawnMenu(...)`
  - `viewportSpawnMenuSurface`
  - `leftDockResizeMenuStyle`
  - `workspaceSplitMenuStyle`
  - `isFloatingSplitSubmenuOpen`
  - `handleFloatingSplitMenu(...)`
  - the split-menu action callbacks
  - any tiny render-ready booleans or item lists needed by `AppShell.tsx`
- the hook may own the menu refs and the small focus or dismiss effects internally if that reduces shell noise cleanly

Implementation spec:
1. Create `src/app/hosts/useAppShellWorkspaceMenus.tsx`.
2. Move the viewport spawn-menu refs, focus or dismiss effect, spawn-position resolver, spawn action helpers, filtered item list, and portal render ownership into that hook, while keeping the shared open state in `AppShell.tsx` if the existing activation-clear seam still needs that setter.
3. Move the floating split submenu hover or lock state, reset effect, and submenu handlers into the hook.
4. Move the floating-surface split-menu and divider-scope split-menu action helpers into the hook.
5. Move the left-dock resize menu and workspace split-menu style derivation into the hook.
6. Return the menu render surfaces, styles, and action callbacks to `AppShell.tsx`.
7. Keep `useAppShellDockController`, detached-viewer surfaces, and top-level shell composition local.
8. Re-read the shell and skip this phase entirely if the extracted result is not meaningfully clearer than the inline version.

Expected hook output shape should cover:
- viewport spawn-menu opener and portal render output
- workspace split-menu opener and action callbacks
- left-dock resize menu and workspace split-menu style objects or render-ready surfaces
- compatibility with keeping shared `viewportSpawnMenu` state in `AppShell.tsx` if another extracted seam still clears it
- no viewport tree, no console transition preview state, and no detached-viewer drag ownership

Phase 6 execution order:
1. Move the viewport spawn-menu portal path and related action helpers first, keeping shared open state in `AppShell.tsx` if activation clearing still depends on it.
2. Move the floating split submenu hover or lock state and reset effect next.
3. Move the floating-surface and divider-scope split-menu action helpers after that.
4. Repoint the remaining menu surfaces in `AppShell.tsx` to the returned hook output.
5. Re-read the final shell and confirm the extraction actually improves readability; if not, prefer skipping this optional phase.

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellWorkspaceMenus.tsx`

### Phase 6 Checklist

- [x] create `src/app/hosts/useAppShellWorkspaceMenus.tsx`
- [x] move the viewport spawn-menu action helpers and portal render ownership into that hook while keeping the shared open state compatible with the existing activation-clear seam
- [x] move the floating split submenu state plus workspace split-menu action helpers into that hook
- [x] keep dock-controller pointer ownership, detached-viewer surfaces, and top-level shell composition outside the hook
- [x] confirm the final shell read is materially cleaner; otherwise skip this optional phase

Done shape:
- the remaining menu glue has one clear home if it still needs one
- `AppShell.tsx` reads primarily as top-level composition plus the last truly root-owned surfaces
- this phase can still be skipped if the shell already reads honestly after Phases 1 through 5

Verification:
- run `src/app/AppShell.test.tsx`
- run `src/app/console/ConsoleDock.test.tsx`
- run `src/app/console/stagedNavigation.workspaceModes.test.ts`
- run any focused host or workspace tests touched by menu rewiring
- manually re-read the shell and confirm the remaining inline band is lighter without re-scattering the menu logic

Shipped read:
- `src/app/hosts/useAppShellWorkspaceMenus.tsx` now owns the remaining AppShell workspace-menu cluster, including the viewport spawn-menu portal and action helpers, the floating split submenu hover or lock state, the floating or divider split-menu action family, and the two small menu render surfaces.
- `src/app/AppShell.tsx` now consumes that hook while keeping the shared `viewportSpawnMenu` state available for the earlier activation-clear seam, left-dock pointer-resize ownership in `useAppShellDockController`, detached-viewer windows, console transition handling, viewport-tree composition, and the rest of the top-level shell composition local.
- focused verification passed:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/stagedNavigation.workspaceModes.test.ts`
  - `npx tsc -p tsconfig.json --noEmit`

### Recommended File Targets

Expected primary file targets across the AppShell 4 ladder:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- create `src/app/hosts/useAppShellSurfaceActivation.ts`
- create `src/app/hosts/useAppShellViewportActions.ts`
- create `src/app/hosts/useAppShellConsoleTransition.ts`
- create `src/app/hosts/useAppShellWorkspaceMenus.tsx`
- create `src/app/workspace/WorkspaceViewportTree.tsx`

### Ladder Rules

- preserve current runtime behavior
- preserve current store contracts unless a tiny type-only clarification is necessary
- prefer domain-named seams over generic `helpers` or `utils` files
- keep read-only selectors separate from mutating action hooks
- keep render composition separate from pointer-transition subsystems
- stop early if the shell reads honestly before every optional extraction is used

### Done Shape

This phase is done when:
- `AppShell.tsx` is materially smaller and easier to scan
- the shell body reads primarily as composition plus explicit mounted hooks
- workspace selectors, actions, console transition handling, and viewport-tree rendering each have one clear home
- a later Codex pass can find the right workspace seam without re-reading the entire shell file

### Verification

Run the focused shell and workspace suites that already cover these behaviors, especially:
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- any focused host or workspace tests touched by the extraction

Manual readback should confirm:
- slot split, float, popout, and close still behave the same
- console drag-out and split-back still behave the same
- spaghetti and viewer activation still drive the same workspace and console handoff rules

### Related Files

- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
