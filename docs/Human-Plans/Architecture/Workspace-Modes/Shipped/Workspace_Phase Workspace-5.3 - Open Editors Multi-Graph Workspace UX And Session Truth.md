# Workspace Phase Workspace-5.3 - Open Editors Multi-Graph Workspace UX And Session Truth

## Doc Header

### Doc History
1. 2026-03-30 12:14: Added this native Workspace-family follow-on after the shipped first `Workspace 5` slice, locking the user-facing multi-graph layer around `Open Editors` as the honest launcher, switcher, and closer for multiple graph-bound editor surfaces once `Workspace 5.2` establishes real editor surface instances

### Purpose

Use this phase to turn the multi-editor-surface foundation into a clear user-facing multi-graph workspace flow.

The goal is to make `Open Editors` and graph-opening actions behave like a real workspace session, not a hidden implementation detail.

### Scope

This phase covers:
- `Open Editors` as the honest multi-graph launcher and switcher
- open, focus, reveal, and close behavior for graph-bound editor surfaces
- workspace-session truth for several open graphs at once

This phase does not cover:
- a new graph document data model
- browser-window collaboration transport
- generic tab systems unrelated to the workspace surface model

## Doc Body

### Summary

`Workspace 5.3` is the user-facing multi-graph workspace phase.

It should deliver:
- a clear way to keep multiple graphs open at once
- `Open Editors` as the honest list of live editor surfaces
- predictable focus, reveal, and close behavior across those open graph sessions

### Locked Direction

`Workspace 5.3` should be:
- a workspace-session UX phase
- an `Open Editors` truth phase
- a focus and close behavior phase

`Workspace 5.3` should not be:
- a return to one global editor shell
- an ad-hoc tab strip disconnected from the workspace surface model
- a project-data rewrite

### Current Code Read

Assuming `Workspace 5.2` lands first:
- the workspace seam should already know about multiple editor surface instances
- each editor surface should already bind to one graph document id
- the remaining gap is mostly user-facing launch, switch, reveal, and close behavior

Main residue still blocking a believable multi-graph workspace:
- `Open Editors` is not yet the single truthful surface list
- graph-opening actions still need clearer create-versus-reuse rules
- close behavior needs to respect focused editor surfaces instead of only the older active-editor assumption

### Questions / Decisions

#### `Workspace 5.3.Q1` - What should `Open Editors` actually list?

Locked answer:
- list live editor surface instances, each bound to one graph document
- show which one is active
- let the user focus or reveal a specific editor surface from that list

Why:
- `Open Editors` should reflect workspace truth, not a guessed projection

#### `Workspace 5.3.Q2` - When the user opens a graph, when should the app create a new editor surface versus reuse one?

Locked answer:
- if the graph is already open in a live editor surface, focus or reveal that surface
- if the graph is not already open, create a new editor surface instance by default
- only reuse an existing surface automatically when the user explicitly chooses a replace-style action later

Why:
- this keeps "multiple graphs open at once" honest by default

#### `Workspace 5.3.Q3` - What should closing behavior do?

Locked answer:
- close the selected editor surface instance
- do not close unrelated graph documents or other editor surfaces
- if the closed surface was active, move focus to the most sensible remaining editor surface or back to the viewer

Why:
- close behavior must operate on surfaces, not on one hidden global editor concept

### Locked UX Rule

The user-facing rule should be simple:
- opening a graph keeps it open
- opening another graph keeps both open
- `Open Editors` shows the live set
- choosing one focuses that exact editor surface

### First Implementation Cut

`Workspace 5.3` should land in the smallest safe sequence:

1. point `Open Editors` at the live editor surface instance list
2. add focus or reveal behavior from `Open Editors` into the exact bound surface
3. define create-versus-reuse behavior for graph open actions
4. add surface-level close behavior with sensible focus fallback
5. preserve existing editor/session compatibility where the deeper runtime still expects one focused editor

### Likely Files

- `src/app/panels/BrowserPanel.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`

### Acceptance And Done Shape

`Workspace 5.3` is done when:
- the user can keep multiple graphs open at once
- `Open Editors` reflects the live editor surface set honestly
- choosing an `Open Editors` row focuses or reveals the correct graph surface
- closing one graph surface does not destroy unrelated open graph surfaces

### Verification Shape

Minimum verification for `Workspace 5.3` should cover:
- opening several graphs in one session
- focusing them from `Open Editors`
- closing one while others remain open
- focus fallback after close
- persistence or restore safety for the supported multi-graph session records
