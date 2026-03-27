# [ ] Export-1 - Toolbar Shell And Format Surface

## Header

### Doc History
1. 2026-03-26 20:03: Created this first standalone `Export` phase doc to define the initial visible export surface as a shared-toolbar-based tool with first format choices, first section layout, and one explicit export action entry path

### Purpose

This phase defines the first honest visible `Export` surface for ParaHook.

Use it to answer:
- what the first export tool should look like
- how it should reuse the shared toolbar shell
- which format choices should be visible first
- what should count as done for the first export UI cut

## Body

### Goal

Create the first real `Export` tool surface as a shared-toolbar-based UI instead of leaving export as only an abstract worker capability or a scattered later button idea.

### This Phase Should

- add an `Export` tool surface that uses the shared `Toolbar` template
- expose the first visible format list:
  - `STL`
  - `STEP`
  - `OBJ`
  - `GLB`
- provide a clear first body structure for:
  - `Targets`
  - `Format`
  - `Settings`
  - `Action`
- keep one explicit `Export` trigger instead of auto-export side effects
- leave deeper target-collection logic and persistence-neighbor logic for later phases

### This Phase Should Not

- solve every worker-side writer implementation
- fully solve Browser selection integration
- finalize project-file save/load behavior
- finalize spaghetti-file save/load behavior
- pretend one universal detail slider means the same thing for every format

### Toolbar Rule

This tool must reuse the shared `Toolbar` template direction in:
- `docs/Human-Plans/Architecture/Toolbar.md`

That means:
- shared title bar
- shared drag/resize behavior
- shared body section model
- no one-off export-only shell

### Workspace Rule

This first phase only needs the export surface to behave like a normal tool surface.

Later workspace-mode growth may let it become:
- `Windowed`
- `Tiled`

But this phase should at least avoid blocking that direction.

### Done Means

- the repo has one real first `Export` phase surface defined
- the phase explicitly uses the shared toolbar shell
- the first visible format family is locked
- the section layout is clear enough for later `Export-2` and `Export-3` follow-ons
