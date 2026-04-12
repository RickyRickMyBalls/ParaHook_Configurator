# Cleanup Phase Cleanup-4 - Workspace Truth And AppShell Simplification

## Doc Header

### Doc History
1. 2026-04-12 13:42: Created this standalone `Cleanup 4` future phase doc to hold the top-level workspace-truth and AppShell simplification lane under the Cleanup family

### Purpose

This doc defines the fourth cleanup phase for the `Cleanup` family.

Use it to answer:
- what the workspace truth cleanup is trying to fix
- how `useWorkspaceStore` and `AppShell` should relate
- what the likely high-level cleanup ladder is for this lane

Do not use it for:
- detailed AppShell extraction specs that already belong to AppShell family docs
- broad workspace feature planning unrelated to cleanup
- code-level implementation notes for one hook or host

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - AppShell/workspace simplification lane framing

- `../Canonical-Ownership-Targets.md`
  - workspace ownership target

- `../../AppShell/AppShell-Index.md`
  - AppShell family direction

## Doc Body

## [ ] Cleanup 4 - Workspace Truth And AppShell Simplification

### Header

Purpose:
- reduce top-level workspace and shell ambiguity by keeping workspace layout and placement truth clearly canonical in `useWorkspaceStore` while shrinking `AppShell` and related hosts back toward composition and coordination

Owns:
- workspace truth versus host truth clarification
- AppShell simplification at the ownership level
- retirement of migration-era workspace ownership leakage

Does not own:
- new workspace behavior
- full feature planning for every workspace mode
- detailed single-hook extraction steps

### Why This Phase Exists

The cleanup docs already show that workspace truth is one of the major ownership risks:
- layout
- placement
- surface kind per slot
- detached/floating/popout state
- viewport-local presentation state

If those truths spread into hosts and popup shells, cleanup gets harder and behavior becomes harder to localize.

This phase exists to keep that from becoming permanent architecture.

### Scope

This phase covers:
- workspace slot/layout truth
- surface placement truth
- AppShell and host responsibilities relative to workspace truth
- remaining migration-era or host-local ownership leakage

This phase does not cover:
- new workspace UX
- the full workspace roadmap
- generic file-shortening with no ownership gain

### Locked Direction

- workspace layout and surface placement live in `useWorkspaceStore`
- `AppShell` composes and coordinates around that truth
- hosts may render and react, but should not become layout owners
- migration logic should shrink instead of becoming permanent workspace architecture

### Phase Ladder

## [ ] Phase 1 - Reconfirm Workspace Truth Boundaries

Purpose:
- re-state exactly which workspace truths are canonical in `useWorkspaceStore`

Focus:
- slot tree
- split layout nodes
- detached/floating/popout placement
- surface kind per slot
- viewport-local chrome/display state

## [ ] Phase 2 - Trace Host Re-Ownership Hotspots

Purpose:
- identify where AppShell, popup shells, or host components still act like workspace owners

Likely hotspots:
- active/focused surface coordination
- detached surface restore paths
- split/floating menu or controller seams
- migration-era layout recovery logic

## [ ] Phase 3 - Reduce AppShell To Composition Over Workspace Truth

Purpose:
- make the shell consume workspace truth rather than quietly storing it in local host behavior

Expected outcome:
- `AppShell` reads more like composition and coordination
- workspace policy lives closer to workspace state and explicit actions

## [ ] Phase 4 - Retire Migration-Era Ownership Leakage

Purpose:
- remove or isolate the remaining migration/runtime residue that still behaves like a workspace owner

### Acceptance Checks

- workspace truth has one stable owner
- `AppShell` and hosts stop acting like second layout owners
- migration logic has a shrinking footprint

### Likely Related Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/`
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/`

### Success Read

This phase succeeds when:
- workspace truth is easier to localize
- AppShell reads as a shell instead of a hidden workspace owner
- later workspace cleanup can target one real owner instead of several partial ones
