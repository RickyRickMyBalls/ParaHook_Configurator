# Export Index

## Doc Header

### Doc History
1. 2026-03-26 20:03: Created this folderized `Export` architecture family, added the first `Export-1` future phase doc, and defined the export-toolbar direction for selecting authored 3D objects/references, choosing format/detail settings, and leaving room for later project-file and spaghetti-file save/export behavior

### Purpose

This file is the umbrella planning index for the `Export` family under `Architecture`.

Use it to answer:
- what the `Export` surface should own
- how export should relate to the shared toolbar template
- how export should relate to workspace modes
- what export targets the user should be able to collect and review
- how format/settings selection should be organized
- where future standalone `Export` docs should branch

### Scope

This doc covers:
- the user-facing `Export` surface
- export target collection for authored objects and references
- format and detail-setting direction
- the relationship between export, project save, and later spaghetti-file save/export
- likely phase split for the export family

This doc does not cover:
- the final worker-side file writers for every format
- final project-file schema
- final spaghetti-document persistence rules
- every later manufacturing/export metadata feature

### Family Structure

Use this folder like this:

- `Export-Index.md`
  - umbrella architecture direction
  - family summary
  - future routing surface
- `Future/`
  - standalone implementation-ready export phase docs
- `Shipped/`
  - shipped records for completed `Export` cuts

Current roadmap home:
- canonical phase family:
  - `EX`
- this architecture family is the user-facing planning home for the `Export` surface that should later feed those canonical export phases

## Doc Body

### Short Version

ParaHook should gain one real `Export` tool surface.

That surface should:
- use the shared toolbar template
- later participate in workspace modes like other tool surfaces
- let the user collect or review export targets such as authored 3D objects and references
- let the user choose export output/settings such as:
  - `STL`
  - `STEP`
  - `OBJ`
  - `GLB`
  - detail or tessellation level where that setting makes sense
- leave room for later save/export-adjacent outputs such as:
  - project file
  - spaghetti file

It should feel like a real export workspace surface, not only a one-click download button.

### Why This Doc Exists

The repo already has the canonical `EX` export/output family in `docs/Phase-Plans/12_EX - Phase-Plans.md`.

That phase family already says export belongs to:
- deterministic output/export behavior
- worker-side export ownership
- explicit export contracts

But there is not yet one dedicated architecture-family doc for the visible user-facing `Export` surface.

This doc exists to define:
- what the export toolbar/panel should be
- what the user can add/select there
- how the surface should relate to workspace layout and the shared toolbar shell
- how format/settings choice should be organized before implementation grows ad hoc

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Export`
  - visible export tool surface
  - target collection/review
  - format choice
  - user-facing export settings
  - export action entry
- `Toolbar`
  - shared floating toolbar shell/chrome/template behavior
- `Workspace-Modes`
  - where the export surface can live:
    - `Windowed`
    - `Tiled`
- `Browser`
  - authored object/reference selection truth that export can consume
- `Worker`
  - actual deterministic export execution
- `GE` / project persistence docs
  - final project-file ownership
- graph/spaghetti persistence docs
  - final spaghetti-file save/load ownership

Important rule:
- do not let the export toolbar become the hidden owner of file-format business logic that should live in shared export contracts or the worker

### Core Direction

The first real `Export` surface should be a dedicated tool that lets the user prepare and review an export job.

Expected first-pass responsibilities:
- open the export surface from a visible toolbar entry
- review which authored 3D objects or references are included
- add or remove export targets intentionally
- choose export format
- choose export-detail settings when the format needs them
- trigger export through one explicit action

This should feel closer to:
- export preparation
- export review
- deterministic job setup

than to:
- a one-off browser-context-menu afterthought

### Surface Shape

The export surface should reuse the shared `Toolbar` template.

That means:
- shared title bar
- shared close behavior
- shared drag/resize behavior
- shared sectioned body layout

Recommended first sections:

#### 1. Targets

- list the current export targets
- show whether each target is:
  - authored object
  - reference
  - maybe later assembly/group export root
- allow add/remove behavior

#### 2. Format

- `STL`
- `STEP`
- `OBJ`
- `GLB`
- later:
  - project file
  - spaghetti file

#### 3. Settings

- detail/tessellation quality when relevant
- only show settings that are honest for the selected format

#### 4. Action / Result

- one explicit `Export`
- progress/result read
- clear failure/success feedback

### Target Collection Direction

The export surface should be able to consume real authored selection truth from the workspace.

Good first targets:
- authored 3D objects
- references already loaded into the workspace

Later targets:
- assemblies
- folders/groups
- full project export roots
- graph-specific export roots

Important rule:
- export target truth should come from explicit authored/project identity, not camera/view state

### Format Direction

The first visible format family should include:
- `STL`
- `STEP`
- `OBJ`
- `GLB`

Important rule:
- the UI should not force one fake universal settings model across every format
- keep shared settings shared
- keep format-specific settings format-specific

### Project File And Spaghetti File Direction

This export family should leave explicit room for later save/export-adjacent outputs.

Current read:
- a later `project file` export/save path is plausible
- a later `spaghetti file` save/export path is plausible

Recommended rule:
- let `Export` become the visible home for discussing those outputs with the user
- but keep the underlying ownership clean if project persistence or graph persistence gets its own canonical save/load contracts

### Workspace-Modes Direction

The export surface should be able to participate in the shared workspace layout model later.

That means it should be able to live as:
- `Windowed`
- `Tiled`

Important rule:
- the export surface should use the same shared surface-instance model as other tool surfaces
- do not invent a special one-off shell for export

### Phase Ladder

The first export-family ladder should be:

- `Export-1`
  - `Toolbar Shell And Format Surface`
  - create the visible export surface with shared-toolbar behavior, first format choices, and one explicit export entry path
- `Export-2`
  - `Target Collection And Selection Integration`
  - connect Browser/workspace selection truth to the export target list and allow add/remove review behavior
- `Export-3`
  - `Format-Specific Settings And Detail Controls`
  - make mesh-vs-CAD-vs-scene settings honest instead of forcing one fake shared detail model
- `Export-4`
  - `Project File, Spaghetti File, And Later Export Neighbors`
  - decide how later project-file and spaghetti-file save/export options surface here without blurring canonical persistence ownership

Standalone future docs:
- `Future/Export_Phase Export-1 - Toolbar Shell And Format Surface.md`

### Summary

The umbrella direction is now:
- ParaHook should have one real `Export` tool surface
- that surface should reuse the shared toolbar template
- that surface should later work inside workspace modes like other tool surfaces
- the user should be able to collect/review authored 3D objects and references for export
- the user should be able to choose format and honest format-relevant settings
- later project-file and spaghetti-file save/export options should be allowed to surface here without turning export into the owner of all persistence logic
