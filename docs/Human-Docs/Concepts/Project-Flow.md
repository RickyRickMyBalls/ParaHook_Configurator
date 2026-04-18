# Project Flow

## Doc Header

### Doc History
1. 2026-04-18 11:45:00: Created this first Concepts flow page for `Human-Docs` so readers can follow a normal ParaHook loop from authoring to build to inspection without reading the deeper planning docs first

### Purpose

This page explains the normal flow of work through ParaHook.

Use it to understand:
- where authoring usually starts
- how a graph becomes build work
- how results show up in the project and viewport
- how the main surfaces work together during a typical session

## Doc Body

### The Everyday Loop

A normal ParaHook session usually looks like this:

1. Open a graph or project area you want to work on.
2. Author or change something in the graph.
3. Let the app prepare build work from that change.
4. Let the worker compute the result.
5. Inspect the result in the viewport and Browser.
6. Keep iterating until the project content says what you want it to say.

That loop is more important than any single panel.

### Step 1: Start From The Right Surface

Most work begins from one of three places:

- the `Browser`, when you want project structure, graph access, or content inspection
- the `Spaghetti Editor`, when you want to author graph logic directly
- the `Model Viewport`, when you want to inspect geometry and react to what you see

You are still in one app when you move between those surfaces.

ParaHook is built around that handoff.

You are not supposed to feel like you are jumping between unrelated tools.

### Step 2: Author In A Graph Document

When you make a meaningful change, it usually starts in a graph document.

That might mean:
- changing node values
- rewiring outputs
- adjusting feature behavior
- deciding what the graph should expose

This is the authored layer of the flow.

It answers the question:

"What are we trying to build?"

### Step 3: Turn Authoring Into Build Work

After the graph changes, the app has to turn that authoring state into something the build engine can execute.

This is where ParaHook's compile and request-preparation work happens.

The important idea is not the exact internal file path.
The important idea is the handoff:

- graph intent is resolved
- build inputs are prepared
- the worker receives a clear request instead of raw editor state

That handoff keeps authoring concerns separate from execution concerns.

### Step 4: Let The Worker Compute

Once the request is ready, the worker does the actual build work.

The worker:
- runs deterministic build logic
- returns typed results
- stays separate from the UI while it does that work

This is the point where authored intent becomes computed geometry output.

### Step 5: See The Result In The Viewport

After the worker returns results, the app can show them in the viewer.

That is where preview becomes useful.

You can:
- check whether the shape looks right
- inspect the current result
- decide whether to keep editing or move on

The key detail is that the viewport is part of the feedback loop.

It is not supposed to become the hidden owner of the project.

### Step 6: Read The Project Through The Browser

The Browser gives the result project context.

This is where ParaHook can separate:
- the graph you authored
- the content that the project now exposes

That split matters because a project can grow beyond one open editor view.

The Browser is there to help you read the project as a project, not only as an active graph session.

### Step 7: Iterate Across Surfaces

Most real work is not one straight pass.

You usually bounce between:
- authoring in the graph
- checking the viewport
- reading project content in the Browser
- returning to the graph to adjust the next detail

That back-and-forth is normal.

ParaHook's workspace model is meant to support it by keeping the major surfaces coordinated instead of isolated.

### What Usually Stays Stable During The Loop

Even when the app feels busy, a few things should stay stable:

- the graph remains the authored source
- the worker remains the compute layer
- the viewer remains the display layer
- the Browser remains the project-content read

When those roles stay clear, iteration feels much calmer.

### Learn More

- [Core Concepts](Core-Concepts.md)
- [Engine Architecture](Engine-Architecture.md)
- [Workspace Modes](../../Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md)
- [Vision Roadmap](../../Human-Plans/roadmap/Vision-roadmap.md)
