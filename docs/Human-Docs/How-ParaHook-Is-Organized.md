# How ParaHook Is Organized

## Doc Header

### Doc History
1. 2026-04-18 11:29: Created this first big-picture organization page so readers can understand how the app layer, graph/editor layer, worker, viewer, Browser, and workspace surfaces relate without needing the deeper architecture maps first

### Purpose

This page explains the big-picture organization of ParaHook.

Use it to understand:
- the main layers of the app
- which parts own truth versus computation versus display
- how graph editing, Browser content, and the viewport fit together
- why the workspace matters instead of being just a shell around separate tools

## Doc Body

### The Short Version

ParaHook is easiest to understand as a few connected systems with different jobs:

1. The app layer keeps the main state and coordinates the product.
2. The graph and editor layer describes authored logic.
3. The worker runs deterministic build work.
4. The viewer renders the result.
5. The Browser and workspace surfaces help people understand and move through the project.

The key rule is simple:

The app owns truth, the worker computes, and the viewer displays.

### The Main Layers

#### App Layer

The app layer is the control center.

It owns product state, surface coordination, selection, build requests, and the higher-level decisions about what the user is working on. It is where the overall workspace comes together.

#### Graph And Editor Layer

The graph and editor layer is where authored logic lives.

This is the part of ParaHook that lets people describe geometry and relationships with nodes, wires, and graph documents. It is not just a UI for the worker. It is the authoring side of the system.

#### Worker Layer

The worker is the execution layer.

Its job is to receive a request, run deterministic build logic, and return structured results. It computes geometry and build results, but it does not decide what the product means on its own.

#### Viewer Layer

The viewer is the rendering layer.

It owns scene rendering, camera behavior, and display-side interaction. It should show the current result clearly, but it should not quietly become the place where product truth lives.

#### Browser And Workspace Layer

The Browser and workspace surfaces help people navigate the project.

The Browser is meant to explain what exists in the project and how authored outputs become readable content. The workspace layer decides how surfaces such as the Browser, editor, viewport, and later other tools are arranged and moved around.

### How Work Moves Through The System

The normal direction of work looks like this:

1. A person authors or changes graph logic.
2. The app prepares build intent and routes work to the worker.
3. The worker computes results and sends them back.
4. The app accepts those results and shapes them for the UI.
5. The viewer renders what should be shown.
6. The Browser and other surfaces help explain where that result belongs in the broader project.

This matters because ParaHook is trying to keep authored truth, computed truth, and displayed truth from collapsing into one blurry layer.

### Two Important Separations

Two distinctions show up again and again across the project.

#### Graph Documents And Content

`Graph Documents` are about authoring identity.

`Content` is about project or published structure.

Those two surfaces are related, but they are not the same list. A graph is where work is authored. Content is where the project explains what exists because of that authored work.

#### Build And View

Build controls and view controls are also different systems.

The worker and build path decide what geometry exists. The viewer decides how that result is displayed. Browser rows, viewport settings, and presentation choices should not quietly replace the real build or content model.

### Why The Workspace Model Matters

ParaHook is not trying to become a pile of disconnected panels.

The workspace is meant to host several major surfaces inside one shared model. `Windowed`, `Tiled`, and later pop-out placement are different ways of arranging the same kinds of surfaces, not different feature worlds with separate ownership rules.

That is why the Browser, graph editor, viewport, and future surfaces need to feel coordinated rather than stitched together.

### A Good Working Mental Model

If you need one simple way to hold the whole app in your head, use this:

The graph describes intent, the app coordinates state, the worker turns that intent into results, the Browser explains where those results belong, and the viewer makes them visible.

### Learn More

- [System Map](../Human-Plans/Architecture/System-Map.md)
- [Engine Architecture](../Human-Plans/Architecture/Engine-Architecture.md)
- [Vision Roadmap](../Human-Plans/roadmap/Vision-roadmap.md)
- [Workspace Modes](../Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md)
