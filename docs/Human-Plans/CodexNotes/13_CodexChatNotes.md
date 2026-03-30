# 13 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - workspace-modes implementation prep
  - validating the real workspace ownership seams in live code before `Workspace 1`
  - deciding the safest first implementation order across `05.0E`, `05.1A`, and later workspace follow-ons
- Primary source docs for this planning pass:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-0.1 - Codebase Research And Implementation Audit.md`
  - `docs/Phase-Plans/Tasks/Future/05.0E - VR-SP - Spaghetti Editor Surface Standardization And Viewport-Type Cleanup.md`
  - `docs/Phase-Plans/Tasks/Future/05.1A - VR-SP - Workspace Layout Foundation And Left-Dock Entry.md`
  - `docs/Phase-Plans/Tasks/Future/05.1C - VR-SP - Hybrid Tool Surface Hosting And Floating-Tiled Transitions.md`
  - `docs/Phase-Plans/Tasks/Future/05.1D - VR-SP - Workspace Persistence, Saved Modes, And Migration.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.
- Entry status markers:
  - `[ ]` = still open / still driving active work
  - `[x]` = completed or superseded enough that it is no longer the active entry

## Doc Body

## Session 1 Notes

##### [ ] [210] 2026-03-29 14:59 - Workspace implementation should start with shared ownership extraction, not new split behavior

Context block:

- a direct code read was done against:
  - `src/app/AppShell.tsx`
  - `src/app/hosts/useAppShellDockController.ts`
  - `src/app/hosts/BrowserDockHost.tsx`
  - `src/app/hosts/SpaghettiWindowHost.tsx`
  - `src/app/store/useAppStore.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/components/ViewerHost.tsx`
- the workspace architecture docs already suggested that ownership was mixed, but this pass confirms the exact live split

Locked direction:

- start implementation with `05.1A`
- treat `05.1B` as shipped behavior to reuse, not as the next open architecture problem
- create one native shared workspace owner under `src/app/workspace/` before broadening the number of hosted surfaces
- keep `BrowserDockHost` and `SpaghettiWindowHost` as transition adapters during that extraction instead of rewriting every renderer immediately
- keep `useAppStore` as the shared activation and cross-surface intent seam
- move placement and layout truth out of `useSpaghettiStore` over time

Why this matters:

- the code already has usable split, dock, and activation proofs
- the main risk is duplicated or conflicting ownership, not lack of split mechanics
- leading with another UI-level split pass would harden the wrong boundaries around editor-specific state

##### [ ] [211] 2026-03-29 14:59 - Current workspace ownership is split across shell-local React state, app-global activation, and editor-local placement

Current seam read:

- `AppShell` still owns shell-local layout state such as:
  - `leftDockWidth`
  - `isLeftDockViewportSplit`
  - `isBrowserFloating`
  - `workspaceSplitMenu`
- `useAppStore` already owns the strongest shared workspace seam through:
  - `workspaceSelection.activeSurface`
  - `floatingShellActivationRequest`
  - `requestConsoleContextSync`
- `useSpaghettiStore` still owns placement data that now behaves like shell state:
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
  - `setEditorViewportWindowMode`
  - `setEditorViewportSplitRatio`
  - `setEditorViewportSplitDirection`
  - `setEditorViewportSplitPriority`
  - `setEditorViewportPosition`
  - `setEditorViewportSize`

Locked direction:

- the first workspace implementation should separate:
  - workspace placement and pane ownership
  - shared activation and intent routing
  - feature-local authored/session state
- `useSpaghettiStore` should keep graph/editor behavior
- the new workspace seam should own placement/presentation records that can later serve `Browser`, `Console`, `Model Viewer`, and `Spaghetti Editor` honestly

Why this matters:

- today the app behaves like one partial hybrid workspace, but its truth is split across three different ownership layers
- unifying that truth is the cleanest way to prepare later tiled/windowed/persistence work without regressing current shells

##### [ ] [212] 2026-03-29 14:59 - Viewport-local chrome is the next real follow-on after shared workspace ownership exists

Current seam read:

- `ViewerHost` is still mounted as one singleton viewer surface
- `ViewToolbar` is mounted globally from `AppShell`
- `ViewportOverlay` is also mounted globally from `AppShell`
- the viewer behavior seam itself is already rich enough for viewport-scoped tools, but the chrome ownership seam is not yet per-viewport

Locked direction:

- do not start with multi-viewport rendering
- first define one shared workspace owner
- then move viewport-local chrome toward viewport-instance ownership as the next honest follow-on
- treat this as the natural bridge between `05.1A` foundation work and the later broader hosted-surface/multi-viewport family growth

Why this matters:

- a second real `Model Viewer` pane cannot own its own `View`, `Gizmo`, or command-toolbar host honestly while those surfaces still mount globally from `AppShell`
- this is the strongest live code reason to keep viewport-local chrome as its own explicit future phase instead of burying it inside a larger hosting rewrite

##### [ ] [213] 2026-03-29 14:59 - Safe workspace implementation order after the audit

Recommended order:

- optional narrow bridge:
  - `05.0E` for naming and titlebar vocabulary cleanup if the editor/meatball wording is actively getting in the way of implementation
- first real implementation cut:
  - `05.1A`
    - add the shared workspace owner
    - define workspace layout types
    - migrate left-dock entry and protected viewer rules into that shared seam
- second cut:
  - `05.1C`
    - migrate the first honest hosted surface set onto the shared owner while preserving current floating behavior
- third cut:
  - `05.1D`
    - persist the shared workspace state
    - remove long-term dependence on the older special-case split/meatball path

Important rule:

- `05.1B` should be reused as shipped proof and behavior guidance during `05.1A` and `05.1C`
- it should not delay the ownership extraction work

Why this matters:

- this order matches the real code seams
- it minimizes risk by preserving the current hosts while changing ownership first
- it also keeps future browser pop-out and multi-window work attached to one honest shared surface model
