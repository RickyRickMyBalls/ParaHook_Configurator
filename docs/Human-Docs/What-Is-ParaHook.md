# What Is ParaHook

## Doc Header

### Doc History
1. 2026-04-18 11:29: Created this first human-readable overview page so the new `Human-Docs` area can explain what ParaHook is trying to become, what kind of work it already supports, and which parts of the product are still taking shape without sending readers straight into planning docs

### Purpose

This page gives the plain-English overview of ParaHook.

Use it to understand:
- what kind of app ParaHook is
- what it is trying to become
- how graph editing, project structure, build execution, and 3D viewing fit together
- what already feels real and what is still evolving

## Doc Body

### Short Version

ParaHook is a browser-based CAD workspace that is growing around graph authoring.

It is not meant to stay a one-purpose configurator with a few extra controls bolted on. The long-term direction is a broader node-based CAD environment where graphs describe geometry, project content gives that work structure, and shared workspace surfaces let people author, inspect, and manage the result from different angles.

### What The App Is Trying To Be

At a high level, ParaHook is aiming for one coherent system with a few connected parts:

- a graph editor for authoring geometry and logic
- a Browser for understanding project content and published results
- a model viewport for inspecting and working with the current 3D result
- a build pipeline that turns authored graph intent into deterministic geometry output
- a workspace model that can host those surfaces without turning each one into its own separate mini-app

That matters because ParaHook is trying to keep one chain of truth:

`graph authoring -> geometry execution -> published output -> project content -> workspace presentation`

The farther the app moves in that direction, the easier it is to understand what is authored, what is derived, and what is only being displayed.

### What Makes ParaHook Different

ParaHook mixes a few workflows that are often split apart in other tools.

You can think of it as combining:

- node-based authoring
- CAD-style build and geometry thinking
- project and content organization
- interactive 3D viewing inside the same workspace

The goal is not only to generate one object and export it. The goal is to let authored graph logic become part of a larger project model that can grow into components, objects, assemblies, layers, transforms, and cleaner published outputs over time.

### What Already Feels Real

Even though the product is still evolving, several parts of the shape are already clear.

ParaHook already has:

- a real graph-driven authoring direction
- a clear separation between app state, worker execution, and viewer rendering
- a Browser and workspace direction instead of a single-screen tool
- typed build contracts and a deterministic execution path
- a growing distinction between authored graph data and downstream preview or render data

So this is not only a sketch of a future app. There is already a working architecture underneath it.

### What Is Still Evolving

Some important ideas are still becoming more explicit.

The main areas still taking shape are:

- the full project and Browser hierarchy above graph outputs
- how published content should look and behave across the workspace
- how preview, final results, and export should line up around one honest geometry path
- how layers, transforms, and visibility become durable authored systems instead of one-off UI behavior
- how the workspace should host more surfaces without each feature inventing its own shell rules

That means some names, boundaries, and flows still reflect transitional history. The direction is steady, but not every surface is at the final level of clarity yet.

### A Helpful Mental Model

If you are new to the project, the most useful mental model is:

ParaHook is becoming a graph-native CAD workspace where the graph is where ideas are authored, the worker is where geometry is computed, the Browser is where project content becomes legible, and the viewport is where that work becomes visible.

### Learn More

- [Vision](../Vision.md)
- [Vision Roadmap](../Human-Plans/roadmap/Vision-roadmap.md)
- [System Map](../Human-Plans/Architecture/System-Map.md)
- [Workspace Modes](../Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md)
