# Engine Architecture

## Doc Header

### Doc History
1. 2026-04-18 11:45:00: Created this first reader-facing engine overview for `Human-Docs` so the current ParaHook runtime can be explained in plain English without forcing readers into the deeper architecture notes first

### Purpose

This page explains how ParaHook's main runtime pieces fit together.

Use it to understand:
- which layer owns truth
- what the worker is responsible for
- what the viewer is responsible for
- how graph authoring fits into the same engine

## Doc Body

### The Three-Part Engine

The current ParaHook engine is easiest to understand as three connected jobs:

1. The app owns state and decisions.
2. The worker computes build results.
3. The viewer displays those results.

That is the simplest reliable read of the system.

If you forget everything else on this page, keep this:

The app decides what ParaHook means right now.
The worker does the heavy build work.
The viewer shows the result.

### What The App Layer Owns

The app layer is the control center.

It owns things like:
- graph documents and graph editing state
- workspace and surface state
- selections and visibility state
- build requests and build policy
- the accepted results after they return from the worker

This is why ParaHook keeps saying that the app owns truth.

The worker should not become the product model.
The viewer should not become the product model.

They both depend on state and decisions made in the app layer.

### What The Worker Does

The worker is the execution side of the engine.

Its job is to:
- receive typed requests
- run deterministic build logic
- report progress
- return typed results

The worker is deliberately separated from the UI so geometry work does not get tangled up with React rendering or panel logic.

That separation is one of the healthier parts of the current architecture.

The important limit is just as important as the capability:

the worker computes, but it does not own the project's meaning.

### What The Viewer Does

The viewer is the rendering side of the engine.

It owns things like:
- the scene
- the camera
- draw and visibility presentation
- selection display

What it should not own:
- graph logic
- build policy
- canonical geometry truth
- project structure

The viewer is there to help you see and inspect the current state of the app, not to define it.

### How Data Moves Through The Engine

At a high level, the normal path is:

`authoring in the app`
-> `build request`
-> `worker execution`
-> `typed result`
-> `viewer presentation`

There are more details inside that path, but the broad shape stays the same.

This matters because ParaHook gets harder to reason about whenever one layer starts skipping ahead and reaching into another layer's job.

### Spaghetti Is An Authoring Front End, Not A Second Engine

The graph system, usually called `Spaghetti`, adds an authoring and compile layer before worker execution.

In practice that means:
- you edit a graph
- the app evaluates and compiles that graph
- the app prepares build inputs
- the worker runs the build
- the viewer shows the result

So even though the graph editor feels like a big system of its own, it still feeds the same execution path.

That is an important mental model:

ParaHook is not meant to be two unrelated runtimes.

It is one engine with different authoring paths in front of it.

### Why The Boundaries Matter

These boundaries are not just technical cleanup.

They protect a few important behaviors:
- UI work can change without rewriting geometry execution
- worker logic can become stronger without turning the viewer into a build engine
- the viewer can get better display behavior without quietly becoming the model owner
- graph-native authoring can grow without having to invent a second hidden runtime

When ParaHook is healthy, those layers cooperate without stealing each other's job.

### The Best One-Sentence Summary

ParaHook works best when the app owns truth, the worker computes from that truth, and the viewer displays the result without becoming a second source of ownership.

### Learn More

- [Core Concepts](Core-Concepts.md)
- [Project Flow](Project-Flow.md)
- [System Map](../../Human-Plans/Architecture/System-Map.md)
- [Architecture Engine Doc](../../Human-Plans/Architecture/Engine-Architecture.md)
