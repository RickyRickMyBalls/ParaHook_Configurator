## [ ] - `3.2B-SketchPlane-2-Cleanup` - `Main Viewport Integration And First-Pass Workflow Cleanup`

### Header

Purpose:
- clean up the first `3.2B-2` implementation so the sketch-plane pick flow reads as one honest main-model-viewport workflow instead of a mixed prototype with leftover faux-viewport UI

Owns:
- return the sketch-plane session toolbar/chrome to the earlier compact title-bar language, including the sketch-plane accent color keyed from the live sketch-plane pin color
- remove the visual feeling that `Pick In Viewport` opens a second mini viewport inside the overlay
- move sketch-plane preview responsibility back onto the real main model viewport instead of relying on a boxed preview/stage panel
- keep the compact `Spaghetti Editor` shell and the active pick controls, but make the main viewer the obvious working surface
- render the first honest main-viewport origin-pick composition:
  - sketch origin gizmo at the world origin
  - three ghost origin planes/boxes in the viewport
  - direct click targets on those ghost planes
- tighten draft-versus-committed ownership so active sketch-plane session edits remain temporary until confirm across the full `SketchPlane` surface
- clean up prototype/dev-only seams from the first cut, including temporary console affordances, temporary wording, and any now-obsolete overlay-picker remnants
- normalize the first-pass session layout so:
  - toolbar/shell controls stay compact
  - preview and ghost-plane/grid cues belong to the main viewport
  - transform adjustment feels attached to the same placement session
- audit whether the session should keep overlay slider controls for move/rotate, or whether the next honest step is to hand off to a true shared viewer gizmo surface
- reduce duplicate or conflicting source-pick UI so there is one clear `Pick In Viewport` path and one clear `SketchPlane` session state

Cleanup findings from the current first pass:
- the repo now has a real viewport-first `sketchPlanePickSession`, but the current UI still renders a faux stage/preview box in the overlay that can read like a second viewport
- the current session toolbar language drifted away from the earlier compact sketch-plane title-bar treatment and should be pulled back toward that simpler accent-bar style
- the first pass successfully collapses the `Spaghetti Editor` shell, but the pick experience still needs a stronger separation between:
  - compact session controls
  - main model viewport preview
- the current first pass does not yet match the intended main-viewport composition of:
  - central origin gizmo
  - three clickable ghost origin planes
  - one compact control block off to the side
- the first pass uses temporary draft state for picked plane, translation, and rotation, but the wider `SketchPlane` row still needs a stricter cleanup pass so all session-visible values clearly behave as draft-only until confirm
- temporary console affordances like console `x` are acceptable for development, but should be kept explicitly temporary and not become the permanent primary workflow
- the current first cut should be treated as the foundation, not the finished viewport interaction language

Recommended acceptance target for this cleanup phase:
- entering `Pick In Viewport` clearly uses the main model viewport as the working surface
- the user no longer perceives a second embedded viewport or boxed mini-view as the actual plane-picking canvas
- previewed plane boxes, ghost planes, and grid cues read as viewer overlays, not as a separate internal panel
- the sketch-plane toolbar returns to a compact title-bar treatment with the sketch-plane accent color instead of reading like a large detached secondary window
- the user sees the intended first origin-pick layout:
  - sketch origin gizmo in the model viewport
  - three ghost origin planes at the origin
  - a compact side control block rather than a faux internal viewport
- the active session keeps one clean control surface for:
  - plane choice
  - move
  - rotate
  - confirm / cancel
- draft sketch-plane values stay temporary until `Done / Enter`
- obsolete legacy picker UI and mixed prototype seams are removed or clearly retired

Important rule:
- this cleanup phase still belongs to `3.2B-2` territory
- do not let it absorb `3.2B-3` geometry-driven face/edge picking
- do not let it absorb the later generic transform-tool architecture either
- the goal here is to make the first viewport-first origin-plane workflow honest, not to expand scope

### Questions / Decisions

#### [ ] - `q1` Keep this cleanup phase focused on honesty and integration, not scope expansion.

##### Suggestion
- yes
- use this phase to clean up the real viewer ownership, toolbar honesty, and draft-versus-committed behavior
- do not let it absorb `3.2B-SketchPlane-3` geometry-pick scope

### Implementation Spec

### `3.2B-SketchPlane-2-Cleanup` - `Implemented Cleanup Plan`
#### `3.2B-SketchPlane-2-Cleanup` - `Main Viewport Integration And First-Pass Workflow Cleanup`

##### Summary
Refactor the shipped `3.2B-2` sketch-plane pick flow so it reads as one honest main-model-viewport workflow.

Keep the current single `sketchPlanePickSession`, the collapsed `Spaghetti Editor` shell, explicit `Done` / `X`, `Enter` / `Esc`, and draft-until-confirm behavior. Remove the faux embedded â€œstageâ€ / mini-viewport treatment. The main viewer becomes the clear picking surface, with:
- a viewport-resident origin gizmo/axis anchor
- three clickable ghost origin planes at world origin
- one compact right-side sketch-plane control dock
- no second internal panel pretending to be the viewport

##### Key Changes
###### Viewer / Overlay
- Remove the boxed `.ViewportOverlaySketchPlaneStage` and `.ViewportOverlaySketchPlanePreview` composition entirely.
- Render the first honest origin-pick composition directly in the main viewport overlay:
  - world-origin anchor
  - `X / Y / Z` axis cues
  - three ghost origin planes for `XY / XZ / YZ`
  - direct click targets on those planes
- Keep the viewer interaction origin-plane-only for this cleanup. Do not add face/edge picking here.
- Treat the viewport gizmo in this cleanup as a viewer-owned origin/plane overlay, not a full generalized draggable 3D transform manipulator.

###### Compact Control Dock
- Replace the current large detached session chrome with one compact right-side dock.
- Restore the earlier sketch-plane title-bar language:
  - compact title/header
  - sketch-plane accent keyed from the live pin color
  - lighter chrome, not a large secondary window
- Keep these controls in the right dock:
  - current plane summary
  - `XY / XZ / YZ` state reflection
  - `Move / Rotate` mode toggle
  - move sliders
  - rotate sliders
  - `Done`
  - `X`
- Keep move/rotate as side controls for this cleanup pass. Do not move them fully into an in-viewport manipulator yet.

###### Session Ownership
- Keep one canonical `sketchPlanePickSession`; do not add a second session model.
- During an active pick session, all session-visible sketch-plane values must resolve from draft state first, committed feature state second.
- Nothing commits until `Done` or `Enter`.
- `X`, `Esc`, and hidden/developer console `x` all cancel through the same path.
- Keep console trace logging for:
  - session started
  - plane selected
  - move
  - rotate
  - confirmed
  - cancelled
- Keep console `x` hidden/dev-only; do not surface it as primary UX.

###### UI / Cleanup Boundaries
- Remove obsolete legacy picker remnants and any mixed â€œold popup vs new sessionâ€ seams.
- Keep the collapsed spaghetti shell behavior exactly as the current window-level collapsed mode.
- Do not expand scope into:
  - face picking
  - edge picking
  - geometry validity rules
  - generic transform-tool architecture
  - browser/expose work

##### Test Plan
- Starting `Pick In Viewport` still collapses the active spaghetti window into the real header-only shell.
- The old faux stage/preview box no longer renders.
- The main viewport session renders:
  - origin anchor
  - axis cues
  - three ghost origin planes
- Clicking a ghost plane updates draft plane state and advances the session into adjust mode.
- The compact right-side dock renders the compact sketch-plane title bar with active controls.
- Move/rotate controls still edit only draft values.
- `Done` commits draft plane and transform.
- `X`, `Esc`, and hidden console `x` all cancel without committing.
- After cancel/confirm, the extra ghost-plane/grid/session overlay content is removed cleanly.
- Existing `NodeView` / store tests continue to pass for draft-vs-committed behavior.

##### Assumptions And Defaults
- Control surface placement: fixed compact right-side dock in the main viewport.
- Move/rotate interaction: keep side controls for this cleanup pass.
- Console behavior: keep session logs and keep `x` as hidden/dev-only.
- Toolbar style: restore the earlier compact sketch-plane title-bar language with pin-color accent.
- â€œGizmo nowâ€ means a viewport-resident origin/plane overlay now, not full transform-tool unification now.



