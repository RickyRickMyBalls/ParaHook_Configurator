# Human Docs v1 Plan

## Summary

Create `docs/Human-Docs/` as a lightweight, reader-facing explanation layer for ParaHook that sits above `Human-Plans/` and below the big repo-wide docs inventory.

This first pass should be:
- medium-sized, not tiny and not exhaustive
- written for both curious users and contributors
- internal-but-human in tone
- simple in structure, with only a few subfolders
- clearly separated from planning and implementation docs

Typical conventional doc systems usually have:
- a front door / start page
- a project overview
- a glossary
- a system or architecture overview
- concept docs for core ideas
- feature or workspace guides
- a “where to go next” link structure

For ParaHook, that is enough for v1. Do not build a large handbook yet.

## Key Changes

### 1. Folder structure

Use this structure for the first pass:

- `docs/Human-Docs/index.md`
- `docs/Human-Docs/What-Is-ParaHook.md`
- `docs/Human-Docs/How-ParaHook-Is-Organized.md`
- `docs/Human-Docs/Glossary.md`
- `docs/Human-Docs/Concepts/`
- `docs/Human-Docs/Workspaces/`

Keep it intentionally shallow. Do not add more than these two subfolders in v1.

### 2. Root doc set

Create these root docs first:

- `index.md`
  - front door for `Human-Docs`
  - explains what this doc area is
  - links to the most important human-readable pages
  - points readers to `Human-Plans/` only when they want deeper planning detail

- `What-Is-ParaHook.md`
  - plain-English overview of the project
  - what ParaHook is trying to become
  - what kinds of workflows it mixes together
  - what is already real versus still evolving

- `How-ParaHook-Is-Organized.md`
  - one-page “big picture” explanation
  - app layer, worker layer, viewer layer, graph/editor layer
  - how state, build execution, and rendering relate
  - keep this simpler than `System-Map.md` and `Engine-Architecture.md`

- `Glossary.md`
  - define the words that appear all over the repo and UI
  - include terms like `Spaghetti`, `Graph Documents`, `Content`, `workspace`, `viewer`, `worker`, `Browser`, `Model Viewport`, `published output`, `reference object`, `preview`, `commit`
  - write definitions for humans, not implementation specs

### 3. Concepts subfolder

Create this first-pass concepts set:

- `Concepts/Core-Concepts.md`
  - explain the core mental model
  - authored graph truth
  - project content versus graph documents
  - preview versus committed result
  - workspaces versus tools versus surfaces

- `Concepts/Engine-Architecture.md`
  - human-readable engine explanation
  - app owns truth, worker computes, viewer displays
  - keep this as the reader-friendly version of the existing engine docs, not a copy of planning language

- `Concepts/Project-Flow.md`
  - explain the normal user flow through the app
  - author something
  - build or publish it
  - inspect it in Browser / viewer
  - move between workspaces

### 4. Workspaces subfolder

Create a small, high-value workspace set:

- `Workspaces/Overview.md`
  - explain the workspace idea
  - what a workspace is
  - why ParaHook uses multiple surfaces
  - how tiled, floating, and detached placement fit in

- `Workspaces/Browser.md`
  - what the Browser is for
  - what kinds of things appear there
  - how it differs from the graph/editor

- `Workspaces/Model-Viewport.md`
  - what the main viewport is for
  - how viewing, inspecting, and editing relate there
  - keep it user-readable, not phase-driven

- `Workspaces/Spaghetti-Editor.md`
  - explain the graph editor in plain English
  - what nodes, wires, and authored graph logic are for
  - how it relates to Browser and worker output

Do not split into many workspace pages yet. Skip `Catalog`, `Dashboard`, `Radio`, `Notepad`, and deep specialty surfaces in v1 unless they are needed for orientation. Those can be phase-2 docs.

### 5. Content sourcing and rewrite rules

Build `Human-Docs` by synthesizing from existing sources, not by copying plan docs directly.

Primary source material to adapt:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/System-Map.md`
- `docs/Human-Plans/Architecture/Engine-Architecture.md`
- `docs/Human-Plans/Architecture/Glossary.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- the Browser, Model-Viewport, and Spaghetti Editor family docs

Writing rules:
- no phase ids in normal body text unless strictly needed for a “learn more” link
- no implementation checklists
- no shipped/open ladders
- no repo-maintenance language
- no “Codex should” or agent-facing wording
- prefer plain English and stable concepts over current cleanup details
- be honest about unfinished areas without turning pages into backlog docs

Each human-facing page should end with:
- a short “Learn more” section linking to the deeper planning docs
- at most 2–4 deeper links

### 6. Navigation integration

When implementing, also wire the new doc area into the existing docs surfaces:

- add `Human-Docs` to `docs/Doc-Index.md`
- add a visible `Human-Docs` entry in the root docs tree listing
- add a quick entry from `docs/index.md` if the docs site should expose this area from the front door
- update `docs/Doc-Log.md` in the same change set

No code/public API/type changes are needed. This is a docs-information-architecture addition only.

## Test Plan

Acceptance for the first implementation pass:

- `docs/Human-Docs/` exists and contains the agreed v1 structure
- the folder has one clear front door page
- every page is human-readable without requiring knowledge of phase numbers or task history
- a reader can answer these questions quickly:
  - what is ParaHook?
  - what are the main systems?
  - what is a workspace?
  - what are Browser, Model Viewport, and Spaghetti Editor for?
  - what do the common project terms mean?
- the pages do not duplicate large planning ladders from `Human-Plans`
- each page links to deeper source/planning docs only when helpful
- `Doc-Index.md` and `Doc-Log.md` are updated to expose and record the new area

## Assumptions

- Audience: both curious users and contributors
- Tone: internal but human, not polished marketing docs
- Size: medium v1, roughly 9–10 pages total
- Structure: a mostly root-level doc set plus only `Concepts/` and `Workspaces/`
- v1 goal: orientation and explanation, not complete subsystem coverage
- deeper planning remains in `docs/Human-Plans/`; `Human-Docs` is an explanation layer, not a second planning tree
