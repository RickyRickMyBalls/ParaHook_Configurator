# Workspace Phase Workspace-7.5-13 - Model Viewport Popout Window

## Doc Header

### Doc History
1. 2026-04-30 20:14:30: Closed `Workspace 7.5-13` as shipped after changelog entry `[907]` confirmed non-primary model viewport child-window popout had landed and entry `[1247]` later carried related floating-open chrome polish; prepared this record to move from `Future/` to `Shipped/`.
1. 2026-04-02 16:49: Shipped `Phase 2 - Non-Primary Model Viewport Child-Window Popout`, recording that non-primary `modelViewer` slots now expose the explicit titlebar popout button, detach through the existing workspace popout path into `hostMode: 'popout'`, render `ViewportWorkspaceHost.tsx` through `useWorkspaceChildWindow(...)`, and treat quick dock versus real popup close as separate truthful outcomes
1. 2026-04-02 16:37: Tightened `Phase 2 - Non-Primary Model Viewport Child-Window Popout` into an implementation-ready slice after the first owner-path research pass, locking that the first code cut should enable the explicit popout button for non-primary `modelViewer` slots, reuse detached-surface bookkeeping plus `ViewportWorkspaceHost.tsx` as the popup render boundary, and defer the higher-risk primary model viewport transfer semantics to a later phase decision
1. 2026-04-02 16:33: Started `Phase 1 - Model Viewport Popout Owner Path Research`, recording that AppShell currently suppresses `onPopOut` for `modelViewer` slots, that the workspace layer already supports detached `modelViewer` surfaces with `hostMode: 'popout'`, and that the main missing seam is a real child-window owner path because AppShell only renders detached viewer surfaces when `hostMode === 'floating'` and never portals a model viewport into `useWorkspaceChildWindow(...)`
1. 2026-04-02 16:30: Tightened the new `7.5-13` phase doc after chat clarified the first concrete UI requirement that the model viewport needs an explicit `open in new browser` titlebar button using the outward top-right popout icon, adding that as the first locked product detail so later research and implementation stay grounded in one visible entry point
1. 2026-04-02 16:28: Added this future phase doc after chat clarified that the model viewport should gain its own explicit popout button and child-window path, locking the first slice as research so the team can trace the current detached viewer seams, shared child-window reuse options, and expected close or dock behavior before implementation guesses

### Purpose

Use this phase to make the model viewport able to open in its own real browser window instead of only existing as an in-app workspace surface.

The goal is:
- one honest model viewport popout contract
- one stable owner path for model viewport popout open, render, focus, activation, and close behavior
- one plan that reuses the proven child-window substrate without guessing at viewer-specific lifecycle rules first

### Scope

This phase covers:
- model viewport popout button behavior
- child-window lifecycle for popped-out model viewports
- ownership seams between AppShell, detached viewer surfaces, workspace child-window helpers, and viewer host rendering
- keeping model viewport popout aligned with the broader workspace surface model instead of inventing a one-off window path

This phase does not cover:
- `Spaghetti Editor` popout repair already closed under `Workspace 7.5-10`
- popout titlebar split-menu capability planned for a later `Workspace 7.5` phase
- shared split ghost preview work already handled under `Workspace 7.5-8`
- split-versus-floating visual parity polish owned by `Workspace 7.5-11`

## Doc Body

### Summary

`Workspace 7.5-13` is the model viewport popout follow-on inside the larger `Workspace 7.5` cleanup ladder.

It exists because the child-window substrate is now proven by the shipped `Spaghetti Editor` popout repair, but the model viewport still has no first-class way to open into its own browser window:
- users can already detach or float other workspace surfaces, but the model viewport still lacks a true popout path
- the current viewer-related detached surface path looks different from the proven Browser or `Spaghetti Editor` popout model
- implementing this without a fresh owner-path read would risk mixing detached in-app viewer behavior with real child-window behavior

The first step should be research:
- trace the current model viewport owner path
- identify whether existing detached viewer surface logic is salvageable for a child-window mode
- decide where the popout button should live and who owns close or dock behavior
- confirm which shared popup helpers can be reused directly from the now-working popout substrate

First locked product detail:
- the model viewport should expose an explicit `open in new browser` titlebar button
- that button should use the outward top-right popout icon language already used elsewhere in the workspace
- this should be the primary visible entry point for opening a model viewport in its own child window

### Locked Direction

`Workspace 7.5-13` should be:
- a focused model viewport popout phase
- a workspace-owned child-window capability addition
- research-first before code-changing slices are planned

`Workspace 7.5-13` should not be:
- a hidden viewer redesign
- a broad multi-window rewrite across every workspace surface
- a visual-polish-only task
- a bucket for unrelated AppShell cleanup

### Current Read

Current likely mismatch:
- the workspace already supports detached model viewport surfaces inside the main app shell
- but that is not yet the same thing as a real child-window popout contract with its own browser window lifecycle
- the model viewport therefore still lacks parity with the newer Browser and `Spaghetti Editor` popout direction

Phase 1 research so far:
- `AppShell.tsx` currently blocks the generic viewport-frame `Pop Out` path for `modelViewer` slots by setting `onPopOut` to `undefined` whenever `slot.surfaceKind === 'modelViewer'`
- the workspace layer is already partially prepared for model viewport popout because `detachViewportSlotSurface(slotId, 'popout')` accepts `modelViewer`, and `workspaceSurfaceActions.ts` already lets `popoutWorkspaceSurface(...)` detach a model viewer into `hostMode: 'popout'`
- however, that detached `modelViewer` popout state currently has no child-window renderer: AppShell only renders detached viewer surfaces when `hostMode === 'floating'`, through the in-app `.DetachedViewerFloatingWindow` shell
- unlike Browser, Console, and `Spaghetti Editor`, there is currently no viewer-specific `useWorkspaceChildWindow(...)` owner path anywhere in the model viewport host stack
- `ViewportWorkspaceHost.tsx` is a promising reusable render boundary because it already packages the viewer surface, overlay, and toolbar for any `viewportId`
- the current detached viewer path is therefore salvageable for data ownership and redock targeting, but not yet for real browser child-window rendering

First visible requirement already locked:
- add an explicit `open in new browser` button to the model viewport titlebar
- use the outward top-right popout icon
- treat that button as the canonical UI entry point for this phase rather than hiding model viewport popout only behind menus or later gestures

Desired invariant:
- the model viewport should be able to open in a real child window through one explicit popout action
- that popped-out viewer should stay interactive and correctly targeted while open
- closing, docking, or restoring the model viewport popout should leave the workspace in one clean, explainable state

Shipped Phase 2 truth:
- non-primary `modelViewer` slots now expose the explicit titlebar `open in new browser` button
- that button now detaches the viewer through the existing workspace popout path and renders the detached viewer in a real child window through `useWorkspaceChildWindow(...)`
- the popup uses `ViewportWorkspaceHost.tsx`, so the viewer canvas, overlay, and toolbar stay together in the child window
- quick dock explicitly redocks the detached viewer back into the workspace slot tree
- real child-window close clears the detached viewer popout state instead of silently restoring it elsewhere

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`

### Research Findings

#### Finding 1 - The current titlebar button seam is blocked at AppShell, not missing from the generic slot frame

Current traced path:
- `ViewportFrame.tsx` already supports a generic `Pop Out` menu action through `onPopOut`
- `AppShell.tsx` currently suppresses that action for viewer slots by passing `undefined` whenever the slot is primary or `slot.surfaceKind === 'modelViewer'`

Implication:
- the new visible `open in new browser` control should likely be added by relaxing or replacing this AppShell gate, not by inventing a brand-new viewer-only frame system first

#### Finding 2 - The workspace store already has a partial model-viewer popout substrate

Current traced path:
- `workspaceShellTypes.ts` already treats `modelViewer` as a first-class `WorkspaceSurfaceKind`
- `useWorkspaceStore.ts` already allows `detachViewportSlotSurface(slotId, 'popout')` for non-primary slots regardless of surface kind
- `workspaceSurfaceActions.ts` already routes `popoutWorkspaceSurface(surfaceInstanceId)` through that detach path for `modelViewer`

Implication:
- this phase does not start from zero
- the likely implementation should reuse the existing detached-surface bookkeeping and host-viewport targeting instead of inventing a parallel viewer-only popout state model

#### Finding 3 - The real missing owner seam is child-window rendering, not detach bookkeeping

Current traced path:
- AppShell currently filters detached viewer surfaces down to `hostMode === 'floating'`
- those surfaces render only as in-app `.DetachedViewerFloatingWindow` shells
- there is no viewer-specific `useWorkspaceChildWindow(...)` usage anywhere in the model viewport owner path

Implication:
- the core model viewport popout implementation problem is: “how do detached viewer surfaces with `hostMode: 'popout'` get rendered into a real child window?”
- this is more about adding one child-window host owner than about teaching the store what a popout is

#### Finding 4 - `ViewportWorkspaceHost` is the strongest reusable child-window render boundary

Current traced path:
- `ViewportWorkspaceHost.tsx` already wraps:
- `ViewerHost`
- `ViewportOverlay`
- `ViewToolbar`
- that host only needs a `viewportId` plus `onActivateViewerSurface`

Implication:
- the cleanest first implementation direction is probably to portal `ViewportWorkspaceHost` into a shared child window for popped-out viewer surfaces, rather than trying to portal `ViewerHost` alone and then rebuilding overlay or toolbar ownership separately

#### Finding 5 - Primary model viewport popout is the highest-risk scope edge

Current traced path:
- the default primary slot is `modelViewer`
- the primary slot also carries special left-dock and viewer-host assumptions in `AppShell.tsx`
- `detachViewportSlotSurface(...)` explicitly blocks detaching the default primary slot

Implication:
- the safest first implementation cut may need to answer whether:
- primary model viewport popout opens as a copy while the in-app primary viewer remains
- or primary model viewport can become a true popped-out owner path through a more invasive host transfer
- this decision should be locked before implementation because it changes both button semantics and close/dock behavior substantially

### Phase Sections

## [x] Phase 1 - Model Viewport Popout Owner Path Research
### info
Purpose:
- trace the real model viewport popout owner seams before any implementation slice is planned

Current read:
- the workspace already has detached viewer surfaces, but the exact owner path for converting that into a real child-window popout is not yet written down cleanly enough to implement in one shot
- the shared child-window substrate is now proven enough to reuse, but the viewer-specific host and lifecycle seams still need a dedicated read

Main work:
- trace the current model viewport surface owner path through AppShell and workspace hosts
- identify whether the existing detached viewer window path is salvageable or should be bypassed for real popout mode
- locate the best owner for the new model viewport popout button
- record the expected open, focus, close, and dock behavior before implementation

Done shape:
- the doc names the real owner files and likely implementation seams
- the doc distinguishes detached in-app viewer behavior from real child-window popout behavior
- the next implementation slice can be planned from evidence instead of guesses

Shipped research read:
- AppShell currently blocks model-viewer `Pop Out` at the slot-frame boundary even though the generic slot-frame contract already supports `onPopOut`
- the workspace layer already persists detached `modelViewer` surfaces with `hostMode: 'popout'`, so detached-surface bookkeeping is partly reusable
- the main missing seam is that AppShell never renders detached viewer `hostMode: 'popout'` surfaces through `useWorkspaceChildWindow(...)`; it only renders detached viewers in the in-app floating shell
- `ViewportWorkspaceHost.tsx` is the best current reusable render boundary for a future child-window viewer host because it already packages the viewer canvas, overlay, and toolbar together

## [x] Phase 2 - Non-Primary Model Viewport Child-Window Popout
### info
Purpose:
- ship the first real model viewport popout path through a child window without widening immediately into the higher-risk primary-viewer ownership problem

Current read:
- the cleanest first implementation target is a non-primary `modelViewer` slot because the workspace layer already allows detaching those viewer slots into `hostMode: 'popout'`
- AppShell already knows how to render detached viewer surfaces in-app when `hostMode === 'floating'`, so the first child-window cut can likely reuse that detached-surface ownership and only change the render host
- `ViewportWorkspaceHost.tsx` is the strongest existing boundary for popup rendering because it already includes `ViewerHost`, `ViewportOverlay`, and `ViewToolbar`

Main work:
- enable the explicit `open in new browser` button for non-primary `modelViewer` slots
- let that button route through the existing `popoutWorkspaceSurface(...)` path so the workspace store records a detached viewer surface with `hostMode: 'popout'`
- add a real child-window renderer for detached model viewer surfaces with `hostMode === 'popout'`
- portal `ViewportWorkspaceHost` into that child window through `useWorkspaceChildWindow(...)`
- keep close and quick-dock behavior honest so the popped-out non-primary viewer can either close cleanly or dock back to its host viewport

Done shape:
- a non-primary model viewport can open into a real child window from the new titlebar popout button
- the popped-out viewer remains interactive and still hosts its normal overlay and toolbar stack
- quick dock or child-window close leaves the workspace in one clean state without stale detached viewer bookkeeping

Shipped result:
- AppShell now exposes the popout button for non-primary `modelViewer` slots instead of suppressing it at the slot-frame boundary
- detached viewer surfaces with `hostMode: 'popout'` now render through a real child-window host instead of being ignored by AppShell
- the child-window shell portals `ViewportWorkspaceHost.tsx` so the non-primary viewer keeps its normal viewer surface, overlay, and toolbar stack while popped out
- quick dock now redocks that detached viewer explicitly, while real popup close clears detached popout state without surprise restore behavior

Likely files:
- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`

Implementation boundaries:
- do implement the first model viewport child-window path only for non-primary viewer slots
- do reuse the existing detached-surface bookkeeping and `hostMode: 'popout'` instead of inventing a new viewer popout state model
- do reuse `ViewportWorkspaceHost.tsx` as the popup render boundary so overlay and toolbar behavior come along together
- do not solve primary model viewport popout transfer semantics in this slice
- do not widen this slice into popout titlebar split-menu support
- do not redesign viewer controls or toolbar UX beyond adding the explicit popout button

Verification target:
- a non-primary `modelViewer` slot shows the explicit `open in new browser` button
- clicking that button opens a real child window with visible model viewport content
- the popped-out viewer remains interactive and still responds to activation
- quick dock returns the viewer to its host viewport split cleanly
- closing the child window leaves no stale detached viewer popout state behind

### Questions / Decisions

#### [x] Question 1 - What is the safest first implementation cut for model viewport popout?

##### Suggestion
- only implement real child-window popout for non-primary model viewport slots in Phase 2

##### Why
- the current workspace store already supports detaching non-primary viewer slots
- that keeps the first cut on the lower-risk path while deferring the harder primary-viewer ownership question

#### [x] Question 2 - What render boundary should the popup child window use?

##### Suggestion
- portal `ViewportWorkspaceHost.tsx` into the popup instead of `ViewerHost.tsx` alone

##### Why
- that keeps the viewer canvas, overlay, and toolbar together under one existing host boundary
- it reduces the chance of inventing a half-working popup viewer that loses normal viewport chrome

#### [x] Question 3 - What should happen when the popped-out non-primary model viewport window closes?

##### Suggestion
- mirror the current detached viewer intent first:
- quick dock explicitly redocks
- real child-window close should clear the detached popout surface instead of silently restoring it somewhere unexpected

##### Why
- that matches the recent popout direction of keeping dock explicit and close honest
- it avoids surprise reattachment behavior before primary viewer semantics are even decided

### Questions / Decisions

#### [ ] Question 1 - What should be the primary owner for model viewport popout open and close behavior?

##### Suggestion
- treat AppShell plus workspace surface actions as the lifecycle owner
- let the viewer host stay focused on rendering rather than owning cross-window state itself

##### Why
- Browser and `Spaghetti Editor` already lean on shared workspace ownership for popout lifecycle truth
- that pattern is more reusable than pushing window ownership down into a viewer-only render surface

#### [x] Question 2 - What is the first required visible entry point for model viewport popout?

##### Suggestion
- add an explicit `open in new browser` titlebar button on the model viewport
- use the same outward top-right popout icon language the workspace already uses for other surfaces

##### Why
- the user already locked this as the first concrete product detail
- giving the model viewport one obvious popout affordance is a cleaner foundation than hiding the capability behind context menus first

#### [ ] Question 3 - Should the current detached viewer window path be reused or treated as separate from real popout?

##### Suggestion
- research this first, but expect detached in-app viewer surfaces and real child-window popout to remain separate modes

##### Why
- the current detached viewer path appears to be an in-shell floating surface, not a true browser child-window lifecycle
- conflating them too early would make it harder to keep close and dock behavior honest

#### [ ] Question 4 - What should count as enough proof before implementation starts?

##### Suggestion
- the first research pass should prove:
- where the popout button belongs
- which shared child-window helpers are reusable as-is
- who owns viewer activation while popped out
- what close versus dock behavior should mean for a model viewport child window

##### Why
- those are the highest-risk ownership seams, and they should be locked before implementation work starts
