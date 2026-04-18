# Docs Command Center

## Doc Header

### Doc History
1. 2026-04-18 10:48:00: Created this command-center doc as a lightweight daily-use start surface for the `/docs` system, separating "what should I open first right now" from the much larger `Doc-Index.md` inventory and grounding the page in the current roadmap, active architecture-family planning, cleanup lanes, shipped-reference surfaces, and deep-reference docs that can usually stay closed until needed

### Purpose

This file is the daily-use start page for the docs system.

Use it to answer:
- what docs should I open first today
- what planning surfaces are active right now
- what roadmap owns current sequencing
- where shipped history lives
- what deep reference docs can stay closed unless needed

### Scope

This file covers:
- the current high-value docs to start from
- the main planning and roadmap surfaces
- the most active architecture-family planning homes
- shipped-reference and history links
- deep-reference docs that should not compete for attention during normal work

This file does not replace:
- `docs/Doc-Index.md`
  - full docs inventory and folder map
- `docs/Human-Plans/roadmap/roadmap.md`
  - broader execution-order roadmap
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
  - cross-family architecture roadmap
- `docs/CHANGELOG.md`
  - authoritative shipped implementation history

## Doc Body

### Short Version

The docs system is now too large to treat the full docs tree as the normal daily starting surface.

Use this file as the small "open these first" layer.

Use `Doc-Index.md` when you need the full map.

### Current Read

Current doc-system scale snapshot:
- about `531` non-archive Markdown docs
- about `269,466` non-archive raw lines
- about `618` total scanned Markdown docs including archive

Practical rule:
- do not start with the full docs tree unless you are doing docs-structure work
- start with the smallest surface that can answer today's question

### Start Here Today

If you are deciding what to work on next:
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
- `docs/Human-Plans/roadmap/roadmap.md`

If you are trying to understand the docs system:
- `docs/Docs-Command-Center.md`
- `docs/Doc-Index.md`

If you are doing architecture planning:
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
- the relevant family index under `docs/Human-Plans/Architecture/`

If you are shipping code:
- the relevant family future doc
- `docs/CHANGELOG.md`

If you are changing docs:
- the relevant source doc
- `docs/Doc-Log.md`
- `docs/Doc-Index.md` only if the docs map needs to expose a new file or folder

### Main Planning Surfaces

- `docs/Human-Plans/roadmap/roadmap.md`
  - broader execution-order roadmap
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
  - cross-family architecture phase tracker
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - north-star product direction
- `docs/Vision.md`
  - high-level project direction and what should stay true

### Current Active Family Surfaces

These are the first family docs to open before browsing deeper:

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - workspace shell, slots, surfaces, and major app hosting direction
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
  - shell cleanup and the later `AppShell 4` follow-on
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - main cleanup ladder
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen2-Index.md`
  - current worker-and-legacy cleanup research lane
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
  - active worker runtime direction
- `docs/Human-Plans/Architecture/Worker/Worker-Index-Gen2.md`
  - later worker-generation lane beyond the already-shipped base worker ladder
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
  - viewport workspace and primary-slot evolution
- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
  - active toolbar, camera, and environment surface planning

### Current Open Execution Surfaces

These are the kinds of docs most likely to drive the next real implementation passes:

- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen2-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-2 - Primary Viewport Workspace Reassignment.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Index-Gen2.md`
- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

### Shipped Reference Surfaces

Use these when you need "what already landed?" instead of "what should I open next?"

- `docs/CHANGELOG.md`
  - authoritative shipped implementation history
- `docs/Human-Plans/roadmap/Architecture-roadmap.md`
  - grouped shipped cross-family architecture reference
- `docs/Phase-Plans/00_Phase_Log.md`
  - canonical completed phase log
- family `Shipped/` folders under `docs/Human-Plans/Architecture/`
  - family-specific shipped records

### Deep Reference - Open Only When Needed

These are useful, but they should not be the default daily reading surface:

- `docs/Doc-Index.md`
  - full docs inventory and foldable map
- `docs/Change-List-COMPILED.md`
  - merged historical shipped reference
- `docs/History/0 - History-TaskLog.md`
  - detailed historical reconstruction
- `docs/History/0 - History-TaskList.md`
  - short restored task index
- `docs/CodexContext/2_CodexContext.md`
  - stable project handoff context
- `docs/CodexContext/3_CodexContext.md`
  - rolling live working context

### Ignore By Default

During normal planning, try not to start in:
- `/docs/archive/`
- older historical task docs unless the current family points back to them
- large foldable subtree listings when one roadmap or one family index can answer the question faster

### Maintenance Rule

Keep this file small.

If this page starts reading like another giant inventory:
- move detail back into `Doc-Index.md`
- keep this page focused on active navigation only
- prefer linking to family indexes and roadmaps over duplicating their full contents
