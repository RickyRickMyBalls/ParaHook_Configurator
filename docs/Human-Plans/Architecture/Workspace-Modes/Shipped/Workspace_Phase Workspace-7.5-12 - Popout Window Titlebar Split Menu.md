# Workspace Phase Workspace-7.5-12 - Popout Window Titlebar Split Menu

## Doc Header

### Doc History
1. 2026-04-02 21:31: Closed `Workspace 7.5-12` after Browser popup-local adoption shipped, updating the phase summary and locked direction so this doc now reads as a finished capability phase whose popup-local child-window shell, titlebar split menu, and first adopter set across `Spaghetti Editor`, `modelViewer`, `Console`, and `Browser` are all complete
1. 2026-04-02 21:27: Completed `Phase 6 - Popup-Local Browser Adoption`, recording that the existing popup-local child-window shell now supports `browser` slots alongside `Spaghetti Editor`, `modelViewer`, and `Console`, and that Browser can now render inside a popup-local slot without routing back through the singleton copied popup shell or mutating the main workspace layout
1. 2026-04-02 21:00: Tightened `Phase 6 - Popup-Local Browser Adoption Plan` into an implementation-ready execution slice, locking that the next code cut should expand popup-local surface switching to `browser`, add a popup-local Browser adapter instead of reusing the singleton copied popup shell directly, and keep the work focused on Browser-only adoption now that `Spaghetti Editor`, `modelViewer`, and `Console` already validate the popup-local child-window shell
1. 2026-04-02 20:56: Completed the first `Phase 5` popup-local surface-adoption slice, recording that popup-local child-window workspaces can now switch slots to `console` alongside `Spaghetti Editor` and `modelViewer`, and added `Phase 6 - Popup-Local Browser Adoption Plan` so Browser stays as the next explicit follow-up instead of being implied inside the already-shipped Console-first pass
1. 2026-04-02 20:28: Tightened `Phase 5 - Popup-Local Browser And Console Adoption Plan` into an implementation-ready execution slice, locking that the next code cut should adapt Console first into the already-working popup-local shell, keep the popup-local surface picker expanded only as far as `console`, and leave Browser adoption explicitly staged behind that first Console pass instead of mixing both adopters into one broad implementation jump
1. 2026-04-02 20:24: Added `Phase 5 - Popup-Local Browser And Console Adoption Plan`, locking that the next `7.5-12` slice should adapt Console first and Browser second into the existing popup-local workspace shell, preserve the same child-window-local split contract already proven by `Spaghetti Editor`, and keep this follow-up focused on popup-local surface adoption rather than reopening the popup-local substrate itself
1. 2026-04-02 18:12: Completed `Phase 4 - Popup-Local Workspace Shell First Implementation`, recording that popped-out `Spaghetti Editor` now promotes into a popup-local multi-viewport child-window shell with one popup-local zustand store, popup-local `ViewportFrame` reuse, same-surface sibling split default, and first-wave popup-local switching between `Spaghetti Editor` and `modelViewer` while Browser and Console popup-local parity remain deferred to later phases
1. 2026-04-02 17:44: Added `Phase 4 - Popup-Local Workspace Shell First Implementation` after the first-cut architecture plan, locking that the next code-changing slice should build one popup-local zustand store per child window, one popup-local shell that reuses the slot-tree shapes plus `ViewportFrame.tsx`, and one `Spaghetti Editor`-first validator path with same-surface split default before Browser and Console are adapted into the popup-local shell
1. 2026-04-02 17:40: Completed `Phase 3 - Popup-Local Workspace Shell First-Cut Plan`, locking the first honest architecture decisions: use one dedicated popup-local zustand store per child window, introduce one popup-local workspace shell that reuses the existing slot-tree types plus `ViewportFrame.tsx`, treat `Spaghetti Editor` as the first substrate validator with same-surface sibling default, and defer Browser and Console full adaptation until after the popup-local shell proves itself
1. 2026-04-02 17:33: Added `Phase 3 - Popup-Local Workspace Shell First-Cut Plan` after the deeper substrate research, locking that the next planning slice should define the popup-local store shape, first validator surfaces, shell boundary, and minimum child-window-local behaviors needed before any real popup titlebar split implementation starts
1. 2026-04-02 17:28: Recorded the deeper `Phase 2` workspace-shell research, capturing that `WorkspaceViewportSlot`, `WorkspaceLayoutNode`, and `ViewportFrame.tsx` are strong reuse candidates for popup-local multi-viewport support, while `ViewportSurfaceRegistry.tsx` and parts of `useWorkspaceStore.ts` still lean on main-workspace or global Browser state, so a popup-local shell likely needs a dedicated popup workspace state model rather than simply mounting the existing AppShell inside the child window
1. 2026-04-02 17:21: Tightened the corrected `Phase 2 - Popup-Local Workspace Shell Research And Plan` into an implementation-ready planning slice, locking that the next work should define the popup-local slot tree, state owner, first shared shell boundary, and default sibling-surface truth before any real popup titlebar split implementation starts
1. 2026-04-02 17:15: Corrected the core `7.5-12` product truth after chat clarified that popup titlebar split should create additional viewports inside the same child window rather than redocking the surface back into the main workspace, and added a second owner-path research pass recording that current popup hosts are all single-surface shells tied to the main workspace store with no popup-local viewport slot tree yet
1. 2026-04-02 17:09: Tightened `Phase 2 - Popup-Local Titlebar Split Menu Adoption` into an implementation-ready slice after the first owner-path research pass, locking that the first code cut should add popup-local right-click split menus in Browser, Console, and `Spaghetti Editor` popup hosts, reuse the shared four-way split commands plus `workspaceSurfaceActions.ts` commit seam, and keep the slice menu-only without widening into popup drag-ghost prediction
1. 2026-04-02 17:05: Started `Phase 1 - Popout Titlebar Split Owner Path Research`, recording that Browser, Console, and `Spaghetti Editor` already render real popup titlebars inside child windows, that only their in-app floating variants currently wire split-menu affordances, that `workspaceSurfaceActions.ts` already owns the shared split and redock commit truth, and that Browser is the only adopter whose popup path is still a special copied shell rather than a detached workspace surface
1. 2026-04-02 16:58: Added this future phase doc after chat clarified that right-click split support for popped-out workspace surfaces should be treated as its own new capability phase, locking the first slice as research so the team can trace popup-local titlebar menu ownership, shared split-action reuse, and the close-or-redock outcomes before implementation guesses

### Purpose

Use this phase to let popped-out workspace surfaces open the same four-way split menu directly from their child-window titlebars.

The goal is:
- one honest popout titlebar split-menu contract
- one popup-local workspace split path that keeps the child window alive
- one plan that works across Browser, Console, `Spaghetti Editor`, and later popout-capable surfaces without reopening the already-closed popout repair phases

### Scope

This phase covers:
- right-click split-menu behavior on popped-out window titlebars
- popup-local menu presentation inside child windows
- popup-local viewport creation and split ownership inside child windows
- surface swapping inside those popup-local viewports after the split exists

This phase does not cover:
- the `Spaghetti Editor` popout repair already closed under `Workspace 7.5-10`
- model viewport popout enablement already started under `Workspace 7.5-13`
- drag-ghost prediction from inside child windows unless later phases explicitly widen into it
- broader split-versus-floating visual parity polish owned elsewhere in the `Workspace 7.5` ladder

## Doc Body

### Summary

`Workspace 7.5-12` is now a closed popout capability phase.

It shipped:
- one popup-local child-window workspace shell
- one popup-local titlebar split menu contract
- one first popup-local adopter set across `Spaghetti Editor`, `modelViewer`, `Console`, and `Browser`

It existed because:
- popped-out surfaces already work as real child windows
- those popped-out surfaces still lack the same titlebar split affordance available on in-app floating windows
- popup split is now clarified as a real child-window workspace capability, not a main-workspace redock action
- adding popup-local split menus should be treated as new capability work, not as unfinished repair on the older popout phases

The finished outcome is:
- right-clicking a supported popped-out titlebar can open popup-local split actions inside the child window
- choosing a split keeps the popup alive and creates additional popup-local viewports in that same browser window
- popup-local slots can then switch across the first supported surface set without mutating the main workspace layout

### Locked Direction

`Workspace 7.5-12` is now:
- a shipped shared workspace capability phase for popped-out surfaces
- the source-of-truth phase for the first popup-local child-window split shell
- closed for this first adopter set

`Workspace 7.5-12` should not be:
- a reopening of `Workspace 7.5-10`
- a one-off `Spaghetti Editor`-only feature
- a hidden implicit split action without a clear popup-local titlebar menu
- a grab-bag for unrelated popout polish
- silently reopened for later popup-local parity or polish follow-ups that should become their own phases

### Current Read

Current shipped truth:
- the original mismatch is resolved for the first supported popup-local surface set
- popped-out `Spaghetti Editor` child windows can now promote into popup-local multi-viewport workspaces instead of staying single-surface shells
- popup-local titlebar split now creates additional popup-local viewports inside the same child window
- the popup stays alive after the split
- popup-local surface switching now reaches:
- `Spaghetti Editor`
- `modelViewer`
- `Console`
- `Browser`
- the main workspace layout stays untouched by popup-local split and popup-local surface switching

Phase 1 research so far:
- Browser already has a real popup child-window path in `BrowserDockHost.tsx`, but the popped-out `BrowserPanel` is rendered without `onTitleBarContextMenu`; only the floating in-app Browser window currently wires the four-way split menu through `handleOpenFloatingSplitMenu(...)`
- `Spaghetti Editor` already has a popup child-window shell in `SpaghettiWindowHost.tsx`, and `SpaghettiWindowTitleBar` already supports `onContextMenu`, but the popped-out `separateWindow` render path does not pass that prop today; only the floating editor shell currently forwards right-click to `onOpenFloatingSplitMenu(...)`
- Console already has a real popup child-window path in `ConsoleDock.tsx`, but the popped-out `ConsolePanel` is rendered without `onHeaderContextMenu`; only the floating console currently exposes the four-way titlebar split menu
- the shared split-action truth already lives in `workspaceSurfaceActions.ts`, where `splitWorkspaceSurfaceToSide(...)`, `commitWorkspaceSurfaceSlotSplit(...)`, and `commitWorkspaceSurfaceRootSplit(...)` already understand Browser, Console, detached `Spaghetti Editor`, and detached `modelViewer` surfaces
- Browser is the main special-case adopter because its popup path is still a copied shell controlled by `browserShell.isPoppedOut`, while Console and `Spaghetti Editor` popup paths already come from detached workspace surfaces or explicit popout window modes
- all three current popup hosts are still single-surface shells:
- Browser popup renders one `BrowserPanel`
- `Spaghetti Editor` popup renders one `SpaghettiWindowTitleBar` plus one `SpaghettiPanel`
- Console popup renders one `ConsolePanel` plus one `ConsoleBar`
- none of those popup paths render `ViewportFrame`, a popup-local slot tree, or popup-local `viewportSlotsById`
- current split helpers in `workspaceSurfaceActions.ts` all target the main workspace store, so they would currently split or redock in the main app, not create additional viewports inside the child window

Current strongest implementation direction:
- popup titlebar split now needs a popup-local workspace substrate first, not just popup-local menu presentation
- the likely new owner surface is a popup-local workspace shell that can render `ViewportFrame`-style slots inside the child window
- existing popup hosts should probably become surface adapters inside that popup-local shell rather than each inventing their own multi-viewport popup layout
- the main workspace split helpers are still useful as conceptual truth, but they are not yet the correct direct commit seam for the popup-local split feature

### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- relevant popout host tests for Browser, Console, and `Spaghetti Editor`

### Phase Sections

## [x] Phase 1 - Popout Titlebar Split Owner Path Research
### info
Purpose:
- trace the real owner seams for popup-local titlebar split menus before implementation starts

Current read:
- popped-out Browser, Console, and `Spaghetti Editor` surfaces already render inside child windows, but their titlebar controls and popup lifecycle owners are not yet written down as one split-menu-capable system
- the shared workspace split commit helpers likely already exist, but the popup-local menu rendering and cross-window action handoff need a dedicated read first

Main work:
- trace where Browser, Console, and `Spaghetti Editor` popout titlebars render and which file owns each one
- identify whether popup split can reuse the main workspace slot tree or whether it needs a popup-local slot tree
- decide whether the popup-local split menu should be one shared child-window component or part of a larger popup-local workspace shell
- record what should happen after a popup split action commits now that the child window must stay open and hold multiple viewports
- keep drag-ghost work out of scope unless research proves it is inseparable from titlebar menu behavior

Done shape:
- the doc names the real owner files and likely implementation seams
- the doc distinguishes popup-local menu presentation from shared split-action truth
- the next implementation slice can be planned from evidence instead of guesses

Shipped research read:
- Browser popup titlebar owner: `BrowserDockHost.tsx` renders the popped-out `BrowserPanel` inside the child window, but only the floating Browser shell currently passes `onTitleBarContextMenu`; the popup Browser path has no split-menu hook yet
- `Spaghetti Editor` popup titlebar owner: `SpaghettiWindowHost.tsx` renders `SpaghettiWindowTitleBar` inside the child window, and that titlebar already supports `onContextMenu`, but the popup render path omits it while floating shells already use it for split-menu opening
- Console popup titlebar owner: `ConsoleDock.tsx` renders the popped-out `ConsolePanel` inside the child window, but only the floating console path currently passes `onHeaderContextMenu`
- current popup limitation: all popup hosts still render exactly one surface shell and do not host popup-local `ViewportFrame` slots or a popup-local layout tree
- main-store limitation: the current split helpers in `workspaceSurfaceActions.ts` all act on the main workspace store, so they cannot yet create additional popup-local viewports inside the child window
- Browser remains the main special-case adopter because its popup is still a copied shell rather than a detached workspace surface, but the larger new blocker is shared across all adopters: no popup-local workspace shell exists yet

### Questions / Decisions

#### [ ] Question 1 - What should be the source-of-truth split commands for popped-out surfaces?

##### Suggestion
- reuse the same four-way split commands already shipped on floating in-app titlebars:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`

##### Why
- that preserves directional truth users already know from the existing workspace shell
- it keeps popup titlebar split affordances aligned with the same directional contract instead of inventing a new popout-only menu language

#### [ ] Question 2 - Where should the split menu actually render for popped-out surfaces?

##### Suggestion
- render the split menu inside the child window that owns the popped-out titlebar

##### Why
- right-click happens in the popup browser window, not the main app window
- keeping the menu popup-local avoids cross-window overlay weirdness and matches where users expect the menu to appear

#### [ ] Question 3 - What should commit the actual split action after a popup menu selection?

##### Suggestion
- do more research before locking this, because the current shared split helpers still target the main workspace store rather than a popup-local slot tree

##### Why
- the user clarified that popup split should keep the child window alive and create additional popup-local viewports
- that means a direct call into the current main-workspace split helpers would produce the wrong behavior today

#### [x] Question 4 - Where are the real popup titlebar owners today?

##### Suggestion
- treat these as the concrete popup titlebar owners for implementation planning:
- Browser: `BrowserDockHost.tsx`
- `Spaghetti Editor`: `SpaghettiWindowHost.tsx`
- Console: `ConsoleDock.tsx`

##### Why
- each of those files already renders the child-window popup shell for its surface kind
- adding popup-local split menus there keeps menu presentation in the same browser window as the titlebar users right-click

#### [x] Question 5 - What is the biggest adopter-specific edge to keep in mind before implementation?

##### Suggestion
- plan Browser as the special-case adopter while keeping Console and `Spaghetti Editor` closer to the generic detached-surface path

##### Why
- Browser popup is still a copied shell controlled by browser compatibility state rather than a detached workspace surface
- that means Browser may need a small extra transition step after a popup split action, even if the shared menu language and split-commit truth stay common

#### [x] Question 6 - What is the biggest new shared blocker after the product truth correction?

##### Suggestion
- treat the missing popup-local workspace shell as the real Phase 2 blocker

##### Why
- today’s popup hosts can only render one surface at a time
- popup split needs a child-window-local layout tree, slot model, and surface swapping path before a titlebar split menu can do the right thing

## [ ] Phase 2 - Popup-Local Workspace Shell Research And Plan
### info
Purpose:
- define the popup-local workspace substrate needed before popup titlebar split can be implemented honestly

Current read:
- the split menu itself is not the first missing piece anymore
- the real missing system is a popup-local workspace shell that can keep the child window alive, create additional popup-local viewports, and allow later surface swapping inside that popup
- current popup hosts and current workspace split helpers are both too main-workspace-specific to satisfy the corrected product truth directly

Deeper `Phase 2` research so far:
- the core slot-tree types look reusable:
- `WorkspaceViewportSlot`
- `WorkspaceLayoutNode`
- `WorkspaceLayoutLeafNode`
- `WorkspaceLayoutSplitNode`
- `ViewportFrame.tsx` is also a strong reusable shell boundary because it already owns titlebar split commands, surface swapping, and the popout button affordance
- `ViewportWorkspaceHost.tsx` is a good reusable viewer boundary inside a future popup-local slot tree
- the first real coupling problem appears in `ViewportSurfaceRegistry.tsx`:
- Browser rendering there still depends on global `browserShell` presentation state in `useWorkspaceStore`
- Console rendering there still mounts the singleton `ConsoleDock`
- `SpaghettiPanel` is more reusable as a surface body, but its activation and viewport identity still expect the current global spaghetti store
- the second coupling problem appears in `useWorkspaceStore.ts`:
- the current store has exactly one main workspace slot tree
- exactly one `browserShell`
- one `workspaceSplitMenu`
- and one set of detached-surface semantics tied to the main app
- that means popup-local multi-viewport support probably should not start by “just reusing the existing workspace store directly” unless we first generalize large parts of it into window-scoped state

Current strongest architecture direction:
- reuse the slot-tree data shapes and frame-shell components
- but introduce a popup-local workspace state model rather than trying to share the current singleton main-workspace store directly
- make the popup-local shell responsible for:
- popup-local slot tree
- popup-local active viewport
- popup-local split menu state
- popup-local surface kind switching
- then adapt Browser, Console, `Spaghetti Editor`, and later model viewport into that shell as popup-local surface bodies
- the first implementation cut should likely validate this shell with one popup adopter and one extra sibling viewport before attempting full parity across every surface

Main work:
- research what popup-local slot tree state would need to exist
- identify whether the main workspace slot tree types and `ViewportFrame` surface-switching affordances are salvageable inside a child window
- trace whether popup-local workspace state should live in the main store, a parallel popup store, or a per-popup child-window model
- define the first honest implementation cut for Browser, Console, and `Spaghetti Editor` inside that popup-local workspace shell
- only after that, plan the actual titlebar split-menu implementation slice

Done shape:
- the next implementation slice names the popup-local workspace owner, state model, and first adopter path
- the phase no longer assumes an incorrect direct reuse of the main-workspace split commit helpers
- the follow-on implementation plan can add popup titlebar split with the correct child-window-local behavior

Latest research read:
- salvageable directly:
- `WorkspaceViewportSlot` and layout-node types from `workspaceShellTypes.ts`
- `ViewportFrame.tsx`
- `ViewportWorkspaceHost.tsx`
- likely salvageable with adapter work:
- `SpaghettiPanel`
- viewer activation flow
- per-surface shell headers that can live inside popup-local slots
- not directly reusable without refactor:
- the singleton `browserShell` slice in `useWorkspaceStore.ts`
- the singleton `workspaceSplitMenu` in `useWorkspaceStore.ts`
- the current `ViewportSurfaceRegistry.tsx` Browser and Console branches
- any direct call paths in `workspaceSurfaceActions.ts` that assume main-workspace slot-tree ownership

First honest planning recommendation:
- do not make Browser the first substrate validator even though it was the first popup adopter
- Browser is still the most global-state-coupled surface because of `browserShell`
- a better first substrate validator may be `Spaghetti Editor` plus model viewport, or `Spaghetti Editor` plus Console, inside one popup-local shell
- after the popup-local shell works, Browser can be adapted into it as a follow-on within the same larger feature family

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- popup-host and workspace-shell tests

Implementation boundaries:
- do not pretend the current main-workspace split helpers already solve popup-local split
- do not implement a fake popup menu that secretly redocks back into the main workspace
- do keep the corrected product truth explicit: popup split means more popup-local viewports inside the same child window
- do not widen into popup drag-ghost prediction yet
- do not mix this slice with unrelated popout lifecycle cleanup

Verification target:
- the doc identifies whether popup-local multi-viewport support can reuse existing workspace slot-tree types and frame components
- the doc identifies where popup-local state should live
- the next phase section or follow-up plan can describe an honest first implementation slice for popup-local split that keeps the child window alive

Implementation-ready planning target:
- name the popup-local workspace owner:
- likely a new popup-local workspace shell rather than per-surface popup logic
- name the first reusable boundaries:
- likely `ViewportFrame.tsx`
- likely `ViewportSurfaceRegistry.tsx`
- likely `ViewportWorkspaceHost.tsx`
- decide the popup-local state home:
- extend the current workspace store with popup-window-scoped layout state
- or introduce a parallel popup workspace store that still reuses the same slot and node types
- lock the first split default:
- when a popup titlebar is split, the new sibling viewport should initially use the same surface kind as the source viewport unless later chat changes that truth
- define the first adopter strategy:
- either make one shared popup workspace shell that Browser, Console, and `Spaghetti Editor` all render through
- or explicitly justify a narrower first adopter if one surface has to validate the substrate first

Likely decisions to lock next:
- whether popup-local slot trees should reuse `WorkspaceViewportSlot`, `WorkspaceLayoutNode`, and related types directly
- whether popup-local surface swapping should reuse the existing `ViewportFrame` type-picker flow unchanged
- whether popup-local activation and focus should publish back into the main app console context or remain local by default
- how popup-local close semantics work once a popup has more than one viewport

Most likely answers from current research:
- popup-local slot trees should reuse the existing slot and layout-node types directly wherever possible
- `ViewportFrame` should be reused with minimal behavior changes so popup-local type switching feels identical to the main workspace
- popup-local state should probably live in a dedicated popup workspace model rather than in the current singleton main-workspace store
- Browser should be treated as the last of the first-wave adopters to fully adapt, not the substrate-defining first adopter

## [ ] Phase 3 - Popup-Local Workspace Shell First-Cut Plan
### info
Purpose:
- lock the first honest implementation shape for popup-local multi-viewport support before any code-changing slice begins

Current read:
- `Phase 1` clarified the product truth
- `Phase 2` identified the reusable slot-tree boundaries and the singleton-store blockers
- the next useful step is to choose one popup-local store model and one first adopter path instead of leaving the architecture open

Main work:
- define the popup-local workspace state shape:
- popup-local slot tree root id
- popup-local slots by id
- popup-local layout nodes by id
- popup-local active slot or surface
- popup-local split menu state
- decide whether popup-local state should be:
- one new zustand store per popup window
- or one popup-workspace slice in the main store keyed by popup id
- define the first reusable shell boundary:
- likely a popup-local workspace shell component that renders `ViewportFrame` plus popup-local surface registry
- define the first validator scope:
- likely `Spaghetti Editor` as the source popup plus one additional popup-local sibling surface
- explicitly decide whether the first sibling surface should default to the same surface kind as the source popup
- define what minimum behavior must work in the first implementation slice:
- split one popup into two popup-local viewports
- surface swap either popup-local viewport
- keep child window alive
- keep popup-local interactions from accidentally mutating the main workspace layout

Done shape:
- the next implementation slice has one chosen popup-local state owner
- the next implementation slice has one chosen first adopter path
- the next implementation slice has one minimum viable popup-local shell contract
- the team can begin implementation without reopening the core architecture question

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- new popup-local workspace shell file or popup-local store file
- popup host owners for the chosen first adopter

Planning boundaries:
- do choose one popup-local state model instead of leaving multiple equal candidates open
- do choose one first validator path instead of trying to land every popup surface at once
- do preserve the corrected product truth that popup split creates more popup-local viewports in the same child window
- do not widen this phase into actual popup split implementation yet
- do not widen this phase into popup drag-ghost prediction, popup-local persistence, or Browser parity if those are not required for the first validator

Verification target:
- the doc names the popup-local state owner and the first validator surface set
- the doc names the first reusable popup-local shell boundary
- the doc names the first implementation slice and what it is intentionally not solving yet

Shipped first-cut plan:
- popup-local state owner:
- one dedicated popup-local zustand store per child window
- not a new singleton slice in the existing main workspace store
- why:
- popup-local multi-viewport layout should stay scoped to the child window that owns it
- this avoids forcing `useWorkspaceStore.ts` to become multi-window aware before the popup substrate is proven
- this also makes popup close semantics simpler because closing the child window can destroy its whole popup-local store with no lingering global layout state

- popup-local shell boundary:
- one new popup-local workspace shell component
- likely responsibilities:
- render popup-local `ViewportFrame`
- render popup-local layout tree from reused `WorkspaceLayoutNode` shapes
- host a popup-local surface registry rather than reusing the current `ViewportSurfaceRegistry.tsx` unchanged
- manage popup-local active slot and popup-local split menu state

- reusable substrate pieces:
- reuse directly:
- `WorkspaceViewportSlot`
- `WorkspaceLayoutLeafNode`
- `WorkspaceLayoutSplitNode`
- `WorkspaceLayoutNode`
- `createDefaultWorkspaceViewportSlot(...)`
- `createDefaultWorkspaceLayoutSplitNode(...)`
- `createNextWorkspaceGeneratedId(...)`
- `ViewportFrame.tsx`
- `ViewportWorkspaceHost.tsx`
- reuse with adapter layer:
- `SpaghettiPanel`
- later Browser panel shell
- later Console shell

- first validator strategy:
- validate the popup-local shell through `Spaghetti Editor` first
- default split behavior:
- splitting a popped-out `Spaghetti Editor` creates a second popup-local viewport that also starts as `Spaghetti Editor`
- required first validator behaviors:
- right-click popup titlebar split creates a second popup-local slot in the same child window
- the child window stays open
- either popup-local slot can use the existing `ViewportFrame` surface picker afterward
- the popup-local shell does not mutate the main workspace slot tree when it splits

- first implementation slice recommendation:
- first land a popup-local shell that supports:
- `Spaghetti Editor` as the source popup surface
- same-surface sibling default on split
- popup-local slot tree render through `ViewportFrame`
- popup-local surface switching for at least `Spaghetti Editor` and `modelViewer`
- defer Browser and Console as popup-local slot surfaces until after the shell and slot-tree behavior work

- why Browser and Console are deferred:
- Browser still depends on singleton `browserShell` state in `useWorkspaceStore.ts`
- Console still depends on the singleton `ConsoleDock`
- making either one the first validator would risk defining the popup-local substrate around the most globally coupled surfaces instead of the most reusable shell boundaries

Intentional non-goals for the first implementation slice:
- no popup-local drag-ghost prediction yet
- no popup-local persistence across reloads yet
- no Browser parity inside popup-local slots yet
- no Console parity inside popup-local slots yet
- no attempt to make popup-local layout share the existing main workspace store directly

## [x] Phase 4 - Popup-Local Workspace Shell First Implementation
### info
Purpose:
- build the first real popup-local multi-viewport shell using the architecture chosen in `Phase 3`

Current read:
- the architecture questions are now constrained enough to start implementation
- the safest first cut is to validate the popup-local shell with `Spaghetti Editor` as the source popup, same-surface sibling default on split, and popup-local `ViewportFrame` surface switching before Browser and Console are adapted into the same shell

Main work:
- add one dedicated popup-local zustand store per child window
- reuse the existing slot-tree shapes for popup-local slots and layout nodes
- build one popup-local workspace shell component that:
- renders popup-local `ViewportFrame`
- renders a popup-local layout tree
- owns popup-local split menu state
- owns popup-local active slot or surface state
- build one popup-local surface registry or adapter layer for the first validator path
- support popped-out `Spaghetti Editor` as the first popup-local source surface
- support same-surface sibling creation when the popup titlebar split is chosen
- support popup-local surface switching for at least:
- `Spaghetti Editor`
- `modelViewer`
- keep the child window alive after popup-local split
- keep popup-local layout mutations isolated from the main workspace store

Done shape:
- a popped-out `Spaghetti Editor` can open a popup-local split from its titlebar
- the child window stays open and now shows two popup-local viewports
- the new sibling viewport starts as `Spaghetti Editor`
- popup-local `ViewportFrame` surface switching works for the first supported surface set
- the main workspace slot tree is unchanged by popup-local split actions

Likely files:
- new popup-local workspace shell file under `src/app/workspace/`
- new popup-local workspace store file under `src/app/workspace/`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- new popup-local surface registry or adapter file under `src/app/workspace/`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- popup-shell tests, likely alongside existing host tests

Implementation boundaries:
- do keep the first validator on popped-out `Spaghetti Editor`
- do keep the new sibling default as the same surface kind as the source popup
- do support popup-local surface switching only for the first supported surface set
- do not widen this first implementation slice into Browser or Console popup-local parity yet
- do not widen into popup-local persistence, popup drag-ghost prediction, or Browser-shell migration
- do not let popup-local split mutate the main workspace slot tree

Verification target:
- popped-out `Spaghetti Editor` titlebar split creates a second popup-local viewport in the same child window
- the child window remains open after the split
- popup-local surface switching works for the first supported surfaces
- popup-local layout state is isolated from the main workspace layout state
- closing the child window tears down the popup-local store cleanly

Shipped first implementation read:
- added `src/app/workspace/PopupWorkspaceShell.tsx` as the first popup-local child-window shell with one popup-local zustand store, one popup-local slot tree, one popup-local active-slot owner, and one popup-local layout renderer that reuses the existing workspace slot and split node shapes
- reused `ViewportFrame.tsx` inside the popup-local shell and added `availableSurfaceKinds` so popup-local type switching can stay intentionally narrow without changing the main workspace defaults
- updated `SpaghettiWindowHost.tsx` so the popped-out `Spaghetti Editor` titlebar can open a popup-local four-way split menu, create a same-surface sibling viewport inside the same child window, and promote the popup from a single-surface shell into the new popup-local workspace shell after the split
- the first popup-local sibling default is now truthful:
- splitting a popped-out `Spaghetti Editor` creates a second popup-local `Spaghetti Editor`
- popup-local surface switching then supports `Spaghetti Editor` and `modelViewer`
- popup-local extra spaghetti viewports stay child-window-local:
- they are created from the spaghetti store
- their main-workspace placement and binding are immediately cleared
- they are filtered out of the normal host render list so they do not leak back into the main app as standalone floating or slotted editors
- `AppShell.tsx` now passes viewer activation into the popped-out spaghetti host so popup-local `modelViewer` slots can reuse `ViewportWorkspaceHost.tsx` as the first viewer boundary inside the child window
- focused host tests now prove:
- popup-local titlebar split opens a second viewport in the same child window
- the popup stays open
- the new sibling starts as `Spaghetti Editor`
- popup-local switching to `modelViewer` works
- the popup-owned sibling viewport does not appear back in the main app host tree

## [x] Phase 5 - Popup-Local Browser And Console Adoption Plan
### info
Purpose:
- adapt the next two popup adopters into the already-working popup-local shell without reopening the substrate decision that `Spaghetti Editor` already validated

Current read:
- `Phase 4` proved that a popped-out surface can promote from a single-surface child-window shell into a popup-local multi-viewport workspace that stays alive after split
- the next honest follow-up is to reuse that same child-window-local slot tree for more surface kinds rather than treating `Spaghetti Editor` as a one-off
- Console is the cleaner next adopter because it is less globally coupled than Browser
- Browser should still come after Console because it remains the most tied to singleton `browserShell` behavior

Main work:
- define the next popup-local surface registry expansion:
- add popup-local Console slot support to the popup-local shell
- then add popup-local Browser slot support after Console
- decide whether popup-local surface switching should expand in one step or in two smaller adopter passes
- trace the real adapter seams needed for Console:
- likely popup-local `ConsolePanel` body reuse without reviving the singleton floating console shell
- likely popup-local command submission and selection context rules
- trace the real adapter seams needed for Browser:
- likely decouple popup-local Browser slot rendering from the singleton `browserShell`
- likely introduce a popup-local Browser surface adapter instead of directly mounting the current copied popup shell
- keep the popup-local split contract unchanged:
- titlebar split inside the child window creates additional popup-local viewports
- the popup stays open
- same popup-local slot tree owns later surface switching

Done shape:
- the doc names the next adopter order and why
- the doc names the likely file seams for Console and Browser popup-local slot support
- the next implementation slice can target Console first without reopening the child-window-local workspace architecture

Likely files:
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- new popup-local surface adapter or registry file under `src/app/workspace/`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/ConsolePanel.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- popup-host and popup-shell tests

Planning boundaries:
- do keep the popup-local shell architecture from `Phase 4`
- do treat Console as the next adopter and Browser as the adopter after that
- do keep the popup alive after split and keep later surface switching popup-local
- do not widen this phase into popup-local persistence, drag-ghost prediction, or main-workspace split behavior
- do not silently redock popup-local Browser or Console slots into the main app

Verification target:
- the doc names the next adopter order and why
- the doc names the likely adapter seams for Console and Browser
- the next implementation slice can start with Console without revisiting the popup-local substrate decision

Current recommendation:
- adopt Console first:
- Console already behaves more like a reusable workspace surface body than Browser
- this should let the popup-local shell prove a second non-viewer, non-spaghetti surface kind before taking on Browser
- adopt Browser second:
- Browser still depends on singleton `browserShell` state and copied popup-shell behavior
- adapting it after Console keeps the next implementation slice smaller and lowers the risk of redefining the popup-local shell around the most coupled adopter
- after both are adapted, the popup-local shell should support at least:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- `browser`

Implementation-ready execution target:
- first code cut:
- adapt popup-local `console` slots into the existing `PopupWorkspaceShell.tsx`
- keep Browser explicitly deferred until the Console pass is stable
- the next implementation slice should:
- expand popup-local `ViewportFrame` surface switching from:
- `Spaghetti Editor`
- `modelViewer`
- to:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- render popup-local console slots through a popup-local console surface adapter instead of reusing the singleton floating console shell wholesale
- preserve the same popup-local split truth already proven by `Spaghetti Editor`:
- split happens inside the child window
- the popup stays open
- later surface switching remains popup-local
- keep the main workspace layout untouched by popup-local console adoption

Likely first implementation seams:
- `src/app/workspace/PopupWorkspaceShell.tsx`
- likely new popup-local console adapter file under `src/app/workspace/` or `src/app/console/`
- `src/app/panels/ConsolePanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- popup-shell tests, likely in `src/app/hosts/SpaghettiWindowHost.test.tsx` plus any focused popup-local shell coverage

Locked boundaries for the next code cut:
- do adapt Console first
- do not adapt Browser in the same slice unless the Console pass lands cleanly with obvious low-risk follow-on room
- do reuse the popup-local shell and slot tree from `Phase 4`
- do keep popup-local surface switching narrow at the first three kinds:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- do not silently route popup-local console slots back into the singleton main-console shell
- do not widen into popup-local Browser shell migration, persistence, or child-window drag-ghost work

Focused verification target for the next code cut:
- a popped-out `Spaghetti Editor` popup-local workspace can switch one popup-local slot to `Console`
- the popup stays open and continues to own both slots locally
- popup-local Console rendering works without mutating the main workspace slot tree
- popup-local split plus popup-local surface switching still works for `Spaghetti Editor` and `modelViewer`

Shipped Console-first adoption read:
- expanded popup-local surface switching in `PopupWorkspaceShell.tsx` from:
- `Spaghetti Editor`
- `modelViewer`
- to:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- popup-local console slots now render through a local adapter built from `ConsolePanel` plus `ConsoleBar`
- this keeps Console rendering inside the same child-window-local shell instead of routing through the singleton floating console owner
- focused popup-host coverage now proves:
- a popped-out `Spaghetti Editor` popup workspace can split locally
- one popup-local slot can switch to `Console`
- the popup stays open
- the popup-owned sibling still does not leak back into the main app host tree
- Browser remains deferred as the next popup-local adopter because its current popup and render path are still the most tied to singleton `browserShell` behavior

## [x] Phase 6 - Popup-Local Browser Adoption Plan
### info
Purpose:
- adapt Browser into the already-working popup-local shell after `Spaghetti Editor`, `modelViewer`, and `Console` have proven the child-window-local substrate

Current read:
- `Phase 4` proved the popup-local shell itself
- `Phase 5` proved that a second non-viewer, non-spaghetti surface kind can live inside that same shell
- Browser is now the next honest adopter, but it still carries the most singleton-state coupling because of `browserShell`

Main work:
- define the popup-local Browser adapter seam
- decide what Browser state must be localized or proxied so Browser can live in popup-local slots without pretending to be the singleton copied popup shell
- keep the popup-local split contract unchanged:
- popup stays open
- popup-local slot tree owns later switching
- main workspace layout stays untouched

Done shape:
- the next implementation slice can target Browser specifically instead of sharing a blended Browser/Console bucket with already-shipped Console work

Implementation-ready execution target:
- first code cut:
- expand popup-local surface switching from:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- to:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- `browser`
- add one popup-local Browser adapter inside the existing `PopupWorkspaceShell.tsx`
- do not reuse the current Browser copied popup shell directly inside popup-local slots
- do keep the popup-local split contract unchanged:
- split stays inside the child window
- the popup stays open
- later surface switching remains popup-local
- the main workspace layout stays untouched

Likely first implementation seams:
- `src/app/workspace/PopupWorkspaceShell.tsx`
- likely new popup-local Browser adapter file under `src/app/workspace/` or `src/app/panels/`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- popup-shell tests, likely in `src/app/hosts/SpaghettiWindowHost.test.tsx` plus any focused Browser panel coverage

Locked boundaries for the next code cut:
- do adapt Browser only in this slice
- do reuse the popup-local shell and slot tree from `Phase 4`
- do keep popup-local surface switching at the first four kinds:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- `browser`
- do not route popup-local Browser slots back through the singleton copied popup shell
- do not widen into Browser-shell migration outside popup-local slots, popup-local persistence, or child-window drag-ghost work

Focused verification target for the next code cut:
- a popped-out `Spaghetti Editor` popup-local workspace can switch one popup-local slot to `Browser`
- the popup stays open and continues to own both slots locally
- popup-local Browser rendering works without mutating the main workspace slot tree
- popup-local split plus popup-local surface switching still works for `Spaghetti Editor`, `modelViewer`, and `Console`

Shipped Browser adoption read:
- expanded popup-local surface switching in `PopupWorkspaceShell.tsx` from:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- to:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- `browser`
- popup-local Browser slots now render through a local `BrowserPanel` adapter inside the existing popup-local child-window shell instead of routing back through the singleton copied Browser popup shell
- focused popup-host coverage now proves:
- a popped-out `Spaghetti Editor` popup workspace can split locally
- one popup-local slot can switch to `Browser`
- the popup stays open
- the popup-owned sibling still does not leak back into the main app host tree
- with Browser now adopted, the first popup-local shell validator set reaches:
- `Spaghetti Editor`
- `modelViewer`
- `console`
- `browser`
