# Spaghetti Editor

## Doc Header

### Doc History
1. 2026-04-18 12:22:00: Added the first reader-facing Spaghetti Editor page for Human Docs so the graph workspace is explained as ParaHook's authoring surface for graph documents, node logic, and viewer-facing output without requiring a planning-doc deep dive

### Purpose

This page explains what the Spaghetti Editor is for.

Use it to:
- understand what the editor owns
- learn how graph documents relate to Browser content and viewport output
- get a simple mental model for nodes, wires, and graph workspaces

## Doc Body

### Short Version

The Spaghetti Editor is ParaHook's graph authoring workspace.

It is where you build graph documents with nodes and wires, shape how geometry should be produced, and connect authored logic to outputs the rest of the app can use.

If the Browser is the project tree and the Model Viewport is the review surface, the Spaghetti Editor is the place where the authored logic is made.

### What Lives In The Spaghetti Editor

The editor is bigger than one canvas with boxes on it.

It includes:
- graph documents
- editor surfaces that can open those graphs
- the graph canvas itself
- node families such as sketch and extrude work
- graph-local runtime and output state
- coordination with Browser and the viewport

That wider view matters because the editor is not just drawing nodes. It is part of how ParaHook turns authored intent into project output.

### What The Editor Owns

The Spaghetti Editor owns graph authoring.

That includes:
- graph structure
- node and wire relationships
- node parameters
- canvas interaction
- graph-local editing state

It should not own:
- the Browser's project hierarchy
- the worker runtime
- viewer rendering

Those systems need to stay connected, but they should not collapse into one another.

### Graph Documents Are Not The Same As Project Content

This is one of the most important ParaHook ideas.

Graph documents and project content are related, but they are not the same thing.

A graph is where authored logic lives. Project content is what the wider project can organize, show, hide, and compose.

That is why the Browser should not turn into a second graph list, and why the Spaghetti Editor should not try to become the whole project tree.

### How The Editor Fits With The Rest Of The App

The usual flow is:
1. author intent in the Spaghetti Editor
2. let the system compile and execute that intent
3. inspect the result in the Model Viewport
4. see the project-facing result in the Browser

That sounds linear, but in practice these surfaces stay live together. You can edit in one place while reading structure or geometry in another.

### Multiple Editor Surfaces

ParaHook's workspace direction allows more than one editor surface.

That matters because:
- more than one graph can be open
- two surfaces can point at the same graph and stay consistent
- one editor can later switch to a different graph without forcing every other editor to move

So the Spaghetti Editor should be thought of as a workspace family, not one permanent singleton panel.

### Editor Shell Direction

The editor shell is also getting its own quality-of-life work.

A few important themes are already visible:
- new nodes can inherit a chosen spawn density instead of always appearing the same way
- overlay behavior is being separated from ordinary window density
- a left-side node palette is planned so adding nodes feels more direct and browseable

Those are editor-surface improvements, not changes to the basic ownership model.

### Current Edges To Expect

The editor is real and central, but some workspace-level polish is still underway:
- some generic canvas quality-of-life behavior is still being added
- the richer overlay model is still being cleaned up
- the node palette and drag-drop add flow are still being formalized

The main mental model is already stable, though: the Spaghetti Editor is where graph-authored truth starts.

### Learn More

- [Workspace Overview](Overview.md)
- [Spaghetti Editor Architecture](../../Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Spaghetti-Editor-index.md)
- [Browser](Browser.md)
- [Model Viewport](Model-Viewport.md)
