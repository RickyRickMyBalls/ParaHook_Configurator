# Workspace Phase Workspace-1 - Shared Workspace Owner And State Extraction

## Doc Header

### Doc History
3. 2026-03-30 07:37: Cleaned up this phase after the shipped `Workspace 1` first slice by recording what actually landed in code, narrowing the phase outcome from the older full extraction wording to the honest shared-shell-owner cut that shipped, and explicitly rolling the remaining editor placement extraction forward into `Workspace 2`
2. 2026-03-30 06:36: Tightened this phase into a more implementation-ready `Workspace 1` spec by locking the phase questions into explicit decisions, grounding the first extraction cut in the live `AppShell`, `useAppStore`, and `useSpaghettiStore` seams, adding a concrete migration sequence plus file targets, and defining a sharper verification shape for the first shared workspace owner pass
1. 2026-03-29 15:03: Created this native Workspace-family future phase doc by re-homing the first open workspace implementation cut out of the mixed `05.1A` task-doc lane, locking that the next code work should start with one shared workspace owner under `src/app/workspace/` plus placement-state extraction above the current editor-specific store seams

### Purpose

Use this phase as the canonical record for the shipped first shared workspace-owner cut for ParaHook.

The goal of the shipped slice was to stop treating key shell placement like ad hoc `AppShell` state and move the app toward one reusable shell-owned workspace seam.

### Scope

This phase covers:
- one shared workspace owner under `src/app/workspace/`
- first neutral workspace layout and placement types
- extraction of shell/workspace placement state out of editor-local ownership
- reuse of the current left-dock entry seam
- reuse of the already-shipped activation and split proof

This phase does not cover:
- broad hosted-surface migration
- viewport-local chrome extraction
- workspace persistence
- browser pop-out

## Doc Body

### Summary

`Workspace 1` is the first ownership phase.

It delivered:
- one shared workspace seam above the old shell-local state
- one first extraction path for left-dock and Browser shell placement truth
- one clean bridge from the current left-dock/split proof into the shared workspace model
- one shell-level floating parity rule shared by Browser and the floating `Spaghetti Editor`

### Shipped Status

This phase is now best read as:
- shipped first slice
- not a full workspace-hosting migration
- not the final removal of editor placement ownership from `useSpaghettiStore`

Practical read:
- the first shared workspace seam now exists under `src/app/workspace/`
- `AppShell` no longer owns the main Browser plus left-dock shell state directly
- the remaining placement-heavy editor viewport truth is the main residue that rolls into `Workspace 2`

### Locked Outcome

At the end of `Workspace 1`:
- the app has one honest shared workspace owner near `AppShell`
- left-dock shell state and Browser shell state are no longer owned directly by `AppShell`
- the current shell keeps working through transition adapters
- Browser and floating `Spaghetti Editor` share shell-level floating boundary behavior
- later hosted-surface, viewport-chrome, and persistence work now have one stable home
- full editor placement extraction remains follow-on work rather than a shipped part of this phase

### Current Code Read

Current shipped ownership split:
- `src/app/workspace/useWorkspaceStore.ts` now owns shared shell placement state such as:
  - `leftDockWidth`
  - `isLeftDockViewportSplit`
  - `workspaceSplitMenu`
  - Browser floating versus docked state
  - Browser floating geometry and collapsed state
- `useAppStore` already owns the strongest shared workspace seam through:
  - `workspaceSelection.activeSurface`
  - `floatingShellActivationRequest`
  - `requestConsoleContextSync`
- `useSpaghettiStore` still owns the main remaining placement-facing editor viewport state such as:
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
  - `setEditorViewportWindowMode`
  - `setEditorViewportSplitRatio`
  - `setEditorViewportSplitDirection`
  - `setEditorViewportSplitPriority`
  - `setEditorViewportPosition`
  - `setEditorViewportSize`

Additional shipped behavior read:
- `BrowserDockHost` now reads shared shell placement from the workspace seam
- `SpaghettiWindowHost` now floats on the shell layer as well, so the floating editor can cross the split boundary like Browser

Practical read:
- the main open problem is still ownership, not split mechanics
- `Workspace 1` solved the first shell-owned layer of that problem
- `Workspace 2` now needs to finish the remaining editor placement extraction without redesigning all shell behavior at once

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-0.1 - Codebase Research And Implementation Audit.md`
- `docs/Phase-Plans/Tasks/Future/05.1A - VR-SP - Workspace Layout Foundation And Left-Dock Entry.md`
- shipped split proof:
  - `docs/Phase-Plans/Tasks/Old/05.1B - VR-SP - Split Pane Authoring And Divider Controls.md`
- shipped shared activation seam:
  - `docs/Human-Plans/Architecture/Console/Shipped/Console_Phase 5.1F - Workspace Selection, Surface Activation, And Canonical Intents.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSplitTypes.ts`

### Locked Direction

The first shared workspace owner should live under:
- `src/app/workspace/`

Important rule:
- workspace ownership is shell-level
- workspace ownership is not feature-local
- workspace ownership should not stay hidden inside `useSpaghettiStore`

### Questions / Decisions

#### `Workspace 1.Q1` - Where should the first real shared workspace owner live?

Locked answer:
- create a dedicated workspace seam under `src/app/workspace/`
- keep it shell-owned near `AppShell`
- let `useAppStore` continue owning shared activation and intent rather than duplicating that concern in a second focus store

Why:
- this keeps placement truth out of `useSpaghettiStore`
- this keeps the shell owner close to the real composition root
- this gives later `Workspace 2` and `Workspace 3` work a stable home

#### `Workspace 1.Q2` - What state should move into the shared workspace seam first?

Locked answer:
- move shell-level placement truth first:
  - left-dock split state
  - Browser floating rect memory
  - Browser placement mode
  - shared shell menu state
  - first neutral workspace-shell types

Do not move in this phase:
- graph/editor authored data
- editor command/session behavior
- most editor viewport placement ownership
- Browser feature behavior
- Console feature behavior
- shared viewer scene/content truth

Why:
- this is the cleanest line between shell ownership and feature ownership
- it keeps the first cut small enough to land without broad feature regressions

#### `Workspace 1.Q3` - What should stay as transition adapters during the first extraction?

Locked answer:
- keep `BrowserDockHost`
- keep `SpaghettiWindowHost`
- keep the current left-dock entry and current split proof visible through those adapters while ownership moves

Why:
- the app already has working renderers and interaction proofs
- replacing ownership is safer than replacing every renderer at once

#### `Workspace 1.Q4` - What must stay protected in the first shared workspace layout?

Locked answer:
- keep one protected main `Model Viewer` region alive
- do not allow `Workspace 1` to remove the last honest viewer region

Why:
- too much of the current app still assumes one stable 3D working region
- later additional viewers should come only after `Workspace 3` makes viewport-local chrome ownership honest

#### `Workspace 1.Q5` - How should the current left-dock split entry behave during extraction?

Locked answer:
- keep the existing left-dock `[]` split affordance as the first visible tiled-entry seam
- route that behavior through the shared workspace owner
- do not let the current grouped left-dock proof become the permanent final pane model

Why:
- this preserves the cleanest user-facing entry point already present in the shell
- it also prevents the old special-case dock grouping from hardening into the long-term layout architecture

### Locked State Extraction Read

State that now lives in the shared workspace seam after the shipped first slice:
- left-dock split and shell menu ownership
- Browser placement mode
- Browser floating rect memory
- shared shell-level floating parity support

State that remains outside the shared workspace seam after `Workspace 1`:
- editor viewport placement and split ownership
- pane ownership beyond the current split proof
- active pane identity
- protected main-viewer identity
- graph/editor authored content
- editor session behavior
- Browser feature logic
- Console feature logic
- viewer scene/content truth

### What Landed

The shipped `Workspace 1` slice landed:
- `src/app/workspace/useWorkspaceStore.ts` as the shared workspace-shell owner
- `src/app/workspace/workspaceShellTypes.ts` as the extracted shell type seam
- `AppShell` cleanup so key Browser plus left-dock shell state no longer lives only in component-local state
- shared shell-state integration for `BrowserDockHost`
- shell-level floating parity for the floating `Spaghetti Editor`

### Residue Carried Forward

The main residue intentionally left for `Workspace 2`:
- editor viewport placement and split ownership still living in `useSpaghettiStore`
- first explicit hosted-surface identity model
- clearer shared ownership for pane assignment beyond the current shell proof

State that should remain outside the shared workspace seam long term:
- graph/editor authored content
- editor session behavior
- Browser feature logic
- Console feature logic
- viewer scene/content truth

### First Implementation Cut

`Workspace 1` landed in the smallest safe sequence:

1. add a native workspace shell-state surface under `src/app/workspace/`
2. define the first neutral workspace-shell types
3. move left-dock split and Browser shell ownership into that seam
4. keep `BrowserDockHost` and `SpaghettiWindowHost` rendering through the new owner while preserving current behavior
5. preserve `useAppStore` as the shared activation and intent seam
6. leave deeper editor placement extraction for `Workspace 2`

Important rule:
- finish ownership extraction before broad hosted-surface migration
- do not absorb viewport-local chrome or persistence into this phase

### Locked Transition Rule

Keep the current hosts during transition:
- `BrowserDockHost`
- `SpaghettiWindowHost`

Important rule:
- preserve the current renderers and behavior proofs while ownership moves
- do not rewrite every shell surface at once

### Locked Reuse Rule

Reuse these shipped/live pieces directly:
- `workspaceSplitTypes`
- current left-dock split entry
- shipped `05.1B` split-authoring rules
- shipped `[5.1F]` active-surface and intent seams

Important rule:
- `Workspace 1` should not re-open the split-authoring problem
- it should instead give that behavior a correct shared owner

### Original Extraction Targets

The first-cut file targets for this phase were:
- `src/app/workspace/`
  - new workspace state/types owner
- `src/app/AppShell.tsx`
  - replace shell-local placement truth with the shared workspace seam where possible
- `src/app/store/useAppStore.ts`
  - keep shared activation/intent integration aligned with the new workspace owner
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - begin reducing long-term ownership of shell placement state while keeping editor-specific behavior, with the main residue rolling into `Workspace 2`
- `src/app/hosts/BrowserDockHost.tsx`
  - adapt to shared placement ownership
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - adapt to shared placement ownership

Likely first type family:
- `WorkspaceLayoutState`
- `WorkspaceLayoutNode`
- `WorkspaceBranchNode`
- `WorkspaceLeafNode`
- `WorkspaceSurfacePlacement`
- `WorkspaceSurfaceInstance`
- `WorkspacePaneId`

### Important Interfaces And Types To Lock

- `WorkspaceLayoutState`
  - root layout node
  - active pane id
  - protected main viewer pane id
- `WorkspacePaneNode`
  - branch versus leaf
- `WorkspaceBranchNode`
  - direction
  - ratio
  - priority
  - first child
  - second child
- `WorkspaceLeafNode`
  - hosted surface instance identity
  - pane-local metadata
- `WorkspaceSurfaceKind`
  - `modelViewer`
  - `browser`
  - `console`
  - `spaghettiEditor`
  - later `gizmoView`
- `WorkspacePresentationMode`
  - `windowed`
  - `tiled`

### Likely Files

- `src/app/workspace/`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`

### Acceptance And Done Shape

`Workspace 1` is done when:
- a native shared workspace owner exists
- the first workspace shell types are explicit and in use
- key Browser plus left-dock shell truth is no longer `AppShell`-local
- current shell behavior is preserved through transition adapters
- the left-dock split entry now flows through the shared workspace seam
- floating Browser and floating `Spaghetti Editor` share shell-level boundary behavior

### Verification Shape

Minimum verification for `Workspace 1` should cover:
- left-dock `[]` split still enters and exits the first tiled state correctly
- current Browser floating/docked behavior still works
- current Spaghetti floating/split/docked behavior still works
- floating Browser and floating `Spaghetti Editor` both cross the split boundary under the same shell-level clamp rules
- shared `activeSurface` and `requestConsoleContextSync` behavior still matches shipped `[5.1F]`
- the last protected main viewer cannot be accidentally removed

Important non-goals during verification:
- do not require multi-viewport behavior yet
- do not require full hosted-surface migration yet
- do not require workspace persistence yet
