# Workspace Phase Workspace-5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore

## Doc Header

### Doc History
2. 2026-03-30 12:18: Tightened `Workspace 5.1` into an implementation-ready editor pop-out spec by locking the owned restore-target contract, naming the current `SpaghettiWindowHost` and shared child-window seams that the first cut should touch, adding the first type and file targets under `src/app/workspace/`, and sharpening the acceptance plus verification shape before code work begins
1. 2026-03-30 12:14: Added this native Workspace-family follow-on after the shipped first `Workspace 5` slice, locking the next editor-facing cut around a real docked-right titlebar `Pop-Out` affordance for `Spaghetti Editor`, shared child-window owner transfer on top of the now-landed Browser/Console contract, and explicit dock-back restore behavior so editor pop-out does not invent a separate detached-shell system

### Purpose

Use this phase to give `Spaghetti Editor` a real browser-window `Pop-Out` path on top of the shared child-window workspace contract.

The goal is to make editor pop-out feel like a normal workspace placement transfer, not a one-off detached editor mode.

### Scope

This phase covers:
- a visible `Pop-Out` button in the editor titlebar controls
- editor child-window owner transfer through the shared workspace seam
- dock-back restore into the correct in-app editor placement
- activation and console-context continuity across in-app and child-window editor hosting

This phase does not cover:
- multiple graph documents open at once
- a rewrite of graph authored data ownership
- named saved-layout UX
- generic native desktop windowing

## Doc Body

### Summary

`Workspace 5.1` is the editor pop-out phase.

It should deliver:
- one real titlebar `Pop-Out` affordance for `Spaghetti Editor`
- one honest child-window owner-transfer path for the editor surface
- one stable dock-back restore target so the editor can come back to split, floating, or meatball placement cleanly

### Locked Direction

`Workspace 5.1` should be:
- an editor adoption phase of the already-shipped shared child-window host contract
- a titlebar affordance phase
- a restore-target phase

`Workspace 5.1` should not be:
- the multiple-graphs-at-once phase
- a rewrite of `useSpaghettiStore` graph authored data
- a new editor shell family separate from the workspace seam

### Locked Outcome

At the end of `Workspace 5.1`:
- `Spaghetti Editor` has a real visible titlebar `Pop-Out` control
- the editor can move into a child browser window through the same shared owner-transfer contract already used by `Console` and `Browser`
- the in-app editor owner collapses while the child window owns that editor surface instance
- docking back or closing the child window restores the correct in-app placement target instead of forcing one generic fallback shell
- the phase still leaves multiple-open-graph work for `Workspace 5.2` and `Workspace 5.3`

### Current Code Read

Current shipped seam after the first `Workspace 5` slice:
- `Console` and `Browser` already prove the shared child-window host contract under `src/app/workspace/`
- `SpaghettiWindowHost` still owns the live in-app editor shell renderers
- workspace and editor placement types already carry `separateWindow` vocabulary
- editor placement restore paths already exist for split, collapsed, maximized, and floating transitions
- `useWorkspaceStore` already owns the shared editor placement records while `useSpaghettiStore` survives as the editor-session and compatibility bridge

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5 - Multi-Window Surfaces And Detached Browser Pop-Out.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding.md`

Current code seams:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Observed live proof and residue:
- the shared child-window host contract already exists and is exercised by `ConsoleDock` plus `BrowserDockHost`
- the editor already carries restore semantics for split, collapsed, maximized, and floating modes, but not yet as an explicit child-window dock-back contract
- the editor titlebar controls still do not expose a normal `Pop-Out` affordance

Main residue still blocking honest editor pop-out:
- there is no visible editor titlebar `Pop-Out` button yet
- editor child-window ownership is not yet wired through the shared pop-out seam
- dock-back restore targets are still implicit in older in-app placement paths instead of being explicitly preserved for browser-window return

### Questions / Decisions

#### `Workspace 5.1.Q1` - Where should the editor `Pop-Out` affordance live?

Locked answer:
- put the editor `Pop-Out` button in the docked-right titlebar controls cluster beside the current window controls
- keep the same control available on the floating editor titlebar where the surface is still in-app owned
- mirror Browser wording so the control reads `Pop-Out` while the editor is in-app and `Dock` while the child window owns it

Why:
- it makes pop-out discoverable
- it keeps the control language consistent across Browser and editor surfaces

#### `Workspace 5.1.Q2` - What should move into the child window, and what must stay shared?

Locked answer:
- move only the editor DOM host and child-window-local chrome into the browser window
- keep graph authored data, editor session truth, workspace activation, and console-context routing shared
- treat the popped-out editor as the same editor surface instance, not a copied editor

Why:
- the child window is a placement transfer, not a second editor feature

#### `Workspace 5.1.Q3` - What should docking back restore?

Locked answer:
- preserve the editor's last in-app restore target before pop-out:
  - `split view`
  - `expanded`
  - `maximized`
  - `collapsed`
  - `meatball editor view` where supported
- docking back should restore that in-app target instead of always forcing one generic floating fallback

Why:
- editor pop-out should round-trip cleanly through the same workspace placement model

#### `Workspace 5.1.Q4` - What should still stay out of scope after this cut?

Locked answer:
- multiple graph documents open at once
- a general editor-surface instance library
- `Open Editors` UX redesign

Why:
- those belong to `Workspace 5.2` and `Workspace 5.3`

### Locked Ownership Rule

When `Spaghetti Editor` is popped out:
- the child window becomes the active owner of that editor surface instance
- the in-app editor shell collapses instead of remaining as a duplicate live owner
- shared graph and session truth stay in the existing stores

### Locked Restore Rule

Before moving the editor into a child window:
- capture its last honest in-app placement target
- store that target in shared workspace-owned editor placement truth, not only in local host refs

When it docks back:
- restore that target through the shared workspace seam first
- let `SpaghettiWindowHost` render the in-app shell from restored workspace ownership instead of rebuilding a separate ad-hoc return path

Important rule:
- `separateWindow` should become an honest workspace-owned placement state with an explicit restore target, not just a leftover vocabulary value

### First Implementation Cut

`Workspace 5.1` should land in the smallest safe sequence:

1. add explicit editor child-window placement and dock-back restore records under `src/app/workspace/`
2. wire `SpaghettiWindowHost` to read and write that placement through the shared workspace seam
3. add the editor titlebar `Pop-Out` / `Dock` control in the existing editor titlebar controls cluster
4. route editor child-window ownership through the shared `useWorkspaceChildWindow` contract
5. collapse the in-app owner while the child window owns the editor surface instance
6. restore the prior in-app placement target when the editor docks back or when the child window closes
7. keep graph/session authored state and active editor compatibility in `useSpaghettiStore`

Important rule:
- do not widen into multiple editor surface instances in this same cut

### Important Interfaces And Types To Lock

- `EditorSurfaceWindowMode`
  - make `separateWindow` an honest used mode instead of only leftover vocabulary
- `EditorWorkspaceSurfaceState`
  - add explicit child-window ownership and dock-back restore fields where needed
- `WorkspacePopoutSurfaceState`
  - reuse the shared child-window metadata contract already used by Browser
- `EditorSurfaceRestoreFromPopout`
  - capture the last honest in-app placement target before child-window transfer

Important rule:
- these types should describe placement ownership and restore behavior
- they should not absorb graph authored data or editor session payloads

### Concrete Implementation Targets

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Recommended first file targets:
- `src/app/workspace/workspaceShellTypes.ts`
  - canonical editor pop-out placement and dock-back restore records
- `src/app/workspace/useWorkspaceStore.ts`
  - shared editor child-window ownership and restore-target state
- `src/app/workspace/workspacePersistence.ts`
  - last-layout follow-through for supported editor pop-out records
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - titlebar affordance, owner-transfer wiring, and dock-back rendering behavior
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - compatibility bridge only where the focused editor/session runtime still depends on it

### Acceptance And Done Shape

`Workspace 5.1` is done when:
- the editor titlebar has a real `Pop-Out` affordance
- popping the editor out transfers ownership into a browser window through the shared child-window host rule
- the in-app owner collapses while the child window owns the editor
- closing or docking the child window restores the editor to the correct in-app placement target
- activation and console/workspace context still follow the editor surface correctly
- the phase does not require multiple editor surfaces yet in order to feel honest

### Verification Shape

Minimum verification for `Workspace 5.1` should cover:
- popping the editor out from a docked-right editor shell
- popping the editor out from a floating editor shell
- popping the editor out while the editor currently lives in `split view`
- docking back into the prior split/floating placement
- closing the child window and verifying clean owner handback
- focus and console-context continuity while the child window owns the editor
- persistence safety for any supported editor pop-out placement records
