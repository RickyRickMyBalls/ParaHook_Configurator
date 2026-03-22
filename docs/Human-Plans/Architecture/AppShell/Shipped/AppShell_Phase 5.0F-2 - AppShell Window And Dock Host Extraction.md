# AppShell Phase 5.0F-2 - AppShell Window And Dock Host Extraction

## Doc Header

### Doc History
2. 2026-03-22 14:12: Marked this phase complete after shipping `BrowserDockHost`, `SpaghettiWindowHost`, and `useAppShellDockController`, adding focused host coverage, and promoting this phase record into `Shipped/`
1. 2026-03-22 13:28: Created this standalone future phase doc for `[5.0F-2]`, translating the remaining browser/editor shell-controller overload in `AppShell.tsx` into an implementation-ready extraction plan around `BrowserDockHost`, `SpaghettiWindowHost`, and the shared shell state that should stay in `AppShell` for the first cut

### Purpose

This doc defines the second implementation cut under the AppShell cleanup family.

Use it to answer:
- what `[5.0F-2]` should move out of `AppShell`
- what shared shell state should stay in `AppShell` for the first cut
- which files are the safe landing zones for the remaining browser/editor controller seams
- how to keep the cut narrow enough to land before `[5.1] Workspace Modes`

### Why This Phase Exists

After shipped `[5.0F-1]`, `AppShell.tsx` no longer owns the radio/sampler runtime cluster.

The remaining overload is now the browser/editor shell-controller layer:
- browser popout and dock controller behavior
- left-dock resize and dock-preview behavior
- spaghetti floating, split, and meatball shell behavior
- inline titlebar action handling
- split detach and bottom-dock re-entry behavior
- workspace split menu control flow

This phase exists to isolate that remaining controller logic before `[5.1] Workspace Modes` asks the same area to become a broader workspace host.

### Scope

This phase covers:
- extracting browser dock/floating controller logic into a dedicated host seam
- extracting spaghetti floating/split/meatball shell logic into a dedicated host seam
- moving the inline `SpaghettiWindowTitleBar` out of `AppShell.tsx`
- preserving the current shell layout, store contracts, and CSS class names

This phase does not cover:
- workspace-mode model changes
- radio runtime changes
- theme or CSS cleanup
- store redesign for browser or spaghetti
- new shell menus beyond parity extraction
- new roadmap IDs

## Doc Body

## [x] - `[5.0F-2]` - `AppShell Window And Dock Host Extraction`

### Header

Purpose:
- move the remaining browser/editor window and dock controller logic out of the main shell body while preserving the current shell layout

Owns:
- mounted `BrowserDockHost` seam
- mounted `SpaghettiWindowHost` seam
- browser popout/dock controller state and floating browser shell
- spaghetti floating/split/meatball shell rendering and titlebar behavior
- shell-controller pointer math tied only to those browser/editor seams

Keeps in `AppShell`:
- top-level `LeftDock` / `ViewportArea` / `ConsoleDock` / `RadioPanel` / `RadioRuntimeHost` / `ViewToolbar` composition
- workspace-wide active-surface coordination
- shell-wide left-dock width and dock-preview truth that is still shared across browser layout, console offset, and spaghetti docking
- left-dock resize menu and workspace split menu anchor state
- later workspace-mode evolution beyond parity extraction

### Shipped Result

- `src/app/hosts/BrowserDockHost.tsx` now owns the browser dock/floating state, clamp helpers, pointer drag/dock logic, and docked/floating browser rendering through the existing shell anchors.
- `src/app/hosts/SpaghettiWindowHost.tsx` now owns the inline `SpaghettiWindowTitleBar`, per-viewport window UI maps, floating/split/meatball render branches, floating drag/resize, split detach, bottom split re-entry, and meatball docking behavior.
- `src/app/hosts/useAppShellDockController.ts` now owns the remaining AppShell-side left-dock resize lifecycle, resize-menu actions, shared dock-preview resolution, and menu outside-click handling.
- `src/app/AppShell.tsx` now reads mainly as the shell compositor plus shared shell-state owner, mounting the new browser and spaghetti hosts while preserving shared left-dock/menu truth and active-surface coordination.
- `src/app/hosts/BrowserDockHost.test.tsx` and `src/app/hosts/SpaghettiWindowHost.test.tsx` now cover the extracted host seams directly alongside the existing AppShell parity suite.

### Current Seam Read

- Browser cluster in `AppShell` currently includes:
  - `isBrowserFloating`
  - `isBrowserCollapsed`
  - `browserFloatingPos`
  - `browserFloatingSize`
  - browser clamp helpers
  - browser drag refs and dock-intent refs
  - docked browser render block
  - floating browser render block

- Spaghetti cluster in `AppShell` currently includes:
  - inline `SpaghettiWindowTitleBar`
  - `windowSettingsOpenByViewportId`
  - `actionTrayExpandedByViewportId`
  - `windowAppearanceByViewportId`
  - `windowClampEditingByViewportId`
  - `headerToggleRevisionByViewportId`
  - floating drag and resize refs
  - split-titlebar detach and split-divider controller helpers
  - meatball render block
  - split render block
  - floating render block
  - bottom split dock preview behavior

- Shared shell truth that should stay in `AppShell` for this phase:
  - `leftDockWidth`
  - `isLeftDockViewportSplit`
  - `activeLeftDockPreviewPanelId`
  - `leftDockResizeMenu`
  - `workspaceSplitMenu`
  - workspace active-surface sync and console-context clear behavior
  - existing store-backed split ratio/direction/priority actions routed through the current shell layer

### Questions / Decisions

#### [x] - `q1` What is the first safe host shape?

##### Suggestion
- land `[5.0F-2]` as two host seams in one roadmap phase:
  - `src/app/hosts/BrowserDockHost.tsx`
  - `src/app/hosts/SpaghettiWindowHost.tsx`
- do not create one giant `WindowDockHost` that simply becomes the next overloaded file
- do not add more roadmap IDs unless implementation proves the two-seam cut is still too risky

#### [x] - `q2` Where should `SpaghettiWindowTitleBar` live?

##### Suggestion
- move it out of `AppShell.tsx` with the `SpaghettiWindowHost` extraction
- keep it local inside `SpaghettiWindowHost.tsx` in the first cut
- only split it into `src/app/hosts/SpaghettiWindowTitleBar.tsx` if the host becomes too large during implementation

#### [x] - `q3` What state should stay in `AppShell`?

##### Suggestion
- keep shell-wide shared state in `AppShell` for the first cut:
  - `leftDockWidth`
  - `isLeftDockViewportSplit`
  - `activeLeftDockPreviewPanelId`
  - left-dock resize menu state
  - workspace split menu state
  - active-surface coordination and console-context sync
- pass only the minimum needed props into the new hosts
- do not create a new shared controller store just to avoid props

#### [x] - `q4` How should verification work after extraction?

##### Suggestion
- keep `src/app/AppShell.test.tsx` as the main regression harness because it already covers the real dock, floating, split, and titlebar behavior
- add focused host tests for the extracted seams:
  - `src/app/hosts/BrowserDockHost.test.tsx`
  - `src/app/hosts/SpaghettiWindowHost.test.tsx`
- treat the current rendered behavior in the AppShell integration suite as canonical

### Implementation Spec

Recommended file changes:
- edit `src/app/AppShell.tsx`
- create `src/app/hosts/BrowserDockHost.tsx`
- create `src/app/hosts/SpaghettiWindowHost.tsx`
- create `src/app/hosts/BrowserDockHost.test.tsx`
- create `src/app/hosts/SpaghettiWindowHost.test.tsx`
- optional only if `SpaghettiWindowHost.tsx` becomes too large during implementation:
  - create `src/app/hosts/SpaghettiWindowTitleBar.tsx`
- no CSS changes planned beyond parity-preserving wrapper retention if extraction requires it

Implementation steps:
1. create `src/app/hosts/SpaghettiWindowHost.tsx`
2. move the inline `SpaghettiWindowTitleBar` into the host file as a local component
3. move the per-viewport spaghetti window UI maps into the host:
   - `windowSettingsOpenByViewportId`
   - `actionTrayExpandedByViewportId`
   - `windowAppearanceByViewportId`
   - `windowClampEditingByViewportId`
   - `headerToggleRevisionByViewportId`
4. move the spaghetti-only drag, resize, split-titlebar, bottom-dock-preview, and meatball docking refs, effects, and handlers into `SpaghettiWindowHost`
5. move the meatball, split, and floating spaghetti render blocks into `SpaghettiWindowHost`
6. keep AppShell-owned shell-wide state and callbacks that both browser and spaghetti still share, and pass them into `SpaghettiWindowHost` through a narrow prop surface
7. create `src/app/hosts/BrowserDockHost.tsx`
8. move the browser-only state, refs, clamp helpers, floating/dock handlers, and docked/floating browser render blocks into `BrowserDockHost`
9. keep AppShell-owned shell-wide left-dock state and menu openers where they are still shared by browser layout, console offset, and spaghetti docking behavior
10. replace the removed inline render/controller blocks in `AppShell` with mounted host seams plus the existing viewer, console, radio, and toolbar mounts
11. add focused host tests while keeping the existing AppShell integration assertions intact
12. run the regression suite and build without widening into workspace-mode restructuring

Required behavior-preservation rules:
- do not rename the existing CSS class families for browser, split shells, floating shells, left dock resize handles, or workspace split menus
- do not redesign the browser popout model
- do not redesign spaghetti window modes or split semantics
- do not change the `useSpaghettiStore` or `useAppStore` contracts just to make extraction easier
- do not widen into `[5.1] Workspace Modes`
- treat the current AppShell integration behavior as the canonical parity target

Expected `AppShell` cleanup after this phase:
- `AppShell.tsx` no longer defines `SpaghettiWindowTitleBar`
- browser controller state and floating render blocks are no longer inline in `AppShell`
- spaghetti floating, split, and meatball controller state and render blocks are no longer inline in `AppShell`
- the remaining `AppShell` body reads mainly as:
  - top-level shell layout
  - mounted browser/spaghetti host seams
  - active-surface coordination
  - shell menus and shared layout state
  - radio/runtime/view-toolbar mounts

Verification:
- run:
  - `src/app/AppShell.test.tsx`
  - `src/app/hosts/BrowserDockHost.test.tsx`
  - `src/app/hosts/SpaghettiWindowHost.test.tsx`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/SpaghettiPanel.test.tsx`
- manually smoke-check:
  - browser popout and re-dock
  - browser drag from dock to floating and floating back to dock
  - left dock resize and default-width reset
  - left dock split toggle and resize-menu split action
  - split divider drag, reset, and priority menu actions
  - floating spaghetti drag and resize
  - `ctrl`-click and `ctrl`-drag split-titlebar detach behavior
  - bottom split ghost docking
  - meatball dock drag out and re-dock
  - titlebar actions: build, advanced tray toggle, header toggle, canvas toggle, maximize, split, close
- run a production build and record unrelated failures separately rather than widening the phase

Definition of done:
- `AppShell` mounts dedicated browser and spaghetti host seams instead of owning those controller clusters inline
- `SpaghettiWindowTitleBar` no longer lives in `AppShell`
- visible shell layout is materially unchanged
- browser dock/floating behavior and spaghetti split/floating/meatball behavior remain green in tests
- `AppShell` is left as a thin shell compositor plus shared shell-state coordinator ahead of `[5.1]`
