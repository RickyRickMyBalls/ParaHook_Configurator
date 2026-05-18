# `Model-Viewport-4` - `Semantic Topology Display And Selection`

## Doc Header

### Doc History
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
