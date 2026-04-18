# Model Viewport

## Doc Header

### Doc History
1. 2026-04-18 12:22:00: Added the first reader-facing Model Viewport page for Human Docs so the main 3D workspace is explained as a geometry review surface with explicit draft-versus-final behavior, shared project truth, and local camera state

### Purpose

This page explains what the Model Viewport is for.

Use it to:
- understand what the viewport owns
- learn how draft and final geometry are supposed to behave
- see how the viewport fits into the wider workspace system

## Doc Body

### Short Version

The Model Viewport is ParaHook's 3D review surface.

It is where you look at geometry, navigate the scene, and check whether the current result matches what you meant to build.

It should stay downstream from authored graph truth and worker execution. In plain English: the viewport shows geometry states, but it should not secretly become the place where geometry truth is invented.

### What The Viewport Owns

The viewport owns presentation and inspection.

That includes:
- camera and view state
- local display choices
- visible status about what kind of result you are seeing
- the decision about how a viewport surface presents available geometry results

That does not mean it owns the model itself.

Graph documents still describe the authored intent. The worker still executes geometry. The viewport is where those results become visible and understandable.

### Draft And Final Results

ParaHook is trying to support two useful kinds of geometry result:
- a fast draft result for quick feedback during editing
- a slower, more authoritative result for durable geometry and later export

The viewport is the place where that difference becomes visible.

The current user-facing model is:
- `Auto`
  - show fast feedback first, then swap to the better result when it is ready
- `Draft`
  - stay on the fast preview result
- `Final`
  - prefer the authoritative result and skip unnecessary preview work

That last point matters. `Final` is not just "hide the preview." It is meant to change how the system spends work.

### Why This Surface Matters

The viewport sits at the meeting point between three big parts of ParaHook:
- graph-authored intent
- worker-side geometry execution
- user-facing visual review

That makes it a very important honesty surface.

If the viewport starts inventing special geometry rules of its own, the app becomes harder to trust. If it clearly shows what kind of result you are looking at and where it came from, the rest of the system stays easier to reason about.

### Local View, Shared Project

A viewport can have local state that another surface does not share.

Examples:
- camera angle
- zoom level
- local viewport controls
- whether this viewport is showing draft or final behavior

But it still participates in shared project truth.

That means multiple viewports can look at the same project while still having different cameras or display choices. The scene stays shared even when the presentation differs.

### The Model Viewport In The Workspace System

The viewport is now one workspace surface among others, not a special world outside the layout system.

That means it can sit inside the same shared workspace model as other surfaces. ParaHook is also moving away from the older assumption that one main viewport has to stay protected forever. The main slot can increasingly hand off to other supported workspaces when the layout calls for it.

The important boundary is still the same:
- workspace layout decides where a viewport lives
- geometry execution decides what the result is
- the viewport decides how that result is presented

### Current Edges To Expect

The fast preview path is already meaningful, but the geometry stack is still maturing.

The main live direction is:
- keep draft and authoritative results in one compatible contract family
- make viewport swap behavior clearer during long-running builds
- keep later export tied to authoritative geometry instead of a hidden viewport-only shortcut

So the viewport is already a real review surface, but it is still growing into the full long-range geometry model.

### Learn More

- [Workspace Overview](Overview.md)
- [Model Viewport Architecture](../../Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md)
- [System Map](../../Human-Plans/Architecture/System-Map.md)
- [Vision](../../Vision.md)
