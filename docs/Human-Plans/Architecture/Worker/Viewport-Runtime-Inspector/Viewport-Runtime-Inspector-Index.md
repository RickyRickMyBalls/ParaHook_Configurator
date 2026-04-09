# Viewport Runtime Inspector Index

## Doc Header

### Doc History
15. 2026-04-09 09:05: Marked `VRI-2.4 - Queue Lifecycle Hardening And Handoff` shipped by refreshing this family index so the queue/archive lane now reads as closed after accepted-build replacement, dispatcher-owned stale-drop insulation, and bounded archive rollover were proven through the existing lifecycle seams, and the immediate family handoff now moves forward to `VRI-3 - Change Impact And Dependency Visibility`
14. 2026-04-09 09:01: Tightened this family index so the immediate handoff to `VRI-2.4 - Queue Lifecycle Hardening And Handoff` now explicitly says the final `VRI-2` slice should prove accepted-build replacement, dispatcher-owned stale-drop insulation, and bounded archive rollover through the existing queue/archive store and lifecycle-test seams instead of leaving that handoff phrased only as generic hardening
13. 2026-04-09 08:55: Marked `VRI-2.3 - Archive Truth Surface` shipped by refreshing this family index so the runtime inspector now reads as rendering a quieter recent archive beneath the visible active queue while keeping lifecycle hardening deferred, and the immediate handoff now moves forward to `VRI-2.4 - Queue Lifecycle Hardening And Handoff`
12. 2026-04-09 08:49: Marked `VRI-2.2 - Active Queue Surface` shipped by refreshing this family index so the runtime inspector now reads as rendering an explicit active queue beneath the current runtime-task area while keeping archive visibility deferred, and the immediate handoff now moves forward to `VRI-2.3 - Archive Truth Surface`
11. 2026-04-09 08:36: Marked `VRI-2.1 - Queue Read Contract And Store Widening` shipped by refreshing this family index so the runtime inspector now reads as owning one explicit app-side active-queue plus recent-archive truth seam behind the existing current-task presentation, and the immediate handoff now moves forward to `VRI-2.2 - Active Queue Surface`
10. 2026-04-09 08:18: Added the standalone `VRI-2 - Queue Visibility And Archive Truth` future phase doc and refreshed this family index so the next runtime-inspector lane now points at an explicit four-step execution ladder for queue-store widening, active queue rendering, archive truth, and lifecycle hardening instead of leaving `VRI-2` as only a one-line umbrella placeholder
9. 2026-04-09 08:13: Marked `VRI-1.4 - Combined Inspector Read Model And Hardening` shipped by refreshing this family index so the compact runtime-inspector surface now reads as composed through one explicit combined inspector model, the first `VRI-1` foundation subset now reads as closed, and the immediate handoff now moves forward to `VRI-2 - Queue Visibility And Archive Truth`
8. 2026-04-09 08:08: Tightened this family index so the immediate handoff to `VRI-1.4 - Combined Inspector Read Model And Hardening` now explicitly says the final `VRI-1` slice should consolidate the shipped shell, viewport stats, and current-task reads behind one compact inspector model instead of leaving that composition inlined inside `TitleStatusBar.tsx`
7. 2026-04-09 08:05: Marked `VRI-1.3 - Active Runtime Task Card` shipped by refreshing this family index so the compact runtime-inspector shell now reads as rendering one dispatcher-backed current-task card beneath the shipped viewport stats block, and the immediate handoff now moves forward to `VRI-1.4 - Combined Inspector Read Model And Hardening`
6. 2026-04-09 08:01: Tightened this family index so the immediate handoff to `VRI-1.3 - Active Runtime Task Card` now explicitly says the next slice should derive one honest current-task card from `BuildDispatcher` lifecycle hooks and app-owned build wiring instead of leaving the worker-card work phrased only as a generic active-task follow-on
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

### [x] `VRI-1` - Foundation Runtime Surface

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

Current shipped final step:
- `VRI-1.4 - Combined Inspector Read Model And Hardening`
  - shipped
  - the inspector now reads through one compact app-side combined model so the shell, viewport stats, current-task card, and fallback copy no longer depend on panel-local ad hoc composition in `TitleStatusBar.tsx`

Current next step:
- `VRI-3 - Change Impact And Dependency Visibility`
  - build on the now-stable queue/archive runtime history to explain what rebuilt, what reused, and what stayed untouched without inventing fake dependency stories

Current shipped third step:
- `VRI-1.3 - Active Runtime Task Card`
  - shipped
  - the inspector shell now renders one accepted dispatcher-backed current-task card beneath the viewer-owned viewport stats block
  - keep the new viewport stats contract intact, then add one honest current runtime-task card without widening into full queue or archive history yet

Current shipped second step:
- `VRI-1.2 - Viewport Stats Foundation`
  - shipped
  - the inspector shell now renders the first viewer-owned triangles/lines/points/FPS read through the explicit `Viewer -> viewerBridge -> ViewerHost -> app state -> TitleStatusBar` path

### [x] `VRI-2` - Queue Visibility And Archive Truth

- expose active queue ordering and recently resolved task states
- keep active, queued, done, reused, and error truth visually distinct
- retain honest top-to-bottom execution ordering

Standalone future phase doc:
- `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Future/Viewport-Runtime-Inspector_Phase VRI-2 - Queue Visibility And Archive Truth.md`

Recommended first proof:
- widen the current-task seam into explicit queue/archive state
- show queued items beneath the active item in accepted execution order
- retain a small quieter archive for completed, reused, and error rows

Current next step:
- `VRI-3 - Change Impact And Dependency Visibility`
  - extend the now-closed queue/archive foundation into real rebuilt-versus-reused-versus-untouched explanation without reopening runtime history ownership

Current shipped third step:
- `VRI-2.3 - Archive Truth Surface`
  - shipped
  - the inspector now renders a quieter recent archive beneath the active queue, keeping completed, reused, and error outcomes visible without turning the viewport surface into a transcript

Current shipped final step:
- `VRI-2.4 - Queue Lifecycle Hardening And Handoff`
  - shipped
  - the inspector queue/archive lane now proves accepted-build replacement, dispatcher-owned stale-drop insulation, and bounded recent-archive rollover so the visible surface stays calm and honest before later change-impact work builds on it

Current shipped second step:
- `VRI-2.2 - Active Queue Surface`
  - shipped
  - the inspector now renders the ordered active queue beneath the current runtime-task area, keeping the top active card visually strongest while queued rows remain quieter and honest about not having started yet

Current shipped first step:
- `VRI-2.1 - Queue Read Contract And Store Widening`
  - shipped
  - the inspector now owns one explicit active-queue plus recent-archive state seam fed by accepted build lifecycle hooks, with queued, active, reused, done, and error entries kept distinct before visible queue/archive rendering widens

### [ ] `VRI-3` - Change Impact And Dependency Visibility

- explain what rebuilt, what reused, and what remained untouched after edits
- relate runtime cards back to graph/build ownership where that truth exists
- keep dependency visibility grounded in real invalidation and planning data
