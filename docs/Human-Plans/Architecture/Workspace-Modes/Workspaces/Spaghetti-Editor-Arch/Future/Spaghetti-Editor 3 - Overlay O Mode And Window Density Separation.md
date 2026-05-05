# `Spaghetti-Editor-3` - `Overlay O Mode And Window Density Separation`

## Doc Header

### Doc History
15. 2026-05-02 08:06:26: Marked `Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup` complete after adding an essentials-only `BG` slider to the Spaghetti editor titlebar, threading a per-editor canvas background transparency value into the essentials canvas surface, and shipping focused host/panel tests plus production build proof without widening back into overlay ownership.
14. 2026-05-02 07:59:17: Added `Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup` as the next follow-on slice so the remaining `e`-mode polish has an honest planning home focused on a Spaghetti editor titlebar canvas-background transparency slider instead of widening the shipped overlay-titlebar phase after the fact.
13. 2026-05-02 07:36:15: Marked `Spaghetti-Editor 3 - Phase 3 - Overlay Titlebar Controls And Surface Cleanup` complete after moving visible `O` overlay state, graph identity, and the first background-transparency control into the model viewport titlebar row, retiring the temporary floating overlay chip, and shipping focused titlebar/host tests plus production build proof.
12. 2026-05-02 07:24:31: Marked `Spaghetti-Editor 3 - Phase 2 - Overlay Viewport Ownership And Hit-Testing` complete after the `O` panel moved under the active viewport host, the old global overlay body retired to a small exit chip, and the focused host/viewport plus production-build verification passed; then prepped `Phase 3 - Overlay Titlebar Controls And Surface Cleanup` around the new viewport-local overlay owner, the still-floating temporary exit chip, and the model viewport titlebar seams that now need the honest overlay state/control handoff.
11. 2026-05-01 20:47:53: Prepped `Spaghetti-Editor 3 - Phase 2 - Overlay Viewport Ownership And Hit-Testing` for implementation by grounding the next cut in the shipped `overlay` presentation-state seam, the current `SpaghettiWindowHost` maximized overlay shell path, the viewer-local `ViewportOverlay` mount, and the existing `Shift` camera passthrough hooks so the ownership move can stay narrow and testable.
10. 2026-05-01 20:27:32: Prepped `Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry` for implementation by grounding the first cut in the live `SpaghettiWindowHost`, `useSpaghettiStore`, `SpaghettiPanel`, `SpaghettiEditor`, and canvas mode-toggle seams, tightening the exact `- / e / + / O` split, and locking the first verification band before the later overlay ownership phase starts.
9. 2026-05-01 20:23:22: Reworked the `Spaghetti-Editor 3` ladder so the accidental new `Phase 0` remains removed, the new overlay workspace behavior slice is now the real `Phase 2 - Overlay Viewport Ownership And Hit-Testing`, and the former titlebar cleanup follow-on is renumbered to `Phase 3`.
8. 2026-05-01 20:18:48: Removed `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` from the execution ladder after review showed it fits better as cross-plan boundary context than as a real Spaghetti Editor implementation phase; kept the `Edit History Boundary` note and returned the ladder to `Phase 1` and `Phase 2`.
7. 2026-05-01 20:16:40: Implemented and closed `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` as a docs-only ownership pass by finalizing the explicit `- / e / + / O` presentation-state versus canonical node-CAD undo boundary across the standalone plan, adjacent `Edit-History-3` handoff, family index ladder, and doc-log tracking with no runtime/editor-mode code changes.
6. 2026-05-01 20:14:35: Prepped `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` for implementation by tightening the docs-only first cut, locking the exact plan/index/doc-log files to update, and confirming that no runtime/editor-mode code should change in this boundary phase.
5. 2026-05-01 20:12:19: Added `Spaghetti-Editor 3 - Phase 0 - Edit History Boundary And Presentation-State Ownership` so the recently added Edit History handoff is represented as an explicit prep phase before the `O` mode implementation ladder starts.
4. 2026-05-01 20:11:10: Added the Edit History boundary note clarifying that `- / e / + / O` presentation state, overlay titlebar controls, and overlay readability settings are Spaghetti Editor shell state, not canonical node-CAD undo entries, with future presentation-state undo reserved for a workspace/editor-history owner instead of `Edit-History-3`.
3. 2026-04-06 10:39: Tightened `Spaghetti-Editor 3 - Phase 2 - Overlay Titlebar Controls And Surface Cleanup` by explicitly locking that the model viewport titlebar row should show which graph is currently overlaid, for example `O Graph 1`, and that the visible `O` control in that row should serve as the direct exit affordance for leaving overlay mode
2. 2026-04-06 10:36: Reworked `Spaghetti-Editor 3` into an explicit multi-phase ladder by splitting the broad `O`-mode idea into `Phase 1 - Window Density Truth And O Mode Entry` and `Phase 2 - Overlay Titlebar Controls And Surface Cleanup`, so the first implementation pass can stay narrow while the later overlay polish has a clear follow-on home
1. 2026-04-06 10:28: Added this dedicated future phase doc so the proposed new `O` titlebar mode, the cleanup of the current overlay-on-model-viewport experiment, and the restoration of `e` to real essential float-window meaning have one implementation-ready planning surface under `Spaghetti-Editor-Arch/Future/`

### Purpose

Use this doc as the dedicated planning and execution surface for the next Spaghetti editor shell cleanup around titlebar mode meaning and overlay behavior.

The goal here is:
- keep `- / e / +` focused on float-window content density
- add a real fourth titlebar option:
  - `O`
- move the current overlay-on-model-viewport experiment under `O`
- restore `e` to real essential float-window meaning
- stage overlay viewport ownership and hit-testing before widening into later titlebar/control cleanup

### Scope

This phase family covers:
- titlebar mode meaning for:
  - `-`
  - `e`
  - `+`
  - `O`
- separating float-window density from overlay placement
- making `O` a real editor presentation mode
- overlay viewport ownership and hit-testing behavior
- overlay titlebar messaging and first control cleanup

This phase family does not cover:
- node row-density redesign
- per-node `collapsed / essentials / expanded` contract changes
- broad model viewport chrome redesign beyond what `O` needs
- speculative later overlay customization surfaces
- canonical node-CAD undo/history entries; `Edit-History-3` should treat this presentation state as excluded UI/workspace state unless a later workspace/editor-history phase explicitly owns presentation-state undo

## Doc Body

### Summary

`Spaghetti-Editor-3` is the next editor-shell cleanup after the shipped spawn-mode work in `Spaghetti-Editor-2`.

Current read:
- the titlebar mode story is trying to cover both:
  - float-window density
  - overlay-on-model-viewport behavior
- that makes the current `e` meaning muddy
- the desired split is:
  - `-`
    - minimized float window
  - `e`
    - essential float-window content
  - `+`
    - full float-window content
  - `O`
    - overlay the canvas onto the model viewport

Locked recommendation:
- do not add a fourth node row-density mode
- add `O` as an editor presentation mode
- restore `e` to real essential float-window meaning first
- lock overlay ownership and hit-testing before later control polish lands

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
  - owns top-level editor presentation branching
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - owns the compact-shell titlebar surface
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - owns the visible titlebar mode buttons in the active canvas shell
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns editor viewport presentation-mode state and transitions
- `src/app/AppShell.test.tsx`
  - already assumes the current editor presentation mode union
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
  - also assumes the current editor presentation mode union

Important architectural note:

The current node row-density contract should stay separate:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`

This means `O` should not be added as a fourth `NodeRowMode`.

### Edit History Boundary

This plan is an editor presentation-state owner.

The following should not create canonical `Edit-History-3` entries:
- toggling between `-`, `e`, `+`, and `O`
- entering or leaving overlay mode
- changing model-viewport overlay titlebar controls
- changing overlay readability settings such as background transparency

Those actions are not authored graph/node/CAD state. If undo for editor presentation state becomes desirable later, it should be planned under a workspace/editor-history owner rather than the node-owned CAD authoring lane in `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`.

### Phase Breakdown

1. `Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry`
Reason:
- the safest first cut is to restore honest meaning to `- / e / +`, add `O` as a real fourth titlebar option, and lock the editor/store/host mode model before widening into overlay workspace behavior

2. `Spaghetti-Editor 3 - Phase 2 - Overlay Viewport Ownership And Hit-Testing`
Reason:
- once `O` exists as a real mode, the next missing truth is where the overlay should live in the workspace stack and how it should stop blocking the Browser, title bars, and split surfaces while still staying on top of the model viewport

3. `Spaghetti-Editor 3 - Phase 3 - Overlay Titlebar Controls And Surface Cleanup`
Reason:
- once `O` exists as a real mode, the next missing truth is how the model viewport titlebar should announce overlay state and what first-pass overlay controls should be available

4. `Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup`
Reason:
- once `O` overlay controls are shipped, the next missing truth is how `e` mode should expose a first readability control for the canvas itself without pretending that overlay background tuning also solves essentials-mode canvas contrast

## [x] Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry

### Summary

#### Purpose:
- separate float-window density from overlay placement
- restore `e` to honest essential float-window meaning
- add `O` as the real overlay mode entry point
- lock the first store and titlebar contract for the four visible options

#### Current read:
- the current user intent is:
  - `-`
    - minimize the float window into the one-line shell
  - `e`
    - show canvas only
    - keep `C / T / i` closed
  - `+`
    - show full float-window content
  - `O`
    - overlay onto the model viewport
- the current implementation direction has not yet split those meanings cleanly
- the narrowest truthful first cut is:
  - create the fourth editor presentation mode
  - route the current overlay experiment into `O`
  - stop letting `e` stand in for overlay behavior

#### Locked direction:
- keep node density out of this phase
- treat this as editor shell and presentation-state work only
- make `O` a real titlebar-visible mode
- keep later overlay controls deferred to `Phase 2`

#### Current code-backed read:
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - currently owns the visible top-left `+ / e / -` shell language through `primaryModeButtonLabel`
  - currently derives `isEssentials` from `windowMode === 'maximized' && headerCollapsed && !canvasToolbarVisible`
  - currently cycles only `expanded -> essentials -> collapsed -> expanded` through `handlePrimaryViewModeCycle(...)` and `handleViewportPrimaryViewModeCycle(...)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - currently treats editor presentation mode as the three-value shell contract handled by `setEditorViewportPresentationMode(...)`
  - currently encodes `collapsed`, `essentials`, and `expanded` through `windowMode`, `editorViewportHeaderCollapsedById`, and `editorViewportCanvasToolbarVisibleById`
- `src/app/panels/SpaghettiPanel.tsx`
  - currently forces `effectiveViewMode` to `essentials` when the host marks the viewport as essentials
  - still owns local canvas `viewMode` state that should remain separate from the shell-level `O` mode
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
  - currently branches only between `CollapsedEditor` and `ExpandedEditor`
- `src/app/spaghetti/ui/CollapsedEditor.tsx` and `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - currently expose the inner canvas `Expanded / Collapsed` buttons that are separate from the titlebar shell contract

#### First-cut recommendation:
- keep this pass focused on the shell-level presentation-state model
- widen the editor presentation contract from three visible shell states to four:
  - `-`
  - `e`
  - `+`
  - `O`
- do not let this pass absorb viewport-local overlay ownership or hit-testing
- do not change node row-density contracts or the inner node mode cycle

### Questions / Decisions

#### [ ] Question 1 - Should `O` be implemented as a fourth editor presentation mode instead of a fourth node row-density mode?

##### Locked answer
- yes

##### Why
- `O` is about editor placement and presentation, not row density inside nodes
- this keeps the row-density contract stable and local

#### [ ] Question 2 - What should `e` mean after the split?

##### Locked answer
- essential float-window content
- canvas visible
- `C / T / i` closed

##### Why
- that is the intended shell-level meaning of essentials
- it is more honest than overloading `e` with overlay behavior

#### [ ] Question 3 - What should `Phase 1` actually promise?

##### Locked answer
- the titlebar/store/host mode split only

##### Why
- the mode model must be explicit before overlay-titlebar cleanup or transparency controls can be judged honestly

#### [ ] Question 4 - What visible mode set should `Phase 1` lock?

##### Locked answer
- `-`
- `e`
- `+`
- `O`

##### Why
- that matches the intended user-facing titlebar language directly

### Implementation Spec

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- focused UI/store/host tests around the new mode model

Implementation order:
1. widen the editor presentation-mode type and transition owner in `useSpaghettiStore.ts`
2. update `SpaghettiWindowHost.tsx` so the titlebar-visible shell language becomes `- / e / + / O`
3. restore `e` to honest essentials behavior without overlay side effects
4. route the current overlay experiment behind the new `O` entry point only
5. keep `SpaghettiPanel` local canvas `viewMode` and node row-density behavior unchanged except where the shell contract must stop overloading `e`
6. update host/store tests first, then the editor-shell render tests that currently assume only three presentation states

Locked first-cut direction:
1. introduce a fourth editor presentation mode:
   - `overlay`
2. map the visible titlebar buttons to:
   - `-`
   - `e`
   - `+`
   - `O`
3. restore `e` to essential float-window meaning:
   - canvas visible
   - `C / T / i` closed
4. route the current overlay-on-model-viewport behavior through:
   - `O`
5. update host/store typing and transitions so the editor shell can enter and leave `O` honestly
6. keep overlay chrome cleanup deferred:
   - no background transparency control yet
   - no widened titlebar overlay controls yet
7. keep overlay viewport ownership deferred:
   - no viewport-local reparenting yet
   - no Browser/titlebar click-through or `Shift` passthrough ownership yet

Scope honored:
- keep this slice limited to mode meaning and mode entry
- do not redesign node row-density behavior
- do not widen into broad model viewport titlebar redesign yet
- do not add a full overlay settings surface yet
- do not solve overlay stacking or workspace hit-testing yet

Verification matrix:
- the titlebar now exposes:
  - `-`
  - `e`
  - `+`
  - `O`
- `-` still means minimized float window
- `e` no longer routes into overlay behavior
- `e` now means essential float-window content with canvas visible and `C / T / i` closed
- `+` still means the full float-window shell
- `O` now owns overlay entry
- the editor/store/host layer can enter and leave `O`
- the old titlebar primary-mode cycle no longer skips the explicit full-content `+` state
- existing node row-density behavior remains unchanged
- the inner canvas `Expanded / Collapsed` controls remain a separate local concern from the shell `- / e / + / O` contract

Verification commands:
- focused `SpaghettiWindowHost` tests covering the visible `- / e / + / O` shell contract
- focused `SpaghettiPanel` or editor-shell tests proving essentials still maps to canvas-visible compact content
- focused store tests around `setEditorViewportPresentationMode(...)`
- the normal TypeScript no-emit or production build proof used for editor-shell changes in this repo

Definition of done:
- the titlebar mode model is explicit and honest
- `e` and `O` no longer fight over meaning
- `Phase 2` can focus only on overlay viewport ownership and hit-testing

## [x] Spaghetti-Editor 3 - Phase 2 - Overlay Viewport Ownership And Hit-Testing

### Summary

#### Purpose:
- move `O` overlay ownership under the model viewport instead of leaving it as a workspace-global blocking shell
- keep the overlaid graph visibly above the model viewport while preserving Browser, titlebar, and split-workspace usability
- lock the first hit-testing and temporary interaction rules for overlay mode

#### Current read:
- after `Phase 1`, `O` now exists as a real shell state instead of being hidden inside `e`
- the next missing truth is:
  - where the overlay is mounted
  - whether it blocks the whole workspace or only the model viewport lane
  - how the user can keep using Browser and neighboring workspaces while overlay is active
  - how temporary camera/control passthrough such as `Shift` should behave

#### Locked direction:
- `O` should be owned by the model viewport layer, not by a workspace-global floating shell
- the overlay should sit above the model viewport canvas but below Browser, titlebar, and workspace chrome
- the overlay should not block unrelated workspace surfaces while active
- keep later titlebar polish and readability-control widening deferred to `Phase 3`

#### Current code-backed read:
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - now owns an explicit `overlay` presentation-state read through `resolveSpaghettiWindowPresentationMode(...)`
  - still renders overlay through the floating-window host and `SpaghettiFloatingHandle--overlay` chip path
  - still treats overlay as a maximized shell lane, which is the exact ownership boundary this phase should replace
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - now owns explicit `editorViewportOverlayModeById`
  - already lets the shell enter and leave `overlay` through `setEditorViewportPresentationMode(...)`
  - should remain the mode owner, not the viewport-layer rendering owner
- `src/app/workspace/ViewportWorkspaceHost.tsx`
  - already mounts `ViewportOverlay` inside each model viewport host
  - is the strongest existing viewport-local rendering seam for moving `O` under the model viewport instead of the global floating shell
- `src/app/components/ViewportOverlay.tsx`
  - already behaves like a viewport-local overlay/HUD surface and has existing panel-density and interaction patterns
  - is the best comparison seam for how `O` should live above the viewer without taking over the whole app shell
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - already contains the temporary `Shift`-gated viewer/camera passthrough hooks used while overlay-capable canvas modes are active
  - should inform this phase's interaction rules instead of inventing a second temporary camera-control contract

#### First-cut recommendation:
- keep this pass focused on mount ownership and hit-testing only
- preserve the Phase 1 `- / e / + / O` shell contract exactly as shipped
- move the `O` render path out of the workspace-global floating shell and into the model viewport host
- use native layering and `pointer-events` rules instead of manual click forwarding
- keep the first `Shift` interaction pass narrow by aligning it with the current `SpaghettiCanvas` temporary viewer-control behavior

#### Shipped read:
- `O` now mounts the live Spaghetti panel inside the active `ViewportWorkspaceHost` lane instead of leaving the editor body on the old workspace-global maximized shell
- the old floating overlay shell no longer renders the blocking body or resize handles while overlay is active
- the temporary floating `O` chip remains as the interim direct exit affordance until the later viewport-titlebar cleanup lands
- the existing `Shift` wheel / pan / orbit behavior continues to flow through the viewport-local `SpaghettiCanvas` path

### Questions / Decisions

#### [ ] Question 1 - Where should `O` overlay ownership live?

##### Locked answer
- inside the model viewport layer

##### Why
- that keeps the overlay visually above the model viewport while preventing it from acting like a full-workspace blocker

#### [ ] Question 2 - Should Browser, title bars, and split workspaces remain usable while `O` is active?

##### Locked answer
- yes

##### Why
- overlay mode should behave like a viewport-local HUD, not like a modal surface covering the whole workspace

#### [ ] Question 3 - What interaction rule should the first pass lock for temporary model viewport control?

##### Locked answer
- preserve the intended temporary passthrough behavior such as `Shift`-gated camera/control interaction while keeping the default overlay lane non-blocking to the rest of the workspace

##### Why
- this keeps the first pass aligned with the intended overlay UX without widening into a broader control-surface redesign

### Implementation Spec

Likely files:
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- focused overlay-host, hit-testing, and workspace interaction tests

Implementation order:
1. move the live `O` render path from `SpaghettiWindowHost` ownership into the model viewport host
2. keep the shell/store layer responsible only for overlay state entry and exit, not for global overlay mounting
3. place the overlay above the model viewport canvas but below Browser/titlebar/workspace chrome
4. make the default overlay lane non-blocking to unrelated workspace surfaces
5. lock the first `Shift` passthrough rule against the current viewer-control hooks in `SpaghettiCanvas.tsx`
6. add focused tests around viewport-local ownership and non-blocking workspace interaction

Locked direction:
1. move `O` overlay ownership under the model viewport layer
2. keep the overlay above the model viewport canvas but below Browser, titlebar, and workspace chrome
3. stop letting `O` block Browser or neighboring split-workspace interaction by default
4. preserve the intended temporary model viewport passthrough behavior such as `Shift`-gated camera/control interaction
5. keep the control set narrow:
   - no broader titlebar polish yet
   - no widened readability settings yet

Scope honored:
- keep this slice limited to ownership and hit-testing
- do not rename the visible shell controls again
- do not widen into overlay titlebar graph-label or transparency work yet
- do not change node row-density or local canvas density rules
- do not add presentation-state undo/history ownership

Verification matrix:
- `O` no longer renders as a workspace-global floating blocker
- Browser, title bars, and neighboring split workspaces remain usable while `O` is active
- the overlaid graph still reads as sitting on top of the model viewport
- the overlay ownership move does not change the shipped `- / e / + / O` shell contract
- the first temporary `Shift` camera/control passthrough rule is explicit and testable

Verification commands:
- focused `SpaghettiWindowHost` tests proving the old global overlay shell path is retired
- focused viewport-host or overlay tests proving `O` is mounted inside the model viewport lane
- focused interaction tests proving Browser or neighboring workspace surfaces stay usable while `O` is active
- the normal TypeScript no-emit or production build proof used for workspace/editor-shell changes in this repo

Definition of done:
- `O` is no longer a workspace-global blocking shell
- Browser, title bars, and split workspaces remain usable while overlay mode is active
- the overlaid graph still reads as being on top of the model viewport
- the first temporary passthrough interaction rule is explicit and testable

## [x] Spaghetti-Editor 3 - Phase 3 - Overlay Titlebar Controls And Surface Cleanup

### Summary

#### Purpose:
- make `O` feel like a real user-facing overlay mode instead of a hidden implementation state
- add the first useful overlay controls
- clean up the visible model viewport/titlebar surface while overlay is active

#### Current read:
- after `Phase 2`, `O` should already have honest viewport ownership and non-blocking workspace behavior
- the next missing truth is:
  - how overlay state is announced
  - how the user exits overlay mode
  - how the overlaid graph identity is shown in the model viewport titlebar row
  - what first controls help readability between the node canvas and the model viewport behind it

#### Current code-backed read:
- `src/app/workspace/ViewportWorkspaceHost.tsx`
  - now owns the viewport-local `ViewportSpaghettiOverlayRoot` mount
  - is the correct owner seam for keeping overlay rendering under the model viewport lane while Phase 3 moves the visible state/control surface into the viewport chrome
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - now still owns the remaining floating editor shell inventory after `Phase 2`
  - is the seam that should fully stop rendering overlay-only floating shell chrome once the viewport titlebar owns the visible `O` state/control row item
- `src/app/AppShell.tsx`
  - already owns the workspace viewport frame and titlebar composition
  - is the strongest current seam for surfacing viewport-titlebar overlay state without widening `ViewportOverlay` into workspace chrome ownership
- `src/app/workspace/ViewportWorkspaceHost.tsx` and `src/app/AppShell.test.tsx`
  - already prove the viewer, overlay, and toolbar are mounted under one viewport-local host
  - give Phase 3 a natural place to add viewport-titlebar overlay render assertions
- `src/app/components/ViewportOverlay.tsx`
  - still owns viewport-local HUD/tool surfaces
  - should stay out of viewport-titlebar state ownership except where later readability controls truly belong in the overlay lane instead of workspace chrome

#### First-cut recommendation:
- keep this pass focused on visible viewport-titlebar honesty and the first small readability control only
- retire the temporary floating `O` chip by moving the overlay exit/state indicator into the model viewport titlebar row
- keep the titlebar control set intentionally narrow:
  - visible overlay `O`
  - active overlaid graph name
  - first background transparency control
- do not widen into broader overlay settings, node/card opacity tuning, or new presentation-state history ownership in this pass

#### Shipped read:
- the model viewport titlebar now shows a visible overlay row item while `O` is active:
  - `O`
  - the active overlaid graph name
  - a first `BG` background-transparency slider
- the visible titlebar `O` control now exits overlay mode directly
- the temporary floating `SpaghettiFloatingHandle--overlay` chip path is retired instead of remaining as the visible overlay exit surface
- the viewport-local overlay body remains mounted under `ViewportWorkspaceHost`, now with the first adjustable readability backdrop owned by overlay presentation state instead of canonical graph state

### Questions / Decisions

#### [ ] Question 1 - Should the model viewport titlebar explicitly announce overlay-active state?

##### Must lock
- visible wording such as:
  - `O Graph 1`
  - or the current overlaid graph name equivalent, such as `O <graph name>`

##### Locked direction
- yes
- the model viewport titlebar row should show that an overlay is active and which graph is overlaid
- the first-pass titlebar item should include:
  - an `O` control
  - the active graph name beside it

##### Why
- the user should be able to see immediately which graph is currently overlaid onto the model viewport
- this is more informative than a generic overlay-active badge with no graph identity

#### [ ] Question 2 - What is the first mandatory exit/control surface while `O` is active?

##### Must lock
- obvious exit behavior on the model viewport titlebar row
- and whether the visible `O` control itself is the direct exit affordance

##### Locked direction
- the `O` control shown in the model viewport titlebar row should act as the direct exit affordance for leaving overlay mode

##### Why
- that keeps the overlay state indicator and the exit action in the same obvious place
- it matches the intended compact titlebar-row UX better than requiring a second separate exit button

#### [ ] Question 3 - What is the first overlay readability control?

##### Must lock
- background transparency
- and whether node/card opacity also belongs in the first pass or stays deferred

### Implementation Spec

Likely files:
- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/panels/spaghettiWindowAppearance.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.test.tsx`
- focused overlay-host, titlebar, and interaction tests

Implementation order:
1. add a viewport-titlebar overlay state item under the model viewport chrome while `O` is active
2. move the direct overlay exit affordance from the temporary floating chip to that viewport-titlebar `O` control
3. show the active overlaid graph name beside the visible `O` state item
4. add the first background transparency control owned by the overlay presentation-state seam
5. retire the temporary floating `SpaghettiFloatingHandle--overlay` chip path once the viewport-titlebar row fully owns the visible state/control contract
6. add focused tests around titlebar wording, overlay exit, and the first readability control

Locked first-cut direction:
1. the model viewport titlebar row should show:
   - `O`
   - the active overlaid graph name
2. the visible `O` control in that row should leave overlay mode directly
3. the first readability control should cover overlay background transparency only
4. node/card opacity, larger settings surfaces, and broader titlebar restyling stay deferred
5. `ViewportOverlay` should remain a viewport-local HUD/tool owner, not the owner of workspace titlebar chrome

Locked direction:
1. add a model viewport titlebar row item while `O` is enabled that shows:
   - `O`
   - the active overlaid graph name
2. make the visible `O` control in that row exit overlay mode
3. add the first background transparency control
4. keep the control set narrow and useful
5. defer broader overlay settings until later if the first small control set proves valuable

Verification matrix:
- the temporary floating overlay chip is retired once the viewport titlebar row owns overlay state and exit
- the model viewport titlebar visibly shows `O` plus the active overlaid graph name while overlay is active
- the visible titlebar `O` control exits overlay mode directly
- the first readability control adjusts overlay background transparency without changing canonical graph/node state ownership
- the viewport-local overlay ownership from `Phase 2` remains intact
- Browser, title bars, and neighboring split workspaces stay usable while the new titlebar controls are present

Verification commands:
- focused `AppShell` or viewport-host tests covering the viewport-titlebar overlay wording and direct exit behavior
- focused `SpaghettiWindowHost` tests proving the temporary floating overlay chip path is retired
- focused overlay/readability tests covering the first background transparency control
- the normal TypeScript no-emit or production build proof used for workspace/editor-shell changes in this repo

Definition of done:
- `O` now reads as a real overlay mode, not a hidden test path
- the model viewport titlebar clearly reflects overlay state and the active graph name
- the user can exit overlay mode directly from the visible `O` titlebar control
- background transparency can be adjusted in the first pass

## [x] Spaghetti-Editor 3 - Phase 4 - Essentials Canvas Background Transparency Cleanup

### Summary

#### Purpose:
- keep `e` mode honest as its own readable compact editor state instead of leaving it visually dependent on the overlay-focused controls added in `Phase 3`
- add a first canvas-background transparency control that belongs to the Spaghetti editor titlebar itself
- improve essentials-mode canvas readability without widening back into overlay-titlebar ownership

#### Current read:
- `Phase 1` restored the meaning of `e`:
  - canvas visible
  - `C / T / i` closed
- `Phase 3` added background-transparency control for the viewport-local overlay lane, but that does not fully solve the separate readability need inside the floating/editor-hosted `e` presentation
- the next missing truth is:
  - where the essentials-mode canvas background transparency control should live
  - whether that control is tied to overlay-only backdrop state or to the editor surface itself
  - how the titlebar should expose that control without turning `e` into a larger settings surface again

#### Locked direction:
- this is `e`-mode cleanup, not another overlay phase
- the control should live on the Spaghetti editor titlebar
- the control should tune canvas background transparency, not broader node/card opacity
- keep the control set narrow and readable:
  - one slider
  - essentials-focused ownership

#### Current code-backed read:
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - still owns the Spaghetti editor titlebar for floating editor presentations including `e`
  - is the strongest visible chrome seam for adding an essentials-only canvas-background slider without routing it through viewport titlebars
- `src/app/panels/SpaghettiPanel.tsx`
  - already owns the editor body and essentials rendering path
  - is the strongest surface seam for applying a canvas-background transparency value once titlebar ownership decides how the control is exposed
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns presentation-state truth for `collapsed / essentials / expanded / overlay`
  - should stay uninvolved unless a later phase explicitly decides this readability control belongs in shared editor presentation state
- `src/app/theme/surfaces/spaghetti.css`
  - already owns the visual shell and canvas-surface styling used by essentials mode
  - is the likely styling seam for mapping a new transparency value onto the visible canvas backdrop

#### First-cut recommendation:
- keep this pass focused on `e` mode only
- add one titlebar slider for canvas-background transparency while the editor is in essentials mode
- keep the slider attached to the Spaghetti editor titlebar instead of the model viewport titlebar
- do not widen into node opacity, toolbar restyling, or new multi-control appearance surfaces in this pass

#### Shipped read:
- `e` mode now shows a compact `BG` slider on the Spaghetti editor titlebar
- the new slider is editor-surface-local and separate from the viewport-titlebar overlay backdrop control shipped in `Phase 3`
- essentials canvas surfaces now apply the configured background transparency value instead of remaining permanently hard-transparent
- the existing `- / e / + / O` meaning split remains intact

### Questions / Decisions

#### [ ] Question 1 - Where should the first `e`-mode canvas transparency control live?

##### Locked answer
- on the Spaghetti editor titlebar

##### Why
- this is editor-surface readability for essentials mode, not viewport-overlay chrome
- it keeps the `e` cleanup local to the Spaghetti editor instead of mixing it back into `O` ownership

#### [ ] Question 2 - What should the first `e`-mode readability control actually adjust?

##### Locked answer
- canvas background transparency only

##### Why
- that is the narrowest useful fix for essentials readability
- it avoids widening into node/card opacity or a larger appearance panel

#### [ ] Question 3 - Should this control reuse overlay backdrop state?

##### Locked answer
- no by default

##### Why
- `e` mode and `O` mode are now intentionally separate presentation states
- reusing the same setting would blur that separation again unless a later phase intentionally unifies them

### Implementation Spec

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/theme/surfaces/spaghetti.css`
- focused Spaghetti titlebar, essentials rendering, and readability tests

Implementation order:
1. add a narrow Spaghetti editor titlebar control seam for essentials-mode canvas background transparency
2. add store or editor-surface state ownership for that value without coupling it to overlay backdrop state
3. apply the value to the visible canvas background styling used in `e` mode
4. keep the control discoverable but compact in the titlebar
5. add focused tests around titlebar visibility, state wiring, and essentials-mode visual application

Locked direction:
1. treat this as `e`-mode cleanup only
2. add a Spaghetti editor titlebar slider for canvas background transparency
3. keep overlay controls and essentials controls separate
4. do not widen into broader appearance-surface work
5. preserve the shipped `- / e / + / O` meaning split from earlier phases

Verification matrix:
- `e` mode still means essentials float-window content with canvas visible and compact controls closed
- the new transparency slider appears on the Spaghetti editor titlebar instead of the model viewport titlebar
- the slider adjusts the canvas background transparency used by `e` mode
- the new `e`-mode control does not disturb overlay titlebar ownership from `Phase 3`
- no canonical graph/node history ownership is introduced

Verification commands:
- focused `SpaghettiWindowHost` tests covering titlebar control visibility in `e` mode
- focused `SpaghettiPanel` or canvas-surface tests covering essentials background transparency application
- the normal TypeScript no-emit or production build proof used for editor-shell changes in this repo

Definition of done:
- `e` mode has an honest first readability control of its own
- the Spaghetti editor titlebar owns that control
- essentials-mode canvas contrast can be tuned without reusing overlay-only backdrop ownership
