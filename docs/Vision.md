# ParaHook Vision

## Doc Header

### Doc History
1. 2026-04-04 22:23: Added this short agent-facing vision summary as the fast operating pointer for repo rules and day-to-day decision checks, distilling the non-negotiable direction from `docs/Human-Plans/roadmap/Vision-roadmap.md` into one simpler surface that can be referenced directly from `AGENTS.md`

### Purpose

This file is the short operational vision summary for ParaHook.

Use it for:
- quick product and architecture alignment checks
- day-to-day Codex decision guidance
- preserving the direction that should stay stable even when local implementation details change

For the fuller canonical north-star read:
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

If this file and the canonical vision doc ever drift:
- prefer `docs/Human-Plans/roadmap/Vision-roadmap.md`

## Doc Body

### What Must Stay True

1. ParaHook is growing toward a graph-native CAD workspace in the browser, not a permanently foothook-specific configurator.

2. Graph-authored truth comes first. Runtime memory, published output, project composition, and viewer/workspace presentation should stay downstream from authored graph truth instead of quietly becoming competing sources of ownership.

3. `Graph Documents` and `Content` must stay distinct. Authoring identity and project/published hierarchy are different surfaces, and `Content` should not collapse into a second graph list.

4. Graph output handoff should become more explicit over time, not more implicit. The Browser should not infer long-term structure only from final meshes.

5. Build/generate controls and viewer presentation controls are different systems. Viewer-only changes should stay rebuild-free whenever possible, and geometry truth should not get trapped inside viewer state.

6. Layers, visibility, and transform history should become authored content systems shared across Browser, Console, viewer, toolbar, and workspace reads, not one-off behavior owned by whichever surface happened to ship first.

7. Node and editor surfaces should stay generic where possible. Prefer registry, schema, contract, template, and shared-system solutions over one-off panels or product-specific branching in shared layers.

8. The workspace should stay one hybrid surface model. `Windowed`, `Tiled`, and later pop-out placement are shell variations, not separate feature concepts with duplicated ownership.

9. Contracts, schema, IR, routing identity, and worker/result seams should stay explicit. Prefer typed boundaries over reach-in shortcuts between app, graph, worker, Browser, and viewer layers.

10. Transitional legacy seams are allowed only as a replacement path. Do not make the legacy bridge, product-specific scaffolding, or temporary compatibility layers the permanent architecture.

### Quick Decision Filter

Prefer changes that:
- move ownership toward graph-native and project-explicit seams
- keep Browser/project hierarchy real and legible
- reduce one-off feature shell behavior
- strengthen shared authored systems such as Layers and Transform
- make contracts and published outputs more explicit

Be careful with changes that:
- solve a local problem by inventing another hidden owner
- make `Content` behave like another graph list
- deepen product-specific branching in shared systems
- trap authored behavior inside viewer-only or panel-only state
- extend temporary legacy bridges without a clear replacement goal
