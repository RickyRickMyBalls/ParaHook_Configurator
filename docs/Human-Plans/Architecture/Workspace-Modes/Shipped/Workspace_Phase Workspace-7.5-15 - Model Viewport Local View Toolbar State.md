# Workspace Phase Workspace-7.5-15 - Model Viewport Local View Toolbar State

## Doc Header

### Doc History
1. 2026-04-03 09:41: Updated this phase doc after live validation confirmed the `7.5-15` repair is now working, closing the phase as finished workspace behavior and recording the final product truth that each model viewport now owns its own `View` toolbar shell state plus gizmo-anchor alignment while sibling model viewports remain independent
1. 2026-04-03 09:39: Updated this phase doc after the next `Phase 2` repair slice landed, recording that the real remaining break was anchor math rather than state ownership, that `ViewToolbar.tsx` and `ViewportOverlay.tsx` now position their live dock and HUD offsets directly from each viewport's local axis-widget size helpers, that `ViewportWorkspaceHost.tsx` no longer acts as a shared axis-size CSS-variable owner, and that focused toolbar plus overlay regression coverage now protects the compact-versus-expanded alignment math directly
1. 2026-04-03 09:28: Updated this phase doc after the next `Phase 2` follow-up slice landed, recording that `ViewportOverlay.tsx` no longer writes axis-widget size to the global document root, that axis-widget sizing is now scoped per overlay host, and that `ViewportOverlay.test.tsx` now protects against the exact sibling compact-toolbar layout leak shown in the live multi-viewport repro
1. 2026-04-03 09:21: Updated this phase doc after the first `Phase 2` implementation slice landed, recording that the leftover global toolbar-open fields were removed from `uiPrefsStore.ts`, that `ViewToolbar.test.tsx` now seeds and verifies toolbar state through per-viewport workspace chrome, and that `7.5-15` now has focused regression coverage for two-view-toolbar local toggling while live manual validation still remains before closeout
1. 2026-04-03 09:18: Tightened `Phase 2 - Local Toolbar State Adoption` into an implementation-ready slice after Phase 1 ruled out a missing per-viewport state model, locking that the next work should trace and fix the real mirrored runtime seam by targeting shared fallbacks, special host paths, or unintended multi-viewport writes while preserving the existing `viewportChromeById` owner path
1. 2026-04-03 09:16: Completed `Phase 1 - Toolbar State Owner Path Research`, recording that `ViewToolbar.tsx` and `ViewportOverlay.tsx` already read toolbar open and expanded-axis-widget state from per-viewport `viewportChromeById[viewportId].localViewState`, that `ViewportWorkspaceHost.tsx` already passes `viewportId` into both surfaces, that split-created model viewers already receive unique `surfaceInstanceId` viewport ids, and that the strongest remaining issue is now a narrower mirrored-write or legacy-fallback investigation rather than a missing local-state model
1. 2026-04-03 09:11: Tightened `Phase 1 - Toolbar State Owner Path Research` into an implementation-ready research slice after tracing the current toolbar-state seams, locking that `ViewToolbar.tsx` and `ViewportOverlay.tsx` already read `viewToolbarOpen` and `viewToolbarExpandedAxisWidgetSize` from per-viewport workspace chrome, that `ViewportWorkspaceHost.tsx` already passes `viewportId` into both surfaces, and that the strongest remaining risk is a legacy fallback or mixed owner seam still tied to `uiPrefsStore` rather than a missing local-state model
1. 2026-04-03 09:11: Added this future phase doc after chat clarified that the model viewport `View` toolbar still expands and minimizes across every model viewport instead of staying local to the clicked viewport, locking `Workspace 7.5-15` as the new research-first planning surface for separating truly local viewport chrome state from intentionally shared model viewport controls

### Purpose

Use this phase to make model viewport `View` toolbar state behave per viewport instead of cloning across every model viewport.

The goal is:
- one honest contract for which `View` toolbar affordances are local to a single viewport
- one stable owner path for local model viewport toolbar open and minimized state
- one clear distinction between intentionally shared view settings and local viewport chrome state

### Scope

This phase covers:
- model viewport `View` toolbar open and minimized behavior
- ownership of toolbar-local UI state between workspace viewport chrome, local viewport state, and any global view settings
- verification that clicking the toolbar in one model viewport does not automatically expand or minimize the toolbar in sibling model viewports
- preserving any intentionally shared view settings while separating local toolbar chrome state

This phase does not cover:
- model viewport split camera persistence already closed under `Workspace 7.5-14`
- model viewport popout capability already tracked under `Workspace 7.5-13`
- broad camera command redesign unrelated to toolbar-local state
- wider model viewport visual redesign beyond the toolbar-state ownership bug

## Doc Body

### Summary

`Workspace 7.5-15` is the model viewport local-toolbar-state follow-up inside the larger `Workspace 7.5` cleanup ladder.

It existed because the workspace behavior felt wrong in multi-viewport setups:
- the user can click the `View` toolbar in one model viewport
- but the toolbar expands or minimizes across every model viewport instead of only the one the user interacted with
- that makes model viewport chrome feel shared in places where the user expects local control

The shipped product truth is now:
- toolbar open and minimized behavior should be local to the clicked viewport
- later view settings may still be shared if they are intentionally global
- but the toolbar chrome itself should not mirror across sibling model viewports by accident

This phase is now closed:
- the local toolbar owner path has been verified and adopted
- the remaining live layout issue was repaired by moving dock and HUD anchor math onto the same per-viewport gizmo-size contract
- live validation confirmed that sibling model viewports now keep independent toolbar and gizmo alignment behavior

### Locked Direction

`Workspace 7.5-15` should be:
- a focused model viewport toolbar-state phase
- a viewport-chrome ownership cleanup
- closed as finished workspace behavior

`Workspace 7.5-15` should not be:
- a broad model viewport redesign
- a generic toolbar visual polish bucket
- a hidden rewrite of all view settings
- a mixed task that quietly reopens camera or popout work

### Current Read

Locked product truth:
- each model viewport should own its own toolbar open and minimized state
- clicking `View` in one viewport should not automatically open or minimize the toolbar in sibling model viewports
- intentionally shared view settings should remain shared only when that sharing is deliberate and understandable

Current likely mismatch:
- the local toolbar-state model already exists in workspace state, but some runtime path still appears to behave as though that state is shared
- the strongest current risk is a legacy fallback or mixed owner seam still tied to global UI prefs rather than a missing per-viewport state container
- the current behavior likely became more visible after split and multi-viewport work made sibling model viewers easier to compare side-by-side

Chat-supported live repro:
- start with more than one model viewport
- click the `View` toolbar so it expands or minimizes in one viewport
- sibling model viewports follow that same open or minimized state even though the user did not interact with them directly

Desired invariant:
- the toolbar container state is local per viewport
- the user can open or minimize the toolbar independently in each model viewport
- any shared view settings remain intentionally shared and do not force toolbar chrome mirroring by accident

Current traced owner facts:
- `ViewToolbar.tsx` already reads `viewToolbarOpen` and `viewToolbarExpandedAxisWidgetSize` from `useWorkspaceStore(state => state.viewportChromeById[viewportId]?.localViewState)`
- `ViewToolbar.tsx` already writes toolbar open state through `setViewportLocalViewState(viewportId, { viewToolbarOpen: ... })`
- `ViewportOverlay.tsx` also reads the same per-viewport toolbar state for axis-widget sizing and overlay behavior
- `ViewportWorkspaceHost.tsx` already passes `viewportId` into both `ViewportOverlay` and `ViewToolbar`
- `workspaceShellTypes.ts` already defines `viewToolbarOpen` and `viewToolbarExpandedAxisWidgetSize` inside `WorkspaceViewportLocalViewState`
- `useWorkspaceStore.ts` already persists those fields per viewport through `viewportChromeById`
- split-created model viewports already receive unique `surfaceInstanceId` values through `createWorkspaceSurfaceInstanceIdForSlot(...)`, so sibling model viewers should not be sharing one toolbar key by default

Current traced risk:
- `uiPrefsStore.ts` still carries legacy global `viewToolbarOpen` and `viewToolbarExpandedAxisWidgetSize` fields even though the active workspace toolbar components now appear to use per-viewport workspace state
- the strongest current read is therefore not "we need a brand-new local toolbar model"
- it is "we need to prove which runtime path is still falling back to the old shared seam, or where the per-viewport state is being unintentionally mirrored"

Current strongest diagnosis:
- the active slotted model viewport path already looks correctly local on paper
- the remaining bug is more likely to be one of:
- a mirrored `setViewportLocalViewState(...)` write affecting more than one viewport id
- a non-slotted or special host path still rendering without the intended `viewportId`
- a legacy fallback or persistence seam that hydrates sibling viewports into the same toolbar state unexpectedly

Updated live read after the latest repro:
- the strongest remaining issue was not shared toolbar-open state anymore
- the real remaining seam was layout anchor math: the visible gizmo size, HUD offset, and `View` dock anchor were not all reading from the same local viewport-sized contract at runtime
- the attempted shared host CSS-variable owner path removed the global leak but still left the live split-view repro with overlap and bad sibling alignment, so the stronger repair was to move the live offsets onto the components that actually render the gizmo, HUD, and `View` dock

Current shipped repair truth:
- `viewToolbarLayout.ts` now owns explicit local helpers for view-anchor top and HUD-right offset math
- `ViewToolbar.tsx` now computes each viewport's dock width and top padding directly from its own local axis-widget size
- `ViewportOverlay.tsx` now computes the visible gizmo frame and HUD offset directly from the same local axis-widget size contract
- `ViewportWorkspaceHost.tsx` no longer needs to act as a shared `--v15-axis-widget-size` owner for viewport chrome alignment
- focused tests now verify the local dock padding, local HUD offset, and lack of shared host sizing writes directly
- live validation confirmed the split model viewport repro is fixed: expanding or minimizing one model viewport no longer clones sibling toolbar state and no longer misaligns sibling compact toolbar placement

### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/AppShell.test.tsx`

### Research Questions

#### Question 1 - Where does toolbar open and minimized state currently live?
- confirm the current active owner path in the real workspace is `viewportChromeById[viewportId].localViewState`
- identify where any remaining runtime fallback to global toolbar state still occurs, if at all

#### Question 2 - Which toolbar state should truly be local?
- lock whether only open and minimized state is local
- confirm whether expanded-axis-widget sizing and any other chrome affordances should also become per-viewport

#### Question 3 - Which settings are intentionally shared?
- distinguish toolbar shell state from actual view settings like projection mode, axis overlay visibility, or other shared controls
- avoid accidentally making global view behavior inconsistent while fixing local toolbar chrome

#### Question 4 - What is the narrowest durable owner seam?
- decide whether the fix only needs to remove or bypass legacy `uiPrefsStore` toolbar fallbacks
- prefer reusing the existing per-viewport workspace chrome path instead of inventing a new toolbar store

### Implementation Readiness

`Workspace 7.5-15` is closed.

If later model viewport chrome polish is needed, it should be planned as a new follow-up cleanup instead of reopening this finished phase.

### Recommended Next Cut

No further work is recommended inside this phase. Later toolbar or model viewport chrome changes should start as new cleanup tasks.

### Phase Sections

## [x] Phase 1 - Toolbar State Owner Path Research
### info
Purpose:
- trace the current owner seam for model viewport `View` toolbar open and minimized state before implementation starts

Current read:
- the local toolbar-state model already exists in workspace chrome, and the active slotted viewport host path already passes the correct `viewportId`, so the most likely remaining bug is a narrower mirrored-write, special-host, or legacy-fallback seam

Main work:
- confirmed that `ViewportWorkspaceHost.tsx` passes `viewportId` into both `ViewToolbar.tsx` and `ViewportOverlay.tsx`
- confirmed that `ViewToolbar.tsx` reads and writes `viewToolbarOpen` through `viewportChromeById[viewportId].localViewState` and `setViewportLocalViewState(...)`
- confirmed that `ViewportOverlay.tsx` reads `viewToolbarOpen` and `viewToolbarExpandedAxisWidgetSize` from the same per-viewport local view state
- confirmed that split-created model viewers get unique `surfaceInstanceId` viewport ids through `createWorkspaceSurfaceInstanceIdForSlot(...)`
- confirmed that legacy global toolbar fields still remain in `uiPrefsStore.ts`, but current active workspace toolbar components do not obviously read them
- narrowed the next implementation target down to a mirrored runtime seam rather than a missing local-state model

Done shape:
- the doc names the strongest current remaining seam with evidence
- the doc rules out "missing per-viewport toolbar store" as the primary problem
- the next implementation slice can target one clear seam such as mirrored-write repair, special-host viewport-id plumbing, or legacy fallback cleanup instead of broadly reshaping toolbar code

## [x] Phase 2 - Local Toolbar State Adoption
### info
Purpose:
- move the toolbar-shell state that should be local onto a per-viewport owner path

Current read:
- Phase 1 already confirmed that the intended per-viewport owner path exists, and the first shipped slice has now removed the leftover global toolbar-open seam from `uiPrefsStore.ts`
- the next shipped follow-up slice has now also removed the global axis-widget sizing leak from `ViewportOverlay.tsx`
- live manual validation is now complete and confirmed that the sibling compact-toolbar layout matches the intended real UI behavior

Main work:
- shipped:
- removed the legacy global toolbar-open and toolbar-size fields plus setters from `uiPrefsStore.ts`
- updated `ViewToolbar.test.tsx` to seed toolbar state through `viewportChromeById[viewportId].localViewState`
- added focused regression coverage for two model viewports so one toolbar toggle only affects its own viewport-local state
- removed the global `document.documentElement` axis-widget-size write from `ViewportOverlay.tsx`
- scoped `--v15-axis-widget-size` to each `ViewportOverlayRoot` so expanded and compact viewports no longer share one layout-size variable
- added focused `ViewportOverlay.test.tsx` coverage for two viewport overlays with different toolbar states
- repaired the remaining live anchor mismatch by moving `ViewToolbar` dock padding and `ViewportOverlay` HUD or gizmo positioning onto the same per-viewport axis-widget size helpers
- removed the temporary shared host axis-widget-size owner path from `ViewportWorkspaceHost.tsx`
- expanded focused regression coverage to verify local dock padding, local HUD offset, and the absence of shared host sizing writes
- remaining:
- none inside this phase after live validation confirmed the repro is fixed

Implementation boundaries:
- keep the work inside the current toolbar owner files unless evidence forces a wider seam
- prefer changing `ViewToolbar.tsx`, `ViewportOverlay.tsx`, `ViewportWorkspaceHost.tsx`, `useWorkspaceStore.ts`, or legacy toolbar fallback reads before touching broader viewer architecture
- do not create a new toolbar store or duplicate the existing per-viewport chrome model
- do not widen into camera, popout, or unrelated viewport-chrome cleanup

First code cut:
- add one focused failing regression test that reproduces the current mirrored toolbar behavior across two model viewports
- use that test to identify whether the failure is a shared read path or a mirrored write path
- then patch only the seam that the failing test exposes

Verification target:
- with two model viewports visible, opening or minimizing the toolbar in one viewport leaves the sibling viewport's toolbar shell unchanged
- axis-widget sizing behavior continues to follow the same viewport-local toolbar state
- intentionally shared controls such as actual global view settings still behave as they did before

Done shape:
- clicking `View` only affects the targeted model viewport
- sibling viewports keep their own toolbar state
- sibling compact and expanded gizmo or `View` toolbar anchor geometry now stays aligned per viewport
- shared view settings remain predictable and explainable
- the fix is anchored to one proven seam instead of a broad state-model rewrite

Shipped result so far:
- the codebase no longer exposes a parallel global toolbar-open owner path in `uiPrefsStore.ts`
- toolbar-local regression coverage now uses the real workspace per-viewport state model
- axis-widget sizing is now scoped per viewport overlay host instead of being shared through the global document root
- the phase remains open only for live manual validation and any remaining runtime seam that still reproduces outside the newly covered owner path

## [ ] Phase 3 - Verification And Closeout
### info
Purpose:
- verify the final `7.5-15` behavior and close the task with one honest contract

Current read:
- the task is not complete until live validation confirms that toolbar-shell state is truly local in multi-viewport setups

Main work:
- verify toolbar expand and minimize behavior across split model viewports
- verify sibling viewports no longer mirror the clicked viewport's toolbar shell state
- verify intentionally shared controls still behave as expected
- update cleanup docs with the final shipped truth

Done shape:
- live validation confirms the toolbar no longer clones open or minimized state across model viewports
- tests cover the fixed owner seam
- `7.5-15` is ready to close without leaving toolbar ownership ambiguous
