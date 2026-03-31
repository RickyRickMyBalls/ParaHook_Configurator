# Workspace Phase Workspace-4 - Persistence, Saved Modes, And Migration

## Doc Header

### Doc History
2. 2026-03-30 10:18: Cleaned up this phase after the shipped first `Workspace 4` slice by narrowing the phase outcome to the honest last-layout snapshot and startup hydration work that landed, recording what actually shipped in code, and explicitly rolling named saved-layout UI plus broader multi-window persistence follow-through forward into `Workspace 5` and later workspace-family work
1. 2026-03-30 10:03: Re-homed the old `05.1D` persistence lane into this native Workspace-family phase doc, locking the post-`Workspace 3` persistence questions into explicit answers, grounding the phase in the current shared workspace seam plus remaining special-case shell residue, and turning `Workspace 4` into the active implementation-ready next phase for hybrid layout persistence and migration

### Purpose

Use this phase to give the shared workspace system one honest persistence and migration story.

The goal is to remember the last hybrid layout, define the later saved-layout extension cleanly, and finish the handoff away from the old special-case split/meatball shell assumptions.

### Scope

This phase covers:
- first-pass persisted workspace layout state
- floating rect persistence
- hosted-surface placement persistence
- viewport-local chrome persistence where it affects layout ownership
- later named saved layouts as an extension of the same model
- migration checkpoints away from older special-case shell state

This phase does not cover:
- new split-authoring UX
- multi-window or browser pop-out work
- true multiple independent viewer runtimes
- project-authored content persistence

## Doc Body

### Summary

`Workspace 4` is the workspace persistence phase.

It should deliver:
- one last-layout persistence model for the hybrid workspace
- one clear ownership boundary between workspace prefs and authored project data
- one migration story away from older split/meatball-specific shell residue
- one later extension path for named saved layouts

### Locked Direction

`Workspace 4` should be:
- a persistence and migration phase
- a cleanup phase for surviving special-case workspace state
- a preferences-layer phase above the shared workspace seam

`Workspace 4` should not be:
- a new split-authoring phase
- a viewport-chrome enrichment phase
- a pop-out or multi-window phase
- a project-data persistence phase

### Locked Outcome

At the end of `Workspace 4`:
- the workspace can restore one honest last hybrid layout
- workspace layout state clearly lives as user/workspace preference state
- named saved layouts have a clean later home on top of the same persisted shape
- the old special-case split/meatball path has a clear migration boundary into the shared workspace owner

### What Landed

The shipped first `Workspace 4` slice landed:
- one canonical `PersistedWorkspaceLayout` shape under `src/app/workspace/`
- one shared workspace persistence bridge for serializing, reading, and writing last-layout state
- startup hydration of the shared workspace seam from the persisted last-layout snapshot
- write-back of shared workspace layout changes into durable last-layout storage

### Residue Carried Forward

The main residue intentionally left after the first `Workspace 4` slice:
- named saved-layout UI still belongs to a later follow-on on top of the same snapshot format
- browser-window pop-out persistence and multi-window surface persistence still belong to `Workspace 5`
- `useSpaghettiStore` still survives as a compatibility/session adapter even though it is no longer the persistence owner

### Current Code Read

Current shipped seam after the first `Workspace 3` slice:
- `src/app/workspace/useWorkspaceStore.ts` owns left-dock state, Browser shell state, editor placement records, and the first protected viewport identity/chrome records
- `AppShell` composes the main viewer through the shared viewport-local host seam
- `useSpaghettiStore` still carries compatibility-facing editor viewport records and editor-session behavior
- `uiPrefsStore` is still the closest live preference-layer pattern for app-level UI persistence

Main residue still blocking honest workspace persistence:
- there is no canonical persisted workspace snapshot shape yet
- some placement-facing compatibility truth still survives in `useSpaghettiStore`
- older split/meatball assumptions still exist as compatibility render paths even though shared workspace ownership is now real

Practical read:
- `Workspace 1` through `Workspace 3` established shared ownership
- `Workspace 4` should now make that ownership durable across sessions
- the phase should persist the shared workspace seam, not reintroduce feature-local layout ownership

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-1 - Shared Workspace Owner And State Extraction.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-2 - First Hosted Surface Migration And Transitional Adapters.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-3 - Viewport-Local Chrome And Toolbar Host.md`
- historical grounding:
  - `docs/Phase-Plans/Tasks/Future/05.1D - VR-SP - Workspace Persistence, Saved Modes, And Migration.md`

Current code seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/AppShell.tsx`
- `src/app/store/uiPrefsStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Questions / Decisions

#### `Workspace 4.Q1` - What should the first persisted workspace snapshot actually remember?

Locked answer:
- left-dock width and split state
- Browser shell floating/docked state and floating rect
- hosted-surface placement records for the first supported surfaces
- protected viewport identity and viewport-local chrome host records where layout ownership depends on them
- active surface identity where it affects restored workspace feel

Do not require in the first pass:
- named saved-layout libraries
- task-specific presets
- project-authored viewer/editor content

Why:
- this is enough to restore the current hybrid workspace honestly
- it keeps persistence scoped to shell/layout ownership instead of authored feature data

#### `Workspace 4.Q2` - Where should workspace persistence live?

Locked answer:
- treat it as user/workspace preference state
- persist the shared workspace seam through the same general preference direction already used for UI state
- keep the canonical snapshot shape under `src/app/workspace/`

Why:
- workspace layout is not authored project data
- the workspace seam is now the real owner of the placement truth that needs persistence

#### `Workspace 4.Q3` - How should named saved layouts fit?

Locked answer:
- first pass persists only the last layout
- named saved layouts are the later extension of the same persisted snapshot shape
- do not create a separate saved-modes model that diverges from last-layout persistence

Why:
- one canonical snapshot format keeps migration simpler
- the first win is honest session restoration, not a layout-library UI

#### `Workspace 4.Q4` - What migration boundary should this phase define?

Locked answer:
- the current special-case Spaghetti split/meatball assumptions should be treated as migration sources only
- persist and restore through the shared workspace seam
- compatibility mirrors in `useSpaghettiStore` may survive temporarily, but they should not become the long-term persisted owner

Why:
- keeping two persistence owners would recreate the exact ownership split the workspace family has been cleaning up

#### `Workspace 4.Q5` - What must stay out of scope?

Locked answer:
- browser pop-out persistence
- multi-window surface libraries
- project-authored workspace content
- true multiple independent viewer runtimes

Why:
- those belong to later workspace phases or different system lanes
- widening scope here would delay the core last-layout persistence story

### Locked First-Pass Persistence Rule

The first pass should remember one last hybrid workspace state.

Persist:
- tiled versus windowed placement state
- floating rects for windowed surfaces
- left-dock shell state
- active pane or active surface identity where it affects restored workspace behavior
- viewport-local chrome host state only where it changes shell ownership or visible placement

Do not require:
- a saved-layout browser
- layout sharing/import-export
- project-bound workspace snapshots

### Locked Persistence Ownership Rule

Workspace layout persistence should be treated as user/workspace preference state, not project-authored data.

Important rule:
- do not store workspace layout as part of authored graph, geometry, or project build content

Recommended home:
- shared workspace snapshot types under `src/app/workspace/`
- persistence bridge aligned with `uiPrefsStore`-style app preference ownership

### Locked Saved-Mode Extension Rule

Named saved layouts belong here as the later extension of the same persistence model.

First-pass rule:
- remember only the last layout

Later follow-on:
- save named layouts
- restore named layouts
- optionally support task-oriented presets

### Locked Migration Rule

The older special-case split and meatball shell assumptions should be treated as migration sources, not as permanent parallel persistence owners.

Migration checkpoints:
- preserve current left-dock split entry behavior
- restore editor placement through the shared workspace seam first
- let `useSpaghettiStore` remain a compatibility/session adapter where needed
- move any surviving special-case restore assumptions behind the shared workspace snapshot

Important rule:
- do not keep one old special-case restore path plus one new workspace restore path long term

### Important Interfaces And Types To Lock

- `PersistedWorkspaceLayout`
  - left-dock shell state
  - browser shell placement
  - hosted-surface placement records
  - protected viewport host records
  - active surface or pane identity where needed
- `PersistedWorkspaceSurfacePlacementMap`
  - placement records keyed by hosted surface instance id
- `PersistedWorkspaceViewportMap`
  - viewport-local host records keyed by viewport id
- `SavedWorkspaceLayout`
  - later named extension of the same persisted snapshot shape

Important rule:
- these types should describe shell/layout state
- they should not absorb authored content or feature-session payloads

### First Implementation Cut

`Workspace 4` should land in the smallest safe sequence:

1. add canonical persisted workspace snapshot types under `src/app/workspace/`
2. define serialization and hydration helpers for the current shared workspace seam
3. persist and restore the first last-layout snapshot through the app preferences layer
4. hydrate `AppShell` and the shared workspace store from that snapshot on startup
5. keep `useSpaghettiStore` as a compatibility/session adapter, but stop treating it as the persistence owner
6. leave named saved-layout UI for a later follow-on once last-layout persistence is stable

Important rule:
- do not widen this cut into pop-out persistence or layout-library UI
- do not block on deleting every compatibility seam before persistence can land

### Likely Files

- `src/app/workspace/`
- `src/app/AppShell.tsx`
- `src/app/store/uiPrefsStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Concrete Implementation Targets

Recommended first file targets:
- `src/app/workspace/`
  - persisted workspace snapshot types
  - serialize / hydrate helpers
  - persistence-facing cleanup around the shared workspace seam
- `src/app/store/uiPrefsStore.ts`
  - preference-layer storage bridge for the last workspace layout
- `src/app/AppShell.tsx`
  - startup hydration and restore integration
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - keep compatibility/session behavior, but stop owning persistence truth

### Acceptance And Done Shape

`Workspace 4` is done when:
- the last hybrid workspace layout has one explicit persisted snapshot shape
- that snapshot is clearly user/workspace preference state
- restore on startup works through the shared workspace seam
- named saved layouts have a clear later extension path
- the migration boundary away from older special-case restore logic is explicit

### Verification Shape

Minimum verification for `Workspace 4` should cover:
- Browser floating/docked state restores correctly
- editor floating versus tiled placement restores correctly
- left-dock width and split state restore correctly
- viewport-local chrome host state restores without breaking current overlay/toolbar behavior
- the restored active workspace feels consistent with the shared activation seam

Important non-goals during verification:
- do not require named saved-layout UI yet
- do not require browser pop-out persistence yet
- do not require multi-window surface persistence yet
