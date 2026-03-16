# Now Next Later Much Later

## Doc Header

### Doc History
1. 2026-03-16 00:33: Created this file as a condensed execution-order planning surface that groups the current roadmap, vision roadmap, and wishlist into `Now / Next / Later / Much Later`

### Purpose

This file is the compact build-order view for ParaHook.

Use it for:
- quick prioritization
- deciding what should not be started yet
- turning the larger roadmap into one simple execution queue

Do not use it for:
- detailed phase execution planning
- proof of shipped work
- replacing the full roadmap or vision docs

### Source Notes

This file is a condensed read of:
- `docs/Human-Plans/roadmap/roadmap.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Wish-Features/WISHLIST.md`
- `docs/Phase-Plans/11_SP - Phase-Plans.md`

### Bucket Rule

- `Now`
  - active tail work and the next dependency-critical phases
- `Next`
  - the next important lane once the current Browser/project workspace is structurally honest
- `Later`
  - major systems that matter, but should sit on top of a more mature workspace and authoring core
- `Much Later`
  - polish, return-features, or high-complexity expansion that should not steer the core sequence yet

## Doc Body

### Dependency Spine

Recommended top-level order:

`Browser/editor shell honesty`
-> `Browser-facing output structure`
-> `project-content inspection + viewer controls`
-> `authoring-system hardening`
-> `graph-native build contract replacement`
-> `mode expansion, polish, and return-features`

If a later idea depends on an earlier structure becoming clearer, keep it in the later bucket even if it feels more exciting.

### Now

1. `[2.1D]` / `[2.1E]` shell follow-up tail
   - finish the remaining floating/docked shell cleanup
   - keep `SP - Phase 13` true multi-window work out of this cut
2. `[2.2] AS - Browser-Facing Graph Output Structure`
   - lock the first real `Component / Object / Part` Browser-facing shape
   - make the project/content hierarchy clearer before richer controls land
3. `[2.3C] AS - Deeper Project-Content Inspection And Per-Object / Per-Part Build Control`
   - finish the incomplete part of the build-control lane after the Browser-facing structure above is real

Why this is `Now`:
- this is the shortest path from the shipped Lane `[1]` foundation into a coherent workspace
- these items reduce ambiguity in the Browser/project model instead of adding more systems around it

### Next

1. `[2.4] VR - Reference Asset Workspace And Project View Layers`
2. `[2.5] VR - Browser Controls, Materials, And Rich Visibility`
3. `VM - Phase 6 / 7`
   - source-versus-derived view-model cleanup and expansion
4. `DR - Phase 13 / 14 / 15 / 16`
   - canonical driver contracts, input/parameter completion, promoted params, and user-facing metadata
5. `NI - Phase 6 / 7 / 8`
   - node-system cleanup, wire overhaul, and stronger validation/read-flow visibility
6. `FS - Phase 16 / 17 / 18`
   - diagnostics, parameter exposure/promotion rules, and feature growth beyond the first narrow set
7. `PT - Phase 7 / 8 / 9 / 10`
   - part hardening, presets, metadata, and stronger production behavior

Why this is `Next`:
- once the Browser/project workspace is honest, the next bottleneck becomes authoring quality and internal contract clarity
- this bucket makes the graph editor stronger before you add simplified modes or bigger build/runtime promises

### Later

1. `[3.2] AS / SP - Build Sequencing, Build Bars, And Output Build Control`
2. `GE / SP - Graph-Native Worker Contract`
   - replace the long-lived graph-to-legacy execution bridge
3. `EX - Phase 2 / 3 / 4 / 5`
   - export growth after the runtime/build contract is less transitional
4. `SP - Phase 13`
   - true multi-window graph editing
5. `[3.5] GE / SP / AS - Publish / Receive Execution`
   - implement the already-planned ownership model as real graph-to-graph behavior
6. `[3.1] DR / JK - Control Viz And Graph-Driven Control Surfaces`
7. `JK - Phase 2` through `Phase 8`
   - Jake mode shell, simplified controls, and expanded direct-manipulation editing
8. `[3.4] AS / VR - Advanced Output Types And Later Project Packaging`
9. `[3.3D] VR / SP - Saved Workspace Modes And Broader Workspace Cleanup`

Why this is `Later`:
- these systems multiply coordination complexity
- they should be built on top of a stronger Browser/project model, stronger authoring contracts, and a cleaner runtime seam

### Much Later

1. `VR - Phase 2`
   - gizmo parity return
2. `VR - Phase 3`
   - scenes return
3. `VR - Phase 4`
   - radio / sampler return
4. broader viewer/workbench personality return
   - old workbench flavor, richer atmosphere, and non-core presentation systems
5. `ADV - Phase 3 / 4 / 5`
   - typed graph objects, product-family registration, and deeper platform-vs-product boundary work
6. `[3.6] GE / SP / VR - Final Legacy Phase-Out And Compatibility Cleanup`

Why this is `Much Later`:
- these are either return-features, platform-expansion ideas, or final cleanup passes
- they are valid only after the graph-native path is strong enough to stand on its own

### Short Rule

Prefer work that makes ParaHook:
- more graph-native
- more ownership-explicit
- more Browser/project-legible
- less dependent on transitional legacy bridges

Delay work that mainly adds:
- shell complexity before workspace structure is honest
- mode proliferation before authoring contracts are stable
- polish/personality before the core seams are trustworthy
