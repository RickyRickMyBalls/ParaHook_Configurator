# Glossary

## Doc Header

### Doc History
1. 2026-04-18 11:29: Created this first human-readable glossary for the new root `Human-Docs` pages so common ParaHook terms can be explained in plain English instead of only through architecture-specific wording

### Purpose

This page explains common ParaHook terms in plain English.

Use it when:
- a word keeps appearing across docs or the app
- two similar terms seem easy to mix up
- you want the simple meaning before reading a deeper architecture page

## Doc Body

### Browser

The Browser is the project-facing surface that helps explain what exists in the current project.

It is not just a launcher for graphs. Over time it is meant to become the clearer read on project content, published outputs, and organization.

### Commit

A commit is the moment when a change becomes an accepted authored or stored step instead of only a live temporary interaction.

In practice, ParaHook often distinguishes between something you are still dragging, previewing, or shaping and something that has actually been accepted into the current state.

### Content

`Content` is the project-facing side of the app.

It is where authored or published results are meant to become understandable as project structure. It should not collapse into a second graph list.

### Graph

A graph is the network of nodes and wires that describes authored logic.

In ParaHook, graphs are a core authoring surface, not a side feature.

### Graph Document

A graph document is a named graph with its own identity.

It gives the graph a stable place in the app, which matters for editing, build routing, and later project ownership.

### Graph Documents

`Graph Documents` is the authoring-facing collection of graph files or graph identities in the project.

This surface is about opening, naming, and working on authored graphs. It is different from `Content`, which is about project structure and published results.

### Model Viewport

The model viewport is the main 3D viewing surface.

It is where people inspect the current result, look around the model, and eventually do more direct work on geometry and transforms. It shows the model, but it should not become the hidden owner of the model.

### Preview

A preview is a temporary or in-progress result shown so you can understand what the current change is doing.

Preview is useful, but it is not the same as accepted output, stored content, or final export.

### Published Output

Published output is the handoff between graph-authored work and project-facing content.

It is the point where graph results stop being only internal graph output and start becoming something the wider project can name, organize, and display.

### Reference Object

A reference object is an object that exists to guide work rather than to be the main modeled result.

Depending on the workflow, a reference object might help with alignment, scale, context, or comparison instead of acting as the final thing being built.

### Spaghetti

`Spaghetti` is the name of ParaHook's graph-based editor and graph system.

It includes graph editing, node logic, compile behavior, and preview wiring. The name is informal, but the role is important: it is the graph-native authoring side of the app.

### Surface

A surface is one major working area inside the app, such as the Browser, the model viewport, the graph editor, or the Console.

The workspace can host surfaces in different ways without changing what those surfaces fundamentally are.

### Viewer

The viewer is the rendering engine behind the visible 3D view.

It handles scene drawing, camera behavior, and display logic. It shows results prepared elsewhere rather than deciding the product model by itself.

### Worker

The worker is the execution side of ParaHook.

It receives structured build requests, runs deterministic geometry or build work, and returns structured results to the app.

### Workspace

The workspace is the overall environment that hosts ParaHook's major surfaces.

It is the shared system that lets tools such as the Browser, graph editor, and model viewport live together. Different layouts are meant to be different arrangements of one workspace model, not separate apps.

### Learn More

- [Architecture Glossary](../Human-Plans/Architecture/Glossary.md)
- [System Map](../Human-Plans/Architecture/System-Map.md)
- [Engine Architecture](../Human-Plans/Architecture/Engine-Architecture.md)
- [Vision](../Vision.md)
