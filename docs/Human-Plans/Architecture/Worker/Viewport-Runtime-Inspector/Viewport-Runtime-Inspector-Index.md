# Viewport Runtime Inspector Index

## Doc Header

### Doc History
5. 2026-04-09 07:36: Marked `VRI-1.2 - Viewport Stats Foundation` shipped by refreshing this family index so the compact runtime-inspector shell now reads as rendering the first viewer-owned triangles/lines/points/FPS contract, and the immediate handoff now moves forward to `VRI-1.3 - Active Runtime Task Card`
4. 2026-04-09 07:27: Tightened this family index so the immediate handoff to `VRI-1.2 - Viewport Stats Foundation` now explicitly says the next slice should introduce the first viewer-owned stats contract through `Viewer`, `viewerBridge`, `ViewerHost`, and the existing runtime-inspector shell instead of leaving the stats work phrased only as a generic panel fill-in step
3. 2026-04-09 07:19: Marked the first `Viewport Runtime Inspector` shell slice shipped by refreshing this family index so `VRI-1.1` now reads as landed and the immediate handoff moves forward to `VRI-1.2 - Viewport Stats Foundation`
2. 2026-04-09 07:14: Refreshed this family index so the immediate `VRI-1` handoff now explicitly points at `VRI-1.1` as the implementation-ready first slice grounded in the live `TitleStatusBar`, `PrimaryViewportLeftDock`, and left-dock preview-controller seams rather than leaving the first runtime-inspector cut phrased only as a higher-level shell idea
1. 2026-04-09 07:05: Added this umbrella index for the `Viewport Runtime Inspector` family under `Architecture/Worker/`, turning the moved vision note into a real mini-family with a dedicated `Future/` landing zone and a first `VRI-1` foundation phase that can be executed in smaller Codex-sized subphases

### Purpose

This doc defines the umbrella architecture direction for `Viewport Runtime Inspector`.

This file is the umbrella index for the `Viewport-Runtime-Inspector` family.

Use it to answer:
- what the `Viewport Runtime Inspector` is trying to accomplish
- how it relates to the viewport title card, worker runtime, and later dependency visibility
- where the vision doc lives versus where implementation-ready phase docs should live
- which first phase should land before deeper queue and impact work

### Family Structure

Use this folder like this:

- `Viewport-Runtime-Inspector-Index.md`
  - umbrella architecture direction
  - family summary
  - phase ladder
- `Viewport-Runtime-Inspector-Vision.md`
  - fuller product-direction capture
  - behavior and ownership notes
- `Future/`
  - standalone implementation-ready `Viewport Runtime Inspector` phase docs
- `Shipped/`
  - later shipped records for completed `Viewport Runtime Inspector` cuts if the family grows enough to justify them

## Doc Body

### Concept

`Viewport Runtime Inspector` is the viewport-local runtime explanation surface for ParaHook.

It should help the user understand:
- what is currently in the viewport
- what the worker is doing right now
- how much work is queued
- what changed because of the latest edit

The key product value is runtime honesty, not decorative status chrome.

### Relationship To Worker

`Viewport Runtime Inspector` is a worker-adjacent read surface, not a second worker owner.

Recommended ownership split:

- `Worker`
  - owns named execution units, queue state, progress truth, and result/invalidation facts
- `Viewport Runtime Inspector`
  - renders that runtime truth in a viewport-local way
- `Viewport`
  - keeps owning scene display and viewer interaction

Important rule:

- the inspector should not invent fake task names, fake queue ordering, or fake reuse states purely for UI polish
- it should read explicit runtime truth exposed by the worker/build orchestration layers

### Relationship To Vision

Use the family docs like this:

- `Viewport-Runtime-Inspector-Vision.md`
  - product-direction capture
  - longer explanation of desired cards, queue behavior, and impact visibility
- `Viewport-Runtime-Inspector-Index.md`
  - compact family summary
  - current phase ladder
  - pointer to the next implementation-ready slice

### First Delivery Shape

The first honest delivery should stay narrow:

- expandable title-panel foundation
- one viewport-local details panel
- one stable stats area
- one current-task read
- no fake dependency map before the runtime exposes real dependency facts

This keeps the first slice useful without overcommitting to the later queue and impact system all at once.

## Phases

### [ ] `VRI-1` - Foundation Runtime Surface

- establish the family with one expandable runtime-inspector shell beneath the viewport title card
- lock the first combined read model shape for viewport stats plus one active runtime task
- keep the first ladder broken into small implementation-ready subphases inside the standalone `VRI-1` doc

Standalone future phase doc:
- `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Future/Viewport-Runtime-Inspector_Phase VRI-1 - Foundation Runtime Surface.md`

Recommended first proof:
- one expandable panel under the title card
- one stable viewport-stats read
- one active-task surface fed by honest runtime state
- no queue archive or dependency impact scope yet

Current shipped first step:
- `VRI-1.1 - Panel Shell And Expand Collapse Contract`
  - shipped
  - the compact title card now expands into one honest empty runtime-inspector shell inside the left-dock status zone
  - existing browser/meatball dock-preview behavior remains intact because the first shell still lives inside the status-target seam

Current next step:
- `VRI-1.3 - Active Runtime Task Card`
  - keep the new viewport stats contract intact, then add one honest current runtime-task card without widening into full queue or archive history yet

Current shipped second step:
- `VRI-1.2 - Viewport Stats Foundation`
  - shipped
  - the inspector shell now renders the first viewer-owned triangles/lines/points/FPS read through the explicit `Viewer -> viewerBridge -> ViewerHost -> app state -> TitleStatusBar` path

### [ ] `VRI-2` - Queue Visibility And Archive Truth

- expose active queue ordering and recently resolved task states
- keep active, queued, done, reused, and error truth visually distinct
- retain honest top-to-bottom execution ordering

### [ ] `VRI-3` - Change Impact And Dependency Visibility

- explain what rebuilt, what reused, and what remained untouched after edits
- relate runtime cards back to graph/build ownership where that truth exists
- keep dependency visibility grounded in real invalidation and planning data
