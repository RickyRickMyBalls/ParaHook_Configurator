## [ ] - `3.2B-DrawSketch-6` - `Endpoint Snap`

### Header

Purpose:
- extend the current origin-only snap behavior so active draw tools can lock onto committed sketch endpoints like a first real object-snap pass

Owns:
- endpoint candidate collection from committed sketch content
- hover/confirm snap behavior for endpoint targets
- endpoint snap marker/status language
- reuse of the same snap path across `Line`, `PLine`, `Rectangle`, and `Circle`

### Questions / Decisions

#### [x] - `q1` Decide the first endpoint candidate set.

##### Suggestion
- locked direction:
- include:
  - line endpoints
  - polyline segment endpoints
  - rectangle corners
  - the existing origin snap
- do not include yet:
  - midpoint
  - center
  - tangent
  - intersection
  - tracking/inference-only guides

#### [x] - `q2` Decide whether endpoint snap should be tool-specific or shared across the active point-placement tools.

##### Suggestion
- locked direction:
- shared
- any active point-placement tool should be able to consume endpoint snaps when it is asking for the next point

### Implementation Spec

- current code truth:
  - `GeometrySketchDrawHelper` already has:
    - a visible snap marker
    - origin snap search
  - `geometrySketchSession.drawDraft.hoverSnapTarget` is still limited to:
    - `origin`
- current gap:
  - there is no candidate gathering or session typing for committed sketch endpoints yet
- first honest runtime target:
  - while a point-based draw command is active, the hover point should snap to the nearest qualifying endpoint inside the existing snap radius
  - the snap marker should move onto that endpoint
  - confirm should commit the snapped coordinate through the same canonical point-confirm seam already used by click and typed `Vec2`
  - origin snap should keep working as it does today
- nearest-candidate choice should stay deterministic:
  - use nearest endpoint in screen-space within the active snap radius
- likely runtime ownership remains near:
  - `src/viewer/sketch/GeometrySketchDrawHelper.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/viewer/geometrySketchOverlay.ts`
- this phase should not add:
  - midpoint snap
  - center snap
  - tangent/perpendicular snap
  - full inference/tracking overlays
  - constraint solving

### Acceptance Checks

- active `Line` placement can snap to an existing committed endpoint
- active `PLine` placement can continue from an existing committed endpoint
- rectangle corners participate as snap targets
- `Circle` center and edge placement can consume endpoint snaps from existing sketch geometry
- origin snap still works after endpoint snap is added
