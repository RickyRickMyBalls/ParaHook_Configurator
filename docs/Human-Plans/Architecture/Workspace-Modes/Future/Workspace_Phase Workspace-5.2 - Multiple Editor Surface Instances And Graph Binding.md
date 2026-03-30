# Workspace Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding

## Doc Header

### Doc History
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

### Current Code Read

Current shipped seam after `Workspace 5`:
- the workspace seam already owns editor placement records keyed by editor viewport or surface id
- `useSpaghettiStore` still owns graph documents, sessions, and the active editor compatibility seam
- Browser `Open Editors` already hints at a surface list, but the runtime still leans on one effectively-global active editor shell

Main residue still blocking multiple graphs honestly:
- there is still one dominant active-editor assumption in the runtime flow
- visible editor surface instances are not yet treated as first-class workspace records
- graph opening still tends to replace or rebind the existing visible editor instead of preserving multiple honest surfaces

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

### Locked Identity Rule

Each visible graph editor should be represented by:
- one workspace editor surface instance id
- one bound graph document id
- one placement record
- one activation path

Important rule:
- surface identity should not disappear just because focus moves away

### First Implementation Cut

`Workspace 5.2` should land in the smallest safe sequence:

1. add explicit editor surface instance records keyed separately from graph document ids
2. bind each editor surface instance to one graph document id
3. widen workspace placement ownership so more than one editor surface can remain alive at once
4. preserve one compatibility bridge so the focused surface still drives the existing active editor runtime
5. keep close/remove behavior explicit so orphaned surface records do not survive accidentally

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`

### Acceptance And Done Shape

`Workspace 5.2` is done when:
- more than one editor surface instance can exist honestly in workspace state
- each editor surface instance is bound to one graph document id
- opening another graph no longer has to overwrite the only visible editor shell
- the current active-editor compatibility seam still works for the focused editor surface

### Verification Shape

Minimum verification for `Workspace 5.2` should cover:
- creating a second editor surface bound to another graph
- switching focus between editor surfaces without losing placement truth
- closing one editor surface without destroying unrelated graph documents or surface records
- persistence safety for multiple editor surface placement records where supported
