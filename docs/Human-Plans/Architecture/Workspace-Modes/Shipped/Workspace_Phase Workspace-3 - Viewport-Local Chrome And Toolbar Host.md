# Workspace Phase Workspace-3 - Viewport-Local Chrome And Toolbar Host

## Doc Header

### Doc History
3. 2026-03-30 10:03: Cleaned up this phase after the shipped first `Workspace 3` slice by narrowing the phase outcome to the honest viewport-local host extraction that landed, recording what actually shipped in code, and explicitly rolling the remaining persistence and deeper viewport enrichment residue forward into `Workspace 4` plus later toolbar-specific work
2. 2026-03-30 08:18: Tightened this phase into the active post-`Workspace 2` implementation-ready spec by locking the viewport-chrome ownership questions into explicit answers, grounding the phase in the current global `AppShell` viewer/overlay/toolbar mounts plus singleton viewer-runtime seams, and adding a concrete first-cut migration order for introducing one viewport-local chrome host around the protected first `Model Viewport`
1. 2026-03-29 15:03: Created this first native viewport-local workspace follow-on as `Workspace 3`, locking that the next honest step after shared workspace ownership and first hosted-surface migration is to move `View`, `Gizmo`, overlay, and later command-toolbar hosting toward per-viewport ownership instead of keeping that chrome mounted globally from `AppShell`

### Purpose

Use this phase to give each `Model Viewport` instance its own viewport-local chrome and toolbar-host seam.

The goal is to prepare ParaHook for honest multi-viewport growth without making the viewer instance become the owner of the whole shell.

### Scope

This phase covers:
- viewport-local chrome ownership
- viewport toolbar-host ownership
- movement of globally mounted viewer chrome toward viewport-instance mounting
- one honest per-viewport shell contract for `View`, `Gizmo`, overlay, and later command-tool surfaces

This phase does not cover:
- broad surface persistence
- full browser pop-out
- detached multi-window surface follow-through
- separate independent viewer worlds

## Doc Body

### Summary

`Workspace 3` is the viewport-local chrome phase.

It should deliver:
- one per-viewport chrome ownership contract
- one viewport toolbar-host area
- one cleanup path away from globally mounted viewer chrome
- one stronger base for later multi-viewport work

### Locked Direction

`Workspace 3` should be:
- a viewport-chrome ownership cleanup
- a mounting and composition cleanup around the hosted `Model Viewport`
- a preparation phase for later multi-viewport growth

`Workspace 3` should not be:
- a multi-viewer-runtime rewrite
- a persistence phase
- a browser pop-out phase
- a broad hosted-surface rewrite beyond viewport-local chrome

### Locked Outcome

At the end of `Workspace 3`:
- viewport-local chrome is no longer mounted only once from `AppShell`
- each hosted `Model Viewport` instance can own its own `View`, `Gizmo`, overlay, and later command-toolbar host area
- the workspace system can grow toward additional viewports honestly without duplicating app-global surfaces accidentally

### What Landed

The shipped first `Workspace 3` slice landed:
- one protected primary viewport identity in the shared workspace seam
- one `ViewportWorkspaceHost` composition seam under `src/app/workspace/`
- `AppShell` extraction so the protected first `Model Viewport` now owns the mounted `ViewerHost`, `ViewportOverlay`, and `ViewToolbar`
- viewport identity threading into `ViewToolbar` and `ViewportOverlay` without rewriting their internal feature behavior

### Residue Carried Forward

The main residue intentionally left after the first `Workspace 3` slice:
- deeper `ViewToolbar` enrichment and cleanup still belongs to follow-on UI work
- persistence of the new viewport-local chrome and workspace layout belongs to `Workspace 4`
- broader multi-viewport growth and any later multi-viewer-runtime questions still remain out of scope

### Current Code Read

Current shipped seam after the first `Workspace 2` slice:
- `AppShell` still mounts `ViewerHost`, `ViewportOverlay`, and `ViewToolbar` globally
- `ViewerHost` still behaves like the protected first hosted `Model Viewport` renderer
- `ViewToolbar` still drives viewer behavior through the singleton `getViewer()` bridge plus `uiPrefsStore`
- `ViewportOverlay` still mounts once globally and owns the current sketch-plane and sketch-session overlay-tool windows

Main residue still blocking honest multi-viewport preparation:
- viewport-local chrome is still app-global mounting
- overlay-tool panels still assume one global viewport overlay root
- the viewer bridge still exposes one live viewer runtime, which means ownership cleanup should happen before deeper multi-viewer runtime work

Practical read:
- `Workspace 2` solved more hosted-surface placement ownership
- `Workspace 3` should now solve viewport-local chrome ownership
- the phase should wrap existing viewer chrome renderers in a viewport-local host before attempting any deeper viewer-runtime split

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-0.1 - Codebase Research And Implementation Audit.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-1 - Shared Workspace Owner And State Extraction.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-2 - First Hosted Surface Migration And Transitional Adapters.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/components/viewToolbarLayout.ts`

Observed live ownership seams:
- `AppShell` mounts `ViewerHost`, `ViewportOverlay`, and `ViewToolbar` directly
- `ViewerHost` registers the singleton viewer through `setViewer(...)`
- `ViewToolbar` talks to that singleton via `getViewer()`
- `ViewportOverlay` also talks to the singleton viewer bridge and owns the current viewport-tool windows

### Current Problem Read

Current live shell behavior:
- `ViewerHost` is mounted as a singleton viewer surface
- `ViewToolbar` is mounted globally from `AppShell`
- `ViewportOverlay` is mounted globally from `AppShell`

Why that blocks honest growth:
- a second real `Model Viewport` pane cannot own its own chrome truth
- viewport-local tools still read like app-global shell UI
- later `Transform`, `Sketch`, and related viewport command hosts do not yet have a stable per-viewport home

### Questions / Decisions

#### `Workspace 3.Q1` - What needs to become viewport-owned first?

Locked answer:
- move `ViewToolbar` and `ViewportOverlay` behind one viewport-local chrome host first
- keep `ViewerHost` as the protected first hosted `Model Viewport` renderer
- make that viewport-local host the owner of:
  - `View`
  - `Gizmo`
  - axis widget and overlay chrome
  - sketch and transform overlay-tool mounting

Why:
- those are the most obvious viewport-local surfaces still mounted globally today
- that is the smallest honest cut that creates a believable per-viewport chrome seam

#### `Workspace 3.Q2` - Where should the first viewport-local chrome owner live?

Locked answer:
- under `src/app/workspace/`
- keyed by hosted `Model Viewport` surface identity
- with `AppShell` reduced to orchestration instead of direct global toolbar/overlay mounting

Why:
- the workspace seam already owns broader placement direction
- viewport chrome should extend that same ownership model instead of becoming another global `AppShell` special case

#### `Workspace 3.Q3` - What should stay shared during this phase?

Locked answer:
- scene/content truth
- selection and activation truth
- transforms and loaded content
- the current singleton viewer runtime if needed for the first cut

Why:
- this phase is about ownership and mounting cleanup
- a multi-viewer-runtime rewrite belongs later if it is still needed after the chrome host is honest

#### `Workspace 3.Q4` - What should stay adapter-based during the first cut?

Locked answer:
- keep `ViewerHost`
- keep `ViewToolbar`
- keep `ViewportOverlay`
- keep `ViewportOverlayToolPanel`
- introduce one viewport-local host/composition seam around them instead of rewriting their internal feature behavior

Why:
- those renderers already carry working behavior
- composition cleanup is safer than rewriting all viewport tool logic in the same phase

#### `Workspace 3.Q5` - What must still stay out of scope?

Locked answer:
- persistence and saved layout modes
- detached browser windows and multi-window surface growth
- true multiple independent viewer runtimes

Why:
- those belong to later workspace phases
- widening scope here would blur the clean next step after the shipped `Workspace 2` ownership cut

### Locked Ownership Rule

Each `Model Viewport` instance should own:
- its own viewport-local chrome
- its own toolbar-host area
- its own overlay host area

Important rule:
- the viewport is a first-class hosted workspace surface
- the viewport is not the owner of the entire app shell

### Locked First Viewport Host Rule

The first implementation cut should still protect one primary `Model Viewport` instance.

Important rule:
- `Workspace 3` should create one honest viewport-local chrome seam around that protected first viewport
- it should not require fully shipping visible multiple viewports in the same phase

### Locked Per-Viewport Chrome Set

First per-viewport chrome should include:
- `View`
- `Gizmo`
- `Viewport Overlay`

Likely early follow-on occupants of the same host area:
- `Transform`
- `Sketch`
- later other viewport-driven command toolbars

### Locked Shared Versus Local Boundary

Keep shared:
- scene truth
- selection truth
- transforms
- loaded content
- shared cross-surface activation and intent seams

Make viewport-local:
- chrome placement
- per-viewport toolbar-host mounting
- pane-local camera and presentation state
- viewport overlay rendering ownership

Important rule:
- localize the chrome host first
- do not silently absorb authored feature/session state into the workspace shell

### Locked Multi-Viewport Rule

Later additional `Model Viewer` panes should be:
- cloned views over the same shared workspace content
- not separate independent viewer worlds

Important rule:
- this phase prepares that future by fixing ownership first
- it should not invent separate scene truths per viewport

### Locked First-Cut Adapter Rule

Recommended first-cut render adapters:
- `ViewerHost`
- `ViewToolbar`
- `ViewportOverlay`
- `ViewportOverlayToolPanel`

Important rule:
- the viewport-local host should compose these existing renderers
- the host should become the mounting owner even if the viewer runtime is still singleton-backed underneath

### Important Interfaces And Types To Lock

- `WorkspaceViewportId`
  - stable shell identity for one hosted `Model Viewport`
- `WorkspaceViewportChromeState`
  - per-viewport chrome host state
- `WorkspaceViewportToolbarHostState`
  - per-viewport toolbar-host placement and visibility state
- `WorkspaceViewportOverlayHostState`
  - per-viewport overlay host identity and mount metadata

Important rule:
- these types should describe per-viewport shell ownership
- they should not absorb scene content or authored sketch data

### Locked Host Responsibilities

The viewport-local chrome host should own:
- mounting `ViewToolbar`
- mounting `ViewportOverlay`
- passing viewport identity into local chrome
- later toolbar-host slots for `Transform`, `Sketch`, and related viewport command tools

`AppShell` should keep owning:
- broad workspace composition
- protected first viewer region composition
- non-viewport global surfaces

`ViewerHost` should keep owning:
- viewer runtime composition
- shared viewer scene rendering
- existing viewer bridge integration until a later viewer-runtime phase exists

### First Implementation Cut

`Workspace 3` should land in the smallest safe sequence:

1. add viewport host identity and viewport-chrome state types under `src/app/workspace/`
2. introduce one viewport-local chrome host component around the protected first `Model Viewport`
3. stop mounting `ViewToolbar` globally from `AppShell` and move it under the viewport-local chrome host
4. stop mounting `ViewportOverlay` globally from `AppShell` and move it under the same viewport-local chrome host
5. adapt `ViewToolbar` and `ViewportOverlay` to read viewport host identity while preserving the current singleton viewer bridge where needed
6. preserve current viewer behavior while proving that viewport-local chrome is now owned and mounted per viewport instead of per app

Important rule:
- do not widen this cut into persistence, pop-out, or multi-runtime viewer work
- do not require visible multiple model viewers in the same phase

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/components/viewToolbarLayout.ts`

### Concrete Implementation Targets

Recommended first file targets:
- `src/app/workspace/`
  - viewport identity and viewport-chrome host state
  - first viewport host composition helpers
- `src/app/AppShell.tsx`
  - remove global `ViewToolbar` and `ViewportOverlay` mounting
  - compose the first viewport-local host around `ViewerHost`
- `src/app/components/ViewerHost.tsx`
  - keep viewer-runtime behavior, but accept the new viewport-local composition seam around it
- `src/app/components/ViewToolbar.tsx`
  - adapt from app-global mounting toward viewport-local hosting
- `src/app/components/ViewportOverlay.tsx`
  - adapt from app-global mounting toward viewport-local hosting
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - preserve current overlay-tool rendering while allowing a viewport-local mount owner

Likely first type family:
- `WorkspaceViewportId`
- `WorkspaceViewportChromeState`
- `WorkspaceViewportToolbarHostState`
- `WorkspaceViewportOverlayHostState`

### Acceptance And Done Shape

`Workspace 3` is done when:
- one viewport-instance shell contract exists
- the first viewport-local chrome set mounts per viewport instead of only globally
- the viewer remains a hosted surface rather than becoming the whole shell owner
- later multi-viewport work has an honest per-viewport chrome seam to build on

Additional acceptance read:
- `AppShell` no longer mounts `ViewToolbar` and `ViewportOverlay` as app-global singletons
- the protected first `Model Viewport` owns its chrome host directly
- current sketch/transform viewport-tool behavior still works through the new host seam

### Verification Shape

Minimum verification for `Workspace 3` should cover:
- `ViewToolbar` still works after moving under the viewport-local host
- `ViewportOverlay` still renders axis widget, overlay chrome, and sketch/tool windows correctly
- sketch-plane and sketch-session overlay tools still mount and drag correctly
- viewer activation and workspace selection behavior still match the shipped shared activation seam
- the protected first `Model Viewport` still behaves like the real viewer surface while now owning its local chrome

Important non-goals during verification:
- do not require persistence yet
- do not require browser pop-out yet
- do not require real multiple viewer runtimes yet
