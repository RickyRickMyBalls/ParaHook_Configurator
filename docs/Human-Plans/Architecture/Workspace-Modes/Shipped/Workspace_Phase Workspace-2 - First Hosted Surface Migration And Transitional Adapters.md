# Workspace Phase Workspace-2 - First Hosted Surface Migration And Transitional Adapters

## Doc Header

### Doc History
3. 2026-03-30 07:49: Tightened this phase further into an implementation-ready `Workspace 2` spec by locking the umbrella question set into explicit answers, adding a sharper hosted-surface ownership direction, defining the first concrete state and type boundaries to move into `src/app/workspace/`, and clarifying the exact first-cut migration order plus done shape for the remaining editor placement extraction
2. 2026-03-30 07:37: Tightened this phase into the active post-`Workspace 1` implementation spec by grounding it in the shipped shared workspace-shell seam, locking that the next cut should extract the remaining editor placement truth plus first hosted-surface identity out of `useSpaghettiStore`, and adding concrete decisions, migration order, file targets, acceptance shape, and verification focus for the first real shared hosted-surface pass
1. 2026-03-29 15:03: Created this native Workspace-family future phase doc by re-homing the next open hosted-surface migration cut out of the mixed `05.1C` task-doc lane, locking that the first surface migration should reuse the new shared workspace owner plus the current host components instead of rewriting every floating/tiled path in one pass

### Purpose

Use this phase to migrate the first honest hosted surface set onto the shared workspace owner.

The goal is to broaden the workspace system carefully while preserving the current floating and docked proofs.

### Scope

This phase covers:
- first hosted-surface migration onto the shared workspace owner
- transitional adapter use of current hosts
- first pane-header and title-bar responsibilities
- first windowed/tiled transition rules
- first surface-instance identity rules

This phase does not cover:
- viewport-local chrome extraction
- persistence and saved modes
- full multi-window or browser pop-out work

## Doc Body

### Summary

`Workspace 2` is the first real hosted-surface migration phase.

It should deliver:
- one small honest hosted-surface set
- one clear transition contract between `Windowed` and `Tiled`
- one adapter-based path that preserves current shell behavior
- one stable base for later viewport-local chrome and persistence work

### Locked Direction

`Workspace 2` should be:
- a remaining placement-ownership extraction
- a first hosted-surface identity pass
- a preservation phase for the current shell proofs

`Workspace 2` should not be:
- a divider-authoring rewrite
- a viewport-chrome phase
- a persistence phase
- a browser pop-out phase

### Locked Outcome

At the end of `Workspace 2`:
- the first supported surfaces have explicit shared-owner-backed placement identity
- floating and tiled presentation both remain valid
- the current dock/floating shells survive as transition adapters where needed
- the remaining editor placement truth is no longer primarily owned by `useSpaghettiStore`
- pane switching and surface movement use one shared model instead of per-feature special cases

### Current Code Read

Current shipped seam after `Workspace 1`:
- `src/app/workspace/useWorkspaceStore.ts` owns left-dock and Browser shell state
- `BrowserDockHost` reads shared shell placement from that workspace seam
- floating Browser and floating `Spaghetti Editor` now share shell-level boundary behavior
- `useAppStore` remains the shared activation and intent seam

Main residue still blocking a broader hosted-surface model:
- `useSpaghettiStore` still owns editor viewport placement-facing state such as:
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
  - `setEditorViewportWindowMode`
  - `setEditorViewportSplitRatio`
  - `setEditorViewportSplitDirection`
  - `setEditorViewportSplitPriority`
  - `setEditorViewportPosition`
  - `setEditorViewportSize`

Practical read:
- `Workspace 1` solved the first shared shell-owner problem
- `Workspace 2` should now solve the first explicit hosted-surface placement problem
- the phase should widen the shared owner, not restart the shell

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-1 - Shared Workspace Owner And State Extraction.md`
- `docs/Phase-Plans/Tasks/Future/05.1C - VR-SP - Hybrid Tool Surface Hosting And Floating-Tiled Transitions.md`
- shipped split proof:
  - `docs/Phase-Plans/Tasks/Old/05.1B - VR-SP - Split Pane Authoring And Divider Controls.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/`

### Locked First Hosted Surface Set

The first hosted surface set should be:
- `Model Viewer`
- `Browser`
- `Console`
- `Spaghetti Editor`

Important rule:
- keep the first pass narrow and honest
- grow additional hosted surfaces only after this set is stable

### Locked Ownership Boundary

State that should move into the shared workspace seam during `Workspace 2`:
- hosted surface instance id
- hosted surface kind
- placement mode
- floating rect memory
- tiled assignment identity
- split direction, ratio, and priority ownership for the first hosted surfaces

State that should remain outside the shared workspace seam during `Workspace 2`:
- graph/editor authored data
- editor session behavior
- Browser feature logic
- Console feature logic
- viewer scene/content truth
- viewport-local chrome ownership

### Questions / Decisions

#### `Workspace 2.Q1` - What residue from shipped `Workspace 1` must move first?

Locked answer:
- move editor viewport placement and split ownership out of `useSpaghettiStore`
- keep editor session behavior and authored graph data feature-local
- make the shared workspace seam the owner of placement mode, floating rect memory, and tiled assignment truth for the first hosted surfaces

Why:
- this is the largest remaining ownership mismatch after `Workspace 1`
- it turns the current shell proof into the first real shared hosted-surface model

#### `Workspace 2.Q2` - What should the first honest hosted-surface identity model contain?

Locked answer:
- surface kind
- surface instance id
- placement mode
- floating rect memory
- tiled assignment identity
- pane-local header metadata where needed

Why:
- this is enough to host `Model Viewer`, `Browser`, `Console`, and `Spaghetti Editor` without cloning feature data
- it keeps shell identity separate from authored project state

#### `Workspace 2.Q3` - What should stay adapter-based during the migration?

Locked answer:
- keep `BrowserDockHost`
- keep `SpaghettiWindowHost`
- let them continue rendering the current shell proofs while placement identity and transitions move upward

Why:
- the host renderers already prove useful behavior
- replacing ownership is safer than rewriting every host in the same phase

#### `Workspace 2.Q4` - What must stay out of scope even after this phase is implementation-ready?

Locked answer:
- viewport-local chrome and toolbar-host ownership
- persistence and saved layout modes
- detached browser windows and true multi-window surface growth

Why:
- those belong to `Workspace 3`, `Workspace 4`, and `Workspace 5`
- widening scope here would blur the clean post-`Workspace 1` next cut

### Locked Transition Adapter Rule

Transitional adapters should preserve current behavior while the shared host model widens.

Recommended adapters:
- `BrowserDockHost`
- `SpaghettiWindowHost`

Important rule:
- adapters may continue rendering current floating or docked shells
- ownership and transition rules should still come from the shared workspace owner

### Locked Windowed And Tiled Rules

Every first-pass hosted surface should support:
- `Tile This Surface`
- `Float This Surface`

Rules:
- floating should preserve last floating rect
- tiling should preserve last tile placement when possible
- moving a hosted surface between placements should not create accidental hidden duplicate copies

### Locked Surface Identity Rule

The hosting model should distinguish:
- surface kind
- surface instance id
- placement mode
- instance-local UI state
- shared feature state where appropriate

Important rule:
- cloning a hosted surface is a shell concern
- cloning a hosted surface is not the same thing as cloning authored project data

### Locked Extraction Read

State that should move into the shared workspace seam during `Workspace 2`:
- editor placement mode
- editor floating rect memory
- editor tiled placement identity
- first explicit hosted-surface instance identity for the first surface set
- split direction, ratio, and priority ownership for the first hosted surfaces

State that should remain outside the shared workspace seam during `Workspace 2`:
- graph/editor authored data
- editor session behavior
- Browser feature logic
- Console feature logic
- viewer scene/content truth
- viewport-local chrome ownership

### Important Interfaces And Types To Lock

- `WorkspaceSurfaceKind`
  - `modelViewer`
  - `browser`
  - `console`
  - `spaghettiEditor`
- `WorkspaceSurfaceInstanceId`
  - stable shell identity for one hosted surface instance
- `WorkspacePresentationMode`
  - `windowed`
  - `tiled`
- `WorkspaceHostedSurfacePlacement`
  - surface instance id
  - placement mode
  - floating rect memory
  - tiled assignment identity
- `WorkspacePaneId`
  - stable tile host identity

Important rule:
- these types should describe shell placement identity
- they should not absorb feature-authored content or session data

### Locked Pane Header Responsibilities

Pane headers should own:
- current surface label
- pane-local surface switching
- `Float This Surface`
- close or merge actions

Floating title bars should continue to own:
- first split entry from windowed state

### First Implementation Cut

`Workspace 2` should land in the smallest safe sequence:

1. add first hosted-surface identity types under `src/app/workspace/`
2. expand shared workspace state so the first hosted surfaces can store placement mode, floating rect memory, tiled assignment identity, and split ownership there
3. move the remaining editor placement and split ownership out of `useSpaghettiStore` while preserving editor session behavior there
4. adapt `SpaghettiWindowHost` to read shared hosted-surface placement identity instead of editor-local placement truth
5. keep `BrowserDockHost` and `SpaghettiWindowHost` rendering through the new ownership model
6. preserve shipped `05.1B` split-authoring behavior and shipped `[5.1F]` activation rules

Important rule:
- do not rewrite divider behavior in this phase
- do not absorb viewport-local chrome, persistence, or browser pop-out work into this phase

### Likely Files

- `src/app/workspace/`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Concrete Implementation Targets

Recommended first file targets:
- `src/app/workspace/`
  - first hosted-surface identity types
  - expanded shared placement owner
- `src/app/AppShell.tsx`
  - adapt composition to read the widened workspace seam
- `src/app/hosts/BrowserDockHost.tsx`
  - keep Browser on adapter rendering while reading shared placement identity
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - stop reading long-term placement truth from `useSpaghettiStore`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - retain editor feature/session ownership only
- `src/app/store/useAppStore.ts`
  - keep activation and intent seams aligned with the widened hosted-surface model

Likely first type family:
- `WorkspaceSurfaceKind`
- `WorkspaceSurfaceInstanceId`
- `WorkspaceHostedSurfacePlacement`
- `WorkspacePaneId`
- `WorkspacePresentationMode`

### Acceptance And Done Shape

`Workspace 2` is done when:
- the first hosted-surface set is explicit and shared-owner-backed
- current floating behavior is preserved
- current split behavior is reused through the shared model
- pane headers and title bars have clear responsibilities
- surface-instance identity and transition rules are explicit
- editor placement truth is no longer primarily owned by `useSpaghettiStore`
- split ratio, split direction, and split priority for the first hosted surfaces are no longer editor-local ownership

### Verification Shape

Minimum verification for `Workspace 2` should cover:
- Browser and `Spaghetti Editor` still move correctly between floating and tiled states
- left-dock split entry still reuses the shipped `05.1B` split proof without behavior regressions
- active-surface and console-context sync still match shipped `[5.1F]`
- editor placement changes still preserve current floating position, split ratio, split direction, and split priority behavior
- no accidental hidden duplicate hosted surfaces appear when changing placement mode

Important non-goals during verification:
- do not require viewport-local chrome extraction yet
- do not require persistence yet
- do not require detached browser-window hosting yet
