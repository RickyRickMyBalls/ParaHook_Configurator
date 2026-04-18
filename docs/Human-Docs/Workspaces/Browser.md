# Browser

## Doc Header

### Doc History
1. 2026-04-18 12:22:00: Added the first reader-facing Browser page for Human Docs so the Browser is explained as ParaHook's project tree, selection surface, and structure control layer without requiring readers to decode the planning-family docs first

### Purpose

This page explains what the Browser is for.

Use it to:
- understand what kind of information lives in the Browser
- learn what the Browser owns versus what it only reflects
- see how Browser actions relate to the viewport, console, and graph editor

## Doc Body

### Short Version

The Browser is ParaHook's project tree.

It helps you answer questions like:
- what is in this project
- how is it organized
- what is selected
- what is visible
- what is loaded, pending, or failing

It is a workspace for structure and control, not the place where geometry logic is authored.

### What Lives In The Browser

The Browser is moving toward one clear tree for project content.

That tree can include:
- authored assemblies and components
- objects created from graph output
- imported or reference-backed content
- nested structure that helps the rest of the app talk about the same thing consistently

The direction here is important: imported content should not feel like a separate fake world forever. If something behaves like real project content, the Browser increasingly tries to show it that way.

### What You Do In The Browser

The Browser is where you:
- inspect project structure
- expand and collapse hierarchy
- select rows and hand that selection to the rest of the app
- move content around when reorganization is allowed
- toggle visibility
- read load, error, and runtime state at a glance

It also acts as a useful control surface for imported content. You can see when something is still loading, when a reference has produced real rows, and where that content sits in the wider project.

### What The Browser Does Not Own

The Browser should not quietly become the owner of everything it can show.

It does not own:
- the worker build engine
- viewer rendering internals
- graph authoring
- geometry semantics

Instead, it reads shared truth and turns that into a tree the user can work with.

That means Browser actions should stay honest:
- visibility should stay visibility
- structure should stay structure
- selection should help other surfaces understand focus

The Browser should not hide a second build system or a second graph system behind row clicks.

### How Browser Fits With Other Workspaces

The Browser works best when its role stays simple:
- the Browser shows project structure
- the Spaghetti Editor authors graph logic
- the Model Viewport shows geometry and scene state

Those surfaces overlap, but they should not blur together.

For example:
- selecting a row in the Browser can focus the right thing elsewhere
- hiding a row affects what you see, not what the graph means
- dragging content in the Browser changes project structure, not camera behavior or worker ownership

### What The Browser Is Trying To Improve

A lot of recent Browser work is about honesty and simplification.

The main direction is:
- one visible tree instead of separate tree species that happen to share space
- clearer row identity for imported and authored content
- better parity between row actions, context menus, and other command surfaces
- clearer visibility and status signals

That makes the Browser easier to trust. When a row looks like a real project item, it should behave like one as often as possible.

### Current Edges To Expect

The Browser is already useful, but a few boundaries are still being tightened:
- some visibility actions are still catching up across every command path
- imported objects can already expose deeper structure, but some follow-up work is still needed to make that structure feel fully first-class
- the UI is still being polished so long lists, resizing, and row affordances feel more consistent

None of that changes the main mental model: the Browser is the project's structural read and control surface.

### Learn More

- [Workspace Overview](Overview.md)
- [Browser Architecture](../../Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md)
- [System Map](../../Human-Plans/Architecture/System-Map.md)
- [Spaghetti Editor](Spaghetti-Editor.md)
