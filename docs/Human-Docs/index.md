# Human Docs

## Doc Header

### Doc History
1. 2026-04-18 11:13:14: Created this front door for the first `Human-Docs` v1 pass so ParaHook now has one lighter reader-facing docs area that explains the project, its core concepts, and its main workspaces without forcing readers to start inside the larger planning-doc tree

### Purpose

This is the lightweight reader-facing docs home for ParaHook.

Use it to:
- understand what ParaHook is trying to become
- learn the main concepts without reading planning docs first
- get a plain-English read on the major systems
- understand the highest-value workspaces

### Scope

This section covers:
- project overview
- big-picture organization
- shared terminology
- core concepts
- engine overview
- project flow
- the main workspace surfaces

This section does not replace:
- `docs/Doc-Index.md`
  - full docs inventory and repo docs map
- `docs/Human-Plans/`
  - planning, architecture, and execution docs
- `docs/CHANGELOG.md`
  - shipped implementation history

## Doc Body

### Start Here

If you are new to ParaHook:

1. Read `What Is ParaHook`.
2. Read `How ParaHook Is Organized`.
3. Skim the `Glossary`.
4. Use the `Concepts` and `Workspaces` pages to go deeper.

### What You Can Read Here

#### Project Overview

- [What Is ParaHook](What-Is-ParaHook.md)
  - what ParaHook is, what kind of app it is becoming, and what is already real versus still evolving
- [How ParaHook Is Organized](How-ParaHook-Is-Organized.md)
  - the big-picture view of app, worker, viewer, and graph/editor responsibilities
- [Glossary](Glossary.md)
  - shared project terms in plain English

#### Concepts

- [Core Concepts](Concepts/Core-Concepts.md)
  - the mental model behind authored graph truth, content, preview, and workspaces
- [Engine Architecture](Concepts/Engine-Architecture.md)
  - the simple explanation of how app state, worker execution, and viewer rendering fit together
- [Project Flow](Concepts/Project-Flow.md)
  - a normal end-to-end flow through the app

#### Workspaces

- [Workspace Overview](Workspaces/Overview.md)
  - what workspaces are and why ParaHook uses them
- [Browser](Workspaces/Browser.md)
  - what the Browser is for and how it differs from authoring surfaces
- [Model Viewport](Workspaces/Model-Viewport.md)
  - what the main viewport does and how it fits into the app
- [Spaghetti Editor](Workspaces/Spaghetti-Editor.md)
  - the graph editor and how it relates to Browser and worker output

### How This Area Fits With The Rest Of The Docs

Use `Human-Docs` when you want explanation.

Use `Human-Plans` when you want planning and architecture detail.

Use `Doc-Index` when you need the full docs map.

Use `CHANGELOG` when you want shipped implementation history.

### Learn More

- [Docs Command Center](../Docs-Command-Center.md)
- [Doc Index](../Doc-Index.md)
- [Vision](../Vision.md)
- [Architecture Roadmap](../Human-Plans/roadmap/Architecture-roadmap.md)
