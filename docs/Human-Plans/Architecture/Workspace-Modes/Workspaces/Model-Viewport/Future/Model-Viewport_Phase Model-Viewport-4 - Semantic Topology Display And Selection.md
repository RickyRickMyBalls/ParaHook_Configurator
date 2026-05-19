# `Model-Viewport-4` - `Semantic Topology Display And Selection`

## Doc Header

### Doc History
23. 2026-05-18 23:00:44: Followed up on `Model-Viewport-4 / Phase 9` after user review showed rectangle edge selection still did not work in the normal preview path, fixing the selector bridge so retained `topologyPreview` is projected onto visible artifact-preview renderables for matching part-level and body-level sketch-extrude artifacts.
22. 2026-05-18 22:49:42: Implemented and closed `Model-Viewport-4 / Phase 9 - Sketch Extrude Topology Preview Generation` by generating semantic topology packets for simple capped graph-authored sketch extrudes, carrying topology through draft and authoritative geometry bundles, proving rectangle extrudes emit six faces, twelve edges, eight points, and twelve triangle face ids, and preserving mesh-only fallback for uncapped walls and aggregate profile extrusions.
21. 2026-05-18 22:31:44: Prepped `Model-Viewport-4 / Phase 9 - Sketch Extrude Topology Preview Generation` for implementation after reading the live `featureStackRuntime`, `cadKernelAdapter`, authoritative bundle, and viewport selector seams, locking the first cut to simple capped polygon extrudes, per-shape topology generation beside `extrudeMesh`, merged topology offsetting, authoritative result carry-through, rectangle-extrude proof, and no Phase 8/Shift+D/imported STEP/snapping/measurement/inspector/direct-modeling widening.
20. 2026-05-18 22:19:02: Added `Model-Viewport-4 / Phase 9 - Sketch Extrude Topology Preview Generation` as the follow-up after confirming Phase 8 can only show semantic point, edge, face, and body highlights when graph-authored sketch/extrude results emit `topologyPreview`, locking the next slice to producer-side topology packets for simple sketch extrudes without changing viewport highlight behavior, Shift+D edge controls, imported STEP topology extraction, snapping, measurement, inspector panels, or direct modeling.
19. 2026-05-18 22:02: Implemented and closed `Model-Viewport-4 / Phase 8 - Hover And Selection Highlight Hierarchy` by adding owner-backed viewport highlight settings, Settings `Viewport` highlight controls, white/light hover overlays for topology points, edges, and faces, blue selected topology overlays, double-click topology promotion to whole-body blue tint, deterministic overlay stacking, and focused proof for settings ownership, viewer overlays, and ViewerHost double-click promotion.
18. 2026-05-18 21:22: Added and prepped `Model-Viewport-4 / Phase 8 - Hover And Selection Highlight Hierarchy` from the Fusion-style screenshots and user rules, locking point/edge/surface hover to white highlight, point/edge/surface click selection to blue highlight, double-click sub-entity promotion to whole-body blue highlight, and a new Settings section for owner-backed highlight color/glow controls without adding topology generation, direct modeling, snapping, measurement, inspector, or raw triangle debug scope.
17. 2026-05-18 20:44: Implemented and closed `Model-Viewport-4 / Phase 7 - Edge Display Visual Correctness And Polish` by separating normal display-edge materials from selected outlines, preserving Fusion-style depth-tested `Visible edges only`, keeping `On` as the x-ray edge read, reducing mesh-only cylinder fallback seams with a thresholded extracted-edge overlay, and adding focused viewer proof for edge mode hierarchy, selected-outline independence, semantic-edge precedence, rectangle diagonal hiding, and cylinder-like fallback cleanliness.
16. 2026-05-18 20:31: Added and prepped `Model-Viewport-4 / Phase 7 - Edge Display Visual Correctness And Polish` as the next implementation-ready follow-up after Phase 6, focusing on Fusion-style visible-edge depth reads, edge color/opacity hierarchy, semantic-versus-extracted edge noise, cylinder/curved-surface cleanliness, manual screenshot acceptance, and focused viewer proof without changing topology generation or the Shift+D control contract.
15. 2026-05-18 17:05: Corrected `Model-Viewport-4 / Phase 6` visible-edge semantics after user clarification so `Visible edges only` now means keep the current surface/fill mode and depth-test edge overlays so blocked/back edges are hidden by surfaces, rather than fading or removing filled surfaces.
14. 2026-05-18 16:53: Implemented and closed `Model-Viewport-4 / Phase 6 - Edge Visibility Controls In Shift-D Display Wheel` by adding shared edge display mode state, UI prefs persistence, independent viewer edge-overlay visibility, `Visible edges only` surface de-emphasis without hiding child edge overlays, center Shift+D edge controls, focused tests, production build verification, and browser sanity proof.
13. 2026-05-18 16:29: Tightened `Model-Viewport-4 / Phase 6 - Edge Visibility Controls In Shift-D Display Wheel` into an implementation-ready slice after a live read of the display menu hook, view settings normalization, UI prefs wireframe compatibility, toolbar seam, and viewer edge overlay ownership, locking the transitional fill/edge split, center edge-control behavior, visible-edges-only parent-mesh rule, persistence targets, and focused verification scope.
12. 2026-05-18 16:25:31: Added and prepped `Model-Viewport-4 / Phase 6 - Edge Visibility Controls In Shift-D Display Wheel` after the user clarified that `Shift+D` should separate surface fill type from edge visibility, with the existing radial display choices left as the viewport/surface fill mode and three center controls added for edge display `On`, `Off`, and `Visible edges only`.
11. 2026-05-18 16:10:56: Implemented and closed `Model-Viewport-4 / Phase 5 - Mesh Edge Wireframe Fallback And Closeout` by adding extracted mesh-edge Wireframe overlays for mesh-only parts, suppressing normal material triangle wireframe when clean edge overlays exist, preserving semantic topology edge overlays for topology-backed parts, keeping selection outlines separate, and proving the two-triangle rectangle fallback hides the internal diagonal.
10. 2026-05-18 16:04:45: Prepped `Model-Viewport-4 / Phase 5 - Mesh Edge Wireframe Fallback And Closeout` for implementation after screenshot review confirmed selected-object `EdgesGeometry` outlines already produce good extruded-rectangle edges while normal Wireframe still exposes triangle diagonals, locking the next cut to extracted mesh-edge overlays for mesh-only wireframe fallback, topology-edge preservation for topology-backed parts, and raw triangle wireframe deferral to a later debug path.
9. 2026-05-18 15:48:23: Implemented and closed `Model-Viewport-4 / Phase 4 - Edge And Point Selection Presentation` with selected topology entity state, topology edge and point pick helpers, point-over-edge-over-face pick priority, selected edge/point highlights, focused viewer tests, and production build verification.
8. 2026-05-18 15:36:35: Prepped `Model-Viewport-4 / Phase 4 - Edge And Point Selection Presentation` for implementation against the shipped face-selection state, semantic edge overlay helpers, topology edge/point packets, workspace selection pick contract, and viewer display-mode tests, locking the next cut to edge and point hit targets plus selected-entity highlights while keeping snapping, measurement, transform, Properties/inspector detail, imported STEP extraction, debug mesh wireframe, and direct modeling out of scope.
7. 2026-05-18 15:33:20: Implemented and closed `Model-Viewport-4 / Phase 3 - Semantic Wireframe Mode` by drawing semantic edge overlays from topology edge polylines in normal Wireframe mode, suppressing triangle material wireframe for topology-backed parts, preserving mesh-only triangle-wireframe fallback, keeping mode switches mesh-preserving, and proving the behavior with focused semantic topology and viewer display-mode tests plus production build verification.
6. 2026-05-18 15:25:08: Prepped `Model-Viewport-4 / Phase 3 - Semantic Wireframe Mode` for implementation against the live display-mode material wireframe path, topology edge packet, viewer render-layer mesh creation, and `Viewer.test.ts` display-mode proof, locking the next cut to semantic edge overlays for topology-backed parts, triangle-wireframe suppression in normal Wireframe, mesh-only fallback behavior, and no edge/point picking, debug mesh mode, inspector, snapping, measurement, imported STEP extraction, or direct-modeling scope yet.
5. 2026-05-18 15:09: Implemented and closed `Model-Viewport-4 / Phase 2 - Face Selection From Triangle Hits` by threading topology previews into viewer renderable parts, resolving triangle raycast hits back to semantic face ids, extending workspace part picks with optional face/body identity, storing selected face state separately from selected part identity, adding a whole-face highlight overlay, preserving mesh-only fallback behavior, and proving the slice with focused semantic-selection tests plus production build verification.
4. 2026-05-18 14:52:56: Prepped `Model-Viewport-4 / Phase 2 - Face Selection From Triangle Hits` for implementation against the live workspace selection raycast path, locking the next cut to topology-aware part picks with optional face identity, viewer-layer topology plumbing, selected-face state, whole-face highlight overlay, mesh-only fallback to existing part selection, and no semantic wireframe, edge, point, inspector, or direct-modeling behavior yet.
3. 2026-05-18 14:40:31: Implemented and closed `Model-Viewport-4 / Phase 1 - Semantic Topology Display Packet Contract` by adding the shared topology preview contract to geometry result bundles, validating face triangle ownership, semantic edge polylines, and point positions, preserving topology through bundle cloning/factories, keeping mesh-only results valid with `null` topology, and proving the contract with focused tests plus production build verification.
2. 2026-05-18 14:38:45: Prepped `Model-Viewport-4 / Phase 1 - Semantic Topology Display Packet Contract` for implementation against the live retained geometry result and viewer layer seams, locking the first cut to an additive topology display packet beside existing mesh previews, with contract validation, clone preservation, mesh-only fallback behavior, and no viewer selection or wireframe runtime changes yet.
1. 2026-05-18 12:13:58: Created this future plan doc to reserve the next model-viewport lane for triangle-backed but topology-honest display, selection, wireframe, edge, face, and point behavior, so B-rep-derived or semantic source geometry can remain meaningful to the user even when the GPU renders tessellated triangles.

### Purpose

Use this doc as the dedicated planning surface for semantic topology display and selection in the model viewport.

The goal here is:
- keep triangle geometry as the practical rendering substrate
- stop exposing internal tessellation as the user's main geometry model
- let a selected surface resolve to the whole owning face or semantic surface, not one accidental triangle
- make wireframe mode show real model edges instead of triangle diagonals
- prepare face, edge, and point identity so later inspection, snapping, measurement, transform, and B-rep workflows have stable targets

### Scope

This phase family covers:
- semantic topology identity for displayed mesh packets
- face-level selection over triangle-backed rendering
- edge and point overlay direction
- normal wireframe behavior that hides internal tessellation edges
- a developer/debug path for seeing raw triangles when needed
- cross-family boundaries with B-rep import, Spaghetti authoritative geometry, display modes, Browser selection, and later Properties/inspector surfaces

This phase family does not cover:
- replacing Three.js as the renderer
- promising direct B-rep surface rendering with no tessellation
- direct modeling edits on selected faces, edges, or points
- imported STEP retained-shape ownership itself
- graph node-family B-rep widening
- production measurement, snapping, or topology-edit commands in the first pass

## Doc Body

### Summary

`Model-Viewport-4` should make ParaHook feel like it is showing real model geometry even when the actual GPU render layer is still triangles.

The important split is:
- render triangles are display cache
- semantic topology is user-facing geometry

That means a single logical face may still render as many triangles, especially on curved or tessellated geometry. But when the user hovers or clicks that surface, the viewport should resolve the hit back to the owning semantic face id. The selection highlight should apply to the whole face or surface, not just the single triangle under the pointer.

Wireframe should follow the same rule. Normal user-facing wireframe should draw semantic model edges, boundary edges, sharp edges, and intentionally exposed construction/profile edges. It should not draw every internal triangle edge unless the user explicitly enters a debug mesh wireframe mode.

### Current Grounding

This plan sits on top of already-existing model-viewport work:

- `Model-Viewport-1.3`
  - established authoritative B-rep-capable geometry and export handoff
  - final display can be B-rep-derived while still rendered as display mesh
- `Model-Viewport-3`
  - established display modes such as `Solid`, `Wireframe`, `Material`, `Rendered`, and `Render Preview`
  - kept display mode separate from `Auto / Draft / Final` result policy
- `Spaghetti-Editor 6`
  - owns draft mesh versus authoritative B-rep behavior for graph-authored geometry
  - explicitly leaves topology-inspection follow-ons to later docs
- `Import/B-rep`
  - owns retained imported STEP B-rep truth and imported topology direction
  - already states that faces, edges, and vertices should become selectable and highlightable from retained truth

This doc is the model-viewport companion lane for the shared display and interaction behavior.

### Ownership Rules

The model viewport should own:
- presentation of semantic faces, edges, and points
- hit-test resolution from triangle hits to semantic entities
- highlight drawing for selected or hovered topology
- normal wireframe versus debug mesh wireframe behavior
- display-mode integration for topology overlays

The geometry/result layer should own:
- the mapping from displayed triangles to source face ids
- the mapping from visible edge polylines to source edge ids
- the mapping from visible point markers to source vertex or generated point ids
- stable identity for topology entities across the current result where possible

The worker or geometry adapter should own:
- deriving face tessellation from authoritative/B-rep or semantic source truth
- deriving topological edge polylines
- deriving point/vertex positions
- attaching source ids to the display packet

The Browser should not become a raw topology tree by default.

The Properties or later inspector surfaces may show topology detail after selection, but the first viewport work should focus on interaction identity and display honesty.

### Display Mode Relationship

`Model-Viewport-3` already owns display mode names.

`Model-Viewport-4` should refine what `Wireframe` means:
- normal `Wireframe` should show semantic/model edges
- `Solid`, `Material`, and `Rendered` may optionally show semantic edges as overlays when the view setting asks for them
- `Render Preview` should normally avoid heavy debug overlays unless explicitly supported
- raw triangle wireframe should move behind an explicit debug or developer-facing mesh mode

Important rule:
- user-facing wireframe is not the same as Three.js material wireframe if that wireframe reveals tessellation triangles

### Selection Model

Selection should resolve by semantic target.

For face selection:
- a pointer hit may begin as a triangle intersection
- the triangle should carry or resolve to a semantic face id
- selecting that triangle selects the full owning face
- highlight should cover all triangles that belong to that face

For edge selection:
- visible edge geometry should be raycastable or otherwise pickable as edge identity
- selecting an edge should highlight the whole semantic edge polyline or curve approximation
- edge selection should not require the user to click a raw triangle boundary

For point selection:
- visible point markers should map to source vertex ids or generated display point ids
- point selection should be optional by mode or tool so the viewport does not become noisy by default

### Debug Mesh Boundary

Raw mesh data is still useful.

The viewport should keep a developer-facing path for:
- showing internal triangle edges
- inspecting tessellation density
- debugging bad face-id assignment
- comparing semantic edges against render mesh boundaries

But this should not be the normal user-facing wireframe mode.

### Wishlist Organization

#### High Level Goals

- [ ] `Model-Viewport-4-HLG-1. Triangle geometry can remain the render geometry, but the user should see and select meaningful surfaces, edges, and points.`
- [ ] `Model-Viewport-4-HLG-2. Selecting one triangle on a logical surface should select the whole owning face or surface.`
- [ ] `Model-Viewport-4-HLG-3. Wireframe mode should show proper model edges instead of all triangle edges.`
- [ ] `Model-Viewport-4-HLG-4. Raw triangle wireframe should remain available only as a debug/developer mesh view.`
- [ ] `Model-Viewport-4-HLG-5. The topology display contract should support both graph-authored authoritative geometry and later retained imported B-rep geometry.`
- [ ] `Model-Viewport-4-HLG-6. Hover, selection, and whole-body promotion should have a clear CAD-style visual hierarchy with owner-backed styling settings.`

#### `Model-Viewport-4 / Phase 1`

- [x] Add an additive semantic topology display packet contract beside the existing mesh preview/result contract.
- [x] Carry face ids from display triangles back to source topology or semantic surfaces without changing current mesh vertices or indices.
- [x] Carry edge ids and edge polylines separately from triangle geometry.
- [x] Carry optional point or vertex ids for later point display and selection.
- [x] Validate, clone, and preserve topology packets through the shared retained geometry bundle helpers.
- [x] Keep mesh-only results valid by treating missing topology as honest `null` semantic topology.
- [x] Keep the first implementation out of viewer selection, wireframe rendering, imported STEP retention, and direct modeling.
- [x] `HLG 1. Triangle geometry can remain the render geometry, but the user should see and select meaningful surfaces, edges, and points.`
- [x] `HLG 5. The topology display contract should support both graph-authored authoritative geometry and later retained imported B-rep geometry.`

#### `Model-Viewport-4 / Phase 2`

- [x] Thread `topologyPreview` from visible geometry results into the viewer render-layer path without changing visible geometry.
- [x] Implement semantic face hit resolution in the model viewport.
- [x] Extend workspace selection picks with optional semantic face identity when a picked part has topology.
- [x] Resolve triangle raycast hits back to the owning face id using the raycast face index and `triangleFaceIds`.
- [x] Store selected semantic face state separately from the existing selected part key.
- [x] Highlight all triangles belonging to the selected face with a viewer-owned overlay.
- [x] Keep object-level and part-level selection behavior intact when no face-level topology is available.
- [x] Keep this phase out of semantic wireframe, edge selection, point selection, inspector panels, snapping, measurement, and direct modeling.
- [x] `HLG 2. Selecting one triangle on a logical surface should select the whole owning face or surface.`

#### `Model-Viewport-4 / Phase 3`

- [x] Replace normal wireframe rendering with semantic edge overlays for topology-backed parts.
- [x] Hide internal triangle diagonals from the user-facing wireframe mode when semantic edge topology exists.
- [x] Draw explicitly supplied topology edge polylines from `topologyPreview.edges`.
- [x] Keep mesh-only parts honest by preserving the existing triangle-wireframe fallback until topology packets exist for them.
- [x] Keep mode switching rebuild-free where possible by creating semantic edge helpers with part meshes and toggling their visibility/material state during display-mode changes.
- [x] Keep this phase out of edge picking, point picking, debug mesh wireframe controls, inspector panels, snapping, measurement, and direct modeling.
- [x] `HLG 3. Wireframe mode should show proper model edges instead of all triangle edges.`

#### `Model-Viewport-4 / Phase 4`

- [x] Add topology edge hit targets sourced from `topologyPreview.edges`.
- [x] Add topology point hit targets sourced from `topologyPreview.points`.
- [x] Extend workspace selection picks with optional selected topology entity identity for edge and point targets.
- [x] Store selected topology entity state separately from selected part and selected face state.
- [x] Add highlight styling that distinguishes selected object, face, edge, and point.
- [x] Keep edge and point targets visible/pickable only when topology presentation is already active enough to avoid noisy default selection.
- [x] Leave direct editing, measurement, snapping, and topology inspector panels to later follow-ons.
- [x] `HLG 1. Triangle geometry can remain the render geometry, but the user should see and select meaningful surfaces, edges, and points.`

#### `Model-Viewport-4 / Phase 5`

- [ ] Add extracted mesh-edge fallback overlays for mesh-only normal Wireframe.
- [ ] Stop using material triangle wireframe as the normal Wireframe fallback when extracted edges are available.
- [ ] Keep topology-backed parts on semantic topology edge overlays.
- [ ] Keep selected-object outlines separate from display-mode wireframe overlays even if both use edge extraction.
- [ ] Add focused proof that simple two-triangle rectangle/extrude-style mesh faces do not show the internal diagonal in normal Wireframe.
- [ ] Explicitly defer raw triangle wireframe to a later debug mesh mode.
- [ ] Close the phase with handoff notes for true sketch/extrude topology generation, Properties/inspector, snapping, measurement, and direct-modeling follow-ons.
- [ ] `HLG 3. Wireframe mode should show proper model edges instead of all triangle edges.`
- [ ] `HLG 4. Raw triangle wireframe should remain available only as a debug/developer mesh view.`

#### `Model-Viewport-4 / Phase 6`

- [x] Split the `Shift+D` display wheel concept into surface fill mode and edge visibility mode.
- [x] Keep the existing display-mode wheel choices as the surface/fill mode owner: Solid, Wireframe, Material, Rendered, and Render Preview.
- [x] Add center edge controls to the radial menu for `On`, `Off`, and `Visible edges only`.
- [x] Make `On` mean draw proper/extracted/semantic edges over the current surface fill mode.
- [x] Make `Off` mean hide display-mode edge overlays while preserving selection highlights.
- [x] Make `Visible edges only` mean keep the current surface/fill mode while hiding blocked/back edges behind surfaces.
- [x] Preserve selected-object, selected-face, selected-edge, and selected-point highlights independently from the edge visibility toggle.
- [x] Keep this phase out of new topology generation, raw triangle debug wireframe, snapping, measurement, inspector, and direct modeling.
- [x] `HLG 3. Wireframe mode should show proper model edges instead of all triangle edges.`

#### `Model-Viewport-4 / Phase 7`

- [x] Tune the visual read of edge modes after Phase 6 so `On`, `Off`, and `Visible edges only` are clearly distinct.
- [x] Make `Visible edges only` match the Fusion-style read: current surface/fill mode stays visible, while blocked/back edges are hidden by surfaces.
- [x] Confirm `On` remains useful as an x-ray/through-surface edge overlay when the user wants all display edges visible.
- [x] Tune normal display-edge color, opacity, depth behavior, and render order so it is separate from selected-object outlines and selected topology highlights.
- [x] Reduce or explicitly document noisy extracted mesh edges on cylinder/curved mesh-only surfaces until true semantic topology exists.
- [x] Add focused proof around semantic topology edges versus extracted mesh-edge fallback in `On` and `Visible edges only`.
- [x] Add one manual/screenshot acceptance checklist for rectangle extrudes, stacked/overlapping blocks, and cylinder-like parts.
- [x] Keep this phase out of new topology generation, new Shift+D controls, raw triangle debug wireframe, snapping, measurement, inspector, and direct modeling.
- [x] `HLG 3. Wireframe mode should show proper model edges instead of all triangle edges.`

#### `Model-Viewport-4 / Phase 8`

- [x] Add hover state for topology points, edges, and faces/surfaces.
- [x] Point hover should show a small white/light highlight with a subtle halo/readable rim.
- [x] Point click selection should show a blue selected point highlight.
- [x] Edge hover should show a white/light edge highlight above normal display edges.
- [x] Edge click selection should show a blue selected edge highlight.
- [x] Surface hover should show a white/light face highlight with a readable border.
- [x] Surface click selection should show a blue selected surface highlight.
- [x] Double-clicking a point, edge, or surface should promote selection to the owning body and blue-highlight the whole body.
- [x] Add a Settings section for viewport highlight colors/glow/intensity values while keeping the meaning of those settings owned by the model-viewport/view-settings contract.
- [x] Define stacking priority so hover highlights render above selected surface/body tint, selected edge/point render above selected surface, and normal display edges stay below interaction highlights.
- [x] Keep this phase out of new topology generation, imported STEP topology extraction, raw triangle debug wireframe, snapping, measurement, inspector/detail panels, direct modeling, and editing commands.
- [x] `HLG 1. Triangle geometry can remain the render geometry, but the user should see and select meaningful surfaces, edges, and points.`
- [x] `HLG 6. Hover, selection, and whole-body promotion should have a clear CAD-style visual hierarchy with owner-backed styling settings.`

#### `Model-Viewport-4 / Phase 9`

- [x] Emit `topologyPreview` for graph-authored sketch/extrude geometry where the profile and extrusion can be mapped deterministically.
- [x] Start with simple closed sketch profiles such as rectangles and other single-loop polygonal profiles.
- [x] Assign semantic face ids for the front cap, back cap, and each side face.
- [x] Fill `triangleFaceIds` so every display triangle from the extruded mesh resolves to the owning semantic face.
- [x] Emit semantic edge polylines for cap perimeter edges and vertical/side extrusion edges.
- [x] Emit semantic point positions for extruded profile vertices.
- [x] Preserve mesh-only fallback by keeping topology `null` when a sketch/extrude case cannot yet be mapped honestly.
- [x] Prove that sketch > extrude rectangle faces hover/select as whole faces, not individual triangles.
- [x] Prove that sketch > extrude rectangle edges and points can use the Phase 8 hover/selection highlight system.
- [x] Keep this phase out of imported STEP topology extraction, curved B-rep naming stability, raw triangle debug wireframe, snapping, measurement, inspector/detail panels, direct modeling, and editing commands.
- [x] `HLG 1. Triangle geometry can remain the render geometry, but the user should see and select meaningful surfaces, edges, and points.`
- [x] `HLG 2. Selecting one triangle on a logical surface should select the whole owning face or surface.`
- [x] `HLG 3. Wireframe mode should show proper model edges instead of all triangle edges.`
- [x] `HLG 5. The topology display contract should support both graph-authored authoritative geometry and later retained imported B-rep geometry.`
- [x] `HLG 6. Hover, selection, and whole-body promotion should have a clear CAD-style visual hierarchy with owner-backed styling settings.`

## [x] `Model-Viewport-4 / Phase 1` - `Semantic Topology Display Packet Contract`

### Phase 1 Summary

Create one explicit display-packet contract for semantic topology.

The first pass should focus on identity and ownership, not visual polish.

Current status:
- shipped

Current implementation-read:
- `src/shared/geometryResult.ts` owns the current retained geometry-result contract with `GeometryMesh`, `GeometryBody`, `meshPreview`, validation, cloning, and draft/authoritative bundle helpers.
- `src/shared/buildTypes.ts` owns legacy `PartArtifact` and `ViewerRenderablePart` shapes that currently carry only box or mesh artifacts into the viewer.
- `src/app/components/ViewerHost.tsx` builds `ViewerViewportRenderLayers` from `ViewportLayerRecipe` and forwards renderable parts to the viewer.
- `src/app/spaghetti/selectors/selectViewportResultState.ts` owns which retained result or artifact-preview bridge becomes visible for `Auto / Draft / Final`.
- `src/viewer/Viewer.ts` consumes `ViewerViewportRenderLayers` in `setViewportRenderLayers(...)` and currently applies `wireframe` by toggling material wireframe through `resolveDisplayModeWireframe()`.

Phase 1 should therefore land before any viewer behavior changes. It should make semantic topology representable and durable in the shared geometry result contract first.

### Phase 1 Implementation Spec

Must lock:
- one additive `GeometryTopologyPreview` or equivalent shared type in `src/shared/geometryResult.ts`
- one optional or nullable topology field on `GeometryResultBundle`, likely named `topologyPreview`
- triangle-to-face ownership shape that maps display triangle order to semantic face ids without rewriting `GeometryMesh.indices`
- face id stability expectations scoped to one visible geometry result and one result identity, not global B-rep persistence
- edge overlay packet shape with semantic edge id plus display polyline positions
- optional point packet shape with semantic point or vertex id plus display position
- validation helpers that reject malformed topology while preserving valid mesh-only bundles
- clone helpers that deep-copy topology packets the same way mesh previews are copied
- draft and authoritative bundle factory options that default missing topology to `null`
- tests in `src/shared/geometryResult.test.ts` for valid topology, invalid topology, clone isolation, and mesh-only fallback

Recommended first contract shape:

```ts
type GeometryTopologyEntityId = string

type GeometryTopologyFace = {
  faceId: GeometryTopologyEntityId
  bodyId: string
  label?: string
}

type GeometryTopologyEdge = {
  edgeId: GeometryTopologyEntityId
  bodyId: string
  faceIds: string[]
  polyline: number[]
  label?: string
}

type GeometryTopologyPoint = {
  pointId: GeometryTopologyEntityId
  bodyId: string
  position: [number, number, number]
  label?: string
}

type GeometryTopologyPreview = {
  faces: GeometryTopologyFace[]
  triangleFaceIds: Array<string | null>
  edges: GeometryTopologyEdge[]
  points: GeometryTopologyPoint[]
}
```

Open implementation judgment:
- `triangleFaceIds.length` should normally equal the display triangle count for the corresponding mesh. If enforcing this immediately is awkward because bundles can carry body meshes plus `meshPreview`, Phase 1 may validate only array shape and ids, then leave strict count matching to the first producer phase.
- topology ids should be stable inside a result and deterministic for generated graph geometry where practical, but Phase 1 should not promise cross-rebuild B-rep naming stability yet.
- `edge.polyline` should use flat xyz numbers like existing mesh vertices for consistency.

Likely file targets:
- `src/shared/geometryResult.ts`
- `src/shared/geometryResult.test.ts`
- any narrow test fixture updates that fail because `GeometryResultBundle` gains a new required nullable field

Definition of done:
- [x] model-viewport display data can carry enough semantic topology for later face/edge/point selection
- [x] existing mesh-only results still render honestly without pretending to have topology
- [x] follow-on phases can implement face selection and semantic wireframe without redesigning the packet
- [x] `createGeometryResultBundle`, `createDraftGeometryResultBundle`, `createAuthoritativeGeometryResultBundle`, `cloneGeometryResultBundle`, and `isGeometryResultBundle` all preserve or validate the new topology field
- [x] focused shared-contract tests prove valid topology, invalid topology rejection, null topology fallback, and clone deep-copy behavior

Implementation result:
- added `GeometryTopologyPreview`, face, edge, point, and topology entity-id types in `src/shared/geometryResult.ts`
- added nullable `topologyPreview` support to `GeometryResultBundle`
- added topology validation through `isGeometryTopologyPreview(...)` and `isGeometryResultBundle(...)`
- kept legacy mesh-only payloads valid when `topologyPreview` is missing, while factory-created bundles now normalize missing topology to `null`
- deep-cloned topology previews through `createGeometryResultBundle(...)` and `cloneGeometryResultBundle(...)`
- updated direct test fixtures that manually construct `GeometryResultBundle` objects to include `topologyPreview: null`

Verification:
- `npm.cmd test -- src/shared/geometryResult.test.ts`
- `npm.cmd run build`

Explicit non-goals:
- no `Viewer.ts` runtime selection changes
- no `Viewer.ts` wireframe replacement
- no visible edge or point overlay rendering
- no imported STEP topology extraction
- no OpenCascade face/edge enumeration work
- no direct modeling, snapping, or measurement behavior

## [x] `Model-Viewport-4 / Phase 2` - `Face Selection From Triangle Hits`

### Phase 2 Summary

Make a triangle hit select the owning semantic face when face metadata exists.

Current status:
- shipped

Current implementation-read:
- `src/viewer/Viewer.ts`
  - owns `pickWorkspaceSelection(...)`, which raycasts visible part meshes, reference objects, and environment light helpers, then walks hit parents until it finds `userData.partKey`, `referenceId`, or `environmentLightId`
  - owns `setSelectedPart(...)`, `selectedPartKey`, `partSelectionOutlines`, and `refreshSelectionStyling()`
  - currently creates one outline per part through `EdgesGeometry(geometry)` during `setViewportRenderLayers(...)`
  - current raycast intersections should have enough mesh hit data to read `intersection.faceIndex` for triangle-level resolution
- `src/viewer/workspaceSelectionWindow.ts`
  - owns `WorkspaceSelectionPick` and `WorkspaceSelectionPickEvent`
  - currently supports only `part`, `reference-item`, and `environment-light` picks
- `src/app/components/ViewerHost.tsx`
  - wires `viewer.setOnWorkspaceSelectionPick(...)` into workspace selection commits
  - currently treats picked parts as workspace `part` or project `object` targets with `selectedPartKey`
  - builds `ViewerViewportRenderLayers` from the selector-owned layer recipe, but that layer recipe only carries `ViewerRenderablePart[]`
- `src/shared/buildTypes.ts`
  - `ViewerRenderablePart` currently carries only `{ viewerKey, artifact }`
- `src/shared/geometryResult.ts`
  - Phase 1 now provides nullable `topologyPreview` with `triangleFaceIds`, semantic faces, edges, and points
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - owns which `GeometryResultBundle` is visible for the current `Auto / Draft / Final` result state

Phase 2 should use the existing click selection lane instead of adding a second pointer system.

### Phase 2 Implementation Spec

Must lock:
- a viewer-facing topology carrier, likely by extending `ViewerRenderablePart` or `ViewerViewportRenderLayers` with optional topology metadata keyed by `viewerKey`
- the conversion point from visible `GeometryResultBundle.topologyPreview` into the viewer render-layer data
- a `WorkspaceSelectionPick` shape that preserves current part picks while optionally carrying semantic face data, for example:

```ts
type WorkspaceSelectionPick =
  | {
      kind: 'part'
      partKey: string
      faceId?: string
      topologyBodyId?: string
    }
  | ...
```

- `Viewer` userData or side-map ownership for each mesh's topology preview
- raycast face resolution using `intersection.faceIndex`
- a helper that maps face index to `topologyPreview.triangleFaceIds[faceIndex]`
- fallback behavior when `faceIndex` is missing, out of range, maps to `null`, or topology is absent
- selected semantic face state, likely:

```ts
type SelectedTopologyFace = {
  partKey: string
  faceId: string
  bodyId: string
} | null
```

- a public viewer setter such as `setSelectedTopologyFace(...)` or a widened `setSelectedPart(...)` input so React/app state can restore highlight after render-layer refreshes
- whole-face highlight overlay by deriving a temporary geometry or grouped material overlay from all source triangles whose `triangleFaceIds` match the selected face id
- clearing face selection when the selected part changes, the selected face is not present on the refreshed mesh, or the user clears workspace selection
- focused tests for:
  - picking any triangle in a multi-triangle semantic face returns the same face id
  - selecting one semantic face highlights all triangles mapped to that face
  - mesh-only parts still return normal part picks and show existing part selection outline
  - `null` triangle face ids fall back to part selection
  - refreshed render layers preserve selected face highlight only when the face still exists

Recommended implementation order:
1. Extend the viewer-facing render data to carry topology metadata with each part or part key.
2. Store topology metadata in `Viewer` side maps during `setViewportRenderLayers(...)`.
3. Extend `WorkspaceSelectionPick` for optional face identity.
4. Update `pickWorkspaceSelection(...)` so part hits attempt face resolution before returning the part pick.
5. Add selected-face state and public setter.
6. Add whole-face highlight overlay.
7. Wire `ViewerHost` to retain or clear selected face state while preserving current workspace target behavior.
8. Add focused viewer and host/selection tests.

Definition of done:
- selecting any triangle on a semantic face selects that face
- all triangles belonging to the selected face highlight together
- existing object selection still works for mesh-only geometry
- existing workspace selection behavior still commits the owning part/object target so Browser, Properties, transform, and focus flows do not regress
- face identity is available for later inspector/properties/snapping work without forcing those surfaces to ship in this phase

Explicit non-goals:
- no semantic wireframe replacement
- no edge or point selection
- no topology inspector UI
- no Properties face panel
- no measurement, snapping, transform, or direct modeling behavior
- no imported STEP retained topology extraction
- no OpenCascade face naming stability work beyond consuming the existing topology ids

Implementation result:
- `src/shared/buildTypes.ts` now lets each `ViewerRenderablePart` carry optional `topologyPreview` metadata beside the existing artifact.
- `src/app/spaghetti/selectors/selectViewportResultState.ts` now threads retained `GeometryResultBundle.topologyPreview` into the mesh-preview viewer part.
- `src/viewer/workspaceSelectionWindow.ts` now allows part picks to include optional `faceId` and `topologyBodyId` fields.
- `src/viewer/semanticTopologySelection.ts` owns the small topology helper layer for triangle-face resolution and whole-face highlight geometry.
- `src/viewer/Viewer.ts` now stores topology metadata on rendered part meshes, resolves `intersection.faceIndex` through `triangleFaceIds`, exposes `setSelectedTopologyFace(...)`, and draws a viewer-owned selected-face overlay using all triangles mapped to the chosen face.
- `src/app/components/ViewerHost.tsx` now keeps selected face state separate from selected part/object state, clears it with incompatible selections, and preserves current workspace target commits.
- Mesh-only or `null` face mappings continue to fall back to normal part/object selection.

Verification:
- `npm.cmd test -- src/viewer/semanticTopologySelection.test.ts src/shared/buildTypes.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx` was attempted twice but timed out after 2 minutes and 5 minutes without a result.

## [x] `Model-Viewport-4 / Phase 3` - `Semantic Wireframe Mode`

### Phase 3 Summary

Make normal wireframe display real model edges instead of tessellation edges.

Current status:
- shipped

Current implementation-read:
- `src/viewer/Viewer.ts`
  - currently treats user-facing wireframe as material wireframe through `resolveDisplayModeWireframe()`
  - sets `material.wireframe` inside `applyPresetToMaterial(...)`, `applyPresetToMaterialModeMaterial(...)`, runtime fallback material creation, `applyReferenceDisplayModeToScene()`, and `applyMaterialSettings(...)`
  - creates base part meshes in `setViewportRenderLayers(...)`, where Phase 2 now stores `part.topologyPreview` on mesh `userData`
  - creates selection outlines with `EdgesGeometry(geometry)`, which should remain selection styling and should not become the normal semantic wireframe overlay
  - already imports `LineSegments`, `LineBasicMaterial`, `BufferGeometry`, and `Float32BufferAttribute`, which are enough to build edge-polyline helpers without a new rendering dependency
- `src/shared/geometryResult.ts`
  - Phase 1 topology packets already expose `edges: GeometryTopologyEdge[]`
  - each edge carries `edgeId`, `bodyId`, `faceIds`, and a flat xyz `polyline`
- `src/shared/buildTypes.ts`
  - Phase 2 `ViewerRenderablePart` can carry `topologyPreview` through the viewer layer
- `src/viewer/Viewer.test.ts`
  - has an existing display-mode test asserting `material.wireframe === true` in `wireframe`; Phase 3 should update this expectation for topology-backed parts and add fallback proof for mesh-only parts

Phase 3 should use the existing display-mode path instead of adding a new viewport mode. The meaning of `Wireframe` changes for topology-backed mesh previews: the mesh material stays non-wireframe and semantic topology edges become visible as line helpers.

### Phase 3 Implementation Spec

Must lock:
- a small viewer helper that converts `GeometryTopologyPreview.edges[].polyline` into one or more `LineSegments`/line geometries for semantic edge display
- a viewer-owned map such as `semanticEdgeOverlaysByPartKey` so helpers are created/disposed with their owning part mesh
- helper creation during `setViewportRenderLayers(...)` for base and overlay mesh parts that have non-empty `topologyPreview.edges`
- helper visibility rules:
  - visible when `resolveDisplayMode() === 'wireframe'`
  - hidden for `solid`, `material`, `rendered`, and `renderPreview` in this phase
  - hidden when the owning mesh is hidden
- material wireframe suppression for topology-backed parts while normal Wireframe mode is active
- mesh-only fallback:
  - parts without usable topology edges may keep the old material-wireframe behavior so users still get some wireframe read
  - topology-backed parts should not show triangle diagonals in normal Wireframe
- selection outline separation:
  - selected-part `EdgesGeometry` outlines remain selection affordances
  - semantic edge overlays are display-mode affordances and should use their own material/render order
- focused viewer proof that:
  - topology-backed wireframe shows semantic edge helpers and keeps mesh material `wireframe === false`
  - a topology-backed part with two triangles on one face does not expose the diagonal triangle edge through material wireframe
  - mesh-only parts still use the old material-wireframe fallback
  - switching modes toggles overlay visibility without recreating the part mesh or geometry
  - hidden parts keep semantic edge helpers hidden

Definition of done:
- user-facing wireframe reads as model topology instead of raw render mesh
- semantic edges remain visible enough for inspection
- switching display modes does not rebuild geometry unnecessarily

Recommended implementation order:
1. Add a helper in `src/viewer/semanticTopologySelection.ts` or a new `src/viewer/semanticTopologyDisplay.ts` that builds line geometry from topology edge polylines.
2. Add viewer state for semantic edge overlay helpers and dispose them inside `clearPartMeshes()`.
3. Create semantic edge overlays when topology-backed mesh parts are created in `setViewportRenderLayers(...)`.
4. Add a local viewer method to decide whether a mesh should use material wireframe fallback: no semantic topology edges means fallback, semantic topology edges means no triangle wireframe.
5. Update display-mode material application so material `wireframe` is per mesh where needed instead of only global material-cache state.
6. Toggle semantic edge overlay visibility from `applyViewSettings(...)` and render-layer refreshes.
7. Update/add focused `Viewer.test.ts` coverage.

Explicit non-goals:
- no edge hover or edge selection
- no point display or point selection
- no debug raw triangle wireframe UI yet
- no imported STEP topology extraction
- no topology inspector or Properties panel
- no snapping, measurement, transform, or direct modeling behavior

Implementation result:
- `src/viewer/semanticTopologySelection.ts` now builds semantic edge overlay line geometry from `topologyPreview.edges[].polyline`.
- `src/viewer/Viewer.ts` now creates semantic edge line helpers with topology-backed part meshes, tracks them by part key, and toggles them in Wireframe mode.
- Topology-backed meshes now suppress material triangle wireframe while their semantic edge overlay is available.
- Mesh-only parts keep the existing material-wireframe fallback so older geometry still has a wireframe read.
- Display-mode changes update edge overlay visibility and per-mesh wireframe presentation without rebuilding part meshes.

Verification:
- `npm.cmd test -- src/viewer/semanticTopologySelection.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd test -- src/shared/buildTypes.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd run build`

## [x] `Model-Viewport-4 / Phase 4` - `Edge And Point Selection Presentation`

### Phase 4 Summary

Add selectable and highlightable edge and point presentation after face selection and wireframe have stable contracts.

Current status:
- implemented and closed

Current implementation-read:
- `src/shared/geometryResult.ts`
  - topology packets already expose `edges[]` with `edgeId`, `bodyId`, `faceIds`, and flat xyz `polyline`
  - topology packets already expose `points[]` with `pointId`, `bodyId`, and xyz `position`
- `src/viewer/semanticTopologySelection.ts`
  - currently owns triangle-to-face resolution, selected-face highlight geometry, and semantic edge overlay geometry
  - can host small helpers for edge hit-line geometry and point marker geometry if those stay viewer-only display primitives
- `src/viewer/Viewer.ts`
  - Phase 2 owns `SelectedTopologyFace`, `setSelectedTopologyFace(...)`, and selected-face overlay refresh
  - Phase 3 owns `semanticEdgeOverlaysByPartKey` for display-mode semantic wireframe helpers
  - `pickWorkspaceSelection(...)` already walks hit parents and can return topology-aware part picks
  - `collectWorkspaceSelectionCandidates()` currently includes part meshes and overlay meshes, not separate topology edge/point helper objects
  - `Points` is already imported and runtime stats already count `Points`, so point marker presentation can use existing Three primitives without a new dependency
- `src/viewer/workspaceSelectionWindow.ts`
  - `WorkspaceSelectionPick` currently supports optional face identity on `part` picks
- `src/app/components/ViewerHost.tsx`
  - keeps selected topology face state separate from workspace selected part/object state
  - can be widened to selected topology entity state while still committing the owning part/object target to workspace selection
- `src/app/viewerBridge.ts`
  - currently exposes `setSelectedTopologyFace(...)`; Phase 4 likely needs a more general selected topology entity setter or an additional edge/point setter
- `src/viewer/Viewer.test.ts`
  - now has focused proof for face selection and semantic wireframe behavior

Phase 4 should keep the workspace/browser selection contract stable: picking an edge or point should still commit the owning part/object as the workspace target, while the viewer keeps the more specific selected topology entity for highlight and future inspector handoff.

### Phase 4 Implementation Spec

Must lock:
- a selected topology entity type, for example:

```ts
type SelectedTopologyEntity =
  | { kind: 'face'; partKey: string; bodyId: string; faceId: string }
  | { kind: 'edge'; partKey: string; bodyId: string; edgeId: string }
  | { kind: 'point'; partKey: string; bodyId: string; pointId: string }
  | null
```

- a compatibility path from the existing selected-face state into the widened selected-entity state, or an explicit replacement of `SelectedTopologyFace` with the widened type
- workspace pick shape widening that keeps current face fields compatible while adding optional edge/point fields, for example:

```ts
type WorkspaceSelectionPick =
  | {
      kind: 'part'
      partKey: string
      topologyBodyId?: string
      faceId?: string
      edgeId?: string
      pointId?: string
    }
  | ...
```

- viewer-owned edge pick helpers:
  - created from `topologyPreview.edges`
  - parented to the owning part mesh so transforms/placement stay correct
  - sized or styled for hit-testing without making the visible edge overlay too thick
  - userData should include `partKey`, `edgeId`, and `topologyBodyId`
- viewer-owned point marker helpers:
  - created from `topologyPreview.points`
  - parented to the owning part mesh
  - visible/pickable only in topology-capable presentation contexts, likely Wireframe for this phase
  - userData should include `partKey`, `pointId`, and `topologyBodyId`
- picking priority:
  - point helpers should win over edge helpers when both are under the cursor
  - edge helpers should win over face/part mesh hits when the cursor is close enough to the edge
  - face selection should continue to work when no edge or point helper is hit
- selected highlight styling:
  - selected face remains a translucent surface overlay
  - selected edge should be a stronger line overlay than normal semantic wireframe
  - selected point should be a small marker/sphere/point material visibly distinct from edge and face
- clearing rules:
  - clear selected edge/point when the owning part changes, the selected entity disappears after render-layer refresh, or workspace selection clears
  - preserve selected entity across mode changes only if the owning topology entity still exists
- focused tests for:
  - edge helper pick returns owning part plus `edgeId` and `topologyBodyId`
  - point helper pick returns owning part plus `pointId` and `topologyBodyId`
  - point pick priority beats edge/face when helpers overlap
  - selecting an edge highlights only that semantic edge, not all triangle boundaries
  - selecting a point highlights only that topology point
  - mesh-only fallback remains part/face behavior from earlier phases

Definition of done:
- topology-capable geometry can expose visible edge and point targets
- selected edge and point highlights are visually distinct from face and object selection
- later snapping, measurement, and inspector work has stable selected-entity identity to consume

Recommended implementation order:
1. Replace or wrap `SelectedTopologyFace` with a `SelectedTopologyEntity` contract in `src/viewer/semanticTopologySelection.ts`.
2. Extend `WorkspaceSelectionPick` and `ViewerApi` without breaking existing face-pick callers.
3. Add edge and point helper creation in `Viewer.setViewportRenderLayers(...)` for topology-backed mesh parts.
4. Add helper maps and disposal to `clearPartMeshes()`.
5. Update `pickWorkspaceSelection(...)` to recognize helper userData for point and edge picks before falling back to face/part mesh hits.
6. Update `ViewerHost` to keep selected topology entity state and still commit owning part/object workspace selection.
7. Add selected edge and selected point overlay refresh methods.
8. Add focused viewer tests around pick identity, priority, highlights, and mesh-only fallback.

Explicit non-goals:
- no snapping behavior
- no measurement behavior
- no transform handles for edges or points
- no direct modeling/edit commands
- no Properties or topology inspector panel
- no imported STEP topology extraction
- no raw triangle debug wireframe UI

### Phase 4 Implementation Notes

- `src/viewer/semanticTopologySelection.ts` now exposes `SelectedTopologyEntity` plus edge-selection and point-marker helpers.
- `src/viewer/workspaceSelectionWindow.ts` now allows part picks to carry optional `edgeId` and `pointId` identity alongside the existing face identity.
- `src/viewer/Viewer.ts` now creates topology edge and point pick helpers for topology-backed mesh parts, shows them in Wireframe mode, and resolves click picks with point priority before edge priority before face/part fallback.
- Selected topology state now supports face, edge, and point entities while preserving the existing `setSelectedTopologyFace(...)` compatibility wrapper.
- Selected faces remain translucent surface overlays, selected edges use a stronger semantic line overlay, and selected points use a distinct local marker.
- `src/app/components/ViewerHost.tsx` now stores the selected topology entity separately from workspace part/object selection so edge and point picks still commit the owning workspace target.

Verification:
- `npm.cmd test -- src/viewer/semanticTopologySelection.test.ts src/viewer/Viewer.test.ts`
- `npm.cmd test -- src/shared/buildTypes.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd run build`

## [x] `Model-Viewport-4 / Phase 5` - `Mesh Edge Wireframe Fallback And Closeout`

### Phase 5 Summary

Make normal Wireframe mode stop showing triangle diagonals for mesh-only geometry by using extracted mesh edges as the fallback display path.

Current status:
- implemented and closed

Current implementation-read:
- `src/viewer/Viewer.ts`
  - Phase 3 already suppresses material triangle wireframe for topology-backed parts and shows `semanticEdgeOverlaysByPartKey` in Wireframe mode.
  - mesh-only parts still use the old material `wireframe = true` fallback, which is why sketch/extrude rectangles show long internal triangle diagonals in Wireframe mode.
  - selected part outlines already use `new EdgesGeometry(geometry)` and the user's Solid-mode screenshot shows those light-blue lines read well for extruded rectangles.
  - `partSelectionOutlines` and display-mode wireframe should remain separate affordances even if they use the same Three.js edge extraction primitive.
  - `clearPartMeshes()` already disposes child `LineSegments`, so a mesh-edge fallback overlay can follow the same lifecycle as selection outlines and semantic edge overlays.
- `src/viewer/Viewer.test.ts`
  - Phase 3 already proves topology-backed Wireframe uses semantic edge overlays and mesh-only parts currently use material wireframe.
  - Phase 5 should update that mesh-only expectation to extracted-edge overlay visibility and `material.wireframe === false`.
- `src/shared/geometryResult.ts`
  - no shared result contract change is needed for this phase because `EdgesGeometry` is a viewer-side visual fallback for mesh-only geometry.

Phase 5 is intentionally a pragmatic visual cleanup, not a claim of true topology. `EdgesGeometry` is mesh-derived edge extraction. It is good enough to stop exposing triangle diagonals for simple extrudes and many sharp-edged shapes, but semantic topology remains the correct source for face, edge, point identity when available.

### Phase 5 Implementation Spec

Must lock:
- a viewer-owned mesh-edge fallback overlay for mesh-only parts, likely using `EdgesGeometry(mesh.geometry)`
- helper ownership similar to the existing selection outline and semantic edge overlay lifecycle:
  - created with base and overlay part meshes
  - parented to the owning mesh so placement and transforms stay correct
  - tracked by part key in a map such as `meshEdgeWireframeOverlaysByPartKey`
  - disposed in `clearPartMeshes()`
- display-mode visibility rules:
  - topology-backed parts with semantic topology edges keep using `semanticEdgeOverlaysByPartKey`
  - mesh-only parts use the extracted mesh-edge fallback overlay in normal Wireframe mode
  - both topology-backed semantic overlays and mesh-only extracted overlays hide outside normal Wireframe mode
  - hidden owning meshes keep their wireframe fallback overlays hidden
- material rules:
  - normal Wireframe mode should not set `material.wireframe = true` for ordinary user-facing mesh parts
  - topology-backed parts already keep material wireframe suppressed
  - mesh-only parts should now also keep material wireframe suppressed when an extracted edge fallback is available
  - raw triangle material wireframe should remain deferred to a later explicit debug mesh mode
- visual separation:
  - extracted mesh-edge fallback should look like a display-mode wireframe, not a selected-part outline
  - selected-part outline should continue to communicate selection/highlight and may remain brighter or higher render order
  - selected semantic edge/point highlights from Phase 4 should remain visually stronger than the normal wireframe fallback
- focused tests for:
  - mesh-only Wireframe uses an `EdgesGeometry`/`LineSegments` overlay instead of material triangle wireframe
  - topology-backed Wireframe still prefers semantic topology edge overlays
  - switching from Wireframe to Solid hides mesh-edge fallback overlays without rebuilding the part mesh
  - selected-part outline remains independent from the mesh-edge fallback overlay
  - hidden mesh-only parts keep extracted wireframe overlays hidden
  - the old material-wireframe fallback is no longer used in normal user-facing Wireframe

Definition of done:
- normal Wireframe mode no longer exposes triangle diagonals for simple mesh-only extrudes.
- topology-backed parts still use semantic topology edges when those exist.
- mesh-only parts get a clean edge read through extracted mesh edges while staying honest that this is visual extraction, not true topology.
- raw triangle wireframe remains explicitly deferred to a later debug mesh mode or developer inspection path.
- the `Model-Viewport-4` closeout clearly hands off real semantic topology generation for sketch/extrude output to a later producer-side phase.

Recommended implementation order:
1. Add a mesh-edge wireframe overlay map and helper creation path in `src/viewer/Viewer.ts`.
2. Create fallback overlays in `setViewportRenderLayers(...)` for mesh parts that do not have usable semantic edge overlays.
3. Update the per-mesh wireframe decision so normal Wireframe suppresses material triangle wireframe when either semantic or extracted edge overlays are available.
4. Toggle mesh-edge fallback overlay visibility alongside semantic edge overlay visibility.
5. Keep selection outline creation unchanged, but make tests prove it is a separate child from the fallback wireframe overlay.
6. Update existing Wireframe tests so mesh-only parts expect extracted edge overlays rather than material wireframe.
7. Add one regression test shaped like a two-triangle rectangle face so the fallback overlay count excludes the internal diagonal.

Explicit non-goals:
- no true semantic topology generation for sketch/extrude output
- no face/edge/point inspector UI
- no snapping or measurement behavior
- no transform handles for topology entities
- no imported STEP topology extraction
- no direct modeling/edit commands
- no user-facing raw triangle debug mode in this phase

### Phase 5 Implementation Notes

- `src/viewer/Viewer.ts` now creates extracted mesh-edge Wireframe overlays for mesh-only rendered part meshes using `EdgesGeometry`.
- Mesh-only parts now keep material triangle wireframe disabled in normal Wireframe mode when an extracted edge overlay exists.
- Topology-backed parts still prefer semantic topology edge overlays and do not receive the mesh-edge fallback overlay.
- Wireframe overlay visibility now toggles with display mode without rebuilding the owning part mesh or geometry.
- Selected-part outlines remain separate from the mesh-edge fallback overlay even though both use line geometry.
- Focused viewer tests now prove two-triangle rectangle-style mesh faces show extracted boundary edges without the internal diagonal and that Solid mode hides the fallback overlay.

Verification:
- `npm.cmd test -- src/viewer/Viewer.test.ts src/viewer/semanticTopologySelection.test.ts`
- `npm.cmd test -- src/shared/buildTypes.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd run build`

## [x] `Model-Viewport-4 / Phase 6` - `Edge Visibility Controls In Shift-D Display Wheel`

### Phase 6 Summary

Separate the viewport's surface fill presentation from edge overlay presentation in the `Shift+D` display wheel.

The user-facing model should be:
- the existing radial display choices remain the viewport/surface fill type:
  - `Wireframe`
  - `Solid`
  - `Material`
  - `Rendered`
  - `Render Preview`
- the center of the `Shift+D` wheel, where it currently says `Display`, gains a small edge-control group:
  - `On`
  - `Off`
  - `Visible edges only`

Current status:
- shipped

Current implementation-read:
- `src/app/components/ViewerHost.tsx`
  - defines the current radial display menu options for `Shift+D`.
  - currently treats display mode as one choice read from `useUiPrefsStore((state) => state.view.displayMode)`.
  - the menu center is currently static text: `Display`.
  - Phase 6 should turn that center area into a compact three-option edge control without removing the current outer/main display choices.
- `src/app/useViewerDisplayModeMenu.ts`
  - owns the open/close/select mechanics for the `Shift+D` display-mode wheel.
  - currently exposes `selectDisplayMode(mode)` only.
  - selecting an outer display mode currently closes the wheel; Phase 6 may keep that behavior for fill mode while allowing center edge choices to update in place.
- `src/shared/viewSettingsTypes.ts`
  - owns `ViewDisplayMode` and persisted/global view settings.
  - Phase 6 likely needs a new view setting for edge visibility mode rather than overloading `displayMode`.
  - legacy `wireframe` is currently derived from `displayMode`, so Phase 6 should not reuse `wireframe` as the new edge setting.
- `src/app/store/uiPrefsStore.ts` and `src/app/store/uiPrefsPersistence.ts`
  - keep `displayMode` and legacy `wireframe` synchronized.
  - need explicit carry-through/normalization proof for the new edge setting.
- `src/app/components/ViewToolbar.tsx`
  - still exposes the older `Wireframe` toggle path through `setViewKey('wireframe', ...)`.
  - Phase 6 must keep that compatibility seam working even if the new `Shift+D` wheel becomes the preferred edge-control surface.
- `src/viewer/Viewer.ts`
  - Phase 3/5 now own semantic and extracted mesh-edge overlays.
  - edge overlay visibility is currently tied mostly to `displayMode === 'wireframe'`.
  - Phase 6 should decouple edge overlay visibility from fill mode.
  - current semantic/extracted edge overlays are attached under the owning mesh, so `Visible edges only` must not simply hide the parent mesh unless overlays move to a visible overlay parent.
- `src/viewer/Viewer.test.ts`
  - already has proof for display-mode application, semantic edge overlays, and mesh-edge fallback overlays.
- `src/app/useViewerDisplayModeMenu.test.tsx`
  - already proves `Shift+D` open/close and display-mode selection.
- `src/app/components/ViewerHost.test.tsx`
  - should own visible radial-menu UI proof for the center edge controls.
- `src/app/store/uiPrefsStore.test.ts`
  - already covers display-mode and legacy wireframe synchronization.
  - should add edge setting defaults, normalization, persistence, and setter proof.

Phase 6 should treat edge visibility as a presentation setting, not geometry truth. It should not change topology packets or geometry generation.

### Phase 6 Implementation Spec

Must lock:
- a new shared edge visibility mode, likely:

```ts
type ViewEdgeDisplayMode = 'on' | 'off' | 'visibleEdgesOnly'
```

- a durable view setting field, likely under `ViewSettings`, so the current edge state can persist and be applied by `Viewer.applyViewSettings(...)`
- default and migration behavior that preserves today's normal read:
  - existing persisted settings without the new field should normalize to `edgeDisplayMode: 'off'` unless the legacy/display state is already `wireframe`
  - existing or selected `Wireframe` display mode should normalize/apply with visible clean edge overlays so the current user-facing wireframe behavior does not disappear
  - `Solid`, `Material`, `Rendered`, and `Render Preview` should not gain surprise edge overlays unless the user turns edges `On` or chooses `Visible edges only`
- the transitional contract:
  - keep the outer `Wireframe` option visible for now because the user already knows it and the current wheel owns that choice
  - treat center edge controls as the new explicit override for whether model edges draw over the current fill mode
  - a later cleanup may rename or reshape the outer `Wireframe` option once the fill/edge split is fully settled
- clear behavior rules:
  - `On`
    - show semantic topology edges where present
    - show extracted mesh-edge fallback where topology edges are missing
    - keep filled surfaces visible according to the selected surface/fill display mode
  - `Off`
    - hide display-mode edge overlays
    - keep selected-object outlines and topology selection highlights visible because those are selection feedback, not edge display mode
  - `Visible edges only`
    - show semantic/extracted edge overlays
    - keep filled mesh surfaces in the active surface/fill mode
    - depth-test edge overlays so edges blocked by surfaces do not show through
    - do not use raw triangle material wireframe
- `Shift+D` UI changes:
  - keep existing display mode options available as the outer/main radial choices
  - replace or augment the center `Display` label with three compact edge controls
  - selected edge option should be visibly active
  - controls should be click/tap reachable without breaking the existing display-mode wheel behavior
  - outer display-mode selection can keep closing the wheel
  - center edge selection should update the setting without needing a second menu open; it may stay open so the user can also choose fill mode in the same wheel session
- viewer display rules:
  - edge overlays should no longer be hard-bound only to `displayMode === 'wireframe'`
  - `Wireframe` may remain a shorthand for a clean edge-focused display combination while the UI is transitional, but the user-facing model should read as separate fill and edge controls
  - edge toggles should be rebuild-free and only affect viewer presentation state
- compatibility rules:
  - `setViewKey('displayMode', 'wireframe')` and the older View Toolbar `wireframe` toggle must continue to produce a useful clean wireframe read
  - changing `edgeDisplayMode` must not mutate geometry results, topology previews, retained bundles, or selected workspace identity
  - selected-part outlines and selected topology edge/point/face highlights are selection feedback and should remain independent from display edge visibility
- focused tests for:
  - view settings normalization defaults the new edge mode deterministically and preserves legacy wireframe reads
  - UI prefs store/persistence carries the edge mode without breaking `displayMode`/`wireframe` synchronization
  - edge `On` shows semantic/extracted edge overlays over Solid mode
  - edge `Off` hides display-mode edge overlays in Wireframe mode while preserving selected-part outline behavior
  - `Visible edges only` shows depth-tested edge overlays over the active fill mode without enabling material triangle wireframe
  - existing `Shift+D` display-mode selection still changes surface/fill mode
  - center edge controls update the shared view setting and active UI state
  - the legacy View Toolbar wireframe toggle still lands in a clean wireframe presentation

Definition of done:
- `Shift+D` lets the user choose both surface fill type and edge visibility.
- The user can see filled surfaces with edges, filled surfaces without edges, or edges only.
- Proper edge overlays remain semantic when topology exists and extracted from mesh edges when topology does not exist.
- Selection highlights remain independent from edge display visibility.

Recommended implementation order:
1. Add the shared edge visibility setting, option list, guard, defaults, clone/normalize support, and tests in `src/shared/viewSettingsTypes.ts` plus existing store tests.
2. Wire the setting through `src/app/store/uiPrefsStore.ts` and `src/app/store/uiPrefsPersistence.ts`, preserving `displayMode`/`wireframe` compatibility.
3. Extend `src/app/useViewerDisplayModeMenu.ts` so the menu can set the edge mode separately from fill/display mode.
4. Update `Viewer.applyViewSettings(...)` and edge overlay visibility helpers so edge display mode controls semantic and mesh-edge overlays independently of surface fill mode.
5. Add the `Visible edges only` depth-tested edge treatment while preserving the current surface/fill presentation.
6. Update the `Shift+D` radial menu UI in `src/app/components/ViewerHost.tsx` to render the three center edge controls with active state.
7. Add focused shared settings, UI prefs, viewer, menu-hook, and radial-menu tests.

Explicit non-goals:
- no new geometry/topology generation
- no raw triangle debug wireframe
- no snapping, measurement, or inspector behavior
- no direct modeling/edit commands
- no changes to result-mode policy such as `Auto / Draft / Final`

### Phase 6 Implementation Notes

- `src/shared/viewSettingsTypes.ts` now owns `ViewEdgeDisplayMode` with `on`, `off`, and `visibleEdgesOnly`, plus option validation, defaults, and normalization.
- `src/app/store/uiPrefsStore.ts` keeps legacy `wireframe` and `displayMode: 'wireframe'` paths mapped to clean edge visibility while allowing the new center edge control to stay independent.
- `src/app/store/uiPrefsPersistence.ts` carries the edge display mode through view-settings persistence and merge policy.
- `src/viewer/Viewer.ts` now decouples semantic/extracted edge overlay visibility from `displayMode === 'wireframe'`.
- `Visible edges only` now keeps the active surface/fill mode intact and depth-tests edge overlays so surfaces hide blocked/back edges.
- `src/app/useViewerDisplayModeMenu.ts` now exposes separate edge-mode selection that does not close the wheel.
- `src/app/components/ViewerHost.tsx` now renders the center Shift+D edge controls for `On`, `Off`, and `Visible edges only` with active-state styling.

Verification:
- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts src/app/useViewerDisplayModeMenu.test.tsx`
- `npm.cmd test -- src/viewer/Viewer.test.ts`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "renders Shift\\+D center edge controls"`
- `npm.cmd test -- src/app/store/useUiPrefsPersistenceBridge.test.tsx src/app/store/scenePresentationEditHistoryReadiness.test.ts`
- `npm.cmd test -- src/app/components/ViewToolbar.test.tsx`
- `npm.cmd run build`
- Browser sanity check confirmed Shift+D opens the display wheel and `Visible edges only` becomes active from the center edge-control group.
- Full-file `npm.cmd test -- src/app/components/ViewerHost.test.tsx` was attempted with a longer timeout but did not finish before timeout; the new targeted ViewerHost case passed.

## [x] `Model-Viewport-4 / Phase 7` - `Edge Display Visual Correctness And Polish`

### Phase 7 Summary

Polish the edge-display modes that Phase 6 exposed so they read like a CAD viewport instead of a debug overlay.

The user-facing target is:
- `Off`
  - no normal display edge overlays
  - selection outlines and selected topology highlights still show
- `On`
  - visible model/display edges draw over the active surface/fill mode
  - this can remain an x-ray-style read where useful
- `Visible edges only`
  - keep the current surface/fill mode
  - draw only edges that are visible from the camera because surfaces block hidden/back edges
  - behave like the Fusion-style screenshot the user provided

Current status:
- shipped

Current implementation-read:
- `src/shared/viewSettingsTypes.ts`
  - now owns `ViewEdgeDisplayMode` and persisted `edgeDisplayMode`.
- `src/app/components/ViewerHost.tsx`
  - now renders the Shift+D center edge controls.
  - Phase 7 should not add or rename these controls.
- `src/viewer/Viewer.ts`
  - semantic and extracted mesh-edge overlays now toggle independently from fill mode.
  - `Visible edges only` currently uses depth-tested line materials.
  - normal `On` currently keeps the through-surface/x-ray edge read.
  - semantic edge overlays and extracted mesh-edge fallback both use line geometry but need a clearer visual hierarchy against selected-object outlines and selected topology highlights.
- `src/viewer/Viewer.test.ts`
  - already proves the core mode toggles.
  - Phase 7 should add focused visual-behavior proof without trying to encode screenshot aesthetics in unit tests.

Phase 7 should be a visual correctness and polish pass. It should not reinterpret the control model again.

### Phase 7 Implementation Spec

Must lock:
- `Visible edges only` means depth-tested display edges over the current fill mode, not transparent surfaces and not an edges-only viewport style.
- `On` means show display edges over the current fill mode and may continue to draw through surfaces.
- `Off` means hide normal display edge overlays while preserving:
  - selected part/object outlines
  - selected face highlights
  - selected edge highlights
  - selected point highlights
- semantic topology edges remain preferred over extracted mesh-edge fallback when topology exists.
- extracted mesh-edge fallback remains a visual fallback, not true B-rep topology.

Visual hierarchy rules:
- normal display edges should be quieter than selected outlines.
- selected object outlines should remain readable over normal edge display.
- selected topology edge and point highlights should remain stronger than normal display edges.
- `Visible edges only` should look like a surface-aware edge read, not like raw triangle wireframe.
- cylinder/curved-surface mesh-only fallback should avoid looking like full tessellation debug mode where possible; if the current `EdgesGeometry` threshold cannot solve that cleanly in this phase, document the remaining limitation and hand it to true semantic topology generation.

Focused implementation targets:
- inspect and tune `LineBasicMaterial` values for:
  - semantic edge overlays
  - extracted mesh-edge fallback overlays
  - selected-part outlines
  - selected topology edge/point highlights
- inspect `EdgesGeometry` creation for mesh-only fallback and decide whether a threshold angle or helper option can reduce curve/cylinder noise without reintroducing hidden rectangle diagonals.
- keep all mode switches rebuild-free unless a threshold change requires overlay recreation during render-layer setup.
- keep overlay depth behavior explicit:
  - `On`: x-ray/through-surface display edges
  - `Visible edges only`: depth-tested visible display edges

Focused tests for:
- `Visible edges only` keeps filled materials unchanged while edge overlay materials are depth-tested.
- `On` keeps edge overlay materials non-depth-tested where that is the intended x-ray read.
- `Off` hides normal display edge overlays without hiding selected outlines.
- topology-backed parts continue to prefer semantic edge overlays.
- mesh-only fallback does not show simple rectangle diagonals.

Manual acceptance:
- sketch rectangle extrude:
  - no internal triangle diagonals in normal user-facing edge display
  - `Visible edges only` hides back/blocked edges behind the face
- overlapping/stacked rectangles:
  - foreground surfaces block background edges in `Visible edges only`
  - `On` still makes all display edges easy to inspect
- cylinder-like mesh:
  - edge display should not feel like raw triangle debug mode
  - any remaining mesh-only curve noise is documented as a topology-generation follow-up, not silently treated as solved
- selected object:
  - selected outline remains visually stronger than normal edge display
- selected edge/point:
  - selected topology entity remains visually stronger than normal display edges

Definition of done:
- Phase 6's three edge controls have a polished visual read.
- `Visible edges only` behaves like a surface-aware visible-edge mode.
- normal edge display, selected outlines, and selected topology highlights are visually distinct.
- mesh-only fallback limitations are honest and documented.
- tests cover the mode semantics that can be unit-tested, and manual acceptance records the screenshot-level checks.

### Phase 7 Implementation Notes

Shipped changes:
- normal display-edge overlays now use dedicated display-edge colors and opacities instead of reusing the selected-object outline blue.
- `On` keeps non-depth-tested x-ray display edges over the current fill mode.
- `Visible edges only` keeps the current material/solid/rendered fill mode and depth-tests display edge overlays so surfaces hide blocked/back edges.
- `Off` hides normal display edge overlays while leaving selected-object outlines and selected topology entity highlights independent.
- mesh-only fallback edge overlays now use a thresholded `EdgesGeometry` extraction to suppress low-angle cylinder-like tessellation seams while preserving hard silhouette/cap rings.

Focused proof added:
- material/fill presentation stays unchanged in `Visible edges only`.
- x-ray `On` and depth-tested `Visible edges only` apply different edge material presentation.
- selected outlines remain visible when display edges are off.
- topology-backed parts still prefer semantic edge overlays over extracted mesh fallback.
- two-triangle rectangle meshes do not show the internal diagonal as a normal edge overlay.
- cylinder-like mesh fallback preserves top/bottom silhouette rings while suppressing side tessellation seams.

Verification:
- `npm.cmd test -- src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- Browser sanity check at `http://127.0.0.1:5173/ParaHook_Configurator/` confirmed the local app loads and exposes the Model Viewport shell.

Manual acceptance read:
- rectangle extrudes should show clean perimeter/model edges rather than triangle diagonals.
- overlapping blocks in `Visible edges only` should hide back/blocked edges behind foreground surfaces.
- `On` remains the inspection mode for through-surface edge visibility.
- cylinder-like mesh-only parts should look less like raw triangle debug wireframe, though true curved-edge topology remains a later topology-generation/import-retention owner.

Recommended implementation order:
1. Audit the current edge/selection line material constants and render orders in `src/viewer/Viewer.ts`.
2. Add or adjust focused `Viewer.test.ts` assertions around edge material depth behavior and selected-outline independence.
3. Tune normal edge overlay materials for `On` and `Visible edges only`.
4. Inspect mesh-only `EdgesGeometry` options/threshold behavior for rectangle and cylinder-like cases.
5. Run focused viewer tests and production build.
6. Do a manual/browser screenshot check for the rectangle, overlap, and cylinder-like reads.
7. Update this phase doc with implementation notes and any honest limitations.

Explicit non-goals:
- no new topology packet fields
- no true sketch/extrude topology generation
- no imported STEP topology extraction
- no new Shift+D controls or labels
- no raw triangle debug mesh mode
- no snapping, measurement, inspector, transform handles, or direct modeling

## [x] `Model-Viewport-4 / Phase 8` - `Hover And Selection Highlight Hierarchy`

### Phase 8 Summary

Build the Fusion-style hover and selection visual language for topology entities and whole bodies.

The user-provided examples lock this visual target:
- point hover:
  - small white/light point marker
  - subtle halo or rim so it reads on dark surfaces
- point selected:
  - blue point marker
- edge hover:
  - white/light thickened edge highlight
  - drawn above normal display edges
- edge selected:
  - blue edge highlight
  - still readable against the active surface material
- surface hover:
  - light/white surface highlight
  - readable border without becoming selected-blue
- surface selected:
  - blue selected face/surface fill
  - readable light border
- body selected:
  - whole body receives a blue selected-body tint
  - model edges remain readable enough to see the form

User rules locked for implementation:
- when a user hovers over a point, white-highlight the point.
- when a user clicks a point, blue-highlight the point.
- when a user hovers over an edge, white-highlight the edge.
- when a user clicks an edge, blue-highlight the edge.
- when a user hovers over a surface, white-highlight the surface.
- when a user clicks a surface, blue-highlight the surface.
- when a user double-clicks an edge, surface, or point, blue-highlight the entire body.
- all highlight colors and glow/intensity values should become a new section in Settings.

Current status:
- shipped

Current implementation-read:
- `src/viewer/Viewer.ts`
  - already creates topology edge and point pick targets from `topologyPreview`.
  - already stores one `selectedTopologyEntity` and draws selected face, edge, and point overlays.
  - selected face currently uses the active outline blue with partial opacity.
  - selected edge and point currently use earlier hard-coded warm colors and should move to the new blue selected styling.
  - object/part selected outlines are currently separate from selected topology overlays.
  - pointer events already route through viewer-owned picking seams, but there is not yet a durable hover topology entity state for point/edge/surface highlight.
- `src/app/components/ViewerHost.tsx`
  - receives `WorkspaceSelectionPick` entries and turns picked topology identity into `SelectedTopologyEntity`.
  - owns the app-side bridge between viewer picks, selected part key, and selected topology entity.
  - Phase 8 likely needs a double-click promotion route that turns a picked topology entity into the owning body/object/part selection.
- `src/shared/viewSettingsTypes.ts`
  - already owns persisted view/presentation settings.
  - Phase 8 should add a nested highlight-style owner here unless implementation finds a narrower existing presentation-settings owner.
- `src/app/store/uiPrefsStore.ts` and `src/app/store/uiPrefsPersistence.ts`
  - already carry view settings and persistence policy.
  - Phase 8 should thread highlight styling through the same owner-backed view-settings path.
- `src/app/workspace/SettingsSurface.tsx`
  - already has a `Viewport` settings section.
  - Phase 8 should add a dedicated viewport highlight/settings group or subsection for colors/glow without making Settings the owner of the setting meaning.

### Phase 8 Implementation Spec

Must lock:
- one hover topology entity state in the viewer or viewer bridge with:
  - point identity
  - edge identity
  - face/surface identity
  - part/body identity
- hover styling:
  - point hover is white/light
  - edge hover is white/light
  - surface hover is white/light
- selected styling:
  - point selected is blue
  - edge selected is blue
  - surface selected is blue
  - body selected is blue whole-body tint/outline
- double-click behavior:
  - double-click point promotes to body selection
  - double-click edge promotes to body selection
  - double-click face/surface promotes to body selection
  - single-click behavior remains sub-entity selection where topology identity exists
- Settings exposure:
  - add a new Settings section/group for viewport highlight styling
  - expose at least the default hover color, selected color, and body-selected color as owner-backed read/write controls if implementation scope allows
  - include glow/intensity values in the settings contract even if the first runtime pass maps them to practical opacity/size/thickness values rather than post-processing glow
- defaults:
  - hover color should default to a light/white read
  - selected color should default to blue
  - body selected color should default to a softer whole-body blue tint
  - surface hover opacity should be lower than surface selected opacity
  - selected edge/point overlays should render stronger than normal display edges
- stacking priority:
  - hovered point/edge renders above selected surface/body tint
  - selected point/edge renders above selected surface/body tint
  - surface hover renders above normal material but below point/edge hover
  - selected surface renders above normal material but below selected point/edge
  - selected body tint should not erase readable model edges
  - normal display edges remain below hover and selected topology highlights

Suggested Settings contract shape:

```ts
type ViewHighlightSettings = {
  hoverColor: string
  selectedColor: string
  bodySelectedColor: string
  hoverGlow: number
  selectedGlow: number
  pointHoverSize: number
  pointSelectedSize: number
  edgeHoverThickness: number
  edgeSelectedThickness: number
  surfaceHoverOpacity: number
  surfaceSelectedOpacity: number
  bodySelectedOpacity: number
}
```

Implementation can adjust exact names after reading local patterns, but the owner should remain under the viewport/view-settings presentation contract.

Focused implementation targets:
- add highlight settings defaults, validation/normalization, clone support, and persistence carry-through.
- add Settings `Viewport` highlight controls/read rows for color and glow/intensity settings.
- add viewer hover-pick state and overlay refresh methods for hovered topology entity.
- update selected topology overlay colors from older hard-coded warm colors to blue defaults from highlight settings.
- add body-selection promotion on double-click from topology picks.
- keep existing click selection and multi-selection behavior intact unless the double-click promotion explicitly replaces the click action.

Focused tests for:
- default highlight settings normalize safely.
- persisted highlight settings carry through view-settings persistence.
- Settings renders the new viewport highlight group/section and writes through the owner-backed view-settings path.
- point hover creates a light/white point overlay.
- point selection creates a blue point overlay.
- edge hover creates a light/white edge overlay.
- edge selection creates a blue edge overlay.
- face/surface hover creates a light/white surface overlay.
- face/surface selection creates a blue surface overlay.
- double-clicking a topology point/edge/face promotes selection to the owning body/part while clearing or superseding sub-entity selection as needed.
- hover overlays clear when the pointer leaves the model or no valid topology target is under the cursor.

Manual acceptance:
- match the Fusion-style screenshots:
  - white point hover
  - blue point selected
  - white edge hover
  - blue edge selected
  - white/gray surface hover
  - blue surface selected
  - whole-body light blue selection after double-click promotion
- verify hover and selected reads over:
  - Solid
  - Material
  - Rendered
  - visible-edges-only edge display
- verify normal display edges remain readable but subordinate to hover/selection highlights.

Definition of done:
- point, edge, and surface hover have a white/light visual read.
- point, edge, and surface click selection have a blue visual read.
- double-clicking any topology sub-entity promotes to whole-body blue highlight.
- Settings exposes a viewport highlight styling section/group backed by the real view-settings owner.
- highlight stacking is deterministic and documented.
- focused tests cover settings ownership, hover/selection overlays, and double-click promotion.

Recommended implementation order:
1. Add `ViewHighlightSettings` defaults and normalization in `src/shared/viewSettingsTypes.ts`.
2. Carry highlight settings through UI prefs persistence.
3. Add Settings `Viewport` highlight read/write controls.
4. Add viewer hover topology entity state and hover overlay refresh methods.
5. Retune selected face/edge/point overlays to use the new blue selected defaults.
6. Add double-click topology promotion to body/part selection.
7. Add focused unit tests and viewer tests.
8. Run focused tests, production build, and browser/manual screenshot sanity.

Explicit non-goals:
- no new topology packet generation
- no imported STEP topology extraction
- no direct modeling or topology editing
- no snapping, measurement, or transform-handle behavior
- no topology inspector/detail panel
- no new raw triangle debug display mode
- no change to the Phase 6 edge-display controls

### Phase 8 Implementation Notes

Implementation result:
- `ViewSettings.highlights` now owns normalized hover, selected, and whole-body highlight colors plus glow, point size, edge thickness, and face/body opacity values.
- Settings `Viewport` now exposes the highlight color and intensity controls while leaving the meaning of those values with the model-viewport/view-settings contract.
- `Viewer` now tracks hovered topology entities separately from selected topology entities and draws white/light hover overlays for points, edges, and faces.
- selected point, edge, and face overlays now read from the blue selected highlight settings instead of the earlier hard-coded warm colors.
- double-clicking a topology point, edge, or face routes through the workspace selection pick contract with `doubleClick: true`, clearing the sub-entity selection and promoting the selected part/body overlay.
- whole-body selection now draws a soft blue body tint when a part is selected without a selected topology sub-entity.

Verification:
- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts`
- `npm.cmd test -- src/app/workspace/SettingsSurface.test.tsx`
- `npm.cmd test -- src/viewer/Viewer.test.ts`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "promotes double-clicked topology picks"`
- `npm.cmd run build`
- `git diff --check`
- Full `npm.cmd test -- src/app/components/ViewerHost.test.tsx` was attempted twice and timed out without returning output; the focused double-click regression passed.

## [x] `Model-Viewport-4 / Phase 9` - `Sketch Extrude Topology Preview Generation`

### Phase 9 Summary

Make graph-authored sketch > extrude results produce the semantic topology packet that the viewport already knows how to consume.

Phase 8 shipped the hover/selection language, but that language only works on real topology entities when the visible geometry includes `topologyPreview`. The current sketch/extrude result path can still display clean fallback edges, but it does not yet provide semantic faces, edges, and points for a rectangle extrude to behave like a CAD body in hover and click selection.

Current status:
- shipped

Current implementation-read:
- `src/shared/geometryResult.ts`
  - already defines `GeometryTopologyPreview`, `faces`, `triangleFaceIds`, `edges`, and `points`.
  - already validates and clones topology packets when provided.
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already forwards `geometryResult.topologyPreview ?? null` into `toViewerRenderablePart(...)`.
  - no new viewer bridge is needed if the result producer starts filling the packet.
- `src/viewer/Viewer.ts`
  - already consumes topology previews for semantic face hit resolution, semantic edge overlays, edge/point pick targets, hover highlights, selected topology highlights, and double-click body promotion.
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - currently creates authoritative geometry result bundles from `preview.bodies`, `preview.mergedMesh`, diagnostics, trace, and authoritative handle.
  - it does not currently pass `topologyPreview`, so authoritative sketch/extrude geometry remains mesh-only from the viewport topology perspective.
- `src/worker/products/foothook/buildFoothook.ts`
  - currently creates draft geometry result bundles without `topologyPreview`, so draft/fallback geometry remains mesh-only.
- `src/worker/cad/featureStackRuntime.ts`
  - owns the live feature-stack preview path.
  - `runSketch(...)` stores resolved profile wires after `wireFromLoop(...)` normalizes profiles counter-clockwise and removes closing duplicate vertices.
  - `runExtrude(...)` resolves sketch/profile selection, chooses one-side/two-sides/symmetric start/end depth, creates one or more extruded `Shape3D` values, stores bodies, and returns a merged preview through `mergeBodies(...)`.
  - `ExecuteFeatureStackResult` currently returns bodies, merged mesh, diagnostics, and trace, but no topology packet.
- `src/worker/cad/cadKernelAdapter.ts`
  - owns the simple mesh creation order for graph-native extrudes.
  - `extrudeMesh(...)` creates bottom-loop vertices first, top-loop vertices second.
  - capped extrudes emit bottom cap triangles first, top cap triangles second, then two side triangles per profile segment.
  - this ordering is the strongest first seam for building `triangleFaceIds` deterministically.
  - `mergeMeshPacks(...)` appends meshes in order and offsets vertex indices, so merged topology needs matching triangle/id and vertex-position offset rules.
- `src/worker/cad/cadTypes.ts`
  - `MeshPack` currently carries only `vertices` and `indices`.
  - Phase 9 may either add an internal topology-bearing shape/mesh result beside `MeshPack`, or add a helper that returns `{ mesh, topology }` without exposing topology through the generic mesh type.
- `src/worker/cad/featureStackRuntime.test.ts`
  - already has rectangle extrude fixtures and `executeFeatureStack(...)` tests, making it the best first place for six-face/twelve-edge/eight-point proof.

### Phase 9 Implementation Spec

Must lock:
- one producer-side topology construction seam for graph-authored sketch/extrude geometry.
- first supported shape:
  - capped polygonal extrudes from a single closed profile loop.
  - rectangle extrudes must be covered.
  - arbitrary simple polygon loops may be supported if the implementation follows the same deterministic loop/triangle ordering without extra risk.
- unsupported first-pass cases:
  - uncapped `Walls` extrudes may remain mesh-only.
  - aggregate extrusions from multiple profiles may remain mesh-only unless the implementation can merge topology honestly in the same pass.
  - invalid profiles, duplicate ids, or ambiguous profile results must stay mesh-only/null topology.
- topology generation for simple closed sketch profiles where the mesh construction can map triangles to:
  - front cap face
  - back cap face
  - one side face per profile segment
- deterministic ids scoped to the result:
  - body id should match the emitted geometry body id.
  - face ids should include enough profile/feature/body context to stay stable within the current result.
  - edge ids should identify cap perimeter and side/vertical edges.
  - point ids should identify extruded profile vertices.
- `triangleFaceIds` should line up with the emitted merged mesh triangle order, or the implementation must add the mapping at the per-body mesh stage before merge.
- edge polylines should use the same coordinate space as the emitted preview mesh.
- point positions should use the same coordinate space as the emitted preview mesh.
- cap/side ordering should follow the live `extrudeMesh(...)` order unless the implementation explicitly changes and proves that order:
  - bottom cap triangles: `n - 2`
  - top cap triangles: `n - 2`
  - side triangles: `2 * n`
  - total triangles for capped polygon loop: `(n - 2) * 2 + 2 * n`
  - rectangle total: `12` triangles, with `2` bottom cap, `2` top cap, and `8` side triangles.
- a rectangle extrude should produce:
  - `6` faces.
  - `12` edges.
  - `8` points.
  - `12` `triangleFaceIds`.
- honest fallback:
  - unsupported profile shapes should keep `topologyPreview: null`.
  - invalid or ambiguous topology should not be invented.
  - mesh display should keep working even when topology cannot be emitted.

Focused implementation targets:
- add a worker/cad helper that derives topology from the same loop, plane, plane transform, depth, body id, feature id, and part key used to create the extrude mesh.
- prefer building topology beside `extrudeMesh(...)` or immediately after it while the loop vertex count and triangle order are still local and obvious.
- add a small topology merge helper if more than one supported shape can contribute to the final merged mesh.
- thread the produced topology into `createDraftGeometryResultBundle(...)` and/or `createAuthoritativeGeometryResultBundle(...)` through the result-building seam.
- extend `ExecuteFeatureStackResult` with `topologyPreview: GeometryTopologyPreview | null`.
- pass `preview.topologyPreview` into the authoritative result bundle in `src/worker/authoritative/buildAuthoritativeGeometry.ts`.
- if a draft feature-stack result path also uses `executeFeatureStack(...)`, pass the same topology into its draft result bundle.
- add focused tests for a rectangle sketch extrude:
  - six semantic faces.
  - twelve semantic edges.
  - eight semantic points.
  - `triangleFaceIds` maps cap and side triangles to the expected face ids.
  - viewport renderable part receives non-null topology.
- add one viewer or selector integration proof that rectangle extrude face picking resolves to a semantic face id instead of plain part-only selection.
- keep the implementation localized to worker/cad topology production and result-bundle carry-through unless a test reveals a real selector/viewer contract gap.

Manual acceptance:
- draw a rectangle in Sketch and extrude it.
- hover one rectangle face and confirm the whole face highlights white/light.
- click one rectangle face and confirm the whole face highlights blue.
- hover/click a rectangle edge and confirm the whole edge highlights.
- hover/click a rectangle corner point and confirm the point highlights.
- double-click a face, edge, or point and confirm the whole extruded body receives the body selected tint.
- confirm normal display/wireframe edges still do not expose the internal triangle diagonal.

Definition of done:
- a simple sketch > extrude rectangle produces semantic topology in the result bundle.
- the existing viewport hover/selection system can operate on that rectangle's faces, edges, and points.
- unsupported sketch/extrude cases remain honest mesh-only results instead of fake topology.
- focused tests prove producer topology, result forwarding, and at least one viewport-facing semantic pick path.
- authoritative bundle creation carries the produced topology instead of dropping it.

Recommended implementation order:
1. Add internal topology construction for capped polygon extrudes in the worker/cad layer.
2. Extend `ExecuteFeatureStackResult` with nullable `topologyPreview`.
3. Merge topology in the same deterministic order as `mergeBodies(...)` / `mergeMeshPacks(...)`.
4. Thread topology through authoritative and any draft feature-stack result bundle creation.
5. Add `featureStackRuntime.test.ts` proof for rectangle topology counts, ids, and `triangleFaceIds`.
6. Add selector proof that the viewport render part receives topology from a geometry result.
7. Add focused viewer semantic-pick proof only if producer/selector proof does not exercise the viewport contract enough.
8. Run focused worker/cad, authoritative, selector, viewer, and build verification.

Likely verification:
- `npm.cmd test -- src/worker/cad/featureStackRuntime.test.ts`
- `npm.cmd test -- src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
- `npm.cmd test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd test -- src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`
- `git diff --check`

### Phase 9 Implementation Notes

Implementation result:
- `executeFeatureStack(...)` now returns a nullable `topologyPreview` sidecar beside `mergedMesh`.
- simple capped graph-authored sketch extrudes now derive semantic faces, triangle face ownership, edge polylines, and point positions from the same projected profile loop and extrusion depth used by the preview mesh.
- rectangle extrudes now produce six faces, twelve edges, eight points, and twelve triangle face ids in the same bottom-cap, top-cap, then side-triangle order as the mesh.
- merged topology follows the same sorted body order as merged mesh previews, with unsupported bodies contributing `null` triangle ownership instead of invented topology.
- uncapped `Walls` extrudes and aggregate multi-profile extrusions remain honest mesh-only results.
- draft foothook feature-stack bundles and authoritative geometry bundles now carry the produced topology preview through to viewport selector renderable parts.
- the artifact-preview selector path now projects retained topology onto matching visible preview artifacts, covering the normal Auto/draft path where the viewport may render `PartArtifact` previews instead of the retained geometry-result preview directly.

Verification:
- `npm.cmd test -- src/worker/cad/featureStackRuntime.test.ts`
- `npm.cmd test -- src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
- `npm.cmd test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd test -- src/viewer/Viewer.test.ts`
- `npm.cmd run build`
- `git diff --check`

Explicit non-goals:
- no changes to Phase 8 highlight styling or Settings controls.
- no new Shift+D edge controls.
- no imported STEP topology extraction.
- no global cross-rebuild B-rep naming stability promise.
- no curved-surface analytic topology naming beyond what the current simple sketch/extrude producer can map honestly.
- no raw triangle debug display mode.
- no snapping, measurement, inspector/detail panel, direct modeling, or topology editing commands.
