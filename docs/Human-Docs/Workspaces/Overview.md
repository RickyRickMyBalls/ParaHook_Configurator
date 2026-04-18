# Workspace Overview

## Doc Header

### Doc History
1. 2026-04-18 12:22:00: Added the first reader-facing overview for ParaHook workspaces so this section explains the shared workspace model, the main surfaces, and the difference between shared project truth and local workspace presentation in plain English

### Purpose

This page explains what ParaHook means by a workspace.

Use it to:
- understand how the main surfaces fit together
- see what stays shared across the app versus what stays local to one view
- learn when to use the Browser, Model Viewport, or Spaghetti Editor

## Doc Body

### What A Workspace Is

In ParaHook, a workspace is one working surface inside the app.

Some workspaces are about reading project structure. Some are about authoring graph logic. Some are about looking at geometry.

The important part is that these surfaces are meant to live inside one shared workspace system. You can split them, move them, float them, and in some cases pop them out without turning them into separate products.

### One App, Shared Truth

Workspaces do not each keep their own private copy of the project.

The project, graph documents, build state, and published content stay shared. What changes from workspace to workspace is usually presentation:
- which graph is open
- which object is selected
- which camera angle you are using
- whether a surface is docked, tiled, floating, or popped out

That shared-truth model is important because it lets ParaHook act like one tool instead of a stack of disconnected panels.

### The Main Workspaces

#### Browser

The Browser is the project tree.

It is where you look at structure, select things, reorganize content, and see high-level state like visibility and loading. It is mostly a reading and control surface, not the place where geometry logic is authored.

#### Model Viewport

The Model Viewport is the 3D review surface.

It is where you inspect the model, orbit around it, and see what the current geometry result looks like. It should stay downstream from graph and worker truth, which means it shows geometry states rather than secretly becoming the source of geometry logic.

#### Spaghetti Editor

The Spaghetti Editor is the graph authoring surface.

It is where nodes, wires, graph documents, and feature logic live. This is the workspace that turns authored graph intent into something the rest of the app can preview, build, and eventually export.

### How These Surfaces Work Together

A simple way to think about the three main workspaces is:
- the Spaghetti Editor authors intent
- the Browser organizes project content
- the Model Viewport shows the result

Those boundaries are useful even when the same object or graph shows up in more than one place.

For example:
- selecting something in the Browser should help the rest of the app understand what you mean
- opening a graph in the Spaghetti Editor should not turn the Browser into a second graph list
- changing the camera in one viewport should not rewrite the project itself

### Local State Versus Shared State

Some state belongs to one surface.

Examples of local state:
- a viewport camera
- a floating window size
- which graph a particular editor surface is showing

Some state belongs to the project as a whole.

Examples of shared state:
- project content and hierarchy
- graph documents
- worker results
- visibility and published output that other surfaces need to agree on

When ParaHook behaves well, those lines stay clear.

### What This Means In Practice

You do not need to treat each workspace as a different mode of the whole app.

A better mental model is:
1. Pick the surface that matches the job you are doing.
2. Let the rest of the app stay in sync through shared project truth.
3. Move or split surfaces when it helps, without expecting the meaning of the project to change just because the layout changed.

That is the direction the workspace system is pushing toward.

### Learn More

- [Browser](Browser.md)
- [Model Viewport](Model-Viewport.md)
- [Spaghetti Editor](Spaghetti-Editor.md)
- [Workspace Modes Architecture](../../Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md)
