# Workspace Phase Workspace-0.1 - Codebase Research And Implementation Audit

## Doc Header

### Doc History
2. 2026-03-27 15:12: Implemented the first real `Workspace 0.1` research pass against the current codebase, adding a bottom-of-file report that audits `AppShell`, host seams, app/store ownership, viewport state, and viewer integration so later workspace phases can start from the real shell shape instead of the older architecture guess
1. 2026-03-27 15:06: Created this first native Workspace-family future doc as a pre-implementation research phase so `Workspace 0.1` can audit the real shell, host, store, and viewport seams already present in code before later workspace implementation phases harden around stale assumptions

### Purpose

Use this phase to study the current ParaHook codebase before `Workspace 1` starts implementation work.

The goal is not to add new behavior yet.

The goal is to:
- identify what workspace-like behavior already exists
- separate shell ownership from feature-local ownership
- find the smallest honest migration path into a shared workspace seam

### Scope

This phase should stay read-heavy and architecture-heavy.

It should answer what we already have, what is coupled the wrong way today, and what the first believable implementation cuts should be.

## Doc Body

### Summary

ParaHook already has partial workspace behavior spread across `AppShell`, host surfaces, app-global stores, and feature-local stores.

Before the family implements a native shared workspace system, it should audit those seams directly in code and record:
- what already works
- what is feature-specific legacy carryover
- what can be reused
- what should move into a dedicated workspace seam

### Current Code Seams To Audit

- `src/app/AppShell.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/workspaceSplitTypes.ts`
- `src/app/components/ViewerHost.tsx`

### Research Questions

#### Question 1

What code paths already own layout, docking, split, and surface-hosting behavior today?

##### Question 1 Suggestion

Audit `AppShell`, `BrowserDockHost`, `SpaghettiWindowHost`, and `useAppShellDockController` first so the family can map the real shell-level placement seams before it starts moving ownership.

#### Question 2

What current split and dock behavior is already generic enough to reuse inside a dedicated `src/app/workspace/` seam?

##### Question 2 Suggestion

Treat `workspaceSplitTypes`, shell-level host rendering, and any existing pane or dock rules as likely salvage candidates unless they are tightly coupled to a single feature surface.

#### Question 3

What state is currently owned by the wrong layer?

##### Question 3 Suggestion

Compare `useAppStore` and `useSpaghettiStore` to identify where shell concerns like placement, active surface, or layout behavior are still mixed into feature-specific state.

#### Question 4

What viewport-specific seams will be needed to support viewport-local chrome and toolbar hosts later?

##### Question 4 Suggestion

Audit `ViewerHost` and related model-viewport integration points to see where a viewport instance could later own its own `View`, `Gizmo`, and command-toolbar host area without becoming the owner of the whole app shell.

### Expected Research Output

This phase should leave behind:
- one honest inventory of existing workspace-like seams
- one list of reusable shell pieces
- one list of feature-local ownership that must stay out of the workspace seam
- one first migration outline for `Workspace 1`

### Good Outcome

A good outcome for `Workspace 0.1` is that later phases stop guessing.

By the end of this phase, the family should know where layout ownership really lives today, what can be reused, and what the safest first implementation path will be.

## Report

### Audit Status

This first `Workspace 0.1` audit confirms that ParaHook already has a partial hybrid workspace system in code.

What is already real today:
- one app-shell composition seam in `src/app/AppShell.tsx`
- one app-global active-surface and target-selection seam in `src/app/store/useAppStore.ts`
- one floating and split-capable editor viewport model in `src/app/spaghetti/store/useSpaghettiStore.ts`
- one dedicated floating-or-docked `Browser` host in `src/app/hosts/BrowserDockHost.tsx`
- one dedicated floating, split, and meatball-dock `Spaghetti Editor` host in `src/app/hosts/SpaghettiWindowHost.tsx`

Important reality check:
- `Windowed` is real
- `Tiled` is partially real through the current split system
- later browser `Pop-Out` is not implemented yet
- `separateWindow` exists in type vocabulary only and does not currently have a live code path

### Question 1 Answer

What code paths already own layout, docking, split, and surface-hosting behavior today?

Current answer:
- `AppShell` owns the top-level shell composition, left-dock width, left-dock viewport split toggle, split-menu UI, and activation glue
- `BrowserDockHost` owns all `Browser` placement behavior between docked and floating presentation
- `SpaghettiWindowHost` owns nearly all `Spaghetti Editor` placement behavior between floating, split, and meatball-dock presentation
- `useAppShellDockController` owns left-dock target geometry, resize behavior, menu dismissal, and left-dock split toggling
- `useSpaghettiStore` owns the actual persisted editor viewport records, including `windowMode`, `position`, `size`, `splitRatio`, `splitDirection`, and `splitPriority`
- `useAppStore` owns cross-surface activation and selection through `workspaceSelection.activeSurface` and related selection state

Practical read:
- shell composition is in `AppShell`
- actual `Browser` host rules are in `BrowserDockHost`
- actual `Spaghetti Editor` host rules are in `SpaghettiWindowHost`
- cross-surface activation is in `useAppStore`
- editor viewport placement state still lives inside `useSpaghettiStore`

### Question 2 Answer

What current split and dock behavior is already generic enough to reuse inside a dedicated `src/app/workspace/` seam?

Reusable pieces:
- `workspaceSplitTypes.ts` is already a neutral seam for split direction and priority
- `workspaceSelection.activeSurface` in `useAppStore` is already the right kind of app-global shell seam
- `floatingShellActivationRequest` and `requestConsoleContextSync` already act like reusable shell-intent signals
- `useAppShellDockController` contains useful generic mechanics for dock-target hit testing, resize menus, dismissal, and width clamping
- `SpaghettiWindowHost` already proves a real split renderer, divider behavior, ratio control, and floating-to-split transitions
- `BrowserDockHost` already proves that one surface can move between docked and floating presentation without becoming a different feature

Salvageable pattern:
- keep the idea of host components that render one surface in different presentations
- keep a neutral split-type seam
- keep app-global activation in `useAppStore`
- move placement ownership out of feature stores over time

### Question 3 Answer

What state is currently owned by the wrong layer?

Main ownership problem:
- the current editor viewport placement model is still owned by `useSpaghettiStore`, even though it now acts like shell-level workspace state

That includes:
- `editorViewportsById`
- `editorViewportOrder`
- `activeEditorViewportId`
- `setEditorViewportWindowMode`
- `setEditorViewportSplitRatio`
- `setEditorViewportSplitDirection`
- `setEditorViewportSplitPriority`
- `setEditorViewportPosition`
- `setEditorViewportSize`

Why that matters:
- this is honest for a pure editor-only app
- it is no longer honest for ParaHook now that `Browser`, `Console`, `Viewer`, and later other surfaces all need shared workspace rules

Second ownership split:
- `AppShell` still carries important shell state as local React state, including `leftDockWidth`, `isLeftDockViewportSplit`, `isBrowserFloating`, and menu state
- that is acceptable for the current transitional shell, but it means layout truth is currently split between React local state, `useAppStore`, and `useSpaghettiStore`

Healthy boundary going forward:
- `useAppStore` or a dedicated `src/app/workspace/` seam should own workspace-wide placement and active-surface truth
- feature stores should keep feature-specific authored data and command/session state
- `useSpaghettiStore` should stop being the hidden owner of long-term workspace placement

### Question 4 Answer

What viewport-specific seams will be needed to support viewport-local chrome and toolbar hosts later?

Current answer:
- `ViewerHost` is a singleton viewer mount, not a multi-viewport host model
- `ViewToolbar` is mounted globally from `AppShell`, not per viewport instance
- `ViewportOverlay` is also mounted at the shell level
- `ViewerHost` already owns rich viewer interaction callbacks for selection, sketch-plane pick, geometry sketch, and reference transform, so it is the right behavioral seam for viewport-scoped tools

What this means:
- ParaHook already has a strong behavioral viewport seam
- ParaHook does not yet have a per-viewport chrome ownership seam

Important architectural implication:
- a future second `Model Viewport` cannot honestly get its own `View`, `Gizmo`, and command-toolbar host until viewport chrome stops being globally mounted
- the next step is not many viewers at once
- the next step is defining one viewport-instance shell contract that can later own its own local chrome

### Current Workspace Inventory In Code

Real surface-like things already present:
- `viewer`
- `spaghetti`
- `browser`
- `console`

This is also the current `WorkspaceSurface` union in `useAppStore`.

Real presentations already present:
- floating editor window
- maximized editor window
- collapsed editor window
- editor split view
- meatball editor dock
- floating browser
- docked browser

Not yet real as workspace hosting:
- arbitrary pane-hosted surfaces beyond the current editor split proof
- multi-viewport viewer hosting
- later browser-window `Pop-Out`

### Reusable Architecture Pieces

Keep and build on:
- `src/app/workspace/workspaceSplitTypes.ts`
- `workspaceSelection.activeSurface`
- `floatingShellActivationRequest`
- `requestConsoleContextSync`
- host-component pattern in `BrowserDockHost` and `SpaghettiWindowHost`
- dock controller utilities in `useAppShellDockController`

Do not freeze as final architecture:
- editor viewport placement living in `useSpaghettiStore`
- browser floating state living as isolated local state inside `AppShell` and `BrowserDockHost`
- viewport chrome mounted globally when it really belongs to the viewport instance

### Smallest Honest Migration Path

Recommended `Workspace 1` implementation path:

1. create a dedicated `src/app/workspace/` seam for neutral workspace types and placement state
2. move app-global placement ownership there first for active surface, supported surface kinds, and layout/presentation records
3. keep `SpaghettiWindowHost` and `BrowserDockHost` as host renderers during transition instead of rewriting all rendering at once
4. adapt `useSpaghettiStore` so editor-specific data stays there, but viewport placement stops being the long-term source of truth
5. convert current split proof into one honest workspace-hosted surface arrangement before attempting multi-window or true browser `Pop-Out`

Recommended first supported surface set remains:
- `Model Viewport`
- `Spaghetti Editor`
- `Browser`
- `Console`

### Implementation Risks

Main risks:
- moving too much at once and breaking the current editor host behavior
- confusing viewport-specific command state with workspace placement state
- trying to implement pop-out or multiple true viewports before the first shared workspace owner exists

Safe rule:
- preserve the current host components as adapters during migration
- move ownership before broadening the number of hosted surfaces

### Final Conclusion

`Workspace Modes` is not stale as an idea, but the codebase is more advanced and more uneven than the doc originally implied.

The real current shape is:
- one partial hybrid shell already exists
- one real active-surface seam already exists
- one editor-specific placement model is doing too much shell work
- one viewer seam exists, but viewport-local chrome is not yet owned per viewport instance

That makes the right next move clear:
- `Workspace 1` should begin by creating one neutral workspace owner above the current editor-specific viewport state
- then reuse the current hosts as transition adapters
- then broaden into true workspace-hosted surfaces and later viewport-local chrome
