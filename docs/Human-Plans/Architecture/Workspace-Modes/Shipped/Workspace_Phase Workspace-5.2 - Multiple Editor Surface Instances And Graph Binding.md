# Workspace Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding

## Doc Header

### Doc History
2. 2026-03-30 12:59: Tightened `Workspace 5.2` into an implementation-ready multi-editor-surface spec by locking the first safe create-versus-reuse rule, grounding the phase in the still-dominant active-editor compatibility seam that `Workspace 5.1` exposed, and adding the concrete type targets, file targets, plus acceptance and verification shape for real graph-bound editor surface instances
1. 2026-03-30 12:14: Added this native Workspace-family follow-on after the shipped first `Workspace 5` slice, locking the multiple-open-graph foundation around honest editor surface instances, explicit graph-document binding per surface, and shared workspace ownership of editor-surface placement instead of the old one-visible-editor replacement assumption

### Purpose

Use this phase to make multiple editor surfaces real before the user-facing multi-graph UX widens further.

The goal is to replace the old single-visible-editor assumption with explicit editor surface instances that each bind to one graph document.

### Scope

This phase covers:
- editor surface instance identity
- graph-document binding per editor surface instance
- workspace-owned placement records for more than one editor surface
- compatibility bridges back into the current active-editor runtime where needed

This phase does not cover:
- final `Open Editors` UX polish
- named workspace layout libraries
- project-data changes to graph authored content

## Doc Body

### Summary

`Workspace 5.2` is the multi-editor-surface foundation phase.

It should deliver:
- more than one honest editor surface instance
- one explicit graph document binding per editor surface
- one shared workspace placement owner for those editor surfaces

### Locked Direction

`Workspace 5.2` should be:
- a surface-instance identity phase
- a graph-binding phase
- a workspace-placement widening phase

`Workspace 5.2` should not be:
- a fake tab-only illusion over one shell
- a rewrite of graph authored data
- a viewer-runtime or child-window platform rewrite

### Locked Outcome

At the end of `Workspace 5.2`:
- more than one editor surface instance can stay alive honestly at the same time
- each editor surface instance binds to one graph document id
- the shared workspace seam owns those visible editor surface instances and their placement truth
- the focused editor surface still drives the existing active-editor compatibility bridge
- popping out one editor no longer lets unrelated graph-open actions silently replace or deactivate that surface just because the runtime still prefers one global active editor

### Current Code Read

Current shipped seam after `Workspace 5`:
- the workspace seam already owns editor placement records keyed by editor viewport or surface id
- `useSpaghettiStore` still owns graph documents, sessions, and the active editor compatibility seam
- Browser `Open Editors` already hints at a surface list, but the runtime still leans on one effectively-global active editor shell

Main residue still blocking multiple graphs honestly:
- there is still one dominant active-editor assumption in the runtime flow
- visible editor surface instances are not yet treated as first-class workspace records
- graph opening still tends to replace or rebind the existing visible editor instead of preserving multiple honest surfaces

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.3 - Open Editors Multi-Graph Workspace UX And Session Truth.md`

Current code seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.tsx`

Observed live proof and residue:
- `Workspace 5.1` now proves that one editor surface can move honestly into a child browser window and dock back cleanly
- the shared workspace seam already owns editor placement records keyed by editor viewport or surface id
- `useSpaghettiStore` still owns graph documents, graph sessions, and the active editor compatibility bridge
- `SpaghettiWindowHost` and `AppShell` still center live editor hosting around one dominant `activeEditorViewportId`
- console graph-open flows still often route through `activeGraphDocumentId` or `openGraphDocumentInViewport`, so another graph-open intent can still replace the one dominant editor bridge even when a previously opened or popped-out editor surface should remain alive

Main residue still blocking an honest multi-editor base:
- there is still one dominant active editor surface in the runtime path
- editor surface instance identity is still effectively coupled to the old active viewport assumption
- graph open actions do not yet operate on explicit workspace editor surface instances
- the workspace seam does not yet treat multiple bound editor surfaces as first-class live session truth

### Questions / Decisions

#### `Workspace 5.2.Q1` - What is the canonical unit that should stay open?

Locked answer:
- one editor surface instance bound to one graph document id
- not one global editor shell that keeps rebinding to different graphs

Why:
- this is the only honest base for multiple simultaneous graphs and later per-surface pop-out

#### `Workspace 5.2.Q2` - Where should authored graph truth versus surface placement truth live?

Locked answer:
- keep graph documents, graph authored data, and editor session truth feature-local in `useSpaghettiStore`
- keep visible editor surface instance identity and placement truth in the shared workspace seam

Why:
- this preserves the existing ownership split the workspace family already established

#### `Workspace 5.2.Q3` - How should the current active-editor compatibility seam survive the first cut?

Locked answer:
- keep a compatibility bridge from the currently focused editor surface into the existing active-editor/session flows
- do not require the whole editor runtime to become multi-surface-native in one pass

Why:
- this keeps the first widening cut smaller and safer

#### `Workspace 5.2.Q4` - What should still stay out of scope after this phase?

Locked answer:
- polished `Open Editors` multi-graph UX
- final close/duplicate/reveal flows for every editor-surface action
- aggressive refactors of all editor runtime assumptions at once

Why:
- those belong to `Workspace 5.3`

#### `Workspace 5.2.Q5` - What is the first safe create-versus-reuse rule before the full `Open Editors` UX lands?

Locked answer:
- preserve the current compatibility behavior for older "open or focus" paths that still target one active editor
- add an explicit "create another editor surface instance" path for the first widening cut
- do not claim that every graph-open action is additive by default until `Workspace 5.3` rewires the user-facing `Open Editors` and open-graph UX truth

Why:
- it keeps the first multi-surface cut smaller and safer
- it avoids over-promising full user-facing multi-graph behavior before the workspace UX layer is ready

### Locked Identity Rule

Each visible graph editor should be represented by:
- one workspace editor surface instance id
- one bound graph document id
- one placement record
- one activation path

Important rule:
- surface identity should not disappear just because focus moves away

### Locked Binding Rule

Each visible editor surface instance should own:
- one stable workspace editor surface instance id
- one bound graph document id
- one placement record
- one activation route

Important rule:
- graph authored truth should not be duplicated just because more than one editor surface now exists

### Locked Compatibility Rule

During the first widening cut:
- keep one compatibility bridge from the focused editor surface into the current active-editor runtime
- let that bridge update `activeEditorViewportId` and related session assumptions where the older runtime still expects them
- do not let that compatibility bridge erase or replace unrelated live editor surface instances

Important rule:
- compatibility should map from focused surface to old runtime assumptions
- it should not remain the canonical source of truth for which editor surfaces exist

### First Implementation Cut

`Workspace 5.2` should land in the smallest safe sequence:

1. add explicit editor surface instance records keyed separately from graph document ids
2. bind each editor surface instance record to one graph document id
3. widen workspace placement ownership so more than one editor surface can remain alive at once
4. teach `SpaghettiWindowHost` and `AppShell` to render from those surface instance records instead of only one dominant active editor host assumption
5. preserve one focused-surface compatibility bridge back into the current active editor runtime
6. add explicit create-surface, focus-surface, rebind-surface, and close-surface helpers so surface lifecycle is not hidden inside old open-or-replace flows
7. keep persistence safe for several editor placement records where supported

Important rule:
- the first cut should widen the real surface model first
- the full user-facing additive graph-open UX still belongs to `Workspace 5.3`

### Important Interfaces And Types To Lock

- `EditorWorkspaceSurfaceState`
  - keep placement truth per visible editor surface instance
- `WorkspaceEditorSurfaceInstanceRecord`
  - add one explicit workspace record that binds a surface instance id to one graph document id
- `activeEditorViewportId` compatibility seam
  - keep it as a bridge from the focused surface instead of the canonical surface registry
- editor-surface creation and focus helpers
  - separate "create new surface" from "focus existing surface" behavior

Important rule:
- these types should describe workspace surface identity and binding
- they should not absorb authored graph payloads or undo the existing feature-local graph ownership split

### Concrete Implementation Targets

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.tsx`

Recommended first file targets:
- `src/app/workspace/workspaceShellTypes.ts`
  - canonical editor surface instance record types and graph-binding metadata
- `src/app/workspace/useWorkspaceStore.ts`
  - shared editor surface instance registry plus placement ownership for more than one live surface
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - focused-surface compatibility bridge, graph-binding helpers, and explicit create/focus/rebind/close surface actions
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - render path widening from one dominant active editor shell to explicit surface instances
- `src/app/AppShell.tsx`
  - shell orchestration that stops assuming one visible editor host is the only honest graph surface
- `src/app/console/ConsoleDock.tsx`
  - compatibility updates where console graph-open flows still target the old active-editor assumption

### Acceptance And Done Shape

`Workspace 5.2` is done when:
- more than one editor surface instance can exist honestly in workspace state
- each editor surface instance is bound to one graph document id
- opening another graph no longer has to overwrite the only visible editor shell
- the current active-editor compatibility seam still works for the focused editor surface
- a popped-out editor surface can remain alive while another graph-open action focuses or creates a different editor surface
- surface identity survives focus changes instead of collapsing back into one hidden active editor concept

### Verification Shape

Minimum verification for `Workspace 5.2` should cover:
- creating a second editor surface bound to another graph
- switching focus between editor surfaces without losing placement truth
- closing one editor surface without destroying unrelated graph documents or surface records
- persistence safety for multiple editor surface placement records where supported
- keeping one editor popped out while another graph-open action occurs in the main app
- proving the focused-surface compatibility bridge updates the old active-editor path without shutting off another live editor surface
